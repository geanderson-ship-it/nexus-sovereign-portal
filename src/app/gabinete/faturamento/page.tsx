'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lock, DollarSign, TrendingUp, TrendingDown, Clock, ChevronLeft, Download, RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Mock Data for Faturamento
const MOCK_PAGOS = [
  { id: 'FAT-2026-88', cliente: 'Prefeitura de São Paulo', modulo: 'Sovereign Premium', data: '16/06/2026', valor: 'R$ 1.250.000', status: 'Liquidado' },
  { id: 'FAT-2026-87', cliente: 'Viação Ouro e Prata', modulo: 'Nexus Frota', data: '15/06/2026', valor: 'R$ 45.000', status: 'Liquidado' },
  { id: 'FAT-2026-86', cliente: 'Indústrias Matarazzo SA', modulo: 'Nexus Compras', data: '14/06/2026', valor: 'R$ 15.000', status: 'Liquidado' },
  { id: 'FAT-2026-85', cliente: 'Bayer SA', modulo: 'Dante Safra (Enterprise)', data: '10/06/2026', valor: 'R$ 250.000', status: 'Liquidado' },
];

const MOCK_A_RECEBER = [
  { id: 'FAT-2026-90', cliente: 'Governo do Estado (RS)', modulo: 'Sistema Magadot', vencimento: '20/06/2026', valor: 'R$ 450.000', risco: 'Baixo' },
  { id: 'FAT-2026-91', cliente: 'Cooperativa Agro Sul', modulo: 'Dante Safra', vencimento: '22/06/2026', valor: 'R$ 1.499', risco: 'Baixo' },
  { id: 'FAT-2026-92', cliente: 'Logística Atlas LTDA', modulo: 'Nexus PPCP', vencimento: '25/06/2026', valor: 'R$ 18.000', risco: 'Médio' },
];

const MOCK_INADIMPLENCIA = [
  { id: 'FAT-2026-93', cliente: 'TechCorp Solutions', modulo: 'Nexus ERP Mensal', vencimento: '15/06/2026 (Atraso 2 dias)', valor: 'R$ 15.000', risco: 'Alto' },
  { id: 'FAT-2026-80', cliente: 'Mecânica Universal', modulo: 'Nexus Oficina', vencimento: '01/06/2026 (Atraso 16 dias)', valor: 'R$ 2.500', risco: 'Crítico' },
];

const MOCK_RECORRENCIA = [
  { id: 'REC-001', cliente: 'Hospital Moinhos', modulo: 'Nexus Health', ciclo: 'Mensal', vencimento: 'Todo dia 05', valor: 'R$ 19.900' },
  { id: 'REC-002', cliente: 'TechCorp Solutions', modulo: 'Nexus ERP', ciclo: 'Mensal', vencimento: 'Todo dia 15', valor: 'R$ 15.000' },
  { id: 'REC-003', cliente: 'Prefeitura de Venâncio Aires', modulo: 'Magadot Cloud', ciclo: 'Mensal', vencimento: 'Todo dia 10', valor: 'R$ 9.999' },
  { id: 'REC-004', cliente: 'Indústrias Matarazzo SA', modulo: 'Nexus Compras', ciclo: 'Mensal', vencimento: 'Todo dia 20', valor: 'R$ 600' },
  { id: 'REC-005', cliente: 'Cooperativa Agro Sul', modulo: 'Dante Safra', ciclo: 'Mensal', vencimento: 'Todo dia 10', valor: 'R$ 149' },
];

type FilterType = 'pagos' | 'areceber' | 'inadimplencia' | 'recorrencia';

export default function FaturamentoPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('pagos');

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
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Autenticando Tesouraria</h2>
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
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-emerald-400">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-headline text-white">Faturamento Inteligente</h1>
              <p className="text-slate-400">Auditoria Financeira e Fluxo de Caixa (Real-Time)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Download className="w-4 h-4 mr-2" /> Exportar Relatório
            </Button>
            <div className="flex items-center gap-2 bg-slate-900/50 border border-emerald-800/50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">Sync Ativo</span>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics / Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${activeFilter === 'pagos' ? 'bg-emerald-900/30 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900/40 border-emerald-900/50 hover:bg-emerald-900/20'}`}
            onClick={() => setActiveFilter('pagos')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-emerald-500 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Receita Líquida (Jun)
              </CardDescription>
              <CardTitle className="text-3xl font-headline text-emerald-400">R$ 1.560.000</CardTitle>
            </CardHeader>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all ${activeFilter === 'areceber' ? 'bg-amber-900/30 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-900/40 border-amber-900/50 hover:bg-amber-900/20'}`}
            onClick={() => setActiveFilter('areceber')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-amber-500 flex items-center gap-2">
                <Clock className="w-3 h-3" /> A Receber (15 dias)
              </CardDescription>
              <CardTitle className="text-3xl font-headline text-amber-400">R$ 469.499</CardTitle>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeFilter === 'inadimplencia' ? 'bg-rose-900/30 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-slate-900/40 border-rose-900/50 hover:bg-rose-900/20'}`}
            onClick={() => setActiveFilter('inadimplencia')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-rose-500 flex items-center gap-2">
                <TrendingDown className="w-3 h-3" /> Inadimplência
              </CardDescription>
              <CardTitle className="text-3xl font-headline text-rose-400">R$ 17.500</CardTitle>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeFilter === 'recorrencia' ? 'bg-blue-900/30 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-slate-900/40 border-blue-900/50 hover:bg-blue-900/20'}`}
            onClick={() => setActiveFilter('recorrencia')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-blue-500 flex items-center gap-2">
                <RefreshCw className="w-3 h-3" /> Recorrência (MRR)
              </CardDescription>
              <CardTitle className="text-3xl font-headline text-blue-400">R$ 45.648</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Table View */}
        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-lg font-headline text-white flex items-center gap-2">
              {activeFilter === 'pagos' && <><TrendingUp className="w-5 h-5 text-emerald-400" /> Faturas Liquidadas</>}
              {activeFilter === 'areceber' && <><Clock className="w-5 h-5 text-amber-400" /> Contas a Receber</>}
              {activeFilter === 'inadimplencia' && <><AlertCircle className="w-5 h-5 text-rose-400" /> Alertas de Inadimplência</>}
              {activeFilter === 'recorrencia' && <><RefreshCw className="w-5 h-5 text-blue-400" /> Assinaturas Recorrentes (MRR)</>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {activeFilter === 'pagos' && (
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Fatura ID</th>
                      <th className="px-6 py-4 font-medium">Origem (De Quem)</th>
                      <th className="px-6 py-4 font-medium">Módulo Faturado</th>
                      <th className="px-6 py-4 font-medium">Data do Recebimento</th>
                      <th className="px-6 py-4 font-medium text-right">Valor Líquido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PAGOS.map((fatura, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-emerald-400/80">{fatura.id}</td>
                        <td className="px-6 py-4 font-bold text-white">{fatura.cliente}</td>
                        <td className="px-6 py-4 text-slate-400">{fatura.modulo}</td>
                        <td className="px-6 py-4 text-slate-400"><Calendar className="w-3 h-3 inline mr-1 opacity-50"/> {fatura.data}</td>
                        <td className="px-6 py-4 font-mono text-emerald-400 font-bold text-right">{fatura.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeFilter === 'areceber' && (
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Fatura ID</th>
                      <th className="px-6 py-4 font-medium">Devedor (De Quem)</th>
                      <th className="px-6 py-4 font-medium">Referência</th>
                      <th className="px-6 py-4 font-medium">Vencimento (Quando)</th>
                      <th className="px-6 py-4 font-medium text-right">Valor Projetado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_A_RECEBER.map((fatura, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-amber-400/80">{fatura.id}</td>
                        <td className="px-6 py-4 font-bold text-white">{fatura.cliente}</td>
                        <td className="px-6 py-4 text-slate-400">{fatura.modulo}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-xs border bg-slate-800 text-slate-300 border-slate-700">
                            <Clock className="w-3 h-3 inline mr-1 opacity-50"/> {fatura.vencimento}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-amber-400 font-bold text-right">{fatura.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeFilter === 'inadimplencia' && (
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Fatura ID</th>
                      <th className="px-6 py-4 font-medium">Devedor (Inadimplente)</th>
                      <th className="px-6 py-4 font-medium">Módulo</th>
                      <th className="px-6 py-4 font-medium">Dias de Atraso</th>
                      <th className="px-6 py-4 font-medium text-right">Valor em Aberto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_INADIMPLENCIA.map((fatura, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-rose-400/80">{fatura.id}</td>
                        <td className="px-6 py-4 font-bold text-white">{fatura.cliente}</td>
                        <td className="px-6 py-4 text-slate-400">{fatura.modulo}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-xs border bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold">
                            <AlertCircle className="w-3 h-3 inline mr-1 opacity-50"/> {fatura.vencimento}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-rose-400 font-bold text-right">{fatura.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeFilter === 'recorrencia' && (
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Contrato ID</th>
                      <th className="px-6 py-4 font-medium">Assinante</th>
                      <th className="px-6 py-4 font-medium">Módulo Assinado</th>
                      <th className="px-6 py-4 font-medium">Ciclo / Vencimento (Quando)</th>
                      <th className="px-6 py-4 font-medium text-right">Valor Recorrente (MRR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_RECORRENCIA.map((rec, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-blue-400/80">{rec.id}</td>
                        <td className="px-6 py-4 font-bold text-white">{rec.cliente}</td>
                        <td className="px-6 py-4 text-slate-400">{rec.modulo}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-xs border bg-blue-500/10 text-blue-400 border-blue-500/30">
                            <RefreshCw className="w-3 h-3 inline mr-1 opacity-50"/> {rec.ciclo} - {rec.vencimento}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-blue-400 font-bold text-right">{rec.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
