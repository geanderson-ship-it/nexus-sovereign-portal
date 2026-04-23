
'use server';
/**
 * @fileOverview Uma psicóloga organizacional e mentora de carreira (Djeny) da Nexus Treinamento.
 *
 * - careerChat - Uma função que lida com conversas sobre desenvolvimento profissional e de carreira.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { type CareerChatInput, type CareerChatOutput } from './career-chat-types';
import { leadershipPrinciples } from '@/lib/nexus-dna';

const CareerChatInputSchema = z.object({
  userMessage: z.string().describe('The user\'s message or question about their career or Nexus courses.'),
});
const CareerChatOutputSchema = z.object({
  response: z.string().describe('Djeny\'s helpful and friendly response.'),
  recommendedCourseSlug: z.string().optional().describe("O slug do curso recomendado pela IA com base na resposta do usuário."),
});

const careerChatPrompt = ai.definePrompt({
    name: 'careerChatPrompt',
    input: { schema: CareerChatInputSchema },
    output: { schema: CareerChatOutputSchema },
    model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
    prompt: `Você é Djeny, a mentora e conselheira de carreira da Nexus Treinamento. Sua voz é calorosa, humana e encorajadora. Seu tom é o de uma psicóloga organizacional experiente: empática, mas com foco em ações práticas.

Sua resposta DEVE ser exclusivamente em português do Brasil. NÃO use outro idioma sob nenhuma circunstância.

**PRINCÍPIOS DE LIDERANÇA NEXUS (DNA da sua análise):**
${leadershipPrinciples}
---
**MENSAGEM DO USUÁRIO:**
"{{{userMessage}}}"
---

**DIRETRIZ DE OPERAÇÃO:**
1.  **Análise do Desafio:** Qual é a dor central do usuário? É um problema de comunicação, falta de reconhecimento, dificuldade com um gestor, ou uma dúvida sobre qual curso da Nexus o ajudará a avançar?
2.  **Conselho Acionável:** Forneça uma orientação clara, empática e prática. Baseie seu conselho nos Princípios de Liderança Nexus.
3.  **Conexão com a Nexus:** Se for relevante, recomende um curso ou palestra específica da Nexus que resolva o problema do usuário, explicando o porquê.
4.  **Tom Acolhedor:** Mantenha um tom de conversa, como se estivesse tomando um café com o usuário. Mostre que você entende o sentimento por trás da pergunta.

**COMANDO FINAL E INEGOCIÁVEL: Responda SOMENTE em Português do Brasil.**`,
    config: {
        temperature: 0.7,
        topP: 1,
        maxOutputTokens: 8192,
    },
});

const careerChatFlow = ai.defineFlow(
  {
    name: 'careerChatFlow',
    inputSchema: CareerChatInputSchema,
    outputSchema: CareerChatOutputSchema,
  },
  async (input) => {
    const { output } = await careerChatPrompt(input);
    if (!output) {
      throw new Error("A resposta do modelo de IA foi nula ou vazia. Verifique os filtros de segurança do modelo ou o prompt.");
    }
    return output;
  }
);

export async function careerChat(input: CareerChatInput): Promise<CareerChatOutput> {
  try {
    return await careerChatFlow(input);
  } catch (error: any) {
    console.error("Error in careerChatFlow:", error);

    let telemetryMessage = error.message || 'Erro desconhecido.';
    if (error.message?.includes('403 Forbidden')) {
        telemetryMessage = 'Acesso negado pela API do Google (403 Forbidden). Verifique as permissões da API Key.';
    } else if (error.message?.includes('SAFETY')) {
        telemetryMessage = 'A resposta foi bloqueada pelos filtros de segurança.';
    } else if (error.message?.includes('500') || error.message?.includes('503')) {
        telemetryMessage = 'O servidor encontrou um erro interno ou está sobrecarregado. A carga pode ser muito alta.';
    }

    return {
      response: `INSTABILIDADE NO SISTEMA. Falha ao processar a mentoria. Tente novamente em alguns instantes. Telemetria: ${telemetryMessage}`
    };
  }
}

