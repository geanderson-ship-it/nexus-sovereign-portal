const fs = require('fs');
const path = require('path');

const localesDir = 'c:/Users/geand/OneDrive/Desktop/PROJETO NEXUS/site-novo/src/lib/locales';
const locales = {
  'pt-BR': {
    "floatingSupport.message": "Olá! Estou no site da Nexus ({{pathname}}) e gostaria de tirar uma dúvida sobre os cursos.",
    "floatingSupport.tooltip": "Dúvida sobre o acesso? Fale comigo agora! 💬",
    "floatingSupport.messageDjeny": "Olá! Sou de uma empresa e gostaria de saber mais sobre a integração ilimitada do Djeny Design Business."
  },
  'en-US': {
    "floatingSupport.message": "Hello! I am on the Nexus website ({{pathname}}) and would like to ask a question about the courses.",
    "floatingSupport.tooltip": "Questions about access? Talk to me now! 💬",
    "floatingSupport.messageDjeny": "Hello! I am from a company and would like to know more about the unlimited integration of Djeny Design Business."
  },
  'es-ES': {
    "floatingSupport.message": "¡Hola! Estoy en el sitio web de Nexus ({{pathname}}) y me gustaría hacer una pregunta sobre los cursos.",
    "floatingSupport.tooltip": "¿Dudas sobre el acceso? ¡Hable conmigo ahora! 💬",
     "floatingSupport.messageDjeny": "¡Hola! Soy de una empresa y me gustaría saber más sobre la integración ilimitada de Djeny Design Business."
  },
  'ru-RU': {
    "floatingSupport.message": "Здравствуйте! Я нахожусь на сайте Nexus ({{pathname}}) и хотел бы задать вопрос о курсах.",
    "floatingSupport.tooltip": "Вопросы о доступе? Поговорите со мной сейчас! 💬",
    "floatingSupport.messageDjeny": "Здравствуйте! Я представляю компанию и хотел бы узнать больше о безграничной интеграции Djeny Design Business."
  },
  'ar-AE': {
    "floatingSupport.message": "مرحبًا! أنا على موقع نكسوس ({{pathname}}) وأود أن أطرح سؤالاً حول الدورات.",
    "floatingSupport.tooltip": "أسئلة حول الوصول؟ تحدث معي الآن! 💬",
    "floatingSupport.messageDjeny": "مرحبًا! أنا من شركة وأود معرفة المزيد عن الاندماج غير المحدود لـ Djeny Design Business."
  }
};

for (const [lang, keys] of Object.entries(locales)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      for (const [k, v] of Object.entries(keys)) {
         data[k] = v;
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated ${lang}.json`);
    } catch(e) {
      console.error(`Error with ${lang}.json`, e);
    }
  }
}
