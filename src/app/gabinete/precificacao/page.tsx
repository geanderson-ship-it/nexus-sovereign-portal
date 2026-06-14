'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Search, Lock, MapPin, Coins, Zap, Wheat, Paintbrush, Building2, Users, BrainCircuit, Database, Activity, HeartPulse, BookOpen, TrendingUp, Mic, ShoppingBag, ShoppingCart, Cpu, BarChart3, Timer, Package, Truck, Factory } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PriceItem {
  name: string;
  category: 'empresas' | 'premium' | 'segmentos' | 'cursos' | 'consulta';
  description: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  tag: string;
  tagBg: string;
  tagText: string;
  tagBorder: string;
  startupPrice: string;
  monthlyPrice: string;
}

const priceItems: PriceItem[] = [
  // Premium
  {
    name: 'Nexus Intelligence Égide',
    category: 'premium',
    description: 'Cerco Eletrônico, LPR, Aegis Biometria & Dante\'s Safe',
    icon: Shield,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    tag: 'Elite GovTech',
    tagBg: 'bg-red-400/10',
    tagText: 'text-red-400',
    tagBorder: 'border-red-500/15',
    startupPrice: 'R$ 150.000',
    monthlyPrice: 'De R$ 12.500 (-20%) por R$ 9.999/mês'
  },
  {
    name: 'Nexus Pactum',
    category: 'premium',
    description: 'Deal war room e detecção biométrica de blefes',
    icon: Shield,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    tag: 'Contracts',
    tagBg: 'bg-blue-500/10',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/15',
    startupPrice: 'R$ 150.000',
    monthlyPrice: 'De R$ 12.500 (-20%) por R$ 9.999/mês'
  },
  {
    name: 'Nexus Atlas (Logística e Portos)',
    category: 'premium',
    description: 'Logística Global, Roteamento Neural e Telemetria Portuária',
    icon: Truck,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    tag: 'Logistics',
    tagBg: 'bg-sky-500/10',
    tagText: 'text-sky-400',
    tagBorder: 'border-sky-500/15',
    startupPrice: 'R$ 150.000',
    monthlyPrice: 'De R$ 12.500 (-20%) por R$ 9.999/mês'
  },
  {
    name: 'Nexus Vulcan (Preditiva & Indústria Pesada)',
    category: 'premium',
    description: 'Indústria 4.0, Mineração e Manutenção Preditiva com IoT',
    icon: Factory,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'Industry 4.0',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/15',
    startupPrice: 'R$ 150.000',
    monthlyPrice: 'De R$ 12.500 (-20%) por R$ 9.999/mês'
  },
  {
    name: 'Nexus Governança (Orion)',
    category: 'premium',
    description: 'Gestão de Conselhos, Governança Corporativa e Compliance',
    icon: Building2,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    tag: 'Board Intel',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-400',
    tagBorder: 'border-violet-500/15',
    startupPrice: 'R$ 150.000',
    monthlyPrice: 'De R$ 12.500 (-20%) por R$ 9.999/mês'
  },
  {
    name: 'Nexus Auditoria (Magadot)',
    category: 'premium',
    description: 'Auditoria de Estado, Rastreamento Financeiro e Filtro Pactum',
    icon: Shield,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    tag: 'Audit Intel',
    tagBg: 'bg-emerald-500/10',
    tagText: 'text-emerald-400',
    tagBorder: 'border-emerald-500/15',
    startupPrice: 'R$ 150.000',
    monthlyPrice: 'De R$ 12.500 (-20%) por R$ 9.999/mês'
  },

  // Empresas (B2B)
  {
    name: 'Nexus Vendas',
    category: 'empresas',
    description: 'Catálogo, Pedidos e Ordens de Produção integrados ao PPCP',
    icon: ShoppingBag,
    iconColor: 'text-[#00D4FF]',
    iconBg: 'bg-[#00D4FF]/10 border-[#00D4FF]/20',
    tag: 'B2B Vendas',
    tagBg: 'bg-[#00D4FF]/10',
    tagText: 'text-[#00D4FF]',
    tagBorder: 'border-[#00D4FF]/15',
    startupPrice: 'R$ 13.500',
    monthlyPrice: 'R$ 550/mês'
  },
  {
    name: 'Nexus Compras',
    category: 'empresas',
    description: 'IA de Intermediação e Auditoria Automática de Suprimentos',
    icon: ShoppingCart,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    tag: 'B2B Compras',
    tagBg: 'bg-blue-500/10',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/15',
    startupPrice: 'R$ 15.000',
    monthlyPrice: 'R$ 600/mês'
  },
  {
    name: 'Nexus Projetos',
    category: 'empresas',
    description: 'Engenharia e Orçamentos Técnicos Automatizados por IA',
    icon: Cpu,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    tag: 'B2B Projetos',
    tagBg: 'bg-cyan-500/10',
    tagText: 'text-cyan-400',
    tagBorder: 'border-cyan-500/15',
    startupPrice: 'R$ 18.000',
    monthlyPrice: 'R$ 750/mês'
  },
  {
    name: 'Nexus PPCP',
    category: 'empresas',
    description: 'Planejamento, Programação e Controle da Produção',
    icon: BarChart3,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'B2B PPCP',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/15',
    startupPrice: 'R$ 18.000',
    monthlyPrice: 'R$ 750/mês'
  },
  {
    name: 'Nexus Auditor',
    category: 'empresas',
    description: 'Auditoria Inteligente de Processos e Bloqueio de Desvios',
    icon: Shield,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    tag: 'B2B Auditor',
    tagBg: 'bg-emerald-500/10',
    tagText: 'text-emerald-400',
    tagBorder: 'border-emerald-500/15',
    startupPrice: 'R$ 13.500',
    monthlyPrice: 'R$ 550/mês'
  },
  {
    name: 'Nexus Cronoanálise',
    category: 'empresas',
    description: 'Cronometragem, Tempos Padrão e Medição de Eficiência por IA',
    icon: Timer,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    tag: 'B2B Tempos',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-400',
    tagBorder: 'border-violet-500/15',
    startupPrice: 'R$ 10.500',
    monthlyPrice: 'R$ 450/mês'
  },
  {
    name: 'Nexus Almoxarifado',
    category: 'empresas',
    description: 'Gestão Inteligente de Estoque, Entradas e Saídas em Real-Time',
    icon: Package,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/10 border-orange-500/20',
    tag: 'B2B Estoque',
    tagBg: 'bg-orange-500/10',
    tagText: 'text-orange-400',
    tagBorder: 'border-orange-500/15',
    startupPrice: 'R$ 10.500',
    monthlyPrice: 'R$ 450/mês'
  },
  {
    name: 'Nexus Expedição',
    category: 'empresas',
    description: 'Controle de Saídas de Carga, Romaneio e Logística de Entrega',
    icon: Truck,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    tag: 'B2B Logística',
    tagBg: 'bg-sky-500/10',
    tagText: 'text-sky-400',
    tagBorder: 'border-sky-500/15',
    startupPrice: 'R$ 10.500',
    monthlyPrice: 'R$ 450/mês'
  },
  {
    name: 'RH & Pessoas (Djeny RH)',
    category: 'empresas',
    description: 'Gestão de talentos e desenvolvimento com IA',
    icon: Users,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'HR Intel',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/15',
    startupPrice: 'R$ 10.500',
    monthlyPrice: 'R$ 450/mês'
  },
  {
    name: 'Estratégia & Liderança (Career Advisor)',
    category: 'empresas',
    description: 'Mentoria executiva e career advisor preditivo',
    icon: BrainCircuit,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    tag: 'Strategy',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-400',
    tagBorder: 'border-violet-500/15',
    startupPrice: 'R$ 21.000',
    monthlyPrice: 'R$ 850/mês'
  },
  {
    name: 'Engenharia de Processos',
    category: 'empresas',
    description: 'Banco de tempos auditados e planejamento de capacidade',
    icon: Database,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'Data Master',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/15',
    startupPrice: 'R$ 16.000',
    monthlyPrice: 'R$ 650/mês'
  },

  // Segmentos
  {
    name: 'Agronegócio (Dante Safra)',
    category: 'segmentos',
    description: 'Inteligência de safra e commodities em tempo real',
    icon: Wheat,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    tag: 'Agro Intel',
    tagBg: 'bg-emerald-500/10',
    tagText: 'text-emerald-400',
    tagBorder: 'border-emerald-500/15',
    startupPrice: 'R$ 1.499',
    monthlyPrice: 'R$ 149/mês'
  },

  {
    name: 'Nexus Studio',
    category: 'segmentos',
    description: 'Cockpit de broadcast e automação de rádio/mídia',
    icon: Activity,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    tag: 'Media',
    tagBg: 'bg-blue-500/10',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/15',
    startupPrice: 'R$ 1.499',
    monthlyPrice: 'R$ 199/mês'
  },
  {
    name: 'Nexus Health',
    category: 'segmentos',
    description: 'Monitoramento clínico e IA preventiva em saúde',
    icon: HeartPulse,
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/10 border-teal-500/20',
    tag: 'Health Intel',
    tagBg: 'bg-teal-500/10',
    tagText: 'text-teal-400',
    tagBorder: 'border-teal-500/15',
    startupPrice: 'Sem Startup 🔒',
    monthlyPrice: 'R$ 199/mês'
  },

  
  // Cursos (Preços Fixos)
  {
    name: 'Liderança Essencial: O Despertar do Gestor',
    category: 'cursos',
    description: 'O manual definitivo de transição do "operador" ao "líder"',
    icon: BookOpen,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    tag: 'Liderança',
    tagBg: 'bg-blue-500/10',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'Sem Recorrência'
  },
  {
    name: 'Liderança Estratégica Nexus (Leadership PRO)',
    category: 'cursos',
    description: 'Inteligência emocional, negociação e gestão executiva',
    icon: BookOpen,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10 border-primary/20',
    tag: 'Mais Vendido ⚡',
    tagBg: 'bg-primary/20',
    tagText: 'text-primary',
    tagBorder: 'border-primary/30',
    startupPrice: 'R$ 1.499',
    monthlyPrice: 'Sem Recorrência'
  },
  {
    name: 'Líder Treinador de Elite (Leader Coach)',
    category: 'cursos',
    description: 'Como construir equipes de alto desempenho autogerenciáveis',
    icon: BookOpen,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    tag: 'Leader Coach',
    tagBg: 'bg-emerald-500/10',
    tagText: 'text-emerald-400',
    tagBorder: 'border-emerald-500/15',
    startupPrice: 'R$ 2.249',
    monthlyPrice: 'Sem Recorrência'
  },
  {
    name: 'Alta Liderança Executiva (Executive Mastery)',
    category: 'cursos',
    description: 'Maturidade de governança, legado e cultura corporativa',
    icon: BookOpen,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    tag: 'Elite Selection 🏆',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-400',
    tagBorder: 'border-violet-500/15',
    startupPrice: 'R$ 2.999',
    monthlyPrice: 'Sem Recorrência'
  },

  // Sob Consulta (Consultoria e Palestras)
  {
    name: 'Consultoria Estratégica Nexus',
    category: 'consulta',
    description: 'Estruturação de operações por IA, automação e otimização PPCP',
    icon: TrendingUp,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    tag: 'Mentoria & IA',
    tagBg: 'bg-indigo-500/10',
    tagText: 'text-indigo-400',
    tagBorder: 'border-indigo-500/15',
    startupPrice: 'Sob Consulta 💬',
    monthlyPrice: 'Sob Consulta 💬'
  },
  {
    name: 'Palestras Dante & Djeny',
    category: 'consulta',
    description: 'Palestra corporativa imersiva conduzida pelos nossos mentores virtuais',
    icon: Mic,
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/20',
    tag: 'Imersão Nexus',
    tagBg: 'bg-pink-500/10',
    tagText: 'text-pink-400',
    tagBorder: 'border-pink-500/15',
    startupPrice: 'Sob Consulta 💬',
    monthlyPrice: 'Sob Consulta 💬'
  }
];

export default function PrecificacaoPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'todos' | 'empresas' | 'premium' | 'segmentos' | 'cursos' | 'consulta'>('todos');

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
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
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-4 relative">
      
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-prospector-bg.png"
          alt="Nexus Cabinet Background"
          fill
          priority
          className="object-cover opacity-35"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/70 to-[#020617]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <Link href="/gabinete" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors group cursor-pointer">
              <Shield className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold font-headline text-white">Catálogo de Precificação</h1>
              <p className="text-slate-400">Tabela de Preços e SLA Oficial Nexus Holding</p>
            </div>
          </div>
          <Link href="/gabinete" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            ← Voltar ao Command Center
          </Link>
        </div>

        {/* TABELA DE PREÇOS DO PORTFÓLIO NEXUS */}
        <div className="mt-16 border-t border-slate-800/80 pt-12 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider font-headline flex items-center gap-2">
                <Coins className="w-6 h-6 text-indigo-400 animate-pulse" />
                Portfólio de Soluções & Precificação GovTech
              </h2>
              <p className="text-sm text-slate-400">Valores de referência comercial para propostas e negociações municipais.</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
              Tabela Oficial Nexus Édge
            </span>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap gap-2 pb-2">
            {(['todos', 'premium', 'empresas', 'segmentos', 'cursos', 'consulta'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-900/40 border-slate-800 text-slate-450 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat === 'todos' ? 'Todos' : 
                 cat === 'premium' ? 'Sovereign Premium' : 
                 cat === 'empresas' ? 'Nexus B2B' : 
                 cat === 'segmentos' ? 'Segmentos' : 
                 cat === 'cursos' ? 'Cursos' : 'Consultoria'}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40 backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-4 px-6">Produto</th>
                  <th className="py-4 px-6">Status / Categoria</th>
                  <th className="py-4 px-6 text-right">Taxa Startup (Setup)</th>
                  <th className="py-4 px-6 text-right">Licenciamento Recorrente (SaaS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs">
                
                {priceItems
                  .filter((item) => activeCategory === 'todos' || item.category === activeCategory)
                  .map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10 transition-colors group">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                          <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                            {item.name}
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${item.tagBg} ${item.tagText} border ${item.tagBorder}`}>
                              {item.tag}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 leading-normal block max-w-md">{item.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900 text-slate-450 border border-slate-800 uppercase font-mono tracking-wider">
                          {item.category === 'premium' ? 'Premium 150k' : 
                           item.category === 'empresas' ? 'App B2B' : 
                           item.category === 'segmentos' ? 'Nicho' : 
                           item.category === 'cursos' ? 'Capacitação' : 'Serviço Premium'}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right font-bold ${
                        item.startupPrice.includes('🔒') ? 'text-slate-500/80 font-sans text-[10px]' : 'font-mono text-slate-300'
                      }`}>
                        {item.startupPrice}
                      </td>
                      <td className={`py-4 px-6 text-right font-bold ${
                        item.monthlyPrice.includes('🔒') ? 'text-slate-500/80 font-sans text-[10px]' : 'font-mono text-emerald-400'
                      }`}>
                        {item.monthlyPrice}
                      </td>
                    </tr>
                  ))}

              </tbody>
            </table>
          </div>

          <div className="mt-4 border-t border-slate-800/50 pt-4 text-right">
            <p className="text-[9px] text-slate-500 italic font-sans leading-normal">
              * Valores de referência baseados no Plano Prata corporativo (municípios de até 150.000 habitantes). Add-ons de infraestrutura dedicados faturados separadamente.
            </p>
          </div>

          {/* Cards de Justificativa do SLA Condicionais */}
          <div className="mt-12 mb-8">
            {activeCategory === 'premium' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-white mb-6 font-headline flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-400" />
                  O que o SLA Sovereign Premium garante?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                        <Zap className="w-6 h-6 text-emerald-400" />
                      </div>
                      <CardTitle className="text-lg text-white">Suporte Mission Critical 24/7</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Tempo de resposta <strong>inferior a 30 minutos</strong>. Acesso em tempo real e direto aos arquitetos e engenheiros de software da Nexus, garantindo máxima blindagem de disponibilidade.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                        <Database className="w-6 h-6 text-indigo-400" />
                      </div>
                      <CardTitle className="text-lg text-white">Evolução & Cyber-Segurança</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Instalação mensal de Patches de <strong>Segurança Cibernética</strong> e retreinamento contínuo dos Modelos de Inteligência Artificial On-Premise.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/60 border-slate-800 hover:border-rose-500/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center mb-2">
                        <Activity className="w-6 h-6 text-rose-400" />
                      </div>
                      <CardTitle className="text-lg text-white">Monitoramento de Anomalias (SOC)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Nossa equipe técnica detecta quedas de energia, gargalos de hardware ou anomalias no seu servidor <strong>antes mesmo do sistema travar</strong>. Nós cuidamos da sala de máquinas.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeCategory === 'empresas' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-white mb-6 font-headline flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#00D4FF]" />
                  Por que manter o SLA B2B Ativo?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-slate-900/60 border-slate-800 hover:border-[#00D4FF]/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-[#00D4FF]" />
                      </div>
                      <CardTitle className="text-lg text-white">Suporte Premium Corporativo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Atendimento em horário comercial com analistas dedicados à sua indústria. Resolução de dúvidas operacionais e acompanhamento do uso.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/60 border-slate-800 hover:border-amber-500/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                        <BarChart3 className="w-6 h-6 text-amber-400" />
                      </div>
                      <CardTitle className="text-lg text-white">Atualizações de Fluxo (PPCP)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Receba novas features, melhorias de velocidade e layouts otimizados para suas telas de produção sem custo adicional.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                        <Shield className="w-6 h-6 text-emerald-400" />
                      </div>
                      <CardTitle className="text-lg text-white">Backup & Estabilidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Garantia de que os dados da sua empresa (vendas, compras e produção) estarão protegidos contra corrupção e perdas.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeCategory === 'segmentos' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-white mb-6 font-headline flex items-center gap-2">
                  <Shield className="w-6 h-6 text-pink-400" />
                  SLA de Nicho (Segmentos Específicos)
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-slate-900/60 border-slate-800 hover:border-pink-500/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-2">
                        <BrainCircuit className="w-6 h-6 text-pink-400" />
                      </div>
                      <CardTitle className="text-lg text-white">IA Generativa Especializada</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Modelos refinados constantemente para a sua área, seja no Design, Agro ou Rádio, garantindo a entrega visual e preditiva de ponta.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-emerald-400" />
                      </div>
                      <CardTitle className="text-lg text-white">Comunidade e Suporte</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Troca de experiências e suporte direcionado para o seu nicho. Otimização das ferramentas com base no feedback real do seu segmento.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/60 border-slate-800 hover:border-teal-500/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-2">
                        <Activity className="w-6 h-6 text-teal-400" />
                      </div>
                      <CardTitle className="text-lg text-white">Alta Disponibilidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Seus sistemas segmentados no ar sem interrupções. Atendimento rápido para instabilidades ou dúvidas de integração.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {(activeCategory === 'cursos' || activeCategory === 'consulta' || activeCategory === 'todos') && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8 border-t border-slate-800/50 pt-8 text-center max-w-2xl mx-auto">
                <Shield className="w-8 h-8 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 font-headline">A Garantia Nexus</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Todos os nossos produtos e serviços seguem o rigoroso padrão de excelência da Nexus Holding Group. Selecione uma categoria (Premium, B2B ou Segmentos) acima para ver as condições específicas de SLA de software.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
