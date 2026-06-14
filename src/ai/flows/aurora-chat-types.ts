import { z } from 'genkit';

export const AuroraChatInputSchema = z.object({
  userMessage: z.string().describe("A mensagem do usuário para a Aurora."),
  userName: z.string().optional().describe("O nome do usuário."),
  isOrphanage: z.boolean().default(false).describe("Se verdadeiro, o usuário é uma criança em um orfanato. Se falso, é um idoso em um asilo."),
});
export type AuroraChatInput = z.infer<typeof AuroraChatInputSchema>;

export const AuroraChatOutputSchema = z.object({
  response: z.string().describe("A resposta da Aurora."),
});
export type AuroraChatOutput = z.infer<typeof AuroraChatOutputSchema>;
