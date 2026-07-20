'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Palette, BrainCircuit, Type, FileText, ChevronRight, CheckCircle2, 
  Sparkles, Hexagon, Fingerprint, Crosshair, BarChart3, Download
} from 'lucide-react';

export default function BrandPage() {
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowManual(true);
    }, 2500);
  };

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Estratégia de Marca" imagePath="/images/martech_brand.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-pink-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-900/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[120px]" />
          {/* Subtle dots pattern for a design vibe */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(236,72,153,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-pink-400/70 hover:text-pink-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <Palette className="h-10 w-10 text-pink-500" />
                Estratégia de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">Marca B2B</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Posicionamento guiado por IA. Análise semântica da concorrência e geração de Identidade Visual de altíssima autoridade corporativa.
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="p-4 bg-slate-900/50 rounded-2xl border border-pink-500/20 backdrop-blur-md">
                 <p className="text-xs font-bold text-slate-500 uppercase">Arquétipo Dominante</p>
                 <p className="text-2xl font-black text-white mt-1">O Soberano</p>
               </div>
               <div className="p-4 bg-slate-900/50 rounded-2xl border border-pink-500/20 backdrop-blur-md">
                 <p className="text-xs font-bold text-slate-500 uppercase">Brand Equity Score</p>
                 <p className="text-2xl font-black text-pink-400 mt-1">94/100</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Esquerda: Análise e Inputs */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Box de IA de Mercado */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-pink-500/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[40px]" />
                
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <BrainCircuit className="h-5 w-5 text-pink-400" /> Análise Semântica
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Concorrentes Analisados</p>
                    <div className="flex flex-wrap gap-2">
                      {['TOTVS', 'SAP', 'Senior', 'Sankhya'].map(c => (
                        <Badge key={c} variant="outline" className="border-pink-500/20 text-slate-300 bg-pink-500/5">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Tom de Voz Identificado (Gap de Mercado)</p>
                    <p className="text-sm font-medium text-white italic">"Sofisticado, Direto, Tecnológico e Inquestionável."</p>
                  </div>
                  
                  <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-500 font-bold uppercase">Mapeamento de Palavras-Chave</p>
                      <Crosshair className="h-4 w-4 text-pink-500" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-emerald-400">Predição</span>
                      <span className="text-xs text-pink-400">Poder</span>
                      <span className="text-xs text-sky-400">Controle</span>
                      <span className="text-xs text-amber-400">Lucro</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || showManual}
                  className="w-full mt-6 bg-pink-600 hover:bg-pink-500 text-white font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                >
                  {isGenerating ? (
                     <span className="flex items-center gap-2">
                       <Sparkles className="h-5 w-5 animate-spin" /> Sintetizando Identidade...
                     </span>
                  ) : showManual ? (
                     <span className="flex items-center gap-2">
                       <CheckCircle2 className="h-5 w-5" /> Marca Gerada com Sucesso
                     </span>
                  ) : (
                    'Gerar Identidade Visual B2B'
                  )}
                </Button>
              </div>
            </div>

            {/* Direita: Output Visual */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {!showManual ? (
                  <motion.div 
                    key="empty" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-full bg-slate-900/20 border border-white/5 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                  >
                    <Hexagon className="h-16 w-16 text-pink-500/20 mb-4" />
                    <h3 className="text-xl font-bold text-slate-300">Aguardando Parâmetros</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">
                      Inicie a análise semântica para que a inteligência artificial construa o Moodboard e as diretrizes da marca corporativa.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="manual" 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-950 border border-pink-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.1)] flex flex-col"
                  >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="h-6 w-6 text-pink-500" />
                        <div>
                          <h2 className="text-lg font-black text-white uppercase tracking-widest">Manual da Marca</h2>
                          <p className="text-xs text-pink-400">Versão 1.0 • Gerado via Nexus AI</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10">
                        <Download className="h-4 w-4 mr-2" /> Baixar PDF
                      </Button>
                    </div>

                    <div className="p-8 space-y-10">
                      
                      {/* Paleta de Cores */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Palette className="h-4 w-4" /> Paleta de Cores (Soberania)
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { hex: '#020617', name: 'Void Black', fg: 'text-white' },
                            { hex: '#1E293B', name: 'Corporate Slate', fg: 'text-white' },
                            { hex: '#00D4FF', name: 'Nexus Cyan', fg: 'text-black' },
                            { hex: '#EC4899', name: 'Power Pink', fg: 'text-white' }
                          ].map(color => (
                            <div key={color.hex} className="space-y-2">
                              <div className="h-24 rounded-2xl shadow-inner border border-white/10 flex items-end p-3" style={{ backgroundColor: color.hex }}>
                                <span className={`text-[10px] font-mono font-bold ${color.fg}`}>{color.hex}</span>
                              </div>
                              <p className="text-xs font-bold text-slate-300 text-center">{color.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tipografia */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Type className="h-4 w-4" /> Tipografia Primária
                        </h3>
                        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <p className="text-3xl font-black text-white tracking-tighter">Inter / Roboto</p>
                              <p className="text-sm text-slate-500 mt-1">Sânscrita Geométrica. Transmite clareza e solidez.</p>
                            </div>
                            <Badge className="bg-slate-800 text-slate-300">Google Fonts</Badge>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="pb-4 border-b border-white/5">
                              <p className="text-[10px] text-pink-400 font-mono mb-1">Header 1 (Black 900)</p>
                              <h1 className="text-4xl font-black text-white tracking-tighter">INOVAÇÃO SOBERANA</h1>
                            </div>
                            <div>
                              <p className="text-[10px] text-pink-400 font-mono mb-1">Paragraph (Regular 400)</p>
                              <p className="text-base font-normal text-slate-400 leading-relaxed">
                                A tipografia de corpo deve ser sempre legível e elegante, priorizando tons de cinza (slate-400) sobre fundos extremamente escuros para reduzir a fadiga visual.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Promessa de Marca */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <FileText className="h-4 w-4" /> Promessa e Tagline
                        </h3>
                        <div className="bg-gradient-to-br from-pink-900/20 to-transparent border border-pink-500/20 rounded-2xl p-6 relative overflow-hidden">
                          <Sparkles className="absolute top-4 right-4 h-24 w-24 text-pink-500/10" />
                          <p className="text-xs text-pink-400 font-bold uppercase mb-2">Tagline (Assinatura)</p>
                          <p className="text-2xl font-black text-white italic tracking-tight mb-4">"Aonde a Inovação encontra a Excelência."</p>
                          
                          <p className="text-xs text-pink-400 font-bold uppercase mb-2">Brand Promise</p>
                          <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                            Garantir controle absoluto, auditoria impecável e superioridade tecnológica B2B, permitindo que líderes tomem decisões baseadas em dados irrefutáveis.
                          </p>
                        </div>
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
