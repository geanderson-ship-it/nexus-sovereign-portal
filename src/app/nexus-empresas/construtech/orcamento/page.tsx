'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Database, Search, Filter, TrendingDown, Package, FileCheck, RefreshCw, Layers,
  Calculator, HardHat, TrendingUp, ChevronRight, CheckCircle2, AlertTriangle, Building2
} from 'lucide-react';

interface Insumo {
  id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  menorPreco: number;
  fornecedor: string;
  variacao: number;
}

const mockInsumos: Insumo[] = [
  { id: '1', codigo: 'AC-50', descricao: 'Aço CA-50 10.0mm', quantidade: 45000, unidade: 'kg', menorPreco: 4.85, fornecedor: 'Gerdau Direto', variacao: -2.5 },
  { id: '2', codigo: 'CM-CP', descricao: 'Cimento CP-II 32', quantidade: 12000, unidade: 'sc', menorPreco: 32.50, fornecedor: 'Votorantim', variacao: 1.2 },
  { id: '3', codigo: 'B-01', descricao: 'Bloco Estrutural 14x19x39', quantidade: 85000, unidade: 'un', menorPreco: 1.85, fornecedor: 'Cerâmica São João', variacao: -5.4 },
  { id: '4', codigo: 'CB-10', descricao: 'Cabo Flexível 10mm²', quantidade: 4500, unidade: 'm', menorPreco: 4.15, fornecedor: 'Prysmian', variacao: 0.0 },
];

export default function OrcamentoPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'bim' | 'cotacao'>('bim');
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setActiveTab('cotacao');
    }, 2500);
  };

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Orçamento Preditivo" imagePath="/images/orcamento_const.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-emerald-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-emerald-400/70 hover:text-emerald-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <Database className="h-10 w-10 text-emerald-500" />
                Orçamento <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Preditivo</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Extração automática de quantitativos via projeto BIM e cotação preditiva com IA.
              </p>
            </div>
            
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('bim')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'bim' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white'}`}
              >
                <Layers className="h-4 w-4" /> Leitura BIM
              </button>
              <button 
                onClick={() => setActiveTab('cotacao')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'cotacao' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white'}`}
              >
                <Calculator className="h-4 w-4" /> Cotação & Curva S
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Orçamento Base', value: 'R$ 14.2M', icon: Building2, color: 'emerald' },
              { title: 'Economia Projetada', value: 'R$ 840k', icon: TrendingDown, color: 'sky' },
              { title: 'Itens Cotados', value: '1,245', icon: Package, color: 'amber' },
              { title: 'Precisão BIM', value: '99.8%', icon: CheckCircle2, color: 'violet' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-800/40 transition-colors">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 w-fit mb-4`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.title}</p>
                  <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            
            {/* ABA 1: LEITURA BIM */}
            {activeTab === 'bim' && (
              <motion.div key="bim" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Visualizador 3D Mock */}
                <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col min-h-[500px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Layers className="h-5 w-5 text-emerald-400" /> Visualizador Estrutural (IFC)
                    </h2>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">Torre A - Estrutura</Badge>
                  </div>
                  
                  <div className="flex-1 rounded-2xl border border-white/10 bg-slate-950 relative overflow-hidden flex items-center justify-center group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] opacity-10" />
                    
                    {/* Fake 3D Wireframe */}
                    <div className="relative w-64 h-80 border-2 border-emerald-500/30 skew-y-12 skew-x-[-15deg] group-hover:rotate-6 transition-all duration-1000">
                      <div className="absolute inset-0 border-2 border-emerald-500/30 -translate-y-10 translate-x-10" />
                      <div className="absolute inset-0 border-2 border-emerald-500/30 translate-y-10 -translate-x-10" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <HardHat className="h-16 w-16 text-emerald-500/20" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                      <span className="text-xs font-mono text-emerald-400">modelo_estrutural_v4.ifc</span>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Painel de Ação */}
                <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-2">Motor de Extração</h2>
                  <p className="text-sm text-slate-400 mb-8">
                    A IA vai mapear todas as paredes, vigas e lajes do modelo IFC e traduzir em quantitativos exatos de insumos (Cimento, Aço, Areia, Blocos).
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="p-4 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-sm text-slate-300">Elementos Detectados</span>
                      <span className="font-bold text-emerald-400">18.492</span>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-sm text-slate-300">Nível de Detalhe (LOD)</span>
                      <span className="font-bold text-white">350</span>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-sm text-slate-300">Conflitos Geométricos</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> 0</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      onClick={handleExtract}
                      disabled={isExtracting}
                      className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      {isExtracting ? (
                        <>Processando Nuvem de Pontos... <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="ml-2"><RefreshCw className="h-5 w-5" /></motion.div></>
                      ) : (
                        <>Extrair Insumos Automático <Calculator className="ml-2 h-5 w-5" /></>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ABA 2: COTAÇÃO E INSUMOS */}
            {activeTab === 'cotacao' && (
              <motion.div key="cotacao" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileCheck className="h-6 w-6 text-emerald-500" /> Cotação Inteligente de Insumos
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">Comparativo de preços nos maiores fornecedores B2B com IA de barganha.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input placeholder="Buscar material..." className="bg-slate-800/50 border-white/10 pl-9 text-sm h-10 w-full sm:w-64" />
                      </div>
                      <Button size="icon" variant="outline" className="h-10 w-10 border-white/10 bg-transparent text-slate-400 hover:text-white">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/20 text-slate-400 text-sm border-b border-white/5">
                          <th className="p-5 font-medium uppercase tracking-wider text-xs">Cód / Material</th>
                          <th className="p-5 font-medium uppercase tracking-wider text-xs text-right">Qtde (BIM)</th>
                          <th className="p-5 font-medium uppercase tracking-wider text-xs text-right">Menor Preço Unit.</th>
                          <th className="p-5 font-medium uppercase tracking-wider text-xs">Melhor Fornecedor</th>
                          <th className="p-5 font-medium uppercase tracking-wider text-xs text-right">Tendência de Preço</th>
                          <th className="p-5 font-medium uppercase tracking-wider text-xs text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockInsumos.map(insumo => (
                          <tr key={insumo.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="p-5">
                              <p className="font-bold text-white">{insumo.descricao}</p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">{insumo.codigo}</p>
                            </td>
                            <td className="p-5 text-right font-medium text-slate-300">
                              {insumo.quantidade.toLocaleString()} <span className="text-slate-500">{insumo.unidade}</span>
                            </td>
                            <td className="p-5 text-right font-black text-emerald-400">
                              R$ {insumo.menorPreco.toFixed(2)}
                            </td>
                            <td className="p-5">
                              <Badge variant="outline" className="bg-slate-800/50 border-white/10 text-slate-300">
                                {insumo.fornecedor}
                              </Badge>
                            </td>
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {insumo.variacao < 0 ? (
                                  <TrendingDown className="h-4 w-4 text-emerald-500" />
                                ) : insumo.variacao > 0 ? (
                                  <TrendingUp className="h-4 w-4 text-pink-500" />
                                ) : (
                                  <div className="h-1 w-4 bg-slate-500 rounded-full" />
                                )}
                                <span className={
                                  insumo.variacao < 0 ? 'text-emerald-500 font-bold' : 
                                  insumo.variacao > 0 ? 'text-pink-500 font-bold' : 'text-slate-500'
                                }>
                                  {Math.abs(insumo.variacao)}%
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">vs 30 dias</p>
                            </td>
                            <td className="p-5 text-center">
                              <Button size="sm" className="bg-slate-800 hover:bg-emerald-600 text-white transition-colors">
                                Disparar Pedido
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-6 bg-black/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <p className="text-sm text-amber-400">Aço CA-50 com tendência de alta global. A IA recomenda compra antecipada em 15 dias.</p>
                    </div>
                    <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                      Exportar Curva S (Excel)
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
