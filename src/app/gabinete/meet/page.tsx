'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { 
  Lock, Mic, MicOff, Video, VideoOff, PhoneOff, Languages, 
  Sparkles, Globe, Shield, Play, VolumeX, Terminal, User, Share2, Clipboard
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// IDIOMAS DO CLIENTE DISPONÍVEIS
const LANGUAGES = [
  { code: 'auto', name: 'Detecção Automática', flag: '🔍', nativeName: 'Auto Detect', voiceLocale: 'auto' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português', voiceLocale: 'pt-BR' },
  { code: 'es', name: 'Espanhol', flag: '🇪🇸', nativeName: 'Español', voiceLocale: 'es-ES' },
  { code: 'en', name: 'Inglês', flag: '🇺🇸', nativeName: 'English', voiceLocale: 'en-US' },
  { code: 'fr', name: 'Francês', flag: '🇫🇷', nativeName: 'Français', voiceLocale: 'fr-FR' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano', voiceLocale: 'it-IT' },
  { code: 'de', name: 'Alemão', flag: '🇩🇪', nativeName: 'Deutsch', voiceLocale: 'de-DE' },
];

// FALAS MOCKADAS DO CLIENTE POR IDIOMA PARA A SIMULAÇÃO DE INTERCEPTAÇÃO
const MOCK_CLIENT_SPEECHES: Record<string, { original: string; translation: string }[]> = {
  pt: [
    { original: "Olá Gean, é um prazer falar com você. Estou testando a chamada de áudio direto da Nexus em Português.", translation: "Olá Gean, é um prazer falar com você. Estou testando a chamada de áudio direto da Nexus em Português." },
    { original: "Esta é uma demonstração da transmissão de voz sem interceptação. O áudio flui direto, limpo e em tempo real.", translation: "Esta é uma demonstração da transmissão de voz sem interceptação. O áudio flui direto, limpo e em tempo real." },
    { original: "Excelente qualidade de áudio da ElevenLabs. O som está nítido e sem nenhuma microfonia na nossa videoconferência.", translation: "Excelente qualidade de áudio da ElevenLabs. O som está nítido e sem nenhuma microfonia na nossa videoconferência." }
  ],
  es: [
    { original: "Hola Gean, es un placer saludarte. El proyecto de Nexus me parece sumamente innovador y queremos avanzar hoy mismo.", translation: "Olá Gean, é um prazer te saudar. O projeto da Nexus me parece extremamente inovador e queremos avançar hoje mesmo." },
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
    { original: "Buongiorno Gean. La tecnologia Nexus è straordinaria, siamo pronti a firmare l'accordo di licenza oggi.", translation: "Bom dia Gean. A tecnologia Nexus é straordinaria, estamos prontos para assinar o acordo de licença hoje." },
    { original: "Quali sono i requisiti tecnici per implementare la linea di comunicazione protetta sui nostri server aziendali?", translation: "Quais são os requisitos técnicos para implementar a linha de comunicação protegida nos nossos servidores corporativos?" }
  ],
  de: [
    { original: "Guten Tag Gean. Wir sind sehr interessiert an einer langfristigen Kooperation mit der Nexus Holding Group.", translation: "Bom dia Gean. Estamos muito interessados em uma cooperação de longo prazo com o Nexus Holding Group." },
    { original: "Können Sie die Sicherheitsarchitektur der Übersetzungs-API im Detail erläutern?", translation: "Você pode explicar em detalhes a arquitetura de segurança da API de tradução?" }
  ]
};

interface TranscriptItem {
  id: string;
  sender: 'gean' | 'client';
  originalText: string;
  translatedText: string;
  timestamp: string;
}

export default function MeetSoberanoPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ESTADOS DA CHAMADA
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isInterpreterActive, setIsInterpreterActive] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [detectedLanguage, setDetectedLanguage] = useState(LANGUAGES[1]); // padrão inicial: espanhol
  const [isClientSpeaking, setIsClientSpeaking] = useState(false);
  const [isGeanSpeaking, setIsGeanSpeaking] = useState(false);
  const [mounted, setMounted] = useState(false);

  // WebRTC Room e Peer IDs
  const localPeerId = useMemo(() => Math.random().toString(36).substring(7), []);
  const [roomId, setRoomId] = useState('nhg-meet-soberano-default');
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  const [remotePeerName, setRemotePeerName] = useState('Aguardando...');
  const [isJoiner, setIsJoiner] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Inicializando...');
  const processedSignalsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const room = searchParams.get('room') || 'nhg-meet-soberano-default';
      const join = searchParams.get('join') === 'true';
      setRoomId(room);
      setIsJoiner(join);
      setConnectionStatus(join ? 'Aguardando convite do Host...' : 'Criando sala e aguardando Ivoni...');
    }
  }, []);

  // FLUXO DE VÍDEO
  const [stream, setStream] = useState<MediaStream | null>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // WebRTC Refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

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

  // RECONHECIMENTO DE VOZ (SPEECH RECOGNITION)
  const recognitionRef = useRef<any>(null);
  const micErrorRef = useRef<string | null>(null);
  const isTtsPlayingRef = useRef<boolean>(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

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

  // Copiar link de convite para a chamada WebRTC
  const copyJoinLink = () => {
    if (typeof window !== 'undefined') {
      const inviteUrl = `${window.location.origin}/gabinete/meet?room=${roomId}&join=true`;
      navigator.clipboard.writeText(inviteUrl);
      alert('Link de convite copiado com sucesso! Envie para a Ivoni para ela se conectar com você.');
    }
  };
  
  // VERIFICAÇÃO DE AUTORIZAÇÃO
  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  // INICIALIZAR E POLICIA WebRTC (Conexão P2P + Sinalização DynamoDB)
  useEffect(() => {
    if (!isAuthorized || typeof window === 'undefined') return;

    let active = true;
    let pollInterval: NodeJS.Timeout;

    const initWebRTC = async () => {
      // 1. Obter mídia local (câmera e áudio)
      let localStream: MediaStream;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = localStream;
        setStream(localStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.warn("Falha ao obter mídia local completa. Tentando apenas vídeo...", err);
        try {
          localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          localStreamRef.current = localStream;
          setStream(localStream);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = localStream;
          }
        } catch (e2) {
          console.error("Falha total de mídia:", e2);
          return;
        }
      }

      // 2. Criar RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionRef.current = pc;

      // Adicionar tracks locais
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      // Mudar habilitado conforme o idioma e mute
      const updateTracksState = () => {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
          // Só transmite áudio bruto se estiver em Português direto E não-mutado
          audioTrack.enabled = (selectedLanguage.code === 'pt') && !isMuted;
        }
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = isCameraOn;
        }
      };
      updateTracksState();

      // Monitor de candidatos ICE locais
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          fetch('/api/meet/signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              type: 'webrtc-candidate',
              sender: localPeerId,
              data: event.candidate
            })
          }).catch(e => console.error("Falha ao enviar ICE candidato:", e));
        }
      };

      // Receber track remota
      pc.ontrack = (event) => {
        console.log("WebRTC: Recebeu track remota!", event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsRemoteConnected(true);
          setRemotePeerName("Ivoni (Conectada)");
        }
      };
    };

    const setupDataChannel = (channel: RTCDataChannel) => {
      channel.onopen = () => console.log("WebRTC DataChannel: ABERTO");
      channel.onclose = () => {
        console.log("WebRTC DataChannel: FECHADO");
        setIsRemoteConnected(false);
        setRemotePeerName("Aguardando...");
      };
      channel.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'transcript') {
            console.log("DataChannel recebeu transcrição:", msg);
            await handleIncomingTranscript(msg.text, msg.senderName);
          }
        } catch (err) {
          console.error("Erro ao ler mensagem do DataChannel:", err);
        }
      };
    };

    const handleIncomingTranscript = async (text: string, senderName: string) => {
      const isPt = selectedLanguage.code === 'pt';

      if (isPt) {
        // Modo Direto: Apenas exibe a legenda (o áudio original já tocou via WebRTC)
        setActiveSubtitle({
          sender: 'client',
          original: text,
          translated: text,
          stage: 'done'
        });

        const newItem: TranscriptItem = {
          id: Math.random().toString(),
          sender: 'client',
          originalText: text,
          translatedText: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setTranscripts(prev => [...prev, newItem]);
        updateAtenaInsights('client', text, text);

        setTimeout(() => {
          setActiveSubtitle(null);
        }, 4000);
      } else {
        // Modo Tradução: Parceiro falou. Capturamos o texto, traduzimos para Português, mostramos legenda e tocamos TTS!
        setActiveSubtitle({
          sender: 'client',
          original: text,
          translated: `Traduzindo do ${selectedLanguage.name}...`,
          stage: 'translating'
        });

        // Toca efeito abafado local para simular a interceptação
        playMuffledAudioEffect();

        try {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              targetLanguage: 'portuguese',
              sourceLanguage: selectedLanguage.code === 'auto' ? 'auto' : selectedLanguage.name
            })
          });
          const resData = await response.json();
          const translation = resData.translation || text;

          setActiveSubtitle({
            sender: 'client',
            original: text,
            translated: translation,
            stage: 'done'
          });

          // Fala o áudio traduzido em voz alta
          playTTS(translation, 'pt-BR');

          // Salva no histórico
          const newItem: TranscriptItem = {
            id: Math.random().toString(),
            sender: 'client',
            originalText: text,
            translatedText: translation,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setTranscripts(prev => [...prev, newItem]);
          updateAtenaInsights('client', text, translation);

          setTimeout(() => {
            setActiveSubtitle(null);
          }, 5000);
        } catch (err) {
          console.error("Falha ao traduzir fala remota:", err);
          setActiveSubtitle({
            sender: 'client',
            original: text,
            translated: text,
            stage: 'done'
          });
        }
      }
    };

    // Polling de sinalização
    const pollSignaling = async () => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      try {
        const response = await fetch(`/api/meet/signal?roomId=${roomId}`);
        const resData = await response.json();
        const signals = resData.signals || [];

        // Filtra sinais enviados por outras pessoas
        const remoteSignals = signals.filter((s: any) => s.payload.sender !== localPeerId);

        // Identifica se há uma oferta ativa de outro peer
        const offerSignal = remoteSignals.find((s: any) => s.type === 'webrtc-offer');
        const answerSignal = remoteSignals.find((s: any) => s.type === 'webrtc-answer');
        const candidateSignals = remoteSignals.filter((s: any) => s.type === 'webrtc-candidate');

        // Fluxo de Joiner (Peer B): Se houver uma oferta e ainda não criamos a nossa conexão local
        if (offerSignal && !processedSignalsRef.current.has(offerSignal.id)) {
          processedSignalsRef.current.add(offerSignal.id);
          console.log("WebRTC: Oferta remota recebida. Configurando Joiner...");

          await pc.setRemoteDescription(new RTCSessionDescription(offerSignal.payload.data));

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          await fetch('/api/meet/signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              type: 'webrtc-answer',
              sender: localPeerId,
              data: answer
            })
          });

          // Ouvir canal de dados que o Host criará
          pc.ondatachannel = (event) => {
            console.log("WebRTC: Canal de dados recebido!");
            dataChannelRef.current = event.channel;
            setupDataChannel(event.channel);
          };
        }

        // Fluxo de Host (Peer A): Se nós criamos a oferta e recebemos a resposta
        if (answerSignal && !processedSignalsRef.current.has(answerSignal.id)) {
          processedSignalsRef.current.add(answerSignal.id);
          console.log("WebRTC: Resposta remota recebida. Conectando...");
          await pc.setRemoteDescription(new RTCSessionDescription(answerSignal.payload.data));
        }

        // Se ainda não criamos uma oferta, e não há nenhuma oferta no servidor de ninguém: nos tornamos o Host!
        const anyOffer = signals.find((s: any) => s.type === 'webrtc-offer');
        if (!anyOffer && pc.signalingState === 'stable') {
          console.log("WebRTC: Nenhuma oferta encontrada. Criando oferta como Host...");
          
          // Criar canal de dados
          const dc = pc.createDataChannel('meet-chat');
          dataChannelRef.current = dc;
          setupDataChannel(dc);

          // Criar e enviar oferta
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          await fetch('/api/meet/signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              type: 'webrtc-offer',
              sender: localPeerId,
              data: offer
            })
          });
        }

        // Processa candidatos ICE remotos recebidos
        for (const cand of candidateSignals) {
          if (!processedSignalsRef.current.has(cand.id)) {
            processedSignalsRef.current.add(cand.id);
            try {
              await pc.addIceCandidate(new RTCIceCandidate(cand.payload.data));
              console.log("WebRTC: Candidato ICE remoto adicionado.");
            } catch (e) {
              console.warn("Erro ao adicionar candidato ICE:", e);
            }
          }
        }
      } catch (err) {
        console.error("Erro no polling de sinalização:", err);
      }
    };

    initWebRTC().then(() => {
      if (active) {
        pollInterval = setInterval(pollSignaling, 2000);
      }
    });

    return () => {
      active = false;
      clearInterval(pollInterval);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isAuthorized, roomId, isMuted, isCameraOn, selectedLanguage]);

  // CONFIGURAÇÃO DO RECONHECIMENTO DE VOZ NATIVO (WEB SPEECH API)
  useEffect(() => {
    if (!isAuthorized) return;

    let rec: any = null;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        rec = new SpeechRecognition();
        rec.continuous = false; // Configuração ideal para evitar travamentos e loops eternos
        rec.interimResults = false;
        rec.lang = 'pt-BR';

        rec.onstart = () => {
          setIsListening(true);
          updateMicError(null);
          console.log("Speech recognition started.");
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === 'not-allowed') {
            updateMicError("Acesso ao microfone negado. Por favor, clique no cadeado ao lado da URL no navegador e ative a permissão do microfone.");
          } else if (event.error === 'audio-capture') {
            updateMicError("Nenhum microfone detectado. Verifique se o dispositivo está conectado.");
          } else if (event.error === 'no-speech') {
            // Ignora silêncio temporário
          } else {
            updateMicError(`Erro no microfone: ${event.error}`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
          console.log("Speech recognition ended.");
          
          // Reinicia após um pequeno delay se o intérprete ainda estiver ativo, sem erro crítico e sem TTS tocando
          setTimeout(() => {
            if (isInterpreterActive && !isMuted && !micErrorRef.current && !isTtsPlayingRef.current) {
              try { rec.start(); } catch (e) {
                console.warn("Falha ao reiniciar microfone:", e);
              }
            }
          }, 400);
        };

        rec.onresult = async (event: any) => {
          const resultIndex = event.resultIndex;
          const transcriptText = event.results[resultIndex][0].transcript;
          if (transcriptText.trim()) {
            handleGeanSpeech(transcriptText);
          }
        };

        recognitionRef.current = rec;

        if (isInterpreterActive && !isMuted) {
          // Solicita permissão explicitamente pelo getUserMedia primeiro para ativar o prompt nativo
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(s => {
              s.getTracks().forEach(track => track.stop()); // fecha o stream de teste
              updateMicError(null);
              try { rec.start(); } catch (e) {}
            })
            .catch(err => {
              console.error("Audio access rejected:", err);
              updateMicError("Acesso ao microfone bloqueado pelo navegador. Libere a permissão para que a tradução em tempo real funcione.");
            });
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
  }, [isInterpreterActive, isMuted, isAuthorized]);

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

    // Transmitir o texto reconhecido via WebRTC DataChannel
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      try {
        dataChannelRef.current.send(JSON.stringify({
          type: 'transcript',
          text: text,
          senderName: user?.name || 'Gean'
        }));
        console.log("WebRTC: Transcrição enviada via DataChannel:", text);
      } catch (err) {
        console.error("Falha ao enviar transcrição via DataChannel:", err);
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
  const playMuffledAudioEffect = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

    // Se for Português (o idioma que o Gean ouve), prioriza ElevenLabs e Azure
    if (locale.toLowerCase().startsWith('pt')) {
      try {
        // TENTATIVA 1: ElevenLabs (Voz do Orion - Masculina Ultra Realista)
        const response = await fetch('/api/tts/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.trim(),
            voiceId: 'lvkgCBi6spByiTZMPJEK' // Orion ElevenLabs Voice ID
          })
        });

        if (!response.ok) throw new Error("ElevenLabs falhou");
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        await playAudioStream(audioUrl);
        console.log("TTS: ElevenLabs (Orion) reproduzido com sucesso.");
        return;
      } catch (err) {
        console.warn("ElevenLabs indisponível ou cota excedida. Tentando Azure TTS...", err);
        
        try {
          // TENTATIVA 2: Azure TTS (Julio - Masculino Neural)
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: text.trim(),
              gender: 'male'
            })
          });

          if (!response.ok) throw new Error("Azure TTS falhou");

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          await playAudioStream(audioUrl);
          console.log("TTS: Azure TTS (Julio) reproduzido com sucesso.");
          return;
        } catch (azureErr) {
          console.warn("Azure TTS falhou. Recorrendo ao sintetizador local do navegador...", azureErr);
        }
      }
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

  return (
    <div className="min-h-screen bg-[#02050a] text-slate-100 font-sans flex flex-col relative overflow-hidden">
      
      {/* Background Cyber Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-10 px-6 py-4 border-b border-slate-800/80 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-blue-500/40 bg-blue-950/50 flex items-center justify-center text-blue-400 font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            N
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide text-white flex items-center gap-2">
              Nexus Meet <span className="text-[10px] bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Soberano</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">Sala ID: nhg-meet-soberano-77</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          {/* Seletor de Idioma do Cliente no Topo */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 shadow-lg shadow-black/40">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold hidden lg:inline">Idioma do Cliente:</span>
            <select 
              value={selectedLanguage.code}
              onChange={(e) => {
                const lang = LANGUAGES.find(l => l.code === e.target.value);
                if (lang) {
                  setSelectedLanguage(lang);
                  setActiveSubtitle(null);
                }
              }}
              className="bg-transparent text-white font-bold cursor-pointer focus:outline-none"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-950 text-white">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Indicador de Idioma Detectado no modo Auto */}
          {selectedLanguage.code === 'auto' && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="font-bold">Detectado:</span>
              <span className="flex items-center gap-1 animate-pulse">
                <span>{detectedLanguage.flag}</span>
                <span className="uppercase text-[10px]">{detectedLanguage.name}</span>
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-950/20 font-mono text-xs text-indigo-400">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isRemoteConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span>{connectionStatus}</span>
          </div>

          {!isJoiner && (
            <Button onClick={copyJoinLink} size="sm" variant="outline" className="border-indigo-500/30 hover:bg-indigo-950 hover:text-white text-indigo-400 gap-2 text-xs font-bold shadow-lg shadow-indigo-500/10">
              <Share2 className="w-4 h-4" />
              Convidar Conexão
            </Button>
          )}

          <Link href="/gabinete">
            <Button size="sm" variant="outline" className="border-slate-800 hover:bg-slate-950 hover:text-white gap-2 text-xs">
              Voltar ao Gabinete
            </Button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col lg:flex-row relative z-10 p-6 gap-6 overflow-hidden max-h-[calc(100vh-80px)]">
        
        {/* LEFT COLUMN: MEET VIDEO GRID & SUBTITLES */}
        <div className="flex-1 flex flex-col justify-between gap-6 min-h-0">
          
          {/* VIDEO GRID */}
          <div className="flex-1 grid md:grid-cols-2 gap-6 min-h-0 items-stretch">
            
            {/* GEAN'S FEED (LOCAL USER) */}
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 overflow-hidden flex items-center justify-center group shadow-xl">
              {isCameraOn ? (
                <video 
                  ref={myVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 bg-blue-950/50 flex items-center justify-center text-blue-400 text-3xl font-headline font-bold shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    G
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">Diretor Geanderson</p>
                    <p className="text-xs text-slate-500">Câmera Desativada</p>
                  </div>
                </div>
              )}

              {/* Dynamic Overlay labels */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-slate-800/60 text-xs font-semibold text-white flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Geanderson (Você)</span>
              </div>

              {isGeanSpeaking && (
                <div className="absolute inset-0 border-2 border-blue-500 rounded-3xl pointer-events-none animate-pulse" />
              )}
              
              {isGeanSpeaking && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-blue-950/80 backdrop-blur-md border border-blue-500/30 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1.5 h-6 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">Falando</span>
                </div>
              )}
            </div>

            {/* CLIENT'S FEED (SIMULATED FOREIGN CLIENT / REAL PEER CONNECTION) */}
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/60 overflow-hidden flex items-center justify-center group shadow-xl">
              {isRemoteConnected ? (
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-5">
                  {/* Client Avatar with dynamic ring */}
                  <div className={`relative w-28 h-28 rounded-full overflow-hidden border-4 flex-shrink-0 transition-all duration-500 ${isClientSpeaking ? 'border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.4)] scale-105' : 'border-slate-800 bg-slate-900'}`}>
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
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5 justify-center">
                      <span>Carlos Ortega (Madrid)</span>
                      <span className="text-xs">{selectedLanguage.flag}</span>
                    </p>
                    <p className="text-xs text-slate-500">Cliente Simulador</p>
                  </div>

                  <Button 
                    onClick={handleSimulateClientSpeech}
                    disabled={isClientSpeaking || isGeanSpeaking}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Simular Fala do Cliente
                  </Button>
                </div>
              )}

              {/* Dynamic Overlay labels */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-slate-800/60 text-xs font-semibold text-white flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRemoteConnected ? remotePeerName : `Cliente (${selectedLanguage.name})`}</span>
              </div>

              {isClientSpeaking && !isRemoteConnected && (
                <div className="absolute inset-0 border-2 border-amber-500 rounded-3xl pointer-events-none animate-pulse" />
              )}

              {isClientSpeaking && activeSubtitle?.stage === 'translating' && !isRemoteConnected && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-red-600/90 border border-red-500/30 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 animate-bounce shadow-lg shadow-red-600/20">
                  <VolumeX className="w-3 h-3 animate-pulse" />
                  Áudio Nativo Interceptado & Bloqueado
                </div>
              )}

              {isClientSpeaking && !isRemoteConnected && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-amber-950/80 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1.5 h-7 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest ml-1">Traduzindo</span>
                </div>
              )}
            </div>

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
                    <span>{t.sender === 'gean' ? 'Diretor Gean' : `Cliente (${selectedLanguage.flag})`}</span>
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

      {/* FOOTER CONTROLS BAR (GOOGLE MEET BOTTOM CONTROLS) */}
      <footer className="relative z-10 px-6 py-5 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="hidden md:flex flex-col text-left">
          <p className="text-sm font-semibold text-white font-mono">
            {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
          </p>
          <p className="text-xs text-slate-500">nhg-meet-soberano-77</p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-4">
          
          {/* MUTE MIC BUTTON */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isMuted ? 'bg-red-600 border-red-500 text-white hover:bg-red-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'}`}
            title={isMuted ? "Ativar Microfone" : "Mutar Microfone"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* TOGGLE CAMERA BUTTON */}
          <button 
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${!isCameraOn ? 'bg-red-600 border-red-500 text-white hover:bg-red-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'}`}
            title={isCameraOn ? "Desligar Câmera" : "Ligar Câmera"}
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* INTERPRETER MOD ACTIVE BUTTON */}
          <button 
            onClick={() => setIsInterpreterActive(!isInterpreterActive)}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isInterpreterActive ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-550' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'}`}
            title={isInterpreterActive ? "Pausar Tradutor Simultâneo" : "Iniciar Tradutor Simultâneo"}
          >
            <Languages className={`w-5 h-5 ${isInterpreterActive ? 'animate-pulse' : ''}`} />
          </button>

          {/* LEAVE CALL BUTTON */}
          <Link href="/gabinete">
            <button 
              className="w-14 h-12 rounded-3xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
              title="Desligar Chamada"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </Link>

        </div>

        {/* SYSTEM STATUS */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>Filtro de Ruído Inteligente Activo</span>
        </div>

      </footer>

    </div>
  );
}
