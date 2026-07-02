const fs = require('fs');
let audioHook = fs.readFileSync('src/hooks/use-nexus-audio.ts', 'utf8');

// Insert after getCacheKey
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

// Safely split at export function useNexusAudio
const parts = audioHook.split('export function useNexusAudio() {');
if (parts.length === 2) {
    audioHook = parts[0] + preprocessLogic + '\\nexport function useNexusAudio() {' + parts[1];
}

// Replace the inline processing logic
const oldProcessingStart = audioHook.indexOf('let processedText = text?.trim();');
const oldProcessingEnd = audioHook.indexOf('const newAbortController = new AbortController();');

if (oldProcessingStart !== -1 && oldProcessingEnd !== -1) {
    const toReplace = audioHook.substring(oldProcessingStart, oldProcessingEnd);
    audioHook = audioHook.replace(toReplace, 'const processedText = preprocessAudioText(text);\\n        if (!processedText) {\\n            onEnded?.();\\n            return;\\n        }\\n\\n        ');
}

fs.writeFileSync('src/hooks/use-nexus-audio.ts', audioHook, 'utf8');
console.log("Fix aplicado em use-nexus-audio.ts");
