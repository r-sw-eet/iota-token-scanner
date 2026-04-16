#!/usr/bin/env bash
set -euo pipefail

# Serialize concurrent deploys so two CI runs can't race on docker recreate
# (see: mid-recreate container-name collisions producing orphan `<hash>_<name>` containers).
LOCK=/tmp/iota-trade-scanner-deploy.lock
exec 200>"$LOCK"
flock 200

SRC=/opt/iota-trade-scanner-src
COMPOSE_DIR=/opt/iota-trade-scanner

echo "==> Pulling latest source"
cd "$SRC"
git fetch origin
git reset --hard origin/main

echo "==> Building API image"
docker build -t iota-trade-scanner-api:latest ./api

echo "==> Building website image"
docker build -t iota-trade-scanner-website:latest ./website

echo "==> Stopping + removing existing api/website containers"
cd "$COMPOSE_DIR"
docker compose rm -fs api website 2>/dev/null || true
# Defensive: catch mid-recreate renamed orphans from prior failed deploys
# (e.g. "6f1f59bb270d_iota-trade-scanner-api") that compose no longer tracks.
docker ps -aq --filter 'name=iota-trade-scanner-api' | xargs -r docker rm -f 2>/dev/null || true
docker ps -aq --filter 'name=iota-trade-scanner-website' | xargs -r docker rm -f 2>/dev/null || true

echo "==> Starting containers"
docker compose up -d api website

echo "==> Health checks"
sleep 5
curl -fsS http://localhost:3004/api/v1/health > /dev/null && echo "API healthy"
curl -fsS -o /dev/null http://localhost:3000 && echo "Website responding"

echo "==> Deploy complete"
