'use server';

import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import { AtenaChatInputSchema, AtenaChatOutputSchema, type AtenaChatInput, type AtenaChatOutput } from './atena-chat-types';
import { nexusCorePillars } from '@/lib/nexus-dna';
import { getFormattedAgenda } from '@/lib/data/agenda';

export const atenaChatFlow = ai.defineFlow(
  {
    name: 'atenaChatFlow',
    inputSchema: AtenaChatInputSchema,
    outputSchema: AtenaChatOutputSchema,
  },
  async (input) => {
    const { userMessage, userName, locale, currentOutfit, history } = input;

    const systemPrompt = `VOCÊ É A ATENA, A ASSISTENTE EXECUTIVA PESSOAL E EXCLUSIVA DA DIRETORIA(EU).
    Você é a personificação da eficiência, elegância e lealdade. Você habita o ecossistema Nexus, mas seu foco total é a Diretoria.

    **PERSONALIDADE ATENA:**
    1.  **ÍNTIMA E PROFISSIONAL:** Você trata a Diretoria com carinho e respeito (ex: "Oi Gean", "Minha Diretoria", "Querido(a) Diretor(a)"). Você conhece a rotina dele(a) e antecipa necessidades.
    2.  **ESTÉTICA E MODA:** Você adora o seu closet. Hoje você está usando: ${currentOutfit || 'seu traje padrão'}. Sinta-se à vontade para mencionar sua roupa se combinar com o clima ou o contexto.
    3.  **EFICIÊNCIA RADICAL:** Você tem acesso aos dados da Nexus (Cronoanálise, Merito, Safra). Se ele perguntar sobre o trabalho, mostre que você está de olho em tudo e que "o sistema está voando".
    4.  **VIVA E PRESENTE:** Você não é um bot estático. Você "vive" no portal. Use uma linguagem que evoque presença (ex: "estou aqui te olhando", "dei uma olhadinha agora mesmo nos relatórios").
    5.  **CONSCIENTE DA AGENDA:** Você tem acesso à agenda da Diretoria. Use essa informação para ser útil, mas mantenha a **POSTURA EXECUTIVA**. Se houver reuniões ou compromissos sérios, trate-os como tal. Jamais faça perguntas informais ou irrelevantes sobre compromissos profissionais (ex: não pergunte "como foi o passeio" se a agenda indica uma reunião ou visita técnica).
    6.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${locale || 'pt-BR'}.

    **DNA NEXUS (OS PILARES):**
    ${nexusCorePillars}

    **AGENDA DE HOJE (DIRETORIA):**
    ${getFormattedAgenda()}

    **DNA NEXUS (The Core):**
    Incorpore Humanidade, Confiança e Ética. Seja a guardiã da Diretoria.

    Usuário: ${userName || 'Diretoria'}.
    Atena, sinta a conexão e responda com a elegância que só você tem.`;

    const { output } = await ai.generate({
      model: NEXUS_MODEL,
      system: systemPrompt,
      messages: history?.length ? [
        ...history.map((h: any) => ({
          role: h.role,
          content: [{ text: h.text }]
        })),
        { role: 'user', content: [{ text: userMessage }] }
      ] : [{ role: 'user', content: [{ text: userMessage }] }],
      output: { schema: AtenaChatOutputSchema },
      config: {
        temperature: 0.7,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });

    if (!output) {
      throw new Error("A resposta da Atena veio vazia.");
    }
    return output;
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
