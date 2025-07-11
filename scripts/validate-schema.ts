import fs from 'fs';
import path from 'path';

const requiredFields = ['reviewed_by', 'audience', 'difficulty'];
const files = fs.readdirSync('content/calculators');

for (const file of files) {
  const text = fs.readFileSync(path.join('content/calculators', file), 'utf-8');
  for (const field of requiredFields) {
    if (!text.includes(`${field}:`)) {
      console.warn(`⚠️  Missing ${field} in ${file}`);
    }
  }
}

console.log('✅ Structured schema check done');
