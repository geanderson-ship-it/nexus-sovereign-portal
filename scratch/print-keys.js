const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/locales');
const ptBR = JSON.parse(fs.readFileSync(path.join(localesDir, 'pt-BR.json'), 'utf8'));

console.log('Keys in pt-BR under "intelligence":');
if (ptBR.intelligence) {
  console.log(Object.keys(ptBR.intelligence));
} else {
  console.log('No "intelligence" key in pt-BR!');
}
