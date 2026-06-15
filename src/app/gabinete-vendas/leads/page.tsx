'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Loader2, Users, Search, MessageSquare, Phone, Mail, FileText, CheckCircle2, Archive, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'novo' | 'contatado' | 'arquivado';
}

export default function LeadsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isVendasAuth = localStorage.getItem('vendas_auth') === 'true';
    if (!isVendasAuth) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Verificando Credenciais</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 py-12 px-4 bg-slate-950 relative overflow-hidden">
      {/* Background Image with geodemographic glow */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-25 pointer-events-none" 
        style={{ backgroundImage: "url('/nexus-prospector-bg.png')" }} 
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.95)_100%)] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] z-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/gabinete-vendas" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-8 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 hover:border-slate-700/80 hover:scale-102">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o Gabinete
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-headline text-white">Contatos & Leads</h1>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Painel Gerenciador de Oportunidades do Site</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
            <Shield className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Controle Exclusivo Diretoria</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEADS LIST PANEL */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nome, e-mail, empresa ou assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              />
            </div>

            {isLoading ? (
              <Card className="bg-slate-900/30 border-slate-850/80 py-16 flex flex-col items-center justify-center text-slate-550">
                <Loader2 className="w-10 h-10 mb-4 animate-spin text-indigo-500/50" />
                <p className="text-sm font-semibold uppercase tracking-wider">Buscando leads no servidor...</p>
              </Card>
            ) : filteredLeads.length === 0 ? (
              <Card className="bg-slate-900/30 border-slate-850/80 py-16 flex flex-col items-center justify-center text-slate-500">
                <Users className="w-12 h-12 mb-4 text-slate-650" />
                <p className="text-base font-bold text-white mb-1">Nenhum Lead Encontrado</p>
                <p className="text-xs max-w-xs text-center text-slate-400">
                  {searchTerm ? 'Nenhum resultado corresponde à sua pesquisa.' : 'Nenhum contato foi preenchido no site ainda.'}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:scale-[1.01] hover:shadow-lg ${
                      selectedLead?.id === lead.id
                        ? 'bg-indigo-650/10 border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                        : lead.status === 'novo'
                        ? 'bg-slate-900/40 border-indigo-500/20 hover:border-indigo-500/40'
                        : 'bg-slate-900/20 border-slate-850 hover:border-slate-750'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center flex-wrap gap-2.5">
                        <h3 className="font-bold text-white text-base">
                          {lead.firstName} {lead.lastName}
                        </h3>
                        {lead.company && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-350 border border-slate-700/50 px-2 py-0.5 rounded">
                            {lead.company}
                          </span>
                        )}
                        {getStatusBadge(lead.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {lead.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> {lead.phone}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold italic flex items-center gap-1.5 pt-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> Assunto: <span className="text-slate-300 not-italic">{lead.subject}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0 flex sm:flex-col items-end gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-mono text-slate-500 block">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')} {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETAILED VIEW PANEL */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-950/65 backdrop-blur-xl border-slate-800 shadow-2xl h-full flex flex-col">
              <CardHeader className="border-b border-slate-900 pb-5">
                <CardTitle className="text-lg text-white font-headline flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  Detalhes do Contato
                </CardTitle>
                <CardDescription>Dados estruturados de abordagem comercial</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-6 space-y-6">
                {selectedLead ? (
                  <div className="space-y-6 flex flex-col h-full">
                    {/* User Identity Info */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Nome Completo</label>
                        <p className="text-base font-bold text-white">{selectedLead.firstName} {selectedLead.lastName}</p>
                      </div>
                      {selectedLead.company && (
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Empresa / Prefeitura</label>
                          <p className="text-sm font-semibold text-slate-300">{selectedLead.company}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Assunto Requerido</label>
                        <p className="text-sm font-bold text-indigo-400">{selectedLead.subject}</p>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Data de Envio</label>
                        <p className="text-xs text-slate-400 font-mono">
                          {new Date(selectedLead.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-slate-850" />

                    {/* Messages Body */}
                    <div className="flex-1 bg-black/40 border border-slate-900 rounded-2xl p-4 overflow-y-auto max-h-[220px]">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">Mensagem do Lead</label>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {selectedLead.message}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Ações Rápidas de Abordagem</label>
                      
                      {/* WhatsApp Chat link */}
                      <a
                        href={`https://wa.me/${formatPhoneForWhatsapp(selectedLead.phone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-102"
                      >
                        <Phone className="w-4 h-4" />
                        Chamar no WhatsApp
                      </a>

                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all border border-slate-700/60"
                      >
                        <Mail className="w-4 h-4" />
                        Responder por E-mail
                      </a>
                    </div>

                    <div className="h-[1px] w-full bg-slate-850" />

                    {/* Status update buttons */}
                    <div className="space-y-2.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Alterar Status</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => updateLeadStatus(selectedLead.id, 'novo')}
                          className={`text-[9px] font-black uppercase py-1 border ${
                            selectedLead.status === 'novo'
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                              : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Novo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => updateLeadStatus(selectedLead.id, 'contatado')}
                          className={`text-[9px] font-black uppercase py-1 border ${
                            selectedLead.status === 'contatado'
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                              : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Falei
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => updateLeadStatus(selectedLead.id, 'arquivado')}
                          className={`text-[9px] font-black uppercase py-1 border ${
                            selectedLead.status === 'arquivado'
                              ? 'bg-slate-800 border-slate-750 text-slate-300'
                              : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Arquivar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20 text-slate-600 space-y-3">
                    <FileText className="w-10 h-10 text-slate-700 animate-pulse" />
                    <p className="text-xs uppercase font-bold tracking-widest">Nenhum Lead Selecionado</p>
                    <p className="text-[10px] text-slate-500 leading-normal max-w-[150px]">
                      Selecione um contato na lista para ver a mensagem e tomar ações.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
