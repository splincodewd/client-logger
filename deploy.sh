#!/bin/bash

echo '[DEPLOY_TARGET_REPO_GH_PAGES] = '${DEPLOY_TARGET_REPO_GH_PAGES}''
echo '[DEPLOY_TARGET_REPO_DIST] = '${DEPLOY_TARGET_REPO_DIST}''
pwd && sleep 10
current=`pwd`

email="omaxphp@yandex.ru"
repo="${GITHUB_REPO}"
branch="${DEPLOY_TARGET}"

function git_config() {
  echo "[GIT CONFIGURATION] email = $1";
  git config --global user.email "$1"
  git config --global user.name "Travis CI"
}

function git_init_push() {
  echo "https://${GITHUB_TOKEN}@github.com/$1.git" master:$2
  # initial
  git init
  GIT_TRACE=1 git add .
  GIT_TRACE=1 git commit -m "Deploy to Github"
  GIT_TRACE=1 git push --force --quiet "https://${GITHUB_TOKEN}@github.com/$1.git" master:$2 > /dev/null 2>&1
}


git_config $email

cd $current && cd demo/dist
git_init_push $GITHUB_REPO $DEPLOY_TARGET_REPO_GH_PAGES

cd $current && cd demo/
git_init_push $GITHUB_REPO $DEPLOY_TARGET_REPO_DIST
