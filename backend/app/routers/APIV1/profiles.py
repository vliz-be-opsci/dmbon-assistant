from fastapi import FastAPI, Path, Query, HTTPException, status, APIRouter
from fastapi.openapi.utils import get_openapi
from typing import List, Optional, Set
from pydantic import BaseModel, Field
import os, json, requests, asyncio, sys, aiohttp, shutil, git, uuid, subprocess, stat
from importlib import import_module
from datetime import datetime
from aiohttp import ClientSession
from rocrate.rocrate import ROCrate
from pathlib import Path as pads
from collections import MutableMapping
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)
import app.ro_crate_reader_functions as ro_read
import logging
log=logging.getLogger(__name__)
#all diff subroutes
from .content import router as content_router
from .git import router as git_router
from .annotation import router as annotation_router
from app.model.location import Locations
from app.model.profile import Profile

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

class SpaceModel(BaseModel):
    storage_path: str = Field(None, description = "Valid path on local storage where ROcrate data will be stored")
    RO_profile: str = Field(None, description = "Ro-Profile name that will be used for the space")
    remote_url: Optional[str] = Field(None, description = "git repo url to get project from")

class FileModel(BaseModel):
    name     : str = Field(None, description = "Name of the file that will be added, can be filepath")
    content  : str = Field(None, description = "Filepath that needs to be added to the space, can also be a directory or url")
    
class AnnotationModel(BaseModel):
    URI_predicate_name : str = Field(None, description = "Name of the URI that will be added, must be part of the RO-crate profile provided metadata predicates.\
                                                for more info about the allowed predicates, use TODO: insert api call for predicates here.")
    value    : str = Field(None, description = "Value linked to the URI predicate name chosen")

class AnnotationsModel(BaseModel):
    Annotations: List[AnnotationModel] = Field(None, description = "List of annotations to add to resource. \
                                              for more info about the allowed annotation predicates, use TODO: insert api call for predicates here.")

class ContentModel(BaseModel):
    content: List[FileModel] = Field(None, description = "List of files that need to be added, this list can also contain directories")

class DeleteContentModel(BaseModel):
    content: List[str] = Field(None, description = "List of files to delete , if full path given it will delete one file , of only file name given it will delete all entities in the system with file name.")

### define helper functions for the api ###

def check_space_name(spacename):
    with open(Locations().join_abs_path('spaces.json'), "r+")as file:
        data = json.load(file)
    for space, info in data.items():
        if spacename == space:
            return True
    return False

def on_rm_error(func, path, exc_info):
    #from: https://stackoverflow.com/questions/4829043/how-to-remove-read-only-attrib-directory-with-python-in-windows
    os.chmod(path, stat.S_IWRITE)
    os.unlink(path)

async def check_path_availability(tocheckpath,space_id):
    if os.path.isdir(os.path.join(tocheckpath)) == False:
        raise HTTPException(status_code=400, detail="Given storage path does not exist on local storage")
    #check if given path is already used by another project
    toposturl = 'http://localhost:6656/apiv1/spaces' #TODO : figure out how to not hardcode this <---
    async with ClientSession() as session:
        response = await session.request(method='GET', url=toposturl)
        text = await response.content.read()
        all_spaces = json.loads(text.decode('utf8').replace("'", '"'))
        for space,info_space in all_spaces.items():
            print(info_space["storage_path"], file=sys.stderr)
            print(str("/".join((tocheckpath,str(space_id)))), file=sys.stderr)
            if info_space['storage_path'] == str("/".join((tocheckpath,str(space_id)))) or info_space['storage_path'] == str(tocheckpath):
                raise HTTPException(status_code=400, detail="Given storage path is already in use by another project")
    if len(os.listdir(os.path.join(tocheckpath)) ) != 0:
        try:
            os.mkdir(os.path.join(tocheckpath,str(space_id)))
            tocheckpath = os.path.join(tocheckpath,str(space_id))
            returnmessage = "Space created in folder: " + str(os.path.join(tocheckpath))
            return [returnmessage,tocheckpath]
        except:
            tocheckpath = os.path.join(tocheckpath,str(space_id))
            returnmessage = "Space created in existing folder: " + str(os.path.join(tocheckpath))
            return [returnmessage,tocheckpath]

### api paths ###

@router.get('/')
def get_all_profiles_info():
    log.info(f"profile get all begin")
    with open(Locations().join_abs_path('profiles.json'), "r+") as file:
        data = json.load(file)
        return data

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