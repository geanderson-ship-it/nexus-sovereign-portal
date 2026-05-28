import fs from 'fs';
import path from 'path';

// Load .env.local manually for the standalone test script
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key) {
          const val = values.join('=').trim();
          process.env[key.trim()] = val;
        }
      }
    });
  }
} catch (e) {
  console.error('Failed to load .env.local manually', e);
}

import { textToSpeech } from './src/ai/flows/text-to-speech-flow';

async function test() {
  try {
    console.log('Testing textToSpeech...');
    console.log('Checking env keys:', {
      hasApiKey: !!process.env.ELEVENLABS_API_KEY,
      hasVoiceId: !!process.env.DANTE_ELEVENLABS_VOICE_ID,
    });
    const result = await textToSpeech({
      text: 'Olá, isto é um teste do protocolo de áudio Nexus.',
      voice: 'dante',
      locale: 'pt-BR'
    });
    console.log('Success! Audio length:', result.audioDataUri.length);
  } catch (error: any) {
    console.error('Test failed:', error.message);
  }
}

test();

