// Nexus Build Trigger: 2026-04-11T17:13
import './globals.css';
import { cn } from '@/lib/utils';
import { Poppins, PT_Sans } from 'next/font/google';
import { ClientProviders } from '@/components/providers/client-providers';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { NexusAvatarChat } from '@/components/nexus-avatar-chat';
import Script from 'next/script';
import { Metadata } from 'next';
import GoogleAnalytics from '@/components/analytics/google-analytics';

export const metadata: Metadata = {
  title: 'Nexus Inteligência | A Nova Era da Tecnologia & IA',
  description: 'Plataforma de cursos online, mentoria de IA e inteligência estratégica para acelerar sua carreira e negócios. Domine o futuro com a Nexus.',
  keywords: 'inteligência artificial, cursos online, mentoria, dante safra, djeny rh, nexus, tecnologia advanced',
  openGraph: {
    title: 'Nexus Inteligência | A Nova Era da Tecnologia & IA',
    description: 'Transforme sua carreira com mentoria de IA e tecnologia de ponta.',
    url: 'https://nexus-site-novo.vercel.app',
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
    title: 'Nexus Inteligência | IA & Estratégia',
    description: 'Acelere sua carreira com a inteligência da Nexus.',
    images: ['/nexus-hero-hologram.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0A0A0B',
  alternates: {
    canonical: 'https://nexus-site-novo.vercel.app',
    languages: {
      'pt-BR': 'https://nexus-site-novo.vercel.app',
      'en-US': 'https://nexus-site-novo.vercel.app/en',
      'es-ES': 'https://nexus-site-novo.vercel.app/es',
      'fr-FR': 'https://nexus-site-novo.vercel.app/fr',
      'de-DE': 'https://nexus-site-novo.vercel.app/de',
      'ja-JP': 'https://nexus-site-novo.vercel.app/ja',
      'ru-RU': 'https://nexus-site-novo.vercel.app/ru',
      'zh-CN': 'https://nexus-site-novo.vercel.app/zh',
      'ar-AE': 'https://nexus-site-novo.vercel.app/ar',
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
        src="https://www.googletagmanager.com/gtag/js?id=G-CS0X8XB173"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-CS0X8XB173');
        `}
      </Script>
      <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
        {`
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Nexus Inteligência",
            "url": "https://nexus-site-novo.vercel.app",
            "logo": "https://nexus-site-novo.vercel.app/nexus-hero-hologram.png",
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
        <GoogleAnalytics />
        <ClientProviders>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <NexusAvatarChat />
        </ClientProviders>
      </body>
    </html>
  );
}
