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
import { Plus, Trash2, ArrowLeft, Printer, Target, Settings2, CalendarDays, Factory, Package, Scissors, Activity, Layers, Zap, Clock, Timer, Calculator, User, AlertTriangle, ShieldCheck, Info, Scale, Search, CheckCircle, Database, Globe, Share2, Maximize2, Minimize2, Lock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

const TEMPO_DISPONIVEL_DIA = 528; // 8.8h * 60min

// MOCK DO BANCO DE ENGENHARIA
const BANCO_ENGENHARIA = [
  { produto: 'CORTE DE PERFIL 6MM', codigo: 'PRF-006', pecasPorCiclo: 4, tempoPadrao: 0.81 },
  { produto: 'CORTE DE PERFIL 4MM', codigo: 'PRF-004', pecasPorCiclo: 7, tempoPadrao: 0.81 },
  { produto: 'CHAPA GALVANIZADA 1.5MM', codigo: 'CHP-1.5', pecasPorCiclo: 1, tempoPadrao: 0.81 },
  { produto: 'JANELA SUPREMA INTEGRADA', codigo: 'JN-SUP-01', pecasPorCiclo: 1, tempoPadrao: 3.5 },
  { produto: 'MONTAGEM DE CONJUNTO E-01', codigo: 'MNT-001', pecasPorCiclo: 1, tempoPadrao: 3.5 },
  { produto: 'SOLDA ESTRUTURAL MIG', codigo: 'SLD-002', pecasPorCiclo: 1, tempoPadrao: 4.2 }
];

interface ComponenteBOM {
  material: string;
  dimensao: string;
  quantidade: string;
  dimL?: string;
  dimA?: string;
  extraDim?: string;
  qtdValor?: string;
  qtdUnidade?: string;
  vidroEsp?: string;
}

const BOM_DATABASE: Record<string, ComponenteBOM[]> = {
  'PRF-006': [
    { material: 'Perfil Alumínio 6mm', dimensao: '1500mm (corte reto)', quantidade: '4 peças' },
    { material: 'Borracha EPDM Vedação', dimensao: '6000mm', quantidade: '1 rolo' }
  ],
  'PRF-004': [
    { material: 'Perfil Alumínio 4mm', dimensao: '1200mm (corte 45º)', quantidade: '4 peças' },
    { material: 'Rolamentos Duplos', dimensao: 'Padrão', quantidade: '2 unidades' }
  ],
  'CHP-1.5': [
    { material: 'Chapa Galv. 1.5mm', dimensao: '1000x2000mm', quantidade: '1 chapa' }
  ],
  'JN-SUP-01': [
    { material: 'Vidro Incolor 4mm', dimensao: '500x900mm', quantidade: '2 peças' },
    { material: 'Perfil Supremo Marco (Suporte Vidro)', dimensao: 'L=1200mm', quantidade: '4 peças' },
    { material: 'Perfil Supremo Marco (Suporte Vidro)', dimensao: 'L=1000mm', quantidade: '4 peças' },
    { material: 'Perfil Supremo Externo (Marco Janela)', dimensao: 'L=1300mm', quantidade: '2 peças' },
    { material: 'Perfil Supremo Externo (Marco Janela)', dimensao: 'L=1100mm', quantidade: '2 peças' },
    { material: 'Vista de Acabamento', dimensao: 'L=1300mm', quantidade: '2 peças' }
  ],
  'MNT-001': [
    { material: 'Quadro Alumínio Suprema', dimensao: 'Padrão', quantidade: '1 conjunto' },
    { material: 'Parafusos Inox', dimensao: '4.2x19mm', quantidade: '4 peças' },
    { material: 'Escova de Vedação', dimensao: '4000mm', quantidade: '1 rolo' }
  ],
  'SLD-002': [
    { material: 'Eletrodo MIG ER70S-6', dimensao: 'Padrão', quantidade: 'Consumível' },
    { material: 'Perfis Chanfrados', dimensao: 'Padrão', quantidade: 'Várias' },
    { material: 'Cantoneiras de reforço L-2x2', dimensao: 'L-2x2', quantidade: '2 peças' }
  ]
};

const obterDetalhesProducao = (nome: string, codigo: string) => {
  const code = (codigo || '').toUpperCase().trim();
  const name = (nome || '').toUpperCase().trim();
  
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`nexus_ppcp_bom_${code}`);
      if (stored) {
        const items = JSON.parse(stored) as ComponenteBOM[];
        if (items.length > 0) {
          return items.map(i => `${i.material}: ${i.quantidade} de ${i.dimensao}`).join(' | ');
        }
      }
    } catch (e) {
      // ignore
    }
  }

  const defaultBOM = BOM_DATABASE[code];
  if (defaultBOM) {
    return defaultBOM.map(i => `${i.material}: ${i.quantidade} de ${i.dimensao}`).join(' | ');
  }
  
  if (name.includes('PERFIL 6MM')) return 'Perfil Alumínio 6mm: 4 peças de 1500mm (corte reto)';
  if (name.includes('PERFIL 4MM')) return 'Perfil Alumínio 4mm: 4 peças de 1200mm (corte 45º)';
  if (name.includes('CHAPA GALVANIZADA')) return 'Chapa Galv. 1.5mm: 1 peça de 1000x2000mm (Corte L x A)';
  
  return 'Componentes Padrão: 2 peças de 1000mm | Acessórios Padrão';
};

const obterItensBOM = (codigo: string) => {
  const code = (codigo || '').toUpperCase().trim();
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`nexus_ppcp_bom_${code}`);
      if (stored) {
        return JSON.parse(stored) as ComponenteBOM[];
      }
    } catch (e) {}
  }
  return BOM_DATABASE[code] || [];
};

interface OperadorSessao {
  id: string;
  nome: string;
  horaInicio: string;
  horaFim: string;
  qtdProduzida?: number;
}

const obterTempoTrabalhadoOperadores = (
  ops?: OperadorSessao[],
  fallbackInicio?: string,
  fallbackFim?: string
): number | null => {
  const parseTimeToMinutes = (timeStr: string) => {
    const parts = (timeStr || '').split(':');
    if (parts.length !== 2) return null;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  if (ops && ops.length > 0) {
    let total = 0;
    let hasValid = false;
    for (const op of ops) {
      if (op.horaInicio && op.horaFim) {
        const minI = parseTimeToMinutes(op.horaInicio);
        const minF = parseTimeToMinutes(op.horaFim);
        if (minI !== null && minF !== null) {
          let diff = minF - minI;
          if (diff <= 0) diff += 1440;
          total += diff;
          hasValid = true;
        }
      }
    }
    return hasValid ? total : null;
  }

  if (fallbackInicio && fallbackFim) {
    const minI = parseTimeToMinutes(fallbackInicio);
    const minF = parseTimeToMinutes(fallbackFim);
    if (minI !== null && minF !== null) {
      let diff = minF - minI;
      if (diff <= 0) diff += 1440;
      return diff;
    }
  }

  return null;
};

const calcularEficienciaOperador = (
  op: { horaInicio?: string; horaFim?: string; qtdProduzida?: number },
  tempoPadrao: number,
  linha: string,
  pecasPorCiclo?: number
) => {
  if (!op.horaInicio || !op.horaFim || !op.qtdProduzida) return null;
  const parseTimeToMinutes = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length !== 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return isNaN(h) || isNaN(m) ? null : h * 60 + m;
  };
  const minI = parseTimeToMinutes(op.horaInicio);
  const minF = parseTimeToMinutes(op.horaFim);
  if (minI === null || minF === null) return null;
  let diff = minF - minI;
  if (diff <= 0) diff += 1440;
  
  const isCorte = (linha || '').toUpperCase() === 'CORTE';
  const pecasPorCicloAjustada = isCorte ? (pecasPorCiclo || 1) : 1;
  const ciclos = op.qtdProduzida / pecasPorCicloAjustada;
  const tempoPadraoMinutos = ciclos * tempoPadrao;
  const eficiencia = (tempoPadraoMinutos / diff) * 100;
  return {
    tempoTrabalhado: diff,
    tempoPadraoMinutos,
    eficiencia: parseFloat(eficiencia.toFixed(1))
  };
};

interface Produto {
  id: string;
  produto: string;
  codigo: string;
  maquina: string;
  pecasPorCiclo: number; 
  tempoPadrao: number; 
  qtdNecessaria: number; 
  auditado: boolean;
  operador?: string;
  horaInicio?: string;
  horaFim?: string;
  qtdProduzida?: number;
  statusProducao?: 'fila' | 'produzindo' | 'concluido';
  observacao?: string;
  cliente?: string;
  opNumero?: string;
  especificacoes?: string;
  operadores?: OperadorSessao[];
  apontadoConcluido?: boolean;
  dataConcluidoApontamento?: string;
}

interface Programacao {
  id: string;
  data: string;
  linha: string;
  lider: string;
  produtos: Produto[];
  status?: 'ativo' | 'concluido';
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
    auditado: false,
    operador: '',
    horaInicio: '',
    horaFim: '',
    qtdProduzida: 0,
    statusProducao: 'fila' as const,
    observacao: ''
  }));

type StatusOP = 'aberta' | 'aguardando_aprovacao' | 'aprovada' | 'em_producao' | 'pronto_expedicao' | 'entregue' | 'cancelada';

const statusConfig: Record<StatusOP, { label: string; color: string }> = {
  aberta:               { label: 'Aberta',              color: 'text-blue-400 border-blue-500/30' },
  aguardando_aprovacao: { label: 'Aguard. Aprovação',   color: 'text-amber-400 border-amber-500/30' },
  aprovada:             { label: 'Aprovada',             color: 'text-emerald-400 border-emerald-500/30' },
  em_producao:          { label: 'Em Produção',          color: 'text-violet-400 border-violet-500/30' },
  pronto_expedicao:     { label: 'Pronto p/ Expedição', color: 'text-cyan-400 border-cyan-500/30' },
  entregue:             { label: 'Entregue',             color: 'text-emerald-400 border-emerald-500/30' },
  cancelada:            { label: 'Cancelada',            color: 'text-rose-400 border-rose-500/30' },
};

const parseQuantidade = (qtdStr: string) => {
  const clean = (qtdStr || '').trim();
  const match = clean.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (match) {
    return {
      qtdValor: match[1],
      qtdUnidade: match[2] || 'peças'
    };
  }
  return {
    qtdValor: clean ? clean.replace(/[^\d\.]/g, '') : '',
    qtdUnidade: clean ? clean.replace(/[\d\s\.]/g, '') : 'peças'
  };
};

const parseDimensao = (dimStr: string, materialName: string) => {
  const clean = (dimStr || '').trim();
  
  // Case 1: L=1200mm or H=1000mm
  const lMatch = clean.match(/L\s*=\s*(\d+)/i);
  const hMatch = clean.match(/(?:H|A)\s*=\s*(\d+)/i);
  if (lMatch || hMatch) {
    return {
      dimL: lMatch ? lMatch[1] : '',
      dimA: hMatch ? hMatch[1] : '',
      extraDim: ''
    };
  }

  // Case 2: 500x900mm or 1000x2000mm
  const xMatch = clean.match(/^(\d+)\s*[xX]\s*(\d+)\s*(.*)$/);
  if (xMatch) {
    return {
      dimL: xMatch[1],
      dimA: xMatch[2],
      extraDim: xMatch[3] ? xMatch[3].trim() : ''
    };
  }

  // Case 3: 1500mm (corte reto) or 1200mm (corte 45º)
  const singleMatch = clean.match(/^(\d+)\s*(?:mm)?\s*(.*)$/i);
  if (singleMatch) {
    return {
      dimL: singleMatch[1],
      dimA: '',
      extraDim: singleMatch[2] ? singleMatch[2].trim() : ''
    };
  }

  return {
    dimL: '',
    dimA: '',
    extraDim: clean
  };
};

export default function PPCPPage() {
  const [programacoes, setProgramacoes] = useState<Programacao[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Programacao | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error("Erro fullscreen:", err));
      } else {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error("Erro exit fullscreen:", err));
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const onFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', onFullscreenChange);
      return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange);
      };
    }
  }, []);

  const [vendasOps, setVendasOps] = useState<any[]>([]);
  const [cronoEstudos, setCronoEstudos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'turnos' | 'planilha' | 'terminal'>('planilha');
  const [setores, setSetores] = useState<string[]>(['CORTE', 'ACABAMENTO', 'SOLDA', 'MONTAGEM']);
  const [activeSectorTab, setActiveSectorTab] = useState<string>('CORTE');
  const [sectorTerminal, setSectorTerminal] = useState<string>('CORTE');
  const [addSectorDialogOpen, setAddSectorDialogOpen] = useState(false);
  const [novoSetorNome, setNovoSetorNome] = useState('');
  const [redeDialogOpen, setRedeDialogOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Estados do Editor de Estrutura de Produto (BOM)
  const [bomActiveProduct, setBomActiveProduct] = useState<{ nome: string; codigo: string } | null>(null);
  const [bomActiveItems, setBomActiveItems] = useState<ComponenteBOM[]>([]);
  const [bomDialogOpen, setBomDialogOpen] = useState(false);
  const [bomUpdateTrigger, setBomUpdateTrigger] = useState(0);
  const [isBomMaximized, setIsBomMaximized] = useState(false);

  useEffect(() => {
    if (!bomDialogOpen) {
      setIsBomMaximized(false);
    }
  }, [bomDialogOpen]);

  const [isProductMaximized, setIsProductMaximized] = useState(false);

  useEffect(() => {
    if (!dialogOpen) {
      setIsProductMaximized(false);
    }
  }, [dialogOpen]);

  const [ultimoAcesso, setUltimoAcesso] = useState<number>(0);
  const [temNovosPedidos, setTemNovosPedidos] = useState(false);
  const [subTabProgramas, setSubTabProgramas] = useState<'ativos' | 'historico'>('ativos');
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [progToArchive, setProgToArchive] = useState<Programacao | null>(null);
  const [viewingHistoryProg, setViewingHistoryProg] = useState<Programacao | null>(null);

  const arquivarPrograma = (id: string) => {
    setProgramacoes(prev => prev.map(p => p.id === id ? { ...p, status: 'concluido' } : p));
    setArchiveDialogOpen(false);
    setProgToArchive(null);
  };

  const restaurarPrograma = (id: string) => {
    setProgramacoes(prev => prev.map(p => p.id === id ? { ...p, status: 'ativo' } : p));
  };

  const reconciliarStatusOPs = (ops: any[], progs: typeof programacoes) => {
    // Coleta opNumeros de produtos de MONTAGEM já apontados como concluídos
    const opsConcluidas = new Set<string>();
    const opsEmProducaoAtiva = new Set<string>();

    progs.forEach(prog => {
      if (prog.linha.toUpperCase() !== 'MONTAGEM') return;
      prog.produtos.forEach(p => {
        if (!p.opNumero) return;
        if (p.apontadoConcluido) {
          opsConcluidas.add(p.opNumero);
        } else if ((prog.status || 'ativo') === 'ativo') {
          opsEmProducaoAtiva.add(p.opNumero);
        }
      });
    });

    let alterou = false;
    const reconciliadas = ops.map(op => {
      // Se está concluída na montagem → pronto_expedicao
      if (opsConcluidas.has(op.numero) && op.status !== 'pronto_expedicao') {
        alterou = true;
        return { ...op, status: 'pronto_expedicao' };
      }
      // Se está em produção ativa na montagem → em_producao
      if (opsEmProducaoAtiva.has(op.numero) && op.status !== 'em_producao' && op.status !== 'pronto_expedicao') {
        alterou = true;
        return { ...op, status: 'em_producao' };
      }
      // Se estava como em_producao mas não há nenhuma programação de montagem ativa → volta para aprovada
      if (op.status === 'em_producao' && !opsEmProducaoAtiva.has(op.numero) && !opsConcluidas.has(op.numero)) {
        alterou = true;
        return { ...op, status: 'aprovada' };
      }
      return op;
    });

    if (alterou && typeof window !== 'undefined') {
      localStorage.setItem('nexus_vendas_ops', JSON.stringify(reconciliadas));
    }
    return reconciliadas;
  };

  const carregarDadosIntegrados = () => {
    if (typeof window !== 'undefined') {
      try {
        const opsRaw = localStorage.getItem('nexus_vendas_ops');
        if (opsRaw) {
          const ops = JSON.parse(opsRaw);
          // Reconcilia status das OPs com base nas programações de montagem atuais
          const reconciliadas = reconciliarStatusOPs(ops, programacoes);
          setVendasOps(reconciliadas);
        }

        const estudosRaw = localStorage.getItem('nexus_cronoanalise_estudos');
        if (estudosRaw) setCronoEstudos(JSON.parse(estudosRaw));
      } catch (e) {
        console.error("Erro ao carregar dados integrados no PPCP:", e);
      }
    }
  };

  const sincronizarPPCP = () => {
    carregarDadosIntegrados();
    // Reconcilia também o estado atual em memória
    setVendasOps(prev => reconciliarStatusOPs(prev, programacoes));
    if (typeof window !== 'undefined') {
      const now = Date.now();
      setUltimoAcesso(now);
      localStorage.setItem('nexus_ppcp_ultimo_acesso', String(now));
      setTemNovosPedidos(false);
    }
  };

  const disponibilizarNaRede = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('http://nexus-mesh.local/ppcp-planilha-geral');
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
    setRedeDialogOpen(true);
  };

  const [formData, setFormData] = useState<{
    data: string;
    linha: string;
    lider: string;
    produtos: Produto[];
  }>({
    data: '',
    linha: '',
    lider: '',
    produtos: gerarLinhasVazias(10)
  });

  useEffect(() => {
    setMounted(true);
    carregarDadosIntegrados();

    if (typeof window !== 'undefined') {
      const storedAcesso = localStorage.getItem('nexus_ppcp_ultimo_acesso');
      if (storedAcesso) {
        setUltimoAcesso(Number(storedAcesso));
      } else {
        const now = Date.now();
        setUltimoAcesso(now);
        localStorage.setItem('nexus_ppcp_ultimo_acesso', String(now));
      }

      try {
        const progsRaw = localStorage.getItem('nexus_ppcp_programacoes');
        if (progsRaw && JSON.parse(progsRaw).length >= 4) {
          const parsed = JSON.parse(progsRaw) as Programacao[];
          setProgramacoes(parsed.map(p => ({
            ...p,
            linha: p.linha === 'AJUSTE' ? 'ACABAMENTO' : p.linha,
            status: p.status || 'ativo',
            produtos: p.produtos.map(prod => {
              if (prod.codigo === 'PRF-006' && prod.pecasPorCiclo === 5) {
                return { ...prod, pecasPorCiclo: 4 };
              }
              return prod;
            })
          })));
        } else {
          // Initialize mock programacoes (one for each of the 4 sectors)
          const mockProgs: Programacao[] = [
            {
              id: 'prog-1',
              data: new Date().toISOString().split('T')[0],
              linha: 'CORTE',
              lider: 'ROBERTO CARLOS',
              produtos: [
                {
                  id: 'p-1',
                  produto: 'CORTE DE PERFIL 6MM',
                  codigo: 'PRF-006',
                  maquina: 'Serra Fita 01',
                  pecasPorCiclo: 4,
                  tempoPadrao: 0.81,
                  qtdNecessaria: 150,
                  auditado: true,
                  statusProducao: 'fila',
                  operador: '',
                  horaInicio: '',
                  horaFim: '',
                  qtdProduzida: 0
                },
                {
                  id: 'p-2',
                  produto: 'CHAPA GALVANIZADA 1.5MM',
                  codigo: 'CHP-1.5',
                  maquina: 'Guilhotina 02',
                  pecasPorCiclo: 1,
                  tempoPadrao: 0.81,
                  qtdNecessaria: 50,
                  auditado: true,
                  statusProducao: 'fila',
                  operador: '',
                  horaInicio: '',
                  horaFim: '',
                  qtdProduzida: 0
                }
              ]
            },
            {
              id: 'prog-2',
              data: new Date().toISOString().split('T')[0],
              linha: 'ACABAMENTO',
              lider: 'MARIA APARECIDA',
              produtos: [
                {
                  id: 'p-3',
                  produto: 'CORTE DE PERFIL 4MM',
                  codigo: 'PRF-004',
                  maquina: 'Bancada 03',
                  pecasPorCiclo: 7,
                  tempoPadrao: 0.81,
                  qtdNecessaria: 210,
                  auditado: true,
                  statusProducao: 'fila',
                  operador: '',
                  horaInicio: '',
                  horaFim: '',
                  qtdProduzida: 0
                }
              ]
            },
            {
              id: 'prog-3',
              data: new Date().toISOString().split('T')[0],
              linha: 'MONTAGEM',
              lider: 'GERALDO PEREIRA',
              produtos: [
                {
                  id: 'p-4',
                  produto: 'MONTAGEM DE CONJUNTO E-01',
                  codigo: 'MNT-001',
                  maquina: 'Posto de Montagem 04',
                  pecasPorCiclo: 1,
                  tempoPadrao: 3.5,
                  qtdNecessaria: 30,
                  auditado: true,
                  statusProducao: 'fila',
                  operador: '',
                  horaInicio: '',
                  horaFim: '',
                  qtdProduzida: 0
                }
              ]
            },
            {
              id: 'prog-4',
              data: new Date().toISOString().split('T')[0],
              linha: 'SOLDA',
              lider: 'JOSÉ DA SILVA',
              produtos: [
                {
                  id: 'p-5',
                  produto: 'SOLDA ESTRUTURAL MIG',
                  codigo: 'SLD-002',
                  maquina: 'Cabine Solda 05',
                  pecasPorCiclo: 1,
                  tempoPadrao: 4.2,
                  qtdNecessaria: 25,
                  auditado: true,
                  statusProducao: 'fila',
                  operador: '',
                  horaInicio: '',
                  horaFim: '',
                  qtdProduzida: 0
                }
              ]
            }
          ];
          setProgramacoes(mockProgs);
          localStorage.setItem('nexus_ppcp_programacoes', JSON.stringify(mockProgs));
        }

        const setoresRaw = localStorage.getItem('nexus_ppcp_setores');
        if (setoresRaw) {
          const parsed = JSON.parse(setoresRaw) as string[];
          const migrado = parsed.map(s => s === 'AJUSTE' ? 'ACABAMENTO' : s);
          setSetores(migrado);
          localStorage.setItem('nexus_ppcp_setores', JSON.stringify(migrado));
        }
      } catch (e) {
        console.error("Erro ao inicializar:", e);
      }
    }
  }, []);

  useEffect(() => {
    const checkNewOrders = () => {
      if (typeof window === 'undefined') return;
      try {
        const opsRaw = localStorage.getItem('nexus_vendas_ops');
        const ultimoAcessoStored = Number(localStorage.getItem('nexus_ppcp_ultimo_acesso') || ultimoAcesso || 0);
        if (opsRaw && ultimoAcessoStored > 0) {
          const currentOps = JSON.parse(opsRaw) as any[];
          const containsNew = currentOps.some(op => {
            if (!op.createdAt) return false;
            const createdTime = new Date(op.createdAt).getTime();
            return createdTime > ultimoAcessoStored && op.status !== 'cancelada';
          });
          setTemNovosPedidos(containsNew);
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkNewOrders();
    const interval = setInterval(checkNewOrders, 5000);
    return () => clearInterval(interval);
  }, [ultimoAcesso]);

  // Persistir programacoes sempre que mudarem
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nexus_ppcp_programacoes', JSON.stringify(programacoes));
    }
  }, [programacoes, mounted]);

  // Persistir setores sempre que mudarem
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nexus_ppcp_setores', JSON.stringify(setores));
    }
  }, [setores, mounted]);

  const abrirNovo = () => {
    setEditando(null);
    setFormData({
      data: new Date().toISOString().split('T')[0],
      linha: activeSectorTab,
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
        auditado: false,
        operador: '',
        horaInicio: '',
        horaFim: '',
        qtdProduzida: 0,
        statusProducao: 'fila',
        observacao: ''
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

  const salvarApontamento = (
    progId: string, 
    produtoId: string, 
    apontamento: { 
      operador: string; 
      horaInicio: string; 
      horaFim: string; 
      qtdProduzida: number; 
      statusProducao: 'fila' | 'produzindo' | 'concluido';
      observacao?: string;
      operadores?: OperadorSessao[];
    },
    confirmarConclusao?: boolean
  ) => {
    // Busca a programacao e o produto para obter linha e opNumero
    let linhaSetor = '';
    let opNumeroProduto = '';
    setProgramacoes(prev => {
      const prog = prev.find(p => p.id === progId);
      if (prog) {
        linhaSetor = prog.linha;
        const prod = prog.produtos.find(p => p.id === produtoId);
        if (prod) opNumeroProduto = prod.opNumero || '';
      }
      return prev.map(prog => {
        if (prog.id !== progId) return prog;
        return {
          ...prog,
          produtos: prog.produtos.map(p => {
            if (p.id !== produtoId) return p;
            return {
              ...p,
              ...apontamento,
              auditado: confirmarConclusao ? true : p.auditado,
              apontadoConcluido: confirmarConclusao ? true : p.apontadoConcluido,
              dataConcluidoApontamento: confirmarConclusao
                ? new Date().toISOString()
                : p.dataConcluidoApontamento
            };
          })
        };
      });
    });

    // ESTÁGIO 2: Se montagem concluiu, eleva status da OP para "Pronto p/ Expedição"
    if (confirmarConclusao && linhaSetor.toUpperCase() === 'MONTAGEM' && opNumeroProduto) {
      setVendasOps(prev => {
        const atualizadas = prev.map(o =>
          o.numero === opNumeroProduto ? { ...o, status: 'pronto_expedicao' } : o
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem('nexus_vendas_ops', JSON.stringify(atualizadas));
        }
        return atualizadas;
      });
    }
  };

  const abrirEditorBOM = (nome: string, codigo: string) => {
    const code = (codigo || '').toUpperCase().trim();
    setBomActiveProduct({ nome, codigo });
    
    let loadedItems: ComponenteBOM[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`nexus_ppcp_bom_${code}`);
      if (stored) {
        loadedItems = JSON.parse(stored);
      } else {
        loadedItems = BOM_DATABASE[code] || [
          { material: 'Componente Alumínio Padrão', dimensao: '1000mm', quantidade: '2 peças' },
          { material: 'Acessório Padrão', dimensao: 'N/A', quantidade: '1 peça' }
        ];
      }
    }

    const structuredItems = loadedItems.map(item => {
      const q = parseQuantidade(item.quantidade);
      const d = parseDimensao(item.dimensao, item.material);
      // Se for perfil, marco, vista, travessa, barra, etc., apenas o comprimento L deve ser mantido
      const isProfile = /perfil|marco|vista|travessa|barra/i.test(item.material);
      
      const isGlass = /vidro/i.test(item.material);
      let vidroEsp = '';
      if (isGlass) {
        const espMatch = item.material.match(/(\d+)\s*mm/i);
        if (espMatch) {
          vidroEsp = espMatch[1];
        }
      }

      return {
        ...item,
        dimL: d.dimL,
        dimA: isProfile ? '' : d.dimA,
        extraDim: d.extraDim,
        qtdValor: q.qtdValor,
        qtdUnidade: q.qtdUnidade,
        vidroEsp
      };
    });

    setBomActiveItems(structuredItems);
    setBomDialogOpen(true);
  };

  const salvarBOM = () => {
    if (!bomActiveProduct) return;
    const code = bomActiveProduct.codigo.toUpperCase().trim();
    
    const consolidatedItems = bomActiveItems.map(item => {
      const valor = (item.qtdValor || '').trim();
      const unidade = (item.qtdUnidade || 'peças').trim();
      const quantidade = valor ? `${valor} ${unidade}` : unidade;

      const l = (item.dimL || '').trim();
      const a = (item.dimA || '').trim();
      const extra = (item.extraDim || '').trim();
      
      let dimensao = '';
      if (l && a) {
        dimensao = `${l}x${a}mm`;
      } else if (l) {
        const mat = (item.material || '').toUpperCase();
        if (mat.includes('PERFIL') || mat.includes('MARCO')) {
          dimensao = `L=${l}mm`;
        } else {
          dimensao = `${l}mm`;
        }
      } else if (a) {
        dimensao = `H=${a}mm`;
      } else {
        dimensao = 'Padrão';
      }

      if (extra) {
        dimensao = dimensao ? `${dimensao} (${extra})` : extra;
      }

      let material = item.material;
      const isGlass = /vidro/i.test(material);
      if (isGlass && item.vidroEsp) {
        if (/\d+\s*mm/i.test(material)) {
          material = material.replace(/\d+\s*mm/i, `${item.vidroEsp}mm`);
        } else {
          material = `${material} ${item.vidroEsp}mm`;
        }
      }

      return {
        material,
        dimensao,
        quantidade
      };
    });

    localStorage.setItem(`nexus_ppcp_bom_${code}`, JSON.stringify(consolidatedItems));
    setBomDialogOpen(false);
    setBomUpdateTrigger(prev => prev + 1);
    carregarDadosIntegrados();
  };

  const adicionarComponenteBOM = () => {
    setBomActiveItems(prev => [
      ...prev,
      { 
        material: 'Novo Componente', 
        dimensao: '1000mm', 
        quantidade: '1 peça',
        dimL: '1000',
        dimA: '',
        extraDim: '',
        qtdValor: '1',
        qtdUnidade: 'peças'
      }
    ]);
  };

  const atualizarComponenteBOM = (index: number, field: keyof ComponenteBOM, value: string) => {
    setBomActiveItems(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      return { ...item, [field]: value };
    }));
  };

  const removerComponenteBOM = (index: number) => {
    setBomActiveItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const explodirBOM = (startIndex: number, codigo: string) => {
    const code = (codigo || '').toUpperCase().trim();
    const bomItems = obterItensBOM(code);
    if (bomItems.length === 0) return;

    const novos = [...formData.produtos];
    const multiplier = novos[startIndex]?.qtdNecessaria || 1;
    
    let currentIdx = startIndex;
    
    bomItems.forEach((item) => {
      const q = parseQuantidade(item.quantidade);
      const baseVal = parseFloat(q.qtdValor) || 1;
      const totalVal = baseVal * multiplier;
      
      const newProduct: Produto = {
        id: Math.random().toString(36).substr(2, 9),
        produto: `${item.material} (${item.dimensao})`,
        codigo: `${code}`,
        maquina: 'Serra Fita 01',
        pecasPorCiclo: 1,
        tempoPadrao: 0.81,
        qtdNecessaria: totalVal,
        auditado: true,
        statusProducao: 'fila',
        operador: '',
        horaInicio: '',
        horaFim: '',
        qtdProduzida: 0
      };

      if (currentIdx < novos.length) {
        if (currentIdx === startIndex || (!novos[currentIdx].produto && novos[currentIdx].qtdNecessaria === 0)) {
          novos[currentIdx] = newProduct;
        } else {
          novos.splice(currentIdx, 0, newProduct);
        }
      } else {
        novos.push(newProduct);
      }
      currentIdx++;
    });

    setFormData(prev => ({ ...prev, produtos: novos }));
  };

  const calcularLinha = (p: Produto, linha: string) => {
    const isCorte = (linha || '').toUpperCase() === 'CORTE';
    const pecasPorCicloAjustada = isCorte ? (p.pecasPorCiclo || 1) : 1;
    const ciclos = Math.ceil(p.qtdNecessaria / pecasPorCicloAjustada);
    const tempoNecessario = ciclos * (p.tempoPadrao || 0);
    return { ciclos, tempoNecessario, pecasPorCicloAjustada };
  };

  const matrixCalculated = useMemo(() => {
    let saldoAcumulado = TEMPO_DISPONIVEL_DIA;
    return formData.produtos.map(p => {
      const { ciclos, tempoNecessario } = calcularLinha(p, formData.linha);
      if (p.produto || p.qtdNecessaria > 0) {
        saldoAcumulado -= tempoNecessario;
      }
      return { ...p, ciclos, tempoNecessario, saldoRestante: saldoAcumulado };
    });
  }, [formData.produtos, formData.linha]);

  const summary = useMemo(() => {
    return matrixCalculated.reduce((acc, p) => {
      acc.totalMinutos += p.tempoNecessario;
      acc.totalPecas += p.qtdNecessaria;
      return acc;
    }, { totalMinutos: 0, totalPecas: 0 });
  }, [matrixCalculated]);

  const itensProducao = useMemo(() => {
    const list: any[] = [];
    vendasOps.forEach(op => {
      if (op.status === 'cancelada') return;
      
      op.itens.forEach((item: any) => {
        const matchingEstudo = cronoEstudos.find(est => est.codigo === item.produtoCodigo);
        
        let tempoPadrao = 0.81;
        let pecasPorCiclo = 1;
        let origem = 'default';
        let estudoId = null;

        if (matchingEstudo) {
          const tempos = matchingEstudo.tomadas
            .map((t: any) => {
              if (!t.tempo) return 0;
              let val = String(t.tempo).trim().replace(',', '.');
              return parseFloat(val) || 0;
            })
            .filter((v: number) => v > 0);
            
          if (tempos.length > 0) {
            const soma = tempos.reduce((a: number, b: number) => a + b, 0);
            const mediaSemFadiga = soma / tempos.length;
            tempoPadrao = mediaSemFadiga * (1 + (matchingEstudo.fadiga / 100));
            pecasPorCiclo = matchingEstudo.pecasPorCiclo || 1;
            origem = 'cronoanalise';
            estudoId = matchingEstudo.id;
          }
        }

        const ciclos = Math.ceil(item.quantidade / (pecasPorCiclo || 1));
        const tempoTotal = ciclos * tempoPadrao;

        list.push({
          id: `${op.id}-${item.produtoCodigo}`,
          opNumero: op.numero,
          cliente: op.cliente,
          produtoNome: item.produtoNome,
          produtoCodigo: item.produtoCodigo,
          quantidade: item.quantidade,
          pecasPorCiclo,
          tempoPadrao,
          tempoTotal,
          status: op.status,
          origem,
          estudoId,
          dataEntrega: op.dataEntregaPrevista,
          createdAt: op.createdAt
        });
      });
    });
    return list;
  }, [vendasOps, cronoEstudos]);

  const planilhaSummary = useMemo(() => {
    return itensProducao.reduce((acc, item) => {
      acc.totalPecas += item.quantidade;
      acc.totalMinutos += item.tempoTotal;
      return acc;
    }, { totalPecas: 0, totalMinutos: 0 });
  }, [itensProducao]);

  const salvar = () => {
    if (!formData.data || !formData.linha) return;
    const produtosValidos = formData.produtos
      .filter(p => p.produto.trim() !== '' || p.qtdNecessaria > 0)
      .map(p => {
        const isCorte = (formData.linha || '').toUpperCase() === 'CORTE';
        const pecasPorCicloAjustada = isCorte ? (p.pecasPorCiclo || 1) : 1;
        const ciclos = Math.ceil(p.qtdNecessaria / pecasPorCicloAjustada);
        const tempoNecessario = ciclos * (p.tempoPadrao || 0);
        const pecasPorHora = p.tempoPadrao > 0 ? (pecasPorCicloAjustada * 60) / p.tempoPadrao : 0;
        return { 
          ...p, 
          id: Math.random().toString(36).substr(2, 9),
          ciclos,
          tempoNecessario,
          pecasPorHora
        };
      });
    
    if (produtosValidos.length === 0) return;

    const novaProg: Programacao = { 
      id: editando ? editando.id : Math.random().toString(36).substr(2, 9),
      data: formData.data,
      linha: formData.linha,
      lider: formData.lider,
      produtos: produtosValidos,
      status: editando ? (editando.status || 'ativo') : 'ativo'
    };

    setProgramacoes(prev => {
      if (editando) return prev.map(p => p.id === editando.id ? novaProg : p);
      return [...prev, novaProg];
    });

    setDialogOpen(false);
  };

  const enviarParaMontagem = (item: any) => {
    // Busca a OP completa para obter TODOS os itens
    const op = vendasOps.find(o => o.numero === item.opNumero);
    if (!op) return;

    const especificacoes = op.observacoes || '';
    const targetDate = item.dataEntrega || op.dataEntregaPrevista || new Date().toISOString().split('T')[0];

    // Converte cada item da OP em uma operação separada de montagem
    const todosProdutos: Produto[] = op.itens.map((opItem: any) => {
      // Usa dados de cronoanálise se disponível para tempo/ciclo corretos
      const estudo = cronoEstudos.find((e: any) => e.codigo === opItem.produtoCodigo);
      let tempoPadrao = 0.81;
      let pecasPorCiclo = 1;
      if (estudo) {
        const tempos = estudo.tomadas
          .map((t: any) => parseFloat(String(t.tempo || '0').replace(',', '.')) || 0)
          .filter((v: number) => v > 0);
        if (tempos.length > 0) {
          const media = tempos.reduce((a: number, b: number) => a + b, 0) / tempos.length;
          tempoPadrao = media * (1 + (estudo.fadiga / 100));
          pecasPorCiclo = estudo.pecasPorCiclo || 1;
        }
      }
      return {
        id: Math.random().toString(36).substr(2, 9),
        produto: opItem.produtoNome,
        codigo: opItem.produtoCodigo,
        maquina: 'Posto de Montagem 01',
        pecasPorCiclo,
        tempoPadrao,
        qtdNecessaria: opItem.quantidade,
        auditado: true,
        statusProducao: 'fila' as const,
        operador: '',
        horaInicio: '',
        horaFim: '',
        qtdProduzida: 0,
        observacao: '',
        cliente: op.cliente,
        opNumero: op.numero,
        especificacoes
      };
    });

    setProgramacoes(prev => {
      const progExistente = prev.find(p =>
        p.linha.toUpperCase() === 'MONTAGEM' &&
        p.data === targetDate &&
        (p.status || 'ativo') === 'ativo'
      );

      let novasProgs;
      if (progExistente) {
        // Filtra apenas os que ainda não estão na fila (evita duplicatas)
        const novos = todosProdutos.filter(np =>
          !progExistente.produtos.some(p => p.codigo === np.codigo && p.opNumero === np.opNumero)
        );
        if (novos.length === 0) {
          alert(`Todos os ${todosProdutos.length} itens da OP ${op.numero} já estão programados para Montagem!`);
          return prev;
        }
        novasProgs = prev.map(p =>
          p.id === progExistente.id
            ? { ...p, produtos: [...p.produtos, ...novos] }
            : p
        );
        alert(`${novos.length} operação(ões) da OP ${op.numero} adicionadas ao programa de Montagem do dia ${new Date(targetDate + 'T00:00:00').toLocaleDateString('pt-BR')}!`);
      } else {
        const novaProg: Programacao = {
          id: Math.random().toString(36).substr(2, 9),
          data: targetDate,
          linha: 'MONTAGEM',
          lider: 'GERALDO PEREIRA',
          produtos: todosProdutos,
          status: 'ativo'
        };
        novasProgs = [novaProg, ...prev];
        alert(`Programa de Montagem criado com ${todosProdutos.length} operação(ões) da OP ${op.numero} para ${new Date(targetDate + 'T00:00:00').toLocaleDateString('pt-BR')}!`);
      }
      return novasProgs;
    });

    // ESTÁGIO 1: Atualiza status da OP para "Em Produção"
    setVendasOps(prev => {
      const atualizadas = prev.map(o =>
        o.numero === op.numero ? { ...o, status: 'em_producao' } : o
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexus_vendas_ops', JSON.stringify(atualizadas));
      }
      return atualizadas;
    });
  };

  const updateProduto = (index: number, field: keyof Produto, value: string | number) => {
    const novos = [...formData.produtos];
    novos[index] = { ...novos[index], [field]: value };
    
    if (field === 'produto') {
      const match = BANCO_ENGENHARIA.find(i => i.produto === String(value).toUpperCase());
      if (match) {
        if (formData.linha.toUpperCase() === 'CORTE') {
          setTimeout(() => explodirBOM(index, match.codigo), 50);
        } else {
          novos[index] = { 
            ...novos[index], 
            codigo: match.codigo, 
            pecasPorCiclo: match.pecasPorCiclo, 
            tempoPadrao: match.tempoPadrao,
            auditado: true
          };
        }
      } else {
        novos[index].auditado = false;
      }
    } else if (field === 'codigo') {
      const match = BANCO_ENGENHARIA.find(i => i.codigo === String(value).toUpperCase().trim());
      if (match) {
        if (formData.linha.toUpperCase() === 'CORTE') {
          setTimeout(() => explodirBOM(index, match.codigo), 50);
        } else {
          novos[index] = { 
            ...novos[index], 
            produto: match.produto, 
            pecasPorCiclo: match.pecasPorCiclo, 
            tempoPadrao: match.tempoPadrao,
            auditado: true
          };
        }
      } else {
        novos[index].auditado = false;
      }
    }
    setFormData(prev => ({ ...prev, produtos: novos }));
  };

  const aplicarItemEngenharia = (idx: number, item: typeof BANCO_ENGENHARIA[0]) => {
    if (formData.linha.toUpperCase() === 'CORTE') {
      explodirBOM(idx, item.codigo);
    } else {
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
    }
  };

  // Proteção suave contra erros de hidratação
  const isClient = mounted;

  return (
    <SovereignShowcase moduleName="Nexus PPCP" imagePath="/Nexus Empresas/Dante PPCP.png">
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
        <div className="flex gap-3 items-center">
          <Button 
            variant="outline" 
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-10 w-10 p-0 rounded-xl flex items-center justify-center transition-all"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
          >
            {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </Button>
          <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Exportar Planilha
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest h-10 px-6 rounded-xl text-[11px]" onClick={abrirNovo}>
            <Plus className="mr-2 h-4 w-4" /> Nova Programação
          </Button>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-zinc-800 gap-6">
        <button
          onClick={() => setActiveTab('planilha')}
          className={cn(
            "pb-4 text-xs font-black uppercase tracking-widest border-b-2 px-2 transition-all",
            activeTab === 'planilha' ? "border-amber-500 text-amber-400" : "border-transparent text-gray-500 hover:text-white"
          )}
        >
          <Layers className="inline-block mr-2 h-4 w-4" /> Controle de Pedidos
        </button>
        <button
          onClick={() => setActiveTab('turnos')}
          className={cn(
            "pb-4 text-xs font-black uppercase tracking-widest border-b-2 px-2 transition-all",
            activeTab === 'turnos' ? "border-amber-500 text-amber-400" : "border-transparent text-gray-500 hover:text-white"
          )}
        >
          <Factory className="inline-block mr-2 h-4 w-4" /> Programas
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={cn(
            "pb-4 text-xs font-black uppercase tracking-widest border-b-2 px-2 transition-all",
            activeTab === 'terminal' ? "border-amber-500 text-amber-400" : "border-transparent text-gray-500 hover:text-white"
          )}
        >
          <Zap className="inline-block mr-2 h-4 w-4 text-amber-500 animate-pulse" /> Terminal do Líder (Chão de Fábrica)
        </button>
      </div>

      {activeTab === 'turnos' && (
        <>
          {/* NAVEGAÇÃO DE SUB-ABAS INTERNAS: ATIVOS VS HISTÓRICO */}
          <div className="flex border-b border-zinc-800/80 mb-6 gap-6 justify-start w-full">
            <button
              onClick={() => setSubTabProgramas('ativos')}
              className={cn(
                "pb-3 text-[10px] font-black uppercase tracking-wider border-b-2 px-2 transition-all flex items-center gap-1.5",
                subTabProgramas === 'ativos' ? "border-amber-500 text-amber-400" : "border-transparent text-gray-500 hover:text-white"
              )}
            >
              <Activity className="h-4 w-4" /> Programas Ativos & Planejamento
            </button>
            <button
              onClick={() => setSubTabProgramas('historico')}
              className={cn(
                "pb-3 text-[10px] font-black uppercase tracking-wider border-b-2 px-2 transition-all flex items-center gap-1.5",
                subTabProgramas === 'historico' ? "border-amber-500 text-amber-400" : "border-transparent text-gray-500 hover:text-white"
              )}
            >
              <Clock className="h-4 w-4" /> Histórico Concluído
            </button>
          </div>

          {subTabProgramas === 'ativos' ? (
            <>
              {/* SELETOR DE SUB-ABAS DE SETOR NOS PROGRAMAS */}
          <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[35px] p-6 shadow-xl backdrop-blur-md mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left w-full">
            <div className="space-y-1">
              <h2 className="text-base font-black text-amber-400 uppercase italic tracking-wider flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-amber-500" />
                Linha de Produção Ativa
              </h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Filtre a programação pelo setor industrial</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {setores.map(setor => (
                <button
                  key={setor}
                  onClick={() => setActiveSectorTab(setor)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                    activeSectorTab === setor
                      ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-amber-400"
                      : "bg-transparent text-gray-500 border-zinc-800 hover:text-white hover:border-zinc-700"
                  )}
                >
                  {setor}
                </button>
              ))}
              <Button 
                onClick={() => setAddSectorDialogOpen(true)}
                variant="outline" 
                className="border-dashed border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Setor
              </Button>
            </div>
          </div>

          {/* DASHBOARD DE PROGRAMAS */}
          <div className="flex flex-wrap gap-16 w-full justify-start">
            {programacoes.filter(prog => prog.linha.toUpperCase() === activeSectorTab.toUpperCase() && (prog.status || 'ativo') === 'ativo').length === 0 ? (
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-[30px] p-16 text-center w-full max-w-lg mx-auto space-y-4">
                <Factory className="h-12 w-12 text-amber-500/20 mx-auto" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Sem programas agendados em {activeSectorTab}</p>
                <p className="text-[10px] text-gray-600 max-w-xs mx-auto">Use o botão "Nova Programação" no topo para planejar um programa para esta linha.</p>
              </div>
            ) : (
              programacoes
                .filter(prog => prog.linha.toUpperCase() === activeSectorTab.toUpperCase() && (prog.status || 'ativo') === 'ativo')
                .map((prog) => {
              const stats = prog.produtos.reduce((acc, p) => {
                const c = calcularLinha(p, prog.linha);
                const isCorte = (prog.linha || '').toUpperCase() === 'CORTE';
                const targetQtd = isCorte ? c.ciclos * (p.pecasPorCiclo || 1) : p.qtdNecessaria;
                acc.tempo += c.tempoNecessario;
                acc.pecas += targetQtd;
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
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 text-[10px] font-black uppercase text-emerald-400 hover:bg-emerald-500/10 px-4 rounded-lg flex items-center gap-1"
                          onClick={() => {
                            setProgToArchive(prog);
                            setArchiveDialogOpen(true);
                          }}
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Concluir & Arquivar
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black uppercase text-amber-400 hover:bg-amber-500/10 px-4 rounded-lg" onClick={() => abrirEditar(prog)}>Ajustar</Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-500/10 rounded-lg" onClick={() => setProgramacoes(prev => prev.filter(x => x.id !== prog.id))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                   </div>

                   <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-amber-500/5">
                            <TableRow className="border-amber-500/10">
                              <TableHead className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Item Programado</TableHead>
                              <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Código</TableHead>
                              <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Qtd Prog.</TableHead>
                              <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Progresso / Status</TableHead>
                              <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Operador / Tempo</TableHead>
                              <TableHead className="text-right px-10 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">T. Nec (min)</TableHead>
                              <TableHead className="text-left px-10 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] w-full min-w-[250px]">Observação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                          {prog.produtos.map((p) => {
                            const c = calcularLinha(p, prog.linha);
                            const isCorte = (prog.linha || '').toUpperCase() === 'CORTE';
                            const targetQtd = isCorte ? c.ciclos * (p.pecasPorCiclo || 1) : p.qtdNecessaria;
                            const pctProg = targetQtd > 0 ? Math.round(((p.qtdProduzida || 0) / targetQtd) * 100) : 0;
                            const st = p.statusProducao || 'fila';
                            
                            // Calculate efficiency real
                            let efReal = null;
                            if (p.qtdProduzida) {
                              const diff = obterTempoTrabalhadoOperadores(p.operadores, p.horaInicio, p.horaFim);
                              if (diff !== null && diff > 0) {
                                const pecasPorCicloAjustada = isCorte ? (p.pecasPorCiclo || 1) : 1;
                                const ciclos = p.qtdProduzida / pecasPorCicloAjustada;
                                const tPad = ciclos * p.tempoPadrao;
                                efReal = Math.round((tPad / diff) * 100);
                              }
                            }

                            // Find matching OP
                            const matchingOp = vendasOps.find(op => 
                              op.itens && op.itens.some((item: any) => item.produtoCodigo === p.codigo)
                            );

                            return (
                              <TableRow key={p.id} className="border-amber-500/5 hover:bg-amber-500/5 transition-colors">
                                <TableCell className="px-10 py-5 font-black text-sm uppercase text-white tracking-tight flex items-center gap-3 flex-wrap">
                                  {p.produto}
                                  {p.auditado && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                                  {p.codigo && (prog.linha || '').toUpperCase() !== 'ACABAMENTO' && (
                                    <Badge 
                                      onClick={() => abrirEditorBOM(p.produto, p.codigo)}
                                      className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ml-2 cursor-pointer flex items-center gap-1 transition-all"
                                      title="Ver Estrutura (BOM)"
                                    >
                                      <Settings2 className="h-2.5 w-2.5" /> Estrutura
                                    </Badge>
                                  )}
                                  {prog.linha.toUpperCase() === 'MONTAGEM' && (
                                    matchingOp ? (
                                      <Link href={`/intelligence/vendas?op=${matchingOp.numero}`}>
                                        <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ml-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-1 transition-all">
                                          <Layers className="h-2.5 w-2.5" /> OP #{matchingOp.numero}
                                        </Badge>
                                      </Link>
                                    ) : (
                                      <Link href="/intelligence/vendas">
                                        <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ml-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-1 transition-all">
                                          <Globe className="h-2.5 w-2.5" /> Ir para Vendas
                                        </Badge>
                                      </Link>
                                    )
                                  )}
                                  {(p.cliente || p.opNumero) && (
                                    <div className="w-full flex flex-wrap gap-2 mt-1.5 items-center">
                                      {p.cliente && (
                                        <Badge className="bg-zinc-900 border border-zinc-800 text-gray-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                          Cliente: {p.cliente}
                                        </Badge>
                                      )}
                                      {p.opNumero && (
                                        <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                          OP: #{p.opNumero}
                                        </Badge>
                                      )}
                                      {p.especificacoes && (
                                        <span className="text-[9px] text-amber-400/80 font-bold block max-w-md truncate" title={p.especificacoes}>
                                          Obs: {p.especificacoes}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-center font-mono text-[10px] text-gray-500">{p.codigo}</TableCell>
                                <TableCell className="text-center font-bold text-gray-300 text-base">
                                  {targetQtd.toLocaleString()}
                                  {targetQtd - p.qtdNecessaria > 0 && (
                                    <span className="block text-[9px] text-emerald-400 font-semibold mt-0.5">(Sobra: +{targetQtd - p.qtdNecessaria})</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2">
                                      <Badge className={cn(
                                        "text-[8px] font-black uppercase py-0.5 px-2 bg-transparent border",
                                        st === 'concluido' ? "text-emerald-400 border-emerald-500/30" :
                                        st === 'produzindo' ? "text-violet-400 border-violet-500/30 animate-pulse" :
                                        "text-zinc-500 border-zinc-700"
                                      )}>
                                        {st === 'concluido' ? 'Concluído' : st === 'produzindo' ? 'Produzindo' : 'Fila'}
                                      </Badge>
                                      {st !== 'fila' && (
                                        <div className="flex flex-col items-center gap-0.5">
                                          <span className="text-[10px] font-mono text-gray-400">{p.qtdProduzida || 0} / {targetQtd}</span>
                                          {targetQtd - p.qtdNecessaria > 0 && (
                                            <span className="text-[8px] text-emerald-500 font-medium">(Sobra: +{targetQtd - p.qtdNecessaria})</span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    {st !== 'fila' && (
                                      <div className="w-24 h-1.5 bg-zinc-900 border border-white/5 rounded-full overflow-hidden mt-1">
                                        <div 
                                          className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            st === 'concluido' ? "bg-emerald-500" : "bg-violet-500"
                                          )} 
                                          style={{ width: `${Math.min(pctProg, 100)}%` }} 
                                        />
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  {p.operadores && p.operadores.length > 0 ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="flex flex-col items-center gap-0.5 max-h-[100px] overflow-y-auto pr-1">
                                        {p.operadores.map((op) => (
                                          <div key={op.id} className="flex flex-col items-center border-b border-white/5 pb-1 last:border-b-0">
                                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-tight">{op.nome || 'Sem Nome'}</span>
                                            {op.horaInicio && op.horaFim && (
                                              <span className="text-[8px] text-gray-500 font-mono">({op.horaInicio} - {op.horaFim})</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      {efReal !== null && (
                                        <Badge className={cn(
                                          "text-[8px] font-black mt-1 px-1.5 py-0",
                                          efReal >= 100 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                                          efReal >= 80 ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                          "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                        )}>
                                          {efReal}% Efic.
                                        </Badge>
                                      )}
                                    </div>
                                  ) : p.operador ? (
                                    <div className="flex flex-col items-center gap-0.5">
                                      <span className="text-[11px] font-black text-amber-400 uppercase tracking-tight">{p.operador}</span>
                                      <span className="text-[9px] text-gray-500 font-mono">({p.horaInicio} - {p.horaFim})</span>
                                      {efReal !== null && (
                                        <Badge className={cn(
                                          "text-[8px] font-black mt-1 px-1.5 py-0",
                                          efReal >= 100 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                                          efReal >= 80 ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                          "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                        )}>
                                          {efReal}% Efic.
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-gray-700 italic">--</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right px-10 font-black text-amber-400 text-base">{c.tempoNecessario.toFixed(2)}</TableCell>
                                <TableCell className="text-left px-10 py-3 w-full">
                                  <Input
                                    placeholder="Atrasos, quebras, OS manutenção, faltas, etc..."
                                    value={p.observacao || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProgramacoes(prev => prev.map(item => {
                                        if (item.id === prog.id) {
                                          return {
                                            ...item,
                                            produtos: item.produtos.map(prod => prod.id === p.id ? { ...prod, observacao: val } : prod)
                                          };
                                        }
                                        return item;
                                      }));
                                    }}
                                    className="bg-black/40 border border-white/5 h-9 rounded-xl text-xs font-semibold text-gray-300 placeholder:text-gray-700 focus-visible:ring-1 focus-visible:ring-amber-500/50 w-full min-w-[220px]"
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="p-8 bg-black/40 border-t border-amber-500/10 flex justify-between items-center">
                        <div className="flex gap-10 items-center">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Ocupação do Programa</span>
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
            })
            )}
          </div>
          </>
          ) : (
            <div className="space-y-6">
              {/* LISTA DO HISTÓRICO */}
              {programacoes.filter(prog => (prog.status || 'ativo') === 'concluido').length === 0 ? (
                <div className="bg-zinc-950/40 border border-zinc-800 rounded-[30px] p-16 text-center w-full max-w-lg mx-auto space-y-4">
                  <Clock className="h-12 w-12 text-amber-500/20 mx-auto animate-pulse" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Sem históricos arquivados</p>
                  <p className="text-[10px] text-gray-600 max-w-xs mx-auto">Quando um programa de produção for concluído no chão de fábrica, clique em "Concluir & Arquivar" para guardá-lo aqui.</p>
                </div>
              ) : (
                <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
                  <Table>
                    <TableHeader className="bg-amber-500/5">
                      <TableRow className="border-amber-500/10 hover:bg-transparent">
                        <TableHead className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Data</TableHead>
                        <TableHead className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Setor / Linha</TableHead>
                        <TableHead className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Líder do Turno</TableHead>
                        <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Peças Produzidas</TableHead>
                        <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Tempo Total (min)</TableHead>
                        <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Eficiência Média</TableHead>
                        <TableHead className="text-right px-10 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programacoes
                        .filter(prog => (prog.status || 'ativo') === 'concluido')
                        .map((prog) => {
                          const totalPlanejado = prog.produtos.reduce((acc, p) => {
                            const isCorte = (prog.linha || '').toUpperCase() === 'CORTE';
                            const pecasPorCicloAjustada = isCorte ? (p.pecasPorCiclo || 1) : 1;
                            const cycles = Math.ceil(p.qtdNecessaria / pecasPorCicloAjustada);
                            return acc + (isCorte ? (cycles * pecasPorCicloAjustada) : p.qtdNecessaria);
                          }, 0);
                          const totalProduzido = prog.produtos.reduce((acc, p) => acc + (p.qtdProduzida || 0), 0);
                          const totalTempo = prog.produtos.reduce((acc, p) => acc + (calcularLinha(p, prog.linha).tempoNecessario || 0), 0);
                          
                          // Calculate average efficiency for the shift
                          let totalRealMinutes = 0;
                          let totalStandardMinutes = 0;
                          prog.produtos.forEach(p => {
                            if (p.qtdProduzida) {
                              const diff = obterTempoTrabalhadoOperadores(p.operadores, p.horaInicio, p.horaFim);
                              if (diff !== null && diff > 0) {
                                totalRealMinutes += diff;
                                const isCorte = (prog.linha || '').toUpperCase() === 'CORTE';
                                const pecasPorCicloAjustada = isCorte ? (p.pecasPorCiclo || 1) : 1;
                                const ciclos = p.qtdProduzida / pecasPorCicloAjustada;
                                totalStandardMinutes += ciclos * p.tempoPadrao;
                              }
                            }
                          });
                          
                          const efMed = totalRealMinutes > 0 ? Math.round((totalStandardMinutes / totalRealMinutes) * 100) : null;

                          return (
                            <TableRow key={prog.id} className="border-amber-500/5 hover:bg-amber-500/5 transition-colors">
                              <TableCell className="px-10 py-5 font-black text-sm uppercase text-white tracking-tight">
                                {isClient && prog.data ? new Date(prog.data + 'T00:00:00').toLocaleDateString('pt-BR') : prog.data}
                              </TableCell>
                              <TableCell className="font-black text-xs text-amber-400 uppercase italic tracking-wider">
                                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px] px-3 font-bold">{prog.linha}</Badge>
                              </TableCell>
                              <TableCell className="font-bold text-gray-300 text-xs uppercase">{prog.lider || 'Sem Líder'}</TableCell>
                              <TableCell className="text-center font-bold text-gray-300 text-xs">
                                {totalProduzido.toLocaleString('pt-BR')} / {totalPlanejado.toLocaleString('pt-BR')}
                              </TableCell>
                              <TableCell className="text-center font-mono text-[10px] text-gray-400">
                                {totalTempo.toFixed(1)} min
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {efMed !== null ? (
                                  <Badge className={cn(
                                    "text-[9px] font-black px-2.5 py-0.5 bg-transparent border",
                                    efMed >= 100 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                                    efMed >= 80 ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                    "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  )}>
                                    {efMed}% Efic.
                                  </Badge>
                                ) : (
                                  <span className="text-[10px] text-gray-600 font-bold">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right px-10">
                                <div className="flex gap-2 justify-end">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 text-[10px] font-black uppercase text-amber-400 hover:bg-amber-500/10 px-3 rounded-lg border border-amber-500/20 hover:border-amber-500/50"
                                    onClick={() => setViewingHistoryProg(prog)}
                                  >
                                    Ver Detalhes
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:bg-white/5 px-3 rounded-lg border border-zinc-800"
                                    onClick={() => restaurarPrograma(prog.id)}
                                  >
                                    Restaurar
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'planilha' && (
        <div className="space-y-8">
          {temNovosPedidos && (
            <div className="bg-violet-950/20 border border-violet-500/30 rounded-[30px] p-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-[pulse_3s_infinite] text-left">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-violet-400 animate-bounce shrink-0" />
                <div>
                  <h4 className="text-sm font-black uppercase text-violet-400 tracking-wider">Novos Pedidos Lançados!</h4>
                  <p className="text-xs text-gray-400 mt-1">Existem novos pedidos na Central de Vendas que foram cadastrados recentemente.</p>
                </div>
              </div>
              <Button 
                onClick={sincronizarPPCP}
                className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest px-6 h-10 rounded-xl text-[10px]"
              >
                <Activity className="mr-2 h-4 w-4 animate-spin" /> Sincronizar Agora
              </Button>
            </div>
          )}
          {/* CARDS RÁPIDOS (KPIs) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[30px] p-6 shadow-xl backdrop-blur-md">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Ordens Ativas (OPs)</p>
              <p className="text-3xl font-black text-white italic text-left">{new Set(itensProducao.map(i => i.opNumero)).size}</p>
              <p className="text-[10px] text-gray-600 mt-2 text-left">Sincronizadas com o Vendas</p>
            </div>
            <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[30px] p-6 shadow-xl backdrop-blur-md">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Total de Peças</p>
              <p className="text-3xl font-black text-white italic text-left">{planilhaSummary.totalPecas.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-gray-600 mt-2 text-left">Unidades em fila de produção</p>
            </div>
            <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[30px] p-6 shadow-xl backdrop-blur-md">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Carga Total de Trabalho</p>
              <p className="text-3xl font-black text-amber-400 italic text-left">
                {planilhaSummary.totalMinutos.toFixed(1)} <span className="text-xs font-normal text-gray-600">min</span>
              </p>
              <p className="text-[10px] text-gray-600 mt-2 text-left">~{(planilhaSummary.totalMinutos / 60).toFixed(1)} horas estimadas</p>
            </div>
            <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[30px] p-6 shadow-xl backdrop-blur-md">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Ocupação da Fábrica</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-3xl font-black text-emerald-400 italic text-left">
                  {((planilhaSummary.totalMinutos / (TEMPO_DISPONIVEL_DIA * 5)) * 100).toFixed(1)}%
                </p>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black tracking-widest">
                  Capacidade Semanal (5 dias)
                </Badge>
              </div>
              <p className="text-[10px] text-gray-600 mt-2 text-left">Meta baseada em 53 min de hora útil</p>
            </div>
          </div>

          {/* TABELA DE ITENS EXPLODIDOS */}
          <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md text-left">
            <div className="p-8 bg-amber-500/5 border-b border-amber-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white italic">Planilha Mestre - Pedidos Vendas</h3>
                <p className="text-xs text-gray-500 mt-1">Dados consolidados e integrados das vendas e estudos de cronometragem.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={() => window.print()} 
                  variant="outline" 
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Printer className="mr-2 h-4 w-4" /> Imprimir
                </Button>
                <Button 
                  onClick={disponibilizarNaRede} 
                  variant="outline" 
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Globe className="mr-2 h-4 w-4 animate-[pulse_3s_infinite]" /> Disponibilizar na Rede
                </Button>
                <Button 
                  onClick={sincronizarPPCP} 
                  className="bg-amber-600 hover:bg-amber-500 text-white h-9 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Activity className="mr-2 h-4 w-4 animate-pulse" /> Sincronizar Agora
                </Button>
              </div>
            </div>

            {itensProducao.length === 0 ? (
              <div className="p-24 text-center space-y-4">
                <Layers className="h-16 w-16 text-amber-500/20 mx-auto" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Nenhuma ordem de produção importada de Vendas.</p>
                <p className="text-xs text-gray-600 max-w-md mx-auto">Para popular esta planilha, registre novos pedidos/OPs na Central de Vendas que eles serão consolidados aqui de forma automática.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-amber-500/5">
                    <TableRow className="border-amber-500/10 hover:bg-transparent">
                      <TableHead className="px-4 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] whitespace-nowrap min-w-[90px]">Nº OP</TableHead>
                      <TableHead className="px-3 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Cliente</TableHead>
                      <TableHead className="px-3 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Produto / Operação</TableHead>
                      <TableHead className="text-center px-3 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] whitespace-nowrap">Código</TableHead>
                      <TableHead className="text-center px-2 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] max-w-[50px] leading-tight">Qtd</TableHead>
                      <TableHead className="text-center px-2 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] max-w-[60px] leading-tight">Pçs/<br/>Ciclo</TableHead>
                      <TableHead className="text-right px-2 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] max-w-[80px] leading-tight">Tempo Base<br/>(min)</TableHead>
                      <TableHead className="text-right px-2 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] max-w-[80px] leading-tight">Tempo Total<br/>(min)</TableHead>
                      <TableHead className="text-left px-3 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] max-w-[120px] leading-tight">Detalhes Prod.<br/>(BOM)</TableHead>
                      <TableHead className="text-center px-2 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] max-w-[80px] leading-tight">Regra de<br/>Corte</TableHead>
                      <TableHead className="text-center px-3 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] max-w-[80px] leading-tight">Status<br/>OP</TableHead>
                      <TableHead className="text-center px-3 py-2.5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] whitespace-nowrap max-w-[100px] leading-tight">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itensProducao.map((item) => {
                      const st = statusConfig[item.status as StatusOP] || { label: item.status, color: 'text-gray-400' };
                      const isNew = item.createdAt && new Date(item.createdAt).getTime() > ultimoAcesso;
                      return (
                        <TableRow 
                          key={item.id} 
                          className={cn(
                            "border-amber-500/5 hover:bg-amber-500/5 transition-all duration-300",
                            isNew && "bg-violet-950/10 border-l-[3px] border-l-violet-500/80 shadow-[inset_4px_0_10px_rgba(139,92,246,0.05)]"
                          )}
                        >
                          <TableCell className="px-4 py-2 font-mono text-xs text-amber-300 font-bold whitespace-nowrap flex items-center">
                            {item.opNumero}
                            {isNew && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] font-black bg-violet-600 text-white uppercase tracking-widest animate-[pulse_1s_infinite] ml-2 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                                Novo
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="px-3 py-2 font-bold text-gray-300 text-xs uppercase">{item.cliente}</TableCell>
                          <TableCell className="px-3 py-2 font-black text-xs uppercase text-white tracking-tight">{item.produtoNome}</TableCell>
                          <TableCell className="text-center px-3 py-2 font-mono text-[10px] text-gray-500 whitespace-nowrap">{item.produtoCodigo}</TableCell>
                          <TableCell className="text-center px-2 py-2 font-bold text-gray-300 text-xs">{item.quantidade.toLocaleString()}</TableCell>
                          <TableCell className="text-center px-2 py-2"><Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[9px] px-2 py-0.5">{item.pecasPorCiclo}x</Badge></TableCell>
                          <TableCell className="text-right px-2 py-2 font-black text-white text-xs">{item.tempoPadrao.toFixed(3)}</TableCell>
                          <TableCell className="text-right px-2 py-2 font-black text-amber-400 text-xs">
                            {item.tempoTotal.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-left font-mono text-[9px] text-amber-500/70 max-w-sm px-3 py-2 leading-relaxed">
                            {(() => {
                              const trigger = bomUpdateTrigger;
                              let count = 0;
                              const code = (item.produtoCodigo || '').toUpperCase().trim();
                              if (typeof window !== 'undefined') {
                                const stored = localStorage.getItem(`nexus_ppcp_bom_${code}`);
                                if (stored) {
                                  try {
                                    count = JSON.parse(stored).length;
                                  } catch (e) {}
                                }
                              }
                              if (count === 0 && BOM_DATABASE[code]) {
                                count = BOM_DATABASE[code].length;
                              }
                              return (
                                <div className="py-0.5">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => abrirEditorBOM(item.produtoNome, item.produtoCodigo)}
                                    className="border-amber-500/20 hover:border-amber-500/55 text-amber-400 text-[9px] font-black uppercase h-6 rounded-lg w-fit px-2 flex items-center gap-1"
                                  >
                                    <Settings2 className="h-3 w-3" />
                                    Estrutura ({count || 2} itens)
                                  </Button>
                                </div>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-center px-2 py-2">
                            {(() => {
                              if (!item.createdAt) return <span className="text-gray-600 text-[9px]">—</span>;
                              const date = new Date(item.createdAt);
                              const hour = date.getHours();
                              const minutes = date.getMinutes();
                              const timeStr = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                              
                              const isAfterCutoff = hour >= 12;
                              return (
                                <div className="flex flex-col items-center gap-0.5 justify-center">
                                  <Badge className={cn(
                                    "text-[7px] font-black uppercase py-0.5 px-1.5 bg-transparent border",
                                    isAfterCutoff 
                                      ? "text-rose-400 border-rose-500/30" 
                                      : "text-emerald-400 border-emerald-500/30"
                                  )}>
                                    {isAfterCutoff ? 'Pós-Corte' : 'Pré-Corte'}
                                  </Badge>
                                  <span className="text-[7px] text-gray-500 font-mono">Enviado: {timeStr}</span>
                                </div>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-center px-3 py-2">
                            <Badge className={cn('border bg-transparent text-[7px] font-black uppercase py-0.5 px-1.5', st.color)}>
                              {st.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center px-3 py-2 whitespace-nowrap">
                            {(() => {
                              const emProducao = item.status === 'em_producao';
                              const prontoExpedir = item.status === 'pronto_expedicao';
                              const bloqueado = emProducao || prontoExpedir;
                              return (
                                <Button
                                  onClick={() => !bloqueado && enviarParaMontagem(item)}
                                  disabled={bloqueado}
                                  size="sm"
                                  title={emProducao ? 'Item já está Em Produção na Montagem' : prontoExpedir ? 'Item concluído — Pronto para Expedição' : 'Enviar para fila de Montagem'}
                                  className={cn(
                                    "text-[8px] font-black uppercase tracking-widest px-2.5 h-7 rounded-lg transition-all",
                                    emProducao
                                      ? "bg-violet-900/40 text-violet-400 border border-violet-500/30 cursor-not-allowed opacity-70"
                                      : prontoExpedir
                                      ? "bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 cursor-not-allowed opacity-70"
                                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                                  )}
                                >
                                  {emProducao ? (
                                    <><Factory className="h-3 w-3 mr-1" />Em Produção</>
                                  ) : prontoExpedir ? (
                                    <><ShieldCheck className="h-3 w-3 mr-1" />Pronto p/ Expedir</>
                                  ) : (
                                    'Programar Montagem'
                                  )}
                                </Button>
                              );
                            })()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'terminal' && (
        <div className="space-y-8 text-left">
          {/* SELETOR DE SETOR */}
          <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[35px] p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white italic">Selecione o seu Setor</h3>
                <p className="text-xs text-gray-500 mt-1">Terminal de Apontamento de Produção do Chão de Fábrica</p>
              </div>
              <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                {setores.map(setor => (
                  <button
                    key={setor}
                    onClick={() => setSectorTerminal(setor)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                      sectorTerminal === setor 
                        ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400" 
                        : "bg-transparent text-gray-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                    )}
                  >
                    {setor}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LISTA DE PROGRAMAÇÃO FILTRADA */}
          <div className="space-y-6">
            {programacoes.filter(prog => prog.linha.toUpperCase() === sectorTerminal).length === 0 ? (
              <div className="bg-zinc-950/60 border border-amber-500/10 rounded-[40px] p-20 text-center space-y-4">
                <Layers className="h-16 w-16 text-amber-500/20 mx-auto" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Sem programações ativas para o setor {sectorTerminal}</p>
                <p className="text-xs text-gray-600 max-w-md mx-auto">Consulte o PPCP para programar novos programas e ordens para esta linha.</p>
              </div>
            ) : (
              programacoes
                .filter(prog => prog.linha.toUpperCase() === sectorTerminal)
                .map(prog => (
                  <div key={prog.id} className="space-y-4">
                    {/* INFO DO PROGRAMA */}
                    <div className="flex items-center justify-between px-6 bg-zinc-950/40 py-3 rounded-2xl border border-white/5 flex-wrap gap-2">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Programa / Data:</span>
                        <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black uppercase px-3 py-1 text-[10px]">
                          {isClient && prog.data ? new Date(prog.data + 'T00:00:00').toLocaleDateString('pt-BR') : prog.data}
                        </Badge>
                        {prog.lider && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-300 font-bold uppercase">
                            <User className="h-3.5 w-3.5 text-amber-500/60" />
                            <span>Líder: <strong className="text-amber-400 italic">{prog.lider}</strong></span>
                          </div>
                        )}
                      </div>
                      <Badge className="bg-zinc-900 border border-zinc-800 text-[8px] font-black uppercase px-3 py-1 tracking-widest">
                        {prog.produtos.length} Operações Programadas
                      </Badge>
                    </div>

                    {/* GRUPO DE CARDS DE APONTAMENTO — oculta itens já concluídos pelo líder */}
                    {prog.produtos.filter(p => !p.apontadoConcluido).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <ShieldCheck className="h-10 w-10 text-emerald-500/40" />
                        <p className="text-emerald-400/60 font-black uppercase text-xs tracking-widest">Todos os itens concluídos e enviados ao PPCP</p>
                        <p className="text-gray-600 text-[10px]">Aguardando próxima programação do setor.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {prog.produtos.filter(p => !p.apontadoConcluido).map(p => {
                          const matchingOp = vendasOps.find(op => 
                            op.itens && op.itens.some((item: any) => item.produtoCodigo === p.codigo)
                          );
                          return (
                            <CardApontamento 
                              key={p.id}
                              progId={prog.id}
                              linha={prog.linha}
                              produto={p}
                              onSalvar={salvarApontamento}
                              matchingOp={matchingOp}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      <LegalSafeguard module="DANTE PPCP" protocol="NX-9982-IA" />

      {/* MODAL DE MATRIZ COMPACTA COM CÓDIGO */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={cn(
          "bg-zinc-950 border-amber-500/30 text-white flex flex-col rounded-[50px] overflow-hidden shadow-[0_0_150px_rgba(245,158,11,0.2)] transition-all duration-300",
          isProductMaximized 
            ? "max-w-[96vw] w-[96vw] h-[96vh] max-h-[96vh]" 
            : "max-w-[95vw] lg:max-w-7xl w-full h-[95vh]"
        )}>
          <DialogHeader className="p-10 bg-amber-600/10 border-b border-amber-500/10">
            <div className="flex justify-between items-center w-full">
              <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-amber-400 flex items-center gap-5">
                <Calculator className="h-8 w-8 text-amber-500" />
                {isClient ? 'Matriz de Crono-Programação Industrial' : 'Carregando Matriz...'}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/10 px-6 opacity-50 cursor-not-allowed" disabled>
                     <Database className="mr-2 h-4 w-4" /> Gerenciar Engenharia
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-8 w-8 p-0 rounded-xl flex items-center justify-center transition-all"
                  onClick={() => setIsProductMaximized(!isProductMaximized)}
                  title={isProductMaximized ? "Restaurar tamanho" : "Maximizar tela"}
                >
                  {isProductMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-amber-500/20">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="bg-black/40 border border-amber-500/20 rounded-3xl p-3 space-y-2 group focus-within:border-amber-500 transition-all">
                  <Label className="text-[10px] font-black uppercase text-amber-500/60 flex items-center gap-2 tracking-widest"><CalendarDays className="h-3 w-3" /> Data do Programa</Label>
                  <Input type="date" value={formData.data} onChange={e => setFormData(prev => ({...prev, data: e.target.value}))} className="bg-transparent border-none p-0 text-lg font-black text-white focus-visible:ring-0 h-auto" />
               </div>
               <div className="bg-black/40 border border-amber-500/20 rounded-3xl p-3 space-y-2 group focus-within:border-amber-500 transition-all">
                  <Label className="text-[10px] font-black uppercase text-amber-500/60 flex items-center gap-2 tracking-widest"><Factory className="h-3 w-3" /> Setor Industrial</Label>
                  <select 
                    value={formData.linha} 
                    onChange={e => setFormData(prev => ({...prev, linha: e.target.value}))} 
                    className="bg-transparent border-none p-0 text-lg font-black text-white focus:outline-none w-full uppercase italic mt-1"
                  >
                    <option value="" className="bg-zinc-950 text-white">Selecione...</option>
                    {setores.map(setor => (
                      <option key={setor} value={setor} className="bg-zinc-950 text-white uppercase">{setor}</option>
                    ))}
                  </select>
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
                          className="bg-black/40 border-none h-9 pl-9 pr-14 text-xs font-bold text-white uppercase rounded-xl w-full"
                        />
                        <div className="absolute right-2 flex items-center gap-1.5">
                          {p.codigo && (
                            <button 
                              type="button"
                              onClick={() => abrirEditorBOM(p.produto || 'Produto Sem Nome', p.codigo)}
                              className="p-1 text-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10 rounded-md transition-all"
                              title="Editar Estrutura (BOM)"
                            >
                              <Settings2 className="h-3 w-3" />
                            </button>
                          )}
                          {p.auditado && (
                             <CheckCircle className="h-3 w-3 text-emerald-500" />
                          )}
                        </div>
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

                      <div className="col-span-2 group relative flex items-center">
                        <Input 
                          placeholder="CÓD-00" 
                          value={p.codigo} 
                          onChange={e => updateProduto(idx, 'codigo', e.target.value)} 
                          className="bg-black/60 border border-amber-500/10 h-9 text-center text-[10px] font-mono font-black text-amber-500/60 rounded-xl uppercase w-full"
                        />
                        {!p.auditado && p.codigo.length >= 1 && (
                          <div className="absolute top-11 left-0 w-full bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl z-50 p-2 space-y-1 min-w-[150px]">
                             {BANCO_ENGENHARIA.filter(i => i.codigo.toUpperCase().includes(p.codigo.toUpperCase())).map(item => (
                               <button 
                                 key={item.codigo}
                                 type="button"
                                 className="w-full text-left p-2 hover:bg-amber-500/10 rounded-xl transition-all flex justify-between items-center group/btn"
                                 onClick={() => aplicarItemEngenharia(idx, item)}
                               >
                                 <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-white">{item.codigo}</span>
                                   <span className="text-[8px] text-gray-500 uppercase tracking-widest truncate max-w-[100px]">{item.produto}</span>
                                 </div>
                               </button>
                             ))}
                          </div>
                        )}
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
                Consolidar Programa
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DISPONIBILIZAR NA REDE */}
      <Dialog open={redeDialogOpen} onOpenChange={setRedeDialogOpen}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-lg rounded-[40px] p-8 shadow-[0_0_80px_rgba(245,158,11,0.15)] text-left">
          <DialogHeader>
            <DialogTitle className="text-amber-400 font-black uppercase flex items-center gap-3 text-xl italic">
              <Globe className="h-6 w-6 text-amber-500 animate-pulse" />
              Disponibilizar na Rede Local
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              A Planilha Mestre de Produção do PPCP foi publicada no barramento de rede local da fábrica. Todos os terminais e operadores conectados agora têm acesso de leitura em tempo real.
            </p>

            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Endereço de Rede (MESH)</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black tracking-widest">Ativo / Online</Badge>
              </div>
              <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-white/5 justify-between">
                <code className="text-xs font-mono text-amber-400 font-black">http://nexus-mesh.local/ppcp-planilha-geral</code>
                <Button 
                  size="sm" 
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText('http://nexus-mesh.local/ppcp-planilha-geral');
                      setCopiado(true);
                      setTimeout(() => setCopiado(false), 2000);
                    }
                  }}
                  className="bg-amber-600/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 text-[9px] font-black uppercase px-3 h-7 rounded-lg"
                >
                  {copiado ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Protocolo</p>
                <p className="text-white font-black text-sm mt-1 uppercase font-mono">NX-NET-9982</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Broadcast</p>
                <p className="text-white font-black text-sm mt-1 uppercase font-mono">Multicast UDP</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest px-6" onClick={() => setRedeDialogOpen(false)}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL ADICIONAR SETOR */}
      <Dialog open={addSectorDialogOpen} onOpenChange={setAddSectorDialogOpen}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-md rounded-[40px] p-8 shadow-[0_0_80px_rgba(245,158,11,0.15)] text-left">
          <DialogHeader>
            <DialogTitle className="text-amber-400 font-black uppercase flex items-center gap-3 text-xl italic">
              <Plus className="h-6 w-6 text-amber-500" />
              Adicionar Novo Setor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              Crie uma nova linha de produção no PPCP. Ela aparecerá como uma aba nos Programas e estará disponível no Terminal do Líder para apontamentos.
            </p>

            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Nome do Setor</Label>
              <Input 
                placeholder="Ex: PINTURA, EMBALAGEM..." 
                value={novoSetorNome}
                onChange={e => setNovoSetorNome(e.target.value.toUpperCase())}
                className="bg-black border border-white/10 h-11 rounded-2xl text-sm font-bold uppercase text-white placeholder:text-gray-700 focus-visible:ring-1 focus-visible:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="ghost" 
                className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest"
                onClick={() => {
                  setAddSectorDialogOpen(false);
                  setNovoSetorNome('');
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10" 
                onClick={() => {
                  if (novoSetorNome.trim() && !setores.includes(novoSetorNome.trim())) {
                    const novosSetores = [...setores, novoSetorNome.trim()];
                    setSetores(novosSetores);
                    setActiveSectorTab(novoSetorNome.trim());
                    setAddSectorDialogOpen(false);
                    setNovoSetorNome('');
                  }
                }}
                disabled={!novoSetorNome.trim()}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL EDITOR DE ESTRUTURA (BOM) */}
      <Dialog open={bomDialogOpen} onOpenChange={setBomDialogOpen}>
        <DialogContent className={cn(
          "bg-zinc-950 border-amber-500/30 text-white rounded-[40px] p-8 shadow-[0_0_80px_rgba(245,158,11,0.15)] text-left flex flex-col transition-all duration-300",
          isBomMaximized 
            ? "max-w-[96vw] w-[96vw] h-[96vh] max-h-[96vh]" 
            : "max-w-3xl w-full max-h-[90vh]"
        )}>
          <DialogHeader className="border-b border-amber-500/10 pb-4 flex flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-amber-400 font-black uppercase flex items-center gap-3 text-xl italic font-headline">
                <Settings2 className="h-6 w-6 text-amber-500" />
                Editor de Estrutura (BOM)
              </DialogTitle>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                Personalize a lista de materiais para: <strong className="text-white font-bold">{bomActiveProduct?.nome}</strong> ({bomActiveProduct?.codigo})
              </p>
            </div>
            <Button
              variant="outline"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-8 w-8 p-0 rounded-xl flex items-center justify-center transition-all mr-6 mt-1"
              onClick={() => setIsBomMaximized(!isBomMaximized)}
              title={isBomMaximized ? "Restaurar tamanho" : "Maximizar tela"}
            >
              {isBomMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto py-6 space-y-4 scrollbar-thin scrollbar-thumb-amber-500/20 pr-2">
            {bomActiveItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-xs text-gray-500 uppercase font-black">Nenhum componente cadastrado.</p>
                <p className="text-[10px] text-gray-600 mt-1">Clique em "+ Adicionar Item" para iniciar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 px-4 text-[9px] font-black uppercase text-gray-600 tracking-wider">
                  <div className="col-span-4">Material / Componente</div>
                  <div className="col-span-5">Dimensões (L = Comprimento / A = Altura / Obs)</div>
                  <div className="col-span-2">Quantidade</div>
                  <div className="col-span-1 text-center">Excluir</div>
                </div>

                <div className="space-y-2">
                  {bomActiveItems.map((item, index) => {
                    const isProfile = /perfil|marco|vista|travessa|barra/i.test(item.material);
                    return (
                      <div 
                        key={index}
                        className="grid grid-cols-12 gap-3 items-center p-2 rounded-2xl bg-black/40 border border-white/5 focus-within:border-amber-500/30 transition-all"
                      >
                        <div className="col-span-4">
                          <Input 
                            placeholder="Ex: Perfil Alumínio Suprema" 
                            value={item.material}
                            onChange={e => atualizarComponenteBOM(index, 'material', e.target.value)}
                            className="bg-zinc-900/50 border-none h-8 text-xs font-bold text-white rounded-xl placeholder:text-gray-700"
                          />
                        </div>
                        <div className="col-span-5 flex items-center gap-2">
                          {/* Quadrinho L */}
                          <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden h-8 flex-1">
                            <span className="px-2 text-[10px] font-black text-amber-500 bg-amber-500/5 border-r border-zinc-800 h-full flex items-center justify-center min-w-[20px]">L</span>
                            <Input 
                              type="number" 
                              placeholder="1200" 
                              value={item.dimL || ''}
                              onChange={e => atualizarComponenteBOM(index, 'dimL', e.target.value)}
                              className="bg-transparent border-none h-full w-full text-center text-xs text-white focus-visible:ring-0 p-0"
                            />
                            {item.dimL && <span className="pr-1.5 text-[9px] text-zinc-500 font-bold">mm</span>}
                          </div>

                          {/* Quadrinho A */}
                          {!isProfile && (
                            <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden h-8 flex-1">
                              <span className="px-2 text-[10px] font-black text-amber-500 bg-amber-500/5 border-r border-zinc-800 h-full flex items-center justify-center min-w-[20px]">A</span>
                              <Input 
                                type="number" 
                                placeholder="1000" 
                                value={item.dimA || ''}
                                onChange={e => atualizarComponenteBOM(index, 'dimA', e.target.value)}
                                className="bg-transparent border-none h-full w-full text-center text-xs text-white focus-visible:ring-0 p-0"
                              />
                              {item.dimA && <span className="pr-1.5 text-[9px] text-zinc-500 font-bold">mm</span>}
                            </div>
                          )}

                          {/* Quadrinho Espessura para Vidros */}
                          {/vidro/i.test(item.material) && (
                            <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden h-8 flex-1">
                              <span className="px-1.5 text-[10px] font-black text-amber-500 bg-amber-500/5 border-r border-zinc-800 h-full flex items-center justify-center min-w-[24px]" title="Espessura do Vidro">
                                <Layers className="h-3 w-3" />
                              </span>
                              <Input 
                                type="number" 
                                placeholder="4" 
                                value={item.vidroEsp || ''}
                                onChange={e => atualizarComponenteBOM(index, 'vidroEsp', e.target.value)}
                                className="bg-transparent border-none h-full w-full text-center text-xs text-white focus-visible:ring-0 p-0"
                              />
                              {item.vidroEsp && <span className="pr-1.5 text-[9px] text-zinc-500 font-bold">mm</span>}
                            </div>
                          )}

                          {/* Obs/Extra */}
                          <Input 
                            placeholder="Obs..." 
                            value={item.extraDim || ''}
                            onChange={e => atualizarComponenteBOM(index, 'extraDim', e.target.value)}
                            className="bg-zinc-900/50 border-none h-8 text-[10px] text-gray-400 rounded-xl placeholder:text-gray-700 w-20 px-2"
                          />
                        </div>
                        <div className="col-span-2 flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden h-8 w-full">
                          <span className="px-2.5 text-[9px] font-black text-amber-500 bg-amber-500/5 border-r border-zinc-800 h-full flex items-center justify-center uppercase select-none min-w-[50px] whitespace-nowrap">
                            {item.qtdUnidade || 'Peças'}
                          </span>
                          <Input 
                            type="number" 
                            placeholder="1" 
                            value={item.qtdValor || ''}
                            onChange={e => atualizarComponenteBOM(index, 'qtdValor', e.target.value)}
                            className="bg-transparent border-none h-full w-full text-center text-xs text-amber-400 font-bold focus-visible:ring-0 p-0 flex-1 min-w-[30px]"
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          <Button 
                            size="sm"
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                            onClick={() => removerComponenteBOM(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-amber-500/10 pt-6 flex justify-between items-center bg-zinc-950">
            <Button 
              onClick={adicionarComponenteBOM}
              variant="outline" 
              className="border-dashed border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Adicionar Item
            </Button>
            
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest h-10 px-4 rounded-xl"
                onClick={() => setBomDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10" 
                onClick={salvarBOM}
              >
                Salvar Estrutura
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL CONFIRMAÇÃO DE ARQUIVAMENTO */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-md rounded-[40px] p-8 shadow-[0_0_80px_rgba(245,158,11,0.15)] text-left">
          <DialogHeader>
            <DialogTitle className="text-amber-400 font-black uppercase flex items-center gap-3 text-xl italic font-headline">
              <AlertTriangle className="h-6 w-6 text-amber-500 animate-bounce" />
              Concluir & Arquivar Programa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              Deseja finalizar o programa de produção da linha <strong className="text-white uppercase">{progToArchive?.linha}</strong> planejado para <strong className="text-white">{progToArchive && new Date(progToArchive.data + 'T00:00:00').toLocaleDateString('pt-BR')}</strong> conduzido pelo líder <strong className="text-amber-400 uppercase italic">{progToArchive?.lider}</strong>?
            </p>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2 text-[11px] max-h-48 overflow-y-auto">
              <p className="text-gray-500 uppercase tracking-widest text-[9px] font-black">Resumo das Operações</p>
              {progToArchive?.produtos.map((p) => (
                <div key={p.id} className="flex justify-between items-center border-b border-white/5 last:border-0 py-1">
                  <span className="text-gray-300 font-bold uppercase truncate max-w-[200px]" title={p.produto}>{p.produto}</span>
                  <span className="text-emerald-400 font-mono">Qtd: {p.qtdProduzida || 0} / {p.qtdNecessaria}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-500 leading-relaxed italic">
              * Esta ação moverá as informações para o Histórico de Produção de forma consolidada e somente leitura. Você poderá restaurá-lo se necessário.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest" onClick={() => { setArchiveDialogOpen(false); setProgToArchive(null); }}>
                Cancelar
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10" onClick={() => progToArchive && arquivarPrograma(progToArchive.id)}>
                Finalizar e Arquivar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DETALHES DO HISTÓRICO */}
      <Dialog open={!!viewingHistoryProg} onOpenChange={(open) => !open && setViewingHistoryProg(null)}>
        <DialogContent className="bg-zinc-950 border-amber-500/30 text-white max-w-4xl w-full rounded-[40px] p-8 shadow-[0_0_100px_rgba(245,158,11,0.15)] text-left flex flex-col max-h-[85vh]">
          <DialogHeader className="border-b border-amber-500/10 pb-4">
            <DialogTitle className="text-amber-400 font-headline font-black uppercase flex items-center gap-3 text-2xl italic">
              <Clock className="h-6 w-6 text-amber-500" />
              Detalhamento de Programa Arquivado
            </DialogTitle>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
              Programa de <strong className="text-white">{viewingHistoryProg?.linha}</strong> em <strong className="text-white">{viewingHistoryProg && new Date(viewingHistoryProg.data + 'T00:00:00').toLocaleDateString('pt-BR')}</strong> — Líder: <strong className="text-white">{viewingHistoryProg?.lider}</strong>
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-auto py-6 space-y-6 scrollbar-thin scrollbar-thumb-amber-500/20 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Total de Peças Produzidas</span>
                <p className="text-2xl font-black text-white italic mt-1">
                  {viewingHistoryProg?.produtos.reduce((acc, p) => acc + (p.qtdProduzida || 0), 0).toLocaleString('pt-BR')}
                  <span className="text-xs text-gray-500 font-normal"> / {viewingHistoryProg?.produtos.reduce((acc, p) => {
                    const cycles = Math.ceil(p.qtdNecessaria / (p.pecasPorCiclo || 1));
                    return acc + (cycles * (p.pecasPorCiclo || 1));
                  }, 0).toLocaleString('pt-BR')} peças</span>
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Tempo Total Planejado</span>
                <p className="text-2xl font-black text-amber-400 italic mt-1">
                  {viewingHistoryProg?.produtos.reduce((acc, p) => acc + (calcularLinha(p, viewingHistoryProg.linha).tempoNecessario || 0), 0).toFixed(1)}
                  <span className="text-xs text-gray-600 font-normal"> min</span>
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Eficiência Média</span>
                <div className="mt-1">
                  {(() => {
                    let totalReal = 0;
                    let totalStd = 0;
                    viewingHistoryProg?.produtos.forEach(p => {
                      if (p.qtdProduzida) {
                        const diff = obterTempoTrabalhadoOperadores(p.operadores, p.horaInicio, p.horaFim);
                        if (diff !== null && diff > 0) {
                          totalReal += diff;
                          const isCorte = (viewingHistoryProg?.linha || '').toUpperCase() === 'CORTE';
                          const pecasPorCicloAjustada = isCorte ? (p.pecasPorCiclo || 1) : 1;
                          const ciclos = p.qtdProduzida / pecasPorCicloAjustada;
                          totalStd += ciclos * p.tempoPadrao;
                        }
                      }
                    });
                    const ef = totalReal > 0 ? Math.round((totalStd / totalReal) * 100) : null;
                    return ef !== null ? (
                      <Badge className={cn(
                        "text-lg font-black italic px-3 py-1 bg-transparent border",
                        ef >= 100 ? "text-emerald-400 border-emerald-500/30" : ef >= 80 ? "text-amber-400 border-amber-500/30" : "text-rose-400 border-rose-500/30"
                      )}>{ef}% Efic.</Badge>
                    ) : (
                      <p className="text-2xl font-black text-gray-600 italic">—</p>
                    );
                  })()}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="px-6 py-4 text-[8px] font-black uppercase text-gray-500 tracking-wider">Item Produzido</TableHead>
                      <TableHead className="text-center text-[8px] font-black uppercase text-gray-500 tracking-wider">Código</TableHead>
                      <TableHead className="text-center text-[8px] font-black uppercase text-gray-500 tracking-wider">Qtd Produzida / Meta</TableHead>
                      <TableHead className="text-center text-[8px] font-black uppercase text-gray-500 tracking-wider">Operador</TableHead>
                      <TableHead className="text-center text-[8px] font-black uppercase text-gray-500 tracking-wider">Horários (I - F)</TableHead>
                      <TableHead className="text-right px-6 text-[8px] font-black uppercase text-gray-500 tracking-wider">Tempo (min)</TableHead>
                      <TableHead className="text-left px-6 text-[8px] font-black uppercase text-gray-500 tracking-wider w-full min-w-[200px]">Observação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingHistoryProg?.produtos.map((p) => {
                      const c = calcularLinha(p, viewingHistoryProg.linha);
                      const isCorte = (viewingHistoryProg.linha || '').toUpperCase() === 'CORTE';
                      const targetQtd = isCorte ? c.ciclos * (p.pecasPorCiclo || 1) : p.qtdNecessaria;
                      return (
                        <TableRow key={p.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="px-6 py-4">
                            <span className="font-bold text-xs uppercase text-white block truncate max-w-[200px]" title={p.produto}>{p.produto}</span>
                            {(p.cliente || p.opNumero) && (
                              <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                                {p.cliente && (
                                  <Badge className="bg-zinc-900 border border-zinc-800 text-gray-400 text-[7px] font-black uppercase tracking-widest px-1.5 py-0">
                                    Cli: {p.cliente}
                                  </Badge>
                                )}
                                {p.opNumero && (
                                  <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[7px] font-black uppercase tracking-widest px-1.5 py-0">
                                    OP: #{p.opNumero}
                                  </Badge>
                                )}
                                {p.especificacoes && (
                                  <span className="text-[8px] text-amber-500/60 font-bold block max-w-[150px] truncate" title={p.especificacoes}>
                                    Obs: {p.especificacoes}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center font-mono text-[9px] text-gray-500">{p.codigo}</TableCell>
                          <TableCell className="text-center font-bold text-white text-xs">
                            <div>
                              <span>{p.qtdProduzida || 0} / {targetQtd}</span>
                              {isCorte && targetQtd - p.qtdNecessaria > 0 && (
                                <span className="block text-[8px] text-emerald-400 font-semibold mt-0.5">(Sobra: +{targetQtd - p.qtdNecessaria})</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold text-amber-400 text-[10px] uppercase">
                            {p.operadores && p.operadores.length > 0 ? (
                              <div className="flex flex-col items-center gap-0.5">
                                {p.operadores.map((op) => (
                                  <span key={op.id} className="block text-[9px] font-black text-amber-400 uppercase tracking-tight">{op.nome || 'Sem Nome'}</span>
                                ))}
                              </div>
                            ) : p.operador || '—'}
                          </TableCell>
                          <TableCell className="text-center font-mono text-[9px] text-gray-500">
                            {p.operadores && p.operadores.length > 0 ? (
                              <div className="flex flex-col items-center gap-0.5">
                                {p.operadores.map((op) => (
                                  <span key={op.id} className="block text-[8px] font-mono text-gray-500">{op.horaInicio && op.horaFim ? `${op.horaInicio} - ${op.horaFim}` : '—'}</span>
                                ))}
                              </div>
                            ) : p.horaInicio && p.horaFim ? `${p.horaInicio} - ${p.horaFim}` : '—'}
                          </TableCell>
                          <TableCell className="text-right px-6 font-bold text-gray-300 text-xs">{c.tempoNecessario.toFixed(1)}</TableCell>
                          <TableCell className="text-left px-6 text-xs text-gray-400 font-medium truncate max-w-[200px]" title={p.observacao || ''}>
                            {p.observacao || '—'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex justify-end">
            <Button 
              className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest px-6"
              onClick={() => setViewingHistoryProg(null)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </SovereignShowcase>
  );
}

const formatarHora = (value: string) => {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 1 && parseInt(digits, 10) > 2) {
    digits = '0' + digits;
  }
  digits = digits.slice(0, 4);
  if (digits.length >= 2) {
    let hh = parseInt(digits.slice(0, 2), 10);
    if (hh > 23) hh = 23;
    const hhStr = hh.toString().padStart(2, '0');
    if (digits.length > 2) {
      let mm = parseInt(digits.slice(2), 10);
      if (mm > 59) mm = 59;
      const mmStr = mm.toString().padStart(digits.length - 2, '0');
      return `${hhStr}:${mmStr}`;
    }
    return hhStr;
  }
  return digits;
};

interface CardApontamentoProps {
  progId: string;
  linha: string;
  produto: Produto;
  onSalvar: (
    progId: string, 
    produtoId: string, 
    apontamento: { 
      operador: string; 
      horaInicio: string; 
      horaFim: string; 
      qtdProduzida: number; 
      statusProducao: 'fila' | 'produzindo' | 'concluido';
      observacao?: string;
      operadores?: OperadorSessao[];
    },
    confirmarConclusao?: boolean
  ) => void;
  matchingOp?: any;
}

function CardApontamento({ progId, linha, produto, onSalvar, matchingOp }: CardApontamentoProps) {
  const isCorte = (linha || '').toUpperCase() === 'CORTE';
  const isAcabamento = (linha || '').toUpperCase() === 'ACABAMENTO';
  const shouldStackInfo = ['ACABAMENTO', 'SOLDA', 'MONTAGEM'].includes((linha || '').toUpperCase());
  const pecasPorCicloAjustada = isCorte ? (produto.pecasPorCiclo || 1) : 1;
  const ciclosAlvo = Math.ceil(produto.qtdNecessaria / pecasPorCicloAjustada);
  const qtdAjustadaCiclos = isCorte ? ciclosAlvo * pecasPorCicloAjustada : produto.qtdNecessaria;

  const [operadores, setOperadores] = useState<OperadorSessao[]>([]);
  const [statusProducao, setStatusProducao] = useState<'fila' | 'produzindo' | 'concluido'>(produto.statusProducao || 'fila');
  const [observacao, setObservacao] = useState(produto.observacao || '');
  const [salvo, setSalvo] = useState(false);
  const [confirmarDialogOpen, setConfirmarDialogOpen] = useState(false);

  useEffect(() => {
    const targetCorte = (linha || '').toUpperCase() === 'CORTE';
    const targetPcs = targetCorte ? (produto.pecasPorCiclo || 1) : 1;
    const targetCiclos = Math.ceil(produto.qtdNecessaria / targetPcs);
    const targetQtd = targetCorte ? targetCiclos * targetPcs : produto.qtdNecessaria;

    if (produto.operadores && produto.operadores.length > 0) {
      setOperadores(produto.operadores.map(op => ({
        ...op,
        qtdProduzida: op.qtdProduzida !== undefined ? op.qtdProduzida : 0
      })));
    } else {
      setOperadores([
        {
          id: 'op-' + Math.random().toString(36).substr(2, 9),
          nome: produto.operador || '',
          horaInicio: produto.horaInicio || '',
          horaFim: produto.horaFim || '',
          qtdProduzida: produto.qtdProduzida !== undefined && produto.qtdProduzida > 0 ? produto.qtdProduzida : targetQtd
        }
      ]);
    }

    setStatusProducao(produto.statusProducao || 'fila');
    setObservacao(produto.observacao || '');
    setSalvo(false);
  }, [produto, linha]);

  const tempoAlvoMinutos = ciclosAlvo * (produto.tempoPadrao || 0);

  const adicionarOperador = () => {
    setOperadores(prev => [
      ...prev,
      {
        id: 'op-' + Math.random().toString(36).substr(2, 9),
        nome: '',
        horaInicio: '',
        horaFim: '',
        qtdProduzida: 0
      }
    ]);
  };

  const removerOperador = (id: string) => {
    setOperadores(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(op => op.id !== id);
    });
  };

  const atualizarOperador = (id: string, campo: keyof OperadorSessao, valor: any) => {
    setOperadores(prev => prev.map(op => {
      if (op.id === id) {
        return { ...op, [campo]: valor };
      }
      return op;
    }));
  };

  const efInfo = useMemo(() => {
    const totalQtd = operadores.reduce((acc, op) => acc + (op.qtdProduzida || 0), 0);
    if (!totalQtd) return null;
    
    const tempoTrabalhado = obterTempoTrabalhadoOperadores(operadores);
    if (tempoTrabalhado === null || tempoTrabalhado <= 0) return null;
    
    const isCorte = (linha || '').toUpperCase() === 'CORTE';
    const pecasPorCicloAjustada = isCorte ? (produto.pecasPorCiclo || 1) : 1;
    const ciclos = totalQtd / pecasPorCicloAjustada;
    const tempoPadraoMinutos = ciclos * produto.tempoPadrao;
    const eficiencia = (tempoPadraoMinutos / tempoTrabalhado) * 100;
    
    return {
      tempoTrabalhado,
      tempoPadraoMinutos,
      eficiencia: parseFloat(eficiencia.toFixed(1))
    };
  }, [operadores, produto.pecasPorCiclo, produto.tempoPadrao, linha]);

  const handleSalvar = () => {
    // Só abre confirmação se status for concluido
    if (statusProducao === 'concluido') {
      setConfirmarDialogOpen(true);
    }
  };

  const handleConfirmarConclusao = () => {
    const totalQtd = operadores.reduce((acc, op) => acc + (op.qtdProduzida || 0), 0);
    onSalvar(progId, produto.id, {
      operador: operadores[0]?.nome || '',
      horaInicio: operadores[0]?.horaInicio || '',
      horaFim: operadores[0]?.horaFim || '',
      operadores,
      qtdProduzida: totalQtd,
      statusProducao,
      observacao
    }, true);
    setConfirmarDialogOpen(false);
    setSalvo(true);
  };

  return (
    <div className={cn(
      "p-6 rounded-[30px] border transition-all duration-300",
      statusProducao === 'concluido' ? "bg-emerald-950/20 border-emerald-500/30" :
      statusProducao === 'produzindo' ? "bg-violet-950/20 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.05)]" :
      "bg-zinc-950/60 border-amber-500/10 hover:border-amber-500/20"
    )}>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
        {/* ESQUERDA: INFORMAÇÃO PROGRAMADA */}
        <div className="space-y-4 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-zinc-800/60 pb-6 lg:pb-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Item Programado</span>
              <h4 className="text-base font-black text-white uppercase tracking-tight italic flex items-center gap-2 flex-wrap">
                {produto.produto}
                {produto.auditado && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                {(produto.codigo === 'MNT-001' || progId === 'prog-3') && (
                  matchingOp ? (
                    <Link href={`/intelligence/vendas?op=${matchingOp.numero}`}>
                      <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ml-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-1 transition-all">
                        <Layers className="h-2.5 w-2.5" /> OP #{matchingOp.numero}
                      </Badge>
                    </Link>
                  ) : (
                    <Link href="/intelligence/vendas">
                      <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ml-2 hover:bg-blue-500/20 cursor-pointer flex items-center gap-1 transition-all">
                        <Globe className="h-2.5 w-2.5" /> Vendas
                      </Badge>
                    </Link>
                  )
                )}
              </h4>
              {(produto.cliente || produto.opNumero) && (
                <div className="flex flex-wrap gap-2 mt-2 items-center">
                  {produto.cliente && (
                    <Badge className="bg-zinc-900 border border-zinc-800 text-gray-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                      Cliente: {produto.cliente}
                    </Badge>
                  )}
                  {produto.opNumero && (
                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                      OP: #{produto.opNumero}
                    </Badge>
                  )}
                  {produto.especificacoes && (
                    <span className="text-[9px] text-amber-400/80 font-bold block max-w-xs truncate" title={produto.especificacoes}>
                      Obs: {produto.especificacoes}
                    </span>
                  )}
                </div>
              )}
            </div>
            <Badge className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] px-2 py-0.5">
              {produto.codigo}
            </Badge>
          </div>
 
          <div className={cn("grid gap-3", shouldStackInfo ? "grid-cols-1" : "grid-cols-3")}>
            <div className="p-3 bg-black/40 border border-white/5 rounded-2xl">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Meta (Ajustada)</span>
              <p className="text-lg font-black text-white italic mt-0.5">{qtdAjustadaCiclos.toLocaleString('pt-BR')}</p>
              <p className="text-[8px] text-gray-500 mt-0.5">Pedido: {produto.qtdNecessaria}</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Ciclos Necessários</span>
                <p className="text-lg font-black text-white italic mt-0.5">
                  {ciclosAlvo} <span className="text-[9px] font-normal text-gray-500 not-italic">ciclos</span>
                </p>
              </div>
              {qtdAjustadaCiclos - produto.qtdNecessaria > 0 && (
                <div className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded w-fit mt-1">
                  Sobra: +{qtdAjustadaCiclos - produto.qtdNecessaria} pçs
                </div>
              )}
              <p className="text-[9px] font-bold text-gray-500 mt-1">{produto.tempoPadrao} min cada</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-2xl">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Tempo Planejado</span>
              <p className="text-[10px] font-black text-amber-400 mt-0.5">{tempoAlvoMinutos.toFixed(1)} min</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <Settings2 className="h-3.5 w-3.5" />
            <span>Posto de Trabalho: <strong className="text-gray-300 uppercase">{produto.maquina || 'Bancada Padrão'}</strong></span>
          </div>
 
          {/* COMPONENTES / BOM DA ORDEM */}
          {(() => {
            if (isAcabamento) return null;
            const bomItems = obterItensBOM(produto.codigo);
            if (bomItems.length === 0) return null;
            return (
              <div className="mt-4 p-4 bg-black/80 border border-amber-500/10 rounded-2xl space-y-2">
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 animate-pulse" /> Componentes de Fabricação (BOM)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {bomItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] bg-zinc-950 p-2 rounded-xl border border-white/5">
                      <span className="text-gray-300 font-bold uppercase truncate max-w-[140px]" title={item.material}>{item.material}</span>
                      <div className="flex gap-2 items-center flex-shrink-0">
                        <Badge className="bg-amber-500/5 text-amber-500 border border-amber-500/20 text-[9px] font-mono">{item.dimensao}</Badge>
                        <Badge className="bg-zinc-900 text-gray-400 border border-zinc-800 text-[9px]">{item.quantidade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
 
        {/* DIREITA: APONTAMENTO DO OPERADOR */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-[9px] font-black uppercase text-amber-500/60 tracking-widest">Apontamento de Chão de Fábrica</span>
              <div className="flex gap-1">
                {(['fila', 'produzindo', 'concluido'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusProducao(st)}
                    className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border",
                      statusProducao === st ? (
                        st === 'concluido' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40" :
                        st === 'produzindo' ? "bg-violet-500/10 text-violet-400 border-violet-500/40" :
                        "bg-zinc-800 text-white border-zinc-700"
                      ) : "bg-transparent text-gray-500 border-transparent hover:text-gray-300"
                    )}
                  >
                    {st === 'fila' ? 'Fila' : st === 'produzindo' ? 'Produzindo' : 'Concluído'}
                  </button>
                ))}
              </div>
            </div>
 
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-500/20">
              {operadores.map((op, index) => (
                <div key={op.id} className="p-3 bg-black/35 border border-white/5 rounded-2xl relative space-y-2 hover:border-amber-500/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Operador #{index + 1}</span>
                    {operadores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerOperador(op.id)}
                        className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all"
                        title="Remover Operador"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end">
                    <div className="sm:col-span-2 space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Operador</Label>
                      <Input
                        placeholder="Nome"
                        value={op.nome}
                        onChange={e => atualizarOperador(op.id, 'nome', e.target.value.toUpperCase())}
                        className="bg-black/60 border border-white/10 h-8 rounded-lg text-xs font-bold uppercase text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Início</Label>
                      <Input
                        placeholder="07:30"
                        value={op.horaInicio}
                        onChange={e => atualizarOperador(op.id, 'horaInicio', formatarHora(e.target.value))}
                        className="bg-black/60 border border-white/10 h-8 rounded-lg text-center text-xs font-mono font-bold text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Fim</Label>
                      <Input
                        placeholder="12:00"
                        value={op.horaFim}
                        onChange={e => atualizarOperador(op.id, 'horaFim', formatarHora(e.target.value))}
                        className="bg-black/60 border border-white/10 h-8 rounded-lg text-center text-xs font-mono font-bold text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Qtd Prod.</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={op.qtdProduzida || ''}
                        onChange={e => atualizarOperador(op.id, 'qtdProduzida', Number(e.target.value))}
                        className="bg-black/60 border border-white/10 h-8 rounded-lg text-center text-xs font-bold text-emerald-400"
                      />
                    </div>
                    {/* EFICIÊNCIA INLINE */}
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Eficiência</Label>
                      {(() => {
                        const efOp = calcularEficienciaOperador(op, produto.tempoPadrao, linha, produto.pecasPorCiclo);
                        return efOp ? (
                          <div className={cn(
                            "h-8 rounded-lg border flex flex-col items-center justify-center px-1",
                            efOp.eficiencia >= 100 ? "bg-emerald-500/10 border-emerald-500/30" :
                            efOp.eficiencia >= 80 ? "bg-amber-500/10 border-amber-500/30" :
                            "bg-rose-500/10 border-rose-500/30"
                          )}>
                            <span className={cn(
                              "text-[11px] font-black italic leading-none",
                              efOp.eficiencia >= 100 ? "text-emerald-400" :
                              efOp.eficiencia >= 80 ? "text-amber-400" :
                              "text-rose-400"
                            )}>{efOp.eficiencia}%</span>
                            <span className="text-[7px] text-gray-600 font-mono leading-none mt-0.5">{efOp.tempoTrabalhado}m real</span>
                          </div>
                        ) : (
                          <div className="h-8 rounded-lg border border-white/5 bg-black/30 flex items-center justify-center">
                            <span className="text-[9px] text-gray-700 font-mono">—</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
 
            <div className="flex justify-between items-center mt-1">
              <button
                type="button"
                onClick={adicionarOperador}
                className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-400 hover:text-amber-350 transition-colors border border-amber-500/20 hover:border-amber-500/40 px-3 py-1.5 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Acrescentar Operador
              </button>
            </div>
          </div>
 
          <div className="space-y-1.5">
            <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Observação do Apontamento</Label>
            <Input 
              placeholder="Descreva atrasos, problemas de máquina, OS de manutenção, faltas, etc..." 
              value={observacao} 
              onChange={e => setObservacao(e.target.value)}
              className="bg-black/60 border border-white/10 h-9 rounded-xl text-xs font-semibold text-white placeholder:text-gray-700"
            />
          </div>
 
          <div className="flex justify-end gap-3 items-center mt-4">
            {efInfo && (
              <div className="text-[8px] text-gray-500 font-mono flex items-center gap-1.5">
                <span>T. Real: {efInfo.tempoTrabalhado}m</span>
                <span>|</span>
                <span>T. Pad: {efInfo.tempoPadraoMinutos.toFixed(1)}m</span>
              </div>
            )}

            {statusProducao !== 'concluido' && (
              <div className="text-[8px] text-amber-500/50 font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Marque como Concluído para liberar
              </div>
            )}

            <Button
              onClick={handleSalvar}
              disabled={statusProducao !== 'concluido'}
              className={cn(
                "h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                statusProducao !== 'concluido'
                  ? "bg-zinc-800 text-gray-600 cursor-not-allowed opacity-50 border border-zinc-700"
                  : salvo
                  ? "bg-emerald-600 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse"
              )}
            >
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              Salvar Apontamento
            </Button>
          </div>
        </div>
      </div>

      {/* DIALOG DE CONFIRMAÇÃO DE CONCLUSÃO */}
      <Dialog open={confirmarDialogOpen} onOpenChange={setConfirmarDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-emerald-500/30 text-white rounded-[30px] max-w-md shadow-[0_0_80px_rgba(16,185,129,0.15)]">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-emerald-400 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              Confirmar Conclusão
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Você está prestes a encerrar o apontamento de:
            </p>
            <div className="bg-black/50 border border-emerald-500/20 rounded-2xl p-4 space-y-1">
              <p className="text-base font-black text-white uppercase italic">{produto.produto}</p>
              <p className="text-[10px] text-gray-500 font-mono">{produto.codigo}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase">
                  Status: Concluído
                </Badge>
                <Badge className="bg-zinc-900 border border-zinc-800 text-gray-400 text-[9px] font-black">
                  {operadores.reduce((a, op) => a + (op.qtdProduzida || 0), 0)} peças produzidas
                </Badge>
              </div>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
              <p className="text-[10px] text-amber-400/80 font-bold leading-relaxed">
                ⚠️ Após confirmar, este item <strong>não aparecerá mais</strong> na sua tela e será registrado no PPCP como <strong>concluído</strong>. Esta ação não pode ser desfeita pelo terminal.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setConfirmarDialogOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-zinc-800 rounded-xl font-black uppercase text-[10px] tracking-widest"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarConclusao}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              Confirmar e Enviar ao PPCP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
