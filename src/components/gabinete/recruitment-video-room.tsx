'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  Video, 
  PhoneOff, 
  Activity, 
  ShieldAlert, 
  MessageSquare,
  Maximize2,
  Volume2,
  User,
  Loader2,
  Smile,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import * as gtag from '@/lib/gtag';


interface RecruitmentVideoRoomProps {
  candidateName: string;
  onClose: () => void;
}

export function RecruitmentVideoRoom({ candidateName, onClose }: RecruitmentVideoRoomProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [nervousness, setNervousness] = useState(15);
  const [sincerity, setSincerity] = useState(85);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsConnecting(false);
        // Rastrear início da entrevista após conexão estabelecida
        gtag.event({
            action: 'recruitment_interview_start',
            category: 'Gabinete',
            label: candidateName
        });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulação de telemetria
  useEffect(() => {
    if (isConnecting) return;
    const interval = setInterval(() => {
      setNervousness(prev => Math.max(10, Math.min(90, prev + (Math.random() * 10 - 5))));
      setSincerity(prev => Math.max(50, Math.min(100, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(interval);
  }, [isConnecting]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-stretch overflow-hidden font-sans">
      
      {/* Barra de Status Superior */}
      <div className="h-14 bg-zinc-950/80 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-headline tracking-widest text-sm uppercase">Recrutamento em Tempo Real // IA Humana</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Stream encrypted via Nexus Shield</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent)]">
        
        {/* Main Video Area (Djeny) */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border-2 border-white/5 bg-zinc-900 shadow-2xl group">
          {isConnecting ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-primary font-headline tracking-tighter text-xl">Estabelecendo Conexão Segura...</p>
            </div>
          ) : (
            <>
              {/* Vídeo da Djeny (Placeholder de Alta Qualidade) */}
              <div className="absolute inset-0 bg-zinc-800">
                <img 
                  src="https://i.postimg.cc/K88VGZgc/Djeny-analista-de-RH.png" 
                  alt="Djeny RH" 
                  className="w-full h-full object-cover opacity-60 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>

              {/* HUD da Djeny */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="space-y-1">
                   <h2 className="text-2xl font-bold text-white font-headline">Djeny (Sua Estrategista)</h2>
                   <p className="text-primary font-mono text-sm uppercase tracking-widest">Protocolo Mentora // Ativo</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white">
                    <Volume2 className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Scanner FX overlay (Nexus Quality) */}
              <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent p-4">
                 <div className="h-full w-full border border-primary/10 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/40 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-primary/40 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />
                 </div>
              </div>
            </>
          )}
        </div>

        {/* Side Panel (Candidate & Metrics) */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto">
          
          {/* Candidate Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/40 shadow-xl shadow-primary/5 bg-zinc-950">
             <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-16 w-16 text-white/10" />
             </div>
             <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-emerald-500 text-black font-bold">LIVE</Badge>
                <span className="text-xs text-white/80 font-mono">1080p // 60fps</span>
             </div>
             <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold">{candidateName}</p>
             </div>
          </div>

          {/* Dossiê em Tempo Real (O Valor Agregado) */}
          <Card className="bg-zinc-950/80 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
               <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> Dossiê Psicológico Live
               </h3>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" /> Nível de Nervosismo</span>
                      <span className={cn("text-xs font-bold", nervousness > 50 ? "text-red-400" : "text-amber-400")}>{Math.round(nervousness)}%</span>
                    </div>
                    <Progress value={nervousness} className="h-1.5 bg-white/5" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Smile className="h-3 w-3 text-emerald-500" /> Índice de Sinceridade</span>
                      <span className="text-xs font-bold text-emerald-400">{Math.round(sincerity)}%</span>
                    </div>
                    <Progress value={sincerity} className="h-1.5 bg-white/5" />
                  </div>
               </div>

               <Separator className="bg-white/5" />

               <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Análise de IA (Djeny)</h4>
                  <div className="p-3 bg-white/5 rounded-md border border-white/5">
                    <p className="text-xs text-gray-300 italic">
                      "Candidato demonstrando hesitação ao descrever o último projeto. Recomendo aprofundar a pergunta sobre entrega de prazos."
                    </p>
                  </div>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Barra de Controle Inferior */}
      <div className="h-24 bg-zinc-950 border-t border-white/5 flex items-center justify-center gap-4 px-8 backdrop-blur-md">
         <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Mic className="h-5 w-5" />
         </Button>
         <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Video className="h-5 w-5" />
         </Button>
         <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
            <MessageSquare className="h-5 w-5" />
         </Button>
         <Separator orientation="vertical" className="h-8 bg-white/10 mx-2" />
         <Button 
            onClick={() => {
                gtag.event({
                    action: 'recruitment_interview_end',
                    category: 'Gabinete',
                    label: candidateName
                });
                onClose();
            }}
            className="h-14 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-3 shadow-lg shadow-red-900/20"
         >
            <PhoneOff className="h-5 w-5" /> ENCERRAR ENTREVISTA
         </Button>
      </div>

    </div>
  );
}
