import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { saveAtenaMemory, deleteAtenaMemory } from '@/lib/atena-db';

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || "us-east-1",
};

if (process.env.AMPLIFY_ACCESS_KEY_ID && process.env.AMPLIFY_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  };
} else if ((process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS) && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const bedrockClient = new BedrockRuntimeClient(awsConfig);
const MODEL_NAME = "us.anthropic.claude-sonnet-4-5-20250929-v1:0";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, transcripts, roomName, summary, id } = body;

    if (action === 'generate') {
      if (!transcripts || transcripts.length === 0) {
        return NextResponse.json({ error: "Transcrição vazia ou não fornecida." }, { status: 400 });
      }

      // Formatar a transcrição em um texto corrido
      const formattedTranscript = transcripts.map((t: any) => {
        const time = t.timestamp ? new Date(t.timestamp).toLocaleTimeString('pt-BR') : '';
        const sender = t.sender === 'gean' ? 'Diretor Geanderson (Nexus)' : 'Cliente/Participante Externo';
        return `[${time}] ${sender}: ${t.originalText} (Tradução: ${t.translatedText})`;
      }).join('\n');

      const systemPrompt = `Você é Atena, a Diretora de Inteligência Executiva da Nexus Holding. Seu papel é analisar a transcrição de uma reunião realizada no Nexus Vision e redigir uma ATA EXECUTIVA DE REUNIÃO estruturada e profissional.
Sua resposta deve conter apenas o código Markdown estruturado do relatório, contendo os seguintes tópicos:
1. **Título da Reunião & Data** (Atribua um título condizente com a discussão)
2. **Resumo Executivo** (Breve sumário dos objetivos e desdobramentos)
3. **Principais Tópicos Discutidos** (Detalhes dos pontos falados por cada parte)
4. **Decisões Consolidadas** (Acordos fechados durante a conversa)
5. **Próximos Passos (Next Steps)** (Plano de ação e tarefas pendentes, se houver)

Gere a resposta diretamente em Markdown limpo e profissional, sem introduções textuais como 'Aqui está a sua ata' ou saudações. Seja direta, assertiva e corporativa.`;

      const command = new ConverseCommand({
        modelId: MODEL_NAME,
        system: [{ text: systemPrompt }],
        messages: [
          {
            role: "user",
            content: [{ text: `Analise esta transcrição da sala "${roomName || 'Gabinete'}" e crie a ata:\n\n${formattedTranscript}` }]
          }
        ],
        inferenceConfig: {
          maxTokens: 2500,
          temperature: 0.2
        }
      });

      const response = await bedrockClient.send(command);
      const textBlocks = response.output?.message?.content?.filter((c: any) => c.text);
      const markdownSummary = textBlocks && textBlocks.length > 0 ? textBlocks.map((c: any) => c.text).join("\n") : "";

      if (!markdownSummary) {
        throw new Error("Não foi possível gerar o resumo através do Bedrock.");
      }

      return NextResponse.json({ summary: markdownSummary });

    } else if (action === 'save') {
      if (!summary) {
        return NextResponse.json({ error: "Resumo em branco." }, { status: 400 });
      }

      const contentPayload = JSON.stringify({
        roomName: roomName || 'Gabinete',
        summary: summary,
        transcripts: transcripts || []
      });

      const savedMemory = await saveAtenaMemory({
        userId: 'geanderson',
        categoria: 'vision-meeting',
        conteudo: contentPayload
      });

      if (!savedMemory) {
        throw new Error("Falha ao salvar no cérebro de longo prazo (DynamoDB).");
      }

      return NextResponse.json({ success: true, id: savedMemory.id });

    } else if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ error: "ID da ata não fornecido para exclusão." }, { status: 400 });
      }

      const deleted = await deleteAtenaMemory(id);
      if (!deleted) {
        throw new Error("Falha ao excluir ata do cérebro de longo prazo.");
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });

  } catch (error: any) {
    console.error("[VISION_SUMMARY_ERROR]:", error);
    return NextResponse.json({ error: error.message || "Erro interno no servidor." }, { status: 500 });
  }
}
