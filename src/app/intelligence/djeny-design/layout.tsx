'use client';

import React from 'react';
import AuthGate from '@/components/auth-gate';

export default function DjenyDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We require ADMIN access specifically for Djeny Design, overriding the broader SALES access of /intelligence.
  return (
    <AuthGate requiredLevel="ADMIN">
      {children}
    </AuthGate>
  );
}
