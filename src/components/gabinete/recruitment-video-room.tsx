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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mic,
  Video,
  PhoneOff,
  Activity,
  ShieldAlert,
  MessageSquare,
  Maximize2,
  Volume2,
  User,
  Loader2,
  Smile,
  Zap,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import * as gtag from '@/lib/gtag';


interface RecruitmentVideoRoomProps {
  candidateName: string;
  onClose: () => void;
}

const interviewGuide = [
  {
    id: 0,
    question: "Fale um pouco sobre você e de onde você é. O que te trouxe para trabalhar na nossa região?",
    intent: "Gerar rapport (quebra-gelo) e avaliar estabilidade geográfica.",
    followUps: [
      { trigger: "Citar cidade vizinha", text: "Legal! (Dica: Cite algo famoso da cidade dele, ex: festas ou pontos turísticos). O que te fez buscar nossa empresa em vez de ficar por lá?" },
      { trigger: "Busca estabilidade", text: "Você sente que nossa região oferece mais segurança a longo prazo para sua carreira?" },
      { trigger: "Motivo passivo (família/amigos)", text: "Hoje você já tem seus próprios planos aqui ou sua permanência ainda depende de outras pessoas?" }
    ],
    redFlags: "Atenção a respostas passivas ('vim porque me trouxeram'). Use o 'Quebra-Gelo Local' (ex: Santa Cruz = Oktoberfest) para tirar o escudo do candidato."
  },
  {
    id: 1,
    question: "Você já trabalhou em alguma outra empresa? Qual foi o motivo da sua saída de lá?",
    intent: "Avaliar histórico, estabilidade e maturidade profissional.",
    followUps: [
      { trigger: "Empresa grande (ex: Souza Cruz) / Temporário", text: "Entendo, lá as vagas efetivas são disputadas. O que você busca aqui que não tinha lá? (Sinal de busca por efetivação/estabilidade)." },
      { trigger: "Empresa menor / 'Vim com a família'", text: "E se sua família decidir mudar de novo, você tem planos de seguir carreira aqui por conta própria?" },
      { trigger: "Motivo: 'Era chato' ou 'Não me adaptei'", text: "O que especificamente não te agradava? Como você lidaria se encontrasse uma rotina parecida aqui?" },
      { trigger: "Motivo: 'Briga com chefe/equipe'", text: "O que aconteceu exatamente? Se você pudesse voltar atrás, como resolveria essa situação de forma diferente?" }
    ],
    redFlags: "Sinal Verde: Busca por vaga efetiva após contrato temporário. Alerta Laranja: 'Era chato' ou 'Não me adaptei'. Alerta Vermelho: Insubordinação ou conflitos sem explicação coerente."
  },
  {
    id: 2,
    question: "O que te fez querer trabalhar com a gente?",
    intent: "Avaliar motivação e interesse na empresa.",
    followUps: [
      { trigger: "Motivação financeira pura", text: "Além do salário, o que te faria vir trabalhar feliz todos os dias?" },
      { trigger: "Proximidade física", text: "Morar perto é bom, mas o que acontece se surgir um imprevisto em casa?" }
    ]
  },
  {
    id: 2,
    question: "O que você acha que é mais importante em um bom funcionário?",
    intent: "Avaliar valores e senso de responsabilidade.",
    followUps: [
      { trigger: "Resposta vaga", text: "Pode me dar um exemplo prático de como você aplica isso no dia a dia?" }
    ]
  },
  {
    id: 3,
    question: "Como você lida com aprender coisas novas e seguir instruções?",
    intent: "Avaliar treinabilidade e obediência a normas.",
    followUps: [
      { trigger: "Prefere fazer do seu jeito", text: "Se o seu jeito for mais rápido mas menos seguro, qual você escolhe?" }
    ]
  },
  {
    id: 4,
    question: "Você prefere trabalhar sozinho ou gosta de estar em grupo?",
    intent: "Avaliar fit de equipe e colaboração.",
    followUps: [
      { trigger: "Individualista", text: "Se um colega atrasar e te prejudicar, como você resolve?" }
    ]
  },
  {
    id: 5,
    question: "Como você enxerga sua evolução aqui dentro nos próximos 2 anos?",
    intent: "Avaliar realismo de carreira e paciência estratégica.",
    followUps: [
      { trigger: "Quer ser 'chefe' rápido", text: "Você estaria disposto a ser multifuncional e auxiliar antes de qualquer cargo de liderança?" },
      { trigger: "Focado em cargos", text: "O que é mais importante para você agora: o título do cargo ou o domínio da função?" }
    ],
    redFlags: "Cuidado com o termo 'Chefe' em vez de 'Líder'. Atenção para quem quer pular degraus (Auxiliar -> Multifuncional -> Líder)."
  }
];

export function RecruitmentVideoRoom({ candidateName, onClose }: RecruitmentVideoRoomProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [nervousness, setNervousness] = useState(15);
  const [sincerity, setSincerity] = useState(85);
  const [coherence, setCoherence] = useState(100);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<number, 'good' | 'warning' | 'critical'>>({});
  const [showReport, setShowReport] = useState(false);
  const [heygenActive, setHeygenActive] = useState(false); // Preparado para HeyGen
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // --- HEYGEN INTEGRATION PLACEHOLDERS ---
  // Quando tiver o SDK, basta importar: import { StreamingAvatar } from "@heygen/streaming-avatar";

  const startHeyGenSession = async () => {
    console.log("Iniciando Sessão HeyGen com Token...");
    // 1. Buscar token do seu backend
    // 2. avatar.current = new StreamingAvatar({ token });
    // 3. const session = await avatar.current.createStartAvatar({ avatarName: "DJENY_ID", quality: "high" });
    // 4. videoRef.current.srcObject = session.stream;
    setHeygenActive(true);
  };

  const djenySpeak = async (text: string) => {
    console.log("Djeny falando:", text);
    // await avatar.current.speak({ text, task_type: "repeat" });
  };
  // ---------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
      // Rastrear início da entrevista após conexão estabelecida
      gtag.event({
        action: 'recruitment_interview_start',
        category: 'Gabinete',
        label: candidateName
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulação de telemetria
  useEffect(() => {
    if (isConnecting) return;
    const interval = setInterval(() => {
      setNervousness(prev => Math.max(10, Math.min(90, prev + (Math.random() * 10 - 5))));
      setSincerity(prev => Math.max(50, Math.min(100, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(interval);
  }, [isConnecting]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-stretch overflow-hidden font-sans">

      {/* Barra de Status Superior */}
      <div className="h-14 bg-zinc-950/80 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-headline tracking-widest text-sm uppercase">Recrutamento em Tempo Real // IA Humana</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Stream encrypted via Nexus Shield</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent)]">

        {/* Main Video Area (Djeny) */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border-2 border-white/5 bg-zinc-900 shadow-2xl group">
          {isConnecting ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-primary font-headline tracking-tighter text-xl">Estabelecendo Conexão Segura...</p>
            </div>
          ) : (
            <>
              {/* Vídeo da Djeny (Placeholder de Alta Qualidade ou Stream HeyGen) */}
              <div className="absolute inset-0 bg-zinc-800">
                {!heygenActive ? (
                  <>
                    <img
                      src="/IAs Nexus/Djeny - mentora.png"
                      alt="Djeny RH"
                      className="w-full h-full object-cover opacity-60 mix-blend-screen"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <Button
                        onClick={startHeyGenSession}
                        className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 font-black uppercase tracking-widest px-8"
                      >
                        <Zap className="mr-2 h-4 w-4" /> Ativar Avatar Digital (HeyGen)
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-primary/30">
                      <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Avatar Stream</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>

              {/* HUD da Djeny */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white font-headline">Djeny (Sua Estrategista)</h2>
                  <p className="text-primary font-mono text-sm uppercase tracking-widest">Protocolo Mentora // Ativo</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white">
                    <Volume2 className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Scanner FX overlay (Nexus Quality) */}
              <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent p-4">
                <div className="h-full w-full border border-primary/10 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/40 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-primary/40 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Side Panel (Candidate & Metrics) */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto">

          {/* Candidate Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/40 shadow-xl shadow-primary/5 bg-zinc-950">
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-16 w-16 text-white/10" />
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-emerald-500 text-black font-bold">LIVE</Badge>
              <span className="text-xs text-white/80 font-mono">1080p // 60fps</span>
            </div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-bold">{candidateName}</p>
            </div>
          </div>

          {/* Djeny Interview Guide */}
          <Card className="flex-1 bg-zinc-950/80 border-primary/20 backdrop-blur-xl overflow-hidden flex flex-col">
            <CardHeader className="p-4 border-b border-white/5 bg-primary/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Guia de Entrevista Djeny
                </h3>
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
                  Questão {currentQuestionIndex + 1} / {interviewGuide.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
              {/* Question Area */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <p className="text-xs text-primary/60 uppercase font-black tracking-widest mb-2">Pergunta Principal:</p>
                  <p className="text-lg font-bold text-white leading-tight">
                    {interviewGuide[currentQuestionIndex].question}
                  </p>
                </div>

                {interviewGuide[currentQuestionIndex].redFlags && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3 items-start">
                    <ShieldAlert className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                    <p className="text-[10px] text-red-400 font-medium leading-relaxed">
                      <span className="font-black uppercase tracking-widest block mb-1">Djeny Warning (Red Flags):</span>
                      {interviewGuide[currentQuestionIndex].redFlags}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sugestões de Gancho (Follow-up):</p>
                  <div className="grid gap-2">
                    {interviewGuide[currentQuestionIndex].followUps.map((f, i) => (
                      <button
                        key={i}
                        className="text-left p-3 rounded-lg bg-zinc-900 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      >
                        <p className="text-[10px] text-primary/60 font-bold uppercase mb-1">Se responder: "{f.trigger}"</p>
                        <p className="text-sm text-gray-300 group-hover:text-white">→ {f.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Live Rating */}
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Avaliação da Resposta:</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setScores({ ...scores, [currentQuestionIndex]: 'good' });
                      setCoherence(prev => Math.min(100, prev + 5));
                    }}
                    className={cn(
                      "flex-1 h-12 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                      scores[currentQuestionIndex] === 'good' ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-white/5 border-white/10 text-gray-400 hover:text-emerald-400"
                    )}
                  >
                    Firme / Coerente
                  </Button>
                  <Button
                    onClick={() => {
                      setScores({ ...scores, [currentQuestionIndex]: 'warning' });
                      setCoherence(prev => Math.max(0, prev - 10));
                    }}
                    className={cn(
                      "flex-1 h-12 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                      scores[currentQuestionIndex] === 'warning' ? "bg-amber-600 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "bg-white/5 border-white/10 text-gray-400 hover:text-amber-400"
                    )}
                  >
                    Inconclusiva
                  </Button>
                  <Button
                    onClick={() => {
                      setScores({ ...scores, [currentQuestionIndex]: 'critical' });
                      setCoherence(prev => Math.max(0, prev - 25));
                    }}
                    className={cn(
                      "flex-1 h-12 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                      scores[currentQuestionIndex] === 'critical' ? "bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "bg-white/5 border-white/10 text-gray-400 hover:text-red-400"
                    )}
                  >
                    Dissonante / Falha
                  </Button>
                </div>
              </div>

              {coherence < 60 && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3 items-center animate-pulse">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                    Djeny Sugere: "Sondar mais este ponto. Resposta não conecta com histórico anterior."
                  </p>
                </div>
              )}

              <div className="mt-auto flex justify-between gap-4">
                <Button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  variant="outline"
                  className="flex-1 border-white/10 text-gray-400"
                >
                  Anterior
                </Button>
                {currentQuestionIndex < interviewGuide.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="flex-1 bg-primary text-black font-black uppercase tracking-widest"
                  >
                    Próxima Pergunta
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowReport(true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest"
                  >
                    Gerar Relatório Final
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dossiê em Tempo Real */}
          <Card className="bg-zinc-950/80 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> Dossiê Psicológico Live
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" /> Nível de Nervosismo</span>
                    <span className={cn("text-xs font-bold", nervousness > 50 ? "text-red-400" : "text-amber-400")}>{Math.round(nervousness)}%</span>
                  </div>
                  <Progress value={nervousness} className="h-1.5 bg-white/5" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Smile className="h-3 w-3 text-emerald-500" /> Índice de Sinceridade</span>
                    <span className="text-xs font-bold text-emerald-400">{Math.round(sincerity)}%</span>
                  </div>
                  <Progress value={sincerity} className="h-1.5 bg-white/5" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><BrainCircuit className="h-3 w-3 text-blue-500" /> Coerência do Discurso</span>
                    <span className={cn("text-xs font-bold", coherence < 50 ? "text-red-400" : "text-blue-400")}>{Math.round(coherence)}%</span>
                  </div>
                  <Progress value={coherence} className="h-1.5 bg-white/5" />
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Análise de IA (Djeny)</h4>
                <div className="p-3 bg-white/5 rounded-md border border-white/5">
                  <p className="text-xs text-gray-300 italic">
                    "Candidato demonstrando hesitação ao descrever o último projeto. Recomendo aprofundar a pergunta sobre entrega de prazos."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Barra de Controle Inferior */}
      <div className="h-24 bg-zinc-950 border-t border-white/5 flex items-center justify-center gap-4 px-8 backdrop-blur-md">
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Mic className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Separator orientation="vertical" className="h-8 bg-white/10 mx-2" />
        <Button
          onClick={() => {
            gtag.event({
              action: 'recruitment_interview_end',
              category: 'Gabinete',
              label: candidateName
            });
            onClose();
          }}
          className="h-14 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-3 shadow-lg shadow-red-900/20"
        >
          <PhoneOff className="h-5 w-5" /> ENCERRAR ENTREVISTA
        </Button>
        {/* Final Report Modal (Djeny Style) */}
        {showReport && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl bg-zinc-950 border-2 border-primary/30 shadow-[0_0_100px_rgba(16,185,129,0.1)] rounded-[40px] overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary via-emerald-500 to-blue-500" />
              <CardHeader className="p-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <Activity className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-black text-white font-headline tracking-tighter uppercase">Relatório Final de Recrutamento</CardTitle>
                <CardDescription className="text-primary font-mono tracking-widest mt-2 uppercase">Processado por Djeny v2.5 // Protocolo Nexus</CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Candidato</p>
                    <p className="text-xl font-bold text-white">{candidateName}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Veredito</p>
                    <p className={cn(
                      "text-xl font-black uppercase tracking-widest",
                      Object.values(scores).filter(s => s === 'critical').length > 0 ? "text-red-500" : "text-emerald-500"
                    )}>
                      {Object.values(scores).filter(s => s === 'critical').length > 0 ? "REPROVADO" : "APROVADO"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Análise de Desempenho:</p>
                  <div className="space-y-2">
                    {interviewGuide.map((q, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-xs text-gray-400 truncate max-w-[70%]">{q.question}</span>
                        <Badge className={cn(
                          "text-[9px] font-black border-none px-3 py-1 uppercase",
                          scores[i] === 'good' ? "bg-emerald-600" : scores[i] === 'warning' ? "bg-amber-600" : "bg-red-600"
                        )}>
                          {scores[i] || 'N/A'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                  <p className="text-xs text-primary/80 italic text-center">
                    "Candidato analisado sob protocolo de primeiro emprego. Avaliação baseada em responsabilidade e treinabilidade."
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button onClick={onClose} variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 text-white font-black uppercase tracking-widest">
                    Fechar Sem Salvar
                  </Button>
                  <Button onClick={onClose} className="flex-1 h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                    Salvar e Encerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

    </div>
  );
}
