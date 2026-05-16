'use client';

import React, { useState, useEffect } from 'react';
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
import { Plus, Trash2, ArrowLeft, Search, Save, Package, Scissors, Timer, Calculator, Settings, Edit3, Database } from 'lucide-react';
import Link from 'next/link';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { cn } from '@/lib/utils';

const MINUTOS_UTEIS_HORA = 53; // Conforme nova diretriz do usuário

interface ItemEngenharia {
  id: string;
  produto: string;
  codigo: string;
  pecasPorCiclo: number;
  tempoPadrao: number;
  capacidadeHora: number; // Calculado: 53 / tempoPadrao * pecasPorCiclo? No, usually (53/tempoPadrao) * pecasPorCiclo
}

export default function EngenhariaPage() {
  const [itens, setItens] = useState<ItemEngenharia[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<ItemEngenharia | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [pecasCiclo, setPecasCiclo] = useState(1);
  const [tempo, setTempo] = useState(0.81);

  useEffect(() => {
    setMounted(true);
    // Mock inicial baseado nos dados do usuário
    setItens([
      { id: '1', produto: 'CORTE DE PERFIL 6MM', codigo: 'PRF-006', pecasPorCiclo: 5, tempoPadrao: 0.81, capacidadeHora: Math.floor((53 / 0.81) * 5) },
      { id: '2', produto: 'CORTE DE PERFIL 4MM', codigo: 'PRF-004', pecasPorCiclo: 7, tempoPadrao: 0.81, capacidadeHora: Math.floor((53 / 0.81) * 7) },
      { id: '3', produto: 'CHAPA GALVANIZADA 1.5MM', codigo: 'CHP-1.5', pecasPorCiclo: 1, tempoPadrao: 0.81, capacidadeHora: Math.floor((53 / 0.81) * 1) },
    ]);
  }, []);

  const abrirNovo = () => {
    setEditando(null);
    setNome(''); setCodigo(''); setPecasCiclo(1); setTempo(0.81);
    setDialogOpen(true);
  };

  const abrirEditar = (item: ItemEngenharia) => {
    setEditando(item);
    setNome(item.produto); setCodigo(item.codigo); setPecasCiclo(item.pecasPorCiclo); setTempo(item.tempoPadrao);
    setDialogOpen(true);
  };

  const salvar = () => {
    const capacidade = Math.floor((MINUTOS_UTEIS_HORA / (tempo || 1)) * pecasCiclo);
    const novoItem = {
      id: editando ? editando.id : crypto.randomUUID(),
      produto: nome.toUpperCase(),
      codigo: codigo.toUpperCase(),
      pecasPorCiclo: pecasCiclo,
      tempoPadrao: tempo,
      capacidadeHora: capacidade
    };

    setItens(prev => editando ? prev.map(i => i.id === editando.id ? novoItem : i) : [...prev, novoItem]);
    setDialogOpen(false);
  };

  const excluir = (id: string) => setItens(prev => prev.filter(i => i.id !== id));

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-12 font-sans selection:bg-amber-500/30">
      
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-amber-500/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/intelligence">
            <div className="p-2 rounded-full hover:bg-amber-500/10 transition-colors">
              <ArrowLeft className="h-5 w-5 text-amber-400" />
            </div>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight text-amber-400 font-headline italic">Engenharia de Processos</h1>
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Master Database</Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest italic tracking-[0.2em]">Ponto Único de Verdade — Métrica 53 min/h</p>
          </div>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest h-10 px-6 rounded-xl text-[11px]" onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Cadastrar Novo Item
        </Button>
      </div>

      {/* SEARCH E STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="md:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
            <Input placeholder="Buscar produto ou código na engenharia..." className="bg-zinc-950 border-amber-500/20 h-14 pl-12 rounded-2xl text-sm font-bold uppercase tracking-widest focus:border-amber-500 transition-all" />
         </div>
         <div className="bg-zinc-950 border border-amber-500/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Itens Cadastrados</p>
               <p className="text-xl font-black text-white">{itens.length}</p>
            </div>
            <Database className="h-6 w-6 text-amber-500/20" />
         </div>
         <div className="bg-zinc-950 border border-amber-500/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Base de Eficiência</p>
               <p className="text-xl font-black text-amber-500">{MINUTOS_UTEIS_HORA} <span className="text-xs font-normal text-gray-500">min/h</span></p>
            </div>
            <Settings className="h-6 w-6 text-amber-500/20" />
         </div>
      </div>

      {/* TABELA DE ENGENHARIA */}
      <div className="bg-zinc-950/40 border border-amber-500/10 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
        <Table>
          <TableHeader className="bg-amber-500/5">
            <TableRow className="border-amber-500/10">
              <TableHead className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Produto / Operação</TableHead>
              <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Código</TableHead>
              <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Pçs / Ciclo</TableHead>
              <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">T. Padrão (Auditado)</TableHead>
              <TableHead className="text-right px-10 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Capacidade (Pçs/h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map((item) => (
              <TableRow key={item.id} className="border-amber-500/5 hover:bg-amber-500/5 transition-colors group">
                <TableCell className="px-10 py-5">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-amber-500/30 transition-all">
                        <Package className="h-4 w-4 text-amber-500/40" />
                      </div>
                      <span className="font-black text-sm uppercase text-white">{item.produto}</span>
                   </div>
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-gray-500">{item.codigo}</TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-zinc-900 text-amber-500 border border-amber-500/20 font-black">{item.pecasPorCiclo}x</Badge>
                </TableCell>
                <TableCell className="text-center">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/5 rounded-full border border-amber-500/10">
                      <Timer className="h-3 w-3 text-amber-500/40" />
                      <span className="font-black text-sm text-amber-400">{item.tempoPadrao} <span className="text-[10px] font-normal opacity-50">min</span></span>
                   </div>
                </TableCell>
                <TableCell className="text-right px-10">
                   <div className="flex items-center justify-end gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-base font-black text-white italic">{item.capacidadeHora} <span className="text-[10px] font-normal text-gray-500 uppercase">pçs/h</span></span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all text-amber-500" onClick={() => abrirEditar(item)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all text-rose-500" onClick={() => excluir(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DE CADASTRO */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-2xl rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.2)]">
          <DialogHeader className="p-8 bg-amber-600/10 border-b border-amber-500/10">
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-amber-400 flex items-center gap-4">
              <Database className="h-7 w-7 text-amber-500" />
              Cadastro de Engenharia Técnica
            </DialogTitle>
          </DialogHeader>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
               <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-amber-500/60 tracking-widest">Nome do Produto / Operação</Label>
                  <Input placeholder="Ex: CORTE DE PERFIL 6MM" value={nome} onChange={e => setNome(e.target.value)} className="bg-black/40 border-amber-500/20 h-12 rounded-xl text-sm font-bold uppercase" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-amber-500/60 tracking-widest">Código Interno</Label>
                  <Input placeholder="Ex: PRF-006" value={codigo} onChange={e => setCodigo(e.target.value)} className="bg-black/40 border-amber-500/20 h-12 rounded-xl text-sm font-mono uppercase" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-amber-500/60 tracking-widest">Peças por Ciclo</Label>
                  <Input type="number" min={1} value={pecasCiclo} onChange={e => setPecasCiclo(Number(e.target.value))} className="bg-black/40 border-amber-500/20 h-12 rounded-xl text-center text-lg font-black text-amber-500" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-amber-500/60 tracking-widest">Tempo Padrão (Cronoanalista)</Label>
                  <Input type="number" step={0.01} value={tempo} onChange={e => setTempo(Number(e.target.value))} className="bg-black/40 border-amber-500/20 h-12 rounded-xl text-center text-lg font-black text-white" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-emerald-500/60 tracking-widest">Capacidade Calculada (53 min/h)</Label>
                  <div className="h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                     <p className="text-xl font-black text-emerald-400 italic">
                        {Math.floor((MINUTOS_UTEIS_HORA / (tempo || 1)) * pecasCiclo)} <span className="text-xs font-normal opacity-50 uppercase">pçs/h</span>
                     </p>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-black/60 border-t border-amber-500/10">
            <Button className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest px-12 h-14 rounded-2xl shadow-xl transition-all" onClick={salvar}>
               <Save className="mr-2 h-4 w-4" /> Salvar na Engenharia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LegalSafeguard module="NEXUS ENGENHARIA" protocol="NX-ENG-DATA-00" />
    </div>
  );
}
