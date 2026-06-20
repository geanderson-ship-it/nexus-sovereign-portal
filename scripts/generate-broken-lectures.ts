import { generate } from '@genkit-ai/ai';
import fs from 'fs';

const envLocal = fs.readFileSync('.env.local', 'utf8');
envLocal.split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
});

import { ai, NEXUS_MODEL } from '../src/ai/genkit.ts';

const ptBRPath = './src/lib/locales/pt-BR.json';
let ptBR = JSON.parse(fs.readFileSync(ptBRPath, 'utf8'));

const brokenLectures = [
    { slug: 'lideranca-humanizada', title: 'Liderança Humanizada' },
    { slug: 'comunicacao-que-conecta', title: 'Comunicação Que Conecta' }
];

async function generateChunk(slug: string, title: string, startIdx: number, endIdx: number, previousContext: string) {
    console.log(`Generating ${title} - Chunk [${startIdx} to ${endIdx}]...`);
    
    let prompt = `Você é Dante, um palestrante corporativo focado em Alta Performance e Liderança, e está acompanhado da Djeny, sua parceira ágil e direta. Juntos, vocês estão entregando uma Masterclass Premium B2B intitulada "${title}".
    
    A palestra já começou e está em andamento. O conteúdo DEVE evoluir progressivamente, aprofundando o assunto com novos insights, cases práticos e estratégias de alto nível.
    CRÍTICO: NÃO REPITA AS MESMAS FRASES OU PARÁGRAFOS ANTERIORES. O CONTEÚDO DEVE SER 100% INÉDITO EM RELAÇÃO AO QUE JÁ FOI FALADO.
    
    ${previousContext ? `O que vocês falaram no trecho anterior foi:\n"""${previousContext}"""\n\nCONTINUE A PARTIR DAÍ. Não repita os pontos acima, aprofunde em novos ângulos e avance no tema da palestra.` : ''}

    O ritmo deve ser sério, engajador, com pausas estratégicas e insights profundos.
    O texto DEVE ser dividido em blocos de fala do item${startIdx} até o item${endIdx}. Cada bloco deve ter cerca de 80 a 100 palavras.
    Você NÃO precisa se preocupar em colocar o nome deles (Dante/Djeny) no texto. APENAS escreva o texto que será falado no formato JSON solicitado.
    
    Nos blocos 12, 22, 32 e 42, Dante faz uma pergunta profunda de reflexão direta para a plateia. Além do texto falado, você DEVE fornecer a chave "question" nestes blocos específicos.

    O TOM DEVE SER: Premium B2B, Sovereign, executivo, sem jargões baratos, altamente focado no fator humano e resultados duradouros. A palestra é CONTÍNUA.
    
    Você DEVE retornar APENAS um JSON válido contendo as chaves necessárias. Exemplo do formato:
    {
      "lectures.scripts.${slug}.item${startIdx}.text": "Texto do bloco ${startIdx}...",
      ...
      "lectures.scripts.${slug}.item12.text": "Texto do bloco 12...",
      "lectures.scripts.${slug}.item12.question": "Pergunta reflexiva curta",
      ...
      "lectures.scripts.${slug}.item${endIdx}.text": "Texto do bloco ${endIdx}..."
    }`;

    try {
        const response = await ai.generate({
            model: NEXUS_MODEL,
            messages: [{ role: 'user', content: [{ text: prompt }] }],
            config: {
                temperature: 0.5,
                maxOutputTokens: 8192
            }
        });

        const responseText = response.text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("JSON not found in response");
        
        const generatedData = JSON.parse(jsonMatch[0]);
        return generatedData;
        
    } catch (e) {
        console.error(`❌ Failed to generate chunk [${startIdx}-${endIdx}]:`, e);
        throw e;
    }
}

async function runLectures() {
    for (const lecture of brokenLectures) {
        let previousContext = `As introduções já foram feitas. Dante e Djeny falaram sobre os pilares da Nexus e como a tecnologia deles redefine a interação. Eles chamaram o conteúdo principal da palestra "${lecture.title}".`;
        
        const chunks = [
            { start: 3, end: 12 },
            { start: 13, end: 22 },
            { start: 23, end: 32 },
            { start: 33, end: 44 }
        ];

        let lectureData = {};

        for (const chunk of chunks) {
            const data = await generateChunk(lecture.slug, lecture.title, chunk.start, chunk.end, previousContext);
            lectureData = { ...lectureData, ...data };
            
            // Build context for next chunk
            previousContext = '';
            // Just take the last 3 items generated to give context of where we stopped
            for (let i = chunk.end - 2; i <= chunk.end; i++) {
                const text = data[`lectures.scripts.${lecture.slug}.item${i}.text`];
                if (text) previousContext += `Bloco ${i}: ${text}\n`;
            }
            
            // Wait to avoid rate limits
            await new Promise(r => setTimeout(r, 4000));
        }

        ptBR = { ...ptBR, ...lectureData };
        fs.writeFileSync(ptBRPath, JSON.stringify(ptBR, null, 2));
        console.log(`✅ Lecture ${lecture.title} completely generated and saved!`);
    }
    console.log("All broken lectures generated successfully!");
}

runLectures();
