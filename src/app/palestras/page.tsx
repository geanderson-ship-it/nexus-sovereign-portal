'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Heart, 
  BrainCircuit, 
  Tv, 
  MessageSquare, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Flame, 
  Clock, 
  Headphones, 
  Layers,
  ChevronRight,
  Zap,
  Building2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const WHATSAPP_URL = 'https://wa.me/5551999799582';

function getWhatsAppBookingUrl(palestraNome: string) {
  const text = encodeURIComponent(
    `Olá, Geanderson! Gostaria de consultar a agenda executiva da Nexus Holding Group para a palestra "${palestraNome}" com Dante & Djeny para a nossa empresa/convenção.`
  );
  return `${WHATSAPP_URL}?text=${text}`;
}

export default function PalestrasPage() {
  const [activeTab, setActiveTab] = useState<'trilha1' | 'trilha2' | 'trilha3'>('trilha3');

  return (
    <div className="min-h-screen bg-[#050506] text-slate-200 relative overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-24 font-sans">
      
      {/* Fixed Panoramic Stage Background (Parallax Depth) */}
      <div 
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-[0.28] filter brightness-90 contrast-110"
        style={{ backgroundImage: "url('/palestras/bg_capa_palestras.png')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#050506]/85 via-[#050506]/75 to-[#050506]/95 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.18)_0%,rgba(234,179,8,0.1)_35%,rgba(5,5,6,0.95)_85%)] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ========================================================
            1. HERO SECTION: PALCO OFICIAL DANTE & DJENY
            ======================================================== */}
        <section className="text-center max-w-5xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/15 via-amber-500/15 to-purple-500/15 text-amber-300 border border-amber-500/30 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_25px_rgba(234,179,8,0.2)] backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            Palco Oficial • Nexus Holding Group 2026/2027
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.08] mb-6"
          >
            Palestras de IA, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-indigo-400">
              Liderança & Saúde Mental
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-300 text-sm sm:text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-8 px-2"
          >
            A Inteligência Artificial Soberana assume o atrito burocrático e a exaustão operacional nos bastidores para devolver <strong>saúde mental</strong>, <strong>acolhimento digno</strong> e <strong>presença humana viva</strong> às organizações.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <Button asChild size="lg" className="w-full sm:w-auto px-8 h-14 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black uppercase tracking-wider text-xs rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.35)] transition-all hover:scale-105 cursor-pointer">
              <Link href={getWhatsAppBookingUrl('Palestra Corporativa Dante & Djeny')} target="_blank">
                <Calendar className="w-4 h-4 mr-2" />
                Reservar Data na Agenda Executiva
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 h-14 border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-2xl transition-all cursor-pointer">
              <a href="#trilhas">
                Conhecer as 3 Trilhas Oficiais
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </motion.div>

          {/* FOTO HERO COM AS BANDEIRAS INTERNACIONAIS NO TOPO */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 sm:mt-16 relative w-full aspect-[16/10] sm:aspect-[21/9] rounded-[28px] sm:rounded-[40px] overflow-hidden border border-amber-500/40 shadow-[0_0_80px_rgba(245,158,11,0.25)] group bg-slate-950"
          >
            <Image 
              src="/palestras/palestra_bandeiras_hero.jpg" 
              alt="Palco Oficial Nexus Holding Group com Bandeiras Internacionais - Dante & Djeny" 
              fill 
              priority
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.02]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-transparent opacity-85 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none border-[2px] border-amber-500/20 rounded-[28px] sm:rounded-[40px] group-hover:border-amber-500/50 transition-colors duration-500" />
            
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-left">
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-black/70 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                  Palco Multilíngue • Presença Global & Bandeiras Soberanas
                </span>
                <p className="text-white text-xs sm:text-base font-bold mt-1.5 drop-shadow-md">
                  Nexus Intelligence & Nexus Treinamento • Convenções e Keynotes Internacionais
                </p>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-300 bg-black/60 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md hidden md:inline-block">
                Tecnologia Soberana com Alma Humana
              </span>
            </div>
          </motion.div>
        </section>

        {/* ========================================================
            2. OS PALESTRANTES: DANTE & DJENY LADO A LADO
            ======================================================== */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* CARD DO DANTE */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden border border-amber-500/30 bg-gradient-to-b from-[#14120f] via-[#0d0d0f] to-[#070709] p-8 sm:p-10 shadow-[0_0_50px_rgba(245,158,11,0.12)] group hover:border-amber-500/60 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />
              
              <div className="flex flex-col gap-6 mb-6">
                <div className="relative w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/40 shadow-lg bg-slate-900 group-hover:border-amber-500/70 transition-colors">
                  <Image 
                    src="/palestras/dante_palestrante_novo.png" 
                    alt="Dante no Palco da Nexus Holding Group" 
                    fill 
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-mono text-[9px] uppercase tracking-widest backdrop-blur-md">
                      Palco Oficial • Liderança Soberana
                    </Badge>
                  </div>
                </div>
                <div className="text-left">
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Dante</h2>
                  <p className="text-xs text-amber-400 font-mono uppercase tracking-wider mt-1">Palestrante Executivo de Alta Performance</p>
                  <p className="text-slate-400 text-xs sm:text-sm font-light mt-3 leading-relaxed">
                    Voz firme, postura imponente e foco implacável na tomada de decisão estratégica. Conduz C-Levels e diretores a libertarem suas lideranças do microgerenciamento por meio de ecossistemas soberanos de IA.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Governança, tomada de decisão e liderança destemida na Era da IA</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Eliminação de atrito operacional e reuniões burocráticas estéreis</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Foco em KPIs executivos e arquitetura de alto rendimento</span>
                </div>
              </div>
            </motion.div>

            {/* CARD DA DJENY */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden border border-purple-500/30 bg-gradient-to-b from-[#140e1a] via-[#0d0912] to-[#070709] p-8 sm:p-10 shadow-[0_0_50px_rgba(168,85,247,0.12)] group hover:border-purple-500/60 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
              
              <div className="flex flex-col gap-6 mb-6">
                <div className="relative w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-500/40 shadow-lg bg-slate-900 group-hover:border-purple-500/70 transition-colors">
                  <Image 
                    src="/palestras/djeny_palestrante_novo.png" 
                    alt="Djeny no Palco da Nexus Holding Group" 
                    fill 
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-mono text-[9px] uppercase tracking-widest backdrop-blur-md">
                      Palco Oficial • Saúde Mental & NR-1
                    </Badge>
                  </div>
                </div>
                <div className="text-left">
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Djeny</h2>
                  <p className="text-xs text-purple-400 font-mono uppercase tracking-wider mt-1">Palestrante de Sensibilidade & Cultura Humana</p>
                  <p className="text-slate-400 text-xs sm:text-sm font-light mt-3 leading-relaxed">
                    Elegância nobre, calor acolhedor e sensibilidade cirúrgica. Toca a alma de equipes e gestores, desmistificando o esgotamento corporativo e implementando acolhimento sob as diretrizes da NR-1.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Prevenção e combate ativo à Síndrome de Burnout no trabalho</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Conformidade com a NR-1 e gestão de riscos psicossociais</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Inteligência afetiva, escuta ativa e reconstrução de equipes</span>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ========================================================
            3. BARRA DE AUTORIDADE: RAÍZES NEXUS & NR-1
            ======================================================== */}
        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-center">
              <span className="text-2xl sm:text-4xl font-black text-amber-400 font-mono block">30+ Anos</span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">De Chão de Fábrica & Liderança Humana</span>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-center">
              <span className="text-2xl sm:text-4xl font-black text-purple-400 font-mono block">NR-1 Viva</span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">Riscos Psicossociais & Prevenção ao Burnout</span>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-center">
              <span className="text-2xl sm:text-4xl font-black text-cyan-400 font-mono block">Telão LED 4K</span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">Sincronia Labial & Acústica Masterizada</span>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-center">
              <span className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono block">24/7 Ativo</span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">Micro-Treinamento Contínuo no WhatsApp</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. AS 3 TRILHAS DE PALESTRAS (COM ABAS INTERATIVAS & IMAGENS DO PALCO)
            ======================================================== */}
        <section id="trilhas" className="mb-24 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-amber-400 text-[10px] font-mono uppercase tracking-widest font-bold">
              Grade Programática Oficial
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">
              Escolha a Trilha para a sua Convenção
            </h2>
            <p className="text-slate-400 text-xs sm:text-base font-light mt-3">
              Formatadas sob medida para convenções anuais de empresas, semanas SIPAT, encontros executivos de liderança e kick-offs estratégicos.
            </p>
          </div>

          {/* Seletor de Trilhas */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-3xl mx-auto">
            <button
              onClick={() => setActiveTab('trilha3')}
              className={cn(
                "px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
                activeTab === 'trilha3'
                  ? "bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-[0_0_25px_rgba(234,179,8,0.3)] border border-white/20"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
              )}
            >
              <Award className="w-4 h-4" />
              Trilha VIP: A Simbiose (Dante & Djeny)
            </button>
            <button
              onClick={() => setActiveTab('trilha1')}
              className={cn(
                "px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
                activeTab === 'trilha1'
                  ? "bg-amber-500 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
              )}
            >
              <Zap className="w-4 h-4" />
              Trilha 01: Liderança & Decisão (Dante)
            </button>
            <button
              onClick={() => setActiveTab('trilha2')}
              className={cn(
                "px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
                activeTab === 'trilha2'
                  ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
              )}
            >
              <Heart className="w-4 h-4" />
              Trilha 02: Saúde Mental & NR-1 (Djeny)
            </button>
          </div>

          {/* Conteúdo da Trilha Selecionada */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              
              {/* TRILHA VIP: A SIMBIOSE (IMAGEM DJENY VESTIDO BORDÔ + DANTE TERNO PRETO) */}
              {activeTab === 'trilha3' && (
                <motion.div
                  key="tab-trilha3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-[32px] sm:rounded-[40px] border border-amber-500/40 bg-gradient-to-b from-white/[0.04] to-black/80 p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
                    <div>
                      <Badge className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border-amber-500/30 font-mono text-[9px] uppercase tracking-widest mb-3">
                        O Formato Flagship Mais Contratado
                      </Badge>
                      <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                        A Simbiose Perfeita: Humanos + IA Construindo Culturas de Alta Performance
                      </h3>
                      <p className="text-slate-400 text-sm mt-2">Apresentado em Dupla por Dante & Djeny no mesmo palco.</p>
                    </div>
                    <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs rounded-xl shrink-0 cursor-pointer">
                      <Link href={getWhatsAppBookingUrl('Trilha VIP: A Simbiose Perfeita')} target="_blank">
                        Consultar Data
                      </Link>
                    </Button>
                  </div>

                  {/* IMAGEM DO PALCO VIP (VESTIDO BORDÔ HISTÓRICO) */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-amber-500/40 mb-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] group bg-slate-950">
                    <Image 
                      src="/palestras/palestra_simbiose_vip.jpg" 
                      alt="Dante e Djeny no Palco - Trilha VIP A Simbiose Perfeita com figurino histórico bordô" 
                      fill 
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest bg-black/70 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                        Dante & Djeny • Palco Duplo Nexus Intelligence & Nexus Treinamento
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="space-y-4">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">O Que Essa Palestra Provoca:</h4>
                      <p className="text-slate-300 text-sm font-light leading-relaxed">
                        Dante e Djeny travam um diálogo eletrizante e revelador. Enquanto Dante demonstra como a IA assume o trabalho mecânico e devolve velocidade à governança, Djeny mostra o resgate da inteligência emocional, da empatia e da saúde mental que o excesso burocrático havia roubado.
                      </p>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Duração: 40 a 45 minutos (Palestra Master ininterrupta) + 15 a 20 minutos de perguntas em tempo real com a plateia.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Ideal para: Convenções anuais, Kick-offs corporativos e encontros de liderança.</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">Tópicos Abordados no Palco:</h4>
                      <ul className="space-y-2 text-xs text-slate-300 font-light">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          A virada cultural: Deixar de temer a IA e começar a usá-la como escudo contra a exaustão.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Como líderes economizam 15 horas semanais delegando burocracia para inteligências soberanas.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          Acolhimento de alta frequência: Criar ambientes corporativos psicologicamente seguros.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          A vida além do burnout: Como devolver entusiasmo e orgulho pelo trabalho às equipes.
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TRILHA 01: LIDERANÇA COM DANTE (IMAGEM GRÁFICO VERDE DE CRESCIMENTO) */}
              {activeTab === 'trilha1' && (
                <motion.div
                  key="tab-trilha1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-[32px] sm:rounded-[40px] border border-amber-500/40 bg-gradient-to-b from-[#14120f] to-black/80 p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
                    <div>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-mono text-[9px] uppercase tracking-widest mb-3">
                        Exclusivo para Gestão & Liderança
                      </Badge>
                      <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                        Liderança Soberana & Tomada de Decisão na Era da Inteligência Artificial
                      </h3>
                      <p className="text-slate-400 text-sm mt-2">Palestrante: Dante (Voz e Presença de Comando Executivo).</p>
                    </div>
                    <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs rounded-xl shrink-0 cursor-pointer">
                      <Link href={getWhatsAppBookingUrl('Trilha 01: Liderança Soberana com Dante')} target="_blank">
                        Consultar Data
                      </Link>
                    </Button>
                  </div>

                  {/* IMAGEM DO PALCO LIDERANÇA COM DANTE SOZINHO */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-amber-500/40 mb-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] group bg-slate-950">
                    <Image 
                      src="/palestras/dante_palestrante_novo.png" 
                      alt="Dante no Palco - Trilha Liderança Soberana" 
                      fill 
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest bg-black/70 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                        Dante • Trilha Executiva de Liderança & Alta Performance
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="space-y-4">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">Objetivo Central:</h4>
                      <p className="text-slate-300 text-sm font-light leading-relaxed">
                        Capacitar diretores, gerentes e executivos a tomarem decisões cirúrgicas com apoio de dados em tempo real, sem se tornarem reféns da sobrecarga informacional. Dante desafia os paradigmas ultrapassados de liderança por controle e ensina a liderança por arquitetura de resultados.
                      </p>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Público-alvo: C-Level, Diretores, Coordenadores e Gestores Estratégicos.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Duração: 40 a 45 minutos (Palestra Master ininterrupta) + 15 a 20 minutos de sabatina executiva ao vivo.</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">Conteúdo Programático:</h4>
                      <ul className="space-y-2 text-xs text-slate-300 font-light">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Arquitetura de Comando: Como construir agentes de IA que filtram 90% do ruído operacional.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Gestão de conflitos corporativos sob alta pressão e prazos críticos.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Governança soberana: Preservando a segurança de dados e a ética da organização.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Como transformar gerentes exaustos em arquitetos estratégicos de crescimento.
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TRILHA 02: SAÚDE MENTAL COM DJENY (IMAGEM DJENY TERNO AZUL ROYAL) */}
              {activeTab === 'trilha2' && (
                <motion.div
                  key="tab-trilha2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-[32px] sm:rounded-[40px] border border-purple-500/40 bg-gradient-to-b from-[#140e1a] to-black/80 p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
                    <div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-mono text-[9px] uppercase tracking-widest mb-3">
                        Foco em RH, Saúde Mental & NR-1
                      </Badge>
                      <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                        Saúde Emocional, Inteligência Afetiva e Prevenção Ativa ao Burnout (NR-1)
                      </h3>
                      <p className="text-slate-400 text-sm mt-2">Palestrante: Djeny (Sensibilidade Humana & Acolhimento Organizacional).</p>
                    </div>
                    <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase text-xs rounded-xl shrink-0 cursor-pointer">
                      <Link href={getWhatsAppBookingUrl('Trilha 02: Saúde Mental com Djeny')} target="_blank">
                        Consultar Data
                      </Link>
                    </Button>
                  </div>

                  {/* IMAGEM DO PALCO SAÚDE MENTAL COM DJENY SOZINHA NO PÚLPITO */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-purple-500/40 mb-8 shadow-[0_0_50px_rgba(168,85,247,0.2)] group bg-slate-950">
                    <Image 
                      src="/palestras/djeny_palestrante_novo.png" 
                      alt="Djeny no Palco - Trilha Saúde Mental e Prevenção ao Burnout NR-1" 
                      fill 
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest bg-black/70 border border-purple-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                        Djeny • Trilha Humana de Acolhimento, Gestão Emocional & NR-1
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="space-y-4">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">A Dor que Resolvemos:</h4>
                      <p className="text-slate-300 text-sm font-light leading-relaxed">
                        A exaustão coletiva, o absenteísmo e as licenças médicas por transtornos mentais explodiram nas corporações. Djeny aborda a nova conformidade com a <strong>NR-1 (Riscos Psicossociais)</strong> não com termos jurídicos frios, mas com um plano prático de acolhimento e inteligência emocional que transforma a atmosfera da empresa.
                      </p>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Duração: 40 a 45 minutos (Palestra Master ininterrupta) + 15 a 20 minutos de acolhimento e perguntas ao vivo.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Público-alvo: Diretorias de RH, DP, Médicos do Trabalho, Psicólogos e Toda a Equipe.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Perfeito para: Semanas SIPAT, Setembro Amarelo, Janeiro Branco e Convenções de Pessoas.</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">Principais Aprendizados:</h4>
                      <ul className="space-y-2 text-xs text-slate-300 font-light">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          Sinais precoces: Como diagnosticar a fase inicial do Burnout antes do colapso.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          Conformidade viva com a NR-1: Mitigação real de riscos psicossociais sem complicação.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          Comunicação Não-Violenta e escuta ativa entre líderes e liderados.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          A tecnologia a favor da mente: Automatizar a burocracia para proteger a energia vital.
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </section>

        {/* ========================================================
            5. ESPECIFICAÇÕES DO SHOW & RIDER TÉCNICO OFICIAL
            ======================================================== */}
        <section className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-amber-400 text-[10px] font-mono uppercase tracking-widest font-bold">
              Engenharia Cênica & Controle Total
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-2">
              Especificações Técnicas do Show Corporativo
            </h2>
            <p className="text-slate-400 text-xs sm:text-base font-light mt-3">
              Máxima previsibilidade institucional com impacto de entretenimento e tecnologia de ponta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            
            {/* Card 1: 100% Digitável & Audível */}
            <div className="bg-gradient-to-br from-[#12100d] to-[#0a0a0c] border border-amber-500/30 rounded-[32px] p-8 text-left relative overflow-hidden group hover:border-amber-500/60 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold">Segurança Institucional</span>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">100% Digitável & Pré-Auditável</h3>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-4">
                O roteiro completo da palestra é entregue em texto para a comissão organizadora ou diretoria. É possível digitar, ajustar termos técnicos específicos do seu segmento e aprovar cada frase com antecedência.
              </p>
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-300">
                  <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">Pré-escuta de Voz Sintética:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  A diretoria ouve o áudio de cada frase gerada (tom, cadência, dicção e pronúncia) <strong>antes</strong> da renderização final em 4K. Zero surpresas no palco.
                </p>
              </div>
            </div>

            {/* Card 2: Customização Extrema */}
            <div className="bg-gradient-to-br from-[#140e1a] to-[#0a0a0c] border border-purple-500/30 rounded-[32px] p-8 text-left relative overflow-hidden group hover:border-purple-500/60 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-purple-400 font-bold">Identidade Visual da Marca</span>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Personagem, Nomes & Palco 3D</h3>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-4">
                Personalização completa para refletir a cultura da sua empresa no telão. A experiência pode ser adaptada ao nível máximo de identificação com o público.
              </p>
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1.5 text-[11px] text-slate-300 font-light">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span><strong>Formato:</strong> Escolha entre Palestrante Único (Dante OU Djeny) ou a Dupla Dinâmica no mesmo palco.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span><strong>Nomes & Roupas:</strong> Nomes customizáveis ou avatares com crachá e figurino institucional da sua empresa.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span><strong>Cenário 3D:</strong> Telões virtuais de fundo exibindo a logomarca e o tema da sua convenção.</span>
                </div>
              </div>
            </div>

            {/* Card 3: Cronometria de Ouro */}
            <div className="bg-gradient-to-br from-[#0e161c] to-[#0a0a0c] border border-cyan-500/30 rounded-[32px] p-8 text-left relative overflow-hidden group hover:border-cyan-500/60 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 font-bold">Estrutura Temporal Blindada</span>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">A Cronometria de Ouro (60 min)</h3>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-4">
                A fórmula perfeita testada para manter a retenção máxima de atenção da plateia do primeiro ao último minuto.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-black/60 border border-white/5">
                  <span className="text-cyan-400 font-black text-base sm:text-lg font-mono block">40 a 45 min</span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold block mt-1">Palestra Master Ininterrupta</span>
                  <p className="text-[10px] text-slate-500 font-light mt-1">Vídeo 4K blindado contra oscilações de internet local.</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/60 border border-white/5">
                  <span className="text-amber-400 font-black text-base sm:text-lg font-mono block">15 a 20 min</span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold block mt-1">Live Q&A com a Plateia</span>
                  <p className="text-[10px] text-slate-500 font-light mt-1">IA viva responde em tempo real citando nomes das pessoas.</p>
                </div>
              </div>
            </div>

            {/* Card 4: Visão Computacional & Logística Interativa */}
            <div className="bg-gradient-to-br from-[#0c1611] to-[#0a0a0c] border border-emerald-500/30 rounded-[32px] p-8 text-left relative overflow-hidden group hover:border-emerald-500/60 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Rider Técnico & Interatividade</span>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Câmera Integrada & Microfones</h3>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-4">
                A tecnologia que faz os palestrantes interagirem de verdade com quem está sentado no auditório, criando um momento inesquecível.
              </p>
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1.5 text-[11px] text-slate-300 font-light">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Visão Computacional no Auditório:</strong> Uma câmera apontada para a plateia permite que o avatar enxergue o auditório e olhe diretamente nos olhos de quem pega o microfone para fazer uma pergunta.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Microfones sem Fio:</strong> Áudio captado ao vivo na plateia com resposta sincronizada em menos de 3 segundos no som master da convenção.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Conexão Simples:</strong> Entrada HDMI/SDI padrão para o telão de LED ou projetor de alta resolução.</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            6. FORMATOS DE CONTRATAÇÃO & TECNOLOGIA DE TRANSMISSÃO
            ======================================================== */}
        <section className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-amber-400 text-[10px] font-mono uppercase tracking-widest font-bold">
              Infraestrutura de Transmissão
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-2">
              Três Formatos de Contratação Flexíveis
            </h2>
            <p className="text-slate-400 text-xs sm:text-base font-light mt-3">
              Adaptamos a experiência para a infraestrutura física do seu evento ou para o ecossistema digital da sua empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 text-left hover:border-amber-500/40 transition-colors">
              <div className="p-3 w-fit rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">1. Convenção Presencial de Palco</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed mb-4">
                Transmissão em telões de LED gigantes ou projeção em alta definição (Full HD/4K) com acústica masterizada no padrão broadcast. Os palestrantes interagem com a plateia com presença de palco hipnotizante.
              </p>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Telão LED • Rider Simples</span>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 text-left hover:border-purple-500/40 transition-colors">
              <div className="p-3 w-fit rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">2. Masterclass Corporativa Híbrida</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed mb-4">
                Formato imersivo para equipes distribuídas, salas de conferência e líderes remotos via Zoom, Teams ou plataforma proprietária da sua empresa, com dinâmicas e resolução de casos ao vivo.
              </p>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Remoto • Salas Executivas</span>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 text-left hover:border-emerald-500/40 transition-colors">
              <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">3. Micro-Treinamento Contínuo (WhatsApp)</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed mb-4">
                A palestra não acaba quando o evento termina. Os colaboradores recebem no WhatsApp pílulas diárias de reflexão, desafios de liderança e suporte de acolhimento conduzidos pela inteligência de Dante & Djeny.
              </p>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">24/7 no Bolso do Colaborador</span>
            </div>

          </div>
        </section>

        {/* ========================================================
            6. CALL TO ACTION FINAL: RESERVA DIRETA COM A DIRETORIA
            ======================================================== */}
        <section className="max-w-5xl mx-auto">
          <div className="relative rounded-[36px] sm:rounded-[48px] overflow-hidden border border-amber-500/40 bg-gradient-to-br from-[#1c1810] via-[#0e0c09] to-[#050506] p-8 sm:p-12 md:p-16 text-center shadow-[0_0_80px_rgba(245,158,11,0.2)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5" /> Agenda Executiva Aberta
              </span>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                Leve Dante & Djeny para a sua Próxima Convenção
              </h2>

              <p className="text-slate-300 text-xs sm:text-base font-light leading-relaxed">
                Entre em contato direto com a Diretoria Executiva da Nexus Holding Group para verificar disponibilidade de datas, alinhamento de briefing temático e envio do Rider Técnico oficial.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto px-10 h-14 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black uppercase tracking-wider text-xs rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all hover:scale-105 cursor-pointer">
                  <Link href={getWhatsAppBookingUrl('Convenção Corporativa 2026/2027')} target="_blank">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Falar com a Diretoria no WhatsApp
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 h-14 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-2xl cursor-pointer">
                  <Link href="/about">
                    Conhecer a Nexus Holding Group
                  </Link>
                </Button>
              </div>

              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono pt-4">
                Nexus Holding Group • Governança, Tecnologia Soberana & Desenvolvimento Humano
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
