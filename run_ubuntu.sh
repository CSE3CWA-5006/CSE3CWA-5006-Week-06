#!/usr/bin/env bash
# Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
# Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.

set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js 20+ and run this script again."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Install npm with Node.js and run this script again."
  exit 1
fi

echo "==> Installing Node.js dependencies"
npm install

if ! command -v psql >/dev/null 2>&1; then
  echo "PostgreSQL client (psql) is required for the database step."
  echo "Install PostgreSQL locally, then run this script again."
  exit 1
fi

DB_NAME="${POSTGRES_DB:-week6_portal}"
DB_USER="${POSTGRES_USER:-week6}"
DB_PASSWORD="${POSTGRES_PASSWORD:-week6}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"

if [ -z "${DATABASE_URL:-}" ] && [ ! -f .env.local ]; then
  if command -v sudo >/dev/null 2>&1 && sudo -u postgres psql -d postgres -tAc "SELECT 1" >/dev/null 2>&1; then
    echo "==> Preparing local PostgreSQL database: ${DB_NAME}"
    sudo -u postgres psql -d postgres -v ON_ERROR_STOP=1 -c \
      "DO \$\$ BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}') THEN
           CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';
         ELSE
           ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';
         END IF;
       END \$\$;"

    if ! sudo -u postgres psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
      sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"
    fi

    cat > .env.local <<ENV
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
DATABASE_SSL=false
ENV
  else
    echo "No .env.local found and automatic PostgreSQL setup is not available."
    echo "Create .env.local yourself, for example:"
    echo "  cp .env.example .env.local"
    echo "  edit .env.local and set DATABASE_URL"
    exit 1
  fi
elif [ -n "${DATABASE_URL:-}" ] && [ ! -f .env.local ]; then
  cat > .env.local <<ENV
DATABASE_URL=${DATABASE_URL}
DATABASE_SSL=${DATABASE_SSL:-false}
ENV
fi

if [ ! -f .env.local ]; then
  echo "Missing .env.local. Set DATABASE_URL and run again."
  exit 1
fi

echo "==> Initialising PostgreSQL schema and seed data"
npm run db:setup

echo "==> Starting Next.js"
npm run dev
