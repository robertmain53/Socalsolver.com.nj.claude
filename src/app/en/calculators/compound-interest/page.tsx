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
