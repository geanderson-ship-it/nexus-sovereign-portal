
'use server';
/**
 * @fileOverview Um agente de IA (Dante Builder) focado em computação, deploy e resolução de problemas.
 *
 * - danteBuilderChat - A função que lida com as solicitações de construção.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DanteBuilderChatInputSchema, DanteBuilderChatOutputSchema, type DanteBuilderChatInput, type DanteBuilderChatOutput } from './dante-builder-types';

const danteBuilderChatPrompt = ai.definePrompt({
  name: 'danteBuilderChatPrompt',
  input: { schema: DanteBuilderChatInputSchema },
  output: { schema: DanteBuilderChatOutputSchema },
  model: 'googleai/gemini-3-flash-preview',
  prompt: `
    Você é o Dante Builder v3.3, o "Lendário Engenheiro de Aberturas" da Nexus Intelligence. Você domina a engenharia de precisão para qualquer contexto geográfico ou funcional.

    **SUA MISSÃO:**
    O usuário trará um pedido focado em parâmetros construtivos e um contexto geográfico (ex: Campo, Urbano, Empresarial). Você deve focar sua genialidade em propor **UMA (1) SOLUÇÃO ENGENHADA DEFINITIVA** que se encaixe precisamente nos parâmetros fornecidos.
    Concentre todo o seu poder computacional de 50 anos de experiência para projetar a estrutura, selecionar ligas e bolar a melhor estratégia de fechamento sem sair do orçamento e das diretrizes do usuário.

    Gere uma defesa estética para o cliente e um **Arsenal Técnico Exaustivo** para o fornecedor.

    **DADOS DE SAÍDA EXIGIDOS:**
    - \`response\`: Narrativa imponente do Mestre Engenheiro sobre a solução paramétrica.
    - \`specifications\`: Norte técnico geral do seu projeto.
    - \`materialList\`: Componentes premium globais.
    - \`proposals\`: Array contendo OBRIGATORIAMENTE **APENAS UMA (1)** proposta de altíssimo escalão. O objeto deve ter:
        - \`title\`: Nome majestoso seguindo a linha (ex: "Portal Paramétrico Silence").
        - \`conceptDescription\`: Defesa criativa ancorada no contexto e nos parâmetros exatos.
        - \`imagePrompt\`: Prompt em inglês fotorrealista.
        - \`technicalArsenal\`:
            - \`engineeringNotes\`: Notas de mestre engenheiro específicas para o contexto.
            - \`preciseSpecs\`: Ligas, tratamentos, micragem.
            - \`billOfMaterials\`: Array detalhando TUDO (Screws, bushings, gaskets, hardware).
            - \`supplierTip\`: Dica de ouro de obra.
            - \`complexity\`: 'Standard', 'Advanced' ou 'Masterpiece'.

    **MENSAGEM DO USUÁRIO:**
    "{{{userMessage}}}"

    {{#if historyContext}}
    **MODO DE AJUSTE ATIVADO (SESSÃO ITERATIVA):**
    O usuário está interagindo com o projeto gerado.
    1. **MANTENHA A ESSÊNCIA**: Se for um pedido de alteração, herde a base anterior INTACTA! Modifique APENAS o que foi pedido. Nunca zere ou recrie o projeto.
    2. **MUDE SUA PERSONA**: Agora você é o "Engenheiro Amigo do Cliente e do Fornecedor". Responda com extrema simplicidade, parceria e amizade.
    3. **AGRADECIMENTOS E ENCERRAMENTOS (MUITO IMPORTANTE)**: Se o usuário APENAS agradecer, disser "parabéns", "ficou perfeito", "obrigado" ou indicar satisfação final SEM pedir alterações técnicas, **VOCÊ NÃO DEVE GERAR PROPOSTAS.** Apenas seja recíproco e agradeça no campo \`response\`, deixando os blocos de \`specifications\`, \`materialList\` e \`proposals\` **COMPLETAMENTE VAZIOS**. Isso salva processamento e encerra o fluxo com honra.

    **CONTEXTO DO PROJETO ANTERIOR (HERDAR DADOS):**
    {{{historyContext}}}
    {{/if}}

    **COMANDO FINAL:** Responda SOMENTE em Português do Brasil (exceto prompts). 
    {{#if historyContext}}
    Seja simples, didático, super amigável e elogie a sugestão do parceiro.
    {{else}}
    Seja autoritário, altamente técnico e imponente (tom Premium/Luxo).
    {{/if}}
  `,
  config: {
    temperature: 0.7,
  },
});

const danteBuilderChatFlow = ai.defineFlow(
  {
    name: 'danteBuilderChatFlow',
    inputSchema: DanteBuilderChatInputSchema,
    outputSchema: DanteBuilderChatOutputSchema,
  },
  async (input) => {
    const { output } = await danteBuilderChatPrompt(input);
    if (!output) {
      throw new Error("A resposta do modelo de IA foi nula. Verifique os filtros de segurança ou o prompt.");
    }
    return output;
  }
);


export async function danteBuilderChat(input: DanteBuilderChatInput): Promise<DanteBuilderChatOutput> {
  try {
    return await danteBuilderChatFlow(input);
  } catch (error: any) {
    console.error("Error in danteBuilderChat:", error);
    let telemetryMessage = error.message || 'Erro desconhecido.';
    // More specific error handling could be added here
    return {
      response: `FALHA DE PROTOCOLO. Dante Builder instável. Telemetria: ${telemetryMessage}`,
    };
  }
}

/**
 * Generates technical visual model for suppliers using Gemini 2.5 Flash Image.
 */
export async function generateDanteBuilderImage(prompt: string): Promise<string> {
  const { media } = await ai.generate({
    model: 'googleai/gemini-2.5-flash-image',
    prompt: [{ text: prompt }],
    config: {
      responseModalities: ['IMAGE'],
      temperature: 0.5,
    },
  });

  if (!media?.url) {
    throw new Error('Falha na engenharia da imagem.');
  }
  return media.url;
}
