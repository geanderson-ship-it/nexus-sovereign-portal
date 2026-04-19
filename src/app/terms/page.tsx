
'use client';

import { useLocale } from '@/hooks/use-locale';

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="prose prose-invert max-w-none text-foreground">
        <h1 className="text-primary">{t('terms.title')}</h1>
        <p>{t('terms.lastUpdated')}</p>
        <p>{t('terms.p1')}</p>

        <h2>{t('terms.section1.title')}</h2>
        <p>{t('terms.section1.p1')}</p>

        <h2>{t('terms.section2.title')}</h2>
        <p>{t('terms.section2.p1')}</p>

        <h2>{t('terms.section3.title')}</h2>
        <p>{t('terms.section3.p1')}</p>

        <h2>{t('terms.section4.title')}</h2>
        <p>{t('terms.section4.p1')}</p>

        <h2>{t('terms.section5.title')}</h2>
        <p>{t('terms.section5.p1')}</p>

        <h2>{t('terms.section6.title')}</h2>
        <p>{t('terms.section6.p1')}</p>

        <h2>{t('terms.section7.title')}</h2>
        <p>{t('terms.section7.p1')}</p>

        <h2>{t('terms.section8.title')}</h2>
        <p>{t('terms.section8.p1')}</p>
      </div>
    </div>
  );
}
