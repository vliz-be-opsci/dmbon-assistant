from logging import exception
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
import subprocess
import validators
from collections import MutableMapping
from fastapi.staticfiles import StaticFiles
import glob
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
import platform


def showFileExplorer(file):  # Path to file (string)
    if platform.system() == "Windows":
        import os
        os.startfile(file)
    elif platform.system() == "Darwin":
        import subprocess
        subprocess.call(["open", "-R", file])
    else:
        import subprocess
        subprocess.Popen(["xdg-open", file])

router = APIRouter(
    prefix="/content",
    tags=["Content"],
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

class ReferenceModel(BaseModel):
    URL     : str = Field(None, description = "url of the reference that needs to be added to the ROCrate.")

class AnnotationModel(BaseModel):
    URI_predicate_name : str = Field(None, description = "Name of the URI that will be added, must be part of the RO-crate profile provided metadata predicates.\
                                                for more info about the allowed predicates, use TODO: insert api call for predicates here.")
    value    : str = Field(None, description = "Value linked to the URI predicate name chosen")

class AnnotationsModel(BaseModel):
    Annotations: List[AnnotationModel] = Field(None, description = "List of annotations to add to resource. \
                                              for more info about the allowed annotation predicates, use TODO: insert api call for predicates here.")

class ListReferenceModel(BaseModel):
    references: List[ReferenceModel] = Field(None, description = "List of references to add to the ROCrate.")

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

@router.get('/')
def get_space_content_info(*,space_id: str = Path(None,description="space_id name")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    toreturn = []
    for (dirpath, dirnames, filenames) in os.walk(space_folder):
        for filen in filenames:
            if '.git' not in dirpath:
                toreturn.append({"file":filen,"folder":dirpath})
    return toreturn

@router.get('/file/{file_id}')
def open_file_content_external(*,space_id: str = Path(None,description="space_id name"),file_id: str = Path(None,description="id of the file that will be searched in the ro-crate-metadata.json file")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
            #TODO: this wil only work if the file is in the root of the datacrate, find way to make it work for non root files
            #TODO: find a way to make this work for non windows systems
            #find the file_id in the space_folder by looping over the folders and files in the space_folder
            for (dirpath, dirnames, filenames) in os.walk(space_folder):
                for filen in filenames:
                    if filen == file_id:
                        showFileExplorer(os.path.join(dirpath,filen))
            #os.startfile(os.path.join(space_folder,file_id), "open")
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    return "file opened successfully"

@router.get('/openexplorer')
def open_file_explorer(*,space_id: str = Path(None,description="space_id name")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
            log.debug(space_folder)
            formatted_space_folder = space_folder.replace("/","\\")
            log.debug(formatted_space_folder)
            string_command = 'explorer "' + formatted_space_folder + '"'
            log.debug(string_command)
            subprocess.Popen(string_command)
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    return "file-explorer opened successfully"

@router.post('/', status_code=202)
async def add_new_content(*,space_id: str = Path(None,description="space_id name"), item: ContentModel, path_folder: Optional[str] = None):  
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")

    if path_folder != None:
        space_folder = os.path.join(os.sep.join((data[space_id]['storage_path'])), path_folder) 
        try:
            pads(space_folder).mkdir(parents=True, exist_ok=True)
        except:
            raise HTTPException(status_code=400, detail="Directory could not be made")

    datalog = []
    crate = ROCrate(space_folder)
    repo = git.Repo(data[space_id]['storage_path'])
    for content_item in item.content:
        #check if file or url are present
        if (content_item.content == None and content_item.name == None):
            content_present = False
        #check if only url prsent:
        if ('.html' in content_item.content or 'http' in content_item.content):
            try:
                crate.add_file(content_item.content, fetch_remote = False)
            except Exception as e:
                datalog.append({content_item.content:e})
        #check if content_item.content is a directory
        if os.path.isdir(content_item.content):
            try:
                crate.add_directory(content_item.content,str(os.sep.join((space_folder,os.path.basename(os.path.normpath(content_item.content))))))
            except Exception as e:
                datalog.append({content_item.content:e})
        else:
            try:
                print("trying to add {}".format(content_item.content), file=sys.stderr)
                crate.add_file(content_item.content)
            except Exception as e:
                datalog.append({content_item.content:e})
    crate.write_crate(space_folder)
    try:
        crate.write_crate(space_folder)
    except:
        #auto resolve the crate by calling the space fixcrate 
        toposturl = 'http://localhost:6656/apiv1/spaces/'+space_id+'/fixcrate' #TODO : figure out how to not hardcode this <---
        async with ClientSession() as session:
            response = await session.request(method='GET', url=toposturl)
    repo.git.add(all=True)
    if len(datalog) > 0:
        raise HTTPException(status_code=400, detail=datalog)

    return {'Data':'all content successfully added to space'}

@router.post('/reference', status_code=202)
async def add_new_references(*,space_id: str = Path(None,description="space_id name"), item: ListReferenceModel):  
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
        
    datalog = []
    crate = ROCrate(space_folder)
    repo = git.Repo(data[space_id]['storage_path'])
    for reference in item.references:
        #check if given item.URL is valid
        valid=validators.url(reference.URL)
        if valid:
            log.debug("add reference to the rocrate")
            try:
                crate.add_file(reference.URL, fetch_remote = False)
            except Exception as e:
                datalog.append({reference.URL:e})
        else:
            raise HTTPException(status_code=400, detail="Non valid URL given")
    try:
        crate.write_crate(space_folder)
    except Exception as e:
        log.error(f"crate write error :{e}")
        log.exception(e)
        
    repo.git.add(all=True)
    if len(datalog) > 0:
        raise HTTPException(status_code=400, detail=datalog)

    return {'Data':'all content successfully added to space'}

@router.delete('/', status_code=202)
def delete_content(*,space_id: str = Path(None,description="space_id name"), item: DeleteContentModel):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
        
    repo = git.Repo(data[space_id]['storage_path'])
    crate = ROCrate(space_folder)
    try:
        for content_item in item.content:
            crate.delete(crate.dereference(content_item))
            del_path = os.path.join(space_folder,content_item)
            os.remove(del_path)
        crate.write_crate(space_folder)
    except:
        for content_item in item.content:
            print("to delete content: " + content_item, file=sys.stderr)
            #find the file that must be deleted
            to_find_delete = glob.glob(space_folder + "/**/"+content_item, recursive = True)
            for qzef in to_find_delete:
                print("to delete content path : " + qzef, file=sys.stderr)
                os.remove(qzef)
            #open the rocrate metadata.json and delete the id from the rocrate 
            with open(os.path.join(space_folder, 'ro-crate-metadata.json')) as json_file:
                data = json.load(json_file)
            for i in range(len(data['@graph'])):
                try:
                    if data['@graph'][i]['@id'] == content_item:
                        del data['@graph'][i]
                except:
                    pass
                try:
                    for parto in range(len(data['@graph'][i]['hasPart'])):
                        if data['@graph'][i]['hasPart'][parto]["@id"] == content_item:
                            del data['@graph'][i]['hasPart'][parto]
                except:
                    pass
            
            #write the rocrate file back 
            with open(os.path.join(space_folder, 'ro-crate-metadata.json'), 'w') as json_file:
                json.dump(data, json_file)

    repo.git.add(all=True)
    return {'Data':'all content successfully deleted from space :TODO: currently delete function is not working'}

@router.get('/{path_folder:path}')
def get_space_content_folder_info(*,space_id: str = Path(None,description="space_id name"), path_folder: str = Path(None,description="folder  path to get the files from")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            allpaths = path_folder
            if(path_folder == "/"):
                space_folder = data[space_id]['storage_path']
                log.debug(space_folder)
            else:
                space_folder = os.path.join(data[space_id]['storage_path'], path_folder)
                log.debug(space_folder)

        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    toreturn = []
    for (dirpath, dirnames, filenames) in os.walk(space_folder):
        for filen in filenames:
            if '.git' not in dirpath:
                log.info(f"{dirpath}/{filen}")
                toreturn.append({"file":filen,"folder":dirpath})
    return {'Data':toreturn}