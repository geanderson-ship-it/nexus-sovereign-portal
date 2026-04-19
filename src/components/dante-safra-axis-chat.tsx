'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  Paperclip, 
  MoreVertical, 
  CheckCheck, 
  Search, 
  ArrowLeft,
  Loader2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  TrendingUp,
  Maximize,
  Minimize,
  Settings,
  Activity,
  CloudRain,
  Smartphone,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNexusAudio } from '@/hooks/use-nexus-audio';
import { danteSafra } from '@/ai/flows/dante-safra-flow';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { TacticalPulse } from './dante/tactical-pulse';
import { TacticalMarketCard } from './dante/tactical-market-card';
import { TacticalForecastCard } from './dante/tactical-forecast-card';
import { TacticalClimateOverlay } from './dante/tactical-climate-overlay';
import { TacticalMarketBoard } from './dante/tactical-market-board';

type TacticalOverlay = 'none' | 'climate' | 'market';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  status: 'sent' | 'received' | 'read';
}

export function DanteSafraAxisChat() {
  const { user } = useUser();
  const router = useRouter();
  const { playAudio, stopAudio, isPlaying, playingId } = useNexusAudio();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Sistema operacional. Dante Axis pronto para processamento de alto nível. Qual a diretriz tática hoje?',
      timestamp: new Date(),
      status: 'read'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<TacticalOverlay>('none');
  const [isRecording, setIsRecording] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0])
        .map((r: any) => r.transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !photoDataUri) || isLoading) return;

    const userMsgText = input;
    const currentPhoto = photoDataUri;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMsgText || (currentPhoto ? 'Imagem enviada para análise.' : ''),
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setPhotoDataUri(null);
    setIsLoading(true);
    stopAudio();

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const result = await danteSafra({
        userMessage: userMsgText,
        userName: user?.displayName || 'Comandante',
        setupStage: 'ANALISE',
        photoDataUri: currentPhoto || undefined,
        history: history.slice(-10) as any
      });

      const responseText = result.response || '';
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
        status: 'read'
      };

      setMessages(prev => [...prev, modelMsg]);

      if (!isMuted) {
        playAudio({ id: modelMsg.id, text: responseText, voice: 'dante' });
      }
    } catch (error) {
       setMessages(prev => [...prev, { 
         id: 'error', 
         role: 'model', 
         text: "Anomalia na matriz de comando. Repita a instrução.", 
         timestamp: new Date(), 
         status: 'read' 
       }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#050807] text-emerald-50 overflow-hidden relative border border-emerald-900/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Tactical Sidebar Navigation (Elite HUD) */}
      <div className="w-20 border-r border-emerald-900/30 bg-black/60 backdrop-blur-2xl flex flex-col items-center py-8 gap-8 z-20">
         <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
               <span className="text-xs font-black text-emerald-500">AX</span>
            </div>
         </div>

         <nav className="flex-1 flex flex-col gap-6">
            <TacticalNavItem icon={<Paperclip className="h-5 w-5" />} active={activeOverlay === 'none'} onClick={() => setActiveOverlay('none')} label="CHAT" />
            <TacticalNavItem icon={<CloudRain className="h-5 w-5" />} active={activeOverlay === 'climate'} onClick={() => setActiveOverlay('climate')} label="CLIMA" />
            <TacticalNavItem icon={<TrendingUp className="h-5 w-5" />} active={activeOverlay === 'market'} onClick={() => setActiveOverlay('market')} label="COTACAO" />
         </nav>

         <div className="flex flex-col gap-4 items-center">
            <Button variant="ghost" size="icon" className="text-emerald-900 hover:text-emerald-500">
               <Settings className="h-5 w-5" />
            </Button>
         </div>
      </div>
      
      {/* Sidebar - Telemetria Discreta (Eixo Direita) */}
      <div className="hidden xl:flex w-72 flex-col border-r border-emerald-900/20 bg-black/40 backdrop-blur-xl">
        <div className="p-6 border-b border-emerald-900/20">
           <h3 className="text-[10px] font-mono text-emerald-500 tracking-[0.3em] uppercase mb-4 text-center">TELEM_O_VIX_4</h3>
           <div className="space-y-4">
              <TelemetryStat label="CLIMA_LOCAL" value="24°C" status="ESTÁVEL" onClick={() => setActiveOverlay('climate')} />
              <TelemetryStat label="MERCADO_B3" value="+1.2%" status="ALTA" onClick={() => setActiveOverlay('market')} />
           </div>
        </div>
        
        <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide">
            <h3 className="text-[10px] font-mono text-emerald-500 tracking-[0.3em] uppercase text-center">PROTO_AXIS_LOG</h3>
            <div className="space-y-2 opacity-40">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="p-3 rounded-xl border border-emerald-900/20 bg-emerald-950/5 text-[9px] font-mono leading-tight">
                   [{new Date().toLocaleTimeString()}] _LOG_{i * 124}: ANALISE_SOLO_VIX_{i}_REC_OK
                 </div>
               ))}
            </div>
        </div>

        <div className="p-4 border-t border-emerald-900/20 text-center">
            <p className="text-[8px] text-emerald-900 font-mono tracking-widest">NEXUS_INTELLIGENCE // AXIS_ULTRA_v1.0</p>
        </div>
      </div>

      {/* Main Chat Area (Social Engineering Style) */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Header (Tactical WhatsApp-Elite) */}
        <header className="h-20 border-b border-emerald-900/30 bg-black/60 backdrop-blur-xl px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 rounded-full" onClick={() => router.back()}>
                <ArrowLeft className="h-6 w-6" />
             </Button>
             
             <div className="relative group">
                <TacticalPulse isSpeaking={isPlaying} isThinking={isLoading} className="w-14 h-14" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
             </div>

             <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-100 tracking-[0.2em] font-headline uppercase leading-none">DANTE_AXIS // TERMINAL</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[8px] font-mono text-emerald-700 uppercase tracking-tighter">PROTOCOLO_ENCRIPTADO: CANAL_77_A</span>
                   <div className="w-1 h-1 rounded-full bg-emerald-900" />
                   <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-tighter">LATÊNCIA: 12ms</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <Button 
                variant="ghost" 
                size="icon" 
                className={cn("text-emerald-500 hover:bg-emerald-500/10 rounded-full", isMuted && "text-red-500")}
                onClick={() => setIsMuted(!isMuted)}
             >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
             </Button>
             <div className="w-[1px] h-8 bg-emerald-900/30 mx-2" />
             <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 rounded-full">
                <Settings className="h-5 w-5" />
             </Button>
          </div>
        </header>

        {/* Chat History */}
        <ScrollArea className="flex-1 p-6 relative" ref={scrollRef}>
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1714_1px,transparent_1px),linear-gradient(to_bottom,#0f1714_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex flex-col gap-1 max-w-[90%] md:max-w-[75%]",
                  msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className={cn(
                  "px-5 py-4 rounded-3xl text-sm transition-all duration-500 relative group shadow-2xl",
                  msg.role === 'user' 
                    ? "bg-[#18231f] border border-emerald-500/20 text-emerald-50 rounded-br-none" 
                    : "bg-[#0d1512] border border-emerald-900/40 text-emerald-100 rounded-bl-none"
                )}>
                  {/* Decorative corner accents for model messages */}
                  {msg.role === 'model' && (
                    <>
                      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-emerald-500/40 rounded-tl-lg" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-emerald-500/40 rounded-br-lg" />
                    </>
                  )}

                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Simulated Tactical In-Line Widgets */}
                  {!msg.text.includes('Olá') && msg.role === 'model' && Math.random() > 0.7 && (
                    <div className="mt-4 space-y-4">
                       <TacticalMarketCard 
                        quotes={[
                          { symbol: 'SOJA', price: 'R$ 134,50', change: '+1.2%', isUp: true },
                          { symbol: 'MILHO', price: 'R$ 58,20', change: '-0.5%', isUp: false },
                        ]} 
                       />
                    </div>
                  )}

                  {msg.role === 'model' && (
                    <button 
                       onClick={() => playAudio({ id: msg.id, text: msg.text, voice: 'dante' })}
                       className={cn(
                         "absolute -right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-800 hover:text-emerald-400 transition-all opacity-0 group-hover:opacity-100",
                         playingId === msg.id && "opacity-100 text-emerald-400 bg-emerald-500/10"
                       )}
                    >
                       {playingId === msg.id ? <div className="h-4 w-4 bg-emerald-500 animate-pulse rounded-full" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 px-2">
                  <span className="text-[9px] font-mono text-emerald-900 uppercase">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'user' && (
                    <CheckCheck className={cn("h-3 w-3", msg.status === 'read' ? "text-blue-500" : "text-emerald-800")} />
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-[10px] font-mono text-emerald-700 tracking-widest px-4 animate-pulse"
              >
                <Loader2 className="h-3 w-3 animate-spin" /> PROCESSANDO_DIRETRIZ_AXIS...
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Bar (WhatsApp-Elite Style) */}
        <div className="p-6 bg-black/40 backdrop-blur-md border-t border-emerald-900/20">
          <form 
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto flex flex-col gap-3 relative group"
          >
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               accept="image/*" 
               className="hidden" 
             />

             {/* Image Preview Overlay */}
             <AnimatePresence>
                {photoDataUri && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="flex px-4 py-2 bg-black/60 border border-emerald-900/50 rounded-2xl gap-3 z-20"
                   >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-emerald-500/20">
                         <img src={photoDataUri} alt="Preview" className="w-full h-full object-cover" />
                         <button 
                           type="button"
                           onClick={() => setPhotoDataUri(null)}
                           className="absolute top-1 right-1 bg-black/60 rounded-full p-1 hover:bg-red-500/80 transition-colors"
                         >
                            <Minimize2 className="h-3 w-3 text-white" />
                         </button>
                      </div>
                      <div className="flex flex-col justify-center">
                         <span className="text-[10px] font-mono text-emerald-500 uppercase font-black tracking-widest">IMAGEM_ANEXADA</span>
                         <span className="text-[8px] font-mono text-emerald-900 uppercase">Pronto para análise tática...</span>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             <div className="flex items-center gap-3 relative">
               <div className="absolute -inset-1 bg-emerald-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none" />
               
               <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                onClick={handleFileClick}
                className="text-emerald-700 hover:text-emerald-400 hover:bg-emerald-500/10 shrink-0 relative z-10"
               >
                  <Paperclip className="h-5 w-5" />
               </Button>

               <div className="relative flex-1 z-10">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Relate o ocorrido na sua lavoura..."
                    className="bg-[#121b18] border-emerald-900/50 text-emerald-50 placeholder:text-emerald-900/40 rounded-xl h-12 px-5 focus-visible:ring-emerald-500/30"
                    disabled={isLoading}
                  />
               </div>

               <div className="flex items-center gap-2 z-10">
                  <Button 
                     type="button" 
                     size="icon" 
                     variant="ghost" 
                     onClick={toggleRecording}
                     className={cn(
                       "text-emerald-700 hover:text-emerald-400 hover:bg-emerald-500/10",
                       isRecording && "text-red-500 animate-pulse bg-red-500/10"
                     )}
                  >
                     <Mic className="h-5 w-5" />
                  </Button>
                  <Button 
                     type="submit" 
                     disabled={(!input.trim() && !photoDataUri) || isLoading}
                     className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 w-12 p-0 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-105 active:scale-95 transition-all"
                  >
                     <Send className="h-5 w-5" />
                  </Button>
               </div>
             </div>
          </form>
          <p className="text-center text-[9px] text-emerald-900 mt-4 font-mono tracking-widest uppercase">
             Canal Seguro // Encriptação Nexus v3.4
          </p>
        </div>
      </div>

      {/* Tactical Overlays */}
      <AnimatePresence mode="wait">
         {activeOverlay === 'climate' && (
           <TacticalClimateOverlay onClose={() => setActiveOverlay('none')} />
         )}
         {activeOverlay === 'market' && (
           <TacticalMarketBoard onClose={() => setActiveOverlay('none')} />
         )}
      </AnimatePresence>

    </div>
  );
}

function TacticalNavItem({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick}>
       <div className={cn(
         "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border relative",
         active 
           ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
           : "bg-black/40 border-emerald-900/20 text-emerald-900 hover:border-emerald-500/50 hover:text-emerald-500"
       )}>
          {active && (
            <motion.div 
               layoutId="activeGlow" 
               className="absolute inset-0 bg-emerald-500/5 blur-lg rounded-2xl" 
            />
          )}
          <div className="relative z-10">{icon}</div>
       </div>
       <span className={cn(
         "text-[7px] font-black uppercase tracking-widest transition-colors",
         active ? "text-emerald-400" : "text-emerald-900 group-hover:text-emerald-700"
       )}>
         {label}
       </span>
    </div>
  );
}

function TelemetryStat({ label, value, status, onClick }: { label: string, value: string, status: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col gap-1 p-3 rounded-2xl border border-emerald-900/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer group"
    >
       <span className="text-[8px] text-emerald-800 font-mono tracking-widest font-black uppercase">{label}</span>
       <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-emerald-50 font-mono">{value}</span>
          <Badge variant="outline" className="text-[7px] border-emerald-900/50 text-emerald-400 bg-emerald-950/30">{status}</Badge>
       </div>
    </div>
  );
}

function ProgressIndicator({ value }: { value: number }) {
  return (
    <div className="w-24 h-1 bg-emerald-950 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
      />
    </div>
  );
}
