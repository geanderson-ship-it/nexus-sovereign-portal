'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Copy, 
  RotateCcw,
  Scale, 
  Eye, 
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Contract templates data
const contractsTemplates = {
  siberian: {
    title: "CONTRATO DE JOINT VENTURE - SIBERIAN STEEL & NEXUS CORE",
    subTitle: "M&A Estratégico // Protocolo AD-72",
    score: 68,
    metrics: { riskLevel: 'Alto', asymmetricCount: 4, leveragePoints: 2 },
    clauses: [
      {
        id: 'c1',
        title: "Cláusula 4.1 — Alocação de Propriedade Intelectual",
        type: 'asymmetric',
        risk: 'Alto Risk',
        text: "Toda e qualquer tecnologia de inteligência artificial ou algoritmo de tomada de decisão embarcado nos ativos conjuntos, desenvolvidos antes ou durante a vigência deste acordo, será de propriedade exclusiva e irrestrita da Siberian Steel Corp, restando à Nexus Core apenas a licença operacional não transferível.",
        analysis: "Esta cláusula configura uma assimetria intelectual severa. Ela absorve permanentemente os algoritmos proprietários da Nexus Core (incluindo o core do nosso algoritmo) sem compensação proporcional, deixando nossa empresa vulnerável e sem direitos sobre inovações futuras.",
        redraft: "Toda tecnologia de propriedade intelectual pré-existente continuará de propriedade única e exclusiva de suas respectivas partes criadoras. Qualquer algoritmo desenvolvido conjuntamente no escopo da joint venture será patenteado em copropriedade (50/50), garantindo licenças mútuas perpétuas, globais e livres de royalties."
      },
      {
        id: 'c2',
        title: "Cláusula 14.3 — Responsabilidade por Multas Logísticas",
        type: 'critical',
        risk: 'Crítico',
        text: "Em caso de atrasos decorrentes de greves, falhas logísticas regionais ou escassez de suprimentos minerais no porto de embarque siberiano, a Nexus Core assumirá integralmente as multas de demurrage e os custos operacionais adicionais incidentes nas transportadoras parceiras.",
        analysis: "Responsabilidade cruzada abusiva. Força nossa operação a pagar por falhas operacionais e greves que ocorrem no território e controle direto da Siberian Steel. Risco financeiro exposto desproporcionalmente.",
        redraft: "Cada parte será individualmente responsável por quaisquer custos operacionais extras ou multas logísticas originadas em suas respectivas jurisdições geográficas ou áreas de atuação exclusiva. Casos de força maior (como greves portuárias) suspenderão as obrigações e prazos de entrega reciprocamente."
      },
      {
        id: 'c3',
        title: "Cláusula 19.2 — Jurisdição e Resolução de Disputas",
        type: 'warning',
        risk: 'Médio',
        text: "Eventuais conflitos resultantes da execução deste tratado deverão ser decididos com exclusividade pelas leis da federação siberiana, sob o foro arbitral de Vladivostok, renunciando-se a qualquer outra comarca.",
        analysis: "Foro de litígio desvantajoso. Julgar disputas na comarca e sob as leis territoriais da Siberian Steel reduz nossas chances de vitória jurídica em caso de quebra contratual devido ao protecionismo estatal local.",
        redraft: "Quaisquer disputas decorrentes deste acordo serão resolvidas por arbitragem internacional conduzida perante a Câmara de Comércio Internacional (ICC) em Genebra, Suíça, sob a lei de neutralidade suíça."
      },
      {
        id: 'c4',
        title: "Cláusula 22.1 — Direito de Retirada Unilateral",
        type: 'leverage',
        risk: 'Ponto de Barganha',
        text: "Nexus Core reserva-se o direito de rescindir a Joint Venture unilateralmente sem ônus de multa caso os relatórios semestrais de produção do nosso algoritmo apontem margem operacional inferior a 18.5% por dois trimestres consecutivos.",
        analysis: "Este é um forte ponto de alavancagem operacional da Nexus. O algoritmo monitora os números em tempo real e nos concede uma saída estratégica segura caso a Siberian Steel seja ineficiente.",
        redraft: "Excelente redação. Mantém-se inalterada para garantir a segurança operacional e resiliência financeira da Nexus Core."
      }
    ]
  },
  safra: {
    title: "ACORDO DE FORNECIMENTO SOBERANO - SAFRA PRO",
    subTitle: "Fornecimento Agrícola // Protocolo AG-09",
    score: 84,
    metrics: { riskLevel: 'Baixo', asymmetricCount: 1, leveragePoints: 3 },
    clauses: [
      {
        id: 's1',
        title: "Cláusula 3.2 — Ajuste Dinâmico de Preços",
        type: 'leverage',
        risk: 'Ponto de Barganha',
        text: "O preço fixado da semente de soja híbrida será reajustado quinzenalmente de forma automatizada via feed de dados da Bolsa de Chicago integrado ao nosso ecossistema, operando em hedge cambial permanente.",
        analysis: "Altíssima segurança operacional. Evita perdas por flutuação cambial ou desvalorização repentina de commodities agrícolas no mercado brasileiro.",
        redraft: "Mantenha a redação original. Ela confere proteção integral contra inflação e perdas de estoque."
      },
      {
        id: 's2',
        title: "Cláusula 8.4 — Penalidade de Amostragem Falsa",
        type: 'critical',
        risk: 'Crítico',
        text: "Caso a auditoria qualitativa do fornecedor aponte pureza do grão inferior a 99.2%, o comprador poderá confiscar a carga integral sem pagamento residual, retendo o lote em caráter penal definitvo.",
        analysis: "Penalidade abusiva que confisca o produto sem direito a reteste ou destinação alternativa dos lotes reprovados. Viola o princípio da proporcionalidade.",
        redraft: "Grãos com pureza inferior a 99.2% serão recusados ou negociados com desconto proporcional pré-acordado. Em nenhum caso haverá confisco sem compensação cambial mínima equivalente a 45% do valor da cotação vigente."
      }
    ]
  }
};

export function PactumContractAnalyzer() {
  const [selectedTemplate, setSelectedTemplate] = useState<'siberian' | 'safra'>('siberian');
  const [activeClauseId, setActiveClauseId] = useState<string>('c1');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const data = contractsTemplates[selectedTemplate];
  
  // Find current clause
  const activeClause = data.clauses.find(c => c.id === activeClauseId) || data.clauses[0];

  const handleCopyRedraft = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [id]: true });
    
    toast({
      title: "Cláusula Copiada!",
      description: "A redação estratégica reescrita pela IA foi copiada para sua área de transferência.",
    });

    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">Módulo Pactum Auditor</span>
          <h3 className="text-xl font-headline font-black text-white uppercase">{data.title}</h3>
          <p className="text-xs text-slate-500 font-mono tracking-wider">{data.subTitle}</p>
        </div>

        {/* Template Selector dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Documento:</span>
          <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => { setSelectedTemplate('siberian'); setActiveClauseId('c1'); }}
              className={cn(
                "px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all",
                selectedTemplate === 'siberian' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Siberian Steel JV
            </button>
            <button
              onClick={() => { setSelectedTemplate('safra'); setActiveClauseId('s1'); }}
              className={cn(
                "px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all",
                selectedTemplate === 'safra' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Fornecimento Safra
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW SCOREBAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Risk Score Widget */}
        <Card className="bg-zinc-950/60 border-2 border-blue-500/20 backdrop-blur-md shadow-xl flex items-center justify-center p-6 rounded-3xl">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Índice de Governança de Risco</p>
            <div className="relative inline-flex items-center justify-center">
              <span className={cn(
                "text-5xl font-black font-mono tracking-tighter",
                data.score < 70 ? "text-red-400" : "text-emerald-400"
              )}>
                {data.score}
              </span>
              <span className="text-xs text-slate-500 font-bold ml-1">/100</span>
            </div>
            <Badge className={cn(
              "font-black text-[9px] uppercase tracking-widest border-none px-3 py-1 block mx-auto",
              data.score < 70 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            )}>
              {data.score < 70 ? "Vulnerabilidades Altas" : "Alinhado & Protegido"}
            </Badge>
          </div>
        </Card>

        {/* Counter Widgets */}
        {[
          { title: "Nível de Risco Geral", value: data.metrics.riskLevel, desc: "Avaliado pelo nosso algoritmo", icon: AlertTriangle, color: data.metrics.riskLevel === 'Alto' ? "text-red-400" : "text-emerald-400" },
          { title: "Cláusulas Assecutórias", value: data.metrics.asymmetricCount, desc: "Cláusulas com alta assimetria", icon: ShieldAlert, color: "text-amber-400" },
          { title: "Pontos de Alavancagem", value: data.metrics.leveragePoints, desc: "Margens de manobra a nosso favor", icon: Scale, color: "text-blue-400" }
        ].map((met, idx) => (
          <Card key={idx} className="bg-zinc-950/60 border border-white/5 backdrop-blur-md shadow-xl p-6 rounded-3xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{met.title}</span>
              <met.icon className={cn("h-5 w-5", met.color)} />
            </div>
            <div className="mt-4">
              <h4 className={cn("text-3xl font-black font-mono tracking-tight", met.color)}>{met.value}</h4>
              <p className="text-[10px] text-gray-500 uppercase font-medium mt-1">{met.desc}</p>
            </div>
          </Card>
        ))}

      </div>

      {/* SPLIT PANEL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Side: Interactive Contract Viewer */}
        <Card className="bg-zinc-950/70 border-2 border-blue-500/20 backdrop-blur-xl rounded-3xl flex flex-col overflow-hidden">
          <CardHeader className="p-6 border-b border-white/5 bg-blue-500/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-headline text-white flex items-center gap-2 uppercase tracking-widest">
                <FileText className="h-4 w-4 text-blue-400" /> Corpo do Documento Contratual
              </CardTitle>
            </div>
            <Badge className="bg-slate-900 border border-white/10 font-bold text-[9px] uppercase tracking-widest px-2 py-0.5">Minuta Oficial</Badge>
          </CardHeader>
          
          <CardContent className="p-8 flex-1 overflow-y-auto space-y-6 max-h-[500px] leading-relaxed text-sm font-sans">
            <div className="space-y-4 text-slate-400 border-l border-white/10 pl-4 py-2">
              <p className="font-bold text-white text-xs font-mono uppercase tracking-[0.1em]">PREÂMBULO DO TRATADO:</p>
              <p className="text-xs">
                As partes acordam e celebram o presente instrumento visando regular as relações operacionais, compartilhamento de riscos de produção mineral, software e governança corporativa no âmbito das operações industriais.
              </p>
            </div>

            <Separator className="bg-white/5" />

            {/* Render contract clauses with clickable highlight zones */}
            <div className="space-y-6">
              {data.clauses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveClauseId(c.id)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col gap-2",
                    activeClauseId === c.id 
                      ? c.type === 'asymmetric' || c.type === 'critical'
                        ? "bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.08)]"
                        : c.type === 'leverage'
                        ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                        : "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.08)]"
                      : "bg-white/0 border-white/5 hover:bg-white/5"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-black font-headline uppercase tracking-wide text-white group-hover:text-blue-400 transition-colors">
                      {c.title}
                    </span>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase border-none tracking-widest px-2.5 py-0.5",
                      c.type === 'asymmetric' || c.type === 'critical' ? "bg-red-600 text-white" :
                      c.type === 'leverage' ? "bg-emerald-600 text-white" :
                      "bg-amber-600 text-white"
                    )}>
                      {c.risk}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans italic pl-2 border-l border-white/10 group-hover:text-slate-200 transition-colors">
                    "{c.text}"
                  </p>
                </button>
              ))}
            </div>

            <Separator className="bg-white/5" />
            <p className="text-[10px] text-slate-500 font-mono text-center uppercase tracking-widest mt-4">
              [Fim do Documento Principal // Faturas e Anexos Suplementares]
            </p>
          </CardContent>
        </Card>

        {/* Right Side: Dante Risk Diagnostics */}
        <Card className="bg-zinc-950/70 border-2 border-violet-500/20 backdrop-blur-xl rounded-3xl flex flex-col overflow-hidden">
          <CardHeader className="p-6 border-b border-white/5 bg-violet-500/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-headline text-violet-400 flex items-center gap-2 uppercase tracking-widest">
              <Sparkles className="h-4 w-4 text-violet-400 animate-spin" /> Diagnóstico do Algoritmo
            </CardTitle>
            <Badge className="bg-violet-950 border border-violet-500/30 text-violet-400 font-black text-[9px] uppercase tracking-widest">Análise Ativa</Badge>
          </CardHeader>
          
          <CardContent className="p-8 flex-1 flex flex-col justify-between gap-6 overflow-y-auto max-h-[500px]">
            {/* Clause Analysis */}
            <div className="space-y-6">
              <div className="space-y-1">
                <Badge className={cn(
                  "text-[8px] font-black uppercase border-none tracking-widest px-2 py-0.5 mb-2",
                  activeClause.type === 'asymmetric' || activeClause.type === 'critical' ? "bg-red-500/15 text-red-400 border border-red-500/25" :
                  activeClause.type === 'leverage' ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" :
                  "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                )}>
                  {activeClause.title}
                </Badge>
                <h4 className="text-lg font-headline font-black text-white uppercase">{activeClause.title.split('—')[1] || activeClause.title}</h4>
              </div>

              {/* Analysis Text */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest block">Parecer Técnico:</span>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{activeClause.analysis}"
                </p>
              </div>

              {/* Opção de Re-redação Estratégica */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-headline">
                    <Sparkles className="h-3 w-3" /> Re-redação Estratégica Sugerida:
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[8px]">Oferta Balanceada</Badge>
                </div>
                <div className="relative p-5 rounded-2xl bg-slate-950 border border-emerald-500/20 font-mono text-xs text-emerald-400 leading-relaxed shadow-inner group">
                  <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyRedraft(activeClause.redraft, activeClause.id)}
                      className="p-2 bg-slate-900 border border-white/10 rounded-xl hover:border-emerald-500 hover:text-white transition-all text-slate-400"
                    >
                      {copiedStates[activeClause.id] ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <p className="pr-8">
                    {activeClause.redraft}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/5 mt-auto">
              <Button 
                onClick={() => handleCopyRedraft(activeClause.redraft, activeClause.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest h-12 rounded-xl"
              >
                {copiedStates[activeClause.id] ? "Copiado!" : "Copiar Redação Sugerida"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  toast({
                    title: "Restauração de Contrato",
                    description: "Os termos originais do documento foram restaurados para comparação.",
                  });
                }}
                className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12 px-6"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
