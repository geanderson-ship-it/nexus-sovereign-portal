const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

const copies = [
  {
    src: 'Nexus Treinamento pagina inicial/Nexus Treinamento pagina inicial.png',
    dest: 'nexus-treinamento-logo.png'
  },
  {
    src: 'Nexus Intelligence pagina inicial/Nexus Intelligence pagina inicial.png',
    dest: 'nexus-intelligence-logo.png'
  }
];

copies.forEach(c => {
  const srcPath = path.join(publicDir, c.src);
  const destPath = path.join(publicDir, c.dest);
  
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully copied public/${c.src} -> public/${c.dest}`);
    } else {
      console.error(`Source file not found: public/${c.src}`);
    }
  } catch (err) {
    console.error(`Failed to copy public/${c.src} -> public/${c.dest}:`, err.message || err);
  }
});
