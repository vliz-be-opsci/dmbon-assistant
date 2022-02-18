#location model here
#imports
#from ..utilities.singleton import singleton -> TODO figure out what is wrong with this notation
import os

def singleton(class_):
    instances = {}
    def getinstance(*args, **kwargs):
        print(f"getting instance with args == {args}")
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]
    return getinstance

def repo_url_to_localfolder(repo_url):
    repo_owner  = repo_url.split("github.com/")[-1].split("/")[0]
    repo_name   = repo_url.split("/")[-1].split(".git")[0]
    return(os.path.join(os.getcwd(),'app','webtop-work-space' ,'cache' ,repo_owner+"_"+repo_name))

@singleton
class Locations():
    
    def __init__(self, root):
        self.root=root

    def get_workspace_location_by_uuid(self, space_uuid):
        # get workspace location of a given space id
        # is repo url is git ssh or full html url and then convert
        pass
    
    def get_space_repo_location_by_name(self, repo_name):
        # extends name into actual path where to store the space content
        # does locations know about the paths in the profiles.json?
        pass
    
    def get_repo_location_by_url(self, repo_url):
        # converts repo_url into path where to store it used for profiles and seed_crates
        # is repo url is git ssh or full html url and then convert
        return(repo_url_to_localfolder(repo_url))

    