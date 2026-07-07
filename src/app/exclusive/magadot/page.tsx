
'use client';

import React from 'react';
import { MagaOSModule } from '@/components/maga/maga-os-module';
import { useLocale } from '@/hooks/use-locale';
import { ChevronLeft, ShieldAlert, Target, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { motion } from 'framer-motion';

export default function MagaOSPage() {
    const { t } = useLocale();

    return (
        <div className="min-h-screen bg-background py-16 px-4 md:py-24 relative overflow-hidden">
            
            {/* MAGADOT ACTIVE CORE BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
                <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-yellow-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-amber-500/10 blur-[80px] rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-yellow-500/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-yellow-500/20 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-amber-500/30 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />

                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
            </div>

            <div className="container relative z-10 w-full pt-8 pb-16">
                
                {/* BOTÃO VOLTAR */}
                <div className="relative z-20 mb-[-1rem]">
                    <Link 
                        href="/exclusive" 
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </div>

                {/* HEADER: TÍTULO NEXUS MAGADOT */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-8 mb-4"
                >
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/10 px-3 py-1 text-xs font-black tracking-widest uppercase shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                            <ShieldAlert className="w-4 h-4 mr-2 inline-block" />
                            Gestão de Crise e Reputação
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-headline drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        NEXUS <span className="text-yellow-500">MAGADOT</span>
                    </h1>
                </motion.div>

                {/* CENA CINEMATOGRÁFICA (MAGADOT PREMIUM) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-full max-w-5xl mx-auto my-8"
                >
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-yellow-500/30 shadow-[0_0_60px_rgba(234,179,8,0.15)] bg-black/60">
                        <CustomVideoPlayer 
                            src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Magadot_Nexus.mp4" 
                            className="aspect-video"
                        />
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-yellow-500/40 rounded-full z-10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-500">MAGADOT CORE</span>
                        </div>
                        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>
                    </div>
                </motion.div>

                {/* EXCLUSIVE BESPOKE ADAPTATION BADGE */}
                <div className="flex flex-col items-center gap-6 p-10 md:p-14 bg-gradient-to-b from-yellow-600/10 via-yellow-600/5 to-transparent border border-yellow-500/30 rounded-3xl w-full max-w-5xl mx-auto backdrop-blur-md text-center shadow-[0_0_50px_rgba(234,179,8,0.05)] mt-8 mb-12">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                            <span className="absolute h-5 w-5 animate-ping rounded-full bg-yellow-500 opacity-75"></span>
                            <span className="relative h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                        </div>
                        <span className="text-yellow-500 font-black uppercase tracking-[0.25em] text-xs md:text-sm">Engenharia Sob Medida (Bespoke)</span>
                    </div>
                    <p className="text-base md:text-xl text-slate-300 font-medium leading-relaxed max-w-4xl">
                        A infraestrutura de Gestão de Crise e Reputação exibida é uma amostra técnica. O ecossistema Nexus Magadot é <strong className="text-white font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">100% adaptável</strong>. Nossos Arquitetos de Soluções moldam a blindagem midiática e a inteligência de contenção para refletir milimetricamente os desafios da sua corporação ou governo.
                    </p>
                </div>



                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <MagaOSModule />
                </motion.div>
            </div>
        </div>
    );
}
