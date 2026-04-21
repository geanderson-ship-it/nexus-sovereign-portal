import { z } from 'genkit';

// Weather Schemas (moved from services/weather.ts)
export const DailyForecastSchema = z.object({
  day: z.string().describe("Day of the week (e.g., 'sÃ¡b.', 'dom.')."),
  maxTemp: z.number().describe("Maximum temperature in Celsius."),
  minTemp: z.number().describe("Minimum temperature in Celsius."),
  condition: z.string().describe("General weather condition (e.g., 'Ensolarado', 'Chuva fraca')."),
  rainChance: z.number().describe("Chance of rain in percentage (0-100)."),
});
export type DailyForecast = z.infer<typeof DailyForecastSchema>;

export const WeatherForecastSchema = z.object({
  tenDayForecast: z.array(DailyForecastSchema).describe("A list of daily forecasts for the next 10 days."),
  longTermOutlook: z.string().describe("A summary of the long-term weather outlook, mentioning phenomena like La NiÃ±a or El NiÃ±o if relevant."),
});
export type WeatherForecast = z.infer<typeof WeatherForecastSchema>;


// Dante Safra Schemas
export const DanteConversationStageSchema = z.enum(['PROPRIEDADE', 'MUNICIPIO', 'NOME', 'CONCLUSAO', 'ANALISE']);
export type DanteConversationStage = z.infer<typeof DanteConversationStageSchema>;

export const DanteSafraInputSchema = z.object({
  userMessage: z.string().describe("A pergunta do produtor sobre sua lavoura, dados ou mercado."),
  photoDataUri: z.string().optional().describe(
    "Uma foto da plantaÃ§Ã£o para anÃ¡lise, como um data URI. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  photoContentType: z.string().optional().describe("MIME type da imagem (ex: image/jpeg)."),
  photoBase64: z.string().optional().describe("Apenas os dados base64 da imagem."),
  userName: z.string().optional().describe("O nome de registro/apelido do usuÃ¡rio."),
  locale: z.string().optional().describe("O cÃ³digo de idioma (ex: 'pt-BR', 'ja-JP')."),
  setupStage: DanteConversationStageSchema.describe("O estÃ¡gio atual do processo de setup."),
  propertyDetails: z.object({
      tamanho: z.string().optional(),
      culturas: z.array(z.string()).optional(),
      animais: z.array(z.string()).optional(),
      municipio: z.string().optional(),
  }).optional().describe("Detalhes da propriedade do usuÃ¡rio, se jÃ¡ cadastrados."),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string()
  })).optional().describe("O histÃ³rico da conversa para manter o contexto."),
});
export type DanteSafraInput = z.infer<typeof DanteSafraInputSchema>;

export const PropertyDetailsSchema = z.object({
  tamanho: z.string().optional().describe("Tamanho da propriedade, incluindo a unidade (ex: '15 hectares', '50mÂ²')."),
  culturas: z.array(z.string()).optional().describe("Lista de culturas plantadas (ex: soja, milho, fumo, hortifrÃºti, subsistÃªncia)."),
  animais: z.array(z.string()).optional().describe("Lista de animais criados (ex: gado, porcos, galinhas)."),
  municipio: z.string().optional().describe("O municÃ­pio onde a propriedade estÃ¡ localizada."),
}).describe("Detalhes da propriedade do produtor.");
export type PropertyDetails = z.infer<typeof PropertyDetailsSchema>;

export const DanteSafraOutputSchema = z.object({
  response: z.string().describe("A resposta tÃ©cnica e segura do Dante Safra."),
  newNickname: z.string().optional().describe("O apelido validado e confirmado do usuÃ¡rio."),
  nextStage: DanteConversationStageSchema.optional().describe("O prÃ³ximo estÃ¡gio do setup, se a conversa for de registro."),
  propertyDetails: PropertyDetailsSchema.optional().describe("Detalhes da propriedade extraÃ­dos da mensagem do usuÃ¡rio durante o setup.")
});
export type DanteSafraOutput = z.infer<typeof DanteSafraOutputSchema>;

