'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sprout, Users, Landmark, Check, Sparkles, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';


type ProfileType = 'agricultor' | 'cooperativa' | 'gestor_publico';

interface ProfileData {
  id: ProfileType;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  benefits: string[];
  prompts: string[];
}

export default function AgroPage() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);

  const profiles: ProfileData[] = [
    {
      id: 'agricultor',
      title: 'Agricultor',
      subtitle: 'Produtor de Precisão',
      icon: <Sprout className="h-6 w-6 text-emerald-400" />,
      description: 'O Dante Safra cuida da sua propriedade de A a Z. Da semente na terra ao dinheiro no bolso.',
      benefits: [
        '🌱 Qualquer Cultura: Planta milho, soja, fumo, hortaliça ou pastagem? O Dante fala a língua da sua terra. Sem complicação, sem manual difícil. É só perguntar e ele te responde na hora.',
        '🩺 Médico da Lavoura: Tirou uma foto da folha doente? Em segundos o Dante identifica a praga ou doença e já te diz exatamente o que fazer. Sem esperar engenheiro, sem perder tempo e sem perder dinheiro.',
        '🐷 Olho na Criação: Acompanha peso, saúde e consumo de ração do seu rebanho pelo celular. Menos perda, mais resultado. Você cuida melhor sem sair da porteira.'
      ],
      prompts: [
        'Dante, como otimizar a calagem para solo argiloso visando o plantio de soja?',
        'Quais os principais ganchos para controle biológico da ferrugem asiática?',
        'Como configurar a telemetria off-line para monitorar umidade do solo?'
      ]
    },
    {
      id: 'cooperativa',
      title: 'Cooperativa',
      subtitle: 'Sinergia & Escala',
      icon: <Users className="h-6 w-6 text-emerald-400" />,
      description: 'Garantia de safra cheia e padrão de excelência para os seus associados.',
      benefits: [
        '🌾 Grãos de Primeira: Seu associado chega no recebimento com produto de qualidade? É porque o Dante Safra acompanhou a lavoura do começo ao fim. Menos perda, menos desconto, mais dinheiro para o produtor e para a cooperativa.',
        '🛡️ Escudo Contra Pragas: Uma praga não avisa hora de chegar. Mas quando chega, o Dante já sabe. Monitoramento contínuo que protege as lavouras dos seus associados antes que o estrago vire prejuízo grande.',
        '📈 Fomento Inteligente: Chega de planejar insumos e crédito no achismo. Com dados reais de cada produtor, a cooperativa financia com segurança, compra melhor e entrega mais resultado para quem está na base.'
      ],
      prompts: [
        'Dante, como gerar um modelo de previsão de safra consolidado para 50 cooperados?',
        'Quais métricas de ESG agrícolas são cruciais para auditoria externa da cooperativa?',
        'Como o Dante Safra pode otimizar a janela de colheita e logística de recebimento?'
      ]
    },
    {
      id: 'gestor_publico',
      title: 'Município (Prefeituras)',
      subtitle: 'Vocação & GovTech',
      icon: <Landmark className="h-6 w-6 text-emerald-400" />,
      description: 'Transforme sua cidade no próximo Polo de Tecnologia Agrícola e orgulhe a sua comunidade.',
      benefits: [
        '🏆 Município Destaque: Imagina o seu município na televisão como referência em tecnologia no campo? Com o Dante Safra, sua cidade vira exemplo. Um projeto pioneiro que coloca o nome da prefeitura no mapa e orgulha cada morador.',
        '🎓 Escola do Futuro: O jovem que aprende a usar inteligência artificial na roça não precisa ir embora pra cidade. Capacite os alunos da rede pública com a profissão que o agronegócio está pedindo. Família unida, campo forte.',
        '💰 Dinheiro que Fica Aqui: Produtor que produz mais emite mais nota, paga mais imposto e movimenta mais o comércio local. Sem aumentar carga tributária, a prefeitura vê a arrecadação crescer junto com a lavoura.'
      ],
      prompts: [
        'Dante, como estruturar um programa municipal de calagem eficiente e auditável?',
        'Quais culturas de inverno têm maior potencial econômico para pequenas propriedades?',
        'Gerar um relatório de vocação regional focando em transição para agricultura orgânica.'
      ]
    }
  ];



  const activeProfileData = profiles.find(p => p.id === selectedProfile);

  return (
    <SovereignShowcase moduleName="Dante Safra" imagePath="/Nexus Empresas/Dante safra axis.png">
      <div className="min-h-screen text-white flex flex-col pt-14 pb-12 relative">
        {/* Background image */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Agro/agro-bg.png')" }}
        />
        {/* Dark overlay para legibilidade */}
        <div className="fixed inset-0 z-0 bg-[#020617]/85 backdrop-blur-[2px]" />
        {/* Conteúdo acima do fundo */}
        <div className="relative z-10 flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-emerald-800/30">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 hover:text-emerald-400 transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-emerald-300 font-headline">
              Portal Dante Safra — Agro
            </h1>
            <p className="text-sm text-gray-400 md:text-base">
              Inteligência de precisão, telemetria e expansão tática para o agronegócio soberano.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-10">
          
          {/* Section 1: Three Target Profiles */}
          <div className="space-y-6">
              <h2 className="text-xl font-bold font-headline uppercase tracking-widest text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="h-5 w-5 animate-pulse" /> Matriz de Engajamento e Abordagem Tática
              </h2>
              <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
                Selecione o perfil do seu interlocutor para estruturar pitches de alto impacto, alinhar as dores do campo à inteligência soberana e acionar os ganchos estratégicos do Dante Safra.
              </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profiles.map((profile) => {
                const isSelected = selectedProfile === profile.id;
                const cardImages: Record<string, string> = {
                  agricultor: '/Agro/Dante safra vídeo.png',
                  cooperativa: '/Agro/Cooperativismo.png',
                  gestor_publico: '/Agro/Prefeito-na-lavoura.png',
                };
                const hasImage = !!cardImages[profile.id];
                return (
                  <div
                    key={profile.id}
                    onClick={() => setSelectedProfile(isSelected ? null : profile.id)}
                    className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group backdrop-blur-xl overflow-hidden bg-slate-950/20 ${
                      isSelected
                        ? 'border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.28)] bg-emerald-950/10'
                        : 'border-emerald-900/30 hover:border-emerald-700/50 hover:-translate-y-1 hover:shadow-[0_0_16px_rgba(16,185,129,0.12)]'
                    }`}
                  >
                    {/* Top Image area */}
                    {hasImage ? (
                      <div className="relative w-full aspect-video overflow-hidden border-b border-emerald-900/20 shrink-0 bg-slate-950/40 flex items-center justify-center">
                        <img
                          src={cardImages[profile.id]}
                          alt={profile.title}
                          className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                            profile.id === 'gestor_publico' ? 'object-contain p-2' : 'object-cover object-top'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                        {isSelected && (
                          <span className="absolute top-3 right-3 p-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-900/20 border-b border-emerald-900/20 flex justify-between items-start shrink-0">
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                          {profile.icon}
                        </div>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    )}

                    {/* Isolated text box below */}
                    <div className="p-6 flex flex-col flex-1 justify-between bg-slate-950/40">
                      <div>
                        {hasImage && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit mb-4">
                            {profile.icon}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-white font-headline tracking-tight group-hover:text-emerald-300 transition-colors">
                          {profile.title}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 -mt-0.5">
                          {profile.subtitle}
                        </p>
                        <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                          {profile.description}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-emerald-950/20 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        <span>{isSelected ? 'Ocultar' : 'Ver Abordagem'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Selected Profile Dashboard Widget */}
          {selectedProfile && activeProfileData && (
            <div className="bg-slate-900/30 border border-emerald-800/20 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl animate-fade-in-down">
              <div className="space-y-8">
                <div>
                  <h4 className="text-2xl font-bold font-headline uppercase tracking-wider text-emerald-300 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-emerald-400" />
                    Diretrizes de Impacto & Pilares de Valor
                  </h4>
                  <p className="text-sm text-gray-300 mt-2 ml-9 max-w-2xl leading-relaxed">
                    Tecnologia soberana de precisão e inteligência prática desenhadas sob medida para otimizar os resultados e a produtividade no agronegócio moderno.
                  </p>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {activeProfileData.benefits.map((benefit, idx) => {
                    const pilarImages: Record<string, string[]> = {
                      agricultor: ['/Agro/Milho.jpg', '/Agro/Soja.jpg', '/Agro/Criação.jpg'],
                      cooperativa: ['/Agro/Milho-caminhao.jpg', '/Agro/Pragas de lavoura.webp', '/Agro/Fomento.png'],
                      gestor_publico: ['/Agro/Municipio-destaque.png', '/Agro/Fim-exodo-rural.png', '/Agro/PIB-municipio.png'],
                    };
                    const images = pilarImages[selectedProfile ?? ''];
                    const hasImg = !!images?.[idx];
                    return (
                      <li
                        key={idx}
                        className="flex flex-col rounded-2xl overflow-hidden border border-emerald-900/30 hover:border-emerald-600/60 hover:shadow-[0_0_16px_rgba(16,185,129,0.12)] transition-all duration-300 group bg-slate-950/25 backdrop-blur-xl"
                      >
                        {/* Top Image area */}
                        {hasImg ? (
                          <div className="relative w-full aspect-video overflow-hidden border-b border-emerald-900/20 shrink-0 bg-slate-950/40 flex items-center justify-center">
                            <img
                              src={images[idx]}
                              alt={benefit.split(':')[0]}
                              className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                                selectedProfile === 'gestor_publico' ? 'object-contain p-2' : 'object-cover'
                              }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                          </div>
                        ) : (
                          <div className="p-6 bg-slate-900/20 border-b border-emerald-900/20 shrink-0">
                            <span className="text-4xl">{benefit.split(' ')[0]}</span>
                          </div>
                        )}

                        {/* Isolated text box below */}
                        <div className="p-6 flex flex-col flex-1 justify-between bg-slate-950/40">
                          <div className="space-y-3 text-left">
                            <p className="text-xl font-bold text-white leading-snug">
                              {benefit.split(':')[0].replace(/^\S+\s/, '')}
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {benefit.split(':')[1]?.trim()}
                            </p>
                          </div>
                          {/* Pilar indicator at footer */}
                          <div className="mt-6 pt-4 border-t border-emerald-950/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            Pilar {idx + 1} — Dante Safra
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

        </div>{/* fim flex-1 max-w-6xl */}
        </div>{/* fim z-10 */}
      </div>{/* fim min-h-screen */}

    </SovereignShowcase>
  );
}
