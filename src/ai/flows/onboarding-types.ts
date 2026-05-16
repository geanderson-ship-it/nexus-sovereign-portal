import { z } from 'genkit';

export const OnboardingPlanInputSchema = z.object({
  employeeName: z.string().describe('O nome completo do novo colaborador.'),
  employeeRole: z.string().describe('O cargo ou função do novo colaborador.'),
});
export type OnboardingPlanInput = z.infer<typeof OnboardingPlanInputSchema>;

export const OnboardingPlanOutputSchema = z.object({
  employeeName: z.string(),
  welcomeMessage: z.string().describe('Uma mensagem de boas-vindas curta e impactante que o líder deve entregar pessoalmente.'),
  week1_mission: z.string().describe('A missão principal para a primeira semana, focada em imersão e cultura.'),
  week2_mission: z.string().describe('A missão para os primeiros 15 dias, focada em processos e tração inicial.'),
  month1_mission: z.string().describe('A missão para os primeiros 30 dias, focada em autonomia e um primeiro desafio real.'),
  recommendedCourse: z.object({
    title: z.string().describe('O título do curso Nexus recomendado.'),
    reason: z.string().describe('A justificativa estratégica para a recomendação deste curso.'),
  }),
});
export type OnboardingPlanOutput = z.infer<typeof OnboardingPlanOutputSchema>;

