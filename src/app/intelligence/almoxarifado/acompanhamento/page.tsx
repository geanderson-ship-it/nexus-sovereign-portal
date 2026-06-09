'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Search, AlertTriangle, CheckCircle, Package, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { useAlmoxarifado } from '@/lib/almoxarifado/store';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function AcompanhamentoEstoque() {
  const { itens } = useAlmoxarifado();
  const [aba, setAba] = useState<'inventario' | 'entradas' | 'saidas' | 'ruptura' | 'curvaABC'>('inventario');
  const [busca, setBusca] = useState('');
  const [filtroCritico, setFiltroCritico] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qAba = params.get('aba') as 'inventario' | 'entradas' | 'saidas';
      if (qAba) {
        const qBusca = params.get('q');
        if (qBusca) setBusca(qBusca);
        setAba(qAba);
        if (qAba === 'inventario' && params.get('critico') === 'true') {
          setFiltroCritico(true);
        }
      }
    }
  }, []);

  // Processamento de Dados
  const inventarioFiltrado = useMemo(() => {
    let result = itens;
    if (filtroCritico) {
      result = result.filter(item => item.estoqueAtual <= item.estoqueMinimo);
    }
    const termo = busca.toLowerCase();
    return result.filter(item => {
      const matchBasico = item.descricao.toLowerCase().includes(termo) || 
                          item.codigo.toLowerCase().includes(termo);
      const matchNF = item.movimentos?.some(m => (m.observacao || '').toLowerCase().includes(termo));
      return matchBasico || matchNF;
    }).sort((a, b) => {
      const aCritico = a.estoqueAtual <= a.estoqueMinimo ? -1 : 1;
      const bCritico = b.estoqueAtual <= b.estoqueMinimo ? -1 : 1;
      return aCritico - bCritico; // Críticos primeiro
    });
  }, [itens, busca, filtroCritico]);

  const { todasEntradas, todasSaidas } = useMemo(() => {
    const listEntradas: any[] = [];
    const listSaidas: any[] = [];
    
    itens.forEach(item => {
      item.movimentos?.forEach(mov => {
        const payload = { 
          ...mov, 
          codigo: item.codigo, 
          descricao: item.descricao, 
          unidade: item.unidade 
        };
        if (mov.tipo === 'entrada') listEntradas.push(payload);
        if (mov.tipo === 'saida') listSaidas.push(payload);
      });
    });
    
    // Ordenar por data decrescente
    listEntradas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    listSaidas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    
    // Filtrar por busca
    if (busca) {
      const filterFn = (mov: any) => 
        mov.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        mov.codigo.toLowerCase().includes(busca.toLowerCase()) ||
        (mov.observacao || '').toLowerCase().includes(busca.toLowerCase());
      return { 
        todasEntradas: listEntradas.filter(filterFn), 
        todasSaidas: listSaidas.filter(filterFn) 
      };
    }
    
    return { todasEntradas: listEntradas, todasSaidas: listSaidas };
  }, [itens, busca]);

  const stats = useMemo(() => {
    const itensCriticos = itens.filter(i => i.estoqueAtual <= i.estoqueMinimo).length;
    return {
      totalItens: itens.length,
      itensCriticos,
      totalEntradas: todasEntradas.length,
      totalSaidas: todasSaidas.length,
    };
  }, [itens, todasEntradas, todasSaidas]);

  // Inteligência (Ruptura e Curva ABC)
  const itensEnriquecidos = useMemo(() => {
    return inventarioFiltrado.map(item => {
      const totalSaidas = item.movimentos
        .filter(m => m.tipo === 'saida')
        .reduce((acc, m) => acc + m.quantidade, 0);
      const consumoMedioDiario = totalSaidas > 0 ? (totalSaidas / 30) : 0.5; // fallback simulado
      const diasRestantes = item.estoqueAtual / consumoMedioDiario;
      const valorTotal = item.estoqueAtual * (item.custoUnitario || 0);

      return {
        ...item,
        consumoMedioDiario,
        diasRestantes: Math.round(diasRestantes),
        valorTotal
      };
    });
  }, [inventarioFiltrado]);

  const itensCriticosIA = useMemo(() => itensEnriquecidos.filter(i => i.diasRestantes <= 15).sort((a, b) => a.diasRestantes - b.diasRestantes), [itensEnriquecidos]);

  const curvaABC = useMemo(() => {
    const ordenados = [...itensEnriquecidos].sort((a, b) => b.valorTotal - a.valorTotal);
    const valorTotalInventario = ordenados.reduce((acc, i) => acc + i.valorTotal, 0);
    let acumulado = 0;
    return ordenados.map(item => {
      acumulado += item.valorTotal;
      const pct = (acumulado / valorTotalInventario) * 100;
      let classe = 'C';
      if (pct <= 70) classe = 'A';
      else if (pct <= 90) classe = 'B';
      return { ...item, classeABC: classe };
    });
  }, [itensEnriquecidos]);

  const dadosGraficoABC = useMemo(() => [
    { name: 'Classe A (Alto Valor)', value: curvaABC.filter(i => i.classeABC === 'A').length, color: '#f59e0b' },
    { name: 'Classe B (Médio)', value: curvaABC.filter(i => i.classeABC === 'B').length, color: '#10b981' },
    { name: 'Classe C (Baixo/Consumo)', value: curvaABC.filter(i => i.classeABC === 'C').length, color: '#3b82f6' }
  ], [curvaABC]);

  return (
    <SovereignShowcase moduleName="Nexus Almoxarifado" imagePath="/Nexus Empresas/Dante Almoxarifado.png">
      <div className="min-h-screen bg-black text-white p-6 space-y-12 font-sans selection:bg-amber-500/30">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-8 gap-4">
          <div className="flex items-center gap-6">
            <Link href="/intelligence/almoxarifado">
              <div className="h-12 w-12 rounded-full border border-white/10 bg-black/50 flex items-center justify-center hover:bg-white/5 hover:scale-110 transition-all cursor-pointer group">
                <ArrowLeft className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </Link>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Acompanhamento
                </span>
              </h1>
              <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">
                Monitoramento de Inventário, Entradas e Pedidos Entregues
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500/50" />
            <Input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Pesquisar produto, código, NF ou OS..."
              className="w-full bg-amber-950/20 border-amber-500/30 text-amber-100 placeholder:text-amber-500/50 pl-12 h-12 rounded-2xl focus-visible:ring-amber-500/50"
            />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div 
            onClick={() => { setAba('inventario'); setFiltroCritico(false); setBusca(''); }}
            className={cn("border rounded-[30px] p-6 shadow-2xl relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-amber-500/20", !filtroCritico && aba === 'inventario' ? "bg-zinc-900 border-amber-500/50" : "bg-zinc-950/60 border-amber-500/20")}>
            <div className="absolute -right-6 -top-6 text-amber-500/5 group-hover:text-amber-500/10 transition-colors">
              <Package className="h-40 w-40" />
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2 relative z-10">Total de Produtos (Catálogo)</p>
            <p className="text-4xl font-black italic text-white relative z-10">{stats.totalItens}</p>
          </div>
          
          <div 
            onClick={() => { setAba('inventario'); setFiltroCritico(true); }}
            className={cn("border rounded-[30px] p-6 shadow-2xl relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-rose-500/20", filtroCritico && aba === 'inventario' ? "bg-rose-900/40 border-rose-500/50" : "bg-rose-950/20 border-rose-500/20")}>
            <div className="absolute -right-6 -top-6 text-rose-500/5 group-hover:text-rose-500/10 transition-colors">
              <AlertTriangle className="h-40 w-40" />
            </div>
            <p className="text-[10px] text-rose-400/80 uppercase tracking-widest font-black mb-2 relative z-10">Estoque Crítico ou Zerado</p>
            <p className="text-4xl font-black italic text-rose-400 relative z-10">{stats.itensCriticos}</p>
          </div>

          <div 
            onClick={() => { setAba('entradas'); }}
            className={cn("border rounded-[30px] p-6 shadow-2xl relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-emerald-500/20", aba === 'entradas' ? "bg-emerald-900/40 border-emerald-500/50" : "bg-emerald-950/20 border-emerald-500/20")}>
            <div className="absolute -right-6 -top-6 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors">
              <ArrowDownCircle className="h-40 w-40" />
            </div>
            <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-black mb-2 relative z-10">Entradas via NF Registradas</p>
            <p className="text-4xl font-black italic text-emerald-400 relative z-10">{stats.totalEntradas}</p>
          </div>

          <div 
            onClick={() => { setAba('saidas'); }}
            className={cn("border rounded-[30px] p-6 shadow-2xl relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-violet-500/20", aba === 'saidas' ? "bg-violet-900/40 border-violet-500/50" : "bg-violet-950/20 border-violet-500/20")}>
            <div className="absolute -right-6 -top-6 text-violet-500/5 group-hover:text-violet-500/10 transition-colors">
              <CheckCircle className="h-40 w-40" />
            </div>
            <p className="text-[10px] text-violet-400/80 uppercase tracking-widest font-black mb-2 relative z-10">Pedidos Entregues (OS / Saídas)</p>
            <p className="text-4xl font-black italic text-violet-400 relative z-10">{stats.totalSaidas}</p>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className="space-y-6">
          <div className="flex bg-black/40 border border-white/10 rounded-2xl p-1.5 w-max">
            <button
              onClick={() => { setAba('inventario'); setFiltroCritico(false); }}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                aba === 'inventario' && !filtroCritico ? "bg-amber-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
              )}
            >
              <Package className="h-4 w-4" /> Inventário de Estoque
            </button>
            <button
              onClick={() => { setAba('inventario'); setFiltroCritico(true); }}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                aba === 'inventario' && filtroCritico ? "bg-rose-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
              )}
            >
              <AlertTriangle className="h-4 w-4" /> Críticos
            </button>
            <button
              onClick={() => setAba('entradas')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                aba === 'entradas' ? "bg-emerald-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
              )}
            >
              <ArrowDownCircle className="h-4 w-4" /> Entradas (NFs)
            </button>
            <button
              onClick={() => setAba('saidas')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                aba === 'saidas' ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
              )}
            >
              <CheckCircle className="h-4 w-4" /> Pedidos Entregues (OSs)
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button
              onClick={() => setAba('ruptura')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                aba === 'ruptura' ? "bg-rose-600 text-white shadow-lg" : "text-gray-500 hover:text-rose-400"
              )}
            >
              <Activity className="h-4 w-4" /> Cockpit Ruptura
            </button>
            <button
              onClick={() => setAba('curvaABC')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                aba === 'curvaABC' ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-blue-400"
              )}
            >
              <Package className="h-4 w-4" /> Curva ABC
            </button>
          </div>

          <div className="bg-zinc-950/60 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* TELA INVENTÁRIO */}
            {aba === 'inventario' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-amber-950/30 border-b border-amber-500/20">
                    <TableRow>
                      <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Produto</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Código</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 text-center">Localização</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 text-center">Mínimo</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 text-center">Atual</TableHead>
                      <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventarioFiltrado.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-gray-500 font-black uppercase tracking-widest text-xs">
                          Nenhum produto encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventarioFiltrado.map((item, idx) => {
                        const critico = item.estoqueAtual <= item.estoqueMinimo;
                        return (
                          <TableRow key={item.id} className={cn("border-white/5 transition-colors", idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]', critico && 'bg-rose-950/10 hover:bg-rose-950/20')}>
                            <TableCell className="px-6 py-4">
                              <p className="font-black text-sm uppercase text-white truncate max-w-xs" title={item.descricao}>{item.descricao}</p>
                              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{item.unidade}</p>
                            </TableCell>
                            <TableCell className="px-4 py-4">
                              <span className="font-mono text-[10px] text-amber-300 bg-amber-950/40 border border-amber-500/20 rounded-lg px-2 py-1">
                                {item.codigo}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className="text-[10px] text-gray-400 font-bold uppercase">{item.localizacao || '-'}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className="text-xs font-black text-gray-400">{item.estoqueMinimo}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className={cn("text-lg font-black", critico ? "text-rose-400" : "text-emerald-400")}>{item.estoqueAtual}</span>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              {critico ? (
                                <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase tracking-widest text-[9px] font-black">
                                  <AlertTriangle className="h-3 w-3 mr-1" /> Crítico
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest text-[9px] font-black">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Normal
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* TELA ENTRADAS */}
            {aba === 'entradas' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-emerald-950/30 border-b border-emerald-500/20">
                    <TableRow>
                      <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Data</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Nota Fiscal / Doc</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Produto</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 text-center">Responsável</TableHead>
                      <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 text-right">Qtd Entrada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todasEntradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-gray-500 font-black uppercase tracking-widest text-xs">
                          Nenhuma entrada registrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      todasEntradas.map((mov, idx) => (
                        <TableRow key={mov.id} className={cn("border-white/5 transition-colors", idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]')}>
                          <TableCell className="px-6 py-4">
                            <span className="text-[11px] font-black text-gray-400">{mov.data.split('-').reverse().join('/')}</span>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 rounded-lg px-2 py-1">
                              {mov.observacao || 'S/ NF'}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <p className="font-black text-xs uppercase text-white truncate max-w-[200px]" title={mov.descricao}>{mov.descricao}</p>
                            <p className="text-[9px] text-gray-500 mt-0.5 font-mono">{mov.codigo}</p>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{mov.responsavel}</span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <span className="text-base font-black text-emerald-400">+{mov.quantidade} <span className="text-[10px] text-emerald-600 ml-0.5 uppercase tracking-widest">{mov.unidade}</span></span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* TELA SAÍDAS / PEDIDOS ENTREGUES */}
            {aba === 'saidas' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-violet-950/30 border-b border-violet-500/20">
                    <TableRow>
                      <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">Data</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">Requisição / OS</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">Produto Entregue</TableHead>
                      <TableHead className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 text-center">Responsável</TableHead>
                      <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 text-right">Qtd Entregue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todasSaidas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-gray-500 font-black uppercase tracking-widest text-xs">
                          Nenhum pedido entregue registrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      todasSaidas.map((mov, idx) => (
                        <TableRow key={mov.id} className={cn("border-white/5 transition-colors", idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]')}>
                          <TableCell className="px-6 py-4">
                            <span className="text-[11px] font-black text-gray-400">{mov.data.split('-').reverse().join('/')}</span>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <span className="font-mono text-[10px] text-violet-300 bg-violet-950/40 border border-violet-500/20 rounded-lg px-2 py-1">
                              {mov.observacao || 'S/ OS'}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <p className="font-black text-xs uppercase text-white truncate max-w-[200px]" title={mov.descricao}>{mov.descricao}</p>
                            <p className="text-[9px] text-gray-500 mt-0.5 font-mono">{mov.codigo}</p>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{mov.responsavel}</span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <span className="text-base font-black text-violet-400">-{mov.quantidade} <span className="text-[10px] text-violet-600 ml-0.5 uppercase tracking-widest">{mov.unidade}</span></span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* TELA COCKPIT RUPTURA */}
            {aba === 'ruptura' && (
              <div className="p-8 space-y-8 bg-zinc-950/50">
                <h2 className="text-2xl font-black text-rose-400 uppercase italic flex items-center gap-3">
                  <Activity className="h-6 w-6" /> Tempo de Sobrevivência Crítico (Top 5)
                </h2>
                
                {itensCriticosIA.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-bold uppercase tracking-widest">Nenhum item em risco de ruptura imediata.</p>
                  </div>
                ) : (
                  <>
                    <div className="h-64 border-b border-white/5 pb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={itensCriticosIA.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                          <XAxis type="number" />
                          <YAxis dataKey="codigo" type="category" width={100} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                          <Tooltip cursor={{fill: '#f43f5e', opacity: 0.1}} contentStyle={{ backgroundColor: '#09090b', borderColor: '#f43f5e', borderRadius: '16px' }} />
                          <Bar dataKey="diasRestantes" fill="#f43f5e" radius={[0, 8, 8, 0]}>
                            {itensCriticosIA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.diasRestantes < 5 ? '#e11d48' : '#fb923c'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {itensCriticosIA.map(item => (
                        <div key={item.id} className="bg-black/60 border border-white/5 rounded-[30px] p-6 hover:border-rose-500/30 transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <Package className="h-8 w-8 text-rose-400/50 group-hover:text-rose-400 transition-colors" />
                            <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/30 font-black">Faltam {item.diasRestantes} dias</Badge>
                          </div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.codigo}</p>
                          <p className="text-sm font-black text-white uppercase mt-1 leading-tight">{item.descricao}</p>
                          
                          <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500 font-bold">Estoque Atual:</span>
                              <span className="font-black text-white">{item.estoqueAtual} {item.unidade}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500 font-bold">Consumo/Dia (Média):</span>
                              <span className="font-black text-amber-400">{item.consumoMedioDiario.toFixed(1)} {item.unidade}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TELA CURVA ABC */}
            {aba === 'curvaABC' && (
              <div className="p-8 space-y-8 bg-zinc-950/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="col-span-1 bg-black/40 border border-white/10 rounded-[30px] p-6 flex flex-col justify-center items-center">
                    <h3 className="text-lg font-black text-white uppercase italic mb-4">Distribuição do Inventário</h3>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dadosGraficoABC}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {dadosGraficoABC.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#f59e0b', borderRadius: '16px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest text-center mt-4">Valor Total em Estoque<br/><span className="text-2xl text-white font-black italic mt-1 block">R$ {curvaABC.reduce((acc, i) => acc + i.valorTotal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
                  </div>

                  <div className="col-span-2">
                    <Table>
                      <TableHeader className="bg-black/60 border-b border-white/10">
                        <TableRow>
                          <TableHead className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-amber-400">Classe</TableHead>
                          <TableHead className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Produto</TableHead>
                          <TableHead className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 text-right">Valor em Estoque</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {curvaABC.map((item, idx) => (
                          <TableRow key={item.id} className={cn("border-white/5", idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]')}>
                            <TableCell className="px-4 py-3">
                              <span className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-black uppercase",
                                item.classeABC === 'A' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                item.classeABC === 'B' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              )}>
                                {item.classeABC}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <p className="text-sm font-bold text-white uppercase">{item.descricao}</p>
                              <p className="font-mono text-[9px] text-gray-500 mt-1">{item.codigo}</p>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right font-black text-emerald-400">
                              R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        <LegalSafeguard module="DANTE ALMOXARIFADO" protocol="NX-7731-STK" />
      </div>
    </SovereignShowcase>
  );
}

