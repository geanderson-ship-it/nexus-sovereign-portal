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
      className="dark"
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
            "@type": "EducationalOrganization",
            "name": "Nexus Inteligência",
            "url": "https://nexustreinamento.com",
            "logo": "https://nexustreinamento.com/nexus-hero-hologram.png",
            "description": "Plataforma avançada de cursos online, mentoria de IA e inteligência estratégica para acelerar sua carreira e negócios.",
            "brand": "Nexus",
            "keywords": "IA, Inteligência Artificial, Mentoria, Gestão, Liderança"
          }
        `}
      </Script>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeadline.variable
        )}
      >
        <div className="fixed bottom-4 left-4 z-[9999] pointer-events-auto flex items-center justify-center">
           <div id="google_translate_element"></div>
        </div>
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
