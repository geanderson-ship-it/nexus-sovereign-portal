'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building,
  Smartphone, 
  Compass, 
  DollarSign, 
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Tv,
  Key,
  Utensils,
  Dumbbell,
  Users,
  Sliders,
  ShieldCheck,
  Zap,
  Globe2,
  UserCheck,
  Lock,
  Server,
  FileCheck,
  EyeOff,
  Cpu,
  Crown,
  Film,
  Radio,
  Video,
  CheckCircle2,
  Layers,
  QrCode,
  Music,
  Volume2,
  Moon,
  Sun,
  MessageSquare,
  FileText,
  Download,
  Mic,
  CreditCard,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { getVideoUrl } from '@/lib/video-helper';

export default function NexusRotasHoteisPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [modalidadeFoco, setModalidadeFoco] = useState<'ambas' | 'live' | 'gravado'>('ambas');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    hotel: '',
    quartos: '',
    modalidade: 'Modelo Híbrido (Live Avatar + Vídeos Gravados)',
    mensagem: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp || !formData.hotel) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Por favor, preencha seu Nome, WhatsApp e o Nome da sua Empresa/Hotel.'
      });
      return;
    }

    const msg = `Olá! Tenho interesse na Nexus Hospitality Suite.%0A%0A*Nome:* ${formData.nome}%0A*WhatsApp:* ${formData.whatsapp}%0A*Hotel:* ${formData.hotel}%0A*Quartos:* ${formData.quartos || 'Não informado'}%0A*Modalidade de Interesse:* ${formData.modalidade}%0A*E-mail:* ${formData.email || 'Não informado'}%0A*Mensagem:* ${formData.mensagem || 'Não informado'}`;
    window.open(`https://wa.me/5551999799582?text=${msg}`, '_blank');
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pt-28 pb-20">

      {/* === FULL PAGE BACKGROUND: Luxury Smart Resort === */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/hoteis-bg.png"
          alt="Vista panorâmica de um resort de luxo à noite"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-emerald-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        
        {/* Navigation back to Hub */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-400 text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Início
          </Link>
        </div>

        {/* HERO CARD */}
        <section className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden mb-16 shadow-[0_0_80px_rgba(16,185,129,0.25)] border border-emerald-500/20 min-h-[700px] sm:min-h-[820px] flex flex-col bg-black/30 backdrop-blur-sm">

          {/* FOREGROUND CONTENT */}
          <div className="relative z-20 flex flex-col items-center text-center px-6 pt-14 pb-8 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/50 bg-emerald-950/60 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-sm">
              <Building className="w-4 h-4" />
              Hospitalidade Inteligente B2B
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl font-black tracking-tight leading-none text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)] mb-3">
              CONCIERGE VIRTUAL DE LUXO
            </h1>

            <p className="text-emerald-300 font-bold uppercase tracking-[0.2em] text-sm drop-shadow-md mb-5">
              Inteligência Artificial Soberana para Hotéis, Resorts e Patrimônios Históricos
            </p>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl drop-shadow mb-6">
              Proporcione uma experiência de alto padrão 24 horas por dia no WhatsApp, nas Smart TVs dos quartos e nos Totens de lobby. Com a Nexus Hospitality Suite, você elimina sobrecargas operacionais e transforma a estada do hóspede em uma jornada inesquecível.
            </p>

            {/* HERO CTA BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a
                href="#contato-form"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Solicitar Escopo de Implantação
              </a>
              <a
                href="/Dossie-Tecnico-Nexus-Hospitality-Suite.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-yellow-300 hover:text-yellow-200 font-extrabold uppercase tracking-wider text-xs sm:text-sm border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-yellow-400" /> Baixar Dossiê Técnico Executivo (PDF)
              </a>
            </div>

            {/* FOREGROUND IMAGE: AI Concierge Room */}
            <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-emerald-400/30 shadow-[0_0_50px_rgba(16,185,129,0.35)] backdrop-blur-sm group">
              <Image
                src="/images/hoteis-ai-concierge.png"
                alt="Suíte luxuosa de hotel com interface holográfica do concierge da Inteligência Artificial"
                width={1200}
                height={600}
                className="w-full h-[320px] sm:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-white font-black text-sm uppercase tracking-widest drop-shadow">Suíte Interativa</span>
                  <span className="text-emerald-300 text-xs font-medium">Room Service · Concierge Virtual · Spa · Checkout Automático</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/80 border border-emerald-400/50 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  IA Ativa
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </section>

        {/* DETAILS SECTION: O LOBBY INTELIGENTE & A HOSPITALITY SUITE */}
        <section className="py-12 space-y-12 border-t border-zinc-800/60 mt-12">
          
          {/* BLOCO 1: O LOBBY INTELIGENTE (TOTEM TOUCH, CHECK-IN/OUT & ECOSSISTEMA DO HOTEL) */}
          <div className="p-8 sm:p-12 rounded-3xl bg-black/70 border border-emerald-500/30 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Key className="w-3.5 h-3.5" /> Frente de Entrada & Hub Central
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  O Lobby Inteligente: Recepção, Check-in Ágil e Automação 24/7
                </h2>
              </div>
              <span className="text-xs text-zinc-400 max-w-xs text-left md:text-right">
                Elimine filas, absorva picos de chegada e eleve a percepção de sofisticação logo no primeiro contato.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Lobby 1 */}
              <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white uppercase text-sm mb-2">Totem Físico Interativo & Voz Neural</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Atendente em vídeo interativo em tela touch 4K e síntese de voz ultra-natural. Tira dúvidas imediatas sobre instalações, horários de café, estacionamento e passeios locais sem criar gargalos na recepção.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" /> 50+ Idiomas sem Sotaque
                </div>
              </div>

              {/* Card Lobby 2 */}
              <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <Key className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white uppercase text-sm mb-2">Check-in Expresso & Pré-Check-in</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Integração com PMS (Desbravador e sistemas legados). O hóspede valida dados pelo WhatsApp antes de chegar ou pelo Totem do saguão, agilizando a entrega da chave ou código digital em segundos.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Zero Espera em Horários de Pico
                </div>
              </div>

              {/* Card Lobby 3 */}
              <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white uppercase text-sm mb-2">Integrações de API: Serviços do Hotel</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Conexão direta com a infraestrutura interna: reservas no Restaurante, agendamento de horários no SPA & Wellness, consulta de lotação da Academia e locação de Salas de Reunião/Business Center.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Lançamento Automático no Folio
                </div>
              </div>
            </div>
          </div>

          {/* BLOCO 2: IN-ROOM HOSPITALITY SUITE (A SUÍTE INTELIGENTE & SINCRONIA COM O QUARTO) */}
          <div className="p-8 sm:p-12 rounded-3xl bg-black/70 border border-yellow-500/30 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Tv className="w-3.5 h-3.5" /> In-Room Experience · Smart Hospitality
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Hospitality Suite: Boas-Vindas Calorosas na Smart TV & Automação do Quarto
                </h2>
              </div>
              <span className="text-xs text-zinc-400 max-w-xs text-left md:text-right">
                A experiência definitiva de acolhimento VIP sincronizada com a entrada do hóspede na suíte.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-wider text-yellow-300">
                  Sincronia Total: Do Check-in à Entrada na Suíte
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Integrada à API do Lobby e ao PMS, a <strong className="text-white">Nexus Hospitality Suite</strong> sabe o segundo exato em que o cliente concluiu o check-in e abriu a porta do quarto (via cartão inteligente ou sensor de presença).
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  No momento em que o hóspede entra, a Smart TV se acende suavemente com uma saudação personalizada chamando-o pelo nome no seu idioma de origem, apresentando as amenidades do quarto, o cardápio de Room Service e os eventos do dia no hotel.
                </p>
              </div>

              {/* Grid 4 Mini Recursos da Suíte */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center gap-2.5 mb-2 text-yellow-300 font-bold text-xs uppercase tracking-wide">
                    <Sliders className="w-4 h-4" /> Controle de Iluminação
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Cenas pré-programadas de luz suave para descanso, leitura ou modo noturno (conforme a estrutura de automação IoT do hotel).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center gap-2.5 mb-2 text-yellow-300 font-bold text-xs uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" /> Clima & Temperatura
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Ajuste automático de ar-condicionado na temperatura ideal momentos antes da entrada ou regulável por voz e WhatsApp.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center gap-2.5 mb-2 text-yellow-300 font-bold text-xs uppercase tracking-wide">
                    <Tv className="w-4 h-4" /> Som & Imagem Relaxante
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Trilha sonora ambiente de boas-vindas, vídeos em 4K das atrações do hotel e streaming sob medida sem atritos de controle remoto.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center gap-2.5 mb-2 text-yellow-300 font-bold text-xs uppercase tracking-wide">
                    <Utensils className="w-4 h-4" /> Room Service Inteligente
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Cardápio digital completo, pedidos de toalhas extras, travesseiros ou refeições diretamente pela tela ou pelo WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* RECURSO EXCLUSIVO: TRANSBORDO QR CODE PARA WHATSAPP */}
            <div className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-950 to-teal-950/50 border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                
                {/* Lado Esquerdo: Descrição & Comandos */}
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    Zero Download de Aplicativo · Escaneou na Smart TV, Conectou
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-headline">
                    Transbordo via QR Code: O WhatsApp como Controle Remoto da Suíte
                  </h3>
                  
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                    Nenhum hóspede quer baixar apps para passar duas noites no hotel. Com a <strong className="text-white">Nexus Hospitality Suite</strong>, a Smart TV exibe na tela um <strong className="text-emerald-300">QR Code Único e Criptografado</strong> com o token da suíte.
                  </p>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Basta apontar a câmera do celular: o WhatsApp oficial do hotel se abre com a sessão autenticada. A partir daí, o hóspede controla o quarto inteiro conversando em linguagem natural com a Concierge Virtual!
                  </p>

                  {/* Grid de 6 Ações pelo WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                        <Music className="w-3.5 h-3.5 text-emerald-400" /> Música & Streaming de TV
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        <em>"Toca um jazz suave na suíte"</em> ou <em>"coloca no canal de notícias na TV"</em>.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-yellow-300 mb-1">
                        <Moon className="w-3.5 h-3.5 text-yellow-400" /> Luzes, Cortinas & Clima IoT
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        <em>"Fecha as cortinas blackout"</em>, <em>"luz suave"</em> ou <em>"ar em 21°C"</em>.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" /> Room Service & Pedidos
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        <em>"2 cafés expressos e água mineral"</em> — lançado direto no PMS do hotel.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1">
                        <Mic className="w-3.5 h-3.5 text-purple-400" /> Comandos por Áudio / Voz
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Sem precisar digitar: mande mensagem de voz em 50+ idiomas e a IA executa na hora.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-1">
                        <LogOut className="w-3.5 h-3.5 text-blue-400" /> Check-out Express & Zero Fila
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Extrato enviado às 10h, pagamento por Pix/Link e quarto liberado para limpeza no PMS.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-300 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Monetização & Comissões
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Indicações de passeios, vinícolas, lanchas e restaurantes gerando receita extra ao hotel.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Mockup Visual de Smartphone com Chat do WhatsApp */}
                <div className="w-full lg:w-[340px] shrink-0 p-4 rounded-3xl bg-black/90 border border-zinc-700/80 shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                  {/* Top Bar do Chat */}
                  <div className="flex items-center gap-3 pb-3 mb-3 border-b border-zinc-800">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      NH
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">Concierge Suíte 502</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">Online · Suíte Conectada</span>
                    </div>
                  </div>

                  {/* Mensagens do Chat */}
                  <div className="space-y-2.5 text-[11px]">
                    {/* Mensagem de Áudio do Hóspede */}
                    <div className="p-2.5 rounded-xl rounded-tr-none bg-emerald-950/80 border border-emerald-500/30 text-emerald-100 ml-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                          <Mic className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold">Mensagem de Voz (0:07)</span>
                      </div>
                      <span className="text-[9px] text-emerald-400/70">19:42 ✓✓</span>
                    </div>

                    {/* Resposta da Concierge */}
                    <div className="p-2.5 rounded-xl rounded-tl-none bg-zinc-900 border border-zinc-800 text-zinc-200 mr-2">
                      <p>Entendido, Sr. Alexandre! ✨ <strong>Cortinas blackout fechadas</strong> e <strong>Jazz Lounge</strong> iniciado na sua Smart TV. Temperatura ajustada para 21°C!</p>
                      <span className="text-[9px] text-zinc-500 block text-right mt-1">19:42</span>
                    </div>

                    {/* Check-out Express Notification */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-950/70 to-zinc-900 border border-blue-500/40 text-blue-200">
                      <div className="flex items-center gap-1.5 font-bold text-[10px] text-blue-300 mb-1">
                        <LogOut className="w-3 h-3" /> Check-out Express Disponível
                      </div>
                      <p className="text-[10px] text-zinc-300 leading-snug">
                        Extrato da Suíte 502 conferido (R$ 180 consumo de Room Service). Pague via Pix/Link e libere a saída sem passar na recepção.
                      </p>
                      <span className="mt-1.5 block text-center py-1 bg-blue-600/60 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                        Pagar & Concluir Saída
                      </span>
                    </div>
                  </div>

                  {/* Footer Mockup */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <QrCode className="w-3 h-3" /> QR Pareado
                    </span>
                    <span>PMS Desbravador Ativo</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Banner de Garantia Técnica & Segurança */}
            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 text-yellow-200">
                <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
                <span><strong>Arquitetura Modular Adaptável:</strong> Funciona perfeitamente em suítes com Smart TVs tradicionais ou totalmente conectadas a sistemas IoT de ponta.</span>
              </div>
              <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold">100% On-Premise / Edge Seguro</span>
            </div>
          </div>

          {/* BLOCO DEDICADO: DUAS MODALIDADES DA HOSPITALITY SUITE (LIVE AVATAR VS. VÍDEOS GRAVADOS) */}
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/90 border border-yellow-500/40 backdrop-blur-md shadow-[0_0_60px_rgba(234,179,8,0.15)]">
            
            {/* Header da Seção */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-zinc-800">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-black uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Duas Dimensões da Nexus Hospitality Suite
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-headline leading-tight">
                  A Mesma Inteligência Operacional. <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500">
                    Duas Experiências de Exclusividade.
                  </span>
                </h2>
                <p className="text-zinc-300 text-sm sm:text-base mt-3 leading-relaxed">
                  As funcionalidades sistêmicas são <strong className="text-white">rigorosamente idênticas</strong> em ambas as versões — room service, integração PMS (Desbravador e outros), controle de iluminação/clima IoT, totens de lobby, concierge turístico e WhatsApp 24/7. O que se transforma é a <strong className="text-yellow-300">tecnologia de renderização, o nível de exclusividade e a experiência imersiva</strong> proporcionada ao seu hóspede.
                </p>
              </div>

              {/* Botões de Filtro/Visualização */}
              <div className="flex items-center gap-2 p-1.5 bg-black/60 rounded-2xl border border-zinc-800 shrink-0 self-start lg:self-end">
                <button
                  type="button"
                  onClick={() => setModalidadeFoco('ambas')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    modalidadeFoco === 'ambas'
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Ver Lado a Lado
                </button>
                <button
                  type="button"
                  onClick={() => setModalidadeFoco('live')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    modalidadeFoco === 'live'
                      ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] font-extrabold'
                      : 'text-amber-300 hover:text-amber-200'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" /> Live Avatar
                </button>
                <button
                  type="button"
                  onClick={() => setModalidadeFoco('gravado')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    modalidadeFoco === 'gravado'
                      ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] font-extrabold'
                      : 'text-emerald-300 hover:text-emerald-200'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" /> Vídeos Gravados
                </button>
              </div>
            </div>

            {/* CARDS COMPARATIVOS DAS DUAS MODALIDADES */}
            <div className={`grid gap-8 ${modalidadeFoco === 'ambas' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
              
              {/* VERSÃO 1: LIVE AVATAR EM TEMPO REAL */}
              {(modalidadeFoco === 'ambas' || modalidadeFoco === 'live') && (
                <div className="relative p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-black/85 to-zinc-950 border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.18)] flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div>
                    {/* Badge Superior */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                        <Crown className="w-3.5 h-3.5 text-yellow-400" />
                        Ultra-Luxo Soberano
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        Streaming Neural &lt; 600ms
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
                      Live Avatar em Tempo Real
                    </h3>
                    <p className="text-amber-200/90 text-xs font-bold uppercase tracking-widest mb-4">
                      Interação Conversacional Fluida, Viva e Espontânea
                    </p>
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
                      O ápice do luxo mundial para <strong className="text-white">Suítes Presidenciais, Penthouses, Resorts 5+ Estrelas e Destinos Relais & Châteaux</strong>. O hóspede conversa livremente por voz ou touch com o avatar, que raciocina e devolve respostas com microexpressões faciais e sincronia labial geradas em tempo real.
                    </p>

                    {/* Destaques de Percepção */}
                    <div className="space-y-3 mb-6">
                      <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20">
                        <h5 className="text-amber-300 font-bold text-xs uppercase tracking-wide flex items-center gap-2 mb-1">
                          <Radio className="w-3.5 h-3.5 text-amber-400" /> Conversação Livre & Sem Roteiros Engessados
                        </h5>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          O hóspede pode perguntar qualquer curiosidade histórica do hotel, pedir recomendações personalizadas com base nas suas preferências dietéticas ou simplesmente bater papo com uma presença calorosa.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20">
                        <h5 className="text-amber-300 font-bold text-xs uppercase tracking-wide flex items-center gap-2 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Pronúncia em Tempo Real do Nome do Hóspede
                        </h5>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          A IA pronuncia o nome do cliente em tempo real ao longo de toda a conversa, adaptando tom de voz, simpatia e formalidade ao perfil de cada hóspede.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20">
                        <h5 className="text-amber-300 font-bold text-xs uppercase tracking-wide flex items-center gap-2 mb-1">
                          <Globe2 className="w-3.5 h-3.5 text-amber-400" /> Fluência Viva em Mais de 50 Idiomas
                        </h5>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          Se o hóspede falar em francês, mandarim, árabe, alemão ou espanhol, o avatar responde no mesmo segundo no idioma exato com sotaque nativo natural.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resumo Tecnológico */}
                  <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
                    <span className="text-amber-300/80 font-medium">
                      🎯 <strong>Percepção do Hóspede:</strong> Ineditismo, magia e sensação de atendimento VIP exclusivo e futurista.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, modalidade: 'Live Avatar em Tempo Real (Ultra-Luxo)' }));
                        const form = document.getElementById('contato-form');
                        form?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase tracking-wider shrink-0 transition-all text-[10px]"
                    >
                      Selecionar Live Avatar
                    </button>
                  </div>
                </div>
              )}

              {/* VERSÃO 2: VÍDEOS GRAVADOS DINÂMICOS */}
              {(modalidadeFoco === 'ambas' || modalidadeFoco === 'gravado') && (
                <div className="relative p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-black/85 to-zinc-950 border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.18)] flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div>
                    {/* Badge Superior */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                        <Film className="w-3.5 h-3.5 text-emerald-400" />
                        Elegância Executiva & Escala
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Edge Cache Offline-First · Zero Latência
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
                      Vídeos Gravados Dinâmicos
                    </h3>
                    <p className="text-emerald-200/90 text-xs font-bold uppercase tracking-widest mb-4">
                      Matrix Cinematográfica 4K/8K com Máxima Estabilidade
                    </p>
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
                      A solução perfeita de alta sofisticação para <strong className="text-white">Redes Hoteleiras, Hotéis Executivos, Resorts Corporativos e Suítes Master/Standard</strong>. Cada resposta, saudação e roteiro é gravado em estúdio cinematográfico em 4K/8K, sendo ativado dinamicamente de acordo com os comandos do hóspede.
                    </p>

                    {/* Destaques de Percepção */}
                    <div className="space-y-3 mb-6">
                      <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/20">
                        <h5 className="text-emerald-300 font-bold text-xs uppercase tracking-wide flex items-center gap-2 mb-1">
                          <Film className="w-3.5 h-3.5 text-emerald-400" /> Produção Estética de Cinema Impecável
                        </h5>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          Iluminação de estúdio nobre, enquadramentos milimétricos, figurinos de gala e dicção impecável. A marca do hotel é representada com perfeição plástica em qualquer tela.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/20">
                        <h5 className="text-emerald-300 font-bold text-xs uppercase tracking-wide flex items-center gap-2 mb-1">
                          <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Resiliência Absoluta Offline-First
                        </h5>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          Os vídeos residem em cache local no Edge do hotel. Se o link de internet externo sofrer instabilidade ou oscilação de banda, as Smart TVs e Totens continuam respondendo sem travar.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/20">
                        <h5 className="text-emerald-300 font-bold text-xs uppercase tracking-wide flex items-center gap-2 mb-1">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" /> Previsibilidade Operacional & Alto ROI
                        </h5>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          Consumo de banda otimizado, sem custos contínuos de computação neural por streaming de vídeo, permitindo escalar para centenas de quartos com retorno financeiro imediato.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resumo Tecnológico */}
                  <div className="pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
                    <span className="text-emerald-300/80 font-medium">
                      🎯 <strong>Percepção do Hóspede:</strong> Elegância de primeira classe, sofisticação de superprodução e rapidez instantânea.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, modalidade: 'Vídeos Gravados Dinâmicos (Elegância Executiva)' }));
                        const form = document.getElementById('contato-form');
                        form?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-wider shrink-0 transition-all text-[10px]"
                    >
                      Selecionar Vídeos Gravados
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* TABELA COMPARATIVA DE FUNCIONALIDADES (IDÊNTICAS) VS. EXPERIÊNCIA SENSORIAL */}
            <div className="mt-10 pt-8 border-t border-zinc-800">
              <div className="text-center mb-6">
                <span className="text-[11px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30">
                  Matriz de Paridade Técnica & Experiência
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-2">
                  Mesma Potência Operacional, Diferentes Camadas de Imersão
                </h4>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-black/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/80 text-zinc-300 uppercase tracking-wider text-[11px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4 font-black">Capacidade / Recurso</th>
                      <th className="p-4 font-black text-amber-300">Live Avatar em Tempo Real</th>
                      <th className="p-4 font-black text-emerald-300">Vídeos Gravados Dinâmicos</th>
                      <th className="p-4 font-black text-zinc-400">Impacto no Hotel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    <tr className="hover:bg-zinc-900/40">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-emerald-400" /> Room Service & Pedidos Digitais
                      </td>
                      <td className="p-4 text-amber-300 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Integrado (via voz/touch)
                      </td>
                      <td className="p-4 text-emerald-300 font-semibold">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Integrado (via touch/menu)</span>
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">Automação completa da cozinha sem ligação telefônica</td>
                    </tr>

                    <tr className="hover:bg-zinc-900/40">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Key className="w-4 h-4 text-emerald-400" /> Integração PMS (Desbravador/Opera)
                      </td>
                      <td className="p-4 text-amber-300 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Simbiose Total via API
                      </td>
                      <td className="p-4 text-emerald-300 font-semibold">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Simbiose Total via API</span>
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">Lançamento imediato de despesas no extrato do hóspede</td>
                    </tr>

                    <tr className="hover:bg-zinc-900/40">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-emerald-400" /> Controle de Iluminação & Clima IoT
                      </td>
                      <td className="p-4 text-amber-300 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Comando por Fala Natural
                      </td>
                      <td className="p-4 text-emerald-300 font-semibold">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Acionamento por Interface Touch</span>
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">Conforto sob medida e economia inteligente de energia</td>
                    </tr>

                    <tr className="hover:bg-zinc-900/40">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" /> Concierge no WhatsApp & Totens
                      </td>
                      <td className="p-4 text-amber-300 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Suporte 24/7 Ativo
                      </td>
                      <td className="p-4 text-emerald-300 font-semibold">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Suporte 24/7 Ativo</span>
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">Assistência ininterrupta antes, durante e após a estada</td>
                    </tr>

                    <tr className="hover:bg-zinc-900/40">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-emerald-400" /> Transbordo QR Code na TV para WhatsApp
                      </td>
                      <td className="p-4 text-amber-300 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> TV, Som, Luz, Cortinas & Room Service
                      </td>
                      <td className="p-4 text-emerald-300 font-semibold">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> TV, Som, Luz, Cortinas & Room Service</span>
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">Zero app: o celular do hóspede vira o controle universal da suíte</td>
                    </tr>

                    <tr className="hover:bg-zinc-900/40 bg-zinc-900/30">
                      <td className="p-4 font-bold text-yellow-300 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-yellow-400" /> Modo de Interação Sensorial
                      </td>
                      <td className="p-4 text-amber-200 font-bold">
                        Diálogo Livre e Aberto por Voz em Tempo Real (&lt; 600ms)
                      </td>
                      <td className="p-4 text-emerald-200 font-bold">
                        Navegação Dinâmica por Menus & Cenas Gravadas
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">Diferenciação direta de experiência de luxo</td>
                    </tr>

                    <tr className="hover:bg-zinc-900/40 bg-zinc-900/30">
                      <td className="p-4 font-bold text-yellow-300 flex items-center gap-2">
                        <Film className="w-4 h-4 text-yellow-400" /> Padrão de Renderização
                      </td>
                      <td className="p-4 text-amber-200 font-bold">
                        Síntese Neural Streaming Adaptativa Instantânea
                      </td>
                      <td className="p-4 text-emerald-200 font-bold">
                        Produção Cinematográfica 4K/8K Pré-Renderizada
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">Adaptação à infraestrutura e perfil do empreendimento</td>
                    </tr>

                    <tr className="hover:bg-zinc-900/40 bg-zinc-900/30">
                      <td className="p-4 font-bold text-yellow-300 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-400" /> Percepção do Hóspede
                      </td>
                      <td className="p-4 text-amber-300 font-black">
                        🌟 "Presença Viva na Suíte" (Ultra-Exclusividade)
                      </td>
                      <td className="p-4 text-emerald-300 font-black">
                        🎬 "TV de Bordo de Primeira Classe" (Elegância de Cinema)
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">Alto valor percebido em qualquer categoria</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Box Estratégico: O Modelo Híbrido */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-emerald-500/15 border border-yellow-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-yellow-300 font-black text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-yellow-400" /> A Recomendação Estratégica da Nexus: O Modelo Híbrido
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                    Você pode implantar o <strong className="text-amber-300">Live Avatar em Tempo Real</strong> nas Suítes Presidenciais, Bangalôs e Categorias VIP (maximizando o valor da diária e a exclusividade dos hóspedes premium) e os <strong className="text-emerald-300">Vídeos Gravados Dinâmicos</strong> nos quartos executivos e totens do lobby — unificando todo o hotel sob uma única gestão com máxima rentabilidade!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, modalidade: 'Modelo Híbrido (Live Avatar VIP + Vídeos Gravados Geral)' }));
                    const form = document.getElementById('contato-form');
                    form?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black uppercase tracking-wider text-xs shadow-[0_0_25px_rgba(234,179,8,0.4)] shrink-0 transition-all"
                >
                  Quero o Modelo Híbrido
                </button>
              </div>

            </div>

          </div>

          {/* CARD HORIZONTAL 1: IMAGEM DO CONCIERGE 100% PERSONALIZADA */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-black/80 to-blue-950/40 border border-purple-500/30 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3 h-3" /> Identidade Visual Exclusiva & Sob Medida
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    Imagem do Concierge 100% Personalizável
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                    A personificação visual e a presença de marca do seu hotel ganham um rosto único no mercado.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-zinc-800/80">
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1.5 text-purple-300">
                  Rosto, Trajes & Crachá do Hotel
                </h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  O avatar pode ser um homem, uma mulher, uma figura histórica do empreendimento ou a réplica digital do uniforme oficial da sua equipe de governança e recepção.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1.5 text-purple-300">
                  Expressões & Sincronia Labial 4K
                </h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Sem aspecto de robô 3D ou boneco animado. O concierge opera com renderização hiper-realista em 4K, olhar acolhedor, sorriso natural e sincronicidade perfeita de fala.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1.5 text-purple-300">
                  Gêmeo Digital de Embaixadores Reais
                </h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Se o seu hotel ou resort já possui um anfitrião oficial, gerente geral ou porta-voz de marca, podemos criar o seu Gêmeo Digital exato para receber os hóspedes.
                </p>
              </div>
            </div>
          </div>

          {/* CARD HORIZONTAL 2: BLINDAGEM DE SEGURANÇA, DADOS E PRIVACIDADE LGPD/GDPR */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-black/80 to-teal-950/40 border border-emerald-500/30 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    <Lock className="w-3 h-3" /> Arquitetura Segura & Missão Crítica para T.I.
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    Blindagem Máxima de Segurança & Conformidade LGPD/GDPR
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                    Engenharia projetada para que a equipe de T.I. e Governança do hotel aprove com total tranquilidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-zinc-800/80">
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                  <Server className="w-4 h-4" /> Zero Acesso Direto a Bancos SQL
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  A Nexus não solicita senhas de banco nem faz consultas invasivas. A integração com PMS (Desbravador e outros) opera 100% via API REST oficial e Webhooks criptografados.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                  <Lock className="w-4 h-4" /> Zero Portas Abertas no Firewall
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Sem portas de entrada (Inbound) expostas para a internet. Toda a comunicação trafega exclusivamente de saída (Outbound) via TLS 1.3 pela porta segura 443. A rede do hotel permanece invisível.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                  <EyeOff className="w-4 h-4" /> Proteção Financeira & PCI
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Nenhum número de cartão de crédito, documento restrito ou dado de pagamento transita pelos modelos de IA. Os links de pagamento direcionam direto ao gateway homologado do hotel.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                  <Cpu className="w-4 h-4" /> Módulo Local & Resiliência
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Arquitetura Offline-First. O Edge local armazena os vídeos e mídias das suítes. Se a conexão externa com o provedor cair, as Smart TVs e Totens continuam funcionando sem interrupção.
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* GALERIA DE AMOSTRAS HOTEIS/RESORTS */}
        <section className="py-12 border-t border-zinc-800/60 mt-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-headline">Galeria de Amostras</h2>
            <p className="text-zinc-400 mt-2 text-xs">
              Conheça exemplos práticos de Embaixadoras Virtuais, fluentes em mais de 50 idiomas e voltadas para a hotelaria, resorts e hospitalidade de alto padrão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Amostra 1: Sofia - Hoteis */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/65 flex flex-col justify-between shadow-lg">
              <div className="rounded-xl overflow-hidden mb-4 border border-zinc-800/80 aspect-video relative">
                <CustomVideoPlayer 
                  src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Hoteis.mp4", "Hoteis.mp4")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded bg-emerald-950/40 mb-2 inline-block">Hotelaria Standard</span>
                <h3 className="font-bold text-white text-base">Sofia — Concierge de Hotéis</h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Automação de recepção 24h: respostas rápidas sobre Wi-Fi, horários de café e políticas de recepção.
                </p>
              </div>
            </div>

            {/* Amostra 2: Clara - Resorts */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/65 flex flex-col justify-between shadow-lg">
              <div className="rounded-xl overflow-hidden mb-4 border border-zinc-800/80 aspect-video relative">
                <CustomVideoPlayer 
                  src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Reorts.mp4", "Reorts.mp4")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded bg-emerald-950/40 mb-2 inline-block">Resorts de Lazer</span>
                <h3 className="font-bold text-white text-base">Clara — Concierge de Resorts</h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Guiamento por complexos amplos, agendamento de SPA, reservas de restaurantes e atividades esportivas.
                </p>
              </div>
            </div>

            {/* Amostra 3: Valéria - Cancún */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/65 flex flex-col justify-between shadow-lg">
              <div className="rounded-xl overflow-hidden mb-4 border border-zinc-800/80 aspect-video relative">
                <CustomVideoPlayer 
                  src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Valeria_Cancun.mp4", "Valeria_Cancun.mp4")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded bg-emerald-950/40 mb-2 inline-block">Destinos de Sol & Praia</span>
                <h3 className="font-bold text-white text-base">Valéria — Concierge Cancún</h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Suporte completo de hotelaria internacional, sugestões de passeios, restaurantes e logística praiana.
                </p>
              </div>
            </div>

            {/* Amostra 4: Kelie - Austrália */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/65 flex flex-col justify-between shadow-lg">
              <div className="rounded-xl overflow-hidden mb-4 border border-zinc-800/80 aspect-video relative">
                <CustomVideoPlayer 
                  src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Embaixadora/Kelie_Australia.mp4", "Kelie_Australia.mp4")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded bg-emerald-950/40 mb-2 inline-block">Atendimento Poliglota</span>
                <h3 className="font-bold text-white text-base">Kelie — Concierge Austrália</h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Demonstração de suporte poliglota de alta fluidez para hóspedes de língua inglesa e estrangeiros.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD CAPTURE FORM */}
        <section id="contato-form" className="py-12 border-t border-zinc-800/60 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-headline">Solicitar Proposta para meu Hotel</h2>
            <p className="text-zinc-400 mt-2 text-xs">
              Deixe seus contatos e nossa diretoria executiva retornará com o escopo personalizado de implantação da Nexus Hospitality Suite.
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
                  placeholder="Nome do Gestor"
                  className="bg-black/50 border-zinc-800 focus:border-emerald-500 text-sm h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">WhatsApp *</label>
                <Input 
                  name="whatsapp" 
                  value={formData.whatsapp} 
                  onChange={handleInputChange} 
                  placeholder="Seu telefone/celular"
                  className="bg-black/50 border-zinc-800 focus:border-emerald-500 text-sm h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Nome do Hotel/Resort *</label>
                <Input 
                  name="hotel" 
                  value={formData.hotel} 
                  onChange={handleInputChange} 
                  placeholder="Nome do Empreendimento"
                  className="bg-black/50 border-zinc-800 focus:border-emerald-500 text-sm h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Número de Quartos</label>
                <Input 
                  name="quartos" 
                  value={formData.quartos} 
                  onChange={handleInputChange} 
                  placeholder="Qtd Quartos"
                  type="number"
                  className="bg-black/50 border-zinc-800 focus:border-emerald-500 text-sm h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">E-mail Corporativo</label>
                <Input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Ex: gerencia@hotel.com"
                  type="email"
                  className="bg-black/50 border-zinc-800 focus:border-emerald-500 text-sm h-10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Modalidade da Suite *</label>
                <select
                  name="modalidade"
                  value={formData.modalidade}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-zinc-800 focus:border-emerald-500 text-zinc-200 text-xs sm:text-sm h-10 rounded-md px-3 font-medium outline-none"
                >
                  <option value="Modelo Híbrido (Live Avatar VIP + Vídeos Gravados Geral)" className="bg-zinc-900 text-white">
                    ⭐ Modelo Híbrido (Live VIP + Gravados Geral)
                  </option>
                  <option value="Live Avatar em Tempo Real (Ultra-Luxo)" className="bg-zinc-900 text-white">
                    👑 Live Avatar em Tempo Real (Ultra-Luxo Presidencial)
                  </option>
                  <option value="Vídeos Gravados Dinâmicos (Elegância Executiva)" className="bg-zinc-900 text-white">
                    🎬 Vídeos Gravados Dinâmicos (Elegância Executiva)
                  </option>
                  <option value="Avaliar com a Diretoria Executiva" className="bg-zinc-900 text-white">
                    🤝 Alinhar Recomendação com a Diretoria
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Mensagem (Opcional)</label>
              <Textarea 
                name="mensagem" 
                value={formData.mensagem} 
                onChange={handleInputChange} 
                placeholder="Nos conte um pouco sobre sua recepção e demandas atuais."
                className="bg-black/50 border-zinc-800 focus:border-emerald-500 min-h-[80px] text-sm"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11"
              disabled={loading}
            >
              {loading ? 'Processando envio...' : 'Enviar Solicitação de Orçamento'}
            </Button>
          </form>

          {/* Secondary PDF Download Card */}
          <div className="mt-8 p-6 rounded-2xl bg-zinc-950/80 border border-yellow-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wide">
                  Dossiê Técnico & Estratégico (PDF Oficial)
                </h4>
                <p className="text-zinc-400 text-[11px] mt-0.5">
                  Cronograma de 30 dias de Go-Live, arquitetura de hardware, segurança e modelo de ROI hoteleiro.
                </p>
              </div>
            </div>
            <a
              href="/Dossie-Tecnico-Nexus-Hospitality-Suite.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase tracking-wider text-[11px] shrink-0 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            >
              <Download className="w-3.5 h-3.5" /> Baixar PDF
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
