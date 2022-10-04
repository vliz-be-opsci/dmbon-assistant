# ssh-git-tools

This project holds a number of scripts to help people quickly setup a git-ssh connetion to a remote repository service like github.com or gitlab.vliz.be

## Usage

Using these helps avoid some of the manual steps and tedious explaining involved with this.

The included scripts are:

* make-git-sshkey.sh
* connect-sshkey.sh
* check-gitssh.sh
* fix-gitssh.sh

### make-git-sshkey.sh

This script will generate a standard named key pair to use for connecting to git services.

While having a separate ssh key to work with git isn't really needed, it is somehwat of a recommended practice, allowing for easier management and possibly even opportunistic key-sharing.

You only need to do this once (per host you want to work from - avoiding to copy your keypairs) 

```
$ make-git-sshkey.sh
```

### connect-sshkey.sh

This script helps you to correctly configure locally and advices you towards how to publicly register the public part of the key at the service of your choice (defaults to github.com)

You will need to do this for every remote service you want to connect to (from this host)

```
$ connect-sshkey.sh
$ connect-sshkey.sh gitlab.vliz.be
```

### check-gitssh.sh

This script checks if the connection is set up correctly (meaning both local config and remote registration) are ok

You can do this as often as needed, but if all went well you might as well skip this extra peace-of-mind alltogether.

```
$ check-gitssh.sh
$ connect-sshkey.sh gitlab.vliz.be
```

### fix-gitssh.sh

Existing remote connnected git repositories might still be using the `https://**` connection url which will require you to login.

With this script you can easily switch your connection to use git-ssh (it will figure out what service it is connected to)

```
$ fix-gitssh.sh
```

Note:
* When executed in a git-project folder: only the current project will be fixed.
* When executed outside such context: the script will offer to fix all git-projects in your ${HOME}


Tip:
If you trust the script to do well, and know what you are doing, you can skip the Y/n dialog interupts by applying a socalled yes-pipe:

```
$ yes | fix-gitssh.sh
```


## Install

To install:

```
$ curl -sL https://gitlab.vliz.be/datac/openscience/ssh-git-tools/-/raw/master/bootstrap | bash
```

Post Install one can find the code in /data/ssh-git-tools
There is an example .env file one can copy and tweak for specific purposes.

```
$ cd /data/ssh-git-tools
$ cp .env.example .env
$ vi .env
```
