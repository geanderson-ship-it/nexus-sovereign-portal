import { z } from 'genkit';

const LessonPointSchema = z.object({
  point: z.string().describe("O tópico principal do ponto da lição."),
  explanation: z.string().describe("A explicação detalhada do ponto da lição.")
});

export const DjenyInstrutorChatInputSchema = z.object({
  userMessage: z.string().describe("The user's message or question to the instructor Djeny."),
  userName: z.string().optional().describe("O nome de registro do aluno."),
  courseContext: z.object({
    courseTitle: z.string().describe("The title of the course the user is in."),
    moduleTitle: z.string().describe("The title of the current module."),
    danteLesson: z.array(LessonPointSchema).describe("The content of Dante's lesson, for context."),
    djenyLesson: z.array(LessonPointSchema).describe("The content of Djeny's lesson, broken down into points."),
  }).optional().describe("The context of the course and module being discussed."),
   history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string()
  })).optional().describe("The history of the conversation to maintain context."),
});
export type DjenyInstrutorChatInput = z.infer<typeof DjenyInstrutorChatInputSchema>;

export const DjenyInstrutorChatOutputSchema = z.object({
  response: z.string().describe("Djeny's direct and instructive response."),
});
export type DjenyInstrutorChatOutput = z.infer<typeof DjenyInstrutorChatOutputSchema>;
