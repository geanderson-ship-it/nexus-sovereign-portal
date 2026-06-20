import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import fs from 'fs';
import path from 'path';

const client = new BedrockRuntimeClient({
    region: process.env.BEDROCK_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.BEDROCK_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.BEDROCK_SECRET_ACCESS_KEY
    }
});

const ptBRPath = './src/lib/locales/pt-BR.json';
let ptBR = JSON.parse(fs.readFileSync(ptBRPath, 'utf8'));

const lectures = [
    { slug: 'comunicacao-que-conecta', title: 'Comunicação Que Conecta' },
    { slug: 'motivacao-e-engajamento', title: 'Motivação e Engajamento' },
    { slug: 'inteligencia-emocional', title: 'Inteligência Emocional' },
    { slug: 'lideranca-humanizada', title: 'Liderança Humanizada' },
    { slug: 'seguranca-psicologica', title: 'Segurança Psicológica' },
    { slug: 'cultura-de-alta-performance', title: 'Cultura de Alta Performance' },
    { slug: 'gestao-de-conflitos', title: 'Gestão de Conflitos' },
    { slug: 'nexus-intelligence-agro-design', title: 'Nexus Intelligence: Agro Design' },
];

async function generateLecture(slug, title) {
    console.log(`Generating lecture: ${title}...`);
    
    const prompt = `Você é Dante, um palestrante corporativo focado em Alta Performance e Liderança, e está acompanhado da Djeny, sua parceira ágil e direta. Juntos, vocês entregarão uma Masterclass Premium B2B intitulada "${title}".
    
    A duração do áudio desta masterclass será de cerca de 35 minutos. O ritmo deve ser sério, engajador, com pausas estratégicas e insights profundos.
    O texto DEVE ser dividido em EXATAMENTE 45 blocos de fala (item0 a item44). Cada bloco deve ter cerca de 90 a 110 palavras.
    Dante é o palestrante principal. Djeny fala nos blocos múltiplos de 4 e 7 (ex: item4, item7, item8, item12, item14, etc.). Você NÃO precisa se preocupar em colocar o nome deles no texto, o sistema de áudio fará isso. APENAS escreva o texto que será falado.
    Nos blocos 10, 20, 30 e 40, Dante faz uma pergunta profunda de reflexão direta para a plateia. Além do texto falado (onde ele introduz a reflexão), você DEVE fornecer o texto da "pergunta na tela" nestes blocos específicos.

    O TOM DEVE SER: Premium B2B, Sovereign, executivo, sem jargões baratos, altamente focado no fator humano e resultados duradouros. Sem saudações clichês em todos os blocos; a palestra deve ser CONTÍNUA.
    
    Você DEVE retornar APENAS um JSON válido contendo as chaves necessárias. O JSON deve ter este formato EXATO, para ser injetado no pt-BR.json do sistema:
    {
      "lectures.scripts.${slug}.item0.text": "Texto do bloco 0...",
      "lectures.scripts.${slug}.item1.text": "Texto do bloco 1...",
      ...
      "lectures.scripts.${slug}.item10.text": "Texto do bloco 10, que introduz a pergunta de reflexão...",
      "lectures.scripts.${slug}.item10.question": "Pergunta reflexiva curta e direta para a plateia",
      ...
      "lectures.scripts.${slug}.item44.text": "Texto de encerramento do bloco 44..."
    }
    
    Gere todos os 45 blocos (0 a 44) e as 4 questions obrigatórias (10, 20, 30, 40). O JSON não deve conter markdown ou texto fora dele.`;

    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 8192,
        messages: [{ role: "user", content: prompt }]
    };

    const command = new InvokeModelCommand({
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload)
    });

    try {
        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        let responseText = responseBody.content[0].text;
        
        // Extract JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("JSON not found in response");
        
        const generatedData = JSON.parse(jsonMatch[0]);
        
        // Merge into pt-BR
        ptBR = { ...ptBR, ...generatedData };
        fs.writeFileSync(ptBRPath, JSON.stringify(ptBR, null, 2));
        console.log(`✅ Lecture ${title} generated and saved!`);
        
    } catch (e) {
        console.error(`❌ Failed to generate ${title}:`, e);
    }
}

async function runAll() {
    for (const lecture of lectures) {
        await generateLecture(lecture.slug, lecture.title);
        // Add a small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("All lectures generated successfully!");
}

runAll();
