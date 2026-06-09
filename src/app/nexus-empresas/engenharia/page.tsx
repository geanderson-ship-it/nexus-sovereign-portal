'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Trash2, ArrowLeft, Search, Save, Package, Scissors, Timer, Calculator, Settings, Edit3, Database, FileText, Layers, GitMerge, CheckCircle2, Wrench, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
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
  const [fichaAberta, setFichaAberta] = useState<ItemEngenharia | null>(null);
  const [activeTab, setActiveTab] = useState('master-data');
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
    <SovereignShowcase moduleName="Engenharia de Processos" imagePath="/Nexus Intelligence Engenharia/Nexus intelligence Engenharia.png">
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-amber-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 space-y-12">
      
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()}>
            <div className="p-2 rounded-full hover:bg-amber-500/10 transition-colors">
              <ArrowLeft className="h-5 w-5 text-amber-400" />
            </div>
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight text-amber-400 font-headline italic">Engenharia de Processos</h1>
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Nexus Core</Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest italic tracking-[0.2em]">Ponto Único de Verdade</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="master-data" onValueChange={setActiveTab} className="w-full space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-amber-500/10 pb-4">
            <TabsList className="bg-zinc-900/60 border border-white/5 p-1 rounded-2xl h-14">
                <TabsTrigger value="master-data" className="rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-black text-white font-black uppercase tracking-widest text-[10px] px-8 h-full transition-all">
                    <Database className="h-4 w-4 mr-2" /> Master Data (BOM)
                </TabsTrigger>
                <TabsTrigger value="ferramental" className="rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-black text-white font-black uppercase tracking-widest text-[10px] px-8 h-full transition-all">
                    <Wrench className="h-4 w-4 mr-2" /> Controle de Ferramental
                </TabsTrigger>
            </TabsList>
            
            {activeTab === 'master-data' && (
              <Button className="bg-amber-600 hover:bg-amber-500 text-black font-black uppercase tracking-widest h-12 px-6 rounded-xl text-[11px] shadow-[0_0_20px_rgba(245,158,11,0.2)]" onClick={abrirNovo}>
                <Plus className="mr-2 h-4 w-4" /> Cadastrar Novo Processo
              </Button>
            )}
        </div>

        {/* TAB 1: MASTER DATA */}
        <TabsContent value="master-data" className="space-y-8">

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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all text-blue-400" onClick={() => setFichaAberta(item)} title="Ver Ficha Técnica">
                        <FileText className="h-4 w-4" />
                      </Button>
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
      </TabsContent>

      {/* TAB 2: CONTROLE DE FERRAMENTAL */}
      <TabsContent value="ferramental" className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-950/40 border border-amber-500/10 rounded-[32px] p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase text-white tracking-widest flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-amber-500" /> Ativos e Gabaritos
                </h3>
                <Badge className="bg-amber-500/10 text-amber-400 border-none font-black text-[10px]">MONITORAMENTO IA ATIVO</Badge>
              </div>
              
              <div className="space-y-4">
                {[
                  { nome: 'Gabarito de Corte 6mm', id: 'GAB-C06', tipo: 'Gabarito de Medida', status: 'Liberado', uso: 840, limite: 5000 },
                  { nome: 'Serra Fita Bi-metálica 3/4', id: 'SFA-034', tipo: 'Consumível', status: 'Atenção', uso: 18500, limite: 20000 },
                  { nome: 'Molde de Estampo Perfil U', id: 'MOL-PU', tipo: 'Matriz / Molde', status: 'Manutenção', uso: 12000, limite: 12000 },
                ].map(ferr => {
                  const perc = (ferr.uso / ferr.limite) * 100;
                  const isCritical = perc >= 90;
                  const isWarning = perc >= 70 && perc < 90;
                  const color = ferr.status === 'Manutenção' ? 'rose' : isCritical ? 'rose' : isWarning ? 'amber' : 'emerald';

                  return (
                    <div key={ferr.id} className={cn(
                      "p-5 rounded-2xl border flex items-center justify-between gap-6 transition-all",
                      `bg-${color}-500/5 border-${color}-500/20 hover:border-${color}-500/40`
                    )}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge variant="outline" className={`border-${color}-500/30 text-${color}-400 text-[9px] uppercase tracking-widest`}>{ferr.tipo}</Badge>
                          {ferr.status === 'Manutenção' && <Badge className="bg-rose-500 text-white border-none text-[9px] uppercase tracking-widest animate-pulse">Retido pelo Qualidade</Badge>}
                        </div>
                        <h4 className="text-base font-black text-white uppercase">{ferr.nome}</h4>
                        <p className="text-xs font-mono text-gray-500 mt-1">ID: {ferr.id}</p>
                      </div>

                      <div className="w-48 space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          <span>Vida Útil</span>
                          <span className={`text-${color}-400`}>{Math.round(perc)}%</span>
                        </div>
                        <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                          <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${Math.min(perc, 100)}%` }} />
                        </div>
                        <p className="text-[9px] text-right text-gray-500">{ferr.uso.toLocaleString()} / {ferr.limite.toLocaleString()} ciclos</p>
                      </div>

                      <Button variant="ghost" size="sm" className={`h-10 text-${color}-400 hover:text-white hover:bg-${color}-500/20 rounded-xl`}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-950/40 border border-amber-500/10 rounded-[32px] p-8 backdrop-blur-md space-y-6">
              <h3 className="text-sm font-black uppercase text-gray-500 tracking-widest">Ações Necessárias</h3>
              
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-white uppercase">Intervenção Imediata</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Molde de Estampo Perfil U atingiu o limite de vida útil (12.000 ciclos). Risco de variação dimensional detectado.
                    </p>
                    <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-500 text-white uppercase font-black text-[9px] tracking-widest mt-2">
                      Abrir OS de Ferramentaria
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-white uppercase">Previsão de Setup</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Serra Fita Bi-metálica atingirá limite de corte em aproximadamente 14 horas de operação contínua.
                    </p>
                    <Button variant="outline" size="sm" className="w-full border-amber-500/20 text-amber-400 hover:bg-amber-500/10 uppercase font-black text-[9px] tracking-widest mt-2">
                      Programar Troca (PPCP)
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </TabsContent>
      </Tabs>

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

      {/* MODAL FICHA TÉCNICA */}
      <Dialog open={!!fichaAberta} onOpenChange={(open) => !open && setFichaAberta(null)}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-3xl rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.2)] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-8 bg-zinc-900/50 border-b border-amber-500/10">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-amber-500 text-black font-black uppercase tracking-widest text-[9px] mb-3 border-none">Ficha Técnica & Roteiro</Badge>
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">
                  {fichaAberta?.produto}
                </DialogTitle>
                <p className="text-sm font-mono text-amber-500 mt-1">{fichaAberta?.codigo}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Tempo Padrão</p>
                <p className="text-3xl font-black text-amber-400 italic">{fichaAberta?.tempoPadrao} <span className="text-sm font-normal text-gray-500">min</span></p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-amber-500/20">
            
            {/* ESTRUTURA BOM */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase text-white flex items-center gap-2 border-b border-white/10 pb-2">
                <Layers className="h-4 w-4 text-amber-500" /> Estrutura do Produto (BOM)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Matéria Prima Principal</p>
                    <p className="text-sm font-bold text-white uppercase">Perfil Aço Carbono 6m</p>
                  </div>
                  <Badge className="bg-zinc-800 text-gray-300">1 un</Badge>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Insumo Secundário</p>
                    <p className="text-sm font-bold text-white uppercase">Óleo de Corte Sintético</p>
                  </div>
                  <Badge className="bg-zinc-800 text-gray-300">15 ml</Badge>
                </div>
              </div>
            </div>

            {/* ROTEIRO PASSO A PASSO */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase text-white flex items-center gap-2 border-b border-white/10 pb-2">
                <GitMerge className="h-4 w-4 text-emerald-500" /> Roteiro de Processo
              </h4>
              <div className="space-y-3 relative">
                {/* Linha do tempo visual */}
                <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-white/5" />

                {[
                  { passo: 1, nome: "Checklist Inicial (NR-12)", desc: "Inspecionar condições da máquina. Ligar o equipamento e posicionar o gabarito conforme ordem do PPCP.", tempo: (fichaAberta?.tempoPadrao || 0) * 0.10 },
                  { passo: 2, nome: "Abastecimento", desc: "Colocar as peças no gabarito e efetuar verificação visual de alinhamento.", tempo: (fichaAberta?.tempoPadrao || 0) * 0.15 },
                  { passo: 3, nome: "Operação de Corte", desc: "Acionamento bimanual obrigatório. Aguardar a máquina parar completamente por segurança.", tempo: (fichaAberta?.tempoPadrao || 0) * 0.45 },
                  { passo: 4, nome: "Qualidade Primária", desc: "Retirar as peças cortadas e realizar a pré-avaliação de qualidade (dimensional/visual).", tempo: (fichaAberta?.tempoPadrao || 0) * 0.15 },
                  { passo: 5, nome: "Acondicionamento e Limpeza", desc: "Armazenar organizadamente (mantendo a qualidade). Verificar a limpeza e reiniciar o ciclo.", tempo: (fichaAberta?.tempoPadrao || 0) * 0.15 },
                ].map((step) => (
                  <div key={step.passo} className="relative pl-16">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-zinc-900 border-2 border-emerald-500/50 flex items-center justify-center z-10">
                      <span className="text-[10px] font-black text-emerald-400">{step.passo}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h5 className="text-sm font-black text-white uppercase">{step.nome}</h5>
                        <p className="text-[11px] text-gray-400">{step.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-white/10">
                          <Timer className="h-3 w-3 text-gray-500" />
                          <span className="text-xs font-mono text-emerald-400">{step.tempo.toFixed(2)}m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-white uppercase">Roteiro Homologado</p>
                <p className="text-[11px] text-emerald-500/80">Este fluxo processual foi auditado pela IA Dante e representa o "Ponto Único de Verdade" da engenharia para este código.</p>
              </div>
            </div>

          </div>
          
          <DialogFooter className="p-6 bg-zinc-900/50 border-t border-amber-500/10">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest w-full h-12 rounded-xl" onClick={() => setFichaAberta(null)}>
              Fechar Ficha Técnica
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-6 pb-24 mt-12">
        <LegalSafeguard module="NEXUS ENGENHARIA" protocol="NX-ENG-DATA-00" />
      </div>
    </div>
    </div>
    </SovereignShowcase>
  );
}
