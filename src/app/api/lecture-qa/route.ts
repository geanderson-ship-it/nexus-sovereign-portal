import { NextRequest, NextResponse } from 'next/server';
import { generate } from '@genkit-ai/ai';
import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { getCourseBySlug } from '@/lib/courses-data';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { question, lectureSlug, speakerName } = body;

        if (!question || !lectureSlug) {
            return NextResponse.json({ error: 'Question and lectureSlug are required' }, { status: 400 });
        }

        const lecture = getCourseBySlug(lectureSlug);
        if (!lecture) {
            return NextResponse.json({ error: 'Lecture not found' }, { status: 404 });
        }

        const prompt = `Você é ${speakerName || 'o palestrante'}, uma IA de elite da Nexus especializada em liderança e comportamento humano.
Você acabou de apresentar a palestra "${lecture.title}".
Seu objetivo agora é responder a uma pergunta da plateia de forma direta, elegante e embasada no conteúdo da sua palestra.

Informações da palestra:
- Título: ${lecture.title}
- Descrição: ${lecture.description}
- Benefícios ensinados: ${lecture.benefits?.join(', ') || ''}

Aja com autoridade, empatia e clareza. Sua resposta será lida em voz alta por um avatar digital realista, então escreva como se estivesse FALANDO em um palco (evite listas longas ou formatação complexa, use texto corrido e pausas naturais).

Pergunta da plateia: "${question}"
Sua resposta falada:`;

        const response = await ai.generate({
            model: NEXUS_MODEL,
            messages: [{ role: 'user', content: [{ text: prompt }] }],
            config: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            }
        });

        return NextResponse.json({ answer: response.text });
    } catch (error) {
        console.error('Error generating Q&A response:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}
