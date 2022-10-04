function log {           # log(msg) {}
  if [[ ! -z "${VERBOSE}" ]]; then
    echo ${1}
  fi
}

function fail {          # fail(msg, exitcode) {}
  echo "${1} - Exiting!"
  exit ${2:-1}           # exit 1 if no exitcode was passed
}

function checkwhich {    # checkwhich(cmdname, extra_msg) {}
  cmdname=${1}
  msg="Cannot find cmd ${cmdname}. ${2}" 
  cmdpath=$(which $cmdname)
  if [[ "$?" -ne "0" ]]; then
    fail $msg
  fi
}

function assert_folder { # assert_folder(fldr) {}
  fldr=${1}
  log "asserting existance of folder ${fldr}"
  mkdir -p ${fldr}
  if [[ ! -d ${fldr} ]]; then 
    fail "could not create folder ${fldr}"
  fi
  if [[ ! -w ${fldr} ]]; then 
    fail "you don't have write access to folder ${fldr}"
  fi
}

function checkvar {     # checkvar(value, msg) {}
  if [[ -z ${1} ]]; then 
    fail ${2:-Unexpected missing value}
  fi
}

function checkdeps {    # checkdeps() {}
  checkwhich ssh "open-ssl not installed?"
  checkwhich ssh-keygen "open-ssl not installed?"
  checkwhich git        "GIT package not installed?"
  checkwhich hostname
  checkwhich 'grep'
  checkwhich head
  checkwhich 'cat'
  checkvar ${USER%@*}   "cannot read username from env USER"
  assert_folder ${sshfolder}
  log "all dependencies are ok"
}

# main prelude execution for all scripts sourcing this one

ENVS=${SCRIPT_DIR}/.env
source ${ENVS} 2>/dev/null  #ignore warning if this does not exist
log "loaded .env from ${SCRIPT_DIR} if exists" 

export sshfolder="${HOME}/.ssh"
export usrname=${USER%@*}

checkdeps  #check dependencies for this project

# SOME PROPS CAN BE INJECTED FROM .env by UPPERCASE VARIANT -- else defaults are used
export context=${CONTEXT:-$(hostname)}
export keyuser="${KEYUSER:-${usrname}@$(hostname)}"
export keyfile="${KEYFILE:-${sshfolder}/git-${context}-${usrname}}"
export ssh_cfg="${sshfolder}/config"

