#! /bin/bash

#common prelude 
SCRIPT_DIR="$( cd "$( dirname "$( readlink -f "${BASH_SOURCE[0]}")")" &> /dev/null && pwd -P )"
COMMONS=${SCRIPT_DIR}/common.sh
source ${COMMONS}
# end common prelude

gitserv=${1:-github.com}
gituser=git

case ${gitserv} in
  github\.com)
    register_url="https://github.com/settings/keys"
    ;;
  gitlab\.vliz\.be)
    register_url="https://gitlab.vliz.be/-/profile/keys" 
    ;;
  *)
    fail "this script does not support connecting the service @${gitserv}" 
    ;;
esac

log "Configuring ssh for git service connect to ${gitserv}" 
touch ${ssh_cfg}
if [[ "$?" -ne "0" ]]; then 
  fail "ssh config at ${ssh_cfg} not writeable" 
fi
already=$(cat ${ssh_cfg} | grep -i -P -A3 "host\s+${gitserv}")
if [[ -z ${already} ]]; then
  log "Adding config to connect to ${gitserv}"
  if [[ ! -f ${keyfile} ]]; then
    fail "The expected keyfile ${keyfile} does not exist - please generate with tool 'make-git-sshkey.sh'" 
  fi
  echo -e "Host ${gitserv}\n  User ${gituser}\n  IdentityFile ${keyfile}" >> ${ssh_cfg}
else
  log "ssh-Config already present for 'Host ${gitserv}'" 
  idfline=$(echo "${already}" | grep -i IdentityFile | head -1)
  IFS=' ' read -r -a idfparts <<< "${idfline}"
  keyfile="$(echo "ls ${idfparts[1]}" | sh)" 
  if [[ ! -f ${keyfile} ]]; then
    fail "The configured keyfile ${keyfile} does not exist - please remove the 'Host ${gitserv}' entry in the ssh config file at ${ssh_cfg}. Then retry." 
  fi
fi

echo
echo "Config Ready. (for key in ${keyfile})"
echo "Instructions to connect your ssh-key to the git service at ${gitserv}"
echo
echo "Surf to ${register_url} and verify if the ssh key for ${keyuser} is available." 
echo "If not register it on that page, by pasting the section between (not including) the '----' lines below." 
echo -e "----\n$(cat ${keyfile}.pub)\n----"
echo "After this, please verify the setup with check-gitssh.sh" 

