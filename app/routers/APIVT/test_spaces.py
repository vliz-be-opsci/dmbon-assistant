from requests import exceptions
from fastapi import FastAPI, Path, Query, HTTPException, status, APIRouter, Depends
from fastapi.openapi.utils import get_openapi
from typing import List, Optional, Set
from pydantic import BaseModel, Field
import os, json, requests, asyncio, sys, aiohttp, shutil, git, uuid, subprocess, stat
from datetime import datetime
from aiohttp import ClientSession
from rocrate.rocrate import ROCrate
from pathlib import Path as pads
from collections import MutableMapping
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)

directoryname = os.path.dirname(os.path.abspath(__file__)).split(os.path.sep)[-1]
router = APIRouter(
    prefix="/"+str(directoryname)+"/"+str(os.path.abspath(__file__).split(os.path.sep)[-1].split(".")[0]),
    tags=[directoryname],
    responses={404: {"description": "Not found"}},
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
    
class AnnotationModel(BaseModel):
    URI_predicate_name : str = Field(None, description = "Name of the URI that will be added, must be part of the RO-crate profile provided metadata predicates.\
                                                for more info about the allowed predicates, use TODO: insert api call for predicates here.")
    value    : str = Field(None, description = "Value linked to the URI predicate name chosen")

class AnnotationsModel(BaseModel):
    Annotations: List[AnnotationModel] = Field(None, description = "List of annotations to add to resource. \
                                              for more info about the allowed annotation predicates, use TODO: insert api call for predicates here.")

class ContentModel(BaseModel):
    content: List[FileModel] = Field(None, description = "List of files that need to be added, this list can also contain directories")

class DeleteContentModel(BaseModel):
    content: List[str] = Field(None, description = "List of files to delete , if full path given it will delete one file , of only file name given it will delete all entities in the system with file name.")

### define helper functions for the api ###

#TODO: function that reads into the roprofile rocrate metadata and finds the conforms to part ;
#  1: gets the shacl or other constraint files.
#  2: reciprocly go through all rocrate conform to untill all contraints are gathered. 
#  3: combines all the contraints into 1 contraint file and return this in a folder that is a sibling of the project folder.

#TODO: function that searches for the typechanger for mimetypes when adding new files to the rocrate , be it either from url or from local system

#TODO: figure out how to get the mimetype of url resources added (maybe through name?)

#TODO: function that reads the shacl contraint file and gets the right properties for an accordingly chosen schema target class (@type in rocrate metadata.json)

def check_space_name(spacename):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+")as file:
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

@router.get('/',tags=["Spaces"])
def get_all_spaces():
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+")as file:
        data = json.load(file)
        return data

@router.get('/{space_id}/',tags=["Spaces"])
def get_space_info(*,space_id: str = Path(None,description="space_id name")):
    if check_space_name(space_id):
        with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
            data = json.load(file)
            try:
                toreturn = data[space_id]
                return toreturn
            except Exception as e:
                raise HTTPException(status_code=500, detail=e)
    else:
        raise HTTPException(status_code=404, detail="Space not found")

@router.delete('/{space_id}/',tags=["Spaces"], status_code=202)
def delete_space(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"app","projects.json")) as data_file:
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
                    raise HTTPException(status_code=500, detail="Space delete failed {}".format(e)) 
            del data[space_id]
            
    with open(os.path.join(os.getcwd(),"app","projects.json"), 'w') as data_file:
        data = json.dump(data, data_file)    
        return {'message':'successfully deleted space'}

@router.post('/',tags=["Spaces"], status_code=201)
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
            if response.status == 200:
                os.mkdir(os.sep.join((tocheckpath,'constraints')))
                urlprofile = (await response.json())['url_ro_profile']
                print('json file profile:  ',urlprofile, file=sys.stderr)
                secondtest = ro_read.rocrate_helper(urlprofile)
                secondtest.get_all_metadata_files()
                secondtest.get_ttl_files()
                with open(os.path.join(tocheckpath,'constraints','all_contraints.ttl'), 'w') as file:  # Use file to refer to the file object
                    file.write(secondtest.ttlinfo)
        data[space_id]= {'storage_path':tocheckpath,'RO_profile':item.RO_profile}
        
    
    if item.remote_url != None and item.remote_url != "string":
        try:
            git.Repo.clone_from(item.remote_url, os.path.join(tocheckpath))
            repo = git.Repo(os.path.join(tocheckpath))
            #check if rocratemetadata.json is present in git project
            print("before file found", file=sys.stderr)
            if os.path.isfile(os.path.join(tocheckpath, 'ro-crate-metadata.json')) == False and os.path.isfile(os.path.join(tocheckpath, 'project', 'ro-crate-metadata.json')) == False:
                currentwd = os.getcwd()
                os.mkdir(os.sep.join((tocheckpath,'project')))
                os.chdir(os.sep.join((tocheckpath,'project')))
                crate = ROCrate() 
                crate.write_crate(os.sep.join((tocheckpath,'project')))
                os.chdir(currentwd)
                repo.git.add(all=True)
                repo.index.commit("initial commit")
                repo.create_head('master')
            with open(os.path.join(os.getcwd(),"app","projects.json"), "w") as file: 
                    json.dump(data, file)
            return {'Message':returnmessage, 'space_id': space_id}
        except :
            raise HTTPException(status_code=400, detail="Non valid git url given")
    else:
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

@router.put('/{space_id}/',tags=["Spaces"], status_code=202)
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

@router.get('/{space_id}/content/',tags=["Content"])
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

@router.post('/{space_id}/content/',tags=["Content"], status_code=202)
def add_new_content(*,space_id: str = Path(None,description="space_id name"), item: ContentModel, path_folder: Optional[str] = None):  
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
                print("trying to add {}".format(content_item.content), file=sys.stderr)
                crate.add_file(content_item.content)
            except Exception as e:
                datalog.append({content_item.content:e})
    

    crate.write_crate(space_folder)
    repo.git.add(all=True)
    if len(datalog) > 0:
        raise HTTPException(status_code=400, detail=datalog)

    return {'Data':'all content successfully added to space'}

@router.delete('/{space_id}/content/',tags=["Content"], status_code=202)
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

    crate.write_crate(space_folder)
    repo.git.add(all=True)
    return {'Data':'all content successfully deleted from space :TODO: currently delete function is not working'}

@router.get('/{space_id}/content/{path_folder:path}',tags=["Content"])
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

@router.get('/{space_id}/git/status/', tags=["Git"], status_code=200)
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

@router.post('/{space_id}/git/{command}}', tags=["Git"], status_code=200)
def get_git_status(*,space_id: str = Path(None,description="space_id name"),command: str = Path("commit",description="git command to use (commit,pull,push)")):
    toreturn =[]
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")

    repo = git.Repo(space_folder)

    if command != "commit" and command != "push" and command != "pull":
        raise HTTPException(status_code=400, detail="No valid command given, valid commands are (commit,push,pull)")

    #repo commit
    if command == "commit":
        try:
            print("before commit", file=sys.stderr)
            repo.index.commit("RO-crate API commit")   # <--- TODO: ADD user to the commit message for better cross scientists performance
            print("after commit", file=sys.stderr)
            return {"data":"{} successfull".format(str(command))}
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
    
    try:
        print(repo.remote().refs, file=sys.stderr)
    except:
        raise HTTPException(status_code=400, detail="repo has no remote references to push or pull to.")

    # try and do push pull
    if command == "push":
        try:
            origin = repo.remote(name='origin')
            origin.push()
            return {"data":"{} successfull".format(str(command))}
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
    
    if command == "pull":
        try:
            origin = repo.remote(name='origin')
            origin.pull()
            return {"data":"{} successfull".format(str(command))}
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
    
### space resource annotation ###

@router.get('/{space_id}/annotation/', tags=["Annotation"], status_code=200)
def get_all_resources_annotation(*,space_id: str = Path(None,description="space_id name")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    #read in ROCrate metadata file
    with open(os.path.join(space_folder,'project','ro-crate-metadata.json'), "r+") as projectfile:
        #print(projectfile)
        data = json.load(projectfile)
        all_files = []
        #get all files from the projectfile
        for dictionaries in data["@graph"]:
            for item, value in dictionaries.items():
                if item == "@id":
                    all_files.append(value)
        print(all_files)
        #foreach file get all the attributes
        files_attributes = {}
        for file in all_files:
            if file != "ro-crate-metadata.json" and file != './':
                if "." in file:
                    files_attributes[file]= {}
                    for dictionaries in data["@graph"]:
                        for item, value in dictionaries.items():
                            if item == "@id" and value==file:
                                for item_save, value_save in dictionaries.items():
                                    files_attributes[file][item_save] = value_save
    return {"data":files_attributes}

@router.get('/{space_id}/annotation/{path_folder:path}', tags=["Annotation"], status_code=200)
def get_resource_annotation(*,space_id: str = Path(None,description="space_id name"), path_folder: str = Path(None,description="folder-path or file name to the file")):
    with open(os.path.join(os.getcwd(),"app","projects.json"), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    #read in ROCrate metadata file
    with open(os.path.join(space_folder,'project','ro-crate-metadata.json'), "r+") as projectfile:
        #print(projectfile)
        data = json.load(projectfile)
        all_files = []
        #get all files from the projectfile
        for dictionaries in data["@graph"]:
            for item, value in dictionaries.items():
                if item == "@id":
                    all_files.append(value)
        print(all_files)
        #foreach file get all the attributes
        files_attributes = {}
        for file in all_files:
            if file != "ro-crate-metadata.json" and file != './' and file == path_folder:
                if "." in file:
                    files_attributes[file]= {}
                    for dictionaries in data["@graph"]:
                        for item, value in dictionaries.items():
                            if item == "@id" and value==file:
                                for item_save, value_save in dictionaries.items():
                                    files_attributes[file][item_save] = value_save
                return {"data":files_attributes}
        raise HTTPException(status_code=404, detail="Resource not found.")
            

#TODO : Add content modal for the annotation of the resources

@router.post('/{space_id}/annotation/{path_folder:path}', tags=["Annotation"], status_code=200)
def make_resource_annotations(*,space_id: str = Path(None,description="space_id name"), path_folder: str = Path(None,description="folder-path to the file"), item: AnnotationsModel):
    return {"message":"TODO"}

@router.post('/{space_id}/annotation/', tags=["Annotation"], status_code=200)
def make_annotations_for_all_resources(*,space_id: str = Path(None,description="space_id name"), item: AnnotationsModel):
    
    return {"message":"TODO"}

@router.put('/{space_id}/annotation/{path_folder:path}', tags=["Annotation"], status_code=200)
def update_resource_annotations(*,space_id: str = Path(None,description="space_id name"), path_folder: str = Path(None,description="folder-path to the file"), item: AnnotationsModel):
    return {"message":"TODO"}

@router.patch('/{space_id}/annotation/', tags=["Annotation"], status_code=200)
def update_annotations_for_all_resources(*,space_id: str = Path(None,description="space_id name"), item: AnnotationsModel):
    return {"message":"TODO"}

@router.delete('/{space_id}/annotation/{path_folder:path}', tags=["Annotation"], status_code=200)
def delete_resource_annotations(*,space_id: str = Path(None,description="space_id name"), path_folder: str = Path(None,description="folder-path to the file"), item: AnnotationsModel):
    return {"message":"TODO"}

@router.delete('/{space_id}/annotation/', tags=["Annotation"], status_code=200)
def delete_annotations_for_all_resources(*,space_id: str = Path(None,description="space_id name"), item: AnnotationsModel):
    return {"message":"TODO"}