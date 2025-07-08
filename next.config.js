/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Fix for watchpack errors
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
    }
    return config
  },
  
  // Disable file watching for problematic directories
  experimental: {
    // Remove any experimental features that might cause issues
  },
  
  images: {
    domains: [],
  },
}

module.exports = nextConfig
