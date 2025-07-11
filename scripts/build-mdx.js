import { bundleMDX }          from 'mdx-bundler';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import slugify from 'slugify';
import matter from 'gray-matter';

// Ensure NODE_ENV for esbuild
process.env.ESBUILD_BINARY_PATH = require.resolve('esbuild/bin/esbuild');

const contentDir = 'content/calculators';
const outDir     = 'generated/calculators';

mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(contentDir)) {
  if (!file.endsWith('.mdx')) continue;
  const slug    = file.replace(/\.mdx$/, '');
  const mdxText = readFileSync(path.join(contentDir, file), 'utf8');
  const { content, data } = matter(mdxText);

  const { code } = await bundleMDX({ source: content });
  writeFileSync(
    path.join(outDir, `${slug}.js`),
    `export const frontmatter = ${JSON.stringify(data)};
     export default function Content() {${code}}
    `
  );
  console.log(`✅ Bundled ${slug}`);
}
