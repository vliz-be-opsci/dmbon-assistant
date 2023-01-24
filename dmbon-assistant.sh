#! /usr/bin/env bash

# federate start | stop | status service requests for the front-backend service combo

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

function service_request {
    srvrq=${1}
    for srv in "backend" "frontend"; do
        #if [[ $srv == "backend" ]]; then do code below else if [[ $srv == "frontend" ]];
        if [[ $srv == "backend" ]]; then
            script="${SCRIPT_DIR}/${srv}/${srv}-service.sh"
            if [ ! -x ${script} ]; then
                echo "script at ${script} does not exist or is not executable" >&2
            fi
            echo "${script} ${srvrq} -b &" | bash 
            echo "'$srv' service requested for '${srvrq}'"
            echo
        elif [[ $srv == "frontend" ]]; then
            echo "service request: $srvrq $srv"
            #then check if node http-server is installed and if not install it
            if ! command -v http-server &> /dev/null
            then
                echo "http-server could not be found, installing it now"
                npm install http-server -g
            fi
            #run the http-server on ./frontend and open in browser
            if [[ $srvrq == "start" ]]; then
                echo "starting http-server"
                http-server ./frontend -p 8080 -o &
            elif [[ $srvrq == "stop" ]]; then
                echo "stopping http-server"
                #make variable that finds netstat -ano | findstr :<PORT>
                httpserverpid=$(netstat -ano | findstr :8080 | awk '{print $5}')
                #print the process id of http-server
                echo "http-server process id: $httpserverpid"
                #try and kill the process
                kill $httpserverpid
                #if the process is still running, kill it with fire
                if [[ $(netstat -ano | findstr :8080 | awk '{print $5}') == $httpserverpid ]]; then
                    echo "http-server is still running, killing it with fire"
                    #perform taskkill in powershell
                    #powershell.exe -Command "Stop-Process -Id $httpserverpid"
                    #perform taskkill in cmd
                    powershell.exe -Command "Stop-Process -Id $httpserverpid"
                    #taskkill when shit really hits the fan
                    #taskkill /F /PID $httpserverpid
                fi
            elif [[ $srvrq == "status" ]]; then
                echo "checking http-server status"
                ps -ef | grep http-server
            fi
        else
            echo "unknown service"
        fi
    done
}

# check cli argument and feed it into the federated services
case ${1} in
  start|stop|status)
    service_request $1
    ;;

  *) 
    echo "Usage: ${0}  start|stop|status"
    exit 1
    ;;
esac


