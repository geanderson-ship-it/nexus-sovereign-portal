"use client";

import React from "react";
import { Shield, LayoutDashboard, Video, FileText, Settings, Users, Activity, Bell } from "lucide-react";
import type { ViewType } from "../page";

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 font-sans">
      {/* Branding Section */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-10 h-10 text-blue-500" />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white tracking-wider">PROJETO ÉGIDE</span>
            <span className="text-xs text-blue-400 font-medium uppercase tracking-widest">Inteligência Tática</span>
          </div>
        </div>
        <div className="w-full h-px bg-slate-800 my-2"></div>
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Powered By</span>
          <span className="text-sm text-slate-400 font-bold tracking-widest">NEXUS HOLDING GROUP</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 mt-2">Muralha Digital</div>
        
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Visão Geral" 
          active={activeView === 'geral'} 
          onClick={() => setActiveView('geral')} 
        />
        <NavItem 
          icon={<Activity size={20} />} 
          label="Monitor de Ocorrências" 
          active={activeView === 'ocorrencias'} 
          onClick={() => setActiveView('ocorrencias')} 
        />
        <NavItem 
          icon={<Bell size={20} />} 
          label="Triagem de Denúncias" 
          active={activeView === 'denuncias'} 
          onClick={() => setActiveView('denuncias')} 
        />
        
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 mt-8">Operacional</div>
        
        <NavItem 
          icon={<Users size={20} />} 
          label="Despacho de Viaturas" 
          active={activeView === 'viaturas'} 
          onClick={() => setActiveView('viaturas')} 
        />
        <NavItem 
          icon={<Video size={20} />} 
          label="Matriz de Câmeras" 
          active={false} 
          onClick={() => {}} 
        />
        <NavItem 
          icon={<Settings size={20} />} 
          label="Configurações do CCO" 
          active={false} 
          onClick={() => {}} 
        />
      </nav>

      {/* Status Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Status do Servidor</span>
            <span className="text-sm font-semibold text-green-400">Conectado (Seguro)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${
        active 
          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" 
          : "hover:bg-slate-800 hover:text-white border border-transparent text-slate-300"
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
