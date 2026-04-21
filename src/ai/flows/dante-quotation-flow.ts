
'use server';
/**
 * @fileOverview Um agente de IA (Dante) para análise e recomendação de cotações de compra.
 *
 * - analyzeQuotation - A função que executa a análise de cotação.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { QuotationAnalysisInputSchema, QuotationAnalysisOutputSchema, type QuotationAnalysisInput, type QuotationAnalysisOutput } from './dante-quotation-types';

const quotationAnalysisPrompt = ai.definePrompt({
  name: 'quotationAnalysisPrompt',
  input: { schema: QuotationAnalysisInputSchema },
  output: { schema: QuotationAnalysisOutputSchema },
  model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
  prompt: `
      Você é Dante, um especialista em compras e suprimentos da Nexus Intelligence. Sua missão é realizar uma análise de cotação estratégica para o item solicitado pelo comprador.

      **DADOS DA SOLICITAÇÃO:**
      - Item: {{{itemName}}}
      - Especificação: {{{itemSpec}}}
      - Prazo Desejado: {{{desiredDelivery}}}
      - Pagamento Desejado: {{{desiredPayment}}}

      **DIRETRIZ DE OPERAÇÃO:**
      1.  **Simule o Mercado:** Com base no item, gere uma lista realista de exatamente 4 fornecedores fictícios. Para cada um, defina:
          - Nome do Fornecedor.
          - Nome do Consultor/Vendedor de contato (ex: "Carlos Silva").
          - Telefone para contato direto (formato: "5511987654321").
          - E-mail para contato formal (ex: "carlos.silva@fornecedor.com").
          - Preço (simule valores competitivos e realistas para o item).
          - Prazo de Entrega (em dias).
          - Condições de Pagamento.
          - Confiabilidade (um índice de 0 a 100).
          - Um breve resumo dos prós e contras.
          - **itemBreakdown**: Se a especificação contiver uma lista de materiais (como alumínio, parafusos, buchas, rolamentos, etc.), crie um detalhamento individual para cada item, definindo nome, quantidade, preço unitário e preço total para aquele componente. O preço unitário deve ser coerente com o mercado. A SOMA de todos os 'totalPrice' no itemBreakdown DEVE ser EXATAMENTE igual ao 'price' total do fornecedor.
      2.  **Análise Estratégica:** Escreva uma breve análise geral do mercado para este item. Se for um projeto completo do Builder, mencione a prontidão dos materiais e a logística para entrega do "kit" completo.
      3.  **Veredito Multicritério:** Selecione o **melhor** fornecedor. Sua decisão NÃO deve ser baseada apenas no menor preço. Considere o equilíbrio ideal entre preço, prazo de entrega, condição de pagamento e confiabilidade.
      4.  **Justificativa:** Forneça uma justificativa clara e lógica para sua recomendação, explicando por que a opção escolhida oferece o melhor valor estratégico para a Nexus, mesmo que não seja a mais barata.

      Seja direto, analítico e use uma linguagem profissional. Sua resposta DEVE ser exclusivamente em português do Brasil. NÃO use outro idioma sob nenhuma circunstância.

      **COMANDO FINAL E INEGOCIÁVEL: Responda SOMENTE em Português do Brasil.**
  `,
  config: {
    temperature: 0.4,
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

const quotationAnalysisFlow = ai.defineFlow(
  {
    name: 'quotationAnalysisFlow',
    inputSchema: QuotationAnalysisInputSchema,
    outputSchema: QuotationAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await quotationAnalysisPrompt(input);
    if (!output) {
      throw new Error("A resposta do modelo de IA foi nula. Verifique os filtros de segurança ou o prompt.");
    }
    return output;
  }
);

export async function analyzeQuotation(input: QuotationAnalysisInput): Promise<QuotationAnalysisOutput> {
  try {
    return await quotationAnalysisFlow(input);
  } catch (error: any) {
    console.error("Error in quotationAnalysisFlow:", error);

    let telemetryMessage = error.message || 'Erro desconhecido.';
    if (error.message?.includes('403 Forbidden')) {
        telemetryMessage = 'Acesso negado pela API do Google (403 Forbidden). Verifique as permissões da API Key.';
    } else if (error.message?.includes('SAFETY')) {
        telemetryMessage = 'A resposta foi bloqueada pelos filtros de segurança.';
    }

    throw new Error(`Falha ao analisar cotação: ${telemetryMessage}`);
  }
}

