const fs = require('fs');
const ptBRPath = 'src/lib/locales/pt-BR.json';
let ptBR = JSON.parse(fs.readFileSync(ptBRPath, 'utf8'));

const lectures = [
  { slug: 'comunicacao-que-conecta', title: 'Comunicação Que Conecta' },
  { slug: 'motivacao-e-engajamento', title: 'Motivação e Engajamento' },
  { slug: 'inteligencia-emocional', title: 'Inteligência Emocional' },
  { slug: 'lideranca-humanizada', title: 'Liderança Humanizada' },
  { slug: 'seguranca-psicologica', title: 'Segurança Psicológica' },
  { slug: 'cultura-de-alta-performance', title: 'Cultura de Alta Performance' },
  { slug: 'gestao-de-conflitos', title: 'Gestão de Conflitos' }
];

for (const lec of lectures) {
  const item0Key = `lectures.scripts.${lec.slug}.item0.text`;
  const item1Key = `lectures.scripts.${lec.slug}.item1.text`;
  
  let originalContent = ptBR[item0Key];
  originalContent = originalContent.replace(/^Olá,\s*sou\s*(Djeny|Dante)[\.,!]\s*/i, '');
  
  ptBR[item0Key] = `Olá, eu sou o Dante. Bem-vindos e bem-vindas à nossa Masterclass oficial sobre ${lec.title}. Neste encontro, vamos mergulhar fundo nos conceitos e nas práticas estruturais que transformam resultados no ambiente corporativo B2B. Para conduzir esta conversa com a profundidade e a clareza que o tema exige, tenho comigo a Djeny, nossa especialista. Djeny, a palavra está com você para darmos início à nossa primeira reflexão de hoje.`;
  
  ptBR[item1Key] = `Olá, eu sou a Djeny! É uma honra estar com todos vocês e com você, Dante. Para começarmos: ${originalContent}`;
}

fs.writeFileSync(ptBRPath, JSON.stringify(ptBR, null, 2));
console.log('Intros fixed!');
