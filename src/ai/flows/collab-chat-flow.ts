
'use server';
/**
 * @fileOverview Nexus Collaborative Orchestrator.
 * Handles the "Active Brainstorm" mode where Maga and Orion talk to each other.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { CollabChatInputSchema, CollabChatOutputSchema, type CollabChatInput, type CollabChatOutput } from './collab-chat-types';
import { magadotChat } from './magadot-chat-flow';
import { orionChat } from './orion-chat-flow';

const collabChatFlow = ai.defineFlow(
  {
    name: 'collabChatFlow',
    inputSchema: CollabChatInputSchema,
    outputSchema: CollabChatOutputSchema,
  },
  async (input) => {
    const { userMessage, userName, history } = input;

    // 1. First Response: Magadot (Creative/Visual Perspective)
    const magaResult = await magadotChat({
      userMessage,
      userName,
      history: history?.map(h => ({ role: h.role, text: h.text })) || []
    });

    const magaText = magaResult.response;

    // 2. Second Response: Orion (Strategic/Tactical Response to Magadot's idea)
    const orionResult = await orionChat({
      userMessage: `Comandante enviou: "${userMessage}". \n\n Magadot propÃ´s: "${magaText}". \n\n Orion, forneÃ§a sua avaliaÃ§Ã£o tÃ¡tica e estratÃ©gica sobre essa proposta.`,
      userName,
      history: history?.map(h => ({ role: h.role, text: h.text })) || []
    });

    const orionText = orionResult.response;

    return {
      responses: [
        { ai: 'maga' as const, text: magaText },
        { ai: 'orion' as const, text: orionText }
      ]
    };
  }
);

export async function collabChat(input: CollabChatInput): Promise<CollabChatOutput> {
  try {
    return await collabChatFlow(input);
  } catch (error: any) {
    console.error("Error in collabChatFlow:", error);
    return {
      responses: [
        { ai: 'maga', text: "Comandante, tive um pequeno desvio de frequÃªncia na nossa conexÃ£o dual..." },
        { ai: 'orion', text: "Entendido, Comandante. O sistema de colaboraÃ§Ã£o estÃ¡ sendo reiniciado." }
      ]
    };
  }
}

