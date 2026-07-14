'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  Eye, 
  Radio, 
  Bell, 
  MapPin, 
  Users, 
  RefreshCw, 
  AlertTriangle,
  Camera,
  Play, 
  Pause, 
  Server, 
  Lock, 
  Fingerprint, 
  Activity, 
  Clock, 
  Zap, 
  ArrowLeft, 
  Compass, 
  CheckCircle2
} from 'lucide-react';
import { WhiteLabelHeader } from '@/components/nexus/white-label-header';

interface LprLog {
  id: number;
  placa: string;
  camera: string;
  municipio: string;
  horario: string;
  status: 'OK' | 'ALERTA' | 'AUDITADO';
  detalhe: string;
  fotoUrl?: string;
}

interface Viatura {
  id: string;
  codigo: string;
  equipe: string;
  status: 'Patrulha' | 'Despachada' | 'Em QAP' | 'Apoio';
  localizacao: string;
  tempoEstimado?: string;
}

interface AuditEntry {
  id: string;
  operador: string;
  acao: string;
  hash: string;
  timestamp: string;
}

const FOTOS_LPR = [
  '/lpr_carro1.jpg',
  '/lpr_carro2.jpg',
  '/lpr_carro3.jpg',
  '/lpr_carro4.jpg',
];

const PLACAS_FIXAS = [
  'EGD1M44',
  'SUL7G88',
  'BRA2E19'
];

// Dicionário para ajuste milimétrico do LPR Patch no canto da tela, caso as fotos tenham proporções diferentes.
const FOTO_CONFIGS: Record<string, { bottom: string, left: string, scale: string }> = {
  '/lpr_egd1m44.jpg': { bottom: '15%', left: '50%', scale: '800%' },
  '/lpr_sul7g88.jpg': { bottom: '15%', left: '50%', scale: '800%' },
  '/lpr_bra2e19.jpg': { bottom: '15%', left: '50%', scale: '800%' }
};

// Retorna sempre a mesma foto base para a placa correta
const getFotoByPlaca = (placa: string): string => {
  if (placa === 'EGD1M44') return '/lpr_egd1m44.jpg';
  if (placa === 'SUL7G88') return '/lpr_sul7g88.jpg';
  if (placa === 'BRA2E19') return '/lpr_bra2e19.jpg';
  return '/lpr_egd1m44.jpg';
};

// Gera dados aleatórios mas usa as placas da demonstração para garantir coerência 100%
const generateRandomPlaca = () => {
  return PLACAS_FIXAS[Math.floor(Math.random() * PLACAS_FIXAS.length)];
};

export default function EgidePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      // Liberando acesso para funcionar como Showcase (Demonstração)
      setIsAuthorized(true);
    }
  }, [isUserLoading]);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedViatura, setSelectedViatura] = useState<Viatura | null>(null);
  const [selectedIntruder, setSelectedIntruder] = useState<AuditEntry | null>(null);
  const [selectedFotoLog, setSelectedFotoLog] = useState<LprLog | null>(null);
  const [zoomState, setZoomState] = useState<{ active: boolean; originX: number; originY: number }>({ active: false, originX: 50, originY: 50 });
  const [nightVision, setNightVision] = useState<Record<string, boolean>>({
    cam1: false,
    cam2: false,
    cam3: false,
    cam4: false,
  });

  // Commander Override States
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [commanderRole, setCommanderRole] = useState<'ti' | 'guarda' | 'pm'>('ti');
  const [commanderUser, setCommanderUser] = useState('');
  const [commanderPass, setCommanderPass] = useState('');
  const [overrideJustification, setOverrideJustification] = useState('');
  const [isScanningCommander, setIsScanningCommander] = useState(false);
  const [commanderPhotoMatched, setCommanderPhotoMatched] = useState(false);
  const [overrideSuccess, setOverrideSuccess] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleStartBiometricScan = () => {
    if (!commanderUser.trim() || !commanderPass.trim() || !overrideJustification.trim()) {
      alert("Por favor, preencha todos os campos e justifique a liberação.");
      return;
    }
    setIsScanningCommander(true);
    setScanProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        setScanProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsScanningCommander(false);
          setCommanderPhotoMatched(true);
        }, 500);
      } else {
        setScanProgress(currentProgress);
      }
    }, 120);
  };

  const handleConfirmOverride = () => {
    if (!selectedIntruder) return;
    
    setAudits(prev => prev.map(a => {
      if (a.id === selectedIntruder.id) {
        let roleLabel = 'Comandante de TI';
        if (commanderRole === 'guarda') roleLabel = 'Comandante da Guarda Municipal';
        if (commanderRole === 'pm') roleLabel = 'Comandante da PM';
        
        return {
          ...a,
          operador: `autorizado_por_${commanderRole}`,
          acao: `TENTATIVA AEGIS LIBERADA - Justificativa: "${overrideJustification}" (Aprovado por ${roleLabel})`,
          hash: `SHA256:decrypted...${Math.random().toString(16).substring(2, 6)}`
        };
      }
      return a;
    }));

    const horario = new Date().toTimeString().split(' ')[0];
    const roleLabel = commanderRole === 'ti' ? 'TI' : commanderRole === 'guarda' ? 'Guarda Municipal' : 'Polícia Militar';
    const auditOverrideLog: AuditEntry = {
      id: `AUD-OVER`,
      operador: `comandante_${commanderRole}`,
      acao: `MASTER OVERRIDE: Acesso liberado para admin_santa_cruz pelo Comandante (${roleLabel}). Biometria S3 atualizada.`,
      hash: `SHA256:crypt...${Math.random().toString(16).substring(2, 8)}`,
      timestamp: horario
    };
    
    setAudits(prev => [auditOverrideLog, ...prev]);

    setAtenaRecommendation(
      `Override biométrico concluído com sucesso. A nova assinatura facial do operador da Prefeitura de Santa Cruz foi atualizada no S3 do Amazon Cognito. Acesso liberado e registrado no Dante's Ledger com chave SHA256.`
    );

    setOverrideSuccess(true);
  };

  const handleCloseIntruderModal = () => {
    setSelectedIntruder(null);
    setIsOverrideOpen(false);
    setCommanderUser('');
    setCommanderPass('');
    setOverrideJustification('');
    setIsScanningCommander(false);
    setCommanderPhotoMatched(false);
    setOverrideSuccess(false);
    setScanProgress(0);
  };


  const [isPlaying, setIsPlaying] = useState(true);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [alertStage, setAlertStage] = useState<'detector' | 'despachado'>('detector');
  const [processedCount, setProcessedCount] = useState(43910);
  const [logs, setLogs] = useState<LprLog[]>([
    { id: 1, placa: 'EGD1M44', camera: '01 - Entrada Norte', municipio: 'Vale Verde, RS', horario: '10:30:15', status: 'OK', detalhe: 'Cadastro Regular', fotoUrl: '/lpr_egd1m44.jpg' },
    { id: 2, placa: 'SUL7G88', camera: '03 - Centro', municipio: 'Mato Leitão, RS', horario: '10:30:08', status: 'OK', detalhe: 'Cadastro Regular', fotoUrl: '/lpr_sul7g88.jpg' },
    { id: 3, placa: 'BRA2E19', camera: '02 - Rodovia RS-422', municipio: 'Santa Cruz, RS', horario: '10:29:48', status: 'OK', detalhe: 'Cadastro Regular', fotoUrl: '/lpr_bra2e19.jpg' },
    { id: 4, placa: 'EGD1M44', camera: '04 - Acesso Sul', municipio: 'Passo do Sobrado, RS', horario: '10:29:12', status: 'OK', detalhe: 'Cadastro Regular', fotoUrl: '/lpr_egd1m44.jpg' }
  ]);
  
  const [viaturas, setViaturas] = useState<Viatura[]>([
    { id: '1', codigo: 'VT-01 (Guarda)', equipe: 'Sgt. Ramos / Sd. Costa', status: 'Patrulha', localizacao: 'Centro Histórico' },
    { id: '2', codigo: 'VT-02 (Tática)', equipe: 'Ten. Alvarez / Sd. Santos', status: 'Em QAP', localizacao: 'Entrada Leste - RS-422' },
    { id: '3', codigo: 'VT-03 (Trânsito)', equipe: 'Sd. Lima / Sd. Rocha', status: 'Patrulha', localizacao: 'Av. das Palmeiras' },
    { id: '4', codigo: 'VT-04 (Apoio)', equipe: 'Sgt. Mello / Sd. Vieira', status: 'Em QAP', localizacao: 'Posto Comando Central' }
  ]);

  const [audits, setAudits] = useState<AuditEntry[]>([
    { id: 'AUD-SOS', operador: 'unknown_intruder', acao: 'BLOQUEIO AEGIS: Tentativa de login Prefeitura de Santa Cruz [Webcam Ativa]', hash: 'SHA256:99f32e9...a12c', timestamp: '10:31:02' },
    { id: 'AUD-901', operador: 'gabinete_nexus_user', acao: 'Consulta Placa VAL5J29', hash: 'SHA256:8b4f02a...a991', timestamp: '10:30:16' },
    { id: 'AUD-900', operador: 'gabinete_nexus_user', acao: 'Acesso Câmera 01 - Entrada Norte', hash: 'SHA256:d8c2e11...41ff', timestamp: '10:28:45' }
  ]);

  const [atenaRecommendation, setAtenaRecommendation] = useState(
    "Monitorando todos os acessos municipais de Mato Leitão e região. Nossos sensores apontam 100% de normalidade operacional. O fluxo de trânsito está livre e as rotas táticas estão asseguradas."
  );
  
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Intervalo simulador de tráfego LPR
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const placa = generateRandomPlaca();
      
      const cameras = ['01 - Entrada Norte', '02 - Rodovia RS-422', '03 - Centro', '04 - Acesso Sul', '05 - Portal de Entrada'];
      const municipios = ['Mato Leitão, RS', 'Vale Verde, RS', 'Passo do Sobrado, RS', 'Santa Cruz, RS'];
      
      const camera = cameras[Math.floor(Math.random() * cameras.length)];
      const municipio = municipios[Math.floor(Math.random() * municipios.length)];
      const horario = new Date().toTimeString().split(' ')[0];
      
      const newLog: LprLog = {
        id: Date.now(),
        placa,
        camera,
        municipio,
        horario,
        status: 'OK',
        detalhe: 'Cadastro Regular',
        fotoUrl: getFotoByPlaca(placa)
      };

      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      setProcessedCount(prev => prev + 1);

      const newAudit: AuditEntry = {
        id: `AUD-${Math.floor(Math.random() * 900) + 100}`,
        operador: 'system_egide_lpr',
        acao: `Leitura automática OCR/LPR placa ${placa}`,
        hash: `SHA256:${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
        timestamp: horario
      };
      setAudits(prev => [newAudit, ...prev.slice(0, 5)]);

    }, 2500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Função para simular o alerta
  const handleTriggerAlert = () => {
    setIsAlertActive(true);
    setAlertStage('detector');
    
    const horario = new Date().toTimeString().split(' ')[0];
    const targetPlaca = 'SUL7G88';
    const alertLog: LprLog = {
      id: Date.now(),
      placa: targetPlaca,
      camera: '05 - Portal de Entrada',
      municipio: 'Mato Leitão, RS',
      horario,
      status: 'ALERTA',
      detalhe: 'ALERTA DE FURTO ATIVO',
      fotoUrl: getFotoByPlaca(targetPlaca)
    };

    setLogs(prev => [alertLog, ...prev]);
    setProcessedCount(prev => prev + 1);

    const auditIncident: AuditEntry = {
      id: `AUD-911`,
      operador: 'sistema_cerco_inteligente',
      acao: `DISPARO DE ALERTA OCR: Veículo Roubado ${targetPlaca}`,
      hash: 'SHA256:c3a11f2...599b',
      timestamp: horario
    };
    setAudits(prev => [auditIncident, ...prev]);

    setAtenaRecommendation(
      "Alerta de alta prioridade gerado no Portal de Entrada. Placa SUL7G88 possui registro ativo de furto. Recomendo o despacho imediato da Viatura 02 (Grupo Tático) que se encontra em QAP nas proximidades da RS-422."
    );
  };

  // Função para simular tentativa de intrusão do Aegis
  const handleTriggerAegisIntrusion = () => {
    const horario = new Date().toTimeString().split(' ')[0];
    const newIntrusion: AuditEntry = {
      id: `AUD-SOS-${Date.now()}`,
      operador: 'unknown_intruder',
      acao: 'BLOQUEIO AEGIS: Tentativa de login Prefeitura de Santa Cruz [Webcam Ativa]',
      hash: `SHA256:${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: horario
    };

    setAudits(prev => [newIntrusion, ...prev]);

    setAtenaRecommendation(
      "Detector de Intrusão Aegis ativado! Bloqueei uma tentativa de login suspeita vinda da Prefeitura de Santa Cruz. A assinatura biométrica Rekognition falhou. O registro criptográfico foi selado de forma imutável no Dante's Safe. O Comandante de Setor já pode fazer a verificação e o override."
    );

    setSelectedIntruder(newIntrusion);
  };

  // Simular o despacho
  const handleDispatch = () => {
    setAlertStage('despachado');
    
    setViaturas(prev => prev.map(vt => {
      if (vt.codigo.includes('VT-02')) {
        return {
          ...vt,
          status: 'Despachada',
          tempoEstimado: '4 min',
          localizacao: 'Rumo à RS-422 - Entrada Leste'
        };
      }
      return vt;
    }));

    const horario = new Date().toTimeString().split(' ')[0];
    const auditDispatch: AuditEntry = {
      id: `AUD-912`,
      operador: 'gabinete_nexus_user',
      acao: 'Despacho tático via WebSocket autorizado para VT-02 (Tática)',
      hash: 'SHA256:ff39b0d...772a',
      timestamp: horario
    };
    setAudits(prev => [auditDispatch, ...prev]);

    setAtenaRecommendation(
      "Operação de interceptação autorizada com sucesso. Viaturas despachadas em milissegundos via canal de WebSocket seguro. A rota de fuga norte está geofenciada pela Viatura 01."
    );
  };

  // Resetar o simulador
  const handleResetSimulator = () => {
    setIsAlertActive(false);
    setAlertStage('detector');
    setViaturas([
      { id: '1', codigo: 'VT-01 (Guarda)', equipe: 'Sgt. Ramos / Sd. Costa', status: 'Patrulha', localizacao: 'Centro Histórico' },
      { id: '2', codigo: 'VT-02 (Tática)', equipe: 'Ten. Alvarez / Sd. Santos', status: 'Em QAP', localizacao: 'Entrada Leste - RS-422' },
      { id: '3', codigo: 'VT-03 (Trânsito)', equipe: 'Sd. Lima / Sd. Rocha', status: 'Patrulha', localizacao: 'Av. das Palmeiras' },
      { id: '4', codigo: 'VT-04 (Apoio)', equipe: 'Sgt. Mello / Sd. Vieira', status: 'Em QAP', localizacao: 'Posto Comando Central' }
    ]);
    setAtenaRecommendation(
      "Monitorando todos os acessos municipais de Mato Leitão e região. Nossos sensores apontam 100% de normalidade operacional. O fluxo de trânsito está livre e as rotas táticas estão asseguradas."
    );
  };

  // Função para recalcular patrulhas (Atena AI)
  const handleAtenaOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setAtenaRecommendation(
        "Recalculei o patrulhamento preventivo. Baseado nos dados históricos do SageMaker, há um pico de fluxo comercial em Vale Verde das 11:30 às 13:00. Desloquei temporariamente a Viatura 03 para patrulha da área."
      );
      
      const horario = new Date().toTimeString().split(' ')[0];
      const auditOpt: AuditEntry = {
        id: `AUD-915`,
        operador: 'atena_ai_optimizer',
        acao: 'Otimização preditiva de patrulhas enviada ao EventBridge',
        hash: 'SHA256:77bc2aa...009e',
        timestamp: horario
      };
      setAudits(prev => [auditOpt, ...prev]);
    }, 1500);
  };

  // Acionamento Manual de Despacho
  const handleManualDispatch = (id: string) => {
    const localizacoes = [
      'Entrada Norte - RS-422',
      'Acesso Sul - Mato Leitão',
      'Vale Verde - Av. Central',
      'Passo do Sobrado - Centro'
    ];
    const locDestino = localizacoes[Math.floor(Math.random() * localizacoes.length)];
    const minutos = Math.floor(Math.random() * 6) + 2;

    setViaturas(prev => prev.map(vt => {
      if (vt.id === id) {
        return {
          ...vt,
          status: 'Despachada',
          tempoEstimado: `${minutos} min`,
          localizacao: `Deslocamento: ${locDestino}`
        };
      }
      return vt;
    }));

    const vtr = viaturas.find(v => v.id === id);
    if (!vtr) return;

    const horario = new Date().toTimeString().split(' ')[0];
    const auditManual: AuditEntry = {
      id: `AUD-${Math.floor(Math.random() * 900) + 100}`,
      operador: 'gabinete_nexus_user',
      acao: `MANUAL DISPATCH: Viatura ${vtr.codigo} acionada para ${locDestino}`,
      hash: `SHA256:m02d19f...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: horario
    };
    setAudits(prev => [auditManual, ...prev]);

    setAtenaRecommendation(
      `Acionamento manual realizado. A Viatura ${vtr.codigo} foi despachada para ${locDestino} com tempo de interceptação estimado em ${minutos} minutos.`
    );
  };

  // Retorno Manual (Chamar QAP)
  const handleManualRecall = (id: string) => {
    const locaisStandby = [
      'Centro Histórico',
      'Entrada Leste - RS-422',
      'Av. das Palmeiras',
      'Posto Comando Central'
    ];
    const novoLocal = locaisStandby[Math.floor(Math.random() * locaisStandby.length)];

    setViaturas(prev => prev.map(vt => {
      if (vt.id === id) {
        const statuses: ('Patrulha' | 'Em QAP')[] = ['Patrulha', 'Em QAP'];
        return {
          ...vt,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          tempoEstimado: undefined,
          localizacao: novoLocal
        };
      }
      return vt;
    }));

    const vtr = viaturas.find(v => v.id === id);
    if (!vtr) return;

    const horario = new Date().toTimeString().split(' ')[0];
    const auditRecall: AuditEntry = {
      id: `AUD-${Math.floor(Math.random() * 900) + 100}`,
      operador: 'gabinete_nexus_user',
      acao: `MANUAL RECALL: Viatura ${vtr.codigo} retornou ao QAP em ${novoLocal}`,
      hash: `SHA256:r09c85f...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: horario
    };
    setAudits(prev => [auditRecall, ...prev]);

    setAtenaRecommendation(
      `A Viatura ${vtr.codigo} foi desmobilizada e retornou com sucesso ao seu posto de prontidão (QAP) no setor ${novoLocal}.`
    );
  };

  // Simular Chamada de Rádio
  const handleManualRadio = (codigo: string) => {
    const mensagensRadio = [
      `"Canal Alfa ativo. Operação ocorrendo dentro da normalidade no setor."`,
      `"QAP central. Realizando patrulhamento preventivo em vias de acesso."`,
      `"Entendido. Cobertura de perímetro ativa, sem anormalidades identificadas."`,
      `"Tático operacional na escuta. Equipamento de LPR operando 100%."`
    ];
    const msgAleatoria = mensagensRadio[Math.floor(Math.random() * mensagensRadio.length)];

    const horario = new Date().toTimeString().split(' ')[0];
    const auditRadio: AuditEntry = {
      id: `AUD-${Math.floor(Math.random() * 900) + 100}`,
      operador: 'gabinete_nexus_user',
      acao: `RADIO CALL: Comunicação encriptada iniciada com ${codigo}`,
      hash: `SHA256:a92f02b...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: horario
    };
    setAudits(prev => [auditRadio, ...prev]);

    setAtenaRecommendation(
      `Comunicação estabelecida com a unidade ${codigo}. Transmissão recebida: ${msgAleatoria}`
    );
  };

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-primary/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Verificando Credenciais</h2>
      </div>
    );
  }

  return (
    <>
    <div className="w-full min-h-screen bg-[#060709] text-slate-200 relative overflow-hidden pb-16">
      {/* Luzes táticas de alerta no background se o alerta estiver ativo */}
      {isAlertActive && (
        <div className="absolute inset-0 bg-red-950/15 pointer-events-none z-0 transition-colors duration-500 animate-pulse border-4 border-red-500/30" />
      )}

      {/* BACKGROUND EFFECTS PREMIUM (ÉGIDE) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#02040A]">
        <div className="absolute inset-0 flex items-center justify-center opacity-70 mix-blend-screen pointer-events-none">
           <div className="absolute inset-0" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='1000' height='1000' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='glow' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%233b82f6' stop-opacity='0.1'/%3E%3Cstop offset='100%25' stop-color='%233b82f6' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1000' height='1000' fill='url(%23glow)'/%3E%3Cline x1='500' y1='0' x2='500' y2='1000' stroke='%233b82f6' stroke-width='1' opacity='0.3'/%3E%3Cline x1='0' y1='500' x2='1000' y2='500' stroke='%233b82f6' stroke-width='1' opacity='0.3'/%3E%3Cline x1='146' y1='146' x2='853' y2='853' stroke='%233b82f6' stroke-width='1' opacity='0.1'/%3E%3Cline x1='146' y1='853' x2='853' y2='146' stroke='%233b82f6' stroke-width='1' opacity='0.1'/%3E%3Ccircle cx='500' cy='500' r='100' fill='none' stroke='%233b82f6' stroke-width='1' opacity='0.4'/%3E%3Ccircle cx='500' cy='500' r='200' fill='none' stroke='%233b82f6' stroke-width='1' opacity='0.2' stroke-dasharray='5 5'/%3E%3Ccircle cx='500' cy='500' r='300' fill='none' stroke='%233b82f6' stroke-width='1' opacity='0.4'/%3E%3Ccircle cx='500' cy='500' r='400' fill='none' stroke='%233b82f6' stroke-width='1' opacity='0.2' stroke-dasharray='10 15'/%3E%3Ccircle cx='500' cy='500' r='450' fill='none' stroke='%233b82f6' stroke-width='2' opacity='0.5'/%3E%3Ccircle cx='500' cy='500' r='460' fill='none' stroke='%233b82f6' stroke-width='10' opacity='0.3' stroke-dasharray='2 22'/%3E%3Ccircle cx='500' cy='500' r='470' fill='none' stroke='%233b82f6' stroke-width='4' opacity='0.5' stroke-dasharray='1 5.8'/%3E%3Cpath d='M 500 50 A 450 450 0 0 1 818 181' fill='none' stroke='%2360a5fa' stroke-width='6' opacity='0.8'/%3E%3Cpath d='M 181 818 A 450 450 0 0 1 50 500' fill='none' stroke='%2360a5fa' stroke-width='6' opacity='0.8'/%3E%3Ctext x='510' y='60' fill='%2360a5fa' font-family='monospace' font-size='14' opacity='0.8'%3EAZIMUTH 000°%3C/text%3E%3Ctext x='830' y='170' fill='%2360a5fa' font-family='monospace' font-size='14' opacity='0.8'%3ESEC-NX-01%3C/text%3E%3Ctext x='510' y='210' fill='%2360a5fa' font-family='monospace' font-size='12' opacity='0.6'%3ERANGE 200KM%3C/text%3E%3Ctext x='510' y='310' fill='%2360a5fa' font-family='monospace' font-size='12' opacity='0.6'%3ERANGE 300KM%3C/text%3E%3Ctext x='510' y='410' fill='%2360a5fa' font-family='monospace' font-size='12' opacity='0.6'%3ERANGE 400KM%3C/text%3E%3Ctext x='100' y='490' fill='%2360a5fa' font-family='monospace' font-size='14' opacity='0.8'%3EWEST SECTOR DETECT%3C/text%3E%3Cpath d='M 480 500 L 520 500 M 500 480 L 500 520' stroke='%23ffffff' stroke-width='2' opacity='0.8'/%3E%3C/svg%3E")`,
               backgroundSize: '100vmin 100vmin',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat'
             }} 
           />

           <style>{`
             @keyframes radar-expand {
               0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
               100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
             }
             .animate-radar-expand-1 { animation: radar-expand 6s cubic-bezier(0.1, 0.5, 0.2, 1) infinite; }
             .animate-radar-expand-2 { animation: radar-expand 6s cubic-bezier(0.1, 0.5, 0.2, 1) infinite 2s; }
             .animate-radar-expand-3 { animation: radar-expand 6s cubic-bezier(0.1, 0.5, 0.2, 1) infinite 4s; }
           `}</style>
           
           <div className="absolute top-1/2 left-1/2 w-[100vmin] h-[100vmin] border-2 border-blue-500 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0)_50%,rgba(59,130,246,0.3)_100%)] animate-radar-expand-1 pointer-events-none" />
           <div className="absolute top-1/2 left-1/2 w-[100vmin] h-[100vmin] border-2 border-blue-500 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0)_50%,rgba(59,130,246,0.3)_100%)] animate-radar-expand-2 pointer-events-none" />
           <div className="absolute top-1/2 left-1/2 w-[100vmin] h-[100vmin] border-2 border-blue-500 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0)_50%,rgba(59,130,246,0.3)_100%)] animate-radar-expand-3 pointer-events-none" />
           
           <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2">
             <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75 duration-1000"></span>
             <span className="relative flex h-full w-full rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]"></span>
           </div>
           
           <div className="absolute top-1/2 left-1/2 w-[100vmin] h-[100vmin] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="absolute top-[30%] left-[75%] flex flex-col items-center justify-center">
               <div className="relative flex items-center justify-center mb-1">
                 <span className="absolute h-6 w-6 animate-ping rounded-full bg-red-500 opacity-75"></span>
                 <span className="relative h-2 w-2 rounded-full bg-red-600 shadow-[0_0_15px_#ef4444]"></span>
               </div>
               <span className="text-red-500 font-mono text-[8px] opacity-80">LPR-NX1</span>
             </div>
             <div className="absolute top-[80%] left-[45%] flex flex-col items-center justify-center">
               <div className="relative flex items-center justify-center mb-1">
                 <span className="absolute h-4 w-4 animate-ping rounded-full bg-red-500 opacity-75" style={{ animationDelay: '0.3s' }}></span>
                 <span className="relative h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_15px_#ef4444]"></span>
               </div>
               <span className="text-red-500 font-mono text-[8px] opacity-80">CAM-Sul</span>
             </div>
             <div className="absolute top-[60%] left-[20%] flex flex-col items-center justify-center">
               <div className="relative flex items-center justify-center mb-1">
                 <span className="absolute h-5 w-5 animate-ping rounded-full bg-red-500 opacity-75" style={{ animationDelay: '0.8s' }}></span>
                 <span className="relative h-2 w-2 rounded-full bg-red-600 shadow-[0_0_15px_#ef4444]"></span>
               </div>
               <span className="text-red-500 font-mono text-[9px] font-bold opacity-100 tracking-widest bg-red-950/60 px-1 rounded border border-red-500/30">SUSPECT</span>
             </div>
             <div className="absolute top-[15%] left-[60%] flex flex-col items-center justify-center">
               <div className="relative flex items-center justify-center mb-1">
                 <span className="absolute h-3 w-3 animate-ping rounded-full bg-red-500 opacity-75" style={{ animationDelay: '1.2s' }}></span>
                 <span className="relative h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_15px_#ef4444]"></span>
               </div>
               <span className="text-red-500 font-mono text-[8px] opacity-60">LPR-NX2</span>
             </div>
           </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-blue-600/20 blur-[120px] rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] bg-indigo-700/25 blur-[130px] rounded-full animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-8 space-y-6">
        <div className="relative z-20 mb-[-1rem]">
          <Link 
            href="/exclusive" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-mono text-[10px] tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-sm w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Portfólio Exclusive
          </Link>
        </div>

        <div className="relative z-10 text-center mt-8 mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 px-3 py-1 text-xs font-black tracking-widest uppercase">
              <ShieldAlert className="w-4 h-4 mr-2 inline-block" />
              Módulo de Segurança e Cerco Tático
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-headline drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            NEXUS <span className="text-blue-500">ÉGIDE</span>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto my-8"
        >
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-blue-500/30 shadow-[0_0_60px_rgba(59,130,246,0.15)] bg-black/60">
            <CustomVideoPlayer 
              src="https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Avila_Egide.mp4" 
              className="aspect-video"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-blue-500/40 rounded-full z-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Briefing Tático - Cel. Ávila</span>
            </div>
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-6 p-10 md:p-14 bg-gradient-to-b from-blue-600/10 via-blue-600/5 to-transparent border border-blue-500/30 rounded-3xl w-full max-w-5xl mx-auto backdrop-blur-md text-center shadow-[0_0_50px_rgba(59,130,246,0.05)] mt-8 mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              <span className="absolute h-5 w-5 animate-ping rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative h-2.5 w-2.5 rounded-full bg-blue-400"></span>
            </div>
            <span className="text-blue-500 font-black uppercase tracking-[0.25em] text-xs md:text-sm">Engenharia Sob Medida (Bespoke)</span>
          </div>
          <p className="text-base md:text-xl text-slate-300 font-medium leading-relaxed max-w-4xl">
            A arquitetura de visão computacional e os protocolos de bloqueio do Égide são <strong className="text-white font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">100% adaptáveis</strong>. Nossos Arquitetos de Soluções podem treinar o reconhecimento de placas e padrões táticos para refletir exatamente os desafios de segurança pública ou privada da sua corporação.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pb-8">
          <Button 
            variant="outline" 
            onClick={handleResetSimulator}
            className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-14 px-8 rounded-2xl"
          >
            Resetar Simulador
          </Button>
          <Button 
            onClick={handleTriggerAlert} 
            disabled={isAlertActive}
            className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest h-14 px-8 rounded-2xl shadow-xl shadow-red-600/20"
          >
            <AlertTriangle className="w-5 h-5 mr-2 animate-pulse" />
            Simular Veículo Roubado
          </Button>
          <Button 
            onClick={handleTriggerAegisIntrusion} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest h-14 px-8 rounded-2xl shadow-xl shadow-indigo-600/20"
          >
            <Fingerprint className="w-5 h-5 mr-2" />
            Simular Bloqueio Aegis
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card 
            onClick={() => setIsCameraModalOpen(true)}
            className="bg-slate-900/80 border-slate-800/60 backdrop-blur-md cursor-pointer hover:border-blue-500/50 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Câmeras Operacionais</p>
                <p className="text-2xl font-black text-white mt-1">512 <span className="text-sm font-light text-slate-400">/ 512</span></p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/80 border-slate-800/60 backdrop-blur-md">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Leituras LPR (Hoje)</p>
                <p className="text-2xl font-black text-white mt-1">{processedCount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800/60 backdrop-blur-md">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Viaturas Ativas</p>
                <p className="text-2xl font-black text-white mt-1">
                  {viaturas.filter(v => v.status === 'Patrulha' || v.status === 'Despachada').length} 
                  <span className="text-sm font-light text-slate-400"> / {viaturas.length}</span>
                </p>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <Compass className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-slate-900/80 border-slate-800/60 backdrop-blur-md transition-all ${isAlertActive ? 'ring-2 ring-red-500' : ''}`}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Alertas Ativos</p>
                <p className={`text-2xl font-black mt-1 ${isAlertActive ? 'text-red-500' : 'text-slate-300'}`}>
                  {isAlertActive ? '1 CRÍTICO' : '0'}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isAlertActive ? 'bg-red-500/20 text-red-500 animate-bounce' : 'bg-slate-800 text-slate-500'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {isAlertActive && (
          <Card className="bg-red-950/40 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] relative overflow-hidden animate-fadeIn">
            <div className="absolute -right-16 -top-16 p-4 opacity-5 pointer-events-none">
              <ShieldAlert className="w-48 h-48 text-red-500" />
            </div>
            <CardContent className="p-6 relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shrink-0 animate-ping">
                  <Bell className="w-6 h-6 animate-swing" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-red-400 uppercase tracking-wide flex items-center gap-2">
                    EventBridge: Alerta de Furto Identificado no Cerco!
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Placa **SUL7G88** detectada na Câmera **05 - Portal de Entrada**. Cruzamento instantâneo com BD de furto em milissegundos.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex gap-2 w-full md:w-auto">
                {alertStage === 'detector' ? (
                  <Button 
                    onClick={handleDispatch}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold w-full md:w-auto shadow-md shadow-red-900/40"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Autorizar Despacho WebSockets
                  </Button>
                ) : (
                  <Badge className="bg-red-500/20 border-red-500 text-red-400 font-bold uppercase tracking-widest text-xs px-6 py-3">
                    Viatura VT-02 Despachada via WebSocket
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/70 border-slate-800/80 backdrop-blur-md flex flex-col h-[520px]">
              <CardContent className="p-6 flex flex-col h-full space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-blue-500 animate-pulse" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight font-headline">Cerco Eletrônico OCR/LPR · Fotos 90D</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[8px] text-violet-400 bg-violet-900/30 px-2 py-0.5 rounded border border-violet-500/30 font-mono">
                      <Fingerprint className="w-2.5 h-2.5" />
                      <span>BIOMETRIA FACIAL 24/7/365</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">Fluxo Live</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="border-slate-800 text-slate-400 hover:text-white h-8 w-8"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2.5">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-xl border transition-all duration-300 ${
                        log.status === 'ALERTA' 
                          ? 'bg-red-500/10 border-red-500/50 animate-pulse' 
                          : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`font-mono font-black text-base px-3 py-1.5 rounded-lg tracking-wider border shadow-inner ${
                          log.status === 'ALERTA'
                            ? 'bg-red-950 text-red-400 border-red-500/50'
                            : 'bg-slate-900 text-white border-slate-700'
                        }`}>
                          {log.placa}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-slate-200">{log.camera}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-600" />
                            <span>{log.municipio}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col items-end gap-2 sm:gap-1 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-center">
                        <span className="text-[11px] font-mono text-slate-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {log.horario}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] uppercase tracking-wider ${
                            log.status === 'ALERTA' 
                              ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {log.status === 'ALERTA' ? 'CRÍTICO' : 'LIBERADO'}
                        </Badge>
                        <button
                          onClick={() => setSelectedFotoLog(log)}
                          className="flex items-center gap-1 text-[8px] text-blue-400 bg-blue-900/30 hover:bg-blue-800/50 px-1.5 py-0.5 rounded border border-blue-500/30 font-mono transition-colors cursor-pointer"
                        >
                          <Eye className="w-2 h-2" />
                          <span>FOTO ARQUIVADA · 90D</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 border-slate-800/80 backdrop-blur-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight font-headline">Auditoria Imutável LGPD (Dante's Safe)</h3>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5 tracking-wider font-mono text-[9px]">
                    S3_WORM_ACTIVE
                  </Badge>
                </div>
                
                <p className="text-xs text-slate-400 italic">
                  Registros blindados e 100% imutáveis. O acesso a estes logs é restrito e encriptado, servindo de forma exclusiva e irrevogável como prova legal de validação operacional ou de má-fé.
                </p>

                <div className="space-y-2">
                  {audits.map((a) => {
                    const isAegisAlert = a.acao.includes('BLOQUEIO AEGIS');
                    return (
                      <div 
                        key={a.id} 
                        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border transition-all ${
                          isAegisAlert 
                            ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.05)] animate-pulse' 
                            : 'bg-slate-950/60 border-slate-900 hover:bg-slate-900/10'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className={`text-xs font-semibold ${isAegisAlert ? 'text-red-400' : 'text-slate-200'}`}>
                            {a.acao}
                          </p>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">Operador: <strong>{a.operador}</strong></span>
                            <span className="text-[10px] text-slate-600 font-mono">| {a.hash}</span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-end gap-2 shrink-0 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-center">
                          <span className="text-[10px] font-mono text-slate-500">{a.timestamp}</span>
                          {isAegisAlert && (
                            <Button 
                              onClick={() => setSelectedIntruder(a)}
                              className="h-6 px-2 text-[9px] font-bold bg-red-600 hover:bg-red-500 text-white"
                            >
                              Ver Captura
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-900/90 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.05)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
                <Shield className="w-48 h-48 text-blue-500" />
              </div>
              <CardContent className="p-6 relative z-10 flex flex-col gap-4">
                <div className="flex items-center pb-2 border-b border-blue-500/20">
                  <h3 className="text-xl font-black font-headline text-blue-400 flex items-center gap-3 uppercase tracking-tighter">
                    <Shield className="w-6 h-6 text-blue-500 animate-pulse" />
                    Inteligência Analítica Égide
                  </h3>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <p className="text-slate-300 text-xs italic font-light leading-relaxed">
                    "{atenaRecommendation}"
                  </p>
                </div>

                <Button 
                  onClick={handleAtenaOptimize}
                  disabled={isOptimizing}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
                  {isOptimizing ? 'Recalculando Rotas...' : 'Otimizar Patrulhamento'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 border-slate-800/80 backdrop-blur-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight font-headline">Viaturas Municipais</h3>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5 tracking-wider font-mono text-[9px]">
                    REAL_TIME
                  </Badge>
                </div>

                <div className="space-y-3.5">
                  {viaturas.map((v) => (
                    <div 
                      key={v.id} 
                      onClick={() => setSelectedViatura(v)}
                      className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex flex-col gap-2.5 cursor-pointer hover:border-indigo-500/50 hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(99,102,241,0.05)] transition-all select-none"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="space-y-1">
                          <p className="text-xs text-white font-bold">{v.codigo}</p>
                          <p className="text-[11px] text-slate-400">{v.equipe}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{v.localizacao}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <Badge 
                            className={`text-[9px] uppercase font-bold tracking-wider ${
                              v.status === 'Despachada' 
                                ? 'bg-red-500/20 text-red-400 border-red-500/40 border' 
                                : v.status === 'Patrulha'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 border'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {v.status}
                          </Badge>
                          {v.tempoEstimado && (
                            <span className="text-[10px] font-bold text-red-400 animate-pulse">
                              Chegada: {v.tempoEstimado}
                            </span>
                          )}
                        </div>
                      </div>

                      <div 
                        className="flex gap-1.5 pt-2 border-t border-slate-800/60 w-full justify-between items-center z-30" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Ações:</span>
                        <div className="flex gap-1.5">
                          {v.status === 'Despachada' ? (
                            <Button 
                              onClick={() => handleManualRecall(v.id)}
                              className="h-6 px-2 text-[9px] font-bold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800"
                            >
                              Chamar QAP
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleManualDispatch(v.id)}
                              className="h-6 px-2 text-[9px] font-bold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30"
                            >
                              Despachar
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleManualRadio(v.codigo)}
                            className="h-6 px-2 text-[9px] font-bold bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30"
                          >
                            Rádio
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isCameraModalOpen} onOpenChange={setIsCameraModalOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-5xl h-[85vh] flex flex-col p-6 overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-white text-xl font-headline flex items-center gap-2 uppercase tracking-wide">
              <Eye className="w-5 h-5 text-blue-500 animate-pulse" />
              Mosaico de Vídeo em Tempo Real - Cerco Eletrônico Égide
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 py-4 overflow-y-auto pr-1">
            <div 
              onClick={() => setNightVision(prev => ({ ...prev, cam1: !prev.cam1 }))}
              className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10" />
              <div className={`w-full h-full flex flex-col justify-between p-4 relative z-0 transition-all duration-500 ${nightVision.cam1 ? 'bg-emerald-950/20 grayscale brightness-125 contrast-125 saturate-200 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-300'}`}>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`font-mono text-[9px] uppercase border-none px-2 py-0.5 ${nightVision.cam1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>CAM_01 // ENTRADA NORTE</Badge>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                  <div className={`absolute border border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${nightVision.cam1 ? 'border-emerald-500/30 text-emerald-400/60' : 'border-blue-500/30 text-blue-500/60'}`}>
                    <Shield className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">LPR SCANNING</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setNightVision(prev => ({ ...prev, cam2: !prev.cam2 }))}
              className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10" />
              <div className={`w-full h-full flex flex-col justify-between p-4 relative z-0 transition-all duration-500 ${nightVision.cam2 ? 'bg-emerald-950/20 grayscale brightness-125 contrast-125 saturate-200 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-300'}`}>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`font-mono text-[9px] uppercase border-none px-2 py-0.5 ${nightVision.cam2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>CAM_02 // RODOVIA RS-422</Badge>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                  <div className={`absolute border border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${nightVision.cam2 ? 'border-emerald-500/30 text-emerald-400/60' : 'border-blue-500/30 text-blue-500/60'}`}>
                    <Shield className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">LPR SCANNING</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setNightVision(prev => ({ ...prev, cam3: !prev.cam3 }))}
              className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10" />
              <div className={`w-full h-full flex flex-col justify-between p-4 relative z-0 transition-all duration-500 ${nightVision.cam3 ? 'bg-emerald-950/20 grayscale brightness-125 contrast-125 saturate-200 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-300'}`}>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`font-mono text-[9px] uppercase border-none px-2 py-0.5 ${nightVision.cam3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>CAM_03 // CENTRO HISTÓRICO</Badge>
                </div>
                <div className="flex-1 flex">
                  <div className={`absolute bottom-4 left-16 w-24 h-16 border rounded flex items-center justify-center ${nightVision.cam3 ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-blue-400/50 bg-blue-400/5'}`}>
                    <span className="text-[8px] font-mono absolute -top-4 left-0 uppercase">VEHICLE_BOUNDS // CONF: 97%</span>
                    <span className="text-[9px] font-mono font-black">{logs[1]?.placa || 'SUL7G88'}</span>
                  </div>
                  <div className={`absolute border border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${nightVision.cam3 ? 'border-emerald-500/30 text-emerald-400/60' : 'border-blue-500/30 text-blue-500/60'}`}>
                    <Shield className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">LPR SCANNING</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setNightVision(prev => ({ ...prev, cam4: !prev.cam4 }))}
              className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10" />
              <div className={`w-full h-full flex flex-col justify-between p-4 relative z-0 transition-all duration-500 ${nightVision.cam4 ? 'bg-emerald-950/20 grayscale brightness-125 contrast-125 saturate-200 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-300'}`}>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`font-mono text-[9px] uppercase border-none px-2 py-0.5 ${nightVision.cam4 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>CAM_04 // ACESSO SUL</Badge>
                </div>
                <div className="flex-1 flex">
                  <div className={`absolute bottom-6 right-16 w-24 h-16 border rounded flex items-center justify-center ${nightVision.cam4 ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-blue-400/50 bg-blue-400/5'}`}>
                    <span className="text-[8px] font-mono absolute -top-4 left-0 uppercase">VEHICLE_BOUNDS // CONF: 96%</span>
                    <span className="text-[9px] font-mono font-black">{logs[3]?.placa || 'EGD1M44'}</span>
                  </div>
                  <div className={`absolute border border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${nightVision.cam4 ? 'border-emerald-500/30 text-emerald-400/60' : 'border-blue-500/30 text-blue-500/60'}`}>
                    <Shield className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">LPR SCANNING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedViatura !== null} onOpenChange={(open) => !open && setSelectedViatura(null)}>
        {selectedViatura && (
          <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-4xl p-6 overflow-hidden">
            <DialogHeader className="shrink-0 pb-4 border-b border-slate-900">
              <DialogTitle className="text-white text-xl font-headline flex items-center justify-between uppercase tracking-wide w-full">
                <span className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400 animate-pulse" />
                  Telemetria & Proteção da Tropa // {selectedViatura.codigo}
                </span>
                <Badge variant="outline" className={`font-mono text-[9px] px-2.5 py-0.5 border ${selectedViatura.status === 'Despachada' ? 'bg-red-500/10 text-red-400 border-red-500/30' : selectedViatura.status === 'Patrulha' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  STATUS: {selectedViatura.status.toUpperCase()}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Câmera Corporal Individual (Bodycam Kinesis Live)</p>
                <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
                  <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-900/10 text-slate-300">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="font-mono text-[8px] bg-slate-900/80 border-slate-700 text-slate-300">{selectedViatura.status === 'Despachada' ? 'BODYCAM_COMBATE_ACTIVE' : 'BODYCAM_STANDBY'}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex justify-between gap-2 border-t border-slate-900 pt-4 mt-2">
              <Button onClick={() => setSelectedViatura(null)} className="bg-slate-900 border border-slate-800 text-white font-bold hover:bg-slate-800 text-xs py-1">Fechar Telemetria</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={selectedIntruder !== null} onOpenChange={(open) => !open && handleCloseIntruderModal()}>
        {selectedIntruder && (
          <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
            <DialogHeader className="shrink-0 pb-4 border-b border-slate-900">
              <DialogTitle className="text-red-400 text-lg font-headline flex items-center gap-2 uppercase tracking-wide">
                <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                Alerta Aegis // Tentativa de Espionagem Detectada
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-4">
               <div className="bg-slate-900 border border-red-500/20 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-between p-4 bg-gradient-to-br from-red-950/20 to-transparent">
                 <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
               </div>
               <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                 <p className="text-[10px] text-slate-400 leading-relaxed italic">
                   <strong>Ação Automatizada:</strong> O login foi bloqueado devido à inconsistência biométrica facial (reconhecimento Rekognition 0%).
                 </p>
               </div>
            </div>
            <div className="shrink-0 flex justify-end gap-2 border-t border-slate-900 pt-4 mt-2">
              <Button onClick={handleCloseIntruderModal} className="bg-slate-900 border border-slate-800 text-white font-bold hover:bg-slate-800 text-xs py-1">Fechar Registro</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(600%); }
        }
        .animate-scanline { animation: scanline 4s linear infinite; }
        @keyframes laserScan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-laserScan { position: absolute; animation: laserScan 2s ease-in-out infinite; }
      `}</style>
      
      <div className="relative w-full border-t border-amber-500/20 bg-gradient-to-b from-[#111] to-[#050505] py-16 px-6 z-20 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 mb-4 px-3 py-1 font-mono uppercase tracking-widest text-xs">Showcase Mode Ativo</Badge>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">A Inteligência Moldada ao Seu Domínio</h2>
          <button onClick={() => window.open('https://wa.me/5548988582761', '_blank')} className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest text-sm rounded-lg hover:scale-105 transition-all mx-auto flex items-center gap-3">
             <ShieldCheck className="h-5 w-5" /> Acionar Arquiteto de Soluções
          </button>
        </div>
      </div>
    </div>

    {selectedFotoLog && (
      <Dialog open={!!selectedFotoLog} onOpenChange={() => { setSelectedFotoLog(null); }}>
        <DialogContent className="bg-slate-950 border border-blue-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-blue-400 text-base font-headline flex items-center gap-2 uppercase tracking-wide">
              <Camera className="w-5 h-5 text-blue-500" />
              Evidência Forense LPR
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center">
              {selectedFotoLog.fotoUrl ? (
                <div
                  className="w-full h-full relative cursor-zoom-in"
                  onClick={(e) => {
                    if (zoomState.active) {
                      setZoomState({ active: false, originX: 50, originY: 50 });
                    } else {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setZoomState({ active: true, originX: x, originY: y });
                    }
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transformOrigin: `${zoomState.originX}% ${zoomState.originY}%`,
                      transform: zoomState.active ? 'scale(3)' : 'scale(1)',
                      transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <img
                      src={selectedFotoLog.fotoUrl}
                      alt={`Veículo ${selectedFotoLog.placa}`}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        userSelect: 'none',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* LPR PATCH - CROP DA IMAGEM ORIGINAL NO CANTO DA TELA */}
                  <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1">
                    <div className="text-[7px] text-blue-400 font-mono font-bold tracking-widest uppercase mb-1">
                      LPR PATCH CAPTURE
                    </div>
                    <div className="w-32 h-12 border border-blue-500/50 rounded overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                      <img
                        src={selectedFotoLog.fotoUrl}
                        alt="Crop da placa"
                        style={{
                          position: 'absolute',
                          width: FOTO_CONFIGS[selectedFotoLog.fotoUrl]?.scale || '800%',
                          height: 'auto',
                          left: FOTO_CONFIGS[selectedFotoLog.fotoUrl]?.left || '50%',
                          bottom: FOTO_CONFIGS[selectedFotoLog.fotoUrl]?.bottom || '15%',
                          transform: 'translate(-50%, 0)',
                          pointerEvents: 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.2)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan opacity-50" />
                    </div>
                    <div className="bg-slate-900/90 border border-slate-700 rounded px-2 py-1 mt-1 text-center">
                      <span className="font-mono text-emerald-400 font-bold text-sm tracking-widest">
                        {selectedFotoLog.placa}
                      </span>
                      <div className="text-[6px] text-slate-400">OCR CONFIDENCE: 99.8%</div>
                    </div>
                  </div>

                  {!zoomState.active && (
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-white/60 bg-slate-900/70 px-2 py-1 rounded border border-slate-700/50 whitespace-nowrap pointer-events-none z-30">
                      🔍 Clique na imagem para aproximar
                    </div>
                  )}
                  {zoomState.active && (
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-blue-300/80 bg-slate-900/70 px-2 py-1 rounded border border-blue-500/30 whitespace-nowrap pointer-events-none z-30">
                      ✕ Clique para voltar
                    </div>
                  )}
                </div>
              ) : (
                <div className="z-10 flex flex-col items-center gap-3">
                  <div className={`font-mono font-black text-4xl px-8 py-4 rounded-xl border-2 shadow-2xl tracking-widest ${
                    selectedFotoLog.status === 'ALERTA'
                      ? 'bg-red-950 text-red-300 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                      : 'bg-slate-800 text-white border-slate-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  }`}>
                    {selectedFotoLog.placa}
                  </div>
                  <p className="text-[9px] text-slate-500 font-mono">{selectedFotoLog.municipio}</p>
                </div>
              )}

              <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase px-3 py-1 rounded font-mono z-20 ${
                selectedFotoLog.status === 'ALERTA'
                  ? 'bg-red-500/80 text-white border border-red-400'
                  : 'bg-emerald-500/80 text-white border border-emerald-400'
              }`}>
                {selectedFotoLog.status === 'ALERTA' ? '⚠ VEÍCULO EM ALERTA' : '✓ VEÍCULO REGULAR'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 space-y-1">
                <p className="text-slate-500 uppercase tracking-wider text-[8px]">Câmera</p>
                <p className="text-slate-200">{selectedFotoLog.camera}</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 space-y-1">
                <p className="text-slate-500 uppercase tracking-wider text-[8px]">Município</p>
                <p className="text-slate-200">{selectedFotoLog.municipio}</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 space-y-1">
                <p className="text-slate-500 uppercase tracking-wider text-[8px]">Horário da Captura</p>
                <p className="text-slate-200">{selectedFotoLog.horario}</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 space-y-1">
                <p className="text-slate-500 uppercase tracking-wider text-[8px]">Retenção</p>
                <p className="text-blue-400">Mín 60D · Máx 90D</p>
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-3 space-y-1">
              <p className="text-[8px] text-indigo-400 uppercase tracking-wider font-bold">Hash Forense SHA-256 (LGPD / Dante's Ledger)</p>
              <p className="text-[9px] font-mono text-slate-400 break-all">
                SHA256:{Math.abs(selectedFotoLog.id).toString(16).padStart(8,'0')}...{selectedFotoLog.placa.replace(/[^A-Z0-9]/g,'').toLowerCase()}...aws-s3-worm
              </p>
              <p className="text-[8px] text-slate-600 italic">Arquivo imutável. Não pode ser adulterado ou removido antes do prazo de retenção.</p>
            </div>

            <button
              onClick={() => setSelectedFotoLog(null)}
              className="w-full py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
            >
              Fechar Evidência
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
}
