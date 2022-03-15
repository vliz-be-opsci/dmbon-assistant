from fastapi.testclient import TestClient
import os, tempfile, sys, shutil, git
import stat, pytest
from subprocess import call
from util4tests import log, run_single_test, workspace_folder

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
        #os.makedirs(root_folder, exist_ok=True)
        shutil.copytree(os.path.join(os.getcwd(),"tests","setup_workspace"),root_folder)
        log.debug("setup completed")
    except Exception as e:
        log.error(f"error during test setup:{e}")
        log.exception(e)
        
@pytest.fixture  
def root_folder():
    _root_folder = workspace_folder
    clean_root(_root_folder)
    Locations(root=_root_folder)  
    return _root_folder

def test_check_profile(root_folder):
    tottest = Profile.load(uuid = '0123456') #TODO: better indications of where to have this 
    log.debug(f"totest seedcrates: {tottest.seed_dependencies}")
    log.debug(f"totest name: {tottest.name}")
    assert tottest is not None
    #TODO : similar checks matching data in the setup_workspace/profiles.json

#test to see if a profile can be correctly made
def test_make_profile_success(root_folder):
    """ test to see if a profile can be correctly made
    """
    log.debug(f"Locations={Locations()}")
    madeprofile = Profile(repo_url = "https://github.com/arms-mbon/my_bon_test_vlizrepo_crate.git", #TODO get better git test repos and document their existence, and where to put code
            name = "test_automated_tests",
            logo_url="https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            description= "test new method object oriented from test_apiv1.py")
    #TODO: did repos in the profile get checked out
    repo = git.Repo(Locations().get_repo_location_by_url(repo_url="https://github.com/arms-mbon/my_bon_test_vlizrepo_crate.git"))
    log.debug(repo)
    assert repo is not None
    
    # try to load in space 
    loaded_profile = Profile.load(uuid=madeprofile.uuid)
    assert loaded_profile is not None
    log.debug(f"loaded profile info : {loaded_profile}")
    assert loaded_profile == madeprofile
    
#test with the api to see if a space can be made
def test_make_profile_api(root_folder):
    os.environ["DMBON_FAST_API_ROOT_WORKSPACE"] = os.path.join("tests","tmp_workspace")
    #setup server with sh command?
    
    

if __name__ == "__main__":
    run_single_test(__file__)