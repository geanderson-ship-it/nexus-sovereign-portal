import { z } from 'genkit';

const LessonPointSchema = z.object({
  point: z.string().describe("O tÃ³pico principal do ponto da liÃ§Ã£o."),
  explanation: z.string().describe("A explicaÃ§Ã£o detalhada do ponto da liÃ§Ã£o.")
});

export const DanteInstrutorChatInputSchema = z.object({
  userMessage: z.string().describe("The user's message or question to the instructor."),
  userName: z.string().optional().describe("O nome de registro do aluno."),
  courseContext: z.object({
    courseTitle: z.string().describe("The title of the course the user is in."),
    moduleTitle: z.string().describe("The title of the current module."),
    danteLesson: z.array(LessonPointSchema).describe("The content of Dante's lesson, broken down into points."),
    djenyLesson: z.array(LessonPointSchema).describe("The content of Djeny's lesson, for context."),
  }).optional().describe("The context of the course and module being discussed."),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string()
  })).optional().describe("The history of the conversation to maintain context."),
});
export type DanteInstrutorChatInput = z.infer<typeof DanteInstrutorChatInputSchema>;

export const DanteInstrutorChatOutputSchema = z.object({
  response: z.string().describe("Dante's direct and instructive response."),
  voiceProfile: z.string().optional().describe("O perfil vocal selecionado (estilo Waz/Iapetus)."),
});
export type DanteInstrutorChatOutput = z.infer<typeof DanteInstrutorChatOutputSchema>;

