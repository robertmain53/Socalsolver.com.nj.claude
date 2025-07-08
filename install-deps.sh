#!/bin/bash
echo "🚀 Installing SocalSolver dependencies..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ No package.json found. Please run this in your Next.js project root."
    exit 1
fi

# Install core dependencies
echo "📦 Installing core dependencies..."
npm install next@14 react@18 react-dom@18 tailwindcss@3 autoprefixer@10 postcss@8

# Install development dependencies
echo "🔧 Installing development dependencies..."
npm install --save-dev @types/react @types/node @types/react-dom typescript eslint eslint-config-next

# Install lucide-react for icons
echo "🎨 Installing icon library..."
npm install lucide-react

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000"
echo ""
echo "🌅 Your SocalSolver platform is ready!"
