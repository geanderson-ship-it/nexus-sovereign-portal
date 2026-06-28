'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, Lock, MapPin, Building2, UploadCloud, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CasesDeSucessoPage() {
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
        <Lock className="w-12 h-12 mb-4 animate-pulse text-primary/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Verificando Credenciais</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-4 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER DA PÁGINA */}
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <Link href="/gabinete">
            <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Gabinete Diretoria</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-white">Cases de Sucesso</h1>
            <p className="text-white/60 mt-2 max-w-2xl">
              Portal de acompanhamento das cidades com o projeto Embaixadora ativo. 
              Futuramente, os registros e imagens destas regiões estarão disponíveis aqui.
            </p>
          </div>
        </div>

        {/* ÁREA DE CONTEÚDO VAZIA (PLACEHOLDER) */}
        <div className="flex flex-col items-center justify-center text-center p-12 md:p-24 border border-dashed border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
            <MapPin className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Nenhum Case Registrado</h2>
          <p className="text-white/50 max-w-md mb-8">
            As imagens e os relatórios de implementação nas cidades em que o sistema de Embaixadoras estiver rodando aparecerão nesta tela.
          </p>
          
          <Button disabled className="bg-emerald-600/50 text-white cursor-not-allowed">
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload de Case (Em breve)
          </Button>
        </div>

        {/* EXEMPLOS (MOCK DE FUTURO) */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-white/80 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            Mural Previsto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 pointer-events-none grayscale">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-black/40 border-white/5 overflow-hidden">
                <div className="h-48 bg-white/5 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white/20" />
                </div>
                <CardContent className="p-4">
                  <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-white/5 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
