
'use client';

import React from 'react';
import { OrionOSModule } from '@/components/maga/orion-os-module';
import { motion } from 'framer-motion';
import { Target, Shield, Cpu, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { getVideoUrl } from '@/lib/video-helper';

export default function OrionOSPage() {
  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* ORION CONSTELLATION BACKGROUND (GOLD/YELLOW THEME) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
        {/* Fundo de grade pontilhada holográfica */}
        <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
        
        {/* Orbes Estelares Místicos */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-yellow-600/10 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-amber-600/10 blur-[150px] rounded-full animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[20%] left-[60%] w-[40vw] h-[40vw] bg-yellow-400/5 blur-[100px] rounded-full animate-pulse" />
        
        {/* Linhas de conexão (Simulando Constelação de Dados) */}
        <div className="absolute inset-0 opacity-20 mix-blend-screen" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='1000' height='1000' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M200 300 L400 200 L600 400 L800 300 L900 500 L700 700 L400 800 L200 600 Z' fill='none' stroke='%23eab308' stroke-width='2' stroke-dasharray='5 5'/%3E%3Cpath d='M400 200 L800 300 M200 600 L600 400 M700 700 L900 500' fill='none' stroke='%23eab308' stroke-width='1' stroke-dasharray='2 2' opacity='0.5'/%3E%3Ccircle cx='200' cy='300' r='5' fill='%23fef08a'/%3E%3Ccircle cx='400' cy='200' r='8' fill='%23fef08a'/%3E%3Ccircle cx='600' cy='400' r='6' fill='%23fef08a'/%3E%3Ccircle cx='800' cy='300' r='4' fill='%23fef08a'/%3E%3Ccircle cx='900' cy='500' r='7' fill='%23fef08a'/%3E%3Ccircle cx='700' cy='700' r='5' fill='%23fef08a'/%3E%3Ccircle cx='400' cy='800' r='9' fill='%23fef08a'/%3E%3Ccircle cx='200' cy='600' r='6' fill='%23fef08a'/%3E%3C/svg%3E")`,
               backgroundSize: '100% 100%',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat'
             }} 
        />
        {/* Textura Granulada */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
      </div>

      <div className="container relative z-10 w-full pt-8 pb-16">
        
        {/* BOTÃO VOLTAR */}
        <div className="relative z-20 mb-[-1rem]">
          <Link 
            href="/exclusive" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-mono text-[10px] tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-sm w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Portfólio Exclusive
          </Link>
        </div>

        {/* HEADER: TÍTULO NEXUS ORION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 mb-4"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/10 px-3 py-1 text-xs font-black tracking-widest uppercase shadow-[0_0_10px_rgba(234,179,8,0.2)]">
              <Target className="w-4 h-4 mr-2 inline-block" />
              Gabinete Estratégico e M&A
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-headline drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            NEXUS <span className="text-yellow-500">ORION</span>
          </h1>
        </motion.div>

        {/* CENA CINEMATOGRÁFICA (ORION PREMIUM) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto my-8"
        >
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-yellow-500/30 shadow-[0_0_60px_rgba(234,179,8,0.15)] bg-black/60">
            <CustomVideoPlayer 
              src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Orion.mp4", "orion_Premium.mp4")} 
              className="aspect-video"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-yellow-500/40 rounded-full z-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-yellow-500">Orion Analytics</span>
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
            A infraestrutura de Inteligência de Mercado exibida é uma amostra técnica. O ecossistema Nexus Orion é <strong className="text-white font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">100% adaptável</strong>. Nossos Arquitetos de Soluções moldam a análise preditiva e o cruzamento de dados para refletir milimetricamente os desafios de Governança e M&A do seu Conselho Administrativo.
          </p>
        </div>

        {/* Orion OS Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <OrionOSModule />
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-mono tracking-widest uppercase">Encryption: Elite</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-5 h-5" />
            <span className="text-sm font-mono tracking-widest uppercase">Core: Strategic v4</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
