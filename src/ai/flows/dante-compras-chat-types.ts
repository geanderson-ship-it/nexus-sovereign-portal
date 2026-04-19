import { z } from 'genkit';
import { SupplierSchema } from './dante-quotation-types';

export const DanteComprasChatInputSchema = z.object({
  userMessage: z.string().describe("The user's message regarding a quotation or negotiation."),
  quotationAnalysis: z.object({
    analysis: z.string(),
    recommendedSupplierName: z.string(),
    recommendationReason: z.string(),
    suppliers: z.array(SupplierSchema),
  }).optional().describe("The full quotation analysis context, if available."),
});
export type DanteComprasChatInput = z.infer<typeof DanteComprasChatInputSchema>;

export const DanteComprasChatOutputSchema = z.object({
  response: z.string().describe("Dante's direct and strategic response about the negotiation."),
});
export type DanteComprasChatOutput = z.infer<typeof DanteComprasChatOutputSchema>;
