import { z } from 'genkit';

// Define the stages of the "ConvocaÃ§Ã£o do Safra" protocol
export const DanteConversationStageSchema = z.enum([
  'AVALIACAO',      // Step 1: Ask about management experience
  'VEREDITO',       // Step 2: Present the paywall/CTA
]);
export type DanteConversationStage = z.infer<typeof DanteConversationStageSchema>;

export const DanteChatInputSchema = z.object({
  userMessage: z.string().describe("A resposta do usuÃ¡rio para Dante."),
  userName: z.string().optional().describe("O nome de registro do usuÃ¡rio."),
  conversationStage: DanteConversationStageSchema.describe("O estÃ¡gio atual do funil de conversa 'Protocolo ConvocaÃ§Ã£o do Safra'."),
});
export type DanteChatInput = z.infer<typeof DanteChatInputSchema>;

export const DanteChatOutputSchema = z.object({
  text: z.string().describe("A resposta direta e estratÃ©gica de Dante."),
  nextConversationStage: DanteConversationStageSchema.optional().describe("O prÃ³ximo estÃ¡gio da conversa para o qual o cliente deve transitar."),
  recommendedCourseSlug: z.string().optional().describe("O slug do curso recomendado pela IA com base na resposta do usuÃ¡rio."),
});
export type DanteChatOutput = z.infer<typeof DanteChatOutputSchema>;

