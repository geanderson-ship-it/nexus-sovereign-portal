'use client';

export const dynamic = 'force-dynamic';

import { NexusDuoMode } from '@/components/maga/nexus-duo-mode';

export default function NexusDuoPage() {
  return (
    <main className="min-h-screen bg-black">
      <NexusDuoMode />
    </main>
  );
}
