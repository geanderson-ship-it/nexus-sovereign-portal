import { NextRequest, NextResponse } from 'next/server';
import { bedrockClient } from '@/lib/bedrock-client';
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let text = '';
  let sourceLanguage = 'Detectar Automático';
  let targetLanguage = 'Português';
  
  try {
    const body = await req.json();
    text = body.text;
    sourceLanguage = body.sourceLanguage || 'Detectar Automático';
    targetLanguage = body.targetLanguage || 'Português';
  } catch (err) {
    return NextResponse.json({ error: 'Formato JSON inválido.' }, { status: 400 });
  }

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Texto inválido para tradução.' }, { status: 400 });
  }

  const systemPrompt = `Você é o Tradutor Soberano da Nexus, um sistema de tradução de elite com inteligência artificial de nível profissional.
Seu papel é traduzir o texto fornecido pelo usuário para o idioma: ${targetLanguage}.
Siga estas regras estritamente:
1. Traduza o texto mantendo a máxima fidelidade ao significado original, com tom corporativo, polido e natural.
2. Preserve a formatação do texto original, incluindo parágrafos, espaços, marcadores e quebras de linha.
3. Se o texto contiver termos técnicos ou jargões de negócios (como GovTech, Sandbox, B2B, On-Premise), mantenha-os como estão no mercado se for mais comum, ou traduza de forma inteligente.
4. Você NÃO DEVE responder ao texto, explicar regras ou dar notas. Retorne APENAS a tradução direta do texto fornecido. Nada mais.`;

  try {
    const modelId = "us.anthropic.claude-sonnet-4-5-20250929-v1:0";
    const command = new ConverseCommand({
      modelId,
      messages: [
        {
          role: "user",
          content: [{ text: `Idioma de origem sugerido: ${sourceLanguage}\n\nTexto a traduzir:\n${text}` }]
        }
      ],
      system: [{ text: systemPrompt }],
      inferenceConfig: {
        maxTokens: 4000,
        temperature: 0.1,
      }
    });

    const response = await bedrockClient.send(command);
    const translation = response.output?.message?.content?.[0]?.text || '';
    return NextResponse.json({ translation });

  } catch (error: any) {
    console.error('[API /api/translate] Erro na tradução com Claude 4.5:', error);
    
    // Fallback: tenta rodar com Claude 3.5 Sonnet
    try {
      const fallbackModelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";
      console.log(`[API /api/translate] Tentando fallback com ${fallbackModelId}...`);
      
      const fallbackCommand = new ConverseCommand({
        modelId: fallbackModelId,
        messages: [
          {
            role: "user",
            content: [{ text: `Idioma de origem sugerido: ${sourceLanguage}\n\nTexto a traduzir:\n${text}` }]
          }
        ],
        system: [{ text: systemPrompt }],
        inferenceConfig: {
          maxTokens: 4000,
          temperature: 0.1,
        }
      });

      const response = await bedrockClient.send(fallbackCommand);
      const translation = response.output?.message?.content?.[0]?.text || '';
      return NextResponse.json({ translation });

    } catch (innerError: any) {
      console.error('[API /api/translate] Erro também no fallback:', innerError);
      return NextResponse.json({ error: error.message || 'Erro durante a tradução.' }, { status: 500 });
    }
  }
}
