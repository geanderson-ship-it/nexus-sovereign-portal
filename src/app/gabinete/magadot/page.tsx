'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Lock, Database, ArrowLeft, AlertTriangle, CheckCircle2, Activity, FileSearch, LineChart, ServerCrash } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MagadotPage() {
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
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-emerald-500">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-emerald-500/50" />
        <h2 className="text-xl font-headline tracking-widest text-emerald-500/50 uppercase">Descriptografando Acesso</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-4 relative overflow-hidden">
      
      {/* BACKGROUND IMAGE & EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#04090e]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-emerald-900/30 pb-8">
          <div className="flex items-center gap-4">
            <Link href="/gabinete" className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-950/30 hover:border-emerald-500/50 transition-all group cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-headline text-white flex items-center gap-3">
                <Database className="w-8 h-8 text-emerald-400" />
                Nexus Magadot
              </h1>
              <p className="text-emerald-400/70 font-mono text-sm mt-1 uppercase tracking-wider">Módulo de Auditoria de Estado & Compliance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-emerald-950/30 border border-emerald-900/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">SOC Ativo</span>
            </div>
          </div>
        </div>

        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Contratos Analisados</p>
                <FileSearch className="w-5 h-5 text-emerald-500/70" />
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-white font-mono">1.482</h3>
                <span className="text-xs text-emerald-400 mb-1 font-bold">+12 hoje</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Volume Auditado</p>
                <LineChart className="w-5 h-5 text-indigo-400/70" />
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-white font-mono">R$ 84.5M</h3>
                <span className="text-xs text-indigo-400 mb-1 font-bold">YTD</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-rose-200">Anomalias Detectadas</p>
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-rose-400 font-mono">14</h3>
                <span className="text-xs text-rose-500 mb-1 font-bold">Bloqueios Críticos</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Integridade do Cofre</p>
                <Shield className="w-5 h-5 text-teal-400/70" />
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-white font-mono">99.9%</h3>
                <span className="text-xs text-teal-400 mb-1 font-bold">Seguro</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* MAIN RADAR PANEL */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-2xl">
              <CardHeader className="border-b border-slate-800/50 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-white font-headline flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      Radar de Fluxo Financeiro
                    </CardTitle>
                    <CardDescription className="mt-1">Monitoramento em tempo real de liquidações e empenhos.</CardDescription>
                  </div>
                  <div className="px-3 py-1 bg-slate-800/50 rounded-md border border-slate-700 text-xs font-mono text-slate-300">
                    Última varredura: {new Date().toLocaleTimeString('pt-BR')}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Fake Chart Area */}
                <div className="h-64 w-full bg-slate-950/50 rounded-lg border border-slate-800/50 relative flex items-end justify-between p-4 gap-2">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
                  
                  {/* Fake Bars */}
                  {[40, 65, 30, 80, 45, 90, 60, 20, 50, 75, 85, 35].map((height, i) => (
                    <div key={i} className="w-full relative group">
                      <div 
                        className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-1000 ${
                          i === 5 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 
                          i === 10 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 
                          'bg-emerald-500/30 group-hover:bg-emerald-400/50'
                        }`}
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                  
                  {/* Anomalies indicators */}
                  <div className="absolute top-4 right-4 bg-slate-900/80 border border-slate-700 p-3 rounded-lg backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                      <div className="w-3 h-3 rounded-sm bg-rose-500" /> Detecção de Risco Alto
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                      <div className="w-3 h-3 rounded-sm bg-amber-400" /> Divergência Tributária
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-3 h-3 rounded-sm bg-emerald-500/30" /> Fluxo Normal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/50 pb-4">
                <CardTitle className="text-lg text-white font-headline">Rastreio Pactum (Licitações Recentes)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800/50">
                  {[
                    { id: 'CT-2026/041', target: 'Aquisição Equip. Hospitalar', value: 'R$ 2.450.000', status: 'Limpo', risk: 12 },
                    { id: 'CT-2026/042', target: 'Obras Viárias Sul', value: 'R$ 14.800.000', status: 'Alerta', risk: 68 },
                    { id: 'CT-2026/043', target: 'Merenda Escolar (Q2)', value: 'R$ 3.100.000', status: 'Limpo', risk: 5 },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.status === 'Limpo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {item.status === 'Limpo' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-white font-mono text-sm">{item.id}</p>
                          <p className="text-xs text-slate-400">{item.target}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-200">{item.value}</p>
                        <p className={`text-[10px] font-mono font-bold uppercase ${
                          item.risk > 50 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>Score de Risco: {item.risk}/100</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR PANEL */}
          <div className="space-y-6">
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">Motor de Inferência IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-white">Análise Preditiva de Fraude</span>
                      <span className="text-xs text-emerald-400 font-mono">Online</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-white">Malha Fiscal Automatizada</span>
                      <span className="text-xs text-emerald-400 font-mono">Processando...</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden relative">
                      <div className="bg-indigo-400 h-1.5 rounded-full absolute top-0 left-0 animate-[shimmer_2s_infinite] w-1/2"></div>
                    </div>
                  </div>

                  <div className="bg-slate-950 rounded-lg p-4 border border-rose-900/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-rose-300">Cruzamento de Sócios Ocultos</span>
                      <span className="text-xs text-rose-400 font-mono">Alerta Detetado</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                      Dante AI identificou correlação societária de 87% entre empresas concorrentes no pregão CT-2026/042.
                    </p>
                    <button className="mt-3 w-full py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded transition-colors uppercase tracking-widest">
                      Bloquear Empenho
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-950/20 border-emerald-900/50 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <ServerCrash className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-white font-bold mb-2">Ambiente Blindado</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Os dados trafegados neste módulo estão sendo operados localmente (On-Premise) pelo núcleo Magadot, sem exposição à nuvem pública.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
