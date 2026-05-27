const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const filesList = [];

function getFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath);
    } else {
      filesList.push(path.relative(publicDir, fullPath));
    }
  }
}

try {
  getFiles(publicDir);
  console.log(`Total files in public/: ${filesList.length}`);
  console.log('\n--- ALL FILES IN public/ ---');
  filesList.sort().forEach(f => console.log(f));
} catch (err) {
  console.error(err);
}
