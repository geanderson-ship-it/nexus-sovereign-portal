
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, BrainCircuit, Zap, Award } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from '@/hooks/use-locale';

export default function ConsultingPage() {
  const { t } = useLocale();

  const consultingSteps = [
    {
        icon: Eye,
        title: t('consulting.step1.title'),
        description: t('consulting.step1.description'),
        style: "border-primary"
    },
    {
        icon: BrainCircuit,
        title: t('consulting.step2.title'),
        description: t('consulting.step2.description'),
        style: "border-emerald-500/50"
    },
    {
        icon: Zap,
        title: t('consulting.step3.title'),
        description: t('consulting.step3.description'),
        style: "border-primary/50"
    },
    {
        icon: Award, // Icon of Legacy
        title: t('consulting.step4.title'),
        description: t('consulting.step4.description'),
        style: "border-primary/50"
    }
  ];

  return (
    <div className="min-h-screen text-white relative">
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/lideranca-estrategica.png"
          alt="Nexus Consulting Background"
          fill
          priority
          className="object-cover opacity-25"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 container mx-auto py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl">
          {t('consulting.title')}
        </h1>
        <p className="font-sans mx-auto mt-4 max-w-3xl text-xl text-muted-foreground">
          {t('consulting.subtitle')}
        </p>
      </div>

       <div className="relative h-96 w-full max-w-5xl mx-auto my-12 rounded-lg overflow-hidden shadow-2xl">
        <Image
          src="/Consultoria/empreendedores-felizes.webp"
          alt="Empreendedores felizes e colaborando, representando o resultado da consultoria Nexus."
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          data-ai-hint="happy entrepreneurs"
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-16 mt-16">
        <div className="text-center">
          <p className="text-lg leading-relaxed text-foreground">
            {t('consulting.intro')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {consultingSteps.map((step, index) => (
                <Card key={index} className={cn("flex flex-col text-center items-center p-6 border-2 transition-transform duration-300 hover:scale-105 hover:shadow-2xl", step.style)}>
                    <CardHeader className="items-center p-2">
                        <step.icon className="h-10 w-10 text-primary mb-4" />
                        <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 flex-1">
                        <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="text-center pt-8">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-bold px-10 border-2 border-white/10">
            <Link href="/contact?subject=diagnostico-estrategico">
              {t('consulting.cta')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
}
