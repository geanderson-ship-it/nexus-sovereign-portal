// Interface do Banco de Dados de Preços da Nexus (Mock/LocalHost)
// Você pode editar este arquivo posteriormente para conectar a uma API real (ex: fetch('http://localhost:3000/api/produtos'))

export const tabelaPrecosNexus = [
  {
    id: "NEX-001",
    nome: "Mentoria de Liderança Humanizada (Individual)",
    categoria: "Mentoria",
    precoVenda: 5000.00,
    custoEstimado: 800.00,
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-002",
    nome: "Treinamento In-Company (Gestão de Conflitos)",
    categoria: "Corporativo",
    precoVenda: 12500.00,
    custoEstimado: 2500.00,
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-003",
    nome: "Curso Online: Inteligência Emocional Básica",
    categoria: "EAD",
    precoVenda: 497.00,
    custoEstimado: 50.00,
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-004",
    nome: "Consultoria Estratégica (Por Hora)",
    categoria: "Consultoria",
    precoVenda: 850.00,
    custoEstimado: 0.00,
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-005",
    nome: "Palestra Magna (Geanderson Schuh)",
    categoria: "Eventos",
    precoVenda: 15000.00,
    custoEstimado: 3000.00,
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-006",
    nome: "Inova Moda 360",
    categoria: "SaaS Enterprise",
    precoVenda: 45000.00,
    mensalidade: 15000.00,
    custoEstimado: 5000.00,
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-007",
    nome: "Vitrine Inovadora",
    categoria: "SaaS Enterprise",
    precoVenda: 45000.00,
    mensalidade: 15000.00,
    custoEstimado: 5000.00,
    moeda: "BRL",
    status: "Ativo"
  }
];

export async function fetchTabelaDePrecos() {
  // Simulando o tempo de consulta em um banco de dados real
  return new Promise((resolve) => {
    setTimeout(() => resolve(tabelaPrecosNexus), 800);
  });
}
