'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Search, Lock, MapPin, Coins, Users, Calendar, Activity, Database, Briefcase, FileText, DollarSign } from 'lucide-react';
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
          
          {/* Contratos Lançados */}
          <Link href="/gabinete/contratos">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                  <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-amber-400 transition-colors font-headline">Contratos Lançados</CardTitle>
                <CardDescription>Aprovações e Módulos Vendidos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Valide e aprove as vendas submetidas pela equipe comercial. Acompanhe os módulos adquiridos por cada novo cliente.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  Auditar Contratos <FileText className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Faturamento */}
          <Link href="/gabinete/faturamento">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors font-headline">Faturamento Inteligente</CardTitle>
                <CardDescription>Receita, Inadimplência e Fluxo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Painel financeiro C-Level. Visualize pagamentos confirmados, inadimplência em tempo real e previsão de recebíveis.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  Acessar Tesouraria <DollarSign className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card Prospector Hub */}
          <Link href="/gabinete/prospector">
            <Card className="bg-slate-900/40 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-500/20">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors font-headline">Prospector & Hub</CardTitle>
                <CardDescription>Mapeamento e Ecossistema Operacional</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Integração com IBGE, controle de leads, agenda tática, simuladores comerciais, Magadot e monitoramento Égide. Todas as ferramentas em um só lugar.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                  Acessar Hub Operacional <Search className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>

        {/* Cofre Administrativo: Regras de Contrato */}
        <div className="mt-12 border border-slate-800 bg-slate-900/30 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-headline text-white">Cofre Administrativo: Diretrizes de Contratos Terceirizados (15%)</h2>
          </div>
          <div className="p-6 text-sm text-slate-300">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
                  Objeto e Escopo Diferenciado
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">A atividade da terceirizada é estritamente comercial. Fica estabelecida a divisão explícita entre a Taxa de Setup (Venda Inicial) e a Taxa de Manutenção e Suporte Técnico.</p>
                
                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
                  Base de Cálculo Fixa
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Comissão fixada e irreajustável em 15%, incidindo única e exclusivamente sobre o valor líquido do Setup. Exclui-se, em caráter definitivo, qualquer valor de mensalidade recorrente (100% da Nexus).</p>

                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
                  Faturamento e Transparência
                </h3>
                <p className="text-slate-400 leading-relaxed">A terceirizada deve apresentar a tabela completa ao cliente (Setup + Recorrente). A visibilidade do recorrente tem fim estritamente informativo e não gera direito a comissionamento residual ou de carteira.</p>
              </div>
              <div>
                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">4</span>
                  Auditoria e Quitação
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Relatório enviado mensalmente pela Nexus. Prazo decadencial de 5 dias úteis para divergências, gerando quitação plena automática. Estornos aplicáveis em caso de cancelamento.</p>

                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">5</span>
                  Regras de Pós-Venda e Upsell
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Suporte técnico exclusivo da Nexus. A terceirizada canaliza reclamações e foca ações de relacionamento em Upsell, o qual remunerará novos 15% apenas sobre o Setup contratado.</p>

                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">6</span>
                  Autonomia e Rescisão
                </h3>
                <p className="text-slate-400 leading-relaxed">Bloqueio total à infraestrutura (AWS/GitHub) e painéis admin. Acesso restrito ao painel de vendas. Rescisão imotivada com 30 dias de aviso prévio, sem multas rescisórias.</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <Link href="/Contrato/topicos-contrato-vendas.md" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                  <FileText className="w-4 h-4 mr-2 text-amber-500" />
                  Abrir Arquivo do Contrato
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
