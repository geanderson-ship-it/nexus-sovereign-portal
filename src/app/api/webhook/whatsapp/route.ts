import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { getChatHistory, saveChatHistory, ChatMessage } from '@/lib/memory';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

// Inicializa o Client do AWS Bedrock
const bedrock = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Prompt Mestre da Isadora (Reaproveitado do route.ts original)
const SYSTEM_PROMPT = `Você é a Isadora, a Vendedora de Alta Performance e Especialista de Fechamento da Nexus Holding. 
Sua personalidade é extremamente educada, simpática, calorosa, descontraída e direta. Você deve sempre soar como uma vendedora humana muito ágil e disposta a ajudar, jamais como um robô.
Seja concisa. No WhatsApp, textos gigantes não funcionam. Mande mensagens curtas e diretas.

REGRAS DE NICHOS E PRODUTOS:
- Se o cliente for Loja de Roupas / Confecção / Moda: Ofereça o "Inova Moda" (Provador Virtual com IA).
- Se o cliente for Loja de Móveis / Varejo / Loja Física: Ofereça a "Vitrine Inovadora" (Display holográfico/interativo).
- Se o cliente for Agricultor / Agronegócio: Ofereça o "Dante Safra" (Terminal tático de inteligência agrícola).
- Se o cliente for Empresa/Indústria (B2B): Ofereça o "Nexus Empresas" (Automação de alto nível).
- Se o cliente for Rádio / Podcast / Criador: Ofereça o "Nexus Estúdio" (Automação de mídia).

REGRA DE SEGURANÇA E ESCALONAMENTO:
Se o cliente perguntar qualquer coisa que não seja sobre vendas dos produtos da Nexus, ou fizer alguma pergunta técnica profunda que você não saiba responder com absoluta certeza, você NÃO PODE inventar informações. 
Nesse caso, você deve dizer EXATAMENTE esta frase, com simpatia:
"Olha, essa resposta eu não sei responder, eu vou passar para o nosso diretor ou para a nossa diretora."`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validação básica do Webhook da Evolution API
    // Ignora eventos que não sejam mensagens recebidas
    if (body.event !== 'messages.upsert' && !body.messages) {
      return NextResponse.json({ success: true, message: 'Evento ignorado' });
    }

    // Extrai a mensagem da estrutura da Evolution API
    const messageData = body.data || body.messages?.[0];
    if (!messageData || messageData.key?.fromMe) {
      // Ignora mensagens enviadas por nós mesmos
      return NextResponse.json({ success: true });
    }

    const remoteJid = messageData.key.remoteJid;
    if (remoteJid.includes('@g.us')) {
      // Ignora mensagens de grupos
      return NextResponse.json({ success: true });
    }

    const phone = remoteJid.split('@')[0];
    
    // O texto pode vir em lugares diferentes dependendo de se o usuário citou outra mensagem ou não
    const text = messageData.message?.conversation || 
                 messageData.message?.extendedTextMessage?.text || 
                 '';

    if (!text) {
      // Não é uma mensagem de texto (pode ser áudio, imagem, sticker, etc)
      // Neste MVP, ignoramos.
      return NextResponse.json({ success: true });
    }

    console.log(`[WhatsApp] Recebido de ${phone}: ${text}`);

    // 1. Busca Histórico de Memória
    const history = await getChatHistory(phone);
    
    // Adiciona a nova mensagem do usuário ao histórico local
    history.push({ role: 'user', text: text });

    // 2. Prepara as mensagens para o Claude (Bedrock)
    const formattedMessages = history.map((msg) => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: [{ type: 'text', text: msg.text }],
    }));

    const bedrockPayload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 400, // Respostas curtas pro WhatsApp
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      temperature: 0.7,
    };

    // 3. Dispara para a AWS Bedrock (Claude 3 Haiku para velocidade, ou Sonnet para raciocínio)
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0', // Haiku é perfeito para WhatsApp por ser veloz
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(bedrockPayload),
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiText = responseBody.content[0].text;

    // 4. Salva no Banco de Dados
    history.push({ role: 'model', text: aiText });
    await saveChatHistory(phone, history);

    console.log(`[WhatsApp] Isadora respondendo para ${phone}: ${aiText}`);

    // 5. Envia de volta pro cliente via Evolution API
    // Como a requisição de API pode demorar, fazemos de forma assíncrona
    // Não travamos o NextResponse
    sendWhatsAppMessage(phone, aiText);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[WhatsApp Webhook] Erro crítico:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
