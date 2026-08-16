import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Acao nao especificada.' }, { status: 400 });
    }

    if (action === 'search') {
      const { domain, title } = body;
      if (!domain) {
        return NextResponse.json({ error: 'Dominio da empresa nao fornecido.' }, { status: 400 });
      }

      const apolloKey = process.env.APOLLO_API_KEY;
      if (!apolloKey) {
        return NextResponse.json({ error: 'Chave do Apollo (APOLLO_API_KEY) nao configurada no ambiente.' }, { status: 500 });
      }

      const apolloBody: any = {
        q_organization_domains: domain,
        page: 1,
        per_page: 10,
      };

      if (title && title.trim()) {
        apolloBody.person_titles = [title.trim()];
      }

      const res = await fetch('https://api.apollo.io/v1/mixed_people/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Api-Key': apolloKey
        },
        body: JSON.stringify(apolloBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json({ error: `Erro na API do Apollo: ${res.status} - ${errorText}` }, { status: res.status });
      }

      const data = await res.json();
      if (data.people && data.people.length > 0) {
        const leads = data.people.map((p: any) => ({
          id: p.id || Math.random().toString(),
          nome: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Nome nao informado',
          cargo: p.title || 'Cargo nao informado',
          email: p.email || 'E-mail oculto/nao encontrado',
          linkedin: p.linkedin_url || '',
          empresa: p.organization?.name || domain,
        }));
        return NextResponse.json({ success: true, leads });
      } else {
        return NextResponse.json({ success: true, leads: [], message: 'Nenhum lead encontrado para este dominio/cargo no Apollo.' });
      }

    } else if (action === 'send_isadora') {
      const { phone, message } = body;
      if (!phone || !message) {
        return NextResponse.json({ error: 'Parametros number e message sao obrigatorios.' }, { status: 400 });
      }

      const evoUrl = process.env.EVOLUTION_API_URL || 'http://100.59.197.161:8080';
      const evoKey = process.env.EVOLUTION_GLOBAL_APIKEY || 'nexus';
      const evoInstance = process.env.EVOLUTION_INSTANCE_NAME || 'Isadora';

      const sendRes = await fetch(`${evoUrl}/message/sendText/${evoInstance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evoKey,
        },
        body: JSON.stringify({
          number: phone,
          options: { delay: 1200, presence: 'composing' },
          textMessage: { text: message },
        }),
      });

      if (sendRes.ok) {
        return NextResponse.json({ success: true, message: `Mensagem enviada com sucesso para o WhatsApp ${phone}.` });
      } else {
        const errorText = await sendRes.text();
        return NextResponse.json({ error: `Falha ao acionar a API da Isadora: HTTP ${sendRes.status} - ${errorText}` }, { status: sendRes.status });
      }

    } else if (action === 'send_ivoni') {
      const { subject, htmlContent } = body;
      if (!subject || !htmlContent) {
        return NextResponse.json({ error: 'Parametros subject e htmlContent sao obrigatorios.' }, { status: 400 });
      }

      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        return NextResponse.json({ error: 'Chave do Resend (RESEND_API_KEY) nao configurada no ambiente.' }, { status: 500 });
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Atlas IA Executiva <atena@nexustreinamento.com>',
          to: ['vendas@nexustreinamento.com', 'geanderson@nexustreinamento.com'],
          subject: subject,
          html: `<div style="font-family: Arial, sans-serif;">${htmlContent}</div>`,
        }),
      });

      if (res.ok) {
        return NextResponse.json({ success: true, message: 'Relatorio enviado com sucesso para a diretoria.' });
      } else {
        const errorText = await res.text();
        return NextResponse.json({ error: `Falha ao enviar e-mail via Resend: HTTP ${res.status} - ${errorText}` }, { status: res.status });
      }

    } else {
      return NextResponse.json({ error: 'Acao nao suportada.' }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: `Erro critico no servidor: ${error.message}` }, { status: 500 });
  }
}
