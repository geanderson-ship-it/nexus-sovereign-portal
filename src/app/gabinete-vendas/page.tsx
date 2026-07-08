'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Search, Lock, MapPin, Coins, Users, Calendar, Activity, Database, Briefcase, FileText, Shirt } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';

export default function GabineteVendasPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      const isVendasAuth = localStorage.getItem('vendas_auth') === 'true';
      const isSystemAdmin = user && isAdminUser(user);
      if (!isVendasAuth && !isSystemAdmin) {
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
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Verificando Acesso Comercial</h2>
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-emerald-900/50 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-emerald-700/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <Briefcase className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-headline text-white">Showroom Comercial</h1>
              <p className="text-slate-400">Portal de Parceiros e Vendas Nexus Holding Group</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/50 border border-emerald-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">Acesso Comercial Ativo</span>
          </div>
        </div>

        {/* Módulos do Showroom */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Lançamento de Vendas */}
          <Link href="/gabinete-vendas/lancamento">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                  <Coins className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-amber-400 transition-colors font-headline">Lançar Nova Venda</CardTitle>
                <CardDescription>Registro Oficial de Contratos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Formulário oficial para submeter contratos fechados e registrar vendas concluídas para auditoria da diretoria.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  Preencher Formulário <Coins className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          {/* Nexus Enterprise */}
          <Link href="/nexus-empresas">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-500/20">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors font-headline">Nexus Enterprise</CardTitle>
                <CardDescription>Suíte B2B e Indústria</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Landing page com acesso aos 13 módulos operacionais (Vendas, Compras, ERP, RH, etc) prontos para navegação.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                  Abrir Suíte Corporativa <Briefcase className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Nexus Intelligence */}
          <Link href="/intelligence">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-teal-500/20">
                  <Database className="w-6 h-6 text-teal-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-teal-400 transition-colors font-headline">Nexus Intelligence</CardTitle>
                <CardDescription>Portal de Soluções Inteligentes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Hub central de inteligência artificial, governança, medicina de precisão e outras aplicações avançadas.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-500">
                  Acessar Hub <Database className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Agro Dante Safra */}
          <Link href="/agro">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
                  <Search className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors font-headline">Dante Safra (Agro)</CardTitle>
                <CardDescription>Inteligência Agrícola</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Terminal tático para o agronegócio: previsão de safra, monitoramento de solo e automação no campo.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  Abrir Terminal Agro <Search className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Sovereign Premium */}
          <Link href="/excellence">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-indigo-500/20">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-indigo-400 transition-colors font-headline">Sovereign Premium</CardTitle>
                <CardDescription>Soluções Governamentais</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  O mais alto nível de engenharia para estado. Demonstrações exclusivas para licitações e alto escalão.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                  Acesso Premium <Shield className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Portfólio de Precificação */}
          <Link href="/gabinete-vendas/precificacao">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-violet-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-violet-500/20">
                  <Database className="w-6 h-6 text-violet-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-violet-400 transition-colors font-headline">Sistema Magadot</CardTitle>
                <CardDescription>Auditoria de Estado (Demo)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Mostre aos clientes o poder do Módulo de auditoria fiscal e financeira municipal em tempo real.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-violet-500">
                  Visualizar Sistema <Database className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Cerco Égide */}
          <Link href="/gabinete-vendas/egide">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-rose-500/20">
                  <Activity className="w-6 h-6 text-rose-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-rose-400 transition-colors font-headline">Cerco Égide</CardTitle>
                <CardDescription>Segurança Inteligente (Demo)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Demonstração do painel de monitoramento inteligente (LPR) e métricas de criminalidade do Dante's Safe.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-rose-500">
                  Acessar Painel <Activity className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* InovaModa 360 */}
          <Link href="/inovamoda">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-pink-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl group-hover:bg-pink-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-pink-500/20">
                  <Shirt className="w-6 h-6 text-pink-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-pink-400 transition-colors font-headline">InovaModa 360</CardTitle>
                <CardDescription>Provador Virtual IA (Demo)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Demonstração da tecnologia Sovereign de Virtual Try-On 3D para grandes varejistas de moda e e-commerce.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-pink-500">
                  Acessar Provador <Shirt className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Regras e Contrato */}
          <Link href="/Contrato/topicos-contrato-vendas.md" target="_blank" rel="noopener noreferrer">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                  <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-amber-400 transition-colors font-headline">Código de Conduta</CardTitle>
                <CardDescription>Regras e Contrato Comercial</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Acesso completo ao contrato de parceria (15%), diretrizes éticas e regras de comercialização da Nexus.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  Ler Documento <FileText className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
        </div>
      </div>
    </div>
  );
}
