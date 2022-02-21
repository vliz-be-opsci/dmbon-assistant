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
    log.info(f"setting up :{kwargs}")
    #clean the given cache
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
      
def teardown():
    log.info("tearing down")
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
    #clean cache again
    repo_folder = "C:\\Users\\cedric\\Desktop\\no importante\\test_space_project"
    for i in os.listdir(repo_folder):
        try:
            tmp = os.path.join(repo_folder, i)
            while True:
                call(['attrib', '-H', tmp])
                break
            shutil.rmtree(tmp, onerror=on_rm_error)
        except Exception as e:
            print(e)
    
#test to see if a profile can be corectly made   
def test_make_space():
    """ test to see if a space can be correctly made
    """
    Locations(root=os.path.join(os.getcwd(),'app','webtop-work-space' ,'cache'))
    Space(name="test_space_project",
    storage_path="C:\\Users\\cedric\\Desktop\\no importante", #TODO: get better way to test out spaces storage_path
    ro_profile="0d972c79c8634b18b5fd13fdde8c8cb7",
    )

if __name__ == "__main__":
    run_single_test(__file__)