'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isPermissionError = false;
  const errorMessage = error?.message || 'An unexpected error occurred.';

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] text-slate-100 p-4">
          <div className="mb-8">
             <Link href="/">
                <Logo width={300} height={101} />
            </Link>
          </div>
          <div className="max-w-2xl rounded-lg border border-slate-800 bg-slate-950 p-8 text-center text-slate-200 shadow-lg">
            <h1 className="text-3xl font-bold text-red-500">
              Ocorreu um erro inesperado / Unexpected Error
            </h1>
            <p className="mt-4 text-base text-slate-400">
              Algo deu errado na inicialização ou conexão da página. Por favor, tente recarregar ou volte para a página inicial.
            </p>
            <p className="mt-2 text-sm text-slate-500 font-mono bg-black/40 p-3 rounded border border-slate-900 text-left max-h-40 overflow-auto">
              Error details: {errorMessage}
            </p>
            <div className="mt-8 flex gap-4 justify-center">
                <Button
                  onClick={() => reset()}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Tentar Novamente / Retry
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-slate-800 hover:bg-slate-900 text-slate-300"
                >
                    <Link href="/">Página Inicial / Home</Link>
                </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

    
