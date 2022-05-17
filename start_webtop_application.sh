#! /bin/sh

# open multiple terminals and execute the following commands:
# cd /Users/<username>/webtop/frontend
# sh frontend_run.sh
# cd /Users/<username>/webtop/backend
# sh start-api-server.sh

cd backend/
sh start-api-server.sh & # the & is to run the command in the background
cd ../frontend/
sh frontend_run.sh &