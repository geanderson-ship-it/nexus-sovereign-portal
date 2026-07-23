'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Search, Lock, MapPin, Coins, Users, Calendar, Activity, Database, Briefcase, FileText, DollarSign, TrendingUp, Globe, Video } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-0 relative">
      
      {/* GABINETE ACTIVE CORE BACKGROUND (MAGADOT/ORION STYLE) - INTENSIFICADO */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0f0700]">
          {/* Pontilhados mais visíveis */}
          <div className="absolute inset-0 bg-[radial-gradient(#eab308_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-20" />
          
          {/* Brilhos centrais mais fortes e intensos */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-amber-600/25 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-yellow-500/25 blur-[80px] rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          
          {/* Anéis orbitais mais brilhantes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border-[2px] border-amber-500/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border-[2px] border-yellow-500/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border-[2px] border-amber-400/40 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-overlay" />
      </div>

      {/* BANNER FULL SCREEN WIDTH */}
      <div className="w-full relative h-[240px] md:h-[420px] mb-12 overflow-hidden border-b border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.25)]">
        <Image 
          src="/Nexus Holding Group/Cartão Nexus Holding group.png" 
          alt="Nexus Holding Group" 
          fill 
          className="object-cover object-[center_38%]"
          priority
        />
        {/* Degradê para misturar suavemente a base da imagem com o fundo da tela */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0700] via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">

        {/* CARD GRANDE ESTILO NEXUS (SOVEREIGN CENTER) */}
        <div className="block mb-12">
            <div className="relative w-full rounded-3xl border border-amber-500/20 bg-black/40 backdrop-blur-xl p-8 md:p-10 shadow-[0_0_50px_rgba(234,179,8,0.1)] overflow-hidden group transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_0_60px_rgba(234,179,8,0.2)]">
                {/* Cyber grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                
                {/* Ambient amber glows */}
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-amber-600/15" />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-yellow-500/15" />
                
                {/* Accent lines top and bottom */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
 
                {/* Corner accents - customized for a more cybernetic look */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500/40 rounded-tl-sm transition-all duration-300 group-hover:border-amber-400 group-hover:scale-105" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500/40 rounded-tr-sm transition-all duration-300 group-hover:border-amber-400 group-hover:scale-105" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500/40 rounded-bl-sm transition-all duration-300 group-hover:border-amber-400 group-hover:scale-105" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500/40 rounded-br-sm transition-all duration-300 group-hover:border-amber-400 group-hover:scale-105" />
 
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
                    <div className="flex-1 space-y-4 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400">NHG Core System v4.5</span>
                        </div>
 
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-white tracking-wide group-hover:text-amber-450 transition-colors duration-300">
                            Centro de Comando & Soberania Operacional
                        </h2>
 
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light max-w-2xl">
                            Bem-vindo de volta, <strong className="text-amber-400 font-semibold">Diretor Geanderson</strong>. O ecossistema está sob monitoramento ativo da inteligência integrada. Seus canais de vendas, faturamento e tradução simultânea estão 100% blindados e operantes.
                        </p>
 
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link href="/gabinete/tradutor">
                                <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform duration-300 hover:scale-105">
                                    <Globe className="w-4 h-4" />
                                    Abrir Tradutor Soberano
                                </Button>
                            </Link>
                            <Link href="/gabinete/meet">
                                <Button className="bg-indigo-600 hover:bg-indigo-550 border border-indigo-500/30 text-white font-bold shadow-lg shadow-indigo-500/10 flex items-center gap-2 transition-transform duration-300 hover:scale-105">
                                    <Video className="w-4 h-4 text-indigo-400" />
                                    Iniciar Nexus Meet
                                </Button>
                            </Link>
                            <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors duration-300">Selecione uma ferramenta no comando</span>
                        </div>
 
                        {/* Quick Telemetry Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/60">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">IA Núcleo</span>
                                <span className="text-xs font-semibold text-amber-300">Claude 4.5 Sonnet</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Segurança</span>
                                <span className="text-xs font-semibold text-emerald-400">On-Premise Ativo</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base de Dados</span>
                                <span className="text-xs font-semibold text-slate-200">Sincronizada (Amplify)</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Status Geral</span>
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    Otimizado
                                </span>
                            </div>
                        </div>
                    </div>
 
                    <div className="shrink-0 relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-amber-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-slate-950 p-2 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-500/5 animate-[pulse_3s_infinite]" />
                        <svg viewBox="0 0 100 100" className="w-20 h-20 text-amber-500 transition-transform duration-700 group-hover:scale-110">
                            {/* High-tech shield/crest vector */}
                            <path d="M50 5 L85 20 V50 C85 70 70 88 50 95 C30 88 15 70 15 50 V20 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            <path d="M50 15 L75 26 V48 C75 64 64 78 50 84 C36 78 25 64 25 48 V26 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="50" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
                            <line x1="50" y1="25" x2="50" y2="37" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            <line x1="50" y1="53" x2="50" y2="75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        {/* HERO CARDS: ATENA & ISADORA */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* ATENA */}
          <Link href="/gabinete/atena" className="block">
            <Card className="h-full bg-slate-900/60 border-indigo-500/30 hover:border-indigo-400/60 hover:bg-slate-900/80 transition-all cursor-pointer group relative overflow-hidden ring-1 ring-indigo-500/30 w-full shadow-[0_0_40px_rgba(99,102,241,0.1)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
              
              <div className="flex flex-col items-center gap-6 p-8 relative z-10 text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform flex-shrink-0 bg-indigo-950">
                  <Image src="/atena-avatar.png" alt="Atena Avatar" fill className="object-cover" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Acesso Nível Soberano</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl text-white font-headline font-bold mb-3 group-hover:text-indigo-300 transition-colors">
                    Atena - IA Exclusiva
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    Painel de orquestração e terminal interativo da IA Soberana conectada ao núcleo AWS.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {/* ISADORA */}
          <Link href="/gabinete/isadora" className="block">
            <Card className="h-full bg-slate-900/60 border-amber-500/30 hover:border-amber-400/60 hover:bg-slate-900/80 transition-all cursor-pointer group relative overflow-hidden ring-1 ring-amber-500/30 w-full shadow-[0_0_40px_rgba(245,158,11,0.1)]">
              <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
              
              <div className="flex flex-col items-center gap-6 p-8 relative z-10 text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform flex-shrink-0 bg-amber-950">
                  <Image src="/Vendedora Nexus/Isadora Nexus.png" alt="Isadora Avatar" fill className="object-cover object-[center_30%]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <TrendingUp className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Vendas & Handoff</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl text-white font-headline font-bold mb-3 group-hover:text-amber-300 transition-colors">
                    Isadora OS (Vendas)
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    Painel de monitoramento de Hot Leads e conversões da executiva de alta performance.
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Sala de Controle (Links em Lista) */}
        <div className="mb-12 border-t border-slate-800 pt-8">
          <h3 className="text-xl font-headline font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Sala de Controle
          </h3>
          <ul className="flex flex-col gap-4 max-w-md">
            <li>
              <Link href="/gabinete/contratos" className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors group">
                <FileText className="w-4 h-4 text-slate-600 group-hover:text-amber-400" /> 
                <span className="font-mono text-sm tracking-wide uppercase">Contratos Lançados</span>
              </Link>
            </li>
            <li>
              <Link href="/gabinete/faturamento" className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors group">
                <DollarSign className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" /> 
                <span className="font-mono text-sm tracking-wide uppercase">Faturamento Inteligente</span>
              </Link>
            </li>
            <li>
              <Link href="/gabinete/prospector" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors group">
                <Search className="w-4 h-4 text-slate-600 group-hover:text-blue-400" /> 
                <span className="font-mono text-sm tracking-wide uppercase">Prospector & Hub</span>
              </Link>
            </li>
            <li>
              <Link href="/gabinete/showroom" className="flex items-center gap-3 text-slate-300 hover:text-purple-400 transition-colors group">
                <Users className="w-4 h-4 text-slate-600 group-hover:text-purple-400" /> 
                <span className="font-mono text-sm tracking-wide uppercase">Showroom de Avatares</span>
              </Link>
            </li>
            <li>
              <Link href="/gabinete/tradutor" className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors group">
                <Globe className="w-4 h-4 text-slate-600 group-hover:text-amber-400" /> 
                <span className="font-mono text-sm tracking-wide uppercase">Tradutor Soberano</span>
              </Link>
            </li>
            <li>
              <Link href="/gabinete/meet" className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors group">
                <Video className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" /> 
                <span className="font-mono text-sm tracking-wide uppercase font-bold text-indigo-400/90">Nexus Meet Soberano</span>
              </Link>
            </li>
            <li>
              <Link href="/gabinete/propostas" className="flex items-center gap-3 text-slate-300 hover:text-rose-400 transition-colors group">
                <Briefcase className="w-4 h-4 text-slate-600 group-hover:text-rose-400" /> 
                <span className="font-mono text-sm tracking-wide uppercase">Propostas Comerciais</span>
              </Link>
            </li>
            <li>
              <Link href="/gabinete/cases" className="flex items-center gap-3 text-slate-300 hover:text-yellow-400 transition-colors group">
                <MapPin className="w-4 h-4 text-slate-600 group-hover:text-yellow-400" /> 
                <span className="font-mono text-sm tracking-wide uppercase">Cases de Sucesso</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cofre Administrativo: Regras de Contrato */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <details className="group border border-slate-800 bg-slate-900/30 rounded-xl overflow-hidden backdrop-blur-md cursor-pointer">
            <summary className="bg-slate-800/50 px-6 py-4 flex items-center gap-3 list-none">
              <Lock className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-headline text-white">Contrato para Vendedores</h2>
            </summary>
            
            <div className="p-6 text-sm text-slate-300 border-t border-slate-800">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {/* Parte 1: Escopo e Faturamento */}
              <div>
                <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4 pb-2 border-b border-slate-800">Parte 1: Escopo e Faturamento</h3>
                
                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
                  Objeto e Escopo Diferenciado
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">A atividade é estritamente comercial. Fica estabelecida a divisão explícita entre a Taxa de Setup (Venda Inicial) e a Taxa de Manutenção/Suporte.</p>
                
                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
                  Base de Cálculo Fixa (15%)
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Comissão irreajustável em 15%, incidindo única e exclusivamente sobre o Setup. Exclui-se qualquer valor de mensalidade recorrente (100% Nexus).</p>

                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
                  Faturamento e Transparência
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">A terceirizada deve apresentar a tabela completa. A visibilidade do recorrente tem fim informativo, sem gerar direito a comissionamento residual.</p>

                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">4</span>
                  Auditoria e Quitação
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Relatório enviado mensalmente. Prazo decadencial de 5 dias úteis para divergências, gerando quitação plena automática. Estornos aplicáveis em cancelamento.</p>

                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">5</span>
                  Upsell Ativo vs Passivo
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Suporte é da Nexus. O Upsell remunera novos 15% apenas se a terceirizada negociar ativamente. Upgrades autônomos feitos pelo cliente não geram comissão residual.</p>

                <h3 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">6</span>
                  Autonomia e Rescisão
                </h3>
                <p className="text-slate-400 leading-relaxed">Bloqueio total à  infraestrutura (AWS/GitHub) e painéis admin. Rescisão imotivada com 30 dias de aviso prévio, sem multas rescisórias.</p>
              </div>

              {/* Parte 2: Blindagem Jurídica */}
              <div>
                <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4 pb-2 border-b border-slate-800">Parte 2: Blindagem Jurídica e Operacional</h3>
                
                <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[10px]">7</span>
                  Confidencialidade e LGPD
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">O manuseio de dados sensíveis de clientes (Governos, Empresas, Agro, Mídia ou PF) exige sigilo absoluto sob pena de multa. Conformidade obrigatória com a LGPD.</p>

                <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[10px]">8</span>
                  Propriedade Intelectual (IP)
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">A marca Nexus, código-fonte e banco de dados são propriedade 100% da Nexus Holding. É vedado o registro de domínios ou redes não oficiais.</p>

                <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[10px]">9</span>
                  Não-Concorrência (Non-Compete)
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Proibição de representar softwares concorrentes. Quarentena de 12 meses após a rescisão para atuar na mesma carteira prospectada.</p>

                <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[10px]">10</span>
                  Gatilho de Pagamento
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">A comissão só é repassada após a efetiva compensação bancária do Setup. Sem pagamento do cliente, não há comissão, protegendo o caixa.</p>

                <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[10px]">11</span>
                  Política de Descontos
                </h3>
                <p className="text-slate-400 mb-8 leading-relaxed">Qualquer desconto concedido incidirá total ou proporcionalmente sobre a coluna de Setup. O desconto é absorvido pela margem da terceirizada.</p>

                <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4 pb-2 border-b border-slate-800">Parte 3: Disposições Finais</h3>

                <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">12</span>
                  Sem Vínculo Empregatício
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Natureza estritamente comercial. Não há subordinação jurídica, vínculo trabalhista ou societário com os corretores da terceirizada.</p>

                <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">13</span>
                  Não-Exclusividade Territorial
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">A Nexus preserva o direito de atuar com múltiplos parceiros na mesma região. O comissionamento será devido à  representante que efetivar oficialmente a contratação do Setup.</p>

                <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">14</span>
                  Foro de Eleição
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Qualquer conflito judicial ou litígio será dirimido única e exclusivamente na comarca sede da Nexus Holding.</p>

                <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">15</span>
                  Valores Fundamentais Nexus
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">A parceira compromete-se a atuar sob os 4 pilares: <strong className="text-white">Humanidade, Respeito, Ética e Confiança</strong> em qualquer segmento (Governo, Empresas, Agro, Mídia ou PF). A quebra rescinde o contrato imediatamente.</p>

                <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">16</span>
                  Isenção de Reembolsos
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">A terceirizada assume todos os seus riscos e custos (viagens, combustível, marketing). A Nexus não reembolsa nenhuma despesa comercial sob hipótese alguma.</p>

                <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">17</span>
                  Customizações e Escopo
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Promessas de novos desenvolvimentos e ajustes devem constar explicitamente nas Observações da Ficha Contratual. Promessas verbais não oficializadas são nulas e de risco da parceira.</p>

                <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">18</span>
                  Compliance e Anticorrupção
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">Tolerância zero a vantagens indevidas. A terceirizada responde criminal e civilmente por atos de corrupção, isentando totalmente a Nexus Holding.</p>

                <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">19</span>
                  Cláusula de Indenidade
                </h3>
                <p className="text-slate-400 leading-relaxed">A terceirizada obriga-se a reembolsar a Nexus de todos os custos caso a Nexus seja acionada judicialmente por dívidas trabalhistas ou cíveis de responsabilidade da parceira.</p>
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
          </details>
        </div>
      </div>
    </div>
  );
}
