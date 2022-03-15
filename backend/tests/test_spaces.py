from fastapi.testclient import TestClient
import os, tempfile, sys, shutil, json
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
        shutil.copytree(os.path.join(os.getcwd(),"tests","setup_workspace"),root_folder)
        log.debug("setup completed")
    except Exception as e:
        log.error(f"error during test setup:{e}")
        log.exception(e)
        
@pytest.fixture  
def root_folder():
    _root_folder = workspace_folder
    os.environ['DMBON_FAST_API_ROOT_WORKSPACE'] = str(_root_folder)
    clean_root(_root_folder)
    Locations(root=_root_folder)  
    return _root_folder
    
#test to see if a profile can be corectly made   
def test_make_space_success(root_folder):
    """ test to see if a space can be correctly made
    """
    test_space_name = "iets_nieuws"
    
    log.debug(f"Locations={Locations().root}")
    addedspace = Space(
        storage_path=Locations().join_abs_path(test_space_name),
        ro_profile="0123456",
    )
    log.info(f"space added info : {addedspace}")
    #check if addespace exists
    assert addedspace is not None , "space should exist"
    
    #check if space is indeed in the right location
    space_path_exists = Locations().join_abs_path(test_space_name)
    log.debug(f"checking if path exists space: {space_path_exists}")
    assert os.path.exists(space_path_exists)
    
    #check if space is added to spaces.json
    with open(Locations().join_abs_path("spaces.json"),'r') as metaf:
        data = json.load(metaf)
        foundspace = data[addedspace.uuid]
        assert foundspace["storage_path"] == addedspace.storage_path
        
    # check if workspace exists
    workspace_path_exists = Locations().join_abs_path("spaces",addedspace.uuid)
    log.debug(f"checking if path exists workspace: {workspace_path_exists}")
    assert(os.path.exists(workspace_path_exists))
    
    # try to load in space 
    loaded_space = Space.load(uuid=addedspace.uuid)
    assert loaded_space is not None
    assert loaded_space == addedspace
    
def test_load_space_success(root_folder):
    """ test to see if a space can be correctly loaded
    """
    log.debug(f"Locations={Locations().root}")
    loadedspace = Space.load(uuid='0123456789')
    log.info(f"space info : {loadedspace}")
    #check if space exists
    assert loadedspace is not None
    #check if info about the space is correct
    
def test_make_space_fail(root_folder):
    """ test to see if a space can be correctly failed 
    """
    log.debug(f"Locations={Locations().root}")
    #TODO: the space seems to be made before the non existing profile error comes up
    with pytest.raises(KeyError) as ke:
        addedspace = Space(
            storage_path=Locations().join_abs_path("shouldnt_exist"),
            ro_profile="01246"
            )
    #check if space folder exists
    space_path_exists = Locations().join_abs_path("should_not_exist")
    log.debug(f"checking if path exists space: {space_path_exists}")
    assert os.path.exists(space_path_exists) == False

if __name__ == "__main__":
    run_single_test(__file__)
    #do cleanup after