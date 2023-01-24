import array
from locale import normalize
import git, os, json, re
from abc import abstractmethod
from .location import Locations
from rocrate.rocrate import ROCrate
import logging
import stat
import shutil
import subprocess
from subprocess import call
import app.shacl_helper as shclh
from rdflib import Graph
import json, math
import validators
import requests
from pyshacl import validate
from base64 import decode
import uuid as uuidmake

log=logging.getLogger(__name__)

def refs_should_be_omitted(ref: str):
    """
    Determine if a ref should be completely omitted from json output, we do not want
    to show origin
    @param ref: string containing the ref
    @return: True if this ref should be omitted from the list
    """
    return ref.startswith("origin/")


def adjust_ref(ref: str):
    """
    Refs should be adjusted, as an example HEAD -> should be removed
    @param ref: string containing the ref
    @return: correct ref string value to be passed to GitGraph.js library
    """
    if ref.startswith("HEAD"):
        return ref.split(" -> ")[1]
    return ref

def fix_parents(commit):
    """
    We need to generate a parent list that is a list not a single string space separated
    @param commit:  commit parsed from json, it is a dictionary
    """
    parents = commit["parents"]
    if ' ' in parents:
        splitted_parents = parents.split(' ')
        commit["parents"] = splitted_parents
    else:
        commit["parents"] = [parents]


def fix_ref(commit):
    """
    Fix refs of the commit, this is needed because refs are comma separated in raw json
    output of git log
    @param commit: commit parsed from json, it is a dictionary
    """
    splitted_refs = commit["refs"].split(",")
    newref = ""

    for ref in splitted_refs:
        # omit every origin refs (need to generalize)
        ref = ref.strip()
        if ref and not refs_should_be_omitted(ref):
            newref += adjust_ref(ref)

    if newref:
        commit["refs"] = [newref]
    else:
        commit["refs"] = []

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
                #log.info(f"deleting existing repo on location {location} for repo :{ssh_url}")
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
            #log.info(f"exception occured :{e}")
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
        #self.delete_hashtag_from_begin_id()
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

    def get_subobject(self, object_id:str, data:dict, array_dicts:list=[]):
        '''Get the subobject info of a given object id and check if the value is a string or a dict, if it is a dict then recursively do this function again and add the dictionaries found to the array_dicts
        @param object_id: the id of the object to get the subobject from
        @type object_id: string
        @param data: the data to get the subobject from
        @type data: dict
        '''
        log.info(f"object_id: {object_id}")
        for item in data['@graph']:
            if item["@id"] == object_id:
                item_dict = {}
                item_dict["@id"] = item["@id"]
                item_dict["@type"] = "schema:" + item["@type"]
                for key, value in item.items():
                    if key == "@type":
                        continue
                    else:
                        #check if the value is not a dict
                        if value != None and type(value) != dict:
                            item_dict["schema:" + key] = value
                        else:
                            try:
                                item_dict["schema:" + key] = value
                                #log.info(f"value: {value}")
                                self.get_subobject(value["@id"], data, array_dicts)
                            except:
                                pass
                array_dicts.append(item_dict)
                return(array_dicts)
        
    def get_predicates_all(self):
        """ get predicates from all ids
        """
        self.delete_hashtag_from_begin_id()
        path_shacl = os.path.join(Locations().get_workspace_location_by_uuid(space_uuid=self.uuid),"all_constraints.ttl")
        md = self._read_metadata_datacrate()
        data = self._read_metadata_datacrate()
        #log.debug(md)
        all_files = []
        for dictionaries in md["@graph"]:
            #log.debug(dictionaries)
            for item, value in dictionaries.items():
                if item == "@id":
                    all_files.append(value)
        #log.debug(all_files)
        #foreach file get all the attributes
        files_attributes = {}
        for file in all_files:
            if file != "ro-crate-metadata.json" and file != './':
                if "." in file and file.split("/")[-1] != "":
                    files_attributes[file]= {}
                    
                    #get the shacl validation results
                    barebones_json = {
                            "@context": 
                                { 
                                "schema": "http://schema.org/" , 
                                "ex": "http://example.org/ns#"
                                },
                            "@graph": []
                            }
    
                    for item in data["@graph"]:
                        if item["@id"] == file:
                            item_dict = {}
                            item_dict["@id"] = item["@id"]
                            item_dict["@type"] = "schema:" + item["@type"]
                            for key, value in item.items():
                                if key == "@type":
                                    continue
                                else:
                                    #check if the value is not a dict
                                    if value != None and type(value) != dict:
                                        item_dict["schema:" + key] = value
                                    else:
                                        try:
                                            self.get_subobject(value["@id"], data, barebones_json["@graph"])
                                        except:
                                            pass
                            
                            barebones_json["@graph"].append(item_dict)
                    log.debug(barebones_json)
                    shacl_file = open(path_shacl, "rb").read()
                    sh = Graph().parse(data=shacl_file, format="turtle")
                    r = validate(data_graph=json.dumps(barebones_json), shacl_graph=sh, advanced=True, data_graph_format="json-ld", serialize_report_graph="json-ld")
                    r_decoded = r[1].decode("utf-8")
                    
                    datag = []
                    for item in data["@graph"]:
                        if item["@id"] == file:
                            #log.debug(f'found item with id {file}')
                            for key, value in item.items():
                                dict_predicates = {}
                                dict_predicates["predicate"] = key
                                dict_predicates["value"] = value
                                datag.append(dict_predicates)
                                
                    #log.debug(f"data: {datag}")
                    green = 2
                    orange = 0
                    red = 0

                    for item in datag:
                        if item["predicate"] != "@type" and item["predicate"] != "@id":
                            green+=1
                            
                    validation_report_json  = json.loads(r_decoded)        

                    # check the report for the number of violations for the item 
                    for item in validation_report_json:
                        #log.debug(f' validation report item: {item}')
                        try:
                            if item["@type"][0] == "http://www.w3.org/ns/shacl#ValidationResult":
                                for key, value in item.items():
                                    if key == "http://www.w3.org/ns/shacl#focusNode":
                                        name_focusnode = "./"+value[0]["@id"].split("backend/")[-1]
                                        #log.info(f'name_file: {file}')
                                        #log.info(f'name_focusnode: {name_focusnode}')
                            if name_focusnode == file or name_focusnode == "./"+file:
                                for key, value in item.items():
                                    if "resultSeverity" in key == "http://www.w3.org/ns/shacl#resultSeverity":
                                        if value[0]["@id"].split("#")[-1] == "Violation":
                                            red+=1
                                        if value[0]["@id"].split("#")[-1] == "Warning":
                                            orange+=1
                        except:
                            pass
                    #log.debug(f' green: {green}, orange: {orange}, red: {red}')
                    percentage_red = math.ceil((red/(red+green+orange))*100)
                    percentage_orange = math.ceil((orange/(red+green+orange))*100)
                    percentage_green = math.ceil((green/(red+green+orange))*100)
                    summary = {"green": percentage_green, "orange": percentage_orange, "red": percentage_red}
                    files_attributes[file]["summary"] = summary
                    
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
                                break
                else:
                    #check if the @type of the file is not a dataset
                    for item in data["@graph"]:
                        if item["@id"] == file:
                            if item["@type"] != "Dataset":
                                summary = {"green": 0, "orange": 0, "red": 0}
                                files_attributes[file] = {}
                                files_attributes[file]["summary"] = summary
                                for dictionaries in md["@graph"]:
                                    for item, value in dictionaries.items():
                                        if item == "@id" and value==file:
                                            for item_save, value_save in dictionaries.items():
                                                files_attributes[file][item_save] = value_save 
                                            break         
                
        #log.debug(f'All predicates from all files from project : {files_attributes}')
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
        
    def get_git_history(self):
        location_space = self.storage_path
        #log.debug(f'location_space: {location_space}')
        command = ['git']
        # command.append('--git-dir=C:/develop/GitHub/AzureDevopsWordPlayground/.git')
        command.append('log')
        command.append(
            "--pretty=format:{\"refs\" : \"%D\",  \"hash\": \"%H\",  \"hashAbbrev\" : \"%h\",  \"parents\" : \"%P\",  \"author\": {    \"name\": \"%aN\",    \"email\": \"%aE\",    \"timestamp\": \"%aD\"  },  \"subject\": \"%s\"},")
        process = subprocess.Popen(command, cwd=location_space, stdout=subprocess.PIPE)
        json_data = process.communicate()[0].decode('utf-8')
        # remember that we pass a list of objects, the output of git log parametrized
        json_data = json_data.rstrip(',')  # First of all remove trailing quotes
        s = "[" + json_data + "]"  # Convert into an array
        while True:
            try:
                full_data = json.loads(s)   # try to parse...
                break                    # parsing worked -> exit loop
            except Exception as e:
                # "Expecting , delimiter: line 34 column 54 (char 1158)"
                # position of unexpected character after '"'
                unexp = int(re.findall(r'\(char (\d+)\)', str(e))[0])
                # position of unescaped '"' before that
                unesc = s.rfind(r'"', 0, unexp)
                s = s[:unesc] + r'\"' + s[unesc+1:]
                # position of correspondig closing '"' (+2 for inserted '\')
                closg = s.find(r'"', unesc + 2)
                s = s[:closg] + r'\"' + s[closg+1:]

        # Now we need to start making fixing, first fix is simply change the refs into an array
        # gitgraph library does not seems to be able to render more than one refs, so we simply
        # create an array with the whole list of branches.
        for commit in full_data:
            fix_ref(commit)
            fix_parents(commit)

        #write the metadata
        return {"data":full_data}
    
    def add_URI(self,URI, object_id=None):
        """get URI data and add it to the rocrate metadata
        :param URI: URI to add
        :param object_id: object_id to add the URI to
        :type URI: str
        :type object_id: str
        :return: rocrate metadata from the crate that was updated
        """
        #get the metadata
        data = self._read_metadata_datacrate()
        #first check if the URI is a valid url
        if not validators.url(URI):
            return {"error": "The URI is not a valid url"}
        #get the response from the URI with headers application/ld+json
        try:
            #TODO check if rdf-lib can do content negociation for me and if it can then use it
            uri_response = requests.get(URI, headers={'Accept': 'application/ld+json'}) #TODO write util function to loop over diff ways to get data
            #console log the response.status_code and response.text
            log.debug(f'uri_response.status_code: {uri_response.status_code}')
            log.debug(f'uri_response.text: {uri_response.text}') 
            
            #check if the uri_response.text is a valid json
            #TODO write helper function that can handle json and turtle text and lets its be converted to json+ld
            try:
                json.loads(uri_response.text)
            except ValueError as e:
                return {"error": "The URI is not a valid json"}
        
            #load in response_json the json from the uri_response.text
            response_json = json.loads(uri_response.text)
            log.debug(f'response_json: {response_json}')
            #check if @id and @type keys are in the response_json and if @context == "http://schema.org/"
            if "@id" in response_json and "@type" in response_json and response_json["@context"] == "http://schema.org":
                #loop over all items in the graph and check if the @id is already present in the graph
                for item in data["@graph"]:
                    if item["@id"] == response_json["@id"]:
                        for dos in data["graph"]:
                            if dos["@id"] == object_id:
                                #get the @type and @id of the item and put them in the data[graph]
                                dos[response_json["@type"]] = {"@id":response_json["@id"]}
                                self._write_metadata_datacrate(data)
                                return {data}
                
                #check if the object_id is not None
                #check if the object_id is in the metadata
                if object_id is not None:
                    found = False
                    for item in data["@graph"]:
                        if item["@id"] == object_id:
                            #log.debug(f'object id found')
                            found = True
                            break
                    if not found:
                        return {"error": "The object_id is not in the metadata"}
                #first normalise the response_json using a while loop
                normalised = True
                toanalyse_json = [response_json]
                while normalised:
                    all_commands = []
                    for item in toanalyse_json:
                        normalised_response_json = self.normalize_json_ld_response(item)
                        commands = normalised_response_json[0]
                        normalised = normalised_response_json[1]
                        #delete first item from toanalyse_json list
                        for command in commands:
                            all_commands.append(command)
                    #go over all the commands and execute them by searching for the old key and value and replace it with the new key and value and adding the blank_node to the list of toanalyse_json
                    for command in all_commands:
                        #log.debug(f'command: {command}')
                        old_dict = command["old"]
                        new_dict = command["new"]
                        blank_node = command["blank_node"]
                        old_key = old_dict["key"]
                        old_value = old_dict["value"]
                        new_key = new_dict["key"]
                        new_value = new_dict["value"]
                        #search for old key and value and replace it with the new key and value
                        itemnumber = 0
                        for item in toanalyse_json:
                            if old_key in item:
                                try:
                                    string_item = json.dumps(item)
                                    #check if the old key and value are in the string_item
                                    #convert old value dict to json string
                                    old_value_string = json.dumps(old_value)
                                    searchstring = old_value_string
                                    if searchstring in string_item:
                                        #replace the old value with the new value
                                        new_value_string = json.dumps(new_value)
                                        string_item = string_item.replace(searchstring, new_value_string)
                                        #convert string_item back to json
                                        item = json.loads(string_item)
                                        toanalyse_json[itemnumber] = item
                                        #add the blank_node to the toanalyse_json list
                                        if blank_node != "":
                                            toanalyse_json.append(blank_node)
                                except:
                                    pass
                            itemnumber += 1
                #check if the object_id has the same @context as the response_json
                #loop over the toanalyse_json list and add the items to the metadata
                for entry in toanalyse_json:
                    #check if entry has @context in it 
                    if "@context" in entry and "@type" in entry:
                        toappenddict = {}
                        #check if the entry id is not None
                        if "@id" not in entry:
                            #make object id
                            node_id = "_:"+uuidmake.uuid4().hex
                        else:
                            node_id = entry["@id"]
                        
                        toappenddict["@id"] = node_id
                        #loop over the rest of the dict and add it to the toappenddict
                        for key in entry:
                            if key != "@id":
                                toappenddict[key] = entry[key]
                        #add the toappenddict to the metadata
                        data["@graph"].append(toappenddict)
                        if object_id is not None:
                            for item in data["@graph"]:
                                if item["@id"] == object_id:
                                    item[entry["@type"]] = {"@id": node_id}
                                    break
                    else:
                        data["@graph"].append(entry)
                
            #log.debug(f'data: {json.dumps(data, indent=4)}')
            self._write_metadata_datacrate(data)
            return data
        except Exception as e:
            log.error(e)
            log.exception(e)
            return {"error": e}
        
    def normalize_json_ld_response(self, json_ld_response):
        """normalize json ld response
        :param json_ld_response: json ld response to normalize
        :type json_ld_response: str
        :return: normalized json ld response
        """
        #all_replacements = []
        #go over each key in the json_ld_response and check if it is a dict
        #if yes then extract the @type and @id if they exist
        #if @id does not exist then creqte blank node as id
        normalised_called = False
        def normalize_dict(key,value):
            commands = []
            new_replacement_dict = {}
            #if it is a dict check if it has the @id key
            #log.debug(value)
            if "@type" in value:
                #check if id is present 
                if "@id" in value:
                    node_id = value["@id"]
                else:
                    #if it has the @id key replace the value of the key with the @id value
                    #make new node_id by hex 
                    node_id = "_:"+uuidmake.uuid4().hex
                
                #make replacement_dict {"old":{"key":key,"value":value},"new":{"key":value["@type"],"value":{"@id": node_id}}}
                new_replacement_dict["old"] = {"key":key,"value":value}
                new_replacement_dict["new"] = {"key":value["@type"],"value":{"@id": node_id}}
                toappend = {}
                toappend["@id"] = node_id
                #for each entry in the dict add it to the toappend dict
                for key2, value2 in value.items():
                    if key2 != "@id":
                        toappend[key2] = value2
                new_replacement_dict["blank_node"] = toappend
            else:
                #if it does not have the @id key call the normalize_json_ld_response function again
                new_replacement_dict["old"] = {"key":key,"value":value}
                new_replacement_dict["new"] = {"key":key,"value":value}
                new_replacement_dict["blank_node"] = ""
            commands.append(new_replacement_dict)
            return commands
        
        def append_all_commands(commands, all_commands):
            for command in commands:
                all_commands.append(command)
            return all_commands
        
        #if it is a dict then 
        all_commands = []
        if isinstance(json_ld_response, dict):
            for key, value in json_ld_response.items():
                if isinstance(value, dict):
                    commands = normalize_dict(key,value)
                    all_commands = append_all_commands(commands, all_commands)
                    normalised_called = True
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, dict):
                            commands = normalize_dict(key,item)
                            all_commands = append_all_commands(commands, all_commands)
                            normalised_called = True
        if isinstance(json_ld_response, list):
            for iteme in json_ld_response:
                if isinstance(iteme, dict):
                    for key, value in iteme.items():
                        if isinstance(value, dict):
                            commands = normalize_dict(key,value)
                            all_commands = append_all_commands(commands, all_commands)
                            normalised_called = True
                        elif isinstance(value, list):
                            for item in value:
                                if isinstance(item, dict):
                                    commands = normalize_dict(key,item)
                                    all_commands = append_all_commands(commands, all_commands)
                                    normalised_called = True
        return [all_commands,normalised_called]
    
    def get_predicates_by_type(self, type_search=str):
        """Get all predicates by type  
        :param type_search: the type of the predicate
        :type type_search: str
        """
        data = self._read_metadata_datacrate()
        toreturn_data = []
        for item in data["@graph"]:
            #uppercase item["@type"] to make it case insensitive and also type search
            if item["@type"].upper() == type_search.upper():
                toreturn_data.append(item)
        
        return {"data":toreturn_data}
        
    
    def get_predicates_by_id(self,file_id=str):
        """ get predicates from a given id
        :param id: str of the id to get all the predicates of in the ro-crate-metadata.json
        :type  id: str
        """
        self.delete_hashtag_from_begin_id()
        data = self._read_metadata_datacrate()
        ##log.info(f"metadata of the space: {data}")
        path_shacl = os.path.join(Locations().get_workspace_location_by_uuid(space_uuid=self.uuid),"all_constraints.ttl")
        #log.info(path_shacl)
        #check if file_id starts with . ar with / => if it does delete it and add ./ in from of the file_id
        #log.debug(f'file_id: {file_id}')
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
                        #check if the value is not a dict
                        if value != None and type(value) != dict:
                            item_dict["schema:" + key] = value
                        else:
                            item_dict["schema:" + key] = value
                            try:
                                self.get_subobject(value["@id"], data, barebones_json["@graph"])
                            except:
                                pass
                
                #log.debug(returned_dict)
                
                barebones_json["@graph"].append(item_dict)
        
        #log.debug(f'barebones_json: {barebones_json}')
        
        shacl_file = open(path_shacl, "rb").read()
        sh = Graph().parse(data=shacl_file, format="turtle")
        r = validate(data_graph=json.dumps(barebones_json), shacl_graph=sh, advanced=True, data_graph_format="json-ld", serialize_report_graph="json-ld")
        r_decoded = r[1].decode("utf-8")
        
        datag = []
        for item in data["@graph"]:
            if item["@id"] == file_id:
                #log.debug(f'found item with id {file_id}')
                for key, value in item.items():
                    dict_predicates = {}
                    dict_predicates["predicate"] = key
                    dict_predicates["value"] = value
                    datag.append(dict_predicates)
                    
        #log.debug(f"data: {datag}")
        
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
                            name_focusnode = "./"+value[0]["@id"].split("backend/")[-1]
                            #log.info(f'name_focusnode: {name_focusnode}')
                            #log.info(f'file_id: {file_id}')
                if name_focusnode == file_id or name_focusnode == "./"+file_id:
                    for key, value in item.items():
                        if "resultSeverity" in key == "http://www.w3.org/ns/shacl#resultSeverity":
                            if value[0]["@id"].split("#")[-1] == "Violation":
                                red+=1
                            if value[0]["@id"].split("#")[-1] == "Warning":
                                orange+=1
            except:
                pass
        #log.debug(f' green: {green}, orange: {orange}, red: {red}')
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
            toaddnode = {}
            if node_to_check["target"] is not None:
                target = node_to_check["target"].split("/")[-1]
                toaddnode[target] = []
                for propname , semantic_properties in node_to_check["properties"].items():
                    #add reciproce checking for nodes in nodes here
                    toaddnode[target].append({propname.split('/')[-1]: semantic_properties})
                node_properties_dicts.append(toaddnode)
        
        #log.debug(node_properties_dicts)
                
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
                            try:
                                all_files.append({'predicate':item_save,'value':"nodeshape: "+value_save["@id"]})
                                all_recursive_predicates.append({'predicate':item_save,'value':value_save})
                            except:
                                #all these exceptions are based on empty dicts
                                pass
        
        if len(all_predicates) == 0:
            return {"error":404,"detail":"Resource not found"}
        
        #log.info(all_files)
        
        return {'data':all_files, 'complex_data':all_recursive_predicates,'summary': summary, 'shacl_requirements': json.loads(r_decoded), 'shacl_original': f_constraints_text}
    
    def get_shacl_report(self):
        """get the shacl report for the whole space
        """
        self.delete_hashtag_from_begin_id()
        data = self._read_metadata_datacrate()
        #log.info(f"metadata of the space: {data}")
        path_shacl = os.path.join(Locations().get_workspace_location_by_uuid(space_uuid=self.uuid),"all_constraints.ttl")
        #log.info(path_shacl)
        
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
                    
        #log.debug(f"data: {datag}")
        for item in datag:
            if item["predicate"] != "@type" and item["predicate"] != "@id":
                green+=1
                
        validation_report_json  = json.loads(r_decoded)        

        # check the report for the number of violations for the item 
        for item in validation_report_json:
            #log.debug(f' validation report item: {item}')
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
        #log.debug(f' green: {green}, orange: {orange}, red: {red}')
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
        log.debug(f"test shacl info graph: {test}")
        shacldata = test.full_shacl_graph_dict()
        #convert the shacl file to have all the properties per node id
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
        
        #log.debug(node_properties_dicts)
        #log.info(all_files)
        
        return {'data':all_files, 'summary': summary, 'shacl_requirements': json.loads(r_decoded), 'shacl_original': f_constraints_text}
    
    def add_predicates_all(self,toadd_dict=list):
        """ add predicates to all ids
        :param toadd_dict: dictionary of all the predicates and value to add to the ro-crate-metadata.json
        :type  toadd_dict: dict
        """
        self.delete_hashtag_from_begin_id()
        #try and get the same result by using rocrate
        #log.info(f"toadd_dict: {toadd_dict}")
        data = self._read_metadata_datacrate()
        #log.info(f"metadata of the space: {data}")
        for entity in data["@graph"]:
            #log.info(f"entity: {entity}")
            ##log.info(f"Crate data entities: {entity._jsonld}")
            if entity["@id"] != "./ro-crate-metadata.json" and entity["@type"] != "Dataset":
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
            ##log.info(f"Crate data entities: {entity._jsonld}")
            for annotationfile in todelete_dict:
                uri_name  = annotationfile.URI_predicate_name
                entity.pop(uri_name, None)
        self._write_metadata_datacrate(data)
        
    def create_node_by_id(self, file_id=str, node_type=str, uri_predicate=str, node_id=str):
        #log.debug(f"file_id: {file_id}")  
        tocheck_folder = self.storage_path
        #load in metadata files
        self.delete_hashtag_from_begin_id()
        data = self._read_metadata_datacrate()
        
        #check if the node id is filled in if not create one
        if node_id == "" or node_id is None or node_id == "create new Person node":
            node_id = "_:"+uuidmake.uuid4().hex
            
        #log.debug(f"file_id: {file_id}")       
        new_uuid_blank_node = node_id
        
        #check if node_id is a url and if so trigger the self.add_uri function
        if "http" in node_id:
            return self.add_URI(node_id,file_id)
        
        #check if the node is already in the metadata file
        presnet = False
        for entity in data["@graph"]:
            if entity["@id"] == node_id:
                presnet = True
        #go over each file in the graph to see if the @id is the same as the file_id
        for item in data["@graph"]:
            if item["@id"] == file_id:
                #if it is the same, create a new blank node with the same @id
                if presnet == False:
                    new_blank_node = {}
                    new_blank_node["@id"] = new_uuid_blank_node
                    new_blank_node["@type"] = node_type
                    new_blank_node["label"] = node_type+"_"+new_uuid_blank_node
                    #add the new blank node to the graph
                    data["@graph"].append(new_blank_node)
                #add uri predicate to the item with value of nw blacnk node @id
                item[uri_predicate] = {"@id":new_uuid_blank_node}
                #write the new graph to the metadata file
                #log.debug(data)
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
        #log.info(path_shacl)
        test = shclh.ShapesInfoGraph(path_shacl)
        shacldata = test.full_shacl_graph_dict()
        data = self._read_metadata_datacrate()

        data_entities = data['@graph']
        #log.debug(data_entities)

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
            #log.info(f"chacl_list_printed: {chacl_URI_list}")
            for entity in data_entities:
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