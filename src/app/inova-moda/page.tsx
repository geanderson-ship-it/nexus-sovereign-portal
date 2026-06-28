'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Ruler, ShieldAlert, Sparkles, CheckCircle2, ChevronLeft, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const styleOptions = [
  { id: 1, name: 'Masculina', image: 'https://images.unsplash.com/photo-1516195851555-2f8f9e74c82c?auto=format&fit=crop&w=800&q=80', recommendedSize: 'Adulto M', availableSizes: ['Adulto P', 'Adulto M', 'Adulto G', 'Adulto GG'] },
  { id: 2, name: 'Feminina', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', recommendedSize: 'Adulto P', availableSizes: ['Adulto PP', 'Adulto P', 'Adulto M', 'Adulto G'] },
  { id: 3, name: 'Infantil', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80', recommendedSize: '6 Anos', availableSizes: ['2 Anos', '4 Anos', '6 Anos', '8 Anos', '10 Anos'] },
  { id: 4, name: 'Adulto', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80', recommendedSize: 'Adulto M', availableSizes: ['P', 'M', 'G', 'GG'] },
  { id: 5, name: 'Moda Festa', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80', recommendedSize: 'Adulto P', availableSizes: ['36', '38', '40', '42'] },
  { id: 6, name: 'Coleção de Inverno', image: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=800&q=80', recommendedSize: 'Adulto G', availableSizes: ['P', 'M', 'G', 'GG'] },
  { id: 7, name: 'Lingerie', image: 'https://images.unsplash.com/photo-1606775677028-090c2912443d?auto=format&fit=crop&w=800&q=80', recommendedSize: 'Adulto M', availableSizes: ['P', 'M', 'G', 'GG'] },
  { id: 8, name: 'Moda Praia', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80', recommendedSize: 'Adulto M', availableSizes: ['P', 'M', 'G', 'GG'] },
  { id: 9, name: 'Verão', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', recommendedSize: 'Adulto M', availableSizes: ['P', 'M', 'G'] },
  { id: 10, name: 'Plus Size', image: 'https://images.pexels.com/photos/5713437/pexels-photo-5713437.jpeg?auto=compress&cs=tinysrgb&w=800', recommendedSize: 'Plus Size G2', availableSizes: ['G1', 'G2', 'G3', 'G4'] },
  { id: 11, name: 'Alta Costura', image: 'https://images.unsplash.com/photo-1550614000-4b95d8822d1f?auto=format&fit=crop&w=800&q=80', recommendedSize: '48', availableSizes: ['44', '46', '48', '50'] }
];

export default function InovaModaApp() {
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showWaiver, setShowWaiver] = useState(false);

  const startGpuScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setSelectedSize(selectedStyle.recommendedSize);
    }, 3500);
  };

  const handleStyleSelect = (style: any) => {
    setSelectedStyle(style);
    setIsScanning(false);
    setScanComplete(false);
    setSelectedSize(null);
    setShowWaiver(false);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (scanComplete && size !== selectedStyle.recommendedSize) {
      setShowWaiver(true);
    } else {
      setShowWaiver(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 font-sans text-neutral-100 flex flex-col md:flex-row">
      
      {/* LADO ESQUERDO: O PROVADOR VIRTUAL (A ÚNICA IMAGEM) */}
      <div className="flex-1 relative flex flex-col bg-black border-r border-white/5 pb-12">
        
        {/* Header Voltar */}
        <div className="w-full z-40 bg-black p-6 pb-2">
          <Link href="/vitrine-inovadora" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Voltar à Vitrine</span>
          </Link>
        </div>

        {/* Card de Título Fora da Imagem */}
        <div className="w-full px-6 pt-6 pb-2 z-30">
          <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-8 shadow-xl backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-amber-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.4)]">
              Inova Moda
            </h1>
            <p className="mt-4 text-xl md:text-3xl text-neutral-300 font-light tracking-wide leading-relaxed">
              Você quer um estilo... <br/>
              <span className="font-black text-white text-3xl md:text-5xl tracking-tight mt-2 block">nós te apresentamos todos.</span>
            </p>
          </div>
        </div>

        {/* A Imagem Única Central (Espelho) */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative w-full max-w-[450px] aspect-[3/4] bg-neutral-900 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-[0_0_50px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/20">
            
            <Image 
              src={selectedStyle.image} 
              alt={selectedStyle.name} 
              fill 
              className="object-cover object-top transition-all duration-1000 ease-in-out"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            {/* Título do Estilo no Espelho */}
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <div className="inline-block bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full text-white font-bold tracking-widest uppercase text-sm mb-4">
                Estilo Atual: {selectedStyle.name}
              </div>
            </div>

            {/* Efeito de Laser Biométrico */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                  className="absolute left-0 w-full h-1 bg-green-500 shadow-[0_0_30px_#22c55e] z-10"
                />
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* 3 Cards Explicativos */}
        <div className="w-full px-8 mt-2 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-neutral-800 transition-colors group">
            <div className="bg-purple-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <ScanLine className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-black text-white mb-2 uppercase text-sm tracking-widest">Biometria de Alta Precisão</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Nossa IA extrai suas medidas corporais exatas através de um escaneamento visual avançado por vídeo.
            </p>
          </div>

          <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-neutral-800 transition-colors group">
            <div className="bg-pink-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Ruler className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="font-black text-white mb-2 uppercase text-sm tracking-widest">Caimento Perfeito</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Análise inteligente de proporções para garantir o ajuste impecável e o tamanho ideal para o seu corpo.
            </p>
          </div>

          <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-neutral-800 transition-colors group">
            <div className="bg-amber-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="font-black text-white mb-2 uppercase text-sm tracking-widest">Provador Realista</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Vista-se da cabeça aos pés e veja o resultado final como se estivesse diante de um espelho de verdade.
            </p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: CONTROLES, CARDS PEQUENOS E BIOMETRIA */}
      <div className="w-full md:w-[450px] shrink-0 bg-neutral-900 flex flex-col pb-12">
        
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Selecione o Estilo</h2>
          </div>

          {/* Grid de Cards Textuais */}
          <div className="flex flex-wrap gap-2 mb-8">
            {styleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style)}
                className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 ${
                  selectedStyle.id === style.id 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] scale-105' 
                    : 'bg-neutral-800 text-neutral-300 border border-white/5 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />
        </div>

        {/* Módulo de Inteligência Artificial */}
        <div className="flex-1 p-8 pt-0 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <ScanLine className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Análise de Caimento</h2>
          </div>

          {!scanComplete && !isScanning && (
            <div className="bg-neutral-800/50 border border-white/5 rounded-2xl p-6 text-center">
              <Camera className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <p className="text-sm text-neutral-400 mb-6">
                Deixe nossa IA analisar sua biometria corporal para garantir que este estilo tenha o caimento perfeitamente ajustado às suas medidas.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={startGpuScan} 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  Ativar Câmera IA
                </Button>
                <Button 
                  variant="outline"
                  onClick={startGpuScan} 
                  className="w-full h-12 rounded-xl border-purple-500/50 hover:bg-purple-500/10 text-purple-300 font-bold tracking-widest uppercase"
                >
                  Fazer Upload de Vídeo
                </Button>
              </div>
              <p className="text-[10px] text-neutral-500 mt-4 flex items-center justify-center gap-1">
                🔒 O vídeo será apagado ao sair do app.
              </p>
              <div className="mt-5 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left">
                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Aviso Importante sobre Trocas</h4>
                <p className="text-[10px] text-amber-400/80 leading-relaxed">
                  Os clientes que não aceitarem a orientação do aplicativo e comprarem roupas com tamanhos discordantes da nossa recomendação, e que por ventura não servirem, não estarão sujeitos à troca com frete grátis, pois não seguiram a orientação da IA.
                </p>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12 bg-neutral-800/50 rounded-2xl border border-white/5">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-neutral-800 border-t-green-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-green-500 animate-pulse" />
                </div>
              </div>
              <p className="font-bold text-green-500 tracking-widest uppercase animate-pulse text-xs">
                Calculando malha 3D...
              </p>
            </div>
          )}

          {scanComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Laudo da IA */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-green-500 uppercase text-sm">Caimento Ideal Encontrado</h4>
                  <p className="text-xs text-neutral-300 mt-1">
                    Com base na sua estrutura óssea e medidas, recomendamos o seguinte tamanho para o estilo <span className="font-bold text-white">{selectedStyle.name}</span>:
                  </p>
                  <div className="mt-3 inline-block bg-green-500 text-black font-black px-4 py-1.5 rounded-lg text-xl">
                    TAMANHO {selectedStyle.recommendedSize}
                  </div>
                </div>
              </div>

              {/* Seleção de Tamanho Manual */}
              <div>
                <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Tamanhos Disponíveis (Ajuste Manual)</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStyle.availableSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`w-12 h-12 rounded-lg font-bold text-base transition-all ${
                        selectedSize === size
                          ? size === selectedStyle.recommendedSize
                            ? 'bg-green-500 text-black border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                            : 'bg-amber-500 text-black border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                          : 'bg-neutral-800 text-white border border-white/10 hover:bg-neutral-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* WAIVER / TERMO DE RESPONSABILIDADE */}
              <AnimatePresence>
                {showWaiver && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-3 flex gap-3 mt-2">
                      <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <div className="text-xs">
                        <h4 className="font-bold text-amber-500 uppercase">Atenção ao Caimento</h4>
                        <p className="text-neutral-300 mt-1">
                          Você selecionou o tamanho <strong className="text-white">{selectedSize}</strong>, mas nossa IA recomenda o tamanho <strong className="text-white">{selectedStyle.recommendedSize}</strong>.
                        </p>
                        <p className="text-white font-bold mt-2 border-t border-amber-500/30 pt-2">
                          ATENÇÃO: Orientações da IA não seguidas não estarão sujeitas a trocas por erro de tamanho.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
