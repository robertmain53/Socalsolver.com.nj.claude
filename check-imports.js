// check-imports.js
const glob = require("glob");
const fs = require("fs");

const files = glob.sync("pages/**/*.{js,jsx,ts,tsx}");

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const matches = content.match(/from ['"](.*)['"]/g);
  if (matches) {
    matches.forEach((line) => {
      const pathMatch = line.match(/['"](.*)['"]/);
      if (pathMatch) {
        const importPath = pathMatch[1];
        if (importPath.startsWith(".")) {
          const absPath = require("path").resolve(require("path").dirname(file), importPath);
          if (!fs.existsSync(absPath) && !fs.existsSync(absPath + ".ts") && !fs.existsSync(absPath + ".tsx") && !fs.existsSync(absPath + ".js")) {
            console.warn(`🚨 Broken import in ${file}: ${importPath}`);
          }
        }
      }
    });
  }
});
