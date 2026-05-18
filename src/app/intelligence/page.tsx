'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Wheat, Paintbrush, Building2, Users, BrainCircuit, Zap, Database, Activity, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { AnimatePresence } from 'framer-motion';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';


const segments = [
  {
    id: 'agronegocio',
    icon: Wheat,
    label: 'AGRONEGÓCIO',
    title: 'Agronegócio',
    description: 'Inteligência aplicada ao campo. Do planejamento da safra à cotação de commodities em tempo real.',
    color: 'emerald',
    href: '/intelligence/agronegocio',
    image: '/Nexus Intelligence Agro/Nexus Intelligence Agro.png',
    products: ['Dante Safra Standard', 'Dante Safra Axis'],
    badge: 'AGRO_INTELLIGENCE',
    available: true,
  },
  {
    id: 'design',
    icon: Paintbrush,
    label: 'DESIGN & INTERIORES',
    title: 'Design & Interiores',
    description: 'IA generativa para ambientação, showrooms e identidade visual. Do conceito à imagem em segundos.',
    color: 'pink',
    href: '/intelligence/design',
    image: '/Nexus Intelligence Design/Nexus Intelligence Design.png',
    products: ['Djeny Design Personal', 'Djeny Design Business'],
    badge: 'DESIGN_INTELLIGENCE',
    available: true,
  },
  {
    id: 'empresas',
    icon: Building2,
    label: 'EMPRESAS & INDÚSTRIA',
    title: 'Nexus Empresas',
    description: 'Suite completa de IA para operações industriais. Compras, engenharia, produção e auditoria.',
    color: 'cyan',
    href: '/nexus-empresas',
    hrefPpcp: '/intelligence/ppcp',
    image: '/Nexus Empresas/Nexus Empresas prata.png',
    products: ['Nexus Vendas', 'Nexus Compras', 'Nexus Builder', 'Nexus PPCP', 'Nexus Auditor'],
    badge: 'B2B_INTELLIGENCE',
    available: true,
  },
  {
    id: 'rh',
    icon: Users,
    label: 'RH & PESSOAS',
    title: 'RH & Pessoas',
    description: 'Gestão de talentos, avaliação de desempenho e desenvolvimento humano com inteligência artificial.',
    color: 'amber',
    href: '/intelligence/rh',
    image: '/Nexus Intelligence RH/Nexus Intelligence RH.png',
    products: ['Djeny RH', 'Treinamento e Integração'],
    badge: 'HR_INTELLIGENCE',
    available: true,
  },
  {
    id: 'estrategia',
    icon: BrainCircuit,
    label: 'ESTRATÉGIA & LIDERANÇA',
    title: 'Estratégia & Liderança',
    description: 'Mentoria executiva, career advisor e inteligência estratégica para líderes de alta performance.',
    color: 'violet',
    href: '/intelligence/estrategia',
    image: '/Nexus Intelligence Estratégia e liderança/Nexus Intelligence estratégia e liderança.png',
    products: ['Career Advisor', 'Dante Estratégico', 'Djeny Comercial'],
    badge: 'STRATEGY_INTELLIGENCE',
    available: true,
  },
  {
    id: 'pactum',
    icon: Shield,
    label: 'NEGOCIAÇÃO & CONTRATOS',
    title: 'Nexus Pactum',
    description: 'Inteligência para acordos de alto valor. Detecção de blefe por biometria e auditoria de vulnerabilidade em contratos.',
    color: 'blue',
    href: '/intelligence/pactum',
    image: '/Nexus Pactum/Nexus intelligence Pactum.png',
    products: ['Deal War Room', 'Pactum Auditor', 'Deal Simulator'],
    badge: 'DEAL_INTELLIGENCE',
    available: true,
  },
  {
    id: 'engenharia',
    icon: Database,
    label: 'ENGENHARIA DE PROCESSOS',
    title: 'Engenharia de Processos',
    description: 'O Banco de Dados Master da fábrica. Onde os tempos auditados do Dante encontram o planejamento do PPCP.',
    color: 'amber',
    href: '/intelligence/engenharia',
    image: '/Nexus Intelligence Engenharia/Nexus intelligence Engenharia.png',
    products: ['Banco de Tempos Auditados', 'Cálculo de Capacidade 53 min'],
    badge: 'ENGINEERING_DATA',
    available: true,
  },
  {
    id: 'studio',
    icon: Activity,
    label: 'BROADCAST & MÍDIA',
    title: 'Nexus Studio',
    description: 'Automação inteligente para transmissão e gestão de mídia. O cockpit definitivo para sua estação de rádio.',
    color: 'blue',
    href: '/intelligence/studio',
    image: '/Nexus Intelligence Studio/Nexus studio chumbo.png',
    products: ['Broadcast Automator', 'Media Manager', 'Live Data Feed'],
    badge: 'MEDIA_AUTOMATION',
    available: true,
  },
  {
    id: 'health',
    icon: HeartPulse,
    label: 'SAÚDE & BEM-ESTAR',
    title: 'Nexus Health',
    description: 'Inteligência artificial aplicada à saúde. Monitoramento clínico, protocolos preventivos e gestão de bem-estar com precisão diagnóstica.',
    color: 'teal',
    href: '/intelligence/health',
    image: '/Nexus Intelligence Health(saúde)/Nexus Intelligence Healt com slogan.png',
    products: ['Diagnóstico Preventivo', 'Monitor Clínico', 'Protocolo IA'],
    badge: 'HEALTH_INTELLIGENCE',
    available: true,
  },
];

const colorMap: Record<string, { border: string; text: string; bg: string; badge: string; glow: string; btn: string }> = {
  emerald: { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/5',   badge: 'bg-emerald-600', glow: 'shadow-[0_0_60px_rgba(16,185,129,0.1)]',  btn: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
  pink:    { border: 'border-pink-500/30',    text: 'text-pink-400',    bg: 'bg-pink-500/5',     badge: 'bg-pink-600',    glow: 'shadow-[0_0_60px_rgba(219,39,119,0.1)]', btn: 'bg-pink-600 hover:bg-pink-500 text-white' },
  cyan:    { border: 'border-cyan-500/30',    text: 'text-cyan-400',    bg: 'bg-cyan-500/5',     badge: 'bg-cyan-600',    glow: 'shadow-[0_0_60px_rgba(34,211,238,0.1)]', btn: 'bg-cyan-600 hover:bg-cyan-500 text-white' },
  amber:   { border: 'border-amber-500/30',   text: 'text-amber-400',   bg: 'bg-amber-500/5',    badge: 'bg-amber-600',   glow: 'shadow-[0_0_60px_rgba(245,158,11,0.1)]', btn: 'bg-amber-600 hover:bg-amber-500 text-white' },
  violet:  { border: 'border-violet-500/30',  text: 'text-violet-400',  bg: 'bg-violet-500/5',   badge: 'bg-violet-600',  glow: 'shadow-[0_0_60px_rgba(139,92,246,0.1)]', btn: 'bg-violet-600 hover:bg-violet-500 text-white' },
  blue:    { border: 'border-blue-500/30',    text: 'text-blue-400',    bg: 'bg-blue-500/5',     badge: 'bg-blue-600',    glow: 'shadow-[0_0_60px_rgba(37,99,235,0.1)]',  btn: 'bg-blue-600 hover:bg-blue-500 text-white' },
  teal:    { border: 'border-teal-500/30',    text: 'text-teal-400',    bg: 'bg-teal-500/5',     badge: 'bg-teal-600',    glow: 'shadow-[0_0_60px_rgba(20,184,166,0.1)]',  btn: 'bg-teal-600 hover:bg-teal-500 text-white' },
};

export default function IntelligencePage() {
  const { user } = useUser();
  const isAdmin = isAdminUser(user);

  return (
    <div className="w-full min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">



      {/* AMBIENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-pink-900/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-[#020617]" />
      </div>

      {/* HERO */}
      <div className="relative z-10 container mx-auto py-24 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-headline text-white uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            NEXUS <span className="text-blue-500">INTELLIGENCE</span>
          </h1>
          <h2 className="mt-6 text-xl md:text-2xl font-medium text-slate-400 max-w-4xl mx-auto tracking-widest uppercase">
            Engenharia de Elite: Onde o Futuro se Torna Funcional.
          </h2>



          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-blue-500/50" />
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1 tracking-widest font-mono text-[10px]">STRATEGIC_OS_v5.0</Badge>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-blue-500/50" />
          </div>
        </motion.div>


      </div>

      {/* SEGMENTOS */}
      <section className="relative z-10 container mx-auto px-4 pb-32">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Escolha seu <span className="text-blue-500">Segmento</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Cada segmento reúne os produtos de IA desenvolvidos para o seu setor. Selecione e explore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {segments.map((seg, i) => {
            const c = colorMap[seg.color];
            return (
              <motion.div
                key={seg.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  'relative rounded-[40px] overflow-hidden border bg-slate-900/60 backdrop-blur-xl flex flex-col group transition-all duration-500 hover:-translate-y-2',
                  c.border, c.glow,
                  !seg.available && 'opacity-60'
                )}
              >
                {/* IMAGEM */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-900 to-transparent">
                  {seg.image ? (
                    <Image
                      src={seg.image}
                      alt={seg.title}
                      fill
                      className="object-contain p-6 transition-transform duration-[2s] group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-10">
                      <seg.icon className="h-24 w-24" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className={`${c.badge} text-white border-none px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase`}>
                      {seg.badge}
                    </Badge>
                  </div>
                  {!seg.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-white/10 text-white border-white/20 text-sm font-black uppercase tracking-widest px-6 py-2">Em Breve</Badge>
                    </div>
                  )}
                </div>

                {/* CONTEÚDO */}
                <div className="p-8 flex flex-col flex-1 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-xl', c.bg)}>
                      <seg.icon className={cn('h-5 w-5', c.text)} />
                    </div>
                    <span className={cn('text-[10px] font-black uppercase tracking-[0.3em]', c.text)}>{seg.label}</span>
                  </div>

                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{seg.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{seg.description}</p>

                  {/* PRODUTOS */}
                  <div className="flex flex-wrap gap-2">
                    {seg.products.map((p, pi) => (
                      <span key={pi} className={cn('text-[10px] font-bold px-2 py-1 rounded-lg border', c.bg, c.border, c.text)}>
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {seg.available ? (
                    <Button asChild className={cn('w-full rounded-2xl font-black uppercase tracking-widest h-12 mt-2', c.btn)}>
                      <Link href={seg.href} className="flex items-center justify-center gap-2">
                        Explorar <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full rounded-2xl font-black uppercase tracking-widest h-12 mt-2 bg-white/5 text-white/30 border border-white/10">
                      Em Breve
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* CARD CUSTOM */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: segments.length * 0.08 }}
            className="relative rounded-[40px] overflow-hidden border-2 border-dashed border-white/10 bg-white/0 flex flex-col items-center justify-center p-12 text-center gap-6 group hover:border-blue-500/30 transition-all duration-500"
          >
            <div className="p-4 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-black uppercase tracking-[0.3em] text-lg">Produto Sob Medida</p>
              <p className="text-slate-500 text-sm mt-2">Precisa de uma IA específica para o seu negócio? Desenvolvemos sob demanda.</p>
            </div>
            <Button asChild variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-2xl font-black uppercase tracking-widest">
              <Link href="/contact?subject=ia-customizada">Falar com Consultor</Link>
            </Button>
          </motion.div>


        </div>
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <LegalSafeguard module="NEXUS GLOBAL" protocol="NX-CORE-00" />
        </div>
      </section>
    </div>
  );
}
