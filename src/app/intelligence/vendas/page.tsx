'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  ShoppingBag, Plus, ArrowLeft, Search, X, Package,
  ClipboardList, CheckCircle, Clock, Truck, XCircle, AlertTriangle, Eye,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { useVendas, type OrdemPedido, type StatusOP } from '@/lib/vendas/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

const statusConfig: Record<StatusOP, { label: string; color: string; icon: React.ElementType }> = {
  aberta:               { label: 'Aberta',              color: 'text-blue-400 border-blue-500/30',    icon: ClipboardList },
  aguardando_aprovacao: { label: 'Aguard. Aprovação',   color: 'text-amber-400 border-amber-500/30',  icon: AlertTriangle },
  aprovada:             { label: 'Aprovada',             color: 'text-emerald-400 border-emerald-500/30', icon: CheckCircle },
  em_producao:          { label: 'Em Produção',          color: 'text-violet-400 border-violet-500/30', icon: Clock },
  entregue:             { label: 'Entregue',             color: 'text-emerald-400 border-emerald-500/30', icon: Truck },
  cancelada:            { label: 'Cancelada',            color: 'text-rose-400 border-rose-500/30',    icon: XCircle },
};

const isoParaBR = (iso: string) => {
  if (!iso) return '';
  const [a, m, d] = iso.split('-');
  if (!a || !m || !d) return iso;
  return `${d}/${m}/${a}`;
};

export default function VendasPage() {
  const { produtos, ops, atualizarStatusOP } = useVendas();
  const [busca, setBusca] = useState('');
  const [detalheOP, setDetalheOP] = useState<OrdemPedido | null>(null);

  const stats = useMemo(() => ({
    total: ops.length,
    abertas: ops.filter(o => o.status === 'aberta').length,
    producao: ops.filter(o => o.status === 'em_producao').length,
    entregues: ops.filter(o => o.status === 'entregue').length,
    valorTotal: ops.filter(o => o.status !== 'cancelada').reduce((acc, o) => acc + o.valorTotal, 0),
  }), [ops]);

  const opsFiltradas = useMemo(() => {
    if (!busca.trim()) return ops;
    const q = busca.toLowerCase();
    return ops.filter(o =>
      o.numero.toLowerCase().includes(q) ||
      o.cliente.toLowerCase().includes(q) ||
      o.vendedor.toLowerCase().includes(q) ||
      o.itens.some(i => i.produtoNome.toLowerCase().includes(q))
    );
  }, [ops, busca]);

  return (
    <SovereignShowcase moduleName="Dante Vendas" imagePath="/Nexus Empresas/Dante Vendas.png">
      <div className="min-h-screen bg-black text-white p-6 space-y-8 font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-blue-500/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/nexus-empresas">
            <div className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
              <ArrowLeft className="h-5 w-5 text-blue-400" />
            </div>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight text-blue-400 font-headline italic">Dante Vendas</h1>
              <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Sales Intelligence</Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest italic">Catálogo · Pedidos · Ordens de Produção</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/intelligence/vendas/catalogo">
            <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <Package className="mr-2 h-4 w-4" /> Catálogo
            </Button>
          </Link>
          <Link href="/intelligence/vendas/novo-pedido">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest h-10 px-6 rounded-xl text-[11px]">
              <Plus className="mr-2 h-4 w-4" /> Novo Pedido
            </Button>
          </Link>
        </div>
      </div>

      {/* TÍTULO */}
      <div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">Central de Vendas</h2>
        <p className="text-xs text-gray-600 uppercase tracking-widest mt-1">Pedidos, OPs e acompanhamento de entregas</p>
      </div>

      {/* CARDS RÁPIDOS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total OPs', value: stats.total, color: 'text-blue-400', border: 'border-blue-500/20' },
          { label: 'Abertas', value: stats.abertas, color: 'text-amber-400', border: 'border-amber-500/20' },
          { label: 'Em Produção', value: stats.producao, color: 'text-violet-400', border: 'border-violet-500/20' },
          { label: 'Entregues', value: stats.entregues, color: 'text-emerald-400', border: 'border-emerald-500/20' },
        ].map((s, i) => (
          <div key={i} className={cn('rounded-2xl border bg-zinc-950/60 p-3', s.border)}>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-600/10 p-3">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest">Faturamento</p>
          <p className="text-lg font-black text-blue-400">{stats.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>

      {/* BUSCA */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Pesquisar por OP, cliente, vendedor ou produto..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="bg-zinc-950/60 border-white/10 text-white h-11 rounded-2xl pl-11 pr-10 text-sm"
        />
        {busca && (
          <button onClick={() => setBusca('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* LISTA DE OPs */}
      {ops.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border-2 border-dashed border-blue-500/20 rounded-[32px]">
          <ShoppingBag className="h-16 w-16 text-blue-500/30" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Nenhum pedido registrado.</p>
          <Link href="/intelligence/vendas/novo-pedido">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase">
              <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Pedido
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-[32px] border border-blue-500/20 bg-zinc-950/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-blue-500/10 hover:bg-transparent bg-blue-950/20">
                {['Nº OP', 'Cliente', 'Vendedor', 'Supervisor', 'Entrega Prevista', 'Valor', 'Status', 'Ações'].map(h => (
                  <TableHead key={h} className="text-blue-400 font-black text-[10px] uppercase tracking-widest text-center py-4">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {opsFiltradas.map(op => {
                const st = statusConfig[op.status];
                return (
                  <TableRow key={op.id} className="border-blue-500/10 hover:bg-blue-950/10">
                    <TableCell className="text-center font-mono text-blue-300 text-xs font-bold">{op.numero}</TableCell>
                    <TableCell className="text-white font-bold text-sm uppercase">{op.cliente}</TableCell>
                    <TableCell className="text-center text-gray-400 text-xs">{op.vendedor}</TableCell>
                    <TableCell className="text-center text-gray-400 text-xs">{op.supervisor || '—'}</TableCell>
                    <TableCell className="text-center text-gray-400 text-xs">
                      {isoParaBR(op.dataEntregaPrevista)}
                    </TableCell>
                    <TableCell className="text-center font-black text-blue-400">
                      {op.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn('border bg-transparent text-[9px] font-black uppercase', st.color)}>
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/10 h-7 px-2 text-[10px] font-black uppercase"
                        onClick={() => setDetalheOP(op)}>
                        <Eye className="h-3 w-3 mr-1" /> Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <LegalSafeguard module="DANTE VENDAS" protocol="NX-7741-SLS" />

      {/* MODAL DETALHE OP */}
      <Dialog open={!!detalheOP} onOpenChange={o => !o && setDetalheOP(null)}>
        <DialogContent className="bg-zinc-950 border-blue-500/30 text-white max-w-3xl rounded-[40px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-400 font-black uppercase flex items-center gap-3 text-xl italic">
              <ClipboardList className="h-5 w-5" />
              {detalheOP?.numero}
            </DialogTitle>
          </DialogHeader>
          {detalheOP && (
            <div className="space-y-6 py-2">
              {/* CABEÇALHO */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Cliente', value: detalheOP.cliente },
                  { label: 'Vendedor', value: detalheOP.vendedor },
                  { label: 'Supervisor', value: detalheOP.supervisor || '—' },
                  { label: 'Data Venda', value: isoParaBR(detalheOP.dataVenda) },
                  { label: 'Entrega Prevista', value: isoParaBR(detalheOP.dataEntregaPrevista) },
                  { label: 'Valor Total', value: detalheOP.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">{f.label}</p>
                    <p className="text-white font-black text-sm mt-1 uppercase">{f.value}</p>
                  </div>
                ))}
              </div>

              {/* ITENS */}
              <div className="rounded-2xl border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent bg-white/5">
                      {['Produto', 'Qtd', 'Preço Unit.', 'Total'].map(h => (
                        <TableHead key={h} className="text-[10px] font-black uppercase tracking-widest text-blue-400 text-center py-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalheOP.itens.map((item, idx) => (
                      <TableRow key={idx} className="border-white/5 hover:bg-blue-950/10">
                        <TableCell className="text-white font-bold text-sm uppercase">{item.produtoNome}</TableCell>
                        <TableCell className="text-center font-black text-blue-400 text-lg">{item.quantidade}</TableCell>
                        <TableCell className="text-center text-gray-400 text-sm">{item.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell className="text-center font-black text-blue-400">{(item.quantidade * item.precoUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* MATERIAIS CONSOLIDADOS */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Materiais Necessários (Lista Explodida)</p>
                <div className="rounded-2xl border border-white/5 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent bg-white/5">
                        {['Material', 'Qtd Total', 'Unidade'].map(h => (
                          <TableHead key={h} className="text-[10px] font-black uppercase tracking-widest text-blue-400 text-center py-3">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const consolidado: Record<string, { qtd: number; unidade: string }> = {};
                        detalheOP.itens.forEach(item => {
                          item.materiais.forEach(mat => {
                            const key = mat.descricao;
                            if (!consolidado[key]) consolidado[key] = { qtd: 0, unidade: mat.unidade };
                            consolidado[key].qtd += mat.quantidade * item.quantidade;
                          });
                        });
                        return Object.entries(consolidado).map(([desc, { qtd, unidade }], i) => (
                          <TableRow key={i} className="border-white/5 hover:bg-blue-950/10">
                            <TableCell className="text-white font-bold text-sm uppercase">{desc}</TableCell>
                            <TableCell className="text-center font-black text-blue-400 text-lg">{qtd}</TableCell>
                            <TableCell className="text-center text-gray-400 text-xs">{unidade}</TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {detalheOP.observacoes && (
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1">Observações</p>
                  <p className="text-gray-300 text-sm">{detalheOP.observacoes}</p>
                </div>
              )}

              {/* AÇÕES DE STATUS */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Atualizar Status</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(statusConfig) as StatusOP[]).filter(s => s !== detalheOP.status).map(s => {
                    const st = statusConfig[s];
                    return (
                      <Button key={s} size="sm" variant="outline"
                        className={cn('border text-[10px] font-black uppercase rounded-xl', st.color)}
                        onClick={() => { atualizarStatusOP(detalheOP.id, s); setDetalheOP({ ...detalheOP, status: s }); }}>
                        {st.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" className="border-white/10 text-gray-400 rounded-2xl" onClick={() => setDetalheOP(null)}>Fechar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </SovereignShowcase>
  );
}
