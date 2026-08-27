'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Mail, Shield, Zap, Check, Sparkles, Monitor, Code, Cpu, Smartphone, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import * as gtag from '@/lib/gtag';

interface FeatureOption {
  id: string;
  name: string;
  days: number;
  complexity: 'Baixa' | 'Média' | 'Alta';
  description: string;
}

const FEATURE_OPTIONS: FeatureOption[] = [
  {
    id: 'institutional',
    name: 'Portal Institucional de Alto Padrão',
    days: 15,
    complexity: 'Baixa',
    description: 'Design premium customizado (Next.js/React), otimização máxima para SEO e velocidade.',
  },
  {
    id: 'members',
    name: 'Área de Membros / Painel do Cliente',
    days: 12,
    complexity: 'Média',
    description: 'Autenticação segura, controle de acessos exclusivos e área logada do cliente.',
  },
  {
    id: 'ai',
    name: 'Integração de IA / Chatbots de Atendimento',
    days: 15,
    complexity: 'Alta',
    description: 'Conexão com avatares de IA, treinamento de base de conhecimento e respostas automatizadas.',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Integração de Pagamento',
    days: 10,
    complexity: 'Média',
    description: 'Checkout seguro integrado com Pix, cartão de crédito e gateway customizado.',
  },
  {
    id: 'admin',
    name: 'Painel Administrativo Interno',
    days: 8,
    complexity: 'Média',
    description: 'Gestão de leads, analytics integrado e controle tático completo do sistema.',
  },
];

function DevelopmentContent() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['institutional']);
  const [sent, setSent] = useState(false);

  // Calcula prazo e complexidade do simulador
  const totalDays = selectedFeatures.reduce((acc, featId) => {
    const option = FEATURE_OPTIONS.find((f) => f.id === featId);
    return acc + (option ? option.days : 0);
  }, 0);

  const maxComplexity = selectedFeatures.reduce((acc, featId) => {
    const option = FEATURE_OPTIONS.find((f) => f.id === featId);
    if (!option) return acc;
    if (option.complexity === 'Alta') return 'Alta';
    if (option.complexity === 'Média' && acc !== 'Alta') return 'Média';
    return acc;
  }, 'Baixa' as 'Baixa' | 'Média' | 'Alta');

  const toggleFeature = (id: string) => {
    if (id === 'institutional') return; // Institucional é obrigatório como base
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const selectedFeaturesNames = selectedFeatures
      .map((fid) => FEATURE_OPTIONS.find((f) => f.id === fid)?.name)
      .join(', ');

    const whatsappBody = `*Nova Proposta de Desenvolvimento Web - Nexus*

*Nome:* ${data.firstName} ${data.lastName}
*E-mail:* ${data.email}
*Telefone:* ${data.phone}
*Empresa:* ${data.company || "Não informada"}
--------------------------------
*Escopo Simulado:* ${selectedFeaturesNames}
*Prazo Simulado:* ~${totalDays} dias
*Complexidade:* ${maxComplexity}

*Mensagem:*
${data.message || 'Briefing simulado na landing page.'}`.trim();

    // 1. Enviar lead ao backend
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company || '',
          subject: 'Desenvolvimento Web Soberano',
          message: `Escopo: ${selectedFeaturesNames} | Prazo: ~${totalDays} dias. Mensagem: ${data.message || ''}`,
        }),
      });
    } catch (err) {
      console.error('Erro ao enviar lead:', err);
    }

    // 2. Track Event no GA4
    gtag.event({
      action: 'webdev_lead_submit',
      category: 'conversion',
      label: selectedFeaturesNames,
    });

    const whatsappLink = `https://wa.me/5551993783897?text=${encodeURIComponent(whatsappBody)}`;
    window.open(whatsappLink, '_blank');
    setSent(true);
    toast({
      title: 'Proposta Enviada!',
      description: 'Seu briefing foi encaminhado com sucesso e você foi redirecionado ao WhatsApp corporativo.',
    });
  };

  return (
    <div className="min-h-screen text-white relative">
      {/* Background de Conexões */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <Image
          src="/web-development-bg.jpg?v=3"
          alt="Nexus Network"
          fill
          priority
          className="object-cover opacity-25"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/75 to-black/90" />
      </div>

      <div className="relative z-10 container mx-auto py-12 md:py-20 px-4">
        {/* Header Hero */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Portfólio de Soluções Nexus
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans tracking-normal leading-[1.2] text-white">
            <span className="font-light block mb-2 uppercase">Portais Web Corporativos &</span>
            <span className="font-black text-yellow-400 block drop-shadow-[0_0_30px_rgba(250,204,21,0.15)] uppercase">
              Ecossistemas Digitais Exclusivos
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[800px] text-lg text-slate-300 md:text-xl font-sans leading-relaxed">
            Arquitetura web corporativa sob medida desenvolvida em Next.js para marcas que exigem blindagem de segurança militar, velocidade extrema de carregamento e integrações inteligentes com IA.
          </p>
        </div>

        {/* Pilares Técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 rounded-2xl border-2 border-primary/20 bg-zinc-950/60 backdrop-blur-md shadow-xl flex flex-col gap-4">
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-primary/20 shadow-inner">
              <Image
                src="/pilar-velocidade.jpg"
                alt="Velocidade Extrema"
                fill
                className="object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 h-10 w-10 rounded-lg bg-zinc-950/80 border border-primary/30 flex items-center justify-center text-primary backdrop-blur-sm">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-bold font-headline text-white mt-1">Velocidade Extrema (Next.js)</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Portais desenvolvidos com renderização híbrida estática/servidor. Otimização máxima que garante carregamento abaixo de 1 segundo e aprovação máxima nas auditorias de SEO do Google.
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-blue-400/20 bg-zinc-950/60 backdrop-blur-md shadow-xl flex flex-col gap-4">
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-blue-400/20 shadow-inner">
              <Image
                src="/pilar-seguranca.jpg"
                alt="Blindagem Sistêmica"
                fill
                className="object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 h-10 w-10 rounded-lg bg-zinc-950/80 border border-blue-400/30 flex items-center justify-center text-blue-400 backdrop-blur-sm">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-bold font-headline text-white mt-1">Blindagem Sistêmica</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Segurança blindada com arquitetura Serverless e hospedagem em servidores de alta resiliência. Livre das vulnerabilidades críticas de CMS comuns, protegendo os dados do seu negócio.
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-emerald-400/20 bg-zinc-950/60 backdrop-blur-md shadow-xl flex flex-col gap-4">
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-emerald-400/20 shadow-inner">
              <Image
                src="/pilar-ia.jpg"
                alt="Sistemas & IA Embarcada"
                fill
                className="object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 h-10 w-10 rounded-lg bg-zinc-950/80 border border-emerald-400/30 flex items-center justify-center text-emerald-400 backdrop-blur-sm">
                <Cpu className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-bold font-headline text-white mt-1">Sistemas & IA Embarcada</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Formulários conectados a bancos táticos, chats com avatares de IA alimentados pela sua própria base de dados e envio automatizado de leads via WhatsApp ou e-mail.
            </p>
          </div>
        </div>

        {/* Bloco Simulador + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Simulador Interativo */}
          <div className="space-y-6 p-8 rounded-2xl border-2 border-primary/20 bg-zinc-950/70 backdrop-blur-md shadow-xl">
            <div>
              <h2 className="text-3xl font-black font-headline text-white uppercase tracking-wide">Simulador de Projetos</h2>
              <p className="text-sm text-slate-400 font-sans mt-1">Selecione os módulos necessários para o seu ecossistema digital corporativo:</p>
            </div>

            <div className="space-y-4 my-6">
              {FEATURE_OPTIONS.map((feat) => {
                const isSelected = selectedFeatures.includes(feat.id);
                const isBase = feat.id === 'institutional';
                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex items-start gap-3 select-none",
                      isSelected
                        ? "bg-primary/5 border-primary/40 shadow-md shadow-primary/5"
                        : "bg-zinc-900/30 border-border/40 hover:border-primary/25",
                      isBase && "cursor-not-allowed opacity-90"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                      isSelected ? "bg-primary border-primary text-white" : "border-border/60"
                    )}>
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-4">
                        <span className="font-bold text-white text-base font-headline">{feat.name}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-bold uppercase w-fit",
                          feat.complexity === 'Baixa' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                          feat.complexity === 'Média' && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                          feat.complexity === 'Alta' && "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        )}>
                          {feat.complexity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 font-sans mt-1">{feat.description}</p>
                      <p className="text-xs text-yellow-400 font-medium font-sans mt-1.5">+~{feat.days} dias de engenharia</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resultado do Simulador */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-border/40 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-sans">Complexidade do Projeto</p>
                <p className="text-xl font-black font-headline text-white uppercase tracking-wider">{maxComplexity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 font-sans">Prazo Estimado</p>
                <p className="text-3xl font-black font-headline text-yellow-400">~{totalDays} dias úteis</p>
              </div>
            </div>
          </div>

          {/* Formulário de Briefing */}
          <div className="p-8 rounded-2xl border-2 border-primary/20 bg-zinc-950/70 backdrop-blur-md shadow-xl">
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-widest text-white font-headline">Briefing Recebido!</h2>
                  <p className="text-slate-400 leading-relaxed max-w-sm text-sm font-sans">
                    Os parâmetros do seu projeto soberano foram enviados com sucesso e nossa equipe já está notificada via WhatsApp. Em breve iniciaremos o planejamento técnico do seu portal.
                  </p>
                </div>
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 mt-2" onClick={() => setSent(false)}>
                  Fazer nova simulação
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold font-headline text-white">Solicite sua Proposta</h2>
                  <p className="text-sm text-slate-400 font-sans mt-1">Preencha o formulário abaixo para enviar o escopo simulado diretamente para nossa engenharia comercial:</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input id="firstName" name="firstName" placeholder="Seu nome" required className="bg-zinc-900/60" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input id="lastName" name="lastName" placeholder="Sobrenome" required className="bg-zinc-900/60" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Corporativo</Label>
                    <Input id="email" name="email" type="email" placeholder="nome@suaempresa.com.br" required className="bg-zinc-900/60" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone / WhatsApp</Label>
                      <Input id="phone" name="phone" placeholder="+55 (51) 99999-9999" required className="bg-zinc-900/60" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Nome da Empresa</Label>
                      <Input id="company" name="company" placeholder="Sua Empresa" className="bg-zinc-900/60" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Instruções de Briefing / Comentários</Label>
                    <Textarea id="message" name="message" placeholder="Conte brevemente sobre o seu modelo de negócio ou objetivos de conversão com o novo site." rows={4} className="bg-zinc-900/60" />
                  </div>

                  <Button type="submit" className="w-full mt-4 font-headline uppercase tracking-wider font-bold">
                    Iniciar Aliança Comercial
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Canais Diretos da Alta Diretoria */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black font-headline text-white uppercase tracking-wider">Canais Diretos de Vendas</h2>
            <p className="text-slate-400 font-sans mt-2">Deseja pular a simulação e iniciar o diálogo estratégico direto com nossos executivos?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Geanderson Card */}
            <div className="border-l-2 border-primary/30 pl-3 flex items-start gap-4 bg-zinc-950/30 p-4 rounded-xl border border-primary/10">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/40 flex-shrink-0 shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/gean-diretor.png"
                  alt="Geanderson Leandro Schuh"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-wider text-primary uppercase">Founder & CEO</p>
                <p className="font-bold text-foreground text-base mt-0.5 truncate">Geanderson L. Schuh</p>
                <div className="flex flex-col text-xs mt-2.5 gap-2">
                  <a href="mailto:geanderson@nexusholdinggroup.com.br" className="text-slate-300 hover:text-primary hover:translate-x-1 font-medium transition-all flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    geanderson@nexusholdinggroup.com.br
                  </a>
                  <a href="https://wa.me/5551999799582" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-emerald-400 hover:translate-x-1 font-medium transition-all flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-current flex-shrink-0 text-emerald-400" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-11.98c-.12-.2-.24-.305-.449-.305h-.359c-.209 0-.54.079-.822.387-.282.308-1.077 1.051-1.077 2.562 0 1.512 1.097 2.977 1.247 3.177.151.2 2.158 3.292 5.228 4.613.73.314 1.299.502 1.742.643.733.233 1.4.2 1.928.121.588-.087 1.804-.737 2.06-1.45.256-.713.256-1.32.18-1.45-.076-.13-.277-.207-.578-.356-.301-.15-1.776-.875-2.051-.975-.275-.1-.475-.15-.675.15-.2.3-.776.975-.951 1.175-.175.2-.35.225-.651.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.085-.176-.3-.019-.462.132-.612.135-.135.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525C8.032 13.12 7.153 10.97 6.647 10.02z" />
                    </svg>
                    +55 (51) 99979-9582
                  </a>
                </div>
              </div>
            </div>

            {/* Ivoni Card */}
            <div className="border-l-2 border-blue-400/30 pl-3 flex items-start gap-4 bg-zinc-950/30 p-4 rounded-xl border border-blue-400/10">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-400/40 flex-shrink-0 shadow-lg shadow-blue-400/20 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/diretora-ivoni-nova.png"
                  alt="Ivoni Severo Schuh"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-wider text-blue-400 uppercase">Co-founder & CCO</p>
                <p className="font-bold text-foreground text-base mt-0.5 truncate">Ivoni Severo Schuh</p>
                <div className="flex flex-col text-xs mt-2.5 gap-2">
                  <a href="mailto:ivoni@nexusholdinggroup.com.br" className="text-slate-300 hover:text-blue-400 hover:translate-x-1 font-medium transition-all flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    ivoni@nexusholdinggroup.com.br
                  </a>
                  <a href="https://wa.me/5551999029371" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-emerald-400 hover:translate-x-1 font-medium transition-all flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-current flex-shrink-0 text-emerald-400" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-11.98c-.12-.2-.24-.305-.449-.305h-.359c-.209 0-.54.079-.822.387-.282.308-1.077 1.051-1.077 2.562 0 1.512 1.097 2.977 1.247 3.177.151.2 2.158 3.292 5.228 4.613.73.314 1.299.502 1.742.643.733.233 1.4.2 1.928.121.588-.087 1.804-.737 2.06-1.45.256-.713.256-1.32.18-1.45-.076-.13-.277-.207-.578-.356-.301-.15-1.776-.875-2.051-.975-.275-.1-.475-.15-.675.15-.2.3-.776.975-.951 1.175-.175.2-.35.225-.651.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.085-.176-.3-.019-.462.132-.612.135-.135.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525C8.032 13.12 7.153 10.97 6.647 10.02z" />
                    </svg>
                    +55 (51) 99902-9371
                  </a>
                </div>
              </div>
            </div>

            {/* Carla Card */}
            <div className="border-l-2 border-emerald-400/30 pl-3 flex items-start gap-4 bg-zinc-950/30 p-4 rounded-xl border border-emerald-400/10">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-400/40 flex-shrink-0 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/carla-vendas.png?v=2"
                  alt="Carla C. Schuh"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Executiva de Vendas</p>
                <p className="font-bold text-foreground text-base mt-0.5 truncate">Carla C. Schuh</p>
                <div className="flex flex-col text-xs mt-2.5 gap-2">
                  <a href="mailto:vendas@nexusholdinggroup.com.br" className="text-slate-300 hover:text-emerald-400 hover:translate-x-1 font-medium transition-all flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    vendas@nexusholdinggroup.com.br
                  </a>
                  <a href="https://wa.me/5551993783897" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-emerald-400 hover:translate-x-1 font-medium transition-all flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-current flex-shrink-0 text-emerald-400" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-11.98c-.12-.2-.24-.305-.449-.305h-.359c-.209 0-.54.079-.822.387-.282.308-1.077 1.051-1.077 2.562 0 1.512 1.097 2.977 1.247 3.177.151.2 2.158 3.292 5.228 4.613.73.314 1.299.502 1.742.643.733.233 1.4.2 1.928.121.588-.087 1.804-.737 2.06-1.45.256-.713.256-1.32.18-1.45-.076-.13-.277-.207-.578-.356-.301-.15-1.776-.875-2.051-.975-.275-.1-.475-.15-.675.15-.2.3-.776.975-.951 1.175-.175.2-.35.225-.651.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.085-.176-.3-.019-.462.132-.612.135-.135.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525C8.032 13.12 7.153 10.97 6.647 10.02z" />
                    </svg>
                    +55 (51) 99378-3897
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WebDevelopmentPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-white">Carregando Simulador Corporativo...</div>}>
      <DevelopmentContent />
    </Suspense>
  );
}
