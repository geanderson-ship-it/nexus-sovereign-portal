const fs = require('fs');
const file = 'src/lib/locales/ja-JP.json';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
console.log("LAST 50 LINES:");
console.log(lines.slice(-50).join('\n'));
try {
  JSON.parse(content);
  console.log("JSON IS VALID");
} catch(e) {
  console.log("JSON ERROR:", e.message);
}
