import { z } from 'genkit';

// Define the stages of the "Anjo Protocol" funnel
export const DjenyConversationStageSchema = z.enum([
  'AVALIACAO',  // Step 1: Ask if they are a manager
  'XEQUE_MATE', // Step 2: Present the paywall/CTA
]);
export type DjenyConversationStage = z.infer<typeof DjenyConversationStageSchema>;


export const DjenyChatInputSchema = z.object({
  userMessage: z.string().describe("A mensagem do usuário para Djeny."),
  userName: z.string().optional().describe("O nome de registro do usuário."),
  locale: z.string().optional().describe("O código de idioma do usuário (ex: 'pt-BR', 'en-US')."),
  conversationStage: DjenyConversationStageSchema.describe("O estágio atual do funil de conversa 'Protocolo Anjo'."),
});
export type DjenyChatInput = z.infer<typeof DjenyChatInputSchema>;

export const DjenyChatOutputSchema = z.object({
  response: z.string().describe("A resposta acolhedora e estratégica de Djeny, seguindo o protocolo do estágio atual."),
  nextConversationStage: DjenyConversationStageSchema.optional().describe("O próximo estágio da conversa para o qual o cliente deve transitar."),
  recommendedCourseSlug: z.string().optional().describe("O slug do curso recomendado pela IA com base na resposta do usuário."),
});
export type DjenyChatOutput = z.infer<typeof DjenyChatOutputSchema>;
