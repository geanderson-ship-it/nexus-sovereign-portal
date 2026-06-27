const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

const targets = ['dante-avatar-premium', 'djeny-avatar-premium', 'logo-nexus-shield', 'nexus-chat-background'];

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      search(fullPath);
    } else {
      const lower = file.toLowerCase();
      targets.forEach(t => {
        if (lower.includes(t.toLowerCase()) || t.toLowerCase().includes(lower)) {
          console.log(`Matched target "${t}": public/${path.relative(publicDir, fullPath)}`);
        }
      });
      // Also match generic terms to see what files exist
      if (lower.includes('avatar') || lower.includes('background') || lower.includes('shield')) {
        console.log(`Candidate file: public/${path.relative(publicDir, fullPath)}`);
      }
    }
  }
}

console.log('Searching public/ recursively for image candidates...');
search(publicDir);
