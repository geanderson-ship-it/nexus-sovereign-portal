// Interface do Banco de Dados de Preços da Nexus (Mock/LocalHost)
// Você pode editar este arquivo posteriormente para conectar a uma API real (ex: fetch('http://localhost:3000/api/produtos'))

export const tabelaPrecosNexus = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MENTORIA E TREINAMENTO CORPORATIVO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "NEX-001",
    nome: "Mentoria de Liderança Humanizada (Individual)",
    categoria: "Mentoria",
    precoVenda: 5000.00,
    custoEstimado: 800.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "corporativo"
  },
  {
    id: "NEX-002",
    nome: "Treinamento In-Company (Gestão de Conflitos)",
    categoria: "Corporativo",
    precoVenda: 12500.00,
    custoEstimado: 2500.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa"
  },
  {
    id: "NEX-003",
    nome: "Curso Online: Inteligência Emocional Básica",
    categoria: "EAD",
    precoVenda: 497.00,
    custoEstimado: 50.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "educacao"
  },
  {
    id: "NEX-004",
    nome: "Consultoria Estratégica (Por Hora)",
    categoria: "Consultoria",
    precoVenda: 850.00,
    custoEstimado: 0.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "corporativo"
  },
  {
    id: "NEX-005",
    nome: "Palestra Magna (Geanderson Schuh)",
    categoria: "Eventos",
    precoVenda: 15000.00,
    custoEstimado: 3000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "corporativo"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SAAS PARA VAREJO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "NEX-006",
    nome: "Inova Moda 360 (Provador Virtual)",
    categoria: "SaaS Enterprise",
    precoVenda: 45000.00,
    mensalidade: 15000.00,
    custoEstimado: 5000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "moda",
    descricao: "+40% conversão | -70% devoluções"
  },
  {
    id: "NEX-007",
    nome: "Vitrine Inovadora (Sinalização Digital)",
    categoria: "SaaS Enterprise",
    precoVenda: 45000.00,
    mensalidade: 15000.00,
    custoEstimado: 5000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "moveis",
    descricao: "QR Code → WhatsApp vendedor em segundos"
  },
  {
    id: "NEX-008",
    nome: "Inova Revenda (Vitrine Digital + Simulador)",
    categoria: "SaaS Enterprise",
    precoVenda: 35000.00,
    mensalidade: 12000.00,
    custoEstimado: 4000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "veiculo",
    descricao: "Cliente simula parcela online | Score de crédito em tempo real"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DANTE SAFRA - AGRICULTURA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "NEX-009",
    nome: "Dante Safra (Agricultor - Licença Anual)",
    categoria: "SaaS",
    precoVenda: 999.00,
    custoEstimado: 100.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "agricultura",
    descricao: "Diagnóstico de pragas + Consultoria agrícola 24h + Offline"
  },
  {
    id: "NEX-010",
    nome: "Dante Safra (Cooperativa - Implementação)",
    categoria: "SaaS Enterprise",
    precoVenda: 25000.00,
    mensalidade: 5000.00,
    custoEstimado: 2000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "agricultura",
    descricao: "Solução corporativa para cooperativas e associações"
  },
  {
    id: "NEX-011",
    nome: "Dante Safra (Município/Prefeitura - Licitação)",
    categoria: "SaaS B2G",
    precoVenda: 50000.00,
    mensalidade: 8000.00,
    custoEstimado: 5000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "agricultura",
    descricao: "Solução governamental para desenvolvimento rural"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NEXUS ESTUDIO - RADIO/PODCAST
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "NEX-012",
    nome: "Nexus Estúdio (Locutor Virtual)",
    categoria: "SaaS",
    precoVenda: 8000.00,
    mensalidade: 2500.00,
    custoEstimado: 800.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "radio",
    descricao: "Locuções automáticas 24h | Voz neural profissional"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NEXUS EMPRESAS - B2B ON-PREMISE (11 MODULOS)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "NEX-013",
    nome: "Nexus Vendas (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 13500.00,
    mensalidade: 540.00,
    custoEstimado: 1000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "CRM inteligente com previsão de vendas"
  },
  {
    id: "NEX-014",
    nome: "Nexus Manufatura (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 15000.00,
    mensalidade: 600.00,
    custoEstimado: 1200.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Otimização de produção com IA"
  },
  {
    id: "NEX-015",
    nome: "Nexus RH (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 12000.00,
    mensalidade: 480.00,
    custoEstimado: 900.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Gestão de pessoas com análise comportamental"
  },
  {
    id: "NEX-016",
    nome: "Nexus Logística (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 14000.00,
    mensalidade: 560.00,
    custoEstimado: 1100.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Otimização de rotas e cadeia de suprimentos"
  },
  {
    id: "NEX-017",
    nome: "Nexus Financeiro (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 13000.00,
    mensalidade: 520.00,
    custoEstimado: 1000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Inteligência financeira e cash flow"
  },
  {
    id: "NEX-018",
    nome: "Nexus Qualidade (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 11500.00,
    mensalidade: 460.00,
    custoEstimado: 800.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Controle de qualidade com visão computacional"
  },
  {
    id: "NEX-019",
    nome: "Nexus Compliance (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 12500.00,
    mensalidade: 500.00,
    custoEstimado: 900.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Conformidade regulatória automatizada"
  },
  {
    id: "NEX-020",
    nome: "Nexus Atendimento (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 10000.00,
    mensalidade: 400.00,
    custoEstimado: 700.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Chatbot e call center inteligente"
  },
  {
    id: "NEX-021",
    nome: "Nexus Gestão (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 11000.00,
    mensalidade: 440.00,
    custoEstimado: 750.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Dashboards executivos unificados"
  },
  {
    id: "NEX-022",
    nome: "Nexus Sustentabilidade (Módulo)",
    categoria: "SaaS B2B",
    precoVenda: 9500.00,
    mensalidade: 380.00,
    custoEstimado: 600.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Rastreamento de ESG e carbono"
  },
  {
    id: "NEX-023",
    nome: "Nexus Empresas (Pacote Enterprise - 11 Módulos)",
    categoria: "SaaS B2B",
    precoVenda: 120000.00,
    mensalidade: 4800.00,
    custoEstimado: 10000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "empresa",
    descricao: "Todos os 11 módulos integrados com 35% desconto"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NEXUS HEALTH - SAUDE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "NEX-024",
    nome: "Nexus Health (IA de Diagnóstico Médico)",
    categoria: "SaaS Enterprise",
    precoVenda: 50000.00,
    mensalidade: 15000.00,
    custoEstimado: 5000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "saude",
    descricao: "94.7% acurácia | Triagem de imagens médicas"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NEXUS ENERGIA (HELIOS) - SETOR ENERGÉTICO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "NEX-025",
    nome: "Nexus Energia - Usinas Renováveis",
    categoria: "SaaS B2B",
    precoVenda: 75000.00,
    mensalidade: 18000.00,
    custoEstimado: 8000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "energia",
    descricao: "Manutenção preditiva para painéis e eólicas"
  },
  {
    id: "NEX-026",
    nome: "Nexus Energia - Trading (Mercado Livre)",
    categoria: "SaaS B2B",
    precoVenda: 55000.00,
    mensalidade: 13000.00,
    custoEstimado: 5000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "energia",
    descricao: "Previsão de PLD e otimização de consumo"
  },
  {
    id: "NEX-027",
    nome: "Nexus Energia - Concessionária/Distribuição",
    categoria: "SaaS B2G",
    precoVenda: 100000.00,
    mensalidade: 20000.00,
    custoEstimado: 10000.00,
    moeda: "BRL",
    status: "Ativo",
    nicho: "energia",
    descricao: "Zero apagões | Detecção de fraudes"
  }
];

export async function fetchTabelaDePrecos() {
  // Simulando o tempo de consulta em um banco de dados real
  return new Promise((resolve) => {
    setTimeout(() => resolve(tabelaPrecosNexus), 800);
  });
}
