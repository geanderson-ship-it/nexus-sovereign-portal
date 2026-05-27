const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/locales');
const ptBR = JSON.parse(fs.readFileSync(path.join(localesDir, 'pt-BR.json'), 'utf8'));

// List of all keys that are missing in other languages
const missingKeysList = [
  "intelligence.danteBuilder.manifestoTitle",
  "intelligence.danteBuilder.manifestoBody",
  "intelligence.danteBuilder.integrationTitle",
  "intelligence.danteBuilder.integrationBody",
  "intelligence.danteBuilder.subtitle",
  "intelligence.danteBuilder.economy.title",
  "intelligence.danteBuilder.economy.text",
  "intelligence.danteBuilder.aesthetics.title",
  "intelligence.danteBuilder.aesthetics.text",
  "intelligence.danteBuilder.agility.title",
  "intelligence.danteBuilder.agility.text",
  "intelligence.danteBuilder.scalability.title",
  "intelligence.danteBuilder.scalability.text",
  "intelligence.dante-safra.setup.step1",
  "intelligence.dante-safra.setup.step2",
  "intelligence.dante-safra.setup.step3",
  "intelligence.dante-safra.setup.complete",
  "navSuporte",
  "suporte.title"
];

console.log('--- ORIGINAL PORTUGUESE VALUES FOR MISSING KEYS ---');
missingKeysList.forEach(key => {
  const value = ptBR[key];
  console.log(`Key: "${key}"`);
  console.log(`Value: "${value}"`);
  console.log('--------------------------------------------------');
});
