'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ShoppingCart, Cpu, BarChart3, Shield, CheckCircle, ArrowRight, Phone, Eye, Timer, Package, Truck, ShoppingBag, Users, BrainCircuit, Database, ShieldCheck, Factory, Sparkles } from 'lucide-react';
import * as gtag from '@/lib/gtag';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

const WHATSAPP_URL = 'https://wa.me/5551999799582';

const modules = [
  {
    id: 'distribuicao',
    badge: 'LOGISTICS_INTELLIGENCE',
    title: '', highlight: 'DISTRIBUIÇÃO',
    subtitle: 'Logística Global, Portos e Frotas',
    description: 'Gestão preditiva de rotas, alocação de contêineres e telemetria de frota rodoviária. A inteligência que impede o seu supply chain de parar.',
    icon: Truck, color: 'sky',
    features: ['Roteamento neural em tempo real', 'Gestão automatizada de pátios e portos', 'Manutenção preditiva de frota pesada', 'Arquitetura 100% On-Premise'],
    image: '/images/portos.jpeg',
    gtag: 'nexus_empresas_atlas', href: '',
    licenca: 'Sob Consulta', suporte: 'SLA Enterprise',
    roi: 'Se paga na primeira frota otimizada ou navio liberado.',
    frozen: false,
  },
  {
    id: 'preditiva',
    badge: 'HEAVY_INDUSTRY_AI',
    title: '', highlight: 'PREDITIVA',
    subtitle: 'Indústria 4.0 e Mineração',
    description: 'Conecte nossa IA aos sensores (IoT) existentes da sua fábrica. Preveja falhas mecânicas com dias de antecedência. Zero paradas surpresa na sua operação.',
    icon: Factory, color: 'amber',
    features: ['Manutenção Preditiva Neural (Time-Series)', 'Análise de vibração e temperatura', 'Previsão de vida útil de peças críticas', 'Implantação 100% On-Premise (Servidor Local)'],
    image: '/images/robos.jpg',
    gtag: 'nexus_empresas_vulcan', href: '',
    licenca: 'Sob Consulta', suporte: 'SLA Enterprise',
    roi: 'Se paga evitando a primeira parada não programada da linha de produção.',
    frozen: false,
  },
  {
    id: 'vendas',
    badge: 'SALES_INTELLIGENCE',
    title: '', highlight: 'VENDAS',
    subtitle: 'Catálogo, Pedidos e Ordens de Produção',
    description: 'O vendedor acessa o catálogo completo, monta o pedido com produto explodido e gera a OP automaticamente — que vai direto para o PPCP com data de entrega.',
    icon: ShoppingBag, color: 'indigo',
    features: ['Catálogo de produtos com lista de materiais', 'Geração automática de OP', 'Integração direta com PPCP', 'Rastreamento do pedido até a entrega'],
    image: '/Nexus Empresas/Dante Vendas.png',
    gtag: 'nexus_empresas_vendas', href: '/intelligence/vendas',
    licenca: 'R$ 13.500,00', suporte: 'R$ 540,00/mês',
    roi: 'Se paga eliminando o primeiro erro de pedido.',
    frozen: false,
  },
  {
    id: 'compras',
    badge: 'SUPPLY_INTELLIGENCE',
    title: '', highlight: 'COMPRAS',
    subtitle: 'IA de Intermediação e Auditoria de Suprimentos',
    description: 'A IA analisa cotações, compara fornecedores e audita cada decisão em tempo real — empresas economizam em média R$ 5.000 já na primeira compra.',
    icon: ShoppingCart, color: 'blue',
    features: ['Análise comparativa de fornecedores', 'Auditoria de decisões de compra', 'Relatórios de economia acumulada', 'Redução de até 30% no custo de aquisição'],
    image: '/Nexus Empresas/Dante compras.jpg',
    gtag: 'nexus_empresas_compras', href: '/intelligence/compras',
    licenca: 'R$ 15.000,00', suporte: 'R$ 600,00/mês',
    roi: 'Se paga na primeira cotação.',
  },

  {
    id: 'ppcp',
    badge: 'PRODUCTION_CONTROL',
    title: '', highlight: 'PPCP',
    subtitle: 'Planejamento, Programação e Controle da Produção',
    description: 'Empresas que controlam a produção com IA reduzem o retrabalho em até 40% e eliminam gargalos antes que parem a linha.',
    icon: BarChart3, color: 'amber',
    features: ['Planejamento de capacidade produtiva', 'Programação de ordens de produção', 'Alertas de gargalo antes que parem a linha', 'Redução de até 25% no custo de produção'],
    image: '/Nexus Empresas/Dante PPCP.png',
    gtag: 'nexus_empresas_ppcp', href: '/intelligence/ppcp',
    licenca: 'R$ 18.000,00', suporte: 'R$ 720,00/mês',
    roi: 'Se paga na primeira ordem otimizada.',
  },
  {
    id: 'auditor',
    badge: 'AUDIT_INTELLIGENCE',
    title: '', highlight: 'AUDITOR',
    subtitle: 'Auditoria Inteligente de Processos e Decisões',
    description: 'Empresas perdem em média 15% do faturamento por desvios não detectados. O Nexus Auditor identifica e bloqueia esses vazamentos antes que cheguem ao balanço.',
    icon: Shield, color: 'emerald',
    features: ['Auditoria em tempo real de processos críticos', 'Detecção de desvios e riscos', 'Trilha de auditoria imutável', 'Economia de até 15% do faturamento retida'],
    image: '/Nexus Empresas/Dante Auditor.png',
    gtag: 'nexus_empresas_auditor', href: '/intelligence/auditor', 
    licenca: 'R$ 13.500,00', suporte: 'R$ 540,00/mês',
    roi: 'Se paga evitando um único desvio.',
  },
  {
    id: 'cronoanalise',
    badge: 'TIME_INTELLIGENCE',
    title: '', highlight: 'CRONOANALISE',
    subtitle: 'Cronoanálise e Tempos Padrão com IA',
    description: 'Elimine o achismo da produção. O sistema mede, analisa e define os tempos padrão reais de cada operação.',
    icon: Timer, color: 'violet',
    features: ['Cronometragem e tempo padrão por operação', 'Cálculo de eficiência real por operador', 'Identificação de operações gargalo', 'Integração direta com Nexus PPCP'],
    image: '/Nexus Empresas/Dante cronoanalista.png',
    gtag: 'nexus_empresas_cronoanalise', href: '/intelligence/cronoanalise',
    licenca: 'R$ 10.500,00', suporte: 'R$ 420,00/mês',
    roi: 'Se paga na primeira operação otimizada.',
  },
  {
    id: 'almoxarifado',
    badge: 'STOCK_INTELLIGENCE',
    title: '', highlight: 'ALMOXARIFADO',
    subtitle: 'Gestão Inteligente de Estoque e Insumos',
    description: 'Estoque parado é dinheiro morto. O sistema controla entradas, saídas e saldo em tempo real.',
    icon: Package, color: 'orange',
    features: ['Controle de entrada e saída de materiais', 'Saldo em tempo real por insumo', 'Alertas de estoque mínimo', 'Integração com Compras e PPCP'],
    image: '/Nexus Empresas/Dante almoxarife.png',
    gtag: 'nexus_empresas_almoxarifado', href: '/intelligence/almoxarifado',
    licenca: 'R$ 10.500,00', suporte: 'R$ 420,00/mês',
    roi: 'Se paga eliminando a primeira parada por falta de material.',
  },
  {
    id: 'expedicao',
    badge: 'DISPATCH_INTELLIGENCE',
    title: '', highlight: 'EXPEDIÇÃO',
    subtitle: 'Controle de Saída, Romaneio e Entrega',
    description: 'Do estoque ao cliente sem erros. O sistema controla cada saída, gera romaneios automáticos e garante que o produto certo chegue no prazo certo.',
    icon: Truck, color: 'sky',
    features: ['Geração automática de romaneios', 'Controle de saída por pedido', 'Rastreamento de entregas', 'Integração com Almoxarifado e PPCP'],
    image: '/Nexus Empresas/Dante expedição.png',
    gtag: 'nexus_empresas_expedicao', href: '/intelligence/expedicao',
    licenca: 'R$ 10.500,00', suporte: 'R$ 420,00/mês',
    roi: 'Se paga eliminando o primeiro erro de entrega.',
  },
  {
    id: 'rh',
    badge: 'HR_INTELLIGENCE',
    title: '', highlight: 'RH & PESSOAS',
    subtitle: 'Gestão de Talentos e Liderança com IA',
    description: 'Recrutamento inteligente, análise comportamental e desenvolvimento humano guiado por dados para reter os melhores talentos.',
    icon: Users, color: 'pink',
    features: ['Match preditivo de candidatos', 'Mapeamento de perfil comportamental', 'Identificação de gaps de liderança', 'Automação de onboarding'],
    image: '/Nexus Intelligence RH/Nexus Intelligence RH.png',
    gtag: 'nexus_empresas_rh', href: '/nexus-empresas/rh',
    licenca: 'R$ 10.500,00', suporte: 'R$ 420,00/mês',
    roi: 'Se paga na redução do primeiro turnover errado.',
  },
  {
    id: 'estrategia',
    badge: 'STRATEGY_INTELLIGENCE',
    title: '', highlight: 'ESTRATÉGIA',
    subtitle: 'Mentoria Executiva e Decision Making',
    description: 'Inteligência artificial atuando como conselheiro C-Level. Valide cenários, simule impactos e tome decisões blindadas por dados.',
    icon: BrainCircuit, color: 'violet',
    features: ['Análise de cenários de mercado', 'Simulador de decisões executivas', 'Desenvolvimento de sucessores', 'Career Advisor C-Level'],
    image: '/Nexus Intelligence Estratégia e liderança/Nexus Intelligence estratégia e liderança.png',
    gtag: 'nexus_empresas_estrategia', href: '/nexus-empresas/estrategia',
    licenca: 'R$ 21.000,00', suporte: 'R$ 840,00/mês',
    roi: 'Se paga na primeira decisão estratégica assertiva.',
  },
  {
    id: 'engenharia',
    badge: 'ENGINEERING_DATA',
    title: '', highlight: 'ENGENHARIA',
    subtitle: 'O Banco de Dados Master da Fábrica',
    description: 'Onde os tempos auditados do Dante encontram o planejamento do PPCP. O motor central que garante que o produto saia como projetado.',
    icon: Database, color: 'emerald',
    features: ['Estruturação de Ficha Técnica (BOM)', 'Gestão do Banco de Tempos', 'Cálculo dinâmico de capacidade', 'Versionamento de processos'],
    image: '/Nexus Intelligence Engenharia/Nexus intelligence Engenharia.png',
    gtag: 'nexus_empresas_engenharia', href: '/nexus-empresas/engenharia',
    licenca: 'R$ 16.000,00', suporte: 'R$ 640,00/mês',
    roi: 'Se paga eliminando a primeira falha na lista de materiais.',
  },
  {
    id: 'qualidade',
    badge: 'QUALITY_CONTROL',
    title: '', highlight: 'QUALIDADE',
    subtitle: 'Inspeções e Planos de Ação',
    description: 'A ponte de segurança da fábrica. Garanta que o Almoxarifado receba material perfeito e que a Produção só libere produtos no padrão.',
    icon: ShieldCheck, color: 'cyan',
    features: ['Inspeção de Recebimento de Insumos', 'Checklists de Máquina e Liberação de Setup', 'Gestão de Não Conformidades (RNC)', 'Planos de Ação (5W2H)'],
    image: '/Nexus Intelligence Qualidade/Nexus Qualidade.png',
    gtag: 'nexus_empresas_qualidade', href: '/intelligence/qualidade',
    licenca: 'R$ 10.500,00', suporte: 'R$ 420,00/mês',
    roi: 'Se paga na primeira RNC bloqueada.',
  },
];

const colorMap: Record<string, { border: string; badge: string; text: string; glow: string; bg: string; btn: string }> = {
  indigo:  { border: 'border-indigo-500/30',  badge: 'bg-indigo-600',  text: 'text-indigo-400',  glow: 'shadow-[0_0_60px_rgba(99,102,241,0.15)]',   bg: 'bg-indigo-500/5',  btn: 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10' },
  blue:    { border: 'border-blue-500/30',    badge: 'bg-blue-600',    text: 'text-blue-400',    glow: 'shadow-[0_0_60px_rgba(37,99,235,0.15)]',    bg: 'bg-blue-500/5',    btn: 'border-blue-500/50 text-blue-400 hover:bg-blue-500/10' },
  cyan:    { border: 'border-cyan-500/30',    badge: 'bg-cyan-600',    text: 'text-cyan-400',    glow: 'shadow-[0_0_60px_rgba(34,211,238,0.15)]',   bg: 'bg-cyan-500/5',    btn: 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10' },
  amber:   { border: 'border-amber-500/30',   badge: 'bg-amber-600',   text: 'text-amber-400',   glow: 'shadow-[0_0_60px_rgba(245,158,11,0.15)]',   bg: 'bg-amber-500/5',   btn: 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10' },
  emerald: { border: 'border-emerald-500/30', badge: 'bg-emerald-600', text: 'text-emerald-400', glow: 'shadow-[0_0_60px_rgba(16,185,129,0.15)]',   bg: 'bg-emerald-500/5', btn: 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10' },
  violet:  { border: 'border-violet-500/30',  badge: 'bg-violet-600',  text: 'text-violet-400',  glow: 'shadow-[0_0_60px_rgba(139,92,246,0.15)]',   bg: 'bg-violet-500/5',  btn: 'border-violet-500/50 text-violet-400 hover:bg-violet-500/10' },
  orange:  { border: 'border-orange-500/30',  badge: 'bg-orange-600',  text: 'text-orange-400',  glow: 'shadow-[0_0_60px_rgba(249,115,22,0.15)]',   bg: 'bg-orange-500/5',  btn: 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10' },
  sky:     { border: 'border-sky-500/30',     badge: 'bg-sky-600',     text: 'text-sky-400',     glow: 'shadow-[0_0_60px_rgba(14,165,233,0.15)]',   bg: 'bg-sky-500/5',     btn: 'border-sky-500/50 text-sky-400 hover:bg-sky-500/10' },
  pink:    { border: 'border-pink-500/30',    badge: 'bg-pink-600',    text: 'text-pink-400',    glow: 'shadow-[0_0_60px_rgba(236,72,153,0.15)]',   bg: 'bg-pink-500/5',    btn: 'border-pink-500/50 text-pink-400 hover:bg-pink-500/10' },
};

type Mod = typeof modules[0];

export default function NexusEmpresasPage() {
  const [aberto, setAberto] = useState<Mod | null>(null);
  const [modalTab, setModalTab] = useState<'detalhes' | 'investimento'>('detalhes');

  return (
    <div className="w-full min-h-screen bg-[#020A14] text-slate-200 relative overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-hero-hologram.png"
          alt="Nexus Empresas Background"
          fill
          priority
          className="object-cover opacity-55"
          style={{ objectPosition: 'center top' }}
        />
        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020A14]/25 via-[#020A14]/55 to-[#020A14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(0,212,255,0.06)_0%,transparent_60%)]" />
        {/* Ambient orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/8 rounded-full blur-[150px]" />
        {/* Tech grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,87,255,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(0,87,255,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* HERO */}
      <div className="relative z-10 w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020A14]/60 via-transparent to-[#020A14]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <Badge className="bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20 px-6 py-1.5 tracking-[0.3em] font-mono text-[10px] mb-8">B2B_INTELLIGENCE_SUITE</Badge>
          <div className="w-full flex flex-col items-center text-center gap-6 mt-12 mb-6 max-w-4xl px-4 mx-auto">
            {/* LOGO VIDEO DJENY */}
            <div className="relative w-full max-w-[800px] aspect-video flex items-center justify-center">
              <div className="w-full h-full rounded-[40px] overflow-hidden flex items-center justify-center border border-blue-500/20 bg-blue-500/5 shadow-[0_0_80px_rgba(0,212,255,0.15)]">
                <video
                  src="/Nexus Empresas/Nexus_empresas.mp4"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* NOME DA EMPRESA */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              Nexus <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-blue-500 to-indigo-600">Empresas</span>
            </h1>

            {/* SLOGAN */}
            <p className="text-zinc-400 text-sm sm:text-base md:text-xl font-light tracking-wide max-w-2xl leading-relaxed mx-auto">
              Tecnologia soberana instalada diretamente nos seus servidores. 100% On-Premise. Seus dados industriais nunca saem do seu galpão.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#00D4FF] text-black hover:bg-[#00D4FF]/90 font-black uppercase tracking-widest px-10 h-14 text-base rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.3)]"
              onClick={() => gtag.event({ action: 'contact_click', category: 'nexus_empresas', label: 'hero_cta' })}>
              <Link href={WHATSAPP_URL} target="_blank"><Phone className="mr-2 h-4 w-4" /> Falar com um Consultor</Link>
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 font-black uppercase tracking-widest px-10 h-14 text-base rounded-2xl"
              onClick={() => document.getElementById('modulos')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver Módulos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* SEÇÃO CONHEÇA A NEXUS B2B */}
      <section className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center gap-8">
        <div className="text-center space-y-4 max-w-2xl">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1 tracking-[0.2em] font-mono text-[10px]">
            APRESENTAÇÃO EXCLUSIVA
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Conheça a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00D4FF]">Nexus B2B</span>
          </h2>
          <p className="text-slate-400">
            Assista à nossa apresentação completa e entenda como as soluções táticas da Nexus revolucionam o mercado corporativo.
          </p>
        </div>

        <div className="relative w-full max-w-4xl aspect-video rounded-[32px] overflow-hidden border-2 border-emerald-500/20 shadow-[0_0_50px_rgba(0,212,255,0.1)] bg-slate-950">
          <video 
            src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Nexus_Empresas/Nexus_B2B.mp4" 
            controls 
            playsInline 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* MÓDULOS — GRID COMPACTO */}
      <section id="modulos" className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Módulos <span className="text-[#00D4FF]">Disponíveis</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Clique em qualquer módulo para ver todos os detalhes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {modules.map((mod, i) => {
            const c = colorMap[mod.color];
            return (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setAberto(mod)}
                className={`relative rounded-[28px] overflow-hidden border ${mod.frozen ? 'border-cyan-500/20 opacity-75 shadow-[0_0_30px_rgba(6,182,212,0.02)]' : `${c.border} ${c.glow} hover:border-opacity-60`} bg-slate-900/60 backdrop-blur-xl group text-left hover:-translate-y-1 transition-all duration-300`}
              >
                {/* IMAGEM */}
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br from-slate-900 to-transparent ${mod.frozen ? 'grayscale opacity-50' : ''}`}>
                  <Image src={mod.image} alt={mod.highlight} fill className={`object-contain p-4 transition-transform duration-700 ${mod.frozen ? '' : 'group-hover:scale-110'}`} />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <Badge className={`${mod.frozen ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/20' : `${c.badge} text-white border-none`} px-2 py-0.5 text-[8px] font-black tracking-widest uppercase`}>
                      {mod.frozen ? 'EM DESENVOLVIMENTO' : mod.badge}
                    </Badge>
                    {mod.frozen && (
                      <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[8px] font-black tracking-widest uppercase w-fit">
                        AGUARDANDO AWS
                      </Badge>
                    )}
                  </div>
                </div>

                {/* INFO */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${mod.frozen ? 'bg-cyan-950/40 border border-cyan-500/10' : c.bg}`}>
                      <mod.icon className={`h-4 w-4 ${mod.frozen ? 'text-cyan-400' : c.text}`} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${mod.frozen ? 'text-cyan-500' : c.text}`}>{mod.title}</span>
                  </div>
                  <h3 className={`text-xl font-black uppercase tracking-tight ${mod.frozen ? 'text-slate-400 font-bold' : 'text-white'}`}>
                    {mod.highlight}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${mod.frozen ? 'text-slate-600' : 'text-slate-500'}`}>{mod.subtitle}</p>
                  <div className={`flex items-center justify-between pt-2 border-t ${mod.frozen ? 'border-cyan-500/10' : c.border}`}>
                    <span className={`text-sm font-black ${mod.frozen ? 'text-slate-400' : c.text}`}>B2B ENTERPRISE</span>
                    <span className={`text-[10px] uppercase tracking-widest ${mod.frozen ? 'text-cyan-500/60' : 'text-slate-600'}`}>
                      {mod.frozen ? 'Suspenso →' : 'Ver detalhes →'}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* SOB ENCOMENDA CTA */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-3 relative rounded-[28px] overflow-hidden border border-rose-500/30 shadow-[0_0_40px_rgba(225,29,72,0.15)] bg-rose-500/5 backdrop-blur-xl group flex flex-col justify-center items-center text-center p-8 hover:bg-rose-500/10 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-4 relative z-10">
              <Sparkles className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2 relative z-10">
              Não encontrou o que precisava?
            </h3>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto mb-8 relative z-10">
              Entre em contato com a Nexus e solicite sob encomenda. Seu problema, nossa engenharia, nossa solução. Desenvolvemos módulos exclusivos para a sua operação.
            </p>
            <Button asChild className="bg-rose-600 text-white hover:bg-rose-700 font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-all hover:scale-105 relative z-10"
              onClick={() => gtag.event({ action: 'contact_click', category: 'nexus_empresas', label: 'custom_engineering' })}>
              <Link href={WHATSAPP_URL} target="_blank">
                Solicitar Engenharia
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* INTEGRAÇÃO */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20 px-6 py-1.5 tracking-[0.3em] font-mono text-[10px]">NEXUS_ECOSYSTEM</Badge>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Quanto mais integrado, <span className="text-[#00D4FF]">mais poderoso.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Cada módulo é independente e já entrega resultado sozinho. Mas quando combinados, formam um ecossistema que transforma toda a operação.</p>
        </div>
        <div className="max-w-5xl mx-auto space-y-6">
          {[
            { n: '1', title: 'Um módulo — Resolução imediata do problema principal.', text: 'Escolha o módulo que resolve sua maior dor hoje. Cada um se paga sozinho no primeiro uso.', border: 'border-white/10', bg: 'bg-slate-900/40' },
            { n: '2', title: 'Dois módulos — O ciclo começa a fechar.', text: 'A combinação mais poderosa: Builder + Compras. Do projeto à compra, sem retrabalho e sem desperdício.', border: 'border-[#00D4FF]/20', bg: 'bg-slate-900/40' },
            { n: '3', title: 'Três módulos — Operação sob controle total.', text: 'Adicione o PPCP e sua operação ganha visibilidade completa: projeta, abastece e executa no prazo certo.', border: 'border-[#00D4FF]/30', bg: 'bg-slate-900/40' },
            { n: '4+', title: 'Ecossistema completo — Do projeto à entrega, 100% rastreado.', text: 'Builder → Compras → Almoxarifado → Cronoanalise → PPCP → Expedição → Auditor. Uma operação industrial blindada.', border: 'border-[#00D4FF]/40', bg: 'bg-[#00D4FF]/5', best: true },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`flex flex-col md:flex-row items-start md:items-center gap-6 p-8 rounded-[32px] ${item.bg} border ${item.border} transition-all`}>
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 shrink-0">
                <span className="text-xl font-black text-[#00D4FF]">{item.n}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
                  {item.best && <Badge className="bg-[#00D4FF] text-black font-black text-[9px] tracking-widest uppercase px-3 py-1">Melhor ROI</Badge>}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 container mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
            Pronto para <span className="text-[#00D4FF]">transformar</span> sua operação?
          </h2>
          <p className="text-slate-400 text-lg">Fale com um consultor e descubra qual combinação de módulos faz mais sentido para o seu negócio.</p>
          <Button asChild className="bg-[#00D4FF] text-black hover:bg-[#00D4FF]/90 font-black uppercase tracking-widest px-16 h-16 text-lg rounded-2xl shadow-[0_0_60px_rgba(0,212,255,0.3)] transition-all hover:scale-105"
            onClick={() => gtag.event({ action: 'contact_click', category: 'nexus_empresas', label: 'cta_final' })}>
            <Link href={WHATSAPP_URL} target="_blank"><Phone className="mr-3 h-5 w-5" /> Falar com um Consultor</Link>
          </Button>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <LegalSafeguard module="NEXUS B2B" protocol="NX-EMPRE-01" />
      </div>

      {/* MODAL DETALHE */}
      <Dialog open={!!aberto} onOpenChange={o => { if(!o) setAberto(null); setModalTab('detalhes'); }}>
        <DialogContent className="bg-[#020A14] border-white/10 text-white max-w-5xl max-h-[90vh] overflow-y-auto rounded-[40px] p-0">
          {aberto && (() => {
            const c = colorMap[aberto.color];
            return (
              <div className="flex flex-col lg:flex-row min-h-[500px]">
                {/* IMAGEM */}
                <div className={`lg:w-2/5 relative h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-slate-900 to-transparent flex-shrink-0`}>
                  <Image src={aberto.image} alt={aberto.highlight} fill className="object-contain p-8" />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <Badge className={`${c.badge} text-white border-none px-3 py-1 text-[9px] font-black tracking-widest uppercase`}>{aberto.badge}</Badge>
                    <div className={`p-2 rounded-xl bg-black/40 border border-white/10 w-fit`}>
                      <aberto.icon className={`h-5 w-5 ${c.text}`} />
                    </div>
                  </div>
                </div>

                {/* CONTEÚDO */}
                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center space-y-6">
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                      {aberto.title} <span className={c.text}>{aberto.highlight}</span>
                    </h2>
                    <p className={`text-[10px] font-bold ${c.text} tracking-[0.3em] uppercase mt-3`}>{aberto.subtitle}</p>
                  </div>

                  <p className={`text-slate-300 leading-relaxed text-sm italic border-l-2 ${c.border} pl-4`}>
                    "{aberto.description}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aberto.features.map((f, fi) => (
                      <div key={fi} className={`flex items-center gap-2 p-3 rounded-xl ${c.bg} border ${c.border}`}>
                        <CheckCircle className={`h-3.5 w-3.5 ${c.text} shrink-0`} />
                        <span className="text-slate-300 text-xs">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`p-4 rounded-2xl border ${c.border} ${c.bg} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                    <p className={`text-sm font-black ${c.text} uppercase tracking-widest text-center sm:text-left`}>{aberto.roi}</p>
                    <Button onClick={() => setModalTab(modalTab === 'investimento' ? 'detalhes' : 'investimento')} variant="outline" className={`shrink-0 border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] h-9`}>
                      {modalTab === 'investimento' ? 'Ocultar Valores' : 'Ver Investimento'}
                    </Button>
                  </div>

                  {modalTab === 'investimento' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                      {/* PREÇO AVULSO */}
                      <div className={`p-6 rounded-2xl border ${c.border} bg-slate-900/50 flex flex-col gap-5`}>
                        <div className="border-b border-white/10 pb-4 text-center sm:text-left">
                          <h4 className="text-lg font-black text-white uppercase tracking-tight">
                            Licença Individual <span className="text-slate-500 font-bold mx-2">-</span> <span className="text-slate-400">Módulo Avulso</span>
                          </h4>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
                          <div className="text-center sm:text-left flex-1">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Implantação Única</p>
                            <p className={`text-3xl font-black ${c.text}`}>{aberto.licenca}</p>
                          </div>
                          <div className="hidden sm:block w-px h-12 bg-white/10 shrink-0"></div>
                          <div className="text-center sm:text-right flex-1">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Manutenção Mensal</p>
                            <p className={`text-3xl font-black ${c.text}`}>{aberto.suporte}</p>
                          </div>
                        </div>
                      </div>

                      {/* PACOTE ENTERPRISE */}
                      <div className={`p-6 rounded-2xl border border-[#00D4FF]/30 bg-gradient-to-r from-[#00D4FF]/10 to-blue-900/20 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 bg-[#00D4FF] text-black text-[9px] font-black tracking-widest px-3 py-1 uppercase rounded-bl-xl">Acesso Full</div>
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheck className="h-6 w-6 text-[#00D4FF]" />
                          <h4 className="text-xl font-black text-white uppercase tracking-tight">Pacote Enterprise (11 Módulos)</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-5">
                          Adquira a fábrica inteira com até <strong className="text-white">35% de desconto</strong> na implantação e mensalidade unificada.
                        </p>
                        <Button onClick={() => gtag.event({ action: 'contact_click', category: 'nexus_empresas', label: 'enterprise_quote' })} asChild className="w-full bg-transparent border border-[#00D4FF]/50 text-[#00D4FF] hover:bg-[#00D4FF]/10 font-black uppercase tracking-widest h-12">
                          <Link href={WHATSAPP_URL} target="_blank">Consultar Valores e ROI do Pacote</Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 w-full">
                    {aberto.frozen ? (
                      <Button disabled className="w-full bg-slate-900/50 text-slate-500 border border-slate-800 font-black uppercase tracking-widest h-12 rounded-2xl cursor-not-allowed">
                        Módulo Temporariamente Suspenso (Aguardando IA AWS)
                      </Button>
                    ) : (
                      <>
                        {'href' in aberto && aberto.href && (
                          <Button asChild variant="outline" className={`flex-1 border ${c.border} ${c.text} font-black uppercase tracking-widest h-12 rounded-2xl gap-2`}>
                            <Link href={(aberto as any).href}><Eye className="h-4 w-4" /> Acessar Módulo</Link>
                          </Button>
                        )}
                        <Button asChild className={`${'href' in aberto && aberto.href ? 'flex-1' : 'w-full'} bg-transparent border-2 ${c.btn} font-black uppercase tracking-widest h-12 rounded-2xl`}
                          onClick={() => gtag.event({ action: 'contact_click', category: 'nexus_empresas', label: aberto.gtag })}>
                          <Link href={WHATSAPP_URL} target="_blank"><Phone className="mr-2 h-4 w-4" /> Falar com Consultor</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
