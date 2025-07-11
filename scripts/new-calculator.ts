#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';

const slug = process.argv[2];

if (!slug) {
  console.error('❌ Please provide a calculator slug. Example:\n  npm run new:calculator my-calculator');
  process.exit(1);
}

const calculatorName = slug
  .split('-')
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');

const contentDir = path.join('content', 'calculators');
const componentDir = path.join('src', 'components', 'calculators');

async function run() {
  await fs.mkdir(contentDir, { recursive: true });
  await fs.mkdir(componentDir, { recursive: true });

  const mdxPath = path.join(contentDir, `${slug}.mdx`);
  const componentPath = path.join(componentDir, `${calculatorName}.tsx`);

  // Create MDX file
  const mdxContent = `---
title: ${calculatorName} Calculator
category: general
tags: [example]
difficulty: easy
audience: learners
---

import ${calculatorName} from '@/components/calculators/${calculatorName}'

<${calculatorName} />

## 🧾 How It Works
:::explain
Explain how this calculator works here.
:::

## 🧠 Learn the Concept
:::learn
Describe the concept behind the calculator here.
:::

## 🎓 Try a Challenge
:::challenge
<Challenge question="What is 1 + 1?" answer="2" />
:::
`;

  // Create component stub
  const componentContent = `export default function ${calculatorName}() {
  return (
    <div className="p-4 border rounded bg-blue-50 my-4">
      <strong>${calculatorName} Calculator</strong>
      <p className="mt-2">TODO: Implement calculator logic here.</p>
    </div>
  );
}
`;

  await fs.writeFile(mdxPath, mdxContent);
  await fs.writeFile(componentPath, componentContent);

  console.log(`✅ Created:`);
  console.log(` - ${mdxPath}`);
  console.log(` - ${componentPath}`);
}

run();
