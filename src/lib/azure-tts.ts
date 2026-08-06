export type VoiceGender = 'female' | 'male';

const VOICE_MAP: Record<string, { female: string; male: string }> = {
  'pt-br': { female: 'pt-BR-FranciscaNeural', male: 'pt-BR-AntonioNeural' }, // Francisca: voz oficial Atena (madura, leve, sorridente) | Antonio: voz oficial Nexus Vision (natural)
  'en-us': { female: 'en-US-AvaNeural',    male: 'en-US-GuyNeural'    },
  'es-es': { female: 'es-ES-ElviraNeural', male: 'es-ES-AlvaroNeural' },
  'fr-fr': { female: 'fr-FR-DeniseNeural', male: 'fr-FR-HenriNeural'  },
  'it-it': { female: 'it-IT-ElsaNeural',   male: 'it-IT-DiegoNeural'  },
  'de-de': { female: 'de-DE-KatjaNeural',  male: 'de-DE-ConradNeural' },
  'ar-sa': { female: 'ar-SA-ZariyahNeural',male: 'ar-SA-HamedNeural'  }, // Árabe
  'ar':    { female: 'ar-SA-ZariyahNeural',male: 'ar-SA-HamedNeural'  }, // Árabe shortcode
  'zh-cn': { female: 'zh-CN-XiaoxiaoNeural',male: 'zh-CN-YunxiNeural'},  // Mandarim
  'zh':    { female: 'zh-CN-XiaoxiaoNeural',male: 'zh-CN-YunxiNeural'},  // Mandarim shortcode
  'ja-jp': { female: 'ja-JP-NanamiNeural', male: 'ja-JP-KeitaNeural'  }, // Japonês
  'ja':    { female: 'ja-JP-NanamiNeural', male: 'ja-JP-KeitaNeural'  }, // Japonês shortcode
  'ko-kr': { female: 'ko-KR-SunHiNeural',  male: 'ko-KR-InJoonNeural' }, // Coreano
  'ko':    { female: 'ko-KR-SunHiNeural',  male: 'ko-KR-InJoonPremium' }, // Coreano shortcode
};

export async function synthesizeSpeech(
  text: string, 
  gender: VoiceGender = 'female', 
  locale: string = 'pt-BR',
  customVoiceId?: string,
  style?: string
): Promise<Buffer> {
  const normLocale = locale.toLowerCase().replace('_', '-');
  const voiceSet = VOICE_MAP[normLocale] || VOICE_MAP[normLocale.split('-')[0]] || VOICE_MAP['pt-br'];
  const finalVoiceId = customVoiceId || voiceSet[gender];

  const apiKey = process.env.AZURE_SPEECH_KEY;
  
  if (!apiKey) {
    throw new Error("Chave AZURE_SPEECH_KEY não configurada no ambiente.");
  }

  const endpoint = "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1";

  // Escapar caracteres especiais para não quebrar o XML/SSML
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Ajustando a prosódia:
  const rate = gender === 'male' ? '+5%' : '+8%';
  const pitch = gender === 'male' ? '+5%' : '+0%';

  // Default a Francisca para o estilo 'cheerful' (sorridente / alegre) se nenhum estilo diferente for requisitado
  let finalStyle = style;
  if (finalVoiceId === 'pt-BR-FranciscaNeural' && (!style || style === 'none')) {
    finalStyle = 'cheerful';
  }

  let innerVoiceContent = `<prosody rate='${rate}' pitch='${pitch}'>${escapedText}</prosody>`;
  
  if (finalStyle && finalStyle !== 'none') {
    innerVoiceContent = `<mstts:express-as style='${finalStyle}'>${innerVoiceContent}</mstts:express-as>`;
  }

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='${finalVoiceId.substring(0, 5)}'><voice name='${finalVoiceId}'>${innerVoiceContent}</voice></speak>`;

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
