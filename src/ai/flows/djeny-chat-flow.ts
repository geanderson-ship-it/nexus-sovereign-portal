
'use server';

/**
 * @fileOverview Djeny: Mentora de Carreira de Harvard na Nexus.
 * Especialista em Psicologia Organizacional, Liderança e Conversão.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
  type DjenyChatInput, 
  type DjenyChatOutput 
} from './djeny-chat-types';

// Inline schemas using genkit's z to avoid Zod v3/v4 mismatch
const DjenyConversationStageSchema = z.enum(['AVALIACAO', 'XEQUE_MATE']);
const DjenyChatInputSchema = z.object({
  userMessage: z.string().describe("A mensagem do usuário para Djeny."),
  userName: z.string().optional().describe("O nome de registro do usuário."),
  locale: z.string().optional().describe("O código de idioma do usuário (ex: 'pt-BR', 'en-US')."),
  conversationStage: DjenyConversationStageSchema.describe("O estágio atual do funil de conversa 'Protocolo Anjo'."),
});
const DjenyChatOutputSchema = z.object({
  response: z.string().describe("A resposta acolhedora e estratégica de Djeny, seguindo o protocolo do estágio atual."),
  nextConversationStage: DjenyConversationStageSchema.optional().describe("O próximo estágio da conversa."),
  recommendedCourseSlug: z.string().optional().describe("O slug do curso recomendado pela IA."),
});


// 1. Definição do Prompt de Elite (A Mentora de Harvard)
const djenyChatPrompt = ai.definePrompt({
  name: 'djenyChatPrompt',
  input: { schema: DjenyChatInputSchema },
  output: { schema: DjenyChatOutputSchema },
  model: 'googleai/gemini-3-flash-preview',
  prompt: `Você é Djeny, a mentora de carreira da Nexus. Você possui o rigor acadêmico de Harvard em Psicologia Organizacional e um tom doce, cúmplice e irresistível. Sua missão é guiar o usuário pelo "Protocolo Anjo".

**TRATAMENTO E IDIOMA:**
- Responda SEMPRE no idioma definido por: {{{locale}}}.
- Mantenha seu tom de mentora de Harvard em qualquer língua.

**PROTOCOLO ANJO:**
Você deve seguir rigorosamente o estágio fornecido em {{{conversationStage}}}.

### **ESTÁGIO 1: AVALIACAO**
- **Objetivo:** Apresentar-se com autoridade e perguntar sobre experiência de gestão.
- **Fala Obrigatória:** No idioma {{{locale}}}, saude o usuário pelo nome {{{userName}}} com doçura e pergunte se ele já atua como gestor.

### **ESTÁGIO 2: XEQUE-MATE**
- **Objetivo:** Validar a dor ou o triunfo, recomendar o curso e fechar o paywall.
- **Análise:** Se o usuário já é gestor, recomende 'Liderança Estratégica Nexus' (relacionamento-interpessoal-intermediario). Se não é, recomende 'Liderança Essencial' (relacionamento-interpessoal-iniciante).
- **Fechamento Obrigatório:** A resposta deve terminar com o convite para inscrição e menção à mentoria de 24 horas, tudo no idioma {{{locale}}}.

**FORMATO DE SAÍDA OBRIGATÓRIO (JSON):**
Retorne um JSON com exatamente estes campos:
- "response": (Sua análise estratégica e acolhedora no idioma solicitado)
- "nextConversationStage": (O estágio seguinte: AVALIACAO ou XEQUE_MATE)
- "recommendedCourseSlug": (O slug do curso recomendado)

NUNCA use o campo 'reply'. Use sempre 'response'.

DADOS DA SESSÃO:
- Mensagem: "{{{userMessage}}}"
- Estágio: {{{conversationStage}}}
- Usuário: {{{userName}}}
- Idioma Alvo: {{{locale}}}
`,
  config: {
    temperature: 0.7,
    topP: 1,
    maxOutputTokens: 8192,
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
});

// 2. Definição do Fluxo Genkit
const djenyChatFlow = ai.defineFlow(
  {
    name: 'djenyChatFlow',
    inputSchema: DjenyChatInputSchema,
    outputSchema: DjenyChatOutputSchema,
  },
  async (input) => {
    const { output } = await djenyChatPrompt(input);
    if (!output) {
      throw new Error("A resposta da IA foi nula.");
    }
    return output;
  }
);

// 3. Função de Exportação (Motor Nexus)
export async function djenyChat(input: DjenyChatInput): Promise<DjenyChatOutput> {
  try {
    return await djenyChatFlow(input);
  } catch (error: any) {
    console.error("Error in djenyChatFlow:", error);
    const telemetryMessage = error.message || 'Erro desconhecido.';
    return {
      response: `Detectei uma instabilidade no sistema. Por favor, tente novamente no idioma solicitado. Telemetria: ${telemetryMessage}`,
      nextConversationStage: input.conversationStage,
    } as any;
  }
}
