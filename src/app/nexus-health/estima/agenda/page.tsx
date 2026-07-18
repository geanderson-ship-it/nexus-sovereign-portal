"use client";

import { Activity, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Plus, Search, ChevronLeft, ChevronRight, User, MoreHorizontal, Heart, Syringe, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EstimaAgendaPage() {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const hours = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="min-h-screen bg-[#050a11] text-gray-100 flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
      
      {/* Header */}
      <header className="h-16 border-b border-[#ffffff0a] bg-[rgba(11,18,30,0.3)] backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/nexus-health/estima" className="text-gray-400 hover:text-[#f59e0b] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#f59e0b]" />
            <h1 className="font-bold text-lg text-white">Agenda Inteligente (Luna)</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar paciente (Pet/Tutor)..." 
              className="pl-9 pr-4 py-1.5 bg-[#00000033] border border-[#ffffff1a] rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#f59e0b] w-64 transition-all"
            />
          </div>
          <button className="px-4 py-1.5 text-sm font-bold bg-[#f59e0b] text-black rounded-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Agendamento
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto relative z-10 flex flex-col xl:flex-row gap-6 h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Coluna Esquerda: Mini Calendário e Filtros */}
        <div className="hidden xl:flex w-80 flex-col gap-6 overflow-y-auto custom-scrollbar">
          {/* Calendário Mensal */}
          <div className="bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4 text-white font-medium">
              <ChevronLeft className="w-4 h-4 cursor-pointer text-gray-400 hover:text-[#f59e0b]" />
              <span>Julho 2026</span>
              <ChevronRight className="w-4 h-4 cursor-pointer text-gray-400 hover:text-[#f59e0b]" />
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500">
              {days.map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[...Array(31)].map((_, i) => (
                <button 
                  key={i} 
                  className={`p-1.5 rounded-md hover:bg-[#ffffff10] transition-colors ${i + 1 === 18 ? 'bg-[#f59e0b]/20 text-[#f59e0b] font-bold border border-[#f59e0b]/30' : 'text-gray-300'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legenda de Status da IA (Luna) */}
          <div className="bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Status IA (Luna)</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" /> Confirmado (WhatsApp)
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-[#f59e0b]" /> Aguardando Resposta
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <AlertCircle className="w-4 h-4 text-red-400" /> Ausência / Reagendado
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Principal: Grade Diária */}
        <div className="flex-1 bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="h-14 border-b border-[#ffffff0a] flex items-center justify-between px-6 bg-black/20">
            <h2 className="font-bold text-white text-lg">Sábado, 18 de Julho</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold rounded-md bg-[#ffffff10] text-white hover:bg-[#ffffff20]">Dia</button>
              <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:text-white">Semana</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex flex-col relative">
              {/* Linha do tempo decorativa */}
              <div className="absolute left-[70px] top-0 bottom-0 w-px bg-[#ffffff0a]"></div>

              {hours.map((hour, idx) => (
                <div key={hour} className="flex min-h-[100px] border-b border-[#ffffff05] group">
                  <div className="w-20 py-3 text-xs font-medium text-gray-500 text-right pr-4 shrink-0 relative">
                    {hour}
                    <div className="absolute right-0 top-4 w-2 h-px bg-[#ffffff20]"></div>
                  </div>
                  
                  <div className="flex-1 p-2 relative">
                    {/* Agendamentos */}
                    {idx === 1 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-2 left-2 right-4 bottom-2 bg-gradient-to-r from-[#10b981]/10 to-transparent border border-[#10b981]/30 rounded-lg p-3 flex flex-col justify-center cursor-pointer hover:border-[#10b981]/60 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm">Bolinha (Pug) <span className="text-xs text-gray-400 font-normal ml-1">- Tutor: Marcos</span></h4>
                            <p className="text-xs text-gray-400 mt-1">Avaliação Cirúrgica (Dr. Rafael)</p>
                            <div className="mt-2 flex gap-2">
                                <span className="px-1.5 py-0.5 rounded border border-red-500/30 text-red-400 text-[9px] font-bold uppercase flex items-center gap-1 bg-red-500/10">
                                    <Info className="w-3 h-3"/> Jejum 8h Exigido
                                </span>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded bg-[#10b981]/20 text-[#10b981] text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> CONFIRMADO
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {idx === 2 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="absolute top-2 left-2 right-1/2 bottom-2 bg-gradient-to-r from-[#f59e0b]/10 to-transparent border border-[#f59e0b]/30 rounded-lg p-3 flex flex-col justify-center cursor-pointer hover:border-[#f59e0b]/60 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm">Thor (Golden) <span className="text-xs text-gray-400 font-normal ml-1">- Tutora: Ana</span></h4>
                            <p className="text-xs text-gray-400 mt-1">Retorno Pós-Operatório</p>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Paciente na recepção
                        </div>
                      </motion.div>
                    )}

                    {idx === 3 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-2 left-2 right-4 bottom-2 bg-gradient-to-r from-[#3b82f6]/10 to-transparent border border-[#3b82f6]/30 rounded-lg p-3 flex flex-col justify-center cursor-pointer hover:border-[#3b82f6]/60 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm">Mia (Persa) <span className="text-xs text-gray-400 font-normal ml-1">- Tutora: Camila</span></h4>
                            <p className="text-xs text-gray-400 mt-1">Vacinação V4 e Raiva</p>
                            <div className="mt-2 flex gap-2">
                                <span className="px-1.5 py-0.5 rounded border border-blue-500/30 text-blue-400 text-[9px] font-bold uppercase flex items-center gap-1 bg-blue-500/10">
                                    <Syringe className="w-3 h-3"/> Alerta Imunológico
                                </span>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded bg-[#f59e0b]/20 text-[#f59e0b] text-[10px] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> AGUARDANDO WHATSAPP
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Botão sutil para agendar nesse horário se estiver vazio */}
                    {idx !== 1 && idx !== 2 && idx !== 3 && (
                      <div className="w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center pl-4">
                        <button className="text-xs font-bold text-amber-500/50 hover:text-amber-400 flex items-center gap-1">
                          <Plus className="w-4 h-4" /> Marcar Consulta
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Marcador de Hora Atual */}
              <div className="absolute left-[70px] right-0 top-[250px] h-px bg-[#ef4444] z-10 shadow-[0_0_8px_#ef4444]">
                <div className="absolute -left-12 -top-2.5 bg-[#ef4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  10:15
                </div>
                <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-[#ef4444]"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
