#!/bin/bash

echo 'Deploy gh-pages run...'

# config
echo 'Configuration...'
git config --global user.email "omaxphp@yandex.ru"
git config --global user.name "Travis CI"

# deploy github pages
echo 'Github pages publishing...'
cd demo && cd dist
git init
GIT_TRACE=1 git add .
GIT_TRACE=1 git commit -m "Deploy to Github Pages"
GIT_TRACE=1 git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git" master:gh-pages > /dev/null 2>&1
