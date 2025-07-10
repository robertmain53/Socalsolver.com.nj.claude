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
            <Link key={calc.id} href={`/en/calculators/${calc.id}`}>
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
