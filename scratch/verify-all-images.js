const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const publicDir = path.join(__dirname, '../public');

const imgRegex = /<(?:Image|img)[^>]*src=["']([^"']+)["']/g;
const bgImageRegex = /backgroundImage:\s*["']url\((?:['"]?)([^'")]+)(?:['"]?)\)["']/g;

const findings = [];

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scan(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      let match;
      // 1. Scan JSX Image tags
      while ((match = imgRegex.exec(content)) !== null) {
        findings.push({
          file: path.relative(path.join(__dirname, '..'), fullPath),
          src: match[1],
          type: 'JSX Tag'
        });
      }
      
      // 2. Scan CSS inline backgroundImage styles
      while ((match = bgImageRegex.exec(content)) !== null) {
        findings.push({
          file: path.relative(path.join(__dirname, '..'), fullPath),
          src: match[1],
          type: 'Inline Style'
        });
      }
    }
  }
}

console.log('Scanning codebase for image assets...');
scan(srcDir);

console.log(`\nFound ${findings.length} image references. Verifying their existence in /public...\n`);

let brokenCount = 0;

findings.forEach(f => {
  const isExternal = f.src.startsWith('http://') || f.src.startsWith('https://');
  
  if (isExternal) {
    console.log(`[EXTERNAL] ${f.file} -> Reference: "${f.src}" (${f.type})`);
  } else {
    // Local file check
    // Remove query params or hashes if present
    const cleanSrc = f.src.split('?')[0].split('#')[0];
    
    // Paths are typically relative to public directory (e.g. /images/logo.png -> public/images/logo.png)
    const localPath = path.join(publicDir, cleanSrc.startsWith('/') ? cleanSrc.slice(1) : cleanSrc);
    const exists = fs.existsSync(localPath);
    
    if (exists) {
      // Valid local image
    } else {
      brokenCount++;
      console.log(`\x1b[31m[BROKEN LOCAL]\x1b[0m ${f.file} -> Reference: "${f.src}" (${f.type}) - Path not found: public/${cleanSrc}`);
    }
  }
});

console.log(`\nVerification complete. Found ${brokenCount} broken local image references.`);
