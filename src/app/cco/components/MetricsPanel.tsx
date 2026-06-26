"use client";

import React from "react";
import { Activity, ShieldAlert, Zap, Lock } from "lucide-react";
import type { ViewType } from "../page";

interface MetricsPanelProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export function MetricsPanel({ activeView, setActiveView }: MetricsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <MetricCard 
        title="Ocorrências em Tempo Real" 
        value="124" 
        trend="+14% nas últimas 24h"
        icon={<Activity className="text-blue-400" size={24} />} 
        active={activeView === 'ocorrencias'}
        onClick={() => setActiveView('ocorrencias')}
        alert={activeView === 'ocorrencias'}
      />
      <MetricCard 
        title="Triagem de Denúncias (IA)" 
        value="89%" 
        trend="Trotes e Alarmes Filtrados"
        icon={<ShieldAlert className="text-red-400" size={24} />} 
        active={activeView === 'denuncias'}
        onClick={() => setActiveView('denuncias')}
      />
      <MetricCard 
        title="Viaturas em Patrulha" 
        value="42" 
        trend="3 a caminho de ocorrências"
        icon={<Zap className="text-yellow-400" size={24} />} 
        active={activeView === 'viaturas'}
        onClick={() => setActiveView('viaturas')}
      />
      <MetricCard 
        title="Soberania de Dados" 
        value="Seguro" 
        trend="Criptografia Militar Ativa"
        icon={<Lock className="text-emerald-400" size={24} />} 
        active={false}
        onClick={() => setActiveView('geral')}
      />
    </div>
  );
}

function MetricCard({ title, value, trend, icon, alert = false, active = false, onClick }: { title: string, value: string, trend: string, icon: React.ReactNode, alert?: boolean, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border bg-slate-900 shadow-lg relative overflow-hidden transition-all duration-300 ${
        active ? 'border-blue-500 bg-slate-800 scale-[1.02]' : alert ? 'border-red-500/50' : 'border-slate-800 hover:border-slate-600'
      }`}
    >
      {alert && !active && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full animate-pulse pointer-events-none"></div>
      )}
      {active && (
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>
      )}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-blue-400' : 'text-slate-400'}`}>{title}</h3>
        <div className="p-2 rounded-lg bg-slate-800/50">
          {icon}
        </div>
      </div>
      <div className="flex flex-col relative z-10">
        <span className={`text-3xl font-black tracking-tight ${alert && !active ? 'text-red-400' : 'text-white'}`}>{value}</span>
        <span className="text-xs text-slate-500 mt-1 font-medium">{trend}</span>
      </div>
    </button>
  );
}
