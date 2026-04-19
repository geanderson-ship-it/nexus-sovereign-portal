
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Send, 
  Loader2, 
  Activity, 
  Volume2, 
  Mic, 
  X, 
  Sparkles, 
  LineChart, 
  ChevronDown,
  BrainCircuit,
  Zap,
  ShieldCheck,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusAudio, useAudioLevel } from '@/hooks/use-nexus-audio';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { collabChat } from '@/ai/flows/collab-chat-flow';
import { useUser } from '@/firebase';

interface CollabMessage {
  role: 'user' | 'model';
  ai?: 'maga' | 'orion';
  text: string;
}

export function NexusCollabModule() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<CollabMessage[]>([
    { role: 'model', ai: 'maga', text: 'Conexão dual estabelecida, Comandante. Eu e o Orion estamos prontos para a nossa sessão estratégica.' },
    { role: 'model', ai: 'orion', text: 'Sistemas táticos online. Aguardamos sua diretriz inicial.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Audio Hooks
  const { playSpeech, isSpeaking } = useNexusAudio();
  const audioLevel = useAudioLevel();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (transcript) {
      setInputValue(prev => prev + ' ' + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await collabChat({
        userMessage: userMsg,
        userName: user?.displayName || 'Comandante',
        history: messages.map(m => ({ role: m.role, text: m.text, ai: m.ai }))
      });

      // Sequential responses with delay to simulate "thinking" and "dialogue"
      for (const response of result.responses) {
        setMessages(prev => [...prev, { role: 'model', ai: response.ai, text: response.text }]);
        
        try {
          // Play audio for each response
          await playSpeech({ 
            id: `collab-${Date.now()}`, 
            text: response.text, 
            voice: response.ai === 'orion' ? 'orion' : 'maga' 
          });
          
          // Small pause between AI comments
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch (audioErr) {
          console.warn("Collab audio failed", audioErr);
        }
      }
    } catch (error) {
      console.error("Collab Error:", error);
      setMessages(prev => [...prev, { role: 'model', ai: 'maga', text: "Houve uma interferência tática na nossa conexão dual. Pode tentar novamente?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const isMagaSpeaking = isSpeaking && messages[messages.length - 1]?.ai === 'maga';
  const isOrionSpeaking = isSpeaking && messages[messages.length - 1]?.ai === 'orion';

  return (
    <div className="relative w-full h-[90vh] flex flex-col bg-zinc-950 overflow-hidden font-display">
      
      {/* BACKGROUND WAR ROOM / STRATEGIC AMBIENCE */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* HEADER SECTION */}
      <header className="relative z-20 p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <BrainCircuit className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-headline font-bold text-white tracking-widest">NEXUS WAR ROOM</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <Activity className="h-3 w-3 text-emerald-500" /> MAGA_v2.0 & ORION_v4.2 // JOINT_INTEL
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={cn("border-blue-500/20 text-blue-400 gap-1.5", isMagaSpeaking && "bg-blue-500/10 animate-pulse")}>
              <div className={cn("w-1.5 h-1.5 rounded-full", isMagaSpeaking ? "bg-blue-400" : "bg-blue-900")} /> MAGA: ACTIVE
            </Badge>
            <Badge variant="outline" className={cn("border-zinc-500/20 text-zinc-400 gap-1.5", isOrionSpeaking && "bg-zinc-500/10 animate-pulse")}>
              <div className={cn("w-1.5 h-1.5 rounded-full", isOrionSpeaking ? "bg-white" : "bg-zinc-800")} /> ORION: ACTIVE
            </Badge>
          </div>
          <div className="h-10 w-[1px] bg-white/5 mx-2" />
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* AVATAR DUAL DISPLAY (SIDE BY SIDE LIKE THE IMAGE) */}
      <div className="relative flex-1 flex flex-col pt-8">
        <div className="absolute inset-0 flex items-center justify-between px-20 pointer-events-none z-0">
          
          {/* MAGADOT (LEFT) */}
          <motion.div 
            className="relative w-[30%] aspect-square"
            animate={{
              scale: isMagaSpeaking ? 1 + (audioLevel * 0.12) : 1,
              filter: isMagaSpeaking 
                ? `drop-shadow(0 0 ${40 + audioLevel * 100}px rgba(59,130,246,0.5))` 
                : "drop-shadow(0 0 20px rgba(59,130,246,0.1))",
              opacity: isOrionSpeaking ? 0.4 : 1
            }}
          >
            <Image src="/maga-avatar-premium.png" alt="Maga" fill className="object-contain brightness-125 saturate-125 transition-all duration-700" />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
              <span className="text-xs font-headline font-bold text-blue-400 tracking-widest uppercase mb-1 block">Consciência Visual</span>
              <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full" />
            </div>
          </motion.div>

          {/* ORION (RIGHT) */}
          <motion.div 
            className="relative w-[30%] aspect-square"
            animate={{
              scale: isOrionSpeaking ? 1 + (audioLevel * 0.1) : 1,
              filter: isOrionSpeaking 
                ? `drop-shadow(0 0 ${30 + audioLevel * 80}px rgba(255,255,255,0.4))` 
                : "drop-shadow(0 0 20px rgba(255,255,255,0.05))",
              opacity: isMagaSpeaking ? 0.4 : 1
            }}
          >
            <Image src="/orion-avatar-premium.png" alt="Orion" fill className="object-contain brightness-110 grayscale-[0.2] transition-all duration-700" />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
              <span className="text-xs font-headline font-bold text-zinc-400 tracking-widest uppercase mb-1 block">Inteligência Tática</span>
              <div className="h-1 w-12 bg-zinc-500 mx-auto rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* CHAT INTERACTION OVERLAY (FLOATING CENTER) */}
        <div className="relative flex-1 z-10 flex flex-col items-center justify-end pb-24 h-full">
          <div className="w-full max-w-2xl flex flex-col h-[60%] px-6">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-6 py-4">
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex flex-col gap-2",
                        msg.role === 'user' ? "items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-2xl border backdrop-blur-2xl transition-all duration-500",
                        msg.role === 'user' 
                          ? "bg-white/5 border-white/10 text-white" 
                          : msg.ai === 'maga'
                            ? "bg-blue-600/10 border-blue-500/30 text-blue-50 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                            : "bg-zinc-800/40 border-zinc-600 text-zinc-100 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                      )}>
                        <div className="flex items-center gap-2 mb-2">
                           {msg.ai === 'maga' && <Sparkles className="h-3 w-3 text-blue-400" />}
                           {msg.ai === 'orion' && <Target className="h-3 w-3 text-zinc-400" />}
                           <span className={cn(
                             "text-[10px] font-mono uppercase tracking-[0.2em] font-bold",
                             msg.role === 'user' ? "text-primary" : msg.ai === 'maga' ? "text-blue-400" : "text-zinc-500"
                           )}>
                             {msg.role === 'user' ? 'Comandante' : msg.ai === 'maga' ? 'Maga OS' : 'Orion Hub'}
                           </span>
                        </div>
                        <p className="text-sm font-mono leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <div className="flex items-center gap-3 text-blue-400/60 font-mono text-[10px] animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" /> PROCESSANDO DIÁLOGO ESTRATÉGICO...
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* DUAL INPUT SECTION (WAR ROOM STYLE) */}
      <div className="relative z-20 pb-12 pt-4 px-6">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSendMessage}
            className="relative flex items-center gap-4 bg-zinc-950/80 border border-white/10 p-2 pr-6 rounded-3xl backdrop-blur-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.5)] focus-within:border-blue-500/50 transition-all duration-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-blue-400 shadow-inner">
              <Zap className="h-5 w-5" />
            </div>
            
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Inicie o brainstorm com o núcleo estratégico..."
              className="flex-1 bg-transparent border-none text-zinc-100 placeholder:text-zinc-600 font-mono focus-visible:ring-0 text-lg py-8"
            />

            <div className="flex items-center gap-3">
              <Button 
                type="button"
                variant="ghost"
                size="icon"
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  "rounded-full transition-all duration-300 w-12 h-12",
                  isListening ? "bg-red-500/20 text-red-400 animate-pulse scale-110" : "hover:bg-white/5 text-zinc-500 hover:text-white"
                )}
              >
                <Mic className="h-6 w-6" />
              </Button>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/40 px-8 h-12 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group font-bold tracking-widest gap-2"
              >
                BREAFING <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </form>
          
          <div className="mt-4 flex justify-center gap-12 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Conexão Protegida</span>
            <span className="flex items-center gap-1.5"><Activity className="h-3 w-3" /> Sincronia Dual: 99.8%</span>
            <span className="flex items-center gap-1.5"><LineChart className="h-3 w-3" /> Modo Brainstorm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
