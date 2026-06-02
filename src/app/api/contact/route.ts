import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEADS_FILE_PATH = path.join(process.cwd(), 'src/lib/data/leads.json');

// Helper to read leads safely
function readLeads(): any[] {
  try {
    if (!fs.existsSync(LEADS_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (e) {
    console.error('Error reading leads:', e);
    return [];
  }
}

// Helper to write leads safely
function writeLeads(leads: any[]): boolean {
  try {
    const dir = path.dirname(LEADS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing leads:', e);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, company, subject, message } = body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const leads = readLeads();
    const newLead = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      firstName,
      lastName,
      email,
      phone,
      company: company || '',
      subject: subject || '',
      message,
      createdAt: new Date().toISOString(),
      status: 'novo', // 'novo' | 'contatado' | 'arquivado'
    };

    leads.push(newLead);
    writeLeads(leads);

    console.log(`[API /contact] Novo lead registrado: ${firstName} (${email})`);

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error: any) {
    console.error('[API /contact] Erro ao registrar lead:', error);
    return NextResponse.json({ error: 'Erro interno ao registrar lead.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const leads = readLeads();
    // Sort by newest first
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ leads });
  } catch (error: any) {
    console.error('[API /contact] Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Erro ao buscar leads.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios.' }, { status: 400 });
    }

    const leads = readLeads();
    const leadIndex = leads.findIndex(l => l.id === id);
    if (leadIndex === -1) {
      return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 });
    }

    leads[leadIndex].status = status;
    writeLeads(leads);

    return NextResponse.json({ success: true, lead: leads[leadIndex] });
  } catch (error: any) {
    console.error('[API /contact] Erro ao atualizar lead:', error);
    return NextResponse.json({ error: 'Erro ao atualizar lead.' }, { status: 500 });
  }
}
