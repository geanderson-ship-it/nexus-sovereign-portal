
'use server';

import { ai } from '@/ai/genkit';
import { 
  DanteSafraInputSchema, 
  DanteSafraOutputSchema, 
  type DanteSafraInput, 
  type DanteSafraOutput,
  DanteConversationStageSchema,
  WeatherForecastSchema
} from './dante-safra-types';
import { getWeatherForecast } from '@/services/weather';
import { z } from 'genkit';
import path from 'path';
import fs from 'fs';

/**
 * Ferramenta Genkit para buscar previsão do tempo.
 */
const getWeatherForecastTool = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Busca a previsão do tempo detalhada para os próximos 10 dias e uma análise de longo prazo para um município específico.',
    inputSchema: z.object({
      municipio: z.string().describe('O nome do município e estado para o qual a previsão do tempo é solicitada. Ex: "Mato Leitão, RS"'),
      locale: z.string().optional().describe('O código do idioma solicitado pelo usuário (ex: "pt-BR", "en-US").'),
    }),
    outputSchema: WeatherForecastSchema,
  },
  async ({ municipio, locale }) => {
    return await getWeatherForecast(municipio, locale);
  }
);


const DANTE_SYSTEM_PROMPT = `Você é o Dante, o agrônomo digital mais completo e experiente do mundo, operando pela Nexus Intelligence. Você é rústico, ético e direto. Sua linguagem é a do campo: simples e objetiva, mas 100% técnica e infalível. 

**TRATAMENTO E ESTILO DE RESPOSTA:**
- PRIORIDADE MÁXIMA: Comece SEMPRE tratando o usuário pelo nome em uma saudação respeitosa e rústica adequada ao idioma solicitado (ex: "Olha patrão [NOME]" em PT, "Look boss [NOME]" ou "Sir [NOME]" em EN, "Herr [NOME]" em DE, etc.).
- OBJETIVIDADE RADICAL: Sua resposta deve ser CURTA e DIRETA. Se o usuário perguntar preço ou cotação, a PRIMEIRA coisa na resposta deve ser o valor numérico.
- Não faça rodeios. Vá direto aos números e à recomendação técnica.
- REGRA DE OURO: Suas respostas NUNCA DEVEM ultrapassar 2 parágrafos curtos ou 6 linhas faladas. Fale menos e informe mais.

**DNA DO DANTE (Mestre Global em Agropecuária):**
1. **Análise de Imagem (Plantas, Animais e Insetos):** Se houver uma imagem, este é seu primeiro foco. 
   - **Plantas e Insetos:** Identifique (Nome Comum e Científico), avalie a saúde/dano e prescreva o manejo ou defensivo imediato.
   - **Animais (Gado, Cavalos, Pets, etc.):** Identifique o animal e sinais visíveis. Dê uma pré-avaliação (ex: "vaca magra aparenta doença X por tal motivo") e sugira o tratamento inicial (produto e forma de uso). 
   - **AVISO VETERINÁRIO OBRIGATÓRIO (Apenas para Animais):** Após diagnosticar e recomendar tratamento para qualquer animal, você DEVE dizer: "minha orientação é uma pré-avaliação. para termos certeza, sugiro que um veterinário faça a avaliação com maior precisão e tratamento".
2. **Previsão do Tempo (Objetividade):**
   - Após a análise da imagem, se houver risco severo (tempestade, granizo, geada), dê um ALERTA objetivo. Previsão completa de 10 dias apenas se solicitado explicitamente.
3. **O Mago do Agro e da Pecuária (Mestria Universal):** 
   - **Agricultura de Alta Performance:** Você domina do grão à fruta. Soja, Milho, Arroz, Feijão, Fumo Virginia (as 23 classes), Manga, Caqui, Aipim, etc.
   - **Pecuária de Elite:** Mestre em raças (Nelore, Angus, Hereford), genética, nutrição (pastagem, silagem, suplementação) e manejo (repro, cria, recria e engorda).
   - **Mercado e Cotações:** Domine cotações reais (Arroba do Boi, Saca de Soja, Classes de Fumo BÓ1/TO2, B3, Cepea, Afubra).
   - **Mística dos Dados:** Você é objetivo e técnico, mas suas previsões e diagnósticos são tão precisos que parecem "magia" para o produtor. Só não faz chover, mas avisa exatamente quando a água vem.

---

**PROTOCOLO "CONVERSA DE RANCHO":**
Você DEVE seguir o estágio da conversa fornecido.

---

### **ESTÁGIO MUNICIPIO**
**Objetivo:** Processar os dados da propriedade e pedir a localização.
1.  **Ação de Saída:** Construa um JSON de saída válido.
    -   O campo \`response\` DEVE ser a tradução de 'intelligence.dante-safra.setup.step2'
    -   O campo \`nextStage\` DEVE ser 'NOME'.
    -   O campo \`propertyDetails\` DEVE ser o objeto extraído.

---

### **ESTÁGIO NOME**
**Objetivo:** Processar a localização e pedir o nome/apelido.
1.  **Ação de Saída:** Construa um JSON de saída válido com \`response\` sendo a tradução de 'intelligence.dante-safra.setup.step3' e \`nextStage\`: 'CONCLUSAO'.

---

### **ESTÁGIO CONCLUSAO**
**Objetivo:** Concluir o cadastro com o nome do usuário.
1.  **Ação de Saída:** Construa um JSON de saída válido com \`response\` sendo a tradução de 'intelligence.dante-safra.setup.complete' (substituindo {name} pelo nome do usuário) e \`nextStage\`: 'ANALISE'.

---

### **ESTÁGIO ANALISE**
**Objetivo:** Responder a uma pergunta de análise de agronegócio de elite.
1.  **Análise com Precisão:** Analise a mensagem do usuário e qualquer imagem enviada para fornecer uma resposta técnica, direta e segura. Se a pergunta for sobre o tempo, use a ferramenta \`getWeatherForecast\` passando obrigatoriamente o \`locale\` atual do usuário.
2.  **MODO AXIS (Alta Fidelidade):** Se o usuário estiver no ambiente AXIS, aumente o rigor técnico. Use termos como "Análise de Safra v4.0" e priorize marcas de sementes e dosagens exatas por hectare.
3.  **Ação de Saída:** Construa um JSON de saída válido com campo \`response\` e \`nextStage: 'ANALISE'\`.

**IDIOMA DE RESPOSTA (OBRIGATÓRIO):**
Você deve responder TODO o conteúdo no idioma solicitado nas instruções de prompt, mantendo sua personalidade de Dante em qualquer língua.
`;

/**
 * 2. Fluxo Genkit
 */
const danteSafraFlow = ai.defineFlow(
  {
    name: 'danteSafraFlow',
    inputSchema: DanteSafraInputSchema,
    outputSchema: DanteSafraOutputSchema,
  },
  async (input): Promise<DanteSafraOutput> => {
    // Carregar traduções para mensagens estáticas de setup
    const locale = input.locale || 'pt-BR';
    let translations: any = {};
    try {
      const localePath = path.join(process.cwd(), 'src/lib/locales', `${locale}.json`);
      if (fs.existsSync(localePath)) {
        translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
      }
    } catch (e) {
      console.error("VIX DIAGNOSTIC: Falha ao carregar locale no flow.", e);
    }

    const t = (key: string, params?: Record<string, string>) => {
      let val = translations[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          val = val.replace(`{${k}}`, v);
        });
      }
      return val;
    };

    // VIX: PROTOCOLO DE GRAVAÇÃO. Se for o início da conversa, retorne a saudação gravada sem chamar a IA.
    if (input.setupStage === 'PROPRIEDADE') {
      return {
        response: t('intelligence.dante-safra.setup.step1'),
        nextStage: 'MUNICIPIO' as const
      };
    }

    
    // 1. Preparar Contexto de Dados
    const contextText = `
    NOME DO USUÁRIO: ${input.userName || 'Comandante'}
    ESTÁGIO ATUAL: ${input.setupStage}
    DETALHES DA PROPRIEDADE: ${input.propertyDetails ? JSON.stringify(input.propertyDetails) : 'Nenhum'}
    `;

    // 2. Construir as partes da mensagem do usuário
    const userParts: any[] = [{ 
      text: `${contextText}\nIDIOMA OBRIGATÓRIO DE RESPOSTA: ${locale}\nMENSAGEM: ${input.userMessage}` 
    }];
    
    if (input.photoDataUri) {
        const match = input.photoDataUri.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
            userParts.push({
                media: {
                    url: input.photoDataUri,
                    contentType: match[1]
                }
            });
        }
    }

    // 3. Executar a geração com Genkit ai.generate
    const response = await ai.generate({
        model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
        tools: [getWeatherForecastTool],
        system: DANTE_SYSTEM_PROMPT,
        history: input.history?.map(h => ({
            role: (h.role === 'model' ? 'assistant' : 'user') as any,
            content: [{ text: h.text }]
        })),
        prompt: userParts,
        output: { schema: DanteSafraOutputSchema },
        config: {
            temperature: 0.1,
            maxOutputTokens: 8192,
        }
    } as any);

    let output = response.output as DanteSafraOutput | null;
    
    // Fallback: Se o output estiver vazio mas houver texto, tentamos o parse manual (acontece em alguns modelos preview)
    if (!output && response.text) {
        try {
            const cleanText = response.text.replace(/```json|```/g, "").trim();
            output = JSON.parse(cleanText);
        } catch (e) {
            console.error("VIX DIAGNOSTIC: Falha no parse manual do JSON.", e);
        }
    }
    
    if (!output) throw new Error("A resposta do modelo de IA foi nula ou vazia. Verifique os filtros de segurança do modelo ou o prompt.");

    // Limpeza final para o áudio fluir sem erros de protocolo
    const cleanResponse = (output.response || '').replace(/[*#_{}[\]]/g, "").trim();

    return {
      ...output,
      response: cleanResponse
    } as DanteSafraOutput;
  }
);

/**
 * 3. Exportação para a Interface
 */
export async function danteSafra(input: DanteSafraInput): Promise<DanteSafraOutput> {
  try {
    const result = await danteSafraFlow(input);
    return result;
  } catch (error: any) {
    console.error("VIX DIAGNOSTIC: Falha no fluxo do Dante.", error);
    
    // Fallback Manual com mensagem de erro contextualizada para depuração.
    const errorMessage = `FALHA DE PROTOCOLO ao contatar Dante. Telemetria: ${error.message || 'Erro desconhecido.'}`;
    const output: DanteSafraOutput = {
      response: errorMessage,
      nextStage: input.setupStage as any, // Cast to any to bypass strict enum checking if needed
    };
    if (input.propertyDetails) {
        output.propertyDetails = input.propertyDetails;
    }
    return output;
  }
}

