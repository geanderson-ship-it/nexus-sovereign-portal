'use client';

import React from 'react';

export default function DjenyDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is now simpler as the parent /intelligence layout handles authentication.
  return <>{children}</>;
}
