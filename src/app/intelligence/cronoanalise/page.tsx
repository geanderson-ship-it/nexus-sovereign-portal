'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Timer, Plus, Trash2, AlertTriangle, CheckCircle, ArrowLeft, Printer, Target, Activity, Save, Database, ShieldCheck, Package, Scissors, Layers, Clock, User, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

const MINIMO_CICLOS = 5;
const METRICA_HORA_UTIL = 53; 

interface Tomada {
  id: string;
  ciclo: number;
  tempo: string;
}

interface Estudo {
  id: string;
  operacao: string;
  codigo: string;
  pecasPorCiclo: number;
  setor: string;
  liderSetor: string;
  operador: string;
  matriculaOperador: string;
  data: string;
  horarioTiragem: string;
  fadiga: number;
  turnoHoras: number;
  tomadas: Tomada[];
  cronoanalista: string;
  matriculaCronoanalista: string;
  observacoes: string;
}

const gerarTomadasIniciais = (count: number) => 
  Array.from({ length: count }, (_, i) => ({ id: `cycle-${i}`, ciclo: i + 1, tempo: '' }));

export default function CronoanalisePage() {
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmarEnvioOpen, setConfirmarEnvioOpen] = useState(false);
  const [editando, setEditando] = useState<Estudo | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form states com IDs estáveis para evitar "lente" (hydration errors)
  const [operacao, setOperacao] = useState('');
  const [codigo, setCodigo] = useState('');
  const [pecasPorCiclo, setPecasPorCiclo] = useState(1);
  const [setor, setSetor] = useState('');
  const [liderSetor, setLiderSetor] = useState('');
  const [operador, setOperador] = useState('');
  const [matriculaOperador, setMatriculaOperador] = useState('');
  const [data, setData] = useState('');
  const [horarioTiragem, setHorarioTiragem] = useState('');
  const [fadiga, setFadiga] = useState(10);
  const [turnoHoras, setTurnoHoras] = useState(8.8);
  const [tomadas, setTomadas] = useState<Tomada[]>(gerarTomadasIniciais(10));
  const [cronoanalista, setCronoanalista] = useState('');
  const [matriculaCronoanalista, setMatriculaCronoanalista] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nexus_cronoanalise_estudos');
    if (saved) {
      try {
        setEstudos(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultEstudos = [{
        id: 'demo-1',
        operacao: 'MONTAGEM DE ESTRUTURA METÁLICA',
        codigo: 'EST-001',
        pecasPorCiclo: 1,
        setor: 'CORTE E SOLDA',
        liderSetor: 'ROBERTO CARLOS',
        operador: 'Pedro Azuin',
        matriculaOperador: '0375',
        data: '2026-04-30',
        horarioTiragem: '14:17 / 15:47',
        fadiga: 10,
        turnoHoras: 8.8,
        tomadas: gerarTomadasIniciais(10).map((t, i) => ({...t, tempo: [0.70, 0.76, 0.74, 0.78, 0.72, 0.80, 0.74, 0.76, 0.74, 0.80][i].toString().replace('.', ',')})),
        cronoanalista: 'Gustawo Zeula',
        matriculaCronoanalista: '02125',
        observacoes: '',
      }];
      setEstudos(defaultEstudos);
      localStorage.setItem('nexus_cronoanalise_estudos', JSON.stringify(defaultEstudos));
    }
  }, []);

  const parseTempo = (tempo: string) => {
    if (!tempo || typeof tempo !== 'string') return 0;
    let normalized = tempo.trim();
    if (normalized.startsWith(',')) normalized = '0' + normalized;
    normalized = normalized.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calcularEstudo = (estudo: Estudo) => {
    const tempos = estudo.tomadas
      .map(t => parseTempo(t.tempo))
      .filter(value => value > 0);
    if (tempos.length === 0) return null;

    const somaTempos = tempos.reduce((a, b) => a + b, 0);
    const tempoMedioSemFadiga = somaTempos / tempos.length;
    const tempoMedioComFadiga = tempoMedioSemFadiga * (1 + (estudo.fadiga / 100));
    const pecasEm53Min = 53 / (tempoMedioComFadiga || 1);
    const ciclosPorHora = METRICA_HORA_UTIL / (tempoMedioComFadiga || 1);
    const pecasPorHoraReal = ciclosPorHora * (estudo.pecasPorCiclo || 1);
    const pecasPorTurno = pecasPorHoraReal * estudo.turnoHoras;

    const somaDesvios = tempos.reduce((acc, t) => acc + Math.pow(t - tempoMedioSemFadiga, 2), 0);
    const desvioPadrao = Math.sqrt(somaDesvios / tempos.length);
    const coefVariacao = (desvioPadrao / (tempoMedioSemFadiga || 1)) * 100;

    return {
      totalTempo: somaTempos || 0,
      quantidadeCiclos: tempos.length,
      tempoMedioSemFadiga: tempoMedioSemFadiga || 0,
      tempoMedioComFadiga: tempoMedioComFadiga || 0,
      tempoComFadiga: tempoMedioComFadiga || 0,
      pecasEm53Min: pecasEm53Min || 0,
      tempoPadrao: tempoMedioComFadiga || 0,
      pecasPorHoraReal: pecasPorHoraReal || 0,
      pecasPorTurno: pecasPorTurno || 0,
      coefVariacao: coefVariacao || 0,
      ciclosValidos: tempos.length,
      aprovado: tempos.length >= MINIMO_CICLOS && coefVariacao <= 10
    };
  };

  const previewCalc = useMemo(() => {
    return calcularEstudo({
      id: 'preview', operacao, codigo, pecasPorCiclo, setor, liderSetor, operador, matriculaOperador, data, horarioTiragem, fadiga, turnoHoras, tomadas, cronoanalista, matriculaCronoanalista, observacoes
    }) || {
      totalTempo: 0,
      quantidadeCiclos: tomadas.filter(t => parseTempo(t.tempo) > 0).length,
      tempoMedioSemFadiga: 0,
      tempoMedioComFadiga: 0,
      tempoComFadiga: 0,
      pecasEm53Min: 0,
      tempoPadrao: 0,
      pecasPorHoraReal: 0,
      pecasPorTurno: 0,
      coefVariacao: 0,
      ciclosValidos: tomadas.filter(t => parseTempo(t.tempo) > 0).length,
      aprovado: false
    };
  }, [operacao, codigo, pecasPorCiclo, setor, liderSetor, operador, matriculaOperador, data, horarioTiragem, fadiga, turnoHoras, tomadas, cronoanalista, matriculaCronoanalista, observacoes]);

  const abrirNovo = () => {
    setEditando(null);
    setOperacao(''); setCodigo(''); setPecasPorCiclo(1); setSetor(''); setLiderSetor('');
    setOperador(''); setMatriculaOperador(''); setData(''); setHorarioTiragem('');
    setFadiga(10); setTurnoHoras(8.8); setTomadas(gerarTomadasIniciais(10));
    setCronoanalista(''); setMatriculaCronoanalista(''); setObservacoes('');
    setDialogOpen(true);
  };

  const abrirEditar = (estudo: Estudo) => {
    setEditando(estudo);
    setOperacao(estudo.operacao); setCodigo(estudo.codigo); setPecasPorCiclo(estudo.pecasPorCiclo);
    setSetor(estudo.setor); setLiderSetor(estudo.liderSetor);
    setOperador(estudo.operador); setMatriculaOperador(estudo.matriculaOperador); setData(estudo.data); setHorarioTiragem(estudo.horarioTiragem);
    setFadiga(estudo.fadiga); setTurnoHoras(estudo.turnoHoras); setTomadas(estudo.tomadas);
    setCronoanalista(estudo.cronoanalista); setMatriculaCronoanalista(estudo.matriculaCronoanalista); setObservacoes(estudo.observacoes);
    setDialogOpen(true);
  };

  const handleConfirmarSalvar = () => {
    try {
      const novoEstudo = {
        id: editando ? editando.id : `estudo-${Date.now()}`,
        operacao, codigo, pecasPorCiclo, setor, liderSetor, operador, matriculaOperador, data, horarioTiragem, fadiga, turnoHoras, tomadas, cronoanalista, matriculaCronoanalista, observacoes
      };
      
      const saved = localStorage.getItem('nexus_cronoanalise_estudos');
      let currentEstudos = estudos;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) currentEstudos = parsed;
        } catch (e) {
          console.error("Erro ao ler localStorage, resetando array", e);
          currentEstudos = [];
        }
      }

      const next = editando ? currentEstudos.map((e: any) => e.id === editando.id ? novoEstudo : e) : [...currentEstudos, novoEstudo];
      
      localStorage.setItem('nexus_cronoanalise_estudos', JSON.stringify(next));
      window.dispatchEvent(new StorageEvent('storage', { key: 'nexus_cronoanalise_estudos' }));
      
      setEstudos(next);
      setConfirmarEnvioOpen(false);
      setDialogOpen(false);
      
      // Feedback visual rústico e inegável
      alert(`ESTUDO SALVO COM SUCESSO!\n\nCódigo: ${codigo}\nTotal de estudos no seu computador agora: ${next.length}`);
    } catch (err) {
      console.error(err);
      alert("Houve um erro interno ao tentar salvar o estudo. O banco de dados do navegador pode estar bloqueado.");
    }
  };

  const updateTomada = (id: string, tempo: string) => setTomadas(prev => prev.map(t => t.id === id ? { ...t, tempo } : t));
  const addCiclo = () => setTomadas(prev => [...prev, { id: `cycle-${prev.length}`, ciclo: prev.length + 1, tempo: '' }]);

  const formatTempoDisplay = (tempo: string) => {
    if (!tempo) return '';
    return tempo;
  };

  const formatDataBr = (dataValue: string) => {
    if (!dataValue) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataValue)) return dataValue.split('-').reverse().join('/');
    return dataValue;
  };

  const handleTempoChange = (id: string, value: string) => {
    const processedValue = value.replace(/\./g, ',');
    // Permite digitar: vazio, vírgula inicial, até 2 dígitos antes da vírgula e 2 após
    if (/^[0-9]{0,2}(?:,[0-9]{0,2})?$/.test(processedValue) || processedValue === '' || processedValue === ',') {
      updateTomada(id, processedValue);
    }
  };

  // Auto-formata ao sair do campo: "95" → "0,95" | "101" → "1,01" | ",95" → "0,95"
  const handleTempoBlur = (id: string, value: string) => {
    if (!value || value === ',') return;
    let formatted = value.trim();
    if (/^[0-9]+$/.test(formatted)) {
      // Apenas dígitos sem vírgula
      if (formatted.length === 1) {
        formatted = '0,0' + formatted;        // "9" → "0,09"
      } else if (formatted.length === 2) {
        formatted = '0,' + formatted;          // "95" → "0,95"
      } else if (formatted.length === 3) {
        formatted = formatted[0] + ',' + formatted.slice(1); // "101" → "1,01"
      }
    } else if (formatted.startsWith(',')) {
      formatted = '0' + formatted;            // ",95" → "0,95"
    }
    updateTomada(id, formatted);
  };

  // Proteção suave contra erros de hidratação
  const isClient = mounted;

  return (
    <SovereignShowcase moduleName="Nexus Cronoanálise" imagePath="/Nexus Empresas/Dante cronoanalista.png">
      <div className="min-h-screen bg-black text-white p-6 space-y-12 font-sans selection:bg-violet-500/30">
      
      {/* HEADER DA PÁGINA */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-violet-500/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/nexus-empresas">
            <div className="p-2 rounded-full hover:bg-violet-500/10 transition-colors group">
              <ArrowLeft className="h-5 w-5 text-violet-400" />
            </div>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight text-violet-400 font-headline italic">Módulo Cronoanálise</h1>
              <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">Technical Audit</Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest italic tracking-[0.2em]">Memorial de Cálculo Industrial — v6.6</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-50 cursor-not-allowed" disabled>
            <Database className="mr-2 h-4 w-4" /> Engenharia de Processos
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest h-10 px-6 rounded-xl text-[11px]" onClick={abrirNovo}>
            <Plus className="mr-2 h-4 w-4" /> Novo Estudo
          </Button>
        </div>
      </div>

      {/* DASHBOARD DE ESTUDOS */}
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-violet-500/20 rounded-[40px] bg-zinc-950/60 mt-10">
        <Activity className="h-16 w-16 text-violet-500/30 mb-4 animate-pulse" />
        <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Cronoanálises Validadas</h3>
        <p className="text-sm text-gray-500 max-w-md text-center mt-2 leading-relaxed">
          Sempre que um estudo é confirmado e salvo, ele é automaticamente direcionado para o módulo <strong className="text-amber-400">PPCP</strong>. Consulte a <strong className="text-violet-400">Capacidade Produtiva</strong> lá para visualizar o banco de tempos padrão.
        </p>
      </div>

      <LegalSafeguard module="MÓDULO CRONOANÁLISE" protocol="CX-8842-TECH" />

      {/* MODAL DE ESTUDO (BASEADO NO PRINT DO USUÁRIO) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border-violet-500/30 text-white max-w-5xl h-[95vh] flex flex-col rounded-[50px] overflow-hidden shadow-[0_0_150px_rgba(139,92,246,0.2)]">
           <DialogHeader className="p-10 bg-violet-600/10 border-b border-violet-500/10">
              <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-violet-400 flex items-center gap-5">
                <Timer className="h-9 w-9 text-violet-500" /> 
                {isClient ? 'Estudo Técnico de Cronoanálise' : 'Carregando Estudo...'}
              </DialogTitle>
           </DialogHeader>
           
           <div className="flex-1 overflow-auto p-12 space-y-10 scrollbar-thin scrollbar-thumb-violet-500/20">
              
              {/* LINHA 1: PRODUTO, CÓDIGO E MULTIPLICADOR (PEDIDO PELO USUÁRIO) */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6 space-y-2 group">
                  <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest flex items-center gap-2">
                    <Package className="h-3 w-3" /> Operação / Produto
                  </Label>
                  <Input 
                    placeholder="EX: MONTAGEM DE ESTRUTURA"
                    value={operacao} 
                    onChange={e => setOperacao(e.target.value)} 
                    className="bg-black/40 border-violet-500/20 text-white h-14 rounded-2xl font-black uppercase text-lg focus:border-violet-500" 
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest flex items-center gap-2">
                    <Database className="h-3 w-3" /> Código
                  </Label>
                  <Input 
                    placeholder="PRD-000"
                    value={codigo} 
                    onChange={e => setCodigo(e.target.value)} 
                    className="bg-black/40 border-violet-500/20 text-white h-14 rounded-2xl font-mono uppercase text-lg text-center" 
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center gap-2 italic">
                    <Layers className="h-3 w-3 text-amber-500" /> Peças p/ Ciclo
                  </Label>
                  <Input 
                    type="number"
                    min={1}
                    value={pecasPorCiclo} 
                    onChange={e => setPecasPorCiclo(Number(e.target.value))} 
                    className="bg-amber-500/5 border-amber-500/30 text-amber-400 h-14 rounded-2xl font-black text-2xl text-center" 
                  />
                </div>
              </div>

              {/* LINHA 2 (DO PRINT): DATA, OPERADOR, MATRICULA, HORARIO */}
              <div className="grid grid-cols-4 gap-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest flex items-center gap-2">
                     <CalendarDays className="h-3 w-3" /> Data
                   </Label>
                   <Input type="date" value={data} onChange={e => setData(e.target.value)} className="bg-black/40 border-violet-500/20 text-white h-12 rounded-xl font-black uppercase" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest flex items-center gap-2">
                     <User className="h-3 w-3" /> Operador
                   </Label>
                   <Input value={operador} onChange={e => setOperador(e.target.value)} className="bg-black/40 border-violet-500/20 text-white h-12 rounded-xl font-black uppercase" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest">Matrícula (Operador)</Label>
                   <Input value={matriculaOperador} onChange={e => setMatriculaOperador(e.target.value)} className="bg-black/40 border-violet-500/20 text-white h-12 rounded-xl text-center font-mono" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest flex items-center gap-2">
                     <Clock className="h-3 w-3" /> Horário de Tiragem
                   </Label>
                   <Input placeholder="14:17 / 15:47" value={horarioTiragem} onChange={e => setHorarioTiragem(e.target.value)} className="bg-black/40 border-violet-500/20 text-white h-12 rounded-xl text-center font-black" />
                </div>
              </div>

              {/* LINHA 3 (DO PRINT): FADIGA, TURNO, MINUTOS DIA */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest">Quebra de Fadiga (%)</Label>
                   <Input type="number" value={fadiga} onChange={e => setFadiga(Number(e.target.value))} className="bg-black/40 border-violet-500/20 text-white h-12 rounded-xl text-center font-black" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest">Turno (Horas Decimais)</Label>
                   <Input type="number" step={0.1} value={turnoHoras} onChange={e => setTurnoHoras(Number(e.target.value))} className="bg-black/40 border-violet-500/20 text-white h-12 rounded-xl text-center font-black" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest">Minutos Dia</Label>
                   <div className="bg-violet-950/30 border border-violet-500/20 h-12 rounded-xl flex items-center justify-center font-black text-violet-400 italic">
                      {Math.round(turnoHoras * 60)}
                   </div>
                </div>
              </div>

              {/* SEÇÃO TOMADAS (DO PRINT): TÍTULO + BOTÃO ADICIONAR */}
              <div className="p-10 rounded-[40px] bg-violet-950/10 border border-violet-500/10 space-y-8 shadow-inner">
                 <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase text-violet-400 tracking-[0.3em] flex items-center gap-3">
                       <Activity className="h-5 w-5" /> Tomadas de Tempo — {tomadas.length} Ciclos
                    </Label>
                    <Button variant="ghost" className="bg-violet-500/10 text-violet-400 text-[10px] font-black uppercase tracking-widest px-6 h-10 rounded-xl hover:bg-violet-500/20" onClick={addCiclo}>
                       <Plus className="mr-2 h-4 w-4" /> Adicionar Ciclo
                    </Button>
                 </div>
                 <div className="grid grid-cols-5 gap-6">
                   {tomadas.map(t => (
                     <div key={t.id} className="space-y-2 group">
                        <span className="text-[9px] font-black text-gray-700 uppercase block text-center tracking-widest">Ciclo {t.ciclo}</span>
                        <Input 
                          type="text" 
                          inputMode="decimal"
                          value={formatTempoDisplay(t.tempo)} 
                          onChange={e => handleTempoChange(t.id, e.target.value)}
                          onBlur={e => handleTempoBlur(t.id, e.target.value)}
                          className="bg-black/60 border-zinc-800 text-center font-mono text-xl font-black text-violet-400 rounded-2xl h-14 focus:border-violet-500" 
                          placeholder="0,00" 
                        />
                     </div>
                   ))}
                 </div>
              </div>

              {/* 4 QUADROS DE CÁLCULO */}
              {previewCalc && (
                <>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="bg-black/40 border border-violet-500/20 rounded-3xl p-6 text-center">
                      <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest mb-2 block">Soma total dos ciclos</Label>
                      <p className="text-2xl font-black text-white">{previewCalc.totalTempo.toFixed(2)} min</p>
                      <p className="text-sm text-gray-400 mt-2">{previewCalc.quantidadeCiclos} ciclos</p>
                    </div>
                    <div className="bg-black/40 border border-violet-500/20 rounded-3xl p-6 text-center">
                      <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest mb-2 block">Tempo médio sem fadiga</Label>
                      <p className="text-2xl font-black text-amber-400">{previewCalc.tempoMedioSemFadiga.toFixed(2)} min</p>
                    </div>
                    <div className="bg-black/40 border border-violet-500/20 rounded-3xl p-6 text-center">
                      <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest mb-2 block">Tempo médio com fadiga</Label>
                      <p className="text-2xl font-black text-amber-400">{previewCalc.tempoMedioComFadiga.toFixed(2)} min</p>
                      <p className="text-sm text-gray-400 mt-2">{fadiga}% de acréscimo</p>
                    </div>
                    <div className="bg-black/40 border border-violet-500/20 rounded-3xl p-6 text-center">
                      <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest mb-2 block">53 min / Tempo</Label>
                      <p className="text-2xl font-black text-emerald-400">{Math.round(previewCalc.pecasEm53Min)} pçs</p>
                      <p className="text-sm text-gray-500 mt-1">base 53 min</p>
                    </div>
                  </div>
                  <div className="bg-black/40 border border-violet-500/20 rounded-3xl p-6 mt-6">
                    <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest mb-3 block">Observações</Label>
                    <Textarea
                      value={observacoes}
                      onChange={e => setObservacoes(e.target.value)}
                      rows={10}
                      className="bg-black/70 border border-violet-500/20 text-white resize-none w-full rounded-3xl p-4 text-sm placeholder:text-gray-500 leading-7 font-mono"
                      placeholder="Digite suas observações aqui..."
                    />
                  </div>
                </>
              )}

              {/* LINHA FINAL (DO PRINT): ASSINATURA E MATRÍCULA */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest">Assinatura / Cronoanalista</Label>
                   <Input value={cronoanalista} onChange={e => setCronoanalista(e.target.value)} className="bg-black/40 border-violet-500/20 text-white h-12 rounded-xl font-black uppercase px-6" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-violet-400/60 tracking-widest">Matrícula</Label>
                   <Input value={matriculaCronoanalista} onChange={e => setMatriculaCronoanalista(e.target.value)} className="bg-black/40 border-violet-500/20 text-white h-12 rounded-xl text-center font-mono" />
                </div>
              </div>
           </div>

           <DialogFooter className="p-10 bg-black border-t border-violet-500/10 flex justify-between items-center shadow-[0_-20px_100px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-4 opacity-40">
                 <ShieldCheck className="h-7 w-7 text-violet-500" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Auditoria Industrial Nexus</span>
              </div>
              <div className="flex gap-6 items-center">
                 <button className="text-[10px] text-gray-600 hover:text-white font-black uppercase tracking-[0.5em] transition-colors" onClick={() => setDialogOpen(false)}>Cancelar</button>
                 <Button 
                   className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest px-16 h-16 rounded-[28px] shadow-2xl shadow-violet-600/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" 
                   onClick={() => setConfirmarEnvioOpen(true)}
                   disabled={previewCalc.ciclosValidos === 0}
                 >
                   Salvar Estudo
                 </Button>
              </div>
           </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG DE CONFIRMAÇÃO DE ENVIO AO PPCP */}
      <Dialog open={confirmarEnvioOpen} onOpenChange={setConfirmarEnvioOpen}>
        <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-violet-500/50 max-w-md p-8 shadow-[0_0_100px_rgba(139,92,246,0.15)] rounded-[40px]">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-violet-500/10 flex items-center justify-center border-2 border-violet-500/30">
              <ShieldCheck className="h-10 w-10 text-violet-400" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">Confirmar Estudo</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Você tem certeza que deseja enviar este estudo para o <strong className="text-violet-400">PPCP</strong>?<br/>
                Esta ação atualizará o banco de dados de <strong className="text-amber-400">Capacidade Produtiva</strong>.
              </p>
            </div>

            <div className="flex flex-col w-full gap-3 mt-4">
              <Button 
                onClick={handleConfirmarSalvar} 
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest h-14 rounded-[20px] shadow-lg shadow-violet-600/20"
              >
                Confirmar e Enviar
              </Button>
              <Button 
                onClick={() => setConfirmarEnvioOpen(false)} 
                variant="ghost" 
                className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest h-14 rounded-[20px]"
              >
                Cancelar e Conferir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </SovereignShowcase>
  );
}
