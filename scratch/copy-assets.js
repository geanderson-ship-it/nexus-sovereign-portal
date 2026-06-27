const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

const copies = [
  {
    src: 'IAs Nexus/Dante - mentor.png',
    dest: 'dante-avatar-premium.png'
  },
  {
    src: 'IAs Nexus/Djeny - mentora.png',
    dest: 'djeny-avatar-premium.png'
  },
  {
    src: 'images/support-bg-nexus.png',
    dest: 'images/nexus-chat-background.png'
  },
  {
    src: 'assets/nexus/logo-icon.png',
    dest: 'logo-nexus-shield.png'
  }
];

copies.forEach(c => {
  const srcPath = path.join(publicDir, c.src);
  const destPath = path.join(publicDir, c.dest);
  
  try {
    // Create destination folder if not exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied public/${c.src} -> public/${c.dest}`);
  } catch (err) {
    console.error(`Failed to copy public/${c.src} -> public/${c.dest}:`, err.message || err);
  }
});

console.log('--- ALL IMAGES PROVISIONED SUCCESSFULLY ---');
