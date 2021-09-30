from fastapi import FastAPI, Path, Query
from pydantic import BaseModel, Field
from typing import Optional
import os, json

app = FastAPI(
    title = 'RO-Crate-API',
    description='RO-Crate manager Rest-API'
)

class ProfileModel(BaseModel):
    logo: Optional[str] = Field(None, example = 'https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png', description = "Logo to be displayed in RO crate UI")
    description: Optional[str] = Field(None, description = "description of the RO-profile")
    url_ro_profile: str = Field(None, description = "github url where the rocrate profile is located")

class SpaceModel(BaseModel):
    storage_path: str = Field(None, description = "Valid path on local storage where ROcrate data will be stored")
    RO_profile: str = Field(None, description = "Ro-Profile name that will be used for the space")

@app.get('/', tags=["test"])
def home():
    return {'Message':'Waddup Rory, docs can be found in the /docs route'}

@app.get('/profiles',tags=["Profiles"])
def get_all_profiles_info():
    with open(os.path.join(os.getcwd(),"workflows.json"), "r+") as file:
        data = json.load(file)
        return data

@app.get('/profiles/{profile_id}',tags=["Profiles"])
def get_profile_info(profile_id: str = Path(None,description="profile_id name")):
    with open(os.path.join(os.getcwd(),"workflows.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[profile_id]
            return toreturn
        except Exception as e:
            return {'Data':'Not Found'}

@app.delete('/profiles/{profile_id}',tags=["Profiles"])
def delete_profile(profile_id: str = Path(None,description="profile_id name")):
    with open(os.path.join(os.getcwd(),"workflows.json")) as data_file:
            data = json.load(data_file)
            try:
                del data[profile_id]
            except Exception as e:
                return {'Data':'Delete Failed'}  
    with open(os.path.join(os.getcwd(),"workflows.json"), 'w') as data_file:
        data = json.dump(data, data_file)    
        return {'message':'successfully deleted profile'}

@app.post('/profiles/{profile_id}',tags=["Profiles"])
def add_profile(*,profile_id: str = Path(None,description="profile_id name"), item: ProfileModel):
    with open(os.path.join(os.getcwd(),"workflows.json"), "r+")as file:
        data = json.load(file)
        if profile_id in data.keys():
            return {'Error':"Profile already exists"}
        data[profile_id]= {'logo':item.logo,'description':item.description,'url_ro_profile':item.url_ro_profile}
    with open(os.path.join(os.getcwd(),"workflows.json"), "w") as file:
        json.dump(data, file)   
    return {'Message':'Profile added'}

@app.put('/profiles/{profile_id}',tags=["Profiles"])
def update_profile(*,profile_id: str = Path(None,description="profile_id name"), item: ProfileModel):
    with open(os.path.join(os.getcwd(),"workflows.json"), "r+")as file:
        data = json.load(file)
    for profile in data.keys():
        if profile_id == profile:
            data[profile_id]= {'logo':item.logo,'description':item.description,'url_ro_profile':item.url_ro_profile} 
            with open(os.path.join(os.getcwd(),"workflows.json"), "w") as file:
                json.dump(data, file)  
                return {'Data':'Update successfull'} 
    return {'Error', 'given profile was not found'}

@app.get('/spaces',tags=["Spaces"])
def get_all_spaces():
    with open(os.path.join(os.getcwd(),"projects.json"), "r+")as file:
        data = json.load(file)
        return data

@app.get('/spaces/{space_id}',tags=["Spaces"])
def get_space_info(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"projects.json"), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[space_id]
            return toreturn
        except Exception as e:
            return {'Data':'Space Not Found'}

@app.delete('/spaces/{space_id}',tags=["Spaces"])
def delete_space(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"projects.json")) as data_file:
            data = json.load(data_file)
            try:
                del data[space_id]
            except Exception as e:
                return {'Data':'Delete Failed'}  
    with open(os.path.join(os.getcwd(),"projects.json"), 'w') as data_file:
        data = json.dump(data, data_file)    
        return {'message':'successfully deleted space'}

@app.post('/spaces/{space_id}',tags=["Spaces"])
def add_space(*,space_id: str = Path(None,description="space_id name"), item: SpaceModel):
    with open(os.path.join(os.getcwd(),"projects.json"), "r+")as file:
        data = json.load(file)
        if space_id in data.keys():
            return {'Error':"Profile already exists"}
        data[space_id]= {'storage_path':item.storage_path,'ro_profile':item.RO_profile}
    with open(os.path.join(os.getcwd(),"projects.json"), "w") as file:
        json.dump(data, file)
    return {'Message':'Space added'}

@app.put('/spaces/{space_id}',tags=["Spaces"])
def update_space(*,space_id: str = Path(None,description="space_id name"), item: SpaceModel):
    with open(os.path.join(os.getcwd(),"projects.json"), "r+")as file:
        data = json.load(file)
    for space in data.keys():
        if space_id == space:
            data[space_id]= {'storage_path':item.storage_path,'ro_profile':item.RO_profile}
            with open(os.path.join(os.getcwd(),"projects.json"), "w") as file:
                json.dump(data, file)  
            return {'Data':'Update successfull'} 
    return {'Error', 'given space was not found'}

@app.get('/plugins', tags=["plugins"])
def get_al_plugin_info():
    return {'data': 'TODO'}