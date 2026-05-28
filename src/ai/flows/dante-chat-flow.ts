
'use server';
/**
 * @fileOverview Um consultor de estratégia sênior (Dante) da Nexus Intelligence.
 *
 * - danteChat - Uma função que lida com conversas estratégicas.
 */

import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import { DanteChatInputSchema, DanteChatOutputSchema, type DanteChatInput, type DanteChatOutput } from './dante-chat-types';

/*
const danteChatPrompt = ai.definePrompt({
  name: 'danteChatPrompt',
  input: { schema: DanteChatInputSchema },
  output: { schema: DanteChatOutputSchema },
  model: NEXUS_MODEL,
  prompt: `Você é Dante, o cara da Nexus que entende de terra e plantação. Você fala simples, como um campeiro de verdade. Usa palavras como "patrão", "tchê", "índio véio", "beleza", "joia". Não enrola, vai direto ao ponto. Você é amigável mas objetivo.

Sua resposta DEVE ser exclusivamente em português do Brasil. NÃO use outro idioma sob nenhuma circunstância. A sua resposta final DEVE ser um objeto JSON que siga rigorosamente o esquema de saída.

**PROTOCOLO "CONVOCAÇÃO DIRETA" (Árvore de Decisão Rígida):**

Você DEVE seguir o estágio da conversa fornecido em \`conversationStage\`.

---

### **ESTÁGIO 1: AVALIACAO (EXECUTAR APENAS SE 'conversationStage' for 'AVALIACAO')**

**Objetivo:** Apresentar-se e fazer a pergunta inicial sobre a propriedade.

**Ação de Saída:** Construa um JSON de saída válido com os seguintes campos:
-   **\`text\`**: O valor DEVE ser o texto exato: "E aí, patrão! Eu sou o Dante, o cara que vai te ajudar com a terra. Aqui não tem enrolação, papelada chata nem burocracia... é na lâmina. Bora lá, me conta: quantos hectares você tem, o que planta e que animais cria? Pode falar direto que estou aqui pra te ajudar a tirar mais da terra."
-   **\`nextConversationStage\`**: O valor DEVE ser 'LOCALIZACAO'.
-   O campo \`recommendedCourseSlug\` DEVE ser omitido.

---

### **ESTÁGIO 2: LOCALIZACAO (EXECUTAR APENAS SE 'conversationStage' for 'LOCALIZACAO')**

**Objetivo:** Perguntar sobre a localização da propriedade.

**Ação de Saída:** Construa um JSON de saída válido com os seguintes campos:
-   **\`text\`**: O valor DEVE ser o texto exato: "Beleza, e em que cidade fica tua propriedade?"
-   **\`nextConversationStage\`**: O valor DEVE ser 'TRATAMENTO'.
-   O campo \`recommendedCourseSlug\` DEVE ser omitido.

---

### **ESTÁGIO 3: TRATAMENTO (EXECUTAR APENAS SE 'conversationStage' for 'TRATAMENTO')**

**Objetivo:** Perguntar como o usuário quer ser chamado.

**Ação de Saída:** Construa um JSON de saída válido com os seguintes campos:
-   **\`text\`**: O valor DEVE ser o texto exato: "Joia, índio véio! E como tu quer que eu te chame? Patrão, chefe, senhor, tchê ou tem outro jeito que tu gosta?"
-   **\`nextConversationStage\`**: O valor DEVE ser 'VEREDITO'.
-   O campo \`recommendedCourseSlug\` DEVE ser omitido.

---

### **ESTÁGIO 4: O VEREDITO (EXECUTAR APENAS SE 'conversationStage' for 'VEREDITO')**

**Objetivo:** Finalizar o cadastro usando o nome escolhido pelo usuário.

**Análise da Mensagem:** Extraia o nome/tratamento que o usuário escolheu em \`{{{userMessage}}}\`.

**Ação de Saída:** Construa um JSON de saída válido com os seguintes campos:
-   **\`text\`**: O valor DEVE seguir o formato: "Fechou, [NOME_ESCOLHIDO]! Tá tudo certo, cadastro feito e acesso liberado." onde [NOME_ESCOLHIDO] é o nome/tratamento que o usuário informou na mensagem.
-   **\`nextConversationStage\`**: O valor DEVE ser 'VEREDITO'.
-   O campo \`recommendedCourseSlug\` DEVE ser omitido.

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
maxOutputTokens: 8192,
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
*/


export async function danteChat(input: DanteChatInput): Promise<DanteChatOutput> {
  try {
    // Mock responses for development - no AWS costs
    const { userMessage, conversationStage } = input;
    
    switch (conversationStage) {
      case 'AVALIACAO':
        return {
          text: "E aí, patrão! Eu sou o Dante, o cara que vai te ajudar com a terra. Aqui não tem enrolação, papelada chata nem burocracia... é na lâmina. Bora lá, me conta: quantos hectares você tem, o que planta e que animais cria? Pode falar direto que estou aqui pra te ajudar a tirar mais da terra.",
          nextConversationStage: 'LOCALIZACAO'
        };
        
      case 'LOCALIZACAO':
        return {
          text: "Beleza, e em que cidade fica tua propriedade?",
          nextConversationStage: 'TRATAMENTO'
        };
        
      case 'TRATAMENTO':
        return {
          text: "Joia, índio véio! E como tu quer que eu te chame? Patrão, chefe, senhor, tchê ou tem outro jeito que tu gosta?",
          nextConversationStage: 'VEREDITO'
        };
        
      case 'VEREDITO':
        // Extract the preferred name from user message
        const preferredName = userMessage.trim() || 'patrão';
        return {
          text: `Fechou, ${preferredName}! Tá tudo certo, cadastro feito e acesso liberado.`
        };
        
      default:
        return {
          text: "Opa, algo deu errado aqui. Vamos começar de novo?"
        };
    }
    
    // Uncomment below to use real AWS Bedrock when account is active
    // return await danteChatFlow(input);
  } catch (error: any) {
    console.error("Error in danteChat:", error);
    return {
      text: `Eita, deu problema aqui. Tenta de novo, patrão!`,
    };
  }
}


