'use client';
    
import { useState, useEffect } from 'react';

// Otimização Platinum: hook useDoc emulado para AWS.
// Isso evita quebras de build enquanto migramos para Amplify Data.

export interface UseDocResult<T> {
  data: (T & { id: string }) | null;
  isLoading: boolean;
  error: any | null;
}

export function useDoc<T = any>(
  memoizedDocRef: any | null | undefined,
): UseDocResult<T> {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Por enquanto, como estamos migrando do zero na AWS,
    // retornamos null de forma segura.
    setData(null);
    setIsLoading(false);
    setError(null);
  }, [memoizedDocRef]);

  return { data, isLoading, error };
}
