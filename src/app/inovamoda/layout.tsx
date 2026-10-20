import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InovaModa 360 | Provador Virtual 3D com Inteligência Artificial | Nexus Holding Group',
  description: 'Revolucione o varejo de moda com o InovaModa 360: provador virtual 3D, Digital Twin corporal em tempo real, redução de até 70% em trocas e devoluções e privacidade total LGPD.',
  keywords: 'inovamoda, inovamoda 360, provador virtual 3d, fashion tech, digital twin moda, provador virtual ia, inteligência artificial moda, varejo de moda online, redução de devoluções moda, provador virtual b2b, nexus holding group',
  openGraph: {
    title: 'InovaModa 360 | Provador Virtual 3D com IA | Nexus Holding Group',
    description: 'A revolução do varejo de moda digital. Provador virtual 3D, redução drástica de logística reversa e experiência hiper-realista.',
    url: 'https://www.nexusholdinggroup.com.br/inovamoda',
    siteName: 'Nexus Holding Group',
    images: [
      {
        url: '/images/inovamoda-wide.png',
        width: 1200,
        height: 630,
        alt: 'InovaModa 360 - Provador Virtual 3D com Inteligência Artificial Nexus',
      },
    ],
    locale: 'pt-BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InovaModa 360 | Provador Virtual 3D com IA | Nexus Holding Group',
    description: 'A revolução do varejo de moda digital. Reduza trocas e devoluções a quase zero com o provador virtual 3D da Nexus.',
    images: ['/images/inovamoda-wide.png'],
  },
};

export default function InovaModaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
