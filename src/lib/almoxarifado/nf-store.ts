'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NotaFiscal {
  id: string;
  numero: string;
  fornecedor: string;
  valorTotal: number;
  transportadora: string;
  impostos: string; // Ex: "ICMS: 18%, IPI: 5%"
  dataEmissao: string;
  imagemUrl: string; // Link para a imagem do scanner (DANFE)
}

const KEY_NF = 'nexus_almoxarifado_notas_fiscais';

export const DEFAULT_NFS: NotaFiscal[] = [
  {
    id: "nf-mock-1234",
    numero: "nf1234",
    fornecedor: "SIDERÚRGICA NACIONAL S/A",
    valorTotal: 195000.00,
    transportadora: "Transportes Relâmpago",
    impostos: "ICMS: R$ 35.100,00 | IPI: R$ 9.750,00",
    dataEmissao: new Date().toISOString().split('T')[0],
    imagemUrl: "https://i.postimg.cc/85zK2hZJ/Nexus-Empresas-black.png" // Placeholder
  },
  {
    id: "nf-mock-5678",
    numero: "nf5678",
    fornecedor: "ALUMÍNIOS ALCOA",
    valorTotal: 45200.50,
    transportadora: "Braspress Logística",
    impostos: "ICMS: R$ 8.136,09 | IPI: R$ 2.260,02",
    dataEmissao: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    imagemUrl: "https://i.postimg.cc/85zK2hZJ/Nexus-Empresas-black.png"
  }
];

function loadNFs(): NotaFiscal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_NF);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem(KEY_NF, JSON.stringify(DEFAULT_NFS));
    return DEFAULT_NFS;
  } catch {
    return DEFAULT_NFS;
  }
}

export function useNotasFiscais() {
  const [notas, setNotasState] = useState<NotaFiscal[]>([]);

  useEffect(() => {
    setNotasState(loadNFs());
  }, []);

  const salvarNota = useCallback((form: Omit<NotaFiscal, 'id'>, editandoId?: string) => {
    setNotasState(prev => {
      let next;
      if (editandoId) {
        next = prev.map(n => n.id === editandoId ? { ...n, ...form } : n);
      } else {
        next = [{ id: crypto.randomUUID(), ...form }, ...prev];
      }
      if (typeof window !== 'undefined') localStorage.setItem(KEY_NF, JSON.stringify(next));
      return next;
    });
  }, []);

  const excluirNota = useCallback((id: string) => {
    setNotasState(prev => {
      const next = prev.filter(n => n.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem(KEY_NF, JSON.stringify(next));
      return next;
    });
  }, []);

  return { notas, salvarNota, excluirNota };
}
