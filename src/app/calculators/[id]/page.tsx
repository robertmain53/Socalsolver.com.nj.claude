import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCalculatorConfig, getAllCalculators } from '@/lib/calculator/registry';
import { MetadataGenerator, StructuredDataGenerator } from '@/lib/seo';
import { CalculatorEngine } from '@/components/calculators/CalculatorEngine';
import { RelatedCalculators } from '@/components/calculators/RelatedCalculators';
import { CalculatorBreadcrumbs } from '@/components/calculators/CalculatorBreadcrumbs';
import { CalculatorExplanation } from '@/components/calculators/CalculatorExplanation';
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ';

interface Props {
 params: { id: string };
}

export async function generateStaticParams() {
 const calculators = getAllCalculators();
 return calculators.map((calc) => ({
 id: calc.id,
 }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const calculator = getCalculatorConfig(params.id);
 
 if (!calculator) {
 return {
 title: 'Calculator Not Found',
 description: 'The requested calculator could not be found.',
 };
 }

 return MetadataGenerator.generateCalculatorMetadata(calculator);
}

export default function CalculatorPage({ params }: Props) {
 const calculator = getCalculatorConfig(params.id);
 
 if (!calculator) {
 notFound();
 }

 const allCalculators = getAllCalculators();
 const relatedCalculators = allCalculators
 .filter(calc => 
 calc.id !== calculator.id && 
 (calc.category === calculator.category || 
 calc.tags?.some(tag => calculator.tags?.includes(tag)))
 )
 .slice(0, 4);

 const structuredData = StructuredDataGenerator.generateCalculatorStructuredData(calculator);

 return (
 <>
 {/* Structured Data */}
 {structuredData.map((data, index) => (
 <script
 key={index}
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify(data),
 }}
 />
 ))}

 <div className="min-h-screen bg-gray-50">
 <div className="container mx-auto px-4 py-8">
 {/* Breadcrumbs */}
 <CalculatorBreadcrumbs calculator={calculator} />

 {/* Header */}
 <header className="mb-8">
 <div className="flex items-start justify-between mb-4">
 <div>
 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
 {calculator.title}
 </h1>
 {calculator.featured && (
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
 Featured Calculator
 </span>
 )}
 {calculator.trending && (
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
 Trending
 </span>
 )}
 </div>
 
 <div className="text-right text-sm text-gray-500">
 <div>Category: {calculator.seo.category}</div>
 <div>Difficulty: {calculator.seo.difficulty}</div>
 <div>Updated: {new Date(calculator.lastUpdated).toLocaleDateString()}</div>
 </div>
 </div>
 
 <p className="text-lg text-gray-600 max-w-3xl">
 {calculator.seo.description || calculator.description}
 </p>

 {/* Tags */}
 {calculator.tags && calculator.tags.length > 0 && (
 <div className="flex flex-wrap gap-2 mt-4">
 {calculator.tags.map((tag) => (
 <span
 key={tag}
 className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
 >
 #{tag}
 </span>
 ))}
 </div>
 )}
 </header>

 {/* Calculator Engine */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
 <div className="lg:col-span-2">
 <CalculatorEngine config={calculator} />
 </div>
 
 {/* Sidebar */}
 <div className="space-y-6">
 {calculator.explanations && (
 <CalculatorExplanation explanations={calculator.explanations} />
 )}
 
 <RelatedCalculators 
 calculators={relatedCalculators}
 currentCalculatorId={calculator.id}
 />
 </div>
 </div>

 {/* FAQ Section */}
 {calculator.explanations && (
 <CalculatorFAQ 
 calculator={calculator}
 explanations={calculator.explanations}
 />
 )}

 {/* SEO Content */}
 <section className="mt-12 prose prose-lg max-w-none">
 <h2>About the {calculator.title}</h2>
 <p>
 Our {calculator.title.toLowerCase()} provides accurate, instant calculations 
 for {calculator.seo.useCase.join(', ')}. This free online tool is designed 
 to help you make informed decisions with reliable results.
 </p>
 
 <h3>Key Features</h3>
 <ul>
 <li>Instant, accurate calculations</li>
 <li>Step-by-step explanations</li>
 <li>Mobile-friendly responsive design</li>
 <li>No registration or downloads required</li>
 <li>Completely free to use</li>
 </ul>

 <h3>Use Cases</h3>
 <p>
 This calculator is perfect for {calculator.seo.useCase.join(', ')}, 
 and related {calculator.seo.category} calculations.
 </p>

 <h3>Related Topics</h3>
 <p>
 Learn more about {calculator.seo.relatedTopics.join(', ')} to enhance 
 your understanding of {calculator.seo.category} calculations.
 </p>
 </section>
 </div>
 </div>
 </>
 );
}
