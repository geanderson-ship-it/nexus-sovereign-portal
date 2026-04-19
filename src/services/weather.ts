import type { WeatherForecast } from '@/ai/flows/dante-safra-types';
import fs from 'fs';
import path from 'path';

export async function getWeatherForecast(municipio: string, locale: string = 'pt-BR'): Promise<WeatherForecast> {
  console.log(`[Weather Service] Fetching live forecast for: ${municipio} (Locale: ${locale})`);
  
  // Load translations
  let translations: any = {};
  try {
    const localePath = path.join(process.cwd(), 'src/lib/locales', `${locale}.json`);
    if (fs.existsSync(localePath)) {
      translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    }
  } catch (e) {
    console.error("[Weather Service] Error loading translations:", e);
  }

  const t = (key: string) => translations[key] || key;
  
  try {
    // Open-Meteo geocoder works best with just the city name, without state codes.
    const cleanCityName = municipio.split(',')[0].split('-')[0].trim();
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCityName)}&language=${locale.split('-')[0]}&count=1`);
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(t('weather.outlook.error'));
    }
    
    const { latitude, longitude, name, admin1 } = geoData.results[0];
    
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FSao_Paulo&forecast_days=10`);
    const weatherData = await weatherResponse.json();
    
    const daily = weatherData.daily;
    const tenDayForecast = daily.time.map((timeStr: string, index: number) => {
      const date = new Date(timeStr + 'T12:00:00-03:00');
      const dayName = date.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '');
      
      const conditionCode = daily.weather_code[index];
      const condition = t(`weather.condition.${conditionCode}`) || t('weather.condition.unknown');
      
      return {
        day: dayName,
        maxTemp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        condition,
        rainChance: daily.precipitation_probability_max[index] || 0
      };
    });

    const totalRainProb = tenDayForecast.reduce((acc: number, curr: any) => acc + curr.rainChance, 0);
    const avgRainProb = totalRainProb / 10;
    
    let outlook = t("weather.outlook.normal");
    if (avgRainProb < 25) {
      outlook = t("weather.outlook.dry");
    } else if (avgRainProb > 65) {
      outlook = t("weather.outlook.rainy");
    }
    
    return {
      tenDayForecast,
      longTermOutlook: `${t('weather.analysis.title')} (${name}-${admin1}): ` + outlook
    };

  } catch (error) {
    console.error("[Weather Service] Error:", error);
    return {
      tenDayForecast: [],
      longTermOutlook: t("weather.outlook.error")
    };
  }
}
