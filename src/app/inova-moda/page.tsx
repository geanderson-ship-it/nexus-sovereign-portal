'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Ruler, ShieldAlert, Sparkles, CheckCircle2, ChevronLeft, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

const clothingItems = [
  {
    id: 1,
    name: 'Vestido Alta Costura Inverno',
    price: 'R$ 1.890,00',
    image: 'https://images.unsplash.com/photo-1550614000-4b95d8822d1f?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '48',
    availableSizes: ['40', '42', '44', '46', '48', '50']
  },
  {
    id: 2,
    name: 'Conjunto Alfaiataria Plus',
    price: 'R$ 950,00',
    image: 'https://images.unsplash.com/photo-1612403239561-2495b11910bc?auto=format&fit=crop&w=800&q=80',
    recommendedSize: '52',
    availableSizes: ['46', '48', '50', '52', '54', '56']
  },
  {
    id: 3,
    name: 'Blazer Linho Verão',
    price: 'R$ 680,00',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    recommendedSize: 'M',
    availableSizes: ['P', 'M', 'G', 'GG', 'XG']
  }
];

export default function InovaModaApp() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showWaiver, setShowWaiver] = useState(false);

  const resetState = () => {
    setIsScanning(false);
    setScanComplete(false);
    setSelectedSize(null);
    setShowWaiver(false);
  };

  const startGpuScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      // Auto-select the recommended size initially
      if (selectedItem) setSelectedSize(selectedItem.recommendedSize);
    }, 3500);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (scanComplete && size !== selectedItem.recommendedSize) {
      setShowWaiver(true);
    } else {
      setShowWaiver(false);
    }
  };

  const confirmPurchase = () => {
    toast({
      title: 'Pedido Confirmado',
      description: 'Sua compra foi adicionada ao carrinho.',
    });
    setSelectedItem(null);
    resetState();
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 pb-20">
      
      {/* Header Mobile/Tablet */}
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-lg border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Link>
          <div className="flex items-center gap-2">
            <Shirt className="w-6 h-6 text-purple-500" />
            <h1 className="text-xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Inova Moda
            </h1>
          </div>
        </div>
        <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30">
          PROVADOR IA
        </div>
      </header>

      {/* Grid de Produtos */}
      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Coleção Exclusiva</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {clothingItems.map((item) => (
            <div 
              key={item.id} 
              className="group cursor-pointer bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all shadow-xl"
              onClick={() => { setSelectedItem(item); resetState(); }}
            >
              <div className="relative h-[400px] w-full overflow-hidden bg-neutral-800">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-white text-lg drop-shadow-md">{item.name}</h3>
                    <p className="text-purple-400 font-black">{item.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal do Provador Virtual */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-md w-full p-0 bg-neutral-900 border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {selectedItem && (
            <div className="flex flex-col h-[85vh] max-h-[800px]">
              
              {/* Imagem do Produto no Provador */}
              <div className="relative h-[40%] w-full bg-black">
                <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover object-top opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                
                {/* Efeito de Escaneamento (Laser) */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div 
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                      className="absolute left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_#22c55e] z-10"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Controles do Provador */}
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto relative z-20 -mt-10 bg-neutral-900 rounded-t-3xl border-t border-white/10">
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedItem.name}</h2>
                  <p className="text-neutral-400 text-sm mt-1">Provador Virtual Inteligente</p>
                </div>

                {!scanComplete && !isScanning && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                    <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                      <Camera className="w-10 h-10 text-purple-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-white mb-2">Não erre no tamanho!</h3>
                      <p className="text-sm text-neutral-400 max-w-[250px]">Nossa IA analisa sua biometria e recomenda o caimento perfeito para você.</p>
                    </div>
                    <Button 
                      onClick={startGpuScan} 
                      className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold tracking-widest uppercase mt-4 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analisar Biometria
                    </Button>
                  </div>
                )}

                {isScanning && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full border-4 border-neutral-800 border-t-green-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Ruler className="w-8 h-8 text-green-500 animate-pulse" />
                      </div>
                    </div>
                    <p className="font-bold text-green-500 tracking-widest uppercase animate-pulse text-sm">
                      Processando GPU...
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
                      <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-black text-green-500 uppercase">Laudo Biométrico Concluído</h4>
                        <p className="text-sm text-neutral-300 mt-1">
                          Baseado na sua estrutura corporal, o tamanho ideal para o caimento perfeito desta peça é:
                        </p>
                        <div className="mt-3 inline-block bg-green-500 text-black font-black px-4 py-1.5 rounded-lg text-2xl">
                          TAMANHO {selectedItem.recommendedSize}
                        </div>
                      </div>
                    </div>

                    {/* Seleção de Tamanho */}
                    <div>
                      <h4 className="text-sm font-bold text-neutral-400 uppercase mb-3">Escolha seu Tamanho</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedItem.availableSizes.map((size: string) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(size)}
                            className={`w-14 h-14 rounded-xl font-bold text-lg transition-all ${
                              selectedSize === size
                                ? size === selectedItem.recommendedSize
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
                          <div className="bg-amber-500/10 border border-amber-500/50 rounded-2xl p-4 flex gap-3 mt-2">
                            <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0" />
                            <div>
                              <h4 className="font-bold text-amber-500 text-sm">Aviso de Isenção de Logística</h4>
                              <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                                Você está selecionando o tamanho <strong>{selectedSize}</strong>, que diverge da recomendação técnica da nossa IA (Tamanho {selectedItem.recommendedSize}). 
                                <br/><br/>
                                Ao prosseguir, <strong>você concorda em isentar a loja dos custos de frete reverso</strong> caso a peça não sirva.
                              </p>
                              <div className="mt-3 flex items-center gap-2">
                                <input type="checkbox" id="waiver" className="w-4 h-4 accent-amber-500" required />
                                <label htmlFor="waiver" className="text-xs text-white font-bold cursor-pointer">
                                  Estou ciente e assumo o risco
                                </label>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button 
                      onClick={confirmPurchase}
                      className={`w-full h-14 rounded-full font-black tracking-widest uppercase transition-all ${
                        showWaiver 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                          : 'bg-green-500 hover:bg-green-600 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      }`}
                    >
                      Comprar Agora
                    </Button>

                  </motion.div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
