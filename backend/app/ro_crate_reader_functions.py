from genericpath import exists
import json
import os
import git
import requests, tempfile, shutil, subprocess, stat, numpy 
import uuid
from rocrate.rocrate import ROCrate
from abc import abstractmethod

# helper functions to read an rocrate
def on_rm_error(func, path, exc_info):
    #from: https://stackoverflow.com/questions/4829043/how-to-remove-read-only-attrib-directory-with-python-in-windows
    os.chmod(path, stat.S_IWRITE)
    os.unlink(path)

class rocrate_helper:
    def __init__(self, rocratepath):
        self.ro_path = rocratepath
        self.all_metadata = []
        try:
            response = requests.get(self.ro_path)
            tpdir = tempfile.mkdtemp()
            print(tpdir)
            git.Repo.clone_from(self.ro_path, os.path.join(tpdir))
            for filename in os.listdir(tpdir):
                print(filename)
                if filename == "ro-crate-metadata.json":
                    self.ro_metafile = os.path.join(tpdir, filename)
                    with open(os.path.join(self.ro_metafile), "r+")as file:
                        self.ro_metadata = json.load(file)
                        self.all_metadata.append({"location":"root","data":self.ro_metadata})
            try:
                #delete the folder where the project was stored
                shutil.rmtree(tpdir)
            except:
                for i in os.listdir(tpdir):
                    if i.endswith('git'):
                        tmp = os.path.join(tpdir, i)
                        # We want to unhide the .git folder before unlinking it.
                        while True:
                            subprocess.call(['attrib', '-H', tmp])
                            break
                        shutil.rmtree(tmp, onerror=on_rm_error)
                shutil.rmtree(tpdir)
        except:
            #check if there is a rocratemetadata.json file in the ro_path
            for filename in os.listdir(self.ro_path):
                print(filename)
                if filename == "ro-crate-metadata.json":
                    self.ro_metafile = os.path.join(self.ro_path, filename)
                    with open(os.path.join(self.ro_metafile), "r+")as file:
                        self.ro_metadata = json.load(file)
                        self.all_metadata.append({"location":self.ro_path,"data":self.ro_metadata})
                    
    def read_metafile(self):
        for key, item in self.ro_metadata.items():
            print(key,item)
    
    def get_all_metadata_files(self):
        for part in self.ro_metadata['@graph']:
            if "ro-crate-metadata.json" in part["@id"]:
                #if https://github.com in the url replace with https://raw.githubusercontent.com/
                if "https://github.com" in part["@id"]:
                    base =  part["@id"]
                    togeturl = base.replace("https://github.com","https://raw.githubusercontent.com/")
                    togeturl = togeturl.replace("/blob","")
                    r = requests.get(url = togeturl)
                    # extracting data in json format
                    data = r.json()
                    self.all_metadata.append({"location":togeturl,"data":data})
                    self.check_child_metadata(data)
    
    def check_child_metadata(self,tocheck):
        for part in tocheck['@graph']:
            if "ro-crate-metadata.json" in part["@id"]:
                #if https://github.com in the url replace with https://raw.githubusercontent.com/
                if "https://github.com" in part["@id"]:
                    base =  part["@id"]
                    togeturl = base.replace("https://github.com","https://raw.githubusercontent.com/")
                    togeturl = togeturl.replace("/blob","")
                    r = requests.get(url = togeturl)
                    # extracting data in json format
                    data = r.json()
                    self.all_metadata.append({"location":togeturl,"data":data})
                    self.check_child_metadata(data)
        
    def get_overview_metadata(self):
        for i in self.all_metadata:
            print(i)    
    
    def get_ttl_files(self):
        self.ttlinfo = ""
        for i in self.all_metadata:
            for part in i["data"]["@graph"]:
                if ".ttl" in part["@id"]:  #TODO: go through graph of the file itself and see if the graph declares itself as a shacl file
                    togeturl = i["location"].replace("ro-crate-metadata.json",part['@id'])
                    r = requests.get(url = togeturl)
                    self.ttlinfo = self.ttlinfo + r.text
        return self.ttlinfo
    
    
class GitRepoCache:
    """The beast that manages the content of webtop workspace/gitrepocache"""
    
    def __init__(self, root_folder):
        """:param root_folder: points to the root_folder of all the git checked out git repositories (of profiles, seed-crates, etc)"""
        self.root_folder = root_folder

    def get_content_location_for(self, repo_url):
        """return the physical location of the local repo checkout of the given repo_url"""
        #TODO 1: convert repo url to local folder https://github.com/cedricdcc/dmbon_test_profile_crate.git
        repo_folder = self.repo_url_to_localfolder(repo_url)
        #     2: check if local folder exists
        if(os.path.exists(repo_folder) == False):
        #    2a: if not convert repo url to ssh url and git clone  git@github.com:usergit/repo_name.git
            repo_ssh_url = self.repo_url_to_git_ssh_url(repo_url)
            git.Repo.clone_from(repo_ssh_url, repo_folder)
        #    2b: if yes step into the folder and perform git status + if required git pull
        else:
            repo = git.Repo(repo_folder)
            origin = repo.remote(name='origin')
            try:
                origin.pull()
            except Exception as e:
                print(e)
        #     3: return local folder to location needed
        return(repo_folder)
    
    @staticmethod
    def repo_url_to_git_ssh_url(repo_url):
        repo_owner  = repo_url.split("github.com/")[-1].split("/")[0]
        repo_name   = repo_url.split("/")[-1].split(".git")[0]
        return("git@github.com:"+repo_owner+"/"+repo_name+".git")
    
    @staticmethod
    def repo_url_to_localfolder(repo_url):
        repo_owner  = repo_url.split("github.com/")[-1].split("/")[0]
        repo_name   = repo_url.split("/")[-1].split(".git")[0]
        return(os.path.join(os.getcwd(),'app','webtop-work-space' ,'cache' ,repo_owner+"_"+repo_name))
    

class MakeNewProfile:
    """Class to manage incoming profile data and save it in the cache folder"""   
    
    def __init__(self, profile_id, repo_url, logo, description):
        self.profile_name = profile_id
        self.repo_url   = repo_url
        self.logo = logo
        self.description = description
        self.evaluated_repos = []
        self.seed_dependencies = []
        self.profile_id = uuid.uuid4().hex
        self._get_metadata_profiles()
        self.location_init_repo = self._download_repo(repo_url = self.repo_url)
        self.get_rocrate_metadata_git_urls(rocrate_metadata_location= os.path.join(self.location_init_repo,"ro-crate-metadata.json"))
        
        toupdatemetadata = {
            "name_profile"  : self.profile_name,
            "logo"          : self.logo,
            "description"   : self.description,
            "url_ro_profile": self.repo_url,
            "seed_dependencies"   : list(numpy.unique(self.seed_dependencies))
        }
        
        self.metadata_cache[self.profile_id] = toupdatemetadata
        self._write_metadata_profiles()
    
    #TODO 1  : get the metadata of the profiles 
    def _get_metadata_profiles(self):
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'profiles.json')) as json_cache_file:
            self.metadata_cache = json.load(json_cache_file)
    
    #     2  : download the repo from the the repo _url given and add repo url to metadata_cache
    def _download_repo(self, repo_url):
        to_put_in = GitRepoCache(os.path.join(os.getcwd(),'app','webtop-work-space' ,'cache'))
        if(repo_url not in self.seed_dependencies):
            self.seed_dependencies.append(repo_url)
        return to_put_in.get_content_location_for(repo_url)
    
    #     3  : add repo urls to seed dependencies
    #     4a : if there is a ro-crate-metadata.json check if there are any other repo urls in the @graph
    def get_rocrate_metadata_git_urls(self, rocrate_metadata_location):
        with open(rocrate_metadata_location) as metadata_file:
            rocrate_metadata = json.load(metadata_file)
        
        #check metadata file for other git repos
        for files_to_check in rocrate_metadata["@graph"]:
            if(".git" in files_to_check["@id"] or "git@github.com" in files_to_check["@id"]):
                self.seed_dependencies.append(files_to_check["@id"])
                
        #     4a: if yes do reciproce check that downloads the repo and checks the ro-crate-metadata.json for repo urls in the @graph
        for repo_url_git in self.seed_dependencies:
            print(repo_url_git)
            new_repo_location = self._download_repo(repo_url = repo_url_git)
            print('new repo location == ', new_repo_location)
            assert(len(self.evaluated_repos) != len(self.seed_dependencies))
            if(repo_url_git not in self.evaluated_repos):
                if(os.path.exists(os.path.join(new_repo_location,"ro-crate-metadata.json"))):
                    self.evaluated_repos.append(repo_url_git)
                    self.get_rocrate_metadata_git_urls(rocrate_metadata_location= os.path.join(new_repo_location,"ro-crate-metadata.json"))        
    
    #     5: save the new metadata in the profiles
    def _write_metadata_profiles(self):
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'profiles.json'), 'w') as json_file:
            json.dump(self.metadata_cache, json_file)
    
    
#class for new space creation
class MakeSpace:
    
    def __init__(self, space_name, repo_url, profile, storage_path):
        self.space_name = space_name
        self.repo_url = repo_url
        self.profile = profile
        self.storage_path = storage_path
        self.space_uuid = uuid.uuid4().hex
        self.remoterepo = False
    
    def _check_remote_repo(self):
        pass
    
    #TODO what if remote repo isn't following template that is given?
    
    def _make_workspace(self):
        #make folder where the workspace stuff should go into based on uuid
        #get all the repos that are going to be used by the profile
        #copy the contents of all the repos, excluding the .git folder to the workspace folder
        #TODO what to do with files that have the same name? txt combine or ttl combine?
        #save the location of the workspace folder in self to be used to write the new space in the spaces.json 
        pass
    
    def _get_remote_repo(self):
        git.Repo.clone_from(self.repo_url, os.path.join(self.storage_path,self.space_name))
        
    def _make_repo(self):
        currentwd = os.getcwd()
        os.mkdir(os.sep.join(self.storage_path,self.space_name))
        os.chdir(os.sep.join(self.storage_path,self.space_name))
        repo = git.Repo.init(os.path.join(self.storage_path,self.space_name))
        #change current wd to init the rocrate
        crate = ROCrate() 
        crate.write_crate(os.path.join(self.storage_path,self.space_name))
        os.chdir(currentwd)
        
    def _save_metadata(self):
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'spaces.json')) as json_cache_file:
            self.metadata_cache = json.load(json_cache_file)
            
        toupdatemetadata = {
            "name_space"  : self.name_space,
            "RO_profile": self.profile,
            "repo_path" : os.path.join(self.storage_path,self.space_name),
            "workspace_path": os.path.join(os.getcwd(),'app',"webtop-work-space","spaces",self.space_uuid)
        }
        
        self.metadata_cache[self.space_uuid] = toupdatemetadata
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'spaces.json'), 'w') as json_file:
            json.dump(self.metadata_cache, json_file)
         
#test = MakeNewProfile(profile_id="test_new_method", logo="https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png" ,description= "test of the new method", repo_url="https://github.com/arms-mbon/my_bon_test_vlizrepo_crate.git")
'''
#test zone              
test = rocrate_helper("C:\\Users\\cedric\\Desktop\\no importante\\ad117931652f4dccb6ef0bb3b3393cc2\\project")
test.read_metafile()
test.get_overview_metadata()

secondtest = rocrate_helper('https://github.com/cedricdcc/test_rocrate_repo.git')
secondtest.get_all_metadata_files()
secondtest.get_ttl_files()
print(secondtest.ttlinfo)
'''   




























class Profile:
    """ Class to represent a selectable profile for data spaces.
        This class tracks and manages/caches incomming profile data 
        retrieved from github repos.
        
        :param profile_id: str
        :param repo_url: str
        :param logo : str
        :param description: str
    """   
    
    def __init__(self, name, repo_url, logo, description, uuid= None, seed_dependencies= None):
        self.name = name
        self.repo_url = repo_url
        self.logo = logo
        self.description = description
        self.seed_dependencies = seed_dependencies
        if uuid is None:
            self.uuid = uuid.uuid4().hex
            self.detect_dependencies()
            self.write()
            #self.location_init_repo = self._download_repo(repo_url = self.repo_url)
            #self.get_rocrate_metadata_git_urls(rocrate_metadata_location= os.path.join(self.location_init_repo,"ro-crate-metadata.json"))
    def as_init_dict(self):
        """ create a dict respresentation of self that can be **expanded into the arguments to __init__() 
            this duplicates as the dict entry for profiles.json 
        """
        return dict(name=self.name,
                    repo_url=self.repo_url,
                    logo=self.logo,
                    description=self.description,
                    uuid= self.uuid,
                    seed_dependencies=self.seed_dependencies
                )
               
    @staticmethod
    def load(uuid :str):
        """loads and creates a profile object found in the profiles.json
        :param uuid: uuid of the profile
        :type  uuid: str
        :return: the found profile in json 
        :rtype: Profile
        :raises KeyError: the supplied key was not found in the profiles.json file
        """
        #get metadata profiles 
        profiles_dict = Profile._read_profiles()
        
        return Profile(**profiles_dict[uuid])
    
    @staticmethod
    def load_all():
        """creates a dictionary by uuid of all known profiles"""
        profiles_dict = Profile._read_profiles()
        return {uuid:Profile(**profiles_dict[uuid]) for uuid in profiles_dict}
    
    def write(self):
        profiles_dict = Profile._read_profiles()
        profiles_dict[self.profile_uuid] = self.as_dict()
        Profile._write_profiles(profiles_dict)
    
    
    #TODO 1  : get the metadata of the profiles 
    @staticmethod
    def _read_profiles():
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'profiles.json')) as json_cache_file:
            return json.load(json_cache_file)
    
    @staticmethod
    def _write_profiles(profiles_dict: dict):
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'profiles.json'), 'w') as json_file:
            json.dump(profiles_dict, json_file)
    
    #  2  : download the repo from the the repo _url given and add repo url to metadata_cache
    def _download_repo(self, repo_url):
        to_put_in = GitRepoCache(os.path.join(os.getcwd(),'app','webtop-work-space' ,'cache'))
        if(repo_url not in self.seed_dependencies):
            self.seed_dependencies.append(repo_url)
        return to_put_in.get_content_location_for(repo_url)
    
    #     3  : add repo urls to seed dependencies
    #     4a : if there is a ro-crate-metadata.json check if there are any other repo urls in the @graph
    def get_rocrate_metadata_git_urls(self, rocrate_metadata_location):
        with open(rocrate_metadata_location) as metadata_file:
            rocrate_metadata = json.load(metadata_file)
        
        #check metadata file for other git repos
        for files_to_check in rocrate_metadata["@graph"]:
            if(".git" in files_to_check["@id"] or "git@github.com" in files_to_check["@id"]):
                self.seed_dependencies.append(files_to_check["@id"])
                
        #     4a: if yes do reciproce check that downloads the repo and checks the ro-crate-metadata.json for repo urls in the @graph
        for repo_url_git in self.seed_dependencies:
            new_repo_location = self._download_repo(repo_url = repo_url_git)
            assert(len(self.evaluated_repos) != len(self.seed_dependencies))
            if(repo_url_git not in self.evaluated_repos):
                if(os.path.exists(os.path.join(new_repo_location,"ro-crate-metadata.json"))):
                    self.evaluated_repos.append(repo_url_git)
                    self.get_rocrate_metadata_git_urls(rocrate_metadata_location= os.path.join(new_repo_location,"ro-crate-metadata.json"))        
    
    #     5: save the new metadata in the profiles
    def _write_metadata_profiles(self):
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'profiles.json'), 'w') as json_file:
            json.dump(self.metadata_cache, json_file)                                  
