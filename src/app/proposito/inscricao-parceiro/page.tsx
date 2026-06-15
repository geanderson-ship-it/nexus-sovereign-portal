'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Mail, Phone, User, CheckCircle2, ArrowLeft, HeartHandshake, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function InscricaoParceiroPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "0694c45e-00fa-445e-a06d-3f61973ef4c7"); 
    formData.append("subject", "Novo Padrinho Corporativo - Inteligência com Alma");
    formData.append("from_name", "Portal Nexus Social");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        alert("Ops! Ocorreu um erro ao enviar a inscrição. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 selection:bg-blue-500/30 relative">
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-bl-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-tr-full blur-[80px] pointer-events-none" />
              
              <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                  <Briefcase className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-white mb-3">
                  Inscrição de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-500">Parceiro Corporativo</span>
                </h1>
                <p className="text-slate-400">
                  Adote uma entidade. Sua empresa financiará as horas de conexão e ganhará o selo ESG da Nexus, além de receber os relatórios de impacto mensal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Razão Social da Empresa</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <input 
                      type="text" 
                      name="razao_social"
                      required
                      placeholder="Nome oficial no CNPJ" 
                      className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Nome Fantasia</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="text" 
                        name="nome_fantasia"
                        required
                        placeholder="Nome como a empresa é conhecida" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">CNPJ</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="text" 
                        name="cnpj"
                        required
                        placeholder="Para fins de faturamento e NF" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Responsável Legal / ESG</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="text" 
                        name="responsavel_esg"
                        required
                        placeholder="Nome do diretor ou responsável" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">E-mail Corporativo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="email" 
                        name="email_corporativo"
                        required
                        placeholder="seu.nome@empresa.com.br" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Telefone corporativo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-500" />
                      </div>
                      <input 
                        type="tel" 
                        name="telefone_corporativo"
                        required
                        placeholder="(00) 00000-0000" 
                        className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Nível de Impacto Desejado</label>
                    <select 
                      required
                      className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                    >
                      <option value="">Selecione o interesse de apadrinhamento...</option>
                      <option value="asilo_1">Adotar 1 Asilo/Casa de Repouso</option>
                      <option value="orfanato_1">Adotar 1 Orfanato</option>
                      <option value="multiplos">Desejo apadrinhar múltiplos locais</option>
                      <option value="conversar">Quero entender os custos com a Diretoria primeiro</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Por que a sua empresa deseja se tornar madrinha?</label>
                  <textarea 
                    rows={3}
                    placeholder="Conte-nos brevemente o que motivou a sua empresa a investir na sanidade mental de quem foi esquecido..." 
                    className="w-full bg-[#0f141f] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 space-y-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-slate-700 bg-[#0f141f] text-blue-500 focus:ring-blue-500" />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      Compreendo que a métrica de custeio é baseada estritamente no uso da infraestrutura tecnológica e concordo em receber os relatórios de impacto mensal com exclusividade e sigilo no meu e-mail corporativo.
                    </span>
                  </label>

                  <div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold h-14 rounded-xl text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all">
                      Solicitar Apadrinhamento
                    </Button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                      A nossa Diretoria Executiva analisará o perfil da sua empresa e entrará em contato para alinhar os valores exatos da entidade adotada.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#0b101a] border border-blue-900/30 rounded-3xl p-10 text-center shadow-2xl">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
                <CheckCircle2 className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Interesse Registrado!</h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto mb-8">
                Agradecemos profundamente o interesse da sua empresa em financiar o afeto. Nossa diretoria entrará em contato com você pelo e-mail ou WhatsApp corporativo informados para apresentar a instituição que sua empresa apadrinhará.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                Voltar
              </Button>
            </div>
          )}

        </div>
      </main>
      </div>
    </div>
  );
}
