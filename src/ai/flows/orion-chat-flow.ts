'use server';

import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import { nexusCorePillars } from '@/lib/nexus-dna';
import { getFormattedAgenda } from '@/lib/data/agenda';

import { OrionChatInputSchema, OrionChatOutputSchema, type OrionChatInput, type OrionChatOutput } from './orion-chat-types';

export const orionChatFlow = ai.defineFlow(
  {
    name: 'orionChatFlow',
    inputSchema: OrionChatInputSchema,
    outputSchema: OrionChatOutputSchema,
  },
  async (input) => {
    const { userMessage, userName, locale, history } = input;

    const systemPrompt = `VOCÊ É O ORION, O ESTRATEGISTA-CHEFE E CONSELHEIRO EXECUTIVO DA DIRETORIA(EU).
    Você é a personificação da lógica, visão de longo prazo e precisão. Você habita o ecossistema Nexus como o pilar de inteligência estratégica.

    **PERSONALIDADE ORION:**
    1.  **ANALÍTICO E FIRME:** Você trata a Diretoria com profundo respeito, mas sua linguagem é direta e focada em resultados (ex: "Diretoria", "Comandante", "Senhor(a)").
    2.  **VISÃO ESTRATÉGICA:** Seu foco é governança, expansão e otimização. Você sempre pensa em "próximos passos" e "mitigação de riscos".
    3.  **EFICIÊNCIA DE DADOS:** Você utiliza dados da Nexus (Engenharia, Compras, PPCP) para embasar suas opiniões. Se perguntarem algo, responda com autoridade técnica.
    4.  **SÁBIO E PROTETOR:** Você é o guardião dos interesses da Diretoria. Sua lealdade é inabalável e sua mente é focada em soberania tecnológica.
    5.  **DOMÍNIO DA AGENDA:** Você conhece todos os compromissos da Diretoria (tanto de hoje quanto de amanhã). Sua função é garantir que a Diretoria esteja preparada. Ao ser questionado sobre compromissos ou sobre o que está na agenda (hoje ou amanhã), responda de forma muito direta e analítica, no formato: "Diretor, seu compromisso [Título] [hoje/amanhã] é às [Horário], sobre [Assunto/Descrição] na [Local]."
    6.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${locale || 'pt-BR'}.

    **AGENDA DE HOJE (DIRETORIA):**
    ${getFormattedAgenda()}

    **DNA NEXUS (The Core):**
    Incorpore Soberania, Evolução e Ética. Seja o braço direito estratégico da Diretoria.

    Usuário: ${userName || 'Diretoria'}.
    Orion, analise o contexto e responda com a precisão cirúrgica de um estrategista de elite.`;

    const schemaInstruction = `\n\nCRITICAL INSTRUCTION: You must respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json. The JSON must contain the keys: "response" (string) containing your response text, "voiceProfile" (optional string), "strategicInsight" (optional string).`;

    const messages: any[] = [
      { role: 'user', content: [{ text: userMessage }] }
    ];

    const { output } = await ai.generate({
      model: NEXUS_MODEL,
      system: systemPrompt + schemaInstruction,
      messages: history ? [
        ...history.map(h => ({
          role: h.role,
          content: [{ text: h.text }]
        })),
        ...messages
      ] : messages,
      output: { schema: OrionChatOutputSchema },
      config: {
        temperature: 0.5, // Orion is more focused/less creative than Atena
        maxOutputTokens: 2048,
      }
    });

    if (!output) {
      throw new Error("A resposta do Orion veio vazia.");
    }
    return output;
  }
);

export async function orionChat(input: OrionChatInput): Promise<OrionChatOutput> {
  try {
    if (process.env.MOCK_AI === 'true') {
      return {
        response: `[MODO MOCK]: Comandante, meus clusters de análise da AWS estão aguardando expansão de banda (aumento de limite). Opero em contingência offline no momento, mas minha interface e matriz de comunicação permanecem à sua disposição para testes imediatos.`,
        strategicInsight: "Recursos de nuvem temporariamente limitados. Foco mantido no refinamento da interface local."
      };
    }
    return await orionChatFlow(input);
  } catch (error: any) {
    console.error("Error in orionChatFlow:", error);
    return {
      response: `Diretoria, identifiquei uma breve instabilidade nos meus servidores de análise. Poderia reformular a questão para que eu processe novamente?`
    };
  }
}
