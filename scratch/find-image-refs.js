const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      search(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('nexus-hero-hologram') || content.includes('Combine-the-first-im')) {
        console.log(`Found image ref in ${path.relative(path.join(__dirname, '..'), fullPath)}`);
      }
    }
  }
}

console.log('Searching codebase for image references...');
search(srcDir);
