'use client';

import React, { useMemo } from 'react';
import { useUser } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { isAdminUser } from '@/lib/constants';
import { useLocale } from '@/hooks/use-locale';

interface TrialGateProps {
  children: React.ReactNode;
  moduleId: 'dante-safra' | 'dante-compras' | 'djeny-design';
  moduleName: string;
  purchaseHref: string;
}

export function TrialGate({ children, moduleId, moduleName, purchaseHref }: TrialGateProps) {
  const { user, isUserLoading } = useUser();
  const { t } = useLocale();

  const isAdmin = useMemo(() => isAdminUser(user), [user]);

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">{t('trialGate.loading') || 'Carregando...'}</p>
      </div>
    );
  }

  // Se for o administrador (Gean), libera acesso completo
  if (isAdmin) {
    return <>{children}</>;
  }

  // Para qualquer outro usuário, o acesso é restrito e exige aquisição imediata
  return (
    <div className="flex items-center justify-center h-full py-20 px-4">
      <Card className="max-w-md w-full bg-zinc-950/75 border border-primary/25 backdrop-blur-xl shadow-2xl p-6 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_40px_rgba(245,158,11,0.15)] mb-4">
            <Lock className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-widest text-white font-headline">
            Acesso Restrito
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2 font-medium">
            O aplicativo <span className="text-primary font-bold">{moduleName}</span> está bloqueado.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-sm text-center text-slate-400 leading-relaxed font-sans">
            Esta é uma ferramenta de inteligência artificial de elite restrita a clientes licenciados da Nexus. Para liberar o seu acesso vitalício e de sua equipe, entre em contato diretamente com a nossa Diretoria Comercial para realizar a aquisição.
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button asChild className="w-full h-14 text-sm font-black bg-primary text-primary-foreground hover:bg-primary/95 btn-glow-pulse shimmer uppercase rounded-2xl">
            <Link href="/contact?subject=aquisicao-modulo">
              Falar com a Diretoria Comercial
            </Link>
          </Button>
          <Button asChild variant="link" className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest font-sans">
            <Link href="/intelligence">
              Voltar ao Centro de Inteligência
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
