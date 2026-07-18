"use client";

import { Activity, Calendar, Users, TrendingUp, Bell, Search, Menu } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NexusClinicDashboard() {
  return (
    <div className="min-h-screen bg-[#050a11] text-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#ffffff0a] bg-[rgba(11,18,30,0.5)] backdrop-blur-md hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#ffffff0a]">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#00f0ff]" />
            <span className="font-bold text-lg tracking-tight">Nexus Clinic</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/nexus-health/clinic" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[rgba(0,240,255,0.1)] text-[#00f0ff] transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/nexus-health/clinic/agenda" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#ffffff05] hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium text-sm">Agenda Inteligente</span>
          </Link>
          <Link href="/nexus-health/clinic/pacientes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#ffffff05] hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Pacientes</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
        
        {/* Header */}
        <header className="h-16 border-b border-[#ffffff0a] bg-[rgba(11,18,30,0.3)] backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar paciente (Ex: João Silva)..." 
                className="pl-9 pr-4 py-1.5 bg-[#00000033] border border-[#ffffff1a] rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00f0ff] w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00ffaa] rounded-full shadow-[0_0_8px_#00ffaa]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#00ffaa] p-[2px]">
              <div className="w-full h-full bg-[#050a11] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">DR</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Visão Geral da Clínica</h1>
            <p className="text-gray-400 text-sm mt-1">Métricas de hoje geradas em tempo real.</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-6 border-t border-t-[#00f0ff]/30">
              <div className="text-sm font-medium text-gray-400 mb-2 flex items-center justify-between">
                Consultas Hoje
                <Calendar className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <div className="text-3xl font-bold text-white">24</div>
              <div className="text-xs text-[#00ffaa] mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% vs Ontem
              </div>
            </div>

            <div className="bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-6 border-t border-t-[#00ffaa]/30">
              <div className="text-sm font-medium text-gray-400 mb-2 flex items-center justify-between">
                Pacientes Retidos (IA)
                <Users className="w-4 h-4 text-[#00ffaa]" />
              </div>
              <div className="text-3xl font-bold text-white">8</div>
              <div className="text-xs text-gray-400 mt-2">
                Agendados via assistente Evolution
              </div>
            </div>

            <div className="bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-6 border-t border-t-[#ff00a0]/30">
              <div className="text-sm font-medium text-gray-400 mb-2 flex items-center justify-between">
                Faturamento Previsto
                <Activity className="w-4 h-4 text-[#ff00a0]" />
              </div>
              <div className="text-3xl font-bold text-white">R$ 4.250</div>
              <div className="text-xs text-gray-400 mt-2">
                Baseado em procedimentos marcados
              </div>
            </div>
          </div>

          {/* Charts/Tables Area */}
          <div className="bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Próximos Pacientes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase bg-[#ffffff05] text-gray-300">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Horário</th>
                    <th className="px-4 py-3">Paciente</th>
                    <th className="px-4 py-3">Procedimento</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ffffff0a]">
                  <tr className="hover:bg-[#ffffff03] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">09:00</td>
                    <td className="px-4 py-3">Mariana Costa</td>
                    <td className="px-4 py-3">Avaliação Estética</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#00ffaa]/20 text-[#00ffaa]">CONFIRMADO</span></td>
                  </tr>
                  <tr className="hover:bg-[#ffffff03] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">10:30</td>
                    <td className="px-4 py-3">Carlos Eduardo</td>
                    <td className="px-4 py-3">Retorno Médico</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#00f0ff]/20 text-[#00f0ff]">SALA DE ESPERA</span></td>
                  </tr>
                  <tr className="hover:bg-[#ffffff03] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">11:15</td>
                    <td className="px-4 py-3">Aline Silva</td>
                    <td className="px-4 py-3">Consulta Inicial</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#ffb700]/20 text-[#ffb700]">AGUARDANDO WHATSAPP</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
