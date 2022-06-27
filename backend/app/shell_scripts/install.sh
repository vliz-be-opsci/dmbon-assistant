#! /bin/bash

#common prelude 
SCRIPT_DIR="$( cd "$( dirname "$( readlink -f "${BASH_SOURCE[0]}")")" &> /dev/null && pwd -P )"
COMMONS=${SCRIPT_DIR}/common.sh
source ${COMMONS}
# end common prelude

CWD=$(pwd)
binpath="/usr/local/bin"

cd $SCRIPT_DIR
for tool in $(ls -1 *.sh|grep -v -P 'common|install'); do
  sudo rm ${binpath}/${tool} 2>/dev/null
  sudo ln -s ${SCRIPT_DIR}/${tool} ${binpath} 
done
echo "Install done. Tools linked to ${binpath}."

cd ${CWD}
