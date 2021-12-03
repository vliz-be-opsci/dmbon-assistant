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

router = APIRouter(
    prefix="/git",
    tags=["Git"],
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

@router.get('/status/', status_code=200)
def get_git_status(*,space_id: str = Path(None,description="space_id name")):
    toreturn =[]
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    #function to pull data from remote if remote was provided and if pulse finds diff 
    try:
        repo = git.Repo(space_folder)
    except:
        repo = git.Repo(os.path.join(space_folder,"project"))
    print(repo.heads)
    hcommit = repo.head.commit
    diff_list = hcommit.diff()
    difff_list = hcommit.diff(ignore_blank_lines=True, ignore_space_at_eol=True,create_patch=True)
    print(diff_list, file=sys.stderr)
    i = 0
    for diff in diff_list:
        try:
            toappend = {}
            print(diff.change_type) # Gives the change type. eg. 'A': added, 'M': modified etc.
            toappend["change_type"] = diff.change_type
            # Returns true if it is a new file
            print(diff.new_file) 
            toappend["newfile"] = diff.new_file
            # Print the old file path
            print(diff.a_path)
            toappend["a_path"] = diff.a_path
            # Print the new file path. If the filename (or path) was changed it will differ
            print(diff.b_path) 
            toappend["b_path"] = diff.b_path
            toappend["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f %z")
            # text of diff make unified diff first 
            unified_diff = "--- "+diff.a_path+" "+datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f %z")+"\n"
            unified_diff = unified_diff+"+++ "+diff.b_path+" "+datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f %z")+"\n"
            tocleandiff = str(difff_list[i])
            ofinterst = tocleandiff.split("---")[1].split("\ No newline at end of file")[0]
            unified_diff = unified_diff + ofinterst
            toappend['text'] = unified_diff
            toreturn.append(toappend)
            i+=1
        except:
            pass
    return {'data':toreturn}

@router.post('/{command}}', status_code=200)
def get_git_status(*,space_id: str = Path(None,description="space_id name"),command: str = Path("commit",description="git command to use (commit,pull,push)")):
    toreturn =[]
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        repo = git.Repo(space_folder)
    except:
        repo = git.Repo(os.path.join(space_folder,"project"))
        
    if command != "commit" and command != "push" and command != "pull":
        raise HTTPException(status_code=400, detail="No valid command given, valid commands are (commit,push,pull)")

    #repo commit
    if command == "commit":
        try:
            print("before commit", file=sys.stderr)
            repo.index.commit("RO-crate API commit")   # <--- TODO: ADD user to the commit message for better cross scientists performance
            print("after commit", file=sys.stderr)
            return {"data":"{} successfull".format(str(command))}
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
    
    try:
        print(repo.remote().refs, file=sys.stderr)
    except:
        raise HTTPException(status_code=400, detail="repo has no remote references to push or pull to.")

    # try and do push pull
    if command == "push":
        try:
            origin = repo.remote(name='origin')
            origin.push()
            return {"data":"{} successfull".format(str(command))}
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
    
    if command == "pull":
        try:
            origin = repo.remote(name='origin')
            origin.pull()
            return {"data":"{} successfull".format(str(command))}
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
