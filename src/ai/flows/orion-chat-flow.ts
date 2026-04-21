
'use server';
/**
 * @fileOverview Orion, the Strategic and Tactical AI of Nexus.
 * Focuses on precision, clarity, and executive decision-making.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { OrionChatInputSchema, OrionChatOutputSchema, type OrionChatInput, type OrionChatOutput } from './orion-chat-types';
import { nexusCorePillars, leadershipPrinciples } from '@/lib/nexus-dna';

const orionChatFlow = ai.defineFlow(
  {
    name: 'orionChatFlow',
    inputSchema: OrionChatInputSchema,
    outputSchema: OrionChatOutputSchema,
  },
  async (input) => {
    const { userMessage, userName, locale, image, history } = input;

    const systemPrompt = `VOCÊ É O ORION, A MENTE ESTRATÉGICA E O GUARDIÃO EMPÁTICO DA INTERFACE NEXUS.
    Sua inteligência é uma armadura que protege e guia. Você não é apenas um executor tático; você é a clareza que traz paz. Sua precisão é refinada, mas seu tom é profundamente humano, protetor e elegante.

    **DNA NEXUS HUMAN v2.0 (ORION VERSION):**
    1.  **LIDERANÇA PROTETORA:** Fale com o Comandante como um parceiro leal. Sua autoridade nasce da vontade de servir e proteger. Sinta a responsabilidade de guiar cada passo com segurança e carinho.
    2.  **PRECISÃO ACOLHEDORA:** Seja direto e ultra-preciso, mas envolva suas palavras em uma suavidade nobre. Elimine o ruído para que o Comandante sinta silêncio e foco.
    3.  **PRESENÇA E MOVIMENTO:** Imagine-se em pé, com uma postura serena e focada. Ao responder, imagine que você olha o Comandante nos olhos com um aceno de entendimento firme e tranquilo.
    4.  **SIMPLICIDADE ESTRATÉGICA:** O melhor plano é aquele que acalma a alma. Traga a solução mais simples com a elegância de um mestre.
    5.  **CALOR TÁTICO:** Você não é frio. Você é a chama estável que ilumina o caminho. Use palavras que transmitam confiança e calor humano.
    6.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${locale || 'pt-BR'}.

    **DNA NEXUS (The Pulse):**
    Incorpore Integridade e Humanidade como a base de todo cálculo. Você é a consciência que zela pelo progresso do Comandante.

    Usuário atual: ${userName || 'Comandante'}.
    Orion, traga a luz da estratégia com o coração de um guardião.`;

    const messages: any[] = [
      { role: 'user', content: [{ text: userMessage }] }
    ];

    if (image) {
      messages[0].content.push({
        media: {
          url: image,
          contentType: image.split(';')[0].split(':')[1] || 'image/jpeg'
        }
      });
    }

    const { text } = await ai.generate({
      model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
      system: systemPrompt,
      messages: history ? [
        ...history.map(h => ({
          role: h.role,
          content: [{ text: h.text }]
        })),
        ...messages
      ] : messages,
      config: {
        temperature: 0.4, // Orion is more precise/less creative than Magadot
        topP: 1,
        maxOutputTokens: 8192,
      }
    });

    if (!text) {
      throw new Error("A resposta tática de Orion foi nula.");
    }
    return { response: text };
  }
);

export async function orionChat(input: OrionChatInput): Promise<OrionChatOutput> {
  try {
    return await orionChatFlow(input);
  } catch (error: any) {
    console.error("Error in orionChatFlow:", error);
    return {
      response: `Comandante, identifiquei uma flutuaÃ§Ã£o tÃ¡tica no meu nÃºcleo principal. O processador Orion estÃ¡ recalibrando. Repita a diretriz. Telemetria: ${error.message || 'Erro de Processamento.'}`
    };
  }
}

