import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

// Initialize Gemini SDK
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Helper for sending email via Nodemailer
async function sendDraftEmail(to: string, subject: string, body: string) {
  const user = process.env.EMAIL_USER || process.env.GMAIL_EMPRESA_EMAIL || '';
  const pass = process.env.EMAIL_APP_PASSWORD || process.env.GMAIL_EMPRESA_PASS || '';

  if (!user || !pass) {
    throw new Error('E-mail de envio não configurado nas variáveis de ambiente.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  const mailOptions = {
    from: `"Pactum Legal - Central de Minutas" <${user}>`,
    to,
    subject,
    text: body
  };

  return await transporter.sendMail(mailOptions);
}

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'Chave GEMINI_API_KEY não configurada no servidor.' },
        { status: 500 }
      );
    }

    if (action === 'scan-rpi') {
      // 1. Trademark Collision Scanner using Gemini with Google Search tool
      let model;
      try {
        model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          tools: [{ googleSearch: {} }] as any
        });
      } catch (err) {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      }

      const prompt = `Você é um robô de busca e auditor de marcas oficial integrado à Revista da Propriedade Industrial (RPI) do INPI Brasil.
Analise e pesquise na web se existe alguma marca com nome semelhante a "NEXUS SUL" ou termos parecidos na classe 42 (serviços de tecnologia, desenvolvimento de software e sistemas) no Brasil.
Verifique se esse registro colide diretamente com a marca principal do escritório: "NEXUS HOLDING GROUP".
Responda APENAS com um objeto JSON válido (sem tags markdown de código \`\`\`json ou texto adicional) contendo as seguintes propriedades:
{
  "hasCollision": true ou false,
  "brand": "Nome da marca colidente encontrada, ou vazio se não houver",
  "class": "42",
  "reason": "Explicação detalhada e fundamentada do motivo do conflito de marca, citando a semelhança e classe de Nice",
  "limitDate": "Data limite fictícia formatada em DD/MM/AAAA para protocolo de oposição (cerca de 60 dias a partir de hoje)"
}`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim();
      
      // Clean potential JSON markdown wrappers
      const cleanJsonStr = rawText
        .replace(/^```json\s*/i, '')
        .replace(/```$/, '')
        .trim();

      const parsedResult = JSON.parse(cleanJsonStr);
      return NextResponse.json(parsedResult);
    }

    if (action === 'audit-partnership') {
      // 2. Shareholders Agreement Risk Audit
      const { partnerA, partnerB, hasTagAlong, hasDragAlong, hasRightOfFirstRefusal, hasNonCompete } = payload;

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Você é a JUSTINE, Inteligência Artificial Jurídica e Compliance Officer da Nexus Holding.
Realize um mapeamento de riscos e assimetrias de governança corporativa para um Acordo de Sócios proposto entre:
- Sócio Majoritário/Controlador: ${partnerA}
- Sócio Minoritário/Investidor: ${partnerB}

Os parâmetros regulados no contrato são:
- Direito de Tag-Along (Proteção ao minoritário): ${hasTagAlong ? 'ATIVO (Garante venda conjunta nas mesmas condições)' : 'INATIVO (Minoritário exposto ao convívio com novo controlador)'}
- Direito de Drag-Along (Proteção ao majoritário): ${hasDragAlong ? 'ATIVO (Força minoritário a vender em proposta de aquisição integral)' : 'INATIVO (Minoritário pode travar a liquidez de venda da empresa)'}
- Direito de Preferência (Right of First Refusal): ${hasRightOfFirstRefusal ? 'ATIVO (Oferta interna obrigatória de cotas)' : 'INATIVO (Livre cessão de cotas para terceiros estranhos)'}
- Cláusula de Não-Concorrência (Non-Compete): ${hasNonCompete ? 'ATIVO (Impede sócio de fundar concorrente no mesmo segmento após saída)' : 'INATIVO (Sócio pode sair e imediatamente abrir concorrente direta)'}

Responda APENAS com um objeto JSON válido (sem tags markdown de código \`\`\`json ou texto adicional) contendo a seguinte estrutura:
{
  "complianceLevel": "Exposição de Risco Ativa" ou "Foco em Compliance",
  "alerts": [
    {
      "type": "tagAlong" ou "dragAlong" ou "nonCompete" ou "preference" ou "general",
      "risk": "Título curto do alerta em maiúsculo (ex: ALERTA: SEM DRAG-ALONG)",
      "desc": "Texto explicativo detalhado e fundamentado juridicamente sobre o risco ou proteção gerada por essa configuração para os sócios ${partnerA} e ${partnerB}."
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim();
      
      const cleanJsonStr = rawText
        .replace(/^```json\s*/i, '')
        .replace(/```$/, '')
        .trim();

      const parsedResult = JSON.parse(cleanJsonStr);
      return NextResponse.json(parsedResult);
    }

    if (action === 'generate-draft') {
      // 3. Document Draft Generation
      const { type, context } = payload;
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let prompt = '';
      if (type === 'opposition') {
        prompt = `Você é o procurador jurídico FELIPE QUEROL. Escreva uma minuta formal e técnica de OPOSIÇÃO AO REGISTRO DE MARCA perante o INPI.
Contexto do Caso:
- Marca Oposta: ${context.brand} (Processo nº ${context.id})
- Opoente: NEXUS HOLDING GROUP S.A.
- Representante Legal: Felipe Querol (OAB/RS sob contrato de procuração)
- Fundamento: Semelhança fonética e ideológica de marca na classe ${context.class || '42'}, violando o Art. 124, inciso XIX da Lei de Propriedade Industrial (Lei 9.279/96).

Retorne apenas o texto final formal da petição/minuta jurídica de oposição estruturada, em formato de texto puro profissional pronto para assinatura.`;
      } else if (type === 'holding') {
        prompt = `Escreva um Memorando de Entendimento (MoU) formal e executivo para Estruturação de Holding Familiar.
Contexto Patrimonial:
- Bens Imóveis Declarados: R$ ${context.imoveis}
- Outros Ativos/Cotas/Investimentos: R$ ${context.outrosAtivos}
- Patrimônio Total Integralizado: R$ ${context.totalPatrimonio}
- Herdeiros: ${context.herdeiros} herdeiros diretos.
- Advogado Responsável: Felipe Querol - Consultoria Societária.

Estruture com seções formais como Objeto, Integralização, Doação de Cotas com Reserva de Usufruto, Cláusulas de Blindagem (Inalienabilidade, Incomunicabilidade, Impenhorabilidade, Reversão) e Administração. Retorne apenas o texto final da minuta formatado de forma limpa e profissional.`;
      } else {
        prompt = `Escreva um Acordo de Sócios formal para regulação de governança societária da Nexus Governance Ltda.
Partes:
- Sócio Controlador: ${context.partnerA}
- Sócio Minoritário: ${context.partnerB}
Cláusulas a serem redigidas detalhadamente com base nas escolhas:
- Tag-Along: ${context.hasTagAlong ? 'ATIVO - Garante o direito de venda conjunta nas mesmas condições' : 'INATIVO - Sem direito de venda conjunta'}
- Drag-Along: ${context.hasDragAlong ? 'ATIVO - Controlador força a venda em caso de proposta de 100%' : 'INATIVO - Sem alienação forçada'}
- Direito de Preferência: ${context.hasRightOfFirstRefusal ? 'ATIVO - Exige oferta interna prévia de cotas' : 'INATIVO - Livre trânsito de cotas'}
- Não-Concorrência (Non-Compete): ${context.hasNonCompete ? 'ATIVO - Proíbe concorrer por 24 meses após a saída' : 'INATIVO - Livre concorrência pós-saída'}

Retorne apenas o texto final formal e estruturado do Acordo de Sócios pronto para assinatura.`;
      }

      const result = await model.generateContent(prompt);
      return NextResponse.json({ draftText: result.response.text().trim() });
    }

    if (action === 'send-email') {
      // 4. Send Email via Gmail App Password using Nodemailer
      const { to, subject, body } = payload;
      await sendDraftEmail(to, subject, body);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Ação desconhecida.' }, { status: 400 });

  } catch (error: any) {
    console.error('Erro na API Pactum:', error);
    return NextResponse.json(
      { error: 'Falha no processamento da API Pactum: ' + error.message },
      { status: 500 }
    );
  }
}
