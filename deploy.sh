#!/bin/bash

echo '[DEPLOY_TARGET_BRANCH] = '${DEPLOY_TARGET_BRANCH}''
current=`pwd`

email="omaxphp@yandex.ru"

function git_config() {
  echo "[GIT CONFIGURATION] email = $1";
  git config --global user.email "$1"
  git config --global user.name "Travis CI"
}

function git_init_push() {
  git init
  git add .
  git commit -m "Deployed to github [REPO - $1, BRUNCH - $2]"
  git push --force --quiet https://${GITHUB_TOKEN}@github.com/$1.git master:$2
}

git_config $email
git_init_push $GITHUB_REPO $DEPLOY_TARGET_BRANCH
