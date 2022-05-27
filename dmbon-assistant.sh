#! /usr/bin/env bash

# federate start | stop | status service requests for the front-backend service combo

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

function service_request {
    srvrq=${1}
    for srv in "backend" "frontend"; do
        script="${SCRIPT_DIR}/${srv}/${srv}-service.sh"
        if [ ! -x ${script} ]; then
            echo "script at ${script} does not exist or is not executable" >&2
        fi
        echo "${script} ${srvrq} &" | bash 
        echo "'$srv' service requested for '${srvrq}'"
        echo
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


