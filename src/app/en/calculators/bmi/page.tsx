'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import '@/styles/calculators.css';

export default function BMICalculator() {
  const t = useTranslations();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!isNaN(w) && !isNaN(h) && h > 0) {
      const result = w / (h * h);
      setBmi(parseFloat(result.toFixed(2)));
    } else {
      setBmi(null);
    }
  };

  return (
    <div className="wrapper">
      <header className="header">
        <h1>{t('bmi.title')}</h1>
      </header>

      <main className="main">
        <div className="intro">
          <p>{t('bmi.description')}</p>
        </div>

        <div className="card">
          <label>
            {t('bmi.weight')} (kg)
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          </label>
          <label>
            {t('bmi.height')} (cm)
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          </label>
          <button
            onClick={calculateBMI}
            style="padding: 0.5rem 1rem; background-color: #0066cc; color: #fff; border: none; border-radius: 4px; cursor: pointer;"
          >
            {t('bmi.calculate')}
          </button>

          {bmi !== null && (
            <div style="margin-top: 1rem;">
              <strong>{t('bmi.result')}:</strong> {bmi}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
