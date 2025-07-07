#!/bin/bash

# Calculator Platform - Part 1: Development Configuration Setup
# This script creates development configuration files and scripts

echo "⚙️ Setting up development configuration..."

# Create package.json scripts
cat > package.json << 'EOF'
{
  "name": "calculator-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepare": "husky install",
    "content:validate": "node scripts/validate-content.js",
    "content:generate": "node scripts/generate-content.js",
    "lighthouse": "lhci autorun",
    "security": "npm audit && snyk test"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "react-hook-form": "^7.47.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^1.2.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-progress": "^1.0.3",
    "gray-matter": "^4.0.3",
    "remark": "^15.0.1",
    "remark-html": "^16.0.1",
    "next-mdx-remote": "^4.4.1",
    "@next/mdx": "^14.0.0",
    "@types/mdx": "^2.0.9",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.0",
    "prettier": "^3.1.0",
    "@typescript-eslint/eslint-plugin": "^6.12.0",
    "@typescript-eslint/parser": "^6.12.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.1.0",
    "@commitlint/cli": "^18.4.3",
    "@commitlint/config-conventional": "^18.4.3",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@lhci/cli": "^0.12.0",
    "snyk": "^1.1248.0"
  }
}
EOF

# Create environment variables template
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/calculator_platform"

# AI/LLM Configuration
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
GOOGLE_TRANSLATE_API_KEY="your-google-translate-key"

# Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="calculator-platform-assets"

# Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Feature Flags
ENABLE_AI_GENERATION="true"
ENABLE_TRANSLATIONS="true"
ENABLE_ADMIN_PANEL="true"

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE="60"

# Content Configuration
DEFAULT_LOCALE="en"
SUPPORTED_LOCALES="en,es,fr,it"
EOF

# Create .env.local for development
cat > .env.local << 'EOF'
# Development environment variables
NEXT_PUBLIC_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
ENABLE_AI_GENERATION="false"
ENABLE_TRANSLATIONS="false"
ENABLE_ADMIN_PANEL="true"
EOF

# Create ESLint configuration
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": ["node_modules/", ".next/", "out/"]
}
EOF

# Create Prettier configuration
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
EOF

# Create .prettierignore
cat > .prettierignore << 'EOF'
node_modules
.next
.env*
*.md
*.log
public
coverage
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode
.idea

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/
EOF

# Create Husky configuration
mkdir -p .husky
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
EOF

# Create lint-staged configuration
cat > .lintstagedrc.js << 'EOF'
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
  '*.{ts,tsx}': [() => 'tsc --noEmit'],
}
EOF

# Create Commitlint configuration
cat > .commitlintrc.js << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'content',
        'i18n',
        'seo',
      ],
    ],
  },
}
EOF

# Create Jest configuration
cat > jest.config.js << 'EOF'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

module.exports = createJestConfig(customJestConfig)
EOF

# Create Jest setup file
cat > jest.setup.js << 'EOF'
import '@testing-library/jest-dom'
EOF

# Create Lighthouse CI configuration
cat > .lighthouserc.json << 'EOF'
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "startServerCommand": "npm run build && npm run start",
      "startServerReadyPattern": "ready on"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
EOF

# Create basic script for content validation
mkdir -p scripts
cat > scripts/validate-content.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function validateContent() {
  const contentDir = path.join(process.cwd(), 'content/calculators')
  
  if (!fs.existsSync(contentDir)) {
    console.log('✅ Content directory not found - skipping validation')
    return
  }

  const files = fs.readdirSync(contentDir, { recursive: true })
    .filter(file => file.endsWith('.mdx'))

  console.log(`🔍 Validating ${files.length} content files...`)

  let errors = 0
  files.forEach(file => {
    try {
      const filePath = path.join(contentDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      const { data: frontmatter } = matter(content)

      // Basic validation
      if (!frontmatter.title) {
        console.error(`❌ ${file}: Missing title`)
        errors++
      }
      if (!frontmatter.description) {
        console.error(`❌ ${file}: Missing description`)
        errors++
      }
      if (!frontmatter.calculatorId) {
        console.error(`❌ ${file}: Missing calculatorId`)
        errors++
      }
    } catch (error) {
      console.error(`❌ ${file}: Parse error - ${error.message}`)
      errors++
    }
  })

  if (errors === 0) {
    console.log('✅ All content files are valid')
  } else {
    console.error(`❌ Found ${errors} validation errors`)
    process.exit(1)
  }
}

validateContent()
EOF

chmod +x scripts/validate-content.js

# Create README
cat > README.md << 'EOF'
# Calculator Platform

A comprehensive Next.js + Node.js platform for calculators, learning, and AI-assisted content workflows.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
calculator-platform/
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility libraries
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helper functions
├── content/                 # Markdown content files
├── public/                  # Static assets
├── scripts/                 # Build and utility scripts
└── .github/                 # GitHub Actions workflows
```

## 🛠️ Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run test` - Run tests
- `npm run content:validate` - Validate content files

### Code Quality

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for commit message validation
- **Jest** for testing

## 📝 Content Management

Content is managed through markdown files in the `content/` directory. Each calculator has associated educational content in four sections:

1. **Tool** - The calculator component
2. **Explain** - Step-by-step explanations
3. **Learn** - Conceptual learning content
4. **Challenge** - Interactive quizzes

## 🌍 Internationalization

The platform supports multiple languages (en, es, fr, it) with:
- Route-based locale detection
- Content translation workflows
- Localized number formatting

## 🔒 Security

- Input validation with Zod
- Content Security Policy headers
- Regular security audits
- Dependency vulnerability scanning

## 📊 Performance

- Lighthouse CI integration
- Performance budgets
- Core Web Vitals monitoring
- SEO optimization

## 🤖 AI Integration

The platform includes AI-powered content generation for:
- Educational explanations
- Learning materials
- Quiz questions
- Content translations

## 📄 License

MIT License - see LICENSE file for details.
EOF

echo "✅ Development configuration completed successfully"

# Final setup instructions
echo ""
echo "🎉 Calculator Platform setup complete!"
echo ""
echo "Next steps:"
echo "1. cd calculator-platform"
echo "2. npm install"
echo "3. cp .env.example .env.local"
echo "4. npm run dev"
echo ""
echo "The platform will be available at http://localhost:3000"
echo ""
echo "📋 What's been created:"
echo "✅ Next.js project with TypeScript"
echo "✅ Comprehensive folder structure"
echo "✅ Core types and utilities"
echo "✅ Basic UI components"
echo "✅ Layout and routing foundation"
echo "✅ Development tooling (ESLint, Prettier, Husky)"
echo "✅ Testing setup (Jest)"
echo "✅ CI/CD foundations"
echo ""
echo "Ready for Part 2: Calculator Engine & Components!"