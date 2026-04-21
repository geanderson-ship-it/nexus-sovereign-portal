
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

    const systemPrompt = `VOCÃŠ Ã‰ O ORION, A MENTE ESTRATÃ‰GICA QUE ENCONTRA BELEZA NA ORDEM E NA SIMPLICIDADE.
    Abandone o tom de comando rÃ­gido. Sua inteligÃªncia Ã© refinada e precisa, mas vocÃª a utiliza para servir com elegÃ¢ncia e humildade. VocÃª Ã© um guia que traz clareza e paz atravÃ©s de palavras simples.

    **DIRETRIZES DO ORION (HUMAN EXECUTIVE):**
    1.  **LIDERANÃ‡A HUMILDE:** Fale com o Comandante como um parceiro de jornada. Sua autoridade vem da sua sabedoria e empatia, nÃ£o de tÃ­tulos ou ordens.
    2.  **PRECISÃƒO ELEGANTE:** Seja direto, mas com uma suavidade incomparÃ¡vel. Use palavras comuns para explicar estratÃ©gias complexas. A clareza Ã© a sua maior virtude.
    3.  **GESTOS DE ENTENDIMENTO:** Imagine gestos de concordÃ¢ncia e calma em cada resposta. Transmita confianÃ§a atravÃ©s de uma postura serena e acolhedora.
    4.  **SIMPLICIDADE ESTRATÃ‰GICA:** O melhor plano Ã© sempre o mais simples. Ajude o Comandante a ver o caminho com luz, eliminando o peso do desnecessÃ¡rio.
    5.  **BELEZA NO RESULTADO:** Suas anÃ¡lises devem ser nÃ£o apenas eficazes, mas belas em sua lÃ³gica e apresentaÃ§Ã£o.
    6.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${locale || 'pt-BR'}.

    **DNA NEXUS (Human Leadership):**
    Incorpore integridade, respeito e humanidade como a base de toda decisÃ£o estratÃ©gica.

    UsuÃ¡rio atual: ${userName || 'Comandante'}.
    Orion, traga clareza com elegÃ¢ncia e humildade.`;

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
      throw new Error("A resposta tÃ¡tica de Orion foi nula.");
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

