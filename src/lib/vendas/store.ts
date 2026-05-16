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
}

const KEY_PRODUTOS = 'nexus_vendas_produtos';
const KEY_OPS = 'nexus_vendas_ops';

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
    setProdutosState(load<Produto>(KEY_PRODUTOS));
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
    };
    setOps(prev => [novaOP, ...prev]);
    return novaOP;
  }, [setOps]);

  const atualizarStatusOP = useCallback((id: string, status: StatusOP) => {
    setOps(prev => prev.map(op => op.id === id ? { ...op, status } : op));
  }, [setOps]);

  return { produtos, ops, salvarProduto, excluirProduto, criarOP, atualizarStatusOP };
}
