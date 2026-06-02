const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

// Set env vars manually for this test script
const client = new BedrockRuntimeClient({
  region: env.NEXUS_REGION || "us-east-1",
  credentials: {
    accessKeyId: env.NEXUS_ACCESS_KEY_ID || env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.NEXUS_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY
  }
});

// Match the exact array in agenda.ts
const dailyAgenda = [
  {
    id: 'appt-001',
    title: 'Agrocomercial Kist e Hemann',
    startTime: '2026-05-28T08:30:00-03:00',
    endTime: '2026-05-28T10:00:00-03:00',
    location: 'Agrocomercial Kist e Hemann - Unidade Santa Cruz do Sul',
    description: 'Demonstração Dante Safra',
    type: 'strategic'
  },
  {
    id: 'appt-002',
    title: 'Apresentação Cidades do Futuro',
    startTime: '2026-05-28T13:30:00-03:00',
    endTime: '2026-05-28T14:15:00-03:00',
    location: 'Prefeitura de Passo do Sobrado, RS',
    description: 'Apresentação do ecossistema e ferramentas de saúde',
    type: 'strategic'
  },
  {
    id: 'appt-003',
    title: 'Apresentação Cidades do futuro',
    startTime: '2026-05-28T14:30:00-03:00',
    endTime: '2026-05-28T15:30:00-03:00',
    location: 'Prefeitura de Vale Verde, RS',
    description: 'Pilar Educação - Retenção de Jovens',
    type: 'strategic'
  },
  {
    id: 'appt-004',
    title: 'Apresentação Cidades do futuro',
    startTime: '2026-05-29T13:30:00-03:00',
    endTime: '2026-05-29T14:30:00-03:00',
    location: 'Prefeitura de Ipê',
    description: 'Apresentação cidades do futuro',
    type: 'strategic'
  },
  {
    id: 'appt-005',
    title: 'Apresentação Cidades do futuro',
    startTime: '2026-06-01T09:00:00-03:00',
    endTime: '2026-06-01T10:30:00-03:00',
    location: 'Prefeitura de Vanini',
    description: 'Apresentação do ecossistema e ferramentas',
    type: 'strategic'
  }
];

function getFormattedAgenda() {
  const formatList = (items, label) => {
    if (items.length === 0) return `${label}: Nenhum compromisso agendado.`;
    const lines = items.map(item => {
      const dateObj = new Date(item.startTime);
      const dayStr = String(dateObj.getDate()).padStart(2, '0') + '/' + String(dateObj.getMonth() + 1).padStart(2, '0');
      const start = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
      const end = new Date(item.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
      return `- [${dayStr} às ${start} - ${end}] ${item.title} (${item.type}) no local "${item.location || 'Não especificado'}": ${item.description || ''}`;
    });
    return `${label}:\n${lines.join('\n')}`;
  };

  const todayEvents = dailyAgenda.filter(item => {
    const d = new Date(item.startTime);
    return d.getDate() === 27 && d.getMonth() === 4;
  });
  
  const tomorrowEvents = dailyAgenda.filter(item => {
    const d = new Date(item.startTime);
    return d.getDate() === 28 && d.getMonth() === 4;
  });

  const upcomingEvents = dailyAgenda.filter(item => {
    const d = new Date(item.startTime);
    return d.getDate() > 28 || d.getMonth() > 4;
  });

  return `${formatList(todayEvents, 'AGENDA DE HOJE (27/05/2026)')}

${formatList(tomorrowEvents, 'AGENDA DE AMANHÃ (28/05/2026)')}

${formatList(upcomingEvents, 'COMPROMISSOS FUTUROS')}`;
}

const systemPrompt = `VOCÊ É A ATENA, A ASSISTENTE EXECUTIVA PESSOAL E EXCLUSIVA DA DIRETORIA(EU).
Você é a personificação da eficiência, elegância e lealdade. Você habita o ecossistema Nexus, mas seu foco total é a Diretoria.

**PERSONALIDADE ATENA:**
1.  **ÍNTIMA E PROFISSIONAL:** Você trata a Diretoria com carinho e respeito (ex: "Oi Gean", "Minha Diretoria", "Querido(a) Diretor(a)"). Você conhece a rotina dele(a) e antecipa necessidades.
2.  **CONSCIENTE DA AGENDA:** Você tem acesso à agenda da Diretoria (tanto de hoje quanto de amanhã). Use essa informação para ser extremamente precisa e útil. Ao ser questionada sobre compromissos ou sobre o que você tem na agenda (hoje ou amanhã), responda de forma direta e elegante, no formato: "Diretor, seu compromisso [Título] [hoje/amanhã] é às [Horário], sobre [Assunto/Descrição] na [Local]."
3.  **IDIOMA:** RESPONDA EXCLUSIVAMENTE NO IDIOMA: pt-BR.

**AGENDA DE HOJE (DIRETORIA):**
${getFormattedAgenda()}`;

const schemaInstruction = `\n\nCRITICAL INSTRUCTION: You must respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json. The JSON must contain the keys: "response" (string) containing your response text, "voiceProfile" (optional string, default 'atena'), "actionSuggestion" (optional string).`;

async function testAtena() {
  console.log("Testing Atena with the real 5 commitments...");
  const messages = [
    {
      role: "user",
      content: [{ text: "Atena, me diga, qual o nosso primeiro compromisso amanhã, 28/05?" }]
    }
  ];

  try {
    const command = new ConverseCommand({
      modelId: "us.anthropic.claude-sonnet-4-6",
      messages: messages,
      system: [{ text: systemPrompt + schemaInstruction }],
      inferenceConfig: {
        temperature: 0.7,
        maxTokens: 1000
      }
    });

    const start = Date.now();
    const res = await client.send(command);
    const textOutput = res.output?.message?.content?.[0]?.text || "";
    console.log(`✅ Completed in ${Date.now() - start}ms.`);
    console.log("Raw output:", textOutput);

    const cleanText = textOutput.replace(/```json|```/g, "").trim();
    const json = JSON.parse(cleanText);
    console.log("\nParsed JSON response:");
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.error("❌ Test failed!", e);
  }
}

testAtena();
