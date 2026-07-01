'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UtensilsCrossed,
  ArrowLeft,
  CheckCircle,
  Coins,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function NexusRotasGastronomiaPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    restaurante: '',
    especialidade: '',
    mensagem: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp || !formData.restaurante) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Por favor, preencha seu Nome, WhatsApp e o Nome do Restaurante.'
      });
      return;
    }

    const msg = `Olá! Tenho interesse na Rota Gastronômica Nexus.%0A%0A*Nome:* ${formData.nome}%0A*WhatsApp:* ${formData.whatsapp}%0A*Restaurante:* ${formData.restaurante}%0A*Especialidade:* ${formData.especialidade || 'Não informado'}%0A*E-mail:* ${formData.email || 'Não informado'}%0A*Mensagem:* ${formData.mensagem || 'Não informado'}`;
    window.open(`https://wa.me/5551999799582?text=${msg}`, '_blank');
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pt-28 pb-20">

      {/* === FULL PAGE BACKGROUND: Sunset Beach Restaurant === */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/gastronomia-bg.png"
          alt="Restaurante à beira-mar ao pôr do sol"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-amber-950/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">

        {/* Navigation back */}
        <div className="mb-8">
          <Link href="/nexus-rotas" className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Painel Rotas
          </Link>
        </div>

        {/* HERO CARD */}
        <section className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden mb-16 shadow-[0_0_80px_rgba(245,158,11,0.25)] border border-amber-500/20 min-h-[700px] sm:min-h-[820px] flex flex-col bg-black/30 backdrop-blur-sm">

          {/* FOREGROUND CONTENT */}
          <div className="relative z-20 flex flex-col items-center text-center px-6 pt-14 pb-8 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/50 bg-amber-950/60 text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-sm">
              <UtensilsCrossed className="w-4 h-4" />
              Gastronomia e Comércio Local
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl font-black tracking-tight leading-none text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)] mb-3">
              ROTA GASTRONÔMICA
            </h1>

            <p className="text-amber-300 font-bold uppercase tracking-[0.2em] text-sm drop-shadow-md mb-5">
              Coloque seu Restaurante na Rota Oficial dos Hotéis
            </p>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl drop-shadow mb-8">
              Apareça no topo das indicações da IA quando turistas dos melhores hotéis e resorts perguntarem <em>"Onde almoçar?"</em> ou <em>"Qual restaurante ir hoje à noite?"</em>
            </p>

            {/* FOREGROUND IMAGE: AI Restaurant */}
            <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-amber-400/30 shadow-[0_0_50px_rgba(245,158,11,0.35)] backdrop-blur-sm group">
              <Image
                src="/images/gastronomia-ai-restaurant.png"
                alt="Restaurante à beira-praia com cardápio inteligente guiado por Inteligência Artificial Nexus"
                width={1200}
                height={600}
                className="w-full h-[320px] sm:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-black text-sm uppercase tracking-widest drop-shadow">Cardápio Inteligente da IA</span>
                  <span className="text-amber-300 text-xs font-medium">Indicação · Cupons · Rastreamento · Multilíngue</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600/80 border border-amber-400/50 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  IA Ativa
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </section>

        {/* FEATURES */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-800/60 mt-12">
          <div className="p-8 rounded-3xl bg-black/70 border border-zinc-700/60 backdrop-blur-md shadow-xl">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">Como a Rota direciona clientes para você</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Recomendação Patrocinada Inteligente</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Sua mesa indicada no exato momento da tomada de decisão do hóspede, com base na especialidade de pratos, distância e horário.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Cupons Exclusivos e Rastreamento</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Dispare cupons de desconto ou benefícios direto no WhatsApp do turista. Monitore em tempo real quantos clientes vieram pelo ecossistema Nexus.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Cardápio Interativo Multilíngue</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    A IA lê seu cardápio e explica os pratos detalhadamente em inglês, espanhol e alemão para o turista estrangeiro.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-black/70 p-8 rounded-3xl border border-zinc-700/60 backdrop-blur-md shadow-xl">
            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Parcerias e Credenciamento</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Selecionamos apenas os melhores estabelecimentos de cada especialidade para garantir a máxima qualidade de experiência ao turista.
            </p>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> Exclusividade por categoria gastronômica na região.</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> Sem taxa de setup para estabelecimentos parceiros no primeiro mês.</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> Painel de controle para monitorar conversões e QR Code.</li>
            </ul>
          </div>
        </section>

        {/* LEAD CAPTURE FORM */}
        <section id="contato-form" className="py-12 border-t border-zinc-800/60 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-headline">Solicitar Credenciamento Comercial</h2>
            <p className="text-zinc-400 mt-2 text-xs">
              Deixe os dados do seu restaurante e nossa equipe entrará em contato para agendar uma demonstração.
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
                  placeholder="Nome do Proprietário"
                  className="bg-black/50 border-zinc-800 focus:border-amber-500 text-sm h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">WhatsApp de Contato *</label>
                <Input 
                  name="whatsapp" 
                  value={formData.whatsapp} 
                  onChange={handleInputChange} 
                  placeholder="Seu telefone"
                  className="bg-black/50 border-zinc-800 focus:border-amber-500 text-sm h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Nome do Restaurante *</label>
                <Input 
                  name="restaurante" 
                  value={formData.restaurante} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Cantina del Bosco"
                  className="bg-black/50 border-zinc-800 focus:border-amber-500 text-sm h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Especialidade Culinária</label>
                <Input 
                  name="especialidade" 
                  value={formData.especialidade} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Italiana, Frutos do Mar"
                  className="bg-black/50 border-zinc-800 focus:border-amber-500 text-sm h-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">E-mail de Contato</label>
              <Input 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Ex: contato@restaurante.com"
                type="email"
                className="bg-black/50 border-zinc-800 focus:border-amber-500 text-sm h-10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Mensagem Adicional</label>
              <Textarea 
                name="mensagem" 
                value={formData.mensagem} 
                onChange={handleInputChange} 
                placeholder="Diga se possui filiais ou demandas especiais."
                className="bg-black/50 border-zinc-800 focus:border-amber-500 min-h-[80px] text-sm"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-11"
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Solicitar Entrada na Rota Oficial'}
            </Button>
          </form>
        </section>

      </div>
    </div>
  );
}
