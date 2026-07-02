import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = 'AIzaSyBIhLdEqCAQ7R7VHUghBir53Qdw1UR52Aw';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const localesPath = path.join(__dirname, 'src/lib/locales');
const enPath = path.join(localesPath, 'en-US.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

async function translateBatch(lang, langName, batchObj) {
    const systemInstruction = `You are a professional localization expert for "Nexus Holding Group". 
Translate the given JSON values to ${langName} (${lang}). 
The tone must be "Steel and Silk": formal, highly authoritative, respectful, elegant, and corporate elite. 
Nexus is an AI and Leadership company led by Commander Geanderson. 
Return ONLY valid JSON matching the input keys. DO NOT return markdown blocks. Just the raw JSON object.`;

    const prompt = systemInstruction + `\n\nTranslate this JSON into ${langName}:\n\n` + JSON.stringify(batchObj, null, 2);
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    // Sometimes it might wrap in quotes or something
    if (responseText.startsWith('"') && responseText.endsWith('"')) {
        responseText = responseText.substring(1, responseText.length - 1);
    }
    return JSON.parse(responseText);
}

async function refineLocale(lang, langName) {
    const filePath = path.join(localesPath, `${lang}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Identify keys to refine
    const keysToRefine = Object.keys(enData).filter(key => {
        // If it's the SAME as English and English is a UI string, refine it
        // Or if it's special case like gallery.culture which might be partially translated
        const isUntranslated = data[key] === enData[key] || !data[key];
        const isUIString = typeof enData[key] === 'string' && enData[key].length > 3;
        const isArray = Array.isArray(enData[key]);
        
        return (isUntranslated && (isUIString || isArray)) || key.startsWith('palestras.detail');
    });

    console.log(`Found ${keysToRefine.length} keys to refine in ${langName}.`);

    const BATCH_SIZE = 20;
    for (let i = 0; i < keysToRefine.length; i += BATCH_SIZE) {
        const batchKeys = keysToRefine.slice(i, i + BATCH_SIZE);
        const batchObj = {};
        batchKeys.forEach(k => batchObj[k] = enData[k]);

        console.log(`Processing ${langName} batch ${Math.floor(i/BATCH_SIZE) + 1} / ${Math.ceil(keysToRefine.length / BATCH_SIZE)}...`);
        try {
            const translatedBatch = await translateBatch(lang, langName, batchObj);
            batchKeys.forEach(k => {
                if (translatedBatch[k]) data[k] = translatedBatch[k];
            });
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (e) {
            console.error(`Batch error in ${langName}:`, e.message);
        }
    }
    
    // Ensure all keys from EN are present
    const finalData = {};
    Object.keys(enData).forEach(key => {
        finalData[key] = data[key] || enData[key];
    });
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2), 'utf8');
    console.log(`${langName} localization refinement complete.`);
}

async function run() {
    await refineLocale('zh-CN', 'Simplified Chinese');
    await refineLocale('ar-AE', 'Arabic');
}

run();
