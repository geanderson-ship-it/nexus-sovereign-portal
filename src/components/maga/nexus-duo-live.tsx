'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Activity, 
  Loader2, 
  Power,
  Users,
  Mic,
  Cpu
} from 'lucide-react';
import { useNexusAudio, useAudioLevel } from '@/hooks/use-nexus-audio';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { magadotChat } from '@/ai/flows/magadot-chat-flow';
import { orionChat } from '@/ai/flows/orion-chat-flow';
import { useUser } from '@/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/use-locale';
import { useNexusLife } from '@/hooks/use-nexus-life';

export function NexusDuoLive() {
  const { user } = useUser();
  const router = useRouter();
  const { t, locale } = useLocale();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [speaker, setSpeaker] = useState<'maga' | 'orion' | 'none'>('none');
  const [history, setHistory] = useState<{role: 'user' | 'model', text: string, agent?: 'maga' | 'orion'}[]>([]);
  const [isTextInputOpen, setIsTextInputOpen] = useState(false);
  const [keyboardInputValue, setKeyboardInputValue] = useState('');
  
  const { playAudio, stopAudio, isSpeaking, playingId } = useNexusAudio();
  const audioLevel = useAudioLevel();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition(locale);
  
  const lastProcessedTranscript = useRef('');
  const isProcessingRef = useRef(false);

  // Nexus Life Engine (Human Touch)
  const { gazeX, gazeY, tiltX, tiltY, isBlinking } = useNexusLife();

  // Sync Helper (Development)
  const [lastClick, setLastClick] = useState<{x: string, y: string} | null>(null);

  const handleAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    
    console.log(`%c [LIP-SYNC HELPER] Clicked at: x: ${x}%, y: ${y}%`, 'color: #3b82f6; font-weight: bold;');
    setLastClick({ x, y });
    
    // Auto-hide after 3 seconds
    setTimeout(() => setLastClick(null), 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') setShowUI(prev => !prev);
      if (e.key.toLowerCase() === 't' && isInitialized && conversationState === 'listening') {
        setIsTextInputOpen(prev => !prev);
        if (isListening) stopListening();
      }
      if (e.key === 'Escape') setIsTextInputOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSpeaking && playingId) {
      setSpeaker(playingId as 'maga' | 'orion');
    } else if (!isSpeaking) {
      setSpeaker('none');
    }
  }, [isSpeaking, playingId]);

  // Human Life Cycles (Independent Blinking removed as it is now in the engine)

  const initializeDuo = async () => {
    setIsInitialized(true);
    setConversationState('speaking');
    
    await playAudio({ 
      id: 'maga',
      text: t('maga.duo.intro'), 
      voice: 'maga',
      onEnded: async () => {
        await playAudio({
          id: 'orion',
          text: t('orion.duo.intro'),
          voice: 'orion',
          onEnded: () => {
            setConversationState('listening');
            startListening();
          }
        });
      }
    });
  };

  const handleVoiceCommand = async (text: string) => {
    if (isProcessingRef.current) return;
    
    const exitCommands = ['tchau', 'encerrar', 'fechar', 'sair', 'até logo'];
    if (exitCommands.some(cmd => text.toLowerCase().includes(cmd))) {
      stopListening();
      setConversationState('speaking');
      await playAudio({
        id: 'maga',
        text: t('duo.live.exit'),
        voice: 'maga',
        onEnded: () => router.push('/intelligence')
      });
      return;
    }

    isProcessingRef.current = true;
    lastProcessedTranscript.current = text;
    setConversationState('processing');
    stopListening();

    try {
      const isTactical = /estratégia|tático|objetivo|comando|missão|análise|orion/i.test(text);
      const activeAgent = isTactical ? 'orion' : 'maga';
      
      const result = await (activeAgent === 'maga' 
        ? magadotChat({ userMessage: text, userName: user?.displayName || 'Comandante', locale, history: history.filter(h => h.agent === 'maga').slice(-4) })
        : orionChat({ userMessage: text, userName: user?.displayName || 'Comandante', locale, history: history.filter(h => h.agent === 'orion').slice(-4) })
      );

      const responseText = result.response || t('maga.live.unstable');
      const voiceToUse = (result as any).voiceProfile || activeAgent;
      
      setHistory(prev => [...prev, { role: 'user', text }, { role: 'model', text: responseText, agent: activeAgent }]);
      
      setConversationState('speaking');
      await playAudio({
        id: activeAgent,
        text: responseText,
        voice: voiceToUse,
        onEnded: () => {
          isProcessingRef.current = false;
          setConversationState('listening');
          if (!isTextInputOpen) startListening();
        }
      });
    } catch (err) {
      console.error("Duo Live Error:", err);
      isProcessingRef.current = false;
      setConversationState('listening');
      if (!isTextInputOpen) startListening();
    }
  };

  const handleKeyboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyboardInputValue.trim()) return;
    const text = keyboardInputValue;
    setKeyboardInputValue('');
    setIsTextInputOpen(false);
    handleVoiceCommand(text);
  };

  useEffect(() => {
    if (!isInitialized || isProcessingRef.current || isSpeaking) return;
    if (transcript && transcript !== lastProcessedTranscript.current) {
      handleVoiceCommand(transcript);
    }
  }, [transcript]);

  const handleManualExit = () => {
    stopAudio();
    stopListening();
    router.push('/intelligence');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* INTERNAL SVG FILTERS (LOCALIZED WARPING) */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="nexus-duo-warp-filter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.15" numOctaves="2" seed="9" result="noise" />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={audioLevel * 60} 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      {/* UNIFIED SCENE BACKGROUND (THE TABLE) - CINEMA LIGHTING */}
      <div 
        className="absolute inset-0 z-0 bg-black cursor-pointer"
        onClick={() => setShowUI(!showUI)}
      >
        <AnimatePresence>
          {showUI && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.2)_0%,transparent_70%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05)_0%,transparent_40%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.05)_0%,transparent_40%)]" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ 
            scale: isInitialized ? [1, 1.008, 1] : 1,
            y: isInitialized ? [0, 4, 0] : 0,
            rotateX: tiltX,
            rotateY: tiltY,
          }}
          transition={{ 
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotateX: { type: 'spring', stiffness: 50, damping: 20 },
            rotateY: { type: 'spring', stiffness: 50, damping: 20 }
          }}
          className="relative w-full h-full"
          onClick={handleAvatarClick}
          style={{ perspective: 1000 }}
        >
          {/* Base Image (Static) */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
              alt="Nexus Duo"
              fill
              className="object-cover brightness-[1.1] saturate-[1.1] contrast-[1.05]"
              style={{ objectPosition: 'center 20%' }}
              priority
            />
          </div>

          {/* EYE CONTACT (HUMAN SOUL) */}
          {isInitialized && (
            <>
              {/* Orion Eyes (Follow Cursor) */}
              <motion.div 
                className="absolute inset-0 z-[10] pointer-events-none"
                style={{ 
                  clipPath: 'ellipse(4% 1.8% at 33.4% 21.7%)',
                  filter: isBlinking ? 'brightness(0.2)' : 'none'
                }}
                animate={{ x: gazeX, y: gazeY }}
              >
                <Image 
                  src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
                  alt="Orion Eyes"
                  fill
                  className="object-cover brightness-125 saturate-[1.2]"
                  style={{ objectPosition: 'center 20%' }}
                  priority
                />
              </motion.div>

              {/* Maga Eyes (Follow Cursor) */}
              <motion.div 
                className="absolute inset-0 z-[10] pointer-events-none"
                style={{ 
                  clipPath: 'ellipse(5% 2% at 59.2% 29.1%)',
                  filter: isBlinking ? 'brightness(0.2)' : 'none'
                }}
                animate={{ x: gazeX, y: gazeY }}
              >
                <Image 
                  src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
                  alt="Maga Eyes"
                  fill
                  className="object-cover brightness-125 saturate-[1.2]"
                  style={{ objectPosition: 'center 20%' }}
                  priority
                />
              </motion.div>
            </>
          )}

          {/* Orion Targeted Mouth (Ultra-Fidelity) */}
          {speaker === 'orion' && isSpeaking && (
            <motion.div 
              className="absolute inset-0 z-[15] pointer-events-none"
              style={{
                clipPath: 'ellipse(3.4% 2.2% at 41.0% 50.5%)',
              }}
              animate={{
                scaleY: 1 + (audioLevel * 0.12),
                y: (audioLevel * 2.5) + (typeof gazeY === 'number' ? gazeY : 0)
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Image 
                src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
                alt="Orion Mouth"
                fill
                className="object-cover brightness-110 saturate-[1.1] contrast-[1.1]"
                style={{ 
                  objectPosition: 'center 20%',
                  filter: 'url(#nexus-duo-warp-filter)'
                }}
                priority
              />
            </motion.div>
          )}

          {/* Maga Targeted Mouth (Ultra-Fidelity) */}
          {speaker === 'maga' && isSpeaking && (
            <motion.div 
              className="absolute inset-0 z-[15] pointer-events-none"
              style={{
                clipPath: 'ellipse(3.4% 2.4% at 67.2% 55.5%)',
              }}
              animate={{
                scaleY: 1 + (audioLevel * 0.14),
                y: (audioLevel * 3) + (typeof gazeY === 'number' ? gazeY : 0)
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Image 
                src="https://i.postimg.cc/MzfP6jhW/Magadot-e-Orion.png"
                alt="Maga Mouth"
                fill
                className="object-cover brightness-110 saturate-[1.1] contrast-[1.1]"
                style={{ 
                  objectPosition: 'center 20%',
                  filter: 'url(#nexus-duo-warp-filter)'
                }}
                priority
              />
            </motion.div>
          )}
        </motion.div>
        
        <AnimatePresence>
          {showUI && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,transparent_10%,rgba(0,0,0,0.8)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
            </motion.div>
          )}
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
              COORDS: <span className="font-bold">at {lastClick.x}% {lastClick.y}%</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INTERACTIVE HUD OVERLAY (CLEAN - NO BARS) */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-10 sm:p-14 pt-28 sm:pt-32"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-3 text-white">
                <h2 className="text-4xl font-headline font-black tracking-[0.5em] transition-all duration-500 opacity-90 uppercase flex items-center gap-5">
                  <Users className="h-8 w-8 text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" /> NEXUS DUO LIVE
                </h2>
                <div className="flex gap-4">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 uppercase tracking-[0.4em] text-[10px] px-6 py-1.5 font-black">
                    <Activity className="h-3 w-3 mr-2 animate-pulse" /> SINC: NOÉTICA
                  </Badge>
                  <Badge className="bg-black/80 text-white/40 border-white/5 uppercase tracking-[0.3em] text-[9px] px-6 py-1.5 font-bold">
                    {speaker !== 'none' ? `FOCO: ${speaker.toUpperCase()}` : conversationState}
                  </Badge>
                </div>
              </div>

              <button 
                onClick={handleManualExit}
                className="pointer-events-auto p-5 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 text-white/50 hover:text-white transition-all active:scale-90 shadow-2xl backdrop-blur-2xl"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {/* FEEDBACK CENTER (CLEAN) */}
            <div className="flex flex-col items-center">
              <AnimatePresence mode="wait">
                {isTextInputOpen ? (
                  <motion.form 
                    key="text-input"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onSubmit={handleKeyboardSubmit}
                    className="w-full max-w-2xl px-4 relative pointer-events-auto"
                  >
                    <input 
                      autoFocus
                      value={keyboardInputValue}
                      onChange={(e) => setKeyboardInputValue(e.target.value)}
                      placeholder="Transmita sua diretriz tática..."
                      className="w-full bg-black/40 border border-blue-500/30 rounded-2xl px-8 py-6 text-white text-xl placeholder:text-white/20 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 backdrop-blur-3xl shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] mr-4">TECLADO ATIVO</span>
                    </div>
                  </motion.form>
                ) : (
                  <>
                    {conversationState === 'listening' && (
                      <motion.div 
                        key="listening"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-6"
                      >
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Mic className="h-10 w-10 text-blue-500/60 animate-pulse" />
                        </div>
                        <p className="text-blue-500/20 font-mono text-[9px] tracking-[1.5em] animate-pulse uppercase">Escuta Consciente... [T] para Digitar</p>
                      </motion.div>
                    )}

                    {conversationState === 'speaking' && (
                      <motion.div 
                        key="speaking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-white/10 font-mono text-[10px] tracking-[2em] uppercase font-black"
                      >
                        Confluência Vocal Ativa
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-end opacity-20 text-[9px] font-mono text-white tracking-[0.5em] uppercase">
              <div className="flex flex-col gap-1">
                <div>BIOMETRIC_ARRAY: RECOGNIZED</div>
                <div>STATUS: MISSION_READY</div>
              </div>
              <div className="text-right">DOPPLER_CORRECTION: ACTIVE</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INITIALIZATION GATE */}
      <AnimatePresence>
        {!isInitialized && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="max-w-2xl space-y-20">
              <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/5 animate-[ping_4s_infinite]" />
                <div className="relative w-full h-full rounded-full bg-blue-500/5 flex items-center justify-center border border-white/10 shadow-[0_0_120px_rgba(59,130,246,0.1)]">
                  <Cpu className="h-20 w-20 text-blue-500/40" />
                </div>
              </div>
              
              <div className="space-y-8">
                <h3 className="text-6xl font-headline font-black text-white uppercase tracking-[0.6em] drop-shadow-2xl">Nexus Duo Live</h3>
                <p className="text-zinc-600 font-mono text-xs leading-relaxed uppercase tracking-[0.6em] max-w-sm mx-auto">Unificando biossistemas para interação humana de elite.</p>
              </div>

              <Button 
                onClick={initializeDuo}
                className="bg-white text-black hover:bg-blue-600 hover:text-white px-24 py-14 rounded-[48px] text-3xl font-black tracking-[0.4em] group transition-all duration-700 shadow-[0_0_80px_rgba(255,255,255,0.1)] border-none"
              >
                <Power className="mr-6 h-10 w-10 transition-transform duration-1000 group-hover:rotate-180" />
                {t('duo.live.connect')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hologram Scanlines - Hidden in Cinema Mode */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 hologram-scanlines pointer-events-none z-10" 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
