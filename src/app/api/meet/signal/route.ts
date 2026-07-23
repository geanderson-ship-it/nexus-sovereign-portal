import { NextRequest, NextResponse } from 'next/server';
import { saveAtenaMemory, searchAtenaMemories } from '@/lib/atena-db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return NextResponse.json({ error: 'roomId é obrigatório.' }, { status: 400 });
    }

    const memories = await searchAtenaMemories(roomId);
    
    // Filtra sinais dos últimos 3 minutos para evitar lixo de chamadas antigas
    const now = Date.now();
    const activeSignals = memories
      .filter(m => now - new Date(m.timestamp).getTime() < 180000) // 3 minutos
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
      .filter(s => s !== null);

    return NextResponse.json({ signals: activeSignals });
  } catch (error: any) {
    console.error('[Meet Signal API GET Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao buscar sinais.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { roomId, type, sender, data } = await req.json();
    if (!roomId || !type || !sender || !data) {
      return NextResponse.json({ error: 'Parâmetros incompletos.' }, { status: 400 });
    }

    const success = await saveAtenaMemory({
      userId: roomId,
      categoria: type, // ex: 'webrtc-offer', 'webrtc-answer', 'webrtc-candidate'
      conteudo: JSON.stringify({ sender, data })
    });

    if (!success) {
      throw new Error('Falha ao salvar sinal no DynamoDB.');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Meet Signal API POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao salvar sinal.' }, { status: 500 });
  }
}
