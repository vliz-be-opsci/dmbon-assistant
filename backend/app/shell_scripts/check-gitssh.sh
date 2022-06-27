#! /bin/bash

#common prelude 
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
COMMONS=${SCRIPT_DIR}/common.sh
source ${COMMONS}
# end common prelude

gitserv=${1:-github.com}

case ${gitserv} in
  github\.com)
    successregex="Hi ([a-zA-Z0-9_.-]+)! You've successfully authenticated, but GitHub does not provide shell access."
    ;;
  gitlab\.vliz\.be)
    successregex="Welcome to GitLab, @([a-zA-Z0-9_.-]+)!" 
    ;;
  *)
    fail "this script does not support connecting the service @${gitserv}" 
    ;;
esac

response=$(ssh -T ${gitserv} 2>&1)
log "response=${response}"
log "regex=${successregex}"

if  [[ ${response} =~ ${successregex} ]]; then
  accountname=${BASH_REMATCH[1]}
  echo "Looking Good. Well Done!" 
  echo "Apparently the service @${gitserv} connects you to this account: ${accountname}"
else
  fail "Sorry. The configuration is not done correctly. Try connect-sshkey.sh again." 
fi
