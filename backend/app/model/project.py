#project model here
from .rocrategit import RoCrateGitBase
from .location import Locations
from .profile import Profile
import os, json
import uuid as uuidmake
import logging

log=logging.getLogger(__name__)

#constants
SEED_DEPENDENCY_MARKER_URI = "hasSeedCrate" #TODO actual namespace and member properties tbd

class Project(RoCrateGitBase):
    """ Class to represent a selectable profile for data spaces.
        This class tracks and manages/caches incomming profile data 
        retrieved from github repos.
    """
    def __init__(self, repo_url, name, description, logo_url=None, uuid= None, seed_dependencies= None):
        """ 
        :param name: name of the project
        :type name: str
        :param repo_url: url of the repo to download
        :type repo_url: str
        :param logo_url: Optional - logo of the project 
        :type logo_url: str
        :param description: description of the project
        :type description: str
        :param uuid: Optional - uuid of the project
        :type uuid: str
        :param seed_dependencies: Optional - list of git urls identifying the diff profiles in the project
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
            seed_dependencies = Project.detect_profiles(self)
            log.debug(f"all seed dependencies to make Project: {seed_dependencies}")
            #self.location_init_repo = self._download_repo(repo_url = self.repo_url)
            #self.get_rocrate_metadata_git_urls(rocrate_metadata_location= os.path.join(self.location_init_repo,"ro-crate-metadata.json"))
        self.seed_dependencies = SeedCrate.load_all(seed_dependencies) 
        if uuid is None:
            self.write()
    
    def __str__(self):
        return f"Project(uuid = {self.uuid})"
    
    def __hash__(self) -> int:
        return self.uuid.__hash__()
    
    identity_props = ["repo_url","logo_url","description","uuid","seed_dependencies"]
    
    def __eq__(self, __o: object) -> bool:
        return all([self.__getattribute__(attr).__eq__(__o.__getattribute__(attr)) for attr in Project.identity_props ])
            
    def as_dict(self):
        """ create a dict respresentation of self that can be **expanded into the arguments to __init__() 
            this duplicates as the dict entry for projects.json 
        """
        return dict(name=self.name,
                    repo_url=self.repo_url,
                    logo_url=self.logo_url,
                    description=self.description,
                    uuid= self.uuid,
                    seed_dependencies= list(self.seed_dependencies.keys()) #todo use set instead of list
                )

    def location(self):
        return Locations().get_repo_location_by_url(self.repo_url)

    def detect_profiles(self):
        self.sync()
        #  use self.location() to find information ?? 
        seed_crates = self.find_parts(SEED_DEPENDENCY_MARKER_URI)
        # for sc in seed_creates  make SeedCrate(sc.repo_uri == sc.id?) .... sc.update_content
        for sc in seed_crates: 
            #for now the sc is assumed to be the git repo url and thus nothing happens here yet
            log.debug(f"seedcrate url: {sc}")
            SeedCrate(sc, name=self.name)
        return seed_crates
      
    @staticmethod
    def load(uuid :str):
        """loads and creates a Project object found in the Projects.json
        :param uuid: uuid of the Project
        :type  uuid: str
        :return: the found Project in json 
        :rtype: Project
        :raises KeyError: the supplied key was not found in the Projects.json file
        """
        #get metadata Projects 
        projects_dict = Project._read_projects()
        return Project(**projects_dict[uuid])
    
    @staticmethod
    def load_all():
        """creates a dictionary by uuid of all known projects"""
        projects_dict = Project._read_projects()
        return {uuid:Project(**projects_dict[uuid]) for uuid in projects_dict}
    
    def write(self):
        projects_dict = Project._read_projects()
        projects_dict[self.uuid] = self.as_dict()
        Project._write_projects(projects_dict)
    
    @staticmethod
    def _read_projects():
        with open(Locations().join_abs_path('projects.json'), 'r') as json_cache_file:
            return json.load(json_cache_file)
    
    @staticmethod
    def _write_projects(projects_dict: dict):
        with open(Locations().join_abs_path('projects.json'), 'w') as json_file:
            log.debug(f"towritedict: {projects_dict}")
            json.dump(projects_dict, json_file)
    
class SeedCrate(RoCrateGitBase):
    def __init__(self,repo_url,name):
        self.repo_url =repo_url
        self.name = name
        self._location = Locations().get_repo_location_by_url(repo_url)
        if os.path.exists(self._location) == False:
            #make variable profilename => "space_" + repo_url.split("/")[-1]
            profilename = "space_" + repo_url.split("/")[-1]
            profile_description = "Seed profile "+ profilename + " of the space " + self.name
            #make profile here 
            Profile(
                repo_url = repo_url,
                name = profilename,
                description = profile_description,
                parent_space = self.name
            )
        # check if the location exists, if not call GitRepoCache.clone_content(location(), repo_url)
        
    def __hash__(self) -> int:
        return self.repo_url.__hash__()
    
    identity_props = ["repo_url"]
    
    def __eq__(self, __o: object) -> bool:
        return all([self.__getattribute__(attr).__eq__(__o.__getattribute__(attr)) for attr in SeedCrate.identity_props])

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
