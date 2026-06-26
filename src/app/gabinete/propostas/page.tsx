"use client";

import React, { useState } from "react";
import { Search, Briefcase, ChevronDown, ChevronUp, CheckCircle2, DollarSign, Building2, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PricingTier = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  setup: string;
  mensalidade: string;
  features: string[];
};

type Proposal = {
  id: string;
  city: string; // Para empresas, isso será o nome do Cliente/Rede
  title: string;
  category?: 'municipios' | 'lojas' | 'empresas';
  tiers: PricingTier[];
};

const proposalsData: Proposal[] = [
  {
    id: "nova-petropolis",
    city: "Nova Petrópolis",
    title: "Embaixadora Digital de Turismo (Smart Tourism)",
    tiers: [
      {
        id: "np-tier-1",
        title: "Módulo 1: Embaixadora Digital",
        subtitle: "Apenas IA de Atendimento (Totem e WhatsApp)",
        color: "emerald",
        setup: "R$ 25.000",
        mensalidade: "R$ 8.000/mês",
        features: [
          "Totem com IA Avatar em Vídeo Livre (Expediente Inteligente).",
          "Embaixadora Virtual no Chat da prefeitura e WhatsApp 24/7.",
          "Integração Turismo: Rotas, Hotéis e Eventos (Poliglota).",
          "Transbordo para Atendimento Humano via WhatsApp."
        ]
      },
      {
        id: "np-tier-2",
        title: "Módulo 2: Plataforma ÉGIDE",
        subtitle: "Apenas Centro de Comando (CCO) e Nuvem",
        color: "blue",
        setup: "R$ 20.000",
        mensalidade: "R$ 5.000/mês",
        features: [
          "Implantação do Sistema ÉGIDE de Monitoramento Regional.",
          "Nuvem Privada Blindada (Soberania de Dados).",
          "Painel de Analytics e Relatórios de Inteligência Turística.",
          "Desburocratização: Integração de Leis de Alvarás e IPTU."
        ]
      },
      {
        id: "np-tier-3",
        title: "Plano Master: Embaixadora + ÉGIDE",
        subtitle: "O Pacote Completo de Smart City",
        color: "amber",
        setup: "R$ 35.000",
        mensalidade: "R$ 10.000/mês",
        features: [
          "Todos os Entregáveis do Módulo 1 (Avatar e Atendimento).",
          "Todos os Entregáveis do Módulo 2 (ÉGIDE e CCO).",
          "Sinergia Total: O Avatar interage com os dados do ÉGIDE.",
          "Desconto Especial de Integração já aplicado."
        ]
      }
    ]
  },
  {
    id: "granfpolis",
    city: "Consórcio Granfpolis",
    title: "Operação Granfpolis (Capital e Região Metropolitana)",
    tiers: [
      {
        id: "gf-tier-1",
        title: "Cenário A: Florianópolis Isolada",
        subtitle: "Contrato Exclusivo para a Capital",
        color: "blue",
        setup: "R$ 40.000",
        mensalidade: "R$ 20.000/mês",
        features: [
          "Totem com IA Avatar em Vídeo Livre (Ex: Aeroporto).",
          "Embaixadora Virtual no Chat da prefeitura e WhatsApp 24/7.",
          "Novo: UX Documentário c/ Transbordo para WhatsApp (Imagens Turísticas com Narração).",
          "Monetização Pública: O Totem roda anúncios de hotéis parceiros, fazendo o sistema se pagar sozinho.",
          "Plataforma ÉGIDE ativada exclusivamente para Florianópolis."
        ]
      },
      {
        id: "gf-tier-2",
        title: "Cenário B: Consórcio Metropolitano",
        subtitle: "O Negócio do Século (Floripa + 21 Cidades)",
        color: "emerald",
        setup: "Capital: 17.5k | Demais: 10k",
        mensalidade: "Capital: 10k/mês | Demais: 2k/mês",
        features: [
          "Justificativa de Valor: Florianópolis concentra ~588 mil habitantes (altíssimo volume de tráfego de IA), justificando o maior investimento. As outras 21 cidades diluem ~712 mil habitantes, barateando o custo por município.",
          "Totens com IA Avatar nas 22 cidades com UX de Transbordo (WhatsApp).",
          "Mídia Digital (Outdoor Inteligente): Prefeituras podem vender cotas de patrocínio nos Totens, gerando lucro.",
          "Muralha Digital ÉGIDE Metropolitana cruzando dados de toda a região.",
          "Venda a Jato: Valores das cidades menores (10k/2k) enquadram em dispensa de licitação."
        ]
      }
    ]
  },
  {
    id: "passo-fundo",
    city: "Passo Fundo",
    title: "Central de Triagem ÉGIDE (Segurança Pública)",
    tiers: [
      {
        id: "pf-tier-1",
        title: "Módulo 1: IA de Triagem (Atendimento)",
        subtitle: "Filtro Neural via WhatsApp Oficial",
        color: "emerald",
        setup: "R$ 15.000",
        mensalidade: "R$ 6.000/mês",
        features: [
          "Agente Virtual no WhatsApp para receber denúncias 24/7.",
          "Filtro neural automático contra trotes e linguagem inadequada.",
          "Extração tática de dados: Geolocalização, placas e fotos.",
          "Desafogamento do telefone 153 da Guarda Municipal."
        ]
      },
      {
        id: "pf-tier-2",
        title: "Módulo 2: Plataforma ÉGIDE",
        subtitle: "Apenas o CCO (Centro de Controle)",
        color: "blue",
        setup: "R$ 25.000",
        mensalidade: "R$ 8.000/mês",
        features: [
          "Instalação da plataforma ÉGIDE para o Comando.",
          "Nuvem Privada Blindada (Sigilo absoluto das fontes).",
          "Painel tático plotando manchas criminais no mapa em tempo real.",
          "Analytics e BI de Segurança Pública."
        ]
      },
      {
        id: "pf-tier-3",
        title: "Plano Master: IA Triagem + ÉGIDE",
        subtitle: "Integração Total com o CCO",
        color: "amber",
        setup: "R$ 35.000",
        mensalidade: "R$ 10.000/mês",
        features: [
          "Todos os Entregáveis do Módulo 1 (Filtro de Trotes).",
          "Todos os Entregáveis do Módulo 2 (ÉGIDE CCO).",
          "Sinergia Total: A IA envia a ocorrência já formatada direto para a tela do rádio-operador.",
          "Desconto Especial de Integração já aplicado."
        ]
      }
    ]
  },
  {
    id: "soledade",
    city: "Soledade",
    title: "Embaixadora Sol (Capital das Pedras Preciosas)",
    tiers: [
      {
        id: "sol-tier-1",
        title: "Módulo 1: Embaixadora Digital (Sol)",
        subtitle: "Comércio, Turismo e Balcão Cidadão",
        color: "emerald",
        setup: "R$ 15.000",
        mensalidade: "R$ 5.000/mês",
        features: [
          "Embaixadora Sol no Chat da prefeitura e WhatsApp 24/7.",
          "Turismo Integrado: Rotas de compras e gemologia.",
          "Transbordo para Atendimento Humano via WhatsApp.",
          "Mídia Digital: Prefeituras podem vender patrocínios do comércio local no sistema."
        ]
      },
      {
        id: "sol-tier-2",
        title: "Módulo 2: Plataforma ÉGIDE",
        subtitle: "Monitoramento e Inteligência Regional",
        color: "blue",
        setup: "R$ 20.000",
        mensalidade: "R$ 6.000/mês",
        features: [
          "Implantação do Sistema ÉGIDE de Monitoramento.",
          "Nuvem Privada Blindada (Soberania de Dados).",
          "Desburocratização: Integração de Leis de Alvarás para comércios.",
          "Painel de Analytics da prefeitura."
        ]
      },
      {
        id: "sol-tier-3",
        title: "Plano Master: Sol + ÉGIDE",
        subtitle: "A Verdadeira Smart City (Combo)",
        color: "amber",
        setup: "R$ 30.000",
        mensalidade: "R$ 8.000/mês",
        features: [
          "Todos os Entregáveis do Módulo 1 (Sol).",
          "Todos os Entregáveis do Módulo 2 (ÉGIDE).",
          "Experiência Cidadã Completa (Turismo + Segurança + Alvarás).",
          "Desconto de R$ 5.000 no Setup e R$ 3.000 na Mensalidade."
        ]
      }
    ]
  },
  {
    id: "gramado",
    city: "Gramado",
    title: "IA Guia Oficial e Smart Tourism",
    tiers: [
      {
        id: "gra-tier-1",
        title: "Módulo 1: IA Embaixadora",
        subtitle: "Turismo e Eventos Poliglota",
        color: "emerald",
        setup: "R$ 15.000",
        mensalidade: "R$ 6.000/mês",
        features: [
          "Atendimento Poliglota no WhatsApp (Inglês, Espanhol, Francês).",
          "Guia Oficial para Natal Luz, Festival de Cinema e Rotas.",
          "Transbordo para rede hoteleira parceira.",
          "Monetização: Venda de cotas publicitárias nos totens."
        ]
      },
      {
        id: "gra-tier-2",
        title: "Módulo 2: Desburocratização",
        subtitle: "Balcão do Empreendedor",
        color: "blue",
        setup: "R$ 20.000",
        mensalidade: "R$ 7.000/mês",
        features: [
          "Muralha de Desburocratização para Comércio e Hotelaria.",
          "Emissão de guias, IPTU e Alvarás 100% via IA.",
          "Redução drástica de filas na Prefeitura.",
          "Dashboard de Analytics Econômico."
        ]
      },
      {
        id: "gra-tier-3",
        title: "Plano Master: Smart Tourism 360",
        subtitle: "A Maior Potência Turística do Brasil",
        color: "amber",
        setup: "R$ 30.000",
        mensalidade: "R$ 10.000/mês",
        features: [
          "Todos os Entregáveis do Módulo 1 (Turismo Premium).",
          "Todos os Entregáveis do Módulo 2 (Desburocratização).",
          "Ecossistema integrado: O Turista e o Cidadão na mesma plataforma.",
          "Projeto auto-sustentável financeiramente via Mídia Digital."
        ]
      }
    ]
  },
  {
    id: "canela",
    city: "Canela",
    title: "Embaixadora Digital (Sinergia Serra)",
    tiers: [
      {
        id: "can-tier-1",
        title: "Módulo 1: IA Guia",
        subtitle: "Turismo e Parques (Custo Zero)",
        color: "emerald",
        setup: "R$ 15.000",
        mensalidade: "R$ 5.000/mês",
        features: [
          "Guia Poliglota para Parques (Cascata do Caracol, Catedral).",
          "Atendimento via Totens e WhatsApp.",
          "Monetização de Mídia Digital (Totens pagam a mensalidade).",
          "Integração rápida e sem atritos."
        ]
      },
      {
        id: "can-tier-2",
        title: "Módulo 2: Balcão Cidadão",
        subtitle: "Serviços Públicos Inteligentes",
        color: "blue",
        setup: "R$ 18.000",
        mensalidade: "R$ 6.000/mês",
        features: [
          "Automação do atendimento cidadão via IA.",
          "Geração de relatórios de queixas urbanas e alvarás.",
          "Desafogamento dos guichês da Prefeitura.",
          "Nuvem Privada e segura."
        ]
      },
      {
        id: "can-tier-3",
        title: "Plano Master: Canela Smart",
        subtitle: "Inovação Pioneira na Serra",
        color: "amber",
        setup: "R$ 25.000",
        mensalidade: "R$ 8.000/mês",
        features: [
          "Combo Turismo e Cidadão unificados.",
          "Soberania de Dados para a Gestão de Canela.",
          "A frente tecnológica contra as IAs ultrapassadas de mercado.",
          "Desconto de R$ 3.000 na Mensalidade do Combo."
        ]
      }
    ]
  },
  {
    id: "torres",
    city: "Torres",
    title: "Ordenamento Litoral e Triagem de Verão",
    tiers: [
      {
        id: "tor-tier-1",
        title: "Módulo 1: IA Verão",
        subtitle: "Desafogamento da Temporada",
        color: "emerald",
        setup: "R$ 15.000",
        mensalidade: "R$ 5.000/mês",
        features: [
          "Triagem de demandas de milhares de veranistas simultâneos.",
          "Guia turístico (Balonismo, Ilha dos Lobos).",
          "Monetização em Totens no Calçadão e Parque.",
          "Atendimento Bilíngue (Espanhol para Mercosul)."
        ]
      },
      {
        id: "tor-tier-2",
        title: "Módulo 2: ÉGIDE Orla",
        subtitle: "Monitoramento e Segurança",
        color: "blue",
        setup: "R$ 20.000",
        mensalidade: "R$ 6.000/mês",
        features: [
          "Integração de Segurança Pública (CCO).",
          "Triagem e Filtro Neural de trotes (Perturbação de Sossego).",
          "Plota ocorrências no mapa tático em tempo real.",
          "Apoio crucial à Guarda na alta temporada."
        ]
      },
      {
        id: "tor-tier-3",
        title: "Plano Master: O Verão Perfeito",
        subtitle: "IA Verão + ÉGIDE",
        color: "amber",
        setup: "R$ 30.000",
        mensalidade: "R$ 9.000/mês",
        features: [
          "Ecossistema blindado para suportar o pico populacional.",
          "Turismo que gera renda e Segurança que funciona.",
          "Retorno sobre Investimento via Mídia Pública.",
          "Valor especial de Combo."
        ]
      }
    ]
  },
  {
    id: "capao",
    city: "Capão da Canoa",
    title: "Balcão Cidadão Digital (Litoral Norte)",
    tiers: [
      {
        id: "cap-tier-1",
        title: "Módulo 1: IA Balcão Cidadão",
        subtitle: "Desburocratização de Alvarás e IPTU",
        color: "emerald",
        setup: "R$ 15.000",
        mensalidade: "R$ 5.000/mês",
        features: [
          "Emissão de guias de IPTU e Alvarás Temporários via Chat.",
          "Fim das filas no centro administrativo no verão.",
          "Guia Turístico Integrado nos totens beira-mar.",
          "Receita via patrocínio de Imobiliárias locais."
        ]
      },
      {
        id: "cap-tier-2",
        title: "Módulo 2: ÉGIDE",
        subtitle: "Filtro Tático e Inteligência",
        color: "blue",
        setup: "R$ 20.000",
        mensalidade: "R$ 6.000/mês",
        features: [
          "Filtro autônomo contra trotes (WhatsApp Segurança).",
          "Repasse mastigado de ocorrências para viaturas.",
          "Nuvem Privada com Soberania de Dados.",
          "Analytics do mapa de calor de infrações."
        ]
      },
      {
        id: "cap-tier-3",
        title: "Plano Master: Smart Coast",
        subtitle: "Integração Gestão e Segurança",
        color: "amber",
        setup: "R$ 30.000",
        mensalidade: "R$ 9.000/mês",
        features: [
          "Módulo 1 (Balcão/Turismo) + Módulo 2 (Segurança ÉGIDE).",
          "O maior pacote tecnológico do Litoral Gaúcho.",
          "Solução definitiva para a explosão demográfica de verão.",
          "Desconto de adesão integrada."
        ]
      }
    ]
  },
  {
    id: "bc",
    city: "Balneário Camboriú",
    title: "IA de Luxo para a Dubai Brasileira",
    tiers: [
      {
        id: "bc-tier-1",
        title: "Módulo 1: Embaixadora Premium",
        subtitle: "Turismo e Real Estate Internacional",
        color: "emerald",
        setup: "R$ 20.000",
        mensalidade: "R$ 8.000/mês",
        features: [
          "Embaixadora Poliglota (Inglês, Espanhol, Mandarim).",
          "Totens de Luxo na Avenida Atlântica (Mina de Ouro).",
          "Cotas de Mídia vendidas a Construtoras e Shoppings.",
          "Experiência imersiva VIP para o Turista."
        ]
      },
      {
        id: "bc-tier-2",
        title: "Módulo 2: ÉGIDE BC",
        subtitle: "Monitoramento Urbano de Alto Padrão",
        color: "blue",
        setup: "R$ 25.000",
        mensalidade: "R$ 10.000/mês",
        features: [
          "Inteligência acoplada à Guarda Municipal.",
          "Triagem de denúncias de Postura Urbana via WhatsApp.",
          "Integração nativa com CCOs modernos.",
          "Dashboards analíticos de segurança pública."
        ]
      },
      {
        id: "bc-tier-3",
        title: "Plano Master: O Ápice Tecnológico",
        subtitle: "Turismo + Segurança Integrada",
        color: "amber",
        setup: "R$ 40.000",
        mensalidade: "R$ 15.000/mês",
        features: [
          "A plataforma de IA mais avançada da América Latina.",
          "Todos os Entregáveis do Módulo 1 e 2.",
          "Retorno Financeiro brutal com a venda de espaços DOOH (Outdoor Digital).",
          "Condições exclusivas para a capital do turismo catarinense."
        ]
      }
    ]
  },
  {
    id: "foz",
    city: "Foz do Iguaçu",
    title: "Central Poliglota (Tríplice Fronteira)",
    tiers: [
      {
        id: "foz-tier-1",
        title: "Módulo 1: IA Poliglota Nativa",
        subtitle: "Fronteira, Cataratas e Aduanas",
        color: "emerald",
        setup: "R$ 18.000",
        mensalidade: "R$ 7.000/mês",
        features: [
          "Comunicação fluente: Espanhol, Inglês, Mandarim, Francês.",
          "Guia definitivo: Itaipu, Cataratas, Compras no Paraguai.",
          "Monetização em totens no Aeroporto e Aduanas (Duty Frees).",
          "Atendimento escalável e instantâneo."
        ]
      },
      {
        id: "foz-tier-2",
        title: "Módulo 2: ÉGIDE Fronteira",
        subtitle: "Soberania e Defesa de Dados",
        color: "blue",
        setup: "R$ 25.000",
        mensalidade: "R$ 9.000/mês",
        features: [
          "Arquitetura de Nuvem Privada Blindada.",
          "Módulo focado no cruzamento de dados sem ferir LGPD.",
          "Filtro tático de chamados turísticos/segurança.",
          "Painel de Analytics global de fluxo."
        ]
      },
      {
        id: "foz-tier-3",
        title: "Plano Master: IA + ÉGIDE",
        subtitle: "O Futuro do Destino Turístico",
        color: "amber",
        setup: "R$ 35.000",
        mensalidade: "R$ 12.000/mês",
        features: [
          "Domínio completo do ecossistema de atendimento.",
          "A tecnologia paga por si mesma rapidamente via Mídia Turística.",
          "Padrão Governo Federal (Soberania de Dados).",
          "Sinergia completa (Módulo 1 + Módulo 2)."
        ]
      }
    ]
  },
  {
    id: "inova-moda-360",
    city: "Grandes Redes de Varejo (InovaModa)",
    title: "InovaModa 360º - Virtual Try-On Neural",
    category: 'lojas',
    tiers: [
      {
        id: "inm-tier-1",
        title: "Plano Base (1 GPU)",
        subtitle: "Média de até 8.000 acessos/dia",
        color: "emerald",
        setup: "R$ 100.000",
        mensalidade: "R$ 15.000/mês",
        features: [
          "Criação de Avatar 3D Neural a partir de vídeo.",
          "Provador Virtual com caimento de tecido em tempo real.",
          "Faturamento ético baseado na MÉDIA mensal (perdoa picos).",
          "Integração nativa com o E-commerce da Rede.",
          "Selo LGPD 100%: Exclusão automática de vídeos ao fechar o app/site."
        ]
      },
      {
        id: "inm-tier-2",
        title: "Plano Pro (2 GPUs)",
        subtitle: "Média de até 15.000 acessos/dia",
        color: "blue",
        setup: "R$ 100.000",
        mensalidade: "R$ 20.000/mês",
        features: [
          "Todos os entregáveis do Plano Base.",
          "Poder de processamento duplicado para suportar alta tração.",
          "Faturamento pela MÉDIA protege a loja contra taxas abusivas.",
          "Painel analítico de conversão de vendas via Provador 3D."
        ]
      },
      {
        id: "inm-tier-3",
        title: "Plano Enterprise (3+ GPUs)",
        subtitle: "Média acima de 15.000 acessos/dia",
        color: "amber",
        setup: "R$ 100.000",
        mensalidade: "R$ 25.000/mês",
        features: [
          "Escalonamento dinâmico e ilimitado de tráfego (Auto-Scale).",
          "Custo fixo travado em 25k independente de picos virais.",
          "Blindagem absoluta contra quedas em Black Fridays.",
          "Customização avançada de texturas (Gloss, Metalic, Silk)."
        ]
      }
    ]
  },
  {
    id: "nexus-industria",
    city: "Nexus Indústria (Genérico)",
    title: "Plataforma B2B PPCP & Chão de Fábrica",
    category: 'empresas',
    tiers: [
      {
        id: "ind-tier-1",
        title: "Módulo Vendas B2B",
        subtitle: "Apenas Catálogo e Pedidos",
        color: "emerald",
        setup: "R$ 13.500",
        mensalidade: "R$ 550/mês",
        features: [
          "Portal B2B para Representantes.",
          "Integração de Catálogo de Produtos.",
          "Emissão automática de Ordens de Produção."
        ]
      },
      {
        id: "ind-tier-2",
        title: "Plataforma Completa (Vendas + PPCP)",
        subtitle: "Digitalização Total",
        color: "amber",
        setup: "R$ 35.000",
        mensalidade: "R$ 1.500/mês",
        features: [
          "Portal de Vendas B2B Inteligente.",
          "Módulo PPCP (Planejamento de Produção).",
          "Auditoria, Cronoanálise e Almoxarifado Integrados.",
          "Dashboards de eficiência fabril."
        ]
      }
    ]
  }
];

export default function PropostasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<'municipios' | 'lojas' | 'empresas'>('municipios');
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});

  const toggleTier = (tierId: string) => {
    setExpandedTiers(prev => ({
      ...prev,
      [tierId]: !prev[tierId]
    }));
  };

  const filteredProposals = proposalsData.filter(p => {
    const cat = p.category || 'municipios';
    const matchesCat = cat === activeCategory;
    const matchesSearch = p.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-200 pt-24 pb-20 px-4 relative">
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/80 to-[#020617]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/gabinete" className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-2 mb-4">
              &larr; Voltar ao Gabinete
            </Link>
            <h1 className="text-4xl font-bold font-headline text-white flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-rose-500" />
              Propostas Comerciais
            </h1>
            <p className="text-slate-400 mt-2">Módulo de Ancoragem e Precificação Estratégica.</p>
          </div>

          <div className="w-full md:w-96 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar município ou projeto..."
              className="w-full bg-slate-900/50 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-full py-3 pl-12 pr-4 text-white outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categoria Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(['municipios', 'lojas', 'empresas'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-2 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                activeCategory === cat
                  ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                  : 'bg-slate-900/40 border-slate-800 text-slate-450 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat === 'municipios' ? 'Municípios (GovTech)' : 
               cat === 'lojas' ? 'Varejo (Lojas/InovaModa)' : 
               'Indústria (B2B)'}
            </button>
          ))}
        </div>

        {/* Propostas List */}
        <div className="space-y-12">
          {filteredProposals.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-slate-800 border-dashed">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhuma proposta encontrada</h3>
              <p className="text-slate-400">Tente buscar por outro município ou termo.</p>
            </div>
          ) : (
            filteredProposals.map((proposal) => (
              <div key={proposal.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800/80">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-headline text-white">{proposal.city}</h2>
                    <p className="text-slate-400 font-medium">{proposal.title}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {proposal.tiers.map((tier) => {
                    const isExpanded = expandedTiers[tier.id];
                    const colorClasses = {
                      emerald: "border-emerald-500/30 hover:border-emerald-500 text-emerald-400 bg-emerald-500/10",
                      blue: "border-blue-500/30 hover:border-blue-500 text-blue-400 bg-blue-500/10",
                      amber: "border-amber-500/30 hover:border-amber-500 text-amber-400 bg-amber-500/10",
                      rose: "border-rose-500/30 hover:border-rose-500 text-rose-400 bg-rose-500/10",
                    }[tier.color] || "";

                    const textColor = {
                      emerald: "text-emerald-400",
                      blue: "text-blue-400",
                      amber: "text-amber-400",
                      rose: "text-rose-400",
                    }[tier.color] || "text-white";

                    return (
                      <div key={tier.id} className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden transition-colors hover:border-slate-500 flex flex-col">
                        <button 
                          onClick={() => toggleTier(tier.id)}
                          className="w-full flex justify-between items-center p-5 bg-slate-800/60 hover:bg-slate-800 text-left h-24"
                        >
                          <div>
                            <h4 className={`${textColor} font-bold text-sm uppercase tracking-wider`}>{tier.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1">{tier.subtitle}</p>
                          </div>
                          {isExpanded ? <ChevronUp className={`w-5 h-5 ${textColor}`} /> : <ChevronDown className={`w-5 h-5 ${textColor}`} />}
                        </button>
                        
                        {isExpanded && (
                          <div className="p-6 border-t border-slate-700/50 animate-in slide-in-from-top-2 duration-300 flex-1 flex flex-col">
                            {/* Preços */}
                            <div className="mb-6 pb-6 border-b border-slate-700/50">
                              <div className="mb-4">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Setup / Implantação</p>
                                <p className={`text-xl font-mono font-bold ${textColor}`}>{tier.setup}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Mensalidade (SaaS)</p>
                                <p className={`text-xl font-mono font-bold ${textColor}`}>{tier.mensalidade}</p>
                              </div>
                            </div>

                            {/* Entregáveis */}
                            <div className="flex-1">
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">O que está incluso:</p>
                              <div className="space-y-3">
                                {tier.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${textColor}`} />
                                    <span className="text-xs text-slate-300 leading-snug">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
