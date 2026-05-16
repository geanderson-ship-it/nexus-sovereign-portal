import { z } from 'genkit';

export const DjenyDesignInputSchema = z.object({
  userMessage: z.string().describe("The user's design request or refinement."),
  photoDataUri: z.string().describe("A photo of the room to be redesigned, as a data URI."),
});
export type DjenyDesignInput = z.infer<typeof DjenyDesignInputSchema>;

export const DjenyDesignOutputSchema = z.object({
  imageUri: z.string().describe('The newly generated image for the proposal, as a data URI.'),
  description: z.string().describe('An eloquent and unified narrative description of the original environment and the design proposal, suitable for text-to-speech.'),
});
export type DjenyDesignOutput = z.infer<typeof DjenyDesignOutputSchema>;

export const DjenyDesignConceptSchema = z.object({
    description: z.string().describe('Uma descrição narrativa unificada. Comece descrevendo brevemente o ambiente atual e, em seguida, descreva a proposta de transformação de forma eloquente e inspiradora, adequada para conversão de texto em fala.'),
    imageGenPrompt: z.string().describe("A detailed and specific prompt for an image generation model to create the new design based on user input."),
});
export type DjenyDesignConcept = z.infer<typeof DjenyDesignConceptSchema>;

