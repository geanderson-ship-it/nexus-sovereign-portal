'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lock, Briefcase, ChevronRight, Activity, Database, Users, LineChart, Shield, Zap, Target, PieChart, Workflow, FileText, Settings, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const modules = [
  { name: 'Gestão de Clientes (CRM)', icon: Users, status: 'Ativo' },
  { name: 'Controle Financeiro (ERP)', icon: PieChart, status: 'Ativo' },
  { name: 'Recursos Humanos', icon: Briefcase, status: 'Ativo' },
  { name: 'Logística Inteligente', icon: Globe, status: 'Ativo' },
  { name: 'Business Intelligence', icon: LineChart, status: 'Ativo' },
  { name: 'Marketing & Vendas', icon: Target, status: 'Ativo' },
  { name: 'Atendimento & Suporte', icon: Activity, status: 'Ativo' },
  { name: 'Gestão de Projetos', icon: Workflow, status: 'Ativo' },
  { name: 'Gestão de Contratos', icon: FileText, status: 'Ativo' },
  { name: 'Cadeia de Suprimentos', icon: Database, status: 'Ativo' },
  { name: 'Auditoria de Qualidade', icon: Shield, status: 'Ativo' },
  { name: 'Automação (Zap)', icon: Zap, status: 'Ativo' },
  { name: 'Configurações Globais', icon: Settings, status: 'Ativo' },
];

export default function NexusEmpresasDemoPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isVendasAuth = localStorage.getItem('vendas_auth') === 'true';
    if (!isVendasAuth) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-primary/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-4 relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image src="/nexus-prospector-bg.png" alt="Nexus Background" fill priority className="object-cover opacity-35" style={{ objectPosition: 'center center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/70 to-[#020617]/90" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-blue-900/50 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-headline text-white">Nexus Enterprise</h1>
              <p className="text-slate-400 font-mono text-sm uppercase tracking-widest mt-1">Suite de Inteligência Artificial On-Premise</p>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Suíte Completa: 13 Módulos</h2>
            <p className="text-slate-400">Navegue pelos módulos que compõem a solução corporativa definitiva da Nexus.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((mod, idx) => (
            <Card key={idx} className="bg-slate-900/40 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group">
              <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/20 shrink-0">
                  <mod.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm text-white group-hover:text-blue-400 transition-colors">{mod.name}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
