import fs from 'fs/promises';
import path from 'path';
import { improveContentWithAI } from '@/lib/ai/improve';
import { diffLines } from 'diff';

export async function loadDiff(slug: string) {
  const filePath = path.join(process.cwd(), 'content/calculators', `${slug}.mdx`);
  const original = await fs.readFile(filePath, 'utf-8');
const improved = await improveContentWithAI({ slug, content: original });
  const diff = diffLines(original, improved);
  return { original, improved, diff };
}
