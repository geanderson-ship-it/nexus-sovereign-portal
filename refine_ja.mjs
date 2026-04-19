import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = 'AIzaSyBIhLdEqCAQ7R7VHUghBir53Qdw1UR52Aw';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const enPath = path.join(__dirname, 'src/lib/locales/en-US.json');
const jaPath = path.join(__dirname, 'src/lib/locales/ja-JP.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

const systemInstruction = `You are a professional localization expert for "Nexus Holding Group". Translate the given JSON values to Japanese (ja-JP). 
The tone must be "Steel and Silk": formal, highly authoritative, respectful, elegant, and corporate elite (Keigo/Teineigo). 
Return ONLY valid JSON matching the input keys. DO NOT return markdown blocks. Just the raw JSON object.`;

async function translateBatch(batchObj) {
    const prompt = systemInstruction + "\n\nTranslate this JSON:\n\n" + JSON.stringify(batchObj, null, 2);
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(responseText);
}

async function run() {
    // 1. Translate Gallery cards priority
    console.log("Translating Gallery Culture cards...");
    if (enData['gallery.culture']) {
        const galleryBatch = { "gallery.culture": enData['gallery.culture'] };
        const translated = await translateBatch(galleryBatch);
        jaData['gallery.culture'] = translated['gallery.culture'];
        console.log("Gallery cards translated.");
    }

    // 2. Identify other keys that are still in English
    const isEnglish = (str) => typeof str === 'string' && /^[A-Za-z0-9\s.,!?'"()-]+$/.test(str) && str.length > 5;
    const keysToRefine = Object.keys(enData).filter(key => {
        if (key === 'gallery.culture') return false;
        // If the value in jaData is identical to enData and it looks like English, it's a fallback
        return jaData[key] === enData[key] && isEnglish(enData[key]);
    });

    console.log(`Found ${keysToRefine.length} more keys to refine.`);

    const BATCH_SIZE = 25;
    for (let i = 0; i < keysToRefine.length; i += BATCH_SIZE) {
        const batchKeys = keysToRefine.slice(i, i + BATCH_SIZE);
        const batchObj = {};
        batchKeys.forEach(k => batchObj[k] = enData[k]);

        console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} / ${Math.ceil(keysToRefine.length / BATCH_SIZE)}...`);
        try {
            const translatedBatch = await translateBatch(batchObj);
            batchKeys.forEach(k => {
                if (translatedBatch[k]) jaData[k] = translatedBatch[k];
            });
            fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
        } catch (e) {
            console.error("Batch error:", e.message);
        }
    }

    // FINAL MERGE to ensure order
    const finalJa = {};
    Object.keys(enData).forEach(key => {
        finalJa[key] = jaData[key] || enData[key];
    });
    fs.writeFileSync(jaPath, JSON.stringify(finalJa, null, 2), 'utf8');
    console.log("Japanese localization refinement complete.");
}

run();
