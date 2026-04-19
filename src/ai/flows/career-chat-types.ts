import { z } from 'genkit';

export const CareerChatInputSchema = z.object({
  userMessage: z.string().describe('The user\'s message or question about their career or Nexus courses.'),
});
export type CareerChatInput = z.infer<typeof CareerChatInputSchema>;

export const CareerChatOutputSchema = z.object({
  response: z.string().describe('Djeny\'s helpful and friendly response.'),
  recommendedCourseSlug: z.string().optional().describe("O slug do curso recomendado pela IA com base na resposta do usuário."),
});
export type CareerChatOutput = z.infer<typeof CareerChatOutputSchema>;
