const fs = require('fs');

// 1. Modify text-to-speech-flow.ts to increase Djeny's speed
let ttsFlow = fs.readFileSync('src/ai/flows/text-to-speech-flow.ts', 'utf8');
ttsFlow = ttsFlow.replace(
    "speed: 1.0,",
    "speed: isDjeny ? 1.15 : 1.0,"
);
fs.writeFileSync('src/ai/flows/text-to-speech-flow.ts', ttsFlow, 'utf8');

// 2. Modify use-nexus-audio.ts to extract preprocessing and add preloadAudio
let audioHook = fs.readFileSync('src/hooks/use-nexus-audio.ts', 'utf8');

const preprocessLogic = `
export function preprocessAudioText(text: string): string {
    let processedText = text?.trim() || '';
    if (!processedText) return '';

    processedText = processedText.replace(/\\b(Jean|Gean)\\b/gi, 'Gian');
    processedText = processedText.replace(/\\bNexus\\b/gi, 'Nécsus');
    processedText = processedText.replace(/\\b(Djeny|Djenny|Djeni|Dieny)\\b/gi, 'Diêni');
    processedText = processedText.replace(/o\\(a\\)/gi, 'o');
    processedText = processedText.replace(/a\\(o\\)/gi, 'a');
    processedText = processedText.replace(/\\b(rs|sc|pr|sp|rj|mg|go|mt|ms|ba|pe|ce|rn|pb|al|se|ma|pi|pa|am|ac|ro|rr|ap|to|df)\\b/gi, '');
    processedText = processedText.replace(/\\*\\*/g, '');
    processedText = processedText.replace(/\\*/g, '');
    processedText = processedText.replace(/__/g, '');
    processedText = processedText.replace(/_/g, '');
    processedText = processedText.replace(/#/g, '');
    processedText = processedText.replace(/\`+/g, '');
    processedText = processedText.replace(/[\\[\\]]/g, '');
    processedText = processedText.replace(/\\.{2,}/g, '. ');
    processedText = processedText.replace(/:/g, ', ');
    processedText = processedText.replace(/;/g, ', ');
    processedText = processedText.replace(/[\\(\\)]/g, '');
    processedText = processedText.replace(/[\\u{1F300}-\\u{1F9FF}]/gu, '');
    processedText = processedText.replace(/[\\u{1F600}-\\u{1F64F}]/gu, '');
    processedText = processedText.replace(/[\\u{2700}-\\u{27BF}]/gu, '');
    processedText = processedText.replace(/[\\u{1F680}-\\u{1F6FF}]/gu, '');
    processedText = processedText.replace(/[\\u{2600}-\\u{26FF}]/gu, '');
    processedText = processedText.replace(/[\\u{1F1E0}-\\u{1F1FF}]/gu, '');
    return processedText.replace(/\\s+/g, ' ').trim();
}

export async function preloadAudio(text: string, voice: string, locale: string) {
    const processedText = preprocessAudioText(text);
    if (!processedText) return;
    const cacheKey = getCacheKey(processedText, voice, locale);
    if (audioCache.has(cacheKey)) return;
    try {
        const audioData = await textToSpeech({ text: processedText, voice, locale });
        audioCache.set(cacheKey, audioData);
    } catch (e) {
        console.warn("Preload falhou silenciosamente", e);
    }
}
`;

audioHook = audioHook.replace(
    /function getCacheKey.*\n.*return.*\n}/,
    match => match + '\n\n' + preprocessLogic
);

const oldProcessingStart = audioHook.indexOf('let processedText = text?.trim();');
const oldProcessingEnd = audioHook.indexOf('const newAbortController = new AbortController();');

if (oldProcessingStart !== -1 && oldProcessingEnd !== -1) {
    const toReplace = audioHook.substring(oldProcessingStart, oldProcessingEnd);
    audioHook = audioHook.replace(toReplace, 'const processedText = preprocessAudioText(text);\n        if (!processedText) {\n            onEnded?.();\n            return;\n        }\n\n        ');
}
fs.writeFileSync('src/hooks/use-nexus-audio.ts', audioHook, 'utf8');

// 3. Modify client-page.tsx to call preloadAudio
let clientPage = fs.readFileSync('src/app/palestras/[slug]/preview/client-page.tsx', 'utf8');

if (!clientPage.includes('preloadAudio')) {
    clientPage = clientPage.replace(
        "const { t } = useLocale();",
        "const { t, locale } = useLocale();"
    );
    
    clientPage = clientPage.replace(
        "import { useNexusAudio } from '@/hooks/use-nexus-audio';",
        "import { useNexusAudio, preloadAudio } from '@/hooks/use-nexus-audio';"
    );
    
    const preloadCall = `
        // Pre-fetch o próximo áudio para eliminar delay (zero gap)
        const nextTrack = lectureScript[index + 1];
        if (nextTrack && nextTrack.text) {
            preloadAudio(t(nextTrack.text as any), nextTrack.speaker as string, locale);
        }

        playAudio({`;
        
    clientPage = clientPage.replace("playAudio({", preloadCall);
    fs.writeFileSync('src/app/palestras/[slug]/preview/client-page.tsx', clientPage, 'utf8');
}

console.log("Audio gap fix and Djeny speed applied.");
