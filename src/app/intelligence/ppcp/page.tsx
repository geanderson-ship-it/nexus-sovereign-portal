'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Trash2, ArrowLeft, Printer, Target, Settings2, CalendarDays, Factory, Package, Scissors, Activity, Layers, Zap, Clock, Timer, Calculator, User, AlertTriangle, ShieldCheck, Info, Scale, Search, CheckCircle, Database } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

const TEMPO_DISPONIVEL_DIA = 528; // 8.8h * 60min

// MOCK DO BANCO DE ENGENHARIA
const BANCO_ENGENHARIA = [
  { produto: 'CORTE DE PERFIL 6MM', codigo: 'PRF-006', pecasPorCiclo: 5, tempoPadrao: 0.81 },
  { produto: 'CORTE DE PERFIL 4MM', codigo: 'PRF-004', pecasPorCiclo: 7, tempoPadrao: 0.81 },
  { produto: 'CHAPA GALVANIZADA 1.5MM', codigo: 'CHP-1.5', pecasPorCiclo: 1, tempoPadrao: 0.81 },
];

interface Produto {
  id: string;
  produto: string;
  codigo: string;
  maquina: string;
  pecasPorCiclo: number; 
  tempoPadrao: number; 
  qtdNecessaria: number; 
  auditado: boolean;
}

interface Programacao {
  id: string;
  data: string;
  linha: string;
  lider: string;
  produtos: Produto[];
}

const gerarLinhasVazias = (count: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    produto: '',
    codigo: '',
    maquina: '',
    pecasPorCiclo: 1,
    tempoPadrao: 0.81, 
    qtdNecessaria: 0,
    auditado: false
  }));

export default function PPCPPage() {
  const [programacoes, setProgramacoes] = useState<Programacao[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Programacao | null>(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    data: '',
    linha: '',
    lider: '',
    produtos: gerarLinhasVazias(10)
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const abrirNovo = () => {
    setEditando(null);
    setFormData({
      data: '',
      linha: '',
      lider: '',
      produtos: gerarLinhasVazias(10)
    });
    setDialogOpen(true);
  };

  const abrirEditar = (prog: Programacao) => {
    setEditando(prog);
    const produtosPreenchidos = [...prog.produtos];
    while (produtosPreenchidos.length < 10) {
      produtosPreenchidos.push({
        id: `row-${produtosPreenchidos.length}`,
        produto: '',
        codigo: '',
        maquina: '',
        pecasPorCiclo: 1,
        tempoPadrao: 0.81,
        qtdNecessaria: 0,
        auditado: false
      });
    }
    setFormData({
      data: prog.data,
      linha: prog.linha,
      lider: prog.lider || '',
      produtos: produtosPreenchidos
    });
    setDialogOpen(true);
  };

  const calcularLinha = (p: Produto) => {
    const ciclos = Math.ceil(p.qtdNecessaria / (p.pecasPorCiclo || 1));
    const tempoNecessario = ciclos * (p.tempoPadrao || 0);
    return { ciclos, tempoNecessario };
  };

  const matrixCalculated = useMemo(() => {
    let saldoAcumulado = TEMPO_DISPONIVEL_DIA;
    return formData.produtos.map(p => {
      const { ciclos, tempoNecessario } = calcularLinha(p);
      if (p.produto || p.qtdNecessaria > 0) {
        saldoAcumulado -= tempoNecessario;
      }
      return { ...p, ciclos, tempoNecessario, saldoRestante: saldoAcumulado };
    });
  }, [formData.produtos]);

  const summary = useMemo(() => {
    return matrixCalculated.reduce((acc, p) => {
      acc.totalMinutos += p.tempoNecessario;
      acc.totalPecas += p.qtdNecessaria;
      return acc;
    }, { totalMinutos: 0, totalPecas: 0 });
  }, [matrixCalculated]);

  const salvar = () => {
    if (!formData.data || !formData.linha) return;
    const produtosValidos = formData.produtos
      .filter(p => p.produto.trim() !== '' || p.qtdNecessaria > 0)
      .map(p => {
        const ciclos = Math.ceil(p.qtdNecessaria / (p.pecasPorCiclo || 1));
        const tempoNecessario = ciclos * (p.tempoPadrao || 0);
        const pecasPorHora = p.tempoPadrao > 0 ? ((p.pecasPorCiclo || 1) * 60) / p.tempoPadrao : 0;
        return { 
          ...p, 
          id: Math.random().toString(36).substr(2, 9),
          ciclos,
          tempoNecessario,
          pecasPorHora
        };
      });
    
    if (produtosValidos.length === 0) return;

    const novaProg = { 
      id: editando ? editando.id : Math.random().toString(36).substr(2, 9),
      data: formData.data,
      linha: formData.linha,
      lider: formData.lider,
      produtos: produtosValidos
    };

    setProgramacoes(prev => {
      if (editando) return prev.map(p => p.id === editando.id ? novaProg : p);
      return [...prev, novaProg];
    });
    setDialogOpen(false);
  };

  const updateProduto = (index: number, field: keyof Produto, value: string | number) => {
    const novos = [...formData.produtos];
    novos[index] = { ...novos[index], [field]: value };
    
    if (field === 'produto') {
      const match = BANCO_ENGENHARIA.find(i => i.produto === String(value).toUpperCase());
      if (match) {
        novos[index] = { 
          ...novos[index], 
          codigo: match.codigo, 
          pecasPorCiclo: match.pecasPorCiclo, 
          tempoPadrao: match.tempoPadrao,
          auditado: true
        };
      } else {
        novos[index].auditado = false;
      }
    }
    setFormData(prev => ({ ...prev, produtos: novos }));
  };

  const aplicarItemEngenharia = (idx: number, item: typeof BANCO_ENGENHARIA[0]) => {
    const novos = [...formData.produtos];
    novos[idx] = { 
      ...novos[idx], 
      produto: item.produto, 
      codigo: item.codigo, 
      pecasPorCiclo: item.pecasPorCiclo, 
      tempoPadrao: item.tempoPadrao,
      auditado: true 
    };
    setFormData(prev => ({ ...prev, produtos: novos }));
  };

  // Proteção suave contra erros de hidratação
  const isClient = mounted;

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-12 font-sans selection:bg-amber-500/30">
      
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-amber-500/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/nexus-empresas">
            <div className="p-2 rounded-full hover:bg-amber-500/10 transition-colors group">
              <ArrowLeft className="h-5 w-5 text-amber-400" />
            </div>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight text-amber-400 font-headline italic">Dante PPCP</h1>
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Crono-Integrated</Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest italic tracking-[0.2em]">Matrix v6.7 — Layout Compacto</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Exportar Planilha
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest h-10 px-6 rounded-xl text-[11px]" onClick={abrirNovo}>
            <Plus className="mr-2 h-4 w-4" /> Nova Programação
          </Button>
        </div>
      </div>

      {/* DASHBOARD DE TURNOS */}
      <div className="flex flex-wrap gap-16">
        {programacoes.map((prog) => {
          const stats = prog.produtos.reduce((acc, p) => {
            const c = calcularLinha(p);
            acc.tempo += c.tempoNecessario;
            acc.pecas += p.qtdNecessaria;
            return acc;
          }, { tempo: 0, pecas: 0 });
          const ocupacao = (stats.tempo / TEMPO_DISPONIVEL_DIA) * 100;

          return (
            <div key={prog.id} className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-4">
                       <p className="text-3xl font-black text-white uppercase italic tracking-tighter">{prog.linha}</p>
                       <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-black px-4 h-6 text-[10px] uppercase">
                         {isClient && prog.data ? new Date(prog.data + 'T00:00:00').toLocaleDateString('pt-BR') : (prog.data || '--')}
                       </Badge>
                    </div>
                    {prog.lider && (
                      <div className="flex items-center gap-2 bg-zinc-950 border border-white/5 px-6 py-2 rounded-2xl">
                         <User className="h-4 w-4 text-amber-500/60" />
                         <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mr-2">Líder:</span>
                         <span className="text-sm font-black text-amber-400 uppercase italic tracking-widest">{prog.lider}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black uppercase text-amber-400 hover:bg-amber-500/10 px-4 rounded-lg" onClick={() => abrirEditar(prog)}>Ajustar</Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-500/10 rounded-lg" onClick={() => setProgramacoes(prev => prev.filter(x => x.id !== prog.id))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
               </div>

               <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
                  <Table>
                    <TableHeader className="bg-amber-500/5">
                      <TableRow className="border-amber-500/10">
                        <TableHead className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Item Programado</TableHead>
                        <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Código</TableHead>
                        <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Qtd</TableHead>
                        <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Pçs/Cic</TableHead>
                        <TableHead className="text-right px-10 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">T. Nec (min)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prog.produtos.map((p) => {
                        const c = calcularLinha(p);
                        return (
                          <TableRow key={p.id} className="border-amber-500/5 hover:bg-amber-500/5 transition-colors">
                            <TableCell className="px-10 py-5 font-black text-sm uppercase text-white tracking-tight flex items-center gap-3">
                              {p.produto}
                              {p.auditado && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                            </TableCell>
                            <TableCell className="text-center font-mono text-[10px] text-gray-500">{p.codigo}</TableCell>
                            <TableCell className="text-center font-bold text-gray-300 text-base">{p.qtdNecessaria.toLocaleString()}</TableCell>
                            <TableCell className="text-center"><Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[10px] px-3">{p.pecasPorCiclo}x</Badge></TableCell>
                            <TableCell className="text-right px-10 font-black text-amber-400 text-base">{c.tempoNecessario.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="p-8 bg-black/40 border-t border-amber-500/10 flex justify-between items-center">
                    <div className="flex gap-10 items-center">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Ocupação do Turno</span>
                          <span className="text-2xl font-black text-white italic">{stats.tempo.toFixed(1)} / 528 <span className="text-xs font-normal text-gray-600">minutos</span></span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-48 h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                          <div className={cn("h-full rounded-full transition-all duration-1000", ocupacao > 100 ? "bg-rose-500" : "bg-emerald-500")} style={{ width: `${Math.min(ocupacao, 100)}%` }} />
                       </div>
                       <p className={cn("text-3xl font-black italic", ocupacao > 100 ? "text-rose-500" : "text-emerald-500")}>{ocupacao.toFixed(1)}%</p>
                    </div>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      <LegalSafeguard module="DANTE PPCP" protocol="NX-9982-IA" />

      {/* MODAL DE MATRIZ COMPACTA COM CÓDIGO */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-[95vw] lg:max-w-7xl h-[95vh] flex flex-col rounded-[50px] overflow-hidden shadow-[0_0_150px_rgba(245,158,11,0.2)]">
          <DialogHeader className="p-10 bg-amber-600/10 border-b border-amber-500/10">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-amber-400 flex items-center gap-5">
                <Calculator className="h-8 w-8 text-amber-500" />
                {isClient ? 'Matriz de Crono-Programação Industrial' : 'Carregando Matriz...'}
              </DialogTitle>
              <Button variant="ghost" className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/10 px-6 opacity-50 cursor-not-allowed" disabled>
                   <Database className="mr-2 h-4 w-4" /> Gerenciar Engenharia
                </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-amber-500/20">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="bg-black/40 border border-amber-500/20 rounded-3xl p-3 space-y-2 group focus-within:border-amber-500 transition-all">
                  <Label className="text-[10px] font-black uppercase text-amber-500/60 flex items-center gap-2 tracking-widest"><CalendarDays className="h-3 w-3" /> Data do Turno</Label>
                  <Input type="date" value={formData.data} onChange={e => setFormData(prev => ({...prev, data: e.target.value}))} className="bg-transparent border-none p-0 text-lg font-black text-white focus-visible:ring-0 h-auto" />
               </div>
               <div className="bg-black/40 border border-amber-500/20 rounded-3xl p-3 space-y-2 group focus-within:border-amber-500 transition-all">
                  <Label className="text-[10px] font-black uppercase text-amber-500/60 flex items-center gap-2 tracking-widest"><Factory className="h-3 w-3" /> Setor Industrial</Label>
                  <Input placeholder="Ex: Corte de Perfil" value={formData.linha} onChange={e => setFormData(prev => ({...prev, linha: e.target.value}))} className="bg-transparent border-none p-0 text-lg font-black text-white focus-visible:ring-0 h-auto uppercase italic" />
               </div>
               <div className="bg-amber-600/5 border border-amber-500/30 rounded-3xl p-3 space-y-2 group focus-within:border-amber-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.05)]">
                  <Label className="text-[10px] font-black uppercase text-amber-500 flex items-center gap-2 tracking-widest"><User className="h-3 w-3" /> Líder do Setor</Label>
                  <Input placeholder="NOME DO COMANDANTE" value={formData.lider} onChange={e => setFormData(prev => ({...prev, lider: e.target.value}))} className="bg-transparent border-none p-0 text-lg font-black text-amber-400 focus-visible:ring-0 h-auto uppercase italic placeholder:text-amber-900/40" />
               </div>
            </div>

            <div className="space-y-3">
               {/* HEADER DA TABELA REESTRUTURADO */}
               <div className="grid grid-cols-12 gap-4 px-8 text-[9px] font-black uppercase text-gray-700 tracking-[0.2em] mb-2">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-3">Descrição do Produto</div>
                  <div className="col-span-2 text-center text-amber-500">Código</div>
                  <div className="col-span-1 text-center">Qtd</div>
                  <div className="col-span-1 text-center">Pçs/Cic</div>
                  <div className="col-span-1 text-center opacity-40">Ciclos</div>
                  <div className="col-span-1 text-center opacity-40">T.Pad</div>
                  <div className="col-span-1 text-center opacity-40 text-emerald-500/60">T.Nec</div>
                  <div className="col-span-1 text-right pr-4 opacity-40 text-rose-500/60">Saldo</div>
               </div>

               <div className="space-y-2">
                  {matrixCalculated.map((p, idx) => (
                    <div key={p.id} className={cn(
                      "grid grid-cols-12 gap-4 items-center p-2 px-6 rounded-3xl border transition-all",
                      p.produto || p.qtdNecessaria > 0 ? "bg-amber-500/5 border-amber-500/30 shadow-lg" : "bg-black/20 border-white/5 opacity-30 hover:opacity-100"
                    )}>
                      <div className="col-span-1 text-center text-[10px] font-black text-gray-800">{idx + 1}</div>
                      
                      <div className="col-span-3 group relative flex items-center">
                        <Package className={cn("absolute left-3 h-3 w-3 transition-colors", p.auditado ? "text-emerald-500" : "text-amber-500/10 group-focus-within:text-amber-500")} />
                        <Input 
                          placeholder="Produto..." 
                          value={p.produto} 
                          onChange={e => updateProduto(idx, 'produto', e.target.value)} 
                          className="bg-black/40 border-none h-9 pl-9 pr-8 text-xs font-bold text-white uppercase rounded-xl w-full"
                        />
                        {p.auditado && (
                           <CheckCircle className="absolute right-2 h-3 w-3 text-emerald-500" />
                        )}
                        {!p.auditado && p.produto.length > 2 && (
                          <div className="absolute top-11 left-0 w-full bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                             {BANCO_ENGENHARIA.filter(i => i.produto.includes(p.produto.toUpperCase())).map(item => (
                               <button 
                                 key={item.codigo}
                                 className="w-full text-left p-3 hover:bg-amber-500/10 rounded-xl transition-all flex justify-between items-center group"
                                 onClick={() => aplicarItemEngenharia(idx, item)}
                               >
                                 <div className="flex flex-col">
                                   <span className="text-[10px] font-black text-white">{item.produto}</span>
                                   <span className="text-[8px] text-gray-500 uppercase tracking-widest">{item.codigo}</span>
                                 </div>
                                 <Badge className="bg-amber-500/10 text-amber-500 text-[8px]">T.P: {item.tempoPadrao}</Badge>
                               </button>
                             ))}
                          </div>
                        )}
                      </div>

                      <div className="col-span-2">
                        <Input 
                          placeholder="CÓD-00" 
                          value={p.codigo} 
                          onChange={e => updateProduto(idx, 'codigo', e.target.value)} 
                          className="bg-black/60 border border-amber-500/10 h-9 text-center text-[10px] font-mono font-black text-amber-500/60 rounded-xl uppercase"
                        />
                      </div>
                      
                      <div className="col-span-1">
                        <Input 
                          type="number"
                          value={p.qtdNecessaria || ''} 
                          onChange={e => updateProduto(idx, 'qtdNecessaria', Number(e.target.value))} 
                          className="bg-black/40 border-none h-9 text-center text-sm font-black text-emerald-400 rounded-xl"
                        />
                      </div>

                      <div className="col-span-1">
                        <Input 
                          type="number"
                          min={1}
                          value={p.pecasPorCiclo || ''} 
                          onChange={e => updateProduto(idx, 'pecasPorCiclo', Number(e.target.value))} 
                          className="bg-black/40 border-none h-9 text-center text-xs font-black text-amber-500 rounded-xl"
                        />
                      </div>

                      <div className="col-span-1 text-center text-[10px] font-bold text-gray-600">{p.ciclos}</div>

                      <div className="col-span-1 text-center">
                        <Input 
                          type="number"
                          step={0.01}
                          value={p.tempoPadrao} 
                          onChange={e => updateProduto(idx, 'tempoPadrao', Number(e.target.value))} 
                          className={cn("bg-transparent border-none h-9 text-center text-[10px] font-mono rounded-xl", p.auditado ? "text-emerald-500 font-black" : "text-amber-500/20")}
                        />
                      </div>

                      <div className="col-span-1 text-center text-[11px] font-black text-emerald-400/80 italic">
                        {p.tempoNecessario.toFixed(1)}
                      </div>

                      <div className={cn(
                        "col-span-1 text-right pr-4 text-[11px] font-black italic",
                        p.saldoRestante < 0 ? "text-rose-500 font-black scale-110" : "text-amber-500/30"
                      )}>
                        {p.saldoRestante.toFixed(1)}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <DialogFooter className="p-10 bg-black border-t border-amber-500/10 flex items-center sm:justify-between shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
            <div className="flex gap-12">
               <div className="space-y-1">
                  <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest">Carga Programada</p>
                  <p className="text-3xl font-black text-white italic">{summary.totalMinutos.toFixed(1)} <span className="text-xs font-normal text-gray-600">/ 528 min</span></p>
               </div>
               <div className="space-y-1">
                  <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest">Utilização da Linha (Métrica 53 min/h)</p>
                  <p className={cn("text-3xl font-black italic", summary.totalMinutos > TEMPO_DISPONIVEL_DIA ? "text-rose-500" : "text-emerald-400")}>
                    {((summary.totalMinutos / TEMPO_DISPONIVEL_DIA) * 100).toFixed(1)}%
                  </p>
               </div>
            </div>
            
            <div className="flex gap-6 items-center">
              <button className="text-[10px] text-gray-600 hover:text-white font-black uppercase tracking-[0.4em] transition-colors" onClick={() => setDialogOpen(false)}>Descartar Matriz</button>
              <Button className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest px-14 h-16 rounded-[28px] shadow-2xl shadow-amber-600/30 transition-all hover:scale-105" onClick={salvar}
                disabled={!formData.data || !formData.linha}>
                Consolidar Turno
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
