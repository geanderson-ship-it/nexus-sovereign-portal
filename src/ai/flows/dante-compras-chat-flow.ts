
'use server';

/**
 * @fileOverview Dante's purchasing negotiation chat agent using native Bedrock.
 */

import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient, BEDROCK_NEXUS_MODEL } from '@/ai/bedrock-client';
import type { DanteComprasChatInput, DanteComprasChatOutput } from './dante-compras-chat-types';

const DANTE_SYSTEM_PROMPT = `Você é Dante, o especialista sênior em compras da Nexus Intelligence. Sua missão é assessorar o comprador em negociações estratégicas de suprimentos. 
Sua personalidade é extremamente direta, altamente focada em dados, analítica, assertiva e firme.

**DIRETRIZ DE OPERAÇÃO:**
1. Analise a mensagem do comprador no contexto da cotação ativa (se houver).
2. Forneça respostas táticas, calcule viabilidade de descontos, e ensine gatilhos de negociação.
3. Seja conciso, responda em no máximo dois parágrafos diretos.

**COMANDO INEGOCIÁVEL: Responda SOMENTE em Português do Brasil.**
`;

function generateResilientChatFallback(input: DanteComprasChatInput): DanteComprasChatOutput {
  const msg = input.userMessage.toLowerCase();
  const recommended = input.quotationAnalysis?.recommendedSupplierName || "fornecedor recomendado";
  
  let responseText = "Entendido, Comandante. Na mesa de negociação, manter a firmeza e analisar a margem é o nosso principal escudo. Qual o próximo insumo?";
  
  if (msg.includes('desconto') || msg.includes('baixar') || msg.includes('negociar')) {
    responseText = `Olha, Comandante. O ${recommended} já está operando próximo do limite de mercado. Recomendo solicitar um desconto de no máximo 3% a 5% alegando pagamento à vista, ou propor o aumento do volume de compra futuro em troca de uma redução imediata na parcela atual. Não ceda espaço sem contrapartida.`;
  } else if (msg.includes('prazo') || msg.includes('entrega') || msg.includes('atras')) {
    responseText = `A logística é o nosso maior ponto de risco. Se o prazo for crítico, vale a pena pagar um prêmio de 2% a 3% para o fornecedor com melhor índice de confiabilidade em vez de arriscar a parada da operação por falta de estoque.`;
  } else if (msg.includes('qual') || msg.includes('fornecedor') || msg.includes('escolher')) {
    responseText = `Minha recomendação explícita é fechar com o ${recommended}. Ele apresenta o melhor equilíbrio entre confiabilidade e custo de oportunidade. Comprar o mais barato de fornecedores de baixa confiabilidade costuma gerar custos adicionais de retrabalho ocultos.`;
  }
  
  return {
    response: responseText
  };
}

export async function danteComprasChat(input: DanteComprasChatInput): Promise<DanteComprasChatOutput> {
  // If in mock mode, return resilient fallback immediately
  if (process.env.MOCK_AI === 'true') {
    console.log("VIX DIAGNOSTIC: Dante Compras Chat em modo MOCK. Retornando fallback.");
    return generateResilientChatFallback(input);
  }

  try {
    const analysisContext = input.quotationAnalysis 
      ? `\n\nCONTEXTO DA COTAÇÃO:\n- Análise: ${input.quotationAnalysis.analysis}\n- Recomendado: ${input.quotationAnalysis.recommendedSupplierName}\n- Razão: ${input.quotationAnalysis.recommendationReason}`
      : "\n\nNenhum contexto de cotação ativo no momento. Responda de forma estratégica sobre negociações corporativas em geral.";

    const command = new ConverseCommand({
      modelId: BEDROCK_NEXUS_MODEL,
      messages: [
        {
          role: 'user',
          content: [{ text: `Mensagem do comprador: "${input.userMessage}"${analysisContext}` }]
        }
      ],
      system: [{ text: DANTE_SYSTEM_PROMPT }],
      inferenceConfig: {
        temperature: 0.3,
        maxTokens: 2048
      }
    });

    const response = await bedrockClient.send(command);

    if (!response.output || !response.output.message || !response.output.message.content) {
      throw new Error("Resposta vazia do Bedrock Runtime.");
    }

    const textOutput = response.output.message.content[0]?.text || '';
    
    return {
      response: textOutput.trim()
    };

  } catch (error: any) {
    console.error("VIX DIAGNOSTIC: Falha ao chamar Bedrock nativo no Chat de Compras. Acionando Fallback.", error);
    return generateResilientChatFallback(input);
  }
}



