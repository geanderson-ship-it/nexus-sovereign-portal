'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Truck, MapPin, Activity, AlertTriangle, Settings, Battery,
  Wifi, BarChart3, Clock, Wrench, ShieldAlert, ChevronRight
} from 'lucide-react';

interface Equipamento {
  id: string;
  nome: string;
  tipo: string;
  status: 'ativo' | 'ocioso' | 'manutencao';
  combustivel: number;
  sinal: 'forte' | 'medio' | 'fraco';
  horasTrabalhadas: number;
  custoOciosidade: number;
  localizacao: string;
}

const mockEquipamentos: Equipamento[] = [
  { id: 'EQ-01', nome: 'Grua Torre (Liebherr)', tipo: 'Elevação', status: 'ativo', combustivel: 92, sinal: 'forte', horasTrabalhadas: 1240, custoOciosidade: 0, localizacao: 'Setor A - Laje 4' },
  { id: 'EQ-02', nome: 'Escavadeira (CAT 320)', tipo: 'Terraplanagem', status: 'ocioso', combustivel: 45, sinal: 'forte', horasTrabalhadas: 3450, custoOciosidade: 1250.00, localizacao: 'Pátio Norte' },
  { id: 'EQ-03', nome: 'Betoneira Móvel 8m³', tipo: 'Concretagem', status: 'ativo', combustivel: 78, sinal: 'medio', horasTrabalhadas: 890, custoOciosidade: 0, localizacao: 'Setor B - Subsolo' },
  { id: 'EQ-04', nome: 'Manipulador Telescópico', tipo: 'Logística', status: 'manutencao', combustivel: 15, sinal: 'fraco', horasTrabalhadas: 4100, custoOciosidade: 0, localizacao: 'Oficina Central' },
];

export default function EquipamentosPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedEq, setSelectedEq] = useState<Equipamento>(mockEquipamentos[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Gestão de Equipamentos" imagePath="/images/equipamento_const.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-sky-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] bg-sky-900/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
          {/* Radar Sweep Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-sky-500/5 opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-sky-500/10 opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-sky-500/15 opacity-50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-sky-400/70 hover:text-sky-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <Truck className="h-10 w-10 text-sky-500" />
                Gestão de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Equipamentos</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Telemetria IoT em tempo real. Elimine ociosidade e antecipe manutenções na sua frota de máquinas pesadas.
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="p-4 bg-slate-900/50 rounded-2xl border border-sky-500/20 backdrop-blur-md">
                 <p className="text-xs font-bold text-slate-500 uppercase">Custo de Ociosidade (Mês)</p>
                 <p className="text-2xl font-black text-white mt-1">R$ 14.250<span className="text-sm font-normal text-slate-500">,00</span></p>
               </div>
               <div className="p-4 bg-slate-900/50 rounded-2xl border border-sky-500/20 backdrop-blur-md">
                 <p className="text-xs font-bold text-slate-500 uppercase">Eficiência Global (OEE)</p>
                 <p className="text-2xl font-black text-sky-400 mt-1">87.4%</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Lista de Equipamentos (Esquerda) */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-sky-400" /> Frota Conectada (4/42)
              </h2>
              
              {mockEquipamentos.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => setSelectedEq(eq)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                    selectedEq.id === eq.id 
                      ? 'bg-sky-900/20 border-sky-500/40 shadow-[0_0_30px_rgba(14,165,233,0.15)]' 
                      : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{eq.nome}</h3>
                      <p className="text-xs font-mono text-slate-500">{eq.id}</p>
                    </div>
                    <Badge variant="outline" className={`
                      ${eq.status === 'ativo' ? 'border-sky-500/30 text-sky-400 bg-sky-500/10' : ''}
                      ${eq.status === 'ocioso' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : ''}
                      ${eq.status === 'manutencao' ? 'border-red-500/30 text-red-400 bg-red-500/10' : ''}
                    `}>
                      {eq.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                     <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-500" /> {eq.localizacao}</span>
                     <span className="flex items-center gap-1"><Wifi className={`h-3 w-3 ${eq.sinal === 'forte' ? 'text-sky-400' : 'text-slate-500'}`} /> Sync</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Painel de Telemetria Detalhada (Centro e Direita) */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEq.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full bg-slate-900/40 border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden"
                >
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
                  
                  {/* Detalhe Superior */}
                  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 mb-10">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30">{selectedEq.tipo}</Badge>
                        <span className="text-sm font-mono text-slate-500">{selectedEq.id}</span>
                      </div>
                      <h2 className="text-3xl font-black text-white">{selectedEq.nome}</h2>
                      <p className="text-slate-400 flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-sky-400" /> GPS Local: {selectedEq.localizacao}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative mx-auto mb-2">
                           <svg className="absolute inset-0 w-full h-full -rotate-90">
                             <circle cx="28" cy="28" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-sky-500 translate-x-[2px] translate-y-[2px]" strokeDasharray="175" strokeDashoffset={175 - (175 * selectedEq.combustivel) / 100} />
                           </svg>
                           <Battery className="h-5 w-5 text-sky-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Energia/Combustível</p>
                        <p className="text-lg font-black text-white">{selectedEq.combustivel}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Metricas Centrais */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-white/5">
                      <Clock className="h-6 w-6 text-slate-500 mb-3" />
                      <p className="text-sm text-slate-400">Horímetro Total</p>
                      <p className="text-2xl font-black text-white">{selectedEq.horasTrabalhadas} <span className="text-sm text-slate-500 font-normal">hrs</span></p>
                    </div>
                    
                    <div className={`bg-slate-950 p-5 rounded-2xl border ${selectedEq.status === 'ocioso' ? 'border-amber-500/30' : 'border-white/5'}`}>
                      <AlertTriangle className={`h-6 w-6 mb-3 ${selectedEq.status === 'ocioso' ? 'text-amber-500' : 'text-slate-500'}`} />
                      <p className="text-sm text-slate-400">Custo de Ociosidade</p>
                      <p className={`text-2xl font-black ${selectedEq.status === 'ocioso' ? 'text-amber-400' : 'text-white'}`}>
                        R$ {selectedEq.custoOciosidade.toFixed(2)}
                      </p>
                    </div>

                    <div className={`bg-slate-950 p-5 rounded-2xl border ${selectedEq.status === 'manutencao' ? 'border-red-500/30' : 'border-white/5'}`}>
                      <Wrench className={`h-6 w-6 mb-3 ${selectedEq.status === 'manutencao' ? 'text-red-500' : 'text-slate-500'}`} />
                      <p className="text-sm text-slate-400">Próx. Manutenção</p>
                      <p className={`text-xl font-black ${selectedEq.status === 'manutencao' ? 'text-red-400' : 'text-white'}`}>
                        {selectedEq.status === 'manutencao' ? 'Em andamento' : 'Em 160 hrs'}
                      </p>
                    </div>
                  </div>

                  {/* Grafico/Mapa Simulado */}
                  <div className="relative z-10 flex-1 bg-slate-950 rounded-2xl border border-white/5 p-6 flex flex-col justify-between overflow-hidden">
                    
                    <div className="flex items-center justify-between mb-4 relative z-20">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-sky-400" /> Padrão de Uso (Últimas 24h)
                      </h3>
                      <Button variant="outline" size="sm" className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10">
                        Ver Telemetria Completa
                      </Button>
                    </div>

                    {/* Fake Chart Lines */}
                    <div className="h-32 flex items-end gap-2 mt-auto relative z-20">
                      {Array.from({ length: 24 }).map((_, i) => {
                        let height = Math.random() * 100;
                        let color = 'bg-sky-500/20 hover:bg-sky-400';
                        
                        if (selectedEq.status === 'ocioso' && i > 18) { height = 5; color = 'bg-amber-500/20 hover:bg-amber-400'; }
                        if (selectedEq.status === 'manutencao') { height = 0; }

                        return (
                          <div key={i} className="flex-1 flex flex-col justify-end group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ duration: 1, delay: i * 0.05 }}
                              className={`w-full rounded-t-sm ${color} transition-colors cursor-pointer relative`}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                                {height > 10 ? 'Ativo' : 'Ocioso'}
                              </div>
                            </motion.div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Alerta de IA se Ocioso/Manutencao */}
                    {(selectedEq.status === 'ocioso' || selectedEq.status === 'manutencao') && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute inset-x-4 bottom-4 p-4 rounded-xl backdrop-blur-xl border ${selectedEq.status === 'ocioso' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'} z-30 flex items-center justify-between shadow-2xl`}
                      >
                        <div className="flex items-center gap-3">
                          <ShieldAlert className={`h-6 w-6 ${selectedEq.status === 'ocioso' ? 'text-amber-500' : 'text-red-500'}`} />
                          <div>
                            <p className={`font-bold ${selectedEq.status === 'ocioso' ? 'text-amber-400' : 'text-red-400'}`}>
                              {selectedEq.status === 'ocioso' ? 'Alerta de Ociosidade (IA)' : 'Alerta de Manutenção Crítica'}
                            </p>
                            <p className="text-sm text-slate-300 mt-0.5">
                              {selectedEq.status === 'ocioso' 
                                ? 'Equipamento parado há 5 horas no Pátio Norte. Recomendada realocação ou devolução para locadora.'
                                : 'Falha na bomba hidráulica detectada pelos sensores IoT. Equipe mecânica notificada.'}
                            </p>
                          </div>
                        </div>
                        {selectedEq.status === 'ocioso' && (
                          <Button className="bg-amber-600 hover:bg-amber-500 text-white shadow-none shrink-0">
                            Solicitar Desmobilização
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
