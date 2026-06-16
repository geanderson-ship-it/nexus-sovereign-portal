'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Video, 
  FileText, 
  Activity, 
  PlusCircle, 
  ChevronRight, 
  BrainCircuit, 
  Target,
  Zap,
  ChevronLeft,
  Users,
  Phone
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { PactumContractAnalyzer } from '@/components/gabinete/pactum-contract-analyzer';
import { PactumWarRoom } from '@/components/gabinete/pactum-war-room';
import { PactumSimulator } from '@/components/gabinete/pactum-simulator';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { WhiteLabelHeader } from '@/components/nexus/white-label-header';

// Active simulated high-stakes contracts
const initialDeals = [
  { id: '1', name: 'Joint Venture Tecnológica Dante Axis', opponent: 'Siberian Steel Corp', status: 'Risco Auditado', value: '$85,000,000', score: '88/100' },
  { id: '2', name: 'Fornecimento Soberano de Sementes Safra Pro', opponent: 'AgroGlobal Holding', status: 'Aguardando Negociação', value: '$12,400,000', score: null },
  { id: '3', name: 'Licenciamento de IA e Showroom Djeny', opponent: 'EuroDesign SpA', status: 'Negociação Concluída', value: '$45,000,000', score: '92/100' },
];

const simulatorProfiles = [
  { id: 'wall', name: 'Perfil Analítico', role: 'Conselheiro de Risco Conservador', trait: 'Processo meticuloso, avaliações rígidas de risco e alta ponderação antes de ceder.', diff: 'Difícil' },
  { id: 'aggressor', name: 'Perfil Assertivo', role: 'Diretor Focado em Resultados', trait: 'Pressiona por agilidade, foco estrito no ROI e negociações de ritmo acelerado.', diff: 'Muito Difícil' },
  { id: 'mirror', name: 'Perfil Conciliador', role: 'Consultor Legal Colaborativo', trait: 'Foco em consenso inicial, com forte habilidade em embutir contrapartidas complexas.', diff: 'Médio' }
];

export default function NexusPactumCockpit() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'auditor' | 'warroom' | 'simulator'>('dashboard');
  const [deals, setDeals] = useState(initialDeals);
  const [directCallTarget, setDirectCallTarget] = useState('');

  const handleStartDirectCall = () => {
    if (!directCallTarget) return;

    // Generate a secure looking token for the link
    const securityToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    const secureLink = `https://nexustreinamento.com/pactum-link?token=${securityToken}`;

    // Detect if it's an email or whatsapp
    const isEmail = directCallTarget.includes('@');
    
    if (isEmail) {
      window.open(`mailto:${directCallTarget}?subject=Nexus Pactum - War Room Invite&body=Acesse o link seguro para iniciarmos nossa negociação biométrica:%0D%0A%0D%0A${secureLink}`, '_blank');
    } else {
      // Clean up number
      const numbersOnly = directCallTarget.replace(/\D/g, '');
      if (numbersOnly.length >= 8) {
        // Assume BR code if missing
        const countryCode = numbersOnly.length <= 11 ? '55' : '';
        window.open(`https://wa.me/${countryCode}${numbersOnly}?text=Nexus+Pactum:+Acesse+nossa+sala+segura+para+iniciarmos+a+chamada+biométrica:%0A%0A${secureLink}`, '_blank');
      }
    }

    const directDeal = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'Chamada Ad-hoc / Avulsa',
      opponent: directCallTarget,
      value: 'N/A',
      status: 'Em Ligação',
      score: null
    };
    setSelectedDeal(directDeal);
    setIsNegotiating(true);
  };
  const [selectedDeal, setSelectedDeal] = useState<typeof initialDeals[0] | null>(null);
  const [selectedSimulator, setSelectedSimulator] = useState<typeof simulatorProfiles[0] | null>(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  
  // States for adding a new contract
  const [newDealName, setNewDealName] = useState('');
  const [newOpponent, setNewOpponent] = useState('');
  const [newVal, setNewVal] = useState('');

  const handleStartNegotiation = (deal: typeof initialDeals[0]) => {
    setSelectedDeal(deal);
    setIsNegotiating(true);
  };

  const handleStartSimulation = (profile: typeof simulatorProfiles[0]) => {
    setSelectedSimulator(profile);
    setIsSimulating(true);
  };

  const handleAddDeal = () => {
    if (!newDealName || !newOpponent || !newVal) return;
    const newDeal = {
      id: Math.random().toString(36).substring(2, 9),
      name: newDealName,
      opponent: newOpponent,
      value: newVal,
      status: 'Aguardando Negociação',
      score: null
    };
    setDeals([newDeal, ...deals]);
    setIsNewDealOpen(false);
    setNewDealName('');
    setNewOpponent('');
    setNewVal('');
  };

  // Launch War Room fullscreen overlay
  if (isNegotiating && selectedDeal) {
    return (
      <PactumWarRoom 
        dealName={selectedDeal.name} 
        opponentName={selectedDeal.opponent}
        dealValue={selectedDeal.value}
        onClose={() => setIsNegotiating(false)} 
      />
    );
  }

  // Launch Simulator fullscreen overlay
  if (isSimulating && selectedSimulator) {
    return (
      <PactumSimulator 
        profile={selectedSimulator}
        onClose={() => setIsSimulating(false)} 
      />
    );
  }

  return (
    <SovereignShowcase moduleName="Nexus Pactum" imagePath="/Nexus Pactum/Nexus intelligence Pactum.png">
      <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-12 relative overflow-hidden">
        
        {/* White-Label Custom Header */}
        <WhiteLabelHeader
          defaultTitle="Nexus Pactum"
          defaultSlogan="Auditoria avançada de vulnerabilidades em contratos e análise biométrica de blefes baseada em Teoria dos Jogos."
          defaultLogo="/logo-nexus-shield.png"
          storageKeyPrefix="pactum"
          themeColor="violet"
        />
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-violet-900/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
      </div>

      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 overflow-hidden rounded-[48px] bg-gradient-to-br from-slate-900 via-slate-900/50 to-[#020617] border border-white/5 shadow-2xl"
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest italic">
                  Alta Governança de Acordos
                </Badge>
                <div className="h-[1px] w-12 bg-blue-500/30" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white font-headline uppercase leading-none">
                Contratos & Negociações Táticas
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Painel analítico para detecção de anomalias em cláusulas legais e simulação em tempo real com negociadores virtuais.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Button 
                onClick={() => {
                  setSelectedDeal(deals[1]);
                  setIsNegotiating(true);
                }} 
                className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest h-14 px-8 rounded-2xl shadow-xl shadow-blue-600/20"
              >
                <Video className="mr-2 h-5 w-5 animate-pulse" /> Abrir Gabinete de Negociação
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('auditor')}
                className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-14 px-8 rounded-2xl"
              >
                <FileText className="mr-2 h-5 w-5" /> Iniciar Auditoria
              </Button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full lg:w-[450px] aspect-[1.5] group"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-all duration-700" />
            <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl flex items-center justify-center">
              <Image 
                src="/Nexus Pactum/Nexus intelligence Pactum.png" 
                alt="Nexus Pactum Logo"
                fill
                className="object-cover transition-transform duration-[3s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Inteligência Pactum</span>
                  <Badge className="bg-blue-500 text-white border-none font-black text-[9px] uppercase">Protocolo Ativo</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* PORTAL NAV HUB HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <BrainCircuit className="h-6 w-6 text-blue-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white font-headline uppercase italic">Central de Comando Pactum</h2>
            <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">Painel Geral de Negociações Bilionárias</p>
          </div>
        </div>

        {/* Custom Navigation Tab-buttons */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl shadow-inner">
          {[
            { id: 'dashboard', label: 'Painel Geral', icon: Activity },
            { id: 'auditor', label: 'Auditoria de Contratos', icon: FileText },
            { id: 'warroom', label: 'Gabinete de Crise', icon: Video },
            { id: 'simulator', label: 'Sala de Avaliação', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/35" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <Button variant="ghost" asChild className="text-slate-500 hover:text-white group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl px-6 h-12">
          <Link href="/intelligence">
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Voltar
          </Link>
        </Button>
      </div>

      {/* MAIN CONTAINER PANELS */}
      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Active Deals */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-zinc-950/60 border-2 border-blue-500/20 backdrop-blur-md shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 border-b border-white/5">
                    <div>
                      <CardTitle className="text-xl font-headline text-white flex items-center gap-2 uppercase tracking-tighter">
                        <Activity className="h-5 w-5 text-blue-400 animate-pulse" /> Contratos em Andamento
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs">Monitoramento de negociações de alto impacto comercial.</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsNewDealOpen(true)} 
                      className="bg-blue-600/10 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 font-black text-[10px] uppercase tracking-widest rounded-xl h-10 px-4"
                    >
                      <PlusCircle className="mr-1.5 h-4 w-4" /> Novo Contrato
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {deals.map((deal) => (
                        <div 
                          key={deal.id}
                          className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-lg">
                              {deal.opponent.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white tracking-tight">{deal.name}</p>
                              <p className="text-xs text-gray-500 font-mono flex items-center gap-2 mt-1 uppercase">
                                <span>Parte Interessada: <strong className="text-slate-300">{deal.opponent}</strong></span>
                                <span className="h-1 w-1 rounded-full bg-slate-700" />
                                <span>Valor: <strong className="text-blue-400">{deal.value}</strong></span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 mt-4 sm:mt-0">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg",
                                deal.status === 'Risco Auditado' || deal.status === 'Negociação Concluída'
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              )}
                            >
                              {deal.status}
                            </Badge>
                            {deal.score && (
                              <div className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-2.5 py-1">
                                <Target className="h-4 w-4 text-emerald-400" />
                                <span className="font-black text-emerald-400 text-xs font-mono">{deal.score}</span>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleStartNegotiation(deal)}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl px-4 h-9 shadow-lg shadow-blue-600/15"
                              >
                                War Room
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setActiveTab('auditor')}
                                className="text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-xl h-9 px-3"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Advisory & Alerts */}
              <div className="space-y-6">
                <Card className="bg-zinc-950/60 border-2 border-violet-500/20 backdrop-blur-md shadow-2xl">
                  <CardHeader className="p-6 border-b border-white/5 bg-violet-500/5">
                    <CardTitle className="text-lg font-headline text-violet-400 flex items-center gap-2 uppercase tracking-tighter">
                      <ShieldCheck className="h-5 w-5" /> Inteligência Soberana
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs">Veredito operacional gerado pelo nosso algoritmo.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
                      <h4 className="font-bold text-violet-400 text-xs flex items-center gap-2 uppercase tracking-widest font-headline">
                        <Zap className="h-4 w-4 animate-bounce" /> Algoritmo Pactum v4.1 Ready
                      </h4>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        Algoritmos de teoria dos jogos ativos. Carregue um documento contratual para analisar riscos de perdas e assimetrias ocultas em segundos.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">Alertas de Negociação</h4>
                      
                      <div className="flex items-start gap-3 p-2 bg-white/5 border border-white/5 rounded-xl">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        <p className="text-xs text-slate-300 leading-normal">
                          <span className="text-white font-bold block">Assimetria Crítica Detectada</span>
                          Cláusula 14.3 da Siberian Steel impõe riscos severos sobre atrasos não controlados.
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-3 p-2 bg-white/5 border border-white/5 rounded-xl">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <p className="text-xs text-slate-300 leading-normal">
                          <span className="text-white font-bold block">Análise de Veredito Excelente</span>
                          Contrato EuroDesign concluído. Índice de segurança de cláusulas em <span className="text-emerald-400 font-bold font-mono">92/100</span>.
                        </p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setActiveTab('auditor')}
                      className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black text-xs uppercase tracking-widest h-12 rounded-xl"
                    >
                      Auditar Contrato Ativo <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'auditor' && (
            <motion.div 
              key="auditor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <PactumContractAnalyzer />
            </motion.div>
          )}

          {activeTab === 'warroom' && (
            <motion.div 
              key="warroom"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-zinc-950/60 border-2 border-blue-500/20 backdrop-blur-md shadow-2xl rounded-3xl">
                <CardHeader className="p-8 text-center border-b border-white/5">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center rounded-2xl shadow-xl shadow-blue-500/10">
                      <Video className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-black text-white font-headline uppercase tracking-tighter">Gabinete de Negociação Estratégica</CardTitle>
                  <CardDescription className="text-slate-400 mt-2">
                    Ligue a biometria para sessões de negociação em tempo real de altíssima relevância estratégica.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Selecione o Contrato Ativo:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deals.map((deal) => (
                        <button
                          key={deal.id}
                          onClick={() => handleStartNegotiation(deal)}
                          className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-left transition-all duration-300 group"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Parte Interessada: {deal.opponent}</span>
                            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{deal.name}</h4>
                            <span className="text-xs text-slate-500 font-mono block mt-1">{deal.value}</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AD-HOC DIRECT CALL SECTION */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-500" /> Iniciar Ligação Direta (Avulsa)
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text"
                        placeholder="E-mail ou WhatsApp do contato..."
                        value={directCallTarget}
                        onChange={(e) => setDirectCallTarget(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                      />
                      <Button 
                        onClick={handleStartDirectCall}
                        disabled={!directCallTarget}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest px-8 rounded-xl h-auto py-3 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                      >
                        <Video className="mr-2 h-4 w-4" /> Ligar Agora
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/5 border border-blue-500/15 rounded-2xl flex items-center gap-3">
                    <Activity className="h-5 w-5 text-blue-400 shrink-0" />
                    <p className="text-xs text-slate-400 font-medium">
                      O sistema de War Room utilizará seu stream de vídeo para fins de comparação biométrica, detecção de pulso e estresse fonético sob o protocolo <strong className="text-blue-400">NX-PACT-02</strong>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div 
              key="simulator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Sala de Treinamento e Avaliação</h3>
                <p className="text-slate-400 text-sm">
                  Escolha uma parte negociadora virtual baseada em algoritmos sofisticados e afie seu arsenal estratégico de negociação com feedbacks instantâneos do nosso algoritmo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {simulatorProfiles.map((profile) => (
                  <Card 
                    key={profile.id}
                    className="bg-zinc-950/60 border-2 border-blue-500/10 hover:border-blue-500/40 backdrop-blur-md shadow-2xl rounded-3xl flex flex-col group transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader className="p-6 border-b border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className={cn(
                          "font-black text-[9px] uppercase tracking-widest border-none px-2 py-0.5",
                          profile.diff === 'Difícil' ? "bg-amber-600 text-white" :
                          profile.diff === 'Muito Difícil' ? "bg-red-600 text-white" :
                          "bg-emerald-600 text-white"
                        )}>
                          Dificuldade: {profile.diff}
                        </Badge>
                        <Users className="h-5 w-5 text-slate-500" />
                      </div>
                      <CardTitle className="text-lg font-headline text-white group-hover:text-blue-400 transition-colors mt-2">{profile.name}</CardTitle>
                      <CardDescription className="text-slate-400 font-mono text-[10px] tracking-wide uppercase mt-1">{profile.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between gap-6">
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        "{profile.trait}"
                      </p>
                      <Button 
                        onClick={() => handleStartSimulation(profile)}
                        className="w-full bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 group-hover:border-blue-500 transition-all font-black text-xs uppercase tracking-widest h-11 rounded-xl"
                      >
                        Iniciar Debate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL NOVO CONTRATO */}
      {isNewDealOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-zinc-950 border-2 border-blue-500/20 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-1.5 bg-blue-600" />
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-headline text-white flex items-center gap-2 uppercase tracking-tighter">
                <PlusCircle className="h-5 w-5 text-blue-400" /> Registrar Novo Contrato
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">Insira os metadados do acordo para auditoria ou negociação.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 pt-0">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Título do Acordo</label>
                <input 
                  value={newDealName}
                  onChange={(e) => setNewDealName(e.target.value)}
                  placeholder="Ex: Aquisição de Showroom..." 
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-blue-500/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Parte Interessada / Segunda Parte</label>
                <input 
                  value={newOpponent}
                  onChange={(e) => setNewOpponent(e.target.value)}
                  placeholder="Ex: Siberian Steel Corp" 
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-blue-500/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor do Contrato</label>
                <input 
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  placeholder="Ex: $45,000,000" 
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-blue-500/50" 
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsNewDealOpen(false)} 
                  className="flex-1 text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-xl h-12 font-black text-xs uppercase tracking-widest"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddDeal} 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl h-12 shadow-lg shadow-blue-600/15"
                >
                  Cadastrar Contrato
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* LEGAL SAFEGUARD PROTOCOL */}
      <div className="max-w-7xl mx-auto px-6 pb-24 mt-12">
        <LegalSafeguard module="NEXUS PACTUM WAR ROOM" protocol="NX-PACT-01" />
      </div>

      </div>
    </SovereignShowcase>
  );
}
