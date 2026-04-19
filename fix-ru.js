const fs = require('fs');

const ptPath = 'c:/Users/geand/OneDrive/Desktop/PROJETO NEXUS/site-novo/src/lib/locales/en-US.json';
const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

// The truncated file
const ruRaw = fs.readFileSync('c:/Users/geand/OneDrive/Desktop/PROJETO NEXUS/site-novo/src/lib/locales/ru-RU.json', 'utf8');

const regex = /"([a-zA-Z0-9_\.-]+)":\s*"((?:[^"\\]|\\.)*)"/g;
let match;
const rescued = {};
while ((match = regex.exec(ruRaw)) !== null) {
  try {
    rescued[match[1]] = JSON.parse('"' + match[2] + '"');
  } catch (e) {}
}

const translations = {
  "consulting.title": "Консалтинг, который трансформирует команды и приносит реальные результаты.",
  "consulting.subtitle": "Мы поддерживаем компании, которые хотят расти осознанно, с уважением и человечностью.",
  "consulting.intro": "Наша роль — идти рядом, вносить ясность и создавать стратегии. Мы не предлагаем готовые формулы; мы погружаемся в вашу реальность, чтобы увидеть то, что скрыто за цифрами. Это конец хаотичных операций и начало элитного управления.",
  "consulting.step1.title": "Шаг 1 — Погружение в реальность",
  "consulting.step1.description": "До решения — правда. Мы слушаем людей, анализируем истории и цифры, чтобы увидеть, что скрывают результаты. Глубокая, уважительная диагностика без фильтров.",
  "consulting.step2.title": "Шаг 2 — Разработка решения",
  "consulting.step2.description": "Мы превращаем данные в направление. Никаких шаблонных пакетов: мы создаем специфические стратегии для вашей компании, чтобы ускорить результаты без потери энергии и талантов.",
  "consulting.step3.title": "Шаг 3 — Лидерство в действии",
  "consulting.step3.description": "Стратегия имеет смысл, только если доходит до практики. Мы сопровождаем ваших лидеров в их повседневной работе, корректируя процессы и усиливая коммуникацию, чтобы план превращался в реальные результаты.",
  "consulting.step4.title": "Шаг 4 — Непрерывный мониторинг",
  "consulting.step4.description": "Трансформация — это не разовое событие, это процесс. Мы продолжаем отслеживать показатели и поведение, чтобы гарантировать, что изменения долговечны, а культура укрепилась.",
  "consulting.cta": "НАЗНАЧИТЬ СТРАТЕГИЧЕСКУЮ ДИАГНОСТИКУ",

  "palestras.detail.targetAudience": "Целевая аудитория",
  "palestras.detail.problem": "Какую проблему решает",
  "palestras.detail.content": "Содержание / Чему научатся",
  "palestras.detail.benefits": "Преимущества для компании",
  "palestras.detail.methodology": "Методология",
  "palestras.detail.duration": "Продолжительность",
  "palestras.detail.expectedResult": "Ожидаемый результат",
  
  "gallery.title": "Там, где культура становится поступком.",
  "gallery.subtitle": "Лидерство Nexus в действии: от теории к элитной практике.",
  "gallery.text": "Сильная культура создается не словами на доске, а ежедневным поведением. Здесь мы открываем наш «кодекс поведения» на реальных кейсах и стратегических видениях. Каждая карточка в этой галерее — это столп нашего фундамента: сочетание характера, смелости меняться и эмоционального интеллекта, необходимого для управления людьми, а не просто процессами. Изучите мышление, которое превращает обычные группы в экстраординарные команды, и стройте, и вы тоже, на скале.",
  "gallery.cta.title": "Готовы ли вы трансформировать культуру своей команды?",
  "gallery.cta.text": "Nexus верит в людей — в их истории, их борьбу и уникальный потенциал каждого. Когда мы развиваем людей, вся команда растет вместе. Принесем ли мы эту человеческую и профессиональную эволюцию в вашу компанию?",
  "gallery.cta.button": "ПРИВЕСТИ NEXUS В МОЮ КОМАНДУ."
};

const outputStringifyKeys = (obj) => {
    // If it's the root obj, we iterate over it
    for(let key in obj) {
        if(translations[key]) {
            obj[key] = translations[key];
        } else if(rescued[key]) {
            obj[key] = rescued[key];
        } else if(typeof obj[key] === 'string') {
            // keep english
        }
    }
}

const output = JSON.parse(JSON.stringify(pt));
outputStringifyKeys(output);

fs.writeFileSync('c:/Users/geand/OneDrive/Desktop/PROJETO NEXUS/site-novo/src/lib/locales/ru-RU.json', JSON.stringify(output, null, 2), 'utf8');
console.log("JSON FIXED AND SAVED");
