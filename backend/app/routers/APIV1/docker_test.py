from fastapi import Path, HTTPException, APIRouter
from fastapi.responses import StreamingResponse
from typing import Optional
from pydantic import BaseModel, Field
import os, json, git
from datetime import datetime
import re
from app.model.location import Locations
from app.model.space import Space
import logging
from fastapi.responses import JSONResponse
import io
log=logging.getLogger(__name__)

router = APIRouter(
    prefix="",
    tags=["test","docker"],
    responses={404: {"description": "Not found"}},
)

#get route that will give back a ls -al of the locations()

@router.get("/")
def get_root():
    loc = Locations()
    #get parent dir of loc
    parent = os.path.dirname(loc.root)
    #ls -al of parent dir
    parent_ls = os.listdir(parent)
    #sister dir /workspace
    workspace_dir = os.path.join(parent,"workspace")
    #sister dir /workspace ls -al
    try:
        workspace_dir_ls = os.listdir(workspace_dir)
    except FileNotFoundError:
        log.error(f"workspace_dir_ls not found")
        workspace_dir_ls = "Not Found"
    
    return {"locations": loc,
            "parent": {
                "path": parent,
                "content": parent_ls
                }, 
            "workspace_dir":{
                "path": workspace_dir,
                "content": workspace_dir_ls
            }}
    
#route to check if the docker container has .ssh folder and if it has the correct permissions and content
@router.get("/ssh")
def get_ssh_info():
    ssh_path = os.path.join(os.path.expanduser("~"),".ssh")
    ssh_content = os.listdir(ssh_path)
    ssh_permissions = oct(os.stat(ssh_path).st_mode)[-3:]
    
    #for each file in ssh_content cat the file and return the content
    file_contents = {}
    for file in ssh_content:
        #read the file
        with open(os.path.join(ssh_path,file), "r") as f:
            file_contents[file] = f.read()
        
        
    
    return {"ssh_path": ssh_path,
            "ssh_content": ssh_content,
            "ssh_permissions": ssh_permissions,
            "file_contents": file_contents
    }
    