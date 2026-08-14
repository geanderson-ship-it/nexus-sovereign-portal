'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hotel, 
  Palmtree, 
  Home, 
  Megaphone, 
  Languages, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  MessageSquare, 
  X,
  Compass
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getVideoUrl } from '@/lib/video-helper';

const WHATSAPP_URL = 'https://wa.me/5551999799582';

interface PillarData {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: 'orange' | 'amber' | 'emerald' | 'cyan';
  tagline: string;
  description: string;
  video: string;
  features: string[];
  specs: {
    idiomas: string;
    integracao: string;
    roi: string;
  };
}

const pillars: PillarData[] = [
  {
    id: 'hoteis',
    title: 'Hotéis',
    subtitle: 'Concierge Virtual & Atendimento 5 Estrelas',
    icon: Hotel,
    color: 'orange',
    tagline: 'Eleve o padrão de hospitalidade com atendimento inteligente.',
    description: 'Transforme a experiência de hospedagem desde o primeiro clique. Nosso Concierge Virtual responde a dúvidas frequentes sobre check-in/out, horários do café da manhã, regras do hotel e comodidades, liberando sua equipe física para focar no atendimento presencial de excelência.',
    video: getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora%20Nexus/Hoteis.mp4', 'Hoteis.mp4'),
    features: [
      'Respostas instantâneas sobre comodidades e horários',
      'Integração direta com motores de reserva de diárias',
      'Suporte para solicitação de serviços de quarto e toalhas',
      'Painel de gestão de solicitações para a governança'
    ],
    specs: {
      idiomas: 'Mais de 50 idiomas com sotaque nativo',
      integracao: 'PMS do hotel, WhatsApp e Site Corporativo',
      roi: 'Redução de até 40% no volume de chamados na recepção.'
    }
  },
  {
    id: 'pousadas',
    title: 'Pousadas',
    subtitle: 'Proximidade, Acolhimento & Reservas Diretas',
    icon: Home,
    color: 'amber',
    tagline: 'O charme do acolhimento local com a eficiência da IA.',
    description: 'Pousadas prosperam na proximidade e no turismo local. Nossa IA atua como um guia local experiente, sugerindo roteiros turísticos, praias, restaurantes e passeios na região, ao mesmo tempo em que conduz o visitante do site pelo fluxo de reserva direta, reduzindo as comissões pagas a OTAs.',
    video: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    features: [
      'Indicação personalizada de pontos turísticos locais',
      'Automação de cotação de pacotes e diárias',
      'Atendimento humanizado 24 horas por dia, 7 dias por semana',
      'Resgate ativo de leads que abandonaram a conversa'
    ],
    specs: {
      idiomas: 'Português, Inglês, Espanhol e Alemão',
      integracao: 'WhatsApp Link, Instagram Direct e Site',
      roi: 'Aumento de até 25% nas reservas diretas sem intermediários.'
    }
  },
  {
    id: 'resorts',
    title: 'Resorts',
    subtitle: 'Experiência All-Inclusive & Logística VIP',
    icon: Palmtree,
    color: 'emerald',
    tagline: 'Navegação sem fricção pelo maior refúgio de lazer.',
    description: 'Resorts possuem operações vastas e complexas. Nossa IA atua como um mordomo digital dedicado, ajudando os hóspedes a agendarem sessões de spa, reservarem mesas nos restaurantes temáticos internos, conferirem a programação de lazer infantil e se localizarem no complexo.',
    video: getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora%20Nexus/Reorts.mp4', 'Reorts.mp4'),
    features: [
      'Agendamento de quadras, spas e atividades esportivas',
      'Reserva de mesas em restaurantes internos do complexo',
      'Mapa interativo de localização de piscinas e atrações',
      'Comunicação direta com o concierge VIP do resort'
    ],
    specs: {
      idiomas: 'Mais de 50 idiomas com tradução simultânea',
      integracao: 'Web App do Hóspede, QR Codes e Totens de autoatendimento',
      roi: 'Aumento de 30% no consumo de serviços adicionais (spa, passeios).'
    }
  },
  {
    id: 'marketing',
    title: 'Marketing & MarTech',
    subtitle: 'Avatares de IA Interativos para Conversão de Tráfego',
    icon: Megaphone,
    color: 'cyan',
    tagline: 'Transforme tráfego frio em reuniões agendadas.',
    description: 'Para agências de marketing e portais corporativos que exigem alta taxa de captação. O avatar interativo de IA age como um assistente ativo na landing page, aumentando o tempo de permanência no site, quebrando objeções e capturando dados ricos de contato de forma natural e interativa.',
    video: getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora%20Nexus/Marketing.mp4', 'Marketing.mp4'),
    features: [
      'Abordagem proativa ao visitante por voz ou texto',
      'Qualificação de leads B2B em tempo real (SDR integrada)',
      'Apresentação interativa de portfólio de serviços',
      'Testes A/B automatizados de pitches de conversão'
    ],
    specs: {
      idiomas: 'Adaptável ao sotaque da marca da agência',
      integracao: 'CRM (HubSpot, RD Station), Apollo e Analytics',
      roi: 'Aumento de até 3x na taxa de geração de leads qualificados.'
    }
  }
];

const colorMap = {
  orange: {
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    bg: 'bg-orange-500/5',
    glow: 'shadow-[0_0_60px_rgba(249,115,22,0.15)]',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    btn: 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    overlay: 'bg-orange-950/20'
  },
  amber: {
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    bg: 'bg-amber-500/5',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.15)]',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    btn: 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    overlay: 'bg-amber-950/20'
  },
  emerald: {
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.15)]',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    overlay: 'bg-emerald-950/20'
  },
  cyan: {
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    glow: 'shadow-[0_0_60px_rgba(6,182,212,0.15)]',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    hoverBorder: 'hover:border-cyan-500/50',
    overlay: 'bg-cyan-950/20'
  }
};

export default function MarketingPage() {
  const [selectedPillar, setSelectedPillar] = useState<PillarData | null>(null);

  const getWhatsAppMessage = (title: string) => {
    const text = `Olá! Vi a divisão de ${title} no portal da Nexus e gostaria de solicitar um orçamento para Concierge Virtual de IA.`;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#050506] text-slate-200 relative overflow-hidden pt-28 pb-24">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Divisão MarTech & Hospitalidade
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase mb-6 leading-tight">
            Nossos Canais de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Marketing & IA</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-light">
            Selecione uma área abaixo para descobrir as soluções de Concierges Virtuais e Avatares de IA Soberana desenhados para elevar o seu negócio.
          </p>
        </div>

        {/* GRID OF CINEMATIC CARD PLAYERS */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {pillars.map((pillar) => {
              const c = colorMap[pillar.color];
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(pillar)}
                  className="relative h-64 md:h-96 w-full rounded-[40px] overflow-hidden border border-slate-900 transition-all duration-700 group flex flex-col justify-end text-left hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl cursor-pointer"
                >
                  {/* BACKGROUND VIDEO OR IMAGE */}
                  <div className="absolute inset-0 z-0 bg-slate-950">
                    {pillar.video.endsWith('.mp4') ? (
                      <video 
                        src={pillar.video} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover opacity-35 group-hover:opacity-65 transition-opacity duration-1000" 
                      />
                    ) : (
                      <Image 
                        src={pillar.video} 
                        alt={pillar.title} 
                        fill 
                        className="object-cover opacity-35 group-hover:opacity-65 transition-opacity duration-1000" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02050b] via-[#02050b]/60 to-transparent" />
                    <div className={`absolute inset-0 ${c.overlay} mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 group-hover:${c.border} group-hover:${c.bg} transition-colors duration-500`}>
                        <pillar.icon className={`h-7 w-7 text-white group-hover:${c.text} transition-colors duration-500`} />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white mb-1.5 leading-none group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-500">
                      {pillar.title}
                    </h3>
                    <p className="text-xs md:text-base text-slate-400 max-w-sm leading-relaxed group-hover:text-white transition-colors duration-500">
                      {pillar.subtitle}
                    </p>
                    
                    <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      <div className={`p-3 rounded-full ${c.bg} ${c.border} border`}>
                        <ArrowRight className={`h-5 w-5 ${c.text}`} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* DETAIL DIALOG MODAL */}
        <Dialog open={!!selectedPillar} onOpenChange={(open) => !open && setSelectedPillar(null)}>
          {selectedPillar && (() => {
            const c = colorMap[selectedPillar.color];
            return (
              <DialogContent className="bg-slate-950 border border-slate-800 text-white max-w-4xl p-6 sm:p-8 rounded-[32px] shadow-2xl relative">
                
                <DialogHeader className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
                      <selectedPillar.icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${c.text} font-mono`}>
                      Nexus MarTech Division
                    </span>
                  </div>
                  
                  <DialogTitle className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white">
                    {selectedPillar.title}
                  </DialogTitle>
                  
                  <DialogDescription className="text-slate-400 text-sm mt-1">
                    {selectedPillar.tagline}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start my-4">
                  
                  {/* Detailed Description & Features */}
                  <div className="md:col-span-7 space-y-6">
                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                      {selectedPillar.description}
                    </p>

                    <div className="border-t border-slate-900 pt-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Diferenciais Técnicos:</h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {selectedPillar.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="p-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs text-slate-300 leading-snug">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Specs & CTA */}
                  <div className="md:col-span-5 space-y-6 bg-black/40 border border-slate-900 p-5 rounded-2xl">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-2">Especificações:</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Suporte Poliglota</span>
                        <p className="text-xs font-bold text-white">{selectedPillar.specs.idiomas}</p>
                      </div>
                      <div className="space-y-0.5 border-t border-slate-900/50 pt-3">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Canais Disponíveis</span>
                        <p className="text-xs font-bold text-white">{selectedPillar.specs.integracao}</p>
                      </div>
                      <div className="space-y-0.5 border-t border-slate-900/50 pt-3">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Retorno (ROI)</span>
                        <p className="text-xs font-bold text-white">{selectedPillar.specs.roi}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button asChild className={`w-full text-white font-bold uppercase tracking-widest text-xs h-12 rounded-xl transition-all hover:scale-103 ${c.btn}`}>
                        <Link href={getWhatsAppMessage(selectedPillar.title)} target="_blank">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Acionar Consultor B2B
                        </Link>
                      </Button>
                    </div>
                  </div>

                </div>

              </DialogContent>
            );
          })()}
        </Dialog>

        {/* SECONDARY CALL TO ACTION */}
        <div className="bg-gradient-to-br from-[#0a0a0c] to-[#111114] border border-slate-900 rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            <Languages className="w-3.5 h-3.5" /> Poliglota em mais de 50 Idiomas
          </span>
          <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-4">
            Deseja uma arquitetura customizada?
          </h3>
          <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto mb-8">
            Nossos engenheiros desenvolvem vozes customizadas, integrações de PMS proprietárias e personalidades únicas para o seu concierge. Solicite uma audiência comercial agora mesmo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={WHATSAPP_URL}
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] cursor-pointer"
            >
              Falar com Engenharia Comercial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/gabinete"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white font-bold uppercase tracking-widest text-xs rounded-full transition-all hover:scale-105 cursor-pointer"
            >
              Acessar Gabinete
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
