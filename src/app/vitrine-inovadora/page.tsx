'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Sparkles, Store, ShoppingBag, Tv, Sofa, Building, ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const industries = [
  {
    id: 'moda',
    name: 'Fashion Week',
    audience: 'Inova Moda',
    icon: ShoppingBag,
    image: '/Vitrini inovadora/desfile de modas.webp',
    description: 'Avatares exclusivos desfilando as últimas tendências das passarelas globais.',
    color: 'from-fuchsia-500 to-pink-600',
    qrText: 'Comprar Look'
  },
  {
    id: 'eletro',
    name: 'Eletrodomésticos',
    audience: 'Inova Eletro',
    icon: Tv,
    image: '/Vitrini inovadora/Eletrodomésticos.jpg',
    kioskImage: '/Vitrini inovadora/eletrodomesticos 2.jpg',
    description: 'Geladeiras inteligentes, TVs OLED e alta tecnologia para o seu lar.',
    color: 'from-blue-500 to-cyan-600',
    qrText: 'Ver Produto'
  },
  {
    id: 'moveis',
    name: 'Móveis & Design',
    audience: 'Inova Móveis',
    icon: Sofa,
    image: '/Vitrini inovadora/Moveis.jpg',
    kioskImage: '/Vitrini inovadora/Moveis 2.jpg',
    description: 'Sofás, estantes e camas com design de luxo e extremo conforto.',
    color: 'from-amber-500 to-orange-600',
    qrText: 'Decorar Casa'
  },
  {
    id: 'imoveis',
    name: 'Alto Padrão',
    audience: 'Inova Estates',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
    kioskImage: '/Vitrini inovadora/Imóveis.jpg',
    description: 'Mansões exclusivas e coberturas projetadas para a elite.',
    color: 'from-emerald-500 to-teal-600',
    qrText: 'Agendar Visita'
  }
];

export default function VitrineInovadoraHub() {
  const [activeKiosk, setActiveKiosk] = useState<string | null>(null);

  // MODO KIOSK (TELA CHEIA)
  if (activeKiosk) {
    const activeIndustry = industries.find(i => i.id === activeKiosk)!;
    const ActiveIcon = activeIndustry.icon;

    return (
      <div className="fixed inset-0 w-full h-full bg-black overflow-hidden flex font-sans z-50">
        
        {/* BOTÃO VOLTAR PARA O HUB (Apenas para o operador) */}
        <button 
          onClick={() => setActiveKiosk(null)}
          className="absolute top-8 left-8 z-50 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-widest uppercase">Voltar ao Hub</span>
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={activeIndustry.kioskImage || activeIndustry.image}
              alt={activeIndustry.name}
              fill
              priority
              className="object-contain object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* REMOVIDO OVERLAY ESCURO E TEXTOS GIGANTES PARA DEIXAR A IMAGEM BRILHAR */}


        {/* QR CODE FLUTUANTE (Canto Inferior Esquerdo) */}
        <div className="absolute bottom-6 left-6 z-30 flex flex-col items-start scale-50 origin-bottom-left md:scale-75 lg:scale-90">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-black/40 backdrop-blur-2xl border border-white/20 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-4"
          >
            <div className="text-center">
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1 drop-shadow-lg">Gostou?</h3>
              <p className={`text-xs font-black uppercase bg-clip-text text-transparent bg-gradient-to-r ${activeIndustry.color}`}>
                Compre pelo WhatsApp
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-2xl shadow-inner relative group cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all">
              <div className="w-36 h-36 bg-black grid grid-cols-5 gap-1 p-2 rounded-xl">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`bg-white rounded-sm ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`} />
                ))}
                <div className="absolute top-3 left-3 w-8 h-8 bg-white border-[6px] border-black rounded-lg" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white border-[6px] border-black rounded-lg" />
                <div className="absolute bottom-3 left-3 w-8 h-8 bg-white border-[6px] border-black rounded-lg" />
              </div>
              <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <ScanLine className="w-12 h-12 text-black mb-1" />
                <span className="text-black font-black uppercase tracking-widest text-xs text-center px-2">{activeIndustry.qrText}</span>
              </div>
            </div>

            <div className={`flex items-center gap-2 text-white bg-gradient-to-r ${activeIndustry.color} px-4 py-2.5 rounded-full w-full justify-center shadow-lg`}>
              <ScanLine className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Aponte a Câmera</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // MODO HUB (LANDING PAGE)
  return (
    <div className="min-h-screen bg-neutral-600 font-sans">
      
      {/* HEADER SIMPLES PARA VOLTAR AO SITE */}
      <header className="absolute top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold text-sm tracking-widest uppercase">Voltar ao Nexus</span>
        </Link>
      </header>

      {/* HERO SECTION GIGANTE */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Premium Abstract - Surpresa para a Mamãe */}
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <Image 
            src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=2560&q=80" 
            alt="Hero Background" 
            fill 
            priority
            className="object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-600/60 to-neutral-600" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          
          {/* CARD DO TÍTULO (FROSTED GLASS) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/40 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center"
          >
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full mb-6 shadow-xl">
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              <span className="text-white font-bold tracking-[0.2em] uppercase text-xs md:text-sm">Sinalização Digital de Alto Padrão</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
              Vitrine <br className="md:hidden" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]">
                Inovadora
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-300 font-light max-w-2xl drop-shadow-md">
              Selecione a franquia abaixo para iniciar a transmissão do painel interativo na sua vitrine.
            </p>
          </motion.div>

        </div>
      </section>

      {/* GRID DE CARDS DAS INDÚSTRIAS */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 pb-32 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((ind, index) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                onClick={() => setActiveKiosk(ind.id)}
                className="group relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl bg-neutral-900 border border-white/5 hover:border-white/20 transition-all duration-500"
              >
                {/* Imagem do Card */}
                <Image 
                  src={ind.image} 
                  alt={ind.name} 
                  fill 
                  className="object-contain object-center transition-transform duration-700 opacity-90 group-hover:opacity-100 brightness-110 p-2"
                />
                
                {/* Overlay escuro para leitura do texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

                {/* Conteúdo do Card */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-white/70 uppercase tracking-[0.2em] mb-2 group-hover:text-white transition-colors">
                      {ind.audience}
                    </h3>
                    <h2 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tight mb-4 whitespace-nowrap group-hover:-translate-y-2 transition-transform duration-300">
                      {ind.name}
                    </h2>
                    
                    {/* Botão Ativar que aparece no Hover */}
                    <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span>Iniciar Painel</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
