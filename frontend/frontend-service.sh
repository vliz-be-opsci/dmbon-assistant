#! /usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd ${SCRIPT_DIR}

PIDFILE="frontend.pid"

function dependencies {
    # first see if node is installed on the users system
    node -v
    if [ $? -ne 0 ]; then
        echo "Node.js is not installed on your system."
        echo "Please install Node.js and try again."
        exit 1
    fi

    echo "Node.js is installed on your system."
    echo "Installing frontend dependencies..."
    npm install

    echo "building the local one pager web site"
    ./frontend-build.sh

    echo "installing local webserver srevice"
    npm install -g serve
} 


function start_service {
    echo "React.js is installed on your system."
    echo "Running frontend..."
    python -m webbrowser http://localhost:3000/
    serve -s build -l 3000 &
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
      echo "Frontend Service ($(cat ${PIDFILE})) is running. Visit http://localhost:3000/"
    else
      echo "Frontend Service is not running. Will start it now."
      dependencies
      start_service
      echo "Frontend Service started as pid $(cat ${PIDFILE})"
    fi
    ;;

  stop)
    echo "request to stop..."
    if [ "$(check_service)" == "0" ] ; then
      echo "Frontend Service ($(cat ${PIDFILE})) is running. Stopping now." 
      stop_service
    else
      echo "Frontend Service is not running. Nothing to stop. Check ps -ef | grep uvicorn"
    fi
    ;;

  status)
    if [ "$(check_service)" == "0" ] ; then
      echo "Frontend Service ($(cat ${PIDFILE})) is running. Visit http://localhost:3000/"
    else
      echo "Frontend Service is not running"
    fi
    ;;

  *) 
    echo "Usage: ${0}  start|stop|status"
    exit 1
    ;;

esac

