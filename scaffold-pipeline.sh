#!/bin/bash

echo "📁 Creating /ai/pipeline.ts and dependencies..."
mkdir -p ai content/calculators content/status

cat > ai/pipeline.ts <<EOF
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const openai = new OpenAI();

export async function generateCalculatorContent(slug: string) {
  const configPath = path.join('content/configs', \`\${slug}.json\`);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  async function ai(prompt: string) {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    return res.choices[0].message.content?.trim() ?? '';
  }

  const explain = await ai(config.explainPrompt);
  const learn = await ai(config.learnPrompt);
  const challenge = await ai(config.challengePrompt);

  const mdx = \`---
title: \${config.title}
category: \${config.category}
tags: \${JSON.stringify(config.tags)}
difficulty: \${config.difficulty}
audience: \${config.audience}
slug: \${slug}
---

import Calculator\${slug.replace(/-([a-z])/g, g => g[1].toUpperCase())} from '@/components/calculators/\${slug}'

<Calculator\${slug.replace(/-([a-z])/g, g => g[1].toUpperCase())} />

## 🧾 How It Works
:::explain
\${explain}
:::

## 🧠 Learn the Concept
:::learn
\${learn}
:::

## 🎓 Try a Challenge
:::challenge
\${challenge}
:::
\`;

  const outputPath = path.join('content/calculators', \`\${slug}.mdx\`);
  fs.writeFileSync(outputPath, mdx);
  console.log('✅ Generated:', outputPath);
}
EOF

echo "✅ Done: ai/pipeline.ts created."
