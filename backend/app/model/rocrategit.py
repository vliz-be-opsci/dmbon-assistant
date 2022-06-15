import git, os, json
from abc import abstractmethod
from .location import Locations
from rocrate.rocrate import ROCrate
import logging
import stat
import shutil
from subprocess import call
import app.shacl_helper as shclh
from rdflib import Graph
import json, math
from pyshacl import validate
from base64 import decode
import uuid as uuidmake

log=logging.getLogger(__name__)

def on_rm_error(func, path, exc_info):
    #from: https://stackoverflow.com/questions/4829043/how-to-remove-read-only-attrib-directory-with-python-in-windows
    os.chmod(path, stat.S_IWRITE)
    os.unlink(path)

class GitRepoCache():
    
    @staticmethod
    def repo_url_to_git_ssh_url(repo_url):
        repo_owner  = repo_url.split("github.com/")[-1].split("/")[0]
        repo_name   = repo_url.split("/")[-1].split(".git")[0]
        return("git@github.com:"+repo_owner+"/"+repo_name+".git")
    
    @staticmethod
    def clone_content(location, repo_url): 
        #  clone repo_url to location
        #  convert the repo url to a ssh url
        ssh_url = GitRepoCache.repo_url_to_git_ssh_url(repo_url=repo_url)
        try:
            git.Repo.clone_from(ssh_url, location)
        except:
            try:
                log.info(f"deleting existing repo on location {location} for repo :{ssh_url}")
                shutil.rmtree(location, onerror=on_rm_error)
                git.Repo.clone_from(ssh_url, location)    
            except:
                # we make a new map for the repo to be cloned in (location)
                # and then we delete the old one
                try:
                    os.mkdir(location)
                    git.Repo.clone_from(ssh_url, location)
                except Exception as e:
                    log.error(f"error cloning repo {ssh_url} to {location}")
                    log.exception(e)
                
    @staticmethod
    def update_content(location):
        # do the git stuff to clone or update
        repo = git.Repo(location)
        try:
            origin = repo.remote(name='origin')
            origin.pull()
        except Exception as e:
            return e

    @staticmethod
    def init_repo(location):
        currentwd = os.getcwd()  
        try:
            os.mkdir((location))
            os.chdir((location))
        except Exception as e:
            log.info(f"exception occured :{e}")
            log.exception(e)
        repo = git.Repo.init(os.path.join(location))
        #change current wd to init the rocrate
        crate = ROCrate() 
        crate.write_crate((location))
        os.chdir(currentwd)
        repo.git.add(all=True)
        repo.index.commit("initial commit")
        repo.create_head('master')

class RoCrateGitBase():
    
    def __init__():
        pass
    
    #TODO: !!!
    def find_parts(self,type_uri):
        # returns list of parts in this crate that match this type_uri
        self.delete_hashtag_from_begin_id()
        md = self._read_metadata()
        print(type_uri)
        # run through md to find...
        # returns a set if @id that match the type url found in ro-crate-metadata.json
        # For now the function will run through the old code and get all the git urls
        toreturn = []
        print(md)
        for files_to_check in md["@graph"]:
            #check if the files_to_check has the type_uri as a property if it doesn then add the value to the toreturn
            for item, value in files_to_check.items():
                if item == type_uri:
                    toreturn.append(value)
        return toreturn
    
    def get_object(self, subject_uri, predicate_uri):
        '''get the object from a given subject with certain predicate uri
        '''
        pass
    
    def get_predicates_all(self):
        """ get predicates from all ids
        """
        self.delete_hashtag_from_begin_id()
        md = self._read_metadata_datacrate()
        log.debug(md)
        all_files = []
        for dictionaries in md["@graph"]:
            for item, value in dictionaries.items():
                if item == "@id":
                    all_files.append(value)
        log.debug(all_files)
        #foreach file get all the attributes
        files_attributes = {}
        for file in all_files:
            if file != "ro-crate-metadata.json" and file != './':
                if "." in file:
                    files_attributes[file]= {}
                    #TODO use uri templates and rename /file/ to /resource/ 
                    # urit = "os.getenv('BASE_URL_SERVER') + 'apiv1/' + 'spaces/{uuid}/annotation/resource/{rid}'"
                    # uritemplates(urit).expand(dict(uuid=self.uuid, rid=file))
                    clicktrough_url = os.getenv('BASE_URL_SERVER') + 'apiv1/' + 'spaces/' + self.uuid + '/annotation/file/' + file
                    files_attributes[file]['url_file_metadata'] = clicktrough_url
                    for dictionaries in md["@graph"]:
                        for item, value in dictionaries.items():
                            if item == "@id" and value==file:
                                for item_save, value_save in dictionaries.items():
                                    files_attributes[file][item_save] = value_save
        log.debug(f'All predicates from all files from project : {files_attributes}')
        return {"data":files_attributes}
    
    def delete_hashtag_from_begin_id(self):
        #get the metadata
        data = self._read_metadata_datacrate()
        # go over each item in the graph and if the @id starts with a # then remove it
        for item in data["@graph"]:
            if item["@id"].startswith("#"):
                item["@id"] = item["@id"][1:]
        #write the metadata
        self._write_metadata_datacrate(data)
    
    def get_predicates_by_id(self,file_id=str):
        """ get predicates from a given id
        :param id: str of the id to get all the predicates of in the ro-crate-metadata.json
        :type  id: str
        """
        self.delete_hashtag_from_begin_id()
        data = self._read_metadata_datacrate()
        log.info(f"metadata of the space: {data}")
        path_shacl = os.path.join(Locations().get_workspace_location_by_uuid(space_uuid=self.uuid),"all_constraints.ttl")
        log.info(path_shacl)
        
        barebones_json = {
                "@context": 
                    { 
                    "schema": "http://schema.org/" , 
                    "ex": "http://example.org/ns#"
                    },
                "@graph": []
                }
    
        for item in data["@graph"]:
            if item["@id"] == file_id:
                item_dict = {}
                item_dict["@id"] = item["@id"]
                item_dict["@type"] = "schema:" + item["@type"]
                for key, value in item.items():
                    if key == "@type":
                        continue
                    else:
                        item_dict["schema:" + key] = value
                barebones_json["@graph"].append(item_dict)
        
        shacl_file = open(path_shacl, "rb").read()
        sh = Graph().parse(data=shacl_file, format="turtle")
        r = validate(data_graph=json.dumps(barebones_json), shacl_graph=sh, advanced=True, data_graph_format="json-ld", serialize_report_graph="json-ld")
        r_decoded = r[1].decode("utf-8")
        
        datag = []
        for item in data["@graph"]:
            if item["@id"] == file_id:
                log.debug(f'found item with id {file_id}')
                for key, value in item.items():
                    dict_predicates = {}
                    dict_predicates["predicate"] = key
                    dict_predicates["value"] = value
                    datag.append(dict_predicates)
                    
        log.debug(f"data: {datag}")
        
        green = 2
        orange = 0
        red = 0

        for item in datag:
            if item["predicate"] != "@type" and item["predicate"] != "@id":
                green+=1
                
        validation_report_json  = json.loads(r_decoded)        

        # check the report for the number of violations for the item 
        for item in validation_report_json:
            log.debug(f' validation report item: {item}')
            try:
                if item["@type"][0] == "http://www.w3.org/ns/shacl#ValidationResult":
                    for key, value in item.items():
                        if key == "http://www.w3.org/ns/shacl#focusNode":
                            name_focusnode = value[0]["@id"].split("/")[-1]
                if name_focusnode == file_id:
                    for key, value in item.items():
                        if "resultSeverity" in key == "http://www.w3.org/ns/shacl#resultSeverity":
                            if value[0]["@id"].split("#")[-1] == "Violation":
                                red+=1
                            if value[0]["@id"].split("#")[-1] == "Warning":
                                orange+=1
            except:
                pass
        log.debug(f' green: {green}, orange: {orange}, red: {red}')
        percentage_red = math.ceil((red/(red+green+orange))*100)
        percentage_orange = math.ceil((orange/(red+green+orange))*100)
        percentage_green = math.ceil((green/(red+green+orange))*100)
        summary = {"green": percentage_green, "orange": percentage_orange, "red": percentage_red}
                
        
        all_files = []
        #implement the shacl constraint check here
        #read in shacl file
        f_constraints = open(path_shacl, "r")
        f_constraints_text = f_constraints.read()
        test = shclh.ShapesInfoGraph(path_shacl)
        shacldata = test.full_shacl_graph_dict()
        #convert the shacl file to have all the properties per node id
        node_properties_dicts = []
        for node_to_check in shacldata:
            log.info(node_to_check)
        for node_to_check in shacldata:
            toaddnode = {}
            if node_to_check["target"] is not None:
                target = node_to_check["target"].split("/")[-1]
                toaddnode[target] = []
                for propname , semantic_properties in node_to_check["properties"].items():
                    #add reciproce checking for nodes in nodes here
                    toaddnode[target].append({propname.split('/')[-1]: semantic_properties})
                node_properties_dicts.append(toaddnode)
        
        log.debug(node_properties_dicts)
                
        all_predicates = []
        all_recursive_predicates = []
        #get all files from the projectfile
        for dictionaries in data["@graph"]:
            for item, value in dictionaries.items():
                if item == "@id" and value == file_id:
                    for item_save, value_save in dictionaries.items():
                        all_predicates.append(item_save)
                        #check if value-save is not on object 
                        if(type(value_save) is not dict):
                            all_files.append({'predicate':item_save,'value':value_save})
                        else:
                            all_files.append({'predicate':item_save,'value':"nodeshape: "+value_save["@id"]})
                            all_recursive_predicates.append({'predicate':item_save,'value':value_save})
        
        if len(all_predicates) == 0:
            return {"error":404,"detail":"Resource not found"}
        
        log.info(all_files)
        
        return {'data':all_files, 'complex_data':all_recursive_predicates,'summary': summary, 'shacl_requirements': json.loads(r_decoded), 'shacl_original': f_constraints_text}
    
    def get_shacl_report(self):
        """get the shacl report for the whole space
        """
        self.delete_hashtag_from_begin_id()
        data = self._read_metadata_datacrate()
        log.info(f"metadata of the space: {data}")
        path_shacl = os.path.join(Locations().get_workspace_location_by_uuid(space_uuid=self.uuid),"all_constraints.ttl")
        log.info(path_shacl)
        
        barebones_json = {
                "@context": 
                    { 
                    "schema": "http://schema.org/" , 
                    "ex": "http://example.org/ns#"
                    },
                "@graph": []
                }
    
        for item in data["@graph"]:
            item_dict = {}
            item_dict["@id"] = item["@id"]
            item_dict["@type"] = "schema:" + item["@type"]
            for key, value in item.items():
                if key == "@type":
                    continue
                else:
                    item_dict["schema:" + key] = value
            barebones_json["@graph"].append(item_dict)
                
        shacl_file = open(path_shacl, "rb").read()
        sh = Graph().parse(data=shacl_file, format="turtle")
        r = validate(data_graph=json.dumps(barebones_json), shacl_graph=sh, advanced=True, js=True, data_graph_format="json-ld", serialize_report_graph="json-ld", debug=True)
        r_decoded = r[1].decode("utf-8")
        
        green = 0
        orange = 0
        red = 0
        
        datag = []
        for item in data["@graph"]:
            green+=2
            for key, value in item.items():
                dict_predicates = {}
                dict_predicates["predicate"] = key
                dict_predicates["value"] = value
                datag.append(dict_predicates)
                    
        log.debug(f"data: {datag}")
        
        

        for item in datag:
            if item["predicate"] != "@type" and item["predicate"] != "@id":
                green+=1
                
        validation_report_json  = json.loads(r_decoded)        

        # check the report for the number of violations for the item 
        for item in validation_report_json:
            log.debug(f' validation report item: {item}')
            try:
                if item["@type"][0] == "http://www.w3.org/ns/shacl#ValidationResult":
                    for key, value in item.items():
                        if key == "http://www.w3.org/ns/shacl#focusNode":
                            name_focusnode = value[0]["@id"].split("/")[-1]
                for key, value in item.items():
                    if "resultSeverity" in key == "http://www.w3.org/ns/shacl#resultSeverity":
                        if value[0]["@id"].split("#")[-1] == "Violation":
                            red+=1
                        if value[0]["@id"].split("#")[-1] == "Warning":
                            orange+=1
            except:
                pass
        log.debug(f' green: {green}, orange: {orange}, red: {red}')
        percentage_red = math.ceil((red/(red+green+orange))*100)
        percentage_orange = math.ceil((orange/(red+green+orange))*100)
        percentage_green = math.ceil((green/(red+green+orange))*100)
        summary = {"green": percentage_green, "orange": percentage_orange, "red": percentage_red}
                  
        all_files = []
        #implement the shacl constraint check here
        #read in shacl file
        f_constraints = open(path_shacl, "r")
        f_constraints_text = f_constraints.read()
        test = shclh.ShapesInfoGraph(path_shacl)
        shacldata = test.full_shacl_graph_dict()
        #convert the shacl file to have all the properties per node id
        node_properties_dicts = []
        for node_to_check in shacldata:
            log.info(node_to_check)
        for node_to_check in shacldata:
            toaddnode = {}
            if node_to_check["target"] is not None:
                target = node_to_check["target"].split("/")[-1]
                toaddnode[target] = []
                for propname , semantic_properties in node_to_check["properties"].items():
                    #add reciproce checking for nodes in nodes here
                    toaddnode[target].append({propname.split('/')[-1]: semantic_properties})
                node_properties_dicts.append(toaddnode)
        
        log.debug(node_properties_dicts)
        log.info(all_files)
        
        return {'data':all_files, 'summary': summary, 'shacl_requirements': json.loads(r_decoded), 'shacl_original': f_constraints_text}
    
    def add_predicates_all(self,toadd_dict=list):
        """ add predicates to all ids
        :param toadd_dict: dictionary of all the predicates and value to add to the ro-crate-metadata.json
        :type  toadd_dict: dict
        """
        self.delete_hashtag_from_begin_id()
        #try and get the same result by using rocrate
        data = self._read_metadata_datacrate()
        for entity in data["@graph"]:
            log.info(f"Crate data entities: {entity._jsonld}")
            for annotationfile in toadd_dict:
                uri_name  = annotationfile.URI_predicate_name
                value_uri = annotationfile.value
                entity[uri_name] = value_uri
        self._write_metadata_datacrate(data)
    
    def delete_predicates_all(self,todelete_dict=dict):
        """ delete predicates from all ids 
        :param todelete_dict: dictionary of all the predicates and value to delete from the ro-crate-metadata.json
        :type  todelete_dict: dict
        """
        self.delete_hashtag_from_begin_id()
        data = self._read_metadata_datacrate()
        for entity in data["@graph"]:
            log.info(f"Crate data entities: {entity._jsonld}")
            for annotationfile in todelete_dict:
                uri_name  = annotationfile.URI_predicate_name
                entity.pop(uri_name, None)
        self._write_metadata_datacrate(data)
        
    def create_blank_node_by_id(self, file_id=str, node_type=str, uri_predicate=str):
        tocheck_folder = self.storage_path
        #load in metadata files
        self.delete_hashtag_from_begin_id()
        data = self._read_metadata_datacrate()
        
        new_uuid_blank_node = uuidmake.uuid4().hex
        #go over each file in the graph to see if the @id is the same as the file_id
        for item in data["@graph"]:
            if item["@id"] == file_id:
                #if it is the same, create a new blank node with the same @id
                new_blank_node = {}
                new_blank_node["@id"] = new_uuid_blank_node
                new_blank_node["@type"] = node_type
                #add the new blank node to the graph
                data["@graph"].append(new_blank_node)
                #add uri predicate to the item with value of nw blacnk node @id
                item[uri_predicate] = {"@id":new_uuid_blank_node}
                #write the new graph to the metadata file
                log.debug(data)
                self._write_metadata_datacrate(data)
                return new_blank_node
        
    def delete_predicates_by_id(self,to_delete_predicate=str, file_id=str):
        """ delete predicates to given ids by giving a dictionary of predicates to delete 
        :param to_delete_predicate: predicate to delete from the file metadata
        :type  to_delete_predicate: str
        :param file_id: id of the file to which to add the predicates to
        :type  file_id: str
        :raises KeyError: the supplied key was not found in the ro-crate-metadata.json file
        """
        self.delete_hashtag_from_begin_id()
        tocheck_folder = self.storage_path
        todelete = False
        #load in metadata files
        data = self._read_metadata_datacrate()

        #find id of file and delete predicate of existing 
        for ids in data['@graph']:
            if ids['@id'] == file_id:
                todelete = True
                try:
                    ids.pop(to_delete_predicate)
                except:
                    return {"error":404,"detail":"Predicate not found"}
                
        if todelete != True:
            return {"error":404,"detail":"File not found"}
                            
        #write back data to meta json file
        self._write_metadata_datacrate(data=data)
        return {"data":data}
    
    def add_predicates_by_id(self,toadd_dict_list=list, file_id=str):
        """ add predicates to given ids by giving a dictionary of predicates to add to what id
        :param toadd_dict_list: list of dictionaries of all the ids with in them a dictionary of all the predicates and value to add to the metadata.json
        :type  toadd_dict_list: list
        :param file_id: id of the file to which to add the predicates to
        :type  file_id: str
        :raises KeyError: the supplied key was not found in the ro-crate-metadata.json file
        """
        self.delete_hashtag_from_begin_id()
        path_shacl = os.path.join(Locations().get_workspace_location_by_uuid(space_uuid=self.uuid),"all_constraints.ttl")
        log.info(path_shacl)
        test = shclh.ShapesInfoGraph(path_shacl)
        shacldata = test.full_shacl_graph_dict()
        data = self._read_metadata_datacrate()

        data_entities = data['@graph']
        log.debug(data_entities)
        

        #convert the chacl file to have all the properties per node id
        node_properties_dicts = []
        for node_to_check in shacldata:
            toaddnode = {}
            if node_to_check["target"] is not None:
                target = node_to_check["target"].split("/")[-1]
                toaddnode[target] = []
                for propname , semantic_properties in node_to_check["properties"].items():
                    #add reciproce checking for nodes in nodes here 
                    toaddnode[target].append({propname.split('/')[-1]: semantic_properties})
                node_properties_dicts.append(toaddnode)
        
        
        all_files = []
        all_predicates = []
        #get all files from the projectfile
        for dictionaries in data["@graph"]:
            for iteme, value in dictionaries.items():
                if iteme == "@id" and value == file_id:
                    for item_save, value_save in dictionaries.items():
                        all_predicates.append(item_save)
                        all_files.append({'predicate':item_save,'value':value_save})
        
        if len(all_predicates) == 0:
            return {"error":404,"detail":"Resource not found"}
        
        ## for each annotation given ##
        warnings = []
        for annotationfile in toadd_dict_list:
            uri_name  = annotationfile.URI_predicate_name
            value_uri = annotationfile.value
            
            ## check if annotation is in the shacl file ##
            for predicates in all_files:
                find_now = 0
                for itemee, value in predicates.items():
                    if itemee == 'predicate' and value == "@type":
                        find_now = 1
                    if itemee == "value" and find_now == 1:
                        to_search_type = value
            for node in node_properties_dicts:
                for nodekey, nodevalue in node.items():
                    if nodekey == to_search_type:
                        all_props = []
                        for prop in nodevalue:
                            for propkey, propvalue in prop.items():
                                propmin = 0
                                for propattribute, propattributevalue in propvalue.items():
                                    if propmin == 0:
                                        if propattribute == "min" and propattributevalue is not None:
                                            propmin = 1
                                    
                                    if propattribute == "type" and propattributevalue is not None:
                                        proptype = propattributevalue
                                    
                                    if propattribute == "type" and propattributevalue is None:
                                        proptype = 'String'
                                    
                                    if propattribute == "values" and propattributevalue is not None:
                                        valueprop = propattributevalue
                                            
                                all_props.append({propkey:{'min':propmin,'value':valueprop,'typeprop':proptype}})

            chacl_URI_list = []
            for diff_kind_annotations in all_props:
                for key_annotation , metadata_annotation in diff_kind_annotations.items():
                    chacl_URI_list.append(key_annotation)
            log.info(f"chacl_list_printed: {chacl_URI_list}")
            for entity in data_entities:
                try:
                    log.info(f"Crate data entities: {entity._jsonld}")
                except Exception as e:
                    log.error(f'error when displaying jsonld rocrate data via rocrate python lib: {e}')
                    log.exception(e)
                if entity["@id"] == file_id:
                    entity[uri_name]= value_uri
            if uri_name not in chacl_URI_list:
                warnings.append("non shacl defined constraint metadata has been added: "+ uri_name)
                
        ## implement annotation in the data is found , send warning message is annotation title not found in constraints ##
        ## write back to metadata file and return metadata.json file 
        #write back data to meta json file located in the workspace
        with open(os.path.join(self.storage_path, "ro-crate-metadata.json"), "w") as outfile:
            json.dump(data, outfile, indent=4)
            
        data = self._read_metadata_datacrate()
        return {"Data":data, "Warnings":warnings}
        
    
    def _read_metadata_datacrate(self):
        metadata_location = os.path.join(self.storage_path,'ro-crate-metadata.json') 
        with open(metadata_location) as metadata_file:
            return(json.load(metadata_file))
    
    def _write_metadata_datacrate(self,data):
        metadata_location = os.path.join(self.storage_path,'ro-crate-metadata.json') 
        with open(metadata_location, 'w') as metadata_file:
            json.dump(data, metadata_file)
    
    def _read_metadata(self):
        # use self.location() to extend towards ./ro-crate-metadata.json
        metadata_location = os.path.join(Locations().get_repo_location_by_url(self.repo_url),'ro-crate-metadata.json') 
        # load it and return it in some form?
        with open(metadata_location) as metadata_file:
            return(json.load(metadata_file))
        # and/or us the rocrate-py stuff
        
    @abstractmethod
    def location(self):
        """ returns the location of this git repo based ro crate
        """
        pass

    def sync(self):
        GitRepoCache().update_content(self.location())

    def clone_repo(self,repo_url):
        GitRepoCache().clone_content(self.location(), repo_url)
        
    def make_repo(self):
        GitRepoCache().init_repo(self.location())    