'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DesignSegmentPage() {
  const router = useRouter();
  useEffect(() => {
    // Redireciona para a página de intelligence com scroll para a seção Djeny
    // Por enquanto aponta para a rota de acesso do Djeny Design
    router.replace('/intelligence/djeny-design/access');
  }, [router]);
  return null;
}
