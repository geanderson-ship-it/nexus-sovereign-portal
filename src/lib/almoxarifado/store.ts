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
  custoUnitario: number;
  movimentos: Movimento[];
}

const KEY = 'nexus_almoxarifado_itens';

function load(): ItemEstoque[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  // MOCK INICIAL PARA DEMONSTRAÇÃO
  return [
    {
      id: crypto.randomUUID(),
      codigo: 'PRF-001',
      descricao: 'PERFIL DE ALUMÍNIO SUPREMA (BARRAS)',
      unidade: 'M',
      estoqueMinimo: 50,
      estoqueAtual: 40, // Crítico
      localizacao: 'A1-P1',
      custoUnitario: 85.50, // Curva A ou B dependendo do giro
      movimentos: [
        { id: crypto.randomUUID(), tipo: 'saida', quantidade: 20, data: new Date().toISOString().split('T')[0], responsavel: 'SISTEMA', observacao: 'Consumo Médio' }
      ]
    },
    {
      id: crypto.randomUUID(),
      codigo: 'MTR-001',
      descricao: 'MOTOR P/ PERSIANA INTEGRADA',
      unidade: 'UN',
      estoqueMinimo: 10,
      estoqueAtual: 25, // OK
      localizacao: 'C3-P2',
      custoUnitario: 450.00, // Curva A (Alto Valor)
      movimentos: [
        { id: crypto.randomUUID(), tipo: 'entrada', quantidade: 30, data: new Date().toISOString().split('T')[0], responsavel: 'SISTEMA', observacao: 'Compra NF' }
      ]
    },
    {
      id: crypto.randomUUID(),
      codigo: 'PAR-M8',
      descricao: 'PARAFUSO SEXTAVADO M8',
      unidade: 'CX',
      estoqueMinimo: 100,
      estoqueAtual: 350, // OK
      localizacao: 'B2-P1',
      custoUnitario: 12.00, // Curva C (Baixo Valor / Alto Volume)
      movimentos: []
    },
    {
      id: crypto.randomUUID(),
      codigo: 'VDR-T8',
      descricao: 'VIDRO TEMPERADO 8MM INCOLOR',
      unidade: 'M2',
      estoqueMinimo: 20,
      estoqueAtual: 15, // Crítico
      localizacao: 'G-1',
      custoUnitario: 120.00, // Curva A ou B
      movimentos: [
        { id: crypto.randomUUID(), tipo: 'saida', quantidade: 5, data: new Date().toISOString().split('T')[0], responsavel: 'SISTEMA', observacao: 'Consumo Diário' }
      ]
    }
  ];
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
        let found = false;
        next = next.map(item => {
          const match =
            (codigo && item.codigo.toLowerCase() === codigo.toLowerCase()) ||
            item.descricao.toLowerCase() === descricao.toLowerCase();
          if (!match) return item;
          found = true;
          const mov: Movimento = {
            id: crypto.randomUUID(),
            tipo, quantidade, data, responsavel, observacao,
          };
          const novoEstoque = tipo === 'entrada'
            ? item.estoqueAtual + quantidade
            : Math.max(0, item.estoqueAtual - quantidade);
          return { ...item, estoqueAtual: novoEstoque, movimentos: [mov, ...item.movimentos] };
        });

        if (!found) {
          const mov: Movimento = {
            id: crypto.randomUUID(),
            tipo, quantidade, data, responsavel, observacao,
          };
          next.push({
            id: crypto.randomUUID(),
            codigo: codigo || '',
            descricao: descricao || 'Item sem descrição',
            unidade: 'UN',
            estoqueMinimo: 0,
            estoqueAtual: tipo === 'entrada' ? quantidade : 0,
            localizacao: '',
            custoUnitario: 0,
            movimentos: [mov]
          });
        }
      });
      return next;
    });
  }, [setItens]);

  return { itens, salvarItem, excluirItem, aplicarMovimento, aplicarNota };
}
