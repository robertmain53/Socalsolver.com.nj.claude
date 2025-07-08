/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Fix for watchpack issues in containers/codespaces
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Configure webpack watching to avoid path issues
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/out/**'
        ],
      }
      
      // Resolve path issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    
    return config
  },
  
  images: {
    domains: [],
    unoptimized: dev
  },
  
  // Enhanced performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts']
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'socalsolver',
  },
}

module.exports = nextConfig
