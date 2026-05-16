'use client';

import React, { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { permanentEmployees } from '@/lib/data/employees';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Printer, 
  Share2, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Zap,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

export default function CertificadoMeritoPage() {
  const searchParams = useSearchParams();
  const employeeId = searchParams?.get('id') || 'emp-001';
  const employee = permanentEmployees.find(emp => emp.id === employeeId);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Mock de notas para o certificado (em produção viria do DB)
  const stats = [
    { label: 'Disciplina', value: 5, icon: ShieldCheck },
    { label: 'Qualidade', value: 4, icon: CheckCircle2 },
    { label: 'Velocidade', value: 5, icon: Zap },
    { label: 'Comportamento', value: 4, icon: Award },
    { label: 'Proatividade', value: 5, icon: Award },
  ];

  // Lógica de Níveis Nexus
  const getLevel = (score: number) => {
    if (score >= 9.6) return { label: 'DIAMANTE', color: 'text-cyan-400', border: 'border-cyan-400/50', bg: 'bg-cyan-500/10', shadow: 'shadow-cyan-500/20' };
    if (score >= 7.6) return { label: 'OURO', color: 'text-amber-400', border: 'border-amber-400/50', bg: 'bg-amber-500/10', shadow: 'shadow-amber-500/20' };
    if (score >= 6.1) return { label: 'PRATA', color: 'text-slate-300', border: 'border-slate-300/50', bg: 'bg-slate-300/10', shadow: 'shadow-slate-300/20' };
    if (score >= 5.0) return { label: 'BRONZE', color: 'text-orange-400', border: 'border-orange-400/50', bg: 'bg-orange-500/10', shadow: 'shadow-orange-500/20' };
    return { label: 'EM OBSERVAÇÃO', color: 'text-red-400', border: 'border-red-400/50', bg: 'bg-red-500/10', shadow: 'shadow-red-500/20' };
  };

  const imn = Number((stats.reduce((a, b) => a + b.value, 0) / 5 * 2).toFixed(1));
  const level = getLevel(imn);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-10 flex flex-col items-center space-y-8 print:p-0 print:bg-white">
      
      {/* Header Actions */}
      <div className="w-full max-w-5xl flex justify-between items-center print:hidden">
         <Button variant="ghost" asChild className="text-slate-400 hover:text-white">
            <Link href="/intelligence/merito">
               <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Base
            </Link>
         </Button>
         <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 text-white rounded-xl" onClick={handlePrint}>
               <Printer className="mr-2 h-4 w-4" /> Imprimir Certificado
            </Button>
            <Button className="bg-primary text-black font-black rounded-xl">
               <Download className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
         </div>
      </div>

      {/* Certificate Body */}
      <div 
        ref={certificateRef}
        className={cn(
          "relative w-full max-w-[900px] aspect-[1.414/1] bg-[#020617] border-[12px] border-double p-12 overflow-hidden shadow-2xl transition-all duration-1000 print:shadow-none print:aspect-auto",
          level.border,
          level.shadow
        )}
      >
        {/* Decorative Elements */}
        <div className={cn("absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-20", level.bg)} />
        <div className={cn("absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-20", level.bg)} />
        
        {/* Content Overlay */}
        <div className="relative h-full w-full border-2 border-white/5 p-10 flex flex-col items-center justify-between text-center bg-gradient-to-br from-white/[0.02] to-transparent">
           
           {/* Header */}
           <div className="space-y-4">
              <div className="flex justify-center mb-6">
                 <div className={cn(
                   "h-24 w-24 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-1000",
                   level.bg, level.border, level.color
                 )}>
                    <Award className="h-10 w-10 mb-1" />
                    <span className="text-[8px] font-black tracking-widest">{level.label}</span>
                 </div>
              </div>
              <h1 className="text-4xl font-black tracking-[0.2em] text-white uppercase font-headline">
                 Certificado de Mérito
              </h1>
              <div className={cn("h-1 w-32 mx-auto", level.bg.replace('bg-', 'bg-').replace('/10', ''))} />
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500 font-bold mt-2">Nexus RH Intelligence // Sovereign System</p>
           </div>

           {/* Main Body */}
           <div className="space-y-6">
              <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">Concedido com honras ao colaborador</p>
              <h2 className="text-5xl font-black text-white font-headline uppercase tracking-tight">
                {employee?.name}
              </h2>
              <p className="text-lg text-primary font-bold uppercase tracking-widest">
                {employee?.role} // {employee?.department}
              </p>
           </div>

           {/* Stats Grid */}
           <div className="w-full max-w-2xl grid grid-cols-5 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="space-y-2">
                   <div className="h-12 w-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <s.icon className="h-5 w-5 text-primary/60" />
                   </div>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{s.label}</p>
                   <div className="flex justify-center gap-0.5">
                      {[1,2,3,4,5].map(star => (
                        <div key={star} className={cn("h-1.5 w-1.5 rounded-full", star <= s.value ? "bg-primary" : "bg-white/10")} />
                      ))}
                   </div>
                </div>
              ))}
           </div>

           {/* Score Section */}
           <div className="flex items-center gap-12 mt-4">
              <div className="text-left">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Índice IMN Final</p>
                 <p className="text-6xl font-black text-white tracking-tighter">{(stats.reduce((a, b) => a + b.value, 0) / 5 * 2).toFixed(1)}</p>
              </div>
              <div className="h-20 w-[1px] bg-white/10" />
              <div className="text-left space-y-4">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Auditado pela Djeny IA</span>
                 </div>
                 <div className="space-y-1">
                    <div className="h-px w-32 bg-white/20" />
                    <p className="text-[9px] text-slate-500 uppercase font-black">Chancela Nexus Sovereign</p>
                 </div>
              </div>
           </div>

           {/* Footer Footer */}
           <div className="w-full flex justify-between items-end opacity-40">
              <p className="text-[10px] text-slate-500 font-bold uppercase">ID Cert: NEX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
           </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24 mt-12 print:hidden">
        <LegalSafeguard module="ENGENHARIA DE MÉRITO — CERTIFICADO" protocol="NX-MER-CERT-01" />
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          div[ref="certificateRef"], div[ref="certificateRef"] * {
            visibility: visible;
          }
          div[ref="certificateRef"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
