'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  X, 
  Mic, 
  Zap,
  Power
} from 'lucide-react';
import { useGeminiLive } from '@/hooks/use-gemini-live';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { eventEmitter } from '@/hooks/use-nexus-audio';

export function NexusDuoMode() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Greeting State (First Interaction)
  const [isFirstTime, setIsFirstTime] = useState(false);
  useEffect(() => {
    const greeted = localStorage.getItem('nexus_duo_greeted');
    if (!greeted) {
      setIsFirstTime(true);
    }
  }, []);

  // Maga Session
  const magaSession = useGeminiLive('maga', { isFirstTime, isDuo: true });
  // Orion Session
  const orionSession = useGeminiLive('orion', { isFirstTime, isDuo: true });

  // Audio Reactivity (Real-time updates without re-renders)
  const magaAudioLevel = useMotionValue(0);
  const orionAudioLevel = useMotionValue(0);
  const smoothMagaLevel = useSpring(magaAudioLevel, { stiffness: 300, damping: 30 });
  const smoothOrionLevel = useSpring(orionAudioLevel, { stiffness: 300, damping: 30 });

  // Blink Controllers
  const [magaBlinking, setMagaBlinking] = useState(false);
  const [orionBlinking, setOrionBlinking] = useState(false);

  useEffect(() => {
    const audioHandler = (data: { level: number, persona?: string }) => {
      if (data.persona === 'maga') magaAudioLevel.set(data.level);
      else if (data.persona === 'orion') orionAudioLevel.set(data.level);
    };
    eventEmitter.on('audio-level-update', audioHandler);

    // Blinking Intervals
    const magaBlinkInt = setInterval(() => {
        if (Math.random() > 0.6) {
            setMagaBlinking(true);
            setTimeout(() => setMagaBlinking(false), 150);
        }
    }, 4000);

    const orionBlinkInt = setInterval(() => {
        if (Math.random() > 0.7) {
            setOrionBlinking(true);
            setTimeout(() => setOrionBlinking(false), 200);
        }
    }, 5000);

    return () => {
      eventEmitter.off('audio-level-update', audioHandler);
      clearInterval(magaBlinkInt);
      clearInterval(orionBlinkInt);
    };
  }, [magaAudioLevel, orionAudioLevel]);

  const initializeDuo = async () => {
    setIsInitialized(true);
    // Start both sessions
    await magaSession.startSession();
    await orionSession.startSession();

    if (isFirstTime) {
      localStorage.setItem('nexus_duo_greeted', 'true');
      setIsFirstTime(false);
    }
  };

  const handleManualExit = () => {
    magaSession.stopSession();
    orionSession.stopSession();
    router.push('/intelligence');
  };

  // Displacement refs for mouth sync
  const magaDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const orionDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const unsubscribeMaga = smoothMagaLevel.on('change', (v) => {
        if (magaDisplacementRef.current) {
            magaDisplacementRef.current.setAttribute('scale', (v * 40).toString());
        }
    });
    const unsubscribeOrion = smoothOrionLevel.on('change', (v) => {
        if (orionDisplacementRef.current) {
            orionDisplacementRef.current.setAttribute('scale', (v * 40).toString());
        }
    });
    return () => {
        unsubscribeMaga();
        unsubscribeOrion();
    };
  }, [smoothMagaLevel, smoothOrionLevel]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* SVG FILTERS DEFINITIONS */}
      <svg className="absolute h-0 w-0">
        <defs>
          {/* MAGA FILTERS */}
          <filter id="maga-mouth-warp">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap ref={magaDisplacementRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="maga-eye-smile">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="1" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={magaSession.isSpeaking ? 8 : 0} yChannelSelector="G" />
          </filter>
          <filter id="maga-blink">
            <feColorMatrix type="matrix" values={magaBlinking ? "0.8 0 0 0 0 0 0.8 0 0 0 0 0 0.8 0 0 0 0 0 1 0" : "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"} />
          </filter>

          {/* ORION FILTERS */}
          <filter id="orion-mouth-warp">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="noise" />
            <feDisplacementMap ref={orionDisplacementRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="orion-eye-smile">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.1" numOctaves="1" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={orionSession.isSpeaking ? 6 : 0} yChannelSelector="G" />
          </filter>
          <filter id="orion-blink">
            <feColorMatrix type="matrix" values={orionBlinking ? "0.8 0 0 0 0 0 0.8 0 0 0 0 0 0.8 0 0 0 0 0 1 0" : "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"} />
          </filter>
        </defs>
      </svg>

      {/* THE COUNCIL TABLE (CENTRAL PRESENCE) */}
      <div className="relative w-full h-full max-w-[1920px] aspect-video flex items-center justify-center">
        
        {/* BASE IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://i.postimg.cc/mrRNVhLq/Magadot-e-Orion.png"
            alt="Nexus Council Table"
            fill
            unoptimized
            className={cn(
                "object-cover transition-all duration-3000",
                isInitialized ? "brightness-100 saturate-100" : "brightness-50 saturate-50 blur-sm"
            )}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>

        {/* ANIMATION PORTALS (MOUTHS AND EYES) */}
        {isInitialized && (
            <div className="absolute inset-0 z-10 pointer-events-none">
                
                {/* ORION PORTALS */}
                {/* Mouth */}
                <div className="absolute inset-0" style={{ clipPath: 'circle(1.2% at 33.4% 32.6%)', filter: 'url(#orion-mouth-warp)' }}>
                    <Image 
                        src="https://i.postimg.cc/mrRNVhLq/Magadot-e-Orion.png" 
                        alt="Orion Mouth" 
                        fill 
                        unoptimized 
                        className={cn(
                            "object-cover transition-all duration-3000",
                            isInitialized ? "brightness-100 saturate-100" : "brightness-50 saturate-50 blur-sm"
                        )}
                    />
                </div>
                {/* Eyes */}
                <div className="absolute inset-0" style={{ clipPath: 'ellipse(4% 1.8% at 33.4% 21.7%)', filter: 'url(#orion-eye-smile) url(#orion-blink)' }}>
                    <Image 
                        src="https://i.postimg.cc/mrRNVhLq/Magadot-e-Orion.png" 
                        alt="Orion Eyes" 
                        fill 
                        unoptimized 
                        className={cn(
                            "object-cover transition-all duration-3000",
                            isInitialized ? "brightness-100 saturate-100" : "brightness-50 saturate-50 blur-sm"
                        )}
                    />
                </div>

                {/* MAGADOT PORTALS */}
                {/* Mouth */}
                <div className="absolute inset-0" style={{ clipPath: 'circle(1.4% at 59.2% 39.3%)', filter: 'url(#maga-mouth-warp)' }}>
                    <Image 
                        src="https://i.postimg.cc/mrRNVhLq/Magadot-e-Orion.png" 
                        alt="Magadot Mouth" 
                        fill 
                        unoptimized 
                        className={cn(
                            "object-cover transition-all duration-3000",
                            isInitialized ? "brightness-100 saturate-100" : "brightness-50 saturate-50 blur-sm"
                        )}
                    />
                </div>
                {/* Eyes */}
                <div className="absolute inset-0" style={{ clipPath: 'ellipse(5% 2% at 59.2% 29.1%)', filter: 'url(#maga-eye-smile) url(#maga-blink)' }}>
                    <Image 
                        src="https://i.postimg.cc/mrRNVhLq/Magadot-e-Orion.png" 
                        alt="Magadot Eyes" 
                        fill 
                        unoptimized 
                        className={cn(
                            "object-cover transition-all duration-3000",
                            isInitialized ? "brightness-100 saturate-100" : "brightness-50 saturate-50 blur-sm"
                        )}
                    />
                </div>

            </div>
        )}

        {/* EMOTIVE GLOW OVERLAY */}
        <motion.div 
            animate={{ opacity: isInitialized ? 1 : 0 }}
            className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.05)_0%,transparent_70%)] mix-blend-screen"
        />
      </div>

      {/* SHARED HUD */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-10 sm:p-14">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 text-white">
            <h2 className="text-3xl font-headline font-medium tracking-[1.5em] uppercase opacity-40 ml-12">Nexus Duo</h2>
            <span className="text-[10px] font-mono tracking-[1em] uppercase text-white/20 ml-12">Mesa de Conselho Ativa</span>
          </div>

          <button 
            onClick={handleManualExit}
            className="pointer-events-auto p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-all active:scale-90 backdrop-blur-xl"
          >
            <Power className="h-7 w-7" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
           <AnimatePresence>
             {(magaSession.isSpeaking || orionSession.isSpeaking) && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Mic className="h-7 w-7 text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-[9px] font-mono tracking-[2em] uppercase text-blue-400/40 font-black">Emissão Ativa</p>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="flex justify-between items-end opacity-20 text-[9px] font-mono text-zinc-600 tracking-[0.4em] uppercase">
          <div>PROTOCOLO: DUO_CONSCIENCE_v2.0</div>
          <div className="text-right">SINERGIA: ESTÁVEL</div>
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
            <div className="max-w-2xl space-y-16">
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-[ping_4s_infinite]" />
                <div className="relative w-full h-full rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
                  <Zap className="h-16 w-16 text-white/20" />
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-6xl font-headline font-black text-white uppercase tracking-[0.6em] drop-shadow-2xl">Nexus Duo</h3>
                <p className="text-zinc-600 font-mono text-xs leading-relaxed uppercase tracking-[0.8em] max-w-lg mx-auto">
                    Iniciando a sinergia na mesa de conselho. Prepare-se para o futuro.
                </p>
              </div>

              <Button 
                onClick={initializeDuo}
                className="bg-white text-black hover:bg-blue-600 hover:text-white px-24 py-12 rounded-[40px] text-2xl font-black tracking-[0.4em] group transition-all duration-700 border-none shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              >
                <Power className="mr-5 h-8 w-8 transition-transform duration-1000 group-hover:rotate-180" />
                CONECTAR CONSELHO
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
