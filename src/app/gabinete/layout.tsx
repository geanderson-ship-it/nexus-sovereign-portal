'use client';

import React from 'react';
import AuthGate from '@/components/auth-gate';
import { SiteHeader } from '@/components/layout/site-header';
import { notFound } from 'next/navigation';

export default function GabineteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* VIX: Protocolo de Acesso Estratégico. 
     O Gabinete é uma área de comando agora disponível para administradores em todos os ambientes. */

  return (
    <AuthGate adminOnly>
      <SiteHeader />
      <div className="flex-1 overflow-y-auto bg-zinc-950/40 backdrop-blur-md border-l border-white/10 pt-14">
        <main className="container mx-auto p-4 md:p-8">
            {children}
        </main>
      </div>
    </AuthGate>
  );
}
