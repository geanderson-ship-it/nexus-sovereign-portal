import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Evita cache desta rota
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

    if (!HEYGEN_API_KEY) {
      console.error('HEYGEN_API_KEY não configurada no servidor.');
      return NextResponse.json({ error: 'Chave da API não configurada' }, { status: 500 });
    }

    const res = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: {
        'x-api-key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erro na API da HeyGen:', res.status, errorText);
      return NextResponse.json(
        { error: `Erro na HeyGen API: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ token: data.data.token });
    
  } catch (error) {
    console.error('Erro ao gerar token da HeyGen:', error);
    return NextResponse.json(
      { error: 'Erro interno ao comunicar com a HeyGen' },
      { status: 500 }
    );
  }
}
