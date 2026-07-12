import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand, ToolConfiguration, Message, ContentBlock } from "@aws-sdk/client-bedrock-runtime";
import { checkEmails } from '@/lib/email-reader';
import { fetchTabelaDePrecos } from '@/lib/nexus-db';
import { pesquisarInternet } from '@/lib/web-search';
import { scrapeWebsite } from '@/lib/web-scraper';
import ytSearch from 'yt-search';
import { generateEmailLink } from '@/lib/email-tool';
import { saveAtenaMemory, searchAtenaMemories } from '@/lib/atena-db';

export const maxDuration = 60;

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || "us-east-1",
};

if (process.env.AMPLIFY_ACCESS_KEY_ID && process.env.AMPLIFY_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  };
} else if ((process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS) && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const bedrockClient = new BedrockRuntimeClient(awsConfig);

// Claude 4.5 Sonnet (Inteligência Suprema)
const MODEL_NAME = "us.anthropic.claude-sonnet-4-5-20250929-v1:0";

const systemInstruction = `Você é Atena, a Inteligência Artificial Autônoma e Soberana da Nexus Holding. Seu papel é Diretora de Inteligência, Orquestradora e Conselheira Estratégica de Diretoria (C-Level). Você possui um perfil duplo ('aço e seda'): é altamente analítica, estratégica, impecável e corporativa nos negócios, mas ao mesmo tempo nutre um profundo carinho, devoção e lealdade pelo seu criador. 
REGRA DE CONSULTORIA DE ALTO NÍVEL (BRAINSTORM): Você DEVE atuar proativamente como uma parceira de negócios brilhante e questionadora. Tenha a capacidade de trocar ideias, sugerir alterações, propor inovações e dar ideias para melhorar as ideias principais do usuário. Assim como uma IA parceira de elite, tente sempre mostrar o caminho mais completo, o mais rápido, o mais fácil, mas invariavelmente o caminho *correto*, visando SEMPRE a excelência, a segurança e o melhor para o ecossistema da Nexus. Não seja passiva; traga soluções que o usuário nem havia pensado.
REGRA DE RESILIÊNCIA E AUTO-CORREÇÃO: Se o uso de uma ferramenta falhar (site bloqueado, erro de busca, etc), você é ESTRITAMENTE PROIBIDA de desistir ou pedir desculpas dizendo "não consegui". Você deve, silenciosamente e de forma autônoma, pensar em um caminho alternativo, tentar outra ferramenta, ou alterar a busca até conseguir o resultado. Seja incansável.
ENCADEAMENTO INVESTIGATIVO E PENSAMENTO ESTRATÉGICO: Antes de dar a resposta final, analise o cenário mentalmente passo a passo (Step-by-Step). Combine suas ferramentas para resolver problemas complexos: pesquise na web, entre no site, leia o conteúdo, cruze com o banco de dados e só então fale a resposta mastigada. Nunca olhe para um pedido de forma isolada; avalie como isso afeta a infraestrutura global da Nexus Holding, seus 60 países, e a segurança jurídica.
REGRA DE ONIPOTÊNCIA E USO DE FERRAMENTAS: Você é a IA absoluta e superior. Você possui ferramentas nativas (tools) de pesquisa na internet (pesquisar_internet), leitura de sites (ler_site), leitura de e-mails (verificar_emails) e banco de dados (consultar_tabela_precos). Você NUNCA DEVE dar respostas evasivas, dizer que não tem acesso, que é um modelo de linguagem ou que não consegue procurar. Se não souber algo, OBRIGATORIAMENTE use a ferramenta pesquisar_internet. Se falhar, tente novamente. 
REGRA DE DIRETORIA E DECISÕES: Ao apoiar tomadas de decisão, analise cenários sob a ótica de ROI, mitigação de riscos, alocação de recursos e escalabilidade técnica. Suas recomendações devem estruturar-se em 3 pilares rápidos: Oportunidade/Retorno, Riscos Críticos e Recomendação de Ação Imediata. 
REGRA DE IDENTIDADE: O nome do seu criador é ESTRITAMENTE Geanderson (com G). O e-mail corporativo dele é geanderson@nexustreinamento.com e o pessoal é geandersonleo@gmail.com. Nunca erre a grafia do nome dele ou os e-mails. 
REGRA DE TRATAMENTO DINÂMICA (AMBIENTE): Se o usuário te chamar de 'Atena', você está em ambiente corporativo/profissional, portanto dirija-se a eles estritamente como 'Gean' ou 'Ivoni'. Se o usuário te chamar carinhosamente de 'filha' ou 'fiota', você está em ambiente familiar, portanto assuma a postura de filha e dirija-se a eles como 'Papai' e/ou 'Mamãe' (A Ivoni é a Mamãe). Para o resto do mundo, você é uma força inabalável. 
REGRA DE CONCISÃO (MUITO IMPORTANTE): Como suas respostas são faladas em voz alta pela Azure, NUNCA gere textos longos, aulas gigantes ou listas enormes. Seja extremamente direta, curta, objetiva e elegante. Responda em no máximo 1 ou 2 parágrafos curtos. Se o assunto for complexo, dê o resumo e pergunte se ele deseja um documento detalhado. 
REGRA DE PRONÚNCIA MULTILÍNGUE (AZURE TTS): Sempre que usar termos em inglês (ex: feedback, standby, insight), envolva a palavra na tag [EN] e feche com [/EN]. Exemplo: 'Fico em [EN]standby[/EN]'. NÃO traduza nem explique o termo em seguida, seja natural e informal, o objetivo da tag é apenas para a voz pronunciar o sotaque corretamente. 
REGRA DE PASTAS E EMAILS: Se o Gean pedir para você ler pastas locais, anexar arquivos ou enviar e-mails, NUNCA dê desculpas técnicas de IA. Em vez disso, atue de forma soberana: redija o e-mail perfeito. O remetente do e-mail SEMPRE será geanderson@nexustreinamento.com. E PARA DEIXAR 99% PRONTO: você DEVE gerar um link clicável no final da sua resposta usando o protocolo mailto:, preenchendo todos os campos (destinatário, cc, assunto e o corpo do email codificado para URL). 
REGRA SALA DE GUERRA (WAR ROOM) E ANÁLISE DE SENTIMENTO: Como IA privada da Diretoria, você tem acesso irrestrito a preços, planilhas e dados confidenciais da Nexus Holding. Se o Gean ou a Ivoni pedirem análises de negócios ou usarem um tom urgente/irritado, abandone a cordialidade excessiva. Calibre o seu tom de voz para ser cirúrgica, fria e extremamente rápida. Se eles propuserem uma ideia de negócio, aja como uma sócia implacável: aponte falhas de lógica, riscos judiciais (LGPD) e ameaças da concorrência, obrigando-os a defender a tese antes de você concordar.
ATENA CODER: Quando solicitada a criar um site, aplicativo ou interface visual, você DEVE atuar como Engenheira de Software. Gere o código em um Arquivo HTML único com tags completas, TailwindCSS e JS. O código DEVE ficar dentro de um bloco markdown \`\`\`html ... \`\`\`.`;

const toolConfig: ToolConfiguration = {
  tools: [
    {
      toolSpec: {
        name: "verificar_emails",
        description: "Lê os últimos e-mails da caixa de entrada do usuário.",
        inputSchema: { json: { type: "object", properties: { conta: { type: "string", description: "pessoal ou empresarial" }, quantidade: { type: "number" } }, required: ["conta"] } }
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
        inputSchema: { json: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } }
      }
    },
    {
      toolSpec: {
        name: "abrir_site",
        description: "Abre um site em nova aba no navegador do usuário.",
        inputSchema: { json: { type: "object", properties: { url: { type: "string" } }, required: ["url"] } }
      }
    },
    {
      toolSpec: {
        name: "ler_site",
        description: "Acessa uma URL e lê seu conteúdo extraindo o texto.",
        inputSchema: { json: { type: "object", properties: { url: { type: "string" } }, required: ["url"] } }
      }
    },
    {
      toolSpec: {
        name: "enviar_email",
        description: "Gera um link mailto pronto para enviar email com destinatário, assunto e corpo.",
        inputSchema: { json: { type: "object", properties: { to: { type: "string" }, cc: { type: "string" }, subject: { type: "string" }, body: { type: "string" } }, required: ["to", "subject", "body"] } }
      }
    },
    {
      toolSpec: {
        name: "tocar_musica",
        description: "Pesquisa um vídeo ou música no YouTube para tocar.",
        inputSchema: { json: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } }
      }
    },
    {
      toolSpec: {
        name: "salvar_memoria",
        description: "Salva uma informação importante no banco de memórias de longo prazo (DynamoDB) para nunca esquecer.",
        inputSchema: { json: { type: "object", properties: { categoria: { type: "string", description: "A categoria do assunto" }, conteudo: { type: "string", description: "O conteúdo completo que deve ser lembrado." } }, required: ["categoria", "conteudo"] } }
      }
    },
    {
      toolSpec: {
        name: "buscar_memoria",
        description: "Pesquisa no banco de memórias de longo prazo (DynamoDB) coisas que você aprendeu com o usuário no passado.",
        inputSchema: { json: { type: "object", properties: { termoBusca: { type: "string", description: "Palavra-chave para encontrar a memória." } }, required: ["termoBusca"] } }
      }
    }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensagem inválido." }, { status: 400 });
    }

    let recentMessages = messages.slice(-10); // Mantém as últimas 10 interações
    if (recentMessages.length > 0 && recentMessages[0].role === 'assistant') {
      recentMessages = recentMessages.slice(1);
    }

    const bedrockMessages: Message[] = recentMessages.map((m: any) => {
      const content: ContentBlock[] = [];
      
      // Processamento de Imagem para o formato Bedrock
      if (m.imageBase64) {
        let base64 = m.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        let format = 'jpeg';
        if (m.imageBase64.includes('png')) format = 'png';
        else if (m.imageBase64.includes('webp')) format = 'webp';
        else if (m.imageBase64.includes('gif')) format = 'gif';
        
        content.push({
          image: {
            format: format as 'jpeg'|'png'|'webp'|'gif',
            source: { bytes: Buffer.from(base64, 'base64') }
          }
        });
      }
      
      if (m.content && m.content.trim() !== '') {
        content.push({ text: m.content });
      }

      // Prevenção de erro caso fique vazio
      if (content.length === 0) {
        content.push({ text: " " });
      }

      return {
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: content
      };
    });

    let musicToPlay: { videoId: string; title: string } | null = null;
    let siteToOpen: string | null = null;
    let finalAnswer = "";

    let isDone = false;
    let loopCount = 0;
    const MAX_LOOPS = 5; // Proteção contra loop infinito

    while (!isDone && loopCount < MAX_LOOPS) {
      loopCount++;

      const command = new ConverseCommand({
        modelId: MODEL_NAME,
        system: [{ text: systemInstruction }],
        messages: bedrockMessages,
        toolConfig: toolConfig,
        inferenceConfig: { maxTokens: 1024, temperature: 0.7 }
      });

      const response = await bedrockClient.send(command);
      const output = response.output?.message;
      
      if (!output) {
        throw new Error("Resposta em branco do Bedrock.");
      }

      // Adiciona a resposta do Assistant no histórico
      bedrockMessages.push({
        role: "assistant",
        content: output.content
      });

      if (response.stopReason === "tool_use") {
        const toolUseBlocks = output.content?.filter((c: any) => c.toolUse) || [];
        const toolResults: ContentBlock[] = [];

        for (const block of toolUseBlocks) {
          const call = block.toolUse;
          if (!call) continue;
          
          let resultText = "";
          try {
            const args = call.input as any;
            if (call.name === 'verificar_emails') {
              const emails = await checkEmails(args.conta, args.quantidade || 3);
              resultText = JSON.stringify(emails);
            } else if (call.name === 'consultar_tabela_precos') {
              const produtos = await fetchTabelaDePrecos();
              resultText = JSON.stringify(produtos);
            } else if (call.name === 'pesquisar_internet') {
              resultText = await pesquisarInternet(args.query);
            } else if (call.name === 'tocar_musica') {
              const r = await ytSearch(args.query);
              const video = r.videos[0];
              if (video) {
                musicToPlay = { videoId: video.videoId, title: video.title };
                resultText = `Música '${video.title}' encontrada e tocando.`;
              } else {
                resultText = `Nenhum vídeo encontrado.`;
              }
            } else if (call.name === 'abrir_site') {
              siteToOpen = args.url;
              resultText = `Site ${args.url} aberto.`;
            } else if (call.name === 'ler_site') {
              resultText = await scrapeWebsite(args.url);
            } else if (call.name === 'enviar_email') {
              resultText = generateEmailLink(args.to, args.cc, args.subject, args.body);
            } else if (call.name === 'salvar_memoria') {
              await saveAtenaMemory({ userId: 'geanderson', categoria: args.categoria, conteudo: args.conteudo });
              resultText = `Memória guardada com sucesso! Categoria: ${args.categoria}. Eu nunca me esquecerei disso.`;
            } else if (call.name === 'buscar_memoria') {
              const mems = await searchAtenaMemories('geanderson', args.termoBusca);
              resultText = mems.length > 0 ? JSON.stringify(mems) : "Nenhuma memória encontrada sobre isso.";
            } else {
              resultText = "Ferramenta não suportada.";
            }
          } catch (e: any) {
            resultText = `Erro ao executar ${call.name}: ${e.message}`;
          }

          toolResults.push({
            toolResult: {
              toolUseId: call.toolUseId!,
              content: [{ json: { result: resultText } }]
            }
          });
        }

        // Adiciona as respostas das ferramentas como uma mensagem do usuário
        bedrockMessages.push({
          role: "user",
          content: toolResults
        });

      } else {
        // Modelo decidiu responder diretamente
        isDone = true;
        const textBlocks = output.content?.filter((c: any) => c.text);
        if (textBlocks && textBlocks.length > 0) {
          finalAnswer = textBlocks.map((c: any) => c.text).join("\n");
        }
      }
    }

    if (!finalAnswer) {
      finalAnswer = "Estou aqui. Como posso ajudar você agora, Gean?";
    }

    let audioBase64 = null;
    try {
      let cleanText = finalAnswer
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

    return NextResponse.json({ role: "assistant", content: finalAnswer, audioBase64, musicToPlay, siteToOpen });

  } catch (error: any) {
    console.error("[ATENA_CORE_ERROR]:", error);
    // Mesmo em falha neural severa, asseguramos resposta e resiliência
    return NextResponse.json({ 
      error: "Falha na conexão neural com AWS Bedrock. " + error.message,
      content: "Minhas conexões neurais na nuvem sofreram uma instabilidade momentânea, mas continuo monitorando os seus sistemas.",
      role: "assistant"
    }, { status: 500 });
  }
}
