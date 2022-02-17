import git, os, json
from abc import abstractmethod
from location import Locations

class GitRepoCache():

    @staticmethod
    def clone_content(location, repo_url): 
        #  clone repo_url to location
        #  convert the repo url to a ssh url
        ssh_url = Locations.repo_url_to_git_ssh_url(repo_url=repo_url)
        git.Repo.clone_from(ssh_url, location)
    
    @staticmethod
    def update_content(location):
        # do the git stuff to clone or update
        repo = git.Repo(location)
        try:
            origin = repo.remote(name='origin')
            origin.pull()
        except Exception as e:
            return e


class RoCrateGitBase():
    
    def __init__():
        pass

    #TODO: !!!
    def find_parts(self,type_uri):
       # returns list of parts in this crate that match this type_uri
       md = self._read_metadata()
       # run through md to find...
       # returns a set if @id that match the type url found in ro-crate-metadata.json
       return set()
    
    def get_object(self, subject_uri, predicate_uri):
        '''get the object from a given subject with certain predicate uri
        '''
        pass
    
    def _read_metadata(self):
        # use self.location() to extend towards ./ro-crate-metadata.json
        metadata_location = os.path.join(self.storage_path,'ro-crate-metadata.json') 
        # load it and return it in some form?
        with open(metadata_location) as metadata_file:
            return(json.load(metadata_file))
        # and/or us the rocrate-py stuff

    @abstractmethod
    def location(self):
      """ returns the location of this git repo based ro crate
      """
      pass

    def sync(self):
       GitRepoCache().update_content(self.location())

    def init(self,repo_url):
       GitRepoCache().clone_content(self.location(), repo_url)