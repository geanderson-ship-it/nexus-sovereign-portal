'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck, Lock, Globe, Server, Database, AlertTriangle, Fingerprint, Activity,
  CheckCircle2, FileX, Info, ChevronRight, Zap
} from 'lucide-react';

interface ComplianceEvent {
  id: string;
  source: string;
  action: string;
  status: 'Bloqueado' | 'Permitido' | 'Revisão Necessária';
  time: string;
}

const mockEvents: ComplianceEvent[] = [
  { id: '1', source: 'marcos.vendas@empresa.com', action: 'Tentativa de exportação de base de leads (CSV)', status: 'Bloqueado', time: 'Há 5 minutos' },
  { id: '2', source: 'API Integração RH', action: 'Sincronização de folha de pagamento', status: 'Permitido', time: 'Há 12 minutos' },
  { id: '3', source: 'Suporte Terceirizado', action: 'Acesso a prontuário de cliente externo', status: 'Revisão Necessária', time: 'Há 45 minutos' },
  { id: '4', source: 'Sistema de Faturamento', action: 'Envio de notas fiscais em lote', status: 'Permitido', time: 'Há 1 hora' },
];

export default function CompliancePage() {
  const [mounted, setMounted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  if (!mounted) return null;

  return (
    <SovereignShowcase moduleName="Compliance & LGPD" imagePath="/images/compliance_b2b.jpg">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden pb-20 font-sans selection:bg-violet-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-violet-400/70 hover:text-violet-400 mb-4 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-violet-500" />
                Compliance <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">& LGPD</span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                Governança de dados autônoma, Prevenção contra Perda de Dados (DLP) e adequação regulatória global.
              </p>
            </div>

            <Button 
              onClick={triggerScan}
              disabled={isScanning}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 h-12 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
            >
              {isScanning ? (
                <>Varredura Ativa... <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="ml-2"><Activity className="h-5 w-5" /></motion.div></>
              ) : (
                <>Auditoria Completa <Zap className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>

          {/* Top KPI row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Score LGPD', value: '98/100', status: 'Excelente', icon: Globe, color: 'emerald' },
              { title: 'Endpoints Protegidos', value: '1,432', status: 'Online', icon: Server, color: 'sky' },
              { title: 'Bancos Auditados', value: '14', status: 'Criptografados', icon: Database, color: 'violet' },
              { title: 'Vazamentos Evitados', value: '8', status: 'Últimos 30 dias', icon: Lock, color: 'amber' },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-800/40 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-${kpi.color}-500/10 border border-${kpi.color}-500/20`}>
                    <kpi.icon className={`h-6 w-6 text-${kpi.color}-500`} />
                  </div>
                  <Badge variant="outline" className="border-white/10 text-slate-400 text-xs font-medium">
                    {kpi.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{kpi.title}</p>
                  <p className="text-3xl font-black text-white mt-1">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* System Status Map */}
            <div className="lg:col-span-1 bg-slate-900/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-violet-400" /> Mapa de Sensibilidade
              </h2>
              
              <div className="space-y-6">
                {[
                  { label: 'Dados Financeiros (PCI)', level: 100, color: 'bg-emerald-500' },
                  { label: 'Prontuários Médicos (HIPAA)', level: 100, color: 'bg-sky-500' },
                  { label: 'Dados Pessoais B2C (LGPD)', level: 85, color: 'bg-amber-500' },
                  { label: 'Segredos Industriais (IP)', level: 90, color: 'bg-violet-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-300">{item.label}</span>
                      <span className="text-slate-500">{item.level}% Protegido</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full ${item.color} shadow-[0_0_10px_currentColor]`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-violet-900/20 border border-violet-500/30 rounded-xl flex items-start gap-3">
                <Info className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-sm text-violet-200/80 leading-relaxed">
                  A arquitetura Zero Trust está ativa. Todos os acessos externos requerem MFA e análise comportamental contínua.
                </p>
              </div>
            </div>

            {/* DLP Events Log */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-violet-400" /> Monitoramento Ativo (DLP)
                </h2>
                <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 animate-pulse">
                  Monitorando em Tempo Real
                </Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {mockEvents.map(event => (
                  <div key={event.id} className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center gap-4 hover:border-violet-500/20 transition-colors">
                    <div className="shrink-0">
                      {event.status === 'Bloqueado' ? (
                        <FileX className="h-8 w-8 text-pink-500" />
                      ) : event.status === 'Permitido' ? (
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-8 w-8 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{event.action}</p>
                      <p className="text-slate-500 text-sm truncate mt-1">Origem: {event.source}</p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <Badge className={
                        event.status === 'Bloqueado' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                        event.status === 'Permitido' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }>
                        {event.status}
                      </Badge>
                      <p className="text-xs text-slate-600 mt-2">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </SovereignShowcase>
  );
}
