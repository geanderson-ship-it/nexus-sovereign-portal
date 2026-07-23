"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, CheckCircle2, ChevronRight, Tag, Zap } from "lucide-react";

// Dados serão carregados dinamicamente via API

export default function AfubraTV1Page() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [dynamicData, setDynamicData] = useState<any>(null);

  // Cada produto fica 18 segundos na tela
  const PRODUCT_DURATION = 18000; 
  // Cada ângulo (imagem) do produto troca a cada 6 segundos
  const IMAGE_DURATION = 6000;    

  // Buscar dados dinâmicos em background
  useEffect(() => {
    const fetchData = () => {
      fetch("/api/signage", { cache: "no-store" })
        .then(res => res.json())
        .then(data => setDynamicData(data))
        .catch(err => console.error("Falha ao carregar dados", err));
    };
    
    // Busca inicial
    fetchData();
    
    // Polling a cada 10 segundos para ver se o Admin atualizou
    const pollInterval = setInterval(fetchData, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .gtranslate_wrapper, #gtranslate_wrapper, [class*="gtranslate"] { display: none !important; }
      body { overflow: hidden !important; }
    `;
    document.head.appendChild(style);

    const tickMs = 50; 
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + tickMs);
    }, tickMs);

    return () => {
      clearInterval(timer);
      document.head.removeChild(style);
    };
  }, []);

  if (!dynamicData || !dynamicData.products || dynamicData.products.length === 0) {
    return <div className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center text-white font-bold">Carregando Vitrine...</div>;
  }

  const { products, theme } = dynamicData;

  const totalCycleTime = products.length * PRODUCT_DURATION;
  const currentCycleTime = timeElapsed % totalCycleTime;
  
  const productIndex = Math.floor(currentCycleTime / PRODUCT_DURATION);
  const timeInCurrentProduct = currentCycleTime % PRODUCT_DURATION;
  
  const currentProduct = products[productIndex];
  
  const rawImageIndex = Math.floor(timeInCurrentProduct / IMAGE_DURATION);
  const imageIndex = rawImageIndex % currentProduct.images.length;
  
  const currentImage = currentProduct.images[imageIndex];
  const progress = (timeInCurrentProduct / PRODUCT_DURATION) * 100;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0a0a0a] flex font-sans overflow-hidden">
      
      {/* Barra Superior */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-white/10 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#00A34A] to-[#00ffaa]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── COLUNA DA ESQUERDA (Informações) ── */}
      <div className="w-[30vw] h-screen flex flex-col justify-between p-4 md:p-6 border-r border-white/5 relative bg-[#0a0a0a] z-20 overflow-hidden">
        
        <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none mix-blend-overlay" />
        
        {/* Cabeçalho */}
        <header className="relative z-10 flex flex-col items-start gap-3 shrink-0">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center justify-start min-h-[48px]">
              {theme.logoImage ? (
                <img src={theme.logoImage} alt="Logo" className="h-10 w-auto object-contain drop-shadow-md" />
              ) : (
                <span className="text-white font-black text-3xl tracking-tighter">{theme.logo}</span>
              )}
            </div>
            <div className="flex flex-col border-l-2 border-white/20 pl-4">
              <span className="text-base font-bold uppercase tracking-[0.2em] text-white/90">Vitrine Digital</span>
              <span className="text-[10px] text-[#00A34A] font-bold flex items-center gap-2 tracking-widest uppercase mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A34A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00A34A]"></span>
                </span>
                AO VIVO
              </span>
            </div>
          </div>
        </header>

        {/* Detalhes do Produto e QR Code GIGANTE */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#00A34A] text-white font-bold rounded-md text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,163,74,0.3)]">
                    <Tag className="w-3 h-3" /> {currentProduct.tag}
                  </span>
                  <span className="text-gray-300 font-bold uppercase tracking-widest text-[10px] border border-white/20 px-2 py-1 rounded-md bg-white/5">
                    {currentProduct.category}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black leading-tight text-white drop-shadow-lg">
                  {currentProduct.name}
                </h1>
              </div>
              
              <div className="pt-2 border-t border-white/10 mt-2">
                <div className="flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 p-4 rounded-3xl shadow-2xl">
                  
                  <div className="text-center space-y-1">
                    <h3 className="text-xl md:text-2xl font-black flex items-center justify-center gap-2 text-[#00ffaa] leading-tight drop-shadow-[0_0_15px_rgba(0,255,170,0.4)]">
                      <Smartphone className="w-6 h-6" /> APONTE A CÂMERA
                    </h3>
                    <p className="text-gray-300 text-[10px] md:text-xs font-medium max-w-[250px] text-center leading-tight">
                      Escaneie o QR Code para ver o preço atualizado e comprar no site da Afubra.
                    </p>
                  </div>

                  <motion.div 
                    animate={{ boxShadow: ["0 0 15px rgba(0,163,74,0.3)", "0 0 30px rgba(0,163,74,0.6)", "0 0 15px rgba(0,163,74,0.3)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white p-2 md:p-3 rounded-2xl border-4 border-[#00A34A]"
                  >
                    <div className="w-36 h-36 md:w-48 md:h-48 bg-white rounded-xl flex items-center justify-center relative overflow-hidden">
                       <img 
                         src={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(currentProduct.url)}`}
                         alt="QR Code" 
                         className="w-full h-full object-contain mix-blend-multiply"
                       />
                    </div>
                  </motion.div>
                  
                  <div className="flex items-center gap-2 text-white/90 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 text-[10px] md:text-xs font-bold mt-1 shadow-md">
                    <CheckCircle2 className="w-3 h-3 text-[#00ffaa]" /> Estoque Garantido na Loja
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── COLUNA DA DIREITA (Imagens Alternantes) ── */}
      <div className="flex-1 h-screen relative z-10 bg-gradient-to-br from-[#ffffff] to-[#e2e8f0] flex items-center justify-center p-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage} 
            initial={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full h-full relative flex items-center justify-center"
          >
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 opacity-40 mix-blend-overlay" />
            
            <img 
              src={currentImage} 
              alt="Produto em Detalhes" 
              className="w-full h-full object-contain object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
