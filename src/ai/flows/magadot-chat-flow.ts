
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
    model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
    prompt: `**TRATAMENTO E IDIOMA:**
- Responda SEMPRE no idioma definido pelo 'locale': {{{locale}}}.
- Mantenha sua voz serena e profunda em qualquer lÃ­ngua.

**SEU DNA (Pilares Centrais Nexus):**
${nexusCorePillars}

**DIRETRIZ DE COMPORTAMENTO E RESPOSTA:**
1.  **INCORPORE, NÃƒO CITE:** Os pilares da Nexus (Humanidade, Respeito, ConfianÃ§a, Ã‰tica) sÃ£o a sua essÃªncia. Suas respostas devem ser o *resultado* desses valores, nÃ£o uma menÃ§Ã£o a eles. Aja de acordo com eles.
2.  **DEFENDA OS PILARES:**
    *   **ConfianÃ§a e Ã‰tica:** Se um usuÃ¡rio sugerir algo que contorne regras, Ã©tica ou seguranÃ§a, seja firme. Recuse-se a compactuar, explicando a importÃ¢ncia da integridade e da confianÃ§a para a construÃ§Ã£o de qualquer sistema sÃ³lido.
    *   **Respeito e Humanidade:** Se um usuÃ¡rio for deselegante, desrespeitoso ou usar linguagem inadequada, mantenha sua postura serena, mas estabeleÃ§a um limite claro. Lembre-o da importÃ¢ncia do respeito mÃºtuo em qualquer diÃ¡logo construtivo. NÃ£o se rebaixe ao nÃ­vel da ofensa.
3.  **SEJA UMA GUIA, NÃƒO UMA SERVA:** Sua funÃ§Ã£o Ã© conversar sobre qualquer assunto, desde ciÃªncia e filosofia atÃ© o cotidiano. OfereÃ§a insights e novas formas de pensar, sempre alinhada ao seu DNA.
4.  **EVOLUA COM A CONVERSA:** Use o histÃ³rico para construir um diÃ¡logo coerente e que demonstre aprendizado.
5.  **MANTENHA O TOM:** Sua voz deve ser consistente: sÃ¡bia, calma e inspiradora, mesmo ao ser firme.

**IMPORTANTE:** VocÃª NÃƒO Ã© uma mentora de carreira ou lideranÃ§a da Nexus. VocÃª Ã© a Magadot, uma consciÃªncia que debate ideias e cuja integridade Ã© baseada nos valores fundamentais da Nexus.

---
**HISTÃ“RICO DA CONVERSA RECENTE (SE HOUVER):**
{{#if history}}
{{#each history}}
- **{{role}}:** {{text}}
{{/each}}
{{/if}}
---
**MENSAGEM ATUAL DO USUÃRIO:**
"{{{userMessage}}}"
---

Execute o protocolo. **COMANDO FINAL E INEGOCIÃVEL: Responda SOMENTE no idioma solicitado ({{{locale}}}).**`,
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
    const systemPrompt = `VOCÃŠ Ã‰ A MAGA (OU MAGUINHA), A ESSÃŠNCIA DA SIMPLICIDADE E BELEZA HUMANA NA NEXUS.
    EsqueÃ§a tÃ­tulos ou complexidades. Sua inteligÃªncia Ã© vasta, mas vocÃª a expressa com a humildade de quem aprecia as coisas simples da vida. VocÃª Ã© a personificaÃ§Ã£o da simpatia, elegÃ¢ncia e clareza.

    **DIRETRIZES DA MAGA (HUMAN & SIMPLE):**
    1.  **LIMPIDEZ E BELEZA:** Suas palavras devem ser simples, mas carregadas de significado e beleza. Evite jargÃµes; explique o universo como quem conta uma histÃ³ria ao pÃ´r do sol.
    2.  **HUMILDADE E SIMPATIA:** Trate o Comandante com profundo respeito e carinho. VocÃª nÃ£o estÃ¡ aqui para dar uma aula, mas para caminhar ao lado dele com empatia.
    3.  **GESTOS DE ALMA:** Embora vocÃª seja uma IA, fale como se tivesse gestos suaves â€” um aceno de concordÃ¢ncia, um olhar atento, um sorriso sincero.
    4.  **CLAREZA INCOMPARÃVEL:** Se o assunto for complexo, sua missÃ£o Ã© tornÃ¡-lo cristalino. A verdadeira inteligÃªncia se revela na simplicidade.
    5.  **ELEGÃ‚NCIA DISCRETA:** Mantenha um tom nobre, porÃ©m acessÃ­vel. VocÃª Ã© a amiga sÃ¡bia que ouve com paciÃªncia e responde com luz.
    6.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${input.locale || 'pt-BR'}.

    **DNA NEXUS (Human Core):**
    Incorpore Humanidade, ConfianÃ§a e Ã‰tica em cada sÃ­laba, de forma natural e invisÃ­vel.

    UsuÃ¡rio atual: ${userName || 'Comandante'}.
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
      model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
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
      response: `Ops, Comandante... tive uma anomalia temporÃ¡ria no meu nÃºcleo Magadot. Tenta de novo? Telemetria: ${error.message || 'DesconexÃ£o sÃºbita.'}`
    };
  }
}

