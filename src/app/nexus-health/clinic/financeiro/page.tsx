"use client";

import { useState } from "react";
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle2, Clock, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const procedimentos = [
  { nome: "Toxina Botulínica", qtd: 12, valor: "R$ 5.400", cor: "#00f0ff" },
  { nome: "Bioestimulador (Radiesse)", qtd: 5, valor: "R$ 4.250", cor: "#00ffaa" },
  { nome: "Consulta Inicial", qtd: 18, valor: "R$ 3.600", cor: "#ff00a0" },
  { nome: "Preenchimento Labial", qtd: 7, valor: "R$ 3.150", cor: "#ffb700" },
];

const lancamentos = [
  { descricao: "Mariana Costa – Botox Frontal", data: "Hoje", valor: "+R$ 450", tipo: "entrada" },
  { descricao: "Aline Silva – Consulta Inicial", data: "Hoje", valor: "+R$ 200", tipo: "entrada" },
  { descricao: "Carlos Eduardo – Retorno", data: "Hoje", valor: "+R$ 150", tipo: "entrada" },
  { descricao: "Repasse Dr. Thiago Silva", data: "17/07", valor: "-R$ 2.100", tipo: "saida" },
  { descricao: "Roberta Alves – Cancelou (Estorno)", data: "16/07", valor: "-R$ 450", tipo: "saida" },
  { descricao: "Juliana Castro – Preenchimento", data: "15/07", valor: "+R$ 650", tipo: "entrada" },
];

const inadimplentes = [
  { nome: "Pedro Alves", valor: "R$ 450", dias: "15 dias" },
  { nome: "Fernanda Duarte", valor: "R$ 200", dias: "32 dias" },
];

export default function ClinicFinanceiroPage() {
  const [periodo, setPeriodo] = useState("mes");

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
            <DollarSign className="w-5 h-5 text-[#00ffaa]" />
            <h1 className="font-bold text-lg text-white">Financeiro da Clínica</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#00000033] border border-[#ffffff1a] rounded-lg p-1">
          {["dia", "semana", "mes", "ano"].map(p => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1 text-xs font-bold rounded-md uppercase transition-all ${periodo === p ? "bg-[#00ffaa] text-black" : "text-gray-400 hover:text-white"}`}
            >
              {p === "mes" ? "Mês" : p === "dia" ? "Dia" : p === "semana" ? "Semana" : "Ano"}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto relative z-10 space-y-6 overflow-y-auto custom-scrollbar">

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Receita Bruta (Mês)", valor: "R$ 16.400", delta: "+18%", deltaPos: true, icon: TrendingUp, cor: "#00ffaa" },
            { label: "Ticket Médio", valor: "R$ 342", delta: "+7%", deltaPos: true, icon: BarChart3, cor: "#00f0ff" },
            { label: "Repasses Médicos", valor: "R$ 4.920", delta: "30% da receita", deltaPos: null, icon: DollarSign, cor: "#ffb700" },
            { label: "Inadimplência", valor: "R$ 650", delta: "2 pacientes", deltaPos: false, icon: AlertCircle, cor: "#ff4444" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-5"
              style={{ borderTopColor: `${kpi.cor}44`, borderTopWidth: 2 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-gray-400">{kpi.label}</span>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.cor }} />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{kpi.valor}</div>
              <div className={`text-xs font-semibold flex items-center gap-1 ${kpi.deltaPos === true ? "text-[#00ffaa]" : kpi.deltaPos === false ? "text-red-400" : "text-gray-500"}`}>
                {kpi.deltaPos === true && <ArrowUpRight className="w-3 h-3" />}
                {kpi.deltaPos === false && <ArrowDownRight className="w-3 h-3" />}
                {kpi.delta}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Grid Central */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Receita por Procedimento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-1 bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-6"
          >
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00f0ff]" /> Receita por Procedimento
            </h2>
            <div className="space-y-4">
              {procedimentos.map((proc) => (
                <div key={proc.nome}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{proc.nome}</span>
                    <span className="font-bold text-white">{proc.valor}</span>
                  </div>
                  <div className="w-full h-2 bg-[#ffffff0a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(proc.qtd / 18) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: proc.cor, boxShadow: `0 0 8px ${proc.cor}44` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{proc.qtd} procedimentos</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Lançamentos Recentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="xl:col-span-2 bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl p-6"
          >
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00ffaa]" /> Últimos Lançamentos
            </h2>
            <div className="space-y-2">
              {lancamentos.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-[#ffffff05] transition-colors border border-transparent hover:border-[#ffffff08]">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_5px] ${l.tipo === "entrada" ? "bg-[#00ffaa] shadow-[#00ffaa]" : "bg-red-400 shadow-red-400"}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{l.descricao}</p>
                      <p className="text-[10px] text-gray-500">{l.data}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${l.tipo === "entrada" ? "text-[#00ffaa]" : "text-red-400"}`}>
                    {l.valor}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Inadimplência e Alertas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[rgba(11,18,30,0.6)] backdrop-blur-md border border-red-500/20 rounded-xl p-6"
        >
          <h2 className="font-bold text-white mb-5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" /> 
            Inadimplência Ativa
            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full">{inadimplentes.length} pacientes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inadimplentes.map((pac, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <div>
                  <p className="text-sm font-bold text-white">{pac.nome}</p>
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Em aberto há {pac.dias}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-red-400">{pac.valor}</p>
                  <button className="text-[10px] font-bold text-red-300 hover:text-white transition-colors uppercase tracking-wider mt-1">
                    Enviar Cobrança WhatsApp →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
