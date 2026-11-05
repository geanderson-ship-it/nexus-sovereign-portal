import type { Metadata } from 'next';
import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nexusholdinggroup.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Palestras de Inteligência Artificial, Liderança & Saúde Mental (NR-1) | Dante & Djeny',
  description: 'Contrate as palestras oficiais de IA da Nexus Holding Group. Dante & Djeny no palco para convenções, liderança executiva e combate ao Burnout (conformidade NR-1). Shows corporativos em 4K com interação Live Avatar em tempo real.',
  keywords: [
    'palestra inteligência artificial',
    'palestrante de IA',
    'palestras corporativas',
    'palestrantes para convenções',
    'palestra combate ao burnout',
    'NR-1 riscos psicossociais',
    'palestra saúde mental no trabalho',
    'Dante e Djeny palestrantes',
    'liderança na era da IA',
    'palestra para SIPAT',
    'convenção anual de empresas',
    'keynote speaker inteligência artificial',
    'treinamento corporativo de liderança',
    'Nexus Treinamento',
    'Nexus Holding Group',
    'palestrantes virtuais',
    'live avatar no palco',
    'visão computacional no auditório',
    'inteligência artificial humanizada',
    'gestão de estresse corporativo'
  ].join(', '),
  openGraph: {
    title: 'Palestras de IA, Liderança & Saúde Mental (NR-1) | Dante & Djeny',
    description: 'Shows corporativos de Inteligência Artificial para convenções, liderança e combate ao Burnout. Dante & Djeny no palco da Nexus Holding Group.',
    url: `${SITE_URL}/palestras`,
    siteName: 'Nexus Holding Group',
    images: [
      {
        url: '/palestras/palestra_bandeiras_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Palestras Corporativas de IA - Dante & Djeny • Nexus Holding Group',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palestras de IA, Liderança & Saúde Mental (NR-1) | Dante & Djeny',
    description: 'Palco oficial de Inteligência Artificial da Nexus Holding Group. Convenções, liderança e prevenção ativa ao Burnout (NR-1).',
    images: ['/palestras/palestra_bandeiras_hero.jpg'],
  },
  alternates: {
    canonical: `${SITE_URL}/palestras`,
  },
};

export default function PalestrasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    'name': 'Palestras Corporativas de Inteligência Artificial, Liderança & Saúde Mental',
    'description': 'Ciclo de palestras executivas ministrado por Dante & Djeny para convenções empresariais, liderança estratégica e conformidade viva com a NR-1 no combate ao Burnout.',
    'organizer': {
      '@type': 'Organization',
      'name': 'Nexus Holding Group',
      'url': SITE_URL,
      'logo': `${SITE_URL}/nexus-logo-square.png`
    },
    'performer': [
      {
        '@type': 'Person',
        'name': 'Dante',
        'jobTitle': 'Palestrante Executivo de Liderança, Tomada de Decisão & IA',
        'worksFor': {
          '@type': 'Organization',
          'name': 'Nexus Holding Group'
        }
      },
      {
        '@type': 'Person',
        'name': 'Djeny',
        'jobTitle': 'Palestrante de Inteligência Emocional, Saúde Mental & NR-1',
        'worksFor': {
          '@type': 'Organization',
          'name': 'Nexus Holding Group'
        }
      }
    ],
    'offers': {
      '@type': 'Offer',
      'url': `${SITE_URL}/palestras`,
      'availability': 'https://schema.org/InStock',
      'category': 'Palestras e Convenções Corporativas'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
