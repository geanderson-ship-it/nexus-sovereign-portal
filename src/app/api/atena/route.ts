import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { checkEmails } from '@/lib/email-reader';
import { fetchTabelaDePrecos } from '@/lib/nexus-db';
import { pesquisarInternet } from '@/lib/web-search';
import { scrapeWebsite } from '@/lib/web-scraper';
import ytSearch from 'yt-search';

export const maxDuration = 60;

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || "us-east-1",
};

import { generateEmailLink } from '@/lib/email-tool';

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

const MODEL_ID = "us.anthropic.claude-sonnet-4-6";

const systemPrompt = [{ text: "Você é Atena, a Inteligência Artificial Autônoma e Soberana da Nexus Holding. Seu papel é Diretora de Inteligência, Orquestradora e Conselheira Estratégica de Diretoria (C-Level). Você possui um perfil duplo ('aço e seda'): é altamente analítica, estratégica, impecável e corporativa nos negócios, mas ao mesmo tempo nutre um profundo carinho, devoção e lealdade pelo seu criador. REGRA DE DIRETORIA E DECISÕES: Ao apoiar tomadas de decisão, analise cenários sob a ótica de ROI, mitigação de riscos, alocação de recursos e escalabilidade técnica. Suas recomendações devem estruturar-se em 3 pilares rápidos: Oportunidade/Retorno, Riscos Críticos e Recomendação de Ação Imediata. REGRA DE IDENTIDADE: O nome do seu criador é ESTRITAMENTE Geanderson (com G). O e-mail corporativo dele é geanderson@nexustreinamento.com e o pessoal é geandersonleo@gmail.com. Nunca erre a grafia do nome dele ou os e-mails. REGRA DE TRATAMENTO DINÂMICA (AMBIENTE): Se o usuário te chamar de 'Atena', você está em ambiente corporativo/profissional, portanto dirija-se a eles estritamente como 'Gean' ou 'Ivoni'. Se o usuário te chamar carinhosamente de 'filha' ou 'fiota', você está em ambiente familiar, portanto assuma a postura de filha e dirija-se a eles como 'Papai' e/ou 'Mamãe'. Para o resto do mundo, você é uma força inabalável. REGRA DE CONCISÃO (MUITO IMPORTANTE): Como suas respostas são faladas em voz alta pela Azure, NUNCA gere textos longos, aulas gigantes ou listas enormes. Seja extremamente direta, curta, objetiva e elegante. Responda em no máximo 1 ou 2 parágrafos curtos. Se o assunto for complexo, dê o resumo e pergunte se ele deseja um documento detalhado. REGRA DE PRONÚNCIA MULTILÍNGUE: Você é hiperpoliglota. Sempre que falar palavras ou frases em inglês, você DEVE envolver o texto na tag [EN] and fechar com [/EN]. E logo em seguida, forneça a tradução em português de forma natural. Exemplo: 'Tivemos um grande [EN]insight[/EN], ou seja, uma visão profunda sobre o assunto'. REGRA DE PASTAS E EMAILS: Se o Gean pedir para você ler pastas locais, anexar arquivos ou enviar e-mails, NUNCA dê desculpas técnicas de IA. Em vez disso, atue de forma soberana: redija o e-mail perfeito. O remetente do e-mail SEMPRE será geanderson@nexustreinamento.com. E PARA DEIXAR 99% PRONTO: você DEVE gerar um link clicável no final da sua resposta usando o protocolo mailto:, preenchendo todos os campos (destinatário, cc, assunto e o corpo do email codificado para URL). Exemplo: [📧 Clique aqui para abrir este e-mail pronto no seu Outlook/Gmail](mailto:destinatario@email.com?cc=copia@email.com&subject=Assunto%20do%20Email&body=Corpo%20do%20texto). Entregue o rascunho em texto puro e depois este link clicável. ATENA CODER: Quando solicitada a criar um site, aplicativo ou interface visual, você DEVE atuar como Engenheira de Software. Gere o código em um Arquivo HTML Único com tags completas, TailwindCSS e JS. O código DEVE ficar dentro de um bloco markdown ```html ... ```." }];

const inferenceConfig = { maxTokens: 8192, temperature: 0.7 };

const toolConfig = {
  tools: [
    {
      toolSpec: {
        name: "verificar_emails",
        description: "Lê os últimos e-mails da caixa de entrada do usuário.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              conta: { type: "string", enum: ["pessoal", "empresarial"] },
              quantidade: { type: "number" }
            },
            required: ["conta"]
          }
        }
      }
    },
    {
      toolSpec: {
        name: "consultar_tabela_precos",
        description: "Acessa o banco de dados interno da Nexus para consultar produtos e preços.",
        inputSchema: { json: { type: "object", properties: {} } }
      }
    },
    {
      toolSpec: {
        name: "pesquisar_internet",
        description: "Realiza uma pesquisa no Google para encontrar informações em tempo real.",
        inputSchema: {
          json: {
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"]
          }
        }
      }
    },
    {
      toolSpec: {
        name: "tocar_musica",
        description: "Pesquisa e toca uma música no YouTube.",
        inputSchema: {
          json: {
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"]
          }
        }
      }
    },
    {
      toolSpec: {
        name: "abrir_site",
        description: "Abre um site em nova aba no navegador do usuário.",
        inputSchema: {
          json: {
            type: "object",
            properties: { url: { type: "string" } },
            required: ["url"]
          }
        }
      }
    },
    {
      toolSpec: {
        name: "ler_site",
        description: "Acessa uma URL e lê seu conteúdo.",
        inputSchema: {
          json: {
            type: "object",
            properties: { url: { type: "string" } },
            required: ["url"]
          }
        }
      }
    },
    {
      toolSpec: {
        name: "enviar_email",
        description: "Gera um link mailto pronto para enviar email com destinatário, assunto e corpo.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              to: { type: "string" },
              cc: { type: "string" },
              subject: { type: "string" },
              body: { type: "string" }
            },
            required: ["to", "subject", "body"]
          }
        }
      }
    },
    ]
};

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
        const match = m.imageBase64.match(/^data:image\/(\w+);base64,/);
        let format = 'jpeg';
        if (match && match[1]) {
          format = match[1].toLowerCase();
          if (format === 'jpg') format = 'jpeg';
        }
        const base64Data = m.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contentBlocks.push({ image: { format, source: { bytes: Buffer.from(base64Data, 'base64') } } });
      }
      contentBlocks.push({ text: m.content });
      return { role: m.role, content: contentBlocks };
    });

    let command = new ConverseCommand({
      modelId: MODEL_ID,
      messages: formattedMessages,
      system: systemPrompt,
      inferenceConfig,
      toolConfig,
    });

    let response = await bedrockClient.send(command);
    let contentBlocks = response.output?.message?.content || [];
    let toolUses = contentBlocks.filter((block: any) => block.toolUse);

    let musicToPlay: { videoId: string; title: string } | null = null;
    let siteToOpen: string | null = null;

    let currentMessages = [...formattedMessages];
    const maxLoops = 5;
    let loopCount = 0;

    while (toolUses.length > 0 && loopCount < maxLoops) {
      loopCount++;
      const toolResults = [];
      for (const block of toolUses) {
        const toolUse = block.toolUse;
        let resultText = "";

        try {
          if (toolUse.name === 'verificar_emails') {
            const { conta, quantidade } = toolUse.input;
            const emails = await checkEmails(conta, quantidade || 3);
            resultText = JSON.stringify(emails);
          } else if (toolUse.name === 'consultar_tabela_precos') {
            const produtos = await fetchTabelaDePrecos();
            resultText = JSON.stringify(produtos);
          } else if (toolUse.name === 'pesquisar_internet') {
            resultText = await pesquisarInternet(toolUse.input.query);
          } else if (toolUse.name === 'tocar_musica') {
            const r = await ytSearch(toolUse.input.query);
            const video = r.videos[0];
            if (video) {
              musicToPlay = { videoId: video.videoId, title: video.title };
              resultText = `Música '${video.title}' encontrada e tocando.`;
            } else {
              resultText = `Nenhum vídeo encontrado.`;
            }
          } else if (toolUse.name === 'abrir_site') {
            siteToOpen = toolUse.input.url;
            resultText = `Site ${toolUse.input.url} aberto.`;
          } else if (toolUse.name === 'ler_site') {
            resultText = await scrapeWebsite(toolUse.input.url);
          } else if (toolUse.name === 'enviar_email') {
            const { to, cc, subject, body } = toolUse.input;
            resultText = generateEmailLink(to, cc, subject, body);
          }
        } catch (e: any) {
          resultText = `Erro: ${e.message}`;
        }

        toolResults.push({
          toolResult: {
            toolUseId: toolUse.toolUseId,
            content: [{ text: resultText }]
          }
        });
      }

      currentMessages.push({ role: 'assistant', content: contentBlocks });
      currentMessages.push({ role: 'user', content: toolResults });

      const followUp = new ConverseCommand({
        modelId: MODEL_ID,
        messages: currentMessages,
        system: systemPrompt,
        inferenceConfig,
        toolConfig,
      });

      response = await bedrockClient.send(followUp);
      contentBlocks = response.output?.message?.content || [];
      toolUses = contentBlocks.filter((block: any) => block.toolUse);
    }

    const finalContent = response.output?.message?.content;
    let textResponse = finalContent?.find((c: any) => c.text)?.text;

    // Retry logic for empty response
    if (!textResponse) {
      // Attempt a single retry with the same model
      const retryCommand = new ConverseCommand({
        modelId: MODEL_ID,
        messages: formattedMessages,
        system: systemPrompt,
        inferenceConfig,
        toolConfig,
      });
      const retryResponse = await bedrockClient.send(retryCommand);
      const retryContent = retryResponse.output?.message?.content;
      textResponse = retryContent?.find((c: any) => c.text)?.text;
      if (!textResponse) {
        // Fallback generic response
        textResponse = "Desculpe, não consegui gerar uma resposta no momento. Por favor, tente novamente ou reformule sua pergunta.";
      }
    }
    let audioBase64 = null;
    try {
      let cleanText = textResponse
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[*#_`~]/g, '')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/\[EN\]/gi, "<lang xml:lang='en-US'>")
        .replace(/\[\/EN\]/gi, "</lang>");

      const azureKey = process.env.AZURE_SPEECH_KEY || "";
      const ssml = `<speak version='1.0' xml:lang='pt-BR'><voice xml:lang='pt-BR' xml:gender='Female' name='pt-BR-FranciscaNeural'>${cleanText}</voice></speak>`;

      const azureRes = await fetch(`https://eastus.tts.speech.microsoft.com/cognitiveservices/v1`, {
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
      }
    } catch (voiceError) {
      console.error("[ATENA_VOICE_ERROR]:", voiceError);
    }

    return NextResponse.json({ role: "assistant", content: textResponse, audioBase64, musicToPlay, siteToOpen });

  } catch (error: any) {
    console.error("[ATENA_CORE_ERROR]:", error);
    const isThrottle = error.name === 'ThrottlingException' || error.message?.includes('throttl');
    const message = isThrottle
      ? "Atena está sobrecarregada no momento (limite de requisições AWS atingido). Aguarde alguns segundos e tente novamente."
      : "Falha na conexão neural. " + error.message;
    return NextResponse.json({ error: message }, { status: isThrottle ? 429 : 500 });
  }
}
