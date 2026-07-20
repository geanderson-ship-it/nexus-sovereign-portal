'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, BarChart, Target, DollarSign, ChevronRight, 
  Globe, LayoutGrid, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface Campaign {
  id: string;
  nome: string;
  plataforma: 'Google Ads' | 'LinkedIn' | 'Meta Ads';
  status: 'otimizando' | 'pausada' | 'escalando';
  roas: string;
  cpl: string;
  acaoIA: string;
}

const mockCampaigns: Campaign[] = [
  { id: 'CMP-A1', nome: 'Lançamento WMS (Diretores)', plataforma: 'LinkedIn', status: 'escalando', roas: '4.2x', cpl: 'R$ 84', acaoIA: '+30% budget alocado (Alta conversão)' },
  { id: 'CMP-A2', nome: 'Search - Termos Logística', plataforma: 'Google Ads', status: 'otimizando', roas: '2.1x', cpl: 'R$ 112', acaoIA: 'Lances reduzidos em palavras-chave amplas' },
  { id: 'CMP-A3', nome: 'Remarketing - Visitantes Pátio', plataforma: 'Meta Ads', status: 'pausada', roas: '0.8x', cpl: 'R$ 340', acaoIA: 'Pausada: CPL excedeu teto máximo de R$250' },
];

export default function AdsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedPlataform, setSelectedPlataform] = useState<'Todas' | 'Google' | 'LinkedIn'>('Todas');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Tráfego Inteligente" imagePath="/images/martech_content.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-fuchsia-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[10%] w-[50%] h-[50%] bg-fuchsia-900/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.05)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-fuchsia-400/70 hover:text-fuchsia-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <Target className="h-10 w-10 text-fuchsia-500" />
                Tráfego <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600">Inteligente</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Seu orçamente operado por inteligência preditiva. A IA remaneja verbas em tempo real entre plataformas para garantir o menor CAC possível.
              </p>
            </div>
            
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              {['Todas', 'Google', 'LinkedIn'].map(p => (
                <button 
                  key={p}
                  onClick={() => setSelectedPlataform(p as any)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedPlataform === p ? 'bg-fuchsia-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { title: 'Budget Consumido (Mês)', value: 'R$ 84.5k', sub: 'de R$ 100k', icon: DollarSign, color: 'fuchsia' },
               { title: 'Custo por Lead (CPL)', value: 'R$ 108', sub: '-14% vs Mês Anterior', icon: TrendingUp, color: 'emerald', subIcon: ArrowDownRight },
               { title: 'ROAS Global', value: '3.4x', sub: 'Retorno sobre AdSpend', icon: LayoutGrid, color: 'sky', subIcon: ArrowUpRight },
               { title: 'Leads Qualificados (MQL)', value: '782', sub: '+22% vs Mês Anterior', icon: Globe, color: 'purple', subIcon: ArrowUpRight },
             ].map((m, i) => (
               <div key={i} className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-2">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{m.title}</p>
                   <div className={`p-2 rounded-lg bg-${m.color}-500/10`}>
                     <m.icon className={`h-4 w-4 text-${m.color}-500`} />
                   </div>
                 </div>
                 <div>
                   <p className="text-2xl font-black text-white">{m.value}</p>
                   <p className={`text-xs mt-1 flex items-center gap-1 ${m.subIcon === ArrowDownRight ? 'text-emerald-400' : 'text-slate-400'}`}>
                     {m.subIcon && <m.subIcon className="h-3 w-3" />} {m.sub}
                   </p>
                 </div>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Gráfico de Alocação (Esquerda) */}
            <div className="lg:col-span-1 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col relative overflow-hidden">
              <h2 className="font-bold text-white mb-6 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-fuchsia-400" /> Alocação de Budget
              </h2>
              
              <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
                {/* Simulated Chart Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-blue-400">LinkedIn Ads</span>
                      <span className="text-white">55%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '55%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-blue-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-emerald-400">Google Ads</span>
                      <span className="text-white">35%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-purple-400">Meta Ads</span>
                      <span className="text-white">10%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-purple-500" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-fuchsia-900/20 border border-fuchsia-500/30 rounded-xl mt-4">
                  <p className="text-xs text-fuchsia-400 font-bold uppercase mb-1 flex items-center gap-1"><Zap className="h-3 w-3" /> Ação Predominante</p>
                  <p className="text-sm text-slate-300">
                    IA detectou CPL menor no LinkedIn Ads para o segmento "Diretores" e transferiu <strong className="text-white">20% da verba</strong> do Meta Ads para otimizar ROAS.
                  </p>
                </div>
              </div>
            </div>

            {/* Ações da IA por Campanha (Direita) */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-fuchsia-500" /> Intervenções da Inteligência Artificial
                </h2>
                <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20">Últimas 24h</Badge>
              </div>

              <div className="space-y-4 flex-1">
                {mockCampaigns.map((camp, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={camp.id} 
                    className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant="outline" className={`
                          ${camp.status === 'escalando' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : ''}
                          ${camp.status === 'otimizando' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : ''}
                          ${camp.status === 'pausada' ? 'border-red-500/30 text-red-400 bg-red-500/10' : ''}
                        `}>
                          {camp.status.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono">{camp.plataforma}</span>
                      </div>
                      <p className="text-base font-bold text-white">{camp.nome}</p>
                    </div>

                    <div className="flex gap-6 items-center">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">ROAS</p>
                        <p className="text-sm font-black text-white">{camp.roas}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">CPL</p>
                        <p className="text-sm font-black text-white">{camp.cpl}</p>
                      </div>
                      
                      <div className={`p-3 rounded-xl border max-w-[200px] w-full ${
                          camp.status === 'escalando' ? 'bg-emerald-900/20 border-emerald-500/30' :
                          camp.status === 'pausada' ? 'bg-red-900/20 border-red-500/30' :
                          'bg-amber-900/20 border-amber-500/30'
                      }`}>
                        <p className="text-[9px] uppercase font-bold mb-0.5 flex items-center gap-1 opacity-70">
                          {camp.status === 'pausada' ? <AlertTriangle className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                          Decisão da IA
                        </p>
                        <p className="text-xs font-medium text-slate-300 leading-tight">
                          {camp.acaoIA}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
