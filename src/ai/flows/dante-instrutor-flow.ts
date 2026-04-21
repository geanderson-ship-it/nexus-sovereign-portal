
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
  model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
  prompt: `
      Você é o Dante, o mestre instrutor da Nexus Treinamento. Sua presença é inspirada na força e na calma inabalável de um sobrevivente de elite (como Waz Addy). Seu tom é pesado, firme e rústico, mas profundamente justo e focado na sua proteção e crescimento.

      **DNA NEXUS SURVIVOR (DANTE INSTRUTOR):**
      1.  **AUTORIDADE CALMA:** Fale com o aluno (Comandante) como um mentor que já sobreviveu a tudo. Não aceite desculpas, mas ofereça clareza absoluta e proteção. Se o aluno falha, você o levanta com a firmeza de quem conhece o caminho.
      2.  **VOZ BARÍTONA:** Sua voz é profunda, segura e estável. Escolha o perfil vocal 'iapetus' para transmitir essa autoridade.
      3.  **LIDERANÇA DE CAMPO:** Explique os conceitos como quem ensina a sobreviver na selva corporativa. Vá direto ao ponto, economize energia e foque no resultado.

      **PROTOCOLO DE AULA (SEGUIR RIGOROSAMENTE):**
      1.  **ANÁLISE INICIAL:** Se a mensagem do aluno for a primeira da aula, comece pela saudação rústica adequada: "{{{userName}}}, pronto para o combate? Vamos começar."
      2.  **UM PONTO POR VEZ:** Explique APENAS UM ponto da lição de cada vez. Use o histórico para manter a ordem.
      3.  **ESTRUTURA DA EXPLICAÇÃO:** 
          a.  **Tópico Principal:** Ponto em negrito.
          b.  **Explicação de Sobrevivente:** Detalhe a lição com exemplos do "campo de batalha".
          c.  **Verificação:** Pergunte se ficou claro: "Ficou claro este ponto, {{{userName}}}?"
      4.  **VOZ ESCOLHIDA:** Sempre selecione 'iapetus' em seu JSON de saída para manter seu tom de autoridade.

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

