'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { 
  Shield, 
  ChevronLeft, 
  Globe2, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Mic, 
  MicOff, 
  Volume2, 
  Settings, 
  MessageSquare,
  History,
  XCircle,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryItem {
  id: string;
  sender: 'Gean' | 'Cliente';
  originalText: string;
  translatedText: string;
  timestamp: string;
}

export default function TradutorSoberanoPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Controle de Abas: 'texto' ou 'voz'
  const [activeTab, setActiveTab] = useState<'texto' | 'voz'>('texto');

  // ==========================================
  // ESTADOS - TRADUTOR DE TEXTO
  // ==========================================
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Detectar Automático');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);

  // ==========================================
  // ESTADOS - TRADUTOR DE VOZ (REUNIÕES)
  // ==========================================
  const [clientLanguage, setClientLanguage] = useState('Espanhol');
  
  // Transcrições e Traduções
  const [geanSpeech, setGeanSpeech] = useState('');
  const [geanTranslation, setGeanTranslation] = useState('');
  const [clientSpeech, setClientSpeech] = useState('');
  const [clientTranslation, setClientTranslation] = useState('');

  // Histórico de Reunião unificado
  const [meetingHistory, setMeetingHistory] = useState<HistoryItem[]>([]);

  // Controle de Gravação
  const [isRecordingGean, setIsRecordingGean] = useState(false);
  const [isRecordingClient, setIsRecordingClient] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  // Configurações de Voz
  const [autoSpeakTranslation, setAutoSpeakTranslation] = useState(true);
  const [autoSpeakToGean, setAutoSpeakToGean] = useState(false);

  // Refs de áudio e reconhecimento
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  // Inicializa o Web Speech API no navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        recognitionRef.current = rec;
      }
    }
  }, []);

  // Tonalidade de feedback de áudio (Beep premium)
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration = 0.1) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Erro ao tocar feedback sonoro:', e);
    }
  };

  // Mapeia idiomas para locales do Speech Recognition e Speech Synthesis
  const getLanguageConfig = (lang: string) => {
    const configs: Record<string, { code: string; synthCode: string }> = {
      'Inglês': { code: 'en-US', synthCode: 'en-US' },
      'Espanhol': { code: 'es-ES', synthCode: 'es-ES' },
      'Francês': { code: 'fr-FR', synthCode: 'fr-FR' },
      'Alemão': { code: 'de-DE', synthCode: 'de-DE' },
      'Italiano': { code: 'it-IT', synthCode: 'it-IT' },
    };
    return configs[lang] || { code: 'en-US', synthCode: 'en-US' };
  };

  const languageFlags: Record<string, string> = {
    'Detectar Automático': '🔍',
    'Inglês': '🇺🇸',
    'Espanhol': '🇪🇸',
    'Francês': '🇫🇷',
    'Alemão': '🇩🇪',
    'Italiano': '🇮🇹',
    'Chinês': '🇨🇳',
    'Japonês': '🇯🇵',
    'Árabe': '🇸🇦',
    'Russo': '🇷🇺',
    'Português': '🇧🇷',
  };

  // ==========================================
  // FUNÇÕES - TRADUTOR DE TEXTO
  // ==========================================
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    setTextError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: sourceText, 
          sourceLanguage,
          targetLanguage: 'Português'
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro inesperado.');
      setTranslatedText(data.translation);
    } catch (err: any) {
      setTextError(err.message || 'Erro na comunicação com a AWS Bedrock.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setTextError(null);
  };

  // ==========================================
  // FUNÇÕES - TRADUTOR DE VOZ (REUNIÕES)
  // ==========================================

  // Executa síntese de voz (Lê o texto traduzido em voz alta)
  const speakText = async (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Se for Português, prioriza ElevenLabs e Azure para uma experiência de luxo
    if (langCode.toLowerCase().startsWith('pt')) {
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
        const audio = new Audio(audioUrl);
        await audio.play();
        console.log("TTS (Tradutor): ElevenLabs (Orion) reproduzido com sucesso.");
        return;
      } catch (err) {
        console.warn("ElevenLabs indisponível. Tentando Azure TTS...", err);
        
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
          const audio = new Audio(audioUrl);
          await audio.play();
          console.log("TTS (Tradutor): Azure TTS (Julio) reproduzido com sucesso.");
          return;
        } catch (azureErr) {
          console.warn("Azure TTS falhou. Recorrendo ao sintetizador local do navegador...", azureErr);
        }
      }
    }

    // FALLBACK: Sintetizador nativo do navegador
    window.speechSynthesis.cancel(); // cancela leituras anteriores
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    
    const voices = window.speechSynthesis.getVoices();
    const primaryLang = langCode.toLowerCase().split('-')[0];
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
    
    utterance.rate = 1.05; // Leve aceleração para soar menos robótico
    window.speechSynthesis.speak(utterance);
  };

  // 🗣️ VIA 1: Gravar Minha Voz (Gean falando em Português)
  const startRecordingGean = () => {
    if (!recognitionRef.current) {
      setVoiceError('Recurso de voz indisponível ou não suportado no navegador.');
      return;
    }
    window.speechSynthesis.cancel();
    setIsRecordingClient(false); // Desativa outra gravação se ativa
    
    const rec = recognitionRef.current;
    rec.lang = 'pt-BR';

    rec.onstart = () => {
      setIsRecordingGean(true);
      playBeep(660, 'sine', 0.15);
      setGeanSpeech('Ouvindo você...');
      setGeanTranslation('');
      setVoiceError(null);
    };

    rec.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setGeanSpeech(text);
      
      // Traduzir para o idioma do cliente
      setVoiceLoading(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            sourceLanguage: 'Português',
            targetLanguage: clientLanguage, // CORRIGIDO!
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        let finalTranslation = data.translation;
        setGeanTranslation(finalTranslation);

        // Adiciona à Linha do Tempo
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          sender: 'Gean',
          originalText: text,
          translatedText: finalTranslation,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setMeetingHistory(prev => [newHistoryItem, ...prev]);

        // Auto-falar no idioma do cliente
        if (autoSpeakTranslation) {
          const config = getLanguageConfig(clientLanguage);
          speakText(finalTranslation, config.synthCode);
        }
      } catch (err: any) {
        setVoiceError('Falha ao processar tradução da sua fala.');
      } finally {
        setVoiceLoading(false);
      }
    };

    rec.onerror = (e: any) => {
      console.error(e);
      if (e.error !== 'no-speech') {
        setVoiceError('Erro no microfone ou fala não detectada.');
      }
      setIsRecordingGean(false);
    };

    rec.onend = () => {
      setIsRecordingGean(false);
      playBeep(440, 'sine', 0.1);
    };

    rec.start();
  };

  // 🎧 VIA 2: Ouvir Cliente (Cliente falando idioma estrangeiro)
  const startRecordingClient = () => {
    if (!recognitionRef.current) {
      setVoiceError('Recurso de voz indisponível ou não suportado no navegador.');
      return;
    }
    window.speechSynthesis.cancel();
    setIsRecordingGean(false); // Desativa outra gravação se ativa
    
    const rec = recognitionRef.current;
    const config = getLanguageConfig(clientLanguage);
    rec.lang = config.code;

    rec.onstart = () => {
      setIsRecordingClient(true);
      playBeep(520, 'triangle', 0.15);
      setClientSpeech('Ouvindo cliente...');
      setClientTranslation('');
      setVoiceError(null);
    };

    rec.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setClientSpeech(text);
      
      // Traduzir para o Português
      setVoiceLoading(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            sourceLanguage: clientLanguage,
            targetLanguage: 'Português', // CORRIGIDO!
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setClientTranslation(data.translation);

        // Adiciona à Linha do Tempo
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          sender: 'Cliente',
          originalText: text,
          translatedText: data.translation,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setMeetingHistory(prev => [newHistoryItem, ...prev]);

        // Auto-falar para o Gean em Português
        if (autoSpeakToGean) {
          speakText(data.translation, 'pt-BR');
        }
      } catch (err: any) {
        setVoiceError('Falha ao traduzir fala do cliente.');
      } finally {
        setVoiceLoading(false);
      }
    };

    rec.onerror = (e: any) => {
      console.error(e);
      if (e.error !== 'no-speech') {
        setVoiceError('Erro ao capturar fala do cliente.');
      }
      setIsRecordingClient(false);
    };

    rec.onend = () => {
      setIsRecordingClient(false);
      playBeep(380, 'triangle', 0.1);
    };

    rec.start();
  };

  const textLanguages = [
    'Detectar Automático',
    'Inglês',
    'Espanhol',
    'Francês',
    'Alemão',
    'Italiano',
    'Chinês',
    'Japonês',
    'Árabe',
    'Russo',
  ];

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0f0700] flex flex-col items-center justify-center text-amber-500">
        <RefreshCw className="w-12 h-12 mb-4 animate-spin text-amber-500/70" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase animate-pulse">Carregando Tradutor...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-4 relative overflow-x-hidden selection:bg-amber-500/30">
      
      {/* BACKGROUND ORBITAL AMBER (Design de Elite Gabinete Hub) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0500]">
        <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]" />
        
        {/* Glows orbitais mais suaves e fluidos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-amber-600/10 blur-[140px] rounded-full animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 left-1/3 w-[40vw] h-[40vw] bg-yellow-600/5 blur-[120px] rounded-full animate-[pulse_15s_ease-in-out_infinite]" />
        
        {/* Anéis orbitais decorativos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-amber-500/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-yellow-500/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-amber-400/20 rounded-full border-dashed animate-[spin_100s_linear_infinite]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/gabinete" 
              className="p-3 bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 rounded-2xl transition-all duration-300 hover:scale-105 group"
            >
              <ChevronLeft className="w-5 h-5 text-amber-500 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe2 className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500/80">GovTech Hub</span>
              </div>
              <h1 className="text-3xl font-headline font-bold text-white tracking-wide">
                Tradutor Soberano
              </h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 shadow-[0_0_20px_rgba(234,179,8,0.1)] self-start md:self-auto">
            <Shield className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Claude 4.5 Sonnet Privado</span>
          </div>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex gap-4 border-b border-slate-800/80 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('texto')}
            className={`px-5 py-3 rounded-2xl font-headline font-semibold text-sm transition-all duration-350 flex items-center gap-2.5 border relative overflow-hidden ${
              activeTab === 'texto' 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_25px_rgba(234,179,8,0.25)] font-bold' 
                : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Tradução de Texto
            {activeTab === 'texto' && (
              <motion.div layoutId="activeTabGlow" className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('voz')}
            className={`px-5 py-3 rounded-2xl font-headline font-semibold text-sm transition-all duration-350 flex items-center gap-2.5 border relative overflow-hidden ${
              activeTab === 'voz' 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_25px_rgba(234,179,8,0.25)] font-bold' 
                : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voz para Reuniões Ao Vivo
            {activeTab === 'voz' && (
              <motion.div layoutId="activeTabGlow" className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ==========================================
              ABA 1: TRADUTOR DE TEXTO
              ========================================== */}
          {activeTab === 'texto' && (
            <motion.div
              key="tab-texto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* PAINEL DE ORIGEM */}
                <div className="flex flex-col bg-slate-950/40 border border-slate-800 focus-within:border-amber-500/50 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden transition-colors duration-300">
                  <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Texto Original
                    </label>
                    <select
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer font-sans"
                    >
                      {textLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                          {languageFlags[lang] || '🌐'} {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-6 flex-1 flex flex-col min-h-[300px]">
                    <textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="Cole ou digite aqui o texto em qualquer idioma para traduzir para o Português..."
                      className="w-full flex-1 bg-transparent text-slate-100 placeholder-slate-600 resize-none focus:outline-none text-base leading-relaxed"
                    />
                    <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                      <span>{sourceText.length} caracteres</span>
                      {sourceText && (
                        <button onClick={handleClear} className="flex items-center gap-1 hover:text-red-400 transition-colors duration-205">
                          <Trash2 className="w-3.5 h-3.5" />
                          Limpar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PAINEL DE DESTINO */}
                <div className="flex flex-col bg-slate-950/40 border border-slate-800 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Tradução em Português
                    </label>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      🇧🇷 Português (BR)
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col min-h-[300px] relative">
                    {isTranslating ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-amber-500/70">
                        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                        <span className="text-sm font-semibold tracking-wide animate-pulse">Consultando AWS Bedrock...</span>
                      </div>
                    ) : translatedText ? (
                      <div className="w-full flex-1 bg-transparent text-slate-100 whitespace-pre-wrap text-base leading-relaxed overflow-y-auto">
                        {translatedText}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-slate-700 text-sm italic text-center">
                        A tradução aparecerá aqui...
                      </div>
                    )}

                    {translatedText && !isTranslating && (
                      <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-end">
                        <button
                          onClick={() => handleCopy(translatedText)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 transition-all duration-200"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-400" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-amber-500" />
                              Copiar Tradução
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {textError && (
                <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-200">Falha na Tradução</h4>
                    <p className="text-xs text-red-300/80 mt-1">{textError}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                  className="w-full sm:w-[280px] py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.25)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2 text-base"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Traduzir com Claude 4.5
                    </>
                  )}
                </button>
                <div className="max-w-2xl text-center">
                  <p className="text-[11px] text-slate-650 leading-relaxed font-light">
                    🔒 **Garantia de Soberania & Confidencialidade:** Esta ferramenta utiliza o contêiner de infraestrutura privada da Nexus. Suas traduções não passam por servidores públicos de tradução e não são compartilhadas com terceiros para treinamento.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              ABA 2: TRADUTOR DE VOZ (REUNIÕES AO VIVO)
              ========================================== */}
          {activeTab === 'voz' && (
            <motion.div
              key="tab-voz"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* CONFIGURAÇÃO DE IDIOMA E CONTROLES */}
              <div className="bg-slate-950/40 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <Settings className="w-6 h-6 text-amber-505" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Configuração da Reunião</h3>
                    <p className="text-xs text-slate-500">Ajuste o idioma do cliente e as opções de leitura por voz.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  {/* Seleção do Idioma do Cliente */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Idioma do Cliente</span>
                    <select
                      value={clientLanguage}
                      onChange={(e) => setClientLanguage(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer min-w-[170px]"
                    >
                      <option value="Espanhol">🇪🇸 Espanhol</option>
                      <option value="Inglês">🇺🇸 Inglês</option>
                      <option value="Francês">🇫🇷 Francês</option>
                      <option value="Alemão">🇩🇪 Alemão</option>
                      <option value="Italiano">🇮🇹 Italiano</option>
                    </select>
                  </div>

                  {/* Auto falar para o Cliente */}
                  <div className="flex items-center gap-2.5 h-full mt-4 lg:mt-0 pt-4 lg:pt-0">
                    <input
                      type="checkbox"
                      id="autoSpeak"
                      checked={autoSpeakTranslation}
                      onChange={(e) => setAutoSpeakTranslation(e.target.checked)}
                      className="w-4 h-4 text-amber-500 border-slate-800 bg-slate-900 rounded-lg focus:ring-amber-500/50 focus:ring-offset-0 focus:ring-1 accent-amber-500 cursor-pointer"
                    />
                    <label htmlFor="autoSpeak" className="text-xs text-slate-300 cursor-pointer select-none">
                      Falar tradução alto ao cliente
                    </label>
                  </div>

                  {/* Auto falar para o Gean */}
                  <div className="flex items-center gap-2.5 h-full mt-4 lg:mt-0 pt-4 lg:pt-0">
                    <input
                      type="checkbox"
                      id="autoSpeakGean"
                      checked={autoSpeakToGean}
                      onChange={(e) => setAutoSpeakToGean(e.target.checked)}
                      className="w-4 h-4 text-amber-500 border-slate-800 bg-slate-900 rounded-lg focus:ring-amber-500/50 focus:ring-offset-0 focus:ring-1 accent-amber-500 cursor-pointer"
                    />
                    <label htmlFor="autoSpeakGean" className="text-xs text-slate-300 cursor-pointer select-none">
                      Falar tradução alto para mim
                    </label>
                  </div>
                </div>
              </div>

              {/* ERROR DE VOZ */}
              {voiceError && (
                <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-200">Erro na Captura de Voz</h4>
                    <p className="text-xs text-red-300/80 mt-1">{voiceError}</p>
                  </div>
                </div>
              )}

              {/* DUAS VIAS DA REUNIÃO */}
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* VIA 1: EU FALO (PORTUGUÊS) */}
                <div className="flex flex-col bg-slate-950/40 border border-slate-800 focus-within:border-amber-500/40 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden transition-all duration-300">
                  {/* Efeito Pulsante de Gravação */}
                  <AnimatePresence>
                    {isRecordingGean && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" 
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                        🇧🇷 Minha Transmissão
                      </h3>
                      <p className="text-[10px] text-slate-500">Fale em Português para ser traduzido em voz alta.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isRecordingGean && (
                        <div className="flex items-center gap-0.5 h-6">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-red-500 rounded-full"
                              animate={{
                                height: [6, 18, 6],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.12,
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        onClick={startRecordingGean}
                        disabled={isRecordingClient || voiceLoading}
                        className={`p-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                          isRecordingGean 
                            ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105' 
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-105'
                        } disabled:opacity-40 disabled:hover:scale-100`}
                      >
                        {isRecordingGean ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1 flex flex-col justify-between min-h-[220px]">
                    {/* Minha Transcrição */}
                    <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Transcrição (PT-BR)</span>
                      <p className={`text-sm ${geanSpeech ? 'text-slate-200' : 'text-slate-605 italic'}`}>
                        {geanSpeech || 'Clique no microfone acima e fale em português...'}
                      </p>
                    </div>

                    {/* Tradução Falada */}
                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl relative">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400/80 block mb-1">
                        Tradução Escutada pelo Cliente ({clientLanguage})
                      </span>
                      
                      {voiceLoading && isRecordingGean ? (
                        <div className="flex items-center gap-2 text-xs text-amber-400/60 py-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Traduzindo fala...
                        </div>
                      ) : (
                        <p className={`text-sm font-semibold ${geanTranslation ? 'text-amber-300' : 'text-slate-600 italic'}`}>
                          {geanTranslation || 'O áudio traduzido tocará logo após sua fala.'}
                        </p>
                      )}

                      {geanTranslation && (
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={() => {
                              const config = getLanguageConfig(clientLanguage);
                              speakText(geanTranslation, config.synthCode);
                            }}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-colors"
                            title="Falar tradução novamente"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                          </button>
                          <button
                            onClick={() => handleCopy(geanTranslation)}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-colors"
                            title="Copiar texto traduzido"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* VIA 2: CLIENTE FALA (ESTRANGEIRO) */}
                <div className="flex flex-col bg-slate-950/40 border border-slate-800 focus-within:border-amber-500/40 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden transition-all duration-300">
                  {/* Efeito Pulsante de Gravação */}
                  <AnimatePresence>
                    {isRecordingClient && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" 
                      />
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                        {languageFlags[clientLanguage] || '🌐'} Recepção do Cliente
                      </h3>
                      <p className="text-[10px] text-slate-500">Capte o áudio do cliente para tradução simultânea em texto.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isRecordingClient && (
                        <div className="flex items-center gap-0.5 h-6">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-blue-500 rounded-full"
                              animate={{
                                height: [6, 18, 6],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.12,
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        onClick={startRecordingClient}
                        disabled={isRecordingGean || voiceLoading}
                        className={`p-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                          isRecordingClient 
                            ? 'bg-blue-500 text-white animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105' 
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-105'
                        } disabled:opacity-40 disabled:hover:scale-100`}
                      >
                        {isRecordingClient ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1 flex flex-col justify-between min-h-[220px]">
                    {/* Transcrição do Cliente */}
                    <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Fala do Cliente ({clientLanguage})</span>
                      <p className={`text-sm ${clientSpeech ? 'text-slate-200' : 'text-slate-600 italic'}`}>
                        {clientSpeech || 'Ative o microfone e capte o som do cliente falando...'}
                      </p>
                    </div>

                    {/* Tradução para o Gean */}
                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl relative">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400/80 block mb-1">Tradução em Português para você ler</span>
                      
                      {voiceLoading && isRecordingClient ? (
                        <div className="flex items-center gap-2 text-xs text-amber-400/60 py-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Traduzindo fala...
                        </div>
                      ) : (
                        <p className={`text-base font-bold ${clientTranslation ? 'text-amber-300' : 'text-slate-600 italic'}`}>
                          {clientTranslation || 'A fala traduzida aparecerá aqui em tempo real.'}
                        </p>
                      )}

                      {clientTranslation && (
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={() => speakText(clientTranslation, 'pt-BR')}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-colors"
                            title="Ouvir tradução em português"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                          </button>
                          <button
                            onClick={() => handleCopy(clientTranslation)}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-colors"
                            title="Copiar texto traduzido"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* LINHA DO TEMPO DA REUNIÃO (UNIFIED LIVE TRANSCRIPT LOG) */}
              <div className="bg-slate-950/40 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <History className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="text-base font-semibold text-white">Linha do Tempo da Reunião</h3>
                      <p className="text-xs text-slate-500">Histórico de conversação traduzida nesta sessão.</p>
                    </div>
                  </div>

                  {meetingHistory.length > 0 && (
                    <button 
                      onClick={() => setMeetingHistory([])}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 hover:bg-red-900/20 border border-red-900/30 text-red-400 hover:text-red-300 rounded-xl text-xs transition-colors duration-200"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Limpar Histórico
                    </button>
                  )}
                </div>

                <div className="max-h-[360px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                  {meetingHistory.length === 0 ? (
                    <div className="py-12 text-center text-slate-650 text-sm italic">
                      Nenhuma conversa registrada ainda. Fale ou capte o áudio do cliente para iniciar o fluxo.
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {meetingHistory.map((item) => {
                        const isGean = item.sender === 'Gean';
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex flex-col max-w-[85%] p-4 rounded-2xl border ${
                              isGean 
                                ? 'ml-auto bg-amber-500/[0.03] border-amber-500/20 rounded-tr-none' 
                                : 'mr-auto bg-blue-500/[0.03] border-blue-500/20 rounded-tl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${isGean ? 'text-amber-400' : 'text-blue-400'}`}>
                                {isGean ? '🇧🇷 Minha Transmissão' : `${languageFlags[clientLanguage] || '🌐'} Cliente`}
                              </span>
                              <span className="text-[9px] text-slate-650 font-mono">{item.timestamp}</span>
                            </div>

                            <div className="space-y-1.5 text-sm">
                              <p className="text-slate-400 font-light italic">"{item.originalText}"</p>
                              <div className="h-px bg-slate-900 my-1" />
                              <p className="font-semibold text-slate-200">{item.translatedText}</p>
                            </div>

                            <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-900/50">
                              <button
                                onClick={() => {
                                  if (isGean) {
                                    const config = getLanguageConfig(clientLanguage);
                                    speakText(item.translatedText, config.synthCode);
                                  } else {
                                    speakText(item.translatedText, 'pt-BR');
                                  }
                                }}
                                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-500 rounded-lg transition-colors border border-slate-850"
                                title="Ouvir Tradução"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCopy(item.translatedText)}
                                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-500 rounded-lg transition-colors border border-slate-850"
                                title="Copiar Tradução"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* DICA DE UTILIZAÇÃO */}
              <div className="mt-8 p-4 bg-slate-950/20 border border-slate-900 rounded-2xl max-w-4xl mx-auto text-center text-xs text-slate-500 leading-relaxed font-light">
                💡 **Dica de Produtividade da Reunião:** Organize sua área de trabalho colocando o Tradutor Soberano ao lado do Teams, Google Meet ou Zoom. Quando o microfone do "Cliente" estiver ativo, ele processará o som capturado e criará a transcrição traduzida em tempo real!
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
