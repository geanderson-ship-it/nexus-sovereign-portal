import { NextResponse } from 'next/server';
import { saveAtenaMemory, searchAtenaMemories } from '@/lib/atena-db';

export const dynamic = 'force-dynamic';

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

/**
 * GET: recupera os logs de telemetria do Vision para diagnóstico.
 *
 * Uso:
 *   /api/vision/logs                 -> últimos 100 logs
 *   /api/vision/logs?limit=200       -> últimos 200 logs
 *   /api/vision/logs?room=NOME_SALA  -> filtra pela sala informada
 *   /api/vision/logs?q=Traducao      -> filtra por termo no conteúdo
 *
 * Retorna os eventos do mais recente para o mais antigo, já com a mensagem e
 * o detalhe extraídos, para facilitar a leitura sem depender do console.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 500);
    const room = url.searchParams.get('room') || '';
    const q = url.searchParams.get('q') || '';

    const memories = await searchAtenaMemories('vision-telemetry', q);

    const logs = memories
      .map((m) => {
        let message = '';
        let type = 'info';
        let detail = '';
        try {
          const parsed = JSON.parse(m.conteudo);
          message = parsed.message || '';
          type = parsed.type || 'info';
          detail = parsed.detail || '';
        } catch {
          message = m.conteudo;
        }
        return { timestamp: m.timestamp, type, message, detail };
      })
      // Filtro opcional por sala (o detail contém "Room: <sala>")
      .filter((log) => (room ? log.detail.includes(`Room: ${room}`) : true))
      .slice(0, limit);

    return NextResponse.json(
      { count: logs.length, logs },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error: any) {
    console.error('[Telemetry API] Erro ao recuperar logs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
