'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AgendaEstrategica } from '@/components/gabinete/agenda-estrategica';

export default function AgendaPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase animate-pulse">Carregando Módulo da Agenda</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/gabinete" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o Gabinete
        </Link>
        
        <div className="flex items-center gap-3 mb-10">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Sistema Exclusivo Diretoria</span>
        </div>

        <AgendaEstrategica />
      </div>
    </div>
  );
}
