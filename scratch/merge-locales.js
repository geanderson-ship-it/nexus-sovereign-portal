const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/lib/locales');
const masterFile = path.join(localesDir, 'pt-BR.json');

function merge(langCode, newTranslations = {}) {
  const targetFile = path.join(localesDir, `${langCode}.json`);
  
  if (!fs.existsSync(targetFile)) {
    console.error(`File not found: ${targetFile}`);
    return;
  }

  const master = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
  const target = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

  const result = {};

  // Preserve pt-BR order
  Object.keys(master).forEach(key => {
    if (newTranslations[key]) {
      result[key] = newTranslations[key];
    } else if (target[key]) {
      result[key] = target[key];
    } else {
      // Fallback to master value if missing and not provided
      result[key] = master[key];
    }
  });

  fs.writeFileSync(targetFile, JSON.stringify(result, null, 2), 'utf8');
  console.log(`Successfully merged ${langCode}.json`);
}

// Get args from command line
const lang = process.argv[2];
const translationsPath = process.argv[3];

if (lang && translationsPath) {
  const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  merge(lang, translations);
} else {
  console.log('Usage: node merge-locales.js <lang-code> <path-to-json-with-new-translations>');
}
