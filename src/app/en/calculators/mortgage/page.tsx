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
