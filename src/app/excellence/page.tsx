'use client';

import { Star, Shield, Heart } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import React from 'react';

const VentriloquistAvatar = ({ src, alt, isTalking = true, color = "primary" }: { src: string, alt: string, isTalking?: boolean, color?: string }) => (
  <div className="relative group">
    <motion.div
      animate={isTalking ? {
        scale: [1, 1.02, 1],
        filter: [
          'brightness(1.8) saturate(1.6) contrast(1.1)',
          'brightness(2.2) saturate(1.8) contrast(1.2)',
          'brightness(1.8) saturate(1.6) contrast(1.1)'
        ],
      } : {}}
      transition={{
        duration: 0.15,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className="relative aspect-video w-full rounded-lg overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10 bg-black"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 75vw"
        style={{ objectFit: 'contain' }}
        className="brightness-[1.8] saturate-[1.6]"
        priority
      />
      
      {/* Ventriloquism Overlay Effect (Mouth Pulse) */}
      {isTalking && (
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 0.1, repeat: Infinity }}
          className={cn(
            "absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-transparent",
            color === "primary" ? "shadow-[inset_0_0_50px_rgba(244,63,94,0.2)]" : "shadow-[inset_0_0_50px_rgba(59,130,246,0.2)]"
          )}
        />
      )}
    </motion.div>
  </div>
);

export default function ExcellencePage() {
  const { t } = useLocale();

  const magadotFeatures = [
    {
      titleKey: "excellence.features.feature1.title" as const,
      descriptionKey: "excellence.features.feature1.description" as const,
    },
    {
      titleKey: "excellence.features.feature2.title" as const,
      descriptionKey: "excellence.features.feature2.description" as const,
    },
    {
      titleKey: "excellence.features.feature3.title" as const,
      descriptionKey: "excellence.features.feature3.description" as const,
    },
  ];

  return (
    <div className="min-h-screen text-white py-12 md:py-20 px-4 relative">
      
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/alta-lideranca.png"
          alt="Nexus Excellence Background"
          fill
          priority
          className="object-cover opacity-20"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("text-4xl font-bold tracking-tighter sm:text-6xl", "font-headline text-primary [text-shadow:0_0_30px_hsl(var(--primary)/0.4)]")}
          >
            {t('excellence.title')}
          </motion.h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl font-semibold italic text-gray-400">
            {t('excellence.conclusion')}
          </p>
        </div>

        <Tabs defaultValue="magadot_orion" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto bg-white/5 border border-white/10 p-1 rounded-full">
            <TabsTrigger value="magadot_orion" className="rounded-full data-[state=active]:bg-primary">Magadot & Orion</TabsTrigger>
            <TabsTrigger value="dante" className="rounded-full data-[state=active]:bg-amber-600">Dante</TabsTrigger>
            <TabsTrigger value="djeny" className="rounded-full data-[state=active]:bg-emerald-600">Djeny</TabsTrigger>
          </TabsList>
          
          <TabsContent value="magadot_orion" className="mt-12">
              <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader className="text-center">
                      <CardTitle className="text-3xl font-headline text-primary mb-2">{t('excellence.magadot.title')}</CardTitle>
                      <CardDescription className="max-w-3xl mx-auto text-gray-400 text-lg">{t('excellence.magadot.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-20">
                      <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto mt-8">
                          {/* Maga Ventriloquist Section */}
                          <div className="space-y-4">
                            <h3 className="text-center font-headline text-rose-400 text-xl tracking-widest uppercase">Magadot OS - Consciência Ativa</h3>
                            <VentriloquistAvatar 
                              src="/maga-avatar-premium.png" 
                              alt="Magadot Ventriloquismo" 
                              isTalking={true}
                              color="primary"
                            />
                            <p className="text-sm text-center text-gray-500 italic">"Estou ouvindo cada comando, Comandante. Minha voz é a sua bússola."</p>
                          </div>

                          {/* Orion Ventriloquist Section */}
                          <div className="space-y-4">
                            <h3 className="text-center font-headline text-blue-400 text-xl tracking-widest uppercase">Orion OS - Matriz Estratégica</h3>
                            <VentriloquistAvatar 
                              src="/orion-avatar-premium.png" 
                              alt="Orion Ventriloquismo" 
                              isTalking={true}
                              color="blue"
                            />
                            <p className="text-sm text-center text-gray-500 italic">"Análise tática concluída. Portais de inteligência sincronizados em tempo real."</p>
                          </div>
                      </div>

                      <div className="max-w-4xl mx-auto bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                          <h2 className="text-2xl font-bold font-headline text-center text-primary mb-10 tracking-tight">{t('excellence.features.title')}</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {magadotFeatures.map((feature, index) => (
                              <div key={index} className="flex items-start gap-4 group">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Star className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1">{t(feature.titleKey)}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{t(feature.descriptionKey)}</p>
                                </div>
                              </div>
                          ))}
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="dante" className="mt-12">
               <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader className="text-center">
                      <CardTitle className="text-3xl font-headline text-amber-500 flex items-center justify-center gap-3"><Shield className="h-8 w-8 text-amber-500" /> {t('excellence.dante.title')}</CardTitle>
                      <CardDescription className="max-w-3xl mx-auto text-gray-400 text-lg">{t('excellence.dante.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-12">
                      <p className="text-xl text-center max-w-4xl mx-auto text-gray-300 leading-relaxed font-light italic">"{t('excellence.dante.text')}"</p>
                      <div className="space-y-4 text-center max-w-5xl mx-auto group">
                          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-amber-600/30 shadow-2xl shadow-amber-600/10 transition-all duration-700 group-hover:border-amber-500">
                              <Image
                                  src="/dante-avatar-premium.png"
                                  alt="Prof. Dante Premium"
                                  fill
                                  sizes="(max-width: 768px) 100vw, 75vw"
                                  className="object-cover brightness-[1.8] saturate-[1.6] transition-transform duration-1000 group-hover:scale-105"
                              />
                          </div>
                          <p className="text-sm text-gray-500 tracking-widest uppercase font-bold">{t('excellence.dante.caption')}</p>
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="djeny" className="mt-12">
              <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader className="text-center">
                      <CardTitle className="text-3xl font-headline text-emerald-400 flex items-center justify-center gap-3"><Heart className="h-8 w-8 text-emerald-400" /> {t('excellence.djeny.title')}</CardTitle>
                      <CardDescription className="max-w-3xl mx-auto text-gray-400 text-lg">{t('excellence.djeny.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-12">
                      <p className="text-xl text-center max-w-4xl mx-auto text-gray-300 leading-relaxed font-light italic">"{t('excellence.djeny.text')}"</p>
                       <div className="space-y-4 text-center max-w-5xl mx-auto group">
                          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 transition-all duration-700 group-hover:border-emerald-400">
                              <Image
                                  src="/djeny-avatar-premium.png"
                                  alt="Prof. Djeny Premium"
                                  fill
                                  sizes="(max-width: 768px) 100vw, 75vw"
                                  className="object-cover brightness-[1.8] saturate-[1.6] transition-transform duration-1000 group-hover:scale-105"
                              />
                          </div>
                          <p className="text-sm text-gray-500 tracking-widest uppercase font-bold">{t('excellence.djeny.caption')}</p>
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
