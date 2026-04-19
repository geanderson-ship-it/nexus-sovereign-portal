
'use server';
/**
 * @fileOverview Converts text to speech using a cloud-based AI model.
 *
 * - textToSpeech - a function that takes text and a voice profile and returns a WAV audio data URI and speech marks.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { TextToSpeechInput, TextToSpeechInputSchema, TextToSpeechOutput, TextToSpeechOutputSchema, SpeechMark } from './text-to-speech-types';

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  // Dynamic import to ensure 'wav' is only ever loaded on the server.
  const wav = await import('wav');
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Function to split text into chunks without breaking sentences, respecting a character limit.
function splitIntoChunks(text: string, maxLength: number): string[] {
    if (!text) return [];

    const chunks: string[] = [];
    // Split the text into sentences. The regex includes the delimiter in the result.
    const sentences = text.match(/[^.!?\n]+[.!?\n]*\s*/g) || [text];

    let currentChunk = "";

    for (const sentence of sentences) {
        // Case 1: The sentence itself is longer than the max length.
        if (sentence.length > maxLength) {
            // If there's anything in currentChunk, push it first.
            if (currentChunk.length > 0) {
                chunks.push(currentChunk);
            }
            currentChunk = ""; // Reset chunk

            // Now, split the oversized sentence.
            let tempSentence = sentence;
            while (tempSentence.length > maxLength) {
                // Find the last space before the maxLength to avoid breaking words.
                let splitPos = tempSentence.lastIndexOf(' ', maxLength);
                // If no space is found, we have to hard-cut the word.
                if (splitPos === -1) {
                    splitPos = maxLength;
                }
                chunks.push(tempSentence.substring(0, splitPos));
                tempSentence = tempSentence.substring(splitPos).trim();
            }
            // The remainder of the long sentence becomes the new currentChunk.
            currentChunk = tempSentence;
        } 
        // Case 2: The sentence fits, but adding it would exceed the max length.
        else if (currentChunk.length + sentence.length > maxLength) {
            chunks.push(currentChunk);
            currentChunk = sentence;
        } 
        // Case 3: The sentence fits and can be added to the current chunk.
        else {
            currentChunk += sentence;
        }
    }

    // Don't forget the last chunk.
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}


const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, voice, locale }) => {
    const MAX_CHARS = 4500; // Safety margin below the 5000 character limit
    const textChunks = splitIntoChunks(text, MAX_CHARS);

    const modelConfig = {
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO' as const],
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT' as const, threshold: 'BLOCK_NONE' as const },
          { category: 'HARM_CATEGORY_HATE_SPEECH' as const, threshold: 'BLOCK_NONE' as const },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as const, threshold: 'BLOCK_NONE' as const },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as const, threshold: 'BLOCK_NONE' as const },
        ],
        speechConfig: {
          languageCode: locale || 'pt-BR',
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: (voice === 'dante' || voice === 'orion') ? 'zubenelgenubi' : 'autonoe' 
            },
          },
        },
      },
    };

    // Optimization: If there's only one chunk, process it directly without concatenation logic.
    if (textChunks.length === 1) {
      const chunk = textChunks[0];
      if (!chunk.trim()) {
        throw new Error('Nenhum dado de áudio foi gerado para o texto fornecido.');
      }

      const { media } = await ai.generate({
        ...modelConfig,
        prompt: chunk,
      });

      if (!media || !media.url) {
        throw new Error('A resposta do modelo TTS para o pedaço de áudio veio vazia.');
      }

      const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
      const wavBase64 = await toWav(audioBuffer);
      const speechMarks = ((media as any).speechMarks || []).map((mark: any) => ({
        ...mark,
        startOffset: (mark.startOffset || 0) * 1000 // Convert seconds to ms
      }));

      return {
        audioDataUri: 'data:audio/wav;base64,' + wavBase64,
        speechMarks: speechMarks,
      };
    }

    // --- Multi-Chunk Logic for longer texts ---
    const audioBuffers: Buffer[] = [];
    const allSpeechMarks: SpeechMark[] = [];
    let totalDurationMs = 0;

    for (const chunk of textChunks) {
      if (!chunk.trim()) continue;

      const { media } = await ai.generate({
        ...modelConfig,
        prompt: chunk,
      });

      if (!media || !media.url) {
        console.warn("VIX DIAGNOSTIC: Um pedaço de áudio veio vazio do modelo TTS. Pulando.");
        continue;
      }

      const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
      audioBuffers.push(audioBuffer);

      const chunkSpeechMarks = ((media as any).speechMarks || []).map((mark: any) => ({
        ...mark,
        startOffset: (mark.startOffset || 0) * 1000 + totalDurationMs
      }));
      allSpeechMarks.push(...chunkSpeechMarks);

      // Calculate duration of the current PCM chunk to offset the next set of speech marks.
      const sampleRate = 24000;
      const bytesPerSample = 2;
      const channels = 1;
      const numSamples = audioBuffer.length / (bytesPerSample * channels);
      const chunkDurationMs = (numSamples / sampleRate) * 1000;
      totalDurationMs += chunkDurationMs;
    }

    if (audioBuffers.length === 0) {
      throw new Error('Nenhum dado de áudio foi gerado para o texto fornecido.');
    }

    const concatenatedPcm = Buffer.concat(audioBuffers as any);
    const wavBase64 = await toWav(concatenatedPcm);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
      speechMarks: allSpeechMarks,
    };
  }
);


export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    try {
        return await textToSpeechFlow(input);
    } catch(err: any) {
        let telemetryMessage = `INVALID_ARGUMENT: ${err.message}`;
        if (err.message && err.message.includes('429')) {
            telemetryMessage = "Atingimos nosso limite de requisições de áudio. Por favor, aguarde um minuto antes de tentar novamente.";
        } else {
            telemetryMessage = err.message;
        }
        console.error(`VIX DIAGNOSTIC: Falha no processamento de áudio.`, err);
        // Rethrow a more generic error to the client to avoid leaking implementation details
        throw new Error(telemetryMessage);
    }
}
