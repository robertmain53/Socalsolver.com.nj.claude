#!/bin/bash

# Usage: ./scaffold-calculator.sh test-calculator

SLUG=$1

if [ -z "$SLUG" ]; then
  echo "❌ Please provide a calculator slug. Example: ./scaffold-calculator.sh test-calculator"
  exit 1
fi

MDX_PATH="content/calculators/$SLUG.mdx"
STATUS_PATH="content/status/$SLUG.json"

# Create content/calculators if not exist
mkdir -p content/calculators
mkdir -p content/status

# Scaffold .mdx file if missing
if [ ! -f "$MDX_PATH" ]; then
  cat > "$MDX_PATH" <<EOF
---
title: ${SLUG//-/ } Calculator
category: general
tags: [example]
difficulty: easy
audience: learners
---

<CalculatorExample />

## 🧾 How It Works
:::explain
Explain how this calculator works here.
:::

## 🧠 Learn the Concept
:::learn
Add background theory or concept here.
:::

## 🎓 Try a Challenge
:::challenge
{ "question": "What does it compute?", "answer": "It calculates something." }
:::
EOF
  echo "✅ Created $MDX_PATH"
else
  echo "⚠️  $MDX_PATH already exists"
fi

# Scaffold status.json if missing
if [ ! -f "$STATUS_PATH" ]; then
  cat > "$STATUS_PATH" <<EOF
{
  "status": "draft",
  "editorNotes": ""
}
EOF
  echo "✅ Created $STATUS_PATH"
else
  echo "⚠️  $STATUS_PATH already exists"
fi
