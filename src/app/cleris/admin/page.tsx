'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Camera,
  Check,
  RotateCcw,
  X
} from 'lucide-react';
import Link from 'next/link';
import ClerisLogo from '@/components/cleris/logo';
import { ClerisProduct, INITIAL_PRODUCTS } from '../types';

// Auxiliar para comprimir imagens no cliente antes de salvar no localStorage (limite de 5MB do navegador)
const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function ClerisAdminDashboard() {
  const [products, setProducts] = useState<ClerisProduct[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'feminino' | 'masculino' | 'infantil' | 'esportes'>('masculino');
  const [price, setPrice] = useState('');
  const [installments, setInstallments] = useState(10);
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([38, 39, 40, 41, 42]);

  // 4 Photo Slots: Lado, Frente, Cima, Calçado
  const [photoLado, setPhotoLado] = useState<string>('');
  const [photoFrente, setPhotoFrente] = useState<string>('');
  const [photoCima, setPhotoCima] = useState<string>('');
  const [photoCalcando, setPhotoCalcando] = useState<string>('');

  // Load products
  useEffect(() => {
    const savedProducts = localStorage.getItem('cleris_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  const saveProductsToStorage = (newProducts: ClerisProduct[]) => {
    try {
      localStorage.setItem('cleris_products', JSON.stringify(newProducts));
      setProducts(newProducts);
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e);
      alert("Ops! O limite de armazenamento local do seu navegador foi excedido. Eu comprimi as fotos, mas elas ainda são grandes demais ou há muitos calçados cadastrados. Tente remover alguns antigos ou usar fotos mais simples!");
    }
  };

  const handleSizeToggle = (size: number) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size].sort((a, b) => a - b));
    }
  };

  // Safe file reader with automatic compression to fit localStorage
  const handlePhotoUpload = async (slot: 'lado' | 'frente' | 'cima' | 'calcando', file: File | null) => {
    if (!file) return;
    
    try {
      // Comprime a imagem para no máximo 800x800px com 75% de qualidade JPEG
      const compressedBase64 = await compressImage(file, 800, 800, 0.75);
      
      if (slot === 'lado') setPhotoLado(compressedBase64);
      else if (slot === 'frente') setPhotoFrente(compressedBase64);
      else if (slot === 'cima') setPhotoCima(compressedBase64);
      else if (slot === 'calcando') setPhotoCalcando(compressedBase64);
    } catch (error) {
      console.error("Erro ao processar e comprimir imagem:", error);
      
      // Fallback para conversão padrão sem compressão se algo der errado
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (slot === 'lado') setPhotoLado(base64String);
        else if (slot === 'frente') setPhotoFrente(base64String);
        else if (slot === 'cima') setPhotoCima(base64String);
        else if (slot === 'calcando') setPhotoCalcando(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Safe file reader with automatic compression to fit localStorage for multiple files at once
  const handleMultiplePhotoUpload = async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).slice(0, 4); // Limit to maximum 4 files
    const slots: ('lado' | 'frente' | 'cima' | 'calcando')[] = ['lado', 'frente', 'cima', 'calcando'];
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const slot = slots[i];
      try {
        const compressedBase64 = await compressImage(file, 800, 800, 0.75);
        if (slot === 'lado') setPhotoLado(compressedBase64);
        else if (slot === 'frente') setPhotoFrente(compressedBase64);
        else if (slot === 'cima') setPhotoCima(compressedBase64);
        else if (slot === 'calcando') setPhotoCalcando(compressedBase64);
      } catch (error) {
        console.error(`Erro ao processar imagem no lote para o slot ${slot}:`, error);
      }
    }
  };

  const handleRemovePhoto = (slot: 'lado' | 'frente' | 'cima' | 'calcando') => {
    if (slot === 'lado') setPhotoLado('');
    else if (slot === 'frente') setPhotoFrente('');
    else if (slot === 'cima') setPhotoCima('');
    else if (slot === 'calcando') setPhotoCalcando('');
  };

  // Helper to load high-quality demo mockup photos with 1 click (extremely helpful for lojistas to test)
  const handleLoadDemoMockup = () => {
    setPhotoLado('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600');
    setPhotoFrente('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600');
    setPhotoCima('https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600');
    setPhotoCalcando('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      alert('Por favor, preencha o Nome e o Preço do calçado.');
      return;
    }

    if (!photoLado) {
      alert('Por favor, envie pelo menos a Foto Principal (De Lado) do calçado.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Por favor, insira um preço válido maior do que zero.');
      return;
    }

    // Compose final images array with available photos
    const finalImages: string[] = [];
    if (photoLado) finalImages.push(photoLado);
    if (photoFrente) finalImages.push(photoFrente);
    if (photoCima) finalImages.push(photoCima);
    if (photoCalcando) finalImages.push(photoCalcando);

    const newProduct: ClerisProduct = {
      id: 'p_' + Date.now(),
      name,
      category,
      price: parsedPrice,
      installments,
      description: description || 'Calçado de altíssima qualidade, super macio, confortável e costura reforçada para durar.',
      images: finalImages,
      sizes: selectedSizes.length > 0 ? selectedSizes : [35, 36, 37, 38, 39, 40, 41, 42]
    };

    const updated = [newProduct, ...products];
    saveProductsToStorage(updated);
    
    // Clear Form
    setName('');
    setPrice('');
    setInstallments(10);
    setDescription('');
    setPhotoLado('');
    setPhotoFrente('');
    setPhotoCima('');
    setPhotoCalcando('');
    
    // Show success toast
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este calçado do catálogo ativo?')) {
      const updated = products.filter(p => p.id !== id);
      saveProductsToStorage(updated);
    }
  };

  const handleResetCatalog = () => {
    if (confirm('Deseja resetar o catálogo para os produtos padrão? Isso apagará os calçados que você cadastrou.')) {
      saveProductsToStorage(INITIAL_PRODUCTS);
    }
  };

  const sizeOptions = category === 'feminino' 
    ? [33, 34, 35, 36, 37, 38, 39, 40]
    : category === 'infantil'
    ? [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    : [37, 38, 39, 40, 41, 42, 43, 44, 45];

  return (
    <div className="min-h-screen bg-[#020e09] text-zinc-100 font-sans selection:bg-[#008a47] selection:text-white relative overflow-hidden">
      {/* BACKGROUND GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#008a47]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10b981]/5 rounded-full blur-[180px]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#020e09]/80 backdrop-blur-xl border-b border-emerald-950/55 relative z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/cleris"
              className="p-2 hover:bg-[#032316] text-emerald-500 hover:text-emerald-350 rounded-full transition-colors border border-transparent hover:border-emerald-950/60"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-emerald-950">/</span>
            <ClerisLogo size="sm" variant="white-on-green" />
            <span className="px-3 py-1 text-[9px] bg-[#008a47]/20 border border-[#008a47]/40 rounded-full text-emerald-450 font-black uppercase tracking-wider">
              Painel Lojista
            </span>
          </div>

          <Link 
            href="/cleris"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#008a47] hover:bg-[#10b981] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-750/10"
          >
            Ver Loja Final <ShoppingBag className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* DASHBOARD METRICS */}
      <section className="container mx-auto px-4 md:px-8 pt-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* VISITS CARD */}
          <div className="bg-[#032316]/40 backdrop-blur-md p-6 rounded-3xl border border-emerald-950/65 shadow-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Cliques Hoje</span>
              <h3 className="text-3xl font-black text-white leading-none">148</h3>
              <p className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> +24% em relação a ontem
              </p>
            </div>
            <div className="p-4 bg-[#020e09]/50 border border-emerald-950/50 rounded-2xl">
              <Users className="h-6 w-6 text-[#10b981]" />
            </div>
          </div>

          {/* SIMULATED CONVERSIONS */}
          <div className="bg-[#032316]/40 backdrop-blur-md p-6 rounded-3xl border border-emerald-950/65 shadow-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Reservas no WhatsApp</span>
              <h3 className="text-3xl font-black text-white leading-none">12</h3>
              <p className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> 8 calçados agendados
              </p>
            </div>
            <div className="p-4 bg-[#020e09]/50 border border-emerald-950/50 rounded-2xl">
              <ShoppingBag className="h-6 w-6 text-[#10b981]" />
            </div>
          </div>

          {/* FATURAMENTO PREVISTO */}
          <div className="bg-[#032316]/40 backdrop-blur-md p-6 rounded-3xl border border-emerald-950/65 shadow-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Valor de Venda Estimado</span>
              <h3 className="text-3xl font-black text-white leading-none">R$ 2.480,90</h3>
              <p className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Ticket Médio: R$ 206,74
              </p>
            </div>
            <div className="p-4 bg-[#020e09]/50 border border-emerald-950/50 rounded-2xl">
              <DollarSign className="h-6 w-6 text-[#10b981]" />
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD WORKSPACE GRID */}
      <main className="container mx-auto px-4 md:px-8 pb-16 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PRODUCT REGISTRATION FORM */}
          <div className="lg:col-span-5 bg-[#032316]/40 backdrop-blur-md border border-emerald-950/65 rounded-[36px] p-8 shadow-2xl h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#008a47]/20 border border-[#008a47]/30 rounded-xl">
                  <Plus className="h-5 w-5 text-[#10b981]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider text-emerald-450">
                  Cadastrar Calçado
                </h3>
              </div>

              <button
                type="button"
                onClick={handleLoadDemoMockup}
                className="text-[9px] font-black uppercase tracking-widest text-emerald-400/70 hover:text-emerald-350 bg-[#020e09]/80 border border-emerald-950 px-2.5 py-1.5 rounded-xl transition-all"
                title="Preenche fotos e campos de forma automatizada para você testar"
              >
                Preencher Demo ✨
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-zinc-300">
              {/* NOME DO PRODUTO */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-emerald-850 block">
                  Nome do Calçado *
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Sandália Anabela Couro" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#020e09]/70 border border-emerald-950/80 rounded-2xl outline-none focus:border-[#008a47] focus:bg-[#02130d] text-sm text-white placeholder-emerald-900/60 transition-all"
                  required
                />
              </div>

              {/* CATEGORIA E PREÇO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-emerald-850 block">
                    Categoria *
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setCategory(cat);
                      // Default sizes reset based on category
                      if (cat === 'feminino') setSelectedSizes([35, 36, 37, 38]);
                      else if (cat === 'infantil') setSelectedSizes([24, 25, 26, 27]);
                      else setSelectedSizes([39, 40, 41, 42]);
                    }}
                    className="w-full px-4 py-3 bg-[#020e09]/70 border border-emerald-950/80 rounded-2xl outline-none focus:border-[#008a47] focus:bg-[#02130d] text-sm text-white font-semibold transition-all"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="infantil">Infantil</option>
                    <option value="esportes">Esportes</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-emerald-850 block">
                    Preço de Venda (R$) *
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Ex: 189.90" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-[#020e09]/70 border border-emerald-950/80 rounded-2xl outline-none focus:border-[#008a47] focus:bg-[#02130d] text-sm text-white font-semibold placeholder-emerald-900/60 transition-all"
                    required
                  />
                </div>
              </div>

              {/* PARCELAMENTO */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-emerald-850 block">
                  Máximo de Parcelas Sem Juros
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-[#020e09]/70 border border-emerald-950/80 rounded-2xl outline-none focus:border-[#008a47] focus:bg-[#02130d] text-sm text-white font-semibold transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                    <option key={n} value={n}>{n}x Sem Juros</option>
                  ))}
                </select>
              </div>

              {/* DESCRICAO */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-emerald-850 block">
                  Descrição / Detalhes de Conforto
                </label>
                <textarea 
                  placeholder="Fale brevemente sobre o material do sapato, tipo de solado..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#020e09]/70 border border-emerald-950/80 rounded-2xl outline-none focus:border-[#008a47] focus:bg-[#02130d] text-sm text-white placeholder-emerald-900/60 transition-all leading-relaxed"
                />
              </div>

              {/* TAMANHOS DISPONÍVEIS */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-emerald-850 block">
                  Tamanhos em Estoque (Marcar):
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-[#020e09]/70 border border-emerald-950/80 rounded-2xl max-h-36 overflow-y-auto">
                  {sizeOptions.map((size) => {
                    const active = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`w-10 h-10 text-[11px] font-black rounded-lg transition-all border flex items-center justify-center ${
                          active 
                            ? 'bg-[#008a47] text-white border-transparent shadow-sm scale-105'
                            : 'bg-[#032316]/50 border-emerald-950/80 text-emerald-650 hover:bg-[#032d1d] hover:border-[#10b981]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 100% MANUAL PHOTO GRID (4 SLOTS) */}
              <div className="space-y-4 border-t border-emerald-950/80 pt-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#10b981]">
                    Enviar Fotos (Até 4 Ângulos)
                  </label>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008a47]/20 border border-[#008a47]/50 hover:bg-[#008a47] text-emerald-450 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95">
                    <Camera className="h-3 w-3" /> Enviar em Lote (Até 4)
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleMultiplePhotoUpload(e.target.files)}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* SLOT 1: DE LADO (MAIN) */}
                  <div className="relative group">
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block mb-1.5">
                      1. De Lado (Principal) *
                    </span>
                    <label className={`h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative ${
                      photoLado 
                        ? 'border-[#008a47] bg-[#020e09]' 
                        : 'border-emerald-950/80 hover:border-[#008a47] bg-[#020e09]/50'
                    }`}>
                      {photoLado ? (
                        <>
                          <img src={photoLado} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); handleRemovePhoto('lado'); }}
                            className="absolute top-2 right-2 p-1 bg-black/80 hover:bg-red-650 text-white rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-500 text-center p-2">
                          <Camera className="h-5 w-5 text-emerald-800 mb-1" />
                          <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-650">Enviar Foto</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload('lado', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  {/* SLOT 2: DE FRENTE */}
                  <div className="relative group">
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block mb-1.5">
                      2. De Frente (Opcional)
                    </span>
                    <label className={`h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative ${
                      photoFrente 
                        ? 'border-[#008a47] bg-[#020e09]' 
                        : 'border-emerald-950/80 hover:border-[#008a47] bg-[#020e09]/50'
                    }`}>
                      {photoFrente ? (
                        <>
                          <img src={photoFrente} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); handleRemovePhoto('frente'); }}
                            className="absolute top-2 right-2 p-1 bg-black/80 hover:bg-red-650 text-white rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-500 text-center p-2">
                          <Camera className="h-5 w-5 text-emerald-800 mb-1" />
                          <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-650">Enviar Foto</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload('frente', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  {/* SLOT 3: DE CIMA */}
                  <div className="relative group">
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block mb-1.5">
                      3. De Cima (Opcional)
                    </span>
                    <label className={`h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative ${
                      photoCima 
                        ? 'border-[#008a47] bg-[#020e09]' 
                        : 'border-emerald-950/80 hover:border-[#008a47] bg-[#020e09]/50'
                    }`}>
                      {photoCima ? (
                        <>
                          <img src={photoCima} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); handleRemovePhoto('cima'); }}
                            className="absolute top-2 right-2 p-1 bg-black/80 hover:bg-red-650 text-white rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-500 text-center p-2">
                          <Camera className="h-5 w-5 text-emerald-800 mb-1" />
                          <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-650">Enviar Foto</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload('cima', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  {/* SLOT 4: CALÇANDO */}
                  <div className="relative group">
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block mb-1.5">
                      4. Calçando (Lifestyle)
                    </span>
                    <label className={`h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative ${
                      photoCalcando 
                        ? 'border-[#008a47] bg-[#020e09]' 
                        : 'border-emerald-950/80 hover:border-[#008a47] bg-[#020e09]/50'
                    }`}>
                      {photoCalcando ? (
                        <>
                          <img src={photoCalcando} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); handleRemovePhoto('calcando'); }}
                            className="absolute top-2 right-2 p-1 bg-black/80 hover:bg-red-650 text-white rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-500 text-center p-2">
                          <Camera className="h-5 w-5 text-emerald-800 mb-1" />
                          <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-650">Enviar Foto</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload('calcando', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <button
                type="submit"
                className="w-full py-4 bg-[#008a47] hover:bg-[#10b981] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                Cadastrar Calçado na Vitrine <Plus className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

          {/* REGISTERED PRODUCTS LIST */}
          <div className="lg:col-span-7 bg-[#032316]/40 backdrop-blur-md border border-emerald-950/65 rounded-[36px] p-8 shadow-2xl flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#008a47]/20 border border-[#008a47]/30 rounded-xl">
                  <ShoppingBag className="h-5 w-5 text-[#10b981]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider text-emerald-450">
                  Calçados Cadastrados ({products.length})
                </h3>
              </div>

              <button
                onClick={handleResetCatalog}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-950 hover:bg-[#032316] text-emerald-600 hover:text-emerald-350 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
                title="Reseta para catálogo padrão"
              >
                <RotateCcw className="h-3 w-3" /> Resetar Catálogo
              </button>
            </div>

            {/* PRODUCT LIST CONTENT */}
            {products.length === 0 ? (
              <div className="text-center py-20 flex-1 flex flex-col justify-center items-center">
                <ShoppingBag className="h-12 w-12 text-emerald-900 mb-4" />
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-widest">Catálogo Vazio</h4>
                <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
                  Envie as fotos e preencha os dados do calçado ao lado para abastecer a vitrine da Cleris Calçados.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[650px] pr-2 no-scrollbar">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-4 bg-[#020e09]/50 p-4 rounded-3xl border border-emerald-950 hover:border-[#10b981]/30 hover:bg-[#032316]/20 transition-all shadow-md relative group"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#020e09] border border-emerald-950/60 flex-shrink-0">
                      <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white truncate uppercase leading-none">
                          {product.name}
                        </h4>
                        <span className="px-2 py-0.5 bg-[#008a47]/20 text-emerald-400 border border-[#008a47]/30 rounded text-[8px] font-black uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                      
                      <p className="text-xs text-zinc-400 line-clamp-1 leading-relaxed mt-1.5 font-medium">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs font-extrabold text-white mt-2">
                        <span>R$ {product.price.toFixed(2)}</span>
                        <span className="text-emerald-950">|</span>
                        <span className="text-[10px] text-zinc-450 font-bold">{product.installments}x Sem Juros</span>
                        <span className="text-emerald-950">|</span>
                        <span className="text-[10px] text-[#10b981] font-black">Fotos Cadastradas: {product.images?.length || 0}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="absolute right-4 p-3 bg-[#020e09] border border-emerald-950/80 hover:border-emerald-800 text-emerald-800 hover:text-red-500 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-sm focus:opacity-100"
                      title="Deletar calçado"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* TOAST SUCCESS NOTIFICATION */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${
        isSaved ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}>
        <div className="bg-[#02140d] border border-emerald-900 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#10b981] leading-none">Cadastrado com Sucesso!</h4>
            <p className="text-[10px] text-zinc-400 mt-1 font-semibold">O calçado já está disponível na vitrine do cliente final.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
