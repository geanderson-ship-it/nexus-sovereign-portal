"use client";

import { useState, useRef, useEffect } from "react";
import { Activity, Calendar, Users, TrendingUp, Bell, Search, Menu, DollarSign, ExternalLink, ChevronDown, Settings, FileText, HeartPulse, LogOut, Sun, Moon, Lock, Star, Heart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NexusEstimaDashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Por padrão, a aba pública do cliente
  const [activeTab, setActiveTab] = useState("servicos");
  const [theme, setTheme] = useState("dark");
  const [selectedProf, setSelectedProf] = useState<any>(null);
  const [selectedEspec, setSelectedEspec] = useState<any>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050a11] text-gray-100' : 'bg-gray-50 text-gray-900'} flex overflow-hidden transition-colors duration-500`}>
      {/* Sidebar - Portal do Tutor */}
      <aside className={`w-64 border-r ${theme === 'dark' ? 'border-[#ffffff0a] bg-[rgba(11,18,30,0.5)]' : 'border-gray-200 bg-white'} backdrop-blur-md hidden md:flex flex-col transition-colors duration-500`}>
        <div className={`h-16 flex items-center px-6 border-b ${theme === 'dark' ? 'border-[#ffffff0a]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#f59e0b]" />
            <span className="font-bold text-lg tracking-tight">Vet Care Plus</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className={`mb-6 pb-6 border-b ${theme === 'dark' ? 'border-[#ffffff0a]' : 'border-gray-200'}`}>
            <Link href="/nexus-health/estima/agendar" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] hover:bg-[#f59e0b]/20 transition-colors w-full group shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <span className="font-bold text-sm">Agendar Consulta</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center mt-2 px-2 italic`}>Falar com a Atendente Luna</p>
          </div>
          
          <button onClick={() => setActiveTab('servicos')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'servicos' ? 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' : (theme === 'dark' ? 'text-gray-400 hover:bg-[#ffffff05] hover:text-white' : 'text-gray-600 hover:bg-gray-100')}`}>
            <HeartPulse className="w-5 h-5" />
            <span className="font-medium text-sm">Serviços Veterinários</span>
          </button>
          <button onClick={() => setActiveTab('corpo-clinico')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'corpo-clinico' ? 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' : (theme === 'dark' ? 'text-gray-400 hover:bg-[#ffffff05] hover:text-white' : 'text-gray-600 hover:bg-gray-100')}`}>
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Corpo Clínico</span>
          </button>
          <button onClick={() => setActiveTab('resultados')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'resultados' ? 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' : (theme === 'dark' ? 'text-gray-400 hover:bg-[#ffffff05] hover:text-white' : 'text-gray-600 hover:bg-gray-100')}`}>
            <Star className="w-5 h-5" />
            <span className="font-medium text-sm">Histórias de Sucesso</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-y-auto custom-scrollbar">
        <div className={`absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none ${theme === 'light' ? 'invert opacity-[0.05]' : ''}`}></div>
        
        {/* Luzes Âmbar (Estilo Warm/Pet) no Fundo */}
        <div className={`fixed top-[-10%] right-[-5%] w-[800px] h-[800px] bg-amber-500/30 rounded-full blur-[150px] pointer-events-none ${theme === 'dark' ? 'mix-blend-screen opacity-70' : 'mix-blend-multiply opacity-60'} z-0`}></div>
        <div className={`fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none ${theme === 'dark' ? 'mix-blend-screen opacity-60' : 'mix-blend-multiply opacity-50'} z-0`}></div>
        
        {/* Header */}
        <header className={`h-16 border-b ${theme === 'dark' ? 'border-[#ffffff0a] bg-[rgba(11,18,30,0.3)]' : 'border-gray-200 bg-white/80'} backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-500`}>
          <div className="flex items-center gap-4">
            <button className={`md:hidden ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600'}`}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input 
                type="text" 
                placeholder="Buscar exames ou veterinários..." 
                className={`pl-9 pr-4 py-1.5 rounded-lg text-sm transition-all focus:outline-none focus:border-[#f59e0b] w-72 ${theme === 'dark' ? 'bg-[#00000033] border-[#ffffff1a] text-white placeholder:text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Link para Acesso do Especialista */}
            <Link 
              href="/nexus-health/estima/agenda"
              className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-colors border border-transparent ${theme === 'dark' ? 'hover:bg-white/5 hover:border-white/10' : 'hover:bg-gray-100 hover:border-gray-200'}`}
              title="Acesso Restrito para Veterinários"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#111827] text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                <Lock className="w-4 h-4" />
              </div>
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Acesso Veterinário (Agenda)</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Content Area */}
        {activeTab === 'servicos' && <ServicosView theme={theme} onSelectEspec={setSelectedEspec} />}
        {activeTab === 'corpo-clinico' && <CorpoClinicoView theme={theme} onSelectProf={setSelectedProf} />}
        {activeTab === 'resultados' && <ResultadosView theme={theme} />}

        {/* Modal de Detalhes do Médico */}
        <AnimatePresence>
          {selectedProf && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setSelectedProf(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-2xl w-full rounded-2xl overflow-hidden flex flex-col md:flex-row ${theme === 'dark' ? 'bg-[#0b121e] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]' : 'bg-white shadow-2xl'}`}
              >
                {/* Lado da Imagem */}
                <div className={`md:w-2/5 flex flex-col justify-end min-h-[300px] relative ${theme === 'dark' ? 'bg-[#050a11]' : 'bg-gray-50'}`}>
                  {selectedProf.imagem && (
                    <img src={selectedProf.imagem} alt={selectedProf.nome} className="absolute inset-0 w-full h-full object-cover object-top scale-[1.1] mt-4" />
                  )}
                  {/* Gradiente */}
                  <div className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${theme === 'dark' ? 'from-[#0b121e]' : 'from-white'} to-transparent z-10 md:hidden`} />
                </div>

                {/* Detalhes do Veterinário */}
                <div className="md:w-3/5 p-8 relative z-20">
                  <button 
                    onClick={() => setSelectedProf(null)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    ✕
                  </button>
                  
                  <h2 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedProf.nome}</h2>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-amber-600'}`}>{selectedProf.cargo}</p>
                  <div className="inline-block px-3 py-1 mb-6 rounded-md text-xs font-semibold bg-orange-500/10 text-orange-500">
                    {selectedProf.especialidade} • {selectedProf.registro}
                  </div>
                  
                  <h4 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Formação e Experiência</h4>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedProf.formacao}
                  </p>

                  <div className="mt-8 pt-6 border-t border-gray-500/20">
                    <Link href="#" className="w-full flex justify-center py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:opacity-90 transition-all">
                      Agendar Consulta com {selectedProf.nome.split(" ")[1] || selectedProf.nome.split(" ")[0]}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Detalhes do Serviço */}
        <AnimatePresence>
          {selectedEspec && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setSelectedEspec(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-xl w-full rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#0b121e] border border-white/10 shadow-[0_0_50px_rgba(245,158,11,0.15)]' : 'bg-white shadow-2xl'}`}
              >
                <div className="p-8 relative z-20">
                  <button 
                    onClick={() => setSelectedEspec(null)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    ✕
                  </button>
                  
                  <div className="inline-block px-3 py-1 mb-4 rounded-md text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500">
                    {selectedEspec.cat}
                  </div>
                  
                  <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedEspec.nome}</h2>
                  <p className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-amber-600'}`}>{selectedEspec.desc}</p>
                  
                  <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-orange-50 border border-orange-100'}`}>
                    <h4 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Detalhes e Benefícios</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedEspec.detalhes}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Valor Estimado:</span>
                    <span className={`text-xl font-bold ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-amber-600'}`}>{selectedEspec.preco}</span>
                  </div>

                  <Link href="#" className="w-full flex justify-center py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:opacity-90 transition-all">
                    Agendar para o meu Pet
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Contact Consultants Card */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-16 pb-24 z-[100] relative">
        <div className="bg-gradient-to-br from-[#111a2a] to-[#0a0f18] border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#25D366] opacity-10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Fale com um Especialista</h3>
              <p className="text-sm text-gray-400 max-w-sm">Dúvidas sobre o sistema? Nossos consultores estão prontos para um atendimento ágil e personalizado.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a 
                href="https://wa.me/5551999799582" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-1 md:flex-none items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#20b858] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.2)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Geanderson
              </a>
              <a 
                href="https://wa.me/5551999029371" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-1 md:flex-none items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#20b858] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.2)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Ivoni
              </a>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}

// ─── Sub-Components (Views) ──────────────────────────────────────────────────

function ServicosView({ theme, onSelectEspec }: { theme: string, onSelectEspec: (e: any) => void }) {
  const procedimentos = [
    { nome: "Consulta de Rotina e Check-up", desc: "Avaliação clínica completa do seu pet", preco: "R$ 180", cat: "Clínica Geral", detalhes: "Check-up completo incluindo ausculta cardíaca, pulmonar, avaliação de peso, orelhas, dentes e pelagem. Prevenir é o maior ato de amor pelo seu companheiro." },
    { nome: "Internação e UTI 24h", desc: "Monitoramento intensivo e suporte avançado à vida", preco: "Sob Consulta", cat: "Hospitalar", detalhes: "Estrutura completa de Terapia Intensiva (UTI) funcionando 24 horas por dia. Contamos com ventilação mecânica, monitoramento multiparamétrico e médicos intensivistas dedicados para pacientes críticos." },
    { nome: "Cirurgia Ortopédica Complexa", desc: "Correções articulares e de fraturas", preco: "Sob Avaliação", cat: "Centro Cirúrgico", detalhes: "Centro cirúrgico de ponta para tratamento de rupturas de ligamento, luxações patelares e fraturas complexas. Utilizamos materiais de implante de alta tecnologia para garantir o retorno da mobilidade." },
    { nome: "Neurocirurgia Veterinária", desc: "Tratamento de hérnias de disco e medula", preco: "Sob Avaliação", cat: "Centro Cirúrgico", detalhes: "Cirurgias de altíssima precisão no sistema nervoso central e periférico. Focada em devolver a capacidade de locomoção e aliviar dores severas causadas por compressões medulares." },
    { nome: "Ultrassonografia Abdominal", desc: "Diagnóstico por imagem de alta definição", preco: "R$ 220", cat: "Exames de Imagem", detalhes: "Exame fundamental para visualizar o sistema gastrointestinal, fígado, rins e baço do animal, auxiliando no diagnóstico precoce de inúmeras doenças silenciosas." },
    { nome: "Vacinação Imunológica Inteligente", desc: "Controle e aplicação com lembretes via IA (Luna)", preco: "A partir de R$ 90", cat: "Prevenção", detalhes: "Mantenha o calendário vacinal do seu pet em dia com vacinas importadas de altíssima eficácia. A nossa IA Luna acompanha os prazos e te avisa pelo WhatsApp." },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Centro Cirúrgico e Serviços Veterinários</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Estrutura de Hospital Veterinário Completo: desde a prevenção até cirurgias de alta complexidade e UTI 24h.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {procedimentos.map((p, i) => (
          <div 
            key={i} 
            onClick={() => onSelectEspec(p)}
            className={`p-5 rounded-xl border transition-all hover:scale-[1.03] cursor-pointer relative group overflow-hidden ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff0a] hover:border-amber-500/30' : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-amber-400'}`}
          >
            {/* Brilho hover sutil */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-500/0 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="inline-block px-2 py-1 rounded-md text-[10px] font-bold mb-3 uppercase tracking-wider bg-orange-500/10 text-orange-500">
              {p.cat}
            </div>
            <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{p.nome}</h3>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{p.desc}</p>
            <div className="flex items-center justify-between border-t border-[#ffffff0a] pt-3 mt-auto">
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-amber-600'}`}>{p.preco}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CorpoClinicoView({ theme, onSelectProf }: { theme: string, onSelectProf: (prof: any) => void }) {
  const profissionais = [
    { 
      nome: "Dra. Marina Silva",
      cargo: "Médica Veterinária", 
      registro: "CRMV 12345", 
      especialidade: "Medicina Felina",
      imagem: "/dra-camila.png", // Reusing an existing placeholder
      formacao: "Especialista em felinos pela USP. Possui certificação Cat Friendly, garantindo um atendimento sem estresse para gatos. Experiência de 8 anos em clínicas intensivas."
    },
    { 
      nome: "Dr. Rafael", 
      cargo: "Cirurgião Chefe", 
      registro: "CRMV 6789", 
      especialidade: "Neurocirurgia e Ortopedia",
      imagem: "/cirurgiao-animal.png", 
      formacao: "Referência nacional em neurocirurgia e ortopedia veterinária. Mestre em cirurgia de tecidos complexos e idealizador da UTI cirúrgica avançada da Nexus Estima. Realiza procedimentos complexos de recuperação articular e medular em cães e gatos."
    },
    { 
      nome: "Dra. Beatriz Santos", 
      cargo: "Veterinária Nutróloga", 
      registro: "CRMV 1011", 
      especialidade: "Nutrição e Dermatologia",
      imagem: "/dra-ana.png", // Reusing an existing placeholder
      formacao: "Especialista em dermatologia e nutrição animal. Trabalha formulando dietas naturais e tratando alergias crônicas de pele, devolvendo o bem-estar ao animal."
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Nosso Corpo Clínico Veterinário</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Profissionais dedicados a tratar seu pet com o mesmo amor que você.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profissionais.map((prof, i) => (
          <div 
            key={i} 
            onClick={() => onSelectProf(prof)}
            className={`cursor-pointer flex flex-col items-center text-center p-6 rounded-xl border ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff05]' : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1'} transition-all`}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#f59e0b] to-[#ea580c] p-[3px] mb-5 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-105 transition-transform">
              <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-[#0b121e]' : 'bg-white'}`}>
                {prof.imagem ? (
                  <img src={prof.imagem} alt={prof.nome} className="w-full h-full object-cover object-top scale-[1.2] mt-2 pointer-events-none" />
                ) : (
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{prof.nome.charAt(0)}</span>
                )}
              </div>
            </div>
            <h3 className={`font-bold text-xl mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{prof.nome}</h3>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-amber-600'} mb-1`}>{prof.cargo}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-3`}>{prof.especialidade} • {prof.registro}</p>
            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>Ver Perfil</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ResultadosView({ theme }: { theme: string }) {
  const cases = [
    {
      imagem: "/thor-golden.jpg",
      paciente: "Thor (Golden Retriever)",
      procedimento: "Cirurgia Ortopédica Avançada",
      depoimento: "O Thor rompeu o ligamento correndo no parque. Graças ao Dr. Carlos e a estrutura de UTI, a cirurgia foi um sucesso absoluto. Ele já voltou a correr e brincar feliz!"
    },
    {
      imagem: "/mia-persian.jpg",
      paciente: "Mia (Gata Persa)",
      procedimento: "Tratamento Dermatológico Intensivo",
      depoimento: "A Mia estava sofrendo com alergias há meses. A Dra. Beatriz identificou a causa nutricional e com o novo protocolo, os pelos voltaram a crescer perfeitos. O ambiente Cat Friendly ajudou muito."
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Histórias de Recuperação e Amor</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Momentos em que a tecnologia, a ciência e o afeto salvaram vidas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cases.map((c, i) => (
          <div key={i} className={`rounded-2xl overflow-hidden border flex flex-col group ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)]' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="relative h-64 md:h-80 overflow-hidden bg-black/50 flex items-center justify-center">
              <img src={c.imagem} alt={c.procedimento} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/20">
                Alta Médica
              </div>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-orange-500'} fill-current`} />
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-orange-500'} fill-current`} />
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-orange-500'} fill-current`} />
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-orange-500'} fill-current`} />
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-orange-500'} fill-current`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{c.procedimento}</h3>
                <p className={`text-sm italic mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>"{c.depoimento}"</p>
              </div>
              <div className={`mt-4 pt-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-[#ffffff1a]' : 'border-gray-100'}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-[#f59e0b]' : 'text-amber-600'}`}>Pet: {c.paciente}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
