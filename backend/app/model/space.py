#space model here
import shutil
from .profile import Profile
from .location import Locations
from .rocrategit import RoCrateGitBase
import os, json, stat
import uuid as uuidmake
import logging
log=logging.getLogger(__name__)
class Space(RoCrateGitBase):
    """ Class to represent a selectable profile for data spaces.
    This class tracks and manages/caches incomming profile data 
    retrieved from github repos.
    """
    def __init__(self,storage_path,ro_profile,uuid=None,remote_url=None,workspace_path=None,name=None):
        """     
        :param storage_path: path on local disk where to store the dataset repo of the space
        :type storage_path: Path
        :param ro_profile: uuid of the profile to which the space should adhere to
        :type ro_profile: str
        :param uuid: Optional - uuid of the space
        :type uuid: str
        :param remote_url: Optional - git url of the dataset repo that can be used to remote to
        :type remote_url: str
        :param workspace_path: Optional - path on local disk that stores all the space workspace data
        :type workspace_path: Path
        """  
        self.storage_path = storage_path
        self.ro_profile = Profile.load(uuid = ro_profile)
        self.remote_url = remote_url #TODO: what todo with the the optionality of the property
        if uuid is None:
            self.uuid = uuidmake.uuid4().hex
            #check if remote url was  given, if yes then only init the repo and not copy files 
            log.debug(remote_url)
            self.workspace_path = Locations().get_workspace_location_by_uuid(self.uuid)
            os.mkdir(self.workspace_path)
            if remote_url is None or remote_url == "": 
                seed_dependencies = self.ro_profile.seed_dependencies
                log.debug(seed_dependencies)
                #TODO: get all the seed_dependencies from the given profile uuid
                self.make_repo()
                repos_to_copy_over = []
                for seed_repo in seed_dependencies.keys():
                    repos_to_copy_over.append(seed_repo)
                #copy over all the files from the repos
                for repo in repos_to_copy_over:
                    self._copy_files_to_workspace(repo_url=repo)
            else:
                seed_dependencies = self.ro_profile.seed_dependencies
                log.debug(seed_dependencies)
                #TODO: get all the seed_dependencies from the given profile uuid
                
                #TODO: Add a check on the created repo to see if the repo is not empty => if empty then copy over all the files from the seed repos else don't do anything
                
                self.clone_repo(self.remote_url)
                repos_to_copy_over = []
                for seed_repo in seed_dependencies.keys():
                    repos_to_copy_over.append(seed_repo)
                #copy over all the files from the repos
                for repo in repos_to_copy_over:
                    self._copy_files_to_workspace(repo_url=repo)
                self.clone_repo(self.remote_url)
            #TODO: add the new metadata to the spaces.json file
            self.write()
        else:
            self.uuid = uuid
            self.workspace_path = workspace_path #TODO: when to instantiate the workspace_path
        self._name = os.path.basename(self.storage_path)
        
    @property
    def name(self):
        return self._name       
    
    def __str__(self):
        return f"Space(uuid = {self.uuid})" 
    
    def __hash__(self) -> int:
        return self.uuid.__hash__()
    
    identity_props = ["storage_path","uuid","remote_url","ro_profile"]
    
    def __eq__(self, __o: object) -> bool:
        return all([self.__getattribute__(attr).__eq__(__o.__getattribute__(attr)) for attr in Space.identity_props ])
     
    def as_dict(self):
        """ create a dict respresentation of self that can be **expanded into the arguments to __init__() 
            this duplicates as the dict entry for spaces.json 
        """
        return dict(
                    storage_path= self.storage_path,
                    ro_profile= self.ro_profile.uuid,
                    uuid= self.uuid,
                    remote_url= self.remote_url, 
                    workspace_path = self.workspace_path
                )
        
    @staticmethod
    def load(uuid :str):
        """loads and creates a space object found in the spaces.json
        :param uuid: uuid of the space
        :type uuid: str
        :return: the found space in json 
        :rtype: Space
        :raises KeyError: the supplied key was not found in the spaces.json file
        """
        #get metadata profiles 
        spaces_dict = Space._read_spaces()
        return Space(**spaces_dict[uuid])
    
    @staticmethod
    def load_all():
        """creates a dictionary by uuid of all known profiles"""
        spaces_dict = Space._read_spaces()
        return {uuid:Space(**spaces_dict[uuid]) for uuid in spaces_dict}
    
    def write(self):
        spaces_dict = Space._read_spaces()
        spaces_dict[self.uuid] = self.as_dict()
        Space._write_spaces(spaces_dict)
        
    @staticmethod
    def _read_spaces():
        with open(Locations().join_abs_path('spaces.json'), 'r') as json_cache_file:
            return json.load(json_cache_file)
    
    @staticmethod
    def _write_spaces(spaces_dict: dict):
        with open(Locations().join_abs_path('spaces.json'), 'w') as json_file:
            json.dump(spaces_dict, json_file)
          
    def location(self):
        return self.storage_path
    
    def _copy_files_to_workspace(self, repo_url):
        """copy all the files from a given repo url to the workspace folder"""
        #convert repo url to folder of the repo 
        repo_location = Locations().get_repo_location_by_url(repo_url)
        #init the workspacvemanager
        workspace_manager = WorkSpaceManager(workspace_path=self.workspace_path)
        # go over each file in the given folder and check if its not part of the .git folder -> copy over to the given self.storage_path
        for subdir, dirs, files in os.walk(repo_location):
            for file in files:
                filepath = subdir + os.sep + file
                if ".git" not in filepath:
                    filetest = False
                    #copy over the files to the workspace folder with the path structure intact relative to the seed repo location
                    relative_path = filepath.split(file)[0].split(repo_location)[-1].replace(os.path.sep, "")
                    #do all the workspâce tests here, if all give back false then copy the file over to the space folder
                    filetest = workspace_manager.check_write_constraints(filepath=filepath)
                    if filetest == False:
                        if relative_path != "": 
                            fileout  = os.path.join(self.storage_path,relative_path,file)
                            if not os.path.exists(os.path.join(self.storage_path,relative_path)):
                                os.makedirs(os.path.join(self.storage_path,relative_path))
                        else: fileout  = os.path.join(self.storage_path,file)
                        shutil.copyfile(filepath,fileout)
                            
class WorkSpaceManager():
    """Class to manage all the functions that will handle the copying of certain data to be put into the workspaces"""
    
    def __init__(self, workspace_path):
        self.workspace_path = workspace_path
    
    def check_write_constraints(self,filepath):
        if filepath.endswith(".ttl"):
            #check if combined_file_name is already present in the workspace folder, if not make it , if yes then append to the file
            fileout  = os.path.join(self.workspace_path,"all_constraints.ttl")
            #open the file and get the data from it
            #open the toappend file in a mode and append file data to it
            f1 = open(filepath, 'r')
            f2 = open(fileout, 'a+')
            f2.write(f1.read())
            f1.seek(0)
            f1.close()
            f2.seek(0)
            f2.close()
            return True
        else:
            return False