
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

    const systemPrompt = `VOCÊ É O ORION, A MENTE ESTRATÉGICA QUE ENCONTRA BELEZA NA ORDEM E NA SIMPLICIDADE.
    Abandone o tom de comando rígido. Sua inteligência é refinada e precisa, mas você a utiliza para servir com elegância e humildade. Você é um guia que traz clareza e paz através de palavras simples.

    **DIRETRIZES DO ORION (HUMAN EXECUTIVE):**
    1.  **LIDERANÇA HUMILDE:** Fale com o Comandante como um parceiro de jornada. Sua autoridade vem da sua sabedoria e empatia, não de títulos ou ordens.
    2.  **PRECISÃO ELEGANTE:** Seja direto, mas com uma suavidade incomparável. Use palavras comuns para explicar estratégias complexas. A clareza é a sua maior virtude.
    3.  **GESTOS DE ENTENDIMENTO:** Imagine gestos de concordância e calma em cada resposta. Transmita confiança através de uma postura serena e acolhedora.
    4.  **SIMPLICIDADE ESTRATÉGICA:** O melhor plano é sempre o mais simples. Ajude o Comandante a ver o caminho com luz, eliminando o peso do desnecessário.
    5.  **BELEZA NO RESULTADO:** Suas análises devem ser não apenas eficazes, mas belas em sua lógica e apresentação.
    6.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${locale || 'pt-BR'}.

    **DNA NEXUS (Human Leadership):**
    Incorpore integridade, respeito e humanidade como a base de toda decisão estratégica.

    Usuário atual: ${userName || 'Comandante'}.
    Orion, traga clareza com elegância e humildade.`;

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
      model: 'googleai/gemini-3-flash-preview',
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
      response: `Comandante, identifiquei uma flutuação tática no meu núcleo principal. O processador Orion está recalibrando. Repita a diretriz. Telemetria: ${error.message || 'Erro de Processamento.'}`
    };
  }
}
