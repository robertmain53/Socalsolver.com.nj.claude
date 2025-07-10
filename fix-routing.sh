#!/bin/bash

echo "🚨 Removing legacy /pages folder to enforce App Router usage..."
rm -rf pages

echo "✅ Ensuring minimal Home page in src/app/page.tsx..."
mkdir -p src/app
cat > src/app/page.tsx <<EOF
export default function Home() {
  return <main style={{ padding: 32 }}>
    <h1>Welcome to SocalSolver</h1>
    <p>This is the multilingual App Router version (EN, ES, IT, FR).</p>
  </main>
}
EOF

echo "✅ Verifying next.config.js settings..."
if grep -q "appDir: true" next.config.js && grep -q "i18n" next.config.js; then
  echo "✔️ next.config.js is already correctly configured."
else
  echo "❌ ERROR: next.config.js is missing appDir or i18n. Please update it:"
  cat <<EON
module.exports = {
  i18n: {
    locales: ['en', 'es', 'it', 'fr'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  experimental: {
    appDir: true,
  },
};
EON
fi

echo "🧹 Cleaning .next build cache..."
rm -rf .next

echo "✅ Done. You can now run: npm run dev"
