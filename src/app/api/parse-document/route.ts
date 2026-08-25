import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Carregar pdf-parse v1.1.1 estável (usa a API de função direta com Buffer)
    const pdf = require('pdf-parse');
    const data = await pdf(buffer);

    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error('[PARSE_DOCUMENT_ERROR]:', error);
    return NextResponse.json({ error: 'Falha ao processar o documento PDF: ' + error.message }, { status: 500 });
  }
}
