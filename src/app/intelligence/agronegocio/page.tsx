'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wheat, Zap, Database, CloudRain, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useLocale } from '@/hooks/use-locale';
import * as gtag from '@/lib/gtag';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

export default function AgronegocioPage() {
  const { user } = useUser();
  const { t } = useLocale();
  const isAdmin = isAdminUser(user);

  return (
    <SovereignShowcase moduleName="Nexus Agronegócio" imagePath="/Nexus Intelligence Agro/Nexus Intelligence Agro.png">
      <div className="w-full min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/8 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto py-16 px-4">
        {/* BACK */}
        <Link href="/intelligence" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-12 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold uppercase tracking-widest">Intelligence Hub</span>
        </Link>

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Wheat className="h-10 w-10 text-emerald-400" />
            </div>
          </div>
          <Badge className="bg-emerald-600 text-white border-none px-6 py-1.5 text-[10px] font-black tracking-[0.3em] uppercase mb-6">AGRO_INTELLIGENCE</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white">
            NEXUS <span className="text-emerald-400">AGRONEGÓCIO</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
            Inteligência aplicada ao campo. Do planejamento da safra à cotação de commodities em tempo real.
          </p>
        </motion.div>

        <div className="space-y-16 max-w-6xl mx-auto">
          {/* DANTE SAFRA STANDARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full rounded-[48px] overflow-hidden border border-emerald-500/10 bg-slate-900/20 backdrop-blur-3xl shadow-2xl group border-dashed"
          >
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              <div className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
                <Image src="https://i.postimg.cc/FF8yZyFQ/dante-safra.jpg" alt="Dante Safra Standard" fill className="object-contain p-4 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/40" />
                <div className="absolute top-8 left-8">
                  <Badge className="bg-blue-600/50 text-white border-none px-4 py-1.5 text-[8px] font-black tracking-[0.2em] uppercase">STANDARD_ACCESS</Badge>
                </div>
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">{t('intelligence.danteSafra.standard.title')}</h2>
                    <p className="text-[10px] font-bold text-emerald-500 tracking-[0.4em] uppercase mt-2">{t('intelligence.danteSafra.standard.subtitle')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] mb-1">{t('intelligence.danteSafra.economy.title')}</h4>
                      <div className="text-slate-400 text-[10px] leading-relaxed">
                        {t('intelligence.danteSafra.economy.text').split('**').map((part, i) => (
                          i % 2 === 1 ? <strong key={i} className="text-blue-400 font-black">{part}</strong> : part
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] mb-1">{t('intelligence.danteSafra.production.title')}</h4>
                      <div className="text-slate-400 text-[10px] leading-relaxed">
                        {t('intelligence.danteSafra.production.text').split('**').map((part, i) => (
                          i % 2 === 1 ? <strong key={i} className="text-emerald-400 font-bold">{part}</strong> : part
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 justify-center w-full mt-8">
                    <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500 h-16 sm:h-20 w-full max-w-lg mx-auto rounded-2xl font-black uppercase tracking-widest text-base sm:text-xl border-2 border-emerald-400/50 shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all hover:scale-105">
                      <Link href="/intelligence/dante-safra">ACESSAR TERMINAL</Link>
                    </Button>
                    <Button asChild className="bg-transparent text-emerald-400 border-2 border-emerald-500/50 hover:bg-emerald-500/10 h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wide text-xs sm:text-sm flex-1 max-w-xs"
                      onClick={() => gtag.event({ action: 'contact_click', category: 'engagement', label: 'consultant_dante_standard' })}>
                      <Link href="/contact" target="_blank">FALAR COM CONSULTOR</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* DANTE SAFRA AXIS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full rounded-[48px] overflow-hidden border border-emerald-500/30 bg-slate-900/60 backdrop-blur-3xl shadow-[0_0_80px_rgba(16,185,129,0.1)] group"
          >
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
                <Image src="https://i.postimg.cc/65ZnxtG5/Dante-safra-axis.png" alt="Dante Safra Axis Premium" fill className="object-contain transition-transform duration-[2s] group-hover:scale-105 p-4" priority />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent lg:hidden" />
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                  <Badge className="bg-emerald-600 text-white border-none px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg animate-pulse">AXIS_TACTICAL_TERMINAL</Badge>
                  <div className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
                    <Zap className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                      DANTE SAFRA <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">AXIS</span>
                    </h2>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-[2px] w-12 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-bold text-emerald-400 tracking-[0.4em] uppercase">{t('intelligence.danteSafra.axis.subtitle')}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-lg font-medium italic opacity-90 border-l-2 border-emerald-500/30 pl-6">
                    "{t('intelligence.danteSafra.why.text')}"
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-4"><Database className="h-5 w-5 text-emerald-400" /></div>
                      <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{t('intelligence.danteSafra.axis.economy.title')}</h4>
                      <div className="text-slate-400 text-xs leading-relaxed font-medium">
                        {t('intelligence.danteSafra.axis.economy.text').split('**').map((part, i) => (
                          i % 2 === 1 ? <strong key={i} className="text-emerald-400 font-black">{part}</strong> : part
                        ))}
                      </div>
                    </div>
                    <div className="p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-4"><CloudRain className="h-5 w-5 text-emerald-400" /></div>
                      <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{t('intelligence.danteSafra.axis.production.title')}</h4>
                      <div className="text-slate-400 text-xs leading-relaxed font-medium">
                        {t('intelligence.danteSafra.axis.production.text').split('**').map((part, i) => (
                          i % 2 === 1 ? <strong key={i} className="text-emerald-400 font-black">{part}</strong> : part
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 justify-center w-full mt-10">
                    <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-600 h-16 sm:h-20 w-full max-w-lg mx-auto rounded-2xl font-black uppercase tracking-widest text-base sm:text-xl border-2 border-emerald-400/50 shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all hover:scale-105">
                      <Link href="/intelligence/dante-safra">ACESSAR TERMINAL</Link>
                    </Button>
                    <Button asChild className="bg-transparent text-emerald-400 border-2 border-emerald-500/50 hover:bg-emerald-500/10 h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wide text-xs sm:text-sm flex-1 max-w-xs"
                      onClick={() => gtag.event({ action: 'contact_click', category: 'engagement', label: 'consultant_dante_axis' })}>
                      <Link href="/contact" target="_blank">FALAR COM CONSULTOR</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-24 mt-12">
          <LegalSafeguard module="NEXUS AGRONEGÓCIO" protocol="NX-AGRO-01" />
        </div>
      </div>
      </div>
    </SovereignShowcase>
  );
}
