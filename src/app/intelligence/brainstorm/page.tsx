
'use client';

import React from 'react';
import { NexusCollabModule } from '@/components/maga/nexus-brainstorm-module';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

export default function BrainstormPage() {
  return (
    <main className="min-h-screen bg-black">
      <NexusCollabModule />
      <div className="max-w-7xl mx-auto px-6 pb-24 mt-12">
        <LegalSafeguard module="NEXUS BRAINSTORM" protocol="NX-BRNST-01" />
      </div>
    </main>
  );
}
