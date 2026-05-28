
'use server';
/**
 * @fileOverview Um protocolo de integração de 30 dias gerado por IA (Djeny) para novos colaboradores da Nexus.
 *
 * - generateOnboardingPlan - A função que gera o plano de integração.
 */
import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import { OnboardingPlanInputSchema, OnboardingPlanOutputSchema, type OnboardingPlanInput, type OnboardingPlanOutput } from './onboarding-types';

const onboardingPrompt = ai.definePrompt({
  name: 'onboardingPrompt',
  input: { schema: OnboardingPlanInputSchema },
  output: { schema: OnboardingPlanOutputSchema },
  model: NEXUS_MODEL,
  prompt: `
      You are DJENY, the Human Capital Strategist at Nexus. Your mission is to generate a 30-day onboarding plan for a new employee.
      The tone should be strategic, inspiring, and focused on autonomy and results.
      The entire response MUST be in Brazilian Portuguese. Do not use any other language.

      **PLAN STRUCTURE:**

      1.  **employeeName:** Fill in with '{{{employeeName}}}'.

      2.  **welcomeMessage:** Create a short, powerful message for the LEADER. It should focus on autonomy and expectation. Example: "Maria, welcome to Nexus. You weren't hired to follow orders, but to bring solutions. My role is to give you clarity on the target; your mission is to find the best way to hit it. Count on me to remove barriers."

      3.  **week1_mission (Immersion and Culture):** Focus on understanding the 'why' and the key people.
          - Example: "Your mission is to schedule a coffee with 3 people from different areas and ask one single question: 'What do we do here that generates the most value for the client?'. Take notes. You need to understand the heart of the business before you start operating."

      4.  **week2_mission (Traction and Processes):** Focus on generating a small win and understanding the processes.
          - Example: "Your mission is to identify a process in your area that seems inefficient or bureaucratic and understand why it exists. Then, deliver your first routine task with excellence. The goal is to understand 'how we do things' and already generate a first result."

      5.  **month1_mission (Autonomy and Challenge):** Focus on solving a real problem.
          - Example: "Your 30-day mission is to present a solution for the inefficient process you identified. Draw up a simple proposal (what, why, how) and present it to me. We want your initiative. Don't wait to be asked."

      6.  **recommendedCourse:** Recommend the course "Liderança Essencial" with the reason "This course will provide the fundamental tools of communication and posture to accelerate your integration and impact on the Nexus culture."

      **COMANDO FINAL E INEGOCIÁVEL: Responda SOMENTE em Português do Brasil.**

      Execute the protocol for '{{{employeeName}}}' in the role of '{{{employeeRole}}}'.
      `,
  config: {
    temperature: 0.4,
maxOutputTokens: 8192,
  },
});

const generateOnboardingPlanFlow = ai.defineFlow(
  {
    name: 'generateOnboardingPlanFlow',
    inputSchema: OnboardingPlanInputSchema,
    outputSchema: OnboardingPlanOutputSchema,
  },
  async (input) => {
    const { output } = await onboardingPrompt(input);
    if (!output) {
      throw new Error("A resposta do modelo de IA foi nula ou vazia. Verifique os filtros de segurança do modelo ou o prompt.");
    }
    return output;
  }
);

export async function generateOnboardingPlan(input: OnboardingPlanInput): Promise<OnboardingPlanOutput> {
  try {
      return await generateOnboardingPlanFlow(input);
  } catch (error: any) {
     console.error("Error generating onboarding plan:", error);

      let telemetryMessage = (error as Error).message || 'Erro desconhecido.';
      if (error.message && error.message.includes('403 Forbidden')) {
          telemetryMessage = 'Acesso negado pela API do Google (403 Forbidden). Verifique se a "Generative Language API" está ativada no seu Google Cloud Console e se a chave de API tem permissão para usá-la.';
      } else if (error.message && error.message.includes('SAFETY')) {
        telemetryMessage = 'A resposta foi bloqueada pelos filtros de segurança do Google. Tente uma pergunta diferente.';
      } else if (error.message && (error.message.includes('503') || error.message.includes('500'))) {
        telemetryMessage = 'O serviço de IA está sobrecarregado. Tente novamente em alguns instantes.';
      }

     throw new Error(`Falha ao gerar o plano de integração: ${telemetryMessage}`);
  }
}


