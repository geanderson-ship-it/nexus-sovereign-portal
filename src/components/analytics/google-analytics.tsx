'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as gtag from '@/lib/gtag';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();

  // Configura o ID do usuário logado no Google Analytics
  useEffect(() => {
    if (user && (window as any).gtag) {
      (window as any).gtag('config', gtag.GA_TRACKING_ID, {
        user_id: user.uid,
        user_properties: {
          user_role: isAdminUser(user) ? 'admin' : 'user'
        }
      });
      (window as any).gtag('config', gtag.GA_OLD_TRACKING_ID, {
        user_id: user.uid,
        user_properties: {
          user_role: isAdminUser(user) ? 'admin' : 'user'
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (pathname && searchParams && !isUserLoading) {
      // Ignora o rastreamento do Gabinete se o usuário não for administrador
      if (pathname.startsWith('/gabinete')) {
        if (!user || !isAdminUser(user)) {
          return;
        }
      }

      const url = pathname + searchParams.toString();
      gtag.pageview(url);
    }
  }, [pathname, searchParams, user, isUserLoading]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}
