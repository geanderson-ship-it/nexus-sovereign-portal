
export type Course = {
    slug: string;
    title: string;
    description: string;
    image: {
        src: string;
        alt: string;
        hint: string;
    };
    tags: string[];
    originalPrice: number;
    discountedPrice: number;
    lessons: number;
    type: 'course' | 'palestra';
    category: string;
    subtitle: string;
    hasAIBonus: boolean;
    isBestseller?: boolean;
    featuredLabel?: string;
    longDescription?: string;
    shortDescription?: string;
    targetAudience?: string[];
    problem?: string[];
    content?: string[];
    benefits?: string[];
    methodology?: string;
    duration?: string;
    expectedResult?: string;
    internalValue?: number;
    speakers?: { name: string; image: string; alt: string; }[];
    implementationManual?: string;
};


export const individualCourses: Course[] = [
  {
    slug: 'relacionamento-interpessoal-iniciante',
    title: 'Liderança Essencial: O Despertar do Gestor.',
    description: 'O manual de sobrevivência para quem assumiu a liderança agora. Domine a comunicação, o feedback e a postura para liderar seus antigos colegas com segurança e respeito.',
    image: {
        "src": "/assets/lideranca-essencial.png",
        "alt": "Duas pessoas em uma conversa profissional positiva, representando comunicação eficaz.",
        "hint": "professional conversation"
      },
    tags: ['Comunicação', 'Feedback', 'Liderança'],
    originalPrice: 1109,
    discountedPrice: 999,
    lessons: 5,
    type: 'course' as const,
    category: 'Desenvolvimento de Liderança',
    subtitle: 'Você dormiu operador e acordou líder? Aprenda a fazer a transição de "colega" para "gestor" sem perder o respeito da equipe e sem sofrer na segunda-feira.',
    hasAIBonus: false,
  },
  {
    slug: 'relacionamento-interpessoal-intermediario',
    title: 'Liderança Estratégica Nexus (Leadership PRO).',
    subtitle: 'Saia do operacional e assuma o estratégico. Aprenda a ler cenários, antecipar crises e construir uma cultura de alta performance que funciona mesmo quando você não está na sala.',
    description: 'O treinamento definitivo para quem já lidera. Domine a inteligência emocional, a leitura de pessoas e a estratégia de gestão. Inclui acesso exclusivo aos Mentores IA Dante & Jeny (bônus na modalidade à vista).',
    image: {
        "src": "/assets/lideranca-estrategica.png",
        "alt": "Equipe em uma sala de reuniões discutindo estratégia em frente a um quadro branco.",
        "hint": "strategy meeting"
      },
    tags: ['Gestão de Conflitos', 'Inteligência Emocional', 'Estratégia'],
    originalPrice: 1665,
    discountedPrice: 1499,
    lessons: 5,
    type: 'course' as const,
    category: 'Liderança e Performance',
    hasAIBonus: true,
    isBestseller: true,
    featuredLabel: 'MAIS VENDIDO ⚡',
  },
   {
    slug: 'preparando-equipes-intermediario',
    title: 'Líder Treinador de Elite (Leader Coach).',
    subtitle: 'Pare de centralizar e comece a multiplicar. Aprenda a transformar subordinados em sucessores, construindo uma equipe autogerenciável que entrega resultados mesmo quando você não está por perto.',
    description: 'O nível máximo da gestão. Saia do operacional para sempre aprendendo a desenvolver talentos, delegar com segurança e criar uma cultura de autonomia. Inclui acesso exclusivo aos Mentores IA Dante & Jeny (bônus na modalidade à vista).',
    image: {
      "src": "/assets/lider-treinador.png",
      "alt": "Líder em sessão de coaching com um membro da equipe, simbolizando desenvolvimento de talentos.",
      "hint": "leader coaching"
    },
    tags: ['Coaching', 'Desenvolvimento de Times', 'Intermediário'],
    originalPrice: 2498,
    discountedPrice: 2249,
    lessons: 5,
    type: 'course' as const,
    category: 'Liderança e Performance',
    hasAIBonus: true,
  },
  {
    slug: 'lideranca-avancado',
    title: 'Alta Liderança Executiva (Executive Mastery).',
    subtitle: 'O estágio final da liderança. Deixe de liderar apenas pelo cargo e passe a liderar pela sua identidade. Conecte propósito, lucro e alta performance para construir um legado que inspira gerações.',
    description: 'Para quem está no topo ou se prepara para chegar lá. Uma imersão em governança, cultura organizacional e sabedoria executiva. Inclui acesso VIP aos Mentores IA Dante & Jeny (bônus na modalidade à vista).',
    image: {
        "src": "/assets/alta-lideranca.png",
        "alt": "Duas pessoas em uma negociação, simbolizando o conflito como aprendizado e visão de longo prazo.",
        "hint": "negotiation discussion"
      },
    tags: ['Governança', 'Cultura', 'Legado'],
    originalPrice: 3329,
    discountedPrice: 2999,
    lessons: 5,
    type: 'course' as const,
    category: 'Alta Gestão',
    hasAIBonus: true,
    featuredLabel: 'ELITE SELECTION 🏆',
  },
];

export const palestras: Course[] = [
  {
    slug: 'comunicacao-que-conecta',
    title: 'Comunicação de Alto Impacto: O Fim do "Telefone sem Fio".',
    description: 'Nesta palestra, exploramos como a comunicação assertiva é a ferramenta chave para evitar mal-entendidos, estabelecer limites saudáveis e fortalecer a colaboração. Os participantes aprendem a se posicionar com equilíbrio, defender suas ideias sem agressividade e ouvir com empatia, transformando o diálogo em uma ponte para resultados sólidos e ambientes de trabalho mais produtivos.',
    shortDescription: 'Não é sobre o que você fala, é sobre o que a equipe entende. Uma palestra dinâmica para eliminar ruídos, acabar com a "rádio peão" e garantir que a estratégia da diretoria chegue clara até a ponta da operação.',
    category: 'Comunicação',
    internalValue: 3500,
    image: {
        "src": "https://i.postimg.cc/bN72sB6r/Dante-e-Djeny-palestrantes.jpg",
        "alt": "Dante e Djeny, as IAs da Nexus, como palestrantes em um evento corporativo.",
        "hint": "AI speakers"
      },
    tags: ['Clareza', 'Assertividade', 'Alinhamento'],
    type: 'palestra' as const,
    subtitle: 'Aprenda a transmitir suas ideias com clareza e empatia.',
    targetAudience: [
        'Profissionais de todas as áreas.',
        'Líderes e gestores.',
        'Equipes que buscam melhorar a interação e colaboração.',
    ],
    problem: [
        'Falta de clareza na comunicação.',
        'Mal-entendidos que geram conflitos.',
        'Dificuldade em engajar e conectar equipes.',
    ],
    content: [
        'Técnicas de comunicação assertiva.',
        'Como ouvir e ser ouvido com empatia.',
        'Estratégias para alinhar expectativas e mensagens.',
        'Práticas para melhorar a colaboração entre equipes.',
    ],
    benefits: [
        'Equipes mais engajadas e alinhadas.',
        'Redução de falhas de comunicação.',
        'Melhor clima organizacional e produtividade.',
    ],
    methodology: 'Abordagem prática e aplicada, com exercícios interativos e reflexão humana, estilo Nexus.',
    duration: '1h',
    expectedResult: 'Profissionais capazes de se comunicar de forma clara, empática e eficaz, fortalecendo relações e resultados.',
    originalPrice: 0,
    discountedPrice: 0,
    lessons: 0,
    hasAIBonus: false,
    speakers: [
        { name: 'Dante', image: 'https://i.postimg.cc/Qx75CsSr/Dante-virtual-2.png', alt: 'Dante' },
        { name: 'Djeny', image: 'https://i.postimg.cc/L8qWnJwF/Djeny-virtual-2.png', alt: 'Djeny' }
    ],
    implementationManual: `
### Manual de Implementação: Experiência Nexus 4K

**Assunto:** Configuração de Palestra Imersiva (60 Minutos)
**Palestrantes:** Dante e Djeny

#### 1. Configuração do Motor de Voz (TTS - Text-to-Speech)
Para garantir o tom "Calmo e Cadenciado", a Vix deve aplicar os seguintes parâmetros nos avatares:
- **Velocidade de Fala (Rate):** 0.85x a 0.9x (NUNCA 1.0x padrão).
- **Pitch (Tom):**
  - *Dante:* -5% (Para reforçar o grave e a autoridade).
  - *Djeny:* +3% (Para trazer brilho e clareza).
- **Pausas (SSML Tags):**
  - \`<break time="1.5s"/>\` após cada mudança de tópico.
  - \`<break time="3.0s"/>\` após perguntas retóricas à plateia.

#### 2. Cronograma de Conteúdo (The 60min Masterclass)
A Vix deve carregar o roteiro dividido em 4 blocos sequenciais:

| Bloco | Tempo | Ação do Avatar | Conteúdo Base |
| :--- | :--- | :--- | :--- |
| 01: Abertura | 0-10 min | Dante inicia solo; Djeny entra aos 06:00. | Apresentação, Desejo de Jornada e "O Sequestro do Sentido". |
| 02: Pilares | 10-30 min | Alternância de foco (Spotlight) entre eles. | Escuta Nível 3, Objetividade Radical e Feedback Loop. |
| 03: Interação | 30-50 min | Movimento de "Iddling" (Escuta Ativa). | Respostas em tempo real para as 5 perguntas da plateia. |
| 04: Finale | 50-60 min | Ambos no centro do palco. | Mensagem inspiradora, agradecimento e saída elegante. |

#### 3. Comportamento Visual e Movimento (Body Language)
- **Micro-gestos:** Implementar o Eye Tracking para que os olhos dos avatares percorram a "plateia" (movimento horizontal lento).
- **Gesticulação:** Ativar o modo "Lector/Orator" onde as mãos se movem de acordo com a ênfase das palavras (Open palms para Djeny, Steepling hands para Dante).
- **Lip-Sync:** Sincronização em 60fps para garantir que não haja atraso entre áudio e movimento labial (essencial para a AWS).

#### 4. Integração de "Live Q&A" (A Prova Viva)
A Vix deve configurar o gatilho de interrupção amigável. Se um usuário digitar ou falar, o avatar deve terminar a frase atual, fazer uma pausa de "escrita" (mostrando que está processando) e iniciar a resposta com: "Excelente pergunta, [Nome]..."
`
  },
  {
    slug: 'motivacao-e-engajamento',
    title: 'Engajamento Real: Propósito Além do Salário.',
    description: 'Muito além de bônus e benefícios, a verdadeira motivação nasce do propósito, do reconhecimento e de um ambiente que inspira crescimento. Esta palestra aborda os pilares do engajamento sustentável, mostrando como líderes e equipes podem construir uma cultura onde a autonomia, a maestria e o senso de pertencimento se tornam o combustível para a alta performance.',
    shortDescription: 'Esqueça a motivação de "palco" que dura 24 horas. Vamos falar sobre o que realmente move as pessoas: pertencimento, autonomia e ver sentido no trabalho. Como transformar funcionários que batem ponto em profissionais que batem metas.',
    category: 'Engajamento e Cultura',
    internalValue: 3500,
    image: {
        "src": "https://i.postimg.cc/wMmNQwpv/Dante-e-Djeny-palestrante-2.png",
        "alt": "Dante e Djeny, as IAs da Nexus, como palestrantes em um evento corporativo.",
        "hint": "AI speakers"
      },
    tags: ['Automotivação', 'Propósito', 'Protagonismo'],
    type: 'palestra' as const,
    subtitle: 'Desperte o melhor de cada pessoa e fortaleça o engajamento.',
    targetAudience: [
        'Líderes e gestores.',
        'Equipes de alta performance.',
        'Profissionais que buscam engajamento e inspiração.',
    ],
    problem: [
        'Falta de motivação nas equipes.',
        'Desalinhamento de objetivos.',
        'Dificuldade em engajar pessoas para alcançar resultados.',
    ],
    content: [
        'Técnicas para inspirar e engajar equipes.',
        'Como reconhecer e valorizar talentos.',
        'Estratégias para alinhar propósito individual e organizacional.',
        'Práticas para fortalecer a motivação contínua.',
    ],
    benefits: [
        'Equipes mais engajadas e produtivas.',
        'Melhora no clima organizacional.',
        'Resultados consistentes e sustentáveis.',
    ],
    methodology: 'Abordagem prática, interativa e humana, com exercícios de reflexão e aplicação imediata, estilo Nexus.',
    duration: '1h',
    expectedResult: 'Profissionais e equipes mais motivados, engajados e capazes de gerar resultados excepcionais.',
    originalPrice: 0,
    discountedPrice: 0,
    lessons: 0,
    hasAIBonus: false,
    speakers: [
        { name: 'Dante', image: 'https://i.postimg.cc/Qx75CsSr/Dante-virtual-2.png', alt: 'Dante' },
        { name: 'Djeny', image: 'https://i.postimg.cc/L8qWnJwF/Djeny-virtual-2.png', alt: 'Djeny' }
    ]
  },
  {
    slug: 'inteligencia-emocional',
    title: 'Blindagem Emocional e Maturidade Profissional.',
    description: 'Maturidade emocional não é "aguentar tudo", é compreender a si mesmo para agir com equilíbrio. Nesta palestra, exploramos gatilhos emocionais, controle de impulsos, empatia, leitura de contexto e responsabilidade pelas próprias emoções. Os participantes aprendem a evitar respostas reativas, a lidar com pressões do dia a dia e a interpretar comportamentos antes de tirar conclusões.',
    shortDescription: 'Inteligência Emocional não é "engolir sapo". É ter a casca grossa para aguentar a pressão sem perder a educação. Ensinamos como separar o CPF do CNPJ e manter o foco no resultado, mesmo em dias caóticos.',
    category: 'Desenvolvimento Humano',
    internalValue: 4000,
    image: {
        "src": "https://i.postimg.cc/C1tD8W99/Dante-e-Djeny-palestrante-3.png",
        "alt": "Dante e Djeny, as IAs da Nexus, como palestrantes em um evento corporativo.",
        "hint": "AI speakers"
      },
    tags: ['Resiliência', 'Gestão de Estresse', 'Postura Adulta'],
    type: 'palestra' as const,
    subtitle: 'Desenvolva maturidade para pensar com clareza, reagir com equilíbrio e liderar conscientemente.',
    targetAudience: [
        'Líderes e gestores.',
        'Profissionais que desejam melhorar a autogestão.',
        'Equipes que buscam equilíbrio e colaboração.',
    ],
    problem: [
        'Reações impulsivas em situações de pressão.',
        'Falta de equilíbrio emocional no ambiente de trabalho.',
        'Dificuldade em tomar decisões ponderadas e conscientes.',
    ],
    content: [
        'Reconhecimento e gestão das próprias emoções.',
        'Técnicas para responder e não reagir.',
        'Estratégias para influenciar positivamente colegas e equipes.',
        'Exercícios de autoconsciência e empatia.',
    ],
    benefits: [
        'Colaboradores mais conscientes e equilibrados.',
        'Redução de conflitos e tensões.',
        'Melhora na tomada de decisão e liderança eficaz.',
    ],
    methodology: 'Abordagem prática, aplicada e reflexiva, com exercícios de autoconhecimento e prática cotidiana, estilo Nexus.',
    duration: '1h',
    expectedResult: 'Profissionais capazes de liderar com equilíbrio, pensar de forma clara e gerar relações de confiança e colaboração.',
    originalPrice: 0,
    discountedPrice: 0,
    lessons: 0,
    hasAIBonus: false,
    speakers: [
        { name: 'Dante', image: 'https://i.postimg.cc/Qx75CsSr/Dante-virtual-2.png', alt: 'Dante' },
        { name: 'Djeny', image: 'https://i.postimg.cc/L8qWnJwF/Djeny-virtual-2.png', alt: 'Djeny' }
    ]
  },
  {
    slug: 'lideranca-humanizada',
    title: 'Liderança "Aço e Seda": Resultado com Humanidade.',
    description: 'Liderança vai muito além de cargo: ela nasce do caráter, da postura e da forma como tratamos as pessoas. Esta palestra mostra como liderar com equilíbrio entre empatia e firmeza, como orientar sem microgerenciar, como delegar com clareza e como criar conexões que fortalecem a confiança. Os participantes entendem que o verdadeiro líder não domina, ele desenvolve. Não controla, ele inspira. Não apaga incêndios, ele constrói maturidade.',
    shortDescription: 'Ser humano não é ser "bonzinho" ou permissivo. É saber cobrar com firmeza e desenvolver com respeito. Mostramos como o líder moderno equilibra a exigência da meta com o cuidado com as pessoas.',
    category: 'Liderança e Performance',
    internalValue: 5000,
    image: {
        "src": "https://i.postimg.cc/1XqFrvQ3/Dante-e-Djeny-palestrante-6.png",
        "alt": "Dante e Djeny, as IAs da Nexus, como palestrantes em um evento corporativo.",
        "hint": "AI speakers"
      },
    tags: ['Gestão de Pessoas', 'Equilíbrio', 'Autoridade'],
    type: 'palestra' as const,
    subtitle: 'Liderar é criar relações que inspiram e geram resultados.',
    targetAudience: [
        'Líderes e gestores.',
        'Profissionais em cargos de coordenação.',
        'Equipes que buscam liderança consciente e inspiradora.',
    ],
    problem: [
        'Liderança autoritária e distante.',
        'Falta de engajamento das equipes.',
        'Dificuldade em construir relações de confiança.',
    ],
    content: [
        'Princípios da liderança humanizada.',
        'Como engajar e motivar equipes com empatia.',
        'Estratégias para inspirar confiança e colaboração.',
        'Exercícios para desenvolver habilidades de escuta e comunicação.',
    ],
    benefits: [
        'Equipes mais motivadas e colaborativas.',
        'Clima organizacional positivo e respeitoso.',
        'Resultados consistentes e sustentáveis.',
    ],
    methodology: 'Abordagem prática, aplicada e reflexiva, com exercícios de desenvolvimento humano e liderança consciente, estilo Nexus.',
    duration: '1h30',
    expectedResult: 'Líderes capazes de inspirar, engajar e construir relações de confiança que geram resultados reais.',
    originalPrice: 0,
    discountedPrice: 0,
    lessons: 0,
    hasAIBonus: false,
    speakers: [
        { name: 'Dante', image: 'https://i.postimg.cc/Qx75CsSr/Dante-virtual-2.png', alt: 'Dante' },
        { name: 'Djeny', image: 'https://i.postimg.cc/L8qWnJwF/Djeny-virtual-2.png', alt: 'Djeny' }
    ]
  },
   {
    slug: 'seguranca-psicologica',
    title: 'Confiança Radical: Onde a Inovação Acontece.',
    description: 'A base da alta performance não é a pressão, é a confiança. Segurança psicológica é a permissão para ser vulnerável, para fazer perguntas, para discordar e para assumir riscos sem medo de punição ou humilhação. Nesta palestra, mostramos como líderes podem construir ativamente essa segurança, transformando o ambiente de trabalho em um espaço de inovação, colaboração e crescimento real.',
    shortDescription: 'Uma equipe que tem medo de errar, tem medo de inovar. Como criar um ambiente onde a verdade é dita, os problemas são resolvidos rápido e ninguém precisa esconder erros para sobreviver.',
    category: 'Cultura e Inovação',
    internalValue: 5000,
    image: {
        "src": "https://i.postimg.cc/1tcZZxww/Dante-e-Djeny-palestrantes-8.jpg",
        "alt": "Dante e Djeny, as IAs da Nexus, como palestrantes em um evento corporativo.",
        "hint": "AI speakers"
    },
    tags: ['Inovação', 'Transparência', 'Ambiente Seguro'],
    type: 'palestra' as const,
    subtitle: 'Ambientes seguros para errar, inovar e ser autêntico.',
    targetAudience: [
      'Líderes e gestores.',
      'Equipes de todas as áreas.',
      'Profissionais que buscam confiança e colaboração.',
    ],
    problem: [
      'Medo de errar ou de se expressar.',
      'Falta de confiança entre equipes.',
      'Barreiras para inovação e criatividade.',
    ],
    content: [
      'Como criar ambientes seguros e confiáveis.',
      'Técnicas para promover diálogo aberto e transparente.',
      'Estratégias para incentivar inovação e aprendizado contínuo.',
      'Práticas para fortalecer confiança e colaboração.',
    ],
    benefits: [
      'Equipes mais engajadas e inovadoras.',
      'Redução de erros repetitivos e falhas de comunicação.',
      'Cultura organizacional positiva e confiável.',
    ],
    methodology: 'Abordagem prática, interativa e reflexiva, com exercícios aplicáveis no dia a dia, estilo Nexus.',
    duration: '1h',
    expectedResult: 'Profissionais e equipes confiantes, capazes de inovar, colaborar e se expressar com autenticidade.',
    originalPrice: 0,
    discountedPrice: 0,
    lessons: 0,
    hasAIBonus: false,
    speakers: [
        { name: 'Dante', image: 'https://i.postimg.cc/Qx75CsSr/Dante-virtual-2.png', alt: 'Dante' },
        { name: 'Djeny', image: 'https://i.postimg.cc/L8qWnJwF/Djeny-virtual-2.png', alt: 'Djeny' }
    ]
  },
  {
    slug: 'cultura-de-alta-performance',
    title: 'DNA de Elite: Construindo uma Cultura de Resultado.',
    description: 'Alta performance não é um evento isolado, é o resultado de uma cultura intencional. Nesta palestra, focada em líderes e gestores, desvendamos os elementos que compõem uma cultura de excelência: clareza de metas, autonomia com responsabilidade, feedback constante e um alinhamento total entre o que a empresa fala e o que ela pratica. Saia com um roadmap claro para elevar o padrão da sua equipe.',
    shortDescription: 'Cultura não é a frase bonita na parede da recepção. Cultura é o que acontece quando o chefe sai da sala. Vamos discutir rituais, exemplos e comportamentos que separam as empresas comuns das líderes de mercado.',
    category: 'Alta Gestão',
    internalValue: 6000,
    image: {
        "src": "https://i.postimg.cc/j27f4Mbz/Dante-e-Djeny-palestrantes-5.png",
        "alt": "Dante e Djeny, as IAs da Nexus, como palestrantes em um evento corporativo.",
        "hint": "AI speakers"
    },
    tags: ['Valores', 'Rituais', 'Consistência'],
    type: 'palestra' as const,
    subtitle: 'Alinhe liderança, processos e comportamentos para resultados excepcionais.',
    targetAudience: [
        'Líderes e gestores de equipes.',
        'Profissionais de alta gestão.',
        'Equipes que buscam excelência e resultados consistentes.',
    ],
    problem: [
        'Falta de alinhamento entre equipes e líderes.',
        'Processos desorganizados que prejudicam a performance.',
        'Dificuldade em construir uma cultura de resultados sustentáveis.',
    ],
    content: [
        'Como alinhar comportamentos e objetivos estratégicos.',
        'Estruturação de processos eficientes.',
        'Práticas para desenvolver uma cultura colaborativa e orientada a resultados.',
        'Estratégias para manter engajamento e excelência contínua.',
    ],
    benefits: [
        'Equipes alinhadas e motivadas.',
        'Resultados consistentes e de alta qualidade.',
        'Cultura organizacional fortalecida e orientada a performance.',
    ],
    methodology: 'Abordagem prática, aplicada e reflexiva, com exercícios e discussões estratégicas, estilo Nexus.',
    duration: '1h30',
    expectedResult: 'Organizações com equipes engajadas, processos eficientes e cultura que impulsiona resultados excepcionais.',
    originalPrice: 0,
    discountedPrice: 0,
    lessons: 0,
    hasAIBonus: false,
    speakers: [
        { name: 'Dante', image: 'https://i.postimg.cc/Qx75CsSr/Dante-virtual-2.png', alt: 'Dante' },
        { name: 'Djeny', image: 'https://i.postimg.cc/L8qWnJwF/Djeny-virtual-2.png', alt: 'Djeny' }
    ]
  },
  {
    slug: 'gestao-de-conflitos',
    title: 'Do Conflito ao Acordo: Negociação Interna.',
    description: 'Conflitos não resolvidos minam a confiança, a produtividade e a saúde do ambiente de trabalho. Esta palestra capacita líderes a mediar e resolver tensões de forma construtiva. Abordamos técnicas para identificar a raiz do problema, facilitar diálogos difíceis e construir soluções ganha-ganha. O objetivo é transformar o conflito de uma ameaça para uma poderosa ferramenta de fortalecimento de equipes.',
    shortDescription: 'Divergência de ideias é saudável; briga de ego é prejuízo. Aprenda a transformar atritos em combustível para melhorias. Técnicas para desarmar pessoas difíceis e focar na solução do problema.',
    category: 'Liderança e Negociação',
    internalValue: 6000,
    image: {
        "src": "https://i.postimg.cc/50qMMcLQ/Dante-e-Djeny-palestrante-7.jpg",
        "alt": "Dante e Djeny, as IAs da Nexus, como palestrantes em um evento corporativo.",
        "hint": "AI speakers"
    },
    tags: ['Mediação', 'Negociação', 'Clima Organizacional'],
    type: 'palestra' as const,
    subtitle: 'Transforme divergências em oportunidades de crescimento e alinhamento.',
    targetAudience: [
        'Líderes e gestores.',
        'Equipes de todas as áreas.',
        'Profissionais que lidam com negociações e relações interpessoais.',
    ],
    problem: [
        'Conflitos mal gerenciados que prejudicam a colaboração.',
        'Falta de habilidades para negociar e alinhar interesses.',
        'Barreiras na comunicação que geram desentendimentos.',
    ],
    content: [
        'Técnicas de mediação e resolução de conflitos.',
        'Estratégias para comunicação assertiva em situações tensas.',
        'Como transformar divergências em oportunidades de aprendizado.',
        'Práticas para fortalecer la colaboração e confiança.',
    ],
    benefits: [
        'Redução de atritos e mal-entendidos.',
        'Equipes mais colaborativas e resilientes.',
        'Melhoria no clima organizacional e nos resultados.',
    ],
    methodology: 'Abordagem prática e aplicada, com exercícios interativos e simulações de situações reais, estilo Nexus.',
    duration: '1h',
    expectedResult: 'Profissionais capazes de lidar com conflitos de forma construtiva, fortalecendo relações e resultados da equipe.',
    originalPrice: 0,
    discountedPrice: 0,
    lessons: 0,
    hasAIBonus: false,
    speakers: [
        { name: 'Dante', image: 'https://i.postimg.cc/Qx75CsSr/Dante-virtual-2.png', alt: 'Dante' },
        { name: 'Djeny', image: 'https://i.postimg.cc/L8qWnJwF/Djeny-virtual-2.png', alt: 'Djeny' }
    ]
  }
];


const allCoursesData: Course[] = [
    ...individualCourses,
    ...palestras,
];

// Create a map for quick lookups by slug
const coursesBySlug = new Map(allCoursesData.map(course => [course.slug, course]));

// Function to get a course by its slug
export const getCourseBySlug = (slug: string) => {
    return coursesBySlug.get(slug);
}

// Export all courses if needed elsewhere, though lookup is preferred
export const allCourses = allCoursesData;

    

    

    



















