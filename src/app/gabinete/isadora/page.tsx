import { getHotLeads } from '@/lib/isadora-db';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, TrendingUp, Phone, Star, ShieldAlert, Activity, User } from 'lucide-react';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';
import { getVideoUrl } from '@/lib/video-helper';

export const revalidate = 0; // Impede cache, sempre busca do banco ao recarregar a página

export default async function IsadoraWarRoomPage() {
  let hotLeads = [];
  let dbError = false;

  try {
    hotLeads = await getHotLeads(20);
  } catch (error) {
    // Falha silenciosa para fallback do DB Mock. Evita overlay de erro no Next.js Dev.
    dbError = true;
  }

  // Inject a mock lead if the DB is empty or fails, for visual demonstration
  if (hotLeads.length === 0) {
    hotLeads = [
      {
        phone: '5511999999999',
        niche: 'Rede de Hotéis de Luxo',
        purchaseIntention: 9,
        lastInteraction: new Date().toISOString(),
        history: [
          { role: 'user', content: 'Gostaria de orçar o pacote completo da Nexus para a nossa rede.', timestamp: new Date().toISOString() },
          { role: 'assistant', content: 'Perfeito! Vejo que a sua rede possui um alto padrão. Encaminhei suas informações para o nosso Diretor fechar essa negociação especial.', timestamp: new Date().toISOString() }
        ]
      },
      {
        phone: '5521988888888',
        niche: 'Agronegócio (Soja)',
        purchaseIntention: 8,
        lastInteraction: new Date(Date.now() - 3600000).toISOString(),
        history: [
          { role: 'user', content: 'Preciso do Pactum para blindar minhas negociações de safra.', timestamp: new Date().toISOString() }
        ]
      }
    ];
  }

  return (
    <div className="min-h-screen bg-[#0f0700] text-slate-200 p-8 space-y-12 relative overflow-hidden pt-24">
      {/* GABINETE ACTIVE CORE BACKGROUND (MAGADOT/ORION STYLE) - INTENSIFICADO */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0f0700]">
          {/* Pontilhados mais visíveis */}
          <div className="absolute inset-0 bg-[radial-gradient(#eab308_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-20" />
          
          {/* Brilhos centrais mais fortes e intensos */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-amber-600/25 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-yellow-500/25 blur-[80px] rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          
          {/* Anéis orbitais mais brilhantes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border-[2px] border-amber-500/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border-[2px] border-yellow-500/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border-[2px] border-amber-400/40 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-overlay" />
      </div>  
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* BOTÃO VOLTAR */}
        <div className="relative z-10 mb-4">
          <Link 
            href="/gabinete" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors uppercase font-mono text-[10px] tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-sm w-fit"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar ao Command Center
          </Link>
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.15)] relative z-10 overflow-hidden">
                <Image src="/Vendedora Nexus/Isadora Nexus.png" alt="Isadora" fill className="object-cover object-[center_30%] opacity-80 mix-blend-luminosity" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#020617] z-20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10 uppercase tracking-widest text-[10px] font-mono">
                  Isadora OS
                </Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono uppercase tracking-wider">
                  <Activity className="w-3 h-3 text-emerald-500" /> Operante
                </span>
              </div>
              <h1 className="text-4xl font-headline font-bold text-white tracking-tight">War Room de Vendas</h1>
              <p className="text-slate-400 mt-1 max-w-xl">Monitoramento tático de Hot Leads e conversões da executiva Isadora.</p>
            </div>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 min-w-[140px] text-center backdrop-blur-sm">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-1">Leads Quentes</p>
              <p className="text-3xl font-bold text-white">{hotLeads.length}</p>
            </div>
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 min-w-[140px] text-center backdrop-blur-sm shadow-[0_0_20px_rgba(245,158,11,0.05)]">
              <p className="text-xs text-amber-500/70 uppercase tracking-widest font-mono mb-1">Status Z-API</p>
              <p className="text-sm font-bold text-amber-400 mt-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Conectado
              </p>
            </div>
            <Link
              href="/gabinete/isadora/contatos"
              className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 rounded-xl p-4 min-w-[140px] text-center backdrop-blur-sm transition-all group"
            >
              <p className="text-xs text-amber-500/70 uppercase tracking-widest font-mono mb-1">Lista de Contatos</p>
              <p className="text-sm font-bold text-amber-400 mt-2 flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                Prospectar →
              </p>
            </Link>
          </div>
        </div>


        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* VÍDEO / STATUS DA ISADORA */}
          <div className="space-y-6">
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md overflow-hidden">
              <CardHeader className="border-b border-slate-800/50 pb-4 bg-slate-900/60">
                <CardTitle className="text-lg text-white font-headline flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" /> Transmissão Operacional
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black">
                  <CustomVideoPlayer 
                    src={getVideoUrl("https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Isadora_Executiva_em_vendas_Nexus_holding_Group.mp4", "Isadora_Executiva_em_vendas_Nexus_holding_Group.mp4")} 
                    title="Isadora - Transmissão Operacional" 
                    accentColor="#f59e0b"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-black/50 backdrop-blur text-amber-400 border border-amber-500/30 font-mono text-[9px] uppercase tracking-widest">
                      Live
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-sm text-slate-300 font-headline uppercase tracking-widest">Instruções de Handoff</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A Isadora está configurada para filtrar curiosos. Ela só irá alertar o Comandante (via WhatsApp pessoal) e enviar o lead para esta lista quando detectar <strong>Intenção de Compra Nível 8 ou superior</strong> (High-Ticket).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* LISTA DE LEADS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold text-white">Leads de Alta Prioridade (Hot)</h2>
            </div>

            <div className="grid gap-4">
              {hotLeads.map((lead: any, i: number) => (
                <Card key={i} className="bg-slate-900/60 border-slate-800 hover:border-amber-500/30 transition-colors backdrop-blur-md overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/50" />
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                          <User className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            +{lead.phone}
                          </h3>
                          <p className="text-sm text-slate-400 flex items-center gap-2 font-mono uppercase tracking-widest mt-1">
                            <span className="text-amber-500">{lead.niche || 'Nicho Desconhecido'}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-[#020617] px-4 py-2 rounded-lg border border-slate-800">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Score de Compra</p>
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            {Array.from({ length: 10 }).map((_, idx) => (
                              <Star 
                                key={idx} 
                                className={`w-3 h-3 ${idx < (lead.purchaseIntention || 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-700'}`} 
                              />
                            ))}
                            <span className="text-amber-500 font-bold ml-2 text-sm">{lead.purchaseIntention}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#020617]/50 rounded-xl p-4 border border-slate-800/50 space-y-3">
                      <p className="text-xs uppercase tracking-widest font-mono text-slate-500 border-b border-slate-800 pb-2">Último Histórico de Conversa</p>
                      {lead.history && lead.history.slice(-2).map((msg: any, idx: number) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            msg.role === 'user' 
                              ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' 
                              : 'bg-amber-950/30 text-amber-200 rounded-tr-none border border-amber-500/20'
                          }`}>
                            <span className="block text-[10px] opacity-50 mb-1 font-mono uppercase">
                              {msg.role === 'user' ? 'Cliente' : 'Isadora'}
                            </span>
                            {typeof msg.content === 'string' ? msg.content : 'Mensagem estruturada (Bedrock)'}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                        <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30 px-4 py-2 cursor-pointer transition-colors">
                          <Phone className="w-4 h-4 mr-2" /> Assumir Negociação no WhatsApp
                        </Badge>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
