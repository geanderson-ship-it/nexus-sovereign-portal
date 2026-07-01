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
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function NexusRotasHoteisPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    hotel: '',
    quartos: '',
    mensagem: ''
  });

  // ROI Calculator State
  const [rooms, setRooms] = useState(100);
  const [occupancy, setOccupancy] = useState(70);

  const calculateROI = () => {
    const occupiedRoomsPerDay = (rooms * (occupancy / 100));
    const monthlyOccupiedDays = occupiedRoomsPerDay * 30;
    
    const savings = Math.round(monthlyOccupiedDays * 0.5 * 10); // R$ 5 de economia de tempo de staff por dia ocupado
    const commissions = Math.round(monthlyOccupiedDays * 1.5 * 10); // R$ 15 de receita média de indicação/comissão local
    const totalRevenue = savings + commissions;
    
    return {
      savings: savings.toLocaleString('pt-BR'),
      commissions: commissions.toLocaleString('pt-BR'),
      total: totalRevenue.toLocaleString('pt-BR')
    };
  };

  const roi = calculateROI();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const msg = `Olá! Tenho interesse no Nexus Rotas para Hotéis.%0A%0A*Nome:* ${formData.nome}%0A*WhatsApp:* ${formData.whatsapp}%0A*Hotel:* ${formData.hotel}%0A*Quartos:* ${formData.quartos || 'Não informado'}%0A*E-mail:* ${formData.email || 'Não informado'}%0A*Mensagem:* ${formData.mensagem || 'Não informado'}`;
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
          <Link href="/nexus-rotas" className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-400 text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Painel Rotas
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
              ROTAS PARA HOTÉIS
            </h1>

            <p className="text-emerald-300 font-bold uppercase tracking-[0.2em] text-sm drop-shadow-md mb-5">
              Concierge Inteligente, Totens de Lobby e Receita Local Extra
            </p>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl drop-shadow mb-8">
              Proporcione uma experiência de alto luxo 24 horas por dia no WhatsApp e no lobby do seu hotel. Com o Nexus Rotas, você reduz drasticamente o trabalho manual e transforma dúvidas em receita de indicações.
            </p>

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

        {/* DETAILS SECTION */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-800/60 mt-12">
          <div className="p-8 rounded-3xl bg-black/70 border border-zinc-700/60 backdrop-blur-md shadow-xl">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">Como a solução valoriza o seu Hotel</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Atendimento WhastApp 24h (Isadora)</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Sua IA atende os hóspedes no canal de comunicação preferido deles. Sem carregar recepção, entrega informações rápidas de Wi-Fi, horários, e aceita pedidos internos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Totem Físico Interativo no Lobby</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Um recepcionista eletrônico em tela touch e voz natural para tirar dúvidas rápidas sobre praias, parques, rotas e GPS sem criar filas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Parcerias Comerciais Rastreáveis</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    A IA recomenda restaurantes parceiros locais e gera uma receita de comissão para o hotel a cada cliente indicado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-black/70 p-8 rounded-3xl border border-zinc-700/60 backdrop-blur-md shadow-xl">
            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Conectando Hospedagem e Comércio</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Ao unificar o turismo local, a inteligência sabe quais restaurantes estão abertos, quais oferecem benefícios aos hóspedes do seu hotel, e direciona o turista com total segurança e conveniência.
            </p>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Redução de 80% em perguntas operacionais repetitivas.</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Atendimento de turistas em 10+ idiomas de forma nativa.</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Configuração rápida integrada com a infraestrutura AWS da Nexus.</li>
            </ul>
          </div>
        </section>

        {/* ROI CALCULATOR */}
        <section id="calculadora-roi" className="py-12 border-t border-zinc-800/60">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight">Simulador de ROI para Hotéis</h2>
            <p className="text-zinc-400 mt-1">Calcule o retorno estimado de economia e receita de indicação</p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-3xl border border-zinc-700/60 bg-black/70 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span>Quantidade de Quartos:</span>
                  <span className="text-emerald-400">{rooms} Quartos</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10" 
                  value={rooms} 
                  onChange={(e) => setRooms(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span>Ocupação Média Mensal:</span>
                  <span className="text-emerald-400">{occupancy}%</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="100" 
                  step="5" 
                  value={occupancy} 
                  onChange={(e) => setOccupancy(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 shadow-inner">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Economia Operacional:</span>
                  <span className="font-bold text-white">R$ {roi.savings} / mês</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Receita de Indicações:</span>
                  <span className="font-bold text-white">R$ {roi.commissions} / mês</span>
                </div>
                <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-emerald-400">Retorno Total Estimado:</span>
                  <span className="text-2xl font-black text-emerald-400">R$ {roi.total} <span className="text-xs font-normal">/ mês</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD CAPTURE FORM */}
        <section id="contato-form" className="py-12 border-t border-zinc-800/60 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-headline">Solicitar Proposta para meu Hotel</h2>
            <p className="text-zinc-400 mt-2 text-xs">
              Deixe seus contatos e nossa equipe comercial retornará com o escopo personalizado de implantação da Isadora.
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
        </section>

      </div>
    </div>
  );
}
