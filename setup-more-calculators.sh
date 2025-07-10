#!/bin/bash

set -e

LOCALE="en"
BASE_PATH="src/app/$LOCALE/calculators"
TRANSLATIONS_PATH="src/messages/en.json"

mkdir -p "$BASE_PATH/mortgage"
mkdir -p "$BASE_PATH/compound-interest"

echo "📄 Creating Mortgage Calculator..."
cat <<EOF > $BASE_PATH/mortgage/page.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import '@/styles/calculators.css';

export default function MortgageCalculator() {
  const t = useTranslations();
  const [loan, setLoan] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [monthly, setMonthly] = useState<number | null>(null);

  const calculate = () => {
    const P = parseFloat(loan);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (!isNaN(P) && !isNaN(r) && !isNaN(n) && r > 0 && n > 0) {
      const payment = (P * r) / (1 - Math.pow(1 + r, -n));
      setMonthly(parseFloat(payment.toFixed(2)));
    } else {
      setMonthly(null);
    }
  };

  return (
    <div className="wrapper">
      <header className="header">
        <h1>{t('mortgage.title')}</h1>
      </header>

      <main className="main">
        <div className="intro">
          <p>{t('mortgage.description')}</p>
        </div>

        <div className="card">
          <label>
            {t('mortgage.loan')}
            <input type="number" value={loan} onChange={(e) => setLoan(e.target.value)} />
          </label>
          <label>
            {t('mortgage.rate')}
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
          </label>
          <label>
            {t('mortgage.years')}
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
          </label>
          <button onClick={calculate}>{t('mortgage.calculate')}</button>
          {monthly !== null && <p>{t('mortgage.result')}: {monthly}</p>}
        </div>
      </main>
    </div>
  );
}
EOF

echo "📄 Creating Compound Interest Calculator..."
cat <<EOF > $BASE_PATH/compound-interest/page.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import '@/styles/calculators.css';

export default function CompoundInterestCalculator() {
  const t = useTranslations();
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);

    if (!isNaN(P) && !isNaN(r) && !isNaN(t) && t > 0) {
      const A = P * Math.pow(1 + r, t);
      setResult(parseFloat(A.toFixed(2)));
    } else {
      setResult(null);
    }
  };

  return (
    <div className="wrapper">
      <header className="header">
        <h1>{t('compound.title')}</h1>
      </header>

      <main className="main">
        <div className="intro">
          <p>{t('compound.description')}</p>
        </div>

        <div className="card">
          <label>
            {t('compound.principal')}
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </label>
          <label>
            {t('compound.rate')}
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
          </label>
          <label>
            {t('compound.years')}
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
          </label>
          <button onClick={calculate}>{t('compound.calculate')}</button>
          {result !== null && <p>{t('compound.result')}: {result}</p>}
        </div>
      </main>
    </div>
  );
}
EOF

echo "🗂️ Appending translations..."
cat <<EOF >> $TRANSLATIONS_PATH
,
"mortgage": {
  "title": "Mortgage Calculator",
  "description": "Calculate your monthly mortgage payment.",
  "loan": "Loan Amount",
  "rate": "Interest Rate (%)",
  "years": "Loan Term (Years)",
  "calculate": "Calculate",
  "result": "Monthly Payment"
},
"compound": {
  "title": "Compound Interest Calculator",
  "description": "Calculate future value with compound interest.",
  "principal": "Initial Investment",
  "rate": "Annual Interest Rate (%)",
  "years": "Investment Duration (Years)",
  "calculate": "Calculate",
  "result": "Future Value"
}
EOF

echo "✅ Calculators created:"
echo " - /en/calculators/mortgage"
echo " - /en/calculators/compound-interest"
