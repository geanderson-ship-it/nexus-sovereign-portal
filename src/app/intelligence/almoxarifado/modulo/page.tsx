'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft, ArrowDownCircle, ArrowUpCircle,
  CheckCircle, Plus, Trash2, ClipboardList, Search, FileText, X, Lock, AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { useAlmoxarifado } from '@/lib/almoxarifado/store';

type Aba = 'entrada' | 'saida';

interface ItemLinha {
  id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  observacao: string;
}

interface Registro {
  id: string;
  tipo: Aba;
  data: string;
  responsavel: string;
  documento: string;
  valorNota?: number;
  responsavelArmazenamento: string;
  entreguePor: string;
  itens: ItemLinha[];
  confirmado: boolean;
}

const linhaVazia = (): ItemLinha => ({
  id: crypto.randomUUID(),
  codigo: '',
  descricao: '',
  quantidade: 0,
  unidade: 'UN',
  observacao: '',
});

function ModuloContent({ abaInicial }: { abaInicial: Aba }) {
  const { aplicarNota } = useAlmoxarifado();
  const router = useRouter();
  const [aba] = useState<Aba>(abaInicial);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [detalheAberto, setDetalheAberto] = useState<Registro | null>(null);
  const [pendente, setPendente] = useState<Omit<Registro, 'id' | 'confirmado'> | null>(null);
  const [busca, setBusca] = useState('');

  const [data, setData] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [documento, setDocumento] = useState('');
  const [valorNota, setValorNota] = useState('');
  const [responsavelArmazenamento, setResponsavelArmazenamento] = useState('');
  const [entreguePor, setEntreguePor] = useState('');
  const [buscaItem, setBuscaItem] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [itens, setItens] = useState<ItemLinha[]>([linhaVazia()]);

  const isEntrada = aba === 'entrada';

  const addLinha = () => setItens(prev => [...prev, linhaVazia()]);
  const removeLinha = (id: string) => {
    if (itens.length === 1) return;
    setItens(prev => prev.filter(i => i.id !== id));
  };
  const updateLinha = (id: string, field: keyof ItemLinha, value: string | number) =>
    setItens(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const resetForm = () => {
    setData(''); setResponsavel(''); setDocumento('');
    setValorNota(''); setResponsavelArmazenamento(''); setEntreguePor('');
    setItens([linhaVazia()]);
  };

  const salvar = () => {
    const itensValidos = itens.filter(i => i.descricao.trim() !== '' && i.quantidade > 0);
    if (!data || !responsavel || itensValidos.length === 0) return;
    setPendente({
      tipo: aba, data, responsavel, documento,
      valorNota: isEntrada ? parseFloat(valorNota.replace(',', '.')) || undefined : undefined,
      responsavelArmazenamento, entreguePor,
      itens: itensValidos,
    });
  };

  const confirmar = () => {
    if (!pendente) return;
    setRegistros(prev => [{ ...pendente, id: crypto.randomUUID(), confirmado: true }, ...prev]);
    aplicarNota(
      pendente.tipo,
      pendente.itens.map(i => ({ descricao: i.descricao, codigo: i.codigo, quantidade: i.quantidade })),
      pendente.data, pendente.responsavel, pendente.documento
    );
    setPendente(null);
    resetForm();
    router.push('/intelligence/almoxarifado');
  };

  const excluirRegistro = (id: string) =>
    setRegistros(prev => prev.filter(r => r.id !== id));

  const corClass = isEntrada
    ? { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-600 hover:bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
    : { border: 'border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-600 hover:bg-rose-500', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };

  const registrosFiltrados = useMemo(() => {
    const porAba = registros.filter(r => r.tipo === aba);
    return porAba.filter(r => {
      const q = busca.toLowerCase();
      const matchBusca = !busca.trim() ||
        r.documento.toLowerCase().includes(q) ||
        r.responsavel.toLowerCase().includes(q) ||
        r.responsavelArmazenamento.toLowerCase().includes(q) ||
        r.entreguePor.toLowerCase().includes(q) ||
        r.itens.some(i => i.descricao.toLowerCase().includes(q) || i.codigo.toLowerCase().includes(q));
      const matchInicio = !filtroDataInicio || r.data >= filtroDataInicio;
      const matchFim = !filtroDataFim || r.data <= filtroDataFim;
      return matchBusca && matchInicio && matchFim;
    });
  }, [registros, aba, busca, filtroDataInicio, filtroDataFim]);

  const totalValor = registrosFiltrados.reduce((acc, r) => acc + (r.valorNota || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-10 font-sans">

      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <Link href="/intelligence/almoxarifado">
          <div className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {isEntrada
              ? <ArrowDownCircle className="h-6 w-6 text-emerald-400" />
              : <ArrowUpCircle className="h-6 w-6 text-rose-400" />}
            <h1 className={cn('text-2xl font-black uppercase tracking-tight font-headline italic', isEntrada ? 'text-emerald-400' : 'text-rose-400')}>
              {isEntrada ? 'Registrar Entrada' : 'Registrar SaÃ­da'}
            </h1>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest italic">
            {isEntrada ? 'Recebimento de materiais e notas fiscais' : 'RequisiÃ§Ãµes, ordens de produÃ§Ã£o e entregas'}
          </p>
        </div>
      </div>

      {/* FORMULÃRIO */}
      <div className={cn('rounded-[32px] border p-8 space-y-6 bg-zinc-950/60', corClass.border)}>
        <p className={cn('text-[10px] font-black uppercase tracking-[0.3em]', corClass.text)}>
          {isEntrada ? 'â€” Registrar Entrada de Material' : 'â€” Registrar SaÃ­da de Material'}
        </p>

        {/* LINHA 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className={cn('text-[10px] font-black uppercase tracking-widest', corClass.text)}>Data</Label>
            <Input type="date" value={data} onChange={e => setData(e.target.value)}
              className={cn('bg-black/40 text-white h-11 rounded-xl border', corClass.border)} />
          </div>
          <div className="space-y-1">
            <Label className={cn('text-[10px] font-black uppercase tracking-widest', corClass.text)}>
              {isEntrada ? 'ResponsÃ¡vel' : 'Requisitante (quem pediu a OP)'}
            </Label>
            <Input placeholder={isEntrada ? 'Nome do responsÃ¡vel' : 'Nome do requisitante'} value={responsavel} onChange={e => setResponsavel(e.target.value.toUpperCase())}
              className={cn('bg-black/40 text-white h-11 rounded-xl border uppercase', corClass.border)} />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              {isEntrada ? 'Nota Fiscal / Documento' : 'RequisiÃ§Ã£o / OP'}
            </Label>
            <Input placeholder={isEntrada ? 'Ex: NF-001234' : 'Ex: OP-042'} value={documento}
              onChange={e => setDocumento(e.target.value.toUpperCase())}
              className="bg-black/40 text-white h-11 rounded-xl border border-white/10 uppercase font-mono" />
          </div>
        </div>

        {/* LINHA 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEntrada ? (
            <div className="space-y-1">
              <Label className={cn('text-[10px] font-black uppercase tracking-widest', corClass.text)}>Valor da Nota (R$)</Label>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={valorNota}
                onChange={e => {
                  const v = e.target.value.replace(/[^0-9,]/g, '');
                  if (v.split(',').length <= 2) setValorNota(v);
                }}
                className={cn('bg-black/40 text-white h-11 rounded-xl border font-black text-lg', corClass.border)}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-rose-400">Entregue por</Label>
              <Input placeholder="Nome de quem entregou" value={responsavelArmazenamento}
                onChange={e => setResponsavelArmazenamento(e.target.value.toUpperCase())}
                className="bg-black/40 text-white h-11 rounded-xl border border-rose-500/30 uppercase" />
            </div>
          )}
          {isEntrada ? (
            <div className="space-y-1">
              <Label className={cn('text-[10px] font-black uppercase tracking-widest', corClass.text)}>ResponsÃ¡vel pelo Armazenamento</Label>
              <Input placeholder="Nome de quem armazenou" value={responsavelArmazenamento}
                onChange={e => setResponsavelArmazenamento(e.target.value.toUpperCase())}
                className={cn('bg-black/40 text-white h-11 rounded-xl border uppercase', corClass.border)} />
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-rose-400">ResponsÃ¡vel pela Entrega</Label>
              <Input placeholder="Nome de quem entregou" value={entreguePor}
                onChange={e => setEntreguePor(e.target.value.toUpperCase())}
                className="bg-black/40 text-white h-11 rounded-xl border border-rose-500/30 uppercase" />
            </div>
          )}
        </div>

        {/* PESQUISA DE ITEM â€” sÃ³ na saÃ­da */}
        {!isEntrada && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400/50" />
            <Input
              placeholder="Pesquisar item para adicionar na saÃ­da..."
              value={buscaItem}
              onChange={e => setBuscaItem(e.target.value)}
              className="bg-black/40 border-rose-500/20 text-white h-12 rounded-2xl pl-11 pr-10 text-sm"
            />
            {buscaItem && (
              <button onClick={() => setBuscaItem('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
            {buscaItem.trim().length > 0 && (
              <div className="absolute top-14 left-0 w-full bg-zinc-950 border border-rose-500/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {itens.filter(i => i.descricao.toLowerCase().includes(buscaItem.toLowerCase()) || i.codigo.toLowerCase().includes(buscaItem.toLowerCase())).length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-xs uppercase tracking-widest">Nenhum item encontrado</div>
                ) : (
                  itens
                    .filter(i => i.descricao.toLowerCase().includes(buscaItem.toLowerCase()) || i.codigo.toLowerCase().includes(buscaItem.toLowerCase()))
                    .map(i => (
                      <button key={i.id}
                        className="w-full flex items-center justify-between px-5 py-3 hover:bg-rose-500/10 transition-colors text-left border-b border-white/5 last:border-0"
                        onClick={() => {
                          setItens(prev => [
                            ...prev.filter(x => !(x.descricao === '' && x.quantidade === 0)),
                            { ...i, id: crypto.randomUUID(), quantidade: 0 }
                          ]);
                          setBuscaItem('');
                        }}
                      >
                        <div>
                          <p className="text-white font-bold text-sm uppercase">{i.descricao}</p>
                          <p className="text-gray-500 text-xs font-mono">{i.codigo || 'S/CÃ“D'}</p>
                        </div>
                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[9px] font-black">+ Adicionar</Badge>
                      </button>
                    ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ITENS */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-3 px-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
            <div className="col-span-2">CÃ³digo</div>
            <div className="col-span-4">DescriÃ§Ã£o</div>
            <div className="col-span-2 text-center">Quantidade</div>
            <div className="col-span-1 text-center">Unidade</div>
            <div className="col-span-2">ObservaÃ§Ã£o</div>
            <div className="col-span-1" />
          </div>
          {itens.map(item => (
            <div key={item.id} className={cn('grid grid-cols-12 gap-3 items-center p-3 rounded-2xl border bg-black/30', corClass.border)}>
              <div className="col-span-2">
                <Input placeholder="ALM-001" value={item.codigo} onChange={e => updateLinha(item.id, 'codigo', e.target.value.toUpperCase())}
                  className="bg-black/60 border-white/10 text-white h-9 rounded-xl text-center font-mono text-xs uppercase" />
              </div>
              <div className="col-span-4">
                <Input placeholder="DescriÃ§Ã£o do item..." value={item.descricao} onChange={e => updateLinha(item.id, 'descricao', e.target.value.toUpperCase())}
                  className="bg-black/60 border-white/10 text-white h-9 rounded-xl text-sm uppercase" />
              </div>
              <div className="col-span-2">
                <Input type="number" min={1} value={item.quantidade || ''} onChange={e => updateLinha(item.id, 'quantidade', Number(e.target.value))}
                  className={cn('bg-black/60 border-white/10 h-9 rounded-xl text-center font-black text-sm', corClass.text)} />
              </div>
              <div className="col-span-1">
                <Input placeholder="UN" value={item.unidade} onChange={e => updateLinha(item.id, 'unidade', e.target.value.toUpperCase())}
                  className="bg-black/60 border-white/10 text-gray-400 h-9 rounded-xl text-center text-xs uppercase" />
              </div>
              <div className="col-span-2">
                <Input placeholder="Obs..." value={item.observacao} onChange={e => updateLinha(item.id, 'observacao', e.target.value.toUpperCase())}
                  className="bg-black/60 border-white/10 text-gray-400 h-9 rounded-xl text-xs" />
              </div>
              <div className="col-span-1 flex justify-center">
                <Button size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-9 w-9 p-0" onClick={() => removeLinha(item.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" className={cn('text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-xl hover:bg-white/5', corClass.text)} onClick={addLinha}>
            <Plus className="mr-2 h-3 w-3" /> Adicionar Item
          </Button>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/5">
          <Button className={cn('font-black uppercase tracking-widest px-10 h-12 rounded-2xl text-white', corClass.bg)}
            onClick={salvar}
            disabled={!data || !responsavel || itens.filter(i => i.descricao && i.quantidade > 0).length === 0}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Salvar {isEntrada ? 'Entrada' : 'SaÃ­da'}
          </Button>
        </div>
      </div>

      {/* HISTÃ“RICO */}
      {registros.filter(r => r.tipo === aba).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-3 w-3 text-gray-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                {isEntrada ? 'Recebimentos' : 'SaÃ­das'} â€” {registrosFiltrados.length} nota(s)
              </p>
              {isEntrada && totalValor > 0 && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-black text-xs ml-2">
                  Total: {totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {!isEntrada && (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filtroDataInicio}
                    onChange={e => setFiltroDataInicio(e.target.value)}
                    className="bg-black/40 border-white/10 text-white h-9 rounded-xl text-xs w-36"
                  />
                  <span className="text-gray-600 text-xs">atÃ©</span>
                  <Input
                    type="date"
                    value={filtroDataFim}
                    onChange={e => setFiltroDataFim(e.target.value)}
                    className="bg-black/40 border-white/10 text-white h-9 rounded-xl text-xs w-36"
                  />
                  {(filtroDataInicio || filtroDataFim) && (
                    <button onClick={() => { setFiltroDataInicio(''); setFiltroDataFim(''); }} className="text-gray-500 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
                <Input
                  placeholder={isEntrada ? 'Pesquisar item, NF, responsÃ¡vel...' : 'Pesquisar item, OP, requisitante, entregue por...'}
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  className="bg-black/40 border-white/10 text-white h-9 rounded-xl pl-8 pr-8 text-xs w-80"
                />
                {busca && (
                  <button onClick={() => setBusca('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/5 bg-zinc-950/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent bg-white/5">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500 py-4 pl-6">Data</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Documento</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">ResponsÃ¡vel</TableHead>
                  {isEntrada
                    ? <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Armazenamento</TableHead>
                    : <>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Requisitante</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Entregue por</TableHead>
                      </>
                  }
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Itens</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Primeiro Item</TableHead>
                  {isEntrada && <TableHead className="text-[10px] font-black uppercase tracking-widest text-emerald-500 text-right pr-6">Valor NF</TableHead>}
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">AÃ§Ãµes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosFiltrados.map(reg => (
                  <TableRow key={reg.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="text-white font-bold text-sm pl-6">
                      {reg.data.split('-').reverse().join('/')}
                    </TableCell>
                    <TableCell>
                      {reg.documento
                        ? <Badge className={cn('border font-mono text-[9px]', corClass.badge)}>{reg.documento}</Badge>
                        : <span className="text-gray-600 text-xs">â€”</span>}
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm font-bold uppercase">{reg.responsavel}</TableCell>
                    {isEntrada
                      ? <TableCell className="text-gray-500 text-xs">{reg.responsavelArmazenamento || 'â€”'}</TableCell>
                      : <>
                          <TableCell className="text-gray-500 text-xs">{reg.responsavelArmazenamento || 'â€”'}</TableCell>
                          <TableCell className="text-gray-500 text-xs">{reg.entreguePor || 'â€”'}</TableCell>
                        </>
                    }
                    <TableCell className="text-center">
                      <Badge className="bg-white/5 text-gray-400 border-white/10 font-black text-xs">{reg.itens.length}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-300 text-xs max-w-[180px] truncate">
                      {reg.itens[0]?.descricao || 'â€”'}
                      {reg.itens.length > 1 && <span className="text-gray-600 ml-1">+{reg.itens.length - 1}</span>}
                    </TableCell>
                    {isEntrada && (
                      <TableCell className="text-right pr-6 font-black text-emerald-400">
                        {reg.valorNota ? reg.valorNota.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'â€”'}
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="ghost"
                          className={cn('h-7 px-3 text-[10px] font-black uppercase rounded-xl hover:bg-white/5', corClass.text)}
                          onClick={() => setDetalheAberto(reg)}>
                          <FileText className="mr-1 h-3 w-3" /> Detalhar
                        </Button>
                        <Button size="sm" variant="ghost"
                          className={cn('h-7 w-7 p-0 rounded-xl', reg.confirmado ? 'text-gray-700 cursor-not-allowed' : 'text-rose-400 hover:bg-rose-500/10')}
                          onClick={() => !reg.confirmado && excluirRegistro(reg.id)}
                          title={reg.confirmado ? 'Registro confirmado â€” imutÃ¡vel' : 'Excluir'}>
                          {reg.confirmado ? <Lock className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <LegalSafeguard module="DANTE ALMOXARIFADO" protocol="NX-7731-STK" />

      {/* MODAL CONFIRMAÃ‡ÃƒO */}
      <Dialog open={!!pendente} onOpenChange={o => !o && setPendente(null)}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-lg rounded-[40px]">
          <DialogHeader>
            <DialogTitle className="text-amber-400 font-black uppercase flex items-center gap-3 text-xl italic">
              <AlertTriangle className="h-5 w-5" />
              AtenÃ§Ã£o â€” Confirmar Registro
            </DialogTitle>
          </DialogHeader>
          {pendente && (
            <div className="space-y-5 py-2">
              {/* AVISO */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-amber-300 text-sm leading-relaxed">
                  <strong>ApÃ³s a confirmaÃ§Ã£o, este registro nÃ£o poderÃ¡ ser editado ou excluÃ­do.</strong> Confira todas as informaÃ§Ãµes antes de prosseguir.
                </p>
              </div>

              {/* RESUMO */}
              <div className="space-y-2">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Resumo do Registro</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Tipo', value: pendente.tipo === 'entrada' ? 'â¬‡ï¸ Entrada' : 'â¬†ï¸ SaÃ­da' },
                    { label: 'Data', value: pendente.data.split('-').reverse().join('/') },
                    { label: 'ResponsÃ¡vel', value: pendente.responsavel },
                    { label: pendente.tipo === 'entrada' ? 'Documento' : 'RequisiÃ§Ã£o', value: pendente.documento || 'â€”' },
                    ...(pendente.tipo === 'entrada' && pendente.valorNota ? [{ label: 'Valor NF', value: pendente.valorNota.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }] : []),
                  ].map((f, i) => (
                    <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <p className="text-[9px] text-gray-600 uppercase tracking-widest">{f.label}</p>
                      <p className="text-white font-black text-xs uppercase mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Itens ({pendente.itens.length})</p>
                  <div className="max-h-[35vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-500/20">
                    {pendente.itens.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                        <span className="text-white text-xs font-bold uppercase">{item.descricao}</span>
                        <span className={cn('font-black text-sm', pendente.tipo === 'entrada' ? 'text-emerald-400' : 'text-rose-400')}>
                          {pendente.tipo === 'entrada' ? '+' : '-'}{item.quantidade} {item.unidade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-white/5">
                <Button variant="outline" className="flex-1 border-zinc-700 text-gray-400 rounded-2xl" onClick={() => setPendente(null)}>
                  Voltar e Revisar
                </Button>
                <Button
                  className={cn('flex-1 font-black uppercase tracking-widest rounded-2xl text-white', pendente.tipo === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500')}
                  onClick={confirmar}>
                  <Lock className="mr-2 h-4 w-4" />
                  Confirmar e Bloquear
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL DETALHAR */}
      <Dialog open={!!detalheAberto} onOpenChange={o => !o && setDetalheAberto(null)}>
        <DialogContent className="bg-zinc-950 border-emerald-500/30 text-white max-w-3xl rounded-[40px]">
          <DialogHeader>
            <DialogTitle className="text-emerald-400 font-black uppercase flex items-center gap-3 text-xl italic">
              <FileText className="h-5 w-5" />
              Detalhe â€” {detalheAberto?.documento || 'S/N'}
            </DialogTitle>
          </DialogHeader>
          {detalheAberto && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Data', value: detalheAberto.data.split('-').reverse().join('/') },
                  { label: 'ResponsÃ¡vel', value: detalheAberto.responsavel },
                  { label: detalheAberto.tipo === 'entrada' ? 'Armazenamento' : 'Requisitante', value: detalheAberto.responsavelArmazenamento || 'â€”' },
                  ...(detalheAberto.tipo === 'saida'
                    ? [{ label: 'Entregue por', value: detalheAberto.entreguePor || 'â€”' }]
                    : [{ label: 'Valor NF', value: detalheAberto.valorNota ? detalheAberto.valorNota.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'â€”' }]
                  ),
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">{f.label}</p>
                    <p className="text-white font-black text-sm mt-1 uppercase">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent bg-white/5">
                      {['#', 'CÃ³digo', 'DescriÃ§Ã£o', 'Qtd', 'Unidade', 'Obs'].map(h => (
                        <TableHead key={h} className="text-[10px] font-black uppercase tracking-widest text-emerald-400 text-center py-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalheAberto.itens.map((item, idx) => (
                      <TableRow key={item.id} className="border-white/5 hover:bg-emerald-950/10">
                        <TableCell className="text-center text-gray-600 text-xs">{idx + 1}</TableCell>
                        <TableCell className="text-center font-mono text-xs text-gray-400">{item.codigo || 'â€”'}</TableCell>
                        <TableCell className="text-white font-bold text-sm uppercase">{item.descricao}</TableCell>
                        <TableCell className="text-center font-black text-emerald-400 text-lg">{item.quantidade}</TableCell>
                        <TableCell className="text-center text-gray-500 text-xs">{item.unidade}</TableCell>
                        <TableCell className="text-center text-gray-500 text-xs">{item.observacao || 'â€”'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="border-white/10 text-gray-400 rounded-2xl" onClick={() => setDetalheAberto(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ModuloWrapper() {
  const searchParams = useSearchParams();
  const aba = searchParams?.get('aba') === 'saida' ? 'saida' : 'entrada';
  return <ModuloContent abaInicial={aba as Aba} />;
}

export default function AlmoxarifadoModuloPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ModuloWrapper />
    </Suspense>
  );
}

