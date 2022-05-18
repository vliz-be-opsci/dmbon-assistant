#! /usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd ${SCRIPT_DIR}

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
./frontend_build.sh

echo "installing local webserver srevice"
npm install -g serve

echo "React.js is installed on your system."
echo "Running frontend..."
python -m webbrowser http://localhost:3000/
serve -s build -l 3000

echo "Frontend is running."
echo "Press Ctrl+C to stop."
    
