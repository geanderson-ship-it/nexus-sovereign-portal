'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, UserX, UserCheck, AlertTriangle, Crosshair } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Tipos
type Tracker = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  status: 'SCANNING' | 'MATCH' | 'UNKNOWN' | 'SUSPECT';
  targetX: number;
  targetY: number;
  matchScore: number;
  personName?: string;
  cpf?: string;
};

const NAMES = ['João P. Silva', 'Marcos T.', 'Ana Lúcia', 'Carlos R.', 'Roberto M.', 'Felipe S.', 'Desconhecido', 'Desconhecido', 'Desconhecido'];

export function BiometricScanner({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globalScanCount, setGlobalScanCount] = useState(13084);
  const [suspectFound, setSuspectFound] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let idCounter = 0;
    
    const spawnInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        const startX = 20 + Math.random() * 60; 
        const startY = 15 + Math.random() * 20; // Muito mais alto (15% a 35% da tela)
        
        // Pega um nome aleatório e define se é o suspeito escolhido
        const chosenName = NAMES[Math.floor(Math.random() * NAMES.length)];
        const isSuspect = chosenName === 'Felipe S.';
        const isUnknown = !isSuspect && Math.random() > 0.7; // Desconhecido apenas se não for suspeito
        
        const newTracker: Tracker = {
          id: idCounter++,
          x: startX,
          y: startY,
          width: 4 + Math.random() * 2, // Quadrados menores (tamanho exato de um rosto longe)
          height: 6 + Math.random() * 3, 
          status: 'SCANNING',
          targetX: startX + (Math.random() > 0.5 ? 10 : -10), 
          targetY: startY + (Math.random() > 0.5 ? 5 : -5),
          matchScore: 0,
        };

        setTrackers(prev => [...prev, newTracker]);
        setGlobalScanCount(prev => prev + 1);

        setTimeout(() => {
          setTrackers(currentTrackers => 
            currentTrackers.map(t => {
              if (t.id === newTracker.id) {
                let finalStatus = t.status;
                if (isSuspect) {
                  finalStatus = 'SUSPECT';
                  setSuspectFound(true);
                }
                else if (isUnknown) finalStatus = 'UNKNOWN';
                else finalStatus = 'MATCH';

                return { 
                  ...t, 
                  status: finalStatus as any,
                  matchScore: finalStatus === 'UNKNOWN' ? 40 + Math.random() * 20 : (finalStatus === 'SUSPECT' ? 99.8 : 96 + Math.random() * 3),
                  personName: finalStatus === 'UNKNOWN' ? 'NÃO IDENTIFICADO' : chosenName,
                  cpf: finalStatus === 'UNKNOWN' ? '---' : `***.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}-**`
                };
              }
              return t;
            })
          );
        }, 1200 + Math.random() * 800);

        setTimeout(() => {
          setTrackers(currentTrackers => currentTrackers.filter(t => t.id !== newTracker.id));
        }, 4000 + Math.random() * 3000);
      }
    }, 1500);

    const moveInterval = setInterval(() => {
      setTrackers(currentTrackers => 
        currentTrackers.map(t => {
          const dx = (t.targetX - t.x) * 0.05;
          const dy = (t.targetY - t.y) * 0.05;
          return { ...t, x: t.x + dx, y: t.y + dy };
        })
      );
    }, 100);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white px-4 py-2 rounded font-bold uppercase tracking-widest text-xs"
      >
        Encerrar Monitoramento
      </button>

      <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
        <div className="relative">
          <ScanFace className="w-8 h-8 text-blue-500 animate-pulse" />
          <div className="absolute inset-0 border border-blue-500 rounded-full animate-ping opacity-50" />
        </div>
        <div>
          <h2 className="text-xl font-black text-blue-400 tracking-widest uppercase">Cerco Biométrico Live</h2>
          <p className="text-xs text-blue-500/70 font-mono">NODE: CENTRO-01 // REKOGNITION ENGINE</p>
        </div>
      </div>

      <div className="relative w-full max-w-7xl aspect-video bg-slate-900 border border-blue-500/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] flex" ref={containerRef}>
        
        <div className="absolute inset-0 z-0">
          <video 
            src="/visao_camera.mp4" 
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-[10%] w-full animate-scanline pointer-events-none" />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          <AnimatePresence>
            {trackers.map(tracker => {
              let color = 'border-blue-400 text-blue-400';
              let bgColor = 'bg-blue-500/20';
              let Icon = Crosshair;
              
              if (tracker.status === 'MATCH') {
                color = 'border-emerald-400 text-emerald-400';
                bgColor = 'bg-emerald-500/20';
                Icon = UserCheck;
              } else if (tracker.status === 'SUSPECT') {
                color = 'border-red-500 text-red-500';
                bgColor = 'bg-red-500/20';
                Icon = AlertTriangle;
              } else if (tracker.status === 'UNKNOWN') {
                color = 'border-amber-400 text-amber-400';
                bgColor = 'bg-amber-500/20';
                Icon = UserX;
              }

              return (
                <motion.div
                  key={tracker.id}
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute"
                  style={{
                    left: `${tracker.x}%`,
                    top: `${tracker.y}%`,
                    width: `${tracker.width}%`,
                    height: `${tracker.height}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className={`w-full h-full border-2 ${color} relative ${tracker.status === 'SUSPECT' ? 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]' : ''}`}>
                    <div className={`absolute -top-1 -left-1 w-3 h-3 border-t-4 border-l-4 ${color}`} />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 border-t-4 border-r-4 ${color}`} />
                    <div className={`absolute -bottom-1 -left-1 w-3 h-3 border-b-4 border-l-4 ${color}`} />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-b-4 border-r-4 ${color}`} />
                    
                    {tracker.status === 'SCANNING' && (
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-scan" />
                    )}
                  </div>

                  <div className={`absolute top-0 left-full ml-2 w-max bg-slate-950/90 border ${color} p-1.5 rounded shadow-lg`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{tracker.status}</span>
                    </div>
                    
                    {tracker.status !== 'SCANNING' && (
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-mono font-bold text-white uppercase">{tracker.personName}</div>
                        <div className="text-[8px] font-mono text-slate-400">CPF: {tracker.cpf}</div>
                        <div className="text-[8px] font-mono text-slate-400">CONF: {tracker.matchScore.toFixed(1)}%</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="absolute top-0 right-0 h-full w-72 bg-slate-950/95 border-l border-blue-500/30 p-4 flex flex-col z-20 pointer-events-none">
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Telemetria Real-Time</h3>
            
            {suspectFound && (
              <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-3 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2 mb-2 text-red-500">
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Alerta de Procurado</span>
                </div>
                
                <div className="grid grid-cols-3 gap-1 mb-3">
                  <div className="relative w-full aspect-square border border-red-500/50 overflow-hidden rounded bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/suspeito_barba.png" className="w-full h-full object-cover object-top grayscale contrast-125" alt="FOTO ORIGINAL" />
                    <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay" />
                    <div className="absolute bottom-0 w-full bg-red-900/90 text-[6px] text-center font-bold text-red-200 tracking-widest uppercase border-t border-red-500/50 py-0.5">SISTEMA</div>
                  </div>
                  <div className="relative w-full aspect-square border border-emerald-500/50 overflow-hidden rounded bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/suspeito_malha.jpg" className="w-full h-full object-cover grayscale contrast-150" alt="CÁLCULO BIOMÉTRICO" />
                    <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay" />
                    <div className="absolute bottom-0 w-full bg-emerald-900/90 text-[6px] text-center font-bold text-emerald-200 tracking-widest uppercase border-t border-emerald-500/50 py-0.5">BIOMETRIA</div>
                  </div>
                  <div className="relative w-full aspect-square border border-amber-500/50 overflow-hidden rounded bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/suspeito_disfarce.jpg" className="w-full h-full object-cover object-top grayscale contrast-125" alt="PREVISÃO AI" />
                    <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
                    <div className="absolute bottom-0 w-full bg-amber-900/90 text-[6px] text-center font-bold text-amber-200 tracking-widest uppercase border-t border-amber-500/50 py-0.5">PROJEÇÃO AI</div>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between border-b border-red-900/50 pb-1">
                    <span className="text-[8px] text-red-400/70">NOME:</span>
                    <span className="text-[9px] font-bold text-red-100">FELIPE S. (VULGO: CORVO)</span>
                  </div>
                  <div className="flex justify-between border-b border-red-900/50 pb-1">
                    <span className="text-[8px] text-red-400/70">IDADE / CPF:</span>
                    <span className="text-[9px] font-bold text-red-100">34 ANOS / ***.128.490-**</span>
                  </div>
                  <div className="flex justify-between border-b border-red-900/50 pb-1">
                    <span className="text-[8px] text-red-400/70">MANDADO:</span>
                    <span className="text-[9px] font-bold text-red-100">ART. 157 (ATIVO)</span>
                  </div>
                  <div className="flex justify-between bg-red-500/20 p-1 rounded mt-2">
                    <span className="text-[8px] text-red-300 font-black">MATCH BIOMÉTRICO:</span>
                    <span className="text-[10px] font-black text-red-400 animate-pulse">99.8% (CONFIRMADO)</span>
                  </div>
                  
                  <div className="mt-3 p-2 bg-red-950/50 border border-red-500/30 rounded text-[8px] text-red-200/90 leading-relaxed font-mono">
                    <span className="font-bold text-red-400 block mb-1">INTELIGÊNCIA TÁTICA // ROTA:</span>
                    O indivíduo foi reconhecido pelo sistema na esquina da Av. Independência com a Rua Marechal Floriano, seguindo a pé em direção à Rua Senador Pinheiro Machado.
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1 mt-4">
              <p className="text-[9px] text-slate-500 uppercase">Faces Analisadas (Hoje)</p>
              <p className="text-2xl font-black text-blue-400 font-mono">{globalScanCount.toLocaleString()}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[9px] text-slate-500 uppercase">Latência Kinesis / AWS</p>
              <p className="text-sm font-bold text-emerald-400 font-mono">14ms - LIVE</p>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-[9px] text-slate-500 uppercase border-b border-slate-800 pb-1">Últimas Detecções</p>
              
              <div className="space-y-2">
                {[...trackers].reverse().slice(0, 3).map(t => {
                  if (t.status === 'SCANNING') return null;
                  return (
                    <div key={t.id + '-log'} className={`p-2 rounded border text-[9px] font-mono ${
                      t.status === 'SUSPECT' ? 'bg-red-950/50 border-red-500/30 text-red-400' :
                      t.status === 'UNKNOWN' ? 'bg-amber-950/50 border-amber-500/30 text-amber-400' :
                      'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                    }`}>
                      <div className="font-bold">{t.personName}</div>
                      <div className="opacity-70">{t.status === 'SUSPECT' ? 'MANDADO DE PRISÃO EM ABERTO' : 'SEM ANTECEDENTES'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-800 text-center">
             <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[8px] animate-pulse">
               NEXUS AI ACTIVE
             </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
