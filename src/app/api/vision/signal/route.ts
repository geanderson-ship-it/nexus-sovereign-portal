import { NextRequest, NextResponse } from 'next/server';
import { saveAtenaMemory, searchAtenaMemories } from '@/lib/atena-db';

// SINALIZAÇÃO WEBRTC — 100% via DynamoDB
// Motivo: AWS Amplify usa múltiplas instâncias de servidor.
// Memória local (global.*) não é compartilhada entre instâncias,
// causando loop infinito de conexão. O DynamoDB é o único state centralizado.

const SIGNAL_TTL_MS = 180000; // 3 minutos

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return NextResponse.json({ error: 'roomId é obrigatório.' }, { status: 400 });
    }

    const now = Date.now();

    // Busca todos os sinais da sala no DynamoDB
    const memories = await searchAtenaMemories(roomId);

    const signals = memories
      .filter(m => (now - new Date(m.timestamp).getTime()) < SIGNAL_TTL_MS)
      .map(m => {
        try {
          return {
            id: m.id,
            type: m.categoria,
            timestamp: m.timestamp,
            payload: JSON.parse(m.conteudo)
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ signals });
  } catch (error: any) {
    console.error('[Vision Signal API GET Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao buscar sinais.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { roomId, type, sender, data } = await req.json();
    if (!roomId || !type || !sender || !data) {
      return NextResponse.json({ error: 'Parâmetros incompletos.' }, { status: 400 });
    }

    // Persiste o sinal no DynamoDB (compartilhado entre todas as instâncias)
    await saveAtenaMemory({
      userId: roomId,
      categoria: type,
      conteudo: JSON.stringify({ sender, data })
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Vision Signal API POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao salvar sinal.' }, { status: 500 });
  }
}
