from fastapi import Path, HTTPException, APIRouter
from typing import List, Optional
from pydantic import BaseModel, Field
import os, json, sys, git, subprocess
from aiohttp import ClientSession
from rocrate.rocrate import ROCrate
from pathlib import Path as pads
import subprocess
import validators
import requests
import uuid as uuidmake
import glob
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
        try:
            import subprocess
            subprocess.Popen(["xdg-open", file])
        except:
            #try and see what file is and then try and change the directory to that file to the windows explorer path 
            log.info(file)
            import os
            os.startfile(file)

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
class FileModel(BaseModel):
    name     : str = Field(None, description = "Name of the file that will be added, can be filepath")
    content  : str = Field(None, description = "Filepath that needs to be added to the space, can also be a directory or url")

class ReferenceModel(BaseModel):
    URL     : str = Field(None, description = "url of the reference that needs to be added to the ROCrate.")

class ListReferenceModel(BaseModel):
    references: List[ReferenceModel] = Field(None, description = "List of references to add to the ROCrate.")

class ContentModel(BaseModel):
    content: List[FileModel] = Field(None, description = "List of files that need to be added, this list can also contain directories")

class DeleteContentModel(BaseModel):
    content: List[str] = Field(None, description = "List of files to delete , if full path given it will delete one file , of only file name given it will delete all entities in the system with file name.")

### define helper functions for the api ###

### api paths ###

@router.get('/')
def get_space_content_info(*,space_id: str = Path(description="space_id name")):
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
                toreturn.append({"file":filen,"folder":dirpath,"type":"file"})
    
    #open up the rocrate metadata.json file and loop over all the entries in the @graph and add the ids that are not yet in the toreturn["file"] list 
    space_object = Space.load(uuid=space_id)
    metadata = space_object._read_metadata_datacrate()
    #log.info(metadata)
    for entry in metadata['@graph']:
        found = 0
        for item in toreturn:
            if item["file"] == entry["@id"]:
                found = 1
        if found == 0:
            if "@type" in entry:
                if entry["@type"] == "File":
                    toreturn.append({"file":entry["@id"],"folder":"/", "type":"reference"})
                else: 
                    if entry["@type"] != "Dataset":
                        toreturn.append({"file":entry["@id"],"folder":"/", "type":entry["@type"]})
            
    return toreturn
@router.get('/openexplorer')
def open_file_explorer(*,space_id: str = Path(description="space_id name")):
    #log.debug(space_id)
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        #log.debug(data)
        #log.debug(space_id)
        try:
            space_folder = data[space_id]['storage_path']
            #log.debug(space_folder)
            
            formatted_space_folder = space_folder.replace("/","\\")
            #log.debug(formatted_space_folder)
            #string_command = 'explorer "' + formatted_space_folder + '"'
            #log.debug(string_command)
            #subprocess.Popen(string_command)
            
            #generate random uuid
            uuid = uuidmake.uuid4().hex
            #echo "os.environ.get("BASE_FILE_URL")+space_folder.split("workspace/")[-1]+os.path.sep+path_spec" > /code/app/workspace/toopen.txt
            os.system("echo "+os.environ.get("BASE_FILE_URL")+" > /code/app/workspace/toopen_"+str(uuid)+".txt")
            
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    return "file-explorer opened successfully"

@router.post('/reference', status_code=202) #TODO fix broken reference adding
async def add_new_references(*,space_id: str = Path(description="space_id name"), item: ListReferenceModel):  
    try:
        
        with open(Locations().join_abs_path('spaces.json'), "r+") as file:
            data = json.load(file)
            try:
                space_folder = data[space_id]['storage_path']
            except Exception as e:
                raise HTTPException(status_code=404, detail="Space not found")
            
        datalog = []
        #TODO adding refrences is not working anymore with current rocrate python module
        #crate = ROCrate(space_folder)
        repo = git.Repo(data[space_id]['storage_path'])
        for reference in item.references:
            #check if given item.URL is valid
            valid=validators.url(reference.URL)
            if valid:
                #log.debug("add reference to the rocrate")
                try:
                    log.info("adding reference to the rocrate")
                    #get info from url by performing a HEAD request
                    head_ref = requests.head(reference.URL)
                    log.info(head_ref.headers)
                    
                    #get head_ref.headers['Content-Type'] and if html in there set type = "website" else set type = "file"
                    # if type is file then get Content-Disposition and if there is a filename then set name = filename else set name = url, and get content length and set ContentSize = content length
                    if "text/html" in head_ref.headers['Content-Type']:
                        content_type = "Website"
                        toaddcrate = {
                            "@id":reference.URL,
                            "@type": content_type
                        }            
                    else:
                        toaddcrate = {
                            "@id":reference.URL,
                            "@type": "File",
                            "contentSize": head_ref.headers['Content-Length'],
                            "fileName": head_ref.headers['Content-Disposition'].split("filename=")[1]   
                        }
                    #append toaddcrate to rocratemetadata.json
                    with open(os.path.join(space_folder, 'ro-crate-metadata.json')) as json_file:
                        datao = json.load(json_file)
                    datao['@graph'].append(toaddcrate)
                    with open(os.path.join(space_folder, 'ro-crate-metadata.json'), 'w') as outfile:
                        json.dump(datao, outfile)
                    
                    #crate.add_file(reference.URL, fetch_remote = False)
                except Exception as e:
                    datalog.append({reference.URL:e})
            else:
                raise HTTPException(status_code=400, detail="Non valid URL given")
        try:
            log.info("writing rocrate rocrate")
            #crate.write_crate(space_folder)
        except Exception as e:
            log.error(f"crate write error :{e}")
            log.exception(e)
            
        repo.git.add(all=True)
        if len(datalog) > 0:
            raise HTTPException(status_code=400, detail=datalog)

        return {'Data':'all content successfully added to space'}
    except Exception as e:
        log.error(f"add_new_references error :{e}")
        log.exception(e)
        raise HTTPException(status_code=400, detail=e)

@router.get('/{path_spec:path}')
def open_file_content_external(*,space_id: str = Path(description="space_id name"), path_spec: str = Path(description="content path (relative to crate pointing to file or folder) to get the info from")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
            
            #replace the + in the filen bu the os.path.sep()
            #log.debug(path_spec)
            #log.info("performing os.path.join on file_id")
            path_spec = path_spec.replace('/',os.path.sep)
            #log.debug(path_spec)
            log.debug(space_folder+os.path.sep+path_spec)
            
            #path to repo is os.environ.get("BASE_FILE_URL")+storage_path.split("workspace/")[-1]
            log.debug(os.environ.get("BASE_FILE_URL")+space_folder.split("workspace/")[-1]+os.path.sep+path_spec)
            
            #echo "os.environ.get("BASE_FILE_URL")+space_folder.split("workspace/")[-1]+os.path.sep+path_spec" > /code/app/workspace/toopen.txt
            uuid = uuidmake.uuid4().hex
            os.system("echo "+os.environ.get("BASE_FILE_URL")+space_folder.split("workspace/")[-1]+os.path.sep+path_spec+" > /code/app/workspace/toopen_"+str(uuid)+".txt")
            
            return os.environ.get("BASE_FILE_URL")+space_folder.split("workspace/")[-1]+os.path.sep+path_spec
            
            showFileExplorer(space_folder+os.path.sep+path_spec)
            '''
            #find the file_id in the space_folder by looping over the folders and files in the space_folder
            for (dirpath, dirnames, filenames) in os.walk(space_folder):
                for filen in filenames:
                    if filen == file_id:
                        showFileExplorer(os.path.join(dirpath,filen))
            '''
            
            #os.startfile(os.path.join(space_folder,file_id), "open")
        except Exception as e:
            log.error(e)
            raise HTTPException(status_code=404, detail="Space not found")
    return "file opened successfully"