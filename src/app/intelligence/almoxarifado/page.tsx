'use client';

import React, { useState, useMemo } from 'react';
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
import {
  Warehouse, Plus, Trash2, ArrowLeft, Printer, AlertTriangle,
  CheckCircle, Package, ArrowDownCircle, ArrowUpCircle, Activity, Search, X,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { useAlmoxarifado, type ItemEstoque } from '@/lib/almoxarifado/store';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

type MovType = 'entrada' | 'saida';
type DialogMode = 'item' | 'movimento' | null;

const itemVazio = (): Omit<ItemEstoque, 'id' | 'movimentos'> => ({
  codigo: '', descricao: '', unidade: 'UN', estoqueMinimo: 0, estoqueAtual: 0, localizacao: '',
});

export default function AlmoxarifadoPage() {
  const { itens, salvarItem, excluirItem, aplicarMovimento } = useAlmoxarifado();
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editandoItem, setEditandoItem] = useState<ItemEstoque | null>(null);
  const [itemMovimento, setItemMovimento] = useState<ItemEstoque | null>(null);
  const [form, setForm] = useState(itemVazio());
  const [movTipo, setMovTipo] = useState<MovType>('entrada');
  const [movQtd, setMovQtd] = useState(0);
  const [movData, setMovData] = useState('');
  const [movResp, setMovResp] = useState('');
  const [movObs, setMovObs] = useState('');
  const [buscaEstoque, setBuscaEstoque] = useState('');

  const abrirNovoItem = () => {
    setEditandoItem(null);
    setForm(itemVazio());
    setDialogMode('item');
  };

  const abrirEditarItem = (item: ItemEstoque) => {
    setEditandoItem(item);
    setForm({ codigo: item.codigo, descricao: item.descricao, unidade: item.unidade, estoqueMinimo: item.estoqueMinimo, estoqueAtual: item.estoqueAtual, localizacao: item.localizacao });
    setDialogMode('item');
  };

  const abrirMovimento = (item: ItemEstoque) => {
    setItemMovimento(item);
    setMovTipo('entrada'); setMovQtd(0); setMovData(''); setMovResp(''); setMovObs('');
    setDialogMode('movimento');
  };

  const handleSalvarItem = () => {
    if (!form.codigo || !form.descricao) return;
    salvarItem(form, editandoItem?.id);
    setDialogMode(null);
  };

  const handleSalvarMovimento = () => {
    if (!itemMovimento || movQtd <= 0 || !movData || !movResp) return;
    aplicarMovimento(itemMovimento.id, movTipo, movQtd, movData, movResp, movObs);
    setDialogMode(null);
  };

  const stats = useMemo(() => ({
    total: itens.length,
    criticos: itens.filter(i => i.estoqueAtual <= i.estoqueMinimo).length,
    ok: itens.filter(i => i.estoqueAtual > i.estoqueMinimo).length,
    movimentos: itens.reduce((acc, i) => acc + i.movimentos.length, 0),
  }), [itens]);

  const itensFiltrados = useMemo(() => {
    if (!buscaEstoque.trim()) return itens;
    const q = buscaEstoque.toLowerCase();
    return itens.filter(i =>
      i.codigo.toLowerCase().includes(q) ||
      i.descricao.toLowerCase().includes(q) ||
      i.localizacao.toLowerCase().includes(q)
    );
  }, [itens, buscaEstoque]);

  const statusItem = (item: ItemEstoque) => {
    if (item.estoqueAtual === 0) return { label: 'Zerado', color: 'text-rose-400 border-rose-500/30' };
    if (item.estoqueAtual <= item.estoqueMinimo) return { label: 'Crítico', color: 'text-amber-400 border-amber-500/30' };
    return { label: 'OK', color: 'text-emerald-400 border-emerald-500/30' };
  };

  return (
    <SovereignShowcase moduleName="Dante Almoxarifado" imagePath="/Nexus Empresas/Dante almoxarife.png">
      <div className="min-h-screen bg-black text-white p-6 space-y-8 font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/nexus-empresas">
            <div className="p-2 rounded-full hover:bg-emerald-500/10 transition-colors">
              <ArrowLeft className="h-5 w-5 text-emerald-400" />
            </div>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight text-emerald-400 font-headline italic">Dante Almoxarifado</h1>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Stock Control</Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest italic tracking-[0.2em]">
              Controle de Estoque & Movimentações — v1.0
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
      </div>

      {/* TÍTULO GRANDE */}
      <div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">Controle de Estoque</h2>
        <p className="text-xs text-gray-600 uppercase tracking-widest mt-1">Posição atual do inventário</p>
      </div>

      {/* CARDS ENTRADA / SAÍDA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/intelligence/almoxarifado/modulo?aba=entrada">
          <div className="group rounded-[28px] border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500/40 transition-all p-6 flex items-center gap-5 cursor-pointer">
            <div className="p-4 rounded-2xl bg-emerald-600/20 group-hover:bg-emerald-600/30 transition-all">
              <ArrowDownCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-black uppercase tracking-widest text-base">Registrar Entrada</p>
              <p className="text-gray-500 text-xs mt-0.5">Recebimento de materiais, notas fiscais</p>
            </div>
          </div>
        </Link>
        <Link href="/intelligence/almoxarifado/modulo?aba=saida">
          <div className="group rounded-[28px] border border-rose-500/20 bg-rose-950/20 hover:bg-rose-950/40 hover:border-rose-500/40 transition-all p-6 flex items-center gap-5 cursor-pointer">
            <div className="p-4 rounded-2xl bg-rose-600/20 group-hover:bg-rose-600/30 transition-all">
              <ArrowUpCircle className="h-8 w-8 text-rose-400" />
            </div>
            <div>
              <p className="text-rose-400 font-black uppercase tracking-widest text-base">Registrar Saída</p>
              <p className="text-gray-500 text-xs mt-0.5">Requisições, ordens de produção, entregas</p>
            </div>
          </div>
        </Link>
      </div>

      {/* STATS + PESQUISA + NOVO ITEM */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Cadastrados', value: stats.total, icon: Package, color: 'text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'OK', value: stats.ok, icon: CheckCircle, color: 'text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'Críticos', value: stats.criticos, icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'Moviment.', value: stats.movimentos, icon: Activity, color: 'text-violet-400', border: 'border-violet-500/20' },
          ].map((s, i) => (
            <div key={i} className={cn('rounded-2xl border bg-zinc-950/60 p-3 flex items-center gap-2', s.border)}>
              <s.icon className={`h-5 w-5 ${s.color} shrink-0`} />
              <div>
                <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-none">{s.label}</p>
                <p className={`text-xl font-black ${s.color} leading-tight`}>{s.value}</p>
              </div>
            </div>
          ))}
          <button onClick={abrirNovoItem} className="rounded-2xl border border-emerald-500/40 bg-emerald-600/20 hover:bg-emerald-600/40 transition-all p-3 flex items-center justify-center gap-2 group">
            <div className="p-1.5 rounded-xl bg-emerald-600/30 group-hover:bg-emerald-600/50 transition-all">
              <Plus className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-emerald-400 font-black uppercase tracking-widest text-xs">Novo Item</span>
          </button>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Pesquisar por código, produto, cor ou espessura..."
            value={buscaEstoque}
            onChange={e => setBuscaEstoque(e.target.value)}
            className="bg-zinc-950/60 border-white/10 text-white h-11 rounded-2xl pl-11 pr-10 text-sm w-full"
          />
          {buscaEstoque && (
            <button onClick={() => setBuscaEstoque('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* LISTA */}
      {itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border-2 border-dashed border-emerald-500/20 rounded-[32px]">
          <Warehouse className="h-16 w-16 text-emerald-500/30" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Almoxarifado vazio.</p>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase" onClick={abrirNovoItem}>
            <Plus className="mr-2 h-4 w-4" /> Cadastrar Primeiro Item
          </Button>
        </div>
      ) : (
        <div className="rounded-[32px] border border-emerald-500/20 bg-zinc-950/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-emerald-500/10 hover:bg-transparent bg-emerald-950/20">
                {['Código', 'Descrição', 'Unidade', 'Localização', 'Est. Mínimo', 'Est. Atual', 'Status', 'Ações'].map(h => (
                  <TableHead key={h} className="text-emerald-400 font-black text-[10px] uppercase tracking-widest text-center py-4">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {itensFiltrados.map(item => {
                const st = statusItem(item);
                return (
                  <TableRow key={item.id} className="border-emerald-500/10 hover:bg-emerald-950/10">
                    <TableCell className="text-center font-mono text-emerald-300 text-xs font-bold">{item.codigo}</TableCell>
                    <TableCell className="text-white font-bold text-sm">{item.descricao}</TableCell>
                    <TableCell className="text-center text-gray-400 text-xs">{item.unidade}</TableCell>
                    <TableCell className="text-center text-gray-400 text-xs">{item.localizacao || '—'}</TableCell>
                    <TableCell className="text-center text-gray-400 font-bold">{item.estoqueMinimo}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn('font-black text-lg', item.estoqueAtual === 0 ? 'text-rose-400' : item.estoqueAtual <= item.estoqueMinimo ? 'text-amber-400' : 'text-emerald-400')}>
                        {item.estoqueAtual}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn('border bg-transparent text-[9px] font-black uppercase', st.color)}>{st.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:bg-emerald-500/10 h-7 px-2 text-[10px] font-black uppercase" onClick={() => abrirMovimento(item)}>Mov.</Button>
                        <Button size="sm" variant="ghost" className="text-violet-400 hover:bg-violet-500/10 h-7 px-2 text-[10px] font-black uppercase" onClick={() => abrirEditarItem(item)}>Editar</Button>
                        <Button size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-7 w-7 p-0" onClick={() => excluirItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* HISTÓRICO */}
      {stats.movimentos > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Últimas Movimentações</p>
          <div className="rounded-[32px] border border-white/5 bg-zinc-950/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  {['Data', 'Item', 'Tipo', 'Qtd', 'Responsável', 'Obs'].map(h => (
                    <TableHead key={h} className="text-gray-600 font-black text-[10px] uppercase tracking-widest text-center py-3">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens
                  .flatMap(i => i.movimentos.map(m => ({ ...m, descricao: i.descricao, codigo: i.codigo })))
                  .sort((a, b) => b.data.localeCompare(a.data))
                  .slice(0, 10)
                  .map(m => (
                    <TableRow key={m.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="text-center text-gray-400 text-xs">{m.data.split('-').reverse().join('/')}</TableCell>
                      <TableCell className="text-white text-xs font-bold">{m.descricao}</TableCell>
                      <TableCell className="text-center">
                        {m.tipo === 'entrada'
                          ? <span className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-black"><ArrowDownCircle className="h-3 w-3" /> Entrada</span>
                          : <span className="flex items-center justify-center gap-1 text-rose-400 text-xs font-black"><ArrowUpCircle className="h-3 w-3" /> Saída</span>}
                      </TableCell>
                      <TableCell className="text-center font-black text-white">{m.quantidade}</TableCell>
                      <TableCell className="text-center text-gray-400 text-xs">{m.responsavel}</TableCell>
                      <TableCell className="text-center text-gray-500 text-xs">{m.observacao || '—'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <LegalSafeguard module="DANTE ALMOXARIFADO" protocol="NX-7731-STK" />

      {/* DIALOG — CADASTRO */}
      <Dialog open={dialogMode === 'item'} onOpenChange={o => !o && setDialogMode(null)}>
        <DialogContent className="bg-zinc-950 border-emerald-500/30 text-white max-w-2xl rounded-[40px]">
          <DialogHeader>
            <DialogTitle className="text-emerald-400 font-black uppercase flex items-center gap-2 text-xl italic">
              <Package className="h-5 w-5" />
              {editandoItem ? 'Editar Item' : 'Cadastrar Novo Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Código</Label>
                <Input placeholder="EX: ALM-001" value={form.codigo} onChange={e => setForm(p => ({ ...p, codigo: e.target.value }))} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl font-mono uppercase" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Unidade</Label>
                <Input placeholder="UN / KG / M / L" value={form.unidade} onChange={e => setForm(p => ({ ...p, unidade: e.target.value }))} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl text-center uppercase" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Descrição</Label>
              <Input placeholder="Ex: Parafuso M8 x 25mm" value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl uppercase" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Est. Mínimo</Label>
                <Input type="number" min={0} value={form.estoqueMinimo} onChange={e => setForm(p => ({ ...p, estoqueMinimo: Number(e.target.value) }))} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl text-center font-black" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Est. Atual</Label>
                <Input type="number" min={0} value={form.estoqueAtual} onChange={e => setForm(p => ({ ...p, estoqueAtual: Number(e.target.value) }))} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl text-center font-black" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Localização</Label>
                <Input placeholder="Ex: A1-P3" value={form.localizacao} onChange={e => setForm(p => ({ ...p, localizacao: e.target.value }))} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl text-center uppercase font-mono" />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-emerald-500/10">
            <Button variant="outline" className="border-zinc-700 text-gray-400" onClick={() => setDialogMode(null)}>Cancelar</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest px-8 rounded-2xl" onClick={handleSalvarItem} disabled={!form.codigo || !form.descricao}>
              Salvar Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG — MOVIMENTAÇÃO */}
      <Dialog open={dialogMode === 'movimento'} onOpenChange={o => !o && setDialogMode(null)}>
        <DialogContent className="bg-zinc-950 border-emerald-500/30 text-white max-w-lg rounded-[40px]">
          <DialogHeader>
            <DialogTitle className="text-emerald-400 font-black uppercase flex items-center gap-2 text-xl italic">
              <Activity className="h-5 w-5" /> Registrar Movimentação
            </DialogTitle>
          </DialogHeader>
          {itemMovimento && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Item</p>
                <p className="text-white font-black uppercase">{itemMovimento.descricao}</p>
                <p className="text-emerald-400 font-black text-2xl mt-1">{itemMovimento.estoqueAtual} <span className="text-xs text-gray-500">{itemMovimento.unidade}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMovTipo('entrada')} className={cn('p-4 rounded-2xl border font-black uppercase text-sm flex items-center justify-center gap-2 transition-all', movTipo === 'entrada' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-black/40 border-zinc-700 text-gray-500')}>
                  <ArrowDownCircle className="h-4 w-4" /> Entrada
                </button>
                <button onClick={() => setMovTipo('saida')} className={cn('p-4 rounded-2xl border font-black uppercase text-sm flex items-center justify-center gap-2 transition-all', movTipo === 'saida' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-black/40 border-zinc-700 text-gray-500')}>
                  <ArrowUpCircle className="h-4 w-4" /> Saída
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Quantidade</Label>
                  <Input type="number" min={1} value={movQtd || ''} onChange={e => setMovQtd(Number(e.target.value))} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl text-center font-black text-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Data</Label>
                  <Input type="date" value={movData} onChange={e => setMovData(e.target.value)} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Responsável</Label>
                <Input placeholder="Nome do responsável" value={movResp} onChange={e => setMovResp(e.target.value)} className="bg-black/40 border-emerald-500/20 text-white h-11 rounded-xl uppercase" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Observação (opcional)</Label>
                <Input placeholder="Ex: Requisição OP-042" value={movObs} onChange={e => setMovObs(e.target.value)} className="bg-black/40 border-zinc-700 text-white h-11 rounded-xl" />
              </div>
            </div>
          )}
          <DialogFooter className="pt-4 border-t border-emerald-500/10">
            <Button variant="outline" className="border-zinc-700 text-gray-400" onClick={() => setDialogMode(null)}>Cancelar</Button>
            <Button className={cn('text-white font-black uppercase tracking-widest px-8 rounded-2xl', movTipo === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500')}
              onClick={handleSalvarMovimento} disabled={movQtd <= 0 || !movData || !movResp}>
              Confirmar {movTipo === 'entrada' ? 'Entrada' : 'Saída'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </SovereignShowcase>
  );
}
