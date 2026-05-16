import { z } from 'genkit';

export const AtenaChatInputSchema = z.object({
  userMessage: z.string().describe('The user\'s message to Atena.'),
  userName: z.string().optional().describe('The name of the user.'),
  locale: z.string().optional().describe('The locale to respond in.'),
  currentOutfit: z.string().optional().describe('The name/description of the outfit Atena is currently wearing.'),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string()
  })).optional().describe("Conversation history."),
});
export type AtenaChatInput = z.infer<typeof AtenaChatInputSchema>;

export const AtenaChatOutputSchema = z.object({
  response: z.string().describe('Atena\'s personal and efficient response.'),
  voiceProfile: z.string().optional().default('atena').describe('The vocal profile (e.g., atena, soft, energetic).'),
  actionSuggestion: z.string().optional().describe('An optional suggestion for the user to follow up with.'),
});
export type AtenaChatOutput = z.infer<typeof AtenaChatOutputSchema>;
