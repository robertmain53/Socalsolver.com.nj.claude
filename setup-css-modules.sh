#!/bin/bash

echo "📁 Creating clean CSS structure..."

# 1. Create a styles directory if it doesn't exist
mkdir -p src/styles

# 2. Create global.css for app-wide base styles
cat > src/styles/global.css <<EOF
/* Global styles - mobile first */

html, body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
  background-color: #fafafa;
  color: #111;
}

a {
  color: inherit;
  text-decoration: none;
}

*, *::before, *::after {
  box-sizing: border-box;
}
EOF

# 3. Create a layout.css module for responsive layout utilities
cat > src/styles/layout.module.css <<EOF
/* Mobile-first responsive layout */

.container {
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}
EOF

# 4. Create a button.css module
cat > src/styles/button.module.css <<EOF
/* Button styles */

.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  background: #111;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.button:hover {
  background: #333;
}
EOF

echo "✅ CSS structure initialized in src/styles/"
