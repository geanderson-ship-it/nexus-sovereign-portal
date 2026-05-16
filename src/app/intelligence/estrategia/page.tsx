'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BrainCircuit, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  ChevronLeft, 
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Activity,
  Award,
  Sparkles,
  PlusCircle,
  BarChart3,
  FileCheck,
  Users,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

export default function EstrategiaPage() {
  const [activeTab, setActiveTab] = useState('estrategia');
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isHomologated, setIsHomologated] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-12 relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* HERO SECTION */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 overflow-hidden rounded-[48px] bg-gradient-to-br from-slate-900 via-slate-900/50 to-[#020617] border border-white/5 shadow-2xl"
      >
          <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-16">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                  <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                  >
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                          <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest italic">
                              Executive Command Center
                          </Badge>
                          <div className="h-[1px] w-12 bg-violet-500/30" />
                      </div>
                      <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-headline uppercase leading-none">
                          Sala de <span className="text-violet-400 italic">Controle</span>
                      </h1>
                      <p className="text-lg lg:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                          Inteligência estratégica e mentoria executiva para líderes de elite. 
                          Onde a visão corporativa se transforma em execução auditável.
                      </p>
                  </motion.div>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md">
                          <BrainCircuit className="h-8 w-8 text-violet-400" />
                          <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dante Advisor</p>
                              <p className="text-sm font-bold text-white uppercase tracking-tighter">MODO ESTRATEGA</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md">
                          <TrendingUp className="h-8 w-8 text-emerald-500" />
                          <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance Global</p>
                              <p className="text-sm font-bold text-emerald-400 uppercase tracking-tighter">ALTA (+12.4%)</p>
                          </div>
                      </div>
                  </div>
              </div>

              <motion.div 
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative w-full lg:w-[450px] aspect-square group"
              >
                  <div className="absolute inset-0 bg-violet-500/20 blur-[80px] rounded-full group-hover:bg-violet-500/30 transition-all duration-700" />
                  <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                      <Image 
                          src="https://i.postimg.cc/yYzj12fW/Nexus-Intelligence-estrategia-e-lideranca.png"
                          alt="Estratégia e Liderança"
                          fill
                          className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Dante Strategic AI</span>
                              <Badge className="bg-violet-500 text-white border-none font-black text-[9px]">ACTIVE</Badge>
                          </div>
                      </div>
                  </div>
              </motion.div>
          </div>
      </motion.div>

      {/* TABS NAVIGATION */}
      <Tabs defaultValue="estrategia" onValueChange={setActiveTab} className="w-full space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <TabsList className="bg-slate-900/60 border border-white/5 p-1 rounded-2xl h-14">
                <TabsTrigger value="estrategia" className="rounded-xl data-[state=active]:bg-violet-600 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-8 h-full transition-all">
                    <Globe className="h-4 w-4 mr-2" /> Estratégia
                </TabsTrigger>
                <TabsTrigger value="planejamento" className="rounded-xl data-[state=active]:bg-violet-600 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-8 h-full transition-all">
                    <Target className="h-4 w-4 mr-2" /> Planejamento
                </TabsTrigger>
                <TabsTrigger value="auditoria" className="rounded-xl data-[state=active]:bg-violet-600 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-8 h-full transition-all">
                    <ShieldCheck className="h-4 w-4 mr-2" /> Auditoria
                </TabsTrigger>
            </TabsList>

            <Button variant="ghost" asChild className="text-slate-500 hover:text-white group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl px-6 h-12">
                <Link href="/intelligence">
                    <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Voltar ao Hub
                </Link>
            </Button>
        </div>

        {/* ESTRATÉGIA TAB */}
        <TabsContent value="estrategia" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Dante Strategic Advisor */}
                <Card className="lg:col-span-2 bg-zinc-950/60 border-2 border-violet-500/20 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5 bg-violet-500/5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                    <Sparkles className="h-8 w-8 text-violet-400" /> Dante Estratégico
                                </CardTitle>
                                <CardDescription className="text-violet-500/60 font-bold uppercase text-[10px] tracking-widest">IA de Mentoria Executiva</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 italic text-slate-300 leading-relaxed relative">
                            <div className="absolute -top-4 -left-4 p-3 bg-violet-600 rounded-2xl shadow-xl shadow-violet-600/20">
                                <BrainCircuit className="h-5 w-5 text-white" />
                            </div>
                            "Comandante, analisei o cenário atual. A expansão da capacidade produtiva em 15% nos próximos 6 meses é viável, mas exige um realinhamento imediato do Índice de Mérito das células de engenharia. A estratégia ideal foca em automação assistida por IA para manter o custo marginal sob controle."
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-violet-400">Pilar: Visão Nexus</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Consolidar a soberania tecnológica através de uma equipe de elite e processos auditáveis em tempo real.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-violet-400">Pilar: Liderança</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Desenvolver líderes que não apenas gerenciam tarefas, mas que inspiram a evolução humana através da tecnologia.
                                </p>
                            </div>
                        </div>

                        <Button className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-600/20 transition-all">
                            Consultar Protocolo de Decisão
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <Card className="bg-zinc-950/60 border-2 border-white/5 backdrop-blur-md rounded-[40px] p-8 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Métrica de Liderança</p>
                            <h3 className="text-2xl font-black text-white italic">Health Score Global</h3>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <svg className="h-24 w-24 transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset="45" className="text-violet-500" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-white">82%</div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-slate-400">Nível de alinhamento estratégico das gerências.</p>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px]">ZONA DE EXCELÊNCIA</Badge>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-zinc-950/60 border-2 border-white/5 backdrop-blur-md rounded-[40px] p-8 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-rose-500" /> Pontos de Atenção
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                <Lock className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-slate-400">O gargalo no setor de pintura está impactando o roadmap do Q3.</p>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                <Activity className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-slate-400">Índice de Mérito médio em queda na célula de logística.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </TabsContent>

        {/* PLANEJAMENTO TAB */}
        <TabsContent value="planejamento" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { label: 'Market Share', value: '34%', progress: 85, color: 'text-violet-400', bar: 'bg-violet-600' },
                    { label: 'Eficiência Op.', value: '92%', progress: 92, color: 'text-emerald-400', bar: 'bg-emerald-600' },
                    { label: 'Projeção 6m', value: '+15%', progress: 75, color: 'text-amber-400', bar: 'bg-amber-600' },
                    { label: 'Inovação/P&D', value: '18%', progress: 60, color: 'text-blue-400', bar: 'bg-blue-600' },
                    { label: 'Retenção Elite', value: '98%', progress: 98, color: 'text-indigo-400', bar: 'bg-indigo-600' },
                ].map((stat) => (
                    <Card key={stat.label} className="bg-zinc-950/60 border border-white/5 p-6 space-y-4 rounded-[32px] group hover:border-violet-500/30 transition-all">
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                          {stat.label === 'Projeção 6m' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setIsSourceModalOpen(true)}
                              className="h-6 w-6 p-0 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-end justify-between">
                            <p className={cn("text-2xl font-black italic", stat.color)}>{stat.value}</p>
                            <TrendingUp className="h-5 w-5 text-slate-600" />
                        </div>
                        <Progress value={stat.progress} className={cn("h-1", stat.bar)} />
                        {stat.label === 'Projeção 6m' && (
                          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter cursor-pointer hover:text-amber-500 transition-colors" onClick={() => setIsSourceModalOpen(true)}>
                            Ver Memorial de Cálculo →
                          </p>
                        )}
                    </Card>
                ))}
            </div>

            <Card className="bg-zinc-950/60 border-2 border-white/5 rounded-[40px] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                    <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-violet-400" /> Roadmap de Expansão Nexus 2024
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="relative space-y-8">
                        <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-white/5" />
                        
                        {[
                            { q: 'Q1', title: 'Domínio Regional', desc: 'Consolidação do Dante Safra no Sul do país.', status: 'completed' },
                            { q: 'Q2', title: 'Expansão Industrial', desc: 'Lançamento do Nexus Builder para indústrias pesadas.', status: 'current' },
                            { q: 'Q3', title: 'Nexus Global', desc: 'Internacionalização do portal e suporte multi-idioma.', status: 'pending' },
                            { q: 'Q4', title: 'Intelligence v6', desc: 'Integração total de visão computacional em tempo real.', status: 'pending' },
                        ].map((item) => (
                            <div key={item.q} className="relative pl-12">
                                <div className={cn(
                                    "absolute left-0 top-1 h-8 w-8 rounded-full border-4 border-[#020617] z-10 flex items-center justify-center",
                                    item.status === 'completed' ? "bg-emerald-500" : item.status === 'current' ? "bg-violet-600 animate-pulse" : "bg-zinc-800"
                                )}>
                                    {item.status === 'completed' && <FileCheck className="h-4 w-4 text-white" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest border-white/10 text-slate-500">{item.q}</Badge>
                                        <h4 className="text-lg font-black text-white uppercase italic tracking-tight">{item.title}</h4>
                                    </div>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* AUDITORIA TAB */}
        <TabsContent value="auditoria" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-zinc-950/60 border-2 border-emerald-500/20 rounded-[40px] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-emerald-500/5">
                        <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" /> Auditoria de Mérito (IMN)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <p className="text-sm text-slate-400 leading-relaxed">
                            O sistema audita em tempo real a consistência entre o **Tempo Efetivo** capturado pelo Dante e as avaliações de mérito realizadas pelo RH.
                        </p>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aderência ao Protocolo</span>
                                <span className="text-sm font-black text-emerald-400">96.8%</span>
                            </div>
                            <Progress value={96.8} className="h-2 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Divergências</p>
                                <p className="text-xl font-black text-rose-400">02</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Justificativas</p>
                                <p className="text-xl font-black text-emerald-400">14</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950/60 border-2 border-violet-500/20 rounded-[40px] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-violet-500/5">
                        <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                            <Lock className="h-5 w-5 text-violet-400" /> Governança e Compliance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            {[
                                { label: 'Proteção de Dados (LGPD)', status: 'secure' },
                                { label: 'Protocolos de Segurança NR-12', status: 'secure' },
                                { label: 'Auditoria de Qualidade ISO', status: 'secure' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <span className="text-sm font-bold text-slate-300">{item.label}</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[9px] font-black">PROTEGIDO</Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full border-white/10 text-slate-400 hover:text-white rounded-2xl h-12">
                            Gerar Relatório de Auditoria
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>

      <LegalSafeguard module="SALA DE CONTROLE" protocol="NX-EXEC-STRAT-01" />

      {/* MODAL: MEMORIAL DE CÁLCULO ESTRATÉGICO */}
      <AnimatePresence>
        {isSourceModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSourceModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[90vw] xl:max-w-7xl bg-zinc-950 border-2 border-amber-500/30 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.1)] flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 right-0 p-6 z-50">
                <Button variant="ghost" onClick={() => setIsSourceModalOpen(false)} className="text-slate-500 hover:text-white bg-black/20 backdrop-blur-md rounded-full">Fechar</Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-thin scrollbar-thumb-amber-500/20">
                <div className="flex flex-col md:flex-row items-end justify-between gap-4">
                  <div className="space-y-1">
                    <Badge className="bg-amber-500 text-black font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest">Protocolo de Simulação Ativa</Badge>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Memorial de Cálculo <span className="text-amber-500">Estratégico</span></h2>
                    <p className="text-slate-500 font-medium tracking-widest uppercase text-[10px]">Base: Hora Efetiva de 53 minutos (Dante Audit)</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resultado Projetado</p>
                    <p className={cn(
                      "text-4xl font-black italic transition-colors duration-500",
                      isHomologated ? "text-emerald-500" : "text-white"
                    )}>
                      +15.4<span className={isHomologated ? "text-emerald-400" : "text-amber-500"}>%</span>
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* HORIZONTAL LINEAR FLOW */}
                <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10">
                  <div className="flex flex-row items-stretch justify-between gap-4 min-w-[1000px]">
                    {/* Step 1: Engenharia */}
                    <div className="flex-1">
                      <div className="relative p-6 rounded-[40px] bg-white/5 border border-white/10 group hover:border-violet-500/30 transition-all h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-violet-600/20 rounded-xl">
                            <Zap className="h-5 w-5 text-violet-400" />
                          </div>
                          <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Engenharia</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Tempo Base</span>
                            <span className="text-2xl font-black text-white italic">-5 seg</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            Otimização de 5 segundos no ciclo operacional com base na hora de 53min do Dante.
                          </p>
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-lg font-black text-violet-400 uppercase tracking-[0.1em]">+6.5%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center px-2">
                      <PlusCircle className="h-6 w-6 text-white/20" />
                    </div>

                    {/* Step 2: RH / Capacidade */}
                    <div className="flex-1">
                      <div className="relative p-6 rounded-[40px] bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-all h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-600/20 rounded-xl">
                            <Users className="h-5 w-5 text-blue-400" />
                          </div>
                          <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Capacidade</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Especialistas</span>
                            <span className="text-2xl font-black text-white italic">+2</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            Expansão da força de trabalho com colaboradores homologados v3.0.
                          </p>
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-lg font-black text-blue-400 uppercase tracking-[0.1em]">+5.0%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center px-2">
                      <PlusCircle className="h-6 w-6 text-white/20" />
                    </div>

                    {/* Step 3: Auditoria / Gargalos */}
                    <div className="flex-1">
                      <div className="relative p-6 rounded-[40px] bg-white/5 border border-white/10 group hover:border-emerald-500/30 transition-all h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-600/20 rounded-xl">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                          </div>
                          <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Gargalos</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Gargalos</span>
                            <span className="text-2xl font-black text-white italic">-2 pçs/hora</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            Eliminação de 2 peças de retrabalho/desperdício por hora em pontos de gargalo.
                          </p>
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-lg font-black text-emerald-400 uppercase tracking-[0.1em]">+3.9%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center px-2">
                      <ArrowRight className="h-8 w-8 text-amber-500" />
                    </div>

                    {/* Step 4: Total */}
                    <div className="flex-1">
                      <div className={cn(
                        "relative p-8 rounded-[40px] border-2 transition-all duration-500 h-full",
                        isHomologated 
                          ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)]" 
                          : "bg-amber-500/10 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.1)]"
                      )}>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={cn(
                            "p-2 rounded-xl transition-colors",
                            isHomologated ? "bg-emerald-500" : "bg-amber-500"
                          )}>
                            <Target className="h-5 w-5 text-black" />
                          </div>
                          <h4 className={cn(
                            "text-sm font-black uppercase italic tracking-widest transition-colors",
                            isHomologated ? "text-emerald-500" : "text-amber-500"
                          )}>Total Nexus</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className={cn(
                              "text-5xl font-black italic transition-colors",
                              isHomologated ? "text-emerald-400" : "text-white"
                            )}>15.4%</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
                            Ganho Real Auditado
                          </p>
                          <div className="pt-4 border-t border-white/5">
                            <Badge className={cn(
                              "text-black border-none font-black text-[9px] px-3 transition-colors",
                              isHomologated ? "bg-emerald-500" : "bg-amber-500"
                            )}>HOMOLOGADO</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "border p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500",
                  isHomologated 
                    ? "bg-emerald-500/5 border-emerald-500/20" 
                    : "bg-amber-500/5 border-amber-500/20"
                )}>
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "h-16 w-16 flex items-center justify-center rounded-2xl shadow-xl transition-all",
                      isHomologated 
                        ? "bg-emerald-500 shadow-emerald-500/20" 
                        : "bg-amber-500 shadow-amber-500/20"
                    )}>
                      <Target className="h-8 w-8 text-black" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase italic">Soma Estratégica Nexus</h4>
                      <p className="text-sm text-slate-500 italic max-w-md">
                        6.5% (Engenharia) + 5.0% (RH) + 3.9% (Audit) = <span className={cn(
                          "font-bold transition-colors",
                          isHomologated ? "text-emerald-500" : "text-amber-500"
                        )}>15.4% de ganho real de produtividade.</span>
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsHomologated(true)}
                    className={cn(
                      "w-full md:w-auto font-black uppercase tracking-widest h-14 px-12 rounded-2xl transition-all duration-500",
                      isHomologated 
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                        : "bg-amber-600 hover:bg-amber-500 text-white"
                    )}
                  >
                    {isHomologated ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" /> SIMULAÇÃO HOMOLOGADA
                      </span>
                    ) : (
                      "Homologar Simulação"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
