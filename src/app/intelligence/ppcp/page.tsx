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
import { Plus, Trash2, ArrowLeft, Printer, Target, Settings2, CalendarDays, Factory, Package, Scissors, Activity, Layers, Zap, Clock, Timer, Calculator, User, AlertTriangle, ShieldCheck, Info, Scale, Search, CheckCircle, Database, Globe, Share2, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

const TEMPO_DISPONIVEL_DIA = 528; // 8.8h * 60min

// MOCK DO BANCO DE ENGENHARIA
const BANCO_ENGENHARIA = [
  { produto: 'CORTE DE PERFIL 6MM', codigo: 'PRF-006', pecasPorCiclo: 5, tempoPadrao: 0.81 },
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
    auditado: false,
    operador: '',
    horaInicio: '',
    horaFim: '',
    qtdProduzida: 0,
    statusProducao: 'fila' as const
  }));

type StatusOP = 'aberta' | 'aguardando_aprovacao' | 'aprovada' | 'em_producao' | 'entregue' | 'cancelada';

const statusConfig: Record<StatusOP, { label: string; color: string }> = {
  aberta:               { label: 'Aberta',              color: 'text-blue-400 border-blue-500/30' },
  aguardando_aprovacao: { label: 'Aguard. Aprovação',   color: 'text-amber-400 border-amber-500/30' },
  aprovada:             { label: 'Aprovada',             color: 'text-emerald-400 border-emerald-500/30' },
  em_producao:          { label: 'Em Produção',          color: 'text-violet-400 border-violet-500/30' },
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
  const [setores, setSetores] = useState<string[]>(['CORTE', 'AJUSTE', 'SOLDA', 'MONTAGEM']);
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

  const carregarDadosIntegrados = () => {
    if (typeof window !== 'undefined') {
      try {
        const opsRaw = localStorage.getItem('nexus_vendas_ops');
        if (opsRaw) setVendasOps(JSON.parse(opsRaw));

        const estudosRaw = localStorage.getItem('nexus_cronoanalise_estudos');
        if (estudosRaw) setCronoEstudos(JSON.parse(estudosRaw));
      } catch (e) {
        console.error("Erro ao carregar dados integrados no PPCP:", e);
      }
    }
  };

  const sincronizarPPCP = () => {
    carregarDadosIntegrados();
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
          setProgramacoes(JSON.parse(progsRaw));
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
                  pecasPorCiclo: 5,
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
              linha: 'AJUSTE',
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
          setSetores(JSON.parse(setoresRaw));
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
        statusProducao: 'fila'
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
      statusProducao: 'fila' | 'produzindo' | 'concluido' 
    }
  ) => {
    setProgramacoes(prev => prev.map(prog => {
      if (prog.id !== progId) return prog;
      return {
        ...prog,
        produtos: prog.produtos.map(p => {
          if (p.id !== produtoId) return p;
          return {
            ...p,
            ...apontamento
          };
        })
      };
    }));
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
            {programacoes.filter(prog => prog.linha.toUpperCase() === activeSectorTab.toUpperCase()).length === 0 ? (
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-[30px] p-16 text-center w-full max-w-lg mx-auto space-y-4">
                <Factory className="h-12 w-12 text-amber-500/20 mx-auto" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Sem programas agendados em {activeSectorTab}</p>
                <p className="text-[10px] text-gray-600 max-w-xs mx-auto">Use o botão "Nova Programação" no topo para planejar um programa para esta linha.</p>
              </div>
            ) : (
              programacoes
                .filter(prog => prog.linha.toUpperCase() === activeSectorTab.toUpperCase())
                .map((prog) => {
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
                            <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Qtd Prog.</TableHead>
                            <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Progresso / Status</TableHead>
                            <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Operador / Tempo</TableHead>
                            <TableHead className="text-right px-10 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">T. Nec (min)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prog.produtos.map((p) => {
                            const c = calcularLinha(p);
                            const pctProg = p.qtdNecessaria > 0 ? Math.round(((p.qtdProduzida || 0) / p.qtdNecessaria) * 100) : 0;
                            const st = p.statusProducao || 'fila';
                            
                            // Calculate efficiency real
                            let efReal = null;
                            if (p.horaInicio && p.horaFim && p.qtdProduzida) {
                              const parseTimeToMinutes = (timeStr: string) => {
                                const parts = timeStr.split(':');
                                if (parts.length !== 2) return null;
                                const h = parseInt(parts[0], 10);
                                const m = parseInt(parts[1], 10);
                                return isNaN(h) || isNaN(m) ? null : h * 60 + m;
                              };
                              const minI = parseTimeToMinutes(p.horaInicio);
                              const minF = parseTimeToMinutes(p.horaFim);
                              if (minI !== null && minF !== null) {
                                let diff = minF - minI;
                                if (diff <= 0) diff += 1440;
                                const ciclos = p.qtdProduzida / (p.pecasPorCiclo || 1);
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
                                  {p.codigo && (
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
                                </TableCell>
                                <TableCell className="text-center font-mono text-[10px] text-gray-500">{p.codigo}</TableCell>
                                <TableCell className="text-center font-bold text-gray-300 text-base">{p.qtdNecessaria.toLocaleString()}</TableCell>
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
                                        <span className="text-[10px] font-mono text-gray-400">{p.qtdProduzida || 0} / {p.qtdNecessaria}</span>
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
                                  {p.operador ? (
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
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
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
                      <TableHead className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] whitespace-nowrap min-w-[100px]">Nº OP</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Cliente</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Produto / Operação</TableHead>
                      <TableHead className="text-center pl-6 pr-16 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] whitespace-nowrap">Código</TableHead>
                      <TableHead className="text-center pl-16 pr-6 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Qtd</TableHead>
                      <TableHead className="text-center text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Pçs/Ciclo</TableHead>
                      <TableHead className="text-right pr-4 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] whitespace-nowrap">Tempo Base (min)</TableHead>
                      <TableHead className="text-right pl-2 pr-10 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] whitespace-nowrap">Tempo Total (min)</TableHead>
                      <TableHead className="text-left px-4 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Detalhes de Produção (BOM)</TableHead>
                      <TableHead className="text-center px-4 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] whitespace-nowrap">Regra de Corte</TableHead>
                      <TableHead className="text-center px-8 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Status OP</TableHead>
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
                          <TableCell className="px-8 py-5 font-mono text-xs text-amber-300 font-bold whitespace-nowrap flex items-center">
                            {item.opNumero}
                            {isNew && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] font-black bg-violet-600 text-white uppercase tracking-widest animate-[pulse_1s_infinite] ml-2 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                                Novo
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-gray-300 text-xs uppercase">{item.cliente}</TableCell>
                          <TableCell className="font-black text-sm uppercase text-white tracking-tight">{item.produtoNome}</TableCell>
                          <TableCell className="text-center pl-6 pr-16 font-mono text-[10px] text-gray-500 whitespace-nowrap">{item.produtoCodigo}</TableCell>
                          <TableCell className="text-center pl-16 pr-6 font-bold text-gray-300 text-base">{item.quantidade.toLocaleString()}</TableCell>
                          <TableCell className="text-center"><Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[10px] px-3">{item.pecasPorCiclo}x</Badge></TableCell>
                          <TableCell className="text-right pr-4 font-black text-white text-sm">{item.tempoPadrao.toFixed(3)}</TableCell>
                          <TableCell className="text-right pl-2 pr-10 font-black text-amber-400 text-base">
                            {item.tempoTotal.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-left font-mono text-[9px] text-amber-500/70 max-w-sm px-4 leading-relaxed">
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
                                <div className="py-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => abrirEditorBOM(item.produtoNome, item.produtoCodigo)}
                                    className="border-amber-500/20 hover:border-amber-500/55 text-amber-400 text-[10px] font-black uppercase h-7 rounded-lg w-fit px-2.5 flex items-center gap-1.5"
                                  >
                                    <Settings2 className="h-3.5 w-3.5" />
                                    Estrutura ({count || 2} itens)
                                  </Button>
                                </div>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-center px-4">
                            {(() => {
                              if (!item.createdAt) return <span className="text-gray-600 text-[10px]">—</span>;
                              const date = new Date(item.createdAt);
                              const hour = date.getHours();
                              const minutes = date.getMinutes();
                              const timeStr = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                              
                              const isAfterCutoff = hour >= 12;
                              return (
                                <div className="flex flex-col items-center gap-1 justify-center">
                                  <Badge className={cn(
                                    "text-[8px] font-black uppercase py-0.5 px-2 bg-transparent border",
                                    isAfterCutoff 
                                      ? "text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.05)]" 
                                      : "text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                                  )}>
                                    {isAfterCutoff ? 'Pós-Corte (Amanhã)' : 'Pré-Corte (Hoje)'}
                                  </Badge>
                                  <span className="text-[8px] text-gray-500 font-mono">Enviado: {timeStr}</span>
                                </div>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-center px-8">
                            <Badge className={cn('border bg-transparent text-[8px] font-black uppercase py-0.5', st.color)}>
                              {st.label}
                            </Badge>
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

                    {/* GRUPO DE CARDS DE APONTAMENTO */}
                    <div className="grid grid-cols-1 gap-4">
                      {prog.produtos.map(p => {
                        const matchingOp = vendasOps.find(op => 
                          op.itens && op.itens.some((item: any) => item.produtoCodigo === p.codigo)
                        );
                        return (
                          <CardApontamento 
                            key={p.id}
                            progId={prog.id}
                            produto={p}
                            onSalvar={salvarApontamento}
                            matchingOp={matchingOp}
                          />
                        );
                      })}
                    </div>
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
      </div>
    </SovereignShowcase>
  );
}

interface CardApontamentoProps {
  progId: string;
  produto: Produto;
  onSalvar: (
    progId: string, 
    produtoId: string, 
    apontamento: { 
      operador: string; 
      horaInicio: string; 
      horaFim: string; 
      qtdProduzida: number; 
      statusProducao: 'fila' | 'produzindo' | 'concluido' 
    }
  ) => void;
  matchingOp?: any;
}

function CardApontamento({ progId, produto, onSalvar, matchingOp }: CardApontamentoProps) {
  const [operador, setOperador] = useState(produto.operador || '');
  const [horaInicio, setHoraInicio] = useState(produto.horaInicio || '');
  const [horaFim, setHoraFim] = useState(produto.horaFim || '');
  const [qtdProduzida, setQtdProduzida] = useState(produto.qtdProduzida || 0);
  const [statusProducao, setStatusProducao] = useState<'fila' | 'produzindo' | 'concluido'>(produto.statusProducao || 'fila');
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    setOperador(produto.operador || '');
    setHoraInicio(produto.horaInicio || '');
    setHoraFim(produto.horaFim || '');
    setQtdProduzida(produto.qtdProduzida !== undefined ? produto.qtdProduzida : 0);
    setStatusProducao(produto.statusProducao || 'fila');
    setSalvo(false);
  }, [produto]);

  const ciclosAlvo = Math.ceil(produto.qtdNecessaria / (produto.pecasPorCiclo || 1));
  const tempoAlvoMinutos = ciclosAlvo * (produto.tempoPadrao || 0);

  const efInfo = useMemo(() => {
    if (!horaInicio || !horaFim || !qtdProduzida) return null;
    
    const parseTimeToMinutes = (timeStr: string) => {
      const parts = timeStr.split(':');
      if (parts.length !== 2) return null;
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (isNaN(hours) || isNaN(minutes)) return null;
      return hours * 60 + minutes;
    };
    
    const minInicio = parseTimeToMinutes(horaInicio);
    const minFim = parseTimeToMinutes(horaFim);
    
    if (minInicio === null || minFim === null) return null;
    
    let tempoTrabalhado = minFim - minInicio;
    if (tempoTrabalhado <= 0) {
      tempoTrabalhado += 1440; // overnight
    }
    
    const ciclos = qtdProduzida / (produto.pecasPorCiclo || 1);
    const tempoPadraoMinutos = ciclos * produto.tempoPadrao;
    const eficiencia = (tempoPadraoMinutos / tempoTrabalhado) * 100;
    
    return {
      tempoTrabalhado,
      tempoPadraoMinutos,
      eficiencia: parseFloat(eficiencia.toFixed(1))
    };
  }, [horaInicio, horaFim, qtdProduzida, produto.pecasPorCiclo, produto.tempoPadrao]);

  const handleSalvar = () => {
    onSalvar(progId, produto.id, {
      operador,
      horaInicio,
      horaFim,
      qtdProduzida,
      statusProducao
    });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  return (
    <div className={cn(
      "p-6 rounded-[30px] border transition-all duration-300",
      statusProducao === 'concluido' ? "bg-emerald-950/20 border-emerald-500/30" :
      statusProducao === 'produzindo' ? "bg-violet-950/20 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.05)]" :
      "bg-zinc-950/60 border-amber-500/10 hover:border-amber-500/20"
    )}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            </div>
            <Badge className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] px-2 py-0.5">
              {produto.codigo}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-black/40 border border-white/5 rounded-2xl">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Meta (Necessário)</span>
              <p className="text-lg font-black text-white italic mt-0.5">{produto.qtdNecessaria.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-2xl">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Ciclo Padrão</span>
              <p className="text-[10px] font-bold text-gray-300 mt-0.5">{produto.pecasPorCiclo}x @ {produto.tempoPadrao}s</p>
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Operador</Label>
                <Input 
                  placeholder="Nome do Operador" 
                  value={operador} 
                  onChange={e => setOperador(e.target.value.toUpperCase())}
                  className="bg-black/60 border border-white/10 h-9 rounded-xl text-xs font-bold uppercase text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Hora Início</Label>
                <Input 
                  placeholder="07:30" 
                  value={horaInicio} 
                  onChange={e => setHoraInicio(e.target.value)}
                  className="bg-black/60 border border-white/10 h-9 rounded-xl text-center text-xs font-mono font-bold text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Hora Fim</Label>
                <Input 
                  placeholder="12:00" 
                  value={horaFim} 
                  onChange={e => setHoraFim(e.target.value)}
                  className="bg-black/60 border border-white/10 h-9 rounded-xl text-center text-xs font-mono font-bold text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="space-y-1.5">
                <Label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Qtd Produzida (Peças)</Label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={qtdProduzida || ''} 
                  onChange={e => setQtdProduzida(Number(e.target.value))}
                  className="bg-black/60 border border-white/10 h-9 rounded-xl text-center text-xs font-bold text-emerald-400"
                />
              </div>

              {/* LIVE EFFICIENCY INFO */}
              <div className="p-2 rounded-xl bg-black/40 border border-white/5 h-9 flex items-center justify-between px-3">
                <span className="text-[8px] font-black uppercase text-gray-500 tracking-wider">Eficiência:</span>
                {efInfo ? (
                  <span className={cn(
                    "text-xs font-black italic",
                    efInfo.eficiencia >= 100 ? "text-emerald-400" :
                    efInfo.eficiencia >= 80 ? "text-amber-400" :
                    "text-rose-400"
                  )}>
                    {efInfo.eficiencia}%
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-gray-600 font-mono">--</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 items-center mt-4 lg:mt-0">
            {efInfo && (
              <div className="text-[8px] text-gray-500 font-mono flex items-center gap-1.5">
                <span>T. Real: {efInfo.tempoTrabalhado}m</span>
                <span>|</span>
                <span>T. Pad: {efInfo.tempoPadraoMinutos.toFixed(1)}m</span>
              </div>
            )}
            <Button
              onClick={handleSalvar}
              className={cn(
                "h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                salvo ? "bg-emerald-600 hover:bg-emerald-600 text-white" : "bg-amber-600 hover:bg-amber-500 text-white"
              )}
            >
              {salvo ? <ShieldCheck className="h-4 w-4 mr-1.5" /> : null}
              {salvo ? "Apontado!" : "Salvar Apontamento"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
