#!/usr/bin/env bash
# Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
# Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.

set -euo pipefail

say() { printf '\n==> %s\n' "$1"; }
fail() { printf '\nERROR: %s\n' "$1" >&2; exit 1; }

if ! command -v node >/dev/null 2>&1; then
  fail "Node.js is required. Install Node.js 24 LTS from the lab page, then run this script again."
fi

if ! command -v npm >/dev/null 2>&1; then
  fail "npm is required. It is normally installed with Node.js. Reinstall Node.js 24 LTS, then run this script again."
fi

say "Checking Node.js"
NODE_VERSION="$(node -p 'process.versions.node')"
NODE_MAJOR="${NODE_VERSION%%.*}"
if [ "${NODE_MAJOR}" -lt 24 ]; then
  fail "Node.js 24 LTS or newer is required. Found ${NODE_VERSION}. Follow the lab page to install Node.js 24 LTS."
fi
printf 'Node.js: %s\nnpm: %s\n' "$NODE_VERSION" "$(npm -v)"

say "Preparing local PostgreSQL"
if ! command -v psql >/dev/null 2>&1; then
  if ! command -v sudo >/dev/null 2>&1; then
    fail "sudo is required to install PostgreSQL automatically."
  fi
  printf 'PostgreSQL is not installed. Installing PostgreSQL and the client now...\n'
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-client
else
  printf 'PostgreSQL client already installed: %s\n' "$(psql --version)"
fi

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl enable --now postgresql
fi

if command -v pg_isready >/dev/null 2>&1; then
  READY=0
  for _ in $(seq 1 30); do
    if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
      READY=1
      break
    fi
    sleep 1
  done
  if [ "$READY" -ne 1 ]; then
    fail "PostgreSQL did not become ready on localhost:5432."
  fi
fi

DB_NAME="${POSTGRES_DB:-week6_portal}"
DB_USER="${POSTGRES_USER:-week6}"
DB_PASSWORD="${POSTGRES_PASSWORD:-week6}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"

if [ -z "${DATABASE_URL:-}" ] && [ ! -f .env.local ]; then
  if ! sudo -u postgres psql -d postgres -tAc "SELECT 1" >/dev/null 2>&1; then
    fail "The PostgreSQL server is installed but the postgres administrator account is not available."
  fi

  sudo -u postgres psql -d postgres -v ON_ERROR_STOP=1 \
    -v db_user="$DB_USER" -v db_password="$DB_PASSWORD" <<'SQL'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_user', :'db_password');
  ELSE
    EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_password');
  END IF;
END
$$;
SQL

  if ! sudo -u postgres psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
    sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"
  fi

  cat > .env.local <<ENV
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
DATABASE_SSL=false
ENV
  printf 'Local database: %s\n' "$DB_NAME"
else
  if [ -n "${DATABASE_URL:-}" ] && [ ! -f .env.local ]; then
    cat > .env.local <<ENV
DATABASE_URL=${DATABASE_URL}
DATABASE_SSL=${DATABASE_SSL:-false}
ENV
  fi
  printf 'Using existing .env.local / DATABASE_URL configuration.\n'
fi

if [ ! -f .env.local ]; then
  fail "Missing .env.local. The lab startup setup could not create a database connection."
fi

say "Installing project dependencies"
npm install

say "Initialising PostgreSQL schema and teaching data"
npm run db:setup

say "Verifying database integrity"
npm run db:verify

say "Starting Next.js"
printf 'Open http://localhost:3000 in your browser.\n'
npm run dev
