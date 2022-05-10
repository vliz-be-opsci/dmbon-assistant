#! /bin/sh

Rem first see if node is installed on the users system

npm make install
export NODE_OPTIONS=--openssl-legacy-provider
npm run start
