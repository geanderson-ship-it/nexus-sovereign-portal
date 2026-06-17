'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Lock, FileText, CheckCircle2, Clock, AlertTriangle, Eye, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Mock Data for Contracts
const MOCK_CONTRATOS = [
  { id: 'CTX-9021', cliente: 'Indústrias Matarazzo SA', modulo: 'Nexus Compras', vendedor: 'Carla Silva', data: '17/06/2026', valor: 'R$ 15.000 (Setup) + R$ 600/mês', status: 'Aprovado' },
  { id: 'CTX-9020', cliente: 'Prefeitura de Venâncio Aires', modulo: 'Sistema Magadot', vendedor: 'Geanderson', data: '16/06/2026', valor: 'R$ 150.000 (Setup) + R$ 9.999/mês', status: 'Aprovado' },
  { id: 'CTX-9019', cliente: 'Cooperativa Agro Sul', modulo: 'Dante Safra', vendedor: 'Carla Silva', data: '16/06/2026', valor: 'R$ 1.499 (Setup) + R$ 149/mês', status: 'Aguardando Assinatura' },
  { id: 'CTX-9018', cliente: 'Logística Atlas LTDA', modulo: 'Nexus PPCP', vendedor: 'Roberto', data: '15/06/2026', valor: 'R$ 18.000 (Setup) + R$ 750/mês', status: 'Aprovado' },
  { id: 'CTX-9017', cliente: 'Hospital Moinhos', modulo: 'Nexus Health', vendedor: 'Geanderson', data: '14/06/2026', valor: 'R$ 0 (Setup) + R$ 199/mês', status: 'Em Análise (Pactum)' },
];

export default function ContratosLancadosPage() {
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
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Autenticando Gabinete</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-4 relative">
      
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-prospector-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover opacity-20"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-[#080b10]/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <Link href="/gabinete">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-amber-400">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-amber-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <FileText className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-headline text-white">Contratos Lançados</h1>
              <p className="text-slate-400">Validação e Aprovação de Vendas B2B</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/50 border border-amber-800/50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">Auditoria Ativa</span>
          </div>
        </div>

        {/* Mocks Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-slate-400">Total de Contratos</CardDescription>
              <CardTitle className="text-3xl font-headline text-white">412</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900/40 border-emerald-900/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-emerald-500">Aprovados / Ativos</CardDescription>
              <CardTitle className="text-3xl font-headline text-emerald-400">388</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900/40 border-amber-900/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-amber-500">Aguardando Auditoria</CardDescription>
              <CardTitle className="text-3xl font-headline text-amber-400">24</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Table / List */}
        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-headline text-white">Últimos Lançamentos Comerciais</CardTitle>
            <CardDescription>Vendas submetidas via Showroom Comercial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-y border-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Módulo Vendido</th>
                    <th className="px-4 py-3 font-medium">Vendedor</th>
                    <th className="px-4 py-3 font-medium">Valores Negociados</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CONTRATOS.map((contrato, i) => (
                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-mono text-amber-400/80">{contrato.id}</td>
                      <td className="px-4 py-4 font-bold text-white">{contrato.cliente}</td>
                      <td className="px-4 py-4">
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">{contrato.modulo}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-400">{contrato.vendedor}</td>
                      <td className="px-4 py-4 font-mono text-emerald-400/90">{contrato.valor}</td>
                      <td className="px-4 py-4">
                        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full w-fit ${
                          contrato.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          contrato.status === 'Aguardando Assinatura' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {contrato.status === 'Aprovado' && <CheckCircle2 className="w-3 h-3" />}
                          {contrato.status === 'Aguardando Assinatura' && <Clock className="w-3 h-3" />}
                          {contrato.status === 'Em Análise (Pactum)' && <AlertTriangle className="w-3 h-3" />}
                          {contrato.status}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 hover:bg-amber-500/20 hover:text-amber-400">
                          <Eye className="w-4 h-4 mr-2" /> Auditar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
