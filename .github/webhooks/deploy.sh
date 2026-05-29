#!/bin/sh

# Always deploy the current state of origin/master.
# Called automatically by the GitHub webhook on push to master,
# or manually on the server (no arguments).

set -e

SCRIPT_PATH=$(realpath "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
PROJECT_ROOT="$SCRIPT_DIR/../.."
PM2_CONFIG="$PROJECT_ROOT/.github/webhooks/ecosystem.config.cjs"

cd "$PROJECT_ROOT"

# Sync working tree to the latest master, discarding local changes
git fetch --prune origin
git checkout master
git reset --hard origin/master

# Build
export TZ=UTC
npm ci
npm run build

# (Re)start the Nuxt server under pm2 — reload is zero-downtime if already running
pm2 reload "$PM2_CONFIG" --update-env || pm2 start "$PM2_CONFIG"
pm2 save
