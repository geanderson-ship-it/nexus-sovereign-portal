'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shirt, Cpu, RefreshCw, CheckCircle2, ShieldCheck, Activity, Smartphone, Box, Zap, ShoppingBag, Camera, Upload, Video, ScanLine, ChevronLeft, Info, Sun } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import { useToast } from '@/hooks/use-toast';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function InovaModaPage() {
  const { t } = useLocale();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOutfit, setActiveOutfit] = useState('default');
  const [renderProgress, setRenderProgress] = useState(0);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

  // Estados do Scanner 360
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'record' | 'upload' | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadMediaType, setUploadMediaType] = useState<'video' | 'image' | null>(null);

  // Estados de Interação 3D (Zoom e Giro)
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !hasScanned) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePos({ x, y });
    
    // Calcula o tilt 3D baseado no centro (50,50)
    const rotateX = ((y - 50) / 50) * -20; // max 20 graus
    const rotateY = ((x - 50) / 50) * 20;  // max 20 graus
    
    setRotate({ x: rotateX, y: rotateY });
  };

  // Simulador de Escaneamento Inicial (Vídeo / Upload)
  const handleStartScan = (type: 'record' | 'upload') => {
    setScanType(type);
    setIsScanning(true);
    setRenderProgress(0);

    // Animação de captura e geração do Digital Twin
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setHasScanned(true);
          setIsScanning(false);
          return 100;
        }
        return prev + 2; // Leva 5 segundos
      });
    }, 100);
  };

  // Simulador de Renderização da IA (AWS SageMaker Mock)
  const handleTryOn = (outfitId: string) => {
    if (!hasScanned) return;
    if (isProcessing || activeOutfit === outfitId) return;
    
    setIsProcessing(true);
    setRenderProgress(0);
    
    // Animação de progresso da IA
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveOutfit(outfitId);
          setIsProcessing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Imagens (Mockups de alta qualidade usando Unsplash)
  const getModelImage = () => {
    switch (activeOutfit) {
      case 'jacket':
        return 'https://images.unsplash.com/photo-1550614000-4b95dd2475a8?q=80&w=800&auto=format&fit=crop';
      case 'dress':
        return 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop';
      case 'casual':
        return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
      case 'beach':
        return 'https://images.unsplash.com/photo-1516483638261-f4efa33cc2b6?q=80&w=800&auto=format&fit=crop';
      case 'lingerie':
        return 'https://images.unsplash.com/photo-1520021676839-869f21226162?q=80&w=800&auto=format&fit=crop';
      case 'nightwear':
        return 'https://images.unsplash.com/photo-1515347619246-814986797b5e?q=80&w=800&auto=format&fit=crop';
      case 'fitness':
        return 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop';
      case 'executive':
        return 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop';
      case 'male-suit':
        return 'https://images.unsplash.com/photo-1593030731557-41a4a408e01b?q=80&w=800&auto=format&fit=crop';
      case 'male-casual':
        return 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop';
      case 'kids-play':
        return 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=800&auto=format&fit=crop';
      case 'kids-winter':
        return 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?q=80&w=800&auto=format&fit=crop';
      case 'sneakers':
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
      default: // 'default'
        return uploadedImage || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop';
    }
  };

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-200 pt-28 pb-20 relative overflow-hidden">
      
      {/* BACKGROUND PREMIUM FASHION THEME */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/inovamoda-wide.png"
          alt="Moda colorida InovaModa"
          fill
          className="object-cover object-center opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-[#080b10]/40" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        


        {/* HEADER HERO */}
        <div className="text-center max-w-4xl mx-auto mb-16">

          {/* CARD PRINCIPAL */}
          <div className="relative rounded-3xl overflow-hidden border border-pink-500/20 bg-black/50 backdrop-blur-md shadow-[0_0_60px_rgba(236,72,153,0.15)] mb-12">
            
            {/* TOPO: Vídeo, depois Badge + Título */}
            <div className="px-8 pt-10 pb-6">
              
              <div className="w-full rounded-2xl overflow-hidden border border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.3)] bg-black/50 relative mb-4">
                <CustomVideoPlayer 
                  src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/InovaModa/Sofia_Inova_moda.mp4" 
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Botão de Saiba Mais (Detalhado) */}
              <div className="flex justify-center mb-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/40 border border-pink-500/30 text-pink-300 text-sm font-bold uppercase tracking-widest hover:bg-pink-500/20 hover:text-white transition-all shadow-[0_0_20px_rgba(236,72,153,0.15)] group">
                      <Video className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                      Saiba mais detalhes
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] bg-[#080b10] border-pink-500/30 text-white p-1">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle className="text-2xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 flex items-center gap-2">
                        <SparkleIcon className="w-5 h-5 text-pink-400" /> InovaModa 360 (Detalhado)
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Entenda como o Provador Virtual Neural revoluciona as vendas no varejo físico e digital.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-pink-500/30 bg-black shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                      <CustomVideoPlayer 
                        src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/InovaModa/Sofia_Inova_Moda_Detalhado.mp4" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-widest mb-6">
                <SparkleIcon className="w-4 h-4" /> Nexus Innovation
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-black text-white tracking-tight mb-4">
                InovaModa <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">360</span>
              </h1>
              
            </div>

            {/* MEIO: Imagem */}
            <div className="relative w-full h-[500px] md:h-[650px]">
              <Image
                src="/images/inovamoda-mosaic.png"
                alt="InovaModa 360 - Moda Colorida"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* BAIXO: Texto */}
            <div className="px-8 py-8 bg-black/40">
              <p className="text-lg md:text-xl text-zinc-300 font-light italic tracking-wide mb-3">
                "{t('inovamoda.slogan') || 'Em tempo real, revele todos os estilos que existem em você.'}"
              </p>
              <p className="text-base text-slate-400 font-light leading-relaxed">
                {t('inovamoda.descSimulator') || 'A evolução definitiva das vendas de Moda pela internet. O Provador Virtual 3D alimentado por Inteligência Artificial Soberana. Reduza as trocas e devoluções a quase zero.'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
            
            {/* Card Conversão */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-all flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-500/80 font-black uppercase tracking-widest leading-none block mb-1">Aumento de</span>
                  <span className="font-black text-white text-2xl leading-none tracking-wide block">Conversão +40%</span>
                </div>
              </div>
              <p className="text-emerald-100/70 text-sm leading-relaxed mt-auto">
                A recomendação de caimento perfeito elimina o medo de errar o tamanho, disparando a confiança do comprador e gerando um <strong>crescimento agressivo nas vendas</strong>.
              </p>
            </div>
            
            {/* Card Devolução */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-pink-500/30 shadow-[0_0_25px_rgba(236,72,153,0.15)] hover:shadow-[0_0_35px_rgba(236,72,153,0.25)] transition-all flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                  <RefreshCw className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <span className="text-[10px] text-pink-500/80 font-black uppercase tracking-widest leading-none block mb-1">Redução de</span>
                  <span className="font-black text-white text-2xl leading-none tracking-wide block">Devoluções -70%</span>
                </div>
              </div>
              <p className="text-pink-100/70 text-sm leading-relaxed mt-auto">
                Com precisão biométrica cirúrgica, os produtos chegam no tamanho certo, <strong>extinguindo custos ocultos de logística reversa</strong> e protegendo sua margem de lucro.
              </p>
            </div>
            
            {/* Card LGPD */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] transition-all flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <span className="text-[10px] text-blue-500/80 font-black uppercase tracking-widest leading-none block mb-1">Segurança e</span>
                  <span className="font-black text-white text-2xl leading-none tracking-wide block">Privacidade LGPD</span>
                </div>
              </div>
              <p className="text-blue-100/70 text-sm leading-relaxed mt-auto">
                Arquitetura Soberana com processamento fechado. Os dados biométricos são deletados no ato, <strong>blindando 100% sua empresa</strong> contra qualquer risco jurídico.
              </p>
            </div>

          </div>
        </div>

        {/* DEMO INTERATIVA (O PROVADOR) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* LADO ESQUERDO: O Espelho / Avatar */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <Card className="relative bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl h-[900px] w-full flex items-center justify-center">
              
              {!hasScanned && !isScanning && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/30">
                    <ScanLine className="w-10 h-10 text-pink-400" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-white mb-2">Construir Avatar 3D</h3>
                  <p className="text-slate-400 text-sm mb-4 max-w-xs">
                    Para provar as roupas, grave um vídeo rápido dando uma <strong>volta completa de corpo inteiro</strong> (mostrando todos os lados) para criarmos o seu "Gêmeo Digital".
                  </p>

                  {/* Dicas de Gravação */}
                  <div className="w-full max-w-xs mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-left">
                    <h4 className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Requisitos do Vídeo
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-start gap-1.5">
                        <Sun className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                        <span><strong>Iluminação:</strong> Grave em ambiente claro e bem iluminado.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Shirt className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-pink-400" />
                        <span><strong>Roupa Atual:</strong> Use roupas justas para a IA ler o formato do corpo (evite roupas largas).</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-400" />
                        <span><strong>Posição:</strong> Câmera na altura do peito/cintura, com o celular <strong>de pé (na vertical)</strong>.</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Selo LGPD / Aceite */}
                  <div 
                    className="flex items-start gap-3 w-full max-w-xs mb-6 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-left cursor-pointer hover:bg-emerald-500/20 transition-colors" 
                    onClick={() => setLgpdAccepted(!lgpdAccepted)}
                  >
                    <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${lgpdAccepted ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-900 border-slate-600'}`}>
                      {lgpdAccepted && <CheckCircle2 className="w-3 h-3 text-slate-900" />}
                    </div>
                    <div>
                      <h4 className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Termo LGPD 100%
                      </h4>
                      <p className="text-slate-300 text-xs leading-tight">
                        Autorizo gerar meu avatar. <strong>Meus dados serão apagados instantaneamente ao fechar o app.</strong>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Button 
                      disabled={!lgpdAccepted}
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadMediaType(null);
                        setActiveOutfit('default');
                        handleStartScan('record');
                      }}
                      className={`bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0 py-6 ${
                        !lgpdAccepted ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:from-pink-500 hover:to-purple-500 shadow-[0_0_20px_rgba(219,39,119,0.4)]'
                      }`}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Iniciar Demonstração (Câmera)
                    </Button>
                    
                    <div className="flex items-center gap-4 w-full">
                      <div className="h-px bg-slate-700 flex-1"></div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Opções de Teste Local</span>
                      <div className="h-px bg-slate-700 flex-1"></div>
                    </div>
                    
                    <div className="relative w-full">
                      <input 
                        type="file" 
                        accept="video/*,image/*"
                        disabled={!lgpdAccepted}
                        className={`absolute inset-0 w-full h-full opacity-0 z-10 ${lgpdAccepted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            const url = URL.createObjectURL(file);
                            setUploadedImage(url);
                            setUploadMediaType(file.type.startsWith('video/') ? 'video' : 'image');
                            setActiveOutfit('default');
                            handleStartScan('upload');
                          }
                        }}
                      />
                      <Button 
                        disabled={!lgpdAccepted}
                        variant="outline" 
                        className={`w-full border-slate-700 bg-slate-800/50 text-slate-300 py-6 relative z-0 ${lgpdAccepted ? 'hover:bg-slate-800' : 'opacity-50'}`}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Fazer Upload de Vídeo
                      </Button>
                    </div>
                    
                    {/* Aviso de Política de Trocas (Recomendação IA) */}
                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left">
                      <h4 className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> Política de Trocas
                      </h4>
                      <p className="text-amber-200/80 text-xs leading-relaxed">
                        Nossa IA recomenda o tamanho exato e o caimento perfeito para o seu biotipo. Compras realizadas em tamanhos <strong>diferentes</strong> da recomendação do sistema perderão o direito à troca gratuita (frete grátis) por divergência de tamanho.
                      </p>
                    </div>

                    {/* Aviso de Privacidade (Vídeo) */}
                    <p className="mt-4 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 
                      Este vídeo será excluído após o fechamento do aplicativo
                    </p>
                  </div>
                </div>
              )}

              {isScanning && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md p-8 text-center">
                  <div className="relative mb-8">
                    {scanType === 'record' ? (
                      <>
                        <div className="w-24 h-24 rounded-full border-4 border-slate-700 flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-500 rounded-full animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]"></div>
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-red-400 font-bold tracking-widest whitespace-nowrap flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> GRAVANDO
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-24 h-24 rounded-full border-4 border-slate-700 flex items-center justify-center relative overflow-hidden">
                          <Video className="w-10 h-10 text-slate-400" />
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-500/30 transition-all duration-100 ease-linear" style={{ height: `${renderProgress}%` }}></div>
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-blue-400 font-bold tracking-widest whitespace-nowrap flex items-center gap-2">
                          <Upload className="w-3 h-3" /> UPLOADING
                        </div>
                      </>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-headline font-bold text-white mb-2">
                    {renderProgress < 40 ? 'Capturando Imagens...' : renderProgress < 70 ? 'Mapeando Mesh 3D...' : 'Gerando Digital Twin...'}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">AWS SageMaker Computer Vision</p>
                  
                  <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-100 ease-linear ${scanType === 'record' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                  <p className="text-slate-500 mt-2 font-mono text-xs">{renderProgress}%</p>
                </div>
              )}

              {/* Imagem do Avatar (Sempre oculta até escanear) */}
              <div 
                className={`absolute inset-0 transition-opacity duration-1000 ${hasScanned ? 'opacity-100' : 'opacity-0'} overflow-hidden cursor-crosshair`}
                style={{ perspective: '1000px' }}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => { setIsDragging(false); setRotate({x: 0, y: 0}); }}
                onMouseMove={handleMouseMove}
              >
                {hasScanned && (
                  <div 
                    className="relative w-full h-full transition-transform duration-100 ease-linear"
                    style={{
                      transform: isDragging 
                        ? `scale(1.5) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` 
                        : 'scale(1) rotateX(0deg) rotateY(0deg)',
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                    }}
                  >
                    {uploadMediaType === 'video' && activeOutfit === 'default' ? (
                      <CustomVideoPlayer 
                        src={uploadedImage!}
                        className="object-contain w-full h-full pointer-events-none bg-black/40"
                      />
                    ) : (
                      <Image
                        src={getModelImage()}
                        alt="Virtual Try-On Model"
                        fill
                        className="object-contain object-center pointer-events-none"
                        priority
                        draggable={false}
                        unoptimized={getModelImage()?.startsWith('blob:')}
                      />
                    )}
                    
                    {isDragging && (
                      <div className="absolute inset-0 flex items-end justify-center pb-10 bg-black/10 z-10 pointer-events-none">
                        <div className="px-4 py-2 bg-black/60 backdrop-blur rounded-full text-white font-mono text-xs tracking-widest border border-white/20">
                          <RefreshCw className="w-4 h-4 inline-block animate-spin mr-2"/>
                          RENDERIZANDO MESH 360º
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dica de UI flutuante */}
              {hasScanned && !isDragging && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 backdrop-blur border border-pink-500/30 rounded-full text-[10px] font-bold text-pink-400 uppercase tracking-widest animate-pulse pointer-events-none z-10 flex items-center gap-2">
                  <ScanLine className="w-4 h-4" /> Clique e Segure para Visualização 360º
                </div>
              )}

              {/* Camada de Processamento IA */}
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                  <Cpu className="w-16 h-16 text-pink-500 animate-pulse mb-4" />
                  <h3 className="text-white font-headline text-xl mb-2">Processando Mesh 3D...</h3>
                  <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-100 ease-out"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                  <p className="text-pink-400 mt-2 font-mono text-sm">{renderProgress}% concluído</p>
                </div>
              )}

              {/* HUD / Interface de Câmera */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <div className="bg-black/50 backdrop-blur px-3 py-1.5 rounded text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  Nexus Mirror
                </div>
                <div className="bg-pink-600/80 backdrop-blur px-3 py-1.5 rounded text-[10px] font-bold text-white uppercase tracking-widest border border-pink-400/50 flex items-center gap-2">
                  Modo de Demonstração Comercial
                </div>
              </div>
            </Card>
          </div>

          {/* LADO DIREITO: Catálogo e Controles */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full">
            <div className="bg-slate-900/90 border border-pink-500/20 rounded-2xl px-8 py-6 mb-8 text-center shadow-[0_0_30px_rgba(236,72,153,0.1)]">
              <h2 className="text-3xl font-headline font-bold text-white mb-2">Simulador de Loja B2B</h2>
              <p className="text-slate-400">
                Selecione as peças do catálogo abaixo. A IA InovaModa mapeia a postura corporal, ajusta a iluminação dinâmica e sobrepõe as peças respeitando a física do tecido.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              
              <OutfitCard 
                title="Moda Praia (Summer)"
                description="Biquínis, maiôs e saídas de praia"
                icon={<Shirt className="w-5 h-5 text-cyan-400" />}
                isActive={activeOutfit === 'beach'}
                onClick={() => handleTryOn('beach')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Roupa Íntima (Lingerie)"
                description="Conjuntos rendados e peças delicadas"
                icon={<Shirt className="w-5 h-5 text-rose-400" />}
                isActive={activeOutfit === 'lingerie'}
                onClick={() => handleTryOn('lingerie')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Linha Night (Camisolas)"
                description="Pijamas de seda e camisolas"
                icon={<Shirt className="w-5 h-5 text-indigo-400" />}
                isActive={activeOutfit === 'nightwear'}
                onClick={() => handleTryOn('nightwear')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Vestido de Gala (Seda)"
                description="Simulação de caimento de tecido fino"
                icon={<Shirt className="w-5 h-5 text-purple-400" />}
                isActive={activeOutfit === 'dress'}
                onClick={() => handleTryOn('dress')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Moda Fitness"
                description="Leggings, tops e compressão esportiva"
                icon={<Shirt className="w-5 h-5 text-emerald-400" />}
                isActive={activeOutfit === 'fitness'}
                onClick={() => handleTryOn('fitness')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Look Executivo"
                description="Alfaiataria, blazers e ternos femininos"
                icon={<Shirt className="w-5 h-5 text-slate-300" />}
                isActive={activeOutfit === 'executive'}
                onClick={() => handleTryOn('executive')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Look Casual Inverno"
                description="Jaqueta de couro + blusa de lã"
                icon={<Shirt className="w-5 h-5 text-pink-400" />}
                isActive={activeOutfit === 'jacket'}
                onClick={() => handleTryOn('jacket')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Streetwear Verão"
                description="Camiseta e óculos de sol"
                icon={<Shirt className="w-5 h-5 text-blue-400" />}
                isActive={activeOutfit === 'casual'}
                onClick={() => handleTryOn('casual')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Alfaiataria Masculina"
                description="Ternos e moda social para homens"
                icon={<Shirt className="w-5 h-5 text-amber-500" />}
                isActive={activeOutfit === 'male-suit'}
                onClick={() => handleTryOn('male-suit')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Masculino Casual"
                description="Camisas pólo, jeans e jaquetas"
                icon={<Shirt className="w-5 h-5 text-slate-400" />}
                isActive={activeOutfit === 'male-casual'}
                onClick={() => handleTryOn('male-casual')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Infantil (Kids Casual)"
                description="Roupas leves para brincar"
                icon={<Shirt className="w-5 h-5 text-orange-400" />}
                isActive={activeOutfit === 'kids-play'}
                onClick={() => handleTryOn('kids-play')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Infantil Inverno"
                description="Casacos e moletons infantis"
                icon={<Shirt className="w-5 h-5 text-cyan-500" />}
                isActive={activeOutfit === 'kids-winter'}
                onClick={() => handleTryOn('kids-winter')}
                disabled={isProcessing || !hasScanned}
              />

              <OutfitCard 
                title="Calçados (Sneakers)"
                description="Tênis e calçados em 3D"
                icon={<Shirt className="w-5 h-5 text-red-500" />}
                isActive={activeOutfit === 'sneakers'}
                onClick={() => handleTryOn('sneakers')}
                disabled={isProcessing || !hasScanned}
              />

            </div>

          </div>

        </div>

        {/* MODA INCLUSIVA E ACESSIBILIDADE */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black border border-purple-500/30 p-1">
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
            <div className="relative bg-slate-950/80 backdrop-blur-xl rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
              <div className="flex-shrink-0 relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] relative z-10">
                  <Activity className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 bg-purple-500/50 rounded-full animate-ping"></div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Acessibilidade e Inclusão
                </div>
                <h3 className="text-2xl md:text-3xl font-headline font-black text-white mb-4">
                  Moda Inclusiva para Pessoas com Deficiência (PcD)
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  O InovaModa 360 não exige que o cliente fique em pé. A nossa IA mapeia o corpo humano a partir de uma simples foto frontal, permitindo que <strong>cadeirantes ou pessoas acamadas</strong> experimentem qualquer peça de roupa com total dignidade e conforto. Leve a verdadeira inclusão para o seu e-commerce.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD WHATSAPP */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-black/60 backdrop-blur-md border border-green-500/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Quero o InovaModa 360 na minha loja</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Fale agora com um especialista Nexus e descubra como implantar o provador virtual 3D na sua loja. Atendimento imediato via WhatsApp.
            </p>
            <button
              onClick={() => window.open('https://wa.me/5551999799582?text=Ol%C3%A1!%20Tenho%20interesse%20no%20InovaModa%20360%20para%20minha%20loja.%20Pode%20me%20enviar%20mais%20informa%C3%A7%C3%B5es%3F', '_blank')}
              className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] text-sm uppercase tracking-widest"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Falar com Especialista
            </button>
          </div>
        </div>

        {/* INFRAESTRUTURA */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-8">
            <h4 className="text-base font-bold uppercase tracking-widest text-slate-300 mb-8 flex items-center justify-center gap-2">
              <Box className="w-5 h-5 text-slate-400" /> Infraestrutura Tecnológica
            </h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 hover:bg-orange-500/20 transition-all">
                <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                  <Cpu className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-base font-black text-white mb-1">AWS SageMaker</div>
                <div className="text-sm text-orange-300/80 font-medium mb-1">GPU Inferência</div>
                <div className="text-xs text-orange-200/50 leading-tight">A nuvem mais avançada do mundo</div>
              </div>
              <div className="flex flex-col items-center text-center bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 hover:bg-blue-500/20 transition-all">
                <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-base font-black text-white mb-1">SMPL Mesh</div>
                <div className="text-sm text-blue-300/80 font-medium mb-1">Mapeamento 3D</div>
                <div className="text-xs text-blue-200/50 leading-tight">Precisão biométrica cirúrgica</div>
              </div>
              <div className="flex flex-col items-center text-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 hover:bg-emerald-500/20 transition-all">
                <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-base font-black text-white mb-1">LGPD Compliant</div>
                <div className="text-sm text-emerald-300/80 font-medium mb-1">Zero Retenção Facial</div>
                <div className="text-xs text-emerald-200/50 leading-tight">Privacidade garantida por lei</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Componente Interno para os Cards de Roupa
function OutfitCard({ title, description, icon, isActive, onClick, disabled }: any) {
  return (
    <div 
      onClick={disabled ? undefined : onClick}
      className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
        isActive 
          ? 'bg-pink-500/20 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.15)] cursor-default' 
          : 'bg-slate-900/90 border-slate-700 hover:border-slate-500 hover:bg-slate-800/95 cursor-pointer opacity-90 hover:opacity-100'
      } ${disabled && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isActive && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/20 rounded-bl-full flex items-start justify-end p-2">
          <CheckCircle2 className="w-4 h-4 text-pink-400" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded bg-slate-950 flex items-center justify-center border ${isActive ? 'border-pink-500/30' : 'border-slate-800'}`}>
          {icon}
        </div>
        <h4 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>{title}</h4>
      </div>
      <p className="text-xs text-slate-300">{description}</p>
    </div>
  );
}

function SparkleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18" />
      <path d="m4.93 4.93 14.14 14.14" />
      <path d="M3 12h18" />
      <path d="m4.93 19.07 14.14-14.14" />
    </svg>
  );
}
