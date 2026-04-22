
'use server';
/**
 * @fileOverview Converts text to speech using Amazon Polly.
 *
 * - textToSpeech - a function that takes text and a voice profile and returns an MP3 audio data URI and speech marks.
 */

import { ai } from '@/ai/genkit';
import { 
  TextToSpeechInput, 
  TextToSpeechInputSchema, 
  TextToSpeechOutput, 
  TextToSpeechOutputSchema 
} from './text-to-speech-types';
import { 
  PollyClient, 
  SynthesizeSpeechCommand, 
  Engine, 
  OutputFormat, 
  SpeechMarkType 
} from "@aws-sdk/client-polly";

/**
 * Motor de Fala Nexus v3.0 - Movido pela Amazon Polly
 * Aproveita créditos AWS e oferece vozes Neural ultra-realistas.
 */
const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (input) => {
    const { text, voice, locale } = input;

    // Configuração do Cliente Polly seguindo o protocolo AWS do Nexus
    const pollyConfig: any = {
      region: process.env.AWS_REGION || process.env.AMPLIFY_REGION || 'us-east-1',
    };

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AMPLIFY_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AMPLIFY_SECRET_ACCESS_KEY;

    if (accessKeyId && secretAccessKey) {
      pollyConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    const pollyClient = new PollyClient(pollyConfig);

    // Mapeamento de Vozes Nexus -> AWS Polly (Neural)
    const voiceMapping: Record<string, string> = {
      // Magadot / Djeny
      maga: 'Camila',
      djeny: 'Camila',
      autonoe: 'Camila',
      aoede: 'Camila',
      erinome: 'Camila',
      
      // Orion
      orion: 'Ricardo',
      zubenelgenubi: 'Ricardo',
      charon: 'Ricardo',
      
      // Dante (Survivor Style)
      dante: 'Thiago',
      iapetus: 'Thiago'
    };

    // Fallback de vozes baseado no local se não houver mapeamento
    const getVoiceId = (v: string, l: string) => {
      const vLower = (v || '').toLowerCase();
      const mapped = voiceMapping[vLower];
      if (mapped) return mapped;
      
      // Fallback por Local
      if (l && l.startsWith('pt')) return 'Camila';
      if (l && l.startsWith('en')) return 'Joanna';
      return 'Camila'; // Mestre Fallback
    };

    const selectedVoiceId = getVoiceId(voice, locale || 'pt-BR');

    try {
      // 1. Sintetizar o Áudio (MP3)
      const audioCommand = new SynthesizeSpeechCommand({
        Engine: Engine.NEURAL,
        Text: text,
        OutputFormat: OutputFormat.MP3,
        VoiceId: selectedVoiceId as any,
        LanguageCode: (locale as any) || 'pt-BR',
      });

      const audioResponse = await pollyClient.send(audioCommand);
      
      if (!audioResponse.AudioStream) {
        throw new Error("AWS Polly não retornou stream de áudio.");
      }

      // Converter o stream para Buffer e depois para Data URI
      const audioArray = await audioResponse.AudioStream.transformToUint8Array();
      const audioBuffer = Buffer.from(audioArray);
      const audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

      // 2. Sintetizar os Visemas (Speech Marks) para Lip-Sync
      const marksCommand = new SynthesizeSpeechCommand({
        Engine: Engine.NEURAL,
        Text: text,
        OutputFormat: OutputFormat.JSON,
        SpeechMarkTypes: [SpeechMarkType.VISEME],
        VoiceId: selectedVoiceId as any,
        LanguageCode: (locale as any) || 'pt-BR',
      });

      const marksResponse = await pollyClient.send(marksCommand);

      if (!marksResponse.AudioStream) {
        throw new Error("AWS Polly não retornou stream de marcas de fala.");
      }

      // Polly retorna marcas como JSON linha por linha
      const marksArray = await marksResponse.AudioStream.transformToUint8Array();
      const marksString = new TextDecoder().decode(marksArray);
      const speechMarks = marksString
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const mark = JSON.parse(line);
          return {
            type: mark.type,
            value: mark.value,
            startOffset: mark.time
          };
        });

      return {
        audioDataUri,
        speechMarks
      };

    } catch (error: any) {
      console.error("VIX DIAGNOSTIC: Falha na síntese Amazon Polly.", error);
      throw new Error(`Erro AWS Polly: ${error.message}`);
    }
  }
);


export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    try {
        return await textToSpeechFlow(input);
    } catch(err: any) {
        console.error(`VIX DIAGNOSTIC: Falha no processamento de áudio via Polly.`, err);
        throw new Error(err.message || "Erro na síntese de voz.");
    }
}
