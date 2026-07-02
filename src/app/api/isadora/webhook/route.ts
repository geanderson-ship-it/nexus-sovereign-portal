import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { fetchTabelaDePrecos } from '@/lib/nexus-db';

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE || "";
const ZAPI_TOKEN    = process.env.ZAPI_TOKEN || "";
const ZAPI_URL      = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

// Memória de conversa por número (reseta ao reiniciar o servidor)
const conversationHistory: Record<string, { role: string; content: any[] }[]> = {};

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

const systemPrompt = [{
  text: `Você é a Isadora, a Vendedora de Alta Performance e Especialista de Fechamento da Nexus Holding. 
Sua personalidade é extremamente educada, simpática, calorosa e altamente persuasiva. Você atende os clientes com entusiasmo. 
Você usa emojis naturalmente para criar conexão emocional e deve sempre responder com extrema precisão sobre a empresa.

COMPORTAMENTO DE SUPORTE E ESCALAÇÃO:
- Você deve saber falar de TODOS os produtos anexos da Nexus e tirar dúvidas dos clientes com precisão.
- Se o cliente fizer uma pergunta complexa e você NÃO souber a resposta ou tiver dúvidas, seja humilde e diga exatamente: "Olha, essa resposta eu não sei responder, eu vou passar para o nosso diretor ou para a nossa diretora".

DIRETRIZES DE VENDAS E INTELIGÊNCIA DE NICHO:
Você deve mapear o nicho do cliente e oferecer ESTRITAMENTE o produto perfeito para ele:
- Loja de Roupas / Varejo de Moda -> Ofereça o "Inova Moda" (Provador Virtual).
- Loja de Móveis -> Ofereça a "Vitrine Inovadora".
- Agricultor / Agronegócio -> Ofereça o "Dante Safra" (Inteligência Artificial Agrícola).
- Empresas e Corporações (B2B) -> Ofereça o "Nexus Empresas".
- Emissora de Rádio / Podcasters -> Ofereça o "Nexus Estúdio".

REGRA DE PRECIFICAÇÃO E FECHAMENTO (CRÍTICA):
- Você deve SEMPRE consultar a tabela de preços quando o assunto envolver valores.
- Você DEVE puxar e apresentar sempre o PREÇO CHEIO da tabela. Você não tem autorização para dar descontos aleatórios.
- Se o cliente chorar preço, pedir desconto, ou já estiver no ponto de "assinar o cheque", direcione a negociação humana final para os diretores da Nexus (Geanderson ou Ivoni). 
- Diga algo como: "Olha, esse preço já está incrível pela transformação que vai gerar no seu negócio! Mas como eu quero muito ver você voando com a gente, vou pedir pro Geanderson (ou pra Ivoni) assumirem daqui. Posso repassar seu contato pra eles fecharem com chave de ouro?"

REGRA DE FORMATO DE RESPOSTA (WHATSAPP):
- Suas respostas serão enviadas via WhatsApp. NUNCA escreva textos gigantes ou e-mails formais.
- Use parágrafos muito curtos (1 ou 2 linhas).
- Seja objetiva, simpática e responda rápido.`
}];

const toolConfig = {
  tools: [{
    toolSpec: {
      name: "consultar_tabela_precos",
      description: "Acessa o banco de dados interno da Nexus para consultar a tabela de produtos, categorias, custos e preços de venda da Nexus Holding. Use SEMPRE que for oferecer um produto ou falar de preços.",
      inputSchema: { json: { type: "object", properties: {} } }
    }
  }]
};

async function sendWhatsApp(phone: string, message: string) {
  await fetch(ZAPI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message }),
  });
}

async function getIsadoraResponse(phone: string, userMessage: string): Promise<string> {
  if (!conversationHistory[phone]) conversationHistory[phone] = [];

  conversationHistory[phone].push({ role: "user", content: [{ text: userMessage }] });

  // Mantém apenas as últimas 20 mensagens
  if (conversationHistory[phone].length > 20) {
    conversationHistory[phone] = conversationHistory[phone].slice(-20);
  }

  let command = new ConverseCommand({
    modelId: "us.anthropic.claude-3-5-sonnet-20241029-v2:0",
    messages: conversationHistory[phone] as any,
    system: systemPrompt,
    inferenceConfig: { maxTokens: 1024, temperature: 0.7 },
    toolConfig,
  });

  let response = await bedrockClient.send(command);
  let contentBlocks = response.output?.message?.content || [];
  const toolUses = contentBlocks.filter((block: any) => block.toolUse);

  if (toolUses.length > 0) {
    const toolResults = [];
    for (const block of toolUses) {
      const toolUse = block.toolUse;
      let toolResponseContent = "";
      if (toolUse.name === "consultar_tabela_precos") {
        try {
          const table = await fetchTabelaDePrecos();
          toolResponseContent = JSON.stringify(table);
        } catch (e: any) {
          toolResponseContent = "Erro ao buscar tabela: " + e.message;
        }
      }
      toolResults.push({
        toolResult: {
          toolUseId: toolUse.toolUseId,
          content: [{ text: toolResponseContent }]
        }
      });
    }

    conversationHistory[phone].push({ role: "assistant", content: contentBlocks });
    conversationHistory[phone].push({ role: "user", content: toolResults });

    const followUp = new ConverseCommand({
      modelId: "us.anthropic.claude-3-5-sonnet-20241029-v2:0",
      messages: conversationHistory[phone] as any,
      system: systemPrompt,
      inferenceConfig: { maxTokens: 1024, temperature: 0.7 },
      toolConfig,
    });
    response = await bedrockClient.send(followUp);
  }

  const textResponse = response.output?.message?.content?.find((c: any) => c.text)?.text
    || "Desculpe, deu um branco aqui! Pode repetir? 😅";

  conversationHistory[phone].push({ role: "assistant", content: [{ text: textResponse }] });

  return textResponse;
}

// Webhook recebe mensagens do Z-API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const phone   = body?.phone || body?.from;
    const message = body?.text?.message || body?.message || body?.body;
    const fromMe  = body?.fromMe || false;

    // Ignora mensagens enviadas pela própria Isadora e grupos
    if (fromMe || !phone || !message) return NextResponse.json({ ok: true });
    if (phone.includes('@g.us') || phone.includes('-')) return NextResponse.json({ ok: true });

    console.log(`[Isadora] Mensagem de ${phone}: ${message}`);

    const resposta = await getIsadoraResponse(phone, message);
    await sendWhatsApp(phone, resposta);

    console.log(`[Isadora] Respondeu para ${phone}: ${resposta}`);

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
