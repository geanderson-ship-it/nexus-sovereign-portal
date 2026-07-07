'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, 
  Sparkles, 
  Building, 
  UtensilsCrossed, 
  Palmtree, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Clock,
  Globe,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';

export default function NexusRotasHubPage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden pt-28 pb-20">

      {/* === FULL PAGE BACKGROUND === */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/rotas-hub-showcase.png"
          alt="Painel central do ecossistema de rotas inteligentes"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-teal-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto py-12">
          
          <div className="mb-8 w-full max-w-3xl mx-auto rounded-3xl overflow-hidden border border-teal-500/40 shadow-[0_0_50px_rgba(20,184,166,0.3)] bg-black/50 backdrop-blur-md relative">
            <CustomVideoPlayer 
              src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Vitoria_Embaixadora.mp4" 
              className="w-full h-auto object-cover rounded-3xl"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-300 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse shadow-[0_0_20px_rgba(20,184,166,0.3)] backdrop-blur-sm">
            <Compass className="w-4 h-4 text-teal-400" />
            Ecossistema Turístico Unificado
          </div>
          
          <h1 className="font-headline text-4xl sm:text-6xl font-black tracking-tight leading-none text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)] mb-3">
            NEXUS ROTAS
          </h1>
          
          <p className="mt-4 text-teal-300 font-bold uppercase tracking-[0.2em] text-sm sm:text-base drop-shadow-md">
            Uma única inteligência. Todos os caminhos.
          </p>
          
          <p className="mt-6 text-white/80 text-lg sm:text-xl max-w-3xl leading-relaxed drop-shadow">
            Bem-vindo ao centro nervoso do turismo inteligente. O **Nexus Rotas** unifica a gestão pública, o setor de hotelaria, a gastronomia local e as atrações turísticas em uma única rede guiada por Inteligência Artificial Soberana. 
          </p>
        </section>

        {/* SHOWCASE SECTION */}
        <section className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden mb-12 shadow-[0_0_60px_rgba(20,184,166,0.2)] border border-teal-500/20 bg-black/40 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center">
          <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-teal-400/30 shadow-[0_0_40px_rgba(20,184,166,0.25)] backdrop-blur-sm group">
            <Image
              src="/images/rotas-hub-bg.png"
              alt="Mapa holográfico de uma cidade inteligente conectada"
              width={1200}
              height={600}
              className="w-full h-[400px] sm:h-[560px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-white font-black text-sm uppercase tracking-widest drop-shadow">Gestão Integrada de Cidades Turísticas</span>
                <span className="text-teal-300 text-xs font-medium">Controle Cívico · Hotelaria · Gastronomia · Atrações</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-600/80 border border-teal-400/50 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Ecossistema Ativo
              </div>
            </div>
          </div>
        </section>

        {/* 4 PORTALS SECTIONS (Premium Interactive Glassmorphism Cards with Background Images) */}
        <section className="py-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Embaixadora Virtual (Blue Theme - Smiling with Tablet showing Aurora) */}
            <div className="relative p-8 rounded-3xl border border-zinc-700/60 bg-black/70 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-[390px] overflow-hidden">
              
              {/* Card Background Image */}
              <div className="absolute inset-0 -z-10">
                <Image 
                  src="/images/card-embaixadora-bg.png" 
                  alt="Usuário sorrindo com tablet mostrando avatar Aurora" 
                  fill 
                  className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 group-hover:via-black/50 group-hover:to-black/35 transition-colors duration-500" />
              </div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded-md bg-blue-950/40 backdrop-blur-sm shadow-md">Setor Público</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-wider mb-3 text-white transition-colors group-hover:text-blue-400 drop-shadow">A Embaixadora Virtual</h3>
                <p className="text-zinc-300 text-sm leading-relaxed drop-shadow">
                  A cara e a voz cívica da cidade na internet. Uma inteligência artificial integrada aos canais oficiais da prefeitura para dar as boas-vindas aos viajantes, contar histórias locais e promover eventos municipais de forma fluida e acessível.
                </p>
              </div>
              <div className="mt-6">
                <Button className="w-full bg-blue-600/95 hover:bg-blue-500 text-white font-bold h-11 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]" asChild>
                  <Link href="/nexus-rotas/embaixadora">
                    Acessar Solução Pública
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 2: Guia de Hotéis (Emerald Theme - Cozy Luxury Room) */}
            <div className="relative p-8 rounded-3xl border border-zinc-700/60 bg-black/70 backdrop-blur-xl hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-[390px] overflow-hidden">
              
              {/* Card Background Image */}
              <div className="absolute inset-0 -z-10">
                <Image 
                  src="/images/card-hoteis-bg.png" 
                  alt="Quarto de hotel luxuoso e confortável" 
                  fill 
                  className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 group-hover:via-black/50 group-hover:to-black/35 transition-colors duration-500" />
              </div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-md bg-emerald-950/40 backdrop-blur-sm shadow-md">Hospitalidade</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-wider mb-3 text-white transition-colors group-hover:text-emerald-400 drop-shadow">Guia de Hotéis</h3>
                <p className="text-zinc-300 text-sm leading-relaxed drop-shadow">
                  O concierge inteligente exclusivo para hotéis e resorts. Automatize em até 80% as tarefas e dúvidas repetitivas na recepção (Wi-Fi, café da manhã, toalhas) através de totens físicos de lobby de alta definição ou pelo WhatsApp do hotel.
                </p>
              </div>
              <div className="mt-6">
                <Button className="w-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold h-11 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]" asChild>
                  <Link href="/nexus-rotas/hoteis">
                    Acessar Solução Hoteleira
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 3: Rota Gastronômica (Amber Theme - Premium Seafood Plate) */}
            <div className="relative p-8 rounded-3xl border border-zinc-700/60 bg-black/70 backdrop-blur-xl hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-[390px] overflow-hidden">
              
              {/* Card Background Image */}
              <div className="absolute inset-0 -z-10">
                <Image 
                  src="/images/card-gastronomia-bg.png" 
                  alt="Prato de frutos do mar gourmet e luxuoso" 
                  fill 
                  className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 group-hover:via-black/50 group-hover:to-black/35 transition-colors duration-500" />
              </div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-md bg-amber-950/40 backdrop-blur-sm shadow-md">Gastronomia</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-wider mb-3 text-white transition-colors group-hover:text-amber-400 drop-shadow">Rota Gastronômica</h3>
                <p className="text-zinc-300 text-sm leading-relaxed drop-shadow">
                  A rota de sabores inteligente. Indique os melhores restaurantes, bares, cafeterias e bistrôs da região. Permita que comércios locais paguem mensalidades ou comissões para estarem no topo das indicações personalizadas da nossa inteligência.
                </p>
              </div>
              <div className="mt-6">
                <Button className="w-full bg-amber-600/90 hover:bg-amber-500 text-white font-bold h-11 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]" asChild>
                  <Link href="/nexus-rotas/gastronomia">
                    Acessar Rota Comercial
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 4: Guia de Atrações (Pink Theme - Scenic Cable Car/Teleférico) */}
            <div className="relative p-8 rounded-3xl border border-zinc-700/60 bg-black/70 backdrop-blur-xl hover:border-pink-500/50 hover:shadow-[0_0_35px_rgba(236,72,153,0.25)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-[390px] overflow-hidden">
              
              {/* Card Background Image */}
              <div className="absolute inset-0 -z-10">
                <Image 
                  src="/images/card-atracoes-bg.png" 
                  alt="Teleférico deslizando sobre a orla turística" 
                  fill 
                  className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 group-hover:via-black/50 group-hover:to-black/35 transition-colors duration-500" />
              </div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    <Palmtree className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-pink-300 border border-pink-500/40 px-2.5 py-1 rounded-md bg-pink-950/40 backdrop-blur-sm shadow-md">Lazer & Atrações</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-wider mb-3 text-white transition-colors group-hover:text-pink-400 drop-shadow">Guia de Atrações</h3>
                <p className="text-zinc-300 text-sm leading-relaxed drop-shadow">
                  Guie o turista pelos melhores pontos turísticos, agências de passeios de lancha, parques e trilhas da cidade. A IA cria roteiros personalizados com base no clima, dia da semana e preferências, integrando rotas de GPS direto no telefone.
                </p>
              </div>
              <div className="mt-6">
                <Button className="w-full bg-pink-600/90 hover:bg-pink-500 text-white font-bold h-11 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]" asChild>
                  <Link href="/nexus-rotas/atracoes">
                    Acessar Guia de Passeios
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </section>

        {/* BOTTOM METRICS */}
        <section className="py-16 max-w-5xl mx-auto border-t border-zinc-800/60 mt-12 text-center">
          <h2 className="text-3xl font-black uppercase tracking-wider text-white mb-10 drop-shadow-md">
            A Força do Turismo Conectado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Metric 1 - Ampulheta */}
            <div className="relative p-6 rounded-2xl border border-zinc-700/60 bg-black/60 backdrop-blur-md shadow-xl flex flex-col items-center text-center hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[240px] group">
              <div className="absolute inset-0 -z-10">
                <Image src="/images/metric-ampulheta.png" alt="Ampulheta de cristal" fill className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
              </div>
              <span className="block text-5xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">80%</span>
              <span className="text-sm font-black text-white uppercase tracking-widest mt-3 block">Economia de Recepção</span>
              <p className="text-zinc-300 text-xs mt-2 leading-relaxed max-w-[280px]">
                Automação inteligente de respostas sobre Wi-Fi, checkout e serviços, liberando sua equipe para atendimentos de alta prioridade.
              </p>
            </div>

            {/* Metric 2 - Globo */}
            <div className="relative p-6 rounded-2xl border border-zinc-700/60 bg-black/50 backdrop-blur-md shadow-xl flex flex-col items-center text-center hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[240px] group">
              <div className="absolute inset-0 -z-10">
                <Image src="/images/metric-globo.jpg" alt="Globo holográfico digital" fill className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              </div>
              <span className="block text-5xl font-black text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">10+</span>
              <span className="text-sm font-black text-white uppercase tracking-widest mt-3 block">Idiomas Nativos</span>
              <p className="text-zinc-300 text-xs mt-2 leading-relaxed max-w-[280px]">
                Tradução instantânea e natural da nossa IA para turistas estrangeiros receberem um suporte digno de embaixada de luxo.
              </p>
            </div>

            {/* Metric 3 - Check-in Feliz */}
            <div className="relative p-6 rounded-2xl border border-zinc-700/60 bg-black/50 backdrop-blur-md shadow-xl flex flex-col items-center text-center hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[240px] group">
              <div className="absolute inset-0 -z-10">
                <Image src="/images/metric-checkin.jpg" alt="Hóspede feliz fazendo check-in no hotel" fill className="object-cover opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
              </div>
              <span className="block text-5xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">100%</span>
              <span className="text-sm font-black text-white uppercase tracking-widest mt-3 block">Vendas Rastreáveis</span>
              <p className="text-zinc-300 text-xs mt-2 leading-relaxed max-w-[280px]">
                Monitoramento transparente de comissões por vouchers vendidos e indicações de consumo no comércio local de turismo.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
