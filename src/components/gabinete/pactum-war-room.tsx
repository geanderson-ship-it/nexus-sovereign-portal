'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Activity, 
  Mic, 
  Video, 
  PhoneOff, 
  ShieldAlert, 
  MessageSquare, 
  Volume2, 
  Zap, 
  Smile, 
  BrainCircuit, 
  Loader2, 
  Maximize2,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  ChevronLeft,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PactumWarRoomProps {
  dealName: string;
  opponentName: string;
  dealValue: string;
  onClose: () => void;
}

// Multi-stage high-stakes negotiation guide based on game theory
const negotiationSteps = [
  {
    id: 0,
    topic: "Propriedade Intelectual (PI)",
    opponentClaim: "Exige propriedade única e irrestrita sobre toda PI dos algoritmos do Dante desenvolvida conjuntamente.",
    userOptions: [
      { 
        label: "Exigir Copropriedade (50/50) com Arbitragem", 
        outcome: "good",
        advise: "Excelente escolha. A Siberian sentiu a firmeza jurídica. Seu estresse vocal subiu para 72% e a coerência do argumento deles caiu.", 
        nervousnessMod: 15, sincerityMod: 5, coherenceMod: -10 
      },
      { 
        label: "Propor Licenciamento Comercial Recíproco", 
        outcome: "warning", 
        advise: "Opção defensiva. Evita litígio direto, mas enfraquece nossa soberania tecnológica a longo prazo.",
        nervousnessMod: -5, sincerityMod: 0, coherenceMod: 5 
      },
      { 
        label: "Aceitar com Cláusula de Royalty Perpétuo", 
        outcome: "critical", 
        advise: "RISCO DE ASSIMETRIA! Aceitar ceder a propriedade debilita o ativo mestre do Nexus. Oponente demonstrou alívio imediato (estresse vocal caiu a 15%).",
        nervousnessMod: -25, sincerityMod: -15, coherenceMod: 20 
      }
    ]
  },
  {
    id: 1,
    topic: "Vulnerabilidade Portuária e Multas",
    opponentClaim: "Deseja imputar à Nexus multas e custos logísticos por atrasos gerados em portos sob controle siberiano.",
    userOptions: [
      { 
        label: "Rejeitar Responsabilidade Cruzada (Divisão por Território)", 
        outcome: "good",
        advise: "Tática cirúrgica. Ao delimitar a jurisdição física, removemos o risco oculto. O oponente hesitou 4 segundos para responder (estresse vocal: 85%).", 
        nervousnessMod: 20, sincerityMod: 10, coherenceMod: -20 
      },
      { 
        label: "Inserir Teto Máximo de Indenização (Cap de $150k)", 
        outcome: "warning", 
        advise: "Limitação razoável. Protege a Nexus de perdas bilionárias, embora ainda assumamos um percentual de risco indevido.",
        nervousnessMod: 5, sincerityMod: 0, coherenceMod: -5 
      },
      { 
        label: "Ceder em troca de Desconto de Minério", 
        outcome: "critical", 
        advise: "ALERTA VERMELHO! O desconto mineral não cobre passivos judiciais decorrentes de embargo portuário internacional. O oponente aceitou rápido demais.",
        nervousnessMod: -15, sincerityMod: -10, coherenceMod: 15 
      }
    ]
  },
  {
    id: 2,
    topic: "Foro Judicial e Solução de Conflitos",
    opponentClaim: "Insiste no foro judicial de Vladivostok sob as leis estatais siberianas protetivas.",
    userOptions: [
      { 
        label: "Forçar Arbitragem Internacional em Genebra (ICC)", 
        outcome: "good",
        advise: "Xeque-mate tático. Genebra garante neutralidade absoluta e leis equitativas. Oponente perdeu a alavancagem local. Estresse de voz: 92%.", 
        nervousnessMod: 25, sincerityMod: 15, coherenceMod: -30 
      },
      { 
        label: "Propor Foro Neutro em Londres", 
        outcome: "warning", 
        advise: "Foro intermediário. Aceitável, porém com custos jurídicos de processamento ligeiramente superiores aos da Suíça.",
        nervousnessMod: 10, sincerityMod: 5, coherenceMod: -10 
      },
      { 
        label: "Aceitar Vladivostok se houver Arbitragem Prévia", 
        outcome: "critical", 
        advise: "PERIGO JURÍDICO! Sob leis locais, a arbitragem prévia pode ser ignorada ou enviesada por tribunais estatais regionais.",
        nervousnessMod: -10, sincerityMod: -5, coherenceMod: 10 
      }
    ]
  }
];

export function PactumWarRoom({ dealName, opponentName, dealValue, onClose }: PactumWarRoomProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [nervousness, setNervousness] = useState(30);
  const [sincerity, setSincerity] = useState(70);
  const [coherence, setCoherence] = useState(80);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
  const [showLedger, setShowLedger] = useState(false);
  const [danteAdvice, setDanteAdvice] = useState<string>("Conexão estabelecida com sucesso. Analisador de estresse fonético ativado. Aguardando primeira réplica.");
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulated dynamic biometric hum
  useEffect(() => {
    if (isConnecting || showLedger) return;
    const interval = setInterval(() => {
      setNervousness(prev => Math.max(15, Math.min(95, prev + (Math.random() * 8 - 4))));
      setSincerity(prev => Math.max(40, Math.min(100, prev + (Math.random() * 4 - 2))));
    }, 4000);
    return () => clearInterval(interval);
  }, [isConnecting, showLedger]);

  const handleSelectOption = (optionIndex: number) => {
    const step = negotiationSteps[currentStepIndex];
    const option = step.userOptions[optionIndex];

    setSelectedChoices({ ...selectedChoices, [currentStepIndex]: optionIndex });
    
    // Apply metric modifiers dynamically
    setNervousness(prev => Math.max(10, Math.min(100, prev + option.nervousnessMod)));
    setSincerity(prev => Math.max(20, Math.min(100, prev + option.sincerityMod)));
    setCoherence(prev => Math.max(10, Math.min(100, prev + option.coherenceMod)));

    // Update Dante advising console
    setDanteAdvice(option.advise);

    toast({
      title: "Tática Aplicada!",
      description: `Argumento de ${step.topic} submetido na mesa de negociação.`,
    });
  };

  const getOverallVerdict = () => {
    let goodCount = 0;
    let criticalCount = 0;
    
    Object.entries(selectedChoices).forEach(([stepIdx, optIdx]) => {
      const outcome = negotiationSteps[Number(stepIdx)].userOptions[optIdx].outcome;
      if (outcome === 'good') goodCount++;
      if (outcome === 'critical') criticalCount++;
    });

    if (goodCount >= 2) return "NEGOCIAÇÃO ALTAMENTE SEGURA (APROVADO)";
    if (criticalCount >= 1) return "RISCOS ASSECUTÓRIOS GRAVES (RE-NEGOCIAR)";
    return "TERMOS INTERMEDIÁRIOS (REVISÃO NECESSÁRIA)";
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-stretch overflow-hidden font-sans">
      
      {/* HUD HEADER BAR */}
      <div className="h-14 bg-zinc-950/90 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-xl h-9 px-3 text-xs font-black uppercase flex items-center gap-1.5 transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Separator orientation="vertical" className="h-5 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-white font-headline tracking-[0.2em] text-[10px] sm:text-xs uppercase font-black">Deal War Room // Telemetria de Blefe Ativa</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 font-black text-[9px] uppercase tracking-widest px-3 py-1">
            Valor: {dealValue}
          </Badge>
          <div className="hidden md:flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-[10px] text-gray-500 font-mono">ENCRYPTED STREAM // PROTOCOLO NX-09</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* BODY HUB SPLIT */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04),transparent)]">
        
        {/* Opponent Simulated Stream (Large Frame) */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border-2 border-white/5 bg-zinc-950 shadow-2xl flex flex-col justify-between p-6">
          {isConnecting ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-blue-400 font-headline tracking-tighter text-xl uppercase">Escaneando Espectro Fônico do Oponente...</p>
            </div>
          ) : (
            <>
              {/* Telemetry Matrix Grid Overlays */}
              <div className="absolute inset-0 pointer-events-none z-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Floating Client Information Card */}
              <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
                <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-400 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block font-headline">Operação Ativa // Conta-Cliente</span>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight font-headline">{dealName}</h4>
                  <p className="text-[9px] text-blue-400 font-mono mt-0.5">Oponente: {opponentName}</p>
                </div>
              </div>

              {/* Opponent camera screen graphics */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                
                {/* Simulated Target Reticle */}
                <div className="relative h-60 w-60 rounded-full border border-blue-500/20 flex items-center justify-center">
                  <div className="absolute h-52 w-52 rounded-full border border-dashed border-blue-500/10 animate-spin" />
                  
                  {/* Scanner Waves */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                      "h-36 w-36 rounded-full border flex items-center justify-center transition-all duration-700",
                      nervousness > 70 ? "border-red-500 bg-red-500/5 animate-pulse" : "border-blue-500 bg-blue-500/5"
                    )}>
                      <Activity className={cn("h-16 w-16", nervousness > 70 ? "text-red-400" : "text-blue-400")} />
                    </div>
                  </div>
                  
                  {/* Scanning Crosshairs */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-60 bg-blue-500/10" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-60 h-0.5 bg-blue-500/10" />
                </div>

                {/* Opponent metadata */}
                <div className="mt-8 text-center space-y-1 bg-black/60 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
                  <h3 className="text-lg font-black text-white font-headline uppercase">{opponentName}</h3>
                  <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">Canal de Voz // Vladivostok Feed</p>
                </div>
              </div>

              {/* Dynamic Telemetry HUD Overlays */}
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-4 w-full mt-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block font-headline">Status do Oponente</span>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full animate-ping",
                      nervousness > 70 ? "bg-red-500" : "bg-emerald-500"
                    )} />
                    <span className="text-white font-mono text-xs font-bold uppercase tracking-wider">
                      {nervousness > 70 ? "Instabilidade Emocional / Hesitante" : "Argumento Controlado / Firme"}
                    </span>
                  </div>
                </div>

                {/* Bluff Meter Display */}
                <div className="bg-black/80 border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Probabilidade de Blefe</p>
                    <h4 className={cn(
                      "text-3xl font-black font-mono tracking-tighter mt-1",
                      nervousness > 60 ? "text-red-400" : "text-blue-400"
                    )}>
                      {Math.round(nervousness * 0.95)}%
                    </h4>
                  </div>
                  <Separator orientation="vertical" className="h-10 bg-white/10" />
                  <Badge className={cn(
                    "font-black text-[9px] uppercase tracking-widest border-none px-3 py-1.5",
                    nervousness > 60 ? "bg-red-500 text-white animate-pulse" : "bg-blue-600 text-white"
                  )}>
                    {nervousness > 60 ? "Blefe Provável" : "Baixo Risco"}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tactical side-deck panel */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4 overflow-y-auto">
          
          {/* Active step dialogue console */}
          <Card className="flex-1 bg-zinc-950/80 border-2 border-blue-500/20 backdrop-blur-xl flex flex-col overflow-hidden">
            <CardHeader className="p-4 border-b border-white/5 bg-blue-500/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 font-headline">
                  <MessageSquare className="h-4 w-4 animate-pulse" /> Consola de Negociação
                </h3>
                <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400 font-bold uppercase">
                  Tópico {currentStepIndex + 1} / {negotiationSteps.length}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
              
              {/* Opponent point */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-1.5 font-headline">Alegação do Oponente:</p>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                    "{negotiationSteps[currentStepIndex].opponentClaim}"
                  </p>
                </div>

                <Separator className="bg-white/5" />

                {/* User actionable cards */}
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sua Réplica Estratégica:</p>
                  <div className="grid gap-2.5">
                    {negotiationSteps[currentStepIndex].userOptions.map((opt, optIdx) => {
                      const isSelected = selectedChoices[currentStepIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={cn(
                            "text-left p-4 rounded-2xl border transition-all duration-300 group flex flex-col gap-1.5",
                            isSelected
                              ? opt.outcome === 'good'
                                ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                : opt.outcome === 'warning'
                                ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                                : "bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                              : "bg-zinc-900 border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5"
                          )}
                        >
                          <span className={cn(
                            "text-xs font-bold group-hover:text-blue-400 transition-colors",
                            isSelected ? "text-white" : "text-slate-300"
                          )}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step Navigation buttons */}
              <div className="mt-auto flex justify-between gap-4 pt-6 border-t border-white/5">
                <Button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex(prev => prev - 1)}
                  variant="outline"
                  className="flex-1 border-white/10 text-slate-400 hover:text-white rounded-xl h-11 text-xs uppercase font-bold"
                >
                  Anterior
                </Button>
                
                {currentStepIndex < negotiationSteps.length - 1 ? (
                  <Button
                    disabled={selectedChoices[currentStepIndex] === undefined}
                    onClick={() => setCurrentStepIndex(prev => prev + 1)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl h-11 shadow-lg shadow-blue-600/15"
                  >
                    Próximo Item
                  </Button>
                ) : (
                  <Button
                    disabled={selectedChoices[currentStepIndex] === undefined}
                    onClick={() => setShowLedger(true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl h-11 shadow-lg shadow-emerald-600/15"
                  >
                    Gerar Acordo
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Dante real-time strategy feed */}
          <Card className="bg-zinc-950/80 border-2 border-violet-500/20 backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
              
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-violet-400 animate-pulse" />
                <span className="text-xs font-black text-violet-400 uppercase tracking-widest font-headline">Aconselhamento do Dante</span>
              </div>

              {/* Live biometric values tracker progress */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end text-xs font-bold">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-500" /> Nervosismo Vocal
                    </span>
                    <span className={cn(
                      nervousness > 60 ? "text-red-400" : "text-amber-400"
                    )}>
                      {Math.round(nervousness)}%
                    </span>
                  </div>
                  <Progress value={nervousness} className="h-1.5 bg-white/5" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end text-xs font-bold">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Smile className="h-3.5 w-3.5 text-emerald-500" /> Índice de Sinceridade
                    </span>
                    <span className="text-emerald-400">
                      {Math.round(sincerity)}%
                    </span>
                  </div>
                  <Progress value={sincerity} className="h-1.5 bg-white/5" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end text-xs font-bold">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <BrainCircuit className="h-3.5 w-3.5 text-blue-500" /> Coerência Lógica
                    </span>
                    <span className={cn(
                      coherence < 50 ? "text-red-400" : "text-blue-400"
                    )}>
                      {Math.round(coherence)}%
                    </span>
                  </div>
                  <Progress value={coherence} className="h-1.5 bg-white/5" />
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Advice box */}
              <div className="p-4 bg-violet-500/5 border border-violet-500/15 rounded-2xl">
                <p className="text-xs text-violet-300 italic leading-relaxed pl-2 border-l-2 border-violet-500/40">
                  {danteAdvice}
                </p>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>

      {/* HUD FOOTER ACTIONS */}
      <div className="h-20 bg-zinc-950 border-t border-white/5 flex items-center justify-center gap-4 px-8 backdrop-blur-md">
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors">
          <Mic className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors">
          <Volume2 className="h-5 w-5" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-2" />
        
        <Button
          onClick={() => {
            setShowLedger(true);
          }}
          className="h-12 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all"
        >
          <PhoneOff className="h-4 w-4" /> Finalizar Operação
        </Button>
      </div>

      {/* FINAL REPORT LEDGER OVERLAY MODAL */}
      {showLedger && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl bg-zinc-950 border-2 border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.15)] rounded-[40px] overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-500 animate-pulse" />
            
            <CardHeader className="p-10 text-center border-b border-white/5 bg-blue-500/5">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-blue-500/10 border-2 border-blue-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-black text-white font-headline tracking-tighter uppercase">Minuta Final de Acordo</CardTitle>
              <CardDescription className="text-blue-400 font-mono tracking-widest text-[10px] uppercase mt-1">Auditado por Dante Deals // NX-ACT-99</CardDescription>
            </CardHeader>
            
            <CardContent className="p-10 space-y-8 max-h-[450px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Acordo Principal</span>
                  <h4 className="font-bold text-white text-sm mt-1">{dealName}</h4>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Veredito do Dante</span>
                  <h4 className={cn(
                    "font-black text-xs uppercase tracking-wider mt-1",
                    getOverallVerdict().includes('APROVADO') ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {getOverallVerdict()}
                  </h4>
                </div>
              </div>

              {/* Dialogue items status */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resumo dos Termos Firmados:</p>
                <div className="space-y-2">
                  {negotiationSteps.map((step, idx) => {
                    const choiceIdx = selectedChoices[idx];
                    const choice = choiceIdx !== undefined ? step.userOptions[choiceIdx] : null;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-xs text-slate-300 font-bold max-w-[50%] truncate">{step.topic}</span>
                        <Badge className={cn(
                          "text-[9px] font-black border-none px-2.5 py-0.5 uppercase tracking-widest",
                          choice?.outcome === 'good' ? "bg-emerald-600 text-white" :
                          choice?.outcome === 'warning' ? "bg-amber-600 text-white" :
                          choice?.outcome === 'critical' ? "bg-red-600 text-white" :
                          "bg-slate-700 text-white"
                        )}>
                          {choice ? choice.outcome === 'good' ? 'Soberano' : choice.outcome === 'warning' ? 'Intermediário' : 'Assimétrico' : 'Pendente'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tactical signoff */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 text-blue-400 shrink-0" />
                <p className="text-xs text-blue-300 leading-normal italic">
                  "Este tratado foi avaliado com bases em modelos de equilíbrio de Nash. Recomenda-se prosseguir com a assinatura digital imediata caso o veredito seja Soberano."
                </p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  className="flex-1 border-white/10 text-slate-400 hover:text-white rounded-2xl h-14 text-xs font-black uppercase tracking-widest"
                >
                  Fechar
                </Button>
                <Button 
                  onClick={onClose} 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20"
                >
                  Confirmar e Registrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
