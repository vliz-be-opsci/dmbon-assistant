#! /usr/bin/env bash

#echo the current directory
pwd

#check if there is a venv folder already in the directory
if [ ! -d venv ]; then
    echo "No venv directory exists in the directory."
    # if there is no venv folder, create one with python virtualenv
    echo "Creating a new venv folder..."
    python -m venv venv
else
    echo "A venv directory already exists in the directory."
fi

#activate the venv
if [ -f venv/Scripts/activate ]; then 
    source venv/Scripts/activate
fi
if [ -f venv/bin/activate ]; then 
    source venv/bin/activate
fi

pip install -r requirements.txt
#run the server
python -m webbrowser http://localhost:6656/apiv1/redoc
python -m webbrowser http://localhost:6656/apiv1/docs
uvicorn app.app:app --reload --port 6656 --host 0.0.0.0
