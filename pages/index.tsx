import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calculator, TrendingUp, Heart, Globe, Search, Star, Users, Award, ArrowRight } from 'lucide-react';

const Card = ({ children, className = "", gradient = false, ...props }) => (
  <div 
    className={`bg-white rounded-xl shadow-lg border border-gray-100 ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", href, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95";
  
  const variants = {
    primary: `bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg hover:shadow-xl`,
    secondary: `bg-gradient-to-r from-blue-400 to-teal-400 text-white shadow-lg hover:shadow-xl`,
    outline: `border-2 border-orange-400 text-orange-600 hover:bg-orange-50`,
    ghost: `text-gray-600 hover:bg-gray-100`
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const Component = href ? Link : 'button';
  const componentProps = href ? { href } : props;
  
  return (
    <Component 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...componentProps}
    >
      {children}
    </Component>
  );
};

const QuickBMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  
  const calculateBMI = () => {
    if (height && weight) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      let category = '';
      
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
      
      setResult({ bmi: bmi.toFixed(1), category });
    }
  };
  
  return (
    <Card className="p-6" gradient>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Heart className="mr-2 text-pink-500" size={20} />
        Quick BMI Calculator
      </h3>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            placeholder="170"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            placeholder="70"
          />
        </div>
      </div>
      <Button onClick={calculateBMI} className="w-full mb-4">Calculate BMI</Button>
      
      {result && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
          <p className="text-lg font-semibold text-gray-800">
            BMI: <span className="text-blue-600">{result.bmi}</span>
          </p>
          <p className="text-sm text-gray-600">Category: {result.category}</p>
        </div>
      )}
    </Card>
  );
};

export default function HomePage() {
  const popularCalculators = [
    { name: 'BMI Calculator', href: '/calculators/bmi', icon: Heart, color: 'text-pink-500' },
    { name: 'Mortgage Calculator', href: '/calculators/mortgage', icon: Calculator, color: 'text-blue-500' },
    { name: 'Compound Interest', href: '/calculators/compound-interest', icon: TrendingUp, color: 'text-green-500' },
    { name: 'Percentage Calculator', href: '/calculators/percentage', icon: Calculator, color: 'text-purple-500' },
  ];

  const features = [
    {
      icon: Calculator,
      title: 'Professional Accuracy',
      description: 'Industry-standard calculations verified by certified professionals'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Available in English, Italian, French, and Spanish'
    },
    {
      icon: Star,
      title: 'Trusted by Millions',
      description: 'Over 10 million calculations performed with 99.9% accuracy'
    }
  ];

  return (
    <>
      <Head>
        <title>SocalSolver - Professional Calculator Platform</title>
        <meta name="description" content="Professional financial, mathematical, and health calculators. Accurate, reliable, and trusted by millions worldwide." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
                <Link href="/calculators" className="text-gray-700 hover:text-orange-600 transition-colors">
                  Calculators
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional
              <span className="block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Calculator Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Accurate financial, mathematical, and health calculators trusted by millions worldwide. 
              Get instant results with professional-grade precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/calculators" size="lg" className="text-lg px-8 py-4">
                Browse Calculators
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                View Demo
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Popular Calculators
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {popularCalculators.map((calc, index) => (
                <Link key={index} href={calc.href}>
                  <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
                    <calc.icon className={`${calc.color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
                    <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {calc.name}
                    </h3>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="max-w-2xl mx-auto">
              <QuickBMICalculator />
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose SocalSolver?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <feature.icon className="mx-auto mb-4 text-orange-500" size={48} />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400">&copy; 2025 SocalSolver.com. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
