'use client';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Shield, Sparkles, Zap, Sun, Factory, Activity, ChevronRight, Check, Box } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WhiteLabelHeader } from '@/components/nexus/white-label-header';

// Tipagem dos Perfis
interface ProfileData {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  benefits: string[];
  prompts: string[];
  image?: string;
  pricing?: {
    value: string;
    subtext: string;
    cta: string;
    action: 'pix' | 'consultant';
  };
}

function ProfileDetails({ profile, onOpenPayment }: { profile: ProfileData; onOpenPayment?: () => void }) {
  return (
    <div className="bg-slate-900/30 border border-amber-800/20 backdrop-blur-xl rounded-2xl md:rounded-[32px] p-4 sm:p-8 md:p-12 shadow-2xl animate-fade-in-down">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h4 className="text-lg sm:text-2xl font-bold font-headline uppercase tracking-wider text-amber-300 flex items-center gap-3">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400 shrink-0" />
            Diretrizes de Impacto & Pilares de Valor
          </h4>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {profile.benefits.map((benefit, idx) => {
              const [title, text] = benefit.split(': ');
              return (
                <div key={idx} className="bg-zinc-950/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 hover:border-amber-500/20 transition-colors">
                  <h5 className="font-bold text-amber-400 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Check className="h-4 w-4 text-amber-500" />
                    {title}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-white/10">
          <h4 className="text-base sm:text-lg font-bold font-headline uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            Comandos Táticos Frequentes
          </h4>
          <div className="flex flex-col gap-2 sm:gap-3">
            {profile.prompts.map((prompt, idx) => (
              <div key={idx} className="bg-zinc-950/40 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/5 flex items-start gap-3">
                <ChevronRight className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-slate-300 italic">"{prompt}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnergiaPage() {
  const profiles: ProfileData[] = [
    {
      title: 'Usinas Renováveis',
      subtitle: 'Fazendas Solares & Parques Eólicos',
      icon: <Sun className="h-6 w-6 text-amber-400" />,
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800',
      description: 'Manutenção preditiva via visão computacional e balanceamento neural de baterias para otimização de carga.',
      benefits: [
        'Inspeção por Visão Computacional: Uma micro-fissura em um painel solar não é vista a olho nu. O Helios analisa imagens de drones em segundos e aponta exatamente qual módulo está comprometendo a geração.',
        'Sincronia Climática Extrema: Baterias são caras. O Helios prevê a cobertura de nuvens do dia seguinte com precisão matemática para otimizar o ciclo de recarga e descarga das fazendas solares.',
        'Manutenção Preditiva Eólica: Sensores de vibração integrados à IA detectam anomalias nas pás eólicas meses antes da quebra, evitando paradas não programadas e prejuízos milionários.'
      ],
      prompts: [
        'Helios, cruzar dados térmicos do último voo com o mapa de micro-inversores para identificar pontos quentes.',
        'Quais as projeções de geração fotovoltaica para amanhã considerando a frente fria em aproximação?',
        'Avaliar padrão de vibração da Turbina 04. Há indícios de fadiga de material?'
      ],
      pricing: {
        value: 'Dimensionamento sob Medida',
        subtext: 'Licenciamento por MW instalado. Integração direta com sistemas SCADA e Drones.',
        cta: 'Acionar Engenharia B2B',
        action: 'consultant'
      }
    },
    {
      title: 'Mercado Livre',
      subtitle: 'Trading de Energia & Indústria',
      icon: <Activity className="h-6 w-6 text-amber-400" />,
      image: '/images/parque-eolico.webp',
      description: 'Previsão neural do PLD (Preço de Liquidação das Diferenças) para maximizar o lucro no Mercado Livre de Energia.',
      benefits: [
        'Previsão de PLD: Redes neurais avançadas analisam o nível dos reservatórios e previsões de chuva para antecipar o sobe-e-desce do preço da energia, garantindo compras na baixa e vendas na alta.',
        'Otimização de Consumo Industrial: Uma grande fábrica não pode desligar as máquinas. Mas o Helios diz exatamente qual horário é estatisticamente mais barato para acionar os fornos elétricos.',
        'Blindagem de Contratos: Análise automatizada de PPA (Power Purchase Agreements) para identificar vulnerabilidades de preço e risco cambial em milissegundos.'
      ],
      prompts: [
        'Helios, simular cenário de PLD para os próximos 6 meses considerando o nível crítico da bacia do Paraná.',
        'Qual o horário ótimo de despacho industrial para minimizar o custo da energia horária amanhã?',
        'Analisar exposição de risco no contrato de energia incentivada fechado com a comercializadora X.'
      ],
      pricing: {
        value: 'Sob Consulta Executiva',
        subtext: 'Dashboard executivo + API de consulta de PLD neural em tempo real.',
        cta: 'Acionar Comercial',
        action: 'consultant'
      }
    },
    {
      title: 'Concessionárias',
      subtitle: 'Prefeituras & Distribuidoras',
      icon: <Factory className="h-6 w-6 text-amber-400" />,
      image: '/images/torres-transmissao.jpg',
      description: 'Otimização inteligente da rede de distribuição para evitar apagões e gerenciar Smart Grids.',
      benefits: [
        'Zero Apagões por Sobrecarga: Em dias de calor extremo, o ar-condicionado liga na cidade inteira. O Helios prevê esses picos e gerencia a distribuição da rede antes do transformador desarmar.',
        'Eficiência no Despacho: Distribuição inteligente da carga entre subestações para minimizar a perda técnica e proteger a infraestrutura crítica do município.',
        'Detecção de Fraudes: A IA varre o banco de dados de consumo da cidade inteira cruzando horários e tarifas para encontrar desvios de energia (gatos) com precisão cirúrgica.'
      ],
      prompts: [
        'Helios, mapear as 3 subestações com maior risco de sobrecarga térmica nesta sexta-feira.',
        'Gerar relatório de varredura de fraude na Zona Norte cruzando perfil de consumo e faixa de renda.',
        'Simular impacto na rede caso o bairro industrial A aumente a carga em 15%.'
      ],
      pricing: {
        value: 'Exclusivo para Board',
        subtext: 'Arquitetura On-Premise. Requer aprovação da Nexus para implantação em infraestrutura crítica.',
        cta: 'Solicitar Audiência ao Board',
        action: 'consultant'
      }
    }
  ];

  const [activeProfile, setActiveProfile] = useState<number | null>(null);

  const generateWhatsAppLink = (profileTitle: string) => {
    const message = `[NEXUS HELIOS] Olá. Gostaria de entender mais sobre a implantação da Inteligência Artificial (Helios) no perfil: ${profileTitle}.`;
    return `https://wa.me/5551999799582?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-amber-500/30 relative">
      {/* BACKGROUND ENERGY CUSTOMIZADO */}
      <div className="fixed inset-0 z-0 bg-zinc-950 pointer-events-none" />
      
      {/* GLOBO CIBERNÉTICO (Conexões Tecnológicas) */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.35] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920')`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)'
        }}
      />

      <div 
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.3), transparent 70%), radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.1), transparent 50%)"
        }}
      />
      
      {/* GRADE NEON EFEITO DE ENERGIA */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* NOVA HERO SECTION - HELENA (HELIOS) */}
        <section className="flex flex-col items-center text-center gap-4 mt-4 lg:mt-8 w-full max-w-5xl mx-auto mb-12">
          
          <div className="w-full rounded-[2rem] overflow-hidden border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-black/50 relative mb-8">
            <CustomVideoPlayer 
              src="/Nexus Energia/Helena - energia.mp4" 
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" /> Nexus Helios
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-black text-white tracking-tight">
            Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Energia</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-300 font-light italic tracking-wide max-w-3xl mt-4">
            "Olá, eu sou a Helena, a inteligência central do Nexus Energia."
          </p>
          
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed max-w-3xl mt-2">
            Fui desenhada para gerenciar redes elétricas complexas, antecipar o mercado livre de energia e monitorar ativos críticos através de visão computacional. Minha missão é zerar desperdícios, proteger usinas contra falhas mecânicas antes que elas ocorram e otimizar cada watt de energia em sua planta. 
            <br /><br />
            <strong className="text-amber-400">O que vamos revolucionar hoje?</strong>
          </p>
        </section>


        {/* EIXO DE VALOR (PERFIS) */}
        <section className="flex flex-col gap-12 mt-16">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <span className="text-amber-500 text-xs font-black uppercase tracking-[0.4em]">Soluções por Perfil Operacional</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">O Fim da Margem de Erro</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {profiles.map((profile, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className={`group relative rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col min-h-[400px] cursor-pointer
                  ${activeProfile === idx 
                    ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_40px_rgba(245,158,11,0.15)] scale-[1.02]' 
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-amber-500/50 hover:bg-zinc-900/80'}
                `}
                onClick={() => setActiveProfile(activeProfile === idx ? null : idx)}
              >
                {activeProfile === idx && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                )}

                {/* IMAGEM DO CARD */}
                {profile.image && (
                  <div className="w-full h-48 sm:h-56 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent z-10" />
                    <div className="absolute inset-0 bg-amber-500/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                    <img 
                      src={profile.image} 
                      alt={profile.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full p-8 -mt-10">
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-amber-500 text-xs font-black uppercase tracking-[0.2em] bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">{profile.subtitle}</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2">{profile.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{profile.description}</p>
                  </div>

                  <div className="relative z-10 mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-amber-400 group-hover:text-amber-300 transition-colors">
                      {activeProfile === idx ? 'Fechar Detalhes' : 'Ver Matriz de Força'}
                      <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${activeProfile === idx ? 'rotate-90' : 'group-hover:translate-x-2'}`} />
                    </div>
                    
                    {activeProfile !== idx && profile.pricing && (
                      <div className="flex flex-col gap-1 mt-2 p-3 rounded-lg bg-zinc-950/50 border border-white/5">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Investimento Estimado</span>
                        <span className="text-sm font-black text-white">{profile.pricing.value}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* DETALHES EXPANDIDOS */}
          <div className="w-full">
            {activeProfile !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full overflow-hidden"
              >
                <div className="pt-8">
                  <ProfileDetails profile={profiles[activeProfile]} />
                  
                  {/* BIG CTA PARA O PERFIL SELECIONADO */}
                  <div className="mt-8">
                    {profiles[activeProfile].pricing?.action === 'consultant' && (
                      <Link href={generateWhatsAppLink(profiles[activeProfile].title)} target="_blank" className="w-full block">
                        <div className="w-full py-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-center transition-all group flex flex-col md:flex-row items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                          <Activity className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform hidden md:block" />
                          <span className="text-amber-300 font-black uppercase tracking-[0.2em] text-xs md:text-sm group-hover:text-white">
                            {profiles[activeProfile].pricing.cta} ({profiles[activeProfile].title})
                          </span>
                          <ChevronRight className="h-5 w-5 text-amber-400 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* INFO SECRETA / MÓDULO SOBERANO */}
        <section className="mt-16 pt-16 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 rounded-[40px] bg-gradient-to-r from-zinc-900/80 to-zinc-950 border border-amber-500/20 shadow-[0_0_80px_rgba(245,158,11,0.05)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            
            <div className="flex flex-col gap-2 relative z-10 w-full md:w-5/12 mb-8 md:mb-0">
              <span className="text-amber-500 text-xs font-black uppercase tracking-[0.4em]">Arquitetura de Segurança</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">Soberania<br/>de Dados</h2>
            </div>

            <div className="hidden md:block w-px h-24 bg-white/10 relative z-10 mx-8" />

            <div className="flex flex-col relative z-10 w-full md:w-6/12 gap-4">
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-light">
                Sabemos que concessionárias de energia e grandes usinas gerenciam infraestrutura crítica nacional. O <strong className="text-white">Helios</strong> foi desenhado para rodar **100% On-Premise** (dentro dos seus servidores isolados).
              </p>
              <ul className="flex flex-col gap-2 mt-2">
                <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                  <div className="h-1 w-1 rounded-full bg-amber-500" /> Sem envio de dados para a nuvem pública
                </li>
                <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                  <div className="h-1 w-1 rounded-full bg-amber-500" /> Compatibilidade com firewalls OT e sistemas SCADA
                </li>
                <li className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                  <div className="h-1 w-1 rounded-full bg-amber-500" /> Redes neurais confinadas e isoladas (Air-gapped)
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
