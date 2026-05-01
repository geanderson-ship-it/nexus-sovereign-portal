import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

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

export async function getCurrentWeather(city: string): Promise<CurrentWeather> {
  const res = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
      lang: 'pt_br',
    },
  });

  return {
    temp: Math.round(res.data.main.temp),
    feels_like: Math.round(res.data.main.feels_like),
    description: res.data.weather[0].description,
    humidity: res.data.main.humidity,
    city: res.data.name,
    country: res.data.sys.country,
  };
}

export async function getForecast(city: string): Promise<ForecastDay[]> {
  const res = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
      lang: 'pt_br',
      cnt: 8, // next 24h in 3h intervals
    },
  });

  // Group by day and get min/max
  const dayMap = new Map<string, ForecastDay>();

  for (const item of res.data.list) {
    const date = item.dt_txt.split(' ')[0];
    const temp = Math.round(item.main.temp);
    const rainProb = Math.round((item.pop || 0) * 100);

    if (!dayMap.has(date)) {
      dayMap.set(date, {
        date,
        min: temp,
        max: temp,
        description: item.weather[0].description,
        rain_probability: rainProb,
      });
    } else {
      const day = dayMap.get(date)!;
      day.min = Math.min(day.min, temp);
      day.max = Math.max(day.max, temp);
      if (rainProb > day.rain_probability) {
        day.rain_probability = rainProb;
        day.description = item.weather[0].description;
      }
    }
  }

  return Array.from(dayMap.values()).slice(0, 3);
}
