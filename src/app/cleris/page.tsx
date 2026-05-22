'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingBag, 
  Trash2, 
  X, 
  MessageSquare, 
  MapPin, 
  Check, 
  Copy, 
  CreditCard, 
  Info,
  Clock,
  ArrowRight,
  TrendingUp,
  User,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import ClerisLogo from '@/components/cleris/logo';
import { ClerisProduct, INITIAL_PRODUCTS, getWhatsAppMessage } from './types';

interface CartItem {
  product: ClerisProduct;
  size: number;
  quantity: number;
}

export default function ClerisStorefront() {
  const [products, setProducts] = useState<ClerisProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  
  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<ClerisProduct | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [pixCopied, setPixCopied] = useState(false);
  
  // Load products from localStorage or use initial mock data
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
      localStorage.setItem('cleris_products', JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: ClerisProduct, size: number, qty: number) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id && item.size === size);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += qty;
      setCart(newCart);
    } else {
      setCart([...cart, { product, size, quantity: qty }]);
    }
    // Reset inputs
    setSelectedSize(null);
    setQuantity(1);
    setSelectedProduct(null);
    // Open cart drawer
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const updateCartQty = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const getPixPrice = (total: number) => {
    return total * 0.95; // 5% discount on Pix
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020101021226870014br.gov.bcb.pix2565pix.cleris.calcados@venancio.com520400005303986540500.005802BR5915Cleris Calcados6014Venancio Aires62070503***6304CA3F');
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handleFinishCheckout = () => {
    const waUrl = `https://wa.me/5551999999999?text=${getWhatsAppMessage(cart)}`;
    window.open(waUrl, '_blank');
    setCheckoutStep('success');
    setCart([]);
  };

  // Safe helper to get images array (handles backward compatibility with single image fields)
  const getProductImages = (product: ClerisProduct): string[] => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    if ((product as any).image) {
      return [(product as any).image];
    }
    return ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'];
  };

  return (
    <div className="min-h-screen bg-[#020e09] text-zinc-100 font-sans selection:bg-[#008a47] selection:text-white relative overflow-hidden">
      {/* BACKGROUND GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#008a47]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10b981]/5 rounded-full blur-[180px]" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#020e09]/80 backdrop-blur-xl border-b border-emerald-950/55 relative z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/cleris">
            <ClerisLogo size="md" variant="white-on-green" />
          </Link>

          {/* SEARCH BAR (DESKTOP) */}
          <div className="hidden md:flex items-center gap-2 bg-[#032316]/50 border border-emerald-950/80 rounded-full px-4 py-2 w-96 focus-within:border-[#008a47] focus-within:bg-[#032d1d]/85 transition-all shadow-inner">
            <Search className="h-4 w-4 text-emerald-600" />
            <input 
              type="text" 
              placeholder="Buscar marcas, modelos ou categorias..."
              className="bg-transparent border-none outline-none text-sm w-full text-zinc-100 placeholder-emerald-800/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-emerald-700 hover:text-emerald-500">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/cleris/admin" 
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#032316]/50 hover:bg-[#03301e]/80 text-[#10b981] hover:text-emerald-300 border border-emerald-900/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <User className="h-3.5 w-3.5" />
              Gabinete Cleris (Admin)
            </Link>

            {/* CART BUTTON */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-[#008a47]/20 hover:bg-[#008a47]/30 border border-[#008a47]/40 text-emerald-400 rounded-full transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
              <ShoppingBag className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-650 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#020e09] shadow-md animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SEARCH BAR (MOBILE) */}
        <div className="md:hidden px-4 pb-4">
          <div className="flex items-center gap-2 bg-[#032316]/50 border border-emerald-950/80 rounded-full px-4 py-2 w-full focus-within:border-[#008a47] focus-within:bg-[#032d1d]/85 transition-all shadow-inner">
            <Search className="h-4 w-4 text-emerald-600" />
            <input 
              type="text" 
              placeholder="Buscar modelos ou categorias..."
              className="bg-transparent border-none outline-none text-xs w-full text-zinc-100 placeholder-emerald-800/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-emerald-700 hover:text-emerald-500">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative text-white py-20 px-4 overflow-hidden border-b border-emerald-950/30 z-10">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#008a47] rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10b981]/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#008a47]/20 border border-[#008a47]/40 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Clock className="h-3 w-3" /> Tradição e Confiança
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-6">
              Mais de <span className="text-[#10b981] underline decoration-wavy underline-offset-8">40 anos</span> de História
            </h2>
            
            <p className="text-zinc-350 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium mb-8">
              A Cleris Calçados faz parte do dia a dia de Venâncio Aires, trazendo sapatos infantis, masculinos, femininos e esportivos com a qualidade de sempre, e agora a um clique de distância.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-700/80 font-bold">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#10b981]" /> Venâncio Aires, RS
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-950" />
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#10b981]" /> 2 Lojas Físicas
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-950" />
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-[#10b981]" /> Suporte & Venda Humana
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAIN STORE CONTENT */}
      <main className="container mx-auto px-4 md:px-8 py-12 max-w-7xl relative z-10">
        {/* CATEGORY NAV */}
        <div className="flex items-center justify-between border-b border-emerald-950/40 pb-4 mb-8 overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            {['todos', 'feminino', 'masculino', 'infantil', 'esportes'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? 'bg-[#008a47] text-white shadow-lg shadow-emerald-750/30'
                    : 'bg-[#032316]/40 hover:bg-[#032c1c]/80 text-emerald-600 hover:text-emerald-350 border border-emerald-950/80'
                }`}
              >
                {cat === 'todos' ? 'Todos' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-emerald-700/80 font-bold">
            Mostrando {filteredProducts.length} calçados
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#032316]/20 rounded-3xl border border-emerald-950/50 shadow-sm p-8">
            <ShoppingBag className="h-12 w-12 text-emerald-800 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-emerald-500 uppercase tracking-wider">Nenhum calçado encontrado</h3>
            <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto">
              Tente reajustar a busca ou adicionar novos modelos a partir do painel administrativo da Cleris!
            </p>
            <Link 
              href="/cleris/admin"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#008a47] hover:bg-[#007038] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
            >
              Cadastrar Calçado <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const prodImages = getProductImages(product);
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#032316]/40 backdrop-blur-md rounded-[32px] overflow-hidden border border-emerald-950/65 shadow-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.06)] hover:border-[#008a47]/30 transition-all duration-300 flex flex-col group relative"
                  >
                    {/* PRODUCT BADGE */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-[#020e09]/95 backdrop-blur-sm border border-emerald-950/60 rounded-full text-[9px] font-black uppercase tracking-wider text-emerald-400 shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    {/* PRODUCT IMAGE */}
                    <div className="h-64 relative bg-[#020e09] overflow-hidden cursor-pointer" onClick={() => { setSelectedProduct(product); setActiveImageIndex(0); }}>
                      <img 
                        src={prodImages[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Ver Detalhes
                        </span>
                      </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-zinc-100 group-hover:text-[#10b981] transition-colors leading-tight mb-2 uppercase tracking-tight">
                        {product.name}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-1">
                        {product.description}
                      </p>

                      {/* PRICING & PAYMENT */}
                      <div className="border-t border-emerald-950/60 pt-4 flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-black text-white">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-black text-emerald-450 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-900/40">
                            5% OFF no Pix
                          </span>
                        </div>
                        
                        <div className="text-[11px] text-zinc-450 font-semibold">
                          ou <strong className="text-[#10b981]">{product.installments}x de R$ {(product.price / product.installments).toFixed(2)}</strong> sem juros
                        </div>

                        <div className="text-[11px] text-emerald-400 font-bold mt-1 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/30 shadow-inner">
                          À vista no PIX: <strong className="text-white text-xs">R$ {getPixPrice(product.price).toFixed(2)}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => { setSelectedProduct(product); setActiveImageIndex(0); }}
                        className="w-full mt-6 py-3.5 bg-[#008a47] hover:bg-[#10b981] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md group-hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        Escolher Tamanho <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#010906] text-zinc-450 py-16 px-4 border-t border-emerald-950/40 mt-20 relative z-10">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <ClerisLogo variant="white-on-green" size="md" className="mb-4" />
            <p className="text-xs text-emerald-800/80 font-semibold max-w-sm mt-1 leading-relaxed">
              Resgatando 40 anos de orgulho comercial e trazendo a melhor curadoria de sapatos de Venâncio Aires diretamente para a sua tela.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-wider">
            <Link href="/cleris" className="hover:text-white text-emerald-700 transition-colors">Início</Link>
            <Link href="/cleris/admin" className="hover:text-white text-emerald-700 transition-colors">Administração (Gabinete)</Link>
            <span className="text-emerald-950">|</span>
            <span className="text-emerald-700">Venâncio Aires - RS</span>
          </div>
        </div>
        <div className="text-center text-[10px] text-emerald-950 font-black uppercase tracking-widest border-t border-emerald-950/30 pt-8 mt-12">
          © {new Date().getFullYear()} Cleris Calçados - Site Piloto. Desenvolvido no Gabinete Nexus.
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProduct && (() => {
          const prodImages = getProductImages(selectedProduct);
          const activeImage = prodImages[activeImageIndex] || prodImages[0];
          
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* BACKDROP */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setSelectedProduct(null); setSelectedSize(null); }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* MODAL WINDOW */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#02140d] border border-emerald-900/40 rounded-[40px] shadow-2xl max-w-3xl w-full overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none text-zinc-150"
              >
                <button 
                  onClick={() => { setSelectedProduct(null); setSelectedSize(null); }}
                  className="absolute top-4 right-4 p-2 bg-[#032316] hover:bg-emerald-900 border border-emerald-950 text-zinc-300 hover:text-white rounded-full transition-all z-20"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* PRODUCT IMAGES VIEWPORT + THUMBNAILS */}
                <div className="md:w-1/2 p-6 bg-[#020e09] flex flex-col justify-between">
                  {/* MAIN IMAGE */}
                  <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-black/30 relative">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        src={activeImage} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                  </div>

                  {/* THUMBNAILS LIST (Lado, Frente, Cima, Calçado) */}
                  {prodImages.length > 1 && (
                    <div className="flex gap-2.5 justify-center mt-4">
                      {prodImages.map((img, idx) => {
                        const labels = ['Lado', 'Frente', 'Cima', 'Calçando'];
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-14 h-14 rounded-xl overflow-hidden border-2 relative transition-all group ${
                              activeImageIndex === idx 
                                ? 'border-[#008a47] scale-105 shadow-md shadow-emerald-750/30' 
                                : 'border-emerald-950/80 opacity-60 hover:opacity-100'
                            }`}
                            title={labels[idx] || `Imagem ${idx + 1}`}
                          >
                            <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[7px] text-zinc-400 py-0.5 text-center truncate font-black uppercase">
                              {labels[idx] || `Foto ${idx + 1}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PRODUCT DETAILS */}
                <div className="md:w-1/2 p-8 overflow-y-auto flex flex-col">
                  <span className="px-3 py-1 bg-[#008a47]/20 border border-[#008a47]/40 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-wider w-fit mb-4">
                    {selectedProduct.category}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2 leading-tight">
                    {selectedProduct.name}
                  </h3>

                  <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  {/* PRICING DETAILS */}
                  <div className="bg-[#032316]/50 border border-emerald-950 p-4 rounded-3xl mb-6">
                    <div className="text-2xl font-black text-white leading-none mb-1.5">
                      R$ {selectedProduct.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-zinc-450 font-semibold mb-2">
                      ou {selectedProduct.installments}x de R$ {(selectedProduct.price / selectedProduct.installments).toFixed(2)} sem juros
                    </div>
                    <div className="text-xs text-emerald-450 font-extrabold bg-[#020e09]/90 border border-emerald-900/30 p-2.5 rounded-xl flex items-center gap-1.5 shadow-inner">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-450 animate-pulse" />
                      Valor no PIX: R$ {getPixPrice(selectedProduct.price).toFixed(2)} (5% OFF!)
                    </div>
                  </div>

                  {/* SIZE SELECTION */}
                  <div className="mb-6">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block mb-3">
                      Selecione o Tamanho:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 rounded-xl text-xs font-black transition-all border flex items-center justify-center ${
                            selectedSize === size
                              ? 'bg-[#008a47] text-white border-transparent scale-105 shadow-md shadow-emerald-750/30'
                              : 'bg-[#032316]/40 border-emerald-950 text-zinc-300 hover:bg-[#03301e] hover:border-[#10b981]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QTY & ADD TO CART */}
                  <div className="flex items-center gap-4 mt-auto border-t border-emerald-950/65 pt-6">
                    <div className="flex items-center border border-emerald-950 rounded-2xl bg-[#032316]/40 overflow-hidden shadow-inner">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-4 py-3 text-emerald-600 hover:bg-[#008a47]/10 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-black text-white">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-4 py-3 text-emerald-600 hover:bg-[#008a47]/10 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (!selectedSize) {
                          alert('Por favor, selecione um tamanho de calçado antes de prosseguir.');
                          return;
                        }
                        addToCart(selectedProduct, selectedSize, quantity);
                      }}
                      className="flex-1 py-4 bg-[#008a47] hover:bg-[#10b981] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                      Adicionar ao Carrinho <ShoppingBag className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* SHOPPING CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* BACKDROP */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-[#02140d] border-l border-emerald-950/65 shadow-2xl flex flex-col text-zinc-200"
              >
                {/* CART HEADER */}
                <div className="p-6 border-b border-emerald-950/60 flex items-center justify-between bg-[#010906]">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#10b981]" />
                    <h3 className="text-base font-extrabold uppercase tracking-widest text-emerald-450">
                      Carrinho Cleris
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* STEP INDICATOR (IF CHECKOUT STARTED) */}
                {cart.length > 0 && (
                  <div className="px-6 py-3 border-b border-emerald-950/30 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-[#010906]/50">
                    <span className={checkoutStep === 'cart' ? 'text-emerald-400' : 'text-emerald-800'}>1. Carrinho</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className={checkoutStep === 'payment' ? 'text-emerald-400' : 'text-emerald-800'}>2. Simulação PIX/Cartão</span>
                  </div>
                )}

                {/* CART CONTENT */}
                <div className="flex-1 overflow-y-auto p-6">
                  {checkoutStep === 'success' ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-emerald-950/50 border-2 border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-8 w-8" />
                      </div>
                      <h4 className="text-lg font-black uppercase tracking-wider text-white leading-tight">Pedido Enviado!</h4>
                      <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                        A mensagem com o resumo do carrinho foi encaminhada para o WhatsApp da loja para que você e o atendente finalizem a entrega!
                      </p>
                      <button
                        onClick={() => { setCheckoutStep('cart'); setIsCartOpen(false); }}
                        className="mt-8 px-6 py-3 bg-[#008a47] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#007038] transition-colors shadow-md"
                      >
                        Continuar Navegando
                      </button>
                    </div>
                  ) : checkoutStep === 'payment' ? (
                    /* SIMULATED CHECKOUT STEP */
                    <div className="space-y-6">
                      <div className="flex border border-emerald-950 rounded-2xl overflow-hidden p-1 bg-[#010906]">
                        <button
                          onClick={() => setPaymentMethod('pix')}
                          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                            paymentMethod === 'pix'
                              ? 'bg-[#008a47] text-white shadow-sm'
                              : 'text-emerald-700 hover:text-emerald-400'
                          }`}
                        >
                          PIX (5% OFF)
                        </button>
                        <button
                          onClick={() => setPaymentMethod('cartao')}
                          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                            paymentMethod === 'cartao'
                              ? 'bg-[#008a47] text-white shadow-sm'
                              : 'text-emerald-700 hover:text-emerald-400'
                          }`}
                        >
                          Cartão Crédito
                        </button>
                      </div>

                      {paymentMethod === 'pix' ? (
                        <div className="bg-[#032316]/50 border border-emerald-950 p-6 rounded-3xl text-center space-y-4 shadow-inner">
                          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest block w-fit mx-auto">
                            Economia de R$ {(getCartTotal() * 0.05).toFixed(2)}
                          </span>

                          <div className="bg-white p-4 border border-zinc-200 rounded-2xl w-40 h-40 mx-auto flex items-center justify-center shadow-md">
                            {/* MOCK QR CODE EMBLEM */}
                            <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-950 fill-current">
                              <rect x="0" y="0" width="30" height="30" />
                              <rect x="70" y="0" width="30" height="30" />
                              <rect x="0" y="70" width="30" height="30" />
                              <rect x="10" y="10" width="10" height="10" fill="white" />
                              <rect x="80" y="10" width="10" height="10" fill="white" />
                              <rect x="10" y="80" width="10" height="10" fill="white" />
                              <rect x="40" y="20" width="20" height="10" />
                              <rect x="30" y="50" width="30" height="20" />
                              <rect x="70" y="40" width="10" height="40" />
                              <rect x="80" y="80" width="20" height="10" />
                            </svg>
                          </div>

                          <div className="text-zinc-400 text-[10px] leading-relaxed">
                            Escaneie o QR Code ou copie a chave Pix abaixo. Envie o comprovante na finalização do WhatsApp.
                          </div>

                          <button
                            onClick={handleCopyPix}
                            className="w-full py-3 bg-[#032c1c] hover:bg-[#008a47] border border-emerald-900/40 text-emerald-450 hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                          >
                            {pixCopied ? (
                              <>
                                <Check className="h-4.5 w-4.5 text-emerald-400" /> Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4.5 w-4.5" /> Copiar Chave PIX
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        /* CREDIT CARD SIMULATOR */
                        <div className="bg-[#032316]/50 border border-emerald-950 p-6 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 border-b border-emerald-950 pb-3">
                            <CreditCard className="h-5 w-5 text-emerald-600" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-450">Simulador de Parcelamento</h4>
                          </div>

                          <div className="divide-y divide-emerald-950/70 text-xs">
                            {[1, 3, 6, 10].map((inst) => (
                              <div key={inst} className="py-2.5 flex items-center justify-between font-semibold">
                                <span className="text-zinc-450">{inst}x de</span>
                                <span className="text-white font-extrabold">
                                  R$ {(getCartTotal() / inst).toFixed(2)}
                                  <span className="text-[10px] font-black text-emerald-400 ml-1.5 uppercase">Sem Juros</span>
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="text-[10px] text-zinc-400 font-medium leading-relaxed bg-[#020e09]/50 border border-emerald-950 p-3 rounded-xl flex gap-2">
                            <Info className="h-4 w-4 text-emerald-650 flex-shrink-0" />
                            O atendente enviará o link da maquininha ou de pagamento seguro do banco no WhatsApp para conclusão.
                          </div>
                        </div>
                      )}

                      <div className="bg-amber-950/30 border border-amber-900/30 rounded-2xl p-4 flex gap-2.5 text-xs text-amber-300">
                        <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="font-semibold">
                          <p className="font-extrabold">Finalização via WhatsApp:</p>
                          <p className="text-[10px] leading-relaxed mt-1 text-amber-450">
                            Ao clicar em concluir, você enviará o resumo do pedido e a preferência de pagamento para o vendedor, garantindo um atendimento direto de Venâncio Aires!
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setCheckoutStep('cart')}
                          className="px-4 py-4 border border-emerald-950 hover:bg-[#032316] text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={handleFinishCheckout}
                          className="flex-1 py-4 bg-[#008a47] hover:bg-[#10b981] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
                        >
                          Concluir no WhatsApp <ExternalLink className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="text-center py-20">
                      <ShoppingBag className="h-12 w-12 text-emerald-900 mx-auto mb-4" />
                      <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Carrinho Vazio</h4>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        Que tal adicionar um lindo sapato ou tênis de nosso catálogo para ver a mágica acontecer?
                      </p>
                    </div>
                  ) : (
                    /* STANDARD SHOPPING CART ITEMS LIST */
                    <div className="space-y-4">
                      {cart.map((item, index) => {
                        const itemImages = getProductImages(item.product);
                        return (
                          <div 
                            key={`${item.product.id}-${item.size}`}
                            className="flex items-center gap-4 bg-[#032316]/50 p-3 rounded-2xl border border-emerald-950/60 relative shadow-sm"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#020e09] flex-shrink-0">
                              <img src={itemImages[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 min-w-0 pr-4">
                              <h4 className="text-xs font-bold text-white truncate uppercase leading-tight">
                                {item.product.name}
                              </h4>
                              <div className="text-[10px] text-zinc-400 font-bold uppercase mt-1">
                                Tamanho: <span className="text-[#10b981] font-black">{item.size}</span>
                              </div>
                              <div className="text-xs font-black text-emerald-450 mt-1">
                                R$ {item.product.price.toFixed(2)}
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                              <button 
                                onClick={() => removeFromCart(index)}
                                className="absolute top-2 right-2 text-emerald-800 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                              {/* QTY ADJUST IN CART */}
                              <div className="flex items-center border border-emerald-950 rounded-lg overflow-hidden bg-[#020e09] mt-4">
                                <button 
                                  onClick={() => updateCartQty(index, -1)}
                                  className="px-1.5 py-0.5 text-emerald-600 hover:bg-[#008a47]/20 font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="px-2 text-[11px] font-black text-white">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQty(index, 1)}
                                  className="px-1.5 py-0.5 text-emerald-600 hover:bg-[#008a47]/20 font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* CART FOOTER */}
                {cart.length > 0 && checkoutStep === 'cart' && (
                  <div className="p-6 border-t border-emerald-950/60 bg-[#010906] flex flex-col gap-4">
                    <div className="flex flex-col gap-1 border-b border-emerald-950/40 pb-4">
                      <div className="flex items-baseline justify-between text-xs font-bold text-emerald-800">
                        <span>Subtotal:</span>
                        <span>R$ {getCartTotal().toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-baseline justify-between text-sm font-extrabold text-emerald-450 bg-[#032316]/50 px-3 py-2 border border-emerald-900/30 rounded-xl mt-1.5 shadow-inner">
                        <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> Valor no PIX (5% OFF):</span>
                        <span>R$ {getPixPrice(getCartTotal()).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCheckoutStep('payment')}
                      className="w-full py-4 bg-[#008a47] hover:bg-[#10b981] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                      Avançar para Pagamento <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
