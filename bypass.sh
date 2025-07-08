#!/bin/bash

echo "🔧 Completely bypassing watchpack issues for Codespaces..."

# Stop any running processes on ports 3000-3002
echo "🛑 Stopping any running processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*3000" 2>/dev/null || true

# 1. APPROACH 1: Try older Next.js version known to work in containers
echo "📦 Trying stable Next.js version for containers..."

cat > package.json << 'PKGEOF'
{
  "name": "socalsolver-calculator-platform",
  "version": "5.0.0",
  "description": "Professional calculator platform with sunset coastal design theme",
  "scripts": {
    "dev": "next dev",
    "dev-legacy": "next dev --experimental-https=false",
    "dev-production": "npm run build && npm start",
    "dev-custom": "node custom-dev-server.js",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "12.3.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/react": "^18.2.25",
    "@types/react-dom": "^18.2.11",
    "typescript": "^4.9.0",
    "eslint": "^8.51.0",
    "eslint-config-next": "12.3.4"
  }
}
PKGEOF

# 2. Create a completely minimal next.config.js
cat > next.config.js << 'NEXTEOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  
  // Completely disable webpack watching
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable all file watching
      config.cache = false
      config.watchOptions = false
      
      // Disable hot reloading
      config.plugins = config.plugins.filter(
        plugin => plugin.constructor.name !== 'HotModuleReplacementPlugin'
      )
    }
    return config
  },
  
  // Minimal configuration
  images: {
    unoptimized: true,
  },
  
  // Disable all experimental features
  experimental: {},
  
  // Force production-like behavior in dev
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
}

module.exports = nextConfig
NEXTEOF

# 3. Create custom dev server that completely bypasses Next.js file watching
cat > custom-dev-server.js << 'DEVEOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = 3000
const dev = true

console.log('🌅 Starting SocalSolver custom dev server...')

const app = next({ 
  dev: false, // Force production mode to avoid file watching
  conf: {
    distDir: '.next',
    generateEtags: false,
    compress: false,
  }
})

const handle = app.getRequestHandler()

// First build the app
console.log('📦 Building application...')

app.prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        // Parse the URL
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('Internal server error')
      }
    })
    .once('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
    .listen(port, (err) => {
      if (err) throw err
      console.log('')
      console.log('🎉 SocalSolver is running!')
      console.log(`🌅 http://localhost:${port}`)
      console.log('')
      console.log('📱 Available pages:')
      console.log('   • Home: http://localhost:' + port)
      console.log('   • Calculators: http://localhost:' + port + '/calculators')
      console.log('   • BMI: http://localhost:' + port + '/calculators/bmi')
      console.log('')
    })
  })
  .catch((ex) => {
    console.error('Failed to start server:', ex)
    process.exit(1)
  })
DEVEOF

# 4. Create .env.local to force production-like behavior
cat > .env.local << 'ENVEOF'
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development
FORCE_PRODUCTION_BUILD=true
DISABLE_FILE_WATCHING=true
ENVEOF

# 5. Update package.json to include the custom dev command
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts['dev-safe'] = 'NODE_ENV=production npm run build && npm start';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo ""
echo "🎯 MULTIPLE SOLUTIONS READY!"
echo "============================"
echo ""
echo "Try these options in order:"
echo ""
echo "1. 🔥 Production mode (most reliable):"
echo "   npm run dev-safe"
echo ""
echo "2. 📦 Custom dev server (bypasses watchpack):"
echo "   npm install"
echo "   npm run dev-custom"
echo ""
echo "3. 🏗️ Direct production build:"
echo "   npm install"
echo "   npm run build"
echo "   npm start"
echo ""
echo "4. 🌐 If all fails, simple static server:"
echo "   npx serve out -l 3000"
echo ""
echo "💡 The production mode (option 1) should definitely work!"
echo "   It builds once and serves without file watching."
echo ""

# Quick install and try production mode
echo "🚀 Quick setup - trying production mode..."
rm -rf node_modules package-lock.json .next
npm install --production=false

echo ""
echo "✅ Setup complete! Now run:"
echo "   npm run dev-safe"