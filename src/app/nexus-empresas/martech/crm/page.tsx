'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, Briefcase, TrendingUp, ChevronRight, 
  Phone, Mail, Calendar, MessageSquare, AlertCircle, 
  BrainCircuit, ShieldCheck, CheckCircle2
} from 'lucide-react';

interface Deal {
  id: string;
  empresa: string;
  contato: string;
  cargo: string;
  valor: string;
  probabilidade: number;
  estagio: 'prospeccao' | 'reuniao' | 'proposta' | 'negociacao';
  proximaAcao: string;
  dicaIA: string;
}

const mockDeals: Deal[] = [
  { id: 'DL-01', empresa: 'Logística Nacional S.A', contato: 'Marcos Freitas', cargo: 'CEO', valor: 'R$ 450.000', probabilidade: 88, estagio: 'negociacao', proximaAcao: 'Follow-up Contrato', dicaIA: 'Tomador de decisão focado em ROI a curto prazo. Ofereça 5% de desconto no setup.' },
  { id: 'DL-02', empresa: 'Construtora Apex', contato: 'Luciana Mendes', cargo: 'Diretora de Operações', valor: 'R$ 1.200.000', probabilidade: 65, estagio: 'proposta', proximaAcao: 'Revisão Escopo', dicaIA: 'Preocupação com integração de sistemas antigos. Mostre o módulo de API nativa.' },
  { id: 'DL-03', empresa: 'TechFarm Agro', contato: 'Roberto Silva', cargo: 'CTO', valor: 'R$ 180.000', probabilidade: 42, estagio: 'reuniao', proximaAcao: 'Demo Agendada', dicaIA: 'Perfil técnico. Aprofunde em arquitetura cloud e segurança de dados.' },
  { id: 'DL-04', empresa: 'Varejo Express', contato: 'Amanda Souza', cargo: 'Gerente Logística', valor: 'R$ 85.000', probabilidade: 92, estagio: 'prospeccao', proximaAcao: 'Qualificação', dicaIA: 'Lead muito aquecido (clicou 3x no e-mail). Ligue hoje!' },
];

export default function CRMPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    setMounted(true);
    // Pre-select the highest probability deal
    setSelectedDeal(mockDeals.find(d => d.id === 'DL-01') || null);
  }, []);

  if (!mounted) return null;

  const renderEstagio = (estagio: string, title: string) => (
    <div className="flex-1 bg-slate-900/30 border border-white/5 rounded-2xl p-4 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <Badge className="bg-indigo-500/10 text-indigo-400 border-none">
          {mockDeals.filter(d => d.estagio === estagio).length}
        </Badge>
      </div>
      
      <div className="flex-1 space-y-3">
        {mockDeals.filter(d => d.estagio === estagio).map((deal) => (
          <motion.div 
            layoutId={deal.id}
            key={deal.id}
            onClick={() => setSelectedDeal(deal)}
            className={`bg-slate-950 p-4 rounded-xl border cursor-pointer hover:border-indigo-500/50 transition-all ${selectedDeal?.id === deal.id ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/10'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-indigo-400 font-mono font-bold">{deal.id}</span>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${deal.probabilidade > 80 ? 'bg-emerald-500/20 text-emerald-400' : deal.probabilidade > 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                {deal.probabilidade}% Win
              </div>
            </div>
            <p className="font-bold text-white text-sm mb-1">{deal.empresa}</p>
            <p className="text-xs text-slate-400 mb-2">{deal.contato}</p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
              <span className="text-sm font-black text-white">{deal.valor}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <SovereignShowcase moduleName="CRM Preditivo" imagePath="/images/martech_content.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-indigo-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-indigo-400/70 hover:text-indigo-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <Users className="h-10 w-10 text-indigo-500" />
                CRM <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-600">Preditivo</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Pipeline de vendas com inteligência artificial. Saiba exatamente a probabilidade de fechamento de cada negócio e receba insights de negociação.
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="p-4 bg-slate-900/50 rounded-2xl border border-indigo-500/20 backdrop-blur-md">
                 <p className="text-xs font-bold text-slate-500 uppercase">Forecast (Mês)</p>
                 <p className="text-2xl font-black text-white mt-1">R$ 1.8M</p>
               </div>
               <div className="p-4 bg-slate-900/50 rounded-2xl border border-indigo-500/20 backdrop-blur-md">
                 <p className="text-xs font-bold text-slate-500 uppercase">Win Rate (IA)</p>
                 <p className="text-2xl font-black text-indigo-400 mt-1">68.2%</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Kanban Board (Esquerda) */}
            <div className="xl:col-span-8 flex gap-4 overflow-x-auto custom-scrollbar pb-4">
              {renderEstagio('prospeccao', 'Qualificação')}
              {renderEstagio('reuniao', 'Reuniões')}
              {renderEstagio('proposta', 'Propostas')}
              {renderEstagio('negociacao', 'Negociação')}
            </div>

            {/* Painel de Deal Detalhado (Direita) */}
            <div className="xl:col-span-4">
              <AnimatePresence mode="wait">
                {selectedDeal && (
                  <motion.div
                    key={selectedDeal.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 flex flex-col h-full backdrop-blur-xl relative overflow-hidden"
                  >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px]" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-3">{selectedDeal.id}</Badge>
                          <h2 className="text-2xl font-black text-white leading-tight">{selectedDeal.empresa}</h2>
                          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> {selectedDeal.valor}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 mb-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-white">
                          {selectedDeal.contato.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{selectedDeal.contato}</p>
                          <p className="text-xs text-slate-500">{selectedDeal.cargo}</p>
                        </div>
                        <div className="ml-auto flex gap-2">
                          <button className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-colors text-slate-400"><Mail className="h-4 w-4" /></button>
                          <button className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-slate-400"><Phone className="h-4 w-4" /></button>
                        </div>
                      </div>

                      {/* AI Negotiator Insight */}
                      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/10 border border-indigo-500/30 rounded-2xl p-5 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.05)]">
                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                          <BrainCircuit className="h-4 w-4" /> Insight do Negociador IA
                        </h3>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {selectedDeal.dicaIA}
                        </p>
                        <div className="mt-4 pt-4 border-t border-indigo-500/20 flex items-center justify-between">
                           <span className="text-xs text-slate-400">Probabilidade de Fechamento:</span>
                           <span className={`text-sm font-black ${selectedDeal.probabilidade > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{selectedDeal.probabilidade}%</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Próximos Passos</h3>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Calendar className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{selectedDeal.proximaAcao}</p>
                            <p className="text-xs text-slate-400 mt-1">Sugerido pela IA baseado no tempo médio de estágio.</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-2 gap-3">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 shadow-none">
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Ganhar
                        </Button>
                        <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-12">
                          <AlertCircle className="h-4 w-4 mr-2" /> Perder
                        </Button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
