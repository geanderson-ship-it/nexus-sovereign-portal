import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// ─── AWS BEDROCK CLIENT ───────────────────────────────────────────────────────
// Requires in .env.local:
//   AWS_ACCESS_KEY_ID=your_key
//   AWS_SECRET_ACCESS_KEY=your_secret
//   AWS_REGION=us-east-1 (or sa-east-1 for São Paulo)
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

// ─── RADIOLOGICAL ANALYSIS PROMPT ────────────────────────────────────────────
const buildPrompt = (examType: string, patientInfo: string) => `
You are an expert radiologist AI assistant. Analyze this medical image carefully.

Patient context: ${patientInfo}
Exam type: ${examType}

Perform a systematic radiological analysis and return a JSON object with this exact structure:
{
  "overallSeverity": <number 1-10>,
  "overallSummary": "<brief summary of main findings in Portuguese>",
  "urgency": "<NORMAL | MODERADO | CRÍTICO>",
  "findings": [
    {
      "id": <number>,
      "region": "<anatomical region in Portuguese>",
      "finding": "<description of finding in Portuguese>",
      "severity": <number 1-10>,
      "confidence": <number 50-99.9>,
      "type": "<NORMAL | MODERADO | CRÍTICO>",
      "detail": "<detailed clinical explanation in Portuguese, including recommendations>"
    }
  ],
  "recommendations": "<clinical recommendations in Portuguese>",
  "disclaimer": "Este laudo foi gerado por inteligência artificial e tem caráter auxiliar. Deve ser validado por médico especialista habilitado."
}

IMPORTANT:
- All text must be in Brazilian Portuguese
- Be clinically precise but accessible
- severity 1-3 = normal/minor, 4-6 = moderate, 7-10 = critical
- confidence reflects your certainty about each finding
- If image quality is poor, include that in findings
- Return ONLY the JSON object, no additional text
`;

// ─── API ROUTE ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Check credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'AWS_NOT_CONFIGURED', message: 'Credenciais AWS não configuradas. Adicione AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY no .env.local' },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const examType = (formData.get('examType') as string) ?? 'Raio-X';
    const patientName = (formData.get('patientName') as string) ?? 'Não informado';
    const patientDob = (formData.get('patientDob') as string) ?? 'Não informado';

    if (!file) {
      return NextResponse.json({ error: 'NO_IMAGE', message: 'Nenhuma imagem enviada.' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'INVALID_TYPE', message: 'Formato não suportado. Use JPEG, PNG, WebP ou TIFF.' }, { status: 400 });
    }

    // Validate file size (max 5MB for Bedrock)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'FILE_TOO_LARGE', message: 'Imagem muito grande. Máximo 5MB.' }, { status: 400 });
    }

    // Convert image to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

    const patientInfo = `Nome: ${patientName}, Data de nascimento: ${patientDob}`;

    // ─── Call AWS Bedrock — Claude 3.5 Sonnet (multimodal) ───────────────────
    const command = new InvokeModelCommand({
      modelId: 'us.anthropic.claude-sonnet-4-6',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: buildPrompt(examType, patientInfo),
              },
            ],
          },
        ],
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const content = responseBody.content[0].text;

    // Parse JSON from Claude response
    const analysisResult = JSON.parse(content);

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      meta: {
        model: 'us.anthropic.claude-sonnet-4-6',
        provider: 'AWS Bedrock',
        examType,
        analyzedAt: new Date().toISOString(),
      },
    });

  } catch (error: unknown) {
    console.error('[Nexus Health] Analysis error:', error);

    // Handle specific AWS errors
    const err = error as { name?: string; message?: string };
    if (err.name === 'AccessDeniedException') {
      return NextResponse.json(
        { error: 'AWS_ACCESS_DENIED', message: 'Acesso negado à AWS. Verifique as credenciais e permissões do Bedrock.' },
        { status: 403 }
      );
    }

    if (err.name === 'ValidationException') {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Erro de validação na requisição ao Bedrock.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'ANALYSIS_FAILED', message: 'Erro interno na análise. Tente novamente.' },
      { status: 500 }
    );
  }
}
