'use client';

import { useEffect } from 'react';
import { useAccessLevel } from '@/hooks/use-access-level';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { hasAdminAccess, hasSalesAccess, isLoading } = useAccessLevel();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isLocal = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );

    if (isLocal) {
      if (hasAdminAccess) {
        router.replace('/gabinete');
      } else if (hasSalesAccess) {
        router.replace('/gabinete-vendas');
      } else {
        router.replace('/');
      }
    } else {
      window.location.replace('https://nexustreinamento.com');
    }
  }, [isLoading, hasAdminAccess, hasSalesAccess, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#080b10] text-[#f0f6fc] font-sans">
      <div className="text-center space-y-2">
        <span className="text-sm font-medium animate-pulse text-blue-400">Redirecionando...</span>
      </div>
    </div>
  );
}
