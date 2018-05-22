#!/bin/bash

echo 'Deploy stackblitz...'

# config
echo 'Configuration...'
git config --global user.email "omaxphp@yandex.ru"
git config --global user.name "Travis CI"

# deploy stackblitz pages
cd demo
git init
GIT_TRACE=1 git add .
GIT_TRACE=1 git commit -m "Deploy to stackblitz"
GIT_TRACE=1 git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git" master:stackblitz > /dev/null 2>&1