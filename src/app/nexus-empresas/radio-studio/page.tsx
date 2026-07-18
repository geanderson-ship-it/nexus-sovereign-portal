"use client";

import { Mic, Radio, Play, Settings, ListMusic, Volume2, Mic2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function RadioStudioDashboard() {
  return (
    <div className="min-h-screen bg-[#050a11] text-gray-100 flex flex-col overflow-hidden relative">
      {/* Grid de fundo */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
      
      {/* Header do Estúdio */}
      <header className="h-16 border-b border-cyan-500/20 bg-[#0b121e]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_30px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Radio className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
              Nexus <span className="text-cyan-400">Automatizer</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-semibold -mt-1">Broadcast Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase">No Ar</span>
          </div>
          <button className="text-gray-400 hover:text-cyan-400 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Área Principal de Mixagem e Grade */}
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Coluna Esquerda: Player e Controles (Span 3) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            {/* Player Principal */}
            <div className="bg-[#0b121e]/60 backdrop-blur-md border border-cyan-500/20 rounded-xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Deck A (Master)</h3>
                <Volume2 className="w-4 h-4 text-cyan-400" />
              </div>
              
              <div className="aspect-square bg-black/40 rounded-full border-4 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex items-center justify-center mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-transparent mix-blend-overlay"></div>
                <Mic2 className="w-16 h-16 text-cyan-500/30 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute w-full h-1 bg-cyan-500/50 top-1/2 -translate-y-1/2 blur-sm rotate-45"></div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white truncate">Nexus Morning Show</h2>
                <p className="text-xs text-cyan-400 mt-1">Vinheta de Entrada</p>
              </div>

              <div className="flex justify-center gap-4">
                <button className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/20 transition-all">
                  <div className="w-4 h-4 bg-cyan-400 rounded-sm"></div>
                </button>
                <button className="w-16 h-16 rounded-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center hover:scale-105 transition-all text-black pl-1">
                  <Play className="w-8 h-8 fill-current" />
                </button>
              </div>
            </div>

            {/* Módulos de Automação */}
            <div className="bg-[#0b121e]/60 backdrop-blur-md border border-white/5 rounded-xl p-4 flex-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Gatilhos Inteligentes</h3>
              <div className="space-y-2">
                <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between hover:border-cyan-500/30 transition-colors cursor-pointer">
                  <span className="text-sm font-medium text-gray-300">Hora Certa (IA)</span>
                  <div className="w-8 h-4 bg-cyan-500/20 rounded-full flex items-center px-0.5">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_5px_#00f0ff] ml-auto"></div>
                  </div>
                </div>
                <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between hover:border-cyan-500/30 transition-colors cursor-pointer">
                  <span className="text-sm font-medium text-gray-300">Temperatura Local</span>
                  <div className="w-8 h-4 bg-cyan-500/20 rounded-full flex items-center px-0.5">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_5px_#00f0ff] ml-auto"></div>
                  </div>
                </div>
                <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between hover:border-cyan-500/30 transition-colors cursor-pointer">
                  <span className="text-sm font-medium text-gray-300">Geração de Locução IA</span>
                  <div className="w-8 h-4 bg-white/10 rounded-full flex items-center px-0.5">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coluna Central e Direita: Grade de Programação (Span 9) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-9 bg-[#0b121e]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-cyan-400" />
                Grade de Programação (Playlist)
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md hover:bg-cyan-500/20 transition-all">
                  + Inserir Bloco Comercial
                </button>
                <button className="px-4 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md hover:bg-emerald-500/20 transition-all">
                  Gerar com IA
                </button>
              </div>
            </div>

            {/* Tabela da Playlist */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase bg-[#ffffff05] text-gray-300 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Horário</th>
                    <th className="px-4 py-3 w-8"></th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Título / Artista</th>
                    <th className="px-4 py-3">Duração</th>
                    <th className="px-4 py-3 rounded-tr-lg">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ffffff0a]">
                  {/* Item Tocando Agora */}
                  <tr className="bg-cyan-900/20 border-l-2 border-cyan-400">
                    <td className="px-4 py-4 font-bold text-cyan-400">08:00:00</td>
                    <td className="px-4 py-4"><Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /></td>
                    <td className="px-4 py-4"><span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold">VINHETA</span></td>
                    <td className="px-4 py-4 font-medium text-white">Nexus Morning Show - Abertura Oficial</td>
                    <td className="px-4 py-4 text-cyan-400 font-mono">00:45</td>
                    <td className="px-4 py-4"></td>
                  </tr>
                  
                  {/* Próximos Itens */}
                  <tr className="hover:bg-[#ffffff03] transition-colors group">
                    <td className="px-4 py-4 font-mono text-gray-500">08:00:45</td>
                    <td className="px-4 py-4"></td>
                    <td className="px-4 py-4"><span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">MÚSICA</span></td>
                    <td className="px-4 py-4 text-gray-300">U2 - Beautiful Day</td>
                    <td className="px-4 py-4 font-mono">04:06</td>
                    <td className="px-4 py-4"><Mic className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 cursor-pointer" /></td>
                  </tr>
                  
                  <tr className="hover:bg-[#ffffff03] transition-colors group">
                    <td className="px-4 py-4 font-mono text-gray-500">08:04:51</td>
                    <td className="px-4 py-4"></td>
                    <td className="px-4 py-4"><span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">COMERCIAL</span></td>
                    <td className="px-4 py-4 text-gray-300">Campanha Nexus B2B (Spot 30s)</td>
                    <td className="px-4 py-4 font-mono">00:30</td>
                    <td className="px-4 py-4"><Mic className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 cursor-pointer" /></td>
                  </tr>

                  <tr className="hover:bg-[#ffffff03] transition-colors group">
                    <td className="px-4 py-4 font-mono text-gray-500">08:05:21</td>
                    <td className="px-4 py-4"></td>
                    <td className="px-4 py-4"><span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">LOCUÇÃO IA</span></td>
                    <td className="px-4 py-4 text-gray-300 flex items-center gap-2">
                      Previsão do Tempo Dinâmica
                      <AlertCircle className="w-3 h-3 text-emerald-400" />
                    </td>
                    <td className="px-4 py-4 font-mono">00:15</td>
                    <td className="px-4 py-4"><Mic className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 cursor-pointer" /></td>
                  </tr>
                  
                  <tr className="hover:bg-[#ffffff03] transition-colors group">
                    <td className="px-4 py-4 font-mono text-gray-500">08:05:36</td>
                    <td className="px-4 py-4"></td>
                    <td className="px-4 py-4"><span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">MÚSICA</span></td>
                    <td className="px-4 py-4 text-gray-300">Coldplay - Viva La Vida</td>
                    <td className="px-4 py-4 font-mono">04:02</td>
                    <td className="px-4 py-4"><Mic className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 cursor-pointer" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Waveform Decorativo no rodapé da playlist */}
            <div className="h-12 mt-4 border-t border-white/5 pt-4 flex items-center justify-center gap-1 opacity-50">
              {[...Array(40)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [10, Math.random() * 30 + 10, 10] }}
                  transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                  className="w-1 bg-cyan-500/50 rounded-full"
                ></motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
