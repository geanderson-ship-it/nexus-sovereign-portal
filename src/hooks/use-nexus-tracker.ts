'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useNexusTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        event: 'page_view',
        device,
      }),
    }).catch(() => {});
  }, [pathname]);
}
