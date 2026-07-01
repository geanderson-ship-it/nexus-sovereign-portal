'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Users,
  Compass,
  MessageSquare,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function NexusRotasEmbaixadoraPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    municipio: '',
    cargo: '',
    mensagem: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp || !formData.municipio) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Por favor, preencha seu Nome, WhatsApp e o Município.'
      });
      return;
    }

    const msg = `Olá! Tenho interesse na Embaixadora Virtual.%0A%0A*Nome:* ${formData.nome}%0A*WhatsApp:* ${formData.whatsapp}%0A*Município:* ${formData.municipio}%0A*Cargo:* ${formData.cargo || 'Não informado'}%0A*E-mail:* ${formData.email || 'Não informado'}%0A*Mensagem:* ${formData.mensagem || 'Não informado'}`;
    window.open(`https://wa.me/5551999799582?text=${msg}`, '_blank');
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pt-28 pb-20">

      {/* === FULL PAGE BACKGROUND: Hawaii Beach === */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/hawaii-beach.png"
          alt="Fundo de praia paradisíaca"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Dark overlay for page-wide readability */}
        <div className="absolute inset-0 bg-black/75" />
        {/* Blue tonal tint */}
        <div className="absolute inset-0 bg-blue-950/30" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>


      <div className="container relative z-10 mx-auto px-4 md:px-6">
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link href="/nexus-rotas" className="inline-flex items-center gap-2 text-zinc-400 hover:text-blue-400 text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Painel Rotas
          </Link>
        </div>

        {/* HERO CARD — transparent so the page background shows through */}
        <section className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden mb-16 shadow-[0_0_80px_rgba(59,130,246,0.25)] border border-blue-500/20 min-h-[700px] sm:min-h-[820px] flex flex-col bg-black/30 backdrop-blur-sm">

          {/* === FOREGROUND CONTENT === */}
          <div className="relative z-20 flex flex-col items-center text-center px-6 pt-14 pb-8 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/50 bg-blue-950/60 text-blue-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Inteligência Cívica e Municipal
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl font-black tracking-tight leading-none text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)] mb-3">
              A EMBAIXADORA VIRTUAL
            </h1>

            <p className="text-blue-300 font-bold uppercase tracking-[0.2em] text-sm drop-shadow-md mb-5">
              A Cara e a Voz Inteligente da Sua Cidade
            </p>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl drop-shadow mb-8">
              Promova seu destino turístico, receba visitantes via WhatsApp, redes sociais e portais oficiais. A IA da Nexus conhece cada canto da sua cidade.
            </p>

            {/* === FOREGROUND IMAGE: AI Beach Tourism === */}
            <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-blue-400/30 shadow-[0_0_50px_rgba(59,130,246,0.35)] backdrop-blur-sm group">
              <Image
                src="/images/beach-ai-tourism.png"
                alt="Praia com toda a infraestrutura turística guiada e indicada pela Inteligência Artificial Nexus"
                width={1200}
                height={600}
                className="w-full h-[320px] sm:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay on the card image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              {/* Floating label on the card */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-black text-sm uppercase tracking-widest drop-shadow">Estrutura Guiada pela IA</span>
                  <span className="text-blue-300 text-xs font-medium">Hotel · Restaurante · Totem · Passeios · GPS</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/80 border border-blue-400/50 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  IA Ativa
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade into page */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </section>

        {/* FEATURES */}

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-800/60 mt-12">
          <div className="p-8 rounded-3xl bg-black/70 border border-zinc-700/60 backdrop-blur-md shadow-xl">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">Turismo Soberano para Cidades Inteligentes</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Multilíngue por Padrão</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Atendimento imediato em português, inglês, espanhol, alemão e outras línguas, sem barreiras de tradução ou custos extras com staff humano.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Patrimônio e História da Região</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Treinada com dados históricos, leis de preservação e pontos de interesse validados pela secretaria de turismo, evitando erros de informação.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Centralização de Serviços Cívicos</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Integração com contatos de utilidade pública (polícia, hospitais, táxis, ônibus) facilitando a jornada de quem acabou de pousar no município.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-black/70 p-8 rounded-3xl border border-zinc-700/60 backdrop-blur-md shadow-xl">
            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Apoio Governamental</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Nossa tecnologia respeita todas as regras de segurança e soberania de dados. As instâncias são implantadas na nuvem AWS dedicada do município, garantindo total governança.
            </p>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" /> Alinhado com o Decreto de Governo Digital e LGPD.</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" /> Suporte completo à Secretaria Municipal de Turismo.</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" /> Painel de Analytics detalhado de fluxos e dúvidas mais comuns de turistas.</li>
            </ul>
          </div>
        </section>

        {/* LEAD CAPTURE FORM */}
        <section id="contato-form" className="py-12 border-t border-zinc-900 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-headline">Cadastrar Interesse de Município</h2>
            <p className="text-zinc-500 mt-2 text-xs">
              Solicite um estudo de viabilidade técnica para a implantação da Embaixadora Virtual da sua cidade.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl border border-zinc-800 bg-zinc-950/60 shadow-xl">
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
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">WhatsApp Corporativo *</label>
                <Input 
                  name="whatsapp" 
                  value={formData.whatsapp} 
                  onChange={handleInputChange} 
                  placeholder="Seu telefone"
                  className="bg-black/50 border-zinc-800 focus:border-blue-500 text-sm h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Município / Cidade *</label>
                <Input 
                  name="municipio" 
                  value={formData.municipio} 
                  onChange={handleInputChange} 
                  placeholder="Cidade / Estado"
                  className="bg-black/50 border-zinc-800 focus:border-blue-500 text-sm h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Cargo / Órgão Público</label>
                <Input 
                  name="cargo" 
                  value={formData.cargo} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Secretário Adjunto de Turismo"
                  className="bg-black/50 border-zinc-800 focus:border-blue-500 text-sm h-10"
                />
              </div>
            </div>

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
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Detalhes da Solicitação</label>
              <Textarea 
                name="mensagem" 
                value={formData.mensagem} 
                onChange={handleInputChange} 
                placeholder="Descreva se o município já possui canais digitais de atendimento."
                className="bg-black/50 border-zinc-800 focus:border-blue-500 min-h-[80px] text-sm"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11"
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Solicitar Análise de Viabilidade'}
            </Button>
          </form>
        </section>

      </div>
    </div>
  );
}
