const fetch = require('node-fetch');

(async () => {
  console.log("🧪 Testing /api/improve...");
  const response = await fetch('http://localhost:3000/api/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: 'test', content: '# Example Content\n\nExplain this clearly.' })
  });

  const data = await response.json();
  if (!data.improved || !data.diff) {
    console.error("❌ /api/improve test failed.");
    process.exit(1);
  }
  console.log("✅ /api/improve test passed.");
})();
