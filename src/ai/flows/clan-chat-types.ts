import { z } from 'genkit';

export const ClanChatInputSchema = z.object({
  userMessage: z.string().describe("The user's message or question."),
  purchasedSlugs: z.array(z.string()).describe("A list of course slugs the user has purchased."),
});
export type ClanChatInput = z.infer<typeof ClanChatInputSchema>;

export const ClanChatOutputSchema = z.object({
  response: z.string().describe("The AI's helpful and friendly response."),
});
export type ClanChatOutput = z.infer<typeof ClanChatOutputSchema>;

