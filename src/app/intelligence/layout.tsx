'use client';

import React from 'react';

export default function IntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-black border-l border-white/5 pt-14 scrollbar-hide min-h-screen">
       {children}
    </div>
  );
}
