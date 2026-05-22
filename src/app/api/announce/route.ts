import { NextRequest, NextResponse } from 'next/server';
import {
  buildTimeAnnouncement,
  buildTempAnnouncement,
  buildForecastAnnouncement,
  buildStationId,
  buildNextTrackAnnouncement,
  buildCustomAnnouncement,
  StationConfig,
} from '@/lib/announcer';
import { getCurrentWeather, getForecast } from '@/lib/weather';
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient, BEDROCK_NEXUS_MODEL } from '@/ai/bedrock-client';

export type AnnounceType = 'time' | 'temp' | 'forecast' | 'station-id' | 'next-track' | 'custom';

async function generateAILocution(
  type: AnnounceType,
  station: StationConfig,
  extra: { artist?: string; song?: string; text?: string; temp?: number; description?: string; forecastText?: string }
): Promise<string | null> {
  try {
    const now = new Date();
    const hour = now.getHours();
    const period = hour >= 0 && hour < 5 ? 'madrugada' : 
                   hour >= 5 && hour < 12 ? 'manhã' : 
                   hour >= 12 && hour < 18 ? 'tarde' : 'noite';

    const announcerName = station.gender === 'male' ? 'Ricardo' : 'Camila';

    let promptContext = '';
    switch (type) {
      case 'time': {
        const timeText = `${hour}h${now.getMinutes().toString().padStart(2, '0')}`;
        promptContext = `A ação agora é informar a HORA CERTA. A hora atual exata é ${timeText}.`;
        break;
      }
      case 'temp': {
        promptContext = `A ação agora é informar a TEMPERATURA atual. A temperatura é de ${extra.temp}°C${extra.description ? ` com clima ${extra.description}` : ''} em ${station.city || 'nossa região'}.`;
        break;
      }
      case 'forecast': {
        promptContext = `A ação agora é informar a PREVISÃO DO TEMPO para hoje e amanhã. Dados meteorológicos: ${extra.forecastText}.`;
        break;
      }
      case 'station-id': {
        promptContext = `A ação agora é fazer a IDENTIFICAÇÃO DA RÁDIO (Station ID). Celebre a sintonia do ouvinte na emissora e reforce o nome da rádio.`;
        break;
      }
      case 'next-track': {
        promptContext = `A ação agora é anunciar a PRÓXIMA MÚSICA que vai tocar. Música: "${extra.song}" do artista/banda: "${extra.artist}". Crie uma transição animada e empolgante.`;
        break;
      }
      case 'custom': {
        promptContext = `A ação agora é ler um ANÚNCIO/MENSAGEM customizada. O texto de referência para você falar de forma ultra-natural é: "${extra.text}". Transmita essa mensagem de forma perfeita no seu estilo de locução.`;
        break;
      }
    }

    const systemPrompt = `Você é ${announcerName}, locutor principal de rádio ultra-charismático, alegre, expressivo e espontâneo na emissora "${station.name}" (Frequência: "${station.frequency}" - Slogan: "${station.slogan || 'O vale é 100'}").

ESTILO DE LOCUÇÃO INEGOCIÁVEL (Siga à risca):
1. Seja extremamente contagiante, alegre, bem-humorado, expressivo e "pra cima". Use expressões acolhedoras de rádio ao vivo do Brasil para alegrar o dia do ouvinte.
2. Atualmente é o período da ${period}. 
   - Se for MADRUGADA: Seu tom deve ser mais descontraído, companheiro, descolado e ligeiramente cômico, fazendo companhia carinhosa e alegre para quem está acordado na vigília.
   - Se for MANHÃ/TARDE/NOITE: Seja uma injeção de pura alegria, ânimo e energia contagiante na vida do ouvinte!
3. Diga sempre seu nome ("${announcerName}") ou faça referência à sua voz de forma natural e com muita personalidade.
4. Responda APENAS com a fala exata da locução que irá para o ar. Não inclua introduções, explicações, aspas externas ou marcações extras. Escreva exatamente o que vai ser lido.
5. Mantenha o texto dinâmico e curto (máximo de 2 a 3 frases rápidas), próprio para vinhetas rápidas de rádio.
6. NUNCA inclua ou repita assinaturas fixas, slogans ou mensagens promocionais da emissora no final da sua fala (tais como "Uma mensagem da Rádio Encanto FM..." ou "Sintonize 100.1 FM"). Apenas fale o conteúdo da locução e encerre de forma limpa e direta.`;

    const command = new ConverseCommand({
      modelId: BEDROCK_NEXUS_MODEL,
      messages: [
        {
          role: 'user',
          content: [{ text: `Crie a locução de rádio para o seguinte evento:\n${promptContext}` }]
        }
      ],
      system: [{ text: systemPrompt }],
      inferenceConfig: {
        temperature: 0.85,
        maxTokens: 500
      }
    });

    const response = await bedrockClient.send(command);
    if (response.output?.message?.content?.[0]?.text) {
      return response.output.message.content[0].text.trim();
    }
    return null;
  } catch (error) {
    console.error("VIX DIAGNOSTIC: Falha ao gerar locução com Bedrock. Acionando fallback clássico.", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, station, artist, song, text, manualTemp } = body as {
      type: AnnounceType;
      station: StationConfig;
      artist?: string;
      song?: string;
      text?: string;
      manualTemp?: number;
    };

    if (!type || !station) {
      return NextResponse.json({ error: 'Tipo e configuração da rádio são obrigatórios.' }, { status: 400 });
    }

    const now = new Date();
    let announcement = '';

    switch (type) {
      case 'time': {
        const aiText = await generateAILocution('time', station, {});
        if (aiText) {
          announcement = aiText;
        } else {
          announcement = buildTimeAnnouncement(station, now);
        }
        break;
      }

      case 'temp': {
        const weather = await getCurrentWeather(station.city);
        const temp = manualTemp !== undefined ? manualTemp : weather.temp;
        const description = weather.description;
        
        const aiText = await generateAILocution('temp', station, { temp, description });
        if (aiText) {
          announcement = aiText;
        } else {
          announcement = buildTempAnnouncement(station, now, weather, manualTemp);
        }
        break;
      }

      case 'forecast': {
        const [weather, forecast] = await Promise.all([
          getCurrentWeather(station.city),
          getForecast(station.city),
        ]);
        
        const today = forecast[0];
        let forecastText = `Hoje: ${today.description}, mínima de ${today.min} e máxima de ${today.max} graus celsius.`;
        if (forecast[1]) {
          const tomorrow = forecast[1];
          forecastText += ` Amanhã: ${tomorrow.description}, mínima de ${tomorrow.min} e máxima de ${tomorrow.max} graus.`;
        }

        const aiText = await generateAILocution('forecast', station, { forecastText });
        if (aiText) {
          announcement = aiText;
        } else {
          announcement = buildForecastAnnouncement(station, weather, forecast);
        }
        break;
      }

      case 'station-id': {
        const aiText = await generateAILocution('station-id', station, {});
        if (aiText) {
          announcement = aiText;
        } else {
          announcement = buildStationId(station);
        }
        break;
      }

      case 'next-track': {
        if (!artist || !song) {
          return NextResponse.json({ error: 'Artista e música são obrigatórios.' }, { status: 400 });
        }
        const aiText = await generateAILocution('next-track', station, { artist, song });
        if (aiText) {
          announcement = aiText;
        } else {
          announcement = buildNextTrackAnnouncement(station, artist, song);
        }
        break;
      }

      case 'custom': {
        if (!text) {
          return NextResponse.json({ error: 'Texto do anúncio é obrigatório.' }, { status: 400 });
        }
        const aiText = await generateAILocution('custom', station, { text });
        if (aiText) {
          announcement = aiText;
        } else {
          announcement = buildCustomAnnouncement(station, text);
        }
        break;
      }

      default:
        return NextResponse.json({ error: 'Tipo de anúncio desconhecido.' }, { status: 400 });
    }

    return NextResponse.json({ announcement });
  } catch (err: unknown) {
    console.error('[Announce API Error]', err);
    const message = err instanceof Error ? err.message : 'Erro ao gerar anúncio.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
