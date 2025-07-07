/**
 * Developer Portal - Main Dashboard
 * Interactive developer experience with API testing, documentation, and analytics
 */

import React, { useState, useEffect } from 'react';

export default function DeveloperPortal() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [usage, setUsage] = useState({});

  useEffect(() => {
    // Load user data and usage statistics
    loadUserData();
    loadUsageData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadUsageData = async () => {
    try {
      const response = await fetch('/api/user/usage');
      const usageData = await response.json();
      setUsage(usageData);
    } catch (error) {
      console.error('Failed to load usage data:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'api-keys', label: 'API Keys', icon: '🔑' },
    { id: 'playground', label: 'API Playground', icon: '🛝' },
    { id: 'documentation', label: 'Documentation', icon: '📚' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Developer Portal</h1>
              {user && (
                <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {user.tier.toUpperCase()} Plan
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {usage.currentPeriod?.apiCalls || 0} / {usage.limits?.apiCalls || '∞'} API calls this month
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar Navigation */}
          <nav className="w-64 mr-8">
            <div className="bg-white rounded-lg shadow-sm border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                    activeTab === tab.id ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && <OverviewTab user={user} usage={usage} />}
            {activeTab === 'api-keys' && <ApiKeysTab />}
            {activeTab === 'playground' && <PlaygroundTab />}
            {activeTab === 'documentation' && <DocumentationTab />}
          </main>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ user, usage }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to Calculator API {user?.name ? `, ${user.name}` : ''}! 👋
        </h2>
        <p className="text-blue-100 mb-4">
          Build powerful applications with our comprehensive calculator API. 
          Get started in minutes with our SDKs and interactive documentation.
        </p>
        <div className="flex space-x-4">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
            Quick Start Guide
          </button>
          <button className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
}

function ApiKeysTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">API Keys</h3>
      <p className="text-gray-600">Manage your API keys here.</p>
    </div>
  );
}

function PlaygroundTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">API Playground</h3>
      <p className="text-gray-600">Test API endpoints interactively.</p>
    </div>
  );
}

function DocumentationTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Documentation</h3>
      <p className="text-gray-600">Comprehensive API documentation.</p>
    </div>
  );
}
