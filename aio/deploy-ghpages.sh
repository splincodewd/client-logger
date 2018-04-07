#!/bin/bash

# config
echo 'GIT CONFIGURATION...'
git config --global user.email "omaxphp@yandex.ru"
git config --global user.name "Travis CI"

# deploy
echo 'DEPLOY...'
cd aio && cd output
git init
git add .
git commit -m "Deploy to Github Pages"
git push --force --quiet "https://${GITHUB_TOKEN}@$github.com/${GITHUB_REPO}.git" master:gh-pages > /dev/null 2>&1
