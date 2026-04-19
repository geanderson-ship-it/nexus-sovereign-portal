'use client';

import React from 'react';
import AuthGate from '@/components/auth-gate';
import { SiteHeader } from '@/components/layout/site-header';

export default function NexusIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <SiteHeader />
      <div className="w-full bg-zinc-950/40 backdrop-blur-md border-l border-white/10 flex-1 pt-14">
        <main className="container mx-auto p-4 md:p-8">
            {children}
        </main>
      </div>
    </AuthGate>
  );
}
