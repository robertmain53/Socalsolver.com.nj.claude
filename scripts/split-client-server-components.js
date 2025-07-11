/* eslint-disable no-console */
const fs   = require('fs');
const path = require('path');
const glob = require('glob');

const pages = glob.sync('src/app/**/page.tsx');

pages.forEach((pagePath) => {
  const original = fs.readFileSync(pagePath, 'utf8');

  const isClient   = /['"]use client['"]/.test(original);
  const hasHook    = /\buse(State|Effect|Reducer|Context)\b/.test(original);
  const hasAsync   = /\bawait\b|\basync\s+function\b/.test(original);

  // Only act if the file mixes client hooks with async/await
  if (!(isClient && hasHook && hasAsync)) return;

  console.log(`⚙️  Splitting mixed logic in ${pagePath}`);

  // Extract imports (may be empty)
  const importMatch = original.match(/^(?:import[\s\S]+?;[\r\n]+)/);
  const imports = importMatch ? importMatch[0] : '';

  // Remove imports & possible 'use client'
  const body = original
    .replace(imports, '')
    .replace(/['"]use client['"];?\s*/, '')
    .trimStart();

  // Paths
  const dir         = path.dirname(pagePath);
  const clientFile  = path.join(dir, 'ClientComponent.tsx');

  // Write new Server Component
  const serverCode = `import ClientComponent from './ClientComponent';

export default async function PageWrapper() {
  // TODO: move any top-level async data fetching here
  return <ClientComponent />;
}
`;
  fs.writeFileSync(pagePath, serverCode);

  // Write new Client Component
  const clientCode = `'use client';
${imports}
${body}
`;
  fs.writeFileSync(clientFile, clientCode);

  console.log(`✅  Created ${path.relative(process.cwd(), clientFile)}`);
});

console.log('🎉  Split complete. Review TODO comments and move data-fetching into server wrapper.');
