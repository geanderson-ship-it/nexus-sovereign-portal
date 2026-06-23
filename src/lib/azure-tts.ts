export type VoiceGender = 'female' | 'male';

const VOICES: Record<VoiceGender, string> = {
  female: 'pt-BR-BrendaNeural', // Voz mais madura e menos infantil
  male: 'pt-BR-JulioNeural',
};

export async function synthesizeSpeech(text: string, gender: VoiceGender = 'female'): Promise<Buffer> {
  const voiceId = VOICES[gender];
  const apiKey = process.env.AZURE_SPEECH_KEY;
  
  if (!apiKey) {
    throw new Error("Chave AZURE_SPEECH_KEY não configurada no ambiente.");
  }

  const endpoint = "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1";

  // Escapar caracteres especiais para não quebrar o XML/SSML
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Ajustando a prosódia:
  // Julio (male): pitch +5% (voz mais fina/alta conforme pedido) e rate normal/levemente acelerado para não ficar engessado.
  // Brenda (female): prosódia natural de rádio.
  const rate = gender === 'male' ? '+5%' : '+8%';
  const pitch = gender === 'male' ? '+5%' : '+0%';

  const ssml = `<speak version='1.0' xml:lang='pt-BR'><voice xml:lang='pt-BR' xml:gender='${gender === 'female' ? 'Female' : 'Male'}' name='${voiceId}'><prosody rate='${rate}' pitch='${pitch}'>${escapedText}</prosody></voice></speak>`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/ssml+xml; charset=utf-8',
      'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
      'User-Agent': 'NexusStudioRadio'
    },
    body: ssml
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro do Azure TTS: ${response.status} - ${errorData}`);
  }

  const audioArray = await response.arrayBuffer();
  return Buffer.from(audioArray);
}
