
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
    const region = process.env.NEXUS_REGION || process.env.AMPLIFY_REGION || 'us-east-1';
    const pollyConfig: any = { region };

    const accessKeyId = process.env.NEXUS_ACCESS_KEY_ID || process.env.AMPLIFY_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXUS_SECRET_ACCESS_KEY || process.env.AMPLIFY_SECRET_ACCESS_KEY;

    if (accessKeyId && secretAccessKey) {
      pollyConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    } else {
      console.log(`VIX DIAGNOSTIC: Usando credenciais padrão do ambiente (IAM Role) na região ${region}.`);
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
      dante: 'Ricardo',
      iapetus: 'Ricardo'
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
    const selectedEngine = selectedVoiceId === 'Ricardo' ? Engine.STANDARD : Engine.NEURAL;

    try {
      if (!text || text.trim().length === 0) {
        throw new Error("O texto para síntese está vazio.");
      }

      const voiceNameLower = (voice || '').toLowerCase();
      const isDante = voiceNameLower === 'dante';

      // =========================================================================
      // AZURE TTS INTEGRATION FOR DANTE SAFRA (Prioridade Máxima)
      // =========================================================================
      if (isDante) {
        try {
          console.log(`[Azure TTS] Generating voice for Dante Safra via Microsoft Azure. Text: "${text.substring(0,50)}..."`);
          const apiKey = process.env.AZURE_SPEECH_KEY;
          if (!apiKey) {
             throw new Error("Missing AZURE_SPEECH_KEY in environment variables.");
          }
          const endpoint = "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1";
          
          // O frontend injeta "..." para forçar pausas longas.
          // Removemos as reticências ("..."), e removemos também a vírgula antes de "comandante" ou "patrão"
          // para evitar pausas antes do vocativo, que cortam a ênfase e fluidez da frase.
          let ttsText = text.replace(/\.\.\./g, '');
          ttsText = ttsText.replace(/,\s*comandante/gi, ' comandante');
          ttsText = ttsText.replace(/,\s*patrão/gi, ' patrão');
          ttsText = ttsText.replace(/,\s*patrao/gi, ' patrao');
          ttsText = ttsText.replace(/\s+/g, ' ').trim();
          
          // Configuração do Antônio com timbre -2% (mais grave) e velocidade +5% (um pouco menos frenético)
          const ssml = `<speak version='1.0' xml:lang='pt-BR'><voice xml:lang='pt-BR' xml:gender='Male' name='pt-BR-AntonioNeural'><prosody rate="+5%" pitch="-2%">${ttsText}</prosody></voice></speak>`;

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': apiKey,
              'Content-Type': 'application/ssml+xml; charset=utf-8',
              'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
              'User-Agent': 'NexusTTS'
            },
            body: ssml
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Erro do Azure: ${response.status} - ${errorData}`);
          }

          const audioArray = await response.arrayBuffer();
          const audioBuffer = Buffer.from(audioArray);
          const audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

          return {
            audioDataUri,
            speechMarks: [] // AWS Polly retorna visemas, Azure suporta via SSML diferente, mantendo vazio por agora.
          };
        } catch (azureErr: any) {
          console.error("VIX DIAGNOSTIC: Falha ao gerar áudio com Azure para Dante. Fazendo fallback para ElevenLabs/Polly...", azureErr);
          // O fluxo continua abaixo (ElevenLabs ou Polly) caso a Azure caia
        }
      }
      // =========================================================================

      // ElevenLabs Custom Voice Integration for Athena, and Orion
      const isAtena = voiceNameLower === 'atena' || voiceNameLower === 'athena';
      const isOrion = voiceNameLower === 'orion';
      const isDjeny = voiceNameLower === 'djeny';
      
      let targetElevenLabsVoiceId = null;
      if (isDante && process.env.DANTE_ELEVENLABS_VOICE_ID) {
        targetElevenLabsVoiceId = process.env.DANTE_ELEVENLABS_VOICE_ID;
      } else if (isAtena && process.env.ATENA_ELEVENLABS_VOICE_ID) {
        targetElevenLabsVoiceId = process.env.ATENA_ELEVENLABS_VOICE_ID;
      } else if (isOrion && process.env.ORION_ELEVENLABS_VOICE_ID) {
        targetElevenLabsVoiceId = process.env.ORION_ELEVENLABS_VOICE_ID;
      } else if (isDjeny && process.env.DJENY_ELEVENLABS_VOICE_ID) {
        targetElevenLabsVoiceId = process.env.DJENY_ELEVENLABS_VOICE_ID;
      }

      if (targetElevenLabsVoiceId && process.env.ELEVENLABS_API_KEY) {
        try {
          // Sanitiza texto para vozes de língua inglesa (ex: Will) que não pronunciam
          // corretamente caracteres especiais do Português: ã, ç, â, etc.
          const sanitizeForWillVoice = (raw: string): string => {
            return raw
              .replace(/maçãs/gi, 'massans')
              .replace(/maçã/gi,  'massan')
              .replace(/(?<=^|[^a-zA-Z0-9À-ÿ])çãs(?=$|[^a-zA-Z0-9À-ÿ])/gi, 'massans')
              .replace(/(?<=^|[^a-zA-Z0-9À-ÿ])çã(?=$|[^a-zA-Z0-9À-ÿ])/gi,  'massan');
          };

          const ttsText = (isDante || isDjeny) ? sanitizeForWillVoice(text.trim()) : text.trim();
          
          console.log(`[ElevenLabs TTS] Generating voice clone for "${voiceNameLower}". Raw text: "${text.trim()}" | Sent text: "${ttsText}" | Voice ID: ${targetElevenLabsVoiceId}`);

          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${targetElevenLabsVoiceId}`,
            {
              method: 'POST',
              headers: {
                'accept': 'audio/mpeg',
                'content-type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY!,
              },
              body: JSON.stringify({
                text: ttsText,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                  stability: 0.45,
                  similarity_boost: 0.85,
                  style: 0.5,
                  use_speaker_boost: true,
                  speed: isDjeny ? 1.10 : 1.0,
                },
              }),
            }
          );


          if (!response.ok) {
            const errorData = await response.text();
            console.error('[ElevenLabs TTS Flow Error]', response.status, errorData);
            throw new Error(`Erro do ElevenLabs: ${response.status}`);
          }

          const audioArray = await response.arrayBuffer();
          const audioBuffer = Buffer.from(audioArray);
          const audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

          return {
            audioDataUri,
            speechMarks: [] // ElevenLabs has no native visemes in basic TTS API
          };
        } catch (elevenErr: any) {
          console.error("VIX DIAGNOSTIC: Falha ao gerar áudio com ElevenLabs para Dante. Fazendo fallback para Amazon Polly...", elevenErr);
          // Fallback - continue with existing Polly logic below
        }
      }

      // 1. Sintetizar o Áudio (MP3)
      const audioCommand = new SynthesizeSpeechCommand({
        Engine: selectedEngine,
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
      const audioArray = await audioResponse.AudioStream.transformToByteArray();
      const audioBuffer = Buffer.from(audioArray);
      const audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

      // 2. Sintetizar os Visemas (Speech Marks) para Lip-Sync
      const marksCommand = new SynthesizeSpeechCommand({
        Engine: selectedEngine,
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
      const marksArray = await marksResponse.AudioStream.transformToByteArray();
      const marksString = new TextDecoder().decode(marksArray);
      const speechMarks = marksString
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            const mark = JSON.parse(line);
            return {
              type: mark.type,
              value: mark.value,
              startOffset: mark.time
            };
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);

      return {
        audioDataUri,
        speechMarks: speechMarks as any[]
      };

    } catch (error: any) {
      console.error("VIX DIAGNOSTIC: Falha na síntese Amazon Polly.", {
        message: error.message,
        code: error.code || error.name,
        region: region,
        hasCredentials: !!(accessKeyId && secretAccessKey)
      });
      
      // Se for um erro de credenciais, damos uma mensagem mais clara para o administrador.
      if (error.message?.includes('credentials') || error.name === 'CredentialsError') {
        throw new Error("Erro de Autenticação AWS: O servidor não possui permissões para usar o Amazon Polly. Verifique as variáveis de ambiente no console da Amplify.");
      }

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
