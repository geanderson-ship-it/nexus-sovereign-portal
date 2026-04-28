
import { textToSpeech } from './src/ai/flows/text-to-speech-flow';

async function test() {
  try {
    console.log('Testing textToSpeech...');
    const result = await textToSpeech({
      text: 'Olá, isto é um teste do protocolo de áudio Nexus.',
      voice: 'dante',
      locale: 'pt-BR'
    });
    console.log('Success! Audio length:', result.audioDataUri.length);
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

test();
