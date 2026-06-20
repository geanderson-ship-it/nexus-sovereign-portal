import { generate } from '@genkit-ai/ai';
import fs from 'fs';

const envLocal = fs.readFileSync('.env.local', 'utf8');
envLocal.split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
});

import { ai, NEXUS_MODEL } from '../src/ai/genkit.ts';

const localesDir = './src/lib/locales';
const ptBRPath = `${localesDir}/pt-BR.json`;
const ptBR = JSON.parse(fs.readFileSync(ptBRPath, 'utf8'));

const targetLangs = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish (ES)' },
    { code: 'de-DE', name: 'German' },
    { code: 'fr-FR', name: 'French' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'zh-CN', name: 'Simplified Chinese' },
    { code: 'ar-AE', name: 'Arabic' },
    { code: 'ru-RU', name: 'Russian' }
];

const targetLectures = [
    'lideranca-humanizada',
    'comunicacao-que-conecta',
    'motivacao-e-engajamento',
    'inteligencia-emocional',
    'seguranca-psicologica',
    'cultura-de-alta-performance',
    'gestao-de-conflitos'
];

async function translateChunk(chunk: Record<string, string>, langInfo: { code: string, name: string }): Promise<Record<string, string> | null> {
    const prompt = `Você é um tradutor premium de Elite B2B. 
Traduza os valores do seguinte JSON do Português para ${langInfo.name}.
Mantenha as chaves EXATAMENTE iguais. Retorne apenas o JSON.
Não inclua explicações, comece diretamente com { e termine com }.

JSON:
${JSON.stringify(chunk, null, 2)}`;

    try {
        const response = await ai.generate({
            model: NEXUS_MODEL,
            messages: [{ role: 'user', content: [{ text: prompt }] }],
            config: { temperature: 0.1, maxOutputTokens: 8192 }
        });
        const match = response.text.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
    } catch (e) {
        console.error(`Chunk error for ${langInfo.code}:`, e);
    }
    return null;
}

async function translateLecture(lectureSlug: string, langInfo: { code: string, name: string }) {
    const lectureKeyPrefix = `lectures.scripts.${lectureSlug}`;
    const lectureKeys = Object.keys(ptBR).filter(k => k.startsWith(lectureKeyPrefix));
    
    const langPath = `${localesDir}/${langInfo.code}.json`;
    let langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));

    // Check which keys need translation (missing or equal to ptBR)
    const missingKeys: Record<string, string> = {};
    lectureKeys.forEach(k => {
        if (!langData[k] || langData[k] === ptBR[k]) {
            missingKeys[k] = ptBR[k];
        }
    });

    const keysToTranslate = Object.keys(missingKeys);
    if (keysToTranslate.length === 0) {
        console.log(`✅ ${langInfo.code} - ${lectureSlug} already translated!`);
        return;
    }

    console.log(`Translating ${keysToTranslate.length} keys of ${lectureSlug} to ${langInfo.code}...`);

    // Split into chunks of 15 keys
    const CHUNK_SIZE = 15;
    for (let i = 0; i < keysToTranslate.length; i += CHUNK_SIZE) {
        const chunkKeys = keysToTranslate.slice(i, i + CHUNK_SIZE);
        const chunk: Record<string, string> = {};
        chunkKeys.forEach(k => chunk[k] = missingKeys[k]);

        console.log(`  -> Processing chunk ${Math.floor(i/CHUNK_SIZE)+1} for ${langInfo.code}...`);
        
        // Retry logic for chunk
        let translatedChunk = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            translatedChunk = await translateChunk(chunk, langInfo);
            if (translatedChunk) break;
            console.log(`     Retry ${attempt} failed, retrying...`);
            await new Promise(r => setTimeout(r, 2000));
        }

        if (translatedChunk) {
            langData = { ...langData, ...translatedChunk };
            fs.writeFileSync(langPath, JSON.stringify(langData, null, 2));
        } else {
            console.error(`❌ Failed to translate chunk for ${langInfo.code}`);
        }
    }
}

async function run() {
    for (const lecture of targetLectures) {
        for (const lang of targetLangs) {
            await translateLecture(lecture, lang);
        }
    }
    console.log("Lecture batch translation completed!");
}

run();
