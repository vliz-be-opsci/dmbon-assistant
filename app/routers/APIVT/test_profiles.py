from requests import exceptions
from fastapi import FastAPI, Path, Query, HTTPException, status, APIRouter, Depends
from fastapi.openapi.utils import get_openapi
from typing import List, Optional, Set
from pydantic import BaseModel, Field
import os, json, requests, asyncio, sys, aiohttp, shutil, git, uuid, subprocess, stat
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

directoryname = os.path.dirname(os.path.abspath(__file__)).split(os.path.sep)[-1]

router = APIRouter(
    prefix="/"+str(directoryname)+"/"+str(os.path.abspath(__file__).split(os.path.sep)[-1].split(".")[0]),
    tags=[directoryname],
    responses={404: {"description": "Not found"}},
)

### define class profiles for the api ###

class ProfileModel(BaseModel):
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

#TODO: function that reads into the roprofile rocrate metadata and finds the conforms to part ;
#  1: gets the shacl or other constraint files.
#  2: reciprocly go through all rocrate conform to untill all contraints are gathered. 
#  3: combines all the contraints into 1 contraint file and return this in a folder that is a sibling of the project folder.

#TODO: function that searches for the typechanger for mimetypes when adding new files to the rocrate , be it either from url or from local system

#TODO: figure out how to get the mimetype of url resources added (maybe through name?)

#TODO: function that reads the shacl contraint file and gets the right properties for an accordingly chosen schema target class (@type in rocrate metadata.json)

def check_space_name(spacename):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+")as file:
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
    toposturl = 'http://localhost:6656/spaces' #TODO : figure out how to not hardcode this <---
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

@router.get('/',tags=["Profiles"])
def get_all_profiles_info():
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+") as file:
        data = json.load(file)
        return data

@router.get('/{profile_id}/',tags=["Profiles"])
def get_profile_info(profile_id: str = Path(None,description="profile_id name")):
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[profile_id]
            return toreturn
        except Exception as e:
            raise HTTPException(status_code=404, detail="profile not found")

@router.delete('/{profile_id}/',tags=["Profiles"], status_code=202)
def delete_profile(profile_id: str = Path(None,description="profile_id name")):
    with open(os.path.join(os.getcwd(),"app","workflows.json")) as data_file:
            data = json.load(data_file)
            try:
                del data[profile_id]
            except Exception as e:
                raise HTTPException(status_code=500, detail="Data delete failed")
    with open(os.path.join(os.getcwd(),"app","workflows.json"), 'w') as data_file:
        data = json.dump(data, data_file)    
        return {'message':'successfully deleted profile'}

@router.post('/',tags=["Profiles"], status_code=201)
def add_profile(*,item: ProfileModel):
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+")as file:
        data = json.load(file)
        profile_id = uuid.uuid4().hex
        if profile_id in data.keys():
            raise HTTPException(status_code=400, detail="Profile already exists")
        if item.logo != None or item.description != None or item.url_ro_profile != None:
            
            #add check for the url of the profile:
            try:
                tocheckrocrate = ro_read.rocrate_helper(item.url_ro_profile)
                tocheckrocrate.get_all_metadata_files()
                tocheckrocrate.get_ttl_files()
                print(tocheckrocrate.ttlinfo)
            except Exception as e:
                raise HTTPException(status_code=500, detail="error : {}".format(e))
            
            data[profile_id]= {'logo':item.logo,'description':item.description,'url_ro_profile':item.url_ro_profile}
            with open(os.path.join(os.getcwd(),"app","workflows.json"), "w") as file:
                json.dump(data, file)   
            return {'Message':'Profile added',"profile_id": profile_id}
        else:
            keys = dict(item).keys()
            raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))

@router.put('/{profile_id}/',tags=["Profiles"], status_code=202)
def update_profile(*,profile_id: str = Path(None,description="profile_id name"), item: ProfileModel):
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+")as file:
        data = json.load(file)
    for profile in data.keys():
        if profile_id == profile:
            if item.logo != None or item.description != None or item.url_ro_profile != None:
                data[profile_id]= {'logo':item.logo,'description':item.description,'url_ro_profile':item.url_ro_profile} 
                with open(os.path.join(os.getcwd(),"app","workflows.json"), "w") as file:
                    json.dump(data, file)  
                    return {'Data':'Update successfull'} 
            else:
                keys = dict(item).keys()
                raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))
    raise HTTPException(status_code=404, detail="profile not found")
