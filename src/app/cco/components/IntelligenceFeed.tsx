"use client";

import React, { useEffect, useState } from "react";
import { Terminal, ShieldCheck, AlertTriangle, UserMinus, Car } from "lucide-react";
import type { ViewType } from "../page";

type LogEntry = {
  id: number;
  time: string;
  type: 'info' | 'alert' | 'block' | 'dispatch';
  message: string;
};

interface IntelligenceFeedProps {
  activeView: ViewType;
}

export function IntelligenceFeed({ activeView }: IntelligenceFeedProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, time: "09:41:02", type: "info", message: "IA Égide inicializada. Monitoramento ativo." },
  ]);

  useEffect(() => {
    // Simulate incoming AI logs based on active view
    const interval = setInterval(() => {
      let allowedTypes: ('info' | 'alert' | 'block' | 'dispatch')[] = [];
      
      switch(activeView) {
        case 'ocorrencias':
          allowedTypes = ['alert', 'alert', 'info']; // More alerts
          break;
        case 'denuncias':
          allowedTypes = ['block', 'block', 'info']; // More blocks/triages
          break;
        case 'viaturas':
          allowedTypes = ['dispatch', 'dispatch', 'info']; // More dispatches
          break;
        case 'geral':
        default:
          allowedTypes = ['info', 'alert', 'block', 'dispatch'];
          break;
      }

      const randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
      
      const messages = {
        info: [
          "Análise facial concluída: Nenhum mandado em aberto.", 
          "Placa KMN-9382 verificada - Situação Legal.", 
          "Padrão de tráfego normalizado na Av. Central.",
          "Câmera CAM-12 calibrada com sucesso."
        ],
        alert: [
          "Atenção: Aglomeração suspeita detectada (Cam-01).", 
          "Alerta: Veículo em alta velocidade na zona Sul.", 
          "Movimento anômalo próximo a escola municipal.",
          "Objeto abandonado detectado em praça pública."
        ],
        block: [
          "Trote filtrado: Padrão de voz infantil detectado na denúncia.", 
          "Alarme falso anulado: Queda de árvore confundida com invasão.", 
          "Chamada spam bloqueada (Número recorrente).",
          "Denúncia anônima rejeitada: Localização GPS incompatível."
        ],
        dispatch: [
          "VTR-44 despachada para averiguação. ETA: 2m.",
          "Rota LPR traçada para Viatura 02 (Tático).",
          "Viaturas redirecionadas devido a congestionamento.",
          "Telemetria VTR-18: Oficial com 112 BPM (Engajamento)."
        ]
      };
      
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('pt-BR'),
        type: randomType,
        message: messages[randomType][Math.floor(Math.random() * messages[randomType].length)]
      };

      setLogs(prev => [newLog, ...prev].slice(0, 15)); // Keep last 15
    }, 2500);

    return () => clearInterval(interval);
  }, [activeView]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full shadow-lg overflow-hidden transition-all">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center space-x-2">
        <Terminal className="text-blue-500" size={20} />
        <h2 className="text-sm font-bold text-white uppercase tracking-widest">
          {activeView === 'viaturas' ? 'Log de Despacho' : 
           activeView === 'denuncias' ? 'Log de Triagem (IA)' : 
           'Feed de Inteligência'}
        </h2>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar bg-black/20">
        {logs.map((log) => (
          <div key={log.id} className="flex space-x-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mt-0.5">
              {log.type === 'info' && <ShieldCheck size={16} className="text-blue-400" />}
              {log.type === 'alert' && <AlertTriangle size={16} className="text-yellow-400" />}
              {log.type === 'block' && <UserMinus size={16} className="text-red-400" />}
              {log.type === 'dispatch' && <Car size={16} className="text-emerald-400" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-500 mb-0.5">{log.time}</span>
              <span className={`text-xs font-mono font-medium ${
                log.type === 'info' ? 'text-slate-300' : 
                log.type === 'alert' ? 'text-yellow-300' : 
                log.type === 'dispatch' ? 'text-emerald-300' : 'text-red-300'
              }`}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
