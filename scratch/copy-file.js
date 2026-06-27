const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '../public/nexus-hero-hologram.png.png');
const destFile = path.join(__dirname, '../public/nexus-hero-hologram.png');

try {
  fs.copyFileSync(srcFile, destFile);
  console.log('Successfully copied nexus-hero-hologram.png.png to nexus-hero-hologram.png');
} catch (err) {
  console.error('Failed to copy file:', err);
}
