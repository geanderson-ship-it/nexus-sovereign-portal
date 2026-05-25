'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Search, Lock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function GabinetePage() {
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
    <div className="min-h-screen bg-[#020617] text-slate-200 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12 border-b border-slate-800 pb-8">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline text-white">Gabinete Nexus</h1>
            <p className="text-slate-400">Área de Controle e Inteligência Estratégica (Nível Diretoria)</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Prospector IBGE */}
          <Link href="/gabinete/prospector">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-primary/50 transition-colors cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">Prospector IBGE</CardTitle>
                <CardDescription>Mapeamento de Cidades do Futuro</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Integração direta com o banco de dados do IBGE para mapear municípios-alvo com base em filtros geográficos e indicadores sociais.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500">
                  Acessar Ferramenta <MapPin className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          {/* Espaço para futuras ferramentas do Gabinete */}
          <Link href="/gabinete/agenda">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">Agenda Estratégica</CardTitle>
                <CardDescription>Painel de Controle de Reuniões</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Organize suas visitas, gerencie os anfitriões e defina a estratégia de ataque (Assunto e Observações) para cada prefeitura.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-500">
                  Acessar Ferramenta <MapPin className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
