import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Calculator Platform
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Advanced calculator platform with API and developer tools
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">API Documentation</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive API documentation with examples
              </p>
              <Link href="/api/info" className="text-blue-600 hover:text-blue-800">
                View API Info →
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Calculator Examples</h3>
              <p className="text-gray-600 mb-4">
                Try our calculator API endpoints
              </p>
              <Link href="/calculators" className="text-blue-600 hover:text-blue-800">
                View Calculators →
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Developer Tools</h3>
              <p className="text-gray-600 mb-4">
                SDKs, tools, and developer resources
              </p>
              <Link href="/developers" className="text-blue-600 hover:text-blue-800">
                Developer Portal →
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">API Status</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>API Online</span>
              </div>
              <Link href="/api/health" className="text-blue-600 hover:text-blue-800">
                Check Health →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
