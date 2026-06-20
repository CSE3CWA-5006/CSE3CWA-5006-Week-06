#!/usr/bin/env bash
set -e

echo "============================================================"
echo "Week 6 Page 3: Next.js Project Portal"
echo "============================================================"
echo
echo "This script installs dependencies and starts the local Next.js server."
echo "The project demonstrates:"
echo "  1. App Router pages"
echo "  2. Server Components"
echo "  3. Client Components"
echo "  4. Server Actions"
echo "  5. Route Handlers that can be tested with Postman or curl"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found. Please install Node.js 20 LTS or newer before running this script."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Please install npm before running this script."
  exit 1
fi

echo "Node version:"
node -v
echo "npm version:"
npm -v
echo

echo "Installing project dependencies. This may take a few minutes the first time."
npm install
echo

echo "Starting the development server on http://localhost:3000"
echo "Open this address in your browser after the server is ready."
echo
echo "Useful test commands in another terminal:"
echo "  curl http://localhost:3000/api/projects"
echo "  curl -X POST http://localhost:3000/api/projects \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"title\":\"Accessibility review\",\"owner\":\"Mina\",\"status\":\"planned\",\"priority\":\"high\"}'"
echo
echo "To stop the server, press Ctrl + C in this terminal."
echo "============================================================"
echo

npm run dev
