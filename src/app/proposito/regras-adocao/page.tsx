'use client';

import React from 'react';


import { ShieldCheck, Scale, HeartHandshake, Wifi, Activity, Lock, Users, ArrowLeft, Video, Coins } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RegrasAdocaoPage() {
  const regras = [
    {
      icon: <Scale className="w-6 h-6 text-indigo-400" />,
      title: "Natureza da Instituição e Subsídios",
      desc: "Instituições Públicas ou Filantrópicas recebem 100% de subsídio. Instituições Privadas que comprovarem cumprimento rigoroso das regras também são elegíveis e recebem 50% de desconto na tecnologia. A natureza deve ser declarada sob pena de falsidade ideológica."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Ficha Limpa Absoluta (Compliance)",
      desc: "A instituição não pode ter nenhuma pendência judicial, trabalhista ou criminal (interna ou externa). A reputação precisa ser inabalável para carregar o selo Nexus."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-400" />,
      title: "Excelência no Cuidado Humano",
      desc: "A Aurora e o Ravi vêm para somar ao afeto, nunca para suprir a negligência. Os residentes já devem ser tratados com extremo respeito, higiene e carinho pelas equipes locais."
    },
    {
      icon: <Activity className="w-6 h-6 text-amber-400" />,
      title: "Auditoria de Consumo e Mau Uso",
      desc: "Nossos servidores monitoram o consumo das interações. Elevações drásticas ou quedas indicam mau uso. O horário de funcionamento (ex: 10h às 14h) é parametrizado para controle de custos da Nexus. Qualquer alteração de rotina deve ser informada imediatamente."
    },
    {
      icon: <Lock className="w-6 h-6 text-blue-400" />,
      title: "Soberania e Privacidade",
      desc: "Um termo de sigilo rigoroso será assinado. As conversas com os residentes ou crianças serão protegidas e não serão utilizadas para mineração de dados comerciais."
    },
    {
      icon: <Users className="w-6 h-6 text-violet-400" />,
      title: "Compromisso de Não-Substituição",
      desc: "Nossos avatares fornecem companhia e alento mental, mas a direção deve concordar que eles jamais serão usados como justificativa para diminuir o quadro de enfermeiros ou cuidadores."
    },
    {
      icon: <Wifi className="w-6 h-6 text-sky-400" />,
      title: "Infraestrutura Mínima",
      desc: "A instituição precisará garantir apenas uma conexão de internet estável no ambiente de interação para que os avatares operem em tempo real e sem interrupções."
    },
    {
      icon: <Video className="w-6 h-6 text-fuchsia-400" />,
      title: "Registro de Impacto Mensal",
      desc: "A instituição é obrigada a enviar, no decorrer de cada mês, um vídeo curto (30 a 60 segundos) mostrando os usuários interagindo com a Aurora ou o Ravi. O registro deve capturar o cenário, o usuário e a tela da Aurora ou do Ravi. Esse material é vital para nossa auditoria, material de divulgação e prestação de contas aos padrinhos e parceiros."
    }
  ];

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 selection:bg-rose-500/30 relative">
      {/* BACKGROUND DA AURORA */}
      <div 
        className="fixed inset-0 z-0 opacity-50 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/bg-aurora-v2.png")' }}
      />
      {/* OVERLAY PARA GARANTIR LEITURA */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#05080f]/60 via-[#05080f]/10 to-[#05080f]/90 pointer-events-none" />

      <div className="relative z-10">

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <Link href="/proposito" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Social
          </Link>

          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
              <ShieldCheck className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-white mb-4">
              Critérios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-blue-500">Elegibilidade</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Para proteger a integridade do "Projeto Inteligência com Alma", estabelecemos diretrizes inegociáveis. Nossa tecnologia é de ponta e nosso investimento é alto; exigimos o mesmo nível de comprometimento dos parceiros.
            </p>
          </div>

          <div className="space-y-4">
            {regras.map((regra, index) => (
              <div key={index} className="bg-[#0b101a] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-slate-600 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center border border-slate-700">
                    {regra.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{regra.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{regra.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#0b101a] border-2 border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                  <Coins className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-left">Estrutura de Custos para a Instituição</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0f141f] border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                    <h4 className="text-emerald-400 font-bold mb-1 uppercase tracking-wide text-sm relative z-10">Públicas e Filantrópicas</h4>
                    <p className="text-3xl font-black text-white mb-2 relative z-10">R$ 0,00</p>
                    <p className="text-slate-400 text-sm relative z-10">100% subsidiado pela Rede de Parceiros da Nexus. Sem custos vitalícios de infraestrutura ou software.</p>
                  </div>
                  <div className="bg-[#0f141f] border border-blue-500/20 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                    <h4 className="text-blue-400 font-bold mb-1 uppercase tracking-wide text-sm relative z-10">Instituições Privadas</h4>
                    <p className="text-3xl font-black text-white mb-2 relative z-10">~ R$ 1.000 <span className="text-sm font-medium text-slate-500">/mês</span></p>
                    <p className="text-slate-400 text-sm relative z-10">Elegíveis a 50% de desconto. Pagam apenas o custo base da infraestrutura tecnológica de streaming ao vivo da Aurora ou do Ravi.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center bg-gradient-to-br from-[#0f141f] to-[#080b10] border border-slate-800 rounded-3xl p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-bl-full blur-[80px]" />
             <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Sua instituição cumpre os requisitos?</h2>
             <p className="text-slate-400 mb-8 relative z-10 max-w-xl mx-auto">
               Se a sua organização atende a todos os critérios e deseja receber a nossa tecnologia para levar alento aos acolhidos, o próximo passo é oficializar o interesse.
             </p>
             <Link href="/proposito/inscricao-instituicao" className="relative z-10">
               <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 h-12 rounded-full text-md shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                 Iniciar Processo de Inscrição
               </Button>
             </Link>
          </div>

        </div>
      </main>
      </div>
    </div>
  );
}
