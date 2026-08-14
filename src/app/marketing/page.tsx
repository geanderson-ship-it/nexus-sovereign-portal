'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Target, 
  Cpu, 
  Share2, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import Link from 'next/link';

export default function MarketingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-slate-100 relative overflow-hidden pt-28 pb-16">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Nexus MarTech Division
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase mb-6 leading-tight">
            Inteligência que <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Converte</span> e Escala
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed font-light">
            Desenvolvemos a próxima geração de ferramentas de marketing baseadas em Inteligência Artificial Soberana. 
            Avatares interativos, automações ativas de prospecção e SDRs neurais integradas ao ecossistema da Nexus Holding Group.
          </p>
        </motion.div>

        {/* METRICS SHOWCASE */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20"
        >
          {[
            { value: '+300%', label: 'Conversão de Tráfego', desc: 'Através de Embaixadoras Digitais interativas com voz em tempo real.' },
            { value: '10x', label: 'Velocidade de Prospecção', desc: 'Robôs integrados ao Apollo e Google Maps varrendo mercados locais.' },
            { value: '24/7', label: 'Atendimento Qualificado', desc: 'Isadora SDR realizando triagem ativa de mensagens direto no WhatsApp.' }
          ].map((metric, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="bg-[#0c0c0e]/80 border border-slate-800/60 p-6 rounded-2xl relative group hover:border-orange-500/30 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-tr-2xl rounded-bl-full pointer-events-none" />
              <div className="text-3xl sm:text-5xl font-black text-orange-400 mb-2 font-mono tracking-tight">{metric.value}</div>
              <div className="text-sm font-bold text-white uppercase tracking-wider mb-2">{metric.label}</div>
              <p className="text-xs text-slate-500 font-light leading-relaxed">{metric.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CORE PRODUCTS GRID */}
        <h2 className="text-2xl font-black uppercase text-white tracking-widest text-center mb-12">
          Nossas Soluções de Alta Performance
        </h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {[
            {
              icon: <Users className="w-6 h-6 text-orange-400" />,
              title: "Embaixadoras Digitais & Avatares de IA",
              desc: "Engajamento e atendimento humanizado 24 horas por dia. O avatar fala mais de 50 idiomas e converte visitantes em leads através de uma conversa rica e persuasiva.",
              features: ["Modelagem de voz customizada", "Live visual com expressões dinâmicas", "Integração direta com CRMs"]
            },
            {
              icon: <Target className="w-6 h-6 text-amber-400" />,
              title: "Robô de Prospecção B2B (Apollo.io & Maps)",
              desc: "Varredura automática e mapeamento completo do mercado. Extrai e-mails de decisores (CEOs/Diretores), telefones corporativos e informações cadastrais.",
              features: ["Sniper do LinkedIn por Google Dorking", "Extração de QSA da Receita Federal", "Pontes automatizadas de e-mail"]
            },
            {
              icon: <MessageSquare className="w-6 h-6 text-cyan-400" />,
              title: "Isadora SDR Automatizada",
              desc: "A nossa SDR virtual atua ativamente no WhatsApp respondendo leads de campanhas imediatamente, tirando dúvidas com base técnica e agendando reuniões no Calendar.",
              features: ["Qualificação de leads no WhatsApp", "Tom de voz empático e consultivo", "Encaminhamento automático para vendas"]
            },
            {
              icon: <Sparkles className="w-6 h-6 text-purple-400" />,
              title: "Copywriter Neural & Geração de Ofertas",
              desc: "Modelos neurais calibrados para criar propostas irrecusáveis baseadas nas dores dos clientes e nichos de mercado (Moda, Agro, Segurança, Gestão Pública).",
              features: ["Criação de propostas 'No-Brainer'", "Roteirização de pitches de 15 minutos", "Personalização total por nicho"]
            }
          ].map((product, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="bg-[#0b0b0d]/90 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between group shadow-xl relative"
            >
              <div className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-all duration-500">
                {product.icon}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                  {product.title}
                </h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
                  {product.desc}
                </p>
              </div>

              <div className="border-t border-slate-900/50 pt-6">
                <ul className="space-y-2">
                  {product.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CALL TO ACTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#0c0c0e] to-[#121215] border border-orange-500/20 rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Subtle Glows */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

          <span className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Gabinete de Inteligência Comercial
          </span>
          <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
            Pronto para impulsionar suas campanhas?
          </h3>
          <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto mb-8">
            Conecte-se com a diretoria virtual da Nexus. Eu, Atena, junto com os diretores de vendas, estou pronta para analisar seu tráfego, planejar e-mails persuasivos e otimizar seu pipeline comercial.
          </p>

          <Link 
            href="/gabinete"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] cursor-pointer"
          >
            Acessar Gabinete de Marketing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
