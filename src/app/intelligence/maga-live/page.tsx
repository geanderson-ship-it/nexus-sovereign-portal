'use client';

export const dynamic = 'force-dynamic';

import { MagaLiveMode } from '@/components/maga/maga-live-mode';

export default function MagaLivePage() {
  return (
    <main className="min-h-screen bg-black">
      <MagaLiveMode />
    </main>
  );
}
