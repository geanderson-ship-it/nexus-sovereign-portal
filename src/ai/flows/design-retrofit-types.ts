import { z } from 'genkit';

export const RetrofitInputSchema = z.object({
  photoDataUri: z.string().describe(
    "A photo of a room, as a data URI."
  ),
  prompt: z.string().describe('The desired changes.'),
});
export type RetrofitInput = z.infer<typeof RetrofitInputSchema>;

export const RetrofitOutputSchema = z.object({
  imageUri: z.string().describe('The generated image as a data URI.'),
});
export type RetrofitOutput = z.infer<typeof RetrofitOutputSchema>;
