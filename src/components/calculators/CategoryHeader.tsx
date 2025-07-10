interface Calculator {
 featured?: boolean;
 trending?: boolean;
}

interface Props {
 category: string;
 calculatorCount: number;
 calculators: Calculator[];
}

export function CategoryHeader({ category, calculatorCount, calculators }: Props) {
 const featuredCount = calculators.filter(calc => calc.featured).length;
 const trendingCount = calculators.filter(calc => calc.trending).length;

 const categoryDescriptions: Record<string, string> = {
 finance: 'Manage your money with confidence using our comprehensive financial calculators. From compound interest to loan payments, make informed decisions about your financial future.',
 health: 'Monitor and improve your health with our accurate health calculators. Calculate BMI, ideal weight, and other important health metrics.',
 math: 'Solve complex mathematical problems with our advanced math calculators. From basic arithmetic to advanced calculus and statistics.',
 science: 'Explore scientific calculations with our precise science calculators. Perfect for students, researchers, and professionals.',
 engineering: 'Professional engineering calculations made simple. Structural, electrical, mechanical, and civil engineering calculators.',
 conversion: 'Convert between different units instantly. Length, weight, temperature, currency, and more conversion tools.',
 };

 return (
 <header className="mb-8">
 <div className="flex items-start justify-between mb-4">
 <div>
 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
 {category} Calculators
 </h1>
 <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
 <span>{calculatorCount} total calculators</span>
 {featuredCount > 0 && (
 <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
 {featuredCount} featured
 </span>
 )}
 {trendingCount > 0 && (
 <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
 {trendingCount} trending
 </span>
 )}
 </div>
 </div>
 </div>
 
 <p className="text-lg text-gray-600 max-w-3xl">
 {categoryDescriptions[category] || `Discover our collection of ${category} calculators designed to help you solve problems quickly and accurately.`}
 </p>
 </header>
 );
}
