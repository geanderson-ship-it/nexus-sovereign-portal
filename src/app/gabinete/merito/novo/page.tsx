'use client';

import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

export default function NovaAvaliacaoPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    candidateName: '',
    filtroZero: 0,
    avaliacao360: '',
    vereditoSetor: 0,
  });

  const nextStep = () => {
    if (step === 1 && !formData.candidateName) {
      toast({ title: "Erro", description: "Informe o nome do colaborador.", variant: "destructive" });
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const steps = [
    { title: "Identificação", icon: Award },
    { title: "Filtro Zero", icon: RadarIcon },
    { title: "360° Djeny", icon: BrainCircuit },
    { title: "Supervisão", icon: FileSignature },
    { title: "Resultado", icon: Trophy },
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Nome do Colaborador</Label>
                <Input 
                  placeholder="Ex: Pedro Alvares" 
                  className="bg-black/40 border-white/10 text-white"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                />
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-gray-400">
                  <AlertCircle className="inline mr-2 h-4 w-4 text-primary" />
                  Esta avaliação será auditada pela Djeny para garantir a imparcialidade do processo.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Pontuação Operacional (Filtro Zero) - 0 a 10</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    max="10" 
                    min="0"
                    className="w-24 bg-black/40 border-white/10 text-white"
                    value={formData.filtroZero}
                    onChange={(e) => setFormData({...formData, filtroZero: Number(e.target.value)})}
                  />
                  <Progress value={formData.filtroZero * 10} className="flex-1 h-2" />
                </div>
                <p className="text-xs text-gray-500">Baseado em assiduidade, pontualidade e métricas de produção direta.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Feedback Coletivo (360° Djeny)</Label>
                <Textarea 
                  placeholder="Cole aqui os comentários da equipe sobre este colaborador..."
                  className="min-h-[150px] bg-black/40 border-white/10 text-white"
                  value={formData.avaliacao360}
                  onChange={(e) => setFormData({...formData, avaliacao360: e.target.value})}
                />
              </div>
              <p className="text-xs text-gray-500 italic text-primary/80">A Djeny irá processar este texto para extrair o fit emocional e liderança.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Veredito do Setor (Supervisão) - 0 a 10</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    max="10" 
                    min="0"
                    className="w-24 bg-black/40 border-white/10 text-white"
                    value={formData.vereditoSetor}
                    onChange={(e) => setFormData({...formData, vereditoSetor: Number(e.target.value)})}
                  />
                  <Progress value={formData.vereditoSetor * 10} className="flex-1 h-2" />
                </div>
                <p className="text-xs text-gray-500">Nota técnica e comportamental atribuída pela liderança direta após auditoria.</p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-10 space-y-6">
               <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary animate-pulse">
                      <CheckCircle2 className="h-12 w-12 text-primary" />
                  </div>
               </div>
               <div>
                  <h3 className="text-3xl font-bold text-white font-headline tracking-tighter">IMN Calculado com Sucesso!</h3>
                  <p className="text-gray-400 mt-2">O Índice de Mérito Nexus foi gerado e auditado pela Djeny.</p>
               </div>
               <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 max-w-sm mx-auto shadow-2xl shadow-primary/10">
                  <p className="text-xs uppercase tracking-widest text-primary font-bold">Índice Final (IMN)</p>
                  <p className="text-6xl font-bold text-white">{((formData.filtroZero + formData.vereditoSetor + (formData.avaliacao360.length > 20 ? 8 : 4)) / 3).toFixed(1)}</p>
               </div>
               <Button className="bg-primary text-white font-bold h-12 w-full max-w-xs mt-4">
                  VISUALIZAR CERTIFICADO PREMIUM
               </Button>
            </div>
          )}

          {step < 5 && (
            <div className="flex justify-between pt-6 border-t border-white/5">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={step === 1}
                className="text-gray-400"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={nextStep} className="bg-primary text-white px-8">
                Próximo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
