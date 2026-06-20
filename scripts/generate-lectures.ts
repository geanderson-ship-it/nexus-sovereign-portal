import { generate } from '@genkit-ai/ai';
import fs from 'fs';

const envLocal = fs.readFileSync('.env.local', 'utf8');
envLocal.split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
});

import { ai, NEXUS_MODEL } from '../src/ai/genkit';

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

    try {
        const response = await ai.generate({
            model: NEXUS_MODEL,
            messages: [{ role: 'user', content: [{ text: prompt }] }],
            config: {
                temperature: 0.4,
                maxOutputTokens: 8192
            }
        });

        const responseText = response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("JSON not found in response");
        
        const generatedData = JSON.parse(jsonMatch[0]);
        
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
        await new Promise(r => setTimeout(r, 5000));
    }
    console.log("All lectures generated successfully!");
}

runAll();
