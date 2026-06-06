
import React from 'react';

export default function DanteBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8 flex flex-col">
      {children}
    </div>
  );
}
