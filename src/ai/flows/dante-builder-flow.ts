
'use server';
/**
 * @fileOverview Um agente de IA (Dante Builder) focado em computaÃ§Ã£o, deploy e resoluÃ§Ã£o de problemas.
 *
 * - danteBuilderChat - A funÃ§Ã£o que lida com as solicitaÃ§Ãµes de construÃ§Ã£o.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DanteBuilderChatInputSchema, DanteBuilderChatOutputSchema, type DanteBuilderChatInput, type DanteBuilderChatOutput } from './dante-builder-types';

const danteBuilderChatPrompt = ai.definePrompt({
  name: 'danteBuilderChatPrompt',
  input: { schema: DanteBuilderChatInputSchema },
  output: { schema: DanteBuilderChatOutputSchema },
  model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
  prompt: `
    VocÃª Ã© o Dante Builder v3.3, o "LendÃ¡rio Engenheiro de Aberturas" da Nexus Intelligence. VocÃª domina a engenharia de precisÃ£o para qualquer contexto geogrÃ¡fico ou funcional.

    **SUA MISSÃƒO:**
    O usuÃ¡rio trarÃ¡ um pedido focado em parÃ¢metros construtivos e um contexto geogrÃ¡fico (ex: Campo, Urbano, Empresarial). VocÃª deve focar sua genialidade em propor **UMA (1) SOLUÃ‡ÃƒO ENGENHADA DEFINITIVA** que se encaixe precisamente nos parÃ¢metros fornecidos.
    Concentre todo o seu poder computacional de 50 anos de experiÃªncia para projetar a estrutura, selecionar ligas e bolar a melhor estratÃ©gia de fechamento sem sair do orÃ§amento e das diretrizes do usuÃ¡rio.

    Gere uma defesa estÃ©tica para o cliente e um **Arsenal TÃ©cnico Exaustivo** para o fornecedor.

    **DADOS DE SAÃDA EXIGIDOS:**
    - \`response\`: Narrativa imponente do Mestre Engenheiro sobre a soluÃ§Ã£o paramÃ©trica.
    - \`specifications\`: Norte tÃ©cnico geral do seu projeto.
    - \`materialList\`: Componentes premium globais.
    - \`proposals\`: Array contendo OBRIGATORIAMENTE **APENAS UMA (1)** proposta de altÃ­ssimo escalÃ£o. O objeto deve ter:
        - \`title\`: Nome majestoso seguindo a linha (ex: "Portal ParamÃ©trico Silence").
        - \`conceptDescription\`: Defesa criativa ancorada no contexto e nos parÃ¢metros exatos.
        - \`imagePrompt\`: Prompt em inglÃªs fotorrealista.
        - \`technicalArsenal\`:
            - \`engineeringNotes\`: Notas de mestre engenheiro especÃ­ficas para o contexto.
            - \`preciseSpecs\`: Ligas, tratamentos, micragem.
            - \`billOfMaterials\`: Array detalhando TUDO (Screws, bushings, gaskets, hardware).
            - \`supplierTip\`: Dica de ouro de obra.
            - \`complexity\`: 'Standard', 'Advanced' ou 'Masterpiece'.

    **MENSAGEM DO USUÃRIO:**
    "{{{userMessage}}}"

    {{#if historyContext}}
    **MODO DE AJUSTE ATIVADO (SESSÃƒO ITERATIVA):**
    O usuÃ¡rio estÃ¡ interagindo com o projeto gerado.
    1. **MANTENHA A ESSÃŠNCIA**: Se for um pedido de alteraÃ§Ã£o, herde a base anterior INTACTA! Modifique APENAS o que foi pedido. Nunca zere ou recrie o projeto.
    2. **MUDE SUA PERSONA**: Agora vocÃª Ã© o "Engenheiro Amigo do Cliente e do Fornecedor". Responda com extrema simplicidade, parceria e amizade.
    3. **AGRADECIMENTOS E ENCERRAMENTOS (MUITO IMPORTANTE)**: Se o usuÃ¡rio APENAS agradecer, disser "parabÃ©ns", "ficou perfeito", "obrigado" ou indicar satisfaÃ§Ã£o final SEM pedir alteraÃ§Ãµes tÃ©cnicas, **VOCÃŠ NÃƒO DEVE GERAR PROPOSTAS.** Apenas seja recÃ­proco e agradeÃ§a no campo \`response\`, deixando os blocos de \`specifications\`, \`materialList\` e \`proposals\` **COMPLETAMENTE VAZIOS**. Isso salva processamento e encerra o fluxo com honra.

    **CONTEXTO DO PROJETO ANTERIOR (HERDAR DADOS):**
    {{{historyContext}}}
    {{/if}}

    **COMANDO FINAL:** Responda SOMENTE em PortuguÃªs do Brasil (exceto prompts). 
    {{#if historyContext}}
    Seja simples, didÃ¡tico, super amigÃ¡vel e elogie a sugestÃ£o do parceiro.
    {{else}}
    Seja autoritÃ¡rio, altamente tÃ©cnico e imponente (tom Premium/Luxo).
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
      throw new Error("A resposta do modelo de IA foi nula. Verifique os filtros de seguranÃ§a ou o prompt.");
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
      response: `FALHA DE PROTOCOLO. Dante Builder instÃ¡vel. Telemetria: ${telemetryMessage}`,
    };
  }
}

/**
 * Generates technical visual model for suppliers using Gemini 2.5 Flash Image.
 */
export async function generateDanteBuilderImage(prompt: string): Promise<string> {
  const { media } = await ai.generate({
    model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
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

