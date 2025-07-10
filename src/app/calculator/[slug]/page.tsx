import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import dynamic from 'next/dynamic';
import { MDXSections } from '@/components/MDXSectionParser';

const CalculatorCompoundInterest = dynamic(() => import('@/components/calculators/CompoundInterest'), { ssr: false });

function Section({ type, children }: { type: string; children: React.ReactNode }) {
  const titles: Record<string, string> = {
    explain: '🧾 How It Works',
    learn: '🧠 Learn the Concept',
    challenge: '🎓 Try a Challenge',
  };
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{titles[type] || 'Section'}</h2>
      <MDXSections content={mdxContent} />

      <div>{children}</div>
    </section>
  );
}

const components = {
  CalculatorCompoundInterest,
  Section,
};

export default async function CalculatorPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const filePath = path.join(process.cwd(), 'content', 'calculators', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return notFound();

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(fileContent);

  const transformedContent = content
    .replace(/:::([a-z]+)\n/g, '<Section type="$1">')
    .replace(/:::/g, '</Section>');

  const { content: mdxContent } = await compileMDX({
    source: transformedContent,
    options: { parseFrontmatter: false },
    components,
  });

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem' }}>
      <h1>{data.title}</h1>
      <div>{mdxContent}</div>
    </main>
  );
}

