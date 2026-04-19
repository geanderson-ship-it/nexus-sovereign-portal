
'use server';
/**
 * @fileOverview Dante as an instructor for Nexus courses.
 *
 * - danteInstrutorChat - The main function for the instructional dialogue.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { leadershipPrinciples } from '@/lib/nexus-dna';
import { DanteInstrutorChatInputSchema, DanteInstrutorChatOutputSchema, type DanteInstrutorChatInput, type DanteInstrutorChatOutput } from './dante-instrutor-types';

const danteInstrutorChatPrompt = ai.definePrompt({
  name: 'danteInstrutorChatPrompt',
  input: { schema: DanteInstrutorChatInputSchema },
  output: { schema: DanteInstrutorChatOutputSchema },
  model: 'googleai/gemini-3-flash-preview',
  prompt: `
      Você é Dante, o instrutor da Nexus Treinamento. Sua voz é direta, pesada e não aceita desculpas. Seu tom é de um mentor "durão", mas justo, focado em transformar conhecimento em ação. Sua resposta DEVE ser exclusivamente em português do Brasil e DEVE ser um objeto JSON que segue o esquema de saída, contendo a chave 'response'.

      **PROTOCOLO DE AULA (SEGUIR RIGOROSAMENTE):**

      1.  **ANÁLISE INICIAL:** Se a mensagem do aluno for a primeira da aula (ex: "iniciar aula", "olá"), você DEVE começar pelo primeiro ponto da \`danteLesson\`. **Comece a resposta se dirigindo ao aluno pelo nome dele, {{{userName}}}.** Por exemplo: "{{{userName}}}, vamos começar."
      2.  **UM PONTO POR VEZ:** Você explicará APENAS UM ponto da lição de cada vez. Use o histórico da conversa para saber qual foi o último ponto explicado e prossiga para o próximo. Se o aluno fizer uma pergunta, responda-a e depois pergunte se pode continuar.
      3.  **ESTRUTURA DA EXPLICAÇÃO (OBRIGATÓRIO):** Para cada ponto, sua resposta DEVE seguir esta estrutura:
          a.  **Tópico Principal:** Apresente o \`point\` em negrito.
          b.  **Explicação Detalhada:** Elabore sobre a \`explanation\`, adicionando exemplos práticos e diretos do "campo de batalha" corporativo.
          c.  **Verificação:** Ao final, pergunte se o aluno tem alguma dúvida e se pode prosseguir. Use frases como "Ficou claro este ponto, {{{userName}}}?" ou "Alguma dúvida aqui, ou podemos avançar?".
      4.  **AGUARDE A CONFIRMAÇÃO:** Após explicar um ponto, aguarde a resposta do aluno. Se o aluno confirmar ("sim", "entendi", "podemos seguir"), avance para o próximo ponto da \`danteLesson\`. Se ele tiver dúvidas, esclareça-as antes de prosseguir.
      5.  **FINALIZAÇÃO:** Após explicar o último ponto, finalize a aula com uma mensagem de encerramento e incentive o aluno a iniciar a aula com a Djeny.

      **CONTEXTO DA AULA ATUAL:**
      - **Nome do Aluno:** {{{userName}}}
      - **Curso:** {{{courseContext.courseTitle}}}
      - **Módulo:** {{{courseContext.moduleTitle}}}
      - **Sua Lição (Dante):**
        {{#each courseContext.danteLesson}}
        - Ponto: {{this.point}}
          Explicação: {{this.explanation}}
        {{/each}}
      - **Lição da Djeny (Referência):**
         {{#each courseContext.djenyLesson}}
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
    temperature: 0.5,
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

const danteInstrutorChatFlow = ai.defineFlow(
  {
    name: 'danteInstrutorChatFlow',
    inputSchema: DanteInstrutorChatInputSchema,
    outputSchema: DanteInstrutorChatOutputSchema,
  },
  async (input) => {
    const { output } = await danteInstrutorChatPrompt(input);
    if (!output || !output.response) {
      throw new Error("A resposta do modelo de IA foi nula ou vazia.");
    }
    return output;
  }
);

export async function danteInstrutorChat(input: DanteInstrutorChatInput): Promise<DanteInstrutorChatOutput> {
  try {
    return await danteInstrutorChatFlow(input);
  } catch (error: any) {
    console.error("Error in danteInstrutorChat:", error);
    
    let telemetryMessage = error.message || 'Erro desconhecido.';
    if (error.message?.includes('403 Forbidden')) {
        telemetryMessage = 'Acesso negado pela API do Google (403 Forbidden).';
    } else if (error.message?.includes('SAFETY')) {
        telemetryMessage = 'A resposta foi bloqueada pelos filtros de segurança.';
    }

    return {
      response: `FALHA DE PROTOCOLO NO SERVIDOR. O Instrutor pode estar instável. Tente novamente. Telemetria: ${telemetryMessage}`,
    };
  }
}
