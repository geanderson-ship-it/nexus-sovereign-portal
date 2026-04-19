const fs = require('fs');

const pt = JSON.parse(fs.readFileSync('./src/lib/locales/pt-BR.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('./src/lib/locales/fr-FR.json', 'utf8'));

const ptKeys = Object.keys(pt);
const frKeys = Object.keys(fr);

const missingInFr = ptKeys.filter(key => !frKeys.includes(key));
const identicalValues = ptKeys.filter(key => frKeys.includes(key) && pt[key] === fr[key] && typeof pt[key] === 'string' && pt[key].length > 10);

console.log('Missing in FR:', missingInFr.length);
console.log(missingInFr);

console.log('\nIdentical values (potential untranslated):', identicalValues.length);
identicalValues.forEach(key => {
    console.log(`Key: ${key}`);
    console.log(`PT: ${pt[key]}`);
    console.log('---');
});
