const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/locales');
const ptBR = JSON.parse(fs.readFileSync(path.join(localesDir, 'pt-BR.json'), 'utf8'));

console.log('Top-level keys in pt-BR.json:');
console.log(Object.keys(ptBR).slice(0, 30));
console.log(`Total top-level keys: ${Object.keys(ptBR).length}`);
