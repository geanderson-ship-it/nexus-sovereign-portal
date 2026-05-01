import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeech, VoiceGender } from '@/lib/polly';

export async function POST(req: NextRequest) {
  try {
    const { text, gender } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto inválido.' }, { status: 400 });
    }

    const audioBuffer = await synthesizeSpeech(text.trim(), (gender as VoiceGender) || 'female');

    return new NextResponse(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    console.error('[TTS API Error]', err);
    const message = err instanceof Error ? err.message : 'Erro ao gerar áudio.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
