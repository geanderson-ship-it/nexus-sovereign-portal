const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/locales');
const languages = ['en-US', 'es-ES', 'de-DE', 'fr-FR', 'ja-JP', 'zh-CN', 'ar-AE', 'ru-RU'];

const ptBR = JSON.parse(fs.readFileSync(path.join(localesDir, 'pt-BR.json'), 'utf8'));
const ptBRKeys = Object.keys(ptBR);

languages.forEach(lang => {
  const langPath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(langPath)) return;
  const langRaw = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  
  const missing = ptBRKeys.filter(key => langRaw[key] === undefined);
  console.log(`[${lang}] Missing Keys (${missing.length}):`);
  console.log(missing);
  console.log('--------------------------------------------------');
});
