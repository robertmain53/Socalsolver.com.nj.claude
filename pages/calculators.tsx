import React, { useState, useEffect } from 'react';

export default function Calculators() {
  const [calculators, setCalculators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalculators();
  }, []);

  const fetchCalculators = async () => {
    try {
      const response = await fetch('/api/v2/calculators');
      const data = await response.json();
      setCalculators(data.calculators || []);
    } catch (error) {
      console.error('Error fetching calculators:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading calculators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Calculators</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator: any) => (
            <div key={calculator.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">{calculator.title}</h3>
              <p className="text-gray-600 mb-4">{calculator.description}</p>
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {calculator.category}
                </span>
                <button 
                  onClick={() => window.open(`/api/v2/calculators/${calculator.id}`, '_blank')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View API →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
