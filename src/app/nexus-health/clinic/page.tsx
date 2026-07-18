"use client";

import { useState, useRef, useEffect } from "react";
import { Activity, Calendar, Users, TrendingUp, Bell, Search, Menu, DollarSign, ExternalLink, ChevronDown, Settings, FileText, HeartPulse, LogOut, Sun, Moon, Lock, Star } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NexusClinicDashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Por padrão, a aba pública do cliente
  const [activeTab, setActiveTab] = useState("especialidades");
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

  // Removido lógicas de autenticação locais

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050a11] text-gray-100' : 'bg-gray-50 text-gray-900'} flex overflow-hidden transition-colors duration-500`}>
      {/* Sidebar - Portal do Cliente */}
      <aside className={`w-64 border-r ${theme === 'dark' ? 'border-[#ffffff0a] bg-[rgba(11,18,30,0.5)]' : 'border-gray-200 bg-white'} backdrop-blur-md hidden md:flex flex-col transition-colors duration-500`}>
        <div className={`h-16 flex items-center px-6 border-b ${theme === 'dark' ? 'border-[#ffffff0a]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#00f0ff]" />
            <span className="font-bold text-lg tracking-tight">Nexus Clinic</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="mt-8 px-4 w-full max-w-[280px]">
            <Link href="/nexus-health/clinic/agendar" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#00ffaa]/10 border border-[#00ffaa]/30 text-[#00ffaa] hover:bg-[#00ffaa]/20 transition-colors w-full group shadow-[0_0_15px_rgba(0,255,170,0.1)]">
              <span className="text-xs font-bold uppercase tracking-wider">Agendar Consulta</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center mt-2 px-2 italic`}>Falar com a Atendente Virtual</p>
          </div>
          
          <button onClick={() => setActiveTab('especialidades')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'especialidades' ? 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]' : (theme === 'dark' ? 'text-gray-400 hover:bg-[#ffffff05] hover:text-white' : 'text-gray-600 hover:bg-gray-100')}`}>
            <HeartPulse className="w-5 h-5" />
            <span className="font-medium text-sm">Especialidades</span>
          </button>
          <button onClick={() => setActiveTab('corpo-clinico')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'corpo-clinico' ? 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]' : (theme === 'dark' ? 'text-gray-400 hover:bg-[#ffffff05] hover:text-white' : 'text-gray-600 hover:bg-gray-100')}`}>
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Corpo Clínico</span>
          </button>
          <button onClick={() => setActiveTab('resultados')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'resultados' ? 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]' : (theme === 'dark' ? 'text-gray-400 hover:bg-[#ffffff05] hover:text-white' : 'text-gray-600 hover:bg-gray-100')}`}>
            <Star className="w-5 h-5" />
            <span className="font-medium text-sm">Cases de Sucesso</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-y-auto custom-scrollbar">
        <div className={`absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none ${theme === 'light' ? 'invert opacity-[0.05]' : ''}`}></div>
        
        {/* Luzes Laranjas (Estilo Exclusive) no Fundo */}
        <div className={`fixed top-[-10%] right-[-5%] w-[800px] h-[800px] bg-orange-500/40 rounded-full blur-[150px] pointer-events-none ${theme === 'dark' ? 'mix-blend-screen opacity-70' : 'mix-blend-multiply opacity-60'} z-0`}></div>
        <div className={`fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-600/30 rounded-full blur-[120px] pointer-events-none ${theme === 'dark' ? 'mix-blend-screen opacity-60' : 'mix-blend-multiply opacity-50'} z-0`}></div>
        
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
                placeholder="Buscar procedimentos ou médicos..." 
                className={`pl-9 pr-4 py-1.5 rounded-lg text-sm transition-all focus:outline-none focus:border-[#00f0ff] w-72 ${theme === 'dark' ? 'bg-[#00000033] border-[#ffffff1a] text-white placeholder:text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            
            {/* Link para Acesso do Especialista */}
            <Link 
              href="/nexus-health/clinic/login"
              className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-colors border border-transparent ${theme === 'dark' ? 'hover:bg-white/5 hover:border-white/10' : 'hover:bg-gray-100 hover:border-gray-200'}`}
              title="Acesso Restrito para Médicos"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#111827] text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                <Lock className="w-4 h-4" />
              </div>
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Acesso Médico</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Content Area */}
        {activeTab === 'especialidades' && <EspecialidadesView theme={theme} onSelectEspec={setSelectedEspec} />}
        {activeTab === 'corpo-clinico' && <CorpoClinicoView theme={theme} onSelectProf={setSelectedProf} />}
        {activeTab === 'resultados' && <ResultadosView theme={theme} />}

        {/* Modal de Detalhes do Médico (No nível root do Main para cobrir o header) */}
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
                {/* Lado da Imagem (Maior) */}
                <div className={`md:w-2/5 flex flex-col justify-end min-h-[300px] relative ${theme === 'dark' ? 'bg-[#050a11]' : 'bg-gray-50'}`}>
                  {selectedProf.imagem && (
                    <img src={selectedProf.imagem} alt={selectedProf.nome} className="absolute inset-0 w-full h-full object-cover object-top scale-[1.1] mt-4" />
                  )}
                  {/* Gradiente sutil em cima da foto pra não cortar seco */}
                  <div className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${theme === 'dark' ? 'from-[#0b121e]' : 'from-white'} to-transparent z-10 md:hidden`} />
                </div>

                {/* Detalhes do Médico */}
                <div className="md:w-3/5 p-8 relative z-20">
                  <button 
                    onClick={() => setSelectedProf(null)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    ✕
                  </button>
                  
                  <h2 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedProf.nome}</h2>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-[#00f0ff]' : 'text-blue-600'}`}>{selectedProf.cargo}</p>
                  <div className="inline-block px-3 py-1 mb-6 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-500">
                    {selectedProf.especialidade} • {selectedProf.registro}
                  </div>
                  
                  <h4 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Formação e Experiência</h4>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedProf.formacao}
                  </p>

                  <div className="mt-8 pt-6 border-t border-gray-500/20">
                    <Link href="/nexus-health/clinic/agendar" className="w-full flex justify-center py-3 rounded-xl font-bold text-sm bg-[#00ffaa] text-black shadow-[0_0_20px_rgba(0,255,170,0.3)] hover:bg-[#00ffaa]/90 transition-all">
                      Agendar Consulta com {selectedProf.nome.split(" ")[1] || selectedProf.nome.split(" ")[0]}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Detalhes da Especialidade */}
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
                className={`max-w-xl w-full rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#0b121e] border border-white/10 shadow-[0_0_50px_rgba(255,170,0,0.15)]' : 'bg-white shadow-2xl'}`}
              >
                <div className="p-8 relative z-20">
                  <button 
                    onClick={() => setSelectedEspec(null)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    ✕
                  </button>
                  
                  <div className="inline-block px-3 py-1 mb-4 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-500">
                    {selectedEspec.cat}
                  </div>
                  
                  <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedEspec.nome}</h2>
                  <p className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-[#ffaa00]' : 'text-orange-600'}`}>{selectedEspec.desc}</p>
                  
                  <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-orange-50 border border-orange-100'}`}>
                    <h4 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>O que é e Benefícios</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedEspec.detalhes}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Investimento a partir de:</span>
                    <span className={`text-xl font-bold ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'}`}>{selectedEspec.preco}</span>
                  </div>

                  <Link href="/nexus-health/clinic/agendar" className="w-full flex justify-center py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#ffaa00] to-[#ff5500] text-white shadow-[0_0_20px_rgba(255,170,0,0.3)] hover:opacity-90 transition-all">
                    Quero Agendar {selectedEspec.nome.split(" ")[0]}
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

function EspecialidadesView({ theme, onSelectEspec }: { theme: string, onSelectEspec: (e: any) => void }) {
  const procedimentos = [
    { nome: "Toxina Botulínica", desc: "Suaviza linhas de expressão com naturalidade", preco: "R$ 350", cat: "Injetáveis", detalhes: "O procedimento mais procurado do mundo. A aplicação relaxa a musculatura específica, prevenindo e tratando rugas dinâmicas na testa, glabela e ao redor dos olhos. O resultado é um rosto mais descansado, jovem e natural em poucos dias." },
    { nome: "Bioestimulador de Colágeno", desc: "Radiesse — revitaliza e tensiona a pele", preco: "R$ 850", cat: "Injetáveis", detalhes: "Tratamento profundo que estimula a produção do seu próprio colágeno. Traz de volta a firmeza, melhora o contorno facial e trata a flacidez de forma progressiva e duradoura. Efeito glow imediato e pele renovada ao longo dos meses." },
    { nome: "Preenchimento Labial", desc: "Volume e definição com resultado natural", preco: "R$ 450", cat: "Injetáveis", detalhes: "Utilizamos ácido hialurônico de alta tecnologia para desenhar, hidratar ou dar volume aos lábios. Respeitamos a anatomia e a proporção de cada rosto para entregar lábios sensuais, harmônicos e muito hidratados." },
    { nome: "Limpeza de Pele Premium", desc: "Protocolo completo com hidratação profunda", preco: "R$ 180", cat: "Estética Facial", detalhes: "Uma experiência de renovação. Inclui assepsia, esfoliação ultrassônica, extração sem dor, máscara calmante de safira e finalização com LED terapia. Sua pele livre de impurezas, macia e radiante." },
    { nome: "Peeling Químico", desc: "Renovação celular e uniformização do tom", preco: "R$ 250", cat: "Estética Facial", detalhes: "Aplicação de ácidos clareadores para remover a camada superficial danificada da pele. Excelente para tratar manchas, cicatrizes de acne, melasma e poros dilatados. Devolve o viço e a textura de pele de bebê." },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Especialidades e Procedimentos</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Conheça os serviços oferecidos pela nossa clínica.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {procedimentos.map((p, i) => (
          <div 
            key={i} 
            onClick={() => onSelectEspec(p)}
            className={`p-5 rounded-xl border transition-all hover:scale-[1.03] cursor-pointer relative group overflow-hidden ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff0a] hover:border-orange-500/30' : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-orange-400'}`}
          >
            {/* Brilho hover sutil */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/0 via-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="inline-block px-2 py-1 rounded-md text-[10px] font-bold mb-3 uppercase tracking-wider bg-purple-500/10 text-purple-500">
              {p.cat}
            </div>
            <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{p.nome}</h3>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{p.desc}</p>
            <div className="flex items-center justify-between border-t border-[#ffffff0a] pt-3 mt-auto">
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'}`}>{p.preco}</span>
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
      nome: "Dr. Rafael",
      cargo: "Médico Dermatologista", 
      registro: "CRM 12345", 
      especialidade: "Harmonização Facial",
      imagem: "/dr-rafael.png",
      formacao: "Formado pela USP com residência médica no Hospital das Clínicas. Especialista em técnicas avançadas de harmonização facial e preenchimentos com ácido hialurônico de alta tecnologia. Membro da Sociedade Brasileira de Dermatologia."
    },
    { 
      nome: "Dra. Camila", 
      cargo: "Esteticista Especializada", 
      registro: "CRBM 6789", 
      especialidade: "Estética Avançada",
      imagem: "/dra-camila.png",
      formacao: "Especialista em cosmetologia avançada e procedimentos estéticos inovadores pela Universidade de Paris. Com mais de 10 anos de experiência em tratamentos corporais e faciais de alto padrão, garantindo resultados naturais e sofisticados."
    },
    { 
      nome: "Dra. Ana", 
      cargo: "Biomédica", 
      registro: "CRBM 1011", 
      especialidade: "Injetáveis e Bioestimuladores",
      imagem: "/dra-ana.png",
      formacao: "Biomédica esteta graduada pela UNICAMP, com pós-graduação em Saúde Estética Avançada. Especialista em bioestimuladores de colágeno, toxina botulínica e fios de PDO, unindo ciência e arte para realçar a beleza natural."
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Corpo Clínico</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Especialistas que cuidam de você na Clínica da Beleza.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profissionais.map((prof, i) => (
          <div 
            key={i} 
            onClick={() => onSelectProf(prof)}
            className={`cursor-pointer flex flex-col items-center text-center p-6 rounded-xl border ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)] hover:bg-[#ffffff05]' : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1'} transition-all`}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#00ffaa] p-[3px] mb-5 shadow-[0_0_20px_rgba(0,255,170,0.2)] hover:scale-105 transition-transform">
              <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-[#0b121e]' : 'bg-white'}`}>
                {prof.imagem ? (
                  <img src={prof.imagem} alt={prof.nome} className="w-full h-full object-cover object-top scale-[1.2] mt-2 pointer-events-none" />
                ) : (
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{prof.nome.charAt(0)}</span>
                )}
              </div>
            </div>
            <h3 className={`font-bold text-xl mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{prof.nome}</h3>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#00f0ff]' : 'text-blue-600'} mb-1`}>{prof.cargo}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-3`}>{prof.especialidade} • {prof.registro}</p>
            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>Ver Perfil</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DashboardView({ theme }: { theme: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-8">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Visão Geral da Clínica</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Métricas de hoje geradas em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 border-t border-t-[#00f0ff] ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)]' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <div className={`text-sm font-medium mb-2 flex items-center justify-between ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Consultas Hoje
            <Calendar className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>24</div>
          <div className="text-xs text-[#00ffaa] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% vs Ontem
          </div>
        </div>

        <div className={`rounded-xl p-6 border-t border-t-[#00ffaa] ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)]' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <div className={`text-sm font-medium mb-2 flex items-center justify-between ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Pacientes Retidos (IA)
            <Users className="w-4 h-4 text-[#00ffaa]" />
          </div>
          <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>8</div>
          <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Agendados via assistente Evolution
          </div>
        </div>

        <div className={`rounded-xl p-6 border-t border-t-[#ff00a0] ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)]' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <div className={`text-sm font-medium mb-2 flex items-center justify-between ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Faturamento Previsto
            <Activity className="w-4 h-4 text-[#ff00a0]" />
          </div>
          <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ 4.250</div>
          <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Baseado em procedimentos marcados
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)]' : 'bg-white border border-gray-200 shadow-sm'}`}>
        <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Próximos Pacientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase ${theme === 'dark' ? 'bg-[#ffffff05] text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Horário</th>
                <th className="px-4 py-3">Paciente</th>
                <th className="px-4 py-3">Procedimento</th>
                <th className="px-4 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#ffffff0a] text-gray-400' : 'divide-gray-100 text-gray-600'}`}>
              <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-[#ffffff03]' : 'hover:bg-gray-50'}`}>
                <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>09:00</td>
                <td className="px-4 py-3">Mariana Costa</td>
                <td className="px-4 py-3">Avaliação Estética</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#00ffaa]/20 text-[#00ffaa]">CONFIRMADO</span></td>
              </tr>
              <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-[#ffffff03]' : 'hover:bg-gray-50'}`}>
                <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>10:30</td>
                <td className="px-4 py-3">Carlos Eduardo</td>
                <td className="px-4 py-3">Retorno Médico</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#00f0ff]/20 text-[#00f0ff]">SALA DE ESPERA</span></td>
              </tr>
              <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-[#ffffff03]' : 'hover:bg-gray-50'}`}>
                <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>11:15</td>
                <td className="px-4 py-3">Aline Silva</td>
                <td className="px-4 py-3">Consulta Inicial</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#ffb700]/20 text-[#ffb700]">AGUARDANDO WHATSAPP</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function ResultadosView({ theme }: { theme: string }) {
  const cases = [
    {
      imagem: "/case_1.jpg",
      paciente: "Isabela R.",
      procedimento: "Protocolo Rejuvenescimento",
      depoimento: "Minha pele estava opaca e com marcas de cansaço. Após o tratamento, eu recuperei o brilho e a firmeza. Sinto-me 10 anos mais jovem!"
    },
    {
      imagem: "/case_2.jpg",
      paciente: "Camila T.",
      procedimento: "Preenchimento Labial e Bioestimulador",
      depoimento: "Amei o resultado super natural dos lábios e o viço que minha pele ganhou. A clínica é um luxo e o atendimento é impecável."
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cases de Sucesso</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Resultados reais das nossas clientes. O seu Antes e Depois dos sonhos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cases.map((c, i) => (
          <div key={i} className={`rounded-2xl overflow-hidden border flex flex-col group ${theme === 'dark' ? 'bg-[rgba(11,18,30,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.08)]' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img src={c.imagem} alt={c.procedimento} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/20">
                Resultado Real
              </div>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#ffaa00]' : 'text-orange-500'} fill-current`} />
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#ffaa00]' : 'text-orange-500'} fill-current`} />
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#ffaa00]' : 'text-orange-500'} fill-current`} />
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#ffaa00]' : 'text-orange-500'} fill-current`} />
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-[#ffaa00]' : 'text-orange-500'} fill-current`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{c.procedimento}</h3>
                <p className={`text-sm italic mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>"{c.depoimento}"</p>
              </div>
              <div className={`mt-4 pt-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-[#ffffff1a]' : 'border-gray-100'}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-[#00ffaa]' : 'text-emerald-600'}`}>Paciente: {c.paciente}</span>
                <Link href="/nexus-health/clinic/agendar" className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'bg-[#ffaa00]/10 text-[#ffaa00] hover:bg-[#ffaa00]/20' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}>
                  Eu Quero
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
