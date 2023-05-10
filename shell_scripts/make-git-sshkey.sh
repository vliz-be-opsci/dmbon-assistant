#! /bin/bash

#common prelude 
SCRIPT_DIR="$( cd "$( dirname "$( readlink -f "${BASH_SOURCE[0]}")")" &> /dev/null && pwd -P )"
COMMONS=${SCRIPT_DIR}/common.sh
source ${COMMONS}
# end common prelude

log "Generating keypair at ${keyfile}" 
if [[ -f "${keyfile}" ]]; then 
  fail  "key pair ${keyfile} already exists - remove it first with: rm ${keyfile}" 
fi
echo "ssh-keygen -t ed25519 -f ${keyfile} -C ${keyuser} -N \"\"" |sh >/dev/null 2>&1
if [[ "$?" -ne "0" ]]; then 
  fail  "generation of key-pair failed" 
fi
echo "Done. Keypair generated at ${keyfile}" 
