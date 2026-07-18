"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Activity, Calendar, Users, TrendingUp, DollarSign, Settings, FileText, LogOut, Clock, MoreVertical, CheckCircle2, Sun, Moon, Search, Filter, Plus, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_AGENDAS_PROFISSIONAIS = [
  {
    nome: "Dr. Fernando (Dermatologia)",
    agendamentos: [
      { hora: "08:00", paciente: "Mariana Costa", procedimento: "Toxina Botulínica", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" },
      { hora: "09:00", paciente: "Roberto Lima", procedimento: "Preenchimento Labial", status: "Em Atendimento", cor: "bg-blue-500/20 text-blue-400" },
      { hora: "10:00", paciente: "Carlos Eduardo", procedimento: "Retorno Médico", status: "Sala de Espera", cor: "bg-[#00f0ff]/20 text-[#00f0ff]" },
      { hora: "10:30", paciente: "Juliana Silva", procedimento: "Fios de PDO", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" },
      { hora: "12:00", paciente: "Almoço", procedimento: "Bloqueio de Agenda", status: "Bloqueado", cor: "bg-gray-500/20 text-gray-400" },
      { hora: "13:30", paciente: "Fernanda Souza", procedimento: "Preenchimento Labial", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" },
      { hora: "14:30", paciente: "Beatriz Santos", procedimento: "Laser Lavieen", status: "Atrasado", cor: "bg-red-500/20 text-red-400" },
      { hora: "15:30", paciente: "Ricardo Alves", procedimento: "Avaliação Capilar", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" },
      { hora: "16:30", paciente: "Horário Vago", procedimento: "-", status: "Livre", cor: "bg-[#ffffff0a] text-gray-500 border border-dashed border-gray-600" }
    ]
  },
  {
    nome: "Dra. Camila (Estética Avançada)",
    agendamentos: [
      { hora: "08:00", paciente: "Amanda Ribeiro", procedimento: "Limpeza de Pele Premium", status: "Finalizado", cor: "bg-emerald-500/20 text-emerald-500" },
      { hora: "09:30", paciente: "Thiago Mendes", procedimento: "Peeling Químico", status: "Em Atendimento", cor: "bg-blue-500/20 text-blue-400" },
      { hora: "11:00", paciente: "Aline Silva", procedimento: "Limpeza de Pele", status: "Aguardando", cor: "bg-[#ffaa00]/20 text-[#ffaa00]" },
      { hora: "12:00", paciente: "Almoço", procedimento: "Bloqueio de Agenda", status: "Bloqueado", cor: "bg-gray-500/20 text-gray-400" },
      { hora: "13:00", paciente: "Horário Vago", procedimento: "-", status: "Livre", cor: "bg-[#ffffff0a] text-gray-500 border border-dashed border-gray-600" },
      { hora: "14:00", paciente: "Roberto Lima", procedimento: "Bioestimulador", status: "Agendado via IA (Mia)", cor: "bg-[#ff5500]/20 text-[#ff5500]" },
      { hora: "15:30", paciente: "Laura Dias", procedimento: "Microagulhamento", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" },
      { hora: "17:00", paciente: "Patricia Gomes", procedimento: "Drenagem Linfática", status: "A Confirmar", cor: "bg-yellow-500/20 text-yellow-400" },
      { hora: "18:00", paciente: "Camila Barros", procedimento: "Retorno", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" }
    ]
  },
  {
    nome: "Dra. Letícia (Nutrologia)",
    agendamentos: [
      { hora: "08:30", paciente: "João Pedro", procedimento: "Bioimpedância", status: "Em Atendimento", cor: "bg-blue-500/20 text-blue-400" },
      { hora: "09:30", paciente: "Luísa Martins", procedimento: "Acompanhamento", status: "Sala de Espera", cor: "bg-[#00f0ff]/20 text-[#00f0ff]" },
      { hora: "10:30", paciente: "Marcos Paulo", procedimento: "Consulta Inicial", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" },
      { hora: "11:30", paciente: "Horário Vago", procedimento: "-", status: "Livre", cor: "bg-[#ffffff0a] text-gray-500 border border-dashed border-gray-600" },
      { hora: "13:00", paciente: "Ana Clara", procedimento: "Plano Alimentar", status: "Faltou", cor: "bg-red-500/20 text-red-500" },
      { hora: "14:00", paciente: "Sérgio Ramos", procedimento: "Exames Laboratoriais", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" },
      { hora: "15:00", paciente: "Horário Vago", procedimento: "-", status: "Livre", cor: "bg-[#ffffff0a] text-gray-500 border border-dashed border-gray-600" },
      { hora: "16:00", paciente: "Letícia Alves", procedimento: "Retorno", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" },
      { hora: "17:00", paciente: "Felipe Nunes", procedimento: "Bioimpedância", status: "Confirmado", cor: "bg-[#00ffaa]/20 text-[#00ffaa]" }
    ]
  }
];

export default function NexusClinicAdmin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState("dark");

  const menuItems = [
    { id: "dashboard", label: "Dashboard Geral", icon: TrendingUp },
    { id: "agenda", label: "Agenda Inteligente", icon: Calendar },
    { id: "pacientes", label: "Prontuários & CRM", icon: Users },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
    { id: "relatorios", label: "Relatórios", icon: FileText },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050a11] text-gray-100' : 'bg-gray-50 text-gray-900'} flex overflow-hidden transition-colors duration-500`}>
      {/* Sidebar do Especialista */}
      <aside className={`w-64 border-r ${theme === 'dark' ? 'border-white/10 bg-[#0b121e]' : 'border-gray-200 bg-white'} flex flex-col transition-colors duration-500`}>
        <div className={`h-16 flex items-center px-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#ffaa00]" />
            <span className="font-bold text-lg tracking-tight">Nexus Admin</span>
          </div>
        </div>
        
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Dr. Especialista</p>
          <p className={`text-xs ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'} flex items-center gap-1`}>
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div> Online
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? (theme === 'dark' ? 'bg-[#ffaa00]/10 text-[#ffaa00]' : 'bg-orange-50 text-orange-600') 
                  : (theme === 'dark' ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100')
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <Link href="/nexus-health/clinic" className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-400' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}>
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sair do Sistema</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        <div className={`absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none ${theme === 'light' ? 'invert opacity-[0.05]' : ''}`}></div>
        
        {/* Luzes de Fundo (Admin Mode) */}
        <div className={`fixed top-[-10%] right-[-5%] w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none ${theme === 'dark' ? 'mix-blend-screen' : 'mix-blend-multiply opacity-20'} z-0`}></div>
        
        <header className={`h-16 border-b ${theme === 'dark' ? 'border-white/10 bg-[rgba(11,18,30,0.8)]' : 'border-gray-200 bg-white/80'} backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20`}>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Painel Administrativo</h2>
        </header>

        {activeTab === 'dashboard' && <DashboardView theme={theme} />}
        {activeTab === 'relatorios' && <RelatoriosView theme={theme} />}
        {activeTab === 'agenda' && <AgendaView theme={theme} />}
        {activeTab === 'pacientes' && <PacientesView theme={theme} />}
        {activeTab === 'financeiro' && <FinanceiroView theme={theme} />}
        {activeTab === 'configuracoes' && <ConfiguracoesView theme={theme} setTheme={setTheme} />}
      </main>
    </div>
  );
}

// ─── Componentes ─────────────────────────────────────────────────────────────

function DashboardView({ theme }: { theme: string }) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const detalhesGerais: Record<string, any> = {
    consultas: {
      titulo: "Agenda de Hoje",
      itens: [
        { desc: "08:00 - Dr. Fernando Silva", detalhe: "Retorno - Avaliação Pós-cirúrgica" },
        { desc: "09:30 - Mariana Costa", detalhe: "Procedimento: Toxina Botulínica" },
        { desc: "10:15 - Carlos Eduardo", detalhe: "Avaliação Inicial" },
        { desc: "11:00 - Aline Souza", detalhe: "Limpeza de Pele Profunda" }
      ]
    },
    retidos: {
      titulo: "Pacientes Retidos (Mia IA)",
      itens: [
        { desc: "Conversões pelo WhatsApp", detalhe: "6 pacientes agendados nas últimas 24h" },
        { desc: "Resgate de Inativos", detalhe: "2 pacientes de meses anteriores retornaram" },
        { desc: "Ticket Médio IA", detalhe: "R$ 450,00 por atendimento gerado" }
      ]
    },
    faturamento: {
      titulo: "Projeção Financeira Diária",
      itens: [
        { desc: "Recebimentos Confirmados", detalhe: "R$ 2.500,00 (Pagos antecipadamente)" },
        { desc: "A Receber no Local", detalhe: "R$ 1.750,00 (Dinheiro / Cartão)" },
        { desc: "Procedimentos Extras", detalhe: "Estimativa de R$ 500,00 em upsells" }
      ]
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Visão Geral</h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Bem-vindo de volta, Dr. Especialista.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setSelectedCard('consultas')}
          className={`text-left rounded-xl p-6 border-t border-t-[#00f0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff0a]' : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'}`}
        >
          <div className={`text-sm font-medium mb-2 flex items-center justify-between transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Consultas Hoje
            <Calendar className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className={`text-3xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>24</div>
          <div className="text-xs text-[#00ffaa] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% vs Ontem
          </div>
          <div className={`text-[10px] mt-4 uppercase font-bold tracking-wider opacity-60 ${theme === 'dark' ? 'text-[#00f0ff]' : 'text-blue-500'}`}>Explorar agenda →</div>
        </button>

        <button 
          onClick={() => setSelectedCard('retidos')}
          className={`text-left rounded-xl p-6 border-t border-t-[#00ffaa] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff0a]' : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200'}`}
        >
          <div className={`text-sm font-medium mb-2 flex items-center justify-between transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Pacientes Retidos (IA)
            <Users className="w-4 h-4 text-[#00ffaa]" />
          </div>
          <div className={`text-3xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>8</div>
          <div className={`text-xs mt-2 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Agendados via assistente Evolution
          </div>
          <div className={`text-[10px] mt-4 uppercase font-bold tracking-wider opacity-60 ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'}`}>Ver relatório da IA →</div>
        </button>

        <button 
          onClick={() => setSelectedCard('faturamento')}
          className={`text-left rounded-xl p-6 border-t border-t-[#ffaa00] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff0a]' : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-yellow-200'}`}
        >
          <div className={`text-sm font-medium mb-2 flex items-center justify-between transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Faturamento Previsto
            <Activity className="w-4 h-4 text-[#ffaa00]" />
          </div>
          <div className={`text-3xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ 4.250</div>
          <div className={`text-xs mt-2 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Baseado em procedimentos marcados
          </div>
          <div className={`text-[10px] mt-4 uppercase font-bold tracking-wider opacity-60 text-[#ffaa00]`}>Detalhar projeção →</div>
        </button>
      </div>

      <div className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Monitoramento de Agendas</h2>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Acompanhe o fluxo de todos os profissionais em tempo real.</p>
          </div>
          <Link href="/nexus-health/clinic/admin?tab=agenda">
            <button className={`text-sm font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-[#00ffaa] hover:text-white' : 'text-emerald-600 hover:text-emerald-800'} transition-colors`}>
              Ver Agenda Completa →
            </button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {MOCK_AGENDAS_PROFISSIONAIS.map((prof, pIdx) => (
            <div key={pIdx} className={`rounded-xl border flex flex-col min-w-[300px] ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)]' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#ffffff1a]' : 'border-gray-100'}`}>
                <div className="flex items-center gap-2">
                  <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-[#ffaa00]' : 'text-orange-500'}`} />
                  <h3 className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{prof.nome}</h3>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap ${theme === 'dark' ? 'bg-[#ff5500]/20 text-[#ffaa00]' : 'bg-orange-100 text-orange-600'}`}>
                  {prof.agendamentos.length} Hoje
                </span>
              </div>
              
              <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
                {prof.agendamentos.map((ag, i) => (
                  <div key={i} className={`p-3 rounded-lg border flex flex-col gap-3 transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5 ${theme === 'dark' ? 'bg-[#00000055] border-white/10 hover:border-[#ffaa00]/30' : 'bg-gray-50 border-gray-200 hover:border-orange-200'}`}>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-bold ${theme === 'dark' ? 'bg-[#1a2332] text-white' : 'bg-white shadow-sm text-gray-900'}`}>
                          {ag.hora}
                        </div>
                        <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{ag.paciente}</h4>
                      </div>
                    </div>

                    <div>
                      <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{ag.procedimento}</p>
                      <span className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${ag.cor}`}>
                        {ag.status}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mounted && typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
          {selectedCard && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pt-20 sm:pt-4"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${theme === 'dark' ? 'bg-[#0b121e] border border-white/10' : 'bg-white border-gray-200'}`}
              >
                <div className={`p-6 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'border-[#ffffff1a]' : 'border-gray-200'}`}>
                  <div>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {detalhesGerais[selectedCard].titulo}
                    </h2>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Resumo analítico do indicador selecionado.
                    </p>
                  </div>
                  <button onClick={() => setSelectedCard(null)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-4 custom-scrollbar">
                  {detalhesGerais[selectedCard].itens.map((item: any, idx: number) => (
                    <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-1 ${theme === 'dark' ? 'bg-[#00000055] border-white/10' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
                      <p className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{item.desc}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.detalhe}</p>
                    </div>
                  ))}
                  
                  <div className="pt-4 flex justify-end">
                    <button onClick={() => setSelectedCard(null)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                      Fechar Detalhamento
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      ) : null}
    </motion.div>
  );
}

function RelatoriosView({ theme }: { theme: string }) {
  const desempenhoIA = [
    { label: "Taxa de Resposta (< 1 min)", value: "98%", progress: "w-[98%]" },
    { label: "Conversão em Agendamentos", value: "45%", progress: "w-[45%]" },
    { label: "Resgate de Pacientes Inativos", value: "22%", progress: "w-[22%]" },
  ];

  const topProcedimentos = [
    { nome: "Toxina Botulínica", qtd: 145, receita: "R$ 174.000", bg: "bg-[#00ffaa]" },
    { nome: "Preenchimento Labial", qtd: 98, receita: "R$ 117.600", bg: "bg-[#00f0ff]" },
    { nome: "Bioestimulador", qtd: 76, receita: "R$ 152.000", bg: "bg-[#ffaa00]" },
    { nome: "Limpeza de Pele Premium", qtd: 210, receita: "R$ 63.000", bg: "bg-emerald-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Relatórios de Performance</h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Análise avançada dos indicadores da sua clínica.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${theme === 'dark' ? 'bg-[#ffffff10] text-gray-300 hover:bg-[#ffffff1a]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <Filter className="w-4 h-4" />
            Este Mês
          </button>
          <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg flex items-center gap-2 ${theme === 'dark' ? 'bg-[#00ffaa] text-black hover:bg-[#00e699]' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>
            <FileText className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Desempenho IA Mia */}
        <div className={`rounded-xl border p-6 flex flex-col ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)]' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#00ffaa]/10 text-[#00ffaa]' : 'bg-emerald-100 text-emerald-600'}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Desempenho da Inteligência Artificial</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Métricas da assistente virtual (Mia).</p>
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            {desempenhoIA.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.label}</span>
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div className={`h-full rounded-full transition-all duration-1000 ${item.progress} ${theme === 'dark' ? 'bg-[#00ffaa]' : 'bg-emerald-500'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Procedimentos */}
        <div className={`rounded-xl border p-6 flex flex-col ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)]' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#ffaa00]/10 text-[#ffaa00]' : 'bg-orange-100 text-orange-600'}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Top 4 Procedimentos</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Serviços que mais geraram receita no período.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {topProcedimentos.map((proc, idx) => (
              <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between ${theme === 'dark' ? 'bg-[#00000055] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${proc.bg}`}></div>
                  <div>
                    <p className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{proc.nome}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{proc.qtd} procedimentos</p>
                  </div>
                </div>
                <div className={`font-bold ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'}`}>
                  {proc.receita}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}

function AgendaView({ theme }: { theme: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Agenda Inteligente</h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Sincronizada em tempo real com a atendente virtual Mia.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === 'dark' ? 'bg-[#ffffff10] text-gray-300 hover:bg-[#ffffff1a]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Mês
          </button>
          <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-[#ffaa00] to-[#ff5500] text-white' : 'bg-orange-500 text-white'}`}>
            Hoje
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {MOCK_AGENDAS_PROFISSIONAIS.map((prof, pIdx) => (
          <div key={pIdx} className={`rounded-xl border flex flex-col min-w-[300px] ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)]' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#ffffff1a]' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-[#ffaa00]' : 'text-orange-500'}`} />
                <h3 className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{prof.nome}</h3>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap ${theme === 'dark' ? 'bg-[#ff5500]/20 text-[#ffaa00]' : 'bg-orange-100 text-orange-600'}`}>
                {prof.agendamentos.length} Hoje
              </span>
            </div>
            
            <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              {prof.agendamentos.map((ag, i) => (
                <div key={i} className={`p-3 rounded-lg border flex flex-col gap-3 transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5 ${theme === 'dark' ? 'bg-[#00000055] border-white/10 hover:border-[#ffaa00]/30' : 'bg-gray-50 border-gray-200 hover:border-orange-200'}`}>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${theme === 'dark' ? 'bg-[#1a2332] text-white' : 'bg-white shadow-sm text-gray-900'}`}>
                        {ag.hora}
                      </div>
                      <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{ag.paciente}</h4>
                    </div>
                    <button className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{ag.procedimento}</p>
                    <span className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${ag.cor}`}>
                      {ag.status}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PacientesView({ theme }: { theme: string }) {
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pacientes = [
    { nome: "Mariana Costa", idade: 32, ultimaVisita: "10/07/2026", status: "Em Tratamento", totalGasto: "R$ 4.500", telefone: "(11) 98888-7777", email: "mariana.c@email.com", historico: ["Toxina Botulínica (10/07/2026)", "Limpeza de Pele (15/05/2026)"] },
    { nome: "Carlos Eduardo", idade: 45, ultimaVisita: "15/06/2026", status: "Retorno", totalGasto: "R$ 1.200", telefone: "(11) 97777-6666", email: "carlos.e@email.com", historico: ["Avaliação Estética (15/06/2026)"] },
    { nome: "Aline Silva", idade: 28, ultimaVisita: "Novo", status: "Avaliação", totalGasto: "R$ 0", telefone: "(11) 96666-5555", email: "aline.s@email.com", historico: ["Agendamento Inicial (Hoje)"] },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>CRM & Prontuários</h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gestão completa do ciclo de vida dos seus pacientes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              className={`pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-[#00ffaa] w-64 ${theme === 'dark' ? 'bg-[#00000055] border border-white/10 text-white placeholder:text-gray-500' : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
            />
          </div>
          <button className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-[#ffffff10] text-gray-300 hover:bg-[#ffffff1a]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <Filter className="w-5 h-5" />
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-[#00ffaa] to-[#00cc88] text-black' : 'bg-emerald-500 text-white'}`}>
            <Plus className="w-4 h-4" /> Novo Paciente
          </button>
        </div>
      </div>

      <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)]' : 'bg-white border-gray-200 shadow-sm'}`}>
        <table className="w-full text-left text-sm">
          <thead className={`border-b ${theme === 'dark' ? 'border-[#ffffff1a] bg-[#ffffff05] text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-4 font-bold">Paciente</th>
              <th className="px-6 py-4 font-bold">Idade</th>
              <th className="px-6 py-4 font-bold">Última Visita</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Total Investido</th>
              <th className="px-6 py-4 font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#ffffff0a]' : 'divide-gray-100'}`}>
            {pacientes.map((p, i) => (
              <tr key={i} className={`transition-colors ${theme === 'dark' ? 'hover:bg-[#ffffff05]' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 font-medium flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${theme === 'dark' ? 'bg-[#111827] text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                    {p.nome.charAt(0)}
                  </div>
                  <button 
                    onClick={() => setSelectedPaciente(p)}
                    className={`hover:underline cursor-pointer text-left ${theme === 'dark' ? 'hover:text-[#00ffaa]' : 'hover:text-emerald-600'}`}
                  >
                    {p.nome}
                  </button>
                </td>
                <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{p.idade} anos</td>
                <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{p.ultimaVisita}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    p.status === 'Avaliação' ? 'bg-[#ffaa00]/20 text-[#ffaa00]' : 
                    p.status === 'Retorno' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 
                    'bg-[#00ffaa]/20 text-[#00ffaa]'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className={`px-6 py-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{p.totalGasto}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedPaciente(p)}
                    className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-[#00ffaa] hover:text-white' : 'text-emerald-600 hover:text-emerald-800'}`}
                  >
                    Ver Prontuário
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Prontuário do Paciente (Portal) */}
      {mounted && typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
        {selectedPaciente && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pt-20 sm:pt-4"
            onClick={() => setSelectedPaciente(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${theme === 'dark' ? 'bg-[#0b121e] border border-white/10' : 'bg-white border-gray-200'}`}
            >
              <div className={`p-6 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'border-[#ffffff1a]' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${theme === 'dark' ? 'bg-[#00ffaa]/20 text-[#00ffaa]' : 'bg-emerald-100 text-emerald-600'}`}>
                    {selectedPaciente.nome.charAt(0)}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedPaciente.nome}</h2>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{selectedPaciente.idade} anos • {selectedPaciente.telefone}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPaciente(null)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 pb-12 overflow-y-auto flex-1 min-h-0 space-y-6 custom-scrollbar">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#00000033] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Status Atual</p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'}`}>{selectedPaciente.status}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#00000033] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Total Investido</p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedPaciente.totalGasto}</p>
                  </div>
                </div>

                <div>
                  <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Histórico de Atendimentos</h3>
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:left-[11px] before:w-0.5 before:bg-gradient-to-b before:from-[#00ffaa] before:to-transparent before:h-full">
                    {selectedPaciente.historico.map((item: string, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full border-4 border-[#0b121e] bg-[#00ffaa] shadow-lg top-1"></div>
                        <button className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${theme === 'dark' ? 'bg-[#00000055] border-white/10 hover:bg-[#00ffaa]/10 hover:border-[#00ffaa]/50' : 'bg-white border-gray-200 shadow-sm hover:bg-emerald-50 hover:border-emerald-200'}`}>
                          <p className={`font-medium text-sm transition-colors ${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-emerald-700'}`}>{item}</p>
                          <p className={`text-xs mt-1 transition-colors opacity-0 group-hover:opacity-100 ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'}`}>Visualizar detalhes da consulta →</p>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Anotações do Médico</h3>
                  <textarea 
                    className={`w-full p-4 rounded-xl text-sm border focus:outline-none focus:border-[#00ffaa] transition-colors resize-none h-24 ${theme === 'dark' ? 'bg-[#00000055] border-white/10 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                    placeholder="Adicionar nota ao prontuário..."
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-[#00ffaa]/20 text-[#00ffaa] hover:bg-[#00ffaa]/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                      Salvar Nota
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      ) : null}

    </motion.div>
  );
}

function FinanceiroView({ theme }: { theme: string }) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const detalhesFinanceiros: Record<string, any[]> = {
    faturamento: [
      { data: "18/07/2026", desc: "Mariana Costa - Harmonização Facial", valor: "R$ 4.500", tipo: "entrada" },
      { data: "18/07/2026", desc: "Carlos Eduardo - Bioestimulador", valor: "R$ 1.200", tipo: "entrada" },
      { data: "17/07/2026", desc: "Amanda Ribeiro - Toxina Botulínica", valor: "R$ 1.500", tipo: "entrada" }
    ],
    despesas: [
      { data: "20/07/2026", desc: "Fornecedor: Galderma", valor: "R$ 15.500", tipo: "saida" },
      { data: "22/07/2026", desc: "Marketing e Tráfego Pago", valor: "R$ 5.000", tipo: "saida" },
      { data: "25/07/2026", desc: "Aluguel Clínica Premium", valor: "R$ 12.000", tipo: "saida" }
    ],
    saldo: [
      { data: "Próx. 30 dias", desc: "Previsão de Recebimentos", valor: "R$ 125.000", tipo: "entrada" },
      { data: "Próx. 30 dias", desc: "Previsão de Custos", valor: "R$ 42.000", tipo: "saida" },
      { data: "Próx. 30 dias", desc: "Reserva de Lucro", valor: "R$ 83.000", tipo: "entrada" }
    ]
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Módulo Financeiro</h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Controle de receitas, despesas e fluxo de caixa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setSelectedCard('faturamento')}
          className={`text-left rounded-xl p-6 border-t border-t-[#00ffaa] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff0a]' : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200'}`}
        >
          <div className={`text-sm font-medium mb-2 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Faturamento do Mês</div>
          <div className={`text-3xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ 142.500</div>
          <div className="text-xs text-[#00ffaa] mt-2">+18% em relação ao mês passado</div>
          <div className={`text-[10px] mt-4 uppercase font-bold tracking-wider opacity-60 ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'}`}>Ver detalhamento →</div>
        </button>

        <button 
          onClick={() => setSelectedCard('despesas')}
          className={`text-left rounded-xl p-6 border-t border-t-red-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff0a]' : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-red-200'}`}
        >
          <div className={`text-sm font-medium mb-2 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Despesas Previstas</div>
          <div className={`text-3xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ 38.200</div>
          <div className="text-xs text-red-400 mt-2">Próximo vencimento em 2 dias</div>
          <div className={`text-[10px] mt-4 uppercase font-bold tracking-wider opacity-60 text-red-500`}>Ver detalhamento →</div>
        </button>

        <button 
          onClick={() => setSelectedCard('saldo')}
          className={`text-left rounded-xl p-6 border-t border-t-[#00f0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff0a]' : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'}`}
        >
          <div className={`text-sm font-medium mb-2 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Saldo Líquido Projetado</div>
          <div className={`text-3xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ 104.300</div>
          <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Margem de lucro de 73%</div>
          <div className={`text-[10px] mt-4 uppercase font-bold tracking-wider opacity-60 ${theme === 'dark' ? 'text-[#00f0ff]' : 'text-blue-500'}`}>Ver detalhamento →</div>
        </button>
      </div>

      {mounted && typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
          {selectedCard && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pt-20 sm:pt-4"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${theme === 'dark' ? 'bg-[#0b121e] border border-white/10' : 'bg-white border-gray-200'}`}
              >
                <div className={`p-6 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'border-[#ffffff1a]' : 'border-gray-200'}`}>
                  <div>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedCard === 'faturamento' ? 'Detalhamento de Faturamento' : selectedCard === 'despesas' ? 'Detalhamento de Despesas' : 'Projeção de Saldo'}
                    </h2>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Extrato completo dos valores referentes a este módulo.
                    </p>
                  </div>
                  <button onClick={() => setSelectedCard(null)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-4 custom-scrollbar">
                  {detalhesFinanceiros[selectedCard].map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${theme === 'dark' ? 'bg-[#00000055] border-white/10' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
                      <div>
                        <p className={`font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.desc}</p>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{item.data}</p>
                      </div>
                      <div className={`font-bold text-lg ${item.tipo === 'entrada' ? (theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600') : 'text-red-500'}`}>
                        {item.tipo === 'entrada' ? '+' : '-'} {item.valor}
                      </div>
                    </div>
                  ))}
                  <div className={`mt-6 p-4 rounded-xl border-dashed border-2 flex items-center justify-between opacity-50 cursor-not-allowed ${theme === 'dark' ? 'border-white/20 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                    <span className="text-sm font-medium">Baixar Relatório Completo (PDF/Excel)</span>
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      ) : null}
    </motion.div>
  );
}

function ConfiguracoesView({ theme, setTheme }: { theme: string, setTheme: (val: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-3xl mx-auto w-full relative z-10 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Configurações da Plataforma</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Ajuste as preferências visuais e operacionais.</p>
      </div>

      <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)]' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Aparência</h3>
        
        <div className="flex items-center justify-between py-3 border-b border-[#ffffff0a]">
          <div>
            <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tema da Interface</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Alternar entre modo claro e escuro</p>
          </div>
          <div className={`flex items-center gap-2 p-1 rounded-xl ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-100'}`}>
            <button 
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Sun className="w-4 h-4" /> Claro
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-[#1a2332] text-white shadow-md border border-white/5' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Moon className="w-4 h-4" /> Escuro
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
