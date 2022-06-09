# dmbon-assistant
fast-api version of the rocrate rest api

## for people without docker:
run following commands in terminal of the root project directory:
```
pip install -r app/requirements.txt
sh start-api-server.sh
```

## for people withdocker:
run following commands in terminal of the root project directory:
```
sudo docker-compose up
```

## Updating tags

This repo also has automated versioning and latest release management.
When pushing a change , the user can add the following tags to the commit header to trigger a new release of the repo. (#major , #minor , #patch, #none)
[more info on repo relase tags here](https://github.com/marketplace/actions/github-tag-bump)

When using the #major appendix in the commit header, the repo will push out a release.
By default a push to this repo will result in a new patch tag eg: Vx.x.x+1
