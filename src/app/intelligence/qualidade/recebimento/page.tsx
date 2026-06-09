'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, SearchCheck, CheckCircle2, AlertTriangle, XCircle, FileSearch, Save, Search, Target, ShieldAlert, Sparkles } from 'lucide-react';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotasFiscais } from '@/lib/almoxarifado/nf-store';

type ItemNF = {
  nome: string;
  risco: number; // 0 a 100
  motivoRisco?: string;
};

type InspecaoRecebimento = {
  id: string;
  nota: string;
  fornecedor: string;
  auditor: string;
  setor: string;
  amostragemPlano: string;
  status: 'aprovado' | 'ressalva' | 'reprovado';
  data: string;
};

// MOCK DE ITENS POR NOTA PARA SIMULAR A INTELIGÊNCIA DE RISCO
const MOCK_ITENS_NF: Record<string, ItemNF[]> = {
  'nf1234': [
    { nome: 'Chapa de Aço 5mm', risco: 88, motivoRisco: 'Histórico de Empenamento' },
    { nome: 'Perfil Estrutural L', risco: 75, motivoRisco: 'Falha Dimensional Frequente' },
    { nome: 'Eletrodo de Solda E7018', risco: 62, motivoRisco: 'Risco de Umidade' },
    { nome: 'Parafuso Sextavado M10', risco: 15 },
    { nome: 'Arruela Lisa M10', risco: 5 },
    { nome: 'Porca M10', risco: 8 },
  ]
};

export default function InspecaoRecebimentoPage() {
  const { notas } = useNotasFiscais();
  
  const [inspecoes, setInspecoes] = useState<InspecaoRecebimento[]>([
    {
      id: 'insp-001',
      nota: 'nf1234',
      fornecedor: 'SIDERÚRGICA NACIONAL S/A',
      auditor: 'Carlos (CQ)',
      setor: 'Recebimento',
      amostragemPlano: 'Inspecionados 3 itens de alto risco (150 peças total)',
      status: 'aprovado',
      data: new Date().toISOString()
    }
  ]);

  const [novaInspecao, setNovaInspecao] = useState({
    nota: '',
    fornecedor: '',
    auditor: '',
    setor: 'Recebimento / Almoxarifado',
    status: 'aprovado' as 'aprovado' | 'ressalva' | 'reprovado'
  });

  const [dataAuditoria, setDataAuditoria] = useState(new Date().toISOString().split('T')[0]);

  const [itensNota, setItensNota] = useState<ItemNF[] | null>(null);

  const buscarNota = (numeroNota: string) => {
    const notaEncontrada = notas.find(n => n.numero.toLowerCase() === numeroNota.toLowerCase());
    if (notaEncontrada) {
      setNovaInspecao(prev => ({ ...prev, fornecedor: notaEncontrada.fornecedor }));
      // Carrega os itens mockados ou gera alguns aleatórios se não for a nf1234
      if (MOCK_ITENS_NF[numeroNota.toLowerCase()]) {
        setItensNota(MOCK_ITENS_NF[numeroNota.toLowerCase()]);
      } else {
        setItensNota([
          { nome: 'Produto Genérico A', risco: 45 },
          { nome: 'Produto Genérico B', risco: 12 }
        ]);
      }
    } else {
      setNovaInspecao(prev => ({ ...prev, fornecedor: 'Fornecedor não encontrado (NF Avulsa)' }));
      setItensNota(null);
    }
  };

  // Lógica da Amostragem por Risco (Atena)
  const itensOrdenadosPorRisco = itensNota ? [...itensNota].sort((a, b) => b.risco - a.risco) : [];
  const quantidadeParaInspecionar = itensNota ? Math.ceil(itensNota.length / 2) : 0;
  const itensParaInspecionar = itensOrdenadosPorRisco.slice(0, quantidadeParaInspecionar);

  const salvarInspecao = () => {
    if (!novaInspecao.nota) return;
    
    const plano = quantidadeParaInspecionar > 0 
      ? `Inspecionados ${quantidadeParaInspecionar} itens críticos (${quantidadeParaInspecionar * 50} peças)`
      : 'Inspeção Genérica (Sem Plano)';

    const inspecao: InspecaoRecebimento = {
      id: `insp-${Date.now()}`,
      nota: novaInspecao.nota,
      fornecedor: novaInspecao.fornecedor || 'Não Especificado',
      auditor: novaInspecao.auditor || 'Não Informado',
      setor: novaInspecao.setor || 'Recebimento',
      amostragemPlano: plano,
      status: novaInspecao.status,
      data: new Date(dataAuditoria).toISOString()
    };

    setInspecoes([inspecao, ...inspecoes]);
    setNovaInspecao({ nota: '', fornecedor: '', auditor: '', setor: 'Recebimento / Almoxarifado', status: 'aprovado' });
    setItensNota(null);
  };

  return (
    <SovereignShowcase moduleName="Nexus Qualidade - Inspeção" imagePath="/Nexus Intelligence Qualidade/Nexus Qualidade.png">
      <div className="min-h-screen bg-black text-white p-6 space-y-8 font-sans selection:bg-cyan-500/30">
        
        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-cyan-500/10 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/intelligence/qualidade">
              <div className="p-2 rounded-full hover:bg-cyan-500/10 transition-colors">
                <ArrowLeft className="h-5 w-5 text-cyan-400" />
              </div>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black uppercase tracking-tight text-cyan-400 font-headline italic flex items-center">
                  <SearchCheck className="mr-3 h-6 w-6" /> Inspeção de Recebimento
                </h1>
                <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Pilar 1</Badge>
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest italic tracking-[0.2em]">
                Auditoria de Entrada Orientada a Risco
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* FORMULÁRIO DE AVALIAÇÃO E MATRIZ DE RISCO */}
          <div className="xl:col-span-5 space-y-6">
            <Card className="bg-zinc-950/80 border-cyan-500/20 rounded-[32px] overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2 border-b border-cyan-500/10 pb-4">
                  <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-cyan-400" /> Cockpit do Inspetor
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Inicie lendo o documento</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-cyan-500">Número da Nota (NF)</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-cyan-600" />
                      <Input 
                        placeholder="Digite nf1234 e pressione Tab" 
                        value={novaInspecao.nota}
                        onChange={(e) => setNovaInspecao({ ...novaInspecao, nota: e.target.value })}
                        onBlur={(e) => buscarNota(e.target.value)}
                        className="pl-10 bg-black/50 border-cyan-500/30 text-white placeholder:text-slate-700 h-10 font-mono text-sm focus-visible:ring-cyan-500/50"
                      />
                    </div>
                    {novaInspecao.fornecedor && (
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1 flex items-center">
                        Fornecedor Localizado: <span className="text-cyan-400 ml-1">{novaInspecao.fornecedor}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Setor</Label>
                      <Input 
                        value={novaInspecao.setor}
                        onChange={(e) => setNovaInspecao({ ...novaInspecao, setor: e.target.value })}
                        className="bg-black/50 border-white/10 text-white h-10 font-mono text-sm focus-visible:ring-cyan-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Data</Label>
                      <Input 
                        type="date"
                        value={dataAuditoria}
                        onChange={(e) => setDataAuditoria(e.target.value)}
                        className="bg-black/50 border-white/10 text-white h-10 font-mono text-sm focus-visible:ring-cyan-500/50 [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-cyan-500">Auditor Responsável</Label>
                      <Input 
                        placeholder="Ex: Carlos (CQ)" 
                        value={novaInspecao.auditor}
                        onChange={(e) => setNovaInspecao({ ...novaInspecao, auditor: e.target.value })}
                        className="bg-black/50 border-cyan-500/30 text-white placeholder:text-slate-700 h-10 font-mono text-sm focus-visible:ring-cyan-500/50"
                      />
                    </div>
                  </div>

                  {/* INTELIGÊNCIA DE AMOSTRAGEM (ATENA) */}
                  {itensNota && (
                    <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-indigo-400 font-black uppercase tracking-widest text-sm flex items-center gap-2">
                            <Sparkles className="h-4 w-4" /> Plano de Amostragem Atena
                          </h4>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                            Baseado em Matriz de Risco Histórico
                          </p>
                        </div>
                        <Badge className="bg-indigo-500/20 text-indigo-300 border-none font-mono text-xs">
                          {itensNota.length} SKUs Recebidos
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Tipos (50%)</p>
                          <p className="text-2xl font-black text-white">{quantidadeParaInspecionar}</p>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Total Peças (50x)</p>
                          <p className="text-2xl font-black text-indigo-400">{quantidadeParaInspecionar * 50}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-white/5 pb-1">
                          Alvos Críticos Selecionados (Prioridade Máxima)
                        </p>
                        {itensParaInspecionar.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-black/60 p-2.5 rounded-lg border border-red-500/20">
                            <div className="flex items-center gap-3">
                              <Target className="h-4 w-4 text-rose-500" />
                              <div>
                                <p className="text-xs font-bold text-white">{item.nome}</p>
                                {item.motivoRisco && <p className="text-[9px] text-rose-400/80 uppercase tracking-wider">{item.motivoRisco}</p>}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[9px]">Risco {item.risco}%</Badge>
                              <p className="text-[10px] font-bold text-slate-500 mt-1">Auditar 50 un.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Veredito da Inspeção</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => setNovaInspecao({ ...novaInspecao, status: 'aprovado' })}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${novaInspecao.status === 'aprovado' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5'}`}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-black uppercase tracking-widest">Lote Aprovado</span>
                      </button>
                      <button 
                        onClick={() => setNovaInspecao({ ...novaInspecao, status: 'ressalva' })}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${novaInspecao.status === 'ressalva' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5'}`}
                      >
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm font-black uppercase tracking-widest">Aprovado c/ Ressalvas</span>
                      </button>
                      <button 
                        onClick={() => setNovaInspecao({ ...novaInspecao, status: 'reprovado' })}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${novaInspecao.status === 'reprovado' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5'}`}
                      >
                        <XCircle className="h-5 w-5" />
                        <span className="text-sm font-black uppercase tracking-widest">Reprovado (Quarentena)</span>
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={salvarInspecao}
                    className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest h-12 rounded-xl"
                  >
                    <Save className="mr-2 h-4 w-4" /> Finalizar Inspeção
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LISTA DE INSPEÇÕES */}
          <div className="xl:col-span-7 space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white italic flex items-center gap-2 mb-4">
              Histórico de Recebimento
            </h2>

            {inspecoes.length === 0 ? (
               <div className="p-10 border border-dashed border-cyan-500/20 rounded-3xl text-center flex flex-col items-center justify-center">
                 <SearchCheck className="h-12 w-12 text-cyan-500/30 mb-4" />
                 <p className="text-slate-400 font-medium">Nenhuma inspeção registrada ainda.</p>
               </div>
            ) : (
              <div className="space-y-3">
                {inspecoes.map((insp) => (
                  <Card key={insp.id} className="bg-zinc-950/50 border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-colors">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      {/* STATUS BAR */}
                      <div className={`w-full sm:w-2 h-2 sm:h-auto ${
                        insp.status === 'aprovado' ? 'bg-emerald-500' :
                        insp.status === 'ressalva' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      
                      <div className="flex-1 p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* NOTA & FORNECEDOR */}
                        <div className="md:col-span-4 space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Documento Base</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-cyan-500/10 text-cyan-400 border-none font-mono text-xs">{insp.nota}</Badge>
                          </div>
                          <p className="text-xs text-slate-400 truncate w-48" title={insp.fornecedor}>{insp.fornecedor}</p>
                          <p className="text-[9px] text-cyan-400/80 uppercase tracking-widest pt-2">
                            <span className="font-bold text-white">{insp.auditor}</span> • {insp.setor} • {new Date(insp.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        {/* PLANO EXECUTADO */}
                        <div className="md:col-span-5 space-y-1 border-l border-white/5 pl-4">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Amostragem Atena</p>
                          <p className="text-sm font-medium text-white">{insp.amostragemPlano}</p>
                        </div>

                        {/* RESULTADO */}
                        <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-2">
                          {insp.status === 'aprovado' && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Aprovado
                            </Badge>
                          )}
                          {insp.status === 'ressalva' && (
                            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Ressalvas
                            </Badge>
                          )}
                          {insp.status === 'reprovado' && (
                            <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                              <XCircle className="mr-1 h-3 w-3" /> Quarentena
                            </Badge>
                          )}
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest">{new Date(insp.data).toLocaleString('pt-BR')}</p>
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
      <LegalSafeguard module="DANTE CQ RECEBIMENTO" protocol="NX-CQ-02" />
    </SovereignShowcase>
  );
}
