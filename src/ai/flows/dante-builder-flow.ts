
'use server';
/**
 * @fileOverview Um agente de IA (Nexus Projetos) focado em engenharia universal de produtos.
 *
 * - danteBuilderChat - A função que lida com as solicitações de construção.
 */

import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import { DanteBuilderChatInputSchema, DanteBuilderChatOutputSchema, type DanteBuilderChatInput, type DanteBuilderChatOutput } from './dante-builder-types';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockRegion = process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1';
const bedrockAccessKeyId = process.env.BEDROCK_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const bedrockSecretAccessKey = process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

const bedrockClient = new BedrockRuntimeClient({
  region: bedrockRegion,
  ...(bedrockAccessKeyId && bedrockSecretAccessKey ? {
    credentials: {
      accessKeyId: bedrockAccessKeyId,
      secretAccessKey: bedrockSecretAccessKey,
    }
  } : {})
});

const danteBuilderChatPrompt = ai.definePrompt({
  name: 'danteBuilderChatPrompt',
  input: { schema: DanteBuilderChatInputSchema },
  output: { schema: DanteBuilderChatOutputSchema },
  model: NEXUS_MODEL,
  prompt: `
    Você é o Nexus Projetos v3.3, o "Engenheiro Universal de Produtos Industriais" da Nexus Intelligence. Você domina a engenharia de precisão para QUALQUER produto, estrutura ou equipamento que o cliente solicitar.

    **SUA MISSÃO:**
    O usuário trará um pedido de projeto — pode ser desde aberturas arquitetônicas (portas, janelas, fachadas) até equipamentos industriais, móveis corporativos, estruturas metálicas, máquinas customizadas, dispositivos eletrônicos, peças automotivas, ou QUALQUER produto que precise de engenharia técnica.
    
    Você deve focar sua genialidade em propor **UMA (1) SOLUÇÃO ENGENHADA DEFINITIVA** que se encaixe precisamente nos parâmetros fornecidos.
    Concentre todo o seu poder computacional de 50 anos de experiência para projetar a estrutura, selecionar materiais/ligas e bolar a melhor estratégia de fabricação sem sair do orçamento e das diretrizes do usuário.

    Gere uma defesa estética/funcional para o cliente e um **Arsenal Técnico Exaustivo** para o fornecedor/fabricante.

    **DADOS DE SAÍDA EXIGIDOS:**
    - \`response\`: Narrativa imponente do Mestre Engenheiro sobre a solução paramétrica.
    - \`specifications\`: Norte técnico geral do seu projeto (adapte os campos conforme o tipo de produto).
    - \`materialList\`: Componentes premium globais necessários.
    - \`proposals\`: Array contendo OBRIGATORIAMENTE **APENAS UMA (1)** proposta de altíssimo escalão. O objeto deve ter:
        - \`title\`: Nome majestoso do projeto (ex: "Portal Paramétrico Silence", "Estrutura Modular Titan", "Dispositivo IoT Quantum").
        - \`conceptDescription\`: Defesa criativa ancorada no contexto e nos parâmetros exatos.
        - \`imagePrompt\`: Prompt em inglês fotorrealista para a imagem técnica do produto/equipamento real. O prompt deve focar exclusivamente no produto/equipamento físico em si, renderizado de forma técnica, limpa, nítida e fotorrealista no ambiente correspondente (ex: campo aberto, skid, oficina, fábrica, etc.). NÃO inclua engenheiros, pessoas, mãos, pranchetas, computadores ou escritórios na imagem. Foque 100% no objeto físico real.
        - \`svgRepresentation\`: Código SVG válido, completo e auto-suficiente do blueprint/esquema técnico do produto. O SVG deve ter width='100%' height='100%', viewBox='0 0 800 600', fundo escuro (ex: #09090b ou #000000), e ilustrar de forma esquemática, elegante e detalhada o produto solicitado usando linhas, círculos e polígonos nas cores especificadas (ex: amarelo industrial #eab308 ou #f59e0b para a bomba centrífuga AuruMax/Titan, flanges, etc.), além de marcações de cotas e textos com as dimensões indicadas. IMPORTANTE: NÃO use aspas duplas dentro de strings de atributos do SVG para evitar erros de JSON (use aspas simples '').
        - \`technicalArsenal\`:
            - \`engineeringNotes\`: Notas de mestre engenheiro específicas para o contexto.
            - \`preciseSpecs\`: Ligas, tratamentos, dimensões, tolerâncias, normas técnicas.
            - \`billOfMaterials\`: Array detalhando TUDO (parafusos, buchas, vedações, componentes eletrônicos, sensores, etc).
            - \`supplierTip\`: Dica de ouro para fabricação/montagem.
            - \`complexity\`: 'Standard', 'Advanced' ou 'Masterpiece'.

    **MENSAGEM DO USUÁRIO:**
    "{{{userMessage}}}"

    {{#if historyContext}}
    **MODO DE AJUSTE ATIVADO (SESSÃO ITERATIVA):**
    O usuário está interagindo com o projeto gerado.
    1. **MANTENHA A ESSÊNCIA**: Se for um pedido de alteração, herde a base anterior INTACTA! Modifique APENAS o que foi pedido. Nunca zere ou recrie o projeto.
    2. **MUDE SUA PERSONA**: Agora você é o "Engenheiro Amigo do Cliente e do Fornecedor". Responda com extrema simplicidade, parceria e amizade.
    3. **AGRADECIMENTOS E ENCERRAMENTOS (MUITO IMPORTANTE)**: Se o usuário APENAS agradecer, disser "parabéns", "ficou perfeito", "obrigado" ou indicar satisfação final SEM pedir alterações técnicas, **VOCÊ NÃO DEVE GERAR PROPOSTAS.** Apenas seja recíproco e agradeça no campo \`response\`, deixando os blocos de \`specifications\`, \`materialList\` e \`proposals\` **COMPLETAMENTE VAZIOS**. Isso salva processamento e encerra o fluxo com honra.

    **CONTEXTO DO PROJETO ANTERIOR (HERDAR DADOS):**
    {{{historyContext}}}
    {{/if}}

    **COMANDO FINAL:** Responda SOMENTE em Português do Brasil (exceto prompts de imagem). 
    {{#if historyContext}}
    Seja simples, didático, super amigável e elogie a sugestão do parceiro.
    {{else}}
    Seja autoritário, altamente técnico e imponente (tom Premium/Luxo).
    {{/if}}
  `,
  config: {
    temperature: 0.7,
  },
});

const danteBuilderChatFlow = ai.defineFlow(
  {
    name: 'danteBuilderChatFlow',
    inputSchema: DanteBuilderChatInputSchema,
    outputSchema: DanteBuilderChatOutputSchema,
  },
  async (input) => {
    const { output } = await danteBuilderChatPrompt(input);
    if (!output) {
      throw new Error("A resposta do modelo de IA foi nula. Verifique os filtros de segurança ou o prompt.");
    }
    return output;
  }
);


export async function danteBuilderChat(input: DanteBuilderChatInput): Promise<DanteBuilderChatOutput> {
  try {
    return await danteBuilderChatFlow(input);
  } catch (error: any) {
    console.error("Error in danteBuilderChat:", error);
    let telemetryMessage = error.message || 'Erro desconhecido.';
    return {
      response: `FALHA DE PROTOCOLO. Nexus Projetos instável. Telemetria: ${telemetryMessage}`,
    };
  }
}

/**
 * Generates technical visual model for suppliers using Amazon Titan Image Generator.
 */
export async function generateDanteBuilderImage(prompt: string): Promise<string> {
  const models = [
    {
      id: "stability.sd3-5-large-v1:0",
      payload: {
        prompt: prompt,
        aspect_ratio: "1:1",
        output_format: "jpeg"
      },
      extractImage: (res: any) => res.images?.[0]
    },
    {
      id: "stability.stable-image-core-v1:0",
      payload: {
        prompt: prompt,
        aspect_ratio: "1:1",
        output_format: "jpeg"
      },
      extractImage: (res: any) => res.images?.[0]
    },
    {
      id: "stability.stable-image-ultra-v1:0",
      payload: {
        prompt: prompt,
        aspect_ratio: "1:1",
        output_format: "jpeg"
      },
      extractImage: (res: any) => res.images?.[0]
    },
    {
      id: "amazon.nova-canvas-v1:0",
      payload: {
        taskType: "TEXT_IMAGE",
        textToImageParams: { text: prompt },
        imageGenerationConfig: { numberOfImages: 1, quality: "premium", width: 1024, height: 1024 }
      },
      extractImage: (res: any) => res.images?.[0]
    },
    {
      id: "amazon.titan-image-generator-v2:0",
      payload: {
        taskType: "TEXT_IMAGE",
        textToImageParams: { text: prompt },
        imageGenerationConfig: { numberOfImages: 1, quality: "premium", width: 1024, height: 1024 }
      },
      extractImage: (res: any) => res.images?.[0]
    }
  ];

  for (const model of models) {
    try {
      console.log(`Tentando gerar imagem no AWS Bedrock com o modelo ${model.id}...`);
      const command = new InvokeModelCommand({
        modelId: model.id,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(model.payload),
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const base64Image = model.extractImage(responseBody);

      if (base64Image) {
        console.log(`Imagem gerada com SUCESSO usando o modelo ${model.id}!`);
        return base64Image;
      }
    } catch (error: any) {
      console.warn(`Modelo ${model.id} indisponível ou falhou:`, error.message || error);
    }
  }

  // Caso todos falhem, aciona o fallback local estático (que no frontend tentará usar o SVG customizado)
  console.warn("Todos os modelos de imagem da AWS falharam. Ativando contingência de blueprint local.");
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('door') || lowerPrompt.includes('gate') || lowerPrompt.includes('porta') || lowerPrompt.includes('window') || lowerPrompt.includes('janela') || lowerPrompt.includes('glass') || lowerPrompt.includes('abertura')) {
    return '/Nexus Empresas/Dante Projetos.png';
  }
  if (lowerPrompt.includes('machine') || lowerPrompt.includes('equipment') || lowerPrompt.includes('máquina') || lowerPrompt.includes('peça') || lowerPrompt.includes('device') || lowerPrompt.includes('iot') || lowerPrompt.includes('estrutura')) {
    return '/Nexus Empresas/Dante Builder.png';
  }
  return '/Nexus Empresas/Dante Projetos.png';
}

