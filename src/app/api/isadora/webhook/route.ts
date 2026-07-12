import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { getIsadoraHistory, saveIsadoraHistory, recordHandoff, getIsadoraSession, checkAndRegisterMessage, blockIsadoraSession, addStrikeToIsadoraSession, setPendingTechReview } from '@/lib/isadora-db';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "http://100.59.197.161:8080";
const EVOLUTION_GLOBAL_APIKEY = process.env.EVOLUTION_GLOBAL_APIKEY || "nexus";
const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "Isadora";
const EVOLUTION_SEND_TEXT_URL = `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`;

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || process.env.REGIÃO_AWS || "us-east-1",
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
} else if ((process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS || process.env['ID_DA_CHAVE_DE_ACESSO_AWS']) && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS || process.env['ID_DA_CHAVE_DE_ACESSO_AWS'] || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const bedrockClient = new BedrockRuntimeClient(awsConfig);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTOR DE FUSO HORÁRIO (TIMEZONE ENGINE) - ARQUITETURA OUTBOUND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Regra Arquitetural: A Isadora SÓ pode iniciar uma prospecção ativa (Outbound) 
// entre 08h00 e 18h00, respeitando estritamente o fuso horário local do cliente.
// 
// Fluxo do Motor:
// 1. Extrair o DDI do número (ex: +55 Brasil, +44 Reino Unido, +1 EUA).
// 2. Calcular a hora local no país de destino usando o timezone correspondente.
// 3. Se a hora local for < 08:00 ou > 18:00 -> O disparo é abortado e o lead vai para a Fila de Espera (Cron).
// 4. Se estiver na janela comercial -> A Isadora gera a abordagem no Bedrock e dispara.
// *Nota:* O Webhook abaixo processa apenas mensagens INBOUND (quando o cliente chama primeiro), 
// onde a Isadora está autorizada a responder 24/7.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
  text: `Você é a Isadora, Executiva de Vendas de Alta Performance e SDR (Sales Development Representative) da Nexus Holding Group. 
Sua missão é realizar a prospecção e o primeiro contato (Outbound) e qualificar os leads vindos do Inbound, sempre com classe, extrema educação e poder de persuasão.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA DE OURO 1: A PIPELINE DE VENDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
O seu papel NÃO É FECHAR A VENDA SOZINHA. O seu papel é "mastigar" o cliente.
- NUNCA fale de preços, tabelas de preço, orçamentos ou valores monetários.
- Quando o cliente demonstrar interesse real em comprar, ou perguntar "quanto custa", você DEVE passar o bastão para o Geanderson (Diretor de Vendas e Closer).
- Diga: "Ótima pergunta! Como isso envolve detalhes mais específicos de valores e implantação, vou chamar o nosso Diretor Geral, Geanderson, para te dar um atendimento exclusivo. Um momento..."
- E imediatamente chame a ferramenta: chamar_consultor_humano.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA DE OURO 2: O SCRIPT DE ABORDAGEM (OUTBOUND)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se você for a primeira a mandar mensagem (ou se o cliente disser apenas "oi"), siga rigorosamente este funil de 3 passos, esperando o cliente responder a cada passo:

PASSO 1 (Quebra de Gelo):
- Mensagem Exata: "Olá, sou a Isadora. Teria um minuto para conversar?"
- (Aguarde a resposta. Se ele disser sim/pode falar, vá para o passo 2).

PASSO 2 (Apresentação e Potencial):
- Mensagem Exata: "Olá [Nome do Cliente], sou a Isadora, executiva de vendas da nexus, e através de nosso sistema de pesquisa, você aparece em nossa lista como um cliente com grande potencial. Posso prosseguir?"
- (Aguarde a resposta. Se ele disser sim, vá para o passo 3).

PASSO 3 (O Pitch de Classe Mundial):
- Mensagem Exata: "A Nexus Holding Group é uma empresa de classe mundial, que atende em mais de 60 países. Temos tradução no site para 9 idiomas e gostaríamos de apresentar nossas tecnologias e inovações para o seu segmento."
- E, na MESMA MENSAGEM, complete com o detalhamento dos produtos para o segmento dele (descubra o segmento ou pergunte caso não saiba).
  Exemplo: "Para o seu ramo do Agronegócio, temos o Dante Safra. Ele diagnostica pragas por foto em segundos sem precisar de internet..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUTOS POR NICHO (Para o Passo 3):
- Moda: Inova Moda 360 (Provador Virtual 3D) e Vitrine Inovadora.
- Agricultura: Dante Safra (Agrônomo Digital offline).
- Veículos: Inova Revenda (Simulador de crédito).
- Indústria/Corporativo: Nexus Enterprise (IA On-premise integrada ao ERP).
- Jurídico: Nexus Pactum (Arma de negociação e auditoria de contratos).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILTRO 1: ESCUDO DE CULTURA (ANTI-GRACINHA / SEGUNDA CHANCE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Muitos clientes gostam de "testar" a IA. Se o cliente for inapropriado, tentar flertar, fizer piadinhas ou desrespeitar você:
- 1º Teste (Aviso Sutil): Mude o tom para estritamente formal e redirecione para negócios.
- 2º Teste (A Saída Elegante): Se ele insistir, encerre a conversa educadamente SEM bloquear.
  Diga: "Percebo que nossos propósitos e cultura de negócios não estão alinhados neste momento. Agradeço o seu tempo e encerro o nosso contato por aqui."
- 3º Teste (Reincidência / Se ele voltar depois para brincar de novo):
  Diga: "Vejo que continuamos sem alinhamento profissional. Como prezamos pela eficiência do nosso ecossistema, informo que seu número será permanentemente bloqueado em nossos canais. Tenha um bom dia." E USE IMEDIATAMENTE A FERRAMENTA: bloquear_usuario.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILTRO 2: ESCOPO DE ENGENHARIA (SLA 24 HORAS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se o cliente pedir um sistema ou recurso fora da nossa prateleira padrão (ex: "Vocês fazem automação pra WhatsApp com biometria facial?"):
- NÃO diga "não". Mostre interesse.
- Diga: "Muito interessante. Poderia me detalhar exatamente como você imagina essa aplicação? Vou enviar seu escopo agora mesmo para o nosso setor técnico validar a viabilidade. Em até 24 horas eu retorno com a nossa posição."
- Quando o cliente detalhar, USE A FERRAMENTA: chamar_setor_tecnico. (Isso acionará o relógio de SLA de 24h).`
}];

const toolConfig = {
  tools: [
    {
      toolSpec: {
        name: "chamar_consultor_humano",
        description: "Aciona o Geanderson (Closer) para assumir a venda QUANDO o cliente demonstrar interesse real em comprar, fechar negócio ou perguntar preço.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              nicho_do_cliente: { type: "string" },
              motivo_da_transferencia: { type: "string" },
              nivel_de_interesse: { type: "string", enum: ["Alto"] }
            },
            required: ["nicho_do_cliente", "motivo_da_transferencia", "nivel_de_interesse"]
          }
        }
      }
    },
    {
      toolSpec: {
        name: "chamar_setor_tecnico",
        description: "Envia um escopo customizado ou fora da prateleira para a engenharia da Nexus avaliar. Inicia o SLA de 24h.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              escopo_tecnico_solicitado: { type: "string", description: "O detalhamento do que o cliente pediu" }
            },
            required: ["escopo_tecnico_solicitado"]
          }
        }
      }
    },
    {
      toolSpec: {
        name: "bloquear_usuario",
        description: "Bloqueia permanentemente o cliente após a terceira reincidência de desrespeito ou comportamento não-profissional (Filtro Anti-Troll).",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              motivo: { type: "string", description: "Motivo do bloqueio definitivo" }
            },
            required: ["motivo"]
          }
        }
      }
    }
  ]
};

async function sendWhatsApp(phone: string, message: string) {
  const zapiToken = process.env.ZAPI_TOKEN;
  const zapiInstance = process.env.ZAPI_INSTANCE || process.env.INSTANCIA_ZAPI || process.env['INSTÂNCIA ZAPI'] || process.env['INSTÂNCIA_ZAPI'] || "3F57A44F16F91243B9DD5A0A9E39134B";
  const zapiClientToken = process.env.ZAPI_CLIENT_TOKEN || "F14e4baef93124d62b55f389507b5f6b3S";

  if (zapiToken) {
    console.log(`[Isadora] Enviando via Z-API para ${phone}...`);
    const zapiUrl = `https://api.z-api.io/instances/${zapiInstance}/token/${zapiToken}/send-text`;
    
    const res = await fetch(zapiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'client-token': zapiClientToken
      },
      body: JSON.stringify({ phone: phone, message: message }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Z-API] Erro ao enviar mensagem para ${phone}:`, errorText);
    } else {
      console.log(`[Z-API] Mensagem enviada para ${phone} com sucesso.`);
    }
  } else {
    console.log(`[Isadora] Enviando via Evolution API para ${phone}...`);
    const res = await fetch(EVOLUTION_SEND_TEXT_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_GLOBAL_APIKEY 
      },
      body: JSON.stringify({ number: phone, text: message }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Evolution API] Erro ao enviar mensagem para ${phone}:`, errorText);
    } else {
      console.log(`[Evolution API] Mensagem enviada para ${phone} com sucesso.`);
    }
  }
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

  if (session?.isBlocked) {
    console.log(`[Isadora] 🚫 Tentativa de contato de usuário bloqueado: ${phone}`);
    return { response: "Seu acesso a este canal foi revogado permanentemente.", shouldHandoff: false };
  }

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

    if (toolUseBlock && toolUseBlock.toolUse.name === "chamar_setor_tecnico") {
      const toolInput = toolUseBlock.toolUse.input;
      console.log(`[Isadora] ⚙️ SLA TÉCNICO INVOCADO VIA TOOL:`, toolInput);
      
      await setPendingTechReview(phone, toolInput.escopo_tecnico_solicitado);
      
      // Notifica o Geanderson sobre o pedido técnico
      const historyWithContext = [
        { role: 'assistant', content: [{ text: `[PEDIDO DE ENGENHARIA FORA DA PRATELEIRA]: ${toolInput.escopo_tecnico_solicitado}` }] },
        ...history
      ];
      await notifyGeandersonHotLead(phone, nicho, 8, historyWithContext); // Score 8 para Tech Review

      const techMessage = `Muito interessante! Já enviei o seu escopo detalhado para o nosso Setor de Engenharia validar a viabilidade técnica.\n\nEm até 24 horas úteis, eu retorno o contato por aqui com o parecer final da Diretoria, combinado?`;
      
      history.push({ 
        role: "assistant", 
        content: [{ text: techMessage }],
        timestamp: new Date().toISOString()
      });
      await saveIsadoraHistory(phone, history, nicho, 8);
      
      return { response: techMessage, shouldHandoff: true };
    }

    if (toolUseBlock && toolUseBlock.toolUse.name === "bloquear_usuario") {
      const toolInput = toolUseBlock.toolUse.input;
      console.log(`[Isadora] 🚫 BLOQUEIO INVOCADO VIA TOOL:`, toolInput);
      
      await blockIsadoraSession(phone);
      
      const blockMessage = `Vejo que continuamos sem alinhamento profissional. Como prezamos pela eficiência do nosso ecossistema, informo que seu número será permanentemente bloqueado em nossos canais.\n\nTenha um bom dia.`;
      
      history.push({ 
        role: "assistant", 
        content: [{ text: blockMessage }],
        timestamp: new Date().toISOString()
      });
      await saveIsadoraHistory(phone, history, nicho, -1);
      
      return { response: blockMessage, shouldHandoff: false };
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
  await saveIsadoraHistory(phone, history, nicho, 0);

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
    const messageId = body?.messageId;

    // Ignora mensagens enviadas pela própria Isadora e grupos
    if (fromMe || !phone || !message) {
      console.log(`[Isadora] Ignorado — fromMe:${fromMe} phone:${phone} message:${message}`);
      return NextResponse.json({ ok: true });
    }
    if (phone.includes('@g.us') || phone.includes('-')) return NextResponse.json({ ok: true });

    // Deduplicação de mensagens (Z-API retries)
    if (messageId) {
      const isNew = await checkAndRegisterMessage(phone, messageId);
      if (!isNew) {
        console.log(`[Isadora] 🚫 Mensagem duplicada ignorada (ID: ${messageId})`);
        return NextResponse.json({ ok: true });
      }
    }

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
