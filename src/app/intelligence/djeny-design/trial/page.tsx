
'use client';

import { DjenyDesignModule } from '@/components/gabinete/djeny-design-module';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TrialGate } from '@/components/trial-gate';

function TrialContent() {
    return (
      <div className="flex flex-col h-full items-center justify-center text-white py-8">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/intelligence/djeny-design/access">
              <ArrowLeft className="h-6 w-6 hover:text-purple-400 transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-purple-400 font-headline">
                Estúdio Djeny Design (Teste).
              </h1>
              <p className="text-lg text-gray-400">
                Seu limite de 1 teste grátis.
              </p>
            </div>
          </div>
          <DjenyDesignModule />
        </div>
      </div>
    );
}

export default function DjenyDesignTrialPage() {
    return (
        <TrialGate
            moduleId="djeny-design"
            moduleName="Djeny Design"
            purchaseHref="/intelligence/djeny-design/access"
        >
            <TrialContent />
        </TrialGate>
    );
}
