"use client";

import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { MetricsPanel } from "./components/MetricsPanel";
import { CameraGrid } from "./components/CameraGrid";
import { IntelligenceFeed } from "./components/IntelligenceFeed";

export type ViewType = 'geral' | 'ocorrencias' | 'denuncias' | 'viaturas';

export default function CCODashboard() {
  const [activeView, setActiveView] = useState<ViewType>('geral');

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-slate-200">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar Simulation */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">Transmissão Criptografada (Nível 4)</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-slate-500">
              Sessão Ativa - Comandante G. Schuh
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold text-white">GS</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <MetricsPanel activeView={activeView} setActiveView={setActiveView} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
            <div className="lg:col-span-2">
              <CameraGrid activeView={activeView} />
            </div>
            <div className="lg:col-span-1">
              <IntelligenceFeed activeView={activeView} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
