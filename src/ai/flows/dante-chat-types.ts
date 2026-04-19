import { z } from 'genkit';

// Define the stages of the "Convocação do Safra" protocol
export const DanteConversationStageSchema = z.enum([
  'AVALIACAO',      // Step 1: Ask about management experience
  'VEREDITO',       // Step 2: Present the paywall/CTA
]);
export type DanteConversationStage = z.infer<typeof DanteConversationStageSchema>;

export const DanteChatInputSchema = z.object({
  userMessage: z.string().describe("A resposta do usuário para Dante."),
  userName: z.string().optional().describe("O nome de registro do usuário."),
  conversationStage: DanteConversationStageSchema.describe("O estágio atual do funil de conversa 'Protocolo Convocação do Safra'."),
});
export type DanteChatInput = z.infer<typeof DanteChatInputSchema>;

export const DanteChatOutputSchema = z.object({
  text: z.string().describe("A resposta direta e estratégica de Dante."),
  nextConversationStage: DanteConversationStageSchema.optional().describe("O próximo estágio da conversa para o qual o cliente deve transitar."),
  recommendedCourseSlug: z.string().optional().describe("O slug do curso recomendado pela IA com base na resposta do usuário."),
});
export type DanteChatOutput = z.infer<typeof DanteChatOutputSchema>;
