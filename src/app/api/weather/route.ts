import { NextRequest, NextResponse } from 'next/server';
import { getCurrentWeather, getForecast } from '@/lib/weather';

// Simple in-memory cache (per process)
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'Cidade é obrigatória.' }, { status: 400 });
  }

  const cacheKey = city.toLowerCase();
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const [current, forecast] = await Promise.all([
      getCurrentWeather(city),
      getForecast(city),
    ]);

    const data = { current, forecast };
    cache.set(cacheKey, { data, ts: Date.now() });

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error('[Weather API Error]', err);
    const message = err instanceof Error ? err.message : 'Erro ao buscar clima.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
