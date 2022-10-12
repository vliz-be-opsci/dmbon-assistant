from fastapi import Path, HTTPException, APIRouter
from typing import Optional
from pydantic import BaseModel, Field
import os, json, time
import subprocess as sp
from datetime import datetime
import re
import logging
from app.model.location import Locations
log=logging.getLogger(__name__)

router = APIRouter(
    prefix="",
    tags=["Tasks"],
    responses={404: {"description": "Not found"}},
)

old_wd = os.getcwd()
if os.name == 'nt':
    use_shell = True
else:
    use_shell = False

#make boolean variable that is true when operating system is windows and else is false
#log.debug(f"current os is: {os.name}")

### define class profiles for the api ###
class UserDataModel(BaseModel):
    author: str = Field(None, description = "Name of the user, this will be used as author in datacrates")
    git_login: Optional[str] = Field(None, description = "Github login of the user")
    ORCID: Optional[str] = Field(None, description = "ORCID of the user")

### define helper functions for the api ###

### api paths ###

@router.get('/foldersetup', status_code=200)
def perform_foldersetup():
    #log.info("Performing foldersetup")
    # create the folders in the webtop-work-space
    # get the folder of this file 
    folder_file = os.path.dirname(os.path.realpath(__file__))
    #log.info(old_wd)
    #log.debug(f"current os is: {os.name}")
    
    #creat the following structure in the backend 
    # folder : old_wd > app > webtop-work-space
    # folder : old_wd > app > webtop-work-space > spaces
    # file   : old_wd > app > webtop-work-space > spaces.json # in this file put {}
    # file   : old_wd > app > webtop-work-space > profiles.json # in this file put {}
    # file   : old_wd > app > webtop-work-space > projects.json # in this file put {}
    # file   : old_wd > app > webtop-work-space > user_data.json # in this file put {}
    # file   : old_wd > app > webtop-work-space > ro-crate-metadata.json # in this file put { "@context": "https://w3id.org/ro/crate/1.1/context","@graph": [{"@id": "ro-crate-metadata.json","@type": "CreativeWork","about": {"@id": "./"},"conformsTo": {"@id": "https://w3id.org/ro/crate/1.1"}},{"@id": "./","@type": "Dataset","datePublished": "2021-11-25T11:27:08+00:00","hasPart": []}]}
    try:
        #check if the folders and files above exist
        if os.path.exists(os.path.join(old_wd,"app","webtop-work-space")):
            log.info("webtop-work-space folder exists")
        else:
            #make path 
            os.mkdir(os.path.join(old_wd,"app","webtop-work-space"))
            #log.info("webtop-work-space folder created")
        if os.path.exists(os.path.join(old_wd,"app","webtop-work-space","spaces")):
            log.info("spaces folder exists")
        else:
            os.mkdir(os.path.join(old_wd,"app","webtop-work-space","spaces"))
            #log.info("spaces folder created")
        if os.path.exists(os.path.join(old_wd,"app","webtop-work-space","spaces.json")):
            log.info("spaces.json file exists")
        else:  
            with open(os.path.join(old_wd,"app","webtop-work-space","spaces.json"), "w") as f:
                f.write("{}")
            #log.info("spaces.json file created")
            
        if os.path.exists(os.path.join(old_wd,"app","webtop-work-space","setup.json")):
            log.info("setup.json file exists")
        else:  
            with open(os.path.join(old_wd,"app","webtop-work-space","setup.json"), "w") as f:
                f.write("{}")
            #log.info("setup.json file created")
        
        if os.path.exists(os.path.join(old_wd,"app","webtop-work-space","profiles.json")):
            log.info("profiles.json file exists")
        else:
            with open(os.path.join(old_wd,"app","webtop-work-space","profiles.json"), "w") as f:
                f.write("{}")
            #log.info("profiles.json file created")
        if os.path.exists(os.path.join(old_wd,"app","webtop-work-space","projects.json")):
            log.info("projects.json file exists")
        else:
            with open(os.path.join(old_wd,"app","webtop-work-space","projects.json"), "w") as f:
                f.write("{}")
            #log.info("projects.json file created")
        if os.path.exists(os.path.join(old_wd,"app","webtop-work-space","user_data.json")):
            log.info("user_data.json file exists")
        else:
            with open(os.path.join(old_wd,"app","webtop-work-space","user_data.json"), "w") as f:
                f.write("{}") 
        if os.path.exists(os.path.join(old_wd,"app","webtop-work-space","ro-crate-metadata.json")):
            log.info("ro-crate-metadata.json file exists")
        else:
            with open(os.path.join(old_wd,"app","webtop-work-space","ro-crate-metadata.json"), "w") as f:
                f.write('{ "@context": "https://w3id.org/ro/crate/1.1/context","@graph": [{"@id": "ro-crate-metadata.json","@type": "CreativeWork","about": {"@id": "./"},"conformsTo": {"@id": "https://w3id.org/ro/crate/1.1"}},{"@id": "./","@type": "Dataset","datePublished": "2021-11-25T11:27:08+00:00","hasPart": []}]}')
            #log.info("ro-crate-metadata.json file created")
    except:
        raise HTTPException(status_code=500, detail="Foldersetup failed")
    
    return {'data':'Folder structure and support files all setup', 'next_task': None}

@router.get('/sshcheck', status_code=200)
def perform_sshcheck():
    #perform subprocess to convert all script in the shell folder from dos2unix
    try:
        new_wd = os.path.join(old_wd, "app", "shell_scripts")
        os.chdir(new_wd)
        convertscripts = sp.run(["dos2unix","*.sh"], stdout=sp.PIPE, stderr=sp.PIPE, shell=use_shell)
        if convertscripts.returncode == 0:
            log.info("convert scripts to unix done")
        #log.info(convertscripts.stdout.decode("utf-8"))
        #log.info(convertscripts.stderr.decode("utf-8"))
    except Exception as e:
        log.exception(e)
        raise HTTPException(status_code=500, detail="Convert scripts to unix failed")
    #log.info("Performing ssh setup")
    #perform a subrocess to setup the ssh keys "../shell_scripts/check_gitssh.sh"
    try:
        #get current wd
        new_wd = os.path.join(old_wd, "app", "shell_scripts")
        os.chdir(new_wd)
        sshcheck = sp.run(["bash","check-gitssh.sh"], capture_output=True, text=True, shell=use_shell)
        rc =  sshcheck.returncode
        sshcheck.check_returncode()
        #log.info(sshcheck.stdout)
        #log.info(sshcheck.stderr)
        #log.info(f'return code for sshcheck: {rc}')
        os.chdir(old_wd)
        #take the last echo as a new variable
        accountname = sshcheck.stdout.splitlines()[-1]
        #log.debug(f'accountname: {accountname}')
        #open user_data.json and check if the following keys exist [author, git_login, ORCID]
        with open(Locations().join_abs_path('user_data.json')) as data_file:
            data = json.load(data_file)
            #log.info(data)
        
        if len(accountname) > 0:
            #add the accountname to the user_data.json
            data['git_login'] = accountname
        
            #save the user_data.json
            with open(Locations().join_abs_path('user_data.json'), 'w') as outfile:
                json.dump(data, outfile)
                
            for key in ['author', 'git_login', 'ORCID']:
                if key not in data:
                    return {
                        'data':'ssh-check successfull', 
                        'next_task': {
                            'TaskRequest': 'adduserdata', 
                            'TaskDescription': 'Add user data', 
                            'TypeRequest': 'post', 
                            'Payload': [
                                {
                                "label": "author",
                                "type": "string",
                                "description": "Name user, will be used as author for all commits"
                                },
                                {
                                "label": "ORCID",
                                "type": "string",
                                "description": "ORCID user, leave empty if you don't have one"          
                                }
                            ]
                        }
                    }
            return {'data':'SSH key and user info all setup', 'next_task': None}
        else:
            return {'data':'SSH key all setup', 
                    'next_task': {
                            'TaskRequest': 'make_ssh_key', 
                            'TaskDescription': 'Making ssh key', 
                            'TypeRequest': 'get', 
                            'Payload': []
                        }
                    }    
        
    except Exception as e:
        log.error("Error performing ssh setup")
        log.error(e)
        #log.info(sshcheck.stdout)
        #log.info(sshcheck.stderr)
        os.chdir(old_wd)
        raise HTTPException(status_code=500, detail = {"data": e})  

@router.post('/adduserdata', status_code=200)
def post_user_data(item:UserDataModel):
    
    #open op the user_data.json and check if the following keys exist [author, git_login, ORCID]
    with open(Locations().join_abs_path('user_data.json')) as data_file:
        data = json.load(data_file)
        #log.info(data)
    #log.debug("post_user_data")
    # go over data in items and update the user_data.json
    for key, value in item:
        # check if value is not empty and not of type Null
        if value is not None and value != "":
            data[key] = value
            #log.info(data)
        else:
            log.info(f'{key} is empty')
    #write data to user_data.json
    with open(Locations().join_abs_path('user_data.json'), 'w') as outfile:
        json.dump(data, outfile)
    
    return {"data":"successfully added userdata",'next_task': {
                            'TaskRequest': 'finishsetup', 
                            'TaskDescription': 'finishing setup', 
                            'TypeRequest': 'get', 
                            'Payload': []
                        }}         

@router.get('/make_ssh_key', status_code=200)   
def make_ssh_key():
    #perform a subrocess to setup the ssh keys "../shell_scripts/make-git-sshkey.sh"
    try:
        new_wd = os.path.join(old_wd, "app", "shell_scripts")
        os.chdir(new_wd)
        make_ssh_key = sp.run(["bash","make-git-sshkey.sh"], capture_output=True, text=True, shell=use_shell)
        rc = make_ssh_key.returncode
        #log.debug(f'return code for make_ssh_key: {rc}')
        output = make_ssh_key.stdout
        error = make_ssh_key.stderr
        os.chdir(old_wd)
        return {'data':output,
                'next_task': {
                            'TaskRequest': 'connect_ssh_key', 
                            'TaskDescription': 'Connect SSH key', 
                            'TypeRequest': 'get', 
                            'Payload': []
                        }
                }
    except Exception as e:
        os.chdir(old_wd)
        raise HTTPException(status_code=500, detail={"data": e})

@router.get('/connect_ssh_key', status_code=200)
def connect_ssh_key():
    try:
        #perform subprocess to connect the ssh key "../shell_scripts/connect-sshkey.sh"
        new_wd = os.path.join(old_wd, "app", "shell_scripts")
        os.chdir(new_wd)
        connect_ssh_key = sp.run(["bash","connect-sshkey.sh"], capture_output=True, text=True, shell=use_shell)
        rc = connect_ssh_key.returncode
        output = connect_ssh_key.stdout
        #log.debug(output)
        error = connect_ssh_key.stderr
        os.chdir(old_wd)
        
        return_output = ""
        find_elements = ["KEY_USER_LOCATION", "INSTRUCTION_URL", "REGISTER_URL", "KEY_USER_NAME", "TO_PASTE_TEXT"]
        variables = {}
        for element in find_elements:
            splittext = "###"+element+"###"
            variables[element] = output.split(splittext)[-1].split("###")[0]
        
        #log.debug(variables)
        
        return_output += f"<p>To connect your SSH key, please visit the following URL:</p>"
        return_output += f"<p><a href='{variables['REGISTER_URL']}'>{variables['REGISTER_URL']}</a></p>"
        return_output += f"<p>Then, copy the following text and paste it into the SSH key field:</p>"
        return_output += f"<p><code> ---- </code></p>"
        return_output += f"<p><code>{variables['TO_PASTE_TEXT']}</code></p>"
        return_output += f"<p><code> ---- </code></p>"
        return_output += f"<p>After this is done, click on the ssh-check button.</p>"
        return_output += f"<a href='.'><button class='large connectcheck'>ssh-check</button></a>"
        
        return {'data':return_output, 
                'next_task': None
                }
    except Exception as e:
        os.chdir(old_wd)
        raise HTTPException(status_code=500, detail={"data": e})
    
@router.get('/finishsetup', status_code=200)
def finishsetup():
    try:
        #open the setup.json file and change complete to true
        with open(Locations().join_abs_path('setup.json')) as data_file:
            data = json.load(data_file)
        data['complete'] = True
        with open(Locations().join_abs_path('setup.json'), 'w') as outfile:
            json.dump(data, outfile)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"data": e})
    
@router.get('/checkcompletestatus', status_code=200)
def checkcompletestatus():
    #open the setup.json file and check if the complete is set to true
    with open(Locations().join_abs_path('setup.json'), 'r') as data_file:
        data = json.load(data_file)
    
    if data['complete'] == True:
        return {'data':'setup is complete'}
    else:
        raise HTTPException(status_code=500, detail={"data": "setup is not complete"})
    