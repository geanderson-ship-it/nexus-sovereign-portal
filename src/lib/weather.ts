import axios from 'axios';

// Open-Meteo: 100% free, no API key needed
// WMO Weather codes mapped to Portuguese descriptions
const WMO_CODES: Record<number, string> = {
  0: 'céu limpo', 1: 'predominantemente limpo', 2: 'parcialmente nublado', 3: 'nublado',
  45: 'neblina', 48: 'neblina com geada',
  51: 'garoa leve', 53: 'garoa moderada', 55: 'garoa intensa',
  61: 'chuva leve', 63: 'chuva moderada', 65: 'chuva forte',
  71: 'neve leve', 73: 'neve moderada', 75: 'neve forte',
  80: 'pancadas de chuva', 81: 'chuva moderada', 82: 'chuva forte',
  95: 'trovoada', 96: 'trovoada com granizo', 99: 'trovoada com granizo forte',
};

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  description: string;
  humidity: number;
  city: string;
  country: string;
}

export interface ForecastDay {
  date: string;
  min: number;
  max: number;
  description: string;
  rain_probability: number;
}

// Location config — Encantado, RS coordinates
// If city name is provided, we still use these coords as default
// Future improvement: use a geocoding API to convert city name to coords
const LOCATIONS: Record<string, { lat: number; lon: number; name: string }> = {
  default: { lat: -29.23, lon: -51.87, name: 'Encantado' },
};

function getLocation(city: string) {
  // Always returns Encantado for now (or can be extended)
  return LOCATIONS.default;
}

export async function getCurrentWeather(city: string): Promise<CurrentWeather> {
  const loc = getLocation(city);

  const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: loc.lat,
      longitude: loc.lon,
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code',
      timezone: 'America/Sao_Paulo',
    },
  });

  const current = res.data.current;
  const code = current.weather_code as number;

  return {
    temp: Math.round(current.temperature_2m),
    feels_like: Math.round(current.apparent_temperature),
    description: WMO_CODES[code] || 'clima variável',
    humidity: current.relative_humidity_2m,
    city: loc.name,
    country: 'BR',
  };
}

export async function getForecast(city: string): Promise<ForecastDay[]> {
  const loc = getLocation(city);

  const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: loc.lat,
      longitude: loc.lon,
      daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max',
      timezone: 'America/Sao_Paulo',
      forecast_days: 4,
    },
  });

  const daily = res.data.daily;

  return daily.time.slice(1, 4).map((date: string, i: number) => {
    const idx = i + 1;
    const code = daily.weather_code[idx] as number;
    return {
      date,
      min: Math.round(daily.temperature_2m_min[idx]),
      max: Math.round(daily.temperature_2m_max[idx]),
      description: WMO_CODES[code] || 'clima variável',
      rain_probability: daily.precipitation_probability_max[idx] || 0,
    };
  });
}
