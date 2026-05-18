'use client';

import React, { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  Copy, 
  Check, 
  Sparkles, 
  UserPlus, 
  ChevronLeft, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Activity, 
  Target, 
  Zap, 
  Clock, 
  BrainCircuit, 
  Lock, 
  CheckCircle, 
  FileCheck,
  AlertTriangle,
  HardHat,
  Scale,
  BookOpen,
  CalendarClock,
  FileWarning,
  Users,
  Star,
  HeartHandshake,
  Package
} from 'lucide-react';
import { generateOnboardingPlan } from '@/ai/flows/onboarding-flow';
import type { OnboardingPlanOutput } from '@/ai/flows/onboarding-types';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrainingCard } from '@/components/nexus/TrainingCard';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

export default function OnboardingPage() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<OnboardingPlanOutput | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [auditResponse, setAuditResponse] = useState<string | null>(null);
  const [activeTraining, setActiveTraining] = useState<string | null>(null);
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
  const { toast } = useToast();

  type CertStatus = 'locked' | 'available' | 'in-progress' | 'completed';
  type CertType = 'seguranca' | 'norma' | 'tecnico' | 'cultura';
  interface Cert { id: string; title: string; description: string; status: CertStatus; type: CertType; icon: React.ElementType; duration: string; }

  const [certifications, setCertifications] = useState<Cert[]>([
    { id: 'safety-1', title: 'Segurança em Primeiro Lugar', description: 'Uso obrigatório de EPIs e protocolos de zona de risco.', status: 'available', type: 'seguranca', icon: HardHat, duration: '45 min' },
    { id: 'norms-1', title: 'Normas Internas Nexus', description: 'Código de conduta, horários e ética operacional.', status: 'in-progress', type: 'norma', icon: Scale, duration: '30 min' },
    { id: 'technical-1', title: 'Manual de Maquinário v4', description: 'Operação básica e parada de emergência de prensas.', status: 'available', type: 'tecnico', icon: Zap, duration: '1h 20m' },
    { id: 'culture-1', title: 'Cultura de Elite', description: 'A história do Nexus e nossa visão de futuro.', status: 'locked', type: 'cultura', icon: BrainCircuit, duration: '20 min' },
  ]);
  const [isCertified, setIsCertified] = useState(false);
  const [isNormsCertified, setIsNormsCertified] = useState(false);
  const [isTechCertified, setIsTechCertified] = useState(false);
  const [isComplianceSigned, setIsComplianceSigned] = useState(false);

  const completedCerts = certifications.filter(c => c.status === 'completed').length;
  
  // Protocolo v3.0: Certificados ativos + Assinatura de Compliance
  // Itens bloqueados (em construção) não entram no total do protocolo v3.0 atual
  const activeCerts = certifications.filter(c => c.status !== 'locked');
  const totalSteps = activeCerts.length + 1; // +1 para o Termo de Conformidade
  const completedSteps = completedCerts + (isComplianceSigned ? 1 : 0);
  const progressPercent = (completedSteps / totalSteps) * 100;

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

  const handleStartTraining = (id: string) => {
    setActiveTraining(id);
    toast({
      title: 'Ambiente de Treinamento Ativo.',
      description: 'Iniciando protocolo de certificação técnica.',
    });
  };

  const handleCertify = () => {
    setCertifications(prev =>
      prev.map(c => c.id === 'safety-1' ? { ...c, status: 'completed' as const } : c)
    );
    setIsCertified(true);
    setActiveTraining(null);
    setActiveSubModule(null);
    toast({
      title: '🏅 Certificado Emitido!',
      description: 'Segurança em Primeiro Lugar — certificação registrada com sucesso no dossiê.',
    });
  };

  const handleNormsCertify = () => {
    setCertifications(prev =>
      prev.map(c => c.id === 'norms-1' ? { ...c, status: 'completed' as const } : c)
    );
    setIsNormsCertified(true);
    setActiveTraining(null);
    toast({
      title: '🏅 Certificado Emitido!',
      description: 'Normas Internas Nexus — certificação registrada com sucesso no dossiê.',
    });
  };

  const handleTechCertify = () => {
    setCertifications(prev =>
      prev.map(c => c.id === 'technical-1' ? { ...c, status: 'completed' as const } : c)
    );
    setIsTechCertified(true);
    setActiveTraining(null);
    toast({
      title: '🏅 Certificado Emitido!',
      description: 'Manual de Maquinário v4 — certificação registrada com sucesso no dossiê.',
    });
  };

  const handleComplianceSign = () => {
    setIsComplianceSigned(true);
    toast({
      title: '✅ Termo Assinado!',
      description: 'Ciência de segurança industrial registrada no protocolo NX-2024-RH.',
    });
  };

  // --- TRAINING VIEWERS ---
  
  if (activeTraining) {
    const training = certifications.find(c => c.id === activeTraining) || { title: 'Treinamento', icon: BookOpen };
    const Icon = training.icon;

    return (
      <SovereignShowcase moduleName="Treinamento e Integração" imagePath="/Nexus Intelligence RH/Nexus Intelligence RH.png">
        <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-12 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Header Treinamento Geral */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10", activeTraining === 'safety-1' ? "bg-rose-500/20 border-rose-500/30" : "bg-emerald-500/20 border-emerald-500/30")}>
                <Icon className={cn("h-8 w-8", activeTraining === 'safety-1' ? "text-rose-400" : "text-emerald-400")} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{training.title}</h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Módulo de Imersão e Certificação</p>
              </div>
            </div>
            <div className="flex gap-4">
              {activeSubModule && (
                <Button variant="outline" onClick={() => setActiveSubModule(null)} className="border-white/10 text-slate-400 hover:text-white">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Painel
                </Button>
              )}
              <Button variant="ghost" onClick={() => { setActiveTraining(null); setActiveSubModule(null); }} className="text-slate-500 hover:text-white">
                {activeSubModule ? 'Fechar Treinamento' : 'Sair do Treinamento'}
              </Button>
            </div>
          </div>

          {activeTraining === 'safety-1' && activeSubModule && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-4xl mx-auto"
             >
                <Card className="bg-zinc-950/60 border-2 border-emerald-500/20 backdrop-blur-md rounded-[40px] overflow-hidden">
                  <CardHeader className="p-10 border-b border-white/5 bg-emerald-500/5">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/20">
                          {activeSubModule === 'capacete' && <HardHat className="h-10 w-10 text-emerald-400" />}
                          {activeSubModule === 'protetor' && <Activity className="h-10 w-10 text-emerald-400" />}
                          {activeSubModule === 'oculos' && <Target className="h-10 w-10 text-emerald-400" />}
                          {activeSubModule === 'botas' && <Zap className="h-10 w-10 text-emerald-400" />}
                          {activeSubModule === 'bimanual' && <Lock className="h-10 w-10 text-emerald-400" />}
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">
                            {activeSubModule === 'capacete' && 'Apresentação: Capacete de Proteção'}
                            {activeSubModule === 'protetor' && 'Apresentação: Protetor Auricular'}
                            {activeSubModule === 'oculos' && 'Apresentação: Óculos de Segurança'}
                            {activeSubModule === 'botas' && 'Apresentação: Botas de Segurança'}
                            {activeSubModule === 'bimanual' && 'Apresentação: Acionamento Bi-manual'}
                          </CardTitle>
                          <CardDescription className="text-emerald-500/60 font-bold uppercase text-[10px] tracking-widest italic">Protocolo Detalhado v1.0</CardDescription>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                    <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center group">
                       {(() => {
                         const images: Record<string, string> = {
                           capacete: 'https://i.postimg.cc/rpsXzS0c/Capcete.png',
                           oculos: 'https://i.postimg.cc/xJvGgt06/Oculos.png',
                           protetor: 'https://i.postimg.cc/0MYGZc8t/Protetor-auricular(tipo-concha).png',
                           botas: 'https://i.postimg.cc/Whx15jh8/Botina.png',
                           bimanual: 'https://i.postimg.cc/D8RwxF85/Bimanual.png',
                         };
                         const currentImage = activeSubModule ? images[activeSubModule] : null;
                         
                         return currentImage ? (
                           <Image 
                             src={currentImage} 
                             alt={activeSubModule || 'Treinamento'} 
                             fill 
                             className="object-cover"
                           />
                         ) : (
                           <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs">Aguardando Imagem do Comandante...</p>
                         );
                       })()}
                       <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <h4 className="text-emerald-400 font-black uppercase tracking-widest text-xs italic flex items-center gap-2">
                          <BookOpen className="h-4 w-4" /> Detalhamento Técnico
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {activeSubModule === 'capacete' && 'O capacete de segurança é o primeiro escudo contra traumas cranianos. Em um ambiente com pontes rolantes e movimentação de carga, ele é vital para absorver impactos de objetos em queda.'}
                          {activeSubModule === 'protetor' && 'O ruído industrial acima de 85 decibéis causa danos irreversíveis aos cílios auditivos. O protetor auricular de alta atenuação garante que você mantenha sua saúde auditiva por toda a carreira.'}
                          {activeSubModule === 'oculos' && 'Fagulhas, cavacos de aço e respingos químicos são ameaças constantes. Os óculos com proteção lateral criam uma barreira impenetrável para seus olhos durante qualquer operação técnica.'}
                          {activeSubModule === 'botas' && 'Pisos escorregadios ou queda de componentes pesados são riscos diários. A biqueira de aço e o solado antiderrapante são sua base de sustentação segura no chão de fábrica.'}
                          {activeSubModule === 'bimanual' && 'O acionamento bi-manual é um sistema de controle de segurança que exige que o operador use as duas mãos simultaneamente para iniciar o ciclo da máquina, garantindo que elas estejam longe da área de prensagem.'}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-amber-400 font-black uppercase tracking-widest text-xs italic flex items-center gap-2">
                          <Activity className="h-4 w-4" /> Exemplo Prático
                        </h4>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 border-l-4 border-l-amber-500">
                          <p className="text-slate-400 text-xs leading-relaxed italic">
                            {activeSubModule === 'capacete' && '"Durante a manutenção de uma prensa, uma ferramenta cai do nível superior. O capacete absorve a energia do impacto, evitando uma lesão fatal."'}
                            {activeSubModule === 'protetor' && '"Operando próximo à linha de prensas de 2000 toneladas, o nível de ruído é extremo. Com o protetor, o operador mantém o foco e a calma sem fadiga auditiva."'}
                            {activeSubModule === 'oculos' && '"Ao realizar uma limpeza com ar comprimido ou lixamento, um fragmento de metal é projetado em direção ao rosto. Os óculos desviam o objeto, salvando a visão do operador."'}
                            {activeSubModule === 'botas' && '"Um componente de 20kg escorrega da bancada e cai diretamente sobre o pé do operador. A biqueira de aço impede o esmagamento dos dedos."'}
                            {activeSubModule === 'bimanual' && '"O operador posiciona a peça na prensa e aciona os dois botões laterais. A máquina só desce porque as mãos estão ocupadas nos controles, protegidas da zona de perigo."'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    <div className="flex justify-center">
                      <Button 
                        onClick={() => setActiveSubModule(null)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest h-14 px-12 rounded-2xl shadow-xl shadow-emerald-600/20"
                      >
                        Entendido, Próximo Protocolo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
             </motion.div>
          )}

          {activeTraining === 'safety-1' && !activeSubModule && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-zinc-950/60 border-2 border-white/5 backdrop-blur-md rounded-[40px] overflow-hidden">
                  <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                    <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <Activity className="h-5 w-5 text-emerald-400" /> 01. O que produzimos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 mb-6">
                      <Image 
                        src="https://i.postimg.cc/JzXbbFfq/Nexus-seguranca.png"
                        alt="Produção Nexus"
                        fill
                        className="object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <p className="text-lg font-bold text-white max-w-md leading-tight">
                          Fabricação de Maquinário Pesado e Componentes de Alta Precisão para o Agronegócio e Indústria 4.0.
                        </p>
                        <Badge className="bg-emerald-500 text-black font-black uppercase tracking-widest text-[9px]">LINHA ATIVA</Badge>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed italic">
                      "No ecossistema industrial Nexus, a fabricação de prensas e maquinário de alta tonelagem exige uma sinergia absoluta entre potência e responsabilidade. Nossa produção transforma matérias-primas brutas em componentes de precisão, mas cada movimento é monitorado por rigorosos protocolos de segurança. O uso de EPIs não é opcional, é o que garante a integridade de nossos especialistas diante de riscos mecânicos e térmicos. Operar com excelência significa operar com cuidado, respeitando os limites da máquina e a vida humana em cada ciclo produtivo. <span className="text-emerald-400 font-bold">Segurança em primeiro lugar</span>."
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-950/60 border-2 border-emerald-500/20 backdrop-blur-md rounded-[40px] overflow-hidden">
                  <CardHeader className="p-8 border-b border-white/5 bg-emerald-500/5">
                    <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" /> 02. Protocolo de EPIs Obrigatórios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <HardHat className="h-8 w-8 text-emerald-400" />
                        <h4 className="font-black text-white uppercase italic tracking-tighter">Capacete de Proteção</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Essencial para prevenir lesões contra impactos e objetos em queda na linha de produção. <span className="text-emerald-400 font-bold italic">Segurança em primeiro lugar</span>.
                      </p>
                      <Button onClick={() => setActiveSubModule('capacete')} variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl">
                        Apresentar Módulo
                      </Button>
                    </div>
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Activity className="h-8 w-8 text-emerald-400" />
                        <h4 className="font-black text-white uppercase italic tracking-tighter">Protetor Auricular</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Bloqueia o ruído excessivo das máquinas, preservando sua audição de danos permanentes. <span className="text-emerald-400 font-bold italic">Segurança em primeiro lugar</span>.
                      </p>
                      <Button onClick={() => setActiveSubModule('protetor')} variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl">
                        Apresentar Módulo
                      </Button>
                    </div>
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Target className="h-8 w-8 text-emerald-400" />
                        <h4 className="font-black text-white uppercase italic tracking-tighter">Óculos de Segurança</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Protegem seus olhos contra projeções de partículas, fagulhas e produtos químicos durante a operação. <span className="text-emerald-400 font-bold italic">Segurança em primeiro lugar</span>.
                      </p>
                      <Button onClick={() => setActiveSubModule('oculos')} variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl">
                        Apresentar Módulo
                      </Button>
                    </div>
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Zap className="h-8 w-8 text-emerald-400" />
                        <h4 className="font-black text-white uppercase italic tracking-tighter">Botas de Segurança</h4>
                      </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Com biqueira de aço, evitam esmagamentos e perfurações, garantindo estabilidade em pisos industriais. <span className="text-emerald-400 font-bold italic">Segurança em primeiro lugar</span>.
                    </p>
                    <Button onClick={() => setActiveSubModule('botas')} variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl">
                      Apresentar Módulo
                    </Button>
                  </div>
                  <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4 hover:border-emerald-500/30 transition-colors md:col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-3">
                      <Lock className="h-8 w-8 text-emerald-400" />
                      <h4 className="font-black text-white uppercase italic tracking-tighter">Acionamento Bi-manual para Máquinas</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sistema de segurança redundante que obriga o operador a manter as duas mãos ocupadas e fora da zona de prensagem durante o ciclo da máquina, eliminando o risco de esmagamentos acidentais. <span className="text-emerald-400 font-bold italic">Segurança em primeiro lugar</span>.
                    </p>
                    <Button onClick={() => setActiveSubModule('bimanual')} variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl">
                      Apresentar Módulo
                    </Button>
                  </div>
                </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className={cn(
                  "border-2 backdrop-blur-xl rounded-[40px] sticky top-8 transition-all duration-700",
                  isCertified
                    ? "bg-emerald-950/60 border-emerald-400/50 shadow-2xl shadow-emerald-500/20"
                    : "bg-zinc-950/80 border-emerald-500/30"
                )}>
                  <CardHeader className="p-8 border-b border-white/5">
                    <CardTitle className="text-lg font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                      <ShieldCheck className={cn("h-6 w-6 transition-colors duration-500", isCertified ? "text-emerald-300" : "text-emerald-400")} />
                      {isCertified ? 'Certificado Emitido' : 'Certificação Final'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {isCertified ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="flex flex-col items-center gap-6 py-4"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-400/30 blur-2xl rounded-full" />
                          <div className="relative p-6 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40">
                            <Award className="h-14 w-14 text-emerald-300" />
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-emerald-300 font-black uppercase tracking-widest text-sm">Certificado Válido</p>
                          <p className="text-xs text-slate-400 italic">"Segurança em Primeiro Lugar" — protocolo NR-12 concluído e registrado no dossiê do colaborador.</p>
                        </div>
                        <Badge className="bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] px-6 py-2 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-2" /> Aprovado
                        </Badge>
                      </motion.div>
                    ) : (
                      <>
                        {/* Declaração de ciência */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Termo de Declaração</p>
                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            "Declaro que compreendi todos os protocolos de EPIs e riscos apresentados neste módulo de treinamento, conforme as normas <span className="text-emerald-400 font-bold not-italic">NR-12</span> e <span className="text-emerald-400 font-bold not-italic">NR-35</span>."
                          </p>
                        </div>

                        {/* Escala disciplinar */}
                        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 overflow-hidden">
                          <div className="px-6 py-4 border-b border-rose-500/10 flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Ciência das Consequências Disciplinares</p>
                          </div>
                          <div className="p-5 space-y-3">
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              O não uso correto dos EPIs obrigatórios, ou o descumprimento dos protocolos de segurança, sujeita o colaborador às seguintes medidas disciplinares progressivas:
                            </p>
                            <div className="space-y-2 mt-2">
                              {[
                                { step: '01', label: 'Advertência Verbal', color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
                                { step: '02', label: 'Advertência Escrita', color: 'text-orange-400 border-orange-500/30 bg-orange-500/5' },
                                { step: '03', label: 'Suspensão', color: 'text-red-400 border-red-500/30 bg-red-500/5' },
                                { step: '04', label: 'Demissão por Justa Causa', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
                              ].map(({ step, label, color }) => (
                                <div key={step} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${color}`}>
                                  <span className="text-[9px] font-black opacity-60">{step}</span>
                                  <span className="text-[11px] font-bold">{label}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-500 italic pt-1">
                              Conforme Consolidação das Leis do Trabalho (CLT) — Art. 482 e regulamento interno Nexus.
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={handleCertify}
                          className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/30"
                        >
                          <Award className="mr-3 h-5 w-5" /> Certificar Agora
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTraining === 'norms-1' && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">

              {/* ── 01 HORÁRIOS ── */}
              <Card className="bg-zinc-950/60 border-2 border-amber-500/20 backdrop-blur-md rounded-[40px] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-amber-500/5">
                  <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                    <CalendarClock className="h-6 w-6 text-amber-400" /> 01. Cumprimento de Horários
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    A pontualidade é um compromisso com a equipe e com a produção. O horário de entrada deve ser rigorosamente respeitado. Atrasos geram impacto direto na linha de produção e são registrados no <span className="text-amber-400 font-bold">Índice de Mérito (IMN)</span> do colaborador.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {[
                      { label: 'Entrada', value: '07h00', sub: 'Tolerância: 5 min' },
                      { label: 'Intervalo', value: '12h00 – 13h00', sub: '1 hora de almoço' },
                      { label: 'Saída', value: '17h00 / 18h00', sub: 'Conforme turno' },
                    ].map(({ label, value, sub }) => (
                      <div key={label} className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">{label}</p>
                        <p className="text-lg font-black text-white">{value}</p>
                        <p className="text-[10px] text-slate-500">{sub}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ── 02 FALTAS E ATESTADOS ── */}
              <Card className="bg-zinc-950/60 border-2 border-orange-500/20 backdrop-blur-md rounded-[40px] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-orange-500/5">
                  <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                    <FileWarning className="h-6 w-6 text-orange-400" /> 02. Faltas e Atestados Médicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Em caso de falta, o colaborador deve comunicar o supervisor <span className="text-orange-400 font-bold">antes do início do turno</span> e apresentar o comprovante ou atestado médico no primeiro dia de retorno ao trabalho.
                  </p>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Documentos Aceitos</p>
                    {[
                      { ok: true, text: 'Atestado de encaminhamento a especialista' },
                      { ok: true, text: 'Atestado emitido por médico especialista' },
                      { ok: true, text: 'Comprovante de internação ou cirurgia' },
                      { ok: false, text: 'Consulta em UPA / Pronto-socorro simples' },
                    ].map(({ ok, text }) => (
                      <div key={text} className="flex items-center gap-3">
                        {ok
                          ? <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                          : <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />}
                        <span className={`text-xs font-medium ${ok ? 'text-slate-300' : 'text-rose-400'}`}>{text}</span>
                      </div>
                    ))}
                  </div>
                  {/* Observação especial */}
                  <div className="flex gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Observação Importante</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Quando a empresa disponibilizar médico do trabalho nas dependências, <span className="text-amber-300 font-bold">somente atestados de encaminhamento a especialista ou de médico especialista serão válidos</span> para abono de falta. Atestados de clínica geral emitidos externamente não serão aceitos neste cenário.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── 03 EPIs, COMPORTAMENTO, HIERARQUIA, RESPEITO, COMPROMETIMENTO ── */}
              <Card className="bg-zinc-950/60 border-2 border-slate-700/50 backdrop-blur-md rounded-[40px] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                    <HeartHandshake className="h-6 w-6 text-slate-300" /> 03. Conduta, Hierarquia e Comprometimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: HardHat,
                      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                      title: 'EPIs Obrigatórios',
                      text: 'O uso de todos os Equipamentos de Proteção Individual é obrigatório em qualquer área de produção. A recusa configura infração grave.'
                    },
                    {
                      icon: Users,
                      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                      title: 'Hierarquia',
                      text: 'Respeite a cadeia de comando. Demandas e problemas devem ser comunicados ao supervisor imediato antes de escalar para níveis superiores.'
                    },
                    {
                      icon: HeartHandshake,
                      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                      title: 'Respeito Mútuo',
                      text: 'O ambiente de trabalho Nexus é de respeito incondicional. Discriminação, assédio ou qualquer forma de desrespeito resultam em demissão imediata.'
                    },
                    {
                      icon: Target,
                      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                      title: 'Comprometimento',
                      text: 'Entregue o que foi combinado, no prazo acordado. Qualidade e responsabilidade são a base da cultura Nexus. A excelência não é opcional.'
                    },
                    {
                      icon: Activity,
                      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                      title: 'Comportamento',
                      text: 'Uso de celular é permitido apenas nos intervalos. Proibido consumo de alimentos na linha de produção. Manter o posto de trabalho organizado é dever de todos.'
                    },
                    {
                      icon: BookOpen,
                      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                      title: 'Código de Ética',
                      text: 'Informações internas, processos e clientes são confidenciais. Qualquer vazamento de dados da empresa constitui falta grave passível de demissão por justa causa.'
                    },
                  ].map(({ icon: Icon, color, title, text }) => (
                    <div key={title} className={`p-6 rounded-[28px] border space-y-3 hover:opacity-90 transition-opacity ${color}`}>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" />
                        <h4 className="font-black text-white uppercase italic tracking-tight">{title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* ── 04 PRÊMIO ASSIDUIDADE ── */}
              <Card className="bg-zinc-950/60 border-2 border-emerald-500/30 backdrop-blur-md rounded-[40px] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-emerald-500/5">
                  <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                    <Star className="h-6 w-6 text-emerald-400" /> 04. Prêmio Assiduidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full" />
                      <div className="relative p-8 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30">
                        <Package className="h-16 w-16 text-emerald-300" />
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        O colaborador que atingir <span className="text-emerald-400 font-black">assiduidade perfeita no mês</span> — sem faltas, atestados médicos ou atrasos registrados — receberá como reconhecimento:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { label: 'Cesta Básica', desc: 'Kit mensal de alimentos essenciais entregue ao final do período.' },
                          { label: 'Vale Alimentação', desc: 'Crédito em cartão alimentação como alternativa à cesta física.' },
                        ].map(({ label, desc }) => (
                          <div key={label} className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-emerald-400" />
                              <p className="text-sm font-black text-emerald-300 uppercase italic">{label}</p>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                        <p className="text-[11px] text-rose-400 font-bold leading-relaxed">
                          ⚠ Qualquer falta (mesmo com atestado), atraso ou advertência no mês encerra automaticamente o direito ao prêmio naquele período.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              </div>{/* end left col */}

              {/* ── PAINEL CERTIFICAÇÃO ── */}
              <div className="space-y-6">
                <Card className={cn(
                  "border-2 backdrop-blur-xl rounded-[40px] sticky top-8 transition-all duration-700",
                  isNormsCertified
                    ? "bg-amber-950/60 border-amber-400/50 shadow-2xl shadow-amber-500/20"
                    : "bg-zinc-950/80 border-amber-500/30"
                )}>
                  <CardHeader className="p-8 border-b border-white/5">
                    <CardTitle className="text-lg font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                      <Scale className={cn("h-6 w-6 transition-colors duration-500", isNormsCertified ? "text-amber-300" : "text-amber-400")} />
                      {isNormsCertified ? 'Certificado Emitido' : 'Certificação Final'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {isNormsCertified ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="flex flex-col items-center gap-6 py-4"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full" />
                          <div className="relative p-6 rounded-full bg-amber-500/20 border-2 border-amber-400/40">
                            <Award className="h-14 w-14 text-amber-300" />
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-amber-300 font-black uppercase tracking-widest text-sm">Certificado Válido</p>
                          <p className="text-xs text-slate-400 italic">"Normas Internas Nexus" — código de conduta assimilado e registrado no dossiê do colaborador.</p>
                        </div>
                        <Badge className="bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] px-6 py-2 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-2" /> Aprovado
                        </Badge>
                      </motion.div>
                    ) : (
                      <>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Termo de Declaração</p>
                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            "Declaro que li e compreendi as Normas Internas Nexus, comprometendo-me a cumpri-las integralmente durante toda a minha jornada na empresa."
                          </p>
                        </div>
                        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 overflow-hidden">
                          <div className="px-6 py-4 border-b border-rose-500/10 flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Consequências Disciplinares</p>
                          </div>
                          <div className="p-5 space-y-3">
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              O descumprimento das normas internas sujeita o colaborador às seguintes medidas progressivas:
                            </p>
                            <div className="space-y-2">
                              {[
                                { step: '01', label: 'Advertência Verbal', color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
                                { step: '02', label: 'Advertência Escrita', color: 'text-orange-400 border-orange-500/30 bg-orange-500/5' },
                                { step: '03', label: 'Suspensão', color: 'text-red-400 border-red-500/30 bg-red-500/5' },
                                { step: '04', label: 'Demissão por Justa Causa', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
                              ].map(({ step, label, color }) => (
                                <div key={step} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${color}`}>
                                  <span className="text-[9px] font-black opacity-60">{step}</span>
                                  <span className="text-[11px] font-bold">{label}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-500 italic pt-1">Conforme CLT — Art. 482 e regulamento interno Nexus.</p>
                          </div>
                        </div>
                        <Button
                          onClick={handleNormsCertify}
                          className="w-full h-14 bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-600/20 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Award className="mr-3 h-5 w-5" /> Certificar Agora
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>{/* end right col */}
              </div>{/* end grid */}
            </div>
          )}

          {activeTraining === 'technical-1' && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">

                  {/* 01 TREINAMENTO OBRIGATÓRIO */}
                  <Card className="bg-zinc-950/60 border-2 border-blue-500/20 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-blue-500/5">
                      <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-blue-400" /> 01. Treinamento Obrigatório
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Nenhum colaborador está autorizado a operar qualquer máquina sem antes ter recebido o <span className="text-blue-400 font-bold">treinamento específico para aquele equipamento</span>. O treinamento é realizado após o ingresso na empresa, conduzido pelo líder de produção ou técnico responsável.
                      </p>
                      <div className="flex gap-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                        <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Regra Absoluta</p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Operar máquina sem treinamento homologado configura infração grave, sujeitando o colaborador às medidas disciplinares previstas no regulamento interno e comprometendo o <span className="text-blue-300 font-bold">Índice de Mérito (IMN)</span>.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 02 ACIONAMENTO BI-MANUAL + BARREIRAS */}
                  <Card className="bg-zinc-950/60 border-2 border-cyan-500/20 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-cyan-500/5">
                      <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                        <Lock className="h-6 w-6 text-cyan-400" /> 02. Sistemas de Segurança da Máquina
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          icon: Lock,
                          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                          title: 'Acionamento Bi-manual',
                          text: 'O ciclo da máquina só é iniciado com ambas as mãos nos botões de acionamento simultaneamente. Este sistema garante que as mãos do operador estejam fora da zona de perigo durante toda a prensagem.',
                        },
                        {
                          icon: ShieldCheck,
                          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                          title: 'Barreira e Sensores',
                          text: 'As máquinas possuem sistema de barreira de luz e sensores de segurança que interrompem automaticamente o ciclo caso haja qualquer intrusão na zona de risco durante a operação.',
                        },
                      ].map(({ icon: Icon, color, title, text }) => (
                        <div key={title} className={`p-6 rounded-[28px] border space-y-3 ${color}`}>
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6" />
                            <h4 className="font-black text-white uppercase italic tracking-tight">{title}</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* 03 FALHAS + MANUTENÇÃO + LIMPEZA */}
                  <Card className="bg-zinc-950/60 border-2 border-slate-700/50 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                      <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-amber-400" /> 03. Falhas, Manutenção e Organização
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                      {[
                        {
                          ok: true,
                          icon: Activity,
                          color: 'border-amber-500/20 bg-amber-500/5',
                          label: 'Ao detectar qualquer falha ou anomalia',
                          text: 'Pare a máquina imediatamente e acione o líder ou responsável técnico. Nunca tente diagnosticar ou resolver o problema por conta própria.',
                        },
                        {
                          ok: false,
                          icon: Zap,
                          color: 'border-rose-500/20 bg-rose-500/5',
                          label: 'Manutenções e ajustes são PROIBIDOS',
                          text: 'Apenas técnicos autorizados podem realizar manutenção, ajuste ou troca de componentes. Intervenções não autorizadas configuram falta grave e invalidam a garantia do equipamento.',
                        },
                        {
                          ok: true,
                          icon: CheckCircle,
                          color: 'border-emerald-500/20 bg-emerald-500/5',
                          label: 'Manter o equipamento limpo e organizado',
                          text: 'Ao final de cada turno, limpe a área de trabalho, remova resíduos e verifique se a máquina está desligada e em condições adequadas para o próximo operador.',
                        },
                      ].map(({ ok, icon: Icon, color, label, text }) => (
                        <div key={label} className={`flex gap-5 p-6 rounded-2xl border ${color}`}>
                          <Icon className={`h-6 w-6 shrink-0 mt-0.5 ${ok ? 'text-emerald-400' : 'text-rose-400'}`} />
                          <div className="space-y-1">
                            <p className={`text-[11px] font-black uppercase tracking-widest ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>{label}</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                </div>{/* end left col */}

                {/* PAINEL CERTIFICAÇÃO */}
                <div className="space-y-6">
                  <Card className={cn(
                    "border-2 backdrop-blur-xl rounded-[40px] sticky top-8 transition-all duration-700",
                    isTechCertified
                      ? "bg-blue-950/60 border-blue-400/50 shadow-2xl shadow-blue-500/20"
                      : "bg-zinc-950/80 border-blue-500/30"
                  )}>
                    <CardHeader className="p-8 border-b border-white/5">
                      <CardTitle className="text-lg font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                        <Zap className={cn("h-6 w-6 transition-colors duration-500", isTechCertified ? "text-blue-300" : "text-blue-400")} />
                        {isTechCertified ? 'Certificado Emitido' : 'Certificação Final'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      {isTechCertified ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          className="flex flex-col items-center gap-6 py-4"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-400/30 blur-2xl rounded-full" />
                            <div className="relative p-6 rounded-full bg-blue-500/20 border-2 border-blue-400/40">
                              <Award className="h-14 w-14 text-blue-300" />
                            </div>
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-blue-300 font-black uppercase tracking-widest text-sm">Certificado Válido</p>
                            <p className="text-xs text-slate-400 italic">"Manual de Maquinário v4" — protocolo de operação assimilado e registrado no dossiê.</p>
                          </div>
                          <Badge className="bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] px-6 py-2 rounded-full">
                            <CheckCircle className="h-3 w-3 mr-2" /> Aprovado
                          </Badge>
                        </motion.div>
                      ) : (
                        <>
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Termo de Declaração</p>
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                              "Declaro que li e compreendi o Manual de Maquinário v4, estando ciente das regras de operação segura e dos protocolos de emergência."
                            </p>
                          </div>
                          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-rose-500/10 flex items-center gap-3">
                              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                              <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Consequências Disciplinares</p>
                            </div>
                            <div className="p-5 space-y-3">
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                O descumprimento das normas de operação e segurança de maquinário sujeita o colaborador às medidas progressivas:
                              </p>
                              <div className="space-y-2">
                                {[
                                  { step: '01', label: 'Advertência Verbal', color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
                                  { step: '02', label: 'Advertência Escrita', color: 'text-orange-400 border-orange-500/30 bg-orange-500/5' },
                                  { step: '03', label: 'Suspensão', color: 'text-red-400 border-red-500/30 bg-red-500/5' },
                                  { step: '04', label: 'Demissão por Justa Causa', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
                                ].map(({ step, label, color }) => (
                                  <div key={step} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${color}`}>
                                    <span className="text-[9px] font-black opacity-60">{step}</span>
                                    <span className="text-[11px] font-bold">{label}</span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-500 italic pt-1">Conforme CLT — Art. 482 e regulamento interno Nexus.</p>
                            </div>
                          </div>
                          <Button
                            onClick={handleTechCertify}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 transition-all duration-300 hover:scale-[1.02]"
                          >
                            <Award className="mr-3 h-5 w-5" /> Certificar Agora
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>{/* end right col */}
              </div>{/* end grid */}
            </div>
          )}

          {activeTraining === 'culture-1' && (
            <div className="max-w-4xl mx-auto space-y-8">
               <Card className="bg-zinc-950/60 border-2 border-emerald-500/20 backdrop-blur-md rounded-[40px] overflow-hidden p-10">
                  <div className="text-center space-y-4">
                    <BrainCircuit className="h-16 w-16 text-emerald-400 mx-auto" />
                    <h2 className="text-3xl font-black text-white uppercase italic">Cultura de Elite</h2>
                    <p className="text-slate-400">Em construção: Detalhando história e visão de futuro.</p>
                  </div>
               </Card>
            </div>
          )}
        </motion.div>
      </div>
      </SovereignShowcase>
    );
  }

  return (
    <SovereignShowcase moduleName="Treinamento e Integração" imagePath="/Nexus Intelligence RH/Nexus Intelligence RH.png">
      <div className="min-h-screen bg-[#020617] text-slate-200 p-8 space-y-12 relative overflow-hidden">
      
      {/* HERO SECTION */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-slate-900 via-slate-900/50 to-[#020617] border border-white/5 shadow-2xl"
      >
          <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-500/5 blur-[120px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-[30%] h-full bg-emerald-900/10 blur-[100px] rounded-full" />
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
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest italic">
                              Certification Protocol v3.0
                          </Badge>
                          <div className="h-[1px] w-12 bg-emerald-500/30" />
                      </div>
                      <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white font-headline uppercase leading-none">
                          Treinamento & <br />
                          <span className="text-emerald-400 italic">Integração Nexus</span>
                      </h1>
                      <p className="text-lg lg:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                          Garanta a segurança e a conformidade técnica desde o Dia 1. 
                          Protocolos de treinamento auditáveis e integrados ao Índice de Mérito.
                      </p>
                  </motion.div>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10">
                      <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                              <span>Progresso de Certificação</span>
                              <span className="text-emerald-400">{Math.round(progressPercent)}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2 w-64 bg-white/5" />
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-black text-white">{completedSteps}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Concluídos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-white">{totalSteps - completedSteps}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pendentes</p>
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
                  <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full group-hover:bg-emerald-500/30 transition-all duration-700" />
                  <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                      <Image 
                          src="https://i.postimg.cc/wjg8DCPL/Nexus-RH-Djeny.png"
                          alt="Treinamento e Integração"
                          fill
                          className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Analista Djeny</span>
                              <Badge className="bg-emerald-500 text-black border-none font-black text-[9px]">ONLINE</Badge>
                          </div>
                      </div>
                  </div>
              </motion.div>
          </div>
      </motion.div>

      <Tabs defaultValue="seguranca" className="w-full space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <TabsList className="bg-slate-900/60 border border-white/5 p-1 rounded-2xl h-14">
                <TabsTrigger value="seguranca" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-8 h-full">
                    <ShieldCheck className="h-4 w-4 mr-2" /> Portão de Segurança
                </TabsTrigger>
                <TabsTrigger value="plano" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-8 h-full">
                    <FileCheck className="h-4 w-4 mr-2" /> Plano de Batalha
                </TabsTrigger>
                <TabsTrigger value="dossie" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-8 h-full">
                    <Activity className="h-4 w-4 mr-2" /> Dossiê Técnico
                </TabsTrigger>
            </TabsList>

            <Button variant="ghost" asChild className="text-slate-500 hover:text-white group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl px-6 h-12">
                <Link href="/intelligence/rh">
                    <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Voltar ao Hub
                </Link>
            </Button>
        </div>

        <TabsContent value="seguranca" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {certifications.map((cert) => (
                    <TrainingCard 
                        key={cert.id}
                        {...cert}
                        onStart={() => handleStartTraining(cert.id)}
                    />
                ))}
            </div>

            {/* Aviso de Compliance */}
            <div className={cn(
                "rounded-[40px] border-2 p-10 flex flex-col md:flex-row items-center gap-8 transition-all duration-700",
                isComplianceSigned 
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10" 
                    : "border-rose-500/20 bg-rose-500/5"
            )}>
                <div className={cn(
                    "p-6 rounded-full border transition-colors duration-500",
                    isComplianceSigned 
                        ? "bg-emerald-500/20 border-emerald-500/30" 
                        : "bg-rose-500/20 border-rose-500/30"
                )}>
                    {isComplianceSigned ? (
                        <ShieldCheck className="h-10 w-10 text-emerald-400" />
                    ) : (
                        <AlertTriangle className="h-10 w-10 text-rose-400" />
                    )}
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                        {isComplianceSigned ? 'Conformidade de Segurança Ativa' : 'Aviso de Segurança Industrial'}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {isComplianceSigned 
                            ? 'Você confirmou ciência de todos os protocolos NR-12 e NR-35. Seu acesso ao maquinário pesado está agora em fase de homologação pelo supervisor.'
                            : 'De acordo com as normas NR-12 e NR-35, nenhum colaborador está autorizado a operar maquinário pesado sem a conclusão de todos os módulos de segurança. O descumprimento gera invalidação imediata do Índice de Mérito (IMN).'}
                    </p>
                </div>
                <Button 
                    onClick={handleComplianceSign}
                    disabled={isComplianceSigned}
                    className={cn(
                        "font-black uppercase tracking-widest h-14 px-10 rounded-2xl transition-all duration-500",
                        isComplianceSigned 
                            ? "bg-emerald-500 text-black cursor-default" 
                            : "bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/20"
                    )}
                >
                    {isComplianceSigned ? (
                        <span className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" /> Termo Assinado
                        </span>
                    ) : 'Assinar Termo de Ciência'}
                </Button>
            </div>
        </TabsContent>

        <TabsContent value="plano" className="space-y-12">
            <div className="max-w-4xl mx-auto space-y-10">
                <Card className="bg-zinc-950/60 border-2 border-emerald-500/20 backdrop-blur-md shadow-xl shadow-black/40 rounded-[40px] overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5 bg-emerald-500/5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Gerar Novo Plano de Batalha</CardTitle>
                                <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Inteligência Estratégica Djeny</CardDescription>
                            </div>
                            <Sparkles className="h-10 w-10 text-emerald-500/40" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nome do Colaborador</Label>
                                    <Input
                                        value={employeeName}
                                        onChange={(e) => setEmployeeName(e.target.value)}
                                        placeholder="Ex: Pedro Azuin"
                                        className="bg-black/40 border-white/10 h-14 rounded-2xl px-6 font-bold text-white focus:border-emerald-500"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Cargo / Função</Label>
                                    <Input
                                        value={employeeRole}
                                        onChange={(e) => setEmployeeRole(e.target.value)}
                                        placeholder="Ex: Operador Especialista"
                                        className="bg-black/40 border-white/10 h-14 rounded-2xl px-6 font-bold text-white focus:border-emerald-500"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest h-16 rounded-[28px] text-lg shadow-2xl shadow-emerald-600/20" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                        Calculando Plano de Batalha...
                                    </>
                                ) : (
                                    'Gerar Missão de 30 Dias'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {plan && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="bg-zinc-950/60 border-2 border-emerald-500/20 backdrop-blur-md shadow-xl shadow-black/40 rounded-[40px] overflow-hidden">
                            <CardHeader className="p-10 border-b border-white/5 flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                                        <Target className="h-8 w-8 text-emerald-500" />
                                        Plano de Missão: {plan.employeeName}
                                    </CardTitle>
                                    <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Protocolo de Imersão Nexus RH</CardDescription>
                                </div>
                                <Button onClick={handleCopyToClipboard} variant="outline" className="border-white/10 text-slate-400 hover:text-white rounded-2xl h-12 px-6">
                                    {isCopied ? <CheckCircle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                    {isCopied ? 'Copiado!' : 'Copiar Protocolo'}
                                </Button>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black text-[9px] uppercase tracking-widest">Semana 1: Imersão</Badge>
                                        <p className="text-sm text-slate-300 leading-relaxed italic">"{plan.week1_mission}"</p>
                                    </div>
                                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                                        <Badge className="bg-blue-500/10 text-blue-400 border-none font-black text-[9px] uppercase tracking-widest">Semana 2: Tração</Badge>
                                        <p className="text-sm text-slate-300 leading-relaxed italic">"{plan.week2_mission}"</p>
                                    </div>
                                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                                        <Badge className="bg-purple-500/10 text-purple-400 border-none font-black text-[9px] uppercase tracking-widest">Mês 1: Autonomia</Badge>
                                        <p className="text-sm text-slate-300 leading-relaxed italic">"{plan.month1_mission}"</p>
                                    </div>
                                </div>

                                <div className="p-10 bg-black/40 rounded-[40px] border border-white/5 space-y-6">
                                    <div className="flex items-center gap-4 text-emerald-400">
                                        <BookOpen className="h-6 w-6" />
                                        <h4 className="font-black uppercase tracking-widest italic">Treinamento Recomendado pela IA</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg font-bold text-white uppercase">{plan.recommendedCourse.title}</p>
                                        <p className="text-sm text-slate-400 leading-relaxed">Justificativa: {plan.recommendedCourse.reason}</p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 text-center">
                                    <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-4">Ação Necessária</p>
                                    {!auditResponse ? (
                                        <div className="flex flex-col items-center gap-6">
                                            <p className="text-lg font-bold text-white italic">"Deseja agendar uma auditoria de performance para daqui a 30 dias?"</p>
                                            <div className="flex gap-4">
                                                <Button onClick={() => handleAudit(true)} className="bg-emerald-600 hover:bg-emerald-500 h-12 px-10 rounded-2xl">Confirmar Auditoria</Button>
                                                <Button onClick={() => handleAudit(false)} variant="ghost" className="text-rose-400 hover:text-rose-300">Assumir Risco</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-white font-bold italic">
                                            {auditResponse}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </TabsContent>

        <TabsContent value="dossie" className="space-y-8">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-zinc-950/60 border-2 border-slate-700/50 backdrop-blur-md shadow-xl rounded-[40px] overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5">
                        <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Dossiê de Conformidade Técnica</CardTitle>
                        <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Registros Auditáveis e Certificações</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-[32px]">
                            <div className="text-center space-y-4">
                                <FileCheck className="h-12 w-12 text-slate-700 mx-auto" />
                                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Nenhum dossiê selecionado para visualização.</p>
                                <Button variant="outline" className="border-white/10 text-slate-400 rounded-xl">Buscar Colaborador</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>

      <LegalSafeguard module="INTEGRAÇÃO NEXUS" protocol="NX-7742-RH" />
      </div>
    </SovereignShowcase>
  );
}
