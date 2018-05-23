#!/bin/bash

echo '[DEPLOY_TARGET] = '${DEPLOY_TARGET}''
email="omaxphp@yandex.ru"
target_gp="gh-pages"
repo="${GITHUB_REPO}"
branch="${DEPLOY_TARGET}"

function git_config() {
  echo "[GIT CONFIGURATION] email = $1";
  git config --global user.email "$1"
  git config --global user.name "Travis CI"
}

function git_push() {
  echo "https://${GITHUB_TOKEN}@github.com/$1.git" master:$2
  # initial
  git init
  GIT_TRACE=1 git add .
  GIT_TRACE=1 git commit -m "Deploy to Github"
  GIT_TRACE=1 git push --force --quiet "https://${GITHUB_TOKEN}@github.com/$1.git" master:$2 > /dev/null 2>&1
}

if [ "$DEPLOY_TARGET" = "$target_gp" ]
then
    echo "[STAGE] = $target_gp"
    cd demo && cd dist
fi;

git_config $email
git_push $repo $branch
