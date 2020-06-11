#!/bin/bash
#
# this script should be run everytime the master branch is changed
# it will rebuild the site and upload files to github pages.
#
# you can run it with the commit message optionally
#

set -e

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n""]]"

# build public folder
hugo

cd public

# remove duplicates from git-lfs
# all gifs are saved and loaded from an aws-s3 server
rm -rf gifs 

# replace invalid static links to css and js files generated from hugo
# only happens with the freelancer theme for the bootstrap and jquery cdn files links
sed -i 's/src=\"jmpargana.github.iojs/src=\"js/g' index.html
sed -i 's/href=\"jmpargana.github.iocss/href=\"css/g' index.html


msg="rebuilding site $(date)"


# Commit changes.
if [ -n "$*" ]; then
    msg="$"
fi

git commit -m "$msg"


git push origin -u master
