#! /bin/bash

echo "path is $PATH"
which ssh
echo "exit code == $?"
/usr/bin/ssh
echo $?