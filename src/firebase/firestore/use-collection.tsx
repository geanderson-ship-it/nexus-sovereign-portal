'use client';

import { useState, useEffect } from 'react';

// Otimização Platinum: hook useCollection emulado para AWS.
// Isso evita quebras de build enquanto migramos para Amplify Data.

export interface UseCollectionResult<T> {
  data: (T & { id: string })[] | null;
  isLoading: boolean;
  error: any | null;
}

export function useCollection<T = any>(
    memoizedTargetRefOrQuery: any | null | undefined,
): UseCollectionResult<T> {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Retorno seguro para evitar erros de renderização durante a migração.
    setData([]);
    setIsLoading(false);
    setError(null);
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}
