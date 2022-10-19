from fastapi import Path, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from typing import List, Optional
from pydantic import BaseModel, Field
import os, json, sys, stat
from aiohttp import ClientSession
import logging
log=logging.getLogger(__name__)
import app.shacl_helper as shclh

from app.model.location import Locations
from app.model.space import Space

router = APIRouter(
    prefix="/annotation",
    tags=["Annotation"],
    responses={404: {"description": "Not found"}},
)

## import the config file for the specific route of the api ##
from dotenv import load_dotenv
load_dotenv()
BASE_URL_SERVER = os.getenv('BASE_URL_SERVER')

### define class profiles for the api ###  
class AnnotationModel(BaseModel):
    URI_predicate_name : str = Field(None, description = "Name of the URI that will be added, must be part of the RO-crate profile provided metadata predicates.\
                                                for more info about the allowed predicates, use TODO: insert api call for predicates here.")
    value    : str = Field(None, description = "Value linked to the URI predicate name chosen")
    
class NodeModel(BaseModel):
    URI_predicate_name : str = Field(None, description = "Name of the URI that will be added, must be part of the RO-crate profile provided metadata predicates")
    node_type : str = Field(None, description = "Type of the node that will be added.")
    node_id : str = Field(None, description = "ID of the node that will be added.")

class AnnotationsModel(BaseModel):
    Annotations: List[AnnotationModel] = Field(None, description = "List of annotations to add to resource. \
                                              for more info about the allowed annotation predicates, use TODO: insert api call for predicates here.")

class URIModel(BaseModel):
    URI: str = Field(None, description = "URI of the resource to get annotations from")
    Object_id: str = Field(None, description = "Object of the resource to append the annotations to in the rocrate_metadata.json file")

### define helper functions for the api ###

### api paths ###

### space resource annotation ###
@router.get('/', status_code=200)
def get_all_resources_annotation(*,space_id: str = Path(None,description="space_id name")):
    
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")

    try:
        space_object = Space.load(uuid=space_id)
        #log.debug(space_object)
        toreturn = space_object.get_predicates_all()
        #log.debug(toreturn)
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)
    return toreturn

#have call to make node in file id 
@router.post('/file/node/{file_id:path}', status_code=200)
def make_resource_annotation_single_file_node(*,space_id: str = Path(None,description="space_id name"), file_id: str = Path(None,description="id of the file that will be searched in the ro-crate-metadata.json file"), item: NodeModel):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        space_object = Space.load(uuid=space_id)
        #have a call to make blank node in file id
        prerreturn = space_object.create_node_by_id(file_id=file_id, node_type=item.node_type, uri_predicate=item.URI_predicate_name, node_id=item.node_id)
        #log.info(prerreturn)
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)

@router.post('/file/{file_id:path}', status_code=200)
def make_resource_annotation_single_file(*,space_id: str = Path(None,description="space_id name"), file_id: str = Path(None,description="id of the file that will be searched in the ro-crate-metadata.json file"), item: AnnotationsModel):
    ## get the current metadata.json ##
    #log.info(file_id)
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        #read in ROCrate metadata file
        space_object = Space.load(uuid=space_id)
        #log.debug(space_object)
        prerreturn = space_object.add_predicates_by_id(toadd_dict_list=item.Annotations, file_id=file_id)
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)
    


@router.delete('/file/{predicate}/{file_id:path}', status_code=200)
def delete_resource_annotation(*,space_id: str = Path(None,description="space_id name"), file_id: str = Path(None,description="id of the file that will be searched in the ro-crate-metadata.json file"), predicate: str = Path(None,description="To delete predicate from the file annotations")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        space_object = Space.load(uuid=space_id)
        prerreturn = space_object.delete_predicates_by_id(to_delete_predicate=predicate, file_id=file_id)
        #log.info(prerreturn)
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)

@router.get('/file/{file_id:path}', status_code=200)
def get_resource_annotation(*,space_id: str = Path(None,description="space_id name"), file_id: str = Path(None,description="id of the file that will be searched in the ro-crate-metadata.json file")):
    #log.info(file_id)
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        space_object = Space.load(uuid=space_id)
        #log.info(file_id)
        prerreturn = space_object.get_predicates_by_id(file_id=file_id)
        #log.info(f"prereturn of get predicates by id: {prerreturn}")
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)
    
#router get call to get all files and annotations for a given tpye of node
@router.get('/type/{node_type}', status_code=200)
def get_resource_annotation_by_type(*,space_id: str = Path(None,description="space_id name"), node_type: str = Path(None,description="type of node to search for")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    #put the spce object here and call the function to get the annotations by type
    try:
        space_object = Space.load(uuid=space_id)
        prereturn = space_object.get_predicates_by_type(type_search=node_type)
        return prereturn
    except Exception as e:
        log.exception(e)
        log.error(e)
        raise HTTPException(status_code=500, detail=e)
    
#router post call that will search for a given URI and will get back the application/ld+json for that URI and will add it to the ro-crate-metadata.json file and to the corresponding object in the crate if object id was also given in the request modal
@router.post('/uri', status_code=200)
def post_uri(*,space_id: str = Path(None,description="space_id name"), item: URIModel):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        space_object = Space.load(uuid=space_id)
        log.debug(item.Object_id)
        prereturn = space_object.add_URI(URI=item.URI, object_id=item.Object_id)
        return prereturn
    except Exception as e:
        log.exception(e)
        log.error(e)
        raise HTTPException(status_code=500, detail=e)

    
@router.get('/shacl_report', status_code=200)
def get_shacl_report(*,space_id: str = Path(None,description="space_id name")):
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    try:
        space_object = Space.load(uuid=space_id)
        #log.info(space_object)
        prerreturn = space_object.get_shacl_report()
        #log.info(f"prereturn of get shacl report: {prerreturn}")
        if "error" in prerreturn.keys():
            return JSONResponse(status_code=int(prerreturn["error"]),content=str(prerreturn["detail"]))
        return prerreturn
    except Exception as e:
        log.error(e)
        log.exception(e)
        raise HTTPException(status_code=500, detail=e)

@router.get('/terms', status_code=200)
def get_terms_shacl(*, space_id: str = Path(None,description="space_id name")):
    try:
        
        #TODO from json select which shacl file should be taken
        with open(Locations().join_abs_path('spaces.json'), "r+") as file:
            data = json.load(file)
            try:
                space_folder = data[space_id]['storage_path']
            except Exception as e:
                raise HTTPException(status_code=404, detail="Space not found")
        #read in shacl file 
        path_shacl = os.path.join(Locations().get_workspace_location_by_uuid(space_uuid=space_id),"all_constraints.ttl")
        print(path_shacl, file=sys.stderr)
        test = shclh.ShapesInfoGraph(path_shacl)
        shacldata = test.full_shacl_graph_dict()
        return shacldata
    except Exception as e:
        log.error(e)
        log.exception(e)

@router.post('/', status_code=200)
def make_annotations_for_all_resources(*,space_id: str = Path(None,description="space_id name"), item: AnnotationsModel):
    #get path of metadatafile
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    
    space_object = Space.load(uuid=space_id)
    space_object.add_predicates_all(toadd_dict=item.Annotations)
    data = space_object._read_metadata_datacrate()
        
    return {"data":data}

@router.delete('/', status_code=200)
def delete_annotations_for_all_resources(*,space_id: str = Path(None,description="space_id name"), item: AnnotationsModel):
    #get path of metadatafile
    with open(Locations().join_abs_path('spaces.json'), "r+") as file:
        data = json.load(file)
        try:
            space_folder = data[space_id]['storage_path']
        except Exception as e:
            raise HTTPException(status_code=404, detail="Space not found")
    
    space_object = Space.load(uuid=space_id)
    space_object.delete_predicates_all(todelete_dict=item.Annotations)
    data = space_object._read_metadata_datacrate()
        
    return {"data":data}