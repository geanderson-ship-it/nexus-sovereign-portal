import { NextResponse } from 'next/server';
import { saveAtenaMemory } from '@/lib/atena-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, type, detail } = body;

    if (!message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
    }

    console.log(`📡 [VISION TELEMETRY] [${type || 'info'}]: ${message}`);

    // Salva o log como uma memória da Atena na categoria "vision-log"
    const contentPayload = JSON.stringify({
      type: type || 'error',
      message: message,
      detail: detail || ''
    });

    await saveAtenaMemory({
      userId: 'vision-telemetry',
      categoria: 'vision-log',
      conteudo: contentPayload
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Telemetry API] Erro ao registrar log:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
