'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wheat, ShoppingCart, ArrowRight, Paintbrush, Sparkles, Shield, Users, Zap, Bot, Database, CloudRain, Layout, Camera, Mic, Palette, Home, Bed, Sofa, UtensilsCrossed, Cpu, TrendingDown, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLocale } from '@/hooks/use-locale';
import { useUser } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { isAdminUser } from '@/lib/constants';
import * as gtag from '@/lib/gtag';

export default function IntelligencePage() {
    const { t } = useLocale();
    const { user } = useUser();

    const djenyGallery = [
        {
            title: t('intelligence.djenyGallery.item1.title'),
            category: t('intelligence.djenyGallery.item1.category'),
            image: "/images/djeny/bedroom.png",
            icon: Bed,
        },
        {
            title: t('intelligence.djenyGallery.item2.title'),
            category: t('intelligence.djenyGallery.item2.category'),
            image: "/images/djeny/living.png",
            icon: Sofa,
        },
        {
            title: t('intelligence.djenyGallery.item3.title'),
            category: t('intelligence.djenyGallery.item3.category'),
            image: "/images/djeny/balcony.png",
            icon: Home,
        },
        {
            title: t('intelligence.djenyGallery.item4.title'),
            category: t('intelligence.djenyGallery.item4.category'),
            image: "/images/djeny/dining.png",
            icon: UtensilsCrossed,
        }
    ];

    const intelligenceModules = [
        {
            icon: Wheat,
            title: t('intelligence.danteSafra.title'),
            href: "/intelligence/dante-safra/access",
            image: {
                src: 'https://i.postimg.cc/65ZnxtG5/Dante-safra-axis.png',
                alt: 'Dante Safra Axis Premium',
            }
        },
        {
            icon: Paintbrush,
            title: t('intelligence.djenyDesign.title'),
            href: "/intelligence/djeny-design/access",
            image: {
                src: 'https://i.postimg.cc/gkM5QC1N/Djeny-design.png',
                alt: 'Djeny Design',
            }
        },
        {
            icon: Cpu,
            title: "Dante Builder (Esquadrias)",
            href: "/intelligence/dante-builder",
            image: {
                src: 'https://i.postimg.cc/MK2qpjzh/Dante-Builder.png',
                alt: 'Dante Builder Constructor',
            }
        },
        {
            icon: ShoppingCart,
            title: "Dante Compras",
            href: "/intelligence/compras/access",
            image: {
                src: 'https://i.postimg.cc/k4Gk8YyP/dante-compras-hero.png',
                alt: 'Dante Compras',
            }
        }
    ];

    return (
        <div className="w-full min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">
            {/* AMBIENT BACKGROUND SYSTEM */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[150px] transition-all duration-[10s]" />
                <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-pink-900/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-[#020617]" />
            </div>

            <div className="relative isolate z-10">
                <div className="container mx-auto py-24 md:py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-headline text-white uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                            {t('intelligence.title').split(' ')[0]} <span className="text-blue-500">{t('intelligence.title').split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <h2 className="mt-6 text-xl md:text-2xl font-medium text-slate-400 max-w-4xl mx-auto tracking-widest uppercase">
                            {t('intelligence.subtitle')}
                        </h2>
                        
                        <AnimatePresence>
                            {isAdminUser(user) && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-12 group flex justify-center"
                                >
                                    <Button asChild className="relative overflow-hidden bg-zinc-900 border border-primary/30 hover:border-primary px-10 py-8 rounded-2xl transition-all duration-500 shadow-[0_0_40px_rgba(37,99,235,0.1)] hover:shadow-primary/20">
                                        <Link href="/gabinete" className="flex items-center gap-4">
                                            <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                                                <Shield className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Acesso Restrito</span>
                                                <span className="text-xl font-headline font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">Gabinete de Comando</span>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-primary ml-4 transition-transform group-hover:translate-x-2" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-12 flex items-center justify-center gap-4">
                            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-blue-500/50" />
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1 tracking-widest font-mono text-[10px]">STRATEGIC_OS_v5.0</Badge>
                            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-blue-500/50" />
                        </div>
                    </motion.div>
                </div>
            </div>

            <section className="container mx-auto space-y-32 pb-32 z-10 relative">
                
                {/* --- DANTE SAFRA ECOSYSTEM --- */}
                <div className="space-y-16">
                    {/* DANTE SAFRA STANDARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-6xl mx-auto rounded-[48px] overflow-hidden border border-emerald-500/10 bg-slate-900/20 backdrop-blur-3xl shadow-2xl group border-dashed"
                    >
                        <div className="flex flex-col lg:flex-row min-h-[500px]">
                            <div className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden transition-all duration-700">
                                <Image
                                    src="https://i.postimg.cc/FF8yZyFQ/dante-safra.jpg"
                                    alt="Dante Safra Standard"
                                    fill
                                    className="object-contain p-4 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-slate-900/40" />
                                <div className="absolute top-8 left-8">
                                    <Badge className="bg-blue-600/50 text-white border-none px-4 py-1.5 text-[8px] font-black tracking-[0.2em] uppercase">STANDARD_ACCESS</Badge>
                                </div>
                            </div>

                            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative">
                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                                            {t('intelligence.danteSafra.standard.title')}
                                        </h2>
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

                                    <div className="flex justify-center w-full mt-8">
                                        {isAdminUser(user) ? (
                                            <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg lg:text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 w-full max-w-md border border-emerald-400/30">
                                                <Link href="/intelligence/dante-safra/trial">{t('intelligence.complementaryModules.access')}</Link>
                                            </Button>
                                        ) : (
                                            <Button 
                                                asChild 
                                                className="bg-transparent text-emerald-400 border-2 border-emerald-500/50 hover:bg-emerald-500/10 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all hover:scale-105 active:scale-95 w-full max-w-md"
                                                onClick={() => {
                                                    gtag.event({
                                                        action: 'contact_click',
                                                        category: 'engagement',
                                                        label: 'consultant_dante_standard',
                                                    });
                                                }}
                                            >
                                                <Link href="/contact" target="_blank" rel="noopener noreferrer">FALAR COM UM CONSULTOR</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* DANTE SAFRA AXIS PREMIUM */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-6xl mx-auto rounded-[48px] overflow-hidden border border-emerald-500/30 bg-slate-900/60 backdrop-blur-3xl shadow-[0_0_80px_rgba(16,185,129,0.1)] group"
                    >
                        <div className="flex flex-col lg:flex-row min-h-[600px]">
                            <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
                                <Image
                                    src="https://i.postimg.cc/65ZnxtG5/Dante-safra-axis.png"
                                    alt="Dante Safra Axis Premium"
                                    fill
                                    className="object-contain transition-transform duration-[2s] group-hover:scale-105 p-4"
                                    priority
                                />
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent lg:hidden" />
                                
                                <div className="absolute top-8 left-8 flex flex-col gap-2">
                                    <Badge className="bg-emerald-600 text-white border-none px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg animate-pulse">AXIS_TACTICAL_TERMINAL</Badge>
                                    <div className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
                                        <Zap className="h-6 w-6 text-emerald-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                                            DANTE SAFRA <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8 text-shadow-glow">AXIS</span>
                                        </h2>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="h-[2px] w-12 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] font-bold text-emerald-400 tracking-[0.4em] uppercase">{t('intelligence.danteSafra.axis.subtitle')}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-slate-300 leading-relaxed text-lg font-medium italic opacity-90 border-l-2 border-emerald-500/30 pl-6">
                                            "{t('intelligence.danteSafra.why.text')}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 shadow-inner group/card hover:bg-emerald-500/10 transition-all">
                                            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-4">
                                                <Database className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{t('intelligence.danteSafra.axis.economy.title')}</h4>
                                            <div className="text-slate-400 text-xs leading-relaxed font-medium">
                                                {t('intelligence.danteSafra.axis.economy.text').split('**').map((part, i) => (
                                                    i % 2 === 1 ? <strong key={i} className="text-emerald-400 font-black">{part}</strong> : part
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 shadow-inner group/card hover:bg-emerald-500/10 transition-all">
                                            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-4">
                                                <CloudRain className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{t('intelligence.danteSafra.axis.production.title')}</h4>
                                            <div className="text-slate-400 text-xs leading-relaxed font-medium">
                                                {t('intelligence.danteSafra.axis.production.text').split('**').map((part, i) => (
                                                    i % 2 === 1 ? <strong key={i} className="text-emerald-400 font-black">{part}</strong> : part
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center w-full mt-10">
                                        {isAdminUser(user) ? (
                                            <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-600 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg lg:text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 w-full max-w-md border border-emerald-400/30">
                                                <Link href="/intelligence/dante-safra/access">{t('intelligence.complementaryModules.access')}</Link>
                                            </Button>
                                        ) : (
                                            <Button 
                                                asChild 
                                                className="bg-transparent text-emerald-400 border-2 border-emerald-500/50 hover:bg-emerald-500/10 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all hover:scale-105 active:scale-95 w-full max-w-md"
                                                onClick={() => {
                                                    gtag.event({
                                                        action: 'contact_click',
                                                        category: 'engagement',
                                                        label: 'consultant_dante_axis',
                                                    });
                                                }}
                                            >
                                                <Link href="/contact" target="_blank" rel="noopener noreferrer">FALAR COM UM CONSULTOR</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- DJENY DESIGN ECOSYSTEM --- */}
                <div className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase font-headline tracking-tighter drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]">
                            {t('intelligence.djenyDesign.why.title')}
                        </h2>
                        <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed text-lg">
                            {t('intelligence.djenyDesign.why.text')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <div className="p-8 rounded-[40px] bg-pink-500/5 border border-pink-500/10 shadow-inner hover:bg-pink-500/10 transition-all group">
                            <div className="p-4 bg-pink-500/10 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6 text-pink-400" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">{t('intelligence.djenyDesign.economy.title')}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {t('intelligence.djenyDesign.economy.text').split('**').map((part, i) => (
                                    i % 2 === 1 ? <strong key={i} className="text-pink-400">{part}</strong> : part
                                ))}
                            </p>
                        </div>
                        <div className="p-8 rounded-[40px] bg-pink-500/5 border border-pink-500/10 shadow-inner hover:bg-pink-500/10 transition-all group">
                            <div className="p-4 bg-pink-500/10 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <ArrowRight className="h-6 w-6 text-pink-400" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">{t('intelligence.djenyDesign.sales.title')}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {t('intelligence.djenyDesign.sales.text').split('**').map((part, i) => (
                                    i % 2 === 1 ? <strong key={i} className="text-pink-400">{part}</strong> : part
                                ))}
                            </p>
                        </div>
                        <div className="p-8 rounded-[40px] bg-pink-500/5 border border-pink-500/10 shadow-inner hover:bg-pink-500/10 transition-all group">
                            <div className="p-4 bg-pink-500/10 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="h-6 w-6 text-pink-400" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">{t('intelligence.djenyDesign.exclusivity.title')}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {t('intelligence.djenyDesign.exclusivity.text').split('**').map((part, i) => (
                                    i % 2 === 1 ? <strong key={i} className="text-pink-400">{part}</strong> : part
                                ))}
                            </p>
                        </div>
                    </div>

                    {/* GALERIA DE CRIAÇÕES DJENY */}
                    <div className="space-y-8 pt-8">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-pink-500/30" />
                            <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-widest font-headline">{t('intelligence.djenyGallery.sectionTitle').split(' ')[0]} <span className="text-pink-400">{t('intelligence.djenyGallery.sectionTitle').split(' ').slice(1).join(' ')}</span></h3>
                            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-pink-500/30" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                            {djenyGallery.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -10 }}
                                    className="flex flex-col group"
                                >
                                    <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl bg-slate-900 border border-white/5 mb-4">
                                        <Image 
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="px-4 space-y-2">
                                        <Badge className="bg-pink-600/10 text-pink-400 border-pink-500/20 text-[8px] font-black tracking-widest px-2 py-0.5 uppercase">{item.category}</Badge>
                                        <h4 className="text-white font-bold leading-tight text-sm group-hover:text-pink-400 transition-colors uppercase tracking-tight">{item.title}</h4>
                                        <div className="flex items-center gap-2 pt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <div className="p-1 bg-pink-500/10 rounded-lg">
                                                <item.icon className="h-3 w-3 text-pink-400" />
                                            </div>
                                            <span className="text-[9px] text-pink-400 font-bold uppercase tracking-[0.2em]">Djeny Vision AI</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* DJENY PERSONAL */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-6xl mx-auto rounded-[48px] overflow-hidden border border-pink-500/10 bg-slate-900/20 backdrop-blur-3xl group border-dashed"
                    >
                        <div className="flex flex-col lg:flex-row min-h-[500px]">
                            <div className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
                                <Image
                                    src="/images/djeny/standard_hero.png"
                                    alt="Djeny Design Personal"
                                    fill
                                    className="object-contain p-4 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-slate-900/20 transition-opacity group-hover:opacity-0" />
                                <div className="absolute top-8 left-8">
                                    <Badge className="bg-pink-600/50 text-white border-none px-4 py-1.5 text-[8px] font-black tracking-[0.2em] uppercase">PERSONAL_DESIGN</Badge>
                                </div>
                            </div>

                            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative">
                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                                            {t('intelligence.djenyDesign.personal.title')}
                                        </h2>
                                        <p className="text-[10px] font-bold text-pink-500 tracking-[0.4em] uppercase mt-2">{t('intelligence.djenyDesign.personal.subtitle')}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                            <Zap className="h-4 w-4 text-pink-400" />
                                            <span>{t('intelligence.djenyDesign.personal.price')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-400 font-bold text-pink-400 uppercase tracking-widest bg-pink-500/5 px-3 py-1 rounded-full border border-pink-500/20 w-fit">
                                            <Palette className="h-4 w-4" />
                                            <span>{t('intelligence.djenyDesign.personal.trial')}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-center w-full mt-8">
                                        {isAdminUser(user) ? (
                                            <Button asChild className="bg-pink-600 text-white hover:bg-pink-500 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg lg:text-xl shadow-[0_0_40px_rgba(219,39,119,0.3)] transition-all hover:scale-105 active:scale-95 w-full max-w-md border border-pink-400/30">
                                                <Link href="/intelligence/djeny-design/trial">{t('intelligence.complementaryModules.access')}</Link>
                                            </Button>
                                        ) : (
                                            <Button 
                                                asChild 
                                                className="bg-transparent text-pink-400 border-2 border-pink-500/50 hover:bg-pink-500/10 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-[0_0_40px_rgba(219,39,119,0.15)] transition-all hover:scale-105 active:scale-95 w-full max-w-md"
                                                onClick={() => {
                                                    gtag.event({
                                                        action: 'contact_click',
                                                        category: 'engagement',
                                                        label: 'consultant_djeny_personal',
                                                    });
                                                }}
                                            >
                                                <Link href="/contact" target="_blank" rel="noopener noreferrer">FALAR COM UM CONSULTOR</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* DJENY BUSINESS */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-6xl mx-auto rounded-[48px] overflow-hidden border border-pink-500/30 bg-slate-900/60 backdrop-blur-3xl shadow-[0_0_80px_rgba(219,39,119,0.1)] group"
                    >
                        <div className="flex flex-col lg:flex-row min-h-[600px]">
                            <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
                                <Image
                                    src="/images/djeny/business_hero.png"
                                    alt="Djeny Design Business"
                                    fill
                                    className="object-contain p-6 transition-transform duration-[2s] group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent lg:hidden" />
                                
                                <div className="absolute top-8 left-8 flex flex-col gap-2">
                                    <Badge className="bg-pink-600 text-white border-none px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg animate-pulse">BUSINESS_SUITE</Badge>
                                </div>
                            </div>

                            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                                            {t('intelligence.djenyDesign.business.title')}
                                        </h2>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="h-[2px] w-12 bg-pink-500 shadow-[0_0_10px_rgba(219,39,119,0.5)]" />
                                            <span className="text-[10px] font-bold text-pink-400 tracking-[0.4em] uppercase">{t('intelligence.djenyDesign.business.subtitle')}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-xl text-white font-black italic">
                                            <Database className="h-6 w-6 text-pink-400" />
                                            <span>{t('intelligence.djenyDesign.business.price')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300 font-bold uppercase tracking-widest text-xs border-l-2 border-pink-500 pl-4 bg-pink-500/5 py-2 pr-6 rounded-r-xl">
                                            <Zap className="h-4 w-4 text-pink-400 animate-pulse" />
                                            <span>{t('intelligence.djenyDesign.business.feature.unlimited')}</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 leading-relaxed font-medium">
                                        {t('intelligence.djenyDesign.business.description')}
                                    </p>

                                    <div className="flex justify-center w-full mt-10">
                                        {isAdminUser(user) ? (
                                            <Button asChild className="bg-pink-700 text-white hover:bg-pink-600 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg lg:text-xl shadow-[0_0_40px_rgba(219,39,119,0.3)] transition-all hover:scale-105 active:scale-95 w-full max-w-md border border-pink-400/30">
                                                <Link href="/intelligence/djeny-design/access">{t('intelligence.complementaryModules.access')}</Link>
                                            </Button>
                                        ) : (
                                            <Button 
                                                asChild 
                                                className="bg-transparent text-pink-400 border-2 border-pink-500/50 hover:bg-pink-500/10 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-[0_0_40px_rgba(219,39,119,0.15)] transition-all hover:scale-105 active:scale-95 w-full max-w-md"
                                                onClick={() => {
                                                    gtag.event({
                                                        action: 'contact_click',
                                                        category: 'engagement',
                                                        label: 'consultant_djeny_business',
                                                    });
                                                }}
                                            >
                                                <Link href="/contact" target="_blank" rel="noopener noreferrer">FALAR COM UM CONSULTOR</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- DANTE BUILDER (ESQUADRIAS) ECOSYSTEM --- */}
                <div className="space-y-16 pt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-6xl mx-auto rounded-[48px] overflow-hidden border border-cyan-500/30 bg-slate-900/60 backdrop-blur-3xl shadow-[0_0_80px_rgba(34,211,238,0.1)] group"
                    >
                        <div className="p-8 lg:p-16 border-b border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-transparent">
                            <div className="max-w-4xl space-y-8">
                                <h3 className="text-2xl lg:text-4xl font-black text-white uppercase tracking-tighter italic leading-tight">
                                    {t('intelligence.danteBuilder.manifestoTitle')}
                                </h3>
                                <div className="space-y-6">
                                    <p className="text-slate-300 text-lg leading-relaxed font-medium">
                                        {t('intelligence.danteBuilder.manifestoBody')}
                                    </p>
                                    
                                    <div className="pt-8 border-t border-cyan-500/20">
                                        <h4 className="text-xl font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                            <Zap className="h-6 w-6" /> {t('intelligence.danteBuilder.integrationTitle')}
                                        </h4>
                                        <p className="text-slate-400 text-base leading-relaxed whitespace-pre-wrap">
                                            {t('intelligence.danteBuilder.integrationBody')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row min-h-[600px]">
                            <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden bg-gradient-to-br from-cyan-900/20 to-transparent flex items-center justify-center p-12">
                                <Image
                                    src="/assets/dante-builder-v3.png"
                                    alt="Dante Builder Constructor"
                                    width={800}
                                    height={800}
                                    className="object-contain transition-transform duration-[2s] group-hover:scale-110 drop-shadow-[0_0_50px_rgba(34,211,238,0.3)]"
                                />
                                <div className="absolute top-8 left-8 flex flex-col gap-2">
                                    <Badge className="bg-cyan-600 text-white border-none px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg">ENGINEERING_CORE_v3.0</Badge>
                                    <div className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
                                        <Cpu className="h-6 w-6 text-cyan-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
                                            DANTE <span className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-8">BUILDER</span>
                                        </h2>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="h-[2px] w-12 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                            <span className="text-[10px] font-bold text-cyan-400 tracking-[0.4em] uppercase">{t('intelligence.danteBuilder.subtitle')}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Economy Card */}
                                        <div className="p-6 rounded-[32px] bg-cyan-500/5 border border-cyan-500/20 shadow-inner group/card hover:bg-cyan-500/10 transition-all">
                                            <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit mb-4">
                                                <TrendingDown className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{t('intelligence.danteBuilder.economy.title')}</h4>
                                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                                {t('intelligence.danteBuilder.economy.text')}
                                            </p>
                                        </div>

                                        {/* Agility Card */}
                                        <div className="p-6 rounded-[32px] bg-cyan-500/5 border border-cyan-500/20 shadow-inner group/card hover:bg-cyan-500/10 transition-all">
                                            <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit mb-4">
                                                <Zap className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{t('intelligence.danteBuilder.agility.title')}</h4>
                                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                                {t('intelligence.danteBuilder.agility.text')}
                                            </p>
                                        </div>

                                        {/* Aesthetics Card */}
                                        <div className="p-6 rounded-[32px] bg-cyan-500/5 border border-cyan-500/20 shadow-inner group/card hover:bg-cyan-500/10 transition-all">
                                            <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit mb-4">
                                                <Sparkles className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{t('intelligence.danteBuilder.aesthetics.title')}</h4>
                                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                                {t('intelligence.danteBuilder.aesthetics.text')}
                                            </p>
                                        </div>

                                        {/* Scalability Card */}
                                        <div className="p-6 rounded-[32px] bg-cyan-500/5 border border-cyan-500/20 shadow-inner group/card hover:bg-cyan-500/10 transition-all">
                                            <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit mb-4">
                                                <Globe className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{t('intelligence.danteBuilder.scalability.title')}</h4>
                                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                                {t('intelligence.danteBuilder.scalability.text')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center w-full mt-10">
                                        {isAdminUser(user) ? (
                                            <Button asChild className="bg-cyan-600 text-white hover:bg-cyan-500 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg lg:text-xl shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all hover:scale-105 active:scale-95 w-full max-w-md border border-cyan-400/30">
                                                <Link href="/intelligence/dante-builder">{t('intelligence.complementaryModules.access')}</Link>
                                            </Button>
                                        ) : (
                                            <Button 
                                                asChild 
                                                className="bg-transparent text-cyan-400 border-2 border-cyan-500/50 hover:bg-cyan-500/10 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-[0_0_40px_rgba(34,211,238,0.15)] transition-all hover:scale-105 active:scale-95 w-full max-w-md"
                                                onClick={() => {
                                                    gtag.event({
                                                        action: 'contact_click',
                                                        category: 'engagement',
                                                        label: 'consultant_dante_builder',
                                                    });
                                                }}
                                            >
                                                <Link href="/contact" target="_blank" rel="noopener noreferrer">FALAR COM UM CONSULTOR</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- DANTE COMPRAS ECOSYSTEM --- */}
                <div className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-6xl mx-auto rounded-[48px] overflow-hidden border border-blue-500/30 bg-slate-900/60 backdrop-blur-3xl shadow-[0_0_80px_rgba(37,99,235,0.1)] group"
                    >
                        <div className="flex flex-col lg:flex-row min-h-[600px]">
                            <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
                                <Image
                                    src="https://i.postimg.cc/k4Gk8YyP/dante-compras-hero.png"
                                    alt="Dante Compras"
                                    fill
                                    className="object-contain transition-transform duration-[2s] group-hover:scale-105 p-4"
                                    priority
                                />
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent lg:hidden" />
                                
                                <div className="absolute top-8 left-8 flex flex-col gap-2">
                                    <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg animate-pulse">SUPPLY_INTELLIGENCE_v2.0</Badge>
                                    <div className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
                                        <ShoppingCart className="h-6 w-6 text-blue-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                                            DANTE <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8 text-shadow-glow">COMPRAS</span>
                                        </h2>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="h-[2px] w-12 bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                            <span className="text-[10px] font-bold text-blue-400 tracking-[0.4em] uppercase">IA de Intermediação e Auditoria de Suprimentos</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-slate-300 leading-relaxed text-lg font-medium italic opacity-90 border-l-2 border-blue-500/30 pl-6">
                                            "Transforme seu departamento de compras em um centro de lucro com auditoria em tempo real e inteligência de mercado."
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-6 rounded-[32px] bg-blue-500/5 border border-blue-500/20 shadow-inner group/card hover:bg-blue-500/10 transition-all">
                                            <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mb-4">
                                                <Database className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">Auditoria de Preços</h4>
                                            <div className="text-slate-400 text-xs leading-relaxed font-medium">
                                                Dante analisa cada cotação e identifica o <strong className="text-blue-400 font-black">menor custo-benefício</strong> oculto em propostas complexas.
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-[32px] bg-blue-500/5 border border-blue-500/20 shadow-inner group/card hover:bg-blue-500/10 transition-all">
                                            <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mb-4">
                                                <TrendingDown className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">Economia Acumulada</h4>
                                            <div className="text-slate-400 text-xs leading-relaxed font-medium">
                                                Acompanhe em tempo real a <strong className="text-emerald-400 font-black">economia gerada</strong> por suas decisões estratégicas monitoradas pelo Dante.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center w-full mt-10">
                                        {isAdminUser(user) ? (
                                            <Button asChild className="bg-blue-700 text-white hover:bg-blue-600 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg lg:text-xl shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95 w-full max-w-md border border-blue-400/30">
                                                <Link href="/intelligence/compras/access">{t('intelligence.complementaryModules.access')}</Link>
                                            </Button>
                                        ) : (
                                            <Button 
                                                asChild 
                                                className="bg-transparent text-blue-400 border-2 border-blue-500/50 hover:bg-blue-500/10 h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg shadow-[0_0_40px_rgba(37,99,235,0.15)] transition-all hover:scale-105 active:scale-95 w-full max-w-md"
                                                onClick={() => {
                                                    gtag.event({
                                                        action: 'contact_click',
                                                        category: 'engagement',
                                                        label: 'consultant_dante_compras',
                                                    });
                                                }}
                                            >
                                                <Link href="/contact" target="_blank" rel="noopener noreferrer">FALAR COM UM CONSULTOR</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                 <div className="pt-20">
                    <h2 className="text-3xl font-black tracking-[0.4em] text-center text-white font-headline uppercase drop-shadow-xl">
                        {t('intelligence.complementaryModules.title')}
                    </h2>
                    <div className="mt-4 h-[2px] w-32 bg-blue-600 mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto pb-32">
                    {intelligenceModules.filter(m => !m.title.toLocaleLowerCase().includes('safra') && !m.title.toLocaleLowerCase().includes('design') && !m.title.toLocaleLowerCase().includes('builder')).map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={cn(
                                "flex flex-col h-full transition-all duration-500 group overflow-hidden border-white/5 bg-slate-900/50 backdrop-blur-xl relative shadow-2xl aspect-[4/3]",
                                "hover:border-blue-500/30 hover:bg-slate-900/80 hover:shadow-blue-500/5 hover:-translate-y-2 rounded-[32px]"
                            )}>
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-transparent to-black/40 group-hover:to-blue-950/20 transition-all duration-500" />
                                
                                {item.image && (
                                    <Image
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                )}

                                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent">
                                    <CardTitle className="font-headline text-3xl font-black text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">{item.title}</CardTitle>
                                    <Button asChild variant="link" className="text-blue-400 p-0 h-auto w-fit mt-4 font-black uppercase tracking-widest text-[10px]">
                                        <Link href={item.href} className="flex items-center gap-2">
                                            {t('intelligence.complementaryModules.access')} <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                    
                    {/* SOON CARDS */}
                    <div className="flex flex-col items-center justify-center p-12 rounded-[48px] border-2 border-dashed border-white/5 bg-white/0 select-none">
                        <p className="text-white/60 font-black tracking-[0.4em] uppercase text-center text-xl md:text-2xl drop-shadow-md">{t('intelligence.soon')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
