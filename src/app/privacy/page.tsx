
'use client';

import { useLocale } from '@/hooks/use-locale';
import Image from 'next/image';

export default function PrivacyPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen text-white relative">
      
      {/* FIXED BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-global/universe_network_bg.png"
          alt="Nexus Privacy Background"
          fill
          priority
          className="object-cover opacity-[0.08]"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 container mx-auto py-12 md:py-20 px-4">
        <div className="prose prose-invert max-w-4xl mx-auto text-foreground bg-neutral-950/60 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl shadow-black/50">
          <h1 className="text-primary font-headline text-3xl md:text-4xl font-bold tracking-tight mb-4">{t('privacy.title')}</h1>
          <p className="text-sm text-neutral-400 italic mb-8">{t('privacy.lastUpdated')}</p>
          <p className="lead text-neutral-300 mb-8">{t('privacy.p1')}</p>
          <p className="text-neutral-300 mb-8 font-sans">{t('privacy.p2')}</p>

          <div className="space-y-8 text-neutral-300 font-sans">
            <div>
              <h2 className="text-xl font-bold text-primary font-headline mt-6 mb-3">{t('privacy.section1.title')}</h2>
              <p className="leading-relaxed mb-4">{t('privacy.section1.p1')}</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>{t('privacy.section1.item1')}</li>
                <li>{t('privacy.section1.item2')}</li>
                <li>{t('privacy.section1.item3')}</li>
              </ul>
              <p className="leading-relaxed">{t('privacy.section1.p2')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary font-headline mt-6 mb-3">{t('privacy.section2.title')}</h2>
              <p className="leading-relaxed">{t('privacy.section2.p1')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary font-headline mt-6 mb-3">{t('privacy.section3.title')}</h2>
              <p className="leading-relaxed">{t('privacy.section3.p1')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary font-headline mt-6 mb-3">{t('privacy.section4.title')}</h2>
              <p className="leading-relaxed">{t('privacy.section4.p1')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary font-headline mt-6 mb-3">{t('privacy.section5.title')}</h2>
              <p className="leading-relaxed">{t('privacy.section5.p1')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary font-headline mt-6 mb-3">{t('privacy.section6.title')}</h2>
              <p className="leading-relaxed">{t('privacy.section6.p1')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary font-headline mt-6 mb-3">{t('privacy.section7.title')}</h2>
              <p className="leading-relaxed">{t('privacy.section7.p1')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary font-headline mt-6 mb-3">{t('privacy.section8.title')}</h2>
              <p className="leading-relaxed">{t('privacy.section8.p1')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
