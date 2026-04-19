'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { FirestorePermissionError } from '@/firebase/errors';
import Link from 'next/link';
import { useLocale } from '@/hooks/use-locale';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();
  const isPermissionError = error instanceof FirestorePermissionError || (error.name === 'FirebaseError' && (error.message.includes('permission-denied') || error.message.includes('permission denied') || error.message.includes('insufficient permissions')));
  
  const errorMessage = error?.message || 'An unexpected error occurred.';

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
          <div className="mb-8">
             <Link href="/">
                <Logo width={300} height={101} />
            </Link>
          </div>
          <div className="max-w-2xl rounded-lg border bg-card p-8 text-center text-card-foreground shadow-lg">
            <h1 className="text-3xl font-bold text-destructive">
              {isPermissionError ? t('globalError.deniedTitle') : t('globalError.errorTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {isPermissionError
                ? t('globalError.deniedMessage')
                : t('globalError.errorMessage')}
            </p>
            {isPermissionError && process.env.NODE_ENV === 'development' && (
                 <div className="mt-4 rounded bg-destructive/10 p-4 text-left text-xs text-destructive-foreground opacity-70">
                    <p className="font-mono">{errorMessage}</p>
                 </div>
            )}
            <div className="mt-8 flex gap-4 justify-center">
                <Button
                onClick={() => reset()}
                size="lg"
                >
                {t('globalError.retry')}
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="lg"
                >
                    <Link href="/">{t('globalError.goHome')}</Link>
                </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

    
