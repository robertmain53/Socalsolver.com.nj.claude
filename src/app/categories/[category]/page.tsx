import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCalculatorsByCategory, getCategories } from '@/lib/calculator/registry';
import { CalculatorGrid } from '@/components/calculators/CalculatorGrid';
import { CategoryHeader } from '@/components/calculators/CategoryHeader';
import { CategoryBreadcrumbs } from '@/components/calculators/CategoryBreadcrumbs';

interface Props {
 params: { category: string };
}

export async function generateStaticParams() {
 const categories = getCategories();
 return categories.map((category) => ({
 category: category.toLowerCase(),
 }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const category = params.category;
 const calculators = getCalculatorsByCategory(category);
 
 if (calculators.length === 0) {
 return {
 title: 'Category Not Found',
 description: 'The requested calculator category could not be found.',
 };
 }

 const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
 const calculatorCount = calculators.length;
 
 const title = `${categoryTitle} Calculators - ${calculatorCount} Free Online Tools`;
 const description = `Explore ${calculatorCount} free ${category.toLowerCase()} calculators. Accurate, instant results with step-by-step explanations for all your ${category.toLowerCase()} calculations.`;
 
 return {
 title,
 description,
 keywords: `${category} calculator, ${category} tools, online ${category}, free calculator`,
 };
}

export default function CategoryPage({ params }: Props) {
 const category = params.category;
 const calculators = getCalculatorsByCategory(category);
 
 if (calculators.length === 0) {
 notFound();
 }

 // Sort calculators by featured first, then trending, then alphabetical
 const sortedCalculators = [...calculators].sort((a, b) => {
 if (a.featured && !b.featured) return -1;
 if (!a.featured && b.featured) return 1;
 if (a.trending && !b.trending) return -1;
 if (!a.trending && b.trending) return 1;
 return a.title.localeCompare(b.title);
 });

 return (
 <div className="min-h-screen bg-gray-50">
 <div className="container mx-auto px-4 py-8">
 {/* Breadcrumbs */}
 <CategoryBreadcrumbs category={category} />

 {/* Category Header */}
 <CategoryHeader 
 category={category}
 calculatorCount={calculators.length}
 calculators={calculators}
 />

 {/* Calculator Grid */}
 <CalculatorGrid calculators={sortedCalculators} />

 {/* SEO Content */}
 <section className="mt-12 prose prose-lg max-w-none">
 <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Calculator Collection</h2>
 <p>
 Explore our comprehensive collection of {calculators.length} free {category} calculators. 
 Each tool is designed to provide accurate, instant results for your {category} calculations. 
 Our calculators are completely free to use and require no registration or downloads.
 </p>
 
 <h3>Popular {category.charAt(0).toUpperCase() + category.slice(1)} Calculators</h3>
 <ul>
 {calculators.slice(0, 5).map(calc => (
 <li key={calc.id}>
 <strong>{calc.title}</strong> - {calc.seo.description || calc.description}
 </li>
 ))}
 </ul>

 <h3>Why Use Our {category.charAt(0).toUpperCase() + category.slice(1)} Calculators?</h3>
 <ul>
 <li>Instant, accurate calculations with no waiting</li>
 <li>Step-by-step explanations for better understanding</li>
 <li>Mobile-friendly responsive design works on all devices</li>
 <li>Completely free with no hidden fees or registration</li>
 <li>Regularly updated with the latest formulas and standards</li>
 </ul>
 </section>
 </div>
 </div>
 );
}
