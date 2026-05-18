'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, MessageSquare, X, Send, Video, Settings, Activity, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { atenaChat } from '@/ai/flows/atena-chat-flow';
import { orionChat } from '@/ai/flows/orion-chat-flow';
import { useLocale } from '@/hooks/use-locale';
import { useUser } from '@/auth';
import type { AwsRumConfig } from 'aws-rum-web';

function AtenaContent() {
  const { user } = useUser();
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');

  // AWS CloudWatch RUM Real-Time Analytics Initialization
  useEffect(() => {
    const initRum = async () => {
      try {
        const { AwsRum } = await import('aws-rum-web');
        const config: AwsRumConfig = {
          sessionSampleRate: 1,
          endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
          telemetries: ["performance", "errors", "http"],
          allowCookies: true,
          enableXRay: false,
          signing: false
        };

        const APPLICATION_ID = "021991d4-ea3c-42a0-8ede-74ae723397d2";
        const APPLICATION_VERSION = "1.0.0";
        const APPLICATION_REGION = "us-east-1";

        new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config);
      } catch (error) {
        // Ignore errors thrown during CloudWatch RUM web client initialization
      }
    };
    initRum();
  }, []);
  const [selectedAvatar, setSelectedAvatar] = useState<'Atena' | 'Orion'>('Atena');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState('/atena/Atena segunda.png');

  // URL Parameter Handling
  useEffect(() => {
    const avatar = searchParams?.get('avatar');
    if (avatar && ['Atena', 'Orion'].includes(avatar)) {
      setSelectedAvatar(avatar as any);
      setIsLive(true);
      setMode('text');
    }
  }, [searchParams]);

  // Closet Logic
  useEffect(() => {
    if (selectedAvatar === 'Atena') {
      const outfits = [
        '/atena/Atena domingo.png',   // 0 - Domingo
        '/atena/Atena segunda.png',   // 1 - Segunda
        '/atena/Atena terça.png',     // 2 - Terça
        '/atena/Atena quarta.png',    // 3 - Quarta
        '/atena/Atena quinta.png',    // 4 - Quinta
        '/atena/Atena sexta.png',     // 5 - Sexta
        '/atena/Atena sábado.png'     // 6 - Sábado
      ];
      const today = new Date().getDay();
      setCurrentOutfit(outfits[today]);
    } else {
      setCurrentOutfit('/Orion/Orion.png');
    }
  }, [selectedAvatar]);

  // Initial greetings
  const greetings = {
    Atena: `Oi ${user?.name || 'Gean'}, tudo bem! Que saudade de falar com você... Como estão as coisas por aí na Diretoria? Como posso te ajudar hoje?`,
    Orion: `Olá ${user?.name || 'Gean'}... Matriz de análise online e sistemas operacionais prontos. Como posso apoiar as decisões da Diretoria hoje?`
  };

  // Chat Messages
  const [messages, setMessages] = useState([
    { id: 1, text: greetings.Atena, sender: 'ai' }
  ]);

  // Reset chat history and initial greeting when avatar changes
  useEffect(() => {
    setMessages([{ id: Date.now(), text: greetings[selectedAvatar], sender: 'ai' }]);
  }, [selectedAvatar, user?.name]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    const currentUserName = user?.name || 'Usuário Nexus';
    const newMsg = { id: Date.now(), text: userMsg, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      let aiResponse = '';

      if (selectedAvatar === 'Atena') {
        const result = await atenaChat({
          userMessage: userMsg,
          userName: currentUserName,
          currentOutfit: currentOutfit
        });
        aiResponse = result.response;
      } else {
        const result = await orionChat({
          userMessage: userMsg,
          userName: currentUserName
        });
        aiResponse = result.response;
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        text: aiResponse,
        sender: 'ai'
      }]);
    } catch (error: any) {
      console.error("Erro ao falar com a IA:", error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `Erro interno do sistema: ${error.message || String(error)}`,
        sender: 'ai'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isLive) {
    return (
      <div className="min-h-[100dvh] bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[1000px] max-h-[1000px] bg-violet-900/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col items-center text-center space-y-10"
        >
          {/* Avatar Selection */}
          <div className="flex flex-wrap justify-center gap-12 mb-4">
            {/* ATENA */}
            <div
              onClick={() => setSelectedAvatar('Atena')}
              className={cn(
                "cursor-pointer transition-all duration-500 flex flex-col items-center gap-3",
                selectedAvatar === 'Atena' ? "scale-110" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
              )}
            >
              <div className={cn(
                "w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 overflow-hidden relative shadow-2xl",
                selectedAvatar === 'Atena' ? "border-violet-400 shadow-violet-500/20" : "border-white/10"
              )}>
                <img src="/atena/Atena segunda.png" alt="Atena" className="w-full h-full object-cover object-top" />
              </div>
              <span className={cn("text-xs font-black uppercase tracking-widest", selectedAvatar === 'Atena' ? "text-violet-400" : "text-slate-500")}>Atena (Exclusiva)</span>
            </div>

            {/* ORION */}
            <div
              onClick={() => setSelectedAvatar('Orion')}
              className={cn(
                "cursor-pointer transition-all duration-500 flex flex-col items-center gap-3",
                selectedAvatar === 'Orion' ? "scale-110" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
              )}
            >
              <div className={cn(
                "w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 overflow-hidden relative shadow-2xl",
                selectedAvatar === 'Orion' ? "border-green-400 shadow-green-500/20" : "border-white/10"
              )}>
                <img src="/Orion/Orion.png" alt="Orion" className="w-full h-full object-cover object-top" />
              </div>
              <span className={cn("text-xs font-black uppercase tracking-widest", selectedAvatar === 'Orion' ? "text-green-400" : "text-slate-500")}>Orion (Exclusivo)</span>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              <span className={cn(
                selectedAvatar === 'Atena' ? "text-violet-400" : "text-green-400"
              )}>
                {selectedAvatar} Hub
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              Ambiente de Inteligência Soberana restrito à Diretoria Nexus. 
              Sua equipe estratégica está a postos.
            </p>
          </div>

          <button
            onClick={() => setIsLive(true)}
            className={cn(
              "group relative px-12 py-6 rounded-[32px] font-black uppercase tracking-widest text-white text-sm transition-all hover:scale-105 flex items-center gap-3 overflow-hidden",
              selectedAvatar === 'Atena' ? "bg-violet-600 hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]" : 
              "bg-green-600 hover:bg-green-700 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            )}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            <Video className="h-5 w-5" /> Entrar em Conferência
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#020617] flex flex-col p-2 sm:p-4 md:p-8 lg:p-12 relative overflow-hidden">
      <div className="relative flex-1 w-full max-w-4xl mx-auto rounded-[2rem] md:rounded-[3rem] border border-blue-500/20 bg-black overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)] ring-1 ring-white/5">
        <Image
          src={currentOutfit}
          alt="Nexus Live"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-10 flex flex-col p-6 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white">Sovereign Live</span>
              </div>
              {mode === 'voice' && (
                <div className={cn(
                  "flex items-center gap-1 px-3 py-1.5 backdrop-blur-md border rounded-full text-[9px] font-black uppercase tracking-widest",
                  selectedAvatar === 'Atena' ? "bg-violet-500/10 border-violet-500/20 text-violet-400" :
                  "bg-green-500/10 border-green-500/20 text-green-400"
                )}>
                  <Activity className="h-3 w-3 animate-pulse" /> Ouvindo Diretoria
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsLive(false)}
                className="w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1" />
          <div className="w-full max-w-md mx-auto space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'text' && (
                <motion.div
                  key="text-mode"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-[50vh] max-h-[400px]"
                >
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                          msg.sender === 'ai'
                            ? (selectedAvatar === 'Atena' ? "bg-violet-500/10 border border-violet-500/20 text-slate-200 self-start rounded-tl-sm" : 
                               "bg-green-500/10 border-green-500/20 text-slate-200 self-start rounded-tl-sm")
                            : "bg-white/10 border border-white/5 text-white self-end rounded-tr-sm"
                        )}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {isTyping && (
                      <div className={cn(
                        "flex items-center gap-2 self-start rounded-2xl px-4 py-3 text-sm animate-pulse",
                        selectedAvatar === 'Atena' ? "bg-violet-500/5 text-violet-400" : 
                        "bg-green-500/5 text-green-400"
                      )}>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>{selectedAvatar} processando solicitação...</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-black/40 border-t border-white/5 flex items-center gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Diretoria, o que deseja agora?"
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      className={cn(
                        "w-12 h-12 rounded-full text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50",
                        selectedAvatar === 'Atena' ? "bg-violet-600" : "bg-green-600"
                      )}
                    >
                      <Send className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex items-end justify-between z-20 pointer-events-none">
          <button
            onClick={() => setMode(mode === 'text' ? 'voice' : 'text')}
            className={cn(
              "pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all border",
              mode === 'text'
                ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                : "bg-black/40 border-white/10 text-slate-300 hover:bg-black/60 hover:text-white"
            ) }
          >
            {mode === 'text' ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />}
          </button>
          <div className="relative pointer-events-auto">
            {!isMuted && mode === 'voice' && (
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" style={{ animationDuration: '2s' }} />
            )}
            <button
              onClick={() => { setIsMuted(!isMuted); setMode('voice'); }}
              className={cn(
                "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md",
                isMuted
                  ? "bg-black/40 border-white/10 text-slate-400"
                  : (selectedAvatar === 'Atena' ? "bg-violet-600 border-violet-500 shadow-[0_0_50px_rgba(139,92,246,0.4)]" : 
                     "bg-green-600 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)]")
              )}
            >
              {isMuted ? <MicOff className="h-6 w-6 md:h-7 md:w-7" /> : <Mic className="h-6 w-6 md:h-7 md:w-7" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AtenaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}>
      <AtenaContent />
    </Suspense>
  );
}
