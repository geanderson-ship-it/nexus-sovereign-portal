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
import { getVideoUrl } from '@/lib/video-helper';

import { motion } from 'framer-motion';
import { 
    Github, 
    LayoutDashboard, 
    Code2, 
    GitBranch, 
    ChevronDown, 
    Plus, 
    Search,
    X,
    PhoneCall 
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
            <WelcomeAmbassadorGate />

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
                                    src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Avatar_IV_Video.mp4", "Nexus Holding Group.mp4")}
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
                        <div className="relative w-full rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl px-8 py-12 md:px-16 md:py-16 shadow-[0_0_80px_rgba(37,99,235,0.15)] overflow-hidden group transition-all duration-500 hover:border-blue-500/30">
                            {/* Cyber grid pattern overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                            
                            {/* Neon glow accents */}
                            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-blue-500/15" />
                            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-primary/15" />

                            {/* Subtle blue/purple glow top */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
                            
                            {/* Corner accents - customized for a more cybernetic look */}
                            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500/40 rounded-tl-sm transition-all duration-300 group-hover:border-blue-400 group-hover:scale-105" />
                            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500/40 rounded-tr-sm transition-all duration-300 group-hover:border-blue-400 group-hover:scale-105" />
                            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500/40 rounded-bl-sm transition-all duration-300 group-hover:border-blue-400 group-hover:scale-105" />
                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500/40 rounded-br-sm transition-all duration-300 group-hover:border-blue-400 group-hover:scale-105" />

                            <div className="flex flex-col items-center text-center relative z-10 space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 shadow-[0_0_15px_rgba(59,130,246,0.15)] mb-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Nexus Holding Group</span>
                                </div>

                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-headline tracking-tighter leading-tight drop-shadow-lg max-w-4xl">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-400">
                                        Inteligência Artificial e Tecnologia Prática para Fazer Sua Empresa Crescer
                                    </span>
                                </h1>

                                <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-3xl leading-relaxed font-light opacity-95">
                                    Desenvolvemos inteligência artificial sob medida, automação de processos e soluções de alta tecnologia para proteger seus dados, aumentar suas vendas e acelerar seus resultados. Conheça nossas duas divisões principais:
                                </p>

                                {/* High-tech stats block inside card */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-8 pt-8 border-t border-white/5">
                                    <div className="flex flex-col items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Direção Geral</span>
                                        <span className="text-sm font-semibold text-white font-headline">Dir. Geanderson</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Privacidade</span>
                                        <span className="text-sm font-semibold text-blue-400 font-headline">100% Segura & Privada</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Especialidades</span>
                                        <span className="text-sm font-semibold text-white font-headline">Inovação & IA</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Proteção</span>
                                        <span className="text-sm font-semibold text-green-400 font-headline flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Criptografado
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Subtle bottom glow */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                        </div>
                    </motion.div>
                </div>

                {/* Ambient Decorative Line */}
                <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </section>

            {/* Section 2: Divisões da Holding */}
            <section className="py-16 md:py-24 border-y border-white/5">
                <div className="container flex flex-col items-center gap-0">

                    {/* ── TOPO: Logo Nexus Holding Group centralizado ── */}
                    <div className="flex flex-col items-center relative z-10 w-full">
                        <div className="relative w-full max-w-3xl mx-auto">
                            {/* Glow atrás da imagem */}
                            <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-3xl scale-105 pointer-events-none" />
                            <Image
                                src="/nexus-holding-youtube.png"
                                alt="Nexus Holding Group"
                                width={960}
                                height={540}
                                className="relative z-10 w-full h-auto rounded-2xl drop-shadow-[0_0_50px_rgba(37,99,235,0.6)] object-cover"
                                priority
                            />
                        </div>
                        {/* Linha conectora central descendo para os dois cards */}
                        <div className="flex items-start justify-center w-full mt-2 mb-0 gap-0">
                            {/* Linha esquerda */}
                            <div className="flex-1 flex justify-end">
                                <div className="w-1/2 h-px bg-gradient-to-l from-blue-500/60 to-transparent mt-3" />
                                <div className="w-px h-6 bg-blue-500/60" />
                            </div>
                            {/* Ponto central */}
                            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] mt-2 mx-0" />
                            {/* Linha direita */}
                            <div className="flex-1 flex justify-start">
                                <div className="w-px h-6 bg-blue-500/60" />
                                <div className="w-1/2 h-px bg-gradient-to-r from-blue-500/60 to-transparent mt-3" />
                            </div>
                        </div>
                    </div>

                    {/* ── BAIXO: Dois cards das divisões ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch w-full mt-0">

                        {/* Card 1: Nexus Commerce */}
                        <div className="relative rounded-2xl md:rounded-3xl border border-blue-400/20 bg-black/30 backdrop-blur-md p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
                            {/* Top accent */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                            {/* Corner accents */}
                            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-blue-400/30 rounded-tl-sm" />
                            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-blue-400/30 rounded-tr-sm" />
                            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-blue-400/30 rounded-bl-sm" />
                            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-blue-400/30 rounded-br-sm" />
                            {/* Badge holding */}
                            <div className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-blue-400/60 border border-blue-400/20 rounded-full px-2 py-0.5">
                                Nexus Holding Group
                            </div>

                            <div className="flex-grow space-y-6 text-center">
                                {/* Área da logo — altura fixa igual ao Intelligence */}
                                <div className="flex items-center justify-center h-52">
                                    <Image
                                        src="/nexus-commerce-logo.jpg"
                                        alt="Nexus Commerce"
                                        width={320}
                                        height={320}
                                        className="h-full w-auto object-contain rounded-xl drop-shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold font-headline text-blue-300 text-center uppercase tracking-wider">
                                    Ecossistema de Negócios
                                </h3>
                                <div className="flex flex-col items-center gap-6 mt-4">
                                    <p className="text-foreground/90 text-lg leading-relaxed font-light">
                                        Moda, Revenda, Vitrine Digital, Embaixadoras e Marketing — um ecossistema completo para impulsionar seu negócio com tecnologia e estratégia.
                                    </p>
                                </div>
                                <blockquote className="mt-6 border-l-4 border-blue-400 pl-4 py-2 italic text-muted-foreground text-left text-sm">
                                    "Conectamos pessoas, produtos e oportunidades em um único ecossistema poderoso."
                                </blockquote>
                            </div>
                            <div className="pt-6">
                                <Button asChild size="lg" className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-bold h-14 text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                                    <Link href="/inovamoda">Acessar Nexus Commerce</Link>
                                </Button>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
                        </div>

                        {/* Card 2: Nexus Intelligence */}
                        <div className="relative rounded-2xl md:rounded-3xl border border-cyan-500/20 bg-black/30 backdrop-blur-md p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
                            {/* Top accent */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                            {/* Corner accents */}
                            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-cyan-500/30 rounded-tl-sm" />
                            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyan-500/30 rounded-tr-sm" />
                            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-cyan-500/30 rounded-bl-sm" />
                            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-cyan-500/30 rounded-br-sm" />
                            {/* Badge holding */}
                            <div className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-cyan-400/60 border border-cyan-400/20 rounded-full px-2 py-0.5">
                                Nexus Holding Group
                            </div>

                            <div className="flex-grow space-y-6 text-center">
                                {/* Área da logo — mesma altura h-52 do Commerce */}
                                <div className="flex items-center justify-center h-52">
                                    <Image
                                        src="/nexus-intelligence-logo.jpg"
                                        alt="Nexus Intelligence"
                                        width={320}
                                        height={320}
                                        className="h-full w-auto object-contain rounded-xl drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold font-headline text-cyan-400 text-center uppercase tracking-wider">
                                    Inteligência Artificial Sob Medida
                                </h3>
                                <div className="flex flex-col items-center gap-6 mt-4">
                                    <p className="text-foreground/90 text-lg leading-relaxed font-light">
                                        Desenvolvemos assistentes virtuais inteligentes e sistemas de IA de alta segurança, integrados à sua rotina para automatizar tarefas e aumentar a precisão das suas decisões.
                                    </p>
                                </div>
                                <blockquote className="mt-6 border-l-4 border-cyan-500 pl-4 py-2 italic text-muted-foreground text-left text-sm">
                                    "Tomar decisões guiadas por IA e dados exatos elimina o risco e multiplica os resultados."
                                </blockquote>
                            </div>
                            <div className="pt-6">
                                <Button asChild size="lg" className="w-full bg-gradient-to-r from-cyan-700 to-blue-600 hover:from-cyan-600 hover:to-blue-500 text-white font-bold h-14 text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                    <Link href="/intelligence">{t('inicio.intelligence.cta')}</Link>
                                </Button>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
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
                                <span className="text-foreground">Seu desafio,</span>
                                <span className="text-primary ml-3">nossa solução.</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="max-w-3xl mx-auto space-y-6">
                              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Na <strong className="text-primary font-semibold">Nexus</strong>, criamos a tecnologia que simplifica e acelera a evolução do seu negócio.<br/>
                                Na <strong className="text-blue-400 font-semibold">Nexus Intelligence</strong>, conectamos sua empresa às ferramentas de IA mais avançadas do mercado.
                            </p>
                            <blockquote className="text-xl md:text-2xl font-semibold text-foreground italic border-l-4 border-primary pl-6 py-2 text-left">
                                "Nexus Holding Group: onde a experiência estratégica humana e a tecnologia de ponta se unem para transformar o seu negócio."
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
                            <h2 className="text-3xl font-bold font-headline text-primary [text-shadow:0_0_20px_hsl(var(--primary)/0.4)]">Nossos Valores</h2>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Base 1: Respeito */}
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Handshake className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline text-xl">Respeito</CardTitle>
                                <CardDescription className="font-semibold text-primary/80">Autonomia & Sigilo</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground text-sm">Respeitamos a história, a privacidade e o tempo de cada parceiro, protegendo as informações e o sigilo do seu negócio.</p></CardContent>
                        </Card>
                        {/* Base 2: Ética */}
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Scale className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline text-xl">Ética</CardTitle>
                                <CardDescription className="font-semibold text-primary/80">Integridade Total</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground text-sm">Operamos com transparência e integridade em cada linha de código, garantindo conformidade com as leis e rigor moral.</p></CardContent>
                        </Card>
                        {/* Base 3: Confiança */}
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <ShieldCheck className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline text-xl">Confiança</CardTitle>
                                <CardDescription className="font-semibold text-primary/80">Segurança & Solidez</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground text-sm">Construímos soluções seguras e estáveis. Entregamos a tranquilidade de uma infraestrutura forte e impenetrável.</p></CardContent>
                        </Card>
                        {/* Base 4: Humanidade */}
                        <Card className="text-center bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Heart className="mx-auto h-10 w-10 text-primary mb-4" />
                                <CardTitle className="font-headline text-xl">Humanidade</CardTitle>
                                <CardDescription className="font-semibold text-primary/80">Pessoas no Controle</CardDescription>
                            </CardHeader>
                             <CardContent><p className="text-muted-foreground text-sm">A tecnologia existe para servir e potencializar as pessoas. Desenvolvemos sistemas onde o ser humano mantém a decisão final.</p></CardContent>
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
                            <h2 className="text-3xl font-bold font-headline text-primary [text-shadow:0_0_20px_hsl(var(--primary)/0.4)]">Como Impulsionamos Seu Negócio</h2>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card className="bg-transparent border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-primary flex items-center gap-3"><Repeat className="h-7 w-7"/>Parceria de Resultados</CardTitle>
                                <CardDescription className="font-semibold">Crescimento Conjunto</CardDescription>
                            </CardHeader>
                            <CardContent><p className="text-muted-foreground">Crescemos junto com você. Nosso compromisso é aumentar a eficiência, o lucro e a autonomia dos nossos parceiros.</p></CardContent>
                        </Card>
                         <Card className="bg-transparent backdrop-blur-md border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-primary flex items-center gap-3"><Sparkles className="h-7 w-7"/>Inovação Prática</CardTitle>
                                <CardDescription className="font-semibold">Liderança no Mercado</CardDescription>
                            </CardHeader>
                            <CardContent><p className="text-muted-foreground">Desenvolvemos e aplicamos as tecnologias que colocam e mantêm a sua empresa à frente da concorrência.</p></CardContent>
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
                                    Na Nexus, criamos a tecnologia que simplifica e acelera o seu negócio.
                                </p>
                                <p className="text-2xl md:text-3xl font-semibold text-blue-400 [text-shadow:0_0_20px_rgba(96,165,250,0.4)]">
                                    Na Nexus Intelligence, conectamos sua empresa ao futuro da inteligência artificial.
                                </p>
                                <p className="text-2xl md:text-3xl font-bold font-headline text-white mt-8 pt-6 border-t border-white/10">
                                    Nexus Holding Group: onde a visão estratégica humana encontra a tecnologia mais avançada do mercado.
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

const HAS_ACTIVE_AMBASSADOR = false; // Mude para true quando fecharmos o primeiro cliente!

function WelcomeAmbassadorGate() {
  const [isOpen, setIsOpen] = React.useState(HAS_ACTIVE_AMBASSADOR);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      
      {/* GLOWS */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* GATE CONTAINER */}
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-[#0f141c] to-[#080b10] border border-blue-500/30 rounded-[32px] p-6 md:p-10 shadow-[0_0_100px_rgba(37,99,235,0.25)] flex flex-col md:flex-row gap-8 overflow-hidden group">
        
        {/* CYBER LINES */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-xl" />

        {/* CLOSE BUTTON */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-lg hover:scale-105 cursor-pointer"
          title="Entrar no Portal Principal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: THE VIDEOPLAYER */}
        <div className="w-full md:w-[55%] flex flex-col justify-center">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-blue-500/20 bg-black shadow-2xl">
            <video 
              src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Sofia_Inova_moda.mp4"
              controls
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: INFORMATION & CTAs */}
        <div className="w-full md:w-[45%] flex flex-col justify-between py-2 text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Novo Case Global</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-headline font-black uppercase text-white leading-none">
              A Primeira Cidade <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                Embaixadora Nexus
              </span>
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
              Nossa tecnologia inteligente de governança foi oficialmente implantada. Conheça a embaixadora virtual local e veja como as rotas de turismo, segurança e inteligência comercial estão operando sob a nossa infraestrutura soberana.
            </p>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest">Cidade</span>
                <span className="text-xs font-semibold text-white">Cidade Modelo</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest">Tecnologia</span>
                <span className="text-xs font-semibold text-blue-400">Embaixadora AI</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {/* CTA 1: WHATSAPP GEAN */}
            <a 
              href="https://wa.me/5551999799582?text=Olá%20Gean,%20gostaria%20de%20saber%20mais%20sobre%20como%20trazer%20a%20Embaixadora%20Nexus%20para%20minha%20cidade."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-[1.02]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Trazer para Minha Cidade
            </a>

            {/* CTA 2: PROCEED */}
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 px-4 bg-transparent border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all text-center cursor-pointer"
            >
              Entrar no Portal da Nexus
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
