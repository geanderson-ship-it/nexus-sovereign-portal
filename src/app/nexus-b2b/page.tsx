'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Heart, Sparkles, ArrowRight, Activity, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NexusB2BPage() {
    return (
        <div className="min-h-screen bg-[#080b10] text-[#f0f6fc] font-sans selection:bg-emerald-500/30 relative">
            {/* BACKGROUND IMAGE */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Image
                    src="/nexus-tech-world-bg.png"
                    alt="Nexus B2B Background"
                    fill
                    priority
                    className="object-cover opacity-20"
                    style={{ objectPosition: 'center center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#080b10]/40 via-[#080b10]/70 to-[#080b10]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 text-foreground overflow-x-hidden pt-24 md:pt-32 pb-24">
                <div className="container mx-auto px-4">
                    {/* HEADER */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black tracking-[0.2em] uppercase mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                            <Activity className="w-4 h-4" />
                            Operações Corporativas
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter mb-6 leading-tight drop-shadow-lg text-white">
                            Ecossistema <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600">Nexus B2B</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
                            Onde a tecnologia militar encontra as demandas mais críticas do mercado. Nossas divisões especializadas em Saúde, Farmácia e Audiovisual.
                        </p>
                    </motion.div>

                    {/* CARDS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Nexus Pharma */}
                        <motion.a 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            href="http://localhost:3001" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group block relative rounded-[32px] border border-emerald-500/20 bg-black/40 backdrop-blur-md p-10 hover:bg-emerald-900/10 hover:border-emerald-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] hover:-translate-y-2 overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="absolute top-6 right-6 text-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                                <ArrowRight className="-rotate-45" size={24} />
                            </div>
                            
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-8 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                                <ShieldCheck className="text-emerald-500" size={32} />
                            </div>
                            
                            <h3 className="text-2xl font-black font-headline text-white mb-4 uppercase tracking-tight group-hover:text-emerald-300 transition-colors">Nexus Pharma</h3>
                            <p className="text-base text-slate-400 leading-relaxed mb-6 font-light">
                                Gestão Farmacêutica com Segurança Militar. Retenção SNGPC, inventário preditivo e prevenção de fraudes por inteligência artificial.
                            </p>
                            
                            <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold tracking-widest uppercase mt-auto pt-6 border-t border-emerald-500/10">
                                Acessar Sistema
                            </div>
                        </motion.a>

                        {/* Nexus Studio */}
                        <motion.a 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            href="/intelligence/studio" 
                            className="group block relative rounded-[32px] border border-amber-500/20 bg-black/40 backdrop-blur-md p-10 hover:bg-amber-900/10 hover:border-amber-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(245,158,11,0.2)] hover:-translate-y-2 overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="absolute top-6 right-6 text-amber-500/50 group-hover:text-amber-400 transition-colors">
                                <ArrowRight className="-rotate-45" size={24} />
                            </div>
                            
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-8 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                                <Sparkles className="text-amber-500" size={32} />
                            </div>
                            
                            <h3 className="text-2xl font-black font-headline text-white mb-4 uppercase tracking-tight group-hover:text-amber-300 transition-colors">Nexus Studio</h3>
                            <p className="text-base text-slate-400 leading-relaxed mb-6 font-light">
                                Produtora audiovisual de elite. Captação cinematográfica, narrativas de alto impacto e publicidade hiper-realista guiada por dados.
                            </p>
                            
                            <div className="flex items-center gap-2 text-amber-500 text-sm font-bold tracking-widest uppercase mt-auto pt-6 border-t border-amber-500/10">
                                Acessar Sistema
                            </div>
                        </motion.a>

                        {/* Nexus Health */}
                        <motion.a 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            href="/intelligence/health" 
                            className="group block relative rounded-[32px] border border-red-500/20 bg-black/40 backdrop-blur-md p-10 hover:bg-red-900/10 hover:border-red-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(239,68,68,0.2)] hover:-translate-y-2 overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="absolute top-6 right-6 text-red-500/50 group-hover:text-red-400 transition-colors">
                                <ArrowRight className="-rotate-45" size={24} />
                            </div>
                            
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-8 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                                <Heart className="text-red-500" size={32} />
                            </div>
                            
                            <h3 className="text-2xl font-black font-headline text-white mb-4 uppercase tracking-tight group-hover:text-red-300 transition-colors">Nexus Health</h3>
                            <p className="text-base text-slate-400 leading-relaxed mb-6 font-light">
                                Integração clínica e prontuários avançados. Saúde elevada ao patamar da alta tecnologia com diagnósticos assistidos por IA.
                            </p>
                            
                            <div className="flex items-center gap-2 text-red-500 text-sm font-bold tracking-widest uppercase mt-auto pt-6 border-t border-red-500/10">
                                Acessar Sistema
                            </div>
                        </motion.a>
                    </div>

                    {/* BOTTOM TEXT */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-20 text-center max-w-3xl mx-auto"
                    >
                        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
                            <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
                            <p className="text-sm md:text-base text-slate-300 italic font-light">
                                "Não entregamos apenas software. Entregamos Soberania. Cada braço da Nexus B2B opera sob rigorosos protocolos de criptografia e hospedagem isolada para garantir a blindagem total da sua operação."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
