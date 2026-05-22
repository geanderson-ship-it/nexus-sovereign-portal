
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Command,
  ChevronRight,
  Send,
  Loader2,
  Activity,
  Database,
  ShieldCheck,
  Zap,
  Cpu,
  Sparkles,
  Mic,
  Paperclip,
  Volume2,
  Image as ImageIcon,
  X,
  ThumbsUp,
  ThumbsDown,
  Crown
} from 'lucide-react';
import { IAPaymentModal } from './ia-payment-modal';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusAudio, useAudioLevel } from '@/hooks/use-nexus-audio';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import { magadotChat } from '@/ai/flows/magadot-chat-flow';
import { useUser } from '@/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PWAManifestInjector } from '@/components/pwa-injector';

export function MagaOSModule() {
  const { user } = useUser();
  const { t, locale } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [zenMode, setZenMode] = useState(false);
  
  // Audio & Speech
  const { playSpeech, isSpeaking } = useNexusAudio();
  const audioLevel = useAudioLevel();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition(locale);
  
  // Chat State
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string, image?: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const MAGA_PIX_KEY = "+5551999799582";
  const fullWelcome = "Oi! Que bom ter você aqui. Sou a Maga, sua parceira na Nexus. Vamos conversar de forma simples e encontrar a beleza no que você busca?";

  useEffect(() => {
    setMounted(true);
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullWelcome.slice(0, i));
      i++;
      if (i > fullWelcome.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') setZenMode(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputValue.trim() && !attachedImage) || isLoading) return;

    const userMsg = inputValue;
    const currentImg = attachedImage;
    
    setInputValue('');
    setAttachedImage(null);
    setMessages(prev => [...prev, { role: 'user', text: userMsg, image: currentImg || undefined }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const result = await magadotChat({
        userMessage: userMsg,
        userName: user?.displayName || 'Comandante',
        locale: locale,
        image: currentImg || undefined,
        history: history.slice(-6)
      });

      const responseText = result.response || '';
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      
      // Auto-speak the response (Isolated to avoid crashing the UI if audio fails)
      try {
        await playSpeech({ id: 'maga-os-response', text: responseText, voice: 'maga' });
      } catch (audioErr) {
        console.warn("Maga voice synthesis failed, but message was delivered.", audioErr);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Ops, Comandante... tive uma anomalia temporária no meu núcleo Magadot. Tenta de novo?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col relative animate-in fade-in duration-1000">
      {/* 
        A INJEÇÃO DO MANIFESTO ACONTECE AQUI.
        Neste cenário, estamos assumindo que quem chega nesta tela e não está na Trial Gate já pagou pelo acesso VIP.
        Se fosse uma tela pública, envolveríamos com if(hasPurchasedAtena).
      */}
      {user && <PWAManifestInjector manifestUrl="/atena-manifest.json" />}
      
      {/* MAGA HERO AVATAR (BACKGROUND/CENTER) */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 cursor-pointer pointer-events-auto"
        onClick={() => setZenMode(!zenMode)}
      >
        
        {/* INTERNAL SVG FILTERS FOR REAL-TIME WARPING (LOCALIZED) */}
        <svg className="absolute h-0 w-0">
          <defs>
            <filter id="maga-lip-sync-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04 0.12" numOctaves="2" seed="3" result="noise" />
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
          className="relative w-full h-full max-w-4xl"
          animate={{
            scale: isSpeaking ? 1.05 + (audioLevel * 0.02) : (zenMode ? 1.15 : [1, 1.02, 1]), // Scale up in Zen mode
            y: isSpeaking ? -audioLevel * 8 : [0, -5, 0], // Subtle swaying idle
            filter: isSpeaking 
              ? `drop-shadow(0 0 ${20 + audioLevel * 60}px rgba(59,130,246,0.6))` 
              : "drop-shadow(0 0 20px rgba(59,130,246,0.2))"
          }}
          transition={{ 
            scale: isSpeaking || zenMode ? { type: 'spring', stiffness: 200, damping: 25 } : { duration: 4, repeat: Infinity, ease: "easeInOut" },
            y: isSpeaking ? { type: 'spring', stiffness: 200, damping: 25 } : { duration: 6, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 1 }
          }}
        >
          {/* Main Body (Static/Breathing) */}
          <Image 
            src="/maga-avatar-premium.png" 
            alt="Maga - Human Essence" 
            fill
            className="object-contain opacity-100 transition-all duration-700 hover:brightness-110"
            style={{
              filter: `brightness(1.2) contrast(1.1) drop-shadow(0 0 30px rgba(255,255,255,0.05))`
            }}
            priority
          />

          {/* Ultra-Fidelity Mouth Layer (Kinetic + Warp) */}
          {isSpeaking && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                clipPath: 'ellipse(4.1% 2.8% at 52.2% 51.5%)',
                zIndex: 5
              }}
              animate={{
                scaleY: 1 + (audioLevel * 0.15), // Mandible opening
                y: audioLevel * 3, // Jaw dropping
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Image 
                src="/maga-avatar-premium.png" 
                alt="Maga Mouth" 
                fill
                className="object-contain brightness-[1.6] saturate-[1.5]"
                style={{
                  filter: 'url(#maga-lip-sync-filter)',
                }}
                priority
              />
            </motion.div>
          )}

          {/* Reactive Aura */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1.3 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full bg-blue-500/20 blur-[120px]"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* OVERLAY: CHAT HISTORY (HUD STYLE) */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden relative z-10 flex flex-col pt-12 pointer-events-none"
          >
            <div className="flex justify-between items-center px-6 mb-4 pointer-events-auto">
              <div className="flex flex-col">
                <h1 className="text-4xl font-headline font-medium text-white tracking-[0.8em] drop-shadow-2xl uppercase opacity-60">Nexus</h1>
                <p className="text-[10px] font-mono text-white/20 tracking-[1.2em] uppercase font-light">Maga // Conexão Humana</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-white/10 text-white/40 bg-white/5 backdrop-blur-2xl uppercase tracking-widest px-4 py-1">
                  CONEXÃO ESTÁVEL
                </Badge>
                {isSpeaking && (
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500 animate-pulse font-black uppercase tracking-widest px-4 py-1">
                    <Volume2 className="h-3 w-3 mr-2" /> RHETORIC_ON
                  </Badge>
                )}
                <Link href="/intelligence/maga-live">
                  <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white transition-all gap-2">
                    <Activity className="h-4 w-4" /> MAGA LIVE
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold border-none hover:scale-105 transition-all gap-2"
                >
                  <Crown className="h-4 w-4" /> UPGRADE VIP
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 px-6 pb-4 pointer-events-auto" ref={scrollRef}>
              <div className="space-y-8 max-w-3xl mx-auto">
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}
                  >
                    <div className="flex items-start gap-4">
                      {msg.role === 'model' && (
                        <div className={cn(
                          "w-10 h-10 rounded-full bg-blue-500/10 flex-shrink-0 border border-blue-500/30 overflow-hidden",
                          isSpeaking && "animate-pulse border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        )}>
                          <Image 
                            src="/maga-avatar-premium.png" 
                            alt="Maga AI" 
                            width={40} 
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <div className={cn(
                          "p-5 rounded-2xl backdrop-blur-xl border transition-all duration-500 relative group/msg",
                          msg.role === 'user' 
                            ? "bg-white/5 border-white/10 text-gray-200" 
                            : "bg-blue-900/20 border-blue-500/30 text-blue-50 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                        )}>
                          {msg.image && (
                            <div className="mb-3 relative rounded-lg overflow-hidden border border-white/10 max-w-sm">
                              <Image src={msg.image} alt="Attachment" width={300} height={200} className="object-cover" />
                            </div>
                          )}
                          <p className="font-mono text-sm leading-relaxed">{msg.text}</p>
                          
                          {/* Feedback Icons for Model responses */}
                          {msg.role === 'model' && (
                            <div className="absolute -bottom-4 right-4 flex gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity bg-zinc-900 border border-zinc-800 rounded-full px-2 py-1 shadow-xl z-20">
                              <button className="p-1 hover:text-blue-400 transition-colors">
                                <ThumbsUp className="h-3 w-3" />
                              </button>
                              <button className="p-1 hover:text-red-400 transition-colors">
                                <ThumbsDown className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest px-2">
                          {msg.role === 'user' ? (user?.displayName || 'Comandante') : 'Maguinha'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex items-center gap-3 text-blue-400/60 font-mono text-[10px] animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" /> PROCESSANDO MATRIZ DE PENSAMENTO...
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT COMMAND BAR (BOTTOM) */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 relative z-20"
          >
            <div className="max-w-4xl mx-auto relative group">
              
              {/* Preview Image */}
              <AnimatePresence>
                {attachedImage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-4 p-2 bg-zinc-900 border border-blue-500/30 rounded-lg flex items-center gap-3 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image src={attachedImage} alt="Preview" fill className="object-cover" />
                    </div>
                    <button onClick={() => setAttachedImage(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form 
                onSubmit={handleSendMessage}
                className="relative flex items-center gap-3 bg-black/60 border border-blue-500/20 p-2 pr-4 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.15)] focus-within:border-blue-500/50 transition-all duration-500"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full hover:bg-blue-500/10 text-blue-400/70 hover:text-blue-400 transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('intelligence.magadot.placeholder')}
                  className="flex-1 bg-transparent border-none text-blue-50 placeholder:text-blue-900/50 font-mono focus-visible:ring-0 text-lg py-6"
                />

                <div className="flex items-center gap-1">
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={isListening ? stopListening : startListening}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      isListening ? "bg-red-500/20 text-red-400 animate-pulse scale-110" : "hover:bg-blue-500/10 text-blue-400/70"
                    )}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>

                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/40 w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Grid/Matrix effect */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[-1] pointer-events-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
            <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <IAPaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        iaName="Magadot Premium"
        pixKey={MAGA_PIX_KEY}
      />
    </div>
  );
}
