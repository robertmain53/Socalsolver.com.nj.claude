// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const baseConfig = {
  i18n: {
    locales: ['en', 'es', 'it', 'fr'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

module.exports = withMDX(baseConfig);
