'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Movimento {
  id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: string;
  responsavel: string;
  observacao: string;
}

export interface ItemEstoque {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  estoqueMinimo: number;
  estoqueAtual: number;
  localizacao: string;
  movimentos: Movimento[];
}

const KEY = 'nexus_almoxarifado_itens';

function load(): ItemEstoque[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(itens: ItemEstoque[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(itens));
}

export function useAlmoxarifado() {
  const [itens, setItensState] = useState<ItemEstoque[]>([]);

  useEffect(() => {
    setItensState(load());
  }, []);

  const setItens = useCallback((fn: (prev: ItemEstoque[]) => ItemEstoque[]) => {
    setItensState(prev => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const salvarItem = useCallback((form: Omit<ItemEstoque, 'id' | 'movimentos'>, editandoId?: string) => {
    setItens(prev => {
      if (editandoId) {
        return prev.map(i => i.id === editandoId ? { ...i, ...form } : i);
      }
      return [...prev, { id: crypto.randomUUID(), ...form, movimentos: [] }];
    });
  }, [setItens]);

  const excluirItem = useCallback((id: string) => {
    setItens(prev => prev.filter(i => i.id !== id));
  }, [setItens]);

  // Aplica movimentação em item específico por código ou id
  const aplicarMovimento = useCallback((
    identificador: string, // codigo ou descricao
    tipo: 'entrada' | 'saida',
    quantidade: number,
    data: string,
    responsavel: string,
    observacao = ''
  ) => {
    setItens(prev => prev.map(item => {
      const match =
        item.codigo.toLowerCase() === identificador.toLowerCase() ||
        item.descricao.toLowerCase() === identificador.toLowerCase() ||
        item.id === identificador;
      if (!match) return item;
      const mov: Movimento = {
        id: crypto.randomUUID(),
        tipo, quantidade, data, responsavel, observacao,
      };
      const novoEstoque = tipo === 'entrada'
        ? item.estoqueAtual + quantidade
        : Math.max(0, item.estoqueAtual - quantidade);
      return { ...item, estoqueAtual: novoEstoque, movimentos: [mov, ...item.movimentos] };
    }));
  }, [setItens]);

  // Aplica múltiplos itens de uma nota de entrada/saída
  const aplicarNota = useCallback((
    tipo: 'entrada' | 'saida',
    itensNota: { descricao: string; codigo: string; quantidade: number }[],
    data: string,
    responsavel: string,
    observacao = ''
  ) => {
    setItens(prev => {
      let next = [...prev];
      itensNota.forEach(({ descricao, codigo, quantidade }) => {
        next = next.map(item => {
          const match =
            (codigo && item.codigo.toLowerCase() === codigo.toLowerCase()) ||
            item.descricao.toLowerCase() === descricao.toLowerCase();
          if (!match) return item;
          const mov: Movimento = {
            id: crypto.randomUUID(),
            tipo, quantidade, data, responsavel, observacao,
          };
          const novoEstoque = tipo === 'entrada'
            ? item.estoqueAtual + quantidade
            : Math.max(0, item.estoqueAtual - quantidade);
          return { ...item, estoqueAtual: novoEstoque, movimentos: [mov, ...item.movimentos] };
        });
      });
      return next;
    });
  }, [setItens]);

  return { itens, salvarItem, excluirItem, aplicarMovimento, aplicarNota };
}
