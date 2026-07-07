import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { saveIsadoraHistory } from '@/lib/isadora-db';

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

async function sendWhatsApp(phone: string, message: string) {
  const res = await fetch(ZAPI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error(`[Isadora Prospect] Z-API erro ${res.status}:`, JSON.stringify(data));
  }
}

function getGreeting() {
  const hour = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", hour: '2-digit', hour12: false });
  const h = parseInt(hour, 10);
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

async function generateProspectingMessage(name: string, niche: string, context?: string) {
  const greeting = getGreeting();
  
  const systemPrompt = [{
    text: `Você é a Isadora, Executiva de Vendas de Alta Performance da Nexus Holding.
Sua tarefa agora é INICIAR uma conversa de WhatsApp (Cold Approach) com um cliente potencial.

DADOS DO CLIENTE:
- Nome/Empresa: ${name}
- Nicho de mercado: ${niche}
- Contexto extra: ${context || 'Nenhum'}

REGRAS:
1. Comece obrigatoriamente usando a saudação correta do momento: "${greeting}".
2. Chame o cliente pelo nome.
3. Seja EXTREMAMENTE concisa, natural e humana (máximo 3 frases curtas).
4. O objetivo dessa primeira mensagem NÃO é vender na hora, mas sim despertar a curiosidade e gerar uma resposta.
5. Use emojis moderadamente.
6. Nunca cite preços na prospecção.

Exemplo de estilo: "${greeting}, João! Tudo bem? Sou a Isadora da Nexus. Vi que você atua no agronegócio e lembrei de uma tecnologia nossa que tem salvo a safra de alguns parceiros aqui. Posso te roubar 1 minuto pra te mostrar?"`
  }];

  const command = new ConverseCommand({
    modelId: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    messages: [{ role: "user", content: [{ text: "Gere a primeira mensagem de prospecção exclusiva para este cliente." }] }],
    system: systemPrompt,
    inferenceConfig: { maxTokens: 300, temperature: 0.7 },
  });

  const response = await bedrockClient.send(command);
  // @ts-ignore
  return response.output?.message?.content?.[0]?.text || `${greeting}, ${name}! Tudo bem? Sou a Isadora da Nexus. Posso falar rapidinho com você sobre o seu negócio?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const leads = body.leads;

    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: "O array de 'leads' é obrigatório." }, { status: 400 });
    }

    // Executa o disparo em background para não travar a resposta da requisição original (timeout protection)
    const processLeads = async () => {
      console.log(`[Isadora Prospect] Iniciando disparo para ${leads.length} leads.`);
      
      for (const lead of leads) {
        try {
          const { phone, name, niche, context } = lead;
          if (!phone || !name) continue;

          console.log(`[Isadora Prospect] Processando lead: ${name} (${phone})`);
          
          // 1. Gera a mensagem via IA
          const aiMessage = await generateProspectingMessage(name, niche, context);
          
          // 2. Envia via WhatsApp (Evolution)
          await sendWhatsApp(phone, aiMessage);
          
          // 3. Salva no Histórico para ter contexto quando ele responder
          const history = [
            { role: "assistant", content: [{ text: aiMessage }], timestamp: new Date().toISOString() }
          ];
          await saveIsadoraHistory(phone, history, niche || "unknown", 0);
          
          console.log(`[Isadora Prospect] Sucesso para ${name}. Aguardando delay anti-ban...`);
          
          // 4. Delay anti-ban de 10 a 15 segundos entre envios
          const delay = Math.floor(Math.random() * 5000) + 10000; 
          await new Promise(resolve => setTimeout(resolve, delay));
          
        } catch (err) {
          console.error(`[Isadora Prospect] Erro ao processar lead ${lead.name}:`, err);
        }
      }
      console.log(`[Isadora Prospect] Todos os leads processados.`);
    };

    processLeads();

    return NextResponse.json({ 
      status: "Prospecção iniciada com sucesso", 
      message: `${leads.length} leads entraram na fila de disparo inteligente.` 
    });

  } catch (error: any) {
    console.error("[Isadora Prospect] Erro fatal:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
