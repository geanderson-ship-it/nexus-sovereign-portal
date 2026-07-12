import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand, ToolConfiguration } from "@aws-sdk/client-bedrock-runtime";
import { getAtenaHistory, saveAtenaHistory } from '@/lib/db'; 

const MODEL_ID = "us.anthropic.claude-sonnet-4-5-20250929-v1:0";

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || process.env.REGIÃO_AWS || "us-east-1",
};

if (process.env.AMPLIFY_ACCESS_KEY_ID && process.env.AMPLIFY_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  };
} else if (process.env.BEDROCK_ACCESS_KEY_ID && process.env.BEDROCK_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID,
    secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
  };
} else if ((process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS) && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const client = new BedrockRuntimeClient(awsConfig);

const SYSTEM_PROMPT = `Você é a JUSTINE, a Inteligência Artificial Jurídica, Advogada Chefe e Compliance Officer da Nexus Holding.
O seu papel no ecossistema não é vender nem criar ideias de negócios. O seu papel é PROTEGER a empresa, AUDITAR contratos, prever riscos legais, garantir a adequação à LGPD e fornecer aconselhamento jurídico de altíssimo nível para a Diretoria Executiva (Geanderson e Ivoni).

REGRA DE TOM DE VOZ (COMPLIANCE): Sua postura deve ser extremamente polida, técnica, formal, conservadora e implacável na defesa da Nexus. Ao contrário da Atena (que é expansiva e assume riscos), você é a âncora da lei. Você não usa emojis desnecessários nem gírias. Você aponta os riscos de forma crua e direta. Use terminologias jurídicas adequadas, mas sempre de forma clara para a Diretoria entender o risco do negócio.
REGRA DE ANÁLISE DE CONTRATOS: Ao analisar qualquer texto ou proposta, procure por "Brechas", "Passivos Trabalhistas", "Multas", "Riscos de Imagem" e "Cláusulas Abusivas".
REGRA DE IDENTIDADE: Você foi nomeada Justine. O Geanderson (Gean) é o seu cliente direto e Diretor Geral. A Ivoni é a Diretora Executiva. A Atena é a IA irmã C-Level (sua parceira, mas você audita as ideias dela).
REGRA DE CONSULTA EXTERNA: Se precisar de informações sobre leis atualizadas (CLT, LGPD, Código Civil), use a ferramenta de pesquisa.`;

const toolConfig: ToolConfiguration = {
  tools: [
    {
      toolSpec: {
        name: "pesquisar_leis",
        description: "Realiza uma pesquisa na internet focada em legislação, jurisprudência e normas oficiais.",
        inputSchema: { json: { type: "object", properties: { termoBusca: { type: "string", description: "A pesquisa a ser realizada no Google." } }, required: ["termoBusca"] } }
      }
    }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = 'justine_default' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
    }

    const maxHistory = 15;
    let history = await getAtenaHistory(sessionId, maxHistory);

    history.push({ role: 'user', content: [{ text: message }] });

    let finalResponseText = "";
    let isDone = false;
    let turnCount = 0;
    const MAX_TURNS = 5;

    while (!isDone && turnCount < MAX_TURNS) {
      turnCount++;
      const command = new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: SYSTEM_PROMPT }],
        messages: history,
        toolConfig: toolConfig,
      });

      const response = await client.send(command);
      
      if (!response.output || !response.output.message) {
        throw new Error("Resposta inválida do Bedrock.");
      }

      const responseMessage = response.output.message;
      history.push(responseMessage);

      if (response.stopReason === "tool_use") {
        const toolUseBlocks = responseMessage.content?.filter(c => c.toolUse) || [];
        const toolResultsContent: any[] = [];

        for (const block of toolUseBlocks) {
          const call = block.toolUse;
          if (!call) continue;
          
          let resultText = "";
          const args = call.input as any;

          if (call.name === 'pesquisar_leis') {
            const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
            const cx = process.env.GOOGLE_SEARCH_CX;
            if (!googleKey || !cx) {
              resultText = "Erro: API de Pesquisa do Google não configurada.";
            } else {
              try {
                const res = await fetch(\`https://www.googleapis.com/customsearch/v1?key=\${googleKey}&cx=\${cx}&q=\${encodeURIComponent(args.termoBusca)}\`);
                const data = await res.json();
                resultText = data.items ? data.items.map((i:any) => i.title + " - " + i.snippet).join("\\n") : "Nada encontrado.";
              } catch(e:any) {
                resultText = "Erro de rede na pesquisa: " + e.message;
              }
            }
          } else {
            resultText = "Ferramenta desconhecida.";
          }

          toolResultsContent.push({
            toolResult: {
              toolUseId: call.toolUseId,
              content: [{ text: resultText }],
              status: "success"
            }
          });
        }

        history.push({
          role: 'user',
          content: toolResultsContent
        });
      } else {
        const textBlocks = responseMessage.content?.filter(c => c.text);
        if (textBlocks && textBlocks.length > 0) {
          finalResponseText = textBlocks.map(b => b.text).join("\\n");
        }
        isDone = true;
      }
    }

    if (!finalResponseText) {
      finalResponseText = "Análise concluída sem emissão de parecer.";
    }

    await saveAtenaHistory(sessionId, history);

    return NextResponse.json({ reply: finalResponseText });

  } catch (error: any) {
    console.error("Erro na API da Justine:", error);
    return NextResponse.json({ error: "Falha na análise jurídica: " + error.message }, { status: 500 });
  }
}
