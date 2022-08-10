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
log.debug(f"all env variables: {env}")
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
    try:
        ## get all the file_ids with their metadata ##
        #open up the metadata.json file
        with open(os.path.join(source_path_crate, 'ro-crate-metadata.json')) as json_file:
            datao = json.load(json_file)
            
        #get all the node ids where the type is not a file
        node_ids = []
        for node in datao['@graph']:
            if node['@type'] != 'File':
                node_ids.append(node)
                
        #TODO perform a check here in all the node_ids to see if the part['@id] is a url, if so ten add the part to the dta['@graph]
        '''
        for i in node_ids:
            data['@graph'].append(i)
        '''
                 
                 
        #check if the ids from relation are present in the json file
        all_meta_ids_data = []
        for id in datao['@graph']:
            toappend_id = {}
            toappand_data_values = []
            # if first character is # in the @id then delete the #
            if id['@id'][0] == '#':
                id['@id'] = id['@id'][1:]
            for key_id, value_id in id.items():
                if key_id != "@id":
                    toappand_data_values.append({key_id:value_id})
            toappend_id[id['@id']] = toappand_data_values
            all_meta_ids_data.append(toappend_id)
        
        log.debug(f"all metadata ids of data: {all_meta_ids_data}")
        
        #for all metadata ids check if they have a parent folder, if so then add this one tp the real_name of the file and repeat until you are at the root
        #make pre meta ids
        all_ids_pre_new_doc = []
        for id in datao['@graph']:
            all_ids_pre_new_doc.append(id['@id'])
        
        ## start from fresh file with metadata template  ##
        with open(os.path.join(os.getcwd(),'app',"webtop-work-space",'ro-crate-metadata.json')) as json_file:
            data = json.load(json_file)
            
        log.debug(f"data from rocrate: {data}")
        
        ## add data to the fresh file ##
        relation = []
        for root, dirs, files in os.walk(source_path_crate, topdown=False): 
            
            for diro in dirs:
              if ' ' in diro:
                  os.rename(os.path.join(root, diro), os.path.join(root, diro.replace(' ', '_')))
            if ".git" not in root:
                #log.info(f'root == {root}')
                for name in files:
                    
                    #if the name contains a " " then replace it with "_"
                    if " " in name:
                        #replace the " " with "_" on the file system
                        os.rename(os.path.join(root, name), os.path.join(root, name.replace(" ", "_")))
                        name = name.replace(" ", "_")
                    #log.info(f'file == {name}')
                    if name != ".git":
                        if root.split(source_path_crate)[-1] == "":
                            parent_folder = ""
                            relative_path = "./"
                        else:
                            relative_path = root.split(source_path_crate)[-1]
                            #check if the relative path contains any " " , if so replace it with "_"
                            try:
                                if " " in relative_path:
                                    relative_path = relative_path.replace(" ", "_")
                            except Exception as e:
                                log.error(f"error: {e}")
                            parent_folder = relative_path.split(os.path.sep)[-1]
                            added_relative_path = relative_path.replace(os.path.sep, "/")
                            full_name = os.path.join(relative_path, name)
                            #replace \\ by / and check if first char is . , if not add .
                            full_name = full_name.replace("\\", "/")
                            #escape the / in the name 
                            full_name = full_name.replace("/", forward_slash_replace)
                            log.debug(f"full name: {full_name}")
                        relation.append({'parent_folder':added_relative_path,"relative_path":relative_path,"name":full_name})
                        log.debug({'parent_folder':added_relative_path,"relative_path":relative_path,"name":full_name})
        
        
        #add all the files that are in the root of the source_path_crate to the data
        onlyfiles = [f for f in listdir(source_path_crate) if os.path.isfile(os.path.join(source_path_crate, f))]
        for onlyfile in onlyfiles:
            # if onlyfile doesn't start with './', add it to the relation
            if onlyfile[0] != ".":
                relation.append({'parent_folder':"","relative_path":"./","name":onlyfile})
                log.debug({'parent_folder':"","relative_path":"./","name":onlyfile})
        
        all_ids = []
        for x in relation:
            #log.debug(x)
            all_ids.append(x["name"])
        #check if the ids from relation are present in the json file
        all_meta_ids = []
        for id in data['@graph']:
            all_meta_ids.append(id['@id'])
            #log.debug(id['@id'])
        for i in all_ids: 
            #TODO when I delete stuff from the ro-crate-metdata.json, the folders don't come back to the root , find a way to hange this for when the user decides to mess with the ro-crate-metadata.json
            if i not in all_meta_ids:
                #log.debug("not present: "+ i)
                #check if parent is present in the file
                def add_folder_path(path_folder):
                    toaddppaths = path_folder.split("\\")
                    
                    #make list that loops over the toaddpaths and adds the next element to the previous one 
                    complete_path = ""
                    all_paths = []
                    for toadd in toaddppaths:
                        complete_path  = complete_path + toadd + "/"
                        all_paths.append(complete_path)
                    
                    log.debug(f"all paths: {all_paths}")
                    
                    previous = "./"
                    for toadd in all_paths:         
                        if str(toadd) not in all_meta_ids:
                            if toadd != "/":
                                data['@graph'].append({'@id':toadd, '@type':"Dataset", 'hasPart':[]})
                                # add ro right haspart
                                for ids in data['@graph']:
                                    if ids['@id'] == previous:
                                        try:
                                            ids['hasPart'].append({'@id':toadd})
                                        except:
                                            ids['hasPart'] = []
                                            ids['hasPart'].append({'@id':toadd})
                                all_meta_ids.append(str(toadd))
                        if toadd == "/":
                            previous = './'
                        else:
                            previous = toadd
                                
                for checkparent in relation:
                    if checkparent['name'] == i:
                        if str(checkparent['parent_folder']+"/") not in all_meta_ids:
                            if checkparent['parent_folder'] != "":
                                #make the parent_folder in ids
                                data['@graph'].append({'@id':checkparent['parent_folder']+"/", '@type':"Dataset", 'hasPart':[]})
                                #check if folder has no parent
                                log.info(f"checkparent['parent_folder'] == {checkparent['parent_folder']}")
                                log.debug(checkparent['relative_path'].split("\\"))
                                if len(checkparent['relative_path'].split("\\")) == 2:
                                    checkparentpath = checkparent['relative_path'].split("\\")
                                    log.debug(f"splitted relative path: {checkparentpath}")
                                    for ids in data['@graph']:
                                        if ids['@id'] == './':
                                            if {'@id':checkparent['relative_path'].split("\\")[-1]+"/"} not in ids['hasPart']:
                                                ids['hasPart'].append({'@id':checkparent['relative_path'].split("\\")[-1]+"/"})
                                
                                add_folder_path(checkparent['relative_path'])
                        #add the non present id to the folder haspart
                        for ids in data['@graph']:
                            if checkparent['parent_folder'] == "":
                                if ids['@id'] == "."+checkparent['parent_folder']+"/":
                                    ids['hasPart'].append({'@id':i})
                            else:
                                if ids['@id'] == checkparent['parent_folder']+"/":
                                    ids['hasPart'].append({'@id':i})
                #add the id to the @graph
                data['@graph'].append({'@id':i, '@type':"File"})
                #add id to ./ folder if necessary
        
        #add the references to the @graph
        for i in all_ids_pre_new_doc:
            #log.info(f"meta id i: {i}")
            valid=validators.url(i)
            if valid:
                #log.info(f"valid url: {i}")
                #add i to the graph
                for id in data['@graph']:
                    if id["@id"] == './':
                        id["hasPart"].append({'@id':i})
                data['@graph'].append({'@id':i, '@type':"File"})  
        
        ## add file_ids metadata correspondingly ##
        for ids in data['@graph']:
            # check if the first character fo the ids["@id "] is a # , if so remove this char
            if ids["@id"][0] == "#":
                log.info(ids["@id"])
                ids["@id"] = ids["@id"][1:]
            for tocheck_id in all_meta_ids_data:
                #log.info("checking part of graph: "+ids["@id"])
                if ids['@id'] == str(tocheck_id.keys()):
                    log.info(f"found {ids['@id']} in {tocheck_id.keys()}")
                    log.info(tocheck_id)
                    for dict_single_metadata in tocheck_id[ids['@id']]:
                        for key_dict_single_meta, value_dcit_sinle_meta in dict_single_metadata.items():
                            if key_dict_single_meta not in ids.keys():
                                log.debug(f"key of single file metadata: {key_dict_single_meta}")
                                ids[key_dict_single_meta] = value_dcit_sinle_meta
        
        #remove duplicates
        seen_ids = []
        for ids in data['@graph']:
            if ids['@id'] in seen_ids:
                log.info("duplicate id found: "+ids['@id'])
                data['@graph'].remove(ids)
            else:
                seen_ids.append(ids['@id'])
                            
        #remove duplicates from hasPart
        new_graph = []
        seen_ids = []
        for ids in data['@graph']:
            #replace the forward_slash_replace with a /
            ids['@id'] = replace_forward_slash(ids['@id'])
            if ids['@id'] not in seen_ids:
                seen_ids.append(ids['@id'])
                
                # if ids has hasPart check hasparts
                if 'hasPart' in ids:
                    new_hasparts = []
                    seen_hasparts = []
                    for haspart in ids['hasPart']:
                        haspart['@id'] = replace_forward_slash(haspart['@id'])
                        if haspart['@id'] in seen_hasparts:
                            log.info("duplicate id found in hasparts of id: "+ haspart["@id"] + ids['@id'])
                        else:
                            seen_hasparts.append(haspart['@id'])
                            new_hasparts.append(haspart)
                    ids['hasPart'] = new_hasparts
                new_graph.append(ids)

        data["@graph"] = new_graph
        
        #write the rocrate file back 
        with open(os.path.join(source_path_crate, 'ro-crate-metadata.json'), 'w') as json_file:
            json.dump(data, json_file)
        return data
    
    except Exception as e:
        log.error(f"error: {e}")
        log.exception(e)
        
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
                log.debug(f"Storage path space:{str_space}")
                str_space_f_path = str("/".join((tocheckpath,str(space_id))))
                log.debug(f"Storage path with space_id: {str_space_f_path}")
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
            log.info(f"env variable base_url_server == {BASE_URL_SERVER}")
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
            log.debug(response.status)
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
                log.debug(response.status)
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
