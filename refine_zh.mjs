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
const zhPath = path.join(__dirname, 'src/lib/locales/zh-CN.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));

const systemInstruction = `You are a professional localization expert for "Nexus Holding Group". Translate the given JSON values to Simplified Chinese (zh-CN). 
The tone must be "Steel and Silk": formal, highly authoritative, respectful, elegant, and corporate elite. 
Return ONLY valid JSON matching the input keys. DO NOT return markdown blocks. Just the raw JSON object.`;

async function translateBatch(batchObj) {
    const prompt = systemInstruction + "\n\nTranslate this JSON into Simplified Chinese:\n\n" + JSON.stringify(batchObj, null, 2);
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(responseText);
}

async function run() {
    // 1. Translate Gallery cards priority
    console.log("Translating Chinese Gallery Culture cards...");
    if (enData['gallery.culture']) {
        const galleryBatch = { "gallery.culture": enData['gallery.culture'] };
        const translated = await translateBatch(galleryBatch);
        zhData['gallery.culture'] = translated['gallery.culture'];
        console.log("Chinese Gallery cards translated.");
    }

    // 2. Identify other keys that are still in English
    const isEnglish = (str) => typeof str === 'string' && /^[A-Za-z0-9\s.,!?'"()-]+$/.test(str) && str.length > 5;
    const keysToRefine = Object.keys(enData).filter(key => {
        if (key === 'gallery.culture') return false;
        return zhData[key] === enData[key] && isEnglish(enData[key]);
    });

    console.log(`Found ${keysToRefine.length} more keys to refine in Chinese.`);

    const BATCH_SIZE = 25;
    for (let i = 0; i < keysToRefine.length; i += BATCH_SIZE) {
        const batchKeys = keysToRefine.slice(i, i + BATCH_SIZE);
        const batchObj = {};
        batchKeys.forEach(k => batchObj[k] = enData[k]);

        console.log(`Processing Chinese batch ${Math.floor(i/BATCH_SIZE) + 1} / ${Math.ceil(keysToRefine.length / BATCH_SIZE)}...`);
        try {
            const translatedBatch = await translateBatch(batchObj);
            batchKeys.forEach(k => {
                if (translatedBatch[k]) zhData[k] = translatedBatch[k];
            });
            fs.writeFileSync(zhPath, JSON.stringify(zhData, null, 2), 'utf8');
        } catch (e) {
            console.error("Batch error:", e.message);
        }
    }

    // FINAL MERGE to ensure order
    const finalZh = {};
    Object.keys(enData).forEach(key => {
        finalZh[key] = zhData[key] || enData[key];
    });
    fs.writeFileSync(zhPath, JSON.stringify(finalZh, null, 2), 'utf8');
    console.log("Chinese localization refinement complete.");
}

run();
