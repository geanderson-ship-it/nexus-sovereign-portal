/**
 * @fileoverview This file contains the keyword libraries for detecting user intent
 * and response emotion, enabling low-latency routing and dynamic interface adjustments.
 * This is the core of the VIX Protocol for fine-tuned interaction.
 */

// VIX Protocol: Input Intent Library
// Used for pre-flight checks to accelerate API response and routing.
export const intentKeywords: Record<string, string[]> = {
    'dante-compras': ['cotação', 'preço', 'fornecedor', 'comprar', 'negociar', 'orçamento'],
    'dante-safra': ['safra', 'lavoura', 'gado', 'plantio', 'colheita', 'soja', 'milho', 'trigo', 'clima', 'previsão', 'agronegócio'],
    'career': ['carreira', 'emprego', 'currículo', 'entrevista', 'promoção', 'salário', 'desenvolvimento', 'recolocação'],
    'djeny-design': ['design', 'ambiente', 'retrofit', 'decorar', 'móvel', 'estilo', 'arquitetura'],
};

// VIX Protocol: Output Emotion Library
// Used to analyze AI responses and adjust voice tone and interface feedback.
export const emotionKeywords: {
    urgent: string[];
    success: string[];
    alert: string[];
} = {
    urgent: ['urgente', 'imediato', 'agora', 'crítico', 'prazo', 'imediatamente'],
    success: ['sucesso', 'perfeito', 'concluído', 'ótimo', 'missão cumprida', 'validado', 'realizado', 'pronto'],
    alert: ['alerta', 'cuidado', 'risco', 'perigo', 'atenção', 'problema', 'falha', 'erro', 'instável'],
};

import { inferNiche, mapProductToNiche, generatePersuasiveMessage, isHotLead } from './utils';
import { sendWhatsAppMessage } from './whatsapp';

/**
 * Process a user message with the sales persuasive flow.
 * Returns the response text to be sent back to the user.
 */
export async function handleSalesPersuasive(message: string, userPhone: string): Promise<string> {
  const niche = inferNiche(message);
  const product = mapProductToNiche(niche);
  const response = generatePersuasiveMessage(product);
  if (isHotLead(message)) {
    const directorPhone = '+55 51 99979-9582';
    const leadInfo = `Lead quente detectado!\nNicho: ${niche}\nProduto: ${product.name}\nMensagem: ${message}`;
    await sendWhatsAppMessage(directorPhone, leadInfo);
  }
  return response;
}
