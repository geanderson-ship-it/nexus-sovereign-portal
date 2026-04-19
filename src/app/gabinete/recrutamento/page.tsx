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
import { RecruitmentVideoRoom } from '@/components/gabinete/recruitment-video-room';

const candidates = [
  { id: '1', name: 'Ricardo Silveira', role: 'Gerente de Produção', status: 'Aguardando Entrevista', score: null },
  { id: '2', name: 'Fernanda Lima', role: 'Analista de Qualidade', status: 'Entrevistada', score: '8.5' },
  { id: '3', name: 'João Pedro Martins', role: 'Operador de Máquinas', status: 'Dossiê em Análise', score: '7.2' },
];

export default function RecruitmentWarRoom() {
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(null);

  const startInterview = (candidate: typeof candidates[0]) => {
    setSelectedCandidate(candidate);
    setIsInterviewing(true);
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
    <div className="space-y-8 min-h-screen pb-20">
      {/* Header Estilo Centro de Comando */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white font-headline flex items-center gap-3">
             <BrainCircuit className="h-10 w-10 text-primary" /> Recrutamento War Room
          </h1>
          <p className="text-gray-400 mt-2">
            Inteligência Humana Nexus: Seleção de elite conduzida pela Djeny.
          </p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Activity className="mr-2 h-4 w-4" /> Métricas de Contratação
          </Button>
          <Button className="bg-primary text-white font-bold">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Processo
          </Button>
        </div>
      </div>

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
                <CardDescription>Gerenciamento de fluxo de entrada da Nexus.</CardDescription>
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
    </div>
  );
}

// Sub-componentes internos para visualização
function Image({ src, alt, fill, className, style }: any) {
  return <img src={src} alt={alt} className={className} style={{...style, ...(fill ? { position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 } : {})}} />;
}
