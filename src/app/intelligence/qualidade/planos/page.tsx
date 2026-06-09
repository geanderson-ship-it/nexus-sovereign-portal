'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, SearchCheck, CheckCircle2, AlertTriangle, XCircle, FileSearch, Save, Search, Target, Factory, ShieldCheck, Activity, Scale, ClipboardList, PackageCheck, AlertOctagon, User, CalendarClock } from 'lucide-react';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Gravidade = 'nenhuma' | 'leve' | 'moderada' | 'critica';

type RNC = {
  id: string;
  lote: string;
  produto: string;
  quantidadeTotal: number;
  quantidadeDefeito: number;
  auditor: string;
  setor: string;
  gravidade: Gravidade;
  statusAprovacao: 'liberado' | 'espera' | 'bloqueado';
  planoAcao?: {
    oQue: string;
    quem: string;
    ateQuando: string;
    status: 'pendente' | 'resolvido';
  };
  data: string;
};

// MOCK DE PRODUTOS PARA EXPEDIÇÃO
const MOCK_PRODUTOS: Record<string, string> = {
  'lote-100': 'Carenagem Frontal de Alumínio (Módulo A)',
  'lote-200': 'Conjunto Soldado Base Estrutural',
  'lote-300': 'Painel Elétrico de Controle Principal',
};

export default function RncPlanosAcaoPage() {
  const [rncs, setRncs] = useState<RNC[]>([
    {
      id: 'RNC-2026001',
      lote: 'LOTE-300',
      produto: 'Painel Elétrico de Controle Principal',
      quantidadeTotal: 50,
      quantidadeDefeito: 2,
      auditor: 'Mariana (CQ)',
      setor: 'Expedição Elétrica',
      gravidade: 'critica',
      statusAprovacao: 'liberado',
      planoAcao: {
        oQue: 'Refazer isolamento térmico dos cabos principais (Risco de Curto)',
        quem: 'João (Eng. Elétrica)',
        ateQuando: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Amanhã
        status: 'resolvido'
      },
      data: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'RNC-2026002',
      lote: 'LOTE-100',
      produto: 'Carenagem Frontal de Alumínio',
      quantidadeTotal: 200,
      quantidadeDefeito: 5,
      auditor: 'Carlos (CQ)',
      setor: 'Acabamento Final',
      gravidade: 'leve',
      statusAprovacao: 'liberado',
      planoAcao: {
        oQue: 'Polimento adicional nas bordas (Arranhões Leves)',
        quem: 'Equipe de Acabamento',
        ateQuando: new Date().toISOString().split('T')[0],
        status: 'resolvido'
      },
      data: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]);

  const [buscaLote, setBuscaLote] = useState('');
  const [produtoAtivo, setProdutoAtivo] = useState('');
  const [auditorExpedicao, setAuditorExpedicao] = useState('');
  const [setorExpedicao, setSetorExpedicao] = useState('Expedição');
  const [dataAuditoria, setDataAuditoria] = useState(new Date().toISOString().split('T')[0]);
  
  const [novaAuditoria, setNovaAuditoria] = useState({
    quantidadeTotal: '',
    quantidadeDefeito: '',
    gravidade: 'nenhuma' as Gravidade,
  });

  const [novoPlanoAcao, setNovoPlanoAcao] = useState({
    oQue: '',
    quem: '',
    ateQuando: ''
  });

  const buscarLote = () => {
    const term = buscaLote.toLowerCase().trim();
    if (term && MOCK_PRODUTOS[term]) {
      setProdutoAtivo(MOCK_PRODUTOS[term]);
    } else {
      setProdutoAtivo('Produto Não Cadastrado (Auditoria Avulsa)');
    }
  };

  const calcularStatusLote = (): 'liberado' | 'espera' | 'bloqueado' => {
    const defeitos = parseInt(novaAuditoria.quantidadeDefeito) || 0;
    if (defeitos === 0) return 'liberado';
    if (novaAuditoria.gravidade === 'leve') return 'liberado';
    if (novaAuditoria.gravidade === 'moderada') return 'espera';
    return 'bloqueado';
  };

  const statusLote = calcularStatusLote();
  const precisaPlanoAcao = parseInt(novaAuditoria.quantidadeDefeito) > 0 && (novaAuditoria.gravidade === 'moderada' || novaAuditoria.gravidade === 'critica');

  const salvarAuditoria = () => {
    if (!buscaLote || !novaAuditoria.quantidadeTotal) return;

    if (precisaPlanoAcao && (!novoPlanoAcao.oQue || !novoPlanoAcao.quem || !novoPlanoAcao.ateQuando)) {
      alert("Para falhas Moderadas ou Críticas, o preenchimento do Plano de Ação é OBRIGATÓRIO para travar a RNC.");
      return;
    }

    const rnc: RNC = {
      id: `RNC-${Math.floor(1000000 + Math.random() * 9000000)}`,
      lote: buscaLote.toUpperCase(),
      produto: produtoAtivo,
      quantidadeTotal: parseInt(novaAuditoria.quantidadeTotal) || 0,
      quantidadeDefeito: parseInt(novaAuditoria.quantidadeDefeito) || 0,
      auditor: auditorExpedicao || 'Não Informado',
      setor: setorExpedicao || 'Expedição',
      gravidade: novaAuditoria.gravidade,
      statusAprovacao: statusLote,
      data: new Date(dataAuditoria).toISOString(),
      ...(precisaPlanoAcao || parseInt(novaAuditoria.quantidadeDefeito) > 0 ? {
        planoAcao: {
          oQue: novoPlanoAcao.oQue,
          quem: novoPlanoAcao.quem,
          ateQuando: novoPlanoAcao.ateQuando,
          status: 'pendente'
        }
      } : {})
    };

    setRncs([rnc, ...rncs]);
    
    // Reset
    setBuscaLote('');
    setProdutoAtivo('');
    setAuditorExpedicao('');
    setSetorExpedicao('Expedição');
    setNovaAuditoria({ quantidadeTotal: '', quantidadeDefeito: '', gravidade: 'nenhuma' });
    setNovoPlanoAcao({ oQue: '', quem: '', ateQuando: '' });
  };

  const resolverPlano = (id: string) => {
    setRncs(rncs.map(rnc => {
      if (rnc.id === id && rnc.planoAcao) {
        // Se estava bloqueado, pode ir para liberado
        return { 
          ...rnc, 
          statusAprovacao: 'liberado',
          planoAcao: { ...rnc.planoAcao, status: 'resolvido' } 
        };
      }
      return rnc;
    }));
  };

  return (
    <SovereignShowcase moduleName="Nexus Qualidade - Expedição & RNC" imagePath="/Nexus Intelligence Qualidade/Nexus Qualidade.png">
      <div className="min-h-screen bg-black text-white p-6 space-y-8 font-sans selection:bg-amber-500/30">
        
        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-amber-500/20 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/intelligence/qualidade">
              <div className="p-2 rounded-full hover:bg-amber-500/10 transition-colors">
                <ArrowLeft className="h-5 w-5 text-amber-400" />
              </div>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black uppercase tracking-tight text-amber-400 font-headline italic flex items-center">
                  <ClipboardList className="mr-3 h-6 w-6" /> RNC e Planos de Ação
                </h1>
                <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Pilar 3</Badge>
              </div>
              <p className="text-xs text-amber-300/60 font-medium uppercase tracking-widest italic tracking-[0.2em]">
                Inspeção de Expedição Final (100% Amostragem)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* PAINEL DE INSPEÇÃO E GRAVIDADE (ESQUERDA) */}
          <div className="xl:col-span-5 space-y-6">
            <Card className="bg-zinc-950/80 border-amber-500/20 rounded-[32px] overflow-hidden">
              <CardContent className="p-6 space-y-6">
                
                <div className="space-y-2 border-b border-amber-500/10 pb-4">
                  <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <PackageCheck className="h-4 w-4 text-amber-400" /> Auditoria de Lote (100%)
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Controle Absoluto de Expedição</p>
                </div>

                <div className="space-y-6">
                  {/* LINHA 1: Lote e Setor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-amber-400">Lote de Expedição / OS</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Ex: LOTE-100" 
                          value={buscaLote}
                          onChange={(e) => setBuscaLote(e.target.value)}
                          onBlur={buscarLote}
                          className="bg-black/50 border-amber-500/30 text-white placeholder:text-slate-700 font-mono text-sm focus-visible:ring-amber-500/50"
                        />
                        <Button onClick={buscarLote} className="bg-amber-600 hover:bg-amber-500 text-black font-black px-3">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      {produtoAtivo && (
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                          Produto: <span className="text-amber-400 ml-1">{produtoAtivo}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Setor</Label>
                      <Input 
                        placeholder="Ex: Expedição" 
                        value={setorExpedicao}
                        onChange={(e) => setSetorExpedicao(e.target.value)}
                        className="bg-black/50 border-white/10 text-white text-sm focus-visible:ring-amber-500/50"
                      />
                    </div>
                  </div>

                  {/* LINHA 2: Peças (Original) */}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Peças Montadas (Total)</Label>
                      <Input 
                        type="number"
                        placeholder="Ex: 50" 
                        value={novaAuditoria.quantidadeTotal}
                        onChange={(e) => setNovaAuditoria({ ...novaAuditoria, quantidadeTotal: e.target.value })}
                        className="bg-black/50 border-white/10 text-white text-lg font-bold h-12 focus-visible:ring-amber-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Peças com Defeito</Label>
                      <Input 
                        type="number"
                        placeholder="Ex: 0" 
                        value={novaAuditoria.quantidadeDefeito}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNovaAuditoria({ ...novaAuditoria, quantidadeDefeito: val, gravidade: parseInt(val) > 0 ? 'leve' : 'nenhuma' });
                        }}
                        className={`bg-black/50 text-white text-lg font-bold h-12 ${parseInt(novaAuditoria.quantidadeDefeito) > 0 ? 'border-rose-500/50 focus-visible:ring-rose-500/50' : 'border-white/10 focus-visible:ring-amber-500/50'}`}
                      />
                    </div>
                  </div>

                  {/* LINHA 3: Auditor e Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Auditor Responsável</Label>
                      <Input 
                        placeholder="Ex: Mariana (CQ)" 
                        value={auditorExpedicao}
                        onChange={(e) => setAuditorExpedicao(e.target.value)}
                        className="bg-black/50 border-amber-500/30 text-white text-sm focus-visible:ring-amber-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Data</Label>
                      <Input 
                        type="date"
                        value={dataAuditoria}
                        onChange={(e) => setDataAuditoria(e.target.value)}
                        className="bg-black/50 border-white/10 text-white text-sm focus-visible:ring-amber-500/50 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* MATRIZ DE GRAVIDADE AUTOMÁTICA */}
                  {parseInt(novaAuditoria.quantidadeDefeito) > 0 && (
                    <div className="space-y-3 pt-4 border-t border-amber-500/10 animate-in fade-in slide-in-from-top-4">
                      <Label className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <AlertOctagon className="h-4 w-4 text-rose-500" /> Matriz de Gravidade do Defeito
                      </Label>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <button 
                          onClick={() => setNovaAuditoria({ ...novaAuditoria, gravidade: 'leve' })}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${novaAuditoria.gravidade === 'leve' ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                        >
                          <div className="text-left">
                            <span className={`text-sm font-black uppercase tracking-widest ${novaAuditoria.gravidade === 'leve' ? 'text-yellow-400' : 'text-slate-400'}`}>🟡 Grau Leve</span>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Falha estética mínima. Não bloqueia lote.</p>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => setNovaAuditoria({ ...novaAuditoria, gravidade: 'moderada' })}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${novaAuditoria.gravidade === 'moderada' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                        >
                          <div className="text-left">
                            <span className={`text-sm font-black uppercase tracking-widest ${novaAuditoria.gravidade === 'moderada' ? 'text-amber-400' : 'text-slate-400'}`}>🟠 Grau Moderado</span>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Exige retrabalho. Lote em quarentena de espera.</p>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => setNovaAuditoria({ ...novaAuditoria, gravidade: 'critica' })}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${novaAuditoria.gravidade === 'critica' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                        >
                          <div className="text-left">
                            <span className={`text-sm font-black uppercase tracking-widest ${novaAuditoria.gravidade === 'critica' ? 'text-rose-400' : 'text-slate-400'}`}>🔴 Grau Crítico</span>
                            <p className="text-[10px] text-rose-500 mt-1 font-bold uppercase tracking-widest">Falha funcional/segurança. Hard Stop na Expedição.</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PLANO DE AÇÃO EXPRESSO (Obrigatório para Moderado/Crítico) */}
                  {precisaPlanoAcao && (
                    <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 mt-6 relative overflow-hidden animate-in fade-in zoom-in-95">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl" />
                      
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2 border-b border-rose-500/20 pb-2">
                          <AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse" />
                          <h4 className="text-rose-500 font-black uppercase tracking-widest text-sm">Plano de Ação Obrigatório (3W)</h4>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1">
                              <Target className="h-3 w-3" /> O que fazer? (Ação)
                            </Label>
                            <Input 
                              placeholder="Descreva a ação corretiva imediata" 
                              value={novoPlanoAcao.oQue}
                              onChange={(e) => setNovoPlanoAcao({ ...novoPlanoAcao, oQue: e.target.value })}
                              className="bg-black/60 border-rose-500/20 text-white text-sm focus-visible:ring-rose-500/50"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1">
                                <User className="h-3 w-3" /> Quem vai fazer?
                              </Label>
                              <Input 
                                placeholder="Responsável" 
                                value={novoPlanoAcao.quem}
                                onChange={(e) => setNovoPlanoAcao({ ...novoPlanoAcao, quem: e.target.value })}
                                className="bg-black/60 border-rose-500/20 text-white text-sm focus-visible:ring-rose-500/50"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1">
                                <CalendarClock className="h-3 w-3" /> Até quando?
                              </Label>
                              <Input 
                                type="date"
                                value={novoPlanoAcao.ateQuando}
                                onChange={(e) => setNovoPlanoAcao({ ...novoPlanoAcao, ateQuando: e.target.value })}
                                className="bg-black/60 border-rose-500/20 text-slate-300 text-sm focus-visible:ring-rose-500/50 [color-scheme:dark]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INDICADOR DE STATUS FINAL */}
                  {produtoAtivo && novaAuditoria.quantidadeTotal && (
                    <div className={`p-4 rounded-xl border flex items-center justify-between mt-4 ${
                      statusLote === 'liberado' ? 'bg-emerald-500/10 border-emerald-500/30' :
                      statusLote === 'espera' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-rose-500/10 border-rose-500/30'
                    }`}>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Decisão de Expedição</p>
                        <p className={`text-lg font-black uppercase tracking-tight ${
                          statusLote === 'liberado' ? 'text-emerald-400' :
                          statusLote === 'espera' ? 'text-amber-400' :
                          'text-rose-400'
                        }`}>
                          {statusLote === 'liberado' && 'LOTE LIBERADO (GO)'}
                          {statusLote === 'espera' && 'QUARENTENA TEMPORÁRIA'}
                          {statusLote === 'bloqueado' && 'BLOQUEIO DE FÁBRICA (NO-GO)'}
                        </p>
                      </div>
                      <Button 
                        onClick={salvarAuditoria}
                        className={`font-black uppercase tracking-widest ${
                          statusLote === 'liberado' ? 'bg-emerald-600 hover:bg-emerald-500 text-black' :
                          statusLote === 'espera' ? 'bg-amber-600 hover:bg-amber-500 text-black' :
                          'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        Registrar <Save className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          </div>

          {/* KANBAN DE RNC (DIREITA) */}
          <div className="xl:col-span-7 space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white italic flex items-center gap-2 mb-4">
              Gestão de Não Conformidades (RNC)
            </h2>

            {rncs.length === 0 ? (
               <div className="p-10 border border-dashed border-amber-500/20 rounded-3xl text-center flex flex-col items-center justify-center h-64">
                 <CheckCircle2 className="h-12 w-12 text-emerald-500/30 mb-4" />
                 <p className="text-slate-400 font-medium text-sm">Nenhuma RNC aberta no momento. Expedição fluindo a 100%.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {rncs.map((rnc) => (
                  <Card key={rnc.id} className="bg-zinc-950/50 border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/20 transition-all relative">
                    
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                      rnc.gravidade === 'leve' ? 'bg-yellow-500' :
                      rnc.gravidade === 'moderada' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />

                    <CardContent className="p-5 pl-7">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        
                        {/* IDENTIFICAÇÃO */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-black text-white border-white/10 font-mono text-[10px]">{rnc.id}</Badge>
                            {rnc.statusAprovacao === 'liberado' && <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Expedição Liberada</Badge>}
                            {rnc.statusAprovacao === 'espera' && <Badge className="bg-amber-500/10 text-amber-400 border-none animate-pulse">Lote Retido</Badge>}
                            {rnc.statusAprovacao === 'bloqueado' && <Badge className="bg-rose-500/10 text-rose-400 border-none animate-pulse">Bloqueio Crítico</Badge>}
                          </div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{rnc.lote}</p>
                          <p className="text-sm font-black text-white">{rnc.produto}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                            Aprovadas: <span className="text-emerald-400">{rnc.quantidadeTotal - rnc.quantidadeDefeito}</span> | 
                            Defeitos: <span className="text-rose-400 font-bold ml-1">{rnc.quantidadeDefeito}</span>
                          </p>
                          <p className="text-[9px] text-amber-400/80 uppercase tracking-widest pt-2">
                            Auditor: <span className="font-bold text-white">{rnc.auditor}</span> • {rnc.setor} • {new Date(rnc.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        {/* PLANO DE AÇÃO */}
                        {rnc.planoAcao && (
                          <div className={`p-3 rounded-xl border md:w-1/2 shrink-0 ${
                            rnc.planoAcao.status === 'resolvido' ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-black/60 border-white/10'
                          }`}>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                              <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1">
                                <Target className="h-3 w-3" /> Plano de Ação (3W)
                              </p>
                              <Badge className={`text-[9px] ${rnc.planoAcao.status === 'resolvido' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {rnc.planoAcao.status === 'resolvido' ? 'Concluído' : 'Ação Pendente'}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1.5">
                              <p className="text-xs text-white leading-tight"><span className="text-slate-500 text-[10px] mr-1">O QUE:</span> {rnc.planoAcao.oQue}</p>
                              <div className="flex items-center justify-between pt-1">
                                <p className="text-[10px] text-slate-400"><span className="text-slate-500 mr-1">QUEM:</span> {rnc.planoAcao.quem}</p>
                                <p className="text-[10px] text-slate-400"><span className="text-slate-500 mr-1">PRAZO:</span> {rnc.planoAcao.ateQuando ? new Date(rnc.planoAcao.ateQuando).toLocaleDateString('pt-BR') : 'Imediato'}</p>
                              </div>
                            </div>
                            
                            {rnc.planoAcao.status === 'pendente' && (
                              <Button 
                                size="sm" 
                                onClick={() => resolverPlano(rnc.id)}
                                className="w-full mt-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-[10px] h-7 uppercase tracking-widest font-black"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Marcar como Resolvido
                              </Button>
                            )}
                          </div>
                        )}

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <LegalSafeguard module="DANTE CQ RNC" protocol="NX-CQ-04" />
    </SovereignShowcase>
  );
}
