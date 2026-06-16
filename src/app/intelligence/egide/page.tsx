'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Shield, 
  ShieldAlert, 
  Eye, 
  Radio, 
  Bell, 
  MapPin, 
  Users, 
  RefreshCw, 
  AlertTriangle, 
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

export default function EgidePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedViatura, setSelectedViatura] = useState<Viatura | null>(null);
  const [selectedIntruder, setSelectedIntruder] = useState<AuditEntry | null>(null);
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
    { id: 1, placa: 'VAL5J29', camera: '01 - Entrada Norte', municipio: 'Vale Verde, RS', horario: '10:30:15', status: 'OK', detalhe: 'Cadastro Regular' },
    { id: 2, placa: 'MTO2K31', camera: '03 - Centro', municipio: 'Mato Leitão, RS', horario: '10:30:08', status: 'OK', detalhe: 'Cadastro Regular' },
    { id: 3, placa: 'SCS8B90', camera: '02 - Rodovia RS-422', municipio: 'Santa Cruz, RS', horario: '10:29:48', status: 'OK', detalhe: 'Cadastro Regular' },
    { id: 4, placa: 'PSB1C42', camera: '04 - Acesso Sul', municipio: 'Passo do Sobrado, RS', horario: '10:29:12', status: 'OK', detalhe: 'Cadastro Regular' }
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
      // Gerar placa aleatória no formato Mercosul (ABC1D23)
      // Damos preferência a placas do RS (iniciando com I) ou alinhadas aos municípios
      const iniciarRS = Math.random() > 0.4;
      const letrasRS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const numerosRS = '0123456789'.split('');
      
      let letra1 = iniciarRS ? 'I' : letrasRS[Math.floor(Math.random() * letrasRS.length)];
      let letra2 = letrasRS[Math.floor(Math.random() * letrasRS.length)];
      let letra3 = letrasRS[Math.floor(Math.random() * letrasRS.length)];
      
      let num1 = numerosRS[Math.floor(Math.random() * numerosRS.length)];
      let letraAux = letrasRS[Math.floor(Math.random() * letrasRS.length)];
      let num2 = numerosRS[Math.floor(Math.random() * numerosRS.length)];
      let num3 = numerosRS[Math.floor(Math.random() * numerosRS.length)];
      
      let placa = `${letra1}${letra2}${letra3}${num1}${letraAux}${num2}${num3}`;

      // Injeção charmosa: 4% de chance de ler a placa do carro do Diretor (IRO8C85)
      const lerDiretor = Math.random() < 0.04;
      let statusLog: 'OK' | 'ALERTA' | 'AUDITADO' = 'OK';
      let detalheLog = 'Cadastro Regular';
      
      if (lerDiretor) {
        placa = 'IRO8C85';
        detalheLog = 'Veículo VIP - Diretor Nexus';
      }
      
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
        status: statusLog,
        detalhe: detalheLog
      };

      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      setProcessedCount(prev => prev + 1);

      // Adicionar log de auditoria no Dante's Safe
      const newAudit: AuditEntry = {
        id: `AUD-${Math.floor(Math.random() * 900) + 100}`,
        operador: 'system_egide_lpr',
        acao: `Leitura automática OCR/LPR placa ${placa} (${detalheLog})`,
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
    
    // Adicionar log crítico de LPR
    const horario = new Date().toTimeString().split(' ')[0];
    const targetPlaca = 'MTO1B92';
    const alertLog: LprLog = {
      id: Date.now(),
      placa: targetPlaca,
      camera: '05 - Portal de Entrada',
      municipio: 'Mato Leitão, RS',
      horario,
      status: 'ALERTA',
      detalhe: 'ALERTA DE FURTO ATIVO'
    };

    setLogs(prev => [alertLog, ...prev]);
    setProcessedCount(prev => prev + 1);

    // Auditoria LGPD imediata do incidente
    const auditIncident: AuditEntry = {
      id: `AUD-911`,
      operador: 'sistema_cerco_inteligente',
      acao: `DISPARO DE ALERTA OCR: Veículo Roubado ${targetPlaca}`,
      hash: 'SHA256:c3a11f2...599b',
      timestamp: horario
    };
    setAudits(prev => [auditIncident, ...prev]);

    setAtenaRecommendation(
      "Alerta de alta prioridade gerado no Portal de Entrada. Placa MTO1B92 possui registro ativo de furto. Recomendo o despacho imediato da Viatura 02 (Grupo Tático) que se encontra em QAP nas proximidades da RS-422."
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

    // Abre os detalhes da intrusão imediatamente para testes
    setSelectedIntruder(newIntrusion);
  };

  // Simular o despacho
  const handleDispatch = () => {
    setAlertStage('despachado');
    
    // Mudar status da viatura
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

    // Auditoria do despacho do Dante
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
      
      // Auditoria
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

    // Log de auditoria
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

    // Log de auditoria
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

    // Log de auditoria
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
    <div className="w-full min-h-screen bg-[#060709] text-slate-200 relative overflow-hidden pb-16">
      {/* Luzes táticas de alerta no background se o alerta estiver ativo */}
      {isAlertActive && (
        <div className="absolute inset-0 bg-red-950/15 pointer-events-none z-0 transition-colors duration-500 animate-pulse border-4 border-red-500/30" />
      )}

      {/* AMBIENTE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-950/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/5 rounded-full blur-[150px]" />
        
        {/* Marca d'água premium do logotipo Nexus Édge em tamanho total da tela */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.055] mix-blend-overlay">
          <Image 
            src="/Nexus Intelligence Édge/Nexus Intelligence Édgi.png" 
            alt="Nexus Édge Logo Watermark" 
            fill
            className="object-contain p-4 sm:p-12 filter grayscale invert"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon" className="text-slate-400 hover:text-white -ml-2">
                <Link href="/intelligence">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 font-bold bg-blue-500/5">
                MÓDULO SEGURANÇA
              </Badge>
            </div>
            <div className="pt-4 w-full">
              <WhiteLabelHeader
                defaultTitle="Nexus Intelligence Égide"
                defaultSlogan="Painel de Controle de Segurança e Cerco Eletrônico Inteligente"
                defaultLogo="/logo-nexus-shield.png"
                storageKeyPrefix="egide"
                themeColor="blue"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleResetSimulator}
              className="border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Resetar Simulador
            </Button>
            <Button 
              onClick={handleTriggerAlert} 
              disabled={isAlertActive}
              className="bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-900/20"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Simular Veículo Roubado
            </Button>
            <Button 
              onClick={handleTriggerAegisIntrusion} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-900/20"
            >
              <Fingerprint className="w-4 h-4 mr-2" />
              Simular Bloqueio Aegis
            </Button>
          </div>
        </div>

        {/* METRICS */}
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

        {/* ALERTA CRÍTICO DETECTADO (EVENTBRIDGE & WEBSOCKET VISUAL) */}
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
                    Placa **MTO-1992** detectada na Câmera **05 - Portal de Entrada**. Cruzamento instantâneo com BD de furto em milissegundos.
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

        {/* CORPO PRINCIPAL: 2 COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUNA ESQUERDA: CAMERAS & LPR LIVE STREAM (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* LPR LIVE STREAM PANEL */}
            <Card className="bg-slate-900/70 border-slate-800/80 backdrop-blur-md flex flex-col h-[520px]">
              <CardContent className="p-6 flex flex-col h-full space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-blue-500 animate-pulse" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight font-headline">Cerco Eletrônico OCR/LPR</h3>
                  </div>
                  <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* DANTE'S IMUTABLE AUDIT SAFE (LGPD PROOF) */}
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

          {/* COLUNA DIREITA: ATENA PANEL & VIATURAS (1/3) */}
          <div className="space-y-6">
            
            {/* ATENA ASSISTANT */}
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

            {/* VIATURAS LOGÍSTICA */}
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

                      {/* Acionamentos Rápidos */}
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

      {/* Dialog do Mosaico de Câmeras */}
      <Dialog open={isCameraModalOpen} onOpenChange={setIsCameraModalOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-5xl h-[85vh] flex flex-col p-6 overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-white text-xl font-headline flex items-center gap-2 uppercase tracking-wide">
              <Eye className="w-5 h-5 text-blue-500 animate-pulse" />
              Mosaico de Vídeo em Tempo Real - Cerco Eletrônico Égide
            </DialogTitle>
            <p className="text-slate-400 text-xs mt-1">
              Integração ativa de 512 feeds municipais via AWS Kinesis Video Streams e Rekognition. Clique na câmera para alternar Visão Noturna (Infravermelho).
            </p>
          </DialogHeader>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 py-4 overflow-y-auto pr-1">
            
            {/* Câmera 01 */}
            <div 
              onClick={() => setNightVision(prev => ({ ...prev, cam1: !prev.cam1 }))}
              className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              {/* Scanline Animation */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
              {/* Static Grid Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10" />
              
              {/* Video Stream Simulation */}
              <div className={`w-full h-full flex flex-col justify-between p-4 relative z-0 transition-all duration-500 ${
                nightVision.cam1 
                  ? 'bg-emerald-950/20 grayscale brightness-125 contrast-125 saturate-200 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-slate-950 text-slate-300'
              }`}>
                {/* HUD Top */}
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`font-mono text-[9px] uppercase border-none px-2 py-0.5 ${nightVision.cam1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    CAM_01 // ENTRADA NORTE
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${nightVision.cam1 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                    <span className="text-[9px] font-mono tracking-wider font-bold">LIVE // KINESIS_FEED</span>
                  </div>
                </div>

                {/* HUD Vector Graphic / Bounding Box Simulation */}
                <div className="flex-1 flex items-center justify-center relative">
                  <div className={`absolute border border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${nightVision.cam1 ? 'border-emerald-500/30 text-emerald-400/60' : 'border-blue-500/30 text-blue-500/60'}`}>
                    <Shield className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">LPR SCANNING</span>
                  </div>
                  {/* Floating vehicle bounds */}
                  <div className={`absolute top-6 left-12 w-24 h-16 border rounded flex items-center justify-center ${nightVision.cam1 ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-blue-400/50 bg-blue-400/5'}`}>
                    <span className="text-[8px] font-mono absolute -top-4 left-0 uppercase">VEHICLE_BOUNDS // CONF: 98%</span>
                    <span className="text-[9px] font-mono font-black">{logs[0]?.placa || 'IRO8C85'}</span>
                  </div>
                </div>

                {/* HUD Bottom */}
                <div className="flex justify-between items-end text-[9px] font-mono text-slate-500">
                  <div className="flex flex-col">
                    <span>COORDS: -29.5312, -52.1904</span>
                    <span>LOC: Vale Verde - RS</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>1080P // 30 FPS // 4.2 MBPS</span>
                    <span className={nightVision.cam1 ? 'text-emerald-400' : 'text-slate-400'}>
                      {nightVision.cam1 ? 'VISÃO INFRAVERMELHO ATIVA' : 'MÓDULO DIURNO'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Câmera 02 */}
            <div 
              onClick={() => setNightVision(prev => ({ ...prev, cam2: !prev.cam2 }))}
              className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10" />
              
              <div className={`w-full h-full flex flex-col justify-between p-4 relative z-0 transition-all duration-500 ${
                nightVision.cam2 
                  ? 'bg-emerald-950/20 grayscale brightness-125 contrast-125 saturate-200 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-slate-950 text-slate-300'
              }`}>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`font-mono text-[9px] uppercase border-none px-2 py-0.5 ${nightVision.cam2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    CAM_02 // RODOVIA RS-422
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${nightVision.cam2 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                    <span className="text-[9px] font-mono tracking-wider font-bold">LIVE // KINESIS_FEED</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  <div className={`absolute border border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${nightVision.cam2 ? 'border-emerald-500/30 text-emerald-400/60' : 'border-blue-500/30 text-blue-500/60'}`}>
                    <Shield className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">LPR SCANNING</span>
                  </div>
                  {/* Floating vehicle bounds */}
                  <div className={`absolute top-4 right-10 w-24 h-16 border rounded flex items-center justify-center ${nightVision.cam2 ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-blue-400/50 bg-blue-400/5'}`}>
                    <span className="text-[8px] font-mono absolute -top-4 left-0 uppercase">VEHICLE_BOUNDS // CONF: 95%</span>
                    <span className="text-[9px] font-mono font-black">{logs[2]?.placa || 'SCS8B90'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end text-[9px] font-mono text-slate-500">
                  <div className="flex flex-col">
                    <span>COORDS: -29.6201, -52.2144</span>
                    <span>LOC: Santa Cruz - RS</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>1080P // 30 FPS // 3.8 MBPS</span>
                    <span className={nightVision.cam2 ? 'text-emerald-400' : 'text-slate-400'}>
                      {nightVision.cam2 ? 'VISÃO INFRAVERMELHO ATIVA' : 'MÓDULO DIURNO'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Câmera 03 */}
            <div 
              onClick={() => setNightVision(prev => ({ ...prev, cam3: !prev.cam3 }))}
              className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10" />
              
              <div className={`w-full h-full flex flex-col justify-between p-4 relative z-0 transition-all duration-500 ${
                nightVision.cam3 
                  ? 'bg-emerald-950/20 grayscale brightness-125 contrast-125 saturate-200 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-slate-950 text-slate-300'
              }`}>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`font-mono text-[9px] uppercase border-none px-2 py-0.5 ${nightVision.cam3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    CAM_03 // CENTRO HISTÓRICO
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${nightVision.cam3 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                    <span className="text-[9px] font-mono tracking-wider font-bold">LIVE // KINESIS_FEED</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  <div className={`absolute border border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${nightVision.cam3 ? 'border-emerald-500/30 text-emerald-400/60' : 'border-blue-500/30 text-blue-500/60'}`}>
                    <Shield className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">LPR SCANNING</span>
                  </div>
                  {/* Floating vehicle bounds */}
                  <div className={`absolute bottom-4 left-16 w-24 h-16 border rounded flex items-center justify-center ${nightVision.cam3 ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-blue-400/50 bg-blue-400/5'}`}>
                    <span className="text-[8px] font-mono absolute -top-4 left-0 uppercase">VEHICLE_BOUNDS // CONF: 97%</span>
                    <span className="text-[9px] font-mono font-black">{logs[1]?.placa || 'MTO2K31'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end text-[9px] font-mono text-slate-500">
                  <div className="flex flex-col">
                    <span>COORDS: -29.4129, -52.1798</span>
                    <span>LOC: Mato Leitão - RS</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>1080P // 30 FPS // 4.5 MBPS</span>
                    <span className={nightVision.cam3 ? 'text-emerald-400' : 'text-slate-400'}>
                      {nightVision.cam3 ? 'VISÃO INFRAVERMELHO ATIVA' : 'MÓDULO DIURNO'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Câmera 04 */}
            <div 
              onClick={() => setNightVision(prev => ({ ...prev, cam4: !prev.cam4 }))}
              className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] z-10" />
              
              <div className={`w-full h-full flex flex-col justify-between p-4 relative z-0 transition-all duration-500 ${
                nightVision.cam4 
                  ? 'bg-emerald-950/20 grayscale brightness-125 contrast-125 saturate-200 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-slate-950 text-slate-300'
              }`}>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`font-mono text-[9px] uppercase border-none px-2 py-0.5 ${nightVision.cam4 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    CAM_04 // ACESSO SUL
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${nightVision.cam4 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                    <span className="text-[9px] font-mono tracking-wider font-bold">LIVE // KINESIS_FEED</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  <div className={`absolute border border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${nightVision.cam4 ? 'border-emerald-500/30 text-emerald-400/60' : 'border-blue-500/30 text-blue-500/60'}`}>
                    <Shield className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">LPR SCANNING</span>
                  </div>
                  {/* Floating vehicle bounds */}
                  <div className={`absolute bottom-6 right-16 w-24 h-16 border rounded flex items-center justify-center ${nightVision.cam4 ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-blue-400/50 bg-blue-400/5'}`}>
                    <span className="text-[8px] font-mono absolute -top-4 left-0 uppercase">VEHICLE_BOUNDS // CONF: 96%</span>
                    <span className="text-[9px] font-mono font-black">{logs[3]?.placa || 'PSB1C42'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end text-[9px] font-mono text-slate-500">
                  <div className="flex flex-col">
                    <span>COORDS: -29.7005, -52.2412</span>
                    <span>LOC: Passo do Sobrado - RS</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>1080P // 30 FPS // 4.0 MBPS</span>
                    <span className={nightVision.cam4 ? 'text-emerald-400' : 'text-slate-400'}>
                      {nightVision.cam4 ? 'VISÃO INFRAVERMELHO ATIVA' : 'MÓDULO DIURNO'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="shrink-0 flex justify-end gap-2 border-t border-slate-800/80 pt-4">
            <Button 
              onClick={() => setIsCameraModalOpen(false)}
              className="bg-slate-900 border border-slate-800 text-white font-bold hover:bg-slate-800"
            >
              Fechar Mosaico
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog da Telemetria da Viatura */}
      <Dialog open={selectedViatura !== null} onOpenChange={(open) => !open && setSelectedViatura(null)}>
        {selectedViatura && (
          <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-4xl p-6 overflow-hidden">
            <DialogHeader className="shrink-0 pb-4 border-b border-slate-900">
              <DialogTitle className="text-white text-xl font-headline flex items-center justify-between uppercase tracking-wide w-full">
                <span className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400 animate-pulse" />
                  Telemetria & Proteção da Tropa // {selectedViatura.codigo}
                </span>
                <Badge variant="outline" className={`font-mono text-[9px] px-2.5 py-0.5 border ${
                  selectedViatura.status === 'Despachada'
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : selectedViatura.status === 'Patrulha'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  STATUS: {selectedViatura.status.toUpperCase()}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              
              {/* CANAL DE VÍDEO / BODYCAM DA VIATURA */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Câmera Corporal Individual (Bodycam Kinesis Live)</p>
                <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative">
                  {/* Scanline Animation */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-[15%] w-full animate-scanline z-20" />
                  
                  {/* Video Stream Content */}
                  <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-900/10 text-slate-300">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="font-mono text-[8px] bg-slate-900/80 border-slate-700 text-slate-300">
                        {selectedViatura.status === 'Despachada' ? 'BODYCAM_COMBATE_ACTIVE' : 'BODYCAM_STANDBY'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${selectedViatura.status === 'Despachada' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                        <span className="text-[8px] font-mono font-bold uppercase">BODYCAM_REC_LIVE</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                      <Radio className={`w-8 h-8 opacity-40 mb-1 ${selectedViatura.status === 'Despachada' ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Kinesis Live Stream</span>
                      {selectedViatura.status === 'Despachada' ? (
                        <div className="text-center mt-1">
                          <span className="text-sm font-mono font-black text-red-400 block animate-pulse">SGT HR: 118 BPM</span>
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">IA SCAN: NENHUMA AMEAÇA DETECTADA</span>
                        </div>
                      ) : (
                        <div className="text-center mt-1">
                          <span className="text-sm font-mono font-black text-slate-400 block">SGT HR: 82 BPM</span>
                          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest block mt-0.5">MODO DE ESPERA // QAP</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-end text-[8px] font-mono text-slate-500">
                      <span>BAT: 98% // GPS_SIG: 100%</span>
                      <span>LATENCY: 15ms // OFFICERS_SECURE</span>
                    </div>
                  </div>
                </div>

                {/* INTEGRAÇÃO DE CÂMERA DE TRÂNSITO NO TRAJETO */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    Câmeras Urbanas de Trânsito no Percurso
                  </p>
                  {selectedViatura.status === 'Despachada' ? (
                    <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded border border-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">Câmera 02 - Rodovia RS-422</p>
                        <p className="text-[10px] text-slate-500">Acompanhamento visual ativo da viatura em rota geográfica</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Nenhum percurso ativo. Câmeras urbanas em monitoramento de rotina.</p>
                  )}
                </div>
              </div>

              {/* BIOMETRIA DA TROPA E PROTEÇÃO (FORCE PROTECTION) */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Integridade dos Oficiais (Biometria ao Vivo)</p>
                
                <div className="space-y-3">
                  {/* Oficial 1 */}
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase">{selectedViatura.equipe.split(' / ')[0] || 'Oficial 01'}</span>
                      <Badge className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 text-[8px] uppercase tracking-wider">
                        Colete Nível III Ativo
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Batimento Cardíaco</span>
                        <span className={`font-mono font-black text-sm ${
                          selectedViatura.status === 'Despachada' ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                        }`}>
                          {selectedViatura.status === 'Despachada' ? '118 BPM // TÁTICO' : '82 BPM // EM QAP'}
                        </span>
                      </div>
                      
                      <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Pressão Arterial</span>
                        <span className="font-mono font-black text-sm text-slate-300">
                          {selectedViatura.status === 'Despachada' ? '13/9 mmHg' : '12/8 mmHg'}
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900 col-span-2 flex justify-between items-center">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Sensores de Colete Balístico</span>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] uppercase font-bold tracking-widest px-2 py-0.5">
                          INTEGRIDADE 100%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Oficial 2 */}
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase">{selectedViatura.equipe.split(' / ')[1] || 'Oficial 02'}</span>
                      <Badge className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 text-[8px] uppercase tracking-wider">
                        Colete Nível III Ativo
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Batimento Cardíaco</span>
                        <span className={`font-mono font-black text-sm ${
                          selectedViatura.status === 'Despachada' ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                        }`}>
                          {selectedViatura.status === 'Despachada' ? '124 BPM // TÁTICO' : '79 BPM // EM QAP'}
                        </span>
                      </div>
                      
                      <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Pressão Arterial</span>
                        <span className="font-mono font-black text-sm text-slate-300">
                          {selectedViatura.status === 'Despachada' ? '13/9 mmHg' : '12/8 mmHg'}
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900 col-span-2 flex justify-between items-center">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Sensores de Colete Balístico</span>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] uppercase font-bold tracking-widest px-2 py-0.5">
                          INTEGRIDADE 100%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="shrink-0 flex justify-between gap-2 border-t border-slate-900 pt-4 mt-2">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-red-950/20 border-red-900/50 text-red-400 font-bold hover:bg-red-950/40 text-xs py-1"
                >
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  Botão de Emergência (SOS)
                </Button>
              </div>
              <Button 
                onClick={() => setSelectedViatura(null)}
                className="bg-slate-900 border border-slate-800 text-white font-bold hover:bg-slate-800 text-xs py-1"
              >
                Fechar Telemetria
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Dialog da Captura de Intrusão Aegis */}
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
              
              {/* SILHUETA DO INTRUSO CAPTURADA PELA WEBCAM */}
              <div className="bg-slate-900 border border-red-500/20 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-between p-4 bg-gradient-to-br from-red-950/20 to-transparent">
                {/* HUD Camera Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
                
                <div className="flex justify-between items-start relative z-10">
                  <Badge variant="outline" className="font-mono text-[8px] bg-red-950 border-red-500/40 text-red-400 border">
                    FACIAL_MATCH_RATIO: 0.0% [REJEITADO]
                  </Badge>
                  <span className="text-[8px] font-mono text-red-400 font-bold uppercase tracking-wider">WEBCAM_CAPTURE_ACTIVE</span>
                </div>

                <div className="flex-1 flex items-center justify-center relative z-10 py-4">
                  {/* High-tech vector face scanner simulation */}
                  <div className="w-24 h-24 rounded-full border border-dashed border-red-500/30 flex items-center justify-center relative bg-red-900/5">
                    {/* Bounding lines */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-500" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-500" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-red-500" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-red-500" />
                    {/* Face Silhouette */}
                    <svg className="w-16 h-16 text-red-500/40" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between items-end text-[8px] font-mono text-slate-500 relative z-10">
                  <span>DISPOSITIVO: DELL LATITUDE 5430</span>
                  <span>IP: 177.85.12.92 // STA_CRUZ_RS</span>
                </div>
              </div>

              {/* DADOS DETALHADOS DO INCIDENTE */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block">Origem:</span>
                    <strong className="text-slate-300">Prefeitura de Santa Cruz</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Usuário Digitado:</span>
                    <strong className="text-slate-300">admin_santa_cruz</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Senha Utilizada:</span>
                    <strong className="text-emerald-400">CORRETA</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Hora da Tentativa:</span>
                    <strong className="text-slate-300">{selectedIntruder.timestamp}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900">
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    <strong>Ação Automatizada:</strong> O login foi bloqueado devido à inconsistência biométrica facial (reconhecimento Rekognition 0%). Alerta em tempo real contendo dados do invasor e a foto acima foi enviado exclusivamente para a Central de Comando Nexus.
                  </p>
                </div>
              </div>

              {/* SEÇÃO COMANDANTE OVERRIDE */}
              {overrideSuccess ? (
                <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-4 text-center space-y-2.5 animate-fadeIn">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Módulo Desbloqueado com Sucesso!</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Override biométrico efetuado. A conta **admin_santa_cruz** foi reativada. A assinatura facial biométrica do novo operador foi registrada no Amazon S3 e a justificativa foi arquivada imutavelmente no Dante Safe.
                  </p>
                </div>
              ) : (
                <>
                  {!isOverrideOpen ? (
                    <Button 
                      onClick={() => setIsOverrideOpen(true)}
                      className="w-full bg-indigo-950/30 hover:bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs py-2 uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all animate-pulse"
                    >
                      <Fingerprint className="w-4 h-4" />
                      Sobreposição do Comandante de Setor (Desbloqueio)
                    </Button>
                  ) : (
                    <div className="border border-indigo-500/30 bg-slate-950/90 rounded-xl p-4 space-y-3.5 animate-fadeIn">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <Fingerprint className="w-3.5 h-3.5" />
                          Remover Bloqueio Aegis // Commander Override
                        </span>
                        <Button 
                          variant="ghost" 
                          onClick={() => setIsOverrideOpen(false)}
                          className="h-5 px-1.5 text-[9px] text-slate-500 hover:text-slate-300 hover:bg-transparent font-bold uppercase"
                        >
                          Cancelar
                        </Button>
                      </div>

                      {!commanderPhotoMatched && !isScanningCommander && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Setor de Atuação</label>
                            <div className="grid grid-cols-3 gap-2">
                              {(['ti', 'guarda', 'pm'] as const).map((role) => (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() => setCommanderRole(role)}
                                  className={`py-1 px-1.5 rounded border text-[9px] font-bold uppercase transition-all tracking-wider ${
                                    commanderRole === role 
                                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                                      : 'bg-slate-900/50 border-slate-850 text-slate-500 hover:border-slate-700'
                                  }`}
                                >
                                  {role === 'ti' ? 'Dir. TI' : role === 'guarda' ? 'Guarda Mun.' : 'Polícia (PM)'}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Login Master</label>
                              <input 
                                type="text" 
                                placeholder="cmd_silva"
                                value={commanderUser}
                                onChange={(e) => setCommanderUser(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Senha Master</label>
                              <input 
                                type="password" 
                                placeholder="••••••••"
                                value={commanderPass}
                                onChange={(e) => setCommanderPass(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Justificativa da Alteração</label>
                            <textarea 
                              placeholder="Ex: Oficial substituto no plantão noturno de Santa Cruz..."
                              value={overrideJustification}
                              onChange={(e) => setOverrideJustification(e.target.value)}
                              rows={2}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 resize-none font-sans"
                            />
                          </div>

                          <Button
                            onClick={handleStartBiometricScan}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-1.5 uppercase tracking-widest mt-1"
                          >
                            Iniciar Handshake Biométrico
                          </Button>
                        </div>
                      )}

                      {isScanningCommander && (
                        <div className="bg-slate-900/40 border border-indigo-500/20 rounded-xl p-3 flex flex-col items-center justify-center space-y-2 relative overflow-hidden h-[150px]">
                          {/* Laser scanner animation */}
                          <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10B981] animate-laserScan z-20" />
                          
                          <div className="w-12 h-12 rounded-full border border-dashed border-emerald-500/40 flex items-center justify-center relative bg-emerald-950/20 animate-pulse">
                            <Fingerprint className="w-6 h-6 text-emerald-400" />
                          </div>
                          
                          <div className="text-center z-10 space-y-0.5">
                            <span className="text-[9px] font-mono text-emerald-400 block tracking-widest uppercase">AWS Rekognition: Verificando Câmera</span>
                            <span className="text-[11px] font-mono font-black text-white block">Aguardando Biometria: {scanProgress}%</span>
                            <p className="text-[8px] text-slate-500">Mantenha a câmera frontal focada para validação.</p>
                          </div>
                        </div>
                      )}

                      {commanderPhotoMatched && !isScanningCommander && (
                        <div className="space-y-3">
                          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">BIOMETRIA 100% CORRESPONDENTE</p>
                              <p className="text-[8px] text-slate-400 leading-normal">
                                Reconhecimento facial concluído. Credenciais master verificadas com segurança.
                              </p>
                            </div>
                          </div>

                          <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800 text-[9px] space-y-1 text-slate-400">
                            <div><span className="text-slate-500">Comandante Autenticado:</span> <strong className="text-slate-300">{commanderUser} ({commanderRole === 'ti' ? 'Diretor de TI' : commanderRole === 'guarda' ? 'Guarda Municipal' : 'PM'})</strong></div>
                            <div><span className="text-slate-500">Justificativa:</span> <strong className="text-slate-300">"{overrideJustification}"</strong></div>
                          </div>

                          <Button
                            onClick={handleConfirmOverride}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 uppercase tracking-widest"
                          >
                            Confirmar Liberação de Acesso
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

            </div>

            <div className="shrink-0 flex justify-end gap-2 border-t border-slate-900 pt-4 mt-2">
              <Button 
                onClick={handleCloseIntruderModal}
                className="bg-slate-900 border border-slate-800 text-white font-bold hover:bg-slate-800 text-xs py-1"
              >
                Fechar Registro
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Estilos táticos personalizados para os simuladores */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(600%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
        @keyframes laserScan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-laserScan {
          position: absolute;
          animation: laserScan 2s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}
