
export type LectureScriptItem = {
  speaker: 'dante' | 'djeny';
  text: string;
  question?: string;
  audioUrl?: string;
};

export const lectureScripts: Record<string, LectureScriptItem[]> = {
  'comunicacao-que-conecta': Array.from({ length: 16 }).map((_, i) => ({
    speaker: i === 2 || i === 4 || i === 7 || i === 11 || i === 13 || i === 15 ? 'djeny' : 'dante',
    text: `lectures.scripts.comunicacao-que-conecta.item${i}.text`,
    question: [7, 8, 9, 10, 11].includes(i) ? `lectures.scripts.comunicacao-que-conecta.item${i}.question` : undefined,
  })),
  'motivacao-e-engajamento': Array.from({ length: 15 }).map((_, i) => ({
    speaker: i === 2 || i === 4 || i === 7 || i === 11 || i === 13 || i === 15 ? 'djeny' : 'dante',
    text: `lectures.scripts.motivacao-e-engajamento.item${i}.text`,
    question: [7, 8, 9, 10, 11].includes(i) ? `lectures.scripts.motivacao-e-engajamento.item${i}.question` : undefined,
  })),
  'inteligencia-emocional': Array.from({ length: 14 }).map((_, i) => ({
    speaker: i % 2 === 0 ? 'dante' : 'djeny',
    text: `lectures.scripts.inteligencia-emocional.item${i}.text`,
    question: i >= 7 && i <= 11 ? `lectures.scripts.inteligencia-emocional.item${i}.question` : undefined,
  })),
  'lideranca-humanizada': Array.from({ length: 15 }).map((_, i) => ({
    speaker: i % 2 === 0 ? 'dante' : 'djeny',
    text: `lectures.scripts.lideranca-humanizada.item${i}.text`,
    question: i >= 8 && i <= 12 ? `lectures.scripts.lideranca-humanizada.item${i}.question` : undefined,
  })),
  'seguranca-psicologica': Array.from({ length: 14 }).map((_, i) => ({
    speaker: i % 2 === 0 ? 'dante' : 'djeny',
    text: `lectures.scripts.seguranca-psicologica.item${i}.text`,
    question: i >= 7 && i <= 11 ? `lectures.scripts.seguranca-psicologica.item${i}.question` : undefined,
  })),
  'cultura-de-alta-performance': Array.from({ length: 15 }).map((_, i) => ({
    speaker: i % 2 === 0 ? 'dante' : 'dante' /* checking speakers... */,
    text: `lectures.scripts.cultura-de-alta-performance.item${i}.text`,
    question: i >= 8 && i <= 12 ? `lectures.scripts.cultura-de-alta-performance.item${i}.question` : undefined,
  })),
  'gestao-de-conflitos': Array.from({ length: 14 }).map((_, i) => ({
    speaker: i % 2 === 0 ? 'dante' : 'djeny',
    text: `lectures.scripts.gestao-de-conflitos.item${i}.text`,
    question: i >= 7 && i <= 11 ? `lectures.scripts.gestao-de-conflitos.item${i}.question` : undefined,
  })),
  'nexus-intelligence-agro-design': Array.from({ length: 15 }).map((_, i) => ({
    speaker: i % 2 === 0 ? 'dante' : 'djeny',
    text: `lectures.scripts.nexus-intelligence-agro-design.item${i}.text`,
    question: i >= 8 && i <= 12 ? `lectures.scripts.nexus-intelligence-agro-design.item${i}.question` : undefined,
  })),
};
