'use client';

import React from 'react';

export default function DanteComprasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is now simpler as the parent /intelligence layout handles authentication.
  return <>{children}</>;
}
