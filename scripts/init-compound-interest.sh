#!/bin/bash

# Create content directories
mkdir -p content/configs
mkdir -p content/calculators
mkdir -p content/status

# Create config JSON
cat <<EOF > content/configs/compound-interest.json
{
  "title": "Compound Interest Calculator",
  "category": "finance",
  "tags": ["interest", "investment", "time value of money"],
  "difficulty": "medium",
  "audience": "learners",
  "explainPrompt": "Explain this formula to a college-level learner. Break down each variable. Give 1 example with real values and a pitfall to avoid.",
  "learnPrompt": "Why does this concept matter? What’s the real-world context? What are common misunderstandings?",
  "challengePrompt": "Create a question that modifies the formula or compares two scenarios. Then write the answer with guidance.",
  "styleGuide": "Friendly, Socratic, crisp"
}
EOF

# Create empty content draft (to be filled by AI)
cat <<EOF > content/calculators/compound-interest.mdx
---
title: Compound Interest Calculator
category: finance
tags: [interest, investment, time]
difficulty: medium
audience: learners
---

<CalculatorCompoundInterest />

## 🧾 How It Works
:::explain
<!-- auto-generated explanation goes here -->
:::

## 🧠 Learn the Concept
:::learn
<!-- auto-generated learning section goes here -->
:::

## 🎓 Try a Challenge
:::challenge
{
  "question": "What happens if it's compounded weekly?",
  "answer": "You would use n = 52 and recalculate."
}
:::
EOF

echo "✅ Sample config and content initialized."
