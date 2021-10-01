#! /bin/sh

python -m webbrowser http://localhost:6656/docs
uvicorn app.app:app --reload --port 6656