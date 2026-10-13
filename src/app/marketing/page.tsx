'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hotel, 
  Palmtree, 
  Megaphone, 
  Languages, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  MessageSquare, 
  Compass,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Building2,
  Palette,
  Tv,
  Radio,
  Store
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { getVideoUrl } from '@/lib/video-helper';
import { cn } from '@/lib/utils';

const WHATSAPP_URL = 'https://wa.me/5551999799582';

interface FeatureItem {
  title: string;
  description: string;
  image: string;
}

interface ModuleData {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  icon: any;
  color: 'orange' | 'emerald' | 'cyan' | 'violet' | 'rose';
  features: FeatureItem[];
  image: string;
  licenca: string;
  suporte: string;
  roi: string;
  frozen?: boolean;
}

interface PillarData {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: 'orange' | 'emerald' | 'cyan' | 'violet' | 'rose';
  tagline: string;
  description: string;
  video?: string;
  image?: string;
  modules: ModuleData[];
}

// Módulos específicos para Hotéis e Pousadas
const hoteisPousadasModules: ModuleData[] = [
  {
    id: 'hp_concierge',
    badge: 'HOSPITALITY_AI',
    title: 'Helena',
    highlight: 'CONCIERGE VIRTUAL',
    subtitle: 'Atendimento e Recepção Digital 24/7',
    description: 'Sua recepção nunca dorme. A Helena acolhe seus hóspedes de forma imediata e autônoma, respondendo sobre horários de café da manhã, regras de hospedagem, voltagem das tomadas, política de pets, senha do Wi-Fi e estacionamento. Reduz drasticamente o volume de contatos repetitivos e libera sua recepção física para focar em check-ins presenciais complexos.',
    icon: Hotel,
    color: 'orange',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Reduz os custos operacionais de recepção e atendimento ao cliente em até 35%.',
    features: [
      {
        title: 'Recepção Autônoma Poliglota',
        description: 'Atendimento inteligente e natural com sotaque nativo em mais de 50 idiomas para hóspedes internacionais.',
        image: '/recepcao_poliglota.jpg'
      },
      {
        title: 'Check-in & Check-out Express',
        description: 'Envio automático de instruções de entrada, chaves digitais e links de fichas cadastrais FNRH para o WhatsApp.',
        image: '/checkin_express.jpg'
      },
      {
        title: 'Tira-Dúvidas Instantâneo',
        description: 'Respostas inmediatas em menos de 5 segundos no WhatsApp e Web sobre Wi-Fi, horários, voltagem e políticas.',
        image: '/tira_duvidas.jpg'
      },
      {
        title: 'Integração PMS de Sistemas',
        description: 'Conexão direta com sistemas de gestão hoteleira (Desbravador, Totvs, Hospedin) para sincronia de dados.',
        image: '/integracao_pms.jpg'
      }
    ]
  },
  {
    id: 'hp_guialocal',
    badge: 'LOCAL_GUIDE_AI',
    title: 'Helena',
    highlight: 'GUIA TURÍSTICO DIGITAL',
    subtitle: 'Roteiros, Dicas Locais e Experiências',
    description: 'Entregue o verdadeiro segredo local. A inteligência atua como um guia experiente, recomendando praias ideais por horário, trilhas de aventura, monumentos históricos, pontos turísticos e roteiros sob medida de acordo com o perfil do hóspede. Melhora radicalmente a experiência do visitante e fideliza clientes.',
    icon: Compass,
    color: 'orange',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Gera receitas adicionais fechando parcerias de comissão cruzada com guias e restaurantes.',
    features: [
      {
        title: 'Curadoria Turística de Elite',
        description: 'Indicação inteligente de passeios turísticos, trilhas e segredos locais baseando-se no perfil do hóspede.',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Recomendações Gastronômicas',
        description: 'IA indica restaurantes, bares e cafés parceiros da pousada, com envio direto de cardápios e reservas.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Rotas Integradas ao GPS',
        description: 'Envio automático de caminhos prontos e traçados para Google Maps e Waze diretamente no WhatsApp.',
        image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Agenda de Eventos Locais',
        description: 'Painel com previsão do tempo e cronograma de shows, festivais e feiras na região durante a estadia.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'hp_reservas',
    badge: 'BOOKING_INTELLIGENCE',
    title: 'Helena',
    highlight: 'RESERVAS INTELIGENTES',
    subtitle: 'Cotação de Pacotes e Vendas Diretas',
    description: 'A máquina de vendas diretas que o seu hotel precisa. O visitante insere o período e número de pessoas por WhatsApp ou site, a IA calcula as tarifas flutuantes e apresenta os quartos disponíveis em segundos. Ela faz o checkout imediato via Pix ou link de cartão e resgata orçamentos abandonados de forma proativa.',
    icon: Calendar,
    color: 'orange',
    image: '/marketing-assets/hp_reservas_main.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Zera as comissões abusivas de 15% a 22% cobradas por OTAs (Booking, Expedia).',
    features: [
      {
        title: 'Orçamento Express',
        description: 'Cálculo de tarifas flutuantes e disponibilidade de diárias gerados em menos de 10 segundos no chat.',
        image: '/marketing-assets/hp_reservas_orcamento.jpg'
      },
      {
        title: 'Checkout Instantâneo Integrado',
        description: 'Geração imediata de chaves Pix automáticas ou links de cartão de crédito para fechar a reserva de forma segura.',
        image: '/marketing-assets/hp_reservas_checkout.jpg'
      },
      {
        title: 'Recuperação de Carrinho Abandonado',
        description: 'Contato inteligente e ativo no WhatsApp com clientes que simularam tarifas mas não fecharam a diária.',
        image: '/marketing-assets/hp_reservas_carrinho.jpg'
      },
      {
        title: 'Venda Inteligente de Upgrades',
        description: 'IA oferece upgrades de quarto, adicionais de espumantes, decoração ou meia-pensão antes do pagamento.',
        image: '/marketing-assets/hp_reservas_upgrade.jpg'
      }
    ]
  },
  {
    id: 'hp_governanca',
    badge: 'ROOM_SERVICE_AI',
    title: 'Helena',
    highlight: 'ROOM SERVICE DIGITAL',
    subtitle: 'Pedidos de Quarto e Chamados de Limpeza',
    description: 'Leve a conveniência para o quarto do hóspede. Ele pode visualizar o cardápio completo, fazer pedidos de refeições e bebidas ou solicitar itens de frigobar diretamente pelo WhatsApp. A IA roteia o chamado automaticamente para a cozinha ou bar e permite solicitar serviços de lavanderia e manutenção.',
    icon: MessageSquare,
    color: 'orange',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Aumenta em até 40% o ticket médio de consumo interno devido à facilidade de compra.',
    features: [
      {
        title: 'Cardápio no WhatsApp',
        description: 'Exibição completa de pratos, porções, coquetéis e reposições de frigobar direto no chat do celular.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Chamados Rápidos de Governança',
        description: 'Solicitação rápida de travesseiros, toalhas, arrumação de quarto e manutenção técnica de ar-condicionado.',
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Fila Logística de Pedidos',
        description: 'Painel administrativo centralizado para as equipes de cozinha e camareiras organizarem os chamados.',
        image: '/fila_logistica.jpg'
      },
      {
        title: 'Pesquisa NPS Automática',
        description: 'IA dispara pesquisa rápida de satisfação logo após o chamado de serviço de quarto constar como concluído.',
        image: '/marketing-assets/hp_governanca_nps.jpg'
      }
    ]
  }
];

// Módulos específicos para Resorts
const resortsModules: ModuleData[] = [
  {
    id: 'resort_spa',
    badge: 'SPA_SCHEDULING',
    title: 'Helena',
    highlight: 'AGENDA DE SPA E MASSAGEM',
    subtitle: 'Consultas de Horário e Agendamentos',
    description: 'Aumente o faturamento de serviços complementares. Os hóspedes do resort podem consultar o menu de terapias, conferir os preços e agendar sessões de spa diretamente pelo celular de forma autônoma.',
    icon: Sparkles,
    color: 'emerald',
    image: '/resort_spa.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Aumenta em até 30% a ocupação dos spas e terapias do complexo.',
    features: [
      {
        title: 'Catálogo de Terapias',
        description: 'Menu completo de massagens, banhos aromáticos e tratamentos estéticos por áudio ou texto.',
        image: '/resort_spa.jpg'
      },
      {
        title: 'Sincronia de Agenda',
        description: 'Verificação em tempo real dos terapeutas disponíveis e bloqueio automático de horários marcados.',
        image: '/spa_agenda_sync.png'
      },
      {
        title: 'Lembretes Automáticos',
        description: 'Notificações de confirmação enviadas no WhatsApp do hóspede antes do horário agendado.',
        image: '/marketing-assets/resort_lembrete_automatico.jpg'
      },
      {
        title: 'Cobrança Consolidada',
        description: 'Integração para debitar o valor da sessão direto na conta do quarto para pagamento no check-out.',
        image: '/integracao_pms.jpg'
      }
    ]
  },
  {
    id: 'resort_gastronomia',
    badge: 'FINE_DINING_INTELLIGENCE',
    title: 'Helena',
    highlight: 'RESERVA DE RESTAURANTES',
    subtitle: 'Otimização de Capacidade e Fila Digital',
    description: 'Elimine filas e gargalos nos restaurantes à la carte do resort. A IA gerencia os agendamentos de mesas por horários e notifica os hóspedes quando a mesa deles estiver pronta para o jantar.',
    icon: Hotel,
    color: 'emerald',
    image: '/resort_restaurante.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Zera as reclamações de hóspedes relacionadas a filas de jantar.',
    features: [
      {
        title: 'Agendamento de Jantares',
        description: 'Reserva instantânea de mesas em restaurantes temáticos e bufês especiais do resort.',
        image: '/resort_restaurante.jpg'
      },
      {
        title: 'Menus Multilíngues',
        description: 'Cardápios completos exibidos em mais de 50 idiomas para comodidade de turistas estrangeiros.',
        image: '/marketing-assets/resort_menu_multilingue.jpg'
      },
      {
        title: 'Notificação de Mesa Pronta',
        description: 'Hóspedes aguardam confortavelmente no quarto e recebem alerta de mesa liberada via chat.',
        image: '/marketing-assets/resort_mesa_pronta.jpg'
      },
      {
        title: 'Controle de Lotação',
        description: 'Regulação de turnos de refeição inteligente para evitar filas e aglomerações na recepção gastronômica.',
        image: '/controle_lotacao.jpg'
      }
    ]
  },
  {
    id: 'resort_lazer',
    badge: 'ACTIVITIES_SCHEDULE',
    title: 'Helena',
    highlight: 'CRONOGRAMA DE LAZER',
    subtitle: 'Programação Diária de Recreação e Quadras',
    description: 'Mantenha os hóspedes entusiasmados. A IA divulga a agenda diária de shows, atividades infantis do Kids Club e gerencia o agendamento de quadras de tênis e beach tennis.',
    icon: Compass,
    color: 'emerald',
    image: '/resort_lazer.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Maximiza o uso das instalações de lazer sem conflito de reservas.',
    features: [
      {
        title: 'Agenda Recreativa Diária',
        description: 'Exibição dinâmica das atividades infantis, shows noturnos, hidroginástica e torneios esportivos.',
        image: '/agenda_recreativa.jpg'
      },
      {
        title: 'Agendamento de Quadras',
        description: 'Reserva automatizada de quadras de tênis, beach tennis e empréstimo de raquetes/bolas.',
        image: '/quadras_resort.jpg'
      },
      {
        title: 'Lembretes de Atividades',
        description: 'Envio de alertas sobre início de atrações sinalizadas como favoritas pelo hóspede no celular.',
        image: '/marketing-assets/resort_lembrete_atividade.jpg'
      },
      {
        title: 'Suporte Kids Club',
        description: 'Canal de comunicação seguro entre pais e a equipe de recreadores infantis do resort.',
        image: '/kids_club.jpg'
      }
    ]
  }
];

// Módulos específicos para Marketing e MarTech
const marketingModules: ModuleData[] = [
  {
    id: 'mkt_embaixadora',
    badge: 'MARTECH_VIDEO_AI',
    title: 'Djeny',
    highlight: 'EMBAIXADORAS DIGITAIS',
    subtitle: 'Avatares Interactivos de Vídeo em Sites',
    description: 'Humanização e conversão extrema. A Djeny atua como uma assistente virtual interativa por vídeo em seu site, falando de forma fluida por voz para prender a atenção do usuário.',
    icon: Bot,
    color: 'cyan',
    image: '/mkt_sintese_video.png',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Dobra a permanência média do usuário em landing pages de vendas.',
    features: [
      {
        title: 'Síntese de Vídeo Realista',
        description: 'Vídeo IA humanizado respondendo aos visitantes com voz expressiva e movimentos de lábios naturais.',
        image: '/mkt_sintese_video.png'
      },
      {
        title: 'Pitches Comerciais de Vendas',
        description: 'Diálogos estruturados sob medida para quebrar objeções comuns e conduzir o tráfego à conversão.',
        image: '/mkt_pitches_comerciais.png'
      },
      {
        title: 'Integração Visual de Marca',
        description: 'Avatar integrado perfeitamente ao layout e identidade cromática das suas landing pages.',
        image: '/mkt_integracao_marca.png'
      },
      {
        title: 'Gatilho Inteligente de Tela',
        description: 'Abordagem proativa por voz baseada no tempo de tela e movimentação do mouse do usuário.',
        image: '/mkt_gatilho_tela.png'
      }
    ]
  },
  {
    id: 'mkt_apollo',
    badge: 'PROSPECTION_INTELLIGENCE',
    title: 'Apollo',
    highlight: 'ROBÔ DE PROSPECÇÃO B2B',
    subtitle: 'Automação Estratégica de LinkedIn e Leads',
    description: 'Automatize a captação de grandes contas. O Apollo localiza cargos decisores (CEOs, Diretores de RH/Operações) dentro de filtros específicos e inicia conexões personalizadas em escala.',
    icon: Megaphone,
    color: 'cyan',
    image: '/marketing-assets/mkt_apollo_main.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Gera de 10 a 15 novas oportunidades comerciais B2B qualificadas/mês.',
    features: [
      {
        title: 'LinkedIn Prospector',
        description: 'Busca e conexão automática com perfis de decisores e leads corporativos com filtros refinados.',
        image: '/marketing-assets/mkt_apollo_prospector.jpg'
      },
      {
        title: 'Mensagens Sequenciais Inteligentes',
        description: 'Workflows automáticos de contatos personalizados com follow-ups baseados em inteligência artificial.',
        image: '/mkt_mensagens_sequenciais.jpg'
      },
      {
        title: 'Alertas de Resposta Comercial',
        description: 'Notificação automática no painel centralizado assim que um lead responde com intenção de reunião.',
        image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Segurança Ativa de Rede',
        description: 'Controle de volume e limites para respeitar as diretrizes da plataforma LinkedIn com máxima proteção.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'mkt_isadora',
    badge: 'SALES_SDR_AI',
    title: 'Isadora',
    highlight: 'SDR E QUALIFICAÇÃO ATIVA',
    subtitle: 'Triagem de Leads e Agendamento no WhatsApp',
    description: 'Diga adeus ao tempo perdido com leads frios. A Isadora recebe os contatos vindos de anúncios e realiza a triagem imediata no WhatsApp, agendando chamadas diretamente no calendário dos vendedores.',
    icon: MessageSquare,
    color: 'cyan',
    image: '/mkt_isadora_sdr.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Aumenta a conversão de leads vindos de tráfego pago em até 300%.',
    features: [
      {
        title: 'Triagem Imediata Comercial',
        description: 'Velocidade de contato inicial abaixo de 2 minutos no WhatsApp para leads vindos de campanhas.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Qualificação Ativa de Dados',
        description: 'IA faz perguntas estratégicas sobre orçamento, maturidade e fit de projeto para mapear oportunidades.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Agendamento Direto Calendly/Google',
        description: 'Após triagem positiva, IA envia link de agenda integrada para hóspede marcar chamada com comercial.',
        image: '/mkt_agendamento_calendario.jpg'
      },
      {
        title: 'Resgate de Leads Frios',
        description: 'Disparos estratégicos automatizados de reaquecimento no WhatsApp de leads que ficaram inativos na base.',
        image: '/marketing-assets/mkt_isadora_resgate.jpg'
      }
    ]
  }
];

// Módulos específicos para Televisão & Telejornais
const tvModules: ModuleData[] = [
  {
    id: 'tv_ancora',
    badge: 'BROADCAST_ANCHOR_AI',
    title: 'Arthur & Stela',
    highlight: 'ÂNCORA DE TELEJORNAL',
    subtitle: 'Apresentação de Notícias & Bancada Virtual 3D',
    description: 'Solução prática de geração audiovisual para emissoras de TV, Web TVs e canais informativos. O jornalista ou redator insere o texto da matéria no painel e o sistema sintetiza o vídeo do apresentador virtual com sincronismo labial preciso, cadência de telejornal e cenário tridimensional alinhado à identidade visual da sua marca.',
    icon: Tv,
    color: 'violet',
    image: '/ancora_jornalista_homem.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Reduz em até 70% o custo fixo com estúdio físico, maquiagem, iluminação pesada e operadores de câmera.',
    features: [
      {
        title: 'Dicção & Cadência Jornalística',
        description: 'Voz treinada com inflexões de bancada, pausas naturais de respiração e pronúncia exata de números, siglas e termos técnicos.',
        image: '/ancora_jornalista_homem.jpg'
      },
      {
        title: 'Bancada Virtual & Estúdio 3D',
        description: 'Cenários digitais renderizados em alta definição, personalizados com a logomarca da emissora, videowall temático e iluminação nas cores institucionais.',
        image: '/jornal_nexus.jpg'
      },
      {
        title: 'Múltiplos Apresentadores Especialistas',
        description: 'Modelos visuais masculinos e femininos com postura sóbria e trajes formais, ideais para telejornais gerais, blocos de economia, política ou agronegócio.',
        image: '/multiplos_ancoras_tv.jpg'
      },
      {
        title: 'Renderização em Full HD / 4K',
        description: 'Exportação em formatos broadcast padrão (MP4 H.264/H.265 ou ProRes) prontos para importação direta em switchers como vMix, OBS Studio e TriCaster.',
        image: '/tv_renderizacao_4k.jpg'
      }
    ]
  },
  {
    id: 'tv_breaking',
    badge: 'BREAKING_NEWS_AI',
    title: 'Dante',
    highlight: 'PLANTÃO & BREAKING NEWS 24 HORAS POR DIA',
    subtitle: 'Cobertura Urgente de Notícias em Poucos Minutos',
    description: 'Agilidade editorial para fatos urgentes ocorridos fora do horário comercial, madrugadas ou fins de semana. O plantonista insere a nota da matéria e gera em minutos o boletim em vídeo com vinheta de alerta, tarja informativa e locução firme, pronto para entrar no corte da programação ou ser disparado nas redes sociais.',
    icon: Megaphone,
    color: 'violet',
    image: '/plantao_urgente_tv.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Garante que a emissora seja a primeira a veicular o fato urgente, multiplicando o alcance e audiência digital.',
    features: [
      {
        title: 'Renderização Prioritária para Fatos Urgentes',
        description: 'Fila de processamento acelerada no servidor para que o arquivo final de vídeo esteja disponível minutos após a inserção do texto da ocorrência.',
        image: '/plantao_urgente_tv.jpg'
      },
      {
        title: 'Gerador de Caracteres & Tarjas Dinâmicas',
        description: 'Aplicação automatizada de tarjas inferiores (lower-thirds) com aviso de "Urgente / Plantão" e síntese da manchete para leitura dinâmica pelo telespectador.',
        image: '/tv_tarjas_gc.jpg'
      },
      {
        title: 'Distribuição Multiplataforma Integrada',
        description: 'Exportação simultânea em formato 16:9 para a grade de exibição de TV e 9:16 vertical para canais digitais como Instagram Reels, Shorts e TikTok.',
        image: '/tv_multiplataforma.jpg'
      },
      {
        title: 'Ingestão por Pauta ou Feed de Notícias',
        description: 'Possibilidade de monitoramento de despachos de agências e portais parceiros, permitindo ao editor revisar a pauta e autorizar a geração com um clique.',
        image: '/tv_automacao_rss.jpg'
      }
    ]
  },
  {
    id: 'tv_corporativa',
    badge: 'CORPORATE_BROADCAST_AI',
    title: 'Djeny',
    highlight: 'TV CORPORATIVA & SETOR PÚBLICO',
    subtitle: 'Boletins Informativos para Empresas, Câmaras e Prefeituras',
    description: 'Transformação de relatórios, atas e comunicados em telejornais corporativos objetivos e fáceis de assimilar. Desenvolvido para Câmaras Municipais, Prefeituras, cooperativas e indústrias que necessitam prestar contas com clareza sem despender altos orçamentos com produtoras externas de vídeo.',
    icon: Building2,
    color: 'violet',
    image: '/tv_corp_boletim_semanal.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Aumenta significativamente a absorção das informações institucionais em comparação a comunicados em papel ou e-mails formais.',
    features: [
      {
        title: 'Boletins Semanais e Prestação de Contas',
        description: 'Síntese das realizações públicas ou metas corporativas em edições dinâmicas de 2 a 5 minutos, apresentadas com clareza e credibilidade.',
        image: '/tv_corp_boletim_semanal.jpg'
      },
      {
        title: 'Circuito Interno de Telas (Digital Signage)',
        description: 'Arquivos gerados em resolução ideal para exibição contínua em telas de recepções, agências de atendimento, saguões públicos e refeitórios de fábricas.',
        image: '/tv_corp_rede_telas.jpg'
      },
      {
        title: 'Acessibilidade com Legendas e Janela de Libras',
        description: 'Inclusão automática de legendas de alto contraste e layout preparado para sobreposição de janela de intérprete de Libras, em conformidade com exigências legais.',
        image: '/tv_corp_acessibilidade_legendas.jpg'
      },
      {
        title: 'Painel Self-Service de Produção',
        description: 'Interface web intuitiva onde a própria assessoria de comunicação digita o roteiro, revisa a fala e gera o vídeo completo de forma autônoma.',
        image: '/tv_corp_painel_producao.jpg'
      }
    ]
  }
];

// Módulos específicos para Rádios AM, FM & Web
const radiosModules: ModuleData[] = [
  {
    id: 'radio_locutor',
    badge: 'RADIO_AUTOMATION_AI',
    title: 'Locução Virtual',
    highlight: 'LOCUÇÃO DE RÁDIO 24 HORAS POR DIA',
    subtitle: 'Hora Certa, Clima, Vinhetas e Saudações ao Ouvinte',
    description: 'Automatização inteligente para preenchimento de horários sem locutor ao vivo, como madrugadas, finais de semana e feriados. O sistema gera a leitura da hora exata do disparo, a temperatura e condições do tempo da cidade e faz saudações calorosas aos ouvintes com locução natural e fluida.',
    icon: Radio,
    color: 'rose',
    image: '/radio_estudio_locucao.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Mantém a emissora viva e dinâmica 24 horas por dia, reduzindo custos de escalas extraordinárias de estúdio.',
    features: [
      {
        title: 'Hora Certa, Clima & Locução Humanizada',
        description: 'Preenchimento inteligente de madrugadas, finais de semana e feriados. Geração de áudio com sincronismo ao segundo da hora oficial, temperatura local e saudações aos ouvintes com cadência natural e calorosa.',
        image: '/radio_estudio_locucao.jpg'
      },
      {
        title: 'Integração com Softwares de Automação de Rádio',
        description: 'Gravação e entrega direta de arquivos WAV/MP3 nas pastas monitoradas de sistemas consagrados do mercado (Pulsar, Playlist Digital, ZaraRadio, InfoAudio e DStation), sem necessidade de novas instalações ou softwares complexos.',
        image: '/radio_software_automacao.jpg'
      }
    ]
  },
  {
    id: 'radio_noticias',
    badge: 'RADIO_NEWS_AI',
    title: 'Giro de Notícias',
    highlight: 'BOLETIM DE NOTÍCIAS & AGRO',
    subtitle: 'Informativos de Hora em Hora com Trilha Masterizada e Cotações',
    description: 'Boletins jornalísticos compactos de 1 a 3 minutos para a virada de hora da emissora. Inclui leitura de destaques locais, trânsito e cotações agrícolas diárias essenciais para ouvintes do interior e produtores rurais, com trilha sonora de fundo profissional e controle de volume automático durante a fala.',
    icon: Sparkles,
    color: 'rose',
    image: '/radio_giro_noticias.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Cria novas cotas de patrocínio comercial para blocos de notícias e indicadores agropecuários diários.',
    features: [
      {
        title: 'Cotações do Agronegócio Diárias',
        description: 'Boletins com preços atualizados de commodities agrícolas (soja, milho, arroz, trigo, café e arroba do boi gordo) direcionados aos produtores rurais da região, gerando grande apelo de patrocínio local.',
        image: '/radio_giro_noticias.jpg'
      },
      {
        title: 'Sonoplastia & Masterização com Trilha de Fundo',
        description: 'Áudio gerado com trilha instrumental jornalística (bed musical) e efeito de ducking automático (redução suave da trilha durante a locução), masterizado no padrão acústico dos processadores de transmissão (Omnia / Orban).',
        image: '/radio_sonoplastia_trilhas.jpg'
      }
    ]
  },
  {
    id: 'radio_spots',
    badge: 'RADIO_COMMERCIALS_AI',
    title: 'Spots & Comerciais',
    highlight: 'PRODUÇÃO DE SPOTS COMERCIAIS',
    subtitle: 'Gravação Rápida de Propagandas para Anunciantes Locais',
    description: 'Agilidade direta para o departamento comercial da rádio. Quando um anunciante local fecha uma campanha que precisa estrear no mesmo dia, a equipe redige o texto do anúncio e gera o spot comercial completo com voz profissional, fundo musical e efeitos em poucos minutos, sem depender de estúdios externos.',
    icon: Megaphone,
    color: 'rose',
    image: '/radio_spots_varejo.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Permite fechar vendas publicitárias de última hora e veicular campanhas promocionais de varejo no mesmo dia.',
    features: [
      {
        title: 'Propagandas de Varejo & Comércio Local no Mesmo Dia',
        description: 'Elimine a espera de 48 horas por estúdios externos. Crie e aprove anúncios de alta energia para supermercados, lojas de moda, feirões e concessionárias locais com liberação imediata para a grade ou envio de prévia no WhatsApp do cliente.',
        image: '/radio_spots_varejo.jpg'
      },
      {
        title: 'Mixagem Digital, Trilhas Comerciais & Efeitos',
        description: 'Combinação automatizada da voz publicitária com trilhas sonoras orquestradas, fundos musicais dinâmicos de varejo e efeitos sonoros sincronizados de impacto, masterizados nos padrões de processamento da sua emissora.',
        image: '/radio_spots_comerciais.jpg'
      }
    ]
  },
  {
    id: 'radio_indoor',
    badge: 'INDOOR_RETAIL_AUDIO_AI',
    title: 'Rádio Indoor & PDV',
    highlight: 'RÁDIO INDOOR PARA VAREJO & SUPERMERCADOS',
    subtitle: 'Locução de Ofertas no Ponto de Venda, Música Ambiente & Avisos',
    description: 'Solução completa de sonorização comercial para supermercados, atacarejos, farmácias, shoppings e redes de lojas. A gerência ou equipe de marketing agenda chamadas automáticas de ofertas-relâmpago, avisos operacionais de caixa e comunicados institucionais com locução profissional calorosa intercalada na programação musical.',
    icon: Store,
    color: 'rose',
    image: '/radio_indoor_supermercado.jpg',
    licenca: 'Sob Consulta',
    suporte: 'SLA Customizado',
    roi: 'Aumenta em até 25% as vendas por impulso de produtos anunciados dinamicamente no som ambiente da loja física.',
    features: [
      {
        title: 'Supermercados & Ofertas no Ponto de Venda',
        description: 'Locução enérgica e profissional gerada na hora para anunciar descontos relâmpago nos setores da loja (açougue, hortifrúti, padaria e perfumaria), impulsionando a conversão imediata de compras.',
        image: '/radio_indoor_supermercado.jpg'
      },
      {
        title: 'Redes de Lojas, Franquias & Telas Integradas',
        description: 'Gestão centralizada de som ambiente, avisos institucionais e campanhas promocionais para lojas de departamento, franquias e shopping centers, sincronizada com a identidade da marca.',
        image: '/radio_indoor_lojas.jpg'
      }
    ]
  }
];

const pillars: PillarData[] = [
  {
    id: 'tv-telejornais',
    title: 'Televisão & Telejornais',
    subtitle: 'Apresentadores Virtuais, Bancadas 3D & Produção Ágil de Notícias',
    icon: Tv,
    color: 'violet',
    tagline: 'Geração automatizada de telejornais e plantões com qualidade broadcast e custo operacional reduzido.',
    description: 'Infraestrutura de síntese audiovisual voltada a emissoras de TV, Web TVs, portais de notícias e canais corporativos. O sistema permite que editores e jornalistas transformem matérias escritas em vídeos de telejornal de alta definição (Full HD/4K) apresentados por âncoras virtuais em bancadas 3D, com inserção de tarjas gráficas e compatibilidade total com switchers de transmissão.',
    image: '/jornal_nexus.jpg',
    modules: tvModules
  },
  {
    id: 'radios-audio',
    title: 'Rádios AM, FM & Web',
    subtitle: 'Locução Contínua 24 Horas, Hora Certa, Noticiário Agro & Spots Comerciais',
    icon: Radio,
    color: 'rose',
    tagline: 'Automação inteligente de áudio broadcast integrada diretamente ao software da sua emissora.',
    description: 'Solução técnica desenhada para emissoras de rádio AM/FM, comunitárias e web rádios que buscam manter a programação dinâmica e viva em todos os horários. Integração direta com pastas monitoradas dos automatizadores de mercado, entregando arquivos de áudio masterizados com hora certa sincronizada, boletins agropecuários, temperatura local e spots comerciais gravados em poucos minutos.',
    image: '/radio_hero_studio.jpg',
    modules: radiosModules
  },
  {
    id: 'hoteis-pousadas',
    title: 'Hotéis & Pousadas',
    subtitle: 'Concierge Virtual, Acolhimento & Reservas Diretas',
    icon: Hotel,
    color: 'orange',
    tagline: 'Eleve o padrão de hospitalidade e potencialize suas reservas diretas.',
    description: 'Desde grandes hotéis de rede até pousadas boutique acolhedoras. Nosso Concierge Virtual responde a dúvidas frequentes sobre check-in/out, horários de café da manhã e comodidades, além de atuar como guia local sugerindo passeios turísticos e praias. Ao mesmo tempo, conduz o visitante pelo fluxo de reservas diretas, reduzindo comissões para plataformas terceiras.',
    video: getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora%20Nexus/Hoteis.mp4', 'Hoteis.mp4'),
    modules: hoteisPousadasModules
  },
  {
    id: 'resorts',
    title: 'Resorts',
    subtitle: 'Experiência All-Inclusive & Logística VIP',
    icon: Palmtree,
    color: 'emerald',
    tagline: 'Navegação sem fricção pelo maior refúgio de lazer.',
    description: 'Resorts possuem operações vastas e complexas. Nossa IA atua como um mordomo digital dedicado, ajudando os hóspedes a agendarem sessões de spa, reservarem mesas nos restaurantes temáticos internos, conferirem a programação de lazer infantil e se localizarem no complexo.',
    video: getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora%20Nexus/Reorts.mp4', 'Reorts.mp4'),
    modules: resortsModules
  },
  {
    id: 'marketing',
    title: 'Marketing & MarTech',
    subtitle: 'Avatares de IA Interativos para Conversão de Tráfego',
    icon: Megaphone,
    color: 'cyan',
    tagline: 'Transforme tráfego frio em reuniões agendadas.',
    description: 'Para agências de marketing e portais corporativos que exigem alta taxa de captação. O avatar interativo de IA age como um assistente ativo na landing page, aumentando o tempo de permanência no site, quebrando objeções e capturando dados ricos de contato de forma natural e interativa.',
    video: getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora%20Nexus/Marketing.mp4', 'Marketing.mp4'),
    modules: marketingModules
  }
];

const colorMap = {
  orange: {
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    bg: 'bg-orange-500/5',
    glow: 'shadow-[0_0_60px_rgba(249,115,22,0.15)]',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    btn: 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    hoverBorder: 'hover:border-orange-500/50',
    overlay: 'bg-orange-950/20'
  },
  emerald: {
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.15)]',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    hoverBorder: 'hover:border-emerald-500/50',
    overlay: 'bg-emerald-950/20'
  },
  cyan: {
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    glow: 'shadow-[0_0_60px_rgba(6,182,212,0.15)]',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    hoverBorder: 'hover:border-cyan-500/50',
    overlay: 'bg-cyan-950/20'
  },
  violet: {
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    bg: 'bg-violet-500/5',
    glow: 'shadow-[0_0_60px_rgba(139,92,246,0.15)]',
    badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    btn: 'bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    hoverBorder: 'hover:border-violet-500/50',
    overlay: 'bg-violet-950/20'
  },
  rose: {
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    bg: 'bg-rose-500/5',
    glow: 'shadow-[0_0_60px_rgba(244,63,94,0.15)]',
    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    btn: 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    hoverBorder: 'hover:border-rose-500/50',
    overlay: 'bg-rose-950/20'
  }
};

export default function MarketingPage() {
  const [activeMacro, setActiveMacro] = useState<string | null>(null);
  const [activeModuleDetail, setActiveModuleDetail] = useState<ModuleData | null>(null);

  // Reset module detail when active macro changes
  useEffect(() => {
    setActiveModuleDetail(null);
  }, [activeMacro]);

  const activeMacroData = pillars.find(p => p.id === activeMacro);
  const activeModules = activeMacroData?.modules || [];
  const macroColor = activeMacroData ? colorMap[activeMacroData.color] : colorMap.orange;

  const getWhatsAppMessage = (title: string) => {
    const text = `Olá! Gostaria de mais informações e de solicitar um orçamento para o módulo [NEXUS]: ${title}.`;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#050506] text-slate-200 relative overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-24 font-sans">
      {/* Background Image Textures with Fade Transition */}
      <div 
        className={`fixed inset-0 bg-cover bg-center pointer-events-none z-0 transition-opacity duration-1000 ease-in-out ${
          (!activeMacro || activeMacro === 'hoteis-pousadas') ? 'opacity-[0.35]' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/marketing-assets/marketing_bg.jpg')" }}
      />
      <div 
        className={`fixed inset-0 bg-cover bg-center pointer-events-none z-0 transition-opacity duration-1000 ease-in-out ${
          activeMacro === 'resorts' ? 'opacity-[0.35]' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/marketing-assets/resort_bg.jpg')" }}
      />
      <div 
        className={`fixed inset-0 bg-cover bg-center pointer-events-none z-0 transition-opacity duration-1000 ease-in-out ${
          activeMacro === 'marketing' ? 'opacity-[0.35]' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/marketing-assets/mkt_bg.png')" }}
      />
      <div 
        className={`fixed inset-0 bg-cover bg-center pointer-events-none z-0 transition-opacity duration-1000 ease-in-out ${
          activeMacro === 'tv-telejornais' ? 'opacity-[0.35]' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/marketing-assets/marketing_bg.jpg')" }}
      />
      <div 
        className={`fixed inset-0 bg-cover bg-center pointer-events-none z-0 transition-opacity duration-1000 ease-in-out ${
          activeMacro === 'radios-audio' ? 'opacity-[0.35]' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/marketing-assets/marketing_bg.jpg')" }}
      />
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <AnimatePresence mode="wait">
          {!activeMacro ? (
            /* =========================================
               VISTA 1: OS MACRO CARDS
               ========================================= */
            <motion.div
              key="macro-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* HERO SECTION */}
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <span className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Divisão Mídia, TV & MarTech
                </span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase mb-4 sm:mb-6 leading-tight">
                  Nossos Canais de <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-violet-400 to-rose-400 block sm:inline">Mídia & Entretenimento</span>
                </h1>
                <p className="text-slate-400 text-xs sm:text-base md:text-lg leading-relaxed font-light px-2 sm:px-0">
                  Selecione uma área abaixo para descobrir as soluções de Avatares para TV, Locução para Rádios, Concierges Virtuais e MarTech desenhados para elevar o seu negócio.
                </p>
              </div>

              {/* GRID OF CINEMATIC CARD PLAYERS (2 CARDS DE MÍDIA NO TOPO + 3 CARDS ABAIXO) */}
              <section className="mb-20 space-y-6 max-w-7xl mx-auto">
                {/* FILA 1: DESTAQUES BROADCAST & MÍDIA (TV & RÁDIOS) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pillars.slice(0, 2).map((pillar) => {
                    const c = colorMap[pillar.color];
                    return (
                      <button
                        key={pillar.id}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setActiveMacro(pillar.id);
                          window.history.pushState(null, '', `?macro=${pillar.id}`);
                        }}
                        className="relative h-80 sm:h-96 md:h-[480px] w-full rounded-[24px] sm:rounded-[36px] md:rounded-[40px] overflow-hidden border border-slate-900 transition-all duration-700 group flex flex-col justify-end text-left hover:scale-[1.01] hover:border-white/20 hover:shadow-2xl cursor-pointer"
                      >
                        {/* BACKGROUND VIDEO / IMAGE */}
                        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
                          {pillar.image ? (
                            <img 
                              src={pillar.image} 
                              alt={pillar.title} 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" 
                            />
                          ) : (
                            <video 
                              src={pillar.video} 
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                              className="w-full h-full object-cover opacity-35 group-hover:opacity-65 transition-opacity duration-1000" 
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#02050b] via-[#02050b]/60 to-transparent" />
                          <div className={`absolute inset-0 ${c.overlay} mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                        </div>

                        {/* CONTENT */}
                        <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-end h-full w-full">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 group-hover:${c.border} group-hover:${c.bg} transition-colors duration-500`}>
                              <pillar.icon className={`h-5 w-5 sm:h-7 sm:w-7 text-white group-hover:${c.text} transition-colors duration-500`} />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-300 bg-white/10 border border-white/15 px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-md">
                              Flagship Broadcast
                            </span>
                          </div>
                          
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2 leading-tight group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-500">
                            {pillar.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed group-hover:text-white transition-colors duration-500">
                            {pillar.subtitle}
                          </p>
                          
                          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 opacity-70 sm:opacity-0 group-hover:opacity-100 transform translate-x-0 sm:translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                            <div className={`p-2.5 sm:p-3 rounded-full ${c.bg} ${c.border} border`}>
                              <ArrowRight className={`h-4 w-4 sm:h-5 sm:w-5 ${c.text}`} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* FILA 2: HOSPITALIDADE & MARTECH (HOTÉIS, RESORTS & MARKETING) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pillars.slice(2).map((pillar, idx) => {
                    const c = colorMap[pillar.color];
                    const isThird = idx === 2;
                    return (
                      <button
                        key={pillar.id}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setActiveMacro(pillar.id);
                          window.history.pushState(null, '', `?macro=${pillar.id}`);
                        }}
                        className={cn(
                          "relative h-72 sm:h-80 md:h-[420px] w-full rounded-[24px] sm:rounded-[36px] md:rounded-[40px] overflow-hidden border border-slate-900 transition-all duration-700 group flex flex-col justify-end text-left hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl cursor-pointer",
                          isThird ? "sm:col-span-2 lg:col-span-1" : ""
                        )}
                      >
                        {/* BACKGROUND VIDEO / IMAGE */}
                        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
                          {pillar.image ? (
                            <img 
                              src={pillar.image} 
                              alt={pillar.title} 
                              className="w-full h-full object-cover opacity-55 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700" 
                            />
                          ) : (
                            <video 
                              src={pillar.video} 
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                              className="w-full h-full object-cover opacity-35 group-hover:opacity-65 transition-opacity duration-1000" 
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#02050b] via-[#02050b]/60 to-transparent" />
                          <div className={`absolute inset-0 ${c.overlay} mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                        </div>

                        {/* CONTENT */}
                        <div className="relative z-10 p-6 sm:p-7 md:p-8 flex flex-col justify-end h-full w-full">
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`p-3 sm:p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 group-hover:${c.border} group-hover:${c.bg} transition-colors duration-500`}>
                              <pillar.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:${c.text} transition-colors duration-500`} />
                            </div>
                          </div>
                          
                          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-white mb-1.5 leading-tight group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-500">
                            {pillar.title}
                          </h3>
                          <p className="text-xs text-slate-400 max-w-sm leading-relaxed group-hover:text-white transition-colors duration-500">
                            {pillar.subtitle}
                          </p>
                          
                          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 opacity-70 sm:opacity-0 group-hover:opacity-100 transform translate-x-0 sm:translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                            <div className={`p-2.5 sm:p-3 rounded-full ${c.bg} ${c.border} border`}>
                              <ArrowRight className={`h-4 w-4 ${c.text}`} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          ) : !activeModuleDetail ? (
            /* =========================================
               VISTA 2: LISTA DE MÓDULOS DE UMA MACRO
               ========================================= */
            <motion.div
              key="modules-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-full min-h-screen pb-24"
            >
              {/* Botão de Voltar */}
              <button 
                onClick={() => {
                  setActiveMacro(null);
                  window.history.pushState(null, '', window.location.pathname);
                }}
                className="group flex items-center gap-2 text-slate-400 hover:text-white mb-6 sm:mb-8 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest">Voltar aos Canais</span>
              </button>

              {/* APRESENTAÇÃO DE DESTAQUE DO SETOR (IMAGEM OU VÍDEO) */}
              {(activeMacroData?.video || activeMacroData?.image) && (
                <div className="w-full mb-8 sm:mb-12 flex flex-col items-center">
                  <div className={`relative w-full max-w-4xl aspect-video rounded-[24px] sm:rounded-[32px] overflow-hidden border ${macroColor.border} bg-slate-900/50 shadow-[0_0_80px_rgba(0,0,0,0.5)] group`}>
                    {activeMacroData.video ? (
                      <CustomVideoPlayer src={activeMacroData.video} className="w-full h-full object-cover" />
                    ) : (
                      <Image 
                        src={activeMacroData.image!} 
                        alt={activeMacroData.title} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                      />
                    )}
                    <div className={`absolute inset-0 pointer-events-none border-[2px] border-transparent group-hover:${macroColor.border} rounded-[24px] sm:rounded-[32px] transition-colors duration-700`} />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-slate-500 text-center px-4">
                    <Sparkles className="h-4 w-4 text-orange-400 shrink-0" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">
                      {activeMacro === 'radios-audio' 
                        ? 'Estúdio Master de Transmissão • Nexus Radio' 
                        : activeMacro === 'tv-telejornais'
                        ? 'Estúdio Virtual de Telejornalismo • Jornal Nexus'
                        : 'Demonstração da Embaixadora Virtual'}
                    </span>
                  </div>
                </div>
              )}

              {/* Cabeçalho do Setor */}
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 border-b border-slate-900 pb-8 px-2">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight">
                  {activeMacroData?.title}
                </h1>
                <p className="text-slate-400 mt-4 text-xs sm:text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto">
                  {activeMacroData?.description}
                </p>
              </div>

              {/* Grid dos Módulos do Canal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {activeModules.map((mod, i) => {
                  const c = colorMap[mod.color];
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveModuleDetail(mod);
                      }}
                      className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-900 bg-[#0a0a0c]/80 backdrop-blur-xl group text-left hover:-translate-y-2 hover:border-white/10 transition-all duration-500 cursor-pointer flex flex-col h-full w-full"
                    >
                      {/* IMAGEM DE TOPO DO CARD */}
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950 shrink-0">
                        <Image src={mod.image} alt={mod.highlight} fill className="object-cover p-0 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
                        <div className="absolute top-4 left-4">
                          <Badge className={`${c.badge} px-2.5 py-0.5 text-[8px] font-black tracking-widest uppercase border-none shadow-md`}>
                            {mod.badge}
                          </Badge>
                        </div>
                      </div>

                      {/* CORPO DO CARD */}
                      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between w-full">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${c.bg} border ${c.border}`}>
                              <mod.icon className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${c.text}`} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${c.text}`}>{mod.title}</span>
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mb-1">
                              {mod.highlight}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-light">{mod.subtitle}</p>
                          </div>
                        </div>

                        {/* HOVER ACCELERATOR BUTTON */}
                        <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-900/50 w-full text-left">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-slate-300 transition-colors">
                            Abrir Recursos
                          </span>
                          <div className={`p-2 rounded-full ${c.bg} group-hover:translate-x-1 transition-transform`}>
                            <ArrowRight className={`h-3 w-3 ${c.text}`} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* =========================================
               VISTA 3: DEEP DIVE DO MÓDULO COM IMAGENS INDIVIDUAIS PARA CADA ITEM
               ========================================= */
            <motion.div
              key="module-deep-dive"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-full min-h-screen pb-24"
            >
              {/* Botão de Voltar para Módulos */}
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveModuleDetail(null);
                }}
                className="group flex items-center gap-2 text-slate-400 hover:text-white mb-6 sm:mb-8 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest">Voltar para Módulos</span>
              </button>

              {/* Cabeçalho do Deep Dive (Título do Módulo) */}
              <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 px-2">
                <span className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  Detalhamento de Solução Premium
                </span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
                  {activeModuleDetail.highlight}
                </h1>
                <p className="text-slate-400 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-3xl mx-auto">
                  {activeModuleDetail.description}
                </p>
              </div>

              {/* APRESENTAÇÃO DOS ITENS DETALHADOS COM IMAGENS INDIVIDUAIS (ALTERNANDO) */}
              <div className="space-y-16 sm:space-y-24 max-w-6xl mx-auto mb-20 px-2 sm:px-0">
                {activeModuleDetail.features.map((feature, idx) => {
                  const isEven = idx % 2 === 0;
                  const c = colorMap[activeModuleDetail.color];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center"
                    >
                      {/* Lado da Imagem (Esquerda ou Direita) */}
                      <div className={cn(
                        "relative w-full aspect-[4/3] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-900 shadow-2xl group",
                        isEven ? "md:col-span-6 md:order-1" : "md:col-span-6 md:order-2"
                      )}>
                        <Image 
                          src={feature.image} 
                          alt={feature.title} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#02050b]/80 via-transparent to-transparent pointer-events-none" />
                        <div className={`absolute inset-0 pointer-events-none border-[3px] border-transparent group-hover:${c.border} rounded-[24px] sm:rounded-[32px] transition-colors duration-700`} />
                      </div>

                      {/* Lado do Texto */}
                      <div className={cn(
                        "space-y-3 sm:space-y-4 md:col-span-6",
                        isEven ? "md:order-2 md:pl-6" : "md:order-1 md:pr-6"
                      )}>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${c.text} font-mono`}>
                            Recurso {idx + 1}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                          {feature.title}
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CARD DE PERSONALIZAÇÃO 100% */}
              <div className={cn(
                "relative overflow-hidden rounded-[24px] sm:rounded-[32px] border p-6 sm:p-8 md:p-10 max-w-4xl mx-auto my-12 sm:my-16 bg-gradient-to-r from-white/5 via-transparent to-transparent",
                colorMap[activeModuleDetail.color].border
              )}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 md:gap-10">
                  <div className={cn(
                    "p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border shrink-0",
                    colorMap[activeModuleDetail.color].bg,
                    colorMap[activeModuleDetail.color].border,
                    colorMap[activeModuleDetail.color].text
                  )}>
                    <Palette className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <div className="space-y-2 text-left">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest font-mono", colorMap[activeModuleDetail.color].text)}>
                      Customização Total
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase text-white tracking-tight">
                      Soluções 100% Personalizáveis
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                      Cada solução é única. Personalizamos <strong>100% do avatar visual (imagem/vídeo)</strong>, o <strong>tom e sotaque da voz falada</strong>, a personalidade de apresentação ou locução e a base de conhecimento técnica para representar com total fidelidade a identidade da sua marca ou emissora.
                    </p>
                  </div>
                </div>
              </div>

              {/* BOX DE INVESTIMENTO & ROI DO MÓDULO */}
              <div className="bg-gradient-to-br from-[#0a0a0c] to-[#111114] border border-slate-900 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 md:p-12 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                    Viabilidade & Implantação
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                    {activeMacro === 'tv-telejornais'
                      ? 'Nossas soluções de Inteligência Artificial para TV são dimensionadas individualmente para atender a infraestrutura de transmissão, grade jornalística e rotina de produção da sua emissora.'
                      : activeMacro === 'radios-audio'
                      ? 'Nossas soluções de locução e áudio IA são dimensionadas para integrar com perfeição ao sistema de automação e à grade de programação da sua emissora de rádio.'
                      : activeMacro === 'hoteis-pousadas' || activeMacro === 'resorts'
                      ? 'Nossas soluções de inteligência artificial são dimensionadas individualmente para respeitar a estrutura operacional e de hospitalidade da sua pousada, hotel ou resort.'
                      : 'Nossas soluções de inteligência artificial são dimensionadas individualmente para respeitar a estrutura operacional e tecnológica da sua empresa ou agência corporativa.'}
                  </p>
                </div>

                {/* Specs Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
                  <div className="bg-slate-950/60 border border-slate-900 p-4 sm:p-5 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1">Licença de Uso:</span>
                    <p className="text-sm sm:text-base font-black text-white">{activeModuleDetail.licenca}</p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-900 p-4 sm:p-5 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1">Suporte Mensal:</span>
                    <p className="text-sm sm:text-base font-black text-white">{activeModuleDetail.suporte}</p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-900 p-4 sm:p-5 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1">ROI Projetado:</span>
                    <p className="text-xs font-bold text-white leading-tight mt-1">{activeModuleDetail.roi}</p>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <Button asChild className={cn(
                    "w-full sm:w-auto px-6 sm:px-10 h-12 sm:h-14 text-white font-bold uppercase tracking-widest text-[11px] sm:text-xs rounded-2xl transition-all hover:scale-105 cursor-pointer max-w-sm mx-auto flex items-center justify-center gap-2",
                    colorMap[activeModuleDetail.color].btn
                  )}>
                    <Link href={getWhatsAppMessage(activeModuleDetail.highlight)} target="_blank">
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate">Solicitar Implantação do Módulo</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECONDARY CALL TO ACTION (SOMENTE VISÍVEL NA TELA DE MACROS) */}
        {!activeModuleDetail && (
          <div className="group relative bg-gradient-to-br from-zinc-900/80 to-black/90 backdrop-blur-2xl border border-white/10 rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-14 text-center overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)] max-w-4xl mx-auto transition-all duration-500 hover:border-white/20">
            {/* Premium Glow Effects */}
            <div className="absolute -top-32 -left-32 w-72 h-72 bg-orange-500/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-orange-500/30 transition-all duration-700" />
            <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-cyan-500/30 transition-all duration-700" />

            <div className="relative z-10 flex flex-col items-center">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-orange-500/5 text-orange-400 border border-orange-500/30 px-3.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-4 sm:mb-6 shadow-[0_0_20px_rgba(249,115,22,0.15)] backdrop-blur-md">
                <Languages className="w-4 h-4" /> Poliglota em mais de 50 Idiomas
              </span>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 sm:mb-5 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                Deseja uma arquitetura customizada?
              </h3>
              
              <p className="text-slate-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto">
                Nossos engenheiros desenvolvem vozes customizadas, estúdios virtuais 3D, integrações proprietárias e personalidades únicas de IA para o seu ecossistema. Solicite uma audiência comercial agora mesmo.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
