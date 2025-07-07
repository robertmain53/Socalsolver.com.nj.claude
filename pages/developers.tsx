import React from 'react';

export default function Developers() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Developer Portal</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">1. Get API Access</h4>
                <p className="text-gray-600">Sign up for an API key to access our calculator endpoints.</p>
              </div>
              <div>
                <h4 className="font-medium">2. Make Your First Call</h4>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  curl -X GET /api/v2/calculators
                </div>
              </div>
              <div>
                <h4 className="font-medium">3. Try a Calculation</h4>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  curl -X POST /api/v2/calculate<br/>
                  -d '{"calculatorId":"mortgage","inputs":{"principal":300000,"rate":3.5,"term":30}}'
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>
            <div className="space-y-3">
              <div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">GET</span>
                <span className="ml-2">/api/v2/calculators</span>
              </div>
              <div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">GET</span>
                <span className="ml-2">/api/v2/calculators/:id</span>
              </div>
              <div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">POST</span>
                <span className="ml-2">/api/v2/calculate</span>
              </div>
              <div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">GET</span>
                <span className="ml-2">/api/health</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
