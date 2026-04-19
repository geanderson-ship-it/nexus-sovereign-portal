import React from 'react';

export default function DanteSafraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is now simpler as the parent /intelligence layout handles authentication.
  return <>{children}</>;
}
