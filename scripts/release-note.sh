#!/bin/bash

TAG=$1
PREVIOUS_TAG=$(git tag --sort="-committerdate" | head -n 2 | tail -n 1)

if [ -z "$TAG" ]; then
  echo "No tag provided aborting..."
  exit 1
fi

if [ -z "$(git tag -l "$TAG")" ];then
  echo "Tag $TAG doesn't exist, aborting..."
  exit 1
fi

if [[ "$(git tag -l | wc -l)" -gt 1 ]];then
git log --output=ReleaseNotes.md "$PREVIOUS_TAG".."$TAG" --pretty=format:"(%h) %s --%an%n"
else
git log --output=ReleaseNotes.md  --pretty=format:"(%h) %s --%an%n"
fi

features=$(grep -E "^\([a-z0-9].+\) feat" ReleaseNotes.md)
fixes=$(grep -E "^\([a-z0-9].+\) fix" ReleaseNotes.md)
chores=$(grep -E "^\([a-z0-9].+\) chore" ReleaseNotes.md)
builds=$(grep -E "^\([a-z0-9].+\) build" ReleaseNotes.md)
cis=$(grep -E "^\([a-z0-9].+\) ci" ReleaseNotes.md)
docs=$(grep -E "^\([a-z0-9].+\) docs" ReleaseNotes.md)
perfs=$(grep -E "^\([a-z0-9].+\) perf" ReleaseNotes.md)
refactors=$(grep -E "^\([a-z0-9].+\) refactor" ReleaseNotes.md)
tests=$(grep -E "^\([a-z0-9].+\) test" ReleaseNotes.md)

FINAL_NOTE="
# Release Notes
"

append_note() {
  if [ -n "$1" ]; then
    FINAL_NOTE+="
## $2
$1
"
  fi
}

append_note "$features" "Features"
append_note "$fixes" "Bug Fixes"
append_note "$chores" "Small tasks"
append_note "$builds" "Build system related"
append_note "$cis" "CI related"
append_note "$docs" "Docs related"
append_note "$perfs" "Performance related"
append_note "$refactors" "Refactors"
append_note "$tests" "Tests"

pwd 
echo "$FINAL_NOTE" > ReleaseNotes.md
