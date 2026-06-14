'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Search, Lock, MapPin, Coins, Users, Calendar, Activity, Database } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function GabineteHubPage() {
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
      
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-prospector-bg.png"
          alt="Nexus Cabinet Background"
          fill
          priority
          className="object-cover opacity-35"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/70 to-[#020617]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-headline text-white">Command Center</h1>
              <p className="text-slate-400">Gabinete Estratégico da Diretoria Nexus</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">Acesso Nível 5 (Soberano)</span>
          </div>
        </div>

        {/* Módulos do Gabinete */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card Prospector IBGE */}
          <Link href="/gabinete/prospector">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-500/20">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors font-headline">Prospector IBGE</CardTitle>
                <CardDescription>Mapeamento de Cidades do Futuro</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Integração direta com o banco de dados do IBGE para mapear municípios-alvo com base em filtros geográficos e indicadores sociais.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                  Acessar Módulo <Search className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          {/* Agenda Estratégica */}
          <Link href="/gabinete/agenda">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors font-headline">Agenda Tática</CardTitle>
                <CardDescription>Painel de Controle de Reuniões</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Organize suas visitas, gerencie os anfitriões e defina a estratégia de ataque para cada prefeitura mapeada.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  Acessar Módulo <Calendar className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Central de Leads */}
          <Link href="/gabinete/leads">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-indigo-500/20">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-indigo-400 transition-colors font-headline">Contatos & Leads</CardTitle>
                <CardDescription>Gerenciador de Oportunidades</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Monitore em tempo real as pessoas que preencheram o formulário no portal da Nexus. Nunca perca um contato.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                  Gerenciar Oportunidades <Users className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Portfólio de Precificação */}
          <Link href="/gabinete/precificacao">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                  <Coins className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-amber-400 transition-colors font-headline">Tabela de Preços</CardTitle>
                <CardDescription>Catálogo GovTech & B2B</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Tabela oficial de valores de referência (SaaS e Setups) para todas as linhas de software da Nexus, incluindo o Sovereign Premium.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  Abrir Portfólio <Coins className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Magadot Auditoria */}
          <Link href="/gabinete/magadot">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-violet-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-violet-500/20">
                  <Database className="w-6 h-6 text-violet-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-violet-400 transition-colors font-headline">Sistema Magadot</CardTitle>
                <CardDescription>Auditoria de Estado & Rastros</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Módulo de auditoria fiscal, financeira e de fraudes (Filtro Pactum). Análises criptografadas do fluxo monetário municipal.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-violet-500">
                  Iniciar Rastreamento <Database className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Égide Segurança */}
          <Link href="/gabinete/egide">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="text-[8px] font-mono text-rose-500 tracking-widest uppercase">Live</span>
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-rose-500/20">
                  <Activity className="w-6 h-6 text-rose-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-rose-400 transition-colors font-headline">Cerco Égide</CardTitle>
                <CardDescription>Segurança & Biometria Cidadã</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Painel de monitoramento inteligente (LPR), alertas do Dante's Safe e métricas de criminalidade em tempo real.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-rose-500">
                  Acessar Câmeras <Activity className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  );
}
