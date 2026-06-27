'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Shield, Terminal, Mic, Send, Activity, MonitorPlay, ChevronLeft, Video, VideoOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
      alert("O seu navegador não suporta reconhecimento de voz nativo.");
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

    // if (viewMode === 'fullscreen') {
    //   setViewMode('split');
    // }

    const userMessage = input.trim();
    setInput('');
    
    // Capturar olho da Atena (Visão) se a câmera estiver ligada
    let imageBase64 = undefined;
    if (isCameraActive) {
      const b64 = captureFrame();
      if (b64) imageBase64 = b64;
    }
    
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro de comunicação');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

      // Reproduzir a voz da Atena
      if (data.audioBase64 && !isAudioMuted) {
        const audio = new Audio("data:audio/mp3;base64," + data.audioBase64);
        audio.play().catch(e => console.error("Auto-play bloqueado pelo navegador:", e));
      }

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'system', content: `[ERRO DE SISTEMA]: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Interpretador de Blocos de Código (Mini Navegador)
  const renderMessageContent = (content: string) => {
    // Regex para encontrar blocos ```html ... ``` suportando corte no final (EOF)
    const htmlMatch = content.match(/```(?:html|xml)\n([\s\S]*?)(?:```|$)/);
    
    if (htmlMatch) {
      const rawHtml = htmlMatch[1];
      // Remove o bloco de código do texto normal para não poluir a leitura
      const cleanText = content.replace(/```(?:html|xml)\n[\s\S]*?(?:```|$)/, '').trim();
      
      return (
        <div className="flex flex-col gap-4 w-full">
          {cleanText && <div>{cleanText}</div>}
          
          <div className="w-full min-w-[600px] max-w-4xl rounded-xl overflow-hidden border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] mt-2 flex flex-col">
            <div className="bg-[#050505] px-4 py-2 border-b border-indigo-500/30 flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                MINI NAVEGADOR (LIVE PREVIEW)
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
    
    return <div>{content}</div>;
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
    <div className="h-screen bg-[#020202] text-slate-200 overflow-hidden font-mono relative flex flex-col">
      
      {/* HEADER DISCRETO */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-50 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/gabinete" className="hover:opacity-70 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-black/50 border border-indigo-900/50 flex items-center justify-center backdrop-blur-md">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
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
      <div className="flex-1 flex w-full h-full relative transition-all duration-700 ease-in-out">
        
        {/* LADO ESQUERDO: AVATAR FULL-BLEED */}
        <div 
          className={`relative h-full transition-all duration-700 ease-in-out overflow-hidden bg-black
            ${viewMode === 'fullscreen' ? 'w-full' : 'w-1/2 border-r border-indigo-900/50 shadow-[10px_0_30px_rgba(0,0,0,0.8)]'}
          `}
        >
          {/* Avatar Imagem cobrindo tudo (Full Bleed Horizontal) */}
          <div className="absolute inset-0 z-0 bg-black">
            <Image 
              src="/atena/Atena%20Autonoma%20Digital.png" 
              alt="Atena Avatar" 
              fill
              className="object-cover object-top"
              priority
            />
            {/* Gradiente para escurecer as bordas e dar contraste para o texto/input */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
            <div className={`absolute inset-0 bg-gradient-to-r ${viewMode === 'fullscreen' ? 'from-black/20 via-transparent to-black/20' : 'from-transparent to-black/60'} pointer-events-none`} />
          </div>
        </div>

        {/* LADO DIREITO: TERMINAL E WORKSPACE */}
        <div 
          className={`h-full bg-[#050505] flex flex-col relative transition-all duration-700 ease-in-out z-10
            ${viewMode === 'fullscreen' ? 'w-0 opacity-0 translate-x-full' : 'w-1/2 opacity-100 translate-x-0'}
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
            className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-800"
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

      {/* BARRA DE INPUT FLUTUANTE (SEMPRE VISÍVEL) */}
      <div className={`absolute bottom-8 transition-all duration-700 ease-in-out z-50
        ${viewMode === 'fullscreen' ? 'w-full max-w-2xl left-1/2 -translate-x-1/2' : 'w-[calc(50%-4rem)] left-[2rem]'}
      `}>
        <form onSubmit={handleSendMessage} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center gap-2 bg-[#050505]/80 backdrop-blur-xl border border-indigo-900/50 rounded-full p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            
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
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Digite sua ordem para a Atena..."
              className="flex-1 bg-transparent border-none px-2 py-2 text-indigo-100 placeholder-indigo-300/50 focus:outline-none focus:ring-0 text-sm tracking-wide font-medium"
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

    </div>
  );
}
