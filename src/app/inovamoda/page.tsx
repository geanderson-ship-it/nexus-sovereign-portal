'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Shirt, Cpu, RefreshCw, CheckCircle2, ShieldCheck, Activity, Smartphone, Box, Zap, ShoppingBag, Camera, Upload, Video, ScanLine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InovaModaPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOutfit, setActiveOutfit] = useState('default');
  const [renderProgress, setRenderProgress] = useState(0);

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
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        
        {/* HEADER HERO */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-widest mb-6">
            <SparkleIcon className="w-4 h-4" /> Nexus Innovation
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black text-white mb-6 tracking-tight">
            InovaModa <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">360</span>
          </h1>
          <p className="text-xl text-slate-400 font-light leading-relaxed mb-8">
            O &quot;Santo Graal&quot; do E-commerce de Moda. O Provador Virtual 3D alimentado por Inteligência Artificial Soberana. Reduza a logística reversa a quase zero.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Conversão +40%
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
              <RefreshCw className="w-4 h-4 text-pink-500" /> Devoluções -70%
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> AWS Privacy
            </div>
          </div>
        </div>

        {/* DEMO INTERATIVA (O PROVADOR) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* LADO ESQUERDO: O Espelho / Avatar */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <Card className="relative bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl h-[600px] w-full flex items-center justify-center">
              
              {!hasScanned && !isScanning && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/30">
                    <ScanLine className="w-10 h-10 text-pink-400" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-white mb-2">Construir Avatar 3D</h3>
                  <p className="text-slate-400 text-sm mb-8 max-w-xs">
                    Para provar as roupas, precisamos de um vídeo 360º do cliente para criar o "Gêmeo Digital".
                  </p>
                  
                  <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Button 
                      onClick={() => handleStartScan('record')}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-0 py-6"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Gravar Vídeo Agora (360º)
                    </Button>
                    
                    <div className="flex items-center gap-4 w-full">
                      <div className="h-px bg-slate-700 flex-1"></div>
                      <span className="text-xs text-slate-500 uppercase">ou</span>
                      <div className="h-px bg-slate-700 flex-1"></div>
                    </div>
                    
                    <div className="relative w-full">
                      <input 
                        type="file" 
                        accept="video/*,image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
                        variant="outline" 
                        className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 py-6 relative z-0"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Fazer Upload de Vídeo
                      </Button>
                    </div>
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
                      <video 
                        src={uploadedImage!}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
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
                <div className="bg-black/50 backdrop-blur px-3 py-1.5 rounded text-[10px] font-bold text-pink-400 uppercase tracking-widest border border-white/10 flex items-center gap-2">
                  360º Avatar
                </div>
              </div>
            </Card>
          </div>

          {/* LADO DIREITO: Catálogo e Controles */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full">
            <h2 className="text-3xl font-headline font-bold text-white mb-2">Simulador de Loja B2B</h2>
            <p className="text-slate-400 mb-8">
              Selecione as peças do catálogo abaixo. A IA InovaModa mapeia a postura corporal, ajusta a iluminação dinâmica e sobrepõe as peças respeitando a física do tecido.
            </p>

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

            {/* Painel de Arquitetura AWS */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
                <Box className="w-4 h-4 text-slate-500" /> Infraestrutura Tecnológica
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-orange-500/10 rounded flex items-center justify-center mb-2 border border-orange-500/20">
                    <Cpu className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-xs font-bold text-white">AWS SageMaker</div>
                  <div className="text-[10px] text-slate-500">GPU Inferência</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-blue-500/10 rounded flex items-center justify-center mb-2 border border-blue-500/20">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-xs font-bold text-white">SMPL Mesh</div>
                  <div className="text-[10px] text-slate-500">Mapeamento 3D</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-emerald-500/10 rounded flex items-center justify-center mb-2 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-xs font-bold text-white">LGPD Compliant</div>
                  <div className="text-[10px] text-slate-500">Zero Retenção Facial</div>
                </div>
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
          ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.15)] cursor-default' 
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800 cursor-pointer opacity-80 hover:opacity-100'
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
      <p className="text-xs text-slate-500">{description}</p>
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
