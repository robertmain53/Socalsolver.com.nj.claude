#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

const slug = process.argv[2]
if (!slug) {
  console.error('Usage: npm run new:calculator <slug>')
  process.exit(1)
}

const dir = `content/calculators`
const filepath = path.join(dir, `${slug}.mdx`)

const template = `---
title: ${slug[0].toUpperCase() + slug.slice(1)}
category: general
tags: []
difficulty: easy
audience: learners
---

<CalculatorTest />

## 🧾 How It Works

Explain the logic.

## 🧠 Learn

Theory and educational value.

## 🎓 Try a Challenge

<Challenge question="What is 2 + 2?" answer="4" />
`

fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(filepath, template)
console.log(`✅ Created calculator at ${filepath}`)
