#!/bin/bash

set -e

# Phase 7: Testing & Quality Assurance

echo "🧪 Phase 7: Running Tests and Quality Checks..."

# Step 1: Linting
if [ -f "node_modules/.bin/eslint" ]; then
  echo "🔍 Running ESLint..."
  npx eslint . --ext .ts,.tsx || true
else
  echo "⚠️ ESLint not found. Skipping lint."
fi

# Step 2: Type Checking
if [ -f "tsconfig.json" ]; then
  echo "🧠 Running TypeScript compiler (type check only)..."
  npx tsc --noEmit
else
  echo "⚠️ tsconfig.json not found. Skipping type checks."
fi

# Step 3: Unit Tests
if [ -d "__tests__" ] || [ -f "jest.config.js" ] || [ -f "jest.config.ts" ]; then
  echo "🧬 Running Jest tests..."
  npx jest --passWithNoTests
else
  echo "⚠️ No Jest tests or config found. Skipping tests."
fi

# Step 4: Build Check
echo "🔧 Validating build works without errors..."
npm run build

# Step 5: Markdown & Formatting (optional Prettier)
if [ -f "node_modules/.bin/prettier" ]; then
  echo "🧹 Running Prettier for formatting check..."
  npx prettier --check .
else
  echo "⚠️ Prettier not installed. Skipping formatting check."
fi

# Summary
echo "✅ Phase 7 complete: QA scripts executed. Review logs above."
