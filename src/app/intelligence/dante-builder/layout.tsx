
import React from 'react';

export default function DanteBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8 h-screen max-h-screen flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
