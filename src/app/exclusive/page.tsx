'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BrainCircuit, ShieldAlert, FileSearch, Building2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';

export default function ExclusiveHub() {
  return (
    <div className="min-h-screen text-white font-sans bg-black relative overflow-hidden">
      {/* BACKGROUND PREMIUM (LUMINOSIDADE MÁXIMA) */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.85)_0%,rgba(245,158,11,0.25)_45%,rgba(0,0,0,1)_120%)] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[url('/noise.png')] opacity-[0.15] mix-blend-overlay pointer-events-none" />

      {/* NAVEGAÇÃO SUPERIOR (Secundária) */}
      <nav className="absolute top-20 left-0 w-full z-40 p-6 px-6 md:px-12 flex justify-end items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-black/50 px-4 py-2 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Shield className="h-4 w-4 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Nível Diretoria</span>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-4 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* HEADER COM VÍDEO DA STELA */}
        <section className="flex flex-col items-center text-center gap-4 mt-4 w-full max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight"
          >
            Nexus <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-700">Exclusive</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="w-full mb-2 mt-4"
          >
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-black/50">
              <CustomVideoPlayer 
                src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Stela.mp4" 
                className="aspect-video"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-amber-500/40 rounded-full z-10 pointer-events-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Briefing Diretoria</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full max-w-4xl mx-auto mb-12 p-8 md:p-10 rounded-3xl bg-black/50 backdrop-blur-xl border border-amber-500/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            {/* Brilho interno do card */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 text-lg md:text-xl text-zinc-300 font-light leading-relaxed space-y-6">
              <p>
                Você acaba de adentrar a <span className="text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Sala de Cofre</span> da inteligência corporativa. Este é o ambiente restrito da Nexus onde tecnologias de Defesa Militar, Teoria dos Jogos e Processamento Neural convergem para <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">proteger, blindar e escalar</span> o império dos maiores Conselhos Administrativos do mundo.
              </p>
              
              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              
              <p className="text-sm md:text-base text-zinc-400 italic font-medium tracking-wide">
                "O acesso a este arsenal é limitado, estritamente confidencial e projetado exclusivamente para quem não admite perder."
              </p>
            </div>
          </motion.div>
        </section>

        {/* HUB DE PRODUTOS - BANHO DE OURO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mt-24">
          
          {/* ÉGIDE */}
          <Link href="/exclusive/egide" className="group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#111] to-[#050505] overflow-hidden transition-all h-full flex flex-col hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:border-amber-500/50"
            >
              {/* CABEÇALHO DO CARD (TÍTULO) */}
              <div className="px-8 pt-8 pb-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Segurança Pública</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-widest">Nível Crítico</span>
                    <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase tracking-widest">Acesso Restrito</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-black uppercase tracking-tight mt-2 flex items-center gap-3">
                  Nexus Égide
                  <ShieldAlert className="h-6 w-6 text-amber-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </h2>
              </div>

              {/* MEIO: VÍDEO */}
              <div 
                className="relative w-full aspect-video border-y border-amber-500/20 overflow-hidden bg-black/50"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <CustomVideoPlayer 
                  src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Avila_Egide.mp4"
                  autoPlay muted loop playsInline
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>
              
              {/* RODAPÉ: CONTEÚDO E BOTÃO */}
              <div className="p-8 pt-6 flex flex-col flex-1 relative z-10 transition-transform duration-500 group-hover:-translate-y-2 bg-[#050505]/50">
                <div className="text-zinc-300 font-light text-sm space-y-3 mb-8">
                  <p>Sistema de monitoramento e cerco tático hiperinteligente. Integração absoluta com forças de segurança para blindar o perímetro de municípios e corporações privadas.</p>
                  <ul className="space-y-1.5 pt-2 border-t border-white/5">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> LPR de ultravelocidade (leitura em milissegundos)</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Rastreio preditivo de rotas de fuga e anomalias</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Despacho tático via WebSocket integrado ao CCO</li>
                  </ul>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center text-amber-400 font-bold uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">
                  Acessar Central de Comando <span className="ml-2">→</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* PACTUM */}
          <Link href="/exclusive/pactum" className="group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#111] to-[#050505] overflow-hidden transition-all h-full flex flex-col hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:border-amber-500/50"
            >
              {/* CABEÇALHO DO CARD (TÍTULO) */}
              <div className="px-8 pt-8 pb-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Departamento Jurídico</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest">Confidencial</span>
                    <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase tracking-widest">Criptografia Ativa</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-black uppercase tracking-tight mt-2 flex items-center gap-3">
                  Nexus Pactum
                  <FileSearch className="h-6 w-6 text-amber-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </h2>
              </div>

              {/* MEIO: VÍDEO */}
              <div 
                className="relative w-full aspect-video border-y border-amber-500/20 overflow-hidden bg-black/50"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <CustomVideoPlayer 
                  src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Artur_Pactum.mp4"
                  autoPlay muted loop playsInline
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>
              
              {/* RODAPÉ: CONTEÚDO E BOTÃO */}
              <div className="p-8 pt-6 flex flex-col flex-1 relative z-10 transition-transform duration-500 group-hover:-translate-y-2 bg-[#050505]/50">
                <div className="text-zinc-300 font-light text-sm space-y-3 mb-8">
                  <p>A arma definitiva para negociações de altíssimo risco. Inteligência analítica focada em proteger acordos milionários contra armadilhas legais e financeiras.</p>
                  <ul className="space-y-1.5 pt-2 border-t border-white/5">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Detecção de blefe por análise de microexpressões</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Auditoria de vulnerabilidades em contratos complexos</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Simulador de cenários baseado na Teoria dos Jogos</li>
                  </ul>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center text-amber-400 font-bold uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">
                  Adentrar Sala de Guerra <span className="ml-2">→</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* ORION */}
          <Link href="/exclusive/orion" className="group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#111] to-[#050505] overflow-hidden transition-all h-full flex flex-col hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:border-amber-500/50"
            >
              {/* CABEÇALHO DO CARD (TÍTULO) */}
              <div className="px-8 pt-8 pb-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Fusões e Aquisições</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[8px] font-black uppercase tracking-widest">Alto Escalão</span>
                    <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase tracking-widest">IA Preditiva</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-black uppercase tracking-tight mt-2 flex items-center gap-3">
                  Nexus Orion
                  <BrainCircuit className="h-6 w-6 text-amber-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </h2>
              </div>

              {/* MEIO: VÍDEO */}
              <div 
                className="relative w-full aspect-video border-y border-amber-500/20 overflow-hidden bg-black/50"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <CustomVideoPlayer 
                  src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Orion.mp4"
                  autoPlay muted loop playsInline
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>
              
              {/* RODAPÉ: CONTEÚDO E BOTÃO */}
              <div className="p-8 pt-6 flex flex-col flex-1 relative z-10 transition-transform duration-500 group-hover:-translate-y-2 bg-[#050505]/50">
                <div className="text-zinc-300 font-light text-sm space-y-3 mb-8">
                  <p>O conselheiro onisciente para CEOs e Diretorias. Visão panorâmica de mercado focada em alavancar valuations e dominar rodadas de Fusões e Aquisições (M&A).</p>
                  <ul className="space-y-1.5 pt-2 border-t border-white/5">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Validação imparcial de decisões estratégicas do Board</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Análise preditiva de tendências de mercado em tempo real</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Mapeamento de riscos ocultos em balanços financeiros</li>
                  </ul>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center text-amber-400 font-bold uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">
                  Consultar Conselho C-Level <span className="ml-2">→</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* MAGADOT */}
          <Link href="/exclusive/magadot" className="group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#111] to-[#050505] overflow-hidden transition-all h-full flex flex-col hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:border-amber-500/50"
            >
              {/* CABEÇALHO DO CARD (TÍTULO) */}
              <div className="px-8 pt-8 pb-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Gestão de Crise</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase tracking-widest">Protocolo de Defesa</span>
                    <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase tracking-widest">Acesso VIP</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-black uppercase tracking-tight mt-2 flex items-center gap-3">
                  Nexus Magadot
                  <Shield className="h-6 w-6 text-amber-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </h2>
              </div>

              {/* MEIO: VÍDEO */}
              <div 
                className="relative w-full aspect-video border-y border-amber-500/20 overflow-hidden bg-black/50"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <CustomVideoPlayer 
                  src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Magadot_Nexus.mp4"
                  autoPlay muted loop playsInline
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>
              
              {/* RODAPÉ: CONTEÚDO E BOTÃO */}
              <div className="p-8 pt-6 flex flex-col flex-1 relative z-10 transition-transform duration-500 group-hover:-translate-y-2 bg-[#050505]/50">
                <div className="text-zinc-300 font-light text-sm space-y-3 mb-8">
                  <p>Protocolo de defesa e contenção absoluta de crises. Identifica faíscas de reputação antes que o incêndio alcance a grande mídia ou os acionistas da empresa.</p>
                  <ul className="space-y-1.5 pt-2 border-t border-white/5">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Monitoramento global de imagem corporativa e diretores</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Supressão preditiva de vazamentos e notícias sensíveis</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Geração instantânea de roteiros de contenção (Damage Control)</li>
                  </ul>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center text-amber-400 font-bold uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">
                  Abrir Gabinete de Crise <span className="ml-2">→</span>
                </div>
              </div>
            </motion.div>
          </Link>

        </section>
      </main>
    </div>
  );
}
