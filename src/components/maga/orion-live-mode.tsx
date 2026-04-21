'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { 
  Mic, 
  X, 
  Activity, 
  ShieldCheck,
  Zap,
  Power,
  Target
} from 'lucide-react';
import { useNexusAudio, useAudioLevel } from '@/hooks/use-nexus-audio';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/use-locale';
import { useNexusLife } from '@/hooks/use-nexus-life';

export function OrionLiveMode() {
  const { user } = useUser();
  const router = useRouter();
  const { t, locale } = useLocale();
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  
  const audioLevel = useAudioLevel();
  const { playAudio, stopAudio, isSpeaking } = useNexusAudio();
  const { gazeX, gazeY, tiltX, tiltY, isBlinking } = useNexusLife();

  const initializeOrion = async () => {
    setIsInitialized(true);
    setConversationState('speaking');
    
    await playAudio({
      id: 'orion',
      text: "Comandante, Orion em posição. Estou pronto para coordenar sua estratégia tática. Quais são suas ordens?",
      voice: 'orion',
      onEnded: () => setConversationState('listening')
    });
  };

  const handleManualExit = () => {
    stopAudio();
    router.push('/intelligence');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* BACKGROUND SCENE - Tática e Escura */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className={cn(
          "absolute inset-0 transition-opacity duration-2000 opacity-40",
          isInitialized ? "opacity-40" : "opacity-20"
        )}>
          <Image 
            src="https://i.postimg.cc/mrRNVhLq/Magadot-e-Orion.png"
            alt="Tactical Background"
            fill
            className="object-cover brightness-50 contrast-125 grayscale"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* ORION HUMANIZED AVATAR (CROP FOCUS) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        
        <svg className="absolute h-0 w-0">
          <defs>
            <filter id="orion-mouth-filter" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="noise" />
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale={isSpeaking ? audioLevel * 50 : 0} 
                xChannelSelector="R" 
                yChannelSelector="G" 
              />
            </filter>
            
            <filter id="orion-blink-filter">
              <feColorMatrix type="matrix" values={isBlinking ? "0.7 0 0 0 0 0 0.7 0 0 0 0 0 0.7 0 0 0 0 0 1 0" : "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"} />
            </filter>
          </defs>
        </svg>

        <motion.div
          animate={{ 
            rotateX: tiltX,
            rotateY: tiltY,
            y: isSpeaking ? [0, -2, 0] : [0, 1, 0],
          }}
          transition={{
            rotateX: { type: 'spring', stiffness: 40, damping: 25 },
            rotateY: { type: 'spring', stiffness: 40, damping: 25 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="relative w-[600px] h-[600px] rounded-[100px] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(255,255,255,0.02)]"
          style={{ perspective: 1200 }}
        >
          {/* TIER-1: BASE (ORION CROP) */}
          <div className="absolute inset-0">
            <Image 
              src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
              alt="Orion Base"
              fill
              className="object-cover brightness-110 contrast-110"
              style={{ objectPosition: '28% 20%', scale: '2.5' }} // Focus on Orion's face
              priority
            />
          </div>

          {/* TIER-2: EYES (TRACKING) */}
          <motion.div 
            className="absolute inset-0 z-20"
            style={{ 
              clipPath: 'ellipse(5.5% 2.8% at 44.5% 38.5%)', // Adjusted for the 2.5x crop
              filter: 'url(#orion-blink-filter)' 
            }}
            animate={{ x: gazeX.get() * 0.5, y: gazeY.get() * 0.5 }}
          >
            <Image 
              src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
              alt="Orion Eyes"
              fill
              className="object-cover brightness-125 saturate-[1.1]"
              style={{ objectPosition: '28% 20%', scale: '2.5' }}
              priority
            />
          </motion.div>

          {/* TIER-3: MOUTH (SYNC) */}
          {isSpeaking && (
            <motion.div 
              className="absolute inset-0 z-20"
              style={{ 
                clipPath: 'ellipse(4.5% 3% at 53.0% 74.0%)', // Adjusted for the 2.5x crop
                filter: 'url(#orion-mouth-filter)' 
              }}
              animate={{
                scaleY: 1 + (audioLevel * 0.1),
                y: audioLevel * 2
              }}
            >
              <Image 
                src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
                alt="Orion Mouth"
                fill
                className="object-cover brightness-110 contrast-110"
                style={{ objectPosition: '28% 20%', scale: '2.5' }}
                priority
              />
            </motion.div>
          )}

          {/* Tactical Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.05)_0%,transparent_70%)] mix-blend-overlay pointer-events-none" />
        </motion.div>
      </div>

      {/* TACTICAL HUD */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-10 sm:p-14">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 text-orange-500/80">
            <div className="flex items-center gap-4">
              <Target className="h-6 w-6 animate-pulse" />
              <h2 className="text-3xl font-headline font-black tracking-[1em] uppercase">Orion</h2>
            </div>
            <span className="text-[10px] font-mono tracking-[0.8em] uppercase text-orange-500/20">Protocolo de Comando Individual Ativo</span>
          </div>

          <button 
            onClick={handleManualExit}
            className="pointer-events-auto p-4 rounded-full bg-white/5 border border-white/10 hover:bg-orange-500/20 text-white/50 transition-all active:scale-90"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {isInitialized && conversationState === 'listening' && (
              <motion.div 
                key="listening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500/5 flex items-center justify-center border border-orange-500/10">
                  <ShieldCheck className="h-8 w-8 text-orange-500/40 animate-pulse" />
                </div>
                <p className="text-orange-500/20 font-mono text-[9px] tracking-[1.5em] uppercase">Estrategista em Escuta...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-end opacity-20 text-[9px] font-mono text-orange-800 tracking-[0.4em] uppercase">
          <div>MISSION_MODE: ACTIVE</div>
          <div className="text-right">SCAN: EYE_CONTACT_ESTABLISHED</div>
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
              <Target className="h-24 w-24 text-orange-500/20 mx-auto" />
              <div className="space-y-6">
                <h3 className="text-5xl font-headline font-black text-white uppercase tracking-[0.6em]">Orion Solo</h3>
                <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.6em]">Iniciando vetor de comando tático.</p>
              </div>
              <Button 
                onClick={initializeOrion}
                className="bg-orange-600 text-white hover:bg-orange-500 px-20 py-12 rounded-[40px] text-2xl font-black tracking-[0.4em] border-none"
              >
                <Power className="mr-4 h-8 w-8" />
                ATIVAR ORION
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
