
'use client';

import { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Check, Sparkles, UserPlus } from 'lucide-react';
import { generateOnboardingPlan } from '@/ai/flows/onboarding-flow';
import type { OnboardingPlanOutput } from '@/ai/flows/onboarding-types';
import { useToast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<OnboardingPlanOutput | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [auditResponse, setAuditResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!employeeName || !employeeRole) return;
    setIsLoading(true);
    setPlan(null);
    setAuditResponse(null);
    try {
      const result = await generateOnboardingPlan({
        employeeName,
        employeeRole,
      });
      setPlan(result);
    } catch (error: any) {
      console.error('Error generating onboarding plan:', error);
       toast({
        variant: 'destructive',
        title: 'Erro de Protocolo.',
        description: error.message || 'Não foi possível gerar o plano de integração. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!plan) return;
    const planText = `
**PLANO DE INTEGRAÇÃO DE 30 DIAS PARA ${plan.employeeName.toUpperCase()}**

**MENSAGEM DE BOAS-VINDAS DO LÍDER:**
${plan.welcomeMessage}

---

**MISSÃO DA 1ª SEMANA (IMERSÃO E CULTURA):**
${plan.week1_mission}

---

**MISSÃO DOS PRIMEIROS 15 DIAS (TRAÇÃO E PROCESSOS):**
${plan.week2_mission}

---

**MISSÃO DOS 30 DIAS (AUTONOMIA E DESAFIO):**
${plan.month1_mission}

---

**TREINAMENTO ESTRATÉGICO RECOMENDADO:**
**Curso:** ${plan.recommendedCourse.title}
**Motivo:** ${plan.recommendedCourse.reason}
    `;
    navigator.clipboard.writeText(planText.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
     toast({
      title: 'Protocolo Copiado.',
      description: 'O plano de batalha está na sua área de transferência, pronto para ser entregue.',
    });
  };
  
   const handleAudit = (confirm: boolean) => {
    if (confirm) {
      setAuditResponse("Auditoria agendada. A Djeny irá contatá-lo em 30 dias para avaliar a performance. Missão aceita.");
      toast({
        title: 'Auditoria Agendada.',
        description: 'Compromisso firmado. A performance será auditada.',
      });
    } else {
      setAuditResponse("Entendido. Você assume total responsabilidade pelo resultado da integração. O risco é seu, Comandante.");
       toast({
        variant: 'destructive',
        title: 'Risco Assumido.',
        description: 'A responsável pela integração é exclusivamente sua.',
      });
    }
  };


  return (
    <div className="space-y-8">
      <div className="text-center">
        <UserPlus className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-3xl font-bold tracking-tighter text-blue-300 font-headline mt-4">
          Protocolo de Integração Nexus.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Gere um plano de batalha de 30 dias para cada novo soldado. Garanta que a cultura e a performance comecem no Dia 1.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md shadow-xl shadow-black/40">
        <CardHeader>
          <CardTitle>Gerar Novo Plano de Integração.</CardTitle>
          <CardDescription>
            Insira os dados do novo colaborador. A Djeny cuidará do resto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Nome do Colaborador</Label>
              <Input
                id="employeeName"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Ex: Maria Silva"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeRole">Cargo / Função</Label>
              <Input
                id="employeeRole"
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
                placeholder="Ex: Analista de Vendas Jr."
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Plano...
                </>
              ) : (
                'Gerar Plano de Batalha'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {plan && (
        <Card className="max-w-4xl mx-auto bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md shadow-xl shadow-black/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary"/>
                    Plano de Integração Gerado para {plan.employeeName}.
                </CardTitle>
                <CardDescription>Entregue este plano ao novo colaborador e ao seu gestor direto.</CardDescription>
            </div>
             <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
              {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {isCopied ? 'Copiado!' : 'Copiar Plano'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-sm prose-invert max-w-none text-gray-300">
            <div>
              <h4 className="font-bold text-primary">MENSAGEM DE BOAS-VINDAS DO LÍDER:</h4>
              <p className="border-l-2 border-primary pl-4 italic">{plan.welcomeMessage}</p>
            </div>
             <div>
              <h4 className="font-bold text-primary">MISSÃO DA 1ª SEMANA (IMERSÃO E CULTURA):</h4>
              <p className="whitespace-pre-line">{plan.week1_mission}</p>
            </div>
             <div>
              <h4 className="font-bold text-primary">MISSÃO DOS PRIMEIROS 15 DIAS (TRAÇÃO E PROCESSOS):</h4>
              <p className="whitespace-pre-line">{plan.week2_mission}</p>
            </div>
             <div>
              <h4 className="font-bold text-primary">MISSÃO DOS 30 DIAS (AUTONOMIA E DESAFIO):</h4>
              <p className="whitespace-pre-line">{plan.month1_mission}</p>
            </div>
             <div>
              <h4 className="font-bold text-primary">TREINAMENTO ESTRATÉGICO RECOMENDADO:</h4>
              <p><strong>Curso:</strong> {plan.recommendedCourse.title}</p>
              <p><strong>Motivo:</strong> {plan.recommendedCourse.reason}</p>
            </div>
          </CardContent>
           <CardContent>
             {!auditResponse ? (
              <div className="mt-6 border-t border-dashed border-primary/30 pt-6">
                <p className="text-center font-semibold text-primary">"Plano de batalha gerado, Comandante. Missão entregue. Devo agendar uma auditoria de performance com você sobre {plan.employeeName} para daqui a 30 dias?"</p>
                <div className="mt-4 flex justify-center gap-4">
                  <Button onClick={() => handleAudit(true)} variant="default">Sim, agendar auditoria</Button>
                  <Button onClick={() => handleAudit(false)} variant="destructive">Não, eu assumo o risco</Button>
                </div>
              </div>
            ) : (
               <div className="mt-6 border-t border-dashed border-primary/30 pt-6 text-center">
                 <p className="font-semibold text-gray-300">{auditResponse}</p>
               </div>
            )}
           </CardContent>
        </Card>
      )}
    </div>
  );
}
