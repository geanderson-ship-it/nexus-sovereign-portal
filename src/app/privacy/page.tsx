
'use client';

import { useLocale } from '@/hooks/use-locale';

export default function PrivacyPage() {
  const { t } = useLocale();

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="prose prose-invert max-w-none text-foreground">
        <h1 className="text-primary">{t('privacy.title')}</h1>
        <p>{t('privacy.lastUpdated')}</p>
        <p>{t('privacy.p1')}</p>
        <p>{t('privacy.p2')}</p>

        <h2>{t('privacy.section1.title')}</h2>
        <p>{t('privacy.section1.p1')}</p>
        <ul>
          <li>{t('privacy.section1.item1')}</li>
          <li>{t('privacy.section1.item2')}</li>
          <li>{t('privacy.section1.item3')}</li>
        </ul>
        <p>{t('privacy.section1.p2')}</p>

        <h2>{t('privacy.section2.title')}</h2>
        <p>{t('privacy.section2.p1')}</p>

        <h2>{t('privacy.section3.title')}</h2>
        <p>{t('privacy.section3.p1')}</p>

        <h2>{t('privacy.section4.title')}</h2>
        <p>{t('privacy.section4.p1')}</p>

        <h2>{t('privacy.section5.title')}</h2>
        <p>{t('privacy.section5.p1')}</p>

        <h2>{t('privacy.section6.title')}</h2>
        <p>{t('privacy.section6.p1')}</p>

        <h2>{t('privacy.section7.title')}</h2>
        <p>{t('privacy.section7.p1')}</p>

        <h2>{t('privacy.section8.title')}</h2>
        <p>{t('privacy.section8.p1')}</p>
      </div>
    </div>
  );
}
