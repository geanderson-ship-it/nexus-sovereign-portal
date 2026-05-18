'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  ChevronLeft, 
  Users, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  XCircle, 
  Award,
  Activity,
  MessageSquare,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface OpponentProfile {
  id: string;
  name: string;
  role: string;
  trait: string;
  diff: string;
}

interface PactumSimulatorProps {
  profile: OpponentProfile;
  onClose: () => void;
}

// Pre-defined dialog trees for our opponent profiles
const simulatorDialogueTrees = {
  wall: [
    {
      round: 0,
      opponentLine: "Ficamos em silêncio analisando a proposta de vocês. Francamente, achamos que a sua precificação operacional de $85M está desconectada da nossa realidade logística. Qual o seu posicionamento?",
      options: [
        { 
          text: "Manter o valor de $85M e permanecer em silêncio absoluto.", 
          outcome: "Oponente piscou primeiro. Diante do silêncio, ele começou a hesitar sobre a própria capacidade logística de nos substituir. Margem de lucro protegida.",
          power: 15, closing: -5, margin: 2, nextRound: 1 
        },
        { 
          text: "Oferecer um desconto inicial e baixar para $82M para avançar.", 
          outcome: "Sinal de fraqueza detectado. The Wall percebeu nossa pressa e vai pressionar por mais concessões nos próximos itens.",
          power: -15, closing: 15, margin: -3, nextRound: 1 
        },
        { 
          text: "Explicar em detalhes técnicos a eficiência gerada pelo Dante Safra.", 
          outcome: "Defesa técnica razoável. Eles aceitaram a justificativa de eficiência, mas mantêm-se céticos no preço básico.",
          power: 5, closing: 5, margin: 0, nextRound: 1 
        }
      ]
    },
    {
      round: 1,
      opponentLine: "Aceitamos o valor base de $85M, porém somente sob a condição de que toda PI gerada na joint venture pertença a nós. Sem isso, nos retiramos da mesa.",
      options: [
        { 
          text: "Recusar e ameaçar encerrar a parceria imediatamente.", 
          outcome: "Aposta de alto risco. The Wall sentiu a ameaça à viabilidade da operação e recuou, mas a chance de fechamento caiu perigosamente.",
          power: 25, closing: -25, margin: 5, nextRound: 2 
        },
        { 
          text: "Propor copropriedade intelectual com royalties recíprocos.", 
          outcome: "Tática balanceada. Eles concordam com a copropriedade se o royalty for ligeiramente maior em favor deles.",
          power: 5, closing: 10, margin: -1, nextRound: 2 
        },
        { 
          text: "Ceder a PI contanto que mantenhamos a licença de uso vitalícia.", 
          outcome: "Concessão excessiva. Perdemos o controle intelectual, embora tenhamos mantido a funcionalidade local do software.",
          power: -20, closing: 25, margin: -5, nextRound: 2 
        }
      ]
    },
    {
      round: 2,
      opponentLine: "Para finalizarmos, o foro jurídico de Vladivostok sob leis siberianas locais é inegociável. Concordam com este termo final?",
      options: [
        { 
          text: "Exigir foro neutro em Genebra (Suíça) sob a ICC.", 
          outcome: "Excelente fechamento soberano! A Siberian cedeu à neutralidade suíça para não perder a tecnologia de ponta do Dante.",
          power: 20, closing: 10, margin: 3, nextRound: 3 
        },
        { 
          text: "Aceitar Vladivostok contanto que a câmara arbitral seja mista.", 
          outcome: "Acordo selado com risco jurisdicional médio. Uma arbitragem mista mitiga ligeiramente o protecionismo local.",
          power: -5, closing: 20, margin: -1, nextRound: 3 
        },
        { 
          text: "Ceder integralmente e assinar a comarca siberiana.", 
          outcome: "Risco de litígio exposto. Aceitamos a pior comarca arbitral possível apenas para fechar o negócio rápido.",
          power: -25, closing: 30, margin: -4, nextRound: 3 
        }
      ]
    }
  ],
  aggressor: [
    {
      round: 0,
      opponentLine: "Temos outras três propostas na mesa, duas delas abaixo de $78M. Se vocês não baixarem esse preço agora, encerraremos esta call de alinhamento em 2 minutos. O que vocês fazem?",
      options: [
        { 
          text: "Desmascarar o blefe informando que a concorrência não tem a tecnologia do Dante.", 
          outcome: "Cirúrgico. O Agressivo sentiu o contra-ataque. Ele mudou o tom e recuou da ameaça de desligar, mas a tensão subiu.",
          power: 20, closing: -5, margin: 4, nextRound: 1 
        },
        { 
          text: "Ceder ao pânico e igualar a oferta concorrente em $78M.", 
          outcome: "Quebra de margem severa. O Agressivo farejou o desespero e continuará nos atacando nos próximos tópicos.",
          power: -25, closing: 25, margin: -8, nextRound: 1 
        },
        { 
          text: "Ignorar as ameaças e focar na entrega de valor operacional em PPCP.", 
          outcome: "Foco técnico estável. Oponente percebeu que ameaças vazias não nos afetam de forma emocional.",
          power: 10, closing: 10, margin: 0, nextRound: 1 
        }
      ]
    },
    {
      round: 1,
      opponentLine: "Aceitamos o valor, mas exigimos que a sua equipe técnica arque com toda a responsabilidade de instalação, e caso atrase 1 dia, pagará multa diária de 2% do contrato.",
      options: [
        { 
          text: "Impor limite de multa logístico (Cap de $200k) e prazo de carência de 15 dias.", 
          outcome: "Excelente contraproposta. Limita nosso passivo judicial e impede penalidades diárias ruinosas.",
          power: 15, closing: 10, margin: 2, nextRound: 2 
        },
        { 
          text: "Aceitar a multa integral contanto que eles forneçam os servidores locais.", 
          outcome: "Acordo arriscado. A multa diária de 2% é altíssima e pode inviabilizar o lucro líquido da nossa joint venture.",
          power: -15, closing: 20, margin: -4, nextRound: 2 
        },
        { 
          text: "Negar qualquer multa contratual sob risco de cancelamento unilateral.", 
          outcome: "Agressividade mútua. Oponente recuou da multa diária abusiva, porém a relação ficou extremamente desgastada.",
          power: 10, closing: -20, margin: 3, nextRound: 2 
        }
      ]
    },
    {
      round: 2,
      opponentLine: "Vocês são difíceis de dobrar. Para fecharmos: foro em Vladivostok ou sem acordo. Qual a resposta final da diretoria?",
      options: [
        { 
          text: "Exigir foro neutro em Genebra perante a ICC.", 
          outcome: "Vitória espetacular. Neutralidade suíça garantida contra o negociador agressor mais severo.",
          power: 20, closing: 15, margin: 4, nextRound: 3 
        },
        { 
          text: "Aceitar foro siberiano com cláusula de desempate neutro.", 
          outcome: "Termo aceito. Foro siberiano ativo, com uma pequena brecha que nos dá chance razoável de defesa jurídica.",
          power: -5, closing: 20, margin: -1, nextRound: 3 
        },
        { 
          text: "Assinar o foro siberiano incondicionalmente.", 
          outcome: "Rendição jurídica na prorrogação. Oponente comemora vitória processual completa no foro deVladivostok.",
          power: -25, closing: 25, margin: -5, nextRound: 3 
        }
      ]
    }
  ],
  mirror: [
    {
      round: 0,
      opponentLine: "Adoramos a apresentação de vocês! A equipe técnica está super entusiasmada com o Dante. O preço de $85M nos parece ótimo. Que tal assinarmos a minuta padrão da nossa holding agora mesmo?",
      options: [
        { 
          text: "Recusar assinatura imediata e exigir auditoria detalhada de cláusulas.", 
          outcome: "Tática preventiva excelente. O oponente se mostrou surpreso. Nosso Dante Auditor local identificou assimetria oculta na minuta padrão deles.",
          power: 20, closing: -10, margin: 2, nextRound: 1 
        },
        { 
          text: "Aceitar e assinar a minuta padrão para agilizar o deal.", 
          outcome: "ERRO GRAVE DE ANÁLISE! O oponente foi amigável para nos induzir a assinar termos padrão extremamente desvantajosos em PI.",
          power: -30, closing: 30, margin: -10, nextRound: 1 
        },
        { 
          text: "Agradecer e propor envio da nossa própria minuta customizada da Nexus.", 
          outcome: "Ação assertiva. Ao tomarmos as rédeas da redação inicial, forçamos o oponente a negociar sob nossas premissas.",
          power: 15, closing: 5, margin: 4, nextRound: 1 
        }
      ]
    },
    {
      round: 1,
      opponentLine: "Compreendo a cautela. Na nossa minuta padrão, há apenas um pequeno detalhe que aloca a patente mestre dos dados à nossa empresa apenas por questões contábeis de balanço. Sem relevância operacional. Concordam?",
      options: [
        { 
          text: "Rejeitar categoricamente qualquer cessão de patente ou PI de dados.", 
          outcome: "Bloqueio tático cirúrgico. Mantivemos o core operacional sob nosso domínio restrito. Oponente aceitou sem contra-argumentar.",
          power: 25, closing: 5, margin: 5, nextRound: 2 
        },
        { 
          text: "Aceitar a cessão de dados desde que haja compensação anual fixa.", 
          outcome: "Compensação moderada. Ganhamos receita constante, mas perdemos a soberania sobre os insights e base de dados industriais.",
          power: -5, closing: 15, margin: -2, nextRound: 2 
        },
        { 
          text: "Aceitar a redação contábil sugerida por eles.", 
          outcome: "Assimetria consumada. Cedemos a patente sob pretexto 'contábil', deixando o core de dados sob domínio do oponente.",
          power: -25, closing: 25, margin: -8, nextRound: 2 
        }
      ]
    },
    {
      round: 2,
      opponentLine: "Para fecharmos com chave de ouro este grande projeto amigável: assinamos sob o foro neutro de Genebra (ICC)? Isso atende a ambas as partes, correto?",
      options: [
        { 
          text: "Aceitar foro neutro de Genebra (ICC) incondicionalmente.", 
          outcome: "Acordo neutro fechado com maestria. Genebra protege ambos e coroa nossa negociação estratégica soberana.",
          power: 20, closing: 20, margin: 4, nextRound: 3 
        },
        { 
          text: "Exigir foro neutro de Nova York perante a AAA.", 
          outcome: "Pequeno preciosismo logístico. Foro de NY aceito, mas com custas processuais levemente superiores.",
          power: 5, closing: 10, margin: 0, nextRound: 3 
        },
        { 
          text: "Ceder a qualquer foro sugerido nas negociações de fechamento.", 
          outcome: "Pequeno relaxamento final. Termo aceito, mas enfraquece nossa posição processual em favor do oponente.",
          power: -10, closing: 25, margin: -2, nextRound: 3 
        }
      ]
    }
  ]
};

export function PactumSimulator({ profile, onClose }: PactumSimulatorProps) {
  const [round, setRound] = useState(0);
  const [bargainingPower, setBargainingPower] = useState(50);
  const [closingChance, setClosingChance] = useState(50);
  const [profitMargin, setProfitMargin] = useState(15);
  
  const [dialogueHistory, setDialogueHistory] = useState<Array<{ sender: 'opponent' | 'user'; text: string; outcome?: string }>>([
    { sender: 'opponent', text: simulatorDialogueTrees[profile.id as 'wall' | 'aggressor' | 'mirror'][0].opponentLine }
  ]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [danteReview, setDanteReview] = useState<string>("Início de treinamento tático. Oponente inicializado perante modelagem comportamental do Dante.");
  const { toast } = useToast();

  const dataTree = simulatorDialogueTrees[profile.id as 'wall' | 'aggressor' | 'mirror'];

  const handleSelectOption = (optionIndex: number) => {
    const activeTree = dataTree[round];
    const option = activeTree.options[optionIndex];

    // Update gauges
    setBargainingPower(prev => Math.max(0, Math.min(100, prev + option.power)));
    setClosingChance(prev => Math.max(0, Math.min(100, prev + option.closing)));
    setProfitMargin(prev => Math.max(0, Math.min(50, prev + option.margin)));

    // Update history transcript
    const userMessage = { sender: 'user' as const, text: option.text, outcome: option.outcome };
    
    // Check if next round exists
    if (option.nextRound < dataTree.length) {
      const nextOpponentMessage = { sender: 'opponent' as const, text: dataTree[option.nextRound].opponentLine };
      setDialogueHistory([...dialogueHistory, userMessage, nextOpponentMessage]);
      setRound(option.nextRound);
      
      // Update Dante feedback box
      setDanteReview(option.outcome);
      
      toast({
        title: "Tática Processada!",
        description: `Decisão de Rodada ${round + 1} computada na simulação.`,
      });
    } else {
      // Simulation completed!
      setDialogueHistory([...dialogueHistory, userMessage]);
      setIsGameOver(true);
      setDanteReview(`Simulação Concluída. (Veredito Final: Margem em ${profitMargin + option.margin}%, Poder de Barganha em ${bargainingPower + option.power}%).`);
      
      toast({
        title: "Simulação Concluída!",
        description: "A rodada de simulação de negociação chegou ao fim.",
      });
    }
  };

  const getPerformanceGrade = () => {
    const finalScore = (bargainingPower + closingChance + (profitMargin * 3)) / 3;
    if (finalScore >= 75) return { grade: "A+", desc: "Negociador Soberano de Elite", color: "text-emerald-400 border-emerald-500/25" };
    if (finalScore >= 55) return { grade: "B-", desc: "Negociação Mediana Corporativa", color: "text-amber-400 border-amber-500/25" };
    return { grade: "F", desc: "Falha Tática // Risco de Falência", color: "text-red-400 border-red-500/25" };
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-stretch overflow-hidden font-sans">
      
      {/* SIMULATOR HEADER HUD */}
      <div className="h-14 bg-zinc-950/90 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-white font-headline tracking-[0.2em] text-xs uppercase font-black">Arena de Simulação // Dante Deals Coach</span>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-600/10 text-blue-400 border border-blue-600/20 font-black text-[9px] uppercase tracking-widest px-3 py-1">
            Arquétipo: {profile.name}
          </Badge>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-xl h-9 text-xs font-black uppercase"
          >
            Sair da Simulação
          </Button>
        </div>
      </div>

      {/* BODY GRID INJECTION */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.04),transparent)]">
        
        {/* Left Column: Dialogue Feed Log */}
        <Card className="flex-1 bg-zinc-950/70 border-2 border-blue-500/20 backdrop-blur-xl flex flex-col overflow-hidden">
          <CardHeader className="p-5 border-b border-white/5 bg-blue-500/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-headline text-white flex items-center gap-2 uppercase tracking-widest">
              <MessageSquare className="h-4 w-4 text-blue-400" /> Registro de Diálogo da Negociação
            </CardTitle>
            <Badge className="bg-slate-900 border border-white/10 font-bold text-[8px] uppercase tracking-widest px-2.5 py-0.5">
              {!isGameOver ? `Rodada ${round + 1} / ${dataTree.length}` : "Fim do Jogo"}
            </Badge>
          </CardHeader>
          
          <CardContent className="p-6 flex-1 overflow-y-auto space-y-6 max-h-[500px] flex flex-col justify-end">
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {dialogueHistory.map((item, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "flex flex-col max-w-[80%] p-4 rounded-2xl border transition-all duration-300",
                    item.sender === 'opponent' 
                      ? "bg-white/5 border-white/5 self-start" 
                      : "bg-blue-600/10 border-blue-500/30 self-end text-right"
                  )}
                >
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest mb-1.5 block font-headline",
                    item.sender === 'opponent' ? "text-red-400" : "text-blue-400"
                  )}>
                    {item.sender === 'opponent' ? profile.name : "Diretoria (Você)"}
                  </span>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                    "{item.text}"
                  </p>
                  {item.outcome && (
                    <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mt-3 text-[10px] text-emerald-400 italic text-left">
                      <strong>Feedback do Dante:</strong> {item.outcome}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Gauges & Choices Deck */}
        <div className="w-full lg:w-[450px] flex flex-col gap-4 overflow-y-auto">
          
          {/* Gauges Panel Card */}
          <Card className="bg-zinc-950/80 border-2 border-blue-500/20 backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest font-headline">Gauges de Negociação</span>
              </div>

              {/* Bargaining Power Gauge */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs font-bold font-mono">
                  <span className="text-gray-400 uppercase tracking-wide">Poder de Barganha</span>
                  <span className="text-blue-400">{bargainingPower}%</span>
                </div>
                <Progress value={bargainingPower} className="h-2 bg-white/5" />
              </div>

              {/* Closing Chance Gauge */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs font-bold font-mono">
                  <span className="text-gray-400 uppercase tracking-wide">Chance de Fechamento</span>
                  <span className="text-emerald-400">{closingChance}%</span>
                </div>
                <Progress value={closingChance} className="h-2 bg-white/5" />
              </div>

              {/* Profit Margin Gauge */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs font-bold font-mono">
                  <span className="text-gray-400 uppercase tracking-wide">Margem de Lucro Esperada</span>
                  <span className="text-violet-400">{profitMargin}%</span>
                </div>
                <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${(profitMargin / 50) * 100}%` }} />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Action Choice Deck (Only display if not gameover) */}
          <AnimatePresence mode="wait">
            {!isGameOver ? (
              <motion.div
                key="choices"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <Card className="bg-zinc-950/80 border-2 border-violet-500/20 backdrop-blur-xl">
                  <CardHeader className="p-4 border-b border-white/5 bg-violet-500/5">
                    <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest font-headline">Sua Decisão Tática:</h4>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    {dataTree[round].options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className="w-full text-left p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-violet-500/50 hover:bg-violet-500/10 text-xs font-bold text-slate-300 hover:text-white transition-all duration-300 flex items-center justify-between gap-4 group"
                      >
                        <span className="flex-1 leading-relaxed">
                          {opt.text}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-violet-400 transition-transform group-hover:translate-x-1 shrink-0" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="ledger"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Result Ledger display */}
                <Card className="bg-zinc-950 border-2 border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.1)] rounded-3xl overflow-hidden text-center">
                  <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 animate-pulse" />
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-center mb-3">
                      <div className="h-14 w-14 bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl flex items-center justify-center">
                        <Award className="h-8 w-8 text-emerald-400" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-white font-headline uppercase tracking-tighter">Veredito do Dante</CardTitle>
                    <CardDescription className="text-emerald-400 font-mono tracking-widest text-[9px] uppercase mt-1">Análise de Rendimento do Fechamento</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    
                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Graduação Final do Acordo</span>
                      <h4 className={cn("text-6xl font-black font-mono tracking-tighter", getPerformanceGrade().color)}>
                        {getPerformanceGrade().grade}
                      </h4>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-[9px] uppercase tracking-widest px-3 py-1">
                        {getPerformanceGrade().desc}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Margem de Lucro</span>
                        <h5 className="text-xl font-black text-violet-400 font-mono mt-1">{profitMargin}%</h5>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Deal Status</span>
                        <h5 className="text-xl font-black text-emerald-400 font-mono mt-1">FECHADO</h5>
                      </div>
                    </div>

                    <Button
                      onClick={onClose}
                      className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20"
                    >
                      Concluir e Voltar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      
    </div>
  );
}
