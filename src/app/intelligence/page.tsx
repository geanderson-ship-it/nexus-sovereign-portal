'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Wheat, Paintbrush, Building2, Users, BrainCircuit, Zap, Database, Activity, HeartPulse, Cpu, Hammer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { AnimatePresence } from 'framer-motion';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';


const segments = [
  {
    id: 'empresas',
    icon: Building2,
    label: 'GOVERNANÇA CORPORATIVA & INDÚSTRIA',
    title: 'Nexus Corporate Suite',
    slogan: 'A espinha dorsal das indústrias de alta performance.',
    description: 'A suíte definitiva para B2B. Operações industriais, cadeia de suprimentos, manufatura, auditoria e inteligência estratégica.',
    color: 'cyan',
    href: '/nexus-empresas',
    image: '/Nexus Empresas/Nexus Empresas prata.png',
    products: ['Vendas', 'Compras', 'PPCP', 'Auditor', 'Cronoanálise', 'Almoxarifado', 'Expedição', 'RH & Pessoas', 'Estratégia', 'Engenharia', 'Qualidade'],
    badge: 'B2B_INTELLIGENCE',
    available: true,
  },
  {
    id: 'agronegocio',
    icon: Wheat,
    label: 'AGRO-INTELIGÊNCIA DE PRECISÃO',
    title: 'Ecossistema Dante Safra',
    slogan: 'Inteligência e precisão. Máxima produtividade em cada safra.',
    description: 'Inteligência aplicada ao campo. Do planejamento da safra à cotação de commodities em tempo real.',
    color: 'emerald',
    href: '/agro',
    image: '/Nexus Intelligence Agro/Nexus Intelligence Agro.png',
    products: ['Dante Safra Standard', 'Dante Safra Axis'],
    badge: 'AGRO_INTELLIGENCE',
    available: true,
  },

  {
    id: 'health',
    icon: HeartPulse,
    label: 'MEDICINA DE PRECISÃO',
    title: 'Nexus Bio-Intelligence',
    slogan: 'Antecipação e diagnóstico precoce. A inteligência que salva vidas.',
    description: 'IA Médica White-label. Triagem avançada, monitoramento e protocolos preventivos. A instituição pode denominar a IA a seu gosto.',
    color: 'teal',
    href: '/intelligence/health',
    image: '/Nexus Intelligence Health(saúde)/Nexus Intelligence Healt com slogan.png',
    products: ['Triagem IA', 'Protocolo Médico', 'Prevenção'],
    badge: 'HEALTH_INTELLIGENCE',
    available: true,
  },
  {
    id: 'studio',
    icon: Activity,
    label: 'BROADCAST & MÍDIA DE MASSA',
    title: 'Nexus Automation',
    slogan: 'A evolução da tecnologia em comunicações. O controle absoluto da sua mídia.',
    description: 'Automação inteligente para transmissão e gestão de mídia. O cockpit definitivo para sua estação de rádio.',
    color: 'blue',
    href: '/intelligence/studio',
    image: '/Nexus Intelligence Studio/Nexus studio chumbo.png',
    products: ['Broadcast Automator', 'Media Manager', 'Live Data Feed'],
    badge: 'MEDIA_AUTOMATION',
    available: true,
  },
  {
    id: 'premium',
    icon: BrainCircuit,
    label: 'ALTA PERFORMANCE & HIGH-TICKET',
    title: 'Nexus Premium',
    slogan: 'O ápice do intelecto. Onde líderes forjam lendas.',
    description: 'Nível máximo de inteligência executiva. IAs soberanas moldadas para escalar operações milionárias e acelerar a tomada de decisão.',
    color: 'violet',
    href: '/intelligence/premium',
    image: '/Nexus Intelligence Premium/Nexus premium.png',
    products: ['Maga Dot', 'Orion', 'Pactum', 'Égide'],
    badge: 'VIP_ACCESS',
    available: true,
  },
];

const frozenSegments = [
  {
    id: 'design',
    icon: Paintbrush,
    label: 'CRIAÇÃO & ESTÉTICA',
    title: 'Nexus Design AI',
    slogan: 'A estética perfeita moldando o amanhã.',
    description: 'Motor de geração gráfica avançada, modelagem paramétrica e criação de interfaces. Atualmente em implantação de infraestrutura cloud.',
    color: 'cyan',
    href: '#',
    image: '/Nexus Intelligence Design/Nexus Intelligence Design.png',
    products: ['Vector AI', 'UI/UX Automator'],
    badge: 'FROZEN',
    available: false,
  },
  {
    id: 'projetos',
    icon: Hammer,
    label: 'ARQUITETURA & ENGENHARIA',
    title: 'Dante Builder',
    slogan: 'A arquitetura de infraestruturas implacáveis.',
    description: 'Gestão de obras pesadas, cálculo estrutural preditivo e gestão de empreiteiras. Integrado à matriz Nexus. Congelado até Q4.',
    color: 'cyan',
    href: '#',
    image: '/Nexus Empresas/Nexus Empresas prata.png',
    products: ['Structural AI', 'Heavy Management'],
    badge: 'FROZEN',
    available: false,
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

      {/* BACKGROUND IMAGE HERO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/lideranca-estrategica.png"
          alt="Nexus Intelligence Background"
          fill
          priority
          className="object-cover opacity-40"
          style={{ objectPosition: 'center 20%' }}
        />
        {/* Dark overlays to keep the cyberpunk feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-[#020617]/60 to-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08)_0%,transparent_60%)]" />
        {/* Ambient orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-pink-900/5 rounded-full blur-[100px]" />
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:35px_35px] opacity-30" />
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

        <div className="flex flex-col gap-10 max-w-6xl mx-auto">
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
                  'relative rounded-[40px] overflow-hidden border bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row group transition-all duration-500 hover:-translate-y-2',
                  c.border, c.glow,
                  !seg.available && 'opacity-60'
                )}
              >
                {/* LADO DA IMAGEM */}
                <div className="relative w-full md:w-5/12 h-64 md:h-auto overflow-hidden bg-gradient-to-br from-slate-900 to-transparent border-b md:border-b-0 md:border-r border-white/5 group-hover:bg-slate-800/30 transition-colors duration-500">
                  {seg.image ? (
                    <Image
                      src={seg.image}
                      alt={seg.title}
                      fill
                      className="object-contain p-8 md:p-12 transition-transform duration-[2s] group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-10">
                      <seg.icon className="h-24 w-24" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 z-20">
                    <Badge className={`${c.badge} text-white border-none px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase`}>
                      {seg.badge}
                    </Badge>
                  </div>
                  {!seg.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                      <Badge className="bg-white/10 text-white border-white/20 text-sm font-black uppercase tracking-widest px-6 py-2 backdrop-blur-md">Em Breve</Badge>
                    </div>
                  )}
                </div>

                {/* LADO DO CONTEÚDO */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center gap-6 relative z-20">
                  {/* CABEÇALHO */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded-xl flex-shrink-0', c.bg)}>
                        <seg.icon className={cn('h-5 w-5', c.text)} />
                      </div>
                      <span className={cn('text-[10px] font-black uppercase tracking-[0.3em] line-clamp-1', c.text)}>{seg.label}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">{seg.title}</h3>
                      {seg.slogan && (
                        <p className={cn('text-lg md:text-xl font-light italic mt-2 tracking-wide', c.text)}>{seg.slogan}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">{seg.description}</p>

                  {/* PRODUTOS */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seg.products.map((p, pi) => (
                      <span key={pi} className={cn('text-[11px] font-bold px-3 py-1.5 rounded-lg border', c.bg, c.border, c.text)}>
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-4">
                    {seg.available ? (
                      <Button asChild className={cn('w-full md:w-auto rounded-2xl font-black uppercase tracking-widest h-14 px-10', c.btn)}>
                        <Link href={seg.href} className="flex items-center justify-center gap-2">
                          Explorar Módulo <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="w-full md:w-auto rounded-2xl font-black uppercase tracking-widest h-14 px-10 bg-white/5 text-white/30 border border-white/10">
                        Em Breve
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* NOVO CARD: PRODUTO SOB MEDIDA (Movido para cá) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[40px] overflow-hidden border border-amber-500/30 bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row group shadow-[0_0_80px_rgba(245,158,11,0.05)] mt-12"
          >
            {/* LADO DA IMAGEM */}
            <div className="relative w-full md:w-5/12 h-64 md:h-auto overflow-hidden bg-zinc-950 border-b md:border-b-0 md:border-r border-white/5">
              <Image
                src="/assets/custom-ai-v4.png"
                alt="IA Sob Medida"
                fill
                className="object-cover transition-transform duration-[3s] group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-6 left-6 z-20">
                <Badge className="bg-amber-500/20 text-amber-500 border-none px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
                  Custom AI
                </Badge>
              </div>
            </div>

            {/* LADO DO CONTEÚDO */}
            <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center gap-6 relative z-20">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl flex-shrink-0 bg-amber-500/10 text-amber-500">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Bespoke Intelligence</span>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">Produto Sob Medida</h3>
                  <p className="text-lg md:text-xl font-light italic mt-2 tracking-wide text-amber-400/80">O poder de forjar a sua própria lenda.</p>
                </div>
              </div>

              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                Não encontrou a inteligência artificial perfeita para a sua operação monumental? Nós criamos. Uma rede neural arquitetada do zero, com o DNA da sua empresa, para solucionar o seu gargalo mais complexo.
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-500">LLM Privado</span>
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-500">Hardware Dedicado</span>
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-500">Soberania Total</span>
              </div>

              <div className="mt-4">
                <Button asChild className="w-full md:w-auto rounded-2xl font-black uppercase tracking-widest h-14 px-10 bg-amber-500 hover:bg-amber-400 text-black">
                  <Link href="#" className="flex items-center justify-center gap-2">
                    Falar com Engenharia <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>


        </div>

        {/* SEÇÃO EM DESENVOLVIMENTO (CONGELADOS) */}
        <div className="mt-32 max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Módulos sob Suspensão Temporária
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Em <span className="text-cyan-400">Desenvolvimento</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Módulos de geração de imagens temporariamente suspensos aguardando a liberação de novos recursos de IA na nuvem AWS.
            </p>
          </div>

          <div className="flex flex-col gap-10 max-w-4xl mx-auto">
            {frozenSegments.map((seg, i) => {
              const c = colorMap[seg.color];
              return (
                <motion.div
                  key={seg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-[40px] overflow-hidden border border-cyan-500/20 bg-slate-950/40 backdrop-blur-xl flex flex-col md:flex-row group transition-all duration-500 shadow-[0_0_50px_rgba(6,182,212,0.05)]"
                >
                  {/* LADO DA IMAGEM DESATURADA */}
                  <div className="relative w-full md:w-5/12 h-64 md:h-auto overflow-hidden bg-gradient-to-br from-slate-950 to-transparent border-b md:border-b-0 md:border-r border-white/5 opacity-40 grayscale filter blur-[0.5px]">
                    {seg.image ? (
                      <Image
                        src={seg.image}
                        alt={seg.title}
                        fill
                        className="object-contain p-8 animate-[pulse_8s_ease-in-out_infinite]"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full opacity-10">
                        <seg.icon className="h-20 w-20" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6 z-20">
                      <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[8px] font-black tracking-[0.2em] uppercase">
                        {seg.badge}
                      </Badge>
                    </div>
                    {/* OVERLAY CONGELADO / NEVE */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-transparent to-transparent pointer-events-none z-10" />
                  </div>

                  {/* LADO DO CONTEÚDO */}
                  <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center gap-6 relative z-20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex-shrink-0">
                        <seg.icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 line-clamp-1">{seg.label}</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2 leading-none">
                        {seg.title}
                      </h3>
                      {seg.slogan && (
                        <p className="text-lg md:text-xl font-light italic text-cyan-400/80 tracking-wide">{seg.slogan}</p>
                      )}
                      <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black tracking-wider uppercase w-fit mt-3">
                        Aguardando IA AWS
                      </Badge>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed">{seg.description}</p>

                    {/* PRODUTOS */}
                    <div className="flex flex-wrap gap-2 mt-2 opacity-55">
                      {seg.products.map((p, pi) => (
                        <span key={pi} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-cyan-500/10 bg-cyan-500/5 text-cyan-400">
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* CTA DESABILITADO */}
                    <Button disabled className="w-full md:w-auto rounded-2xl font-black uppercase tracking-widest h-14 px-8 mt-4 bg-slate-900/50 text-slate-500 border border-slate-800 cursor-not-allowed">
                      Módulo Suspenso
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>



        <div className="max-w-7xl mx-auto px-6 pb-24">
          <LegalSafeguard module="NEXUS GLOBAL" protocol="NX-CORE-00" />
        </div>
      </section>
    </div>
  );
}
