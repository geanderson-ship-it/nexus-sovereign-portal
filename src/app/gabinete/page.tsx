'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Search, Lock, MapPin, Coins, Zap, Wheat, Paintbrush, Building2, Users, BrainCircuit, Database, Activity, HeartPulse, BookOpen, TrendingUp, Mic, ShoppingBag, ShoppingCart, Cpu, BarChart3, Timer, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PriceItem {
  name: string;
  category: 'apps' | 'cursos' | 'consulta';
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
  // Apps de Inteligência
  {
    name: 'Nexus Intelligence Égide',
    category: 'apps',
    description: 'Cerco Eletrônico, LPR, Aegis Biometria & Dante\'s Safe',
    icon: Shield,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    tag: 'Elite GovTech',
    tagBg: 'bg-red-400/10',
    tagText: 'text-red-400',
    tagBorder: 'border-red-500/15',
    startupPrice: 'R$ 75.000',
    monthlyPrice: 'R$ 18.500/mês'
  },
  {
    name: 'Agronegócio (Dante Safra)',
    category: 'apps',
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
    name: 'Design & Interiores (Djeny Design)',
    category: 'apps',
    description: 'IA generativa para ambientação e identidade visual',
    icon: Paintbrush,
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/20',
    tag: 'Design',
    tagBg: 'bg-pink-500/10',
    tagText: 'text-pink-400',
    tagBorder: 'border-pink-500/15',
    startupPrice: 'R$ 1.499',
    monthlyPrice: 'R$ 149/mês'
  },
  {
    name: 'Nexus Vendas',
    category: 'apps',
    description: 'Catálogo, Pedidos e Ordens de Produção integrados ao PPCP',
    icon: ShoppingBag,
    iconColor: 'text-[#00D4FF]',
    iconBg: 'bg-[#00D4FF]/10 border-[#00D4FF]/20',
    tag: 'B2B Vendas',
    tagBg: 'bg-[#00D4FF]/10',
    tagText: 'text-[#00D4FF]',
    tagBorder: 'border-[#00D4FF]/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'Nexus Compras',
    category: 'apps',
    description: 'IA de Intermediação e Auditoria Automática de Suprimentos',
    icon: ShoppingCart,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    tag: 'B2B Compras',
    tagBg: 'bg-blue-500/10',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'Nexus Projetos',
    category: 'apps',
    description: 'Engenharia e Orçamentos Técnicos Automatizados por IA',
    icon: Cpu,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    tag: 'B2B Projetos',
    tagBg: 'bg-cyan-500/10',
    tagText: 'text-cyan-400',
    tagBorder: 'border-cyan-500/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'Nexus PPCP',
    category: 'apps',
    description: 'Planejamento, Programação e Controle da Produção',
    icon: BarChart3,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'B2B PPCP',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'Nexus Auditor',
    category: 'apps',
    description: 'Auditoria Inteligente de Processos e Bloqueio de Desvios',
    icon: Shield,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    tag: 'B2B Auditor',
    tagBg: 'bg-emerald-500/10',
    tagText: 'text-emerald-400',
    tagBorder: 'border-emerald-500/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'Nexus Cronoanálise',
    category: 'apps',
    description: 'Cronometragem, Tempos Padrão e Medição de Eficiência por IA',
    icon: Timer,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    tag: 'B2B Tempos',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-400',
    tagBorder: 'border-violet-500/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'Nexus Almoxarifado',
    category: 'apps',
    description: 'Gestão Inteligente de Estoque, Entradas e Saídas em Real-Time',
    icon: Package,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/10 border-orange-500/20',
    tag: 'B2B Estoque',
    tagBg: 'bg-orange-500/10',
    tagText: 'text-orange-400',
    tagBorder: 'border-orange-500/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'Nexus Expedição',
    category: 'apps',
    description: 'Controle de Saídas de Carga, Romaneio e Logística de Entrega',
    icon: Truck,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    tag: 'B2B Logística',
    tagBg: 'bg-sky-500/10',
    tagText: 'text-sky-400',
    tagBorder: 'border-sky-500/15',
    startupPrice: 'R$ 999',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'RH & Pessoas (Djeny RH)',
    category: 'apps',
    description: 'Gestão de talentos e desenvolvimento com IA',
    icon: Users,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'HR Intel',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/15',
    startupPrice: 'R$ 1.499',
    monthlyPrice: 'R$ 149/mês'
  },
  {
    name: 'Estratégia & Liderança (Career Advisor)',
    category: 'apps',
    description: 'Mentoria executiva e career advisor preditivo',
    icon: BrainCircuit,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    tag: 'Strategy',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-400',
    tagBorder: 'border-violet-500/15',
    startupPrice: 'R$ 1.499',
    monthlyPrice: 'R$ 149/mês'
  },
  {
    name: 'Nexus Pactum',
    category: 'apps',
    description: 'Deal war room e detecção biométrica de blefes',
    icon: Shield,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    tag: 'Contracts',
    tagBg: 'bg-blue-500/10',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/15',
    startupPrice: 'R$ 50.000',
    monthlyPrice: 'R$ 1.999/mês'
  },
  {
    name: 'Engenharia de Processos',
    category: 'apps',
    description: 'Banco de tempos auditados e planejamento de capacidade',
    icon: Database,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'Data Master',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/15',
    startupPrice: 'R$ 1.499',
    monthlyPrice: 'R$ 149/mês'
  },
  {
    name: 'Nexus Studio',
    category: 'apps',
    description: 'Cockpit de broadcast e automação de rádio/mídia',
    icon: Activity,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    tag: 'Media',
    tagBg: 'bg-blue-500/10',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/15',
    startupPrice: 'R$ 799',
    monthlyPrice: 'R$ 99/mês'
  },
  {
    name: 'Nexus Health',
    category: 'apps',
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
  {
    name: 'Nexus Impacto (Social)',
    category: 'apps',
    description: 'Gestão de asilos, métricas do Projeto Inteligência com Alma',
    icon: HeartPulse,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    tag: 'Social Intel',
    tagBg: 'bg-rose-500/10',
    tagText: 'text-rose-400',
    tagBorder: 'border-rose-500/15',
    startupPrice: 'Gratuito 🤍',
    monthlyPrice: 'Módulo Interno'
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

export default function GabinetePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'todos' | 'apps' | 'cursos' | 'consulta'>('todos');

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
    <div className="min-h-screen text-slate-200 py-20 px-4 relative">
      
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
        <div className="flex items-center gap-4 mb-12 border-b border-slate-800 pb-8">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline text-white">Gabinete Nexus</h1>
            <p className="text-slate-400">Área de Controle e Inteligência Estratégica (Nível Diretoria)</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Prospector IBGE */}
          <Link href="/gabinete/prospector">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-primary/50 transition-colors cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">Prospector IBGE</CardTitle>
                <CardDescription>Mapeamento de Cidades do Futuro</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Integração direta com o banco de dados do IBGE para mapear municípios-alvo com base em filtros geográficos e indicadores sociais.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500">
                  Acessar Ferramenta <MapPin className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          {/* Espaço para futuras ferramentas do Gabinete */}
          <Link href="/gabinete/agenda">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">Agenda Estratégica</CardTitle>
                <CardDescription>Painel de Controle de Reuniões</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Organize suas visitas, gerencie os anfitriões e defina a estratégia de ataque (Assunto e Observações) para cada prefeitura.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-500">
                  Acessar Ferramenta <MapPin className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Central de Leads do Site */}
          <Link href="/gabinete/leads">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-indigo-400 transition-colors">Contatos & Leads</CardTitle>
                <CardDescription>Gerenciador de Oportunidades</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Monitore em tempo real as pessoas que preencheram o formulário no portal da Nexus. Nunca perca um contato devido a popups bloqueados.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
                  Gerenciar Oportunidades <Users className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
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
            {(['todos', 'apps', 'cursos', 'consulta'] as const).map((cat) => (
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
                {cat === 'todos' ? 'Todos' : cat === 'apps' ? 'Apps de Inteligência' : cat === 'cursos' ? 'Cursos' : 'Consultoria & Palestras (Sob Consulta)'}
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
                          {item.category === 'apps' ? 'App IA' : item.category === 'cursos' ? 'Capacitação' : 'Serviço Premium'}
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

          <p className="text-[9px] text-slate-500 italic text-right font-sans leading-normal">
            * Valores de referência baseados no Plano Prata corporativo (municípios de até 150.000 habitantes). Add-ons de infraestrutura dedicados faturados separadamente.
          </p>
        </div>
      </div>
    </div>
  );
}
