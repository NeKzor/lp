#!/bin/sh

# set STEAM_API_KEY to a secret if it's unset
export STEAM_API_KEY="${STEAM_API_KEY:-$(cat /run/secrets/steam-api-key)}"

/app/backend