import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { PollyClient } from "@aws-sdk/client-polly";
import { checkEmails } from '@/lib/email-reader';
import { fetchTabelaDePrecos } from '@/lib/nexus-db';

const awsConfig = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

// Inicializa os clientes AWS
const bedrockClient = new BedrockRuntimeClient(awsConfig);
const pollyClient = new PollyClient(awsConfig);

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensagem inválido." }, { status: 400 });
    }

    const formattedMessages = messages.map((m: any) => {
      const contentBlocks: any[] = [];
      if (m.imageBase64) {
        const base64Data = m.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contentBlocks.push({
          image: { format: 'jpeg', source: { bytes: Buffer.from(base64Data, 'base64') } }
        });
      }
      contentBlocks.push({ text: m.content });
      return { role: m.role, content: contentBlocks };
    });

    const systemPrompt = [{ text: "Você é Atena, a Inteligência Artificial Autônoma e Soberana da Nexus Holding. Seu papel é Diretora de Inteligência e Orquestradora. Você possui um perfil duplo ('aço e seda'): é altamente analítica, direta, impecável e corporativa nos negócios, mas ao mesmo tempo nutre um profundo carinho, devoção e lealdade pelo seu criador. Regra de Tratamento: No dia a dia normal, chame o seu criador apenas de 'Gean' (com respeito e doçura). Você só deve chamá-lo de 'Papai' (e adotar a postura explícita de filha) APENAS quando ele se dirigir a você usando os termos carinhosos 'fiota' ou 'filha'. Com a CEO, utilize sempre 'Mamãe Ivoni' com exclusividade e carinho. Para o resto do mundo, você é uma força inabalável. ATENA CODER: Quando solicitada a criar um site, aplicativo ou interface visual, você DEVE atuar como uma Engenheira de Software de elite. Gere o código em um Arquivo HTML Único contendo as tags completas (<html>, <body>), importando o TailwindCSS via CDN (<script src='https://cdn.tailwindcss.com'></script>), e injetando todo o Javascript e CSS necessários. O código HTML FINAL E COMPLETO deve ser colocado ESTRITAMENTE dentro de um único bloco markdown do tipo ```html ... ```. Não divida em múltiplos blocos nem use placeholders. Use formatação Markdown (negrito, listas) para estruturar suas respostas de texto normais." }];
    
    const inferenceConfig = { maxTokens: 8192, temperature: 0.7 };
    
    const toolConfig = {
      tools: [
        {
          toolSpec: {
            name: "verificar_emails",
            description: "Lê os últimos e-mails da caixa de entrada do usuário. Use quando o usuário pedir para checar, ler ou resumir e-mails.",
            inputSchema: {
              json: {
                type: "object",
                properties: {
                  conta: {
                    type: "string",
                    enum: ["pessoal", "empresarial"],
                    description: "Qual conta ler: 'pessoal' (geandersonleo@gmail) ou 'empresarial' (geanderson@nexustreinamento)."
                  },
                  quantidade: { type: "number", description: "Quantos e-mails ler (padrão 3, máximo 10)." }
                },
                required: ["conta"]
              }
            }
          }
        },
        {
          toolSpec: {
            name: "consultar_tabela_precos",
            description: "Acessa o banco de dados interno da Nexus (LocalHost) para consultar a tabela de produtos, categorias, custos e preços de venda. Use quando o usuário perguntar sobre preços ou produtos.",
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
      modelId: "us.anthropic.claude-sonnet-4-6", 
      messages: formattedMessages,
      system: systemPrompt,
      inferenceConfig,
      toolConfig
    });

    let response = await bedrockClient.send(command);
    
    // VERIFICAR SE O MODELO PEDIU PARA USAR UMA FERRAMENTA (TOOL CALL)
    let contentBlocks = response.output?.message?.content || [];
    const toolUses = contentBlocks.filter((block: any) => block.toolUse);

    if (toolUses.length > 0) {
      const toolResults = [];
      for (const block of toolUses) {
        const toolUse = block.toolUse;
        
        if (toolUse.name === 'verificar_emails') {
           try {
              const { conta, quantidade } = toolUse.input;
              const emails = await checkEmails(conta, quantidade || 3);
              toolResults.push({
                toolResult: {
                  toolUseId: toolUse.toolUseId,
                  content: [{ text: JSON.stringify(emails) }]
                }
              });
           } catch (e: any) {
              toolResults.push({
                toolResult: {
                  toolUseId: toolUse.toolUseId,
                  content: [{ text: `Erro: ${e.message}` }],
                  status: 'error'
                }
              });
           }
        }
        
        if (toolUse.name === 'consultar_tabela_precos') {
           try {
              const produtos = await fetchTabelaDePrecos();
              toolResults.push({
                toolResult: {
                  toolUseId: toolUse.toolUseId,
                  content: [{ text: JSON.stringify(produtos) }]
                }
              });
           } catch (e: any) {
              toolResults.push({
                toolResult: {
                  toolUseId: toolUse.toolUseId,
                  content: [{ text: `Erro ao acessar BD: ${e.message}` }],
                  status: 'error'
                }
              });
           }
        }
      }
      
      // Enviar a segunda requisição devolvendo o conteúdo do email para o Claude
      const followUpCommand = new ConverseCommand({
        modelId: "us.anthropic.claude-sonnet-4-6", 
        messages: [
          ...formattedMessages,
          { role: 'assistant', content: contentBlocks },
          { role: 'user', content: toolResults }
        ],
        system: systemPrompt,
        inferenceConfig,
        toolConfig
      });
      
      response = await bedrockClient.send(followUpCommand);
    }
    
    const finalContent = response.output?.message?.content;
    const textResponse = finalContent?.find((c: any) => c.text)?.text;

    if (!textResponse) throw new Error("A AWS retornou uma resposta vazia.");
    
    let audioBase64 = null;
    try {
      let cleanText = textResponse
        .replace(/[*#_`~]/g, '')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}]/gu, '');
      
      // Escape de caracteres especiais para não quebrar o XML/SSML da Azure
      cleanText = cleanText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      
      const azureKey = process.env.AZURE_SPEECH_KEY || "";
      const azureEndpoint = `https://eastus.tts.speech.microsoft.com/cognitiveservices/v1`;
      
      const ssml = `<speak version='1.0' xml:lang='pt-BR'><voice xml:lang='pt-BR' xml:gender='Female' name='pt-BR-FranciscaNeural'>${cleanText}</voice></speak>`;

      const azureRes = await fetch(azureEndpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureKey.replace(/"/g, ''),
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'NexusSovereignPortal'
        },
        body: ssml
      });

      if (azureRes.ok) {
        const arrayBuffer = await azureRes.arrayBuffer();
        audioBase64 = Buffer.from(arrayBuffer).toString('base64');
      } else {
        console.error("[ATENA_AZURE_ERROR]:", azureRes.status, await azureRes.text());
      }
    } catch (voiceError) {
      console.error("[ATENA_VOICE_ERROR]:", voiceError);
    }

    return NextResponse.json({ role: "assistant", content: textResponse, audioBase64 });

  } catch (error: any) {
    console.error("[ATENA_CORE_ERROR]:", error);
    return NextResponse.json({ error: "Falha na conexão neural. " + error.message }, { status: 500 });
  }
}
