from fastapi import FastAPI, Path, Query, HTTPException, status
from typing import List, Optional, Set
from pydantic import BaseModel, Field
import os, json, requests, asyncio, sys, aiohttp, shutil, git, uuid, subprocess
from datetime import datetime
from aiohttp import ClientSession
from rocrate.rocrate import ROCrate
from pathlib import Path as pads
from collections import MutableMapping

app = FastAPI(
    title = 'RO-Crate-API',
    description='RO-Crate manager Rest-API'
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

class ContentModel(BaseModel):
    content: List[FileModel] = Field(None, description = "List of files that need to be added, this list can also contain directories")

class DeleteContentModel(BaseModel):
    content: List[str] = Field(None, description = "List of files to delete , if full path given it will delete one file , of only file name given it will delete all entities in the system with file name.")

### define helper functions for the api ###

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

@app.get('/', tags=["test"], status_code=418)
def home():
    return {'Message':'Waddup OpSci, docs can be found in the /docs route'}

@app.get('/profiles/',tags=["Profiles"])
def get_all_profiles_info():
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+") as file:
        data = json.load(file)
        return data

@app.get('/profiles/{profile_id}/',tags=["Profiles"])
def get_profile_info(profile_id: str = Path(None,description="profile_id name")):
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[profile_id]
            return toreturn
        except Exception as e:
            raise HTTPException(status_code=404, detail="profile not found")

@app.delete('/profiles/{profile_id}/',tags=["Profiles"], status_code=202)
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

@app.post('/profiles/',tags=["Profiles"], status_code=201)
def add_profile(*,item: ProfileModel):
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+")as file:
        data = json.load(file)
        profile_id = uuid.uuid4().hex
        if profile_id in data.keys():
            raise HTTPException(status_code=400, detail="Profile already exists")
        if item.logo != None or item.description != None or item.url_ro_profile != None:
            data[profile_id]= {'logo':item.logo,'description':item.description,'url_ro_profile':item.url_ro_profile}
            with open(os.path.join(os.getcwd(),"app","workflows.json"), "w") as file:
                json.dump(data, file)   
            return {'Message':'Profile added',"profile_id": profile_id}
        else:
            keys = dict(item).keys()
            raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))

@app.put('/profiles/{profile_id}/',tags=["Profiles"], status_code=202)
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

@app.get('/spaces/',tags=["Spaces"])
def get_all_spaces():
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+")as file:
        data = json.load(file)
        return data

@app.get('/spaces/{space_id}/',tags=["Spaces"])
def get_space_info(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            return toreturn
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")

@app.delete('/spaces/{space_id}/',tags=["Spaces"], status_code=202)
def delete_space(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"app","projects.json")) as data_file:
            data = json.load(data_file)
            try:
                #delete the folder where the project was stored
                shutil.rmtree(data[space_id]["storage_path"])
                del data[space_id]
            except Exception as e:
                raise HTTPException(status_code=500, detail="Space delete failed") 
    with open(os.path.join(os.getcwd(),"app","projects.json"), 'w') as data_file:
        data = json.dump(data, data_file)    
        return {'message':'successfully deleted space'}

@app.post('/spaces/',tags=["Spaces"], status_code=201)
async def add_space(*,item: SpaceModel):
    tocheckpath = str(item.storage_path)
    returnmessage = "Space created in folder: " + str(os.path.join(tocheckpath))
    space_id = uuid.uuid4().hex
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+")as file:
        data = json.load(file)
        if space_id in data.keys():
            raise HTTPException(status_code=400, detail="Space already exists")
        check_aval = await check_path_availability(tocheckpath,space_id)
        returnmessage = check_aval[0]
        tocheckpath = check_aval[1]
        toposturl = 'http://localhost:6656/profiles/'+str(item.RO_profile)  #TODO : figure out how to not hardcode this <---
        async with ClientSession() as session:
            response = await session.request(method='GET', url=toposturl)
            print(response.status, file=sys.stderr)
            if response.status != 200:
                raise HTTPException(status_code=400, detail="Given RO-profile does not exist")
        data[space_id]= {'storage_path':tocheckpath,'RO_profile':item.RO_profile}
    
    #try and init a git repo and a rocrate
    repo = git.Repo.init(os.path.join(tocheckpath))
    #change current wd to init the rocrate
    currentwd = os.getcwd()
    #make project dir
    os.mkdir(os.sep.join((tocheckpath,'project')))
    os.chdir(os.sep.join((tocheckpath,'project')))
    crate = ROCrate() 
    crate.write_crate(os.sep.join((tocheckpath,'project')))
    os.chdir(currentwd)
    with open(os.path.join(os.getcwd(),"app","projects.json"), "w") as file: 
        json.dump(data, file)
        
    repo.git.add(all=True)
    repo.index.commit("initial commit")
    repo.create_head('master')
    return {'Message':returnmessage, 'space_id': space_id}

@app.put('/spaces/{space_id}/',tags=["Spaces"], status_code=202)
async def update_space(*,space_id: str = Path(None,description="space_id name"), item: SpaceModel):
    tocheckpath = str(item.storage_path)
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+")as file:
        data = json.load(file)
    for space, info in data.items():
        if space_id == space:
            toposturl = 'http://localhost:6656/profiles/'+str(item.RO_profile)  #TODO : figure out how to not hardcode this <---
            async with ClientSession() as session:
                response = await session.request(method='GET', url=toposturl)
                print(response.status, file=sys.stderr)
                if response.status != 200:
                    raise HTTPException(status_code=400, detail="Given RO-profile does not exist")
            data[space_id]= {'storage_path':info["storage_path"],'RO_profile':item.RO_profile}
            with open(os.path.join(os.getcwd(),"app","projects.json"), "w") as file:
                json.dump(data, file)  
            return {'Data':'Update successfull'} 
    raise HTTPException(status_code=404, detail="Space not found")

@app.get('/spaces/{space_id}/content/',tags=["Content"])
def get_space_content_info(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            space_folder = os.sep.join((data[space_id]['storage_path'],'project'))
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    toreturn = []
    for (dirpath, dirnames, filenames) in os.walk(space_folder):
        for filen in filenames:
            if '.git' not in dirpath:
                toreturn.append({"file":filen,"folder":dirpath})
    return {'Data':toreturn}

@app.post('/spaces/{space_id}/content/',tags=["Content"], status_code=202)
async def add_new_content(*,space_id: str = Path(None,description="space_id name"), item: ContentModel, path_folder: Optional[str] = None):  
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)

    try:
        toreturn = data[space_id] 
    except Exception as e:
        raise HTTPException(status_code=404, detail="Space not found")

    if path_folder == None:
        try:
            space_folder = os.path.join(os.sep.join((data[space_id]['storage_path'],'project'))) 
        except:
            raise HTTPException(status_code=400, detail="Directory could not be made")
    else:
        space_folder = os.path.join(os.sep.join((data[space_id]['storage_path'],'project')), path_folder) 
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
                crate.add_file(content_item.content)
            except Exception as e:
                datalog.append({content_item.content:e})
    try:
        await crate.write_crate(space_folder)
    except:
        pass
    repo.git.add(u=True)
    if len(datalog) > 0:
        raise HTTPException(status_code=400, detail=datalog)

    return {'Data':'all content successfully added to space'}

@app.delete('/spaces/{space_id}/content/',tags=["Content"], status_code=202)
def delete_content(*,space_id: str = Path(None,description="space_id name"), item: DeleteContentModel):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            space_folder = os.sep.join((data[space_id]['storage_path'],'project'))
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
        
    repo = git.Repo(data[space_id]['storage_path'])
    crate = ROCrate(space_folder)
    print(crate.get_entities())
        
    for content_item in item.content:
        crate.delete(crate.dereference(content_item))
        del_path = os.path.join(space_folder,content_item)
        os.remove(del_path)
        
    repo.git.add(all=True)
    crate.write_crate(space_folder)
    return {'Data':'all content successfully deleted from space :TODO: currently delete function is not working'}

@app.get('/spaces/{space_id}/content/{path_folder:path}',tags=["Content"])
def get_space_content_folder_info(*,space_id: str = Path(None,description="space_id name"), path_folder: str = Path(None,description="folder  path to get the files from")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            allpaths = path_folder
            space_folder = os.path.join(os.sep.join((data[space_id]['storage_path'],'project')), path_folder) 
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    toreturn = []
    for (dirpath, dirnames, filenames) in os.walk(space_folder):
        for filen in filenames:
            if '.git' not in dirpath:
                toreturn.append({"file":filen,"folder":dirpath})
    return {'Data':toreturn}

@app.get('/spaces/{space_id}/git/status/', tags=["git"], status_code=200)
def get_git_status(*,space_id: str = Path(None,description="space_id name")):
    toreturn =[]
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    #function to pull data from remote if remote was provided and if pulse finds diff 
    repo = git.Repo(space_folder)
    print(repo.heads)
    hcommit = repo.head.commit
    diff_list = hcommit.diff()
    difff_list = hcommit.diff(ignore_blank_lines=True, ignore_space_at_eol=True,create_patch=True)
    print(diff_list, file=sys.stderr)
    i = 0
    for diff in diff_list:
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
    return {'data':toreturn}

@app.get('/plugins', tags=["plugins"])
def get_al_plugin_info():
    return {'data': 'TODO'}