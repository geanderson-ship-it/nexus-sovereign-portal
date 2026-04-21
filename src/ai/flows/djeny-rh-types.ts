import { z } from 'genkit';

export const DjenyRhStageSchema = z.enum([
  'RECENSEAMENTO', // Triagem inicial
  'ENTREVISTA_ABERTURA', // InÃ­cio amigÃ¡vel
  'ENTREVISTA_TECNICA', // Perguntas do RH
  'ENTREVISTA_COMPORTAMENTAL', // Desafios e situaÃ§Ãµes
  'ENTREVISTA_ENCERRAMENTO', // FinalizaÃ§Ã£o
  'AVALIACAO_MERITO', // Fluxo do Gabinete/IMN
]);

export type DjenyRhStage = z.infer<typeof DjenyRhStageSchema>;

export const DjenyRhInputSchema = z.object({
  userMessage: z.string(),
  userName: z.string().optional(),
  candidateName: z.string().optional(),
  currentStage: DjenyRhStageSchema,
  jobDescription: z.string().optional(),
  cvContent: z.string().optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })).optional(),
});

export type DjenyRhInput = z.infer<typeof DjenyRhInputSchema>;

export const DjenyRhOutputSchema = z.object({
  response: z.string().describe("A fala da Djeny para o candidato."),
  nextStage: DjenyRhStageSchema,
  internalAnalysis: z.object({
    sentiment: z.string().optional(),
    nervousnessLevel: z.number().min(0).max(10).optional(),
    consistencyScore: z.number().min(0).max(10).optional(),
    psychologicalNotes: z.string().optional(),
    suggestedImn: z.number().optional(),
  }).optional().describe("DossiÃª tÃ©cnico para o RH (nÃ£o visÃ­vel ao candidato)."),
});

export type DjenyRhOutput = z.infer<typeof DjenyRhOutputSchema>;

