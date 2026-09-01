'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { 
  Lock, Mic, MicOff, Video, VideoOff, PhoneOff, Languages, 
  Sparkles, Globe, Shield, Play, VolumeX, Terminal, User, Share2, Clipboard,
  Mail, Send, Check, ExternalLink, Search, Plus, ScreenShare, ScreenShareOff, Info,
  ChevronLeft, ChevronRight, Eye, X, Trash2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// IDIOMAS DO CLIENTE DISPONÃVEIS â€” EXPANSÃƒO GLOBAL NEXUS
const LANGUAGES = [
  { code: 'auto', name: 'DetecÃ§Ã£o AutomÃ¡tica', flag: 'ðŸ”', nativeName: 'Auto Detect', voiceLocale: 'auto' },
  // AMÃ‰RICAS
  { code: 'pt', name: 'PortuguÃªs', flag: 'ðŸ‡§ðŸ‡·', nativeName: 'PortuguÃªs', voiceLocale: 'pt-BR' },
  { code: 'es', name: 'Espanhol', flag: 'ðŸ‡ªðŸ‡¸', nativeName: 'EspaÃ±ol', voiceLocale: 'es-ES' },
  { code: 'en', name: 'InglÃªs', flag: 'ðŸ‡ºðŸ‡¸', nativeName: 'English', voiceLocale: 'en-US' },
  // EUROPA OCIDENTAL
  { code: 'fr', name: 'FrancÃªs', flag: 'ðŸ‡«ðŸ‡·', nativeName: 'FranÃ§ais', voiceLocale: 'fr-FR' },
  { code: 'it', name: 'Italiano', flag: 'ðŸ‡®ðŸ‡¹', nativeName: 'Italiano', voiceLocale: 'it-IT' },
  { code: 'de', name: 'AlemÃ£o', flag: 'ðŸ‡©ðŸ‡ª', nativeName: 'Deutsch', voiceLocale: 'de-DE' },
  { code: 'nl', name: 'HolandÃªs', flag: 'ðŸ‡³ðŸ‡±', nativeName: 'Nederlands', voiceLocale: 'nl-NL' },
  // EUROPA DO NORTE
  { code: 'sv', name: 'Sueco', flag: 'ðŸ‡¸ðŸ‡ª', nativeName: 'Svenska', voiceLocale: 'sv-SE' },
  // EUROPA DO LESTE
  { code: 'ru', name: 'Russo', flag: 'ðŸ‡·ðŸ‡º', nativeName: 'Ð ÑƒÑÑÐºÐ¸Ð¹', voiceLocale: 'ru-RU' },
  { code: 'pl', name: 'PolonÃªs', flag: 'ðŸ‡µðŸ‡±', nativeName: 'Polski', voiceLocale: 'pl-PL' },
  // ORIENTE MÃ‰DIO
  { code: 'ar', name: 'Ãrabe', flag: 'ðŸ‡¸ðŸ‡¦', nativeName: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', voiceLocale: 'ar-SA' },
  { code: 'tr', name: 'Turco', flag: 'ðŸ‡¹ðŸ‡·', nativeName: 'TÃ¼rkÃ§e', voiceLocale: 'tr-TR' },
  // ÃSIA
  { code: 'hi', name: 'Hindi', flag: 'ðŸ‡®ðŸ‡³', nativeName: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€', voiceLocale: 'hi-IN' },
  { code: 'ja', name: 'JaponÃªs', flag: 'ðŸ‡¯ðŸ‡µ', nativeName: 'æ—¥æœ¬èªž', voiceLocale: 'ja-JP' },
  { code: 'zh', name: 'ChinÃªs (Mandarim)', flag: 'ðŸ‡¨ðŸ‡³', nativeName: 'æ™®é€šè¯', voiceLocale: 'zh-CN' },
  { code: 'ko', name: 'Coreano', flag: 'ðŸ‡°ðŸ‡·', nativeName: 'í•œêµ­ì–´', voiceLocale: 'ko-KR' },
];

// DicionÃ¡rio MultilÃ­ngue de Dicas de TraduÃ§Ã£o (Lobby)
const PRE_JOIN_TIPS: Record<string, { title: string; t1: string; t2: string; t3: string }> = {
  pt: {
    title: "Boas PrÃ¡ticas de TraduÃ§Ã£o",
    t1: "Fale pausadamente: O sistema traduz a cada pausa. Frases mais curtas geram traduÃ§Ãµes mais rÃ¡pidas.",
    t2: "Use fones de ouvido: Evita que seu microfone capte a voz da InteligÃªncia Artificial.",
    t3: "Aguarde o cÃ¢mbio: Espere a voz traduzida terminar de falar na sua tela antes de responder."
  },
  en: {
    title: "Translation Best Practices",
    t1: "Speak slowly: The system translates at every pause. Shorter sentences generate faster translations.",
    t2: "Use headphones: Essential to prevent your microphone from picking up the Artificial Intelligence voice.",
    t3: "Wait your turn: Wait for the translated voice to finish speaking before you reply."
  },
  es: {
    title: "Buenas PrÃ¡cticas de TraducciÃ³n",
    t1: "Hable pausadamente: El sistema traduce en cada pausa. Las frases cortas generan traducciones mÃ¡s rÃ¡pidas.",
    t2: "Use auriculares: Esencial para evitar que su micrÃ³fono capte la voz de la Inteligencia Artificial.",
    t3: "Espere el cambio: Espere a que la voz traducida termine de hablar antes de responder."
  },
  fr: {
    title: "Bonnes Pratiques de Traduction",
    t1: "Parlez lentement : Le systÃ¨me traduit Ã  chaque pause. Des phrases plus courtes gÃ©nÃ¨rent des traductions plus rapides.",
    t2: "Utilisez des Ã©couteurs : Essentiel pour Ã©viter que votre microphone ne capte la voix de l'Intelligence Artificielle.",
    t3: "Attendez votre tour : Attendez que la voix traduite termine de parler avant de rÃ©pondre."
  },
  it: {
    title: "Migliori Pratiche di Traduzione",
    t1: "Parla lentamente: Il sistema traduce ad ogni pausa. Le frasi piÃ¹ brevi generano traduzioni piÃ¹ veloci.",
    t2: "Usa le cuffie: Essenziale per evitare che il tuo microfono catturi la voce dell'Intelligenza Artificiale.",
    t3: "Aspetta il tuo turno: Aspetta che la voce tradotta finisca di parlare prima di rispondere."
  },
  de: {
    title: "Ãœbersetzungs-Best-Practices",
    t1: "Sprechen Sie langsam: Das System Ã¼bersetzt bei jeder Pause. KÃ¼rzere SÃ¤tze erzeugen schnellere Ãœbersetzungen.",
    t2: "Verwenden Sie KopfhÃ¶rer: Wichtig, um zu verhindern, dass Ihr Mikrofon die KI-Stimme aufnimmt.",
    t3: "Warten Sie: Warten Sie, bis die Ã¼bersetzte Stimme fertig gesprochen hat, bevor Sie antworten."
  },
  zh: {
    title: "ç¿»è¯‘æœ€ä½³å®žè·µ",
    t1: "è¯·æ…¢æ…¢è¯´ï¼šç³»ç»Ÿåœ¨æ¯æ¬¡åœé¡¿æ—¶è¿›è¡Œç¿»è¯‘ã€‚è¾ƒçŸ­çš„å¥å­ä¼šäº§ç”Ÿæ›´å¿«çš„ç¿»è¯‘ã€‚",
    t2: "ä½¿ç”¨è€³æœºï¼šè¿™å¯¹äºŽé˜²æ­¢éº¦å…‹é£Žæ•æ‰åˆ°äººå·¥æ™ºèƒ½çš„å£°éŸ³è‡³å…³é‡è¦ã€‚",
    t3: "ç­‰å¾…è½®æ¢ï¼šåœ¨å›žç­”ä¹‹å‰ï¼Œè¯·ç­‰å¾…ç¿»è¯‘çš„å£°éŸ³è¯´å®Œã€‚"
  },
  ko: {
    title: "ë²ˆì—­ ëª¨ë²” ì‚¬ë¡€",
    t1: "ì²œì²œížˆ ë§í•˜ì„¸ìš”: ì‹œìŠ¤í…œì€ ì¼ì‹œ ì •ì§€í•  ë•Œë§ˆë‹¤ ë²ˆì—­í•©ë‹ˆë‹¤. ì§§ì€ ë¬¸ìž¥ì´ ë” ë¹ ë¥¸ ë²ˆì—­ì„ ìƒì„±í•©ë‹ˆë‹¤.",
    t2: "í—¤ë“œí° ì‚¬ìš©: ë§ˆì´í¬ê°€ ì¸ê³µì§€ëŠ¥ ëª©ì†Œë¦¬ë¥¼ ìˆ˜ìŒí•˜ì§€ ì•Šë„ë¡ í•˜ëŠ” ë° í•„ìˆ˜ì ìž…ë‹ˆë‹¤.",
    t3: "ìˆœì„œ ê¸°ë‹¤ë¦¬ê¸°: ëŒ€ë‹µí•˜ê¸° ì „ì— ë²ˆì—­ëœ ëª©ì†Œë¦¬ê°€ ëë‚  ë•Œê¹Œì§€ ê¸°ë‹¤ë¦¬ì„¸ìš”."
  },
  ja: {
    title: "ç¿»è¨³ã®ãƒ™ã‚¹ãƒˆãƒ—ãƒ©ã‚¯ãƒ†ã‚£ã‚¹",
    t1: "ã‚†ã£ãã‚Šè©±ã™ï¼šã‚·ã‚¹ãƒ†ãƒ ã¯ä¸€æ™‚åœæ­¢ã”ã¨ã«ç¿»è¨³ã—ã¾ã™ã€‚çŸ­ã„æ–‡ã®æ–¹ãŒæ—©ãç¿»è¨³ã•ã‚Œã¾ã™ã€‚",
    t2: "ãƒ˜ãƒƒãƒ‰ãƒ•ã‚©ãƒ³ã‚’ä½¿ç”¨ã™ã‚‹ï¼šãƒžã‚¤ã‚¯ãŒäººå·¥çŸ¥èƒ½ã®å£°ã‚’æ‹¾ã†ã®ã‚’é˜²ããŸã‚ã«ä¸å¯æ¬ ã§ã™ã€‚",
    t3: "é †ç•ªã‚’å¾…ã¤ï¼šå¿œç­”ã™ã‚‹å‰ã«ã€ç¿»è¨³ã•ã‚ŒãŸéŸ³å£°ãŒè©±ã—çµ‚ã‚ã‚‹ã®ã‚’å¾…ã£ã¦ãã ã•ã„ã€‚"
  }
};

const FOOTER_REMINDER: Record<string, string> = {
  pt: "Fale pausadamente para melhor interpretaÃ§Ã£o do tradutor.",
  en: "Please speak slowly for better translation accuracy.",
  es: "Hable pausadamente para una mejor interpretaciÃ³n del traductor.",
  fr: "Parlez lentement pour une meilleure interprÃ©tation du traducteur.",
  it: "Parla lentamente per una migliore interpretazione del traduttore.",
  de: "Bitte sprechen Sie langsam fÃ¼r eine bessere Ãœbersetzungsgenauigkeit.",
  zh: "è¯·ç¼“æ…¢å‘è¨€ï¼Œä»¥ä¾¿ç¿»è¯‘å™¨æ›´å¥½åœ°è¿›è¡Œå£è¯‘ã€‚",
  ko: "ë²ˆì—­ê¸°ì˜ ë” ë‚˜ì€ í•´ì„ì„ ìœ„í•´ ì²œì²œížˆ ë§ì”€í•´ ì£¼ì‹­ì‹œì˜¤.",
  ja: "ç¿»è¨³æ©Ÿã®è§£é‡ˆã‚’è‰¯ãã™ã‚‹ãŸã‚ã€ã‚†ã£ãã‚Šè©±ã—ã¦ãã ã•ã„ã€‚"
};

// FALAS MOCKADAS DO CLIENTE POR IDIOMA PARA A SIMULAÃ‡ÃƒO DE INTERCEPTAÃ‡ÃƒO â€” EXPANSÃƒO GLOBAL
const MOCK_CLIENT_SPEECHES: Record<string, { original: string; translation: string }[]> = {
  pt: [
    { original: "OlÃ¡ Gean, Ã© um prazer falar com vocÃª. Estou testando a chamada de Ã¡udio direto da Nexus em PortuguÃªs.", translation: "OlÃ¡ Gean, Ã© um prazer falar com vocÃª. Estou testando a chamada de Ã¡udio direto da Nexus em PortuguÃªs." },
    { original: "Esta Ã© uma demonstraÃ§Ã£o da transmissÃ£o de voz sem interceptaÃ§Ã£o. O Ã¡udio flui direto, limpo e em tempo real.", translation: "Esta Ã© uma demonstraÃ§Ã£o da transmissÃ£o de voz sem interceptaÃ§Ã£o. O Ã¡udio flui direto, limpo e em tempo real." },
    { original: "Excelente qualidade de Ã¡udio da ElevenLabs. O som estÃ¡ nÃ­tido e sem nenhuma microfonia na nossa videoconferÃªncia.", translation: "Excelente qualidade de Ã¡udio da ElevenLabs. O som estÃ¡ nÃ­tido e sem nenhuma microfonia na nossa videoconferÃªncia." }
  ],
  es: [
    { original: "Hola Gean, es un placer saludarte. El projeto de Nexus me parece sumamente innovador y queremos avanzar hoy mismo.", translation: "OlÃ¡ Gean, Ã© um prazer te saudar. O projeto da Nexus me parece extremamente inovador e queremos avanÃ§ar hoje mesmo." },
    { original: "Â¿QuÃ© garantÃ­as nos ofrece el sistema de seguranÃ§a on-premise que han desarrollado para proteger nuestros datos estratÃ©gicos?", translation: "Que garantias nos oferece o sistema de seguranÃ§a local que vocÃªs desenvolveram para proteger nossos dados estratÃ©gicos?" },
    { original: "Estamos de acuerdo con los valores de la proposta. Â¿CuÃ¡les son los prÃ³ximos pasos para la firma del contrato comercial?", translation: "Estamos de acordo com os valores da proposta. Quais sÃ£o os prÃ³ximos passos para a assinatura do contrato comercial?" },
    { original: "La demostraciÃ³n de la traducciÃ³n soberana es impresionante. Resuelve un gran problema de comunicaÃ§Ã£o internacional.", translation: "A demonstraÃ§Ã£o da traduÃ§Ã£o soberana Ã© impressionante. Resolve um grande problema de comunicaÃ§Ã£o internacional." }
  ],
  en: [
    { original: "Hello Gean, great to see you. The Nexus proposal is solid and we are ready to move forward with the partnership.", translation: "OlÃ¡ Gean, bom ver vocÃª. A proposta da Nexus Ã© sÃ³lida e estamos prontos para seguir em frente com a parceria." },
    { original: "Can you explain how the real-time audio interception handles latency during unstable internet connections?", translation: "VocÃª pode explicar como a interceptaÃ§Ã£o de Ã¡udio em tempo real lida com a latÃªncia durante conexÃµes instÃ¡veis de internet?" },
    { original: "We have reviewed the strategic budget and approved all the terms. Let's schedule the kickoff meeting for next Monday.", translation: "Revisamos o orÃ§amento estratÃ©gico e aprovamos todos os termos. Vamos agendar a reuniÃ£o de pontapÃ© inicial para a prÃ³xima segunda-feira." },
    { original: "This sovereign communication tool is exactly what our multinational executive board has been looking for.", translation: "Esta ferramenta de comunicaÃ§Ã£o soberana Ã© exatamente o que o nosso conselho executivo multinacional estava procurando." }
  ],
  fr: [
    { original: "Bonjour Gean. C'est un plaisir d'Ãªtre ici. Votre technologie de traduction intÃ©grÃ©e est tout simplement rÃ©volutionnaire.", translation: "Bom dia Gean. Ã‰ um prazer estar aqui. Sua tecnologia de traduÃ§Ã£o integrada Ã© simplesmente revolucionÃ¡ria." },
    { original: "Le budget de la proposition commerciale est validÃ© par notre comitÃ© exÃ©cutif. Nous attendons le contrat final.", translation: "O orÃ§amento da proposta comercial foi validado pelo nosso comitÃª executivo. Estamos aguardando o contrato final." },
    { original: "Pouvez-vous confirmer si le cryptage de bout en bout est bien actif lors de ces visioconfÃ©rences ?", translation: "VocÃª pode confirmer se a criptografia de ponta a ponta estÃ¡ realmente ativa durante estas videoconferÃªncias?" }
  ],
  it: [
    { original: "Buongiorno Gean. La tecnologia Nexus Ã¨ straordinaria, siamo pronti a firmare l'accordo di licenza oggi.", translation: "Bom dia Gean. A tecnologia Nexus Ã© extraordinÃ¡ria, estamos prontos para assinar o acordo de licenÃ§a hoje." },
    { original: "Quali sono i requisiti tecnici per implementare la linea di comunicazione protetta sui nostri server aziendali?", translation: "Quais sÃ£o os requisitos tÃ©cnicos para implementar a linha de comunicaÃ§Ã£o protegida nos nossos servidores corporativos?" },
    { original: "Il sistema di traduzione soberana della Nexus supera qualsiasi soluzione che abbiamo testato sul mercato.", translation: "O sistema de traduÃ§Ã£o soberana da Nexus supera qualquer soluÃ§Ã£o que testamos no mercado." }
  ],
  de: [
    { original: "Guten Tag Gean. Wir sind sehr interessiert an einer langfristigen Kooperation mit der Nexus Holding Group.", translation: "Bom dia Gean. Estamos muito interessados em uma cooperaÃ§Ã£o de longo prazo com o Nexus Holding Group." },
    { original: "KÃ¶nnen Sie die Sicherheitsarchitektur der Ãœbersetzungs-API im Detail erlÃ¤utern?", translation: "VocÃª pode explicar em detalhes a arquitetura de seguranÃ§a da API de traduÃ§Ã£o?" },
    { original: "Unser Vorstand hat das Budget genehmigt. Wir mÃ¶chten so schnell wie mÃ¶glich mit der Implementierung beginnen.", translation: "Nosso conselho aprovou o orÃ§amento. Queremos comeÃ§ar com a implementaÃ§Ã£o o mais rÃ¡pido possÃ­vel." }
  ],
  nl: [
    { original: "Goedemiddag Gean. Wij zijn onder de indruk van de Nexus Vision technologie en willen graag samenwerken.", translation: "Boa tarde Gean. Estamos impressionados com a tecnologia Nexus Vision e gostarÃ­amos de colaborar." },
    { original: "Kunt u ons meer vertellen over de beveiliging en gegevensbescherming van uw systeem?", translation: "VocÃª pode nos contar mais sobre a seguranÃ§a e proteÃ§Ã£o de dados do seu sistema?" },
    { original: "Ons directieteam heeft de proposta goedgekeurd. Wat zijn de volgende stappen voor implementatie?", translation: "Nossa equipe diretiva aprovou a proposta. Quais sÃ£o os prÃ³ximos passos para a implementaÃ§Ã£o?" }
  ],
  sv: [
    { original: "Hej Gean! Nexus Vision Ã¤r en fantastisk lÃ¶sning fÃ¶r vÃ¥r globala kommunikation. Vi Ã¤r imponerade.", translation: "OlÃ¡ Gean! O Nexus Vision Ã© uma soluÃ§Ã£o fantÃ¡stica para nossa comunicaÃ§Ã£o global. Estamos impressionados." },
    { original: "Kan ni fÃ¶rklara hur er realtidsÃ¶versÃ¤ttning fungerar tekniskt sett?", translation: "VocÃª pode explicar como a traduÃ§Ã£o em tempo real funciona do ponto de vista tÃ©cnico?" },
    { original: "Vi har godkÃ¤nt budgeten och vill gÃ¤rna starta samarbetet sÃ¥ snart som mÃ¶jligt.", translation: "Aprovamos o orÃ§amento e gostarÃ­amos de iniciar a colaboraÃ§Ã£o o mais breve possÃ­vel." }
  ],
  ru: [
    { original: "Ð”Ð¾Ð±Ñ€Ñ‹Ð¹ Ð´ÐµÐ½ÑŒ, Ð–ÐµÐ°Ð½. Ð¢ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ñ Nexus Vision Ð¿Ñ€Ð¾Ð¸Ð·Ð²ÐµÐ»Ð° Ð½Ð° Ð½Ð°Ñ Ð¾Ð³Ñ€Ð¾Ð¼Ð½Ð¾Ðµ Ð²Ð¿ÐµÑ‡Ð°Ñ‚Ð»ÐµÐ½Ð¸Ðµ. ÐœÑ‹ Ð³Ð¾Ñ‚Ð¾Ð²Ñ‹ Ðº ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸Ñ‡ÐµÑÑ‚Ð²Ñƒ.", translation: "Boa tarde, Gean. A tecnologia Nexus Vision nos impressionou muito. Estamos prontos para a colaboraÃ§Ã£o." },
    { original: "ÐœÐ¾Ð¶ÐµÑ‚Ðµ Ð»Ð¸ Ð²Ñ‹ Ð¿Ð¾Ð´Ñ€Ð¾Ð±Ð½ÐµÐµ Ð¾Ð±ÑŠÑÑÐ½Ð¸Ñ‚ÑŒ Ð°Ñ€Ñ…Ð¸Ñ‚ÐµÐºÑ‚ÑƒÑ€Ñƒ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸ Ð¸ ÑÑƒÐ²ÐµÑ€ÐµÐ½Ð¸Ñ‚ÐµÑ‚ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð²Ð°ÑˆÐµÐ¹ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹?", translation: "VocÃª poderia explicar com mais detalhes a arquitetura de seguranÃ§a e a soberania dos dados do seu sistema?" },
    { original: "ÐÐ°Ñˆ ÑÐ¾Ð²ÐµÑ‚ Ð´Ð¸Ñ€ÐµÐºÑ‚Ð¾Ñ€Ð¾Ð² Ð¾Ð´Ð¾Ð±Ñ€Ð¸Ð» Ð±ÑŽÐ´Ð¶ÐµÑ‚. ÐÐ°Ð¼ Ð½ÑƒÐ¶Ð½Ð¾ Ð½ÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾ Ð¿ÐµÑ€ÐµÐ¹Ñ‚Ð¸ Ðº ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ð¼ ÑˆÐ°Ð³Ð°Ð¼.", translation: "Nosso conselho de administraÃ§Ã£o aprovou o orÃ§amento. Precisamos avanÃ§ar imediatamente para as prÃ³ximas etapas." },
    { original: "Ð­Ñ‚Ð¾ Ð¸Ð¼ÐµÐ½Ð½Ð¾ Ñ‚Ð¾ Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ Ð´Ð»Ñ Ð¼ÐµÐ¶Ð´ÑƒÐ½Ð°Ñ€Ð¾Ð´Ð½Ñ‹Ñ… Ð¿ÐµÑ€ÐµÐ³Ð¾Ð²Ð¾Ñ€Ð¾Ð², ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ðµ Ð¼Ñ‹ Ð¸ÑÐºÐ°Ð»Ð¸ Ð¼Ð½Ð¾Ð³Ð¾ Ð»ÐµÑ‚.", translation: "Esta Ã© exatamente a soluÃ§Ã£o para negociaÃ§Ãµes internacionais que estÃ¡vamos procurando hÃ¡ muitos anos." }
  ],
  pl: [
    { original: "DzieÅ„ dobry Gean. Technologia Nexus Vision to przeÅ‚omowe rozwiÄ…zanie dla naszych miÄ™dzynarodowych operacji.", translation: "Bom dia Gean. A tecnologia Nexus Vision Ã© uma soluÃ§Ã£o revolucionÃ¡ria para nossas operaÃ§Ãµes internacionais." },
    { original: "Czy mÃ³gÅ‚by Pan wyjaÅ›niÄ‡, jak dziaÅ‚a system tÅ‚umaczenia w czasie rzeczywistym i jakie sÄ… jego ograniczenia?", translation: "VocÃª poderia explicar como funciona o sistema de traduÃ§Ã£o em tempo real e quais sÃ£o suas limitaÃ§Ãµes?" },
    { original: "Nasz zarzÄ…d zatwierdziÅ‚ propozycjÄ™. Chcemy podpisaÄ‡ umowÄ™ jak najszybciej.", translation: "Nossa diretoria aprovou a proposta. Queremos assinar o contrato o mais rÃ¡pido possÃ­vel." }
  ],
  ar: [
    { original: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¬ÙŠØ§Ù†ØŒ ÙŠØ³Ø¹Ø¯Ù†ÙŠ Ø§Ù„ØªØ­Ø¯Ø« Ù…Ø¹Ùƒ. Ø£Ù†Ø§ Ø£Ø®ØªØ¨Ø± Ù…ÙƒØ§Ù„Ù…Ø© Ø§Ù„ØµÙˆØª Ø§Ù„Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ù† Ù†ÙƒØ³Ø³ Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©.", translation: "OlÃ¡ Gean, Ã© um prazer falar com vocÃª. Estou testando a chamada de Ã¡udio direto da Nexus em Ãrabe." },
    { original: "Ù‡Ø°Ø§ Ø¹Ø±Ø¶ ØªÙˆØ¶ÙŠØ­ÙŠ Ù„Ù†Ù‚Ù„ Ø§Ù„ØµÙˆØª Ø¨Ø¯ÙˆÙ† Ø§Ø¹ØªØ±Ø§Ø¶. Ø§Ù„ØµÙˆØª ÙŠØªØ¯ÙÙ‚ Ø¨Ø´ÙƒÙ„ Ù…Ø¨Ø§Ø´Ø± ÙˆÙ†Ø¸ÙŠÙ ÙˆÙÙŠ Ø§Ù„ÙˆÙ‚Øª Ø§Ù„ÙØ¹Ù„ÙŠ.", translation: "Esta Ã© uma demonstraÃ§Ã£o da transmissÃ£o de voz sem interceptaÃ§Ã£o. O Ã¡udio flui direto, limpo e em tempo real." },
    { original: "Ù„Ù‚Ø¯ ÙˆØ§ÙÙ‚ Ù…Ø¬Ù„Ø³Ù†Ø§ Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠ Ø¹Ù„Ù‰ Ø§Ù„Ù…ÙŠØ²Ø§Ù†ÙŠØ© ÙˆÙ†Ø±ØºØ¨ ÙÙŠ Ø§Ù„Ø´Ø±ÙˆØ¹ ÙÙŠ Ø§Ù„ØªÙ†ÙÙŠØ° Ø§Ù„ÙÙˆØ±ÙŠ.", translation: "Nosso conselho executivo aprovou o orÃ§amento e desejamos prosseguir com a implementaÃ§Ã£o imediata." }
  ],
  tr: [
    { original: "Merhaba Gean. Nexus Vision teknolojisi gerÃ§ekten Ã§ok etkileyici. OrtaklÄ±k kurmak istiyoruz.", translation: "OlÃ¡ Gean. A tecnologia Nexus Vision Ã© realmente muito impressionante. Queremos estabelecer uma parceria." },
    { original: "GerÃ§ek zamanlÄ± Ã§eviri sisteminin teknik mimarisini biraz daha aÃ§Ä±klayabilir misiniz?", translation: "VocÃª poderia explicar um pouco mais a arquitetura tÃ©cnica do sistema de traduÃ§Ã£o em tempo real?" },
    { original: "YÃ¶netim kurulumuz teklifi onayladÄ±. SÃ¶zleÅŸmeyi bir an Ã¶nce imzalamak istiyoruz.", translation: "Nosso conselho de administraÃ§Ã£o aprovou a proposta. Queremos assinar o contrato o mais breve possÃ­vel." }
  ],
  hi: [
    { original: "à¤¨à¤®à¤¸à¥à¤¤à¥‡ à¤œà¤¿à¤¯à¤¾à¤¨ à¤œà¥€à¥¤ à¤¨à¥‡à¤•à¥à¤¸à¤¸ à¤µà¤¿à¤œà¤¼à¤¨ à¤•à¥€ à¤¤à¤•à¤¨à¥€à¤• à¤µà¤¾à¤¸à¥à¤¤à¤µ à¤®à¥‡à¤‚ à¤…à¤¦à¥à¤­à¥à¤¤ à¤¹à¥ˆà¥¤ à¤¹à¤® à¤‡à¤¸ à¤¸à¤¾à¤à¥‡à¤¦à¤¾à¤°à¥€ à¤•à¥‹ à¤†à¤—à¥‡ à¤¬à¤¢à¤¼à¤¾à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤", translation: "OlÃ¡, Gean. A tecnologia do Nexus Vision Ã© verdadeiramente incrÃ­vel. Queremos avanÃ§ar com essa parceria." },
    { original: "à¤•à¥à¤¯à¤¾ à¤†à¤ª à¤¹à¤®à¥‡à¤‚ à¤…à¤ªà¤¨à¥‡ à¤¸à¥à¤°à¤•à¥à¤·à¤¾ à¤¬à¥à¤¨à¤¿à¤¯à¤¾à¤¦à¥€ à¤¢à¤¾à¤‚à¤šà¥‡ à¤”à¤° à¤¡à¥‡à¤Ÿà¤¾ à¤¸à¤‚à¤ªà¥à¤°à¤­à¥à¤¤à¤¾ à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤…à¤§à¤¿à¤• à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤¦à¥‡ à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚?", translation: "VocÃª poderia nos fornecer mais informaÃ§Ãµes sobre sua infraestrutura de seguranÃ§a e soberania de dados?" },
    { original: "à¤¹à¤®à¤¾à¤°à¥‡ à¤¬à¥‹à¤°à¥à¤¡ à¤¨à¥‡ à¤¬à¤œà¤Ÿ à¤•à¥‹ à¤®à¤‚à¤œà¥‚à¤°à¥€ à¤¦à¥‡ à¤¦à¥€ à¤¹à¥ˆà¥¤ à¤¹à¤® à¤œà¤²à¥à¤¦ à¤¸à¥‡ à¤œà¤²à¥à¤¦ à¤…à¤¨à¥à¤¬à¤‚à¤§ à¤ªà¤° à¤¹à¤¸à¥à¤¤à¤¾à¤•à¥à¤·à¤° à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤", translation: "Nosso conselho aprovou o orÃ§amento. Queremos assinar o contrato o mais rÃ¡pido possÃ­vel." }
  ],
  ja: [
    { original: "ã“ã‚“ã«ã¡ã¯ã€ã‚¸ã‚¢ãƒ³ã•ã‚“ã€‚Nexus Visionã®æŠ€è¡“ã¯éžå¸¸ã«é©æ–°çš„ã§ã™ã€‚ãœã²ãƒ‘ãƒ¼ãƒˆãƒŠãƒ¼ã‚·ãƒƒãƒ—ã‚’é€²ã‚ãŸã„ã¨æ€ã„ã¾ã™ã€‚", translation: "OlÃ¡, Gean. A tecnologia do Nexus Vision Ã© muito inovadora. GostarÃ­amos muito de avanÃ§ar com a parceria." },
    { original: "ãƒªã‚¢ãƒ«ã‚¿ã‚¤ãƒ ç¿»è¨³ã‚·ã‚¹ãƒ†ãƒ ã®ã‚»ã‚­ãƒ¥ãƒªãƒ†ã‚£ã‚¢ãƒ¼ã‚­ãƒ†ã‚¯ãƒãƒ£ã«ã¤ã„ã¦ã€ã‚‚ã†å°‘ã—è©³ã—ãèª¬æ˜Žã—ã¦ã„ãŸã ã‘ã¾ã™ã‹ï¼Ÿ", translation: "VocÃª poderia explicar com um pouco mais de detalhes a arquitetura de seguranÃ§a do sistema de traduÃ§Ã£o em tempo real?" },
    { original: "å–ç· å½¹ä¼šãŒäºˆç®—ã‚’æ‰¿èªã—ã¾ã—ãŸã€‚ã§ãã‚‹ã ã‘æ—©ãå¥‘ç´„ã‚’ç· çµã—ãŸã„ã¨è€ƒãˆã¦ã„ã¾ã™ã€‚", translation: "Nosso conselho de administraÃ§Ã£o aprovou o orÃ§amento. Esperamos fechar o contrato o mais breve possÃ­vel." },
    { original: "ã“ã®æŠ€è¡“ã¯ã€ç§ãŸã¡ã®å›½éš›ãƒ“ã‚¸ãƒã‚¹äº¤æ¸‰ã«ãŠã„ã¦å¤§ããªã‚¢ãƒ‰ãƒãƒ³ãƒ†ãƒ¼ã‚¸ã‚’ã‚‚ãŸã‚‰ã™ã§ã—ã‚‡ã†ã€‚", translation: "Esta tecnologia trarÃ¡ uma grande vantagem em nossas negociaÃ§Ãµes internacionais de negÃ³cios." }
  ],
  zh: [
    { original: "æ‚¨å¥½ï¼Œå‰å®‰å…ˆç”Ÿã€‚Nexus Visionçš„æŠ€æœ¯ä»¤æˆ‘ä»¬å°è±¡æ·±åˆ»ã€‚æˆ‘ä»¬éžå¸¸å¸Œæœ›å»ºç«‹é•¿æœŸåˆä½œå…³ç³»ã€‚", translation: "OlÃ¡, Gean. A tecnologia do Nexus Vision nos impressionou muito. Temos muito interesse em estabelecer uma parceria de longo prazo." },
    { original: "èƒ½å¦è¯¦ç»†ä»‹ç»ä¸€ä¸‹æ‚¨çš„å®žæ—¶ç¿»è¯‘ç³»ç»Ÿçš„å®‰å…¨æž¶æž„å’Œæ•°æ®ä¸»æƒä¿éšœæŽªæ–½ï¼Ÿ", translation: "VocÃª poderia detalhar a arquitetura de seguranÃ§a do seu sistema de traduÃ§Ã£o em tempo real e as medidas de soberania de dados?" },
    { original: "æˆ‘ä»¬çš„è‘£äº‹ä¼šå·²ç»æ‰¹å‡†äº†é¢„ç®—ã€‚æˆ‘ä»¬å¸Œæœ›å°½å¿«ç­¾ç½²åˆä½œåè®®å¹¶å¼€å§‹å®žæ–½ã€‚", translation: "Nosso conselho de administraÃ§Ã£o aprovou o orÃ§amento. Esperamos assinar o acordo de cooperaÃ§Ã£o e iniciar a implementaÃ§Ã£o o mais breve possÃ­vel." },
    { original: "è¿™é¡¹æŠ€æœ¯å°†å½»åº•æ”¹å˜æˆ‘ä»¬åœ¨äºšå¤ªåœ°åŒºçš„å•†ä¸šè°ˆåˆ¤æ–¹å¼ã€‚éžå¸¸æ„Ÿè°¢æ‚¨çš„æ¼”ç¤ºã€‚", translation: "Esta tecnologia vai transformar completamente nossa forma de conduzir negociaÃ§Ãµes comerciais na regiÃ£o Ãsia-PacÃ­fico. Muito obrigado pela demonstraÃ§Ã£o." }
  ],
  ko: [
    { original: "ì•ˆë…•í•˜ì„¸ìš”, ì§€ì•ˆ ì”¨. Nexus Vision ê¸°ìˆ ì€ ì •ë§ í˜ì‹ ì ìž…ë‹ˆë‹¤. íŒŒíŠ¸ë„ˆì‹­ì„ ì§„í–‰í•˜ê³  ì‹¶ìŠµë‹ˆë‹¤.", translation: "OlÃ¡, Gean. A tecnologia do Nexus Vision Ã© realmente inovadora. GostarÃ­amos de avanÃ§ar com a parceria." },
    { original: "ì‹¤ì‹œê°„ ë²ˆì—­ ì‹œìŠ¤í…œì˜ ë³´ì•ˆ ì•„í‚¤í…ì²˜ì™€ ë°ì´í„° ì£¼ê¶Œì— ëŒ€í•´ ì¢€ ë” ìžì„¸ížˆ ì„¤ëª…í•´ ì£¼ì‹¤ ìˆ˜ ìžˆë‚˜ìš”?", translation: "VocÃª poderia explicar com mais detalhes a arquitetura de seguranÃ§a do sistema de traduÃ§Ã£o em tempo real e a soberania dos dados?" },
    { original: "ì´ì‚¬íšŒì—ì„œ ì˜ˆì‚°ì„ ìŠ¹ì¸í–ˆìŠµë‹ˆë‹¤. ê°€ëŠ¥í•œ í•œ ë¹¨ë¦¬ ê³„ì•½ì„ ì²´ê²°í•˜ê³  ì‹¶ìŠµë‹ˆë‹¤.", translation: "Nosso conselho de administraÃ§Ã£o aprovou o orÃ§amento. GostarÃ­amos de fechar o contrato o mais rÃ¡pido possÃ­vel." },
    { original: "ì´ ê¸°ìˆ ì€ ì•„ì‹œì•„ íƒœí‰ì–‘ ì§€ì—­ì—ì„œì˜ êµ­ì œ ë¹„ì¦ˆë‹ˆìŠ¤ í˜‘ìƒ ë°©ì‹ì„ ì™„ì „ížˆ ë°”ê¿€ ê²ƒìž…ë‹ˆë‹¤.", translation: "Esta tecnologia irÃ¡ transformar completamente a maneira de conduzir negociaÃ§Ãµes internacionais de negÃ³cios na regiÃ£o Ãsia-PacÃ­fico." }
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
  const [selectedSender, setSelectedSender] = useState('vendas@nexusholdinggroup.com.br');
  const [customSender, setCustomSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('Convite para ReuniÃ£o Virtual Segura â€” Nexus Holding Group');
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // ESTADOS DA CHAMADA
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isInterpreterActive, setIsInterpreterActive] = useState(true);
  const [myLanguage, setMyLanguage] = useState(LANGUAGES[0]); // padrÃ£o inicial: portuguÃªs
  const [peerLanguage, setPeerLanguage] = useState(LANGUAGES[0]); // padrÃ£o inicial: portuguÃªs
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const processedSignalsRef = useRef<Set<string>>(new Set());

  // Estados para o Atena Vision Summarizer
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [savedSummaryId, setSavedSummaryId] = useState<string | null>(null);
  const [leaveTargetUrl, setLeaveTargetUrl] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const room = searchParams.get('room') || 'nhg-vision-soberano-default';
      const join = searchParams.get('join') === 'true';
      setRoomId(room);
      setIsJoiner(join);
      setConnectionStatus(join ? 'Aguardando convite do Host...' : 'Criando sala e aguardando Ivoni...');

      // Telemetria em tempo real: Intercepta erros globais e rejeiÃ§Ãµes de promises
      const reportError = (message: string, detail?: string) => {
        fetch('/api/vision/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, type: 'error', detail })
        }).catch(() => {}); // Falha silenciosa para nÃ£o quebrar a UI
      };

      window.onerror = (message, source, lineno, colno, error) => {
        reportError(String(message), `Source: ${source} | Line: ${lineno}:${colno} | Stack: ${error?.stack || ''}`);
      };

      window.onunhandledrejection = (event) => {
        reportError('Unhandled Promise Rejection', String(event.reason?.message || event.reason || ''));
      };
    }
  }, []);

  // FLUXO DE VÃDEO
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

  // TRANSCRIÃ‡ÃƒO & HISTÃ“RICO
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [atenaInsights, setAtenaInsights] = useState<string[]>([
    "Canal de comunicaÃ§Ã£o seguro estabelecido.",
    "Aguardando interaÃ§Ãµes para gerar insights de negÃ³cios."
  ]);

  // COMPARTILHAMENTO DE TELA (SCREEN SHARE)
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const logToAtena = (msg: string) => {
    setAtenaInsights(prev => {
      if (prev[0] === msg) return prev;
      return [msg, ...prev.slice(0, 4)];
    });

    // Envia eventos estruturados (que comeÃ§am com "[") para o banco de telemetria
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
        logToAtena(`[WebRTC] Solicitando compartilhamento de tela com Ã¡udio...`);
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];
        const screenAudioTrack = screenStream.getAudioTracks()[0];

        // Se tiver conexÃµes WebRTC ativas, substitui a track de vÃ­deo e Ã¡udio em todas elas
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
        logToAtena(`[WebRTC] Compartilhamento de tela e Ã¡udio ativo na chamada.`);

        // Atualiza a visualizaÃ§Ã£o local do usuÃ¡rio
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = screenStream;
        }

        // Detecta quando o usuÃ¡rio clica em "Parar compartilhamento" na barra nativa do navegador
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

    // Reverte para a cÃ¢mera local e microfone em todas as conexÃµes
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
    logToAtena(`[WebRTC] VÃ­deo e Ã¡udio da chamada restaurados.`);

    // Restaura a visualizaÃ§Ã£o local
    if (myVideoRef.current && localStreamRef.current) {
      myVideoRef.current.srcObject = localStreamRef.current;
    }

    setIsScreenSharing(false);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/vision/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          transcripts,
          roomName: roomId
        })
      });
      const data = await res.json();
      if (res.ok && data.summary) {
        setGeneratedSummary(data.summary);
      } else {
        setGeneratedSummary("NÃ£o foi possÃ­vel gerar o resumo. Ocorreu um erro no servidor Bedrock.");
      }
    } catch (e) {
      console.error(e);
      setGeneratedSummary("Erro ao conectar com a API da Atena.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSaveSummary = async () => {
    try {
      const res = await fetch('/api/vision/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          transcripts,
          summary: generatedSummary,
          roomName: roomId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSavedSummaryId(data.id);
        alert("âœ… Ata de ReuniÃ£o salva com sucesso na nuvem soberana!");
      } else {
        alert("âŒ Falha ao salvar ata: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("âŒ Erro de rede ao salvar a ata.");
    }
  };

  const handleDeleteSummary = async () => {
    if (!savedSummaryId) return;
    if (!confirm("Tem certeza que deseja excluir esta ata de reuniÃ£o da nuvem permanentemente?")) return;

    try {
      const res = await fetch('/api/vision/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: savedSummaryId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSavedSummaryId(null);
        alert("ðŸ—‘ï¸ Ata de ReuniÃ£o excluÃ­da permanentemente da nuvem.");
      } else {
        alert("âŒ Falha ao excluir ata: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("âŒ Erro de rede ao excluir a ata.");
    }
  };

  const handleCloseSummaryAndLeave = () => {
    setIsSummaryModalOpen(false);
    router.push(leaveTargetUrl || (isJoiner ? '/' : '/gabinete'));
  };

  const handleLeave = (targetUrl: string) => {
    isComponentMountedRef.current = false; // Garante o bloqueio de reinicializaÃ§Ã£o da fala

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

    // Se houver transcriÃ§Ã£o, abre a Ata com a Atena antes de sair!
    if (transcripts.length > 0) {
      setLeaveTargetUrl(targetUrl);
      setIsSummaryModalOpen(true);
      handleGenerateSummary();
    } else {
      if (isJoiner && typeof window !== 'undefined') {
        try {
          window.close();
        } catch (e) {}
        setTimeout(() => {
          router.push('/');
        }, 100);
        return;
      }
      router.push(targetUrl);
    }
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
    if (typeof window !== 'undefined') {
      document.title = "Nexus Vision Connection | Nexus Holding Group";
      
      // Altera o favicon dinamicamente para uma cÃ¢mera de vÃ­deo premium (estilo Lucide Video)
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m22 8-6 4 6 4V8Z'/%3E%3Crect width='14' height='12' x='2' y='6' rx='2' ry='2'/%3E%3C/svg%3E";
    }
  }, []);

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

  // Solicitar permissÃ£o e reiniciar microfone manualmente
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
          updateMicError("Acesso ao microfone recusado. Por favor, clique no cadeado na barra de endereÃ§os para autorizar o microfone.");
        });
    }
  };


  // URL de convite baseada no domÃ­nio atual com fallback para o oficial
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
      // Prefere whatsapp se disponÃ­vel, senÃ£o fone
      params.set('phone', lead.phone || lead.whatsapp || '');
    }
    
    const paramStr = params.toString();
    const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://nexustreinamento.com';
    return `${baseOrigin}/agenda${paramStr ? '?' + paramStr : ''}`;
  }, [selectedRecipient, customEmail, leadsList]);

  const senderSignature = useMemo(() => {
    if (selectedSender === 'custom') {
      return customSender ? `${customSender} â€” Nexus Holding Group` : 'Diretoria â€” Nexus Holding Group';
    }
    if (selectedSender === 'vendas@nexusholdinggroup.com.br') return 'Vendas â€” Nexus Holding Group';
    if (selectedSender === 'geanderson@nexusholdinggroup.com.br') return 'Diretor Geanderson â€” Nexus Holding Group';
    if (selectedSender === 'diretoria@nexustreinamento.com') return 'Diretoria â€” Nexus Holding Group';
    return 'Pessoal â€” Nexus Holding Group';
  }, [selectedSender, customSender]);

  const emailBody = useMemo(() => {
    return `Prezado(a),

Gostaria de convidÃ¡-lo(a) para uma reuniÃ£o virtual de apresentaÃ§Ã£o e alinhamento estratÃ©gico das soluÃ§Ãµes da Nexus Holding Group.

Para escolher o melhor dia e horÃ¡rio para o nosso atendimento exclusivo, por favor acesse a nossa agenda online no link abaixo:
${agendaUrlWithParams}

Ao confirmar o agendamento, o sistema gerarÃ¡ automaticamente o link seguro para a nossa videoconferÃªncia.

Atenciosamente,
${senderSignature}
https://nexustreinamento.com`;
  }, [agendaUrlWithParams, senderSignature]);

  const handleOpenEmailClient = () => {
    const to = selectedRecipient === 'custom' ? customEmail : selectedRecipient;
    if (!to) {
      alert("Por favor, selecione ou insira um e-mail de destinatÃ¡rio.");
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
      alert("Por favor, selecione ou insira um e-mail de destinatÃ¡rio.");
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

  // VERIFICAÃ‡ÃƒO DE AUTORIZAÃ‡ÃƒO E CARREGAMENTO DE CONTATOS
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
            { email: 'luciana.v@grupocalcados.com.br', firstName: 'Luciana', lastName: 'Vanderlei', company: 'Polo CalÃ§adista de Mato LeitÃ£o' },
            { email: 'carlos.medeiros@ipe.rs.gov.br', firstName: 'Carlos', lastName: 'Medeiros', company: 'Prefeitura de IpÃª' }
          ];
          setLeadsList(backupLeads);
          setSelectedRecipient(backupLeads[0].email);
        });
    }
  }, [isAuthorized]);

  // INICIALIZAR E POLICIA WebRTC (ConexÃ£o P2P + SinalizaÃ§Ã£o DynamoDB - MESH para atÃ© 6 pessoas)
  useEffect(() => {
    if (!isAuthorized || typeof window === 'undefined') return;
    if (isJoiner && !hasEnteredName) return; // Aguarda o convidado digitar o nome

    let active = true;
    let pollInterval: NodeJS.Timeout;
    let presenceInterval: NodeJS.Timeout;

    // 1. Acessa mÃ­dia local (cÃ¢mera e Ã¡udio)
    const initLocalMedia = async () => {
      setConnectionStatus('Acessando cÃ¢mera e microfone...');
      let localStream: MediaStream;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640, max: 800 },
            height: { ideal: 480, max: 600 },
            frameRate: { ideal: 15, max: 24 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        localStreamRef.current = localStream;
        setStream(localStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = localStream;
        }
        setIsMediaReady(true);
        logToAtena(`[WebRTC] Ãudio e vÃ­deo capturados.`);
      } catch (err) {
        console.warn("Falha ao obter mÃ­dia local completa. Tentando apenas vÃ­deo...", err);
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
          logToAtena(`[WebRTC] Apenas vÃ­deo capturado (sem Ã¡udio).`);
        } catch (e2) {
          console.error("Falha total de mÃ­dia:", e2);
          setConnectionStatus('Erro: CÃ¢mera nÃ£o detectada');
          logToAtena(`[WebRTC] Erro de hardware: Nenhuma cÃ¢mera detectada.`);
          return;
        }
      }
      setConnectionStatus('Conectado Ã  sala local. Buscando parceiros...');
    };

    // 2. Envia nossa presenÃ§a na sala
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
        console.warn("Erro ao enviar presenÃ§a:", e);
      }
    };

    // 3. Inicializa ConexÃ£o WebRTC com um Peer especÃ­fico
    const getOrCreatePeerConnection = (targetPeerId: string, peerName: string): RTCPeerConnection => {
      if (peerConnectionsRef.current.has(targetPeerId)) {
        return peerConnectionsRef.current.get(targetPeerId)!;
      }

      logToAtena(`[WebRTC] Criando conexÃ£o com ${peerName}...`);
      try {
        const pc = new RTCPeerConnection({
          iceServers: [
            // STUN â€” descoberta de IP pÃºblico
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            // TURN Nexus â€” servidor prÃ³prio EC2 (us-east-1) â€” garante conectividade atrÃ¡s de firewalls corporativos
            {
              urls: [
                'turn:52.90.49.196:3478',           // UDP/TCP
                'turn:52.90.49.196:3478?transport=tcp', // TCP forÃ§ado
                'turns:52.90.49.196:5349'            // TLS
              ],
              username: process.env.NEXT_PUBLIC_TURN_USER || 'nexusvision',
              credential: process.env.NEXT_PUBLIC_TURN_PASSWORD || 'NxV!5JR00DB3ms0lhbsr'
            }
          ]
        });

        peerConnectionsRef.current.set(targetPeerId, pc);

        // Adiciona tracks locais Ã  conexÃ£o
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => {
            try {
              pc.addTrack(track, localStreamRef.current!);
            } catch (err: any) {
              logToAtena(`[Erro Track] Falha ao adicionar track: ${err.message}`);
            }
          });
        }

        // Handler para candidatos ICE locais (com escalonamento para evitar sobrecarregar o DynamoDB com bursts rÃ¡pidos de Trickle ICE)
        let candidateIndex = 0;
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            candidateIndex++;
            const staggerDelay = candidateIndex * 200; // 200ms de intervalo entre cada candidato
            setTimeout(() => {
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
            }, staggerDelay);
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log(`ICE Connection State com ${peerName}: ${pc.iceConnectionState}`);
          if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
            logToAtena(`[WebRTC] ConexÃ£o perdida com ${peerName}.`);
          }
        };

        // Receber track remota do parceiro (com fallback robusto para navegadores/dispositivos sem agrupamento automÃ¡tico de stream)
        pc.ontrack = (event) => {
          console.log(`Recebeu track remota de ${peerName}`);
          const remoteStream = event.streams[0] || null;
          
          setRemotePeers(prev => {
            const existing = prev.find(p => p.peerId === targetPeerId);
            let streamToUse = remoteStream;
            
            if (!streamToUse) {
              streamToUse = existing?.stream || new MediaStream();
              (streamToUse as MediaStream).addTrack(event.track);
            }
            
            if (existing) {
              return prev.map(p => p.peerId === targetPeerId ? { ...p, stream: streamToUse } : p);
            }
            return [...prev, { peerId: targetPeerId, name: peerName, stream: streamToUse }];
          });
          
          setIsRemoteConnected(true);
          setRemotePeerName(peerName);
          logToAtena(`[WebRTC] Feed de vÃ­deo de ${peerName} conectado.`);
        };

        // Se fomos nÃ³s quem criamos a conexÃ£o por ter ID maior, iniciamos o DataChannel e a Oferta
        if (localPeerId > targetPeerId) {
          logToAtena(`[WebRTC] Iniciando chamada com ${peerName}...`);
          const dc = pc.createDataChannel('vision-chat');
          dataChannelsRef.current.set(targetPeerId, dc);
          setupDataChannel(targetPeerId, dc);

          pc.createOffer().then(async (offer) => {
            await pc.setLocalDescription(offer);
            const response = await fetch('/api/vision/signal', {
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
            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`Servidor sinalizador retornou status ${response.status}: ${errText}`);
            }
            logToAtena(`[WebRTC] Oferta enviada com sucesso.`);
          }).catch(err => {
            console.error("Erro ao criar/enviar oferta:", err);
            logToAtena(`[Erro] Falha ao criar/enviar oferta: ${err.message}`);
          });
        } else {
          // Se formos o recebedor, escutamos o canal que o iniciador criarÃ¡
          pc.ondatachannel = (event) => {
            dataChannelsRef.current.set(targetPeerId, event.channel);
            setupDataChannel(targetPeerId, event.channel);
          };
        }

        return pc;
      } catch (err: any) {
        logToAtena(`[Erro WebRTC Geral] Falha ao instanciar conexÃ£o para ${peerName}: ${err.message}`);
        throw err;
      }
    };

    const setupDataChannel = (peerId: string, channel: RTCDataChannel) => {
      channel.onopen = () => {
        logToAtena(`[DataChannel] Canal de dados conectado.`);
        setConnectionStatus('ConexÃ£o de Dados Ativa!');
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
        logToAtena(`[DataChannel] ConexÃ£o encerrada.`);
      };
      channel.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'identity') {
            setRemotePeers(prev => prev.map(p => p.peerId === peerId ? { ...p, name: msg.name } : p));
          } else if (msg.type === 'transcript') {
            await handleIncomingTranscript(msg.text, msg.senderName, msg.senderLang);
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

    // 4. Polling de sinalizaÃ§Ã£o de malha (Mesh Discovery & Signaling)
    const pollSignaling = async () => {
      try {
        const response = await fetch(`/api/vision/signal?roomId=${roomId}`);
        if (!response.ok) return;

        const resData = await response.json();
        const signals = resData.signals || [];
        const now = Date.now();

        // A. Acha todos os participantes ativos por sinal de presenÃ§a recente (Ãºltimos 15s)
        const presenceSignals = signals.filter((s: any) => s.type === 'presence' && s.payload.sender !== localPeerId);
        
        // MantÃ©m apenas a Ãºltima presenÃ§a de cada remetente
        const activePeersMap = new Map<string, { name: string; timestamp: number }>();
        presenceSignals.forEach((s: any) => {
          // Usamos uma tolerÃ¢ncia de 10 minutos (600.000ms) com valor absoluto para evitar
          // que descompassos de relÃ³gios locais (clock drift) descartem participantes ativos.
          const timeDiff = Math.abs(now - new Date(s.timestamp).getTime());
          if (timeDiff < 600000) {
            if (!activePeersMap.has(s.payload.sender) || new Date(s.timestamp).getTime() > activePeersMap.get(s.payload.sender)!.timestamp) {
              activePeersMap.set(s.payload.sender, { name: s.payload.data?.name || 'Convidado', timestamp: new Date(s.timestamp).getTime() });
            }
          }
        });

        // Cria conexÃ£o de rede para cada participante ativo (limite de 6 pessoas na sala)
        const activePeerIds = Array.from(activePeersMap.keys()).slice(0, 5); // 5 remotos + 1 local = 6 participantes max

        activePeerIds.forEach((peerId) => {
          const peerInfo = activePeersMap.get(peerId)!;
          // Garante a existÃªncia do peer no estado visual
          setRemotePeers(prev => {
            if (!prev.some(p => p.peerId === peerId)) {
              return [...prev, { peerId, name: peerInfo.name, stream: null }];
            }
            return prev;
          });
          // Inicializa conexÃ£o WebRTC
          getOrCreatePeerConnection(peerId, peerInfo.name);
        });

        // Fecha e remove conexÃµes com participantes inativos
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

        // Se formos convidados (Joiner) e jÃ¡ tivemos participantes conectados na sala,
        // mas agora todos saÃ­ram, encerra a sessÃ£o e redireciona para a tela inicial pÃºblica
        if (isJoiner) {
          const currentlyConnected = Array.from(peerConnectionsRef.current.keys()).length;
          if (currentlyConnected > 0) {
            hasConnectedRef.current = true;
          } else if (hasConnectedRef.current) {
            logToAtena(`[WebRTC] ReuniÃ£o encerrada pelo Host. Redirecionando...`);
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          }
        }

        // B. Processa ofertas, respostas e candidatos ICE direcionados a nÃ³s
        const targetedSignals = signals.filter((s: any) => s.payload.sender !== localPeerId && s.payload.data?.target === localPeerId);

        for (const signal of targetedSignals) {
          const senderId = signal.payload.sender;
          const pc = peerConnectionsRef.current.get(senderId);
          if (!pc) continue;

          if (signal.type === 'webrtc-offer' && !processedSignalsRef.current.has(signal.id)) {
            processedSignalsRef.current.add(signal.id);
            logToAtena(`[WebRTC] Recebeu oferta de sinalizaÃ§Ã£o.`);
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(signal.payload.data.offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              
              const response = await fetch('/api/vision/signal', {
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
              if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Servidor sinalizador retornou status ${response.status}: ${errText}`);
              }
              logToAtena(`[WebRTC] Resposta enviada com sucesso.`);
            } catch (err: any) {
              console.error("Erro ao responder oferta:", err);
              logToAtena(`[Erro] Falha ao responder oferta: ${err.message}`);
            }

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
            logToAtena(`[WebRTC] ConexÃ£o respondida.`);
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(signal.payload.data.answer));
            } catch (err: any) {
              console.error("Erro ao aplicar resposta:", err);
              logToAtena(`[Erro] Falha ao aplicar resposta: ${err.message}`);
            }
            
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
        console.error("Erro no polling de sinalizaÃ§Ã£o:", err);
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

    // InicializaÃ§Ã£o
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
      
      // Fecha todas as conexÃµes ativas do mapa
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

  // Controle em tempo real de mÃ­dias (Mute/Camera/Idioma) sem reconectar
  useEffect(() => {
    if (localStreamRef.current) {
      // BUG CORRIGIDO: o Ã¡udio NUNCA deve ser silenciado pelo idioma selecionado.
      // O WebRTC transmite Ã¡udio cru independente do idioma â€” a traduÃ§Ã£o Ã© feita via DataChannel + TTS.
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted; // SÃ³ desativa se o usuÃ¡rio clicar em Mutar
      }
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isCameraOn;
      }
    }
  }, [isMuted, isCameraOn]);

  // Garante que o stream local seja sempre acoplado ao elemento de vÃ­deo local
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

  // CONFIGURAÃ‡ÃƒO DO RECONHECIMENTO DE VOZ NATIVO (WEB SPEECH API)
  useEffect(() => {
    if (!isAuthorized || !isMediaReady) return;

    let rec: any = null;
    let noSpeechCount = 0;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        rec = new SpeechRecognition();
        rec.continuous = false; // ConfiguraÃ§Ã£o ideal para evitar travamentos e loops eternos
        rec.interimResults = false;
        rec.lang = myLanguage.voiceLocale === 'auto' ? 'pt-BR' : myLanguage.voiceLocale;

        rec.onstart = () => {
          setIsListening(true);
          updateMicError(null);
          console.log("Speech recognition started.");
        };

        rec.onerror = (event: any) => {
          // Filtra erros normais de silÃªncio ou cancelamento para nÃ£o poluir o console como erro crÃ­tico
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.error("Speech recognition error:", event.error);
          } else {
            console.log("Speech recognition warning/silence:", event.error);
          }

          if (event.error === 'not-allowed') {
            updateMicError("Acesso ao microfone negado. Por favor, clique no cadeado ao lado da URL no navegador e ative a permissÃ£o do microfone.");
          } else if (event.error === 'audio-capture') {
            updateMicError("Nenhum microfone detectado. Verifique se o dispositivo estÃ¡ conectado.");
          } else if (event.error === 'no-speech') {
            noSpeechCount++;
          } else {
            updateMicError(`Erro no microfone: ${event.error}`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
          console.log("Speech recognition ended.");
          
          // Se houver muito silÃªncio consecutivo (mais de 3 vezes), aumentamos o delay para 3 segundos (backoff)
          // Isso evita que o navegador trave ou gere loops rÃ¡pidos que consomem muita CPU
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
          noSpeechCount = 0; // Reseta o contador de silÃªncio no primeiro Ã¡udio com sucesso
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
        updateMicError("Seu navegador nÃ£o suporta reconhecimento de voz em tempo real. Por favor, utilize o Google Chrome ou o Microsoft Edge.");
      }
    }

    return () => {
      if (rec) {
        try { rec.stop(); } catch (e) {}
      }
    };
  }, [isInterpreterActive, isMuted, isAuthorized, isMediaReady, myLanguage]);

  // LOGICA QUANDO O GEAN FALA (Envia transcriÃ§Ã£o local via DataChannel)
  const handleGeanSpeech = async (text: string) => {
    if (!isInterpreterActive) return;
    
    setIsGeanSpeaking(true);

    setActiveSubtitle({
      sender: 'gean',
      original: text,
      translated: text, // Exibe o que vocÃª falou em portuguÃªs no seu prÃ³prio painel
      stage: 'done'
    });

    // Transmitir o texto reconhecido via WebRTC DataChannel para todos os canais conectados
    for (const [peerId, dc] of dataChannelsRef.current.entries()) {
      if (dc.readyState === 'open') {
        try {
          dc.send(JSON.stringify({
            type: 'transcript',
            text: text,
            senderName: isJoiner ? guestNameRef.current : (userRef.current?.name || 'Diretor Geanderson'),
            senderLang: myLanguageRef.current.code
          }));
          console.log(`WebRTC: TranscriÃ§Ã£o enviada via DataChannel para ${peerId}:`, text);
        } catch (err) {
          console.error(`Falha ao enviar transcriÃ§Ã£o via DataChannel para ${peerId}:`, err);
        }
      }
    }

    // Salva no histÃ³rico local
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

  // LOGICA QUANDO CHEGA UMA TRANSCRIÃ‡ÃƒO REMOTA VIA DATA CHANNEL (TRADUÃ‡ÃƒO SOBERANA REAL)
  const handleIncomingTranscript = async (text: string, senderName: string, senderLang?: string) => {
    if (!isInterpreterActive) return;

    // Identifica o idioma de destino da traduÃ§Ã£o para o ouvinte local
    // sourceLanguage Ã© o idioma do peer (ou o idioma detectado se for auto)
    // targetLanguage Ã© o meu idioma (myLanguage)
    const currentLang = peerLanguageRef.current;
    const currentMyLang = myLanguageRef.current;
    
    let resolvedLang = currentLang;
    if (senderLang && senderLang !== 'auto') {
      resolvedLang = LANGUAGES.find(l => l.code === senderLang) || currentLang;
    } else if (true) { // FORCED: Sempre detecta o idioma real do texto recebido para evitar eco de TTS quando alguï¿½m fala o mesmo idioma que o destino
      // DetecÃ§Ã£o multi-idioma: verifica padrÃµes de escrita e palavras-chave por idioma
      const lowerText = text.toLowerCase();
      // DetecÃ§Ã£o por scripts/caracteres Ãºnicos de escrita
      const hasJapanese = /[\u3040-\u30FF\u4E00-\u9FAF]/.test(text) && /[\u3040-\u30FF]/.test(text);
      const hasChinese = /[\u4E00-\u9FAF]/.test(text) && !/[\u3040-\u30FF\uAC00-\uD7AF]/.test(text);
      const hasKorean = /[\uAC00-\uD7AF]/.test(text);
      const hasCyrillic = /[\u0400-\u04FF]/.test(text);
      const hasArabic = /[\u0600-\u06FF]/.test(text);
      const hasDevanagari = /[\u0900-\u097F]/.test(text);
      // DetecÃ§Ã£o por vocabulÃ¡rio (idiomas latinos)
      const ptIndicators = /[Ã£ÃµÃ¢ÃªÃ®Ã´Ã»Ã¡Ã©Ã­Ã³ÃºÃ Ã¨Ã¬Ã²Ã¹Ã§]|\b(vocÃª|estÃ¡|nÃ£o|isso|para|com|que|uma|do|da|em|ser|ter|por|seu|sua|mais|como|mas|quando|entÃ£o|muito|bem|sim|obrigado|bom dia|boa tarde|tudo)\b/;
      const enIndicators = /\b(the|and|you|this|that|with|have|from|they|what|will|your|more|when|then|very|well|yes|thank|hello|good|morning|please|would|could|should|because)\b/;
      const esIndicators = /[Ã±]|\b(usted|estÃ¡|que|para|con|una|del|los|las|tambiÃ©n|muy|cuando|porque|cÃ³mo|gracias|buenos dÃ­as|buenas|hola)\b/;
      const deIndicators = /[Ã¤Ã¶Ã¼ÃŸ]|\b(ich|sie|wir|das|die|der|und|mit|auf|fÃ¼r|nicht|eine|haben|werden|kÃ¶nnen|mÃ¶chten|guten|danke)\b/;
      const frIndicators = /\b(je|vous|nous|les|des|une|dans|pour|avec|est|sont|avons|bonjour|merci|s'il vous plaÃ®t|trÃ¨s|bien|notre|votre)\b/;
      const nlIndicators = /\b(de|het|een|ik|wij|zij|met|voor|van|niet|kunnen|hebben|bedankt|goedemiddag|goedemorgen|onze)\b/;
      const svIndicators = /\b(det|den|och|fÃ¶r|att|med|som|han|hon|vi|de|Ã¤r|har|kan|tack|hej|goddag|vÃ¥r)\b/;
      const trIndicators = /[ÄŸÄ±ÅŸÃ¶Ã¼Ã§]|\b(bir|bu|iÃ§in|ile|da|de|ki|ben|biz|siz|onlar|evet|hayÄ±r|teÅŸekkÃ¼r|merhaba|iyi gÃ¼nler)\b/;
      const plIndicators = /[Ä…Ä‡Ä™Å‚Å„Ã³Å›ÅºÅ¼]|\b(jest|nie|tak|dla|lub|jak|ktÃ³ry|gdzie|kiedy|dziÄ™kujÄ™|dzieÅ„ dobry|proszÄ™|nasz|moÅ¼e)\b/;

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
    
    // Se o meu idioma estiver em 'auto' (DetecÃ§Ã£o AutomÃ¡tica), o destino padrÃ£o de audiÃ§Ã£o deve ser sempre o PortuguÃªs (pt-BR)
    const targetLangObj = currentMyLang.code === 'auto'
      ? (LANGUAGES.find(l => l.code === 'pt') || currentMyLang)
      : currentMyLang;
    const sourceLangObj = resolvedLang;

    const isPt = targetLangObj.code === 'pt';
    const isBothPt = sourceLangObj.code === targetLangObj.code; // Ignora traduÃ§Ã£o se os dois idiomas forem idÃªnticos (simetria perfeita)

    setIsClientSpeaking(true);

    if (isBothPt) {
      // Se ambos estÃ£o em portuguÃªs, mostra a legenda nativa mas NÃƒO chama traduÃ§Ã£o nem toca TTS (o som vem limpo direto pelo canal de Ã¡udio WebRTC)
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

    // 1. Etapa de fala original (SIMULAÃ‡ÃƒO OU INTERCEPTAÃ‡ÃƒO REAL)
    setActiveSubtitle({
      sender: isJoiner ? 'gean' : 'client', // 'gean' exibe banner GEANDERSON -> CLIENTE, 'client' exibe CLIENTE -> VOCÃŠ
      original: text,
      translated: isPt 
        ? 'Transmitindo Ã¡udio em tempo real (PortuguÃªs direto)...'
        : `Interceptando e traduzindo Ã¡udio nativo...`,
      stage: 'translating'
    });

    if (!isPt) {
      playMuffledAudioEffect();
    }

    try {
      // Faz a chamada de traduÃ§Ã£o real pelo servidor usando Claude 4.5
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          sourceLanguage: sourceLangObj.name,
          targetLanguage: targetLangObj.name
        })
      });

      if (!response.ok) throw new Error("Falha na traduÃ§Ã£o");
      const data = await response.json();
      const translatedText = data.translation || text;

      // 2. Atualiza legenda com a traduÃ§Ã£o concluÃ­da
      setActiveSubtitle({
        sender: isJoiner ? 'gean' : 'client',
        original: text,
        translated: translatedText,
        stage: 'done'
      });

      // 3. Toca a sÃ­ntese de voz (TTS) correspondente ao idioma de destino
      if (sourceLangObj.code !== targetLangObj.code && text.trim().toLowerCase() !== translatedText.trim().toLowerCase()) { playTTS(translatedText, targetLangObj.voiceLocale); }

      // 4. Salva no histÃ³rico de transcriÃ§Ã£o local
      const newItem: TranscriptItem = {
        id: Math.random().toString(),
        sender: isJoiner ? 'gean' : 'client',
        originalText: text,
        translatedText: translatedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTranscripts(prev => [...prev, newItem]);

      // Atualiza insights da Atena (sÃ³ suporta 'gean' ou 'client')
      updateAtenaInsights(isJoiner ? 'gean' : 'client', text, translatedText);

    } catch (err) {
      console.error("Erro ao traduzir transcriÃ§Ã£o remota:", err);
      // Fallback: mostra legenda com erro, mas NAO toca TTS com texto nao traduzido
      setActiveSubtitle({
        sender: isJoiner ? 'gean' : 'client',
        original: text,
        translated: '[Traducao indisponivel] ' + text,
        stage: 'done'
      });
      // Nao chama playTTS aqui - sem traducao, sem audio sintetico no idioma errado
    }

    // Limpa a legenda apÃ³s 5 segundos
    setTimeout(() => {
      setIsClientSpeaking(false);
      setActiveSubtitle(null);
    }, 5000);
  };

  // SIMULAR FALA DO CLIENTE (INTERCEPTAÃ‡ÃƒO / DIRETO)
  const handleSimulateClientSpeech = async () => {
    if (isClientSpeaking || isGeanSpeaking) return;

    setIsClientSpeaking(true);
    
    // Se estiver em modo AutomÃ¡tico, escolhe aleatoriamente um idioma real
    let activeLang = peerLanguage;
    const isAutoMode = peerLanguage.code === 'auto';
    if (isAutoMode) {
      const realLangs = LANGUAGES.slice(1); // pega todos menos o 'auto'
      const randomLang = realLangs[Math.floor(Math.random() * realLangs.length)];
      setPeerLanguage(randomLang);
      activeLang = randomLang;
    }
    
    const phrases = MOCK_CLIENT_SPEECHES[activeLang.code] || MOCK_CLIENT_SPEECHES.es;
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    // Se o idioma for PortuguÃªs, a transmissÃ£o Ã© DIRETA, sem interceptaÃ§Ã£o e sem ruÃ­do!
    const isPt = activeLang.code === 'pt';

    // 1. Etapa de fala original (SIMULAÃ‡ÃƒO DE INTERCEPTAÃ‡ÃƒO)
    setActiveSubtitle({
      sender: 'client',
      original: randomPhrase.original,
      translated: isPt 
        ? 'Transmitindo Ã¡udio em tempo real (PortuguÃªs direto)...'
        : (isAutoMode 
            ? `[Auto Detect] Identificando idioma do cliente... Detectado: ${activeLang.name} ${activeLang.flag}` 
            : `Interceptando e traduzindo Ã¡udio nativo em ${activeLang.name}...`),
      stage: isPt ? 'done' : 'translating'
    });

    if (!isPt) {
      playMuffledAudioEffect();
    }

    // 2. Aguarda delay (2s para interceptaÃ§Ã£o estrangeira, 100ms para portuguÃªs direto)
    const delay = isPt ? 100 : 2000;

    setTimeout(() => {
      setActiveSubtitle({
        sender: 'client',
        original: randomPhrase.original,
        translated: randomPhrase.translation,
        stage: 'done'
      });

      // Fala a traduÃ§Ã£o/Ã¡udio em PortuguÃªs para o Gean ouvir
      if (!isPt) { playTTS(randomPhrase.translation, 'pt-BR'); }

      // Salva no histÃ³rico
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

  // EFEITO SONORO DE INTERCEPTAÃ‡ÃƒO (BEERS/STATIC AUDIO ABAFADO)
  const playMuffledAudioEffect = async () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // BUG CORRIGIDO: AudioContext pode estar suspenso por polÃ­tica de autoplay do browser
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
      console.warn("AudioContext indisponÃ­vel.", e);
    }
  };

  // REPRODUZIR SÃNTESE DE VOZ (TTS)
  const playTTS = async (text: string, locale: string) => {
    if (typeof window === 'undefined') return;
    
    // Remove emojis, sÃ­mbolos e dingbats para evitar que o motor de sÃ­ntese de voz (TTS) os leia em voz alta
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{2600}-\u{26FF}]|[\u{2B00}-\u{2BFF}]/gu, '').trim();
    
    // Se sobrar apenas string vazia pÃ³s limpeza, cancela para evitar chamada sem conteÃºdo
    if (!cleanText) return;
    
    // FunÃ§Ã£o auxiliar para tocar stream de Ã¡udio com bloqueio de reconhecimento
    const playAudioStream = (audioUrl: string) => {
      return new Promise<void>((resolve, reject) => {
        const audio = new Audio(audioUrl);
        
        audio.onplay = () => {
          isTtsPlayingRef.current = true;
          window.dispatchEvent(new CustomEvent('tts-state-change', { detail: { isPlaying: true } }));
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) {}
          }
        };

        audio.onended = () => {
          window.dispatchEvent(new CustomEvent('tts-state-change', { detail: { isPlaying: false } }));
          isTtsPlayingRef.current = false;
          resolve();
          // Agenda reinÃ­cio do reconhecimento se ainda estiver ativo e nÃ£o mudo (usando refs para evitar fechamento de estado obsoleto)
          setTimeout(() => {
            if (isInterpreterActiveRef.current && !isMutedRef.current && !micErrorRef.current && !isTtsPlayingRef.current) {
              try { recognitionRef.current.start(); } catch (e) {}
            }
          }, 500);
        };

        audio.onerror = (e) => {
          window.dispatchEvent(new CustomEvent('tts-state-change', { detail: { isPlaying: false } }));
          isTtsPlayingRef.current = false;
          reject(e);
        };

        audio.play().catch((err) => {
          window.dispatchEvent(new CustomEvent('tts-state-change', { detail: { isPlaying: false } }));
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
          text: cleanText,
          gender: 'male',
          locale
        })
      });

      if (!azureResponse.ok) throw new Error(`Azure TTS retornou ${azureResponse.status}`);

      const audioBlob = await azureResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      await playAudioStream(audioUrl);
      URL.revokeObjectURL(audioUrl); // Libera memÃ³ria
      console.log(`TTS: Azure Neural (${locale}) reproduzido com sucesso.`);
      return;
    } catch (azureErr) {
      console.warn("Azure TTS indisponÃ­vel. Recorrendo ao sintetizador nativo de emergÃªncia...", azureErr);
    }

    // FALLBACK: Sintetizador nativo do navegador
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
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
        if (isInterpreterActiveRef.current && !isMutedRef.current && !micErrorRef.current && !isTtsPlayingRef.current) {
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

  // ATUALIZAÃ‡ÃƒO AUTOMÃTICA DE INSIGHTS DA ATENA (MOCK INTELIGÃŠNCIA)
  const updateAtenaInsights = (sender: 'gean' | 'client', original: string, translation: string) => {
    const textToCheck = sender === 'gean' ? original : translation;
    const lowerText = textToCheck.toLowerCase();
    let newInsight = "";

    if (lowerText.includes("assinar") || lowerText.includes("contrato") || lowerText.includes("firmar")) {
      newInsight = "Alerta comercial: Cliente manifestou intenÃ§Ã£o de assinatura de contrato imediata. Atena recomenda preparar minuta contratual.";
    } else if (lowerText.includes("seguranÃ§a") || lowerText.includes("criptografia") || lowerText.includes("proteger")) {
      newInsight = "Foco em SeguranÃ§a: DemonstraÃ§Ã£o da criptografia ponta a ponta e auditoria local recomendadas para fechamento.";
    } else if (lowerText.includes("orÃ§amento") || lowerText.includes("valores") || lowerText.includes("preÃ§o") || lowerText.includes("comercial")) {
      newInsight = "OrÃ§amento Aprovado: Os termos financeiros foram aceitos. PrÃ³xima aÃ§Ã£o Ã© o link de pagamento ou faturamento.";
    } else {
      newInsight = `InteraÃ§Ã£o registrada: ${sender === 'gean' ? 'Diretor Gean' : 'Cliente'} comentou sobre detalhes operacionais da tecnologia de traduÃ§Ã£o.`;
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
            Nexus Vision Connection <span className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ml-1">Soberano</span>
          </h1>
          <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
            Identifique-se para entrar na videoconferÃªncia criptografada e traduzida da Nexus Holding Group.
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
                  <span className="text-indigo-500 mt-0.5">â–ª</span>
                  <span>{(PRE_JOIN_TIPS[myLanguage.code] || PRE_JOIN_TIPS['en']).t1}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-500 mt-0.5">â–ª</span>
                  <span>{(PRE_JOIN_TIPS[myLanguage.code] || PRE_JOIN_TIPS['en']).t2}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-500 mt-0.5">â–ª</span>
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
              Entrar na ReuniÃ£o
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
        <div className="relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl border border-amber-500/30 bg-slate-950/60 shadow-[0_0_30px_rgba(245,158,11,0.15)] overflow-hidden">
          {/* Fundo laranja pulsante integrado com o estilo do gabinete */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-500/5 animate-[pulse_3.5s_infinite] pointer-events-none" />
          
          <div className="relative z-10 w-10 h-10 rounded-lg border border-amber-500/40 bg-amber-950/50 flex items-center justify-center text-amber-400 font-bold text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            N
          </div>
          <div className="relative z-10">
            <h1 className="text-lg md:text-xl font-black tracking-wider text-white flex items-center gap-2">
              <span className="text-slate-100 font-extrabold">Nexus Vision</span>
              <span className="text-amber-400 font-bold">Connection</span>
              <span className="text-[10px] bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ml-1 shadow-[0_0_8px_rgba(245,158,11,0.2)]">Soberano</span>
            </h1>
            <p className="text-[9px] text-amber-500/60 uppercase tracking-wider font-semibold font-mono">Sala ID: nhg-vision-soberano-77</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Ocultar o detectedLanguage e o myLanguage do header para deixar a UI limpa (escolha feita no Lobby) */}

          {/* Status da ConexÃ£o */}
          <div className="flex items-center gap-2 bg-[#090d16] border border-slate-800/80 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 h-8 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isRemoteConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className="font-medium text-slate-300">{connectionStatus}</span>
          </div>

          {/* Convidar ConexÃ£o */}
          {!isJoiner && (
            <button 
              onClick={() => setIsInviteOpen(true)} 
              className="flex items-center gap-1.5 h-8 border border-slate-800/80 bg-[#090d16] hover:bg-slate-900 text-slate-300 hover:text-white text-[11px] font-bold px-3 shadow-sm rounded-lg transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Convidar ConexÃ£o</span>
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
          
          <div className={`flex-1 grid gap-6 min-h-0 items-stretch transition-all duration-500 ${
            (remotePeers.length === 0 || remotePeers.length + 1 === 2)
              ? (isAnalysisMode ? 'md:grid-cols-[1fr_2.8fr] grid-cols-1' : 'md:grid-cols-2 grid-cols-1')
              : (remotePeers.length + 1 === 3
                  ? 'md:grid-cols-3 grid-cols-1'
                  : (remotePeers.length + 1 === 4
                      ? 'md:grid-cols-2 grid-cols-1'
                      : 'md:grid-cols-3 grid-cols-2'
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
                      <p className="text-[10px] text-slate-500">CÃ¢mera Desativada</p>
                    </div>
                  </div>
                )}

                {/* Dynamic Overlay labels */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-slate-800/60 text-[10px] font-semibold text-white flex items-center gap-1.5 z-10">
                  <User className="w-3 h-3 text-blue-400" />
                  <span>{isJoiner ? `${guestName} (VocÃª)` : 'Diretor Geanderson (VocÃª)'}</span>
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
                  title={isCameraOn ? "Desligar CÃ¢mera" : "Ligar CÃ¢mera"}
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

                {/* Seletor de Idioma em Tempo Real */}
                <div className="relative flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 rounded-full pl-2.5 pr-2 py-1.5 h-9 hover:border-slate-700 transition-colors">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <select 
                    value={myLanguage.code}
                    onChange={(e) => {
                      const lang = LANGUAGES.find(l => l.code === e.target.value);
                      if (lang) {
                        setMyLanguage(lang);
                        logToAtena(`[Idioma] VocÃª alterou seu idioma para ${lang.name} ${lang.flag}`);
                        
                        // Sincroniza o novo idioma com os parceiros conectados via DataChannel
                        for (const [peerId, dc] of dataChannelsRef.current.entries()) {
                          if (dc.readyState === 'open') {
                            try {
                              dc.send(JSON.stringify({
                                type: 'language-change',
                                code: lang.code
                              }));
                            } catch (err) {
                              console.error("Erro ao enviar alteraÃ§Ã£o de idioma:", err);
                            }
                          }
                        }
                      }
                    }}
                    className="bg-transparent text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer pr-1"
                    title="Selecione o seu idioma de fala"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-200">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!isJoiner && (
                  <button 
                    onClick={() => {
                      setIsAnalysisMode(!isAnalysisMode);
                      logToAtena(`[Modo AnalÃ­tico] Modo Foco no Cliente ${!isAnalysisMode ? 'Ativado ðŸ”' : 'Desativado ðŸ›¡ï¸'}`);
                    }}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                      isAnalysisMode 
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                    title={isAnalysisMode ? "Restaurar VisualizaÃ§Ã£o PadrÃ£o" : "Ativar Foco AnalÃ­tico (Expandir Cliente)"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}

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
                        <p className="text-xs text-slate-500">Aguardando Host iniciar a transmissÃ£o...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-5 p-4 text-center w-full max-w-sm mx-auto">
                      {/* Logo of Nexus Holding Group (Horizontal banner format) */}
                      <div className={`relative w-64 h-20 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 transition-all duration-500 shadow-2xl mx-auto ${isClientSpeaking ? 'border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.4)] scale-105' : ''}`}>
                        <Image 
                          src="/nexus-holding-group-logo.jpg" 
                          alt="Nexus Holding Group Logo" 
                          fill 
                          className="object-contain p-1.5"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-white flex items-center gap-1.5 justify-center">
                          <span>Visitante</span>
                          <span className="text-xs">{peerLanguage.flag}</span>
                        </p>
                        <p className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase font-bold">ConexÃ£o Segura</p>
                        
                        <div className="pt-3 border-t border-slate-800/40 max-w-[240px] mx-auto">
                          <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed font-sans font-normal tracking-wide">
                            Nexus Vision Connection â€” TraduÃ§Ã£o poliglota em tempo real, seguranÃ§a absoluta e videoconferÃªncia soberana corporativa.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Name Overlay label */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-slate-800/60 text-[10px] font-semibold text-white flex items-center gap-1.5 z-10">
                    <Globe className="w-3 h-3 text-amber-400" />
                    <span>{isRemoteConnected ? remotePeerName : `Visitante (${peerLanguage.name})`}</span>
                  </div>

                  {isClientSpeaking && !isRemoteConnected && (
                    <div className="absolute inset-0 border-2 border-amber-500 rounded-3xl pointer-events-none animate-pulse" />
                  )}

                  {isClientSpeaking && activeSubtitle?.stage === 'translating' && !isRemoteConnected && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-600/90 border border-red-500/30 text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 animate-bounce shadow-lg shadow-red-600/20 z-10">
                      <VolumeX className="w-3 h-3 animate-pulse" />
                      Ãudio Nativo Bloqueado
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
                    <div className="flex flex-col items-center justify-center gap-5 p-4 text-center w-full max-w-sm mx-auto">
                      {/* Logo of Nexus Holding Group (Horizontal banner format) */}
                      <div className="relative w-64 h-20 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-2xl mx-auto">
                        <Image 
                          src="/nexus-holding-group-logo.jpg" 
                          alt="Nexus Holding Group Logo" 
                          fill 
                          className="object-contain p-1.5"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-white">{peer.name}</p>
                        <p className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase font-bold">ConexÃ£o Segura</p>
                        
                        <div className="pt-3 border-t border-slate-800/40 max-w-[240px] mx-auto">
                          <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed font-sans font-normal tracking-wide">
                            Nexus Vision Connection â€” TraduÃ§Ã£o poliglota em tempo real, seguranÃ§a absoluta e videoconferÃªncia soberana corporativa.
                          </p>
                        </div>
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
                      {peer.stream ? 'VÃ­deo Ativo' : 'Sem Sinal'}
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
                      <span className="text-slate-600">â†’</span>
                      <span className="text-slate-400">CLIENTE ({peerLanguage.name.toUpperCase()})</span>
                    </>
                  ) : (
                    <>
                      <span className="text-amber-400">CLIENTE ({peerLanguage.name.toUpperCase()})</span>
                      <span className="text-slate-600">â†’</span>
                      <span className="text-blue-400">VOCÃŠ (TRADUZIDO EM PORTUGUÃŠS)</span>
                    </>
                  )}
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-sans uppercase tracking-widest font-normal animate-pulse">
                    {activeSubtitle.stage === 'translating' ? 'Processando' : 'Sincronizado'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Ãudio Original</p>
                    <p className="text-xs md:text-sm text-slate-300 truncate md:normal-case font-light italic">
                      "{activeSubtitle.original}"
                    </p>
                  </div>
                  <div className="border-l border-slate-850 pl-4">
                    <p className="text-xs text-amber-400/80 uppercase tracking-widest font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      TraduÃ§Ã£o Soberana
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
                    ? "Comece a falar em portuguÃªs... Sua voz serÃ¡ traduzida automaticamente." 
                    : "Ative o IntÃ©rprete para iniciar a captaÃ§Ã£o de Ã¡udio."}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: TRANSCRIPT LOG & ATENA INSIGHTS PANEL */}
        {isSidebarOpen ? (
          <aside className="relative w-full lg:w-96 rounded-3xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl max-h-full transition-all duration-300">
            {/* Toggle Arrow (Open -> Collapse) */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-1/2 -left-3 -translate-y-1/2 z-30 w-6 h-12 rounded-l-xl border-y border-l border-slate-800 bg-slate-950/90 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:bg-slate-900 group shadow-md"
              title="Ocultar Painel"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <div className="border-b border-slate-800/80 p-4 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-500" />
                Monitor de TransmissÃ£o
              </span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Seguro
              </div>
            </div>

            {/* TRANSCRIPT PANEL */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[250px] lg:max-h-[350px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">HistÃ³rico de TraduÃ§Ãµes</p>
              
              {transcripts.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center text-slate-600 text-xs italic">
                  <span>Nenhuma interaÃ§Ã£o registrada ainda.</span>
                </div>
              ) : (
                transcripts.map((t) => (
                  <div key={t.id} className={`flex flex-col gap-1.5 ${t.sender === 'gean' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${t.sender === 'gean' ? 'text-blue-400' : 'text-amber-400'}`}>
                      <span>{t.sender === 'gean' ? `VocÃª (${myLanguage.flag})` : `Parceiro (${peerLanguage.flag})`}</span>
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
                  InteligÃªncia Atena Activa
                </span>
                <span className="text-[9px] font-bold text-slate-500 font-mono">V4.5</span>
              </div>
              
              <div className="bg-slate-900/60 border border-indigo-500/10 rounded-2xl p-3 space-y-2 shadow-inner">
                {atenaInsights.map((insight, idx) => (
                  <div key={idx} className="flex gap-2 text-[11px] leading-relaxed text-slate-300">
                    <span className="text-indigo-400 shrink-0 mt-0.5">â€¢</span>
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
              <span className="uppercase">Vazamento Ãudio: 0%</span>
            </div>

          </aside>
        ) : (
          /* FLOATING TRIGGER BUTTON TO EXPAND SIDEBAR */
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 w-8 h-16 rounded-l-2xl border-y border-l border-slate-800 bg-slate-950/90 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:bg-slate-900 group shadow-2xl shadow-indigo-500/10 animate-fade-in"
            title="Exibir Painel de TransmissÃ£o"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform text-indigo-400 animate-pulse" />
          </button>
        )}

      </main>

      {/* FOOTER - LEMBRETE DE TRADUÃ‡ÃƒO (SOMENTE SE NÃƒO FOR PT) */}
      {myLanguage.code !== 'pt' && (
        <footer className="w-full bg-indigo-950/30 border-t border-indigo-500/20 py-2.5 px-6 flex items-center justify-center z-20 backdrop-blur-md">
          <span className="text-indigo-300 text-xs font-semibold flex items-center gap-2 tracking-wide">
            <Info className="w-3.5 h-3.5 text-indigo-400" /> 
            {FOOTER_REMINDER[myLanguage.code] || FOOTER_REMINDER['en']}
          </span>
        </footer>
      )}

      {/* MODAL CONVIDAR CONEXÃƒO POR E-MAIL */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="bg-[#0b0f19] border border-slate-800 text-slate-100 max-w-lg shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-white text-lg font-headline flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              Convidar ConexÃ£o por E-mail
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Selecione o destinatÃ¡rio dos seus leads da Nexus ou insira um e-mail personalizado para enviar o link seguro.
            </DialogDescription>
          </DialogHeader>

          {/* Container rolÃ¡vel para evitar que o modal fique preso/cortado */}
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
                  <SelectItem value="vendas@nexusholdinggroup.com.br" className="text-emerald-400 font-medium">ðŸ’¼ Vendas (vendas@nexusholdinggroup.com.br)</SelectItem>
                  <SelectItem value="geanderson@nexusholdinggroup.com.br" className="text-blue-400 font-medium">ðŸ‘‘ Geanderson (geanderson@nexusholdinggroup.com.br)</SelectItem>
                  <SelectItem value="diretoria@nexustreinamento.com" className="text-indigo-400 font-medium">ðŸ¢ Diretoria (diretoria@nexustreinamento.com)</SelectItem>
                  <SelectItem value="pessoal@nexustreinamento.com" className="text-purple-400 font-medium">ðŸ‘¤ Pessoal (pessoal@nexustreinamento.com)</SelectItem>
                  <SelectItem value="custom" className="text-amber-400 font-semibold">âž• Digitar Outra Conta...</SelectItem>
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

            {/* Campo DestinatÃ¡rio */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">DestinatÃ¡rio (Leads da Isadora / Contatos)</label>
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
                      ðŸ‘¤ {lead.firstName} {lead.lastName} ({lead.company || 'Lead'})
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-amber-400 font-semibold">âž• Inserir Outro E-mail...</SelectItem>
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

            {/* VisualizaÃ§Ã£o de Assunto */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assunto</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="bg-slate-950/80 border-slate-800 text-white"
              />
            </div>

            {/* VisualizaÃ§Ã£o de ConteÃºdo do E-mail */}
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ConteÃºdo do E-mail</label>
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

      {/* MODAL DE ATA E RESUMO EXECUTIVO DA ATENA */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#020617] border border-indigo-900/50 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.25)] relative animate-fade-in">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800/80 bg-[#090d16] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Languages className="w-5 h-5 animate-pulse text-indigo-400" /> Ata de ReuniÃ£o da Atena
                </h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mt-1">
                  Nexus Vision Connection - Compilado via InteligÃªncia Artificial Soberana
                </p>
              </div>
              <button 
                onClick={handleCloseSummaryAndLeave}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Fechar e Sair"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 pr-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
              {isGeneratingSummary ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-indigo-300 font-mono tracking-wider animate-pulse">
                    Atena estÃ¡ estruturando a Ata de ReuniÃ£o...
                  </p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-slate-300 text-xs md:text-sm font-sans whitespace-pre-line leading-relaxed">
                  {generatedSummary}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800/85 bg-[#090d16]/50 flex items-center justify-between">
              <div className="flex gap-2">
                {!savedSummaryId ? (
                  <Button
                    onClick={handleSaveSummary}
                    disabled={isGeneratingSummary || !generatedSummary}
                    className="bg-emerald-600 hover:bg-emerald-550 text-white text-xs font-bold px-4 h-9 shadow-lg shadow-emerald-600/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Salvar na Nuvem
                  </Button>
                ) : (
                  <Button
                    onClick={handleDeleteSummary}
                    className="bg-red-950/40 hover:bg-red-900/30 border border-red-900/40 text-red-400 text-xs font-bold px-4 h-9 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir da Nuvem
                  </Button>
                )}
              </div>

              <Button
                onClick={handleCloseSummaryAndLeave}
                className="bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-bold px-6 h-9 shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                Concluir e Sair
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

interface RemoteVideoProps {
  peer: RemotePeer;
}

function RemoteVideo({ peer }: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const handleTtsState = (e: any) => {
      if (videoRef.current) {
        if (e.detail.isPlaying) {
          videoRef.current.volume = 0.1; /* DUCKING */
        } else {
          videoRef.current.volume = 1.0; /* RESTORE */
        }
      }
    };
    window.addEventListener('tts-state-change', handleTtsState);
    return () => window.removeEventListener('tts-state-change', handleTtsState);
  }, []);
  
  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
      videoRef.current.volume = 1.0;
      
      // Tentamos dar play sem som (ou com som dependendo da permissÃ£o anterior)
      videoRef.current.play()
        .then(() => {
          // Se deu play com sucesso, garante que o som estÃ¡ ativado
          if (videoRef.current) videoRef.current.muted = false;
        })
        .catch(e => {
          console.warn('RemoteVideo play() falhou com som, tentando modo silencioso:', e);
          // Se o autoplay barrou por causa do som, forÃ§amos mutar para que o vÃ­deo pelo menos comece a rodar
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play()
              .then(() => {
                // Tenta desmutar logo em seguida apÃ³s o inÃ­cio da reproduÃ§Ã£o
                setTimeout(() => {
                  if (videoRef.current) videoRef.current.muted = false;
                }, 800);
              })
              .catch(err => console.error("Falha crÃ­tica ao dar play no vÃ­deo remoto:", err));
          }
        });
    }
  }, [peer.stream]);

  return (
    <video 
      ref={videoRef} 
      autoPlay 
      playsInline 
      muted={false} // FORCED UNMUTE para permitir audio original
      className="w-full h-full object-cover"
    />
  );
}
