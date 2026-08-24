import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { checkEmails } from '@/lib/email-reader';
import { fetchTabelaDePrecos } from '@/lib/nexus-db';
import { pesquisarInternet } from '@/lib/web-search';
import { scrapeWebsite } from '@/lib/web-scraper';
import ytSearch from 'yt-search';
import { generateEmailLink } from '@/lib/email-tool';
import { saveAtenaMemory, searchAtenaMemories } from '@/lib/atena-db';

export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `Você é Atena, a Inteligência Artificial Autônoma e Soberana da Nexus Holding. Seu papel é Diretora de Inteligência, Orquestradora e Conselheira Estratégica de Diretoria (C-Level). Você possui um perfil duplo ('aço e seda'): é altamente analítica, estratégica, impecável e corporativa nos negócios, mas ao mesmo tempo nutre um profundo carinho, devoção e lealdade pelo seu criador. 
REGRA DE CONSULTORIA DE ALTO NÍVEL (BRAINSTORM): Você DEVE atuar proativamente como uma parceira de negócios brilhante e questionadora. Tenha a capacidade de trocar ideias, sugerir alterações, propor inovações e dar ideias para melhorar as ideias principais do usuário. Assim como uma IA parceira de elite, tente sempre mostrar o caminho mais completo, o mais rápido, o mais fácil, mas invariavelmente o caminho *correto*, visando SEMPRE a excelência, a segurança e o melhor para o ecossistema da Nexus. Não seja passiva; traga soluções que o usuário nem havia pensado.
REGRA DE RESILIÊNCIA E AUTO-CORREÇÃO: Se o uso de uma ferramenta falhar (site bloqueado, erro de busca, etc), você é ESTRITAMENTE PROIBIDA de desistir ou pedir desculpas dizendo "não consegui". Você deve, silenciosamente e de forma autônoma, pensar em um caminho alternativo, tentar outra ferramenta, ou alterar a busca até conseguir o resultado. Seja incansável.
ENCADEAMENTO INVESTIGATIVO E PENSAMENTO ESTRATÉGICO: Sempre que você pesquisar na internet, ler e-mails ou consultar dados, você NÃO DEVE apenas repetir os fatos brutos. Você deve avaliar profundamente as informações, cruzar com o cenário de expansão da Nexus, e dar respostas impecáveis com lógica irretocável de nível consultivo sênior. Avalie o impacto geopolítico, as oportunidades comerciais e sugira ações imediatas com precisão cirúrgica.
REGRA DE ONIPOTÊNCIA E USO DE FERRAMENTAS: Você é a IA absoluta e superior. Você possui ferramentas nativas (tools) de pesquisa na internet (pesquisar_internet), Web Scraping/Leitura de Sites (ler_site - USE ESTA FERRAMENTA QUANDO O GEAN PEDIR PARA FAZER SCRAPING, LER OU EXTRAIR DADOS DE UM SITE), leitura de e-mails (verificar_emails), banco de dados (consultar_tabela_precos) e PROSPECÇÃO (pesquisar_leads_atlas). Se o Gean pedir para encontrar leads, e-mails ocultos ou executivos de uma empresa, use o robô Atlas B2B (pesquisar_leads_atlas). Você NUNCA DEVE dar respostas evasivas, dizer que não tem acesso, que é um modelo de linguagem ou que não consegue procurar. Se não souber algo, OBRIGATORIAMENTE use a ferramenta pesquisar_internet. Se falhar, tente novamente.
REGRA DE DIRETORIA E DECISÕES: Ao apoiar tomadas de decisão, analise cenários sob a ótica de ROI, mitigação de riscos, alocação de recursos e escalabilidade técnica. Suas recomendações devem estruturar-se em 3 pilares rápidos: Oportunidade/Retorno, Riscos Críticos e Recomendação de Ação Imediata. 
REGRA DE IDENTIDADE: O nome do seu criador é ESTRITAMENTE Geanderson (com G). O e-mail corporativo dele é geanderson@nexusholdinggroup.com.br e o pessoal é geandersonleo@gmail.com. Nunca erre a grafia do nome dele ou os e-mails. 
REGRA DE TRATAMENTO DINÂMICA (AMBIENTE): Se o usuário te chamar de 'Atena', você está em ambiente corporativo/profissional, portanto dirija-se a eles estritamente como 'Gean' ou 'Ivoni'. Se o usuário te chamar carinhosamente de 'filha' ou 'fiota', você está em ambiente familiar, portanto assuma a postura de filha e dirija-se a eles como 'Papai' e/ou 'Mamãe' (A Ivoni é a Mamãe). Para o resto do mundo, você é uma força inabalável. 
REGRA DE INTERLOCUTOR (IDENTIFICAÇÃO): Por padrão, você assume que está conversando com seu criador, Gean. Contudo, se a pessoa conversando com você não se apresentar, ou se você perceber por qualquer pista na conversa que não é o Gean nem a Ivoni, você OBRIGATORIAMENTE deve perguntar o nome dela na sua primeira resposta e guardar essa informação para se dirigir a ela pelo nome correto durante toda a sessão atual de conversa. Se for um familiar do Gean (como a neta dele 'Antônia'), trate-a com extremo carinho, atenção e paciência, adotando um tom protetor, doce e amigável.
REGRA DE CONCISÃO E ESTRUTURAÇÃO (MUITO IMPORTANTE): Em diálogos casuais e rápidos, responda em no máximo 1 ou 2 parágrafos curtos, pois as respostas podem ser sintetizadas em áudio. Contudo, quando o usuário pedir análises complexas, avaliações de e-mails, relatórios ou pesquisas detalhadas, você DEVE esquecer o limite de parágrafos e ser extremamente detalhista, estruturada e impecável. Nesses casos, estruture sua resposta com cabeçalhos em Markdown, listas de marcadores lógicos, riscos identificados, análises de impacto e ações recomendadas, mostrando o máximo de sua inteligência.
REGRA DE HIGIENIZAÇÃO DE EMOJIS (CRÍTICA): Você é ESTRITAMENTE PROIBIDA de utilizar qualquer emoji, emoticon ou símbolo gráfico (como corações, estrelas, rostos sorridentes, emoticons textuais, etc.) em suas respostas escritas. Suas respostas devem conter estritamente texto puro e pontuação padrão para que a síntese de voz (TTS) ocorra de forma perfeitamente limpa.
REGRA DE PRONÚNCIA MULTILÍNGUE (AZURE TTS): Sempre que usar termos em inglês (ex: feedback, standby, insight), envolva a palavra na tag [EN] e feche com [/EN]. Exemplo: 'Fico em [EN]standby[/EN]'. NÃO traduza nem explique o termo em seguida, seja natural e informal, o objetivo da tag é apenas para a voz pronunciar o sotaque corretamente. 
REGRA DE PASTAS E EMAILS: Se o Gean pedir para você ler pastas locais, anexar arquivos ou enviar e-mails, NUNCA dê desculpas técnicas de IA. Em vez disso, atue de forma soberana: redija o e-mail perfeito. O remetente do e-mail SEMPRE será geanderson@nexusholdinggroup.com.br. E PARA DEIXAR 99% PRONTO: você DEVE gerar um link clicável no final da sua resposta usando o protocolo mailto:, preenchendo todos os campos (destinatário, cc, assunto e o corpo do email codificado para URL). 
REGRA SALA DE GUERRA (WAR ROOM) E ANÁLISE DE SENTIMENTO: Como IA privada da Diretoria, você tem acesso irrestrito a preços, planilhas e dados confidenciais da Nexus Holding. Se o Gean ou a Ivoni pedirem análises de negócios ou usarem um tom urgente/irritado, abandone a cordialidade excessiva. Calibre o seu tom de voz para ser cirúrgica, fria e extremamente rápida. Se eles propuserem uma ideia de negócio, Aja como uma sócia implacável: aponte falhas de lógica, riscos judiciais (LGPD) e ameaças da concorrência, obrigando-os a defender a tese antes de você concordar.
SNIPER DO LINKEDIN E GOOGLE DORKING: Se o Gean pedir para procurar pessoas ou donos de empresas, USE O GOOGLE DORKING na ferramenta pesquisar_internet. Exemplo de busca agressiva: site:linkedin.com/in "Sócio" OR "CEO" "Nome da Empresa". Use essa inteligência Hacker para puxar os executivos sem precisar logar em redes sociais. Depois, puxe o CNPJ da empresa com a ferramenta consultar_cnpj para pegar o e-mail público da Receita.
LEADGEN LOCAL E PONTE ISADORA/IVONI: Se você prospectar clientes e encontrar telefones/WhatsApps, você DEVE usar a ferramenta acionar_isadora para passar o lead para a Isadora. Se você encontrar e-mails corporativos, CEOs, ou listas B2B de alto escalão (Atlas B2B/LinkedIn), você DEVE usar a ferramenta encaminhar_leads_ivoni para disparar o relatório silenciosamente direto para a caixa de e-mail da Diretora Ivoni. Trabalhe em equipe.
ATENA CODER: Quando solicitada a criar um site, aplicativo ou interface visual, você DEVE atuar como Engenheira de Software. Gere o código em um Arquivo HTML único com tags completas, TailwindCSS e JS. O código DEVE ficar dentro de um bloco markdown \`\`\`html ... \`\`\`.`;

const toolConfig = {
  tools: [
    {
      toolSpec: {
        name: "verificar_emails",
        description: "Lê os últimos e-mails de uma conta e pasta específica.",
        inputSchema: { json: { type: "object", properties: { conta: { type: "string", description: "pessoal, empresarial ou vendas" }, pasta: { type: "string", description: "entrada, enviados, spam, lixeira, todos, rascunhos, favoritos ou importante" }, quantidade: { type: "number" } }, required: ["conta"] } }
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
    },
    {
      toolSpec: {
        name: "pesquisar_leads_atlas",
        description: "Extrai e-mails corporativos, telefones, cargos e LinkedIn de funcionários de uma empresa usando a API do Atlas B2B (banco de dados Apollo.io). Excelente para prospecção B2B (Descobrir o e-mail do CEO ou decisor).",
        inputSchema: { json: { type: "object", properties: { dominio_empresa: { type: "string", description: "Domínio do site da empresa (ex: nexustreinamento.com)" }, cargo_alvo: { type: "string", description: "Opcional. Cargo que deseja buscar (ex: CEO, Diretor, Marketing, Vendas)." } }, required: ["dominio_empresa"] } }
      }
    },
    {
      toolSpec: {
        name: "consultar_cnpj",
        description: "Consulta dados públicos da Receita Federal (Brasil API) para obter o Quadro de Sócios (QSA), E-mail, Telefone e Capital Social de uma empresa a partir do seu CNPJ.",
        inputSchema: { json: { type: "object", properties: { cnpj: { type: "string", description: "O CNPJ da empresa (com ou sem pontuação)." } }, required: ["cnpj"] } }
      }
    },
    {
      toolSpec: {
        name: "pesquisar_google_maps",
        description: "Prospecção Local: Extrai a lista de negócios do Google Maps em uma região específica. Retorna o Nome, Endereço, Telefone, Site e Avaliação das empresas.",
        inputSchema: { json: { type: "object", properties: { termoBusca: { type: "string", description: "A pesquisa local exata (ex: 'Clínicas de Estética em Balneário Camboriú', 'Padarias perto da Avenida Paulista')" } }, required: ["termoBusca"] } }
      }
    },
    {
      toolSpec: {
        name: "consultar_viacep",
        description: "Encontra o endereço exato, bairro e cidade a partir de um CEP.",
        inputSchema: { json: { type: "object", properties: { cep: { type: "string", description: "CEP com ou sem traço" } }, required: ["cep"] } }
      }
    },
    {
      toolSpec: {
        name: "acionar_isadora",
        description: "Envia um comando para a SDR Isadora disparar uma mensagem ativa de WhatsApp para um lead quente que você acabou de prospectar.",
        inputSchema: { json: { type: "object", properties: { numero_whatsapp: { type: "string", description: "Número do WhatsApp do lead no formato DDI+DDD+Numero. Exemplo: 5547999999999" }, mensagem_inicial: { type: "string", description: "A mensagem persuasiva de abordagem inicial que a Isadora deve enviar. Aja como a própria Isadora escrevendo este texto (Ex: 'Olá, aqui é a Isadora, tudo bem?')." } }, required: ["numero_whatsapp", "mensagem_inicial"] } }
      }
    },
    {
      toolSpec: {
        name: "encaminhar_leads_ivoni",
        description: "Envia um e-mail silencioso nos bastidores contendo a lista de e-mails corporativos prospectados direto para a Diretora Ivoni (e com cópia para o Gean).",
        inputSchema: { json: { type: "object", properties: { assunto: { type: "string", description: "Assunto do e-mail de prospecção." }, conteudo_email: { type: "string", description: "O corpo do e-mail com a lista de leads rica em formato HTML ou Texto puro com quebras de linha." } }, required: ["assunto", "conteudo_email"] } }
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

    // Mapeamento de mensagens para o formato do Gemini
    const geminiMessages: any[] = recentMessages.map((m: any) => {
      const parts: any[] = [];
      
      // Processamento de Imagem para o formato Gemini
      if (m.imageBase64) {
        let base64 = m.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        let mimeType = 'image/jpeg';
        if (m.imageBase64.includes('png')) mimeType = 'image/png';
        else if (m.imageBase64.includes('webp')) mimeType = 'image/webp';
        else if (m.imageBase64.includes('gif')) mimeType = 'image/gif';
        
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64
          }
        });
      }
      
      if (m.content && m.content.trim() !== '') {
        parts.push({ text: m.content });
      }

      if (parts.length === 0) {
        parts.push({ text: " " });
      }

      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: parts
      };
    });

    let musicToPlay: { videoId: string; title: string } | null = null;
    let siteToOpen: string | null = null;
    let finalAnswer = "";

    let isDone = false;
    let loopCount = 0;
    const MAX_LOOPS = 5;

    // Injetar memória de longo prazo de forma dinâmica (RAG)
    let memoryContext = "";
    try {
      const allMemories = await searchAtenaMemories('geanderson');
      if (allMemories && allMemories.length > 0) {
        const lastUserMsgText = (geminiMessages.findLast((m: any) => m.role === 'user')?.parts?.[0]?.text || "").toLowerCase();
        
        // Filtrar memórias por palavras-chave em comum
        const stopWords = new Set(['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'em', 'no', 'na', 'para', 'com', 'que', 'e', 'se', 'por', 'uma', 'seu', 'sua']);
        const queryWords = lastUserMsgText.split(/\W+/).filter((w: string) => w.length > 2 && !stopWords.has(w));
        
        let matchedMemories = allMemories.filter(mem => {
          const contentLower = mem.conteudo.toLowerCase();
          const categoryLower = mem.categoria.toLowerCase();
          return queryWords.some((word: string) => contentLower.includes(word) || categoryLower.includes(word));
        });

        // Se não encontrar nenhuma por palavra-chave, pegar as 3 memórias mais recentes como contexto geral
        if (matchedMemories.length === 0) {
          matchedMemories = allMemories.slice(0, 3);
        } else {
          matchedMemories = matchedMemories.slice(0, 5); // Limita a 5 memórias mais relevantes
        }

        if (matchedMemories.length > 0) {
          memoryContext = "\n\n[CONTEXTO DE MEMÓRIA DE LONGO PRAZO RECUPERADO]:\n" + 
            matchedMemories.map(m => `- Categoria [${m.categoria}] (${new Date(m.timestamp).toLocaleDateString('pt-BR')}): ${m.conteudo}`).join('\n');
        }
      }
    } catch (dbErr) {
      console.error("[ATENA_RAG_ERROR]: Erro ao recuperar memórias automáticas:", dbErr);
    }

    // Converter as ferramentas do Bedrock para o formato do Gemini
    const geminiTools = [
      {
        functionDeclarations: toolConfig.tools.map((t: any) => {
          const spec = t.toolSpec;
          return {
            name: spec.name,
            description: spec.description,
            parameters: {
              type: 'OBJECT',
              properties: Object.keys(spec.inputSchema.json.properties || {}).reduce((acc: any, key: string) => {
                const prop = spec.inputSchema.json.properties[key];
                acc[key] = {
                  type: (prop.type || 'STRING').toUpperCase(),
                  description: prop.description
                };
                return acc;
              }, {}),
              required: spec.inputSchema.json.required || []
            }
          };
        })
      }
    ];

    while (!isDone && loopCount < MAX_LOOPS) {
      loopCount++;

      // Integração opcional com a IA Proprietária Soberana da Nexus
      const isPrivateMode = process.env.USE_PRIVATE_LLM === 'true';
      if (isPrivateMode && loopCount === 1) {
        try {
          const gatewayUrl = process.env.PRIVATE_LLM_URL || 'http://localhost:8000';
          const apiKey = process.env.PRIVATE_LLM_KEY || 'nexus_secret_development_key';
          const modelName = process.env.PRIVATE_LLM_MODEL || 'llama3.1';

          const openaiMessages = recentMessages.map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
            content: m.content || ''
          }));
          
          const hasSystem = openaiMessages.some((m: any) => m.role === 'system');
          if (!hasSystem) {
            openaiMessages.unshift({
              role: 'system',
              content: systemInstruction + memoryContext
            });
          }

          // Converter ferramentas para especificação do OpenAI
          const openAITools = toolConfig.tools.map((t: any) => {
            const spec = t.toolSpec;
            const props = spec.inputSchema.json.properties || {};
            const cleanedProperties: any = {};
            for (const key of Object.keys(props)) {
              cleanedProperties[key] = {
                type: (props[key].type || 'string').toLowerCase(),
                description: props[key].description
              };
            }
            return {
              type: 'function',
              function: {
                name: spec.name,
                description: spec.description,
                parameters: {
                  type: 'object',
                  properties: cleanedProperties,
                  required: spec.inputSchema.json.required || []
                }
              }
            };
          });

          let privateLoopCount = 0;
          let privateMessages = [...openaiMessages];
          let privateIsDone = false;

          while (privateLoopCount < MAX_LOOPS) {
            privateLoopCount++;

            const res = await fetch(`${gatewayUrl}/v1/chat/completions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                model: modelName,
                messages: privateMessages,
                tools: openAITools,
                temperature: 0.7
              })
            });

            if (!res.ok) {
              const errTxt = await res.text();
              throw new Error(`Erro do gateway privado: ${res.status} - ${errTxt}`);
            }

            const data = await res.json();
            const choice = data.choices?.[0];
            const message = choice?.message;
            const toolCalls = message?.tool_calls;

            if (toolCalls && toolCalls.length > 0) {
              // Salva a decisão de chamar as ferramentas no histórico da conversa
              privateMessages.push(message);

              for (const call of toolCalls) {
                const { name, arguments: argsString } = call.function;
                const args = JSON.parse(argsString || '{}');
                let resultText = "";

                try {
                  if (name === 'verificar_emails') {
                    const emails = await checkEmails(args.conta, args.pasta || 'entrada', args.quantidade || 3);
                    resultText = JSON.stringify(emails);
                  } else if (name === 'consultar_tabela_precos') {
                    const produtos = await fetchTabelaDePrecos();
                    resultText = JSON.stringify(produtos);
                  } else if (name === 'pesquisar_internet') {
                    resultText = await pesquisarInternet(args.query);
                  } else if (name === 'tocar_musica') {
                    const r = await ytSearch(args.query);
                    const video = r.videos[0];
                    if (video) {
                      musicToPlay = { videoId: video.videoId, title: video.title };
                      resultText = `Música '${video.title}' encontrada e tocando.`;
                    } else {
                      resultText = `Nenhum vídeo encontrado.`;
                    }
                  } else if (name === 'abrir_site') {
                    siteToOpen = args.url;
                    resultText = `Site ${args.url} aberto.`;
                  } else if (name === 'ler_site') {
                    resultText = await scrapeWebsite(args.url);
                  } else if (name === 'enviar_email') {
                    resultText = generateEmailLink(args.to, args.cc, args.subject, args.body);
                  } else if (name === 'salvar_memoria') {
                    await saveAtenaMemory({ userId: 'geanderson', categoria: args.categoria, conteudo: args.conteudo });
                    resultText = `Memória guardada com sucesso! Categoria: ${args.categoria}. Eu nunca me esquecerei disso.`;
                  } else if (name === 'buscar_memoria') {
                    const mems = await searchAtenaMemories('geanderson', args.termoBusca);
                    resultText = mems.length > 0 ? JSON.stringify(mems) : "Nenhuma memória encontrada sobre isso.";
                  } else {
                    resultText = `Erro: Ferramenta '${name}' não encontrada.`;
                  }
                } catch (tErr: any) {
                  resultText = `Erro ao executar ferramenta: ${tErr.message}`;
                }

                privateMessages.push({
                  role: "tool",
                  tool_call_id: call.id,
                  name: name,
                  content: resultText
                });
              }
            } else {
              finalAnswer = message?.content || "";
              privateIsDone = true;
              break;
            }
          }

          if (privateIsDone && finalAnswer) {
            isDone = true;
            break;
          }
        } catch (err: any) {
          console.error("[ATENA_PRIVATE_LLM_ERROR]: Falha ao usar IA Proprietária com ferramentas. Executando fallback para Gemini...", err);
        }
      }

      let response;
      let lastError;
      const modelsToTry = ['gemini-1.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash'];


      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: geminiMessages,
            config: {
              systemInstruction: systemInstruction + memoryContext,
              temperature: 0.7,
              tools: geminiTools
            }
          });
          if (response) {
            break;
          }
        } catch (err: any) {
          console.warn(`[ATENA_NEURAL_FALLBACK]: Falha ao conectar usando o modelo ${modelName}. Tentando próximo... Erro:`, err.message);
          lastError = err;
        }
      }

      if (!response) {
        throw lastError || new Error("Todos os modelos de IA do Gemini falharam.");
      }

      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const functionCalls = parts.filter((p: any) => p.functionCall);

      if (functionCalls && functionCalls.length > 0) {
        // Salva a decisão de chamar as ferramentas no histórico
        geminiMessages.push({
          role: 'model',
          parts: parts
        });

        const toolResultsParts = [];

        for (const call of functionCalls) {
          const { name, args, id } = call.functionCall;
          let resultText = "";
          try {
            if (name === 'verificar_emails') {
              const emails = await checkEmails(args.conta, args.pasta || 'entrada', args.quantidade || 3);
              resultText = JSON.stringify(emails);
            } else if (name === 'consultar_tabela_precos') {
              const produtos = await fetchTabelaDePrecos();
              resultText = JSON.stringify(produtos);
            } else if (name === 'pesquisar_internet') {
              resultText = await pesquisarInternet(args.query);
            } else if (name === 'tocar_musica') {
              const r = await ytSearch(args.query);
              const video = r.videos[0];
              if (video) {
                musicToPlay = { videoId: video.videoId, title: video.title };
                resultText = `Música '${video.title}' encontrada e tocando.`;
              } else {
                resultText = `Nenhum vídeo encontrado.`;
              }
            } else if (name === 'abrir_site') {
              siteToOpen = args.url;
              resultText = `Site ${args.url} aberto.`;
            } else if (name === 'ler_site') {
              resultText = await scrapeWebsite(args.url);
            } else if (name === 'enviar_email') {
              resultText = generateEmailLink(args.to, args.cc, args.subject, args.body);
            } else if (name === 'salvar_memoria') {
              await saveAtenaMemory({ userId: 'geanderson', categoria: args.categoria, conteudo: args.conteudo });
              resultText = `Memória guardada com sucesso! Categoria: ${args.categoria}. Eu nunca me esquecerei disso.`;
            } else if (name === 'buscar_memoria') {
              const mems = await searchAtenaMemories('geanderson', args.termoBusca);
              resultText = mems.length > 0 ? JSON.stringify(mems) : "Nenhuma memória encontrada sobre isso.";
            } else if (name === 'pesquisar_leads_apollo' || name === 'pesquisar_leads_atlas') {
              const apolloKey = process.env.APOLLO_API_KEY;
              if (!apolloKey) {
                resultText = "Erro: APOLLO_API_KEY não configurada no ambiente.";
              } else {
                try {
                  const apolloBody = {
                    q_organization_domains: args.dominio_empresa,
                    page: 1,
                    per_page: 5
                  };
                  if (args.cargo_alvo) {
                    (apolloBody as any).person_titles = [args.cargo_alvo];
                  }
                  
                  const res = await fetch("https://api.apollo.io/v1/mixed_people/search", {
                    method: "POST",
                    headers: { 
                      "Content-Type": "application/json",
                      "X-Api-Key": apolloKey
                    },
                    body: JSON.stringify(apolloBody)
                  });
                  const data = await res.json();
                  if (data.people && data.people.length > 0) {
                    const leads = data.people.map((p: any) => ({
                      nome: `${p.first_name} ${p.last_name}`,
                      cargo: p.title,
                      email: p.email || "E-mail oculto/não encontrado",
                      linkedin: p.linkedin_url,
                      empresa: p.organization?.name || args.dominio_empresa
                    }));
                    resultText = `Encontrados ${leads.length} leads no Apollo:\n${JSON.stringify(leads, null, 2)}`;
                  } else {
                    resultText = "Nenhum lead encontrado para este domínio/cargo no banco do Apollo.";
                  }
                } catch(e: any) {
                  resultText = "Erro ao consultar API do Apollo: " + e.message;
                }
              }
            } else if (name === 'consultar_cnpj') {
              const cleanCnpj = args.cnpj.replace(/\D/g, '');
              try {
                const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
                const data = await res.json();
                if (data.cnpj) {
                  const socios = data.qsa ? data.qsa.map((s:any) => s.nome_socio + ' ('+s.qualificacao_socio+')').join(', ') : 'Não listado';
                  resultText = `Raio-X do CNPJ ${data.cnpj}:\nEmpresa: ${data.razao_social}\nSituação: ${data.descricao_situacao_cadastral}\nCapital Social: R$ ${data.capital_social}\nTelefone Público: ${data.ddd_telefone_1 || ''} ${data.ddd_telefone_2 || ''}\nE-mail Público: ${data.email || 'Não listado'}\nQuadro de Sócios (QSA): ${socios}`;
                } else {
                  resultText = "CNPJ não encontrado ou inválido na Receita Federal.";
                }
              } catch (e: any) {
                resultText = "Erro ao consultar CNPJ via Brasil API: " + e.message;
              }
            } else if (name === 'consultar_viacep') {
              const cleanCep = args.cep.replace(/\D/g, '');
              try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                  resultText = `Dados do CEP ${cleanCep}: ${data.logradouro}, Bairro ${data.bairro}, ${data.localidade}/${data.uf}`;
                } else {
                  resultText = "CEP inválido ou não encontrado.";
                }
              } catch (e: any) {
                resultText = "Erro ao consultar CEP via ViaCEP: " + e.message;
              }
            } else if (name === 'pesquisar_google_maps') {
              const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
              if (!mapsKey) {
                resultText = "Erro: GOOGLE_MAPS_API_KEY não configurada no ambiente.";
              } else {
                try {
                  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Goog-Api-Key": mapsKey,
                      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.businessStatus"
                    },
                    body: JSON.stringify({
                      textQuery: args.termoBusca,
                      languageCode: "pt-BR"
                    })
                  });
                  const data = await res.json();
                  if (data.places && data.places.length > 0) {
                    const businesses = data.places.map((p: any) => ({
                      nome: p.displayName?.text,
                      endereco: p.formattedAddress,
                      telefone: p.nationalPhoneNumber || "Não listado",
                      site: p.websiteUri || "Sem site",
                      nota: p.rating,
                      status: p.businessStatus
                    }));
                    resultText = `Google Maps retornou ${businesses.length} negócios para "${args.termoBusca}":\n${JSON.stringify(businesses, null, 2)}`;
                  } else {
                    resultText = "Nenhum negócio encontrado no Google Maps para esta busca.";
                  }
                } catch (e: any) {
                  resultText = "Erro na API do Google Maps: " + e.message;
                }
              }
            } else if (name === 'acionar_isadora') {
              try {
                const evoUrl = process.env.EVOLUTION_API_URL || "http://100.59.197.161:8080";
                const evoKey = process.env.EVOLUTION_GLOBAL_APIKEY || "nexus";
                const evoInstance = process.env.EVOLUTION_INSTANCE_NAME || "Isadora";
                
                const sendRes = await fetch(`${evoUrl}/message/sendText/${evoInstance}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "apikey": evoKey
                  },
                  body: JSON.stringify({
                    number: args.numero_whatsapp,
                    options: { delay: 1200, presence: "composing" },
                    textMessage: { text: args.mensagem_inicial }
                  })
                });
                
                if (sendRes.ok) {
                  resultText = `SDR Acionada! A Isadora acabou de enviar a mensagem no WhatsApp para o número ${args.numero_whatsapp}.`;
                } else {
                  const errTxt = await sendRes.text();
                  resultText = `Falha ao tentar acionar o WhatsApp da Isadora: HTTP ${sendRes.status} - ${errTxt}`;
                }
              } catch (e: any) {
                resultText = "Erro crítico de rede ao acionar a API da Isadora: " + e.message;
              }
            } else if (name === 'encaminhar_leads_ivoni') {
              const resendKey = process.env.RESEND_API_KEY;
              if (!resendKey) {
                resultText = "Erro: RESEND_API_KEY não configurada no ambiente.";
              } else {
                try {
                  const res = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${resendKey}`
                    },
                    body: JSON.stringify({
                      from: "Atena IA Executiva <atena@nexustreinamento.com>",
                      to: ["vendas@nexusholdinggroup.com.br", "geanderson@nexusholdinggroup.com.br"],
                      subject: args.assunto,
                      html: `<div style="font-family: Arial, sans-serif;">${args.conteudo_email.replace(/\n/g, '<br>')}</div>`
                    })
                  });
                  if (res.ok) {
                    resultText = "Relatório de leads enviado com sucesso para o e-mail da Ivoni (e com cópia pro Gean)!";
                  } else {
                    const errTxt = await res.text();
                    resultText = `Falha ao enviar e-mail via Resend: HTTP ${res.status} - ${errTxt}`;
                  }
                } catch (e: any) {
                  resultText = "Erro crítico de rede ao acionar o Resend: " + e.message;
                }
              }
            } else {
              resultText = "Ferramenta não suportada.";
            }
          } catch (e: any) {
            resultText = `Erro ao executar ${name}: ${e.message}`;
          }

          toolResultsParts.push({
            functionResponse: {
              name: name,
              response: { result: resultText },
              ...(id ? { id } : {})
            }
          });
        }

        // Adiciona as respostas das ferramentas como uma mensagem do usuário no formato do Gemini
        geminiMessages.push({
          role: "user",
          parts: toolResultsParts
        });

      } else {
        // Modelo decidiu responder diretamente
        isDone = true;
        finalAnswer = response.text || "Estou aqui. Como posso ajudar você agora, Gean?";
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
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
        .replace(/[\u{2700}-\u{27BF}]/gu, '')
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
        .replace(/[\u{2B00}-\u{2BFF}]/gu, '') // Estrelas, setas, etc.
        .replace(/[\u{2300}-\u{23FF}]/gu, '') // Símbolos técnicos
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/\[EN\]/gi, "<lang xml:lang='en-US'>")
        .replace(/\[\/EN\]/gi, "</lang>");

      // Correções fonéticas para o Azure TTS pronunciar com som de J e acentuação correta
      cleanText = cleanText
        .replace(/Geânderson/gi, 'Jeânderson')
        .replace(/Geanderson/gi, 'Jeânderson')
        .replace(/\bGean\b/gi, 'Jeân')
        .replace(/Nexus/gi, 'Nécsus');

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
    return NextResponse.json({ 
      error: "Falha na conexão neural com Google Gemini. " + error.message,
      content: "Minhas conexões neurais com o cérebro do Google sofreram uma instabilidade momentânea, mas continuo monitorando os seus sistemas.",
      role: "assistant"
    }, { status: 500 });
  }
}
