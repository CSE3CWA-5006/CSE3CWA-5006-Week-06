#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "============================================================"
echo "Project-Ready Express API - Ubuntu run helper"
echo "============================================================"
echo ""
echo "This helper installs npm packages and starts the Express API."
echo "The demo focuses on backend project structure, validation,"
echo "middleware, consistent responses and route protection."
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found. Install Node.js 24 LTS first."
  echo "Example:"
  echo "  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -"
  echo "  sudo apt install -y nodejs"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Check your Node.js installation."
  exit 1
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
else
  echo ".env already exists. It was not overwritten."
fi

echo "Node version: $(node --version)"
echo "npm version:  $(npm --version)"
echo ""
echo "Installing packages if needed..."
npm install
echo ""
echo "Starting Express. Open http://localhost:4000/api/health"
echo "Press Ctrl+C in this terminal to stop the server."
echo ""
npm run dev
