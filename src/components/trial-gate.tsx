'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc, setDoc, DocumentReference } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { isAdminUser } from '@/lib/constants';
import { useLocale } from '@/hooks/use-locale';
import * as gtag from '@/lib/gtag';


interface Trial {
  moduleId: string;
  startTime: string; // ISO string
}

interface TrialGateProps {
  children: React.ReactNode;
  moduleId: 'dante-safra' | 'dante-compras' | 'djeny-design';
  moduleName: string;
  purchaseHref: string;
}

const CountdownTimer = ({ expiryTime }: { expiryTime: number }) => {
    const { t } = useLocale();
    const [timeLeft, setTimeLeft] = useState(expiryTime - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(expiryTime - Date.now());
        }, 1000);

        if (timeLeft <= 0) {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [expiryTime, timeLeft]);

    if (timeLeft <= 0) {
        return <span>{t('trialGate.countdownExpired')}</span>;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return <span>{`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>;
}


export function TrialGate({ children, moduleId, moduleName, purchaseHref }: TrialGateProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const { t } = useLocale();

  // Rastrear login/User ID se o usuário estiver logado
  useEffect(() => {
    if (user && typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('set', 'user_properties', {
            user_id: user.uid,
            email: user.email
        });
        (window as any).gtag('config', gtag.GA_TRACKING_ID, {
            'user_id': user.uid
        });
    }
  }, [user]);


  const isAdmin = useMemo(() => isAdminUser(user), [user]);

  const trialDocRef = useMemoFirebase(() => {
    // Apenas crie a referência se o usuário não for um administrador, para evitar leituras desnecessárias no BD
    if (!user || !firestore || isAdmin) return null;
    return doc(firestore, 'users', user.uid, 'trials', moduleId) as DocumentReference<Trial>;
  }, [firestore, user, moduleId, isAdmin]);

  const { data: trial, isLoading: isTrialLoading } = useDoc<Trial>(trialDocRef);

  const handleStartTrial = async () => {
    if (!trialDocRef) return;
    setIsStartingTrial(true);

    // Rastrear início do trial
    gtag.event({
        action: 'trial_start',
        category: 'Lead',
        label: moduleName,
        value: moduleId === 'dante-safra' ? 100 : 50 // Valor simbólico para ROI
    });

    const newTrial: Trial = {
      moduleId: moduleId,
      startTime: new Date().toISOString(),
    };
    
    setDoc(trialDocRef, newTrial).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: trialDocRef.path,
          operation: 'create',
          requestResourceData: newTrial,
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        setIsStartingTrial(false);
    });
  };

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">{t('trialGate.loading')}</p>
      </div>
    );
  }

  // Esta é a mudança chave: verificar o status de administrador imediatamente após o carregamento do usuário
  if (isAdmin) {
    return <>{children}</>;
  }

  // Para não-administradores, prossiga com a lógica de avaliação
  if (isTrialLoading) {
    return (
     <div className="flex flex-col items-center justify-center text-center h-full py-20">
       <Loader2 className="h-12 w-12 animate-spin text-primary" />
       <p className="mt-4 text-lg text-muted-foreground">{t('trialGate.loading')}</p>
     </div>
   );
 }

  if (!trial) {
    return (
        <div className="flex items-center justify-center h-full py-20">
            <Card className="max-w-md w-full bg-gray-900/50 border-primary/50">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline text-primary">{t('trialGate.startTitle', { time: moduleId === 'dante-safra' ? '1 hora' : '24 horas' })}</CardTitle>
                    <CardDescription>{t('trialGate.startDescription', { moduleName, time: moduleId === 'dante-safra' ? '1 hora' : '24 horas' })}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-center text-muted-foreground">
                        {t('trialGate.startInfo', { time: moduleId === 'dante-safra' ? '1 hora' : '24 horas' })}
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleStartTrial} disabled={isStartingTrial} className="w-full h-12 font-bold bg-primary hover:bg-primary/90 btn-glow-pulse shimmer">
                        {isStartingTrial ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isStartingTrial ? t('trialGate.startingButton') : t('trialGate.startButton')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }
  
  const trialTimeLabel = moduleId === 'dante-safra' ? '1 hora' : '24 horas';
  
  const trialStartTime = new Date(trial.startTime).getTime();
  const duration = moduleId === 'dante-safra' ? 1 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const trialExpiryTime = trialStartTime + duration;
  
  const isTrialExpired = Date.now() > trialExpiryTime;

  // Rastrear visualização de expiração (Momento de compra)
  useEffect(() => {
    if (isTrialExpired) {
        gtag.event({
            action: 'trial_expired_view',
            category: 'Sales',
            label: moduleName
        });
    }
  }, [isTrialExpired, moduleName]);

  if (isTrialExpired) {
    return (
        <div className="flex items-center justify-center h-full py-20">
             <Card className="max-w-md w-full bg-destructive/10 border-destructive/50">
                <CardHeader className="text-center">
                    <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
                    <CardTitle className="text-2xl font-headline text-destructive mt-4">{t('trialGate.expiredTitle')}</CardTitle>
                    <CardDescription className="text-destructive/80">{t('trialGate.expiredDescription', { moduleName, time: trialTimeLabel })}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-center text-muted-foreground">
                       {t('trialGate.expiredInfo')}
                    </p>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button asChild className="w-full h-14 text-lg font-black bg-primary text-primary-foreground hover:bg-primary/90 btn-glow-pulse shimmer uppercase" onClick={() => {
                        gtag.event({
                            action: 'trial_purchase_intent',
                            category: 'Sales',
                            label: moduleName
                        });
                    }}>
                        <Link href={purchaseHref}>
                             <Lock className="mr-2 h-5 w-5" />
                            LIBERAR ACESSO VITALÍCIO AGORA
                        </Link>
                    </Button>
                     <Button asChild variant="link" className="text-primary">
                        <Link href="/intelligence">
                            {t('trialGate.expiredBackButton')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  // A avaliação está ativa
  return (
    <>
        <div className="fixed top-20 right-8 z-50 bg-background/80 backdrop-blur-sm border border-primary/50 rounded-lg px-3 py-2 text-sm shadow-lg">
            <span className="text-muted-foreground">{t('trialGate.countdownLabel')}</span>
            <span className="font-bold font-mono text-primary"><CountdownTimer expiryTime={trialExpiryTime} /></span>
        </div>
        {children}
    </>
  );
}
