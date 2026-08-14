'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hotel, 
  Palmtree, 
  Home, 
  Megaphone, 
  Languages, 
  Calendar, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const WHATSAPP_URL = 'https://wa.me/5551999799582';

interface PillarData {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: 'orange' | 'amber' | 'emerald' | 'cyan';
  tagline: string;
  description: string;
  image: string;
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
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1545231027-63b3f1e37be1?auto=format&fit=crop&q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
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
    border: 'border-orange-500/25',
    text: 'text-orange-400',
    bg: 'bg-orange-500/5',
    glow: 'shadow-[0_0_50px_rgba(249,115,22,0.15)]',
    btn: 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    hoverBorder: 'hover:border-orange-500/50'
  },
  amber: {
    border: 'border-amber-500/25',
    text: 'text-amber-400',
    bg: 'bg-amber-500/5',
    glow: 'shadow-[0_0_50px_rgba(245,158,11,0.15)]',
    btn: 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    hoverBorder: 'hover:border-amber-500/50'
  },
  emerald: {
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    glow: 'shadow-[0_0_50px_rgba(16,185,129,0.15)]',
    btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    hoverBorder: 'hover:border-emerald-500/50'
  },
  cyan: {
    border: 'border-cyan-500/25',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    glow: 'shadow-[0_0_50px_rgba(6,182,212,0.15)]',
    btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    hoverBorder: 'hover:border-cyan-500/50'
  }
};

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<string>('hoteis');

  const currentPillar = pillars.find(p => p.id === activeTab) || pillars[0];
  const c = colorMap[currentPillar.color];

  return (
    <div className="min-h-screen bg-[#060607] text-slate-200 relative overflow-hidden pt-28 pb-16">
      {/* Glows de Fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CABEÇALHO */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Divisão MarTech & Hospitalidade
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase mb-6 leading-tight">
            Avatares de IA para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Turismo & Vendas</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-light">
            A única tecnologia brasileira de Concierges Virtuais e Avatares de IA 100% personalizáveis e poliglotas em tempo real. Soluções customizadas para hotéis, pousadas, resorts e marketing de alta conversão.
          </p>
        </div>

        {/* NAVEGAÇÃO DE ABAS / BOTÕES GRANDES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
          {pillars.map((pillar) => {
            const isActive = activeTab === pillar.id;
            const pilCol = colorMap[pillar.color];
            const PilIcon = pillar.icon;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all duration-500 cursor-pointer
                  ${isActive 
                    ? `${pilCol.border} ${pilCol.bg} ${pilCol.glow} border-opacity-100 scale-102` 
                    : 'border-slate-900 bg-slate-950/40 hover:bg-slate-900/30'
                  }
                `}
              >
                <div className={`p-3 rounded-xl mb-3 border ${isActive ? `${pilCol.border} bg-black/40` : 'border-white/5 bg-slate-950'} transition-colors duration-500`}>
                  <PilIcon className={`w-6 h-6 ${isActive ? pilCol.text : 'text-slate-500'}`} />
                </div>
                <span className={`text-sm font-bold tracking-wider uppercase ${isActive ? 'text-white font-black' : 'text-slate-400'}`}>
                  {pillar.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* DETALHE DA ABA ATIVA */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`bg-[#0a0a0c]/80 border ${c.border} rounded-[32px] p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden max-w-6xl mx-auto mb-20`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-tr-[32px] rounded-bl-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Lado Esquerdo: Info */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${c.bg} border ${c.border}`}>
                    <currentPillar.icon className={`w-6 h-6 ${c.text}`} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${c.text} font-mono`}>
                    Foco de Atuação
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
                    {currentPillar.subtitle}
                  </h2>
                  <p className={`text-sm sm:text-base font-bold ${c.text} mb-4`}>
                    {currentPillar.tagline}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">
                    {currentPillar.description}
                  </p>
                </div>

                {/* Grid de Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-900/50">
                  {currentPillar.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-slate-300 font-light leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Especificações Técnicas (Specs) */}
                <div className="bg-black/35 rounded-2xl p-6 border border-slate-900 gap-4 grid grid-cols-1 sm:grid-cols-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Suporte Poliglota</span>
                    <p className="text-xs font-bold text-white">{currentPillar.specs.idiomas}</p>
                  </div>
                  <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-slate-900 pt-3 sm:pt-0 sm:px-4">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Canais Integrados</span>
                    <p className="text-xs font-bold text-white">{currentPillar.specs.integracao}</p>
                  </div>
                  <div className="space-y-1 border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-4">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">ROI Estimado</span>
                    <p className="text-xs font-bold text-white">{currentPillar.specs.roi}</p>
                  </div>
                </div>
              </div>

              {/* Lado Direito: Imagem e Destaque */}
              <div className="lg:col-span-5 relative w-full aspect-square sm:aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-slate-900">
                <Image 
                  src={currentPillar.image} 
                  alt={currentPillar.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/5 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-1">
                    <Bot className="w-4 h-4 text-orange-400" />
                    Inteligência Artificial Ativa
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Todos os avatares da Nexus operam localmente com síntese de voz limpa (TTS) e modelos neurais avançados.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* CHAMADA PARA AÇÃO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#0a0a0c] to-[#111114] border border-orange-500/25 rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl max-w-5xl mx-auto"
        >
          {/* Brilhos decorativos */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-[90px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[90px]" />

          <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            <Languages className="w-3.5 h-3.5" /> Poliglota em mais de 50 Idiomas
          </span>
          
          <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
            Deseja um Concierge Exclusivo?
          </h3>
          
          <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto mb-8">
            Desenvolvemos o layout de voz e a personalidade do seu avatar sob medida. Fale com a diretoria virtual ou inicie um contato com nossos engenheiros comerciais para solicitar um orçamento customizado para sua rede de hotéis, pousada ou agência.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={WHATSAPP_URL}
              target="_blank"
              className={`inline-flex items-center gap-2 px-8 py-3.5 text-white font-bold uppercase tracking-widest text-xs rounded-full transition-all hover:scale-105 ${c.btn} cursor-pointer`}
            >
              Falar com Consultor Comercial
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link 
              href="/gabinete"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white font-bold uppercase tracking-widest text-xs rounded-full transition-all hover:scale-105 cursor-pointer"
            >
              Acessar Gabinete de IA
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
