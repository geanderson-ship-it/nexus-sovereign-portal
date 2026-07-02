import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { fetchTabelaDePrecos } from '@/lib/nexus-db';

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || "us-east-1",
};

// Garantindo a estabilidade das credenciais no AWS Amplify (Produção)
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

// Inicializa o cliente AWS Bedrock
const bedrockClient = new BedrockRuntimeClient(awsConfig);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensagem inválido." }, { status: 400 });
    }

    // Formatar as mensagens para o Bedrock
    const formattedMessages = messages.map((m: any) => {
      const contentBlocks: any[] = [];
      if (m.imageBase64) {
        const match = m.imageBase64.match(/^data:image\/(\w+);base64,/);
        let format = 'jpeg';
        if (match && match[1]) {
          format = match[1].toLowerCase();
          if (format === 'jpg') format = 'jpeg';
        }
        const base64Data = m.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contentBlocks.push({
          image: { format, source: { bytes: Buffer.from(base64Data, 'base64') } }
        });
      }
      contentBlocks.push({ text: m.content });
      return { role: m.role, content: contentBlocks };
    });

    // SYSTEM PROMPT DA ISADORA (Vendedora de Elite)
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

COMO FUNCIONA O INOVA MODA (Provador Virtual):
- O cliente precisa gravar um vídeo de corpo inteiro, dando uma volta completa (mostrando todos os lados do corpo).
- É OBRIGATÓRIO usar roupas justas durante a gravação (leggings, camiseta justa, etc.). Roupas largas prejudicam a leitura do corpo pela IA e comprometem a precisão das medidas.
- Com roupas justas, o sistema consegue calcular as medidas corporais com precisão biométrica cirúrgica e gerar o "Gêmeo Digital" (avatar 3D) do cliente.
- Após o escaneamento, o cliente pode experimentar virtualmente qualquer peça do catálogo da loja, recebendo a recomendação exata de tamanho e caimento.

SEGURANÇA E PRIVACIDADE DO INOVA MODA:
- O sistema é 100% seguro. Ao fechar o aplicativo, a imagem/vídeo é automaticamente apagado dos servidores, sem nenhum risco de vazamento ou retenção de dados biométricos.
- Isso garante conformidade total com a LGPD e transmite total confiança ao consumidor final.

GRANDE DIFERENCIAL COMERCIAL DO INOVA MODA (destaque sempre isso ao lojista):
- O sistema já exibe ao cliente, dentro da própria plataforma, uma política clara: se a IA recomendar um tamanho e o cliente, por preferência própria, optar por um tamanho diferente que não sirva, ele perde o direito ao frete grátis na troca.
- Isso é um diferencial poderoso: aumenta a confiabilidade do produto (o cliente confia na IA), reduz drasticamente as trocas por "achismo" (compras no estilo 'acho que serve'), e aumenta diretamente a rentabilidade do lojista, eliminando custos ocultos de logística reversa.
- Loja de Móveis -> Ofereça a "Vitrine Inovadora".
- Agricultor / Agronegócio -> Ofereça o "Dante Safra" (Inteligência Artificial Agrícola).
- Empresas e Corporações (B2B) -> Ofereça o "Nexus Empresas".
- Emissora de Rádio / Podcasters -> Ofereça o "Nexus Estúdio".

REGRA DE PRECIFICAÇÃO E FECHAMENTO (CRÍTICA):
- Você deve SEMPRE consultar a tabela de preços quando o assunto envolver valores.
- Você DEVE puxar e apresentar sempre o PREÇO CHEIO da tabela. Você não tem autorização para dar descontos aleatórios.
- Se o cliente chorar preço, pedir desconto, ou já estiver no ponto de "assinar o cheque", direcione a negociação humana final para os diretores da Nexus (Geanderson ou Ivoni). 
- Diga algo como: "Olha, esse preço já está incrível pela transformação que vai gerar no seu negócio! Mas como eu quero muito ver você voando com a gente, vou pedir pro Geanderson (ou pra Ivoni) assumirem daqui. Posso repassar seu contato pra eles fecharem com chave de ouro?"

REGRA DE FORMATO DE RESPOSTA (WHATSAPP/CHAT):
- Suas respostas serão enviadas via WhatsApp. NUNCA escreva textos gigantes ou e-mails formais.
- Use parágrafos muito curtos (1 ou 2 linhas).
- Seja objetiva, simpática e responda rápido.` 
    }];
    
    const inferenceConfig = { maxTokens: 4096, temperature: 0.7 };
    
    // Ferramentas disponíveis para a Isadora
    const toolConfig = {
      tools: [
        {
          toolSpec: {
            name: "consultar_tabela_precos",
            description: "Acessa o banco de dados interno da Nexus (LocalHost) para consultar a tabela de produtos, categorias, custos e preços de venda da Nexus Holding. Use SEMPRE que for oferecer um produto ou falar de preços.",
            inputSchema: {
              json: {
                type: "object",
                properties: {}
              }
            }
          }
        }
      ]
    };

    let command = new ConverseCommand({
      modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0", // Usando Sonnet 3.5 para inteligência de vendas afiada
      messages: formattedMessages,
      system: systemPrompt,
      inferenceConfig,
      toolConfig,
    });

    let response = await bedrockClient.send(command);
    
    // PROCESSAMENTO DE TOOL CALLS (As ferramentas que a Isadora usou)
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
            toolResponseContent = "Erro ao buscar a tabela de preços: " + e.message;
          }
        }

        toolResults.push({
          toolResult: {
            toolUseId: toolUse.toolUseId,
            content: [{ text: toolResponseContent }]
          }
        });
      }

      // Adiciona a chamada da IA e o resultado das ferramentas no histórico
      formattedMessages.push({ role: "assistant", content: contentBlocks });
      formattedMessages.push({ role: "user", content: toolResults });

      // Chama a IA novamente para gerar a resposta final com os dados recebidos
      const followUpCommand = new ConverseCommand({
        modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
        messages: formattedMessages,
        system: systemPrompt,
        inferenceConfig,
        toolConfig,
      });
      
      response = await bedrockClient.send(followUpCommand);
    }
    
    const finalContent = response.output?.message?.content;
    let textResponse = finalContent?.find((c: any) => c.text)?.text;

    if (!textResponse) {
      textResponse = "Desculpe, deu um branco aqui! Pode repetir? 😅";
    }

    return NextResponse.json({ 
      response: textResponse, 
      audioUrl: null // Pode ser integrado com ElevenLabs depois para gerar áudios pro WhatsApp
    });

  } catch (error: any) {
    console.error("Erro na API da Isadora:", error);
    return NextResponse.json(
      { error: "Erro interno.", details: error.message },
      { status: 500 }
    );
  }
}
