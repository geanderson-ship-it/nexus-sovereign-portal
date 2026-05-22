import { CurrentWeather, ForecastDay } from './weather';

export interface StationConfig {
  name: string;
  frequency: string;
  city: string;
  slogan?: string;
  gender?: 'female' | 'male';
  bgMusicUrl?: string;
}

function formatSpokenTime(hour: number, min: number): string {
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;

  if (min === 0) {
    if (hour === 0) return 'meia-noite';
    if (hour === 12) return 'meio-dia';
    return hour === 1 || hour === 13 ? '1 hora' : `${displayHour} horas`;
  }

  if (min <= 30) {
    return `${displayHour} e ${min}`;
  }

  const diff = 60 - min;
  let nextHour = (hour + 1) % 12;
  if (nextHour === 0) nextHour = 12;
  
  if (nextHour === 1) {
    return `${diff} para a 1`;
  }
  return `${diff} para as ${nextHour}`;
}

function getPeriod(hour: number): string {
  if (hour >= 0 && hour < 5) return 'da madrugada';
  if (hour >= 5 && hour < 12) return 'da manhã';
  if (hour >= 12 && hour < 18) return 'da tarde';
  return 'da noite';
}

function getGreeting(hour: number): string {
  if (hour >= 0 && hour < 5) return 'Boa madrugada';
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

// Announcement: Time + Station ID (every 30 min)
export function buildTimeAnnouncement(station: StationConfig, now: Date): string {
  const hour = now.getHours();
  const min = now.getMinutes();
  const period = getPeriod(hour);
  const greeting = getGreeting(hour);

  const timeStr = `${formatSpokenTime(hour, min)} ${period}`;

  return `São ${timeStr}. Você está ouvindo a ${station.name}, ${station.frequency}. ${greeting}!`;
}

// Announcement: Time + Temperature (every hour)
export function buildTempAnnouncement(
  station: StationConfig,
  now: Date,
  weather: CurrentWeather,
  manualTemp?: number
): string {
  const hour = now.getHours();
  const min = now.getMinutes();
  const period = getPeriod(hour);
  const greeting = getGreeting(hour);
  const timeStr = `${formatSpokenTime(hour, min)} ${period}`;
  const temp = manualTemp !== undefined ? manualTemp : weather.temp;
  const desc = manualTemp !== undefined ? '' : `, com ${weather.description}`;

  return `São ${timeStr} na ${station.name}. A temperatura aqui em ${weather.city} está em ${temp} graus celsius${desc}. ${greeting}!`;
}

// Announcement: Weather forecast
export function buildForecastAnnouncement(station: StationConfig, weather: CurrentWeather, forecast: ForecastDay[]): string {
  const today = forecast[0];
  let text = `Previsão do tempo para ${weather.city}: ${today.description}, com mínima de ${today.min} graus e máxima de ${today.max} graus celsius.`;

  if (today.rain_probability >= 40) {
    text += ` Probabilidade de chuva de ${today.rain_probability} por cento.`;
  }

  if (forecast[1]) {
    const tomorrow = forecast[1];
    text += ` Para amanhã: ${tomorrow.description}, mínima de ${tomorrow.min} e máxima de ${tomorrow.max} graus.`;
  }

  text += ` Essa é a ${station.name}, ${station.frequency}. Fique bem informado!`;

  return text;
}

// Announcement: Station ID jingle
export function buildStationId(station: StationConfig): string {
  const options = [
    `${station.name}, ${station.frequency}. ${station.slogan || 'A sua rádio favorita'}.`,
    `Você está sintonizado na ${station.name}, ${station.frequency}.`,
    `${station.name} — ${station.frequency}. ${station.slogan || 'Sempre com você'}.`,
  ];
  return options[Math.floor(Math.random() * options.length)];
}

// Announcement: Next track
export function buildNextTrackAnnouncement(station: StationConfig, artist: string, song: string): string {
  const intros = [
    `A seguir,`,
    `Vem aí,`,
    `Continuando,`,
    `E agora,`,
  ];
  const intro = intros[Math.floor(Math.random() * intros.length)];
  return `${intro} ${artist} com ${song}. Aproveite e continue conosco na ${station.name}, ${station.frequency}.`;
}

// Announcement: Custom ad/text
export function buildCustomAnnouncement(station: StationConfig, text: string): string {
  return text;
}
