'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  HeartPulse, Brain, ShieldCheck, Activity, ChevronLeft,
  Upload, Scan, AlertTriangle, CheckCircle, Clock, FileText,
  ZoomIn, BarChart3, Microscope, Eye, TrendingUp, Star,
  ChevronDown, Info, Download, Share2, User, Stethoscope, X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

// ─── MOCK ANALYSIS RESULT ───────────────────────────────────────────────────
const findingsDB: Record<string, any> = {
  rx: {
    title: 'Raio-X Torácico',
    overallSeverity: 8,
    summary: 'Lesão pulmonar suspeita com alta probabilidade de malignidade detectada no lobo superior direito.',
    details: 'A IA identificou 4 achados nesta imagem, sendo 1 crítico e 2 moderados. Recomenda-se encaminhamento urgente para especialista.',
    findings: [
      { id: 1, region: 'Lobo Superior Direito', finding: 'Opacidade irregular com bordas espiculadas', severity: 9, confidence: 94.7, type: 'CRÍTICO', color: 'red', detail: 'Padrão compatível com lesão primária pulmonar. Recomenda-se biópsia imediata e estadiamento.' },
      { id: 2, region: 'Mediastino', finding: 'Leve alargamento mediastinal', severity: 5, confidence: 87.2, type: 'MODERADO', color: 'amber', detail: 'Possível adenopatia reativa ou comprometimento linfonodal secundário. Correlacionar com TC.' },
      { id: 3, region: 'Seios costofrênicos', finding: 'Pequeno derrame pleural bilateral', severity: 4, confidence: 91.3, type: 'MODERADO', color: 'amber', detail: 'Volume estimado < 200ml. Monitorar evolução. Pode indicar processo inflamatório sistêmico.' },
      { id: 4, region: 'Campos pulmonares', finding: 'Trama broncovascular preservada', severity: 1, confidence: 99.1, type: 'NORMAL', color: 'emerald', detail: 'Sem alterações na trama vascular dos campos pulmonares restantes.' },
    ]
  },
  rm: {
    title: 'Ressonância Magnética Craniana',
    overallSeverity: 7,
    summary: 'Múltiplas lesões desmielinizantes periventriculares detectadas.',
    details: 'A IA identificou 3 focos hiperintensos em T2/FLAIR sugestivos de processo desmielinizante ativo. Correlação clínica é fortemente recomendada.',
    findings: [
      { id: 1, region: 'Substância Branca Periventricular', finding: 'Lesões hiperintensas ovoideias (Dedos de Dawson)', severity: 8, confidence: 96.2, type: 'CRÍTICO', color: 'red', detail: 'Múltiplos focos sugestivos de doença desmielinizante inflamatória aguda.' },
      { id: 2, region: 'Corpo Caloso', finding: 'Foco puntiforme de hiperintensidade', severity: 6, confidence: 88.5, type: 'MODERADO', color: 'amber', detail: 'Lesão calosoca subcentimétrica, típica do espectro desmielinizante.' },
      { id: 3, region: 'Fossa Posterior', finding: 'Estruturas preservadas', severity: 1, confidence: 99.8, type: 'NORMAL', color: 'emerald', detail: 'Tronco encefálico e cerebelo sem anomalias de sinal.' }
    ]
  },
  tc: {
    title: 'Tomografia Abdominal com Contraste',
    overallSeverity: 6,
    summary: 'Presença de litíase renal bilateral com dilatação pielocalicial leve à direita.',
    details: 'A IA identificou múltiplos cálculos renais não-obstrutivos à esquerda e um cálculo semi-obstrutivo no terço proximal do ureter direito.',
    findings: [
      { id: 1, region: 'Ureter Direito Proximal', finding: 'Cálculo hiperdenso (6mm) com ureterohidronefrose leve', severity: 7, confidence: 98.1, type: 'CRÍTICO', color: 'red', detail: 'Obstrução parcial da via excretora direita. Risco de cólica nefrética aguda.' },
      { id: 2, region: 'Cálices Renais Esquerdos', finding: 'Microlitíase não-obstrutiva esparsa', severity: 3, confidence: 92.4, type: 'LEVE', color: 'emerald', detail: 'Cálculos < 3mm. Monitoramento clínico e hidratação.' },
      { id: 3, region: 'Fígado e Pâncreas', finding: 'Atenuação homogênea, sem lesões focais', severity: 1, confidence: 99.5, type: 'NORMAL', color: 'emerald', detail: 'Órgãos parenquimatosos sólidos sem alterações tomográficas.' }
    ]
  },
  us: {
    title: 'Ultrassonografia Pélvica',
    overallSeverity: 4,
    summary: 'Útero miomatoso com nódulos intramurais e subserosos.',
    details: 'A IA identificou 2 nódulos miomatosos de pequenas dimensões sem sinais de degeneração ou compressão endometrial significativa.',
    findings: [
      { id: 1, region: 'Miométrio Anterior', finding: 'Nódulo hipoecoico intramural (2.5cm)', severity: 4, confidence: 95.3, type: 'MODERADO', color: 'amber', detail: 'Leiomioma típico. Não abaúla a cavidade endometrial.' },
      { id: 2, region: 'Endométrio', finding: 'Espessura normal e regular (6mm)', severity: 1, confidence: 98.7, type: 'NORMAL', color: 'emerald', detail: 'Aspecto trilaminar preservado, compatível com fase proliferativa.' },
      { id: 3, region: 'Anexos Bilaterais', finding: 'Ovários com pequenos folículos antrais', severity: 1, confidence: 97.2, type: 'NORMAL', color: 'emerald', detail: 'Sem cistos complexos ou massas anexiais suspeitas.' }
    ]
  },
  mamo: {
    title: 'Mamografia Digital Bilateral',
    overallSeverity: 9,
    summary: 'Grupamento de microcalcificações pleomórficas suspeitas na mama esquerda (BI-RADS 4C).',
    details: 'A IA detectou calcificações lineares ramificadas de alta suspeição no quadrante supero-externo da mama esquerda. Investigação histopatológica compulsória.',
    findings: [
      { id: 1, region: 'QSE Mama Esquerda', finding: 'Microcalcificações pleomórficas finas agrupadas', severity: 10, confidence: 97.8, type: 'CRÍTICO', color: 'red', detail: 'Padrão suspeito para Carcinoma Ductal In Situ (CDIS). Biópsia estereotáxica indicada com urgência.' },
      { id: 2, region: 'Mama Direita', finding: 'Tecido fibroglandular denso e heterogêneo', severity: 3, confidence: 91.0, type: 'LEVE', color: 'emerald', detail: 'Padrão ACR C. Pode reduzir a sensibilidade da mamografia. US complementar sugerido.' },
      { id: 3, region: 'Linfonodos Axilares', finding: 'Linfonodos com centro radiolucente bilateral', severity: 1, confidence: 99.4, type: 'NORMAL', color: 'emerald', detail: 'Linfonodos de aspecto habitual, sem sinais de infiltração axilar.' }
    ]
  },
  eco: {
    title: 'Ecocardiograma Transtorácico',
    overallSeverity: 5,
    summary: 'Hipertrofia excêntrica leve do ventrículo esquerdo com função sistólica preservada.',
    details: 'A IA estimou a Fração de Ejeção em 62% e detectou espessamento leve do septo interventricular, compatível com remodelamento secundário a HAS.',
    findings: [
      { id: 1, region: 'Ventrículo Esquerdo', finding: 'Hipertrofia concêntrica leve (SIV 12mm)', severity: 5, confidence: 93.6, type: 'MODERADO', color: 'amber', detail: 'Padrão sugestivo de cardiopatia hipertensiva inicial.' },
      { id: 2, region: 'Válvula Mitral', finding: 'Refluxo valvar mitral mínimo (fisiológico)', severity: 2, confidence: 96.1, type: 'LEVE', color: 'emerald', detail: 'Sem repercussão hemodinâmica. Jato regurgitante pequeno e central.' },
      { id: 3, region: 'Pericárdio', finding: 'Folhetos pericárdicos finos', severity: 1, confidence: 99.9, type: 'NORMAL', color: 'emerald', detail: 'Ausência de derrame pericárdico ou espessamento restritivo.' }
    ]
  }
};

const severityColor = (s: number) => {
  if (s >= 8) return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-600', bar: '[&>div]:bg-red-500' };
  if (s >= 5) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-600', bar: '[&>div]:bg-amber-500' };
  return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-600', bar: '[&>div]:bg-emerald-500' };
};

const imageTypes = [
  { id: 'rx', label: 'Raio-X', icon: '🩻', desc: 'Tórax, Ossos, Coluna' },
  { id: 'rm', label: 'Ressonância', icon: '🧲', desc: 'Cérebro, Articulações' },
  { id: 'tc', label: 'Tomografia', icon: '🔬', desc: 'Corpo inteiro, Contraste' },
  { id: 'us', label: 'Ultrassom', icon: '📡', desc: 'Abdômen, Tireoide' },
  { id: 'mamo', label: 'Mamografia', icon: '🫁', desc: 'Triagem oncológica' },
  { id: 'eco', label: 'Ecocardiograma', icon: '❤️', desc: 'Função cardíaca' },
];

type Phase = 'gateway' | 'identify' | 'upload' | 'analyzing' | 'result';

export default function HealthPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('gateway');
  const [selectedType, setSelectedType] = useState('rx');
  const [progress, setProgress] = useState(0);
  const [expandedFinding, setExpandedFinding] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [patient, setPatient] = useState({ nome: '', cpf: '', nascimento: '' });
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startAnalysis = () => {
    setPhase('analyzing');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setPhase('result'), 600);
      }
      setProgress(Math.min(p, 100));
    }, 180);
  };

  const analysisSteps = [
    { label: 'Pré-processamento da imagem', done: progress > 15 },
    { label: 'Segmentação por regiões anatômicas', done: progress > 35 },
    { label: 'Detecção de anomalias por CNN', done: progress > 60 },
    { label: 'Escalonamento de gravidade', done: progress > 78 },
    { label: 'Geração do laudo preliminar', done: progress > 92 },
  ];

  const activeFindings = findingsDB[selectedType] || findingsDB['rx'];
  const overallSeverity = activeFindings.overallSeverity;
  const mockFindings = activeFindings.findings;

  const exportPDF = async () => {
    const text = `Laudo Médico - ${activeFindings.title}\nGravidade: ${overallSeverity}/10\n\nResumo:\n${activeFindings.summary}\n\nDetalhes:\n${activeFindings.details}`;
    const blob = new Blob([text], { type: 'text/plain' });
    try {
      if ('showSaveFilePicker' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `laudo-${selectedType}.txt`,
          types: [{ description: 'Laudo Médico (Texto)', accept: { 'text/plain': ['.txt'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `laudo-${selectedType}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download cancelado ou falhou', err);
    }
  };

  return (
    <SovereignShowcase moduleName="Nexus Health" imagePath="/Nexus Intelligence Health(saúde)/Nexus Intelligence Healt com slogan.png">
      <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">

      {/* AMBIENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-teal-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-cyan-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-white gap-2 text-xs">
                <ChevronLeft className="h-3 w-3" /> Voltar
              </Button>
            <Separator orientation="vertical" className="h-4 bg-white/10" />
            <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30 font-black text-[9px] uppercase tracking-[0.3em] px-3">
              NEXUS HEALTH · MEDICAL VISION AI
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            IA DIAGNÓSTICA ONLINE
          </div>
        </motion.div>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[48px] overflow-hidden border border-teal-500/20 bg-gradient-to-br from-teal-950/40 via-slate-900/60 to-slate-950"
        >
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-40 h-40 flex-shrink-0">
              <Image src="https://i.postimg.cc/k4gpn7b3/Nexus-Intelligence-Healt-com-slogan.png" alt="Nexus Health" fill className="object-contain drop-shadow-[0_0_40px_rgba(20,184,166,0.4)]" />
            </div>
            <div className="flex-1 space-y-3">
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                NEXUS <span className="text-teal-400">HEALTH</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
                Tecnologia que enxerga o que o olho humano ainda não alcança.<br />
                <span className="text-teal-400 font-bold italic">Porque detectar cedo é a maior forma de afeto.</span>
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { icon: Eye, text: '94.7% Acurácia Diagnóstica' },
                  { icon: Clock, text: '< 90s por Análise' },
                  { icon: ShieldCheck, text: 'ANVISA & HIPAA Compliant' },
                  { icon: Star, text: 'Validado por Radiologistas' },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-2 text-[11px] text-slate-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
                    <item.icon className="h-3 w-3 text-teal-400" /> {item.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── PHASE: UPLOAD ─────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ─── PHASE: GATEWAY ─────────────────────────────── */}
          {phase === 'gateway' && (
            <motion.div key="gateway" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white uppercase italic">Como deseja <span className="text-teal-400">prosseguir?</span></h2>
                <p className="text-slate-400 text-sm">Cada análise fica vinculada a um paciente para rastreabilidade clínica.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* Quick Analysis */}
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setPhase('identify')}
                  className="p-8 rounded-[40px] border-2 border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/10 text-left space-y-4 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center">
                    <Scan className="h-7 w-7 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-teal-400 font-black text-[10px] uppercase tracking-widest mb-1">Mais Rápido</p>
                    <h3 className="text-lg font-black text-white uppercase">Análise Rápida</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">Identifique-se com nome e CPF e envie sua imagem imediatamente.</p>
                  </div>
                  <Badge className="bg-teal-600 text-white font-black text-[9px] uppercase">Recomendado</Badge>
                </motion.button>

                {/* Already has profile */}
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setPhase('upload')}
                  className="p-8 rounded-[40px] border border-white/10 bg-white/3 hover:border-white/20 text-left space-y-4 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <User className="h-7 w-7 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">Já cadastrado</p>
                    <h3 className="text-lg font-black text-white uppercase">Já tenho Perfil</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">Acesse com seu CPF e envie imagens vinculadas ao seu histórico.</p>
                  </div>
                </motion.button>

                {/* Full profile */}
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => window.location.href = '/intelligence/health/cadastro'}
                  className="p-8 rounded-[40px] border border-white/10 bg-white/3 hover:border-white/20 text-left space-y-4 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">Histórico Completo</p>
                    <h3 className="text-lg font-black text-white uppercase">Criar Perfil Clínico</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">Cadastro completo com histórico, alergias, medicamentos e laudos anteriores.</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─── PHASE: IDENTIFY ────────────────────────────── */}
          {phase === 'identify' && (
            <motion.div key="identify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white uppercase italic">Identificação do <span className="text-teal-400">Paciente</span></h2>
                <p className="text-slate-400 text-sm">Dados mínimos para vincular o laudo. Nenhuma informação é compartilhada.</p>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-[40px] p-8 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo <span className="text-teal-400">*</span></label>
                  <input value={patient.nome} onChange={e => setPatient(p => ({...p, nome: e.target.value}))}
                    placeholder="Maria da Silva" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CPF <span className="text-teal-400">*</span></label>
                  <input value={patient.cpf} onChange={e => setPatient(p => ({...p, cpf: e.target.value}))}
                    placeholder="000.000.000-00" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data de Nascimento <span className="text-teal-400">*</span></label>
                  <input type="date" value={patient.nascimento} onChange={e => setPatient(p => ({...p, nascimento: e.target.value}))}
                    className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Exame <span className="text-teal-400">*</span></label>
                  <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all">
                    {imageTypes.map(t => <option key={t.id} value={t.id} className="bg-slate-900">{t.icon} {t.label} — {t.desc}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setPhase('gateway')} variant="outline" className="border-white/10 text-slate-400 hover:text-white font-black uppercase gap-2">
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </Button>
                <Button onClick={() => setPhase('upload')}
                  disabled={!patient.nome || !patient.cpf || !patient.nascimento}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest h-12 rounded-2xl gap-2 disabled:opacity-40">
                  Continuar para Upload <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">

              {/* Select type */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tight">
                  1. Selecione o <span className="text-teal-400">Tipo de Imagem</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {imageTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={cn(
                        'p-4 rounded-2xl border text-center transition-all space-y-1',
                        selectedType === t.id
                          ? 'border-teal-500/50 bg-teal-500/10 text-white'
                          : 'border-white/8 bg-white/3 text-slate-400 hover:border-white/20'
                      )}
                    >
                      <div className="text-2xl">{t.icon}</div>
                      <p className="text-xs font-black uppercase tracking-widest">{t.label}</p>
                      <p className="text-[9px] text-slate-500">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop Zone */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tight">
                  2. Envie a <span className="text-teal-400">Imagem Médica</span>
                </h2>
                <motion.div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e: React.DragEvent) => { e.preventDefault(); setDragOver(false); startAnalysis(); }}
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    'relative overflow-hidden rounded-[40px] p-16 text-center cursor-pointer transition-all duration-300 backdrop-blur-xl',
                    dragOver
                      ? 'border-2 border-teal-400 bg-teal-500/20 shadow-[0_0_40px_rgba(20,184,166,0.3)]'
                      : 'border border-white/10 hover:border-teal-500/40 hover:bg-teal-500/10 bg-white/5 shadow-2xl'
                  )}
                >
                  <div className="absolute -inset-24 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10 opacity-50 blur-3xl pointer-events-none" />
                  <input ref={fileRef} type="file" className="hidden" accept="image/*,.dcm" onChange={startAnalysis} />
                  <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                      <Upload className={cn('h-8 w-8 transition-colors', dragOver ? 'text-teal-400' : 'text-slate-500')} />
                    </div>
                    <div>
                      <p className="text-white font-black uppercase tracking-widest text-lg">
                        Arraste a imagem aqui
                      </p>
                      <p className="text-slate-500 text-sm mt-1">ou clique para selecionar</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {['DICOM (.dcm)', 'JPEG', 'PNG', 'TIFF', 'BMP'].map((f) => (
                        <span key={f} className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-400 font-mono">{f}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Demo button */}
              <div className="text-center">
                <Button onClick={startAnalysis} className="bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest px-12 h-14 rounded-2xl gap-3 text-base">
                  <Scan className="h-5 w-5" /> Demonstrar Análise por IA
                </Button>
                <p className="text-[10px] text-slate-600 mt-3">Demo com imagem de raio-X torácico sintético — sem dados reais de paciente</p>
              </div>
            </motion.div>
          )}

          {/* ─── PHASE: ANALYZING ───────────────────────────── */}
          {phase === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
                <div className="relative mx-auto w-48 h-48 rounded-[32px] overflow-hidden border border-teal-500/30 bg-teal-950/20 shadow-[0_0_40px_rgba(20,184,166,0.15)] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-[size:12px_12px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-teal-400 shadow-[0_0_30px_6px_rgba(45,212,191,0.5)] z-10"
                  />
                  <Microscope className="w-16 h-16 text-teal-400/80 z-0 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic">Analisando Imagem...</h2>
                  <p className="text-slate-400 mt-2">NEXUS AI · Varredura de Alta Densidade em Execução</p>
                </div>
                <div className="space-y-2">
                  <Progress value={progress} className="h-2 bg-white/10 [&>div]:bg-teal-500 [&>div]:transition-all [&>div]:duration-200" />
                  <p className="text-teal-400 font-black text-sm">{Math.round(progress)}%</p>
                </div>
                <div className="space-y-3 text-left bg-black/20 border border-white/5 rounded-2xl p-6">
                  {analysisSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {step.done
                        ? <CheckCircle className="h-4 w-4 text-teal-400 flex-shrink-0" />
                        : <div className="h-4 w-4 rounded-full border border-white/20 flex-shrink-0 animate-pulse" />
                      }
                      <span className={cn('text-sm', step.done ? 'text-white font-bold' : 'text-slate-500')}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── PHASE: RESULT ──────────────────────────────── */}
          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

              {/* Result Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Análise Concluída · 00:01:23 · {activeFindings.title}</p>
                  <h2 className="text-3xl font-black text-white uppercase italic">
                    Laudo <span className="text-teal-400">Preliminar IA</span>
                  </h2>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowDetailedReport(true)} className="border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 hover:text-white gap-2 font-black uppercase text-xs transition-colors">
                    <Stethoscope className="h-4 w-4" /> Laudo Detalhado
                  </Button>
                  <Button variant="outline" onClick={exportPDF} className="border-white/10 text-slate-400 hover:text-white gap-2 font-black uppercase text-xs">
                    <Download className="h-4 w-4" /> Exportar PDF
                  </Button>
                  <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white gap-2 font-black uppercase text-xs">
                    <Share2 className="h-4 w-4" /> Compartilhar
                  </Button>
                  <Button onClick={() => { setPhase('gateway'); setProgress(0); }} className="bg-teal-600 hover:bg-teal-500 text-white font-black uppercase text-xs gap-2">
                    <Upload className="h-4 w-4" /> Nova Análise
                  </Button>
                </div>
              </div>

              {/* Overall Severity Banner */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative overflow-hidden rounded-[40px] border-2 border-red-500/40 bg-red-500/5 p-8"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[60px]" />
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Índice de Gravidade Global</p>
                    <div className="text-8xl font-black text-red-400 italic leading-none">{overallSeverity}</div>
                    <div className="text-xs text-slate-500 mt-1">/ 10</div>
                  </div>
                  <Separator orientation="vertical" className="h-24 bg-white/10 hidden md:block" />
                  <div className="flex-1 space-y-3">
                    <Badge className="bg-red-600 text-white font-black text-xs px-4 py-1 uppercase tracking-widest">⚠ ACHADOS CRÍTICOS DETECTADOS</Badge>
                    <p className="text-white font-bold text-lg leading-snug">
                      {activeFindings.summary}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {activeFindings.details}
                    </p>
                  </div>
                  <div className="flex-shrink-0 hidden md:flex flex-col items-center gap-2">
                    <AlertTriangle className="h-16 w-16 text-red-400 animate-pulse" />
                    <span className="text-[9px] text-red-400 font-black uppercase tracking-widest">Ação Requerida</span>
                  </div>
                </div>
              </motion.div>

              {/* Findings Grid */}
              <div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-4">
                  Achados Detalhados <span className="text-teal-400">({mockFindings.length})</span>
                </h3>
                <div className="space-y-3">
                  {mockFindings.map((f: any) => {
                    const c = severityColor(f.severity);
                    const isExpanded = expandedFinding === f.id;
                    return (
                      <motion.div
                        key={f.id}
                        layout
                        className={cn('rounded-[32px] border overflow-hidden transition-all cursor-pointer', c.bg, c.border)}
                        onClick={() => setExpandedFinding(isExpanded ? null : f.id)}
                      >
                        <div className="p-5 flex items-center gap-5">
                          <div className={cn('text-center min-w-[56px]')}>
                            <div className={cn('text-3xl font-black italic', c.text)}>{f.severity}</div>
                            <div className="text-[9px] text-slate-500 uppercase">/10</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Badge className={cn(c.badge, 'text-white border-none text-[9px] font-black px-2 uppercase')}>{f.type}</Badge>
                              <span className="text-[10px] text-slate-500">{f.region}</span>
                            </div>
                            <p className="text-white font-bold text-sm line-clamp-2 md:truncate">{f.finding}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Progress value={f.confidence} className={cn('h-1 flex-1 bg-white/10', c.bar)} />
                              <span className={cn('text-[10px] font-black flex-shrink-0', c.text)}>{f.confidence}% conf.</span>
                            </div>
                          </div>
                          <ChevronDown className={cn('h-4 w-4 text-slate-500 transition-transform flex-shrink-0', isExpanded && 'rotate-180')} />
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 pb-5"
                            >
                              <div className={cn('border-t pt-4 flex items-start gap-3', c.border)}>
                                <Info className={cn('h-4 w-4 flex-shrink-0 mt-0.5', c.text)} />
                                <p className="text-slate-300 text-sm leading-relaxed">{f.detail}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer box */}
              <div className="flex items-start gap-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                <ShieldCheck className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-blue-400 font-bold">Laudo Preliminar de Suporte:</span> Este resultado é gerado por IA e serve exclusivamente como auxílio diagnóstico. Não substitui a interpretação de médico radiologista ou especialista habilitado. Sempre valide com um profissional de saúde antes de tomar qualquer decisão clínica.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEGAL SAFEGUARD */}
        <div className="relative z-10">
          <LegalSafeguard
            module="NEXUS HEALTH — MEDICAL VISION AI"
            protocol="NH-VISION-01"
            customMessage="O Nexus Health é uma ferramenta de suporte ao diagnóstico médico baseada em visão computacional e inteligência artificial. Os resultados fornecidos têm caráter exclusivamente auxiliar e não constituem diagnóstico médico definitivo. A interpretação final deve sempre ser realizada por médico especialista habilitado (CRM). O uso inadequado desta ferramenta sem supervisão profissional é de responsabilidade exclusiva do usuário."
          />
        </div>
      </div>
      
      {/* DETAILED REPORT MODAL */}
      <AnimatePresence>
        {showDetailedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-md bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-slate-950 border border-teal-500/30 shadow-[0_0_80px_rgba(20,184,166,0.15)] rounded-[32px]"
            >
              <div className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                    <Stethoscope className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase italic">Laudo Clínico Detalhado</h2>
                    <p className="text-xs text-slate-400 font-mono">NEXUS-ID: {Math.random().toString(36).substring(2, 10).toUpperCase()} · {activeFindings.title}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailedReport(false)} className="text-slate-400 hover:text-white rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-8 space-y-8">
                {/* Paciente */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Paciente</p>
                    <p className="text-white font-bold">{patient.nome || 'Não Informado'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">CPF / Identificação</p>
                    <p className="text-white font-bold">{patient.cpf || '***.***.***-**'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Data Análise</p>
                    <p className="text-white font-bold">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Resumo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-400" /> Resumo do Laudo
                  </h3>
                  <div className="bg-teal-950/20 border border-teal-500/20 rounded-2xl p-6 space-y-3">
                    <p className="text-white text-lg leading-relaxed">{activeFindings.summary}</p>
                    <p className="text-slate-400">{activeFindings.details}</p>
                  </div>
                </div>

                {/* Corpo do Texto Completo Fictício */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Microscope className="h-4 w-4 text-teal-400" /> Descrição Analítica (Texto Completo)
                  </h3>
                  <div className="prose prose-invert max-w-none text-slate-300">
                    <p>
                      Exame realizado com protocolo de alta resolução. As imagens obtidas foram analisadas através do sistema
                      algorítmico <strong>NEXUS VISION AI (v4.2.1)</strong>. O modelo de predição computacional aponta para
                      um índice de gravidade global de <strong>{overallSeverity}/10</strong>.
                    </p>
                    <p>
                      <strong>Achados Estruturais Principais:</strong>
                    </p>
                    <ul className="space-y-2 text-sm">
                      {mockFindings.map((f: any) => (
                        <li key={f.id}>
                          <strong>{f.region}:</strong> {f.finding}. <em>({f.detail})</em> - <span className="text-teal-400 font-bold">Confiança IA: {f.confidence}%</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4">
                      <strong>Conclusão da IA Diagnóstica:</strong> {activeFindings.summary} É imprescindível a correlação dos achados de imagem supracitados
                      com os dados clínicos e laboratoriais do paciente para a formulação da hipótese diagnóstica definitiva.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3 rounded-b-[32px]">
                <Button onClick={() => setShowDetailedReport(false)} className="bg-white text-black hover:bg-slate-200 font-black uppercase text-xs">
                  Fechar Laudo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </SovereignShowcase>
  );
}
