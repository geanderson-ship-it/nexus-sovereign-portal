
'use client';

import React from 'react';
import { MagaOSModule } from '@/components/maga/maga-os-module';
import { useLocale } from '@/hooks/use-locale';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function MagaOSPage() {
    const { t } = useLocale();

    return (
        <div className="min-h-screen bg-background py-16 px-4 md:py-24 relative overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
                <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-600/20 to-indigo-900/20 blur-3xl"
                    style={{
                    clipPath:
                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                    <Link 
                        href="/intelligence" 
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors uppercase font-mono text-[10px] tracking-widest bg-white/5 px-3 py-1 rounded w-fit"
                    >
                        <ChevronLeft className="h-3 w-3" /> Voltar à Portfólio
                    </Link>
                    <div className="text-left md:text-right">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline text-white [text-shadow:0_0_30px_rgba(59,130,246,0.3)]">
                            {t('intelligence.magaOs.title')}
                        </h1>
                        <p className="text-blue-400/80 font-mono text-[10px] mt-2 uppercase tracking-widest font-bold">
                            {t('intelligence.magaOs.subtitle')}
                        </p>
                    </div>
                </div>

                <MagaOSModule />
            </div>
            
            <footer className="mt-20 py-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    Nexus System Intelligence // Protocolo Maga OS // Todos os direitos reservados
                </p>
            </footer>
        </div>
    );
}
