
'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DanteSafraChat from '@/components/dante-safra-chat';
import { TrialGate } from '@/components/trial-gate';
import { useLocale } from '@/hooks/use-locale';

function TrialContent() {
  const { t } = useLocale();
  return (
    <div className="flex-1 flex flex-col text-white">
      <div className="flex items-center gap-4 mb-4 pt-8">
        <Link href="/intelligence/dante-safra/access">
          <ArrowLeft className="h-6 w-6 hover:text-emerald-400 transition-colors" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-emerald-300 font-headline">
            {t('intelligence.dante-safra.trial.title')}
          </h1>
          <p className="text-lg text-gray-400">
            {t('intelligence.dante-safra.trial.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <DanteSafraChat />
      </div>
    </div>
  );
}

export default function DanteSafraTrialPage() {
    return (
        <TrialGate
            moduleId="dante-safra"
            moduleName="Dante Safra"
            purchaseHref="/intelligence/dante-safra/access"
        >
            <TrialContent />
        </TrialGate>
    );
}
