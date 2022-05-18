#! /usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd ${SCRIPT_DIR}

LAST_BUILD_FILE="build/build.time"

function build {
  export NODE_OPTIONS=--openssl-legacy-provider
  npm run build
  echo -n $(date --iso=seconds) > ${LAST_BUILD_FILE}
}

function changes {
  local cnt='-1'
  if [ -f ${LAST_BUILD_FILE} ]; then
    cnt=$(find ./src -type f -newer ${LAST_BUILD_FILE} | wc -l)
  fi
  echo ${cnt} # return
}

if [ "$1" == "clean" ]; then
  rm ${LAST_BUILD_FILE} >> /dev/null
fi 

if [ "$(changes)" != "0" ]; then
  echo "requires rebuild"
  build
else
  echo "Deciding to keep last build --> add 'clean' argument if you don't agree"
fi

echo "build ready"
