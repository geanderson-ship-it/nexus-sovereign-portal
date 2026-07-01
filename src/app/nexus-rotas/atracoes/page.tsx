'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Palmtree,
  ArrowLeft,
  CheckCircle,
  Compass,
  Map,
  Ticket,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function NexusRotasAtracoesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    atracao: '',
    tipo: '',
    mensagem: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp || !formData.atracao) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Por favor, preencha seu Nome, WhatsApp e a Atração/Serviço.'
      });
      return;
    }

    const msg = `Olá! Tenho interesse no Guia de Atrações Nexus.%0A%0A*Nome:* ${formData.nome}%0A*WhatsApp:* ${formData.whatsapp}%0A*Atração:* ${formData.atracao}%0A*Tipo:* ${formData.tipo || 'Não informado'}%0A*E-mail:* ${formData.email || 'Não informado'}%0A*Mensagem:* ${formData.mensagem || 'Não informado'}`;
    window.open(`https://wa.me/5551999799582?text=${msg}`, '_blank');
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pt-28 pb-20">

      {/* === FULL PAGE BACKGROUND: Tropical Coastline === */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/atracoes-bg.png"
          alt="Vista panorâmica do litoral tropical com iates"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-pink-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link href="/nexus-rotas" className="inline-flex items-center gap-2 text-zinc-400 hover:text-pink-400 text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Painel Rotas
          </Link>
        </div>

        {/* HERO CARD */}
        <section className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden mb-16 shadow-[0_0_80px_rgba(236,72,153,0.25)] border border-pink-500/20 min-h-[700px] sm:min-h-[820px] flex flex-col bg-black/30 backdrop-blur-sm">

          {/* FOREGROUND CONTENT */}
          <div className="relative z-20 flex flex-col items-center text-center px-6 pt-14 pb-8 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-400/50 bg-pink-950/60 text-pink-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-[0_0_20px_rgba(236,72,153,0.3)] backdrop-blur-sm">
              <Palmtree className="w-4 h-4" />
              Lazer e Atrações Turísticas
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl font-black tracking-tight leading-none text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)] mb-3">
              GUIA DE ATRAÇÕES
            </h1>

            <p className="text-pink-300 font-bold uppercase tracking-[0.2em] text-sm drop-shadow-md mb-5">
              Roteiros Inteligentes, Mapas de GPS e Venda de Bilheteria
            </p>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl drop-shadow mb-8">
              Aumente a sua bilheteria indicando o seu passeio de lancha, escuna, museu ou parque de diversões. A nossa IA traça roteiros com base no perfil de cada hóspede nos hotéis parceiros da cidade.
            </p>

            {/* FOREGROUND IMAGE: AI Attraction */}
            <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-pink-400/30 shadow-[0_0_50px_rgba(236,72,153,0.35)] backdrop-blur-sm group">
              <Image
                src="/images/atracoes-ai-attraction.png"
                alt="Turistas visualizando interface holográfica de IA sobre a roda gigante e iates"
                width={1200}
                height={600}
                className="w-full h-[320px] sm:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-white font-black text-sm uppercase tracking-widest drop-shadow">Visão Estruturada por IA</span>
                  <span className="text-pink-300 text-xs font-medium">Bilheteria · Rotas · Tempo Real · AR</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-600/80 border border-pink-400/50 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
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
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">Como a atração ganha visibilidade</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Roteirização e GPS Integrado</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    A IA gera a rota de acesso perfeita e envia as direções de GPS direto para o celular do turista por WhatsApp, garantindo que ele chegue fácil até você.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Venda de Vouchers e Bilheteria</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Permita a compra de ingressos ou reservas antecipadas de passeios direto pela tela interativa do Totem no lobby ou na conversa com a IA.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">Recomendações por Clima e Perfil</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    A IA recomenda o seu passeio de lancha em dias de sol e o seu museu em dias de chuva, maximizando a eficiência de conversão da propaganda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-black/70 p-8 rounded-3xl border border-zinc-700/60 backdrop-blur-md shadow-xl">
            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Credenciamento de Atrações</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Fazemos parcerias com os principais nomes de lazer e entretenimento para manter o ecossistema atrativo e de alto nível para os hóspedes.
            </p>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400 shrink-0" /> Integração de vendas de bilheteria via webhook ou API.</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400 shrink-0" /> Exclusividade contratual para parceiros premium de lazer.</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400 shrink-0" /> Relatórios mensais de audiência e impacto de turistas alcançados.</li>
            </ul>
          </div>
        </section>

        {/* LEAD CAPTURE FORM */}
        <section id="contato-form" className="py-12 border-t border-zinc-800/60 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-headline">Credenciar Minha Atração / Serviço</h2>
            <p className="text-zinc-400 mt-2 text-xs">
              Registre a sua atração ou agência e receba um demonstrativo de integração com o sistema Nexus Rotas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl border border-zinc-700/60 bg-black/70 backdrop-blur-md shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Seu Nome *</label>
                <Input name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome do Diretor/Gestor" className="bg-black/50 border-zinc-800 focus:border-pink-500 text-sm h-10" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">WhatsApp de Contato *</label>
                <Input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="Seu telefone" className="bg-black/50 border-zinc-800 focus:border-pink-500 text-sm h-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Nome da Atração / Serviço *</label>
                <Input name="atracao" value={formData.atracao} onChange={handleInputChange} placeholder="Ex: Passeio de Escuna Pirata" className="bg-black/50 border-zinc-800 focus:border-pink-500 text-sm h-10" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Tipo de Atração</label>
                <Input name="tipo" value={formData.tipo} onChange={handleInputChange} placeholder="Ex: Parque, Passeio Náutico, Museu" className="bg-black/50 border-zinc-800 focus:border-pink-500 text-sm h-10" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">E-mail Comercial</label>
              <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Ex: comercial@atracao.com" type="email" className="bg-black/50 border-zinc-800 focus:border-pink-500 text-sm h-10" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Mensagem Adicional</label>
              <Textarea name="mensagem" value={formData.mensagem} onChange={handleInputChange} placeholder="Nos conte brevemente sobre sua operação e capacidade de atendimento." className="bg-black/50 border-zinc-800 focus:border-pink-500 min-h-[80px] text-sm" />
            </div>

            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold h-11" disabled={loading}>
              {loading ? 'Processando...' : 'Solicitar Credenciamento'}
            </Button>
          </form>
        </section>

      </div>
    </div>
  );
}
