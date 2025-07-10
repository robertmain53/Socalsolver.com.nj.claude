#!/bin/bash

set -e

mkdir -p src/messages

echo "🌍 Creating translated i18n files..."

# 🇮🇹 Italian
cat <<EOF > src/messages/it.json
{
  "bmi": {
    "title": "Calcolatore BMI",
    "description": "Inserisci altezza e peso per calcolare il tuo indice di massa corporea.",
    "weight": "Peso",
    "height": "Altezza",
    "calculate": "Calcola BMI",
    "result": "Il tuo BMI è"
  },
  "mortgage": {
    "title": "Calcolatore Mutuo",
    "description": "Calcola la tua rata mensile del mutuo.",
    "loan": "Importo del prestito",
    "rate": "Tasso di interesse (%)",
    "years": "Durata del prestito (anni)",
    "calculate": "Calcola",
    "result": "Rata mensile"
  },
  "compound": {
    "title": "Interesse Composto",
    "description": "Calcola il valore futuro con interesse composto.",
    "principal": "Investimento iniziale",
    "rate": "Tasso di interesse annuo (%)",
    "years": "Durata dell'investimento (anni)",
    "calculate": "Calcola",
    "result": "Valore futuro"
  }
}
EOF

# 🇪🇸 Spanish
cat <<EOF > src/messages/es.json
{
  "bmi": {
    "title": "Calculadora de IMC",
    "description": "Introduce tu altura y peso para calcular tu índice de masa corporal.",
    "weight": "Peso",
    "height": "Altura",
    "calculate": "Calcular IMC",
    "result": "Tu IMC es"
  },
  "mortgage": {
    "title": "Calculadora de Hipoteca",
    "description": "Calcula tu pago mensual de hipoteca.",
    "loan": "Monto del préstamo",
    "rate": "Tasa de interés (%)",
    "years": "Plazo del préstamo (años)",
    "calculate": "Calcular",
    "result": "Pago mensual"
  },
  "compound": {
    "title": "Interés Compuesto",
    "description": "Calcula el valor futuro con interés compuesto.",
    "principal": "Inversión inicial",
    "rate": "Tasa de interés anual (%)",
    "years": "Duración de la inversión (años)",
    "calculate": "Calcular",
    "result": "Valor futuro"
  }
}
EOF

# 🇫🇷 French
cat <<EOF > src/messages/fr.json
{
  "bmi": {
    "title": "Calculateur IMC",
    "description": "Entrez votre taille et votre poids pour calculer votre indice de masse corporelle.",
    "weight": "Poids",
    "height": "Taille",
    "calculate": "Calculer l'IMC",
    "result": "Votre IMC est"
  },
  "mortgage": {
    "title": "Calculateur d'Hypothèque",
    "description": "Calculez votre paiement hypothécaire mensuel.",
    "loan": "Montant du prêt",
    "rate": "Taux d'intérêt (%)",
    "years": "Durée du prêt (années)",
    "calculate": "Calculer",
    "result": "Paiement mensuel"
  },
  "compound": {
    "title": "Intérêt Composé",
    "description": "Calculez la valeur future avec intérêt composé.",
    "principal": "Investissement initial",
    "rate": "Taux d'intérêt annuel (%)",
    "years": "Durée de l'investissement (années)",
    "calculate": "Calculer",
    "result": "Valeur future"
  }
}
EOF

echo "✅ Translations created: it.json, es.json, fr.json"
