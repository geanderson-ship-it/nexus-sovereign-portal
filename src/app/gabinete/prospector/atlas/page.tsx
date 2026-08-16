'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Lock, 
  Search, 
  ChevronLeft, 
  Target, 
  Loader2, 
  Send, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Users, 
  FileText 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Lead {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  linkedin: string;
  empresa: string;
}

export default function AtlasProspectorPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [domain, setDomain] = useState('');
  const [cargo, setCargo] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'SYSTEM: Inicializando modulo Atlas B2B...',
    'SYSTEM: Conectando com a API do Apollo.io...',
    'SYSTEM: Pronto para receber instrucoes de prospecccao.'
  ]);
  
  // Clipboard copy tracker
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // SDR Modal states
  const [isSdrModalOpen, setIsSdrModalOpen] = useState(false);
  const [sdrLead, setSdrLead] = useState<Lead | null>(null);
  const [sdrPhone, setSdrPhone] = useState('5551999799582');
  const [sdrMessage, setSdrMessage] = useState('');
  const [isSendingSdr, setIsSendingSdr] = useState(false);

  // Email Notification modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev, `LOG: ${msg}`]);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setIsSearching(true);
    setLeads([]);
    addLog(`Buscando dominio: ${domain.trim()} com filtro de cargo: ${cargo.trim() || 'Nenhum'}`);

    try {
      const res = await fetch('/api/atlas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          domain: domain.trim(),
          title: cargo.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro desconhecido ao buscar leads.');
      }

      if (data.leads && data.leads.length > 0) {
        setLeads(data.leads);
        addLog(`Busca concluida. Encontrados ${data.leads.length} decisores.`);
        toast({
          title: 'Prospecccao Concluida',
          description: `Encontrados ${data.leads.length} leads corporativos.`
        });
      } else {
        addLog('A API do Apollo nao retornou nenhum lead para estes criterios.');
        toast({
          title: 'Nenhum lead encontrado',
          description: 'Verifique o dominio e os filtros de cargo.',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      addLog(`Erro na busca: ${error.message}`);
      toast({
        title: 'Erro de conexao',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    toast({
      title: 'Copiado!',
      description: 'E-mail copiado para a area de transferencia.'
    });
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Open SDR modal
  const openSdrModal = (lead: Lead) => {
    setSdrLead(lead);
    setSdrPhone('5551999799582'); // Default target contact number
    setSdrMessage(
      `Ola ${lead.nome}, sou a Isadora da Nexus Holding Group. Vi seu perfil como ${lead.cargo} na empresa ${lead.empresa} e identifiquei uma excelente oportunidade para otimizarmos a comunicacao e os processos da sua operacao. Podemos conversar por 5 minutos?`
    );
    setIsSdrModalOpen(true);
  };

  // Send SDR WhatsApp dispatch
  const handleSendSdr = async () => {
    if (!sdrLead) return;
    setIsSendingSdr(true);
    addLog(`Acionando SDR Isadora para ${sdrLead.nome} no numero ${sdrPhone}...`);

    try {
      const res = await fetch('/api/atlas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_isadora',
          phone: sdrPhone.replace(/\D/g, ''),
          message: sdrMessage
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao acionar a SDR.');

      addLog(`Isadora confirmou o envio para ${sdrLead.nome}.`);
      toast({
        title: 'SDR Acionada!',
        description: 'A mensagem ativa do WhatsApp foi disparada pela Isadora.'
      });
      setIsSdrModalOpen(false);
    } catch (err: any) {
      addLog(`Erro ao acionar SDR: ${err.message}`);
      toast({
        title: 'Erro SDR',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setIsSendingSdr(false);
    }
  };

  // Open Email Notification modal
  const openEmailModal = () => {
    if (leads.length === 0) return;
    const dateStr = new Date().toLocaleDateString('pt-BR');
    setEmailSubject(`Relatorio de leads extraidos do dominio ${domain} - ${dateStr}`);
    setIsEmailModalOpen(true);
  };

  // Send Email Notification
  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    addLog('Formatando e enviando relatorio B2B para a diretoria da Nexus...');

    const tableRows = leads.map(l => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px; font-weight: bold;">${l.nome}</td>
        <td style="padding: 8px; color: #555;">${l.cargo}</td>
        <td style="padding: 8px;"><a href="mailto:${l.email}">${l.email}</a></td>
        <td style="padding: 8px;"><a href="${l.linkedin}">LinkedIn</a></td>
        <td style="padding: 8px; color: #777;">${l.empresa}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h3>Relatorio de Prospecccao Atlas B2B</h3>
      <p>Ola Diretoria, o Atlas extraiu com sucesso a lista de leads decisores abaixo para a empresa <strong>${domain}</strong>.</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: sans-serif;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th align="left">Nome</th>
            <th align="left">Cargo</th>
            <th align="left">E-mail</th>
            <th align="left">LinkedIn</th>
            <th align="left">Empresa</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <p>Gerado de forma autonoma pelo sistema de inteligencia corporativa da Nexus Holding Group.</p>
    `;

    try {
      const res = await fetch('/api/atlas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_ivoni',
          subject: emailSubject,
          htmlContent
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar relatorio.');

      addLog('Relatorio enviado por e-mail para a diretora Ivoni e o Gean.');
      toast({
        title: 'Relatorio Enviado!',
        description: 'Os leads foram despachados para a diretoria via e-mail.'
      });
      setIsEmailModalOpen(false);
    } catch (err: any) {
      addLog(`Erro ao despachar relatorio: ${err.message}`);
      toast({
        title: 'Erro E-mail',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-primary/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Autenticando Atlas</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-4 relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-prospector-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover opacity-15"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-[#080b10]/90 backdrop-blur-md" />
        
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Back and Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <Link href="/gabinete/prospector">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-cyan-400">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <Target className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-headline text-white tracking-wide">Atlas B2B</h1>
              <p className="text-slate-400">Painel de Prospecccao e Captura de Decisores</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Controls Console */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-950/70 border-slate-800 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white font-headline text-lg flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" /> Parametros de Busca
                </CardTitle>
                <CardDescription>
                  Insira o dominio corporativo para iniciar a varredura.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-slate-300">Domínio da Empresa</Label>
                    <Input
                      id="domain"
                      placeholder="ex: ambev.com.br"
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500"
                      disabled={isSearching}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargo" className="text-slate-300">Cargo Alvo (Opcional)</Label>
                    <Input
                      id="cargo"
                      placeholder="ex: CEO, Diretor"
                      value={cargo}
                      onChange={e => setCargo(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500"
                      disabled={isSearching}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider"
                    disabled={isSearching || !domain.trim()}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Varrendo Base...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" /> Buscar Decisores B2B
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Real-time terminal log */}
            <Card className="bg-black/80 border-slate-900 font-mono text-xs">
              <CardHeader className="py-3 px-4 border-b border-slate-900 bg-slate-950/90">
                <CardTitle className="text-slate-400 font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  Console Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                {consoleLogs.map((log, i) => (
                  <div key={i} className="text-slate-400 leading-relaxed">
                    <span className="text-cyan-500">&gt;</span> {log}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-950/70 border-slate-800 backdrop-blur-md h-full min-h-[500px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white font-headline text-lg">Decisores Encontrados</CardTitle>
                  <CardDescription>Lista de e-mails corporativos extraidos.</CardDescription>
                </div>
                {leads.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={openEmailModal}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Enviar Relatorio
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {leads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-20 text-slate-500 text-sm">
                    <Target className="w-12 h-12 mb-4 text-slate-700" />
                    Nenhum dado carregado na tabela de prospecccao.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-900/50">
                        <TableRow className="border-slate-800">
                          <TableHead className="text-slate-400 font-bold">Nome</TableHead>
                          <TableHead className="text-slate-400 font-bold">Cargo</TableHead>
                          <TableHead className="text-slate-400 font-bold">E-mail</TableHead>
                          <TableHead className="text-slate-400 font-bold text-center">LinkedIn</TableHead>
                          <TableHead className="text-slate-400 font-bold text-right">Acoes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id} className="border-slate-900 hover:bg-slate-900/20">
                            <TableCell className="font-semibold text-white">{lead.nome}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                {lead.cargo}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-300">{lead.email}</span>
                                {lead.email !== 'E-mail oculto/nao encontrado' && (
                                  <button 
                                    onClick={() => copyToClipboard(lead.email)}
                                    className="text-slate-500 hover:text-white"
                                  >
                                    {copiedEmail === lead.email ? (
                                      <Check className="w-3.5 h-3.5 text-green-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {lead.linkedin ? (
                                <a 
                                  href={lead.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex text-cyan-400 hover:text-cyan-300"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                                onClick={() => openSdrModal(lead)}
                              >
                                <Send className="w-3 h-3 mr-1" /> Isadora
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>

      </div>

      {/* SDR WhatsApp Dispatch Modal */}
      <Dialog open={isSdrModalOpen} onOpenChange={setIsSdrModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-headline flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" /> Acionar SDR Isadora
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Personalize a abordagem inicial do WhatsApp para este lead.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sdrPhone" className="text-slate-300">WhatsApp do Destinatario</Label>
              <Input
                id="sdrPhone"
                value={sdrPhone}
                onChange={e => setSdrPhone(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                disabled={isSendingSdr}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sdrMsg" className="text-slate-300">Mensagem Inicial (SDR)</Label>
              <textarea
                id="sdrMsg"
                rows={5}
                value={sdrMessage}
                onChange={e => setSdrMessage(e.target.value)}
                className="w-full rounded-md bg-slate-955 border border-slate-700 text-white p-2 text-sm focus:border-cyan-500 focus:outline-none"
                style={{ backgroundColor: '#020617' }}
                disabled={isSendingSdr}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setIsSdrModalOpen(false)}
              className="text-slate-400 hover:text-white"
              disabled={isSendingSdr}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSendSdr} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
              disabled={isSendingSdr || !sdrPhone.trim()}
            >
              {isSendingSdr ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                'Disparar Mensagem'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Notification Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-headline flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" /> Despachar para Diretoria
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Confirmar envio da lista de leads para a caixa de e-mail de Ivoni e Gean.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emailSubj" className="text-slate-300">Assunto do E-mail</Label>
              <Input
                id="emailSubj"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                disabled={isSendingEmail}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setIsEmailModalOpen(false)}
              className="text-slate-400 hover:text-white"
              disabled={isSendingEmail}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSendEmail} 
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
              disabled={isSendingEmail || !emailSubject.trim()}
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Despachando...
                </>
              ) : (
                'Enviar Relatorio'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
