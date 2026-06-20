'use client';

import React from 'react';
import AuthGate from '@/components/auth-gate';

export default function IntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate requiredLevel="SALES">
      <div className="flex-1 overflow-y-auto bg-black border-l border-white/5 pt-14 scrollbar-hide min-h-screen">
         {children}
      </div>
    </AuthGate>
  );
}
