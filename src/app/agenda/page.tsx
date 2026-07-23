'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Users, BookOpen, CheckCircle2, Shield, CalendarDays, Laptop, Clipboard, Check, Phone } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import Image from 'next/image';

interface AgendaItem {
  id: number;
  evento: string;
  data: string;
  horario: string;
  local: string;
  anfitriao: string;
  assunto: string;
  observacoes: string;
  status: string;
  desfecho?: string;
}

export default function PublicSchedulerPage() {
  const [step, setStep] = useState<'schedule' | 'success'>('schedule');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [assunto, setAssunto] = useState('');
  
  const [existingEvents, setExistingEvents] = useState<AgendaItem[]>([]);
  const [generatedMeetLink, setGeneratedMeetLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreFilled, setIsPreFilled] = useState(false);

  // Carregar os agendamentos existentes do banco de dados compartilhado (API) para ver disponibilidade
  useEffect(() => {
    fetch('/api/agenda')
      .then(res => res.json())
      .then(data => {
        if (data && data.appointments) {
          setExistingEvents(data.appointments);
        }
      })
      .catch(err => {
        console.error("Falha ao carregar agenda compartilhada. Usando fallback de localStorage...", err);
        const saved = localStorage.getItem('nexus_agenda_v3');
        if (saved) {
          try {
            setExistingEvents(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      });
  }, []);

  // Preencher campos automaticamente se houver parâmetros na URL (link customizado do convite)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlEmail = searchParams.get('email') || '';
      const urlName = searchParams.get('name') || '';
      const urlCompany = searchParams.get('company') || '';
      const urlPhone = searchParams.get('phone') || '';
      
      const urlSubject = searchParams.get('subject') || searchParams.get('product') || searchParams.get('assunto') || '';
      
      if (urlEmail) setEmail(urlEmail);
      if (urlName) setNome(urlName);
      if (urlCompany) setEmpresa(urlCompany);
      if (urlPhone) setWhatsapp(urlPhone);
      if (urlSubject) setAssunto(urlSubject);

      if (urlEmail || urlName) {
        setIsPreFilled(true);
      }
    }
  }, []);

  // Lista de horários de 1 hora entre 09:00 e 19:00
  const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Helper para verificar se um horário em um determinado dia está ocupado
  const isSlotTaken = (dateStr: string, timeStr: string) => {
    if (!dateStr) return false;
    const [year, month, day] = dateStr.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    return existingEvents.some(
      event => event.data === formattedDate && event.horario === timeStr
    );
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !nome || !email || !whatsapp || !empresa) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          whatsapp,
          empresa,
          assunto,
          data: selectedDate,
          horario: selectedTime
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao realizar agendamento.");
      }

      const resData = await response.json();
      
      if (resData.success) {
        setGeneratedMeetLink(resData.meetLink);
        setExistingEvents(prev => [...prev, resData.appointment]);
        
        // Também atualiza localStorage local por segurança/redundância
        try {
          const saved = localStorage.getItem('nexus_agenda_v3');
          const localList = saved ? JSON.parse(saved) : [];
          localList.push(resData.appointment);
          localStorage.setItem('nexus_agenda_v3', JSON.stringify(localList));
        } catch(e) {}

        setStep('success');
      } else {
        throw new Error(resData.error || "Erro desconhecido.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Falha ao realizar agendamento: ${err.message || 'Erro de comunicação com o servidor'}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedMeetLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Obter o dia seguinte como data mínima para o input date
  const getMinDateString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getTestMeetLink = (url: string) => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return url.replace('https://nexustreinamento.com', 'http://localhost:3000');
    }
    return url;
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans flex flex-col items-center justify-center p-4 md:p-8 relative bg-[#060401] overflow-hidden">
      
      {/* Background Cyber Tech Grid com Brilhos Dourados (Aesthetic Nexus Gold) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-amber-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 my-8">
        
        {/* LOGO E TÍTULO */}
        <div className="flex flex-col items-center text-center mb-8 space-y-4">
          <Image 
            src="/nexus-holding-group-logo.jpg" 
            alt="Nexus Holding Group Logo" 
            width={672} 
            height={220} 
            className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(59,130,246,0.4)] rounded-3xl border border-blue-500/10 shadow-[0_0_40px_rgba(37,99,235,0.2)]"
            priority
          />
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-wide text-white">
              Agendamento Soberano
            </h1>
            <p className="text-xs text-amber-500 uppercase tracking-widest font-bold">
              Nexus Holding Group
            </p>
          </div>
        </div>

        {step === 'schedule' ? (
          <Card className="bg-black/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.05)] overflow-hidden">
            
            {/* Header decorativo da carta */}
            <div className="h-1.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 w-full" />

            <CardContent className="p-6 md:p-10 space-y-6">
              
              <div className="border-b border-slate-800/80 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-amber-400" />
                  Reserve sua Reunião Virtual
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Escolha uma data e horário livres para uma demonstração exclusiva de 1 hora de nossas ferramentas diretamente com a nossa diretoria.
                </p>
              </div>

              <form onSubmit={handleConfirmSchedule} className="space-y-6">
                
                {/* 1. SELEÇÃO DE DATA E HORA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">1. Escolha a Data</label>
                    <input
                      type="date"
                      required
                      min={getMinDateString()}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(''); // Reseta horário ao mudar data
                      }}
                      className="w-full bg-slate-950/85 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">2. Horários Disponíveis (1 Hora)</label>
                    {selectedDate ? (
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((time) => {
                          const taken = isSlotTaken(selectedDate, time);
                          const isSelected = selectedTime === time;

                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={taken}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 px-1 rounded-lg text-xs font-bold font-mono transition-all border ${
                                taken 
                                  ? 'bg-slate-950/40 text-slate-600 border-slate-900/30 line-through opacity-30 cursor-not-allowed pointer-events-none'
                                  : isSelected
                                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-750 hover:bg-slate-900'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full min-h-[70px] flex items-center justify-center border border-dashed border-slate-800/80 rounded-xl bg-slate-950/30 text-xs text-slate-500 italic">
                        Selecione a data primeiro
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. DADOS DO CLIENTE */}
                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  {isPreFilled ? (
                    <div className="space-y-3 p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/20 backdrop-blur-md">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">3. Identificação Sincronizada</span>
                        <button 
                          type="button" 
                          onClick={() => setIsPreFilled(false)} 
                          className="text-[9px] text-slate-500 hover:text-amber-400 underline uppercase tracking-wider font-bold animate-pulse"
                        >
                          Editar Dados
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Nome</span>
                          <span className="text-white font-semibold">{nome}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block">E-mail</span>
                          <span className="text-white font-mono">{email}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Empresa/Município</span>
                          <span className="text-white font-semibold">{empresa || 'Não informada'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block">WhatsApp</span>
                          <span className="text-white font-mono">{whatsapp || 'Não informado'}</span>
                        </div>
                      </div>
                      <div className="space-y-1 pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assunto de Maior Interesse (Selecione o Produto)</span>
                        <select
                          required
                          value={assunto}
                          onChange={(e) => setAssunto(e.target.value)}
                          className="bg-slate-950/85 border border-slate-800 text-white rounded-xl w-full h-11 px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all cursor-pointer"
                        >
                          <option value="" disabled className="bg-slate-950 text-slate-500">Selecione o produto de interesse</option>
                          <option value="Inova Moda" className="bg-slate-950 text-white">Inova Moda</option>
                          <option value="Inova Revenda" className="bg-slate-950 text-white">Inova Revenda</option>
                          <option value="Vitrine Inovadora" className="bg-slate-950 text-white">Vitrine Inovadora</option>
                          <option value="Embaixadora Virtual" className="bg-slate-950 text-white">Embaixadora Virtual</option>
                          <option value="Nexus Energy" className="bg-slate-950 text-white">Nexus Energy</option>
                          <option value="Enterprise" className="bg-slate-950 text-white">Enterprise</option>
                          <option value="Nexus Health" className="bg-slate-950 text-white">Nexus Health</option>
                          <option value="Dante Safra" className="bg-slate-950 text-white">Dante Safra</option>
                          <option value="Intelligence Premium" className="bg-slate-950 text-white">Intelligence Premium</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">3. Suas Credenciais e Contato</label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Seu Nome Completo</span>
                          <Input
                            required
                            type="text"
                            placeholder="Ex: Gilberto Schumann"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="bg-slate-950/85 border-slate-800 text-white rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">E-mail Corporativo</span>
                          <Input
                            required
                            type="email"
                            placeholder="nome@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-950/85 border-slate-800 text-white rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">WhatsApp de Contato</span>
                          <Input
                            required
                            type="tel"
                            placeholder="(51) 99999-9999"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="bg-slate-950/85 border-slate-800 text-white rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nome da Empresa / Município</span>
                          <Input
                            required
                            type="text"
                            placeholder="Prefeitura ou Nome da Empresa"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            className="bg-slate-950/85 border-slate-800 text-white rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assunto de Maior Interesse (Selecione o Produto)</span>
                        <select
                          required
                          value={assunto}
                          onChange={(e) => setAssunto(e.target.value)}
                          className="bg-slate-950/85 border border-slate-800 text-white rounded-xl w-full h-11 px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all cursor-pointer"
                        >
                          <option value="" disabled className="bg-slate-950 text-slate-500">Selecione o produto de interesse</option>
                          <option value="Inova Moda" className="bg-slate-950 text-white">Inova Moda</option>
                          <option value="Inova Revenda" className="bg-slate-950 text-white">Inova Revenda</option>
                          <option value="Vitrine Inovadora" className="bg-slate-950 text-white">Vitrine Inovadora</option>
                          <option value="Embaixadora Virtual" className="bg-slate-950 text-white">Embaixadora Virtual</option>
                          <option value="Nexus Energy" className="bg-slate-950 text-white">Nexus Energy</option>
                          <option value="Enterprise" className="bg-slate-950 text-white">Enterprise</option>
                          <option value="Nexus Health" className="bg-slate-950 text-white">Nexus Health</option>
                          <option value="Dante Safra" className="bg-slate-950 text-white">Dante Safra</option>
                          <option value="Intelligence Premium" className="bg-slate-950 text-white">Intelligence Premium</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold py-6 rounded-xl shadow-lg shadow-amber-500/10 transition-transform duration-300 hover:scale-[1.01] active:scale-95 text-sm uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processando Agendamento...' : 'Confirmar e Gerar Link da Reunião'}
                  </Button>
                </div>

              </form>

            </CardContent>
          </Card>
        ) : (
          <Card className="bg-black/60 border border-emerald-500/20 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.05)] overflow-hidden">
            
            <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 w-full animate-pulse" />

            <CardContent className="p-6 md:p-10 text-center space-y-6">
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white font-headline">Reunião Agendada com Sucesso!</h2>
                <p className="text-xs text-slate-400 max-w-md">
                  Olá, <strong className="text-emerald-400">{nome}</strong>! Seu compromisso está registrado e sincronizado no radar da diretoria.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto">
                <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest border-b border-slate-900 pb-2">Detalhes da Reunião</h3>
                
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    Data: <strong className="text-white">{selectedDate.split('-').reverse().join('/')}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    Horário: <strong className="text-white">{selectedTime}</strong> (Duração: 1 Hora)
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500 shrink-0" />
                    Anfitrião: <strong className="text-white">Diretoria Nexus & {nome}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                    Assunto: <strong className="text-white">{assunto}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block text-left">Link Seguro do Nexus Meet (Videoconferência)</span>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={generatedMeetLink}
                    className="bg-slate-950/80 border-slate-800 text-slate-300 font-mono text-[11px]"
                  />
                  <Button 
                    onClick={handleCopyLink}
                    variant="outline" 
                    className="border-slate-800 hover:bg-slate-900 shrink-0 px-3 text-xs"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
                  </Button>
                </div>
                 <p className="text-[10px] text-slate-500 text-left italic">
                  *Um convite com este link foi enviado para {email}. Esta agenda é integrada diretamente ao Gabinete privado da Diretoria Nexus. Você já pode fechar esta aba ou clicar abaixo para entrar na sala virtual.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-900 max-w-md mx-auto flex flex-col gap-3">
                <div className="flex gap-4">
                  <Button 
                    onClick={() => setStep('schedule')}
                    variant="outline" 
                    className="w-1/2 border-slate-800 hover:bg-slate-900 text-slate-400 text-xs font-bold"
                  >
                    Novo Agendamento
                  </Button>
                  <Link href={getTestMeetLink(generatedMeetLink)} className="w-1/2">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-550 text-white text-xs font-bold gap-2">
                      <Laptop className="w-4 h-4" />
                      Entrar na Sala
                    </Button>
                  </Link>
                </div>
                
                <Link href="/" className="w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full border border-slate-900 hover:border-slate-850 text-slate-500 hover:text-slate-300 text-xs font-bold"
                  >
                    Voltar para o Site
                  </Button>
                </Link>
              </div>

            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500/40" />
            Criptografia de Ponto-a-Ponto e Segurança Soberana Ativas
          </p>
        </div>

      </div>
    </div>
  );
}
