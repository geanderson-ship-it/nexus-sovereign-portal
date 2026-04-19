'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { Loader2, Zap } from 'lucide-react';
import * as gtag from '@/lib/gtag';
import { useLocale } from '@/hooks/use-locale';


interface DanteSafraAxisIntroProps {
  onComplete: () => void;
  userName?: string;
}

export function DanteSafraAxisIntro({ onComplete, userName }: DanteSafraAxisIntroProps) {
  const [mounted, setMounted] = useState(false);
  const [showText, setShowText] = useState(false);
  const { playAudio, stopAudio, isPlaying } = useNexusAudio();
  const { t } = useLocale();
  const [isFinishing, setIsFinishing] = useState(false);

  const welcomeMessage = t('intelligence.dante-safra.axis.intro');

  useEffect(() => {
    setMounted(true);
    
    // Pequeno delay para os assets carregarem
    const timer = setTimeout(() => {
      setShowText(true);
      playAudio({ 
        text: welcomeMessage, 
        voice: 'dante', 
        id: Date.now(),
        onEnded: () => {
          setTimeout(() => {
            handleComplete();
          }, 1500);
        }
      });
    }, 1500);

    // Rastrear visualização da intro
    gtag.event({
      action: 'axis_intro_view',
      category: 'Premium',
      label: userName || 'Anônimo'
    });

    return () => {

      clearTimeout(timer);
      stopAudio();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = () => {
    gtag.event({
      action: 'axis_intro_complete',
      category: 'Premium',
      label: userName || 'Anônimo'
    });
    setIsFinishing(true);
    setTimeout(onComplete, 1000);
  };

  const handleSkip = () => {
    gtag.event({
      action: 'axis_intro_skip',
      category: 'Premium',
      label: userName || 'Anônimo'
    });
    handleComplete();
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
      
      <AnimatePresence>
        {!isFinishing && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full h-full flex flex-col items-center justify-center p-6"
          >
            {/* Dante Axis Face - The "Olho no Olho" Shot */}
            <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
               <Image 
                src="/dante-axis-face.png" 
                alt="Dante Safra Axis" 
                fill
                className="object-cover transition-all duration-[10s] hover:scale-105"
                priority
              />
              
              {/* Overlay HUD Scanlines (Efeito de Monitor Tático) */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,100,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
              
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1 rounded border border-emerald-500/30">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                 <span className="text-[10px] font-mono text-emerald-400 tracking-[0.3em] uppercase">AXIS_PROTO_ACTIVATED</span>
              </div>

               <div className="absolute bottom-6 right-6">
                 <Zap className="h-6 w-6 text-emerald-400/50 animate-bounce" />
              </div>
            </div>

            {/* Subtitle / Text Animation */}
            <AnimatePresence>
              {showText && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 max-w-2xl text-center"
                >
                  <p className="text-xl md:text-2xl font-headline font-medium text-emerald-100 tracking-tight leading-relaxed italic drop-shadow-xl">
                    "{welcomeMessage}"
                  </p>
                  <div className="mt-4 flex justify-center gap-1">
                    <motion.div 
                        animate={{ 
                            width: isPlaying ? [10, 40, 10, 30, 10] : 10,
                            opacity: isPlaying ? [1, 0.5, 1] : 1
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip Button */}
            <button 
              onClick={handleSkip}
              className="absolute bottom-10 right-10 text-[10px] text-gray-500 hover:text-emerald-400 uppercase tracking-[0.5em] transition-all hover:tracking-[0.6em]"
            >
              {t('intelligence.dante-safra.axis.skip')}
            </button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Transition Overlay */}
      {isFinishing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black z-[110] flex flex-col items-center justify-center gap-4"
        >
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            <div className="absolute inset-0 blur-xl bg-emerald-500/20" />
          </div>
          <p className="text-[10px] font-mono text-emerald-500 tracking-[1em] uppercase animate-pulse">{t('intelligence.dante-safra.axis.sync')}</p>
        </motion.div>
      )}

    </div>
  );
}
