'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BrainCircuit, Scale, Search, ShieldCheck, AlertTriangle, TrendingUp,
  Clock, MapPin, Target, Gavel, Filter, FileText, ChevronRight, BarChart3,
  Map, Crosshair, Sparkles, BookOpen
} from 'lucide-react';

interface JudgeData {
  id: string;
  name: string;
  court: string;
  winRate: number;
  avgTimeDays: number;
  hostilityIndex: 'Baixo' | 'Médio' | 'Alto';
  profile: { proConsumer: number; proCompany: number; strictlyLegalistic: number };
}

const mockJudges: JudgeData[] = [
  {
    id: '1', name: 'Dr. Arthur Mendes', court: '4ª Vara Cível - SP', winRate: 78, avgTimeDays: 142, hostilityIndex: 'Baixo',
    profile: { proConsumer: 30, proCompany: 60, strictlyLegalistic: 90 },
    favoriteArguments: ['Dano moral objetivo', 'Teoria do Risco do Empreendimento']
  },
  {
    id: '2', name: 'Dra. Helena Carvalho', court: '2ª Vara do Trabalho - RJ', winRate: 45, avgTimeDays: 280, hostilityIndex: 'Alto',
    profile: { proConsumer: 85, proCompany: 15, strictlyLegalistic: 40 },
    favoriteArguments: ['Inversão do ônus da prova', 'Princípio da proteção']
  },
  {
    id: '3', name: 'Dr. Roberto Silveira', court: '1ª Vara Empresarial - MG', winRate: 92, avgTimeDays: 95, hostilityIndex: 'Baixo',
    profile: { proConsumer: 20, proCompany: 80, strictlyLegalistic: 85 },
    favoriteArguments: ['Pacta sunt servanda', 'Boa-fé objetiva']
  }
];

const hostileCourts = [
  { court: '2ª Vara do Trabalho - RJ', risk: 94, issue: 'Altíssima incidência de inversão do ônus da prova e condenações por dano moral em massa.' },
  { court: '8ª Vara Cível - BA', risk: 88, issue: 'Tempo médio de julgamento 3x superior à média nacional. Sentenças pró-consumidor frequentes.' },
  { court: '15ª Vara do Consumidor - SP', risk: 82, issue: 'Rigor extremo com grandes corporações. Ignora frequentemente a boa-fé objetiva da empresa.' },
];

export default function JurimetriaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeJudge, setActiveJudge] = useState<JudgeData | null>(null);
  const [activeTab, setActiveTab] = useState<'perfil' | 'previsibilidade' | 'jurisprudencia' | 'varas'>('perfil');
  const [mounted, setMounted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [caseDescription, setCaseDescription] = useState('');

  useEffect(() => {
    setMounted(true);
    setActiveJudge(mockJudges[0]);
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const found = mockJudges.find(j => j.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (found) setActiveJudge(found);
    }, 1500);
  };

  const handlePredict = () => {
    if (!caseDescription) return;
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Jurimetria Preditiva" imagePath="/images/jurimetria_b2b.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-sky-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-900/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-sky-400/70 hover:text-sky-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <BrainCircuit className="h-10 w-10 text-sky-500" />
                Jurimetria <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Preditiva</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Mapeamento estatístico e perfil decisório de magistrados. Preveja resultados e estruture defesas blindadas por dados.
              </p>
            </div>
          </div>

          {/* Core Navigation */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md w-full lg:w-fit">
            {[
              { id: 'perfil', label: 'Análise de Perfil', icon: Target },
              { id: 'previsibilidade', label: 'Previsibilidade de Ganho', icon: TrendingUp },
              { id: 'jurisprudencia', label: 'Jurisprudência Matadora', icon: BookOpen },
              { id: 'varas', label: 'Varas Hostis', icon: AlertTriangle },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-sky-600 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            
            {/* 1. Análise de Perfil Decisório por Juiz */}
            {activeTab === 'perfil' && (
              <motion.div key="perfil" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input 
                        placeholder="Buscar Juiz ou Magistrado..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="bg-slate-950/50 border-white/10 pl-10 text-white h-12"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4" /> Alvos Mapeados
                  </h3>
                  <div className="space-y-3">
                    {mockJudges.map(judge => (
                      <div 
                        key={judge.id}
                        onClick={() => setActiveJudge(judge)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                          activeJudge?.id === judge.id 
                            ? 'bg-sky-900/20 border-sky-500/50 shadow-[0_0_30px_rgba(14,165,233,0.15)]' 
                            : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <h4 className="font-bold text-white text-lg">{judge.name}</h4>
                        <p className="text-sm text-slate-400 mt-1">{judge.court}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  {isAnalyzing ? (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-white/5 rounded-3xl">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                        <BrainCircuit className="h-16 w-16 text-sky-500 mb-6" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white">Mapeando Perfil Decisório...</h3>
                    </div>
                  ) : activeJudge && (
                    <>
                      <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-black text-white">{activeJudge.name}</h2>
                          <p className="text-lg text-sky-400 mt-1 flex items-center gap-2"><MapPin className="h-4 w-4" /> {activeJudge.court}</p>
                        </div>
                        <Badge className={`px-4 py-2 text-sm ${activeJudge.hostilityIndex === 'Baixo' ? 'bg-emerald-500/10 text-emerald-400' : activeJudge.hostilityIndex === 'Alto' ? 'bg-pink-500/10 text-pink-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          Hostilidade: {activeJudge.hostilityIndex}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl">
                          <h3 className="text-sm font-bold text-slate-500 uppercase mb-6">Tendências Decisórias</h3>
                          <div className="space-y-6">
                            {[
                              { label: 'Pró-Consumidor/Trabalhador', value: activeJudge.profile.proConsumer, color: 'bg-pink-500' },
                              { label: 'Pró-Empresa (B2B)', value: activeJudge.profile.proCompany, color: 'bg-sky-500' },
                              { label: 'Estritamente Legalista', value: activeJudge.profile.strictlyLegalistic, color: 'bg-emerald-500' },
                            ].map(tend => (
                              <div key={tend.label}>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-white font-medium">{tend.label}</span>
                                  <span className="text-slate-400">{tend.value}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${tend.value}%` }} className={`h-full ${tend.color}`} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl flex flex-col justify-center text-center relative overflow-hidden group">
                           <div className="absolute inset-0 bg-sky-900/10 group-hover:bg-sky-900/20 transition-colors" />
                           <Clock className="h-12 w-12 text-sky-400 mx-auto mb-4 relative z-10" />
                           <h3 className="text-5xl font-black text-white relative z-10">{activeJudge.avgTimeDays} <span className="text-2xl text-slate-400 font-normal">dias</span></h3>
                           <p className="text-slate-400 mt-2 font-medium relative z-10">Tempo médio até a sentença</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* 2. Previsibilidade Estatística de Ganho */}
            {activeTab === 'previsibilidade' && (
              <motion.div key="previsibilidade" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto space-y-8">
                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <BarChart3 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Simulador de Probabilidade</h2>
                      <p className="text-slate-400 mt-1">Descreva o objeto da ação e a IA calculará a chance de êxito cruzando dados estatísticos do juízo selecionado.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Objeto / Resumo do Caso</label>
                      <textarea 
                        className="w-full h-32 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                        placeholder="Ex: Ação de indenização por quebra de contrato de fornecimento (B2B). O fornecedor não entregou no prazo estipulado na cláusula 4..."
                        value={caseDescription}
                        onChange={(e) => setCaseDescription(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handlePredict}
                      disabled={isAnalyzing || !caseDescription}
                      className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-xl transition-all"
                    >
                      {isAnalyzing ? 'Calculando Probabilidades...' : 'Calcular Probabilidade de Ganho'}
                    </Button>
                  </div>
                </div>

                {!isAnalyzing && caseDescription && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-900/40 border border-emerald-500/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="h-32 w-32 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Chance de Êxito Estimada</h3>
                      <p className="text-6xl font-black text-emerald-400 mb-6">84%</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Aderência com sentenças passadas: Alta</p>
                        <p className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Viés do Magistrado favorável à tese B2B</p>
                      </div>
                    </div>
                    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl flex flex-col justify-center text-center">
                      <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white">Risco Identificado</h3>
                      <p className="text-sm text-slate-400 mt-2">Pode haver condenação em honorários sucumbenciais se o pedido subsidiário for negado.</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 3. Sugestão de Jurisprudência Matadora */}
            {activeTab === 'jurisprudencia' && (
              <motion.div key="jurisprudencia" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-blue-400" /> Jurisprudência Matadora
                  </h2>
                  <p className="text-slate-400 mt-2 max-w-3xl">
                    A IA Nexus vasculhou mais de 4.000 processos do {activeJudge?.name || 'Magistrado'} e destilou os exatos argumentos jurídicos que ele mais acatou nos últimos 12 meses.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeJudge?.favoriteArguments.map((arg, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-colors group">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Aumenta chance em +22%</Badge>
                        <ShieldCheck className="h-6 w-6 text-slate-600 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">Tese: {arg}</h3>
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-sm text-slate-400 font-mono italic leading-relaxed">
                          "Trecho extraído (Sentença Processo nº 100XXXX-XX.2023.8.26): ...vez que a {arg} aplica-se incontestavelmente ao caso em tela, demonstrando a ausência de má-fé..."
                        </p>
                      </div>
                      <Button className="w-full mt-6 bg-slate-800 hover:bg-blue-600 text-white transition-colors">
                        Incorporar Tese na Minuta
                      </Button>
                    </div>
                  ))}
                  
                  {(!activeJudge?.favoriteArguments || activeJudge.favoriteArguments.length === 0) && (
                    <div className="col-span-2 text-center p-8 text-slate-500">Nenhum alvo selecionado na aba de perfil.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 4. Mapeamento de Varas Hostis */}
            {activeTab === 'varas' && (
              <motion.div key="varas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="sticky top-32 bg-slate-900/40 border border-pink-500/20 p-8 rounded-3xl text-center shadow-[0_0_40px_rgba(236,72,153,0.05)]">
                      <div className="h-20 w-20 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Crosshair className="h-10 w-10 text-pink-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Heatmap de Hostilidade</h2>
                      <p className="text-slate-400 text-sm">
                        Comarcas e Varas com histórico de condenações desproporcionais ou viés sistêmico contra corporações (B2B). Evite litigar nestes juízos sempre que possível.
                      </p>
                    </div>
                  </div>

                  <div className="md:w-2/3 space-y-4">
                    {hostileCourts.map((court, idx) => (
                      <div key={idx} className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-pink-500/30 transition-colors">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-pink-500" /> {court.court}
                          </h3>
                          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                            <strong className="text-slate-300">Motivo do Alerta:</strong> {court.issue}
                          </p>
                        </div>
                        <div className="text-center sm:text-right shrink-0">
                          <p className="text-xs font-bold text-slate-500 uppercase">Nível de Risco</p>
                          <p className="text-4xl font-black text-pink-500 mt-1">{court.risk}<span className="text-xl">/100</span></p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full h-14 border-white/10 text-white hover:bg-white/5">
                      Carregar Mapeamento Nacional Completo
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
