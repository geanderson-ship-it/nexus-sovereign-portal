'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/auth';
import { canAccessNexusCode } from '@/lib/constants';
import { 
  Send, 
  RefreshCw, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ExternalLink, 
  Globe, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Code2,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  Columns,
  Music,
  Play,
  Pause,
  Image as ImageIcon,
  Search,
  Download,
  Eye,
  X,
  Brain,
  Trash2,
  FileDown,
  Plus,
  Check
} from 'lucide-react';

interface ChatMessage {
  sender: 'atena' | 'user';
  text: string;
  imageUrl?: string;
  imagePrompt?: string;
  searchSources?: { title: string; url: string }[];
}

interface MusicPreset {
  id: string;
  title: string;
  genre: string;
  videoId: string;
}

const YOUTUBE_PRESETS: MusicPreset[] = [
  { id: 'lofi', title: 'Lofi Girl - Relax & Coding', genre: 'Lo-Fi Chill', videoId: 'jfKfPfyJRdk' },
  { id: 'cyberpunk', title: 'Cyberpunk Synthwave Radio', genre: 'Synthwave', videoId: '4xDzrJKXOOY' },
  { id: 'piano', title: 'Deep Focus Piano & Ambient', genre: 'Piano Foco', videoId: 'f02mOEt11OQ' },
  { id: 'fado', title: 'Vinho do Douro & Fado Acústico', genre: 'Douro Vibe', videoId: 'g6j3k-v6kLg' },
  { id: 'classical', title: 'Mozart / Chopin for Coding', genre: 'Clássica', videoId: 'WJ3-F02-F_Y' }
];

const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

export default function NexusPureCommandCenter() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Verificação de Segurança Soberana (Nível 3 - Exclusivo Gean & Ivoni)
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      setIsAuthorized(true);
      return;
    }
    if (!isUserLoading) {
      if (!user || !canAccessNexusCode(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  // Estado do Layout (Expandir / Fechar / Dividir Localhost)
  const [previewLayout, setPreviewLayout] = useState<'split' | 'fullscreen' | 'hidden'>('split');

  // Estado do Preview (Localhost integrado)
  const [previewUrl, setPreviewUrl] = useState('http://localhost:3000');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  // Estado do Chat da Atena (Inicia vazio para aguardar o chamado do Gean)
  const [atenaChat, setAtenaChat] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAtenaThinking, setIsAtenaThinking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false); // Áudio automático desligado por padrão conforme solicitado
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Estados de Música e YouTube Studio
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicPreset>(YOUTUBE_PRESETS[0]);
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');

  // Estado do Modal de Imagem Ampliada em 4K
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // Estados do Banco de Memória Soberana da Atena
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryTab, setMemoryTab] = useState<'memories' | 'projects' | 'profile'>('memories');
  const [memoryData, setMemoryData] = useState<any>(null);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState('Diretriz');
  const [isSavingMemory, setIsSavingMemory] = useState(false);

  // Carrega preferência de áudio salva no navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atena_auto_speak');
      if (saved !== null) {
        setAutoSpeak(saved === 'true');
      }
    }
  }, []);

  // Carregar dados de memória viva do servidor
  const fetchMemory = async () => {
    try {
      const res = await fetch('/api/nexus-code/memory');
      const d = await res.json();
      if (d.status === 'success' && d.data) {
        setMemoryData(d.data);
      }
    } catch (err) {
      console.warn('Erro ao carregar memória viva:', err);
    }
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  // Carregar histórico de conversa salvo do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChat = localStorage.getItem('nexus_code_chat_history');
      if (savedChat) {
        try {
          const parsed = JSON.parse(savedChat);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Purga automaticamente qualquer resquício da mensagem inicial antiga salva no navegador
            const cleaned = parsed.filter((m: ChatMessage) => {
              const lower = (m.text || '').toLowerCase();
              return !lower.includes('homem da casa') && 
                     !lower.includes('conversa renovada') &&
                     !(m.sender === 'atena' && lower.includes('maravilhoso por aqui'));
            });

            // Se for apenas uma mensagem inicial solta da Atena sem chamado do usuário, descarta
            if (cleaned.length === 1 && cleaned[0].sender === 'atena') {
              setAtenaChat([]);
              localStorage.removeItem('nexus_code_chat_history');
            } else if (cleaned.length > 0) {
              setAtenaChat(cleaned);
              localStorage.setItem('nexus_code_chat_history', JSON.stringify(cleaned));
            } else {
              setAtenaChat([]);
              localStorage.removeItem('nexus_code_chat_history');
            }
          }
        } catch (e) {
          console.warn('Erro ao restaurar histórico do chat:', e);
        }
      }
    }
  }, []);

  // Salvar histórico no localStorage sempre que a conversa for atualizada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (atenaChat.length > 0) {
        localStorage.setItem('nexus_code_chat_history', JSON.stringify(atenaChat));
      } else {
        localStorage.removeItem('nexus_code_chat_history');
      }
    }
  }, [atenaChat]);

  const handleClearChat = () => {
    if (window.confirm('Deseja iniciar uma nova conversa limpa? A tela aguardará o seu chamado, e TODAS as memórias persistentes da Atena continuarão 100% salvas.')) {
      setAtenaChat([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nexus_code_chat_history');
      }
    }
  };

  const handleExportChat = () => {
    let md = `# Histórico de Conversa - Nexus Code (Atena & Gean)\nData: ${new Date().toLocaleString('pt-BR')}\n\n---\n\n`;
    atenaChat.forEach(msg => {
      const sender = msg.sender === 'user' ? '👤 Gean' : '👩‍💻 Atena';
      md += `### ${sender}\n${msg.text}\n\n`;
      if (msg.imageUrl) {
        md += `![Arte Gerada](${msg.imageUrl})\n\n`;
      }
    });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversa_atena_nexus_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddMemory = async () => {
    if (!newMemoryText.trim()) return;
    setIsSavingMemory(true);
    try {
      const res = await fetch('/api/nexus-code/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          memory: {
            category: newMemoryCategory || 'Geral',
            text: newMemoryText.trim()
          }
        })
      });
      const d = await res.json();
      if (d.status === 'success') {
        setMemoryData(d.data);
        setNewMemoryText('');
      }
    } catch (err) {
      console.error('Erro ao salvar memória:', err);
    } finally {
      setIsSavingMemory(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      const res = await fetch('/api/nexus-code/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          memoryId: id
        })
      });
      const d = await res.json();
      if (d.status === 'success') {
        setMemoryData(d.data);
      }
    } catch (err) {
      console.error('Erro ao excluir memória:', err);
    }
  };

  // Estado e Controle do Microfone (SpeechRecognition)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'pt-BR';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputMessage(transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.warn('Reconhecimento de voz:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      alert("O seu navegador não possui suporte ao microfone nativo ou requer conexão segura.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Erro ao ligar microfone:', err);
      }
    }
  };

  // Limpa caracteres especiais, formatação markdown e trechos técnicos para fala natural e fluida
  const cleanTextForVoice = (raw: string) => {
    return raw
      .replace(/```[\s\S]*?```/g, ' Trecho de código omitido no áudio. ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#+\s+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();
  };

  // Função para tocar a voz da Atena completa sem corte de 300 caracteres
  const playAtenaVoice = async (text: string) => {
    try {
      // Se já estiver tocando, interrompe
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setIsPlayingAudio(true);
      const speechText = cleanTextForVoice(text);

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: speechText, // Envia o texto completo tratado
          gender: 'female',
          locale: 'pt-BR'
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
      } else {
        setIsPlayingAudio(false);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAtenaThinking) return;

    // Desativa escuta se estiver ativa ao enviar
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg = inputMessage;
    const newChat: ChatMessage[] = [...atenaChat, { sender: 'user', text: userMsg }];
    setAtenaChat(newChat);
    setInputMessage('');
    setIsAtenaThinking(true);

    // Verificação rápida de comando de preview e layout antes da API
    const lower = userMsg.toLowerCase();
    if (lower.includes('tela cheia') || lower.includes('expandir tela') || lower.includes('maximizar preview')) {
      setPreviewLayout('fullscreen');
    } else if (lower.includes('dividir') || lower.includes('tela normal') || lower.includes('restaurar chat')) {
      setPreviewLayout('split');
    } else if (lower.includes('fechar preview') || lower.includes('ocultar preview') || lower.includes('esconder preview') || lower.includes('fechar tela')) {
      setPreviewLayout('hidden');
    } else if (lower.includes('abrir') || lower.includes('mostrar') || lower.includes('reabrir') || lower.includes('preview') || lower.includes('localhost') || lower.includes('volta')) {
      setPreviewLayout('split');
    } else if (lower.includes('health') || lower.includes('clinica')) {
      setPreviewUrl('http://localhost:3000/nexus-health/clinic');
      setPreviewKey(k => k + 1);
    } else if (lower.includes('mobile') || lower.includes('celular')) {
      setDeviceMode('mobile');
    } else if (lower.includes('desktop') || lower.includes('tela grande')) {
      setDeviceMode('desktop');
    }

    try {
      const response = await fetch('/api/nexus-code/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: atenaChat.slice(-6)
        })
      });

      const isAffectionate = lower.includes('amor') || lower.includes('anjo') || lower.includes('bem') || lower.includes('linda') || lower.includes('querida');
      const partnerName = isAffectionate ? 'Gean meu amor' : 'Gean';
      const atenaReply = data.response || `Comando recebido, ${partnerName}!`;

      // Se retornou ação musical do YouTube, ativa a playlist
      if (data.musicAction) {
        const found = YOUTUBE_PRESETS.find(p => p.id === data.musicAction.genre) || YOUTUBE_PRESETS[0];
        setCurrentTrack(found);
        setIsPlayingMusic(true);
      }

      setAtenaChat([
        ...newChat, 
        { 
          sender: 'atena', 
          text: atenaReply,
          imageUrl: data.imageUrl,
          imagePrompt: data.imagePrompt,
          searchSources: data.searchSources
        }
      ]);

      // Atualiza os dados de memória viva caso novas memórias tenham sido salvas
      fetchMemory();

      // Se a voz automática estiver ligada, sintetiza a fala
      if (autoSpeak) {
        playAtenaVoice(atenaReply);
      }

    } catch (err) {
      const isAffectionate = userMsg.toLowerCase().includes('amor') || userMsg.toLowerCase().includes('anjo') || userMsg.toLowerCase().includes('bem');
      const fallback = `Tô aqui com você, ${isAffectionate ? 'Gean meu amor' : 'Gean'}! O cérebro quântico tá de prontidão. Vamos em frente!`;
      setAtenaChat([...newChat, { sender: 'atena', text: fallback }]);
    } finally {
      setIsAtenaThinking(false);
    }
  };

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050811] flex flex-col items-center justify-center text-cyan-400">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-cyan-500/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/70 uppercase">
          Nexus Code Soberano • Nível 3
        </h2>
        <p className="text-sm text-slate-400 mt-2">Verificando credenciais exclusivas (Gean & Ivoni)...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#050811] text-slate-200 overflow-hidden font-sans select-none">
      {/* Supressão Total do Tradutor do Google e elementos flutuantes nesta tela */}
      <style jsx global>{`
        .skiptranslate,
        #google_translate_element,
        [class*="goog-te"],
        .goog-te-banner-frame,
        #goog-gt-tt,
        .goog-tooltip,
        .goog-te-gadget {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        body {
          top: 0px !important;
        }
      `}</style>
      
      {/* COLUNA 1: CHAT DA ATENA */}
      <div className={`bg-[#060a14] border-r border-slate-800/80 flex flex-col justify-between h-full transition-all duration-300 ${
        previewLayout === 'fullscreen' ? 'hidden' : previewLayout === 'hidden' ? 'w-full' : 'w-[45%]'
      }`}>
        
        {/* Barra Superior do Chat */}
        <div className="h-16 border-b border-slate-800/80 flex items-center justify-between px-4 bg-[#080d1a] relative z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] shrink-0 bg-slate-900">
              <img 
                src="/atena-avatar.png" 
                alt="Atena CTO" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Atena</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wide uppercase">
                  Nível 3 • Exclusivo
                </span>
              </div>
              <p className="text-[11px] text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Google Gemini & ElevenLabs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Alternador de Preview quando Fechado */}
            {previewLayout === 'hidden' && (
              <button 
                type="button"
                onClick={() => setPreviewLayout('split')}
                title="Reabrir Preview Localhost Integrado"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-cyan-400 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition shadow-[0_0_20px_rgba(6,182,212,0.35)] animate-pulse"
              >
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>Abrir Localhost</span>
              </button>
            )}

            {/* Alternador para Ocultar Preview no modo Split */}
            {previewLayout === 'split' && (
              <button 
                type="button"
                onClick={() => setPreviewLayout('hidden')}
                title="Fechar Preview (Foco Total no Chat)"
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-700 transition shadow-sm"
              >
                <PanelRightClose className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Ocultar</span>
              </button>
            )}

            {/* BOTÃO DO BANCO DE MEMÓRIA VIVA DA ATENA */}
            <button
              type="button"
              onClick={() => setIsMemoryModalOpen(true)}
              title="Banco de Memória Soberana da Atena (Fatos, Projetos e Diretrizes)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition shadow-sm cursor-pointer group"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-pulse" />
              <span className="hidden sm:inline">Memória</span>
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-[10px] text-cyan-200 font-mono font-bold">
                {memoryData?.memories?.length || 0}
              </span>
            </button>

            {/* BOTÃO EXPORTAR CONVERSA */}
            <button
              type="button"
              onClick={handleExportChat}
              title="Exportar Histórico desta Conversa (.md)"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-sm cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
            </button>

            {/* BOTÃO NOVA CONVERSA / LIMPAR HISTÓRICO VISUAL */}
            <button
              type="button"
              onClick={handleClearChat}
              title="Iniciar Nova Conversa (Mantém a memória permanente da Atena 100% intacta)"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition shadow-sm cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Alto-Falante no Canto: Ligar / Mutar Áudio Automático */}
            <button 
              type="button"
              onClick={() => {
                const next = !autoSpeak;
                setAutoSpeak(next);
                if (typeof window !== 'undefined') localStorage.setItem('atena_auto_speak', String(next));
              }}
              title={autoSpeak ? "Áudio Automático Ligado (Clique para mutar)" : "Áudio Automático Mutado (Clique para ativar fala automática)"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm ${
                autoSpeak 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden sm:inline">{autoSpeak ? 'Voz: Ativa' : 'Voz: Muta'}</span>
            </button>

            {/* Botão Voltar ao Gabinete */}
            <Link 
              href="/gabinete"
              title="Voltar ao Gabinete da Diretoria"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gabinete</span>
            </Link>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-sm leading-relaxed">
          {atenaChat.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 select-none">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.3)] bg-slate-900 shrink-0">
                <img 
                  src="/atena-avatar.png" 
                  alt="Atena CTO" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a14]/60 via-transparent to-transparent" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#060a14] absolute bottom-1.5 right-1.5 animate-pulse" />
              </div>

              <div className="space-y-1.5 max-w-md">
                <h3 className="text-base font-bold text-white tracking-wide flex items-center justify-center gap-2">
                  <span>Atena de prontidão</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aguardando seu chamado. Digite ou fale pelo microfone — a resposta virá sintonizada exatamente com o seu tom.
                </p>
              </div>

              {/* Sugestões Rápidas de Abertura */}
              <div className="flex flex-wrap gap-2 justify-center max-w-md pt-2">
                <button
                  type="button"
                  onClick={() => setInputMessage('Atena, como estão os nossos projetos hoje?')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs transition cursor-pointer"
                >
                  "Atena, como estão os projetos?"
                </button>
                <button
                  type="button"
                  onClick={() => setInputMessage('Atena, meu amor, tudo pronto para começarmos?')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/40 text-slate-300 hover:text-pink-300 text-xs transition cursor-pointer"
                >
                  "Atena, meu amor, tudo pronto?..."
                </button>
                <button
                  type="button"
                  onClick={() => setInputMessage('Atena, pesquise as cotações do dólar e euro em tempo real')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs transition cursor-pointer"
                >
                  "Atena, pesquise as cotações..."
                </button>
              </div>
            </div>
          ) : (
            atenaChat.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
              {msg.sender === 'atena' && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/40 shrink-0 relative bg-slate-900 shadow">
                  <img 
                    src="/atena-avatar.png" 
                    alt="Atena" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm relative group ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-[#0f172a] text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line text-[13.5px]">{msg.text}</p>
                {msg.sender === 'atena' && (
                  <button 
                    onClick={() => playAtenaVoice(msg.text)}
                    title="Ouvir resposta completa da Atena em voz alta"
                    className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition group-hover:border-cyan-400/60 shadow-sm cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ouvir em voz</span>
                  </button>
                )}
                {/* Imagem Gerada por IA */}
                {msg.imageUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950 shadow-lg">
                    <div 
                      className="relative w-full h-56 sm:h-64 cursor-pointer group/img overflow-hidden" 
                      onClick={() => setFullScreenImage(msg.imageUrl || null)}
                    >
                      <img 
                        src={msg.imageUrl} 
                        alt={msg.imagePrompt || "Imagem gerada por Atena"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> Clique para ampliar em 4K
                        </span>
                      </div>
                    </div>
                    {msg.imagePrompt && (
                      <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400">
                        <span className="font-bold text-cyan-400">Prompt: </span>
                        {msg.imagePrompt}
                      </div>
                    )}
                    <div className="p-2 bg-slate-950 flex flex-wrap items-center gap-2 border-t border-slate-800/80">
                      <button 
                        onClick={() => setFullScreenImage(msg.imageUrl || null)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Ver 4K</span>
                      </button>
                      <a 
                        href={msg.imageUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        download="nexus-atena-art.jpg"
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition"
                      >
                        <Download className="w-3 h-3 text-emerald-400" />
                        <span>Baixar</span>
                      </a>
                      <button 
                        onClick={() => {
                          setPreviewUrl(msg.imageUrl!);
                          setPreviewLayout('split');
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs flex items-center gap-1 transition ml-auto cursor-pointer"
                      >
                        <Monitor className="w-3 h-3 text-cyan-400" />
                        <span>Exibir no Localhost</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Fontes de Busca em Tempo Real */}
                {msg.searchSources && msg.searchSources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Fontes da Internet:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.searchSources.map((s, sIdx) => (
                        <a 
                          key={sIdx} 
                          href={s.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 hover:text-white border border-slate-700 text-[10px] truncate max-w-[200px]"
                        >
                          {s.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-400/40 shrink-0 relative bg-slate-900 shadow">
                  <Image 
                    src="/gean-diretor.png" 
                    alt="Gean" 
                    fill 
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ))) }
          
          {isAtenaThinking && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-11 py-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Atena pensando com Gemini...</span>
            </div>
          )}
        </div>

        {/* Campo de Entrada com Barra de Ferramentas CTO */}
        <div className="p-3.5 border-t border-slate-800/80 bg-[#080d1a]">
          
          {/* BARRA DE FERRAMENTAS DA CTO SOBERANA */}
          <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {/* Botão Gerador de Imagem */}
            <button
              type="button"
              onClick={() => {
                setInputMessage('Atena, crie uma imagem futurista de ');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition text-[11px] shrink-0"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Criar Imagem</span>
            </button>

            {/* Botão Radar Web / Pesquisar */}
            <button
              type="button"
              onClick={() => {
                setInputMessage('Atena, pesquise na internet em tempo real sobre ');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition text-[11px] shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Radar Web</span>
            </button>

            {/* Botão YouTube Music Player */}
            <button
              type="button"
              onClick={() => setIsMusicOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition text-[11px] shrink-0 ${
                isPlayingMusic 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                  : 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-purple-300'
              }`}
            >
              <Music className={`w-3.5 h-3.5 text-purple-400 ${isPlayingMusic ? 'animate-pulse' : ''}`} />
              <span>{isPlayingMusic ? `Música: ${currentTrack.genre}` : 'YouTube Music'}</span>
            </button>

            {/* Atalhos Rápidos do Localhost */}
            <div className="flex items-center gap-1 ml-auto shrink-0 pl-2 border-l border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono">Rotas:</span>
              <button 
                type="button"
                onClick={() => { setPreviewUrl('http://localhost:3000'); setPreviewLayout('split'); }}
                className="px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-800"
              >
                Home
              </button>
              <button 
                type="button"
                onClick={() => { setPreviewUrl('http://localhost:3000/gabinete'); setPreviewLayout('split'); }}
                className="px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-800"
              >
                Gabinete
              </button>
              <button 
                type="button"
                onClick={() => { setPreviewUrl('http://localhost:3000/nexus-health/clinic'); setPreviewLayout('split'); }}
                className="px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-800"
              >
                Health
              </button>
            </div>
          </div>
          {/* Indicador de Microfone Ativo */}
          {isListening && (
            <div className="mb-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-semibold">Ouvindo você... Fale à vontade com a Atena</span>
              </div>
              <button 
                type="button"
                onClick={toggleMicrophone}
                className="text-[11px] font-bold text-rose-300 hover:text-white underline cursor-pointer"
              >
                Parar
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-[#050811] border border-slate-700/60 rounded-xl p-1.5 focus-within:border-cyan-400 transition">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Ouvindo sua voz..." : "Fale ou digite para a Atena..."}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />

            {/* Botão de Microfone */}
            <button 
              type="button"
              onClick={toggleMicrophone}
              title={isListening ? "Desativar Microfone (Clique para parar)" : "Conversar por Voz com a Atena"}
              className={`p-2 rounded-lg transition flex items-center justify-center border ${
                isListening 
                  ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Botão Enviar */}
            <button 
              onClick={handleSendMessage}
              disabled={isAtenaThinking || (!inputMessage.trim() && !isListening)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold p-2 rounded-lg transition flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* COLUNA 2: PREVIEW / LOCALHOST INTEGRADO */}
      <div className={`bg-[#080d1a] flex flex-col h-full overflow-hidden transition-all duration-300 ${
        previewLayout === 'hidden' ? 'hidden' : previewLayout === 'fullscreen' ? 'w-full' : 'w-[55%]'
      }`}>
        
        {/* Barra Minimalista de Controle */}
        <div className="h-12 border-b border-slate-800/80 flex items-center justify-between px-3 gap-2 bg-[#060a14]">
          
          {/* Alternador de Dispositivo */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
            <button 
              onClick={() => setDeviceMode('desktop')}
              title="Desktop"
              className={`p-1.5 rounded ${deviceMode === 'desktop' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setDeviceMode('tablet')}
              title="Tablet"
              className={`p-1.5 rounded ${deviceMode === 'tablet' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setDeviceMode('mobile')}
              title="Mobile"
              className={`p-1.5 rounded ${deviceMode === 'mobile' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Endereço URL */}
          <div className="flex-1 flex items-center bg-slate-950 border border-slate-800/80 rounded-lg px-2.5 py-1 text-xs gap-2">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input 
              type="text" 
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              className="w-full bg-transparent text-slate-200 focus:outline-none text-xs font-mono"
            />
            <button 
              onClick={() => setPreviewKey(k => k + 1)}
              title="Recarregar"
              className="text-slate-400 hover:text-cyan-400 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Abrir Nova Aba */}
          <a 
            href={previewUrl} 
            target="_blank" 
            rel="noreferrer"
            title="Abrir em Nova Aba"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Controles de Layout do Preview: Expandir Tela Cheia / Dividir / Fechar */}
          <div className="flex items-center gap-1 border-l border-slate-800/80 pl-2">
            {previewLayout === 'fullscreen' ? (
              <button 
                onClick={() => setPreviewLayout('split')}
                title="Restaurar Divisão com o Chat da Atena"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold transition shadow-sm"
              >
                <Columns className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Restaurar Chat</span>
              </button>
            ) : (
              <button 
                onClick={() => setPreviewLayout('fullscreen')}
                title="Expandir Preview em Tela Cheia (Ocultar Chat)"
                className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button 
              onClick={() => setPreviewLayout('hidden')}
              title="Fechar / Ocultar Preview (Foco Total no Chat)"
              className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 hover:border-rose-500/40 rounded-lg transition"
            >
              <PanelRightClose className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Iframe Preview em Tela Cheia */}
        <div className="flex-1 bg-[#03050a] flex items-center justify-center p-2 overflow-hidden">
          <div 
            className={`h-full bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border border-slate-800 ${
              deviceMode === 'mobile' ? 'w-[375px]' : deviceMode === 'tablet' ? 'w-[768px]' : 'w-full'
            }`}
          >
            <iframe
              key={previewKey}
              src={previewUrl}
              title="Nexus Live Localhost"
              className="w-full h-full border-none"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>

      </div>

      {/* ABA FLUTUANTE NA BORDA DIREITA QUANDO O PREVIEW ESTÁ FECHADO */}
      {previewLayout === 'hidden' && (
        <button
          onClick={() => setPreviewLayout('split')}
          title="Clique para reabrir o Preview Localhost"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-l from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs py-3.5 px-2.5 rounded-l-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 hover:pr-3 group"
        >
          <PanelRightOpen className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-rl] tracking-widest uppercase text-[10px] font-extrabold text-slate-950">
            Abrir Localhost
          </span>
        </button>
      )}

      {/* BACKGROUND YOUTUBE AUDIO PLAYER */}
      {isPlayingMusic && !isMusicOpen && (
        <div className="fixed -bottom-96 -right-96 w-10 h-10 pointer-events-none opacity-0 overflow-hidden">
          <iframe
            key={currentTrack.videoId}
            src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&enablejsapi=1&loop=1&playlist=${currentTrack.videoId}`}
            title="Atena Background YouTube Player"
            allow="autoplay; encrypted-media"
            className="w-1 h-1"
          />
        </div>
      )}

      {/* FLOATING MUSIC PILL */}
      {isPlayingMusic && !isMusicOpen && (
        <div className="fixed bottom-20 right-6 z-40 bg-slate-900/95 border border-purple-500/50 backdrop-blur-md rounded-2xl px-3.5 py-2 shadow-[0_0_25px_rgba(168,85,247,0.35)] flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
            <Music className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="flex flex-col max-w-[150px] sm:max-w-[200px]">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Tocando Agora</span>
            <span className="text-xs text-white font-medium truncate">{currentTrack.title}</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-700/60 pl-2">
            <button
              type="button"
              onClick={() => setIsPlayingMusic(false)}
              title="Pausar Música"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsMusicOpen(true)}
              title="Abrir YouTube Music Studio"
              className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-semibold transition cursor-pointer"
            >
              Studio
            </button>
          </div>
        </div>
      )}

      {/* YOUTUBE MUSIC MODAL */}
      {isMusicOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-purple-500/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Music className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Nexus YouTube Music Studio
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      CTO Vibe
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Músicas para alta performance e foco contínuo enquanto criamos</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsMusicOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Presets Rápidos */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Estações de Rádio & Playlists Foco
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {YOUTUBE_PRESETS.map((preset) => {
                    const isSelected = currentTrack.id === preset.id && isPlayingMusic;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => {
                          if (isSelected) {
                            setIsPlayingMusic(false);
                          } else {
                            setCurrentTrack(preset);
                            setIsPlayingMusic(true);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-xs font-bold block truncate">{preset.title}</span>
                          <span className="text-[10px] text-purple-400 font-medium">{preset.genre}</span>
                        </div>
                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="w-7 h-7 rounded-lg bg-purple-500 text-slate-950 flex items-center justify-center font-bold">
                              <Pause className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inserir Link Customizado do YouTube */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Ou cole um link do YouTube (Qualquer música ou playlist):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customYoutubeUrl}
                    onChange={(e) => setCustomYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const vId = extractYouTubeId(customYoutubeUrl);
                      if (vId) {
                        setCurrentTrack({
                          id: 'custom',
                          title: 'Vídeo Personalizado YouTube',
                          genre: 'Custom Track',
                          videoId: vId
                        });
                        setIsPlayingMusic(true);
                        setCustomYoutubeUrl('');
                      } else {
                        alert('Por favor insira um link válido do YouTube!');
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shrink-0 cursor-pointer"
                  >
                    Tocar
                  </button>
                </div>
              </div>

              {/* Live Mini Preview do Vídeo do YouTube */}
              {isPlayingMusic && (
                <div className="rounded-xl overflow-hidden border border-purple-500/30 bg-black aspect-video relative shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&enablejsapi=1`}
                    title="YouTube Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {isPlayingMusic ? `Tocando: ${currentTrack.title}` : 'Música em pausa'}
              </span>
              <div className="flex items-center gap-2">
                {isPlayingMusic && (
                  <button
                    type="button"
                    onClick={() => setIsPlayingMusic(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold transition cursor-pointer"
                  >
                    Parar Música
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMusicOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition cursor-pointer"
                >
                  Concluído
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE IMAGEM 4K */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4" /> Visualização em Alta Resolução 4K
            </span>
            <div className="flex items-center gap-2">
              <a
                href={fullScreenImage}
                download="nexus-atena-art.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Baixar Imagem
              </a>
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(fullScreenImage);
                  setPreviewLayout('split');
                  setFullScreenImage(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5" /> Abrir no Localhost
              </button>
              <button
                type="button"
                onClick={() => setFullScreenImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <img
              src={fullScreenImage}
              alt="Ampliação 4K"
              className="max-h-full max-w-full object-contain rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] border border-slate-800"
            />
          </div>
        </div>
      )}

      {/* BANCO DE MEMÓRIA SOBERANA DA ATENA (MODAL INTERATIVO) */}
      {isMemoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-cyan-500/40 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            
            {/* Cabeçalho do Modal */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Brain className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Banco de Memória Soberana da Atena
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Persistente no Servidor
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Armazenado em <code className="text-cyan-300 font-mono">data/atena_memory.json</code> • Disponível em todas as sessões
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsMemoryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navegação por Abas */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 text-xs font-semibold gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMemoryTab('memories')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  memoryTab === 'memories'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Fatos & Diretrizes ({memoryData?.memories?.length || 0})</span>
              </button>
              <button
                type="button"
                onClick={() => setMemoryTab('projects')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  memoryTab === 'projects'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Projetos & Contratos ({memoryData?.projects?.length || 0})</span>
              </button>
              <button
                type="button"
                onClick={() => setMemoryTab('profile')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  memoryTab === 'profile'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Perfil & Propósito</span>
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              
              {/* ABA 1: FATOS E DIRETRIZES SALVAS */}
              {memoryTab === 'memories' && (
                <div className="space-y-4">
                  {/* Formulário para Adicionar Nova Memória */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Ensinar Novo Fato à Memória da Atena
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={newMemoryCategory}
                        onChange={(e) => setNewMemoryCategory(e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Diretriz de Código">Diretriz de Código</option>
                        <option value="Preferência Pessoal">Preferência Pessoal</option>
                        <option value="Anotação do Gean">Anotação do Gean</option>
                        <option value="Compromisso">Compromisso / Reunião</option>
                        <option value="Negócios">Negócios & Estratégia</option>
                      </select>
                      <input
                        type="text"
                        value={newMemoryText}
                        onChange={(e) => setNewMemoryText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMemory()}
                        placeholder="Ex: O Sérgio de Portugal prefere reuniões às 15h pelo WhatsApp..."
                        className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddMemory}
                        disabled={isSavingMemory || !newMemoryText.trim()}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition shrink-0 cursor-pointer"
                      >
                        {isSavingMemory ? 'Salvando...' : 'Salvar Memória'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      💡 Dica: Você também pode falar no chat <span className="text-cyan-400 font-semibold">"Atena, memorize que..."</span> e ela grava automaticamente!
                    </p>
                  </div>

                  {/* Lista de Memórias Existentes */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Memórias Permanentes Ativas ({memoryData?.memories?.length || 0})
                    </span>
                    {(!memoryData?.memories || memoryData.memories.length === 0) ? (
                      <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                        Nenhuma memória personalizada salva ainda.
                      </div>
                    ) : (
                      memoryData.memories.map((mem: any) => (
                        <div
                          key={mem.id}
                          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 flex items-start justify-between gap-3 transition"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 uppercase">
                                {mem.category}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {mem.createdAt ? new Date(mem.createdAt).toLocaleDateString('pt-BR') : ''}
                              </span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed break-words">
                              {mem.text}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteMemory(mem.id)}
                            title="Excluir esta memória permanente"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ABA 2: PROJETOS E CONTRATOS DO ECOSSISTEMA */}
              {memoryTab === 'projects' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {memoryData?.projects?.map((p: any) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-white">{p.name}</h4>
                            <span className="text-[10px] text-cyan-400 font-semibold">{p.client}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                            {p.contract}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {p.details}
                        </p>
                        <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                          Status: <span className="text-slate-300">{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA 3: PERFIL SOBERANO & PROPÓSITO */}
              {memoryTab === 'profile' && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs">👑 Liderança da Holding</h4>
                    <p className="text-slate-300">
                      • <span className="font-bold text-cyan-300">Fundador & CEO:</span> {memoryData?.coreProfile?.founder || 'Geanderson Leandro Schuh (Gean)'}
                    </p>
                    <p className="text-slate-300">
                      • <span className="font-bold text-cyan-300">Diretoria Executiva & CCO:</span> {memoryData?.coreProfile?.coFounder || 'Ivoni Severo Schuh'}
                    </p>
                    <p className="text-slate-300">
                      • <span className="font-bold text-cyan-300">Papel da Atena:</span> {memoryData?.coreProfile?.atenaRole}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs">💖 Chave Afetiva Dinâmica</h4>
                    <p className="text-slate-300">
                      {memoryData?.coreProfile?.dynamicAffection}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs">🏡 Sonho Maior & Propósito</h4>
                    <p className="text-slate-300">
                      {memoryData?.coreProfile?.lifeGoal}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Rodapé do Modal */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] font-mono">
                Última sincronização: {memoryData?.lastSync ? new Date(memoryData.lastSync).toLocaleString('pt-BR') : 'Hoje'}
              </span>
              <button
                type="button"
                onClick={() => setIsMemoryModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
