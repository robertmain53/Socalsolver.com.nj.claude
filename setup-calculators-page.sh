#!/bin/bash

set -e

LOCALE="en"
APP_PATH="src/app/$LOCALE/calculators"
CSS_PATH="src/styles"

echo "📁 Creating calculators directory..."
mkdir -p "$APP_PATH"
mkdir -p "$CSS_PATH"

echo "🎨 Writing pure CSS stylesheet..."
cat <<EOF > $CSS_PATH/calculators.css
.wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
}
.header, .footer {
  text-align: center;
  padding: 1.5rem;
}
.header h1 {
  font-size: 1.75rem;
  color: #333;
  margin: 0.5rem 0;
}
.nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
.main {
  padding: 2rem 0;
}
.intro {
  text-align: center;
}
.searchBox {
  margin: 1.5rem auto;
  max-width: 300px;
  position: relative;
}
.searchBox input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 10px;
  background: #fff;
  transition: all 0.2s ease-in-out;
}
.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card h3 {
  margin: 0.5rem 0;
}
.card p {
  margin: 0;
}
.notFound {
  text-align: center;
  padding: 2rem;
}
@media (min-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
EOF

echo "📄 Creating calculators page..."
cat <<EOF > $APP_PATH/page.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import '@/styles/calculators.css';

type CalculatorItem = {
  id: string;
  name: string;
  description: string;
};

const calculators: CalculatorItem[] = [
  { id: 'bmi', name: 'BMI Calculator', description: 'Calculate Body Mass Index' },
  { id: 'mortgage', name: 'Mortgage Calculator', description: 'Calculate mortgage payments' },
  { id: 'compound-interest', name: 'Compound Interest', description: 'Calculate investment growth' }
];

export default function CalculatorsPage() {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalculators = calculators.filter(calc =>
    calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="wrapper">
      <header className="header">
        <h1>{t('calculators.title')}</h1>
        <div className="nav">
          <Link href="/en">Home</Link>
          <Link href="/en/about">About</Link>
        </div>
      </header>

      <main className="main">
        <div className="intro">
          <p>{t('calculators.description')}</p>
        </div>

        <div className="searchBox">
          <input
            type="text"
            placeholder={t('calculators.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid">
          {filteredCalculators.map(calc => (
            <Link key={calc.id} href={\`/en/calculators/\${calc.id}\`}>
              <div className="card">
                <h3>{calc.name}</h3>
                <p>{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="notFound">
            <h3>{t('calculators.noneFound')}</h3>
            <p>{t('calculators.tryAgain')}</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 SocalSolver.com</p>
      </footer>
    </div>
  );
}
EOF

echo "🗂️ Adding translation messages..."
cat <<EOF >> src/messages/en.json
,
"calculators": {
  "title": "Professional Calculators",
  "description": "Choose from our collection of accurate, professional calculators.",
  "search": "Search calculators...",
  "noneFound": "No calculators found",
  "tryAgain": "Try adjusting your search terms."
}
EOF

echo "✅ Calculators page created at /$LOCALE/calculators"
