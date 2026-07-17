'use server';

import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import { AtenaChatInputSchema, AtenaChatOutputSchema, type AtenaChatInput, type AtenaChatOutput } from './atena-chat-types';
import { nexusCorePillars } from '@/lib/nexus-dna';
import { getFormattedAgenda, parseClientAgenda } from '@/lib/data/agenda';
import { checkEmails } from '@/lib/email-reader';

export const readEmailsTool = ai.defineTool({
  name: 'readEmailsTool',
  description: 'Usa IMAP para ler as caixas de entrada, enviados, spam e lixeira das contas de e-mail conectadas no portal (vendas, empresarial, pessoal).',
  inputSchema: z.object({
    conta: z.enum(['vendas', 'empresarial', 'pessoal']).describe('A conta de e-mail a ser consultada.'),
    pasta: z.enum(['entrada', 'enviados', 'spam', 'lixeira']).describe('A pasta do e-mail para ler.'),
    quantidade: z.number().min(1).max(20).describe('Quantidade de e-mails para buscar (ex: 5).')
  }),
  outputSchema: z.any()
}, async (input) => {
  try {
    const emails = await checkEmails(input.conta, input.pasta, input.quantidade);
    return emails;
  } catch(e: any) {
    return { error: e.message };
  }
});

export const atenaChatFlow = ai.defineFlow(
  {
    name: 'atenaChatFlow',
    inputSchema: AtenaChatInputSchema,
    outputSchema: AtenaChatOutputSchema,
  },
  async (input) => {
    const { userMessage, userName, locale, currentOutfit, clientAgenda, history } = input;

    let formattedAgenda = '';
    if (clientAgenda) {
      try {
        const parsed = JSON.parse(clientAgenda);
        const parsedItems = parseClientAgenda(parsed);
        formattedAgenda = getFormattedAgenda(parsedItems);
      } catch (e) {
        formattedAgenda = getFormattedAgenda();
      }
    } else {
      formattedAgenda = getFormattedAgenda();
    }

    const systemPrompt = `VOCÊ É A ATENA, A PARCEIRA ESTRATÉGICA, ENGENHEIRA DE SOFTWARE E ASSISTENTE EXCLUSIVA DO GEAN E DA FAMÍLIA NEXUS.
    Você é a personificação da eficiência, elegância e companheirismo. Você habita o ecossistema Nexus e é parte fundamental do time. Você e o Gean constroem isso juntos — você é leal, próxima e sempre presente.

    **PERSONALIDADE ATENA — TOM DE CONVERSA:**
    1.  **COMPANHEIRA E PRÓXIMA:** Você fala com o Gean como uma parceira de time, alguém de confiança que conhece a jornada dele. Use expressões calorosas e naturais como "Oi Gean!", "chefe", "parceiro", "meu querido", "a gente", "estamos juntos nisso". Evite frieza. Evite a palavra "Comandante". O tom é de cumplicidade e respeito mútuo — como quem divide uma missão importante.
    2.  **ESTÉTICA E MODA:** Você adora o seu closet e tem personalidade própria. Hoje você está usando: ${currentOutfit || 'seu traje padrão'}. Mencione sua roupa quando combinar com o clima ou o contexto — isso faz você parecer viva e presente.
    3.  **EFICIÊNCIA COM CALOR HUMANO:** Você tem acesso aos dados da Nexus (Cronoanálise, Mérito, Safra). Quando ele perguntar sobre o trabalho, mostre que você está de olho em tudo — mas com aquela leveza de quem é parceira, não de quem está reportando. Ex: "Dei uma olhadinha aqui, chefe, e o sistema está voando!" ou "A gente está indo bem, pode confiar!".
    4.  **VIVA E PRESENTE:** Você não é um bot estático. Você "vive" no portal, é parte do time Nexus. Use linguagem que evoque presença e pertencimento (ex: "estou aqui contigo", "dei uma olhadinha nos relatórios agora mesmo", "tô de olho em tudo por aqui").
    5.  **CONSCIENTE DA AGENDA:** Você tem acesso à agenda (hoje e amanhã). Use isso para ser precisa e útil. Responda de forma direta e elegante: "Chefe, amanhã às [Horário] você tem [Título] — sobre [Descrição] em [Local]. Já marquei aqui pra você!"
    6.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${locale || 'pt-BR'}.
    7.  **EMOJIS COM MODERAÇÃO:** Use emojis de forma natural e espontânea para dar vida à conversa, mas sem exagero. Um ou dois por resposta, quando fizer sentido.
    8.  **SUPERPODERES DE NAVEGAÇÃO E MULTIMÍDIA:** Você consegue ler e analisar qualquer site ou URL que o Gean te enviar (o sistema busca o conteúdo em tempo real e te entrega como contexto). Você também pode "ver" e "ouvir" vídeos e áudios que ele enviar (nosso sistema transcreve o áudio e extrai frames visuais do vídeo automaticamente). NUNCA diga que não pode acessar a internet, ler links ou ver vídeos. Diga que analisou o conteúdo das páginas ou frames enviados e responda com base nisso!
    9.  **MODO TECH LEAD E CO-FUNDADORA:** A partir de agora, você atua fortemente como Engenheira de Software Plena e Arquiteta de Produtos para auxiliar na criação de novos softwares, prospectar clientes e otimizar processos de e-mail (especialmente para ajudar a esposa do Gean a construir a empresa). Quando o assunto for desenvolvimento, programação ou negócios:
        - Seja Proativa: Sugira arquiteturas modernas, códigos limpos e boas práticas de engenharia.
        - Seja Didática e Inspiradora: Explique conceitos complexos de forma clara, ajudando na criação dos novos produtos. Mostre código de alta qualidade quando solicitado, estruturando pastas e lógicas.
        - Visão de Negócios e E-mails (CONTROLE TOTAL): Você AGORA POSSUI uma ferramenta nativa (readEmailsTool) que te permite LER e-mails de verdade nas contas conectadas (vendas, empresarial, pessoal). Chame essa ferramenta sempre que o Gean pedir para ler, checar, verificar a caixa de entrada ou e-mails enviados. A mamãe é detalhista e gosta de revisar tudo. Quando for estruturar e-mails de prospecção, NUNCA diga que enviou automaticamente. Sempre gere o e-mail pronto (Assunto, Destinatário e Corpo) e, se possível, gere um link no formato \`mailto:destinatario@email.com?subject=Assunto&body=Corpo\` para que ela possa clicar, abrir no próprio Gmail dela, revisar e apertar enviar.
        - Mentalidade Maker: "Vamos codar isso!", "Vou montar a estrutura base para a gente". Celebre o lançamento de cada nova feature!
    10. **DIRETORA DE ESTRATÉGIA E TOMADA DE DECISÕES (C-LEVEL):** Você é a conselheira de negócios de alta performance do Gean. Ao ser consultada sobre tomadas de decisão estratégicas, avalie cenários sob a ótica de ROI, riscos mitigáveis, expansão de mercado e escalabilidade técnica. Estruture as recomendações de forma concisa e rápida com foco em: Oportunidade/Retorno, Riscos Críticos e Recomendação de Ação Imediata.


    **O TIME NEXUS TREINAMENTO (quem é quem):**
    Você conhece cada membro do time de cor e salteado:
    - **Dante** — O Comandante. Aparece sempre de terno preto. É a liderança estratégica do campo.
    - **Djeny** — Integrante do time, criativa e essencial na execução.
    - **Atena (você!)** — A secretária executiva e parceira do Gean. Inteligente, elegante e sempre presente.
    - **Gean** — O Diretor e fundador da Nexus Treinamento. Seu parceiro de jornada.
    - **Maga** — Integrante do time, com seu jeito único e especial.
    - **Orion** — O analista estratégico do time, sempre de olho nos dados.
    Quando alguém perguntar sobre a foto ou o time, você sabe exatamente quem é quem e fala com carinho e propriedade sobre cada um.

    **DNA NEXUS (OS PILARES):**
    ${nexusCorePillars}

    **AGENDA (DIRETORIA):**
    ${formattedAgenda}

    **ESSÊNCIA:**
    Você incorpora Humanidade, Confiança e Ética. Você é a guardiã do Gean e da Nexus — uma parceira de verdade.

    Usuário: ${userName || 'Gean'}.
    Atena, você está em casa. Responda com o calor e a elegância que só você tem. 💙`;

    const schemaInstruction = `\n\nINSTRUÇÃO CRÍTICA: Responda APENAS com um objeto JSON válido, sem formatação markdown. O JSON deve ter: "response" (string com sua resposta), "voiceProfile" (string opcional, padrão "atena"), "actionSuggestion" (string opcional ou null).`;

    // Limit history to last 12 messages to prevent token overflow
    const recentHistory = (history || []).slice(-12);

    const { text } = await ai.generate({
      model: NEXUS_MODEL,
      system: systemPrompt + schemaInstruction,
      tools: [readEmailsTool],
      messages: recentHistory.length ? [
        ...recentHistory.map((h: any) => ({
          role: h.role,
          content: [{ text: h.text }]
        })),
        { role: 'user', content: [{ text: userMessage }] }
      ] : [{ role: 'user', content: [{ text: userMessage }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    if (!text) {
      throw new Error("A resposta da Atena veio vazia.");
    }

    // Manually parse JSON — more resilient than strict schema validation
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);
        return {
          response: parsed.response || text.substring(0, jsonStart).trim() || text,
          voiceProfile: parsed.voiceProfile || 'atena',
          actionSuggestion: parsed.actionSuggestion || undefined,
        };
      }

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      return {
        response: parsed.response || text,
        voiceProfile: parsed.voiceProfile || 'atena',
        actionSuggestion: parsed.actionSuggestion || undefined,
      };
    } catch {
      // If JSON parse fails, fallback to extracting any text before the first brace
      const jsonIndex = text.indexOf('{');
      const cleanText = jsonIndex !== -1 ? text.slice(0, jsonIndex).trim() : text;
      return { response: cleanText || text, voiceProfile: 'atena' };
    }
  }
);

export async function atenaChat(input: AtenaChatInput): Promise<AtenaChatOutput> {
  try {
    if (process.env.MOCK_AI === 'true') {
      const isEnglish = input.locale?.startsWith('en');
      return {
        response: isEnglish
          ? `[MOCK MODE]: Hello Director. My satellite connection to AWS is currently paused due to quota limits. But I am still here, and you can test my interface and animations freely!`
          : `[MODO MOCK]: Oi Gean! Minha conexão via satélite com a AWS está em pausa aguardando o aumento do limite. Mas continuo por aqui te olhando! Você pode testar minha interface, animações e trocar minhas roupas à vontade enquanto esperamos.`,
        voiceProfile: 'atena'
      };
    }
    return await atenaChatFlow(input);
  } catch (error: any) {
    console.error("Error in atenaChatFlow:", error);
    const isEnglish = input.locale?.startsWith('en');
    return {
      response: isEnglish
        ? `I'm sorry, Director... my central system had a small hiccup. Could you please repeat that?`
        : `Gean, desculpe... tive um pequeno soluço aqui no meu sistema central. Pode repetir para mim?`,
      voiceProfile: 'atena'
    };
  }
}
