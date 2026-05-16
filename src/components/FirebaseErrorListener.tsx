'use client';

import { useState, useEffect } from 'react';
import { eventEmitter } from '@/auth/event-emitter';

/**
 * Componente invisível que escuta eventos globais de erro.
 * Lança qualquer erro recebido para ser capturado pelo global-error.tsx do Next.js.
 */
export function AppErrorListener() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 'permission-error' foi removido — este listener agora é um no-op seguro.
    // Mantido para compatibilidade estrutural com o layout.
  }, []);

  if (error) throw error;

  return null;
}
