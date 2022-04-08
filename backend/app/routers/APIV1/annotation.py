from fastapi import FastAPI, Path, Query, HTTPException, status, APIRouter
from fastapi.responses import JSONResponse
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
import logging
log=logging.getLogger(__name__)
import app.shacl_helper as shclh

from app.model.location import Locations
from app.model.space import Space

router = APIRouter(
    prefix="/annotation",
    tags=["Annotation"],
    responses={404: {"description": "Not found"}},
)

## import the config file for the specific route of the api ##
from dotenv import load_dotenv
load_dotenv()
BASE_URL_SERVER = os.getenv('BASE_URL_SERVER')

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

### space resource annotation ###

@router.get('/', status_code=200)
def get_all_resources_annotation(*,space_id: str = Path(None,description="space_id name")):
    
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")

    try:
        space_object = Space.load(uuid=space_id)
        log.debug(space_object)
        toreturn = space_object.get_predicates_all()
        log.debug(toreturn)
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)
    return toreturn

@router.post('/file/{file_id}', status_code=200)
def make_resource_annotation_single_file(*,space_id: str = Path(None,description="space_id name"), file_id: str = Path(None,description="id of the file that will be searched in the ro-crate-metadata.json file"), item: AnnotationsModel):
    ## get the current metadata.json ##
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        #read in ROCrate metadata file
        space_object = Space.load(uuid=space_id)
        log.debug(space_object)
        prerreturn = space_object.add_predicates_by_id(toadd_dict_list=item.Annotations, file_id=file_id)
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)


@router.delete('/file/{file_id}/{predicate}', status_code=200)
def delete_resource_annotation(*,space_id: str = Path(None,description="space_id name"), file_id: str = Path(None,description="id of the file that will be searched in the ro-crate-metadata.json file"), predicate: str = Path(None,description="To delete predicate from the file annotations")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        space_object = Space.load(uuid=space_id)
        prerreturn = space_object.delete_predicates_by_id(to_delete_predicate=predicate, file_id=file_id)
        log.info(prerreturn)
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)

@router.get('/file/{file_id}', status_code=200)
def get_resource_annotation(*,space_id: str = Path(None,description="space_id name"), file_id: str = Path(None,description="id of the file that will be searched in the ro-crate-metadata.json file")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        space_object = Space.load(uuid=space_id)
        log.info(file_id)
        prerreturn = space_object.get_predicates_by_id(file_id=file_id)
        log.info(f"prereturn of get predicates by id: {prerreturn}")
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)

@router.get('/terms', status_code=200)
def get_terms_shacl(*, space_id: str = Path(None,description="space_id name")):
    #TODO from json select which shacl file should be taken
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    #read in shacl file 
    path_shacl = os.path.join(Locations().get_workspace_location_by_uuid(space_uuid=space_id),"all_constraints.ttl")
    print(path_shacl, file=sys.stderr)
    test = shclh.ShapesInfoGraph(path_shacl)
    shacldata = test.full_shacl_graph_dict()
    return shacldata

@router.post('/', status_code=200)
def make_annotations_for_all_resources(*,space_id: str = Path(None,description="space_id name"), item: AnnotationsModel):
    #get path of metadatafile
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    
    space_object = Space.load(uuid=space_id)
    space_object.add_predicates_all(toadd_dict=item.Annotations)
    data = space_object._read_metadata_datacrate()
        
    return {"data":data}

@router.delete('/', status_code=200)
def delete_annotations_for_all_resources(*,space_id: str = Path(None,description="space_id name"), item: AnnotationsModel):
    #get path of metadatafile
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    
    space_object = Space.load(uuid=space_id)
    space_object.delete_predicates_all(todelete_dict=item.Annotations)
    data = space_object._read_metadata_datacrate()
        
    return {"data":data}