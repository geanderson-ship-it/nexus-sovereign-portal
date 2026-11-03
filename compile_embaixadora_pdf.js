const { execSync } = require('child_process');
const fs = require('fs');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const htmlFile = 'C:/Users/geand/Gitclone/nexus-sovereign-portal/public/dossie-executivo-embaixadora-virtual-soberana.html';
const pdfOutput = 'C:/Users/geand/Gitclone/nexus-sovereign-portal/public/Dossie-Executivo-Embaixadora-Virtual-Soberana.pdf';

const cmd = `"${chromePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfOutput}" "file:///${htmlFile}"`;
console.log('Running Chrome PDF generator for Embaixadora...');
execSync(cmd, { stdio: 'inherit', timeout: 30000 });

if (fs.existsSync(pdfOutput)) {
    const stats = fs.statSync(pdfOutput);
    console.log('PDF created successfully! Size:', stats.size, 'bytes');

    // Also copy to Gitclone root and user Desktop
    fs.copyFileSync(pdfOutput, 'C:/Users/geand/Gitclone/Dossie-Executivo-Embaixadora-Virtual-Soberana.pdf');
    try {
        fs.copyFileSync(pdfOutput, 'C:/Users/geand/OneDrive/Desktop/Dossie-Executivo-Embaixadora-Virtual-Soberana.pdf');
        console.log('Copied to Desktop successfully!');
    } catch(e) {
        console.warn('Desktop copy warning:', e.message);
    }
} else {
    console.error('PDF was not created!');
    process.exit(1);
}
