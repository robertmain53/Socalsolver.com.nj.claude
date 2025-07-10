// pages/calculators/index.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calculator, Heart, TrendingUp, Search } from 'lucide-react';
 import styles from '@/styles/calculators.module.css'; // New CSS module

const Card = ({ children, className = "", ...props }) => (
  <div className={`${styles.card} ${className}`} {...props}>
    {children}
  </div>
);

const calculators = [
  { id: 'bmi', name: 'BMI Calculator', description: 'Calculate Body Mass Index', icon: Heart },
  { id: 'mortgage', name: 'Mortgage Calculator', description: 'Calculate mortgage payments', icon: Calculator },
  { id: 'compound-interest', name: 'Compound Interest', description: 'Calculate investment growth', icon: TrendingUp },
];

export default function CalculatorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalculators = calculators.filter(calc =>
    calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Professional Calculators - SocalSolver</title>
        <meta name="description" content="Browse our comprehensive collection of professional calculators." />
      </Head>

      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.logoWrap}>
              <div className={styles.logoIcon}>
                <Calculator size={24} />
              </div>
              <div>
                <Link href="/">
                  <h1 className={styles.brand}>SocalSolver.com</h1>
                </Link>
                <p className={styles.subtitle}>Professional Calculator Platform</p>
              </div>
            </div>

            <nav className={styles.nav}>
              <Link href="/calculators">Calculators</Link>
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.intro}>
            <h1>Professional Calculators</h1>
            <p>Choose from our collection of accurate, professional calculators.</p>
          </div>

          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search calculators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.grid}>
          {filteredCalculators.map((calc) => (
  <Link key={calc.id} href={`/calculators/${calc.id}`}>
    <Card>
      {calc.icon ? (
        <calc.icon className={styles.cardIcon} size={32} />
      ) : (
        <div>⚠ Icon missing</div>
      )}
      <h3>{calc.name}</h3>
      <p>{calc.description}</p>
    </Card>
  </Link>
))}

          </div>

          {filteredCalculators.length === 0 && (
            <div className={styles.notFound}>
              <Calculator size={48} />
              <h3>No calculators found</h3>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </main>

        <footer className={styles.footer}>
          <p>&copy; 2025 SocalSolver.com. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
