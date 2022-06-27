from fastapi import Path, HTTPException, APIRouter
from typing import Optional
from pydantic import BaseModel, Field
import os, json, time
import subprocess as sp
from datetime import datetime
import re
import logging
log=logging.getLogger(__name__)

router = APIRouter(
    prefix="",
    tags=["Tasks"],
    responses={404: {"description": "Not found"}},
)

### define class profiles for the api ###
class UserDataModel(BaseModel):
    name: str = Field(None, description = "Name of the user, this will be used as author in datacrates")
    ORCID: Optional[str] = Field(None, description = "ORCID of the user")

### define helper functions for the api ###

### api paths ###

@router.get('/foldersetup', status_code=200)
def perform_foldersetup():
    log.info("Performing foldersetup")
    time.sleep(5)
    return {'data':'Folder structure and support files all setup'}

@router.get('/sshsetup', status_code=200)
def perform_sshsetup():
    #perform a subrocess to setup the ssh keys "../shell_scripts/check_gitssh.sh"
    log.info("Performing ssh setup")
    old_wd = os.getcwd()
    try:
        #get current wd
        new_wd = os.path.join(old_wd, "app", "shell_scripts")
        os.chdir(new_wd)
        sshcheck = sp.run(["sh","check-gitssh.sh"], capture_output=True, text=True)
        rc =  sshcheck.returncode
        sshcheck.check_returncode()
        log.info(sshcheck.stdout)
        log.info(sshcheck.stderr)
        log.info(f'return code for sshcheck: {rc}')
        os.chdir(old_wd)
        return {'data':'SSH key all setup'}
    except Exception as e:
        log.error("Error performing ssh setup")
        log.error(e)
        os.chdir(old_wd)
        raise HTTPException(status_code=500, detail = {"data": e})
    

@router.post('/adduserdata', status_code=200)
def post_user_data(item:UserDataModel):
    time.sleep(2)
    return {"data":"successfully added userdata"}