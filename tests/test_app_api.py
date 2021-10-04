from fastapi.testclient import TestClient
import os, tempfile, sys

currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)
from app.app import app

client = TestClient(app)

# test #
def test_read_main():
    response = client.get("/")
    assert response.status_code == 418
    assert response.json() == {'Message':'Waddup OpSci, docs can be found in the /docs route'}

### profiles ###

# get_all_profiles     : status_code 200 
def test_get_all_profiles():
    response = client.get("/profiles")
    assert response.status_code == 200

# post_profile_success : status_code 201 , right display of values , test if profile is in get all profiles
def test_post_profile_success():
    response = client.post(
        "/profiles/test",
        json={
            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            "description": "string",
            "url_ro_profile": "string"
            }
    )
    assert response.status_code == 201
    assert response.json() == {"Message": "Profile added"}
    response = client.get("/profiles/test")
    assert response.json() == {
                            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
                            "description": "string",
                            "url_ro_profile": "string"
                            }
    response = client.delete("/profiles/test")

# post_profile_fail    : status_code 400 , missing desciption or url roprofile
def test_post_profile_fail():
    response = client.post(
            "/profiles/test",
            json={
                }
        )
    assert response.status_code == 400
    response = client.delete("/profiles/test")

# delete_fail          : status_code 400 , check if no profile was deleted with get profiles
def test_delete_profile_fail():
    response = client.delete("/profiles/fail")
    assert response.status_code == 400 or response.status_code == 500

# put_success          : status_code 202 , check if desciption/logo/url_ro_profile have changed 
def test_put_success():
    client.post("/profiles/test",
        json={
            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            "description": "string",
            "url_ro_profile": "string"
            }
    )
    response = client.put("/profiles/test",
        json={
            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            "description": "diff string",
            "url_ro_profile": "diff string"
            }
        )
    assert response.status_code == 202
    response = client.get("/profiles/test")
    assert response.json() == {
                                "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
                                "description": "diff string",
                                "url_ro_profile": "diff string"
                              }
    client.delete("/profiles/test")

# put_fail             : status_code 400 , check if profile hasn't been changed
def test_put_fail():
    client.post("/profiles/test",
        json={
            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            "description": "string",
            "url_ro_profile": "string"
            }
    )
    response = client.put("/profiles/test",
        json={"test":"lol"
            }
        )
    assert response.status_code == 400
    response = client.get("/profiles/test")
    assert response.json() == {
                            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
                            "description": "string",
                            "url_ro_profile": "string"
                            }
    client.delete("/profiles/test")

# get_profile_success  : status_code 200 , check if profile is indeed found
def test_get_success():
    client.post("/profiles/test",
        json={
            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            "description": "string",
            "url_ro_profile": "string"
            }
    )
    response = client.get("/profiles/test")
    assert response.status_code == 200
    assert response.json() == {
                            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
                            "description": "string",
                            "url_ro_profile": "string"
                            }
    client.delete("/profiles/test")

# get_profile_fail     : status_code 400 
def test_get_fail():
    response = client.get("/profiles/dfrseghgwddf")
    assert response.status_code == 404

# delete_success       : status_code 202 , check if profile is deleted
def test_delete_profile_success():
    client.post(
        "/profiles/test",
        json={
            "logo": "https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png",
            "description": "string",
            "url_ro_profile": "string"
            }
    )
    response = client.delete("/profiles/test")
    assert response.status_code == 202

### spaces ###

# get_all_spaces       : status_code 200
def test_get_all_spaces():
    response = client.get("/spaces")
    assert response.status_code == 200

# post_space_success   : status_code 201 , right display of storage path and ro-profile 
def test_post_space_success():
    testdir = os.getcwd()
    response = client.post("/spaces/test",
        json={
            "storage_path": str(testdir),
            "RO_profile": "new"
            }
    )
    assert response.status_code == 201
    response = client.get("/spaces/test")
    assert response.json() == {
                            "storage_path": os.path.join(str(testdir),'test'),
                            "RO_profile": "new"
                            }
    client.delete("/spaces/test")

# post_space_fail     : status_code 400
def test_post_space_fail():
    testdir = os.getcwd()
    response = client.post("/spaces/test",
        json={
            "storage_path": str(testdir),
            "RO_profile": "wdfrgveuihwdvfuihjl"
            }
    )
    assert response.status_code == 400
    os.rmdir(os.path.join(testdir,"test"))    

# get_space_success   : status_code 200
def test_get_all_spaces():
    testdir = os.getcwd()
    client.post("/spaces/test",
        json={
            "storage_path": str(testdir),
            "RO_profile": "new"
            }
    )
    response = client.get("/spaces/test")
    assert response.status_code == 200
    assert response.json() == {
                            "storage_path": os.path.join(str(testdir),'test'),
                            "RO_profile": "new"
                            }
    client.delete("/spaces/test")

# get_space_fail      : status_code 400
def test_get_space_fail():
    response = client.get("/spaces/teqegrqwrgrqgwt")
    assert response.status_code == 404

# put_space_success   : status_code 202
def test_put_space_success():
    testdir = os.getcwd()
    client.post("/spaces/test",
        json={
            "storage_path": str(testdir),
            "RO_profile": "new"
            }
    )
    response = client.put("/spaces/test",
        json={
            "storage_path": str(testdir),
            "RO_profile": "new2"
            }
    )
    assert response.status_code == 202
    response = client.get("/spaces/test")
    assert response.json() == {
                            "storage_path": os.path.join(str(testdir),'test'),
                            "RO_profile": "new2"
                            }
    client.delete("/spaces/test")

# put_space_fail    : status_code 400
def test_put_space_fail():
    testdir = os.getcwd()
    client.post("/spaces/test",
        json={
            "storage_path": str(testdir),
            "RO_profile": "new"
            }
    )
    response = client.put("/spaces/test",
        json={
            "storage_path": str(testdir),
            "RO_profile": "nefqdsfqsdregq"
            }
    )
    assert response.status_code == 400
    client.delete("/spaces/test")

### content ###
