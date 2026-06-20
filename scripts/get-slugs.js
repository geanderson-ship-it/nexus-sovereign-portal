const fs = require('fs');
const ptBR = JSON.parse(fs.readFileSync('src/lib/locales/pt-BR.json', 'utf8'));
const slugs = new Set();
Object.keys(ptBR).forEach(k => {
  const match = k.match(/^lectures\.scripts\.([^.]+)\./);
  if (match) slugs.add(match[1]);
});
console.log(Array.from(slugs));
