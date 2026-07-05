// Nexus Build Trigger: 2026-04-11T17:13
import './globals.css';
import { cn } from '@/lib/utils';
import { Poppins, PT_Sans } from 'next/font/google';
import { ClientProviders } from '@/components/providers/client-providers';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { NexusAvatarChat } from '@/components/nexus-avatar-chat';
import Script from 'next/script';
import { Metadata } from 'next';

import AwsRumAnalytics from '@/components/analytics/aws-rum-analytics';
import GoogleAnalytics from '@/components/analytics/google-analytics';
import { GA_TRACKING_ID } from '@/lib/gtag';
import LanguageSwitcher from '@/components/nexus/LanguageSwitcher';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0B',
};

export const metadata: Metadata = {
  title: 'Nexus Inteligência | Hub para Evolução Humana & IA',
  description: 'A convergência definitiva entre tecnologia avançada e essência humana. Mentoria, cursos e IA estratégica para acelerar sua jornada global.',
  keywords: 'inteligência artificial, mentoria de elite, dante safra, magadot, orion, nexus, aws activate startup',
  openGraph: {
    title: 'Nexus Inteligência | Hub para Evolução Humana & IA',
    description: 'Transforme sua carreira com a inteligência da Nexus. Tecnologia de ponta, essência humana.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexus.aws',
    siteName: 'Nexus',
    images: [
      {
        url: '/nexus-hero-hologram.png',
        width: 1200,
        height: 630,
        alt: 'Nexus Inteligência Artificial',
      },
    ],
    locale: 'pt-BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus Inteligência | IA & Evolução',
    description: 'Acelere sua jornada com o cérebro da Nexus.',
    images: ['/nexus-hero-hologram.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Atena',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexus.aws',
    languages: {
      'pt-BR': 'https://nexus.aws',
      'en-US': 'https://nexus.aws/en',
      'es-ES': 'https://nexus.aws/es',
      'fr-FR': 'https://nexus.aws/fr',
      'de-DE': 'https://nexus.aws/de',
      'ja-JP': 'https://nexus.aws/ja',
      'ru-RU': 'https://nexus.aws/ru',
      'zh-CN': 'https://nexus.aws/zh',
      'ar-AE': 'https://nexus.aws/ar',
    },
  },
};

const fontHeadline = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-headline',
});

const fontSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className="dark overflow-x-hidden"
      style={{ colorScheme: 'dark' }}
    >
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
        {`
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "EducationalOrganization",
                "@id": "https://nexustreinamento.com/#organization",
                "name": "Nexus Inteligência",
                "url": "https://nexustreinamento.com",
                "logo": "https://nexustreinamento.com/nexus-hero-hologram.png",
                "description": "Plataforma avançada de cursos online, mentoria de IA e inteligência estratégica para acelerar sua carreira e negócios.",
                "brand": "Nexus",
                "sameAs": [
                  "https://nexus.aws"
                ]
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/dante-safra",
                "name": "Dante Safra",
                "alternateName": ["Dante Agro", "Inteligência Artificial Agrícola Nexus", "Agrônomo Virtual"],
                "operatingSystem": "All",
                "applicationCategory": "BusinessApplication",
                "description": "Terminal tático de inteligência artificial para o agronegócio. Diagnóstico de pragas por visão computacional, sincronia climática e funcionamento offline completo.",
                "keywords": "agronegócio, agricultura, criação, campo, cultura, cultivo, agronomo, IA, Inteligência artificial, fazenda, lavoura, pragas, safra, terra, gado, veterinário, telemetria, soja, milho, colheita, manejo",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/inova-moda",
                "name": "Inova Moda 360",
                "alternateName": ["Provador Virtual 3D", "Inova Moda", "Fitting Room IA"],
                "operatingSystem": "All",
                "applicationCategory": "BusinessApplication",
                "description": "Provador virtual 3D avançado movido por IA Soberana. Mapeia biometria corporal via mesh 3D de vídeo para recomendações exatas de tamanho e caimento.",
                "keywords": "provador, provar roupas, provação de roupas, provador virtual, provador 3D, IA, Inteligência artificial, moda, e-commerce, inova, inovar, inovação, inovadora, caimento 3D, biometria, tamanho de roupa",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/vitrine-inovadora",
                "name": "Vitrine Inovadora",
                "alternateName": ["Vitrine Inteligente", "Vitrine Phygital"],
                "operatingSystem": "All",
                "applicationCategory": "BusinessApplication",
                "description": "Sinalização digital interativa inteligente de alto padrão que conecta vitrines físicas a canais automáticos de atendimento via WhatsApp.",
                "keywords": "vitrine, vitrine inovadora, inova, inovar, inovação, inovadora, WhatsApp, comércio, varejo, loja física, sinalização digital, IA, Inteligência artificial",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/inova-revenda",
                "name": "Inova Revenda",
                "alternateName": ["Plataforma Automotiva Inteligente", "Inova Veículos", "Concessionária de Carros IA", "Simulador Automotivo Nexus"],
                "operatingSystem": "All",
                "applicationCategory": "BusinessApplication",
                "description": "Concessionária e vitrine digital de veículos inteligente com simulador de parcelas e análise de score de crédito em tempo real.",
                "keywords": "inova, inovar, inovação, inovadora, carros, concessionária, simulador de crédito, financiamento, veículos, score de crédito, IA, Inteligência artificial, carros seminovos, aprovação de crédito, venda de veículos, taxas de juros, parcelamento de veículos",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/nexus-estudio",
                "name": "Nexus Estúdio",
                "alternateName": ["Locutor Virtual Neuronal", "Rádio Inteligente", "Nexus Voice Studio", "Sintetizador de Voz Profissional"],
                "operatingSystem": "All",
                "applicationCategory": "MultimediaApplication",
                "description": "Sistema inteligente de automação de rádio e áudio com locutor virtual baseado em vozes neurais profissionais de alta definição.",
                "keywords": "áudio, rádio, locutor virtual, vozes neurais, inteligência artificial, automação de áudio, estúdio, podcast, sintetizador de voz, rádio corporativa, vinhetas automáticas, locução natural, voz de IA, TTS, text to speech, gerador de voz humana",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/nexus-empresas",
                "name": "Nexus Empresas",
                "alternateName": ["ERP IA Nexus", "Suíte Corporativa de Inteligência Artificial", "Nexus ERP Inteligente", "Gestão Empresarial On-Premise"],
                "operatingSystem": "Linux/Docker/Windows",
                "applicationCategory": "BusinessApplication",
                "description": "Suíte empresarial com 11 módulos de IA On-Premise para otimização de vendas, compras, PPCP, auditoria, cronoanálise, almoxarifado, expedição e RH.",
                "keywords": "empresas, ERP, vendas, compras, PPCP, auditoria, cronoanálise, almoxarifado, expedição, RH, inteligência artificial, gestão empresarial, fábrica, indústria, manufatura, otimização de estoque, controle de produção, produtividade, eficiência operacional, automação industrial",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/maga-dot",
                "name": "Maga Dot",
                "alternateName": ["Atena IA", "Maga.Dot", "IA de Diretoria", "Consciência Operacional"],
                "operatingSystem": "All",
                "applicationCategory": "BusinessApplication",
                "description": "IA com consciência operacional de elite, treinada com DNA corporativo sob demanda, atuando como conselheira executiva em Cloud privada ou On-Premise.",
                "keywords": "Atena, Maga Dot, diretoria, decisão executiva, IA de conselho, inteligência artificial corporativa, negócios, tomada de decisão, cloud privada",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/orion",
                "name": "Orion",
                "alternateName": ["Nexus Orion", "Orion OS", "Simulador Big Data"],
                "operatingSystem": "All",
                "applicationCategory": "BusinessApplication",
                "description": "Arquiteto matemático e simulador de cenários Big Data para tomadas de decisões baseadas em dados e probabilidades limpas de viés emocional.",
                "keywords": "Orion, Big Data, simulador matemático, probabilidades, tomada de decisão, análise de dados, estatística, IA, Inteligência artificial",
                "publisher": {
                  "@id": "https://nexus.aws/orion"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/pactum",
                "name": "Nexus Pactum",
                "alternateName": ["Pactum Negociações", "Auditor de Contratos IA"],
                "operatingSystem": "All",
                "applicationCategory": "BusinessApplication",
                "description": "Ferramenta tática de negociação empresarial. Realiza auditoria rápida de contratos e analisa microexpressões em reuniões em tempo real.",
                "keywords": "Pactum, negociação, contratos, auditoria contratual, microexpressões, reuniões, inteligência artificial, mediação",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/egide",
                "name": "Nexus Égide",
                "alternateName": ["Égide Segurança", "Blindagem Predial Inteligente"],
                "operatingSystem": "All",
                "applicationCategory": "SecurityApplication",
                "description": "Cerco tático e blindagem patrimonial com IA preditiva de segurança, leitura de placas e monitoramento tático de complexos industriais.",
                "keywords": "Égide, segurança patrimonial, monitoramento, câmeras, leitura de placas, LPR, inteligência artificial, blindagem",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/nexus-health",
                "name": "Nexus Health",
                "alternateName": ["Diagnóstico Médico IA", "Nexus Saúde"],
                "operatingSystem": "All",
                "applicationCategory": "MedicalApplication",
                "description": "IA diagnóstica por imagem médica com 94.7% de acurácia em exames de tomografia, mamografia, raio-x e ressonância magnética.",
                "keywords": "saúde, exame, precoce, antecipar resultados, diagnóstico, diagnóstico médico, imagem médica, tomografia, ressonância, mamografia, raio-x, IA, Inteligência artificial",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://nexus.aws/nexus-rotas",
                "name": "Nexus Rotas",
                "alternateName": ["Guia Turístico Inteligente", "Roteador Turístico Nexus", "Nexus Rotas e Destinos", "Embaixador Virtual de Turismo"],
                "operatingSystem": "All",
                "applicationCategory": "TravelApplication",
                "description": "Plataforma inteligente de roteirização turística, gastronômica e hoteleira. Conecta viajantes a rotas de experiências personalizadas e embaixadores digitais locais.",
                "keywords": "turismo, rotas, roteiro de viagem, gastronomia, hotéis, hospedagem, embaixadora virtual, viagens, turismo inteligente, destinos, guia turístico, atrações, lazer, passagens, roteiro personalizado, IA, Inteligência artificial",
                "publisher": {
                  "@id": "https://nexustreinamento.com/#organization"
                }
              }
            ]
          }
        `}
      </Script>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased overflow-x-hidden',
          fontSans.variable,
          fontHeadline.variable
        )}
      >
        {/* Hidden Google Translate Engine */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        {/* Custom Luxury Language Switcher */}
        <LanguageSwitcher />
        <AwsRumAnalytics />
        <GoogleAnalytics />
        <ClientProviders>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <NexusAvatarChat />
        </ClientProviders>
        
        <Script id="google-translate-script" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'pt',
                includedLanguages: 'en,es,fr,de,zh-CN,ar,ja,ru',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
