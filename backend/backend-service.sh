#! /usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd ${SCRIPT_DIR}

PIDFILE="backend.pid"

function dependencies {
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
} 

function start_service {
  #check if a -b flag is passed as second argument
  if [ "$2" == "-b" ]; then
    echo "Starting the service..."
  else
    #open the browser 
    echo "Starting the service and opening browsers..."
    python -m webbrowser http://localhost:6656/apiv1/redoc
    python -m webbrowser http://localhost:6656/apiv1/docs
  fi
  #run the server
  uvicorn app.app:app --reload --port 6656 --host 0.0.0.0 &
  echo -n $! > $PIDFILE
 } 

function stop_service {
  kill $(cat ${PIDFILE})
  rm ${PIDFILE} >> /dev/null
} 

function check_service {
  local running="1"
  if [ -f ${PIDFILE} ] ; then
    local pid=$(cat ${PIDFILE}) 
    ps -p ${pid} >/dev/null 2>&1
    running=$?
    if [ "$running" != "0" ] ; then
      echo "available pid '${pid}' does not seem to be running -- removing ${PIDILE}" >&2
      rm ${PIDFILE} > /dev/null
    else 
      echo "process '${pid}' running" >&2
    fi
  else
    echo "No pid available in ${PIDFILE} - assume service is not running" >&2 
  fi
  echo ${running} 
} 

# check run argument

case ${1} in

  start) 
    echo "request to start..."
    if [ "$(check_service)" == "0" ] ; then
      echo "Backend Service ($(cat ${PIDFILE})) is running. Visit http://localhost:6656/"
    else
      echo "Backend Service is not running. Will start it now."
      dependencies
      start_service
      echo "Backend Service started as pid $(cat ${PIDFILE})"
    fi
    ;;

  stop)
    echo "request to stop..."
    if [ "$(check_service)" == "0" ] ; then
      echo "Backend Service ($(cat ${PIDFILE})) is running. Stopping now." 
      stop_service
    else
      echo "Backend Service is not running. Nothing to stop. Check ps -ef | grep uvicorn"
    fi
    ;;

  status)
    if [ "$(check_service)" == "0" ] ; then
      echo "Backend Service ($(cat ${PIDFILE})) is running. Visit http://localhost:6656/"
    else
      echo "Backend Service is not running"
    fi
    ;;

  *) 
    echo "Usage: ${0}  start|stop|status"
    exit 1
    ;;

esac


