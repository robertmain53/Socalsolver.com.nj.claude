import { notFound } from 'next/navigation';
import { calculators } from '@/lib/calculator-registry';

export const dynamicParams = false; // all pre-rendered

export function generateStaticParams() {
  return Object.keys(calculators).map(slug => ({ slug }));
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const calc = calculators[params.slug];
  if (!calc) return notFound();
  const { component: MDX } = calc;
  return (
    <main className="prose mx-auto p-8">
      <MDX />
    </main>
  );
}
