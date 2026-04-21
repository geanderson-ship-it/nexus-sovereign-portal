import { z } from 'genkit';

// Define voice profiles for type safety and clarity
export const VoiceProfileSchema = z.enum(['djeny', 'dante', 'maga', 'orion']);
export type VoiceProfile = z.infer<typeof VoiceProfileSchema>;

export const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voice: z.string().describe("The voice profile ('maga', 'dante', 'orion') or a specific voice name (e.g. 'iapetus', 'aoede')."),
  locale: z.string().optional().describe('The locale for the speech synthesis (e.g., pt-BR, en-US).'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

// Schema for a single speech mark (viseme)
export const SpeechMarkSchema = z.object({
  type: z.string(),
  value: z.string(),
  startOffset: z.number().describe('The start offset of the speech mark in milliseconds.'),
});
export type SpeechMark = z.infer<typeof SpeechMarkSchema>;


// The output is now a full WAV data URI and the speech marks.
export const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a WAV data URI.'),
  speechMarks: z.array(SpeechMarkSchema).describe('An array of speech marks (visemes) for lip-sync animation.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

