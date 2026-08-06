import { NextRequest, NextResponse } from 'next/server';
import { getBlockedDates, saveBlockedDate } from '@/lib/icmbio-db';

export async function GET(req: NextRequest) {
  try {
    const dates = await getBlockedDates();
    return NextResponse.json({ blockedDates: dates });
  } catch (error: any) {
    console.error('[ICMBio Blocked Dates GET Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar datas bloqueadas.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { date, blocked } = await req.json();

    if (!date || typeof blocked !== 'boolean') {
      return NextResponse.json({ error: 'Parâmetros "date" e "blocked" são obrigatórios.' }, { status: 400 });
    }

    // Formata a data se vier em YYYY-MM-DD para DD/MM/AAAA para consistência
    let formattedDate = date;
    if (date.includes('-')) {
      const [year, month, day] = date.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    const success = await saveBlockedDate(formattedDate, blocked);
    
    // Se a data original em formato ISO (YYYY-MM-DD) foi enviada, vamos salvar também
    // para bater com as checagens no calendário do frontend que costuma usar YYYY-MM-DD
    if (date.includes('-')) {
      await saveBlockedDate(date, blocked);
    }

    if (!success) {
      return NextResponse.json({ error: 'Erro ao salvar bloqueio de data.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, date: formattedDate, blocked });
  } catch (error: any) {
    console.error('[ICMBio Blocked Dates POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao salvar bloqueio de data.' }, { status: 500 });
  }
}
