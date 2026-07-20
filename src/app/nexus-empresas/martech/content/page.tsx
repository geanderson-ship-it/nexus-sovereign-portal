'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, PenTool, Image as ImageIcon, Video, Send, 
  Copy, FileText, CheckCircle2, ChevronRight, Wand2
} from 'lucide-react';

export default function ContentPage() {
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'copy' | 'roteiro' | 'design'>('copy');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 2500);
  };

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Automação de Conteúdo" imagePath="/images/martech_content.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-violet-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-900/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-900/10 rounded-full blur-[120px]" />
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-violet-400/70 hover:text-violet-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <Sparkles className="h-10 w-10 text-violet-500" />
                Automação <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-600">Criativa (Djeny)</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Seu motor de copy e design em escala. Gere roteiros, artigos persuasivos e peças gráficas de altíssima conversão em segundos.
              </p>
            </div>
            
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
               <div className="px-6 py-2 flex flex-col items-center justify-center border-r border-white/5">
                 <p className="text-[10px] text-slate-500 uppercase font-bold">Tom de Voz</p>
                 <p className="text-sm font-black text-violet-400">Corporativo Agressivo</p>
               </div>
               <div className="px-6 py-2 flex flex-col items-center justify-center">
                 <p className="text-[10px] text-slate-500 uppercase font-bold">Campanhas Geradas</p>
                 <p className="text-sm font-black text-white">142 (Este Mês)</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Esquerda: O Briefing / Prompt */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[40px]" />
              
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <PenTool className="h-5 w-5 text-violet-400" /> Briefing Express
              </h2>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">O que estamos vendendo?</label>
                  <div className="p-3 bg-slate-950 rounded-xl border border-white/10 text-sm text-white">
                    Novo Software de Gestão Logística (WMS)
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Público-Alvo</label>
                  <div className="p-3 bg-slate-950 rounded-xl border border-white/10 text-sm text-white">
                    Diretores de Supply Chain e CEOs de distribuidoras
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Dor Principal a explorar</label>
                  <textarea 
                    className="w-full bg-slate-950 rounded-xl border border-white/10 p-3 text-sm text-slate-300 resize-none h-24 focus:outline-none focus:border-violet-500/50 transition-colors"
                    defaultValue="O estoque está parado, a frota está ociosa e eles estão perdendo dinheiro porque os processos são manuais e os dados não se cruzam."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Canais de Destino</label>
                  <div className="flex gap-2">
                    <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">LinkedIn Ads</Badge>
                    <Badge className="bg-slate-800 text-slate-400 border-white/5">E-mail Frio</Badge>
                    <Badge className="bg-slate-800 text-slate-400 border-white/5">Vídeo de Vendas (VSL)</Badge>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || showResult}
                className="w-full mt-8 bg-violet-600 hover:bg-violet-500 text-white font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              >
                {isGenerating ? (
                   <span className="flex items-center gap-2">
                     <Wand2 className="h-5 w-5 animate-spin" /> Processando Criativos...
                   </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> Gerar Campanha Completa
                  </span>
                )}
              </Button>
            </div>

            {/* Direita: Output Gerado */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div 
                    key="empty" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-full bg-slate-900/20 border border-white/5 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                  >
                    <Wand2 className="h-16 w-16 text-violet-500/20 mb-4" />
                    <h3 className="text-xl font-bold text-slate-300">Aguardando Briefing</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">
                      Envie as diretrizes e a Djeny irá escrever toda a copy persuasiva e gerar os criativos visuais alinhados com o seu manual de marca.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result" 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-950 border border-violet-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)] flex flex-col h-full"
                  >
                    {/* Tab Menu */}
                    <div className="flex bg-black/40 p-2 border-b border-white/5">
                      <button 
                        onClick={() => setActiveTab('copy')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'copy' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        <FileText className="h-4 w-4" /> Copy (LinkedIn)
                      </button>
                      <button 
                        onClick={() => setActiveTab('roteiro')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'roteiro' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        <Video className="h-4 w-4" /> Roteiro VSL
                      </button>
                      <button 
                        onClick={() => setActiveTab('design')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'design' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        <ImageIcon className="h-4 w-4" /> Design Gerado
                      </button>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                      <AnimatePresence mode="wait">
                        
                        {/* COPY CONTENT */}
                        {activeTab === 'copy' && (
                          <motion.div key="copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Taxa de Conversão Estimada: ALTA</Badge>
                              <Button size="icon" variant="outline" className="h-8 w-8 border-white/10 text-slate-400 hover:text-white hover:bg-white/10">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="prose prose-invert prose-violet max-w-none">
                              <p className="text-white text-lg">
                                Você sabe exatamente quanto dinheiro sua distribuidora perdeu hoje com caminhões parados no pátio? ⏳🚛
                              </p>
                              <p className="text-slate-300">
                                A maioria dos Diretores de Supply Chain acha que o problema é falta de frota. Não é. O problema é que o seu armazém não se comunica com a expedição.
                              </p>
                              <p className="text-slate-300">
                                Conheça o <strong>Nexus WMS Logístico</strong>.
                              </p>
                              <ul className="text-slate-300">
                                <li>Roteirização neural de entregas.</li>
                                <li>Alocação inteligente de docas.</li>
                                <li>Fim da ociosidade invisível.</li>
                              </ul>
                              <p className="text-white font-bold">
                                Pare de pagar horas extras desnecessárias. Clique no link abaixo e solicite um mapeamento do seu pátio. 👇
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* ROTEIRO CONTENT */}
                        {activeTab === 'roteiro' && (
                          <motion.div key="roteiro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                              <p className="text-[10px] text-violet-400 font-bold uppercase mb-1">Cena 1 (0:00 - 0:05) [Gancho/Atenção]</p>
                              <p className="text-sm text-slate-300"><span className="text-white font-bold">Visual:</span> Galpão escuro, pilhas de caixas desorganizadas, caminhões parados lá fora.</p>
                              <p className="text-sm text-slate-300 mt-1"><span className="text-white font-bold">Locução (Direta):</span> "O seu maior ralo financeiro não é o preço do diesel. É o tempo que sua carga passa parada nessa doca."</p>
                            </div>
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                              <p className="text-[10px] text-violet-400 font-bold uppercase mb-1">Cena 2 (0:05 - 0:15) [Agitação do Problema]</p>
                              <p className="text-sm text-slate-300"><span className="text-white font-bold">Visual:</span> Zoom no rosto estressado do gerente de logística olhando pranchetas.</p>
                              <p className="text-sm text-slate-300 mt-1"><span className="text-white font-bold">Locução:</span> "Tentar gerenciar milhares de SKUs e dezenas de rotas com processos manuais é garantia de atraso e multas contratuais."</p>
                            </div>
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                              <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Cena 3 (0:15 - 0:30) [Solução]</p>
                              <p className="text-sm text-slate-300"><span className="text-white font-bold">Visual:</span> Transição fluida para o painel do Nexus WMS brilhando em azul, caminhões se movendo rapidamente em timelapse.</p>
                              <p className="text-sm text-slate-300 mt-1"><span className="text-white font-bold">Locução:</span> "Com a arquitetura preditiva Nexus, docas são alocadas antes mesmo do caminhão chegar. O fluxo nunca para."</p>
                            </div>
                          </motion.div>
                        )}

                        {/* DESIGN CONTENT */}
                        {activeTab === 'design' && (
                          <motion.div key="design" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center">
                            <div className="w-full max-w-sm aspect-[4/5] bg-gradient-to-br from-slate-900 to-black rounded-2xl border border-violet-500/30 overflow-hidden relative shadow-2xl group cursor-pointer">
                               {/* Mock Image Content */}
                               <img src="/images/portos.jpeg" alt="Background Logistica" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                               
                               <div className="absolute bottom-0 left-0 right-0 p-8">
                                 <Badge className="bg-violet-600 text-white border-none mb-4">NEXUS WMS</Badge>
                                 <h4 className="text-2xl font-black text-white leading-tight tracking-tighter mb-2">
                                   FIM DA<br/>SINDROME DO<br/><span className="text-violet-400">PÁTIO CHEIO.</span>
                                 </h4>
                                 <p className="text-xs text-slate-400">Inteligência Logística para operações de alto volume.</p>
                               </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Formato otimizado para LinkedIn (1080x1350px)</p>
                          </motion.div>
                        )}

                      </AnimatePresence>
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
