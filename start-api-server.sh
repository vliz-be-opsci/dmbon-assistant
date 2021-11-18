#! /bin/sh

python -m webbrowser http://localhost:6656/apiv1/redoc
python -m webbrowser http://localhost:6656/apiv1/docs
uvicorn app.app:app --reload --port 6656