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
      opponentLine: "Ficamos em silêncio analisando a proposta de vocês. Francamente, achamos que a sua precificação operacional de $85M está além da nossa realidade logística de mercado. Qual o racional de vocês?",
      options: [
        { 
          text: "Manter o valor de $85M e aguardar a avaliação deles.", 
          outcome: "A outra parte recuou primeiro. Diante do silêncio analítico, eles começaram a hesitar sobre a própria capacidade logística de nos substituir. Margem mantida.",
          power: 15, closing: -5, margin: 2, nextRound: 1 
        },
        { 
          text: "Oferecer uma readequação inicial e baixar para $82M para avançar.", 
          outcome: "Sinal de excesso de flexibilidade. O Perfil Analítico percebeu nossa pressa e vai focar em maiores descontos nos próximos itens.",
          power: -15, closing: 15, margin: -3, nextRound: 1 
        },
        { 
          text: "Explicar em detalhes técnicos a eficiência gerada pelo nosso algoritmo.", 
          outcome: "Defesa técnica embasada. Eles aceitaram a justificativa de eficiência, mas mantêm-se criteriosos quanto ao orçamento básico.",
          power: 5, closing: 5, margin: 0, nextRound: 1 
        }
      ]
    },
    {
      round: 1,
      opponentLine: "Validamos o valor base de $85M, porém somente sob a condição de que toda a Propriedade Intelectual (PI) gerada na joint venture pertença a nós. Do contrário, o projeto fica inviável.",
      options: [
        { 
          text: "Recusar firmemente e sugerir a suspensão das conversas.", 
          outcome: "Posicionamento de alto risco. O Perfil Analítico sentiu o risco à viabilidade da operação e recuou, mas a fluidez do debate caiu.",
          power: 25, closing: -25, margin: 5, nextRound: 2 
        },
        { 
          text: "Propor copropriedade intelectual com royalties recíprocos.", 
          outcome: "Tática colaborativa balanceada. Eles concordam com a copropriedade se o royalty for ligeiramente maior em favor deles.",
          power: 5, closing: 10, margin: -1, nextRound: 2 
        },
        { 
          text: "Ceder a PI contanto que mantenhamos a licença de uso vitalícia.", 
          outcome: "Concessão excessiva. Cedemos o controle intelectual, embora tenhamos mantido a funcionalidade local do software.",
          power: -20, closing: 25, margin: -5, nextRound: 2 
        }
      ]
    },
    {
      round: 2,
      opponentLine: "Para finalizarmos, o foro jurídico de Vladivostok sob leis siberianas locais é fundamental para nosso compliance. Podemos concordar com este termo final?",
      options: [
        { 
          text: "Propor foro neutro em Genebra (Suíça) sob a ICC.", 
          outcome: "Excelente fechamento soberano! A Siberian concordou com a neutralidade suíça para viabilizar nossa tecnologia de ponta.",
          power: 20, closing: 10, margin: 3, nextRound: 3 
        },
        { 
          text: "Aceitar Vladivostok contanto que a câmara arbitral seja mista.", 
          outcome: "Acordo selado com risco jurisdicional médio. Uma arbitragem mista mitiga ligeiramente o impacto do foro local.",
          power: -5, closing: 20, margin: -1, nextRound: 3 
        },
        { 
          text: "Concordar integralmente com a comarca siberiana.", 
          outcome: "Risco de compliance elevado. Aceitamos o foro de maior exposição apenas para fechar o negócio com agilidade.",
          power: -25, closing: 30, margin: -4, nextRound: 3 
        }
      ]
    }
  ],
  aggressor: [
    {
      round: 0,
      opponentLine: "Temos outras três propostas na mesa, duas delas abaixo de $78M. Precisamos que reavaliem esse preço agora, ou teremos que encerrar esta pauta em breve. Como podemos avançar?",
      options: [
        { 
          text: "Argumentar que a concorrência não possui nossa tecnologia avançada.", 
          outcome: "Cirúrgico. O Perfil Assertivo recalculou o cenário. A abordagem direta evitou concessões precipitadas, mas o debate segue firme.",
          power: 20, closing: -5, margin: 4, nextRound: 1 
        },
        { 
          text: "Ceder à pressão e igualar a oferta concorrente em $78M.", 
          outcome: "Queda brusca de margem. O Perfil Assertivo notou grande flexibilidade e continuará buscando reduções nos próximos tópicos.",
          power: -25, closing: 25, margin: -8, nextRound: 1 
        },
        { 
          text: "Ignorar a pressão e focar na entrega de valor operacional em PPCP.", 
          outcome: "Foco técnico muito estável. A outra parte percebeu que pressões de prazo não afetam nossa avaliação.",
          power: 10, closing: 10, margin: 0, nextRound: 1 
        }
      ]
    },
    {
      round: 1,
      opponentLine: "Podemos seguir com o valor, mas precisamos que a sua equipe assuma toda a responsabilidade de instalação. Caso haja atraso, propomos multa diária de 2% do contrato.",
      options: [
        { 
          text: "Sugerir teto de multa (Cap de $200k) e prazo de carência de 15 dias.", 
          outcome: "Excelente contraproposta. Limita nossa exposição e traz razoabilidade para penalidades diárias agressivas.",
          power: 15, closing: 10, margin: 2, nextRound: 2 
        },
        { 
          text: "Aceitar a multa integral contanto que eles forneçam a infraestrutura local.", 
          outcome: "Acordo de alta tensão. A multa diária de 2% é arriscada e pode impactar o lucro líquido da nossa joint venture.",
          power: -15, closing: 20, margin: -4, nextRound: 2 
        },
        { 
          text: "Recusar a inclusão de multa contratual e sugerir revisão do cronograma.", 
          outcome: "Tensão na mesa. A outra parte recuou da multa diária rigorosa, porém o alinhamento de expectativas ficou mais frio.",
          power: 10, closing: -20, margin: 3, nextRound: 2 
        }
      ]
    },
    {
      round: 2,
      opponentLine: "Vocês são muito firmes nas posições. Para fecharmos o escopo: foro em Vladivostok. Qual a posição final da diretoria?",
      options: [
        { 
          text: "Reiterar necessidade de foro neutro em Genebra perante a ICC.", 
          outcome: "Acordo diplomático de alto nível. Neutralidade suíça garantida, superando o estilo incisivo da outra parte.",
          power: 20, closing: 15, margin: 4, nextRound: 3 
        },
        { 
          text: "Aceitar foro siberiano com cláusula de mediação internacional prévia.", 
          outcome: "Termo aceito de forma balanceada. Foro siberiano mantido, com uma brecha razoável de mediação internacional.",
          power: -5, closing: 20, margin: -1, nextRound: 3 
        },
        { 
          text: "Aprovar o foro siberiano incondicionalmente.", 
          outcome: "Concessão excessiva no fechamento. A outra parte assegura a jurisdição local de Vladivostok.",
          power: -25, closing: 25, margin: -5, nextRound: 3 
        }
      ]
    }
  ],
  mirror: [
    {
      round: 0,
      opponentLine: "Gostamos muito da apresentação de vocês! A equipe técnica está super alinhada com nosso algoritmo. O valor nos parece justo. Que tal utilizarmos a minuta padrão da nossa holding para agilizar?",
      options: [
        { 
          text: "Agradecer e sugerir auditoria detalhada das cláusulas antes de avançar.", 
          outcome: "Tática preventiva excelente. O nosso algoritmo identificou termos assimétricos ocultos na minuta padrão que passariam despercebidos.",
          power: 20, closing: -10, margin: 2, nextRound: 1 
        },
        { 
          text: "Aceitar e seguir com a minuta padrão deles visando eficiência.", 
          outcome: "ALERTA DE DESVIO! A abordagem amigável nos induziu a aceitar termos padrão que possuem alto risco em Propriedade Intelectual.",
          power: -30, closing: 30, margin: -10, nextRound: 1 
        },
        { 
          text: "Agradecer e propor que utilizemos a minuta customizada da Nexus.", 
          outcome: "Ação de liderança muito assertiva. Ao propor nosso documento base, asseguramos um ambiente mais equilibrado para o debate.",
          power: 15, closing: 5, margin: 4, nextRound: 1 
        }
      ]
    },
    {
      round: 1,
      opponentLine: "Compreendo a cautela. Na nossa minuta padrão, há apenas uma formalidade contábil que aloca a patente técnica de dados à nossa empresa. É um detalhe administrativo, concordam?",
      options: [
        { 
          text: "Rejeitar a transferência de patente ou PI sobre os dados.", 
          outcome: "Posicionamento assertivo e cirúrgico. Mantivemos o core tecnológico sob nosso domínio e o Perfil Conciliador ajustou os termos.",
          power: 25, closing: 5, margin: 5, nextRound: 2 
        },
        { 
          text: "Aceitar a alocação de dados mediante uma compensação anual fixa.", 
          outcome: "Troca financeira justa. Garantimos receita constante, mas abrimos mão do controle absoluto sobre os insights gerados.",
          power: -5, closing: 15, margin: -2, nextRound: 2 
        },
        { 
          text: "Aprovar a formalidade administrativa sugerida por eles.", 
          outcome: "Assimetria validada. A redação 'contábil' disfarçava uma concessão grave, deixando a tecnologia central sob controle deles.",
          power: -25, closing: 25, margin: -8, nextRound: 2 
        }
      ]
    },
    {
      round: 2,
      opponentLine: "Para coroarmos esta excelente parceria: adotamos o foro neutro de Genebra (ICC)? Acreditamos que atende perfeitamente a ambas as partes, correto?",
      options: [
        { 
          text: "Confirmar foro neutro de Genebra (ICC) prontamente.", 
          outcome: "Acordo neutro fechado com maestria. Genebra protege ambos e valida nossa avaliação estratégica cooperativa.",
          power: 20, closing: 20, margin: 4, nextRound: 3 
        },
        { 
          text: "Sugerir foro neutro alternativo em Nova York perante a AAA.", 
          outcome: "Ajuste logístico aceito. Foro de NY confirmado, demandando apenas uma ligeira adaptação processual posterior.",
          power: 5, closing: 10, margin: 0, nextRound: 3 
        },
        { 
          text: "Acompanhar qualquer sugestão de foro da outra parte.", 
          outcome: "Acordo suave. Termo aceito, embora deleguemos a condução jurisdicional final ao critério deles.",
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
  const [danteReview, setDanteReview] = useState<string>("Início da avaliação tática. Perfil inicializado perante modelagem comportamental do nosso algoritmo.");
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
          <span className="text-white font-headline tracking-[0.2em] text-xs uppercase font-black">Sala de Avaliação // Pactum Coach</span>
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
                      <strong>Feedback do Algoritmo:</strong> {item.outcome}
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
                    <CardTitle className="text-2xl font-black text-white font-headline uppercase tracking-tighter">Veredito do Algoritmo</CardTitle>
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
