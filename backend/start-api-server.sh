#! /bin/sh

#echo the current directory
pwd
#check if there is a venv folder already in the directory
if [ -d venv ]; then
    echo "A venv directory already exists in the directory."
    #activate the venv
    source venv/Scripts/activate
    pip install -r requirements.txt
    #run the server
    python -m webbrowser http://localhost:6656/apiv1/redoc
    python -m webbrowser http://localhost:6656/apiv1/docs
    uvicorn app.app:app --reload --port 6656 --host 0.0.0.0
# if there is no venv folder, create one with python virtualenv
fi
    echo "No venv directory exists in the directory."
    echo "Creating a new venv folder..."
    python -m venv venv
    source venv/Scripts/activate
    pip install -r requirements.txt
    #run the server
    python -m webbrowser http://localhost:6656/apiv1/redoc
    python -m webbrowser http://localhost:6656/apiv1/docs
    uvicorn app.app:app --reload --port 6656 --host 0.0.0.0