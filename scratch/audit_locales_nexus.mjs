import fs from 'fs';
import path from 'path';

const localesPath = 'src/lib/locales';
const ptBR = JSON.parse(fs.readFileSync(path.join(localesPath, 'pt-BR.json'), 'utf-8'));
const enUS = JSON.parse(fs.readFileSync(path.join(localesPath, 'en-US.json'), 'utf-8'));

function getUntranslated(lang) {
    const data = JSON.parse(fs.readFileSync(path.join(localesPath, `${lang}.json`), 'utf-8'));
    const untranslated = [];
    
    for (const key in ptBR) {
        const val = data[key];
        const enVal = enUS[key];
        
        // If value is missing, or matches English, or matches Portuguese, it needs refinement
        // Except for keys that are meant to be English (like names or specific IDs)
        if (!val || val === ptBR[key] || val === enVal) {
            // Check if English value actually looks like a sentence/UI string
            if (typeof enVal === 'string' && enVal.length > 3 && /[a-zA-Z]/.test(enVal)) {
                 untranslated.push(key);
            }
        }
    }
    return untranslated;
}

const zhMissing = getUntranslated('zh-CN');
const arMissing = getUntranslated('ar-AE');

console.log(`Chinese missing/english keys: ${zhMissing.length}`);
console.log(`Arabic missing/english keys: ${arMissing.length}`);

fs.writeFileSync('missing_keys_nexus.json', JSON.stringify({ 'zh-CN': zhMissing, 'ar-AE': arMissing }, null, 2));
