/**
 * Shopify Calculator Widgets App
 * Allows merchants to easily add calculators to their stores
 */

const express = require('express');
const { Shopify } = require('@shopify/shopify-api');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Shopify configuration
Shopify.Context.initialize({
 API_KEY: process.env.SHOPIFY_API_KEY,
 API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
 SCOPES: ['write_script_tags', 'read_products', 'write_products'],
 HOST_NAME: process.env.HOST,
 IS_EMBEDDED_APP: true,
 API_VERSION: '2023-07'
});

// Auth routes
app.get('/auth', async (req, res) => {
 const authRoute = await Shopify.Auth.beginAuth(
 req,
 res,
 req.query.shop,
 '/auth/callback',
 true
 );
 
 return res.redirect(authRoute);
});

app.get('/auth/callback', async (req, res) => {
 try {
 const session = await Shopify.Auth.validateAuthCallback(
 req,
 res,
 req.query
 );
 
 // Install script tag for calculator widgets
 await installScriptTag(session);
 
 // Redirect to app dashboard
 res.redirect(`/app?shop=${session.shop}&host=${req.query.host}`);
 
 } catch (error) {
 console.error('Auth callback error:', error);
 res.status(500).send('Authentication failed');
 }
});

// Install script tag to inject calculator widget functionality
async function installScriptTag(session) {
 const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
 
 const scriptTag = {
 script_tag: {
 event: 'onload',
 src: 'https://yourcalculatorsite.com/shopify/calculator-widgets.js',
 display_scope: 'all'
 }
 };
 
 try {
 await client.post({
 path: 'script_tags',
 data: scriptTag
 });
 
 console.log('Script tag installed successfully');
 } catch (error) {
 console.error('Failed to install script tag:', error);
 }
}

// App dashboard
app.get('/app', (req, res) => {
 res.send(`
 <!DOCTYPE html>
 <html>
 <head>
 <title>Calculator Widgets</title>
 <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
 <style>
 body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; }
 .container { max-width: 800px; margin: 0 auto; }
 .calculator-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
 .calculator-card { border: 1px solid #e1e1e1; border-radius: 8px; padding: 15px; background: white; }
 .install-btn { background: #5c6ac4; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
 .install-btn:hover { background: #4c5bd4; }
 </style>
 </head>
 <body>
 <div class="container">
 <h1>Calculator Widgets for Shopify</h1>
 <p>Choose calculators to add to your store:</p>
 
 <div class="calculator-grid">
 <div class="calculator-card">
 <h3>Loan Calculator</h3>
 <p>Help customers calculate loan payments</p>
 <button class="install-btn" onclick="installCalculator('loan')">Install</button>
 </div>
 
 <div class="calculator-card">
 <h3>Savings Calculator</h3>
 <p>Show potential savings over time</p>
 <button class="install-btn" onclick="installCalculator('savings')">Install</button>
 </div>
 
 <div class="calculator-card">
 <h3>ROI Calculator</h3>
 <p>Calculate return on investment</p>
 <button class="install-btn" onclick="installCalculator('roi')">Install</button>
 </div>
 
 <div class="calculator-card">
 <h3>Shipping Calculator</h3>
 <p>Calculate shipping costs and delivery times</p>
 <button class="install-btn" onclick="installCalculator('shipping')">Install</button>
 </div>
 </div>
 </div>
 
 <script>
 const app = createApp({
 apiKey: '${process.env.SHOPIFY_API_KEY}',
 host: '${req.query.host}',
 forceRedirect: true
 });
 
 function installCalculator(calculatorId) {
 fetch('/api/install-calculator', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ 
 shop: '${req.query.shop}',
 calculatorId 
 })
 })
 .then(response => response.json())
 .then(data => {
 if (data.success) {
 alert('Calculator installed successfully!');
 } else {
 alert('Installation failed: ' + data.error);
 }
 });
 }
 </script>
 </body>
 </html>
 `);
});

// API to install calculator on specific pages
app.post('/api/install-calculator', async (req, res) => {
 try {
 const { shop, calculatorId } = req.body;
 
 // Get shop session (simplified - in production, use proper session management)
 const session = { shop, accessToken: 'stored_access_token' };
 
 // Create metafield to store calculator configuration
 const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
 
 const metafield = {
 metafield: {
 namespace: 'calculator_widgets',
 key: `calculator_${calculatorId}`,
 value: JSON.stringify({
 calculatorId,
 enabled: true,
 theme: 'light',
 placement: 'product_page'
 }),
 type: 'json'
 }
 };
 
 await client.post({
 path: 'metafields',
 data: metafield
 });
 
 res.json({ success: true });
 
 } catch (error) {
 console.error('Calculator installation error:', error);
 res.json({ success: false, error: error.message });
 }
});

// Frontend script for Shopify stores
app.get('/shopify/calculator-widgets.js', (req, res) => {
 res.setHeader('Content-Type', 'application/javascript');
 res.send(`
 // Calculator Widgets for Shopify
 (function() {
 console.log('Calculator Widgets loaded');
 
 // Load calculator configurations from metafields
 function loadCalculators() {
 fetch('/admin/api/2023-07/metafields.json?namespace=calculator_widgets')
 .then(response => response.json())
 .then(data => {
 data.metafields.forEach(metafield => {
 const config = JSON.parse(metafield.value);
 if (config.enabled) {
 initializeCalculator(config);
 }
 });
 })
 .catch(error => console.error('Failed to load calculators:', error));
 }
 
 function initializeCalculator(config) {
 // Create calculator container
 const container = document.createElement('div');
 container.id = 'calculator-' + config.calculatorId;
 container.className = 'shopify-calculator-widget';
 
 // Insert into appropriate location based on placement
 let targetElement;
 switch (config.placement) {
 case 'product_page':
 targetElement = document.querySelector('.product-form') || 
 document.querySelector('.product-details') ||
 document.querySelector('main');
 break;
 case 'cart_page':
 targetElement = document.querySelector('.cart') ||
 document.querySelector('main');
 break;
 default:
 targetElement = document.querySelector('main');
 }
 
 if (targetElement) {
 targetElement.appendChild(container);
 
 // Load calculator widget script
 const script = document.createElement('script');
 script.src = 'https://yourcalculatorsite.com/embed/widget.js';
 script.onload = function() {
 new CalculatorWidget(container, {
 calculatorId: config.calculatorId,
 theme: config.theme || 'light',
 size: 'medium',
 branding: true,
 shopify: true
 });
 };
 document.head.appendChild(script);
 }
 }
 
 // Initialize when DOM is ready
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', loadCalculators);
 } else {
 loadCalculators();
 }
 })();
 `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log(\`Shopify app listening on port \${port}\`);
});
