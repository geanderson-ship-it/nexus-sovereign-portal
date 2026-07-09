import { NextRequest, NextResponse } from 'next/server';
import { salvarLead, listarLeads, atualizarStatusLead, excluirLead, IsadoraLead } from '@/lib/isadora-db';

export async function GET() {
  try {
    const leads = await listarLeads();
    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const leads = Array.isArray(data) ? data : [data];
    
    let count = 0;
    for (const lead of leads) {
      if (lead.id && lead.nome && lead.telefone) {
        await salvarLead(lead);
        count++;
      }
    }
    
    return NextResponse.json({ ok: true, count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, dataEnvio } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios' }, { status: 400 });
    }
    
    const success = await atualizarStatusLead(id, status, dataEnvio);
    return NextResponse.json({ ok: success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }
    
    const success = await excluirLead(id);
    return NextResponse.json({ ok: success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
