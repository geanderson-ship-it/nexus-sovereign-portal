'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, AlertOctagon, Activity, Scale, Clock, HeartHandshake, ShieldAlert, FileWarning, Search, Filter, ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface RiskAlert {
  id: string;
  department: string;
  employee: string;
  riskType: 'Burnout' | 'Assédio Moral' | 'Inconsistência de Ponto' | 'Desvio de Função';
  severity: 'Crítico' | 'Alto' | 'Médio';
  probability: number;
}

const mockAlerts: RiskAlert[] = [
  { id: '1', department: 'Logística', employee: 'João Silva', riskType: 'Inconsistência de Ponto', severity: 'Alto', probability: 82 },
  { id: '2', department: 'Comercial', employee: 'Mariana Costa', riskType: 'Burnout', severity: 'Crítico', probability: 94 },
  { id: '3', department: 'TI', employee: 'Roberto Alves', riskType: 'Desvio de Função', severity: 'Médio', probability: 65 },
  { id: '4', department: 'Operações', employee: 'Equipe Turno C', riskType: 'Assédio Moral', severity: 'Crítico', probability: 89 },
];

export default function TrabalhistaPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Prevenção Trabalhista" imagePath="/images/labor_b2b.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-pink-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-900/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-pink-400/70 hover:text-pink-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <Users className="h-10 w-10 text-pink-500" />
                Prevenção <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">Trabalhista</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Auditoria de ponto preditiva e mapa de calor de risco. Identifique e neutralize passivos antes que virem processos judiciais.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Passivo Mitigado (Mês)</p>
                <p className="text-2xl font-black text-emerald-400">R$ 1.250.000</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Metrics & Heatmap */}
            <div className="lg:col-span-4 space-y-8">
              
              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Scale className="h-32 w-32 text-pink-500" />
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <Activity className="h-5 w-5 text-pink-400" /> Índice de Risco Global
                </h3>
                <div className="flex items-end gap-4 mb-4">
                  <span className="text-6xl font-black text-amber-400">14%</span>
                  <span className="text-sm text-slate-400 pb-2">Risco Moderado</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full w-[14%] bg-amber-400" />
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  Baseado no cruzamento de 45.000 pontos batidos, comunicações corporativas e denúncias anônimas nos últimos 30 dias.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl text-center hover:bg-slate-800/50 transition-colors">
                  <Clock className="h-8 w-8 text-sky-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-white">412h</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Horas Extras Irregulares</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl text-center hover:bg-slate-800/50 transition-colors">
                  <HeartHandshake className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-white">3</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Acordos Sugeridos</p>
                </div>
              </div>

            </div>

            {/* Right Column: AI Alerts */}
            <div className="lg:col-span-8">
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden h-full">
                
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black/20">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="h-6 w-6 text-pink-500" /> Alertas Preditivos
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Possíveis litígios detectados pela IA</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input placeholder="Buscar colaborador/setor..." className="bg-slate-800/50 border-white/10 pl-9 text-sm h-10 w-full sm:w-64" />
                    </div>
                    <Button size="icon" variant="outline" className="h-10 w-10 border-white/10 bg-transparent text-slate-400 hover:text-white">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {mockAlerts.map(alert => (
                    <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900/60 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-pink-500/30 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border ${
                          alert.severity === 'Crítico' ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' :
                          alert.severity === 'Alto' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                          'bg-sky-500/10 border-sky-500/20 text-sky-500'
                        }`}>
                          <FileWarning className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-lg">{alert.employee}</h4>
                            <Badge variant="outline" className="bg-slate-800/50 border-white/10 text-slate-300">
                              {alert.department}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm mt-1">Risco Detectado: <span className="text-white font-medium">{alert.riskType}</span></p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="text-right flex-1 sm:flex-none">
                          <p className="text-xs font-bold text-slate-500 uppercase">Probabilidade</p>
                          <p className={`text-xl font-black ${
                            alert.probability > 90 ? 'text-pink-500' :
                            alert.probability > 70 ? 'text-amber-500' : 'text-sky-500'
                          }`}>{alert.probability}%</p>
                        </div>
                        <Button className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl">
                          Agir Agora
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
