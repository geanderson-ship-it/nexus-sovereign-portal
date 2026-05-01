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

export type AnnounceType = 'time' | 'temp' | 'forecast' | 'station-id' | 'next-track' | 'custom';

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
      case 'time':
        announcement = buildTimeAnnouncement(station, now);
        break;

      case 'temp': {
        const weather = await getCurrentWeather(station.city);
        announcement = buildTempAnnouncement(station, now, weather, manualTemp);
        break;
      }

      case 'forecast': {
        const [weather, forecast] = await Promise.all([
          getCurrentWeather(station.city),
          getForecast(station.city),
        ]);
        announcement = buildForecastAnnouncement(station, weather, forecast);
        break;
      }

      case 'station-id':
        announcement = buildStationId(station);
        break;

      case 'next-track':
        if (!artist || !song) {
          return NextResponse.json({ error: 'Artista e música são obrigatórios.' }, { status: 400 });
        }
        announcement = buildNextTrackAnnouncement(station, artist, song);
        break;

      case 'custom':
        if (!text) {
          return NextResponse.json({ error: 'Texto do anúncio é obrigatório.' }, { status: 400 });
        }
        announcement = buildCustomAnnouncement(station, text);
        break;

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
