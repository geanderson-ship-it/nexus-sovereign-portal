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

export default function VitrineInovadoraPage() {
  const [activeKiosk, setActiveKiosk] = useState<string | null>(null);

  // MODO KIOSK (TELA CHEIA)
  if (activeKiosk) {
    const activeIndustry = industries.find(i => i.id === activeKiosk)!;
    const ActiveIcon = activeIndustry.icon;

    return (
      <div className="fixed inset-0 w-full h-full bg-black overflow-y-auto flex flex-col font-sans z-50">
        
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


        {/* CARD EXPLICATIVO DO QR CODE */}
        <div className="relative z-10 mt-[100vh] mx-auto w-full max-w-2xl px-6 py-12">
          <div className="relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center text-center gap-6 p-8">
            
            {/* Imagem de fundo do card */}
            <div className="absolute inset-0 -z-10">
              <Image
                src={
                  activeIndustry.id === 'moda' ? '/Vitrini inovadora/Faschion week.webp' :
                  activeIndustry.id === 'eletro' ? '/Vitrini inovadora/eletrodomesticos 2.jpg' :
                  activeIndustry.id === 'moveis' ? '/Vitrini inovadora/Moveis 2.jpg' :
                  '/Vitrini inovadora/Imóveis.jpg'
                }
                alt={activeIndustry.name}
                fill
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeIndustry.color} flex items-center justify-center shadow-lg`}>
              <ActiveIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wide">{activeIndustry.name}</h2>
            <p className="text-neutral-300 text-base leading-relaxed">
              Aponte a câmera do seu celular para o <strong className="text-white">QR Code</strong> exibido na tela e seja direcionado instantaneamente para um de nossos <strong className="text-white">vendedores especializados</strong> via <strong className="text-green-400">WhatsApp</strong>.
            </p>
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="text-white font-bold text-sm">Passo 1 — Abra a câmera</p>
                  <p className="text-neutral-400 text-xs">Abra a câmera do seu celular normalmente, sem precisar de nenhum aplicativo extra.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-white font-bold text-sm">Passo 2 — Aponte para o QR Code</p>
                  <p className="text-neutral-400 text-xs">Aponte a câmera para o QR Code exibido no painel. Um link aparecerá automaticamente na tela.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-white font-bold text-sm">Passo 3 — Fale com um vendedor</p>
                  <p className="text-neutral-400 text-xs">Você será direcionado diretamente para o <strong className="text-green-400">WhatsApp</strong> de um vendedor da loja, pronto para te atender em tempo real.</p>
                </div>
              </div>
            </div>
            <p className="text-neutral-500 text-xs italic">
              Atendimento humano e personalizado. Sem robôs, sem filas. Um especialista real esperando por você.
            </p>

            {/* CARD WHATSAPP */}
            <div className="w-full bg-green-500/10 border border-green-500/30 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <h3 className="text-white font-black text-base mb-1">Quero essa vitrine na minha loja</h3>
              <p className="text-neutral-400 text-xs leading-relaxed mb-4">Fale agora com um especialista Nexus e leve a sinalização digital de alto padrão para o seu negócio.</p>
              <button
                onClick={() => window.open(`https://wa.me/5551999799582?text=Ol%C3%A1!%20Vi%20a%20vitrine%20de%20${encodeURIComponent(activeIndustry.name)}%20e%20tenho%20interesse%20para%20minha%20loja.%20Pode%20me%20enviar%20mais%20informa%C3%A7%C3%B5es%3F`, '_blank')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase tracking-widest shadow-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>

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
      


      {/* HERO SECTION GIGANTE */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* MOSAICO DE FUNDO */}
        <div className="fixed inset-0 z-0 grid grid-cols-4 grid-rows-2">
          <div className="relative overflow-hidden">
            <Image src="/Vitrini inovadora/Eletrodomésticos.jpg" alt="Eletrodomésticos" fill className="object-cover brightness-75" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/Vitrini inovadora/desfile de modas.webp" alt="Moda" fill className="object-cover brightness-75" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/Vitrini inovadora/Imóveis.jpg" alt="Imóveis" fill className="object-cover brightness-75" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/Vitrini inovadora/Moveis.jpg" alt="Móveis" fill className="object-cover brightness-75" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/Vitrini inovadora/eletrodomesticos 2.jpg" alt="Eletrodomésticos 2" fill className="object-cover brightness-75" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/Vitrini inovadora/Faschion week.webp" alt="Fashion Week" fill className="object-cover brightness-75" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/Vitrini inovadora/Moveis 2.jpg" alt="Móveis 2" fill className="object-cover brightness-75" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/Vitrini inovadora/Eletrodomesticos.webp" alt="Eletrodomésticos 3" fill className="object-cover brightness-75" />
          </div>
        </div>
        <div className="fixed inset-0 bg-black/50 z-0" />

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          
            {/* CARD DO TÍTULO (FROSTED GLASS) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-black/40 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center"
            >
              <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-fuchsia-500/30 shadow-[0_0_40px_rgba(217,70,239,0.3)] bg-black/50 relative mb-8">
                <CustomVideoPlayer 
                  src="/Vitrine Inovadora/Camila_-_Vitrini_inovadora..mp4" 
                  className="w-full h-auto object-cover"
                />
              </div>

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
      <section className="relative z-20 max-w-5xl mx-auto px-6 pb-12 pt-12 md:pt-16">
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

      {/* CARD WHATSAPP HUB */}
      <div className="relative z-20 max-w-2xl mx-auto px-6 pb-32">
        <div className="bg-black/70 backdrop-blur-md border border-green-500/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <h3 className="text-xl font-black text-white mb-2">Quero a Vitrine Inovadora na minha loja</h3>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            Fale agora com um especialista Nexus e leve a sinalização digital de alto padrão para o seu negócio. Atendimento imediato via WhatsApp.
          </p>
          <button
            onClick={() => window.open('https://wa.me/5551999799582?text=Ol%C3%A1!%20Tenho%20interesse%20na%20Vitrine%20Inovadora%20para%20minha%20loja.%20Pode%20me%20enviar%20mais%20informa%C3%A7%C3%B5es%3F', '_blank')}
            className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] text-sm uppercase tracking-widest"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Falar com Especialista
          </button>
        </div>
      </div>

    </div>
  );
}
