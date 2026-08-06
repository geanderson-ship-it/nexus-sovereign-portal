'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CalendarDays, Clock, Users, CheckCircle2, Shield, 
  Search, RefreshCw, X, AlertTriangle, ArrowRight, ArrowLeft, Check, Phone, Mail, Building
} from 'lucide-react';
import Link from 'next/link';

interface ICMBioBooking {
  id: number;
  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
  partnerCompany: string;
  productName: string;
  selectedDate: string; // DD/MM/AAAA
  selectedTime: string; // HH:MM
  reason: string;
  status: 'Confirmado' | 'Pendente' | 'Cancelado';
  cancelReason?: string;
  cancelCategory?: 'Tempo' | 'Produto' | 'Outro';
  cancelNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// 10 slots fixos de atendimento diários
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

// Serviços prestados/solicitados
const PRODUCTS = [
  'Trilha do Atalaia / Visitação Monitorada',
  'Educação Ambiental & Visita de Escolas',
  'Passeios de Barco / Lancha (Operadores de Ecoturismo)',
  'Monitoramento Ecológico de Biodiversidade',
  'Gestão de Resíduos e Limpeza de Praias',
  'Pesquisa Científica & Coleta de Amostras',
  'Licenciamento e Autorização Ambiental',
  'Outros Assuntos de Conservação'
];

export default function ICMBioPartnerScheduler() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'my-bookings'>('schedule');
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Form de agendamento
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerCompany, setPartnerCompany] = useState('');
  const [productName, setProductName] = useState(PRODUCTS[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // Campos específicos de Embarcações
  const [vesselName, setVesselName] = useState('');
  const [vesselCaptain, setVesselCaptain] = useState('');
  const [vesselCapacity, setVesselCapacity] = useState('');
  const [vesselAuthNumber, setVesselAuthNumber] = useState('');
  const [captainLicenseNumber, setCaptainLicenseNumber] = useState('');
  const [captainLicenseExpiry, setCaptainLicenseExpiry] = useState('');
  const [captainLicenseIssuer, setCaptainLicenseIssuer] = useState('');

  // Controle de Segmentos
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Campos específicos de Trilhas
  const [guideName, setGuideName] = useState('');
  const [guideCadastur, setGuideCadastur] = useState('');
  const [groupSize, setGroupSize] = useState('5');
  const [trailName, setTrailName] = useState('Trilha do Atalaia');

  // Campos específicos de Mergulho
  const [diveInstructorId, setDiveInstructorId] = useState('');
  const [diveSpot, setDiveSpot] = useState('Pedras Secas');

  // Campos específicos de Voos
  const [flightSpot, setFlightSpot] = useState('Mirante do Boldró');

  // Estados globais de dados
  const [bookings, setBookings] = useState<ICMBioBooking[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [dailyLimit, setDailyLimit] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<ICMBioBooking | null>(null);

  // Estados de pesquisa do parceiro
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedBookings, setSearchedBookings] = useState<ICMBioBooking[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  // Modais de Reagendamento / Cancelamento
  const [bookingToCancel, setBookingToCancel] = useState<ICMBioBooking | null>(null);
  const [cancelCategory, setCancelCategory] = useState<'Tempo' | 'Produto' | 'Outro'>('Tempo');
  const [cancelReason, setCancelReason] = useState('Problema de Tempo / Agenda');
  const [cancelNotes, setCancelNotes] = useState('');

  const [bookingToReschedule, setBookingToReschedule] = useState<ICMBioBooking | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  // Estados do Chatbot Marina (IA)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'assistant', content: 'Olá! Sou a Marina, sua assistente ecológica para Fernando de Noronha! 🌿 Como posso te ajudar hoje? Posso agendar trilhas, passeios de lancha, reagendar horários ou tirar suas dúvidas!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const getBackgroundImage = () => {
    switch (selectedSegment) {
      case 'barco':
        return '/images/bg_barco.jpg';
      case 'trilha':
        return '/images/bg_trilha.jpg';
      case 'mergulho':
        return '/images/bg_mergulho.jpg';
      case 'voo':
        return '/images/bg_voo.jpg';
      default:
        return '/images/bg_barco.jpg';
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { role: 'user', content: chatInput.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/icmbio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content })),
          isAdmin: false
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Resposta da IA
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

      // Ação acionada
      if (data.action) {
        const { type, payload } = data.action;
        setChatMessages(prev => [...prev, { role: 'system', content: `⏳ Processando ação automática: ${type}...` }]);
        
        if (type === 'CREATE_BOOKING') {
          const apiRes = await fetch('/api/icmbio/agenda', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const apiData = await apiRes.json();
          if (apiRes.ok && apiData.success) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `✅ Agendamento registrado com sucesso! Código da Reserva: ${apiData.booking.id}. E-mail de confirmação enviado.` }]);
            fetchData();
          } else {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `❌ Falha ao agendar: ${apiData.error || 'Erro desconhecido'}.` }]);
          }
        } 
        else if (type === 'RESCHEDULE_BOOKING') {
          const apiRes = await fetch('/api/icmbio/agenda', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const apiData = await apiRes.json();
          if (apiRes.ok && apiData.success) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `✅ Agendamento alterado com sucesso para ${payload.selectedDate} às ${payload.selectedTime}h!` }]);
            fetchData();
          } else {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `❌ Falha ao reagendar: ${apiData.error || 'Erro desconhecido'}.` }]);
          }
        }
        else if (type === 'CANCEL_BOOKING') {
          const apiRes = await fetch('/api/icmbio/agenda', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: payload.id,
              status: 'Cancelado',
              cancelReason: payload.cancelReason || 'Solicitado via Assistente Virtual',
              cancelCategory: payload.cancelCategory || 'Outro',
              cancelNotes: payload.cancelNotes || 'Cancelado via IA'
            })
          });
          const apiData = await apiRes.json();
          if (apiRes.ok && apiData.success) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `✅ Reserva ID ${payload.id} cancelada com sucesso.` }]);
            fetchData();
          } else {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `❌ Falha ao cancelar: ${apiData.error || 'Erro desconhecido'}.` }]);
          }
        }
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Desculpe, tive um problema ao processar seu pedido: ${err.message || 'Erro de conexão'}.` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resBookings, resBlocked, resSettings] = await Promise.all([
        fetch('/api/icmbio/agenda'),
        fetch('/api/icmbio/blocked-dates'),
        fetch('/api/icmbio/settings')
      ]);
      const dataBookings = await resBookings.json();
      const dataBlocked = await resBlocked.json();
      const dataSettings = await resSettings.json();

      if (dataBookings.bookings) setBookings(dataBookings.bookings);
      if (dataBlocked.blockedDates) setBlockedDates(dataBlocked.blockedDates);
      if (dataSettings.dailyOperatorLimit) setDailyLimit(dataSettings.dailyOperatorLimit);
    } catch (e) {
      console.error('Falha ao carregar dados do ICMBio:', e);
    }
  };

  // Helper para verificar disponibilidade de horário
  const isSlotTaken = (dateStr: string, timeStr: string) => {
    if (!dateStr) return false;
    let formatted = dateStr;
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      formatted = `${day}/${month}/${year}`;
    }
    return bookings.some(
      b => b.selectedDate === formatted && b.selectedTime === timeStr && b.status !== 'Cancelado'
    );
  };

  // Helper para verificar se um dia está completamente bloqueado ou esgotado (capacidade máxima)
  const isDateBlockedOrFull = (dateStr: string) => {
    if (!dateStr) return false;
    let formatted = dateStr;
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      formatted = `${day}/${month}/${year}`;
    }

    // Verificar se está na lista de bloqueadas
    if (blockedDates.includes(dateStr) || blockedDates.includes(formatted)) {
      return true;
    }

    // Verificar se atingiu o limite de slots ocupados
    const activeBookingsOnDate = bookings.filter(
      b => b.selectedDate === formatted && b.status !== 'Cancelado'
    ).length;

    return activeBookingsOnDate >= dailyLimit;
  };

  // Criação de Agendamento
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerEmail || !partnerPhone || !partnerCompany || !selectedDate || !selectedTime) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/icmbio/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName,
          partnerEmail,
          partnerPhone,
          partnerCompany,
          productName,
          selectedDate,
          selectedTime,
          reason,
          segment: selectedSegment || 'barco',
          vesselName: selectedSegment === 'barco' ? vesselName : '',
          vesselCaptain: selectedSegment === 'barco' ? vesselCaptain : '',
          vesselCapacity: selectedSegment === 'barco' ? vesselCapacity : '',
          vesselAuthNumber: selectedSegment === 'barco' ? vesselAuthNumber : '',
          captainLicenseNumber: selectedSegment === 'barco' ? captainLicenseNumber : '',
          captainLicenseExpiry: selectedSegment === 'barco' ? captainLicenseExpiry : '',
          captainLicenseIssuer: selectedSegment === 'barco' ? captainLicenseIssuer : '',
          guideName: selectedSegment === 'trilha' ? guideName : '',
          guideCadastur: selectedSegment === 'trilha' ? guideCadastur : '',
          groupSize: selectedSegment === 'trilha' ? groupSize : '',
          trailName: selectedSegment === 'trilha' ? trailName : '',
          diveInstructorId: selectedSegment === 'mergulho' ? diveInstructorId : '',
          diveSpot: selectedSegment === 'mergelho' || selectedSegment === 'mergulho' ? diveSpot : '',
          flightSpot: selectedSegment === 'voo' ? flightSpot : ''
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Erro ao realizar agendamento.');
      }

      if (resData.success) {
        setLastCreatedBooking(resData.booking);
        // Atualiza estado local
        setBookings(prev => [...prev, resData.booking]);
        setStep('success');
        
        // Reset campos
        setSelectedDate('');
        setSelectedTime('');
        setReason('');
        setVesselName('');
        setVesselCaptain('');
        setVesselCapacity('');
        setVesselAuthNumber('');
        setCaptainLicenseNumber('');
        setCaptainLicenseExpiry('');
        setCaptainLicenseIssuer('');
        setGuideName('');
        setGuideCadastur('');
        setGroupSize('5');
        setTrailName('Trilha do Atalaia');
        setDiveInstructorId('');
        setDiveSpot('Pedras Secas');
        setFlightSpot('Mirante do Boldró');
      }
    } catch (err: any) {
      alert(err.message || 'Falha na comunicação com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Consulta por E-mail
  const handleSearchBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    setIsSearching(true);
    setSearchMessage('');
    try {
      const response = await fetch(`/api/icmbio/agenda?email=${encodeURIComponent(searchEmail.trim())}`);
      const data = await response.json();
      if (data.bookings) {
        setSearchedBookings(data.bookings);
        if (data.bookings.length === 0) {
          setSearchMessage('Nenhum agendamento ativo encontrado para este e-mail.');
        }
      }
    } catch (err) {
      console.error(err);
      setSearchMessage('Erro ao buscar registros.');
    } finally {
      setIsSearching(false);
    }
  };

  // Cancelamento
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      const response = await fetch('/api/icmbio/agenda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookingToCancel.id,
          status: 'Cancelado',
          cancelReason,
          cancelCategory,
          cancelNotes
        })
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Erro ao cancelar.');

      if (resData.success) {
        // Atualizar listas locais
        const updated = (prev: ICMBioBooking[]) =>
          prev.map(b => b.id === bookingToCancel.id ? resData.booking : b);
        
        setBookings(updated);
        setSearchedBookings(updated);
        setBookingToCancel(null);
        setCancelNotes('');
        alert('Agendamento cancelado com sucesso!');
      }
    } catch (err: any) {
      alert(err.message || 'Falha ao processar cancelamento.');
    }
  };

  // Reagendamento
  const handleRescheduleBooking = async () => {
    if (!bookingToReschedule || !newRescheduleDate || !newRescheduleTime) {
      alert('Selecione uma data e horário novos.');
      return;
    }

    try {
      const response = await fetch('/api/icmbio/agenda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookingToReschedule.id,
          selectedDate: newRescheduleDate,
          selectedTime: newRescheduleTime
        })
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Erro ao reagendar.');

      if (resData.success) {
        const updated = (prev: ICMBioBooking[]) =>
          prev.map(b => b.id === bookingToReschedule.id ? resData.booking : b);
        
        setBookings(updated);
        setSearchedBookings(updated);
        setBookingToReschedule(null);
        setNewRescheduleDate('');
        setNewRescheduleTime('');
        alert('Agendamento reagendado com sucesso!');
      }
    } catch (err: any) {
      alert(err.message || 'Falha ao reagendar.');
    }
  };

  // Data mínima: Amanhã
  const getMinDateString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans flex flex-col items-center justify-between p-4 md:p-8 relative bg-[#f2faf5] overflow-hidden">
      
      {/* Imagem de Fundo Fixa Dinâmica com Transição Suave e Opacidade Ajustada */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-all duration-1000 ease-in-out z-0"
        style={{ 
          backgroundImage: `url(${getBackgroundImage()})`,
          opacity: 0.85
        }} 
      />

      {/* Background Cyber-Eco (Esmeralda & Forest overlays) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] bg-emerald-500/[0.01] blur-[150px] rounded-full pointer-events-none" />

      {/* HEADER CARD HORIZONTAL (PILL LAYOUT) */}
      <header className="w-full max-w-4xl bg-black/60 border border-emerald-900/40 backdrop-blur-xl rounded-2xl md:rounded-full p-4 md:px-8 md:py-3 flex flex-col md:flex-row items-center justify-between gap-4 z-10 shadow-[0_10px_35px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-600/30 flex items-center justify-center font-bold text-white text-lg shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            🌿
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-wide text-white font-headline">Portal de Parcerias ICMBio</h1>
            <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-semibold font-mono">Nexus Soberania & Conservação</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('schedule'); setStep('form'); }}
            className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-extrabold transition-all backdrop-blur-sm ${
              activeTab === 'schedule'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-slate-300 hover:text-white bg-slate-950/40 border border-emerald-900/30 hover:border-emerald-500/50'
            }`}
          >
            Registrar Operação
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-extrabold transition-all backdrop-blur-sm ${
              activeTab === 'my-bookings'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-slate-300 hover:text-white bg-slate-950/40 border border-emerald-900/30 hover:border-emerald-500/50'
            }`}
          >
            Minhas Reservas
          </button>
          <Link href="/icmbio/admin" className="px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 hover:text-white bg-emerald-950/40 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500/50 transition-all backdrop-blur-sm">
            Painel Admin
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-2xl relative z-10 my-8 flex-grow flex flex-col justify-center">
        {activeTab === 'schedule' ? (
          step === 'form' ? (
            <Card className="bg-black/60 border border-emerald-900/50 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.05)] overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-600 w-full" />
              <CardContent className="p-6 md:p-10 space-y-6">
                
                {!selectedSegment ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        Selecione seu Segmento de Ecoturismo
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Escolha a modalidade de atividade ecológica que você opera para acessar a agenda de capacidade de carga e registrar sua intenção.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* CARD BARCO */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSegment('barco');
                          setProductName('Passeios de Barco / Lancha (Operadores de Ecoturismo)');
                        }}
                        className="p-5 bg-slate-950/80 border border-emerald-900/40 hover:border-emerald-500 rounded-3xl text-left transition-all hover:bg-emerald-950/10 flex flex-col justify-between group shadow-lg min-h-[140px]"
                      >
                        <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">🛥️</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Passeios de Barco e Lanchas</h4>
                          <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Registro de passeios de lancha, escunas e barcos de turismo de terceiros.</p>
                        </div>
                      </button>

                      {/* CARD TRILHA */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSegment('trilha');
                          setProductName('Trilhas Ecológicas (Condutores de Visitantes)');
                        }}
                        className="p-5 bg-slate-950/80 border border-emerald-900/40 hover:border-emerald-500 rounded-3xl text-left transition-all hover:bg-emerald-950/10 flex flex-col justify-between group shadow-lg min-h-[140px]"
                      >
                        <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">🧭</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Trilhas Ecológicas</h4>
                          <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Agendamento de grupos de visitantes conduzidos por guias autorizados.</p>
                        </div>
                      </button>

                      {/* CARD MERGULHO */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSegment('mergulho');
                          setProductName('Mergulho e Atividades Subaquáticas');
                        }}
                        className="p-5 bg-slate-950/80 border border-emerald-900/40 hover:border-emerald-500 rounded-3xl text-left transition-all hover:bg-emerald-950/10 flex flex-col justify-between group shadow-lg min-h-[140px]"
                      >
                        <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">🤿</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Mergulho e Snorkeling</h4>
                          <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Autorização para saídas de batismo e mergulho autônomo com instrutores.</p>
                        </div>
                      </button>

                      {/* CARD VOO */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSegment('voo');
                          setProductName('Licenciamento e Autorização Ambiental');
                        }}
                        className="p-5 bg-slate-950/80 border border-emerald-900/40 hover:border-emerald-500 rounded-3xl text-left transition-all hover:bg-emerald-950/10 flex flex-col justify-between group shadow-lg min-h-[140px]"
                      >
                        <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">🪂</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Voo Livre e Outros</h4>
                          <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Registro de voos de parapente, mirantes e atividades especiais no parque.</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Botão de Voltar e Identificador do Segmento */}
                    <div className="flex justify-between items-center border-b border-emerald-950/60 pb-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setSelectedSegment(null)}
                        className="text-xs text-emerald-500 hover:text-emerald-400 font-bold flex items-center gap-1 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" /> Voltar aos Segmentos
                      </button>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold font-mono">
                        {selectedSegment === 'barco' && '🛥️ Barcos'}
                        {selectedSegment === 'trilha' && '🧭 Trilhas'}
                        {selectedSegment === 'mergulho' && '🤿 Mergulho'}
                        {selectedSegment === 'voo' && '🪂 Voos'}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-emerald-400 animate-pulse" />
                        {selectedSegment === 'barco' && 'Registrar Operação de Embarcação'}
                        {selectedSegment === 'trilha' && 'Agendar Condutor de Trilha'}
                        {selectedSegment === 'mergulho' && 'Autorizar Saída de Mergulho'}
                        {selectedSegment === 'voo' && 'Registrar Atividade de Voo Livre / Outros'}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {selectedSegment === 'barco' && `Registre sua intenção de operação de atração de ecoturismo (passeio de lancha, escuna, etc.) em Fernando de Noronha. Cada dia possui capacidade de carga limitada a ${dailyLimit} embarcações.`}
                        {selectedSegment === 'trilha' && `Registre o agendamento de grupos de visitantes conduzidos por guias autorizados. Cada dia possui capacidade limitada a ${dailyLimit} guias/grupos.`}
                        {selectedSegment === 'mergulho' && `Registre as saídas de mergulho autônomo ou batismos programados. Capacidade máxima diária limitada a ${dailyLimit} operadoras ativas.`}
                        {selectedSegment === 'voo' && `Registre as intenções de voo livre e outras atividades de aventura. Capacidade máxima limitada a ${dailyLimit} operadores ativos.`}
                      </p>
                    </div>

                    <form onSubmit={handleCreateBooking} className="space-y-6">
                  
                  {/* SELEÇÃO DE DATA E HORA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#041208]/40 border border-emerald-950 p-4 rounded-2xl">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">1. Escolha o Dia</label>
                      <input
                        type="date"
                        required
                        min={getMinDateString()}
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime(''); // reseta horário
                        }}
                        className="w-full bg-slate-950/80 border border-emerald-900 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono"
                      />
                      {selectedDate && isDateBlockedOrFull(selectedDate) && (
                        <p className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          Capacidade máxima atingida ({dailyLimit}/{dailyLimit} barcos) ou bloqueado.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">2. Horário do Slot</label>
                      {selectedDate ? (
                        isDateBlockedOrFull(selectedDate) ? (
                          <div className="h-full min-h-[80px] flex items-center justify-center border border-dashed border-red-950/80 rounded-xl bg-red-950/10 text-xs text-red-400 italic">
                            Indisponível para esta data
                          </div>
                        ) : (
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
                                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                        : 'bg-slate-950/80 border-emerald-900/50 text-slate-300 hover:border-emerald-700 hover:bg-slate-900'
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        )
                      ) : (
                        <div className="h-full min-h-[80px] flex items-center justify-center border border-dashed border-emerald-950/60 rounded-xl bg-slate-950/30 text-xs text-slate-500 italic">
                          Selecione o dia primeiro
                        </div>
                      )}
                    </div>
                  </div>

                  {/* IDENTIFICAÇÃO DO PARCEIRO */}
                  <div className="space-y-4 pt-4 border-t border-emerald-950/60">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">3. Dados da Instituição Parceira</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Seu Nome</label>
                        <div className="relative">
                          <Input
                            type="text"
                            required
                            placeholder="Nome completo"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">
                          {selectedSegment === 'barco' && 'Órgão / Marina Parceira'}
                          {selectedSegment === 'trilha' && 'Associação / Guia Solicitante'}
                          {selectedSegment === 'mergulho' && 'Operadora / Dive Center'}
                          {selectedSegment === 'voo' && 'Clube / Operador de Voo'}
                          {!selectedSegment && 'Órgão / Empresa Parceira'}
                        </label>
                        <Input
                          type="text"
                          required
                          placeholder="Ex: Marina São Pedro, EcoTrilhas..."
                          value={partnerCompany}
                          onChange={(e) => setPartnerCompany(e.target.value)}
                          className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">E-mail Corporativo</label>
                        <Input
                          type="email"
                          required
                          placeholder="nome@parceiro.gov.br"
                          value={partnerEmail}
                          onChange={(e) => setPartnerEmail(e.target.value)}
                          className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">WhatsApp de Contato</label>
                        <Input
                          type="tel"
                          required
                          placeholder="(99) 99999-9999"
                          value={partnerPhone}
                          onChange={(e) => setPartnerPhone(e.target.value)}
                          className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase">Modalidade Ambiental Registrada</label>
                      <Input
                        type="text"
                        disabled
                        value={productName}
                        className="bg-slate-950/40 border-emerald-950 text-emerald-400 font-bold rounded-xl cursor-not-allowed font-mono text-xs"
                      />
                    </div>

                    {/* DADOS ESPECÍFICOS: BARCO */}
                    {selectedSegment === 'barco' && (
                      <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/15 border border-emerald-900/40 backdrop-blur-md">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Dados da Embarcação (Terceiros)</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Nome da Embarcação</label>
                            <Input
                              type="text"
                              required
                              placeholder="Ex: Lancha Maresia..."
                              value={vesselName}
                              onChange={(e) => setVesselName(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Condutor / Piloto Autorizado</label>
                            <Input
                              type="text"
                              required
                              placeholder="Nome completo do capitão"
                              value={vesselCaptain}
                              onChange={(e) => setVesselCaptain(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Novos campos de habilitação do condutor */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">CNH / Autorização de Pilotar</label>
                            <Input
                              type="text"
                              required
                              placeholder="Habilitação (CHA/Arrais)"
                              value={captainLicenseNumber}
                              onChange={(e) => setCaptainLicenseNumber(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Data de Validade (Vigente)</label>
                            <Input
                              type="date"
                              required
                              value={captainLicenseExpiry}
                              onChange={(e) => setCaptainLicenseExpiry(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Órgão Fornecedor / Emissor</label>
                            <Input
                              type="text"
                              required
                              placeholder="Ex: Marinha do Brasil"
                              value={captainLicenseIssuer}
                              onChange={(e) => setCaptainLicenseIssuer(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Capacidade de Passageiros</label>
                            <Input
                              type="number"
                              required
                              placeholder="Ex: 12"
                              value={vesselCapacity}
                              onChange={(e) => setVesselCapacity(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Número do Registro/Autorização ICMBio</label>
                            <Input
                              type="text"
                              required
                              placeholder="Ex: EMB-2026-88"
                              value={vesselAuthNumber}
                              onChange={(e) => setVesselAuthNumber(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DADOS ESPECÍFICOS: TRILHAS */}
                    {selectedSegment === 'trilha' && (
                      <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/15 border border-emerald-900/40 backdrop-blur-md">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Dados da Condução de Trilha</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Nome do Guia / Condutor</label>
                            <Input
                              type="text"
                              required
                              placeholder="Nome completo do guia credenciado"
                              value={guideName}
                              onChange={(e) => setGuideName(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Número CADASTUR</label>
                            <Input
                              type="text"
                              required
                              placeholder="Registro no Ministério do Turismo"
                              value={guideCadastur}
                              onChange={(e) => setGuideCadastur(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Trilha Ecológica Planejada</label>
                            <select
                              value={trailName}
                              onChange={(e) => setTrailName(e.target.value)}
                              className="w-full bg-[#040c06] border border-emerald-950 text-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                            >
                              <option value="Trilha do Atalaia">Trilha do Atalaia</option>
                              <option value="Trilha do Capim Açu">Trilha do Capim Açu</option>
                              <option value="Trilha do Sancho">Trilha do Sancho</option>
                              <option value="Caminhada Histórica">Caminhada Histórica</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Tamanho do Grupo (Max 10)</label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              required
                              placeholder="Ex: 5"
                              value={groupSize}
                              onChange={(e) => setGroupSize(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DADOS ESPECÍFICOS: MERGULHO */}
                    {selectedSegment === 'mergulho' && (
                      <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/15 border border-emerald-900/40 backdrop-blur-md">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Dados da Saída de Mergulho</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Registro PADI / SSI do Instrutor</label>
                            <Input
                              type="text"
                              required
                              placeholder="Ex: PADI-OWSI-998877"
                              value={diveInstructorId}
                              onChange={(e) => setDiveInstructorId(e.target.value)}
                              className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase">Ponto de Mergulho Planejado</label>
                            <select
                              value={diveSpot}
                              onChange={(e) => setDiveSpot(e.target.value)}
                              className="w-full bg-[#040c06] border border-emerald-950 text-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                            >
                              <option value="Pedras Secas">Pedras Secas</option>
                              <option value="Ressurreição">Ressurreição</option>
                              <option value="Buraco das Cabras">Buraco das Cabras</option>
                              <option value="Cabeço da Sapata">Cabeço da Sapata</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DADOS ESPECÍFICOS: VOO */}
                    {selectedSegment === 'voo' && (
                      <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/15 border border-emerald-900/40 backdrop-blur-md">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Dados de Voo Livre / Mirantes</span>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase">Local de Decolagem / Operação</label>
                          <select
                            value={flightSpot}
                            onChange={(e) => setFlightSpot(e.target.value)}
                            className="w-full bg-[#040c06] border border-emerald-950 text-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Mirante do Boldró">Mirante do Boldró (Voo Livre)</option>
                            <option value="Praia do Sancho">Praia do Sancho (Fotografia Aérea)</option>
                            <option value="Morro do Pico">Morro do Pico (Pesquisa / Especial)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase">Descrição da Finalidade (Opcional)</label>
                      <Textarea
                        placeholder="Quais detalhes ou tópicos serão abordados no encontro?"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="bg-slate-950/80 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl h-20"
                      />
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isDateBlockedOrFull(selectedDate) || !selectedTime}
                    className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold py-4 rounded-xl text-sm transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Processando Reserva...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        Confirmar Agendamento Técnico <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                </form>
                  </div>
                )}

              </CardContent>
            </Card>
          ) : (
            /* SUCCESS STEP */
            <Card className="bg-black/70 border border-emerald-500/40 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.15)] text-center overflow-hidden">
              <div className="h-1.5 bg-emerald-500 w-full" />
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white font-headline">Agendamento Confirmado!</h2>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Status: Confirmado</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mt-2">
                    Tudo certo, <strong>{lastCreatedBooking?.partnerName}</strong>! Seu agendamento para <strong>{lastCreatedBooking?.productName}</strong> foi registrado e o e-mail de confirmação enviado para <strong>{lastCreatedBooking?.partnerEmail}</strong>.
                  </p>
                </div>

                {lastCreatedBooking && (
                  <div className="bg-[#031408]/60 border border-emerald-950 rounded-2xl p-5 text-left text-xs max-w-md mx-auto space-y-2 font-mono">
                    <p><span className="text-emerald-500">Parceiro:</span> {lastCreatedBooking.partnerCompany}</p>
                    <p><span className="text-emerald-500">Data:</span> {lastCreatedBooking.selectedDate}</p>
                    <p><span className="text-emerald-500">Horário:</span> {lastCreatedBooking.selectedTime}h</p>
                    {lastCreatedBooking.vesselName && (
                      <>
                        <p><span className="text-emerald-500">Embarcação:</span> {lastCreatedBooking.vesselName} (Condutor: {lastCreatedBooking.vesselCaptain})</p>
                        <p><span className="text-emerald-500">Capacidade:</span> {lastCreatedBooking.vesselCapacity} passageiros (Reg: {lastCreatedBooking.vesselAuthNumber})</p>
                      </>
                    )}
                    <p><span className="text-emerald-500">ID da Reserva:</span> {lastCreatedBooking.id}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Button
                    onClick={() => { setStep('form'); }}
                    className="w-full sm:w-auto bg-slate-900 border border-emerald-500/30 hover:bg-slate-800 text-emerald-400 font-semibold px-6 rounded-xl"
                  >
                    Agendar Outro Dia
                  </Button>
                  <Button
                    onClick={() => { setActiveTab('my-bookings'); setSearchEmail(lastCreatedBooking?.partnerEmail || ''); }}
                    className="w-full sm:w-auto bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold px-6 rounded-xl"
                  >
                    Ver Minhas Reservas
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          /* TAB: MEUS AGENDAMENTOS (BUSCA & REAGENDAR/CANCELAR) */
          <div className="space-y-6">
            <Card className="bg-black/60 border border-emerald-950/80 backdrop-blur-xl rounded-3xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                Pesquisar Minhas Reservas
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Insira o seu e-mail institucional utilizado no agendamento para listar, reagendar ou cancelar seus compromissos.
              </p>

              <form onSubmit={handleSearchBookings} className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="seu-email@parceiro.gov.br"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="bg-slate-950/85 border-emerald-950 text-slate-200 focus:border-emerald-500/50 rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold px-6 rounded-xl"
                >
                  {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Pesquisar'}
                </Button>
              </form>

              {searchMessage && (
                <p className="text-xs text-amber-500 font-semibold italic mt-4 text-center">{searchMessage}</p>
              )}
            </Card>

            {/* LISTAGEM DOS RESULTADOS */}
            {searchedBookings.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Resultados Encontrados ({searchedBookings.length})</h3>
                {searchedBookings.map(b => (
                  <Card key={b.id} className={`bg-black/50 border ${b.status === 'Cancelado' ? 'border-red-950/50' : 'border-emerald-950/50'} backdrop-blur-md rounded-2xl overflow-hidden`}>
                    <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            b.status === 'Confirmado' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20' : 'bg-red-950/80 text-red-400 border border-red-500/20'
                          }`}>
                            {b.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {b.id}</span>
                        </div>
                        
                        <h4 className="text-sm font-bold text-white">{b.productName}</h4>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                          <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-emerald-500" /> {b.selectedDate}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" /> {b.selectedTime}h</span>
                          <span className="col-span-2 flex items-center gap-1"><Building className="w-3.5 h-3.5 text-emerald-500" /> {b.partnerCompany} ({b.partnerName})</span>
                          {b.vesselName && (
                            <span className="col-span-2 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                              🛥️ {b.vesselName} (Condutor: {b.vesselCaptain} | {b.vesselCapacity} pass. | Reg: {b.vesselAuthNumber})
                            </span>
                          )}
                        </div>

                        {b.status === 'Cancelado' && (
                          <div className="bg-red-950/20 border border-red-950/50 rounded-xl p-3 mt-2 text-xs">
                            <p className="text-red-400 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Cancelado: {b.cancelReason}
                            </p>
                            {b.cancelNotes && <p className="text-slate-400 italic mt-1">"{b.cancelNotes}"</p>}
                          </div>
                        )}
                      </div>

                      {/* AÇÕES */}
                      {b.status !== 'Cancelado' && (
                        <div className="flex sm:flex-col gap-2 w-full md:w-auto">
                          <Button
                            onClick={() => { setBookingToReschedule(b); setNewRescheduleDate(''); setNewRescheduleTime(''); }}
                            className="flex-1 bg-blue-950/40 border border-blue-800/40 hover:bg-blue-900/40 text-blue-400 font-bold text-xs py-2 px-3 rounded-xl transition-all"
                          >
                            Reagendar
                          </Button>
                          <Button
                            onClick={() => { setBookingToCancel(b); setCancelNotes(''); }}
                            className="flex-1 bg-red-950/40 border border-red-800/40 hover:bg-red-900/40 text-red-400 font-bold text-xs py-2 px-3 rounded-xl transition-all"
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: CANCELAMENTO */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <Card className="w-full max-w-md bg-[#0a0505] border border-red-900/60 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="h-1 bg-red-500 w-full" />
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-red-950">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Cancelar Reserva
                </h3>
                <button onClick={() => setBookingToCancel(null)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p><strong>Serviço:</strong> {bookingToCancel.productName}</p>
                <p><strong>Data/Hora:</strong> {bookingToCancel.selectedDate} às {bookingToCancel.selectedTime}h</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-red-400 uppercase tracking-widest font-bold block">Motivo Principal</label>
                  <select
                    value={cancelCategory}
                    onChange={(e) => {
                      const val = e.target.value as 'Tempo' | 'Produto' | 'Outro';
                      setCancelCategory(val);
                      if (val === 'Tempo') setCancelReason('Problema de Tempo / Conflito de Agenda');
                      else if (val === 'Produto') setCancelReason('Problema com o Produto / Demanda Suspensa');
                      else setCancelReason('Outro Motivo');
                    }}
                    className="w-full bg-slate-950 border border-red-950 text-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="Tempo">Problema de Tempo / Agenda</option>
                    <option value="Produto">Problema no Produto / Recurso</option>
                    <option value="Outro">Outro Motivo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-red-400 uppercase tracking-widest font-bold block">Justificativa / Comentários</label>
                  <Textarea
                    required
                    placeholder="Explique detalhadamente o motivo do cancelamento..."
                    value={cancelNotes}
                    onChange={(e) => setCancelNotes(e.target.value)}
                    className="bg-slate-950 border-red-950 text-slate-200 focus:border-red-500 rounded-xl h-20 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setBookingToCancel(null)}
                  className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleCancelBooking}
                  disabled={!cancelNotes.trim()}
                  className="flex-1 bg-red-500 text-slate-950 hover:bg-red-400 font-bold rounded-xl disabled:opacity-50"
                >
                  Confirmar Cancelamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: REAGENDAMENTO */}
      {bookingToReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <Card className="w-full max-w-md bg-[#05080a] border border-blue-900/60 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <div className="h-1 bg-blue-500 w-full" />
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-blue-950">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                  Reagendar Horário
                </h3>
                <button onClick={() => setBookingToReschedule(null)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p><strong>Serviço:</strong> {bookingToReschedule.productName}</p>
                <p><strong>Atual:</strong> {bookingToReschedule.selectedDate} às {bookingToReschedule.selectedTime}h</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-blue-400 uppercase tracking-widest font-bold block">1. Novo Dia</label>
                  <input
                    type="date"
                    required
                    min={getMinDateString()}
                    value={newRescheduleDate}
                    onChange={(e) => {
                      setNewRescheduleDate(e.target.value);
                      setNewRescheduleTime('');
                    }}
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  {newRescheduleDate && isDateBlockedOrFull(newRescheduleDate) && (
                    <p className="text-[9px] text-red-400 font-semibold mt-1">Dia esgotado ou bloqueado.</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-blue-400 uppercase tracking-widest font-bold block">2. Novo Horário</label>
                  {newRescheduleDate ? (
                    isDateBlockedOrFull(newRescheduleDate) ? (
                      <div className="text-xs text-red-400 italic">Data indisponível.</div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map((time) => {
                          const taken = isSlotTaken(newRescheduleDate, time);
                          const isSelected = newRescheduleTime === time;

                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={taken}
                              onClick={() => setNewRescheduleTime(time)}
                              className={`py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all border ${
                                taken 
                                  ? 'bg-slate-950/40 text-slate-600 border-slate-900/30 line-through opacity-30 cursor-not-allowed pointer-events-none'
                                  : isSelected
                                    ? 'bg-blue-500 border-blue-400 text-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                    : 'bg-slate-950 border-blue-950/50 text-slate-300 hover:border-blue-700'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    <div className="text-xs text-slate-500 italic">Selecione o novo dia primeiro</div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setBookingToReschedule(null)}
                  className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleRescheduleBooking}
                  disabled={!newRescheduleDate || !newRescheduleTime || isDateBlockedOrFull(newRescheduleDate)}
                  className="flex-1 bg-blue-500 text-slate-950 hover:bg-blue-400 font-bold rounded-xl disabled:opacity-50"
                >
                  Confirmar Alteração
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full max-w-4xl text-center py-6 border-t border-emerald-950/60 mt-8 text-[10px] text-slate-500 z-10 space-y-1">
        <p>A segurança e soberania dos agendamentos técnicos são geridos em parceria com a infraestrutura Nexus.</p>
        <p>© 2026 Nexus Holding Group & ICMBio. Todos os direitos reservados.</p>
      </footer>

      {/* Botão Flutuante Marina Chat */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 px-4 py-3 rounded-full font-bold shadow-[0_4px_25px_rgba(16,185,129,0.4)] transition-all"
        >
          <span className="text-base">🌿</span>
          <span className="text-xs uppercase tracking-wider font-extrabold">Falar com Marina IA</span>
        </button>
      </div>

      {/* Painel do Chatbot */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-sm bg-[#040f07] border border-emerald-500/40 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col h-[450px]">
          <div className="bg-emerald-950 p-4 border-b border-emerald-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐢</span>
              <div>
                <h4 className="text-xs font-bold text-white leading-none">Marina (IA)</h4>
                <span className="text-[9px] text-emerald-400">Guia de Agendamento ICMBio</span>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-emerald-900/50">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs ${
                  m.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 ml-auto rounded-tr-none'
                    : m.role === 'system'
                      ? 'bg-slate-950/85 border border-emerald-950/60 text-slate-400 mx-auto text-center py-1.5 px-3 rounded-xl'
                      : 'bg-slate-950 text-slate-200 border border-emerald-950/60 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
            ))}
            {chatLoading && (
              <div className="bg-slate-950 text-slate-400 border border-emerald-950/60 rounded-tl-none rounded-2xl p-3 text-xs max-w-[80%] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Marina está pensando...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-emerald-950 flex gap-2 bg-black/40">
            <Input
              type="text"
              placeholder="Fale com a Marina..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="bg-slate-950 border-emerald-950 text-xs rounded-xl focus:border-emerald-500"
            />
            <Button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 px-3 rounded-xl text-xs font-bold"
            >
              Enviar
            </Button>
          </form>
        </div>
      )}

    </div>
  );
}
