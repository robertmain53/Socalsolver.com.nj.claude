#!/bin/bash

set -e

echo "🧼 Removing Tailwind files and config..."

rm -f postcss.config.js tailwind.config.js
find src -name '*.css' -exec sed -i '/@tailwind/d' {} \;

echo "🧹 Cleaning package.json dependencies..."
npm pkg delete dependencies.tailwindcss
npm pkg delete dependencies.autoprefixer
npm pkg delete dependencies.postcss
npm pkg delete devDependencies.tailwindcss
npm pkg delete devDependencies.autoprefixer
npm pkg delete devDependencies.postcss

echo "📁 Restructuring pages to src/app/[locale]..."
mkdir -p src/app/[locale]
LOCALES=("en")

if [ -d pages ]; then
  for locale in "${LOCALES[@]}"; do
    mkdir -p src/app/$locale
    cp -r pages/* src/app/$locale/ 2>/dev/null || true
  done
  rm -rf pages
fi

echo "🧾 Adding minimal global CSS (mobile-first)..."
mkdir -p src/app
cat <<EOF > src/app/global.css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: #f9f9f9;
  color: #333;
  line-height: 1.6;
  padding: 1rem;
}
a {
  color: #0066cc;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
@media (min-width: 768px) {
  body {
    padding: 2rem;
  }
}
EOF

echo "💡 Linking global.css in layout..."
for locale in "${LOCALES[@]}"; do
  mkdir -p src/app/$locale
  cat <<EOF > src/app/$locale/layout.tsx
import './global.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="$locale"><body>{children}</body></html>;
}
EOF
done

echo "🌐 Setting up middleware for i18n..."
cat <<EOF > middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)\$/;
const locales = ['en'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api')
  ) return;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(\`/\${locale}/\`)
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(new URL(\`/\${defaultLocale}\${pathname}\`, request.url));
  }
}
EOF

echo "🌍 Installing next-intl..."
npm install next-intl

echo "🧠 Creating i18n config..."
mkdir -p src/messages
cat <<EOF > src/messages/en.json
{
  "title": "Welcome to SocalSolver!",
  "description": "Your go-to place for professional calculators."
}
EOF

for locale in "${LOCALES[@]}"; do
  cat <<EOF > src/app/$locale/page.tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}
EOF
done

echo "🔧 Updating next.config.js..."
cat <<EOF > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  // i18n is ignored by App Router but required for static export
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  }
};

module.exports = nextConfig;
EOF

echo "✅ Done! You can now run: npm run dev"
