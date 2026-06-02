import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const MODEL_ID = 'us.anthropic.claude-3-5-sonnet-20241022-v2:0';

export async function POST(req: NextRequest) {
  try {
    const { frames, fileName, userMessage } = await req.json();

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json({ error: 'Nenhum frame enviado.' }, { status: 400 });
    }

    console.log(`[analyze-frames] Analisando ${frames.length} frames de "${fileName}"...`);

    // Build multimodal content: images + instruction
    const imageContent = frames.map((base64: string) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/jpeg',
        data: base64,
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

    const body = JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          ...imageContent,
          { type: 'text', text: prompt },
        ],
      }],
    });

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: Buffer.from(body),
    });

    const response = await bedrock.send(command);
    const result = JSON.parse(Buffer.from(response.body).toString('utf-8'));
    const description = result?.content?.[0]?.text || '';

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
