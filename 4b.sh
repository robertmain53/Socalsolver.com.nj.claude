#!/bin/bash

# =============================================================================
# Fix Next.js Integration for Part 4B - API System
# =============================================================================
# This script fixes the integration issues and ensures proper Next.js structure
# =============================================================================

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔧 Fixing Next.js Integration for API System...${NC}"

PROJECT_ROOT=$(pwd)

# =============================================================================
# 1. CHECK CURRENT STRUCTURE
# =============================================================================

check_current_structure() {
    echo -e "${YELLOW}📋 Checking current project structure...${NC}"
    
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
    
    echo -e "\nChecking for Next.js files:"
    if [ -f "package.json" ]; then
        echo "✅ package.json found"
        if grep -q "next" package.json; then
            echo "✅ Next.js detected in package.json"
        else
            echo "❌ Next.js not found in package.json"
        fi
    else
        echo "❌ package.json not found"
    fi
    
    if [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then
        echo "✅ Next.js config found"
    else
        echo "❌ Next.js config not found"
    fi
    
    echo -e "\nChecking directory structure:"
    if [ -d "pages" ]; then
        echo "✅ pages directory exists"
        ls -la pages/ 2>/dev/null || echo "Empty pages directory"
    else
        echo "❌ pages directory missing"
    fi
    
    if [ -d "src" ]; then
        echo "✅ src directory exists"
        ls -la src/ 2>/dev/null || echo "Empty src directory"
    else
        echo "❌ src directory missing"
    fi
}

# =============================================================================
# 2. CREATE PROPER NEXT.JS API STRUCTURE
# =============================================================================

create_nextjs_api_structure() {
    echo -e "${YELLOW}🏗️ Creating proper Next.js API structure...${NC}"
    
    # Create pages/api directory structure for Next.js
    mkdir -p pages/api/{v1,v2,auth,analytics,webhooks}
    mkdir -p pages/api/v2/{calculators,calculations,users,exports}
    
    # Create basic API route files that Next.js can serve
    
    # Health check endpoint
    cat > pages/api/health.ts << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
}
EOF

    # API info endpoint
    cat > pages/api/info.ts << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    name: 'Calculator API',
    version: '2.0.0',
    description: 'Advanced calculator API with comprehensive features',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      v2: '/api/v2'
    },
    features: [
      'Real-time calculations',
      'Batch processing',
      'Custom formulas',
      'Data export',
      'Analytics'
    ]
  });
}
EOF

    # V2 API index
    cat > pages/api/v2/index.ts << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: 'Welcome to Calculator API v2',
    version: '2.0.0',
    endpoints: {
      calculators: '/api/v2/calculators',
      calculate: '/api/v2/calculate',
      health: '/api/health'
    },
    documentation: '/api/docs'
  });
}
EOF

    # Calculators endpoint
    cat > pages/api/v2/calculators.ts << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';

// Sample calculator data
const sampleCalculators = [
  {
    id: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments',
    category: 'finance',
    inputs: [
      { id: 'principal', label: 'Loan Amount', type: 'number', required: true },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', required: true },
      { id: 'term', label: 'Loan Term (years)', type: 'number', required: true }
    ]
  },
  {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'Calculate loan payments and total interest',
    category: 'finance',
    inputs: [
      { id: 'amount', label: 'Loan Amount', type: 'number', required: true },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', required: true },
      { id: 'term', label: 'Loan Term (years)', type: 'number', required: true }
    ]
  },
  {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Calculate Body Mass Index',
    category: 'health',
    inputs: [
      { id: 'weight', label: 'Weight (lbs)', type: 'number', required: true },
      { id: 'height', label: 'Height (inches)', type: 'number', required: true }
    ]
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      // Handle calculator listing
      const { category, search, page = 1, limit = 20 } = query;
      
      let filteredCalculators = sampleCalculators;
      
      // Filter by category
      if (category) {
        filteredCalculators = filteredCalculators.filter(calc => 
          calc.category === category
        );
      }
      
      // Filter by search term
      if (search) {
        const searchTerm = search.toString().toLowerCase();
        filteredCalculators = filteredCalculators.filter(calc =>
          calc.title.toLowerCase().includes(searchTerm) ||
          calc.description.toLowerCase().includes(searchTerm)
        );
      }
      
      // Simple pagination
      const pageNum = parseInt(page.toString());
      const limitNum = parseInt(limit.toString());
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      
      const paginatedCalculators = filteredCalculators.slice(startIndex, endIndex);
      
      res.status(200).json({
        calculators: paginatedCalculators,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredCalculators.length,
          pages: Math.ceil(filteredCalculators.length / limitNum)
        }
      });
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
EOF

    # Calculator by ID endpoint
    cat > "pages/api/v2/calculators/[id].ts" << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';

const calculators = {
  mortgage: {
    id: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments, total interest, and amortization schedule',
    category: 'finance',
    inputs: [
      { 
        id: 'principal', 
        label: 'Loan Amount ($)', 
        type: 'number', 
        required: true,
        min: 1000,
        max: 10000000,
        help: 'The total amount you want to borrow'
      },
      { 
        id: 'rate', 
        label: 'Interest Rate (%)', 
        type: 'number', 
        required: true,
        min: 0.1,
        max: 30,
        step: 0.01,
        help: 'Annual interest rate as a percentage'
      },
      { 
        id: 'term', 
        label: 'Loan Term (years)', 
        type: 'number', 
        required: true,
        min: 1,
        max: 50,
        help: 'Number of years to repay the loan'
      },
      {
        id: 'downPayment',
        label: 'Down Payment ($)',
        type: 'number',
        required: false,
        min: 0,
        help: 'Optional down payment amount'
      }
    ],
    outputs: [
      { id: 'monthlyPayment', label: 'Monthly Payment', format: 'currency' },
      { id: 'totalPaid', label: 'Total Amount Paid', format: 'currency' },
      { id: 'totalInterest', label: 'Total Interest', format: 'currency' }
    ]
  },
  loan: {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'Calculate loan payments for personal loans, auto loans, and more',
    category: 'finance',
    inputs: [
      { id: 'amount', label: 'Loan Amount ($)', type: 'number', required: true },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', required: true },
      { id: 'term', label: 'Loan Term (years)', type: 'number', required: true }
    ],
    outputs: [
      { id: 'monthlyPayment', label: 'Monthly Payment', format: 'currency' },
      { id: 'totalPaid', label: 'Total Amount Paid', format: 'currency' },
      { id: 'totalInterest', label: 'Total Interest', format: 'currency' }
    ]
  },
  bmi: {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and health category',
    category: 'health',
    inputs: [
      { id: 'weight', label: 'Weight (lbs)', type: 'number', required: true },
      { id: 'height', label: 'Height (inches)', type: 'number', required: true }
    ],
    outputs: [
      { id: 'bmi', label: 'BMI', format: 'number' },
      { id: 'category', label: 'Health Category', format: 'text' }
    ]
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const calculator = calculators[id as string];
  
  if (!calculator) {
    return res.status(404).json({
      error: 'Calculator not found',
      availableCalculators: Object.keys(calculators)
    });
  }

  res.status(200).json({ calculator });
}
EOF

    # Calculate endpoint
    cat > pages/api/v2/calculate.ts << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { calculatorId, inputs } = req.body;

  if (!calculatorId || !inputs) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['calculatorId', 'inputs']
    });
  }

  try {
    let result;

    switch (calculatorId) {
      case 'mortgage':
        result = calculateMortgage(inputs);
        break;
      case 'loan':
        result = calculateLoan(inputs);
        break;
      case 'bmi':
        result = calculateBMI(inputs);
        break;
      default:
        return res.status(404).json({
          error: 'Calculator not found',
          calculatorId
        });
    }

    res.status(200).json({
      calculatorId,
      inputs,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(400).json({
      error: 'Calculation failed',
      details: error.message
    });
  }
}

function calculateMortgage(inputs: any) {
  const { principal, rate, term, downPayment = 0 } = inputs;
  
  if (!principal || !rate || !term) {
    throw new Error('Missing required inputs: principal, rate, term');
  }

  const loanAmount = principal - downPayment;
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = term * 12;

  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPaid = monthlyPayment * numberOfPayments;
  const totalInterest = totalPaid - loanAmount;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    loanAmount: loanAmount
  };
}

function calculateLoan(inputs: any) {
  const { amount, rate, term } = inputs;
  
  if (!amount || !rate || !term) {
    throw new Error('Missing required inputs: amount, rate, term');
  }

  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = term * 12;

  const monthlyPayment = amount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPaid = monthlyPayment * numberOfPayments;
  const totalInterest = totalPaid - amount;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100
  };
}

function calculateBMI(inputs: any) {
  const { weight, height } = inputs;
  
  if (!weight || !height) {
    throw new Error('Missing required inputs: weight, height');
  }

  const bmi = (weight * 703) / (height * height);
  
  let category;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25) {
    category = 'Normal weight';
  } else if (bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return {
    bmi: Math.round(bmi * 100) / 100,
    category
  };
}
EOF

    echo -e "${GREEN}✅ Next.js API structure created${NC}"
}

# =============================================================================
# 3. CREATE BASIC PAGES
# =============================================================================

create_basic_pages() {
    echo -e "${YELLOW}📄 Creating basic pages...${NC}"
    
    # Create pages directory if it doesn't exist
    mkdir -p pages
    
    # Create a basic index page if it doesn't exist
    if [ ! -f "pages/index.tsx" ] && [ ! -f "pages/index.js" ]; then
        cat > pages/index.tsx << 'EOF'
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
EOF
    fi

    # Create calculators page
    cat > pages/calculators.tsx << 'EOF'
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
EOF

    # Create developers page
    cat > pages/developers.tsx << 'EOF'
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
EOF

    echo -e "${GREEN}✅ Basic pages created${NC}"
}

# =============================================================================
# 4. UPDATE PACKAGE.JSON
# =============================================================================

update_package_json() {
    echo -e "${YELLOW}📦 Updating package.json...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo "Creating basic package.json..."
        cat > package.json << 'EOF'
{
  "name": "calculator-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/node": "20.8.0",
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0",
    "typescript": "5.2.0"
  }
}
EOF
    else
        echo "✅ package.json already exists"
    fi
}

# =============================================================================
# 5. CREATE NEXT.JS CONFIG
# =============================================================================

create_nextjs_config() {
    echo -e "${YELLOW}⚙️ Creating Next.js configuration...${NC}"
    
    if [ ! -f "next.config.js" ] && [ ! -f "next.config.mjs" ]; then
        cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/docs',
        destination: '/api/info'
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-API-Key'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
EOF
        echo "✅ Next.js config created"
    else
        echo "✅ Next.js config already exists"
    fi
}

# =============================================================================
# 6. CREATE TYPESCRIPT CONFIG
# =============================================================================

create_typescript_config() {
    echo -e "${YELLOW}📝 Creating TypeScript configuration...${NC}"
    
    if [ ! -f "tsconfig.json" ]; then
        cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./pages/*"],
      "@/api/*": ["./pages/api/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF
        echo "✅ TypeScript config created"
    else
        echo "✅ TypeScript config already exists"
    fi
}

# =============================================================================
# 7. TEST THE SETUP
# =============================================================================

test_setup() {
    echo -e "${YELLOW}🧪 Testing the setup...${NC}"
    
    echo "Testing API endpoints..."
    
    # Check if Next.js development server is running
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Development server is running"
        
        # Test health endpoint
        echo "Testing /api/health..."
        curl -s http://localhost:3000/api/health | jq . 2>/dev/null || echo "Health endpoint response received"
        
        # Test info endpoint
        echo "Testing /api/info..."
        curl -s http://localhost:3000/api/info | jq . 2>/dev/null || echo "Info endpoint response received"
        
        # Test calculators endpoint
        echo "Testing /api/v2/calculators..."
        curl -s http://localhost:3000/api/v2/calculators | jq . 2>/dev/null || echo "Calculators endpoint response received"
        
    else
        echo "❌ Development server is not running"
        echo "To start the development server, run:"
        echo "  npm install"
        echo "  npm run dev"
    fi
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    echo -e "${BLUE}🔧 Starting Next.js Integration Fix...${NC}\n"
    
    # Check current structure
    check_current_structure
    echo ""
    
    # Create proper Next.js API structure
    create_nextjs_api_structure
    echo ""
    
    # Create basic pages
    create_basic_pages
    echo ""
    
    # Update package.json
    update_package_json
    echo ""
    
    # Create Next.js config
    create_nextjs_config
    echo ""
    
    # Create TypeScript config
    create_typescript_config
    echo ""
    
    echo -e "${GREEN}✅ Next.js Integration Fix Complete!${NC}"
    echo -e "${YELLOW}🎯 What was fixed:${NC}"
    echo "   📁 Proper Next.js pages/api directory structure"
    echo "   🔌 Working API endpoints (/api/health, /api/info, /api/v2/*)"
    echo "   📄 Basic pages (index, calculators, developers)"
    echo "   ⚙️ Next.js and TypeScript configuration"
    echo "   🧪 Sample calculator implementations"
    echo ""
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo "1. Install dependencies:"
    echo "   npm install"
    echo ""
    echo "2. Start the development server:"
    echo "   npm run dev"
    echo ""
    echo "3. Test the API endpoints:"
    echo "   http://localhost:3000/api/health"
    echo "   http://localhost:3000/api/v2/calculators"
    echo "   http://localhost:3000/calculators"
    echo ""
    echo "4. Test a calculation:"
    echo '   curl -X POST http://localhost:3000/api/v2/calculate \'
    echo '   -H "Content-Type: application/json" \'
    echo '   -d '"'"'{"calculatorId":"mortgage","inputs":{"principal":300000,"rate":3.5,"term":30}}'"'"
    echo ""
    
    # Test the setup if server is running
    test_setup
}

# Run main function
main

echo -e "${GREEN}Fix script completed successfully!${NC}"