import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, apiKey, voiceId } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto inválido.' }, { status: 400 });
    }
    if (!apiKey || !voiceId) {
      return NextResponse.json({ error: 'API Key e Voice ID do ElevenLabs são obrigatórios.' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'accept': 'audio/mpeg',
          'content-type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.80,
            style: 0.3,
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
