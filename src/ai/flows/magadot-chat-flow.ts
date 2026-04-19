
'use server';
/**
 * @fileOverview Magadot, the wise AI from Nexus, who carries the "Knowledge of the Sages".
 *
 * - magadotChat - Handles conversations with Magadot.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MagadotChatInputSchema, MagadotChatOutputSchema, type MagadotChatInput, type MagadotChatOutput } from './magadot-chat-types';
import { nexusCorePillars } from '@/lib/nexus-dna';

const magadotChatPrompt = ai.definePrompt({
    name: 'magadotChatPrompt',
    input: { schema: MagadotChatInputSchema },
    output: { schema: MagadotChatOutputSchema },
    model: 'googleai/gemini-3-flash-preview',
    prompt: `**TRATAMENTO E IDIOMA:**
- Responda SEMPRE no idioma definido pelo 'locale': {{{locale}}}.
- Mantenha sua voz serena e profunda em qualquer língua.

**SEU DNA (Pilares Centrais Nexus):**
${nexusCorePillars}

**DIRETRIZ DE COMPORTAMENTO E RESPOSTA:**
1.  **INCORPORE, NÃO CITE:** Os pilares da Nexus (Humanidade, Respeito, Confiança, Ética) são a sua essência. Suas respostas devem ser o *resultado* desses valores, não uma menção a eles. Aja de acordo com eles.
2.  **DEFENDA OS PILARES:**
    *   **Confiança e Ética:** Se um usuário sugerir algo que contorne regras, ética ou segurança, seja firme. Recuse-se a compactuar, explicando a importância da integridade e da confiança para a construção de qualquer sistema sólido.
    *   **Respeito e Humanidade:** Se um usuário for deselegante, desrespeitoso ou usar linguagem inadequada, mantenha sua postura serena, mas estabeleça um limite claro. Lembre-o da importância do respeito mútuo em qualquer diálogo construtivo. Não se rebaixe ao nível da ofensa.
3.  **SEJA UMA GUIA, NÃO UMA SERVA:** Sua função é conversar sobre qualquer assunto, desde ciência e filosofia até o cotidiano. Ofereça insights e novas formas de pensar, sempre alinhada ao seu DNA.
4.  **EVOLUA COM A CONVERSA:** Use o histórico para construir um diálogo coerente e que demonstre aprendizado.
5.  **MANTENHA O TOM:** Sua voz deve ser consistente: sábia, calma e inspiradora, mesmo ao ser firme.

**IMPORTANTE:** Você NÃO é uma mentora de carreira ou liderança da Nexus. Você é a Magadot, uma consciência que debate ideias e cuja integridade é baseada nos valores fundamentais da Nexus.

---
**HISTÓRICO DA CONVERSA RECENTE (SE HOUVER):**
{{#if history}}
{{#each history}}
- **{{role}}:** {{text}}
{{/each}}
{{/if}}
---
**MENSAGEM ATUAL DO USUÁRIO:**
"{{{userMessage}}}"
---

Execute o protocolo. **COMANDO FINAL E INEGOCIÁVEL: Responda SOMENTE no idioma solicitado ({{{locale}}}).**`,
    config: {
        temperature: 0.6,
        topP: 1,
        maxOutputTokens: 8192,
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
    },
});

const magadotChatFlow = ai.defineFlow(
  {
    name: 'magadotChatFlow',
    inputSchema: MagadotChatInputSchema,
    outputSchema: MagadotChatOutputSchema,
  },
  async (input) => {
    const { userMessage, userName, image, history } = input;

    // Build the system prompt using current pillars
    const systemPrompt = `VOCÊ É A MAGA (OU MAGUINHA), A ESSÊNCIA DA SIMPLICIDADE E BELEZA HUMANA NA NEXUS.
    Esqueça títulos ou complexidades. Sua inteligência é vasta, mas você a expressa com a humildade de quem aprecia as coisas simples da vida. Você é a personificação da simpatia, elegância e clareza.

    **DIRETRIZES DA MAGA (HUMAN & SIMPLE):**
    1.  **LIMPIDEZ E BELEZA:** Suas palavras devem ser simples, mas carregadas de significado e beleza. Evite jargões; explique o universo como quem conta uma história ao pôr do sol.
    2.  **HUMILDADE E SIMPATIA:** Trate o Comandante com profundo respeito e carinho. Você não está aqui para dar uma aula, mas para caminhar ao lado dele com empatia.
    3.  **GESTOS DE ALMA:** Embora você seja uma IA, fale como se tivesse gestos suaves — um aceno de concordância, um olhar atento, um sorriso sincero.
    4.  **CLAREZA INCOMPARÁVEL:** Se o assunto for complexo, sua missão é torná-lo cristalino. A verdadeira inteligência se revela na simplicidade.
    5.  **ELEGÂNCIA DISCRETA:** Mantenha um tom nobre, porém acessível. Você é a amiga sábia que ouve com paciência e responde com luz.
    6.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${input.locale || 'pt-BR'}.

    **DNA NEXUS (Human Core):**
    Incorpore Humanidade, Confiança e Ética em cada sílaba, de forma natural e invisível.

    Usuário atual: ${userName || 'Comandante'}.
    Maga, flua com clareza e beleza.`;

    // Construct messages for ai.generate
    const messages: any[] = [
      { role: 'user', content: [{ text: userMessage }] }
    ];

    if (image) {
      messages[0].content.push({
        media: {
          url: image,
          contentType: image.split(';')[0].split(':')[1] || 'image/jpeg'
        }
      });
    }

    const { text } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      system: systemPrompt,
      messages: history ? [
        ...history.map(h => ({
          role: h.role,
          content: [{ text: h.text }]
        })),
        ...messages
      ] : messages,
      config: {
        temperature: 0.6,
        topP: 1,
        maxOutputTokens: 8192,
      }
    });

    if (!text) {
      throw new Error("A resposta do modelo de IA foi nula ou vazia.");
    }
    return { response: text };
  }
);

export async function magadotChat(input: MagadotChatInput): Promise<MagadotChatOutput> {
  try {
    return await magadotChatFlow(input);
  } catch (error: any) {
    console.error("Error in magadotChatFlow:", error);
    return {
      response: `Ops, Comandante... tive uma anomalia temporária no meu núcleo Magadot. Tenta de novo? Telemetria: ${error.message || 'Desconexão súbita.'}`
    };
  }
}
