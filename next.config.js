/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'es', 'it', 'fr'],
    defaultLocale: 'en',
    localeDetection: false, // ← must be boolean
  },
};

module.exports = nextConfig;
