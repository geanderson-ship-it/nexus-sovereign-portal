'use client';

import { NexusDuoLive } from '@/components/maga/nexus-duo-live';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

export default function DuoLivePage() {
  return (
    <main className="min-h-screen bg-black">
      <NexusDuoLive />
      <div className="max-w-7xl mx-auto px-6 pb-24 mt-12">
        <LegalSafeguard module="NEXUS DUO LIVE" protocol="NX-DUO-01" />
      </div>
    </main>
  );
}
