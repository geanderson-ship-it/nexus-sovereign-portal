'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle, Smartphone, Map, ListTodo, Wrench, MessageSquare, 
  CheckCircle2, Clock, MapPin, Search, Plus, ChevronRight, User
} from 'lucide-react';

interface Chamado {
  id: string;
  unidade: string;
  cliente: string;
  assunto: string;
  status: 'aberto' | 'em_andamento' | 'resolvido';
  tempo: string;
}

const mockChamados: Chamado[] = [
  { id: 'AST-1042', unidade: 'Torre A - Apto 402', cliente: 'Roberto Alves', assunto: 'Pintura descascando na varanda', status: 'aberto', tempo: 'Há 2h' },
  { id: 'AST-1041', unidade: 'Torre B - Apto 101', cliente: 'Camila Silva', assunto: 'Porta do banheiro raspando', status: 'em_andamento', tempo: 'Há 1d' },
  { id: 'AST-1039', unidade: 'Torre A - Apto 805', cliente: 'Marcos Mendes', assunto: 'Vazamento no sifão da cozinha', status: 'resolvido', tempo: 'Há 3d' },
];

export default function VistoriaPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'assistencia' | 'checklist'>('assistencia');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Vistoria de Entrega" imagePath="/images/vistoria_const.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-pink-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] bg-pink-900/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-pink-400/70 hover:text-pink-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <CheckCircle className="h-10 w-10 text-pink-500" />
                Vistoria de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">Entrega</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                O fim da fricção na entrega das chaves. Painel do proprietário, checklist digital e roteirização inteligente de assistência técnica.
              </p>
            </div>
            
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('assistencia')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'assistencia' ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'text-slate-400 hover:text-white'}`}
              >
                <Map className="h-4 w-4" /> Roteirização de AST
              </button>
              <button 
                onClick={() => setActiveTab('checklist')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'checklist' ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'text-slate-400 hover:text-white'}`}
              >
                <ListTodo className="h-4 w-4" /> Checklist de Handover
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            
            {/* ABA 1: ROTEIRIZAÇÃO DE ASSISTÊNCIA TÉCNICA */}
            {activeTab === 'assistencia' && (
              <motion.div key="assistencia" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Simulador App do Proprietario */}
                <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-[50px]" />
                  
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 w-full">
                    <Smartphone className="h-5 w-5 text-pink-400" /> App do Proprietário
                  </h3>

                  {/* Mobile Mockup */}
                  <div className="w-[280px] h-[550px] bg-slate-950 rounded-[40px] border-[6px] border-slate-800 p-4 relative shadow-2xl flex flex-col">
                     {/* Notch */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl" />
                     
                     <div className="mt-8 flex items-center justify-between mb-6">
                       <div>
                         <p className="text-[10px] text-slate-400 uppercase">Olá,</p>
                         <p className="font-bold text-white">Roberto Alves</p>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                         <User className="h-4 w-4 text-pink-400" />
                       </div>
                     </div>

                     <div className="bg-pink-600 rounded-2xl p-4 mb-6 shadow-[0_5px_20px_rgba(236,72,153,0.3)] relative overflow-hidden group cursor-pointer hover:bg-pink-500 transition-colors">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                       <p className="font-bold text-white flex items-center gap-2 relative z-10">
                         <Plus className="h-4 w-4" /> Novo Chamado
                       </p>
                       <p className="text-xs text-pink-100 mt-1 relative z-10">Tirar foto de não conformidade</p>
                     </div>

                     <p className="text-xs font-bold text-slate-400 uppercase mb-3">Meus Chamados</p>
                     
                     <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                       <div className="bg-slate-900 rounded-xl p-3 border border-pink-500/30">
                         <div className="flex justify-between items-start mb-2">
                           <span className="text-[10px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded uppercase font-bold">Em Análise</span>
                           <span className="text-[9px] text-slate-500">Há 2h</span>
                         </div>
                         <p className="text-sm font-bold text-white">Pintura descascando na varanda</p>
                         <p className="text-[10px] text-slate-400 mt-1">A equipe técnica (João) fará a visita amanhã às 14:00.</p>
                       </div>
                       <div className="bg-slate-900 rounded-xl p-3 border border-white/5 opacity-60">
                         <div className="flex justify-between items-start mb-2">
                           <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold">Resolvido</span>
                         </div>
                         <p className="text-sm font-bold text-white line-through decoration-slate-500">Piso trincado na sala</p>
                       </div>
                     </div>

                     <div className="mt-auto pt-4 flex justify-around border-t border-white/5">
                        <MessageSquare className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer" />
                        <MapPin className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer" />
                        <CheckCircle className="h-5 w-5 text-pink-500 cursor-pointer" />
                     </div>
                  </div>
                </div>

                {/* Dashboard Construtora (Kanban) */}
                <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-pink-500" /> Roteirização Inteligente (Construtora)
                    </h3>
                    <div className="flex bg-slate-950 rounded-lg p-1 border border-white/5">
                      <Search className="h-4 w-4 text-slate-500 m-2" />
                      <input type="text" placeholder="Filtrar por unidade..." className="bg-transparent text-sm text-white focus:outline-none w-40" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-6">
                    A IA agrupa automaticamente os chamados por andar/bloco e cria a melhor rota para o técnico, economizando até 40% do tempo de deslocamento no condomínio.
                  </p>

                  {/* Kanban Simples */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    
                    {/* Coluna: Abertos */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Abertos</span>
                        <Badge className="bg-pink-500/10 text-pink-400 border-none">1</Badge>
                      </div>
                      <div className="space-y-3">
                        {mockChamados.filter(c => c.status === 'aberto').map(c => (
                          <div key={c.id} className="bg-slate-900 border border-pink-500/30 p-3 rounded-xl cursor-grab hover:border-pink-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] text-pink-400 font-mono">{c.id}</span>
                              <span className="text-[9px] text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {c.tempo}</span>
                            </div>
                            <p className="text-xs font-bold text-white mb-1">{c.assunto}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.unidade}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Coluna: Em Andamento */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Em Rota (Técnicos)</span>
                        <Badge className="bg-amber-500/10 text-amber-400 border-none">1</Badge>
                      </div>
                      <div className="space-y-3">
                        {mockChamados.filter(c => c.status === 'em_andamento').map(c => (
                          <div key={c.id} className="bg-slate-900 border border-amber-500/30 p-3 rounded-xl cursor-grab hover:border-amber-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] text-amber-400 font-mono">{c.id}</span>
                              <span className="text-[9px] text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {c.tempo}</span>
                            </div>
                            <p className="text-xs font-bold text-white mb-1">{c.assunto}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.unidade}</p>
                            <div className="mt-2 pt-2 border-t border-white/5">
                              <p className="text-[9px] text-slate-500 uppercase">Técnico Atribuído</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-5 h-5 rounded-full bg-slate-700" />
                                <span className="text-[10px] font-bold text-white">João (Pintura)</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Coluna: Resolvidos */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Resolvidos</span>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none">1</Badge>
                      </div>
                      <div className="space-y-3">
                        {mockChamados.filter(c => c.status === 'resolvido').map(c => (
                          <div key={c.id} className="bg-slate-900 border border-emerald-500/30 p-3 rounded-xl opacity-70">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] text-emerald-400 font-mono">{c.id}</span>
                            </div>
                            <p className="text-xs font-bold text-white mb-1 line-through decoration-slate-500">{c.assunto}</p>
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Cliente Assinou
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

            {/* ABA 2: CHECKLIST DIGITAL */}
            {activeTab === 'checklist' && (
              <motion.div key="checklist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 min-h-[500px]">
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-10">
                    <ListTodo className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">Checklist Digital de Handover</h2>
                    <p className="text-slate-400">Digitalize a vistoria de entrega de chaves. O engenheiro e o cliente percorrem todos os cômodos aprovando itens em um tablet, com assinatura digital nativa ao final.</p>
                  </div>
                  
                  <div className="bg-slate-950 rounded-2xl border border-white/5 p-6 mb-6">
                    <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Cômodo: Cozinha</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div>
                          <p className="font-bold text-white text-sm">Torneiras e Sifões</p>
                          <p className="text-xs text-slate-400">Teste de vazão e estanqueidade.</p>
                        </div>
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                        <div>
                          <p className="font-bold text-white text-sm">Revestimento (Paredes)</p>
                          <p className="text-xs text-slate-400">Busca por peças trincadas ou oca.</p>
                        </div>
                        <Button size="sm" variant="destructive" className="bg-pink-600 text-white hover:bg-pink-700">Registrar Ressalva</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button className="bg-pink-600 hover:bg-pink-500 text-white rounded-xl h-12 px-8 font-bold">
                      Concluir Vistoria & Gerar Termo
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </SovereignShowcase>
  );
}
