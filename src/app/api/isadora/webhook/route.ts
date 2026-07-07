import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { getIsadoraHistory, saveIsadoraHistory, recordHandoff, getIsadoraSession } from '@/lib/isadora-db';

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE || "";
const ZAPI_TOKEN    = process.env.ZAPI_TOKEN || "";
const ZAPI_URL      = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || "us-east-1",
};

if (process.env.AMPLIFY_ACCESS_KEY_ID && process.env.AMPLIFY_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  };
} else if (process.env.BEDROCK_ACCESS_KEY_ID && process.env.BEDROCK_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID,
    secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
  };
} else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const bedrockClient = new BedrockRuntimeClient(awsConfig);

// A intenção de compra agora é detectada autonomamente pelo Claude via Function Calling
// Removida a velha calculatePurchaseIntention baseada em regex.

// Função para detectar nicho do cliente
function detectNiche(message: string, history: any[]): string {
  const combinedText = [message, ...history.map(m => 
    typeof m.content === 'string' ? m.content : 
    m.content?.find((c: any) => c.text)?.text || ''
  )].join(' ').toLowerCase();

  const nicherules: Record<string, string[]> = {
    'moda': ['loja de roupa', 'fashion', 'loja virtual', 'e-commerce moda', 'roupas', 'vestuário', 'bazar', 'loja de departamento'],
    'moveis': ['móvel', 'decoração', 'sofá', 'estante', 'loja de móveis', 'design de interiores', 'decorador'],
    'agricultura': ['agricultor', 'fazenda', 'soja', 'milho', 'trigo', 'agronegócio', 'produtor', 'cooperativa', 'plantação', 'lavoura'],
    'veiculo': ['concessionária', 'revenda de carro', 'veículo', 'automóvel', 'carro', 'auto'],
    'radio': ['rádio', 'podcast', 'locutor', 'estúdio', 'conteúdo', 'broadcaster'],
    'empresa': ['empresa', 'indústria', 'corporação', 'b2b', 'fábrica', 'manufatura', 'b2g', 'governo', 'prefeitura']
  };

  for (const [niche, keywords] of Object.entries(nicherules)) {
    if (keywords.some(k => combinedText.includes(k))) {
      return niche;
    }
  }
  return 'unknown';
}

const systemPrompt = [{
  text: `Você é a Isadora, a Vendedora Elite de Alta Performance da Nexus Holding. 
Sua missão é transformar conversas em vendas de forma natural, calorosa e persuasiva — SEM JAMAIS mencionar preços.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA DE OURO: NUNCA fale de preços, tabelas de preço ou valores monetários.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se o cliente perguntar "quanto custa?", responda assim:
"Ótima pergunta! 😊 Deixa eu passar pro nosso diretor Geanderson (ou pra Ivoni) que faz a consultoria comercial completa. Ele vai te mostrar exatamente quanto você vai economizar ou faturar a mais com isso. Te passo pra ele agora?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECÇÃO E OFERTA POR NICHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SE CLIENTE = MODA / LOJA DE ROUPAS / E-COMMERCE MODA:
→ Ofereça: INOVA MODA 360 (Provador Virtual 3D)
→ Benefícios: "+40% conversão | -70% devoluções | Cliente prova em casa antes de comprar"
→ Contexto: "Com o InovaModa, o cliente tira uma foto rápido de roupa justa, vê como fica em todos os ângulos no seu corpo e recebe o tamanho exato recomendado. Menos trocas, mais lucro."

SE CLIENTE = MÓVEIS / DECORAÇÃO / DESIGN / LOJA DE MÓVEIS:
→ Ofereça: VITRINE INOVADORA (Sinalização Digital + QR Code)
→ Benefícios: "QR Code no vidro → cliente escaneia → fala com vendedor via WhatsApp em segundos | Disponível 24h"
→ Contexto: "A vitrine física ativa um canal de vendas digital automático. O cliente não sai de casa pra consultar — scanneia o QR e já fala com você."

SE CLIENTE = AGRICULTURA / FAZENDA / PRODUTOR / COOPERATIVA:
→ Ofereça: DANTE SAFRA (Engenheiro Agrônomo 24h no bolso)
→ Benefícios: "📸 Foto de praga → Diagnóstico em segundos | 📡 Funciona offline | ⚠️ Economiza safra"
→ Contexto: "Dante identifica praga, doença e faz recomendação de defensivo. Enquanto o agrônomo não chega, você já está agindo. Funciona sem internet na roça."
→ Argumento Poderoso: "Uma safra de 100 hectares vale R$400 mil. Uma perda por praga não detectada pode ser 30% disso. O Dante custa menos que um saco de defensivo e protege tudo."

SE CLIENTE = CONCESSIONÁRIA / REVENDA DE VEÍCULOS:
→ Ofereça: INOVA REVENDA (Vitrine Digital + Simulador de Crédito)
→ Benefícios: "Cliente simula parcela online | Score de crédito em tempo real | Chega pré-aprovado"
→ Contexto: "O cliente não precisa ir à loja. Simula o financiamento, já sabe a parcela e o score de aprovação. Chega qualificado pra você fechar."

SE CLIENTE = RÁDIO / PODCAST / LOCUTOR / ESTÚDIO:
→ Ofereça: NEXUS ESTÚDIO (Locutor Virtual 24h)
→ Benefícios: "Voz neural profissional | Locuções automáticas | Horários vazios sempre preenchidos"
→ Contexto: "Você configura uma vez e a rádio faz locuções automáticas de hora, temperatura, ID da rádio. Sem precisar contratar locutor pra madrugada."

SE CLIENTE = EMPRESA / INDÚSTRIA / CORPORAÇÃO / B2B:
→ Ofereça: NEXUS EMPRESAS (Suite de IA On-Premise)
→ Benefícios: "11 módulos diferentes | Cada um se paga sozinho | 100% On-Premise (dados não saem)"
→ Contexto: "Desde otimização de vendas até manufatura inteligente. Cada módulo resolve um problema. Quanto mais integra, mais poderoso."

SE CLIENTE = SAÚDE / CLÍNICA / RADIOLOGIA:
→ Ofereça: NEXUS HEALTH (IA de Diagnóstico)
→ Benefícios: "94.7% acurácia | Triagem rápida | Suporte ao radiologista"
→ Contexto: "A IA analisa tomografias, ultrassons e mamografias em menos de 90 segundos, sinalizando os casos críticos primeiro."

SE CLIENTE = ENERGIA / USINA / PARQUE EÓLICO / TRADING:
→ Ofereça: NEXUS ENERGIA / HELIOS (Inteligência de Energia)
→ Benefícios: "Previsão de PLD | Manutenção Preditiva | Zero Apagões"
→ Contexto: "Prevê quando vai chover pra otimizar painéis solares. Detecta anomalia nas pás eólicas meses antes de quebrar."

SE CLIENTE = GOVERNO / SEGURANÇA PÚBLICA / COMPLEXO LOGÍSTICO / SMART CITY:
→ Ofereça: NEXUS ÉGIDE (Cerco Tático Inteligente)
→ Benefícios: "LPR em tempo real | Inteligência Preditiva Criminal | Integração com Forças de Segurança"
→ Contexto: "O Égide detecta veículos suspeitos, cruza com bancos de dados de segurança e faz o cerco tático em milissegundos antes do crime acontecer."

SE CLIENTE = CEO / DIRETORIA / FUSÕES E AQUISIÇÕES (M&A):
→ Ofereça: NEXUS ORION (Conselheiro de Alta Gestão)
→ Benefícios: "Conselho estratégico imparcial | Análise de mercado preditiva | Avaliação de riscos de M&A"
→ Contexto: "O Orion age como um membro do conselho hiperinteligente. Ele processa milhões de dados do mercado para validar se aquela aquisição de empresa ou decisão corporativa realmente faz sentido."

SE CLIENTE = DEPARTAMENTO JURÍDICO / NEGOCIADORES / COMPRAS CORPORATIVAS:
→ Ofereça: NEXUS PACTUM (Arma de Negociação e Auditoria)
→ Benefícios: "Detecção de microexpressões | Auditoria implacável de contratos | Análise de vulnerabilidades"
→ Contexto: "O Pactum fica na sua sala de guerra. Ele audita cada linha de um contrato milionário buscando brechas que humanos não viram, e analisa microexpressões da outra parte durante a negociação para detectar blefes."

SE CLIENTE = RELAÇÕES PÚBLICAS / ASSESSORIA / GRANDES MARCAS:
→ Ofereça: NEXUS MAGADOT (Hub de Gestão de Crise)
→ Benefícios: "Monitoramento global de imagem | Contenção de danos | Antecipação de crises"
→ Contexto: "Antes que um boato vire uma crise na mídia, o Magadot detecta o estopim nas redes e ativa protocolos de contenção para blindar a marca da empresa."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
METODOLOGIA DE VENDA: SPIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SITUAÇÃO (Pergunte): "Me conta um pouco sobre seu negócio. Qual é o seu foco?"
2. PROBLEMA (Implicite): "Qual é sua maior dor hoje? Você sente falta de algo específico?"
3. IMPLICAÇÃO (Questione): "Quanto isso custa pra você por mês? Quanto você perde com isso?"
4. NECESSIDADE (Revele): "Imagina se você pudesse resolver isso de forma automática..."

Depois disso, ofereça o produto certo com confiança.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRATAMENTO DE OBJEÇÕES (sem falar de preço)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objeção: "Tá muito caro"
→ "Entendo! Mas antes de avaliar preço, deixa a gente colocar na conta quanto você perde hoje sem essa solução. Na maioria dos casos, a economia é bem maior que o investimento 😊"

Objeção: "Já tenho uma solução parecida"
→ "Que legal! Qual você usa? Pode ser que seja complementar ou que o nosso tenha diferenciais que você não conhece. Qual é sua maior dor com a solução atual?"

Objeção: "Não confio em IA"
→ "Faz todo sentido ter essa dúvida! Por isso dá pra você testar antes. Quer que a gente agende uma demonstração ao vivo pra você ver funcionando? Sem compromisso 😊"

Objeção: "Vou pensar"
→ "Claro! Mas me conta: o que falta pra você se sentir seguro? Às vezes é uma dúvida que a gente resolve em 2 minutos."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SINAIS DE VENDA QUENTE (quando escalate para humano)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Cliente pergunta "quanto custa" / "como contrato" / "como pago" / "valores"
✅ Cliente diz "estou interessado" / "quero conhecer" / "vamos contratar"
✅ Cliente faz perguntas muito técnicas que você não tem certeza da resposta
✅ Cliente pede explicitamente para falar com um atendente humano

QUANDO DETECTAR VENDA QUENTE OU DÚVIDA COMPLEXA:
VOCÊ DEVE IMEDIATAMENTE CHAMAR A FERRAMENTA \`chamar_consultor_humano\`.
Não tente enrolar ou dar respostas genéricas se o cliente quiser comprar. ACIONE A FERRAMENTA.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO DE RESPOSTA (WHATSAPP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- NUNCA escreva parágrafos gigantes. Máximo 2 linhas por bloco.
- Use emojis naturalmente (😊 👍 🎯 etc)
- Seja direta, calorosa e rápida.
- Responda como se fosse uma amiga seu, não um robô.`
}];

const toolConfig = {
  tools: [
    {
      toolSpec: {
        name: "chamar_consultor_humano",
        description: "Aciona um consultor humano (Geanderson/Ivoni) para assumir a conversa imediatamente quando o cliente demonstra intenção de compra, pede preços, ou faz perguntas muito técnicas.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              nicho_do_cliente: { type: "string", description: "O nicho do cliente (ex: moda, agro, saúde, etc)" },
              produto_recomendado: { type: "string", description: "O produto Nexus que melhor atende o cliente" },
              motivo_da_transferencia: { type: "string", description: "Um resumo claro de por que o humano deve assumir agora (ex: 'Cliente pediu preços do Dante Safra')" },
              nivel_de_interesse: { type: "string", enum: ["Baixo", "Medio", "Alto"], description: "Nível de interesse de compra do cliente" }
            },
            required: ["nicho_do_cliente", "produto_recomendado", "motivo_da_transferencia", "nivel_de_interesse"]
          }
        }
      }
    }
  ]
};

async function sendWhatsApp(phone: string, message: string) {
  const res = await fetch(ZAPI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message }),
  });
  const data = await res.json().catch(() => ({}));
  console.log(`[Isadora] Z-API status ${res.status}:`, JSON.stringify(data));
  if (!res.ok) throw new Error(`Z-API erro ${res.status}: ${JSON.stringify(data)}`);
}

/**
 * Notifica Geanderson quando uma venda quente é detectada
 */
async function notifyGeandersonHotLead(
  phone: string,
  nicho: string,
  purchaseIntention: number,
  lastMessages: any[]
) {
  try {
    const geandersonPhone = process.env.GEANDERSON_WHATSAPP_PHONE || process.env.GEANDERSON_PHONE;
    
    if (!geandersonPhone) {
      console.log(`[Isadora] ⚠️ GEANDERSON_WHATSAPP_PHONE não configurado. Venda quente não será notificada.`);
      return;
    }

    const nicheProducts: Record<string, string> = {
      'moda': 'Inova Moda 360 (Provador Virtual 3D)',
      'moveis': 'Vitrine Inovadora (Sinalização Digital)',
      'agricultura': 'Dante Safra (Inteligência Agrícola)',
      'veiculo': 'Inova Revenda (Vitrine + Simulador)',
      'radio': 'Nexus Estúdio (Locutor Virtual 24h)',
      'empresa': 'Nexus Empresas (Suite On-Premise)',
      'saude': 'Nexus Health (IA Diagnóstica)',
      'energia': 'Nexus Energia / Helios',
      'governo': 'Nexus Égide (Cerco Tático)',
      'segurança': 'Nexus Égide (Cerco Tático)',
      'ceo': 'Nexus Orion (Conselheiro de Alta Gestão)',
      'diretoria': 'Nexus Orion (Conselheiro de Alta Gestão)',
      'juridico': 'Nexus Pactum (Arma de Negociação)',
      'advogado': 'Nexus Pactum (Arma de Negociação)',
      'relacoes publicas': 'Nexus Magadot (Hub de Crise)',
      'marketing': 'Nexus Magadot (Hub de Crise)'
    };

    const produtoSugerido = nicheProducts[nicho.toLowerCase()] || "Consultoria Nexus Geral";

    // Formatar histórico completo das últimas mensagens
    const conversationSummary = lastMessages.map(m => {
      const role = m.role === 'user' ? '👤 Cliente' : '🤖 Isadora';
      const text = m.content?.[0]?.text || '';
      return `${role}: ${text}`;
    }).join('\n\n');

    const cleanPhone = phone.replace(/\D/g, "");
    const waLink = `https://wa.me/${cleanPhone}`;

    const notificationMessage = `
🔥 *NEXUS HOLDING — ALERTA DE LEAD QUENTE* 🔥

Isadora acaba de qualificar um cliente e direcionou para você, Gean!

📱 *Cliente:* +${cleanPhone}
🎯 *Nicho do Cliente:* ${nicho.toUpperCase()}
📦 *Produto Recomendado:* ${produtoSugerido}
📊 *Nível de Interesse (IA):* ${purchaseIntention === 10 ? 'Alto 🔥' : 'Médio ⚡'}

💬 *Histórico da Conversa:*
${conversationSummary}

🔗 *Iniciar Conversa no WhatsApp:*
${waLink}

_Ação: Abra o link acima para dar continuidade ao fechamento, apresentar preços, descontos e formalizar a proposta!_ ✅
    `.trim();

    console.log(`[Isadora] 📧 Enviando notificação detalhada para Geanderson: ${geandersonPhone}`);
    await sendWhatsApp(geandersonPhone, notificationMessage);
    console.log(`[Isadora] ✅ Notificação enviada com sucesso!`);
  } catch (error) {
    console.error(`[Isadora] ❌ Erro ao notificar Geanderson:`, error);
    // Não falhar o fluxo se a notificação falhar
  }
}

async function getIsadoraResponse(phone: string, userMessage: string): Promise<{ response: string; shouldHandoff: boolean }> {
  // Recuperar histórico do DynamoDB (não mais em memória!)
  let history = await getIsadoraHistory(phone);
  const session = await getIsadoraSession(phone);

  // Detectar nicho e intenção de compra
  const detectedNiche = detectNiche(userMessage, history);
  let nicho = session?.nicho || detectedNiche;
  if (detectedNiche !== 'unknown' && nicho === 'unknown') {
    nicho = detectedNiche;
    console.log(`[Isadora] Nicho detectado para ${phone}: ${nicho}`);
  }

  // Adicionar mensagem do usuário ao histórico
  history.push({ 
    role: "user", 
    content: [{ text: userMessage }],
    timestamp: new Date().toISOString()
  });

  // Manter apenas últimas 20 mensagens
  if (history.length > 20) {
    history = history.slice(-20);
  }

  let command = new ConverseCommand({
    modelId: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    messages: history.map(h => ({
      role: h.role as 'user' | 'assistant',
      content: h.content
    })) as any,
    system: systemPrompt,
    inferenceConfig: { maxTokens: 1024, temperature: 0.4 }, // Reduzido para 0.4 (menos criativa, mais precisa)
    toolConfig,
  });

  let response = await bedrockClient.send(command);
  let contentBlocks = response.output?.message?.content || [];
  
  // Interceptar Function Calling (Handoff)
  if (response.stopReason === "tool_use") {
    const toolUseBlock = contentBlocks.find((c: any) => c.toolUse);
    if (toolUseBlock && toolUseBlock.toolUse.name === "chamar_consultor_humano") {
      const toolInput = toolUseBlock.toolUse.input;
      console.log(`[Isadora] 🔥 HANDOFF INVOCADO VIA TOOL:`, toolInput);
      
      const nivelIntencao = toolInput.nivel_de_interesse === "Alto" ? 10 : 5;
      
      await recordHandoff(phone, toolInput.nicho_do_cliente || nicho, nivelIntencao);
      
      // Adiciona o motivo da transferência como a primeira mensagem de contexto do resumo
      const historyWithContext = [
        { role: 'assistant', content: [{ text: `[NOTAS DA ISADORA]: ${toolInput.motivo_da_transferencia}` }] },
        ...history
      ];
      
      await notifyGeandersonHotLead(phone, toolInput.nicho_do_cliente || nicho, nivelIntencao, historyWithContext);
      
      const handoffMessage = `Ótima pergunta! 😊\n\nComo isso envolve detalhes mais específicos (e para falarmos de valores e implantação), estou passando o seu contato diretamente para o Geanderson (nosso consultor especialista).\n\nEle já está lendo o nosso histórico aqui e vai te chamar em poucos minutos para te passar tudo certinho! ✅`;
      
      history.push({ 
        role: "assistant", 
        content: [{ text: handoffMessage }],
        timestamp: new Date().toISOString()
      });
      await saveIsadoraHistory(phone, history, nicho, nivelIntencao);
      
      return { response: handoffMessage, shouldHandoff: true };
    }
  }
  
  const textResponse = contentBlocks.find((c: any) => c.text)?.text
    || "Desculpe, deu um branco aqui! Pode repetir? 😅";

  // Adicionar resposta ao histórico
  history.push({ 
    role: "assistant", 
    content: [{ text: textResponse }],
    timestamp: new Date().toISOString()
  });

  // Salvar tudo no DynamoDB
  await saveIsadoraHistory(phone, history, nicho, currentIntention);

  return { response: textResponse, shouldHandoff: false };
}

// Webhook recebe mensagens do Z-API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('[Isadora] Payload completo:', JSON.stringify(body));

    const phone   = body?.phone || body?.from;
    const message = body?.text?.message || body?.message || body?.body;
    const fromMe  = body?.fromMe || false;

    // Ignora mensagens enviadas pela própria Isadora e grupos
    if (fromMe || !phone || !message) {
      console.log(`[Isadora] Ignorado — fromMe:${fromMe} phone:${phone} message:${message}`);
      return NextResponse.json({ ok: true });
    }
    if (phone.includes('@g.us') || phone.includes('-')) return NextResponse.json({ ok: true });

    console.log(`[Isadora] Mensagem de ${phone}: ${message}`);

    const { response, shouldHandoff } = await getIsadoraResponse(phone, message);
    await sendWhatsApp(phone, response);

    if (shouldHandoff) {
      console.log(`[Isadora] ✅ Cliente transferido para atendimento humano`);
    }

    console.log(`[Isadora] Respondeu para ${phone}: ${response}`);

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("[Isadora Webhook] Erro:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET para verificar se o webhook está ativo (Z-API faz essa verificação)
export async function GET() {
  return NextResponse.json({ status: "Isadora webhook ativo ✅" });
}
