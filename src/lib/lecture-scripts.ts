export type LectureScriptItem = {
  speaker: 'dante' | 'djeny';
  text: string;
  question?: string;
  audioUrl?: string;
};

export const lectureScripts: Record<string, LectureScriptItem[]> = {
  'comunicacao-que-conecta': Array.from({ length: 45 }).map((_, i) => ({
    speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante',
    text: `lectures.scripts.comunicacao-que-conecta.item${i}.text`,
    question: (i === 12 || i === 22 || i === 32 || i === 42) ? `lectures.scripts.comunicacao-que-conecta.item${i}.question` : undefined,
  })),
  'motivacao-e-engajamento': Array.from({ length: 45 }).map((_, i) => ({
    speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante',
    text: `lectures.scripts.motivacao-e-engajamento.item${i}.text`,
    question: (i === 12 || i === 22 || i === 32 || i === 42) ? `lectures.scripts.motivacao-e-engajamento.item${i}.question` : undefined,
  })),
  'inteligencia-emocional': Array.from({ length: 45 }).map((_, i) => ({
    speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante',
    text: `lectures.scripts.inteligencia-emocional.item${i}.text`,
    question: (i === 12 || i === 22 || i === 32 || i === 42) ? `lectures.scripts.inteligencia-emocional.item${i}.question` : undefined,
  })),
  'lideranca-humanizada': Array.from({ length: 45 }).map((_, i) => ({
    speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante',
    text: `lectures.scripts.lideranca-humanizada.item${i}.text`,
    question: (i === 12 || i === 22 || i === 32 || i === 42) ? `lectures.scripts.lideranca-humanizada.item${i}.question` : undefined,
  })),
  'seguranca-psicologica': Array.from({ length: 45 }).map((_, i) => ({
    speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante',
    text: `lectures.scripts.seguranca-psicologica.item${i}.text`,
    question: (i === 12 || i === 22 || i === 32 || i === 42) ? `lectures.scripts.seguranca-psicologica.item${i}.question` : undefined,
  })),
  'cultura-de-alta-performance': Array.from({ length: 45 }).map((_, i) => ({
    speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante',
    text: `lectures.scripts.cultura-de-alta-performance.item${i}.text`,
    question: (i === 12 || i === 22 || i === 32 || i === 42) ? `lectures.scripts.cultura-de-alta-performance.item${i}.question` : undefined,
  })),
  'gestao-de-conflitos': Array.from({ length: 45 }).map((_, i) => ({
    speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante',
    text: `lectures.scripts.gestao-de-conflitos.item${i}.text`,
    question: (i === 12 || i === 22 || i === 32 || i === 42) ? `lectures.scripts.gestao-de-conflitos.item${i}.question` : undefined,
  })),
  'nexus-intelligence-agro-design': Array.from({ length: 45 }).map((_, i) => ({
    speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante',
    text: `lectures.scripts.nexus-intelligence-agro-design.item${i}.text`,
    question: (i === 12 || i === 22 || i === 32 || i === 42) ? `lectures.scripts.nexus-intelligence-agro-design.item${i}.question` : undefined,
  })),
};
