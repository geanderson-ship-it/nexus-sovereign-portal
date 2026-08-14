'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hotel, 
  Palmtree, 
  Megaphone, 
  Languages, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  MessageSquare, 
  Compass,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Building2,
  Palette
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { getVideoUrl } from '@/lib/video-helper';

const WHATSAPP_URL = 'https://wa.me/5551999799582';

interface ModuleData {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  icon: any;
  color: 'orange' | 'emerald' | 'cyan';
  features: string[];
  image: string;
  licenca: string;
  suporte: string;
  roi: string;
  frozen?: boolean;
}

interface PillarData {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: 'orange' | 'emerald' | 'cyan';
  tagline: string;
  description: string;
  video: string;
  modules: ModuleData[];
  specs?: {
    idiomas: string;
    integracao: string;
    roi: string;
  };
}

// Módulos específicos para Hotéis e Pousadas
const hoteisPousadasModules: ModuleData[] = [
  {
    id: 'hp_concierge',
    badge: 'HOSPITALITY_AI',
    title: 'Helena',
    highlight: 'CONCIERGE VIRTUAL',
    subtitle: 'Atendimento e Recepção Digital 24/7',
    description: 'Sua recepção nunca dorme. A Helena acolhe seus hóspedes de forma imediata e autônoma, respondendo sobre horários de café da manhã, regras de hospedagem, voltagem das tomadas, política de pets, senha do Wi-Fi e estacionamento. Reduz drasticamente o volume de contatos repetitivos e libera sua recepção física para focar em check-ins presenciais complexos.',
    icon: Hotel,
    color: 'orange',
    features: [
      'Recepção Autônoma Poliglota: Atendimento com sotaque nativo em mais de 50 idiomas',
      'Check-in & Check-out Express: Envio automático de instruções e fichas FNRH',
      'Tira-Dúvidas Instantâneo: Respostas em menos de 5 segundos no WhatsApp e Web',
      'Integração de Sistemas: Conexão direta com sistemas PMS (Desbravador, Totvs, Hospedin)'
    ],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Reduz os custos operacionais de recepção e atendimento ao cliente em até 35%.'
  },
  {
    id: 'hp_guialocal',
    badge: 'LOCAL_GUIDE_AI',
    title: 'Helena',
    highlight: 'GUIA TURÍSTICO DIGITAL',
    subtitle: 'Roteiros, Dicas Locais e Experiências',
    description: 'Entregue o verdadeiro segredo local. A inteligência atua como um guia experiente, recomendando praias ideais por horário, trilhas de aventura, monumentos históricos, pontos turísticos e roteiros sob medida de acordo com o perfil do hóspede. Melhora radicalmente a experiência do visitante e fideliza clientes.',
    icon: Compass,
    color: 'orange',
    features: [
      'Curadoria dinâmica de pontos turísticos e segredos locais',
      'Recomendações gastronômicas inteligentes com envio de cardápios',
      'Rotas diretas integradas e caminhos prontos do Google Maps e Waze',
      'Agenda de eventos e shows locais atualizada dinamicamente'
    ],
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Gera receitas adicionais fechando parcerias de comissão cruzada com guias e restaurantes.'
  },
  {
    id: 'hp_reservas',
    badge: 'BOOKING_INTELLIGENCE',
    title: 'Helena',
    highlight: 'RESERVAS INTELIGENTES',
    subtitle: 'Cotação de Pacotes e Vendas Diretas',
    description: 'A máquina de vendas diretas que o seu hotel precisa. O visitante insere o período e número de pessoas por WhatsApp ou site, a IA calcula as tarifas flutuantes e apresenta os quartos disponíveis em segundos. Ela faz o checkout imediato via Pix ou link de cartão e resgata orçamentos abandonados de forma proativa.',
    icon: Calendar,
    color: 'orange',
    features: [
      'Orçamento Express: Tarifas e disponibilidade calculados em 10 segundos',
      'Checkout Instantâneo Integrado com geração de chaves Pix ou links de cartão',
      'Recuperação de orçamentos abandonados com contato proativo inteligente',
      'Sugestão de Upgrades: Venda inteligente de adicionais e categorias superiores'
    ],
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Zera as comissões abusivas de 15% a 22% cobradas por OTAs (Booking, Expedia).'
  },
  {
    id: 'hp_governanca',
    badge: 'ROOM_SERVICE_AI',
    title: 'Helena',
    highlight: 'ROOM SERVICE DIGITAL',
    subtitle: 'Pedidos de Quarto e Chamados de Limpeza',
    description: 'Leve a conveniência para o quarto do hóspede. Ele pode visualizar o cardápio completo, fazer pedidos de refeições e bebidas ou solicitar itens de frigobar diretamente pelo WhatsApp. A IA roteia o chamado automaticamente para a cozinha ou bar e permite solicitar serviços de lavanderia e manutenção.',
    icon: MessageSquare,
    color: 'orange',
    features: [
      'Cardápio Interativo por WhatsApp para pratos, bebidas e frigobar',
      'Chamados de governança instantâneos (limpeza, reposição de travesseiros e toalhas)',
      'Painel centralizado e fila de pedidos para otimização da equipe interna',
      'Pesquisa de NPS e satisfação disparada logo após a conclusão'
    ],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Aumenta em até 40% o ticket médio de consumo interno devido à facilidade de compra.'
  }
];

// Módulos específicos para Resorts
const resortsModules: ModuleData[] = [
  {
    id: 'resort_spa',
    badge: 'SPA_SCHEDULING',
    title: 'Helena',
    highlight: 'AGENDA DE SPA E MASSAGEM',
    subtitle: 'Consultas de Horário e Agendamentos',
    description: 'Aumente o faturamento de serviços complementares. Os hóspedes do resort podem consultar o menu de terapias, conferir os preços e agendar sessões de spa diretamente pelo celular de forma autônoma.',
    icon: Sparkles,
    color: 'emerald',
    features: [
      'Cardápio completo de terapias e massagens por áudio ou texto',
      'Sincronização em tempo real com a agenda dos terapeutas',
      'Lembretes automáticos enviados antes do horário marcado',
      'Integração de cobrança direta na conta do quarto do hóspede'
    ],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Aumenta em até 30% a ocupação dos spas e terapias do complexo.'
  },
  {
    id: 'resort_gastronomia',
    badge: 'FINE_DINING_INTELLIGENCE',
    title: 'Helena',
    highlight: 'RESERVA DE RESTAURANTES',
    subtitle: 'Otimização de Capacidade e Fila Digital',
    description: 'Elimine filas e gargalos nos restaurantes à la carte do resort. A IA gerencia os agendamentos de mesas por horários e notifica os hóspedes quando a mesa deles estiver pronta para o jantar.',
    icon: Hotel,
    color: 'emerald',
    features: [
      'Agendamento automático de jantares temáticos',
      'Exibição dinâmica de menus em múltiplos idiomas',
      'Notificações de mesa liberada enviadas por WhatsApp',
      'Controle inteligente de lotação por restaurante'
    ],
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Zera as reclamações de hóspedes relacionadas a filas de jantar.'
  },
  {
    id: 'resort_lazer',
    badge: 'ACTIVITIES_SCHEDULE',
    title: 'Helena',
    highlight: 'CRONOGRAMA DE LAZER',
    subtitle: 'Programação Diária de Recreação e Quadras',
    description: 'Mantenha os hóspedes entusiasmados. A IA divulga a agenda diária de shows, atividades infantis do Kids Club e gerencia o agendamento de quadras de tênis e beach tennis.',
    icon: Compass,
    color: 'emerald',
    features: [
      'Divulgação automatizada da agenda recreativa diária',
      'Agendamento e controle de horários de quadras de esportes',
      'Alertas de início de shows e eventos para hóspedes interessados',
      'Tira-dúvidas sobre regras e restrições de idade para tobogãs'
    ],
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Maximiza o uso das instalações de lazer sem conflito de reservas.'
  }
];

// Módulos específicos para Marketing e MarTech
const marketingModules: ModuleData[] = [
  {
    id: 'mkt_embaixadora',
    badge: 'MARTECH_VIDEO_AI',
    title: 'Djeny',
    highlight: 'EMBAIXADORAS DIGITAIS',
    subtitle: 'Avatares Interactivos de Vídeo em Sites',
    description: 'Humanização e conversão extrema. A Djeny atua como uma assistente virtual interativa por vídeo em seu site, falando de forma fluida por voz para prender a atenção do usuário.',
    icon: Bot,
    color: 'cyan',
    features: [
      'Síntese realista de vídeo em tempo real (avatar humanizado)',
      'Conversação integrada a pitches comerciais de vendas',
      'Estilo customizado alinhado às cores do seu site corporativo',
      'Abordagem active no momento certo de navegação'
    ],
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Dobra a permanência média do usuário em landing pages de vendas.'
  },
  {
    id: 'mkt_apollo',
    badge: 'PROSPECTION_INTELLIGENCE',
    title: 'Apollo',
    highlight: 'ROBÔ DE PROSPECÇÃO B2B',
    subtitle: 'Automação Estratégica de LinkedIn e Leads',
    description: 'Automatize a captação de grandes contas. O Apollo localiza cargos decisores (CEOs, Diretores de RH/Operações) dentro de filtros específicos e inicia conexões personalizadas em escala.',
    icon: Megaphone,
    color: 'cyan',
    features: [
      'Varredura inteligente de perfis baseada em cargo e setor',
      'Envio de convites e follow-ups estruturados por IA',
      'Alertas automáticos de respostas no painel comercial',
      'Blindagem de segurança para respeitar os limites do LinkedIn'
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Gera de 10 a 15 novas oportunidades comerciais B2B qualificadas/mês.'
  },
  {
    id: 'mkt_isadora',
    badge: 'SALES_SDR_AI',
    title: 'Isadora',
    highlight: 'SDR E QUALIFICAÇÃO ATIVA',
    subtitle: 'Triagem de Leads e Agendamento no WhatsApp',
    description: 'Diga adeus ao tempo perdido com leads frios. A Isadora recebe os contatos vindos de anúncios e realiza a triagem imediata no WhatsApp, agendando chamadas diretamente no calendário dos vendedores.',
    icon: MessageSquare,
    color: 'cyan',
    features: [
      'Velocidade de contato inicial abaixo de 2 minutos',
      'Triagem com base em orçamento e fit de projeto',
      'Integração com Google Agenda, Calendly e Hubspot CRM',
      'Abordagem ativa para ressuscitar leads frios de sua base'
    ],
    image: 'https://images.unsplash.com/photo-1552581230-c0159146269a?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Aumenta a conversão de leads vindos de tráfego pago em até 300%.'
  }
];

const pillars: PillarData[] = [
  {
    id: 'hoteis-pousadas',
    title: 'Hotéis & Pousadas',
    subtitle: 'Concierge Virtual, Acolhimento & Reservas Diretas',
    icon: Hotel,
    color: 'orange',
    tagline: 'Eleve o padrão de hospitalidade e potencialize suas reservas diretas.',
    description: 'Desde grandes hotéis de rede até pousadas boutique acolhedoras. Nosso Concierge Virtual responde a dúvidas frequentes sobre check-in/out, horários de café da manhã e comodidades, além de atuar como guia local sugerindo passeios turísticos e praias. Ao mesmo tempo, conduz o visitante pelo fluxo de reservas diretas, reduzindo comissões para plataformas terceiras.',
    video: getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora%20Nexus/Hoteis.mp4', 'Hoteis.mp4'),
    modules: hoteisPousadasModules
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
    modules: resortsModules
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
    modules: marketingModules
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
    overlay: 'bg-cyan-950/20'
  }
};

export default function MarketingPage() {
  const [activeMacro, setActiveMacro] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Reset expanded card when leaving/switching sections
  useEffect(() => {
    setExpandedCard(null);
  }, [activeMacro]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const macro = params.get('macro');
    if (macro) {
      setActiveMacro(macro);
    }
  }, []);

  const activeMacroData = pillars.find(p => p.id === activeMacro);
  const activeModules = activeMacroData?.modules || [];
  const macroColor = activeMacroData ? colorMap[activeMacroData.color] : colorMap.orange;

  const getWhatsAppMessage = (title: string) => {
    const text = `Olá! Gostaria de mais informações e de solicitar um orçamento para o módulo [NEXUS]: ${title}.`;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#050506] text-slate-200 relative overflow-hidden pt-28 pb-24">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <AnimatePresence mode="wait">
          {!activeMacro ? (
            /* =========================================
               VISTA 1: OS 3 MACRO CARDS
               ========================================= */
            <motion.div
              key="macro-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {pillars.map((pillar) => {
                    const c = colorMap[pillar.color];
                    return (
                      <button
                        key={pillar.id}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setActiveMacro(pillar.id);
                          window.history.pushState(null, '', `?macro=${pillar.id}`);
                        }}
                        className="relative h-64 md:h-[450px] w-full rounded-[40px] overflow-hidden border border-slate-900 transition-all duration-700 group flex flex-col justify-end text-left hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl cursor-pointer"
                      >
                        {/* BACKGROUND VIDEO */}
                        <div className="absolute inset-0 z-0 bg-slate-950">
                          <video 
                            src={pillar.video} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover opacity-35 group-hover:opacity-65 transition-opacity duration-1000" 
                          />
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
                          
                          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-1.5 leading-tight group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-500">
                            {pillar.title}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-400 max-w-sm leading-relaxed group-hover:text-white transition-colors duration-500">
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
            </motion.div>
          ) : (
            /* =========================================
               VISTA 2: DETALHES DA MACRO COM SEUS MÓDULOS
               ========================================= */
            <motion.div
              key="modules-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-full min-h-screen pb-24"
            >
              {/* Botão de Voltar */}
              <button 
                onClick={() => {
                  setActiveMacro(null);
                  window.history.pushState(null, '', window.location.pathname);
                }}
                className="group flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Voltar aos Canais</span>
              </button>

              {/* APRESENTAÇÃO DE VÍDEO DO SETOR */}
              {activeMacroData?.video && (
                <div className="w-full mb-12 flex flex-col items-center">
                  <div className={`relative w-full max-w-4xl aspect-video rounded-[32px] overflow-hidden border ${macroColor.border} bg-slate-900/50 shadow-[0_0_80px_rgba(0,0,0,0.5)] group`}>
                    <CustomVideoPlayer src={activeMacroData.video} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 pointer-events-none border-[2px] border-transparent group-hover:${macroColor.border} rounded-[32px] transition-colors duration-700`} />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-slate-500">
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Demonstração da Embaixadora Virtual</span>
                  </div>
                </div>
              )}

              {/* Cabeçalho do Setor */}
              <div className="text-center max-w-3xl mx-auto mb-12 border-b border-slate-900 pb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
                  {activeMacroData?.title}
                </h1>
                <p className="text-slate-400 mt-4 text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto">
                  {activeMacroData?.description}
                </p>
              </div>

              {/* Grid dos Módulos do Canal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                {activeModules.map((mod, i) => {
                  const c = colorMap[mod.color];
                  const isExpanded = expandedCard === mod.id;
                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      layout
                      className={cn(
                        "rounded-[32px] overflow-hidden border bg-[#0a0a0c]/80 backdrop-blur-xl transition-all duration-500 flex flex-col h-fit",
                        isExpanded ? `${c.border} ${c.glow} border-opacity-100 ring-1 ring-orange-500/20` : "border-slate-900 hover:border-white/10"
                      )}
                    >
                      {/* IMAGEM DE TOPO DO CARD */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-950 shrink-0">
                        <Image src={mod.image} alt={mod.highlight} fill className="object-cover p-0 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
                        <div className="absolute top-4 left-4">
                          <Badge className={`${c.badge} px-2.5 py-0.5 text-[8px] font-black tracking-widest uppercase border-none shadow-md`}>
                            {mod.badge}
                          </Badge>
                        </div>
                      </div>

                      {/* CORPO DO CARD */}
                      <div className="p-6 flex flex-col flex-grow justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${c.bg} border ${c.border}`}>
                              <mod.icon className={`h-4.5 w-4.5 ${c.text}`} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${c.text}`}>{mod.title}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                              {mod.highlight}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-light">{mod.subtitle}</p>
                          </div>
                        </div>

                        {/* TOGGLE BUTTON */}
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : mod.id)}
                          className="flex items-center justify-between pt-4 mt-6 border-t border-slate-900/50 w-full text-left cursor-pointer group"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-slate-300 transition-colors">
                            {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                          </span>
                          <div className={`p-2 rounded-full ${c.bg} transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`}>
                            <ArrowRight className={`h-3 w-3 ${c.text}`} />
                          </div>
                        </button>

                        {/* EXPANDABLE SECTION */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-6 mt-6 border-t border-slate-900/50 space-y-6">
                                <p className="text-xs text-slate-300 leading-relaxed font-light">
                                  {mod.description}
                                </p>

                                <div className="space-y-3">
                                  <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Diferenciais:</h4>
                                  <div className="grid grid-cols-1 gap-2.5">
                                    {mod.features.map((feature, idx) => (
                                      <div key={idx} className="flex items-start gap-2">
                                        <div className="p-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                                          <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-[11px] text-slate-300 leading-snug">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="bg-black/40 border border-slate-900/50 p-4 rounded-xl space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Licença:</span>
                                    <span className="text-xs font-bold text-white">{mod.licenca}</span>
                                  </div>
                                  <div className="flex justify-between items-center border-t border-slate-900/20 pt-2">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Suporte:</span>
                                    <span className="text-xs font-bold text-white">{mod.suporte}</span>
                                  </div>
                                  <div className="border-t border-slate-900/20 pt-2 space-y-1">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Retorno (ROI):</span>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-light">{mod.roi}</p>
                                  </div>
                                </div>

                                <Button asChild className={`w-full text-white font-bold uppercase tracking-widest text-[10px] h-10 rounded-xl transition-all hover:scale-102 ${c.btn}`}>
                                  <Link href={getWhatsAppMessage(mod.highlight)} target="_blank">
                                    <MessageSquare className="w-3.5 h-3.5 mr-2" />
                                    Falar com Comercial
                                  </Link>
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>



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
