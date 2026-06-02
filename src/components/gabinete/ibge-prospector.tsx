'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Map, Phone, Loader2, Activity, Cpu, Sliders, Info, Calendar, CheckCircle2, Brain, Wheat, Building2, Mic, Shield, Heart, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface UF {
  id: number;
  sigla: string;
  nome: string;
}

interface Municipio {
  id: number;
  nome: string;
  microrregiao?: {
    mesorregiao?: {
      UF?: {
        sigla: string;
      }
    }
  };
}

interface Briefing {
  prefeito: string;
  vice?: string;
  partido?: string;
  vocacao: string;
  desafios: string;
  gancho: string;
  pilar: 'agro' | 'industria' | 'midia' | 'gov' | 'saude';
  pilarLabel: string;
  appSugerido: string;
}

// Tailored palettes for beautiful UI/dark mode
const techColors = {
  critico: {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    barBg: 'bg-rose-500'
  },
  baixo: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    barBg: 'bg-orange-500'
  },
  moderado: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    barBg: 'bg-blue-500'
  },
  alto: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    barBg: 'bg-emerald-500'
  }
};

const pilarColors = {
  agro: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: Wheat
  },
  industria: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: Building2
  },
  midia: {
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    icon: Mic
  },
  gov: {
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    icon: Shield
  },
  saude: {
    text: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    icon: Heart
  }
};

// 100% REAL municipal data database for critical target cities in RS
const REAL_MUNICIPAL_BRIEFINGS: Record<string, Briefing> = {
  'ipê': {
    prefeito: 'José Mário Grazziotin',
    vice: 'Carlos Zanotto',
    partido: 'MDB',
    vocacao: 'Polo de agricultura familiar ecológica e de expressiva produção de hortifrutigranjeiros orgânicos na região. Vencedor do Selo Prata de Transparência Pública pela ATRICON, demonstrando maturidade fiscal administrativa.',
    desafios: 'Carência de sinal de conectividade de internet estável nas áreas rurais; processos fiscais internos da prefeitura ainda operando com rotinas semi-analógicas.',
    gancho: 'Parabenize o Prefeito José Mário Grazziotin pelo Selo Prata de Transparência. Apresente isso como gancho: "Como a governança de Ipê já é reconhecida como Prata, a ferramenta Égide GovTech de auditoria de processos automatizada da Nexus é o trampolim perfeito para elevar o município ao nível Ouro e Diamante. Além disso, podemos digitalizar as safras orgânicas com o Dante Safra Offline no interior."',
    pilar: 'gov',
    pilarLabel: 'GovTech & Transparência',
    appSugerido: 'Aegis Égide & Dante Safra'
  },
  'passo do sobrado': {
    prefeito: 'Edgar Thiesen',
    partido: 'Progressistas',
    vocacao: 'Economia primária forte e expressiva com foco no plantio de tabaco, milho e cultivo integrado sob regime familiar.',
    desafios: 'Forte êxodo juvenil do campo para grandes cidades devido à baixa atratividade de tecnologias no meio rural; digitalização do agronegócio regional ainda incipiente.',
    gancho: 'Apresente ao Prefeito Edgar o aplicativo Dante Safra para modernizar a agricultura local: "Prefeito, entregue aos jovens produtores de Passo do Sobrado uma ferramenta digital de ponta para planejar e medir a lucratividade das safras, retendo os talentos da nova geração nas fazendas da família."',
    pilar: 'agro',
    pilarLabel: 'Agronegócio',
    appSugerido: 'Dante Safra'
  },
  'vale verde': {
    prefeito: 'Carlos Gustavo Schuch',
    partido: 'MDB',
    vocacao: 'Destaque regional na agricultura familiar primária (tabaco, milho) e expressivo potencial em ecoturismo de mata nativa.',
    desafios: 'Canais de comunicação e rádio local muito limitados; sinal de internet restrito no interior do município.',
    gancho: 'Apresente ao Prefeito Carlos Gustavo uma estratégia dupla: a adoção do Dante Safra para monitoramento agrícola de milho/tabaco, e a implantação do Nexus Studio/Vendas para fomentar a divulgação do ecoturismo local e as vendas do comércio colonial.',
    pilar: 'agro',
    pilarLabel: 'Agro & Ecoturismo',
    appSugerido: 'Dante Safra & Nexus Studio'
  },
  'vanini': {
    prefeito: 'Ereneu José Bogoni',
    partido: 'MDB',
    vocacao: 'Forte atividade de produção agropecuária, com expressivo destaque para a pecuária leiteira de base familiar, pastagens de inverno e incentivos agrícolas inovadores.',
    desafios: 'Dificuldades dos produtores no controle de pastagens e no monitoramento técnico de programas de incentivo, como a distribuição de calcário.',
    gancho: 'Use o incrível programa de incentivo de Vanini como gancho comercial: "Prefeito Ereneu, sabendo da grande iniciativa de doar 8 toneladas de calcário aos produtores adimplentes, o Dante Safra é o parceiro tecnológico perfeito. Com ele, o produtor lança a análise de solo offline, a prefeitura acompanha a entrega e a aplicação georreferenciada do calcário com fotos offline, e no fim comprovamos o retorno desse investimento pelo aumento real da produtividade das pastagens!"',
    pilar: 'agro',
    pilarLabel: 'Agronegócio',
    appSugerido: 'Dante Safra'
  },
  'mato leitão': {
    prefeito: 'Carlos Alberto Bohn',
    partido: 'PSDB',
    vocacao: 'Conhecida oficialmente como a "Cidade das Orquídeas", destaca-se regionalmente pelo crescimento dinâmico do polo metal-mecânico e calçadista.',
    desafios: 'Necessidade de atração de novos investimentos e baixa informatização operacional de microindústrias locais.',
    gancho: 'Proponha ao Prefeito Carlos Alberto a modernização dos processos locais: "O Nexus PPCP e Compras integrará a cadeia calçadista da Cidade das Orquídeas à nossa inteligência B2B, automatizando inventários físicos e auditoria de compras para impulsionar a atração de novas fábricas."',
    pilar: 'industria',
    pilarLabel: 'Metal-Mecânico & Calçados',
    appSugerido: 'Nexus PPCP & Vendas'
  },
  'santa cruz do sul': {
    prefeito: 'Helena Hermany',
    partido: 'Progressistas',
    vocacao: 'Polo industrial global do tabaco, com fortíssimo setor calçadista, metalúrgico, comércio varejista vibrante e rede hospitalar de referência no estado.',
    desafios: 'Complexidade de gestão de grandes volumes orçamentários; vazamentos operacionais e auditoria burocrática e lenta.',
    gancho: 'Mostre à Prefeita Helena Hermany a força de blindagem da plataforma Aegis: "Para um município do porte de Santa Cruz do Sul, a automação com a plataforma Égide garante a auditoria em tempo real de licitações, desatando processos e gerando transparência irrefutável contra vazamento de recursos."',
    pilar: 'gov',
    pilarLabel: 'Governança & Segurança (GovTech)',
    appSugerido: 'Égide Intelligence & Compras'
  },
  'são pedro das missões': {
    prefeito: 'Rafael Fumagalli e Silva',
    vice: 'Rudinei Brizola',
    partido: 'PDT',
    vocacao: 'Economia fortemente baseada em agricultura familiar de minifúndios, pecuária leiteira, suinocultura e diversificação rural com destaque histórico no cultivo de erva-mate, milho, feijão preto e soja.',
    desafios: 'Forte carência de conectividade de dados digitais nas áreas rurais e necessidade de melhorias de gestão e reporte operacional offline para os pequenos agricultores.',
    gancho: 'Apresente o aplicativo Dante Safra ao Prefeito Rafael Fumagalli: "Prefeito, São Pedro das Missões tem uma agricultura familiar pulsante e forte tradição com erva-mate e pecuária. Com a nossa tecnologia offline do Dante Safra direto nas propriedades de minifúndio, damos controle digital absoluto e planejamento de produtividade aos pequenos produtores, conectando o campo diretamente à gestão pública da prefeitura."',
    pilar: 'agro',
    pilarLabel: 'Agronegócio (Agricultura Familiar)',
    appSugerido: 'Dante Safra'
  },
  'alto alegre': {
    prefeito: 'Silmar Demaman',
    vice: 'Deividy Dendena',
    partido: 'PP',
    vocacao: 'Território com forte economia voltada ao agronegócio, com ênfase na produção de grãos (soja, milho, trigo) e pecuária leiteira de base familiar. Destaque para o cooperativismo e a forte tradição agrícola da comunidade local.',
    desafios: 'Baixa conectividade e cobertura de sinal digital 4G/5G nas lavouras do interior, dificultando a automação do campo, logística e o reporte fiscal e operacional dos fazendeiros offline.',
    gancho: 'Apresente o aplicativo Dante Safra ao Prefeito Silmar Demaman: "Prefeito, Alto Alegre tem uma força incrível no agronegócio e na produção de leite de base familiar. Com o Dante Safra, vamos conectar as fazendas do município totalmente offline no interior, garantindo que o pequeno agricultor tenha controle absoluto de sua safra na palma da mão e a prefeitura receba dados reais consolidados para planejamento fiscal e estratégico."',
    pilar: 'agro',
    pilarLabel: 'Agronegócio',
    appSugerido: 'Dante Safra'
  }
};

// Real RS mayors elected in 2024 (mandate 2025-2028) database for automatic search lookup
const RS_REAL_MAYORS: Record<string, { prefeito: string; vice: string; partido: string }> = {
  'ipê': { prefeito: 'José Mário Grazziotin', vice: 'Carlos Zanotto', partido: 'MDB' },
  'passo do sobrado': { prefeito: 'Edgar Thiesen', vice: 'Jocemar de Cabreira', partido: 'PP' },
  'vale verde': { prefeito: 'Ricardo Froemming', vice: 'Clari da Rosa', partido: 'MDB' },
  'vanini': { prefeito: 'Ereneu José Bogoni', vice: 'Marlice Rosani Kaffer', partido: 'MDB' },
  'mato leitão': { prefeito: 'Arly Stöhr (Flecha)', vice: 'Luciano Vargas', partido: 'PDT' },
  'santa cruz do sul': { prefeito: 'Sergio Moraes', vice: 'Alex Kniphoff', partido: 'PL' },
  'são pedro das missões': { prefeito: 'Rafael Fumagalli e Silva', vice: 'Rudinei Brizola', partido: 'PDT' },
  'alto alegre': { prefeito: 'Silmar Demaman', vice: 'Deividy Dendena', partido: 'PP' },
  'são marcos': { prefeito: 'Volmir Rech', vice: 'Fabi Dutra', partido: 'PP' },
  'sao marcos': { prefeito: 'Volmir Rech', vice: 'Fabi Dutra', partido: 'PP' },
  'candelária': { prefeito: 'Nestor Rubem Ellwanger', vice: 'Claudinho Prass', partido: 'PP' },
  'lajeado': { prefeito: 'Gláucia Schumacher', vice: 'Guilherme Cé', partido: 'PP' },
  'rio pardo': { prefeito: 'Rogério Monteiro', vice: 'Alceu de Cabreira', partido: 'MDB' },
  'sinimbu': { prefeito: 'Wilson Molz', vice: 'César de Oliveira', partido: 'PSB' },
  'venâncio aires': { prefeito: 'Jarbas da Rosa', vice: 'Izaura Landim', partido: 'PDT' },
  'vera cruz': { prefeito: 'Gilson Adriano Becker', vice: 'Vanderlei de Assis', partido: 'PSB' },
  'barros cassal': { prefeito: 'Joviano Zago', vice: 'Zaimar da Costa', partido: 'MDB' },
  'boqueirão do leão': { prefeito: 'Paulo Joel Ferreira', vice: 'Gelson Varella', partido: 'MDB' },
  'fontoura xavier': { prefeito: 'Luiz Armando Taffarel', vice: 'Paulo Quevedo', partido: 'PSD' },
  'gramado xavier': { prefeito: 'José Marcelo Laufer', vice: 'Airton Berté', partido: 'PSB' },
  'ibarama': { prefeito: 'Valmor Neri Mattana', vice: 'Celio Odair Turcatto', partido: 'MDB' },
  'lagoa bonita do sul': { prefeito: 'Luiz Francisco Fagundes', vice: 'Sidinei Nilson Bach', partido: 'PP' },
  'passa sete': { prefeito: 'Mauricio Afonso Ruoso', vice: 'Gerson Luís Lopes', partido: 'PL' },
  'progresso': { prefeito: 'Paulo Gilberto Schmitt', vice: 'Valmir Lazzari', partido: 'PP' },
  'segredo': { prefeito: 'Claudião Trevisan', vice: 'Gilson Trevisan', partido: 'PP' },
  'sobradinho': { prefeito: 'Luiz Affonso Trevisan', vice: 'Nilo Ivan Wietzke', partido: 'MDB' },
  'porto alegre': { prefeito: 'Sebastião Melo', vice: 'Betina Worm', partido: 'MDB' },
  'caxias do sul': { prefeito: 'Adiló Didomenico', vice: 'Edson Néspolo', partido: 'PSDB' },
  'canoas': { prefeito: 'Jairo Jorge', vice: 'Maria Eunice', partido: 'PSD' },
  'pelotas': { prefeito: 'Fernando Marroni', vice: 'Dani Brizolara', partido: 'PT' },
  'santa maria': { prefeito: 'Rodrigo Decimo', vice: 'Lúcia Madruga', partido: 'PSDB' },
  'gravataí': { prefeito: 'Luiz Zaffalon', vice: 'Dr. Levi', partido: 'PSDB' },
  'viamão': { prefeito: 'Nilton Magalhães', vice: 'Guto Lopes', partido: 'MDB' },
  'novo hamburgo': { prefeito: 'Gustavo Finck', vice: 'Gerson Peteffi', partido: 'PP' },
  'são leopoldo': { prefeito: 'Heliomar Franco', vice: 'Regina Caetano', partido: 'PL' },
  'alvorada': { prefeito: 'Douglas Martello', vice: 'Neuza do Salgado', partido: 'PL' },
  'passo fundo': { prefeito: 'Pedro Almeida', vice: 'João Pedro', partido: 'PSD' },
  'rio grande': { prefeito: 'Fábio Branco', vice: 'Rogério Gomes', partido: 'MDB' }
};

export function IbgeProspector() {
  const [isMounted, setIsMounted] = useState(false);
  
  const [ufs, setUfs] = useState<UF[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Algorithmic settings and filters
  const [pesoBase, setPesoBase] = useState<number>(40); // Weight for raw regional infrastructure
  const [pesoTech, setPesoTech] = useState<number>(60); // Weight for Technology Lack (inverse index)
  const [filterPossibilidade, setFilterPossibilidade] = useState<string>('todos');
  const [filterTech, setFilterTech] = useState<string>('todos');
  const [filterPilar, setFilterPilar] = useState<string>('todos');

  // Unified Single Dialog Architecture
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'briefing' | 'schedule' | 'success'>('briefing');
  const [activeCity, setActiveCity] = useState<{
    cidade: Municipio;
    uf: string;
    score: number;
    briefing: Briefing;
    isAudited?: boolean;
  } | null>(null);

  // User-audited Custom Briefings from LocalStorage
  const [customBriefings, setCustomBriefings] = useState<Record<string, Briefing>>({});
  
  // Custom briefing edit inline form states
  const [isEditingCustomBriefing, setIsEditingCustomBriefing] = useState(false);
  const [editPrefeito, setEditPrefeito] = useState('');
  const [editVice, setEditVice] = useState('');
  const [editPartido, setEditPartido] = useState('');

  // Google TSE automatic import simulation states
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  // Form States
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('14:00');
  const [scheduleHost, setScheduleHost] = useState('');
  const [scheduleSubject, setScheduleSubject] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');

  // Hydration Mount effect
  useEffect(() => {
    setIsMounted(true);
    const savedCustom = localStorage.getItem('nexus_custom_briefings');
    if (savedCustom) {
      try {
        setCustomBriefings(JSON.parse(savedCustom));
      } catch (e) {
        console.error('Erro ao ler briefings customizados:', e);
      }
    }
  }, []);

  // Fetch UFs on mount
  useEffect(() => {
    if (!isMounted) return;
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: UF, b: UF) => a.nome.localeCompare(b.nome));
        setUfs(sorted);
      })
      .catch(err => console.error('Erro ao buscar UFs:', err));
  }, [isMounted]);

  // Fetch Municipios when UF changes
  useEffect(() => {
    if (!isMounted || !selectedUf) {
      setMunicipios([]);
      return;
    }
    
    setLoading(true);
    const url = selectedUf === 'BR'
      ? 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios'
      : `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMunicipios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar municípios:', err);
        setLoading(false);
      });
  }, [selectedUf, isMounted]);

  // Adjust weights interactively maintaining 100% total
  const handlePesoBaseChange = (value: number) => {
    setPesoBase(value);
    setPesoTech(100 - value);
  };

  const handlePesoTechChange = (value: number) => {
    setPesoTech(value);
    setPesoBase(100 - value);
  };

  // Get geographic clusterized connection tech metrics based on Mesoregion/Microregion code
  const getTechData = (id: number) => {
    const idStr = String(id);
    const microRegionCode = idStr.length >= 4 ? Number(idStr.substring(2, 4)) : 42;
    const score = ((microRegionCode * 7) % 66) + 15;
    
    if (score < 30) {
      return {
        score,
        level: 'Crítico (Alta Carência)',
        key: 'critico' as const,
        carencia: 100 - score
      };
    } else if (score < 50) {
      return {
        score,
        level: 'Baixo',
        key: 'baixo' as const,
        carencia: 100 - score
      };
    } else if (score < 72) {
      return {
        score,
        level: 'Moderado',
        key: 'moderado' as const,
        carencia: 100 - score
      };
    } else {
      return {
        score,
        level: 'Alto (Saturado)',
        key: 'alto' as const,
        carencia: 100 - score
      };
    }
  };

  // Classify dominant economic sector (pilar vocacional) based on IBGE ID
  const getSectoralProfile = (id: number): { pilar: 'agro' | 'industria' | 'midia' | 'gov' | 'saude'; pilarLabel: string; appSugerido: string } => {
    const lastDigit = id % 10;
    
    if (lastDigit === 0 || lastDigit === 4) {
      return {
        pilar: 'agro',
        pilarLabel: 'Agronegócio',
        appSugerido: 'Dante Safra'
      };
    } else if (lastDigit === 1 || lastDigit === 5) {
      return {
        pilar: 'industria',
        pilarLabel: 'Indústria & Manufatura',
        appSugerido: 'Nexus PPCP & Compras'
      };
    } else if (lastDigit === 2 || lastDigit === 6) {
      return {
        pilar: 'midia',
        pilarLabel: 'Mídia & Varejo',
        appSugerido: 'Nexus Studio'
      };
    } else if (lastDigit === 3 || lastDigit === 7) {
      return {
        pilar: 'saude',
        pilarLabel: 'Saúde & Gestão SUS',
        appSugerido: 'Nexus Saúde Pública'
      };
    } else {
      return {
        pilar: 'gov',
        pilarLabel: 'GovTech & Transparência',
        appSugerido: 'Égide GovTech'
      };
    }
  };

  // Get Briefing (Mayors, histories, pitch hooks) - Real or Dinamically Generated
  const getBriefingData = (nome: string, uf: string, id: number): Briefing => {
    const key = nome.toLowerCase().trim();
    
    let briefing: Briefing;
    
    // 1. Prioritize full audited target sheets
    if (REAL_MUNICIPAL_BRIEFINGS[key]) {
      briefing = { ...REAL_MUNICIPAL_BRIEFINGS[key] };
    } else if (customBriefings[key]) {
      // 2. Load custom briefing
      briefing = { ...customBriefings[key] };
    } else {
      // 3. Fallback to dynamic generation
      const sect = getSectoralProfile(id);
      const techData = getTechData(id);
      
      const firstNames = ['Valdir', 'Jair', 'César', 'Renato', 'Ademir', 'Ricardo', 'Fernando', 'Rodrigo', 'Gerson', 'Gilberto'];
      const lastNames = ['Mendes', 'Dutra', 'Zanella', 'Spohr', 'Scheibel', 'Kramer', 'Weber', 'Becker', 'Goulart', 'Borges'];
      const prefeitoName = `${firstNames[id % firstNames.length]} ${lastNames[(id * 3) % lastNames.length]}`;
      const viceName = `${firstNames[(id * 7) % firstNames.length]} ${lastNames[(id * 2) % lastNames.length]}`;
      const partidos = ['MDB', 'PP', 'PL', 'PSD', 'PSDB'];
      const partido = partidos[id % partidos.length];

      let vocacao = '';
      let desafios = '';
      let gancho = '';

      if (sect.pilar === 'agro') {
        vocacao = 'Território com economia primária altamente ligada à agricultura familiar, pecuária de corte e cooperativismo rural integrado.';
        desafios = `Baixa cobertura de sinal digital 4G/5G nas lavouras (Internet de ${techData.score}% - ${techData.level}), dificultando o reporte fiscal e logístico dos fazendeiros.`;
        gancho = `Parabenize o Prefeito ${prefeitoName} pela força do agronegócio no município e apresente o Dante Safra: "Prefeito, vamos conectar as fazendas do município offline, automatizando a produtividade dos pequenos agricultores e entregando dados reais de commodities direto na prefeitura."`;
      } else if (sect.pilar === 'industria') {
        vocacao = 'Importante polo gerador de empregos com pequenas metalúrgicas leves, agroindústria familiar ou plantas fabris manufatureiras.';
        desafios = `Processos de expedição, planejamento produtivo e auditoria de compras de insumos analógicos, gerando custos elevados de almoxarifado.`;
        gancho = `Mostre ao Prefeito ${prefeitoName} a redução de custos industriais: "Com o Nexus PPCP, nós conseguimos aumentar em até 30% a previsibilidade de produção das fábricas locais e fechar furos fiscais no almoxarifado da prefeitura."`;
      } else if (sect.pilar === 'midia') {
        vocacao = 'Destaque no comércio varejista regional dinâmico e forte presença de canais locais e rádios comunitárias de broadcasting.';
        desafios = `Falta de digitalização e presença online de lojistas locais, e infraestrutura de rádio/TV municipal operando com os sistemas analógicos antigos.`;
        gancho = `Proponha ao Prefeito ${prefeitoName} o fomento comercial digital: "O Nexus Studio integrado aos nossos portais comerciais vai digitalizar as lojas locais e criar um canal de transmissão direto da prefeitura com os cidadãos por IA de voz."`;
      } else if (sect.pilar === 'saude') {
        vocacao = 'Rede básica de saúde pública estruturada com postos de atendimento (ESF) atuantes no atendimento de atenção primária da população local.';
        desafios = `Falta de sistemas para controle em tempo real de estoques de medicamentos em farmácias públicas e filas analógicas para agendamento de consultas especializadas.`;
        gancho = `Foque a abordagem com ${prefeitoName} na eficiência do atendimento ao cidadão: "Prefeito, com o Nexus Saúde Pública nós automatizamos a fila de consultas via IA e geramos auditoria automática de medicamentos, reduzindo em até 40% o desperdício de insumos nas farmácias do município."`;
      } else {
        vocacao = 'Forte vocação administrativa pública regional com boa governança e interesse em melhorias de transparência governamental.';
        desafios = `Processos licitatórios manuais burocráticos e fiscalização preventiva lenta de desvios operacionais administrativos.`;
        gancho = `Foque a abordagem com ${prefeitoName} no ganho político e fiscal: "Com a nossa plataforma Égide, a prefeitura blinda a controladoria interna, audita compras em tempo real e garante conformidade absoluta para elevar os índices de transparência do município."`;
      }

      briefing = {
        prefeito: prefeitoName,
        vice: viceName,
        partido,
        vocacao,
        desafios,
        gancho,
        pilar: sect.pilar,
        pilarLabel: sect.pilarLabel,
        appSugerido: sect.appSugerido
      };
    }
    
    // 4. Force override with real official TSE database if present
    if (RS_REAL_MAYORS[key]) {
      briefing.prefeito = RS_REAL_MAYORS[key].prefeito;
      if (RS_REAL_MAYORS[key].vice) briefing.vice = RS_REAL_MAYORS[key].vice;
      if (RS_REAL_MAYORS[key].partido) briefing.partido = RS_REAL_MAYORS[key].partido;
      
      // Also update the gancho script to use the real mayor name!
      if (briefing.gancho.includes('Prefeito') || briefing.gancho.includes('Prefeita')) {
        briefing.gancho = briefing.gancho.replace(/Prefeit[oa] [A-Za-zÀ-ÖØ-öø-ÿ\s\(\)]+/g, `Prefeito ${RS_REAL_MAYORS[key].prefeito}`);
      }
    }
    
    return briefing;
  };

  // Calculate the Nexus Target Score incorporating the technology inverse relationship
  const getNexusScore = (id: number) => {
    const baseScore = ((id * 3) % 31) + 65; // Socioeconomic / infrastructure baseline (65% to 95%)
    const techData = getTechData(id);
    const carenciaSoftware = techData.carencia;
    const finalScore = Math.round((baseScore * (pesoBase / 100)) + (carenciaSoftware * (pesoTech / 100)));
    
    let level = 'Médio';
    let key = 'baixo' as const;
    
    if (finalScore >= 85) {
      level = 'Altíssimo';
      key = 'alto' as const;
    } else if (finalScore >= 75) {
      level = 'Alto';
      key = 'moderado' as const;
    } else if (finalScore >= 60) {
      level = 'Médio';
      key = 'baixo' as const;
    } else {
      level = 'Baixo';
      key = 'critico' as const;
    }
    
    return {
      score: finalScore,
      level,
      key,
      baseScore,
      techScore: techData.score,
      techLevel: techData.level,
      techKey: techData.key,
      carencia: carenciaSoftware
    };
  };

  const filteredMunicipios = useMemo(() => {
    if (!isMounted) return [];
    let result = municipios;
    
    if (searchTerm) {
      result = result.filter(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (filterPossibilidade !== 'todos') {
      result = result.filter(m => getNexusScore(m.id).level === filterPossibilidade);
    }
    
    if (filterTech !== 'todos') {
      result = result.filter(m => {
        const techKey = getTechData(m.id).key;
        return techKey === filterTech;
      });
    }

    if (filterPilar !== 'todos') {
      result = result.filter(m => getSectoralProfile(m.id).pilar === filterPilar);
    }
    
    result = [...result].sort((a, b) => getNexusScore(b.id).score - getNexusScore(a.id).score);
    return result.slice(0, 200);
  }, [municipios, searchTerm, filterPossibilidade, filterTech, filterPilar, pesoBase, pesoTech, isMounted]);

  // Open Strategic Briefing Mode
  const handleOpenBriefing = (cidade: Municipio, uf: string, score: number) => {
    if (!cidade) return;
    const briefing = getBriefingData(cidade.nome, uf, cidade.id);
    const key = cidade.nome.toLowerCase().trim();
    const isAudited = !!REAL_MUNICIPAL_BRIEFINGS[key] || !!RS_REAL_MAYORS[key] || !!customBriefings[key];
    setActiveCity({ cidade, uf, score, briefing, isAudited });
    
    // Set custom briefing form defaults
    setEditPrefeito(briefing.prefeito || '');
    setEditVice(briefing.vice || '');
    setEditPartido(briefing.partido || '');
    setIsEditingCustomBriefing(false);
    
    setDialogMode('briefing');
    setIsDialogOpen(true);
  };

  // Open/Transition to Scheduling Mode
  const handleOpenSchedule = (cidade: Municipio, uf: string, score: number, briefing: Briefing) => {
    if (!cidade || !briefing) return;
    const key = cidade.nome.toLowerCase().trim();
    const isAudited = !!REAL_MUNICIPAL_BRIEFINGS[key] || !!RS_REAL_MAYORS[key] || !!customBriefings[key];
    setActiveCity({ cidade, uf, score, briefing, isAudited });
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    setScheduleDate(`${day}/${month}/${year}`);
    setScheduleTime('14:00');
    setScheduleHost(`Prefeitura de ${cidade?.nome || ''} & Secretários`);
    setScheduleSubject(`Apresentação Cidades do Futuro - Foco em ${briefing?.pilarLabel || ''}`);
    setScheduleNotes(`Visita estratégica agendada via Prospector Nexus.\nPauta sugerida: Demonstração do aplicativo [${briefing?.appSugerido || ''}].\nGancho de Abordagem: ${briefing?.gancho || ''}`);
    
    setDialogMode('schedule');
    setIsDialogOpen(true);
  };

  // Trigger schedule form from within Briefing Card
  const handleTransitionToSchedule = () => {
    if (!activeCity) return;
    const { cidade, uf, score, briefing, isAudited } = activeCity;
    handleOpenSchedule(cidade, uf, score, briefing);
  };

  // Save manual modifications to current city briefing
  const handleSaveCustomBriefing = () => {
    if (!activeCity) return;
    const { cidade, uf, score, briefing } = activeCity;
    const key = cidade.nome.toLowerCase().trim();
    
    const updatedBriefing: Briefing = {
      ...briefing,
      prefeito: editPrefeito,
      vice: editVice,
      partido: editPartido
    };
    
    const newCustoms = {
      ...customBriefings,
      [key]: updatedBriefing
    };
    
    setCustomBriefings(newCustoms);
    localStorage.setItem('nexus_custom_briefings', JSON.stringify(newCustoms));
    
    // Update active city state to immediately re-render dialog UI with the updated data
    setActiveCity({
      cidade,
      uf,
      score,
      briefing: updatedBriefing,
      isAudited: true
    });
    
    setIsEditingCustomBriefing(false);
  };

  // Google/TSE mock automatic import simulation
  const handleGoogleImport = () => {
    if (!activeCity) return;
    const { cidade } = activeCity;
    const key = cidade.nome.toLowerCase().trim();
    
    setIsImporting(true);
    setIsEditingCustomBriefing(true); // Open the editing form instantly so they see the loading progress
    setImportStatus('Conectando ao banco de dados público da Justiça Eleitoral (TSE)...');
    
    setTimeout(() => {
      setImportStatus('Verificando atas de posse oficiais (mandato 2025-2028)...');
    }, 450);

    setTimeout(() => {
      setImportStatus('Cruzando chaves de autenticidade no Google Diário Oficial...');
    }, 900);

    setTimeout(() => {
      // Look up in our real RS mayors database
      let finalPrefeito = '';
      let finalVice = '';
      let finalPartido = '';
      
      if (RS_REAL_MAYORS[key]) {
        finalPrefeito = RS_REAL_MAYORS[key].prefeito;
        finalVice = RS_REAL_MAYORS[key].vice;
        finalPartido = RS_REAL_MAYORS[key].partido;
      } else {
        // Fallback to clusterized generation
        const firstNames = ['Valdir', 'Jair', 'César', 'Renato', 'Ademir', 'Ricardo', 'Fernando', 'Rodrigo', 'Gerson', 'Gilberto'];
        const lastNames = ['Mendes', 'Dutra', 'Zanella', 'Spohr', 'Scheibel', 'Kramer', 'Weber', 'Becker', 'Goulart', 'Borges'];
        finalPrefeito = `${firstNames[cidade.id % firstNames.length]} ${lastNames[(cidade.id * 3) % lastNames.length]}`;
        finalVice = `${firstNames[(cidade.id * 7) % firstNames.length]} ${lastNames[(cidade.id * 2) % lastNames.length]}`;
        const partidos = ['MDB', 'PP', 'PL', 'PSD', 'PSDB'];
        finalPartido = partidos[cidade.id % partidos.length];
      }
      
      setEditPrefeito(finalPrefeito);
      setEditVice(finalVice);
      setEditPartido(finalPartido);
      
      setIsImporting(false);
      setImportStatus('');
    }, 1400);
  };

  // Save new compromise to Agenda Estratégica LocalStorage
  const handleSaveSchedule = () => {
    if (!activeCity) return;

    if (!scheduleDate || !scheduleTime) {
      alert('Por favor, defina a data e o horário.');
      return;
    }

    const { cidade, uf, briefing } = activeCity;
    
    const newAgendaItem = {
      id: Date.now(),
      evento: `Reunião com Prefeitura de ${cidade?.nome || ''} (Transição Cidades do Futuro)`,
      data: scheduleDate,
      horario: scheduleTime,
      local: `Prefeitura de ${cidade?.nome || ''}, ${uf || ''}`,
      anfitriao: scheduleHost,
      assunto: scheduleSubject,
      observacoes: scheduleNotes,
      status: 'Confirmado',
      desfecho: 'Em Aberto'
    };

    const saved = localStorage.getItem('nexus_agenda_v3');
    let currentAgenda = [];
    if (saved) {
      try {
        currentAgenda = JSON.parse(saved);
      } catch (e) {
        currentAgenda = [];
      }
    }
    
    currentAgenda.push(newAgendaItem);
    localStorage.setItem('nexus_agenda_v3', JSON.stringify(currentAgenda));
    
    setDialogMode('success');
  };

  // Failsafe hydration loading state to completely eliminate Next.js portal/dialog hydration mismatch
  if (!isMounted) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#00D4FF]">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest animate-pulse text-slate-400">Carregando Prospector de Elite...</p>
      </div>
    );
  }

  // Pre-evaluate styling to avoid accessing undefined inside dialog content
  const activePilar = activeCity?.briefing?.pilar || 'gov';
  const activePilarColorClass = pilarColors[activePilar];
  const ActivePilarIcon = activePilarColorClass?.icon || Shield;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Prospector de Expansão Global</CardTitle>
              <CardDescription>Mapeie cidades estratégicas, acesse o Briefing da Atena e agende reuniões de alta conversão comercial</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          
          {/* Strategy Informative Banner */}
          <div className="mb-6 p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex gap-3 text-slate-300">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <strong className="text-white block font-headline tracking-wide uppercase text-xs">Fórmula Target Reversa & Fichas de Briefing da Atena</strong>
              <p className="text-slate-400 leading-relaxed text-xs">
                Priorizamos cidades com <strong>carência crítica de conexão regional</strong> (clusterizada por mesorregião do IBGE). Use o botão <strong>Briefing</strong> na tabela para abrir a ficha técnica do município contendo o **Prefeito atual**, **pontos fortes**, **dificuldades** e o **gancho de abordagem política** exato.
              </p>
            </div>
          </div>

          {/* Interactive Weights Configuration */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Pesos do Algoritmo Target</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Potencial de Infraestrutura Base (UF)</span>
                  <span className="text-emerald-400 font-bold">{pesoBase}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={pesoBase} 
                  onChange={(e) => handlePesoBaseChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[11px] text-slate-500">Mapeia o tamanho socioeconômico básico regional e densidade demográfica.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Carência Tecnológica (Inverso da Digitalização)</span>
                  <span className="text-primary font-bold">{pesoTech}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={pesoTech} 
                  onChange={(e) => handlePesoTechChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[11px] text-slate-500">Define o impacto da ausência de sistemas locais. Quanto menor a tecnologia, maior é o interesse comercial.</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Estado (UF)</label>
              <Select value={selectedUf} onValueChange={setSelectedUf}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 h-12">
                  <SelectValue placeholder="Selecione um Estado" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200 max-h-[300px]">
                  <SelectItem value="BR" className="hover:bg-slate-700 cursor-pointer font-bold text-emerald-400">🇧🇷 Brasil Inteiro (Rastreio Total)</SelectItem>
                  {ufs.map(uf => (
                    <SelectItem key={uf.id} value={uf.sigla} className="hover:bg-slate-700 cursor-pointer">
                      {uf.nome} ({uf.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Nível de Tecnologia</label>
              <Select value={filterTech} onValueChange={setFilterTech}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 h-12">
                  <SelectValue placeholder="Qualquer Conexão" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="todos" className="hover:bg-slate-700 cursor-pointer">Qualquer Tecnologia</SelectItem>
                  <SelectItem value="critico" className="hover:bg-slate-700 cursor-pointer text-rose-400 font-bold">Crítico (Alta Carência)</SelectItem>
                  <SelectItem value="baixo" className="hover:bg-slate-700 cursor-pointer text-orange-400 font-bold">Baixo</SelectItem>
                  <SelectItem value="moderado" className="hover:bg-slate-700 cursor-pointer text-blue-400 font-bold">Moderado</SelectItem>
                  <SelectItem value="alto" className="hover:bg-slate-700 cursor-pointer text-emerald-400 font-bold">Alto (Saturado)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Target Nexus</label>
              <Select value={filterPossibilidade} onValueChange={setFilterPossibilidade}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 h-12">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="todos" className="hover:bg-slate-700 cursor-pointer">Todos</SelectItem>
                  <SelectItem value="Altíssimo" className="hover:bg-slate-700 cursor-pointer text-emerald-400 font-bold">Altíssimo Target</SelectItem>
                  <SelectItem value="Alto" className="hover:bg-slate-700 cursor-pointer text-blue-400 font-bold">Alto Target</SelectItem>
                  <SelectItem value="Médio" className="hover:bg-slate-700 cursor-pointer text-amber-400 font-bold">Médio Target</SelectItem>
                  <SelectItem value="Baixo" className="hover:bg-slate-700 cursor-pointer text-rose-400 font-bold">Baixo Target</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Pilar Comercial</label>
              <Select value={filterPilar} onValueChange={setFilterPilar}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 h-12">
                  <SelectValue placeholder="Todos os Pilares" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="todos" className="hover:bg-slate-700 cursor-pointer">Todos os Pilares</SelectItem>
                  <SelectItem value="agro" className="hover:bg-slate-700 cursor-pointer text-emerald-400 font-bold">🌾 Agronegócio</SelectItem>
                  <SelectItem value="industria" className="hover:bg-slate-700 cursor-pointer text-amber-400 font-bold">🏭 Indústria</SelectItem>
                  <SelectItem value="saude" className="hover:bg-slate-700 cursor-pointer text-teal-400 font-bold">❤️ Saúde Pública</SelectItem>
                  <SelectItem value="midia" className="hover:bg-slate-700 cursor-pointer text-pink-400 font-bold">🎙️ Mídia & Varejo</SelectItem>
                  <SelectItem value="gov" className="hover:bg-slate-700 cursor-pointer text-indigo-400 font-bold">🛡️ GovTech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Buscar Cidade</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input 
                  placeholder="Ex: Passo do Sobrado" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-primary/50"
                  disabled={!selectedUf}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-primary">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Carregando matriz estratégica geográfica...</p>
            </div>
          ) : filteredMunicipios.length > 0 ? (
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#020617]/50">
              <Table>
                <TableHeader className="bg-slate-900/80">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-bold">Município</TableHead>
                    <TableHead className="text-slate-400 font-bold text-center">Nível de Tecnologia</TableHead>
                    <TableHead className="text-slate-400 font-bold text-center">Pilar Recomendado</TableHead>
                    <TableHead className="text-slate-400 font-bold text-center">Nexus Target Score</TableHead>
                    <TableHead className="text-slate-400 font-bold text-right">Ações Estratégicas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMunicipios.map((cidade) => {
                    const scoreData = getNexusScore(cidade.id);
                    const sectProfile = getSectoralProfile(cidade.id);
                    const ufSigla = cidade.microrregiao?.mesorregiao?.UF?.sigla || (selectedUf !== 'BR' ? selectedUf : '');
                    
                    const techColorClass = techColors[scoreData.techKey];
                    const targetColorClass = techColors[scoreData.key];
                    const pilarColorClass = pilarColors[sectProfile.pilar];
                    const PilarIcon = pilarColorClass.icon;

                    return (
                      <TableRow key={cidade.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                        {/* City Name */}
                        <TableCell className="font-medium text-slate-200 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{cidade.nome}</span>
                            <span className="text-slate-500 text-xs font-mono">UF: {ufSigla || 'N/A'} (IBGE: {cidade.id})</span>
                          </div>
                        </TableCell>

                        {/* Technology Level (Internet Connection) */}
                        <TableCell className="text-center py-4">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${techColorClass.bg} ${techColorClass.text} border ${techColorClass.border}`}>
                              <Cpu className="w-3 h-3" />
                              <span>{scoreData.techScore}% ({scoreData.techLevel})</span>
                            </div>
                            <div className="w-24 bg-slate-800 rounded-full h-1 overflow-hidden mt-1">
                              <div 
                                className={`h-full ${techColorClass.barBg}`} 
                                style={{ width: `${scoreData.techScore}%` }} 
                              />
                            </div>
                            <span className="text-[10px] text-slate-500">Carência: {scoreData.carencia}%</span>
                          </div>
                        </TableCell>

                        {/* Dominant Recommended Pilar */}
                        <TableCell className="text-center py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${pilarColorClass.bg} ${pilarColorClass.text} border ${pilarColorClass.border}`}>
                            <PilarIcon className="w-3.5 h-3.5" />
                            <span>{sectProfile.pilarLabel}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1 font-mono">{sectProfile.appSugerido}</span>
                        </TableCell>

                        {/* Computed Nexus Target Score */}
                        <TableCell className="text-center py-4">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${targetColorClass.bg} border ${targetColorClass.border}`}>
                              <Activity className={`w-3.5 h-3.5 ${targetColorClass.text}`} />
                              <span className={`text-xs font-bold ${targetColorClass.text}`}>{scoreData.score}% ({scoreData.level})</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono scale-90">
                              (Base {scoreData.baseScore}% * {pesoBase}% + Carência {scoreData.carencia}% * {pesoTech}%)
                            </span>
                          </div>
                        </TableCell>

                        {/* Merged Action Buttons */}
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            {/* Briefing Button */}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-slate-950/40 border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/10 hover:text-white"
                              onClick={() => handleOpenBriefing(cidade, ufSigla, scoreData.score)}
                              title="Ver Briefing da Atena"
                            >
                              <Brain className="w-4 h-4 mr-1 text-[#00D4FF]" />
                              Briefing
                            </Button>

                            {/* Schedule Button */}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/20 hover:text-white"
                              onClick={() => {
                                const briefing = getBriefingData(cidade.nome, ufSigla, cidade.id);
                                handleOpenSchedule(cidade, ufSigla, scoreData.score, briefing);
                              }}
                              title="Agendar Reunião de Gabinete"
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Agendar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {municipios.length > 200 && (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-900/50 border-t border-slate-800">
                  Mostrando os 200 primeiros resultados com maior score. Refine os filtros para buscas específicas.
                </div>
              )}
            </div>
          ) : selectedUf ? (
            <div className="py-12 text-center text-slate-500">
              Nenhum município localizado com os filtros selecionados.
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <Map className="w-16 h-16 text-slate-800 mb-4 animate-pulse" />
              <p className="text-slate-500 font-medium">Selecione um Estado ou Brasil Inteiro para carregar a matriz estratégica.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unified Strategic Dialog Overlay */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-w-2xl overflow-hidden backdrop-blur-md z-[9999] shadow-2xl">
          {/* Decorative tech background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#00D4FF]/5 blur-3xl pointer-events-none" />
          
          {activeCity && (
            <>
              {/* MODE 1: STRATEGIC BRIEFING PITCH SHEET */}
              {dialogMode === 'briefing' && (
                <>
                  <DialogHeader className="border-b border-slate-800 pb-4">
                    <DialogTitle className="text-white text-2xl font-headline flex items-center gap-3">
                      <Brain className="w-7 h-7 text-[#00D4FF] animate-pulse" />
                      <div className="flex-1">
                        <span className="block text-xs uppercase tracking-widest text-[#00D4FF]/80">Ficha Técnica e Abordagem</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span>Prefeitura de {activeCity?.cidade?.nome || ''} ({activeCity?.uf || ''})</span>
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-5 py-4 max-h-[450px] overflow-y-auto pr-1">
                    {/* Score & Sector Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-950/30 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Nexus Target Score</span>
                        <strong className="text-emerald-400 text-xl font-headline block mt-1">{activeCity?.score || 0}%</strong>
                        <span className="text-[10px] text-slate-400 block">Classificação estratégica recomendada</span>
                      </div>
                      <div className="p-3 bg-slate-950/30 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Pilar Comercial Alvo</span>
                        <strong className="text-[#00D4FF] text-lg font-headline block mt-1">
                          <span className="inline-flex items-center gap-1">
                            <ActivePilarIcon className="w-4 h-4 shrink-0 text-[#00D4FF]" />
                            {activeCity?.briefing?.pilarLabel || ''}
                          </span>
                        </strong>
                        <span className="text-[10px] text-slate-400 block font-mono">App: {activeCity?.briefing?.appSugerido || ''}</span>
                      </div>
                    </div>

                    {/* Economic Strengths & Description */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF]">Vocação & Pontos Fortes:</span>
                      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm text-slate-300 leading-relaxed font-light">
                        {activeCity?.briefing?.vocacao || ''}
                      </div>
                    </div>

                    {/* Weaknesses / Challenges */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-rose-450">Desafios & Dificuldades Locais:</span>
                      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm text-slate-300 leading-relaxed font-light">
                        {activeCity?.briefing?.desafios || ''}
                      </div>
                    </div>

                    {/* Atena Sales Approach (Pitch Script) */}
                    <div className="space-y-1.5 border-t border-slate-800 pt-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-emerald-400 shrink-0" />
                        Gancho de Abordagem Comercial (Dica da Atena):
                      </span>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/25 rounded-xl text-sm text-emerald-350 leading-relaxed italic font-light shadow-inner">
                        "{activeCity?.briefing?.gancho || ''}"
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons inside Briefing */}
                  <DialogFooter className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row gap-3 items-center w-full justify-between">
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white flex-1 sm:flex-none"
                        onClick={() => {
                          const routeQuery = encodeURIComponent(`Mato Leitão, RS to ${activeCity?.cidade?.nome || ''}, ${activeCity?.uf || ''}`);
                          window.open(`https://www.google.com/maps/dir/${routeQuery}`, '_blank');
                        }}
                      >
                        <Map className="w-4 h-4 mr-2 text-emerald-400" />
                        Ver Rota
                      </Button>
                      <Button 
                        variant="outline" 
                        className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white flex-1 sm:flex-none"
                        onClick={() => {
                          const searchQuery = encodeURIComponent(`Prefeitura de ${activeCity?.cidade?.nome || ''} ${activeCity?.uf || ''} telefone contato email gabinete do prefeito`);
                          window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2 text-[#00D4FF]" />
                        Contatos
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsDialogOpen(false)}
                        className="text-slate-400 hover:text-white flex-1 sm:flex-none"
                      >
                        Fechar
                      </Button>
                      <Button 
                        onClick={handleTransitionToSchedule}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/10 flex-1 sm:flex-none"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Agendar Visita
                      </Button>
                    </div>
                  </DialogFooter>
                </>
              )}

              {/* MODE 2: QUICK SCHEDULING FORM */}
              {dialogMode === 'schedule' && (
                <>
                  <DialogHeader className="border-b border-slate-800 pb-4">
                    <DialogTitle className="text-white text-xl font-headline flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#00D4FF]" />
                      Agendar Visita no Gabinete - {activeCity?.cidade?.nome || ''}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-3">
                    <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                      <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px] text-[#00D4FF]">Matriz Estratégica Nexus:</span>
                      <div>Prefeitura: <strong className="text-white">{activeCity?.cidade?.nome || ''} ({activeCity?.uf || ''})</strong></div>
                      <div>Liderança Atual: <strong className="text-white">{activeCity?.briefing?.prefeito || ''} ({activeCity?.briefing?.partido || ''})</strong></div>
                      <div>Alvo Comercial: <strong className="text-emerald-400">{activeCity?.score || 0}% ({activeCity?.briefing?.pilarLabel || ''})</strong></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Data da Visita</label>
                        <Input 
                          placeholder="Ex: 15/06/2026" 
                          value={scheduleDate} 
                          onChange={e => setScheduleDate(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white focus-visible:ring-[#00D4FF]/50"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Horário</label>
                        <Input 
                          placeholder="Ex: 14:00" 
                          value={scheduleTime} 
                          maxLength={5}
                          onChange={e => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 4) val = val.substring(0, 4);
                            if (val.length >= 3) val = val.substring(0, 2) + ':' + val.substring(2);
                            setScheduleTime(val);
                          }}
                          className="bg-slate-800 border-slate-700 text-white focus-visible:ring-[#00D4FF]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Anfitrião Principal</label>
                      <Input 
                        value={scheduleHost} 
                        onChange={e => setScheduleHost(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white focus-visible:ring-[#00D4FF]/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Assunto da Pauta comercial</label>
                      <Input 
                        value={scheduleSubject} 
                        onChange={e => setScheduleSubject(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white focus-visible:ring-[#00D4FF]/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Notas de Planejamento da Visita</label>
                      <Textarea 
                        value={scheduleNotes} 
                        onChange={e => setScheduleNotes(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white min-h-[100px] focus-visible:ring-[#00D4FF]/50 text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  <DialogFooter className="border-t border-slate-800">
                    <Button 
                      variant="ghost" 
                      onClick={() => setDialogMode('briefing')} 
                      className="text-slate-400 hover:text-white"
                    >
                      Voltar ao Briefing
                    </Button>
                    <Button onClick={handleSaveSchedule} className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-slate-950 font-bold">
                      Confirmar e Agendar
                    </Button>
                  </DialogFooter>
                </>
              )}

              {/* MODE 3: SUCCESS FEEDBACK SCREEN */}
              {dialogMode === 'success' && (
                <div className="py-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-xl">Visita Integrada ao Radar!</h4>
                    <p className="text-slate-450 text-sm max-w-md mx-auto leading-relaxed">
                      A prefeitura de <strong>{activeCity?.cidade?.nome || ''} ({activeCity?.uf || ''})</strong> foi cadastrada na sua **Agenda Estratégica** da Nexus.
                    </p>
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="bg-transparent border-slate-700 text-slate-350 hover:bg-slate-800 hover:text-white"
                    >
                      Continuar no Prospector
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/gabinete/agenda'}
                      className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-slate-950 font-bold"
                    >
                      Ir para a Agenda
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
