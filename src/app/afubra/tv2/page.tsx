"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, MapPin, CheckCircle2, ChevronRight, Sprout, ShieldCheck, Wrench } from "lucide-react";

const products = [
  {
    id: 1,
    category: "Maquinário Agrícola",
    name: "Trator Cortador Husqvarna",
    description: "Desempenho premium para grandes propriedades. Transmissão hidrostática suave e assento ergonômico.",
    price: "R$ 22.490,00",
    installments: "Em até 12x s/ juros",
    tag: "DESTAQUE AGRO",
    icon: Sprout,
    tagColor: "bg-[#00A34A] text-white shadow-[0_0_10px_rgba(0,163,74,0.4)]",
    priceColor: "text-[#00ffaa] drop-shadow-[0_0_15px_rgba(0,255,170,0.3)]",
    features: ["Husqvarna Séries", "Hidrostática", "Deck 42\"", "Garantia 2 Anos"],
    images: [
      "https://images.unsplash.com/photo-1592982537447-6f233c690bc4?q=80&w=2070&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1605352601004-9cd8c21a1f59?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: 2,
    category: "Eletrodomésticos",
    name: "Lavadora Samsung Front 13kg",
    description: "Revolucione a sua lavanderia com a tecnologia EcoBubble e motor Digital Inverter super silencioso.",
    price: "R$ 3.899,00",
    installments: "10x de R$ 389,90",
    tag: "OFERTA IMPERDÍVEL",
    icon: ShieldCheck,
    tagColor: "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]",
    priceColor: "text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]",
    features: ["EcoBubble", "Lavagem a Seco", "Inverter 10 Anos", "Painel Inteligente"],
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=2071&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=2039&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    category: "Ferramentas",
    name: "Roçadeira a Combustão Stihl",
    description: "A força que o campo exige. Alta potência e robustez para manutenção de áreas verdes e terrenos.",
    price: "R$ 2.950,00",
    installments: "10x de R$ 295,00",
    tag: "TOP VENDAS",
    icon: Wrench,
    tagColor: "bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]",
    priceColor: "text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    features: ["Cilindrada 35.2cm³", "Motor 2 Tempos", "Tanque 0.58L", "Kit Incluso"],
    images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=2084&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584949586146-24e0bcfdf2d3?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: 4,
    category: "Maquinário Florestal",
    name: "Motosserra a Bateria Husqvarna",
    description: "Silenciosa, sem fumaça e de alta precisão. Perfeita para podas profissionais e corte de lenha. Bateria de longa duração inclusa.",
    price: "R$ 2.450,00",
    installments: "10x de R$ 245,00",
    tag: "ECOLÓGICA",
    icon: Sprout,
    tagColor: "bg-green-700 text-white shadow-[0_0_10px_rgba(21,128,61,0.4)]",
    priceColor: "text-[#00ffaa] drop-shadow-[0_0_15px_rgba(0,255,170,0.3)]",
    features: ["Motor sem escovas", "Bateria 40V", "Selo Ecológico", "Leve (3.2kg)"],
    images: [
      "https://images.unsplash.com/photo-1502476579603-728b7e28b2ad?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590483864070-56ccf6795f7c?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  {
    id: 5,
    category: "Refrigeração Comercial",
    name: "Freezer Horizontal Fricon 503L",
    description: "Espaço de sobra para o seu negócio ou fazenda. Tampas de vidro deslizantes e eficiência energética superior (A++).",
    price: "R$ 3.199,00",
    installments: "10x de R$ 319,90",
    tag: "PROMOÇÃO RURAL",
    icon: ShieldCheck,
    tagColor: "bg-cyan-600 text-white shadow-[0_0_10px_rgba(8,145,178,0.4)]",
    priceColor: "text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]",
    features: ["Capacidade 503L", "Dupla Ação", "Degelo Prático", "Rodízios Reforçados"],
    images: [
      "https://images.unsplash.com/photo-1584473457406-6240486418e9?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=2000&auto=format&fit=crop"
    ]
  }
];

const QrCodeSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-black">
    <rect width="5" height="5" x="3" y="3" rx="1"/>
    <rect width="5" height="5" x="16" y="3" rx="1"/>
    <rect width="5" height="5" x="3" y="16" rx="1"/>
    <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
    <path d="M21 21v.01"/>
    <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
    <path d="M3 12h.01"/>
    <path d="M12 3h.01"/>
    <path d="M12 16v.01"/>
    <path d="M16 12h1"/>
    <path d="M21 12v.01"/>
    <path d="M12 21v-1"/>
  </svg>
);

export default function AfubraTV2Page() {
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Produto fica na tela por 18 segundos
  const PRODUCT_DURATION = 18000; 
  // Imagem/Angulo troca a cada 6 segundos
  const IMAGE_DURATION = 6000; 

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .gtranslate_wrapper, #gtranslate_wrapper, [class*="gtranslate"] { display: none !important; }
      body { overflow: hidden !important; }
    `;
    document.head.appendChild(style);

    const tickMs = 50;
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + tickMs);
    }, tickMs);

    return () => {
      clearInterval(timer);
      document.head.removeChild(style);
    };
  }, []);

  const totalCycleTime = products.length * PRODUCT_DURATION;
  const currentCycleTime = timeElapsed % totalCycleTime;
  
  const productIndex = Math.floor(currentCycleTime / PRODUCT_DURATION);
  const timeInCurrentProduct = currentCycleTime % PRODUCT_DURATION;
  
  const currentProduct = products[productIndex];
  
  const rawImageIndex = Math.floor(timeInCurrentProduct / IMAGE_DURATION);
  const imageIndex = rawImageIndex % currentProduct.images.length;
  
  const currentImage = currentProduct.images[imageIndex];
  const progress = (timeInCurrentProduct / PRODUCT_DURATION) * 100;
  const TagIcon = currentProduct.icon;

  return (
    <div className="flex w-screen h-screen bg-[#050505] overflow-hidden font-sans text-white relative">
      
      {/* Barra Superior */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-transparent via-[#00A34A] to-[#00ffaa] transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── COLUNA LATERAL ── */}
      <div className="w-[45vw] h-screen bg-[#0a0a0a] border-r border-white/10 flex flex-col p-8 z-20 shrink-0 shadow-[20px_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        
        <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none mix-blend-overlay" />
        
        {/* Cabeçalho */}
        <header className="relative z-10 flex flex-col items-start gap-4 shrink-0 h-[10%] justify-start">
          <div className="flex items-center gap-3 w-full">
            <div className="bg-[#00A34A] text-white font-black text-3xl tracking-tighter px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(0,163,74,0.4)]">
              Afubra
            </div>
            <div className="flex flex-col border-l-2 border-white/20 pl-3">
              <span className="text-base font-bold uppercase tracking-[0.2em] text-white/90">Central Ofertas</span>
              <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1.5 tracking-widest uppercase mt-0.5">
                <MapPin className="w-3 h-3 text-[#00A34A]" /> MATRIZ - SANTA CRUZ
              </span>
            </div>
          </div>
        </header>

        {/* Detalhes do Produto */}
        <div className="relative z-10 h-[65%] flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-white font-bold rounded-md text-[10px] uppercase tracking-widest flex items-center gap-1.5 ${currentProduct.tagColor}`}>
                  <TagIcon className="w-3 h-3" /> {currentProduct.tag}
                </span>
                <span className="text-gray-300 font-bold uppercase tracking-widest text-[10px] border border-white/20 px-2 py-1 rounded-md bg-white/5">
                  {currentProduct.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-lg">
                {currentProduct.name}
              </h1>
              
              <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed line-clamp-3">
                {currentProduct.description}
              </p>

              <div className="grid grid-cols-2 gap-2 py-2">
                {currentProduct.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/90 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                    <CheckCircle2 className={`w-3 h-3 ${idx % 2 === 0 ? 'text-white' : 'text-[#00A34A]'} shrink-0`} />
                    <span className="font-bold text-[11px] tracking-wide truncate">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 border-t border-white/10 mt-2">
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold block pt-2">Leve hoje por apenas</span>
                <div className="flex items-end gap-3 mt-1">
                  <span className={`text-4xl md:text-6xl font-black ${currentProduct.priceColor} leading-none`}>
                    {currentProduct.price}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                    ou {currentProduct.installments}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Rodapé - Fixo */}
        <footer className="relative z-10 shrink-0 h-[25%] bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          
          <div className="space-y-1.5 w-3/5">
            <h3 className="text-lg md:text-xl font-black flex items-center gap-2 text-white leading-tight">
              <Smartphone className="w-4 h-4 text-[#00A34A]" /> Acesso Expresso
            </h3>
            <p className="text-gray-400 text-[11px] md:text-xs font-medium leading-snug">
              Aponte a câmera e leve agora.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[9px] font-bold border border-green-500/30 uppercase tracking-widest">Agro</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-[9px] font-bold border border-blue-500/30 uppercase tracking-widest">Eletro</span>
            </div>
          </div>

          <div className="w-2/5 flex justify-end">
            <motion.div 
              animate={{ boxShadow: ["0 0 15px rgba(255,255,255,0.1)", "0 0 30px rgba(255,255,255,0.2)", "0 0 15px rgba(255,255,255,0.1)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#111] p-2 rounded-xl border border-white/20 flex flex-col items-center justify-center gap-1.5"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                 <QrCodeSVG />
                 <motion.div 
                   animate={{ top: ["-10%", "110%"] }}
                   transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 right-0 h-[2px] bg-[#00A34A] shadow-[0_0_10px_#00A34A] opacity-90" 
                 />
              </div>
              <div className="bg-[#00A34A] text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest w-full text-center flex justify-center items-center gap-1">
                 Ler <ChevronRight className="w-2 h-2" />
              </div>
            </motion.div>
          </div>
        </footer>
      </div>

      {/* ── COLUNA DA DIREITA (Imagens Alternantes) ── */}
      <div className="w-[55vw] h-screen relative z-10 bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage} 
            initial={{ opacity: 0, filter: "blur(10px)", scale: 1.02 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.02 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
            
            <img 
              src={currentImage} 
              alt="Produto em Detalhes" 
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
