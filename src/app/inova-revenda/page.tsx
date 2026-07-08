'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle, ArrowRight, ShoppingBag, TrendingUp, Users, Smartphone, BarChart3, MessageSquare, Zap, Target, Award, PlayCircle, Store, CarFront, Gauge, Banknote } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import * as gtag from '@/lib/gtag';

const WHATSAPP_URL = 'https://wa.me/5551999799582';

const categories = [
  { id: 'premium', label: 'Premium', color: 'gold' },
  { id: 'zeros', label: '0KM', color: 'sky' },
  { id: 'seminovos', label: 'Seminovos', color: 'purple' },
  { id: 'populares', label: 'Populares', color: 'amber' },
];

const cars = [
  // PREMIUM
  { id: 'p1', cat: 'premium', name: 'Bugatti Chiron Sport', spec: '2026 • 0 KM • W16 Quad-Turbo', img: '/Revenda/marcas-de-carros-de-luxo-bugatti.jpg', color: 'gold', desc: 'A mais alta engenharia automotiva mundial. Pronto para pronta entrega no Brasil.', price: 'Fale com o Consultor' },
  { id: 'p2', cat: 'premium', name: 'Lamborghini Revuelto', spec: '2026 • 0 KM • V12 Híbrido', img: '/Revenda/marcas-de-carros-de-luxo-lamborghini.jpg', color: 'gold', desc: 'O primeiro supersportivo híbrido V12 plug-in da marca. Potência sem precedentes.', price: 'Fale com o Consultor' },
  { id: 'p3', cat: 'premium', name: 'BMW iNEXT Concept', spec: '2026 • 0 KM • 100% Elétrico', img: '/Revenda/bmw-inext-repr-1024x675.webp', color: 'gold', desc: 'O futuro da mobilidade elétrica com design disruptivo e autonomia de 600km.', price: 'Fale com o Consultor' },
  
  // ZEROS
  { id: 'z1', cat: 'zeros', name: 'Fiat Fastback Impetus', spec: '2026 • 0 KM • Turbo 200', img: '/Revenda/fiat-fastback-impetus-t200-2023.jpg', color: 'sky', desc: 'Design coupé italiano com motor Turbo 200 Flex e tecnologia avançada.', price: 'Fale com o Consultor' },
  { id: 'z2', cat: 'zeros', name: 'Jeep Compass Série S', spec: '2026 • 0 KM • T270 Flex', img: '/Revenda/Okm.jpg', color: 'sky', desc: 'O SUV médio mais vendido do Brasil. Acabamento premium e teto solar.', price: 'Fale com o Consultor' },
  { id: 'z3', cat: 'zeros', name: 'Lançamento Exclusivo', spec: '2026 • 0 KM • Oportunidade', img: '/Revenda/43397_17646DBBC78C7C4F.webp', color: 'sky', desc: 'Série especial com pacote de opcionais exclusivos e financiamento facilitado.', price: 'Fale com o Consultor' },
  
  // SEMINOVOS
  { id: 's1', cat: 'seminovos', name: 'Fiat Toro Volcano', spec: '2022 • 45.000 KM • Turbo 270', img: '/Revenda/Fiat-Toro-Volcano-Turbo-270.jpg', color: 'purple', desc: 'Revisada, periciada e com laudo cautelar 100% aprovado. Único dono.', price: 'Fale com o Consultor' },
  { id: 's2', cat: 'seminovos', name: 'Ford EcoSport Titanium', spec: '2019 • 68.000 KM • Automático', img: '/Revenda/Ford-Ecosport_1.webp', color: 'purple', desc: 'Top de linha, teto solar, bancos em couro. Excelente custo-benefício.', price: 'Fale com o Consultor' },
  { id: 's3', cat: 'seminovos', name: 'Renault Logan Avantage', spec: '2020 • 52.000 KM • Manual', img: '/Revenda/logan-avantage.jpg', color: 'purple', desc: 'Espaço interno gigante e baixo consumo. Ideal para aplicativos ou família.', price: 'Fale com o Consultor' },
  
  // POPULARES
  { id: 'po1', cat: 'populares', name: 'VW Gol Trendline', spec: '2021 • 50.000 KM • Flex', img: '/Revenda/volkswagen-Gol-cinza.webp', color: 'amber', desc: 'O clássico inquebrável da Volkswagen. Revisões em dia.', price: 'Fale com o Consultor' },
  { id: 'po2', cat: 'populares', name: 'Fiat Mobi Trekking', spec: '2023 • 15.000 KM • Flex', img: '/Revenda/fiat-mobi-2023.jpg', color: 'amber', desc: 'Super econômico, prático para a cidade e com central multimídia.', price: 'Fale com o Consultor' },
  { id: 'po3', cat: 'populares', name: 'Chevrolet Onix Turbo', spec: '2024 • 10.000 KM • Flex', img: '/Revenda/Onix.png', color: 'amber', desc: 'Hatch mais econômico da categoria. Veículo impecável, igual a zero.', price: 'Fale com o Consultor' },
];

const colorStyles: Record<string, { border: string; badge: string; text: string; glow: string; bg: string; }> = {
  gold:    { border: 'border-[#cfa968]/40', badge: 'bg-[#cfa968]', text: 'text-[#cfa968]', glow: 'shadow-[0_0_30px_rgba(207,169,104,0.15)]', bg: 'bg-[#cfa968]/5' },
  sky:     { border: 'border-sky-500/40', badge: 'bg-sky-600', text: 'text-sky-400', glow: 'shadow-[0_0_30px_rgba(14,165,233,0.15)]', bg: 'bg-sky-500/5' },
  purple:  { border: 'border-purple-500/40', badge: 'bg-purple-600', text: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]', bg: 'bg-purple-500/5' },
  amber:   { border: 'border-amber-500/40', badge: 'bg-amber-600', text: 'text-amber-400', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]', bg: 'bg-amber-500/5' },
};

export default function InovaRevendaPage() {
  const [activeCat, setActiveCat] = useState('premium');
  const [aberto, setAberto] = useState<typeof cars[0] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scoreResult, setScoreResult] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setScoreResult(true);
    }, 2500);
  };

  const filteredCars = cars.filter(c => c.cat === activeCat);

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden">
      
      {/* BACKGROUND DA REVENDA */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/Revenda/revenda.png"
          alt="Inova Revenda Background"
          fill
          priority
          className="object-cover opacity-100"
          style={{ objectPosition: 'center top' }}
        />
        {/* Degradê apenas no rodapé para fundir com o resto do site, deixando a imagem viva no topo/centro */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#0f172a]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cfa968]/10 rounded-full blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 w-full flex justify-center pt-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full mb-24">
          
          <div className="w-full flex flex-col items-center text-center gap-6 mt-4 mb-6 max-w-4xl px-4 mx-auto p-8 rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
            
            <div className="w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.3)] bg-black/50 relative mb-6">
              <CustomVideoPlayer 
                src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Clara_Revenda_Apresentacao.mp4" 
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Botão de Saiba Mais (Detalhado) */}
            <div className="flex justify-center mb-10 z-20 relative">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/40 border border-amber-500/30 text-amber-400 text-sm font-bold uppercase tracking-widest hover:bg-amber-500/20 hover:text-white transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)] group">
                    <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                    Saiba mais detalhes
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] bg-[#0a0a0a] border-amber-500/30 text-white p-1">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-headline font-black text-amber-500 flex items-center gap-2">
                      <CarFront className="w-6 h-6" /> Inova Revenda (Detalhado)
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      O motor definitivo para escalar vendas de veículos, embarcações e aeronaves.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-amber-500/30 bg-black shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    <CustomVideoPlayer 
                      src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Clara_Inova_Revenda_Detalhado.mp4" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Badge className="bg-[#cfa968]/20 text-[#cfa968] border-[#cfa968]/40 px-6 py-1.5 tracking-[0.3em] font-mono text-[10px] mb-2">AUTO_INTELLIGENCE</Badge>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
              Inova <span className="text-[#cfa968]">Revenda</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base md:text-xl font-light tracking-wide max-w-2xl leading-relaxed mx-auto drop-shadow-md">
              O ecossistema digital de vendas guiado por Inteligência Artificial que se adapta exatamente ao seu negócio. Projetado para escalar vendas de alto valor, seja na comercialização de <strong>carros de luxo, motos, lanchas, iates, jatos particulares ou helicópteros</strong>. Atendimento premium e inteligência comercial 24 horas por dia.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#cfa968] text-black hover:bg-[#b8860b] font-black uppercase tracking-widest px-10 h-14 text-base rounded-2xl shadow-[0_0_40px_rgba(207,169,104,0.3)]">
              <Link href="#veiculos"><CarFront className="mr-2 h-4 w-4" /> Ver Veículos</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#cfa968]/40 text-[#cfa968] hover:bg-[#cfa968]/10 font-black uppercase tracking-widest px-10 h-14 text-base rounded-2xl">
              <Link href="#financiamento"><Banknote className="mr-2 h-4 w-4" /> Simular Financiamento</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* VITRINE DE VEÍCULOS */}
      <section id="veiculos" className="relative z-10 container mx-auto px-4 py-20">
        
        {/* TABS DE CATEGORIAS */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-8 py-3 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 border 
                ${activeCat === cat.id 
                  ? 'bg-white text-black border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.8)]' 
                  : 'bg-[#cfa968] text-black border-[#cfa968] shadow-[0_0_15px_rgba(207,169,104,0.5)] hover:bg-[#b8860b] hover:border-[#b8860b] hover:shadow-[0_0_25px_rgba(207,169,104,0.8)]'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* GRID DE CARROS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto min-h-[400px]">
          {filteredCars.map((car, i) => {
            const c = colorStyles[car.color];
            return (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setAberto(car)}
                className={`group cursor-pointer rounded-3xl overflow-hidden bg-black/90 backdrop-blur-2xl border ${c.border} ${c.glow} hover:-translate-y-2 transition-all duration-300 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.8)]`}
              >
                <div className="h-56 relative bg-white/5 flex items-center justify-center p-4">
                  <img src={car.img} alt={car.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-700 drop-shadow-2xl" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-white leading-tight mb-1">{car.name}</h3>
                  <p className={`text-[10px] font-bold ${c.text} tracking-widest uppercase mb-4`}>{car.spec}</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-300">{car.price}</span>
                    <span className={`text-[10px] font-black uppercase ${c.text} bg-white/5 px-3 py-1.5 rounded-lg group-hover:bg-white/10 transition-colors`}>
                      Ver Detalhes
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* FINANCIAMENTO & SCORE */}
      <section id="financiamento" className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 p-8 rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl inline-block w-full">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-md">
              <span className="text-orange-500">Financiamento</span> e Score
            </h2>
            <p className="text-slate-200 mt-4 max-w-2xl mx-auto drop-shadow-md">Simule seu financiamento e avalie seu score de crédito em segundos, 100% online e sem compromisso.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* FORMULÁRIO */}
            <div className="bg-black/90 backdrop-blur-2xl rounded-[40px] p-8 border border-orange-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
              <h3 className="text-2xl font-bold text-white mb-6">Simulador Rápido</h3>
              
              <div className="space-y-5 relative z-10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Veículo de Interesse</label>
                  <select className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition-colors appearance-none">
                    <option>Selecionar veículo...</option>
                    {cars.map(c => <option key={c.id}>{c.name} - {c.cat.toUpperCase()}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">CPF (Para Análise de Score)</label>
                  <input type="text" placeholder="000.000.000-00" className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition-colors" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Entrada (R$)</label>
                    <input type="text" placeholder="R$ 40.000,00" className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Parcelas</label>
                    <select className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition-colors appearance-none">
                      <option>48x</option>
                      <option>36x</option>
                      <option>24x</option>
                      <option>60x</option>
                    </select>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full mt-4 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-black uppercase tracking-widest py-6 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:scale-[1.02]"
                >
                  {isSimulating ? 'Consultando Bureaus...' : 'Analisar Score e Simular'}
                </Button>
              </div>
            </div>

            {/* RESULTADO */}
            <div className={`bg-black/90 backdrop-blur-2xl rounded-[40px] p-8 border flex flex-col items-center justify-center text-center transition-all duration-700 shadow-[0_10px_40px_rgba(0,0,0,0.8)]
              ${scoreResult ? 'border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 'border-slate-800 opacity-80'}`}>
              
              {!scoreResult ? (
                <>
                  <Gauge className="h-16 w-16 text-slate-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-400">Aguardando Dados</h3>
                  <p className="text-sm text-slate-500 mt-2 max-w-xs">Preencha o formulário ao lado para verificar as condições de aprovação em tempo real.</p>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full border-4 border-emerald-500 flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <span className="text-4xl font-black text-emerald-400">850</span>
                    <div className="absolute -bottom-3 bg-emerald-500 text-black text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">Score Alto</div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Crédito Pré-Aprovado!</h3>
                  <p className="text-sm text-slate-300 mb-8">Parabéns! Seu perfil tem excelentes condições de financiamento.</p>
                  
                  <div className="w-full bg-black/40 rounded-2xl p-6 text-left border border-white/5 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Taxa estimada</span>
                      <span className="text-emerald-400 font-black text-lg">0,99% a.m.</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Parcela sugerida</span>
                      <span className="text-white font-black text-lg">R$ 1.250,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Status no DETRAN</span>
                      <span className="text-emerald-400 font-black text-sm uppercase">Regular <CheckCircle className="inline h-4 w-4 ml-1" /></span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full mt-8 bg-emerald-500 text-black hover:bg-emerald-400 font-black uppercase tracking-widest py-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Link href={WHATSAPP_URL} target="_blank">Finalizar Contrato pelo WhatsApp</Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DO CARRO */}
      <Dialog open={!!aberto} onOpenChange={o => !o && setAberto(null)}>
        <DialogContent className="bg-[#0f172a] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] p-0">
          {aberto && (() => {
            const c = colorStyles[aberto.color];
            return (
              <div className="flex flex-col md:flex-row min-h-[400px]">
                <div className={`md:w-1/2 relative min-h-[250px] overflow-hidden bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-8`}>
                  <img src={aberto.img} alt={aberto.name} className="w-full object-contain drop-shadow-2xl" />
                  <Badge className={`absolute top-6 left-6 ${c.badge} text-white border-none px-3 py-1 text-[10px] font-black tracking-widest uppercase`}>
                    {aberto.cat}
                  </Badge>
                </div>

                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-black/40">
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-tight mb-2">
                    {aberto.name}
                  </h2>
                  <p className={`text-xs font-bold ${c.text} tracking-widest uppercase mb-6`}>{aberto.spec}</p>

                  <p className={`text-slate-300 leading-relaxed text-sm italic border-l-2 ${c.border} pl-4 mb-8`}>
                    "{aberto.desc}"
                  </p>

                  <div className={`p-6 rounded-2xl border ${c.border} bg-slate-900/50 mb-8 flex justify-between items-center`}>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Valor de Venda</p>
                      <p className={`text-2xl font-black ${c.text}`}>{aberto.price}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className={`flex-1 bg-transparent border-2 border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest h-12 rounded-xl`}>
                      <Link href="#financiamento" onClick={() => setAberto(null)}>Simular Financiamento</Link>
                    </Button>
                    <Button asChild className={`flex-1 ${c.badge} text-black font-black uppercase tracking-widest h-12 rounded-xl`}>
                      <Link href={WHATSAPP_URL} target="_blank"><Phone className="mr-2 h-4 w-4" /> Consultor VIP</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
