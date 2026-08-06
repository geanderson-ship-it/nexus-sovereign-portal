import { NextRequest, NextResponse } from 'next/server';
import { getICMBioSettings, saveICMBioSettings } from '@/lib/icmbio-db';

export async function GET(req: NextRequest) {
  try {
    const settings = getICMBioSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('[ICMBio Settings GET Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar configurações.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (typeof data.dailyOperatorLimit !== 'number') {
      return NextResponse.json({ error: 'Parâmetro dailyOperatorLimit deve ser um número.' }, { status: 400 });
    }

    const success = saveICMBioSettings({ dailyOperatorLimit: data.dailyOperatorLimit });
    if (!success) {
      return NextResponse.json({ error: 'Erro ao salvar configurações.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: { dailyOperatorLimit: data.dailyOperatorLimit } });
  } catch (error: any) {
    console.error('[ICMBio Settings POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao atualizar configurações.' }, { status: 500 });
  }
}
