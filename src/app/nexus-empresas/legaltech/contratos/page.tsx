'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Shield, CheckCircle, Clock, AlertCircle, FileSearch, PenTool,
  ArrowRight, Search, FileSignature, Filter, Settings, ShieldCheck, ChevronRight
} from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  type: string;
  status: 'Em Revisão IA' | 'Aguardando Assinatura' | 'Aprovado';
  riskScore: 'Baixo' | 'Médio' | 'Alto';
  date: string;
}

const mockContracts: Contract[] = [
  { id: '1', title: 'Contrato de Fornecimento de Aço', type: 'Fornecimento', status: 'Em Revisão IA', riskScore: 'Médio', date: 'Hoje, 10:30' },
  { id: '2', title: 'Acordo de Confidencialidade (NDA)', type: 'NDA', status: 'Aguardando Assinatura', riskScore: 'Baixo', date: 'Ontem, 15:45' },
  { id: '3', title: 'Prestação de Serviços TI', type: 'Serviços', status: 'Aprovado', riskScore: 'Baixo', date: '18/07/2026' },
  { id: '4', title: 'Fusão e Aquisição (M&A)', type: 'Societário', status: 'Em Revisão IA', riskScore: 'Alto', date: '17/07/2026' },
];

export default function ContratosPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'gerador'>('dashboard');
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Gestão de Contratos" imagePath="/images/contratos_b2b.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-emerald-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-emerald-400/70 hover:text-emerald-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <FileText className="h-10 w-10 text-emerald-500" />
                Gestão de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Contratos</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Esteira contratual automatizada por IA. Geração, auditoria de risco e fluxo de assinaturas unificados.
              </p>
            </div>

            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white'}`}
              >
                Dashboard CLM
              </button>
              <button 
                onClick={() => setActiveTab('gerador')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'gerador' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white'}`}
              >
                Gerador de Minutas
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Em Revisão IA', value: '24', icon: FileSearch, color: 'emerald' },
                    { label: 'Aguardando Assinatura', value: '12', icon: PenTool, color: 'sky' },
                    { label: 'Aprovados (Mês)', value: '156', icon: CheckCircle, color: 'emerald' },
                    { label: 'Risco Detectado', value: '3', icon: AlertCircle, color: 'pink' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <stat.icon className={`h-16 w-16 text-${stat.color}-500`} />
                      </div>
                      <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                      <p className="text-3xl font-black text-white mt-2">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Contracts List */}
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileSignature className="h-5 w-5 text-emerald-400" /> Fluxo Contratual Ativo
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input placeholder="Buscar contrato..." className="bg-slate-800/50 border-none pl-9 text-sm h-9 w-64" />
                      </div>
                      <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-slate-400 text-sm">
                          <th className="p-4 font-medium">Contrato</th>
                          <th className="p-4 font-medium">Tipo</th>
                          <th className="p-4 font-medium">Status IA</th>
                          <th className="p-4 font-medium">Risco</th>
                          <th className="p-4 font-medium">Última Atualização</th>
                          <th className="p-4 font-medium text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockContracts.map(contract => (
                          <tr key={contract.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="p-4 font-medium text-white">{contract.title}</td>
                            <td className="p-4 text-slate-400">{contract.type}</td>
                            <td className="p-4">
                              <Badge className={
                                contract.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                contract.status === 'Aguardando Assinatura' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }>
                                {contract.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${
                                  contract.riskScore === 'Alto' ? 'bg-pink-500' :
                                  contract.riskScore === 'Médio' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`} />
                                <span className={
                                  contract.riskScore === 'Alto' ? 'text-pink-400' :
                                  contract.riskScore === 'Médio' ? 'text-amber-400' : 'text-emerald-400'
                                }>{contract.riskScore}</span>
                              </div>
                            </td>
                            <td className="p-4 text-slate-400 text-sm">{contract.date}</td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                                Auditar <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="gerador"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
                  
                  <div className="text-center mb-10">
                    <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                      <ShieldCheck className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Gerador Neural de Minutas</h2>
                    <p className="text-slate-400 mt-2">Descreva os termos gerais e a IA redigirá o contrato juridicamente blindado.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tipo de Contrato</label>
                      <select className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none">
                        <option>Prestação de Serviços Específicos</option>
                        <option>Acordo de Confidencialidade (NDA)</option>
                        <option>Contrato de Fornecimento B2B</option>
                        <option>Mútuo Conversível</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Partes Envolvidas & Objeto</label>
                      <textarea 
                        className="w-full h-32 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none placeholder:text-slate-600"
                        placeholder="Ex: Contratante é a Nexus, contratada é a TechSolutions. Objeto: Desenvolvimento de API de pagamentos por R$ 50.000,00 divididos em 3 parcelas..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Cláusulas Críticas Exigidas</label>
                      <Input 
                        className="bg-slate-950/50 border border-white/10 rounded-xl h-12 text-white focus-visible:ring-0 focus-visible:border-emerald-500/50 placeholder:text-slate-600"
                        placeholder="Ex: Multa de 10% por atraso, foro de São Paulo, sigilo absoluto de dados..."
                      />
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <Button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all group"
                      >
                        {isGenerating ? (
                          <>Redigindo Cláusulas... <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="ml-2"><Settings className="h-5 w-5" /></motion.div></>
                        ) : (
                          <>Gerar Minuta Blindada <FileText className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" /></>
                        )}
                      </Button>
                    </div>
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
