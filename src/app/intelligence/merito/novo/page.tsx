'use client';

import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  Radar as RadarIcon, 
  BrainCircuit, 
  FileSignature, 
  Trophy,
  CheckCircle2,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser, useMemoAuth } from '@/auth';
import { permanentEmployees } from '@/lib/data/employees';
import { 
  Star,
  Zap,
  ShieldCheck,
  Timer,
  Heart,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

function NovaAvaliacaoContent() {
  const { user } = useUser(); // Pega o nome do avaliador (ex: João)
  const searchParams = useSearchParams();
  const employeeId = searchParams?.get('employeeId');
  const employee = permanentEmployees.find(emp => emp.id === employeeId);

  const [step, setStep] = useState(1);
  const [hasSaved, setHasSaved] = useState(false);
  const [formData, setFormData] = useState({
    disciplina: 0,
    qualidade: 0,
    velocidade: 0,
    comportamento: 0,
    proatividade: 0,
    observacoes: '',
  });

  const [justifications, setJustifications] = useState<Record<string, string>>({});

  const ratings = [
    { 
      key: 'disciplina', 
      label: 'Disciplina (Posto)', 
      icon: ShieldCheck, 
      desc: 'Foco em atrasos no setor e respeito às normas internas.',
      questions: [
        'O colaborador inicia as atividades no seu posto rigorosamente no horário de início?',
        'Respeita o tempo das pausas de setor (café/banheiro) sem exceder o combinado?'
      ]
    },
    { 
      key: 'qualidade', 
      label: 'Qualidade', 
      icon: CheckCircle2, 
      desc: 'Nível de excelência e conformidade técnica.',
      questions: [
        'Segue as fichas técnicas e padrões de qualidade sem necessidade de retrabalho?',
        'Zela pela limpeza e organização do seu posto de trabalho (5S)?'
      ]
    },
    { 
      key: 'velocidade', 
      label: 'Velocidade', 
      icon: Timer, 
      desc: 'Ritmo produtivo e cumprimento de metas.',
      questions: [
        'Mantém o ritmo de produção de acordo com a cronoanálise do setor?',
        'Demonstra agilidade na execução das tarefas rotineiras sem perder a segurança?'
      ]
    },
    { 
      key: 'comportamento', 
      label: 'Comportamento', 
      icon: Heart, 
      desc: 'Relacionamento interpessoal e postura ética.',
      questions: [
        'Mantém um bom relacionamento e comunicação com colegas e liderança?',
        'Aceita feedbacks e orientações de forma construtiva?'
      ]
    },
    { 
      key: 'proatividade', 
      label: 'Proatividade', 
      icon: Lightbulb, 
      desc: 'Iniciativa e visão de melhoria contínua.',
      questions: [
        'Toma iniciativa para resolver problemas técnicos simples sem esperar ordens?',
        'Sugere melhorias para o processo ou ajuda colegas em dificuldades?'
      ]
    },
  ];

  const calculateIMN = () => {
    const sum = formData.disciplina + formData.qualidade + formData.velocidade + formData.comportamento + formData.proatividade;
    return (sum / 5) * 2; // Converte média de 1-5 para 1-10
  };

  const saveEvaluation = () => {
    if (typeof window === 'undefined' || hasSaved) return;
    
    const finalScore = calculateIMN();
    const evaluationId = 'eval-' + Math.random().toString(36).substring(2, 9);
    const newEval = {
      id: evaluationId,
      employeeId: employeeId || '',
      employeeName: employee?.name || '',
      evaluatorName: user?.name || 'Avaliador',
      disciplina: formData.disciplina,
      qualidade: formData.qualidade,
      velocidade: formData.velocidade,
      comportamento: formData.comportamento,
      proatividade: formData.proatividade,
      finalScore: finalScore,
      date: new Date().toISOString(),
      observacoes: formData.observacoes,
    };

    try {
      const stored = localStorage.getItem('nexus_merit_evaluations');
      const list = stored ? JSON.parse(stored) : [];
      list.push(newEval);
      localStorage.setItem('nexus_merit_evaluations', JSON.stringify(list));
      
      setHasSaved(true);
      toast({
        title: "Avaliação Registrada",
        description: "Índice de Mérito Nexus (IMN) atualizado na base do colaborador.",
      });
    } catch (e) {
      console.error("Erro ao salvar avaliação:", e);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      const allRated = ratings.every(r => (formData[r.key as keyof typeof formData] as number) > 0);
      if (!allRated) {
        toast({ title: "Atenção", description: "Avalie todos os 5 pilares antes de prosseguir.", variant: "destructive" });
        return;
      }
    }
    if (step === 2) {
      saveEvaluation();
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  React.useEffect(() => {
    if (step === 3 && !hasSaved) {
      saveEvaluation();
    }
  }, [step, hasSaved]);

  const steps = [
    { title: "Avaliação Técnica", icon: Award },
    { title: "Considerações", icon: FileSignature },
    { title: "IMN Final", icon: Trophy },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 min-h-screen">
      
      {/* Stepper */}
      <div className="flex justify-between items-center px-4">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2 group">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= i + 1 ? 'border-primary bg-primary/20 text-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]' : 'border-white/10 text-gray-500'}`}>
               <s.icon className="h-5 w-5" />
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= i + 1 ? 'text-white' : 'text-gray-600'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <Card className="bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-white">
            Engenharia de Mérito // {steps[step - 1].title}
          </CardTitle>
          <CardDescription>Conduzindo análise de Índice de Mérito Nexus (IMN).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {step === 1 && (
            <div className="space-y-8">
              {/* Employee Info */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                 <Avatar className="h-12 w-12 border border-primary/20">
                    <AvatarImage src={employee?.avatar} />
                    <AvatarFallback>{employee?.name.charAt(0)}</AvatarFallback>
                 </Avatar>
                 <div>
                    <p className="text-sm font-bold text-white uppercase">{employee?.name || "Colaborador não identificado"}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{employee?.role}</p>
                 </div>
              </div>

              <div className="space-y-6">
                {ratings.map((rating) => {
                  const score = formData[rating.key as keyof typeof formData];
                  const isExtreme = score === 1 || score === 5;
                  
                  return (
                    <div key={rating.key} className={cn(
                      "space-y-6 p-6 rounded-3xl border-2 transition-all duration-500",
                      isExtreme ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]" : "bg-white/5 border-white/5"
                    )}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                              isExtreme ? "bg-amber-500/20 text-amber-500" : "bg-primary/10 text-primary"
                            )}>
                               <rating.icon className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-white uppercase tracking-tighter">{rating.label}</p>
                               <p className="text-[10px] text-gray-500 uppercase tracking-widest">{rating.desc}</p>
                            </div>
                         </div>
                         <div className="flex gap-1 bg-black/20 p-1 rounded-xl border border-white/5 w-fit">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setFormData({...formData, [rating.key]: star})}
                                className={cn(
                                  "p-2 transition-all rounded-lg",
                                  (score as number) >= star ? "text-primary scale-110" : "text-gray-700 hover:text-primary/40"
                                )}
                              >
                                <Star className={cn("h-6 w-6", (score as number) >= star ? "fill-primary" : "fill-transparent")} />
                              </button>
                            ))}
                         </div>
                      </div>

                      {/* Questões Guiadas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {rating.questions.map((q, idx) => (
                           <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
                              <p className="text-[11px] text-slate-300 mb-2 leading-tight">{q}</p>
                              <div className="flex gap-2">
                                 <Button variant="ghost" className="h-7 text-[9px] uppercase font-bold text-slate-500 hover:text-white">Sim</Button>
                                 <Button variant="ghost" className="h-7 text-[9px] uppercase font-bold text-slate-500 hover:text-white">Não</Button>
                                 <Button variant="ghost" className="h-7 text-[9px] uppercase font-bold text-slate-500 hover:text-white">Às Vezes</Button>
                              </div>
                           </div>
                         ))}
                      </div>

                      {isExtreme && (
                        <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
                           <Separator className="bg-amber-500/20" />
                           <div className="flex items-start gap-3">
                              <ShieldAlert className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                              <div className="space-y-3 w-full">
                                 <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
                                    <span className="font-black text-amber-500 uppercase tracking-widest">{user?.name || 'Avaliador'}</span>, 
                                    percebi que você deu nota {score === 5 ? 'MÁXIMA' : 'MÍNIMA'} para {employee?.name.split(' ')[0]} em {rating.label}. 
                                    Justifique este ponto específico agora para prosseguir:
                                 </p>
                                 <Textarea 
                                    placeholder="Explique o motivo deste extremo..."
                                    className="min-h-[80px] bg-black/40 border-amber-500/30 text-white rounded-xl text-sm focus:border-amber-500 placeholder:text-amber-500/20"
                                    value={justifications[rating.key] || ''}
                                    onChange={(e) => setJustifications({...justifications, [rating.key]: e.target.value})}
                                  />
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {ratings.every(r => formData[r.key as keyof typeof formData] === 5) && (
                <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-4 animate-in fade-in zoom-in duration-500">
                   <div className="flex items-center gap-3 text-amber-500">
                      <ShieldAlert className="h-6 w-6" />
                      <h4 className="font-black uppercase tracking-tighter text-lg">Justificativa de Performance de Elite</h4>
                   </div>
                   <p className="text-xs text-amber-200/70 leading-relaxed">
                      Você atribuiu <span className="font-bold text-white uppercase">Nota Máxima</span> em todos os pilares. Para evitar favoritismo e garantir a meritocracia, descreva um exemplo prático e recente onde o colaborador demonstrou excelência excepcional:
                   </p>
                   <Textarea 
                      placeholder="Ex: No dia X, o colaborador resolveu um problema de parada de máquina sem supervisão..."
                      className="min-h-[120px] bg-black/40 border-amber-500/20 text-white rounded-xl focus:border-amber-500"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-300">Observações Gerais e Feedback de Supervisão</Label>
                <Textarea 
                  placeholder="Descreva o desempenho geral, conquistas ou pontos de atenção..."
                  className="min-h-[150px] bg-black/40 border-white/10 text-white rounded-2xl"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                />
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-primary/80 italic flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4" /> A Djeny cruzará estas notas com os registros de cronoanálise para validar a coerência do IMN.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 space-y-8">
               <div className="relative inline-block">
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                      <p className="text-5xl font-black text-white">{calculateIMN().toFixed(1)}</p>
                  </div>
                  <div className="absolute -top-2 -right-2 h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-zinc-950">
                     <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
               </div>
               
               <div>
                  <h3 className="text-3xl font-black text-white font-headline tracking-tighter uppercase">IMN Calculado</h3>
                  <p className="text-gray-400 mt-2">Colaborador: <span className="text-white font-bold">{employee?.name}</span></p>
               </div>

               <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                  {ratings.map(r => (
                    <div key={r.key} className="flex flex-col items-center gap-1">
                       <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                          <r.icon className="h-4 w-4 text-primary/60" />
                       </div>
                       <span className="text-[10px] font-bold text-white">{formData[r.key as keyof typeof formData]}</span>
                    </div>
                  ))}
               </div>

               <div className="space-y-4 max-w-sm mx-auto">
                 <Button asChild className="w-full bg-primary text-black font-black h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                    <Link href={`/intelligence/merito/view?id=${employeeId}`}>
                       GERAR CERTIFICADO DE MÉRITO
                    </Link>
                 </Button>
                 <Button variant="ghost" onClick={() => window.location.href = '/intelligence/merito'} className="text-gray-500 text-xs uppercase tracking-widest">
                    Finalizar e Voltar para Base
                 </Button>
               </div>
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between pt-6 border-t border-white/5">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={step === 1}
                className="text-gray-400"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={nextStep} className="bg-primary text-white px-8 h-12 rounded-xl font-bold">
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
      <div className="max-w-4xl mx-auto px-6 pb-24 mt-12">
        <LegalSafeguard module="ENGENHARIA DE MÉRITO — AVALIAÇÃO" protocol="NX-MER-EVAL-01" />
      </div>
    </div>
  );
}

export default function NovaAvaliacaoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-mono text-sm uppercase tracking-widest animate-pulse">Iniciando Engenharia de Mérito...</p>
        </div>
      </div>
    }>
      <NovaAvaliacaoContent />
    </Suspense>
  );
}
