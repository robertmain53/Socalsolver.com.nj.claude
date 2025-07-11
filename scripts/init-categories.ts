// scripts/init-categories.ts
import fs from 'fs/promises';
import path from 'path';

const hierarchy = {
  Finance: {
    "Loans & Mortgages": [
      "Mortgage Payment",
      "Mortgage Refinance",
      "Loan Affordability",
      "Loan Amortization",
      "Personal Loan",
      "Car Loan",
      "Student Loan"
    ],
    "Investment & Savings": [
      "Compound Interest",
      "Simple Interest",
      "Return on Investment (ROI)",
      "Savings Goal",
      "Retirement Planning",
      "Stock Calculators",
      "Mutual Fund/ETF Returns",
      "Cryptocurrency"
    ]
    // (you can add the rest from your full list here)
  },
  Mathematics: {
    "Basic Arithmetic": ["Addition", "Subtraction"]
  }
};

async function main() {
  const dir = path.join(process.cwd(), 'content', 'categories');
  await fs.mkdir(dir, { recursive: true });

  for (const [category, subcats] of Object.entries(hierarchy)) {
    const categoryPath = path.join(dir, `${slugify(category)}.json`);
    const data = {
      title: category,
      description: '',
      faqs: [],
      seo: {},
      schema: {},
      subcategories: Object.entries(subcats).map(([name, subsub]) => ({
        slug: slugify(name),
        title: name,
        subsubcategories: subsub.map(s => ({ slug: slugify(s), title: s }))
      }))
    };
    await fs.writeFile(categoryPath, JSON.stringify(data, null, 2));
  }
  console.log('✅ Categories generated.');
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

main();
