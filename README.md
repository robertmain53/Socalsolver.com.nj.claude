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
