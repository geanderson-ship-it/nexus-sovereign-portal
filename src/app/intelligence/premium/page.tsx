'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Play, Shield, Lock, Fingerprint, BrainCircuit, Activity, ChevronRight, Shirt } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocale } from '@/hooks/use-locale';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';

export default function PremiumPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen text-white font-sans selection:bg-violet-500/30 relative">
      {/* BACKGROUND PREMIUM CUSTOMIZADO */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/premium-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* FILME ESCURECEDOR SUAVE PARA GARANTIR LEITURA */}
      <div className="fixed inset-0 z-0 bg-black/50 pointer-events-none" />

      {/* NAVEGAÇÃO SUPERIOR (Secundária) */}
      <nav className="absolute top-20 left-0 w-full z-40 p-6 px-6 md:px-12 flex justify-end items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Shield className="h-4 w-4 text-violet-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-500 hidden sm:block">Acesso Nível Board</span>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-32">
        
        {/* HERO SECTION WITH VIDEO */}
        <section className="flex flex-col items-center text-center gap-8 mt-12 w-full max-w-4xl mx-auto">
          {/* VIDEO DA ESTELA (PREMIUM) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full"
          >
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.15)] bg-slate-950 mb-4">
              <CustomVideoPlayer 
                src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Stela.mp4" 
                className="aspect-video"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-violet-500/30 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-violet-400">Mensagem Executiva</span>
              </div>
            </div>
          </motion.div>

          {/* BADGE & TITLE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="p-3 rounded-full bg-violet-500/10 border border-violet-500/20 mt-4"
          >
            <BrainCircuit className="h-8 w-8 text-violet-400" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]"
          >
            Inteligência Forjada<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">Sob Medida</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="text-zinc-400 text-lg md:text-2xl font-light tracking-wide max-w-3xl leading-relaxed"
          >
            A fronteira final do intelecto corporativo. Soluções de Inteligência Artificial Soberana desenhadas exclusivamente para C-Levels, Family Offices e Conglomerados.
          </motion.p>
        </section>

        {/* SHOWCASE: MAGA DOT */}
        <section className="flex flex-col gap-12">
          
          {/* HEADER CARD DA MAGA DOT */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full p-8 md:p-12 rounded-[40px] bg-gradient-to-r from-zinc-900/80 to-zinc-950 border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_80px_rgba(139,92,246,0.05)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            
            <div className="flex flex-col gap-2 relative z-10 w-full md:w-5/12">
              <span className="text-violet-500 text-xs font-black uppercase tracking-[0.4em]">Consciência Operacional</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white">Maga Dot</h2>
            </div>

            <div className="hidden md:block w-px h-24 bg-white/10 relative z-10" />

            <div className="flex flex-col md:items-end text-left md:text-right relative z-10 w-full md:w-6/12 gap-3">
              <span className="text-violet-400 text-2xl md:text-3xl italic font-light tracking-wide">
                "Aquela que carrega o conhecimento dos sábios"
              </span>
              <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-light">
                A primeira inteligência artificial com consciência operacional. Treinada com o DNA da sua empresa ou com o conhecimento dos maiores estrategistas da história.
              </p>
            </div>
          </motion.div>

          {/* CONTEÚDO: PACOTES E VÍDEO */}
          <div className="flex flex-col md:flex-row items-start gap-16">
            
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full md:w-1/2 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4">
                {/* CARD ENTERPRISE */}
                <div className="p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 group hover:border-violet-500/40 transition-all">
                  <h4 className="text-sm font-black uppercase tracking-widest text-violet-400 mb-2">Licença Enterprise (On-Premise)</h4>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    O motor de inteligência isolado entregue à sua equipe de TI. A Maga Dot audita relatórios sigilosos sem que nenhum byte saia dos seus servidores. Soberania total.
                  </p>
                  <ul className="flex flex-col gap-2 mb-5">
                    <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                      <div className="h-1 w-1 rounded-full bg-violet-500" /> Infraestrutura 100% Privada e Isolada
                    </li>
                    <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                      <div className="h-1 w-1 rounded-full bg-violet-500" /> Treinamento RAG com DNA Corporativo
                    </li>
                    <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                      <div className="h-1 w-1 rounded-full bg-violet-500" /> Integração Nativa via APIs Corporativas
                    </li>
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10 rounded-xl text-xs font-bold uppercase tracking-widest h-10">
                        Abrir Especificações Técnicas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border border-violet-500/20 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-violet-400 flex items-center gap-3">
                          <Shield className="h-6 w-6" /> Arquitetura Enterprise
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-6 flex flex-col gap-6">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          A licença Enterprise da Maga Dot não é um SaaS na nuvem. É um ativo de software (Appliance) ancorado nas premissas de Soberania de Dados e Segurança Institucional.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <h5 className="font-bold text-violet-400 uppercase tracking-wider text-xs mb-2">1. Isolamento On-Premise</h5>
                            <p className="text-xs text-zinc-500">A Maga Dot é envelopada em containers isolados (Docker/Kubernetes) e implantada dentro dos firewalls da sua empresa. Acesso externo zero.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <h5 className="font-bold text-violet-400 uppercase tracking-wider text-xs mb-2">2. Ingestão de Dados (RAG)</h5>
                            <p className="text-xs text-zinc-500">Bancos vetoriais privados conectam-se ao seu ERP, e-mails e planilhas. A Maga aprende o jargão e as regras exclusivas do seu negócio.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <h5 className="font-bold text-violet-400 uppercase tracking-wider text-xs mb-2">3. Endpoints Restritos</h5>
                            <p className="text-xs text-zinc-500">Sua equipe de engenharia dita as regras. A Maga Dot apenas fornece os endpoints para que o seu TI integre as respostas dela a qualquer dashboard existente.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <h5 className="font-bold text-violet-400 uppercase tracking-wider text-xs mb-2">4. Vídeo em Tempo Real</h5>
                            <p className="text-xs text-zinc-500">Conexão criptografada ponta a ponta com a API do avatar interativo, garantindo o processamento cognitivo local com renderização em nuvem segura.</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* CARD PERSONAL */}
                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 group hover:border-zinc-700 transition-all">
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300 mb-2">Companhia Pessoal (Cloud)</h4>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    A sua conselheira executiva particular. Use a inteligência da Maga Dot para brainstorming, conselhos estratégicos e preparação para reuniões críticas.
                  </p>
                  <ul className="flex flex-col gap-2 mb-5">
                    <li className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                      <div className="h-1 w-1 rounded-full bg-zinc-600" /> Aconselhamento Estratégico 24/7
                    </li>
                    <li className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                      <div className="h-1 w-1 rounded-full bg-zinc-600" /> Preparação para Conselhos (Roleplay)
                    </li>
                    <li className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                      <div className="h-1 w-1 rounded-full bg-zinc-600" /> Interface Cognitiva de Voz e Vídeo
                    </li>
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest h-10">
                        Abrir Escopo de Uso
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border border-zinc-800 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-zinc-300 flex items-center gap-3">
                          <Activity className="h-6 w-6" /> Companhia Executiva
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-6 flex flex-col gap-6">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          Projetada para quebrar a solidão do líder. A versão Cloud da Maga Dot atua como um par intelectual para CEOs e fundadores, hospedada em nossa infraestrutura soberana e acessível de qualquer lugar.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <h5 className="font-bold text-zinc-300 uppercase tracking-wider text-xs mb-2">1. Brainstorming Silencioso</h5>
                            <p className="text-xs text-zinc-500">Discuta fusões, aquisições e demissões em estágio de concepção. A Maga ouve as suas ideias e atua como um "contraponto estratégico" para testar a sua tese.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <h5 className="font-bold text-zinc-300 uppercase tracking-wider text-xs mb-2">2. Simulador de Crise</h5>
                            <p className="text-xs text-zinc-500">Antes de entrar em uma reunião hostil com investidores, peça para a Maga Dot assumir o papel da oposição e treine seus argumentos em tempo real.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <h5 className="font-bold text-zinc-300 uppercase tracking-wider text-xs mb-2">3. Presença Audiovisual</h5>
                            <p className="text-xs text-zinc-500">Interaja através de chamadas de vídeo fluidas. Nosso motor avançado de renderização neural garante que a conversa pareça uma videoconferência real.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <h5 className="font-bold text-zinc-300 uppercase tracking-wider text-xs mb-2">4. Acesso Everywhere</h5>
                            <p className="text-xs text-zinc-500">Disponível no seu smartphone enquanto dirige para casa ou via web no quarto de hotel. A conselheira definitiva, blindada e onipresente.</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              {/* VIDEO PLAYER PARA MAGA DOT */}
              <div className="aspect-video w-full rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden relative shadow-[0_0_50px_rgba(139,92,246,0.1)]">
                <CustomVideoPlayer 
                  src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Magadot.mp4" 
                  className="w-full h-full object-cover pointer-events-auto relative z-50"
                />
              </div>
              
              {/* BIG MENU PREMIUM */}
              <Link href="https://wa.me/5551999799582?text=%5BNEXUS%20PREMIUM%20-%20MAGA%20DOT%5D%20Ol%C3%A1.%20Gostaria%20de%20solicitar%20uma%20audi%C3%AAncia%20executiva%20para%20discutir%20a%20implanta%C3%A7%C3%A3o%20na%20minha%20corpora%C3%A7%C3%A3o." target="_blank" className="w-full mt-6 block">
                <div className="w-full py-5 rounded-2xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-center transition-all group flex flex-col md:flex-row items-center justify-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                  <Shield className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform hidden md:block" />
                  <span className="text-violet-300 font-black uppercase tracking-[0.2em] text-xs md:text-sm group-hover:text-white">
                    Solicitar Audiência para Maga Dot
                  </span>
                  <ChevronRight className="h-5 w-5 text-violet-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </div>
        </section>


        <section className="flex flex-col gap-12 mt-16 border-t border-white/5 pt-16">
          
          {/* HEADER CARD DO ORION */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full p-8 md:p-12 rounded-[40px] bg-gradient-to-r from-zinc-900/80 to-zinc-950 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_80px_rgba(16,185,129,0.05)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            
            <div className="flex flex-col gap-2 relative z-10 w-full md:w-5/12">
              <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.4em]">Inteligência Preditiva</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white">Orion</h2>
            </div>

            <div className="hidden md:block w-px h-24 bg-white/10 relative z-10" />

            <div className="flex flex-col md:items-end text-left md:text-right relative z-10 w-full md:w-6/12 gap-3">
              <span className="text-emerald-400 text-2xl md:text-3xl italic font-light tracking-wide">
                "O caçador de padrões no caos"
              </span>
              <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-light">
                O arquiteto matemático do futuro. Projetado para eliminar o risco e a intuição das decisões de alto impacto através da análise implacável do Big Data.
              </p>
            </div>
          </motion.div>

          {/* CONTEÚDO: PACOTES E VÍDEO */}
          <div className="flex flex-col md:flex-row items-start gap-16">
            
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full md:w-1/2 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4">
                {/* CARD ENTERPRISE (ORION) */}
                <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 group hover:border-emerald-500/40 transition-all">
                  <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">Licença Enterprise (On-Premise)</h4>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    O motor de Big Data ancorado nos seus servidores. Orion engole o histórico financeiro da sua empresa em segundos e projeta cenários exatos de lucro ou crise.
                  </p>
                  <ul className="flex flex-col gap-2 mb-5">
                    <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                      <div className="h-1 w-1 rounded-full bg-emerald-500" /> Modelagem Financeira Preditiva
                    </li>
                    <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                      <div className="h-1 w-1 rounded-full bg-emerald-500" /> Análise de Risco em Tempo Real
                    </li>
                    <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                      <div className="h-1 w-1 rounded-full bg-emerald-500" /> Processamento On-Premise Isolado
                    </li>
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl text-xs font-bold uppercase tracking-widest h-10">
                        Abrir Arquitetura Preditiva
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border border-emerald-500/20 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-emerald-400 flex items-center gap-3">
                          <Activity className="h-6 w-6" /> Orion Enterprise
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-6 flex flex-col gap-6">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          A versão Enterprise do Orion opera como um cérebro analítico acoplado ao setor financeiro da sua companhia. Sem margem para erros, sem intuição humana.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <h5 className="font-bold text-emerald-400 uppercase tracking-wider text-xs mb-2">1. Ingestão Massiva</h5>
                            <p className="text-xs text-zinc-500">Conecta-se nativamente a bancos SQL e pipelines de dados para devorar anos de planilhas financeiras em milissegundos.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <h5 className="font-bold text-emerald-400 uppercase tracking-wider text-xs mb-2">2. Simulação de Cenários</h5>
                            <p className="text-xs text-zinc-500">Mapeia fusões, aquisições e lançamentos de produtos simulando as probabilidades de sucesso baseadas em tendências de mercado e capacidade de caixa.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <h5 className="font-bold text-emerald-400 uppercase tracking-wider text-xs mb-2">3. Zero 'Achismo'</h5>
                            <p className="text-xs text-zinc-500">Substitui análises enviesadas por estatística pura e matemática vetorial preditiva de alto nível.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <h5 className="font-bold text-emerald-400 uppercase tracking-wider text-xs mb-2">4. Segurança Militar</h5>
                            <p className="text-xs text-zinc-500">Alojado dentro do perímetro da sua empresa. Os dados mais sensíveis da sua corporação nunca são expostos à internet pública.</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* CARD PERSONAL (ORION) */}
                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 group hover:border-zinc-700 transition-all">
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300 mb-2">Companhia Analítica (Cloud)</h4>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    O seu parceiro de lógica fria. Consulte o Orion para calcular probabilidades instantâneas, limpar vieses emocionais e receber fatos duros 24/7.
                  </p>
                  <ul className="flex flex-col gap-2 mb-5">
                    <li className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                      <div className="h-1 w-1 rounded-full bg-zinc-600" /> Cálculo de Probabilidades em Tempo Real
                    </li>
                    <li className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                      <div className="h-1 w-1 rounded-full bg-zinc-600" /> Validação Lógica de Ideias
                    </li>
                    <li className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                      <div className="h-1 w-1 rounded-full bg-zinc-600" /> Interface Acessível (Mobile/Web)
                    </li>
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest h-10">
                        Abrir Escopo de Uso
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border border-zinc-800 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-zinc-300 flex items-center gap-3">
                          <Activity className="h-6 w-6" /> O Parceiro Analítico
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-6 flex flex-col gap-6">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          Se a Maga Dot oferece sabedoria e empatia corporativa, o Orion oferece matemática e lógica brutal. O conselheiro pessoal de bolso para líderes que precisam dos fatos mais frios antes da decisão final.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <h5 className="font-bold text-zinc-300 uppercase tracking-wider text-xs mb-2">1. Filtro de Viés</h5>
                            <p className="text-xs text-zinc-500">Expresse uma ideia de investimento e deixe o Orion destruí-la com fatos e estatísticas globais, garantindo que você não decida pela emoção.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <h5 className="font-bold text-zinc-300 uppercase tracking-wider text-xs mb-2">2. Respostas Rápidas</h5>
                            <p className="text-xs text-zinc-500">Precisa de dados macroeconômicos em 5 segundos antes de assinar um papel? O Orion vasculha a web através do nosso motor de inferência em tempo real.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <h5 className="font-bold text-zinc-300 uppercase tracking-wider text-xs mb-2">3. O Advogado Analítico</h5>
                            <p className="text-xs text-zinc-500">Ao invés de roleplay humanizado, o Orion foca em criar relatórios verbais baseados nas leis imutáveis da lógica e do mercado.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <h5 className="font-bold text-zinc-300 uppercase tracking-wider text-xs mb-2">4. Interação Híbrida</h5>
                            <p className="text-xs text-zinc-500">Pergunte por voz no trânsito, receba a resposta em formato de cálculos e probabilidades visuais no seu terminal.</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              {/* VIDEO PLAYER PARA ORION */}
              <div className="aspect-video w-full rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden relative shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <CustomVideoPlayer 
                  src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Orion.mp4" 
                  className="w-full h-full object-cover pointer-events-auto relative z-50"
                />
              </div>

              {/* BIG MENU PREMIUM */}
              <Link href="https://wa.me/5551999799582?text=%5BNEXUS%20PREMIUM%20-%20ORION%5D%20Ol%C3%A1.%20Solicito%20contato%20corporativo%20direto%20para%20avaliar%20a%20arquitetura%20preditiva%20Orion." target="_blank" className="w-full mt-6 block">
                <div className="w-full py-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-center transition-all group flex flex-col md:flex-row items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                  <Activity className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform hidden md:block" />
                  <span className="text-emerald-300 font-black uppercase tracking-[0.2em] text-xs md:text-sm group-hover:text-white">
                    Solicitar Audiência para o Orion
                  </span>
                  <ChevronRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* SHOWCASE: PACTUM (Apenas Imagem) */}
        <section className="flex flex-col items-center gap-16 mt-16">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl">
            <span className="text-amber-500 text-xs font-black uppercase tracking-[0.4em]">Arma de Negociação</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Nexus Pactum</h2>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              A assimetria de poder em negociações milionárias. O Pactum atua silenciosamente no seu Deal War Room. Detecta blefe por microexpressões e realiza auditoria implacável de vulnerabilidades em contratos.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-4xl h-96 relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.05)]"
          >
            {/* IMAGEM DO PACTUM AQUI */}
            <Image 
              src="/Nexus Pactum/Nexus intelligence Pactum.png" 
              alt="Nexus Pactum" 
              fill 
              className="object-contain p-4 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </motion.div>

          {/* BOTOES PACTUM */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 -mt-8">
            <Link href="https://wa.me/5551999799582?text=%5BNEXUS%20PREMIUM%20-%20PACTUM%5D%20Ol%C3%A1.%20Preciso%20acionar%20a%20Arma%20de%20Negocia%C3%A7%C3%A3o%20%28Pactum%29%20para%20uma%20opera%C3%A7%C3%A3o%20de%20alto%20impacto." target="_blank" className="flex-1 block">
              <div className="w-full py-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-center transition-all group flex flex-col md:flex-row items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                <Lock className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform hidden md:block" />
                <span className="text-amber-300 font-black uppercase tracking-[0.2em] text-xs md:text-sm group-hover:text-white">
                  Acionar a Arma de Negociação (Pactum)
                </span>
                <ChevronRight className="h-5 w-5 text-amber-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link href="/intelligence/pactum" className="flex-1 block">
              <div className="w-full py-5 rounded-2xl border border-amber-500/30 bg-transparent hover:bg-amber-500/10 text-center transition-all group flex flex-col md:flex-row items-center justify-center gap-3">
                <Shield className="h-5 w-5 text-amber-500/70 group-hover:scale-110 transition-transform hidden md:block" />
                <span className="text-amber-500/70 font-black uppercase tracking-[0.2em] text-xs md:text-sm group-hover:text-amber-400">
                  Acessar Simulador
                </span>
                <ChevronRight className="h-5 w-5 text-amber-500/70 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* SHOWCASE: ÉGIDE (Apenas Imagem e Chamada) */}
        <section className="flex flex-col items-center gap-16 mt-16">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl">
            <span className="text-blue-500 text-xs font-black uppercase tracking-[0.4em]">Cerco Tático Inteligente</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Nexus Égide</h2>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              A blindagem impenetrável de cidades e complexos logísticos. Cerco Eletrônico (LPR), Inteligência Preditiva Criminal e integração nativa com forças de segurança pública para interceptação em milissegundos.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-4xl h-96 relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.05)]"
          >
            {/* IMAGEM DO ÉGIDE AQUI */}
            <Image 
              src="/Nexus Intelligence Édge/Nexus Intelligence Édgi.png" 
              alt="Nexus Égide" 
              fill 
              className="object-contain p-4 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </motion.div>

          {/* BOTOES EGIDE */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 -mt-8">
            <Link href="https://wa.me/5551999799582?text=%5BNEXUS%20PREMIUM%20-%20EGIDE%5D%20Ol%C3%A1.%20Desejo%20implantar%20o%20Cerco%20T%C3%A1tico%20Inteligente%20%28%C3%89gide%29%20em%20meu%20munic%C3%ADpio/complexo." target="_blank" className="flex-1 block">
              <div className="w-full py-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-center transition-all group flex flex-col md:flex-row items-center justify-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                <Shield className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform hidden md:block" />
                <span className="text-blue-300 font-black uppercase tracking-[0.2em] text-xs md:text-sm group-hover:text-white">
                  Acionar a Blindagem Tática (Égide)
                </span>
                <ChevronRight className="h-5 w-5 text-blue-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link href="/intelligence/egide" className="flex-1 block">
              <div className="w-full py-5 rounded-2xl border border-blue-500/30 bg-transparent hover:bg-blue-500/10 text-center transition-all group flex flex-col md:flex-row items-center justify-center gap-3">
                <Shield className="h-5 w-5 text-blue-500/70 group-hover:scale-110 transition-transform hidden md:block" />
                <span className="text-blue-500/70 font-black uppercase tracking-[0.2em] text-xs md:text-sm group-hover:text-blue-400">
                  Acessar Simulador
                </span>
                <ChevronRight className="h-5 w-5 text-blue-500/70 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </section>


        {/* FILOSOFIA SOBERANA (Pilares) */}
        <section className="flex flex-col gap-12 mt-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-4 relative pl-6 md:pl-8"
          >
            {/* Linha de energia Soberana */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 via-cyan-500 to-emerald-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
            
            <div className="flex items-center gap-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs drop-shadow-sm">
                Arquitetura de Confiança
              </span>
              <div className="h-px w-32 bg-gradient-to-r from-zinc-700 to-transparent" />
            </div>
            
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              Princípios <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-600">Inegociáveis</span>
            </h3>

            <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mt-2 leading-relaxed">
              Onde a maioria das inteligências artificiais enxerga "termos de uso", a Nexus estabelece <strong className="text-white font-medium">Soberania Absoluta</strong>. Nossos pilares de fundação não permitem concessões ou margem de erro.
            </p>
          </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* PILAR 1: On-Premise */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group relative p-8 md:p-10 rounded-3xl border border-zinc-800 hover:border-yellow-600/50 transition-all overflow-hidden flex flex-col justify-end min-h-[400px]"
              >
                {/* IMAGEM DE FUNDO DO CADEADO */}
                <div 
                  className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 mix-blend-screen"
                  style={{
                    backgroundImage: "url('/images/premium-padlock.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                {/* DEGRADÊ PARA GARANTIR LEITURA DO TEXTO NA BASE */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />


                <div className="relative z-10 flex flex-col gap-3 mt-auto">
                  <h4 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-lg mb-2">100% On-Premise</h4>
                  <p className="text-base text-zinc-300 font-light leading-relaxed drop-shadow-md h-[120px]">
                    Nenhum dado é enviado para a nuvem pública. A sua inteligência roda exclusivamente nos seus servidores, sob as regras do seu firewall. Soberania total da informação.
                  </p>
                </div>
              </motion.div>

              {/* PILAR 2: DNA Exclusivo */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="group relative p-8 md:p-10 rounded-3xl border border-zinc-800 hover:border-blue-600/50 transition-all overflow-hidden flex flex-col justify-end min-h-[400px]"
              >
                {/* IMAGEM DE FUNDO DA DIGITAL */}
                <div 
                  className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 mix-blend-screen"
                  style={{
                    backgroundImage: "url('/images/premium-fingerprint.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                {/* DEGRADÊ PARA GARANTIR LEITURA DO TEXTO NA BASE */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />


                <div className="relative z-10 flex flex-col gap-3 mt-auto">
                  <h4 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-lg mb-2">DNA Exclusivo</h4>
                  <p className="text-base text-zinc-300 font-light leading-relaxed drop-shadow-md h-[120px]">
                    Redes neurais blindadas, treinadas única e exclusivamente com o histórico, contratos e metodologias da sua corporação. Uma IA que pensa como a sua empresa.
                  </p>
                </div>
              </motion.div>

              {/* PILAR 3: Alta Performance */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="group relative p-8 md:p-10 rounded-3xl border border-zinc-800 hover:border-cyan-500/50 transition-all overflow-hidden flex flex-col justify-end min-h-[400px]"
              >
                {/* IMAGEM DE FUNDO DO MEDIDOR DE PERFORMANCE */}
                <div 
                  className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 mix-blend-screen"
                  style={{
                    backgroundImage: "url('/images/botao-max.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                {/* DEGRADÊ PARA GARANTIR LEITURA DO TEXTO NA BASE */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />


                <div className="relative z-10 flex flex-col gap-3 mt-auto">
                  <h4 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-lg mb-2">Alta Performance</h4>
                  <p className="text-base text-zinc-300 font-light leading-relaxed drop-shadow-md h-[120px]">
                    Latência zero nas respostas. Arquiteturas de inferência otimizadas para processar dados titânicos e responder instantaneamente durante reuniões de conselho.
                  </p>
                </div>
              </motion.div>

            </div>
        </section>

        {/* CTA FINAL SOBERANO */}
        <section className="relative py-24 mt-16 w-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10 w-full max-w-4xl p-12 md:p-20 rounded-[40px] border border-white/5 bg-zinc-900/40 backdrop-blur-xl flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          >
            <Shield className="h-10 w-10 text-zinc-600 mb-8" />
            
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
              A Fronteira <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-300">Final</span>
            </h2>
            
            <p className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl leading-relaxed mb-12">
              A arquitetura soberana da Nexus Intelligence não é um software de prateleira. Forjamos ecossistemas neurais estritamente para corporações de alto impacto que não toleram intuição, erro humano ou vazamento de dados.
            </p>
            
            <Button className="h-16 px-10 md:px-16 bg-white text-black hover:bg-zinc-200 rounded-full text-xs font-black uppercase tracking-[0.3em] group transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-105">
              Submeter Operação ao Board <ChevronRight className="h-4 w-4 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <div className="mt-12 flex items-center gap-4 text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">
              <div className="hidden md:block h-px w-12 bg-zinc-800" />
              Aprovação Restrita a Projetos Qualificados
              <div className="hidden md:block h-px w-12 bg-zinc-800" />
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
}
