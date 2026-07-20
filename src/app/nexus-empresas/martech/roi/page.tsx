'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, TrendingUp, DollarSign, Activity, ChevronRight, 
  Download, PieChart, BarChart3, Target, ArrowUpRight, ShieldCheck
} from 'lucide-react';

export default function ROIPage() {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<'geral' | 'canais'>('geral');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Business Intelligence (ROI)" imagePath="/images/martech_content.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-teal-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px]" />
          {/* Tech Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-teal-400/70 hover:text-teal-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <LineChart className="h-10 w-10 text-teal-500" />
                Auditoria de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600">ROI (B.I.)</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                O coração financeiro do marketing. Centralize o LTV, o CAC e veja o lucro real gerado por cada campanha, provado em relatórios blindados.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 h-12 rounded-xl">
                 <Download className="h-4 w-4 mr-2" /> Exportar Relatório PDF
              </Button>
            </div>
          </div>

          {/* Metric Bar (Hero Numbers) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-teal-500/30 transition-colors">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                 <DollarSign className="h-24 w-24 text-teal-500" />
               </div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-10">Receita Atribuída (Mês)</p>
               <h2 className="text-5xl font-black text-white mb-2 relative z-10">R$ 4.2M</h2>
               <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 relative z-10">
                 <ArrowUpRight className="h-3 w-3 mr-1" /> +18.4% vs Mês Ant.
               </Badge>
             </div>

             <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                 <TrendingUp className="h-24 w-24 text-emerald-500" />
               </div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-10">R.O.I Consolidado</p>
               <h2 className="text-5xl font-black text-white mb-2 relative z-10">682%</h2>
               <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 relative z-10">
                 Para cada R$1, retornam R$6,82
               </Badge>
             </div>

             <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-sky-500/30 transition-colors">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Target className="h-24 w-24 text-sky-500" />
               </div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-10">LTV / CAC Ratio</p>
               <h2 className="text-5xl font-black text-white mb-2 relative z-10">8.4x</h2>
               <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 relative z-10">
                 Altamente Saudável (> 3.0x ideal)
               </Badge>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Gráfico Principal (Esquerda) */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 relative z-20">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-teal-400" /> Crescimento de Receita vs AdSpend
                </h3>
                <div className="flex bg-slate-950 rounded-lg p-1 border border-white/5">
                  <button className="px-3 py-1 text-xs font-bold bg-slate-800 text-white rounded shadow">Mês</button>
                  <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-white">Trimestre</button>
                  <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-white">Ano</button>
                </div>
              </div>

              {/* Fake Graph Line Chart */}
              <div className="flex-1 flex items-end gap-2 relative z-10 min-h-[250px] mb-4">
                 {/* Y-Axis labels */}
                 <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-slate-600 font-mono pr-4 z-0">
                   <span>R$ 5M</span>
                   <span>R$ 2.5M</span>
                   <span>R$ 0</span>
                 </div>
                 
                 {/* Grid lines */}
                 <div className="absolute left-12 right-0 top-0 bottom-8 flex flex-col justify-between z-0">
                   <div className="border-b border-white/5 w-full"></div>
                   <div className="border-b border-white/5 w-full"></div>
                   <div className="border-b border-white/5 w-full"></div>
                 </div>

                 {/* Bars (Blue: Revenue, Teal: Spend) */}
                 <div className="absolute left-12 right-0 top-0 bottom-8 flex items-end justify-between px-4 z-20">
                   {[
                     { rev: 30, spnd: 10, label: 'Jan' },
                     { rev: 45, spnd: 12, label: 'Fev' },
                     { rev: 40, spnd: 15, label: 'Mar' },
                     { rev: 65, spnd: 18, label: 'Abr' },
                     { rev: 85, spnd: 22, label: 'Mai' },
                     { rev: 95, spnd: 24, label: 'Jun' },
                   ].map((data, i) => (
                     <div key={i} className="flex flex-col items-center gap-2 group w-full relative">
                        <div className="w-full max-w-[40px] flex items-end justify-center gap-1 h-[200px]">
                           <motion.div initial={{ height: 0 }} animate={{ height: `${data.spnd}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="w-1/2 bg-teal-500/40 rounded-t-sm" />
                           <motion.div initial={{ height: 0 }} animate={{ height: `${data.rev}%` }} transition={{ duration: 1.2, delay: i * 0.1 }} className="w-1/2 bg-sky-500 rounded-t-sm group-hover:bg-sky-400 transition-colors relative" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{data.label}</span>
                        
                        {/* Tooltip on hover */}
                        <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 p-2 rounded shadow-2xl z-30 pointer-events-none whitespace-nowrap">
                          <p className="text-[10px] text-slate-400 mb-1">Performance ({data.label})</p>
                          <p className="text-xs text-white font-bold"><span className="text-teal-400 inline-block w-2 h-2 rounded-full mr-1"></span> Custo: R$ {(data.spnd * 4).toFixed(0)}k</p>
                          <p className="text-xs text-white font-bold"><span className="text-sky-500 inline-block w-2 h-2 rounded-full mr-1"></span> Vendas: R$ {(data.rev * 50).toFixed(0)}k</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="flex items-center gap-6 justify-center text-sm font-bold border-t border-white/5 pt-4">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-sky-500"></span> Receita Gerada</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-teal-500/40"></span> Investimento AdSpend</span>
              </div>
            </div>

            {/* Painel de Origem e Auditoria (Direita) */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[40px]" />
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-sky-400" /> Origem da Receita
                </h3>
                
                <div className="space-y-4">
                  {[
                    { source: 'Inbound (SEO + Conteúdo)', perc: '45%', val: 'R$ 1.89M', color: 'bg-sky-500' },
                    { source: 'Outbound (LinkedIn Ads)', perc: '35%', val: 'R$ 1.47M', color: 'bg-teal-500' },
                    { source: 'Referral (Parceiros)', perc: '15%', val: 'R$ 630k', color: 'bg-emerald-500' },
                    { source: 'Meta Ads (Remarketing)', perc: '5%', val: 'R$ 210k', color: 'bg-purple-500' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-300">{item.source}</span>
                        <span className="text-white">{item.val}</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: item.perc }} transition={{ duration: 1, delay: i * 0.2 }} className={`h-full ${item.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-900/20 to-emerald-900/10 border border-teal-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(20,184,166,0.05)]">
                 <div className="flex items-start gap-4">
                   <div className="p-3 bg-teal-500/20 rounded-xl">
                     <ShieldCheck className="h-6 w-6 text-teal-400" />
                   </div>
                   <div>
                     <h4 className="font-bold text-teal-400 text-lg">Auditoria Preditiva OK</h4>
                     <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                       A integridade dos dados foi verificada. Não há discrepância entre as vendas declaradas no CRM e a receita capturada no Google Analytics 4.
                     </p>
                   </div>
                 </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
