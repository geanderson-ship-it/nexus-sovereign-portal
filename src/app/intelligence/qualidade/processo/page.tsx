'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, SearchCheck, CheckCircle2, AlertTriangle, XCircle, FileSearch, Save, Search, Target, Factory, ShieldCheck, Activity, Scale, Info, CheckSquare, Square } from 'lucide-react';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// MOCK DATA PARA PROGRAMAÇÃO DE PRODUÇÃO (PPCP)
type ItemOP = {
  nome: string;
  qtdProgramada: number;
  risco: number; // 0 a 100
  motivoRisco?: string;
};

const MOCK_OP_DATA: Record<string, ItemOP[]> = {
  'op-2026': [
    { nome: 'Conjunto Soldado Base', qtdProgramada: 120, risco: 92, motivoRisco: 'Histórico de Trinca na Solda' },
    { nome: 'Eixo Rotativo Principal', qtdProgramada: 50, risco: 85, motivoRisco: 'Desvio de Tolerância' },
    { nome: 'Suporte de Fixação Lateral', qtdProgramada: 500, risco: 60, motivoRisco: 'Falha de Rebarbação' },
    { nome: 'Chapa de Cobertura Superior', qtdProgramada: 120, risco: 25 },
    { nome: 'Flange de Acoplamento', qtdProgramada: 200, risco: 15 },
    { nome: 'Pinos de Alinhamento', qtdProgramada: 1000, risco: 5 },
  ],
  'op-3000': [
    { nome: 'Carenagem Frontal de Alumínio', qtdProgramada: 30, risco: 80, motivoRisco: 'Risco de Risco na Pintura' },
    { nome: 'Painel Elétrico de Controle', qtdProgramada: 30, risco: 95, motivoRisco: 'Curto Circuito no Teste' },
    { nome: 'Rodízios de Poliuretano', qtdProgramada: 120, risco: 10 },
  ]
};

// MODELO DE INSPEÇÃO
type InspecaoProcesso = {
  id: string;
  op: string;
  linha: string;
  auditor: string;
  itensAvaliados: number;
  amostrasTotais: number;
  status: 'aprovado' | 'alerta' | 'reprovado';
  data: string;
  conformidade: {
    qualidade: boolean;
    processo: boolean;
    normas: boolean;
  };
  observacoes?: {
    qualidade: string;
    processo: string;
    normas: string;
  };
};

export default function InspecaoEmProcessoPage() {
  const [inspecoes, setInspecoes] = useState<InspecaoProcesso[]>([
    {
      id: 'insp-001',
      op: 'OP-1550',
      linha: 'Solda e Montagem',
      auditor: 'Carlos (CQ)',
      itensAvaliados: 2,
      amostrasTotais: 15,
      status: 'alerta',
      data: new Date(Date.now() - 3600000).toISOString(),
      conformidade: { qualidade: true, processo: false, normas: true },
      observacoes: {
        qualidade: "Bom (Foram analisadas 15 peças, uma apresentou risco superficial).",
        processo: "Alerta Crítico: De 15 peças avaliadas, 7 estavam com dobras amassadas fora do esquadro.",
        normas: "15 analisadas - sem problemas encontrados quanto ao uso de EPIs e organização."
      }
    }
  ]);

  const [buscaOP, setBuscaOP] = useState('');
  const [opAtiva, setOpAtiva] = useState<string>('');
  const [itensProgramados, setItensProgramados] = useState<ItemOP[] | null>(null);
  
  // Tríade de Avaliação
  const [avaliacaoTriade, setAvaliacaoTriade] = useState({
    qualidade: true,
    processo: true,
    normas: true
  });
  
  const [obsTriade, setObsTriade] = useState({
    qualidade: '',
    processo: '',
    normas: ''
  });

  const [linhaProcesso, setLinhaProcesso] = useState('Montagem Final');
  const [auditorProcesso, setAuditorProcesso] = useState('');
  const [dataAuditoria, setDataAuditoria] = useState(new Date().toISOString().split('T')[0]);
  const [analiseSelecionada, setAnaliseSelecionada] = useState<InspecaoProcesso | null>(null);

  const buscarProgramacao = () => {
    const term = buscaOP.toLowerCase().trim();
    if (term && MOCK_OP_DATA[term]) {
      setItensProgramados(MOCK_OP_DATA[term]);
      setOpAtiva(term.toUpperCase());
    } else {
      // Cria um genérico
      setItensProgramados([
        { nome: 'Peça Genérica Usinada', qtdProgramada: 300, risco: 55, motivoRisco: 'Acabamento Inconsistente' },
        { nome: 'Montagem Genérica', qtdProgramada: 50, risco: 30 },
        { nome: 'Estrutura Base', qtdProgramada: 100, risco: 15 }
      ]);
      setOpAtiva(term.toUpperCase() || 'OP-AVULSA');
    }
  };

  // INTELIGÊNCIA ATENA (AMOSTRAGEM VARIÁVEL)
  const itensOrdenadosPorRisco = itensProgramados ? [...itensProgramados].sort((a, b) => b.risco - a.risco) : [];
  const quantidadeTiposParaInspecionar = itensProgramados ? Math.ceil(itensProgramados.length / 2) : 0;
  const itensCriticos = itensOrdenadosPorRisco.slice(0, quantidadeTiposParaInspecionar);

  // Calcula o total de amostras requeridas
  const totalAmostrasExigidas = itensCriticos.reduce((total, item) => {
    // Regra Padrão: 5% da quantidade programada
    let qtdAmostra = Math.ceil(item.qtdProgramada * 0.05);
    if (qtdAmostra < 5 && item.qtdProgramada >= 5) qtdAmostra = 5;
    if (item.qtdProgramada < 5) qtdAmostra = item.qtdProgramada;
    return total + qtdAmostra;
  }, 0);

  const salvarAuditoria = () => {
    if (!opAtiva) return;

    // Determina o status com base na tríade
    let statusFinal: 'aprovado' | 'alerta' | 'reprovado' = 'aprovado';
    const { qualidade, processo, normas } = avaliacaoTriade;

    if (!qualidade && !processo && !normas) {
      statusFinal = 'reprovado'; // Tudo falhou (Quarentena/Parada de Linha)
    } else if (!qualidade || !processo || !normas) {
      statusFinal = 'alerta'; // Pelo menos um falhou (Revisão Necessária)
    }

    const inspecao: InspecaoProcesso = {
      id: `insp-${Date.now()}`,
      op: opAtiva,
      linha: linhaProcesso,
      auditor: auditorProcesso || 'Não Informado',
      itensAvaliados: quantidadeTiposParaInspecionar,
      amostrasTotais: totalAmostrasExigidas,
      status: statusFinal,
      data: new Date(dataAuditoria).toISOString(),
      conformidade: { ...avaliacaoTriade },
      observacoes: { ...obsTriade }
    };

    setInspecoes([inspecap, ...inspecoes]); // Fixed typo by using correct variable
    
    // Resetar
    setBuscaOP('');
    setOpAtiva('');
    setItensProgramados(null);
    setAvaliacaoTriade({ qualidade: true, processo: true, normas: true });
    setObsTriade({ qualidade: '', processo: '', normas: '' });
    setAuditorProcesso('');
  };

  return (
    <SovereignShowcase moduleName="Nexus Qualidade - Processo" imagePath="/Nexus Intelligence Qualidade/Nexus Qualidade.png">
      <div className="min-h-screen bg-black text-white p-6 space-y-8 font-sans selection:bg-indigo-500/30">
        
        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-indigo-500/20 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/intelligence/qualidade">
              <div className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors">
                <ArrowLeft className="h-5 w-5 text-indigo-400" />
              </div>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black uppercase tracking-tight text-indigo-400 font-headline italic flex items-center">
                  <Factory className="mr-3 h-6 w-6" /> Inspeção em Processo
                </h1>
                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Pilar 2</Badge>
              </div>
              <p className="text-xs text-indigo-300/60 font-medium uppercase tracking-widest italic tracking-[0.2em]">
                Auditoria de Chão de Fábrica Inteligente
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* PAINEL DO INSPETOR (ESQUERDA) */}
          <div className="xl:col-span-6 space-y-6">
            <Card className="bg-zinc-950/80 border-indigo-500/20 rounded-[32px] overflow-hidden">
              <CardContent className="p-6 space-y-6">
                
                <div className="space-y-2 border-b border-indigo-500/10 pb-4">
                  <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <SearchCheck className="h-4 w-4 text-indigo-400" /> Cockpit do Auditor
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Carregue a Programação (OP)</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-indigo-400">Ordem de Produção</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Ex: OP-2026" 
                          value={buscaOP}
                          onChange={(e) => setBuscaOP(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && buscarProgramacao()}
                          className="bg-black/50 border-indigo-500/30 text-white placeholder:text-slate-700 font-mono text-sm focus-visible:ring-indigo-500/50"
                        />
                        <Button onClick={buscarProgramacao} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Linha / Setor</Label>
                      <Input 
                        value={linhaProcesso}
                        onChange={(e) => setLinhaProcesso(e.target.value)}
                        className="bg-black/50 border-white/10 text-white text-sm focus-visible:ring-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Data</Label>
                      <Input 
                        type="date"
                        value={dataAuditoria}
                        onChange={(e) => setDataAuditoria(e.target.value)}
                        className="bg-black/50 border-white/10 text-white text-sm focus-visible:ring-indigo-500/50 [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label className="text-xs font-bold uppercase tracking-widest text-indigo-400">Auditor Responsável</Label>
                      <Input 
                        placeholder="Ex: Carlos (CQ)"
                        value={auditorProcesso}
                        onChange={(e) => setAuditorProcesso(e.target.value)}
                        className="bg-black/50 border-indigo-500/30 text-white text-sm focus-visible:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  {/* RESULTADO DA INTELIGÊNCIA */}
                  {itensProgramados && (
                    <div className="bg-indigo-950/10 border border-indigo-500/30 rounded-2xl p-5 mt-6 relative overflow-hidden group">
                      {/* Efeito visual cyberpunk */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
                      
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                          <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-indigo-400 animate-pulse" />
                            <h4 className="text-indigo-400 font-black uppercase tracking-widest text-sm">Diretriz de Auditoria Atena</h4>
                          </div>
                          <Badge className="bg-black/40 text-indigo-300 border border-indigo-500/20 font-mono">
                            {opAtiva}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            Selecionados {quantidadeTiposParaInspecionar} Itens de Maior Risco de {itensProgramados.length} programados
                          </p>
                          
                          {itensCriticos.map((item, idx) => {
                            let qtdAmostra = Math.ceil(item.qtdProgramada * 0.05);
                            if (qtdAmostra < 5 && item.qtdProgramada >= 5) qtdAmostra = 5;
                            if (item.qtdProgramada < 5) qtdAmostra = item.qtdProgramada;

                            return (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors gap-2">
                                <div>
                                  <p className="text-sm font-bold text-white">{item.nome}</p>
                                  {item.motivoRisco && <p className="text-[10px] text-rose-400 uppercase tracking-widest mt-0.5">{item.motivoRisco}</p>}
                                </div>
                                <div className="flex items-center gap-3 text-right shrink-0">
                                  <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Amostra (5%)</p>
                                    <p className="text-lg font-black text-indigo-400 leading-none">{qtdAmostra} <span className="text-[10px] text-slate-500">pçs</span></p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TRÍADE DE AVALIAÇÃO */}
                  {itensProgramados && (
                    <div className="space-y-4 pt-4 border-t border-indigo-500/10">
                      <div className="space-y-1">
                        <Label className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-indigo-400" /> Tríade de Conformidade
                        </Label>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Avalie a linha de processo inteira com base na amostragem</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* QUALIDADE */}
                        <div 
                          onClick={() => setAvaliacaoTriade(prev => ({ ...prev, qualidade: !prev.qualidade }))}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                            avaliacaoTriade.qualidade ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                          }`}
                        >
                          {avaliacaoTriade.qualidade ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest">1. Qualidade</p>
                            <p className="text-[9px] uppercase tracking-wider opacity-70 mt-1">Peça Padrão</p>
                          </div>
                        </div>

                        {/* PROCESSO */}
                        <div 
                          onClick={() => setAvaliacaoTriade(prev => ({ ...prev, processo: !prev.processo }))}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                            avaliacaoTriade.processo ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                          }`}
                        >
                          {avaliacaoTriade.processo ? <Activity className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest">2. Processo</p>
                            <p className="text-[9px] uppercase tracking-wider opacity-70 mt-1">Ficha Técnica</p>
                          </div>
                        </div>

                        {/* NORMAS */}
                        <div 
                          onClick={() => setAvaliacaoTriade(prev => ({ ...prev, normas: !prev.normas }))}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                            avaliacaoTriade.normas ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                          }`}
                        >
                          {avaliacaoTriade.normas ? <Scale className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest">3. Normas</p>
                            <p className="text-[9px] uppercase tracking-wider opacity-70 mt-1">Segurança / 5S</p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={salvarAuditoria}
                        className="w-full mt-6 bg-indigo-500 hover:bg-indigo-400 text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
                      >
                        <Save className="mr-2 h-4 w-4" /> Registrar Auditoria de Linha
                      </Button>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          </div>

          {/* HISTÓRICO DE AUDITORIAS (DIREITA) */}
          <div className="xl:col-span-6 space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white italic flex items-center gap-2 mb-4">
              Histórico de Chão de Fábrica
            </h2>

            {inspecoes.length === 0 ? (
               <div className="p-10 border border-dashed border-indigo-500/20 rounded-3xl text-center flex flex-col items-center justify-center h-64">
                 <Factory className="h-12 w-12 text-indigo-500/30 mb-4" />
                 <p className="text-slate-400 font-medium text-sm">Nenhuma auditoria registrada nesta sessão.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {inspecoes.map((insp) => (
                  <Card key={insp.id} className="bg-zinc-950/50 border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/20 transition-all relative">
                    
                    {/* Borda lateral de status */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                      insp.status === 'aprovado' ? 'bg-emerald-500' :
                      insp.status === 'alerta' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />

                    <CardContent className="p-5 pl-7">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-3 mb-3">
                        <div>
                          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-mono text-sm px-3 mb-1">
                            {insp.op}
                          </Badge>
                          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{insp.linha}</p>
                          <p className="text-[9px] text-indigo-400/80 uppercase tracking-widest pt-1">
                            Auditor: <span className="font-bold text-white">{insp.auditor}</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          {insp.status === 'aprovado' && <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Conforme</Badge>}
                          {insp.status === 'alerta' && <Badge className="bg-amber-500/10 text-amber-400 border-none">Alerta Emitido</Badge>}
                          {insp.status === 'reprovado' && <Badge className="bg-rose-500/10 text-rose-400 border-none">Risco Crítico / Parada</Badge>}
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 mb-2">{new Date(insp.data).toLocaleString('pt-BR')}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setAnaliseSelecionada(insp)}
                            className="text-[10px] h-6 px-2 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 font-bold uppercase tracking-widest border border-indigo-500/20"
                          >
                            <SearchCheck className="h-3 w-3 mr-1" /> Ver Análise
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Amostragem Executada</p>
                          <div className="flex items-center gap-4">
                            <div className="bg-black/50 p-2 rounded-lg border border-white/5">
                              <p className="text-[10px] text-slate-400 uppercase">Tipos Críticos</p>
                              <p className="text-lg font-black text-white leading-none">{insp.itensAvaliados}</p>
                            </div>
                            <div className="bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20">
                              <p className="text-[10px] text-indigo-400 uppercase">Total Peças</p>
                              <p className="text-lg font-black text-indigo-300 leading-none">{insp.amostrasTotais}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Resultado da Tríade</p>
                          <div className="flex gap-2">
                            {/* Qualidade */}
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${insp.conformidade.qualidade ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                              {insp.conformidade.qualidade ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              Qualidade
                            </div>
                            {/* Processo */}
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${insp.conformidade.processo ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                              {insp.conformidade.processo ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              Processo
                            </div>
                            {/* Normas */}
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${insp.conformidade.normas ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                              {insp.conformidade.normas ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              Normas
                            </div>
                          </div>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MODAL DE ANÁLISE DETALHADA */}
      <Dialog open={!!analiseSelecionada} onOpenChange={(open) => !open && setAnaliseSelecionada(null)}>
        <DialogContent className="bg-zinc-950 border-indigo-500/30 text-white sm:max-w-[500px] rounded-[32px]">
          <DialogHeader className="border-b border-indigo-500/10 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-indigo-400" /> Relatório de Análise
              </DialogTitle>
              {analiseSelecionada?.status === 'aprovado' && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Conforme</Badge>}
              {analiseSelecionada?.status === 'alerta' && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">Alerta</Badge>}
              {analiseSelecionada?.status === 'reprovado' && <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30">Risco Crítico</Badge>}
            </div>
            <DialogDescription className="text-xs text-slate-500 uppercase tracking-widest">
              Detalhes da auditoria executada no chão de fábrica
            </DialogDescription>
          </DialogHeader>
          
          {analiseSelecionada && (
            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-start bg-black/40 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Documento Base</p>
                  <p className="text-lg font-mono font-black text-indigo-400">{analiseSelecionada.op}</p>
                  <p className="text-sm font-bold text-white uppercase mt-1">Setor: {analiseSelecionada.linha}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Auditor / Data</p>
                  <p className="text-sm font-bold text-amber-400 uppercase">{analiseSelecionada.auditor}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(analiseSelecionada.data).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Escopo da Amostragem (Regra 5%)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/20 text-center">
                    <p className="text-2xl font-black text-white">{analiseSelecionada.itensAvaliados}</p>
                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest mt-1">Tipos Críticos</p>
                  </div>
                  <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/20 text-center">
                    <p className="text-2xl font-black text-white">{analiseSelecionada.amostrasTotais}</p>
                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest mt-1">Peças Inspecionadas</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Resultados da Tríade (Clique para Detalhes)</p>
                <div className="space-y-2">
                  <details className={`group rounded-lg border [&_summary::-webkit-details-marker]:hidden ${analiseSelecionada.conformidade.qualidade ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className={`h-4 w-4 ${analiseSelecionada.conformidade.qualidade ? 'text-emerald-500' : 'text-rose-500'}`} />
                        <span className="text-sm font-bold text-white uppercase">Qualidade Física</span>
                      </div>
                      {analiseSelecionada.conformidade.qualidade ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-rose-500" />}
                    </summary>
                    {analiseSelecionada.observacoes?.qualidade && (
                      <div className="px-3 pb-3 text-xs text-slate-400 border-t border-white/5 pt-2 mt-1 italic">
                        "{analiseSelecionada.observacoes.qualidade}"
                      </div>
                    )}
                  </details>
                  
                  <details className={`group rounded-lg border [&_summary::-webkit-details-marker]:hidden ${analiseSelecionada.conformidade.processo ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                      <div className="flex items-center gap-2">
                        <Activity className={`h-4 w-4 ${analiseSelecionada.conformidade.processo ? 'text-emerald-500' : 'text-rose-500'}`} />
                        <span className="text-sm font-bold text-white uppercase">Conformidade de Processo</span>
                      </div>
                      {analiseSelecionada.conformidade.processo ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-rose-500" />}
                    </summary>
                    {analiseSelecionada.observacoes?.processo && (
                      <div className="px-3 pb-3 text-xs text-slate-400 border-t border-white/5 pt-2 mt-1 italic">
                        "{analiseSelecionada.observacoes.processo}"
                      </div>
                    )}
                  </details>
                  
                  <details className={`group rounded-lg border [&_summary::-webkit-details-marker]:hidden ${analiseSelecionada.conformidade.normas ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                      <div className="flex items-center gap-2">
                        <Scale className={`h-4 w-4 ${analiseSelecionada.conformidade.normas ? 'text-emerald-500' : 'text-rose-500'}`} />
                        <span className="text-sm font-bold text-white uppercase">Normas de Segurança</span>
                      </div>
                      {analiseSelecionada.conformidade.normas ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-rose-500" />}
                    </summary>
                    {analiseSelecionada.observacoes?.normas && (
                      <div className="px-3 pb-3 text-xs text-slate-400 border-t border-white/5 pt-2 mt-1 italic">
                        "{analiseSelecionada.observacoes.normas}"
                      </div>
                    )}
                  </details>
                </div>
                {analiseSelecionada.status !== 'aprovado' && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-rose-400 uppercase">Ação Necessária</p>
                      <p className="text-[10px] text-slate-300 mt-1">Lote apresentou anomalias. Obrigatória a abertura de um RNC (Relatório de Não Conformidade) e plano de ação.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <LegalSafeguard module="DANTE CQ PROCESSO" protocol="NX-CQ-03" />
    </SovereignShowcase>
  );
}
