'use client';

import React from 'react';
import { useLocale } from '@/hooks/use-locale';
import { StudioNexusPro } from '@/components/gabinete/studio-nexus-pro';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

export default function StudioGabinetePage() {
  const { t } = useLocale();

  return (
    <SovereignShowcase moduleName="Nexus Studio" imagePath="/Nexus Intelligence Studio/Nexus studio chumbo.png">
      <div className="min-h-screen bg-[#080b10] text-[#f0f6fc] font-sans selection:bg-blue-500/30">
        <StudioNexusPro />
      </div>
    </SovereignShowcase>
  );
}
