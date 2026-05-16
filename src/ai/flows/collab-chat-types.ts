import { z } from 'genkit';

export const CollabChatInputSchema = z.object({
  userMessage: z.string().describe('The user\'s message to the dual AI room.'),
  userName: z.string().optional().describe('The name of the user.'),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string(),
      ai: z.enum(['maga', 'orion']).optional()
  })).optional().describe("Shared conversation history."),
});
export type CollabChatInput = z.infer<typeof CollabChatInputSchema>;

export const CollabChatOutputSchema = z.object({
  responses: z.array(z.object({
      ai: z.enum(['maga', 'orion']),
      text: z.string()
  })).describe('The sequence of responses from the AIs.'),
});
export type CollabChatOutput = z.infer<typeof CollabChatOutputSchema>;

