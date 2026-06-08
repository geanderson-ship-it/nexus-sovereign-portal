'use client';

import { useState, useEffect, useCallback } from 'react';

export interface MaterialProduto {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
}

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  imagem?: string;
  preco: number;
  unidade: string;
  materiais: MaterialProduto[];
  ativo: boolean;
}

export type StatusOP = 'aberta' | 'aguardando_aprovacao' | 'aprovada' | 'em_producao' | 'entregue' | 'cancelada';

export interface ItemOP {
  produtoId: string;
  produtoNome: string;
  produtoCodigo: string;
  quantidade: number;
  precoUnitario: number;
  materiais: MaterialProduto[];
}

export interface OrdemPedido {
  id: string;
  numero: string;
  cliente: string;
  vendedor: string;
  supervisor: string;
  dataVenda: string;
  dataEntregaPrevista: string;
  itens: ItemOP[];
  status: StatusOP;
  observacoes: string;
  valorTotal: number;
  createdAt?: string;
}

const KEY_PRODUTOS = 'nexus_vendas_produtos';
const KEY_OPS = 'nexus_vendas_ops';

export const DEFAULT_PRODUTOS: Produto[] = [
  {
    id: "prod-default-1",
    codigo: "JN-SUP-01",
    nome: "Janela de Correr 2 Folhas (Suprema)",
    descricao: "Janela de correr de alumínio linha Suprema, 2 folhas móveis com vidro incolor de 4mm. Altura 1.00m, largura 1.20m.",
    preco: 850.00,
    unidade: "UN",
    imagem: "https://i.postimg.cc/658CJQzk/Nexus-Empresas-prata.png",
    ativo: true,
    materiais: [
      { id: "mat-1-1", descricao: "Perfil Alumínio Suprema", quantidade: 3.8, unidade: "KG" },
      { id: "mat-1-2", descricao: "Vidro Incolor 4mm", quantidade: 1.2, unidade: "M²" },
      { id: "mat-1-3", descricao: "Kit de Acessórios Linha Suprema", quantidade: 1, unidade: "UN" },
      { id: "mat-1-4", descricao: "Escova de Vedação", quantidade: 4.4, unidade: "M" }
    ]
  },
  {
    id: "prod-default-2",
    codigo: "PT-GLD-02",
    nome: "Porta de Giro Premium (Gold)",
    descricao: "Porta de giro linha Gold com lambril duplo e fechadura digital embutida. Altura 2.10m, largura 0.90m.",
    preco: 2450.00,
    unidade: "UN",
    imagem: "https://i.postimg.cc/658CJQzk/Nexus-Empresas-prata.png",
    ativo: true,
    materiais: [
      { id: "mat-2-1", descricao: "Perfil Alumínio Gold", quantidade: 5.2, unidade: "KG" },
      { id: "mat-2-2", descricao: "Lambril de Alumínio Duplo", quantidade: 1.8, unidade: "M²" },
      { id: "mat-2-3", descricao: "Dobradiça Linha Gold", quantidade: 3, unidade: "UN" },
      { id: "mat-2-4", descricao: "Fechadura Digital Biométrica", quantidade: 1, unidade: "UN" }
    ]
  },
  {
    id: "prod-default-3",
    codigo: "JN-MAX-03",
    nome: "Janela Maxim-Ar (Suprema)",
    descricao: "Janela Maxim-ar linha Suprema com vidro miniboreal 4mm. Altura 0.60m, largura 0.60m.",
    preco: 420.00,
    unidade: "UN",
    imagem: "https://i.postimg.cc/658CJQzk/Nexus-Empresas-prata.png",
    ativo: true,
    materiais: [
      { id: "mat-3-1", descricao: "Perfil Alumínio Suprema", quantidade: 2.4, unidade: "KG" },
      { id: "mat-3-2", descricao: "Vidro Miniboreal 4mm", quantidade: 0.36, unidade: "M²" },
      { id: "mat-3-3", descricao: "Braço Articulado Inox", quantidade: 1, unidade: "UN" },
      { id: "mat-3-4", descricao: "Fecho Maxim-ar", quantidade: 1, unidade: "UN" }
    ]
  },
  {
    id: "prod-default-4",
    codigo: "PT-INT-04",
    nome: "Porta Integrada Automatizada (Gold)",
    descricao: "Porta integrada de correr com persiana motorizada em alumínio. Altura 2.20m, largura 1.50m.",
    preco: 4800.00,
    unidade: "UN",
    imagem: "https://i.postimg.cc/658CJQzk/Nexus-Empresas-prata.png",
    ativo: true,
    materiais: [
      { id: "mat-4-1", descricao: "Perfil Alumínio Gold", quantidade: 7.4, unidade: "KG" },
      { id: "mat-4-2", descricao: "Palheta de Persiana Térmica", quantidade: 3.3, unidade: "M²" },
      { id: "mat-4-3", descricao: "Motor Tubular Somfy 15Nm", quantidade: 1, unidade: "UN" },
      { id: "mat-4-4", descricao: "Vidro Temperado 6mm", quantidade: 1.5, unidade: "M²" },
      { id: "mat-4-5", descricao: "Kit de Guias e Rolamentos", quantidade: 1, unidade: "UN" }
    ]
  }
];

function loadProdutos(): Produto[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_PRODUTOS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem(KEY_PRODUTOS, JSON.stringify(DEFAULT_PRODUTOS));
    return DEFAULT_PRODUTOS;
  } catch {
    return DEFAULT_PRODUTOS;
  }
}

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function gerarNumeroOP(): string {
  const now = new Date();
  return `OP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

export function useVendas() {
  const [produtos, setProdutosState] = useState<Produto[]>([]);
  const [ops, setOpsState] = useState<OrdemPedido[]>([]);

  useEffect(() => {
    setProdutosState(loadProdutos());
    setOpsState(load<OrdemPedido>(KEY_OPS));
  }, []);

  const setProdutos = useCallback((fn: (prev: Produto[]) => Produto[]) => {
    setProdutosState(prev => { const next = fn(prev); save(KEY_PRODUTOS, next); return next; });
  }, []);

  const setOps = useCallback((fn: (prev: OrdemPedido[]) => OrdemPedido[]) => {
    setOpsState(prev => { const next = fn(prev); save(KEY_OPS, next); return next; });
  }, []);

  const salvarProduto = useCallback((form: Omit<Produto, 'id'>, editandoId?: string) => {
    setProdutos(prev => {
      if (editandoId) return prev.map(p => p.id === editandoId ? { ...p, ...form } : p);
      return [...prev, { id: crypto.randomUUID(), ...form }];
    });
  }, [setProdutos]);

  const excluirProduto = useCallback((id: string) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  }, [setProdutos]);

  const criarOP = useCallback((op: Omit<OrdemPedido, 'id' | 'numero' | 'status'>) => {
    const novaOP: OrdemPedido = {
      ...op,
      id: crypto.randomUUID(),
      numero: gerarNumeroOP(),
      status: 'aberta',
      createdAt: new Date().toISOString(),
    };
    setOps(prev => [novaOP, ...prev]);
    return novaOP;
  }, [setOps]);

  const atualizarStatusOP = useCallback((id: string, status: StatusOP) => {
    setOps(prev => prev.map(op => op.id === id ? { ...op, status } : op));
  }, [setOps]);

  const importarProdutos = useCallback((novos: Produto[]) => {
    setProdutos(() => novos);
  }, [setProdutos]);

  const restaurarPadroes = useCallback(() => {
    setProdutos(() => DEFAULT_PRODUTOS);
  }, [setProdutos]);

  return { 
    produtos, 
    ops, 
    salvarProduto, 
    excluirProduto, 
    criarOP, 
    atualizarStatusOP,
    importarProdutos,
    restaurarPadroes
  };
}

