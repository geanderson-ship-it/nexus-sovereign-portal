const fs = require('fs');
const path = require('path');

const files = [
  'src/app/intelligence/recrutamento/page.tsx',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/propostas/cidades-do-futuro/page.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, '..', f);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`=== FILE: ${f} ===`);
  lines.forEach((line, index) => {
    if (line.includes('nexus-hero-hologram') || line.includes('Combine-the-first-im') || line.includes('hero-hologram')) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  });
  console.log('===================\n');
});
