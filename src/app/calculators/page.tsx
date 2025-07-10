import { Metadata } from 'next/metadata';
import Link from 'next/link';
import { getAllCalculators, getCategories, getFeaturedCalculators, getTrendingCalculators } from '@/lib/calculator/registry';
import { CalculatorGrid } from '@/components/calculators/CalculatorGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
 title: 'Free Online Calculators - Instant, Accurate Results',
 description: 'Access hundreds of free online calculators for math, finance, health, science, and more. Get instant, accurate results with step-by-step explanations.',
};

export default function CalculatorsPage() {
 const allCalculators = getAllCalculators();
 const categories = getCategories();
 const featuredCalculators = getFeaturedCalculators();
 const trendingCalculators = getTrendingCalculators();

 return (
 <div className="min-h-screen bg-gray-50">
 {/* Hero Section */}
 <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
 <div className="container mx-auto px-4 text-center">
 <h1 className="text-4xl md:text-6xl font-bold mb-6">
 Free Online Calculators
 </h1>
 <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
 Access hundreds of free, accurate calculators for math, finance, health, science, and more. 
 Get instant results with step-by-step explanations.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link href="/search">
 <Button size="lg" variant="secondary" className="flex items-center gap-2">
 🔍 Search Calculators
 </Button>
 </Link>
 <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
 Browse Categories
 </Button>
 </div>
 </div>
 </section>

 <div className="container mx-auto px-4 py-12">
 {/* Quick Stats */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
 <Card>
 <CardContent className="text-center py-6">
 <div className="text-3xl font-bold text-blue-600 mb-2">{allCalculators.length}</div>
 <div className="text-gray-600">Total Calculators</div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="text-center py-6">
 <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
 <div className="text-gray-600">Categories</div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="text-center py-6">
 <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
 <div className="text-gray-600">Free to Use</div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="text-center py-6">
 <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
 <div className="text-gray-600">Available</div>
 </CardContent>
 </Card>
 </div>

 {/* Featured Calculators */}
 {featuredCalculators.length > 0 && (
 <section className="mb-12">
 <div className="flex items-center gap-2 mb-6">
 <span className="text-2xl">⭐</span>
 <h2 className="text-2xl font-bold text-gray-900">Featured Calculators</h2>
 </div>
 <CalculatorGrid calculators={featuredCalculators} showCategory={true} />
 </section>
 )}

 {/* Categories Grid */}
 <section className="mb-12">
 <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {categories.map((category) => {
 const categoryCalculators = allCalculators.filter(calc => calc.category === category);
 const categoryIcons: Record<string, string> = {
 finance: '💰',
 health: '🏥',
 math: '📊',
 science: '🔬',
 engineering: '⚙️',
 conversion: '🔄',
 };

 return (
 <Link key={category} href={`/calculators/category/${category}`}>
 <Card className="hover:shadow-lg transition-shadow cursor-pointer">
 <CardHeader>
 <div className="flex items-center gap-3">
 <span className="text-2xl">{categoryIcons[category] || '🧮'}</span>
 <div>
 <CardTitle className="capitalize hover:text-blue-600 transition-colors">
 {category}
 </CardTitle>
 <p className="text-sm text-gray-600">
 {categoryCalculators.length} calculator{categoryCalculators.length !== 1 ? 's' : ''}
 </p>
 </div>
 </div>
 </CardHeader>
 <CardContent>
 <div className="space-y-1">
 {categoryCalculators.slice(0, 3).map((calc) => (
 <div key={calc.id} className="text-sm text-gray-600 truncate">
 • {calc.title}
 </div>
 ))}
 {categoryCalculators.length > 3 && (
 <div className="text-sm text-blue-600 font-medium">
 +{categoryCalculators.length - 3} more
 </div>
 )}
 </div>
 </CardContent>
 </Card>
 </Link>
 );
 })}
 </div>
 </section>
 </div>
 </div>
 );
}
