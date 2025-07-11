/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'es', 'it', 'fr'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  experimental: {
    serverActions: true,   // 👈 add this line
  },
};

module.exports = nextConfig;
