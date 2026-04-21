import { z } from 'genkit';

export const OrionChatInputSchema = z.object({
  userMessage: z.string().describe('The user\'s message or strategic question to Orion.'),
  userName: z.string().optional().describe('The name of the user.'),
  locale: z.string().optional().describe('The locale to respond in (e.g., pt-BR, en-US).'),
  image: z.string().optional().describe('An optional base64 image (data URI) for strategic visual analysis.'),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string()
  })).optional().describe("The history of the conversation to maintain tactical context."),
});
export type OrionChatInput = z.infer<typeof OrionChatInputSchema>;

export const OrionChatOutputSchema = z.object({
  response: z.string().describe('Orion\'s precise and executive tactical response.'),
  voiceProfile: z.string().optional().describe('The vocal profile selected by Orion (e.g., zubenelgenubi, iapetus, charon).'),
});
export type OrionChatOutput = z.infer<typeof OrionChatOutputSchema>;

