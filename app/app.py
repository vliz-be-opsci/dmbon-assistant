from requests import exceptions
from fastapi import FastAPI, Path, Query, HTTPException, status, APIRouter, Depends
from fastapi.openapi.utils import get_openapi
from typing import List, Optional, Set
from pydantic import BaseModel, Field
import os, json, requests, asyncio, sys, aiohttp, shutil, git, uuid, subprocess, stat
from importlib import import_module
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

#TODO: finish forloop import 
gbl = globals()

#make app
app = FastAPI(docs_url=None, redoc_url=None, openapi_url="/apiv1/schema.json")
app.mount("/static", StaticFiles(directory="static"), name="static")

# forloop to import all python files needed for the api
subfolders = [ f.path for f in os.scandir(os.path.join(os.getcwd(),"app","routers")) if f.is_dir() ]
for folder in subfolders:
    print(folder.split(os.path.sep)[-1],file=sys.stderr)
    onlyfiles = [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))]
    for toimport in onlyfiles:
        moduleToImport = 'routers.'+folder.split(os.path.sep)[-1]+"."+toimport.split('.')[0]
        print(moduleToImport,file=sys.stderr)
        oldcwd = os.getcwd()
        os.chdir(folder) 
        try:
            gbl[folder.split(os.path.sep)[-1]+toimport.split('.')[0]] = import_module(toimport.split('.')[0])
            os.chdir(oldcwd)
            print(folder.split(os.path.sep)[-1]+toimport.split('.')[0],file=sys.stderr)
            app.include_router(globals()[folder.split(os.path.sep)[-1]+toimport.split('.')[0]].router)
        except:
            os.chdir(oldcwd)

# import shacl_helper as shclh
import app.ro_crate_reader_functions as ro_read


#forloop to include all the files for the api in the router directory
#app.include_router(profiles.router)
### Custom API look ###

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="RO-Crate maker API",
        version="0.0.1",
        description='RO-Crate manager Rest-API',
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://biocompute-objects.github.io/bco-ro-crate/assets/img/biocomputeobject-rocrate.svg?20201014"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

@app.get("/apiv1/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )


@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()


@app.get("/apiv1/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="/static/redoc.standalone.js",
    )

app.openapi = custom_openapi