import { NextRequest, NextResponse } from 'next/server';
import { ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient } from '@/ai/bedrock-client';

const MODEL_ID = 'amazon.nova-2-lite-v1:0';

export async function POST(req: NextRequest) {
  try {
    const { frames, fileName, userMessage } = await req.json();

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json({ error: 'Nenhum frame enviado.' }, { status: 400 });
    }

    console.log(`[analyze-frames] Analisando ${frames.length} frames de "${fileName}" usando ${MODEL_ID}...`);

    // Build multimodal content blocks for the Converse API
    const imageContent = frames.map((base64: string) => ({
      image: {
        format: 'jpeg' as const,
        source: {
          bytes: Buffer.from(base64, 'base64'),
        },
      },
    }));

    const prompt = `Você está analisando ${frames.length} frames extraídos de um vídeo chamado "${fileName || 'vídeo'}".
${userMessage ? `O usuário disse: "${userMessage}"` : ''}

Descreva o que você vê nos frames de forma natural e detalhada:
- Quem aparece (pessoas, rostos, expressões)
- O ambiente e cenário
- Elementos visuais relevantes (texto na tela, produtos, slides, etc.)
- O que está acontecendo / qual parece ser o contexto do vídeo
- Se houver apresentação ou demonstração de produto, descreva-a

Responda em português, de forma fluida e informativa.`;

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
            { text: prompt },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 1024,
        temperature: 0.1,
      },
    });

    const response = await bedrockClient.send(command);
    
    if (!response.output || !response.output.message || !response.output.message.content) {
      throw new Error("A resposta da AWS veio vazia.");
    }

    const description = response.output.message.content[0]?.text || '';

    console.log(`[analyze-frames] Análise concluída (${description.length} chars)`);

    return NextResponse.json({ description });

  } catch (error: any) {
    console.error('[API /analyze-frames] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao analisar os frames do vídeo.' },
      { status: 500 }
    );
  }
}
