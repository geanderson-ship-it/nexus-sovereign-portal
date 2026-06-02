'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sprout, Users, Landmark, Check, Copy, Sparkles, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import DanteSafraChat from '@/components/dante-safra-chat';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);

  const profiles: ProfileData[] = [
    {
      id: 'agricultor',
      title: 'Agricultor',
      subtitle: 'Produtor de Precisão',
      icon: <Sprout className="h-6 w-6 text-emerald-400" />,
      description: 'Cérebro tático para o produtor individual. Análises de solo de alta precisão, manejo fitossanitário preventivo e telemetria offline direta da lavoura.',
      benefits: [
        'Recomendações customizadas por cultura e solo',
        'Protocolo de manejo e controle biológico de pragas',
        'Previsões climáticas localizadas e alertas agrícolas'
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
      description: 'Centralização estratégica para o ecossistema corporativo. Agregação de telemetria de múltiplos produtores, relatórios agroclimáticos regionais e previsão de safra consolidada.',
      benefits: [
        'Painel unificado com telemetria agregada dos cooperados',
        'Previsões de rendimento e quebra de safra regionalizadas',
        'Relatórios de conformidade ESG e boas práticas agrícolas'
      ],
      prompts: [
        'Dante, como gerar um modelo de previsão de safra consolidado para 50 cooperados?',
        'Quais métricas de ESG agrícolas são cruciais para auditoria externa da cooperativa?',
        'Como o Dante Safra pode otimizar a janela de colheita e logística de recebimento?'
      ]
    },
    {
      id: 'gestor_publico',
      title: 'Gestor Público',
      subtitle: 'Vocação & GovTech',
      icon: <Landmark className="h-6 w-6 text-emerald-400" />,
      description: 'Inteligência territorial para governos municipais. Mapeamento da vocação regional agropecuária, programas de fomento ao microprodutor e relatórios socioambientais.',
      benefits: [
        'Auditoria e direcionamento de programas de insumos municipais',
        'Mapeamento georreferenciado da produtividade por microrregião',
        'Cálculo de retorno econômico sobre investimentos agrícolas locais'
      ],
      prompts: [
        'Dante, como estruturar um programa municipal de calagem eficiente e auditável?',
        'Quais culturas de inverno têm maior potencial econômico para pequenas propriedades?',
        'Gerar um relatório de vocação regional focando em transição para agricultura orgânica.'
      ]
    }
  ];

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    toast({
      title: 'Prompt Copiado!',
      description: 'O prompt foi copiado para sua área de transferência. Cole no terminal do Dante abaixo!',
      variant: 'default',
    });
  };

  const activeProfileData = profiles.find(p => p.id === selectedProfile);

  return (
    <SovereignShowcase moduleName="Dante Safra" imagePath="/Nexus Empresas/Dante safra axis.png">
      <div className="min-h-screen bg-[#020617] text-white flex flex-col pt-14 pb-12">
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
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold font-headline uppercase tracking-widest text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="h-5 w-5 animate-pulse" /> Selecione o Perfil de Atuação
              </h2>
              <p className="text-xs text-gray-400 mt-1 max-w-xl">
                Escolha uma das vertentes para desbloquear diretrizes, pilares estratégicos e ganchos de abordagem tática recomendados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profiles.map((profile) => {
                const isSelected = selectedProfile === profile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => setSelectedProfile(isSelected ? null : profile.id)}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group backdrop-blur-xl ${
                      isSelected
                        ? 'bg-emerald-950/20 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                        : 'bg-slate-900/40 border-emerald-900/30 hover:border-emerald-700/50 hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    }`}
                  >
                    <div>
                      {/* Badge / Status */}
                      <div className="flex justify-between items-start">
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                          {profile.icon}
                        </div>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>

                      {/* Header Titles */}
                      <h3 className="text-lg font-bold text-white mt-4 font-headline tracking-tight group-hover:text-emerald-300 transition-colors">
                        {profile.title}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 -mt-0.5">
                        {profile.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                        {profile.description}
                      </p>
                    </div>

                    {/* Expand/Read indicator */}
                    <div className="mt-6 pt-4 border-t border-emerald-950/30 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      <span>{isSelected ? 'Ocultar Detalhes' : 'Ver Abordagem'}</span>
                      <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Selected Profile Dashboard Widget */}
          {selectedProfile && activeProfileData && (
            <div className="bg-slate-900/30 border border-emerald-800/20 backdrop-blur-xl rounded-[32px] p-6 md:p-8 shadow-2xl animate-fade-in-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Benefits / Metrics */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold font-headline uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    Métricas e Pilares Estratégicos
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Benefícios reais ao implantar os fluxos customizados do Dante Safra para a categoria **{activeProfileData.title}**:
                  </p>
                  <ul className="space-y-3 mt-4">
                    {activeProfileData.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-gray-200">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold font-headline uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    Consultas Recomendadas (Prompts)
                  </h4>
                  <p className="text-xs text-gray-400">
                    Clique em um card de prompt profissional abaixo para copiá-lo e colá-lo direto no terminal de chat:
                  </p>
                  <div className="flex flex-col gap-3 mt-4">
                    {activeProfileData.prompts.map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopyPrompt(promptText)}
                        className="w-full text-left p-3 rounded-xl bg-black/40 border border-emerald-900/30 hover:border-emerald-500/50 hover:bg-emerald-950/10 transition-all duration-200 flex items-center justify-between group/prompt"
                      >
                        <span className="text-[11px] text-gray-300 font-medium leading-relaxed max-w-[90%] group-hover/prompt:text-white transition-colors">
                          "{promptText}"
                        </span>
                        <Copy className="h-3.5 w-3.5 text-emerald-500/50 group-hover/prompt:text-emerald-400 shrink-0 opacity-0 group-hover/prompt:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Section 3: Interactive Chat Terminal */}
          <div className="flex flex-col items-center justify-center gap-6 mt-4">
            <div className="text-center max-w-xl">
              <h2 className="text-xl font-bold font-headline uppercase tracking-wider text-emerald-300">
                Terminal de Comando Inteligente
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Utilize o Terminal Dante Safra integrado abaixo para processar análises, otimizações e telemetria offline.
              </p>
            </div>
            
            <DanteSafraChat />
            
            <div className="w-full max-w-3xl">
              <LegalSafeguard module="DANTE SAFRA" protocol="NX-SAFRA-01" />
            </div>
          </div>

        </div>
      </div>
    </SovereignShowcase>
  );
}
