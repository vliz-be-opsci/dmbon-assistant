from fastapi.testclient import TestClient
import os, tempfile, sys, shutil
import stat, pytest
from subprocess import call
from util4tests import log, run_single_test

currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)

from app.model.profile import Profile
from app.model.space import Space
from app.model.location import Locations

### tests ###
def on_rm_error(func, path, exc_info):
    #from: https://stackoverflow.com/questions/4829043/how-to-remove-read-only-attrib-directory-with-python-in-windows
    os.chmod(path, stat.S_IWRITE)
    os.unlink(path)
    
def setup(**kwargs):
    #clean the given cache
    log.info(f"setting up :{kwargs}")
    
def teardown():
    #clean cache again
    log.info("tearing down")
    
#test to see if a profile cna be corectly made

def test_make_profile():
    """ test to see if a profile can be correctly made
        Steps:
        1 -> clear out cache of workspaces 
        2 -> perform the makeprofile
        3 -> perform assertions to see if everything went correctly (check if folder exists, check if the name of the folder is correct)
        4 -> clear out cacke of workspaces again
    """
    cache_folder = os.path.join(os.getcwd(),'app','webtop-work-space' ,'cache')
    for i in os.listdir(cache_folder):
        try:
            tmp = os.path.join(cache_folder, i)
            # We want to unhide the .git folder before unlinking it.
            while True:
                call(['attrib', '-H', tmp])
                break
            shutil.rmtree(tmp, onerror=on_rm_error)
        except Exception as e:
            print(e)
    Locations(root=os.path.join(os.getcwd(),'app','webtop-work-space' ,'cache'))
    Profile(repo_url = "https://github.com/arms-mbon/my_bon_test_vlizrepo_crate.git", 
            name = "test_automated_tests",
            logo_url="https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            description= "test new method object oriented from test_apiv1.py")
    
def test_check_profile():
    tottest = Profile.load(uuid = '0d972c79c8634b18b5fd13fdde8c8cb7')
    print(tottest.seed_dependencies)
    
def test_make_space():
    """ test to see if a profile can be correctly made
        Steps:
        1 -> clear out cache of spaces 
        2 -> perform the makespace
        3 -> perform assertions to see if everything went correctly (check if folder exists, check if the name of the folder is correct)
        4 -> clear out cache of spaces again
    """
    '''
    cache_folder = os.path.join(os.getcwd(),'app','webtop-work-space' ,'spaces')
    for i in os.listdir(cache_folder):
        try:
            tmp = os.path.join(cache_folder, i)
            while True:
                call(['attrib', '-H', tmp])
                break
            shutil.rmtree(tmp, onerror=on_rm_error)
        except Exception as e:
            print(e)
    '''
    Locations(root=os.path.join(os.getcwd(),'app','webtop-work-space' ,'cache'))
    Space(name="test_space_project",
    storage_path="env_variable_here", #TODO: have a env varibale ready here to be used as the test storage path
    ro_profile="0d972c79c8634b18b5fd13fdde8c8cb7",
    )

if __name__ == "__main__":
    run_single_test(__file__)