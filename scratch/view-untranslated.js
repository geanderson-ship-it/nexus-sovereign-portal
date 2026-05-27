const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, 'audit_report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

console.log('--- POTENTIAL UNTRANSLATED KEYS IN en-US (FIRST 50) ---');
if (report['en-US'] && report['en-US'].untranslatedKeys) {
  report['en-US'].untranslatedKeys.forEach((item, index) => {
    console.log(`${index + 1}. Key: "${item.key}"`);
    console.log(`   Value: "${item.value}"`);
    console.log('---');
  });
}
