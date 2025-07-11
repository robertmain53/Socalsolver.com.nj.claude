/**
 * scripts/fix-invalid-client-async.ts
 *
 * 📌  Usage
 *   npx ts-node scripts/fix-invalid-client-async.ts
 *
 *  ➡  Scans src/ for files with:
 *    1) "use client"
 *    2) async / await keywords
 *
 *  Prints a report and exits with code 1 if violations exist
 *  (so you can wire it into CI or a Husky pre-commit hook).
 */

import fs from 'fs';
import path from 'path';

const SRC_ROOT = path.join(process.cwd(), 'src');

type Violation = { file: string; lines: string[] };

function walk(dir: string, list: string[] = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full, list);
    else if (/\.(tsx?|jsx?)$/.test(entry)) list.push(full);
  }
  return list;
}

function scanFile(file: string): Violation | null {
  const code = fs.readFileSync(file, 'utf-8');
  if (!code.includes("'use client'") && !code.includes('"use client"')) return null;

  const violatingLines: string[] = [];
  code.split('\n').forEach((line, idx) => {
    if (/\basync\b|\bawait\b/.test(line)) {
      violatingLines.push(`${idx + 1}: ${line.trim()}`);
    }
  });

  return violatingLines.length ? { file, lines: violatingLines } : null;
}

function main() {
  const files = walk(SRC_ROOT);
  const violations: Violation[] = [];

  files.forEach((f) => {
    const v = scanFile(f);
    if (v) violations.push(v);
  });

  if (violations.length) {
    console.error('\n🚫  Invalid async/await usage in Client Components:\n');
    violations.forEach((v) => {
      console.error(`• ${path.relative(process.cwd(), v.file)}`);
      v.lines.slice(0, 5).forEach((l) => console.error(`   ${l}`));
      if (v.lines.length > 5) console.error('   ...');
      console.error('');
    });
    console.error(
      '💡  Move async logic to a Server Component or API route and pass data via props.\n',
    );
    process.exit(1);
  } else {
    console.log('✅  No async/await detected in client components. Great job!');
  }
}

main();
