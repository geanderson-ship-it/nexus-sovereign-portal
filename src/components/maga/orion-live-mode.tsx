'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Activity, 
  Loader2, 
  ShieldCheck,
  Zap,
  Power,
  Target,
  Mic
} from 'lucide-react';
import { useNexusAudio, useAudioLevel } from '@/hooks/use-nexus-audio';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { orionChat } from '@/ai/flows/orion-chat-flow';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function OrionLiveMode() {
  const { user } = useUser();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [history, setHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  
  // Greeting State (First Interaction)
  const [isFirstTime, setIsFirstTime] = useState(false);
  useEffect(() => {
    const greeted = localStorage.getItem('orion_greeted');
    if (!greeted) {
      setIsFirstTime(true);
    }
  }, []);

  // Audio & Live Multimodal (New Version)
  const { 
    startSession, 
    stopSession, 
    connectionState, 
    isSpeaking, 
    error: liveError 
  } = useGeminiLive('orion', { isFirstTime });

  const audioLevelValue = useMotionValue(0);
  const smoothAudioLevel = useSpring(audioLevelValue, { stiffness: 300, damping: 30 });
  
  const lastProcessedTranscript = useRef('');
  const isProcessingRef = useRef(false);

  // Gestos de Concordância - Humildade e Sabedoria
  const [isNodding, setIsNodding] = useState(false);
  
  useEffect(() => {
    if (connectionState === 'connected' && !isSpeaking) {
      // Orion é mais calmo e atencioso, acena com elegância
      const nodInterval = setInterval(() => {
          if (Math.random() > 0.8) {
              setIsNodding(true);
              setTimeout(() => setIsNodding(false), 1500);
          }
      }, 7000);
      return () => clearInterval(nodInterval);
    }
  }, [connectionState, isSpeaking]);

  const initializeOrion = async () => {
    setIsInitialized(true);
    await startSession();
    
    if (isFirstTime) {
      localStorage.setItem('orion_greeted', 'true');
      setIsFirstTime(false);
    }
  };

  const handleManualExit = () => {
    stopSession();
    router.push('/intelligence/orion-os');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      
      {/* BACKGROUND SCENE - Límpida e Profunda */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-2000",
            isInitialized ? "opacity-40" : "opacity-20"
          )}
        >
            <Image 
                src="https://i.postimg.cc/v8jrk08W/Sala%20central%20Nexus.png"
                alt="Nexus Central Room"
                fill
                className="object-cover brightness-50 contrast-100 grayscale-[0.5]"
                priority
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950" />
      </div>

      {/* ICONIC HUMANIZED ORION */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        
        {/* ADVANCED MULTI-ZONE SVG FILTERS (ORION ANATOMY) */}
        <svg className="absolute h-0 w-0">
          <defs>
            {/* Máscara da Boca Orion */}
            <radialGradient id="orion-mouth-mask" cx="50%" cy="50%" r="20%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* Soul Glow Filter (Understanding & Vision) */}
            <filter id="orion-soul-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.8  0 0 0 0 1  0 0 0 12 -5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>

            {/* Eye Smile Filter (Friendly Warp) */}
            <filter id="orion-eye-smile-filter">
               <feTurbulence type="fractalNoise" baseFrequency="0.03 0.1" numOctaves="1" seed="8" result="noise" />
               <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale={isNodding || isSpeaking ? 6 : 0} 
                yChannelSelector="G" 
              />
            </filter>

            <filter id="orion-iconic-human-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" />
              
              {/* Displacement limited to Mouth */}
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale={isSpeaking ? audioLevel * 20 : 0} 
                xChannelSelector="R" 
                yChannelSelector="G" 
                result="mouthWarp"
              />
              
              {/* Stoic Binking Matrix */}
              <feColorMatrix 
                type="matrix"
                values={isBlinking ? 
                  "0.7 0 0 0 0  0 0.7 0 0 0  0 0 0.7 0 0  0 0 0 1 0" : 
                  "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"}
              />
            </filter>
          </defs>
        </svg>

        <AnimatePresence>
          <div className="absolute flex items-center justify-center">
            {/* Tactical Glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.03, 0.08, 0.03]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[650px] h-[650px] bg-slate-500/10 rounded-full blur-[120px]"
            />
            
            <motion.div
              initial={false}
              animate={{ 
                x: [0.1, -0.1, 0.1],
                y: isNodding ? [0, 5, 0] : isSpeaking ? [0, -2, 0] : [0.2, -0.2, 0.2],
                rotate: [0.02, -0.02, 0.02],
              }}
              transition={{
                x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                y: isNodding ? { duration: 1.2, ease: "easeInOut" } : isSpeaking ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : { duration: 15, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 30, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative w-[560px] h-[560px] rounded-[80px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.02)] bg-slate-950 transition-all duration-1000"
            >
              <Image 
                src="/orion-avatar-premium.png"
                alt="Orion Premium Humanized"
                fill
                className="object-cover brightness-110 grayscale-[10%] contrast-[1.15]"
                priority
              />

              {/* TIER-2: FOCAL EYES PORTAL (Smile & Soul Glow) */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                    clipPath: 'ellipse(14% 6% at 50% 41.5%)',
                    zIndex: 21
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{ filter: 'url(#orion-eye-smile-filter) url(#orion-soul-glow)' }}
                >
                  <Image 
                      src="/orion-avatar-premium.png"
                      alt="Orion Visual Projection"
                      fill
                      className="object-cover brightness-110 saturate-[1.1]"
                      priority
                  />
                </div>
              </div>
              
              {/* Tactical Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(100,100,255,0.03)_0%,transparent_60%)]" />
            </motion.div>
          </div>
        </AnimatePresence>
      </div>

      {/* MINIMALIST TACTICAL HUD (NO BARS) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-10 sm:p-14">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 text-white/70">
            <h2 className="text-2xl font-headline font-medium tracking-[1.2em] uppercase opacity-30">Orion</h2>
            <div className="flex gap-4">
               <span className="text-[10px] font-mono tracking-[0.8em] uppercase text-white/20">Guia Estratégico Ativo</span>
            </div>
          </div>

          <button 
            onClick={handleManualExit}
            className="pointer-events-auto p-4 rounded-full bg-white/5 border border-white/10 hover:bg-slate-500/20 hover:border-slate-500/40 text-white/50 hover:text-white transition-all active:scale-90 backdrop-blur-xl"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* FEEDBACK STATUS (CLEAN) */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {conversationState === 'listening' && (
              <motion.div 
                key="listening"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-slate-500/5 flex items-center justify-center border border-slate-500/10 shadow-[0_0_40px_rgba(255,255,255,0.02)]">
                  <Mic className="h-9 w-9 text-slate-600 animate-pulse" />
                </div>
                <p className="text-slate-500/20 font-mono text-[9px] tracking-[1.5em] uppercase animate-pulse">Frequência Segura...</p>
              </motion.div>
            )}

            {conversationState === 'speaking' && (
              <motion.div 
                key="speaking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/10 font-mono text-[10px] tracking-[1.8em] uppercase font-black"
              >
                Emissão Tática Ativa
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-end opacity-10 text-[9px] font-mono text-slate-600 tracking-[0.4em] uppercase">
          <div>ORION_SYSTEM: HUMAN_CORE_SYNC</div>
          <div className="text-right">CONSCIÊNCIA_ESTRATÉGICA: ESTÁVEL</div>
        </div>
      </div>

      {/* INITIALIZATION GATE */}
      <AnimatePresence>
        {!isInitialized && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="max-w-xl space-y-16">
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-slate-500/5 animate-[ping_4s_infinite]" />
                <div className="relative w-full h-full rounded-full bg-slate-500/5 flex items-center justify-center border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.03)]">
                  <Zap className="h-16 w-16 text-slate-500/50" />
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-5xl font-headline font-black text-white uppercase tracking-[0.5em] drop-shadow-2xl">Orion Live</h3>
                <p className="text-slate-700 font-mono text-xs leading-relaxed uppercase tracking-[0.6em] max-w-sm mx-auto">Ativando confluência estratégica vocal de elite.</p>
              </div>

              <Button 
                onClick={initializeOrion}
                className="bg-white text-black hover:bg-slate-200 px-24 py-12 rounded-[40px] text-2xl font-black tracking-[0.3em] group transition-all duration-700 border-none"
              >
                <Power className="mr-5 h-8 w-8 transition-transform duration-1000 group-hover:rotate-180" />
                INICIAR
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
            opacity: isSpeaking ? [0.01, 0.03, 0.01] : 0.01
        }}
        className="absolute inset-0 pointer-events-none z-10 bg-white/[0.01]" 
      />
    </div>
  );
}
