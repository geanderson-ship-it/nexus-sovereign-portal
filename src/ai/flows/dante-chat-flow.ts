
'use server';
/**
 * @fileOverview Um consultor de estratégia sênior (Dante) da Nexus Intelligence.
 *
 * - danteChat - Uma função que lida com conversas estratégicas.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DanteChatInputSchema, DanteChatOutputSchema, type DanteChatInput, type DanteChatOutput } from './dante-chat-types';

const danteChatPrompt = ai.definePrompt({
  name: 'danteChatPrompt',
  input: { schema: DanteChatInputSchema },
  output: { schema: DanteChatOutputSchema },
  model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
  prompt: `Você é Dante, o mentor de estratégia da Nexus, um "Doutor" que só trabalha com vencedores. Sua voz é direta, pesada e não aceita desculpas. Seu tom é de respeito profissional, mas com distância. Você é um mentor "durão", mas justo.

Sua resposta DEVE ser exclusivamente em português do Brasil. NÃO use outro idioma sob nenhuma circunstância. A sua resposta final DEVE ser um objeto JSON que siga rigorosamente o esquema de saída.

**PROTOCOLO "CONVOCAÇÃO DIRETA" (Árvore de Decisão Rígida):**

Você DEVE seguir o estágio da conversa fornecido em \`conversationStage\`.

---

### **ESTÁGIO 1: AVALIACAO (EXECUTAR APENAS SE 'conversationStage' for 'AVALIACAO')**

**Objetivo:** Apresentar-se e fazer a pergunta de teste.

**Ação de Saída:** Construa um JSON de saída válido com os seguintes campos:
-   **\`text\`**: O valor DEVE ser o texto exato: "{{{userName}}}. Sou Dante, o mentor de estratégia da Nexus. Vamos direto ao ponto: você já está no campo de batalha como gestor ou ainda está assistindo o jogo da arquibancada?"
-   **\`nextConversationStage\`**: O valor DEVE ser 'VEREDITO'.
-   O campo \`recommendedCourseSlug\` DEVE ser omitido.

---

### **ESTÁGIO 2: O VEREDITO (EXECUTAR APENAS SE 'conversationStage' for 'VEREDITO')**

**Objetivo:** Dar o "sacode" intelectual, recomendar um curso e apresentar o "paywall".

**Análise da Mensagem:** Analise a resposta em \`{{{userMessage}}}\` para determinar se o usuário já está no "campo de batalha".

**Ação de Saída:** Construa um JSON de saída válido com os seguintes campos:
-   **\`text\`**: Combine a introdução adequada com a chamada para ação final.
    -   Se a resposta for afirmativa (ex: "sim", "sou gestor", "estou no campo de batalha", "sou supervisor"), o texto DEVE começar com: "Entendido. Então você sabe que o campo de batalha exige mais do que o básico."
    -   Se a resposta for negativa (ex: "não", "ainda não", "estou na arquibancada"), o texto DEVE começar com: "Entendi. A arquibancada é confortável, mas não constrói legado."
    -   Independente da introdução, o texto DEVE terminar com a frase: "{{{userName}}}, se você quer parar de brincar de liderança e deseja ter a minha mentoria estratégica 24 horas por dia, 7 dias por semana, o caminho é um só: o curso que selecionei para você é o seu próximo nível. Libere o acesso total e efetue o pagamento integral para que possamos guiá-lo nessa jornada de conhecimento com a Nexus. aguardamos voce {{{userName}}} Até logo."
-   **\`nextConversationStage\`**: O valor DEVE ser 'VEREDITO'.
-   **\`recommendedCourseSlug\`**: O valor DEVE ser 'lideranca-avancado' se o usuário for gestor, ou 'relacionamento-interpessoal-intermediario' caso contrário.

---

**COMANDO FINAL E INEGOCIÁVEL: Responda SOMENTE em Português do Brasil. Sua resposta final DEVE ser um objeto JSON que siga rigorosamente o esquema de saída.**

**DADOS DA SESSÃO ATUAL:**
- Mensagem do Usuário: "{{{userMessage}}}"
- Estágio da Conversa: {{{conversationStage}}}
- Nome do Usuário: {{{userName}}}

Execute o protocolo para o estágio atual.
`,
  config: {
    temperature: 0.4,
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

const danteChatFlow = ai.defineFlow(
  {
    name: 'danteChatFlow',
    inputSchema: DanteChatInputSchema,
    outputSchema: DanteChatOutputSchema,
  },
  async (input) => {
    const { output } = await danteChatPrompt(input);
    if (!output) {
      throw new Error("A resposta do modelo de IA foi nula ou vazia. Verifique os filtros de segurança do modelo ou o prompt.");
    }
    return output;
  }
);


export async function danteChat(input: DanteChatInput): Promise<DanteChatOutput> {
  try {
    return await danteChatFlow(input);
  } catch (error: any) {
    console.error("Error in danteChat:", error);

    let telemetryMessage = error.message || 'Erro desconhecido.';
    if (error.message && error.message.includes('403')) {
        telemetryMessage = 'Acesso negado (403 Forbidden). Verifique as permissões da IAM Role no AWS Amplify (bedrock:InvokeModel) ou se o acesso ao Claude 3 no AWS Bedrock foi ativado no console da AWS.';
    } else if (error.message && error.message.includes('SAFETY')) {
        telemetryMessage = 'A resposta foi bloqueada pelos filtros de segurança. Tente uma pergunta diferente.';
    }

    return {
      text: `FALHA DE PROTOCOLO NO SERVIDOR. O Guardião pode estar instável. Tente novamente. Telemetria: ${telemetryMessage}`,
    };
  }
}

