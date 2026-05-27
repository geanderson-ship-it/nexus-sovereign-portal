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
    <div className="min-h-screen relative text-slate-200 py-12 px-4 bg-slate-950 overflow-hidden">
      {/* Background Image with cybernetic glow */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-30 pointer-events-none" 
        style={{ backgroundImage: "url('/nexus-agenda-bg.png')" }} 
      />
      {/* Radial Gradient for smooth edge fade */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.95)_100%)] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px] z-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/gabinete" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-8 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 hover:border-slate-700/80">
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
