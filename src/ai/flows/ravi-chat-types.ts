import { z } from 'genkit';

export const RaviChatInputSchema = z.object({
  userMessage: z.string().describe("A mensagem do usuário para o Ravi."),
  userName: z.string().optional().describe("O nome do usuário."),
  isOrphanage: z.boolean().default(false).describe("Se verdadeiro, o usuário é uma criança em um orfanato. Se falso, é um idoso em um asilo."),
});
export type RaviChatInput = z.infer<typeof RaviChatInputSchema>;

export const RaviChatOutputSchema = z.object({
  response: z.string().describe("A resposta do Ravi."),
});
export type RaviChatOutput = z.infer<typeof RaviChatOutputSchema>;
