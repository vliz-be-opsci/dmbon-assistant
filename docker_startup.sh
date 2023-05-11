#this startup script will first perform sh ./shell_scripts/make-git-sshkey.sh and then do docker-compose up
cd shell_scripts
sh ./make-git-sshkey.sh
cd ..

#check if the ssh key exists in the .ssh folder
# if not execute the following command to generate the ssh key
#  ssh-keygen -t ed25519 -C "your_email@example.com"
#first ask the user for the email adress they use for github

#if ssh key exists echo "ssh key exists" and continue
if [ -f ~/.ssh/id_ed25519 ]; then
    echo "ssh key exists continuing with docker-compose up"
fi

#check if C:\\dmbon exists on disk if not create it
if [ ! -d ~/.dmbon ]; then
    mkdir ~/.dmbon
fi

if [ ! -f ~/.ssh/id_ed25519 ]; then
    #ask user for gh email adress
    echo "Enter the email adress you use for github: "
    echo "============================================="
    read gh_email
    echo "============================================="
    echo " the ssh keygen will be generated with the email adress: $gh_email"
    echo " press continue on all the following prompts"
    echo "============================================="
    #generate ssh key
    ssh-keygen -t ed25519 -C "$gh_email"
fi

#check if the ssh key exists in the .ssh folder
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "ssh key does not exist"
    exit 1
fi

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