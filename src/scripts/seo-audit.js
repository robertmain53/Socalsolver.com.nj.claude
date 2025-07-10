#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running SEO Audit...\n');

const issues = [];
const recommendations = [];

// Check for required SEO files
const requiredFiles = [
 'src/app/sitemap.xml/route.ts',
 'src/app/robots.txt/route.ts',
 'src/lib/seo/metadata.ts',
 'src/lib/seo/structured-data.ts',
];

requiredFiles.forEach(file => {
 const filePath = path.join(__dirname, '../..', file);
 if (!fs.existsSync(filePath)) {
 issues.push(`Missing required SEO file: ${file}`);
 } else {
 console.log(`✅ Found: ${file}`);
 }
});

// Check calculator configurations for SEO completeness
const calculatorsDir = path.join(__dirname, '../src/data/calculators');
if (fs.existsSync(calculatorsDir)) {
 const calculatorFiles = fs.readdirSync(calculatorsDir).filter(file => file.endsWith('.ts'));
 
 console.log(`\n📊 Auditing ${calculatorFiles.length} calculator configurations...\n`);
 
 calculatorFiles.forEach(file => {
 const content = fs.readFileSync(path.join(calculatorsDir, file), 'utf8');
 
 // Check for SEO fields
 const seoChecks = [
 { field: 'seo:', name: 'SEO configuration' },
 { field: 'title:', name: 'Title' },
 { field: 'description:', name: 'Description' },
 { field: 'keywords:', name: 'Keywords' },
 { field: 'category:', name: 'Category' },
 { field: 'difficulty:', name: 'Difficulty' },
 { field: 'useCase:', name: 'Use cases' },
 { field: 'relatedTopics:', name: 'Related topics' },
 { field: 'lastUpdated:', name: 'Last updated date' },
 ];
 
 const fileIssues = [];
 seoChecks.forEach(check => {
 if (!content.includes(check.field)) {
 fileIssues.push(`Missing ${check.name}`);
 }
 });
 
 if (fileIssues.length > 0) {
 console.log(`⚠️ ${file}:`);
 fileIssues.forEach(issue => console.log(` • ${issue}`));
 issues.push(...fileIssues.map(issue => `${file}: ${issue}`));
 } else {
 console.log(`✅ ${file} - SEO complete`);
 }
 });
}

// Check for Open Graph image generation
const ogRoutes = [
 'src/app/api/og/calculator/[id]/route.tsx',
 'src/app/api/og/category/[category]/route.tsx',
 'src/app/api/og/home/route.tsx',
];

console.log(`\n🖼️ Checking Open Graph image generation...\n`);
ogRoutes.forEach(route => {
 const routePath = path.join(__dirname, '../..', route);
 if (fs.existsSync(routePath)) {
 console.log(`✅ Found: ${route}`);
 } else {
 issues.push(`Missing Open Graph route: ${route}`);
 }
});

// SEO Recommendations
recommendations.push('Ensure all calculator pages have unique meta descriptions');
recommendations.push('Add structured data to all calculator pages');
recommendations.push('Implement proper internal linking between related calculators');
recommendations.push('Optimize page load speeds for better Core Web Vitals');
recommendations.push('Add breadcrumb navigation for better user experience');
recommendations.push('Implement canonical URLs to prevent duplicate content');
recommendations.push('Add alt text to all images');
recommendations.push('Use semantic HTML5 elements for better accessibility');

// Generate report
console.log('\n📋 SEO Audit Report');
console.log('='.repeat(50));

if (issues.length > 0) {
 console.log('\n❌ Issues Found:');
 issues.forEach((issue, index) => {
 console.log(`${index + 1}. ${issue}`);
 });
} else {
 console.log('\n✅ No critical SEO issues found!');
}

console.log('\n💡 Recommendations:');
recommendations.forEach((rec, index) => {
 console.log(`${index + 1}. ${rec}`);
});

console.log('\n📊 Summary:');
console.log(` • Issues found: ${issues.length}`);
console.log(` • Recommendations: ${recommendations.length}`);
console.log(` • SEO score: ${Math.max(0, 100 - (issues.length * 10))}%`);

if (issues.length > 0) {
 console.log('\n🚨 Please address the issues above for optimal SEO performance.');
} else {
 console.log('\n🎉 Your calculator platform is SEO-ready!');
}
