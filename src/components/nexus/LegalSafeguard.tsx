'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LegalSafeguardProps {
  module?: string;
  protocol?: string;
  customMessage?: string;
}

export function LegalSafeguard({ module = 'NEXUS INTELLIGENCE', protocol = 'NX-9982-IA', customMessage }: LegalSafeguardProps) {
  return (
    <div className="pt-16 mt-16 space-y-10 border-t border-amber-500/10 print:hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-amber-500/40" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-gray-500 italic">Proteção Jurídica & Memorial Técnico</h2>
        </div>
        <Badge variant="outline" className="border-amber-500/20 text-amber-500/60 font-mono text-[9px] px-4 py-1">
          {module} — PROTOCOLO {protocol}
        </Badge>
      </div>

      <div className="p-8 rounded-[40px] bg-amber-500/5 border border-amber-500/20 flex flex-col md:flex-row gap-8 items-center shadow-inner">
        <div className="bg-amber-600/20 p-4 rounded-[24px]">
          <Scale className="h-8 w-8 text-amber-500" />
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="h-3 w-3" /> Salvaguarda Nexus — Aviso de Responsabilidade
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed italic">
            {customMessage ? `"${customMessage}"` : '"Esta Inteligência Artificial é uma ferramenta de suporte e auxílio à decisão. Todos os dados, cálculos e programações sugeridos devem ser obrigatoriamente revisados e validados pelo responsável humano antes da execução em ambiente fabril ou comercial. A decisão final e a responsabilidade operacional são soberanas ao julgamento técnico do Líder de Setor e Gestoria Responsável."'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 opacity-30 hidden md:flex">
          <p className="text-[9px] font-mono uppercase text-gray-500 tracking-widest text-right">Security Code: {protocol}</p>
          <p className="text-[9px] font-mono uppercase text-gray-500 tracking-widest text-right">Audit: VALIDATED BY NEXUS OS</p>
        </div>
      </div>
    </div>
  );
}
