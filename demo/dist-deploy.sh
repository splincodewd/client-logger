#!/bin/bash

echo 'Deploy dist run...'

# config
echo 'Configuration...'
git config --global user.email "omaxphp@yandex.ru"
git config --global user.name "Travis CI"

# deploy github pages
echo 'Github dist publishing...'
npm run prepublishOnly
cd lib
git init
GIT_TRACE=1 git add .
GIT_TRACE=1 git commit -m "Deploy to dist"
GIT_TRACE=1 git push --force "https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}-dist.git"
