#!/bin/bash

set -e

echo "🛠️ Creating core content and AI directories..."

mkdir -p content/calculators
mkdir -p content/configs
mkdir -p content/status

echo "📁 Creating authors.json..."
cat <<EOF > content/authors.json
[
  {
    "id": "ava-reed",
    "name": "Dr. Ava Reed",
    "bio": "PhD in Mathematics. 10+ years in educational content creation.",
    "role": "author",
    "photo": "/images/authors/ava-reed.jpg"
  },
  {
    "id": "samir-patel",
    "name": "Samir Patel, CFA",
    "bio": "Finance expert and professional reviewer.",
    "role": "reviewer",
    "photo": "/images/authors/samir-patel.jpg"
  }
]
EOF

echo "🧠 Creating initial content config for compound-interest..."
cat <<EOF > content/configs/compound-interest.json
{
  "title": "Compound Interest Calculator",
  "category": "finance",
  "tags": ["interest", "investment", "compound"],
  "difficulty": "medium",
  "audience": "learners",
  "explainPrompt": "Explain the compound interest formula A = P(1 + r/n)^(nt) to a college-level student.",
  "learnPrompt": "Why is compound interest important in finance? Include a real-world scenario.",
  "challengePrompt": "Create a challenge question that involves modifying the interest rate or compounding frequency and explain the answer.",
  "styleGuide": "Socratic, curious, visual, clear"
}
EOF

echo "📄 Creating placeholder MDX file..."
cat <<EOF > content/calculators/compound-interest.mdx
---
title: "Compound Interest Calculator"
slug: "compound-interest"
author: "ava-reed"
reviewedBy: "samir-patel"
reviewDate: "2025-07-09"
---

import CompoundInterestCalculator from "@/components/calculators/CompoundInterestCalculator"

## Tool

<CompoundInterestCalculator />

:::explain
The formula A = P(1 + r/n)^(nt) lets you calculate the final amount from compound interest.
:::

:::learn
Compound interest grows faster than simple interest because you earn interest on interest.
:::

:::challenge
{
  "question": "What if interest compounds weekly instead of annually?",
  "answer": "You would increase n to 52 and recalculate."
}
:::
EOF

echo "✅ Initial content architecture scaffolded successfully."
