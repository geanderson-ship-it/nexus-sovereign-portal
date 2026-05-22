import { StationConfig } from '@/lib/announcer';

export interface TokenWeatherData {
  temp?: number | null;
  humidity?: number | null;
  description?: string;
  forecast?: Array<{ description: string; min: number; max: number }>;
}

/**
 * Formata a hora no estilo rádio brasileiro profissional:
 * - "9 em ponto"
 * - "9 e 15"
 * - "20 para as 9" (quando minutos > 30)
 */
function formatHoraRadio(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();

  if (m === 0) {
    return `${h} ${h === 1 ? 'hora' : 'horas'} em ponto`;
  }

  if (m <= 30) {
    return `${h} e ${m}`;
  }

  // Ex: 8:40 → "20 para as 9"
  const remaining = 60 - m;
  const nextHour = h + 1;
  return `${remaining} para as ${nextHour}`;
}

/**
 * Retorna "Bom dia", "Boa tarde" ou "Boa noite" baseado na hora atual.
 */
function getSaudacao(date: Date): string {
  const h = date.getHours();
  if (h >= 0 && h < 12) return 'Bom dia';
  if (h >= 12 && h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Formata a data em português: "quinta-feira, 21 de maio"
 */
function formatData(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Resolve todos os tokens dinâmicos num texto de script antes de enviar à síntese de voz.
 *
 * Tokens suportados:
 * {{HORA}}           → "20 para as 9" / "9 em ponto" / "9 e 15"
 * {{HORA_CURTA}}     → "08h40"
 * {{DATA}}           → "quinta-feira, 21 de maio"
 * {{SAUDACAO}}       → "Bom dia" / "Boa tarde" / "Boa noite"
 * {{TEMP}}           → "22 graus"
 * {{UMIDADE}}        → "65%"
 * {{PREVISAO_HOJE}}  → "céu nublado com chuva à tarde"
 * {{PREVISAO_AMANHA}}→ "ensolarado, máxima de 26 graus"
 * {{CIDADE}}         → nome da cidade da estação
 * {{EMISSORA}}       → nome da emissora
 * {{FREQUENCIA}}     → frequência da emissora
 * {{SLOGAN}}         → slogan da emissora
 */
export function resolveTokens(
  text: string,
  station: StationConfig,
  weather?: TokenWeatherData,
  manualTemp?: number | null,
): string {
  const now = new Date();

  const replacements: Record<string, string> = {
    '{{HORA}}': formatHoraRadio(now),
    '{{HORA_CURTA}}': `${now.getHours().toString().padStart(2, '0')}h${now.getMinutes().toString().padStart(2, '0')}`,
    '{{DATA}}': formatData(now),
    '{{SAUDACAO}}': getSaudacao(now),

    // Temperatura: prioriza manual, depois API
    '{{TEMP}}': (() => {
      const t = manualTemp != null ? manualTemp : (weather?.temp ?? '--');
      return `${t} graus`;
    })(),
    '{{UMIDADE}}': weather?.humidity != null ? `${weather.humidity}%` : '--',

    // Previsão do tempo
    '{{PREVISAO_HOJE}}': (() => {
      const f = weather?.forecast?.[0];
      if (!f) return 'sem previsão disponível';
      return `${f.description}, mínima de ${f.min} e máxima de ${f.max} graus`;
    })(),
    '{{PREVISAO_AMANHA}}': (() => {
      const f = weather?.forecast?.[1];
      if (!f) return 'sem previsão disponível';
      return `${f.description}, mínima de ${f.min} e máxima de ${f.max} graus`;
    })(),

    // Identidade da estação
    '{{CIDADE}}': station.city || 'nossa cidade',
    '{{EMISSORA}}': station.name,
    '{{FREQUENCIA}}': station.frequency,
    '{{SLOGAN}}': station.slogan || 'A sua rádio favorita',
  };

  let resolved = text;
  for (const [token, value] of Object.entries(replacements)) {
    // Substituição global — mesmo token pode aparecer várias vezes
    resolved = resolved.split(token).join(value);
  }

  return resolved;
}
