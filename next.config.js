/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  // i18n is ignored by App Router but required for static export
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  }
};

module.exports = nextConfig;
