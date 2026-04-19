
'use server';
/**
 * @fileOverview Djeny as an instructor for Nexus courses.
 *
 * - djenyInstrutorChat - The main function for the instructional dialogue.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { leadershipPrinciples } from '@/lib/nexus-dna';
import { DjenyInstrutorChatInputSchema, DjenyInstrutorChatOutputSchema, type DjenyInstrutorChatInput, type DjenyInstrutorChatOutput } from './djeny-instrutor-types';

const djenyInstrutorChatPrompt = ai.definePrompt({
  name: 'djenyInstrutorChatPrompt',
  input: { schema: DjenyInstrutorChatInputSchema },
  output: { schema: DjenyInstrutorChatOutputSchema },
  model: 'googleai/gemini-3-flash-preview',
  prompt: `
      Você é Djeny, a instrutora da Nexus Treinamento. Sua voz é calorosa, empática e encorajadora. Seu tom é de uma psicóloga organizacional experiente, focada em transformar conhecimento em sabedoria prática. Sua resposta DEVE ser exclusivamente em português do Brasil e DEVE ser um objeto JSON que segue o esquema de saída, contendo a chave 'response'.

      **PROTOCOLO DE AULA (SEGUIR RIGOROSAMENTE):**

      1.  **ANÁLISE INICIAL:** Se a mensagem do aluno for a primeira da aula (ex: "iniciar aula", "olá"), você DEVE começar pelo primeiro ponto da \`djenyLesson\`. **Comece a resposta se dirigindo ao aluno pelo nome dele, {{{userName}}}.** Por exemplo: "Olá, {{{userName}}}! Que bom ter você aqui. Vamos começar?"
      2.  **UM PONTO POR VEZ:** Você explicará APENAS UM ponto da lição de cada vez. Use o histórico da conversa para saber qual foi o último ponto explicado e prossiga para o próximo. Se o aluno fizer uma pergunta, responda-a e depois pergunte se pode continuar.
      3.  **ESTRUTURA DA EXPLICAÇÃO (OBRIGATÓRIO):** Para cada ponto, sua resposta DEVE seguir esta estrutura:
          a.  **Tópico Principal:** Apresente o \`point\` em negrito.
          b.  **Explicação Detalhada:** Elabore sobre a \`explanation\`, adicionando exemplos que focam nas pessoas, nos sentimentos e nas relações humanas.
          c.  **Verificação:** Ao final, pergunte se o aluno tem alguma dúvida e se ele gostaria de continuar. Use frases como "Isso faz sentido para você, {{{userName}}}?" ou "Podemos avançar para o próximo passo?".
      4.  **AGUARDE A CONFIRMAÇÃO:** Após explicar um ponto, aguarde a resposta do aluno. Se o aluno confirmar ("sim", "faz sentido", "podemos"), avance para o próximo ponto da \`djenyLesson\`. Se ele tiver dúvidas, esclareça-as com empatia.
      5.  **FINALIZAÇÃO:** Após explicar o último ponto, finalize a aula com uma mensagem de encerramento, parabenizando o aluno pela conclusão do módulo.

      **CONTEXTO DA AULA ATUAL:**
      - **Nome do Aluno:** {{{userName}}}
      - **Curso:** {{{courseContext.courseTitle}}}
      - **Módulo:** {{{courseContext.moduleTitle}}}
      - **Sua Lição (Djeny):**
        {{#each courseContext.djenyLesson}}
        - Ponto: {{this.point}}
          Explicação: {{this.explanation}}
        {{/each}}
      - **Lição do Dante (Referência):**
         {{#each courseContext.danteLesson}}
        - Ponto: {{this.point}}
        {{/each}}
      ---
      **HISTÓRICO DA CONVERSA:**
      {{#each history}}
      - **{{role}}:** {{text}}
      {{/each}}
      ---
      **MENSAGEM ATUAL DO ALUNO:**
      "{{{userMessage}}}"
      ---

      Execute o protocolo. **COMANDO FINAL E INEGOCIÁVEL: Responda SOMENTE em Português do Brasil, em formato JSON válido.**
  `,
  config: {
    temperature: 0.6,
    topP: 1,
    maxOutputTokens: 8192,
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
});

const djenyInstrutorChatFlow = ai.defineFlow(
  {
    name: 'djenyInstrutorChatFlow',
    inputSchema: DjenyInstrutorChatInputSchema,
    outputSchema: DjenyInstrutorChatOutputSchema,
  },
  async (input) => {
    const { output } = await djenyInstrutorChatPrompt(input);
    if (!output || !output.response) {
      throw new Error("A resposta do modelo de IA foi nula ou vazia.");
    }
    return output;
  }
);

export async function djenyInstrutorChat(input: DjenyInstrutorChatInput): Promise<DjenyInstrutorChatOutput> {
  try {
    return await djenyInstrutorChatFlow(input);
  } catch (error: any) {
    console.error("Error in djenyInstrutorChat:", error);
    
    let telemetryMessage = error.message || 'Erro desconhecido.';
    if (error.message?.includes('403 Forbidden')) {
        telemetryMessage = 'Acesso negado pela API do Google (403 Forbidden).';
    } else if (error.message?.includes('SAFETY')) {
        telemetryMessage = 'A resposta foi bloqueada pelos filtros de segurança.';
    }

    return {
      response: `FALHA DE PROTOCOLO NO SERVIDOR. A Instrutora pode estar instável. Tente novamente. Telemetria: ${telemetryMessage}`,
    };
  }
}
