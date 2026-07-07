'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from '@/hooks/use-locale';
import { 
  ShieldAlert, 
  GraduationCap, 
  Activity, 
  ArrowRight, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  KeyRound, 
  BookOpen,
  Send,
  MessageCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { individualCourses } from '@/lib/courses-data';
import { danteSafra } from '@/ai/flows/dante-safra-flow';
import { djenyChat } from '@/ai/flows/djeny-chat-flow';

export default function SuportePage() {
  const { t } = useLocale();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Dante Modal States
  const [isDanteOpen, setIsDanteOpen] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [cpf, setCpf] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Djeny Modal States
  const [isDjenyOpen, setIsDjenyOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseMode, setCourseMode] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  // Orion State (Converted to Dante System)
  const [isDanteSystemOpen, setIsDanteSystemOpen] = useState(false);
  const [orionModule, setOrionModule] = useState('');
  const [orionPriority, setOrionPriority] = useState('');
  const [orionDescription, setOrionDescription] = useState('');

  // Support Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatAvatar, setChatAvatar] = useState<'Dante' | 'Djeny'>('Dante');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [djenyStage, setDjenyStage] = useState<'AVALIACAO' | 'XEQUE_MATE'>('AVALIACAO');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDante = () => {
    setIsDanteOpen(true);
    setResetStep(1);
    setIsSuccess(false);
    setCpf('');
    setDob('');
    setEmail('');
    setConfirmationCode('');
    setNewPassword('');
  };

  const handleDanteIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf || !dob || !email) {
      toast({ variant: "destructive", title: "Protocolo Incompleto.", description: "Todos os dados de verificação são obrigatórios." });
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (cpf === '00000000000') {
      setResetStep(2);
      toast({
        title: '[SIMULAÇÃO] Verificação Aprovada.',
        description: 'Modo de teste. Um código fictício foi enviado para o seu e-mail.',
      });
      setIsVerifying(false);
      return;
    }

    try {
      await resetPassword({ username: email });
      setResetStep(2);
      toast({
        title: 'Verificação Aprovada.',
        description: 'Um código de autorização foi enviado para o seu e-mail.',
      });
    } catch (error: any) {
      let description = 'Ocorreu um erro desconhecido. Tente novamente mais tarde.';
      if (error.name === 'UserNotFoundException') {
        description = 'Nenhum usuário encontrado com este e-mail. Verifique o endereço digitado.';
      } else if (error.name === 'InvalidParameterException') {
        description = 'O formato do e-mail é inválido.';
      }
      toast({ variant: "destructive", title: "Falha na Identificação.", description });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDanteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationCode || !newPassword) {
      toast({ variant: "destructive", title: "Protocolo Incompleto.", description: "Código e nova senha são obrigatórios." });
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (confirmationCode === '000000') {
      setIsSuccess(true);
      setIsVerifying(false);
      return;
    }

    try {
      await confirmResetPassword({ 
        username: email, 
        confirmationCode, 
        newPassword 
      });
      setIsSuccess(true);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha na Redefinição.", description: error.message || "Código inválido ou expirado." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDjeny = () => {
    setIsDjenyOpen(true);
    setSelectedCourse('');
    setIssueType('');
    setCourseMode('');
    setPreferredTime('');
    setIssueDescription('');
  };

  const handleDjenySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse !== 'none' && (!selectedCourse || !issueType || !courseMode || !preferredTime)) {
       toast({ variant: "destructive", title: "Protocolo Incompleto.", description: "Preencha todos os campos do curso para prosseguir." });
       return;
    }
    
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsVerifying(false);
    setIsDjenyOpen(false);

    // Initialize Chat
    setChatAvatar('Djeny');
    setChatMessages([{
      id: Date.now(),
      sender: 'ai',
      text: `Olá ${user?.name || 'Aluno'}! Recebi sua solicitação sobre o curso ${selectedCourse}. Já estou analisando seu caso aqui em Harvard. Como posso te ajudar agora?`
    }]);
    setIsChatOpen(true);
  };

  const handleDanteSystem = () => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login?callbackUrl=/suporte');
      return;
    }
    setIsDanteSystemOpen(true);
    setOrionModule('');
    setOrionPriority('');
    setOrionDescription('');
  };

  const handleDanteSystemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orionModule || !orionPriority) {
      toast({ variant: "destructive", title: "Protocolo Incompleto.", description: "Identifique o módulo e a prioridade." });
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsVerifying(false);
    setIsDanteSystemOpen(false);

    // Initialize Chat
    setChatAvatar('Dante');
    setChatMessages([{
      id: Date.now(),
      sender: 'ai',
      text: `Opa, ${user?.name || 'patrão'}! Já escaneei a falha no módulo ${orionModule} com prioridade ${orionPriority}. Já estou na matriz tentando corrigir. O que mais você notou?`
    }]);
    setIsChatOpen(true);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatTyping) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatTyping(true);

    try {
      let response = '';
      if (chatAvatar === 'Dante') {
        const result = await danteSafra({
          userMessage: userMsg,
          userName: user?.name || 'Comandante',
          locale: 'pt-BR',
          setupStage: 'ANALISE'
        });
        response = result.response;
      } else {
        const result = await djenyChat({
          userMessage: userMsg,
          userName: user?.name || 'Aluno Nexus',
          locale: 'pt-BR',
          conversationStage: djenyStage
        });
        response = result.response;
        if (result.nextConversationStage) setDjenyStage(result.nextConversationStage as any);
      }

      setChatMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: response }]);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro na Matriz.", description: "Não consegui contatar a IA agora." });
    } finally {
      setIsChatTyping(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen text-slate-100 pt-28 pb-20 flex flex-col items-center relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/support-bg-nexus.png"
          alt="Nexus Support Triage"
          fill
          priority
          className="object-cover opacity-45"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.03)_0%,transparent_60%)]" />
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[100px] opacity-50 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-green-500/5 rounded-full blur-[80px] opacity-50" />
      </div>

      <div className="container relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{t('suporte.title') || 'Central de Suporte Nexus'}</span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 uppercase drop-shadow-md">
            Triagem <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Inteligente</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Escolha a sua via de resolução rápida guiada pela nossa Inteligência Artificial. Direcionamos sua requisição diretamente para a matriz responsável.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* DANTE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative rounded-2xl border border-border/50 bg-background/40 backdrop-blur-md p-8 text-left overflow-hidden transition-all hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] flex flex-col"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert className="h-24 w-24 text-amber-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full border-2 border-amber-500/30 overflow-hidden shadow-lg shadow-amber-500/10">
                <Image 
                  src="/suporte nexus/Dante suporte 24h.png" 
                  alt="Dante" 
                  width={56} 
                  height={56} 
                  className="object-cover object-top"
                />
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold font-headline mb-3 text-foreground group-hover:text-amber-500 transition-colors uppercase">
              Dante (Acesso)
            </h3>
            
            <p className="text-muted-foreground text-sm flex-1 mb-8 leading-relaxed">
              Recuperação de credenciais de alto nível, verificação de identidade e resolução de acesso aos portais da Holding.
            </p>

            <div className="flex items-center gap-2 mb-8 text-xs text-amber-500/80 font-semibold bg-amber-500/10 p-2 rounded border border-amber-500/20">
              <Lock className="h-3 w-3" />
              <span>Verificação Biométrica Requerida</span>
            </div>
            
            <Button 
              onClick={handleDante}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center justify-between"
            >
              <span>Restaurar Credenciais</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* DJENY CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-2xl border border-border/50 bg-background/40 backdrop-blur-md p-8 text-left overflow-hidden transition-all hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.1)] flex flex-col"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GraduationCap className="h-24 w-24 text-blue-400" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full border-2 border-blue-500/30 overflow-hidden shadow-lg shadow-blue-500/10">
                <Image 
                  src="/suporte nexus/Djeny suporte 24h.png" 
                  alt="Djeny" 
                  width={56} 
                  height={56} 
                  className="object-cover object-top"
                />
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold font-headline mb-3 text-foreground group-hover:text-blue-400 transition-colors uppercase">
              Djeny (Treinamento)
            </h3>
            
            <p className="text-muted-foreground text-sm flex-1 mb-4 leading-relaxed">
              Dúvidas sobre imersões corporativas, materiais estratégicos, ecossistemas da Nexus Treinamento e emissão de certificações.
            </p>

            <div className="flex items-center gap-2 mb-8 text-xs text-blue-400/80 font-semibold bg-blue-400/10 p-2 rounded border border-blue-400/20">
              <Lock className="h-3 w-3" />
              <span>Acesso Aluno Requerido</span>
            </div>
            
            <Button 
              onClick={handleDjeny}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center justify-between"
            >
              <span>Nexus Treinamento</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* DANTE SYSTEM CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative rounded-2xl border border-border/50 bg-background/40 backdrop-blur-md p-8 text-left overflow-hidden transition-all hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] flex flex-col"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="h-24 w-24 text-green-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full border-2 border-green-500/30 overflow-hidden shadow-lg shadow-green-500/10">
                <Image 
                  src="/suporte nexus/Dante suporte 24h.png" 
                  alt="Dante" 
                  width={56} 
                  height={56} 
                  className="object-cover object-top grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold font-headline mb-3 text-foreground group-hover:text-green-500 transition-colors uppercase">
              Dante (Sistemas)
            </h3>
            
            <p className="text-muted-foreground text-sm flex-1 mb-4 leading-relaxed">
              Manutenção, erros técnicos e suporte de sistemas. O Dante entra na matriz para resolver o seu problema.
            </p>

            <div className="flex items-center gap-2 mb-8 text-xs text-green-500/80 font-semibold bg-green-500/10 p-2 rounded border border-green-500/20">
              <Lock className="h-3 w-3" />
              <span>Verificação Específica Requerida</span>
            </div>
            
            <Button 
              onClick={handleDanteSystem}
              className="w-full bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)] transition-all flex items-center justify-between"
            >
              <span>Relatar Falha Técnica</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

        </div>
      </div>

      {/* DANTE VERIFICATION & RECOVERY DIALOG */}
      <Dialog open={isDanteOpen} onOpenChange={setIsDanteOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl text-amber-500">
              {resetStep === 1 ? <ShieldAlert className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
              {resetStep === 1 ? 'Protocolo de Identificação' : 'Protocolo de Sobrescrita'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {resetStep === 1 
                ? 'DANTE exige confirmação estrita da sua identidade corporativa. O acesso só será restaurado se os dados coincidirem.' 
                : 'Identidade confirmada. Insira o código de autorização recebido no seu e-mail e defina sua nova credencial.'}
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-500">Credenciais Atualizadas</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Sua senha foi redefinida com sucesso pelo Dante. Você já pode acessar a plataforma normalmente.
                </p>
              </div>
              <Button 
                onClick={() => { setIsDanteOpen(false); router.push('/login'); }} 
                className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Ir para o Login
              </Button>
            </div>
          ) : resetStep === 1 ? (
            <form onSubmit={handleDanteIdentify} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-amber-500/80">CPF (Apenas números)</Label>
                <Input 
                  id="cpf" 
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                  placeholder="00000000000" 
                  maxLength={11}
                  className="bg-background border-amber-500/20 focus-visible:ring-amber-500"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-amber-500/80">Data de Nascimento</Label>
                <Input 
                  id="dob" 
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-background border-amber-500/20 focus-visible:ring-amber-500"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-500/80">E-mail Cadastrado</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-background border-amber-500/20 focus-visible:ring-amber-500"
                  required 
                />
              </div>
              <Button type="submit" disabled={isVerifying} className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar Identidade'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleDanteReset} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-amber-500/80">Código de Verificação</Label>
                <Input 
                  id="code" 
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="000000" 
                  maxLength={6}
                  className="bg-background border-amber-500/20 focus-visible:ring-amber-500"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-500/80">Nova Senha Soberana</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-background border-amber-500/20 focus-visible:ring-amber-500"
                  required 
                />
              </div>
              <Button type="submit" disabled={isVerifying} className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Redefinir Acesso'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Djeny: Suporte de Cursos */}
      <Dialog open={isDjenyOpen} onOpenChange={setIsDjenyOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-950 border-blue-500/30 text-slate-100 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <GraduationCap className="h-5 w-5 text-blue-400" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
                Portal de <span className="text-blue-500">Mentoria</span>
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400">
              A Djeny irá analisar sua solicitação conforme os protocolos de Harvard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDjenySubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course" className="text-blue-400/80">Seu Curso</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse} required>
                  <SelectTrigger id="course" className="bg-background border-blue-500/20 focus:ring-blue-400">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Formações Nexus</SelectLabel>
                      {individualCourses.map(course => (
                        <SelectItem key={course.slug} value={course.slug}>{course.title}</SelectItem>
                      ))}
                      <SelectItem value="none">Ainda não sou aluno</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue" className="text-blue-400/80">Tipo de Problema</Label>
                <Select value={issueType} onValueChange={setIssueType} required>
                  <SelectTrigger id="issue" className="bg-background border-blue-500/20 focus:ring-blue-400">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access">Acesso às Aulas</SelectItem>
                    <SelectItem value="content">Dúvida de Conteúdo</SelectItem>
                    <SelectItem value="cert">Certificado/Avaliação</SelectItem>
                    <SelectItem value="payment">Financeiro/Pagamento</SelectItem>
                    <SelectItem value="mentorship">Agendar Mentoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mode" className="text-blue-400/80">Modalidade Desejada</Label>
                <Select value={courseMode} onValueChange={setCourseMode} required>
                  <SelectTrigger id="mode" className="bg-background border-blue-500/20 focus:ring-blue-400">
                    <SelectValue placeholder="Como quer aprender?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ia">100% IA (Nexus Brain)</SelectItem>
                    <SelectItem value="humana">Híbrida (IA + Humana)</SelectItem>
                    <SelectItem value="presencial">Presencial (Premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-blue-400/80">Horário Preferencial</Label>
                <Select value={preferredTime} onValueChange={setPreferredTime} required>
                  <SelectTrigger id="time" className="bg-background border-blue-500/20 focus:ring-blue-400">
                    <SelectValue placeholder="Melhor horário?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Manhã (06h - 12h)</SelectItem>
                    <SelectItem value="afternoon">Tarde (12h - 18h)</SelectItem>
                    <SelectItem value="night">Noite (18h - 22h)</SelectItem>
                    <SelectItem value="overnight">Madrugada (22h - 06h) [+10%]</SelectItem>
                    <SelectItem value="weekend">Final de Semana (Sáb/Dom) [+10%]</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc" className="text-blue-400/80">Relato Detalhado</Label>
              <Textarea 
                id="desc"
                placeholder="Descreva exatamente o que está acontecendo..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="bg-background border-blue-500/20 focus-visible:ring-blue-400 min-h-[80px]"
              />
            </div>

            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400/70 leading-tight">
              <p><strong>Regras de Mentoria:</strong> Cursos com Geanderson dependem de agenda. Mudança de modalidade pós-início não é permitida. Horários especiais (22h-06h e Finais de Semana após Sáb 13h) possuem acréscimo de 10%.</p>
            </div>

            <Button type="submit" disabled={isVerifying} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Solicitar Protocolo Anjo'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Dante System: Suporte Técnico */}
      <Dialog open={isDanteSystemOpen} onOpenChange={setIsDanteSystemOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-950 border-green-500/30 text-slate-100 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
          
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <ShieldAlert className="h-5 w-5 text-green-400" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
                Central de <span className="text-green-500">Sistemas</span>
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400">
              Triagem técnica assistida pelo mestre Dante. Defina o escopo do erro.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDanteSystemSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="orion-module" className="text-green-400/80">Módulo do Ecossistema</Label>
              <Select value={orionModule} onValueChange={setOrionModule} required>
                <SelectTrigger id="orion-module" className="bg-background border-green-500/20 focus:ring-green-400">
                  <SelectValue placeholder="Onde está o problema?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Nexus Global (Dashboard/Menu)</SelectItem>
                  <SelectItem value="empresas">Nexus Empresas (Indústria/B2B)</SelectItem>
                  <SelectItem value="intelligence">Nexus Intelligence (IA/Bedrock)</SelectItem>
                  <SelectItem value="studio">Nexus Studio (Broadcast/Mídia)</SelectItem>
                  <SelectItem value="crono">Cronoanálise (Banco de Tempos)</SelectItem>
                  <SelectItem value="merito">Nexus Mérito (Avaliação)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orion-priority" className="text-green-400/80">Nível de Criticidade</Label>
              <Select value={orionPriority} onValueChange={setOrionPriority} required>
                <SelectTrigger id="orion-priority" className="bg-background border-green-500/20 focus:ring-green-400">
                  <SelectValue placeholder="Qual a gravidade?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa - Pequeno bug estético</SelectItem>
                  <SelectItem value="medium">Média - Funcionalidade lenta/instável</SelectItem>
                  <SelectItem value="high">Alta - Módulo inoperante</SelectItem>
                  <SelectItem value="critical" className="text-red-500 font-bold">Crítica - PARADA DE FÁBRICA / BLOQUEIO TOTAL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orion-desc" className="text-green-400/80">Evidência / Log do Erro</Label>
              <Textarea 
                id="orion-desc"
                placeholder="Cole aqui o erro do console ou descreva o comportamento anômalo..."
                value={orionDescription}
                onChange={(e) => setOrionDescription(e.target.value)}
                className="bg-background border-green-500/20 focus-visible:ring-green-400 min-h-[120px] font-mono text-xs"
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isVerifying || !orionModule || !orionPriority} 
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando Protocolo...
                  </>
                ) : (
                  'Acionar Dante (Sistemas)'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* SUPPORT CHAT MODAL (INLINE) */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className={cn(
          "sm:max-w-[450px] p-0 overflow-hidden border-2 bg-slate-950",
          chatAvatar === 'Dante' ? "border-amber-500/30" : "border-blue-500/30"
        )}>
          {/* Header */}
          <div className={cn(
            "p-4 flex items-center gap-3 border-b",
            chatAvatar === 'Dante' ? "bg-amber-500/5 border-amber-500/20" : "bg-blue-500/5 border-blue-500/20"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full overflow-hidden border-2 shadow-lg",
              chatAvatar === 'Dante' ? "border-amber-400" : "border-blue-400"
            )}>
              <img 
                src={chatAvatar === 'Dante' ? "/suporte nexus/Dante suporte 24h.png" : "/suporte nexus/Djeny suporte 24h.png"} 
                alt={chatAvatar} 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm tracking-tight flex items-center gap-2">
                Suporte Live: {chatAvatar}
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </h4>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                {chatAvatar === 'Dante' ? 'Guardião do Sistema' : 'Mentora de Cursos'}
              </p>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-black/40">
            {chatMessages.map(msg => (
              <div 
                key={msg.id} 
                className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed",
                  msg.sender === 'ai' 
                    ? (chatAvatar === 'Dante' ? "bg-amber-500/10 border border-amber-500/20 text-slate-200 self-start rounded-tl-sm" : "bg-blue-500/10 border border-blue-500/20 text-slate-200 self-start rounded-tl-sm")
                    : "bg-white/10 border border-white/5 text-white ml-auto rounded-tr-sm"
                )}
              >
                {msg.text}
              </div>
            ))}
            {isChatTyping && (
              <div className="flex items-center gap-2 text-[10px] text-slate-500 animate-pulse italic">
                <Loader2 className="h-3 w-3 animate-spin" />
                {chatAvatar} está digitando...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/5 bg-slate-900/50 flex items-center gap-2">
            <Input 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="bg-background border-white/10 text-xs h-10 rounded-full"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isChatTyping}
              className={cn(
                "w-10 h-10 p-0 rounded-full shrink-0",
                chatAvatar === 'Dante' ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
