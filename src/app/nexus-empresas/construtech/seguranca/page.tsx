'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck, AlertOctagon, Camera, History, Video, 
  CheckCircle2, AlertTriangle, Users, HardHat, ChevronRight, Share2
} from 'lucide-react';

interface Incidente {
  id: string;
  camera: string;
  hora: string;
  tipo: 'critico' | 'aviso' | 'conformidade';
  descricao: string;
  imagem: string;
}

const mockIncidentes: Incidente[] = [
  { id: 'INC-104', camera: 'CAM 04 - Laje 3', hora: 'Agora', tipo: 'critico', descricao: 'Operário no perímetro de queda sem cinto de segurança (talabarte desconectado).', imagem: '/images/worker_no_belt.jpg' },
  { id: 'INC-103', camera: 'CAM 12 - Pátio', hora: 'Há 12 min', tipo: 'aviso', descricao: 'Aproximação perigosa entre pedestre e escavadeira.', imagem: '/images/equipamento_const.jpg' },
  { id: 'INC-102', camera: 'CAM 01 - Portaria', hora: 'Há 45 min', tipo: 'conformidade', descricao: 'Auditoria de entrada: 100% (42/42) com EPI padrão (Capacete, Bota, Óculos).', imagem: '' },
];

export default function SegurancaPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'historico'>('monitor');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Segurança do Trabalho" imagePath="/images/seguranca_const.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-amber-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[10%] w-[50%] h-[50%] bg-amber-900/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]" />
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-amber-400/70 hover:text-amber-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-amber-500" />
                Segurança <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Cognitiva (EHS)</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Câmeras conectadas à IA identificam operários sem EPI, zonas de risco e emitem alertas imediatos.
              </p>
            </div>
            
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('monitor')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'monitor' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-slate-400 hover:text-white'}`}
              >
                <Video className="h-4 w-4" /> Monitor Central
              </button>
              <button 
                onClick={() => setActiveTab('historico')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'historico' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-slate-400 hover:text-white'}`}
              >
                <History className="h-4 w-4" /> Histórico Inalterável
              </button>
            </div>
          </div>

          {/* Metric Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { title: 'Índice de Conformidade', value: '98.2%', icon: CheckCircle2, color: 'emerald' },
               { title: 'Trabalhadores na Planta', value: '154', icon: Users, color: 'sky' },
               { title: 'Faltas de EPI (Hoje)', value: '03', icon: HardHat, color: 'amber' },
               { title: 'Quase-Acidentes Evitados', value: '01', icon: AlertOctagon, color: 'red' },
             ].map((m, i) => (
               <div key={i} className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                 <div className={`p-3 rounded-xl bg-${m.color}-500/10 border border-${m.color}-500/20`}>
                   <m.icon className={`h-6 w-6 text-${m.color}-500`} />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{m.title}</p>
                   <p className="text-2xl font-black text-white mt-1">{m.value}</p>
                 </div>
               </div>
             ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'monitor' && (
              <motion.div key="monitor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Visualizador de Câmeras */}
                <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Camera className="h-5 w-5 text-amber-500" /> Circuito CFTV Inteligente
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Live AI Scanning</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 bg-slate-950 relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    
                    {/* Fake Camera Feed */}
                    <div className="w-full h-[500px] rounded-2xl overflow-hidden relative border border-white/10">
                      <img src="/images/worker_no_belt.jpg" className="w-full h-full object-cover grayscale opacity-90" alt="CCTV Feed" />
                      <div className="absolute inset-0 bg-amber-900/20 mix-blend-overlay" />
                      
                      {/* Bounding Boxes */}
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute top-[30%] left-[40%] w-[15%] h-[40%] border-2 border-emerald-500 bg-emerald-500/10 rounded"
                      >
                        <div className="absolute -top-6 left-0 bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-t">
                          OP-042: OK
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5], borderColor: ['#f59e0b', '#ef4444', '#f59e0b'] }} 
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute top-[20%] left-[65%] w-[12%] h-[35%] border-2 border-red-500 bg-red-500/20 rounded z-20"
                      >
                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-t animate-pulse">
                          ALERTA: SEM CINTO
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-10 left-10 z-20 flex gap-4">
                      <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                        <p className="text-xs text-slate-400 mb-1 font-mono">CAM 04 - Laje 3 (Perímetro)</p>
                        <p className="text-sm font-bold text-white">Análise Neural Ativa: 12 fps</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Log de Incidentes */}
                <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-white/5 bg-black/20">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <AlertOctagon className="h-5 w-5 text-amber-500" /> Log de Ocorrências (Hoje)
                    </h3>
                  </div>
                  
                  <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                    {mockIncidentes.map(inc => (
                      <div key={inc.id} className={`p-4 rounded-2xl border ${
                        inc.tipo === 'critico' ? 'bg-red-500/5 border-red-500/20' :
                        inc.tipo === 'aviso' ? 'bg-amber-500/5 border-amber-500/20' :
                        'bg-emerald-500/5 border-emerald-500/20'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className={`
                            ${inc.tipo === 'critico' ? 'border-red-500/30 text-red-400 bg-red-500/10' : ''}
                            ${inc.tipo === 'aviso' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : ''}
                            ${inc.tipo === 'conformidade' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : ''}
                          `}>
                            {inc.tipo.toUpperCase()}
                          </Badge>
                          <span className="text-xs font-mono text-slate-500">{inc.hora}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-200 mb-1">{inc.camera}</p>
                        <p className={`text-sm ${inc.tipo === 'critico' ? 'text-red-300' : 'text-slate-400'}`}>
                          {inc.descricao}
                        </p>
                        
                        {inc.tipo === 'critico' && (
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white shadow-none w-full">
                              Paralisar Frente
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 px-3">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: Histórico Inalterável (Blockchain/Logs) */}
            {activeTab === 'historico' && (
              <motion.div key="historico" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 text-center min-h-[500px] flex flex-col items-center justify-center">
                <History className="h-16 w-16 text-amber-500/50 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Registro de Conformidade Imutável</h2>
                <p className="text-slate-400 max-w-lg mb-8">
                  Todos os logs de conformidade de EPIs e alertas críticos são assinados digitalmente. 
                  Em caso de auditorias fiscais ou processos trabalhistas, você possui provas irrefutáveis de que a empresa atuou preventivamente.
                </p>
                <Button className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl h-12 px-8">
                  Exportar Dossiê de Segurança (PDF)
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </SovereignShowcase>
  );
}
