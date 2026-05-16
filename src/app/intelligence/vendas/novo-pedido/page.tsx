'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Plus, Trash2, Search, X, Package, CheckCircle, ShoppingBag, AlertTriangle, Lock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { useVendas, type Produto } from '@/lib/vendas/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ItemPedido {
  produto: Produto;
  quantidade: number;
}

export default function NovoPedidoPage() {
  const { produtos, criarOP } = useVendas();
  const router = useRouter();

  const [cliente, setCliente] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [dataVenda, setDataVenda] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');

  const maskData = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 8);
    if (nums.length <= 2) return nums;
    if (nums.length <= 4) return `${nums.slice(0,2)}/${nums.slice(2)}`;
    return `${nums.slice(0,2)}/${nums.slice(2,4)}/${nums.slice(4)}`;
  };

  const dataParaISO = (br: string) => {
    const [d, m, a] = br.split('/');
    if (!d || !m || !a || a.length < 4) return '';
    return `${a}-${m}-${d}`;
  };

  const isoParaBR = (iso: string) => {
    if (!iso) return '';
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
  };
  const [observacoes, setObservacoes] = useState('');
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [confirmando, setConfirmando] = useState(false);

  const produtosFiltrados = useMemo(() => {
    if (!buscaProduto.trim()) return produtos;
    const q = buscaProduto.toLowerCase();
    return produtos.filter(p => p.nome.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q));
  }, [produtos, buscaProduto]);

  const adicionarProduto = (produto: Produto) => {
    const existe = itens.find(i => i.produto.id === produto.id);
    if (existe) {
      setItens(prev => prev.map(i => i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i));
    } else {
      setItens(prev => [...prev, { produto, quantidade: 1 }]);
    }
    setBuscaProduto('');
  };

  const removerItem = (id: string) => setItens(prev => prev.filter(i => i.produto.id !== id));
  const updateQtd = (id: string, qtd: number) => setItens(prev => prev.map(i => i.produto.id === id ? { ...i, quantidade: Math.max(1, qtd) } : i));

  const valorTotal = itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);

  const podeSalvar = cliente && vendedor && dataVenda.length === 10 && dataEntrega.length === 10 && itens.length > 0;

  const confirmar = () => {
    if (!podeSalvar) return;
    const op = criarOP({
      cliente, vendedor, supervisor, dataVenda: dataParaISO(dataVenda), dataEntregaPrevista: dataParaISO(dataEntrega),
      observacoes, valorTotal,
      itens: itens.map(i => ({
        produtoId: i.produto.id,
        produtoNome: i.produto.nome,
        produtoCodigo: i.produto.codigo,
        quantidade: i.quantidade,
        precoUnitario: i.produto.preco,
        materiais: i.produto.materiais,
      })),
    });
    setConfirmando(false);
    router.push('/intelligence/vendas');
  };

  // Materiais consolidados para preview
  const materiaisConsolidados = useMemo(() => {
    const consolidado: Record<string, { qtd: number; unidade: string }> = {};
    itens.forEach(item => {
      item.produto.materiais.forEach(mat => {
        if (!consolidado[mat.descricao]) consolidado[mat.descricao] = { qtd: 0, unidade: mat.unidade };
        consolidado[mat.descricao].qtd += mat.quantidade * item.quantidade;
      });
    });
    return Object.entries(consolidado);
  }, [itens]);

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8 font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-blue-500/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/intelligence/vendas">
            <div className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
              <ArrowLeft className="h-5 w-5 text-blue-400" />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight text-blue-400 font-headline italic">Novo Pedido</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest italic">Selecione os produtos e gere a OP</p>
          </div>
        </div>
      </div>

      {/* DADOS DO PEDIDO */}
      <div className="rounded-[32px] border border-blue-500/20 bg-zinc-950/60 p-8 space-y-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">— Dados do Pedido</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1 md:col-span-3">
            <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Cliente</Label>
            <Input placeholder="Nome do cliente / empresa" value={cliente} onChange={e => setCliente(e.target.value)}
              className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl uppercase" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Vendedor</Label>
            <Input placeholder="Nome do vendedor" value={vendedor} onChange={e => setVendedor(e.target.value)}
              className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl uppercase" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Supervisor / Gerente (opcional)</Label>
            <Input placeholder="Nome do supervisor" value={supervisor} onChange={e => setSupervisor(e.target.value)}
              className="bg-black/40 border-white/10 text-white h-11 rounded-xl uppercase" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Data da Venda</Label>
            <div className="relative">
              <Input
                placeholder="DD/MM/AAAA"
                value={dataVenda}
                onChange={e => setDataVenda(maskData(e.target.value))}
                className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl text-center font-mono tracking-widest pr-10"
              />
              <div className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-400/50 pointer-events-none absolute" />
                <input
                  type="date"
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  onChange={e => e.target.value && setDataVenda(isoParaBR(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">
              Data de Entrega Prevista
            </Label>
            <div className="relative">
              <Input
                placeholder="DD/MM/AAAA"
                value={dataEntrega}
                onChange={e => setDataEntrega(maskData(e.target.value))}
                className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl text-center font-mono tracking-widest pr-10"
              />
              <div className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-400/50 pointer-events-none absolute" />
                <input
                  type="date"
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  onChange={e => e.target.value && setDataEntrega(isoParaBR(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1 md:col-span-3">
            <Label className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Observações (opcional)</Label>
            <Input placeholder="Instruções especiais, condições de pagamento..." value={observacoes} onChange={e => setObservacoes(e.target.value)}
              className="bg-black/40 border-white/10 text-white h-11 rounded-xl" />
          </div>
        </div>
      </div>

      {/* SELEÇÃO DE PRODUTOS */}
      <div className="rounded-[32px] border border-blue-500/20 bg-zinc-950/60 p-8 space-y-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">— Produtos do Pedido</p>

        {/* BUSCA DO CATÁLOGO */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
          <Input placeholder="Buscar produto no catálogo..." value={buscaProduto} onChange={e => setBuscaProduto(e.target.value)}
            className="bg-black/40 border-blue-500/20 text-white h-12 rounded-2xl pl-11 pr-10 text-sm" />
          {buscaProduto && <button onClick={() => setBuscaProduto('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X className="h-4 w-4" /></button>}

          {/* DROPDOWN DO CATÁLOGO */}
          {buscaProduto.trim().length > 0 && (
            <div className="absolute top-14 left-0 w-full bg-zinc-950 border border-blue-500/20 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
              {produtosFiltrados.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-xs uppercase tracking-widest">Nenhum produto encontrado</div>
              ) : produtosFiltrados.map(p => (
                <button key={p.id} className="w-full flex items-center justify-between px-5 py-3 hover:bg-blue-500/10 transition-colors text-left border-b border-white/5 last:border-0"
                  onClick={() => adicionarProduto(p)}>
                  <div className="flex items-center gap-3">
                    {p.imagem ? <img src={p.imagem} alt={p.nome} className="h-10 w-10 object-contain rounded-lg bg-zinc-900" /> : <Package className="h-8 w-8 text-blue-500/30" />}
                    <div>
                      <p className="text-white font-bold text-sm uppercase">{p.nome}</p>
                      <p className="text-gray-500 text-xs font-mono">{p.codigo} · {p.materiais.length} materiais</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-black">{p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px]">+ Adicionar</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ITENS SELECIONADOS */}
        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 border border-dashed border-blue-500/20 rounded-2xl">
            <ShoppingBag className="h-10 w-10 text-blue-500/20" />
            <p className="text-gray-600 text-xs uppercase tracking-widest">Busque e adicione produtos acima</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-blue-500/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-500/10 hover:bg-transparent bg-blue-950/20">
                  {['Produto', 'Código', 'Qtd', 'Preço Unit.', 'Total', ''].map(h => (
                    <TableHead key={h} className="text-blue-400 font-black text-[10px] uppercase tracking-widest text-center py-3">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map(item => (
                  <TableRow key={item.produto.id} className="border-blue-500/10 hover:bg-blue-950/10">
                    <TableCell className="text-white font-bold text-sm uppercase">{item.produto.nome}</TableCell>
                    <TableCell className="text-center font-mono text-blue-300 text-xs">{item.produto.codigo}</TableCell>
                    <TableCell className="text-center">
                      <Input type="number" min={1} value={item.quantidade} onChange={e => updateQtd(item.produto.id, Number(e.target.value))}
                        className="bg-black/40 border-blue-500/20 text-blue-400 h-8 w-16 rounded-lg text-center font-black mx-auto" />
                    </TableCell>
                    <TableCell className="text-center text-gray-400 text-sm">{item.produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell className="text-center font-black text-blue-400">{(item.produto.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-7 w-7 p-0" onClick={() => removerItem(item.produto.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 bg-blue-950/20 border-t border-blue-500/10 flex justify-end">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Valor Total</p>
                <p className="text-2xl font-black text-blue-400">{valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </div>
          </div>
        )}

        {/* MATERIAIS PREVIEW */}
        {materiaisConsolidados.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Lista Explodida de Materiais</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {materiaisConsolidados.map(([desc, { qtd, unidade }], i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 border border-blue-500/10 text-center">
                  <p className="text-white font-bold text-xs uppercase truncate">{desc}</p>
                  <p className="text-blue-400 font-black text-lg">{qtd} <span className="text-xs text-gray-500">{unidade}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-white/5">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-10 h-12 rounded-2xl"
            onClick={() => setConfirmando(true)} disabled={!podeSalvar}>
            <CheckCircle className="mr-2 h-4 w-4" /> Gerar Ordem de Produção
          </Button>
        </div>
      </div>

      <LegalSafeguard module="DANTE VENDAS" protocol="NX-7741-SLS" />

      {/* MODAL CONFIRMAÇÃO */}
      <Dialog open={confirmando} onOpenChange={o => !o && setConfirmando(false)}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-lg rounded-[40px]">
          <DialogHeader>
            <DialogTitle className="text-amber-400 font-black uppercase flex items-center gap-3 text-xl italic">
              <AlertTriangle className="h-5 w-5" /> Confirmar Ordem de Produção
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-300 text-sm leading-relaxed">
                <strong>Após confirmar, a OP será gerada e enviada para o PPCP.</strong> Confira todas as informações antes de prosseguir.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Cliente', value: cliente },
                { label: 'Vendedor', value: vendedor },
                { label: 'Entrega Prevista', value: dataEntrega },
                { label: 'Valor Total', value: valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
              ].map((f, i) => (
                <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest">{f.label}</p>
                  <p className="text-white font-black text-xs uppercase mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Produtos ({itens.length})</p>
              {itens.map((item, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="text-white text-xs font-bold uppercase">{item.produto.nome}</span>
                  <span className="text-blue-400 font-black text-sm">{item.quantidade}x</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2 border-t border-white/5">
              <Button variant="outline" className="flex-1 border-zinc-700 text-gray-400 rounded-2xl" onClick={() => setConfirmando(false)}>
                Voltar e Revisar
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl" onClick={confirmar}>
                <Lock className="mr-2 h-4 w-4" /> Confirmar e Gerar OP
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
