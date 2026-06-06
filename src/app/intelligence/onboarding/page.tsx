'use client';

import React, { useState, useEffect, FormEvent } from 'react';
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
  Package,
  Eye,
  Printer,
  X
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
import { QrCode } from '@/components/ui/qr-code';
import { permanentEmployees } from '@/lib/data/employees';

export default function OnboardingPage() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<OnboardingPlanOutput | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [auditResponse, setAuditResponse] = useState<string | null>(null);
  const [activeTraining, setActiveTraining] = useState<string | null>(null);
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<'digital' | 'print'>('digital');
  const { toast } = useToast();

  type CertStatus = 'locked' | 'available' | 'in-progress' | 'completed';
  type CertType = 'seguranca' | 'norma' | 'tecnico' | 'cultura';
  interface Cert { id: string; title: string; description: string; status: CertStatus; type: CertType; icon: React.ElementType; duration: string; }

  const getEmployeesList = () => {
    if (typeof window === 'undefined') return permanentEmployees;
    const stored = localStorage.getItem('nexus_permanent_employees');
    return stored ? JSON.parse(stored) : permanentEmployees;
  };

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

  const saveTrainingProgress = (
    currentName: string,
    certs: Cert[],
    certified: boolean,
    normsCertified: boolean,
    techCertified: boolean,
    complianceSigned: boolean
  ) => {
    if (!currentName) return;
    const data = {
      certifications: certs.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        status: c.status,
        type: c.type,
        duration: c.duration
      })),
      isCertified: certified,
      isNormsCertified: normsCertified,
      isTechCertified: techCertified,
      isComplianceSigned: complianceSigned
    };
    localStorage.setItem(`nexus_training_status_${currentName}`, JSON.stringify(data));
  };

  useEffect(() => {
    if (!employeeName) {
      setCertifications([
        { id: 'safety-1', title: 'Segurança em Primeiro Lugar', description: 'Uso obrigatório de EPIs e protocolos de zona de risco.', status: 'available', type: 'seguranca', icon: HardHat, duration: '45 min' },
        { id: 'norms-1', title: 'Normas Internas Nexus', description: 'Código de conduta, horários e ética operacional.', status: 'in-progress', type: 'norma', icon: Scale, duration: '30 min' },
        { id: 'technical-1', title: 'Manual de Maquinário v4', description: 'Operação básica e parada de emergência de prensas.', status: 'available', type: 'tecnico', icon: Zap, duration: '1h 20m' },
        { id: 'culture-1', title: 'Cultura de Elite', description: 'A história do Nexus e nossa visão de futuro.', status: 'locked', type: 'cultura', icon: BrainCircuit, duration: '20 min' },
      ]);
      setIsCertified(false);
      setIsNormsCertified(false);
      setIsTechCertified(false);
      setIsComplianceSigned(false);
      return;
    }

    const saved = localStorage.getItem(`nexus_training_status_${employeeName}`);
    if (saved) {
      const data = JSON.parse(saved);
      const iconMap: Record<string, React.ElementType> = {
        'safety-1': HardHat,
        'norms-1': Scale,
        'technical-1': Zap,
        'culture-1': BrainCircuit
      };
      
      const certsWithIcons = data.certifications.map((c: any) => ({
        ...c,
        icon: iconMap[c.id] || BookOpen
      }));

      setCertifications(certsWithIcons);
      setIsCertified(data.isCertified);
      setIsNormsCertified(data.isNormsCertified);
      setIsTechCertified(data.isTechCertified);
      setIsComplianceSigned(data.isComplianceSigned);
    } else {
      setCertifications([
        { id: 'safety-1', title: 'Segurança em Primeiro Lugar', description: 'Uso obrigatório de EPIs e protocolos de zona de risco.', status: 'available' as CertStatus, type: 'seguranca' as CertType, icon: HardHat, duration: '45 min' },
        { id: 'norms-1', title: 'Normas Internas Nexus', description: 'Código de conduta, horários e ética operacional.', status: 'in-progress' as CertStatus, type: 'norma' as CertType, icon: Scale, duration: '30 min' },
        { id: 'technical-1', title: 'Manual de Maquinário v4', description: 'Operação básica e parada de emergência de prensas.', status: 'available' as CertStatus, type: 'tecnico' as CertType, icon: Zap, duration: '1h 20m' },
        { id: 'culture-1', title: 'Cultura de Elite', description: 'A história do Nexus e nossa visão de futuro.', status: 'locked' as CertStatus, type: 'cultura' as CertType, icon: BrainCircuit, duration: '20 min' },
      ]);
      setIsCertified(false);
      setIsNormsCertified(false);
      setIsTechCertified(false);
      setIsComplianceSigned(false);
    }
  }, [employeeName]);


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
    const newCerts = certifications.map(c => c.id === 'safety-1' ? { ...c, status: 'completed' as const } : c);
    setCertifications(newCerts);
    setIsCertified(true);
    saveTrainingProgress(employeeName, newCerts, true, isNormsCertified, isTechCertified, isComplianceSigned);
    setActiveTraining(null);
    setActiveSubModule(null);
    toast({
      title: '🏅 Certificado Emitido!',
      description: 'Segurança em Primeiro Lugar — certificação registrada com sucesso no dossiê.',
    });
  };

  const handleNormsCertify = () => {
    const newCerts = certifications.map(c => c.id === 'norms-1' ? { ...c, status: 'completed' as const } : c);
    setCertifications(newCerts);
    setIsNormsCertified(true);
    saveTrainingProgress(employeeName, newCerts, isCertified, true, isTechCertified, isComplianceSigned);
    setActiveTraining(null);
    toast({
      title: '🏅 Certificado Emitido!',
      description: 'Normas Internas Nexus — certificação registrada com sucesso no dossiê.',
    });
  };

  const handleTechCertify = () => {
    const newCerts = certifications.map(c => c.id === 'technical-1' ? { ...c, status: 'completed' as const } : c);
    setCertifications(newCerts);
    setIsTechCertified(true);
    saveTrainingProgress(employeeName, newCerts, isCertified, isNormsCertified, true, isComplianceSigned);
    setActiveTraining(null);
    toast({
      title: '🏅 Certificado Emitido!',
      description: 'Manual de Maquinário v4 — certificação registrada com sucesso no dossiê.',
    });
  };

  const handleComplianceSign = () => {
    setIsComplianceSigned(true);
    saveTrainingProgress(employeeName, certifications, isCertified, isNormsCertified, isTechCertified, true);
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
            {/* Seletor de Colaborador para Teste de Treinamento */}
            <Card className="bg-zinc-950/60 border-2 border-slate-700/50 backdrop-blur-md rounded-[32px] overflow-hidden p-6 sm:p-8 no-print">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                            <Users className="h-5 w-5 text-emerald-400" />
                            Colaborador em Instrução
                        </h3>
                        <p className="text-xs text-slate-400">
                            Selecione um profissional para carregar/salvar seu progresso de treinamento e assinar conformidades.
                        </p>
                    </div>

                    <div className="w-full md:w-auto min-w-[280px]">
                        {!employeeName ? (
                            <select
                                value={employeeName}
                                onChange={(e) => {
                                    const selected = getEmployeesList().find((emp: any) => emp.name === e.target.value);
                                    if (selected) {
                                        setEmployeeName(selected.name);
                                        setEmployeeRole(selected.role);
                                        toast({
                                            title: "Colaborador Selecionado",
                                            description: `${selected.name} foi carregado para o treinamento.`,
                                        });
                                    }
                                }}
                                className="w-full bg-black/40 border border-white/10 h-12 rounded-xl px-4 font-bold text-white focus:border-emerald-500 outline-none cursor-pointer text-xs"
                            >
                                <option value="" className="bg-slate-950 text-slate-500">-- Selecionar Colaborador (Teste) --</option>
                                {getEmployeesList().map((emp: any) => (
                                    <option key={emp.id} value={emp.name} className="bg-slate-950 text-white">
                                        {emp.name} ({emp.role})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center justify-between gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="h-3 w-3 rounded-full bg-emerald-500 absolute -top-1 -right-1 border border-black animate-pulse" />
                                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                            {employeeName.charAt(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white leading-none">{employeeName}</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 font-bold">{employeeRole}</p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => {
                                        setEmployeeName('');
                                        setEmployeeRole('');
                                        toast({
                                            title: "Seleção Limpa",
                                            description: "Escolha outro colaborador para testar os treinamentos.",
                                        });
                                    }}
                                    variant="ghost" 
                                    className="h-8 rounded-lg text-[10px] font-black uppercase text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3"
                                >
                                    Alterar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {!employeeName ? (
                <div className="relative rounded-[32px] overflow-hidden border-2 border-dashed border-white/10 p-12 text-center bg-black/20 no-print">
                    <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4 animate-bounce" />
                    <h4 className="text-lg font-black text-white uppercase italic">Treinamento Bloqueado</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
                        Para iniciar os módulos de segurança e assinar o termo de conformidade, selecione um colaborador acima.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
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
                        "rounded-[40px] border-2 p-10 flex flex-col md:flex-row items-center gap-8 transition-all duration-700 no-print",
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
                                    ? "bg-emerald-50 text-slate-950 cursor-default" 
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
                </>
            )}
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
            <div className="max-w-4xl mx-auto space-y-6">
                {!employeeName ? (
                    <Card className="bg-zinc-950/60 border-2 border-slate-700/50 backdrop-blur-md shadow-xl rounded-[40px] overflow-hidden">
                        <CardHeader className="p-10 border-b border-white/5">
                            <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Dossiê de Conformidade Técnica</CardTitle>
                            <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Selecione um colaborador para auditar</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-[32px] mb-6">
                                <FileCheck className="h-12 w-12 text-slate-700 mx-auto mb-2" />
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Aguardando Seleção de Colaborador</p>
                                <p className="text-xs text-slate-600 mt-1">Preencha o Plano de Batalha ou selecione abaixo na lista de colaboradores ativos.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Colaboradores da Base:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(typeof window !== 'undefined' && localStorage.getItem('nexus_permanent_employees') 
                                        ? JSON.parse(localStorage.getItem('nexus_permanent_employees')!) 
                                        : permanentEmployees
                                    ).map((emp: any) => (
                                        <button
                                            key={emp.id}
                                            onClick={() => {
                                                setEmployeeName(emp.name);
                                                setEmployeeRole(emp.role);
                                                toast({
                                                    title: "Colaborador Selecionado",
                                                    description: `${emp.name} carregado no fluxo de integração.`,
                                                });
                                            }}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left group"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{emp.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{emp.role}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-zinc-950/60 border-2 border-slate-700/50 backdrop-blur-md shadow-xl rounded-[40px] overflow-hidden">
                        <CardHeader className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Dossiê de Conformidade Técnica</CardTitle>
                                <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Auditoria e Histórico de Certificação // Nexus Sovereign</CardDescription>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setEmployeeName('');
                                    setEmployeeRole('');
                                }}
                                className="border-white/10 text-slate-400 hover:text-white rounded-xl text-xs uppercase font-black"
                            >
                                Limpar Seleção
                            </Button>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            {/* Perfil do Colaborador */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl font-black">
                                        {employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{employeeName}</h3>
                                        <p className="text-xs text-emerald-400 uppercase tracking-widest font-black mt-2">{employeeRole}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Status: Integração sob Auditoria</p>
                                    </div>
                                </div>
                                <div className="text-center md:text-right space-y-1">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">IMN Merit Index Impact</p>
                                    <div className="flex items-center gap-2 justify-center md:justify-end">
                                        <Zap className="h-5 w-5 text-emerald-400" />
                                        <span className="text-2xl font-black text-emerald-400">+{((completedCerts * 0.2) + (isComplianceSigned ? 0.2 : 0)).toFixed(1)} IMN</span>
                                    </div>
                                </div>
                            </div>

                            {/* Compliance Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Índice de Conformidade Técnica</span>
                                    <span className="text-lg font-black text-emerald-400">{Math.round(progressPercent)}%</span>
                                </div>
                                <Progress value={progressPercent} className="h-3 bg-white/5" />
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Certificados e Status */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Award className="h-4 w-4 text-emerald-400" /> Certificações Operacionais
                                    </h4>
                                    <div className="space-y-3">
                                        {activeCerts.map((cert) => {
                                            const isDone = cert.status === 'completed';
                                            return (
                                                <div key={cert.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <cert.icon className={cn("h-5 w-5", isDone ? "text-emerald-400" : "text-slate-500")} />
                                                        <span className={cn("text-xs font-bold", isDone ? "text-white" : "text-slate-400")}>{cert.title}</span>
                                                    </div>
                                                    <Badge className={cn("text-[9px] font-black border-none uppercase", isDone ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500")}>
                                                        {isDone ? 'Certificado' : 'Pendente'}
                                                    </Badge>
                                                </div>
                                            );
                                        })}
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Scale className={cn("h-5 w-5", isComplianceSigned ? "text-emerald-400" : "text-slate-500")} />
                                                <span className={cn("text-xs font-bold", isComplianceSigned ? "text-white" : "text-slate-400")}>Termo de Conformidade</span>
                                            </div>
                                            <Badge className={cn("text-[9px] font-black border-none uppercase", isComplianceSigned ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500")}>
                                                {isComplianceSigned ? 'Assinado' : 'Pendente'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Auditor Logs */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-emerald-400" /> Trilha de Auditoria (Logs)
                                    </h4>
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 max-h-[180px] overflow-y-auto font-mono text-[10px] text-slate-400 scrollbar-thin scrollbar-thumb-white/5">
                                        <p className="text-slate-500">[00:00:01] Processo de integração ativado para {employeeName}.</p>
                                        {certifications.find(c => c.id === 'safety-1')?.status === 'completed' && (
                                            <p className="text-emerald-400/80">[REGISTRO-01] NR-12: Treinamento "Segurança em Primeiro Lugar" concluído com sucesso.</p>
                                        )}
                                        {certifications.find(c => c.id === 'norms-1')?.status === 'completed' && (
                                            <p className="text-emerald-400/80">[REGISTRO-02] Conduta: "Normas Internas Nexus" assimilado e certificado.</p>
                                        )}
                                        {certifications.find(c => c.id === 'technical-1')?.status === 'completed' && (
                                            <p className="text-emerald-400/80">[REGISTRO-03] Equipamentos: "Manual de Maquinário v4" aprovado por avaliação prática.</p>
                                        )}
                                        {isComplianceSigned && (
                                            <p className="text-emerald-400">[REGISTRO-04] Jurídico: Termo de Conformidade técnica assinado digitalmente e chancelado.</p>
                                        )}
                                        {progressPercent === 100 && (
                                            <p className="text-yellow-400 font-bold">[AUDITORIA-OK] Protocolo de Conformidade Onboarding concluído com 100% de aproveitamento.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Chancela Final */}
                            {progressPercent === 100 ? (
                                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in duration-500">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                                            <ShieldCheck className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase">Selo de Conformidade Ativo</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Chancela Digital Auditada pela Djeny IA</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-500 text-black border-none font-black text-[10px] px-6 py-2 tracking-widest uppercase">
                                        Auditado & Aprovado
                                    </Badge>
                                </div>
                            ) : (
                                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 animate-pulse">
                                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase">Aguardando Certificações</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Colaborador em período de instrução obrigatória.</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="border-amber-500/30 text-amber-500 font-black text-[10px] px-6 py-2 tracking-widest uppercase">
                                        Pendente
                                    </Badge>
                                </div>
                            )}

                            {/* Download Action */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                <Button 
                                    className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                    onClick={() => setIsVisualizing(true)}
                                >
                                    <Eye className="h-4 w-4" /> Visualizar Dossiê
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-12 rounded-xl border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="h-4 w-4" /> Imprimir Dossiê
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-12 rounded-xl border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                    onClick={() => {
                                        toast({
                                            title: "Relatório Gerado",
                                            description: `O arquivo PDF do dossiê de ${employeeName} está sendo processado.`,
                                        });
                                    }}
                                >
                                    <FileCheck className="h-4 w-4" /> Exportar PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </TabsContent>
      </Tabs>

      <LegalSafeguard module="INTEGRAÇÃO NEXUS" protocol="NX-7742-RH" />

      {/* Visualizer Modal Overlay */}
      <AnimatePresence>
        {isVisualizing && employeeName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto no-print"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col my-8"
            >
              {/* Modal Header Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-white/5 bg-zinc-950/80 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white uppercase italic tracking-tight">Visualizador de Dossiê</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">NX-DOSSIER-ONB-7742</p>
                  </div>
                </div>
                
                {/* Style Toggle */}
                <div className="flex items-center bg-zinc-900 border border-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewStyle('digital')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                      previewStyle === 'digital' 
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Digital Dark
                  </button>
                  <button
                    onClick={() => setPreviewStyle('print')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                      previewStyle === 'print' 
                        ? "bg-slate-200 text-slate-950 shadow-md" 
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Impressão (A4)
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => window.print()}
                    size="sm"
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest text-[9px] rounded-lg h-9 px-4 flex items-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" /> Imprimir
                  </Button>
                  <Button
                    onClick={() => setIsVisualizing(false)}
                    variant="ghost"
                    size="icon"
                    className="rounded-lg h-9 w-9 text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Document Container */}
              <div className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-[70vh] custom-scrollbar bg-[#020617] flex justify-center">
                {previewStyle === 'digital' ? (
                  /* --- DIGITAL PREVIEW (DARK MODE) --- */
                  <div className="w-full max-w-2xl bg-zinc-950/40 border-2 border-emerald-500/20 backdrop-blur-md rounded-[32px] p-8 space-y-8 relative overflow-hidden text-slate-300">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                      <div className="space-y-1">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Portal Soberano Nexus</h2>
                        <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Sovereign Compliance & Technical Auditing</p>
                      </div>
                      <div className="text-left sm:text-right space-y-1 font-mono text-[9px] text-slate-500">
                        <p>ID: NX-DOSSIER-ONB-7742</p>
                        <p>EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    {/* Employee Profile */}
                    <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-black shrink-0">
                        {employeeName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{employeeName}</h3>
                        <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-black mt-1.5">{employeeRole}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Status: Homologação de Integração</p>
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Índice de Conformidade</p>
                        <p className="text-xl font-black text-white">{Math.round(progressPercent)}%</p>
                      </div>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Impacto no Índice de Mérito</p>
                        <p className="text-xl font-black text-emerald-400">+{((completedCerts * 0.2) + (isComplianceSigned ? 0.2 : 0)).toFixed(1)} IMN</p>
                      </div>
                    </div>

                    {/* Compliance Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider">1. Checklists Regulatórios</h4>
                      <div className="space-y-2">
                        {activeCerts.map((cert) => {
                          const isDone = cert.status === 'completed';
                          return (
                            <div key={cert.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold">
                              <span className="flex items-center gap-2 text-white">
                                <CheckCircle className={cn("h-4 w-4 shrink-0", isDone ? "text-emerald-400" : "text-slate-600")} />
                                {cert.title}
                              </span>
                              <Badge className={cn("text-[8px] font-black border-none uppercase", isDone ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500")}>
                                {isDone ? 'Certificado' : 'Pendente'}
                              </Badge>
                            </div>
                          );
                        })}
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold">
                          <span className="flex items-center gap-2 text-white">
                            <CheckCircle className={cn("h-4 w-4 shrink-0", isComplianceSigned ? "text-emerald-400" : "text-slate-600")} />
                            Termo de Conformidade
                          </span>
                          <Badge className={cn("text-[8px] font-black border-none uppercase", isComplianceSigned ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500")}>
                            {isComplianceSigned ? 'Assinado' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider">2. Logs do Auditor</h4>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[9px] text-slate-400 space-y-1.5 max-h-[140px] overflow-y-auto">
                        <p className="text-slate-500">[00:00:01] Processo de integração ativado para {employeeName}.</p>
                        {certifications.find(c => c.id === 'safety-1')?.status === 'completed' && (
                          <p className="text-emerald-400/80">[REGISTRO-01] NR-12: Treinamento "Segurança em Primeiro Lugar" concluído.</p>
                        )}
                        {certifications.find(c => c.id === 'norms-1')?.status === 'completed' && (
                          <p className="text-emerald-400/80">[REGISTRO-02] Conduta: "Normas Internas Nexus" certificado.</p>
                        )}
                        {certifications.find(c => c.id === 'technical-1')?.status === 'completed' && (
                          <p className="text-emerald-400/80">[REGISTRO-03] Equipamentos: "Manual de Maquinário v4" concluído.</p>
                        )}
                        {isComplianceSigned && (
                          <p className="text-emerald-400">[REGISTRO-04] Jurídico: Termo de Conformidade técnica assinado.</p>
                        )}
                        {progressPercent === 100 && (
                          <p className="text-yellow-400 font-bold">[AUDITORIA-OK] Protocolo de Conformidade Onboarding concluído.</p>
                        )}
                      </div>
                    </div>

                    {/* QR and Digital Signature */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-1 rounded-xl shrink-0">
                          <QrCode value={`https://nexus.sovereign.portal/audit/onboarding/${employeeName}`} size={72} />
                        </div>
                        <div className="text-left font-mono text-[8px] text-slate-500 space-y-1">
                          <p className="font-bold text-slate-400">CERTIFICAÇÃO DIGITAL NEXUS</p>
                          <p>HASH: SHA256-NX-ONB-{employeeName.toUpperCase().slice(0, 3)}-9981</p>
                          <p>ESTADO: {progressPercent === 100 ? 'APROVADO & AUDITADO' : 'AGUARDANDO PENDÊNCIAS'}</p>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <span className={cn(
                          "inline-block text-[10px] font-black uppercase px-4 py-1.5 rounded-full border",
                          progressPercent === 100 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                            : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                        )}>
                          {progressPercent === 100 ? 'Chancela Ativa' : 'Em Análise'}
                        </span>
                        <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">Status do Selo de Conformidade</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --- PRINT/A4 PREVIEW (LIGHT MODE) --- */
                  <div className="w-full max-w-[21cm] bg-white text-black border border-slate-300 p-12 shadow-md font-sans text-xs space-y-8 leading-relaxed">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
                      <div>
                        <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">PORTAL SOBERANO NEXUS</h2>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Sovereign Compliance & Technical Auditing</p>
                      </div>
                      <div className="text-right font-mono text-[8px] text-slate-500">
                        <p className="font-bold text-slate-900">NX-DOSSIER-ONB-7742</p>
                        <p>DATA: {new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold uppercase tracking-wider text-center border-b border-slate-200 pb-2">
                      DOSSIÊ DE CONFORMIDADE TÉCNICA E INTEGRAÇÃO
                    </h3>

                    {/* Employee Profile */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="text-[8px] uppercase font-bold text-slate-500">Colaborador Auditado</p>
                        <p className="text-sm font-black text-slate-900">{employeeName}</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase font-bold text-slate-500">Cargo / Função</p>
                        <p className="text-sm font-black text-slate-900">{employeeRole}</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase font-bold text-slate-500">Índice de Conformidade</p>
                        <p className="text-sm font-black text-slate-900">{Math.round(progressPercent)}% Concluído</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase font-bold text-slate-500">Impacto no Índice de Mérito (IMN)</p>
                        <p className="text-sm font-black text-emerald-800">+{((completedCerts * 0.2) + (isComplianceSigned ? 0.2 : 0)).toFixed(1)} IMN</p>
                      </div>
                    </div>

                    {/* Compliance Checklist */}
                    <div className="space-y-2">
                      <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">1. GRADE DE CERTIFICAÇÃO OBRIGATÓRIA</h4>
                      <table className="w-full text-left text-[10px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-300 text-slate-600">
                            <th className="py-1">Nome do Protocolo</th>
                            <th className="py-1">Tipo de Regulamentação</th>
                            <th className="py-1 text-right">Status do Certificado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeCerts.map((cert) => {
                            const isDone = cert.status === 'completed';
                            return (
                              <tr key={cert.id} className="border-b border-slate-100">
                                <td className="py-1.5 font-bold text-slate-900">{cert.title}</td>
                                <td className="py-1.5 text-slate-500">NR-Normativa Operacional</td>
                                <td className={`py-1.5 text-right font-bold ${isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                                  {isDone ? '[X] HOMOLOGADO' : '[ ] PENDENTE'}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="border-b border-slate-100">
                            <td className="py-1.5 font-bold text-slate-900">Termo de Conformidade</td>
                            <td className="py-1.5 text-slate-500">Termo de Ciência & Compliance</td>
                            <td className={`py-1.5 text-right font-bold ${isComplianceSigned ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {isComplianceSigned ? '[X] ASSINADO DIGITALMENTE' : '[ ] PENDENTE'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Audit Logs */}
                    <div className="space-y-2">
                      <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">2. TRILHA DE AUDITORIA E LOGS DO SISTEMA</h4>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[8px] text-slate-700 space-y-1">
                        <p>[00:00:01] Processo de integração ativado para {employeeName}.</p>
                        {certifications.find(c => c.id === 'safety-1')?.status === 'completed' && (
                          <p>[REGISTRO-01] NR-12: Treinamento "Segurança em Primeiro Lugar" concluído com sucesso.</p>
                        )}
                        {certifications.find(c => c.id === 'norms-1')?.status === 'completed' && (
                          <p>[REGISTRO-02] Conduta: "Normas Internas Nexus" assimilado e certificado.</p>
                        )}
                        {certifications.find(c => c.id === 'technical-1')?.status === 'completed' && (
                          <p>[REGISTRO-03] Equipamentos: "Manual de Maquinário v4" aprovado por avaliação prática.</p>
                        )}
                        {isComplianceSigned && (
                          <p>[REGISTRO-04] Jurídico: Termo de Conformidade técnica assinado digitalmente.</p>
                        )}
                        {progressPercent === 100 && (
                          <p className="font-bold">[AUDITORIA-OK] Protocolo de Conformidade Onboarding concluído com 100% de aproveitamento.</p>
                        )}
                      </div>
                    </div>

                    {/* Signatures & Stamps */}
                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-0.5 border border-slate-300 rounded shrink-0">
                            <QrCode value={`https://nexus.sovereign.portal/audit/onboarding/${employeeName}`} size={48} />
                          </div>
                          <div className="font-mono text-[7px] text-slate-500 space-y-0.5">
                            <p className="font-bold text-slate-800">CÓDIGO DE AUTENTICIDADE</p>
                            <p>NX-ONB-{employeeName.toUpperCase().slice(0, 3)}-9981</p>
                            <p>ASSINATURA DIGITAL REGISTRADA EM BANCO</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center border border-slate-300 p-2 rounded-lg bg-slate-50">
                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Chancela de Conformidade</p>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded border ${progressPercent === 100 ? 'border-emerald-700 text-emerald-700 bg-emerald-50' : 'border-amber-600 text-amber-600 bg-amber-50'}`}>
                          {progressPercent === 100 ? 'AUDITADO & APROVADO' : 'PENDENTE'}
                        </span>
                      </div>
                    </div>

                    {/* Footnote */}
                    <div className="text-center text-[7px] text-slate-400 pt-4 border-t border-slate-100">
                      Dossiê gerado eletronicamente e integrado ao Índice de Mérito Nexus. Este documento comprova a conformidade legal do colaborador sob as normas da NR-12 e NR-35 vigentes.
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-zinc-950/80 flex items-center justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-sm">
                <Button
                  onClick={() => setIsVisualizing(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl"
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" /> Imprimir Dossiê
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Printable Area (Invisible on screen, styled beautifully for A4 printing) */}
      {employeeName && (
        <div className="print-only-container hidden">
          <div className="w-full bg-white text-black p-12 font-sans text-xs space-y-8 leading-relaxed">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">PORTAL SOBERANO NEXUS</h2>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Sovereign Compliance & Technical Auditing</p>
              </div>
              <div className="text-right font-mono text-[8px] text-slate-500">
                <p className="font-bold text-slate-900">NX-DOSSIER-ONB-7742</p>
                <p>DATA: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-center border-b border-slate-200 pb-2">
              DOSSIÊ DE CONFORMIDADE TÉCNICA E INTEGRAÇÃO
            </h3>

            {/* Employee Profile */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg">
              <div>
                <p className="text-[8px] uppercase font-bold text-slate-500">Colaborador Auditado</p>
                <p className="text-sm font-black text-slate-900">{employeeName}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase font-bold text-slate-500">Cargo / Função</p>
                <p className="text-sm font-black text-slate-900">{employeeRole}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase font-bold text-slate-500">Índice de Conformidade</p>
                <p className="text-sm font-black text-slate-900">{Math.round(progressPercent)}% Concluído</p>
              </div>
              <div>
                <p className="text-[8px] uppercase font-bold text-slate-500">Impacto no Índice de Mérito (IMN)</p>
                <p className="text-sm font-black text-emerald-800">+{((completedCerts * 0.2) + (isComplianceSigned ? 0.2 : 0)).toFixed(1)} IMN</p>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="space-y-2">
              <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">1. GRADE DE CERTIFICAÇÃO OBRIGATÓRIA</h4>
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600">
                    <th className="py-1">Nome do Protocolo</th>
                    <th className="py-1">Tipo de Regulamentação</th>
                    <th className="py-1 text-right">Status do Certificado</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCerts.map((cert) => {
                    const isDone = cert.status === 'completed';
                    return (
                      <tr key={cert.id} className="border-b border-slate-100">
                        <td className="py-1.5 font-bold text-slate-900">{cert.title}</td>
                        <td className="py-1.5 text-slate-500">NR-Normativa Operacional</td>
                        <td className={`py-1.5 text-right font-bold ${isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {isDone ? '[X] HOMOLOGADO' : '[ ] PENDENTE'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-900">Termo de Conformidade</td>
                    <td className="py-1.5 text-slate-500">Termo de Ciência & Compliance</td>
                    <td className={`py-1.5 text-right font-bold ${isComplianceSigned ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {isComplianceSigned ? '[X] ASSINADO DIGITALMENTE' : '[ ] PENDENTE'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Audit Logs */}
            <div className="space-y-2">
              <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">2. TRILHA DE AUDITORIA E LOGS DO SISTEMA</h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[8px] text-slate-700 space-y-1">
                <p>[00:00:01] Processo de integração ativado para {employeeName}.</p>
                {certifications.find(c => c.id === 'safety-1')?.status === 'completed' && (
                  <p>[REGISTRO-01] NR-12: Treinamento "Segurança em Primeiro Lugar" concluído com sucesso.</p>
                )}
                {certifications.find(c => c.id === 'norms-1')?.status === 'completed' && (
                  <p>[REGISTRO-02] Conduta: "Normas Internas Nexus" assimilado e certificado.</p>
                )}
                {certifications.find(c => c.id === 'technical-1')?.status === 'completed' && (
                  <p>[REGISTRO-03] Equipamentos: "Manual de Maquinário v4" aprovado por avaliação prática.</p>
                )}
                {isComplianceSigned && (
                  <p>[REGISTRO-04] Jurídico: Termo de Conformidade técnica assinado digitalmente.</p>
                )}
                {progressPercent === 100 && (
                  <p className="font-bold">[AUDITORIA-OK] Protocolo de Conformidade Onboarding concluído com 100% de aproveitamento.</p>
                )}
              </div>
            </div>

            {/* Signatures & Stamps */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-0.5 border border-slate-300 rounded shrink-0">
                    <QrCode value={`https://nexus.sovereign.portal/audit/onboarding/${employeeName}`} size={48} />
                  </div>
                  <div className="font-mono text-[7px] text-slate-500 space-y-0.5">
                    <p className="font-bold text-slate-800">CÓDIGO DE AUTENTICIDADE</p>
                    <p>NX-ONB-{employeeName.toUpperCase().slice(0, 3)}-9981</p>
                    <p>ASSINATURA DIGITAL REGISTRADA EM BANCO</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border border-slate-300 p-2 rounded-lg bg-slate-50">
                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Chancela de Conformidade</p>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded border ${progressPercent === 100 ? 'border-emerald-700 text-emerald-700 bg-emerald-50' : 'border-amber-600 text-amber-600 bg-amber-50'}`}>
                  {progressPercent === 100 ? 'AUDITADO & APROVADO' : 'PENDENTE'}
                </span>
              </div>
            </div>

            {/* Footnote */}
            <div className="text-center text-[7px] text-slate-400 pt-4 border-t border-slate-100">
              Dossiê gerado eletronicamente e integrado ao Índice de Mérito Nexus. Este documento comprova a conformidade legal do colaborador sob as normas da NR-12 e NR-35 vigentes.
            </div>
          </div>
        </div>
      )}

      {/* Clean Print Style definitions */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide all portal visual content */
          body * {
            visibility: hidden !important;
            background: none !important;
          }
          /* Show and position the A4 print container only */
          .print-only-container, .print-only-container * {
            visibility: visible !important;
          }
          .print-only-container {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
          }
          /* Remove layout/shadow limits of print-only container on paper */
          .print-only-container div {
            box-shadow: none !important;
            border-color: #cbd5e1 !important;
          }
          /* Ensure modal backdrop and overlays are fully hidden when printing */
          .no-print, [role="dialog"], .fixed, header, nav, button, footer {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}} />
      </div>
    </SovereignShowcase>
  );
}
