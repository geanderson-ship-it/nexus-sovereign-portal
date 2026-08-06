'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CalendarDays, Clock, Users, CheckCircle2, AlertTriangle, 
  Search, RefreshCw, Trash2, Filter, Lock, Unlock, BarChart3, Mail, Phone, Building, Info, X, Sliders
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

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export default function ICMBioAdminPanel() {
  const [bookings, setBookings] = useState<ICMBioBooking[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros & Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [productFilter, setProductFilter] = useState<string>('todos');

  // Bloqueio de data
  const [dateToBlock, setDateToBlock] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  // Modal Detalhes/Reagendamento
  const [selectedBooking, setSelectedBooking] = useState<ICMBioBooking | null>(null);
  const [bookingToReschedule, setBookingToReschedule] = useState<ICMBioBooking | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  // Limite de capacidade diária
  const [dailyLimit, setDailyLimit] = useState(20);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  const handleUpdateLimit = async (limit: number) => {
    setIsUpdatingSettings(true);
    try {
      const response = await fetch('/api/icmbio/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyOperatorLimit: limit })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDailyLimit(limit);
      } else {
        throw new Error(data.error || 'Erro ao atualizar.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao conectar à API de configurações.');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Estados do Chatbot Marina (IA Admin)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'assistant', content: 'Olá, Administrador! Sou a Marina, sua assistente virtual de controle do ICMBio Fernando de Noronha. 🐢 Como posso te ajudar a gerenciar as operações ecológicas hoje? Posso bloquear datas, consultar solicitações, alterar status ou reagendar horários!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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
          isAdmin: true
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Resposta da IA
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

      // Ação acionada
      if (data.action) {
        const { type, payload } = data.action;
        setChatMessages(prev => [...prev, { role: 'system', content: `⏳ Processando ação administrativa: ${type}...` }]);
        
        if (type === 'TOGGLE_BLOCK_DATE') {
          const apiRes = await fetch('/api/icmbio/blocked-dates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const apiData = await apiRes.json();
          if (apiRes.ok && apiData.success) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `✅ Data ${payload.date} foi ${payload.blocked ? 'BLOQUEADA' : 'DESBLOQUEADA'} com sucesso no calendário público.` }]);
            fetchData();
          } else {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `❌ Falha ao alterar bloqueio: ${apiData.error || 'Erro desconhecido'}.` }]);
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
            setChatMessages(prev => [...prev, { role: 'assistant', content: `✅ Agendamento ID ${payload.id} alterado com sucesso para ${payload.selectedDate} às ${payload.selectedTime}h!` }]);
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
              cancelReason: payload.cancelReason || 'Cancelado administrativamente via IA',
              cancelCategory: payload.cancelCategory || 'Outro',
              cancelNotes: payload.cancelNotes || 'Cancelado por IA'
            })
          });
          const apiData = await apiRes.json();
          if (apiRes.ok && apiData.success) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `✅ Reserva ID ${payload.id} cancelada administrativamente com sucesso.` }]);
            fetchData();
          } else {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `❌ Falha ao cancelar: ${apiData.error || 'Erro desconhecido'}.` }]);
          }
        }
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Desculpe, tive um problema ao processar a ação: ${err.message || 'Erro de conexão'}.` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Carregar dados
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
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
      console.error('Erro ao buscar dados:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Bloquear / Desbloquear data
  const handleToggleBlockDate = async (dateStr: string, shouldBlock: boolean) => {
    if (!dateStr) return;
    setIsBlocking(true);
    try {
      const response = await fetch('/api/icmbio/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, blocked: shouldBlock })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Erro ao atualizar bloqueio.');

      if (resData.success) {
        if (shouldBlock) {
          setBlockedDates(prev => [...prev, dateStr]);
          setDateToBlock('');
        } else {
          setBlockedDates(prev => prev.filter(d => d !== dateStr));
        }
        fetchData(); // recarrega para sincronia
      }
    } catch (e: any) {
      alert(e.message || 'Falha ao processar bloqueio.');
    } finally {
      setIsBlocking(false);
    }
  };

  // Excluir reserva definitivamente
  const handleDeleteBooking = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta reserva definitivamente do banco de dados?')) return;
    try {
      const response = await fetch(`/api/icmbio/agenda?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setBookings(prev => prev.filter(b => b.id !== id));
        alert('Reserva excluída com sucesso!');
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      alert(e.message || 'Erro ao excluir.');
    }
  };

  // Alterar Status diretamente
  const handleChangeStatus = async (id: number, status: 'Confirmado' | 'Pendente' | 'Cancelado') => {
    try {
      const response = await fetch('/api/icmbio/agenda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Erro ao alterar status.');
      if (resData.success) {
        setBookings(prev => prev.map(b => b.id === id ? resData.booking : b));
      }
    } catch (e: any) {
      alert(e.message || 'Erro ao atualizar status.');
    }
  };

  // Confirmar Reagendamento pelo Admin
  const handleReschedule = async () => {
    if (!bookingToReschedule || !newRescheduleDate || !newRescheduleTime) return;
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
        setBookings(prev => prev.map(b => b.id === bookingToReschedule.id ? resData.booking : b));
        setBookingToReschedule(null);
        setNewRescheduleDate('');
        setNewRescheduleTime('');
        alert('Reagendado com sucesso!');
      }
    } catch (e: any) {
      alert(e.message || 'Erro ao reagendar.');
    }
  };

  // Métricas do Dashboard
  const activeBookings = bookings.filter(b => b.status !== 'Cancelado');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelado');
  
  // Categorias de cancelamento
  const cancelByTime = cancelledBookings.filter(b => b.cancelCategory === 'Tempo').length;
  const cancelByProduct = cancelledBookings.filter(b => b.cancelCategory === 'Produto').length;
  const cancelByOther = cancelledBookings.filter(b => b.cancelCategory === 'Outro').length;
  const totalCancellations = cancelledBookings.length || 1; // evita divisao por zero

  // Filtragem da tabela
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.partnerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.partnerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.selectedDate.includes(searchTerm);
      
    const matchesStatus = statusFilter === 'todos' || b.status === statusFilter;
    const matchesProduct = productFilter === 'todos' || b.productName === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  // Lista única de serviços agendados para filtro
  const uniqueProducts = Array.from(new Set(bookings.map(b => b.productName)));

  // Obter dia seguinte
  const getMinDateString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Verificar se horário está ocupado na data selecionada para reagendamento administrativo
  const isSlotTakenAdmin = (dateStr: string, timeStr: string, ignoreId: number) => {
    if (!dateStr) return false;
    let formatted = dateStr;
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      formatted = `${day}/${month}/${year}`;
    }
    return bookings.some(
      b => b.id !== ignoreId && b.selectedDate === formatted && b.selectedTime === timeStr && b.status !== 'Cancelado'
    );
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans flex flex-col items-center p-4 md:p-8 relative bg-[#f2faf5] overflow-hidden">
      
      {/* Imagem de Fundo Fixa com Opacidade Ajustada */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
        style={{ 
          backgroundImage: `url('/images/bg_voo.jpg')`,
          opacity: 0.85
        }} 
      />

      {/* Background Grid Cyber-Eco */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* HEADER CARD HORIZONTAL (PILL LAYOUT) */}
      <header className="w-full max-w-6xl bg-black/60 border border-emerald-900/40 backdrop-blur-xl rounded-2xl md:rounded-full p-4 md:px-8 md:py-3 flex flex-col md:flex-row items-center justify-between gap-4 z-10 shadow-[0_10px_35px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-600/30 flex items-center justify-center font-bold text-white text-lg shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            ⚙️
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-wide text-white font-headline">Painel Administrativo ICMBio</h1>
            <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-semibold font-mono">Controle Central de Agendamentos e Bloqueios</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/icmbio/agenda" className="px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 hover:text-white bg-emerald-950/40 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500/50 transition-all backdrop-blur-sm">
            Ir para Agenda Pública
          </Link>
          <button
            onClick={fetchData}
            className="p-2 rounded-xl bg-slate-950/40 border border-emerald-900/30 hover:border-emerald-500/50 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all backdrop-blur-sm"
            title="Atualizar Dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl relative z-10 my-8 space-y-6 flex-grow">
        
        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-black/60 border border-emerald-950/80 rounded-2xl p-4">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-slate-500 tracking-wider">Capacidade Diária (Carga)</p>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => handleUpdateLimit(Number(e.target.value))}
                    disabled={isUpdatingSettings}
                    className="w-16 bg-slate-950 border border-emerald-900/60 rounded px-1.5 py-0.5 text-sm font-bold text-center text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">barcos/dia</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                <Sliders className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border border-emerald-950/80 rounded-2xl p-4">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-emerald-500 tracking-wider">Ativos / Confirmados</p>
                <h3 className="text-2xl font-bold text-emerald-400 mt-1">{activeBookings.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border border-emerald-950/80 rounded-2xl p-4">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-red-500 tracking-wider">Cancelados</p>
                <h3 className="text-2xl font-bold text-red-400 mt-1">{cancelledBookings.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-950/20 flex items-center justify-center text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border border-emerald-950/80 rounded-2xl p-4">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-blue-500 tracking-wider">Datas Bloqueadas</p>
                <h3 className="text-2xl font-bold text-blue-400 mt-1">{blockedDates.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-950/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Lock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* GRÁFICO / MOTIVO DE CANCELAMENTO */}
          <Card className="bg-black/60 border border-emerald-950/80 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 border-b border-emerald-950 pb-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Métricas de Cancelamentos
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Problemas de Tempo / Agenda</span>
                    <span className="text-white font-bold">{cancelByTime} ({Math.round((cancelByTime / totalCancellations) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(cancelByTime / totalCancellations) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Problemas no Produto / Recurso</span>
                    <span className="text-white font-bold">{cancelByProduct} ({Math.round((cancelByProduct / totalCancellations) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(cancelByProduct / totalCancellations) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Outros Motivos</span>
                    <span className="text-white font-bold">{cancelByOther} ({Math.round((cancelByOther / totalCancellations) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2">
                    <div className="bg-slate-700 h-2 rounded-full" style={{ width: `${(cancelByOther / totalCancellations) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 italic mt-6 border-t border-emerald-950/60 pt-3">
              * Dados calculados a partir das justificativas enviadas pelos parceiros no momento da solicitação de cancelamento.
            </div>
          </Card>

          {/* GESTOR DE DATAS BLOQUEADAS */}
          <Card className="bg-black/60 border border-emerald-950/80 rounded-3xl p-6 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-emerald-950 pb-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Bloquear Datas Específicas
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <input
                  type="date"
                  min={getMinDateString()}
                  value={dateToBlock}
                  onChange={(e) => setDateToBlock(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-950 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <Button
                onClick={() => handleToggleBlockDate(dateToBlock, true)}
                disabled={isBlocking || !dateToBlock}
                className="bg-red-500 hover:bg-red-400 text-slate-950 font-bold px-6 rounded-xl flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" /> Bloquear Dia Inteiro
              </Button>
            </div>

            {/* LISTAGEM DE BLOQUEADOS */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Datas Bloqueadas ({blockedDates.length})</p>
              {blockedDates.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Nenhuma data bloqueada atualmente.</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-2">
                  {blockedDates.filter(d => !d.includes('-')).map(date => (
                    <span key={date} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-mono">
                      {date}
                      <button onClick={() => handleToggleBlockDate(date, false)} className="hover:text-white ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* TABELA DE AGENDAMENTOS */}
        <Card className="bg-black/60 border border-emerald-950/80 rounded-3xl overflow-hidden p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-emerald-950/80 gap-4 mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-400" />
              Gestão Geral da Agenda
            </h3>
            
            {/* BARRA DE FILTROS & BUSCA */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Pesquisar parceiro, data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border-emerald-950 text-xs pl-9 w-full sm:w-60 rounded-xl"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-emerald-950 text-slate-300 rounded-xl px-2 py-2 text-xs focus:outline-none"
              >
                <option value="todos">Todos Status</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Pendente">Pendente</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="bg-slate-950 border border-emerald-950 text-slate-300 rounded-xl px-2 py-2 text-xs focus:outline-none"
              >
                <option value="todos">Todos Serviços</option>
                {uniqueProducts.map(p => (
                  <option key={p} value={p}>{p.split('/')[0].trim()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABELA REAL */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12 text-slate-500 text-xs gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" /> Carregando agendamentos do sistema...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              Nenhum agendamento encontrado para os filtros selecionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-emerald-950/60 text-slate-500 uppercase tracking-widest font-mono">
                    <th className="py-3 px-4">Data/Hora</th>
                    <th className="py-3 px-4">Parceiro</th>
                    <th className="py-3 px-4">Serviço/Produto</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/20">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-[#031808]/20 transition-all font-mono">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-emerald-400 font-bold">{b.selectedDate}</span>
                          <span className="text-slate-400 text-[10px]">{b.selectedTime}h</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{b.partnerCompany}</span>
                          <span className="text-slate-500 text-[10px]">{b.partnerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 max-w-xs truncate" title={b.productName}>
                        {b.productName}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border ${
                          b.status === 'Confirmado' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/20' :
                          b.status === 'Pendente' ? 'bg-amber-950/60 text-amber-400 border-amber-500/20' :
                          'bg-red-950/60 text-red-400 border-red-500/20'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 hover:text-white rounded-lg text-slate-400 transition-all"
                          title="Visualizar Informações"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        
                        {b.status !== 'Cancelado' ? (
                          <>
                            <button
                              onClick={() => { setBookingToReschedule(b); setNewRescheduleDate(''); setNewRescheduleTime(''); }}
                              className="px-2 py-1 bg-blue-950/40 border border-blue-900/30 hover:bg-blue-900 text-blue-400 rounded-lg transition-all"
                              title="Reagendar Data/Hora"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleChangeStatus(b.id, 'Cancelado')}
                              className="px-2 py-1 bg-red-950/40 border border-red-900/30 hover:bg-red-900 text-red-400 rounded-lg transition-all"
                              title="Marcar como Cancelado"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleChangeStatus(b.id, 'Confirmado')}
                            className="px-2 py-1 bg-emerald-950/40 border border-emerald-900/30 hover:bg-emerald-900 text-emerald-400 rounded-lg transition-all"
                            title="Reconfirmar/Restaurar"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="px-2 py-1 bg-slate-950 hover:bg-red-650 hover:text-white border border-red-950 rounded-lg text-red-500 transition-all"
                          title="Excluir Definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </main>

      {/* MODAL DETALHES COMPLETOS */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <Card className="w-full max-w-lg bg-[#040c06] border border-emerald-900/80 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.15)]">
            <div className="h-1 bg-emerald-500 w-full" />
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-950">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Info className="w-5 h-5 text-emerald-400" />
                  Detalhes do Agendamento
                </h3>
                <button onClick={() => setSelectedBooking(null)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-500 block">ID DA RESERVA</span>
                  <span className="text-white font-semibold">{selectedBooking.id}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-500 block">STATUS</span>
                  <span className={`font-bold ${selectedBooking.status === 'Confirmado' ? 'text-emerald-400' : 'text-red-400'}`}>{selectedBooking.status}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-500 block">DATA / HORÁRIO</span>
                  <span className="text-white font-semibold">{selectedBooking.selectedDate} às {selectedBooking.selectedTime}h</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-500 block">SERVIÇO SOLICITADO</span>
                  <span className="text-white font-semibold">{selectedBooking.productName}</span>
                </div>
                <div className="md:col-span-2 space-y-1 border-t border-emerald-950/60 pt-2">
                  <span className="text-[10px] text-emerald-500 block">PARCEIRO / INSTITUIÇÃO</span>
                  <span className="text-white font-semibold text-sm">{selectedBooking.partnerCompany}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-500 block">CONTATO REPRESENTANTE</span>
                  <span className="text-white flex items-center gap-1"><Users className="w-3 h-3 text-emerald-500" /> {selectedBooking.partnerName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-500 block">WHATSAPP</span>
                  <span className="text-white flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-500" /> {selectedBooking.partnerPhone}</span>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] text-emerald-500 block">E-MAIL CORPORATIVO</span>
                  <span className="text-white flex items-center gap-1"><Mail className="w-3 h-3 text-emerald-500" /> {selectedBooking.partnerEmail}</span>
                </div>
                {selectedBooking.vesselName && selectedBooking.segment === 'barco' && (
                  <div className="md:col-span-2 space-y-1 border-t border-emerald-950/60 pt-2">
                    <span className="text-[10px] text-emerald-500 block">DADOS DA EMBARCAÇÃO E CONDUTOR</span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <p><strong>Nome:</strong> <span className="text-white">{selectedBooking.vesselName}</span></p>
                      <p><strong>Condutor:</strong> <span className="text-white">{selectedBooking.vesselCaptain}</span></p>
                      <p><strong>Capacidade:</strong> <span className="text-white">{selectedBooking.vesselCapacity} pessoas</span></p>
                      <p><strong>Reg. ICMBio:</strong> <span className="text-white">{selectedBooking.vesselAuthNumber}</span></p>
                      <p><strong>Habilitação:</strong> <span className="text-white">{selectedBooking.captainLicenseNumber || 'Não Informado'}</span></p>
                      <p><strong>Validade:</strong> <span className="text-white">{selectedBooking.captainLicenseExpiry || 'Não Informado'}</span></p>
                      <p className="col-span-2"><strong>Órgão Emissor:</strong> <span className="text-white">{selectedBooking.captainLicenseIssuer || 'Não Informado'}</span></p>
                    </div>
                  </div>
                )}
                {selectedBooking.segment === 'trilha' && (
                  <div className="md:col-span-2 space-y-1 border-t border-emerald-950/60 pt-2">
                    <span className="text-[10px] text-emerald-500 block">DADOS DA CONDUÇÃO DE TRILHA</span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <p><strong>Condutor / Guia:</strong> <span className="text-white">{selectedBooking.guideName}</span></p>
                      <p><strong>Reg. CADASTUR:</strong> <span className="text-white">{selectedBooking.guideCadastur}</span></p>
                      <p><strong>Trilha:</strong> <span className="text-white">{selectedBooking.trailName}</span></p>
                      <p><strong>Tamanho do Grupo:</strong> <span className="text-white">{selectedBooking.groupSize} visitantes</span></p>
                    </div>
                  </div>
                )}
                {selectedBooking.segment === 'mergulho' && (
                  <div className="md:col-span-2 space-y-1 border-t border-emerald-950/60 pt-2">
                    <span className="text-[10px] text-emerald-500 block">DADOS DA OPERAÇÃO DE MERGULHO</span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <p><strong>Registro PADI/SSI:</strong> <span className="text-white">{selectedBooking.diveInstructorId}</span></p>
                      <p><strong>Ponto de Mergulho:</strong> <span className="text-white">{selectedBooking.diveSpot}</span></p>
                    </div>
                  </div>
                )}
                {selectedBooking.segment === 'voo' && (
                  <div className="md:col-span-2 space-y-1 border-t border-emerald-950/60 pt-2">
                    <span className="text-[10px] text-emerald-500 block">DADOS DE VOO LIVRE / MIRANTE</span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <p><strong>Local de Operação:</strong> <span className="text-white">{selectedBooking.flightSpot}</span></p>
                    </div>
                  </div>
                )}
                <div className="md:col-span-2 space-y-1 border-t border-emerald-950/60 pt-2">
                  <span className="text-[10px] text-emerald-500 block">FINALIDADE / DESCRIÇÃO</span>
                  <p className="text-slate-400 bg-black/40 border border-emerald-950 p-3 rounded-xl italic">
                    {selectedBooking.reason || 'Nenhuma observação informada.'}
                  </p>
                </div>

                {selectedBooking.status === 'Cancelado' && (
                  <div className="md:col-span-2 bg-red-950/15 border border-red-500/20 p-4 rounded-xl space-y-1.5">
                    <span className="text-[10px] text-red-400 block font-bold">DADOS DE CANCELAMENTO</span>
                    <p><strong>Categoria:</strong> {selectedBooking.cancelCategory} | <strong>Motivo:</strong> {selectedBooking.cancelReason}</p>
                    {selectedBooking.cancelNotes && <p className="italic text-slate-400">"{selectedBooking.cancelNotes}"</p>}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-emerald-950/60">
                <Button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold rounded-xl"
                >
                  Fechar Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL REAGENDAMENTO ADMINISTRATIVO */}
      {bookingToReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <Card className="w-full max-w-md bg-[#05080a] border border-blue-900/60 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            <div className="h-1 bg-blue-500 w-full" />
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-blue-950">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                  Reagendar (Administrador)
                </h3>
                <button onClick={() => setBookingToReschedule(null)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-400 font-mono space-y-1">
                <p><strong>Parceiro:</strong> {bookingToReschedule.partnerCompany}</p>
                <p><strong>Serviço:</strong> {bookingToReschedule.productName}</p>
                <p><strong>Data Atual:</strong> {bookingToReschedule.selectedDate} às {bookingToReschedule.selectedTime}h</p>
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
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-blue-400 uppercase tracking-widest font-bold block">2. Novo Horário</label>
                  {newRescheduleDate ? (
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const taken = isSlotTakenAdmin(newRescheduleDate, time, bookingToReschedule.id);
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
                  onClick={handleReschedule}
                  disabled={!newRescheduleDate || !newRescheduleTime}
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
      <footer className="w-full max-w-6xl text-center py-6 border-t border-emerald-950/60 mt-8 text-[10px] text-slate-500 z-10 space-y-1">
        <p>Painel de Controle Central ICMBio. Acesso reservado e auditado.</p>
        <p>© 2026 Nexus Holding Group. Segurança Operacional Garantida.</p>
      </footer>

      {/* Botão Flutuante Marina Chat */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 px-4 py-3 rounded-full font-bold shadow-[0_4px_25px_rgba(16,185,129,0.4)] transition-all"
        >
          <span className="text-base">🐢</span>
          <span className="text-xs uppercase tracking-wider font-extrabold">Marina Admin IA</span>
        </button>
      </div>

      {/* Painel do Chatbot */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-sm bg-[#040f07] border border-emerald-500/40 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col h-[450px]">
          <div className="bg-emerald-950 p-4 border-b border-emerald-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐢</span>
              <div>
                <h4 className="text-xs font-bold text-white leading-none">Marina (IA Admin)</h4>
                <span className="text-[9px] text-emerald-400">Controle Central de Ecoturismo</span>
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
                <span>Atena está pensando...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-emerald-950 flex gap-2 bg-black/40">
            <Input
              type="text"
              placeholder="Comande a Atena..."
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
