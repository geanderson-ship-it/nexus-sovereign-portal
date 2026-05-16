import { PollyClient, SynthesizeSpeechCommand, Engine, VoiceId, TextType, OutputFormat } from '@aws-sdk/client-polly';

const pollyClient = new PollyClient({
  region: process.env.NEXUS_REGION || process.env.AMPLIFY_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXUS_ACCESS_KEY_ID || process.env.AMPLIFY_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXUS_SECRET_ACCESS_KEY || process.env.AMPLIFY_SECRET_ACCESS_KEY || '',
  },
});

export type VoiceGender = 'female' | 'male';

const NEURAL_VOICES: Record<VoiceGender, VoiceId> = {
  female: 'Camila',
  male: 'Thiago',
};

export async function synthesizeSpeech(text: string, gender: VoiceGender = 'female'): Promise<Buffer> {
  const voiceId = NEURAL_VOICES[gender];

  // Escapar caracteres XML para não quebrar o SSML
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Aplicando a prosódia de "locutor animado" (velocidade +10%, tom +6%) para ambos (Thiago e Camila)
  const ssmlText = `<speak><prosody rate="110%" pitch="+6%">${escapedText}</prosody></speak>`;

  const command = new SynthesizeSpeechCommand({
    Text: ssmlText,
    TextType: TextType.SSML,
    VoiceId: voiceId,
    Engine: Engine.NEURAL,
    OutputFormat: OutputFormat.MP3,
    LanguageCode: 'pt-BR',
  });

  const response = await pollyClient.send(command);

  if (!response.AudioStream) {
    throw new Error('AWS Polly não retornou áudio.');
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of response.AudioStream as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}
