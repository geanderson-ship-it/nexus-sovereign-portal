'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PharmaPage() {
  return (
    <div className="w-full min-h-screen bg-[#060709] text-slate-200 relative overflow-hidden flex flex-col">
      {/* HEADER / NAVIGATION */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-emerald-500/20 shadow-[0_4px_30px_rgba(16,185,129,0.1)]">
        <Link 
          href="/nexus-b2b" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-mono text-[10px] md:text-xs tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-sm w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Nexus B2B
        </Link>
        <div className="text-emerald-500 font-black uppercase tracking-[0.2em] text-xs md:text-sm">
          Nexus Pharma <span className="text-white">// Integration</span>
        </div>
      </div>

      {/* IFRAME WRAPPER */}
      <div className="flex-1 w-full relative bg-black">
        <iframe 
          src="https://nexus-pharma-delta.vercel.app" 
          className="w-full h-full border-none absolute inset-0"
          title="Nexus Pharma Application"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
