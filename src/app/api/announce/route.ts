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
  // O usuário deseja usar os roteiros fixos programados em lib/announcer.ts em vez do Bedrock.
  return null;
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
