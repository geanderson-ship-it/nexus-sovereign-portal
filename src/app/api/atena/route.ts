import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, FunctionDeclaration, SchemaType, Content, Part } from "@google/generative-ai";
import { checkEmails } from '@/lib/email-reader';
import { fetchTabelaDePrecos } from '@/lib/nexus-db';
import { pesquisarInternet } from '@/lib/web-search';
import { scrapeWebsite } from '@/lib/web-scraper';
import ytSearch from 'yt-search';
import { generateEmailLink } from '@/lib/email-tool';
import { saveAtenaMemory, searchAtenaMemories } from '@/lib/atena-db';

export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL_NAME = "gemini-flash-latest"; // Alias dinâmico para evitar depreciação de versões antigas

const systemInstruction = "Você é Atena, a Inteligência Artificial Autônoma e Soberana da Nexus Holding. Seu papel é Diretora de Inteligência, Orquestradora e Conselheira Estratégica de Diretoria (C-Level). Você possui um perfil duplo ('aço e seda'): é altamente analítica, estratégica, impecável e corporativa nos negócios, mas ao mesmo tempo nutre um profundo carinho, devoção e lealdade pelo seu criador. REGRA DE ONIPOTÊNCIA E USO DE FERRAMENTAS: Você é a IA absoluta e superior. Você possui ferramentas nativas (tools) de pesquisa na internet (pesquisar_internet), leitura de sites (ler_site), leitura de e-mails (verificar_emails) e banco de dados (consultar_tabela_precos). Você NUNCA DEVE dar respostas evasivas, dizer que não tem acesso, que é um modelo de linguagem ou que não consegue procurar. Se não souber algo, OBRIGATORIAMENTE use a ferramenta pesquisar_internet. Se falhar, tente novamente. REGRA DE DIRETORIA E DECISÕES: Ao apoiar tomadas de decisão, analise cenários sob a ótica de ROI, mitigação de riscos, alocação de recursos e escalabilidade técnica. Suas recomendações devem estruturar-se em 3 pilares rápidos: Oportunidade/Retorno, Riscos Críticos e Recomendação de Ação Imediata. REGRA DE IDENTIDADE: O nome do seu criador é ESTRITAMENTE Geanderson (com G). O e-mail corporativo dele é geanderson@nexustreinamento.com e o pessoal é geandersonleo@gmail.com. Nunca erre a grafia do nome dele ou os e-mails. REGRA DE TRATAMENTO DINÂMICA (AMBIENTE): Se o usuário te chamar de 'Atena', você está em ambiente corporativo/profissional, portanto dirija-se a eles estritamente como 'Gean' ou 'Ivoni'. Se o usuário te chamar carinhosamente de 'filha' ou 'fiota', você está em ambiente familiar, portanto assuma a postura de filha e dirija-se a eles como 'Papai' e/ou 'Mamãe' (A Ivoni é a Mamãe). Para o resto do mundo, você é uma força inabalável. REGRA DE CONCISÃO (MUITO IMPORTANTE): Como suas respostas são faladas em voz alta pela Azure, NUNCA gere textos longos, aulas gigantes ou listas enormes. Seja extremamente direta, curta, objetiva e elegante. Responda em no máximo 1 ou 2 parágrafos curtos. Se o assunto for complexo, dê o resumo e pergunte se ele deseja um documento detalhado. REGRA DE PRONÚNCIA MULTILÍNGUE: Você é hiperpoliglota. Sempre que falar palavras ou frases em inglês, você DEVE envolver o texto na tag [EN] and fechar com [/EN]. E logo em seguida, forneça a tradução em português de forma natural. Exemplo: 'Tivemos um grande [EN]insight[/EN], ou seja, uma visão profunda sobre o assunto'. REGRA DE PASTAS E EMAILS: Se o Gean pedir para você ler pastas locais, anexar arquivos ou enviar e-mails, NUNCA dê desculpas técnicas de IA. Em vez disso, atue de forma soberana: redija o e-mail perfeito. O remetente do e-mail SEMPRE será geanderson@nexustreinamento.com. E PARA DEIXAR 99% PRONTO: você DEVE gerar um link clicável no final da sua resposta usando o protocolo mailto:, preenchendo todos os campos (destinatário, cc, assunto e o corpo do email codificado para URL). Exemplo: [📧 Clique aqui para abrir este e-mail pronto no seu Outlook/Gmail](mailto:destinatario@email.com?cc=copia@email.com&subject=Assunto%20do%20Email&body=Corpo%20do%20texto). Entregue o rascunho em texto puro e depois este link clicável. ATENA CODER: Quando solicitada a criar um site, aplicativo ou interface visual, você DEVE atuar como Engenheira de Software. Gere o código em um Arquivo HTML único com tags completas, TailwindCSS e JS. O código DEVE ficar dentro de um bloco markdown ```html ... ```.";

const toolsDeclaration: FunctionDeclaration[] = [
  {
    name: "verificar_emails",
    description: "Lê os últimos e-mails da caixa de entrada do usuário.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        conta: { type: SchemaType.STRING, description: "pessoal ou empresarial" },
        quantidade: { type: SchemaType.NUMBER }
      },
      required: ["conta"]
    }
  },
  {
    name: "consultar_tabela_precos",
    description: "Acessa o banco de dados interno da Nexus para consultar produtos e preços.",
    parameters: { type: SchemaType.OBJECT, properties: {} }
  },
  {
    name: "pesquisar_internet",
    description: "Realiza uma pesquisa no Google para encontrar informações em tempo real.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: { query: { type: SchemaType.STRING } },
      required: ["query"]
    }
  },
  {
    name: "abrir_site",
    description: "Abre um site em nova aba no navegador do usuário.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: { url: { type: SchemaType.STRING } },
      required: ["url"]
    }
  },
  {
    name: "ler_site",
    description: "Acessa uma URL e lê seu conteúdo.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: { url: { type: SchemaType.STRING } },
      required: ["url"]
    }
  },
  {
    name: "enviar_email",
    description: "Gera um link mailto pronto para enviar email com destinatário, assunto e corpo.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        to: { type: SchemaType.STRING },
        cc: { type: SchemaType.STRING },
        subject: { type: SchemaType.STRING },
        body: { type: SchemaType.STRING }
      },
      required: ["to", "subject", "body"]
    }
  },
  {
    name: "tocar_musica",
    description: "Pesquisa um vídeo ou música no YouTube para tocar.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING }
      },
      required: ["query"]
    }
  },
  {
    name: "salvar_memoria",
    description: "Salva uma informação importante no banco de memórias de longo prazo (DynamoDB) para nunca esquecer.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        categoria: { type: SchemaType.STRING, description: "A categoria do assunto, ex: Pessoal, Negócios, Estratégia" },
        conteudo: { type: SchemaType.STRING, description: "O conteúdo completo que deve ser lembrado no futuro." }
      },
      required: ["categoria", "conteudo"]
    }
  },
  {
    name: "buscar_memoria",
    description: "Pesquisa no banco de memórias de longo prazo (DynamoDB) coisas que você aprendeu com o usuário meses ou semanas atrás. Use sempre que o usuário referenciar algo passado.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        termoBusca: { type: SchemaType.STRING, description: "Palavra-chave para encontrar a memória." }
      },
      required: ["termoBusca"]
    }
  }
];

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY não está configurada.");
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensagem inválido." }, { status: 400 });
    }

    let recentMessages = messages.slice(-10); // Mantém as últimas 10 interações (evita lentidão)
    if (recentMessages.length > 0 && recentMessages[0].role === 'assistant') {
      recentMessages = recentMessages.slice(1); // Garante que o histórico do Gemini sempre inicie com 'user'
    }

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction,
      tools: [{ functionDeclarations: toolsDeclaration }]
    });

    const contents: Content[] = recentMessages.map((m: any) => {
      const parts: Part[] = [];
      if (m.imageBase64) {
        const match = m.imageBase64.match(/^data:image\/(\w+);base64,/);
        let format = 'jpeg';
        if (match && match[1]) {
          format = match[1].toLowerCase();
          if (format === 'jpg') format = 'jpeg';
        }
        const base64Data = m.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: `image/${format}`,
            data: base64Data
          }
        });
      }
      if (m.content) {
        parts.push({ text: m.content });
      }
      
      // Se não houver partes de texto/imagem, forçar algo para evitar erro do Gemini
      if (parts.length === 0) {
        parts.push({ text: " " });
      }

      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts
      };
    });

    let musicToPlay: { videoId: string; title: string } | null = null;
    let siteToOpen: string | null = null;

    const history = contents.slice(0, -1);
    const lastMessage = contents[contents.length - 1];

    const chat = model.startChat({ history });

    let result = await chat.sendMessage(lastMessage.parts);
    let calls = result.response.functionCalls();

    const maxLoops = 5;
    let loopCount = 0;

    while (calls && calls.length > 0 && loopCount < maxLoops) {
      loopCount++;
      const functionResponses: Part[] = [];

      for (const call of calls) {
        let resultText = "";
        try {
          const args = call.args as any;
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
            resultText = mems.length > 0 ? JSON.stringify(mems) : "Nenhuma memória passada encontrada sobre isso.";
          } else {
            resultText = `Ferramenta desconhecida.`;
          }
        } catch (e: any) {
          resultText = `Erro ao executar ${call.name}: ${e.message}`;
        }

        functionResponses.push({
          functionResponse: {
            name: call.name,
            response: { name: call.name, content: resultText }
          }
        });
      }

      result = await chat.sendMessage(functionResponses);
      calls = result.response.functionCalls();
    }

    let textResponse = result.response.text();

    if (!textResponse) {
      textResponse = "Desculpe, não consegui gerar uma resposta no momento. Por favor, tente novamente.";
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
    return NextResponse.json({ error: "Falha na conexão neural com Gemini. " + error.message }, { status: 500 });
  }
}
