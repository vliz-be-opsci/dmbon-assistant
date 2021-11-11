from genericpath import exists
import json
import os
import git
import requests, tempfile, shutil, subprocess, stat

# helper functions to read an rocrate
def on_rm_error(func, path, exc_info):
    #from: https://stackoverflow.com/questions/4829043/how-to-remove-read-only-attrib-directory-with-python-in-windows
    os.chmod(path, stat.S_IWRITE)
    os.unlink(path)

class rocrate_helper:
    def __init__(self, rocratepath):
        self.ro_path = rocratepath
        self.all_metadata = []
        try:
            response = requests.get(self.ro_path)
            tpdir = tempfile.mkdtemp()
            print(tpdir)
            git.Repo.clone_from(self.ro_path, os.path.join(tpdir))
            for filename in os.listdir(tpdir):
                print(filename)
                if filename == "ro-crate-metadata.json":
                    self.ro_metafile = os.path.join(tpdir, filename)
                    with open(os.path.join(self.ro_metafile), "r+")as file:
                        self.ro_metadata = json.load(file)
                        self.all_metadata.append({"location":"root","data":self.ro_metadata})
            try:
                #delete the folder where the project was stored
                shutil.rmtree(tpdir)
            except:
                for i in os.listdir(tpdir):
                    if i.endswith('git'):
                        tmp = os.path.join(tpdir, i)
                        # We want to unhide the .git folder before unlinking it.
                        while True:
                            subprocess.call(['attrib', '-H', tmp])
                            break
                        shutil.rmtree(tmp, onerror=on_rm_error)
                shutil.rmtree(tpdir)
        except:
            #check if there is a rocratemetadata.json file in the ro_path
            for filename in os.listdir(self.ro_path):
                print(filename)
                if filename == "ro-crate-metadata.json":
                    self.ro_metafile = os.path.join(self.ro_path, filename)
                    with open(os.path.join(self.ro_metafile), "r+")as file:
                        self.ro_metadata = json.load(file)
                        self.all_metadata.append({"location":self.ro_path,"data":self.ro_metadata})
                    
    def read_metafile(self):
        for key, item in self.ro_metadata.items():
            print(key,item)
    
    def get_all_metadata_files(self):
        for part in self.ro_metadata['@graph']:
            if "ro-crate-metadata.json" in part["@id"]:
                #if https://github.com in the url replace with https://raw.githubusercontent.com/
                if "https://github.com" in part["@id"]:
                    base =  part["@id"]
                    togeturl = base.replace("https://github.com","https://raw.githubusercontent.com/")
                    togeturl = togeturl.replace("/blob","")
                    r = requests.get(url = togeturl)
                    # extracting data in json format
                    data = r.json()
                    self.all_metadata.append({"location":togeturl,"data":data})
                    self.check_child_metadata(data)
    
    def check_child_metadata(self,tocheck):
        for part in tocheck['@graph']:
            if "ro-crate-metadata.json" in part["@id"]:
                #if https://github.com in the url replace with https://raw.githubusercontent.com/
                if "https://github.com" in part["@id"]:
                    base =  part["@id"]
                    togeturl = base.replace("https://github.com","https://raw.githubusercontent.com/")
                    togeturl = togeturl.replace("/blob","")
                    r = requests.get(url = togeturl)
                    # extracting data in json format
                    data = r.json()
                    self.all_metadata.append({"location":togeturl,"data":data})
                    self.check_child_metadata(data)
        
    def get_overview_metadata(self):
        for i in self.all_metadata:
            print(i)    
    
    def get_ttl_files(self):
        self.ttlinfo = ""
        for i in self.all_metadata:
            for part in i["data"]["@graph"]:
                if ".ttl" in part["@id"]:
                    togeturl = i["location"].replace("ro-crate-metadata.json",part['@id'])
                    r = requests.get(url = togeturl)
                    self.ttlinfo = self.ttlinfo + r.text
        return self.ttlinfo


'''
#test zone              
test = rocrate_helper("C:\\Users\\cedric\\Desktop\\no importante\\ad117931652f4dccb6ef0bb3b3393cc2\\project")
test.read_metafile()
test.get_overview_metadata()

secondtest = rocrate_helper('https://github.com/cedricdcc/test_rocrate_repo.git')
secondtest.get_all_metadata_files()
secondtest.get_ttl_files()
print(secondtest.ttlinfo)
'''                                     
