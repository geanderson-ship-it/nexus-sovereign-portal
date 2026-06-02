import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agro | Terminal Dante Safra',
  description: 'O cérebro tático do agronegócio. Monitoramento, telemetria e decisões estratégicas impulsionadas por IA Nexus.',
  keywords: 'agronegócio, inteligência artificial, dante safra, telemetria campo',
};

export default function AgroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
