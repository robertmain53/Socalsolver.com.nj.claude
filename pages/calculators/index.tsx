import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calculator, Heart, TrendingUp, Search } from 'lucide-react';

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const calculators = [
  { id: 'bmi', name: 'BMI Calculator', description: 'Calculate Body Mass Index', icon: Heart, color: 'text-pink-500' },
  { id: 'mortgage', name: 'Mortgage Calculator', description: 'Calculate mortgage payments', icon: Calculator, color: 'text-blue-500' },
  { id: 'compound-interest', name: 'Compound Interest', description: 'Calculate investment growth', icon: TrendingUp, color: 'text-green-500' },
];

export default function CalculatorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCalculators = calculators.filter(calc =>
    calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Professional Calculators - SocalSolver</title>
        <meta name="description" content="Browse our comprehensive collection of professional calculators." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                  <Calculator className="text-white" size={24} />
                </div>
                <div>
                  <Link href="/">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent cursor-pointer">
                      SocalSolver.com
                    </h1>
                  </Link>
                  <p className="text-sm text-gray-600">Professional Calculator Platform</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/calculators" className="text-orange-600 font-medium">
                  Calculators
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Calculators</h1>
            <p className="text-xl text-gray-600">Choose from our collection of accurate, professional calculators.</p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search calculators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalculators.map((calc) => (
              <Link key={calc.id} href={`/calculators/${calc.id}`}>
                <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
                  <calc.icon className={`${calc.color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors mb-2">
                    {calc.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{calc.description}</p>
                </Card>
              </Link>
            ))}
          </div>

          {filteredCalculators.length === 0 && (
            <div className="text-center py-12">
              <Calculator className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No calculators found</h3>
              <p className="text-gray-500">Try adjusting your search terms.</p>
            </div>
          )}
        </main>

        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">&copy; 2025 SocalSolver.com. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
