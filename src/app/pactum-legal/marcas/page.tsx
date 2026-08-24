'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Scale, 
  ShieldCheck, 
  PlusCircle, 
  Activity, 
  Users, 
  AlertTriangle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Tv, 
  Settings, 
  Play, 
  Search, 
  RefreshCw,
  Zap,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Minus,
  Maximize2,
  Send,
  Edit3,
  Trash2,
  X,
  Check,
  Building2,
  DollarSign,
  LineChart,
  TrendingDown,
  ChevronRight,
  Download,
  Image,
  FileJson,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGate from '@/components/auth-gate';

// ==========================================
// MOCK DATA & TEXTS - MÓDULO MARCAS
// ==========================================

const initialProcesses = [
  { id: '91283021', marca: 'Siberian Steel', cliente: 'Siberian Steel Corp', classe: '06, 40', status: 'Marca Concedida', data: '18/08/2026', logs: 'Marca registrada com sucesso e blindada.' },
  { id: '92394812', marca: 'Maga Live', cliente: 'Nexus Holding Group', classe: '38, 41', status: 'Aguardando Exame de Mérito', data: '15/08/2026', logs: 'Aguardando análise de mérito.' },
  { id: '93982310', marca: 'Nexus Costa Rica', cliente: 'Terceiro (Conflito)', classe: '42', status: 'Oposição Deferida', data: '12/08/2026', logs: 'Alvo de colisão crítica detectado.' },
  { id: '93982315', marca: 'Nexus Brasil App', cliente: 'Terceiro (Conflito)', classe: '42', status: 'Oposição Deferida', data: '14/08/2026', logs: 'Tentativa de registro colidente na mesma classe.' },
  { id: '91440822', marca: 'Djeny App', cliente: 'EuroDesign SpA', classe: '09, 42', status: 'Publicado para Oposição', data: '10/08/2026', logs: 'Publicado na RPI. Prazo para contestação aberto.' },
  { id: '92001928', marca: 'Amira Resort', cliente: 'Dubai Tourism Group', classe: '43', status: 'Aguardando Exame de Mérito', data: '05/08/2026', logs: 'Fila de exame de mérito.' },
  { id: '93110291', marca: 'Dom Pedro Laguna', cliente: 'Dom Pedro Hotels & Golf', classe: '43', status: 'Marca Concedida', data: '01/08/2026', logs: 'Concessão deferida. Aguardando emissão do certificado.' },
  { id: '93220193', marca: 'Huskies Operações', cliente: 'Huskies PJ Ltda', classe: '35', status: 'Aguardando Exame de Mérito', data: '28/07/2026', logs: 'Fila de análise técnica.' },
  { id: '93330922', marca: 'SANA Estoril', cliente: 'SANA Hotels Group', classe: '43', status: 'Aguardando Exame de Mérito', data: '20/07/2026', logs: 'Aguardando parecer técnico.' },
  { id: '93440921', marca: 'Veea Marcas', cliente: 'Veea Marcas Ltda', classe: '45', status: 'Aguardando Exame de Mérito', data: '12/06/2026', logs: 'Distribuído para exame de mérito.' },
  { id: '93551029', marca: 'Conexo Legal Tech', cliente: 'Conexo Propriedade Intelectual', classe: '42', status: 'Aguardando Exame de Mérito', data: '01/06/2026', logs: 'Aguardando parecer de mérito.' },
  { id: '93672039', marca: 'Querol Advocacia', cliente: 'F. Querol Advogados', classe: '45', status: 'Marca Concedida', data: '28/05/2026', logs: 'Marca registrada e blindada.' },
  { id: '93721092', marca: 'Amira Concierge', cliente: 'Dubai Tourism Group', classe: '42, 43', status: 'Aguardando Exame de Mérito', data: '15/05/2026', logs: 'Exame de mérito em andamento.' },
  { id: '93891029', marca: 'SANA Lisbon Hotel', cliente: 'SANA Hotels Group', classe: '43', status: 'Aguardando Exame de Mérito', data: '10/05/2026', logs: 'Aguardando análise técnica.' },
  { id: '93902109', marca: 'Dom Pedro Golf', cliente: 'Dom Pedro Hotels & Golf', classe: '41, 43', status: 'Aguardando Exame de Mérito', data: '02/05/2026', logs: 'Fila de análise técnica.' },
  { id: '93002910', marca: 'Real Hotels Spa', cliente: 'Real Hotels Group', classe: '43, 44', status: 'Aguardando Exame de Mérito', data: '25/04/2026', logs: 'Aguardando exame técnico.' },
  { id: '93110293', marca: 'VIP Executive', cliente: 'VIP Hotels Group', classe: '43', status: 'Aguardando Exame de Mérito', data: '18/04/2026', logs: 'Fila técnica.' },
  { id: '93220192', marca: 'Altis Suites', cliente: 'Altis Hotels Group', classe: '43', status: 'Aguardando Exame de Mérito', data: '10/04/2026', logs: 'Aguardando análise.' },
  { id: '93330921', marca: 'Hoti Hospitality', cliente: 'Hoti Hoteis Group', classe: '43', status: 'Aguardando Exame de Mérito', data: '04/04/2026', logs: 'Exame técnico em andamento.' },
  { id: '93441928', marca: 'Turim Club', cliente: 'Turim Hotels Group', classe: '43', status: 'Aguardando Exame de Mérito', data: '22/03/2026', logs: 'Aguardando parecer.' },
  { id: '93552019', marca: 'Maga Live Portal', cliente: 'Nexus Holding Group', classe: '09, 42', status: 'Aguardando Exame de Mérito', data: '15/03/2026', logs: 'Aguardando análise do INPI.' },
  { id: '93663029', marca: 'Djeny Trial', cliente: 'EuroDesign SpA', classe: '42', status: 'Aguardando Exame de Mérito', data: '05/03/2026', logs: 'Aguardando parecer técnico.' }
];

const initialDraftText = `AO ILUSTRÍSSIMO SENHOR PRESIDENTE DO INSTITUTO NACIONAL DA PROPRIEDADE INDUSTRIAL - INPI

Referência: Pedido de Registro nº 93982310
Marca Oposta: NEXUS COSTA RICA (Classe 42)
Opoente: NEXUS HOLDING GROUP S.A.

NEXUS HOLDING GROUP S.A., pessoa jurídica de direito privado, inscrita sob o CNPJ nº XX.XXX.XXX/XXXX-XX, por seu procurador infra-assinado FELIPE QUEROL, vem, mui respeitosamente, apresentar a presente manifestação de:

OPOSIÇÃO AO REGISTRO DE MARCA

Em face do pedido formulado por terceiro para a marca "NEXUS COSTA RICA", sob o processo nº 93982310, com fulcro no Art. 124, inciso XIX da Lei de Propriedade Industrial (Lei nº 9.279/96).

I. DOS FATOS E DOS DIREITOS:
A Opoente é legítima titular de direitos sobre a marca base "NEXUS" na mesma Classe de Nice 42. A convivência das marcas é inviável e causará erro, dúvida e associação indevida aos consumidores do mesmo segmento de atuação mercadológica.

Pede Deferimento.
Porto Alegre, 18 de agosto de 2026.`;

// ==========================================
// MOCK DATA & TEXTS - MÓDULO SOCIETÁRIO
// ==========================================

const initialHoldingMoU = `MEMORANDO DE ENTENDIMENTO (MoU) PARA ESTRUTURAÇÃO DE HOLDING FAMILIAR

Participantes da Estrutura:
1. Patriarca/Matriarca (Titular do Patrimônio Base)
2. Sócios Herdeiros Diretos

BENS INTEGRALIZADOS DO ACERVO PATRIMONIAL:
- Bens Imóveis Avaliados em: R$ {imoveis}
- Cotas Sociais e Investimentos Financeiros em: R$ {outrosAtivos}
Total do Patrimônio Consolidado: R$ {totalPatrimonio}

DIRETRIZES DA ESTRUTURA SOCIETÁRIA PROPOSTA:

I. OBJETO E FORMA DA SOCIEDADE HOLDING:
Constituição de uma sociedade holding familiar sob a forma de Sociedade Limitada (Ltda.), com sede sob foro contratual. O capital social será integralizado mediante a transferência dos bens e ativos acima discriminados, com base no valor declarado em declaração de Imposto de Renda.

II. DA DOAÇÃO DAS COTAS COM RESERVA DE USUFRUTO:
A totalidade das cotas representativas do capital da Holding Familiar será doada aos herdeiros indicados, com a instituição simultânea de Cláusula de Usufruto Vitalício de Direito Político e Econômico integral em favor do Patriarca/Matriarca.

III. DAS CLÁUSULAS DE BLINDAGEM PATRIMONIAL:
O contrato de doação e o acordo de sócios da Holding conterão cláusulas de:
a) Inalienabilidade: Impedimento de venda das cotas sem aprovação prévia.
b) Incomunicabilidade: As cotas não integram o patrimônio de cônjuges/parceiros dos herdeiros.
c) Impenhorabilidade: Cotas protegidas contra execuções civis e comerciais.
d) Reversão: Em caso de falecimento prévio do herdeiro, as cotas retornam ao doador original.

IV. ESTRUTURA ADMINISTRATIVA OPERACIONAL:
A gerência e administração da sociedade holding serão exercidas em caráter de exclusividade pelo Administrador Vitalício designado no Contrato Social primário.

Elaborado por: FELIPE QUEROL - CONSULTORIA JURÍDICA
Data de Emissão: 18 de Agosto de 2026.`;

const initialPartnershipDraft = `ACORDO DE SÓCIOS - SOCIEDADE EMPRESÁRIA NEXUS GOVERNANCE LTDA.

SÓCIOS SIGNATÁRIOS:
Sócio A: {partnerA} (Detentor de Cotas Controladoras)
Sócio B: {partnerB} (Detentor de Cotas Minoritárias)

DELIBERAÇÕES E ACORDOS SOCIAIS:

I. COMPOSIÇÃO DO ACORDO DE SEGURANÇA E ACESSÃO:
Este Acordo de Sócios regula as regras de convivência, tomada de decisão e liquidez de ativos societários das partes signatárias, arquivado sob a égide do Código Civil Brasileiro.

II. REGRAS DE SAÍDA E DIREITO DE ADESÃO (TAG-ALONG):
{tagAlongText}

III. REGRAS DE ALIENAÇÃO CONJUNTA FORÇADA (DRAG-ALONG):
{dragAlongText}

IV. DIREITO DE PREFERÊNCIA (RIGHT OF FIRST REFUSAL):
{preferenceText}

V. CLÁUSULA DE NÃO-CONCORRÊNCIA (NON-COMPETE):
{nonCompeteText}

VI. RESOLUÇÃO DE CONFLITOS E ARBITRAGEM:
As divergências serão submetidas preliminarmente a uma câmara de mediação e arbitragem comercial antes do acionamento de medidas judiciais.

Elaborado por: FELIPE QUEROL - CONSULTORIA JURÍDICA
Data de Emissão: 18 de Agosto de 2026.`;

const initialCorporateOperations = [
  { id: '89102911', operacao: 'Holding Familiar', cliente: 'Família Schuh (Patrimônio R$ 2.0M)', status: 'Minuta Aprovada', data: '18/08/2026', logs: 'MoU assinado pelas partes. Aguardando integralização na Junta Comercial.' },
  { id: '89203928', operacao: 'Acordo de Sócios', cliente: 'Nexus Governance Ltda (Felipe & Geanderson)', status: 'Aguardando Assinatura', data: '17/08/2026', logs: 'Minuta enviada via Docusign para assinatura coletiva.' },
  { id: '89304910', operacao: 'Contrato Social', cliente: 'EuroDesign SpA (Importadora)', status: 'Registrado na Junta', data: '10/08/2026', logs: 'Contrato social arquivado sob NIRE com sucesso.' },
  { id: '89405921', operacao: 'Holding Familiar', cliente: 'Dubai Tourism Ltda (Patrimônio R$ 15M)', status: 'Em Elaboração', data: '05/08/2026', logs: 'Mapeamento de acervo imobiliário concluído. Aguardando IRPF.' },
  { id: '89506922', operacao: 'Acordo de Sócios', cliente: 'Siberian Steel Corp', status: 'Registrado na Junta', data: '01/08/2026', logs: 'Acordo de acionistas arquivado na sede da companhia.' },
  { id: '89607923', operacao: 'Lock-Up Agreement', cliente: 'Huskies PJ Ltda', status: 'Aguardando Assinatura', data: '25/07/2026', logs: 'Cláusula de lock-up de 12 meses enviada para segurança dos sócios.' }
];

export default function PactumLegalUnifiedDashboard() {
  // Unified module selector state
  const [currentView, setCurrentView] = useState<'lobby' | 'marcas' | 'societario'>('lobby');

  // Branding Customization States (Interactive Header)
  const [avatarImage, setAvatarImage] = useState<string | null>('/felipe-avatar.png');
  const [monogram, setMonogram] = useState('FQ');
  const [logoImage, setLogoImage] = useState<string | null>('/felipe-logo.png');
  const [logoWidth, setLogoWidth] = useState<number>(320);
  const [logoHeight, setLogoHeight] = useState<number>(120);
  const [logoZoom, setLogoZoom] = useState<number>(100);
  const [isResizing, setIsResizing] = useState<'se' | 'e' | 's' | null>(null);
  const [customName, setCustomName] = useState('FELIPE QUEROL');
  const [customSubtitle, setCustomSubtitle] = useState('CONSULTORIA JURÍDICA');

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              setLogoImage(dataUrl);
              window.localStorage.setItem('pactum_custom_logo', dataUrl);
              setLogoWidth(320);
              setLogoHeight(120);
              window.localStorage.setItem('pactum_custom_logo_width', '320');
              window.localStorage.setItem('pactum_custom_logo_height', '120');
              alert('Imagem Colada! 📋✨ Seu novo logotipo foi colado e aplicado com sucesso.');
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  };

  const startResize = (e: React.MouseEvent, type: 'se' | 'e' | 's') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(type);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = logoWidth;
    const startHeight = logoHeight;
    
    const doResize = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (type === 'e' || type === 'se') {
        newWidth = Math.max(60, startWidth + (moveEvent.clientX - startX));
      }
      if (type === 's' || type === 'se') {
        newHeight = Math.max(30, startHeight + (moveEvent.clientY - startY));
      }
      
      setLogoWidth(newWidth);
      setLogoHeight(newHeight);
      window.localStorage.setItem('pactum_custom_logo_width', String(newWidth));
      window.localStorage.setItem('pactum_custom_logo_height', String(newHeight));
    };
    
    const stopResize = () => {
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResize);
      setIsResizing(null);
    };
    
    window.addEventListener('mousemove', doResize);
    window.addEventListener('mouseup', stopResize);
  };

  // Parse search parameters on client side to dynamically adjust the initial view and load custom branding
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      if (view === 'marcas' || view === 'societario' || view === 'lobby') {
        setCurrentView(view);
      }

      // Dynamic PWA Manifest replacement for Felipe Querol
      let link: HTMLLinkElement | null = document.querySelector('link[rel="manifest"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'manifest';
        document.head.appendChild(link);
      }
      link.href = '/pactum-manifest.json';

      // Load query parameter customization if present
      const pName = params.get('name');
      const pSubtitle = params.get('subtitle');
      const pMono = params.get('monogram');

      if (pName) {
        setCustomName(pName);
        window.localStorage.setItem('pactum_custom_name', pName);
      } else {
        const savedName = window.localStorage.getItem('pactum_custom_name');
        if (savedName) setCustomName(savedName);
      }

      if (pSubtitle) {
        setCustomSubtitle(pSubtitle);
        window.localStorage.setItem('pactum_custom_subtitle', pSubtitle);
      } else {
        const savedSubtitle = window.localStorage.getItem('pactum_custom_subtitle');
        if (savedSubtitle) setCustomSubtitle(savedSubtitle);
      }

      if (pMono) {
        setMonogram(pMono);
        window.localStorage.setItem('pactum_custom_monogram', pMono);
      } else {
        const savedMonogram = window.localStorage.getItem('pactum_custom_monogram');
        if (savedMonogram) setMonogram(savedMonogram);
      }

      const savedAvatar = window.localStorage.getItem('pactum_custom_avatar');
      if (savedAvatar) setAvatarImage(savedAvatar);

      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isLocal) {
        setLogoImage('/nexus-treinamento-logo.png');
        setLogoWidth(320);
        setLogoHeight(120);
      } else {
        const savedLogo = window.localStorage.getItem('pactum_custom_logo');
        const savedWidth = window.localStorage.getItem('pactum_custom_logo_width');
        const savedHeight = window.localStorage.getItem('pactum_custom_logo_height');
        if (savedLogo) {
          setLogoImage(savedLogo);
        } else {
          setLogoImage('/felipe-logo.png');
        }
        if (savedWidth) setLogoWidth(Number(savedWidth));
        if (savedHeight) setLogoHeight(Number(savedHeight));
      }
    }
  }, []);

  // ==========================================
  // STATES - MÓDULO SOCIETÁRIO (CRM)
  // ==========================================
  const [corporateOperations, setCorporateOperations] = useState(initialCorporateOperations);
  const [corporateSearchTerm, setCorporateSearchTerm] = useState('');
  const [corporateFilter, setCorporateFilter] = useState<string | null>(null);
  const [isNewCorporateOpen, setIsNewCorporateOpen] = useState(false);
  const [newCorporateType, setNewCorporateType] = useState('Holding Familiar');
  const [newCorporateCliente, setNewCorporateCliente] = useState('');
  const [newCorporateStatus, setNewCorporateStatus] = useState('Em Elaboração');

  // ==========================================
  // STATES - MÓDULO MARCAS
  // ==========================================
  const [processes, setProcesses] = useState(initialProcesses);
   const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanResultDetail, setScanResultDetail] = useState<any>(null);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  
  // New process input states
  const [isNewProcessOpen, setIsNewProcessOpen] = useState(false);
  const [newMarca, setNewMarca] = useState('');
  const [newCliente, setNewCliente] = useState('');
  const [newClasse, setNewClasse] = useState('');
  const [newStatus, setNewStatus] = useState('Aguardando Publicação');

  // Draft document workspace states
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [isDraftMinimized, setIsDraftMinimized] = useState(false);
  const [isDraftEditing, setIsDraftEditing] = useState(false);
  const [draftText, setDraftText] = useState(initialDraftText);
  const [isDraftSending, setIsDraftSending] = useState(false);

  // ==========================================
  // STATES - MÓDULO SOCIETÁRIO
  // ==========================================
  const [activeSocietarioTab, setActiveSocietarioTab] = useState<'holding' | 'partnership'>('holding');
  
  // Tab 1: Holding States
  const [imoveis, setImoveis] = useState('1500000');
  const [outrosAtivos, setOutrosAtivos] = useState('500000');
  const [herdeiros, setHerdeiros] = useState('2');
  
  const [isHoldingSimulated, setIsHoldingSimulated] = useState(false);
  const [isHoldingLoading, setIsHoldingLoading] = useState(false);
  
  const [isHoldingMoUOpen, setIsHoldingMoUOpen] = useState(false);
  const [holdingMoUText, setHoldingMoUText] = useState('');
  const [isHoldingMoUSending, setIsHoldingMoUSending] = useState(false);
  const [isHoldingMoUEditing, setIsHoldingMoUEditing] = useState(false);
  const [isHoldingMoUMinimized, setIsHoldingMoUMinimized] = useState(false);

  // Tab 2: Partnership Agreement States
  const [partnerA, setPartnerA] = useState('Geanderson Schuh');
  const [partnerB, setPartnerB] = useState('Felipe Querol');
  const [hasTagAlong, setHasTagAlong] = useState(true);
  const [hasDragAlong, setHasDragAlong] = useState(false);
  const [hasRightOfFirstRefusal, setHasRightOfFirstRefusal] = useState(true);
  const [hasNonCompete, setHasNonCompete] = useState(false);
  
  const [isPartnershipAudited, setIsPartnershipAudited] = useState(false);
  const [isPartnershipLoading, setIsPartnershipLoading] = useState(false);
  const [auditLevel, setAuditLevel] = useState<string>('');
  const [auditAlerts, setAuditAlerts] = useState<any[]>([]);
  
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
  const [partnershipText, setPartnershipText] = useState('');
  const [isPartnershipSending, setIsPartnershipSending] = useState(false);
  const [isPartnershipEditing, setIsPartnershipEditing] = useState(false);
  const [isPartnershipMinimized, setIsPartnershipMinimized] = useState(false);

  // Share custom branding link builder
  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = `${window.location.origin}/pactumlegal`;
      const queryParams = new URLSearchParams();
      queryParams.set('token', 'FELIPE_BETA_2026');
      queryParams.set('name', customName);
      queryParams.set('subtitle', customSubtitle);
      queryParams.set('monogram', monogram);
      
      const shareUrl = `${baseUrl}?${queryParams.toString()}`;
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Link de teste com a sua customização copiado para a área de transferência! Envie para o cliente.'))
        .catch(() => alert('Copie o link gerado: ' + shareUrl));
    }
  };

  // Marcas: Add manually registered process
  const handleAddProcess = () => {
    if (!newMarca || !newCliente) return;

    const newProc = {
      id: Math.floor(90000000 + Math.random() * 10000000).toString(),
      marca: newMarca,
      cliente: newCliente,
      classe: newClasse || '35',
      status: newStatus,
      data: new Date().toLocaleDateString('pt-BR'),
      logs: 'Processo cadastrado manualmente na central do Pactum.'
    };

    setProcesses([newProc, ...processes]);
    setIsNewProcessOpen(false);
    setNewMarca('');
    setNewCliente('');
    setNewClasse('');
  };

  // Marcas: Run RPI Scanner using Gemini
  const runRPIScanner = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const res = await fetch('/api/pactum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan-rpi' })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setScanResult('completed');
      setScanResultDetail(data);

      if (data.hasCollision && data.brand) {
        const newConflict = {
          id: '93982399',
          marca: data.brand,
          cliente: 'Terceiro (Conflito)',
          classe: data.class || '42',
          status: 'Oposição Deferida',
          data: new Date().toLocaleDateString('pt-BR'),
          logs: data.reason
        };
        setProcesses(prev => {
          if (prev.some(p => p.id === '93982399')) return prev;
          return [newConflict, ...prev];
        });
      }
    } catch (err: any) {
      alert('Erro na varredura RPI: ' + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  // Marcas: Generate Opposition Draft via Gemini
  const handleGenerateOpposition = async () => {
    setIsDraftLoading(true);
    try {
      const res = await fetch('/api/pactum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-draft',
          payload: {
            type: 'opposition',
            context: {
              brand: scanResultDetail?.brand || 'Nexus Sul',
              id: '93982399',
              class: scanResultDetail?.class || '42'
            }
          }
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setDraftText(data.draftText);
      setIsDraftOpen(true);
      setIsDraftMinimized(false);
    } catch (err: any) {
      alert('Erro ao gerar minuta de oposição: ' + err.message);
    } finally {
      setIsDraftLoading(false);
    }
  };

  // Marcas: Filter processes
  const filteredProcesses = processes.filter((proc) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || (
      proc.id.toLowerCase().includes(term) ||
      proc.marca.toLowerCase().includes(term) ||
      proc.cliente.toLowerCase().includes(term) ||
      proc.classe.toLowerCase().includes(term) ||
      proc.status.toLowerCase().includes(term)
    );
    const matchesStatus = !statusFilter || proc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Societário: Calculations for Holding
  const numImoveis = parseFloat(imoveis) || 0;
  const numOutros = parseFloat(outrosAtivos) || 0;
  const totalPatrimonio = numImoveis + numOutros;
  
  // Traditional probate costs ~18% (ITCMD, fees, notary, court)
  const custoTradicional = totalPatrimonio * 0.18;
  // Holding costs ~5.5%
  const custoHolding = totalPatrimonio * 0.055;
  const economiaEstimada = custoTradicional - custoHolding;

  // Societário: Run Holding Simulation
  const handleSimulateHolding = () => {
    setIsHoldingLoading(true);
    setIsHoldingSimulated(false);
    setTimeout(() => {
      setIsHoldingLoading(false);
      setIsHoldingSimulated(true);
    }, 1500);
  };

  // Societário: Run Partnership Audit using Gemini
  const handleAuditPartnership = async () => {
    setIsPartnershipLoading(true);
    setIsPartnershipAudited(false);
    try {
      const res = await fetch('/api/pactum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'audit-partnership',
          payload: { partnerA, partnerB, hasTagAlong, hasDragAlong, hasRightOfFirstRefusal, hasNonCompete }
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAuditLevel(data.complianceLevel);
      setAuditAlerts(data.alerts);
      setIsPartnershipAudited(true);
    } catch (err: any) {
      alert('Erro na auditoria do acordo: ' + err.message);
    } finally {
      setIsPartnershipLoading(false);
    }
  };

  // Societário: Generate MoU via Gemini
  const handleGenerateMoU = async () => {
    setIsHoldingLoading(true);
    try {
      const res = await fetch('/api/pactum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-draft',
          payload: {
            type: 'holding',
            context: {
              imoveis: numImoveis.toLocaleString('pt-BR'),
              outrosAtivos: numOutros.toLocaleString('pt-BR'),
              totalPatrimonio: totalPatrimonio.toLocaleString('pt-BR'),
              herdeiros
            }
          }
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setHoldingMoUText(data.draftText);
      setIsHoldingMoUOpen(true);
      setIsHoldingMoUMinimized(false);
    } catch (err: any) {
      alert('Erro ao gerar MoU da Holding: ' + err.message);
    } finally {
      setIsHoldingLoading(false);
    }
  };

  // Societário: Generate Shareholder Agreement via Gemini
  const handleGeneratePartnership = async () => {
    setIsPartnershipLoading(true);
    try {
      const res = await fetch('/api/pactum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-draft',
          payload: {
            type: 'partnership',
            context: {
              partnerA,
              partnerB,
              hasTagAlong,
              hasDragAlong,
              hasRightOfFirstRefusal,
              hasNonCompete
            }
          }
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setPartnershipText(data.draftText);
      setIsPartnershipOpen(true);
      setIsPartnershipMinimized(false);
    } catch (err: any) {
      alert('Erro ao gerar Acordo de Sócios: ' + err.message);
    } finally {
      setIsPartnershipLoading(false);
    }
  };

  // Societário: Add manually registered corporate operation
  const handleAddCorporateOperation = () => {
    if (!newCorporateCliente) return;

    const newOp = {
      id: Math.floor(80000000 + Math.random() * 10000000).toString(),
      operacao: newCorporateType,
      cliente: newCorporateCliente,
      status: newCorporateStatus,
      data: new Date().toLocaleDateString('pt-BR'),
      logs: 'Operação societária cadastrada manualmente na central do Pactum.'
    };

    setCorporateOperations([newOp, ...corporateOperations]);
    setIsNewCorporateOpen(false);
    setNewCorporateCliente('');
  };

  // Filter corporate operations
  const filteredCorporateOperations = corporateOperations.filter((op) => {
    const term = corporateSearchTerm.toLowerCase().trim();
    const matchesSearch = !term || (
      op.id.toLowerCase().includes(term) ||
      op.operacao.toLowerCase().includes(term) ||
      op.cliente.toLowerCase().includes(term) ||
      op.status.toLowerCase().includes(term)
    );
    const matchesFilter = !corporateFilter || 
      op.operacao === corporateFilter || 
      op.status === corporateFilter ||
      (corporateFilter === 'Minutas Pendentes' && op.status !== 'Registrado na Junta');
    return matchesSearch && matchesFilter;
  });

  return (
    <AuthGate>
      <div className="min-h-screen bg-[#070d1e] text-slate-200 p-8 space-y-12 relative overflow-hidden font-sans">
      
      {/* Background Image & Gradients Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Modern Skyscraper Backdrop reflecting the sky (similar to Felipe's website) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')` }}
        />
        {/* Soft corporate blue/amber gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1636]/85 via-[#070f24]/95 to-[#040916]" />
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#cca752]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-500/10 blur-[130px] rounded-full" />
      </div>

      {/* HEADER PRINCIPAL (CUSTOMIZÁVEL INTERATIVO - TAMANHO EXPANDIDO BANNER) */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#cca752]/20 pb-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6 w-full flex-1">
          <Link href="/exclusive/pactum" className="p-4 bg-[#13131a] hover:bg-[#1a1a24] border border-[#cca752]/20 rounded-2xl transition-colors flex items-center justify-center group shadow-md shadow-black self-start md:self-auto">
            <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full flex-1">
            {/* Circular Avatar ("bolinha" de arte/monograma ou imagem customizada) */}
            <div className="relative group shrink-0">
              <input 
                type="file" 
                id="circular-avatar-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const dataUrl = event.target?.result as string;
                      setAvatarImage(dataUrl);
                      window.localStorage.setItem('pactum_custom_avatar', dataUrl);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div 
                onClick={() => {
                  if (confirm("Deseja carregar uma imagem do computador ou editar o texto do monograma? \nClique 'OK' para selecionar imagem, ou 'Cancelar' para editar o texto.")) {
                    document.getElementById('circular-avatar-upload')?.click();
                  } else {
                    const newMono = prompt("Digite o novo monograma (ex: FQ):", monogram);
                    if (newMono !== null) {
                      const val = newMono.substring(0, 3).toUpperCase();
                      setMonogram(val);
                      window.localStorage.setItem('pactum_custom_monogram', val);
                    }
                  }
                }}
                className="w-48 h-48 rounded-full border-2 border-[#cca752]/40 hover:border-[#cca752] flex items-center justify-center shadow-lg bg-black cursor-pointer transition-all duration-300 relative overflow-hidden group-hover:scale-105"
                title="Clique para customizar a imagem ou monograma"
              >
                {avatarImage ? (
                  <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif italic text-6xl text-[#cca752] font-semibold tracking-tighter leading-none pr-0.5 select-none">{monogram}</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="w-8 h-8 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Card Retangular de Customização do Felipe (Template Editável HTML ou Imagem Uploaded) */}
            <div className="relative group shrink-0 z-10 flex-1 w-full max-w-4xl">
              <input 
                type="file" 
                id="rect-logo-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const dataUrl = event.target?.result as string;
                      setLogoImage(dataUrl);
                      window.localStorage.setItem('pactum_custom_logo', dataUrl);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              
              <div 
                tabIndex={0}
                onPaste={handlePaste}
                className="w-full h-48 border-2 border-slate-800 hover:border-[#cca752]/40 focus:border-[#cca752]/40 rounded-3xl flex items-center justify-center relative overflow-hidden bg-[#0a0a0c] shadow-lg shadow-black/40 group/logo px-6 md:px-16 py-2 outline-none focus:ring-1 focus:ring-[#cca752]/20 cursor-pointer"
                title="Clique aqui e aperte Ctrl+V para colar um logotipo diretamente da área de transferência!"
              >
                {logoImage ? (
                  <div 
                    className={`relative flex items-center justify-center border border-transparent group-hover/logo:border-dashed group-hover/logo:border-[#cca752]/50 p-2 select-none ${isResizing ? 'border-dashed border-[#cca752]' : ''}`}
                    style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
                  >
                    <img 
                      src={logoImage} 
                      alt="Logo Empresa" 
                      className="w-full h-full object-contain p-0 pointer-events-none"
                    />

                    {/* Bounding Box Resize Handles on Hover */}
                    <div className="absolute inset-0 border border-transparent group-hover/logo:border-dashed group-hover/logo:border-[#cca752]/50 pointer-events-none z-10" />
                    
                    {/* East Handle (Right) */}
                    <div 
                      onMouseDown={(e) => startResize(e, 'e')}
                      className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-[#cca752]/40 z-30"
                      title="Arraste para redimensionar largura"
                    />
                    
                    {/* South Handle (Bottom) */}
                    <div 
                      onMouseDown={(e) => startResize(e, 's')}
                      className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-[#cca752]/40 z-30"
                      title="Arraste para redimensionar altura"
                    />
                    
                    {/* South-East Corner Handle */}
                    <div 
                      onMouseDown={(e) => startResize(e, 'se')}
                      className="absolute bottom-1 right-1 w-3 h-3 bg-[#cca752] border border-black rounded-xs cursor-se-resize shadow-md z-30 flex items-center justify-center"
                      title="Arraste para redimensionar proporcionalmente"
                    >
                      <span className="w-1.5 h-1.5 border-r border-b border-black block rotate-45 translate-x-[-0.5px] translate-y-[-0.5px]" />
                    </div>
                  </div>
                ) : (
                  /* Editable Vector Logo Template */
                  <div className="flex flex-col items-center justify-center w-full max-w-4xl font-serif text-[#cca752] py-4">
                    {/* Text Customizers */}
                    <div className="w-full space-y-3">
                      <input 
                        type="text"
                        value={customName}
                        onChange={(e) => { setCustomName(e.target.value); window.localStorage.setItem('pactum_custom_name', e.target.value); }}
                        placeholder="NOME DO ESCRITÓRIO"
                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-[#cca752]/20 focus:border-[#cca752] focus:ring-0 text-3xl md:text-5xl lg:text-6xl font-serif text-[#cca752] font-medium tracking-[0.25em] text-center uppercase px-2 py-1 rounded transition-all focus:outline-none placeholder-slate-850 [text-shadow:0_0_20px_rgba(204,167,82,0.45)]"
                        title="Clique para editar o nome da firma"
                      />
                      
                      {/* Divider line style like original art */}
                      <div className="flex items-center gap-6 w-full text-[#cca752] pt-2 max-w-2xl mx-auto">
                        <span className="h-[1px] bg-gradient-to-r from-transparent via-[#cca752]/50 to-transparent flex-1"></span>
                        <input 
                          type="text"
                          value={customSubtitle}
                          onChange={(e) => { setCustomSubtitle(e.target.value); window.localStorage.setItem('pactum_custom_subtitle', e.target.value); }}
                          placeholder="CONSULTORIA JURÍDICA"
                          className="bg-transparent border-0 border-b border-transparent hover:border-[#cca752]/20 focus:border-[#cca752] focus:ring-0 text-[10px] md:text-xs tracking-[0.45em] font-sans font-black text-center uppercase px-2 py-0.5 rounded focus:outline-none placeholder-slate-850 min-w-[280px]"
                          title="Clique para editar a descrição da firma"
                        />
                        <span className="h-[1px] bg-gradient-to-r from-transparent via-[#cca752]/50 to-transparent flex-1"></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customizer actions on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover/logo:opacity-100 flex items-center gap-2 transition-opacity duration-300 z-20">
                  <Button
                    onClick={() => document.getElementById('rect-logo-upload')?.click()}
                    size="sm"
                    variant="ghost"
                    className="h-8 text-[9px] font-black uppercase bg-[#cca752]/10 hover:bg-[#cca752]/20 border border-[#cca752]/30 text-[#cca752] rounded-xl px-3"
                    title="Carregar imagem de logo personalizada"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Carregar Imagem
                  </Button>
                  {logoImage ? (
                    <Button 
                      onClick={() => setLogoImage(null)}
                      size="sm"
                      variant="ghost"
                      className="h-8 text-[9px] font-black uppercase bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-3"
                      title="Voltar para a marca editável"
                    >
                      <X className="w-3.5 h-3.5 mr-1.5" />
                      Usar Texto
                    </Button>
                  ) : (
                    /* Show Reset Option if they modified customName/customSubtitle and want to return to default Felipe */
                    (customName !== 'FELIPE QUEROL' || customSubtitle !== 'CONSULTORIA JURÍDICA') && (
                      <Button 
                        onClick={() => {
                          setCustomName('FELIPE QUEROL');
                          setCustomSubtitle('CONSULTORIA JURÍDICA');
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 text-[9px] font-black uppercase bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl px-3"
                        title="Restaurar padrão Felipe Querol"
                      >
                        Resetar Felipe
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
          {/* Share Custom Link Button — oculto */}
          <Button
            onClick={handleShareLink}
            variant="outline"
            className="hidden border-[#cca752]/30 hover:border-[#cca752] bg-[#12121a]/85 text-[#cca752] hover:text-[#cca752] font-black text-xs uppercase tracking-wider rounded-xl h-11 px-4 items-center gap-2 transition-all shadow-md shadow-black"
          >
            <Send className="w-3.5 h-3.5" /> Compartilhar Link
          </Button>

          <Badge variant="outline" className={`font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            currentView === 'marcas'
              ? 'border-cyan-500/20 bg-cyan-950/30 text-cyan-400'
              : currentView === 'societario'
              ? 'border-violet-500/20 bg-violet-950/30 text-violet-400'
              : 'border-[#cca752]/20 bg-[#cca752]/5 text-[#cca752]'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            {currentView === 'marcas' ? 'Módulo Marcas Ativo' : currentView === 'societario' ? 'Módulo Societário Ativo' : 'Portal Unificado Seguro'}
          </Badge>
        </div>
      </div>

      {/* ==========================================
          LOBBY SCREEN: TWO SELECTION CARDS
          ========================================== */}
      {currentView === 'lobby' && (
        <div className="relative z-10 space-y-12 py-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Badge className="bg-[#cca752]/10 text-[#cca752] border border-[#cca752]/25 font-black text-xs uppercase tracking-widest px-3 py-1">
              Central de Inteligência Legal
            </Badge>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Escolha o Módulo de Trabalho</h2>
            <p className="text-slate-200 text-base leading-relaxed">
              Selecione a vertical jurídica que deseja operar. Os sistemas rodam de forma independente e segura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1: Marcas & Patentes */}
            <Card 
              onClick={() => setCurrentView('marcas')}
              className="bg-[#0f0f14]/90 hover:bg-[#0f0f14] border-2 border-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 group flex flex-col space-y-6"
            >
              <div 
                className="h-44 w-full bg-cover bg-center border-b border-cyan-500/15 transition-transform duration-500 group-hover:scale-[1.01]"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80')` }}
              />
              <div className="p-8 pt-0 flex flex-col items-center text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider group-hover:text-cyan-400 transition-colors">Marcas & Patentes</h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Gestão de marcas no INPI, monitoramento semanal inteligente da RPI para detecção de conflitos críticos e confecção automática de minutas de oposição.
                  </p>
                </div>
                <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 text-xs font-black uppercase tracking-widest px-3 py-1">
                  Acessar Operação
                </Badge>
              </div>
            </Card>

            {/* Card 2: Societário & Holdings */}
            <Card 
              onClick={() => setCurrentView('societario')}
              className="bg-[#0f0f14]/90 hover:bg-[#0f0f14] border-2 border-violet-500/25 hover:border-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 group flex flex-col space-y-6"
            >
              <div 
                className="h-44 w-full bg-cover bg-center border-b border-violet-500/15 transition-transform duration-500 group-hover:scale-[1.01]"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80')` }}
              />
              <div className="p-8 pt-0 flex flex-col items-center text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider group-hover:text-violet-400 transition-colors">Societário & Holdings</h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Calculadora de economia tributária familiar, simulador de sucessão patrimonial por holding e auditor de vulnerabilidade em acordo de sócios.
                  </p>
                </div>
                <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/25 text-xs font-black uppercase tracking-widest px-3 py-1">
                  Acessar Operação
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ==========================================
          MÓDULO 1: MARCAS & PATENTES (INPI)
          ========================================== */}
      {currentView === 'marcas' && (
        <div className="space-y-12">
          {/* Back Button */}
          <div className="relative z-10 flex justify-start">
            <Button 
              onClick={() => setCurrentView('lobby')}
              variant="ghost"
              className="text-xs font-black uppercase tracking-widest border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/10 rounded-xl px-5 h-11"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Módulos
            </Button>
          </div>
          {/* METRICS ROW */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { 
                id: 'total', 
                title: 'Total Processos', 
                value: processes.length, 
                desc: 'Acompanhados no INPI', 
                icon: FileText, 
                color: 'text-[#cca752]', 
                filterVal: null,
                borderColor: 'border-2 border-[#cca752]/25',
                hoverBorder: 'hover:border-[#cca752]/60 hover:shadow-[0_0_20px_rgba(204,167,82,0.15)]',
                bgActive: 'bg-[#cca752]/10',
                borderActive: 'border-[3px] border-[#cca752]',
                shadowActive: 'shadow-[0_0_30px_rgba(204,167,82,0.45)]'
              },
              { 
                id: 'exame', 
                title: 'Aguardando Exame', 
                value: processes.filter(p => p.status === 'Aguardando Exame de Mérito').length, 
                desc: 'Fila de análise técnica', 
                icon: Clock, 
                color: 'text-amber-500', 
                filterVal: 'Aguardando Exame de Mérito',
                borderColor: 'border-2 border-amber-500/25',
                hoverBorder: 'hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
                bgActive: 'bg-amber-500/10',
                borderActive: 'border-[3px] border-amber-500',
                shadowActive: 'shadow-[0_0_30px_rgba(245,158,11,0.45)]'
              },
              { 
                id: 'conflitos', 
                title: 'Alertas Conflitos', 
                value: processes.filter(p => p.status === 'Oposição Deferida').length, 
                desc: 'Varredura da RPI esta semana', 
                icon: AlertTriangle, 
                color: 'text-rose-500', 
                filterVal: 'Oposição Deferida',
                borderColor: 'border-2 border-rose-500/25',
                hoverBorder: 'hover:border-rose-500/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
                bgActive: 'bg-rose-500/10',
                borderActive: 'border-[3px] border-rose-500',
                shadowActive: 'shadow-[0_0_30px_rgba(244,63,94,0.45)]'
              },
              { 
                id: 'oposicoes', 
                title: 'Oposições Ativas', 
                value: processes.filter(p => p.status === 'Publicado para Oposição').length, 
                desc: 'Ações judiciais correntes', 
                icon: Activity, 
                color: 'text-cyan-400', 
                filterVal: 'Publicado para Oposição',
                borderColor: 'border-2 border-cyan-500/25',
                hoverBorder: 'hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
                bgActive: 'bg-cyan-500/10',
                borderActive: 'border-[3px] border-cyan-500',
                shadowActive: 'shadow-[0_0_30px_rgba(6,182,212,0.45)]'
              }
            ].map((metric, idx) => {
              const isActive = statusFilter === metric.filterVal;
              return (
                <Card 
                  key={idx} 
                  onClick={() => setStatusFilter(isActive ? null : metric.filterVal)}
                  className={`bg-[#0f0f14]/90 backdrop-blur-md shadow-xl rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? `${metric.borderActive} ${metric.bgActive} scale-[1.03] ${metric.shadowActive}` 
                      : `${metric.borderColor} ${metric.hoverBorder} hover:scale-[1.01]`
                  }`}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-200 uppercase tracking-widest">{metric.title}</p>
                      <h3 className="text-3xl font-black text-white font-sans">{metric.value}</h3>
                      <p className="text-xs text-gray-200 font-medium">{metric.desc}</p>
                    </div>
                    <div className="p-3 bg-[#13131a] rounded-xl border border-white/5 shadow-md">
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* QUICK ACTION: NOVO PROCESSO (Diferenciado em Esmeralda/Verde) */}
            <Card 
              onClick={() => setIsNewProcessOpen(true)}
              className="bg-emerald-500/5 hover:bg-emerald-500/10 border-[3px] border-dashed border-emerald-500/40 cursor-pointer hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all backdrop-blur-md shadow-2xl rounded-2xl flex items-center justify-center group h-full"
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2 w-full h-full">
                <div className="p-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/30 group-hover:scale-110 transition-transform shadow-md">
                  <PlusCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-widest">Novo Processo</p>
                  <p className="text-xs text-emerald-300 mt-1 font-bold font-sans">Registrar nova marca no INPI</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RPI AUTOMATIC CONFLICT SCANNER */}
          <div className="relative z-10">
            <Card className="bg-[#0f0f14]/80 border-2 border-red-500/20 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
              <CardContent className="p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 font-black text-xs uppercase tracking-widest px-3 py-1">
                      Scanner Inteligente RPI (INPI)
                    </Badge>
                    <h2 className="text-2xl font-black text-white font-headline uppercase mt-2">Detector Automático de Conflitos</h2>
                    <p className="text-slate-200 text-sm leading-normal">
                      Roda varreduras heurísticas na Revista da Propriedade Industrial buscando tentativas de registros conflitantes por terceiros.
                    </p>
                  </div>
                  <Button
                    onClick={runRPIScanner}
                    disabled={isScanning}
                    className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm h-12 px-6 rounded-xl shadow-xl shadow-red-600/15"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Escaneando Banco...
                      </>
                    ) : (
                      'Executar Varredura Semanal'
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {scanResult === 'completed' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/5 pt-6 space-y-4"
                    >
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 shrink-0 animate-pulse" />
                        <div className="space-y-1 text-left">
                          <h4 className="font-bold text-red-400 text-sm uppercase tracking-wide">Colisão Crítica Detectada</h4>
                          <p className="text-sm text-slate-100">
                            Um terceiro protocolou pedido para a marca <strong className="text-white font-bold">"{scanResultDetail?.brand || "NEXUS SUL"}"</strong> na Classe de Nice <strong className="text-white font-bold">{scanResultDetail?.class || "42"}</strong> (Software).
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-300 font-sans font-bold">
                            <span>Marca Alvo: Nexus Holding Group</span>
                            <span>•</span>
                            <span>Prazo Limite para Oposição: <strong className="text-red-400 font-bold">{scanResultDetail?.limitDate || "12/10/2026"}</strong></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button 
                          variant="ghost" 
                          onClick={() => setScanResult(null)} 
                          className="text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-xl text-sm font-black uppercase tracking-widest px-4 h-10"
                        >
                          Dispensar Alerta
                        </Button>
                        <Button 
                          onClick={handleGenerateOpposition}
                          disabled={isDraftLoading}
                          className="bg-zinc-900 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-black uppercase tracking-widest px-6 h-10"
                        >
                          {isDraftLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Gerando Minuta...
                            </>
                          ) : (
                            <>
                              <FileCheck2 className="w-4 h-4 mr-2" /> Gerar Minuta de Oposição
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* TABELA DE PROCESSOS INPI */}
          <div className="relative z-10">
            <Card className="bg-[#0f0f14]/80 border border-[#cca752]/20 backdrop-blur-md shadow-2xl rounded-3xl">
              <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                    <FileText className="h-5 w-5 text-[#cca752]" />
                    Banco de Processos Ativos (CRM)
                  </CardTitle>
                  <CardDescription className="text-slate-200 text-sm">Lista detalhada de marcas gerenciadas no escritório.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative w-full sm:w-[480px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Pesquisar por marca, cliente ou status..."
                      className="w-full bg-[#13131a] border border-white/10 rounded-xl h-12 py-3 pl-12 pr-4 text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#cca752] transition-colors"
                    />
                  </div>
                  <Button 
                    onClick={() => setIsNewProcessOpen(true)}
                    className="bg-[#cca752] hover:bg-[#e6c16c] text-[#0a0a0c] font-black text-sm uppercase tracking-widest rounded-xl h-10 px-4 whitespace-nowrap"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Novo Processo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {statusFilter && (
                  <div className="mb-4 flex items-center gap-2">
                    <Badge className="bg-[#cca752]/10 text-[#cca752] border border-[#cca752]/20 text-xs py-1 px-3">
                      Filtro Ativo: {statusFilter}
                    </Badge>
                    <button 
                      onClick={() => setStatusFilter(null)}
                      className="text-xs text-[#cca752] hover:text-[#e6c16c] font-bold underline transition-colors"
                    >
                      Limpar Filtro
                    </button>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-200 uppercase tracking-widest font-black text-xs md:text-sm">
                        <th className="py-4 px-4">Nº Processo</th>
                        <th className="py-4 px-4">Marca</th>
                        <th className="py-4 px-4">Cliente</th>
                        <th className="py-4 px-4">Classe Nice</th>
                        <th className="py-4 px-4">Status INPI</th>
                        <th className="py-4 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProcesses.map((proc) => (
                        <tr key={proc.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-4 px-4 font-sans font-extrabold text-[#cca752] tracking-wider text-sm">{proc.id}</td>
                          <td className="py-4 px-4 font-bold text-white text-base">{proc.marca}</td>
                          <td className="py-4 px-4 text-slate-300 text-sm md:text-base">{proc.cliente}</td>
                          <td className="py-4 px-4 font-sans text-gray-200 text-sm font-semibold">{proc.classe}</td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant="outline" 
                              className={`font-black text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-lg ${
                                proc.status === 'Marca Concedida'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : proc.status === 'Publicado para Oposição'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : proc.status === 'Oposição Deferida'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                              }`}
                            >
                              {proc.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button 
                              onClick={() => alert(`Status Histórico:\n${proc.logs}`)}
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-slate-200 hover:text-white border border-white/5 rounded-lg hover:bg-white/5"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ==========================================
          MÓDULO 2: SOCIETÁRIO & HOLDINGS
          ========================================== */}
      {currentView === 'societario' && (
        <div className="space-y-12">
          {/* Back Button */}
          <div className="relative z-10 flex justify-start">
            <Button 
              onClick={() => setCurrentView('lobby')}
              variant="ghost"
              className="text-xs font-black uppercase tracking-widest border border-violet-500/25 text-violet-400 hover:bg-violet-500/10 rounded-xl px-5 h-11"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Módulos
            </Button>
          </div>
          {/* METRICS ROW */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { 
                id: 'holding', 
                title: 'Holding Familiar', 
                value: corporateOperations.filter(op => op.operacao === 'Holding Familiar').length,
                desc: 'Simulações de Sucessão', 
                icon: Building2, 
                color: 'text-violet-400',
                filterVal: 'Holding Familiar',
                borderColor: 'border-2 border-violet-500/25',
                hoverBorder: 'hover:border-violet-500/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]',
                bgActive: 'bg-violet-500/10',
                borderActive: 'border-[3px] border-violet-500',
                shadowActive: 'shadow-[0_0_30px_rgba(139,92,246,0.45)]'
              },
              { 
                id: 'partnership', 
                title: 'Acordos de Sócios', 
                value: corporateOperations.filter(op => op.operacao === 'Acordo de Sócios').length,
                desc: 'Auditorias de Vulnerabilidade', 
                icon: Users, 
                color: 'text-amber-500',
                filterVal: 'Acordo de Sócios',
                borderColor: 'border-2 border-amber-500/25',
                hoverBorder: 'hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
                bgActive: 'bg-amber-500/10',
                borderActive: 'border-[3px] border-amber-500',
                shadowActive: 'shadow-[0_0_30px_rgba(245,158,11,0.45)]'
              },
              { 
                id: 'junta', 
                title: 'Registrado na Junta', 
                value: corporateOperations.filter(op => op.status === 'Registrado na Junta').length,
                desc: 'Operações em compliance', 
                icon: ShieldCheck, 
                color: 'text-emerald-400',
                filterVal: 'Registrado na Junta',
                borderColor: 'border-2 border-emerald-500/25',
                hoverBorder: 'hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
                bgActive: 'bg-emerald-500/10',
                borderActive: 'border-[3px] border-emerald-500',
                shadowActive: 'shadow-[0_0_30px_rgba(16,185,129,0.45)]'
              },
              { 
                id: 'minutas', 
                title: 'Minutas Pendentes', 
                value: corporateOperations.filter(op => op.status !== 'Registrado na Junta').length,
                desc: 'Em elaboração ou assinatura', 
                icon: FileCheck2, 
                color: 'text-cyan-400',
                filterVal: 'Minutas Pendentes',
                borderColor: 'border-2 border-cyan-500/25',
                hoverBorder: 'hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
                bgActive: 'bg-cyan-500/10',
                borderActive: 'border-[3px] border-cyan-500',
                shadowActive: 'shadow-[0_0_30px_rgba(6,182,212,0.45)]'
              }
            ].map((metric, idx) => {
              const isActive = corporateFilter === metric.filterVal;
              return (
                <Card 
                  key={idx} 
                  onClick={() => setCorporateFilter(isActive ? null : metric.filterVal)}
                  className={`bg-[#0f0f14]/90 backdrop-blur-md shadow-xl rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? `${metric.borderActive} ${metric.bgActive} scale-[1.03] ${metric.shadowActive}` 
                      : `${metric.borderColor} ${metric.hoverBorder} hover:scale-[1.01]`
                  }`}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-200 uppercase tracking-widest">{metric.title}</p>
                      <h3 className="text-3xl font-black text-white font-sans">{metric.value}</h3>
                      <p className="text-xs text-gray-200 font-medium">{metric.desc}</p>
                    </div>
                    <div className="p-3 bg-[#13131a] rounded-xl border border-white/5 shadow-md">
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* QUICK ACTION: NOVA OPERAÇÃO SOCIETÁRIA (Diferenciado em Esmeralda/Verde) */}
            <Card 
              onClick={() => setIsNewCorporateOpen(true)}
              className="bg-emerald-500/5 hover:bg-emerald-500/10 border-[3px] border-dashed border-emerald-500/40 cursor-pointer hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all backdrop-blur-md shadow-2xl rounded-2xl flex items-center justify-center group h-full"
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2 w-full h-full">
                <div className="p-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/30 group-hover:scale-110 transition-transform shadow-md">
                  <PlusCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-widest">Nova Operação</p>
                  <p className="text-xs text-emerald-400/80 mt-1 font-semibold font-mono">Manter nova holding ou contrato</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HUB TABS */}
          <div className="relative z-10 flex justify-center">
            <div className="flex bg-[#0f0f14]/60 border border-white/5 rounded-2xl p-1 shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setActiveSocietarioTab('holding')}
                className={`px-6 py-2.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all ${
                  activeSocietarioTab === 'holding'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                Planejador de Holding Familiar
              </button>
              <button
                onClick={() => setActiveSocietarioTab('partnership')}
                className={`px-6 py-2.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all ${
                  activeSocietarioTab === 'partnership'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                Auditor de Acordo de Sócios
              </button>
            </div>
          </div>

          {/* WORKSPACE AREA */}
          <div className="relative z-10 max-w-5xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {activeSocietarioTab === 'holding' ? (
                /* HOLDING SIMULATOR FORM */
                <motion.div
                  key="holding_sim"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <Card className="bg-[#0f0f14]/80 border border-violet-500/20 backdrop-blur-md shadow-2xl rounded-3xl">
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-1 text-center max-w-2xl mx-auto">
                        <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/25 font-black text-xs uppercase tracking-widest px-3 py-1">
                          Simulação Patrimonial
                        </Badge>
                        <h3 className="text-xl font-black text-white uppercase mt-2">Simulador de Custos Sucessórios</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-200 uppercase tracking-widest">Valor dos Imóveis (R$)</label>
                          <input 
                            type="number"
                            value={imoveis}
                            onChange={(e) => setImoveis(e.target.value)}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-base text-white font-sans font-bold focus:outline-none focus:border-violet-500" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-200 uppercase tracking-widest">Cotas & Investimentos (R$)</label>
                          <input 
                            type="number"
                            value={outrosAtivos}
                            onChange={(e) => setOutrosAtivos(e.target.value)}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-base text-white font-sans font-bold focus:outline-none focus:border-violet-500" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-200 uppercase tracking-widest">Herdeiros / Sócios</label>
                          <input 
                            type="number"
                            value={herdeiros}
                            onChange={(e) => setHerdeiros(e.target.value)}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-base text-white font-sans font-bold focus:outline-none focus:border-violet-500" 
                          />
                        </div>
                      </div>

                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={handleSimulateHolding}
                          disabled={isHoldingLoading}
                          className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-sm h-12 px-8 rounded-xl"
                        >
                          {isHoldingLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analisando Ativos...
                            </>
                          ) : (
                            'Simular Estrutura de Holding'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {isHoldingSimulated && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in"
                    >
                      <Card className="bg-[#0f0f14]/80 border-2 border-red-500/20 rounded-3xl p-6">
                        <h4 className="text-sm font-black uppercase text-red-400 flex items-center gap-2 mb-4">
                          <TrendingDown className="w-4 h-4" /> Inventário Judicial (Tradicional ~18%)
                        </h4>
                        <h3 className="text-2xl font-black text-red-500 font-sans tracking-wider">
                          R$ {custoTradicional.toLocaleString('pt-BR')}
                        </h3>
                        <p className="text-sm text-slate-200 mt-3 leading-relaxed">
                          Processo demorado (1 a 3 anos), alto desgaste familiar, com bloqueio imediato de contas operacionais da empresa.
                        </p>
                      </Card>

                      <Card className="bg-[#0f0f14]/80 border-2 border-emerald-500/20 rounded-3xl p-6">
                        <h4 className="text-sm font-black uppercase text-emerald-400 flex items-center gap-2 mb-4">
                          <ShieldCheck className="w-4 h-4" /> Holding Familiar (Planejada ~5.5%)
                        </h4>
                        <h3 className="text-2xl font-black text-emerald-400 font-sans tracking-wider">
                          R$ {custoHolding.toLocaleString('pt-BR')}
                        </h3>
                        <p className="text-sm text-slate-200 mt-3 leading-relaxed">
                          Doação de cotas concluída em até 60 dias com reserva de usufruto vitalício. **Economia estimada de R$ {economiaEstimada.toLocaleString('pt-BR')}**.
                        </p>
                      </Card>

                      {/* Map Diagram */}
                      <Card className="md:col-span-2 bg-[#0f0f14]/80 border border-violet-500/20 rounded-3xl p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                          <div className="flex-1 bg-black/40 border border-white/5 p-4 rounded-xl w-full">
                            <h5 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Patrimônio Consolidado</h5>
                            <p className="text-base font-black text-white mt-1">R$ {totalPatrimonio.toLocaleString('pt-BR')}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-violet-500 hidden md:block" />
                          <div className="flex-1 bg-black/40 border border-violet-500/30 p-4 rounded-xl w-full">
                            <h5 className="text-xs font-black text-violet-400 uppercase tracking-widest">Holding S.A. Integralizada</h5>
                            <p className="text-sm font-bold text-slate-100 mt-1">Imunidade de ITBI ativa</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-violet-500 hidden md:block" />
                          <div className="flex-1 bg-black/40 border border-emerald-500/30 p-4 rounded-xl w-full">
                            <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Doação de Cotas (Herdeiros)</h5>
                            <p className="text-sm font-bold text-slate-100 mt-1">Usufruto & Controle Retidos</p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
                          <Button 
                            onClick={handleGenerateMoU}
                            className="bg-zinc-900 border border-violet-500/40 text-violet-400 hover:bg-violet-500/10 rounded-xl text-sm font-black uppercase tracking-widest px-6 h-11"
                          >
                            <FileText className="w-4 h-4 mr-2" /> Gerar MoU de Planejamento de Holding
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* PARTNERSHIP CHECKLIST AUDITOR */
                <motion.div
                  key="partnership_sim"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <Card className="bg-[#0f0f14]/80 border border-amber-500/20 backdrop-blur-md shadow-2xl rounded-3xl">
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-1 text-center max-w-2xl mx-auto">
                        <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/25 font-black text-xs uppercase tracking-widest px-3 py-1">
                          Auditoria de Contrato
                        </Badge>
                        <h3 className="text-xl font-black text-white uppercase mt-2">Vulnerabilidade em Acordo de Sócios</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-200 uppercase tracking-widest">Sócio Majoritário</label>
                          <input 
                            type="text"
                            value={partnerA}
                            onChange={(e) => setPartnerA(e.target.value)}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-base text-white focus:outline-none focus:border-amber-500" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-200 uppercase tracking-widest">Sócio Minoritário / Investidor</label>
                          <input 
                            type="text"
                            value={partnerB}
                            onChange={(e) => setPartnerB(e.target.value)}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-base text-white focus:outline-none focus:border-amber-500" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-6">
                        {[
                          { state: hasTagAlong, setter: setHasTagAlong, label: 'Tag-Along ativo (Protege minoritário)', desc: 'Garante o direito de venda conjunta nas mesmas condições.' },
                          { state: hasDragAlong, setter: setHasDragAlong, label: 'Drag-Along ativo (Protege majoritário)', desc: 'Força minoritários a vender em caso de proposta de aquisição integral.' },
                          { state: hasRightOfFirstRefusal, setter: setHasRightOfFirstRefusal, label: 'Direito de Preferência estabelecido', desc: 'Exige oferta interna de cotas antes de transferência a estranhos.' },
                          { state: hasNonCompete, setter: setHasNonCompete, label: 'Cláusula de Não-Concorrência (Non-Compete)', desc: 'Impede sócio de fundar concorrente no mesmo segmento após saída.' }
                        ].map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => item.setter(!item.state)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
                              item.state 
                                ? 'bg-amber-500/10 border-amber-500/40 text-white' 
                                : 'bg-black/30 border-white/5 text-slate-200 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                item.state ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/20'
                              }`}>
                                {item.state && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                              </div>
                              <div>
                                <p className="text-sm font-black uppercase tracking-wider">{item.label}</p>
                                <p className="text-xs text-gray-200 mt-0.5">{item.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={handleAuditPartnership}
                          disabled={isPartnershipLoading}
                          className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-sm h-12 px-8 rounded-xl shadow-md"
                        >
                          {isPartnershipLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Verificando Riscos...
                            </>
                          ) : (
                            'Analisar Acordo de Sócios'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {isPartnershipAudited && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <Card className="bg-[#0f0f14]/80 border-2 border-amber-500/20 rounded-3xl p-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                          <h4 className="text-sm font-black uppercase text-amber-500">Mapeamento de Riscos Societários</h4>
                          <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black text-xs uppercase tracking-widest py-1 px-3">
                            {auditLevel || (!hasTagAlong || !hasDragAlong || !hasNonCompete ? 'Exposição de Risco Ativa' : 'Foco em Compliance')}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          {auditAlerts && auditAlerts.length > 0 ? (
                            auditAlerts.map((alertItem: any, idx: number) => {
                              const isRed = alertItem.risk.includes('SEM') || alertItem.risk.includes('RISCO') || alertItem.risk.includes('VULNERABILIDADE');
                              return (
                                <div 
                                  key={idx} 
                                  className={`p-4 rounded-2xl border flex gap-3 ${
                                    isRed 
                                      ? 'bg-red-500/5 border-red-500/10' 
                                      : 'bg-amber-500/5 border-amber-500/10'
                                  }`}
                                >
                                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isRed ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
                                  <p className="text-sm text-slate-100">
                                    <strong className={`block font-bold uppercase text-xs ${isRed ? 'text-red-400' : 'text-amber-400'}`}>
                                      {alertItem.risk}
                                    </strong>
                                    {alertItem.desc}
                                  </p>
                                </div>
                              );
                            })
                          ) : (
                            <>
                              {!hasTagAlong && (
                                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3">
                                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                                  <p className="text-sm text-slate-100">
                                    <strong className="text-red-400 block font-bold uppercase text-xs">Alerta: Sem Tag-Along</strong>
                                    Em caso de venda do bloco de controle, o minoritário {partnerB} pode ser obrigado a conviver no quadro com um novo sócio majoritário sem garantias de venda proporcional de suas cotas.
                                  </p>
                                </div>
                              )}

                              {!hasDragAlong && (
                                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3">
                                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                  <p className="text-sm text-slate-100">
                                    <strong className="text-amber-400 block font-bold uppercase text-xs">Alerta: Sem Drag-Along</strong>
                                    O controlador {partnerA} não consegue forçar os minoritários a vender suas cotas em caso de proposta de fusão de 100% da empresa, permitindo travas indesejadas de liquidez.
                                  </p>
                                </div>
                              )}

                              {!hasNonCompete && (
                                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex gap-3">
                                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                  <p className="text-sm text-slate-100">
                                    <strong className="text-yellow-400 block font-bold uppercase text-xs">Alerta: Sem Non-Compete</strong>
                                    Se qualquer um dos sócios se retirar da sociedade, ele pode imediatamente fundar uma nova empresa concorrente no mesmo segmento sem amarras contratuais protetivas.
                                  </p>
                                </div>
                              )}

                              {hasTagAlong && hasDragAlong && hasRightOfFirstRefusal && hasNonCompete && (
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3">
                                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                  <p className="text-sm text-slate-100">
                                    <strong className="text-emerald-400 block font-bold uppercase text-xs">Estrutura Protegida</strong>
                                    O contrato atual atende às principais cláusulas de segurança de governança societária.
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
                          <Button 
                            onClick={handleGeneratePartnership}
                            className="bg-zinc-900 border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 rounded-xl text-sm font-black uppercase tracking-widest px-6 h-11"
                          >
                            <FileText className="w-4 h-4 mr-2" /> Gerar Minuta de Acordo de Sócios
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BANCO DE OPERAÇÕES SOCIETÁRIAS (CRM TABLE) */}
          <div className="relative z-10 mt-12">
            <Card className="bg-[#0f0f14]/80 border border-violet-500/20 backdrop-blur-md shadow-2xl rounded-3xl">
              <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                    <Building2 className="h-5 w-5 text-violet-400" />
                    Banco de Operações Societárias (CRM)
                  </CardTitle>
                  <CardDescription className="text-slate-200 text-sm">Acompanhamento de holdings, acordos de sócios e contratos de governança.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative w-full sm:w-[480px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      type="text"
                      value={corporateSearchTerm}
                      onChange={(e) => setCorporateSearchTerm(e.target.value)}
                      placeholder="Pesquisar por operação, cliente ou status..."
                      className="w-full bg-[#13131a] border border-white/10 rounded-xl h-12 py-3 pl-12 pr-4 text-base text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <Button 
                    onClick={() => setIsNewCorporateOpen(true)}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-black text-sm uppercase tracking-widest rounded-xl h-10 px-4 whitespace-nowrap"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Nova Operação
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {corporateFilter && (
                  <div className="mb-4 flex items-center gap-2">
                    <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs py-1 px-3">
                      Filtro Ativo: {corporateFilter}
                    </Badge>
                    <button 
                      onClick={() => setCorporateFilter(null)}
                      className="text-xs text-violet-400 hover:text-violet-300 font-bold underline transition-colors"
                    >
                      Limpar Filtro
                    </button>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-200 uppercase tracking-widest font-black text-xs md:text-sm">
                        <th className="py-4 px-4">Código Op</th>
                        <th className="py-4 px-4">Tipo de Operação</th>
                        <th className="py-4 px-4">Cliente / Entidade</th>
                        <th className="py-4 px-4">Data Registro</th>
                        <th className="py-4 px-4">Status de Compliance</th>
                        <th className="py-4 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCorporateOperations.map((op) => (
                        <tr key={op.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-4 px-4 font-sans font-extrabold text-violet-400 tracking-wider text-sm">{op.id}</td>
                          <td className="py-4 px-4 font-bold text-white text-base">{op.operacao}</td>
                          <td className="py-4 px-4 text-slate-300 text-sm md:text-base">{op.cliente}</td>
                          <td className="py-4 px-4 font-sans text-gray-200 text-sm font-semibold">{op.data}</td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant="outline" 
                              className={`font-black text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-lg ${
                                op.status === 'Registrado na Junta'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : op.status === 'Minuta Aprovada'
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                  : op.status === 'Aguardando Assinatura'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                              }`}
                            >
                              {op.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button 
                              onClick={() => alert(`Histórico de Compliance:\n${op.logs}`)}
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-slate-200 hover:text-white border border-white/5 rounded-lg hover:bg-white/5"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ==========================================
          MODALS & FLOATING WORKSPACE WINDOWS (OVERLAYS)
          ========================================== */}
      
      {/* MODAL: NOVO PROCESSO MARCAS */}
      {isNewProcessOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-zinc-950 border-2 border-emerald-500/30 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-1.5 bg-emerald-500" />
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-headline text-white flex items-center gap-2 uppercase tracking-tighter">
                <PlusCircle className="h-5 w-5 text-emerald-400" /> Registrar Processo INPI
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">Insira os dados do processo protocolado no INPI.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 pt-0">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome da Marca</label>
                <input 
                  value={newMarca}
                  onChange={(e) => setNewMarca(e.target.value)}
                  placeholder="Ex: Nexus Holding Group" 
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#cca752]/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome do Cliente</label>
                <input 
                  value={newCliente}
                  onChange={(e) => setNewCliente(e.target.value)}
                  placeholder="Ex: Geanderson L. Schuh" 
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#cca752]/50" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Classe de Nice</label>
                  <input 
                    value={newClasse}
                    onChange={(e) => setNewClasse(e.target.value)}
                    placeholder="Ex: 09, 42" 
                    className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#cca752]/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Status Inicial</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-slate-300 focus:outline-none focus:border-[#cca752]"
                  >
                    <option value="Aguardando Publicação">Aguardando Publicação</option>
                    <option value="Aguardando Exame de Mérito">Exame de Mérito</option>
                    <option value="Publicado para Oposição">Publicado para Oposição</option>
                    <option value="Marca Concedida">Marca Concedida</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsNewProcessOpen(false)} 
                  className="flex-1 text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-xl h-12 font-black text-sm uppercase tracking-widest"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddProcess} 
                  className="flex-1 bg-[#cca752] hover:bg-[#e6c16c] text-[#0a0a0c] font-black text-sm uppercase tracking-widest rounded-xl h-12 shadow-lg shadow-[#cca752]/10"
                >
                  Criar Registro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: NOVA OPERAÇÃO SOCIETÁRIA */}
      {isNewCorporateOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-zinc-950 border-2 border-violet-500/30 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-1.5 bg-violet-500" />
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-headline text-white flex items-center gap-2 uppercase tracking-tighter">
                <PlusCircle className="h-5 w-5 text-violet-400" /> Registrar Operação Societária
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">Crie e acompanhe um novo planejamento corporativo ou holding.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 pt-0">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tipo de Operação</label>
                <select 
                  value={newCorporateType}
                  onChange={(e) => setNewCorporateType(e.target.value)}
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-slate-300 focus:outline-none focus:border-violet-500"
                >
                  <option value="Holding Familiar">Holding Familiar</option>
                  <option value="Acordo de Sócios">Acordo de Sócios</option>
                  <option value="Contrato Social">Contrato Social</option>
                  <option value="Lock-Up Agreement">Lock-Up Agreement</option>
                  <option value="Non-Compete Agreement">Non-Compete Agreement</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cliente / Entidade Beneficiária</label>
                <input 
                  value={newCorporateCliente}
                  onChange={(e) => setNewCorporateCliente(e.target.value)}
                  placeholder="Ex: Família Schuh ou EuroDesign SpA" 
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-violet-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Status Inicial de Compliance</label>
                <select 
                  value={newCorporateStatus}
                  onChange={(e) => setNewCorporateStatus(e.target.value)}
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-slate-300 focus:outline-none focus:border-violet-500"
                >
                  <option value="Em Elaboração">Em Elaboração</option>
                  <option value="Aguardando Assinatura">Aguardando Assinatura</option>
                  <option value="Minuta Aprovada">Minuta Aprovada</option>
                  <option value="Registrado na Junta">Registrado na Junta</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsNewCorporateOpen(false)} 
                  className="flex-1 text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-xl h-12 font-black text-sm uppercase tracking-widest"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddCorporateOperation} 
                  className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-black text-sm uppercase tracking-widest rounded-xl h-12 shadow-lg shadow-violet-600/10"
                >
                  Criar Registro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MINUTA OVERLAYS CONTAINER */}
      <AnimatePresence>
        {/* WORKSPACE: Minuta de Oposição (Marcas) */}
        {isDraftOpen && (
          <>
            {isDraftMinimized ? (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[160] w-[380px] bg-[#0f0f14] border-2 border-[#cca752] rounded-2xl shadow-2xl p-4 flex items-center justify-between animate-bounce"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse shrink-0" />
                  <span className="text-xs font-black uppercase text-white truncate max-w-[200px]">Minuta: NEXUS COSTA RICA</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setIsDraftMinimized(false)}
                    className="px-3 py-1.5 bg-[#cca752] text-[#0a0a0c] hover:bg-[#e6c16c] rounded-xl text-[10px] font-black uppercase flex items-center gap-1 shadow-md"
                  >
                    <Maximize2 className="w-3 h-3" /> Restaurar
                  </button>
                  <button 
                    onClick={() => setIsDraftOpen(false)}
                    className="p-1.5 bg-[#1c1c28] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-4xl bg-zinc-950 border-2 border-[#cca752]/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[85vh] relative"
                >
                  <div className="bg-[#12121a] border-b border-[#cca752]/20 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#cca752]" />
                        Elaboração de Minuta: Oposição de Registro (INPI)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsDraftMinimized(true)}
                        className="p-2 bg-[#1c1c28] hover:bg-[#cca752]/10 border border-white/5 hover:border-[#cca752]/30 rounded-xl text-slate-200 hover:text-[#cca752] transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setIsDraftOpen(false)}
                        className="p-2 bg-[#1c1c28] hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-xl text-slate-200 hover:text-red-500 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0f0f15] border-b border-white/5 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => setIsDraftEditing(!isDraftEditing)}
                        variant="outline"
                        className={`h-9 text-xs font-black uppercase tracking-wider rounded-xl border ${
                          isDraftEditing 
                            ? 'border-[#cca752] bg-[#cca752]/10 text-[#cca752]' 
                            : 'border-white/10 hover:border-[#cca752] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-2" />
                        {isDraftEditing ? 'Visualizar Minuta' : 'Editar Texto'}
                      </Button>
                      <Button 
                        onClick={async () => {
                          setIsDraftSending(true);
                          try {
                            const res = await fetch('/api/pactum', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'send-email',
                                payload: {
                                  to: 'Felipe@advquerol.com',
                                  subject: 'Minuta de Oposição ao Registro de Marca - INPI',
                                  body: draftText
                                }
                              })
                            });
                            const data = await res.json();
                            if (data.error) throw new Error(data.error);
                            alert('Minuta de oposição protocolada no INPI e cópia enviada com sucesso por e-mail para Felipe (Felipe@advquerol.com)!');
                            setIsDraftOpen(false);
                          } catch (err: any) {
                            alert('Erro ao enviar minuta por e-mail: ' + err.message);
                          } finally {
                            setIsDraftSending(false);
                          }
                        }}
                        disabled={isDraftSending}
                        className="h-9 bg-[#cca752] hover:bg-[#e6c16c] text-[#0a0a0c] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#cca752]/10"
                      >
                        {isDraftSending ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> Protocolando...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 mr-2" /> Enviar ao INPI / Protocolar
                          </>
                        )}
                      </Button>
                    </div>
                    <div>
                      <Button 
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este rascunho de minuta?')) {
                            setDraftText(initialDraftText);
                            setIsDraftOpen(false);
                          }
                        }}
                        variant="ghost"
                        className="h-9 text-xs font-black uppercase tracking-wider rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir Rascunho
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 bg-[#07070a] flex justify-center">
                    <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-xl p-8 min-h-[600px] flex flex-col font-serif relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
                        <Scale className="w-80 h-80 text-[#cca752]" />
                      </div>
                      <div className="relative z-10 flex-1 flex flex-col">
                        {isDraftEditing ? (
                          <textarea
                            value={draftText}
                            onChange={(e) => setDraftText(e.target.value)}
                            className="w-full flex-1 bg-transparent border-0 resize-none font-serif text-slate-200 text-base leading-relaxed focus:outline-none min-h-[500px] focus:ring-0"
                          />
                        ) : (
                          <pre className="whitespace-pre-wrap font-serif text-slate-200 text-base leading-relaxed text-justify flex-1">
                            {draftText}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#12121a] border-t border-white/5 px-6 py-3 flex justify-between items-center text-xs text-gray-500 font-mono">
                    <span>Palavras: {draftText.split(/\s+/).filter(Boolean).length} | Caracteres: {draftText.length}</span>
                    <span>Felipe Querol - Consultoria Jurídica • Licenciado</span>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* WORKSPACE: MoU Holding (Societário) */}
        {isHoldingMoUOpen && (
          <>
            {isHoldingMoUMinimized ? (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[160] w-[380px] bg-[#0f0f14] border-2 border-violet-500 rounded-2xl shadow-2xl p-4 flex items-center justify-between animate-bounce"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse shrink-0" />
                  <span className="text-xs font-black uppercase text-white truncate max-w-[200px]">MoU: Holding Familiar</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setIsHoldingMoUMinimized(false)}
                    className="px-3 py-1.5 bg-violet-600 text-white hover:bg-violet-500 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 shadow-md"
                  >
                    <Maximize2 className="w-3 h-3" /> Restaurar
                  </button>
                  <button 
                    onClick={() => setIsHoldingMoUOpen(false)}
                    className="p-1.5 bg-[#1c1c28] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-4xl bg-zinc-950 border-2 border-violet-500/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[85vh] relative"
                >
                  <div className="bg-[#12121a] border-b border-violet-500/20 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse" />
                      <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-400" />
                        Minuta de Estrutura: MoU de Holding Familiar
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsHoldingMoUMinimized(true)}
                        className="p-2 bg-[#1c1c28] hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 rounded-xl text-slate-200 hover:text-violet-400 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setIsHoldingMoUOpen(false)}
                        className="p-2 bg-[#1c1c28] hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-xl text-slate-200 hover:text-red-500 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0f0f15] border-b border-white/5 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => setIsHoldingMoUEditing(!isHoldingMoUEditing)}
                        variant="outline"
                        className={`h-9 text-xs font-black uppercase tracking-wider rounded-xl border ${
                          isHoldingMoUEditing 
                            ? 'border-violet-500 bg-violet-500/10 text-violet-400' 
                            : 'border-white/10 hover:border-violet-500 text-slate-200 hover:text-white'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-2" />
                        {isHoldingMoUEditing ? 'Visualizar Minuta' : 'Editar Texto'}
                      </Button>
                      <Button 
                        onClick={async () => {
                          setIsHoldingMoUSending(true);
                          try {
                            const res = await fetch('/api/pactum', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'send-email',
                                payload: {
                                  to: 'Felipe@advquerol.com',
                                  subject: 'Planejamento de Holding Familiar - Minuta de MoU',
                                  body: holdingMoUText
                                }
                              })
                            });
                            const data = await res.json();
                            if (data.error) throw new Error(data.error);
                            alert('Minuta de MoU enviada com sucesso para o e-mail do Felipe (Felipe@advquerol.com)!');
                            setIsHoldingMoUOpen(false);
                          } catch (err: any) {
                            alert('Erro ao enviar MoU por e-mail: ' + err.message);
                          } finally {
                            setIsHoldingMoUSending(false);
                          }
                        }}
                        disabled={isHoldingMoUSending}
                        className="h-9 bg-violet-600 hover:bg-violet-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-600/10"
                      >
                        {isHoldingMoUSending ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> Processando...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 mr-2" /> Protocolar Planejamento
                          </>
                        )}
                      </Button>
                    </div>
                    <div>
                      <Button 
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta minuta?')) {
                            setIsHoldingMoUOpen(false);
                          }
                        }}
                        variant="ghost"
                        className="h-9 text-xs font-black uppercase tracking-wider rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir Minuta
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 bg-[#07070a] flex justify-center">
                    <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-xl p-8 min-h-[600px] flex flex-col font-serif relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
                        <Scale className="w-80 h-80 text-[#cca752]" />
                      </div>
                      <div className="relative z-10 flex-1 flex flex-col">
                        {isHoldingMoUEditing ? (
                          <textarea
                            value={holdingMoUText}
                            onChange={(e) => setHoldingMoUText(e.target.value)}
                            className="w-full flex-1 bg-transparent border-0 resize-none font-serif text-slate-200 text-base leading-relaxed focus:outline-none min-h-[500px] focus:ring-0"
                          />
                        ) : (
                          <pre className="whitespace-pre-wrap font-serif text-slate-200 text-base leading-relaxed text-justify flex-1">
                            {holdingMoUText}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#12121a] border-t border-white/5 px-6 py-3 flex justify-between items-center text-xs text-gray-500 font-mono">
                    <span>Palavras: {holdingMoUText.split(/\s+/).filter(Boolean).length} | Caracteres: {holdingMoUText.length}</span>
                    <span>Felipe Querol - Consultoria Jurídica • Holding Familiar</span>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* WORKSPACE: Acordo de Sócios (Societário) */}
        {isPartnershipOpen && (
          <>
            {isPartnershipMinimized ? (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[160] w-[380px] bg-[#0f0f14] border-2 border-amber-500 rounded-2xl shadow-2xl p-4 flex items-center justify-between animate-bounce"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse shrink-0" />
                  <span className="text-xs font-black uppercase text-white truncate max-w-[200px]">Acordo de Sócios</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setIsPartnershipMinimized(false)}
                    className="px-3 py-1.5 bg-amber-500 text-black hover:bg-amber-400 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 shadow-md"
                  >
                    <Maximize2 className="w-3 h-3" /> Restaurar
                  </button>
                  <button 
                    onClick={() => setIsPartnershipOpen(false)}
                    className="p-1.5 bg-[#1c1c28] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-4xl bg-zinc-950 border-2 border-amber-500/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[85vh] relative"
                >
                  <div className="bg-[#12121a] border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                      <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-500" />
                        Minuta de Contrato: Acordo de Sócios (Partnership)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsPartnershipMinimized(true)}
                        className="p-2 bg-[#1c1c28] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 rounded-xl text-slate-200 hover:text-amber-500 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setIsPartnershipOpen(false)}
                        className="p-2 bg-[#1c1c28] hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-xl text-slate-200 hover:text-red-500 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0f0f15] border-b border-white/5 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => setIsPartnershipEditing(!isPartnershipEditing)}
                        variant="outline"
                        className={`h-9 text-xs font-black uppercase tracking-wider rounded-xl border ${
                          isPartnershipEditing 
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400' 
                            : 'border-white/10 hover:border-amber-500 text-slate-200 hover:text-white'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-2" />
                        {isPartnershipEditing ? 'Visualizar Minuta' : 'Editar Texto'}
                      </Button>
                      <Button 
                        onClick={async () => {
                          setIsPartnershipSending(true);
                          try {
                            const res = await fetch('/api/pactum', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'send-email',
                                payload: {
                                  to: 'Felipe@advquerol.com',
                                  subject: 'Acordo de Sócios (Partnership) - Assinatura Digital',
                                  body: partnershipText
                                }
                              })
                            });
                            const data = await res.json();
                            if (data.error) throw new Error(data.error);
                            alert('Minuta de Acordo de Sócios enviada com sucesso por e-mail para Felipe (Felipe@advquerol.com)!');
                            setIsPartnershipOpen(false);
                          } catch (err: any) {
                            alert('Erro ao enviar Acordo de Sócios por e-mail: ' + err.message);
                          } finally {
                            setIsPartnershipSending(false);
                          }
                        }}
                        disabled={isPartnershipSending}
                        className="h-9 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10"
                      >
                        {isPartnershipSending ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> Processando...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 mr-2" /> Assinatura Coletiva (Docusign)
                          </>
                        )}
                      </Button>
                    </div>
                    <div>
                      <Button 
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta minuta?')) {
                            setIsPartnershipOpen(false);
                          }
                        }}
                        variant="ghost"
                        className="h-9 text-xs font-black uppercase tracking-wider rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir Minuta
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 bg-[#07070a] flex justify-center">
                    <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-xl p-8 min-h-[600px] flex flex-col font-serif relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
                        <Scale className="w-80 h-80 text-[#cca752]" />
                      </div>
                      <div className="relative z-10 flex-1 flex flex-col">
                        {isPartnershipEditing ? (
                          <textarea
                            value={partnershipText}
                            onChange={(e) => setPartnershipText(e.target.value)}
                            className="w-full flex-1 bg-transparent border-0 resize-none font-serif text-slate-200 text-base leading-relaxed focus:outline-none min-h-[500px] focus:ring-0"
                          />
                        ) : (
                          <pre className="whitespace-pre-wrap font-serif text-slate-200 text-base leading-relaxed text-justify flex-1">
                            {partnershipText}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#12121a] border-t border-white/5 px-6 py-3 flex justify-between items-center text-xs text-gray-500 font-mono">
                    <span>Palavras: {partnershipText.split(/\s+/).filter(Boolean).length} | Caracteres: {partnershipText.length}</span>
                    <span>Felipe Querol - Consultoria Jurídica • Acordo de Sócios</span>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}
      </AnimatePresence>

    </div>
    </AuthGate>
  );
}
