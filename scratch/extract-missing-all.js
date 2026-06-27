const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/locales');
const ptBR = JSON.parse(fs.readFileSync(path.join(localesDir, 'pt-BR.json'), 'utf8'));

const keys = [
  'intelligence.danteBuilder.manifestoTitle',
  'intelligence.danteBuilder.manifestoBody',
  'intelligence.danteBuilder.integrationTitle',
  'intelligence.danteBuilder.integrationBody',
  'intelligence.danteBuilder.subtitle',
  'intelligence.danteBuilder.economy.title',
  'intelligence.danteBuilder.economy.text',
  'intelligence.danteBuilder.aesthetics.title',
  'intelligence.danteBuilder.aesthetics.text',
  'intelligence.danteBuilder.agility.title',
  'intelligence.danteBuilder.agility.text',
  'intelligence.danteBuilder.scalability.title',
  'intelligence.danteBuilder.scalability.text',
  'intelligence.dante-safra.setup.step1',
  'intelligence.dante-safra.setup.step2',
  'intelligence.dante-safra.setup.step3',
  'intelligence.dante-safra.setup.complete',
  'chat.danteSafra.axisTrigger',
  'navSuporte',
  'suporte.title',
  'suporte.subtitle',
  'suporte.dante.title',
  'suporte.dante.description',
  'suporte.dante.cta',
  'suporte.djeny.title',
  'suporte.djeny.description',
  'suporte.djeny.cta',
  'suporte.orion.title',
  'suporte.orion.description',
  'suporte.orion.cta'
];

console.log('--- ALL 30 MISSING KEYS AND PORTUGUESE VALUES ---');
keys.forEach(key => {
  console.log(`"${key}": ${JSON.stringify(ptBR[key])},`);
});
