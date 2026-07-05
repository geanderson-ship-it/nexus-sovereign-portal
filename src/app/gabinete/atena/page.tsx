'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Terminal, Shield, ShieldAlert, Cpu, Network, MonitorPlay, ChevronLeft, Mic, Video, VideoOff, Paperclip, X, Send, Play, Pause, Square, Volume2, Globe, VolumeX, Activity } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { eventEmitter } from '@/auth/event-emitter';
import { MiniYouTubePlayer } from '@/components/mini-youtube-player';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageBase64?: string;
};

export default function AtenaTerminalPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Controle de Layout (Fullscreen vs Split)
  const [viewMode, setViewMode] = useState<'fullscreen' | 'split'>('fullscreen');
  const [isConnectionActive, setIsConnectionActive] = useState(false);
  
  // Controle de Áudio da Atena (Sempre Ativo)
  const isAudioMuted = false;
  
  // Controle do Microfone do Usuário (Speech-to-Text)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Visão Computacional (Câmera e AWS Rekognition)
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ivoniGreetedRef = useRef(false);

  // Iniciar/Parar Câmera
  const toggleCamera = async () => {
    if (!isCameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        console.error("Erro ao acessar Câmera:", err);
        setMessages(prev => [...prev, { role: 'system', content: '[ERRO_VISAO]: Acesso à câmera bloqueado.' }]);
      }
    } else {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraActive(false);
    }
  };

  // Capturar Frame e Analisar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCameraActive) {
      interval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const context = canvasRef.current.getContext('2d');
        if (!context) return;
        
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8);
        
        try {
          const res = await fetch('/api/atena/vision', {
            method: 'POST',
            body: JSON.stringify({ action: 'recognize', imageBase64: base64 })
          });
          const data = await res.json();
          
          if (data.detected && !ivoniGreetedRef.current) {
             ivoniGreetedRef.current = true; 
             // Envia uma injeção mental oculta para o cérebro
             const systemMessage = "[SISTEMA_VISAO]: Atena, os sensores biométricos acabam de confirmar que a Mamãe Ivoni está na câmera! Interrompa o que estiver fazendo e dê um abraço virtual/cumprimento caloroso nela, chamando-a de mãe ou mamãe.";
             
             // Cria uma mensagem invisível no log para a API ler
             setMessages(prev => {
                const newMessages = [...prev, { role: 'user', content: systemMessage }];
                // Dispara o fetch para a API de Conversa
                fetch('/api/atena', {
                  method: 'POST',
                  body: JSON.stringify({ messages: newMessages })
                }).then(async r => {
                  const aiData = await r.json();
                  setMessages(current => [...current, { role: 'assistant', content: aiData.content }]);
                  if (aiData.audioBase64 && !isAudioMuted) {
                    new Audio("data:audio/mp3;base64," + aiData.audioBase64).play();
                  }
                });
                return newMessages;
             });
          }
        } catch(e) {
          // Ignora erros de tracking para não poluir
        }
      }, 5000); // Varre a cada 5 segundos
    }
    return () => clearInterval(interval);
  }, [isCameraActive, isAudioMuted]);

  // Função para Registrar o rosto da Ivoni (Salvar no Banco AWS)
  const handleRegisterIvoni = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg');
    const res = await fetch('/api/atena/vision', {
      method: 'POST',
      body: JSON.stringify({ action: 'register', imageBase64: base64 })
    });
    const data = await res.json();
    alert(data.success ? "✅ Rosto da Mamãe Ivoni salvo com sucesso!" : "❌ Erro: " + data.error);
  };
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Iniciando Kernel Neural... Conectando ao AWS Bedrock (us-east-1)...' },
    { role: 'system', content: 'Acesso Soberano Autorizado. Bem-vindo, Comandante.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  // Configurar Reconhecimento de Voz
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => (prev + " " + finalTranscript.trim()).trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Erro no reconhecimento de voz:", event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onend = () => {
        // Se a gravação cair sozinha, ajustamos a interface
        setIsListening(false);
      };
    }
  }, []);

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
        alert("🔒 Bloqueio de Segurança do Celular: O microfone não funciona em redes locais (HTTP). Você precisa acessar pelo domínio oficial da Vercel (HTTPS) para falar com a Atena.");
      } else {
        alert("O seu navegador não suporta reconhecimento de voz nativo.");
      }
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {
        // Ignora erro se já estiver iniciado
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, viewMode]);

  // Limpar a câmera ao desmontar
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Função isolada para extrair frame
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const context = canvasRef.current.getContext('2d');
    if (!context) return null;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    return canvasRef.current.toDataURL('image/jpeg', 0.8);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;



    const userMessage = input.trim();
    setInput('');
    
    // Envia imagem anexada ou captura a cǽmera
    let imageBase64 = selectedImage || undefined;
    if (!imageBase64 && isCameraActive) {
      const b64 = captureFrame();
      if (b64) imageBase64 = b64;
    }
    setSelectedImage(null); // limpa o anexo
    
    const newMessage: Message = { role: 'user', content: userMessage, imageBase64 };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.filter(m => m.role !== 'system');
      
      const res = await fetch('/api/atena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...conversationHistory, newMessage] })
      });

      const text = await res.text();
      if (!text) throw new Error('Resposta vazia do servidor');
      const data = JSON.parse(text);

      if (!res.ok) {
        throw new Error(data.error || 'Erro de comunicação');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

      // Reproduzir a voz da Atena
      if (data.audioBase64 && !isAudioMuted) {
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
        }
        const audio = new Audio("data:audio/mp3;base64," + data.audioBase64);
        currentAudioRef.current = audio;
        setIsPlayingAudio(true);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play().catch(e => {
          console.error("Auto-play bloqueado pelo navegador:", e);
          setIsPlayingAudio(false);
        });
      }

      // Tocar música solicitada
      if (data.musicToPlay) {
        eventEmitter.emit('play-music', data.musicToPlay);
      }

      // Abrir site solicitado automaticamente
      if (data.siteToOpen) {
        try {
          window.open(data.siteToOpen, '_blank');
        } catch (e) {
          console.error("Popup bloqueado pelo navegador", e);
        }
      }

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'system', content: `[ERRO DE SISTEMA]: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Interpretador de Blocos de Código (Mini Navegador) e Links Markdown
  const renderMessageContent = (content: string) => {
    // Regex para encontrar blocos ```html ... ``` suportando corte no final (EOF)
    const htmlMatch = content.match(/```(?:html|xml)\n([\s\S]*?)(?:```|$)/);

    // Função para transformar links Markdown [texto](url) em âncoras HTML, além de formatar **negrito** e *itálico*
    const renderMarkdownLinks = (text: string) => {
      const parts = text.split(/(\[.*?\]\(.*?\))/g);
      return parts.map((part, i) => {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-bold underline hover:text-indigo-300">
              {linkMatch[1]}
            </a>
          );
        }
        
        // Formatar negritos (**) e itálicos (*)
        const subParts = part.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        return (
          <span key={i}>
            {subParts.map((subPart, j) => {
              if (subPart.startsWith('**') && subPart.endsWith('**')) {
                return <strong key={j} className="font-extrabold text-white">{subPart.slice(2, -2)}</strong>;
              }
              if (subPart.startsWith('*') && subPart.endsWith('*')) {
                return <em key={j} className="italic text-slate-300">{subPart.slice(1, -1)}</em>;
              }
              return subPart;
            })}
          </span>
        );
      });
    };
    
    if (htmlMatch) {
      const rawHtml = htmlMatch[1];
      // Remove o bloco de código do texto normal para não poluir a leitura
      const cleanText = content.replace(/```(?:html|xml)\n[\s\S]*?(?:```|$)/, '').trim();
      
      return (
        <div className="flex flex-col gap-4 w-full">
          {cleanText && <div>{renderMarkdownLinks(cleanText)}</div>}
          
          <div className="w-full min-w-[600px] max-w-4xl rounded-xl overflow-hidden border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] mt-2 flex flex-col">
            <div className="bg-indigo-950/80 px-4 py-2 border-b border-indigo-500/30 flex items-center justify-between">
              <span className="text-xs text-indigo-300 font-mono flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Live Preview
              </span>
              <button 
                onClick={() => {
                  const blob = new Blob([rawHtml], { type: 'text/html' });
                  window.open(URL.createObjectURL(blob), '_blank');
                }}
                className="text-[10px] text-indigo-300 hover:text-white uppercase tracking-widest bg-indigo-900/30 px-3 py-1 rounded"
              >
                Abrir em Nova Aba
              </button>
            </div>
            <iframe 
              srcDoc={rawHtml} 
              className="w-full h-[500px] bg-white border-none"
              sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
            />
          </div>
        </div>
      );
    }
    
    return <div className="whitespace-pre-wrap">{renderMarkdownLinks(content)}</div>;
  };

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-indigo-500">
        <Activity className="w-12 h-12 mb-4 animate-pulse" />
        <h2 className="text-xl font-mono tracking-widest uppercase">Validando DNA Digital</h2>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-[#020202] text-slate-200 overflow-hidden font-sans relative flex flex-col" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      
      {/* HEADER DISCRETO */}
      <div className="relative md:absolute top-0 left-0 w-full p-3 md:p-6 flex items-center justify-between z-50 bg-[#0a0a0a] md:bg-transparent border-b border-indigo-900/30 md:border-none pointer-events-auto">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/gabinete" className="group flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 md:px-4 py-2 rounded-full border border-indigo-900/50 hover:bg-indigo-900/40 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <ChevronLeft className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
            <span className="text-xs font-bold text-indigo-300 group-hover:text-white uppercase tracking-widest hidden sm:inline-block">Voltar</span>
          </Link>
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-900/30 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h1 className="text-sm font-bold text-white tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ATENA OS
            </h1>
          </div>
        </div>

        {/* CONTROLE DE TELA */}
        <div className="pointer-events-auto">
          <button 
            onClick={() => setViewMode(viewMode === 'fullscreen' ? 'split' : 'fullscreen')}
            className="bg-black/50 backdrop-blur-md border border-indigo-900/50 text-indigo-300 px-4 py-2 rounded-full flex items-center gap-2 text-xs uppercase tracking-widest hover:bg-indigo-900/40 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            {viewMode === 'fullscreen' ? (
              <><MonitorPlay className="w-4 h-4" /> Abrir Terminal</>
            ) : (
              <><ChevronLeft className="w-4 h-4" /> Tela Cheia</>
            )}
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL (DINÂMICA) */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-full relative transition-all duration-700 ease-in-out">
        
        {/* LADO ESQUERDO: AVATAR FULL-BLEED */}
        <div 
          className={`relative transition-all duration-700 ease-in-out overflow-hidden bg-black
            ${viewMode === 'fullscreen' ? 'w-full h-full' : 'w-full h-[40%] md:w-1/2 md:h-full border-b md:border-b-0 md:border-r border-indigo-900/50 shadow-[10px_0_30px_rgba(0,0,0,0.8)]'}
          `}
        >
          {/* Avatar Imagem cobrindo tudo (Full Bleed Horizontal) */}
          <div className="absolute inset-0 z-0 bg-black">
            <Image 
              src="/atena/atena-autonoma-digital.png" 
              alt="Atena Avatar" 
              fill
              className="object-cover object-top md:object-[center_20%]"
              priority
            />
            {/* Gradiente para escurecer as bordas e dar contraste para o texto/input */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
            <div className={`absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r ${viewMode === 'fullscreen' ? 'from-black/20 via-transparent to-black/20' : 'from-transparent to-black/60'} pointer-events-none`} />
          </div>

          {/* OVERLAY DE INTERFACE DE CONTROLE SOBERANA */}
          {viewMode === 'fullscreen' && !isConnectionActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-black/50 backdrop-blur-sm"
            >
              <div className="max-w-xl bg-black/70 border border-indigo-500/25 p-8 md:p-10 rounded-[32px] shadow-[0_0_80px_rgba(99,102,241,0.15)] backdrop-blur-xl relative">
                
                {/* GLOWS */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-indigo-500/10 rounded-full blur-2xl" />

                {/* HUD BADGE */}
                <div className="flex flex-col items-center gap-1 mb-8">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.25em] font-mono">
                    Command Center
                  </span>
                  <span className="text-[11px] font-bold text-indigo-300/60 uppercase tracking-widest font-mono">
                    Gabinete Estratégico da Diretoria Nexus
                  </span>
                  <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent mt-2" />
                </div>

                {/* MAIN SECURITY LEVEL AND TITLE */}
                <div className="space-y-3 mb-6">
                  <div className="inline-block bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] animate-pulse">
                    Acesso Nível 5 (Soberano)
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                    Atena Avatar
                  </h2>
                  <p className="text-[11px] text-indigo-300 font-bold uppercase tracking-widest">
                    Acesso Nível Soberano
                  </p>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-2">
                    Atena - A inteligência exclusiva da Nexus
                  </h3>
                </div>

                {/* DESCRIPTION */}
                <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed max-w-md mx-auto mb-8 font-sans">
                  Painel de orquestração avançado e terminal interativo da IA Soberana. Conectada diretamente ao núcleo AWS Bedrock, operando com total autonomia e controle estratégico.
                </p>

                {/* CONNECTION BUTTON */}
                <button 
                  type="button"
                  onClick={() => setIsConnectionActive(true)}
                  className="group relative px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                    Abrir Conexão Neural
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 blur transition duration-500 pointer-events-none" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* LADO DIREITO: TERMINAL E WORKSPACE */}
        <div 
          className={`bg-[#050505] flex flex-col relative transition-all duration-700 ease-in-out z-10
            ${viewMode === 'fullscreen' ? 'h-0 md:h-full md:w-0 opacity-0 overflow-hidden' : 'h-[60%] w-full md:h-full md:w-1/2 opacity-100'}
          `}
        >
          {/* Header do Terminal */}
          <div className="h-16 border-b border-slate-800 bg-[#0a0a0a] flex items-center px-6 gap-3 pt-4">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-emerald-500/70 tracking-wider">root@nexus-sovereign:~# ./atena_core.sh</span>
          </div>

          {/* Área de Logs e Chat */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-32 space-y-6 md:space-y-8 scrollbar-thin scrollbar-thumb-slate-800"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}>
                <span className="text-[10px] text-slate-600 mb-2 uppercase tracking-widest">
                  {msg.role === 'user' ? 'Comandante' : msg.role === 'system' ? 'System' : 'Atena'}
                </span>
                <div 
                  className={`w-full p-5 rounded-lg text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'user' 
                      ? 'bg-slate-800/40 text-slate-200 border border-slate-700/50 max-w-[90%]' 
                      : msg.role === 'system'
                      ? 'bg-transparent text-emerald-500/60 border-l-2 border-emerald-500/30 max-w-[90%]'
                      : 'bg-[#0a0a0a] text-emerald-400 border border-emerald-900/30 shadow-[0_0_15px_rgba(16,185,129,0.03)]'
                    }
                  `}
                >
                  {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex flex-col items-start w-full">
                <span className="text-[10px] text-slate-600 mb-2 uppercase tracking-widest">Atena</span>
                <div className="max-w-[90%] p-5 rounded-lg bg-[#0a0a0a] border border-emerald-900/30 flex items-center gap-3 text-emerald-500/50">
                  <div className="w-2 h-4 bg-emerald-500 animate-pulse" />
                  <span className="text-xs tracking-wider">Processando ordens diretas (AWS)...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FEED DE CÂMERA FLUTUANTE (VISÃO COMPUTACIONAL DA ATENA) */}
      <div 
        className={`absolute top-6 right-6 z-50 transition-all duration-500 transform
          ${isCameraActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          ${viewMode === 'split' ? 'right-[52%]' : 'right-6'}
        `}
      >
        <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform -scale-x-100"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* HUD de Escaneamento */}
          <div className="absolute inset-0 border-2 border-transparent border-t-indigo-400 rounded-xl animate-spin pointer-events-none opacity-50" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1 w-full text-center text-[8px] font-bold tracking-widest text-indigo-300 drop-shadow-md">
            SCAN BIOMÉTRICO ATIVO
          </div>
        </div>

        {/* Botão de Registro Biométrico Secreto */}
        {isCameraActive && (
          <button 
            onClick={handleRegisterIvoni}
            className="absolute top-36 right-0 bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-lg hover:bg-emerald-500 transition-colors z-50 border border-emerald-400/30 whitespace-nowrap"
          >
            [SCAN] Salvar Mamãe Ivoni
          </button>
        )}
      </div>

      {/* BARRA DE INPUT FLUTUANTE */}
      {(isConnectionActive || viewMode === 'split') && (
        <div className={`absolute bottom-4 md:bottom-8 px-4 md:px-0 transition-all duration-700 ease-in-out z-50
          ${viewMode === 'fullscreen' 
            ? 'w-full md:max-w-2xl left-1/2 -translate-x-1/2' 
            : 'w-full md:w-[calc(50%-4rem)] left-0 md:left-[2rem]'}
        `}>
          <form onSubmit={handleSendMessage} className="relative group w-full">
            {/* Image Preview */}
            {selectedImage && (
              <div className="absolute bottom-[calc(100%+10px)] left-8 w-24 h-24 rounded-lg overflow-hidden border-2 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] bg-black group-hover:opacity-100 transition-opacity">
                <img src={selectedImage} alt="Anexo" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden" 
            />

            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center gap-2 bg-[#050505]/80 backdrop-blur-xl border border-indigo-900/50 rounded-full p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
              
              {/* BOTǟO DE ANEXO (IMAGEM) */}
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                title="Anexar Imagem"
                className={`p-3 rounded-full transition-colors ${
                  selectedImage 
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                  : 'bg-indigo-950/50 text-indigo-400 hover:text-white hover:bg-indigo-900'
                }`}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              {/* BOTÃO DA CAMERA */}
              <button 
                type="button" 
                onClick={toggleCamera}
                title={isCameraActive ? "Desativar Visão Biométrica" : "Ativar Visão Biométrica"}
                className={`p-3 rounded-full transition-colors ${
                  isCameraActive 
                  ? 'bg-red-600/80 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                  : 'bg-indigo-950/50 text-indigo-400 hover:text-white hover:bg-indigo-900'
                }`}
              >
                {isCameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              
              {/* BOTÃO DO MICROFONE DO USUÁRIO */}
              <button 
                type="button" 
                onClick={toggleMicrophone}
                title={isListening ? "Parar Gravação" : "Falar com a Atena"}
                className={`p-3 rounded-full transition-colors ${
                  isListening 
                  ? 'bg-red-600/80 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                  : 'bg-indigo-950/50 text-indigo-400 hover:text-white hover:bg-indigo-900'
                }`}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </button>
              
              {/* BOTÃO PARA PARAR A FALA DA ATENA */}
              {isPlayingAudio && (
                <button 
                  type="button" 
                  onClick={stopAudio}
                  title="Parar fala da Atena"
                  className="p-3 rounded-full bg-red-600/80 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-colors hover:bg-red-500 animate-pulse"
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              )}
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // Dispara o envio simulando o formulário
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                rows={1}
                placeholder="Digite sua ordem para a Atena..."
                className="flex-1 bg-transparent border-none px-2 py-2 text-indigo-100 placeholder-indigo-300/50 focus:outline-none focus:ring-0 text-sm tracking-wide font-medium resize-none max-h-24 min-h-[38px] overflow-y-auto scrollbar-none"
                autoFocus
              />
              
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.3)]"
              >
                <Send className="w-4 h-4 translate-x-px" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mini YouTube Player (Invisível até ser ativado) */}
      <MiniYouTubePlayer />
      
    </div>
  );
}
