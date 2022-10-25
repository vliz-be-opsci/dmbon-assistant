from hashlib import new
from operator import ne
from re import L
from symbol import pass_stmt
from fastapi import Path, HTTPException, APIRouter
from typing import Optional
from pydantic import BaseModel, Field
import os, json, shutil, git, uuid, subprocess, stat
from aiohttp import ClientSession
import validators
from os import listdir
import logging
log=logging.getLogger(__name__)
#all diff subroutes
from .content import router as content_router
from .git import router as git_router
from .annotation import router as annotation_router
from app.model.location import Locations
from app.model.space import Space

router = APIRouter(
    prefix="",
    responses={404: {"description": "Not found"}},
)
router.include_router(content_router, prefix="/{space_id}")
router.include_router(git_router, prefix="/{space_id}")
router.include_router(annotation_router, prefix="/{space_id}")

## import the config file for the specific route of the api ##

from dotenv import load_dotenv
env = load_dotenv()
#log.debug(f"all env variables: {env}")
BASE_URL_SERVER = os.getenv('BASE_URL_SERVER')

### define class profiles for the api ###

class SpaceModel(BaseModel):
    name: str = Field(None, description= "Name that the space should have")
    storage_path: str = Field(None, description = "Valid path on local storage where ROcrate data will be stored")
    RO_profile: str = Field(None, description = "Ro-Profile name that will be used for the space")
    remote_url: Optional[str] = Field(None, description = "git repo url to get project from")

### define helper functions for the api ###

forward_slash_replace = "%2F"

#function that will replace the ´%2F in the path with / and the first %2F with ./
def replace_forward_slash(path):
    path = path.replace(forward_slash_replace, "/")
    #replace first / with /./ if first char isn't .
    if path[0] != ".":
        #if the first char is not a /, replace it with ./
        if path[0] != "/":
            path = "./" + path
        else:
            path = path.replace("/", "./", 1)
    return path

def complete_metadata_crate(source_path_crate):
    #get the metadata rocrate metadata file
    try:
        with open(os.path.join(source_path_crate, 'ro-crate-metadata.json'), "r") as f:
            data = json.load(f)
    except Exception as e:
        log.error("An error occured while trying to open the ro-crate-metadata.json file")
        log.error(f"error: {e}")
        log.exception(e)
        return

    #make varibale for the new metadata file
    try:
        #take the old metadata file that is not @grapth and put it in a new variable
        new_data = {}
        for key, value in data.items():
            if key != "@graph":
                new_data[key] = value
            if key == "@graph":
                #go over each item in the graph and only append the one where "@id" => "./ro-crate-metadata.json"    
                for item in value:
                    if item["@id"] == "./ro-crate-metadata.json":
                        new_data["@graph"] = [item]
                        break
        log.debug(new_data)
    except Exception as e:
        log.error("An error occured while loading the new metadata file")
        log.error(f"error: {e}")
        log.exception(e)
        return

    #make variables that contain all the nodes from the graph that aren't a file and a variable that contains all the nodes in the graph that are files
    try:
        other_nodes = [node for node in data["@graph"] if node["@type"] != "File"]
        log.debug(other_nodes)
        files_nodes = [node for node in data["@graph"] if node["@type"] == "File"]
        log.debug(files_nodes)
    except Exception as e:
        log.error("An error occured while trying to get the nodes from the graph")
        log.error(f"error: {e}")
        log.exception(e)
        return

    #make relations list variabe that is comprised of all parent_folder, relative_path and name of all the files present on the local storage of the user
    try:
        relation = []
        for root, dirs, files in os.walk(source_path_crate, topdown=False): 
            #make a log.info that shows the root path but split by the source_path_crate
            last_part_root = root.split(source_path_crate)[-1]
            current_folder_name = os.path.split(last_part_root)[-1]
            full_relative_folder = last_part_root[1:]
            #replace os.path.sep by "/"
            old_full_relative_folder = full_relative_folder
            full_relative_folder = full_relative_folder.replace(os.path.sep, "/")
            #check if full_relative_folder is empty, if so, set it to ./
            if full_relative_folder == "":
                log.info(f"nothing root : {root}")
                parent = "./"
                for file in files:
                    if " " in file:
                        new_file = file.replace(" ", "_")
                        old_file = os.path.join(root, file)
                        new_file = os.path.join(root, new_file)
                        log.debug(f"old_file: {old_file}")
                        log.debug(f"new_file: {new_file}")
                        os.rename(old_file, new_file)
                        file = new_file
                    #get the relative path of the file , the parent relative direcotry
                    label_file = os.path.join(parent, file)
                    label_file = label_file.replace(" ", "_")
                    label_file = label_file.replace(os.path.sep, "/")
                    log.debug(f"label_file: {label_file}")
                    relation.append({"label":label_file, "parent":parent, "file":file})
                # go to the next iteration of the loop
                continue
            
            #check if full_relative_folder does not start with "."
            if full_relative_folder[0] != ".":
                log.info(f"no . root : {root}")
                parent = "./" + full_relative_folder + "/"
                log.debug(f"full_current_folder: {root}")
                #check if there are spaces in the lastpart of the root path split by os.path.sep and if so replace them with _
                if " " in current_folder_name:
                    current_folder_name = current_folder_name.replace(" ", "_")
                    root_without_last_folder = root.split(os.path.sep)[:-1]
                    new_root = os.path.sep.join(root_without_last_folder + [current_folder_name])
                    log.debug(f"new_root: {new_root}")
                    os.rename(root, new_root)
                    root = new_root
                #go over each file and first check if there are no spaces in the file location 
                for file in files:
                    if " " in file:
                        new_file = file.replace(" ", "_")
                        old_file = os.path.join(root, file)
                        new_file = os.path.join(root, new_file)
                        log.debug(f"old_file: {old_file}")
                        log.debug(f"new_file: {new_file}")
                        os.rename(old_file, new_file)
                        file = new_file
                    #get the relative path of the file , the parent relative direcotry
                    label_file = os.path.join(parent, file)
                    label_file = label_file.replace(" ", "_")
                    label_file = label_file.replace(os.path.sep, "/")
                    log.debug(f"label_file: {label_file}")
                    relation.append({"label":label_file, "parent":parent, "file":file})
        log.debug(f"relation: {relation}")
    except Exception as e:
        log.error("An error occured while trying to get the relations list")
        log.error(f"error: {e}")
        log.exception(e)
        return {"error": "An error occured while trying to fix the rocrate , make sure you don't have the file explorer open of the current rocrate {source_path_crate}"}
        
    #go over all relations and check if relation["parent"] is in the other_nodes that are of type dataset
    try:
        all_datasets_added = []
        for rel in relation:
            parent = rel["parent"]
            if parent in all_datasets_added:
                continue
            log.debug(f"parent: {parent}")
            for node in other_nodes:
                if node["@type"] == "Dataset":
                    #chekc first if the id_to_check is not a url
                    if validators.url(node["@id"]):
                        new_data["@graph"].append(node)
                        break
                    if node["@id"] == parent:
                        #TODO discuss with marc if we should use an uuid or not as the id and then the real name as the label?
                        new_data["@graph"].append({"@id":node["@id"], "@type":node["@type"], "label":node["@id"], "hasPart":[]})
                        break   
            all_datasets_added.append(parent)    
    except Exception as e:
        log.error("An error occured while trying to add the dataset nodes to the new metadata file")
        log.error(f"error: {e}")
        log.exception(e)
        return

    #go over the relation list again and add the parent to the parent folder of the parent
    try:
        all_parents_added = []
        for rel in relation:
            parent = rel["parent"]
            parent_splitted = parent.split("/")
            parent_of_parent = "/".join(parent_splitted[:-2]) + "/"
            if parent not in all_parents_added:
                for node in new_data["@graph"]:
                    if node["@id"] == parent_of_parent:
                        node["hasPart"].append({"@id":parent})
                        all_parents_added.append(parent)
                        break
    except Exception as e:
        log.error("An error occured while trying to add the parent to the parent folder of the parent")
        log.error(f"error: {e}")
        log.exception(e)
        return

    #go over all the other_nodes and do the same but for the ones that are not a dataset
    try:
        for node in other_nodes:
            if node["@id"] == "./ro-crate-metadata.json":
                continue
            id_to_check = node["@id"]
            if "label" in node:
                id_to_check = node["label"]
            if node["@type"] != "Dataset":
                log.debug(node)
                if "label" not in node:
                    node["label"] = node["@id"]
                new_data["@graph"].append(node)
    except Exception as e:
        log.error("An error occured while trying to add the non dataset nodes to the new metadata file")
        log.error(f"error: {e}")
        log.exception(e)
        return
    
    #go over all the files_nodes and check in the relation list if the label of the file is in files_nodes["@id"] => if found then add the file from files_nodes to the new_data["@graph"]
    try:
        for rel in relation:
            found = False
            for file_node in files_nodes:
                if rel["label"] == file_node["@id"]:
                    found = True
                    #check first if ref["@label"] is already in teh graph
                    for node in new_data["@graph"]:
                        if node["@id"] == file_node["@id"]:
                            break
                    if "label" not in file_node:
                        file_node["label"] = file_node["@id"]
                    new_data["@graph"].append(file_node)
                    #add the file to the dataset hasPart
                    for parentnode in new_data["@graph"]:
                        if parentnode["@id"] == rel["parent"]:
                            parentnode["hasPart"].append({"@id":file_node["@id"]})
                            break
                    break
            if not found:
                if rel["label"] == "./ro-crate-metadata.json":
                    continue
                new_data["@graph"].append({"@id":rel["label"], "@type":"File", "label":rel["label"]})
                #add the file to the dataset hasPart
                for parentnode in new_data["@graph"]:
                    if parentnode["@id"] == rel["parent"]:
                        parentnode["hasPart"].append({"@id":rel["label"]})
                        break
    except Exception as e:
        log.error("An error occured while trying to add the files nodes to the new metadata file")
        log.error(f"error: {e}")
        log.exception(e)
        return
    
    #pretty print the new_data with identation of 4
    log.debug(f"new_data: {json.dumps(new_data, indent=4)}")
    with open(os.path.join(source_path_crate, 'ro-crate-metadata.json'), 'w') as json_file:
            json.dump(new_data, json_file, indent=4)
            #json.dump(new_data, json_file) #this is for a more compact version of the jsonld
    return new_data

def check_space_name(spacename):
    with open(Locations().join_abs_path('spaces.json'), "r+")as file:
        data = json.load(file)
    for space, info in data.items():
        if spacename == space:
            return True
    return False

def on_rm_error(func, path, exc_info):
    #from: https://stackoverflow.com/questions/4829043/how-to-remove-read-only-attrib-directory-with-python-in-windows
    os.chmod(path, stat.S_IWRITE)
    os.unlink(path)

async def check_path_availability(tocheckpath,space_id):
    if os.path.isdir(os.path.join(tocheckpath)) == False:
        raise HTTPException(status_code=400, detail="Given storage path does not exist on local storage")
    #check if given path is already used by another project
    toposturl = 'http://localhost:6656/apiv1/spaces' #TODO : figure out how to not hardcode this <---
    async with ClientSession() as session:
        response = await session.request(method='GET', url=toposturl)
        text = await response.content.read()
        all_spaces = json.loads(text.decode('utf8').replace("'", '"'))
        try:
            for space,info_space in all_spaces.items():
                str_space = info_space["storage_path"]
                #log.debug(f"Storage path space:{str_space}")
                str_space_f_path = str("/".join((tocheckpath,str(space_id))))
                #log.debug(f"Storage path with space_id: {str_space_f_path}")
                if info_space['storage_path'] == str("/".join((tocheckpath,str(space_id)))) or info_space['storage_path'] == str(tocheckpath):
                    raise HTTPException(status_code=400, detail="Given storage path is already in use by another project")
        except:
            pass
    if len(os.listdir(os.path.join(tocheckpath)) ) != 0:
        try:
            return tocheckpath
        except Exception as e:
            log.error("checking space folder failed")
            log.exception(e)

### api paths ###

@router.get('/', tags=["Spaces"])
def get_all_spaces():
    with open(Locations().join_abs_path('spaces.json'), "r+")as file:
        try:
            #log.info(f"env variable base_url_server == {BASE_URL_SERVER}")
            data = json.load(file)
            toreturn = []
            for i,y in data.items():
                clicktrough_url = BASE_URL_SERVER + 'apiv1/' + 'spaces/' + i 
                #example_url: https://example.org/dmbon/ns/entity_types#Space
                toreturn.append({'name':i,
                                'storage_path':y['storage_path'],
                                'RO_profile':y['ro_profile'],
                                '@type':'https://example.org/dmbon/ns/entity_types#Space',
                                'url_space':clicktrough_url})   
            return toreturn
        except Exception as e:
            log.error(f"error  :{e}")
            log.exception(e)
            raise HTTPException(status_code=500, detail=e)

@router.get('/{space_id}/', tags=["Spaces"])
def get_space_info(*,space_id: str = Path(None,description="space_id name")):
    if check_space_name(space_id):
        with open(Locations().join_abs_path('spaces.json'), "r+") as file:
            data = json.load(file)
            try:
                for i,y in data.items():
                    if i == space_id:
                        clicktrough_url = BASE_URL_SERVER + 'apiv1/' + 'spaces/' + i 
                        #example_url: https://example.org/dmbon/ns/entity_types#Space
                        toreturn= { 'name':i,
                                    'storage_path':y['storage_path'],
                                    'ro_profile':y['ro_profile'],
                                    '@type':'https://example.org/dmbon/ns/entity_types#Space',
                                    'url_content':clicktrough_url+"/content",
                                    'url_metadata':clicktrough_url+"/annotation",
                                    'url_constraints':clicktrough_url+"/annotation/terms"}
                
                return toreturn
            except Exception as e:
                raise HTTPException(status_code=500, detail=e)
    else:
        raise HTTPException(status_code=404, detail="Space not found")

@router.delete('/{space_id}/', status_code=202, tags=["Spaces"])
def delete_space(*,space_id: str = Path(None,description="space_id name")):
    with open(Locations().join_abs_path('spaces.json')) as data_file:
            data = json.load(data_file)
            try:
                #delete the folder where the project was stored
                shutil.rmtree(data[space_id]["storage_path"])
            except:
                try:
                    for i in os.listdir(data[space_id]["storage_path"]):
                        if i.endswith('git'):
                            tmp = os.path.join(data[space_id]["storage_path"], i)
                            # We want to unhide the .git folder before unlinking it.
                            while True:
                                subprocess.call(['attrib', '-H', tmp])
                                break
                            shutil.rmtree(tmp, onerror=on_rm_error)
                    shutil.rmtree(data[space_id]["storage_path"])
                except Exception as e:
                    log.error(f"space deletion error")
                    log.exception(f"{e}")
                    raise HTTPException(status_code=500, detail="Space delete failed {}".format(e)) 
            del data[space_id]
            
    with open(Locations().join_abs_path('spaces.json'), 'w') as data_file:
        data = json.dump(data, data_file)    
        return {'message':'successfully deleted space'}

@router.post('/', status_code=201, tags=["Spaces"])
async def add_space(*,item: SpaceModel):
    tocheckpath = str(item.storage_path)
    space_id = uuid.uuid4().hex
    with open(Locations().join_abs_path('spaces.json'), "r+")as file:
        data = json.load(file)
        if space_id in data.keys():
            raise HTTPException(status_code=400, detail="Space already exists")
        check_aval = await check_path_availability(tocheckpath,space_id)
        tocheckpath = check_aval
        toposturl = 'http://localhost:6656/apiv1/profiles/'+str(item.RO_profile)  #TODO : figure out how to not hardcode this <---
        async with ClientSession() as session:
            response = await session.request(method='GET', url=toposturl)
            #log.debug(response.status)
            if response.status != 200:
                raise HTTPException(status_code=400, detail="Given RO-profile does not exist")
            if response.status == 200:
                try:
                    Space(
                        storage_path=os.path.join(item.storage_path,item.name),
                        ro_profile=item.RO_profile,
                        remote_url=item.remote_url
                    )
                except Exception as e:
                    log.error(f"Error wile making space : {e}")
                    log.exception(e)
    return {'Message':f"Space made, location:{item.storage_path}", 'name': item.name}

@router.put('/{space_id}/', status_code=202, tags=["Spaces"])
async def update_space(*,space_id: str = Path(None,description="space_id name"), item: SpaceModel):
    tocheckpath = str(item.storage_path)
    with open(Locations().join_abs_path('spaces.json'), "r+")as file:
        data = json.load(file)
    for space, info in data.items():
        if space_id == space:
            toposturl = 'http://localhost:6656/apiv1/profiles/'+str(item.RO_profile)  #TODO : figure out how to not hardcode this <---
            async with ClientSession() as session:
                response = await session.request(method='GET', url=toposturl)
                #log.debug(response.status)
                if response.status != 200:
                    raise HTTPException(status_code=400, detail="Given RO-profile does not exist")
            data[space_id]= {'storage_path':info["storage_path"],'ro_profile':item.RO_profile}
            with open(Locations().join_abs_path('spaces.json'), "w") as file:
                json.dump(data, file)  
            return {'Data':'Update successfull'} 
    raise HTTPException(status_code=404, detail="Space not found")

@router.get('/{space_id}/fixcrate', status_code=201, tags=["Spaces"])
async def fix_crate(*,space_id: str = Path(None,description="space_id name")): 
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
            repo = git.Repo(space_folder)
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    test = complete_metadata_crate(source_path_crate=space_folder)
    repo.git.add(all=True)
    return {'Data':test} 
