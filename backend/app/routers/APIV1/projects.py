from fastapi import Path, HTTPException, APIRouter
from typing import  Optional
from pydantic import BaseModel, Field
import json
import logging
log=logging.getLogger(__name__)
#all diff subroutes
from app.model.location import Locations
from app.model.project import Project

router = APIRouter(
    prefix="",
    tags=["Projects"],
    responses={404: {"description": "Not found"}},
)

#projects_by_uuid = project.load_all()

### define class projects for the api ###

class ProjectModel(BaseModel):
    name: str = Field(None, description="Name of the space")
    logo: Optional[str] = Field(None, example = 'https://www.researchobject.org/ro-crate/assets/img/ro-crate-w-text.png', description = "Logo to be displayed in RO crate UI")
    description: Optional[str] = Field(None, description = "description of the RO-project")
    url_ro_project: str = Field(None, description = "github url where the rocrate project is located")

### define helper functions for the api ###

### api paths ###

@router.get('/')
def get_all_projects_info():
    log.info(f"project get all begin")
    with open(Locations().join_abs_path('projects.json'), "r+") as file:
        data = json.load(file)
        return data

@router.get('/{project_id}/')
def get_project_info(project_id: str = Path(None,description="project_id name")):
    log.info(f"project get begin")
    with open(Locations().join_abs_path('projects.json'), "r+") as file:
        data = json.load(file)
        try:
            toreturn = data[project_id]
            return toreturn
        except Exception as e:
            log.error(f"project get project by id error")
            log.exception(f"{e}")
            raise HTTPException(status_code=404, detail="project not found")

@router.delete('/{project_id}/', status_code=202)
def delete_project(project_id: str = Path(None,description="project_id name")):
    log.info(f"project delete begin")
    with open(Locations().join_abs_path('projects.json')) as data_file:
            data = json.load(data_file)
            try:
                del data[project_id]
            except Exception as e:
                log.error(f"project delete project by id error")
                log.exception(f"{e}")
                raise HTTPException(status_code=404, detail=f"project {project_id} was not found in projects")
    with open(Locations().join_abs_path('projects.json'), 'w') as data_file:
        data = json.dump(data, data_file)    
        return {'message':'successfully deleted project'}

@router.post('/', status_code=201)
def add_project(*,item: ProjectModel):
    log.info(f"project add begin")
    if item.logo != None or item.description != None  or item.url_ro_project != None or item.name != None:
        #add check for the url of the project:
        try:
            #tocheckrocrate = ro_read.MakeNewproject(project_id=item.name, logo=item.logo ,description= item.description, repo_url=item.url_ro_project)
            Project(
                repo_url = item.url_ro_project,
                name = item.name,
                description = item.description,
                logo_url = item.logo,
            )
        except Exception as e:
            log.error(f"project make project error")
            log.exception(f"{e}")
            raise HTTPException(status_code=500, detail="error : {}".format(e))
        return {'Message':'project added'}
    else:
        keys = dict(item).keys()
        raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))

@router.put('/{project_id}/', status_code=202)
def update_project(*,project_id: str = Path(None,description="project_id name"), item: ProjectModel):
    log.info(f"project update begin")
    with open(Locations().join_abs_path('projects.json'), "r+")as file:
        data = json.load(file)
    for project in data.keys():
        if project_id == project:
            try:
                if item.logo != None or item.description != None or item.url_ro_project != None:
                    data[project_id].update({'logo_url':item.logo,'description':item.description,'repo_url':item.url_ro_project})
                    with open(Locations().join_abs_path('projects.json'), "w") as file:
                        json.dump(data, file)  
                        return {'Data':'Update successfull'} 
                else:
                    log.info(f"project update fail")
                    log.info(f"supplied body must have following keys: {format(keys)}")
                    keys = dict(item).keys()
                    raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))
            except Exception as e:
                log.error(f"project update project error")
                log.exception(f"{e}")
                keys = dict(item).keys()
                raise HTTPException(status_code=400, detail="supplied body must have following keys: {}".format(keys))
    raise HTTPException(status_code=404, detail="project not found")