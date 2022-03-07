#profile model here
from .rocrategit import RoCrateGitBase
from .location import Locations
import os, json
import uuid as uuidmake
import logging

log=logging.getLogger(__name__)

#constants
SEED_DEPENDENCY_MARKER_URI = "https://vliz.be/opsci/ns/dmbon/seed_crate" #TODO actual namespace and member properties tbd

class Profile(RoCrateGitBase):
    """ Class to represent a selectable profile for data spaces.
        This class tracks and manages/caches incomming profile data 
        retrieved from github repos.
    """
    def __init__(self, repo_url, name, description, logo_url=None, uuid= None, seed_dependencies= None):
        """ 
        :param name: name of the profile
        :type name: str
        :param repo_url: url of the repo to download
        :type repo_url: str
        :param logo_url: Optional - logo of the profile 
        :type logo_url: str
        :param description: description
        :type description: str
        :param uuid: Optional - uuid of the profile
        :type uuid: str
        :param seed_dependencies: Optional - list of git urls identifying the
        :type seed_dependencies: set of strings
        """  
        self.uuid = uuid
        self.name = name
        self.repo_url = repo_url
        self.logo_url = logo_url
        self.description = description
        if uuid is None:
            self.uuid = uuidmake.uuid4().hex
            #function to download all the initial repo
            self.clone_repo(repo_url= self.repo_url)
            seed_dependencies = Profile.detect_dependencies(self)
            log.debug(f"all seed dependencies for to make profile: {seed_dependencies}")
            
            #self.location_init_repo = self._download_repo(repo_url = self.repo_url)
            #self.get_rocrate_metadata_git_urls(rocrate_metadata_location= os.path.join(self.location_init_repo,"ro-crate-metadata.json"))
        self.seed_dependencies = SeedCrate.load_all(seed_dependencies) 
        if uuid is None:
            self.write()
    
    def __str__(self):
        return f"Profile(uuid = {self.uuid})"
    
    def __hash__(self) -> int:
        return self.uuid.__hash__()
    
    def __eq__(self, __o: object) -> bool:
        #return self.uuid.__eq__(__o.uuid)
        return all([self.__getattribute__(attr).__eq__(__o.__getattribute__(attr)) for attr in ["repo_url","logo_url","description","uuid","seed_dependencies"]])
            
    def as_dict(self):
        """ create a dict respresentation of self that can be **expanded into the arguments to __init__() 
            this duplicates as the dict entry for profiles.json 
        """
        return dict(name=self.name,
                    repo_url=self.repo_url,
                    logo_url=self.logo_url,
                    description=self.description,
                    uuid= self.uuid,
                    seed_dependencies= list(self.seed_dependencies.keys())
                )

    def location(self):
        return Locations().get_repo_location_by_url(self.repo_url)

    def detect_dependencies(self):
        self.sync()
        #  use self.location() to find information ?? 
        seed_crates = self.find_parts(SEED_DEPENDENCY_MARKER_URI)
        # for sc in seed_creates  make SeedCrate(sc.repo_uri == sc.id?) .... sc.update_content
        for sc in seed_crates: 
            #for now the sc is assumed to be the git repo url and thus nothing happens here yet
            log.debug(f"seedcrate url: {sc}")
        return seed_crates
      
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
        profiles_dict[self.uuid] = self.as_dict()
        Profile._write_profiles(profiles_dict)
    
    @staticmethod
    def _read_profiles():
        with open(Locations().join_abs_path('profiles.json'), 'r') as json_cache_file:
            return json.load(json_cache_file)
    
    @staticmethod
    def _write_profiles(profiles_dict: dict):
        with open(Locations().join_abs_path('profiles.json'), 'w') as json_file:
            log.debug(f"towritedict: {profiles_dict}")
            json.dump(profiles_dict, json_file)
    
class SeedCrate(RoCrateGitBase):
    def __init__(self,repo_url):
        self.repo_url =repo_url
        self._location = Locations().get_repo_location_by_url(repo_url)
        if os.path.exists(self._location) == False:
            self.clone_repo(repo_url= self.repo_url)
        # check if the location exists, if not call GitRepoCache.clone_content(location(), repo_url)

    def location(self):
      return self._location
  
    @staticmethod
    def load_all(set_urls):
        """creates a dictionary by repo url for all passed repo urls"""
        #TODO: have exception for NOneType input
        try:
            seeds_dict = {url: SeedCrate(url) for url in set_urls}
            log.debug(f"All seedcrate urls : {set_urls}")
            return seeds_dict
        except:
            return({})
        

### test area ###
#make locations class
