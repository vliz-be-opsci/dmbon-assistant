[![On_Push_Testing](https://github.com/vliz-be-opsci/dmbon-assistant/actions/workflows/buld_test_and_auto_tag_release.yml/badge.svg)](https://github.com/vliz-be-opsci/dmbon-assistant/actions/workflows/buld_test_and_auto_tag_release.yml)

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

The following code coming from the /github/workflow/testing.yml shows how this works:

```  
name: On_Push_Testing

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:

  test_build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Environment
      uses: actions/setup-node@v3
      with:
        node-version: 18.1.0
    - run: npm install
    - run: npm run build
    - name: Bump version and push tag
      uses: anothrNick/github-tag-action@1.36.0
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        WITH_V: true
        DEFAULT_BUMP: patch
    - name: change latest tag
      uses: EndBug/latest-tag@latest
      env:
       GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
       token: ${{ secrets.GITHUB_TOKEN }}
      with:
        # You can change the name of the tag or branch with this input.
        # Default: 'latest'
        ref: 'latest'
        # If a description is provided, the action will use it to create an annotated tag. If none is given, the action will create a lightweight tag.
        # Default: ''
        description: 'latest version of the rocrate-to-html.' 
        # Force-update a branch instead of using a tag.
        # Default: false
        force-branch: false
          
  release-manager:
    needs: test_build 
    name: Check if ready for release
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - run: echo ${{ github.event.repository.name }}
        name: Get latest tag of repo 
      - uses: oprypin/find-latest-tag@v1
        with:
          repository: vliz-be-opsci/${{ github.event.repository.name }}  # The repository to scan. Change the part before the / to name or organisation where repo resides
          releases-only: false  # Set to true if you want to know the tag linked to the latest release
        id: vliz-be-opsci  # The step ID to refer to later.

      - run: echo "${{ github.event.repository.name }} is at version ${{ steps.vliz-be-opsci.outputs.tag }}"
        name: check if latest tag meets maor release requirements
      - uses: actions-ecosystem/action-regex-match@v2
        id: regex-match
        with:
          text: ${{ steps.vliz-be-opsci.outputs.tag }}
          regex: 'v[0-9].0.0'
      - name: Create release
        if: ${{ steps.regex-match.outputs.match != '' }}
        uses: rymndhng/release-on-push-action@master
        with:
          bump_version_scheme: mayor
```
