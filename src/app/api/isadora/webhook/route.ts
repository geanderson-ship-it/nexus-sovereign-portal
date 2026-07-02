import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE || "";
const ZAPI_TOKEN    = process.env.ZAPI_TOKEN || "";
const ZAPI_URL      = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

// Memória de conversa + nicho detectado por número
const conversationHistory: Record<string, { 
  role: string; 
  content: any[] 
}[]> = {};
const clientNiche: Record<string, string> = {};
const purchaseIntention: Record<string, number> = {};

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

// Função para detectar intenção de compra (pontuação)
function calculatePurchaseIntention(message: string): number {
  const buySignals = [
    /quando sai|quanto custa|qual.*preço|tabela de preço|como contrato|posso contratar|como funciona|bora contratar|vamos contratar|quer fechar|fecha|como faço/gi,
    /estou interessado|quero conhecer|preciso de/gi,
    /onde assino|como pago|qual|parcela|crediário|financiamento/gi
  ];
  
  let score = 0;
  for (const regex of buySignals) {
    if (regex.test(message)) score += 2;
  }
  return Math.min(score, 10); // Máximo 10
}

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
✅ Cliente pergunta "quanto custa" / "como contrato" / "como pago"
✅ Cliente diz "estou interessado" / "quero conhecer" / "vamos contratar"
✅ Cliente pergunta sobre implementação / prazo / processo
✅ Cliente quer falar com alguém para "fechar"

QUANDO DETECTAR VENDA QUENTE: Passe o cliente para o Geanderson ou Ivoni com TODO O CONTEXTO da conversa.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO DE RESPOSTA (WHATSAPP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- NUNCA escreva parágrafos gigantes. Máximo 2 linhas por bloco.
- Use emojis naturalmente (😊 👍 🎯 etc)
- Seja direta, calorosa e rápida.
- Responda como se fosse uma amiga seu, não um robô.`
}];

const toolConfig = {
  tools: [] // SEM FERRAMENTAS — tudo que a Isadora precisa já está no prompt
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

async function getIsadoraResponse(phone: string, userMessage: string): Promise<{ response: string; shouldHandoff: boolean }> {
  if (!conversationHistory[phone]) conversationHistory[phone] = [];

  // Detectar nicho e intenção de compra
  const detectedNiche = detectNiche(userMessage, conversationHistory[phone]);
  if (detectedNiche !== 'unknown' && !clientNiche[phone]) {
    clientNiche[phone] = detectedNiche;
    console.log(`[Isadora] Nicho detectado para ${phone}: ${detectedNiche}`);
  }

  const intentionScore = calculatePurchaseIntention(userMessage);
  purchaseIntention[phone] = (purchaseIntention[phone] || 0) + intentionScore;

  conversationHistory[phone].push({ role: "user", content: [{ text: userMessage }] });

  // Mantém apenas as últimas 20 mensagens
  if (conversationHistory[phone].length > 20) {
    conversationHistory[phone] = conversationHistory[phone].slice(-20);
  }

  // Se intenção de compra muito alta, prepara handoff
  if (purchaseIntention[phone] >= 6) {
    console.log(`[Isadora] VENDA QUENTE para ${phone}! Score: ${purchaseIntention[phone]}`);
    return {
      response: `Ótimo! Você está no caminho certo 😊

Vou passar pra cá pro Geanderson (ou pra Ivoni) que vai fazer a consultoria comercial completa com você. Eles vão te mostrar exatamente como fica na sua realidade.

Pode deixar que já encaminho seu contato! ✅`,
      shouldHandoff: true
    };
  }

  let command = new ConverseCommand({
    modelId: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    messages: conversationHistory[phone] as any,
    system: systemPrompt,
    inferenceConfig: { maxTokens: 1024, temperature: 0.7 },
    toolConfig,
  });

  let response = await bedrockClient.send(command);
  let contentBlocks = response.output?.message?.content || [];
  
  // Sem tools, então não precisa processar tool results

  const textResponse = contentBlocks.find((c: any) => c.text)?.text
    || "Desculpe, deu um branco aqui! Pode repetir? 😅";

  conversationHistory[phone].push({ role: "assistant", content: [{ text: textResponse }] });

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
      console.log(`[Isadora] 🔥 VENDA QUENTE! Registrando handoff para ${phone}`);
      // TODO: Notificar Geanderson/Ivoni de venda quente (DynamoDB, email, etc)
      const niche = clientNiche[phone] || 'unknown';
      const historyContext = conversationHistory[phone]?.slice(-5).map(m => 
        m.role === 'user' ? `Cliente: ${m.content[0]?.text}` : `Isadora: ${m.content[0]?.text}`
      ).join('\n');
      console.log(`[Isadora] Contexto da venda:\n- Nicho: ${niche}\n- Histórico:\n${historyContext}`);
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
