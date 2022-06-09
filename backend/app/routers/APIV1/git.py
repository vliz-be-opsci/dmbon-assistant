from fastapi import Path, HTTPException, APIRouter
from typing import Optional
from pydantic import BaseModel, Field
import os, json, git
from datetime import datetime
import re
import logging
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

@router.get('/status/', status_code=200)
def get_git_status(*,space_id: str = Path(None,description="space_id name")):
    toreturn =[]
    with open(os.path.join(os.getcwd(),"app","webtop-work-space","spaces.json"), "r+") as file:
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
        pulls = "not available for this space"
        
    #check if there are any unstaged files in the repo 
    diff_list = repo.index.diff(None)
    try:
        diff = str(repo.git.diff('origin')).splitlines()
        log.info("before null")
        log.info(diff)
    except Exception as e:
        log.error(e)
        log.exception(e)
    
    hcommit = repo.head.commit
    #diff_list = hcommit.diff()
    difff_list = repo.index.diff(None,ignore_blank_lines=True, ignore_space_at_eol=True,create_patch=True)
    log.debug(difff_list)
    i = 0
    for diff in diff_list:
        try:
            toappend = {}
            log.info(diff.change_type) # Gives the change type. eg. 'A': added, 'M': modified etc.
            toappend["change_type"] = diff.change_type
            # Returns true if it is a new file
            log.info(diff.new_file) 
            toappend["newfile"] = diff.new_file
            # Print the old file path
            log.info(diff.a_path)
            toappend["a_path"] = diff.a_path
            # Print the new file path. If the filename (or path) was changed it will differ
            log.info(diff.b_path) 
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
    
    
    return {'data':toreturn, 'message':pulls, 'dirty':repo.is_dirty(), 'ahead':ahead, 'behind':behind}

@router.post('/{command}', status_code=200)
def get_git_status(*,space_id: str = Path(None,description="space_id name"),command: str = Path("commit",description="git command to use (commit,pull,push)"), item:GitCommitMessageModel):
    toreturn =[]
    with open(os.path.join(os.getcwd(),"app","webtop-work-space","spaces.json"), "r+") as file:
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