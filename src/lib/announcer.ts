import { CurrentWeather, ForecastDay } from './weather';

export interface StationConfig {
  name: string;
  frequency: string;
  city: string;
  slogan?: string;
}

function numberToWords(n: number): string {
  const ones = ['', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
    'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta'];

  if (n < 20) return ones[n];
  if (n < 60) {
    const ten = Math.floor(n / 10);
    const one = n % 10;
    return one === 0 ? tens[ten] : `${tens[ten]} e ${ones[one]}`;
  }
  return String(n);
}

function formatHour(hour: number): string {
  if (hour === 0) return 'meia-noite';
  if (hour === 12) return 'meio-dia';
  const h = numberToWords(hour);
  return hour === 1 ? `uma hora` : `${h} horas`;
}

function formatMinutes(min: number): string {
  if (min === 0) return '';
  if (min === 30) return ' e meia';
  if (min === 15) return ' e um quarto';
  if (min === 45) return ' e quarenta e cinco minutos';
  return ` e ${numberToWords(min)} minutos`;
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

  const timeStr = `${formatHour(hour)}${formatMinutes(min)} ${period}`;

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
  const period = getPeriod(hour);
  const greeting = getGreeting(hour);
  const timeStr = `${formatHour(hour)} ${period}`;
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
  return `${text} — Uma mensagem da ${station.name}, ${station.frequency}.`;
}
