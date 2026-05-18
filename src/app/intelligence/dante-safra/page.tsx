'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DanteSafraChat from '@/components/dante-safra-chat';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

export default function DanteSafraPage() {
  return (
    <SovereignShowcase moduleName="Dante Safra" imagePath="/Nexus Empresas/Dante safra axis.png">
      <div className="min-h-screen bg-[#020617] text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-emerald-800/30">
          <Link href="/intelligence/agronegocio" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 hover:text-emerald-400 transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-emerald-300 font-headline">
              Terminal Dante Safra
            </h1>
            <p className="text-lg text-gray-400">
              Inteligência de precisão para o agronegócio.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <DanteSafraChat />
          <div className="w-full max-w-4xl mt-12">
            <LegalSafeguard module="DANTE SAFRA" protocol="NX-SAFRA-01" />
          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
