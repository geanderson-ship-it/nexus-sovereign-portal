import { NextRequest, NextResponse } from 'next/server';
import { saveAtenaMemory, searchAtenaMemories } from '@/lib/atena-db';

// Cache global de sinais em memória para conexões WebRTC instantâneas
// Usamos a propriedade 'global' para persistir a referência em hot reloads de desenvolvimento
const getGlobalSignals = (): Array<{
  id: string;
  roomId: string;
  type: string;
  sender: string;
  timestamp: number;
  data: any;
}> => {
  if (typeof global !== 'undefined') {
    if (!(global as any).nexusSignalsStore) {
      (global as any).nexusSignalsStore = [];
    }
    return (global as any).nexusSignalsStore;
  }
  return [];
};

// Limpeza automática de lixo/sinais expirados
if (typeof global !== 'undefined') {
  if (!(global as any).nexusSignalsCleanupInterval) {
    (global as any).nexusSignalsCleanupInterval = setInterval(() => {
      const store = getGlobalSignals();
      const now = Date.now();
      for (let i = store.length - 1; i >= 0; i--) {
        if (now - store[i].timestamp > 180000) { // 3 minutos
          store.splice(i, 1);
        }
      }
    }, 60000);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return NextResponse.json({ error: 'roomId é obrigatório.' }, { status: 400 });
    }

    const now = Date.now();
    const store = getGlobalSignals();
    
    // 1. Busca primeiro no cache em memória (resposta ultrarrápida de baixa latência)
    const activeSignals = store
      .filter(s => s.roomId === roomId && (now - s.timestamp < 180000))
      .map(s => ({
        id: s.id,
        type: s.type,
        timestamp: new Date(s.timestamp).toISOString(),
        payload: { sender: s.sender, data: s.data }
      }));

    // 2. Tenta carregar do DynamoDB em paralelo (caso outro peer tenha gravado via servidor remoto)
    let memories: any[] = [];
    try {
      memories = await searchAtenaMemories(roomId);
    } catch (e) {
      console.warn("DynamoDB temporariamente indisponível. Usando apenas sinalização em memória local.");
    }
    
    const dbSignals = memories
      .filter(m => now - new Date(m.timestamp).getTime() < 180000)
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
      .filter(s => s !== null && !activeSignals.some(as => as.id === s.id));

    return NextResponse.json({ signals: [...activeSignals, ...dbSignals] });
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

    const signalId = crypto.randomUUID();
    const store = getGlobalSignals();

    // 1. Registra no cache de memória local
    store.push({
      id: signalId,
      roomId,
      type,
      sender,
      timestamp: Date.now(),
      data
    });

    // 2. Persiste em segundo plano no DynamoDB (sem travar a requisição)
    saveAtenaMemory({
      userId: roomId,
      categoria: type,
      conteudo: JSON.stringify({ sender, data })
    }).catch(err => {
      console.warn("Erro ao salvar sinalizador em segundo plano no DynamoDB:", err);
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Meet Signal API POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao salvar sinal.' }, { status: 500 });
  }
}
