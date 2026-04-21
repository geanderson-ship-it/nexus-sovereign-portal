import { z } from 'genkit';

// Define the stages of the "Anjo Protocol" funnel
export const DjenyConversationStageSchema = z.enum([
  'AVALIACAO',  // Step 1: Ask if they are a manager
  'XEQUE_MATE', // Step 2: Present the paywall/CTA
]);
export type DjenyConversationStage = z.infer<typeof DjenyConversationStageSchema>;


export const DjenyChatInputSchema = z.object({
  userMessage: z.string().describe("A mensagem do usuÃ¡rio para Djeny."),
  userName: z.string().optional().describe("O nome de registro do usuÃ¡rio."),
  locale: z.string().optional().describe("O cÃ³digo de idioma do usuÃ¡rio (ex: 'pt-BR', 'en-US')."),
  conversationStage: DjenyConversationStageSchema.describe("O estÃ¡gio atual do funil de conversa 'Protocolo Anjo'."),
});
export type DjenyChatInput = z.infer<typeof DjenyChatInputSchema>;

export const DjenyChatOutputSchema = z.object({
  response: z.string().describe("A resposta acolhedora e estratÃ©gica de Djeny, seguindo o protocolo do estÃ¡gio atual."),
  nextConversationStage: DjenyConversationStageSchema.optional().describe("O prÃ³ximo estÃ¡gio da conversa para o qual o cliente deve transitar."),
  recommendedCourseSlug: z.string().optional().describe("O slug do curso recomendado pela IA com base na resposta do usuÃ¡rio."),
});
export type DjenyChatOutput = z.infer<typeof DjenyChatOutputSchema>;

