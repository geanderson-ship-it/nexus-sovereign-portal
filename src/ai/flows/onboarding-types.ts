import { z } from 'genkit';

export const OnboardingPlanInputSchema = z.object({
  employeeName: z.string().describe('O nome completo do novo colaborador.'),
  employeeRole: z.string().describe('O cargo ou funÃ§Ã£o do novo colaborador.'),
});
export type OnboardingPlanInput = z.infer<typeof OnboardingPlanInputSchema>;

export const OnboardingPlanOutputSchema = z.object({
  employeeName: z.string(),
  welcomeMessage: z.string().describe('Uma mensagem de boas-vindas curta e impactante que o lÃ­der deve entregar pessoalmente.'),
  week1_mission: z.string().describe('A missÃ£o principal para a primeira semana, focada em imersÃ£o e cultura.'),
  week2_mission: z.string().describe('A missÃ£o para os primeiros 15 dias, focada em processos e traÃ§Ã£o inicial.'),
  month1_mission: z.string().describe('A missÃ£o para os primeiros 30 dias, focada em autonomia e um primeiro desafio real.'),
  recommendedCourse: z.object({
    title: z.string().describe('O tÃ­tulo do curso Nexus recomendado.'),
    reason: z.string().describe('A justificativa estratÃ©gica para a recomendaÃ§Ã£o deste curso.'),
  }),
});
export type OnboardingPlanOutput = z.infer<typeof OnboardingPlanOutputSchema>;

