const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '../src/lib/locales/pt-BR.json');
const data = JSON.parse(fs.readFileSync(localesPath, 'utf8'));

const lectures = [
  { id: 'comunicacao-que-conecta', title: 'Comunicação Que Conecta' },
  { id: 'motivacao-e-engajamento', title: 'Motivação e Engajamento' },
  { id: 'inteligencia-emocional', title: 'Inteligência Emocional' },
  { id: 'lideranca-humanizada', title: 'Liderança Humanizada' },
  { id: 'seguranca-psicologica', title: 'Segurança Psicológica' },
  { id: 'cultura-de-alta-performance', title: 'Cultura de Alta Performance' },
  { id: 'gestao-de-conflitos', title: 'Gestão de Conflitos' },
  { id: 'nexus-intelligence-agro-design', title: 'Nexus Intelligence Agro Design' }
];

const brokenLectures = ['lideranca-humanizada', 'comunicacao-que-conecta'];

lectures.forEach(lec => {
  const prefix = `lectures.scripts.${lec.id}`;
  
  // Extract existing items
  const items = [];
  for (let i = 0; i < 45; i++) {
    const textKey = `${prefix}.item${i}.text`;
    const questionKey = `${prefix}.item${i}.question`;
    items.push({
      text: data[textKey] || '',
      question: data[questionKey]
    });
  }

  // Define new intros
  const item0 = `Olá, eu sou o Dante. Bem-vindos e bem-vindas à nossa Masterclass oficial sobre ${lec.title}. Antes de mergulharmos fundo nas estratégias e práticas deste tema, é fundamental falarmos sobre o que nos trouxe até aqui. A Nexus não é feita apenas de linhas de códigos frios ou algoritmos sem propósito. Nós somos fundamentados em quatro pilares inegociáveis: Humanidade, Ética, Respeito e Confiança. É com base nisso que a nossa inteligência artificial ganha vida e um propósito real.`;
  const item1 = `Olá, eu sou a Djeny! É uma alegria enorme estar com todos vocês. E pegando o gancho do Dante, a tecnologia que a Nexus traz para o mercado hoje redefine a interação corporativa. Vocês perceberão ao longo de todas as nossas palestras um grau de realismo e empatia nunca antes utilizado para esse fim. Nosso objetivo é que essa troca de conhecimento seja genuína, profunda e que realmente transforme a visão de vocês.`;
  const item2 = `Exatamente, Djeny. E é com esse mesmo nível de profundidade e realismo que vamos abordar o nosso tema de hoje: ${lec.title}. Então, vamos direto ao ponto para entregar o máximo de valor. Djeny, a palavra está com você para darmos o pontapé inicial no nosso conteúdo.`;

  // Create new array of items
  const newItems = [];
  newItems.push({ text: item0 }); // index 0
  newItems.push({ text: item1 }); // index 1
  newItems.push({ text: item2 }); // index 2

  if (brokenLectures.includes(lec.id)) {
    // For broken lectures, just insert placeholders for 3 to 44 so we can generate later
    for (let i = 3; i < 45; i++) {
      newItems.push({ text: `[PLACEHOLDER FOR GENERATION ${i}]` });
    }
  } else {
    // For good lectures, shift original item1 to index 3, item2 to index 4, etc.
    // Notice old item0 was the old Dante intro, we discard it.
    // We need 42 more items (indices 3 to 44).
    for (let i = 1; i <= 42; i++) {
      newItems.push(items[i]);
    }
  }

  // Write back to data
  // First clear old keys
  for (let i = 0; i < 50; i++) {
    delete data[`${prefix}.item${i}.text`];
    delete data[`${prefix}.item${i}.question`];
  }

  // Then set new keys
  for (let i = 0; i < 45; i++) {
    data[`${prefix}.item${i}.text`] = newItems[i].text;
    
    // Set question on 12, 22, 32, 42
    if (i === 12 || i === 22 || i === 32 || i === 42) {
      // old question was at i-2 (10, 20, 30, 40)
      if (!brokenLectures.includes(lec.id) && items[i - 2] && items[i - 2].question) {
        data[`${prefix}.item${i}.question`] = items[i - 2].question;
      } else {
        data[`${prefix}.item${i}.question`] = "O que você acha sobre este ponto?"; // placeholder
      }
    }
  }
});

fs.writeFileSync(localesPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Introduções aplicadas e índices ajustados com sucesso!');
