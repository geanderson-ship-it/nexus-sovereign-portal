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
    <div className="mt-16 p-8 md:p-10 rounded-[32px] bg-gradient-to-br from-[#0a0f18] to-[#111a2a] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-8 print:hidden relative overflow-hidden z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-amber-500/60" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-gray-400 italic drop-shadow-md">Proteção Jurídica & Memorial Técnico</h2>
        </div>
        <Badge variant="outline" className="border-amber-500/30 text-amber-500/80 font-mono text-[10px] px-4 py-1.5 bg-black/50 backdrop-blur-sm">
          {module} — PROTOCOLO {protocol}
        </Badge>
      </div>

      <div className="p-8 rounded-[24px] bg-black/60 border border-amber-500/20 flex flex-col md:flex-row gap-8 items-center shadow-inner relative z-10">
        <div className="bg-amber-600/10 p-4 rounded-2xl border border-amber-500/10">
          <Scale className="h-8 w-8 text-amber-500 drop-shadow-md" />
        </div>
        <div className="space-y-3 flex-1">
          <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 drop-shadow-md">
            <AlertTriangle className="h-4 w-4" /> Salvaguarda Nexus — Aviso de Responsabilidade
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed italic drop-shadow-sm font-medium">
            {customMessage ? `"${customMessage}"` : '"Esta Inteligência Artificial é uma ferramenta de suporte e auxílio à decisão. Todos os dados, cálculos e programações sugeridos devem ser obrigatoriamente revisados e validados pelo responsável humano antes da execução em ambiente fabril ou comercial. A decisão final e a responsabilidade operacional são soberanas ao julgamento técnico do Líder de Setor e Gestoria Responsável."'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 opacity-40 hidden md:flex">
          <p className="text-[9px] font-mono uppercase text-gray-400 tracking-widest text-right">Security Code: {protocol}</p>
          <p className="text-[9px] font-mono uppercase text-amber-500 tracking-widest text-right">Audit: VALIDATED BY NEXUS OS</p>
        </div>
      </div>
    </div>
  );
}
