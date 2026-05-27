
'use client';

import { Heart, Zap, Rocket, Target, ShieldCheck, Scale, Handshake, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';

export default function AboutPage() {
  const { t } = useLocale();
  
  const alicercePillars = [
      { icon: Heart, title: t('about.pillars.humanidade.title'), text: t('about.pillars.humanidade.text') },
      { icon: ShieldCheck, title: t('about.pillars.confianca.title'), text: t('about.pillars.confianca.text') },
      { icon: Scale, title: t('about.pillars.etica.title'), text: t('about.pillars.etica.text') },
      { icon: Handshake, title: t('about.pillars.respeito.title'), text: t('about.pillars.respeito.text') },
  ];

  const impulsoPillars = [
      { icon: Zap, title: t('about.pillars.atitude.title'), text: t('about.pillars.atitude.text') },
      { icon: BrainCircuit, title: t('about.pillars.simplicidade.title'), text: t('about.pillars.simplicidade.text') },
  ];
  
  return (
    <div className="relative min-h-screen">

      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/alta-lideranca.png"
          alt="Nexus Sobre Background"
          fill
          priority
          className="object-cover opacity-45"
          style={{ objectPosition: 'center 20%' }}
        />
        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 container mx-auto py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl">
          {t('about.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-xl text-foreground font-semibold">
          {t('about.subtitle')}
        </p>
         <p className="mx-auto mt-2 max-w-3xl text-lg text-muted-foreground">
          {t('about.intro')}
        </p>
      </div>

      <section className="w-full my-12">
        <div className="container mx-auto px-0">
          <div className="relative aspect-video md:aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-950/30">
            <Image
              src="/Sobre/palestras-nas-empresas.webp"
              alt="Uma equipe colaborando sobre uma planta arquitetônica, simbolizando a união de prática e inteligência."
              fill
              sizes="100vw"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              data-ai-hint="team blueprint"
            />
          </div>
        </div>
      </section>

      <div className="my-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {t('about.founder.title')}
          </h2>
          <p className="mt-4 text-xl text-primary font-semibold">
            {t('about.founder.quote')}
          </p>
           <p className="mt-4 text-muted-foreground">
            {t('about.founder.p1')}
          </p>
          <p className="mt-4 text-muted-foreground">
            {t('about.founder.p2')}<strong className="text-primary font-bold bg-primary/10 p-1 rounded">{t('about.founder.experience')}</strong>{t('about.founder.p3')}
          </p>
          <p className="mt-4 text-muted-foreground">
            {t('about.founder.p4')}<strong className="text-primary font-bold bg-primary/10 p-1 rounded">{t('about.founder.credentials')}</strong>{t('about.founder.p5')}
          </p>
        </div>
        <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-xl">
          <Image
            src={placeholderImages.founder.src}
            alt={placeholderImages.founder.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'contain', objectPosition: 'top' }}
            data-ai-hint={placeholderImages.founder.hint}
          />
        </div>
      </div>

      <div className="grid gap-8 rounded-lg border-2 border-primary/20 bg-zinc-950/60 backdrop-blur-md p-8 md:grid-cols-2 shadow-xl shadow-black/40">
        <div className="flex flex-col items-center text-center">
          <Rocket className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-2xl font-bold">{t('about.mission.title')}</h3>
          <p className="mt-2 text-muted-foreground">
            {t('about.mission.text')}
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Target className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-2xl font-bold">{t('about.vision.title')}</h3>
          <p className="mt-2 text-muted-foreground">
            {t('about.vision.text')}
          </p>
        </div>
      </div>

      <section className="my-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            {t('about.values.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            {t('about.values.text')}
          </p>
        </div>
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-center text-primary mb-6">{t('about.pillars.foundation.title')}</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {alicercePillars.map((value, i) => (
                <Card key={i} className="flex flex-col text-center items-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                    <value.icon className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{value.text}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-center text-emerald-400 mb-6">{t('about.pillars.impulse.title')}</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {impulsoPillars.map((value, i) => (
                <Card key={i} className="flex flex-col text-center items-center border-emerald-500/20 hover:border-emerald-500/50">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                    <value.icon className="h-12 w-12 text-emerald-400" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{value.text}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
      </section>

      </div>
    </div>
  );
}
