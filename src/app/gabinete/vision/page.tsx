'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { 
  Lock, Mic, MicOff, Video, VideoOff, PhoneOff, Languages, 
  Sparkles, Globe, Shield, Play, VolumeX, Terminal, User, Share2, Clipboard,
  Mail, Send, Check, ExternalLink, Search, Plus, ScreenShare, ScreenShareOff, Info
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// IDIOMAS DO CLIENTE DISPONÍVEIS — EXPANSÃO GLOBAL NEXUS
const LANGUAGES = [
  { code: 'auto', name: 'Detecção Automática', flag: '🔍', nativeName: 'Auto Detect', voiceLocale: 'auto' },
  // AMÉRICAS
  { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português', voiceLocale: 'pt-BR' },
  { code: 'es', name: 'Espanhol', flag: '🇪🇸', nativeName: 'Español', voiceLocale: 'es-ES' },
  { code: 'en', name: 'Inglês', flag: '🇺🇸', nativeName: 'English', voiceLocale: 'en-US' },
  // EUROPA OCIDENTAL
  { code: 'fr', name: 'Francês', flag: '🇫🇷', nativeName: 'Français', voiceLocale: 'fr-FR' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano', voiceLocale: 'it-IT' },
  { code: 'de', name: 'Alemão', flag: '🇩🇪', nativeName: 'Deutsch', voiceLocale: 'de-DE' },
  { code: 'nl', name: 'Holandês', flag: '🇳🇱', nativeName: 'Nederlands', voiceLocale: 'nl-NL' },
  // EUROPA DO NORTE
  { code: 'sv', name: 'Sueco', flag: '🇸🇪', nativeName: 'Svenska', voiceLocale: 'sv-SE' },
  // EUROPA DO LESTE
  { code: 'ru', name: 'Russo', flag: '🇷🇺', nativeName: 'Русский', voiceLocale: 'ru-RU' },
  { code: 'pl', name: 'Polonês', flag: '🇵🇱', nativeName: 'Polski', voiceLocale: 'pl-PL' },
  // ORIENTE MÉDIO
  { code: 'ar', name: 'Árabe', flag: '🇸🇦', nativeName: 'العربية', voiceLocale: 'ar-SA' },
  { code: 'tr', name: 'Turco', flag: '🇹🇷', nativeName: 'Türkçe', voiceLocale: 'tr-TR' },
  // ÁSIA
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी', voiceLocale: 'hi-IN' },
  { code: 'ja', name: 'Japonês', flag: '🇯🇵', nativeName: '日本語', voiceLocale: 'ja-JP' },
  { code: 'zh', name: 'Chinês (Mandarim)', flag: '🇨🇳', nativeName: '普通话', voiceLocale: 'zh-CN' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷', nativeName: '한국어', voiceLocale: 'ko-KR' },
];

// Dicionário Multilíngue de Dicas de Tradução (Lobby)
const PRE_JOIN_TIPS: Record<string, { title: string; t1: string; t2: string; t3: string }> = {
  pt: {
    title: "Boas Práticas de Tradução",
    t1: "Fale pausadamente: O sistema traduz a cada pausa. Frases mais curtas geram traduções mais rápidas.",
    t2: "Use fones de ouvido: Evita que seu microfone capte a voz da Inteligência Artificial.",
    t3: "Aguarde o câmbio: Espere a voz traduzida terminar de falar na sua tela antes de responder."
  },
  en: {
    title: "Translation Best Practices",
    t1: "Speak slowly: The system translates at every pause. Shorter sentences generate faster translations.",
    t2: "Use headphones: Essential to prevent your microphone from picking up the Artificial Intelligence voice.",
    t3: "Wait your turn: Wait for the translated voice to finish speaking before you reply."
  },
  es: {
    title: "Buenas Prácticas de Traducción",
    t1: "Hable pausadamente: El sistema traduce en cada pausa. Las frases cortas generan traducciones más rápidas.",
    t2: "Use auriculares: Esencial para evitar que su micrófono capte la voz de la Inteligencia Artificial.",
    t3: "Espere el cambio: Espere a que la voz traducida termine de hablar antes de responder."
  },
  fr: {
    title: "Bonnes Pratiques de Traduction",
    t1: "Parlez lentement : Le système traduit à chaque pause. Des phrases plus courtes génèrent des traductions plus rapides.",
    t2: "Utilisez des écouteurs : Essentiel pour éviter que votre microphone ne capte la voix de l'Intelligence Artificielle.",
    t3: "Attendez votre tour : Attendez que la voix traduite termine de parler avant de répondre."
  },
  it: {
    title: "Migliori Pratiche di Traduzione",
    t1: "Parla lentamente: Il sistema traduce ad ogni pausa. Le frasi più brevi generano traduzioni più veloci.",
    t2: "Usa le cuffie: Essenziale per evitare che il tuo microfono catturi la voce dell'Intelligenza Artificiale.",
    t3: "Aspetta il tuo turno: Aspetta che la voce tradotta finisca di parlare prima di rispondere."
  },
  de: {
    title: "Übersetzungs-Best-Practices",
    t1: "Sprechen Sie langsam: Das System übersetzt bei jeder Pause. Kürzere Sätze erzeugen schnellere Übersetzungen.",
    t2: "Verwenden Sie Kopfhörer: Wichtig, um zu verhindern, dass Ihr Mikrofon die KI-Stimme aufnimmt.",
    t3: "Warten Sie: Warten Sie, bis die übersetzte Stimme fertig gesprochen hat, bevor Sie antworten."
  },
  zh: {
    title: "翻译最佳实践",
    t1: "请慢慢说：系统在每次停顿时进行翻译。较短的句子会产生更快的翻译。",
    t2: "使用耳机：这对于防止麦克风捕捉到人工智能的声音至关重要。",
    t3: "等待轮换：在回答之前，请等待翻译的声音说完。"
  },
  ko: {
    title: "번역 모범 사례",
    t1: "천천히 말하세요: 시스템은 일시 정지할 때마다 번역합니다. 짧은 문장이 더 빠른 번역을 생성합니다.",
    t2: "헤드폰 사용: 마이크가 인공지능 목소리를 수음하지 않도록 하는 데 필수적입니다.",
    t3: "순서 기다리기: 대답하기 전에 번역된 목소리가 끝날 때까지 기다리세요."
  },
  ja: {
    title: "翻訳のベストプラクティス",
    t1: "ゆっくり話す：システムは一時停止ごとに翻訳します。短い文の方が早く翻訳されます。",
    t2: "ヘッドフォンを使用する：マイクが人工知能の声を拾うのを防ぐために不可欠です。",
    t3: "順番を待つ：応答する前に、翻訳された音声が話し終わるのを待ってください。"
  }
};

const FOOTER_REMINDER: Record<string, string> = {
  pt: "Fale pausadamente para melhor interpretação do tradutor.",
  en: "Please speak slowly for better translation accuracy.",
  es: "Hable pausadamente para una mejor interpretación del traductor.",
  fr: "Parlez lentement pour une meilleure interprétation du traducteur.",
  it: "Parla lentamente per una migliore interpretazione del traduttore.",
  de: "Bitte sprechen Sie langsam für eine bessere Übersetzungsgenauigkeit.",
  zh: "请缓慢发言，以便翻译器更好地进行口译。",
  ko: "번역기의 더 나은 해석을 위해 천천히 말씀해 주십시오.",
  ja: "翻訳機の解釈を良くするため、ゆっくり話してください。"
};

// FALAS MOCKADAS DO CLIENTE POR IDIOMA PARA A SIMULAÇÃO DE INTERCEPTAÇÃO — EXPANSÃO GLOBAL
const MOCK_CLIENT_SPEECHES: Record<string, { original: string; translation: string }[]> = {
  pt: [
    { original: "Olá Gean, é um prazer falar com você. Estou testando a chamada de áudio direto da Nexus em Português.", translation: "Olá Gean, é um prazer falar com você. Estou testando a chamada de áudio direto da Nexus em Português." },
    { original: "Esta é uma demonstração da transmissão de voz sem interceptação. O áudio flui direto, limpo e em tempo real.", translation: "Esta é uma demonstração da transmissão de voz sem interceptação. O áudio flui direto, limpo e em tempo real." },
    { original: "Excelente qualidade de áudio da ElevenLabs. O som está nítido e sem nenhuma microfonia na nossa videoconferência.", translation: "Excelente qualidade de áudio da ElevenLabs. O som está nítido e sem nenhuma microfonia na nossa videoconferência." }
  ],
  es: [
    { original: "Hola Gean, es un placer saludarte. El projeto de Nexus me parece sumamente innovador y queremos avanzar hoy mismo.", translation: "Olá Gean, é um prazer te saudar. O projeto da Nexus me parece extremamente inovador e queremos avançar hoje mesmo." },
    { original: "¿Qué garantías nos ofrece el sistema de segurança on-premise que han desarrollado para proteger nuestros datos estratégicos?", translation: "Que garantias nos oferece o sistema de segurança local que vocês desenvolveram para proteger nossos dados estratégicos?" },
    { original: "Estamos de acuerdo con los valores de la proposta. ¿Cuáles son los próximos pasos para la firma del contrato comercial?", translation: "Estamos de acordo com os valores da proposta. Quais são os próximos passos para a assinatura do contrato comercial?" },
    { original: "La demostración de la traducción soberana es impresionante. Resuelve un gran problema de comunicação internacional.", translation: "A demonstração da tradução soberana é impressionante. Resolve um grande problema de comunicação internacional." }
  ],
  en: [
    { original: "Hello Gean, great to see you. The Nexus proposal is solid and we are ready to move forward with the partnership.", translation: "Olá Gean, bom ver você. A proposta da Nexus é sólida e estamos prontos para seguir em frente com a parceria." },
    { original: "Can you explain how the real-time audio interception handles latency during unstable internet connections?", translation: "Você pode explicar como a interceptação de áudio em tempo real lida com a latência durante conexões instáveis de internet?" },
    { original: "We have reviewed the strategic budget and approved all the terms. Let's schedule the kickoff meeting for next Monday.", translation: "Revisamos o orçamento estratégico e aprovamos todos os termos. Vamos agendar a reunião de pontapé inicial para a próxima segunda-feira." },
    { original: "This sovereign communication tool is exactly what our multinational executive board has been looking for.", translation: "Esta ferramenta de comunicação soberana é exatamente o que o nosso conselho executivo multinacional estava procurando." }
  ],
  fr: [
    { original: "Bonjour Gean. C'est un plaisir d'être ici. Votre technologie de traduction intégrée est tout simplement révolutionnaire.", translation: "Bom dia Gean. É um prazer estar aqui. Sua tecnologia de tradução integrada é simplesmente revolucionária." },
    { original: "Le budget de la proposition commerciale est validé par notre comité exécutif. Nous attendons le contrat final.", translation: "O orçamento da proposta comercial foi validado pelo nosso comitê executivo. Estamos aguardando o contrato final." },
    { original: "Pouvez-vous confirmer si le cryptage de bout en bout est bien actif lors de ces visioconférences ?", translation: "Você pode confirmer se a criptografia de ponta a ponta está realmente ativa durante estas videoconferências?" }
  ],
  it: [
    { original: "Buongiorno Gean. La tecnologia Nexus è straordinaria, siamo pronti a firmare l'accordo di licenza oggi.", translation: "Bom dia Gean. A tecnologia Nexus é extraordinária, estamos prontos para assinar o acordo de licença hoje." },
    { original: "Quali sono i requisiti tecnici per implementare la linea di comunicazione protetta sui nostri server aziendali?", translation: "Quais são os requisitos técnicos para implementar a linha de comunicação protegida nos nossos servidores corporativos?" },
    { original: "Il sistema di traduzione soberana della Nexus supera qualsiasi soluzione che abbiamo testato sul mercato.", translation: "O sistema de tradução soberana da Nexus supera qualquer solução que testamos no mercado." }
  ],
  de: [
    { original: "Guten Tag Gean. Wir sind sehr interessiert an einer langfristigen Kooperation mit der Nexus Holding Group.", translation: "Bom dia Gean. Estamos muito interessados em uma cooperação de longo prazo com o Nexus Holding Group." },
    { original: "Können Sie die Sicherheitsarchitektur der Übersetzungs-API im Detail erläutern?", translation: "Você pode explicar em detalhes a arquitetura de segurança da API de tradução?" },
    { original: "Unser Vorstand hat das Budget genehmigt. Wir möchten so schnell wie möglich mit der Implementierung beginnen.", translation: "Nosso conselho aprovou o orçamento. Queremos começar com a implementação o mais rápido possível." }
  ],
  nl: [
    { original: "Goedemiddag Gean. Wij zijn onder de indruk van de Nexus Vision technologie en willen graag samenwerken.", translation: "Boa tarde Gean. Estamos impressionados com a tecnologia Nexus Vision e gostaríamos de colaborar." },
    { original: "Kunt u ons meer vertellen over de beveiliging en gegevensbescherming van uw systeem?", translation: "Você pode nos contar mais sobre a segurança e proteção de dados do seu sistema?" },
    { original: "Ons directieteam heeft de proposta goedgekeurd. Wat zijn de volgende stappen voor implementatie?", translation: "Nossa equipe diretiva aprovou a proposta. Quais são os próximos passos para a implementação?" }
  ],
  sv: [
    { original: "Hej Gean! Nexus Vision är en fantastisk lösning för vår globala kommunikation. Vi är imponerade.", translation: "Olá Gean! O Nexus Vision é uma solução fantástica para nossa comunicação global. Estamos impressionados." },
    { original: "Kan ni förklara hur er realtidsöversättning fungerar tekniskt sett?", translation: "Você pode explicar como a tradução em tempo real funciona do ponto de vista técnico?" },
    { original: "Vi har godkänt budgeten och vill gärna starta samarbetet så snart som möjligt.", translation: "Aprovamos o orçamento e gostaríamos de iniciar a colaboração o mais breve possível." }
  ],
  ru: [
    { original: "Добрый день, Жеан. Технология Nexus Vision произвела на нас огромное впечатление. Мы готовы к сотрудничеству.", translation: "Boa tarde, Gean. A tecnologia Nexus Vision nos impressionou muito. Estamos prontos para a colaboração." },
    { original: "Можете ли вы подробнее объяснить архитектуру безопасности и суверенитет данных вашей системы?", translation: "Você poderia explicar com mais detalhes a arquitetura de segurança e a soberania dos dados do seu sistema?" },
    { original: "Наш совет директоров одобрил бюджет. Нам нужно немедленно перейти к следующим шагам.", translation: "Nosso conselho de administração aprovou o orçamento. Precisamos avançar imediatamente para as próximas etapas." },
    { original: "Это именно то решение для международных переговоров, которое мы искали много лет.", translation: "Esta é exatamente a solução para negociações internacionais que estávamos procurando há muitos anos." }
  ],
  pl: [
    { original: "Dzień dobry Gean. Technologia Nexus Vision to przełomowe rozwiązanie dla naszych międzynarodowych operacji.", translation: "Bom dia Gean. A tecnologia Nexus Vision é uma solução revolucionária para nossas operações internacionais." },
    { original: "Czy mógłby Pan wyjaśnić, jak działa system tłumaczenia w czasie rzeczywistym i jakie są jego ograniczenia?", translation: "Você poderia explicar como funciona o sistema de tradução em tempo real e quais são suas limitações?" },
    { original: "Nasz zarząd zatwierdził propozycję. Chcemy podpisać umowę jak najszybciej.", translation: "Nossa diretoria aprovou a proposta. Queremos assinar o contrato o mais rápido possível." }
  ],
  ar: [
    { original: "مرحباً جيان، يسعدني التحدث معك. أنا أختبر مكالمة الصوت المباشرة من نكسس باللغة العربية.", translation: "Olá Gean, é um prazer falar com você. Estou testando a chamada de áudio direto da Nexus em Árabe." },
    { original: "هذا عرض توضيحي لنقل الصوت بدون اعتراض. الصوت يتدفق بشكل مباشر ونظيف وفي الوقت الفعلي.", translation: "Esta é uma demonstração da transmissão de voz sem interceptação. O áudio flui direto, limpo e em tempo real." },
    { original: "لقد وافق مجلسنا التنفيذي على الميزانية ونرغب في الشروع في التنفيذ الفوري.", translation: "Nosso conselho executivo aprovou o orçamento e desejamos prosseguir com a implementação imediata." }
  ],
  tr: [
    { original: "Merhaba Gean. Nexus Vision teknolojisi gerçekten çok etkileyici. Ortaklık kurmak istiyoruz.", translation: "Olá Gean. A tecnologia Nexus Vision é realmente muito impressionante. Queremos estabelecer uma parceria." },
    { original: "Gerçek zamanlı çeviri sisteminin teknik mimarisini biraz daha açıklayabilir misiniz?", translation: "Você poderia explicar um pouco mais a arquitetura técnica do sistema de tradução em tempo real?" },
    { original: "Yönetim kurulumuz teklifi onayladı. Sözleşmeyi bir an önce imzalamak istiyoruz.", translation: "Nosso conselho de administração aprovou a proposta. Queremos assinar o contrato o mais breve possível." }
  ],
  hi: [
    { original: "नमस्ते जियान जी। नेक्सस विज़न की तकनीक वास्तव में अद्भुत है। हम इस साझेदारी को आगे बढ़ाना चाहते हैं।", translation: "Olá, Gean. A tecnologia do Nexus Vision é verdadeiramente incrível. Queremos avançar com essa parceria." },
    { original: "क्या आप हमें अपने सुरक्षा बुनियादी ढांचे और डेटा संप्रभुता के बारे में अधिक जानकारी दे सकते हैं?", translation: "Você poderia nos fornecer mais informações sobre sua infraestrutura de segurança e soberania de dados?" },
    { original: "हमारे बोर्ड ने बजट को मंजूरी दे दी है। हम जल्द से जल्द अनुबंध पर हस्ताक्षर करना चाहते हैं।", translation: "Nosso conselho aprovou o orçamento. Queremos assinar o contrato o mais rápido possível." }
  ],
  ja: [
    { original: "こんにちは、ジアンさん。Nexus Visionの技術は非常に革新的です。ぜひパートナーシップを進めたいと思います。", translation: "Olá, Gean. A tecnologia do Nexus Vision é muito inovadora. Gostaríamos muito de avançar com a parceria." },
    { original: "リアルタイム翻訳システムのセキュリティアーキテクチャについて、もう少し詳しく説明していただけますか？", translation: "Você poderia explicar com um pouco mais de detalhes a arquitetura de segurança do sistema de tradução em tempo real?" },
    { original: "取締役会が予算を承認しました。できるだけ早く契約を締結したいと考えています。", translation: "Nosso conselho de administração aprovou o orçamento. Esperamos fechar o contrato o mais breve possível." },
    { original: "この技術は、私たちの国際ビジネス交渉において大きなアドバンテージをもたらすでしょう。", translation: "Esta tecnologia trará uma grande vantagem em nossas negociações internacionais de negócios." }
  ],
  zh: [
    { original: "您好，吉安先生。Nexus Vision的技术令我们印象深刻。我们非常希望建立长期合作关系。", translation: "Olá, Gean. A tecnologia do Nexus Vision nos impressionou muito. Temos muito interesse em estabelecer uma parceria de longo prazo." },
    { original: "能否详细介绍一下您的实时翻译系统的安全架构和数据主权保障措施？", translation: "Você poderia detalhar a arquitetura de segurança do seu sistema de tradução em tempo real e as medidas de soberania de dados?" },
    { original: "我们的董事会已经批准了预算。我们希望尽快签署合作协议并开始实施。", translation: "Nosso conselho de administração aprovou o orçamento. Esperamos assinar o acordo de cooperação e iniciar a implementação o mais breve possível." },
    { original: "这项技术将彻底改变我们在亚太地区的商业谈判方式。非常感谢您的演示。", translation: "Esta tecnologia vai transformar completamente nossa forma de conduzir negociações comerciais na região Ásia-Pacífico. Muito obrigado pela demonstração." }
  ],
  ko: [
    { original: "안녕하세요, 지안 씨. Nexus Vision 기술은 정말 혁신적입니다. 파트너십을 진행하고 싶습니다.", translation: "Olá, Gean. A tecnologia do Nexus Vision é realmente inovadora. Gostaríamos de avançar com a parceria." },
    { original: "실시간 번역 시스템의 보안 아키텍처와 데이터 주권에 대해 좀 더 자세히 설명해 주실 수 있나요?", translation: "Você poderia explicar com mais detalhes a arquitetura de segurança do sistema de tradução em tempo real e a soberania dos dados?" },
    { original: "이사회에서 예산을 승인했습니다. 가능한 한 빨리 계약을 체결하고 싶습니다.", translation: "Nosso conselho de administração aprovou o orçamento. Gostaríamos de fechar o contrato o mais rápido possível." },
    { original: "이 기술은 아시아 태평양 지역에서의 국제 비즈니스 협상 방식을 완전히 바꿀 것입니다.", translation: "Esta tecnologia irá transformar completamente a maneira de conduzir negociações internacionais de negócios na região Ásia-Pacífico." }
  ]
};

interface TranscriptItem {
  id: string;
  sender: 'gean' | 'client';
  originalText: string;
  translatedText: string;
  timestamp: string;
}

interface RemotePeer {
  peerId: string;
  name: string;
  stream: MediaStream | null;
  isCameraOn?: boolean;
  isMuted?: boolean;
}

export default function VisionSoberanoPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMediaReady, setIsMediaReady] = useState(false);

  // ESTADOS DO CONVIDADO (GUEST)
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [guestName, setGuestName] = useState('');

  const guestNameRef = useRef(guestName);
  useEffect(() => {
    guestNameRef.current = guestName;
  }, [guestName]);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // ESTADOS DO DIALOG DE CONVITE POR E-MAIL
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedSender, setSelectedSender] = useState('vendas@nexustreinamento.com');
  const [customSender, setCustomSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('Convite para Reunião Virtual Segura — Nexus Holding Group');
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // ESTADOS DA CHAMADA
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isInterpreterActive, setIsInterpreterActive] = useState(true);
  const [myLanguage, setMyLanguage] = useState(LANGUAGES[0]); // padrão inicial: português
  const [peerLanguage, setPeerLanguage] = useState(LANGUAGES[0]); // padrão inicial: português
  const [isClientSpeaking, setIsClientSpeaking] = useState(false);
  const [isGeanSpeaking, setIsGeanSpeaking] = useState(false);
  const [mounted, setMounted] = useState(false);

  // WebRTC Room e Peer IDs
  const localPeerId = useMemo(() => Math.random().toString(36).substring(7), []);
  const [roomId, setRoomId] = useState('nhg-vision-soberano-default');
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  const [remotePeerName, setRemotePeerName] = useState('Aguardando...');
  const [isJoiner, setIsJoiner] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Inicializando...');
  const processedSignalsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const room = searchParams.get('room') || 'nhg-vision-soberano-default';
      const join = searchParams.get('join') === 'true';
      setRoomId(room);
      setIsJoiner(join);
      setConnectionStatus(join ? 'Aguardando convite do Host...' : 'Criando sala e aguardando Ivoni...');

      // Telemetria em tempo real: Intercepta erros globais e rejeições de promises
      const reportError = (message: string, detail?: string) => {
        fetch('/api/vision/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, type: 'error', detail })
        }).catch(() => {}); // Falha silenciosa para não quebrar a UI
      };

      window.onerror = (message, source, lineno, colno, error) => {
        reportError(String(message), `Source: ${source} | Line: ${lineno}:${colno} | Stack: ${error?.stack || ''}`);
      };

      window.onunhandledrejection = (event) => {
        reportError('Unhandled Promise Rejection', String(event.reason?.message || event.reason || ''));
      };
    }
  }, []);

  // FLUXO DE VÍDEO
  const [stream, setStream] = useState<MediaStream | null>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // WebRTC Refs
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const dataChannelsRef = useRef<Map<string, RTCDataChannel>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidateQueuesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const hasConnectedRef = useRef(false);

  // ESTADO DE PARTICIPANTES REMOTOS
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);

  // LEGENDAS & SUBTITLES
  const [activeSubtitle, setActiveSubtitle] = useState<{
    sender: 'gean' | 'client';
    original: string;
    translated: string;
    stage: 'speaking' | 'translating' | 'done';
  } | null>(null);

  // TRANSCRIÇÃO & HISTÓRICO
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [atenaInsights, setAtenaInsights] = useState<string[]>([
    "Canal de comunicação seguro estabelecido.",
    "Aguardando interações para gerar insights de negócios."
  ]);

  // COMPARTILHAMENTO DE TELA (SCREEN SHARE)
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const logToAtena = (msg: string) => {
    setAtenaInsights(prev => {
      if (prev[0] === msg) return prev;
      return [msg, ...prev.slice(0, 4)];
    });

    // Envia eventos estruturados (que começam com "[") para o banco de telemetria
    if (msg.startsWith('[')) {
      fetch('/api/vision/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          type: msg.toLowerCase().includes('erro') || msg.toLowerCase().includes('falha') ? 'error' : 'info',
          detail: `UserAgent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'} | Room: ${roomId}`
        })
      }).catch(() => {});
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      try {
        logToAtena(`[WebRTC] Solicitando compartilhamento de tela com áudio...`);
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];
        const screenAudioTrack = screenStream.getAudioTracks()[0];

        // Se tiver conexões WebRTC ativas, substitui a track de vídeo e áudio em todas elas
        for (const [peerId, pc] of peerConnectionsRef.current.entries()) {
          const senders = pc.getSenders();
          const videoSender = senders.find(s => s.track && s.track.kind === 'video');
          if (videoSender) {
            await videoSender.replaceTrack(screenTrack);
          }
          if (screenAudioTrack) {
            const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
            if (audioSender) {
              await audioSender.replaceTrack(screenAudioTrack);
            }
          }
        }
        logToAtena(`[WebRTC] Compartilhamento de tela e áudio ativo na chamada.`);

        // Atualiza a visualização local do usuário
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = screenStream;
        }

        // Detecta quando o usuário clica em "Parar compartilhamento" na barra nativa do navegador
        screenTrack.onended = () => {
          logToAtena(`[WebRTC] Compartilhamento de tela interrompido.`);
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err: any) {
        console.error("Falha ao iniciar compartilhamento de tela:", err);
        logToAtena(`[WebRTC] Falha ao compartilhar tela.`);
      }
    }
  };

  const stopScreenShare = async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }

    // Reverte para a câmera local e microfone em todas as conexões
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
    const micTrack = localStreamRef.current?.getAudioTracks()[0];
    for (const [peerId, pc] of peerConnectionsRef.current.entries()) {
      const senders = pc.getSenders();
      const videoSender = senders.find(s => s.track && s.track.kind === 'video');
      if (videoSender && cameraTrack) {
        await videoSender.replaceTrack(cameraTrack);
      }
      const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
      if (audioSender && micTrack) {
        await audioSender.replaceTrack(micTrack);
      }
    }
    logToAtena(`[WebRTC] Vídeo e áudio da chamada restaurados.`);

    // Restaura a visualização local
    if (myVideoRef.current && localStreamRef.current) {
      myVideoRef.current.srcObject = localStreamRef.current;
    }

    setIsScreenSharing(false);
  };

  // RECONHECIMENTO DE VOZ (SPEECH RECOGNITION)
  const recognitionRef = useRef<any>(null);
  const micErrorRef = useRef<string | null>(null);
  const isTtsPlayingRef = useRef<boolean>(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const isMutedRef = useRef(isMuted);
  const isInterpreterActiveRef = useRef(isInterpreterActive);
  const isComponentMountedRef = useRef(true);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isInterpreterActiveRef.current = isInterpreterActive;
  }, [isInterpreterActive]);

  const myLanguageRef = useRef(myLanguage);
  const peerLanguageRef = useRef(peerLanguage);
  useEffect(() => {
    myLanguageRef.current = myLanguage;
    peerLanguageRef.current = peerLanguage;
  }, [myLanguage, peerLanguage]);

  useEffect(() => {
    isComponentMountedRef.current = true;
    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);

  // Helper para atualizar estado e Ref simultaneamente (evita stale closure no onend)
  const updateMicError = (err: string | null) => {
    setMicError(err);
    micErrorRef.current = err;
  };

  // Solicitar permissão e reiniciar microfone manualmente
  const requestMicPermission = () => {
    updateMicError(null);
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(s => {
          s.getTracks().forEach(track => track.stop());
          updateMicError(null);
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e) {}
            setTimeout(() => {
              try { recognitionRef.current.start(); } catch(e) {}
            }, 300);
          }
        })
        .catch(err => {
          console.error("Mic permission request failed:", err);
          updateMicError("Acesso ao microfone recusado. Por favor, clique no cadeado na barra de endereços para autorizar o microfone.");
        });
    }
  };

  const handleLeave = (targetUrl: string) => {
    isComponentMountedRef.current = false; // Garante o bloqueio de reinicialização da fala

    if (stream) {
      stream.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      setStream(null);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      screenStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    for (const [peerId, pc] of peerConnectionsRef.current.entries()) {
      try { pc.close(); } catch (e) {}
    }
    peerConnectionsRef.current.clear();
    router.push(targetUrl);
  };

  // URL de convite baseada no domínio atual com fallback para o oficial
  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/gabinete/vision?room=${roomId}&join=true`
    : `https://nexustreinamento.com/gabinete/vision?room=${roomId}&join=true`;

  const agendaUrlWithParams = useMemo(() => {
    const to = selectedRecipient === 'custom' ? customEmail : selectedRecipient;
    const lead = leadsList.find(l => l.email === to);
    
    const params = new URLSearchParams();
    if (to) params.set('email', to);
    if (lead) {
      params.set('name', `${lead.firstName || ''} ${lead.lastName || ''}`.trim());
      params.set('company', lead.company || '');
      // Prefere whatsapp se disponível, senão fone
      params.set('phone', lead.phone || lead.whatsapp || '');
    }
    
    const paramStr = params.toString();
    const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://nexustreinamento.com';
    return `${baseOrigin}/agenda${paramStr ? '?' + paramStr : ''}`;
  }, [selectedRecipient, customEmail, leadsList]);

  const senderSignature = useMemo(() => {
    if (selectedSender === 'custom') {
      return customSender ? `${customSender} — Nexus Holding Group` : 'Diretoria — Nexus Holding Group';
    }
    if (selectedSender === 'vendas@nexustreinamento.com') return 'Vendas — Nexus Holding Group';
    if (selectedSender === 'geanderson@nexustreinamento.com') return 'Diretor Geanderson — Nexus Holding Group';
    if (selectedSender === 'diretoria@nexustreinamento.com') return 'Diretoria — Nexus Holding Group';
    return 'Pessoal — Nexus Holding Group';
  }, [selectedSender, customSender]);

  const emailBody = useMemo(() => {
    return `Prezado(a),

Gostaria de convidá-lo(a) para uma reunião virtual de apresentação e alinhamento estratégico das soluções da Nexus Holding Group.

Para escolher o melhor dia e horário para o nosso atendimento exclusivo, por favor acesse a nossa agenda online no link abaixo:
${agendaUrlWithParams}

Ao confirmar o agendamento, o sistema gerará automaticamente o link seguro para a nossa videoconferência.

Atenciosamente,
${senderSignature}
https://nexustreinamento.com`;
  }, [agendaUrlWithParams, senderSignature]);

  const handleOpenEmailClient = () => {
    const to = selectedRecipient === 'custom' ? customEmail : selectedRecipient;
    if (!to) {
      alert("Por favor, selecione ou insira um e-mail de destinatário.");
      return;
    }
    const params = new URLSearchParams();
    params.set('subject', emailSubject);
    params.set('body', emailBody);
    const mailtoUrl = `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleCopyEmailBody = () => {
    navigator.clipboard.writeText(emailBody);
    setIsEmailCopied(true);
    setTimeout(() => setIsEmailCopied(false), 2000);
  };

  const handleCopyOnlyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleSendDirectEmail = async () => {
    const to = selectedRecipient === 'custom' ? customEmail : selectedRecipient;
    if (!to) {
      alert("Por favor, selecione ou insira um e-mail de destinatário.");
      return;
    }
    
    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/agenda/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          sender: selectedSender,
          subject: emailSubject,
          body: emailBody
        })
      });
      
      if (!res.ok) throw new Error("Erro de servidor.");
      const data = await res.json();
      if (data.success) {
        alert("E-mail de convite enviado com sucesso diretamente pelo SMTP!");
        setIsInviteOpen(false);
      } else {
        throw new Error(data.error || "Erro desconhecido.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Falha ao enviar e-mail pelo SMTP corporativo: ${err.message || 'Erro de rede'}.`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // VERIFICAÇÃO DE AUTORIZAÇÃO E CARREGAMENTO DE CONTATOS
  useEffect(() => {
    if (!isUserLoading) {
      const searchParams = new URLSearchParams(window.location.search);
      const isJoin = searchParams.get('join') === 'true';
      
      if (isJoin) {
        setIsAuthorized(true);
      } else if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (isAuthorized) {
      fetch('/api/contact')
        .then(res => res.json())
        .then(data => {
          if (data && data.leads && data.leads.length > 0) {
            setLeadsList(data.leads);
            setSelectedRecipient(data.leads[0].email);
          } else {
            throw new Error("Sem leads cadastrados");
          }
        })
        .catch(err => {
          console.log("Usando leads de backup para convite:", err);
          const backupLeads = [
            { email: 'gilberto.schumann@passodosobrado.rs.gov.br', firstName: 'Gilberto', lastName: 'Schumann', company: 'Prefeitura de Passo do Sobrado' },
            { email: 'luciana.v@grupocalcados.com.br', firstName: 'Luciana', lastName: 'Vanderlei', company: 'Polo Calçadista de Mato Leitão' },
            { email: 'carlos.medeiros@ipe.rs.gov.br', firstName: 'Carlos', lastName: 'Medeiros', company: 'Prefeitura de Ipê' }
          ];
          setLeadsList(backupLeads);
          setSelectedRecipient(backupLeads[0].email);
        });
    }
  }, [isAuthorized]);

  // INICIALIZAR E POLICIA WebRTC (Conexão P2P + Sinalização DynamoDB - MESH para até 6 pessoas)
  useEffect(() => {
    if (!isAuthorized || typeof window === 'undefined') return;
    if (isJoiner && !hasEnteredName) return; // Aguarda o convidado digitar o nome

    let active = true;
    let pollInterval: NodeJS.Timeout;
    let presenceInterval: NodeJS.Timeout;

    // 1. Acessa mídia local (câmera e áudio)
    const initLocalMedia = async () => {
      setConnectionStatus('Acessando câmera e microfone...');
      let localStream: MediaStream;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640, max: 800 },
            height: { ideal: 480, max: 600 },
            frameRate: { ideal: 15, max: 24 }
          },
          audio: true
        });
        localStreamRef.current = localStream;
        setStream(localStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = localStream;
        }
        setIsMediaReady(true);
        logToAtena(`[WebRTC] Áudio e vídeo capturados.`);
      } catch (err) {
        console.warn("Falha ao obter mídia local completa. Tentando apenas vídeo...", err);
        try {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640, max: 800 },
              height: { ideal: 480, max: 600 },
              frameRate: { ideal: 15, max: 24 }
            },
            audio: false
          });
          localStreamRef.current = localStream;
          setStream(localStream);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = localStream;
          }
          setIsMediaReady(true);
          logToAtena(`[WebRTC] Apenas vídeo capturado (sem áudio).`);
        } catch (e2) {
          console.error("Falha total de mídia:", e2);
          setConnectionStatus('Erro: Câmera não detectada');
          logToAtena(`[WebRTC] Erro de hardware: Nenhuma câmera detectada.`);
          return;
        }
      }
      setConnectionStatus('Conectado à sala local. Buscando parceiros...');
    };

    // 2. Envia nossa presença na sala
    const sendPresence = async () => {
      try {
        await fetch('/api/vision/signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId,
            type: 'presence',
            sender: localPeerId,
            data: {
              name: isJoiner ? guestNameRef.current : (userRef.current?.name || 'Diretor Geanderson'),
              isCameraOn,
              isMuted,
              timestamp: Date.now()
            }
          })
        });
      } catch (e) {
        console.warn("Erro ao enviar presença:", e);
      }
    };

    // 3. Inicializa Conexão WebRTC com um Peer específico
    const getOrCreatePeerConnection = (targetPeerId: string, peerName: string): RTCPeerConnection => {
      if (peerConnectionsRef.current.has(targetPeerId)) {
        return peerConnectionsRef.current.get(targetPeerId)!;
      }

      logToAtena(`[WebRTC] Criando conexão com ${peerName}...`);
      const pc = new RTCPeerConnection({
        iceServers: [
          // STUN — descoberta de IP público
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          // TURN Nexus — servidor próprio EC2 (us-east-1) — garante conectividade atrás de firewalls corporativos
          {
            urls: [
              'turn:52.90.49.196:3478',           // UDP/TCP
              'turn:52.90.49.196:3478?transport=tcp', // TCP forçado
              'turns:52.90.49.196:5349'            // TLS
            ],
            username: process.env.NEXT_PUBLIC_TURN_USER || 'nexusvision',
            credential: process.env.NEXT_PUBLIC_TURN_PASSWORD || 'NxV!5JR00DB3ms0lhbsr'
          }
        ]
      });

      peerConnectionsRef.current.set(targetPeerId, pc);

      // Adiciona tracks locais à conexão
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      // Handler para candidatos ICE locais
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          fetch('/api/vision/signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              type: 'webrtc-candidate',
              sender: localPeerId,
              data: {
                target: targetPeerId,
                candidate: event.candidate
              }
            })
          }).catch(e => console.error("Falha ao enviar ICE candidato:", e));
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log(`ICE Connection State com ${peerName}: ${pc.iceConnectionState}`);
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          logToAtena(`[WebRTC] Conexão perdida com ${peerName}.`);
        }
      };

      // Receber track remota do parceiro
      pc.ontrack = (event) => {
        console.log(`Recebeu track remota de ${peerName}`);
        const remoteStream = event.streams[0] || null;
        setRemotePeers(prev => {
          const existing = prev.find(p => p.peerId === targetPeerId);
          if (existing) {
            return prev.map(p => p.peerId === targetPeerId ? { ...p, stream: remoteStream } : p);
          }
          return [...prev, { peerId: targetPeerId, name: peerName, stream: remoteStream }];
        });
        // BUG CORRIGIDO: marca o status de conexão remota como ativo
        if (remoteStream) {
          setIsRemoteConnected(true);
          setRemotePeerName(peerName);
        }
        logToAtena(`[WebRTC] Feed de vídeo de ${peerName} conectado.`);
      };

      // Se fomos nós quem criamos a conexão por ter ID maior, iniciamos o DataChannel e a Oferta
      if (localPeerId > targetPeerId) {
        logToAtena(`[WebRTC] Iniciando chamada com ${peerName}...`);
        const dc = pc.createDataChannel('vision-chat');
        dataChannelsRef.current.set(targetPeerId, dc);
        setupDataChannel(targetPeerId, dc);

        pc.createOffer().then(async (offer) => {
          await pc.setLocalDescription(offer);
          await fetch('/api/vision/signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              type: 'webrtc-offer',
              sender: localPeerId,
              data: {
                target: targetPeerId,
                offer
              }
            })
          });
        }).catch(err => console.error("Erro ao criar oferta:", err));
      } else {
        // Se formos o recebedor, escutamos o canal que o iniciador criará
        pc.ondatachannel = (event) => {
          dataChannelsRef.current.set(targetPeerId, event.channel);
          setupDataChannel(targetPeerId, event.channel);
        };
      }

      return pc;
    };

    const setupDataChannel = (peerId: string, channel: RTCDataChannel) => {
      channel.onopen = () => {
        logToAtena(`[DataChannel] Canal de dados conectado.`);
        setConnectionStatus('Conexão de Dados Ativa!');
        try {
          channel.send(JSON.stringify({
            type: 'identity',
            name: isJoiner ? guestNameRef.current : (userRef.current?.name || 'Diretor Geanderson')
          }));

          // Sempre envia seu idioma ao abrir o canal para o peer (seja Host ou Joiner)
          channel.send(JSON.stringify({
            type: 'language-change',
            code: myLanguageRef.current.code
          }));
        } catch (e) {
          console.error("Erro ao enviar identidade/idioma:", e);
        }
      };
      channel.onclose = () => {
        logToAtena(`[DataChannel] Conexão encerrada.`);
      };
      channel.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'identity') {
            setRemotePeers(prev => prev.map(p => p.peerId === peerId ? { ...p, name: msg.name } : p));
          } else if (msg.type === 'transcript') {
            await handleIncomingTranscript(msg.text, msg.senderName);
          } else if (msg.type === 'language-change') {
            const lang = LANGUAGES.find(l => l.code === msg.code);
            if (lang) {
              setPeerLanguage(lang);
              logToAtena(`[Idioma] Sincronizado para ${lang.name} ${lang.flag}`);
            }
          }
        } catch (err) {
          console.error("Erro ao ler mensagem do DataChannel:", err);
        }
      };
    };

    // 4. Polling de sinalização de malha (Mesh Discovery & Signaling)
    const pollSignaling = async () => {
      try {
        const response = await fetch(`/api/vision/signal?roomId=${roomId}`);
        if (!response.ok) return;

        const resData = await response.json();
        const signals = resData.signals || [];
        const now = Date.now();

        // A. Acha todos os participantes ativos por sinal de presença recente (últimos 15s)
        const presenceSignals = signals.filter((s: any) => s.type === 'presence' && s.payload.sender !== localPeerId);
        
        // Mantém apenas a última presença de cada remetente
        const activePeersMap = new Map<string, { name: string; timestamp: number }>();
        presenceSignals.forEach((s: any) => {
          const timeDiff = now - new Date(s.timestamp).getTime();
          if (timeDiff < 60000) {
            if (!activePeersMap.has(s.payload.sender) || new Date(s.timestamp).getTime() > activePeersMap.get(s.payload.sender)!.timestamp) {
              activePeersMap.set(s.payload.sender, { name: s.payload.data?.name || 'Convidado', timestamp: new Date(s.timestamp).getTime() });
            }
          }
        });

        // Cria conexão de rede para cada participante ativo (limite de 6 pessoas na sala)
        const activePeerIds = Array.from(activePeersMap.keys()).slice(0, 5); // 5 remotos + 1 local = 6 participantes max

        activePeerIds.forEach((peerId) => {
          const peerInfo = activePeersMap.get(peerId)!;
          // Garante a existência do peer no estado visual
          setRemotePeers(prev => {
            if (!prev.some(p => p.peerId === peerId)) {
              return [...prev, { peerId, name: peerInfo.name, stream: null }];
            }
            return prev;
          });
          // Inicializa conexão WebRTC
          getOrCreatePeerConnection(peerId, peerInfo.name);
        });

        // Fecha e remove conexões com participantes inativos
        for (const [peerId, pc] of peerConnectionsRef.current.entries()) {
          if (!activePeerIds.includes(peerId)) {
            console.log("Fechando peer inativo:", peerId);
            pc.close();
            peerConnectionsRef.current.delete(peerId);
            dataChannelsRef.current.delete(peerId);
            candidateQueuesRef.current.delete(peerId);
            setRemotePeers(prev => prev.filter(p => p.peerId !== peerId));
            logToAtena(`[WebRTC] Participante desconectado.`);
          }
        }

        // Se formos convidados (Joiner) e já tivemos participantes conectados na sala,
        // mas agora todos saíram, encerra a sessão e redireciona para a tela inicial pública
        if (isJoiner) {
          const currentlyConnected = Array.from(peerConnectionsRef.current.keys()).length;
          if (currentlyConnected > 0) {
            hasConnectedRef.current = true;
          } else if (hasConnectedRef.current) {
            logToAtena(`[WebRTC] Reunião encerrada pelo Host. Redirecionando...`);
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          }
        }

        // B. Processa ofertas, respostas e candidatos ICE direcionados a nós
        const targetedSignals = signals.filter((s: any) => s.payload.sender !== localPeerId && s.payload.data?.target === localPeerId);

        for (const signal of targetedSignals) {
          const senderId = signal.payload.sender;
          const pc = peerConnectionsRef.current.get(senderId);
          if (!pc) continue;

          if (signal.type === 'webrtc-offer' && !processedSignalsRef.current.has(signal.id)) {
            processedSignalsRef.current.add(signal.id);
            logToAtena(`[WebRTC] Recebeu oferta de sinalização.`);
            await pc.setRemoteDescription(new RTCSessionDescription(signal.payload.data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            
            await fetch('/api/vision/signal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                roomId,
                type: 'webrtc-answer',
                sender: localPeerId,
                data: {
                  target: senderId,
                  answer
                }
              })
            });

            // Processa ICE candidatos acumulados na fila para este sender
            const queue = candidateQueuesRef.current.get(senderId) || [];
            while (queue.length > 0) {
              const cand = queue.shift();
              if (cand) {
                try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) {}
              }
            }
          }

          if (signal.type === 'webrtc-answer' && !processedSignalsRef.current.has(signal.id)) {
            processedSignalsRef.current.add(signal.id);
            logToAtena(`[WebRTC] Conexão respondida.`);
            await pc.setRemoteDescription(new RTCSessionDescription(signal.payload.data.answer));
            
            // Processa ICE candidatos acumulados na fila para este sender
            const queue = candidateQueuesRef.current.get(senderId) || [];
            while (queue.length > 0) {
              const cand = queue.shift();
              if (cand) {
                try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) {}
              }
            }
          }

          if (signal.type === 'webrtc-candidate' && !processedSignalsRef.current.has(signal.id)) {
            processedSignalsRef.current.add(signal.id);
            const cand = signal.payload.data.candidate;
            if (pc.remoteDescription) {
              try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) {}
            } else {
              if (!candidateQueuesRef.current.has(senderId)) {
                candidateQueuesRef.current.set(senderId, []);
              }
              candidateQueuesRef.current.get(senderId)!.push(cand);
            }
          }
        }
      } catch (err: any) {
        console.error("Erro no polling de sinalização:", err);
      }
    };

    const handleBeforeUnload = () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => {
          try { t.stop(); } catch (e) {}
        });
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => {
          try { t.stop(); } catch (e) {}
        });
      }
    };

    // Inicialização
    initLocalMedia().then(() => {
      if (active) {
        sendPresence();
        presenceInterval = setInterval(sendPresence, 4000);
        pollInterval = setInterval(pollSignaling, 2000);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handleBeforeUnload);
      }
    });

    return () => {
      active = false;
      clearInterval(pollInterval);
      clearInterval(presenceInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      
      // Fecha todas as conexões ativas do mapa
      for (const [peerId, pc] of peerConnectionsRef.current.entries()) {
        pc.close();
      }
      peerConnectionsRef.current.clear();
      dataChannelsRef.current.clear();
      candidateQueuesRef.current.clear();

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => {
          try { t.stop(); } catch (e) {}
        });
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => {
          try { t.stop(); } catch (e) {}
        });
      }
    };
  }, [isAuthorized, roomId, isJoiner, hasEnteredName]);

  // Controle em tempo real de mídias (Mute/Camera/Idioma) sem reconectar
  useEffect(() => {
    if (localStreamRef.current) {
      // BUG CORRIGIDO: o áudio NUNCA deve ser silenciado pelo idioma selecionado.
      // O WebRTC transmite áudio cru independente do idioma — a tradução é feita via DataChannel + TTS.
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted; // Só desativa se o usuário clicar em Mutar
      }
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isCameraOn;
      }
    }
  }, [isMuted, isCameraOn]);

  // Garante que o stream local seja sempre acoplado ao elemento de vídeo local
  useEffect(() => {
    if (myVideoRef.current) {
      if (isScreenSharing && screenStreamRef.current) {
        myVideoRef.current.srcObject = screenStreamRef.current;
      } else if (localStreamRef.current) {
        myVideoRef.current.srcObject = localStreamRef.current;
      } else if (stream) {
        myVideoRef.current.srcObject = stream;
      }
    }
  }, [stream, isCameraOn, isScreenSharing, myVideoRef.current]);

  // CONFIGURAÇÃO DO RECONHECIMENTO DE VOZ NATIVO (WEB SPEECH API)
  useEffect(() => {
    if (!isAuthorized || !isMediaReady) return;

    let rec: any = null;
    let noSpeechCount = 0;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        rec = new SpeechRecognition();
        rec.continuous = false; // Configuração ideal para evitar travamentos e loops eternos
        rec.interimResults = false;
        rec.lang = myLanguage.voiceLocale === 'auto' ? 'pt-BR' : myLanguage.voiceLocale;

        rec.onstart = () => {
          setIsListening(true);
          updateMicError(null);
          console.log("Speech recognition started.");
        };

        rec.onerror = (event: any) => {
          // Filtra erros normais de silêncio ou cancelamento para não poluir o console como erro crítico
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.error("Speech recognition error:", event.error);
          } else {
            console.log("Speech recognition warning/silence:", event.error);
          }

          if (event.error === 'not-allowed') {
            updateMicError("Acesso ao microfone negado. Por favor, clique no cadeado ao lado da URL no navegador e ative a permissão do microfone.");
          } else if (event.error === 'audio-capture') {
            updateMicError("Nenhum microfone detectado. Verifique se o dispositivo está conectado.");
          } else if (event.error === 'no-speech') {
            noSpeechCount++;
          } else {
            updateMicError(`Erro no microfone: ${event.error}`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
          console.log("Speech recognition ended.");
          
          // Se houver muito silêncio consecutivo (mais de 3 vezes), aumentamos o delay para 3 segundos (backoff)
          // Isso evita que o navegador trave ou gere loops rápidos que consomem muita CPU
          const backoffDelay = noSpeechCount > 3 ? 3000 : 400;
          
          setTimeout(() => {
            if (isComponentMountedRef.current && isInterpreterActiveRef.current && !isMutedRef.current && !micErrorRef.current && !isTtsPlayingRef.current) {
              try { rec.start(); } catch (e) {
                console.warn("Falha ao reiniciar microfone:", e);
              }
            }
          }, backoffDelay);
        };

        rec.onresult = async (event: any) => {
          noSpeechCount = 0; // Reseta o contador de silêncio no primeiro áudio com sucesso
          const resultIndex = event.resultIndex;
          const transcriptText = event.results[resultIndex][0].transcript;
          if (transcriptText.trim()) {
            handleGeanSpeech(transcriptText);
          }
        };

        recognitionRef.current = rec;

        if (isInterpreterActiveRef.current && !isMutedRef.current) {
          try { rec.start(); } catch (e) {}
        }
      } else {
        updateMicError("Seu navegador não suporta reconhecimento de voz em tempo real. Por favor, utilize o Google Chrome ou o Microsoft Edge.");
      }
    }

    return () => {
      if (rec) {
        try { rec.stop(); } catch (e) {}
      }
    };
  }, [isInterpreterActive, isMuted, isAuthorized, isMediaReady]);

  // LOGICA QUANDO O GEAN FALA (Envia transcrição local via DataChannel)
  const handleGeanSpeech = async (text: string) => {
    if (!isInterpreterActive) return;
    
    setIsGeanSpeaking(true);

    setActiveSubtitle({
      sender: 'gean',
      original: text,
      translated: text, // Exibe o que você falou em português no seu próprio painel
      stage: 'done'
    });

    // Transmitir o texto reconhecido via WebRTC DataChannel para todos os canais conectados
    for (const [peerId, dc] of dataChannelsRef.current.entries()) {
      if (dc.readyState === 'open') {
        try {
          dc.send(JSON.stringify({
            type: 'transcript',
            text: text,
            senderName: isJoiner ? guestNameRef.current : (userRef.current?.name || 'Diretor Geanderson')
          }));
          console.log(`WebRTC: Transcrição enviada via DataChannel para ${peerId}:`, text);
        } catch (err) {
          console.error(`Falha ao enviar transcrição via DataChannel para ${peerId}:`, err);
        }
      }
    }

    // Salva no histórico local
    const newItem: TranscriptItem = {
      id: Math.random().toString(),
      sender: 'gean',
      originalText: text,
      translatedText: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTranscripts(prev => [...prev, newItem]);

    // Atualiza insights da Atena
    updateAtenaInsights('gean', text, text);

    setTimeout(() => {
      setIsGeanSpeaking(false);
      setActiveSubtitle(null);
    }, 4000);
  };

  // LOGICA QUANDO CHEGA UMA TRANSCRIÇÃO REMOTA VIA DATA CHANNEL (TRADUÇÃO SOBERANA REAL)
  const handleIncomingTranscript = async (text: string, senderName: string) => {
    if (!isInterpreterActive) return;

    // Identifica o idioma de destino da tradução para o ouvinte local
    // sourceLanguage é o idioma do peer (ou o idioma detectado se for auto)
    // targetLanguage é o meu idioma (myLanguage)
    const currentLang = peerLanguageRef.current;
    const currentMyLang = myLanguageRef.current;
    
    let resolvedLang = currentLang;
    if (currentLang.code === 'auto') {
      // Detecção multi-idioma: verifica padrões de escrita e palavras-chave por idioma
      const lowerText = text.toLowerCase();
      // Detecção por scripts/caracteres únicos de escrita
      const hasJapanese = /[\u3040-\u30FF\u4E00-\u9FAF]/.test(text) && /[\u3040-\u30FF]/.test(text);
      const hasChinese = /[\u4E00-\u9FAF]/.test(text) && !/[\u3040-\u30FF\uAC00-\uD7AF]/.test(text);
      const hasKorean = /[\uAC00-\uD7AF]/.test(text);
      const hasCyrillic = /[\u0400-\u04FF]/.test(text);
      const hasArabic = /[\u0600-\u06FF]/.test(text);
      const hasDevanagari = /[\u0900-\u097F]/.test(text);
      // Detecção por vocabulário (idiomas latinos)
      const ptIndicators = /[ãõâêîôûáéíóúàèìòùç]|\b(você|está|não|isso|para|com|que|uma|do|da|em|ser|ter|por|seu|sua|mais|como|mas|quando|então|muito|bem|sim|obrigado|bom dia|boa tarde|tudo)\b/;
      const enIndicators = /\b(the|and|you|this|that|with|have|from|they|what|will|your|more|when|then|very|well|yes|thank|hello|good|morning|please|would|could|should|because)\b/;
      const esIndicators = /[ñ]|\b(usted|está|que|para|con|una|del|los|las|también|muy|cuando|porque|cómo|gracias|buenos días|buenas|hola)\b/;
      const deIndicators = /[äöüß]|\b(ich|sie|wir|das|die|der|und|mit|auf|für|nicht|eine|haben|werden|können|möchten|guten|danke)\b/;
      const frIndicators = /\b(je|vous|nous|les|des|une|dans|pour|avec|est|sont|avons|bonjour|merci|s'il vous plaît|très|bien|notre|votre)\b/;
      const nlIndicators = /\b(de|het|een|ik|wij|zij|met|voor|van|niet|kunnen|hebben|bedankt|goedemiddag|goedemorgen|onze)\b/;
      const svIndicators = /\b(det|den|och|för|att|med|som|han|hon|vi|de|är|har|kan|tack|hej|goddag|vår)\b/;
      const trIndicators = /[ğışöüç]|\b(bir|bu|için|ile|da|de|ki|ben|biz|siz|onlar|evet|hayır|teşekkür|merhaba|iyi günler)\b/;
      const plIndicators = /[ąćęłńóśźż]|\b(jest|nie|tak|dla|lub|jak|który|gdzie|kiedy|dziękuję|dzień dobry|proszę|nasz|może)\b/;

      if (hasJapanese) {
        resolvedLang = LANGUAGES.find(l => l.code === 'ja') || currentLang;
      } else if (hasKorean) {
        resolvedLang = LANGUAGES.find(l => l.code === 'ko') || currentLang;
      } else if (hasChinese) {
        resolvedLang = LANGUAGES.find(l => l.code === 'zh') || currentLang;
      } else if (hasCyrillic) {
        resolvedLang = LANGUAGES.find(l => l.code === 'ru') || currentLang;
      } else if (hasArabic) {
        resolvedLang = LANGUAGES.find(l => l.code === 'ar') || currentLang;
      } else if (hasDevanagari) {
        resolvedLang = LANGUAGES.find(l => l.code === 'hi') || currentLang;
      } else if (enIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'en') || currentLang;
      } else if (esIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'es') || currentLang;
      } else if (deIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'de') || currentLang;
      } else if (frIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'fr') || currentLang;
      } else if (nlIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'nl') || currentLang;
      } else if (svIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'sv') || currentLang;
      } else if (trIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'tr') || currentLang;
      } else if (plIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'pl') || currentLang;
      } else if (ptIndicators.test(lowerText)) {
        resolvedLang = LANGUAGES.find(l => l.code === 'pt') || currentLang;
      }
    }
    
    const targetLangObj = currentMyLang;
    const sourceLangObj = resolvedLang;

    const isPt = targetLangObj.code === 'pt';
    const isBothPt = sourceLangObj.code === targetLangObj.code; // Ignora tradução se os dois idiomas forem idênticos (simetria perfeita)

    setIsClientSpeaking(true);

    if (isBothPt) {
      // Se ambos estão em português, mostra a legenda nativa mas NÃO chama tradução nem toca TTS (o som vem limpo direto pelo canal de áudio WebRTC)
      setActiveSubtitle({
        sender: isJoiner ? 'gean' : 'client',
        original: text,
        translated: text,
        stage: 'done'
      });

      const newItem: TranscriptItem = {
        id: Math.random().toString(),
        sender: isJoiner ? 'gean' : 'client',
        originalText: text,
        translatedText: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTranscripts(prev => [...prev, newItem]);
      updateAtenaInsights(isJoiner ? 'gean' : 'client', text, text);

      setTimeout(() => {
        setIsClientSpeaking(false);
        setActiveSubtitle(null);
      }, 5000);
      return;
    }

    // 1. Etapa de fala original (SIMULAÇÃO OU INTERCEPTAÇÃO REAL)
    setActiveSubtitle({
      sender: isJoiner ? 'gean' : 'client', // 'gean' exibe banner GEANDERSON -> CLIENTE, 'client' exibe CLIENTE -> VOCÊ
      original: text,
      translated: isPt 
        ? 'Transmitindo áudio em tempo real (Português direto)...'
        : `Interceptando e traduzindo áudio nativo...`,
      stage: 'translating'
    });

    if (!isPt) {
      playMuffledAudioEffect();
    }

    try {
      // Faz a chamada de tradução real pelo servidor usando Claude 4.5
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          sourceLanguage: sourceLangObj.name,
          targetLanguage: targetLangObj.name
        })
      });

      if (!response.ok) throw new Error("Falha na tradução");
      const data = await response.json();
      const translatedText = data.translation || text;

      // 2. Atualiza legenda com a tradução concluída
      setActiveSubtitle({
        sender: isJoiner ? 'gean' : 'client',
        original: text,
        translated: translatedText,
        stage: 'done'
      });

      // 3. Toca a síntese de voz (TTS) correspondente ao idioma de destino
      playTTS(translatedText, targetLangObj.voiceLocale);

      // 4. Salva no histórico de transcrição local
      const newItem: TranscriptItem = {
        id: Math.random().toString(),
        sender: isJoiner ? 'gean' : 'client',
        originalText: text,
        translatedText: translatedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTranscripts(prev => [...prev, newItem]);

      // Atualiza insights da Atena (só suporta 'gean' ou 'client')
      updateAtenaInsights(isJoiner ? 'gean' : 'client', text, translatedText);

    } catch (err) {
      console.error("Erro ao traduzir transcrição remota:", err);
      // Fallback em caso de erro na tradução
      setActiveSubtitle({
        sender: isJoiner ? 'gean' : 'client',
        original: text,
        translated: text,
        stage: 'done'
      });
      playTTS(text, targetLangObj.voiceLocale);
    }

    // Limpa a legenda após 5 segundos
    setTimeout(() => {
      setIsClientSpeaking(false);
      setActiveSubtitle(null);
    }, 5000);
  };

  // SIMULAR FALA DO CLIENTE (INTERCEPTAÇÃO / DIRETO)
  const handleSimulateClientSpeech = async () => {
    if (isClientSpeaking || isGeanSpeaking) return;

    setIsClientSpeaking(true);
    
    // Se estiver em modo Automático, escolhe aleatoriamente um idioma real
    let activeLang = selectedLanguage;
    const isAutoMode = selectedLanguage.code === 'auto';
    if (isAutoMode) {
      const realLangs = LANGUAGES.slice(1); // pega todos menos o 'auto'
      const randomLang = realLangs[Math.floor(Math.random() * realLangs.length)];
      setDetectedLanguage(randomLang);
      activeLang = randomLang;
    }
    
    const phrases = MOCK_CLIENT_SPEECHES[activeLang.code] || MOCK_CLIENT_SPEECHES.es;
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    // Se o idioma for Português, a transmissão é DIRETA, sem interceptação e sem ruído!
    const isPt = activeLang.code === 'pt';

    // 1. Etapa de fala original (SIMULAÇÃO DE INTERCEPTAÇÃO)
    setActiveSubtitle({
      sender: 'client',
      original: randomPhrase.original,
      translated: isPt 
        ? 'Transmitindo áudio em tempo real (Português direto)...'
        : (isAutoMode 
            ? `[Auto Detect] Identificando idioma do cliente... Detectado: ${activeLang.name} ${activeLang.flag}` 
            : `Interceptando e traduzindo áudio nativo em ${activeLang.name}...`),
      stage: isPt ? 'done' : 'translating'
    });

    if (!isPt) {
      playMuffledAudioEffect();
    }

    // 2. Aguarda delay (2s para interceptação estrangeira, 100ms para português direto)
    const delay = isPt ? 100 : 2000;

    setTimeout(() => {
      setActiveSubtitle({
        sender: 'client',
        original: randomPhrase.original,
        translated: randomPhrase.translation,
        stage: 'done'
      });

      // Fala a tradução/áudio em Português para o Gean ouvir
      playTTS(randomPhrase.translation, 'pt-BR');

      // Salva no histórico
      const newItem: TranscriptItem = {
        id: Math.random().toString(),
        sender: 'client',
        originalText: randomPhrase.original,
        translatedText: randomPhrase.translation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTranscripts(prev => [...prev, newItem]);

      updateAtenaInsights('client', randomPhrase.original, randomPhrase.translation);

      setTimeout(() => {
        setIsClientSpeaking(false);
        setActiveSubtitle(null);
      }, 5000);

    }, delay);
  };

  // EFEITO SONORO DE INTERCEPTAÇÃO (BEERS/STATIC AUDIO ABAFADO)
  const playMuffledAudioEffect = async () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // BUG CORRIGIDO: AudioContext pode estar suspenso por política de autoplay do browser
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime); 
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.8);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 1.8);
    } catch (e) {
      console.warn("AudioContext indisponível.", e);
    }
  };

  // REPRODUZIR SÍNTESE DE VOZ (TTS)
  const playTTS = async (text: string, locale: string) => {
    if (typeof window === 'undefined') return;
    
    // Função auxiliar para tocar stream de áudio com bloqueio de reconhecimento
    const playAudioStream = (audioUrl: string) => {
      return new Promise<void>((resolve, reject) => {
        const audio = new Audio(audioUrl);
        
        audio.onplay = () => {
          isTtsPlayingRef.current = true;
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) {}
          }
        };

        audio.onended = () => {
          isTtsPlayingRef.current = false;
          resolve();
          // Agenda reinício do reconhecimento se ainda estiver ativo e não mudo
          setTimeout(() => {
            if (isInterpreterActive && !isMuted && !micErrorRef.current && !isTtsPlayingRef.current) {
              try { recognitionRef.current.start(); } catch (e) {}
            }
          }, 500);
        };

        audio.onerror = (e) => {
          isTtsPlayingRef.current = false;
          reject(e);
        };

        audio.play().catch((err) => {
          isTtsPlayingRef.current = false;
          reject(err);
        });
      });
    };

    // TTS OFICIAL: Azure Neural
    try {
      const azureResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          gender: 'male',
          locale
        })
      });

      if (!azureResponse.ok) throw new Error(`Azure TTS retornou ${azureResponse.status}`);

      const audioBlob = await azureResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      await playAudioStream(audioUrl);
      URL.revokeObjectURL(audioUrl); // Libera memória
      console.log(`TTS: Azure Neural (${locale}) reproduzido com sucesso.`);
      return;
    } catch (azureErr) {
      console.warn("Azure TTS indisponível. Recorrendo ao sintetizador nativo de emergência...", azureErr);
    }

    // FALLBACK: Sintetizador nativo do navegador
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    
    utterance.onstart = () => {
      isTtsPlayingRef.current = true;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };

    const handleSpeechSynthesisEnded = () => {
      isTtsPlayingRef.current = false;
      setTimeout(() => {
        if (isInterpreterActive && !isMuted && !micErrorRef.current && !isTtsPlayingRef.current) {
          try { recognitionRef.current.start(); } catch (e) {}
        }
      }, 500);
    };

    utterance.onend = handleSpeechSynthesisEnded;
    utterance.onerror = handleSpeechSynthesisEnded;

    const voices = window.speechSynthesis.getVoices();
    const primaryLang = locale.toLowerCase().split('-')[0];
    const matchingVoices = voices.filter(v => 
      v.lang.toLowerCase().replace('_', '-').startsWith(primaryLang)
    );
    
    if (matchingVoices.length > 0) {
      // Prioriza vozes masculinas no fallback local se for pt
      const isPt = primaryLang === 'pt';
      let selectedVoice = null;
      
      if (isPt) {
        selectedVoice = matchingVoices.find(v => 
          v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('antonio')
        );
      }
      
      if (!selectedVoice) {
        selectedVoice = matchingVoices.find(v => 
          v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online')
        );
      }
      
      if (!selectedVoice) {
        selectedVoice = matchingVoices.find(v => v.name.toLowerCase().includes('google'));
      }
      
      if (!selectedVoice) {
        selectedVoice = matchingVoices[0];
      }
      
      utterance.voice = selectedVoice;
      console.log(`TTS Fallback local selecionou: ${selectedVoice.name}`);
    }
    
    utterance.rate = 1.05;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  // ATUALIZAÇÃO AUTOMÁTICA DE INSIGHTS DA ATENA (MOCK INTELIGÊNCIA)
  const updateAtenaInsights = (sender: 'gean' | 'client', original: string, translation: string) => {
    const textToCheck = sender === 'gean' ? original : translation;
    const lowerText = textToCheck.toLowerCase();
    let newInsight = "";

    if (lowerText.includes("assinar") || lowerText.includes("contrato") || lowerText.includes("firmar")) {
      newInsight = "Alerta comercial: Cliente manifestou intenção de assinatura de contrato imediata. Atena recomenda preparar minuta contratual.";
    } else if (lowerText.includes("segurança") || lowerText.includes("criptografia") || lowerText.includes("proteger")) {
      newInsight = "Foco em Segurança: Demonstração da criptografia ponta a ponta e auditoria local recomendadas para fechamento.";
    } else if (lowerText.includes("orçamento") || lowerText.includes("valores") || lowerText.includes("preço") || lowerText.includes("comercial")) {
      newInsight = "Orçamento Aprovado: Os termos financeiros foram aceitos. Próxima ação é o link de pagamento ou faturamento.";
    } else {
      newInsight = `Interação registrada: ${sender === 'gean' ? 'Diretor Gean' : 'Cliente'} comentou sobre detalhes operacionais da tecnologia de tradução.`;
    }

    setAtenaInsights(prev => [newInsight, ...prev.slice(0, 4)]);
  };

  if (isJoiner && !hasEnteredName) {
    return (
      <div className="min-h-screen bg-[#02050a] text-slate-100 font-sans flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Cyber Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-slate-800/85 shadow-[0_0_50px_rgba(99,102,241,0.15)] text-center">
          <div className="w-16 h-16 rounded-2xl border border-indigo-500/40 bg-indigo-950/50 flex items-center justify-center text-indigo-400 font-bold text-2xl shadow-[0_0_20px_rgba(99,102,241,0.2)] mx-auto mb-6">
            N
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">
            Nexus Vision <span className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ml-1">Soberano</span>
          </h1>
          <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
            Identifique-se para entrar na videoconferência criptografada e traduzida da Nexus Holding Group.
          </p>
          <div className="mb-6 text-left space-y-2">
            <label htmlFor="lang-select" className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              Select your Language / Selecione seu Idioma
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                id="lang-select"
                value={myLanguage.code}
                onChange={(e) => {
                  const lang = LANGUAGES.find(l => l.code === e.target.value);
                  if (lang) setMyLanguage(lang);
                }}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner appearance-none cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-[#090d16] text-white">
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {myLanguage.code !== 'pt' && (
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 mb-6 text-left space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3" /> {(PRE_JOIN_TIPS[myLanguage.code] || PRE_JOIN_TIPS['en']).title}
              </h3>
              <ul className="text-[11px] text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-500 mt-0.5">▪</span>
                  <span>{(PRE_JOIN_TIPS[myLanguage.code] || PRE_JOIN_TIPS['en']).t1}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-500 mt-0.5">▪</span>
                  <span>{(PRE_JOIN_TIPS[myLanguage.code] || PRE_JOIN_TIPS['en']).t2}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-500 mt-0.5">▪</span>
                  <span>{(PRE_JOIN_TIPS[myLanguage.code] || PRE_JOIN_TIPS['en']).t3}</span>
                </li>
              </ul>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            if (guestName.trim()) {
              setHasEnteredName(true);
            }
          }} className="space-y-4 text-left">
            <div>
              <label htmlFor="name-input" className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Seu Nome / Empresa</label>
              <input
                id="name-input"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex: Ivoni (Diretora)"
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={!guestName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Entrar na Reunião
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02050a] text-slate-100 font-sans flex flex-col relative overflow-hidden">
      
      {/* Background Cyber Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-10 px-6 py-4 border-b border-slate-800/80 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl border border-blue-500/40 bg-blue-950/50 flex items-center justify-center text-blue-400 font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.25)]">
            N
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Nexus Vision <span className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest">Soberano</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">Sala ID: nhg-vision-soberano-77</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Ocultar o detectedLanguage e o myLanguage do header para deixar a UI limpa (escolha feita no Lobby) */}

          {/* Status da Conexão */}
          <div className="flex items-center gap-2 bg-[#090d16] border border-slate-800/80 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 h-8 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isRemoteConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className="font-medium text-slate-300">{connectionStatus}</span>
          </div>

          {/* Convidar Conexão */}
          {!isJoiner && (
            <button 
              onClick={() => setIsInviteOpen(true)} 
              className="flex items-center gap-1.5 h-8 border border-slate-800/80 bg-[#090d16] hover:bg-slate-900 text-slate-300 hover:text-white text-[11px] font-bold px-3 shadow-sm rounded-lg transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Convidar Conexão</span>
            </button>
          )}

          {/* Voltar ao Gabinete / Sair da Sala */}
          {isJoiner ? (
            <button 
              onClick={() => handleLeave('/')}
              className="flex items-center gap-1.5 h-8 border border-slate-800/80 bg-[#090d16] hover:bg-slate-900 text-slate-300 hover:text-white text-[11px] font-bold px-3 shadow-sm rounded-lg transition-all"
            >
              <span>Sair da Sala</span>
            </button>
          ) : (
            <button 
              onClick={() => handleLeave('/gabinete')}
              className="flex items-center gap-1.5 h-8 border border-slate-800/80 bg-[#090d16] hover:bg-slate-900 text-slate-300 hover:text-white text-[11px] font-bold px-3 shadow-sm rounded-lg transition-all"
            >
              <span>Voltar ao Gabinete</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col lg:flex-row relative z-10 p-6 gap-6 overflow-hidden max-h-[calc(100vh-80px)]">
        
        {/* LEFT COLUMN: MEET VIDEO GRID & SUBTITLES */}
        <div className="flex-1 flex flex-col justify-between gap-6 min-h-0">
          
          {/* VIDEO GRID */}
          <div className={`flex-1 grid gap-6 min-h-0 items-stretch ${
            remotePeers.length === 0
              ? 'md:grid-cols-2 grid-cols-1'
              : (remotePeers.length + 1 === 1 
                  ? 'grid-cols-1' 
                  : (remotePeers.length + 1 === 2 
                      ? 'md:grid-cols-2 grid-cols-1' 
                      : (remotePeers.length + 1 <= 4 
                          ? 'md:grid-cols-2 grid-cols-1' 
                          : 'md:grid-cols-3 grid-cols-2'
                        )
                    )
                )
          }`}>
            
            {/* GEAN'S FEED (LOCAL USER) */}
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 overflow-hidden flex flex-col group shadow-xl aspect-[4/3] w-full">
              {/* Video container */}
              <div className="relative flex-1 flex items-center justify-center bg-black/40 overflow-hidden">
                {isCameraOn || isScreenSharing ? (
                  <video 
                    ref={myVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover ${isScreenSharing ? '' : 'transform -scale-x-100'}`}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 bg-blue-950/50 flex items-center justify-center text-blue-400 text-2xl font-headline font-bold shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                      {isJoiner ? (guestName.charAt(0).toUpperCase() || 'C') : 'G'}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-white">{isJoiner ? guestName : 'Diretor Geanderson'}</p>
                      <p className="text-[10px] text-slate-500">Câmera Desativada</p>
                    </div>
                  </div>
                )}

                {/* Dynamic Overlay labels */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-slate-800/60 text-[10px] font-semibold text-white flex items-center gap-1.5 z-10">
                  <User className="w-3 h-3 text-blue-400" />
                  <span>{isJoiner ? `${guestName} (Você)` : 'Diretor Geanderson (Você)'}</span>
                </div>

                {isGeanSpeaking && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-3xl pointer-events-none animate-pulse" />
                )}
                
                {isGeanSpeaking && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-blue-950/80 backdrop-blur-md border border-blue-500/30 px-2 py-1 rounded-full z-10">
                    <div className="w-1 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-3.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest ml-1">Falando</span>
                  </div>
                )}
              </div>

              {/* Local Control Bar (directly below video) */}
              <div className="bg-slate-950/90 border-t border-slate-800/60 px-4 py-3 flex items-center justify-center gap-3 flex-shrink-0 z-10">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isMuted ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
                  title={isMuted ? "Ativar Microfone" : "Mutar Microfone"}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${!isCameraOn ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
                  title={isCameraOn ? "Desligar Câmera" : "Ligar Câmera"}
                >
                  {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button 
                  onClick={toggleScreenShare}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isScreenSharing ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'}`}
                  title={isScreenSharing ? "Parar Compartilhamento de Tela" : "Compartilhar Tela"}
                >
                  {isScreenSharing ? <ScreenShareOff className="w-4 h-4" /> : <ScreenShare className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setIsInterpreterActive(!isInterpreterActive)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isInterpreterActive ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                  title={isInterpreterActive ? "Pausar Tradutor" : "Iniciar Tradutor"}
                >
                  <Languages className={`w-4 h-4 ${isInterpreterActive ? 'animate-pulse' : ''}`} />
                </button>

                <Button 
                  onClick={() => handleLeave(isJoiner ? "/" : "/gabinete")}
                  variant="destructive"
                  size="icon"
                  className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/10"
                  title="Desligar Chamada"
                >
                  <PhoneOff className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* MOCK CLIENT SIMULATOR (Only shown when no real peers are connected, for offline demonstrations) */}
            {remotePeers.length === 0 && (
              <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 overflow-hidden flex flex-col group shadow-xl aspect-[4/3] w-full">
                {/* Video container */}
                <div className="relative flex-1 flex items-center justify-center bg-black/40 overflow-hidden">
                  {isRemoteConnected ? (
                    <video 
                      ref={remoteVideoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                  ) : isJoiner ? (
                    <div className="flex flex-col items-center gap-5">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                        <Globe className="w-10 h-10 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">Diretor Geanderson</p>
                        <p className="text-xs text-slate-500">Aguardando Host iniciar a transmissão...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-5">
                      {/* Client Avatar with dynamic ring */}
                      <div className={`relative w-24 h-24 rounded-full overflow-hidden border-4 flex-shrink-0 transition-all duration-500 ${isClientSpeaking ? 'border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.4)] scale-105' : 'border-slate-800 bg-slate-900'}`}>
                        {isClientSpeaking ? (
                          <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                            <Globe className="w-10 h-10 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-900">
                            <Image 
                              src="/Vendedora Nexus/Isadora Nexus.png" 
                              alt="Cliente" 
                              fill 
                              className="object-cover opacity-60 grayscale"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs font-semibold text-white flex items-center gap-1.5 justify-center">
                          <span>Carlos Ortega (Madrid)</span>
                          <span className="text-xs">{peerLanguage.flag}</span>
                        </p>
                        <p className="text-[10px] text-slate-500">Cliente Simulador</p>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Name Overlay label */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-slate-800/60 text-[10px] font-semibold text-white flex items-center gap-1.5 z-10">
                    <Globe className="w-3 h-3 text-amber-400" />
                    <span>{isRemoteConnected ? remotePeerName : `Cliente (${peerLanguage.name})`}</span>
                  </div>

                  {isClientSpeaking && !isRemoteConnected && (
                    <div className="absolute inset-0 border-2 border-amber-500 rounded-3xl pointer-events-none animate-pulse" />
                  )}

                  {isClientSpeaking && activeSubtitle?.stage === 'translating' && !isRemoteConnected && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-600/90 border border-red-500/30 text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 animate-bounce shadow-lg shadow-red-600/20 z-10">
                      <VolumeX className="w-3 h-3 animate-pulse" />
                      Áudio Nativo Bloqueado
                    </div>
                  )}

                  {isClientSpeaking && !isRemoteConnected && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-amber-950/80 backdrop-blur-md border border-amber-500/30 px-2 py-1 rounded-full z-10">
                      <div className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-6 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest ml-1">Traduzindo</span>
                    </div>
                  )}
                </div>

                {/* Remote Control/Status Bar (directly below video) */}
                <div className="bg-slate-950/90 border-t border-slate-800/60 px-4 py-3 flex items-center justify-center gap-3 flex-shrink-0 z-10">
                  {!isRemoteConnected && !isJoiner ? (
                    <Button 
                      onClick={handleSimulateClientSpeech}
                      disabled={isClientSpeaking || isGeanSpeaking}
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold h-9 px-4 text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Simular Fala do Cliente
                    </Button>
                  ) : (
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Mic className="w-3.5 h-3.5 text-emerald-400" /> Ativo
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-emerald-400" /> Sinal OK
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* REAL REMOTE PEERS FEEDS (MESH WebRTC) */}
            {remotePeers.map((peer) => (
              <div key={peer.peerId} className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 overflow-hidden flex flex-col group shadow-xl aspect-[4/3] w-full">
                {/* Video container */}
                <div className="relative flex-1 flex items-center justify-center bg-black/40 overflow-hidden">
                  {peer.stream ? (
                    <RemoteVideo peer={peer} />
                  ) : (
                    <div className="flex flex-col items-center gap-5">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                        <User className="w-10 h-10 text-indigo-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">{peer.name}</p>
                        <p className="text-xs text-slate-500">Sem Sinal de Vídeo</p>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Overlay labels */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-slate-800/60 text-[10px] font-semibold text-white flex items-center gap-1.5 z-10">
                    <User className="w-3 h-3 text-indigo-400" />
                    <span>{peer.name}</span>
                  </div>
                </div>

                {/* Remote Participant Status Bar (directly below video) */}
                <div className="bg-slate-950/90 border-t border-slate-800/60 px-4 py-3 flex items-center justify-center gap-3 flex-shrink-0 z-10">
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      {peer.stream ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-red-500" />} 
                      {peer.stream ? 'Conectado' : 'Mutado'}
                    </span>
                    <span className="flex items-center gap-1">
                      {peer.stream ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5 text-red-500" />} 
                      {peer.stream ? 'Vídeo Ativo' : 'Sem Sinal'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DYNAMIC SUBTITLES DISPLAY OVERLAY */}
          <div className="h-28 rounded-2xl border border-slate-800/60 bg-black/60 backdrop-blur-md p-4 flex flex-col justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-amber-500" />
            
            {micError ? (
              <div className="text-center py-1 flex flex-col items-center justify-center gap-1">
                <p className="not-italic text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 justify-center">
                  <MicOff className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  Falha de Acesso ao Microfone
                </p>
                <p className="text-[11px] text-slate-300 max-w-xl mx-auto px-4 leading-relaxed truncate">
                  {micError}
                </p>
                <Button 
                  onClick={requestMicPermission}
                  size="sm"
                  className="mt-1 h-6 px-3 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900 hover:text-white text-[9px] uppercase font-bold"
                >
                  Autorizar Microfone
                </Button>
              </div>
            ) : activeSubtitle ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold font-mono">
                  {activeSubtitle.sender === 'gean' ? (
                    <>
                      <span className="text-blue-400">GEANDERSON</span>
                      <span className="text-slate-600">→</span>
                      <span className="text-slate-400">CLIENTE ({selectedLanguage.name.toUpperCase()})</span>
                    </>
                  ) : (
                    <>
                      <span className="text-amber-400">CLIENTE ({selectedLanguage.name.toUpperCase()})</span>
                      <span className="text-slate-600">→</span>
                      <span className="text-blue-400">VOCÊ (TRADUZIDO EM PORTUGUÊS)</span>
                    </>
                  )}
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-sans uppercase tracking-widest font-normal animate-pulse">
                    {activeSubtitle.stage === 'translating' ? 'Processando' : 'Sincronizado'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Áudio Original</p>
                    <p className="text-xs md:text-sm text-slate-300 truncate md:normal-case font-light italic">
                      "{activeSubtitle.original}"
                    </p>
                  </div>
                  <div className="border-l border-slate-850 pl-4">
                    <p className="text-xs text-amber-400/80 uppercase tracking-widest font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Tradução Soberana
                    </p>
                    <p className="text-sm font-semibold text-white">
                      "{activeSubtitle.translated}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-sm italic py-2 flex flex-col items-center justify-center gap-1">
                <p className="not-italic text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1 justify-center">
                  <Mic className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                  Sistema pronto para escuta ativa
                </p>
                <p className="text-xs">
                  {isListening 
                    ? "Comece a falar em português... Sua voz será traduzida automaticamente." 
                    : "Ative o Intérprete para iniciar a captação de áudio."}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: TRANSCRIPT LOG & ATENA INSIGHTS PANEL */}
        <aside className="w-full lg:w-96 rounded-3xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl max-h-full">
          
          <div className="border-b border-slate-800/80 p-4 bg-slate-950/80 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-500" />
              Monitor de Transmissão
            </span>
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Seguro
            </div>
          </div>

          {/* TRANSCRIPT PANEL */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[250px] lg:max-h-[350px]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Histórico de Traduções</p>
            
            {transcripts.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-center text-slate-600 text-xs italic">
                <span>Nenhuma interação registrada ainda.</span>
              </div>
            ) : (
              transcripts.map((t) => (
                <div key={t.id} className={`flex flex-col gap-1.5 ${t.sender === 'gean' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold ${t.sender === 'gean' ? 'text-blue-400' : 'text-amber-400'}`}>
                    <span>{t.sender === 'gean' ? `Você (${myLanguage.flag})` : `Parceiro (${peerLanguage.flag})`}</span>
                    <span className="text-slate-600 font-normal">{t.timestamp}</span>
                  </div>
                  
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${t.sender === 'gean' ? 'bg-blue-600/10 border border-blue-500/20 text-blue-100 rounded-tr-none' : 'bg-amber-600/10 border border-amber-500/20 text-amber-100 rounded-tl-none'}`}>
                    <p className="text-slate-400 italic mb-1">"{t.originalText}"</p>
                    <div className="border-t border-slate-800/80 pt-1 mt-1 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>{t.translatedText}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ATENA REAL-TIME BUSINESS INSIGHTS */}
          <div className="border-t border-slate-800/80 p-4 bg-slate-950/60 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                Inteligência Atena Activa
              </span>
              <span className="text-[9px] font-bold text-slate-500 font-mono">V4.5</span>
            </div>
            
            <div className="bg-slate-900/60 border border-indigo-500/10 rounded-2xl p-3 space-y-2 shadow-inner">
              {atenaInsights.map((insight, idx) => (
                <div key={idx} className="flex gap-2 text-[11px] leading-relaxed text-slate-300">
                  <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER SYSTEM STATE */}
          <div className="bg-slate-950/90 border-t border-slate-800/80 p-3 text-[9px] font-mono text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 uppercase">
              <Shield className="w-3 h-3 text-emerald-500" />
              AWS Bedrock Security
            </span>
            <span className="uppercase">Vazamento Áudio: 0%</span>
          </div>

        </aside>

      </main>

      {/* FOOTER - LEMBRETE DE TRADUÇÃO (SOMENTE SE NÃO FOR PT) */}
      {myLanguage.code !== 'pt' && (
        <footer className="w-full bg-indigo-950/30 border-t border-indigo-500/20 py-2.5 px-6 flex items-center justify-center z-20 backdrop-blur-md">
          <span className="text-indigo-300 text-xs font-semibold flex items-center gap-2 tracking-wide">
            <Info className="w-3.5 h-3.5 text-indigo-400" /> 
            {FOOTER_REMINDER[myLanguage.code] || FOOTER_REMINDER['en']}
          </span>
        </footer>
      )}

      {/* MODAL CONVIDAR CONEXÃO POR E-MAIL */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="bg-[#0b0f19] border border-slate-800 text-slate-100 max-w-lg shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-white text-lg font-headline flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              Convidar Conexão por E-mail
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Selecione o destinatário dos seus leads da Nexus ou insira um e-mail personalizado para enviar o link seguro.
            </DialogDescription>
          </DialogHeader>

          {/* Container rolável para evitar que o modal fique preso/cortado */}
          <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1.5 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
            {/* Campo Remetente */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Remetente (Conta do Computador)</label>
              <Select value={selectedSender} onValueChange={(val) => {
                setSelectedSender(val);
                if (val !== 'custom') setCustomSender('');
              }}>
                <SelectTrigger className="bg-slate-950/80 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0f19] border-slate-800 text-slate-200">
                  <SelectItem value="vendas@nexustreinamento.com" className="text-emerald-400 font-medium">💼 Vendas (vendas@nexustreinamento.com)</SelectItem>
                  <SelectItem value="geanderson@nexustreinamento.com" className="text-blue-400 font-medium">👑 Geanderson (geanderson@nexustreinamento.com)</SelectItem>
                  <SelectItem value="diretoria@nexustreinamento.com" className="text-indigo-400 font-medium">🏢 Diretoria (diretoria@nexustreinamento.com)</SelectItem>
                  <SelectItem value="pessoal@nexustreinamento.com" className="text-purple-400 font-medium">👤 Pessoal (pessoal@nexustreinamento.com)</SelectItem>
                  <SelectItem value="custom" className="text-amber-400 font-semibold">➕ Digitar Outra Conta...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo Customizado de Remetente (se selecionado "custom") */}
            {selectedSender === 'custom' && (
              <div className="space-y-1 animate-in fade-in-50 duration-200">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">E-mail do Remetente</label>
                <Input
                  type="email"
                  placeholder="exemplo@nexustreinamento.com"
                  value={customSender}
                  onChange={(e) => setCustomSender(e.target.value)}
                  className="bg-slate-950/85 border-slate-800 text-white"
                />
              </div>
            )}

            {/* Campo Destinatário */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Destinatário (Leads da Isadora / Contatos)</label>
              <Select value={selectedRecipient} onValueChange={(val) => {
                setSelectedRecipient(val);
                if (val !== 'custom') setCustomEmail('');
              }}>
                <SelectTrigger className="bg-slate-950/80 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Selecione o lead" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0f19] border-slate-800 text-slate-200">
                  {leadsList.map((lead, idx) => (
                    <SelectItem key={idx} value={lead.email}>
                      👤 {lead.firstName} {lead.lastName} ({lead.company || 'Lead'})
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-amber-400 font-semibold">➕ Inserir Outro E-mail...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo Customizado (se selecionado "custom") */}
            {selectedRecipient === 'custom' && (
              <div className="space-y-1 animate-in fade-in-50 duration-200">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">E-mail Personalizado</label>
                <Input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="bg-slate-950/80 border-slate-800 text-white"
                />
              </div>
            )}

            {/* Visualização de Assunto */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assunto</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="bg-slate-950/80 border-slate-800 text-white"
              />
            </div>

            {/* Visualização de Conteúdo do E-mail */}
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conteúdo do E-mail</label>
                <Button 
                  onClick={handleCopyEmailBody} 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[10px] text-indigo-400 hover:text-white px-2"
                >
                  {isEmailCopied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Clipboard className="w-3.5 h-3.5 mr-1" />}
                  {isEmailCopied ? 'Copiado!' : 'Copiar Texto'}
                </Button>
              </div>
              <Textarea
                readOnly
                value={emailBody}
                className="bg-slate-950/80 border-slate-800 text-slate-300 text-xs min-h-[160px] font-mono leading-relaxed resize-none focus-visible:ring-0"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 shrink-0 border-t border-slate-800/40 pt-3 justify-between">
            <Button
              onClick={handleCopyOnlyLink}
              variant="outline"
              className="border-slate-800 hover:bg-slate-900 text-slate-300 text-xs"
            >
              {isLinkCopied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Clipboard className="w-4 h-4 mr-2" />}
              {isLinkCopied ? 'Link Copiado!' : 'Copiar Apenas Link'}
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleOpenEmailClient}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-medium text-xs gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir no Client
              </Button>
              <Button
                onClick={handleSendDirectEmail}
                disabled={isSendingEmail}
                className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs gap-1.5 shadow-lg shadow-indigo-500/25 disabled:opacity-50"
              >
                {isSendingEmail ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Disparar SMTP Direto
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

interface RemoteVideoProps {
  peer: RemotePeer;
}

function RemoteVideo({ peer }: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
      // BUG CORRIGIDO: garante que o áudio remoto não está silenciado
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      // Força play (necessário em alguns browsers após assign de srcObject)
      videoRef.current.play().catch(e => console.warn('RemoteVideo play() falhou:', e));
    }
  }, [peer.stream]);

  return (
    <video 
      ref={videoRef} 
      autoPlay 
      playsInline 
      muted={false}
      className="w-full h-full object-cover"
    />
  );
}
