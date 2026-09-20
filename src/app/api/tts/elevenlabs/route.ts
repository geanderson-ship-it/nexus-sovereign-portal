import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();

    // A API key do ElevenLabs é lida EXCLUSIVAMENTE de variável de ambiente
    // no servidor. Ela nunca deve trafegar pelo navegador nem ser aceita no
    // corpo da requisição (evita vazamento da credencial no cliente).
    const finalApiKey = process.env.ELEVENLABS_API_KEY;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto invalido.' }, { status: 400 });
    }
    if (!voiceId) {
      return NextResponse.json({ error: 'Voice ID do ElevenLabs é obrigatório.' }, { status: 400 });
    }
    if (!finalApiKey) {
      console.error('[ElevenLabs TTS] ELEVENLABS_API_KEY não configurada no servidor.');
      return NextResponse.json({ error: 'Serviço de voz não configurado.' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'accept': 'audio/mpeg',
          'content-type': 'application/json',
          'xi-api-key': finalApiKey,
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.55, // Tom firme, assentado e executivo
            similarity_boost: 0.80,
            style: 0.15, // Estilo elegante e sóbrio sem distorção
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[ElevenLabs TTS Error]', response.status, errorData);
      return NextResponse.json(
        { error: `Erro do ElevenLabs: ${response.status}` },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    console.error('[ElevenLabs TTS API Error]', err);
    const message = err instanceof Error ? err.message : 'Erro ao gerar áudio com ElevenLabs.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
