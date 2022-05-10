#! /bin/sh

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
    echo "React.js is installed on your system."
    echo "Running frontend..."
    python -m webbrowser http://localhost:3000
    export NODE_OPTIONS=--openssl-legacy-provider
    npm run start