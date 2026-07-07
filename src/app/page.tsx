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
import { 
    Github, 
    LayoutDashboard, 
    Code2, 
    GitBranch, 
    ChevronDown, 
    Plus, 
    Search 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    PortalGithubHeader,
    PortalFileList,
    PortalReadme,
    PortalGithubSidebar
} from '@/components/github-style-portal';

import { CustomVideoPlayer } from '@/components/ui/custom-video-player';

export default function HomePage() {
    const { t } = useLocale();

    return (
        <div className="min-h-screen bg-[#080b10] text-[#f0f6fc] font-sans selection:bg-blue-500/30 relative">

            {/* BACKGROUND IMAGE */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Image
                    src="/nexus-tech-world-bg.png"
                    alt="Nexus Background"
                    fill
                    priority
                    className="object-cover opacity-35"
                    style={{ objectPosition: 'center center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#080b10]/20 via-[#080b10]/50 to-[#080b10]/95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 text-foreground overflow-x-hidden">
                <section className="relative min-h-[90dvh] flex flex-col items-center justify-start pt-20 md:pt-24 overflow-hidden">
                <div className="w-full max-w-[1650px] mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col items-center justify-center mb-0 w-full">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative w-full max-w-[1500px] group px-0"
                        >
                            <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-[16px] md:rounded-[32px] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-black/50">
                                <CustomVideoPlayer 
                                    src="/Nexus Holding Group/Avatar_IV_Video.mp4"
                                    className="aspect-video" 
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-center max-w-5xl mx-auto mt-8 md:mt-12 relative z-20 flex flex-col items-center"
                    >
                        {/* Nexus Logo Image (Restored) */}
                        <div className="relative w-full max-w-5xl mx-auto aspect-video mb-12 overflow-hidden rounded-[16px] md:rounded-[32px] border border-white/10 bg-black/40 shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                            <Image
                                src="/Nexus Holding Group/Nexus Holding group nova.jpg"
                                alt="Nexus Holding Group Logo"
                                fill
                                className="object-contain p-4"
                            />
                        </div>

                        {/* Glassmorphism Card */}
                        <div className="relative w-full rounded-2xl md:rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md px-8 py-10 md:px-14 md:py-12 shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden">
                            {/* Subtle amber glow top */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            {/* Corner accents */}
                            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-primary/30 rounded-tl-sm" />
                            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/30 rounded-tr-sm" />
                            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/30 rounded-bl-sm" />
                            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-primary/30 rounded-br-sm" />

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter mb-6 leading-tight drop-shadow-lg">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-primary/50">
                                    A Convergência da Excelência Humana com a Arquitetura Cibernética
                                </span>
                            </h1>
                            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light opacity-90">
                                A <strong>Nexus Holding Group</strong> é o ecossistema definitivo para operações que exigem vanguarda tecnológica. Sob a engenharia estratégica do <strong>Diretor Geanderson</strong>, o grupo atua como a espinha dorsal da inovação corporativa, orquestrando soluções 100% <em>On-Premise</em> através de nossos dois braços de elite:
                            </p>

                            {/* Subtle bottom glow */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>
                    </motion.div>
                </div>

                {/* Ambient Decorative Line */}
                <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </section>

            {/* Section 2: Divisions */}
            <section className="py-16 md:py-24 border-y border-white/5">
                <div className="container flex flex-col gap-16 items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch w-full">
                    
                    {/* Nexus Treinamento */}
                    <div className="relative rounded-2xl md:rounded-3xl border border-primary/15 bg-black/30 backdrop-blur-md p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        {/* Corner accents */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-primary/30 rounded-tl-sm" />
                        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/30 rounded-tr-sm" />
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/30 rounded-bl-sm" />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-primary/30 rounded-br-sm" />

                        <div className="flex-grow space-y-6 text-center">
                            <div className="flex justify-center">
                               <Logo width={400} height={134} />
                            </div>
                            <h3 className="text-2xl font-bold font-headline text-primary text-center uppercase tracking-wider">
                                Tecnologia, Inovação e Evolução
                            </h3>
                            
                            <div className="flex flex-col items-center gap-6 mt-4">
                                <p className="text-foreground/90 text-lg leading-relaxed font-light">
                                    A revolução corporativa começa aqui. Moldamos o futuro de empresas visionárias através de estratégias tecnológicas de vanguarda e arquiteturas disruptivas que redefinem o mercado.
                                </p>
                            </div>
                            
                            <blockquote className="mt-6 border-l-4 border-primary pl-4 py-2 italic text-muted-foreground text-left text-sm">
                                "Evoluir não é mais uma opção, é a única garantia de soberania no mercado de amanhã."
                            </blockquote>
                        </div>

                        {/* Bottom glow */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    </div>

                    {/* Nexus Intelligence */}
                    <div className="relative rounded-2xl md:rounded-3xl border border-blue-500/15 bg-black/30 backdrop-blur-md p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                        {/* Corner accents */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-blue-500/30 rounded-tl-sm" />
                        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-blue-500/30 rounded-tr-sm" />
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-blue-500/30 rounded-bl-sm" />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-blue-500/30 rounded-br-sm" />

                        <div className="flex-grow space-y-6 text-center">
                            <div className="flex justify-center">
                                <NexusIntelligenceLogo width={400} height={134} />
                            </div>
                            <h3 className="text-2xl font-bold font-headline text-blue-400 text-center uppercase tracking-wider">
                                Inteligência Artificial e Soluções Avançadas
                            </h3>
                            
                            <div className="flex flex-col items-center gap-6 mt-4">
                                <p className="text-foreground/90 text-lg leading-relaxed font-light">
                                    O ecossistema definitivo de I.A. para o alto escalão corporativo. Soluções <strong className="text-blue-400 font-medium">100% On-Premise</strong> que conferem poder de decisão absoluto e orquestração preditiva em tempo real.
                                </p>
                            </div>

                            <blockquote className="mt-6 border-l-4 border-blue-500 pl-4 py-2 italic text-muted-foreground text-left text-sm">
                                "Para corporações que exigem o topo, a intuição não basta. A margem de erro é zero."
                            </blockquote>
                        </div>
                        <div className="pt-6 flex flex-col gap-2">
                           <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                               <Link href="/intelligence">{t('inicio.intelligence.cta')}</Link>
                           </Button>
                        </div>

                        {/* Bottom glow */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    </div>
                </div>
                </div>
            </section>
            
            {/* NEW CTA Section */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <Card className="backdrop-blur-md border-2 border-primary/40 p-6 md:p-10 text-center">
                        <CardHeader>
                            <CardTitle className="font-headline text-4xl lg:text-5xl uppercase tracking-tighter">
                                <span className="text-foreground">Seu problema,</span>
                                <span className="text-primary ml-3">nossa engenharia.</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="max-w-3xl mx-auto space-y-6">
                             <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Na <strong className="text-primary font-semibold">Nexus Treinamento</strong>, projetamos a tecnologia e a inovação que impulsionam a sua evolução.<br/>
                                Na <strong className="text-blue-400 font-semibold">Nexus Intelligence</strong>, orquestramos a sua conexão definitiva com o futuro.
                            </p>
                            <blockquote className="text-xl md:text-2xl font-semibold text-foreground italic border-l-4 border-primary pl-6 py-2 text-left">
                                "Somos a Nexus Holding Group: o ecossistema de elite onde a visão estratégica humana encontra a arquitetura cibernética mais avançada do planeta."
                            </blockquote>
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
                        <div className="relative inline-block rounded-2xl border border-primary/20 bg-black/35 backdrop-blur-md px-10 py-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-primary/40" />
                            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-primary/40" />
                            <h2 className="text-3xl font-bold font-headline text-primary [text-shadow:0_0_20px_hsl(var(--primary)/0.4)]">Pilares Soberanos</h2>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Pillar Cards */}
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Heart className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline">Visão Humana</CardTitle>
                                <CardDescription className="font-semibold">A bússola da inteligência</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground">A tecnologia deve servir ao potencial humano, ampliando nossa capacidade criativa e estratégica, jamais substituindo a essência do negócio.</p></CardContent>
                        </Card>
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Handshake className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline">Soberania de Dados</CardTitle>
                                <CardDescription className="font-semibold">Controle absoluto</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground">Garantimos que o capital intelectual da sua empresa permaneça 100% On-Premise e sob as regras estritas do seu firewall corporativo.</p></CardContent>
                        </Card>
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <ShieldCheck className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline">Segurança Extrema</CardTitle>
                                <CardDescription className="font-semibold">Blindagem cibernética</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground">Construímos ecossistemas inquebráveis onde a infraestrutura protege as decisões mais críticas e sigilosas da sua operação.</p></CardContent>
                        </Card>
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Scale className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline">Algoritmos Éticos</CardTitle>
                                <CardDescription className="font-semibold">Decisões imparciais</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground">Nossas inteligências artificiais operam livres de vieses, focadas exclusivamente na matemática da eficiência, na verdade e no resultado puro.</p></CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            
            {/* Section 4: Impulses */}
            <section className="py-16 md:py-24">
                 <div className="container">
                    <div className="text-center mb-12">
                        <div className="relative inline-block rounded-2xl border border-primary/20 bg-black/35 backdrop-blur-md px-10 py-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-primary/40" />
                            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-primary/40" />
                            <h2 className="text-3xl font-bold font-headline text-primary [text-shadow:0_0_20px_hsl(var(--primary)/0.4)]">Impulsos de Crescimento</h2>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card className="bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-primary flex items-center gap-3"><Repeat className="h-7 w-7"/>Reciprocidade Evolutiva</CardTitle>
                                <CardDescription className="font-semibold">Parceria de Alto Nível</CardDescription>
                            </CardHeader>
                            <CardContent><p className="text-muted-foreground">Crescemos e evoluímos na exata proporção em que escalamos os lucros, os resultados e a autonomia dos nossos parceiros de negócios.</p></CardContent>
                        </Card>
                         <Card className="bg-transparent backdrop-blur-md border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-primary flex items-center gap-3"><Sparkles className="h-7 w-7"/>Vanguarda Tecnológica</CardTitle>
                                <CardDescription className="font-semibold">Liderança Pioneira</CardDescription>
                            </CardHeader>
                            <CardContent><p className="text-muted-foreground">Não acompanhamos as tendências. Nós moldamos e desenvolvemos as tecnologias que vão ditar as regras do mercado nas próximas décadas.</p></CardContent>
                        </Card>
                    </div>
                    <div className="mt-20 text-center max-w-4xl mx-auto">
                        <div className="relative rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md px-10 py-10 shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-blue-400/30" />
                            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-blue-400/30" />
                            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/30" />
                            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-primary/30" />
                            <div className="space-y-6">
                                <p className="text-2xl md:text-3xl font-semibold text-primary [text-shadow:0_0_20px_hsl(var(--primary)/0.4)]">
                                    Na Nexus Treinamento, projetamos a tecnologia e a inovação que impulsionam a sua evolução.
                                </p>
                                <p className="text-2xl md:text-3xl font-semibold text-blue-400 [text-shadow:0_0_20px_rgba(96,165,250,0.4)]">
                                    Na Nexus Intelligence, orquestramos a sua conexão definitiva com o futuro.
                                </p>
                                <p className="text-2xl md:text-3xl font-bold font-headline text-white mt-8 pt-6 border-t border-white/10">
                                    Somos a Nexus Holding Group: o ecossistema de elite onde a visão estratégica humana encontra a arquitetura cibernética mais avançada do planeta.
                                </p>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        </div>
                    </div>
                 </div>
            </section>
            </div>
        </div>
    );
}
