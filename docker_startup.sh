#this startup script will first perform sh ./shell_scripts/make-git-sshkey.sh and then do docker-compose up
cd shell_scripts
sh ./make-git-sshkey.sh
cd ..

#make variable that will hold the contents of the ssh key
ssh_prv_key="$(cat ~/.ssh/id_ed25519)"
ssh_pub_key="$(cat ~/.ssh/id_ed25519.pub)"
echo $ssh_prv_key
echo $ssh_pub_key

#make the app image 
docker build -t dmbon-assistant-app --build-arg ssh_prv_key="$ssh_prv_key" --build-arg ssh_pub_key="$ssh_pub_key" .
docker-compose up -d
#open browser to localhost:8910
#open http://localhost:8910