import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calculator, Heart, ArrowLeft } from 'lucide-react';

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg hover:shadow-xl px-4 py-2 ${className}`}
  >
    {children}
  </button>
);

export default function BMICalculatorPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  
  const calculateBMI = () => {
    if (height && weight) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      let category = '';
      let color = '';
      
      if (bmi < 18.5) {
        category = 'Underweight';
        color = 'text-blue-600';
      } else if (bmi < 25) {
        category = 'Normal weight';
        color = 'text-green-600';
      } else if (bmi < 30) {
        category = 'Overweight';
        color = 'text-yellow-600';
      } else {
        category = 'Obese';
        color = 'text-red-600';
      }
      
      setResult({ bmi: bmi.toFixed(1), category, color });
    }
  };

  return (
    <>
      <Head>
        <title>BMI Calculator - SocalSolver</title>
        <meta name="description" content="Calculate your BMI with our professional Body Mass Index calculator." />
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-orange-600">Calculators</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">BMI Calculator</span>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="mb-6">
            <Link href="/calculators" className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Calculators
            </Link>
          </div>

          <Card className="p-8">
            <div className="flex items-center mb-6">
              <Heart className="mr-3 text-pink-500" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">BMI Calculator</h1>
                <p className="text-gray-600">Calculate your Body Mass Index and health category</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="170"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="70"
                />
              </div>
            </div>

            <Button onClick={calculateBMI} className="w-full mb-6 py-3 text-lg">
              Calculate BMI
            </Button>

            {result && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    Your BMI: <span className={result.color}>{result.bmi}</span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Category: <span className={`font-semibold ${result.color}`}>{result.category}</span>
                  </p>
                </div>
                
                <div className="mt-6 grid sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm font-medium text-blue-800">Underweight</p>
                    <p className="text-xs text-blue-600">Below 18.5</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-sm font-medium text-green-800">Normal</p>
                    <p className="text-xs text-green-600">18.5 - 24.9</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <p className="text-sm font-medium text-yellow-800">Overweight</p>
                    <p className="text-xs text-yellow-600">25.0 - 29.9</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <p className="text-sm font-medium text-red-800">Obese</p>
                    <p className="text-xs text-red-600">30.0+</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </main>

        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">&copy; 2025 SocalSolver.com. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
