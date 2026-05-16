'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Mic, 
  X, 
  Activity, 
  Loader2, 
  ShieldCheck,
  Zap,
  Power
} from 'lucide-react';
import { useNexusAudio, useAudioLevel } from '@/hooks/use-nexus-audio';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { magadotChat } from '@/ai/flows/magadot-chat-flow';
import { useUser } from '@/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { eventEmitter } from '@/hooks/use-nexus-audio';
import * as gtag from '@/lib/gtag';
import { useLocale } from '@/hooks/use-locale';
import { useNexusLife } from '@/hooks/use-nexus-life';
import { useGeminiLive } from '@/hooks/use-gemini-live';


export function MagaLiveMode() {
  const { user } = useUser();
  const router = useRouter();
  const { t, locale } = useLocale();
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [history, setHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  
  // Greeting State (First Interaction)
  const [isFirstTime, setIsFirstTime] = useState(false);
  useEffect(() => {
    const greeted = localStorage.getItem('maga_greeted');
    if (!greeted) {
      setIsFirstTime(true);
      // Wait for session start to mark as greeted
    }
  }, []);

  // Gemini Live Engine
  const { 
    startSession, 
    stopSession, 
    isSpeaking, 
    connectionState,
    error: liveError 
  } = useGeminiLive('maga', { isFirstTime });

  const [lastClick, setLastClick] = useState<{ x: number, y: number } | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  // High-Performance Audio Reactivity
  const audioLevel = useAudioLevel();
  const audioGlow = useTransform(useMotionValue(audioLevel), [0, 1], [0.05, 0.3]);

  // Nexus Life Engine (Human Touch)
  const { gazeX, gazeY, tiltX, tiltY, isBlinking } = useNexusLife();

  const handleAvatarClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLastClick({ x: Math.round(x), y: Math.round(y) });
    
    // Clear after delay
    setTimeout(() => setLastClick(null), 3000);
  };

  const initializeMaga = async () => {
    setIsInitialized(true);
    await startSession();
    
    if (isFirstTime) {
      localStorage.setItem('maga_greeted', 'true');
      setIsFirstTime(false);
    }

    // Rastrear ativação da Maga Human IA
    gtag.event({
        action: 'maga_human_ia_init',
        category: 'Premium',
        label: user?.displayName || 'Anônimo'
    });
  };

  const handleManualExit = () => {
    stopSession();
    
    gtag.event({
        action: 'maga_human_ia_exit',
        category: 'Premium',
        label: 'Manual'
    });

    router.push('/intelligence/maga-os');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* BACKGROUND SCENE - Límpida e Profunda */}
      <div className="absolute inset-0 z-0 bg-black">
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-2000",
            isInitialized ? "opacity-60" : "opacity-30"
          )}
        >
            <Image 
                src="https://i.postimg.cc/v8jrk08W/Sala%20central%20Nexus.png"
                alt="Nexus Central Room"
                fill
                className="object-cover brightness-75 contrast-100 grayscale-[0.2]"
                priority
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      {/* ICONIC HUMANIZED AVATAR */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        
        <svg className="absolute h-0 w-0">
          <defs>
            {/* Mouth Sync Filter (Pure Displacement) */}
            <filter id="maga-mouth-filter" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="highNoise" />
              <feDisplacementMap 
                ref={displacementRef}
                in="SourceGraphic" 
                in2="highNoise" 
                scale="0" 
                xChannelSelector="R" 
                yChannelSelector="G" 
              />
            </filter>

            {/* Pupil/Soul Glow Filter (Humane Understanding) */}
            <filter id="maga-soul-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 0.7  0 0 0 15 -7" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>

            {/* Eye Smile Filter (Friendly Warp) */}
            <filter id="maga-eye-smile-filter">
               <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="1" seed="5" result="noise" />
               <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale={isSpeaking ? 8 : 0} 
                yChannelSelector="G" 
              />
            </filter>

            {/* Blinking Filter */}
            <filter id="maga-blink-filter">
              <feColorMatrix 
                type="matrix"
                values={isBlinking ? 
                  "0.8 0 0 0 0  0 0.8 0 0 0  0 0 0.8 0 0  0 0 0 1 0" : 
                  "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"}
              />
            </filter>
          </defs>
        </svg>

        <AnimatePresence>
          <div className="absolute flex items-center justify-center">
            {/* Soul Aura (Reactive but stable location) */}
            <motion.div
              animate={{ 
                scale: isSpeaking ? [1.05, 1.1, 1.05] : [1, 1.02, 1],
                opacity: isSpeaking ? [0.1, 0.2, 0.1] : [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"
            />
            
            <motion.div
              initial={false}
              animate={{ 
                rotateX: tiltX,
                rotateY: tiltY,
                y: isSpeaking ? [0, -3, 0] : [0, 2, 0],
              }}
              transition={{
                rotateX: { type: 'spring', stiffness: 50, damping: 20 },
                rotateY: { type: 'spring', stiffness: 50, damping: 20 },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="relative w-[560px] h-[560px] rounded-[80px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] bg-zinc-950 cursor-crosshair transition-all duration-1000"
              style={{ perspective: 1000 }}
              onClick={handleAvatarClick}
            >
              {/* TIER-1: BASE STATIC FACE (Steady) */}
              <div className="absolute inset-0">
                <Image 
                    src="/maga-live-v2.png"
                    alt="Magadot Base Projection"
                    fill
                    className="object-cover brightness-110 saturate-[1.1]"
                    priority
                />
              </div>

              {/* TIER-2: FOCAL MOUTH PORTAL (Isolated Displacement) */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                    clipPath: 'circle(9% at 50% 43.5%)',
                    zIndex: 20
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{ filter: 'url(#maga-mouth-filter)' }}
                >
                  <Image 
                      src="/maga-live-v2.png"
                      alt="Magadot Vocal Projection"
                      fill
                      className="object-cover brightness-110 saturate-[1.1]"
                      priority
                  />
                </div>
              </div>

              {/* TIER-3: FOCAL EYES PORTAL (Smile & Soul Glow) */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                    clipPath: 'ellipse(16% 8% at 50% 36.5%)',
                    zIndex: 21
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{ filter: 'url(#maga-eye-smile-filter) url(#maga-soul-glow) url(#maga-blink-filter)' }}
                  animate={{ x: gazeX, y: gazeY }}
                >
                  <Image 
                      src="/maga-live-v2.png"
                      alt="Magadot Visual Projection"
                      fill
                      className="object-cover brightness-110 saturate-[1.15]"
                      priority
                  />
                </motion.div>
              </div>
              
              {/* Reactive Cinema Glow Overlay (Ambient aura) */}
              <motion.div 
                style={{ opacity: audioGlow }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.2)_0%,transparent_70%)] mix-blend-screen pointer-events-none" 
              />
            </motion.div>
          </div>
        </AnimatePresence>

        {/* Sync Helper Toast */}
        <AnimatePresence>
          {lastClick && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-blue-600/90 text-white px-6 py-3 rounded-full font-mono text-sm shadow-[0_0_20px_rgba(59,130,246,0.5)] backdrop-blur-md"
            >
              MAGA COORDS: <span className="font-bold">at {lastClick.x}% {lastClick.y}%</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MINIMALIST TACTICAL HUD (NO CORE BARS) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-10 sm:p-14">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 text-white/80">
            <h2 className="text-2xl font-headline font-medium tracking-[1em] uppercase opacity-40">Maga</h2>
            <div className="flex gap-4">
              <span className="text-[10px] font-mono tracking-[0.8em] uppercase text-white/20">Conexão Humana Estabelecida</span>
            </div>
          </div>

          <button 
            onClick={handleManualExit}
            className="pointer-events-auto p-4 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 text-white/50 hover:text-white transition-all active:scale-90 backdrop-blur-xl"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* FEEDBACK STATUS (ULTRA CLEAN) */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {conversationState === 'listening' && (
              <motion.div 
                key="listening"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-blue-500/5 flex items-center justify-center border border-blue-500/10">
                  <Mic className="h-9 w-9 text-blue-500/50 animate-pulse" />
                </div>
                <p className="text-blue-500/20 font-mono text-[9px] tracking-[1.5em] uppercase animate-pulse">Estabelecendo conexão vocal...</p>
              </motion.div>
            )}

            {conversationState === 'speaking' && (
              <motion.div 
                key="speaking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/10 font-mono text-[10px] tracking-[2em] uppercase font-black"
              >
                Emissão Ativa
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-end opacity-20 text-[9px] font-mono text-zinc-700 tracking-[0.4em] uppercase">
          <div>PROTOCOLO: HUMAN_SYNC_EYE_TO_EYE</div>
          <div className="text-right">ESTADO: CONFLUENZA_TOTAL</div>
        </div>
      </div>

      {/* INITIALIZATION GATE */}
      <AnimatePresence>
        {!isInitialized && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="max-w-xl space-y-16">
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/5 animate-[ping_4s_infinite]" />
                <div className="relative w-full h-full rounded-full bg-blue-500/5 flex items-center justify-center border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.1)]">
                  <Activity className="h-16 w-16 text-blue-500/40" />
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-5xl font-headline font-black text-white uppercase tracking-[0.5em] drop-shadow-2xl">Maga Live</h3>
                <p className="text-zinc-600 font-mono text-xs leading-relaxed uppercase tracking-[0.6em] max-w-sm mx-auto">Ativando confluência vocal de alta fidelidade.</p>
              </div>

              <Button 
                onClick={initializeMaga}
                className="bg-white text-black hover:bg-blue-600 hover:text-white px-20 py-12 rounded-[40px] text-2xl font-black tracking-[0.4em] group transition-all duration-700 border-none"
              >
                <Power className="mr-4 h-8 w-8 transition-transform duration-1000 group-hover:rotate-180" />
                {t('maga.live.connect')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
            opacity: isSpeaking ? [0.02, 0.05, 0.02] : 0.02
        }}
        className="absolute inset-0 pointer-events-none z-10 bg-white/[0.01]" 
      />
    </div>
  );
}
