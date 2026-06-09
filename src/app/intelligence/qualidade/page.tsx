'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Factory, SearchCheck, ClipboardList, Activity, ArrowUpRight, ShieldAlert, BarChart3 } from 'lucide-react';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function QualidadeHubPage() {
  const [planosAbertos, setPlanosAbertos] = useState([
    { id: 'RNC-105021', titulo: 'Troca de Sensor Defeituoso' },
    { id: 'RNC-105022', titulo: 'Retrabalho de Solda (Eixo)' }
  ]);

  const concluirPlano = (id: string) => {
    setPlanosAbertos(planosAbertos.filter(p => p.id !== id));
  };

  return (
    <>
      <SovereignShowcase moduleName="Nexus Qualidade" imagePath="/Nexus Intelligence Qualidade/Nexus Qualidade.png">
        <div className="min-h-screen bg-black text-white p-6 space-y-10 font-sans selection:bg-cyan-500/30">
        
        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-cyan-500/10 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/nexus-empresas">
              <div className="p-2 rounded-full hover:bg-cyan-500/10 transition-colors">
                <ArrowLeft className="h-5 w-5 text-cyan-400" />
              </div>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black uppercase tracking-tight text-cyan-400 font-headline italic">Controle de Qualidade</h1>
                <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">CQ & Compliance</Badge>
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest italic tracking-[0.2em]">
                Inspeções, RNCs e Planos de Ação
              </p>
            </div>
          </div>
        </div>

        {/* INDICADORES GLOBAIS DE QUALIDADE (Mockup Dashboard) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-[32px] p-6 relative overflow-hidden group cursor-pointer hover:bg-cyan-950/40 hover:border-cyan-500/50 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck className="h-24 w-24 text-cyan-500" />
                </div>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">First Pass Yield (FPY)</p>
                <h3 className="text-4xl font-black text-white mt-2">98.5<span className="text-xl text-cyan-500">%</span></h3>
                <p className="text-xs text-cyan-400 font-bold tracking-widest uppercase mt-2 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> +1.2% este mês</p>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-cyan-500/30 text-white sm:max-w-[600px] rounded-[32px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" /> Verificação: First Pass Yield
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-slate-400">Detalhamento do rendimento de primeira passagem por setor:</p>
                <div className="bg-black p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Montagem Final</span>
                    <span className="text-cyan-400 font-black">99.1%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Soldagem Estrutural</span>
                    <span className="text-amber-400 font-black">96.5% <span className="text-[9px] text-amber-500/50 ml-1">(Atenção)</span></span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Pintura e Acabamento</span>
                    <span className="text-emerald-400 font-black">100%</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-[32px] p-6 relative overflow-hidden group cursor-pointer hover:bg-rose-950/40 hover:border-rose-500/50 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldAlert className="h-24 w-24 text-rose-500" />
                </div>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Taxa de Refugo (Scrap)</p>
                <h3 className="text-4xl font-black text-white mt-2">1.5<span className="text-xl text-rose-500">%</span></h3>
                <p className="text-xs text-rose-400 font-bold tracking-widest uppercase mt-2">Dentro da Meta (&lt;2%)</p>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-rose-500/30 text-white sm:max-w-[600px] rounded-[32px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" /> Verificação: Taxa de Refugo
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-slate-400">Top 3 ofensores de refugo na última semana:</p>
                <div className="bg-black p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">1. Trinca na Solda (OP-1550)</span>
                    <span className="text-rose-400 font-black">0.8%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">2. Desvio Dimensional (OP-2026)</span>
                    <span className="text-rose-400 font-black">0.4%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">3. Risco na Pintura (Lote 100)</span>
                    <span className="text-amber-400 font-black">0.3%</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <div className={`border rounded-[32px] p-6 relative overflow-hidden group cursor-pointer transition-all ${planosAbertos.length > 0 ? 'bg-amber-950/20 border-amber-500/20 hover:bg-amber-950/40 hover:border-amber-500/50' : 'bg-emerald-950/20 border-emerald-500/20 hover:bg-emerald-950/40 hover:border-emerald-500/50'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className={`h-24 w-24 ${planosAbertos.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
                </div>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Planos de Ação (Abertos)</p>
                <h3 className="text-4xl font-black text-white mt-2">{planosAbertos.length}</h3>
                <p className={`text-xs font-bold tracking-widest uppercase mt-2 ${planosAbertos.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {planosAbertos.length > 0 ? 'Ação Requerida' : 'Tudo Resolvido'}
                </p>
              </div>
            </DialogTrigger>
            <DialogContent className={`bg-zinc-950 text-white sm:max-w-[600px] rounded-[32px] ${planosAbertos.length > 0 ? 'border-amber-500/30' : 'border-emerald-500/30'}`}>
              <DialogHeader>
                <DialogTitle className={`text-xl font-black uppercase tracking-widest flex items-center gap-2 ${planosAbertos.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  <Activity className="h-5 w-5" /> {planosAbertos.length > 0 ? 'Planos de Ação Críticos' : 'Gestão de RNCs'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-slate-400">RNCs aguardando fechamento:</p>
                <div className="bg-black p-4 rounded-xl border border-white/5 space-y-3">
                  {planosAbertos.length === 0 ? (
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest text-center py-4 flex items-center justify-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Nenhum plano pendente
                    </p>
                  ) : (
                    planosAbertos.map((plano) => (
                      <div key={plano.id} className="flex justify-between items-start text-sm border-b border-white/5 pb-2">
                        <div>
                          <span className="text-amber-400 font-black block">{plano.id}</span>
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{plano.titulo}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge className="bg-amber-500/10 text-amber-400 border-none">Pendente</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => concluirPlano(plano.id)}
                            className="h-6 text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/20 uppercase tracking-widest font-black"
                          >
                            Dar Baixa
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link href="/intelligence/qualidade/planos" className="block w-full">
                  <Button className="w-full mt-2 bg-amber-600 hover:bg-amber-500 text-black font-black uppercase tracking-widest">
                    Acessar Gestão de RNCs
                  </Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-violet-950/20 border border-violet-500/20 rounded-[32px] p-6 relative overflow-hidden group cursor-pointer hover:bg-violet-950/40 hover:border-violet-500/50 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ClipboardList className="h-24 w-24 text-violet-500" />
                </div>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Inspeções Pendentes</p>
                <h3 className="text-4xl font-black text-white mt-2">12</h3>
                <p className="text-xs text-violet-400 font-bold tracking-widest uppercase mt-2">Em Chão de Fábrica</p>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-violet-500/30 text-white sm:max-w-[600px] rounded-[32px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-widest text-violet-400 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" /> Inspeções Programadas
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-slate-400">Lotes aguardando auditoria (Regra de 5%):</p>
                <div className="bg-black p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">OP-2026 (Conjunto Base)</span>
                    <span className="text-violet-400 font-black">Alta Prioridade</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">OP-3000 (Carenagem)</span>
                    <span className="text-violet-400 font-black">Alta Prioridade</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">+ 10 Ordens Regulares</span>
                    <span className="text-slate-500 font-black">Normal</span>
                  </div>
                </div>
                <Link href="/intelligence/qualidade/processo" className="block w-full">
                  <Button className="w-full mt-2 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest">
                    Ir para Inspeção em Processo
                  </Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* PILARES DE ACESSO */}
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic mb-6 flex items-center gap-3">
             <BarChart3 className="h-6 w-6 text-cyan-500" /> Pilares Operacionais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pilar 1 */}
            <Link href="/intelligence/qualidade/recebimento" className="block">
              <Card className="bg-zinc-950/60 border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-950/10 transition-all cursor-pointer h-full rounded-[40px] group overflow-hidden">
                <CardContent className="p-8">
                  <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <SearchCheck className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-cyan-400 transition-colors">
                    Inspeção de Recebimento
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Validação de insumos entregues pelos fornecedores antes do armazenamento no Almoxarifado. (Controle de Quarentena).
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Pilar 2 */}
            <Link href="/intelligence/qualidade/processo" className="block">
              <Card className="bg-zinc-950/60 border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-950/10 transition-all cursor-pointer h-full rounded-[40px] group overflow-hidden">
                <CardContent className="p-8">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Factory className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">
                    Inspeção em Processo
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Checklists de máquina, liberação de lote e auditorias volantes integradas com as OPs do PPCP.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Pilar 3 */}
            <Link href="/intelligence/qualidade/planos" className="block">
              <Card className="bg-zinc-950/60 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-950/10 transition-all cursor-pointer h-full rounded-[40px] group overflow-hidden">
                <CardContent className="p-8">
                  <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ClipboardList className="h-8 w-8 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-amber-400 transition-colors">
                    RNC e Planos de Ação
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Gestão de não conformidades, tratamento de anomalias (5W2H) e relatórios de causa-raiz para melhoria contínua.
                  </p>
                </CardContent>
              </Card>
            </Link>

          </div>
        </div>

        </div>
        <LegalSafeguard module="DANTE CONTROLE DE QUALIDADE" protocol="NX-CQ-01" />
      </SovereignShowcase>
    </>
  );
}
