import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, apiKey, voiceId } = await req.json();

    // Prevent browser password autofill from breaking the API key
    const isValidFrontendKey = typeof apiKey === 'string' && apiKey.startsWith('sk_');
    const finalApiKey = isValidFrontendKey ? apiKey : process.env.ELEVENLABS_API_KEY;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto invalido.' }, { status: 400 });
    }
    if (!finalApiKey || !voiceId) {
      return NextResponse.json({ error: 'API Key e Voice ID do ElevenLabs sao obrigatorios.' }, { status: 400 });
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
            stability: 0.25, // Baixa estabilidade para deixar ele muito mais solto e emotivo
            similarity_boost: 0.80,
            style: 0.85, // Estilo altíssimo para uma locução EXTREMAMENTE exagerada e animada (110%)
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
