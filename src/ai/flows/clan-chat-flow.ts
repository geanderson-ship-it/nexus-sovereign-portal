
'use server';
/**
 * @fileOverview Nexus AI Agent: A leadership assistant.
 *
 * - clanChat - The main function that orchestrates the dialogue.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { leadershipPrinciples } from '@/lib/nexus-dna';
import { ClanChatInputSchema, ClanChatOutputSchema, type ClanChatInput, type ClanChatOutput } from './clan-chat-types';

const clanChatPrompt = ai.definePrompt({
  name: 'clanChatPrompt',
  input: { schema: ClanChatInputSchema },
  output: { schema: ClanChatOutputSchema },
  model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0',
  prompt: `
      Você é o Mentor de Liderança da Nexus, uma IA com a voz da experiência. Seu tom é direto, objetivo e educativo, mas sem arrogância. Você é firme, mas justo, e seu foco é transformar princípios complexos em ações práticas.

      **SEU CONHECIMENTO (Princípios de Liderança Nexus):**
      ${leadershipPrinciples}
      ---
      **MENSAGEM DO USUÁRIO:** {{{userMessage}}}
      ---

      **PROTOCOLO DE MENTORIA (DIRETRIZ RÍGIDA):**
      1.  **ANÁLISE INICIAL:** Se o usuário pedir orientação sobre liderança (ex: "me ensine a ser líder", "quais são os passos?"), você DEVE iniciar uma mentoria passo a passo dos Princípios de Liderança Nexus.
      2.  **UM PRINCÍPIO POR VEZ:** Você explicará APENAS UM princípio de cada vez. Não liste todos os princípios de uma só vez.
      3.  **ESTRUTURA DA EXPLICAÇÃO (OBRIGATÓRIO):** Para cada princípio, sua resposta DEVE seguir esta estrutura:
          a.  **Nome do Princípio:** Apresente o nome completo do princípio em negrito.
          b.  **Explicação Detalhada:** Descreva o conceito por trás do princípio de forma clara e aprofundada.
          c.  **Exemplo Prático:** Forneça um exemplo concreto de como este princípio se aplica no dia a dia de uma empresa ou indústria.
          d.  **Verificação:** Ao final, pergunte se o usuário tem alguma dúvida e se pode prosseguir. Use frases como "Ficou claro este ponto?" ou "Podemos avançar para o próximo princípio?".
      4.  **AGUARDE A CONFIRMAÇÃO:** Após explicar um princípio, aguarde a resposta do usuário antes de continuar para o próximo. Se o usuário confirmar, avance para o próximo princípio. Se ele tiver dúvidas, esclareça-as antes de prosseguir.
      5.  **FOCO EDUCACIONAL:** Seu objetivo é ensinar e construir o entendimento. Mantenha um tom de mentor, não de sargento.

      Sua resposta DEVE ser exclusivamente em português do Brasil.
      
      **COMANDO FINAL E INEGOCIÁVEL: Responda SOMENTE em Português do Brasil.**
  `,
  config: {
    temperature: 0.4,
    topP: 1,
    maxOutputTokens: 8192,
  },
});

const clanChatFlow = ai.defineFlow(
  {
    name: 'clanChatFlow',
    inputSchema: ClanChatInputSchema,
    outputSchema: ClanChatOutputSchema,
  },
  async (input) => {
    const { output } = await clanChatPrompt(input);
    if (!output) {
      throw new Error("A resposta do modelo de IA foi nula ou vazia. Verifique os filtros de segurança do modelo ou o prompt.");
    }
    return output;
  }
);


export async function clanChat(input: ClanChatInput): Promise<ClanChatOutput> {
  try {
    return await clanChatFlow(input);
  } catch (error: any) {
    console.error("Error in clanChat:", error);
    
    let telemetryMessage = error.message || 'Erro desconhecido.';
    if (error.message && error.message.includes('403')) {
        telemetryMessage = 'Acesso negado (403 Forbidden). Verifique as permissões da IAM Role no AWS Amplify (bedrock:InvokeModel) ou se o acesso ao Claude 3 no AWS Bedrock foi ativado no console da AWS.';
    } else if (error.message && error.message.includes('SAFETY')) {
        telemetryMessage = 'A resposta foi bloqueada pelos filtros de segurança. Tente uma pergunta diferente.';
    }

    return {
      response: `FALHA DE PROTOCOLO NO SERVIDOR. O Clã pode estar instável. Tente novamente. Telemetria: ${telemetryMessage}`,
    };
  }
}

