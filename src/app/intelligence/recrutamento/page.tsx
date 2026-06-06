'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Video, 
  FileText, 
  Activity, 
  Search,
  PlusCircle,
  MoreVertical,
  ChevronRight,
  BrainCircuit,
  Target,
  ChevronLeft,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { RecruitmentVideoRoom } from '@/components/gabinete/recruitment-video-room';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const initialCandidates = [
  { id: '1', name: 'Ricardo Silveira', role: 'Gerente de Produção', status: 'Aguardando Entrevista', score: null },
  { id: '2', name: 'Fernanda Lima', role: 'Analista de Qualidade', status: 'Entrevistada', score: '8.5' },
  { id: '3', name: 'João Pedro Martins', role: 'Operador de Máquinas', status: 'Dossiê em Análise', score: '7.2' },
];

const candidatesReportData: Record<string, {
  veredito: string;
  nervousness: number;
  sincerity: number;
  coherence: number;
  notes: string;
  details: Array<{ question: string; score: 'good' | 'warning' | 'critical' }>;
}> = {
  '2': { // Fernanda Lima
    veredito: 'APROVADO',
    nervousness: 20,
    sincerity: 92,
    coherence: 88,
    notes: 'Candidata demonstra excelente domínio técnico em processos de qualidade (SGQ e ferramentas Lean). Postura madura e respostas consistentes com seu histórico de estabilidade profissional. Sinal verde para contratação imediata.',
    details: [
      { question: 'Apresentação e histórico na região', score: 'good' },
      { question: 'Motivo da saída do emprego anterior', score: 'good' },
      { question: 'Motivação para trabalhar na Nexus', score: 'good' },
      { question: 'Cultura de trabalho em equipe', score: 'good' }
    ]
  },
  '3': { // João Pedro Martins
    veredito: 'EM ANÁLISE',
    nervousness: 65,
    sincerity: 60,
    coherence: 68,
    notes: 'Candidato possui boa base prática como operador, porém demonstrou instabilidade ao explicar o motivo da saída de seu último emprego. Necessária avaliação presencial para checagem de referências. Há pequenos alertas comportamentais.',
    details: [
      { question: 'Apresentação e histórico na região', score: 'good' },
      { question: 'Motivo da saída do emprego anterior', score: 'warning' },
      { question: 'Motivação para trabalhar na Nexus', score: 'warning' },
      { question: 'Cultura de trabalho em equipe', score: 'good' }
    ]
  }
};

export default function RecruitmentWarRoom() {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState(initialCandidates);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof initialCandidates[0] | null>(null);
  const [viewingReportCandidate, setViewingReportCandidate] = useState<typeof initialCandidates[0] | null>(null);
  const [isNewProcessModalOpen, setIsNewProcessModalOpen] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateRole, setNewCandidateRole] = useState('');

  // Estados para Entrevista Presencial
  const [presencialDate, setPresencialDate] = useState('');
  const [presencialInterviewer, setPresencialInterviewer] = useState('');
  const [presencialEvaluation, setPresencialEvaluation] = useState('');
  const [presencialVerdict, setPresencialVerdict] = useState<'approved' | 'rejected' | ''>('');
  const [presencialSignature, setPresencialSignature] = useState('');

  // Carrega dados da entrevista presencial ao selecionar um candidato
  useEffect(() => {
    if (!viewingReportCandidate) {
      setPresencialDate('');
      setPresencialInterviewer('');
      setPresencialEvaluation('');
      setPresencialVerdict('');
      setPresencialSignature('');
      return;
    }
    const saved = localStorage.getItem(`nexus_candidate_presencial_${viewingReportCandidate.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setPresencialDate(data.date || '');
      setPresencialInterviewer(data.interviewer || '');
      setPresencialEvaluation(data.evaluation || '');
      setPresencialVerdict(data.verdict || '');
      setPresencialSignature(data.signature || '');
    } else {
      setPresencialDate('');
      setPresencialInterviewer('');
      setPresencialEvaluation('');
      setPresencialVerdict('');
      setPresencialSignature('');
    }
  }, [viewingReportCandidate]);

  const handleSavePresencial = () => {
    if (!viewingReportCandidate) return;
    const data = {
      date: presencialDate,
      interviewer: presencialInterviewer,
      evaluation: presencialEvaluation,
      verdict: presencialVerdict,
      signature: presencialSignature
    };
    localStorage.setItem(`nexus_candidate_presencial_${viewingReportCandidate.id}`, JSON.stringify(data));
    
    // Atualiza o status do candidato na lista para refletir o parecer
    if (presencialVerdict) {
      setCandidates(prev => prev.map(c => {
        if (c.id === viewingReportCandidate.id) {
          return {
            ...c,
            status: presencialVerdict === 'approved' ? 'Aprovado Presencial' : 'Reprovado Presencial'
          };
        }
        return c;
      }));
    }

    toast({
      title: "Avaliação Presencial Salva",
      description: `Os dados de ${viewingReportCandidate.name} foram registrados.`,
    });
  };

  const startInterview = (candidate: typeof initialCandidates[0]) => {
    setSelectedCandidate(candidate);
    setIsInterviewing(true);
  };

  const handleAddCandidate = () => {
    if (!newCandidateName || !newCandidateRole) return;
    const newCandidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCandidateName,
      role: newCandidateRole,
      status: 'Aguardando Entrevista',
      score: null
    };
    setCandidates([newCandidate, ...candidates]);
    setIsNewProcessModalOpen(false);
    setNewCandidateName('');
    setNewCandidateRole('');
  };

  if (isInterviewing && selectedCandidate) {
    return (
      <RecruitmentVideoRoom 
        candidateName={selectedCandidate.name} 
        candidateRole={selectedCandidate.role}
        onClose={() => setIsInterviewing(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-12 relative overflow-hidden">
      
      {/* HERO SECTION */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-slate-900 via-slate-900/50 to-[#020617] border border-white/5 shadow-2xl"
      >
          <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/5 blur-[120px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-[30%] h-full bg-purple-900/10 blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-16">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                  <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                  >
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest italic">
                              Live Selection Protocol
                          </Badge>
                          <div className="h-[1px] w-12 bg-blue-500/30" />
                      </div>
                      <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white font-headline uppercase leading-none">
                          Recrutamento <br />
                          <span className="text-blue-400 italic">War Room</span>
                      </h1>
                      <p className="text-lg lg:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                          Seleção de elite conduzida pela Inteligência Djeny. 
                          Entrevistas em tempo real com análise psicocomportamental avançada.
                      </p>
                  </motion.div>

                  <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
                  >
                      <Button onClick={() => setIsNewProcessModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest h-14 px-8 rounded-2xl shadow-xl shadow-blue-600/20">
                        <PlusCircle className="mr-2 h-5 w-5" /> Novo Processo
                      </Button>
                      <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-14 px-8 rounded-2xl">
                        <Activity className="mr-2 h-5 w-5" /> Métricas Ativas
                      </Button>
                  </motion.div>
              </div>

              <motion.div 
                  initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative w-full lg:w-[450px] aspect-square group"
              >
                  <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700" />
                  <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                      <Image 
                          src="https://i.postimg.cc/QCF54Yyf/Djeny-RH-Nexus.png" 
                          alt="Recrutamento War Room"
                          fill
                          className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Operação Djeny RH</span>
                              <Badge className="bg-blue-500 text-white border-none font-black text-[9px]">ACTIVE ROOM</Badge>
                          </div>
                      </div>
                  </div>
              </motion.div>
          </div>
      </motion.div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-white font-headline uppercase italic">Painel de Operações</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">Gestão de Candidatos de Elite</p>
              </div>
          </div>
          <Button variant="ghost" asChild className="text-slate-500 hover:text-white group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl px-6 h-12">
              <Link href="/intelligence/rh">
                  <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Voltar ao Hub
              </Link>
          </Button>
      </div>

      {/* Modal Novo Processo */}
      {isNewProcessModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-zinc-950 border-2 border-primary/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" /> Iniciar Novo Processo
              </CardTitle>
              <CardDescription>Cadastre o candidato para iniciar a triagem da Djeny.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Nome do Candidato</Label>
                <Input 
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  placeholder="Ex: Geanderson..." 
                  className="bg-black/40 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Cargo Pretendido</Label>
                <Input 
                  value={newCandidateRole}
                  onChange={(e) => setNewCandidateRole(e.target.value)}
                  placeholder="Ex: Auxiliar de Produção" 
                  className="bg-black/40 border-white/10" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={() => setIsNewProcessModalOpen(false)} className="flex-1 text-gray-400">
                  Cancelar
                </Button>
                <Button onClick={handleAddCandidate} className="flex-1 bg-primary text-white font-bold">
                  Cadastrar e Listar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator className="bg-white/10" />

      {/* Grid de Operações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna 1: Lista de Candidatos */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl font-headline text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Candidatos Ativos
                </CardTitle>
                <CardDescription>Gerenciamento de fluxo de entrada para sua empresa.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar talento..." className="pl-8 bg-black/40 border-white/10" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id}
                    className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{candidate.name}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">{candidate.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                      <Badge variant={candidate.status === 'Entrevistada' ? 'default' : 'outline'} className="bg-primary/20 text-primary border-primary/30">
                        {candidate.status}
                      </Badge>
                      {candidate.score && (
                         <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-emerald-400" />
                            <span className="font-bold text-emerald-400">{candidate.score}</span>
                         </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-gray-400 hover:text-white"
                          onClick={() => startInterview(candidate)}
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-gray-400 hover:text-white"
                          onClick={() => setViewingReportCandidate(candidate)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna 2: Inteligência e Alertas */}
        <div className="space-y-6">
           {/* Selo Nexus Quality */}
           <div className="relative aspect-square w-full opacity-30 pointer-events-none">
              <Image 
                src="https://i.postimg.cc/Kj1cPYH3/Combine-the-first-im.png"
                alt="Nexus Quality Seal"
                fill
                className="object-contain grayscale"
              />
           </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-24 mt-12">
        <LegalSafeguard module="RECRUTAMENTO WAR ROOM" protocol="NX-REC-01" />
      </div>

      {/* Modal Visualizar Avaliação Djeny */}
      <AnimatePresence>
        {viewingReportCandidate && (
          <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-zinc-950 border-2 border-blue-500/20 shadow-2xl rounded-[32px] overflow-hidden"
            >
              {/* Header com gradiente */}
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter text-left">Relatório de Avaliação</h3>
                    <p className="text-blue-400 font-mono tracking-widest text-[9px] uppercase text-left">Nexus AI // Recrutamento Inteligente</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setViewingReportCandidate(null)}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg h-9 w-9 text-slate-400 hover:text-white hover:bg-white/5 animate-in fade-in"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
                {/* Perfil e Veredito */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Candidato</p>
                    <p className="text-xl font-bold text-white leading-none">{viewingReportCandidate.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{viewingReportCandidate.role}</p>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center text-center md:text-left">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Veredito Djeny</p>
                    {viewingReportCandidate.score ? (
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className={cn(
                          "text-xl font-black uppercase tracking-widest leading-none",
                          candidatesReportData[viewingReportCandidate.id]?.veredito === 'APROVADO' ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {candidatesReportData[viewingReportCandidate.id]?.veredito}
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-none font-bold text-xs">
                          {viewingReportCandidate.score} / 10
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Aguardando Avaliação</span>
                    )}
                  </div>
                </div>

                {/* Se tiver avaliação, exibe as notas de telemetria e análise */}
                {viewingReportCandidate.score && candidatesReportData[viewingReportCandidate.id] ? (
                  <>
                    {/* Telemetria de Inteligência */}
                    <div className="space-y-4">
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Telemetria de Comportamento (Live):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Nervosismo', val: candidatesReportData[viewingReportCandidate.id].nervousness, color: 'text-amber-400', barBg: 'bg-amber-400' },
                          { label: 'Sinceridade', val: candidatesReportData[viewingReportCandidate.id].sincerity, color: 'text-emerald-400', barBg: 'bg-emerald-400' },
                          { label: 'Coerência', val: candidatesReportData[viewingReportCandidate.id].coherence, color: 'text-blue-400', barBg: 'bg-blue-400' }
                        ].map((m) => (
                          <div key={m.label} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400 font-bold">{m.label}</span>
                              <span className={cn("font-black", m.color)}>{m.val}%</span>
                            </div>
                            <Progress value={m.val} className="h-1 bg-white/5" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Veredito Detalhado */}
                    <div className="space-y-2">
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Análise de IA (Djeny):</p>
                      <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                        <p className="text-xs text-slate-300 leading-relaxed italic font-medium">
                          "{candidatesReportData[viewingReportCandidate.id].notes}"
                        </p>
                      </div>
                    </div>

                    {/* Detalhamento de Respostas */}
                    <div className="space-y-3">
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Detalhamento de Módulos:</p>
                      <div className="space-y-2">
                        {candidatesReportData[viewingReportCandidate.id].details.map((det, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold">
                            <span className="text-slate-300">{det.question}</span>
                            <Badge className={cn(
                              "text-[8px] font-black border-none uppercase px-3 py-1",
                              det.score === 'good' ? "bg-emerald-500/20 text-emerald-400" : det.score === 'warning' ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                            )}>
                              {det.score === 'good' ? 'Coerente' : det.score === 'warning' ? 'Atenção' : 'Dissonante'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl space-y-2 bg-black/40">
                    <BrainCircuit className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ficha de Triagem em Aberto</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      O candidato ainda não realizou a entrevista com a Djeny. Agende ou inicie a videochamada para processar a avaliação comportamental.
                    </p>
                  </div>
                )}
                <Separator className="bg-white/5" />

                {/* Seção Entrevista Presencial */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <Users className="h-4 w-4" /> Entrevista Presencial (Avaliação Humana)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase font-bold text-slate-500 ml-1">Data da Entrevista</Label>
                      <Input
                        type="date"
                        value={presencialDate}
                        onChange={(e) => setPresencialDate(e.target.value)}
                        className="bg-black/40 border-white/10 h-10 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase font-bold text-slate-500 ml-1">Entrevistador Responsável</Label>
                      <Input
                        type="text"
                        placeholder="Nome do entrevistador"
                        value={presencialInterviewer}
                        onChange={(e) => setPresencialInterviewer(e.target.value)}
                        className="bg-black/40 border-white/10 h-10 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase font-bold text-slate-500 ml-1">Avaliação da Entrevista Presencial</Label>
                    <textarea
                      placeholder="Descreva as qualificações técnicas observadas, postura, referências profissionais..."
                      value={presencialEvaluation}
                      onChange={(e) => setPresencialEvaluation(e.target.value)}
                      className="w-full min-h-[90px] bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase font-bold text-slate-500 ml-1">Parecer do Entrevistador</Label>
                      <select
                        value={presencialVerdict}
                        onChange={(e: any) => setPresencialVerdict(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 h-10 rounded-xl px-3 text-xs text-white focus:border-blue-500 outline-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-950 text-slate-500">Escolha o parecer...</option>
                        <option value="approved" className="bg-slate-950 text-emerald-400 font-bold">Aprovado (Efetivado/Contratado)</option>
                        <option value="rejected" className="bg-slate-950 text-red-400 font-bold">Reprovado</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase font-bold text-slate-500 ml-1">Assinatura Digital / Eletrônica</Label>
                      <Input
                        type="text"
                        placeholder="Assine digitando seu nome"
                        value={presencialSignature}
                        onChange={(e) => setPresencialSignature(e.target.value)}
                        className="bg-black/40 border-white/10 h-10 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      onClick={handleSavePresencial}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] h-11 rounded-xl shadow-lg shadow-emerald-950/20"
                    >
                      Salvar Avaliação Presencial
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-zinc-950/80 flex justify-end gap-3">
                <Button 
                  onClick={() => setViewingReportCandidate(null)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl"
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
