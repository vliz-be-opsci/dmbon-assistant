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
    prefix="/git",
    tags=["Git"],
    responses={404: {"description": "Not found"}},
)

### define class profiles for the api ###
class GitCommitMessageModel(BaseModel):
    message: Optional[str] = Field(None, description = "Commit message")

### define helper functions for the api ###

### api paths ###

@router.get("/diff", status_code=200)
def get_git_diff(*,space_id: str = Path(None,description="space_id name")):
    """Get the git diff of the current working directory"""
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    
    #function to pull data from remote if remote was provided and if pulse finds diff 
    try:
        repo = git.Repo(space_folder)
    except Exception as e:
        log.error(e);
        repo = git.Repo(os.path.join(space_folder,"repo"))
    
    diff_list = repo.git.diff(repo.head.commit)
    log.debug(len(str(diff_list)))
    diff_bytes = bytes(diff_list, 'utf-8','surrogateescape')
    return StreamingResponse(io.BytesIO(diff_bytes), media_type="text/plain")

@router.get('/status/', status_code=200)
def get_git_status(*,space_id: str = Path(None,description="space_id name")):
    log.debug("get_git_status")
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    #function to pull data from remote if remote was provided and if pulse finds diff 
    try:
        repo = git.Repo(space_folder)
    except Exception as e:
        log.error(e);
        repo = git.Repo(os.path.join(space_folder,"repo"))
    
    #perform a fetch on the git repo
    log.info("Fetching remote")
    repo.git.fetch()
    
    ahead = 0
    behind = 0
    # check if the repo has a remote url
    log.info("Checking if remote is set")
    try:
        #check if the remote origin has commits that haven't been pulled yet
        repo_status = repo.git.status(porcelain="v2", branch=True)
        ahead_behind_match = re.search(r"#\sbranch\.ab\s\+(\d+)\s-(\d+)", repo_status)
        # If no remotes exist or the HEAD is detached, there is no ahead/behind info
        if ahead_behind_match:
            ahead = int(ahead_behind_match.group(1))
            behind = int(ahead_behind_match.group(2))
        pulls = "Repo is {} commits ahead and {} behind.".format(ahead, behind)
    except:
        log.info("No remote set")
        pulls = "not available for this space"
        
    return {'message':pulls, 'dirty':repo.is_dirty(), 'ahead':ahead, 'behind':behind}

@router.post('/{command}', status_code=200)
def get_git_status(*,space_id: str = Path(None,description="space_id name"),command: str = Path("commit",description="git command to use (commit,pull,push)"), item:GitCommitMessageModel):
    toreturn =[]
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        repo = git.Repo(space_folder)
    except:
        repo = git.Repo(os.path.join(space_folder,"repo"))
        
    if command != "commit" and command != "push" and command != "pull":
        raise HTTPException(status_code=400, detail="No valid command given, valid commands are (commit,push,pull)")

    #repo commit
    if command == "commit":
        try:
            #get all the changed files in the repo and add them to the index
            repo.git.add(all=True)
            if item.message == "":
                raise HTTPException(status_code=400, detail="No commit message given")
            else:
                repo.index.commit(item.message)
                return {"data":"{} successfull".format(str(command))}
        except Exception as e:
            log.error(f'an error occured when trying to commit : {e}')
            log.exception(e)
            raise HTTPException(status_code=500, detail=e)
    
    try:
        log.debug(repo.remote().refs)
    except:
        raise HTTPException(status_code=400, detail="repo has no remote references to push or pull to.")

    # try and do push pull
    if command == "push":
        try:
            origin = repo.remote(name='origin')
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
        origin.push()
        return {"data":"{} successfull".format(str(command))}
        
    if command == "pull":
        try:
            origin = repo.remote(name='origin')
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
        origin.pull()
        return {"data":"{} successfull".format(str(command))}
    

@router.get('/history/', status_code=200)
def get_git_history(*,space_id: str = Path(None,description="space_id name")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        space_object = Space.load(uuid=space_id)
        prerreturn = space_object.get_git_history()
        #log.info(f"prereturn of get predicates by id: {prerreturn}")
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)