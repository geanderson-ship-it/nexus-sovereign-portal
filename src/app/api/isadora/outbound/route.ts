import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "http://100.59.197.161:8080";
const EVOLUTION_GLOBAL_APIKEY = process.env.EVOLUTION_GLOBAL_APIKEY || "nexus";
const INSTANCE_NAME = process.env.ISADORA_INSTANCE || "NexusTreinamentoVendas";

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GERA PRIMEIRO ACENO PERSONALIZADO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function gerarPrimeiroAceno(nome: string, segmento: string): Promise<string> {
  const prompt = `Você é a Isadora, Executiva de Alta Performance da Nexus Holding Group.

Gere uma PRIMEIRA MENSAGEM de prospecção ativa para enviar pelo WhatsApp para:
- Nome: ${nome}
- Segmento: ${segmento}

REGRAS CRÍTICAS:
- Máximo 3 linhas. Seja direta e executiva.
- NÃO use "Olá!" como abertura. Comece de forma impactante.
- Mencione de forma sutil que você mapeou a empresa/pessoa.
- Termine com UMA pergunta aberta sobre o negócio deles.
- Sem emojis excessivos. No máximo 1.
- Tom: executivo, elegante, direto ao ponto.
- NÃO mencione preços ou produtos nesta primeira mensagem.

Exemplo de tom (NÃO copie, crie algo original):
"Bom dia, [Nome]. Sou a Isadora, Executiva da Nexus Holding Group.
Estávamos mapeando referências em [segmento] na região e seu contato chegou até nós.
Você tem 2 minutos para uma conversa rápida sobre inovação no seu setor?"

Responda APENAS com a mensagem, sem explicações.`;

  const command = new ConverseCommand({
    modelId: "us.anthropic.claude-sonnet-4-6",
    messages: [{ role: "user", content: [{ text: prompt }] }],
    inferenceConfig: { maxTokens: 200, temperature: 0.7 },
  });

  const response = await bedrock.send(command);
  return response.output?.message?.content?.[0]?.text || `Bom dia, ${nome}. Sou a Isadora, da Nexus Holding Group. Estamos mapeando lideranças no setor de ${segmento}. Teria um momento para conversarmos?`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENVIA VIA EVOLUTION/Z-API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function enviarWhatsApp(phone: string, message: string): Promise<boolean> {
  const numero = phone.replace(/\D/g, '').replace(/^55/, '');
  const payload = {
    number: `55${numero}@s.whatsapp.net`,
    text: message,
  };

  const res = await fetch(`${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_GLOBAL_APIKEY,
    },
    body: JSON.stringify(payload),
  });

  return res.ok;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROTA POST — Dispara Isadora para um contato
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, nome, segmento } = body;

    if (!phone || !nome || !segmento) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: phone, nome, segmento' },
        { status: 400 }
      );
    }

    // Verifica horário comercial (08h–20h no horário de Brasília)
    const agora = new Date();
    const horaBrasilia = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const hora = horaBrasilia.getHours();

    if (hora < 8 || hora >= 20) {
      return NextResponse.json(
        { error: `Fora do horário comercial (08h–20h). Hora atual em Brasília: ${hora}h.` },
        { status: 400 }
      );
    }

    // Gera a mensagem personalizada
    const mensagem = await gerarPrimeiroAceno(nome, segmento);

    // Envia via WhatsApp
    const enviado = await enviarWhatsApp(phone, mensagem);

    if (!enviado) {
      return NextResponse.json(
        { error: 'Falha ao enviar via WhatsApp. Verifique se a instância está ativa.' },
        { status: 500 }
      );
    }

    console.log(`[Isadora Outbound] ✅ Disparado para ${nome} (${phone}) | Segmento: ${segmento}`);

    return NextResponse.json({
      ok: true,
      mensagem,
      phone,
      nome,
      timestamp: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error('[Isadora Outbound] Erro:', err);
    return NextResponse.json(
      { error: err.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
