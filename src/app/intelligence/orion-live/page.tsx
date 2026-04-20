'use client';

export const dynamic = 'force-dynamic';

import { OrionLiveMode } from '@/components/maga/orion-live-mode';

export default function OrionLivePage() {
  return (
    <main className="min-h-screen bg-black">
      <OrionLiveMode />
    </main>
  );
}
