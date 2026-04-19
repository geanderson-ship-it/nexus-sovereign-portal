import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dante Safra | Inteligência Tática Agrícola',
  description: 'O cérebro tático do agronegócio. Monitoramento, telemetria e decisões estratégicas impulsionadas por IA Nexus.',
  keywords: 'agronegócio, inteligência artificial, dante safra, telemetria campo',
};

export default function DanteSafraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
