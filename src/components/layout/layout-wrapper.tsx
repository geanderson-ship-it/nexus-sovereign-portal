'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { FloatingSupport } from '@/components/ui/floating-support';
import { ExitIntentPopup } from '@/components/ui/exit-intent-popup';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define as rotas que NÃO devem ter Header e Footer (PWA / Standalone Apps / Live Modes)
  const isStandalone = pathname?.startsWith('/app/') || 
                       pathname?.startsWith('/standalone/') || 
                       pathname?.startsWith('/dante-safra') ||
                       pathname?.startsWith('/djeny-design') ||
                       pathname?.includes('-live') ||
                       pathname?.includes('_live') ||
                       pathname?.startsWith('/gabinete/recrutamento');

  if (isStandalone) {
    return (
      <main className="flex-1 overflow-hidden relative">
        {children}
        <FloatingSupport />
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingSupport />
    </div>
  );
}
