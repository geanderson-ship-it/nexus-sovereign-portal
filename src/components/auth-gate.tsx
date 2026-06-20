
'use client';

import { useLocale } from '@/hooks/use-locale';
import { useAccessLevel } from '@/hooks/use-access-level';
import { UserLevel } from '@/lib/constants';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import { signOut } from 'aws-amplify/auth';
import React from 'react';

const LoadingScreen = ({ message }: { message: string }) => {
    const { t } = useLocale();

    const handleReset = async () => {
        console.log("Iniciando protocolo de reset forçado...");
        try {
            await signOut();
            console.log("Sessão da AWS encerrada com sucesso.");
        } catch (e) {
            console.error("Falha ao executar signOut durante o reset. Prosseguindo com a limpeza forçada:", e);
        }

        try {
            window.localStorage.clear();
            window.sessionStorage.clear();
            console.log("Armazenamento local e de sessão limpos.");
        } catch (e) {
            console.error("Não foi possível limpar o armazenamento do navegador:", e);
        } finally {
            console.log("Redirecionando para a tela de login...");
            // Force a hard navigation to break any React state loops
            window.location.href = '/login';
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-semibold text-muted-foreground">{message}</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                    {t('authGate.resetPrompt')}
                </p>
                <Button variant="destructive" onClick={handleReset} className="mt-4">
                    {t('authGate.resetButton')}
                </Button>
            </div>
        </div>
    );
};


const AccessDeniedScreen = () => {
    const router = useRouter();
    const { t } = useLocale();
    
    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center max-w-md p-4">
            <ShieldAlert className="h-16 w-16 text-destructive" />
            <h1 className="text-2xl font-bold text-destructive-foreground">{t('authGate.deniedTitle')}</h1>
            <p className="text-lg text-muted-foreground">
                {t('authGate.deniedMessage')}
            </p>
            <p className="text-sm text-muted-foreground animate-pulse">{t('authGate.deniedRedirect')}</p>
             <Button variant="outline" asChild>
                <Link href="/login">{t('authGate.goToLogin')}</Link>
            </Button>
            </div>
        </div>
    );
};

interface AuthGateProps {
    children: React.ReactNode;
    adminOnly?: boolean; // deprecated, use requiredLevel
    requiredLevel?: UserLevel;
}

export default function AuthGate({ children, adminOnly = false, requiredLevel }: AuthGateProps) {
  const { user, isSalesAuth, isLoading, hasAdminAccess, hasSalesAccess } = useAccessLevel();
  const { t } = useLocale();

  if (isLoading) {
    return <LoadingScreen message={t('authGate.loading')} />;
  }

  // Se não tem user do Cognito e não tem localStorage de vendas, tá fora.
  if (!user && !isSalesAuth) {
    return <AccessDeniedScreen />;
  }

  // Retro-compatibilidade com adminOnly
  if (adminOnly && !hasAdminAccess) {
    return <AccessDeniedScreen />;
  }

  if (requiredLevel === 'ADMIN' && !hasAdminAccess) {
    return <AccessDeniedScreen />;
  }

  if (requiredLevel === 'SALES' && !hasSalesAccess) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
    
