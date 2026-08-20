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
      const { domain, title, location, keyword } = body;
      if (!domain && !location && !keyword) {
        return NextResponse.json({ error: 'Forneça ao menos um filtro de busca (domínio, localização ou palavra-chave).' }, { status: 400 });
      }

      const apolloKey = process.env.APOLLO_API_KEY;
      if (!apolloKey) {
        return NextResponse.json({ error: 'Chave do Apollo (APOLLO_API_KEY) nao configurada no ambiente.' }, { status: 500 });
      }

      const apolloBody: any = {
        page: 1,
        per_page: 15, // Raised default per_page to return more results when expanding searches
      };

      if (domain && domain.trim()) {
        apolloBody.q_organization_domains = domain.trim();
      }

      if (location && location.trim()) {
        apolloBody.person_locations = [location.trim()];
      }

      if (keyword && keyword.trim()) {
        apolloBody.q_keywords = keyword.trim();
      }

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
        // Fallback to Sandbox/Mock mode if Apollo is locked on the Free plan (403 API_INACCESSIBLE)
        if (res.status === 403 || errorText.includes('API_INACCESSIBLE') || errorText.includes('Free plan') || errorText.includes('not included')) {
          console.warn('[Atlas Sandbox] API key restricted. Using fallback sandbox mode.');
          const mockLeads = generateMockLeads(location, keyword, title);
          return NextResponse.json({ 
            success: true, 
            leads: mockLeads, 
            isSandbox: true,
            message: 'API do Apollo limitada no plano gratuito. Exibindo leads simulados da sandbox.' 
          });
        }
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
          empresa: p.organization?.name || domain || 'Empresa nao informada',
        }));
        return NextResponse.json({ success: true, leads });
      } else {
        return NextResponse.json({ success: true, leads: [], message: 'Nenhum lead encontrado para estes criterios no Apollo.' });
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
          to: ['vendas@nexusholdinggroup.com.br', 'geanderson@nexusholdinggroup.com.br'],
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

// Sandbox/Mock search data generator
function generateMockLeads(location?: string, keyword?: string, title?: string) {
  const loc = location || 'Brasil';
  const kw = keyword || 'Tecnologia';
  const cargo = title || 'Diretor';

  const normalizedLoc = loc.toLowerCase();
  
  if (normalizedLoc.includes('portugal') || normalizedLoc.includes('lisboa') || normalizedLoc.includes('porto')) {
    return [
      {
        id: 'mock-pt-1',
        nome: 'Manuel Pestana',
        cargo: 'President & CEO',
        email: 'manuel.pestana@pestanagroup.com',
        linkedin: 'https://www.linkedin.com/in/manuel-pestana',
        empresa: 'Pestana Hotel Group'
      },
      {
        id: 'mock-pt-2',
        nome: 'Ana Costa',
        cargo: 'Diretora de Operações',
        email: 'ana.costa@vilagale.com',
        linkedin: 'https://www.linkedin.com/in/ana-costa-gale',
        empresa: 'Vila Galé Hotéis'
      },
      {
        id: 'mock-pt-3',
        nome: 'João Alano Ferreira',
        cargo: 'Gerente Geral',
        email: 'alano.ferreira@dompedro.com',
        linkedin: 'https://www.linkedin.com/in/alano-ferreira-dompedro',
        empresa: 'Dom Pedro Lisboa'
      },
      {
        id: 'mock-pt-4',
        nome: 'Fernanda Oliveira',
        cargo: 'Diretora de Inteligência de Mercado',
        email: 'fernanda.oliveira@dompedro.com',
        linkedin: 'https://www.linkedin.com/in/fernanda-oliveira-dompedro',
        empresa: 'Dom Pedro Hotels & Golf Collection'
      },
      {
        id: 'mock-pt-5',
        nome: 'Maria Santos',
        cargo: 'Diretora de Alimentos & Bebidas',
        email: 'maria.santos@sanahotels.com',
        linkedin: 'https://www.linkedin.com/in/maria-santos-sana',
        empresa: 'SANA Hotels'
      },
      {
        id: 'mock-pt-6',
        nome: 'Rui Silva',
        cargo: 'Diretor Geral de TI',
        email: 'rui.silva@tivolihotels.com',
        linkedin: 'https://www.linkedin.com/in/rui-silva-tivoli',
        empresa: 'Tivoli Hotels & Resorts'
      }
    ];
  }

  // A much richer fallback generator for any location (like Brasil, EUA, etc.)
  const mockNames = [
    { nome: 'Alexandre Mendes', empresa: 'Solutions' },
    { nome: 'Beatriz Spohr', empresa: 'Group' },
    { nome: 'Carlos Augusto Becker', empresa: 'Sistemas' },
    { nome: 'Daniela Zanella', empresa: 'Digital' },
    { nome: 'Eduardo Goulart', empresa: 'Tecnologia' },
    { nome: 'Flávia Borges', empresa: 'Logística' },
    { nome: 'Gustavo Weber', empresa: 'SaaS' }
  ];

  const cleanKw = kw.trim();

  return mockNames.map((item, index) => {
    const cleanKwDomain = cleanKw.toLowerCase().replace(/\s+/g, '');
    const cleanName = item.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.');
    
    // Distribute cargo variations nicely
    const cargosSugeridos = [
      cargo,
      `Diretor de ${cleanKw}`,
      `Gerente de Operações`,
      `Head of Growth`,
      `CEO & Sócio`,
      `Gerente de Vendas B2B`,
      `Diretor de Marketing`
    ];

    return {
      id: `mock-${index + 1}`,
      nome: item.nome,
      cargo: cargosSugeridos[index % cargosSugeridos.length],
      email: `${cleanName}@${cleanKwDomain}${item.empresa.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.com`,
      linkedin: `https://www.linkedin.com/in/${cleanName}`,
      empresa: `${cleanKw} ${item.empresa} ${loc}`
    };
  });
}
