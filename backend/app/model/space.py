#space model here
from location import Locations
from rocrategit import RoCrateGitBase
import os, json

class Space(RoCrateGitBase):
    """ Class to represent a selectable profile for data spaces.
    This class tracks and manages/caches incomming profile data 
    retrieved from github repos.
    """
    def __init__(self,name,storage_path,ro_profile,uuid=None,remote_url=None,workspace_path=None):
        """     
        :param name: name of the profile
        :type name: str
        :param storage_path: path on local disk where to store the dataset repo of the space
        :type storage_path: Path
        :param ro_profile: profile to which the space should adhere to be
        :type ro_profile: str
        :param uuid: Optional - uuid of the space
        :type uuid: str
        :param remote_url: Optional - git url of the dataset repo that can be used to remote to
        :type remote_url: str
        :param workspace_path: Optional - path on local disk that stores all the space workspace data
        :type workspace_path: Path
        """  
        self.name = name
        self.storage_path = storage_path
        self.ro_profile = ro_profile
        self.remote_url = remote_url #TODO: what todo with the the optionality of the property
        if uuid is None:
            self.uuid = uuid.uuid4().hex
            #TODO: get all the seed_dependencies from the given profile
            #TODO: copy all the data of the seed dependencies to the location of the workspace folder for the space
            #TODO: copy all the template data for the space into the given storage_path for the space
            #TODO: add the new metadata to the spaces.json file
        self.workspace_path = workspace_path #TODO: when to instantiate the workspace_path
            
    def as_dict(self):
        """ create a dict respresentation of self that can be **expanded into the arguments to __init__() 
            this duplicates as the dict entry for spaces.json 
        """
        return dict(name=self.name,
                    storage_path= self.storage_path,
                    ro_profile= self.ro_profile,
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
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'spaces.json')) as json_cache_file:
            return json.load(json_cache_file)
    
    @staticmethod
    def _write_spaces(spaces_dict: dict):
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'spaces.json'), 'w') as json_file:
            json.dump(spaces_dict, json_file)
          
    def location(self):
        return Locations().get_space_location_by_name(self.name)  

    