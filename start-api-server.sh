#! /bin/sh

python -mwebbrowser http://localhost:6656/docs
uvicorn app:app --reload --port 6656