#!/bin/bash

set -e

echo "🌍 Setting up i18n support for: en, it, es, fr"

# Define supported locales
locales=("en" "it" "es" "fr")

# Create message JSON files
for locale in "${locales[@]}"; do
  echo "🗂️ Creating messages/$locale.json"

  mkdir -p src/messages

  cat <<EOF > "src/messages/$locale.json"
{
  "bmi": {
    "title": "BMI Calculator",
    "description": "Enter your height and weight to calculate your Body Mass Index.",
    "weight": "Weight",
    "height": "Height",
    "calculate": "Calculate BMI",
    "result": "Your BMI is"
  },
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
}
EOF
done

# Create folder structure under src/app for each locale
for locale in "${locales[@]}"; do
  echo "📁 Setting up app router for /$locale"

  mkdir -p src/app/$locale/calculators
  touch src/app/$locale/page.tsx

  cat <<EOF > src/app/$locale/page.tsx
export default function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to SocalSolver ($locale)</h1>
      <p>Select a calculator from the menu.</p>
    </div>
  );
}
EOF
done

echo "✅ All locales and routes scaffolded."
