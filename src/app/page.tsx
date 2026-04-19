'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Gem, BarChart, Heart, Handshake, ShieldCheck, Scale, Repeat, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NexusIntelligenceLogo } from '@/components/nexus-intelligence-logo';
import { Logo } from '@/components/logo';
import { useLocale } from '@/hooks/use-locale';

import { motion } from 'framer-motion';

export default function HomePage() {
    const { t } = useLocale();

    return (
        <div className="text-foreground overflow-x-hidden">
            <section className="relative min-h-[90dvh] flex flex-col items-center justify-center pt-24 overflow-hidden">
                <div className="container relative z-10">
                    <div className="flex flex-col items-center justify-center mb-0 w-full">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative w-full max-w-[1500px] group px-0"
                        >
                            <div className="relative w-full aspect-[21/9] md:aspect-[16/7] lg:aspect-[2.5/1] overflow-hidden rounded-[16px] md:rounded-[32px] border border-white/5">
                                <Image
                                    src="https://i.postimg.cc/Kj1cPYH3/Combine-the-first-im.png"
                                    alt="Nexus Holding Group: Convergência Humana"
                                    fill
                                    className="object-contain object-center transition-all duration-[4000ms]"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-center max-w-5xl mx-auto mt-8 md:mt-12 relative z-20"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter mb-4 leading-tight drop-shadow-lg">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-primary/30">
                                {t('inicio.title')}
                            </span>
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed font-light italic opacity-70 tracking-tight">
                            {t('inicio.subtitle')}
                        </p>
                    </motion.div>
                </div>

                {/* Ambient Decorative Line */}
                <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </section>

            {/* Section 2: Divisions */}
            <section className="py-16 md:py-24 border-y border-white/5">
                <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    
                    {/* Nexus Treinamento */}
                    <div className="flex flex-col text-center">
                        <div className="flex-grow space-y-6">
                            <div className="flex justify-center">
                               <Logo width={400} height={134} />
                            </div>
                            <h3 className="text-2xl font-bold font-headline text-primary text-center">{t('inicio.treinamento.title')}</h3>
                            
                            <ul className="space-y-4 text-left">
                                <li className="flex items-start gap-3">
                                    <Rocket className="h-6 w-6 text-primary mt-1 flex-shrink-0"/>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{t('inicio.treinamento.palestras.title')}</h4>
                                        <p className="text-sm text-muted-foreground">{t('inicio.treinamento.palestras.description')}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Gem className="h-6 w-6 text-primary mt-1 flex-shrink-0"/>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{t('inicio.treinamento.cursos.title')}</h4>
                                        <p className="text-sm text-muted-foreground">{t('inicio.treinamento.cursos.description')}</p>
                                    </div>
                                </li>
                                 <li className="flex items-start gap-3">
                                    <BarChart className="h-6 w-6 text-primary mt-1 flex-shrink-0"/>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{t('inicio.treinamento.consultoria.title')}</h4>
                                        <p className="text-sm text-muted-foreground">{t('inicio.treinamento.consultoria.description')}</p>
                                    </div>
                                </li>
                            </ul>
                            
                            <blockquote className="border-l-4 border-primary pl-4 italic text-foreground text-left">{t('inicio.treinamento.quote')}</blockquote>
                        </div>
                        
                        <div className="pt-6">
                            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                <Button asChild size="lg" className="w-full h-14 text-lg font-bold">
                                    <Link href="/courses">{t('inicio.treinamento.cta.cursos')}</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="w-full h-14 text-lg font-bold">
                                    <Link href="/consulting">{t('inicio.treinamento.cta.consultoria')}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Nexus Intelligence */}
                    <div className="flex flex-col">
                        <div className="flex-grow space-y-6">
                            <div className="flex justify-center">
                                <NexusIntelligenceLogo width={400} height={134} />
                            </div>
                            <h3 className="text-2xl font-bold font-headline text-blue-400 text-center">{t('inicio.intelligence.title')}</h3>
                            
                            <div className="space-y-6 text-left">
                                <div>
                                    <h4 className="font-semibold text-blue-400 text-lg">{t('inicio.intelligence.dante.title')}</h4>
                                    <p className="text-muted-foreground text-sm mt-1 space-y-1">{t('inicio.intelligence.dante.description')}</p>
                                    <ul className="list-disc list-inside pl-4 text-muted-foreground text-sm mt-1 space-y-1">
                                        <li><span className="font-semibold text-foreground">{t('inicio.intelligence.dante.chat.title')}</span> {t('inicio.intelligence.dante.chat.description')}</li>
                                        <li><span className="font-semibold text-foreground">{t('inicio.intelligence.dante.safra.title')}</span> {t('inicio.intelligence.dante.safra.description')}</li>
                                        <li><span className="font-semibold text-foreground">{t('inicio.intelligence.dante.compras.title')}</span> {t('inicio.intelligence.dante.compras.description')}</li>
                                    </ul>
                                    <p className="text-xs italic mt-2 text-muted-foreground/80">{t('inicio.intelligence.dante.devNote')}</p>
                                </div>
                                 <div>
                                    <h4 className="font-semibold text-primary text-lg">{t('inicio.intelligence.djeny.title')}</h4>
                                     <p className="text-muted-foreground text-sm mt-1">{t('inicio.intelligence.djeny.description')}</p>
                                    <ul className="list-disc list-inside pl-4 text-muted-foreground text-sm mt-1 space-y-1">
                                        <li><span className="font-semibold text-foreground">{t('inicio.intelligence.djeny.chat.title')}</span> {t('inicio.intelligence.djeny.chat.description')}</li>
                                        <li><span className="font-semibold text-foreground">{t('inicio.intelligence.djeny.design.title')}</span> {t('inicio.intelligence.djeny.design.description')}</li>
                                    </ul>
                                    <p className="text-xs italic mt-2 text-muted-foreground/80">{t('inicio.intelligence.djeny.devNote')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 flex flex-col gap-2">
                           <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                               <Link href="/intelligence">{t('inicio.intelligence.cta')}</Link>
                           </Button>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* NEW CTA Section */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <Card className="backdrop-blur-md border-2 border-primary/40 p-6 md:p-10 text-center">
                        <CardHeader>
                            <CardTitle className="font-headline text-4xl lg:text-5xl">
                                <span className="text-primary">{t('inicio.newCta.title1')}</span>
                                <span className="text-primary/90 ml-2">{t('inicio.newCta.title2')}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="max-w-3xl mx-auto space-y-4">
                             <p className="text-lg md:text-xl text-muted-foreground">
                                {t('inicio.newCta.description')}
                            </p>
                            <blockquote className="text-xl md:text-2xl font-semibold text-foreground italic">{t('inicio.newCta.quote')}</blockquote>
                        </CardContent>
                        <CardFooter className="justify-center mt-6">
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-8">
                                <Link href="/contact?subject=consultoria-inovacao">{t('inicio.newCta.cta')}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>


             {/* Section 3: Pillars */}
            <section className="py-16 md:py-24 border-t border-white/5">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-headline text-primary">{t('inicio.pillars.title')}</h2>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Pillar Cards */}
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Heart className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline">{t('inicio.pillars.humanidade.title')}</CardTitle>
                                <CardDescription className="font-semibold">{t('inicio.pillars.humanidade.subtitle')}</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground">{t('inicio.pillars.humanidade.description')}</p></CardContent>
                        </Card>
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Handshake className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline">{t('inicio.pillars.respeito.title')}</CardTitle>
                                <CardDescription className="font-semibold">{t('inicio.pillars.respeito.subtitle')}</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground">{t('inicio.pillars.respeito.description')}</p></CardContent>
                        </Card>
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <ShieldCheck className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline">{t('inicio.pillars.confianca.title')}</CardTitle>
                                <CardDescription className="font-semibold">{t('inicio.pillars.confianca.subtitle')}</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground">{t('inicio.pillars.confianca.description')}</p></CardContent>
                        </Card>
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Scale className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline">{t('inicio.pillars.etica.title')}</CardTitle>
                                <CardDescription className="font-semibold">{t('inicio.pillars.etica.subtitle')}</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground">{t('inicio.pillars.etica.description')}</p></CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            
            {/* Section 4: Impulses */}
            <section className="py-16 md:py-24">
                 <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-headline text-primary">{t('inicio.impulses.title')}</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card className="bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-primary flex items-center gap-3"><Repeat className="h-7 w-7"/>{t('inicio.impulses.reciprocidade.title')}</CardTitle>
                                <CardDescription className="font-semibold">{t('inicio.impulses.reciprocidade.subtitle')}</CardDescription>
                            </CardHeader>
                            <CardContent><p className="text-muted-foreground">{t('inicio.impulses.reciprocidade.description')}</p></CardContent>
                        </Card>
                         <Card className="bg-transparent backdrop-blur-md border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-primary flex items-center gap-3"><Sparkles className="h-7 w-7"/>{t('inicio.impulses.vanguarda.title')}</CardTitle>
                                <CardDescription className="font-semibold">{t('inicio.impulses.vanguarda.subtitle')}</CardDescription>
                            </CardHeader>
                            <CardContent><p className="text-muted-foreground">{t('inicio.impulses.vanguarda.description')}</p></CardContent>
                        </Card>
                    </div>
                    <div className="mt-20 text-center space-y-4 max-w-4xl mx-auto">
                        <p className="text-3xl font-semibold text-blue-400">{t('inicio.final.line1')}</p>
                        <p className="text-3xl font-semibold text-primary">{t('inicio.final.line2')}</p>
                        <p className="text-3xl font-bold font-headline text-foreground">{t('inicio.final.line3')}</p>
                    </div>
                 </div>
            </section>
        </div>
    );
}
