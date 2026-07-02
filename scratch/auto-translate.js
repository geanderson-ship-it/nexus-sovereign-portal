const fs = require('fs');
const translate = require('translate-google');
const path = require('path');

const enPath = path.join(__dirname, 'src/lib/locales/en-US.json');
const jaPath = path.join(__dirname, 'src/lib/locales/ja-JP.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const keys = Object.keys(enData);

// Translate in smaller chunks to avoid exceeding URL lengths or hitting limits
const CHUNK_SIZE = 20;

async function run() {
  const finalJa = {};
  
  for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
    const chunkKeys = keys.slice(i, i + CHUNK_SIZE);
    
    // We create an object with just the keys from this chunk
    let chunkObj = {};
    for (const k of chunkKeys) {
      if (typeof enData[k] === 'string' && enData[k].trim() !== '') {
        chunkObj[k] = enData[k];
      } else {
        // arrays or empty strings
        finalJa[k] = enData[k];
      }
    }
    
    const chunkKeysToTranslate = Object.keys(chunkObj);
    if(chunkKeysToTranslate.length === 0) continue;

    console.log(`Translating chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(keys.length / CHUNK_SIZE)}...`);
    
    try {
      const res = await translate(chunkObj, {to: 'ja'});
      
      for (const k in res) {
        finalJa[k] = res[k];
      }
      
      // Save progress
      fs.writeFileSync(jaPath, JSON.stringify(finalJa, null, 2), 'utf8');
      
      // Wait a bit to prevent rate limiting
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`Error on chunk ${i}:`, err.message || err);
      // Fallback
      for (const k in chunkObj) {
        finalJa[k] = chunkObj[k];
      }
    }
  }
  
  // Fill any remaining holes
  for (const k in enData) {
    if (!finalJa[k]) finalJa[k] = enData[k];
  }
  
  fs.writeFileSync(jaPath, JSON.stringify(finalJa, null, 2), 'utf8');
  console.log("Translation process finished and saved!");
}

run();
