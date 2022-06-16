from fastapi import Path, HTTPException, APIRouter
from typing import Optional
from pydantic import BaseModel, Field
import json
import logging
log=logging.getLogger(__name__)
#all diff subroutes
from app.model.location import Locations
from app.model.profile import Profile
from dotenv import load_dotenv
import os
env = load_dotenv()
log.debug(f"all env variables: {env}")
BASE_URL_SERVER = os.getenv('BASE_URL_SERVER')

router = APIRouter(
    prefix="",
    tags=["Profiles"],
    responses={404: {"description": "Not found"}},
)

#profiles_by_uuid = Profile.load_all()

### define class profiles for the api ###

class ProfileModel(BaseModel):
    name: str = Field(None, description="Name of the profile")
    logo: Optional[str] = Field(None, example = 'https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png', description = "Logo to be displayed in RO crate UI")
    description: Optional[str] = Field(None, description = "description of the RO-profile")
    url_ro_profile: str = Field(None, description = "github url where the rocrate profile is located")

### define helper functions for the api ###

### api paths ###

@router.get('/')
def get_all_profiles_info():
    log.info(f"profile get all begin")
    with open(Locations().join_abs_path('profiles.json'), "r+")as file:
        try:
            log.info(f"env variable base_url_server == {BASE_URL_SERVER}")
            data = json.load(file)
            toreturn = []
            for i,y in data.items():
                clicktrough_url = BASE_URL_SERVER + 'apiv1/' + 'profiles/' + i 
                try:
                    parent_space = y["parent_space"]
                except:
                    parent_space = None
                #example_url: https://example.org/dmbon/ns/entity_types#Space
                toreturn.append({'name':y["name"],
                                'uuid':i,
                                '@type':'https://example.org/dmbon/ns/entity_types#Profile',
                                "parent_space":parent_space,
                                'url_space':clicktrough_url})   
            return toreturn
        except Exception as e:
            log.error(f"error  :{e}")
            log.exception(e)
            raise HTTPException(status_code=500, detail=e)

@router.get('/{profile_id}/')
def get_profile_info(profile_id: str = Path(None,description="profile_id name")):
    log.info(f"profile get begin")
    with open(Locations().join_abs_path('profiles.json'), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[profile_id]
            return toreturn
        except Exception as e:
            log.error(f"profile get profile by id error")
            log.exception(f"{e}")
            raise HTTPException(status_code=404, detail="profile not found")

@router.delete('/{profile_id}/', status_code=202)
def delete_profile(profile_id: str = Path(None,description="profile_id name")):
    log.info(f"profile delete begin")
    with open(Locations().join_abs_path('profiles.json')) as data_file:
            data = json.load(data_file)
            try:
                del data[profile_id]
            except Exception as e:
                log.error(f"profile delete profile by id error")
                log.exception(f"{e}")
                raise HTTPException(status_code=404, detail=f"profile {profile_id} was not found in profiles")
    with open(Locations().join_abs_path('profiles.json'), 'w') as data_file:
        data = json.dump(data, data_file)    
        return {'message':'successfully deleted profile'}

@router.post('/', status_code=201)
def add_profile(*,item: ProfileModel):
    log.info(f"profile add begin")
    if item.logo != None or item.description != None  or item.url_ro_profile != None or item.name != None:
        #add check for the url of the profile:
        try:
            #tocheckrocrate = ro_read.MakeNewProfile(profile_id=item.name, logo=item.logo ,description= item.description, repo_url=item.url_ro_profile)
            Profile(
                repo_url = item.url_ro_profile,
                name = item.name,
                description = item.description,
                logo_url = item.logo,
            )
        except Exception as e:
            log.error(f"profile make profile error")
            log.exception(f"{e}")
            raise HTTPException(status_code=500, detail="error : {}".format(e))
        return {'Message':'Profile added'}
    else:
        keys = dict(item).keys()
        raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))

@router.put('/{profile_id}/', status_code=202)
def update_profile(*,profile_id: str = Path(None,description="profile_id name"), item: ProfileModel):
    log.info(f"profile update begin")
    with open(Locations().join_abs_path('profiles.json'), "r+")as file:
        data = json.load(file)
    for profile in data.keys():
        if profile_id == profile:
            try:
                if item.logo != None or item.description != None or item.url_ro_profile != None:
                    data[profile_id].update({'logo_url':item.logo,'description':item.description,'repo_url':item.url_ro_profile})
                    with open(Locations().join_abs_path('profiles.json'), "w") as file:
                        json.dump(data, file)  
                        return {'Data':'Update successfull'} 
                else:
                    log.info(f"profile update fail")
                    log.info(f"supplied body must have following keys: {format(keys)}")
                    keys = dict(item).keys()
                    raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))
            except Exception as e:
                log.error(f"profile update profile error")
                log.exception(f"{e}")
                keys = dict(item).keys()
                raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))
    raise HTTPException(status_code=404, detail="profile not found")