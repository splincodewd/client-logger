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

function git_commit_website_files() {
  git checkout -b $1
  git add .
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

function git_push() {
  git remote add origin-pages https://${GITHUB_TOKEN}@github.com/$1.git > /dev/null 2>&1
  git push --quiet --set-upstream origin-pages $2
}

git_config $email

cd $current && cd demo/dist
git_commit_website_files $DEPLOY_TARGET_REPO_GH_PAGES
git_push $GITHUB_REPO $DEPLOY_TARGET_REPO_GH_PAGES

cd $current && cd demo/
git_commit_website_files $GITHUB_REPO
git_init_push $GITHUB_REPO $DEPLOY_TARGET_REPO_DIST
