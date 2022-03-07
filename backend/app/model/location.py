#location model here
#imports
#from ..utilities.singleton import singleton -> TODO figure out what is wrong with this notation
import os
import logging

log=logging.getLogger(__name__)

def singleton(class_):
    instances = {}
    def getinstance(*args, **kwargs):
        log.debug(f"getting instance of {class_}with args == {args} && kwargs == {kwargs}")
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]
    return getinstance

def repo_url_to_localfolder(repo_url):
    repo_owner  = repo_url.split("github.com/")[-1].split("/")[0]
    repo_name   = repo_url.split("/")[-1].split(".git")[0]
    return(repo_owner+"_"+repo_name)

@singleton
class Locations():
    
    def __init__(self, root=None):
        self.root=root

    def __repr__(self) -> str:
        return f"Locations(root={self.root})"
    
    def join_abs_path(self, *path_elements):
        return os.path.join(self.root, *path_elements)
        
    def get_workspace_location_by_uuid(self, space_uuid):
        # get workspace location of a given space id
        # is repo url is git ssh or full html url and then convert
        return self.join_abs_path("spaces",space_uuid)
    
    def get_repo_location_by_url(self, repo_url):
        # converts repo_url into path where to store it used for profiles and seed_crates
        # is repo url is git ssh or full html url and then convert
        return self.join_abs_path(repo_url_to_localfolder(repo_url))

    