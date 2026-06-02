'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sprout, Users, Landmark, Check, Copy, Sparkles, Shield, ChevronRight, Volume2, Camera, Database, WifiOff } from 'lucide-react';
import Link from 'next/link';
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

          {/* Section 3: Simulated Chat Terminal (No direct interaction) */}
          <div className="flex flex-col items-center justify-center gap-6 mt-4">
            <div className="text-center max-w-xl">
              <h2 className="text-xl font-bold font-headline uppercase tracking-wider text-emerald-300">
                Simulador do Terminal Dante Safra
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Conheça a interface tática do Dante Safra, desenhada para uma interação ágil e direta no campo.
              </p>
            </div>
            
            {/* Mock Chat Window */}
            <div className="w-full max-w-3xl bg-slate-900/60 border border-emerald-800/40 rounded-[32px] overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col text-white">
                {/* Simulated Header */}
                <div className="p-4 border-b border-emerald-800/30 flex items-center justify-between bg-slate-950/40">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border border-emerald-500/50 bg-emerald-950 flex items-center justify-center overflow-hidden">
                        <Sprout className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-emerald-300 font-headline">Dante Safra</h3>
                      <p className="text-[10px] text-gray-400">Inteligência Tática Agrícola Activa</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    <WifiOff className="h-3 w-3" />
                    <span>Telemetria Off-line</span>
                  </div>
                </div>

                {/* Simulated Conversation Body */}
                <div className="p-6 space-y-6 max-h-[420px] overflow-y-auto custom-scrollbar text-xs md:text-sm">
                  {/* User Input Bubble */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="max-w-[85%] bg-emerald-800/80 rounded-2xl rounded-tr-none p-4 text-white space-y-3 shadow-lg">
                      <div className="flex items-center gap-3 bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/30">
                        <Volume2 className="h-4 w-4 text-emerald-300" />
                        <div className="flex-1 h-1.5 bg-emerald-700/50 rounded-full overflow-hidden relative min-w-[120px]">
                          <div className="absolute top-0 left-0 w-2/3 h-full bg-emerald-300 rounded-full" />
                        </div>
                        <span className="text-[10px] text-emerald-200">0:08</span>
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-emerald-700 bg-slate-950 aspect-video max-w-sm">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 flex items-end p-3">
                          <span className="text-[9px] uppercase tracking-wider font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">milho_folha_alerta.png</span>
                        </div>
                        <img 
                          src="/Nexus Empresas/Dante safra axis.png" 
                          alt="Folha com praga" 
                          className="object-cover w-full h-full opacity-60" 
                        />
                      </div>
                      <p className="leading-relaxed text-xs">
                        "Dante, comecei a ver essa lagarta em algumas folhas de milho e a análise de solo da área deu pH 5.2. Qual a recomendação com sinal fraco no talhão?"
                      </p>
                    </div>
                  </div>

                  {/* Dante Output Bubble */}
                  <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Sprout className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="max-w-[85%] bg-slate-800/80 border border-slate-700/40 rounded-2xl rounded-tl-none p-4 text-slate-200 space-y-4 shadow-lg">
                      <div className="border-b border-slate-700/50 pb-2 flex items-center justify-between">
                        <span className="font-bold text-emerald-300 font-headline">Laudo Agronômico Sincronizado</span>
                        <span className="text-[9px] text-slate-400 font-mono">ID: NX-4011</span>
                      </div>
                      <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          1. Identificação de Pragas e Ação
                        </p>
                        <p className="pl-3">
                          A imagem confirma a incidência inicial de <strong className="text-emerald-300">Spodoptera frugiperda</strong> (Lagarta-do-cartucho). Nível de alerta: <span className="text-amber-400 font-bold">Médio</span>.
                          <br />• <strong>Manejo:</strong> Iniciar pulverização biológica com calda de <em>Bacillus thuringiensis</em> para controle seletivo.
                        </p>

                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          2. Correção de Solo (pH 5.2)
                        </p>
                        <p className="pl-3">
                          A acidez elevada limita a absorção de nutrientes.
                          <br />• <strong>Recomendação:</strong> Incorporar <strong className="text-emerald-300">2.4 toneladas/ha</strong> de calcário dolomítico (PRNT 85%) na próxima janela de preparo.
                        </p>

                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          3. Facilidade e Sincronização
                        </p>
                        <p className="pl-3">
                          • Diagnóstico técnico concluído sem necessidade de internet.
                          <br />• Laudo e receitas salvos em cache local. Prontos para consulta no interior da fazenda.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Input Footer */}
                <div className="p-4 border-t border-emerald-800/30 bg-slate-950/40 flex items-center gap-2 text-gray-500 text-xs">
                  <span className="text-emerald-500/80 font-bold uppercase tracking-widest text-[9px] mx-auto">
                    Interação Simples e Relatório Completo Através de Áudio e Foto
                  </span>
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-3xl">
              <LegalSafeguard module="DANTE SAFRA" protocol="NX-SAFRA-01" />
            </div>
          </div>

        </div>
      </div>
    </SovereignShowcase>
  );
}
