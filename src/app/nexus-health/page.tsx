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
                            Operações de Saúde
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter mb-6 leading-tight drop-shadow-lg text-white">
                            Ecossistema <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400">Nexus Health</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
                            Onde a tecnologia militar encontra as demandas mais críticas do mercado. Nossas divisões especializadas em Gestão Farmacêutica e Clínicas Inteligentes.
                        </p>
                    </motion.div>

                    {/* CARDS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
                        {/* Nexus Pharma */}
                        <motion.a 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            href="/nexus-health/pharma" 
                            className="group block relative rounded-[32px] border border-emerald-500/20 bg-black/40 backdrop-blur-md hover:border-emerald-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] hover:-translate-y-2 overflow-hidden flex flex-col h-full p-0"
                        >
                            {/* Avatar Lídia - Cover Quadrada */}
                            <div className="relative w-full aspect-square shrink-0 overflow-hidden border-b border-emerald-500/20">
                                <Image src="/lidia-pharma.jpg" alt="Lídia - Nexus Pharma AI" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent" />
                                
                                <div className="absolute top-6 right-6 text-white/50 group-hover:text-emerald-400 transition-colors z-10 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/10">
                                    <ArrowRight className="-rotate-45" size={20} />
                                </div>
                            </div>
                            
                            <div className="p-8 pt-0 flex flex-col flex-1 relative bg-black/40">
                                <div className="w-16 h-16 rounded-2xl bg-[#080b10] flex items-center justify-center border border-emerald-500/40 mb-6 mx-auto group-hover:bg-emerald-500/10 transition-all -mt-8 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <ShieldCheck className="text-emerald-500" size={32} />
                                </div>
                                
                                <h3 className="text-2xl text-center font-black font-headline text-white mb-4 uppercase tracking-tight group-hover:text-emerald-300 transition-colors">Nexus Pharma</h3>
                                <p className="text-base text-center text-slate-400 leading-relaxed mb-6 font-light">
                                    Gestão Farmacêutica com Segurança Militar. Retenção SNGPC, inventário preditivo e prevenção de fraudes por inteligência artificial.
                                </p>
                                
                                <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm font-bold tracking-widest uppercase mt-auto pt-6 border-t border-emerald-500/10">
                                    Acessar Sistema
                                </div>
                            </div>
                        </motion.a>

                        {/* Nexus Clinic */}
                        <motion.a 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            href="/nexus-health/clinic" 
                            className="group block relative rounded-[32px] border border-cyan-500/20 bg-black/40 backdrop-blur-md hover:border-cyan-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(6,182,212,0.2)] hover:-translate-y-2 overflow-hidden flex flex-col h-full p-0"
                        >
                            {/* Avatar Mia - Cover Quadrada */}
                            <div className="relative w-full aspect-square shrink-0 overflow-hidden border-b border-cyan-500/20">
                                <Image src="/clinic-avatar.jpg" alt="Mia - Nexus Clinic AI" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent" />
                                
                                <div className="absolute top-6 right-6 text-white/50 group-hover:text-cyan-400 transition-colors z-10 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/10">
                                    <ArrowRight className="-rotate-45" size={20} />
                                </div>
                            </div>
                            
                            <div className="p-8 pt-0 flex flex-col flex-1 relative bg-black/40">
                                <div className="w-16 h-16 rounded-2xl bg-[#080b10] flex items-center justify-center border border-cyan-500/40 mb-6 mx-auto group-hover:bg-cyan-500/10 transition-all -mt-8 relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                    <Activity className="text-cyan-500" size={32} />
                                </div>
                                
                                <h3 className="text-2xl text-center font-black font-headline text-white mb-4 uppercase tracking-tight group-hover:text-cyan-300 transition-colors">Nexus Clinic</h3>
                                <p className="text-base text-center text-slate-400 leading-relaxed mb-6 font-light">
                                    SaaS de Gestão de Clínicas Privadas. Agenda inteligente integrada ao WhatsApp, CRM avançado e redução drástica de faltas.
                                </p>
                                
                                <div className="flex items-center justify-center gap-2 text-cyan-500 text-sm font-bold tracking-widest uppercase mt-auto pt-6 border-t border-cyan-500/10">
                                    Acessar Sistema
                                </div>
                            </div>
                        </motion.a>

                        {/* Nexus Estima */}
                        <motion.a 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            href="/nexus-health/estima" 
                            className="group block relative rounded-[32px] border border-amber-500/20 bg-black/40 backdrop-blur-md hover:border-amber-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(245,158,11,0.2)] hover:-translate-y-2 overflow-hidden flex flex-col h-full p-0"
                        >
                            {/* Avatar Luna - Cover Quadrada */}
                            <div className="relative w-full aspect-square shrink-0 overflow-hidden border-b border-amber-500/20 bg-[#0a0512]">
                                <Image src="/luna-animale.jpg" alt="Luna - Nexus Estima AI" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent" />
                                
                                <div className="absolute top-6 right-6 text-white/50 group-hover:text-amber-400 transition-colors z-10 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/10">
                                    <ArrowRight className="-rotate-45" size={20} />
                                </div>
                            </div>
                            
                            <div className="p-8 pt-0 flex flex-col flex-1 relative bg-black/40">
                                <div className="w-16 h-16 rounded-2xl bg-[#080b10] flex items-center justify-center border border-amber-500/40 mb-6 mx-auto group-hover:bg-amber-500/10 transition-all -mt-8 relative z-10 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                    <Heart className="text-amber-500" size={32} />
                                </div>
                                
                                <h3 className="text-2xl text-center font-black font-headline text-white mb-4 uppercase tracking-tight group-hover:text-amber-300 transition-colors">Nexus Estima</h3>
                                <p className="text-base text-center text-slate-400 leading-relaxed mb-6 font-light">
                                    Gestão Veterinária de Alta Performance. Controle de vacinas, retornos e prontuários guiados por inteligência artificial (Luna).
                                </p>
                                
                                <div className="flex items-center justify-center gap-2 text-amber-500 text-sm font-bold tracking-widest uppercase mt-auto pt-6 border-t border-amber-500/10">
                                    Acessar Sistema
                                </div>
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
