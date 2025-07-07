#!/bin/bash

# Calculator Platform - Part 1: Core Infrastructure Setup
# This script initializes the Next.js project with TypeScript and core dependencies

echo "🚀 Setting up Calculator Platform - Core Infrastructure"

# Create project directory
mkdir -p calculator-platform
cd calculator-platform

# Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install core dependencies
echo "📦 Installing core dependencies..."
npm install \
  zod \
  @hookform/resolvers \
  react-hook-form \
  lucide-react \
  clsx \
  class-variance-authority \
  @radix-ui/react-tabs \
  @radix-ui/react-select \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-toast \
  @radix-ui/react-accordion \
  @radix-ui/react-progress \
  gray-matter \
  remark \
  remark-html \
  next-mdx-remote \
  @next/mdx \
  @types/mdx

# Install development dependencies
echo "🔧 Installing development dependencies..."
npm install -D \
  @types/node \
  @types/react \
  @types/react-dom \
  eslint \
  eslint-config-next \
  prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional

echo "✅ Core dependencies installed successfully"