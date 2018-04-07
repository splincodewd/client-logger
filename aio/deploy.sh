#!/bin/bash

echo 'Deploy run...'

# config
echo 'Configuration...'
#git config --global user.email "omaxphp@yandex.ru"
#git config --global user.name "Travis CI"

# deploy
echo 'Publishing...'
cd aio && cd output
git init
GIT_TRACE=1 git add .
GIT_TRACE=1 git commit -m "Deploy to Github Pages"
GIT_TRACE=1 git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git" master:gh-pages > /dev/null 2>&1
