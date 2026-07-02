import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = 'AIzaSyBIhLdEqCAQ7R7VHUghBir53Qdw1UR52Aw';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const keysToTranslate = [
    "intelligence.djenyGallery.item1.title",
    "intelligence.djenyGallery.item1.category",
    "intelligence.djenyGallery.item2.title",
    "intelligence.djenyGallery.item2.category",
    "intelligence.djenyGallery.item3.title",
    "intelligence.djenyGallery.item3.category",
    "intelligence.djenyGallery.item4.title",
    "intelligence.djenyGallery.item4.category",
    "intelligence.djenyGallery.sectionTitle",
    "intelligence.djenyDesign.personal.price",
    "intelligence.djenyDesign.personal.cta.access",
    "intelligence.djenyDesign.business.price"
];

const ptPath = 'src/lib/locales/pt-BR.json';
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

const batchObj = {};
keysToTranslate.forEach(k => batchObj[k] = ptData[k]);

async function translateFor(langCode, countryCode) {
    const targetFile = `src/lib/locales/${langCode}-${countryCode}.json`;
    console.log(`Translating for ${targetFile}...`);
    
    const systemInstruction = `You are a professional localization expert for "Nexus Holding Group". Translate the given JSON values to ${langCode} (${countryCode}). 
The tone must be "Steel and Silk": formal, highly authoritative, respectful, elegant, and corporate elite. 
For prices, keep the currency format but translate labels if needed (e.g., / month).
Return ONLY valid JSON matching the input keys.`;

    const prompt = systemInstruction + "\n\nTranslate this JSON:\n\n" + JSON.stringify(batchObj, null, 2);
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const translatedBatch = JSON.parse(responseText);
    const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    
    Object.keys(translatedBatch).forEach(k => {
        targetData[k] = translatedBatch[k];
    });
    
    fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2), 'utf8');
}

async function run() {
    await translateFor('ja', 'JP');
    await translateFor('zh', 'CN');
    console.log("Translation of new Intelligence keys complete.");
}

run();
