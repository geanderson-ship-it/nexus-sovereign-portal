import { z } from 'genkit';

export const MagadotChatInputSchema = z.object({
  userMessage: z.string().describe('The user\'s message or question to Maga-DÃ³t.'),
  userName: z.string().optional().describe('The name of the user.'),
  locale: z.string().optional().describe('The locale to respond in (e.g., pt-BR, en-US).'),
  image: z.string().optional().describe('An optional base64 image (data URI) for visual analysis.'),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string()
  })).optional().describe("The history of the conversation to maintain context."),
});
export type MagadotChatInput = z.infer<typeof MagadotChatInputSchema>;

export const MagadotChatOutputSchema = z.object({
  response: z.string().describe('Maga-Dót\'s wise and futuristic response.'),
  voiceProfile: z.string().optional().describe('The vocal profile selected by the AI (e.g., autonoe, aoede, erinome).'),
});
export type MagadotChatOutput = z.infer<typeof MagadotChatOutputSchema>;

