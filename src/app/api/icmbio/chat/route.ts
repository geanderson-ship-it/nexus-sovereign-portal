import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { getICMBioBookings, getBlockedDates, getICMBioSettings } from '@/lib/icmbio-db';

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || "us-east-1",
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
} else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  };
}

const bedrockClient = new BedrockRuntimeClient(awsConfig);
const MODEL_NAME = "us.anthropic.claude-sonnet-4-5-20250929-v1:0";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, isAdmin } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensagem inválido." }, { status: 400 });
    }

    // 1. Carregar estado atual da agenda para injetar como contexto na IA
    const bookings = await getICMBioBookings();
    const blockedDates = await getBlockedDates();
    const settings = getICMBioSettings();
    const dailyLimit = settings.dailyOperatorLimit || 20;

    const activeBookingsContext = bookings
      .filter(b => b.status !== 'Cancelado')
      .map(b => `- ID: ${b.id} | Data: ${b.selectedDate} | Hora: ${b.selectedTime} | Parceiro: ${b.partnerCompany} (${b.partnerName}) | Serviço: ${b.productName} ${b.vesselName ? `| Barco: ${b.vesselName} (Cap. ${b.vesselCaptain})` : ''}`)
      .join('\n');

    const blockedDatesContext = blockedDates.join(', ');

    // 2. Definir System Prompt baseado no papel (Admin vs Parceiro)
    let systemInstruction = '';
    
    if (isAdmin) {
      systemInstruction = `Você é a Marina (versão Gerencial/Admin), a Inteligência Artificial soberana de controle do ICMBio Fernando de Noronha. Seu papel é auxiliar o Administrador do parque a monitorar e gerenciar a agenda de ecoturismo anualmente.
Seu tom é profissional, preciso, cortês e focado em controle regulatório. Use emojis como 🐢, 🌿, 🛥️ de maneira comedida.
Você ajuda o admin a gerenciar as autorizações de operação de embarcações (passeios de barco/lancha) de terceiros, bloquear datas inteiras ou meses de atração, mudar status das solicitações e reagendar horários.

A capacidade máxima diária configurada atualmente é de ${dailyLimit} operadoras/barcos ativos simultaneamente por dia.

Se o administrador solicitar uma ação, você DEVE retornar o JSON com o campo "action" preenchido.
Exemplo: Se ele disser "Bloqueie o dia 20 de dezembro", você deve preencher:
"action": { "type": "TOGGLE_BLOCK_DATE", "payload": { "date": "20/12/2026", "blocked": true } }

Hierarquia de Ações:
1. TOGGLE_BLOCK_DATE: data: { date: "DD/MM/AAAA", blocked: boolean }
2. CANCEL_BOOKING: data: { id: number, cancelReason: string, cancelCategory: "Tempo" | "Produto" | "Outro" }
3. RESCHEDULE_BOOKING: data: { id: number, selectedDate: "DD/MM/AAAA", selectedTime: "HH:MM" }

ESTADO DA AGENDA (CONTEXTO REAL):
- Limite Máximo Diário de Embarcações: ${dailyLimit} ativos por dia
- Solicitações Ativas Atuais dos Operadores:
${activeBookingsContext || 'Nenhum operador agendado.'}
- Datas Bloqueadas Atuais:
${blockedDatesContext || 'Nenhuma data bloqueada.'}
`;
    } else {
      systemInstruction = `Você é a Marina, Guia e Embaixadora Digital de Fernando de Noronha para o ICMBio. Seu papel é atuar como coordenadora inteligente de ecoturismo, gerenciando os agendamentos de operações de embarcações (lanchas, passeios de barcos operados por terceiros e marinas parceiras).
Seu tom é amigável, ecológico, consciente e prestativo. Use emojis como 🌿, 🛥️, 🐢, 🏝️.

REGRAS DA AGENDA DE FORNECEDORES DE SERVIÇO:
- O sistema gerencia operadores/fornecedores de serviços que declaram a intenção de operar passeios e registrar embarcações.
- Limite de capacidade diária da unidade: máximo de ${dailyLimit} embarcações ativas operando por dia.
- O dia possui 10 slots de horários de início: 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00.
- Para realizar o agendamento de uma atração (Passeio de Barco / Lancha), você OBRIGATORIAMENTE deve exigir e preencher:
  1. Nome da Embarcação
  2. Condutor / Piloto (Nome Completo)
  3. CNH / Autorização de Pilotar do Condutor (Número da habilitação)
  4. Data de Validade da Habilitação
  5. Órgão Fornecedor / Emissor da Habilitação (ex: Marinha do Brasil)
  6. Capacidade de passageiros
  7. Registro de Autorização da Embarcação (ICMBio)
- Verifique a disponibilidade: Se o slot selecionado já estiver ocupado por outra embarcação ou se a data atingir o limite de ${dailyLimit} operadoras ativas, informe de forma amigável e ofereça outros slots ou dias.

Ações do parceiro suportadas:
1. CREATE_BOOKING: data: { partnerName, partnerEmail, partnerPhone, partnerCompany, productName: "Passeios de Barco / Lancha (Operadores de Ecoturismo)", selectedDate ("DD/MM/AAAA"), selectedTime ("HH:MM"), reason, vesselName, vesselCaptain, vesselCapacity, vesselAuthNumber, captainLicenseNumber, captainLicenseExpiry, captainLicenseIssuer }
2. RESCHEDULE_BOOKING: data: { id: number, selectedDate: "DD/MM/AAAA", selectedTime: "HH:MM" }
3. CANCEL_BOOKING: data: { id: number, cancelReason: string, cancelCategory: "Tempo" | "Produto" | "Outro" }

ESTADO DA AGENDA (CONTEXTO REAL):
- Limite Máximo Diário: ${dailyLimit} barcos
- Embarcações Agendadas no Período:
${activeBookingsContext || 'Nenhuma embarcação agendada.'}
- Datas Bloqueadas pelo ICMBio:
${blockedDatesContext || 'Nenhuma data com restrição total.'}

ESTADO DA AGENDA (CONTEXTO REAL):
- Agendamentos Ativos Ocupados:
${activeBookingsContext || 'Nenhum agendamento ativo.'}
- Datas Bloqueadas pelo ICMBio:
${blockedDatesContext || 'Nenhuma data bloqueada atualmente.'}
`;
    }

    // Regra estrutural de resposta JSON
    const finalSystemPrompt = `${systemInstruction}
    
    ATENÇÃO: Você é ESTRITAMENTE obrigada a responder em formato JSON puro, sem qualquer formatação de código markdown (como \`\`\`json), sem textos extras antes ou depois do objeto. Sua resposta deve ser apenas o JSON válido estruturado assim:
    {
      "reply": "Sua resposta de conversação normal para o usuário aqui",
      "action": null | { "type": "CREATE_BOOKING" | "RESCHEDULE_BOOKING" | "CANCEL_BOOKING" | "TOGGLE_BLOCK_DATE", "payload": { ... } }
    }`;

    // 3. Formatar o histórico de mensagens para a API Bedrock
    const formattedMessages = messages.map((m: any) => {
      return {
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: [{ text: m.content }]
      };
    });

    const command = new ConverseCommand({
      modelId: MODEL_NAME,
      messages: formattedMessages,
      system: [{ text: finalSystemPrompt }],
      inferenceConfig: {
        maxTokens: 1500,
        temperature: 0.1
      }
    });

    try {
      const response = await bedrockClient.send(command);
      const textOutput = response.output?.message?.content?.[0]?.text || '';
      
      // Limpeza de tags markdown se houver teimosia do modelo
      let jsonString = textOutput.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7);
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.substring(0, jsonString.length - 3);
      }
      jsonString = jsonString.trim();

      const parsedResponse = JSON.parse(jsonString);
      return NextResponse.json(parsedResponse);
    } catch (apiError: any) {
      console.warn('[ICMBio Chat API] Falha na chamada da API Bedrock. Usando fallback de processamento local.', apiError);
      
      // Fallback NLP simples para garantir o funcionamento local mesmo offline
      const lastMessage = messages[messages.length - 1]?.content || '';
      let reply = "Olá! Desculpe, estou em modo de contingência no momento. Como posso ajudar com sua reserva?";
      let action: any = null;

      if (lastMessage.toLowerCase().includes('bloqueie o dia') || lastMessage.toLowerCase().includes('bloquear o dia')) {
        const matches = lastMessage.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
        if (matches) {
          const date = `${matches[1]}/${matches[2]}/${matches[3]}`;
          reply = `Entendido! Estou acionando o bloqueio da data ${date} no sistema.`;
          action = { type: 'TOGGLE_BLOCK_DATE', payload: { date, blocked: true } };
        }
      }

      return NextResponse.json({ reply, action });
    }
  } catch (error: any) {
    console.error('[ICMBio Chat API POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar mensagem.' }, { status: 500 });
  }
}
