import { z } from 'genkit';

// Weather Schemas (moved from services/weather.ts)
export const DailyForecastSchema = z.object({
  day: z.string().describe("Day of the week (e.g., 'sáb.', 'dom.')."),
  maxTemp: z.number().describe("Maximum temperature in Celsius."),
  minTemp: z.number().describe("Minimum temperature in Celsius."),
  condition: z.string().describe("General weather condition (e.g., 'Ensolarado', 'Chuva fraca')."),
  rainChance: z.number().describe("Chance of rain in percentage (0-100)."),
});
export type DailyForecast = z.infer<typeof DailyForecastSchema>;

export const WeatherForecastSchema = z.object({
  tenDayForecast: z.array(DailyForecastSchema).describe("A list of daily forecasts for the next 10 days."),
  longTermOutlook: z.string().describe("A summary of the long-term weather outlook, mentioning phenomena like La Niña or El Niño if relevant."),
});
export type WeatherForecast = z.infer<typeof WeatherForecastSchema>;


// Dante Safra Schemas
export const DanteConversationStageSchema = z.enum(['PROPRIEDADE', 'MUNICIPIO', 'NOME', 'CONCLUSAO', 'ANALISE']);
export type DanteConversationStage = z.infer<typeof DanteConversationStageSchema>;

export const DanteSafraInputSchema = z.object({
  userMessage: z.string().describe("A pergunta do produtor sobre sua lavoura, dados ou mercado."),
  photoDataUri: z.string().optional().describe(
    "Uma foto da plantação para análise, como um data URI. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  photoContentType: z.string().optional().describe("MIME type da imagem (ex: image/jpeg)."),
  photoBase64: z.string().optional().describe("Apenas os dados base64 da imagem."),
  userName: z.string().optional().describe("O nome de registro/apelido do usuário."),
  locale: z.string().optional().describe("O código de idioma (ex: 'pt-BR', 'ja-JP')."),
  setupStage: DanteConversationStageSchema.describe("O estágio atual do processo de setup."),
  propertyDetails: z.object({
      tamanho: z.string().optional(),
      culturas: z.array(z.string()).optional(),
      animais: z.array(z.string()).optional(),
      municipio: z.string().optional(),
  }).optional().describe("Detalhes da propriedade do usuário, se já cadastrados."),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string()
  })).optional().describe("O histórico da conversa para manter o contexto."),
});
export type DanteSafraInput = z.infer<typeof DanteSafraInputSchema>;

export const PropertyDetailsSchema = z.object({
  tamanho: z.string().optional().describe("Tamanho da propriedade, incluindo a unidade (ex: '15 hectares', '50m²')."),
  culturas: z.array(z.string()).optional().describe("Lista de culturas plantadas (ex: soja, milho, fumo, hortifrúti, subsistência)."),
  animais: z.array(z.string()).optional().describe("Lista de animais criados (ex: gado, porcos, galinhas)."),
  municipio: z.string().optional().describe("O município onde a propriedade está localizada."),
}).describe("Detalhes da propriedade do produtor.");
export type PropertyDetails = z.infer<typeof PropertyDetailsSchema>;

export const DanteSafraOutputSchema = z.object({
  response: z.string().describe("A resposta técnica e segura do Dante Safra."),
  newNickname: z.string().optional().describe("O apelido validado e confirmado do usuário."),
  nextStage: DanteConversationStageSchema.optional().describe("O próximo estágio do setup, se a conversa for de registro."),
  propertyDetails: PropertyDetailsSchema.optional().describe("Detalhes da propriedade extraídos da mensagem do usuário durante o setup.")
});
export type DanteSafraOutput = z.infer<typeof DanteSafraOutputSchema>;
