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

#if os is windows then make a filesystemwatcher for the .dmbon folder
#detect what OS the user is running
OS_USER="$(uname -a)"

#check if hostbrowserpipeline.lnk exists on disk if not create it
#if [ ! -f ~/.dmbon/hostbrowserpipeline ]; then
#    echo "hostbrowserpipeline.lnk does not exist"
#    echo "creating hostbrowserpipeline"
#    mkfifo ~/.dmbon/hostbrowserpipeline
#    #checnge permissions on the file so that it can be read and written to by everyone
#    chmod 777 ~/.dmbon/hostbrowserpipeline
#    #echo "file:///C:/dmbon/hostbrowserpipeline.html" > ~/.dmbon/hostbrowserpipeline.lnk
#fi

#check if the OS is windows
W_USER=false
if [[ $OS_USER == *"MINGW"* ]]; then
    W_USER=true
fi
#check if the OS is mac
M_USER=false
if [[ $OS_USER == *"Darwin"* ]]; then
    M_USER=true
fi
#check if the OS is linux
L_USER=false
if [[ $OS_USER == *"Linux"* ]]; then
    L_USER=true
fi

if [ ! -f ~/.ssh/dmbon ]; then
    #ask user for gh email adress
    echo "Enter the email adress you use for github: "
    echo "============================================="
    read gh_email
    echo "============================================="
    echo " the ssh keygen will be generated with the email adress: $gh_email"
    echo " press continue on all the following prompts"
    echo "============================================="
    #generate ssh key
    ssh-keygen -t ed25519 -f ~/.ssh/dmbon -C "$gh_email"
fi

#check if the ssh key exists in the .ssh folder
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "ssh key does not exist"
    exit 1
fi

#make variable called "DMBON_HOME" and set is to $HOME split /Users
DMBON_HOME="$HOME"
DMBON_HOME="${DMBON_HOME}"
#make the variable so that it ends up being file:///C:/Users/cedric/.dmbon/ with the correct slashes
DMBON_HOME="file://$DMBON_HOME/.dmbon/"
#change /c/ to /C:/
DMBON_HOME="${DMBON_HOME//\/c\//\/C:/}"
echo $DMBON_HOME

#put $DMBON_HOME in .env file
echo "BASE_FILE_URL=$DMBON_HOME" > .env

#make variable that will hold the contents of the ssh key
ssh_prv_key="$(cat ~/.ssh/dmbon)"
ssh_pub_key="$(cat ~/.ssh/dmbon.pub)"
echo $ssh_prv_key
echo $ssh_pub_key

#get the current user GID and UID
#this is needed so that the docker container can write to the hostbrowserpipeline.lnk file
GID_var="$(id -g)"
UID_var="$(id -u)"

#make the app image also bind ~/.dmbon/hostbrowserpipeline.lnk to /root/hostbrowserpipeline.lnk
docker build -t dmbon-assistant-app --build-arg ssh_prv_key="$ssh_prv_key" --build-arg ssh_pub_key="$ssh_pub_key" --build-arg GID_var="$GID_var" --build-arg UID_var="$UID_var" .
docker-compose up -d

#delete  ~/.ssh/dmbon and ~/.ssh/dmbon.pub
rm ~/.ssh/dmbon
rm ~/.ssh/dmbon.pub

#open browser to localhost:8910
#open http://localhost:8910

#constantly poll the hostpipeline.lnk file and see if a new link has been added, if so open that link with the default program
#depending on the OS this will be different
#on windows this will be start <link>
#on mac this will be open <link>
#on linux this will be xdg-open <link>
#have a observer that is constantly watching the state of the .dmbon folder, if a file named toopen.txt is added 
# read the file content and open the link in the default program depending on the os 
while :; do clear; 
    if [ -f ~/.dmbon/toopen.txt ]; then
        URL="$(cat ~/.dmbon/toopen.txt)"
        if $W_USER; then
            start $URL;
        fi
        if $M_USER; then
            open $URL;
        fi
        if $L_USER; then
            xdg-open $URL;
        fi
        rm ~/.dmbon/toopen.txt
    fi; 
sleep 2; 
done

#echo file:///C:/Users/cedricd/Documents/GitHub/mariokart_tournament/package.json into ~/.dmbon/hostbrowserpipeline.lnk
#echo "file:///C:/Users/cedricd/Documents/GitHub/mariokart_tournament/package.json" > ~/.dmbon/toopen.txt