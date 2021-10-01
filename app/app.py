from fastapi import FastAPI, Path, Query, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
import os, json, requests, asyncio, sys, aiohttp, shutil, git
from aiohttp import ClientSession
from rocrate.rocrate import ROCrate
from pathlib import Path as pads

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

@app.get('/profiles',tags=["Profiles","Get"])
def get_all_profiles_info():
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+") as file:
        data = json.load(file)
        return data

@app.get('/profiles/{profile_id}',tags=["Profiles","Get"])
def get_profile_info(profile_id: str = Path(None,description="profile_id name")):
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[profile_id]
            return toreturn
        except Exception as e:
            raise HTTPException(status_code=404, detail="profile not found")

@app.delete('/profiles/{profile_id}',tags=["Profiles","Delete"], status_code=202)
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

@app.post('/profiles/{profile_id}',tags=["Profiles","Post"], status_code=201)
def add_profile(*,profile_id: str = Path(None,description="profile_id name"), item: ProfileModel):
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+")as file:
        data = json.load(file)
        if profile_id in data.keys():
            raise HTTPException(status_code=400, detail="Profile already exists")
        data[profile_id]= {'logo':item.logo,'description':item.description,'url_ro_profile':item.url_ro_profile}
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "w") as file:
        json.dump(data, file)   
    return {'Message':'Profile added'}

@app.put('/profiles/{profile_id}',tags=["Profiles","Put"], status_code=202)
def update_profile(*,profile_id: str = Path(None,description="profile_id name"), item: ProfileModel):
    with open(os.path.join(os.getcwd(),"app","workflows.json"), "r+")as file:
        data = json.load(file)
    for profile in data.keys():
        if profile_id == profile:
            data[profile_id]= {'logo':item.logo,'description':item.description,'url_ro_profile':item.url_ro_profile} 
            with open(os.path.join(os.getcwd(),"app","workflows.json"), "w") as file:
                json.dump(data, file)  
                return {'Data':'Update successfull'} 
    raise HTTPException(status_code=404, detail="profile not found")

@app.get('/spaces',tags=["Spaces","Get"])
def get_all_spaces():
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+")as file:
        data = json.load(file)
        return data

@app.get('/spaces/{space_id}',tags=["Spaces","Get"])
def get_space_info(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            return toreturn
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")

@app.delete('/spaces/{space_id}',tags=["Spaces","Delete"], status_code=202)
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

@app.post('/spaces/{space_id}',tags=["Spaces","Post"], status_code=201)
async def add_space(*,space_id: str = Path(None,description="space_id name"), item: SpaceModel):
    tocheckpath = str(item.storage_path)
    returnmessage = "Space created in folder: " + str(os.path.join(tocheckpath))
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
        data[space_id]= {'storage_path':tocheckpath,'ro_profile':item.RO_profile}
    
    #try and init a git repo and a rocrate
    git.Repo.init(os.path.join(tocheckpath))
    #change current wd to ini the rocrate
    currentwd = os.getcwd()
    os.chdir(tocheckpath)
    crate = ROCrate() 
    crate.write_crate(tocheckpath)
    os.chdir(currentwd)
    with open(os.path.join(os.getcwd(),"app","projects.json"), "w") as file: 
        json.dump(data, file)
    return {'Message':returnmessage}

@app.put('/spaces/{space_id}',tags=["Spaces","Put"], status_code=202)
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
            data[space_id]= {'storage_path':info["storage_path"],'ro_profile':item.RO_profile}
            with open(os.path.join(os.getcwd(),"app","projects.json"), "w") as file:
                json.dump(data, file)  
            return {'Data':'Update successfull'} 
    raise HTTPException(status_code=404, detail="Space not found")

@app.get('/spaces/{space_id}/content',tags=["Content","Get"])
def get_space_content_info(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    toreturn = []
    for (dirpath, dirnames, filenames) in os.walk(space_folder):
        for filen in filenames:
            if '.git' not in dirpath:
                toreturn.append({"file":filen,"folder":dirpath})
    return {'Data':toreturn}

@app.get('/spaces/{space_id}/content/{path_folder:path}',tags=["Content","Get"])
def get_space_content_folder_info(*,space_id: str = Path(None,description="space_id name"), path_folder: str = Path(None,description="folder  path to get the files from")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            allpaths = path_folder
            space_folder = os.path.join(data[space_id]['storage_path'], path_folder)
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    toreturn = []
    for (dirpath, dirnames, filenames) in os.walk(space_folder):
        for filen in filenames:
            if '.git' not in dirpath:
                toreturn.append({"file":filen,"folder":dirpath})
    return {'Data':toreturn}

@app.post('/spaces/{space_id}/content/{path_folder:path}',tags=["Content","Post"], status_code=202)
def add_space_folder(*,space_id: str = Path(None,description="space_id name"), path_folder: str = Path(None,description="folder path to make")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            allpaths = path_folder
            space_folder = os.path.join(data[space_id]['storage_path'], path_folder)
            try:
                pads(space_folder).mkdir(parents=True, exist_ok=True)
            except:
                raise HTTPException(status_code=400, detail="Directory could not be made")
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    return {'Data':'Made directory'}
    

@app.get('/plugins', tags=["plugins","Get"])
def get_al_plugin_info():
    return {'data': 'TODO'}