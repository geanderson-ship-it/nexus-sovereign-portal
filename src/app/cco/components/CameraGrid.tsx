"use client";

import React from "react";
import { Camera, Maximize2 } from "lucide-react";
import type { ViewType } from "../page";

interface CameraGridProps {
  activeView: ViewType;
}

export function CameraGrid({ activeView }: CameraGridProps) {
  
  // Configure cameras based on active view
  const getCameras = () => {
    switch(activeView) {
      case 'ocorrencias':
        return [
          { id: "CAM-01", location: "Centro - Praça Principal", status: "Suspeito Detectado", alert: true },
          { id: "CAM-44", location: "Av. Industrial - Bloqueio", status: "Alerta Vermelho", alert: true },
          { id: "CAM-12", location: "Zona Sul - Banco", status: "Aglomeração Anômala", alert: true },
          { id: "CAM-09", location: "Rua 25 - Cruzamento", status: "Normal", alert: false },
        ];
      case 'denuncias':
        return [
          { id: "INTEL-01", location: "Servidor de Telefonia", status: "Filtrando Tráfego", alert: false },
          { id: "INTEL-02", location: "Análise de Voz (IA)", status: "Bloqueando Trote", alert: true },
          { id: "CAM-03", location: "QG - Central de Rádio", status: "Operando", alert: false },
          { id: "CAM-04", location: "QG - Despacho", status: "Normal", alert: false },
        ];
      case 'viaturas':
        return [
          { id: "LPR-01", location: "Acesso Norte (LPR)", status: "Lendo Placas", alert: false },
          { id: "LPR-02", location: "Acesso Sul (LPR)", status: "Viatura VTR-44 Detectada", alert: false, isPolice: true },
          { id: "CAM-18", location: "Perímetro Oeste", status: "Viatura VTR-02 em Patrulha", alert: false, isPolice: true },
          { id: "CAM-22", location: "Rotatória Central", status: "Normal", alert: false },
        ];
      case 'geral':
      default:
        return [
          { id: "CAM-01", location: "Centro - Praça Principal", status: "Detectando Anomalia", alert: true },
          { id: "CAM-02", location: "Av. Industrial - Entrada", status: "Normal", alert: false },
          { id: "CAM-03", location: "Zona Escolar - Perímetro", status: "Normal", alert: false },
          { id: "CAM-04", location: "Rotatória de Acesso - BR", status: "Análise de Veículos", alert: false },
        ];
    }
  };

  const cameras = getCameras();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-lg transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Camera className="text-slate-400" size={20} />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            {activeView === 'viaturas' ? 'Rastreio de Viaturas e LPR' : 
             activeView === 'denuncias' ? 'Monitoramento de Triagem' : 
             'Matriz de Monitoramento Tático'}
          </h2>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors">
          <Maximize2 size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 h-full">
        {cameras.map((cam, idx) => (
          <CameraFeed 
            key={idx} 
            id={cam.id} 
            location={cam.location} 
            status={cam.status} 
            isAlert={cam.alert} 
            isPolice={cam.isPolice}
          />
        ))}
      </div>
    </div>
  );
}

function CameraFeed({ id, location, status, isAlert = false, isPolice = false }: { id: string, location: string, status: string, isAlert?: boolean, isPolice?: boolean }) {
  return (
    <div className={`relative rounded-lg overflow-hidden border-2 bg-slate-950 flex flex-col justify-end group transition-all duration-500 ${isAlert ? 'border-red-500/50 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]' : isPolice ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-slate-800'}`}>
      {/* Simulated camera static/grid background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      
      {/* Simulated bounding boxes for AI */}
      {!isAlert && !isPolice && <div className="absolute top-1/4 left-1/3 w-20 h-20 border-2 border-green-500 opacity-50 transition-all"></div>}
      {isAlert && <div className="absolute top-1/2 right-1/4 w-32 h-24 border-2 border-red-500 animate-pulse transition-all"></div>}
      {isPolice && <div className="absolute top-1/3 left-1/4 w-40 h-20 border-2 border-blue-500 opacity-70 transition-all"></div>}
      
      <div className="absolute top-2 left-2 flex items-center space-x-2 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
        <div className={`w-2 h-2 rounded-full animate-ping ${isPolice ? 'bg-blue-500' : 'bg-red-500'}`}></div>
        <span className="text-[10px] font-mono font-bold text-white tracking-wider">REC</span>
      </div>
      
      <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
        AO VIVO
      </div>

      <div className={`relative z-10 w-full p-3 backdrop-blur-md border-t transition-colors ${isAlert ? 'bg-red-950/80 border-red-900/50' : isPolice ? 'bg-blue-950/80 border-blue-900/50' : 'bg-slate-900/80 border-slate-800'}`}>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs tracking-wider">{id}</span>
            <span className="text-slate-400 text-[10px] truncate max-w-[150px]">{location}</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isAlert ? 'text-red-400' : isPolice ? 'text-blue-400' : 'text-emerald-400'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
