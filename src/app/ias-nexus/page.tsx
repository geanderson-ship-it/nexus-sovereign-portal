'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLocale } from '@/hooks/use-locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const IAsNexusPage = () => {
  const { t } = useLocale();

  const personas = [
    {
      id: 'maga',
      name: 'Magadot',
      role: t('ias.maga.role'),
      description: t('ias.maga.desc'),
      image: '/maga-avatar-premium.png',
      link: '/intelligence/maga-os',
      color: 'from-rose-500/20 to-purple-500/20',
      hoverGlow: 'from-rose-500/40 to-purple-500/40',
      hoverBorder: 'group-hover:border-rose-500/50'
    },
    {
      id: 'orion',
      name: 'Orion',
      role: t('ias.orion.role'),
      description: t('ias.orion.desc'),
      image: '/orion-avatar-premium.png',
      link: '/intelligence/orion-os',
      color: 'from-slate-500/20 to-blue-500/20',
      hoverGlow: 'from-blue-500/40 to-slate-500/40',
      hoverBorder: 'group-hover:border-blue-500/50'
    },
    {
      id: 'dante',
      name: 'Dante',
      role: t('ias.dante.role'),
      description: t('ias.dante.desc'),
      image: '/IAs Nexus/Dante - mentor.png',
      link: '/intelligence/dante-safra',
      color: 'from-amber-500/20 to-orange-500/20',
      hoverGlow: 'from-amber-500/40 to-orange-500/40',
      hoverBorder: 'group-hover:border-amber-500/50'
    },
    {
      id: 'djeny',
      name: 'Djeny',
      role: t('ias.djeny.role'),
      description: t('ias.djeny.desc'),
      image: '/IAs Nexus/Djeny - mentora.png',
      link: '/djeny-design',
      color: 'from-cyan-500/20 to-emerald-500/20',
      hoverGlow: 'from-cyan-500/40 to-emerald-500/40',
      hoverBorder: 'group-hover:border-cyan-500/50'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 relative">

      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-agenda-bg.png"
          alt="Nexus IAs Background"
          fill
          priority
          className="object-cover opacity-40"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Impactful glassmorphism title card */}
          <div className="relative inline-block rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md px-10 py-10 md:px-16 md:py-12 shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden max-w-5xl mx-auto">
            {/* Top glow line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/50" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/50" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/30" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary/30" />
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.04)_0%,transparent_70%)] pointer-events-none" />

            <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-gray-500 [text-shadow:none]">
              {t('ias.title')}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto italic">
              {t('ias.subtitle')}
            </p>

            {/* Bottom glow line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {personas.map((persona, index) => {
            const isSoon = true; // Agora todas as IAs estão 'Em Breve'

            return (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={cn("relative group transition-all duration-500", isSoon && "opacity-85 hover:opacity-100 grayscale-[0.25] hover:grayscale-0")}
              >
                {/* Glowing custom-colored aura behind the card on hover */}
                <div className={cn(
                  "absolute -inset-2.5 rounded-[24px] bg-gradient-to-br opacity-0 group-hover:opacity-60 blur-2xl transition-all duration-500 -z-10 pointer-events-none",
                  persona.hoverGlow
                )} />

                <Card className={cn(
                  "relative h-full overflow-hidden bg-black/75 border-white/10 backdrop-blur-2xl transition-all duration-500",
                  persona.hoverBorder
                )}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${persona.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {isSoon && (
                    <div className="absolute top-4 right-4 z-50">
                      <Badge className="bg-amber-500 text-black font-black px-3 py-1 scale-110 shadow-lg border-2 border-white/20">EM BREVE</Badge>
                    </div>
                  )}

                  <CardContent className="p-0 relative z-10">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <motion.div
                        className="w-full h-full"
                        animate={(!isSoon && ['maga', 'orion'].includes(persona.id)) ? {
                          scale: [1, 1.03, 1],
                        } : {}}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        <Image
                          src={persona.image}
                          alt={persona.name}
                          fill
                          className={cn(
                            "object-cover transition-transform duration-700",
                            !isSoon && "group-hover:scale-110"
                          )}
                        />
                      </motion.div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-1 font-headline">{persona.name}</h3>
                      <p className="text-primary text-sm font-semibold mb-3 tracking-wider uppercase">
                        {persona.role}
                      </p>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        {persona.description}
                      </p>

                      {isSoon ? (
                        <Button disabled className="w-full bg-white/5 border-white/10 text-white/40 cursor-not-allowed">
                          Aguardando Protocolo
                        </Button>
                      ) : (
                        <Link href={persona.link}>
                          <Button className="w-full bg-white/10 hover:bg-primary hover:text-white border-white/10 transition-all duration-300">
                            {t('ias.cta')}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FEATURE: NEXUS WAR ROOM (DUAL AI) - DISABLED UNTIL READY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 opacity-50 grayscale"
        >
          <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-slate-700 via-slate-900 to-slate-800 group cursor-not-allowed">
            <div className="absolute top-6 right-6 z-50">
              <Badge className="bg-amber-500 text-black font-black px-4 py-1.5 scale-125 shadow-2xl">LABS: EM BREVE</Badge>
            </div>

            <div className="relative bg-black/80 backdrop-blur-3xl rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">

              {/* Visual Accent */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />

              <div className="flex-1 text-center md:text-left relative z-10">
                <Badge variant="outline" className="text-amber-500 border-amber-500/30 mb-4 tracking-widest px-4 py-1">ACESSO EM DESENVOLVIMENTO</Badge>
                <h2 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tighter text-white/60">
                  Nexus Strategic <span className="text-slate-500">War Room</span>
                </h2>
                <p className="text-xl text-gray-500 mb-8 max-w-2xl font-light italic">
                  "O fator uau da inteligência dual. Assista Magadot e Orion debatendo suas estratégias em tempo real, integrando visão tática e criatividade visual."
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button disabled size="lg" className="bg-white/5 border-white/10 text-white/20 px-10 py-7 text-lg font-bold rounded-2xl">
                    AGUARDANDO CALIBRAÇÃO DUAL
                  </Button>
                </div>
              </div>

              <div className="relative w-full md:w-[40%] aspect-video md:aspect-square flex items-center justify-center p-4">
                <div className="relative w-full h-full flex items-center justify-center gap-2">
                  <div className="relative w-1/2 h-full">
                    <Image src="/maga-avatar-premium.png" alt="Maga" fill className="object-contain brightness-50 grayscale transition-transform duration-700" />
                  </div>
                  <div className="relative w-1/2 h-full">
                    <Image src="/orion-avatar-premium.png" alt="Orion" fill className="object-contain brightness-50 grayscale transition-transform duration-700" />
                  </div>
                </div>
                {/* HUD Overlays */}
                <div className="absolute top-0 left-0 border-t border-l border-white/10 w-8 h-8" />
                <div className="absolute bottom-0 right-0 border-b border-r border-white/10 w-8 h-8" />
              </div>

            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center text-gray-600 text-sm tracking-widest uppercase"
        >
          {t('intelligence.footer')}
        </motion.div>
      </div>
    </div>
  );
};

export default IAsNexusPage;
