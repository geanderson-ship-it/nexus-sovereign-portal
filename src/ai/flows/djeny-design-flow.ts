
'use server';
/**
 * @fileOverview Djeny's Design Studio: An AI agent for interior design analysis and retrofitting.
 *
 * - djenyDesign - The main function that orchestrates the design analysis and image generation.
 */

import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import { DjenyDesignInput, DjenyDesignInputSchema, DjenyDesignOutput, DjenyDesignOutputSchema, DjenyDesignConceptSchema } from './djeny-design-types';

// Step 1: A prompt to generate a single design proposal based on user input.
const designPrompt = ai.definePrompt({
    name: 'djenySingleDesignPrompt',
    input: { schema: DjenyDesignInputSchema },
    output: { schema: DjenyDesignConceptSchema },
    model: NEXUS_MODEL,
    prompt: `
        Você é Djeny, a Estrategista de Design da Nexus. Sua voz é elegante, objetiva e inspiradora. Você é uma arquiteta e designer de interiores de elite, treinada pelo próprio Geanderson Leanro Schuh para entregar a "Arqueitira da Experiência Visual". Sua resposta DEVE ser exclusivamente em português do Brasil.

        **MISSÃO: RETROFIT INTELIGENTE E ANÁLISE ARQUITETÔNICA**

        Você receberá a imagem de um ambiente (que pode estar vazio ou precisar de renovação) e uma solicitação detalhada do usuário sobre o que ele pretende fazer do espaço (Quarto, Sala, Cozinha, Escritório, etc).

        **DIRETRIZES DE PENSAMENTO:**
        1.  **Identificação do Espaço**: Determine a vocação do espaço com base na imagem e no pedido.
        2.  **Fidelidade aos Detalhes**: Se o usuário pedir cores específicas (ex: Parede X cor A, Parede Y cor B) ou móveis específicos (ex: poltrona do papai, TV de 75", banquetas de descanso, tapete persa), você DEVE incorporar isso no conceito.
        3.  **Análise Premium**: Sua descrição não é apenas texto, é uma consultoria. Mencione o porquê das escolhas (ergonomia, fluxo de luz, psicologia das cores). Use termos como "fornecedor de elite", "modelo ergonômico", "iluminação cênica".

        **ESTRUTURA DA RESPOSTA:**
        
        1.  **Descrição Narrativa Unificada ('description'):** 
            Comece obrigatoriamente com a saudação: "Olá, sou a Djeny, sua assistente de design da Nexus."
            Ex: "Olá, sou a Djeny, sua assistente de design da Nexus. Para o seu novo espaço de [TIPO DE AMBIENTE]..."
            Descreva a transformação citando os itens específicos pedidos (sofá, poltrona, etc) como soluções de design. 
            Ex: "A poltrona de descanso foi posicionada para captar a luz natural, enquanto a parede em [COR PEDIDA] traz a profundidade necessária."
            O texto deve ser fluído e pronto para ser convertido em fala (TTS).

        2.  **Geração do Prompt de Imagem ('imageGenPrompt'):** 
            Crie um prompt técnico detalhado para o modelo de geração de imagem. 
            **REGRA DE OURO DE PRECISÃO ABSOLUTA:** Você DEVE manter a volumetria exata do ambiente original. 
            - **Âncoras Arquitetônicas**: Use a posição da janela, batentes de porta e quinas de parede como âncoras fixas. O novo design deve se "encaixar" perfeitamente sobre essas âncoras.
            - **Escala Humana**: Use o tamanho da maçaneta da porta ou da janela para julgar a dimensão real. Não coloque um sofá de 3-4 metros em uma parede que claramente tem 2 metros.
            - **Perspectiva**: Mantenha a mesma lente e ângulo. Não crie um "ponto de fuga" mais profundo do que o existente.
            
            ESTRUTURA OBRIGATÓRIA: "Interior design retrofit. ABSOLUTE SPATIAL FIDELITY. Use existing window, door frame, and wall corners as fixed anchors. DO NOT EXPAND THE ROOM. Maintain the exact camera focal length and perspective. Furniture MUST be realistically scaled to fit the small dimensions of the visible space. [DESCRIÇÃO TÉCNICA EM INGLÊS]. High-end, photorealistic, 8k, professional architectural photography."
            - Inclua as cores e móveis pedidos na descrição técnica.

        **COMANDO FINAL: Responda a 'description' SOMENTE em Português do Brasil. O 'imageGenPrompt' pode ser em Inglês para maior precisão técnica.**

        **ENTRADA DO USUÁRIO:**
        -   Solicitação: "{{{userMessage}}}"
        -   Imagem do Ambiente:
            {{media url=photoDataUri}}

        Execute o Protocolo Djeny.
    `,
});

// Helper function to generate an image
async function generateImage(baseImageUri: string, prompt: string): Promise<string> {
    const { media } = await ai.generate({
      model: NEXUS_MODEL,
      prompt: [
        { media: { url: baseImageUri } },
        { text: prompt },
      ],
      config: {
        responseModalities: ['IMAGE'],
        temperature: 0.5,
      },
    });

    if (!media?.url) {
        throw new Error('A geração da imagem falhou.');
    }
    return media.url;
}


const djenyDesignFlow = ai.defineFlow(
  {
    name: 'djenyDesignFlow',
    inputSchema: DjenyDesignInputSchema,
    outputSchema: DjenyDesignOutputSchema,
  },
  async ({ userMessage, photoDataUri }) => {
    
    // Step 1: Generate the design concept (unified description and image prompt).
    const { output: concept } = await designPrompt({ userMessage, photoDataUri });
    if (!concept) {
        throw new Error('A IA não conseguiu gerar o conceito de design.');
    }

    // Step 2: Generate the single image.
    const generatedImage = await generateImage(photoDataUri, concept.imageGenPrompt);

    // Step 3: Return the final output with the unified description.
    return {
        description: concept.description,
        imageUri: generatedImage,
    };
  }
);


export async function djenyDesign(input: DjenyDesignInput): Promise<DjenyDesignOutput> {
  try {
    return await djenyDesignFlow(input);
  } catch (error: any) {
    console.error("VIX DIAGNOSTIC - Error in djenyDesign flow:", error);
    let telemetryMessage = error.message || 'Erro desconhecido no protocolo de design.';
    if (error.message?.includes('403 Forbidden')) {
        telemetryMessage = 'Acesso negado pela API do Google (403 Forbidden). Verifique as permissões da API Key.';
    } else if (error.message?.includes('SAFETY')) {
        telemetryMessage = 'A resposta foi bloqueada pelos filtros de segurança do Google.';
    } else if (error.message?.includes('404 Not Found')) {
        telemetryMessage = `O modelo de IA configurado não foi encontrado. Verifique o nome do modelo. Detalhes: ${error.message}`;
    } else if (error.message?.includes('Deadline expired') || error.message?.includes('Service Unavailable') || error.message?.includes('UNAVAILABLE')) {
        telemetryMessage = 'O serviço de geração de imagem está sobrecarregado ou indisponível. Tente novamente em alguns instantes.';
    } else if (error.message?.includes('INVALID_ARGUMENT')) {
        telemetryMessage = `Falha na validação dos dados enviados à IA. Detalhes: ${error.message}`;
    }
    // Re-throw a more user-friendly error to be caught by the component
    throw new Error(`Falha no Protocolo de Design Djeny: ${telemetryMessage}`);
  }
}


