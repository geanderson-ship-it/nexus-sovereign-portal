const fs = require('fs');
const path = require('path');

const localesPath = path.join(process.cwd(), 'src/lib/locales');
const ptBR = JSON.parse(fs.readFileSync(path.join(localesPath, 'pt-BR.json'), 'utf8'));

const translations = {
  'en-US': {
    'contact.mailto.subject': 'Contact via Nexus Website - Subject: ',
    'contact.mailto.name': 'Name: ',
    'contact.mailto.email': 'Email: ',
    'contact.mailto.phone': 'Phone: ',
    'contact.mailto.company': 'Company: ',
    'contact.mailto.subjectLabel': 'Subject: ',
    'contact.mailto.message': 'Message: ',
    'contact.mailto.notInformed': 'Not informed',
    'courses.mentors.dante.description': 'Trained by Commander Geanderson to be your front-line mentor. Dante focuses on raw strategy, accountability for results, and conflict management. If the scenario is high pressure and you need a tactical decision without hesitation, he is the voice of command that ensures flawless execution.',
    'courses.mentors.djeny.description': "Refined to be your support in human development. Djeny focuses on the 'how to do', mediation, engagement, and inspiring leadership. She is the mentor who helps you read people, design PDIs, and transform your team's climate with wisdom, empathy, and elite aesthetics.",
    'excellence.features.feature3.description': "In Excellence, technology bows to values. Here, emotional intelligence is our priority, transforming the 'shop floor' into a stage for high performance and mutual respect.",
    'excellence.conclusion': 'Nexus Excellence: Because true leadership is not made with machines, but with the wisdom that guides them. Feel the future. Touch the human.',
    'login.toast.success.description': 'Welcome back to the command center.',
    'profile.welcome': 'Welcome, {name}!',
    'profile.default_name': 'Student',
    'whatsapp.payment.message': 'Hello! I have made the payment of {price} for the course "{title}" and I am sending the receipt.',
    'whatsapp.support.message': 'Hello! I am on the Nexus site ({path}) and I would like to ask a question about the courses.',
    'chat.footer.disclaimer': '{name} is an AI and may make mistakes. Check the responses. Due to high flow, audio may take a few moments.',
    'chat.placeholder.scenario': 'Present your scenario...',
    'chat.button.pay': 'Unlock Full Access Now',
    'chat.payment.title': 'PIX for Full Access',
    'chat.payment.qr_desc': 'Scan the code with your banking app.',
    'chat.payment.investment': 'Investment: Full Access',
    'chat.payment.qr_button': 'Pay with QR Code',
    'chat.payment.copy_button': 'PIX Copy and Paste',
    'chat.payment.copied': 'Copied!',
    'chat.payment.whatsapp_button': 'Send Receipt via WhatsApp',
    'gallery.culture': [
      {
        "quote": "Leadership is built with Character.",
        "nexusVision": "At Nexus, the position is just a name; character is what sustains the decision. Results impress the market, but it is your posture that inspires the team to follow you without you needing to give an order. A true leader does not impose themselves; they are recognized by example."
      },
      {
        "quote": "You change for two reasons: because you learned too much or because you suffered enough.",
        "nexusVision": "Change is not an accident, it is a choice. Learning gives you new horizons, but pain shows you what can no longer continue. At Nexus, we help leaders choose the path of awareness before the limit of pain is reached. Changing is not weakness, it is the courage to evolve."
      },
      {
        "quote": "The leader facilitates, they don't solve.",
        "nexusVision": "Those who solve everything create dependency; those who facilitate create autonomy. Our role is to remove barriers and provide clarity so the team can walk alone. Elite leadership is that which forms people capable of acting without needing a 'parent' or 'firefighter' nearby."
      },
      {
        "quote": "Trust is built through consistency.",
        "nexusVision": "Trust is not gained by shouting or beautiful speeches; it is gained through repetition. It is maintaining the same posture under pressure or when no one is looking. At Nexus, we preach consistency between what is said and what is done. That is how you plant security and harvest loyalty."
      },
      {
        "quote": "Conflict is an opportunity for learning.",
        "nexusVision": "Where there is difference, there is truth. Well-conducted conflict does not separate, it matures. It is the moment to align expectations and correct routes. The leader who fears conflict avoids growth; the Nexus leader welcomes divergence to find clarity."
      },
      {
        "quote": "Salary attracts, but a healthy environment retains.",
        "nexusVision": "Money buys people's time, but respect and psychological safety buy their hearts and minds. A healthy environment is the only ground where talent takes root. At Nexus, we transform the organizational climate so the sparkle in the eyes returns to daily life."
      },
      {
        "quote": "There's no point in being technically brilliant and socially unbearable.",
        "nexusVision": "Technique opens the door, but emotional intelligence is what keeps you inside. Leadership is about connection. Numerical results without human respect are empty and unsustainable. We seek the 360º professional: a master in what they do and exemplary in how they treat others."
      },
      {
        "quote": "Work and give your best without flattering anyone.",
        "nexusVision": "Flattery is the tool of those who have no delivery. When your result is unquestionable, your competence speaks for you. At Nexus, we value merit and consistency. Those who depend on a pat on the back live on favors; those who focus on results live on authority."
      },
      {
        "quote": "The right person doesn't come ready, they come willing!",
        "nexusVision": "A person's value is not in arriving perfect, but in being open to building together. Willing people evolve fast and become part of the culture naturally. At Nexus, we believe that where there is a will to make it happen, talent flourishes. Willingness is the engine of progress."
      },
      {
        "quote": "GO AND DO! Stop seeing problems and start seeing opportunities.",
        "nexusVision": "Real changes begin when we step out of paralysis. Problems are just barriers for those who have no purpose. When you act, even without all the answers, you create movement and learn along the way. That is how Nexus evolves: trading excuses for the courage of the first step."
      },
      {
        "quote": "BE TEACHABLE: You don't know everything and you are not always right.",
        "nexusVision": "Humility to learn is the greatest strength of an elite leader. Teachable people do not defend themselves from feedback; they use it as a growth tool. At Nexus, those who do not need to be always right are the ones who evolve the most. Openness to the new is what transforms good professionals into masters."
      }
    ],
  },
  'es-ES': {
    'contact.mailto.subject': 'Contacto vía Sitio Nexus - Asunto: ',
    'contact.mailto.name': 'Nombre: ',
    'contact.mailto.email': 'Correo electrónico: ',
    'contact.mailto.phone': 'Teléfono: ',
    'contact.mailto.company': 'Empresa: ',
    'contact.mailto.subjectLabel': 'Asunto: ',
    'contact.mailto.message': 'Mensaje: ',
    'contact.mailto.notInformed': 'No informado',
    'courses.mentors.dante.description': 'Entrenado por el Comandante Geanderson para ser su mentor de primera línea. Dante se enfoca en la estrategia bruta, la rendición de cuentas y la gestión de conflictos. Si el escenario es de alta presión y necesita una decisión táctica sin vacilaciones, él es la voz del mando que garantiza una ejecución impecable.',
    'courses.mentors.djeny.description': "Refinada para ser su apoyo en el desarrollo humano. Djeny se enfoca en el 'cómo hacer', la mediación, el compromiso y el liderazgo inspirador. Ella es la mentora que le ayuda a leer a las personas, a diseñar PDIs y a transformar el clima de su equipo con sabiduría, empatía y estética de élite.",
    'intelligence.magaOs.description': 'Bienvenido a mi centro de mando, Comandante. Aquí orquestamos la inteligencia que mueve a Nexus y refinamos los protocolos de excelencia.',
  },
  'fr-FR': {
    'palestras.detail.targetAudience': 'Public cible',
    'palestras.detail.problem': 'Problème qu\'il résout',
    'palestras.detail.content': 'Contenus / Apprentissages',
    'palestras.detail.benefits': 'Bénéfices pour l\'entreprise',
    'palestras.detail.methodology': 'Méthodologie',
    'palestras.detail.duration': 'Durée',
    'palestras.detail.expectedResult': 'Résultat escompté',
    'contact.mailto.subject': 'Contact via Site Nexus - Objet : ',
    'contact.mailto.name': 'Nom : ',
    'contact.mailto.email': 'Email : ',
    'contact.mailto.phone': 'Téléphone : ',
    'contact.mailto.company': 'Entreprise : ',
    'contact.mailto.subjectLabel': 'Objet : ',
    'contact.mailto.message': 'Message : ',
    'contact.mailto.notInformed': 'Non renseigné',
    'courses.mentors.dante.description': 'Formé par le Commandant Geanderson pour être votre mentor de première ligne. Dante se concentre sur la stratégie brute, l\'exigence de résultats et la gestion des conflits. Si le scénario est sous haute pression et que vous avez besoin d\'une décision tactique sans détour, il est la voix du commandement qui garantit une exécution impeccable.',
    'courses.mentors.djeny.description': "Raffinée pour être votre support dans le développement humain. Djeny se concentre sur le 'comment faire', la médiation, l'engagement et le leadership inspirant. Elle est la mentore qui vous aide à lire les gens, à concevoir des PDI et à transformer le climat de votre équipe avec sagesse, empathie et esthétique d'élite.",
    'intelligence.magaOs.description': 'Bienvenue dans mon centre de commandement, Commandant. Ici, nous orchestrons l\'intelligence qui fait bouger Nexus et affinons les protocoles d\'excellence.',
  },
  'de-DE': {
    'contact.mailto.subject': 'Kontakt über Nexus-Website - Betreff: ',
    'contact.mailto.name': 'Name: ',
    'contact.mailto.email': 'E-Mail: ',
    'contact.mailto.phone': 'Telefon: ',
    'contact.mailto.company': 'Unternehmen: ',
    'contact.mailto.subjectLabel': 'Betreff: ',
    'contact.mailto.message': 'Nachricht: ',
    'contact.mailto.notInformed': 'Nicht angegeben',
    'courses.mentors.dante.description': 'Ausgebildet von Kommandant Geanderson, um Ihr Front-Line-Mentor zu sein. Dante konzentriert sich auf rohe Strategie, Ergebnisverantwortung und Konfliktmanagement. Wenn das Szenario unter hohem Druck steht und Sie eine taktische Entscheidung ohne Zögern benötigen, ist er die Stimme des Befehls, die eine tadellose Ausführung garantiert.',
    'courses.mentors.djeny.description': "Verfeinert, um Ihre Unterstützung bei der menschlichen Entwicklung zu sein. Djeny konzentriert sich auf das 'Wie', Mediation, Engagement und inspirierende Führung. Sie ist die Mentorin, die Ihnen hilft, Menschen zu lesen, PDIs zu entwerfen und das Klima Ihres Teams mit Weisheit, Empathie und Elite-Ästhetik zu transformieren.",
    'intelligence.magaOs.description': 'Willkommen in meiner Befehlszentrale, Kommandant. Hier orchestrieren wir die Intelligenz, die Nexus bewegt, und verfeinern die Exzellenzprotokolle.',
  }
};

const languages = ['en-US', 'es-ES', 'de-DE', 'fr-FR', 'ja-JP', 'zh-CN', 'ar-AE', 'ru-RU'];

// Load English as fallback for others
const enUS = JSON.parse(fs.readFileSync(path.join(localesPath, 'en-US.json'), 'utf8'));

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = false;

  // Add missing keys or overwrite untranslated (PT) keys
  Object.keys(ptBR).forEach(key => {
    const isUntranslated = !data[key] || (JSON.stringify(data[key]) === JSON.stringify(ptBR[key]) && lang !== 'pt-BR');
    
    if (isUntranslated) {
      // Use manual translation if available, or English fallback, or finally PT
      const newValue = (translations[lang] && translations[lang][key]) || enUS[key] || ptBR[key];
      
      if (data[key] !== newValue) {
        data[key] = newValue;
        updated = true;
      }
    }
  });

  // Apply manual translations/fixes for existing keys (e.g. fixing PT leftovers)
  if (translations[lang]) {
    Object.keys(translations[lang]).forEach(key => {
      if (data[key] !== translations[lang][key]) {
        data[key] = translations[lang][key];
        updated = true;
      }
    });
  }

  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
  }
});
