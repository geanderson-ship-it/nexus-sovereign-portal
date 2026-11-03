'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building,
  Building2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Users,
  Compass,
  MessageSquare,
  Globe,
  Handshake,
  Stethoscope,
  QrCode,
  Crown,
  Film,
  CheckCircle2,
  Zap,
  TrendingUp,
  FileText,
  Download,
  Utensils,
  Hotel,
  Network,
  Database,
  Leaf,
  AlertTriangle,
  Clock,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { getVideoUrl } from '@/lib/video-helper';

export default function NexusEmbaixadorasPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [modalidadeFoco, setModalidadeFoco] = useState<'ambas' | 'live' | 'gravado'>('ambas');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    ente: '',
    cargo: '',
    modeloInteresse: 'PPP (Parceria Público-Privada com CDL/ABIH/Abrasel)',
    mensagem: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp || !formData.ente) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Por favor, preencha seu Nome, WhatsApp e o Município/Entidade.'
      });
      return;
    }

    const msg = `Olá! Tenho interesse na Embaixadora Virtual Soberana.%0A%0A*Nome:* ${formData.nome}%0A*WhatsApp:* ${formData.whatsapp}%0A*Município/Estado/Entidade:* ${formData.ente}%0A*Cargo:* ${formData.cargo || 'Não informado'}%0A*Modelo de Interesse:* ${formData.modeloInteresse}%0A*E-mail:* ${formData.email || 'Não informado'}%0A*Mensagem:* ${formData.mensagem || 'Não informado'}`;
    window.open(`https://wa.me/5551999799582?text=${msg}`, '_blank');
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pt-28 pb-20">

      {/* === FULL PAGE BACKGROUND: Smart Coastal City === */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/hawaii-beach.png"
          alt="Fundo panorâmico de destino turístico inteligente"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-blue-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-blue-400 text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Início
          </Link>
        </div>

        {/* HERO CARD */}
        <section className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden mb-16 shadow-[0_0_80px_rgba(59,130,246,0.25)] border border-blue-500/30 min-h-[720px] sm:min-h-[840px] flex flex-col bg-black/40 backdrop-blur-md">

          {/* FOREGROUND CONTENT */}
          <div className="relative z-20 flex flex-col items-center text-center px-6 pt-14 pb-8 flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-400/50 bg-blue-950/70 text-blue-300 text-xs font-black uppercase tracking-wider mb-5 shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-sm">
              <Building2 className="w-4 h-4 text-blue-400" />
              GovTech & Turismo Inteligente · Municipal, Estadual e Federal
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl font-black tracking-tight leading-none text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)] mb-3">
              A EMBAIXADORA VIRTUAL SOBERANA
            </h1>

            <p className="text-blue-300 font-bold uppercase tracking-[0.2em] text-sm sm:text-base drop-shadow-md mb-5">
              A Guia Oficial da Região: Turismo, Segurança, Saúde e Economia Local
            </p>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-3xl drop-shadow mb-6">
              Acolha visitantes e cidadãos 24 horas por dia diretamente no portal oficial do município, em totens interativos em aeroportos/rodoviárias e no WhatsApp oficial da cidade. Uma Inteligência Artificial soberana que orienta o turista em mais de 50 idiomas, resguarda a segurança pública e impulsiona o comércio local através de PPPs inovadoras.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a
                href="#contato-form"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Solicitar Estudo de Viabilidade Cívica
              </a>
              <a
                href="#modelo-ppp"
                className="px-6 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-yellow-300 hover:text-yellow-200 font-extrabold uppercase tracking-wider text-xs sm:text-sm border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all flex items-center gap-2"
              >
                <Handshake className="w-4 h-4 text-yellow-400" /> Conhecer Modelo de PPP
              </a>
              <a
                href="/Catalogo-Solucoes-Enterprise-Nexus.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 hover:text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-blue-400" /> Baixar Dossiê Executivo (PDF)
              </a>
            </div>

            {/* FOREGROUND IMAGE: AI Beach Tourism */}
            <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-blue-400/40 shadow-[0_0_50px_rgba(59,130,246,0.35)] backdrop-blur-sm group">
              <Image
                src="/images/beach-ai-tourism.png"
                alt="Praia e orla de destino turístico com ecossistema guiado pela Inteligência Artificial Nexus"
                width={1200}
                height={600}
                className="w-full h-[320px] sm:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-white font-black text-sm uppercase tracking-widest drop-shadow">Ecossistema Cívico Conectado</span>
                  <span className="text-blue-300 text-xs font-medium">Portais Oficiais · Totens de Aeroporto · WhatsApp da Cidade · QR Codes em Monumentos</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/80 border border-blue-400/50 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Presença Cívica Ativa
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </section>

        {/* OS 4 PILARES DE SERVIÇOS CÍVICOS DA EMBAIXADORA */}
        <section className="py-12 border-t border-zinc-800/60 mt-12">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" /> Acolhimento 360 Graus
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-headline">
              Muito Mais que Turismo: Assistência Cívica Integral
            </h2>
            <p className="text-zinc-400 mt-2 text-xs sm:text-sm leading-relaxed">
              A Embaixadora é treinada com dados oficiais dos órgãos públicos para prestar assistência imediata aos visitantes e residentes em qualquer situação da sua estadia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pilar 1: Segurança Pública */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.1)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white uppercase text-sm mb-2">Segurança Pública & Suporte</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Localização da Delegacia de Atendimento ao Turista (DEAT), telefones de emergência (190, 193, 197), dicas de áreas recomendadas, orientações cívicas e canais de socorro imediato no WhatsApp.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-red-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Canal Oficial Criptografado
              </div>
            </div>

            {/* Pilar 2: Saúde & Emergências */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.1)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white uppercase text-sm mb-2">Saúde & Atendimento Médico</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Guia de farmácias de plantão, postos de saúde, UPAs, hospitais de urgência credenciados, acionamento do SAMU 192 e orientações sobre atendimento SUS e vacinas para viajantes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Amparo Humanizado 24h
              </div>
            </div>

            {/* Pilar 3: Turismo & Patrimônio */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.1)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white uppercase text-sm mb-2">Patrimônio, Cultura & História</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  História da fundação da cidade, monumentos tombados, museus, arquitetura histórica e agenda oficial de eventos cívicos e festivais culturais com curadoria da Secretaria de Turismo.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-blue-300 font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Curadoria Histórica Autêntica
              </div>
            </div>

            {/* Pilar 4: Mobilidade & Multilíngue */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.1)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white uppercase text-sm mb-2">Mobilidade & 50+ Idiomas</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Rotas de ônibus, táxis credenciados, estacionamento rotativo, acessibilidade urbana e acolhimento em mais de 50 línguas nativas (inglês, espanhol, alemão, mandarim, francês, etc.).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-purple-300 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Zero Barreiras Idiomáticas
              </div>
            </div>

          </div>
        </section>

        {/* BLOCO DE ENGENHARIA DE INTEGRAÇÃO MULTI-SECRETARIAS VIA API */}
        <section className="py-12 border-t border-zinc-800/60 mt-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/90 border border-blue-500/40 backdrop-blur-md shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            
            {/* Header do Bloco */}
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
                <Network className="w-3.5 h-3.5 text-blue-400" />
                Arquitetura Aberta & Conectores Modulares via API
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-headline">
                Integração com Todas as Secretarias Municipais e Estaduais
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm mt-2 leading-relaxed">
                As quatro funções turísticas são apenas a base. <strong className="text-white">Se a prefeitura ou o estado disponibilizar uma API REST, Webhook ou base oficial de dados</strong>, a Embaixadora se integra a qualquer secretaria para entregar informações transparentes, auditáveis e sem promessas mirabolantes.
              </p>
            </div>

            {/* Três Pilares Centrais de Entrega */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wide">WhatsApp Oficial da Cidade</h5>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Zero download de app. O cidadão e o turista usam o app que já têm no bolso.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wide">Mais de 50 Idiomas Nativos</h5>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Inglês, espanhol, alemão, francês, mandarim, árabe e mais, sem sotaque artificial.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-blue-500/30 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wide">Disponibilidade 24/7/365</h5>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Ininterrupta: sem feriados, sem pausas e sem filas de espera no atendimento cívico.</p>
                </div>
              </div>
            </div>

            {/* Grid 6 Secretarias Integráveis com Casos Concretos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase mb-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Meio Ambiente & Parques
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Balneabilidade de praias, trilhas ecológicas abertas, regras de preservação ambiental, tábuas de maré e cronogramas de coleta seletiva de lixo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-yellow-300 uppercase mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Cultura, Festivais & Lazer
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Programação de teatros municipais, calendários de shows oficiais, exposições em museus e inscrições para oficinas cívicas culturais.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Obras, Trânsito & Vias
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Interdições de ruas em tempo real, obras em andamento, rotas de desvio, avisos de tráfego e localização de vagas de estacionamento rotativo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-red-300 uppercase mb-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Defesa Civil & Alertas
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Avisos oficiais em tempo real de chuvas fortes, ressacas marítimas, vendavais e rotas seguras de orientação em casos de emergência.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase mb-1.5">
                  <Receipt className="w-3.5 h-3.5 text-blue-400" /> Fazenda, Finanças & Taxas
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Tira-dúvidas sobre taxas municipais de turismo sustentável (onde aplicável), certidões públicas e calendário fiscal da prefeitura.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase mb-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-400" /> Transparência & Dados Oficiais
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Consulta de contatos de secretarias, horários de repartições públicas municipais e serviços do cidadão com total conformidade LGPD.
                </p>
              </div>

            </div>

            {/* Banner de Compromisso Técnico de Sobriedade */}
            <div className="mt-6 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3 text-xs text-blue-200">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                <strong>Compromisso de Sobriedade Nexus:</strong> A Embaixadora não inventa dados e não gera alucinações. Cada informação repassada ao cidadão ou visitante é estritamente consumida da API ou repositório oficial homologado pelo respectivo órgão público.
              </span>
            </div>

          </div>
        </section>

        {/* O MODELO INOVADOR DE PPP (PARCERIA PÚBLICO-PRIVADA) */}
        <section id="modelo-ppp" className="py-12 border-t border-zinc-800/60 mt-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-950 to-blue-950/40 border-2 border-yellow-500/40 backdrop-blur-md shadow-[0_0_60px_rgba(234,179,8,0.15)]">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-800">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 text-xs font-black uppercase tracking-wider mb-2">
                  <Handshake className="w-4 h-4 text-yellow-400" /> O Segredo da Sustentabilidade Financeira
                </div>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-headline">
                  Modelo PPP: Parceria Público-Privada com CDL, ABIH & Abrasel
                </h2>
              </div>
              <span className="text-xs text-yellow-200/80 max-w-xs text-left lg:text-right font-medium">
                Tecnologia de primeiro mundo implantada com autofinanciamento e fortalecimento real da economia local.
              </span>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8">
              A prefeitura ou o governo estadual não precisam arcar sozinhos com a infraestrutura. A <strong className="text-white">Nexus Holding Group</strong> estrutura a implantação através de uma <strong className="text-yellow-300">Aliança Tripartite Colaborativa</strong>, unindo o Poder Público, as Entidades de Classe Representativas e os Empresários do Turismo:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Vértice 1: Poder Público */}
              <div className="p-6 rounded-2xl bg-black/60 border border-blue-500/40 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                    <Building className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white uppercase text-sm mb-2 text-blue-300">1. O Poder Público (Prefeituras / Estados)</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Entra com a chancela oficial, curadoria dos dados históricos e disponibilização dos espaços cívicos: inclusão da Embaixadora no portal oficial, totens em aeroportos/rodoviárias e placas com QR Code nos monumentos e praças da cidade.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-blue-300 font-bold">
                  Credibilidade & Governança Oficial
                </div>
              </div>

              {/* Vértice 2: Entidades Representativas */}
              <div className="p-6 rounded-2xl bg-black/60 border border-yellow-500/40 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white uppercase text-sm mb-2 text-yellow-300">2. Entidades de Classe (CDL, ABIH, Abrasel)</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    A Câmara de Dirigentes Lojistas (CDL), o Sindicato de Hotéis (ABIH), a Associação de Bares e Restaurantes (Abrasel) e os Convention Bureaus lideram a adesão dos associados, chancelando os estabelecimentos credenciados que cumprem padrões de excelência.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-yellow-300 font-bold">
                  Mobilização & Critérios de Qualidade
                </div>
              </div>

              {/* Vértice 3: Iniciativa Privada */}
              <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/40 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white uppercase text-sm mb-2 text-emerald-300">3. A Iniciativa Privada (Hotéis, Bares, Lojas)</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Hotéis, pousadas, vinícolas e restaurantes patrocinam as cotas de manutenção da tecnologia em troca de indicação qualificada da Embaixadora, aumento comprovado de fluxo de clientes e visibilidade oficial nos canais municipais.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-emerald-300 font-bold">
                  Retorno Comercial & Sustentação Financeira
                </div>
              </div>
            </div>

            {/* Box de Governança, Ética e Papel Técnico Exclusivo da Nexus */}
            <div className="mb-6 p-5 rounded-2xl bg-black/80 border border-yellow-500/40 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h5 className="text-white font-bold text-xs uppercase tracking-wide text-yellow-300 flex items-center gap-2">
                  Governança, Integridade & Papel Técnico Exclusivo da Nexus
                </h5>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  O arranjo do projeto público-privado <strong className="text-white">deve partir previamente estruturado e deliberado pelo próprio Município ou por uma das entidades de classe oficiais</strong> (CDL, ABIH, Abrasel). A Nexus Holding Group atua <strong className="text-yellow-200">estritamente como fornecedora e implantadora da tecnologia</strong> — com contratação técnica, transparente, auditável e alinhada à lei, sem qualquer intermediação política ou envolvimento em negociações paralelas.
                </p>
              </div>
            </div>

            {/* Banner de Benefícios da PPP */}
            <div className="p-6 rounded-2xl bg-black/70 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h5 className="text-white font-bold text-sm uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Ciclo Virtuoso: Aumento Direto da Arrecadação de ISS
                </h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Com o turista permanecendo mais tempo na cidade e consumindo no comércio credenciado, a arrecadação tributária cresce, o empresariado prospera e o município se consolida como Cidade Inteligente de referência internacional.
                </p>
              </div>
              <a
                href="#contato-form"
                onClick={() => setFormData(prev => ({ ...prev, modeloInteresse: 'PPP (Parceria Público-Privada com CDL/ABIH/Abrasel)' }))}
                className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(234,179,8,0.3)] shrink-0 transition-all"
              >
                Implantar Modelo PPP
              </a>
            </div>

          </div>
        </section>

        {/* TRANSBORDO POR QR CODE NOS PONTOS TURÍSTICOS E MONUMENTOS */}
        <section className="py-12 border-t border-zinc-800/60 mt-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/80 border border-blue-500/30 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 text-[11px] font-black uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5 text-blue-400" />
                  Placas Inteligentes de Patrimônio Histórico
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-headline">
                  QR Codes Cívicos: O Celular do Turista Vira um Audioguia Vivo
                </h3>

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Imagine o visitante caminhando pela Praça da Matriz, pelo Centro Histórico ou por uma trilha ecológica. Ao lado de cada monumento, há uma placa cívica com o <strong className="text-white">QR Code Oficial do Município</strong>.
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Ao apontar a câmera do celular, abre-se instantaneamente o <strong className="text-blue-300">WhatsApp Oficial da Embaixadora</strong>, que narra em áudio ou texto a história do local no idioma do visitante, responde dúvidas e logo em seguida recomenda: <em>"Quer um café colonial típico? O Café das Flores fica a 120 metros daqui, associado à Abrasel!"</em>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                    <span className="text-xs font-bold text-blue-300 block mb-1">🏛️ Audioguia Interativo</span>
                    <p className="text-[11px] text-zinc-400">Histórias ricas de cada prédio histórico sem necessidade de guia físico presencial.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                    <span className="text-xs font-bold text-yellow-300 block mb-1">☕ Indicação de Comércio Local</span>
                    <p className="text-[11px] text-zinc-400">Fluxo direcionado para os comércios e restaurantes credenciados pela CDL e Abrasel.</p>
                  </div>
                </div>
              </div>

              {/* Mockup Chat WhatsApp Cívico */}
              <div className="w-full lg:w-[340px] shrink-0 p-4 rounded-3xl bg-black/90 border border-zinc-700/80 shadow-[0_0_35px_rgba(59,130,246,0.3)]">
                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-zinc-800">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    GV
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">Embaixadora Vitória</span>
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-[10px] text-blue-400 font-medium">Canal Oficial do Município</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-[11px]">
                  <div className="p-2.5 rounded-xl rounded-tr-none bg-blue-950/80 border border-blue-500/30 text-blue-100 ml-4">
                    <p>Qual é a história dessa igreja aqui na frente?</p>
                    <span className="text-[9px] text-blue-400/70 block text-right mt-1">15:10 ✓✓</span>
                  </div>

                  <div className="p-2.5 rounded-xl rounded-tl-none bg-zinc-900 border border-zinc-800 text-zinc-200 mr-2">
                    <p>Você está diante da <strong>Igreja Matriz de 1883</strong>, construída em estilo neogótico! Seus vitrais vieram da Alemanha. Quer ouvir o áudio com a narração histórica completa?</p>
                    <span className="text-[9px] text-zinc-500 block text-right mt-1">15:10</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-yellow-950/60 to-zinc-900 border border-yellow-500/40 text-yellow-200">
                    <p className="text-[10px] text-zinc-300 leading-snug">
                      ☕ <strong>Dica da Embaixadora:</strong> A 80 metros daqui fica a <em>Confeitaria do Centro</em> (credenciada CDL), famosa pela cuca colonial fresca. Deseja a rota a pé?
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1 text-blue-400 font-semibold">
                    <QrCode className="w-3 h-3" /> Ponto Turístico Validado
                  </span>
                  <span>LGPD & Gov Digital</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* AS DUAS MODALIDADES: LIVE AVATAR VS. VÍDEOS GRAVADOS */}
        <section className="py-12 border-t border-zinc-800/60 mt-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/90 border border-blue-500/30 backdrop-blur-md shadow-[0_0_60px_rgba(59,130,246,0.15)]">
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-zinc-800">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Flexibilidade de Implantação
                </div>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-headline">
                  Duas Modalidades Tecnológicas: Live Avatar ou Vídeos Gravados
                </h2>
                <p className="text-zinc-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  As funcionalidades cívicas são idênticas. Em ambas as modalidades, através de <strong className="text-white">QR Codes inteligentes</strong>, o turista e o cidadão são encaminhados instantaneamente para o <strong className="text-blue-300">WhatsApp padrão oficial</strong>, desfrutando de uma sensação única de <strong className="text-yellow-300">exclusividade, atendimento próximo e rápido</strong> — seja caminhando pelas ruas da cidade ou no aconchego do seu lar.
                </p>
              </div>

              {/* Botões de Filtro */}
              <div className="flex items-center gap-2 p-1.5 bg-black/60 rounded-2xl border border-zinc-800 shrink-0 self-start lg:self-end">
                <button
                  type="button"
                  onClick={() => setModalidadeFoco('ambas')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    modalidadeFoco === 'ambas' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Ver Ambas
                </button>
                <button
                  type="button"
                  onClick={() => setModalidadeFoco('live')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    modalidadeFoco === 'live' ? 'bg-amber-500 text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'text-amber-300'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" /> Live Avatar
                </button>
                <button
                  type="button"
                  onClick={() => setModalidadeFoco('gravado')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    modalidadeFoco === 'gravado' ? 'bg-blue-500 text-white font-extrabold shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-blue-300'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" /> Vídeos Gravados
                </button>
              </div>
            </div>

            <div className={`grid gap-8 ${modalidadeFoco === 'ambas' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
              
              {/* Modalidade 1: Live Avatar */}
              {(modalidadeFoco === 'ambas' || modalidadeFoco === 'live') && (
                <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-black/85 to-zinc-950 border-2 border-amber-500/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-yellow-400" /> Máxima Imersão Cívica
                      </span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                        Tempo Real &lt; 600ms
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white uppercase mb-2">Live Avatar em Tempo Real</h3>
                    <p className="text-amber-200/90 text-xs font-bold uppercase tracking-widest mb-4">
                      Para Totens de Aeroportos, Centros de Turismo (CAT) e Palcos
                    </p>
                    <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                      A Embaixadora conversa livremente por voz e escuta o turista em tempo real. Responde perguntas complexas sobre leis, história e rotas locais com microexpressões e sincronia labial geradas por streaming neural.
                    </p>

                    {/* Destaque QR Code WhatsApp Padrão */}
                    <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 mb-6">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase mb-1">
                        <QrCode className="w-3.5 h-3.5 text-amber-400" /> Transbordo QR Code para WhatsApp Padrão
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        Ao escanear o QR Code no totem, o turista leva a Embaixadora no celular para o <strong>WhatsApp oficial da cidade</strong>. Uma sensação única de <strong>exclusividade, atendimento próximo e resposta imediata</strong> — seja caminhando pelas ruas ou no aconchego do seu lar e hotel.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-amber-500/20 text-[11px] text-amber-300/80">
                    🎯 <strong>Sensação:</strong> Presença viva de uma anfitriã oficial recebendo delegações e turistas internacionais.
                  </div>
                </div>
              )}

              {/* Modalidade 2: Vídeos Gravados Dinâmicos */}
              {(modalidadeFoco === 'ambas' || modalidadeFoco === 'gravado') && (
                <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/40 via-black/85 to-zinc-950 border-2 border-blue-500/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-blue-400" /> Elegância Cívica em Escala
                      </span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                        Edge Cache · Zero Latência
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white uppercase mb-2">Vídeos Gravados Dinâmicos</h3>
                    <p className="text-blue-200/90 text-xs font-bold uppercase tracking-widest mb-4">
                      Para Portais de Prefeituras, Totens de Praça e WhatsApp da Cidade
                    </p>
                    <p className="text-zinc-300 text-xs leading-relaxed mb-4">
                      Gravação cinematográfica em estúdio 4K/8K com figurinos cívicos nobres. Respostas ativadas dinamicamente com base nas escolhas do cidadão, imune a oscilações de conexão e com baixíssimo custo operacional.
                    </p>

                    {/* Destaque QR Code WhatsApp Padrão */}
                    <div className="p-3.5 rounded-xl bg-black/60 border border-blue-500/30 mb-6">
                      <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase mb-1">
                        <QrCode className="w-3.5 h-3.5 text-blue-400" /> Acolhimento Íntimo via QR Code no WhatsApp Padrão
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        Nas praças, monumentos e portais, o QR Code conecta o visitante diretamente ao <strong>WhatsApp padrão oficial</strong>. Sem baixar aplicativos, desfrutando de <strong>atendimento rápido, acolhedor e exclusivo</strong>, seja descobrindo a cidade a pé ou no conforto do seu descanso.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-blue-500/20 text-[11px] text-blue-300/80">
                    🎯 <strong>Sensação:</strong> Apresentação impecável de TV pública de alta definição, rápida e confiável.
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* GALERIA DE AMOSTRAS B2G */}
        <section className="py-12 border-t border-zinc-800/60 mt-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-headline">Galeria de Amostras</h2>
            <p className="text-zinc-400 mt-2 text-xs">
              Conheça exemplos práticos das nossas Embaixadoras Virtuais voltadas para o turismo cívico e internacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Amostra 1: Valéria */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/65 flex flex-col justify-between shadow-lg">
              <div className="rounded-xl overflow-hidden mb-4 border border-zinc-800/80 aspect-video relative">
                <CustomVideoPlayer 
                  src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Valeria_Explicativo.mp4", "Valeria_Explicativo.mp4")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded bg-blue-950/40 mb-2 inline-block">Demonstração de Rotas</span>
                <h3 className="font-bold text-white text-base">Valéria — Guiamento Regional</h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Visão geral de como a embaixadora interage, explica rotas de cidades e orienta os visitantes de forma unificada.
                </p>
              </div>
            </div>

            {/* Amostra 2: Vitória */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/65 flex flex-col justify-between shadow-lg">
              <div className="rounded-xl overflow-hidden mb-4 border border-zinc-800/80 aspect-video relative">
                <CustomVideoPlayer 
                  src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Vitoria_Embaixadora.mp4", "Vitoria_Embaixadora_virtual.mp4")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded bg-blue-950/40 mb-2 inline-block">Modelo Cívico Municipal</span>
                <h3 className="font-bold text-white text-base">Vitória — Embaixadora da Cidade</h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Recepção institucional multilíngue, voz acolhedora e suporte cívico integral para portais e totens municipais.
                </p>
              </div>
            </div>

            {/* Amostra 3: Hana */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/65 flex flex-col justify-between shadow-lg">
              <div className="rounded-xl overflow-hidden mb-4 border border-zinc-800/80 aspect-video relative">
                <CustomVideoPlayer 
                  src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Hana_Japao.mp4", "Hana_Japao.mp4")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded bg-blue-950/40 mb-2 inline-block">Relações Internacionais</span>
                <h3 className="font-bold text-white text-base">Hana — Concierge Japão</h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Demonstração de suporte multilíngue focado em turismo internacional e acolhimento cultural sem atrito.
                </p>
              </div>
            </div>

            {/* Amostra 4: Isabel */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/65 flex flex-col justify-between shadow-lg">
              <div className="rounded-xl overflow-hidden mb-4 border border-zinc-800/80 aspect-video relative">
                <CustomVideoPlayer 
                  src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Isabel_Mendoza.mp4", "Isabel_Mendoza.mp4")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded bg-blue-950/40 mb-2 inline-block">Rotas Gastronômicas & Vinhos</span>
                <h3 className="font-bold text-white text-base">Isabel — Concierge Mendoza</h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Foco em rotas de enoturismo, parcerias com vinícolas locais e atrativos gastronômicos regionais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD CAPTURE FORM */}
        <section id="contato-form" className="py-12 border-t border-zinc-800/60 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-headline">Cadastrar Interesse de Município ou Entidade</h2>
            <p className="text-zinc-400 mt-2 text-xs">
              Solicite um estudo de viabilidade para implantação da Embaixadora Virtual na sua cidade via convênio direto ou Modelo PPP com CDL, ABIH e Abrasel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl border border-zinc-700/60 bg-black/70 backdrop-blur-md shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Seu Nome *</label>
                <Input 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleInputChange} 
                  placeholder="Nome do Solicitante"
                  className="bg-black/50 border-zinc-800 focus:border-blue-500 text-sm h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">WhatsApp Institucional *</label>
                <Input 
                  name="whatsapp" 
                  value={formData.whatsapp} 
                  onChange={handleInputChange} 
                  placeholder="Seu telefone/celular"
                  className="bg-black/50 border-zinc-800 focus:border-blue-500 text-sm h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Município / Estado / Entidade *</label>
                <Input 
                  name="ente" 
                  value={formData.ente} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Pref. de Gramado / CDL"
                  className="bg-black/50 border-zinc-800 focus:border-blue-500 text-sm h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Cargo / Função</label>
                <Input 
                  name="cargo" 
                  value={formData.cargo} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Secretário de Turismo / Presidente CDL"
                  className="bg-black/50 border-zinc-800 focus:border-blue-500 text-sm h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">E-mail Institucional</label>
                <Input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Ex: turismo@prefeitura.gov.br"
                  type="email"
                  className="bg-black/50 border-zinc-800 focus:border-blue-500 text-sm h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Modelo de Interesse *</label>
                <select
                  name="modeloInteresse"
                  value={formData.modeloInteresse}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-zinc-800 focus:border-blue-500 text-zinc-200 text-xs sm:text-sm h-10 rounded-md px-3 font-medium outline-none"
                >
                  <option value="PPP (Parceria Público-Privada com CDL/ABIH/Abrasel)" className="bg-zinc-900 text-white">
                    ⭐ PPP (Parceria Público-Privada com Entidades)
                  </option>
                  <option value="Convênio Público Municipal Direto" className="bg-zinc-900 text-white">
                    🏛️ Convênio Municipal Direto (Prefeitura/Secretaria)
                  </option>
                  <option value="Projeto Estadual / Regional" className="bg-zinc-900 text-white">
                    🗺️ Projeto Estadual ou Regional de Turismo
                  </option>
                  <option value="Entidade de Classe (CDL, ABIH, Abrasel)" className="bg-zinc-900 text-white">
                    🤝 Demanda da Entidade de Classe / Associação
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Mensagem / Cenário Atual da Região</label>
              <Textarea 
                name="mensagem" 
                value={formData.mensagem} 
                onChange={handleInputChange} 
                placeholder="Descreva se o município já possui canais digitais de atendimento ao turista e totens."
                className="bg-black/50 border-zinc-800 focus:border-blue-500 min-h-[80px] text-sm"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold h-11"
              disabled={loading}
            >
              {loading ? 'Processando envio...' : 'Solicitar Estudo de Viabilidade Cívica'}
            </Button>
          </form>

          {/* Secondary PDF Download Card */}
          <div className="mt-8 p-6 rounded-2xl bg-zinc-950/80 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wide">
                  Dossiê Executivo & Catálogo de Soluções (PDF Oficial)
                </h4>
                <p className="text-zinc-400 text-[11px] mt-0.5">
                  Estrutura de implantação cívica, modelo de governança, arquitetura de IA soberana e compliance LGPD.
                </p>
              </div>
            </div>
            <a
              href="/Catalogo-Solucoes-Enterprise-Nexus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-extrabold uppercase tracking-wider text-[11px] shrink-0 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <Download className="w-3.5 h-3.5" /> Baixar PDF Oficial
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
