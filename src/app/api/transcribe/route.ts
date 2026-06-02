import { NextRequest, NextResponse } from 'next/server';
import { transcribeMedia } from '@/services/transcribe';

export async function POST(req: NextRequest) {
  try {
    const { base64, mimeType, fileName } = await req.json();

    if (!base64 || !mimeType) {
      return NextResponse.json({ error: 'base64 e mimeType são obrigatórios.' }, { status: 400 });
    }

    const transcript = await transcribeMedia(base64, mimeType, fileName || 'arquivo');
    return NextResponse.json({ transcript });

  } catch (error: any) {
    console.error('[API /transcribe] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao transcrever o arquivo.' },
      { status: 500 }
    );
  }
}
