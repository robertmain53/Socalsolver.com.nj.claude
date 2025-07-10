/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => {
 const isDev = phase === 'phase-development-server';

 return {
 reactStrictMode: true,
 swcMinify: true,

 webpack: (config, { dev, isServer }) => {
 if (dev) {
 console.log("🔍 Webpack config for dev...");

 config.watchOptions = {
 poll: 1000,
 aggregateTimeout: 300,
 ignored: [
 '**/node_modules/**',
 '**/.git/**',
 '**/.next/**',
 '**/out/**',
 ],
 };

 config.resolve = {
 ...config.resolve,
 fallback: {
 ...(config.resolve?.fallback || {}),
 fs: false,
 path: false,
 },
 };

 console.log("🗂️ Webpack context path:", config.context || '⚠️ undefined');
 }

 return config;
 },

 images: {
 domains: [],
 unoptimized: isDev,
 },

 experimental: {
 optimizeCss: true,
 optimizePackageImports: ['lucide-react', 'recharts'],
 },

 compiler: {
 removeConsole: process.env.NODE_ENV === 'production',
 },

 env: {
 CUSTOM_KEY: 'socalsolver',
 },
 };
};

module.exports = nextConfig;
