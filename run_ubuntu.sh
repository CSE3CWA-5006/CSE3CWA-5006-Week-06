#!/usr/bin/env bash
# Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
# Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.

set -euo pipefail

if ! command -v sudo >/dev/null 2>&1; then
  echo "ERROR: sudo is required on Ubuntu."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is required. Install Node.js 24 from the lab page, then run this script again."
  exit 1
fi

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "${NODE_MAJOR}" -lt 24 ]; then
  echo "ERROR: Node.js 24 or newer is required. Current version: $(node -v)"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm is required and normally comes with Node.js."
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "==> Installing PostgreSQL"
  sudo apt-get update
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-client
fi

echo "==> Starting PostgreSQL"
sudo systemctl enable --now postgresql

DB_NAME="${POSTGRES_DB:-week6_portal}"
DB_USER="${POSTGRES_USER:-week6}"
DB_PASSWORD="${POSTGRES_PASSWORD:-week6}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"

if [ -z "${DATABASE_URL:-}" ] && [ ! -f .env.local ]; then
  echo "==> Preparing local PostgreSQL database: ${DB_NAME}"
  sudo -u postgres psql -d postgres -v ON_ERROR_STOP=1 \
    -v db_user="$DB_USER" -v db_password="$DB_PASSWORD" -v db_name="$DB_NAME" <<'SQL'
DO $do$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_user', :'db_password');
  ELSE
    EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_password');
  END IF;
END
$do$;
SQL

  if ! sudo -u postgres psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"
  else
    sudo -u postgres psql -d postgres -v ON_ERROR_STOP=1 -c "ALTER DATABASE \"${DB_NAME}\" OWNER TO \"${DB_USER}\";"
  fi

  cat > .env.local <<ENV
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
DATABASE_SSL=false
ENV
elif [ -n "${DATABASE_URL:-}" ] && [ ! -f .env.local ]; then
  cat > .env.local <<ENV
DATABASE_URL=${DATABASE_URL}
DATABASE_SSL=${DATABASE_SSL:-false}
ENV
fi

if [ ! -f .env.local ]; then
  echo "ERROR: Missing .env.local. Set DATABASE_URL and run again."
  exit 1
fi

echo "==> Installing Node.js dependencies"
npm install

echo "==> Initialising PostgreSQL schema and teaching seed"
npm run db:setup

echo "==> Verifying database integrity"
npm run db:verify

echo "==> Starting Next.js on http://localhost:3000"
npm run dev
