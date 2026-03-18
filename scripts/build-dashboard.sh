#!/usr/bin/env bash
set -euo pipefail

echo "=== Building root project ==="
npm run build

echo "=== Installing dashboard dependencies ==="
cd dashboard
npm install

echo "=== Building dashboard frontend ==="
npx vite build

echo "=== Building dashboard server ==="
npx tsc -p tsconfig.server.json

echo "=== Done ==="
echo "Run: node dist/cli.js dashboard"
