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

// Extract interface keys only
const ptInterfaceKeys = Object.keys(ptBR).filter(k => !k.startsWith('lectures.scripts.'));

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

async function translateMissingKeys(langInfo: { code: string, name: string }) {
    console.log(`Processing ${langInfo.name} (${langInfo.code})...`);
    
    const langPath = `${localesDir}/${langInfo.code}.json`;
    let langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    
    // Find missing keys
    const missingKeys: Record<string, string> = {};
    ptInterfaceKeys.forEach(k => {
        if (!langData[k]) {
            missingKeys[k] = ptBR[k];
        }
    });
    
    const missingCount = Object.keys(missingKeys).length;
    if (missingCount === 0) {
        console.log(`✅ No missing interface keys for ${langInfo.code}.`);
        return;
    }
    
    console.log(`Found ${missingCount} missing keys. Translating...`);
    
    const prompt = `Você é um tradutor premium focado em negócios B2B, tecnologia de ponta e desenvolvimento humano (estilo C-level, Sovereign).
Você está traduzindo termos de interface de usuário (UI) de um portal corporativo de alto nível chamado "Nexus Holding Group" do Português (Brasil) para o idioma: ${langInfo.name}.

O tom deve ser: Profissional, assertivo, premium e sem jargões baratos. 

Abaixo está um objeto JSON contendo chaves e valores em português. 
Sua tarefa é retornar o MESMO objeto JSON, mantendo as chaves exatas, mas traduzindo apenas os valores para ${langInfo.name}.

JSON para traduzir:
${JSON.stringify(missingKeys, null, 2)}

IMPORTANTE: 
- Retorne APENAS um JSON válido. 
- NÃO mude as chaves (o texto à esquerda dos dois pontos).
- NÃO adicione markdown \`\`\`json em volta, retorne apenas as chaves (eu farei o parse direto).`;

    try {
        const response = await ai.generate({
            model: NEXUS_MODEL,
            messages: [{ role: 'user', content: [{ text: prompt }] }],
            config: {
                temperature: 0.1,
                maxOutputTokens: 8192
            }
        });

        const responseText = response.text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("JSON not found in response");
        
        const translatedData = JSON.parse(jsonMatch[0]);
        
        // Merge
        langData = { ...langData, ...translatedData };
        fs.writeFileSync(langPath, JSON.stringify(langData, null, 2));
        console.log(`✅ ${langInfo.code} translation completed and saved!`);
        
    } catch (e) {
        console.error(`❌ Failed to translate for ${langInfo.code}:`, e);
    }
}

async function run() {
    for (const lang of targetLangs) {
        await translateMissingKeys(lang);
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("All UI translations completed!");
}

run();
