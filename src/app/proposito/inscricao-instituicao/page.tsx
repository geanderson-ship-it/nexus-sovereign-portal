'use client';

import React, { useState } from 'react';


import { Button } from '@/components/ui/button';
import { Building2, FileText, Mail, Phone, User, CheckCircle2, ArrowLeft, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function InscricaoInstituicaoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui no futuro integraremos com o backend (API / Banco de Dados / Notificação para a Magadot)
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 selection:bg-rose-500/30 relative">
      {/* BACKGROUND DA AURORA */}
      <div 
        className="fixed inset-0 z-0 opacity-50 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/bg-aurora-v2.png")' }}
      />
      {/* OVERLAY PARA GARANTIR LEITURA */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#05080f]/60 via-[#05080f]/10 to-[#05080f]/90 pointer-events-none" />

      <div className="relative z-10">

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          
          <Link href="/proposito" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Social
          </Link>

          {!isSubmitted ? (
            <div className="bg-[#0b101a] border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-bl-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-tr-full blur-[80px] pointer-events-none" />
              
              <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
                  <Building2 className="w-8 h-8 text-rose-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-white mb-3">
                  Inscrição Oficial da <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-blue-500">Instituição</span>
                </h1>
                <p className="text-slate-400">
                  Preencha os dados abaixo com cautela. A nossa IA Auditora avaliará os dados públicos do CNPJ para garantir que a instituição cumpre todos os critérios de Elegibilidade da Nexus.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Razão Social</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="Nome oficial no CNPJ" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Nome Fantasia</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Como o local é conhecido" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">CNPJ (Ficha Limpa)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="00.000.000/0000-00" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Natureza da Instituição</label>
                    <select 
                      required
                      className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors appearance-none"
                    >
                      <option value="">Selecione a natureza do local...</option>
                      <option value="publica_idosos">Pública / Filantrópica (Idosos) - 100% Subsídio</option>
                      <option value="publica_criancas">Pública / Filantrópica (Crianças) - 100% Subsídio</option>
                      <option value="privada_idosos">Privada (Idosos) - Elegível a 50% de Desconto</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Responsável Legal</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="Nome completo do diretor(a)" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Telefone / WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="tel" 
                        required
                        placeholder="(00) 00000-0000" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">E-mail Institucional</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input 
                      type="email" 
                      required
                      placeholder="diretoria@instituicao.org" 
                      className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Por que a sua instituição precisa do Projeto Inteligência com Alma?</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Conte-nos brevemente sobre as pessoas que vocês acolhem e como nossos avatares (IAs) trariam alento para elas..." 
                    className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 space-y-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-slate-700 bg-[#0f141f] text-rose-500 focus:ring-rose-500" />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      Declaro, sob pena de falsidade ideológica e sanções legais cabíveis, que todas as informações prestadas neste formulário — incluindo a verdadeira natureza pública ou privada da instituição — são estritamente verdadeiras.
                    </span>
                  </label>

                  <div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-blue-600 hover:from-rose-500 hover:to-blue-500 text-white font-bold h-14 rounded-xl text-lg shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all">
                      Enviar Inscrição para Auditoria
                    </Button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                      Ao enviar, você autoriza a checagem rigorosa de Ficha Limpa pela IA Auditora da Nexus Holding Group.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#0b101a] border border-emerald-900/30 rounded-3xl p-10 text-center shadow-2xl">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Inscrição Recebida!</h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto mb-8">
                Os dados da instituição foram encaminhados para a nossa IA Auditora (Magadot). Faremos a verificação de elegibilidade e entraremos em contato pelo e-mail ou WhatsApp informados.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                Enviar Outra Inscrição
              </Button>
            </div>
          )}

        </div>
      </main>
      </div>
    </div>
  );
}
