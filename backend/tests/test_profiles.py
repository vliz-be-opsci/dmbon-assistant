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

def clean_root(root_folder):
    log.debug("calling in setup")
    try:
        shutil.rmtree(root_folder, onerror=on_rm_error)
        shutil.copytree(os.path.join(os.getcwd(),"tests","setup_workspace"),root_folder)
        log.debug("setup completed")
    except Exception as e:
        log.error(f"error during test setup:{e}")
        log.exception(e)
        
@pytest.fixture  
def root_folder():
    _root_folder = os.path.join(os.getcwd(),'tests','tmp_workspace')  
    clean_root(_root_folder)
    Locations(root=_root_folder)  
    return _root_folder

def test_check_profile(root_folder):
    tottest = Profile.load(uuid = '0123456') #TODO: better indications of where to have this 
    print(tottest.seed_dependencies)
    #TODO : similar checks matching data in the setup_workspace/profiles.json

#test to see if a profile can be correctly made
def test_make_profile_success(root_folder):
    """ test to see if a profile can be correctly made
    """
    log.debug(f"Locations={Locations()}")
    Profile(repo_url = "https://github.com/arms-mbon/my_bon_test_vlizrepo_crate.git", #TODO get better git test repos and document their existence, and where to put code
            name = "test_automated_tests",
            logo_url="https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            description= "test new method object oriented from test_apiv1.py")
    #TODO: did repos in the profile get checked out
    #TODO: is the content of the profile in the repo
    #TODO: check if folders of profile repos are .git repos
    #TODO: check file .git/config and verify if git remote origin matches repo url git remote with gitpyhon

if __name__ == "__main__":
    run_single_test(__file__)