'use client';

import { ArrowLeft, Cpu } from 'lucide-react';
import Link from 'next/link';
import DanteBuilderChat from '@/components/dante-builder-chat';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

export default function DanteBuilderPage() {
  return (
    <SovereignShowcase moduleName="Projetos" imagePath="/Nexus Empresas/Dante Builder.png">
      <div className="space-y-8 text-left text-white">
        <div className="flex items-center gap-4 mb-8 border-b border-cyan-500/10 pb-6">
          <Link href="/nexus-empresas">
            <div className="p-2 rounded-full hover:bg-cyan-500/10 transition-colors cursor-pointer">
              <ArrowLeft className="h-5 w-5 text-cyan-400" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-cyan-400 font-headline uppercase italic flex items-center gap-2">
              <Cpu className="h-6 w-6" /> Terminal Projetos
            </h1>
            <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-1">
              Engenharia Universal de Produtos Industriais.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <DanteBuilderChat />
          <div className="w-full max-w-4xl mt-12">
            <LegalSafeguard module="PROJETOS" protocol="NX-PROJ-01" />
          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
