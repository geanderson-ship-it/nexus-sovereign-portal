import { PollyClient, SynthesizeSpeechCommand, Engine, VoiceId, TextType, OutputFormat } from '@aws-sdk/client-polly';

const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export type VoiceGender = 'female' | 'male';

const NEURAL_VOICES: Record<VoiceGender, VoiceId> = {
  female: 'Camila',
  male: 'Thiago',
};

export async function synthesizeSpeech(text: string, gender: VoiceGender = 'female'): Promise<Buffer> {
  const voiceId = NEURAL_VOICES[gender];

  const command = new SynthesizeSpeechCommand({
    Text: text,
    TextType: TextType.TEXT,
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
