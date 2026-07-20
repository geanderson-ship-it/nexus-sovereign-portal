'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye, Mic, Camera, FileText, Download, Calendar, Sun, Users, Activity,
  Clock, AlertCircle, ChevronRight, CheckCircle2, Play, Pause, Waves
} from 'lucide-react';

export default function DiarioPage() {
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Diário de Obra IA" imagePath="/images/diario_const.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-emerald-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-emerald-400/70 hover:text-emerald-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <Eye className="h-10 w-10 text-emerald-500" />
                Diário de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Obra IA</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Fim do RDO manual. O engenheiro envia áudio e foto pelo WhatsApp e a IA redige, analisa o avanço físico e alerta atrasos.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Torre Horizon Norte</p>
                <p className="text-lg font-black text-white flex items-center justify-end gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" /> Hoje, 18:30
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Esquerda: Simulador do App/Campo */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="bg-slate-950 p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <span className="font-black text-emerald-400">ER</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Engenheiro Residente</h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Em campo (Off-line Sync)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6 bg-slate-900/60 min-h-[500px]">
                
                {/* User Input - Photo */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-emerald-900/20 border border-emerald-500/30 p-2 rounded-2xl rounded-tr-none">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-emerald-500/20">
                      <img src="/images/laje_concreto_diario.jpg" alt="Canteiro" className="object-cover w-full h-full opacity-60 grayscale" />
                      <div className="absolute inset-0 bg-emerald-900/30 mix-blend-overlay" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Badge className="bg-black/60 text-emerald-300 border-white/10"><Camera className="h-3 w-3 mr-1" /> Imagem Capturada</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Input - Audio */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-emerald-900/40 border border-emerald-500/30 p-4 rounded-2xl rounded-tr-none shadow-lg">
                    <div className="flex items-center gap-4 mb-2">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black hover:scale-105 transition-transform"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 flex items-center gap-1">
                         {Array.from({ length: 15 }).map((_, i) => (
                           <motion.div 
                             key={i} 
                             animate={{ height: isPlaying ? [4, 16, 8, 20, 4][i % 5] : 4 }}
                             transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                             className="w-1 bg-emerald-400 rounded-full" 
                           />
                         ))}
                      </div>
                      <span className="text-xs font-mono text-emerald-300">0:45</span>
                    </div>
                    <p className="text-xs text-emerald-100/70 italic leading-relaxed pt-2 border-t border-emerald-500/20">
                      "Finalizamos a concretagem da laje do 4º pavimento no prazo. O tempo ficou ensolarado o dia todo. Ponto crítico: a equipe da elétrica terceirizada não compareceu para passar os conduítes na alvenaria do 3º andar, o que pode atrasar o gesso amanhã..."
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl"
                >
                  {isGenerating ? 'Processando Linguagem Natural...' : 'Gerar RDO Oficial'}
                </Button>

              </div>
            </div>

            {/* Direita: RDO Estruturado */}
            <div className="lg:col-span-7">
              <motion.div 
                animate={{ opacity: isGenerating ? 0.5 : 1 }}
                className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col"
              >
                {/* Cabecalho PDF Form */}
                <div className="bg-slate-100 p-6 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-emerald-600" />
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Relatório Diário de Obra (RDO)</h2>
                      <p className="text-sm font-bold text-slate-500">Documento Oficial • Gerado por IA</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-200">
                    <Download className="h-4 w-4 mr-2" /> PDF
                  </Button>
                </div>

                <div className="p-8 space-y-8 flex-1">
                  
                  {/* Grid de Condicoes */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Clima</p>
                      <p className="text-lg font-black text-slate-700 flex items-center gap-2 mt-1">
                        <Sun className="h-5 w-5 text-amber-500" /> Ensolarado
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Efetivo Fixo</p>
                      <p className="text-lg font-black text-slate-700 flex items-center gap-2 mt-1">
                        <Users className="h-5 w-5 text-sky-500" /> 42 Op.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                      <p className="text-xs font-bold text-red-400 uppercase">Terceirizados</p>
                      <p className="text-lg font-black text-red-700 flex items-center gap-2 mt-1">
                        Falta: Elétrica
                      </p>
                    </div>
                  </div>

                  {/* Atividades */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-600" /> Atividades Concluídas
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">Concretagem da Laje (4º Pavimento)</p>
                          <p className="text-sm text-slate-600">Avanço físico atualizado no cronograma BIM. 100% executado conforme projeto estrutural.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alertas IA */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" /> Alertas da Inteligência Preditiva
                    </h3>
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <p className="font-bold text-red-700">Risco de Atraso em Cadeia (Efeito Dominó)</p>
                      <p className="text-sm text-red-600/80 mt-1">
                        A ausência da equipe de elétrica no 3º andar impacta diretamente a frente de Gesso programada para amanhã.
                      </p>
                      <div className="mt-4 pt-4 border-t border-red-200/50 flex items-center justify-between">
                         <span className="text-xs font-bold text-red-700 uppercase">Ação Recomendada pela IA</span>
                         <Button size="sm" variant="destructive" className="bg-red-600 text-white hover:bg-red-700 shadow-none">
                           Remanejar Gesseiros para 2º Andar
                         </Button>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
