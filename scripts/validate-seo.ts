import fs from 'fs';
import path from 'path';

const folder = 'content/calculators';
const files = fs.readdirSync(folder);

for (const file of files) {
  const content = fs.readFileSync(path.join(folder, file), 'utf-8');
  if (!content.includes('title:')) console.warn(`⚠️  Missing title in ${file}`);
  if (!content.includes('description:')) console.warn(`⚠️  Missing description in ${file}`);
  if (!content.includes('author:')) console.warn(`⚠️  Missing author in ${file}`);
}

console.log('✅ SEO validation complete');
