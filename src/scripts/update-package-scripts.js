#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Try to find package.json - first check current directory, then relative to script
let packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
 packageJsonPath = path.join(__dirname, '../../package.json');
}

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
 console.error('❌ package.json not found.');
 console.error('Tried:', path.join(process.cwd(), 'package.json'));
 console.error('Tried:', path.join(__dirname, '../../package.json'));
 console.error('Please make sure you are running this script from the project root directory.');
 process.exit(1);
}

console.log('✅ Found package.json at:', packageJsonPath);
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add new scripts
const newScripts = {
 'validate:calculators': 'node src/scripts/validate-calculators.js',
 'audit:seo': 'node src/scripts/seo-audit.js',
 'build:production': 'bash src/scripts/build-production.sh',
 'analyze': 'cross-env ANALYZE=true next build',
 'start:production': 'next start',
 'test:lighthouse': 'lighthouse http://localhost:3000 --output=html --output-path=lighthouse-report.html',
};

// Merge with existing scripts
packageJson.scripts = {
 ...packageJson.scripts,
 ...newScripts,
};

// Add development dependencies if they don't exist
const devDeps = {
 '@next/bundle-analyzer': '^14.0.0',
 'cross-env': '^7.0.3',
 'lighthouse': '^11.0.0',
};

packageJson.devDependencies = {
 ...packageJson.devDependencies,
 ...devDeps,
};

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Package.json updated with new scripts and dependencies');
console.log('\n📝 New scripts available:');
Object.keys(newScripts).forEach(script => {
 console.log(` npm run ${script}`);
});
