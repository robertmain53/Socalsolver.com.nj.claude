#!/bin/bash

# Calculator Platform - Part 3D: SEO Automation & API Routes
# Creates sitemap generation, Open Graph images, robots.txt, and SEO automation

echo "🚀 Building Calculator Platform - Part 3D: SEO Automation & API Routes..."

# Create sitemap.xml route
cat > src/app/sitemap.xml/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import { getAllCalculators, getCategories } from '@/lib/calculator/registry';
import { SitemapGenerator } from '@/lib/seo';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourcalculator.com';
  
  // Get all calculators and categories
  const calculators = getAllCalculators();
  const categories = getCategories();
  
  // Generate sitemap entries
  const staticEntries = SitemapGenerator.generateStaticSitemap(baseUrl);
  const calculatorEntries = SitemapGenerator.generateCalculatorSitemap(calculators, baseUrl);
  const categoryEntries = SitemapGenerator.generateCategorySitemap(categories, baseUrl);
  
  // Combine all entries
  const allEntries = [...staticEntries, ...calculatorEntries, ...categoryEntries];
  
  // Generate XML
  const xmlContent = SitemapGenerator.generateXMLSitemap(allEntries);
  
  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}
EOF

# Create robots.txt route
cat > src/app/robots.txt/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourcalculator.com';
  
  const robotsContent = `User-agent: *
Allow: /

# Specific crawling preferences
Allow: /calculators/
Allow: /calculators/category/
Allow: /search

# Block admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /.*\\.(js|css|map)$

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for respectful crawling
Crawl-delay: 1`;

  return new NextResponse(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}
EOF

# Create Open Graph image generation API
mkdir -p src/app/api/og/calculator/\[id\]

cat > src/app/api/og/calculator/\[id\]/route.tsx << 'EOF'
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getCalculatorConfig } from '@/lib/calculator/registry';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const calculator = getCalculatorConfig(params.id);
    
    if (!calculator) {
      return new Response('Calculator not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 40,
              margin: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              maxWidth: 800,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                fontSize: 40,
                color: 'white',
              }}
            >
              🧮
            </div>
            
            {/* Title */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              {calculator.title}
            </div>
            
            {/* Description */}
            <div
              style={{
                fontSize: 24,
                color: '#6b7280',
                marginBottom: 24,
                lineHeight: 1.4,
                maxWidth: 600,
              }}
            >
              {calculator.seo.description || calculator.description}
            </div>
            
            {/* Category Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 16,
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {calculator.seo.category}
              </div>
              {calculator.featured && (
                <div
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Featured
                </div>
              )}
            </div>
            
            {/* Brand */}
            <div
              style={{
                fontSize: 18,
                color: '#9ca3af',
                fontWeight: 500,
              }}
            >
              Calculator Platform
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('Failed to generate OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
EOF

# Create category OG image generation
mkdir -p src/app/api/og/category/\[category\]

cat > src/app/api/og/category/\[category\]/route.tsx << 'EOF'
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getCalculatorsByCategory } from '@/lib/calculator/registry';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    const calculators = getCalculatorsByCategory(category);
    
    if (calculators.length === 0) {
      return new Response('Category not found', { status: 404 });
    }

    const categoryIcons: Record<string, string> = {
      finance: '💰',
      health: '🏥',
      math: '📊',
      science: '🔬',
      engineering: '⚙️',
      conversion: '🔄',
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 40,
              margin: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              maxWidth: 800,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                fontSize: 50,
              }}
            >
              {categoryIcons[category] || '🧮'}
            </div>
            
            {/* Title */}
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: 16,
                lineHeight: 1.2,
                textTransform: 'capitalize',
              }}
            >
              {category} Calculators
            </div>
            
            {/* Stats */}
            <div
              style={{
                fontSize: 28,
                color: '#6b7280',
                marginBottom: 24,
                lineHeight: 1.4,
              }}
            >
              {calculators.length} Free Online Tools
            </div>
            
            {/* Features */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 20,
                color: '#374151',
                marginBottom: 24,
              }}
            >
              <div>✓ Instant Accurate Results</div>
              <div>✓ Step-by-Step Explanations</div>
              <div>✓ Mobile Friendly Design</div>
            </div>
            
            {/* Brand */}
            <div
              style={{
                fontSize: 18,
                color: '#9ca3af',
                fontWeight: 500,
              }}
            >
              Calculator Platform
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('Failed to generate category OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
EOF

# Create home page OG image
mkdir -p src/app/api/og/home

cat > src/app/api/og/home/route.tsx << 'EOF'
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 60,
              margin: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              maxWidth: 900,
            }}
          >
            {/* Logo */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 32,
                fontSize: 60,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              }}
            >
              🧮
            </div>
            
            {/* Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: 20,
                lineHeight: 1.1,
              }}
            >
              Calculator Platform
            </div>
            
            {/* Subtitle */}
            <div
              style={{
                fontSize: 32,
                color: '#6b7280',
                marginBottom: 32,
                lineHeight: 1.3,
                fontWeight: 500,
              }}
            >
              Free Online Calculators for Every Need
            </div>
            
            {/* Features */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 40,
                fontSize: 18,
                color: '#374151',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>⚡</span>
                <span>Instant Results</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>🎯</span>
                <span>100% Accurate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>
            
            {/* CTA */}
            <div
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '16px 32px',
                borderRadius: 12,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              Explore Calculators →
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('Failed to generate home OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
EOF

# Create JSON-LD structured data API
mkdir -p src/app/api/structured-data/calculator/\[id\]

cat > src/app/api/structured-data/calculator/\[id\]/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { getCalculatorConfig } from '@/lib/calculator/registry';
import { StructuredDataGenerator } from '@/lib/seo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const calculator = getCalculatorConfig(params.id);
    
    if (!calculator) {
      return NextResponse.json({ error: 'Calculator not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourcalculator.com';
    const structuredData = StructuredDataGenerator.generateCalculatorStructuredData(
      calculator,
      baseUrl
    );

    return NextResponse.json(structuredData, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Failed to generate structured data:', error);
    return NextResponse.json(
      { error: 'Failed to generate structured data' },
      { status: 500 }
    );
  }
}
EOF

# Create enhanced main calculators page with better SEO
cat > src/app/calculators/page.tsx << 'EOF'
import { Metadata } from 'next/metadata';
import Link from 'next/link';
import { getAllCalculators, getCategories, getFeaturedCalculators, getTrendingCalculators } from '@/lib/calculator/registry';
import { MetadataGenerator, StructuredDataGenerator } from '@/lib/seo';
import { CalculatorGrid } from '@/components/calculators/CalculatorGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchIcon, TrendingUpIcon, StarIcon } from 'lucide-react';

export const metadata: Metadata = MetadataGenerator.generateHomeMetadata();

export default function CalculatorsPage() {
  const allCalculators = getAllCalculators();
  const categories = getCategories();
  const featuredCalculators = getFeaturedCalculators();
  const trendingCalculators = getTrendingCalculators();
  
  // Get site-level structured data
  const siteStructuredData = StructuredDataGenerator.generateSiteStructuredData();

  return (
    <>
      {/* Site Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteStructuredData),
        }}
      />

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
                  <SearchIcon className="w-5 h-5" />
                  Search Calculators
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
                <StarIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Featured Calculators</h2>
              </div>
              <CalculatorGrid calculators={featuredCalculators} showCategory={true} />
            </section>
          )}

          {/* Trending Calculators */}
          {trendingCalculators.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUpIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Calculators</h2>
              </div>
              <CalculatorGrid calculators={trendingCalculators} showCategory={true} />
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

          {/* SEO Content */}
          <section className="prose prose-lg max-w-none">
            <h2>Why Choose Our Free Online Calculators?</h2>
            <p>
              Our comprehensive collection of free online calculators provides instant, accurate results 
              for all your calculation needs. Whether you're planning your finances, monitoring your health, 
              solving math problems, or working on engineering projects, we have the right tool for you.
            </p>
            
            <h3>Key Features</h3>
            <ul>
              <li><strong>Instant Results:</strong> Get calculations in real-time as you type</li>
              <li><strong>100% Accurate:</strong> All calculators use verified mathematical formulas</li>
              <li><strong>Step-by-Step Explanations:</strong> Understand how calculations work</li>
              <li><strong>Mobile Friendly:</strong> Works perfectly on all devices</li>
              <li><strong>No Registration:</strong> Use all calculators without signing up</li>
              <li><strong>Completely Free:</strong> No hidden fees or premium features</li>
            </ul>

            <h3>Popular Calculator Categories</h3>
            <p>
              Our calculator platform covers a wide range of categories to meet diverse needs:
            </p>
            <ul>
              <li><strong>Finance Calculators:</strong> Compound interest, loan payments, mortgage calculations, and investment planning</li>
              <li><strong>Health Calculators:</strong> BMI, ideal weight, calorie needs, and fitness metrics</li>
              <li><strong>Math Calculators:</strong> Algebra, geometry, statistics, and advanced mathematical functions</li>
              <li><strong>Science Calculators:</strong> Physics formulas, chemistry calculations, and scientific conversions</li>
              <li><strong>Engineering Calculators:</strong> Structural calculations, electrical formulas, and engineering conversions</li>
              <li><strong>Unit Converters:</strong> Length, weight, temperature, currency, and more</li>
            </ul>

            <h3>How to Use Our Calculators</h3>
            <p>
              Using our calculators is simple and intuitive. Just enter your values in the input fields, 
              and our calculators will automatically compute the results. Many calculators also provide 
              explanations and tips to help you understand the calculations better.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
EOF

echo "✅ SEO Automation & API Routes created!"
echo "   📁 src/app/sitemap.xml/"
echo "   ├── route.ts - Dynamic XML sitemap generation"
echo "   📁 src/app/robots.txt/"
echo "   ├── route.ts - SEO-friendly robots.txt"
echo "   📁 src/app/api/og/"
echo "   ├── calculator/[id]/route.tsx - Calculator OG images"
echo "   ├── category/[category]/route.tsx - Category OG images"
echo "   └── home/route.tsx - Homepage OG image"
echo "   📁 src/app/api/structured-data/"
echo "   └── calculator/[id]/route.ts - JSON-LD API"
echo "   📁 src/app/calculators/"
echo "   └── page.tsx - Enhanced homepage with SEO"
echo ""
echo "🎯 Key Features:"
echo "   • Dynamic XML sitemap with proper caching"
echo "   • SEO-optimized robots.txt with crawl directives"
echo "   • Automated Open Graph image generation"
echo "   • JSON-LD structured data API endpoints"
echo "   • Enhanced homepage with comprehensive SEO"
echo "   • Proper caching headers for performance"