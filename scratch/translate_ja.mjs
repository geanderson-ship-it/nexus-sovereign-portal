import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBIhLdEqCAQ7R7VHUghBir53Qdw1UR52Aw'; // fallback to the one found
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: 0.1 } });

const enPath = path.join(__dirname, 'src/lib/locales/en-US.json');
const jaPath = path.join(__dirname, 'src/lib/locales/ja-JP.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Try loading existing partially translated ja-JP.json so we don't start from scratch if there's anything
let jaData = {};
// We know it fell back to english previously, so we'll just retranslate everything, 
// unless we check if it contains actual japanese characters.
const isJapanese = (str) => /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(str);

const jaRaw = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
for (const key in jaRaw) {
    if (isJapanese(jaRaw[key]) || key === "footerRights") {
        jaData[key] = jaRaw[key];
    }
}

const keysToTranslate = Object.keys(enData).filter(k => !jaData[k] && typeof enData[k] === 'string');

console.log(`Need to translate ${keysToTranslate.length} keys.`);

const BATCH_SIZE = 40;
const systemInstruction = `You are a professional localization expert for "Nexus Holding Group". Translate the given JSON values to Japanese (ja-JP). 
The tone must be "Steel and Silk": formal, highly authoritative, respectful, elegant, and corporate elite (Keigo/Teineigo where appropriate). 
Return ONLY valid JSON matching the input keys. DO NOT return markdown blocks (\`\`\`json). Just the raw JSON object.`;

async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function startTranslation() {
    for (let i = 0; i < keysToTranslate.length; i += BATCH_SIZE) {
        const batchKeys = keysToTranslate.slice(i, i + BATCH_SIZE);
        const batchObj = {};
        for (const k of batchKeys) {
            batchObj[k] = enData[k];
        }
        
        console.log(`Translating batch ${i/BATCH_SIZE + 1} / ${Math.ceil(keysToTranslate.length / BATCH_SIZE)}...`);
        
        const prompt = systemInstruction + "\n\nTranslate this JSON:\n\n" + JSON.stringify(batchObj, null, 2);
        
        try {
            const result = await model.generateContent(prompt);
            let responseText = result.response.text();
            
            // Clean up backticks if model ignored instruction
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const translatedBatch = JSON.parse(responseText);
            
            for (const k of batchKeys) {
                if (translatedBatch[k]) {
                    jaData[k] = translatedBatch[k];
                }
            }
            
            // Save incrementally
            fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2));
            console.log("Saved batch.");
            
            await delay(2000); // Wait 2 seconds between requests
            
        } catch (e) {
            console.error("Error on batch:", e.message);
            // Retrying once
            await delay(5000);
            i -= BATCH_SIZE; 
        }
    }
    
    // Merge everything in order of enObj
    const finalJa = {};
    for (const key in enData) {
        finalJa[key] = jaData[key] || enData[key];
    }
    
    fs.writeFileSync(jaPath, JSON.stringify(finalJa, null, 2));
    console.log("Translation complete!");
}

startTranslation();
