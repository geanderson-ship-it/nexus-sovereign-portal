"use client";

import { useState } from "react";
import { Search, ChevronLeft, Plus, User, Phone, MapPin, Calendar as CalendarIcon, FileText, Activity, Paperclip, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Dados mockados para design
const patientsList = [
  { id: 1, name: "Mariana Costa", lastVisit: "Hoje, 09:00", status: "Em Atendimento", phone: "(11) 98877-6655" },
  { id: 2, name: "Carlos Eduardo", lastVisit: "Hoje, 10:30", status: "Recepção", phone: "(11) 97766-5544" },
  { id: 3, name: "Aline Silva", lastVisit: "15/07/2026", status: "Agendado", phone: "(11) 96655-4433" },
  { id: 4, name: "Roberto Mendes", lastVisit: "02/06/2026", status: "Inativo", phone: "(11) 95544-3322" },
  { id: 5, name: "Juliana Castro", lastVisit: "10/05/2026", status: "Inativo", phone: "(11) 94433-2211" },
];

export default function ClinicPacientesPage() {
  const [activeTab, setActiveTab] = useState("evolucao");
  
  return (
    <div className="min-h-screen bg-[#050a11] text-gray-100 flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
      
      {/* Header */}
      <header className="h-16 border-b border-[#ffffff0a] bg-[rgba(11,18,30,0.3)] backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/nexus-health/clinic" className="text-gray-400 hover:text-[#00f0ff] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#00f0ff]" />
            <h1 className="font-bold text-lg text-white">Prontuário e Pacientes</h1>
          </div>
        </div>

        <button className="px-4 py-1.5 text-sm font-bold bg-[#00f0ff] text-black rounded-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Paciente
        </button>
      </header>

      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto relative z-10 flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Coluna Esquerda: Lista de Pacientes */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-hidden bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="p-4 border-b border-[#ffffff0a]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar por nome ou CPF..." 
                className="w-full pl-9 pr-4 py-2 bg-[#00000033] border border-[#ffffff1a] rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00f0ff] transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {patientsList.map((patient) => (
              <div 
                key={patient.id}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  patient.id === 1 
                  ? "bg-[#00f0ff]/10 border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.05)]" 
                  : "bg-transparent border-transparent hover:bg-[#ffffff05]"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-sm ${patient.id === 1 ? "text-white" : "text-gray-300"}`}>
                    {patient.name}
                  </h3>
                  {patient.status === "Em Atendimento" && (
                    <span className="w-2 h-2 rounded-full bg-[#00ffaa] shadow-[0_0_5px_#00ffaa] animate-pulse"></span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {patient.lastVisit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Direita: Prontuário Aberto */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          
          {/* Header do Prontuário */}
          <div className="p-6 border-b border-[#ffffff0a] flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-black/20">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#00ffaa] p-[2px] shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <div className="w-full h-full bg-[#050a11] rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">MC</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Mariana Costa</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#00ffaa]/20 text-[#00ffaa] border border-[#00ffaa]/30 text-[10px] font-bold uppercase tracking-wider">
                  Convênio Bradesco Top
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> 28 anos, Feminino</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> (11) 98877-6655</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Jardins, São Paulo</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#ffffff0a] hover:bg-[#ffffff15] text-white text-xs font-bold rounded-lg transition-colors border border-[#ffffff10]">
                Ver Cadastro
              </button>
            </div>
          </div>

          {/* Abas do Prontuário */}
          <div className="flex px-6 border-b border-[#ffffff0a] gap-6">
            {[
              { id: "historico", label: "Linha do Tempo", icon: Activity },
              { id: "evolucao", label: "Evolução Médica", icon: FileText },
              { id: "exames", label: "Exames & Anexos", icon: Paperclip },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === tab.id 
                  ? "text-[#00f0ff] border-[#00f0ff]" 
                  : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo do Prontuário (Rolável) */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
            <AnimatePresence mode="wait">
              {activeTab === "evolucao" && (
                <motion.div 
                  key="evolucao"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-4xl"
                >
                  {/* Bloco de Nova Evolução */}
                  <div className="bg-[#00000040] border border-[#ffffff10] rounded-xl p-4 focus-within:border-[#00f0ff]/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Nova Evolução Clínica
                      </span>
                      <span className="text-xs text-gray-500 font-mono">18/07/2026 - 10:15</span>
                    </div>
                    <textarea 
                      placeholder="Relate aqui o atendimento, queixas, anamnese..." 
                      className="w-full h-32 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none resize-none"
                    ></textarea>
                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-[#ffffff0a]">
                      <button className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-[#ffffff10]">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="px-6 py-2 bg-[#00f0ff] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform">
                        Salvar Evolução
                      </button>
                    </div>
                  </div>

                  {/* Evoluções Anteriores */}
                  <div className="relative pl-6 border-l-2 border-[#ffffff10] space-y-8 mt-10">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#050a11] border-2 border-[#00ffaa] z-10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#00ffaa] rounded-full"></div>
                      </div>
                      <div className="bg-[#0b121e]/80 border border-[#ffffff0a] rounded-xl p-5">
                        <div className="flex justify-between mb-3 text-xs">
                          <span className="font-bold text-white">Dr. Thiago Silva (Dermatologista)</span>
                          <span className="text-gray-500 font-mono">15/06/2026</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          Paciente retorna para avaliação de protocolo de bioestimulador de colágeno (Radiesse) realizado há 30 dias. 
                          Relata ótima recuperação, sem nódulos palpáveis. Pele apresenta melhora visível em viço e tensão. 
                          <br/><br/>
                          Conduta: Seguir com rotina de skincare proposta. Retorno em 6 meses.
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#050a11] border-2 border-gray-600 z-10"></div>
                      <div className="bg-[#0b121e]/80 border border-[#ffffff0a] rounded-xl p-5 opacity-75">
                        <div className="flex justify-between mb-3 text-xs">
                          <span className="font-bold text-white">Dra. Amanda Ferraz (Estética)</span>
                          <span className="text-gray-500 font-mono">15/05/2026</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          Primeira consulta. Realizada aplicação de toxina botulínica no terço superior (glabela, frontal, periocular).
                          100U Dysport. Recomendada ausência de atividade física por 24h.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab !== "evolucao" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-gray-500"
                >
                  <Activity className="w-16 h-16 opacity-20 mb-4" />
                  <p>Módulo de {activeTab} em construção.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
