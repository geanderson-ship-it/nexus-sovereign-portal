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
  Users, 
  Video, 
  FileText, 
  Activity, 
  ShieldCheck, 
  Search,
  PlusCircle,
  MoreVertical,
  ChevronRight,
  BrainCircuit,
  Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { RecruitmentVideoRoom } from '@/components/gabinete/recruitment-video-room';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

const initialCandidates = [
  { id: '1', name: 'Ricardo Silveira', role: 'Gerente de Produção', status: 'Aguardando Entrevista', score: null },
  { id: '2', name: 'Fernanda Lima', role: 'Analista de Qualidade', status: 'Entrevistada', score: '8.5' },
  { id: '3', name: 'João Pedro Martins', role: 'Operador de Máquinas', status: 'Dossiê em Análise', score: '7.2' },
];

export default function RecruitmentWarRoom() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof initialCandidates[0] | null>(null);
  const [isNewProcessModalOpen, setIsNewProcessModalOpen] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateRole, setNewCandidateRole] = useState('');

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
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
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
           <Card className="bg-zinc-950/60 border-2 border-secondary/20 backdrop-blur-md shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-headline text-secondary flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" /> Inteligência Operacional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-md bg-secondary/10 border border-secondary/20">
                  <h4 className="font-bold text-secondary text-sm flex items-center gap-2 uppercase tracking-tighter">
                    <Activity className="h-4 w-4" /> Status Djeny (IA Humana)
                  </h4>
                  <p className="text-xs text-gray-400 mt-2">
                    Sistema pronto para entrevista via vídeo. Protocolo de análise psicológica ativo.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Alertas de Seleção</h4>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_theme(colors.emerald.500)]" />
                    <p className="text-sm text-gray-300">Candidato <span className="text-white font-bold">Fernanda Lima</span> aprovada tecnicamente.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shadow-[0_0_8px_theme(colors.amber.500)]" />
                    <p className="text-sm text-gray-300">Dissonância detectada no currículo de <span className="text-white font-bold">João Pedro</span>.</p>
                  </div>
                </div>

                <Button className="w-full bg-secondary text-black font-bold">
                   VER RELATÓRIO COMPLETO <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
           </Card>

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
    </div>
  );
}
