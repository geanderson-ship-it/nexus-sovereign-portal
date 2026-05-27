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
      if (content.includes('Amplify.configure')) {
        console.log(`Found Amplify.configure in ${path.relative(path.join(__dirname, '..'), fullPath)}`);
      }
    }
  }
}

search(srcDir);
