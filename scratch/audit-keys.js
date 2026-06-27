const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/locales');
const languages = [
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'ja-JP', name: 'Japanese (Japan)' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ar-AE', name: 'Arabic (UAE)' },
  { code: 'ru-RU', name: 'Russian (Russia)' }
];

// Helper to flatten a nested object to dot notation keys
function flattenObject(obj, prefix = '') {
  let entries = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(entries, flattenObject(obj[key], fullKey));
      } else {
        entries[fullKey] = obj[key];
      }
    }
  }
  return entries;
}

console.log('--- NEXUS LOCALIZATION DEEP AUDIT ---');

try {
  // Load Portuguese as source of truth
  const ptBRPath = path.join(localesDir, 'pt-BR.json');
  const ptBRRaw = JSON.parse(fs.readFileSync(ptBRPath, 'utf8'));
  const ptBRFlattened = flattenObject(ptBRRaw);
  const ptBRKeys = Object.keys(ptBRFlattened);

  console.log(`Source of Truth (pt-BR): ${ptBRKeys.length} total translation keys.\n`);

  const auditReport = {};

  languages.forEach((lang) => {
    if (lang.code === 'pt-BR') return; // Skip source of truth itself

    const langPath = path.join(localesDir, `${lang.code}.json`);
    if (!fs.existsSync(langPath)) {
      console.log(`[WARNING] File missing for ${lang.name} (${lang.code}.json)`);
      return;
    }

    const langRaw = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const langFlattened = flattenObject(langRaw);
    const langKeys = Object.keys(langFlattened);

    const missingKeys = [];
    const untranslatedKeys = []; // identical to Portuguese value but are sentences/UI labels

    ptBRKeys.forEach((key) => {
      if (langFlattened[key] === undefined) {
        missingKeys.push(key);
      } else {
        const ptVal = ptBRFlattened[key];
        const langVal = langFlattened[key];

        // Check if value is identical to Portuguese and is likely a text string (not an ID or number or code)
        if (
          ptVal === langVal &&
          typeof ptVal === 'string' &&
          ptVal.trim().length > 3 &&
          /[a-zA-Záàâãéèêíïóôõöúç]/.test(ptVal) &&
          !key.includes('href') &&
          !key.includes('slug') &&
          !key.includes('logo') &&
          !key.includes('image')
        ) {
          untranslatedKeys.push({ key, value: ptVal });
        }
      }
    });

    const extraKeys = langKeys.filter(key => ptBRFlattened[key] === undefined);

    auditReport[lang.code] = {
      name: lang.name,
      totalKeys: langKeys.length,
      missingCount: missingKeys.length,
      missingKeys: missingKeys.slice(0, 15), // Show first 15 for brevity in summary
      untranslatedCount: untranslatedKeys.length,
      untranslatedKeys: untranslatedKeys.slice(0, 15),
      extraCount: extraKeys.length,
      extraKeys: extraKeys.slice(0, 15)
    };

    console.log(`[${lang.code}] ${lang.name}:`);
    console.log(`  - Total Keys: ${langKeys.length}`);
    console.log(`  - Missing Keys: ${missingKeys.length}`);
    console.log(`  - Potential Untranslated PT Strings: ${untranslatedKeys.length}`);
    console.log(`  - Extra Keys: ${extraKeys.length}`);
    console.log('');
  });

  // Write detailed report to scratch
  fs.writeFileSync(
    path.join(__dirname, 'audit_report.json'),
    JSON.stringify(auditReport, null, 2),
    'utf8'
  );
  console.log('Detailed audit report written to scratch/audit_report.json');

} catch (err) {
  console.error('Audit failed:', err);
}
