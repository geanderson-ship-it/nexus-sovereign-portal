'use client';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Cpu, BarChart3, Shield, CheckCircle, ArrowRight, Phone, Eye, Timer, Package, Truck, ShoppingBag, Users, BrainCircuit, Database, ShieldCheck, Factory, Sparkles, Scale, Building2, Palette, ArrowLeft, FileText } from 'lucide-react';
import * as gtag from '@/lib/gtag';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';

const WHATSAPP_URL = 'https://wa.me/5551999799582';

const macroCards = [
  { id: 'industria', title: 'INDÚSTRIA 4.0', subtitle: 'Manufatura, Logística e Automação', icon: Factory, color: 'sky', video: '/images/heitor_heygen_v2.mp4', avatarVideo: '/images/heitor_heygen_v2.mp4', overlayClass: 'bg-sky-900/20', glowClass: 'shadow-[0_0_80px_rgba(14,165,233,0.3)]', badgeClass: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { id: 'legaltech', title: 'LEGALTECH', subtitle: 'Jurimetria e Contratos', icon: Scale, color: 'amber', video: 'https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Justine_Pactum.mp4', avatarVideo: 'https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Justine_Pactum.mp4', overlayClass: 'bg-amber-900/20', glowClass: 'shadow-[0_0_80px_rgba(245,158,11,0.3)]', badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'construtech', title: 'CONSTRUTECH', subtitle: 'Engenharia Civil e Arquitetura', icon: Building2, color: 'emerald', video: '/images/augusto_construtech.mp4', avatarVideo: '/images/augusto_construtech.mp4', overlayClass: 'bg-emerald-900/20', glowClass: 'shadow-[0_0_80px_rgba(16,185,129,0.3)]', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'martech', title: 'MARTECH', subtitle: 'Marketing, Design e Branding', icon: Palette, color: 'pink', video: '/images/djeny_martech.mp4', avatarVideo: '/images/djeny_martech.mp4', overlayClass: 'bg-pink-900/20', glowClass: 'shadow-[0_0_80px_rgba(236,72,153,0.3)]', badgeClass: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
];

const industrialModules = [
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
    image: '/images/vendas_b2b.jpg',
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
    image: '/images/compras_b2b.jpg',
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
    image: '/images/ppcp_b2b.jpg',
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
    image: '/images/auditor_b2b.jpg',
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
    image: '/images/cronoanalise_b2b.jpg',
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
    image: '/images/almoxarifado_b2b.jpg',
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
    image: '/images/expedicao_b2b.jpg',
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
    image: '/images/rh_b2b_v2.jpg',
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
    image: '/images/estrategia_b2b.jpg',
    gtag: 'nexus_empresas_estrategia', href: '/nexus-empresas/estrategia',
    licenca: 'R$ 21.000,00', suporte: 'R$ 840,00/mês',
    roi: 'Se paga na primeira decisão estratégica assertiva.',
  },
  {
    id: 'engenharia',
    badge: 'ENGINEERING_DATA',
    title: '', highlight: 'ENGENHARIA',
    subtitle: 'O Banco de Dados Master da Fábrica',
    description: 'Onde os tempos auditados do Heitor encontram o planejamento do PPCP. O motor central que garante que o produto saia como projetado.',
    icon: Database, color: 'emerald',
    features: ['Estruturação de Ficha Técnica (BOM)', 'Gestão do Banco de Tempos', 'Cálculo dinâmico de capacidade', 'Versionamento de processos'],
    image: '/images/engenharia_b2b.jpg',
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
    image: '/images/qualidade_b2b.jpg',
    gtag: 'nexus_empresas_qualidade', href: '/intelligence/qualidade',
    licenca: 'R$ 10.500,00', suporte: 'R$ 420,00/mês',
    roi: 'Se paga na primeira RNC bloqueada.',
  },
];

const legalModules = [
  {
    id: 'legal_jurimetrics',
    badge: 'ANÁLISE PREDITIVA',
    title: '', highlight: 'JURIMETRIA PREDITIVA',
    subtitle: 'Mapeamento Preditivo de Juízes e Tribunais',
    description: 'Nossa IA analisa milhões de sentenças passadas para prever a probabilidade de ganho em cada vara, sugerindo os melhores argumentos para cada magistrado específico.',
    icon: BrainCircuit, color: 'sky',
    features: ['Análise de perfil decisório por juiz', 'Previsibilidade estatística de ganho', 'Sugestão de jurisprudência matadora', 'Mapeamento de varas hostis'],
    image: '/images/jurimetria_b2b.jpg',
    gtag: 'nexus_empresas_jurimetria', href: '',
    licenca: 'R$ 18.000,00', suporte: 'R$ 800,00/mês',
    roi: 'Aumento imediato na taxa de ganho de processos.',
    frozen: false,
  },
  {
    id: 'legal_contracts',
    badge: 'AUTOMAÇÃO CLM',
    title: '', highlight: 'GESTÃO DE CONTRATOS',
    subtitle: 'Esteira de Contratos Automatizada',
    description: 'Elimine o gargalo do departamento jurídico. A IA gera, audita e formata minutas complexas em segundos, garantindo aderência total às políticas da empresa.',
    icon: FileText, color: 'emerald',
    features: ['Geração instantânea de contratos', 'Revisão ortográfica e legal automática', 'Workflow de aprovações (CLM)', 'Assinatura digital integrada'],
    image: '/images/contratos_b2b.jpg',
    gtag: 'nexus_empresas_contratos', href: '',
    licenca: 'R$ 12.000,00', suporte: 'R$ 500,00/mês',
    roi: 'Reduz o tempo de emissão de contratos de dias para minutos.',
    frozen: false,
  },
  {
    id: 'legal_pactum',
    badge: 'SALA DE GUERRA',
    title: '', highlight: 'AUDITORIA DE RISCO',
    subtitle: 'Auditoria de Vulnerabilidades e Negociações',
    description: 'A arma definitiva para negociações de altíssimo risco e defesa patrimonial. Inteligência analítica focada em proteger a corporação contra passivos judiciais.',
    icon: Scale, color: 'amber',
    features: ['Blindagem de Ativos e Defesa Preventiva', 'Auditoria Contratual Cirúrgica', 'Compliance Estrito a Normativas Globais'],
    image: '/images/pactum_b2b.jpg',
    gtag: 'nexus_empresas_pactum', href: '/exclusive/pactum',
    licenca: 'R$ 35.000,00', suporte: 'R$ 1.500,00/mês',
    roi: 'Se paga na proteção do primeiro contrato B2B de alto risco.',
    frozen: false,
  },
  {
    id: 'legal_labor',
    badge: 'PREVENÇÃO',
    title: '', highlight: 'PREVENÇÃO TRABALHISTA',
    subtitle: 'Prevenção de Passivos Trabalhistas',
    description: 'Cruza dados de ponto, folha de pagamento e comunicações internas para identificar focos de risco trabalhista antes que virem processos milionários.',
    icon: Users, color: 'pink',
    features: ['Alerta de risco de assédio/burnout', 'Auditoria de inconsistências de ponto', 'Previsão de ações trabalhistas', 'Adequação automática a convenções sindicais'],
    image: '/images/labor_b2b.jpg',
    gtag: 'nexus_empresas_trabalhista', href: '',
    licenca: 'R$ 15.000,00', suporte: 'R$ 700,00/mês',
    roi: 'Se paga ao evitar o primeiro litígio trabalhista.',
    frozen: false,
  },
  {
    id: 'legal_compliance',
    badge: 'GOVERNANÇA',
    title: '', highlight: 'COMPLIANCE E LGPD',
    subtitle: 'Governança de Dados Corporativos',
    description: 'Mapeamento constante do tráfego de dados da empresa, bloqueando vazamentos de informações sensíveis e garantindo aderência implacável à LGPD.',
    icon: ShieldCheck, color: 'violet',
    features: ['Mapeamento de dados sensíveis em tempo real', 'Bloqueio de vazamentos (DLP)', 'Geração de relatórios de impacto', 'Treinamento automatizado de equipe'],
    image: '/images/compliance_b2b.jpg',
    gtag: 'nexus_empresas_compliance', href: '',
    licenca: 'R$ 20.000,00', suporte: 'R$ 900,00/mês',
    roi: 'Evita multas milionárias da ANPD.',
    frozen: false,
  },
];

const constructModules = [
  {
    id: 'construct_orcamento',
    badge: 'CUSTOS & BIM',
    title: '', highlight: 'ORÇAMENTO PREDITIVO',
    subtitle: 'Extração BIM e Cotação Automática',
    description: 'A IA lê os projetos BIM, levanta os quantitativos automaticamente e dispara cotações para a base de fornecedores, garantindo a compra pelo menor preço e melhor prazo.',
    icon: Database, color: 'emerald',
    features: ['Extração automatizada de quantitativos (BIM)', 'Cotação multicanal inteligente', 'Previsão de flutuação de preços de insumos', 'Geração de curva S automatizada'],
    image: '/images/orcamento_const.jpg',
    gtag: 'nexus_empresas_orcamento', href: '',
    licenca: 'R$ 15.000,00', suporte: 'R$ 600,00/mês',
    roi: 'A economia média na primeira grande compra de aço cobre a licença.',
    frozen: false,
  },
  {
    id: 'construct_diario',
    badge: 'OPERAÇÃO',
    title: '', highlight: 'DIÁRIO DE OBRA IA',
    subtitle: 'Relatórios Visuais e por Voz',
    description: 'Basta o engenheiro gravar um áudio ou tirar uma foto do canteiro. A IA transcreve, analisa o progresso contra o cronograma e gera o diário oficial da obra sem digitação.',
    icon: Eye, color: 'emerald',
    features: ['Transcrição de áudios técnicos', 'Reconhecimento de avanço físico por foto', 'Alerta de atraso de cronograma', 'Exportação automática em PDF'],
    image: '/images/diario_const.jpg',
    gtag: 'nexus_empresas_diario', href: '',
    licenca: 'R$ 12.000,00', suporte: 'R$ 500,00/mês',
    roi: 'Economiza 2 horas por dia do engenheiro residente.',
    frozen: false,
  },
  {
    id: 'construct_equipamentos',
    badge: 'LOGÍSTICA',
    title: '', highlight: 'GESTÃO DE EQUIPAMENTOS',
    subtitle: 'Telemetria e Locação',
    description: 'Monitoramento em tempo real de máquinas pesadas e gruas. Saiba exatamente onde cada equipamento está, taxa de ociosidade e quando a manutenção preventiva é necessária.',
    icon: Truck, color: 'sky',
    features: ['Rastreamento GPS no canteiro', 'Cálculo de ociosidade e custo de locação', 'Alerta de manutenção preventiva', 'Controle de ferramentas menores com RFID'],
    image: '/images/equipamento_const.jpg',
    gtag: 'nexus_empresas_equipamentos', href: '',
    licenca: 'R$ 18.000,00', suporte: 'R$ 750,00/mês',
    roi: 'Reduz os custos de locação estendida desnecessária em 30%.',
    frozen: false,
  },
  {
    id: 'construct_seguranca',
    badge: 'EHS',
    title: '', highlight: 'SEGURANÇA DO TRABALHO',
    subtitle: 'Prevenção e Monitoramento de EPIs',
    description: 'Câmeras no canteiro conectadas à IA identificam operários sem EPI, detectam zonas de risco de queda e geram alertas imediatos para a equipe de segurança do trabalho.',
    icon: ShieldCheck, color: 'amber',
    features: ['Detecção visual de ausência de capacete/cinto', 'Alerta de aproximação de maquinário', 'Registro inalterável de conformidade', 'Treinamentos curtos via WhatsApp'],
    image: '/images/seguranca_const.jpg',
    gtag: 'nexus_empresas_seguranca', href: '',
    licenca: 'R$ 25.000,00', suporte: 'R$ 1.100,00/mês',
    roi: 'Um acidente grave evitado vale milhões em vidas e multas.',
    frozen: false,
  },
  {
    id: 'construct_vistoria',
    badge: 'EXPERIÊNCIA',
    title: '', highlight: 'VISTORIA DE ENTREGA',
    subtitle: 'Inspeção e Painel do Proprietário',
    description: 'Digitaliza o processo de entrega das chaves. O cliente acompanha o progresso, tira fotos de não-conformidades e a IA roteiriza automaticamente a equipe de assistência técnica.',
    icon: CheckCircle, color: 'pink',
    features: ['Painel transparente para o comprador', 'Abertura de chamados com fotos', 'Roteirização inteligente da assistência', 'Checklist digital de handover'],
    image: '/images/vistoria_const.jpg',
    gtag: 'nexus_empresas_vistoria', href: '',
    licenca: 'R$ 10.000,00', suporte: 'R$ 400,00/mês',
    roi: 'Reduz a taxa de rejeição na entrega de chaves em 50%.',
    frozen: false,
  },
];

const creativeModules = [
  {
    id: 'martech_brand',
    badge: 'BRANDING',
    title: '', highlight: 'ESTRATÉGIA DE MARCA',
    subtitle: 'Posicionamento e Identidade B2B',
    description: 'Nossa IA analisa o mercado, os concorrentes e o perfil do seu cliente ideal para desenhar estratégias de posicionamento de marca que transmitem autoridade absoluta.',
    icon: Palette, color: 'pink',
    features: ['Análise semântica de concorrência', 'Geração de paletas e moodboards', 'Definição de tom de voz corporativo', 'Manual de marca dinâmico'],
    image: '/images/martech_brand.jpg',
    gtag: 'nexus_empresas_brand', href: '',
    licenca: 'R$ 10.000,00', suporte: 'R$ 450,00/mês',
    roi: 'Aumento imediato na percepção de valor pelo cliente final.',
    frozen: false,
  },
  {
    id: 'martech_content',
    badge: 'CONTEÚDO IA',
    title: '', highlight: 'AUTOMAÇÃO DE CONTEÚDO',
    subtitle: 'Copywriting e Design em Escala',
    description: 'Chega de gargalos criativos. A Djeny gera roteiros, artigos, copys persuasivos e peças gráficas de altíssima conversão em segundos, sempre alinhados ao seu branding.',
    icon: Sparkles, color: 'violet',
    features: ['Geração de copy para alta conversão', 'Design automatizado de banners', 'Roteiros para vídeos comerciais', 'Revisão ortográfica e de tom'],
    image: '/images/martech_content.jpg',
    gtag: 'nexus_empresas_content', href: '',
    licenca: 'R$ 8.500,00', suporte: 'R$ 380,00/mês',
    roi: 'Substitui o custo fixo de agências terceirizadas básicas.',
    frozen: false,
  },
  {
    id: 'martech_ads',
    badge: 'PERFORMANCE',
    title: '', highlight: 'TRÁFEGO INTELIGENTE',
    subtitle: 'Gestão e Otimização de Anúncios',
    description: 'A IA gerencia seu orçamento de mídia paga. Ela pausa campanhas ruins, escala as vencedoras e realiza testes A/B contínuos para baixar o seu custo de aquisição (CAC).',
    icon: ArrowRight, color: 'sky',
    features: ['Otimização de lances em tempo real', 'Testes A/B multivariados automáticos', 'Alocação de orçamento preditiva', 'Criação de públicos semelhantes (Lookalike)'],
    image: '/images/martech_ads.jpg',
    gtag: 'nexus_empresas_ads', href: '',
    licenca: 'R$ 15.000,00', suporte: 'R$ 600,00/mês',
    roi: 'Reduz o Custo de Aquisição de Clientes (CAC) em até 40%.',
    frozen: false,
  },
  {
    id: 'martech_crm',
    badge: 'VENDAS',
    title: '', highlight: 'GESTÃO DE LEADS',
    subtitle: 'CRM e Qualificação Automática',
    description: 'Transforme cliques em contratos. Os leads caem no sistema e a IA qualifica, faz o aquecimento via WhatsApp e entrega mastigado para o seu time de vendas fechar.',
    icon: Users, color: 'emerald',
    features: ['Scoring de leads por IA', 'Aquecimento automático (Nurturing)', 'Integração direta com WhatsApp', 'Agendamento de reuniões sem fricção'],
    image: '/images/martech_crm.jpg',
    gtag: 'nexus_empresas_crm', href: '',
    licenca: 'R$ 12.000,00', suporte: 'R$ 500,00/mês',
    roi: 'Dobra a taxa de conversão do time de vendas interno.',
    frozen: false,
  },
  {
    id: 'martech_roi',
    badge: 'MÉTRICAS',
    title: '', highlight: 'ANÁLISE DE ROI',
    subtitle: 'Dashboards Financeiros de Marketing',
    description: 'Métricas de vaidade não pagam contas. Este painel cruza todo o seu investimento em marketing com as vendas reais no ERP, mostrando o ROI exato de cada centavo gasto.',
    icon: BarChart3, color: 'amber',
    features: ['Cálculo de ROI em tempo real', 'Atribuição multicanal de vendas', 'Previsão de faturamento futuro', 'Relatórios automatizados para a diretoria'],
    image: '/images/martech_roi.jpg',
    gtag: 'nexus_empresas_roi', href: '',
    licenca: 'R$ 18.000,00', suporte: 'R$ 700,00/mês',
    roi: 'Se paga evitando investimentos às cegas em marketing ineficiente.',
    frozen: false,
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

type Mod = typeof industrialModules[0];

export default function NexusEmpresasPage() {
  const [aberto, setAberto] = useState<Mod | null>(null);
  const [modalTab, setModalTab] = useState<'detalhes' | 'investimento'>('detalhes');
  // Se activeMacro for null, exibe apenas a vitrine principal (4 macro-cards)
  const [activeMacro, setActiveMacro] = useState<string | null>(null);

  // Determina quais módulos renderizar baseado na macro selecionada
  const activeModules = (() => {
    switch(activeMacro) {
      case 'industria': return industrialModules;
      case 'legaltech': return legalModules;
      case 'construtech': return constructModules;
      case 'martech': return creativeModules;
      default: return [];
    }
  })();

  const activeMacroData = macroCards.find(m => m.id === activeMacro);
  const macroColor = activeMacroData ? colorMap[activeMacroData.color] : colorMap['sky'];

  return (
    <div className="w-full min-h-screen bg-[#020A14] text-slate-200 relative overflow-hidden">
      {/* BACKGROUND IMAGE GLOBAL */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image src="/nexus-hero-hologram.png" alt="Nexus Empresas Background" fill priority className="object-cover opacity-55" style={{ objectPosition: 'center top' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020A14]/25 via-[#020A14]/55 to-[#020A14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(0,212,255,0.06)_0%,transparent_60%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/8 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,87,255,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(0,87,255,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <AnimatePresence mode="wait">
        {!activeMacro ? (
          /* =========================================
             VISTA 1: VITRINE PRINCIPAL (OS 4 SILOS)
             ========================================= */
          <motion.div
            key="home-view"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full"
          >
            {/* HERO */}
            <div className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
              <div className="text-center px-4 max-w-7xl mx-auto w-full">
                <Badge className="bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20 px-6 py-1.5 tracking-[0.3em] font-mono text-[10px] mb-8">B2B_INTELLIGENCE_SUITE</Badge>
                <div className="w-full flex flex-col items-center text-center gap-6 mt-8 mb-6 max-w-6xl mx-auto">
                  
                  {/* LOGO VIDEO MIRELA */}
                  <div className="relative w-full max-w-[1200px] flex flex-col items-center gap-6">
                    <div className="w-full aspect-video rounded-[40px] overflow-hidden border border-blue-500/20 bg-blue-500/5 shadow-[0_0_80px_rgba(0,212,255,0.15)]">
                      <CustomVideoPlayer src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Mirela_Enterprise_Apresentacao.mp4" className="w-full h-full object-cover" />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="group flex items-center gap-3 px-6 py-3 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/5 hover:bg-[#00D4FF]/20 text-[#00D4FF] hover:text-white transition-all shadow-[0_0_15px_rgba(0,212,255,0.05)] hover:scale-105 cursor-pointer">
                          <Sparkles className="h-4 w-4 text-[#00D4FF] animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-widest">Quer conhecer toda a Nexus B2B? Assista a Apresentação</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-950 border border-blue-900/50 text-white max-w-4xl p-4 flex flex-col items-center justify-center rounded-3xl">
                        <DialogHeader className="w-full text-center mb-2">
                          <DialogTitle className="text-lg font-black uppercase tracking-tight text-[#00D4FF]">Apresentação Completa Nexus B2B</DialogTitle>
                        </DialogHeader>
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-blue-500/30 bg-black shadow-[0_0_30px_rgba(0,212,255,0.2)]">
                          <CustomVideoPlayer src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Mirela_Enterprise_Detalhes.mp4" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 text-center uppercase tracking-widest font-bold">Apresentação Institucional Completa</p>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mt-10">
                    Nexus <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-blue-500 to-indigo-600">Enterprise</span>
                  </h1>
                  <p className="text-zinc-400 text-sm sm:text-base md:text-xl font-light tracking-wide max-w-2xl leading-relaxed mx-auto">
                    Tecnologia soberana e inteligência de dados B2B. Selecione sua área de atuação abaixo e descubra as ferramentas desenhadas para o seu setor.
                  </p>
                </div>
              </div>
            </div>

            {/* 4 MACRO CARDS - OS 4 SILOS CINEMÁTICOS */}
            <section className="container mx-auto px-4 pt-10 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {macroCards.map((macro) => {
                  const c = colorMap[macro.color];
                  return (
                    <button
                      key={macro.id}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveMacro(macro.id);
                      }}
                      className="relative h-64 md:h-96 w-full rounded-[40px] overflow-hidden border border-slate-800 transition-all duration-700 group flex flex-col justify-end text-left hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl"
                    >
                      {/* BACKGROUND VIDEO OR IMAGE */}
                      <div className="absolute inset-0 z-0 bg-slate-950">
                        {macro.video.endsWith('.mp4') ? (
                          <video src={macro.video} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
                        ) : (
                          <Image src={macro.video} alt={macro.title} fill className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020A14] via-[#020A14]/70 to-transparent" />
                        <div className={`absolute inset-0 ${macro.overlayClass} mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                      </div>

                      {/* CONTENT */}
                      <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full w-full">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 group-hover:${c.border} group-hover:${c.bg} transition-colors duration-500`}>
                            <macro.icon className={`h-8 w-8 text-white group-hover:${c.text} transition-colors duration-500`} />
                          </div>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 leading-none group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-500">{macro.title}</h3>
                        <p className="text-sm md:text-lg text-slate-300 max-w-md leading-relaxed group-hover:text-white transition-colors duration-500">{macro.subtitle}</p>
                        
                        <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                          <div className={`p-3 rounded-full ${c.bg} ${c.border} border`}>
                            <ArrowRight className={`h-6 w-6 ${c.text}`} />
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          </motion.div>
        ) : (
          /* =========================================
             VISTA 2: DETALHES DO MACRO-CARD (Módulos Internos)
             ========================================= */
          <motion.div
            key="modules-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full min-h-screen pt-24 pb-24"
          >
            <div className="max-w-7xl mx-auto px-4">
              {/* Botão de Voltar */}
              <button 
                onClick={() => setActiveMacro(null)}
                className="group flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
              >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Voltar aos Setores</span>
              </button>

              {/* Cabeçalho do Setor */}
              <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between mb-12 border-b border-white/10 pb-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl ${macroColor.bg} border ${macroColor.border}`}>
                      {activeMacroData && <activeMacroData.icon className={`h-6 w-6 ${macroColor.text}`} />}
                    </div>
                    <Badge className={`${activeMacroData?.badgeClass} px-3 py-1 text-[10px] uppercase tracking-widest`}>
                      Setor Selecionado
                    </Badge>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
                    {activeMacroData?.title}
                  </h1>
                  <p className="text-slate-400 mt-4 max-w-2xl text-lg">
                    {activeMacroData?.subtitle}. Explore os módulos inteligentes disponíveis para essa arquitetura corporativa.
                  </p>
                </div>
              </div>

              {/* AVATAR PRESENTATION VIDEO */}
              {activeMacroData?.avatarVideo && (
                <div className="w-full mb-16 flex flex-col items-center">
                  <div className={`relative w-full max-w-4xl aspect-video rounded-[32px] overflow-hidden border ${macroColor.border} bg-slate-900/50 shadow-[0_0_80px_rgba(0,0,0,0.5)] group`}>
                    <CustomVideoPlayer src={activeMacroData.avatarVideo} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 pointer-events-none border-[2px] border-transparent group-hover:${macroColor.border} rounded-[32px] transition-colors duration-700`} />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-slate-500">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Mensagem do Especialista Nexus</span>
                  </div>
                </div>
              )}

              {/* Grid dos Módulos Internos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeModules.map((mod, i) => {
                  const c = colorMap[mod.color];
                  return (
                    <motion.button
                      key={mod.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setAberto(mod)}
                      className={`relative rounded-[32px] overflow-hidden border ${mod.frozen ? 'border-cyan-500/20 opacity-75 shadow-[0_0_30px_rgba(6,182,212,0.02)]' : `${c.border} ${c.glow} hover:border-opacity-60`} bg-slate-900/40 backdrop-blur-xl group text-left hover:-translate-y-2 transition-all duration-500`}
                    >
                      {/* IMAGEM */}
                      <div className={`relative h-56 overflow-hidden bg-gradient-to-br from-slate-900 to-transparent ${mod.frozen ? 'grayscale opacity-50' : ''}`}>
                        <Image src={mod.image} alt={mod.highlight} fill className={`object-cover p-5 transition-transform duration-700 ${mod.frozen ? '' : 'group-hover:scale-110'}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                          <Badge className={`${mod.frozen ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/20' : `${c.badge} text-white border-none`} px-3 py-1 text-[9px] font-black tracking-widest uppercase shadow-xl`}>
                            {mod.frozen ? 'EM DESENVOLVIMENTO' : mod.badge}
                          </Badge>
                        </div>
                      </div>

                      {/* INFO */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${mod.frozen ? 'bg-cyan-950/40 border border-cyan-500/10' : c.bg}`}>
                            <mod.icon className={`h-5 w-5 ${mod.frozen ? 'text-cyan-400' : c.text}`} />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${mod.frozen ? 'text-cyan-500' : c.text}`}>{mod.title}</span>
                        </div>
                        <div>
                          <h3 className={`text-2xl font-black uppercase tracking-tight ${mod.frozen ? 'text-slate-400 font-bold' : 'text-white'} mb-1`}>
                            {mod.highlight}
                          </h3>
                          <p className={`text-sm leading-relaxed line-clamp-2 ${mod.frozen ? 'text-slate-600' : 'text-slate-400'}`}>{mod.subtitle}</p>
                        </div>
                        <div className={`flex items-center justify-between pt-4 border-t ${mod.frozen ? 'border-cyan-500/10' : c.border}`}>
                          <span className={`text-xs font-black uppercase tracking-widest ${mod.frozen ? 'text-slate-500' : 'text-white'}`}>Ler Detalhes</span>
                          <div className={`p-2 rounded-full ${mod.frozen ? 'bg-slate-800' : c.bg} group-hover:translate-x-1 transition-transform`}>
                            <ArrowRight className={`h-3 w-3 ${mod.frozen ? 'text-slate-600' : c.text}`} />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* SOB ENCOMENDA CTA */}
              <div className="mt-12 relative rounded-[40px] overflow-hidden border border-white/10 bg-slate-900/30 backdrop-blur-xl group flex flex-col md:flex-row justify-between items-center text-left p-8 md:p-12 hover:bg-slate-800/40 hover:border-white/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000" />
                <div className="flex items-center gap-8 relative z-10 mb-8 md:mb-0">
                  <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 shrink-0 hidden md:flex">
                    <Sparkles className="h-10 w-10 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">Não encontrou o que precisava?</h3>
                    <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                      Se a sua operação exige uma arquitetura customizada, entre em contato e solicite sob encomenda. Desenvolvemos módulos exclusivos conectando as tecnologias Nexus diretamente ao seu negócio.
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full md:w-auto bg-[#00D4FF] text-black hover:bg-[#00D4FF]/90 font-black uppercase tracking-widest px-10 h-14 rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.3)] transition-all hover:scale-105 relative z-10" onClick={() => gtag.event({ action: 'contact_click', category: 'nexus_empresas', label: 'custom_engineering' })}>
                  <Link href={WHATSAPP_URL} target="_blank">Solicitar Engenharia</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DETALHE (Mantido idêntico, apenas renderizado globalmente) */}
      <Dialog open={!!aberto} onOpenChange={o => { if(!o) setAberto(null); setModalTab('detalhes'); }}>
        <DialogContent className="bg-[#020A14] border-white/10 text-white max-w-5xl max-h-[90vh] overflow-y-auto rounded-[40px] p-0 z-50">
          {aberto && (() => {
            const c = colorMap[aberto.color];
            return (
              <div className="flex flex-col lg:flex-row min-h-[500px]">
                <div className={`lg:w-2/5 relative h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-slate-900 to-transparent flex-shrink-0`}>
                  <Image src={aberto.image} alt={aberto.highlight} fill className="object-cover p-8" />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <Badge className={`${c.badge} text-white border-none px-3 py-1 text-[9px] font-black tracking-widest uppercase`}>{aberto.badge}</Badge>
                    <div className={`p-2 rounded-xl bg-black/40 border border-white/10 w-fit`}>
                      <aberto.icon className={`h-5 w-5 ${c.text}`} />
                    </div>
                  </div>
                </div>
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
                      <div className={`p-6 rounded-2xl border ${c.border} bg-slate-900/50 flex flex-col gap-5`}>
                        <div className="border-b border-white/10 pb-4 text-center sm:text-left">
                          <h4 className="text-lg font-black text-white uppercase tracking-tight">Licença Individual <span className="text-slate-500 font-bold mx-2">-</span> <span className="text-slate-400">Módulo Avulso</span></h4>
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
                    </div>
                  )}
                  <div className="flex gap-3 w-full">
                    {aberto.frozen ? (
                      <Button disabled className="w-full bg-slate-900/50 text-slate-500 border border-slate-800 font-black uppercase tracking-widest h-12 rounded-2xl cursor-not-allowed">Módulo Temporariamente Suspenso</Button>
                    ) : (
                      <>
                        {'href' in aberto && aberto.href && (
                          <Button asChild variant="outline" className={`flex-1 border ${c.border} ${c.text} font-black uppercase tracking-widest h-12 rounded-2xl gap-2`}>
                            <Link href={(aberto as any).href}><Eye className="h-4 w-4" /> Acessar Módulo</Link>
                          </Button>
                        )}
                        <Button asChild className={`${'href' in aberto && aberto.href ? 'flex-1' : 'w-full'} bg-transparent border-2 ${c.btn} font-black uppercase tracking-widest h-12 rounded-2xl`} onClick={() => gtag.event({ action: 'contact_click', category: 'nexus_empresas', label: aberto.gtag })}>
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
