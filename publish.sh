[[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo >&2 "Invalid version '$1'"; exit 1; }
git checkout master &&
git pull &&
yarn install &&
yarn build &&
yarn lint &&
git checkout -b bump-$1 &&
yarn bump:version $1 --yes &&
yarn publish:packages &&
git push --set-upstream origin bump-$1
