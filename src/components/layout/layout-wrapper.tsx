'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { FloatingSupport } from '@/components/ui/floating-support';
import { ExitIntentPopup } from '@/components/ui/exit-intent-popup';
import { useNexusTracker } from '@/hooks/use-nexus-tracker';
import { useUser } from '@/auth';
import { useNickname } from '@/hooks/use-nickname';
import { NicknameModal } from '@/components/nickname-modal';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useNexusTracker();
  const { user } = useUser();
  const { hasAsked, saveNickname } = useNickname(user?.email);

  // Define as rotas que NÃO devem ter Header e Footer (PWA / Standalone Apps / Live Modes)
  const isStandalone = pathname?.startsWith('/app/') || 
                       pathname?.startsWith('/standalone/') || 
                       pathname?.startsWith('/vitrine-inovadora') ||
                       pathname?.startsWith('/inovamoda') ||
                       pathname?.startsWith('/dante-safra') ||
                       pathname?.startsWith('/djeny-design') ||
                       pathname?.startsWith('/atena') ||
                       pathname?.startsWith('/gabinete/atena') ||
                       pathname?.includes('-live') ||
                       pathname?.includes('_live') ||
                       pathname?.startsWith('/gabinete/recrutamento');

  if (isStandalone) {
    return (
      <main className="flex-1 overflow-hidden relative">
        {children}
        {!pathname?.startsWith('/atena') && !pathname?.startsWith('/intelligence/global') && <FloatingSupport />}
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 pt-32">{children}</main>
      <SiteFooter />
      {!pathname?.startsWith('/atena') && !pathname?.startsWith('/intelligence/global') && <FloatingSupport />}
      {user && !hasAsked && (
        <NicknameModal
          open={true}
          defaultName={user.displayName || user.email}
          onSave={saveNickname}
        />
      )}
    </div>
  );
}
