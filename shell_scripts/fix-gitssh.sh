#! /bin/bash

#common prelude 
SCRIPT_DIR="$( cd "$( dirname "$( readlink -f "${BASH_SOURCE[0]}")")" &> /dev/null && pwd -P )"
COMMONS=${SCRIPT_DIR}/common.sh
source ${COMMONS}
# end common prelude

function fixgit {  # fixgit(projectpath)
  prj=${1}
  CWD=$(pwd)
  if [[ ! -d ${prj} ]]; then 
    fail "folder to fix ${prj} does not exist" 
  fi
  # enter the project folder
  cd ${prj}
  echo -e "--\n @ project folder ${prj} to fix git-ssh uri" 
  # find all remote names and fix them all
  for name in $(git remote -v | IPS=' ' awk '{print $1}' | sort -u ); do 

    log ".name = ${name}"

    fetchpattern="^${name}\s+(.*)\s+\(fetch\)$" 
    fetchline=$(git remote -v | grep -P "${fetchpattern}")

    if [[ ${fetchline} =~ ${fetchpattern} ]]; then
      remoteurl=${BASH_REMATCH[1]}
      log "..remoteurl=${remoteurl}"
      echo "..Git repo at ${prj} is linked to remote ${name} at ${remoteurl}"
      giturlpat="^git@([^:])+:.*$"
      if [[ ${remoteurl} =~ ${giturlpat} ]]; then
        log "..This git repo is already connected using ssh - no need to do anything further. " 
      else
        httpurlpat="^https?://([^/]+)/(.+)$"
        if [[ ${remoteurl} =~ ${httpurlpat} ]]; then
          gitserv=${BASH_REMATCH[1]}
          gitpath=${BASH_REMATCH[2]}
          newurl="git@${gitserv}:${gitpath}"
          echo "..Ready to fixing the link for remote ${name} to ${newurl}"
          read -p " Proceed? [Y/n] " -r
          if [[ ! -z ${REPLY} && ! ${REPLY} =~ ^Y|y ]]; then 
            echo ".... skipped"; 
          else
            git remote set-url ${name} ${newurl} && echo ".... updated";
          fi
        else 
          log "..This script only knows how to fix remote connection uri's that use http(s)" 
        fi
      fi
    else 
      log "..found fetchline='${fetchline}' for name='${name}'"
      log "..but failed to parse remoteurl using fetchpattern='${fetchpattern}'"
    fi
  done
  # leave the project folder
  cd ${CWD}
}

if [[ -d ./.git ]]; then
  fixgit "."
else
  echo "This does not appear to be a valid git project. Nothing to do here."
  read -p "However. Do you want to fix all projects found under ${HOME} in stead? [Y/n] " -r
  if [[ ! -z ${REPLY} && ! ${REPLY} =~ ^Y|y ]]; then exit; fi
  #else
  for foundgit in $(find ${HOME} -type d -name .git); do
    fixgit $(dirname ${foundgit})
  done
fi
