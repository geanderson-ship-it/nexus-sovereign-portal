import { NextRequest, NextResponse } from 'next/server';
import { getIsadoraHistory, getIsadoraSession } from '@/lib/isadora-db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Parâmetro phone é obrigatório' }, { status: 400 });
    }

    const [history, session] = await Promise.all([
      getIsadoraHistory(phone),
      getIsadoraSession(phone),
    ]);

    return NextResponse.json({
      phone,
      history,
      nicho: session?.nicho || null,
      purchaseIntention: session?.purchaseIntention || 0,
      lastInteraction: session?.lastInteraction || null,
      handoffTriggered: session?.handoffTriggered || false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
