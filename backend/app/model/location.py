#location model here
#imports
from utils.singleton import singleton
import os

@singleton
class Locations():
    
    def __init__(self, root):
        self.root=root

    def get_workspace_location(self, repo_url):
        # converts repo_url into path where to store it used for profiles and seed_crates
        # is repo url is git ssh or full html url and then convert
        return(Locations.repo_url_to_localfolder(repo_url))

    def get_space_location_by_name(self, name):
        # extends name into actual path where to store the space content
        # does locations know about the paths in the profiles.json?
        pass

    def get_workspace_location_by_name(self, name):
        # extends name into path where the workspace content for a space is stored
        pass
    
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