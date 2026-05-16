
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  History, 
  Settings, 
  Cpu, 
  ArrowLeft,
  Search,
  Zap,
  Layout,
  Maximize2,
  Minimize2,
  LineChart,
  Target,
  ThumbsUp,
  ThumbsDown,
  Crown,
  Volume2
} from 'lucide-react';
import { IAPaymentModal } from './ia-payment-modal';
import { useNexusAudio, useAudioLevel } from '@/hooks/use-nexus-audio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function OrionOSModule() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá. Sou o Orion. Que bom estar com você. Vamos traçar um caminho claro e belo para os seus objetivos estratégicos hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Audio & Speech
  const { playSpeech, isSpeaking } = useNexusAudio();
  const audioLevel = useAudioLevel();

  const ORION_PIX_KEY = "+5551999799582";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') setZenMode(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      const responseText = 'Entendido, Comandante. Processando dados táticos para garantir a vantagem competitiva da Nexus. A precisão é nossa maior aliada.';
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response
      try {
        playSpeech({ id: assistantMessage.id, text: responseText, voice: 'orion' });
      } catch (err) {
        console.warn("Orion voice failed", err);
      }
    }, 1000);
  };

  return (
    <div className={cn(
      "relative w-full h-[85vh] flex bg-slate-950/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500",
      isFullscreen && "fixed inset-4 z-50 h-[92vh] w-[96vw]"
    )}>
      {/* Background Person - Orion Premium */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 cursor-pointer pointer-events-auto"
        onClick={() => setZenMode(!zenMode)}
      >
        <div className="relative w-full h-full">
          {/* INTERNAL SVG FILTERS FOR REAL-TIME WARPING (TACTICAL) */}
          <svg className="absolute h-0 w-0">
            <defs>
              <filter id="orion-os-warp" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05 0.15" numOctaves="3" seed="7" result="noise" />
                <feDisplacementMap 
                  in="SourceGraphic" 
                  in2="noise" 
                  scale={isSpeaking ? audioLevel * 120 : 0} 
                  xChannelSelector="R" 
                  yChannelSelector="G" 
                />
              </filter>
            </defs>
          </svg>

          <motion.div 
            className="relative w-full h-full"
            animate={{
              scale: isSpeaking ? 1.05 + (audioLevel * 0.02) : (zenMode ? 1.15 : [1, 1.02, 1]),
              y: isSpeaking ? -audioLevel * 6 : [0, -3, 0],
            }}
            transition={{ 
              scale: isSpeaking || zenMode ? { type: 'spring', stiffness: 200, damping: 25 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Main Body */}
            <Image 
              src="/orion-avatar-premium.png" 
              alt="Orion Strategic Conscience" 
              fill
              className="object-contain opacity-100 transition-all duration-700 brightness-110 grayscale-[5%] contrast-110"
              priority
            />

            {/* Ultra-Fidelity Mouth Layer (Kinetic + Warp) */}
            {isSpeaking && (
              <motion.div 
                className="absolute inset-0 z-[5] pointer-events-none"
                style={{
                  clipPath: 'ellipse(3.6% 2.8% at 50% 50.5%)',
                }}
                animate={{
                  scaleY: 1 + (audioLevel * 0.12),
                  y: audioLevel * 2
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Image 
                  src="/orion-avatar-premium.png" 
                  alt="Orion Mouth" 
                  fill
                  className="object-contain brightness-110 saturate-110"
                  style={{
                    filter: 'url(#orion-os-warp)'
                  }}
                  priority
                />
              </motion.div>
            )}
          </motion.div>
          
          <AnimatePresence>
            {!zenMode && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Tactical Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar - Strategy History */}
      <AnimatePresence>
        {isSidebarOpen && !zenMode && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="relative z-10 h-full border-r border-slate-800 bg-slate-950/60 backdrop-blur-md flex flex-col"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
                  <LineChart className="w-4 h-4 text-slate-400" />
                </div>
                <span className="font-headline font-medium text-sm tracking-[0.6em] text-slate-400 uppercase">Histórico</span>
              </div>
            </div>
            <ScrollArea className="flex-grow p-4">
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group">
                    <p className="text-xs text-slate-400 flex items-center gap-2 mb-1">
                      <History className="w-3 h-3" /> 28 Mar 2026
                    </p>
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {i === 1 ? "Expansão de Mercado" : i === 2 ? "Logística Digital" : "Análise de Riscos v3"}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-slate-800">
              <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-900">
                <Settings className="w-4 h-4" /> Configurações Táticas
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main OS Chat Area */}
      <div className="flex-grow flex flex-col relative z-10">
        {/* Header */}
        <AnimatePresence>
          {!zenMode && (
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/30"
            >
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-slate-400 hover:text-white"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Layout className="w-5 h-5" />
                </Button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-white/10 text-white/40 bg-white/5 gap-1">
                      CONEXÃO ATIVA
                    </Badge>
                    <div className="h-4 w-[1px] bg-slate-800 mx-1" />
                    <span className="text-xs font-mono text-slate-700 tracking-widest">ORION // ESTRATEGISTA</span>
                  </div>
                  <h2 className="text-lg font-headline font-medium text-white/60 tracking-[0.6em] mt-1 uppercase">Nexus</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="bg-white text-black font-bold border-none hover:bg-slate-200 transition-all gap-2"
                >
                  <Crown className="h-4 w-4" /> UPGRADE STRATEGY
                </Button>
                <Link href="/intelligence">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Message Area */}
        <AnimatePresence mode="wait">
          {!zenMode && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={scrollRef} 
              className="flex-grow overflow-y-auto p-8 space-y-8 scroll-smooth"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start gap-4 max-w-4xl mx-auto group",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 overflow-hidden shrink-0",
                    msg.role === 'assistant' 
                      ? "bg-slate-900 border-slate-700 ring-2 ring-slate-400/20" 
                      : "bg-slate-800 border-slate-600 ring-2 ring-slate-600/20"
                  )}>
                    {msg.role === 'assistant' ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src="/orion-avatar-premium.png" 
                          alt="Orion" 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className={cn(
                    "flex flex-col gap-2 max-w-[80%]",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed border backdrop-blur-md transition-all duration-300 relative group/msg",
                      msg.role === 'assistant' 
                        ? "bg-slate-900/80 border-slate-700 text-slate-200 rounded-tl-none group-hover:border-slate-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                        : "bg-slate-800/80 border-slate-600 text-white rounded-tr-none"
                    )}>
                      {msg.content}

                      {/* Feedback Icons for Assistant responses */}
                      {msg.role === 'assistant' && (
                        <div className="absolute -bottom-4 right-4 flex gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity bg-slate-900 border border-slate-800 rounded-full px-2 py-1 shadow-xl z-20">
                          <button className="p-1 hover:text-white transition-colors">
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button className="p-1 hover:text-red-400 transition-colors">
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 px-1 uppercase tracking-widest">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.role === 'assistant' && " // CONSCIÊNCIA ESTRATÉGICA ATIVA"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <AnimatePresence>
          {!zenMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-8 border-t border-slate-800 bg-slate-950/50 backdrop-blur-xl"
            >
              <div className="max-w-4xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 to-slate-800 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-slate-950 rounded-xl border border-slate-700 p-2 shadow-2xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/50 text-slate-400">
                    <Target className="w-5 h-5" />
                  </div>
                    <Input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Sobre o que vamos conversar?" 
                      className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-slate-700 h-12 text-base px-4"
                    />
                  <div className="flex items-center gap-2 px-2">
                    <Badge variant="outline" className="text-slate-500 border-slate-800 hidden sm:flex">TACTICAL_INPUT</Badge>
                    <Button 
                      size="icon" 
                      className="bg-slate-200 text-slate-950 hover:bg-white rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      onClick={handleSend}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-center text-[10px] text-slate-600 mt-4 font-mono tracking-widest">
                ORION STRATEGIC HUB // NEXUS INTELLIGENCE // PRECISION IS POWER
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <IAPaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        iaName="Orion Strategic"
        pixKey={ORION_PIX_KEY}
      />
    </div>
  );
}
