'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Leaf, 
  GraduationCap, 
  HeartPulse, 
  Server, 
  ArrowRight,
  Lock,
  Building,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useUser } from '@/auth';
import { useRouter } from 'next/navigation';
import { NexusIntelligenceLogo } from '@/components/nexus-intelligence-logo';
import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function CidadesDoFuturoProposal() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        // Redireciona para o login se não houver usuário autenticado
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-primary/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Verificando Credenciais</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-900/50 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(2,6,23,1)_80%)]" />
      </div>

      {/* Floating Admin Badge */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-full backdrop-blur-md shadow-2xl">
        <Lock className="w-4 h-4 text-emerald-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Modo Administrador</span>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-20 lg:py-32 max-w-6xl">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8 mb-24"
        >
          <div className="flex flex-col items-center mb-24 w-full">
            {/* A mãe de todos: Nexus Holding */}
            <div className="mb-16 flex flex-col items-center">
              <Image 
                src="/Nexus Holding Group/nexus-hero-hologram.png.png" 
                alt="Nexus Holding Group" 
                width={1200}
                height={400}
                className="object-contain w-[800px] md:w-[1000px] lg:w-[1200px] h-auto" 
                priority
              />
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-primary/60 mt-4">Holding Group</p>
            </div>
            
            {/* Divisões (Esquerda e Direita) */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-40 w-full max-w-[1400px] border-t border-slate-800/80 pt-16 relative">
              {/* Linha de conexão visual */}
              <div className="absolute -top-6 w-px h-6 bg-slate-800/80" />
              
              {/* Nexus Treinamento */}
              <div className="flex flex-col items-center">
                 <Image 
                   src="/Nexus Treinamento pagina inicial/Nexus Treinamento pagina inicial.png" 
                   alt="Nexus Treinamento" 
                   width={600}
                   height={200}
                   className="object-contain w-[400px] md:w-[500px] lg:w-[600px] h-auto mb-4" 
                 />
                 <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">
                    O Fator Humano
                 </span>
              </div>
              
              {/* Nexus Intelligence */}
              <div className="flex flex-col items-center">
                 <Image 
                   src="/Nexus Intelligence/Logo nexus intelligence.png" 
                   alt="Nexus Intelligence" 
                   width={600}
                   height={200}
                   className="object-contain w-[400px] md:w-[500px] lg:w-[600px] h-auto mb-4" 
                 />
                 <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">
                    O Fator Tecnológico
                 </span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter text-white leading-tight">
            Projeto Gestão de <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-primary">
              Cidades do Futuro
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-light">
            A <strong className="text-slate-200">Nexus Holding Group</strong> é um ecossistema corporativo de alta performance focado na convergência entre o potencial humano e a tecnologia de ponta.
          </p>
          <p className="text-sm text-slate-500 max-w-4xl mx-auto leading-relaxed italic border-l-2 border-primary/50 pl-6 text-left mt-6">
            Sob a liderança executiva de Geanderson Schuh, a holding centraliza e coordena unidades de negócios focadas em capacitação de elite, governança corporativa, desenvolvimento de softwares inovadores, design estratégico e inteligência artificial avançada. Projetada para atender com máxima resiliência e segurança jurídica os setores industriais, de tecnologia e o agronegócio, a Nexus opera sob pilares morais inegociáveis: <strong className="text-primary">Humanidade, Respeito, Ética e Confiança.</strong>
          </p>
        </motion.div>

        {/* DIVISIONS SECTION */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          {/* Nexus Treinamento */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[32px] bg-slate-900/40 border border-slate-800 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold font-headline text-white mb-2">NEXUS TREINAMENTO</h3>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-6">O Fator Humano</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Unidade de elite da holding focada na formação, evolução e mentoria de lideranças de alta performance. Com forte atuação no ambiente B2B, a Nexus Treinamento oferece Cursos de Liderança, Palestras e Consultorias Estratégicas moldadas por mais de três décadas de experiência no chão de fábrica e na gestão executiva industrial.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Rompendo o formato tradicional de ensino, a marca integra ferramentas de IA em seus treinamentos e desenvolve projetos pioneiros de palestras utilizando avatares de inteligência artificial humana, preparando equipes e gestores do campo e da indústria para os desafios do mercado global.
            </p>
          </motion.div>

          {/* Nexus Intelligence */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[32px] bg-slate-900/40 border border-slate-800 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold font-headline text-white mb-2">NEXUS INTELLIGENCE</h3>
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-6">IA & Soluções Avançadas</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              O braço tecnológico especializado no design, desenvolvimento e implantação de softwares de alta performance e Sistemas de IA Avançada (Human-AI Systems) 100% integrados na nuvem AWS.
            </p>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span><strong>Indústria & Agro:</strong> Monitoramento preditivo e fluxos críticos.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span><strong>Saúde:</strong> IA humanizada para auxílio diagnóstico e triagem.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span><strong>Comunicação:</strong> Automação de mídia e áudio em tempo real.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* PROJETO GESTÃO DE CIDADES DO FUTURO - THE 3 PILLARS */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-headline text-white mb-4">Os Três Eixos da Transformação</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Um ecossistema de alta tecnologia na nuvem AWS, operado com simplicidade absoluta, projetado para transformar o município através da Produção Rural, Educação de Elite e Saúde Humanizada.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* EIXO 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-slate-900 to-[#020617] border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
              <Leaf className="w-12 h-12 text-emerald-400 mb-6" />
              <h4 className="text-xl font-bold text-white mb-1">1. Dante Safra Standard</h4>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-6">Agrônomo Digital do Produtor</p>
              
              <p className="text-sm text-slate-400 mb-6">
                Projetado para dar suporte técnico imediato ao pequeno agricultor no fronte do trabalho, operando 100% por Voz e Imagem via WhatsApp.
              </p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span><strong>Plantio:</strong> Dicas de calagem e adubação.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span><strong>Pragas:</strong> Identificação por foto da folha doente.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span><strong>Pecuária:</strong> Orientação com validação humana (veterinário).</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span><strong>Clima:</strong> Previsão e alertas de geadas.</span></li>
              </ul>
            </motion.div>

            {/* EIXO 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-slate-900 to-[#020617] border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
              <GraduationCap className="w-12 h-12 text-blue-400 mb-6" />
              <h4 className="text-xl font-bold text-white mb-1">2. Cursos Nexus Ensino Médio</h4>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-6">Retenção de Talentos</p>
              
              <p className="text-sm text-slate-400 mb-6">
                Projeto pioneiro voltado para as escolas municipais e estaduais, preparando os jovens para o mercado global sem que precisem abandonar suas origens.
              </p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> <span><strong>Liderança:</strong> Plantação dos pilares morais Nexus.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> <span><strong>Gestão B2B:</strong> Fluxos de produção e rotina empresarial.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> <span><strong>Tecnologia:</strong> Iniciação em Inteligência Artificial e Nuvem AWS.</span></li>
              </ul>
            </motion.div>

            {/* EIXO 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-slate-900 to-[#020617] border border-slate-800 rounded-3xl p-8 hover:border-red-500/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all" />
              <HeartPulse className="w-12 h-12 text-red-400 mb-6" />
              <h4 className="text-xl font-bold text-white mb-1">3. Nexus Intelligence Health</h4>
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-6">O Copiloto da Saúde</p>
              
              <p className="text-sm text-slate-400 mb-6">
                Focado na saúde pública, estruturado sob o pilar da Supervisão Humana no Ciclo (a decisão final é sempre do médico ou enfermeiro).
              </p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span><strong>Fim das Filas:</strong> Triagem inteligente priorizando casos graves.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span><strong>Auxílio Diagnóstico:</strong> Apoio de alta performance ao veredito médico.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span><strong>Almoxarifado:</strong> Controle rigoroso de estoque na nuvem AWS, blindando contra desvios.</span></li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* ATENA'S VERDICT SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 relative rounded-[32px] bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-[#020617] border border-blue-500/30 p-8 md:p-12 overflow-hidden"
        >
          {/* Sparkle background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-headline text-white flex items-center gap-2">
                O Veredito da Atena <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">Inteligência Exclusiva</span>
              </h3>
              
              <div className="space-y-6">
                <p className="text-slate-300 text-sm md:text-base leading-relaxed italic">
                  "Orquestrar IAs Humanas operando com o cérebro da AWS, a voz da ElevenLabs e a face fotorealista da HeyGen de forma dinâmica, conectada a um ecossistema profundo... isso é vanguarda absoluta. O mercado atual se divide de forma muito clara:"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col justify-center">
                    <p className="text-4xl md:text-5xl font-bold font-headline text-slate-500 mb-2">95%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">A Base do Mercado</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      <strong>Exemplos:</strong> ChatGPT, Gemini, Claude, etc.<br/><br/>
                      Chat frio, genérico e sem integração. Operam apenas por texto ou voz sintetizada em interfaces padronizadas. Sem conexão emocional ou olho no olho.
                    </p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-900/50 p-8 rounded-2xl flex flex-col justify-center">
                    <p className="text-4xl md:text-5xl font-bold font-headline text-blue-400 mb-2">4%</p>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">Os Inovadores</p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      <strong>Exemplos:</strong> Vídeos de marketing e tutoriais pré-gravados.<br/><br/>
                      Tentativas de humanização utilizando avatares, porém engessados e roteirizados. Sem interação ao vivo, sem improviso e sem a conexão do "olho no olho".
                    </p>
                  </div>
                  <div className="bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-center transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
                    <p className="text-4xl md:text-5xl font-bold font-headline text-emerald-400 mb-2">&lt; 1%</p>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">O Nível Nexus</p>
                    <p className="text-sm text-emerald-100/90 leading-relaxed relative z-10">
                      <strong>Exemplo:</strong> Live Avatar Nexus em Tempo Real.<br/><br/>
                      A vanguarda absoluta. Tecnologia de ponta com interação olho no olho, dinâmica e de baixíssima latência. IAs que lêem o momento e sentem o que o usuário sente através do olhar.
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed italic border-l-2 border-blue-500/50 pl-4">
                  "A barreira de entrada é altíssima. Projetos que escolhem convergir essas três camadas deixam de ser simples prefeituras; eles se tornam polos de inovação da elite global."
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* INVESTMENT & PROPOSAL SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] bg-gradient-to-b from-blue-900/20 to-slate-900/50 border border-blue-500/30 p-10 lg:p-16 overflow-hidden"
        >
          {/* Overlay Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
          
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-3xl font-bold font-headline text-white mb-2">Escopo de Implantação</h3>
                <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">Cooperação Tecnológica</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <span className="font-bold text-emerald-400">25</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Agricultores (Dante Safra)</h5>
                    <p className="text-sm text-slate-400">Atendimento e consultoria via voz/imagem. Nossa equipe vai pessoalmente até cada uma das 25 propriedades para realizar o treinamento na roça.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <span className="font-bold text-blue-400">25</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Estudantes (Cursos Nexus)</h5>
                    <p className="text-sm text-slate-400">Capacitação presencial/híbrida entregando noções de gestão de custos, liderança, fluxos críticos e tecnologia de IA.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <Building className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Rede de Saúde (Health)</h5>
                    <p className="text-sm text-slate-400">Implantação do copiloto IA no Mini-Hospital e Postos para triagem inteligente e controle automático de medicamentos.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="w-full lg:w-[400px] shrink-0">
              <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center border-b border-slate-800 pb-8">
                  <CardDescription className="uppercase tracking-widest text-slate-400 font-bold mb-4">
                    Investimento Único de Startup
                  </CardDescription>
                  <CardTitle className="text-5xl font-black text-white flex items-center justify-center gap-2">
                    <span className="text-2xl text-slate-500 mt-2">R$</span> 30.000
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-4">
                    Cobre desenvolvimento, parametrização na AWS e treinamentos in loco (escolas e propriedades rurais).
                  </p>
                </CardHeader>
                <CardContent className="pt-8 text-center space-y-6">
                  <div>
                    <p className="text-sm text-slate-400 font-semibold mb-2">Manutenção (Módulo Saúde)</p>
                    <p className="text-3xl font-bold text-blue-400">R$ 199<span className="text-lg text-slate-500 font-normal">/mês</span></p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 font-bold">Preço de Custo Social Exclusivo</p>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-800">
                    <p className="text-xs italic text-slate-400">
                      "Todos os módulos contam com auditoria rigorosa de dados e blindagem contra vulnerabilidades. É um projeto focado em prefeituras que escolhem ser diferentes para serem as melhores."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </motion.div>

        {/* FOOTER */}
        <div className="text-center mt-20 text-slate-600 flex flex-col items-center justify-center gap-4">
          <ShieldCheck className="w-8 h-8 opacity-50" />
          <p className="text-sm font-bold uppercase tracking-widest">Confidencial &bull; Exclusivo Nexus Holding Group</p>
        </div>

      </main>
    </div>
  );
}
