#!/bin/bash

set -e

LOCALE="en"
APP_PATH="src/app/$LOCALE/calculators/bmi"

echo "📁 Creating BMI calculator page directory..."
mkdir -p "$APP_PATH"

echo "📄 Creating BMI calculator detail page..."
cat <<EOF > $APP_PATH/page.tsx
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
EOF

echo "🗂️ Adding BMI translation entries to messages..."
cat <<EOF >> src/messages/en.json
,
"bmi": {
  "title": "BMI Calculator",
  "description": "Enter your height and weight to calculate your Body Mass Index.",
  "weight": "Weight",
  "height": "Height",
  "calculate": "Calculate BMI",
  "result": "Your BMI is"
}
EOF

echo "✅ BMI calculator ready at /$LOCALE/calculators/bmi"
