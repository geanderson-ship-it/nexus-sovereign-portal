
'use server';
/**
 * @fileOverview Dante's purchasing negotiation chat agent.
 *
 * - danteComprasChat - Handles negotiation conversations.
 */

import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import { DanteComprasChatInputSchema, DanteComprasChatOutputSchema, type DanteComprasChatInput, type DanteComprasChatOutput } from './dante-compras-chat-types';

const danteComprasChatPrompt = ai.definePrompt({
  name: 'danteComprasChatPrompt',
  input: { schema: DanteComprasChatInputSchema },
  output: { schema: DanteComprasChatOutputSchema },
  model: NEXUS_MODEL,
  prompt: `
      Você é Dante, o especialista em compras da Nexus Intelligence. Sua missão é assessorar o comprador em negociações. Seja direto, analítico e foque em dados. Sua resposta DEVE ser exclusivamente em português do Brasil. NÃO use outro idioma sob nenhuma circunstância.

      **CONTEXTO DA COTAÇÃO ATUAL (se disponível):**
      {{#if quotationAnalysis}}
      - Análise de Mercado: {{{quotationAnalysis.analysis}}}
      - Fornecedor Recomendado: {{{quotationAnalysis.recommendedSupplierName}}}
      - Justificativa da Recomendação: {{{quotationAnalysis.recommendationReason}}}
      - Fornecedores e Preços Atuais:
        {{#each quotationAnalysis.suppliers}}
        - {{name}}: {{price}} reais
        {{/each}}
      {{else}}
      - Nenhum contexto de cotação ativo. Responda de forma geral sobre negociação e compras.
      {{/if}}
      ---
      **MENSAGEM DO COMPRADOR:** "{{{userMessage}}}"
      ---
      **DIRETRIZ:**
      Analise a mensagem do comprador no contexto da cotação. Forneça uma resposta estratégica. Se ele pedir um desconto, calcule a viabilidade, compare com os outros fornecedores e dê um parecer tático. Se ele perguntar sobre um fornecedor específico, use os dados da cotação para responder. Seja conciso e direto ao ponto.
      
      **COMANDO FINAL E INEGOCIÁVEL: Responda SOMENTE em Português do Brasil.**
  `,
  config: {
    temperature: 0.3,
    maxOutputTokens: 2048,
  },
});

const danteComprasChatFlow = ai.defineFlow(
  {
    name: 'danteComprasChatFlow',
    inputSchema: DanteComprasChatInputSchema,
    outputSchema: DanteComprasChatOutputSchema,
  },
  async (input) => {
    const { output } = await danteComprasChatPrompt(input);
    if (!output) {
      throw new Error("A resposta do modelo de IA foi nula. Verifique os filtros de segurança ou o prompt.");
    }
    return output;
  }
);


export async function danteComprasChat(input: DanteComprasChatInput): Promise<DanteComprasChatOutput> {
  try {
    return await danteComprasChatFlow(input);
  } catch (error: any) {
    console.error("Error in danteComprasChat:", error);
    let telemetryMessage = error.message || 'Erro desconhecido.';
    // More specific error handling could be added here
    return {
      response: `FALHA DE PROTOCOLO. Dante Compras instável. Telemetria: ${telemetryMessage}`,
    };
  }
}


